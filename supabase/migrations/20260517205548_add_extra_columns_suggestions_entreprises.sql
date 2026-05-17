/*
  # Add extra columns to suggestions_entreprises

  These columns are used by RegistrationForm and MedicalTransportRegistrationForm
  to store additional metadata about business registration requests.

  1. Modified Tables
    - `suggestions_entreprises`
      - `video_url` (text, nullable) - Video presentation URL
      - `pack_type` (text, nullable) - Subscription plan type
      - `facebook_url` (text, nullable) - Facebook page URL
      - `instagram_url` (text, nullable) - Instagram profile URL
      - `linkedin_url` (text, nullable) - LinkedIn page URL
      - `tiktok_url` (text, nullable) - TikTok profile URL
      - `youtube_url` (text, nullable) - YouTube channel URL
      - `image_url` (text, nullable) - Image/logo URL
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'suggestions_entreprises' AND column_name = 'video_url') THEN
    ALTER TABLE suggestions_entreprises ADD COLUMN video_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'suggestions_entreprises' AND column_name = 'pack_type') THEN
    ALTER TABLE suggestions_entreprises ADD COLUMN pack_type text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'suggestions_entreprises' AND column_name = 'facebook_url') THEN
    ALTER TABLE suggestions_entreprises ADD COLUMN facebook_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'suggestions_entreprises' AND column_name = 'instagram_url') THEN
    ALTER TABLE suggestions_entreprises ADD COLUMN instagram_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'suggestions_entreprises' AND column_name = 'linkedin_url') THEN
    ALTER TABLE suggestions_entreprises ADD COLUMN linkedin_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'suggestions_entreprises' AND column_name = 'tiktok_url') THEN
    ALTER TABLE suggestions_entreprises ADD COLUMN tiktok_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'suggestions_entreprises' AND column_name = 'youtube_url') THEN
    ALTER TABLE suggestions_entreprises ADD COLUMN youtube_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'suggestions_entreprises' AND column_name = 'image_url') THEN
    ALTER TABLE suggestions_entreprises ADD COLUMN image_url text;
  END IF;
END $$;
