/**
 * Générateur de Slugs SEO-Friendly
 * Transforme n'importe quel texte en URL propre
 *
 * Exemples:
 * "Cabinet d'Avocat Sofia" → "cabinet-davocat-sofia"
 * "Café & Restaurant Étoilé" → "cafe-restaurant-etoile"
 * "Hôtel 5★ Méditerranée" → "hotel-5-mediterranee"
 */

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

/**
 * Legacy URL for backward compatibility.
 * Format: /p/{nom-slug}-{shortId}
 */
export function generateBusinessUrl(name: string, id: string): string {
  const slug = generateSlug(name);
  const shortId = id.substring(0, 8);
  return `/p/${slug}-${shortId}`;
}

export function extractIdFromSlugUrl(url: string): string | null {
  const match = url.match(/\/p\/.*-([a-f0-9]{8,})$/i);
  return match ? match[1] : null;
}

/**
 * Extrait le shortId (8 premiers chars de l'UUID) depuis la fin d'un slug URL.
 * Fonctionne pour /p/{slug}-{shortId} et /entreprise/{ville}/{slug}-{shortId}
 */
export function extractShortIdFromSlug(slug: string): string | null {
  const match = slug.match(/-([a-f0-9]{8})$/i);
  return match ? match[1] : null;
}

export function generateShareUrl(name: string, id: string): string {
  const path = buildEntrepriseUrl(null, name, id);
  const domain = window.location.origin;
  return `${domain}${path}`;
}

/**
 * URL canonique pour une fiche entreprise.
 * Format : /entreprise/{villeSlug}/{nom-slug}-{shortId}
 * Fallback sans ville : /p/{nom-slug}-{shortId}
 */
export function buildEntrepriseUrl(
  ville: string | null | undefined,
  name: string | null | undefined,
  id: string | null | undefined,
): string {
  if (!name || !id) return '/';
  const nomSlug = generateSlug(name);
  const shortId = id.substring(0, 8);
  if (!nomSlug) return '/';
  if (ville) {
    const villeSlug = generateSlug(ville);
    if (villeSlug) {
      return `/entreprise/${villeSlug}/${nomSlug}-${shortId}`;
    }
  }
  return `/p/${nomSlug}-${shortId}`;
}

export function buildEntrepriseShareUrl(
  ville: string | null | undefined,
  name: string | null | undefined,
  id: string | null | undefined,
): string {
  const path = buildEntrepriseUrl(ville, name, id);
  const domain = typeof window !== 'undefined' ? window.location.origin : '';
  return `${domain}${path}`;
}

/**
 * Validation d'un slug
 * Retourne true si le slug est valide (lettres, chiffres, tirets)
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

/**
 * Nettoie un slug existant (au cas où)
 */
export function cleanSlug(slug: string): string {
  return generateSlug(slug);
}

/**
 * Exemples de slugs générés pour tests
 */
export const SLUG_EXAMPLES = {
  "Cabinet d'Avocat Sofia": "cabinet-davocat-sofia",
  "Café & Restaurant Étoilé": "cafe-restaurant-etoile",
  "Hôtel 5★ Méditerranée": "hotel-5-mediterranee",
  "Garage Mécanique 24/7": "garage-mecanique-24-7",
  "École Privée Al-Mustaqbal": "ecole-privee-al-mustaqbal",
  "Clinique Dr. Ben Salah": "clinique-dr-ben-salah",
  "Boulangerie & Pâtisserie": "boulangerie-patisserie",
  "Centre Commercial Carrefour": "centre-commercial-carrefour",
  "Pharmacie de la Gare": "pharmacie-de-la-gare",
  "Restaurant Le Phénicien": "restaurant-le-phenicien"
};
