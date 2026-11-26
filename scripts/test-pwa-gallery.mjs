import assert from 'node:assert/strict';
import { build } from 'esbuild';

const loadModule = async entryPoint => {
  const result = await build({ entryPoints: [entryPoint], bundle: true, write: false, platform: 'node', format: 'esm' });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
};
const imageUtils = await loadModule('src/lib/imagekitUtils.ts');
const { adaptDalilBusiness } = await loadModule('src/lib/cvBusinessDalilAdapter.ts');
const { mapSubscriptionToTier } = await loadModule('src/lib/subscriptionTiers.ts');
const photoUrls = count => Array.from({ length: count }, (_, index) => `https://images.example.test/presentation-${index + 1}.jpg`);
assert.deepEqual(imageUtils.parseImageUrls(photoUrls(8).join(',\n') + ','), photoUrls(8));
assert.deepEqual(imageUtils.parseImageUrls(photoUrls(3).join(',\\n')), photoUrls(3));
assert.deepEqual(imageUtils.parseImageUrls('https://images.example.test/a,b.jpg,\nhttps://images.example.test/c.jpg,'),
  ['https://images.example.test/a,b.jpg', 'https://images.example.test/c.jpg']);
for (const count of [1, 5, 8, 9, 10, 12]) {
  const urls = photoUrls(count);
  const items = imageUtils.getShowcaseGalleryItems(urls.join(',\n'));
  assert.equal(items.length, count);
  assert.equal(items.at(-1).full, urls.at(-1));
  for (const style of ['business', 'portfolio']) {
    const adapted = adaptDalilBusiness({ id: 'pwa-media-test', nom: 'Media fixture', image_url: urls.join(',\n') }, { language: 'fr', style });
    assert.deepEqual(adapted.media.gallery, urls, `${style}: all ${count} saved photos including the cover`);
  }
  console.log(`PASS PWA Business/Portfolio: ${count} persisted photos remain available`);
}
assert.equal(mapSubscriptionToTier({ formule_commerciale: 'Artisan — 30 TND', statut_abonnement: 'Actif' }), 'artisan');
assert.equal(mapSubscriptionToTier({ formule_commerciale: 'Premium — 59 TND', statut_abonnement: 'Actif' }), 'premium');
assert.deepEqual(imageUtils.getShowcaseGalleryItems(''), []);
console.log('PASS PWA historical separators, URL commas, commercial formula recognition and empty gallery');
