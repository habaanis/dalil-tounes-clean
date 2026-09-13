import type { Language } from './i18n';

export const SECTEURS_CULTURE = [
  'Saveurs & Traditions',
  'Musée & Patrimoine',
  'Escapades & Nature',
  'Festivals & artisanat',
  'Sport & Aventure',
  'Art & Culture',
  'Sorties & Soirées'
] as const;

export type SecteurCulture = typeof SECTEURS_CULTURE[number];

export const SECTEURS_CONFIG = [
  { value: 'Saveurs & Traditions', label: 'Saveurs & Traditions', icon: '🍽️', color: 'from-orange-500 to-red-500' },
  { value: 'Musée & Patrimoine', label: 'Musée & Patrimoine', icon: '🏛️', color: 'from-amber-500 to-yellow-500' },
  { value: 'Escapades & Nature', label: 'Escapades & Nature', icon: '🌿', color: 'from-green-500 to-emerald-500' },
  { value: 'Festivals & artisanat', label: 'Festivals & artisanat', icon: '🎭', color: 'from-rose-500 to-pink-500' },
  { value: 'Sport & Aventure', label: 'Sport & Aventure', icon: '⚡', color: 'from-sky-500 to-blue-500' },
  { value: 'Art & Culture', label: 'Art & Culture', icon: '🎨', color: 'from-purple-500 to-pink-500' },
  { value: 'Sorties & Soirées', label: 'Sorties & Soirées', icon: '🎉', color: 'from-blue-500 to-cyan-500' },
];

export const SECTEUR_LABELS: Record<Language, Record<string, string>> = {
  fr: {
    'Saveurs & Traditions': 'Saveurs & Traditions',
    'Musée & Patrimoine': 'Musée & Patrimoine',
    'Escapades & Nature': 'Escapades & Nature',
    'Festivals & artisanat': 'Festivals & artisanat',
    'Sport & Aventure': 'Sport & Aventure',
    'Art & Culture': 'Art & Culture',
    'Sorties & Soirées': 'Sorties & Soirées',
  },
  ar: {
    'Saveurs & Traditions': 'النكهات والتقاليد',
    'Musée & Patrimoine': 'المتاحف والتراث',
    'Escapades & Nature': 'رحلات وطبيعة',
    'Festivals & artisanat': 'مهرجانات وحرف',
    'Sport & Aventure': 'رياضة ومغامرة',
    'Art & Culture': 'فن وثقافة',
    'Sorties & Soirées': 'خروجات وسهرات',
  },
  en: {
    'Saveurs & Traditions': 'Flavours & Traditions',
    'Musée & Patrimoine': 'Museums & Heritage',
    'Escapades & Nature': 'Nature Getaways',
    'Festivals & artisanat': 'Festivals & Crafts',
    'Sport & Aventure': 'Sport & Adventure',
    'Art & Culture': 'Art & Culture',
    'Sorties & Soirées': 'Outings & Nightlife',
  },
  it: {
    'Saveurs & Traditions': 'Sapori & Tradizioni',
    'Musée & Patrimoine': 'Musei & Patrimonio',
    'Escapades & Nature': 'Escursioni & Natura',
    'Festivals & artisanat': 'Festival & Artigianato',
    'Sport & Aventure': 'Sport & Avventura',
    'Art & Culture': 'Arte & Cultura',
    'Sorties & Soirées': 'Uscite & Vita notturna',
  },
  ru: {
    'Saveurs & Traditions': 'Вкусы и традиции',
    'Musée & Patrimoine': 'Музеи и наследие',
    'Escapades & Nature': 'Природа и поездки',
    'Festivals & artisanat': 'Фестивали и ремёсла',
    'Sport & Aventure': 'Спорт и приключения',
    'Art & Culture': 'Искусство и культура',
    'Sorties & Soirées': 'Отдых и вечерняя жизнь',
  },
};

export function getCultureSecteurLabel(value: string, lang: Language): string {
  return SECTEUR_LABELS[lang]?.[value] || value;
}
