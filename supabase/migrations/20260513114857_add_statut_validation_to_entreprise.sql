/*
  # Add statut_validation column to entreprise

  1. Changes
    - Add `statut_validation` column to `entreprise` table (text, default 'brouillon')
    - Used by the frontend to set <meta name="robots" content="noindex"> when value is not 'publié'

  2. Security
    - No RLS changes; existing policies on entreprise continue to apply.

  3. Notes
    - Default is 'brouillon' so newly created records are not indexed by Google until explicitly published.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entreprise' AND column_name = 'statut_validation'
  ) THEN
    ALTER TABLE entreprise ADD COLUMN statut_validation text DEFAULT 'brouillon';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_entreprise_statut_validation ON entreprise (statut_validation);
