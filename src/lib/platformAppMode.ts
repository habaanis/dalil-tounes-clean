/**
 * Scope the dedicated mobile shell to the Dalil Tounes PLATFORM PWA.
 * Business CVs and QR mini-apps always keep their own layouts.
 * The preview switch is available only on Vercel/localhost for QA.
 */
export function isPlatformAppMode(): boolean {
  if (typeof window === 'undefined') return false;
  const { hostname, pathname, search } = window.location;
  if (/^\/(?:qr-business|entreprise|business|cv|p)(?:\/|$)/.test(pathname) || /^\/[^/]+\/cv\/?$/.test(pathname)) return false;

  const mainHost = /^(?:www\.)?dalil-tounes\.com$/i.test(hostname);
  // Dedicated PWA Vercel project: enable the application without a QA query switch.
  // Keep app.dalil-tounes.com reserved for existing customer mini-app links.
  const platformAppHost = hostname === 'appli.dalil-tounes.com'
    || hostname === 'dalil-tounes-pwa.vercel.app'
    || hostname === 'dalil-tounes-pwa-haba-anis-projects.vercel.app'
    || hostname.startsWith('dalil-tounes-pwa-') && hostname.endsWith('.vercel.app')
    || hostname === 'pwa.dalil-tounes.com';
  if (platformAppHost) return true;
  const previewHost = hostname === 'localhost' || hostname.endsWith('.vercel.app');
  if (previewHost) {
    const previewParam = new URLSearchParams(search).get('app-preview');
    try {
      if (previewParam === '1') sessionStorage.setItem('dalil-platform-app-preview', '1');
      if (previewParam === '0') sessionStorage.removeItem('dalil-platform-app-preview');
      return sessionStorage.getItem('dalil-platform-app-preview') === '1';
    } catch {
      return previewParam === '1';
    }
  }
  if (!mainHost) return false;

  const standalone = window.matchMedia?.('(display-mode: standalone)').matches
    || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
  return Boolean(standalone && window.matchMedia?.('(max-width: 1024px)').matches);
}
