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
  // Check links from the settlement guide to all supported service categories.
  for (const destination of ['/citizens/health', '/education', '/emplois', '/citizens/shops']) {
    const errors = [];
    const listener = (error) => errors.push(error.message);
    page.on('pageerror', listener);
    try {
      await page.goto(new URL('/citizens/tourism', base).toString(), {waitUntil:'domcontentloaded',timeout:20000});
      const settle = page.locator('[role="tab"]').nth(1);
      await settle.waitFor({state:'visible',timeout:15000});
      await settle.click();
      const link = page.locator('nav a[href="' + destination + '"]').first();
      await link.waitFor({state:'visible',timeout:12000});
      await link.click();
      await page.waitForURL('**' + destination, {timeout:15000});
      await page.locator('#root').waitFor({state:'visible',timeout:12000});
      if (errors.length) throw new Error(errors.join(' | '));
      console.log('PASS Settlement -> ' + destination);
    } catch(error) {
      failed++;
      console.log('FAIL Settlement -> ' + destination + ': ' + error.message);
    } finally {
      page.off('pageerror',listener);
    }
  }
  // Search -> suggestion -> business detail. Uses a broad term to avoid test-specific records.
  const searchErrors = [];
  const onSearchError = (error) => searchErrors.push(error.message);
  page.on('pageerror', onSearchError);
  try {
    await page.goto(new URL('/recherche', base).toString(), {waitUntil:'domcontentloaded',timeout:20000});
    const queryInput = page.locator('[data-component-name="SearchBar"] input').first();
    await queryInput.waitFor({state:'visible',timeout:15000});
    await queryInput.fill('restaurant');
    // Suggestions are rendered through a portal outside the SearchBar DOM subtree.
    const result = page.locator('body li.cursor-pointer').first();
    await result.waitFor({state:'visible',timeout:15000});
    await result.click();
    await page.waitForURL(url => url.pathname.startsWith('/entreprise/id/'), {timeout:15000});
    await page.locator('#root').waitFor({state:'visible',timeout:12000});
    if (searchErrors.length) throw new Error(searchErrors.join(' | '));
    console.log('PASS Search suggestion -> Business detail');
  } catch(error) {
    failed++;
    console.log('FAIL Search suggestion -> Business detail: ' + error.message);
  } finally {
    page.off('pageerror',onSearchError);
  }
} finally {
  await browser.close();
}
if (failed) process.exitCode = 1;
