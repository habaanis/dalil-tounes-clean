import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { build } from 'esbuild';

// Mount the real component with a simulated authenticated API. No external
// requests or real customer orders are used. Reuse the isolated QA runtime.
const require = createRequire(import.meta.url);
let reactRequire = require;
try { require.resolve('react-test-renderer'); }
catch { reactRequire = createRequire(path.resolve(process.env.DALIL_QA_RUNTIME || '../qa-runtime', 'package.json')); }
const React = reactRequire('react');
const { act, create } = reactRequire('react-test-renderer');

const bundle = await build({
  entryPoints: ['src/components/boutique/BoutiqueCustomerOrders.tsx'],
  bundle: true, write: false, format: 'cjs', platform: 'node', jsx: 'automatic',
  external: ['react', 'react/jsx-runtime'],
  plugins: [{ name: 'order-api-fixture', setup(builder) {
    builder.onResolve({ filter: /supabaseClient$/ }, () => ({ path: 'supabase', namespace: 'order-api-fixture' }));
    builder.onLoad({ filter: /.*/, namespace: 'order-api-fixture' }, () => ({ loader: 'js', contents: `
      export const supabaseUrl = 'https://orders.example.invalid';
      export const supabaseAnonKey = 'test-publishable-key';
      export const supabase = { auth: { async getSession() {
        return { data: { session: { access_token: 'test-access-token' } }, error: null };
      } } };
    ` }));
  } }],
});
const module = { exports: {} };
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(reactRequire, module, module.exports);
const Component = module.exports.default;
const profileId = 'orders-ui-fixture';
const initialTimestamp = '2026-11-26T09:00:00.000Z';
const changedTimestamp = '2026-11-26T10:00:00.000Z';
let nextId = 1;
const order = (status, extra = {}) => ({
  id: `${String(nextId++).padStart(8, '0')}-0000-4000-8000-000000000001`,
  kind: 'order', product_title: 'Produit de recette', quantity: 1,
  currency: 'TND', unit_price: 20, amount_total: 20,
  customer_name: 'Client de recette', customer_contact: 'client@example.invalid',
  customer_note: null, status, created_at: initialTimestamp, updated_at: initialTimestamp,
  archived_at: null, deleted_at: null,
  can_archive: ['completed', 'rejected', 'cancelled'].includes(status),
  can_restore: false, can_delete: ['received', 'in_progress', 'rejected', 'cancelled'].includes(status),
  ...extra,
});
const originalGlobals = { fetch: globalThis.fetch, window: globalThis.window, document: globalThis.document };
let state;
let renderer;
let passed = 0;
const pass = title => { passed++; console.log('PASS', title); };
const respond = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
globalThis.window = {
  confirm(message) { state.confirmations.push(message); return state.confirm; },
  setInterval() { return 1; }, clearInterval() {},
};
globalThis.document = { visibilityState: 'hidden', addEventListener() {}, removeEventListener() {} };
globalThis.fetch = async (url, request) => {
  assert.equal(url, 'https://orders.example.invalid/functions/v1/dalil-boutique-merchant-orders');
  assert.equal(request.method, 'POST');
  assert.equal(request.headers.authorization, 'Bearer test-access-token');
  const input = JSON.parse(request.body);
  state.calls.push(input);
  assert.equal(input.profileId, profileId);
  if (input.action === 'list') {
    const orders = state.orders.filter(row => !row.deleted_at && Boolean(row.archived_at) === input.archived);
    return respond({ profileId, archived: input.archived, orders, total: orders.length, hasMore: false });
  }
  if (state.waitForMutation) await state.waitForMutation;
  if (state.mode === 'serverError') return respond({ error: 'Cette commande a changé. Actualisez la liste.' }, 409);
  const row = state.orders.find(item => item.id === input.id);
  assert.ok(row, 'Mutation targets a displayed order');
  assert.equal(input.expectedUpdatedAt, row.updated_at);
  if (input.action === 'delete') {
    assert.equal(input.confirmDelete, true);
    assert.ok(row.can_delete, 'The UI only offers permitted deletion');
    const status = ['received', 'in_progress'].includes(row.status) ? 'cancelled' : row.status;
    if (state.mode === 'wrongStatus') return respond({ profileId, order: { ...row, action: 'delete', deleted_at: changedTimestamp } });
    if (state.mode === 'missingDeletion') return respond({ profileId, order: { ...row, action: 'delete', status } });
    if (state.mode === 'wrongProfile') return respond({ profileId: 'another-company', order: { ...row, action: 'delete', status, deleted_at: changedTimestamp } });
    Object.assign(row, { status, archived_at: changedTimestamp, deleted_at: changedTimestamp, updated_at: changedTimestamp });
  } else if (input.action === 'archive') {
    assert.ok(row.can_archive);
    Object.assign(row, { archived_at: changedTimestamp, updated_at: changedTimestamp, can_archive: false, can_restore: true });
  } else if (input.action === 'restore') {
    assert.ok(row.can_restore);
    Object.assign(row, { archived_at: null, updated_at: changedTimestamp, can_archive: true, can_restore: false });
  } else {
    assert.fail(`Unexpected separate status action: ${input.action}`);
  }
  return respond({ profileId, order: { ...row, action: input.action } });
};

const textContent = node => typeof node === 'string' ? node : node.children.map(textContent).join('');
const menuLabel = row => 'Actions pour la demande ' + row.id.slice(0, 8).toUpperCase();
const menus = row => renderer.root.findAllByProps({ 'aria-label': menuLabel(row) });
const options = row => menus(row)[0]?.findAllByType('option').map(node => node.props.value) || [];
const alerts = () => renderer.root.findAllByProps({ role: 'alert' });
const success = () => renderer.root.findAllByProps({ role: 'status' }).map(textContent).filter(text => text.includes('supprimée'));
const mutations = () => state.calls.filter(call => call.action !== 'list');
async function fixture(orders, extra = {}) {
  if (renderer) await act(async () => renderer.unmount());
  state = { orders: structuredClone(orders), calls: [], confirmations: [], confirm: true, mode: 'success', ...extra };
  await act(async () => { renderer = create(React.createElement(Component, { entrepriseIds: [profileId] })); });
  assert.equal(alerts().length, 0);
}
async function choose(row, action) {
  await act(async () => {
    menus(row)[0].props.onChange({ target: { value: action } });
    await new Promise(resolve => setImmediate(resolve));
  });
}

try {
  for (const status of ['received', 'in_progress']) {
    const row = order(status);
    await fixture([row]);
    assert.deepEqual(options(row), ['', 'delete']);
    assert.ok(renderer.root.findAllByType('button').some(node => textContent(node) === 'Confirmer'));
    await choose(row, 'delete');
    assert.equal(state.confirmations.length, 1);
    assert.match(state.confirmations[0], /annulée et retirée de vos listes en une seule action/);
    assert.match(state.confirmations[0], /statut « Annulée »/);
    assert.match(state.confirmations[0], /sans transaction ni paiement/);
    assert.deepEqual(mutations(), [{ action: 'delete', profileId, id: row.id, expectedUpdatedAt: row.updated_at, confirmDelete: true }]);
    assert.deepEqual(success(), ['Demande annulée et supprimée de vos listes.']);
    assert.equal(renderer.root.findAllByType('article').length, 0);
    assert.equal(state.orders[0].status, 'cancelled');
    pass(`${status}: Actions → Supprimer confirms once, sends one atomic request and refreshes the list`);
  }

  const cancelledByUser = order('received');
  await fixture([cancelledByUser], { confirm: false });
  await choose(cancelledByUser, 'delete');
  assert.equal(state.confirmations.length, 1);
  assert.equal(mutations().length, 0);
  assert.equal(renderer.root.findAllByType('article').length, 1);
  assert.equal(success().length, 0);
  pass('Dismissing the confirmation sends no mutation and preserves the displayed request');

  for (const status of ['rejected', 'cancelled']) {
    const row = order(status);
    await fixture([row]);
    assert.deepEqual(options(row), ['', 'archive', 'delete']);
    await choose(row, 'delete');
    assert.match(state.confirmations[0], /demande refusée ou annulée/);
    assert.doesNotMatch(state.confirmations[0], /sera annulée/);
    assert.deepEqual(success(), ['Demande supprimée de vos listes.']);
    assert.equal(state.orders[0].status, status);
  }
  pass('Rejected/cancelled requests keep their final customer status and existing deletion flow');

  const completed = order('completed');
  const confirmed = order('confirmed');
  const paidActive = order('in_progress', { can_delete: false });
  const paidClosed = order('cancelled', { can_delete: false });
  await fixture([completed, confirmed, paidActive, paidClosed]);
  assert.deepEqual(options(completed), ['', 'archive']);
  assert.deepEqual(options(paidClosed), ['', 'archive']);
  assert.equal(menus(confirmed).length, 0);
  assert.equal(menus(paidActive).length, 0);
  assert.ok(renderer.root.findAllByType('button').some(node => textContent(node) === 'Terminer'));
  await choose(completed, 'archive');
  assert.deepEqual(options(completed), ['', 'restore']);
  assert.match(textContent(renderer.root.findByType('summary')), /Commandes archivées \(1\)/);
  await choose(completed, 'restore');
  assert.deepEqual(options(completed), ['', 'archive']);
  assert.equal(state.orders.find(row => row.id === completed.id).status, 'completed');
  assert.deepEqual(mutations().map(call => call.action), ['archive', 'restore']);
  pass('Confirmed, completed and financially protected orders have no deletion option; archive/restore still work');

  const archived = order('cancelled', { archived_at: initialTimestamp, can_archive: false, can_restore: true });
  await fixture([archived]);
  assert.deepEqual(options(archived), ['', 'restore', 'delete']);
  await choose(archived, 'delete');
  assert.equal(renderer.root.findAllByType('article').length, 0);
  assert.match(textContent(renderer.root.findByType('summary')), /Commandes archivées \(0\)/);
  pass('Archived eligible requests retain Restore/Delete and disappear from archives after confirmed deletion');

  for (const mode of ['serverError', 'wrongStatus', 'missingDeletion', 'wrongProfile']) {
    const row = order('received');
    await fixture([row], { mode });
    await choose(row, 'delete');
    assert.equal(alerts().length, 1, mode);
    assert.equal(success().length, 0, `No false success for ${mode}`);
    assert.equal(renderer.root.findAllByType('article').length, 1, mode);
    assert.equal(mutations().length, 1, mode);
  }
  pass('API rejection, wrong final status, missing deletion and wrong company never produce a success notice');

  const pending = order('in_progress');
  let release;
  const waitForMutation = new Promise(resolve => { release = resolve; });
  await fixture([pending], { waitForMutation });
  await choose(pending, 'delete');
  assert.equal(menus(pending)[0].props.disabled, true);
  assert.equal(renderer.root.findAllByType('button').every(node => node.props.disabled), true);
  await choose(pending, 'delete');
  assert.equal(state.confirmations.length, 1);
  assert.equal(mutations().length, 1);
  await act(async () => { release(); await new Promise(resolve => setImmediate(resolve)); });
  assert.deepEqual(success(), ['Demande annulée et supprimée de vos listes.']);
  pass('Pending deletion disables actions and prevents duplicate submission until the server confirms');
} finally {
  if (renderer) await act(async () => renderer.unmount());
  for (const [key, value] of Object.entries(originalGlobals)) {
    if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
  }
}
console.log(`PASS ${passed} mounted order-actions UI groups`);
