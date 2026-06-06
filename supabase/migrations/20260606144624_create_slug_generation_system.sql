
-- 1. Function to generate a clean slug from text (same logic as JS generateSlug)
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  result text;
BEGIN
  IF input_text IS NULL OR input_text = '' THEN
    RETURN '';
  END IF;

  result := lower(input_text);
  result := unaccent(result);

  -- Replace common ligatures
  result := replace(result, 'oe', 'oe');
  result := replace(result, 'ae', 'ae');

  -- Replace non-alphanumeric with hyphens
  result := regexp_replace(result, '[^a-z0-9]+', '-', 'g');
  -- Trim leading/trailing hyphens
  result := regexp_replace(result, '^-+|-+$', '', 'g');
  -- Collapse multiple hyphens
  result := regexp_replace(result, '-+', '-', 'g');

  RETURN result;
END;
$$;

-- 2. Function to generate a unique slug for an enterprise
CREATE OR REPLACE FUNCTION generate_unique_slug(
  p_nom text,
  p_ville text DEFAULT NULL,
  p_exclude_id uuid DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  candidate text;
  ville_slug text;
  counter integer;
BEGIN
  base_slug := generate_slug(p_nom);
  
  IF base_slug = '' THEN
    RETURN NULL;
  END IF;

  -- Try base slug first
  candidate := base_slug;
  IF NOT EXISTS (
    SELECT 1 FROM entreprise 
    WHERE slug = candidate AND (p_exclude_id IS NULL OR id != p_exclude_id)
  ) THEN
    RETURN candidate;
  END IF;

  -- Try with ville suffix
  IF p_ville IS NOT NULL AND p_ville != '' THEN
    ville_slug := generate_slug(p_ville);
    IF ville_slug != '' THEN
      candidate := base_slug || '-' || ville_slug;
      IF NOT EXISTS (
        SELECT 1 FROM entreprise 
        WHERE slug = candidate AND (p_exclude_id IS NULL OR id != p_exclude_id)
      ) THEN
        RETURN candidate;
      END IF;
    END IF;
  END IF;

  -- Try with numeric suffix
  counter := 2;
  LOOP
    candidate := base_slug || '-' || counter;
    IF NOT EXISTS (
      SELECT 1 FROM entreprise 
      WHERE slug = candidate AND (p_exclude_id IS NULL OR id != p_exclude_id)
    ) THEN
      RETURN candidate;
    END IF;
    counter := counter + 1;
    EXIT WHEN counter > 1000;
  END LOOP;

  -- Ultimate fallback: append short UUID
  RETURN base_slug || '-' || substring(gen_random_uuid()::text, 1, 8);
END;
$$;

-- 3. Populate slugs for all existing rows that have NULL or empty slug
DO $$
DECLARE
  rec RECORD;
  new_slug text;
  updated_count integer := 0;
BEGIN
  FOR rec IN
    SELECT id, nom, ville
    FROM entreprise
    WHERE (slug IS NULL OR slug = '')
      AND nom IS NOT NULL AND nom != ''
    ORDER BY created_at ASC NULLS LAST
  LOOP
    new_slug := generate_unique_slug(rec.nom, rec.ville, rec.id);
    IF new_slug IS NOT NULL THEN
      UPDATE entreprise SET slug = new_slug WHERE id = rec.id;
      updated_count := updated_count + 1;
    END IF;
  END LOOP;
  RAISE NOTICE 'Slugs generated: % rows updated', updated_count;
END;
$$;

-- 4. Add unique constraint on slug (allows NULL for rows without nom)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'entreprise_slug_unique' AND conrelid = 'entreprise'::regclass
  ) THEN
    ALTER TABLE entreprise ADD CONSTRAINT entreprise_slug_unique UNIQUE (slug);
  END IF;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END;
$$;

-- 5. Create trigger to auto-generate slug on INSERT/UPDATE
CREATE OR REPLACE FUNCTION trigger_set_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only generate if slug is not already set
  IF (NEW.slug IS NULL OR NEW.slug = '') AND NEW.nom IS NOT NULL AND NEW.nom != '' THEN
    NEW.slug := generate_unique_slug(NEW.nom, NEW.ville, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_slug_before_insert ON entreprise;
CREATE TRIGGER set_slug_before_insert
  BEFORE INSERT ON entreprise
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_slug();

DROP TRIGGER IF EXISTS set_slug_before_update ON entreprise;
CREATE TRIGGER set_slug_before_update
  BEFORE UPDATE ON entreprise
  FOR EACH ROW
  WHEN (
    (OLD.slug IS NULL OR OLD.slug = '')
    AND NEW.nom IS NOT NULL AND NEW.nom != ''
  )
  EXECUTE FUNCTION trigger_set_slug();

-- 6. Create RPC to find enterprise by slug
CREATE OR REPLACE FUNCTION find_entreprise_by_slug(p_slug text)
RETURNS SETOF entreprise
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT * FROM entreprise
  WHERE slug = lower(p_slug)
  LIMIT 1;
$$;
