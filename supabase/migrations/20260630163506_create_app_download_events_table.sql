CREATE TABLE IF NOT EXISTS public.app_download_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  action_type text NOT NULL CHECK (action_type IN ('pwa_install_click', 'pwa_install_accepted', 'pwa_ios_guide_shown', 'download_apk', 'play_store_click', 'app_store_click')),
  device_type text NOT NULL DEFAULT 'unknown',
  page_source text,
  user_agent text
);

ALTER TABLE public.app_download_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_anon_insert_download_events" ON public.app_download_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "allow_authenticated_select_download_events" ON public.app_download_events
  FOR SELECT TO authenticated
  USING (true);

CREATE INDEX idx_download_events_created_at ON public.app_download_events (created_at DESC);
CREATE INDEX idx_download_events_action_type ON public.app_download_events (action_type);
