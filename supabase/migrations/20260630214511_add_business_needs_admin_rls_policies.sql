
-- Allow admin read access (same pattern as avis_entreprise admin pages)
CREATE POLICY "select_business_needs_all"
  ON public.business_needs
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow admin updates (approve/reject)
CREATE POLICY "update_business_needs_admin"
  ON public.business_needs
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
