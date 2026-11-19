-- Apply after 20261115223000_dalil_boutique_customer_orders.sql.
-- Harden request idempotence and payment consistency before first production activation.
-- No historical rows: this migration is staged alongside the still-unapplied registry.
ALTER TABLE public.dalil_boutique_customer_orders
  ADD COLUMN request_fingerprint text NOT NULL
    CHECK (request_fingerprint ~ '^[0-9a-f]{64}$');

ALTER TABLE public.dalil_boutique_customer_orders
  ADD CONSTRAINT dalil_order_payment_state_exact_amount CHECK (
    (payment_status IN ('not_requested','pending','failed')
      AND paid_amount = 0
      AND payment_verified_at IS NULL
      AND payment_provider IS NULL
      AND payment_reference IS NULL)
    OR
    (payment_status = 'partially_paid'
      AND kind = 'order' AND amount_total IS NOT NULL
      AND paid_amount > 0 AND paid_amount < amount_total
      AND payment_verified_at IS NOT NULL
      AND nullif(btrim(payment_provider),'') IS NOT NULL
      AND nullif(btrim(payment_reference),'') IS NOT NULL)
    OR
    (payment_status = 'paid'
      AND kind = 'order' AND amount_total IS NOT NULL
      AND paid_amount = amount_total
      AND payment_verified_at IS NOT NULL
      AND nullif(btrim(payment_provider),'') IS NOT NULL
      AND nullif(btrim(payment_reference),'') IS NOT NULL)
    OR
    (payment_status = 'refunded'
      AND payment_verified_at IS NOT NULL
      AND nullif(btrim(payment_provider),'') IS NOT NULL
      AND nullif(btrim(payment_reference),'') IS NOT NULL)
  );

-- Payment evidence remains writable only by a future trusted verification backend.
-- Never grant merchants or unauthenticated clients direct table UPDATE privileges.
COMMENT ON COLUMN public.dalil_boutique_customer_orders.request_fingerprint IS
 'Secret-derived digest of the full customer-submitted request; prevents idempotency-key reuse with changed contact/notes.';
