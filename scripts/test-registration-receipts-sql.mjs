import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const modulePath = process.env.PGLITE_MODULE;
if (!modulePath) throw new Error('Set PGLITE_MODULE to the isolated @electric-sql/pglite module. No production database is used.');
const { PGlite } = await import(pathToFileURL(modulePath).href);
const db = new PGlite();
let passed = 0;
const test = async (name, run) => { await run(); passed++; console.log('PASS', name); };
const queryOne = async (query, args = []) => (await db.query(query, args)).rows[0];
await db.exec(`
  create role anon; create role authenticated; create role service_role bypassrls;
  create schema auth; create table auth.users(id uuid primary key);
  create table public.suggestions_entreprises (
    id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
    nom_entreprise text, secteur text, ville text, contact_suggere text, email_suggesteur text,
    raison_suggestion text, statut text default 'en_attente', type_demande text, capacite_vehicule text,
    type_evenement text, date_evenement text, video_url text, pack_type text, image_url text,
    facebook_url text, instagram_url text, linkedin_url text, tiktok_url text, youtube_url text,
    submission_lang text default 'fr', titre_demande text, telephone text, email text, message text,
    source_page text, langue text, priorite text default 'Normale', airtable_record_id text,
    synced_to_airtable boolean default false, synced_at timestamptz
  );
  alter table public.suggestions_entreprises enable row level security;
  create policy old_public_insert on public.suggestions_entreprises for insert to anon, authenticated with check (true);
  grant usage on schema public to anon, authenticated, service_role;
  grant insert on public.suggestions_entreprises to anon, authenticated;
  grant all on public.suggestions_entreprises to service_role;
`);
await db.exec(readFileSync('supabase/migrations/20261126111211_dalil_registration_receipt_integrations.sql', 'utf8'));

const owner = randomUUID(); await db.query('insert into auth.users(id) values($1)', [owner]);
const baseRow = {
  titre_demande: 'Demande — Formule Artisan', telephone: '+21620123456', email: 'qa@example.invalid',
  message: 'Dossier local seulement', type_demande: 'demande_abonnement', source_page: 'subscription', langue: 'fr', priorite: 'Normale',
  nom_entreprise: 'QA isolated', secteur: 'Commerce', ville: 'Tunis', contact_suggere: 'Responsable test',
  email_suggesteur: 'qa@example.invalid', raison_suggestion: 'Dossier local seulement', pack_type: 'artisan',
  facebook_url: null, instagram_url: null, submission_lang: 'fr',
};
const notification = { type: 'Nouvelle demande abonnement', data: { Message: 'Dossier local seulement' }, admin_url: '/admin/premium' };
const dossier = { schemaVersion: 1, plan: 'artisan', presentationModel: 'business', palette: 'prestige', openingStyle: 'photo' };
const store = async (requestId, { fingerprint = 'a'.repeat(64), row = baseRow, creation = dossier, requester = owner, notify = notification } = {}) =>
  (await queryOne('select public.dalil_registration_store($1::uuid,$2::text,$3::jsonb,$4::jsonb,$5::uuid,$6::jsonb) as receipt', [requestId, fingerprint, JSON.stringify(row), creation === null ? null : JSON.stringify(creation), requester, JSON.stringify(notify)])).receipt;
const claim = async (id, channel) => (await queryOne('select public.dalil_registration_claim_delivery($1::uuid,$2::text) as result', [id, channel])).result;
const finish = async (id, channel, token, state, provider = null) => (await queryOne('select public.dalil_registration_finish_delivery($1::uuid,$2::text,$3::uuid,$4::text,$5::text,$6::text) as result', [id, channel, token, state, provider, state === 'ok' ? null : 'qa_failure'])).result;
const refresh = async id => (await queryOne('select public.dalil_registration_refresh_delivery_status($1::uuid) as result', [id])).result;

await test('Public forms retain old insert fields but cannot forge trusted receipt/dossier/user/status fields', async () => {
  for (const role of ['anon', 'authenticated']) {
    await db.exec(`set role ${role}`);
    try {
      await db.query('insert into public.suggestions_entreprises(nom_entreprise,source_page) values($1,$2)', ['Legacy form', 'other']);
      for (const [column, value, cast] of [['request_id', randomUUID(), 'uuid'], ['request_fingerprint', 'a'.repeat(64), 'text'], ['creation_dossier', '{}', 'jsonb'], ['requester_user_id', owner, 'uuid'], ['integration_status', '{}', 'jsonb']]) {
        await assert.rejects(db.query(`insert into public.suggestions_entreprises(${column}) values($1::${cast})`, [value]), /permission denied/);
      }
    } finally { await db.exec('reset role'); }
  }
});
await test('Job table and every delivery mutation RPC are unavailable to anon/authenticated', async () => {
  const signatures = ['dalil_registration_store(uuid,text,jsonb,jsonb,uuid,jsonb)', 'dalil_registration_refresh_delivery_status(uuid)', 'dalil_registration_claim_delivery(uuid,text)', 'dalil_registration_finish_delivery(uuid,text,uuid,text,text,text)'];
  for (const role of ['anon', 'authenticated']) {
    for (const signature of signatures) assert.equal((await queryOne('select has_function_privilege($1,$2,$3) as allowed', [role, 'public.' + signature, 'EXECUTE'])).allowed, false);
    assert.equal((await queryOne('select has_table_privilege($1,$2,$3) as allowed', [role, 'public.dalil_registration_integration_jobs', 'SELECT'])).allowed, false);
  }
});

let receipt, attempt = randomUUID();
await test('Service role atomically stores the dossier, verified requester and both pending jobs', async () => {
  await db.exec('set role service_role'); try { receipt = await store(attempt); } finally { await db.exec('reset role'); }
  assert.equal(receipt.duplicate, false); assert.equal(receipt.integration_status.airtable.status, 'pending');
  const saved = await queryOne('select request_id, request_fingerprint, requester_user_id, creation_dossier, statut from public.suggestions_entreprises where id=$1', [receipt.id]);
  assert.equal(saved.request_id, attempt); assert.equal(saved.requester_user_id, owner); assert.equal(saved.creation_dossier.presentationModel, 'business'); assert.equal(saved.statut, 'en_attente');
  assert.equal((await queryOne('select count(*)::int as n from public.dalil_registration_integration_jobs where suggestion_id=$1', [receipt.id])).n, 2);
});
await test('Same attempt returns one saved dossier and two jobs; modified content is a conflict', async () => {
  assert.equal((await store(attempt)).id, receipt.id); assert.equal((await store(attempt)).duplicate, true);
  assert.equal((await store(attempt, { fingerprint: 'b'.repeat(64) })).error, 'request_conflict');
  assert.equal((await queryOne('select count(*)::int as n from public.suggestions_entreprises where request_id=$1', [attempt])).n, 1);
  assert.equal((await queryOne('select count(*)::int as n from public.dalil_registration_integration_jobs where suggestion_id=$1', [receipt.id])).n, 2);
});
await test('Contact burst limit is enforced inside the transaction and existing attempts remain retryable', async () => {
  await store(randomUUID()); await store(randomUUID()); const blocked = await store(randomUUID());
  assert.equal(blocked.error, 'rate_limited'); assert.equal(blocked.retryAfterSeconds, 600);
  assert.equal((await store(attempt)).id, receipt.id);
});
await test('A delivery lease excludes concurrent claimers and contains the original frozen notification', async () => {
  const first = await claim(receipt.id, 'notification'); assert.ok(first.token); assert.equal(first.payload.data['ID Supabase'], receipt.id); assert.ok(first.payload.received_at);
  assert.equal(await claim(receipt.id, 'notification'), null);
  assert.equal((await refresh(receipt.id)).notification.status, 'running');
  const failed = await finish(receipt.id, 'notification', first.token, 'failed'); assert.equal(failed.notification.status, 'failed');
  const second = await claim(receipt.id, 'notification'); assert.notEqual(second.token, first.token); assert.equal(second.attempts, 2); assert.deepEqual(second.payload, first.payload);
  await finish(receipt.id, 'notification', first.token, 'ok', 'stale-result'); assert.equal((await refresh(receipt.id)).notification.status, 'running');
  await finish(receipt.id, 'notification', second.token, 'ok', 'accepted-provider-id'); assert.equal((await refresh(receipt.id)).notification.status, 'ok');
  assert.equal(await claim(receipt.id, 'notification'), null);
});
await test('Airtable failure can retry independently while successful notification remains untouched', async () => {
  const first = await claim(receipt.id, 'airtable'); await finish(receipt.id, 'airtable', first.token, 'failed');
  const second = await claim(receipt.id, 'airtable'); assert.equal(second.attempts, 2);
  const result = await finish(receipt.id, 'airtable', second.token, 'ok', 'rec-local'); assert.equal(result.airtable.status, 'ok'); assert.equal(result.notification.status, 'ok');
});
await test('Ambiguous notification outcome is kept for review and is never replayed', async () => {
  const other = await store(randomUUID(), { row: { ...baseRow, telephone: '+21620123457' } });
  const lease = await claim(other.id, 'notification'); await finish(other.id, 'notification', lease.token, 'unknown');
  assert.equal(await claim(other.id, 'notification'), null); assert.equal((await refresh(other.id)).notification.status, 'unknown');
});
await test('Expired leases recover Airtable, but protect uncertain email against duplicate delivery', async () => {
  const other = await store(randomUUID(), { row: { ...baseRow, telephone: '+21620123458' } });
  await claim(other.id, 'airtable'); await claim(other.id, 'notification');
  await db.query("update public.dalil_registration_integration_jobs set lease_expires_at=now()-interval '1 second' where suggestion_id=$1", [other.id]);
  const result = await refresh(other.id); assert.equal(result.airtable.status, 'failed'); assert.equal(result.notification.status, 'unknown');
  assert.ok(await claim(other.id, 'airtable')); assert.equal(await claim(other.id, 'notification'), null);
});
await test('Historical records with no delivery evidence are not enqueued by refresh or replay', async () => {
  const old = (await queryOne("insert into public.suggestions_entreprises(nom_entreprise,source_page) values('Old dossier','subscription') returning id")).id;
  assert.deepEqual(await refresh(old), {}); assert.equal(await claim(old, 'notification'), null);
  assert.equal((await queryOne('select count(*)::int as n from public.dalil_registration_integration_jobs where suggestion_id=$1', [old])).n, 0);
});
await test('Legacy cached input is stored with null structured dossier, never synthesized choices', async () => {
  const legacy = await store(randomUUID(), { row: { ...baseRow, telephone: '+21620123459' }, creation: null, requester: null });
  const saved = await queryOne('select creation_dossier,requester_user_id from public.suggestions_entreprises where id=$1', [legacy.id]);
  assert.equal(saved.creation_dossier, null); assert.equal(saved.requester_user_id, null);
});
await test('A failure while inserting a job rolls back the dossier and both jobs together', async () => {
  await db.exec(`create function public.qa_reject_delivery() returns trigger language plpgsql as $$ begin if new.channel='notification' then raise exception 'QA job failure'; end if; return new; end; $$;
    create trigger qa_reject_delivery before insert on public.dalil_registration_integration_jobs for each row execute function public.qa_reject_delivery();`);
  const failedAttempt = randomUUID();
  await assert.rejects(store(failedAttempt, { row: { ...baseRow, telephone: '+21620123460' } }), /QA job failure/);
  assert.equal((await queryOne('select count(*)::int as n from public.suggestions_entreprises where request_id=$1', [failedAttempt])).n, 0);
  await db.exec('drop trigger qa_reject_delivery on public.dalil_registration_integration_jobs; drop function public.qa_reject_delivery();');
});
await test('Untrusted row status/id cannot publish a dossier through the receipt RPC', async () => {
  const forgedId = randomUUID(); const result = await store(randomUUID(), { row: { ...baseRow, telephone: '+21620123461', id: forgedId, statut: 'valide' } });
  assert.notEqual(result.id, forgedId); assert.equal((await queryOne('select statut from public.suggestions_entreprises where id=$1', [result.id])).statut, 'en_attente');
});
await test('Invalid identity/fingerprint/schema cannot create partial receipts', async () => {
  await assert.rejects(store(randomUUID(), { requester: randomUUID(), row: { ...baseRow, telephone: '+21620123462' } }), /foreign key/);
  await assert.rejects(store(randomUUID(), { fingerprint: 'not-a-digest' }), /Invalid registration/);
  await assert.rejects(store(randomUUID(), { creation: { schemaVersion: 2 } }), /Invalid creation/);
});
await db.close();
console.log(`Registration PostgreSQL: ${passed} checks passed in isolated PGlite; no production writes.`);
