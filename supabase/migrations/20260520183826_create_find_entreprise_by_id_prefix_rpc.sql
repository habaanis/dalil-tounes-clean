/*
  # Create RPC to find entreprise by UUID prefix

  1. New Function
    - `find_entreprise_by_id_prefix(prefix text)` - Finds an entreprise whose UUID starts with the given prefix
    - Returns the full row from `entreprise` table
    - Used when navigating from /p/{slug}-{shortId} URLs where only first 8 chars of UUID are available

  2. Security
    - Function is accessible to anon and authenticated roles
    - Uses SECURITY DEFINER to bypass RLS for this specific lookup
*/

CREATE OR REPLACE FUNCTION find_entreprise_by_id_prefix(prefix text)
RETURNS SETOF entreprise
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT * FROM entreprise
  WHERE id::text LIKE (prefix || '%')
  LIMIT 1;
$$;