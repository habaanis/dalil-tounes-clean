import { CalendarDays, MapPin, Eye } from 'lucide-react';

export interface AppLeisureEvent {
  id: string;
  titre: string;
  description: string;
  date_debut: string;
  date_fin?: string;
  localisation_ville: string;
  lieu?: string;
  prix?: string;
  type_evenement?: string;
  image_url?: string;
  lien_billetterie?: string;
  organisateur?: string;
}

interface Props {
  event: AppLeisureEvent;
  title: string;
  description: string;
  dateLabel: string;
  viewLabel: string;
  onOpen: () => void;
}

/**
 * The platform PWA needs a *single-column list of horizontal event cards*.
 * The existing EventCard remains untouched for the desktop site.
 */
export default function AppLeisureEventCard({ event, title, description, dateLabel, viewLabel, onOpen }: Props) {
  const imageUrl = event.image_url?.split(',')[0]?.trim();
  return (
    <article className="flex w-full min-w-0 overflow-hidden rounded-xl border border-[#D8C59C] bg-white shadow-[0_2px_9px_rgba(53,23,47,0.05)]">
      <button type="button" onClick={onOpen} aria-label={viewLabel + ' : ' + title}
        className="relative flex w-[88px] shrink-0 items-center justify-center self-stretch overflow-hidden bg-[#EFE7D8] text-[#916F3D] sm:w-28">
        <CalendarDays className="h-8 w-8" aria-hidden="true" />
        {imageUrl && <img src={imageUrl} alt="" loading="lazy" decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1 px-2.5 py-2">
        {event.type_evenement && <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9D7A40]">{event.type_evenement}</p>}
        <button type="button" onClick={onOpen}
          className="line-clamp-2 text-start font-serif text-sm font-semibold leading-[1.25] text-[#421D3B] hover:underline">
          {title}
        </button>
        {description && <p className="line-clamp-1 break-words text-[11px] leading-4 text-[#71616E]">{description}</p>}
        <p className="flex min-w-0 items-start gap-1 text-[11px] font-medium leading-4 text-[#4A1D43]">
          <CalendarDays className="mt-0.5 h-3 w-3 shrink-0 text-[#A17D36]" aria-hidden="true" />
          <span>{dateLabel}</span>
        </p>
        {event.localisation_ville && <p className="flex min-w-0 items-start gap-1 text-[11px] leading-4 text-[#71616E]">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-[#A17D36]" aria-hidden="true" />
          <span className="min-w-0 break-words">{event.localisation_ville}</span>
        </p>}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-1 pt-0.5">
          {event.prix && <span className="max-w-full truncate text-[11px] font-medium text-[#8F6E33]">{event.prix}</span>}
          <button type="button" onClick={onOpen} className="inline-flex min-h-9 items-center gap-1 rounded-md bg-[#4A1D43] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#633056] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />{viewLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
