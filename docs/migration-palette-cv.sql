-- Migration: Add palette_cv and modele_cv columns to entreprise and suggestions_entreprises
-- Status: PREPARED but NOT APPLIED to production
-- Purpose: Store CV Business palette and model choices
-- Compatibility: All columns are nullable — existing records keep their current appearance (palette NULL = prestige by default)

-- Add columns to entreprise table
ALTER TABLE entreprise
  ADD COLUMN IF NOT EXISTS palette_cv text,
  ADD COLUMN IF NOT EXISTS modele_cv text;

-- Add columns to suggestions_entreprises table
ALTER TABLE suggestions_entreprises
  ADD COLUMN IF NOT EXISTS palette_cv text,
  ADD COLUMN IF NOT EXISTS modele_cv text;

-- Comment for documentation
COMMENT ON COLUMN entreprise.palette_cv IS 'CV Business palette: prestige, ivory, or night. NULL = default by subscription tier.';
COMMENT ON COLUMN entreprise.modele_cv IS 'CV Business model: business or portfolio. NULL = business by default.';
COMMENT ON COLUMN suggestions_entreprises.palette_cv IS 'Palette chosen during subscription request: prestige, ivory, or night.';
COMMENT ON COLUMN suggestions_entreprises.modele_cv IS 'Model chosen during subscription request: business or portfolio.';
