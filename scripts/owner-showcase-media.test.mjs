import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { build } from 'esbuild';

// npm install --no-save react-test-renderer@18.3.1, or point DALIL_QA_RUNTIME
// at an isolated dependency directory to avoid changing the application lockfile.
const require = createRequire(import.meta.url);
let reactRequire = require;
try { require.resolve('react-test-renderer'); }
catch { reactRequire = createRequire(path.resolve(process.env.DALIL_QA_RUNTIME || '../qa-runtime', 'package.json')); }
const React = reactRequire('react');
const { act, create } = reactRequire('react-test-renderer');

const buildModule = async entryPoint => {
  const result = await build({ entryPoints: [entryPoint], bundle: true, write: false, platform: 'node', format: 'esm' });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
};
const imageUtils = await buildModule('src/lib/imagekitUtils.ts');
const cache = await buildModule('src/lib/showcaseRecordCache.ts');
const { adaptDalilBusiness } = await buildModule('src/lib/cvBusinessDalilAdapter.ts');
const photoUrls = count => Array.from({ length: count }, (_, i) => `https://images.example.test/presentation-${i + 1}.jpg`);
const originalEight = photoUrls(8).join(',\n') + ',';

assert.deepEqual(imageUtils.parseImageUrls(originalEight), photoUrls(8));
assert.deepEqual(imageUtils.parseImageUrls(photoUrls(3).join(',\\n')), photoUrls(3));
assert.deepEqual(imageUtils.parseImageUrls('https://images.example.test/a,b.jpg,\nhttps://images.example.test/c.jpg,'),
  ['https://images.example.test/a,b.jpg', 'https://images.example.test/c.jpg']);
for (const count of [1, 5, 8, 9, 10, 12]) {
  const urls = photoUrls(count);
  const items = imageUtils.getShowcaseGalleryItems(urls.join(',\n'));
  assert.equal(items.length, count, `Every saved photo remains available at ${count}`);
  assert.equal(items.at(-1).full, urls.at(-1));
  for (const style of ['business', 'portfolio']) {
    const adapted = adaptDalilBusiness({ id: 'media-test', nom: 'Media fixture', image_url: urls.join(',\n') }, { language: 'fr', style });
    assert.deepEqual(adapted.media.gallery, urls, `${style}: all saved photos including the cover`);
  }
}
assert.deepEqual(imageUtils.getShowcaseGalleryItems(''), []);
cache.rememberShowcaseRecord({ id: 'owner', slug: 'long-slug', slug_court: 'short', id_airtable: 'record' });
cache.rememberShowcaseRecord({ id: 'other', slug: 'other-slug' });
cache.invalidateShowcaseRecord('owner');
for (const key of ['owner', 'long-slug', 'short', 'record']) assert.equal(cache.cachedShowcaseRecord(key), null);
assert.equal(cache.cachedShowcaseRecord('other').id, 'other');
console.log('PASS saved-gallery parsing, 9th/10th photos, grandfathered galleries, both model adapters and cache invalidation');

const mockClient = `
const state = () => globalThis.__mediaTest;
export const supabase = {
  from() { return { select() { return { eq() { return { async single() {
    const s = state(); s.readCalls++;
    return { data: { image_url: s.mode === 'readMismatch' && s.afterSave ? s.original : s.images, logo_url: '' }, error: null };
  } }; } }; } }; },
  async rpc(name, args) {
    const s = state();
    if (name === 'dalil_get_my_showcase_entitlements') return { data: { photo_limit: s.limit, photo_count: s.images ? s.images.split(',\\n').length : 0, base_photo_limit: s.limit, confirmation_required: false }, error: null };
    if (name !== 'dalil_save_my_showcase_images') throw Error('Unexpected RPC: ' + name);
    s.saveCalls++;
    if (s.mode === 'rpcError') return { data: null, error: { message: 'Image non rattachée' } };
    if (s.mode === 'rpcMismatch') return { data: 'https://images.example.test/unexpected.jpg', error: null };
    s.images = args.p_images.join(',\\n'); s.afterSave = true;
    return { data: s.images, error: null };
  },
  storage: { from() { return {
    async upload() { const s = state(); s.uploadCalls++; return { error: s.mode === 'uploadError' ? { message: 'Upload failed' } : null }; },
    getPublicUrl(path) { return { data: { publicUrl: 'https://images.example.test/' + path } }; },
  }; } },
};`;
const bundle = await build({
  entryPoints: ['src/components/OwnerShowcaseMedia.tsx'], bundle: true, write: false,
  format: 'cjs', platform: 'node', jsx: 'automatic', external: ['react', 'react/jsx-runtime'],
  plugins: [{ name: 'media-fixtures', setup(builder) {
    builder.onResolve({ filter: /supabaseClient$/ }, () => ({ path: 'supabase', namespace: 'media-fixtures' }));
    builder.onResolve({ filter: /context\/LanguageContext$/ }, () => ({ path: 'language', namespace: 'media-fixtures' }));
    builder.onLoad({ filter: /.*/, namespace: 'media-fixtures' }, args => ({ contents: args.path === 'supabase' ? mockClient : `export function useLanguage(){return {language:'fr'}}`, loader: 'js' }));
  } }],
});
const module = { exports: {} };
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(reactRequire, module, module.exports);
const Component = module.exports.default;
const upload = name => new File(['photo fixture'], name, { type: 'image/png' });
let renderer;
const findInput = label => renderer.root.findByProps({ 'aria-label': label });
const button = label => renderer.root.findAllByType('button').find(node => node.children.join('') === label);
const textContent = node => typeof node === 'string' ? node : node.children.map(textContent).join('');
const assertCounter = value => assert.ok(textContent(renderer.root.findByType('summary')).includes(value));
const photos = () => renderer.root.findAllByType('img').length;
const alerts = () => renderer.root.findAllByProps({ role: 'alert' });
const success = () => renderer.root.findAllByProps({ role: 'status' });
async function choose(label, files) {
  await act(async () => findInput(label).props.onChange({ target: { files: Array.isArray(files) ? files : [files], value: '' } }));
}
async function save() {
  await act(async () => button('Enregistrer').props.onClick());
}
async function fixture({ count = 8, limit = 10, mode = 'success' } = {}) {
  if (renderer) await act(async () => renderer.unmount());
  globalThis.__mediaTest = {
    images: photoUrls(count).join(',\n'), original: photoUrls(count).join(',\n'), limit, mode,
    uploadCalls: 0, saveCalls: 0, readCalls: 0, afterSave: false,
  };
  await act(async () => { renderer = create(React.createElement(Component, { id: 'media-test', field: 'image_url' })); });
  assertCounter(`${count}/${limit}`);
}
try {
  await fixture({ count: 4, limit: 5 });
  await choose('Ajouter des photos', [upload('one.png'), upload('two.png')]);
  assert.ok(textContent(alerts()[0]).includes('Vous pouvez encore ajouter 1 photo'));
  assert.equal(photos(), 4);
  assert.equal(globalThis.__mediaTest.uploadCalls, 0);
  await choose('Ajouter des photos', upload('fifth.png'));
  assertCounter('5/5');
  assert.equal(findInput('Ajouter des photos').props.disabled, true);
  await save();
  assert.equal(textContent(success()[0]), 'Images enregistrées et publication vérifiée.');
  console.log('PASS Artisan: 5-photo capacity, multi-file overflow rejected before upload, fifth saved');

  await fixture();
  await choose('Ajouter des photos', upload('ninth.png'));
  assertCounter('9/10');
  await save();
  assert.equal(textContent(success()[0]), 'Images enregistrées et publication vérifiée.');
  await choose('Ajouter des photos', upload('tenth.png'));
  assertCounter('10/10');
  await save();
  assert.equal(textContent(success()[0]), 'Images enregistrées et publication vérifiée.');
  assert.equal(findInput('Ajouter des photos').props.disabled, true);
  assert.equal(photos(), 10);
  await choose('Remplacer 1', upload('replacement.png'));
  await save();
  assert.equal(textContent(success()[0]), 'Images enregistrées et publication vérifiée.');
  assert.equal(photos(), 10);
  await act(async () => renderer.root.findAllByType('button').filter(node => node.children.join('') === 'Retirer').at(-1).props.onClick());
  assertCounter('9/10');
  await save();
  assert.equal(textContent(success()[0]), 'Images enregistrées et publication vérifiée.');
  assert.equal(photos(), 9);
  assert.equal(findInput('Ajouter des photos').props.disabled, false);
  assert.equal(globalThis.__mediaTest.saveCalls, 4);
  console.log('PASS Premium: ninth/tenth saved, counter/remaining, limit, replacement and removal');

  for (const mode of ['uploadError', 'rpcError', 'rpcMismatch', 'readMismatch']) {
    await fixture({ mode });
    await choose('Ajouter des photos', upload('ninth.png'));
    await save();
    assert.equal(alerts().length, 1);
    assert.equal(success().length, 0, `No false success for ${mode}`);
    if (mode === 'uploadError') assert.equal(globalThis.__mediaTest.saveCalls, 0);
    console.log(`PASS no success announcement on ${mode}`);
  }
} finally {
  if (renderer) await act(async () => renderer.unmount());
  delete globalThis.__mediaTest;
}
