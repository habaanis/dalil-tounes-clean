-- Merchant push is separate from public boutique follower subscriptions.
-- No client-side reads/writes; the authenticated Edge Function verifies ownership.
create table if not exists public.dalil_boutique_merchant_push_subscriptions (
 id uuid primary key default gen_random_uuid(),
 entreprise_id text not null,
 user_id uuid not null references auth.users(id) on delete cascade,
 endpoint text not null,
 p256dh text not null,
 auth text not null,
 created_at timestamptz not null default now(),
 last_seen_at timestamptz not null default now(),
 unique (entreprise_id,user_id,endpoint)
);
create index if not exists dalil_merchant_push_owner_idx
 on public.dalil_boutique_merchant_push_subscriptions (entreprise_id,user_id);
alter table public.dalil_boutique_merchant_push_subscriptions enable row level security;
revoke all on public.dalil_boutique_merchant_push_subscriptions from anon,authenticated;
-- Intentionally no public RLS policies: service_role access only after JWT verification.
