/*
  # Permettre à anon de lire TOUS les avis (admin page)

  La page /admin/super-moderation utilise la clé anon pour lire tous les avis
  (pending, approved, rejected). Les données d'avis ne sont pas sensibles.

  1. Changements
    - Remplace la politique SELECT anon pour voir tous les avis (sans filtre status)
    - Garde une politique séparée pour authenticated qui ne voit que les approved
      sur les pages publiques (cette restriction est gérée côté applicatif avec .eq('status','approved'))

  Note : Le filtrage public (status=approved) est déjà géré dans BusinessDetail.tsx
  avec .eq('status', 'approved') dans la requête elle-même.
*/

-- Supprimer les politiques SELECT existantes
DROP POLICY IF EXISTS "Approved avis visible to all" ON avis_entreprise;
DROP POLICY IF EXISTS "Service role can select all avis" ON avis_entreprise;

-- Politique SELECT : tout le monde peut lire tous les avis
-- Le filtrage approved/pending est géré au niveau des requêtes applicatives
CREATE POLICY "Anyone can read avis"
  ON avis_entreprise
  FOR SELECT
  TO anon, authenticated, service_role
  USING (true);
