-- Drop FK constraint that requires business_id to exist in entreprise
ALTER TABLE public.reservations DROP CONSTRAINT IF EXISTS reservations_business_id_fkey;

-- Change business_id from uuid to text to accept any ID format (UUID, Airtable ID, slug)
ALTER TABLE public.reservations ALTER COLUMN business_id TYPE text USING business_id::text;

-- Allow null business_id for cases where ID is not available
ALTER TABLE public.reservations ALTER COLUMN business_id DROP NOT NULL;