/**
 * Système de mapping des paliers d'abonnement.
 *
 * Offres réellement utilisées pour les vitrines publiques :
 * - Gratuit ;
 * - Artisan ;
 * - Premium.
 *
 * `elite` et `custom` restent uniquement dans le type pour préserver la
 * compatibilité avec d'anciens composants. Toute ancienne valeur de ce type
 * est désormais traitée comme Premium et n'apparaît plus comme une offre.
 */

export type SubscriptionTier = 'gratuit' | 'artisan' | 'premium' | 'elite' | 'custom';

export interface SubscriptionData {
  statut_abonnement?: string | null;
  niveau_priorite_abonnement?: number | null;
}

export interface MediaLimits {
  maxPhotos: number;
  maxVideos: number;
  showGallery: boolean;
  showVideos: boolean;
}

/**
 * Permet de visualiser les variantes sur une preview Vercel sans modifier
 * Supabase. Le paramètre est volontairement ignoré sur dalil-tounes.com.
 */
function getPreviewTierOverride(): 'gratuit' | 'artisan' | 'premium' | null {
  if (typeof window === 'undefined') return null;
  if (!window.location.hostname.endsWith('.vercel.app')) return null;

  const requestedTier = new URLSearchParams(window.location.search).get('showcaseTier');
  if (requestedTier === 'gratuit' || requestedTier === 'artisan' || requestedTier === 'premium') {
    return requestedTier;
  }

  return null;
}

/**
 * Mappe le plan d'abonnement de la BDD vers le tier visuel.
 * Les anciennes valeurs Elite ou personnalisées sont ramenées au Premium.
 */
export function mapSubscriptionToTier(data: SubscriptionData): SubscriptionTier {
  const previewTier = getPreviewTierOverride();
  if (previewTier) return previewTier;

  const rawValue = data.statut_abonnement;

  if (!rawValue) {
    return 'gratuit';
  }

  const normalized = rawValue.toLowerCase().trim();

  if (normalized.includes('artisan')) {
    return 'artisan';
  }

  if (
    normalized.includes('premium') ||
    normalized.includes('elite') ||
    normalized.includes('custom') ||
    normalized.includes('personnalis')
  ) {
    return 'premium';
  }

  if (
    normalized.includes('gratuit') ||
    normalized.includes('free') ||
    normalized.includes('decouverte')
  ) {
    return 'gratuit';
  }

  return 'gratuit';
}

/**
 * Obtient les limites médias selon le plan d'abonnement.
 * - Gratuit : pas de galerie ;
 * - Artisan : 3 photos maximum ;
 * - Premium : 5 photos maximum et 1 vidéo.
 *
 * Les anciennes valeurs techniques Elite et Custom utilisent les limites
 * Premium afin de ne pas recréer une quatrième offre.
 */
export function getMediaLimits(tier: SubscriptionTier): MediaLimits {
  switch (tier) {
    case 'gratuit':
      return {
        maxPhotos: 0,
        maxVideos: 0,
        showGallery: false,
        showVideos: false,
      };
    case 'artisan':
      return {
        maxPhotos: 3,
        maxVideos: 0,
        showGallery: true,
        showVideos: false,
      };
    case 'premium':
    case 'elite':
    case 'custom':
      return {
        maxPhotos: 5,
        maxVideos: 1,
        showGallery: true,
        showVideos: true,
      };
    default:
      return {
        maxPhotos: 0,
        maxVideos: 0,
        showGallery: false,
        showVideos: false,
      };
  }
}

/**
 * Obtient le texte de couleur approprié selon le tier.
 */
export function getTierTextColor(tier: SubscriptionTier): string {
  switch (tier) {
    case 'artisan':
    case 'premium':
    case 'elite':
    case 'custom':
      return 'text-white';
    default:
      return 'text-gray-900';
  }
}

/**
 * Obtient la couleur de texte secondaire selon le tier.
 */
export function getTierSecondaryTextColor(tier: SubscriptionTier): string {
  switch (tier) {
    case 'artisan':
    case 'premium':
    case 'elite':
    case 'custom':
      return 'text-gray-200';
    default:
      return 'text-gray-600';
  }
}

/**
 * Obtient la couleur de texte tertiaire selon le tier.
 */
export function getTierTertiaryTextColor(tier: SubscriptionTier): string {
  switch (tier) {
    case 'artisan':
    case 'premium':
    case 'elite':
    case 'custom':
      return 'text-gray-300';
    default:
      return 'text-gray-500';
  }
}

/**
 * Vérifie si un tier utilise une vitrine payante avec effet premium.
 */
export function isPremiumTier(tier: SubscriptionTier): boolean {
  return tier !== 'gratuit';
}

/**
 * Obtient le label d'affichage du tier.
 * Les anciens alias Elite et Custom sont volontairement affichés Premium.
 */
export function getTierLabel(tier: SubscriptionTier, language: string = 'fr'): string {
  const labels: Record<SubscriptionTier, Record<string, string>> = {
    gratuit: {
      fr: 'Gratuit',
      en: 'Free',
      ar: 'مجاني',
    },
    artisan: {
      fr: 'Artisan',
      en: 'Artisan',
      ar: 'حرفي',
    },
    premium: {
      fr: 'Premium',
      en: 'Premium',
      ar: 'بريميوم',
    },
    elite: {
      fr: 'Premium',
      en: 'Premium',
      ar: 'بريميوم',
    },
    custom: {
      fr: 'Premium',
      en: 'Premium',
      ar: 'بريميوم',
    },
  };

  return labels[tier]?.[language] || labels[tier]?.fr || tier;
}

/**
 * Obtient le niveau de priorité selon le tier.
 * Premium 3 > Artisan 2 > Gratuit 1.
 */
export function getTierPriority(tier: SubscriptionTier): number {
  switch (tier) {
    case 'premium':
    case 'elite':
    case 'custom':
      return 3;
    case 'artisan':
      return 2;
    case 'gratuit':
    default:
      return 1;
  }
}

/**
 * Obtient le niveau de priorité depuis les données de la base.
 */
export function getPriorityLevel(data: SubscriptionData): number {
  if (data.niveau_priorite_abonnement && data.niveau_priorite_abonnement > 0) {
    return Math.min(data.niveau_priorite_abonnement, 3);
  }

  const tier = mapSubscriptionToTier(data);
  return getTierPriority(tier);
}

/**
 * Obtient la palette de couleurs complète selon le statut d'abonnement.
 */
export function getTierColors(statut_abonnement: string | null) {
  const tier = mapSubscriptionToTier({ statut_abonnement });

  switch (tier) {
    case 'premium':
    case 'elite':
    case 'custom':
      return {
        cardBg: '#047857',
        text: '#FFFFFF',
        secondaryText: '#D1FAE5',
        border: '#10B981',
        primary: '#10B981',
        primaryText: '#FFFFFF',
        accent: '#34D399',
        badgeBg: '#065F46',
        badgeText: '#D1FAE5',
        divider: '#059669',
      };
    case 'artisan':
      return {
        cardBg: '#4A1D43',
        text: '#FFFFFF',
        secondaryText: '#E5D4E4',
        border: '#D4AF37',
        primary: '#D4AF37',
        primaryText: '#4A1D43',
        accent: '#B8941F',
        badgeBg: '#5A2D53',
        badgeText: '#E5D4E4',
        divider: '#6B2D5C',
      };
    case 'gratuit':
    default:
      return {
        cardBg: '#FFFFFF',
        text: '#1F2937',
        secondaryText: '#6B7280',
        border: '#D4AF37',
        primary: '#D4AF37',
        primaryText: '#1A1A1A',
        accent: '#B8941F',
        badgeBg: '#F9FAFB',
        badgeText: '#4B5563',
        divider: '#E5E7EB',
      };
  }
}
