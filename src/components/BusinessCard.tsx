import { MapPin, Award, Clock, ChevronDown, Phone, Star } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';
import { ImageWithFallback } from './ImageWithFallback';
import { extractMainCategory, getAllKeywords } from '../lib/categoryDisplay';
import { getFeaturedImageUrl } from '../lib/imagekitUtils';
import { mapSubscriptionToTier, getPriorityLevel } from '../lib/subscriptionTiers';
import SignatureCard from './SignatureCard';
import {
  isCurrentlyOpen,
  translateOpenStatus,
  translateClosedStatus,
  getTodaySchedule,
  formatTodayScheduleText,
  translateSeeMore,
  translateSeeLess,
  parseHoraires,
  getDayName
} from '../lib/horaireUtils';
import { useCategoryTranslation } from '../hooks/useCategoryTranslation';
import { getMultilingualField } from '../lib/databaseI18n';
import { getLogoUrl, getLogoStyle, getLogoContainerStyle } from '../lib/logoUtils';
import { RatingBadge } from './GoogleRating';

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    category?: string;
    gouvernorat?: string;
    adresse?: string | null;
    description?: string | null;
    telephone?: string | null;
    phone?: string | null;
    statut_abonnement?: string | null;
    'niveau priorité abonnement'?: number | null;
    badges?: string[];
    imageUrl?: string | null;
    logoUrl?: string | null;
    horaires_ok?: string | null;
    note_google?: string | number | null;
    'Note Google Globale'?: string | number | null;
    nombre_avis?: string | number | null;
    'Compteur Avis Google'?: string | number | null;
    score_avis?: string | number | null;
  };
  onClick: () => void;
  variant?: 'simple' | 'premium';
}

export const BusinessCard = ({ business, onClick, variant = 'simple' }: BusinessCardProps) => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { getCategory } = useCategoryTranslation();
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  const tier = mapSubscriptionToTier({
    statut_abonnement: business.statut_abonnement,
    'niveau priorité abonnement': business['niveau priorité abonnement']
  });

  // Récupération de la catégorie traduite avec fallback
  const rawCategory = getMultilingualField(business, 'category', language, true) ||
                      getMultilingualField(business, 'categorie', language, true) ||
                      business.category ||
                      business.categorie ||
                      '';

  const mainCategory = extractMainCategory(rawCategory);
  const translatedCategory = getCategory(mainCategory);
  const allKeywords = getAllKeywords(rawCategory);

  // Mapper le tier vers le format de SignatureCard
  const signatureTier: 'decouverte' | 'artisan' | 'premium' | 'elite' | 'custom' =
    tier === 'gratuit' ? 'decouverte' : tier;

  // Définir les couleurs de texte selon le tier
  let titleColor: string;
  let secondaryTextColor: string;
  let accentColor: string;
  let paddingClass: string;
  let displayImage: string | null | undefined;

  switch (tier) {
    case 'elite':
      // Fond Noir (#121212) -> Textes Or et Blanc
      titleColor = '#D4AF37';
      secondaryTextColor = '#E8E8E8';
      accentColor = '#D4AF37';
      paddingClass = 'p-6';
      displayImage = getFeaturedImageUrl(business.logoUrl, business.imageUrl);
      break;

    case 'premium':
      // Fond Vert Émeraude (#064E3B) -> Textes Or et Blanc
      titleColor = '#D4AF37';
      secondaryTextColor = '#E8E8E8';
      accentColor = '#D4AF37';
      paddingClass = 'p-5';
      displayImage = getFeaturedImageUrl(business.logoUrl, business.imageUrl);
      break;

    case 'artisan':
      // Fond Bordeaux/Prune (#4A1D43) -> Textes Or et Blanc
      titleColor = '#D4AF37';
      secondaryTextColor = '#E8E8E8';
      accentColor = '#D4AF37';
      paddingClass = 'p-5';
      displayImage = getFeaturedImageUrl(business.logoUrl, business.imageUrl);
      break;

    case 'gratuit':
    default:
      // Fond Blanc -> Textes Sombres
      titleColor = '#1A1A1A';
      secondaryTextColor = '#6B7280';
      accentColor = '#D4AF37';
      paddingClass = 'p-4';
      displayImage = business.logoUrl;
      break;
  }

  const isMinimal = tier === 'gratuit';
  const isElite = tier === 'elite';
  const isPremiumTier = tier === 'premium' || tier === 'elite' || tier === 'artisan';

  return (
    <div className="block">
      <SignatureCard
        tier={signatureTier}
        className={paddingClass}
        onClick={onClick}
      >
      <div style={{ position: 'relative', minHeight: isMinimal ? '180px' : 'auto' }}>
        {isElite && (
          <div className="absolute top-0 right-0 z-10">
            <div className="flex items-center gap-1 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#121212] px-3 py-1.5 rounded-full shadow-lg text-xs font-bold">
              <Award size={14} />
              <span>ÉLITE PRO</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: isMinimal ? '6px' : isElite ? '16px' : '12px' }}>
        {/* Header avec logo rond centralisé - Modèle Elite unifié */}
        <div className="flex justify-center -mt-4 mb-2">
          <div
            className={`${
              isMinimal ? 'w-14 h-14' : isElite ? 'w-20 h-20' : 'w-16 h-16'
            } shadow-xl`}
            style={getLogoContainerStyle(accentColor, '3px')}
          >
            <img
              src={getLogoUrl(displayImage)}
              alt={(() => {
                const ville = business.gouvernorat || '';
                const cat = business.category || '';
                if (!ville && !cat) return `${business.name} - Professionnel en Tunisie`;
                if (!ville) return `${business.name} - ${cat}`;
                if (!cat) return `${business.name} à ${ville} - Professionnel en Tunisie`;
                return `${business.name} à ${ville} - ${cat}`;
              })()}
              className="w-full h-full"
              style={getLogoStyle(displayImage)}
            />
          </div>
        </div>

        <div>
          <h3
            style={{
              fontSize: isMinimal ? '14px' : isElite ? '20px' : tier === 'premium' || tier === 'artisan' ? '18px' : '16px',
              fontWeight: '700',
              color: titleColor,
              lineHeight: '1.3',
              marginBottom: '4px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              letterSpacing: '-0.01em'
            }}
          >
            {business.name}
          </h3>
          {translatedCategory && (
            <>
              <p
                style={{
                  fontSize: isMinimal ? '11px' : '13px',
                  fontWeight: '500',
                  color: secondaryTextColor,
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {translatedCategory}
              </p>
              <meta name="keywords" content={allKeywords.join(', ')} />
              <span className="sr-only">{allKeywords.join(' ')}</span>
            </>
          )}
        </div>

        {business.gouvernorat && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '2px' }}>
            <MapPin className={`${isMinimal ? 'w-3 h-3' : 'w-4 h-4'}`} style={{ color: accentColor, flexShrink: 0 }} />
            <span style={{ fontSize: isMinimal ? '11px' : '14px', fontWeight: '500', color: secondaryTextColor }}>
              {business.gouvernorat}
            </span>
          </div>
        )}

        {/* Description avec "Lire la suite" */}
        {business.description && (
          <div onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                position: 'relative',
                maxHeight: descriptionExpanded ? '600px' : (isMinimal ? '38px' : '48px'),
                overflow: 'hidden',
                transition: 'max-height 0.35s ease',
              }}
            >
              <p
                style={{
                  fontSize: isMinimal ? '11px' : '13px',
                  color: secondaryTextColor,
                  lineHeight: '1.6',
                  margin: 0,
                }}
              >
                {business.description}
              </p>
              {!descriptionExpanded && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '20px',
                    background: isPremiumTier
                      ? 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.85))'
                      : 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.95))',
                  }}
                />
              )}
            </div>
            <button
              onClick={() => setDescriptionExpanded(!descriptionExpanded)}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px 0 0 0',
                cursor: 'pointer',
                fontSize: isMinimal ? '10px' : '11px',
                fontWeight: '600',
                color: accentColor,
                letterSpacing: '0.02em',
              }}
            >
              {descriptionExpanded ? '▲ Voir moins' : '... Lire la suite'}
            </button>
          </div>
        )}

        {/* Téléphone cliquable */}
        {(business.telephone || business.phone) && (
          <div onClick={(e) => e.stopPropagation()}>
            <a
              href={`tel:${business.telephone || business.phone}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: isMinimal ? '11px' : '13px',
                fontWeight: '600',
                color: accentColor,
                textDecoration: 'none',
                padding: '4px 10px',
                borderRadius: '20px',
                border: `1px solid rgba(212,175,55,0.35)`,
                background: isPremiumTier ? 'rgba(212,175,55,0.08)' : 'rgba(212,175,55,0.05)',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = isPremiumTier ? 'rgba(212,175,55,0.08)' : 'rgba(212,175,55,0.05)')}
              onClick={(e) => e.stopPropagation()}
            >
              <Phone size={isMinimal ? 11 : 13} style={{ flexShrink: 0 }} />
              <span>{business.telephone || business.phone}</span>
            </a>
          </div>
        )}

        {/* Adresse avec bouton toggle */}
        {business.adresse && (
          <div style={{ paddingTop: '2px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowAddress(!showAddress)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                color: accentColor,
                fontSize: isMinimal ? '11px' : '13px',
                fontWeight: '500'
              }}
            >
              <MapPin size={isMinimal ? 12 : 14} style={{ color: accentColor, flexShrink: 0 }} />
              <span>{showAddress ? "Masquer l'adresse" : "Afficher l'adresse"}</span>
            </button>
            <div
              style={{
                maxHeight: showAddress ? '120px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease, opacity 0.3s ease',
                opacity: showAddress ? 1 : 0
              }}
            >
              <p
                style={{
                  marginTop: '6px',
                  fontSize: isMinimal ? '11px' : '13px',
                  color: secondaryTextColor,
                  lineHeight: '1.5',
                  padding: '6px 10px',
                  background: isPremiumTier ? 'rgba(212, 175, 55, 0.07)' : 'rgba(0,0,0,0.03)',
                  borderRadius: '6px',
                  borderLeft: `3px solid ${accentColor}`
                }}
              >
                {business.adresse}
              </p>
            </div>
          </div>
        )}

        {/* Note Google avec étoile dorée */}
        <RatingBadge
          rating={business.note_google || business['Note Google Globale']}
          reviewCount={business.nombre_avis || business['Compteur Avis Google']}
          className="mt-1"
        />

        {/* Score avis interne */}
        {business.score_avis != null && business.score_avis !== '' && (
          <div
            className="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-lg"
            style={{
              background: isPremiumTier ? 'rgba(212,175,55,0.12)' : 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.35)',
            }}
          >
            <Star
              size={isMinimal ? 12 : 14}
              style={{ fill: '#D4AF37', color: '#D4AF37', flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: isMinimal ? '11px' : '13px',
                fontWeight: '600',
                color: '#D4AF37',
              }}
            >
              {business.score_avis} / 5
            </span>
          </div>
        )}

        {business.horaires_ok && (
          <div style={{ paddingTop: '4px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFullSchedule(!showFullSchedule);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 0',
                textAlign: 'left'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Clock className={`${isMinimal ? 'w-3 h-3' : 'w-4 h-4'}`} style={{ color: isCurrentlyOpen(business.horaires_ok) ? '#10B981' : '#EF4444', flexShrink: 0 }} />
                  <span
                    style={{
                      fontSize: isMinimal ? '10px' : '12px',
                      fontWeight: '600',
                      color: isCurrentlyOpen(business.horaires_ok) ? '#10B981' : '#EF4444'
                    }}
                  >
                    {isCurrentlyOpen(business.horaires_ok)
                      ? translateOpenStatus(language)
                      : translateClosedStatus(language)
                    }
                  </span>
                </div>

                <div style={{ fontSize: isMinimal ? '10px' : '11px', color: secondaryTextColor, lineHeight: '1.3' }}>
                  {formatTodayScheduleText(getTodaySchedule(business.horaires_ok), language)}
                </div>
              </div>

              <ChevronDown
                size={isMinimal ? 14 : 16}
                style={{
                  color: accentColor,
                  transform: showFullSchedule ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                maxHeight: showFullSchedule ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease, opacity 0.3s ease',
                opacity: showFullSchedule ? 1 : 0
              }}
            >
              <div
                style={{
                  padding: isMinimal ? '6px' : '8px',
                  backgroundColor: isPremiumTier ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: '8px',
                  fontSize: isMinimal ? '10px' : '11px',
                  lineHeight: '1.5',
                  marginTop: '4px'
                }}
              >
                {parseHoraires(business.horaires_ok).map((schedule, index) => {
                  const now = new Date();
                  const todayIndex = (now.getDay() + 6) % 7;
                  const dayIndex = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].findIndex(d => schedule.day.includes(d));
                  const isToday = dayIndex === todayIndex;

                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        padding: '6px 8px',
                        backgroundColor: isToday
                          ? isPremiumTier ? 'rgba(212, 175, 55, 0.15)' : 'rgba(59, 130, 246, 0.08)'
                          : index % 2 === 0
                            ? 'transparent'
                            : isPremiumTier ? 'rgba(212, 175, 55, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                        borderRadius: '4px',
                        marginBottom: index < parseHoraires(business.horaires_ok).length - 1 ? '2px' : '0',
                        gap: '12px'
                      }}
                    >
                      <span
                        style={{
                          minWidth: isMinimal ? '70px' : '90px',
                          maxWidth: isMinimal ? '90px' : '110px',
                          flexShrink: 0,
                          fontWeight: isToday ? '700' : '500',
                          color: schedule.isOpen
                            ? isPremiumTier ? '#D4AF37' : '#1A1A1A'
                            : '#FF6B6B',
                          wordWrap: 'break-word',
                          lineHeight: '1.3'
                        }}
                      >
                        {schedule.day}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          fontWeight: isToday ? '600' : '400',
                          color: schedule.isOpen
                            ? isPremiumTier
                              ? (isToday ? '#D4AF37' : '#E8E8E8')
                              : (isToday ? '#1A1A1A' : '#6B7280')
                            : '#FF6B6B',
                          wordWrap: 'break-word',
                          lineHeight: '1.3'
                        }}
                      >
                        {schedule.hours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          style={{
            width: '100%',
            marginTop: '2px',
            paddingTop: isMinimal ? '6px' : '12px',
            borderTop: isPremiumTier ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(0, 0, 0, 0.08)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'block'
          }}
        >
          <span
            style={{
              fontSize: isMinimal ? '11px' : '14px',
              fontWeight: '700',
              color: accentColor,
              textDecoration: 'none',
              letterSpacing: '0.01em'
            }}
            className="hover:underline"
          >
            {t.common.viewDetails} →
          </span>
        </button>
        </div>
      </div>
      </SignatureCard>
    </div>
  );
};
