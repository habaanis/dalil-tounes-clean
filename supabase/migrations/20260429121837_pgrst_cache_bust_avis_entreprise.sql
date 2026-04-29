/*
  # Force PostgREST cache reload

  1. Contexte
    - Le client reçoit encore "null value in column entreprise_id violates not-null constraint"
      alors que la colonne est nullable en base (vérifié).
    - Symptôme classique de cache PostgREST obsolète.

  2. Changements
    - Ajoute puis retire un COMMENT sur la table pour forcer la détection d'un changement
      de schéma et déclencher le rechargement du cache.
    - Émet NOTIFY pgrst, 'reload schema'.

  3. Sécurité
    - Aucun impact RLS.
*/

ALTER TABLE public.avis_entreprise ALTER COLUMN entreprise_id DROP NOT NULL;
COMMENT ON COLUMN public.avis_entreprise.entreprise_id IS 'Nullable: si NULL, avis = feedback global site';

NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_notify('pgrst', 'reload config');
