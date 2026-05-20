/*
  # Add missing essential columns to entreprise table

  The entreprise table is missing most columns that the application expects.
  This migration adds all necessary columns without dropping or modifying existing ones.

  1. Core columns: nom, ville, gouvernorat, adresse, description, etc.
  2. Contact columns: telephone, email, site_web, whatsapp, etc.
  3. Media columns: image_url, logo_url, video_url
  4. Social links: facebook, instagram, linkedin, tiktok, youtube
  5. Category/search columns: categorie, sous_categories, secteur, tags
  6. Business status columns: statut_carte, is_premium, views_count, etc.
  7. Ratings: score_avis, note_google, nombre_avis, etc.

  No existing columns or data are dropped or modified.
*/

DO $$
BEGIN
  -- Core identity & location
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='nom') THEN
    ALTER TABLE entreprise ADD COLUMN nom text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='ville') THEN
    ALTER TABLE entreprise ADD COLUMN ville text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='gouvernorat') THEN
    ALTER TABLE entreprise ADD COLUMN gouvernorat text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='adresse') THEN
    ALTER TABLE entreprise ADD COLUMN adresse text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='latitude') THEN
    ALTER TABLE entreprise ADD COLUMN latitude double precision;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='longitude') THEN
    ALTER TABLE entreprise ADD COLUMN longitude double precision;
  END IF;

  -- Categories & sectors
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='categorie') THEN
    ALTER TABLE entreprise ADD COLUMN categorie text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='sous_categories') THEN
    ALTER TABLE entreprise ADD COLUMN sous_categories text[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='sous_categories_texte') THEN
    ALTER TABLE entreprise ADD COLUMN sous_categories_texte text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='sous_categories_clean') THEN
    ALTER TABLE entreprise ADD COLUMN sous_categories_clean text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='secteur') THEN
    ALTER TABLE entreprise ADD COLUMN secteur text[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='page_categorie') THEN
    ALTER TABLE entreprise ADD COLUMN page_categorie text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='tags') THEN
    ALTER TABLE entreprise ADD COLUMN tags text[];
  END IF;

  -- Description & services
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='description') THEN
    ALTER TABLE entreprise ADD COLUMN description text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='services') THEN
    ALTER TABLE entreprise ADD COLUMN services text;
  END IF;

  -- Contact
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='telephone') THEN
    ALTER TABLE entreprise ADD COLUMN telephone text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='telephone2') THEN
    ALTER TABLE entreprise ADD COLUMN telephone2 text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='telephone2_clean') THEN
    ALTER TABLE entreprise ADD COLUMN telephone2_clean text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='email') THEN
    ALTER TABLE entreprise ADD COLUMN email text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='email2') THEN
    ALTER TABLE entreprise ADD COLUMN email2 text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='email2_clean') THEN
    ALTER TABLE entreprise ADD COLUMN email2_clean text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='site_web') THEN
    ALTER TABLE entreprise ADD COLUMN site_web text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='whatsapp') THEN
    ALTER TABLE entreprise ADD COLUMN whatsapp text;
  END IF;

  -- Media
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='image_url') THEN
    ALTER TABLE entreprise ADD COLUMN image_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='logo_url') THEN
    ALTER TABLE entreprise ADD COLUMN logo_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='video_url') THEN
    ALTER TABLE entreprise ADD COLUMN video_url text;
  END IF;

  -- Social links
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='lien facebook') THEN
    ALTER TABLE entreprise ADD COLUMN "lien facebook" text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='Lien Instagram') THEN
    ALTER TABLE entreprise ADD COLUMN "Lien Instagram" text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='Lien LinkedIn') THEN
    ALTER TABLE entreprise ADD COLUMN "Lien LinkedIn" text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='Lien TikTok') THEN
    ALTER TABLE entreprise ADD COLUMN "Lien TikTok" text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='Lien YouTube') THEN
    ALTER TABLE entreprise ADD COLUMN "Lien YouTube" text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='lien_x') THEN
    ALTER TABLE entreprise ADD COLUMN lien_x text;
  END IF;

  -- Ratings & reviews
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='score_avis') THEN
    ALTER TABLE entreprise ADD COLUMN score_avis numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='note_google') THEN
    ALTER TABLE entreprise ADD COLUMN note_google numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='Note Google Globale') THEN
    ALTER TABLE entreprise ADD COLUMN "Note Google Globale" numeric;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='nombre_avis') THEN
    ALTER TABLE entreprise ADD COLUMN nombre_avis integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='Compteur Avis Google') THEN
    ALTER TABLE entreprise ADD COLUMN "Compteur Avis Google" integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='Lien Avis Google') THEN
    ALTER TABLE entreprise ADD COLUMN "Lien Avis Google" text;
  END IF;

  -- Business status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='statut_carte') THEN
    ALTER TABLE entreprise ADD COLUMN statut_carte text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='is_premium') THEN
    ALTER TABLE entreprise ADD COLUMN is_premium boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='is_local_verified') THEN
    ALTER TABLE entreprise ADD COLUMN is_local_verified boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='home_featured') THEN
    ALTER TABLE entreprise ADD COLUMN home_featured boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='citizen_featured') THEN
    ALTER TABLE entreprise ADD COLUMN citizen_featured boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='subscription_tier') THEN
    ALTER TABLE entreprise ADD COLUMN subscription_tier text;
  END IF;

  -- Engagement
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='views_count') THEN
    ALTER TABLE entreprise ADD COLUMN views_count integer DEFAULT 0;
  END IF;

  -- Schedule & hours
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='horaires_ok') THEN
    ALTER TABLE entreprise ADD COLUMN horaires_ok text;
  END IF;

  -- SEO & search
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='mots cles recherche') THEN
    ALTER TABLE entreprise ADD COLUMN "mots cles recherche" text;
  END IF;

  -- Maps & navigation
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='BTN_Maps') THEN
    ALTER TABLE entreprise ADD COLUMN "BTN_Maps" text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='google_url') THEN
    ALTER TABLE entreprise ADD COLUMN google_url text;
  END IF;

  -- Page flags
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='page commerce local') THEN
    ALTER TABLE entreprise ADD COLUMN "page commerce local" boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='liste pages') THEN
    ALTER TABLE entreprise ADD COLUMN "liste pages" text[];
  END IF;

  -- Timestamps
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entreprise' AND column_name='updated_at') THEN
    ALTER TABLE entreprise ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Indexes for search performance
CREATE INDEX IF NOT EXISTS idx_entreprise_nom ON entreprise(nom);
CREATE INDEX IF NOT EXISTS idx_entreprise_ville ON entreprise(ville);
CREATE INDEX IF NOT EXISTS idx_entreprise_gouvernorat ON entreprise(gouvernorat);
CREATE INDEX IF NOT EXISTS idx_entreprise_slug ON entreprise(slug);
CREATE INDEX IF NOT EXISTS idx_entreprise_id_airtable ON entreprise(id_airtable);