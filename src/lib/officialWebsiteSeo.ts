import verifiedSites from '../data/verified-official-websites.json';

/**
 * Approved editorial links are distinct from sponsored links.
 * Only the exact reviewed hostname for this company is approved.
 * Changing the business website invalidates the previously reviewed link.
 */
export function isVerifiedOfficialWebsite(businessId: string | null | undefined, website: string | null | undefined): boolean {
  const expected = verifiedSites[String(businessId || '') as keyof typeof verifiedSites];
  if (!expected || !website) return false;
  try {
    const url = new URL(website.trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    return (url.protocol === 'https:' || url.protocol === 'http:') && host === expected;
  } catch {
    return false;
  }
}
