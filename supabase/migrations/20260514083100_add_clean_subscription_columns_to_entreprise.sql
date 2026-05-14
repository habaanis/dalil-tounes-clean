/*
  # Colonnes d'abonnement sans espaces ni accents

  1. Contexte
    - Le code front utilisait "statut Abonnement" et "niveau priorité abonnement"
      (avec espaces et accent) directement dans les .select() PostgREST.
    - Ces colonnes n'existent pas dans la table `entreprise` cote Supabase
      → toutes les requetes echouent en HTTP 400.
    - Whalesync (Airtable → Supabase) ne synchronise donc rien dessus.

  2. Nouvelles colonnes (sans espace ni accent — compatibles PostgREST)
    - `statut_abonnement` (text) — valeur de l'abonnement (gratuit / artisan / premium / elite / decouverte).
    - `niveau_priorite_abonnement` (integer) — priorite de tri (plus eleve = en haut).

  3. Compatibilite Whalesync
    - Si Whalesync mappe ses champs Airtable sur ces nouveaux noms (sans espace),
      la synchronisation fonctionnera nativement.
    - Aucune destruction de donnees : ALTER TABLE ADD COLUMN IF NOT EXISTS.

  4. Securite
    - RLS deja active sur `entreprise` — pas de modification de policies.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'entreprise'
      AND column_name = 'statut_abonnement'
  ) THEN
    ALTER TABLE public.entreprise ADD COLUMN statut_abonnement text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'entreprise'
      AND column_name = 'niveau_priorite_abonnement'
  ) THEN
    ALTER TABLE public.entreprise ADD COLUMN niveau_priorite_abonnement integer;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS entreprise_statut_abonnement_idx
  ON public.entreprise (statut_abonnement);

CREATE INDEX IF NOT EXISTS entreprise_niveau_priorite_abonnement_idx
  ON public.entreprise (niveau_priorite_abonnement);
