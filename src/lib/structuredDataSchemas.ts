import { getSchemaTypeFromCategory, getPriceRangeFromTier, parseOpeningHours } from './schemaTypeMapping';
import { altFromImageKitUrl, buildImageKitUrlWithWidth, isImageKitUrl, parseImageUrls } from './imagekitUtils';

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  description?: string;
  address?: {
    '@type': string;
    addressCountry: string;
  };
}

export interface WebSiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  potentialAction?: {
    '@type': string;
    target: {
      '@type': string;
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface LocalBusinessSchema {
  '@context': string;
  '@type': string;
  name: string;
  image?: string | string[];
  photo?: Array<{
    '@type': string;
    contentUrl: string;
    caption?: string;
    name?: string;
  }>;
  areaServed?: {
    '@type': string;
    name: string;
  };
  address?: {
    '@type': string;
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    addressCountry: string;
  };
  telephone?: string;
  url?: string;
  priceRange?: string;
  aggregateRating?: {
    '@type': string;
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
  };
  geo?: {
    '@type': string;
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification?: Array<{
    '@type': string;
    dayOfWeek: string[];
    opens?: string;
    closes?: string;
  }>;
}

export interface CollectionPageSchema {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  url: string;
  mainEntity?: {
    '@type': string;
    itemListElement: Array<{
      '@type': string;
      position: number;
      name: string;
      url?: string;
    }>;
  };
}

export interface AboutPageSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  mainEntity?: {
    '@type': string;
    name: string;
    description: string;
  };
}

export interface ContactPageSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
}

const CANONICAL_ORIGIN = 'https://dalil-tounes.com';

function canonicalUrl(path?: string): string {
  const p = path || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const clean = p.length > 1 ? p.replace(/\/$/, '') : p;
  return `${CANONICAL_ORIGIN}${clean}`;
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dalil Tounes',
    url: CANONICAL_ORIGIN,
    logo: 'https://dalil-tounes.com/images/logo_dalil_tounes_crop.png',
    description: 'Plateforme tunisienne de référencement des entreprises, services et événements en Tunisie',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TN',
    },
    sameAs: [
      'https://www.facebook.com/daliltounes',
      'https://www.instagram.com/dalil.tounes/',
      'https://www.linkedin.com/company/daliltounes',
    ],
  };
}

export function generateWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dalil Tounes',
    url: CANONICAL_ORIGIN,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${CANONICAL_ORIGIN}/recherche?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateLocalBusinessSchema(business: {
  nom: string;
  ville?: string;
  gouvernorat?: string;
  adresse?: string;
  telephone?: string;
  site_web?: string;
  photo_url?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  note_moyenne?: number;
  nombre_avis?: number;
  horaires?: string;
  categorie?: string;
  statut_abonnement?: string;
  description?: string;
}): LocalBusinessSchema {
  const schemaType = getSchemaTypeFromCategory(business.categorie || '');

  const schema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: business.nom,
  };

  if (business.description) {
    (schema as any).description = business.description;
  }

  const allImageUrls: string[] = [];
  if (business.photo_url) allImageUrls.push(business.photo_url);
  if (business.image_url) {
    allImageUrls.push(...parseImageUrls(business.image_url));
  }
  const uniqueImages = Array.from(new Set(allImageUrls.filter(Boolean)));

  if (uniqueImages.length > 0) {
    const optimized = uniqueImages.map((u) =>
      isImageKitUrl(u) ? buildImageKitUrlWithWidth(u, 1200) : u
    );
    schema.image = optimized.length === 1 ? optimized[0] : optimized;

    const altContext = [business.nom, business.ville].filter(Boolean).join(' ');
    schema.photo = uniqueImages.slice(0, 10).map((u) => ({
      '@type': 'ImageObject',
      contentUrl: isImageKitUrl(u) ? buildImageKitUrlWithWidth(u, 1200) : u,
      caption: altFromImageKitUrl(u, altContext),
      name: altFromImageKitUrl(u, business.nom),
    }));
  }

  if (business.ville) {
    schema.areaServed = {
      '@type': 'City',
      name: business.ville,
    };
  }

  if (business.adresse || business.ville || business.gouvernorat) {
    schema.address = {
      '@type': 'PostalAddress',
      addressCountry: 'TN',
    };

    if (business.adresse) {
      schema.address.streetAddress = business.adresse;
    }
    if (business.ville) {
      schema.address.addressLocality = business.ville;
    }
    if (business.gouvernorat) {
      schema.address.addressRegion = business.gouvernorat;
    }
  }

  if (business.telephone) {
    schema.telephone = business.telephone;
  }

  if (business.site_web) {
    schema.url = business.site_web;
  }

  const priceRange = getPriceRangeFromTier(business.statut_abonnement || '', business.categorie || '');
  if (priceRange) {
    schema.priceRange = priceRange;
  }

  if (business.latitude && business.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: business.latitude,
      longitude: business.longitude,
    };
  }

  if (business.note_moyenne && business.nombre_avis && business.nombre_avis > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: business.note_moyenne,
      reviewCount: business.nombre_avis,
      bestRating: 5,
      worstRating: 1,
    };
  }

  const openingHours = parseOpeningHours(business.horaires);
  if (openingHours) {
    schema.openingHoursSpecification = openingHours;
  }

  return schema;
}

export function generateCollectionPageSchema(
  title: string,
  description: string,
  items: Array<{ name: string; url?: string }> = [],
  path?: string
): CollectionPageSchema {
  const schema: CollectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description,
    url: canonicalUrl(path),
  };

  if (items.length > 0) {
    schema.mainEntity = {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url,
      })),
    };
  }

  return schema;
}

export function generateAboutPageSchema(): AboutPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Comment fonctionne Dalil Tounes ?',
    description: 'Découvrez comment trouver un artisan, un commerçant ou un professionnel de confiance en Tunisie avec Dalil Tounes.',
    url: canonicalUrl('/notre-concept'),
    mainEntity: {
      '@type': 'Organization',
      name: 'Dalil Tounes',
      description: 'Plateforme tunisienne pour trouver des professionnels, artisans et entreprises de confiance en Tunisie',
    },
  };
}

export function generateContactPageSchema(): ContactPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Dalil Tounes',
    description: 'Contactez l\'équipe Dalil Tounes pour toute question ou demande de partenariat',
    url: canonicalUrl('/contact'),
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${CANONICAL_ORIGIN}${item.url}`,
    })),
  };
}

export function generateFAQSchema(questions: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}
