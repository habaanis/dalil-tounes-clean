import { MapPin, Award, Clock, ChevronDown, Phone, Star } from 'lucide-react';
import { useState } from 'react';
import { cleanAltText } from '../lib/textNormalization';
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
    ville?: string | null;
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

  const isElite = tier === 'elite';
  const isPremiumTier = tier === 'premium' || tier === 'elite' || tier === 'artisan';

  // Rendu dédié pour le tier Gratuit — carte épurée
  if (tier === 'gratuit') {
    const locationLabel = business.ville || business.gouvernorat || '';
    const isOpen = isCurrentlyOpen(business.horaires_ok ?? null);
    const todayText = formatTodayScheduleText(getTodaySchedule(business.horaires_ok ?? null), language);

    return (
      <div className="block">
        <SignatureCard tier="decouverte" className="p-5" onClick={onClick}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Logo centré */}
            <div className="flex justify-center -mt-8 mb-1">
              <div className="w-16 h-16 shadow-xl" style={getLogoContainerStyle('#D4AF37', '3px')}>
                <img
                  src={getLogoUrl(business.logoUrl)}
                  alt={`${business.name}${locationLabel ? ` à ${locationLabel}` : ''}`}
                  className="w-full h-full"
                  style={getLogoStyle(business.logoUrl)}
                />
              </div>
            </div>

            {/* Nom */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', lineHeight: '1.3', marginBottom: '3px', letterSpacing: '-0.01em' }}>
                {business.name}
              </h3>
              {translatedCategory && (
                <>
                  <p style={{ fontSize: '11px', fontWeight: '500', color: '#6B7280', lineHeight: '1.4', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {translatedCategory}
                  </p>
                  <meta name="keywords" content={allKeywords.join(', ')} />
                  <span className="sr-only">{allKeywords.join(' ')}</span>
                </>
              )}
            </div>

            {/* Ville */}
            {locationLabel && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin className="w-3 h-3" style={{ color: '#6B7280', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>{locationLabel}</span>
              </div>
            )}

            {/* Horaires */}
            {business.horaires_ok && (
              <div>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowFullSchedule(!showFullSchedule); }}
                  style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                        <Clock className="w-3 h-3" style={{ color: isOpen ? '#10B981' : '#EF4444', flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', fontWeight: '700', color: isOpen ? '#10B981' : '#EF4444' }}>
                          {isOpen ? translateOpenStatus(language) : translateClosedStatus(language)}
                        </span>
                      </div>
                      {todayText && (
                        <p style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.3', margin: 0 }}>{todayText}</p>
                      )}
                    </div>
                    <ChevronDown
                      size={14}
                      style={{ color: '#D4AF37', transform: showFullSchedule ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0 }}
                    />
                  </div>
                </button>

                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{ maxHeight: showFullSchedule ? '400px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.3s ease', opacity: showFullSchedule ? 1 : 0 }}
                >
                  <div style={{ padding: '6px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '8px', fontSize: '10px', lineHeight: '1.5', marginTop: '6px' }}>
                    {parseHoraires(business.horaires_ok).map((schedule, index) => {
                      const now = new Date();
                      const todayIndex = (now.getDay() + 6) % 7;
                      const dayIndex = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].findIndex(d => schedule.day.includes(d));
                      const isToday = dayIndex === todayIndex;
                      return (
                        <div key={index} style={{ display: 'flex', gap: '12px', padding: '4px 6px', backgroundColor: isToday ? 'rgba(59,130,246,0.07)' : 'transparent', borderRadius: '4px', marginBottom: '2px' }}>
                          <span style={{ minWidth: '72px', fontWeight: isToday ? '700' : '500', color: schedule.isOpen ? '#1A1A1A' : '#FF6B6B' }}>{schedule.day}</span>
                          <span style={{ flex: 1, fontWeight: isToday ? '600' : '400', color: schedule.isOpen ? (isToday ? '#1A1A1A' : '#6B7280') : '#FF6B6B' }}>{schedule.hours}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Bouton Voir les détails */}
            <button
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              style={{ width: '100%', marginTop: '4px', paddingTop: '10px', borderTop: '1px solid rgba(212,175,55,0.25)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'block' }}
            >
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#D4AF37', letterSpacing: '0.01em' }} className="hover:underline">
                {t.common.viewDetails} →
              </span>
            </button>
          </div>
        </SignatureCard>
      </div>
    );
  }

  return (
    <div className="block">
      <SignatureCard
        tier={signatureTier}
        className={paddingClass}
        onClick={onClick}
      >
      <div style={{ position: 'relative' }}>
        {isElite && (
          <div className="absolute top-0 right-0 z-10">
            <div className="flex items-center gap-1 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-[#121212] px-3 py-1.5 rounded-full shadow-lg text-xs font-bold">
              <Award size={14} />
              <span>ÉLITE PRO</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: isElite ? '16px' : '12px' }}>
        {/* Header avec logo rond centralisé */}
        <div className="flex justify-center -mt-4 mb-2">
          <div
            className={`${isElite ? 'w-20 h-20' : 'w-16 h-16'} shadow-xl`}
            style={getLogoContainerStyle(accentColor, '3px')}
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
              className="w-full h-full"
              style={getLogoStyle(displayImage)}
            />
          </div>
        </div>

        <div>
          <h3
            style={{
              fontSize: isElite ? '20px' : '18px',
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
                  fontSize: '13px',
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
            <MapPin className="w-4 h-4" style={{ color: accentColor, flexShrink: 0 }} />
            <span style={{ fontSize: '14px', fontWeight: '500', color: secondaryTextColor }}>
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
                maxHeight: descriptionExpanded ? '600px' : '48px',
                overflow: 'hidden',
                transition: 'max-height 0.35s ease',
              }}
            >
              <p style={{ fontSize: '13px', color: secondaryTextColor, lineHeight: '1.6', margin: 0 }}>
                {business.description}
              </p>
              {!descriptionExpanded && (
                <div
                  style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '20px',
                    background: 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.85))',
                  }}
                />
              )}
            </div>
            <button
              onClick={() => setDescriptionExpanded(!descriptionExpanded)}
              style={{ background: 'none', border: 'none', padding: '2px 0 0 0', cursor: 'pointer', fontSize: '11px', fontWeight: '600', color: accentColor, letterSpacing: '0.02em' }}
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
                display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: '600',
                color: accentColor, textDecoration: 'none', padding: '4px 10px', borderRadius: '20px',
                border: `1px solid rgba(212,175,55,0.35)`, background: 'rgba(212,175,55,0.08)', transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.08)')}
              onClick={(e) => e.stopPropagation()}
            >
              <Phone size={13} style={{ flexShrink: 0 }} />
              <span>{business.telephone || business.phone}</span>
            </a>
          </div>
        )}

        {/* Adresse avec bouton toggle */}
        {business.adresse && (
          <div style={{ paddingTop: '2px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowAddress(!showAddress)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: accentColor, fontSize: '13px', fontWeight: '500' }}
            >
              <MapPin size={14} style={{ color: accentColor, flexShrink: 0 }} />
              <span>{showAddress ? "Masquer l'adresse" : "Afficher l'adresse"}</span>
            </button>
            <div style={{ maxHeight: showAddress ? '120px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.3s ease', opacity: showAddress ? 1 : 0 }}>
              <p style={{ marginTop: '6px', fontSize: '13px', color: secondaryTextColor, lineHeight: '1.5', padding: '6px 10px', background: 'rgba(212, 175, 55, 0.07)', borderRadius: '6px', borderLeft: `3px solid ${accentColor}` }}>
                {business.adresse}
              </p>
            </div>
          </div>
        )}

        {/* Note Google */}
        <RatingBadge
          rating={business.note_google || business['Note Google Globale']}
          reviewCount={business.nombre_avis || business['Compteur Avis Google']}
          className="mt-1"
        />

        {/* Score avis interne */}
        {business.score_avis != null && business.score_avis !== '' && (
          <div className="inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.35)' }}>
            <Star size={14} style={{ fill: '#D4AF37', color: '#D4AF37', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#D4AF37' }}>{business.score_avis} / 5</span>
          </div>
        )}

        {business.horaires_ok && (
          <div style={{ paddingTop: '4px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowFullSchedule(!showFullSchedule); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', textAlign: 'left' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Clock className="w-4 h-4" style={{ color: isCurrentlyOpen(business.horaires_ok) ? '#10B981' : '#EF4444', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: isCurrentlyOpen(business.horaires_ok) ? '#10B981' : '#EF4444' }}>
                    {isCurrentlyOpen(business.horaires_ok) ? translateOpenStatus(language) : translateClosedStatus(language)}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: secondaryTextColor, lineHeight: '1.3' }}>
                  {formatTodayScheduleText(getTodaySchedule(business.horaires_ok), language)}
                </div>
              </div>
              <ChevronDown size={16} style={{ color: accentColor, transform: showFullSchedule ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: showFullSchedule ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.3s ease', opacity: showFullSchedule ? 1 : 0 }}
            >
              <div style={{ padding: '8px', backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: '8px', fontSize: '11px', lineHeight: '1.5', marginTop: '4px' }}>
                {parseHoraires(business.horaires_ok).map((schedule, index) => {
                  const now = new Date();
                  const todayIndex = (now.getDay() + 6) % 7;
                  const dayIndex = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].findIndex(d => schedule.day.includes(d));
                  const isToday = dayIndex === todayIndex;
                  return (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', padding: '6px 8px', backgroundColor: isToday ? 'rgba(212, 175, 55, 0.15)' : (index % 2 === 0 ? 'transparent' : 'rgba(212, 175, 55, 0.05)'), borderRadius: '4px', marginBottom: '2px', gap: '12px' }}>
                      <span style={{ minWidth: '90px', maxWidth: '110px', flexShrink: 0, fontWeight: isToday ? '700' : '500', color: schedule.isOpen ? '#D4AF37' : '#FF6B6B', wordWrap: 'break-word', lineHeight: '1.3' }}>{schedule.day}</span>
                      <span style={{ flex: 1, fontWeight: isToday ? '600' : '400', color: schedule.isOpen ? (isToday ? '#D4AF37' : '#E8E8E8') : '#FF6B6B', wordWrap: 'break-word', lineHeight: '1.3' }}>{schedule.hours}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          style={{ width: '100%', marginTop: '2px', paddingTop: '12px', borderTop: '1px solid rgba(212, 175, 55, 0.3)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'block' }}
        >
          <span style={{ fontSize: '14px', fontWeight: '700', color: accentColor, textDecoration: 'none', letterSpacing: '0.01em' }} className="hover:underline">
            {t.common.viewDetails} →
          </span>
        </button>
        </div>
      </div>
      </SignatureCard>
    </div>
  );
};
