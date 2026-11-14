import { isCertifiedBusiness, CERTIFIED_LABEL } from '../lib/businessCertification';
import { isPlatformAppMode } from '../lib/platformAppMode';
import { useState } from 'react';
import { Clock, Phone, ChevronDown } from 'lucide-react';
import { isCurrentlyOpen, translateOpenStatus, translateClosedStatus } from '../lib/horaireUtils';
import { cleanArabicField } from '../lib/textNormalization';
import GoogleRatingSummary from './GoogleRatingSummary';
import { getCoverImageUrl } from '../lib/imagekitUtils';
import { getCategoryIllustration, isRealBusinessPhoto, isWikimediaIllustration, getWikimediaCreditUrl } from '../lib/categoryIllustrations';

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
  onOpen?: () => void;
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
  showDetailsLink = true,
  onOpen,
  googleRating,
  googleReviewCount,
}: GratuitCardProps) {
  const inPlatformApp = isPlatformAppMode();
  const [showPhone, setShowPhone] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const locationLabel = ville || gouvernorat || '';
  const isOpen = isCurrentlyOpen(horaires_ok ?? null);
  const cardCopy = CARD_COPY[language] || CARD_COPY.fr;
  const illustration = getCategoryIllustration(category, name);
  const realPhoto = isRealBusinessPhoto(imageUrl);
  const existingIllustration = isWikimediaIllustration(imageUrl);
  const cover = realPhoto || existingIllustration ? getCoverImageUrl(imageUrl) : illustration?.url;
  const illustrationSource = existingIllustration ? getWikimediaCreditUrl(imageUrl) : illustration?.source;
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
        padding: inPlatformApp ? '6px 9px' : '8px 10px',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {!inPlatformApp && cover && (
        <div style={{ height: '66px', flexShrink: 0, position: 'relative', marginBottom: '8px', overflow: 'hidden', borderRadius: '10px', background: '#F2F0EA' }}>
          <img
            src={cover}
            alt={realPhoto ? name : existingIllustration ? 'Illustration du métier' : illustration?.label || name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/placeholder.jpg'; }}
          />
          {!realPhoto && illustrationSource && (
            <a
              href={illustrationSource}
              target="_blank"
              rel="noopener noreferrer"
              onClick={event => event.stopPropagation()}
              title={existingIllustration ? 'Illustration Wikimedia Commons' : (illustration?.author || '') + ' · ' + (illustration?.licence || '')}
              style={{ position: 'absolute', bottom: 0, right: 0, padding: '2px 6px', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '9px' }}
            >{language === 'ar' ? 'صورة توضيحية' : language === 'en' ? 'Illustration' : 'Illustration du métier'}</a>
          )}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: inPlatformApp ? '2px' : '4px', textAlign: 'center', flex: 1 }}>

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
            className={inPlatformApp ? 'text-[#292725]' : 'text-[#4A1D43]'}
            compactTrustLabel={inPlatformApp}
          />
        )}
        {description_ar && (
          <p style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.4', margin: 0, direction: 'rtl', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {cleanArabicField(description_ar)}
          </p>
        )}

        {allKeywords.length > 0 && <span className="sr-only">{allKeywords.join(' ')}</span>}

        {/* Les horaires ne s'affichent qu'au clic pour garder une carte compacte. */}
        {!inPlatformApp && horaires_ok && (
          <div style={{ width: inPlatformApp ? '100%' : '100%', marginTop: inPlatformApp ? '6px' : '10px' }}>
            <button
              type="button"
              aria-expanded={showHours}
              onClick={(e) => { e.stopPropagation(); setShowHours((previous) => !previous); }}
              style={{ width: inPlatformApp ? 'min(100%, 225px)' : '100%', margin: inPlatformApp ? '0 auto' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: inPlatformApp ? '5px' : '8px', padding: inPlatformApp ? '5px 10px' : '10px 14px', minHeight: inPlatformApp ? '34px' : undefined, background: '#FAF8F3', border: '1px solid #E7D9B4', borderRadius: '10px', color: inPlatformApp ? '#292725' : '#4A1D43', cursor: 'pointer', fontWeight: inPlatformApp ? 600 : 700, fontSize: '12px' }}
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
        {!inPlatformApp && !horaires_ok?.trim() && (
          <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '8px' }}>
            <Clock size={13} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />{missing.hours}
          </p>
        )}
      </div>

      {inPlatformApp && (
        <div className="mt-2 border-t border-[#C9A65D]/35 pt-2">
          <div className="grid grid-cols-2 gap-2">
            {horaires_ok?.trim() ? (
              <button
                type="button"
                aria-expanded={showHours}
                onClick={(e) => { e.stopPropagation(); setShowHours(previous => !previous); }}
                className="flex min-h-10 min-w-0 items-center justify-center gap-1 rounded-lg border border-[#C9A65D] bg-[#FFF9EC] px-2 py-1.5 text-[11px] font-semibold text-[#292725]"
              >
                <Clock size={14} className="shrink-0" aria-hidden="true" />
                <span>{language === 'ar' ? 'الأوقات' : language === 'en' ? 'Hours' : language === 'it' ? 'Orari' : language === 'ru' ? 'Часы' : 'Horaires'}</span>
                <ChevronDown size={12} className="shrink-0" aria-hidden="true" style={{ transform: showHours ? 'rotate(180deg)' : undefined }} />
              </button>
            ) : (
              <span className="flex min-h-10 items-center justify-center text-center text-[10px] text-gray-500">{missing.hours}</span>
            )}
            {telephone?.trim() ? (
              <button
                type="button"
                aria-expanded={showPhone}
                onClick={(e) => { e.stopPropagation(); setShowPhone(previous => !previous); }}
                className="flex min-h-10 min-w-0 items-center justify-center gap-1 rounded-lg border border-[#B62226] bg-[#B62226] px-2 py-1.5 text-[11px] font-semibold text-white"
              >
                <Phone size={14} className="shrink-0" aria-hidden="true" />
                <span>{language === 'ar' ? 'الهاتف' : language === 'en' ? 'Phone' : language === 'it' ? 'Telefono' : language === 'ru' ? 'Телефон' : 'Téléphone'}</span>
              </button>
            ) : (
              <span className="flex min-h-10 items-center justify-center text-center text-[10px] text-gray-500">{missing.phone}</span>
            )}
          </div>
          {showHours && horaires_ok && (
            <div className="mt-2 rounded-lg border border-[#C9A65D]/60 bg-[#FCFAF5] p-2 text-left text-xs text-[#292725]" onClick={(e) => e.stopPropagation()}>
              <p className="whitespace-pre-line">{horaires_ok}</p>
            </div>
          )}
          {showPhone && telephone && (
            <a href={`tel:${telephone.replace(/[^+\\d]/g, '')}`} onClick={(e) => e.stopPropagation()} className="mt-2 block rounded-lg bg-[#FCFAF5] p-2 text-center text-sm font-semibold text-[#292725] underline">{telephone}</a>
          )}
        </div>
      )}

      {/* Téléphone sous les horaires : une action claire et accessible. */}
      {!inPlatformApp && <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(212,175,55,0.25)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {telephone && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowPhone((previous) => !previous); }}
              aria-expanded={showPhone}
              style={{ width: inPlatformApp ? 'min(100%, 225px)' : '100%', margin: inPlatformApp ? '0 auto' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: inPlatformApp ? '5px' : '8px', padding: inPlatformApp ? '5px 10px' : '10px 14px', minHeight: inPlatformApp ? '34px' : undefined, background: inPlatformApp ? '#B62226' : '#4A1D43', border: inPlatformApp ? '1px solid #B62226' : '1px solid #4A1D43', borderRadius: '10px', color: '#FFFFFF', fontSize: '12px', fontWeight: inPlatformApp ? 600 : 700, cursor: 'pointer' }}
            >
              <Phone size={15} aria-hidden="true" />
              {showPhone ? cardCopy.hidePhone : cardCopy.showPhone}
            </button>
            {showPhone && (
              <a href={`tel:${telephone.replace(/[^+\\d]/g, '')}`} onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', padding: '8px', fontSize: '14px', fontWeight: 700, color: inPlatformApp ? '#292725' : '#4A1D43', textDecoration: 'underline', borderRadius: '8px', background: '#FAF8F3' }}>
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
        {!inPlatformApp && onOpen ? (
          <button
            type="button"
            onClick={onOpen}
            className={inPlatformApp ? "mx-auto block min-h-[34px] w-full max-w-[225px] rounded-lg border border-[#C9A65D] bg-[#FFF9EC] px-2.5 py-1 text-xs font-semibold text-[#292725] hover:bg-[#F8EDCF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A17D36]" : "min-h-11 w-full rounded-lg border border-[#D4AF37]/60 bg-[#FFF9EC] px-3 py-2 text-sm font-semibold text-[#4A1D43] hover:bg-[#F8EDCF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A17D36]"}
          >
            {cardCopy.details} →
          </button>
        ) : !inPlatformApp && showDetailsLink && (
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#AD8B22', letterSpacing: '0.01em', textAlign: 'center' }}>
            {cardCopy.details} →
          </span>
        )}
      </div>}
    </div>
  );
}
