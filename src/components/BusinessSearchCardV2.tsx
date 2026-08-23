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
  fr: { artisan: 'Vitrine Business Artisan', premium: 'CV Business Premium', certified: 'Certifié Dalil Tounes', open: 'Ouvert', closed: 'Fermé', call: 'Appeler', gps: 'GPS', details: 'Voir le CV Business' },
  ar: { artisan: 'واجهة نشاط حرفي', premium: 'السيرة المهنية Premium', certified: 'موثّق من دليل تونس', open: 'مفتوح', closed: 'مغلق', call: 'اتصال', gps: 'GPS', details: 'عرض السيرة المهنية' },
  en: { artisan: 'Artisan Business Showcase', premium: 'Premium Business CV', certified: 'Dalil Tounes Certified', open: 'Open', closed: 'Closed', call: 'Call', gps: 'GPS', details: 'View Business CV' },
  it: { artisan: 'Vetrina Business Artisan', premium: 'CV Business Premium', certified: 'Certificato Dalil Tounes', open: 'Aperto', closed: 'Chiuso', call: 'Chiama', gps: 'GPS', details: 'Vedi CV Business' },
  ru: { artisan: 'Витрина Business Artisan', premium: 'CV Business Premium', certified: 'Проверено Dalil Tounes', open: 'Открыто', closed: 'Закрыто', call: 'Позвонить', gps: 'GPS', details: 'Открыть CV Business' },
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
      className="group relative h-full cursor-pointer overflow-hidden rounded-[18px] border-2 border-[#D4AF37] bg-[radial-gradient(circle_at_50%_3%,rgba(20,111,77,0.30),transparent_27%),linear-gradient(145deg,#031D18_0%,#04382D_52%,#011914_100%)] text-white shadow-[0_12px_28px_rgba(0,39,30,0.26),0_0_8px_rgba(212,175,55,0.12)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(0,39,30,0.32),0_0_10px_rgba(212,175,55,0.18)]"
      onClick={onClick}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="relative h-[82px] overflow-hidden border-b border-[#D4AF37]/40">
        <img
          src={cover}
          alt={`${displayName}${location ? ` - ${location}` : ''}`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02251e] via-black/10 to-black/5" />
        <span className="absolute left-2.5 top-2.5 rounded-full border border-[#E4C04B]/80 bg-[#011D18]/90 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.07em] text-[#F4CE55] shadow-sm backdrop-blur-sm">
          {tier === 'premium' ? text.premium : text.artisan}
        </span>
      </div>

      <div className="relative px-3 pb-3 pt-0">
        <div className="-mt-7 mb-1.5 flex items-end justify-between gap-2">
          <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#D4AF37] bg-white p-1 shadow-[0_5px_13px_rgba(0,0,0,0.30),0_0_7px_rgba(212,175,55,0.24)]">
            <img src={logo} alt={`Logo ${displayName}`} className="h-full w-full object-contain" loading="lazy" decoding="async" />
          </div>

          {isCertified(business.statut_carte) && (
            <span className="mb-0.5 inline-flex rounded-full border border-[#D4AF37]/65 bg-emerald-700/90 px-1.5 py-0.5 text-[7px] font-extrabold uppercase tracking-wide text-white">
              ★ {text.certified}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 font-serif text-[16px] font-bold leading-[1.08] text-[#FFFDF2]">
          {displayName}
        </h3>

        {categoryLabel && (
          <p className="mt-0.5 line-clamp-1 text-[10px] font-bold text-[#F4CE55]">{categoryLabel}</p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-emerald-50/90">
          {location && (
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0 text-[#F4CE55]" />
              <span className="truncate">{location}</span>
            </span>
          )}
          {rating > 0 && (
            <span className="inline-flex items-center gap-1 font-bold text-[#FFF4BF]">
              <Star className="h-3 w-3 fill-[#F4CE55] text-[#F4CE55]" />
              {rating.toFixed(1)}{reviews > 0 ? ` (${reviews})` : ''}
            </span>
          )}
        </div>

        {displayDescription && (
          <p className="mt-1.5 line-clamp-1 text-[9px] leading-4 text-emerald-50/75">
            {displayDescription}
          </p>
        )}

        {(phone || mapsUrl) && (
          <div className="mt-2 grid grid-cols-2 gap-1.5" onClick={(event) => event.stopPropagation()}>
            {phone ? (
              <a
                href={`tel:${phone}`}
                className="inline-flex min-h-8 items-center justify-center gap-1 rounded-md border border-[#D4AF37]/50 bg-[#042C24]/85 px-1.5 text-[9px] font-bold text-[#F4CE55] transition hover:border-[#F4CE55] hover:bg-[#064133]"
              >
                <Phone className="h-3 w-3" />
                {text.call}
              </a>
            ) : <span />}

            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-8 items-center justify-center gap-1 rounded-md border border-[#D4AF37]/50 bg-[#042C24]/85 px-1.5 text-[9px] font-bold text-[#F4CE55] transition hover:border-[#F4CE55] hover:bg-[#064133]"
              >
                <Navigation className="h-3 w-3" />
                {text.gps}
              </a>
            )}
          </div>
        )}

        {business.horaires_ok && (
          <div className="mt-2 flex min-h-[30px] items-center gap-1.5 rounded-md border border-[#D4AF37]/22 bg-black/10 px-2 py-1 text-[8px] text-emerald-50/72">
            <Clock3 className={`h-3 w-3 shrink-0 ${openNow ? 'text-emerald-300' : 'text-red-300'}`} />
            <span className={`font-extrabold ${openNow ? 'text-emerald-300' : 'text-red-300'}`}>
              {openNow ? text.open : text.closed}
            </span>
            {today && <span className="line-clamp-1 opacity-85">· {today}</span>}
          </div>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          className="mt-2 flex min-h-9 w-full items-center justify-center rounded-lg border border-[#D4AF37]/70 bg-[linear-gradient(90deg,#063B2F,#02251E)] px-2 text-[10px] font-black text-[#F4CE55] shadow-[inset_0_1px_5px_rgba(212,175,55,0.07)] transition hover:border-[#F4CE55] hover:bg-[#064436]"
        >
          {text.details} →
        </button>
      </div>
    </article>
  );
}
