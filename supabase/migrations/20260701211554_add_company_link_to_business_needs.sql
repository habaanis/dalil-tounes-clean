-- Link public business needs to an existing Dalil Tounes company profile.
-- The relation is optional: unlinked needs must continue to work normally.

ALTER TABLE public.business_needs
  ADD COLUMN IF NOT EXISTS company_id text,
  ADD COLUMN IF NOT EXISTS company_slug text,
  ADD COLUMN IF NOT EXISTS company_city text;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'business_needs'
      AND column_name = 'company_id'
      AND data_type <> 'text'
  ) THEN
    ALTER TABLE public.business_needs
      DROP CONSTRAINT IF EXISTS business_needs_company_id_fkey;

    ALTER TABLE public.business_needs
      ALTER COLUMN company_id TYPE text USING company_id::text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'business_needs_company_id_fkey'
      AND conrelid = 'public.business_needs'::regclass
  ) THEN
    ALTER TABLE public.business_needs
      ADD CONSTRAINT business_needs_company_id_fkey
      FOREIGN KEY (company_id)
      REFERENCES public.entreprise(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_business_needs_company_id
  ON public.business_needs (company_id);

CREATE INDEX IF NOT EXISTS idx_business_needs_company_slug_city
  ON public.business_needs (company_slug, company_city);
