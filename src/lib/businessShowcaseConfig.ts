import { getMediaLimits, type SubscriptionTier } from './subscriptionTiers';

/**
 * Une seule vitrine technique alimente les offres réellement commercialisées :
 * - fiche annuaire gratuite ;
 * - Vitrine Business Artisan ;
 * - CV Business Premium.
 *
 * Les anciennes valeurs techniques inconnues sont ramenées au Premium afin de
 * préserver la compatibilité sans créer une offre supplémentaire à l'écran.
 */
export type BusinessShowcaseVariant = 'directory' | 'artisan' | 'premium';

export interface BusinessShowcaseCapabilities {
  variant: BusinessShowcaseVariant;
  productLabel: string;
  maxPhotos: number;
  maxVideos: number;
  showGallery: boolean;
  showVideos: boolean;
  showDetailedPresentation: boolean;
  showServices: boolean;
  showAbout: boolean;
  showWebsite: boolean;
  showSocialLinks: boolean;
  showReservation: boolean;
  showQrCode: boolean;
  showShareTools: boolean;
  showReviews: boolean;
  showPlatformLinks: boolean;
  showSimilarBusinesses: boolean;
}

export function getBusinessShowcaseCapabilities(
  tier: SubscriptionTier,
): BusinessShowcaseCapabilities {
  const effectiveTier: 'gratuit' | 'artisan' | 'premium' =
    tier === 'gratuit' ? 'gratuit' : tier === 'artisan' ? 'artisan' : 'premium';
  const media = getMediaLimits(effectiveTier);

  if (effectiveTier === 'artisan') {
    return {
      variant: 'artisan',
      productLabel: 'Vitrine Business Artisan',
      ...media,
      showDetailedPresentation: true,
      showServices: true,
      showAbout: true,
      showWebsite: true,
      showSocialLinks: false,
      showReservation: false,
      showQrCode: true,
      showShareTools: true,
      showReviews: true,
      showPlatformLinks: true,
      showSimilarBusinesses: true,
    };
  }

  if (effectiveTier === 'premium') {
    return {
      variant: 'premium',
      productLabel: 'CV Business Premium',
      ...media,
      showDetailedPresentation: true,
      showServices: true,
      showAbout: true,
      showWebsite: true,
      showSocialLinks: true,
      showReservation: true,
      showQrCode: true,
      showShareTools: true,
      showReviews: true,
      showPlatformLinks: true,
      showSimilarBusinesses: true,
    };
  }

  return {
    variant: 'directory',
    productLabel: 'Fiche annuaire Dalil Tounes',
    ...media,
    showDetailedPresentation: false,
    showServices: false,
    showAbout: false,
    showWebsite: false,
    showSocialLinks: false,
    showReservation: false,
    showQrCode: false,
    showShareTools: false,
    showReviews: true,
    showPlatformLinks: true,
    showSimilarBusinesses: true,
  };
}
