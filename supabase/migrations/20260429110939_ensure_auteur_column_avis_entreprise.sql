/*
  # Assurer la présence de la colonne auteur sur avis_entreprise

  1. Vérification
    - Ajoute `auteur` (text) si la colonne n'existe pas déjà
  2. Notes
    - Migration idempotente, safe à rejouer
    - Aucune donnée existante n'est modifiée
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'avis_entreprise' AND column_name = 'auteur'
  ) THEN
    ALTER TABLE avis_entreprise ADD COLUMN auteur text DEFAULT '';
  END IF;
END $$;