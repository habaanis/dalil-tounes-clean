import React from 'react';
import { MapPin, Palette, PartyPopper, Utensils, Building, Mountain, Dumbbell } from 'lucide-react';
import { SECTEURS_CONFIG } from '../lib/cultureEventCategories';
import { useLanguage } from '../context/LanguageContext';
import { t, type Lang } from '../lib/i18n';

interface LeisureCard {
  id: string;
  image: string;
  secteur: string;
  tab: 'evenements' | 'lieux';
  icon: typeof MapPin;
}

const leisureCards: LeisureCard[] = [
  { id: '1', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&fm=webp', secteur: 'Saveurs & Traditions', tab: 'evenements', icon: Utensils },
  { id: '2', image: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=600&q=80&fm=webp', secteur: 'Musée & Patrimoine', tab: 'evenements', icon: Building },
  { id: '3', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80&fm=webp', secteur: 'Escapades & Nature', tab: 'evenements', icon: Mountain },
  { id: '4', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80&fm=webp', secteur: 'Festivals & artisanat', tab: 'evenements', icon: PartyPopper },
  { id: '5', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80&fm=webp', secteur: 'Sport & Aventure', tab: 'evenements', icon: Dumbbell },
];

const SECTEUR_LABELS: Record<Lang, Record<string, { title: string; location: string }>> = {
  fr: {
    'Saveurs & Traditions': { title: 'Saveurs & Traditions', location: 'Gastronomie' },
    'Musée & Patrimoine': { title: 'Musée & Patrimoine', location: 'Sites historiques' },
    'Escapades & Nature': { title: 'Escapades & Nature', location: 'Nature & Détente' },
    'Festivals & artisanat': { title: 'Festivals & artisanat', location: 'Événements culturels' },
    'Sport & Aventure': { title: 'Sport & Aventure', location: 'Activités sportives' },
  },
  ar: {
    'Saveurs & Traditions': { title: 'النكهات والتقاليد', location: 'فن الطبخ' },
    'Musée & Patrimoine': { title: 'المتاحف والتراث', location: 'مواقع تاريخية' },
    'Escapades & Nature': { title: 'رحلات وطبيعة', location: 'طبيعة واسترخاء' },
    'Festivals & artisanat': { title: 'مهرجانات وحرف', location: 'فعاليات ثقافية' },
    'Sport & Aventure': { title: 'رياضة ومغامرة', location: 'أنشطة رياضية' },
  },
  en: {
    'Saveurs & Traditions': { title: 'Flavours & Traditions', location: 'Gastronomy' },
    'Musée & Patrimoine': { title: 'Museums & Heritage', location: 'Historic sites' },
    'Escapades & Nature': { title: 'Nature Getaways', location: 'Nature & Relaxation' },
    'Festivals & artisanat': { title: 'Festivals & Crafts', location: 'Cultural events' },
    'Sport & Aventure': { title: 'Sport & Adventure', location: 'Sports activities' },
  },
  it: {
    'Saveurs & Traditions': { title: 'Sapori & Tradizioni', location: 'Gastronomia' },
    'Musée & Patrimoine': { title: 'Musei & Patrimonio', location: 'Siti storici' },
    'Escapades & Nature': { title: 'Escursioni & Natura', location: 'Natura & Relax' },
    'Festivals & artisanat': { title: 'Festival & Artigianato', location: 'Eventi culturali' },
    'Sport & Aventure': { title: 'Sport & Avventura', location: 'Attività sportive' },
  },
  ru: {
    'Saveurs & Traditions': { title: 'Вкусы и традиции', location: 'Гастрономия' },
    'Musée & Patrimoine': { title: 'Музеи и наследие', location: 'Исторические места' },
    'Escapades & Nature': { title: 'Природа и поездки', location: 'Природа и отдых' },
    'Festivals & artisanat': { title: 'Фестивали и ремёсла', location: 'Культурные события' },
    'Sport & Aventure': { title: 'Спорт и приключения', location: 'Спортивные мероприятия' },
  },
};

const CTA: Record<Lang, string> = {
  fr: 'Découvrir toutes les sorties',
  ar: 'اكتشف جميع الخروجات',
  en: 'Discover all outings',
  it: 'Scopri tutte le uscite',
  ru: 'Откройте все развлечения',
};

export const LeisureEventsSection: React.FC = () => {
  const { language } = useLanguage();
  const lang = language as Lang;
  const isRTL = lang === 'ar';
  const labels = SECTEUR_LABELS[lang] || SECTEUR_LABELS.fr;

  return (
    <section className="py-3 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-lg md:text-xl font-light text-gray-900 mb-2">
            {t(lang, 'homeExtra.leisureTitle')}
          </h2>
          <p className="text-gray-600 text-sm">
            {t(lang, 'homeExtra.leisureSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-3 md:gap-4 mb-5">
          {leisureCards.map((card) => {
            const Icon = card.icon;
            const url = card.secteur
              ? `#/culture-events?secteur=${encodeURIComponent(card.secteur)}`
              : `#/culture-events`;
            const label = labels[card.secteur] || { title: card.secteur, location: '' };

            return (
              <a
                key={card.id}
                href={url}
                className="group cursor-pointer block"
              >
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#D4AF37] shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(74,29,67,0.15)] hover:scale-105">
                  <div className="aspect-square sm:aspect-[4/5] overflow-hidden max-h-[95px] sm:max-h-none">
                    <img
                      src={card.image}
                      alt={label.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  </div>

                  <div className={`absolute top-1.5 ${isRTL ? 'left-1.5' : 'right-1.5'} sm:top-3 ${isRTL ? 'sm:left-3' : 'sm:right-3'}`}>
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-1 sm:p-2 shadow-lg border border-[#D4AF37]">
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-[#4A1D43]" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                    <h3 className="text-white font-semibold text-xs sm:text-base mb-0.5 sm:mb-1.5 drop-shadow-lg leading-tight">
                      {label.title}
                    </h3>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-white/90">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span className="text-[10px] sm:text-xs drop-shadow truncate">{label.location}</span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="text-center">
          <a
            href="#/citizens/leisure"
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#4A1D43] hover:bg-[#5A2D53] text-[#D4AF37] font-semibold rounded-lg border border-[#D4AF37] transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.5)] hover:scale-105 text-sm"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {CTA[lang] || CTA.fr}
          </a>
        </div>
      </div>
    </section>
  );
};

export default LeisureEventsSection;
