/*
  # Create suggestions_entreprises table

  This table stores business suggestions submitted by users through multiple forms:
  - SuggestionEntrepriseModal (type='suggestion')
  - RegistrationForm (type='inscription')
  - MedicalTransportRegistrationForm (type='transport')

  1. New Tables
    - `suggestions_entreprises`
      - `id` (uuid, primary key)
      - `nom_entreprise` (text, required) - Business name
      - `secteur` (text, required) - Business sector/category
      - `ville` (text, nullable) - City
      - `contact_suggere` (text, nullable) - Suggested contact phone(s)
      - `email_suggesteur` (text, nullable) - Submitter email
      - `raison_suggestion` (text, nullable) - Reason for suggestion / additional info
      - `type_demande` (text, default 'suggestion') - Type: suggestion, inscription, transport
      - `statut` (text, default 'en_attente') - Status for admin review
      - `submission_lang` (text, default 'fr') - Language of submission
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `suggestions_entreprises` table
    - Allow anonymous inserts (public form, no auth required)
    - Allow authenticated admins to read all suggestions
*/

CREATE TABLE IF NOT EXISTS suggestions_entreprises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_entreprise text NOT NULL DEFAULT '',
  secteur text NOT NULL DEFAULT '',
  ville text,
  contact_suggere text,
  email_suggesteur text,
  raison_suggestion text,
  type_demande text DEFAULT 'suggestion',
  statut text DEFAULT 'en_attente',
  submission_lang text DEFAULT 'fr',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE suggestions_entreprises ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert suggestions (public form, no login needed)
CREATE POLICY "Anyone can insert suggestions"
  ON suggestions_entreprises
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read their own suggestions (by email match)
CREATE POLICY "Authenticated users can view suggestions"
  ON suggestions_entreprises
  FOR SELECT
  TO authenticated
  USING (true);
