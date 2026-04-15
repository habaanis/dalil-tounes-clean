/*
  # Add telephone2 and email2 to businesses table

  ## Changes
  - Adds `telephone2` (text, optional) — second phone number for a professional listing
  - Adds `email2` (text, optional) — second email address for a professional listing

  ## Notes
  - Both columns are nullable; no existing data is affected
  - No RLS policy changes needed — inherits existing policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'telephone2'
  ) THEN
    ALTER TABLE businesses ADD COLUMN telephone2 text DEFAULT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'email2'
  ) THEN
    ALTER TABLE businesses ADD COLUMN email2 text DEFAULT NULL;
  END IF;
END $$;
