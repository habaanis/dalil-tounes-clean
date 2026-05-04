/*
  # Admin self-upsert + auto-provisioning whitelist

  1. Policies
    - Ajoute une policy INSERT sur `admins` : un utilisateur authentifié peut créer sa propre ligne admin
      SI son email est dans la whitelist (contact@dalil-tounes.com).
    - Ajoute une policy UPDATE équivalente (pour le upsert).

  2. Whitelist
    - La vérification se fait via auth.jwt() ->> 'email' comparé à la liste.
    - Ça permet au propriétaire principal de s'auto-enregistrer en admin depuis l'UI.
*/

DROP POLICY IF EXISTS "Admin whitelist self insert" ON admins;
CREATE POLICY "Admin whitelist self insert"
  ON admins FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND lower(coalesce(auth.jwt() ->> 'email', '')) IN ('contact@dalil-tounes.com')
  );

DROP POLICY IF EXISTS "Admin whitelist self update" ON admins;
CREATE POLICY "Admin whitelist self update"
  ON admins FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    AND lower(coalesce(auth.jwt() ->> 'email', '')) IN ('contact@dalil-tounes.com')
  )
  WITH CHECK (
    auth.uid() = id
    AND lower(coalesce(auth.jwt() ->> 'email', '')) IN ('contact@dalil-tounes.com')
  );
