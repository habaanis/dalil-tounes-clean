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
}

function renderStatutCarteBadge(statut_carte: string | null | undefined) {
  if (!statut_carte) return null;
  const upper = statut_carte.toUpperCase();
  const isCertified = upper.includes('CERTIFIÉ') && !upper.includes('NON');
  const isNonCertified = upper.includes('NON CERTIFIÉ');
  if (!isCertified && !isNonCertified) return null;
  return (
    <span style={{
      display: 'inline-block', fontSize: '10px', fontFamily: 'sans-serif', fontWeight: '600',
      color: '#fff', backgroundColor: isCertified ? '#16a34a' : '#ea580c',
      borderRadius: '4px', padding: '1px 6px'
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
}: GratuitCardProps) {
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
        padding: '14px 12px',
        maxWidth: '280px',
        width: '100%',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' }}>

        {/* Logo */}
        <div className="w-12 h-12" style={getLogoContainerStyle('#D4AF37', '2px')}>
          <img
            src={getLogoUrl(logoUrl)}
            alt={`Logo ${name}${locationLabel ? ` à ${locationLabel}` : ''} - Annuaire établissements Tunisie`}
            className="w-full h-full"
            style={getLogoStyle(logoUrl)}
          />
        </div>

        {/* Nom */}
        <p style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', lineHeight: '1.3', margin: 0, letterSpacing: '-0.01em' }}>
          {name}
        </p>
        {renderStatutCarteBadge(statut_carte)}

        {/* Catégorie */}
        {category && (
          <>
            <p style={{ fontSize: '11px', fontWeight: '500', color: '#6B7280', margin: 0, maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {category}
            </p>
            {allKeywords.length > 0 && <span className="sr-only">{allKeywords.join(' ')}</span>}
          </>
        )}

        {/* Ville */}
        {locationLabel && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={11} style={{ color: '#6B7280', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', fontWeight: '500', color: '#374151' }}>{locationLabel}</span>
          </div>
        )}

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

      {/* Icône téléphone en bas à droite */}
      {telephone && (
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          {showPhone && (
            <a
              href={`tel:${telephone}`}
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: '11px', fontWeight: '600', color: '#D4AF37', textDecoration: 'none', background: 'rgba(212,175,55,0.08)', borderRadius: '6px', padding: '2px 6px', border: '1px solid rgba(212,175,55,0.3)' }}
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
            }}
            title={showPhone ? 'Masquer le numéro' : 'Afficher le numéro'}
          >
            <Phone size={13} style={{ color: showPhone ? '#FFFFFF' : '#D4AF37' }} />
          </button>
        </div>
      )}
    </div>
  );
}
