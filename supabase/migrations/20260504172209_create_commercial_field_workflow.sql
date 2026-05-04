/*
  # Infrastructure commerciaux de terrain (Sfax / Sousse)

  1. Nouvelles tables
    - `commerciaux`
      - `id` (uuid, pk) — lié à auth.users.id
      - `nom` (text) — nom affiché
      - `zone` (text) — Sfax, Sousse, Tunis...
      - `actif` (bool)
      - `created_at` (timestamptz)
    - `encaissements_cash`
      - `id` (uuid, pk)
      - `commercial_id` (uuid, fk -> commerciaux)
      - `entreprise_id` (uuid, fk -> entreprise)
      - `tier` (text) — artisan/premium/elite
      - `montant` (numeric) — en TND
      - `recu_numero` (text) — numéro séquentiel lisible
      - `note` (text)
      - `verse` (bool) — true quand rattaché à un versement
      - `versement_id` (uuid, fk -> versements_commerciaux)
      - `created_at` (timestamptz)
    - `versements_commerciaux`
      - `id` (uuid, pk)
      - `commercial_id` (uuid, fk)
      - `montant` (numeric)
      - `methode` (text) — 'virement' ou 'd17'
      - `preuve_url` (text) — URL de la photo uploadée
      - `note` (text)
      - `statut` (text) — 'en_attente' | 'confirme'
      - `created_at` (timestamptz)

  2. Sécurité
    - RLS activé sur les 3 tables
    - Les commerciaux voient/écrivent UNIQUEMENT leurs propres données
      (via auth.uid() = commercial_id ou fk indirecte pour encaissements)
    - Les admins (rôle service_role) passent partout

  3. Notes
    - L'ajout automatique au "portefeuille" = somme(encaissements_cash où verse=false)
    - Quand un versement est confirmé, les encaissements associés passent verse=true
*/

CREATE TABLE IF NOT EXISTS commerciaux (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nom text NOT NULL DEFAULT '',
  zone text NOT NULL DEFAULT '',
  actif boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS versements_commerciaux (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commercial_id uuid NOT NULL REFERENCES commerciaux(id) ON DELETE CASCADE,
  montant numeric(10,3) NOT NULL DEFAULT 0,
  methode text NOT NULL DEFAULT 'virement',
  preuve_url text DEFAULT '',
  note text DEFAULT '',
  statut text NOT NULL DEFAULT 'en_attente',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS encaissements_cash (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commercial_id uuid NOT NULL REFERENCES commerciaux(id) ON DELETE CASCADE,
  entreprise_id uuid NOT NULL,
  tier text NOT NULL DEFAULT 'premium',
  montant numeric(10,3) NOT NULL DEFAULT 0,
  recu_numero text NOT NULL DEFAULT '',
  note text DEFAULT '',
  verse boolean NOT NULL DEFAULT false,
  versement_id uuid REFERENCES versements_commerciaux(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_encaissements_commercial ON encaissements_cash(commercial_id);
CREATE INDEX IF NOT EXISTS idx_encaissements_verse ON encaissements_cash(commercial_id, verse);
CREATE INDEX IF NOT EXISTS idx_versements_commercial ON versements_commerciaux(commercial_id, created_at DESC);

ALTER TABLE commerciaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE encaissements_cash ENABLE ROW LEVEL SECURITY;
ALTER TABLE versements_commerciaux ENABLE ROW LEVEL SECURITY;

-- commerciaux : un commercial voit sa propre fiche ; il peut la maj (nom/zone)
DROP POLICY IF EXISTS "Commercial voit sa fiche" ON commerciaux;
CREATE POLICY "Commercial voit sa fiche"
  ON commerciaux FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Commercial met a jour sa fiche" ON commerciaux;
CREATE POLICY "Commercial met a jour sa fiche"
  ON commerciaux FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- encaissements : le commercial voit/crée ses encaissements
DROP POLICY IF EXISTS "Commercial voit ses encaissements" ON encaissements_cash;
CREATE POLICY "Commercial voit ses encaissements"
  ON encaissements_cash FOR SELECT
  TO authenticated
  USING (auth.uid() = commercial_id);

DROP POLICY IF EXISTS "Commercial cree un encaissement" ON encaissements_cash;
CREATE POLICY "Commercial cree un encaissement"
  ON encaissements_cash FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = commercial_id);

DROP POLICY IF EXISTS "Commercial met a jour ses encaissements" ON encaissements_cash;
CREATE POLICY "Commercial met a jour ses encaissements"
  ON encaissements_cash FOR UPDATE
  TO authenticated
  USING (auth.uid() = commercial_id)
  WITH CHECK (auth.uid() = commercial_id);

-- versements
DROP POLICY IF EXISTS "Commercial voit ses versements" ON versements_commerciaux;
CREATE POLICY "Commercial voit ses versements"
  ON versements_commerciaux FOR SELECT
  TO authenticated
  USING (auth.uid() = commercial_id);

DROP POLICY IF EXISTS "Commercial cree un versement" ON versements_commerciaux;
CREATE POLICY "Commercial cree un versement"
  ON versements_commerciaux FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = commercial_id);

DROP POLICY IF EXISTS "Commercial met a jour ses versements" ON versements_commerciaux;
CREATE POLICY "Commercial met a jour ses versements"
  ON versements_commerciaux FOR UPDATE
  TO authenticated
  USING (auth.uid() = commercial_id)
  WITH CHECK (auth.uid() = commercial_id);

-- Bucket storage pour les preuves de versement (photos du reçu virement/D17)
INSERT INTO storage.buckets (id, name, public)
VALUES ('versements-preuves', 'versements-preuves', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Upload preuve versement auth" ON storage.objects;
CREATE POLICY "Upload preuve versement auth"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'versements-preuves');

DROP POLICY IF EXISTS "Lire preuves versement public" ON storage.objects;
CREATE POLICY "Lire preuves versement public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'versements-preuves');
