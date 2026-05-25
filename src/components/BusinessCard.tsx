import { MapPin, Award, Clock, ChevronDown, Phone, Star, Navigation } from 'lucide-react';
import GratuitCard from './GratuitCard';
import { useState } from 'react';
import { cleanAltText } from '../lib/textNormalization';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';
import { extractMainCategory, getAllKeywords } from '../lib/categoryDisplay';
import { getFeaturedImageUrl } from '../lib/imagekitUtils';
import { mapSubscriptionToTier } from '../lib/subscriptionTiers';
import SignatureCard from './SignatureCard';
import {
  isCurrentlyOpen,
  translateOpenStatus,
  translateClosedStatus,
  getTodaySchedule,
  formatTodayScheduleText,
  parseHoraires,
} from '../lib/horaireUtils';
import { useCategoryTranslation } from '../hooks/useCategoryTranslation';
import { getMultilingualField } from '../lib/databaseI18n';
import { getLogoUrl } from '../lib/logoUtils';
import { RatingBadge } from './GoogleRating';

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    category?: string;
    categorie?: string;
    ville?: string | null;
    gouvernorat?: string | null;
    adresse?: string | null;
    description?: string | null;
    telephone?: string | null;
    phone?: string | null;
    statut_abonnement?: string | null;
    niveau_priorite_abonnement?: number | null;
    badges?: string[];
    imageUrl?: string | null;
    logoUrl?: string | null;
    horaires_ok?: string | null;
    note_google?: string | number | null;
    'Note Google Globale'?: string | number | null;
    nombre_avis?: string | number | null;
    'Compteur Avis Google'?: string | number | null;
    score_avis?: string | number | null;
    statut_carte?: string | null;
    name_ar?: string | null;
    name_en?: string | null;
    name_it?: string | null;
    name_ru?: string | null;
    description_ar?: string | null;
    description_en?: string | null;
    description_it?: string | null;
    description_ru?: string | null;
    google_url?: string | null;
    'BTN_Maps'?: string | null;
    featured?: boolean | null;
    is_premium?: boolean | null;
    approved?: boolean | null;
    statut_validation?: string | null;
  };
  onClick: () => void;
  variant?: 'simple' | 'premium';
}

function normalizeText(value: string | null | undefined): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function renderStatutCarteBadge(statut_carte: string | null | undefined) {
  if (!statut_carte) return null;

  const normalized = normalizeText(statut_carte);

  const isNonCertified =
    normalized.includes('NON CERTIFIE') ||
    normalized.includes('NON CERTIFIED') ||
    normalized.includes('NON');

  const isCertified =
    normalized.includes('CERTIFIE DALIL TOUNES') ||
    normalized.includes('CERTIFIED DALIL TOUNES') ||
    normalized.includes('CERTIFIE');

  const label = isNonCertified
    ? '⚠️ NON CERTIFIÉ'
    : isCertified
      ? '⭐ CERTIFIÉ DALIL TOUNES'
      : statut_carte;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        width: 'fit-content',
        fontSize: '9px',
        fontFamily: 'sans-serif',
        fontWeight: '800',
        letterSpacing: '0.03em',
        color: '#ffffff',
        backgroundColor: isNonCertified ? '#ea580c' : '#15803d',
        borderRadius: '20px',
        padding: '3px 9px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.16)',
        textTransform: 'uppercase',
        lineHeight: 1.2,
      }}
    >
      {label}
    </span>
  );
}

function getTierCardTheme(tier: string) {
  switch (tier) {
    case 'elite':
      return {
        background: '#000000',
        border: '#D4AF37',
        accent: '#D4AF37',
        title: '#D4AF37',
        text: '#E8E8E8',
        muted: '#CFCFCF',
        soft: 'rgba(212,175,55,0.12)',
        divider: 'rgba(212,175,55,0.30)',
        shadow: '0 16px 36px rgba(0,0,0,0.34)',
        badgeLabel: 'ÉLITE PRO',
      };

    case 'premium':
      return {
        background: '#064E3B',
        border: '#D4AF37',
        accent: '#D4AF37',
        title: '#D4AF37',
        text: '#E8E8E8',
        muted: '#D8EFE6',
        soft: 'rgba(212,175,55,0.12)',
        divider: 'rgba(212,175,55,0.28)',
        shadow: '0 14px 30px rgba(6,78,59,0.30)',
        badgeLabel: 'PREMIUM',
      };

    case 'artisan':
      return {
        background: '#7F1D1D',
        border: '#DC2626',
        accent: '#FCA5A5',
        title: '#FFFFFF',
        text: '#FEE2E2',
        muted: '#FECACA',
        soft: 'rgba(252,165,165,0.12)',
        divider: 'rgba(252,165,165,0.28)',
        shadow: '0 14px 30px rgba(127,29,29,0.28)',
        badgeLabel: 'ARTISAN',
      };

    case 'gratuit':
    default:
      return {
        background: '#FFFFFF',
        border: '#D4AF37',
        accent: '#D4AF37',
        title: '#1A1A1A',
        text: '#374151',
        muted: '#6B7280',
        soft: 'rgba(212,175,55,0.10)',
        divider: 'rgba(212,175,55,0.28)',
        shadow: '0 10px 24px rgba(0,0,0,0.08)',
        badgeLabel: 'DÉCOUVERTE',
      };
  }
}

export const BusinessCard = ({ business, onClick, variant = 'simple' }: BusinessCardProps) => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const bizForI18n = { ...business, nom: business.name };
  const displayName =
    String(getMultilingualField(bizForI18n, 'nom', language, true)) || business.name;

  const displayDescription =
    String(getMultilingualField(bizForI18n, 'description', language, true)) ||
    business.description ||
    null;

  const isArabicDisplay = language === 'ar';
  const { getCategory } = useCategoryTranslation();

  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  const tier = mapSubscriptionToTier({
    statut_abonnement: business.statut_abonnement,
    niveau_priorite_abonnement: business.niveau_priorite_abonnement,
  });

  const theme = getTierCardTheme(tier);

  const rawCategory =
    getMultilingualField(business, 'category', language, true) ||
    getMultilingualField(business, 'categorie', language, true) ||
    business.category ||
    business.categorie ||
    '';

  const mainCategory = extractMainCategory(rawCategory);
  const translatedCategory = getCategory(mainCategory);
  const allKeywords = getAllKeywords(rawCategory);

  const signatureTier: 'decouverte' | 'artisan' | 'premium' | 'elite' | 'custom' =
    tier === 'gratuit' ? 'decouverte' : tier;

  const displayImage =
    tier === 'gratuit'
      ? business.logoUrl
      : getFeaturedImageUrl(business.logoUrl, business.imageUrl);

  const isElite = tier === 'elite';

  if (tier === 'gratuit') {
    return (
      <GratuitCard
        name={displayName}
        logoUrl={business.logoUrl}
        category={translatedCategory}
        ville={business.ville}
        gouvernorat={business.gouvernorat || undefined}
        horaires_ok={business.horaires_ok}
        telephone={business.telephone || business.phone}
        language={language}
        allKeywords={allKeywords}
        statut_carte={business.statut_carte}
        description_ar={isArabicDisplay ? business.description_ar || null : null}
      />
    );
  }

  return (
    <div className="block" style={{ height: '100%' }}>
      <SignatureCard
        tier={signatureTier}
        className="p-3"
        onClick={onClick}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.background,
          border: `2px solid ${theme.border}`,
          borderRadius: '16px',
          boxShadow: theme.shadow,
          overflow: 'visible',
          position: 'relative',
          minHeight: '232px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: '16px',
            overflow: 'hidden',
            background:
              tier === 'elite'
                ? 'linear-gradient(135deg, rgba(212,175,55,0.18), transparent 36%, rgba(212,175,55,0.08))'
                : tier === 'premium'
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.14), transparent 42%, rgba(255,255,255,0.04))'
                  : 'linear-gradient(135deg, rgba(252,165,165,0.12), transparent 42%, rgba(255,255,255,0.04))',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: '100%',
            zIndex: 1,
            overflow: 'visible',
          }}
        >
          <div
            className="absolute z-10"
            style={{
              top: '-6px',
              left: '-4px',
            }}
          >
            <div
              className="flex items-center gap-1 font-bold"
              style={{
                padding: '0',
                fontSize: '11px',
                background: 'transparent',
                color: theme.accent,
                border: 'none',
                boxShadow: 'none',
                backdropFilter: 'none',
                whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              {isElite && <Award size={12} />}
              <span>{theme.badgeLabel}</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isElite ? '6px' : '4px',
              flex: 1,
              paddingTop: '0px',
              overflow: 'visible',
            }}
          >
            <div
              className="flex justify-center"
              style={{
                marginTop: '-2px',
                marginBottom: '8px',
                overflow: 'visible',
              }}
            >
              <div
                className="shadow-xl"
                style={{
                  width: isElite ? '62px' : '56px',
                  height: isElite ? '62px' : '56px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  border: `3px solid ${theme.accent}`,
                  boxShadow: `0 8px 22px rgba(0,0,0,0.30), 0 0 0 3px ${theme.background}`,
                  flexShrink: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={getLogoUrl(displayImage)}
                  alt={(() => {
                    const ville = business.gouvernorat || '';
                    const cat = cleanAltText(business.category || '');
                    if (!ville && !cat) return `${business.name} - Professionnel en Tunisie`;
                    if (!ville) return `${business.name} - ${cat}`;
                    if (!cat) return `${business.name} à ${ville} - Professionnel en Tunisie`;
                    return `${business.name} à ${ville} - ${cat}`;
                  })()}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '6px',
                    borderRadius: '9999px',
                  }}
                  width={62}
                  height={62}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.endsWith('/images/logo_dalil_tounes_sceau_luxe.webp')) {
                      img.src = '/images/logo_dalil_tounes_sceau_luxe.webp';
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <h3
                style={{
                  fontSize: isElite ? '16px' : '14px',
                  fontWeight: '700',
                  color: theme.title,
                  lineHeight: '1.3',
                  marginBottom: '2px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  letterSpacing: '-0.01em',
                  direction: isArabicDisplay ? 'rtl' : 'ltr',
                }}
              >
                {displayName}
              </h3>

              {business.statut_carte && (
                <div style={{ marginBottom: '4px' }}>
                  {renderStatutCarteBadge(business.statut_carte)}
                </div>
              )}

              {translatedCategory && (
                <p
                  style={{
                    fontSize: '11px',
                    color: theme.accent,
                    fontWeight: 600,
                    margin: '2px 0 4px',
                    lineHeight: 1.3,
                  }}
                >
                  {translatedCategory}
                </p>
              )}

              <meta name="keywords" content={allKeywords.join(', ')} />
              <span className="sr-only">{allKeywords.join(' ')}</span>
            </div>

            {displayDescription && (
              <div onClick={(e) => e.stopPropagation()}>
                <div
                  style={{
                    position: 'relative',
                    maxHeight: descriptionExpanded ? '600px' : '48px',
                    overflow: 'hidden',
                    transition: 'max-height 0.35s ease',
                  }}
                >
                  <p
                    style={{
                      fontSize: '13px',
                      color: theme.text,
                      lineHeight: '1.6',
                      margin: 0,
                      direction: isArabicDisplay ? 'rtl' : 'ltr',
                    }}
                  >
                    {displayDescription}
                  </p>

                  {!descriptionExpanded && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '20px',
                        background: `linear-gradient(to bottom, transparent, ${theme.background})`,
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
                    fontSize: '11px',
                    fontWeight: '600',
                    color: theme.accent,
                    letterSpacing: '0.02em',
                  }}
                >
                  {descriptionExpanded ? '▲ Voir moins' : '... Lire la suite'}
                </button>
              </div>
            )}

            {(business.telephone || business.phone) && (
              <div onClick={(e) => e.stopPropagation()}>
                <a
                  href={`tel:${business.telephone || business.phone}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: theme.accent,
                    textDecoration: 'none',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: `1px solid ${theme.divider}`,
                    background: theme.soft,
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.18)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = theme.soft)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone size={13} style={{ flexShrink: 0 }} />
                  <span>{business.telephone || business.phone}</span>
                </a>
              </div>
            )}

            {business.adresse && (
              <div style={{ paddingTop: '2px' }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
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
                      color: theme.accent,
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    <MapPin size={14} style={{ color: theme.accent, flexShrink: 0 }} />
                    <span>{showAddress ? "Masquer l'adresse" : "Afficher l'adresse"}</span>
                  </button>

                  {(business['BTN_Maps'] || business.adresse) && (
                    <a
                      href={
                        business['BTN_Maps'] ||
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.adresse || '')}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="Ouvrir dans Google Maps"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        border: `1px solid ${theme.divider}`,
                        background: theme.soft,
                        color: theme.accent,
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '0.03em',
                        textDecoration: 'none',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      <Navigation size={12} style={{ color: theme.accent, flexShrink: 0 }} />
                      <span>GPS</span>
                    </a>
                  )}
                </div>

                <div
                  style={{
                    maxHeight: showAddress ? '120px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease, opacity 0.3s ease',
                    opacity: showAddress ? 1 : 0,
                  }}
                >
                  <p
                    style={{
                      marginTop: '6px',
                      fontSize: '13px',
                      color: theme.text,
                      lineHeight: '1.5',
                      padding: '6px 10px',
                      background: theme.soft,
                      borderRadius: '6px',
                      borderLeft: `3px solid ${theme.accent}`,
                    }}
                  >
                    {business.adresse}
                  </p>
                </div>
              </div>
            )}

            <RatingBadge
              rating={business.note_google || business['Note Google Globale']}
              reviewCount={business.nombre_avis || business['Compteur Avis Google']}
              className="mt-1"
            />

            {business.score_avis != null && business.score_avis !== '' && (
              <div
                className="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-lg"
                style={{
                  background: theme.soft,
                  border: `1px solid ${theme.divider}`,
                }}
              >
                <Star size={14} style={{ fill: theme.accent, color: theme.accent, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: theme.accent }}>
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
                    textAlign: 'left',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Clock
                        className="w-4 h-4"
                        style={{
                          color: isCurrentlyOpen(business.horaires_ok) ? '#10B981' : '#EF4444',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: isCurrentlyOpen(business.horaires_ok) ? '#10B981' : '#EF4444',
                        }}
                      >
                        {isCurrentlyOpen(business.horaires_ok)
                          ? translateOpenStatus(language)
                          : translateClosedStatus(language)}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: theme.muted, lineHeight: '1.3' }}>
                      {formatTodayScheduleText(getTodaySchedule(business.horaires_ok), language)}
                    </div>
                  </div>

                  <ChevronDown
                    size={16}
                    style={{
                      color: theme.accent,
                      transform: showFullSchedule ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </button>

                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    maxHeight: showFullSchedule ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease, opacity 0.3s ease',
                    opacity: showFullSchedule ? 1 : 0,
                  }}
                >
                  <div
                    style={{
                      padding: '8px',
                      backgroundColor: theme.soft,
                      borderRadius: '8px',
                      fontSize: '11px',
                      lineHeight: '1.5',
                      marginTop: '4px',
                    }}
                  >
                    {parseHoraires(business.horaires_ok).map((schedule, index) => {
                      const now = new Date();
                      const todayIndex = (now.getDay() + 6) % 7;
                      const dayIndex = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].findIndex((d) =>
                        schedule.day.includes(d)
                      );
                      const isToday = dayIndex === todayIndex;

                      return (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            padding: '6px 8px',
                            backgroundColor: isToday ? theme.soft : index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.04)',
                            borderRadius: '4px',
                            marginBottom: '2px',
                            gap: '12px',
                          }}
                        >
                          <span
                            style={{
                              minWidth: '90px',
                              maxWidth: '110px',
                              flexShrink: 0,
                              fontWeight: isToday ? '700' : '500',
                              color: schedule.isOpen ? theme.accent : '#FF6B6B',
                              wordWrap: 'break-word',
                              lineHeight: '1.3',
                            }}
                          >
                            {schedule.day}
                          </span>

                          <span
                            style={{
                              flex: 1,
                              fontWeight: isToday ? '600' : '400',
                              color: schedule.isOpen ? theme.text : '#FF6B6B',
                              wordWrap: 'break-word',
                              lineHeight: '1.3',
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
                marginTop: 'auto',
                paddingTop: '6px',
                borderTop: `1px solid ${theme.divider}`,
                background: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'block',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: theme.accent,
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
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