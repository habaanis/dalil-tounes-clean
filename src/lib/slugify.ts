export function generateSlug(text: string): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[œ]/g, 'oe')
    .replace(/[æ]/g, 'ae')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

export function extractShortIdFromSlug(slug: string): string | null {
  const match = slug.match(/-([a-f0-9]{8})$/i);
  return match ? match[1] : null;
}

export function extractIdFromSlugUrl(url: string): string | null {
  const match = url.match(/\/p\/.*-([a-f0-9]{8,})$/i);
  return match ? match[1] : null;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

interface EntrepriseForUrl {
  slug?: string | null;
  nom?: string | null;
  name?: string | null;
  ville?: string | null;
  id?: string | null;
}

export function buildEntrepriseUrl(business: EntrepriseForUrl): string {
  const businessSlug = business.slug || generateSlug(business.nom || business.name || '');
  if (!businessSlug) return '/';

  const ville = business.ville;
  if (ville) {
    const villeSlug = generateSlug(ville);
    if (villeSlug) {
      return `/entreprise/${villeSlug}/${businessSlug}`;
    }
  }
  return `/p/${businessSlug}`;
}

export function buildEntrepriseShareUrl(business: EntrepriseForUrl): string {
  const path = buildEntrepriseUrl(business);
  const domain = typeof window !== 'undefined' ? window.location.origin : '';
  return `${domain}${path}`;
}

const SHARE_DOMAIN = 'https://dalil-tounes.com';

export function buildShortShareUrl(business: EntrepriseForUrl): string {
  const businessSlug = business.slug || generateSlug(business.nom || business.name || '');
  if (!businessSlug) return '';
  return `${SHARE_DOMAIN}/p/${businessSlug}`;
}

export function buildShortSharePath(business: EntrepriseForUrl): string {
  const businessSlug = business.slug || generateSlug(business.nom || business.name || '');
  if (!businessSlug) return '';
  return `/p/${businessSlug}`;
}
