// Read-only HTTP regression checks. No form submissions or database writes.
import assert from 'node:assert/strict';
const base = new URL(process.env.SMOKE_BASE_URL || 'https://dalil-tounes.com');
let passed = 0;
let failed = 0;
async function check(label, fn) {
  try { await fn(); passed++; console.log(`PASS ${label}`); }
  catch (error) { failed++; console.error(`FAIL ${label}: ${error.message}`); }
}
async function get(route, redirect = 'follow') {
  return fetch(new URL(route, base), { redirect, signal: AbortSignal.timeout(25000) });
}
for (const [route, expectedPath, expectedHash, lang] of [
  ['/concept?lang=ar', '/subscription', '#concept', 'ar'],
  ['/notre-concept?lang=fr', '/subscription', '#concept', 'fr'],
  ['/abonnement?lang=en', '/subscription', '', 'en'],
]) {
  await check(`permanent redirect ${route}`, async () => {
    const response = await get(route, 'manual');
    assert.ok([301,308].includes(response.status), String(response.status));
    const target = new URL(response.headers.get('location'), base);
    assert.equal(target.pathname, expectedPath);
    assert.equal(target.hash, expectedHash);
    assert.equal(target.searchParams.get('lang'), lang);
  });
}
await check('commercial SEO before JavaScript', async () => {
  const response = await get('/subscription');
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>[^<]*Espace professionnel[^<]*<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/dalil-tounes.com\/subscription"/);
  assert.match(html, /name="description" content="[^"]*Présence Essentielle/);
});
await check('canonical sitemap', async () => {
  const response = await get('/sitemap.xml');
  assert.equal(response.status, 200);
  const xml = await response.text();
  assert.ok(xml.includes('<loc>https://dalil-tounes.com/subscription</loc>'));
  assert.ok(!xml.includes('<loc>https://dalil-tounes.com/concept</loc>'));
});
for (const route of ['/cv-business', '/inscription-entreprise', '/paiement/confirmation', '/images/cv-business-professionnel-aux-saveurs-anis.png', '/images/cv-business-portfolio-aux-saveurs-anis.png']) {
  await check(`preserved route/asset ${route}`, async () => {
    const response = await get(route);
    assert.equal(response.status, 200);
    assert.ok((await response.arrayBuffer()).byteLength > 100);
  });
}
console.log(`${passed}/${passed+failed} checks passed; ${failed} failed`);
if (failed) process.exitCode = 1;
