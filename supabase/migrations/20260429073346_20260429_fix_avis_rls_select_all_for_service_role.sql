/*
  # Fix RLS avis_entreprise — SELECT complet pour service_role + public approved

  1. Changements
    - Supprime l'ancienne politique SELECT publique (approved only)
    - Recrée une politique SELECT pour le public : uniquement status = 'approved'
    - Ajoute une politique SELECT pour service_role : tous les avis sans restriction
    - Les politiques UPDATE/DELETE service_role existantes sont conservées

  2. Résultat
    - Visiteurs du site voient uniquement les avis approuvés
    - La page admin (/admin/super-moderation) lit avec service_role et voit TOUT
*/

-- Supprimer l'ancienne politique SELECT
DROP POLICY IF EXISTS "Approved avis visible to all" ON avis_entreprise;
DROP POLICY IF EXISTS "Service role can select all avis" ON avis_entreprise;

-- Politique SELECT publique : uniquement les avis approuvés
CREATE POLICY "Approved avis visible to all"
  ON avis_entreprise
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Politique SELECT service_role : tous les avis (pour la page admin)
CREATE POLICY "Service role can select all avis"
  ON avis_entreprise
  FOR SELECT
  TO service_role
  USING (true);
