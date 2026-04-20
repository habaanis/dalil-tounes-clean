/*
  # Add is_featured column to entreprise table

  1. Creates the entreprise table if it doesn't exist yet (dev environment stub)
  2. Adds is_featured boolean column (default false) safely
  3. Enables RLS with a public read policy
*/

CREATE TABLE IF NOT EXISTS entreprise (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE entreprise ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'entreprise' AND policyname = 'Public can read entreprise'
  ) THEN
    EXECUTE 'CREATE POLICY "Public can read entreprise" ON entreprise FOR SELECT TO anon, authenticated USING (true)';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'entreprise' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE entreprise ADD COLUMN is_featured BOOLEAN DEFAULT false;
  END IF;
END $$;
