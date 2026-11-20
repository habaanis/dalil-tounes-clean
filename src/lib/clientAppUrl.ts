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

export function isDedicatedClientHostname(hostname: string): boolean {
  return hostname === 'app.dalil-tounes.com';
}

export function buildClientAppUrl(
  business: string | ClientAppBusinessIdentity,
  language?: string,
): string {
  const identifier = getClientAppIdentifier(business);
  const url = new URL(`/${encodeURIComponent(identifier)}`, CLIENT_APP_ORIGIN);
  if (language) url.searchParams.set('lang', language);
  return url.toString();
}

export function buildClientCvUrl(
  business: string | ClientAppBusinessIdentity,
  language?: string,
  palette?: string,
): string {
  const identifier = getClientAppIdentifier(business);
  const url = new URL(`/${encodeURIComponent(identifier)}/cv`, CLIENT_APP_ORIGIN);
  url.searchParams.set('source', 'pwa');
  if (language) url.searchParams.set('lang', language);
  if (palette) url.searchParams.set('palette', palette);
  return url.toString();
}
