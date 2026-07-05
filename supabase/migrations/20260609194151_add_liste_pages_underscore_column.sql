
-- Add liste_pages (underscore) column to match production schema
ALTER TABLE entreprise ADD COLUMN IF NOT EXISTS liste_pages text[];

-- Copy existing data from "liste pages" (space) to liste_pages (underscore) if any exists
UPDATE entreprise SET liste_pages = "liste pages" WHERE "liste pages" IS NOT NULL AND liste_pages IS NULL;

-- Create index for efficient array containment queries
CREATE INDEX IF NOT EXISTS idx_entreprise_liste_pages ON entreprise USING GIN (liste_pages);
