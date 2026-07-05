import React from 'react';
import { MapPin, Palette, PartyPopper, Utensils, Building, Mountain, Dumbbell } from 'lucide-react';
import { SECTEURS_CONFIG } from '../lib/cultureEventCategories';
import { useLanguage } from '../context/LanguageContext';
import { t, type Lang } from '../lib/i18n';

interface LeisureCard {
  id: string;
  image: string;
  title: string;
  location: string;
  tab: 'evenements' | 'lieux';
  secteur?: string;
  icon: typeof MapPin;
}

const leisureCards: LeisureCard[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&fm=webp',
    title: 'Saveurs & Traditions',
    location: 'Gastronomie',
    tab: 'evenements',
    secteur: 'Saveurs & Traditions',
    icon: Utensils
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=600&q=80&fm=webp',
    title: 'Musée & Patrimoine',
    location: 'Sites historiques',
    tab: 'evenements',
    secteur: 'Musée & Patrimoine',
    icon: Building
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80&fm=webp',
    title: 'Escapades & Nature',
    location: 'Nature & Détente',
    tab: 'evenements',
    secteur: 'Escapades & Nature',
    icon: Mountain
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80&fm=webp',
    title: 'Festivals & artisanat',
    location: 'Événements culturels',
    tab: 'evenements',
    secteur: 'Festivals & artisanat',
    icon: PartyPopper
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80&fm=webp',
    title: 'Sport & Aventure',
    location: 'Activités sportives',
    tab: 'evenements',
    secteur: 'Sport & Aventure',
    icon: Dumbbell
  }
];

export const LeisureEventsSection: React.FC = () => {
  const { language } = useLanguage();
  const lang = language as Lang;
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
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  </div>

                  <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-1 sm:p-2 shadow-lg border border-[#D4AF37]">
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-[#4A1D43]" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                    <h3 className="text-white font-semibold text-xs sm:text-base mb-0.5 sm:mb-1.5 drop-shadow-lg leading-tight">
                      {card.title}
                    </h3>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-white/90">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span className="text-[10px] sm:text-xs drop-shadow truncate">{card.location}</span>
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
            Découvrir toutes les sorties
          </a>
        </div>
      </div>
    </section>
  );
};

export default LeisureEventsSection;
