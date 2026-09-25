ALTER TABLE public.entreprise
  ADD COLUMN IF NOT EXISTS slug_court text;

COMMENT ON COLUMN public.entreprise.slug_court IS
  'Slug court unique utilisé pour les liens commerciaux /cv/{slug}.';

CREATE UNIQUE INDEX IF NOT EXISTS idx_entreprise_slug_court_unique
  ON public.entreprise (lower(slug_court))
  WHERE slug_court IS NOT NULL AND btrim(slug_court) <> '';
