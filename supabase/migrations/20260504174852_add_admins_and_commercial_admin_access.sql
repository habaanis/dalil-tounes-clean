/*
  # Accès administrateur à l'espace commercial

  1. Nouvelle table
    - `admins`
      - `id` (uuid, pk) — référence auth.users
      - `email` (text)
      - `created_at` (timestamptz)

  2. Nouvelle fonction
    - `is_admin()` — retourne true si l'utilisateur courant est dans la table admins.

  3. Policies additionnelles
    - Les admins peuvent SELECT toutes les lignes de commerciaux, encaissements_cash, versements_commerciaux.
    - Les admins peuvent UPDATE versements_commerciaux (pour confirmer un versement reçu).

  4. Notes
    - Aucune donnée existante modifiée.
    - Pour activer un admin : INSERT INTO admins (id, email) VALUES (auth.users.id, email).
*/

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin voit sa fiche admin" ON admins;
CREATE POLICY "Admin voit sa fiche admin"
  ON admins FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE id = auth.uid());
$$;

GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Admins voient tous les commerciaux
DROP POLICY IF EXISTS "Admin voit tous les commerciaux" ON commerciaux;
CREATE POLICY "Admin voit tous les commerciaux"
  ON commerciaux FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins voient tous les encaissements
DROP POLICY IF EXISTS "Admin voit tous les encaissements" ON encaissements_cash;
CREATE POLICY "Admin voit tous les encaissements"
  ON encaissements_cash FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins voient tous les versements
DROP POLICY IF EXISTS "Admin voit tous les versements" ON versements_commerciaux;
CREATE POLICY "Admin voit tous les versements"
  ON versements_commerciaux FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins peuvent confirmer un versement
DROP POLICY IF EXISTS "Admin met a jour tous les versements" ON versements_commerciaux;
CREATE POLICY "Admin met a jour tous les versements"
  ON versements_commerciaux FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
