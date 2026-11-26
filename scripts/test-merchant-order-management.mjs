import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { webcrypto, createHash } from 'node:crypto';
import ts from 'typescript';

const policyPath = 'supabase/functions/dalil-boutique-merchant-orders/order-policy.ts';
const merchantPath = 'supabase/functions/dalil-boutique-merchant-orders/index.ts';
const submitPath = 'supabase/functions/dalil-boutique-customer-submit/index.ts';
const policyJs = ts.transpileModule(readFileSync(policyPath, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const policyContext = { exports: {} };
vm.runInNewContext(policyJs, policyContext);
const { canDeleteOrder, orderCapabilities } = policyContext.exports;
let passed = 0;
const test = async (name, run) => { await run(); passed++; console.log('PASS', name); };
const clean = { status: 'cancelled', payment_status: 'not_requested', paid_amount: 0,
  payment_provider: null, payment_reference: null, payment_verified_at: null, archived_at: null, deleted_at: null };
await test('Cancelled and rejected unpaid requests may be removed', () => {
  assert.equal(canDeleteOrder(clean), true);
  assert.equal(canDeleteOrder({ ...clean, status: 'rejected', payment_status: 'failed' }), true);
});
for (const status of ['received', 'in_progress', 'confirmed', 'completed']) {
  await test(`${status} requests keep their records`, () => assert.equal(canDeleteOrder({ ...clean, status }), false));
}
for (const payment_status of ['pending', 'paid', 'partially_paid', 'refunded']) {
  await test(`${payment_status} payment prevents deletion`, () => assert.equal(canDeleteOrder({ ...clean, payment_status }), false));
}
for (const evidence of [{ paid_amount: 1 }, { payment_provider: 'bank' }, { payment_reference: 'ref' },
  { payment_verified_at: '2026-11-26T00:00:00Z' }, { deleted_at: '2026-11-26T00:00:00Z' }]) {
  await test(`Retain any payment/deletion evidence ${Object.keys(evidence)[0]}`, () => assert.equal(canDeleteOrder({ ...clean, ...evidence }), false));
}
await test('Completed history can archive and restore without becoming deletable', () => {
  const caps = orderCapabilities({ ...clean, status: 'completed', archived_at: '2026-11-26T00:00:00Z' });
  assert.equal(caps.can_restore, true); assert.equal(caps.can_archive, false); assert.equal(caps.can_delete, false);
});

const company = '36f84b99-2c37-47d1-91ba-4c35cda8c1af';
const actor = '11d8696f-4024-493f-8558-bb05f03a922e';
const orderId = '953bf78a-a747-47b9-ac60-1b9dec732221';
const updatedAt = '2026-11-26T08:00:00.000Z';
const serviceKey = 'qa-service-key-without-production-credentials';
const origin = 'https://app.dalil-tounes.com';
const queries = [];
let rpcCalls = [];
let queryAnswer = () => ({ data: null, error: null });
let rpcAnswer = () => ({ data: null, error: null });
let authAllowed = true;
function makeQuery(table) {
  const query = { table, operations: [] };
  queries.push(query);
  const chain = {};
  for (const name of ['select', 'eq', 'is', 'not', 'order', 'range', 'limit', 'maybeSingle', 'single', 'update', 'insert', 'delete', 'in']) {
    chain[name] = (...args) => { query.operations.push([name, ...args]); return chain; };
  }
  chain.then = (resolve, reject) => Promise.resolve(queryAnswer(query)).then(resolve, reject);
  return chain;
}
const db = {
  auth: { getUser: async () => authAllowed ? { data: { user: { id: actor } }, error: null } : { data: {}, error: new Error('invalid token') } },
  from: makeQuery,
  rpc: async (name, args) => { rpcCalls.push({ name, args }); return rpcAnswer(name, args); },
};
const handlerFor = (path) => {
  let handler;
  const source = readFileSync(path, 'utf8').replace(/^import .*?;\s*$/gm, '');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(js, {
    Deno: { env: { get: name => name === 'SUPABASE_URL' ? 'https://qa.invalid' : name === 'SUPABASE_SERVICE_ROLE_KEY' ? serviceKey : undefined }, serve: fn => { handler = fn; } },
    createClient: () => db, webpush: {}, orderCapabilities,
    Response, Request, URL, TextEncoder, crypto: webcrypto, console,
  });
  return handler;
};
const handler = handlerFor(merchantPath);
const request = (payload, extra = {}) => new Request('https://qa.invalid/merchant', {
  method: 'POST', headers: { origin, 'content-type': 'application/json', authorization: 'Bearer qa-user', ...extra }, body: JSON.stringify(payload),
});
const reset = () => {
  queries.length = 0; rpcCalls = []; authAllowed = true;
  queryAnswer = query => query.table === 'professional_profile_access' ? { data: { entreprise_id: company }, error: null } : { data: null, error: null };
  rpcAnswer = () => ({ data: null, error: null });
};
await test('Missing and invalid authentication never reach order mutations', async () => {
  reset();
  assert.equal((await handler(request({ action: 'delete', profileId: company }, { authorization: '' }))).status, 401);
  authAllowed = false;
  assert.equal((await handler(request({ action: 'delete', profileId: company }))).status, 401);
  assert.equal(rpcCalls.length, 0);
});
await test('Unapproved origin is rejected before authentication', async () => {
  reset(); assert.equal((await handler(request({}, { origin: 'https://attacker.invalid' }))).status, 403);
  assert.equal(queries.length, 0);
});
await test('A professional cannot operate on another establishment', async () => {
  reset(); queryAnswer = () => ({ data: null, error: null });
  assert.equal((await handler(request({ action: 'archive', profileId: 'other-business', id: orderId, expectedUpdatedAt: updatedAt }))).status, 403);
  assert.equal(rpcCalls.length, 0);
});
await test('Delete requires explicit confirmation on server', async () => {
  reset();
  assert.equal((await handler(request({ action: 'delete', profileId: company, id: orderId, expectedUpdatedAt: updatedAt }))).status, 400);
  assert.equal(rpcCalls.length, 0);
});
await test('Archive forwards verified actor and expected revision, never client actor', async () => {
  reset(); rpcAnswer = () => ({ data: { id: orderId, action: 'archive', archived_at: updatedAt }, error: null });
  const response = await handler(request({ action: 'archive', profileId: company, id: orderId, expectedUpdatedAt: updatedAt, userId: 'attacker', p_user_id: 'attacker' }));
  assert.equal(response.status, 200);
  assert.equal(rpcCalls[0].name, 'dalil_merchant_manage_order');
  assert.equal(rpcCalls[0].args.p_user_id, actor);
  assert.equal(rpcCalls[0].args.p_profile_id, company);
  assert.equal(rpcCalls[0].args.p_expected_updated_at, updatedAt);
});
for (const [code, message, expected] of [['23514', 'financial_history_protected', 409], ['40001', 'order_changed', 409], ['P0002', 'order_not_found', 404], ['42501', 'order_not_found', 403]]) {
  await test(`Server mutation rejects ${message} (${code})`, async () => {
    reset(); rpcAnswer = () => ({ data: null, error: { code, message } });
    const response = await handler(request({ action: 'delete', profileId: company, id: orderId, expectedUpdatedAt: updatedAt, confirmDelete: true }));
    assert.equal(response.status, expected);
    const data = await response.json(); assert.ok(data.error); assert.equal(data.order, undefined);
  });
}
await test('A missing mutation result never reports success', async () => {
  reset();
  assert.equal((await handler(request({ action: 'restore', profileId: company, id: orderId, expectedUpdatedAt: updatedAt }))).status, 503);
});
await test('Archive list is scoped, paginated, excludes deleted and withholds payment proofs', async () => {
  reset();
  queryAnswer = query => query.table === 'professional_profile_access' ? { data: { entreprise_id: company }, error: null } :
    { data: [{ ...clean, id: orderId, archived_at: updatedAt, payment_reference: 'private-reference' }], count: 51, error: null };
  const response = await handler(request({ action: 'list', profileId: company, archived: true, offset: 50 }));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.orders[0].can_restore, true); assert.equal(data.orders[0].can_delete, false);
  assert.equal('payment_reference' in data.orders[0], false);
  const query = queries.find(query => query.table === 'dalil_boutique_customer_orders');
  assert.ok(query.operations.some(op => op[0] === 'eq' && op[1] === 'entreprise_id' && op[2] === company));
  assert.ok(query.operations.some(op => op[0] === 'is' && op[1] === 'deleted_at' && op[2] === null));
  assert.ok(query.operations.some(op => op[0] === 'not' && op[1] === 'archived_at' && op[2] === 'is' && op[3] === null));
  assert.ok(query.operations.some(op => op[0] === 'range' && op[1] === 50 && op[2] === 99));
});
await test('Invalid pagination cannot reach the order table', async () => {
  reset();
  assert.equal((await handler(request({ action: 'list', profileId: company, offset: -1 }))).status, 400);
  assert.equal(queries.some(query => query.table === 'dalil_boutique_customer_orders'), false);
});
const submitHandler = handlerFor(submitPath);
await test('Replaying a deleted request returns 410 and cannot recreate it or notify anyone', async () => {
  reset();
  const payload = { profileId: company, productId: orderId, idempotencyKey: orderId, quantity: 1,
    name: 'QA customer', contact: 'qa@example.invalid', note: 'QA only' };
  const fingerprint = createHash('sha256').update('dalil-boutique-rate-limit-v1:' + serviceKey + ':request:' + JSON.stringify([
    payload.profileId, payload.productId, payload.quantity, payload.name, payload.contact, payload.note,
  ])).digest('hex');
  queryAnswer = () => ({ data: { id: orderId, kind: 'order', request_fingerprint: fingerprint, deleted_at: updatedAt }, error: null });
  const response = await submitHandler(request(payload));
  assert.equal(response.status, 410);
  assert.equal(queries.length, 1);
  assert.equal(queries[0].operations.some(op => op[0] === 'insert'), false);
  assert.equal(rpcCalls.length, 0);
});
console.log(`${passed} merchant order protection and endpoint tests passed.`);
