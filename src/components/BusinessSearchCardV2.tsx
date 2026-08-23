import { Clock3, MapPin, Navigation, Phone, Star } from 'lucide-react';
import { getCoverImageUrl } from '../lib/imagekitUtils';
import { getLogoUrl } from '../lib/logoUtils';
import { normalizeMapsUrl } from './BusinessDetail';
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
  call: string;
  gps: string;
  details: string;
}> = {
  fr: {
    artisan: 'Vitrine Business Artisan',
    premium: 'CV Business Premium',
    certified: 'Certifié Dalil Tounes',
    open: 'Ouvert',
    closed: 'Fermé',
    call: 'Appeler',
    gps: 'GPS',
    details: 'Voir le CV Business',
  },
  ar: {
    artisan: 'واجهة نشاط حرفي',
    premium: 'السيرة المهنية Premium',
    certified: 'موثّق من دليل تونس',
    open: 'مفتوح',
    closed: 'مغلق',
    call: 'اتصال',
    gps: 'GPS',
    details: 'عرض السيرة المهنية',
  },
  en: {
    artisan: 'Artisan Business Showcase',
    premium: 'Premium Business CV',
    certified: 'Dalil Tounes Certified',
    open: 'Open',
    closed: 'Closed',
    call: 'Call',
    gps: 'GPS',
    details: 'View Business CV',
  },
  it: {
    artisan: 'Vetrina Business Artisan',
    premium: 'CV Business Premium',
    certified: 'Certificato Dalil Tounes',
    open: 'Aperto',
    closed: 'Chiuso',
    call: 'Chiama',
    gps: 'GPS',
    details: 'Vedi CV Business',
  },
  ru: {
    artisan: 'Витрина Business Artisan',
    premium: 'CV Business Premium',
    certified: 'Проверено Dalil Tounes',
    open: 'Открыто',
    closed: 'Закрыто',
    call: 'Позвонить',
    gps: 'GPS',
    details: 'Открыть CV Business',
  },
};

function numberValue(value: unknown): number {
  const number = Number(String(value ?? '').replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(number) ? number : 0;
}

function isCertified(value: string | null | undefined): boolean {
  const normalized = String(value || '').toUpperCase();
  return normalized.includes('CERTIF') && !normalized.includes('NON CERTIF');
}

export default function BusinessSearchCardV2({
  business,
  tier,
  displayName,
  displayDescription,
  categoryLabel,
  language,
  onClick,
}: BusinessSearchCardV2Props) {
  const text = COPY[language] || COPY.fr;
  const isRTL = language === 'ar';
  const cover = getCoverImageUrl(business.imageUrl || business.logoUrl || undefined);
  const logo = getLogoUrl(business.logoUrl || business.imageUrl || undefined);
  const rating = numberValue(business.note_google || business['Note Google Globale']);
  const reviews = Math.floor(numberValue(business.nombre_avis || business['Compteur Avis Google']));
  const phone = business.telephone || business.phone || '';
  const mapsUrl = normalizeMapsUrl(
    [business['BTN_Maps'], business.google_url],
    business.latitude,
    business.longitude,
    business.adresse,
    business.ville,
    business.gouvernorat,
  );
  const openNow = business.horaires_ok ? isCurrentlyOpen(business.horaires_ok) : null;
  const today = business.horaires_ok
    ? formatTodayScheduleText(getTodaySchedule(business.horaires_ok), language)
    : '';

  const location = [business.ville, business.gouvernorat]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(', ');

  return (
    <article
      className="group relative h-full cursor-pointer overflow-hidden rounded-[22px] border-2 border-[#D4AF37] bg-[radial-gradient(circle_at_50%_3%,rgba(20,111,77,0.32),transparent_28%),linear-gradient(145deg,#031D18_0%,#04382D_52%,#011914_100%)] text-white shadow-[0_18px_38px_rgba(0,39,30,0.30),0_0_10px_rgba(212,175,55,0.13)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(0,39,30,0.38),0_0_14px_rgba(212,175,55,0.20)]"
      onClick={onClick}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="relative h-[112px] overflow-hidden border-b border-[#D4AF37]/45">
        <img
          src={cover}
          alt={`${displayName}${location ? ` - ${location}` : ''}`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02251e] via-black/15 to-black/5" />
        <span className="absolute left-3 top-3 rounded-full border border-[#E4C04B]/85 bg-[#011D18]/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#F4CE55] shadow-md backdrop-blur-sm">
          {tier === 'premium' ? text.premium : text.artisan}
        </span>
      </div>

      <div className="relative px-4 pb-4 pt-0">
        <div className="-mt-9 mb-2 flex items-end justify-between gap-3">
          <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#D4AF37] bg-white p-1.5 shadow-[0_7px_18px_rgba(0,0,0,0.34),0_0_9px_rgba(212,175,55,0.28)]">
            <img src={logo} alt={`Logo ${displayName}`} className="h-full w-full object-contain" loading="lazy" decoding="async" />
          </div>

          {isCertified(business.statut_carte) && (
            <span className="mb-1 inline-flex rounded-full border border-[#D4AF37]/70 bg-emerald-700/90 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-white">
              ★ {text.certified}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 font-serif text-[19px] font-bold leading-tight text-[#FFFDF2]">
          {displayName}
        </h3>

        {categoryLabel && (
          <p className="mt-1 line-clamp-1 text-xs font-bold text-[#F4CE55]">{categoryLabel}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-emerald-50/90">
          {location && (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#F4CE55]" />
              <span className="truncate">{location}</span>
            </span>
          )}

          {rating > 0 && (
            <span className="inline-flex items-center gap-1 font-bold text-[#FFF4BF]">
              <Star className="h-3.5 w-3.5 fill-[#F4CE55] text-[#F4CE55]" />
              {rating.toFixed(1)}{reviews > 0 ? ` (${reviews})` : ''}
            </span>
          )}
        </div>

        {displayDescription && (
          <p className="mt-3 line-clamp-2 min-h-[40px] text-xs leading-5 text-emerald-50/80">
            {displayDescription}
          </p>
        )}

        {(phone || mapsUrl) && (
          <div className="mt-3 grid grid-cols-2 gap-2" onClick={(event) => event.stopPropagation()}>
            {phone ? (
              <a
                href={`tel:${phone}`}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#D4AF37]/55 bg-[#042C24]/85 px-2 text-[11px] font-bold text-[#F4CE55] transition hover:border-[#F4CE55] hover:bg-[#064133]"
              >
                <Phone className="h-3.5 w-3.5" />
                {text.call}
              </a>
            ) : <span />}

            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#D4AF37]/55 bg-[#042C24]/85 px-2 text-[11px] font-bold text-[#F4CE55] transition hover:border-[#F4CE55] hover:bg-[#064133]"
              >
                <Navigation className="h-3.5 w-3.5" />
                {text.gps}
              </a>
            )}
          </div>
        )}

        {business.horaires_ok && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#D4AF37]/25 bg-black/10 px-2.5 py-2 text-[10px] text-emerald-50/75">
            <Clock3 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${openNow ? 'text-emerald-300' : 'text-red-300'}`} />
            <div className="min-w-0">
              <span className={`font-extrabold ${openNow ? 'text-emerald-300' : 'text-red-300'}`}>
                {openNow ? text.open : text.closed}
              </span>
              {today && <span className="ml-1.5 rtl:ml-0 rtl:mr-1.5">· {today}</span>}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl border border-[#D4AF37]/75 bg-[linear-gradient(90deg,#063B2F,#02251E)] px-3 text-xs font-black text-[#F4CE55] shadow-[inset_0_1px_6px_rgba(212,175,55,0.08)] transition hover:border-[#F4CE55] hover:bg-[#064436]"
        >
          {text.details} →
        </button>
      </div>
    </article>
  );
}
