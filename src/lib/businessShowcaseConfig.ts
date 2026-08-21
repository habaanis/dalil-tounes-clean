import { getMediaLimits, type SubscriptionTier } from './subscriptionTiers';

/**
 * Une seule vitrine technique alimente toutes les offres Dalil Tounes.
 * Le niveau d'abonnement active ensuite les fonctions Artisan ou Premium.
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
  const media = getMediaLimits(tier);

  switch (tier) {
    case 'artisan':
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

    case 'premium':
    case 'elite':
    case 'custom':
      return {
        variant: 'premium',
        productLabel: tier === 'elite' ? 'CV Business Elite Pro' : 'CV Business Premium',
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

    case 'gratuit':
    default:
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
}
