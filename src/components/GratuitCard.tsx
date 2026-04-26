import { useState } from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import { isCurrentlyOpen, translateOpenStatus, translateClosedStatus } from '../lib/horaireUtils';
import { getLogoUrl, getLogoStyle, getLogoContainerStyle } from '../lib/logoUtils';

interface GratuitCardProps {
  name: string;
  logoUrl?: string | null;
  category?: string | null;
  ville?: string | null;
  gouvernorat?: string | null;
  horaires_ok?: string | null;
  telephone?: string | null;
  language: string;
  allKeywords?: string[];
  statut_carte?: string | null;
  description_ar?: string | null;
}

function renderStatutCarteBadge(statut_carte: string | null | undefined) {
  if (!statut_carte) return null;
  const isNonCertified = statut_carte === '⚠️ NON CERTIFIÉ';
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '9px',
      fontFamily: 'sans-serif',
      fontWeight: '600',
      letterSpacing: '0.03em',
      color: isNonCertified ? '#c2410c' : '#15803d',
      backgroundColor: isNonCertified ? 'rgba(234,88,12,0.08)' : 'rgba(22,163,74,0.08)',
      border: `1px solid ${isNonCertified ? 'rgba(234,88,12,0.3)' : 'rgba(22,163,74,0.3)'}`,
      borderRadius: '20px',
      padding: '1px 7px',
    }}>
      {statut_carte}
    </span>
  );
}

export default function GratuitCard({
  name,
  logoUrl,
  category,
  ville,
  gouvernorat,
  horaires_ok,
  telephone,
  language,
  allKeywords = [],
  statut_carte,
  description_ar,
}: GratuitCardProps) {
  console.log('statut_carte =', statut_carte, '| entreprise =', name);
  const [showPhone, setShowPhone] = useState(false);
  const locationLabel = ville || gouvernorat || '';
  const isOpen = isCurrentlyOpen(horaires_ok ?? null);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '2px solid #D4AF37',
        borderRadius: '16px',
        boxShadow: '0 0 10px rgba(212,175,55,0.18), 0 2px 8px rgba(0,0,0,0.06)',
        padding: '8px 10px',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center', flex: 1 }}>

        {/* Logo */}
        <div className="w-8 h-8" style={{ ...getLogoContainerStyle('#D4AF37', '2px'), flexShrink: 0 }}>
          <img
            src={getLogoUrl(logoUrl)}
            alt={`Logo ${name}${locationLabel ? ` à ${locationLabel}` : ''} - Annuaire établissements Tunisie`}
            className="w-full h-full"
            style={getLogoStyle(logoUrl)}
          />
        </div>

        {/* Nom */}
        <p style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', lineHeight: '1.3', margin: 0, letterSpacing: '-0.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', direction: /[\u0600-\u06FF]/.test(name) ? 'rtl' : 'ltr' }}>
          {name}
        </p>
        {renderStatutCarteBadge(statut_carte)}
        {description_ar && (
          <p style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.4', margin: 0, direction: 'rtl', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description_ar}
          </p>
        )}

        {allKeywords.length > 0 && <span className="sr-only">{allKeywords.join(' ')}</span>}

        {/* Statut ouvert/fermé */}
        {horaires_ok && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={11} style={{ color: isOpen ? '#10B981' : '#EF4444', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', fontWeight: '700', color: isOpen ? '#10B981' : '#EF4444' }}>
              {isOpen ? translateOpenStatus(language) : translateClosedStatus(language)}
            </span>
          </div>
        )}
      </div>

      {/* Téléphone + bouton "Voir les détails" épinglés en bas */}
      <div style={{ marginTop: 'auto', paddingTop: '6px', borderTop: '1px solid rgba(212,175,55,0.25)' }}>
        {telephone && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
            {showPhone && (
              <a
                href={`tel:${telephone}`}
                onClick={(e) => e.stopPropagation()}
                style={{ fontSize: '11px', fontWeight: '600', color: '#D4AF37', textDecoration: 'none', background: 'rgba(212,175,55,0.08)', borderRadius: '6px', padding: '2px 6px', border: '1px solid rgba(212,175,55,0.3)', marginRight: '6px' }}
              >
                {telephone}
              </a>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setShowPhone(!showPhone); }}
              style={{
                background: showPhone ? '#D4AF37' : 'rgba(212,175,55,0.1)',
                border: '1.5px solid #D4AF37',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                flexShrink: 0,
              }}
              title={showPhone ? 'Masquer le numéro' : 'Afficher le numéro'}
            >
              <Phone size={13} style={{ color: showPhone ? '#FFFFFF' : '#D4AF37' }} />
            </button>
          </div>
        )}
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#D4AF37', letterSpacing: '0.01em' }}>
          Voir les détails →
        </span>
      </div>
    </div>
  );
}
