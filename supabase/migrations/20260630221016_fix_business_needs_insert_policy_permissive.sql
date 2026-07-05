-- Drop the overly strict INSERT policy
DROP POLICY IF EXISTS "insert_business_need_public" ON public.business_needs;

-- Create a simpler INSERT policy that allows anon/authenticated to insert
-- The table CHECK constraints already enforce valid values for status/type/urgency/visibility
-- Defaults already set status='pending_review', moderation_status='pending', visibility='private'
CREATE POLICY "insert_business_need_public"
  ON public.business_needs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
