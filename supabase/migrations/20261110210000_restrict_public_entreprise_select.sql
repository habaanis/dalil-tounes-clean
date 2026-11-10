-- Dalil Tounes: keep published historical essentials readable, but block draft/rejected rows.
-- Applied and verified in production on 2026-11-10.
-- Public access requires validation="publie" and no explicit rejection.
-- Historical entries with approved=NULL remain public only when validation is "publie".
-- Staff access continues through separate authenticated staff SELECT policies.
DROP POLICY IF EXISTS "Published and legacy entreprises are public" ON public.entreprise;
CREATE POLICY "Published and legacy entreprises are public"
ON public.entreprise FOR SELECT TO anon, authenticated
USING (
  approved IS DISTINCT FROM FALSE
  AND statut_validation = 'publie'
  AND (
    statut_publication IS NULL
    OR lower(btrim(statut_publication)) IN ('publié', 'publie', 'published')
  )
);
