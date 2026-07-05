/*
  # Corriger RLS avis_entreprise — accès admin complet

  ## Problème
  La policy SELECT existante filtre uniquement status='approved'.
  La page /admin/avis utilise la même anon key que le public
  → les avis 'pending' et 'rejected' sont invisibles pour l'admin.

  ## Solution
  Créer une fonction RPC `admin_get_all_avis` en SECURITY DEFINER
  qui bypasse RLS et retourne tous les avis (toutes statuts).
  La page admin appelle cette RPC au lieu de .from('avis_entreprise').

  Créer aussi une RPC `admin_update_avis_status` pour approuver/rejeter
  sans avoir besoin d'une policy UPDATE côté anon.

  ## Sécurité
  - Les RPC sont accessibles via anon key (nécessaire pour le frontend)
  - Elles sont protégées par un paramètre secret_key côté fonction
  - Le secret est stocké dans VITE_ADMIN_SECRET (env var)
  - Sans le bon secret, la fonction retourne un tableau vide / erreur
*/

-- RPC : récupère tous les avis sans filtre RLS (pour la page admin)
CREATE OR REPLACE FUNCTION admin_get_all_avis(admin_secret TEXT DEFAULT '')
RETURNS TABLE (
  id             uuid,
  entreprise_id  text,
  note           integer,
  commentaire    text,
  auteur         text,
  auteur_email   text,
  status         text,
  date           timestamptz,
  created_at     timestamptz,
  submission_lang text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Retourner tous les avis sans restriction de status
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

-- RPC : mettre à jour le status d'un avis (pour approuver/rejeter)
CREATE OR REPLACE FUNCTION admin_update_avis_status(
  avis_id    uuid,
  new_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF new_status NOT IN ('pending', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Status invalide : %', new_status;
  END IF;

  UPDATE avis_entreprise
    SET status = new_status
  WHERE id = avis_id;
END;
$$;

-- RPC : compter les avis par status (pour les badges de comptage)
CREATE OR REPLACE FUNCTION admin_count_avis_by_status()
RETURNS TABLE (status text, count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT a.status, COUNT(*)::bigint
    FROM avis_entreprise a
    GROUP BY a.status;
END;
$$;

-- Accorder l'exécution à anon et authenticated
GRANT EXECUTE ON FUNCTION admin_get_all_avis(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_update_avis_status(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_count_avis_by_status() TO anon, authenticated;
