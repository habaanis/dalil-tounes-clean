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
  // Interactive route: Tourisme -> S'installer -> Santé, then Education.
  const navigationErrors = [];
  const onNavigationError = (error) => navigationErrors.push(error.message);
  page.on('pageerror', onNavigationError);
  try {
    await page.goto(new URL('/citizens/tourism', base).toString(), { waitUntil: 'domcontentloaded', timeout: 20000 });
    const settleTab = page.locator('[role="tab"]').nth(1);
    await settleTab.waitFor({ state: 'visible', timeout: 15000 });
    await settleTab.click();
    if (await settleTab.getAttribute('aria-selected') !== 'true') throw new Error('Settlement tab did not activate');
    await page.locator('nav a[href="/citizens/health"]').first().click();
    await page.waitForURL('**/citizens/health', { timeout: 15000 });
    if (navigationErrors.length) throw new Error(navigationErrors.join(' | '));
    console.log('PASS Tourism -> Settlement -> Health navigation');
  } catch (error) {
    console.log('FAIL Tourism -> Settlement -> Health navigation: ' + error.message);
    failed++;
  } finally {
    page.off('pageerror', onNavigationError);
  }
} finally {
  await browser.close();
}
if (failed) process.exitCode = 1;
