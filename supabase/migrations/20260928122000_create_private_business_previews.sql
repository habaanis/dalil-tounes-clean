-- A customer preview is never an entreprise row. Only the Edge Function's
-- service role can access this table. The browser receives a one-time URL
-- token, while the database stores only its SHA-256 digest.
CREATE TABLE public.business_previews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  airtable_record_id text NOT NULL UNIQUE,
  token_hash text NOT NULL UNIQUE,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT business_previews_content_object CHECK (jsonb_typeof(content) = 'object')
);
ALTER TABLE public.business_previews ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.business_previews FROM anon, authenticated, PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_previews TO service_role;
