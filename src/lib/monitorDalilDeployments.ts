/**
 * Lightweight deployment awareness shared by the website, installed platform
 * and dedicated client mini-apps. Does not subscribe to content changes.
 * Version is checked only while the tab is active and never reloads itself.
 */
declare const __DALIL_BUILD_VERSION__: string;

const VERSION_URL = '/version.json';
const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const UPDATE_KEY = 'dalil-tounes-pwa-update-ready';
let checkInFlight: Promise<void> | null = null;

function announceUpdate() {
  try { sessionStorage.setItem(UPDATE_KEY, '1'); } catch { /* private mode */ }
  window.dispatchEvent(new Event('pwa-update-ready'));
}

async function checkLatestDeployment(): Promise<void> {
  if (document.visibilityState !== 'visible' || !navigator.onLine) return;
  if (checkInFlight) return checkInFlight;
  checkInFlight = (async () => {
    try {
      const response = await fetch(VERSION_URL, { cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!response.ok || !(response.headers.get('content-type') || '').includes('json')) return;
      const data: unknown = await response.json();
      const version = typeof data === 'object' && data !== null && 'version' in data
        ? (data as { version: unknown }).version : null;
      // Older deployments may have no manifest: fail safely, no false alert.
      if (typeof version !== 'string' || !version.trim()) return;
      if (version !== __DALIL_BUILD_VERSION__) announceUpdate();
    } catch {
      // Offline or temporary network failure must never interrupt the user.
    }
  })().finally(() => { checkInFlight = null; });
  return checkInFlight;
}

export function monitorDalilDeployments(): void {
  if (typeof window === 'undefined') return;
  const run = () => { void checkLatestDeployment(); };
  window.addEventListener('focus', run);
  document.addEventListener('visibilitychange', run);
  window.addEventListener('online', run);
  // Check after initial load so the browser has a stable page first.
  window.setTimeout(run, 3000);
  window.setInterval(run, CHECK_INTERVAL_MS);
}
