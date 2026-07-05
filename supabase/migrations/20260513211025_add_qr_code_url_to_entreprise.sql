/*
  # Ajout du QR code personnalisé Dalil Tounes sur la table entreprise

  1. Nouvelles colonnes
    - `entreprise.slug` (text) — identifiant lisible pour l'URL publique
      (`/etablissement/[slug]`). Si NULL au moment du calcul du QR, on
      retombe sur l'`id` UUID.
    - `entreprise.qr_code_url` (text) — URL absolue du QR code généré via
      QRServer API. Pointe sur l'URL publique de la fiche.

  2. Logique automatique
    - Fonction `compute_entreprise_qr_url(p_id uuid, p_slug text)` qui
      construit l'URL publique de la fiche puis l'URL QRServer
      (500x500, format PNG, ECC quartile pour permettre l'overlay logo).
    - Trigger BEFORE INSERT OR UPDATE sur `entreprise` qui (re)calcule
      `qr_code_url` automatiquement à chaque création OU modification de
      `slug` / `id`. Aucun appel applicatif nécessaire.

  3. Backfill
    - Mise à jour de toutes les lignes existantes pour matérialiser le
      nouveau QR code.

  4. Sécurité
    - RLS déjà activé sur `entreprise` — aucun changement de policy.
    - La fonction est `IMMUTABLE` (calcul pur, pas d'I/O), pas de
      `SECURITY DEFINER`.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'entreprise' AND column_name = 'slug'
  ) THEN
    ALTER TABLE public.entreprise ADD COLUMN slug text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'entreprise' AND column_name = 'qr_code_url'
  ) THEN
    ALTER TABLE public.entreprise ADD COLUMN qr_code_url text;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.compute_entreprise_qr_url(p_id uuid, p_slug text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    'https://api.qrserver.com/v1/create-qr-code/'
    || '?size=500x500'
    || '&format=png'
    || '&ecc=Q'
    || '&color=D4AF37'
    || '&bgcolor=FFFFFF'
    || '&margin=10'
    || '&data='
    || replace(replace(replace(
         'https://daliltounes.com/etablissement/'
         || COALESCE(NULLIF(trim(p_slug), ''), p_id::text),
         ':', '%3A'), '/', '%2F'), '?', '%3F');
$$;

CREATE OR REPLACE FUNCTION public.entreprise_set_qr_code_url()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT'
     OR NEW.id IS DISTINCT FROM OLD.id
     OR NEW.slug IS DISTINCT FROM OLD.slug
     OR NEW.qr_code_url IS NULL
  THEN
    NEW.qr_code_url := public.compute_entreprise_qr_url(NEW.id, NEW.slug);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_entreprise_set_qr_code_url ON public.entreprise;
CREATE TRIGGER trg_entreprise_set_qr_code_url
  BEFORE INSERT OR UPDATE OF slug, id ON public.entreprise
  FOR EACH ROW
  EXECUTE FUNCTION public.entreprise_set_qr_code_url();

UPDATE public.entreprise
SET qr_code_url = public.compute_entreprise_qr_url(id, slug)
WHERE qr_code_url IS NULL
   OR qr_code_url IS DISTINCT FROM public.compute_entreprise_qr_url(id, slug);
