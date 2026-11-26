import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';

let passed = 0;
const test = async (name, run) => { await run(); console.log('PASS', name); passed++; };
const id = 'ef6d9ad7-a4d8-4769-8be9-413a009d12ba';
const userId = 'a177cdbd-a87f-46df-82d2-97a811e11674';
const token = 'f8a4ee63-509c-4a49-9cfe-c175910476f8';
const requestId = 'ade1e2d9-93e0-4540-b299-d6b1f4ddc828';
const timestamp = '2026-11-26T11:00:00.000Z';
const clone = value => JSON.parse(JSON.stringify(value));
const status = state => ({ airtable: { status: state, attempts: 0, updated_at: timestamp }, notification: { status: state, attempts: 0, updated_at: timestamp } });
let queryHandler, rpcHandler, fetchHandler, authUser, adminAllowed, session, clientFetch;
const queries = [], rpcs = [], outgoing = [];
function query(table) {
  const data = { table, operations: [] }; queries.push(data);
  const chain = {};
  for (const name of ['select', 'eq', 'is', 'ilike', 'gt', 'limit', 'maybeSingle', 'single']) chain[name] = (...args) => { data.operations.push([name, ...args]); return chain; };
  chain.then = (resolve, reject) => Promise.resolve(queryHandler(data)).then(resolve, reject);
  return chain;
}
const db = {
  from: query,
  rpc: async (name, args) => { rpcs.push({ name, args }); return rpcHandler(name, args); },
  auth: {
    getUser: async bearer => { assert.notEqual(bearer, 'attacker-body-user-id'); return authUser ? { data: { user: { id: authUser } }, error: null } : { data: { user: null }, error: { message: 'anonymous' } }; },
    getSession: async () => ({ data: { session } }),
  },
};
function reset() {
  queries.length = 0; rpcs.length = 0; outgoing.length = 0; authUser = null; adminAllowed = false; session = null;
  queryHandler = () => ({ data: null, error: null });
  rpcHandler = (name) => name === 'dalil_registration_store'
    ? { data: { id, duplicate: false, integration_status: status('pending') }, error: null }
    : name === 'dalil_registration_claim_delivery' ? { data: null, error: null }
      : name === 'dalil_registration_refresh_delivery_status' ? { data: status('pending'), error: null }
        : { data: {}, error: null };
  fetchHandler = async () => { throw new Error('Unexpected external call'); };
  clientFetch = async () => new Response(JSON.stringify({ success: true, id, integration_status: status('ok') }), { status: 201 });
}
reset();
const handlers = new Map(), cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const exports = {}; cache.set(file, exports);
  const js = ts.transpileModule(readFileSync(file, 'utf8'), { fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const context = {
    exports, module: { exports },
    require: spec => {
      if (spec.startsWith('jsr:')) return {};
      if (spec.startsWith('npm:@supabase/')) return { createClient: (_url, _key, options) => options?.global?.headers?.Authorization ? { ...db, rpc: async name => ({ data: name === 'dalil_registration_is_admin' && adminAllowed, error: null }) } : db };
      if (spec.endsWith('supabaseClient')) return { supabase: db, supabaseUrl: 'https://qa.invalid', supabaseAnonKey: 'qa-anon' };
      const resolved = path.resolve(path.dirname(file), spec);
      return load(path.extname(resolved) ? resolved : resolved + '.ts');
    },
    Deno: { env: { get: name => ({ SUPABASE_URL: 'https://qa.invalid', SUPABASE_SERVICE_ROLE_KEY: 'qa-service', SUPABASE_ANON_KEY: 'qa-anon', RESEND_API_KEY: 'qa-resend' })[name] }, serve: handler => handlers.set(file, handler) },
    fetch: async (...args) => { outgoing.push(args); return file.endsWith('/src/lib/businessRegistration.ts') ? clientFetch(...args) : fetchHandler(...args); },
    window: { location: { hostname: 'dalil-tounes.com' }, setTimeout, clearTimeout },
    process: { env: { VERCEL_ENV: 'preview' } },
    crypto: webcrypto, Request, Response, URL, TextEncoder, AbortController, AbortSignal, DOMException, Uint8Array, setTimeout, clearTimeout,
    console: { error() {}, log() {} },
  };
  vm.runInNewContext(js, context, { filename: file });
  return exports;
}

const validation = load('supabase/functions/_shared/companyRegistration.ts');
const delivery = load('supabase/functions/_shared/companyRegistrationDelivery.ts');
const frontend = load('src/lib/businessRegistration.ts');
const airtable = load('supabase/functions/_shared/airtableSuggestion.ts');
const proxy = load('api/preview-company-registration.ts').default;
const submitPath = path.resolve('supabase/functions/submit-company-registration/index.ts');
const notifyPath = path.resolve('supabase/functions/notify-form/index.ts');
const retryPath = path.resolve('supabase/functions/retry-company-registration-integrations/index.ts');
load(submitPath); load(notifyPath); load(retryPath);
const submit = handlers.get(submitPath), notify = handlers.get(notifyPath), retry = handlers.get(retryPath);
const request = (body, headers = {}) => new Request('https://qa.invalid/registration', { method: 'POST', headers: { origin: 'https://dalil-tounes.com', authorization: 'Bearer qa-anon', 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
const dossier = {
  schemaVersion: 1, assistance: 'autonomous', presentationModel: 'business', palette: 'prestige', openingStyle: 'photo',
  address: '1 rue de test', openingHours: 'Lundi : 09:00–18:00', googleMapsUrl: '', googleReviewsUrl: '', logoChoice: 'none', logoUrl: '',
  photoUrls: [], productsDescription: 'Service — 10 TND', activityDescription: 'Description de test', notes: 'Note conservée',
  socialLinks: { facebook: '', instagram: '', tiktok: '', youtube: '', linkedin: '', website: '', other: '', whatsapp: '+21620123456', googleBusiness: '' },
  selectedPlatforms: ['none'], preferredContactMethods: ['phone'], preferredContactTimes: ['anytime'],
};
const form = {
  mode: 'subscription', language: 'fr', sourcePage: 'subscription', requestId, elapsedMs: 3000, verificationField: '', selectedPlan: 'artisan',
  companyName: 'QA local uniquement', managerName: 'Responsable test', phone: '+21620123456', email: 'qa@example.invalid',
  governorate: 'Tunis', city: 'Tunis', sector: 'Commerce', website: '', facebook: '', instagram: '', whatsapp: '', selectedPlatforms: [],
  requestedBillingPeriod: 'one_time', requestedPaymentSchedule: '', preferredContactMethod: 'phone', preferredContactTime: 'anytime',
  message: 'Dossier de test sans envoi externe', consent: true, creationDossier: dossier,
};
await test('Artisan creation snapshot derives its identity and 30 TND price from validated fields', () => {
  const result = validation.validateRegistrationRequest(form); assert.equal(result.ok, true);
  assert.equal(result.value.creationDossier.plan, 'artisan'); assert.equal(result.value.creationDossier.companyName, form.companyName);
  assert.equal(result.value.creationDossier.pricing.totalAmount, 30); assert.equal(result.value.creationDossier.pricing.maintenanceAnnualAmount, 50);
});
await test('Premium and logo prices are 59 + 20 regardless of forged client amounts', () => {
  const result = validation.validateRegistrationRequest({ ...form, selectedPlan: 'premium', creationDossier: { ...dossier, logoChoice: 'create', presentationModel: null, palette: null, openingStyle: null, pricing: { totalAmount: 0 }, plan: 'artisan', email: 'attacker@invalid.test' } });
  assert.equal(result.ok, true); assert.equal(result.value.creationDossier.pricing.totalAmount, 79);
  assert.equal(result.value.creationDossier.email, form.email); assert.equal(result.value.creationDossier.presentationModel, null);
});
for (const [plan, allowed] of [['artisan', 5], ['premium', 10]]) {
  await test(`${plan} accepts exactly ${allowed} photos and rejects an extra photo server-side`, () => {
    const photos = Array.from({ length: allowed }, (_, i) => `https://images.example.invalid/${i}.jpg`);
    assert.equal(validation.validateRegistrationRequest({ ...form, selectedPlan: plan, creationDossier: { ...dossier, photoUrls: photos } }).ok, true);
    assert.equal(validation.validateRegistrationRequest({ ...form, selectedPlan: plan, creationDossier: { ...dossier, photoUrls: [...photos, 'https://images.example.invalid/extra.jpg'] } }).ok, false);
  });
}
await test('Artisan cannot bypass two social networks by hiding a third link', () => {
  const socialLinks = { ...dossier.socialLinks, facebook: 'https://facebook.com/qa', instagram: 'https://instagram.com/qa', tiktok: 'https://tiktok.com/@qa' };
  assert.equal(validation.validateRegistrationRequest({ ...form, creationDossier: { ...dossier, selectedPlatforms: ['facebook', 'instagram'], socialLinks } }).ok, false);
});
await test('Selected social networks require links and URL schemes are checked server-side', () => {
  assert.equal(validation.validateRegistrationRequest({ ...form, creationDossier: { ...dossier, selectedPlatforms: ['facebook'] } }).ok, false);
  assert.equal(validation.validateRegistrationRequest({ ...form, creationDossier: { ...dossier, photoUrls: ['javascript:alert(1)'] } }).ok, false);
});
await test('Legacy cached creation requests remain receivable with null dossier and no invented choices', () => {
  const legacy = { ...form }; delete legacy.creationDossier;
  const result = validation.validateRegistrationRequest(legacy); assert.equal(result.ok, true); assert.equal(result.value.creationDossier, null);
});
await test('Version, model, contact preferences and long fields fail explicitly instead of truncation', () => {
  for (const patch of [{ schemaVersion: 2 }, { presentationModel: null }, { preferredContactMethods: [] }, { notes: 'x'.repeat(1501) }]) {
    assert.equal(validation.validateRegistrationRequest({ ...form, creationDossier: { ...dossier, ...patch } }).ok, false);
  }
});
await test('Every existing translated model/palette label becomes its stable creation ID without loading showcase UI', () => {
  const selector = readFileSync('src/components/CvPresentationModelSelector.tsx', 'utf8');
  const paletteLabels = [...selector.matchAll(/^\s+(prestige|ivory|night): '([^']+)'/gm)];
  assert.equal(paletteLabels.length, 15);
  for (const [, expected, label] of paletteLabels) assert.equal(frontend.resolveCreationPalette(label), expected);
  const modelLabels = [...selector.matchAll(/^\s+(business|portfolio): '([^']+)'/gm)];
  assert.equal(modelLabels.length, 10);
  for (const [, expected, label] of modelLabels) assert.equal(frontend.resolveCreationModel(label), expected);
  assert.equal(frontend.resolveCreationPalette('unknown legacy color'), null);
});
await test('A full 10,000-character creation dossier plus server header reaches Airtable without truncation', () => {
  const message = 'x'.repeat(9988) + 'END-OF-NOTES';
  assert.equal(message.length, 10000);
  const validated = validation.validateRegistrationRequest({ ...form, message }); assert.equal(validated.ok, true);
  const row = load('supabase/functions/_shared/companyRegistrationRecord.ts').buildSuggestionRow(validated.value);
  assert.ok(row.message.length > 10000);
  const fields = airtable.buildAirtableFields({ ...row, id, created_at: timestamp });
  assert.equal(fields.Message, row.message); assert.equal(fields.Message.includes('END-OF-NOTES'), true);
  assert.equal(airtable.normalizeType('mise en relation candidat'), 'Mise en relation');
  assert.equal(airtable.normalizeSource('emploi'), 'Emploi');
});

await test('Spam and too-fast submission cannot return success or touch persistence', async () => {
  for (const patch of [{ verificationField: 'bot' }, { elapsedMs: 0 }]) {
    reset(); const response = await submit(request({ ...form, ...patch })); const body = await response.json();
    assert.equal(response.status, 422); assert.equal(body.success, false); assert.equal(body.code, 'submission_rejected'); assert.equal(rpcs.length, 0);
  }
});
await test('Storage failure and missing persisted ID never produce a successful receipt', async () => {
  for (const answer of [{ data: null, error: { code: 'DB_FAIL' } }, { data: { success: true }, error: null }]) {
    reset(); rpcHandler = () => answer; const response = await submit(request(form)); assert.equal(response.status, 500); assert.equal((await response.json()).success, false);
  }
});
await test('Server rate limiting returns 429 and an explicit retry interval', async () => {
  reset(); rpcHandler = () => ({ data: { error: 'rate_limited' }, error: null });
  const response = await submit(request(form)); assert.equal(response.status, 429); assert.equal(response.headers.get('retry-after'), '600'); assert.equal((await response.json()).success, false);
});
await test('A changed dossier under the same attempt ID returns conflict', async () => {
  reset(); rpcHandler = () => ({ data: { error: 'request_conflict' }, error: null }); const response = await submit(request(form)); assert.equal(response.status, 409); assert.equal((await response.json()).code, 'request_conflict');
});
await test('Persisted receipt remains truthful and recoverable when secondary work is pending', async () => {
  reset(); const response = await submit(request(form)); const body = await response.json();
  assert.equal(response.status, 201); assert.equal(body.id, id); assert.equal(body.success, true); assert.equal(body.integrations.notification, 'pending');
  assert.equal(rpcs.filter(call => call.name === 'dalil_registration_store').length, 1);
});
await test('Only the user verified from the bearer token can become requester_user_id', async () => {
  reset(); authUser = userId; await submit(request({ ...form, requester_user_id: 'attacker-body-user-id' }));
  assert.equal(rpcs.find(call => call.name === 'dalil_registration_store').args.p_requester_user_id, userId);
  reset(); await submit(request({ ...form, requester_user_id: userId }));
  assert.equal(rpcs.find(call => call.name === 'dalil_registration_store').args.p_requester_user_id, null);
});
await test('Retry fingerprints ignore elapsed time and old attempt IDs map deterministically to UUIDs', async () => {
  reset(); await submit(request({ ...form, requestId: 'legacy-1795600000000-abcdefghij' }));
  const first = clone(rpcs.find(call => call.name === 'dalil_registration_store').args);
  reset(); await submit(request({ ...form, requestId: 'legacy-1795600000000-abcdefghij', elapsedMs: 30000 }));
  const second = rpcs.find(call => call.name === 'dalil_registration_store').args;
  assert.equal(first.p_request_id, second.p_request_id); assert.match(first.p_request_id, /^[0-9a-f-]{36}$/); assert.equal(first.p_fingerprint, second.p_fingerprint);
});
await test('An old saved dossier returns its ID without creating jobs or replaying notification', async () => {
  reset(); const row = load('supabase/functions/_shared/companyRegistrationRecord.ts').buildSuggestionRow(validation.validateRegistrationRequest(form).value);
  queryHandler = () => ({ data: { id, message: row.message, telephone: form.phone, email: form.email, synced_to_airtable: true, integration_status: {} }, error: null });
  const response = await submit(request(form)); const body = await response.json(); assert.equal(response.status, 200); assert.equal(body.id, id); assert.equal(body.integrations.notification, 'unknown'); assert.equal(rpcs.length, 0); assert.equal(outgoing.length, 0);
});

await test('Client rejects bare success, missing/malformed ID, and a false body even with HTTP 200', async () => {
  for (const body of [{ success: true }, { success: true, id: 'fake' }, { success: false, id }, { success: 1, id }, null, []]) {
    reset(); clientFetch = async () => new Response(JSON.stringify(body));
    await assert.rejects(frontend.submitBusinessRegistration(form), error => error.code === 'server_error');
  }
});
await test('Client classifies 429, 422 rejection, conflict and invalid JSON explicitly', async () => {
  for (const [statusCode, body, expected] of [[429, { code: 'rate_limited' }, 'rate_limited'], [422, { code: 'submission_rejected' }, 'submission_rejected'], [409, { code: 'request_conflict' }, 'request_conflict'], [500, null, 'server_error']]) {
    reset(); clientFetch = async () => new Response(body ? JSON.stringify(body) : 'not-json', { status: statusCode });
    await assert.rejects(frontend.submitBusinessRegistration(form), error => error.code === expected);
  }
});
await test('Authenticated frontend sends its real session token and accepts only a persisted receipt', async () => {
  reset(); session = { access_token: 'verified-user-session' };
  clientFetch = async (_url, init) => { assert.equal(init.headers.Authorization, 'Bearer verified-user-session'); return new Response(JSON.stringify({ success: true, id })); };
  assert.equal((await frontend.submitBusinessRegistration(form)).id, id);
});

function mockClaim(channel, outcome = 'pending') {
  const states = status(outcome);
  rpcHandler = (name, args) => {
    if (name === 'dalil_registration_claim_delivery') return { data: args.p_channel === channel ? { token, payload: { id }, attempts: 1 } : null, error: null };
    if (name === 'dalil_registration_finish_delivery') { states[args.p_channel].status = args.p_status; return { data: clone(states), error: null }; }
    if (name === 'dalil_registration_refresh_delivery_status') return { data: clone(states), error: null };
    throw new Error('Unexpected RPC ' + name);
  };
  return states;
}
await test('Unclaimed jobs (already succeeded, running, unknown or legacy) cause no external calls', async () => {
  reset(); await delivery.deliverRegistrationIntegrations(db, 'https://qa.invalid', 'qa-service', id); assert.equal(outgoing.length, 0);
});
await test('Airtable failure is recoverable and does not invoke the successful notification channel', async () => {
  reset(); mockClaim('airtable'); fetchHandler = async () => new Response(JSON.stringify({ success: false }), { status: 502 });
  const result = await delivery.deliverRegistrationIntegrations(db, 'https://qa.invalid', 'qa-service', id); assert.equal(result.airtable.status, 'failed'); assert.equal(outgoing.length, 1);
});
await test('Notification timeout becomes unknown and certain rejection becomes failed', async () => {
  for (const [handler, expected] of [[async () => { throw new Error('timeout'); }, 'unknown'], [async () => new Response(JSON.stringify({ success: false, delivery: 'not_sent' }), { status: 502 }), 'failed']]) {
    reset(); mockClaim('notification'); fetchHandler = handler;
    const result = await delivery.deliverRegistrationIntegrations(db, 'https://qa.invalid', 'qa-service', id); assert.equal(result.notification.status, expected);
  }
});
await test('Delivery requires provider confirmation ID, not just HTTP success', async () => {
  reset(); mockClaim('notification'); fetchHandler = async () => new Response(JSON.stringify({ success: true }));
  const result = await delivery.deliverRegistrationIntegrations(db, 'https://qa.invalid', 'qa-service', id); assert.equal(result.notification.status, 'unknown');
});

const frozenNotification = { type: 'Nouvelle demande abonnement', data: { 'ID Supabase': id, Message: 'Original saved data' }, admin_url: '/admin/premium', received_at: timestamp };
await test('Notification requires a private live claim and cannot send forged caller content', async () => {
  reset(); const response = await notify(request({ registration_id: id, delivery_token: token, type: 'Forged' })); assert.equal(response.status, 403); assert.equal(outgoing.length, 0);
});
await test('Notification retries use the same idempotency key and byte-identical frozen email body', async () => {
  reset(); queryHandler = () => ({ data: { payload: clone(frozenNotification) }, error: null });
  fetchHandler = async () => new Response(JSON.stringify({ id: 'resend-confirmation' }));
  for (let count = 0; count < 2; count++) {
    const response = await notify(request({ registration_id: id, delivery_token: token, type: 'Forged', data: { Message: 'Injected' } })); assert.equal(response.status, 200);
  }
  assert.equal(outgoing.length, 2); assert.equal(outgoing[0][1].headers['Idempotency-Key'], `dalil-registration/${id}/admin-v1`); assert.equal(outgoing[0][1].body, outgoing[1][1].body);
  assert.equal(outgoing[0][1].body.includes('Original saved data'), true); assert.equal(outgoing[0][1].body.includes('Injected'), false);
});
await test('Other existing notification callers keep their normal path without registration jobs', async () => {
  reset(); fetchHandler = async () => new Response(JSON.stringify({ id: 'legacy-notification' }));
  const response = await notify(request({ type: 'Formulaire existant', data: { Message: 'Test local' } }));
  assert.equal(response.status, 200); assert.equal(queries.length, 0); assert.equal(outgoing[0][1].headers['Idempotency-Key'], undefined);
});
await test('Provider 429 is a certain failure; 409 and transport uncertainty require review', async () => {
  for (const [code, expected] of [[429, 'not_sent'], [409, 'unknown'], [500, 'unknown']]) {
    reset(); fetchHandler = async () => new Response('{}', { status: code });
    const result = await (await notify(request({ type: 'Test', data: { Message: 'Local' } }))).json(); assert.equal(result.delivery, expected);
  }
});
await test('Provider success without email ID is never reported as sent', async () => {
  reset(); fetchHandler = async () => new Response('{}'); const response = await notify(request({ type: 'Test', data: { Message: 'Local' } }));
  assert.equal(response.status, 502); assert.equal((await response.json()).delivery, 'unknown');
});
await test('Replay is denied to anonymous users and non-administrators before any delivery', async () => {
  reset(); assert.equal((await retry(request({ id }))).status, 401); authUser = userId; assert.equal((await retry(request({ id }))).status, 403); assert.equal(outgoing.length, 0);
});
await test('Authorized admin replay reads the requested dossier and returns stored statuses', async () => {
  reset(); authUser = userId; adminAllowed = true; queryHandler = () => ({ data: { id }, error: null });
  const response = await retry(request({ id })); assert.equal(response.status, 200); assert.equal((await response.json()).id, id);
  assert.ok(queries.some(query => query.operations.some(([name, field, value]) => name === 'eq' && field === 'id' && value === id)));
});

const previewRequest = body => ({ method: 'POST', headers: { origin: 'https://qa-preview.vercel.app', host: 'qa-preview.vercel.app', 'sec-fetch-site': 'same-origin', 'content-type': 'application/json', apikey: 'qa-anon', authorization: 'Bearer signed-user-session' }, body });
const previewResponse = () => {
  const value = { statusCode: 200, headers: {}, body: null };
  return { value, setHeader(name, field) { value.headers[name] = field; }, status(code) { value.statusCode = code; return this; }, json(body) { value.body = body; } };
};
await test('Preview proxy preserves verified requester token and upstream rate-limit details', async () => {
  reset(); fetchHandler = async (_url, init) => {
    assert.equal(init.headers.Authorization, 'Bearer signed-user-session'); assert.equal(init.headers.apikey, 'qa-anon');
    return new Response(JSON.stringify({ success: false, code: 'rate_limited' }), { status: 429, headers: { 'Retry-After': '600' } });
  };
  const response = previewResponse(); await proxy(previewRequest(form), response);
  assert.equal(response.value.statusCode, 429); assert.equal(response.value.headers['Retry-After'], '600'); assert.equal(response.value.body.code, 'rate_limited');
});
await test('Preview proxy accepts transport payloads above 30 KB and caps them at the Edge 64 KiB limit', async () => {
  reset(); fetchHandler = async () => new Response(JSON.stringify({ success: true, id }));
  const accepted = previewResponse(); await proxy(previewRequest({ mode: 'subscription', data: 'x'.repeat(35000) }), accepted); assert.equal(accepted.value.statusCode, 200);
  const rejected = previewResponse(); await proxy(previewRequest({ mode: 'subscription', data: 'x'.repeat(65536) }), rejected); assert.equal(rejected.value.statusCode, 413); assert.equal(outgoing.length, 1);
});
await test('Preview proxy refuses cross-origin requests before any forwarding', async () => {
  reset(); const payload = previewRequest(form); payload.headers.origin = 'https://another.invalid'; const response = previewResponse();
  await proxy(payload, response); assert.equal(response.value.statusCode, 403); assert.equal(outgoing.length, 0);
});

console.log(`Registration receipts: ${passed} checks passed; every external call was mocked.`);
