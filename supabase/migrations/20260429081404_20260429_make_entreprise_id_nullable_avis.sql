/*
  # Rendre entreprise_id nullable dans avis_entreprise

  1. Contexte
    - La page d'accueil affiche des avis "généraux sur le site" (sans entreprise rattachée)
    - Les pages artisans affichent les avis liés à leur entreprise_id
    - Une seule table unifiée : avis_entreprise
    - entreprise_id = NULL  => avis général sur le site (Home)
    - entreprise_id = 'xxx' => avis sur l'entreprise xxx

  2. Changement
    - entreprise_id : NOT NULL -> NULL autorisé
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'avis_entreprise'
      AND column_name = 'entreprise_id'
      AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE avis_entreprise ALTER COLUMN entreprise_id DROP NOT NULL;
  END IF;
END $$;
