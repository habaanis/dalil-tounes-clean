import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Isolated PostgreSQL fixtures: no live accounts, email, payments or publication.
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const db = new PGlite();
const admin = '00000000-0000-4000-8000-000000000001';
const superAdmin = '00000000-0000-4000-8000-000000000002';
const owner = '00000000-0000-4000-8000-000000000003';
const other = '00000000-0000-4000-8000-000000000004';
const unverified = '00000000-0000-4000-8000-000000000005';
const banned = '00000000-0000-4000-8000-000000000006';
const replacement = '00000000-0000-4000-8000-000000000007';
let passed = 0;
function ok(name, condition) { assert.ok(condition, name); console.log('PASS', name); passed++; }
async function rejects(name, fn, pattern = /permission denied|Accès|row-level security|rôle/) {
  await assert.rejects(fn, pattern); console.log('PASS', name); passed++;
}
async function scalar(sql, params = []) { return (await db.query(sql, params)).rows[0]?.result; }
async function asUser(id, role = 'authenticated') {
  await db.exec('reset role');
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id || '']);
  await db.exec(`set role ${role}`);
}
const requestId = n => `10000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
async function seedRequest(n, email, options = {}) {
  await db.exec('reset role');
  await db.query('insert into public.entreprise(id) values($1)', [`business-${n}`]);
  await db.query(`insert into public.dalil_miniapp_onboarding
    (suggestion_id,entreprise_id,owner_email,confirmed_plan,payment_confirmed_at,published_at,
      payment_confirmed_by,published_by,owner_user_id,owner_linked_at)
    values($1,$2,$3,$4,$5,$6,$7,$7,$8,$9)`, [requestId(n), `business-${n}`, email,
    options.plan === null ? null : 'premium', options.unpaid ? null : '2026-11-26T00:00:00Z',
    options.unpublished ? null : '2026-11-26T00:00:00Z', admin,
    options.boundTo || null, options.boundTo ? '2026-11-26T00:00:00Z' : null]);
}
async function link(n, version = 1) {
  return scalar('select public.dalil_admin_registration_link_account($1,$2) result', [requestId(n), version]);
}
async function claim() { return scalar('select public.dalil_claim_my_miniapps() result'); }
async function inspect(n) {
  await db.exec('reset role');
  return scalar('select to_jsonb(x) result from public.dalil_miniapp_onboarding x where suggestion_id=$1', [requestId(n)]);
}

await db.exec(`
  create role anon; create role authenticated; create role service_role bypassrls;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as
    $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
  grant usage on schema public,auth to anon,authenticated,service_role;
  create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,
    is_anonymous boolean default false,deleted_at timestamptz,banned_until timestamptz);
  create table public.admins(id uuid primary key references auth.users,email text,role text default 'admin');
  create table public.profiles(id uuid primary key references auth.users,role text not null default 'user',display_name text);
  create table public.commerciaux(id uuid primary key,actif boolean default true);
  alter table public.admins enable row level security;
  alter table public.profiles enable row level security;
  create policy "Full access" on public.admins for all to authenticated using(true);
  create policy "Admins sont visibles par les authentifiés" on public.admins for select to authenticated using(true);
  create policy self_select on public.profiles for select to authenticated using(id=auth.uid());
  create policy self_update on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
  create policy self_insert on public.profiles for insert to authenticated with check(id=auth.uid());
  grant all on public.admins,public.profiles,public.commerciaux to anon,authenticated,service_role;
  grant update(role) on public.admins to authenticated;
  create table public.entreprise(id text primary key);
  create table public.professional_profile_access(user_id uuid references auth.users,entreprise_id text,
    granted_by uuid references auth.users,granted_at timestamptz default now(),primary key(user_id,entreprise_id));
  alter table public.professional_profile_access enable row level security;
  create policy own_access on public.professional_profile_access for select to authenticated using(user_id=auth.uid());
  grant select on public.professional_profile_access to authenticated;
  create table public.dalil_miniapp_onboarding(suggestion_id uuid primary key,
    entreprise_id text unique references public.entreprise,company_created boolean default true,
    owner_email text,reviewed_dossier jsonb default '{}',version int not null default 1,
    confirmed_plan text,payment_amount numeric,payment_reference text,payment_received_at timestamptz,
    payment_confirmed_at timestamptz,payment_confirmed_by uuid,published_at timestamptz,published_by uuid,
    owner_linked_at timestamptz,owner_user_id uuid,created_at timestamptz default now(),updated_at timestamptz default now());
  alter table public.dalil_miniapp_onboarding enable row level security;
  create table public.dalil_miniapp_onboarding_events(id uuid default gen_random_uuid(),
    suggestion_id uuid,action text,actor_id uuid,details jsonb default '{}',created_at timestamptz default now());
  alter table public.dalil_miniapp_onboarding_events enable row level security;
  create function public.dalil_registration_snapshot(p_id uuid) returns jsonb language sql stable security definer set search_path='' as
    $$select to_jsonb(r) from public.dalil_miniapp_onboarding r where suggestion_id=p_id$$;
  revoke all on function public.dalil_registration_snapshot(uuid) from public,anon,authenticated;
`);
for (const [id,email,role,confirmed] of [
  [admin,'admin@example.invalid','admin',true], [superAdmin,'super@example.invalid','super_admin',true],
  [owner,'owner@example.invalid',null,true], [other,'other@example.invalid',null,true],
  [unverified,'pending@example.invalid',null,false], [banned,'banned@example.invalid',null,true],
  [replacement,'replacement@example.invalid',null,true],
]) {
  await db.query('insert into auth.users(id,email,email_confirmed_at) values($1,$2,$3)', [id,email,confirmed?'2026-11-26T00:00:00Z':null]);
  await db.query('insert into public.profiles(id) values($1)', [id]);
  if (role) await db.query('insert into public.admins values($1,$2,$3)', [id,email,role]);
}
await db.query("update auth.users set banned_until='2099-01-01' where id=$1", [banned]);
await db.exec(await readFile(new URL('../supabase/migrations/20261126110745_dalil_registration_admin_authority.sql', import.meta.url), 'utf8'));
await db.exec(await readFile(new URL('../supabase/migrations/20261126110828_dalil_miniapp_owner_account_claim.sql', import.meta.url), 'utf8'));
ok('The two existing admins and their roles are preserved', await scalar("select count(*)=2 and count(*) filter(where role='super_admin')=1 result from public.admins"));
await asUser(admin); ok('Persisted admin remains authorized', await scalar('select public.dalil_registration_is_admin() result'));
await asUser(superAdmin); ok('Persisted super_admin remains authorized', await scalar('select public.dalil_registration_is_admin() result'));
await asUser(owner); ok('Ordinary professional is not an admin', !await scalar('select public.dalil_registration_is_admin() result'));
await rejects('A professional cannot add themselves to admins', () => db.query('insert into public.admins values($1,$2,$3)', [owner,'owner@example.invalid','admin']));
await rejects('Explicit column grants cannot update admin roles', () => db.query("update public.admins set role='super_admin' where id=$1", [admin]));
await rejects('Admin rows cannot be deleted by browser users', () => db.exec('delete from public.admins'));
await rejects('Admin table cannot be truncated by browser users', () => db.exec('truncate public.admins'));
await rejects('Profiles cannot be truncated to erase role authority', () => db.exec('truncate public.profiles'));
await rejects('Commercials cannot be truncated by browser users', () => db.exec('truncate public.commerciaux'));
await rejects('Self profile update cannot promote role', () => db.query("update public.profiles set role='admin' where id=$1", [owner]));
await db.query('update public.profiles set display_name=$1 where id=$2', ['Mon activité',owner]);
ok('Ordinary profile details remain editable', await scalar('select display_name=$1 result from public.profiles where id=$2', ['Mon activité',owner]));
await db.query("select set_config('request.jwt.claims',$1,false)", [JSON.stringify({role:'admin',email:'admin@example.invalid',user_metadata:{role:'super_admin'}})]);
ok('Editable claims and email hints cannot grant admin authority', !await scalar('select public.dalil_registration_is_admin() result'));
await rejects('Private linker is not directly callable', () => scalar('select public.dalil_link_reviewed_miniapp_owner($1,$2,$2) result', [requestId(1),owner]));
await asUser(null,'anon');
await rejects('Anonymous clients cannot call admin authority RPC', () => scalar('select public.dalil_registration_is_admin() result'));
await rejects('Anonymous clients cannot claim a mini-app', () => claim());

await seedRequest(1,'owner@example.invalid');
await seedRequest(2,'owner@example.invalid',{unpaid:true});
await seedRequest(3,'owner@example.invalid',{unpublished:true});
await seedRequest(4,'other@example.invalid');
await seedRequest(5,'pending@example.invalid');
await seedRequest(6,'owner@example.invalid');
await seedRequest(7,'owner@example.invalid',{plan:null});
await seedRequest(8,'banned@example.invalid');
await seedRequest(9,'owner@example.invalid',{boundTo:other});
await db.query('insert into public.professional_profile_access(user_id,entreprise_id) values($1,$2)', [other,'business-6']);
await asUser(other);
await rejects('Non-admin cannot approve another account link', () => link(1), /administrateur/);
await asUser(admin);
await rejects('Admin cannot link before payment approval', () => link(2), /paiement/);
await rejects('Admin cannot link before publication', () => link(3), /paiement/);
await rejects('Admin cannot link an unconfirmed email', () => link(5), /email confirmé/);
await rejects('Admin cannot overwrite another owner', () => link(6), /propriétaire/);
await rejects('Null plan cannot create ownership', () => link(7), /propriétaire/);
await rejects('Banned account cannot be linked', () => link(8), /email confirmé/);
await rejects('Durable owner UID cannot be silently changed', () => link(9), /propriétaire/);
await rejects('Stale unlinked dossier must be refreshed', () => link(1,99), /Actualisez/);
const linked = await link(1);
ok('Admin links a confirmed account after paid publication', linked.owner_user_id===owner && linked.version===2 && !!linked.owner_linked_at);
await link(1,1);
const afterRetry = await inspect(1);
ok('Admin retry is idempotent with old version', afterRetry.version===2 && await scalar('select count(*)=1 result from public.dalil_miniapp_onboarding_events where suggestion_id=$1',[requestId(1)]));
await asUser(admin);
await rejects('Expected version is mandatory even for repeated calls', () => link(1,null), /Actualisez/);
await asUser(unverified);
ok('Unconfirmed user claim requests confirmation without a grant', (await claim()).requires_confirmation===true);
await asUser(banned);
ok('Banned user cannot use an existing token to claim', (await claim()).claimed.length===0);
await asUser(owner);
const owned = await claim();
ok('Auto claim preserves own eligible link', owned.claimed.includes('business-1'));
ok('Unpaid and unpublished dossiers are excluded', !owned.claimed.includes('business-2') && !owned.claimed.includes('business-3'));
ok('Another owner email cannot be claimed', !owned.claimed.includes('business-4'));
ok('Ownership conflicts are preserved and reported', owned.conflicts===3 && !owned.claimed.includes('business-6') && !owned.claimed.includes('business-9'));
ok('Owner sees only their own access rows', (await db.query('select * from public.professional_profile_access')).rows.every(row=>row.user_id===owner));
await rejects('Owner cannot read private onboarding dossiers directly', () => db.exec('select * from public.dalil_miniapp_onboarding'));
await rejects('Owner cannot grant access directly', () => db.query('insert into public.professional_profile_access(user_id,entreprise_id) values($1,$2)',[owner,'business-4']));
await asUser(other);
const otherClaims = await claim();
ok('A different owner can claim only their own approved business', otherClaims.claimed.length===1 && otherClaims.claimed[0]==='business-4');
await claim();
const otherAfterRetry = await inspect(4);
ok('Automatic claim retry creates one event and one grant', otherAfterRetry.version===2 && await scalar('select count(*)=1 result from public.dalil_miniapp_onboarding_events where suggestion_id=$1',[requestId(4)]));
await db.query('update auth.users set email=$1 where id=$2',['changed@example.invalid',owner]);
await db.query('update auth.users set email=$1 where id=$2',['owner@example.invalid',replacement]);
await asUser(replacement);
const reusedEmail = await claim();
ok('Email reuse cannot steal a dossier already bound to another UID', !reusedEmail.claimed.includes('business-1'));
await db.exec('reset role');
ok('Original owner and financial/publication state survive failed claims', await scalar('select owner_user_id=$1 and payment_confirmed_at is not null and published_at is not null result from public.dalil_miniapp_onboarding where suggestion_id=$2',[owner,requestId(1)]));
await db.close();
console.log(`PASS ${passed} isolated PostgreSQL admin/ownership checks`);
