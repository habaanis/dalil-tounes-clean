import { Calendar, MapPin, Users } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../lib/i18n';

export interface FeaturedEvent {
  id: string;
  event_name: string;
  event_date: string | null;
  end_date?: string | null;
  city?: string | null;
  location?: string | null;
  event_type?: string | null;
  short_description?: string | null;
  organizer?: string | null;
  registration_url?: string | null;
  image_url?: string | null;
  featured?: boolean | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  linkedin_url?: string | null;
  x_url?: string | null;
  youtube_url?: string | null;
  event_period_label?: string | null;
}

interface FeaturedEventCardProps {
  event: FeaturedEvent;
  onClick?: () => void;
}

const COPY: Record<Language, {
  from: string;
  to: string;
  organizedBy: string;
  viewDetails: string;
}> = {
  fr: { from: 'Du', to: 'au', organizedBy: 'Organisé par', viewDetails: 'Voir les détails' },
  ar: { from: 'من', to: 'إلى', organizedBy: 'نظّمها', viewDetails: 'عرض التفاصيل' },
  en: { from: 'From', to: 'to', organizedBy: 'Organized by', viewDetails: 'View details' },
  it: { from: 'Dal', to: 'al', organizedBy: 'Organizzato da', viewDetails: 'Vedi dettagli' },
  ru: { from: 'С', to: 'по', organizedBy: 'Организатор:', viewDetails: 'Подробнее' },
};

const DATE_LOCALES: Record<Language, string> = {
  fr: 'fr-FR', ar: 'ar-TN', en: 'en-GB', it: 'it-IT', ru: 'ru-RU',
};

const formatEventDate = (
  eventDate: string | null,
  endDate?: string | null,
  lang: Language = 'fr',
): string => {
  if (!eventDate) return '';
  const locale = DATE_LOCALES[lang];
  const start = new Date(eventDate);
  const isValidStart = !isNaN(start.getTime());

  if (!endDate) {
    return isValidStart ? start.toLocaleDateString(locale) : eventDate;
  }

  const end = new Date(endDate);
  const isValidEnd = !isNaN(end.getTime());

  if (isValidStart && isValidEnd) {
    const c = COPY[lang];
    return `${c.from} ${start.toLocaleDateString(locale)} ${c.to} ${end.toLocaleDateString(locale)}`;
  }

  return isValidStart ? start.toLocaleDateString(locale) : eventDate;
};

export const FeaturedEventCard = ({ event, onClick }: FeaturedEventCardProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const c = COPY[language] || COPY.fr;
  const dateDisplay = event.event_period_label || formatEventDate(event.event_date, event.end_date, language);

  return (
    <div
      onClick={onClick}
      className={`
        min-w-[260px] max-w-xs
        bg-white
        rounded-xl
        px-4 py-4
        ${isRTL ? 'text-right' : 'text-left'}
        hover:shadow-md
        hover:-translate-y-0.5
        transition-all
        cursor-pointer
        flex-shrink-0
      `}
      style={{ border: '2px solid #D4AF37' }}
    >
      {event.image_url && (
        <div className="w-full h-40 sm:h-48 md:h-56 rounded-lg overflow-hidden mb-3">
          <SafeImage
            src={event.image_url}
            alt={event.event_name}
            className="w-full h-full object-contain"
            fallbackType="icon"
          />
        </div>
      )}

      {dateDisplay && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-xs rounded-full px-2 py-0.5">
            <Calendar className="w-3 h-3" />
            {dateDisplay}
          </span>
        </div>
      )}

      <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
        {event.event_name}
      </h3>

      {(event.city || event.location) && (
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {event.city && event.location ? `${event.city} · ${event.location}` : event.city || event.location}
          </span>
        </div>
      )}

      {event.short_description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {event.short_description}
        </p>
      )}

      {event.organizer && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <Users className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{c.organizedBy} {event.organizer}</span>
        </div>
      )}

      <div className="text-sm text-orange-600 font-medium flex items-center gap-1">
        <span>{c.viewDetails}</span>
        <span className={isRTL ? 'rotate-180' : ''}>→</span>
      </div>
    </div>
  );
};
