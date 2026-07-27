-- Aligne le schéma versionné avec les champs utilisés par les formulaires publics.
ALTER TABLE public.suggestions_entreprises
  ADD COLUMN IF NOT EXISTS titre_demande text,
  ADD COLUMN IF NOT EXISTS telephone text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS message text,
  ADD COLUMN IF NOT EXISTS source_page text,
  ADD COLUMN IF NOT EXISTS langue text DEFAULT 'fr',
  ADD COLUMN IF NOT EXISTS priorite text DEFAULT 'Normale',
  ADD COLUMN IF NOT EXISTS synced_to_airtable boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS airtable_record_id text,
  ADD COLUMN IF NOT EXISTS synced_at timestamptz;

ALTER TABLE public.suggestions_entreprises
  DROP CONSTRAINT IF EXISTS suggestions_entreprises_type_demande_check;

ALTER TABLE public.suggestions_entreprises
  ADD CONSTRAINT suggestions_entreprises_type_demande_check
  CHECK (
    type_demande IN (
      'suggestion',
      'inscription',
      'transport',
      'loisir',
      'demande_information',
      'inscription_entreprise',
      'demande_abonnement'
    )
  );

GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.suggestions_entreprises
  TO service_role;
