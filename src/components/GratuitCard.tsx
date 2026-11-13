import { isCertifiedBusiness, CERTIFIED_LABEL } from '../lib/businessCertification';
import { useState } from 'react';
import { Clock, Phone, ChevronDown } from 'lucide-react';
import { isCurrentlyOpen, translateOpenStatus, translateClosedStatus } from '../lib/horaireUtils';
import { cleanArabicField } from '../lib/textNormalization';
import GoogleRatingSummary from './GoogleRatingSummary';

interface GratuitCardProps {
  name: string;
  logoUrl?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  ville?: string | null;
  gouvernorat?: string | null;
  horaires_ok?: string | null;
  telephone?: string | null;
  language: string;
  allKeywords?: string[];
  statut_carte?: string | null;
  cv_business_status?: string | null;
  description_ar?: string | null;
  showGoogleRating?: boolean;
  showDetailsLink?: boolean;
  googleRating?: string | number | null;
  googleReviewCount?: string | number | null;
}

const CARD_COPY: Record<string, { certified: string; nonCertified: string; details: string; showPhone: string; hidePhone: string }> = {
  fr: { certified: 'Certifiée Dalil Tounes', nonCertified: 'NON CERTIFIÉ', details: 'Voir les détails', showPhone: 'Afficher le numéro', hidePhone: 'Masquer le numéro' },
  ar: { certified: 'معتمد', nonCertified: 'غير معتمد', details: 'عرض التفاصيل', showPhone: 'عرض الرقم', hidePhone: 'إخفاء الرقم' },
  en: { certified: 'CERTIFIED', nonCertified: 'NON-CERTIFIED', details: 'View details', showPhone: 'Show phone number', hidePhone: 'Hide phone number' },
  it: { certified: 'CERTIFICATO', nonCertified: 'NON CERTIFICATO', details: 'Vedi i dettagli', showPhone: 'Mostra il numero', hidePhone: 'Nascondi il numero' },
  ru: { certified: 'СЕРТИФИЦИРОВАНО', nonCertified: 'НЕ СЕРТИФИЦИРОВАНО', details: 'Подробнее', showPhone: 'Показать номер', hidePhone: 'Скрыть номер' },
};

function renderStatutCarteBadge(statut_carte: string | null | undefined, language: string, localize: boolean) {
  // Receives only the label derived from current CV publication.
  const normalized = String(statut_carte || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
  const isCertified = /CERTIFIEE? DALIL TOUNES/.test(normalized) && !normalized.includes('NON CERTIFIE');
  const isNonCertified = normalized.includes('NON CERTIFIE');
  if (!isCertified && !isNonCertified) return null;
  const copy = CARD_COPY[language] || CARD_COPY.fr;
  const label = localize
    ? `${isCertified ? '⭐ ' : '⚠️ '}${isCertified ? copy.certified : copy.nonCertified}`
    : isCertified ? 'Certifiée Dalil Tounes' : '⚠️ NON CERTIFIÉ';
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
      {label}
    </span>
  );
}

export default function GratuitCard({
  name,
  logoUrl,
  imageUrl,
  category,
  ville,
  gouvernorat,
  horaires_ok,
  telephone,
  language,
  allKeywords = [],
  cv_business_status,
  description_ar,
  showGoogleRating = true,
  showDetailsLink = false,
  googleRating,
  googleReviewCount,
}: GratuitCardProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const locationLabel = ville || gouvernorat || '';
  const isOpen = isCurrentlyOpen(horaires_ok ?? null);
  const cardCopy = CARD_COPY[language] || CARD_COPY.fr;
  const missingCopy: Record<string, { phone: string; hours: string }> = {
    fr: { phone: 'Téléphone : non renseigné', hours: 'Horaires : non renseignés' },
    ar: { phone: 'الهاتف: غير متوفر', hours: 'ساعات العمل: غير متوفرة' },
    en: { phone: 'Phone: not provided', hours: 'Hours: not provided' },
    it: { phone: 'Telefono: non indicato', hours: 'Orari: non indicati' },
    ru: { phone: 'Телефон: не указан', hours: 'Часы работы: не указаны' },
  };
  const missing = missingCopy[language] || missingCopy.fr;


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

        {/* Nom */}
        <p style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', lineHeight: '1.3', margin: 0, letterSpacing: '-0.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', direction: /[\u0600-\u06FF]/.test(name) ? 'rtl' : 'ltr' }}>
          {name}
        </p>
        {category && <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>{category}</p>}
        {locationLabel && <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>{locationLabel}</p>}
        {renderStatutCarteBadge(isCertifiedBusiness({ cv_business_status }) ? CERTIFIED_LABEL : null, language, showGoogleRating)}
        {showGoogleRating && (
          <GoogleRatingSummary
            rating={googleRating}
            reviewCount={googleReviewCount}
            language={language}
            className="text-[#4A1D43]"
          />
        )}
        {description_ar && (
          <p style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.4', margin: 0, direction: 'rtl', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {cleanArabicField(description_ar)}
          </p>
        )}

        {allKeywords.length > 0 && <span className="sr-only">{allKeywords.join(' ')}</span>}

        {/* Les horaires ne s'affichent qu'au clic pour garder une carte compacte. */}
        {horaires_ok && (
          <div style={{ width: '100%', marginTop: '10px' }}>
            <button
              type="button"
              aria-expanded={showHours}
              onClick={(e) => { e.stopPropagation(); setShowHours((previous) => !previous); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 14px', background: '#FAF8F3', border: '1px solid #E7D9B4', borderRadius: '10px', color: '#4A1D43', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}
            >
              <Clock size={15} aria-hidden="true" />
              {language === 'ar' ? (showHours ? 'إخفاء ساعات العمل' : 'عرض ساعات العمل') : language === 'en' ? (showHours ? 'Hide hours' : 'View opening hours') : language === 'it' ? (showHours ? 'Nascondi orari' : 'Vedi orari') : language === 'ru' ? (showHours ? 'Скрыть часы работы' : 'Часы работы') : (showHours ? 'Masquer les horaires' : 'Voir les horaires')}
              <ChevronDown size={15} aria-hidden="true" style={{ transform: showHours ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
            </button>
            {showHours && (
              <div style={{ marginTop: '8px', padding: '12px', background: '#FFFFFF', border: '1px solid #E7D9B4', borderRadius: '10px', textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
                <p style={{ fontSize: '12px', lineHeight: '1.7', color: '#334155', whiteSpace: 'pre-line', margin: 0 }}>{horaires_ok}</p>
              </div>
            )}
          </div>
        )}
        {!horaires_ok?.trim() && (
          <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '8px' }}>
            <Clock size={13} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />{missing.hours}
          </p>
        )}
      </div>

      {/* Téléphone sous les horaires : une action claire et accessible. */}
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(212,175,55,0.25)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {telephone && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowPhone((previous) => !previous); }}
              aria-expanded={showPhone}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 14px', background: '#B62226', border: '1px solid #B62226', borderRadius: '10px', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              <Phone size={15} aria-hidden="true" />
              {showPhone ? cardCopy.hidePhone : cardCopy.showPhone}
            </button>
            {showPhone && (
              <a href={`tel:${telephone.replace(/[^+\\d]/g, '')}`} onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', padding: '8px', fontSize: '14px', fontWeight: 700, color: '#B62226', textDecoration: 'underline', borderRadius: '8px', background: '#FAF8F3' }}>
                {telephone}
              </a>
            )}
          </div>
        )}
        {!telephone?.trim() && (
          <span style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>
            <Phone size={13} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
            {missing.phone}
          </span>
        )}
        {showDetailsLink && (
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#AD8B22', letterSpacing: '0.01em', textAlign: 'center' }}>
            {cardCopy.details} →
          </span>
        )}
      </div>
    </div>
  );
}
