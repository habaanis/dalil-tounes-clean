-- A draft is kept outside public.entreprise until publication. Explicitly
-- marked unpublished rows are hidden from public reads. Historical listings
-- have a NULL publication status and must remain visible.
DROP POLICY IF EXISTS "Enable read access for all users" ON public.entreprise;
CREATE POLICY "Published and legacy entreprises are public"
  ON public.entreprise FOR SELECT TO public
  USING (
    statut_publication IS NULL
    OR lower(trim(statut_publication)) IN ('publié', 'publie', 'published')
  );

-- Staff need to inspect records while editing. This policy is separate from
-- the public visibility rule, and only applies to logged-in staff.
CREATE POLICY "Staff can read unpublished entreprises"
  ON public.entreprise FOR SELECT TO authenticated
  USING (
    (SELECT public.is_admin())
    OR EXISTS (SELECT 1 FROM public.admins a WHERE a.id = (SELECT auth.uid()))
    OR EXISTS (
      SELECT 1 FROM public.commerciaux c
      WHERE c.id = (SELECT auth.uid()) AND c.actif IS TRUE
    )
  );

DROP POLICY IF EXISTS "allow_all_updates" ON public.entreprise;
CREATE POLICY "Staff can update entreprises"
  ON public.entreprise FOR UPDATE TO authenticated
  USING (
    (SELECT public.is_admin())
    OR EXISTS (SELECT 1 FROM public.admins a WHERE a.id = (SELECT auth.uid()))
    OR EXISTS (
      SELECT 1 FROM public.commerciaux c
      WHERE c.id = (SELECT auth.uid()) AND c.actif IS TRUE
    )
  )
  WITH CHECK (
    (SELECT public.is_admin())
    OR EXISTS (SELECT 1 FROM public.admins a WHERE a.id = (SELECT auth.uid()))
    OR EXISTS (
      SELECT 1 FROM public.commerciaux c
      WHERE c.id = (SELECT auth.uid()) AND c.actif IS TRUE
    )
  );

REVOKE UPDATE ON public.entreprise FROM anon;
