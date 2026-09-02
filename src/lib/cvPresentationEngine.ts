/**
 * Moteur de présentation neutre des profils professionnels.
 *
 * Il ne connaît ni Supabase, ni Airtable, ni les tarifs, ni les abonnements.
 * Chaque plateforme lui transmet seulement les contenus disponibles et les
 * fonctions déjà autorisées par sa propre logique commerciale.
 */

export type CvPresentationBrand = 'dalil_tounes' | 'lienora';
export type CvPresentationStyle = 'business' | 'portfolio';

export type CvPresentationAction =
  | 'call'
  | 'whatsapp'
  | 'email'
  | 'directions'
  | 'website'
  | 'reservation'
  | 'add_contact'
  | 'share';

export type CvPresentationSection =
  | 'identity'
  | 'about'
  | 'services'
  | 'gallery'
  | 'video'
  | 'hours'
  | 'social_links'
  | 'reviews'
  | 'certification'
  | 'platform_links';

export interface CvPresentationEntitlements {
  actions: Partial<Record<CvPresentationAction, boolean>>;
  sections: Partial<Record<CvPresentationSection, boolean>>;
  media: {
    maxPhotos: number;
    maxVideos: number;
  };
}

export interface CvPresentationContentAvailability {
  phone: boolean;
  whatsapp: boolean;
  email: boolean;
  directions: boolean;
  website: boolean;
  reservationTarget: boolean;
  about: boolean;
  services: boolean;
  photoCount: number;
  videoCount: number;
  hours: boolean;
  socialLinks: boolean;
  reviews: boolean;
  certification: boolean;
  platformLinks: boolean;
}

export interface ResolveCvPresentationInput {
  brand: CvPresentationBrand;
  style: CvPresentationStyle;
  entitlements: CvPresentationEntitlements;
  content: CvPresentationContentAvailability;
}

export interface ResolvedCvPresentation {
  brand: CvPresentationBrand;
  style: CvPresentationStyle;
  productName: string;
  visibleActions: CvPresentationAction[];
  visibleSections: CvPresentationSection[];
  media: {
    photoCount: number;
    videoCount: number;
  };
  layout: {
    hero: 'compact_identity' | 'immersive_cover';
    navigation: 'accordion' | 'tabs';
    sectionOrder: CvPresentationSection[];
  };
}

const STYLE_LAYOUTS: Record<
  CvPresentationStyle,
  ResolvedCvPresentation['layout']
> = {
  business: {
    hero: 'compact_identity',
    navigation: 'accordion',
    sectionOrder: [
      'identity',
      'about',
      'services',
      'gallery',
      'hours',
      'reviews',
      'social_links',
      'certification',
      'platform_links',
      'video',
    ],
  },
  portfolio: {
    hero: 'immersive_cover',
    navigation: 'tabs',
    sectionOrder: [
      'identity',
      'certification',
      'about',
      'services',
      'gallery',
      'reviews',
      'hours',
      'social_links',
      'platform_links',
      'video',
    ],
  },
};

const PRODUCT_NAMES: Record<
  CvPresentationBrand,
  Record<CvPresentationStyle, string>
> = {
  dalil_tounes: {
    business: 'CV Business',
    portfolio: 'CV Portfolio',
  },
  lienora: {
    business: 'Vitrine Business',
    portfolio: 'Vitrine Portfolio',
  },
};

const ACTION_AVAILABILITY: Record<
  CvPresentationAction,
  keyof CvPresentationContentAvailability | null
> = {
  call: 'phone',
  whatsapp: 'whatsapp',
  email: 'email',
  directions: 'directions',
  website: 'website',
  reservation: 'reservationTarget',
  add_contact: 'phone',
  share: null,
};

const SECTION_AVAILABILITY: Record<
  CvPresentationSection,
  keyof CvPresentationContentAvailability | null
> = {
  identity: null,
  about: 'about',
  services: 'services',
  gallery: 'photoCount',
  video: 'videoCount',
  hours: 'hours',
  social_links: 'socialLinks',
  reviews: 'reviews',
  certification: 'certification',
  platform_links: 'platformLinks',
};

const hasContent = (
  content: CvPresentationContentAvailability,
  key: keyof CvPresentationContentAvailability | null,
): boolean => key === null || Boolean(content[key]);

export function resolveCvPresentation(
  input: ResolveCvPresentationInput,
): ResolvedCvPresentation {
  const visibleActions = (Object.keys(ACTION_AVAILABILITY) as CvPresentationAction[])
    .filter(action => input.entitlements.actions[action] === true)
    .filter(action => hasContent(input.content, ACTION_AVAILABILITY[action]));

  const visibleSections = STYLE_LAYOUTS[input.style].sectionOrder
    .filter(section => input.entitlements.sections[section] === true)
    .filter(section => hasContent(input.content, SECTION_AVAILABILITY[section]));

  return {
    brand: input.brand,
    style: input.style,
    productName: PRODUCT_NAMES[input.brand][input.style],
    visibleActions,
    visibleSections,
    media: {
      photoCount: Math.min(
        Math.max(0, input.content.photoCount),
        Math.max(0, input.entitlements.media.maxPhotos),
      ),
      videoCount: Math.min(
        Math.max(0, input.content.videoCount),
        Math.max(0, input.entitlements.media.maxVideos),
      ),
    },
    layout: STYLE_LAYOUTS[input.style],
  };
}

export function getCvPresentationProductName(
  brand: CvPresentationBrand,
  style: CvPresentationStyle,
): string {
  return PRODUCT_NAMES[brand][style];
}
