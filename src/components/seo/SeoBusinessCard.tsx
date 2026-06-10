import React, { useState } from 'react';
import { MapPin, Clock, ChevronDown, Phone } from 'lucide-react';
import { mapSubscriptionToTier, type SubscriptionTier } from '../../lib/subscriptionTiers';
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
    horaires_ok?: string | null;
  };
}

function getTierTheme(tier: SubscriptionTier) {
  switch (tier) {
    case 'premium':
      return {
        bg: '#064E3B',
        border: '#D4AF37',
        title: '#D4AF37',
        text: '#E8E8E8',
        muted: '#D8EFE6',
        accent: '#D4AF37',
        logoBorder: '#D4AF37',
        badgeLabel: 'PREMIUM',
        badgeBg: 'rgba(212,175,55,0.15)',
        phoneBg: '#D4AF37',
        phoneText: '#064E3B',
      };
    case 'elite':
      return {
        bg: '#000000',
        border: '#D4AF37',
        title: '#D4AF37',
        text: '#E8E8E8',
        muted: '#CFCFCF',
        accent: '#D4AF37',
        logoBorder: '#D4AF37',
        badgeLabel: 'ELITE PRO',
        badgeBg: 'rgba(212,175,55,0.15)',
        phoneBg: '#D4AF37',
        phoneText: '#000000',
      };
    case 'artisan':
      return {
        bg: '#7F1D1D',
        border: '#DC2626',
        title: '#FFFFFF',
        text: '#FEE2E2',
        muted: '#FECACA',
        accent: '#FCA5A5',
        logoBorder: '#DC2626',
        badgeLabel: 'ARTISAN',
        badgeBg: 'rgba(252,165,165,0.15)',
        phoneBg: '#FCA5A5',
        phoneText: '#7F1D1D',
      };
    default:
      return null;
  }
}

const SeoBusinessCard: React.FC<SeoBusinessCardProps> = ({ business }) => {
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const rawStatut = business.statut_abonnement || null;
  const tier = mapSubscriptionToTier({ statut_abonnement: rawStatut });
  const locationLabel = business.ville || business.gouvernorat || '';

  const rawCat = business.sous_categories || business['catégorie'] || [];
  const categoryLabel = Array.isArray(rawCat) ? rawCat.join(', ') : rawCat;

  const phone = business.telephone || null;
  const isOpen = isCurrentlyOpen(business.horaires_ok ?? null);
  const todayText = formatTodayScheduleText(getTodaySchedule(business.horaires_ok ?? null), 'fr');

  const paidTheme = getTierTheme(tier);

  if (paidTheme) {
    return (
      <div
        style={{
          backgroundColor: paidTheme.bg,
          border: `2px solid ${paidTheme.border}`,
          borderRadius: '16px',
          boxShadow: `0 8px 24px rgba(0,0,0,0.25)`,
          padding: '20px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-36px', marginBottom: '4px' }}>
            <div className="w-16 h-16 shadow-xl" style={getLogoContainerStyle(paidTheme.logoBorder, '3px')}>
              <img
                src={getLogoUrl(business.logo_url)}
                alt={`Logo ${business.nom}${locationLabel ? ` à ${locationLabel}` : ''}`}
                className="w-full h-full"
                style={getLogoStyle(business.logo_url)}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: paidTheme.title, lineHeight: '1.3', letterSpacing: '-0.01em', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {business.nom}
            </h3>
            <span style={{
              flexShrink: 0, fontSize: '8px', fontWeight: '800', letterSpacing: '0.05em',
              padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' as const,
              backgroundColor: paidTheme.badgeBg, color: paidTheme.accent,
              border: `1px solid ${paidTheme.accent}40`,
            }}>
              {paidTheme.badgeLabel}
            </span>
          </div>

          {categoryLabel && (
            <p style={{ fontSize: '11px', fontWeight: '500', color: paidTheme.muted, lineHeight: '1.4', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {categoryLabel}
            </p>
          )}

          {locationLabel && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin style={{ width: '12px', height: '12px', color: paidTheme.muted, flexShrink: 0 }} />
              <span style={{ fontSize: '12px', fontWeight: '500', color: paidTheme.text }}>{locationLabel}</span>
            </div>
          )}

          {business.horaires_ok && (
            <div>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowFullSchedule(!showFullSchedule); }}
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                      <Clock style={{ width: '12px', height: '12px', color: isOpen ? '#10B981' : '#EF4444', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', fontWeight: '700', color: isOpen ? '#10B981' : '#EF4444' }}>
                        {isOpen ? translateOpenStatus('fr') : translateClosedStatus('fr')}
                      </span>
                    </div>
                    {todayText && (
                      <p style={{ fontSize: '11px', color: paidTheme.muted, lineHeight: '1.3', margin: 0 }}>{todayText}</p>
                    )}
                  </div>
                  <ChevronDown
                    size={14}
                    style={{ color: paidTheme.accent, transform: showFullSchedule ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0 }}
                  />
                </div>
              </button>

              <div
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: showFullSchedule ? '400px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.3s ease', opacity: showFullSchedule ? 1 : 0 }}
              >
                <div style={{ padding: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '10px', lineHeight: '1.5', marginTop: '6px' }}>
                  {parseHoraires(business.horaires_ok).map((schedule, index) => {
                    const now = new Date();
                    const todayIndex = (now.getDay() + 6) % 7;
                    const dayIndex = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].findIndex(d => schedule.day.includes(d));
                    const isToday = dayIndex === todayIndex;
                    return (
                      <div key={index} style={{ display: 'flex', gap: '12px', padding: '4px 6px', backgroundColor: isToday ? 'rgba(255,255,255,0.08)' : 'transparent', borderRadius: '4px', marginBottom: '2px' }}>
                        <span style={{ minWidth: '72px', fontWeight: isToday ? '700' : '500', color: schedule.isOpen ? paidTheme.text : '#FF6B6B' }}>{schedule.day}</span>
                        <span style={{ flex: 1, fontWeight: isToday ? '600' : '400', color: schedule.isOpen ? (isToday ? paidTheme.text : paidTheme.muted) : '#FF6B6B' }}>{schedule.hours}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                marginTop: '4px', padding: '10px', borderRadius: '10px',
                backgroundColor: paidTheme.phoneBg, color: paidTheme.phoneText,
                fontWeight: '700', fontSize: '13px', textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
            >
              <Phone style={{ width: '14px', height: '14px' }} />
              Appeler
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '2px solid #D4AF37',
        borderRadius: '16px',
        boxShadow: '0 0 15px rgba(212,175,55,0.3), 0 4px 12px rgba(212,175,55,0.15)',
        padding: '20px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-36px', marginBottom: '4px' }}>
          <div className="w-16 h-16 shadow-xl" style={getLogoContainerStyle('#D4AF37', '3px')}>
            <img
              src={getLogoUrl(business.logo_url)}
              alt={`Logo ${business.nom}${locationLabel ? ` à ${locationLabel}` : ''}`}
              className="w-full h-full"
              style={getLogoStyle(business.logo_url)}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

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

        {locationLabel && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin className="w-3 h-3" style={{ color: '#6B7280', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>{locationLabel}</span>
          </div>
        )}

        {business.horaires_ok && (
          <div>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowFullSchedule(!showFullSchedule); }}
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

        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginTop: '4px', padding: '10px', borderRadius: '10px',
              backgroundColor: '#D4AF37', color: '#1A1A1A',
              fontWeight: '700', fontSize: '13px', textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
          >
            <Phone style={{ width: '14px', height: '14px' }} />
            Appeler
          </a>
        )}
      </div>
    </div>
  );
};

export default SeoBusinessCard;
