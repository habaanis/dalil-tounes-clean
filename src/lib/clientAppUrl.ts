const CLIENT_APP_ORIGIN = 'https://app.dalil-tounes.com';

export type ClientAppBusinessIdentity = {
  id: string;
  slug?: string | null;
  slug_court?: string | null;
};

export function getClientAppIdentifier(business: string | ClientAppBusinessIdentity): string {
  if (typeof business === 'string') return business.trim();
  return String(business.slug_court || business.slug || business.id).trim();
}

// Preview opt-in is isolated to Vercel's project-specific deployment host.
// The public site and production host keep their existing routing.
function isClientPreviewHostname(hostname: string): boolean {
  if (!/^dalil-tounes-clean-[a-z0-9-]+-haba-anis-projects\.vercel\.app$/i.test(hostname)) return false;
  if (typeof window === 'undefined' || window.location.hostname !== hostname) return false;
  try {
    if (new URLSearchParams(window.location.search).get('client-preview') === '1')
      window.sessionStorage.setItem('dalil-client-route-preview', '1');
    return window.sessionStorage.getItem('dalil-client-route-preview') === '1';
  } catch {
    return new URLSearchParams(window.location.search).get('client-preview') === '1';
  }
}

export function isDedicatedClientHostname(hostname: string): boolean {
  return hostname === 'app.dalil-tounes.com' || isClientPreviewHostname(hostname);
}

function clientOrigin(): string {
  if (typeof window !== 'undefined' && isClientPreviewHostname(window.location.hostname))
    return window.location.origin;
  return CLIENT_APP_ORIGIN;
}

export function buildClientAppUrl(
  business: string | ClientAppBusinessIdentity,
  language?: string,
): string {
  const identifier = getClientAppIdentifier(business);
  const url = new URL(`/${encodeURIComponent(identifier)}`, clientOrigin());
  if (language) url.searchParams.set('lang', language);
  return url.toString();
}

export function buildClientCvUrl(
  business: string | ClientAppBusinessIdentity,
  language?: string,
  palette?: string,
): string {
  const identifier = getClientAppIdentifier(business);
  const url = new URL(`/${encodeURIComponent(identifier)}/cv`, clientOrigin());
  url.searchParams.set('source', 'pwa');
  if (language) url.searchParams.set('lang', language);
  if (palette) url.searchParams.set('palette', palette);
  return url.toString();
}
