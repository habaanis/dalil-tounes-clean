/*
  # Création de la table avis_entreprise avec modération

  ## Résumé
  La table avis_entreprise n'existait pas en production.
  Cette migration la crée avec un système de modération intégré (colonne status).

  ## Nouvelle table : avis_entreprise
  - `id` : identifiant unique (uuid)
  - `entreprise_id` : référence à l'entreprise (text, car l'id peut être numérique ou slug)
  - `note` : note de 1 à 5 (integer)
  - `commentaire` : texte de l'avis
  - `auteur` : nom affiché de l'auteur (optionnel)
  - `auteur_email` : email de l'auteur pour contact (optionnel)
  - `status` : état de modération — 'pending' | 'approved' | 'rejected' (défaut: 'pending')
  - `date` : date de soumission
  - `created_at` : timestamp automatique
  - `submission_lang` : langue utilisée lors de la soumission

  ## Sécurité (RLS)
  - SELECT : seuls les avis avec status='approved' sont visibles publiquement
  - INSERT : tout le monde peut soumettre (status forcé à 'pending')
  - UPDATE : réservé aux admins via service_role (modération backend)
*/

CREATE TABLE IF NOT EXISTS avis_entreprise (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise_id  text NOT NULL,
  note           integer NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire    text NOT NULL DEFAULT '',
  auteur         text NOT NULL DEFAULT '',
  auteur_email   text NOT NULL DEFAULT '',
  status         text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  date           timestamptz NOT NULL DEFAULT now(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  submission_lang text NOT NULL DEFAULT 'fr'
);

-- Index de performance
CREATE INDEX IF NOT EXISTS idx_avis_entreprise_entreprise_id
  ON avis_entreprise(entreprise_id);

CREATE INDEX IF NOT EXISTS idx_avis_entreprise_status
  ON avis_entreprise(status);

CREATE INDEX IF NOT EXISTS idx_avis_entreprise_entreprise_status
  ON avis_entreprise(entreprise_id, status);

-- Activer RLS
ALTER TABLE avis_entreprise ENABLE ROW LEVEL SECURITY;

-- SELECT : uniquement les avis approuvés sont visibles du public
CREATE POLICY "Approved avis visible to all"
  ON avis_entreprise FOR SELECT
  USING (status = 'approved');

-- INSERT : tout utilisateur peut soumettre un avis (il sera en pending)
CREATE POLICY "Anyone can submit avis"
  ON avis_entreprise FOR INSERT
  WITH CHECK (status = 'pending');
