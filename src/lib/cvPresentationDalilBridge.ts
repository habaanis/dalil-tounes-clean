import type { BusinessShowcaseCapabilities } from './businessShowcaseConfig';
import type {
  CvPresentationContentAvailability,
  CvPresentationEntitlements,
} from './cvPresentationEngine';
import type { CvBusinessProfile } from './cvBusinessDalilAdapter';

/**
 * Pont propre à Dalil Tounes.
 * La plateforme décide des droits commerciaux, puis ce pont les traduit dans
 * le langage neutre du moteur de présentation.
 */
export function dalilCapabilitiesToPresentationEntitlements(
  capabilities: BusinessShowcaseCapabilities,
): CvPresentationEntitlements {
  const isShowcase = capabilities.variant !== 'directory';

  return {
    actions: {
      call: isShowcase,
      whatsapp: isShowcase,
      email: isShowcase,
      directions: isShowcase,
      website: capabilities.showWebsite,
      reservation: capabilities.showReservation,
      add_contact: isShowcase,
      share: capabilities.showShareTools,
    },
    sections: {
      identity: true,
      about: capabilities.showAbout,
      services: capabilities.showServices,
      gallery: capabilities.showGallery,
      video: capabilities.showVideos,
      hours: isShowcase,
      social_links: capabilities.showSocialLinks,
      reviews: capabilities.showReviews,
      certification: isShowcase,
      platform_links: capabilities.showPlatformLinks,
    },
    media: {
      maxPhotos: capabilities.maxPhotos,
      maxVideos: capabilities.maxVideos,
    },
  };
}

export function getDalilContentAvailability(
  profile: CvBusinessProfile,
): CvPresentationContentAvailability {
  return {
    phone: Boolean(profile.contact.phone),
    whatsapp: Boolean(profile.contact.whatsapp),
    email: Boolean(profile.contact.email),
    directions: Boolean(profile.location.directionsUrl),
    website: Boolean(profile.contact.website),
    reservationTarget: Boolean(
      profile.contact.email || profile.contact.phone || profile.contact.whatsapp,
    ),
    about: Boolean(profile.presentation.about || profile.presentation.description),
    services: profile.services.length > 0,
    photoCount: profile.media.gallery.length,
    videoCount: profile.media.video ? 1 : 0,
    hours: Boolean(profile.hours),
    socialLinks: profile.socialLinks.length > 0,
    reviews: profile.reviews.count > 0 || profile.reviews.rating !== null,
    certification: profile.certification.certified,
    platformLinks: true,
  };
}
