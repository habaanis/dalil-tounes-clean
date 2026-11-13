/**
 * UI-only correspondences between Commerces & magasins shortcuts and the
 * existing Airtable taxonomy, synchronized as Supabase text-array categories.
 * This is deliberately NOT an Airtable schema migration.
 */
export type ShopFilterId = 'food' | 'fashion' | 'home' | 'beauty' | 'flowers' | 'all';

export const SHOP_PAGE = 'commerces & magasins';

export const SHOP_FILTERS: Record<ShopFilterId, {
  categories: readonly string[];
  labels: Record<'fr' | 'ar' | 'en' | 'it' | 'ru', string>;
}> = {
  food: {
    categories: ['Alimentation ', 'Alimentation'],
    labels: { fr: 'Alimentation', ar: 'مواد غذائية', en: 'Food shops', it: 'Alimentari', ru: 'Продукты' },
  },
  fashion: {
    categories: ['Mode & Sport'],
    labels: { fr: 'Mode & accessoires', ar: 'ملابس وإكسسوارات', en: 'Fashion & accessories', it: 'Moda e accessori', ru: 'Мода и аксессуары' },
  },
  home: {
    categories: ['Maison & Équipement', 'Commerce & Matériaux', 'Quincaillerie & Bricolage'],
    labels: { fr: 'Maison & équipement', ar: 'المنزل والتجهيزات', en: 'Home & equipment', it: 'Casa e attrezzature', ru: 'Дом и товары' },
  },
  beauty: {
    categories: ['Beauté & Bien-être'],
    labels: { fr: 'Beauté & coiffure', ar: 'الجمال والحلاقة', en: 'Beauty & hair', it: 'Bellezza e parrucchieri', ru: 'Красота и уход' },
  },
  flowers: {
    categories: ['Fleuriste'],
    labels: { fr: 'Fleurs & cadeaux', ar: 'زهور وهدايا', en: 'Flowers & gifts', it: 'Fiori e regali', ru: 'Цветы и подарки' },
  },
  all: {
    categories: [],
    labels: { fr: 'Tous les commerces', ar: 'جميع المتاجر', en: 'All shops', it: 'Tutti i negozi', ru: 'Все магазины' },
  },
};

export function getShopFilterId(raw: string | null | undefined): ShopFilterId | null {
  if (!raw?.startsWith('shop:')) return null;
  const value = raw.slice(5);
  return Object.prototype.hasOwnProperty.call(SHOP_FILTERS, value) ? value as ShopFilterId : null;
}

export function getShopFilterLabel(id: ShopFilterId, lang: string): string {
  const translations = SHOP_FILTERS[id].labels;
  return translations[lang as keyof typeof translations] || translations.fr;
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function textArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((x): x is string => typeof x === 'string');
  if (typeof value === 'string') return value.split(',').map(x => x.trim()).filter(Boolean);
  return [];
}

export function matchesShopFilter(row: {
  categorie?: unknown;
  sous_categories_texte?: unknown;
  sous_categories_clean?: unknown;
  nom?: unknown;
}, id: ShopFilterId): boolean {
  if (id === 'all') return true;

  const categories = textArray(row.categorie).map(normalize);
  const subcategories = [row.sous_categories_texte, row.sous_categories_clean]
    .flatMap(textArray).join(' ');
  const details = normalize(subcategories);
  const name = normalize(typeof row.nom === 'string' ? row.nom : '');
  const matchingCategory = SHOP_FILTERS[id].categories.some(value => categories.includes(normalize(value)));

  if (id === 'flowers') {
    return matchingCategory || /cadeau|fleuriste|fleur(?:s|iste)/.test(details);
  }

  if (!matchingCategory) return false;

  if (id === 'fashion') {
    // "Mode & Sport" also contains gyms and garages in historical data.
    if (/salle de sport|fitness|club de sport|gym|garage mecanique|auto[- ]?ecole/.test(details)) return false;
    if (!details && /\bgym\b|fitness|\bgarage\b/.test(name)) return false;
  }

  if (id === 'beauty') {
    // A thermal tourist attraction is not a hairdresser or beauty shop.
    if (categories.some(c => /tourisme|hebergement/.test(c)) &&
      /thermale?|source naturelle|thalasso|hammam/.test(name + ' ' + details)) return false;
  }

  return true;
}
