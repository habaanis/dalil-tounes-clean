-- Dalil Tounes customer orders and quote requests; independent from Lienora and subscriptions.
-- Staged schema only. No production data is altered until a separately approved migration.
CREATE TABLE public.dalil_boutique_customer_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise_id text NOT NULL REFERENCES public.entreprise(id),
  product_id uuid NOT NULL REFERENCES public.dalil_boutique_products(id),
  kind text NOT NULL CHECK (kind IN ('quote','order')),
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 100),
  product_title text NOT NULL CHECK (char_length(btrim(product_title)) BETWEEN 1 AND 200),
  currency text NOT NULL DEFAULT 'TND' CHECK (currency = 'TND'),
  unit_price numeric(12,3),
  amount_total numeric(14,3),
  customer_name text NOT NULL CHECK (char_length(btrim(customer_name)) BETWEEN 2 AND 120),
  customer_contact text NOT NULL CHECK (char_length(btrim(customer_contact)) BETWEEN 3 AND 250),
  customer_note text CHECK (char_length(customer_note) <= 1000),
  status text NOT NULL DEFAULT 'received'
    CHECK (status IN ('received','in_progress','confirmed','completed','rejected','cancelled')),
  payment_option text NOT NULL DEFAULT 'undecided'
    CHECK (payment_option IN ('undecided','deposit','full')),
  payment_status text NOT NULL DEFAULT 'not_requested'
    CHECK (payment_status IN ('not_requested','pending','partially_paid','paid','failed','refunded')),
  paid_amount numeric(14,3) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  payment_provider text,
  payment_reference text,
  payment_verified_at timestamptz,
  idempotency_key uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT dalil_boutique_customer_order_price_consistency CHECK (
    (kind='quote' AND unit_price IS NULL AND amount_total IS NULL) OR
    (kind='order' AND unit_price > 0 AND amount_total = unit_price*quantity)
  ),
  CONSTRAINT dalil_boutique_customer_order_payment_consistency CHECK (
    (payment_status IN ('partially_paid','paid','refunded') AND
      payment_verified_at IS NOT NULL AND payment_provider IS NOT NULL AND
      char_length(btrim(payment_provider)) > 0 AND
      payment_reference IS NOT NULL AND char_length(btrim(payment_reference)) > 0)
    OR payment_status IN ('not_requested','pending','failed')
  ),
  CONSTRAINT dalil_boutique_customer_order_paid_amount CHECK (
    paid_amount <= coalesce(amount_total, paid_amount)
  ),
  UNIQUE (entreprise_id,idempotency_key)
);
CREATE INDEX dalil_boutique_customer_orders_merchant_latest
  ON public.dalil_boutique_customer_orders (entreprise_id,created_at DESC);
ALTER TABLE public.dalil_boutique_customer_orders ENABLE ROW LEVEL SECURITY;
-- No direct frontend reads or writes. Edge Functions verify product/publication and ownership.
REVOKE ALL ON TABLE public.dalil_boutique_customer_orders FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.dalil_boutique_customer_orders TO service_role;
COMMENT ON TABLE public.dalil_boutique_customer_orders IS
 'Private Dalil Tounes customer quotes/orders. A WhatsApp click never changes operational or payment state. Payment fields must be set only by a future verified payment backend.';

-- Atomic anti-spam counter: store only rotating keyed SHA-256 fingerprints, no raw IP or contacts.
CREATE TABLE public.dalil_boutique_customer_order_limits (
  fingerprint text NOT NULL CHECK (fingerprint ~ '^[0-9a-f]{64}$'),
  window_start timestamptz NOT NULL,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 8),
  PRIMARY KEY (fingerprint,window_start)
);
ALTER TABLE public.dalil_boutique_customer_order_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.dalil_boutique_customer_order_limits FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE public.dalil_boutique_customer_order_limits TO service_role;
CREATE FUNCTION public.dalil_boutique_customer_limit_attempt(p_fingerprint text,p_window_start timestamptz)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $$
DECLARE current_attempts integer;
BEGIN
  IF p_fingerprint !~ '^[0-9a-f]{64}$' OR
     p_window_start > now()+interval '1 minute' OR
     p_window_start < now()-interval '15 minutes' THEN
    RETURN false;
  END IF;
  INSERT INTO public.dalil_boutique_customer_order_limits(fingerprint,window_start,attempts)
    VALUES(p_fingerprint,p_window_start,1)
  ON CONFLICT(fingerprint,window_start) DO UPDATE
    SET attempts=public.dalil_boutique_customer_order_limits.attempts+1
    WHERE public.dalil_boutique_customer_order_limits.attempts < 8
  RETURNING attempts INTO current_attempts;
  RETURN current_attempts IS NOT NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.dalil_boutique_customer_limit_attempt(text,timestamptz)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.dalil_boutique_customer_limit_attempt(text,timestamptz)
  TO service_role;
-- Deployment follow-up: configure purging rate fingerprints older than 48 hours,
-- and approve retention policy for personally identifying customer order records.
