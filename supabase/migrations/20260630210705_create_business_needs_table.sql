
-- Table: business_needs
-- V1: Collecte des besoins professionnels soumis par les entreprises
CREATE TABLE IF NOT EXISTS public.business_needs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  expires_at timestamptz,

  type text NOT NULL,
  title text NOT NULL,
  summary text,
  description text NOT NULL,

  category text,
  subcategory text,
  tags text[],

  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,

  city text NOT NULL,
  governorate text NOT NULL,
  zone_intervention text,

  budget_min numeric,
  budget_max numeric,
  currency text NOT NULL DEFAULT 'TND',
  deadline date,
  urgency text NOT NULL DEFAULT 'normal',

  status text NOT NULL DEFAULT 'pending_review',
  visibility text NOT NULL DEFAULT 'private',
  moderation_status text NOT NULL DEFAULT 'pending',
  moderation_reason text,
  response_count integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  submission_lang text NOT NULL DEFAULT 'fr',
  internal_notes text,

  CONSTRAINT business_needs_type_check CHECK (type IN (
    'supplier_search', 'service_provider_search', 'equipment_purchase',
    'equipment_sale', 'liquidation', 'partnership', 'business_opportunity', 'other'
  )),
  CONSTRAINT business_needs_status_check CHECK (status IN (
    'draft', 'pending_review', 'published', 'closed', 'expired', 'rejected'
  )),
  CONSTRAINT business_needs_urgency_check CHECK (urgency IN ('low', 'normal', 'urgent')),
  CONSTRAINT business_needs_visibility_check CHECK (visibility IN (
    'private', 'public', 'verified_companies', 'premium_only'
  ))
);

-- Enable RLS
ALTER TABLE public.business_needs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous/authenticated users to INSERT (submit a need)
CREATE POLICY "insert_business_need_public"
  ON public.business_needs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending_review'
    AND moderation_status = 'pending'
    AND visibility = 'private'
  );

-- No SELECT for public (needs stay private until moderated)
-- Service role has implicit full access (bypasses RLS)

-- Index for admin queries
CREATE INDEX idx_business_needs_status ON public.business_needs (status);
CREATE INDEX idx_business_needs_created_at ON public.business_needs (created_at DESC);
CREATE INDEX idx_business_needs_governorate ON public.business_needs (governorate);
