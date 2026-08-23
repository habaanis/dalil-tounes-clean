import { Clock3, Phone } from 'lucide-react';
import { getCoverImageUrl } from '../lib/imagekitUtils';
import { getLogoUrl } from '../lib/logoUtils';
import { isCurrentlyOpen, formatTodayScheduleText, getTodaySchedule } from '../lib/horaireUtils';

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
}

const COPY: Record<string, {
  artisan: string;
  premium: string;
  certified: string;
  open: string;
  closed: string;
  details: string;
}> = {
  fr: { artisan: 'ARTISAN', premium: 'PREMIUM', certified: 'Certifié Dalil Tounes', open: 'Ouvert', closed: 'Fermé', details: 'Voir les détails' },
  ar: { artisan: 'حرفي', premium: 'PREMIUM', certified: 'موثّق من دليل تونس', open: 'مفتوح', closed: 'مغلق', details: 'عرض التفاصيل' },
  en: { artisan: 'ARTISAN', premium: 'PREMIUM', certified: 'Dalil Tounes Certified', open: 'Open', closed: 'Closed', details: 'View details' },
  it: { artisan: 'ARTISAN', premium: 'PREMIUM', certified: 'Certificato Dalil Tounes', open: 'Aperto', closed: 'Chiuso', details: 'Vedi dettagli' },
  ru: { artisan: 'ARTISAN', premium: 'PREMIUM', certified: 'Проверено Dalil Tounes', open: 'Открыто', closed: 'Закрыто', details: 'Подробнее' },
};

function isCertified(value: string | null | undefined): boolean {
  const normalized = String(value || '').toUpperCase();
  return normalized.includes('CERTIF') && !normalized.includes('NON CERTIF');
}

export default function BusinessSearchCardV2({
  business,
  tier,
  displayName,
  categoryLabel,
  language,
  onClick,
}: BusinessSearchCardV2Props) {
  const text = COPY[language] || COPY.fr;
  const isRTL = language === 'ar';
  const cover = getCoverImageUrl(business.imageUrl || business.logoUrl || undefined);
  const logo = getLogoUrl(business.logoUrl || business.imageUrl || undefined);
  const phone = business.telephone || business.phone || '';
  const openNow = business.horaires_ok ? isCurrentlyOpen(business.horaires_ok) : null;
  const today = business.horaires_ok
    ? formatTodayScheduleText(getTodaySchedule(business.horaires_ok), language)
    : '';

  return (
    <article
      className="group relative h-full cursor-pointer overflow-hidden rounded-[18px] border-2 border-[#D4AF37] bg-[linear-gradient(160deg,#07513D_0%,#05412F_55%,#032F26_100%)] text-white shadow-[0_10px_24px_rgba(0,39,30,0.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,39,30,0.28)]"
      onClick={onClick}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="relative h-[66px] overflow-hidden border-b border-[#D4AF37]/35">
        <img
          src={cover}
          alt={displayName}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#064332]/70 via-transparent to-black/5" />
        <span className="absolute left-3 top-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#E5B92F] drop-shadow-sm">
          {tier === 'premium' ? text.premium : text.artisan}
        </span>
      </div>

      <div className="relative px-3.5 pb-2.5 pt-0">
        <div className="-mt-5 mb-1 flex justify-center">
          <div className="flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full border-[3px] border-[#D4AF37] bg-white p-1 shadow-[0_4px_11px_rgba(0,0,0,0.25)]">
            <img src={logo} alt={`Logo ${displayName}`} className="h-full w-full object-contain" loading="lazy" decoding="async" />
          </div>
        </div>

        <h3 className="line-clamp-2 font-serif text-[16px] font-bold leading-[1.06] text-[#E9BD35]">
          {displayName}
        </h3>

        {isCertified(business.statut_carte) && (
          <div className="mt-1 inline-flex max-w-full items-center gap-1 rounded-full border border-[#D4AF37]/70 bg-[#064934]/90 px-2 py-0.5 shadow-[inset_0_0_6px_rgba(212,175,55,0.08)]">
            <span className="shrink-0 text-[9px] leading-none text-[#E5B92F]">★</span>
            <span className="truncate text-[7.5px] font-black uppercase tracking-[0.04em] text-white">
              {text.certified}
            </span>
          </div>
        )}

        {categoryLabel && (
          <p className="mt-1 line-clamp-1 text-[10px] font-semibold text-[#F0C642]">{categoryLabel}</p>
        )}

        {phone && (
          <div className="mt-1.5" onClick={(event) => event.stopPropagation()}>
            <a
              href={`tel:${phone}`}
              className="inline-flex min-h-7 max-w-full items-center justify-center gap-1.5 rounded-full border border-[#D4AF37]/55 bg-[#0A5A42]/80 px-2.5 text-[10px] font-bold text-[#E8BD34] transition hover:border-[#F1D36A]"
            >
              <Phone className="h-3 w-3" />
              <span className="truncate">{phone}</span>
            </a>
          </div>
        )}

        {business.horaires_ok && (
          <div className="mt-1.5 border-t border-[#D4AF37]/30 pt-1.5 text-[9px]">
            <div className="flex items-center gap-1.5">
              <Clock3 className={`h-3 w-3 shrink-0 ${openNow ? 'text-emerald-300' : 'text-red-400'}`} />
              <span className={`font-extrabold ${openNow ? 'text-emerald-300' : 'text-red-400'}`}>
                {openNow ? text.open : text.closed}
              </span>
            </div>
            {today && <p className="mt-0.5 line-clamp-1 text-emerald-50/80">{today}</p>}
          </div>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          className="mt-2 flex min-h-8 w-full items-center justify-start border-t border-[#D4AF37]/30 px-0 pt-1.5 text-left text-[11px] font-black text-[#E8BD34] transition hover:text-[#F5D76E] rtl:text-right"
        >
          {text.details} →
        </button>
      </div>
    </article>
  );
}
