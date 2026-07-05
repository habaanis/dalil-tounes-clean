CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES entreprise(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_email TEXT,
  business_phone TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  requested_date DATE NOT NULL,
  requested_time TEXT NOT NULL,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'business_detail',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Public insert (no auth required — visitors book without accounts)
CREATE POLICY "insert_reservation_public" ON reservations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only service role can read/update/delete (admin backend)
CREATE POLICY "select_reservations_service" ON reservations FOR SELECT
  TO service_role USING (true);

CREATE POLICY "update_reservations_service" ON reservations FOR UPDATE
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "delete_reservations_service" ON reservations FOR DELETE
  TO service_role USING (true);

CREATE INDEX idx_reservations_business_id ON reservations(business_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_created_at ON reservations(created_at DESC);