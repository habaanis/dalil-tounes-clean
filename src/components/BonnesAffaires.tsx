import { useState, useEffect } from 'react';
import { TrendingUp, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Tables } from '../lib/dbTables';
import { useLanguage } from '../context/LanguageContext';

interface Deal {
  id: string;
  title: string;
  price: number;
  city: string;
  photo_url: string[];
  urgent: boolean;
  hours_ago: number;
}

interface BonnesAffairesProps {
  onSelectDeal: (dealId: string) => void;
}

const copy = {
  fr: {
    title: 'Bonnes affaires du moment',
    subtitle: 'Les meilleures opportunités à ne pas manquer !',
    urgent: 'URGENT',
    goodDeal: '🔥 Bonne affaire',
    negotiate: 'À négocier',
    justNow: 'Nouveau',
    hoursAgo: 'Il y a {n}h',
    daysAgo: 'Il y a {n}j',
  },
  en: {
    title: 'Best deals right now',
    subtitle: 'Don't miss the best opportunities!',
    urgent: 'URGENT',
    goodDeal: '🔥 Great deal',
    negotiate: 'Negotiable',
    justNow: 'New',
    hoursAgo: '{n}h ago',
    daysAgo: '{n}d ago',
  },
  ar: {
    title: 'أفضل الصفقات حالياً',
    subtitle: 'لا تفوت أفضل الفرص!',
    urgent: 'عاجل',
    goodDeal: '🔥 صفقة جيدة',
    negotiate: 'قابل للتفاوض',
    justNow: 'جديد',
    hoursAgo: 'منذ {n} س',
    daysAgo: 'منذ {n} ي',
  },
  it: {
    title: 'Migliori offerte del momento',
    subtitle: 'Non perderti le migliori opportunità!',
    urgent: 'URGENTE',
    goodDeal: '🔥 Ottima offerta',
    negotiate: 'Trattabile',
    justNow: 'Nuovo',
    hoursAgo: '{n}h fa',
    daysAgo: '{n}g fa',
  },
  ru: {
    title: 'Лучшие предложения сейчас',
    subtitle: 'Не упустите лучшие возможности!',
    urgent: 'СРОЧНО',
    goodDeal: '🔥 Выгодная сделка',
    negotiate: 'Договорная',
    justNow: 'Новое',
    hoursAgo: '{n}ч назад',
    daysAgo: '{n}д назад',
  },
};

type Lang = keyof typeof copy;

export default function BonnesAffaires({ onSelectDeal }: BonnesAffairesProps) {
  const { language } = useLanguage();
  const t = copy[language as Lang] || copy.fr;
  const isRTL = language === 'ar';

  const [deals, setDeals] = useState<Deal[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(Tables.ANNONCES)
        .select('id, titre, prix, ville, photos, urgent, created_at')
        .eq('statut', 'active')
        .or('urgent.eq.true,prix.lt.100')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        const formattedDeals = data.map(item => ({
          id: item.id,
          title: item.titre,
          price: item.prix,
          city: item.ville,
          photo_url: item.photos || [],
          urgent: item.urgent || false,
          hours_ago: Math.floor((Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60))
        }));
        setDeals(formattedDeals);
      }
    } catch (error) {
      console.error('Erreur chargement bonnes affaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextDeal = () => {
    setCurrentIndex((prev) => (prev + 1) % deals.length);
  };

  const prevDeal = () => {
    setCurrentIndex((prev) => (prev - 1 + deals.length) % deals.length);
  };

  const formatPrice = (price: number) => {
    if (price === 0) return t.negotiate;
    return `${price.toLocaleString('fr-FR')} TND`;
  };

  const formatTime = (hoursAgo: number) => {
    if (hoursAgo < 1) return t.justNow;
    if (hoursAgo < 24) return t.hoursAgo.replace('{n}', String(Math.floor(hoursAgo)));
    return t.daysAgo.replace('{n}', String(Math.floor(hoursAgo / 24)));
  };

  if (loading || deals.length === 0) {
    return null;
  }

  const visibleDeals = deals.slice(currentIndex, currentIndex + 3).concat(
    deals.slice(0, Math.max(0, (currentIndex + 3) - deals.length))
  );

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-3xl p-8 shadow-xl border-2 border-orange-200 mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D62828] to-[#b91c1c] rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-sm text-gray-600">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={prevDeal}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            disabled={deals.length <= 3}
          >
            {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>
          <button
            onClick={nextDeal}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            disabled={deals.length <= 3}
          >
            {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleDeals.map((deal) => {
          const mainPhoto = deal.photo_url && deal.photo_url.length > 0
            ? deal.photo_url[0]
            : null;

          return (
            <div
              key={deal.id}
              onClick={() => onSelectDeal(deal.id)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all hover:shadow-2xl group"
            >
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {mainPhoto ? (
                  <img
                    src={mainPhoto}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <TrendingUp className="w-16 h-16 opacity-30" />
                  </div>
                )}

                {deal.urgent && (
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`}>
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
                      <Zap className="w-3 h-3 fill-current" />
                      {t.urgent}
                    </span>
                  </div>
                )}

                <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
                  <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                    {formatTime(deal.hours_ago)}
                  </span>
                </div>

                <div className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'}`}>
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {t.goodDeal}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[56px] group-hover:text-[#D62828] transition-colors">
                  {deal.title}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-[#D62828]">
                    {formatPrice(deal.price)}
                  </div>
                  <span className="text-sm text-gray-600">{deal.city}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {deals.length > 3 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(deals.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 3)}
              className={`h-2 rounded-full transition-all ${
                Math.floor(currentIndex / 3) === index
                  ? 'w-8 bg-[#D62828]'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
