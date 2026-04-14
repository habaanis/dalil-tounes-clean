/*
  # Correction enterprise_suggest_filtered : suppression des faux positifs

  ## Problème
  La fonction utilisait similarity() sur le nom avec un seuil de 0.3, trop bas.
  Résultat : "dent" faisait matcher "Immobilier", "Restaurant", etc. par similarité
  phonétique approximative non pertinente.

  ## Correction
  - Suppression de similarity() sur le nom (trop de faux positifs)
  - Recherche stricte LIKE uniquement : nom contient le terme OU catégorie contient le terme
  - Ajout de la recherche sur "sous-catégories" (TEXT[])
  - Ajout de la recherche sur "mots cles recherche" (colonne SEO)
  - Ordre de priorité : catégorie match > sous-catégorie match > nom match > mots clés

  ## Tables concernées
  - public.entreprise : colonnes "catégorie", "sous-catégories", "mots cles recherche"
*/

CREATE OR REPLACE FUNCTION public.enterprise_suggest_filtered(
  q text,
  p_limit int DEFAULT 8,
  p_categorie text DEFAULT NULL,
  p_ville text DEFAULT NULL
)
RETURNS TABLE (
  id text,
  nom text,
  ville text,
  categorie text
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    e.id::text,
    e.nom,
    e.ville,
    COALESCE(array_to_string(e."catégorie", ', '), '') AS categorie
  FROM public.entreprise e
  WHERE
    e.status = 'approved'
    AND e.nom IS NOT NULL
    AND (
      norm(e.nom) LIKE norm('%' || q || '%')
      OR EXISTS (
        SELECT 1 FROM unnest(e."catégorie") AS cat
        WHERE norm(cat) LIKE norm('%' || q || '%')
      )
      OR EXISTS (
        SELECT 1 FROM unnest(e."sous-catégories") AS scat
        WHERE norm(scat) LIKE norm('%' || q || '%')
      )
      OR norm(COALESCE(e."mots cles recherche", '')) LIKE norm('%' || q || '%')
    )
    AND (
      p_ville IS NULL
      OR norm(COALESCE(e.ville, '')) LIKE norm('%' || p_ville || '%')
    )
    AND (
      p_categorie IS NULL
      OR EXISTS (
        SELECT 1 FROM unnest(e."catégorie") AS cat
        WHERE norm(cat) LIKE norm('%' || p_categorie || '%')
      )
    )
  ORDER BY
    CASE
      WHEN EXISTS (SELECT 1 FROM unnest(e."catégorie") AS cat WHERE norm(cat) LIKE norm(q || '%')) THEN 0
      WHEN EXISTS (SELECT 1 FROM unnest(e."catégorie") AS cat WHERE norm(cat) LIKE norm('%' || q || '%')) THEN 1
      WHEN EXISTS (SELECT 1 FROM unnest(e."sous-catégories") AS scat WHERE norm(scat) LIKE norm(q || '%')) THEN 2
      WHEN EXISTS (SELECT 1 FROM unnest(e."sous-catégories") AS scat WHERE norm(scat) LIKE norm('%' || q || '%')) THEN 3
      WHEN norm(e.nom) LIKE norm(q || '%') THEN 4
      WHEN norm(e.nom) LIKE norm('%' || q || '%') THEN 5
      ELSE 6
    END,
    e.nom ASC
  LIMIT COALESCE(p_limit, 8);
$$;

GRANT EXECUTE ON FUNCTION public.enterprise_suggest_filtered(text, int, text, text) TO anon, authenticated;
