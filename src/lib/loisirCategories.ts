export const LOISIRS_CATEGORIES_KEYS = [
  { value: '', key: 'all', emoji: '' },
  { value: 'Saveurs & Traditions', key: 'flavors', emoji: '🍽️' },
  { value: 'Musées & Patrimoine', key: 'heritage', emoji: '🏛️' },
  { value: 'Escapades & Nature', key: 'nature', emoji: '🌄' },
  { value: 'Festivals & Artisanat', key: 'festivals', emoji: '🎭' },
  { value: 'Sport & Aventure', key: 'sports', emoji: '🏃' }
] as const;

export type LoisirCategory = typeof LOISIRS_CATEGORIES_KEYS[number]['value'];

export function getLoisirCategoryLabel(value: string, language?: string): string {
  if (!language) {
    const cat = LOISIRS_CATEGORIES_KEYS.find(c => c.value === value);
    return cat ? cat.value : value;
  }
  const { translationExtensions } = require('./i18nExtensions');
  const ext = translationExtensions[language];
  const labels = ext?.categoryLabels?.loisir;
  if (labels && labels[value]) return labels[value];
  return value;
}
