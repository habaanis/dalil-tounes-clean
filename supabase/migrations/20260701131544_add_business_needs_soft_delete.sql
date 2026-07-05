-- Soft delete support for business_needs
-- Rows must remain archived; never physically delete business needs.

ALTER TABLE public.business_needs
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by text;

-- Admin mutations must go through the service_role Edge Function.
DROP POLICY IF EXISTS "update_business_needs_admin" ON public.business_needs;

ALTER TABLE public.business_needs
  DROP CONSTRAINT IF EXISTS business_needs_status_check;

ALTER TABLE public.business_needs
  ADD CONSTRAINT business_needs_status_check CHECK (status IN (
    'draft',
    'pending_review',
    'published',
    'closed',
    'expired',
    'rejected',
    'deleted'
  ));

CREATE INDEX IF NOT EXISTS idx_business_needs_deleted_at
  ON public.business_needs (deleted_at);

CREATE INDEX IF NOT EXISTS idx_business_needs_status_deleted_at
  ON public.business_needs (status, deleted_at);
