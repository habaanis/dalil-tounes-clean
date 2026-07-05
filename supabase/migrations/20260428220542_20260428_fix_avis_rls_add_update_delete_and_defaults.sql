/*
  # Fix avis_entreprise — RLS complet + DEFAULT status

  1. Changements
    - Force DEFAULT 'pending' sur la colonne status (déjà présent, on s'assure)
    - Ajoute politique UPDATE : seul le rôle service_role (admin) peut modifier le status
    - Ajoute politique DELETE : seul le rôle service_role (admin) peut supprimer
    - La politique INSERT publique existante est conservée (WITH CHECK status = 'pending')

  2. Sécurité
    - Tout le monde peut déposer un avis (INSERT) mais uniquement avec status='pending'
    - Seul l'admin (service_role) peut approuver, rejeter ou supprimer
    - Les SELECT publics ne voient que les avis approuvés
*/

-- S'assurer que le DEFAULT est bien 'pending'
ALTER TABLE avis_entreprise
  ALTER COLUMN status SET DEFAULT 'pending';

-- Supprimer les anciennes politiques UPDATE/DELETE si elles existent
DROP POLICY IF EXISTS "Admin can update avis status" ON avis_entreprise;
DROP POLICY IF EXISTS "Admin can delete avis" ON avis_entreprise;

-- Politique UPDATE : service_role uniquement
CREATE POLICY "Admin can update avis status"
  ON avis_entreprise
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Politique DELETE : service_role uniquement
CREATE POLICY "Admin can delete avis"
  ON avis_entreprise
  FOR DELETE
  TO service_role
  USING (true);
