import { isCertifiedBusiness } from '../lib/businessCertification';
import { getCvPaletteTheme } from '../lib/cvPalette';
import { Clock3, Phone } from 'lucide-react';
import { getCoverImageUrl } from '../lib/imagekitUtils';
import { getLogoUrl } from '../lib/logoUtils';
import { isCurrentlyOpen, formatTodayScheduleText, getTodaySchedule } from '../lib/horaireUtils';
import GoogleRatingSummary from './GoogleRatingSummary';
import { getCategoryIllustration, isRealBusinessPhoto, isWikimediaIllustration, getWikimediaCreditUrl } from '../lib/categoryIllustrations';

interface BusinessSearchCardV2Props {
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
    imageUrl?: string | null;
    logoUrl?: string | null;
    horaires_ok?: string | null;
    note_google?: string | number | null;
    'Note Google Globale'?: string | number | null;
    nombre_avis?: string | number | null;
    'Compteur Avis Google'?: string | number | null;
    statut_carte?: string | null;
    cv_business_status?: string | null;
    google_url?: string | null;
    'BTN_Maps'?: string | null;
    latitude?: number | string | null;
    longitude?: number | string | null;
  };
  tier: 'artisan' | 'premium';
  displayName: string;
  displayDescription?: string | null;
  categoryLabel?: string;
  language: string;
  onClick: () => void;
  showGoogleRating?: boolean;
  compact?: boolean;
}

const COPY: Record<string, {
  artisan: string;
  premium: string;
  certified: string;
  open: string;
  closed: string;
  details: string;
}> = {
  fr: { artisan: 'ARTISAN', premium: 'PREMIUM', certified: 'Certifiée Dalil Tounes', open: 'Ouvert', closed: 'Fermé', details: 'Voir les détails' },
  ar: { artisan: 'حرفي', premium: 'PREMIUM', certified: 'موثّق من دليل تونس', open: 'مفتوح', closed: 'مغلق', details: 'عرض التفاصيل' },
  en: { artisan: 'ARTISAN', premium: 'PREMIUM', certified: 'Dalil Tounes Certified', open: 'Open', closed: 'Closed', details: 'View details' },
  it: { artisan: 'ARTISAN', premium: 'PREMIUM', certified: 'Certificato Dalil Tounes', open: 'Aperto', closed: 'Chiuso', details: 'Vedi dettagli' },
  ru: { artisan: 'ARTISAN', premium: 'PREMIUM', certified: 'Проверено Dalil Tounes', open: 'Открыто', closed: 'Закрыто', details: 'Подробнее' },
};



export default function BusinessSearchCardV2({
  business,
  tier,
  displayName,
  categoryLabel,
  language,
  onClick,
  showGoogleRating = true,
  compact = false,
}: BusinessSearchCardV2Props) {
  const text = COPY[language] || COPY.fr;
  const isRTL = language === 'ar';
  const illustration = getCategoryIllustration(
    [business.category, business.categorie, categoryLabel].filter(Boolean).join(' '),
    business.name || displayName,
  );
  const hasRealCover = isRealBusinessPhoto(business.imageUrl);
  const existingIllustration = isWikimediaIllustration(business.imageUrl);
  // Les illustrations déjà enregistrées dans Supabase priment sur la bibliothèque métier.
  const cover = hasRealCover || existingIllustration ? getCoverImageUrl(business.imageUrl) :
    illustration?.url || getCoverImageUrl(business.logoUrl);
  const illustrationSource = existingIllustration
    ? getWikimediaCreditUrl(business.imageUrl)
    : illustration?.source;
  const logo = getLogoUrl(business.logoUrl);
  const phone = business.telephone || business.phone || '';
  const todaySchedule = business.horaires_ok ? getTodaySchedule(business.horaires_ok) : null;
  const unconfirmedHours = /à confirmer|a confirmer|indicatif|annuaire|non communiqué|non renseigne|non renseigné/i.test(business.horaires_ok || '');
  // Une description libre ne doit jamais être interprétée comme « Fermé ».
  const canShowLiveStatus = Boolean(todaySchedule && !unconfirmedHours &&
    (/(\d{1,2}(?:[.:h]\d{2})?)\s*(?:[-–—>àa]|to)\s*(\d{1,2}(?:[.:h]\d{2})?)/i.test(todaySchedule.hours) ||
      /fermé|closed|مغلق/i.test(todaySchedule.hours)));
  const openNow = canShowLiveStatus ? isCurrentlyOpen(business.horaires_ok) : null;
  const today = todaySchedule ? formatTodayScheduleText(todaySchedule, language) : '';
  const missingPhone: Record<string, string> = {
    fr: 'Téléphone non renseigné', ar: 'الهاتف غير متوفر', en: 'Phone not provided',
    it: 'Telefono non indicato', ru: 'Телефон не указан',
  };
  // Select the existing Airtable legacy label and the existing Ivoire & Or theme.
  // Presentation only: no palette/status edits, no new certification.
  const legacyIvory = business.statut_carte === '⭐ CERTIFIÉ DALIL TOUNES';
  const ivory = getCvPaletteTheme('Ivoire & Or');


  return (
    <article
      className={`group relative cursor-pointer overflow-hidden rounded-[18px] border-2 border-[#D4AF37] bg-[linear-gradient(160deg,#07513D_0%,#05412F_55%,#032F26_100%)] text-white shadow-[0_10px_24px_rgba(0,39,30,0.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,39,30,0.28)] ${legacyIvory ? "bg-[#FFF8E7] text-[#3B3126] legacy-ivory-card" : ""} ${compact ? "h-auto" : "h-full"}`}
      style={legacyIvory ? { background: ivory.surface, color: ivory.text, borderColor: ivory.border } : undefined}
      onClick={onClick}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {legacyIvory && <style>{`
        .legacy-ivory-card h3 { color: ${ivory.text}; }
        .legacy-ivory-card p { color: ${ivory.text}; }
        .legacy-ivory-card button { color: ${ivory.text}; }
        .legacy-ivory-card a[href^="tel:"] { background: ${ivory.surfaceAlt}; color: ${ivory.text}; border-color: ${ivory.border}; }
        .legacy-ivory-card [class*="border-t"] { border-color: ${ivory.border}; }
        .legacy-ivory-card [class*="text-emerald"] { color: ${ivory.muted}; }
        .legacy-ivory-card [class*="bg-[#064934]"] { background: ${ivory.surfaceAlt}; }
        .legacy-ivory-card [class*="text-white"] { color: ${ivory.text}; }
      `}</style>}
      {compact ? (
        // In the mobile directory, show ONE visual, never a logo over a short photo.
        // A real establishment photo wins; otherwise the existing logo stands alone.
        <div className={`relative overflow-hidden border-b border-[#D4AF37]/35 ${hasRealCover ? "h-[104px]" : "h-[90px]"}`}>
          {hasRealCover ? (
            <>
              <img src={cover} alt={displayName}
                className="h-full w-full object-cover object-center" loading="lazy" decoding="async"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/images/placeholder.jpg';
                }} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
            </>
          ) : (
            <div className={`flex h-full w-full items-center justify-center ${legacyIvory ? "bg-[#FFF8E7]" : "bg-[#064332]"}`}>
              <img src={logo} alt={`Logo ${displayName}`}
                className="h-[74px] max-w-[68%] object-contain" loading="lazy" decoding="async" />
            </div>
          )}
          <span className={`absolute top-2 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-[#F1C65E] ${isRTL ? "right-2" : "left-2"}`}>
            {tier === 'premium' ? text.premium : text.artisan}
          </span>
        </div>
      ) : (
        <div className="relative h-[58px] overflow-hidden border-b border-[#D4AF37]/35">
          <img src={cover}
            alt={hasRealCover ? displayName : existingIllustration ? 'Illustration du métier' : illustration?.label || displayName}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]"
            loading="lazy" decoding="async"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = '/images/placeholder.jpg';
            }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#064332]/70 via-transparent to-black/5" />
          {!hasRealCover && illustrationSource && (
            <a href={illustrationSource} target="_blank" rel="noopener noreferrer"
              title={existingIllustration ? 'Image illustrative Wikimedia Commons' : `Illustration du métier — ${illustration?.author}, ${illustration?.licence}`}
              onClick={(event) => event.stopPropagation()}
              className="absolute bottom-0 right-1 rounded-t bg-black/60 px-1.5 py-0.5 text-[8px] text-white/90 underline">
              {language === 'ar' ? 'صورة توضيحية' : language === 'en' ? 'Illustration' : 'Illustration du métier'}
            </a>
          )}
          <span className={`absolute top-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-[#E5B92F] drop-shadow-sm ${isRTL ? 'right-3' : 'left-3'}`}>
            {tier === 'premium' ? text.premium : text.artisan}
          </span>
        </div>
      )}

      <div className={`relative ${compact ? "px-3 pb-2 pt-2" : "px-3 pb-2 pt-0"}`}>
        {!compact && (
          <div className="-mt-[18px] mb-0.5 flex justify-center">
            <div className="flex h-[46px] w-[46px] items-center justify-center overflow-hidden rounded-full border-[3px] border-[#D4AF37] bg-white p-1 shadow-[0_4px_10px_rgba(0,0,0,0.24)]">
              <img src={logo} alt={`Logo ${displayName}`} className="h-full w-full object-contain" loading="lazy" decoding="async" />
            </div>
          </div>
        )}

        <h3 className={`line-clamp-2 font-serif font-bold text-[#E9BD35] ${compact ? "text-[13px] leading-[1.12]" : "text-[15px] leading-[1.03]"}`}>
          {displayName}
        </h3>

        {isCertifiedBusiness(business) && (
          <div className="mt-0.5 inline-flex max-w-full items-center gap-1 rounded-full border border-[#D4AF37]/70 bg-[#064934]/90 px-2 py-0.5 shadow-[inset_0_0_6px_rgba(212,175,55,0.08)]">
            <span className="shrink-0 text-[8px] leading-none text-[#E5B92F]">★</span>
            <span className="truncate text-[7px] font-black uppercase tracking-[0.04em] text-white">
              {text.certified}
            </span>
          </div>
        )}

        {categoryLabel && (
          <p className="mt-0.5 line-clamp-1 text-[9.5px] font-semibold text-[#F0C642]">{categoryLabel}</p>
        )}

        {showGoogleRating && (
          <GoogleRatingSummary
            rating={business['Note Google Globale'] ?? business.note_google}
            reviewCount={business['Compteur Avis Google'] ?? business.nombre_avis}
            language={language}
            className="mt-1 text-white"
            showTrustLabel={!compact}
          />
        )}

        {phone && (
          <div className="mt-1" onClick={(event) => event.stopPropagation()}>
            <a
              href={`tel:${phone}`}
              className="inline-flex min-h-6 max-w-full items-center justify-center gap-1 rounded-full border border-[#D4AF37]/55 bg-[#0A5A42]/80 px-2 text-[9px] font-bold text-[#E8BD34] transition hover:border-[#F1D36A]"
            >
              <Phone className="h-2.5 w-2.5" />
              <span className="truncate">{phone}</span>
            </a>
          </div>
        )}

        {!phone.trim() && (
          <p className="mt-1 flex items-center gap-1 text-[9px] text-emerald-50/70">
            <Phone className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
            {missingPhone[language] || missingPhone.fr}
          </p>
        )}

        {!compact && (
          <div>
            {business.horaires_ok && (
              <div className="mt-1 border-t border-[#D4AF37]/30 pt-1 text-[8px]">
                <div className="flex items-center gap-1">
                  <Clock3 className={`h-2.5 w-2.5 shrink-0 ${openNow === null ? 'text-emerald-50/70' : openNow ? 'text-emerald-300' : 'text-red-400'}`} />
                  <span className={`font-extrabold ${openNow === null ? 'text-emerald-50/80' : openNow ? 'text-emerald-300' : 'text-red-400'}`}>
                        {openNow === null ? (language === 'ar' ? 'أوقات العمل بحاجة للتأكيد' : language === 'en' ? 'Hours to confirm' : language === 'it' ? 'Orari da confermare' : language === 'ru' ? 'Часы уточняются' : 'Horaires à confirmer') : openNow ? text.open : text.closed}
                  </span>
                </div>
                {today && <p className="mt-0.5 line-clamp-1 text-emerald-50/80">{today}</p>}
              </div>
            )}

            {!business.horaires_ok?.trim() && (
              <p className="mt-1 flex items-center gap-1 border-t border-[#D4AF37]/30 pt-1 text-[9px] text-emerald-50/70">
                <Clock3 className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                {language === 'fr' ? 'Horaires non renseignés' : language === 'ar' ? 'ساعات العمل غير متوفرة' : language === 'en' ? 'Hours not provided' : language === 'it' ? 'Orari non indicati' : 'Часы работы не указаны'}
              </p>
            )}

          </div>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          className={`flex min-h-7 w-full items-center justify-start border-t border-[#D4AF37]/30 px-0 pt-1 text-left text-[10px] font-black text-[#E8BD34] transition hover:text-[#F5D76E] rtl:text-right ${compact ? "mt-0.5" : "mt-1.5"}`}
        >
          {text.details} →
        </button>
      </div>
    </article>
  );
}
