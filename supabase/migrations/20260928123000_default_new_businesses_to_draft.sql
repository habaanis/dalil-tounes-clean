-- Historical rows remain NULL and visible. Any newly inserted row starts
-- private unless the synchronizer explicitly receives "Publié" from Airtable.
ALTER TABLE public.entreprise
  ALTER COLUMN statut_publication SET DEFAULT 'Brouillon';
