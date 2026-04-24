import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ChevronDown } from 'lucide-react';
import { generateBusinessUrl } from '../../lib/slugify';
import { mapSubscriptionToTier } from '../../lib/subscriptionTiers';
import { getLogoUrl, getLogoStyle, getLogoContainerStyle } from '../../lib/logoUtils';
import {
  isCurrentlyOpen,
  getTodaySchedule,
  formatTodayScheduleText,
  parseHoraires,
  translateOpenStatus,
  translateClosedStatus,
} from '../../lib/horaireUtils';

interface SeoBusinessCardProps {
  business: {
    id: string;
    nom: string;
    adresse?: string;
    ville?: string;
    gouvernorat?: string;
    telephone?: string;
    'catégorie'?: string[];
    sous_categories?: string | string[];
    'Note Google Globale'?: number | null;
    'Compteur Avis Google'?: number | null;
    logo_url?: string;
    description?: string;
    is_premium?: boolean;
    statut_abonnement?: string | null;
    'statut Abonnement'?: string | null;
    horaires_ok?: string | null;
  };
}

const SeoBusinessCard: React.FC<SeoBusinessCardProps> = ({ business }) => {
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const rawStatut = business.statut_abonnement || business['statut Abonnement'] || null;
  const tier = mapSubscriptionToTier({ statut_abonnement: rawStatut });
  const url = generateBusinessUrl(business.nom, business.id);
  const locationLabel = business.ville || business.gouvernorat || '';

  const rawCat = business.sous_categories || business['catégorie'] || [];
  const categoryLabel = Array.isArray(rawCat) ? rawCat.join(', ') : rawCat;

  if (tier === 'gratuit') {
    const isOpen = isCurrentlyOpen(business.horaires_ok ?? null);
    const todayText = formatTodayScheduleText(getTodaySchedule(business.horaires_ok ?? null), 'fr');

    return (
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid #D4AF37',
          borderRadius: '16px',
          boxShadow: '0 0 15px rgba(212,175,55,0.3), 0 4px 12px rgba(212,175,55,0.15)',
          padding: '20px',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Logo centré */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-36px', marginBottom: '4px' }}>
            <div className="w-16 h-16 shadow-xl" style={getLogoContainerStyle('#D4AF37', '3px')}>
              <img
                src={getLogoUrl(business.logo_url)}
                alt={`Logo ${business.nom}${locationLabel ? ` à ${locationLabel}` : ''} - Établissement Tunisie - Dalil Tounes`}
                className="w-full h-full"
                style={getLogoStyle(business.logo_url)}
                loading="lazy"
              />
            </div>
          </div>

          {/* Nom + catégorie */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', lineHeight: '1.3', marginBottom: '3px', letterSpacing: '-0.01em' }}>
              {business.nom}
            </h3>
            {categoryLabel && (
              <p style={{ fontSize: '11px', fontWeight: '500', color: '#6B7280', lineHeight: '1.4', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {categoryLabel}
              </p>
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
                onClick={(e) => { e.preventDefault(); setShowFullSchedule(!showFullSchedule); }}
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                      <Clock className="w-3 h-3" style={{ color: isOpen ? '#10B981' : '#EF4444', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', fontWeight: '700', color: isOpen ? '#10B981' : '#EF4444' }}>
                        {isOpen ? translateOpenStatus('fr') : translateClosedStatus('fr')}
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
                onClick={(e) => e.preventDefault()}
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

          {/* Lien Voir les détails */}
          <Link
            to={url}
            style={{ display: 'block', marginTop: '4px', paddingTop: '10px', borderTop: '1px solid rgba(212,175,55,0.25)', textDecoration: 'none' }}
          >
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#D4AF37', letterSpacing: '0.01em' }}>
              Voir les détails →
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // Tiers payants : design sombre existant
  const rating = business['Note Google Globale'];
  const reviewCount = business['Compteur Avis Google'];
  const location = [business.ville, business.gouvernorat].filter(Boolean).join(', ');

  return (
    <Link
      to={url}
      className="group block bg-[#1a1a1a] border border-gray-800 hover:border-[#D4AF37]/50 rounded-xl p-5 transition-all duration-200 hover:shadow-[0_4px_24px_rgba(212,175,55,0.08)]"
    >
      <div className="flex items-start gap-4">
        {business.logo_url ? (
          <img
            src={business.logo_url}
            alt={`${business.nom}${locationLabel ? ` à ${locationLabel}` : ''}`}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-900"
            loading="lazy"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-800 flex-shrink-0 flex items-center justify-center">
            <span className="text-gray-600 text-lg font-semibold">{business.nom.charAt(0).toUpperCase()}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white text-sm group-hover:text-[#D4AF37] transition-colors truncate">
              {business.nom}
            </h3>
            {(tier === 'premium' || tier === 'elite') && (
              <span className="flex-shrink-0 text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                {tier === 'elite' ? 'Élite' : 'Premium'}
              </span>
            )}
          </div>

          {rating != null && rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[#D4AF37] text-xs">★</span>
              <span className="text-[#D4AF37] text-xs font-medium">{rating.toFixed(1)}</span>
              {reviewCount && reviewCount > 0 && (
                <span className="text-gray-600 text-xs">({reviewCount})</span>
              )}
            </div>
          )}

          {location && (
            <div className="flex items-center gap-1 mt-1.5">
              <MapPin className="w-3 h-3 text-gray-600 flex-shrink-0" />
              <span className="text-gray-500 text-xs truncate">{location}</span>
            </div>
          )}

          {business.description && (
            <p className="text-gray-600 text-xs mt-2 line-clamp-2 leading-relaxed">{business.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SeoBusinessCard;
