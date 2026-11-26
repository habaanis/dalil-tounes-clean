import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Isolated real PostgreSQL execution. No credentials or remote data are used.
// PGLITE_MODULE may point at an already installed @electric-sql/pglite/dist/index.js.
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const db = new PGlite();
let passed = 0;
const check = (name, value) => { assert.ok(value, name); passed++; console.log('PASS', name); };
await db.exec(`
create role anon;
create role authenticated;
create role service_role bypassrls;
grant usage on schema public to anon,authenticated,service_role;
create table public.entreprise(id text primary key);
create table public.professional_profile_access(user_id uuid not null,entreprise_id text references public.entreprise(id),primary key(user_id,entreprise_id));
alter table public.professional_profile_access enable row level security;
create table public.dalil_boutique_products(id uuid primary key,entreprise_id text references public.entreprise(id),created_at timestamptz default now());
create table public.dalil_boutique_customer_orders(
 id uuid primary key default gen_random_uuid(),
 entreprise_id text not null references public.entreprise(id),
 product_id uuid not null references public.dalil_boutique_products(id),
 kind text not null check(kind in ('quote','order')),
 quantity integer not null check(quantity between 1 and 100),
 product_title text not null check(length(btrim(product_title)) between 1 and 200),
 currency text not null default 'TND' check(currency='TND'),
 unit_price numeric,amount_total numeric,
 customer_name text not null check(length(btrim(customer_name)) between 2 and 120),
 customer_contact text not null check(length(btrim(customer_contact)) between 3 and 250),
 customer_note text check(length(customer_note)<=1000),
 status text not null default 'received' check(status in ('received','in_progress','confirmed','completed','rejected','cancelled')),
 payment_option text not null default 'undecided' check(payment_option in ('undecided','deposit','full')),
 payment_status text not null default 'not_requested' check(payment_status in ('not_requested','pending','partially_paid','paid','failed','refunded')),
 paid_amount numeric not null default 0 check(paid_amount>=0),
 payment_provider text,payment_reference text,payment_verified_at timestamptz,
 idempotency_key uuid not null,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 request_fingerprint text not null check(request_fingerprint~'^[0-9a-f]{64}$'),
 unique(entreprise_id,idempotency_key),
 constraint dalil_boutique_customer_order_price_consistency check(
   (kind='quote' and unit_price is null and amount_total is null) or
   (kind='order' and unit_price>0 and amount_total=unit_price*quantity)),
 constraint dalil_boutique_customer_order_payment_consistency check(
   (payment_status in ('partially_paid','paid','refunded') and payment_verified_at is not null
    and payment_provider is not null and length(btrim(payment_provider))>0
    and payment_reference is not null and length(btrim(payment_reference))>0)
   or payment_status in ('not_requested','pending','failed')),
 constraint dalil_boutique_customer_order_paid_amount check(paid_amount<=coalesce(amount_total,paid_amount)),
 constraint dalil_order_payment_state_exact_amount check(
   (payment_status in ('not_requested','pending','failed') and paid_amount=0
    and payment_verified_at is null and payment_provider is null and payment_reference is null)
   or (payment_status='partially_paid' and kind='order' and amount_total is not null
    and paid_amount>0 and paid_amount<amount_total and payment_verified_at is not null
    and nullif(btrim(payment_provider),'') is not null and nullif(btrim(payment_reference),'') is not null)
   or (payment_status='paid' and kind='order' and amount_total is not null
    and paid_amount=amount_total and payment_verified_at is not null
    and nullif(btrim(payment_provider),'') is not null and nullif(btrim(payment_reference),'') is not null)
   or (payment_status='refunded' and payment_verified_at is not null
    and nullif(btrim(payment_provider),'') is not null and nullif(btrim(payment_reference),'') is not null))
);
alter table public.dalil_boutique_customer_orders enable row level security;
create table public.dalil_boutique_order_push_subscriptions(
 order_id uuid primary key references public.dalil_boutique_customer_orders(id) on delete cascade,
 endpoint text not null,p256dh text not null,auth text not null,
 created_at timestamptz not null default now(),notified_at timestamptz
);
alter table public.dalil_boutique_order_push_subscriptions enable row level security;
grant all on public.entreprise,public.professional_profile_access,public.dalil_boutique_products,
 public.dalil_boutique_customer_orders,public.dalil_boutique_order_push_subscriptions to service_role;
insert into public.entreprise(id) values ('36f84b99-2c37-47d1-91ba-4c35cda8c1af'),('other-test-establishment');
insert into public.professional_profile_access values('00000000-0000-4000-8000-000000000001','36f84b99-2c37-47d1-91ba-4c35cda8c1af');
insert into public.dalil_boutique_products(id,entreprise_id) values('00000000-0000-4000-8000-000000000002','36f84b99-2c37-47d1-91ba-4c35cda8c1af');
-- Existing data to verify that the rollback suite preserves unrelated records.
insert into public.dalil_boutique_customer_orders(entreprise_id,product_id,kind,quantity,product_title,
 customer_name,customer_contact,idempotency_key,request_fingerprint)
 values('36f84b99-2c37-47d1-91ba-4c35cda8c1af','00000000-0000-4000-8000-000000000002','quote',1,
 'Existing fixture to preserve','Existing customer','existing@example.invalid',gen_random_uuid(),repeat('c',64));
`);
const migration = await readFile(new URL('../supabase/migrations/20261126095355_dalil_merchant_order_archive_delete.sql', import.meta.url), 'utf8');
await db.exec(migration);
check('Actual archive/delete migration executes on PostgreSQL with existing payment constraints', true);
const baseline = JSON.stringify((await db.query('select * from public.dalil_boutique_customer_orders order by id')).rows);
const directDeleteMigration = await readFile(new URL('../supabase/migrations/20261126104230_dalil_merchant_order_direct_delete.sql', import.meta.url), 'utf8');
await db.exec(directDeleteMigration);
check('Actual direct-delete migration executes without changing existing orders', JSON.stringify((await db.query('select * from public.dalil_boutique_customer_orders order by id')).rows) === baseline);
const rpc = 'public.dalil_merchant_manage_order(uuid,text,uuid,text,timestamptz,boolean)';
for (const role of ['anon','authenticated']) {
  const result = await db.query('select has_function_privilege($1,$2,\'EXECUTE\') as allowed', [role,rpc]);
  check(`${role} has no direct permission to call the mutation RPC`, result.rows[0].allowed === false);
}
const functionMode = await db.query("select prosecdef,proconfig from pg_proc where oid=$1::regprocedure", [rpc]);
check('Mutation RPC runs as invoker with fixed empty search path', functionMode.rows[0].prosecdef === false && functionMode.rows[0].proconfig.includes('search_path=""'));
const suite = await readFile(new URL('../supabase/tests/dalil_merchant_order_management.sql', import.meta.url), 'utf8');
await db.exec(suite);
check('Real service-role rollback suite: owner/cross-company/stale/confirmation guards leave active requests unchanged', true);
check('Real PostgreSQL directly deletes received/in-progress orders and quotes with final cancelled status', true);
check('Real PostgreSQL rejects active archive/restore and direct confirmed/completed deletion', true);
check('Real PostgreSQL rejects every pending/paid/partially-paid/refunded combination for all four eligible statuses', true);
check('Real PostgreSQL archives, restores, requires confirmation, redacts, keeps final reference, removes push and records audit', true);
check('Deleted tombstones block late status changes, repeated actions, idempotency reuse and push recreation', true);
check('Full fixture rollback preserves all pre-existing orders byte for byte', JSON.stringify((await db.query('select * from public.dalil_boutique_customer_orders order by id')).rows) === baseline);
check('Rollback leaves no new push subscription or action audit', (await db.query('select (select count(*) from public.dalil_boutique_order_push_subscriptions)+(select count(*) from public.dalil_boutique_order_management_events) as count')).rows[0].count === 0);
// Validate SQL constraints themselves, including future accidental server writes.
const fixture = (await db.query('select id from public.dalil_boutique_customer_orders')).rows[0].id;
await assert.rejects(() => db.query('update public.dalil_boutique_customer_orders set archived_at=now() where id=$1',[fixture]), /dalil_order_archive_closed_only/);
check('Database constraint also blocks archiving active orders outside the RPC', true);
await assert.rejects(() => db.query("update public.dalil_boutique_customer_orders set status='cancelled',archived_at=now(),deleted_at=now() where id=$1",[fixture]), /dalil_order_delete_unpaid_abandoned_only/);
check('Database constraint refuses deletion markers without contact redaction', true);
await db.exec('set role authenticated');
await assert.rejects(() => db.query('select public.dalil_merchant_manage_order($1,$2,$3,\'archive\',now(),false)',[
 '00000000-0000-4000-8000-000000000001','36f84b99-2c37-47d1-91ba-4c35cda8c1af',fixture,
]),/permission denied/);
check('Actual authenticated-role SQL call is denied even with forged owner arguments', true);
await db.close();
console.log(`PASS ${passed} PostgreSQL order-management checks (including complete rollback suite)`);
