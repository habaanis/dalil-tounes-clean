import { useState } from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import {
  getParsedSchedule,
  getDayName,
  isCurrentlyOpen,
  translateOpenStatus,
  translateClosedStatus,
  translateScheduleTitle,
} from '../lib/horaireUtils';
import { getLogoUrl, getLogoStyle, getLogoContainerStyle } from '../lib/logoUtils';
import { cleanArabicField } from '../lib/textNormalization';
import GoogleRatingSummary from './GoogleRatingSummary';

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
  showGoogleRating?: boolean;
  googleRating?: string | number | null;
  googleReviewCount?: string | number | null;
  detailView?: boolean;
}

const CARD_COPY: Record<string, { certified: string; nonCertified: string; details: string; showPhone: string; hidePhone: string; activity: string; city: string; phone: string }> = {
  fr: { certified: 'CERTIFIÉ', nonCertified: 'NON CERTIFIÉ', details: 'Voir les détails', showPhone: 'Afficher le numéro', hidePhone: 'Masquer le numéro', activity: 'Activité', city: 'Ville', phone: 'Téléphone' },
  ar: { certified: 'معتمد', nonCertified: 'غير معتمد', details: 'عرض التفاصيل', showPhone: 'عرض الرقم', hidePhone: 'إخفاء الرقم', activity: 'النشاط', city: 'المدينة', phone: 'الهاتف' },
  en: { certified: 'CERTIFIED', nonCertified: 'NON-CERTIFIED', details: 'View details', showPhone: 'Show phone number', hidePhone: 'Hide phone number', activity: 'Activity', city: 'City', phone: 'Phone' },
  it: { certified: 'CERTIFICATO', nonCertified: 'NON CERTIFICATO', details: 'Vedi i dettagli', showPhone: 'Mostra il numero', hidePhone: 'Nascondi il numero', activity: 'Attività', city: 'Città', phone: 'Telefono' },
  ru: { certified: 'СЕРТИФИЦИРОВАНО', nonCertified: 'НЕ СЕРТИФИЦИРОВАНО', details: 'Подробнее', showPhone: 'Показать номер', hidePhone: 'Скрыть номер', activity: 'Деятельность', city: 'Город', phone: 'Телефон' },
};

const SCHEDULE_DAY_INDEX: Record<string, number> = {
  lundi: 0,
  monday: 0,
  mardi: 1,
  tuesday: 1,
  mercredi: 2,
  wednesday: 2,
  jeudi: 3,
  thursday: 3,
  vendredi: 4,
  friday: 4,
  samedi: 5,
  saturday: 5,
  dimanche: 6,
  sunday: 6,
};

function localizeScheduleDay(day: string, language: string): string {
  const normalized = day.trim().toLowerCase();
  const index = SCHEDULE_DAY_INDEX[normalized];
  return index === undefined ? day : getDayName(index, language);
}

function renderStatutCarteBadge(statut_carte: string | null | undefined, language: string, localize: boolean) {
  if (!statut_carte) return null;
  const isNonCertified = statut_carte === '⚠️ NON CERTIFIÉ';
  const copy = CARD_COPY[language] || CARD_COPY.fr;
  const label = localize
    ? `${isNonCertified ? '⚠️ ' : '✓ '}${isNonCertified ? copy.nonCertified : copy.certified}`
    : statut_carte;
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
  category,
  ville,
  gouvernorat,
  horaires_ok,
  telephone,
  language,
  allKeywords = [],
  statut_carte,
  description_ar,
  showGoogleRating = false,
  googleRating,
  googleReviewCount,
  detailView = false,
}: GratuitCardProps) {
  const [showPhone, setShowPhone] = useState(false);
  const locationLabel = ville || gouvernorat || '';
  const isOpen = isCurrentlyOpen(horaires_ok ?? null);
  const cardCopy = CARD_COPY[language] || CARD_COPY.fr;
  const parsedSchedule = detailView && horaires_ok ? getParsedSchedule(horaires_ok).schedule : [];
  const rawScheduleParts = detailView && horaires_ok && parsedSchedule.length === 0
    ? horaires_ok.split(/\s*;\s*|\n+/).map(part => part.trim()).filter(Boolean)
    : [];

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
            alt={`Logo ${name}${locationLabel ? ` à ${locationLabel}` : ''} - Plateforme des établissements en Tunisie`}
            className="w-full h-full"
            style={getLogoStyle(logoUrl)}
            loading="lazy"
            decoding="async"
            width={32}
            height={32}
          />
        </div>

        {/* Nom */}
        <p style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', lineHeight: '1.3', margin: 0, letterSpacing: '-0.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', direction: /[\u0600-\u06FF]/.test(name) ? 'rtl' : 'ltr' }}>
          {name}
        </p>
        {renderStatutCarteBadge(statut_carte, language, showGoogleRating)}
        {showGoogleRating && (
          <GoogleRatingSummary
            rating={googleRating}
            reviewCount={googleReviewCount}
            language={language}
            className="text-[#4A1D43]"
          />
        )}
        {!detailView && description_ar && (
          <p style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.4', margin: 0, direction: 'rtl', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {cleanArabicField(description_ar)}
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

        {detailView && (
          <dl className="mt-3 w-full space-y-2 rounded-xl bg-[#FAFAF7] p-3 text-left rtl:text-right">
            {category && (
              <div className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-[#D4AF37]/15 text-center text-[10px] font-black leading-4 text-[#9A7410]" aria-hidden="true">•</span>
                <div className="min-w-0">
                  <dt className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#8A6A16]">{cardCopy.activity}</dt>
                  <dd className="break-words text-sm font-semibold text-[#2F2F2F]">{category}</dd>
                </div>
              </div>
            )}

            {locationLabel && (
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B8941F]" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#8A6A16]">{cardCopy.city}</dt>
                  <dd className="break-words text-sm font-semibold text-[#2F2F2F]">{locationLabel}</dd>
                </div>
              </div>
            )}

            {telephone && (
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#B8941F]" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#8A6A16]">{cardCopy.phone}</dt>
                  <dd>
                    <a href={`tel:${telephone}`} className="break-all text-sm font-bold text-[#4A1D43] underline decoration-[#D4AF37]/60 underline-offset-2">
                      {telephone}
                    </a>
                  </dd>
                </div>
              </div>
            )}

            {horaires_ok && (
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#B8941F]" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <dt className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#8A6A16]">{translateScheduleTitle(language)}</dt>
                  <dd className="mt-1 space-y-1 text-xs text-[#2F2F2F]">
                    {parsedSchedule.map(item => (
                      <div key={`${item.day}-${item.hours}`} className="flex items-start justify-between gap-3">
                        <span className="font-semibold">{localizeScheduleDay(item.day, language)}</span>
                        <span className="text-right rtl:text-left">{item.hours}</span>
                      </div>
                    ))}
                    {rawScheduleParts.map(part => (
                      <p key={part} className="leading-5">{part}</p>
                    ))}
                  </dd>
                </div>
              </div>
            )}
          </dl>
        )}
      </div>

      {/* Téléphone + bouton "Voir les détails" épinglés en bas */}
      {!detailView && (
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
                title={showPhone ? cardCopy.hidePhone : cardCopy.showPhone}
              >
                <Phone size={13} style={{ color: showPhone ? '#FFFFFF' : '#D4AF37' }} />
              </button>
            </div>
          )}
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#D4AF37', letterSpacing: '0.01em' }}>
            {cardCopy.details} →
          </span>
        </div>
      )}
    </div>
  );
}
