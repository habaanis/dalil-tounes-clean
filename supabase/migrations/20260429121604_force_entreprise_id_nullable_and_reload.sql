/*
  # Avis entreprise — forcer entreprise_id nullable + reload PostgREST

  1. Contexte
    - Le client reçoit encore une erreur "null value in column entreprise_id violates not-null constraint"
      alors que la colonne est censée être nullable.
    - Probablement un cache PostgREST.

  2. Changements
    - Ré-applique ALTER COLUMN ... DROP NOT NULL (idempotent).
    - Notifie PostgREST pour recharger le schéma.

  3. Sécurité
    - Aucun changement RLS.
*/

ALTER TABLE avis_entreprise ALTER COLUMN entreprise_id DROP NOT NULL;

NOTIFY pgrst, 'reload schema';
