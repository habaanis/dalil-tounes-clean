ALTER TABLE public.business_needs
  ADD COLUMN IF NOT EXISTS airtable_record_id text,
  ADD COLUMN IF NOT EXISTS airtable_sync_status text,
  ADD COLUMN IF NOT EXISTS airtable_synced_at timestamptz,
  ADD COLUMN IF NOT EXISTS notification_sent_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS idx_business_needs_airtable_record_id
  ON public.business_needs (airtable_record_id)
  WHERE airtable_record_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_business_needs_airtable_sync_status
  ON public.business_needs (airtable_sync_status)
  WHERE deleted_at IS NULL;
