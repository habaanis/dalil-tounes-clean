/*
  # Add multilingual columns for name and description

  1. New Columns on `entreprise`
    - `name_en` (text, nullable) - English name
    - `name_it` (text, nullable) - Italian name
    - `name_ru` (text, nullable) - Russian name
    - `description_en` (text, nullable) - English description
    - `description_it` (text, nullable) - Italian description
    - `description_ru` (text, nullable) - Russian description

  2. Notes
    - `name_ar` and `description_ar` already exist
    - The French name uses the `nom` column and French description uses `description`
    - These columns follow the `name_{lang}` / `description_{lang}` naming convention
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entreprise' AND column_name = 'name_en'
  ) THEN
    ALTER TABLE entreprise ADD COLUMN name_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entreprise' AND column_name = 'name_it'
  ) THEN
    ALTER TABLE entreprise ADD COLUMN name_it text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entreprise' AND column_name = 'name_ru'
  ) THEN
    ALTER TABLE entreprise ADD COLUMN name_ru text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entreprise' AND column_name = 'description_en'
  ) THEN
    ALTER TABLE entreprise ADD COLUMN description_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entreprise' AND column_name = 'description_it'
  ) THEN
    ALTER TABLE entreprise ADD COLUMN description_it text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entreprise' AND column_name = 'description_ru'
  ) THEN
    ALTER TABLE entreprise ADD COLUMN description_ru text;
  END IF;
END $$;