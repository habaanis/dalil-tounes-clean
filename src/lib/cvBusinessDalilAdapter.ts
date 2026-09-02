import { getMultilingualField } from './databaseI18n';
import type { Language } from './i18n';

export type CvBusinessStyle = 'business' | 'portfolio';
export type CvBusinessBrand = 'dalil_tounes';

export type CvBusinessSocialNetwork =
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'linkedin'
  | 'youtube'
  | 'x';

export interface DalilBusinessRecord {
  id: string;
  nom?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  name_it?: string | null;
  name_ru?: string | null;
  categorie?: string | string[] | null;
  sous_categories_texte?: string | null;
  sous_categories_clean?: string | null;
  slogan?: string | null;
  description?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  description_it?: string | null;
  description_ru?: string | null;
  services?: string | null;
  services_ar?: string | null;
  services_en?: string | null;
  services_it?: string | null;
  services_ru?: string | null;
  a_propos?: string | null;
  logo_url?: string | null;
  image_couverture?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  telephone?: string | null;
  telephone2?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  email2?: string | null;
  site_web?: string | null;
  adresse?: string | null;
  ville?: string | null;
  gouvernorat?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  BTN_Maps?: string | null;
  google_url?: string | null;
  horaires_ok?: string | null;
  'Lien Instagram'?: string | null;
  'Lien TikTok'?: string | null;
  'Lien LinkedIn'?: string | null;
  'Lien YouTube'?: string | null;
  'lien facebook'?: string | null;
  lien_x?: string | null;
  'Note Google Globale'?: number | string | null;
  'Compteur Avis Google'?: number | string | null;
  'Lien Avis Google'?: string | null;
  statut_carte?: string | null;
  verifie?: boolean | null;
  is_local_verified?: boolean | null;
  [key: string]: unknown;
}

export interface CvBusinessProfile {
  identity: {
    id: string;
    name: string;
    activity: string;
    slogan: string;
  };
  presentation: {
    description: string;
    about: string;
  };
  media: {
    logo: string;
    cover: string;
    gallery: string[];
    video: string;
  };
  services: string[];
  contact: {
    phone: string;
    secondaryPhone: string;
    whatsapp: string;
    email: string;
    secondaryEmail: string;
    website: string;
  };
  location: {
    address: string;
    city: string;
    governorate: string;
    directionsUrl: string;
  };
  hours: string;
  socialLinks: Array<{
    network: CvBusinessSocialNetwork;
    url: string;
  }>;
  reviews: {
    rating: number | null;
    count: number;
    url: string;
  };
  certification: {
    certified: boolean;
    label: string;
  };
  display: {
    brand: CvBusinessBrand;
    language: Language;
    style: CvBusinessStyle;
    direction: 'ltr' | 'rtl';
  };
}

export interface AdaptDalilBusinessOptions {
  language: Language;
  style?: CvBusinessStyle;
}

const cleanText = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const uniqueNonEmpty = (values: string[]): string[] => {
  const seen = new Set<string>();
  return values.filter(value => {
    const key = value.toLowerCase();
    if (!value || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const splitList = (value: unknown): string[] => {
  const values = Array.isArray(value) ? value : String(value || '').split(/[,;\n\r]+/);
  return uniqueNonEmpty(
    values
      .map(item => cleanText(String(item)))
      .filter(item => item && item !== '{}'),
  );
};

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const cleanMediaUrl = (value: unknown): string => {
  const url = cleanText(value);
  return isHttpUrl(url) ? url : '';
};

const normalizeExternalUrl = (value: unknown): string => {
  const raw = cleanText(value);
  if (!raw) return '';
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return isHttpUrl(candidate) ? candidate : '';
};

const numericValue = (value: unknown): number | null => {
  const parsed = Number(String(value ?? '').replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
};

const firstText = (record: DalilBusinessRecord, keys: string[]): string => {
  for (const key of keys) {
    const value = cleanText(record[key]);
    if (value) return value;
  }
  return '';
};

const buildDirectionsUrl = (record: DalilBusinessRecord): string => {
  const savedValue = firstText(record, ['BTN_Maps', 'google_url']);
  const savedUrl = normalizeExternalUrl(savedValue);
  if (savedUrl) return savedUrl;

  const coordinatePair = savedValue.match(
    /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/,
  );
  if (coordinatePair) {
    return `https://www.google.com/maps/search/?api=1&query=${coordinatePair[1]},${coordinatePair[2]}`;
  }

  const latitude = Number(record.latitude);
  const longitude = Number(record.longitude);
  if (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    (latitude !== 0 || longitude !== 0)
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }

  const location = [record.adresse, record.ville, record.gouvernorat, 'Tunisie']
    .map(cleanText)
    .filter(Boolean)
    .join(' ');

  return location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    : '';
};

const buildSocialLinks = (
  record: DalilBusinessRecord,
): CvBusinessProfile['socialLinks'] => {
  const candidates: Array<[CvBusinessSocialNetwork, unknown]> = [
    ['facebook', record['lien facebook']],
    ['instagram', record['Lien Instagram']],
    ['tiktok', record['Lien TikTok']],
    ['linkedin', record['Lien LinkedIn']],
    ['youtube', record['Lien YouTube']],
    ['x', record.lien_x],
  ];

  return candidates.flatMap(([network, value]) => {
    const url = normalizeExternalUrl(value);
    return url ? [{ network, url }] : [];
  });
};

const getTranslatedText = (
  record: DalilBusinessRecord,
  field: 'nom' | 'description' | 'services',
  language: Language,
): string => cleanText(getMultilingualField(record, field, language, true));

const isCertified = (record: DalilBusinessRecord): boolean => {
  if (record.verifie === true || record.is_local_verified === true) return true;
  const status = cleanText(record.statut_carte)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return status.includes('certifie') && !status.includes('non certifie');
};

export function adaptDalilBusiness(
  record: DalilBusinessRecord,
  options: AdaptDalilBusinessOptions,
): CvBusinessProfile {
  const name = getTranslatedText(record, 'nom', options.language);
  if (!cleanText(record.id) || !name) {
    throw new Error('Un CV Business Dalil doit avoir un identifiant et un nom.');
  }

  const activityItems = splitList(record.categorie);
  const fallbackServices = splitList(
    record.sous_categories_clean || record.sous_categories_texte,
  );
  const translatedServices = splitList(
    getTranslatedText(record, 'services', options.language),
  );
  const services = translatedServices.length ? translatedServices : fallbackServices;

  const photos = uniqueNonEmpty(
    splitList(record.image_url)
      .map(cleanMediaUrl)
      .filter(Boolean),
  );
  const savedCover = cleanMediaUrl(record.image_couverture);
  const cover = savedCover || photos[0] || '';
  const gallery = photos.filter(photo => photo !== cover);

  const ratingValue = numericValue(record['Note Google Globale']);
  const countValue = numericValue(record['Compteur Avis Google']);
  const reviewCount = countValue && countValue > 0 ? Math.floor(countValue) : 0;
  const certified = isCertified(record);

  return {
    identity: {
      id: cleanText(record.id),
      name,
      activity: activityItems.join(', '),
      slogan: firstText(record, ['slogan', 'Slogan', 'accroche', 'tagline'])
        || activityItems.join(', '),
    },
    presentation: {
      description: getTranslatedText(record, 'description', options.language),
      about: cleanText(record.a_propos),
    },
    media: {
      logo: cleanMediaUrl(record.logo_url),
      cover,
      gallery,
      video: cleanMediaUrl(record.video_url),
    },
    services,
    contact: {
      phone: cleanText(record.telephone),
      secondaryPhone: cleanText(record.telephone2),
      whatsapp: cleanText(record.whatsapp),
      email: cleanText(record.email),
      secondaryEmail: cleanText(record.email2),
      website: normalizeExternalUrl(record.site_web),
    },
    location: {
      address: cleanText(record.adresse),
      city: cleanText(record.ville),
      governorate: cleanText(record.gouvernorat),
      directionsUrl: buildDirectionsUrl(record),
    },
    hours: cleanText(record.horaires_ok),
    socialLinks: buildSocialLinks(record),
    reviews: {
      rating: ratingValue && ratingValue > 0 ? ratingValue : null,
      count: reviewCount,
      url: normalizeExternalUrl(record['Lien Avis Google']),
    },
    certification: {
      certified,
      label: certified ? cleanText(record.statut_carte) : '',
    },
    display: {
      brand: 'dalil_tounes',
      language: options.language,
      style: options.style || 'business',
      direction: options.language === 'ar' ? 'rtl' : 'ltr',
    },
  };
}
