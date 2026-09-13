import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../lib/i18n';

const COPY: Record<Language, {
  city: string;
  date: string;
  type: string;
  sector: string;
  notDefined: string;
}> = {
  fr: { city: 'Ville', date: 'Date', type: 'Type', sector: 'Secteur', notDefined: 'Non défini' },
  ar: { city: 'المدينة', date: 'التاريخ', type: 'النوع', sector: 'القطاع', notDefined: 'غير محدد' },
  en: { city: 'City', date: 'Date', type: 'Type', sector: 'Sector', notDefined: 'Not defined' },
  it: { city: 'Città', date: 'Data', type: 'Tipo', sector: 'Settore', notDefined: 'Non definito' },
  ru: { city: 'Город', date: 'Дата', type: 'Тип', sector: 'Сектор', notDefined: 'Не определено' },
};

interface SimpleEventCardProps {
  event: {
    titre: string;
    ville: string;
    date_debut: string;
    type_affichage?: string;
    secteur_evenement?: string;
  };
}

export default function SimpleEventCard({ event }: SimpleEventCardProps) {
  const { language } = useLanguage();
  const c = COPY[language] || COPY.fr;
  return (
    <div className="bg-[#F8F9FA] rounded-lg p-4 text-[#4A1D43]" style={{ border: '2px solid #D4AF37' }}>
      <h3 className="text-xl font-bold mb-2 text-[#4A1D43]">{event.titre}</h3>
      <p className="text-sm text-[#4A1D43]/80">{c.city}: {event.ville}</p>
      <p className="text-sm text-[#4A1D43]/80">{c.date}: {event.date_debut}</p>
      <p className="text-sm text-[#4A1D43]/80">{c.type}: {event.type_affichage || c.notDefined}</p>
      <p className="text-sm text-[#4A1D43]/80">{c.sector}: {event.secteur_evenement || c.notDefined}</p>
    </div>
  );
}
