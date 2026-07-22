/*
  # Fix enterprise search RPCs for the current entreprise schema

  The live functions were still referencing historical columns:
  - "catégorie"
  - "sous-catégories"
  - sous_categories
  - secteur

  Current public.entreprise columns used here:
  - categorie text[]
  - sous_categories_texte text
  - sous_categories_clean text
  - services text
  - liste_pages text[]
  - nom, ville, gouvernorat, description
*/

CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE OR REPLACE FUNCTION public.norm(txt text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN txt IS NULL THEN ''
    ELSE lower(unaccent(txt))
  END
$$;

GRANT EXECUTE ON FUNCTION public.norm(text) TO anon, authenticated;

DROP FUNCTION IF EXISTS public.enterprise_cities_suggest(text, int);

CREATE FUNCTION public.enterprise_cities_suggest(
  p_q text,
  p_limit int DEFAULT 10
)
RETURNS TABLE (ville text)
LANGUAGE sql
STABLE
AS $$
  SELECT v
  FROM (
    SELECT DISTINCT trim(e.ville) AS v
    FROM public.entreprise e
    WHERE COALESCE(trim(e.ville), '') <> ''
  ) cities
  WHERE
    p_q IS NULL
    OR length(trim(p_q)) < 2
    OR norm(v) LIKE norm('%' || p_q || '%')
    OR similarity(norm(v), norm(p_q)) > 0.3
  ORDER BY
    CASE
      WHEN p_q IS NULL OR length(trim(p_q)) < 2 THEN 1
      WHEN norm(v) = norm(p_q) THEN 0
      WHEN norm(v) LIKE norm(p_q || '%') THEN 1
      WHEN norm(v) LIKE norm('%' || p_q || '%') THEN 2
      ELSE 3
    END,
    v ASC
  LIMIT COALESCE(p_limit, 10);
$$;

GRANT EXECUTE ON FUNCTION public.enterprise_cities_suggest(text, int) TO anon, authenticated;

DROP FUNCTION IF EXISTS public.enterprise_categories_suggest(text, int);

CREATE FUNCTION public.enterprise_categories_suggest(
  p_q text,
  p_limit int DEFAULT 12
)
RETURNS TABLE (categorie text)
LANGUAGE sql
STABLE
AS $$
  WITH category_values AS (
    SELECT trim(cat) AS c
    FROM public.entreprise e,
         unnest(COALESCE(e.categorie, ARRAY[]::text[])) AS cat
    UNION ALL
    SELECT trim(part) AS c
    FROM public.entreprise e,
         regexp_split_to_table(COALESCE(e.sous_categories_texte, ''), ',') AS part
    UNION ALL
    SELECT trim(part) AS c
    FROM public.entreprise e,
         regexp_split_to_table(COALESCE(e.sous_categories_clean, ''), ',') AS part
    UNION ALL
    SELECT trim(part) AS c
    FROM public.entreprise e,
         regexp_split_to_table(COALESCE(e.services, ''), ',') AS part
  ),
  normalized AS (
    SELECT DISTINCT c
    FROM category_values
    WHERE c <> ''
  )
  SELECT c AS categorie
  FROM normalized
  WHERE
    p_q IS NULL
    OR length(trim(p_q)) < 2
    OR norm(c) LIKE norm('%' || p_q || '%')
    OR similarity(norm(c), norm(p_q)) > 0.3
  ORDER BY
    CASE
      WHEN p_q IS NULL OR length(trim(p_q)) < 2 THEN 1
      WHEN norm(c) = norm(p_q) THEN 0
      WHEN norm(c) LIKE norm(p_q || '%') THEN 1
      WHEN norm(c) LIKE norm('%' || p_q || '%') THEN 2
      ELSE 3
    END,
    c ASC
  LIMIT COALESCE(p_limit, 12);
$$;

GRANT EXECUTE ON FUNCTION public.enterprise_categories_suggest(text, int) TO anon, authenticated;

DROP FUNCTION IF EXISTS public.search_entreprise_smart(text, text, text, text, int);

CREATE FUNCTION public.search_entreprise_smart(
  p_q text,
  p_ville text DEFAULT NULL,
  p_categorie text DEFAULT NULL,
  p_scope text DEFAULT NULL,
  p_limit int DEFAULT 30
)
RETURNS TABLE (
  id text,
  nom text,
  ville text,
  categorie text,
  sous_categories text,
  description text,
  telephone text,
  site_web text,
  image_url text,
  gouvernorat text,
  score numeric
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  WITH base AS (
    SELECT
      e.id::text AS eid,
      e.nom AS enom,
      e.ville AS eville,
      array_to_string(COALESCE(e.categorie, ARRAY[]::text[]), ', ') AS ecat,
      trim(concat_ws(', ', NULLIF(e.sous_categories_texte, ''), NULLIF(e.sous_categories_clean, ''))) AS escat,
      e.description AS edesc,
      e.telephone AS etel,
      e.site_web AS eweb,
      e.image_url AS eimg,
      e.gouvernorat AS egouv,
      concat_ws(
        ' ',
        e.nom,
        e.ville,
        e.gouvernorat,
        array_to_string(COALESCE(e.categorie, ARRAY[]::text[]), ' '),
        e.sous_categories_texte,
        e.sous_categories_clean,
        e.services,
        e.description,
        e."mots cles recherche"
      ) AS search_blob,
      e.liste_pages AS eliste_pages,
      e."page commerce local" AS epage_commerce_local
    FROM public.entreprise e
    WHERE COALESCE(trim(e.nom), '') <> ''
  ),
  scored AS (
    SELECT
      *,
      CASE
        WHEN p_q IS NULL OR length(trim(p_q)) < 2 THEN 0::numeric
        WHEN norm(enom) = norm(p_q) THEN 120::numeric
        WHEN norm(enom) LIKE norm(p_q || '%') THEN 90::numeric
        WHEN norm(enom) LIKE norm('%' || p_q || '%') THEN 70::numeric
        WHEN norm(ecat) LIKE norm('%' || p_q || '%') THEN 55::numeric
        WHEN norm(escat) LIKE norm('%' || p_q || '%') THEN 50::numeric
        WHEN norm(COALESCE(search_blob, '')) LIKE norm('%' || p_q || '%') THEN 30::numeric
        WHEN similarity(norm(enom), norm(p_q)) > 0.3 THEN 20::numeric
        ELSE 0::numeric
      END AS rscore
    FROM base
    WHERE
      (
        p_q IS NULL
        OR length(trim(p_q)) < 2
        OR norm(COALESCE(search_blob, '')) LIKE norm('%' || p_q || '%')
        OR similarity(norm(enom), norm(p_q)) > 0.3
      )
      AND (
        p_ville IS NULL
        OR length(trim(p_ville)) = 0
        OR norm(COALESCE(eville, '')) LIKE norm('%' || p_ville || '%')
        OR norm(COALESCE(egouv, '')) LIKE norm('%' || p_ville || '%')
      )
      AND (
        p_categorie IS NULL
        OR length(trim(p_categorie)) = 0
        OR norm(COALESCE(ecat, '')) LIKE norm('%' || p_categorie || '%')
        OR norm(COALESCE(escat, '')) LIKE norm('%' || p_categorie || '%')
      )
      AND (
        p_scope IS NULL
        OR length(trim(p_scope)) = 0
        OR (p_scope = 'magasin' AND epage_commerce_local = true)
        OR (p_scope IN ('tourisme', 'tourism') AND eliste_pages @> ARRAY['tourisme local & expatriation']::text[])
        OR (p_scope = 'services' AND eliste_pages @> ARRAY['services citoyens']::text[])
        OR (p_scope IN ('santé', 'sante') AND eliste_pages @> ARRAY['santé']::text[])
        OR (p_scope IN ('loisirs', 'leisure') AND eliste_pages @> ARRAY['loisirs']::text[])
        OR (p_scope IN ('education', 'éducation') AND eliste_pages && ARRAY['education', 'éducation']::text[])
        OR (p_scope NOT IN ('magasin', 'tourisme', 'tourism', 'services', 'santé', 'sante', 'loisirs', 'leisure', 'education', 'éducation'))
      )
  )
  SELECT eid, enom, eville, ecat, escat, edesc, etel, eweb, eimg, egouv, rscore
  FROM scored
  WHERE rscore > 0 OR p_q IS NULL OR length(trim(p_q)) < 2
  ORDER BY rscore DESC, enom ASC NULLS LAST
  LIMIT COALESCE(p_limit, 30);
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_entreprise_smart(text, text, text, text, int) TO anon, authenticated;

-- Smoke tests to run manually after applying the migration:
-- select * from public.search_entreprise_smart('restaurant') limit 10;
-- select * from public.enterprise_categories_suggest('rest') limit 10;
-- select * from public.enterprise_cities_suggest('tunis') limit 10;
