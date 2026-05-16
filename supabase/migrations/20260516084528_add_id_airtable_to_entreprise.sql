/*
  # Add id_airtable column to entreprise table

  1. Modified Tables
    - `entreprise`
      - Added `id_airtable` (text, unique) - Airtable record ID for sync/upsert

  2. Important Notes
    - This column is required for the sync-airtable Edge Function to upsert records
    - The unique constraint allows ON CONFLICT upsert behavior
    - Existing rows will have NULL id_airtable until synced
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entreprise' AND column_name = 'id_airtable' AND table_schema = 'public'
  ) THEN
    ALTER TABLE entreprise ADD COLUMN id_airtable text;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_entreprise_id_airtable
  ON entreprise (id_airtable)
  WHERE id_airtable IS NOT NULL;
