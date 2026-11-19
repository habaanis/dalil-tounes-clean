-- DESIGN ONLY. Do NOT apply until the sandbox onboarding/secret-store review is approved.
-- Every merchant receives funds into their own verified Konnect receiver wallet.
-- Credential references point to a secure secret store; NEVER put API keys in public tables.
create table if not exists public.dalil_boutique_merchant_payment_accounts (
  entreprise_id text primary key references public.entreprise(id) on delete cascade,
  provider text not null default 'konnect' check (provider = 'konnect'),
  receiver_wallet_id text not null check (receiver_wallet_id ~ '^[a-zA-Z0-9_-]{8,100}$'),
  credential_secret_ref text not null check (char_length(credential_secret_ref) between 8 and 160),
  environment text not null default 'sandbox' check (environment in ('sandbox','production')),
  verified_at timestamptz,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint direct_merchant_activation_requires_verification check (
    not enabled or verified_at is not null
  )
);
-- A payment request is always tied to its original order and verified merchant wallet.
-- Separate attempts allow a deposit followed by its balance; no direct browser access.
create table if not exists public.dalil_boutique_payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.dalil_boutique_customer_orders(id) on delete cascade,
  entreprise_id text not null references public.entreprise(id),
  provider text not null default 'konnect' check (provider = 'konnect'),
  receiver_wallet_id text not null,
  environment text not null check (environment in ('sandbox','production')),
  kind text not null check (kind in ('deposit','balance','full')),
  expected_millimes bigint not null check (expected_millimes > 0),
  provider_payment_ref text unique,
  status text not null default 'pending' check (status in ('pending','verified','failed','expired')),
  verified_millimes bigint not null default 0 check (verified_millimes >= 0),
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  constraint payment_attempt_never_overpaid check (verified_millimes <= expected_millimes),
  constraint payment_attempt_verification_consistency check (
    (status='verified' and verified_at is not null and provider_payment_ref is not null)
    or (status<>'verified' and verified_at is null and verified_millimes=0)
  )
);
create index if not exists dalil_boutique_payment_attempts_order_idx
  on public.dalil_boutique_payment_attempts(order_id,created_at desc);
alter table public.dalil_boutique_merchant_payment_accounts enable row level security;
alter table public.dalil_boutique_payment_attempts enable row level security;
revoke all on public.dalil_boutique_merchant_payment_accounts from anon,authenticated;
revoke all on public.dalil_boutique_payment_attempts from anon,authenticated;
-- Service-role-only write/read through audited server endpoints.
-- Do not create public policies or automatic paid-status triggers here.
