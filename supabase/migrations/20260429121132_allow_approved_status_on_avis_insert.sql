/*
  # Avis entreprise — autoriser l'insert direct en statut 'approved'

  1. Contexte
    - La stratégie passe en affichage direct : les avis soumis via le formulaire
      doivent apparaitre immédiatement avec le statut 'approved'.
    - L'ancienne policy INSERT forçait `status = 'pending'`, ce qui provoquait
      une erreur 400 côté client lors d'un insert avec `status = 'approved'`.

  2. Sécurité
    - RLS reste activée.
    - Policies SELECT / UPDATE / DELETE inchangées.
    - Nouvelle policy INSERT : autorise les visiteurs anonymes et authentifiés
      à soumettre un avis avec status ∈ ('pending', 'approved').

  3. Notes
    - Aucun schema change, uniquement une politique.
*/

DROP POLICY IF EXISTS "Anyone can submit avis" ON avis_entreprise;

CREATE POLICY "Anyone can submit avis"
  ON avis_entreprise
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status IN ('pending', 'approved'));
