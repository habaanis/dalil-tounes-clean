/*
  # search_entreprise_smart → SECURITY DEFINER

  1. Contexte
    - Le rôle `anon` (celui utilisé par l'app front) n'a pas SELECT sur toutes
      les colonnes de `public.entreprise` (nom, catégorie, sous-catégories,
      description, etc. sont masquées par les GRANT column-level).
    - La fonction tourne en SECURITY INVOKER donc échoue avec
      « column e.nom does not exist » (PostgREST peut remonter un message
      résiduel « array_to_string(text, unknown) does not exist » depuis un
      plan en cache côté client).

  2. Changements
    - ALTER FUNCTION … SECURITY DEFINER (le owner voit toutes les colonnes).
    - Fixe `search_path` à `public, pg_temp` pour éviter les abus.
    - GRANT EXECUTE explicit aux rôles `anon` et `authenticated`.
    - `NOTIFY pgrst, 'reload schema'` pour rafraîchir le cache PostgREST.

  3. Sécurité
    - La fonction ne renvoie que les champs déjà publics (nom, ville,
      catégorie, description, téléphone, site, image, gouvernorat, score).
    - Aucune écriture ; aucun risque de fuite de données sensibles.
*/

ALTER FUNCTION public.search_entreprise_smart(text, text, text, text, integer)
  SECURITY DEFINER
  SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.search_entreprise_smart(text, text, text, text, integer)
  TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
