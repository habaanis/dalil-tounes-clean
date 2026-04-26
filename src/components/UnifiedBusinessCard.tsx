import { MapPin, Award, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';
import { extractMainCategory, getAllKeywords } from '../lib/categoryDisplay';
import { mapSubscriptionToTier, getPriorityLevel } from '../lib/subscriptionTiers';
import {
  isCurrentlyOpen,
  translateOpenStatus,
  translateClosedStatus,
  getTodaySchedule,
  formatTodayScheduleText,
  parseHoraires
} from '../lib/horaireUtils';
import { useCategoryTranslation } from '../hooks/useCategoryTranslation';
import { getMultilingualField } from '../lib/databaseI18n';
import { getLogoUrl, getLogoStyle, getLogoContainerStyle } from '../lib/logoUtils';
import { cleanAltText } from '../lib/textNormalization';

interface UnifiedBusinessCardProps {
  business: {
    id: string;
    nom?: string;
    name?: string;
    categorie?: string;
    category?: string;
    sous_categories?: string;
    ville?: string;
    gouvernorat?: string;
    statut_abonnement?: string | null;
    subscription_tier?: string | null;
    'niveau priorité abonnement'?: number | null;
    image_url?: string | null;
    imageUrl?: string | null;
    logo_url?: string | null;
    logoUrl?: string | null;
    horaires_ok?: string | null;
    is_premium?: boolean;
    statut_carte?: string | null;
    name_ar?: string | null;
    description_ar?: string | null;
  };
  onClick: () => void;
}

function renderStatutCarteBadge(statut_carte: string | null | undefined) {
  if (!statut_carte) return null;
  const isNonCertified = statut_carte.includes('NON');
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '9px',
      fontFamily: 'sans-serif',
      fontWeight: '700',
      letterSpacing: '0.03em',
      color: '#ffffff',
      backgroundColor: isNonCertified ? '#ea580c' : '#15803d',
      borderRadius: '20px',
      padding: '2px 8px',
    }}>
      {statut_carte}
    </span>
  );
}

function isArabicText(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

const UnifiedBusinessCard = ({ business, onClick }: UnifiedBusinessCardProps) => {
  console.log('statut_carte =', business.statut_carte, '| entreprise =', business.nom || business.name);
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { getCategory } = useCategoryTranslation();
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const showArabic = isArabicText(searchQuery) && !!(business.name_ar || business.description_ar);

  const businessName = showArabic && business.name_ar ? business.name_ar : (business.nom || business.name || '');

  // Récupération de la catégorie traduite avec fallback
  const rawCategory = getMultilingualField(business, 'category', language, true) ||
                      getMultilingualField(business, 'categorie', language, true) ||
                      business.categorie ||
                      business.category ||
                      business.sous_categories ||
                      '';

  const businessLocation = business.ville || business.gouvernorat || '';
  const businessLogo = getLogoUrl(business.logo_url || business.logoUrl);
  const businessSubscription = business.statut_abonnement || business.subscription_tier;

  const priorityLevel = getPriorityLevel({
    statut_abonnement: businessSubscription,
    'niveau priorité abonnement': business['niveau priorité abonnement']
  });

  const mainCategory = extractMainCategory(rawCategory);
  const translatedCategory = getCategory(mainCategory);
  const allKeywords = getAllKeywords(rawCategory);
  const isElite = priorityLevel === 4;

  return (
    <div
      onClick={(e) => {
        console.log('🎯 [UnifiedBusinessCard] Carte cliquée', business.nom);
        onClick();
      }}
      className="relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
      style={{
        border: '2px solid #D4AF37',
        boxShadow: isElite
          ? '0 0 20px rgba(212, 175, 55, 0.4), 0 8px 16px rgba(212, 175, 55, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        maxHeight: '200px'
      }}
    >
      {/* Header demi-cercle blanc avec logo */}
      <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50" style={{ height: '70px' }}>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 shadow-lg"
          style={getLogoContainerStyle('#D4AF37', '3px')}
        >
          <img
            src={businessLogo}
            alt={(() => {
              const ville = businessLocation;
              const cat = cleanAltText(business.sous_categories || rawCategory || '');
              if (!ville && !cat) return `${businessName} - Professionnel en Tunisie`;
              if (!ville) return `${businessName} - ${cat}`;
              if (!cat) return `${businessName} à ${ville} - Professionnel en Tunisie`;
              return `${businessName} à ${ville} - ${cat}`;
            })()}
            className="w-full h-full"
            style={getLogoStyle(business.logo_url || business.logoUrl)}
            loading="lazy"
            decoding="async"
          />
        </div>

        {isElite && (
          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center gap-1 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-white px-2 py-0.5 rounded-full shadow-lg text-[10px] font-semibold">
              <Award size={10} />
              <span>Elite</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenu ultra-compact */}
      <div className="p-3 flex flex-col gap-1">
        <h3
          className="text-sm font-bold text-gray-900 text-center line-clamp-1 leading-tight"
          style={{ direction: showArabic && business.name_ar ? 'rtl' : 'ltr' }}
        >
          {businessName}
        </h3>
        {business.statut_carte && (
          <div className="flex justify-center">
            {renderStatutCarteBadge(business.statut_carte)}
          </div>
        )}
        {showArabic && business.description_ar && (
          <p className="text-[10px] text-gray-500 text-center line-clamp-2 leading-tight" style={{ direction: 'rtl' }}>
            {business.description_ar}
          </p>
        )}

        {translatedCategory && (
          <>
            <p className="text-[11px] font-medium text-gray-600 text-center line-clamp-1">
              {translatedCategory}
            </p>
            <meta name="keywords" content={allKeywords.join(', ')} />
            <span className="sr-only">{allKeywords.join(' ')}</span>
          </>
        )}

        {businessLocation && (
          <div className="flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
            <span className="text-[10px] font-medium text-gray-600">{businessLocation}</span>
          </div>
        )}

        {business.horaires_ok && (
          <div className="mt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFullSchedule(!showFullSchedule);
              }}
              className="w-full flex items-center justify-between bg-none border-none cursor-pointer p-0 text-left"
            >
              <div className="flex-1">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Clock
                    className="w-3 h-3 flex-shrink-0"
                    style={{ color: isCurrentlyOpen(business.horaires_ok) ? '#10B981' : '#EF4444' }}
                  />
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: isCurrentlyOpen(business.horaires_ok) ? '#10B981' : '#EF4444' }}
                  >
                    {isCurrentlyOpen(business.horaires_ok)
                      ? translateOpenStatus(language)
                      : translateClosedStatus(language)
                    }
                  </span>
                </div>
                <div className="text-[9px] text-gray-600 text-center leading-tight">
                  {formatTodayScheduleText(getTodaySchedule(business.horaires_ok), language)}
                </div>
              </div>

              <ChevronDown
                size={12}
                className="text-[#D4AF37] transition-transform ml-1"
                style={{ transform: showFullSchedule ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="overflow-hidden transition-all"
              style={{
                maxHeight: showFullSchedule ? '500px' : '0',
                opacity: showFullSchedule ? 1 : 0
              }}
            >
              <div className="p-2 bg-gray-50 rounded-lg text-[10px] leading-relaxed mt-1">
                {parseHoraires(business.horaires_ok).map((schedule, index) => {
                  const now = new Date();
                  const todayIndex = (now.getDay() + 6) % 7;
                  const dayIndex = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].findIndex(d => schedule.day.includes(d));
                  const isToday = dayIndex === todayIndex;

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-1.5 rounded mb-0.5"
                      style={{
                        backgroundColor: isToday ? 'rgba(59, 130, 246, 0.08)' : index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.02)'
                      }}
                    >
                      <span
                        className="flex-shrink-0"
                        style={{
                          minWidth: '70px',
                          maxWidth: '90px',
                          fontWeight: isToday ? '700' : '500',
                          color: schedule.isOpen ? '#1A1A1A' : '#EF4444',
                          wordWrap: 'break-word',
                          lineHeight: '1.3'
                        }}
                      >
                        {schedule.day}
                      </span>
                      <span
                        className="flex-1"
                        style={{
                          fontWeight: isToday ? '600' : '400',
                          color: schedule.isOpen ? (isToday ? '#1A1A1A' : '#6B7280') : '#EF4444',
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
      </div>

      {/* Bandeau catégorie en bas */}
      <div
        className="px-3 py-1.5 text-center border-t"
        style={{
          backgroundColor: isElite ? '#4A1D43' : '#F3F4F6',
          borderTopColor: '#D4AF37'
        }}
      >
        <span
          className="text-[11px] font-bold hover:underline"
          style={{ color: isElite ? '#D4AF37' : '#D4AF37' }}
        >
          {t.common.viewDetails} →
        </span>
      </div>
    </div>
  );
};

export { UnifiedBusinessCard };
export default UnifiedBusinessCard;
