/*
  # Add Arabic translation columns to entreprise table

  1. Changes
    - `entreprise`: add `name_ar` (text, nullable) — Arabic name of the business
    - `entreprise`: add `description_ar` (text, nullable) — Arabic description of the business

  2. Notes
    - Both columns are nullable (not all businesses will have Arabic content)
    - No default value needed — null means "no Arabic translation available"
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entreprise' AND column_name = 'name_ar'
  ) THEN
    ALTER TABLE entreprise ADD COLUMN name_ar text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entreprise' AND column_name = 'description_ar'
  ) THEN
    ALTER TABLE entreprise ADD COLUMN description_ar text;
  END IF;
END $$;
