// Focused PWA mobile smoke test. Run: SMOKE_BASE_URL=https://dalil-tounes-pwa.vercel.app node scripts/smoke-pwa-directory.mjs
// Playwright is an optional QA dependency, installed in the test runner.
import { chromium } from 'playwright';
const base = process.env.SMOKE_BASE_URL || 'https://dalil-tounes-pwa.vercel.app';
const scopes = ['sante','services','magasin','entreprises','tourisme','education','loisirs'];
const browser = await chromium.launch({ headless: true });
let passed = 0;
let failed = 0;
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const scope of scopes) {
    const errors = [];
    const onError = error => errors.push(error.message);
    page.on('pageerror', onError);
    try {
      const url = new URL('/recherche?scope=' + scope, base);
      const response = await page.goto(url.href, {waitUntil: 'domcontentloaded', timeout: 20000});
      if (!response?.ok()) throw new Error('HTTP ' + (response?.status() ?? 'no response'));
      await page.locator('main').first().waitFor({state:'visible',timeout:15000});
      await page.locator('main').first().getByRole('heading').first().waitFor({state:'visible',timeout:15000});
      const body = await page.locator('main').first().innerText();
      if (body.length < 30) throw new Error('Empty main content');
      if (errors.length) throw new Error(errors.join(' | '));
      console.log('PASS PWA scope=' + scope + ' mobile main and heading');
      passed++;
    } catch(error) {
      console.error('FAIL PWA scope=' + scope + ': ' + error.message);
      failed++;
    } finally {
      page.off('pageerror', onError);
    }
  }
} finally {
  await browser.close();
}
console.log('PWA scope smoke: ' + passed + '/' + scopes.length + ' passed, ' + failed + ' failed');
if (failed) process.exitCode = 1;
