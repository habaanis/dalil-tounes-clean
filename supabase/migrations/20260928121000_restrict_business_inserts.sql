-- New public listings are created by staff or the server-side sync.
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON public.entreprise;
CREATE POLICY "Staff can insert entreprises"
  ON public.entreprise FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT public.is_admin())
    OR EXISTS (SELECT 1 FROM public.admins a WHERE a.id = (SELECT auth.uid()))
    OR EXISTS (
      SELECT 1 FROM public.commerciaux c
      WHERE c.id = (SELECT auth.uid()) AND c.actif IS TRUE
    )
  );
REVOKE INSERT ON public.entreprise FROM anon;
