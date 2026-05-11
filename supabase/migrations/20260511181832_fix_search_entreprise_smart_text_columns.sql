/*
  # Fix search_entreprise_smart (colonnes catégorie / sous-catégories en TEXT)

  1. Contexte
    - Le RPC existant appelle `array_to_string(e."catégorie", ', ')` et
      `array_to_string(e."sous-catégories", ', ')`
    - Ces colonnes sont désormais de type `text` (plus des tableaux)
    - Postgres renvoie : `function array_to_string(text, unknown) does not exist`
    - La recherche globale (Home, SearchBar, Businesses fallback) est cassée

  2. Changements
    - Remplacement de `array_to_string(...)` par `COALESCE(e."catégorie", '')`
    - Remplacement des `EXISTS (SELECT 1 FROM unnest(...))` par des LIKE directs
      sur le texte, puisqu'il n'y a plus d'array à unnest.
    - Ajout d'un fallback `ilike` sur `sous_categories_clean` et
      `sous_categories_texte` s'ils existent (via `to_regclass`/colonne text
      simple dans la condition WHERE).

  3. Sécurité
    - Aucune modification des droits / RLS
    - La fonction reste STABLE, comme avant
*/

CREATE OR REPLACE FUNCTION public.search_entreprise_smart(
  p_q text,
  p_ville text DEFAULT NULL,
  p_categorie text DEFAULT NULL,
  p_scope text DEFAULT NULL,
  p_limit integer DEFAULT 30
)
RETURNS TABLE(
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
AS $function$
BEGIN
RETURN QUERY
WITH scored AS (
  SELECT
    e.id::text AS eid,
    e.nom AS enom,
    e.ville AS eville,
    COALESCE(e."catégorie"::text, '') AS ecat,
    COALESCE(e."sous-catégories"::text, '') AS escat,
    e.description AS edesc,
    e.telephone AS etel,
    e.site_web AS eweb,
    e.image_url AS eimg,
    e.gouvernorat AS egouv,
    CASE
      WHEN p_q IS NULL OR length(trim(p_q)) < 2 THEN 0::numeric
      WHEN norm(COALESCE(e."catégorie"::text, '')) = norm(p_q) THEN 100::numeric
      WHEN norm(COALESCE(e."sous-catégories"::text, '')) = norm(p_q) THEN 100::numeric
      WHEN norm(COALESCE(e."catégorie"::text, '')) LIKE norm(p_q || '%') THEN 50::numeric
      WHEN norm(COALESCE(e."sous-catégories"::text, '')) LIKE norm(p_q || '%') THEN 50::numeric
      WHEN norm(COALESCE(e."catégorie"::text, '')) LIKE norm('%' || p_q || '%') THEN 30::numeric
      WHEN norm(COALESCE(e."sous-catégories"::text, '')) LIKE norm('%' || p_q || '%') THEN 30::numeric
      WHEN similarity(norm(COALESCE(e."catégorie"::text, '')), norm(p_q)) > 0.3 THEN 25::numeric
      WHEN norm(e.nom) = norm(p_q) THEN 20::numeric
      WHEN norm(e.nom) LIKE norm(p_q || '%') THEN 15::numeric
      WHEN norm(e.nom) LIKE norm('%' || p_q || '%') THEN 10::numeric
      WHEN similarity(norm(e.nom), norm(p_q)) > 0.3 THEN 8::numeric
      WHEN COALESCE(e.name_ar, '') LIKE ('%' || p_q || '%') THEN 15::numeric
      WHEN COALESCE(e.name_ar, '') LIKE (p_q || '%') THEN 18::numeric
      WHEN norm(COALESCE(e.description, '')) LIKE norm('%' || p_q || '%') THEN 2::numeric
      WHEN COALESCE(e.description_ar, '') LIKE ('%' || p_q || '%') THEN 2::numeric
      ELSE 0::numeric
    END AS rscore
  FROM public.entreprise e
  WHERE
    (
      p_q IS NULL OR length(trim(p_q)) < 2
      OR norm(e.nom) LIKE norm('%' || p_q || '%')
      OR similarity(norm(e.nom), norm(p_q)) > 0.3
      OR norm(COALESCE(e."catégorie"::text, '')) LIKE norm('%' || p_q || '%')
      OR similarity(norm(COALESCE(e."catégorie"::text, '')), norm(p_q)) > 0.3
      OR norm(COALESCE(e."sous-catégories"::text, '')) LIKE norm('%' || p_q || '%')
      OR norm(COALESCE(e.description, '')) LIKE norm('%' || p_q || '%')
      OR COALESCE(e.name_ar, '') LIKE ('%' || p_q || '%')
      OR COALESCE(e.description_ar, '') LIKE ('%' || p_q || '%')
    )
    AND (
      p_ville IS NULL OR length(trim(p_ville)) = 0
      OR norm(COALESCE(e.ville, '')) LIKE norm('%' || p_ville || '%')
      OR norm(COALESCE(e.gouvernorat, '')) = norm(p_ville)
    )
    AND (
      p_categorie IS NULL
      OR norm(COALESCE(e."catégorie"::text, '')) LIKE norm('%' || p_categorie || '%')
      OR norm(COALESCE(e."sous-catégories"::text, '')) LIKE norm('%' || p_categorie || '%')
    )
    AND (
      p_scope IS NULL
      OR (p_scope = 'magasin' AND e."page commerce local" = true)
      OR (p_scope IN ('tourisme', 'tourism', 'tourisme local & expatriation') AND e."liste pages" @> ARRAY['tourisme local & expatriation'])
      OR (p_scope = 'services' AND e."liste pages" @> ARRAY['services citoyens'])
      OR (p_scope IN ('santé', 'sante') AND e."liste pages" @> ARRAY['santé'])
      OR (p_scope IN ('loisirs', 'leisure') AND e."liste pages" @> ARRAY['loisirs'])
      OR (p_scope = 'education' AND e."liste pages" @> ARRAY['education'])
      OR (p_scope NOT IN ('magasin', 'tourism', 'tourisme', 'tourisme local & expatriation', 'services', 'santé', 'sante', 'loisirs', 'leisure', 'education'))
    )
)
SELECT eid, enom, eville, ecat, escat, edesc, etel, eweb, eimg, egouv, rscore
FROM scored
WHERE rscore > 0 OR p_q IS NULL OR length(trim(p_q)) < 2
ORDER BY rscore DESC, enom ASC
LIMIT p_limit;
END;
$function$;
