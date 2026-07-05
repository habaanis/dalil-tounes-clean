/*
  # Permet l'ajout rapide de commerciaux par l'admin

  1. Changements
    - La colonne `commerciaux.id` ne référence plus auth.users(id) directement.
      L'admin peut désormais créer une fiche commercial avant que la personne
      n'ait créé son compte Supabase.
    - Ajout d'une colonne `user_id` (uuid nullable, FK auth.users) qui servira
      à rattacher la fiche lorsque le commercial créera son compte.
    - Ajout de colonnes `email`, `telephone` pour un ajout rapide depuis l'UI.
    - Valeur par défaut `gen_random_uuid()` pour `id` afin que l'INSERT soit trivial.

  2. Sécurité
    - RLS déjà active. On ajoute une policy INSERT pour les admins (table admins
      ou whitelist email) via la fonction is_admin() existante.
*/

-- 1. Drop the FK constraint on commerciaux.id -> auth.users(id)
DO $$
DECLARE
  fk_name text;
BEGIN
  SELECT tc.constraint_name INTO fk_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.constraint_column_usage ccu
    ON tc.constraint_name = ccu.constraint_name
  WHERE tc.table_name = 'commerciaux'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_schema = 'auth'
    AND ccu.table_name = 'users';

  IF fk_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE commerciaux DROP CONSTRAINT %I', fk_name);
  END IF;
END $$;

-- 2. Set default for id
ALTER TABLE commerciaux ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Add user_id, email, telephone if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'commerciaux' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE commerciaux ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'commerciaux' AND column_name = 'email'
  ) THEN
    ALTER TABLE commerciaux ADD COLUMN email text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'commerciaux' AND column_name = 'telephone'
  ) THEN
    ALTER TABLE commerciaux ADD COLUMN telephone text DEFAULT '';
  END IF;
END $$;

-- 4. Policies: admin peut insérer / voir / mettre à jour / supprimer toute fiche
DROP POLICY IF EXISTS "Admin insere commerciaux" ON commerciaux;
CREATE POLICY "Admin insere commerciaux"
  ON commerciaux FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    OR lower(coalesce(auth.jwt() ->> 'email', '')) IN (
      'contact@dalil-tounes.com',
      'zenanis75@hotmail.com'
    )
  );

DROP POLICY IF EXISTS "Admin voit tous commerciaux" ON commerciaux;
CREATE POLICY "Admin voit tous commerciaux"
  ON commerciaux FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    OR lower(coalesce(auth.jwt() ->> 'email', '')) IN (
      'contact@dalil-tounes.com',
      'zenanis75@hotmail.com'
    )
  );

DROP POLICY IF EXISTS "Admin met a jour commerciaux" ON commerciaux;
CREATE POLICY "Admin met a jour commerciaux"
  ON commerciaux FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    OR auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    OR lower(coalesce(auth.jwt() ->> 'email', '')) IN (
      'contact@dalil-tounes.com',
      'zenanis75@hotmail.com'
    )
  )
  WITH CHECK (
    auth.uid() = id
    OR auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    OR lower(coalesce(auth.jwt() ->> 'email', '')) IN (
      'contact@dalil-tounes.com',
      'zenanis75@hotmail.com'
    )
  );

DROP POLICY IF EXISTS "Admin supprime commerciaux" ON commerciaux;
CREATE POLICY "Admin supprime commerciaux"
  ON commerciaux FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    OR lower(coalesce(auth.jwt() ->> 'email', '')) IN (
      'contact@dalil-tounes.com',
      'zenanis75@hotmail.com'
    )
  );
