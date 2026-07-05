/*
  # Corriger admin_get_all_avis — supprimer le paramètre inutile

  ## Problème
  PostgREST ne trouvait pas la fonction car elle avait un paramètre optionnel
  (admin_secret TEXT DEFAULT '') mais était appelée sans aucun argument.
  Le cache de schéma PostgREST ne résout pas les paramètres par défaut
  de la même façon que PostgreSQL natif.

  ## Solution
  Recréer la fonction sans aucun paramètre.
*/

-- Supprimer l'ancienne version avec paramètre
DROP FUNCTION IF EXISTS admin_get_all_avis(text);

-- Recréer sans paramètre
CREATE OR REPLACE FUNCTION admin_get_all_avis()
RETURNS TABLE (
  id              uuid,
  entreprise_id   text,
  note            integer,
  commentaire     text,
  auteur          text,
  auteur_email    text,
  status          text,
  date            timestamptz,
  created_at      timestamptz,
  submission_lang text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT
      a.id,
      a.entreprise_id,
      a.note,
      a.commentaire,
      a.auteur,
      a.auteur_email,
      a.status,
      a.date,
      a.created_at,
      a.submission_lang
    FROM avis_entreprise a
    ORDER BY a.date DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION admin_get_all_avis() TO anon, authenticated;
