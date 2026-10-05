const CLIENT_APP_ORIGIN = 'https://app.dalil-tounes.com';

export function buildClientAppUrl(businessId: string, language?: string): string {
  const url = new URL(`/qr-business/${encodeURIComponent(businessId)}`, CLIENT_APP_ORIGIN);
  if (language) url.searchParams.set('lang', language);
  return url.toString();
}
