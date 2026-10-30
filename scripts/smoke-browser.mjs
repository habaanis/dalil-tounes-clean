// Browser smoke test: npm run smoke:browser (requires Playwright Chromium installed).
import { chromium } from 'playwright';
const base = process.env.SMOKE_BASE_URL || 'https://dalil-tounes.com';
const routes = ['/', '/recherche', '/citizens', '/citizens/health', '/education', '/citizens/shops', '/citizens/services', '/citizens/tourism', '/emplois'];
const browser = await chromium.launch({ headless: true });
let failed = 0;
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const route of routes) {
    const errors = [];
    const onError = (error) => errors.push(error.message);
    page.on('pageerror', onError);
    const started = Date.now();
    try {
      const response = await page.goto(new URL(route, base).toString(), { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.locator('#root').waitFor({ state: 'visible', timeout: 12000 });
      const visible = await page.locator('#root').evaluate(node => Boolean(node.textContent?.trim()) && node.getBoundingClientRect().height > 0);
      const ok = Boolean(response?.ok() && visible && errors.length === 0);
      console.log(`${ok ? 'PASS' : 'FAIL'} ${route} ${Date.now()-started}ms ${errors.join(' | ')}`);
      if (!ok) failed++;
    } catch (error) {
      console.log(`FAIL ${route}: ${error.message}`);
      failed++;
    } finally {
      page.off('pageerror', onError);
    }
  }
} finally {
  await browser.close();
}
if (failed) process.exitCode = 1;
