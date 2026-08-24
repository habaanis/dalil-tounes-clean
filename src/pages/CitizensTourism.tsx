import { ArrowLeft } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { getSupabaseImageUrl } from '../lib/imageUtils';
import MeilleursSection from '../components/MeilleursSection';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

type PublicLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

const copy: Record<PublicLanguage, {
  back: string;
  title: string;
  intro: string;
  slogan: string;
  sector: string;
  recommended: string;
  articleTitle: string;
  articleExcerpt: string;
  heroAlt: string;
}> = {
  fr: {
    back: 'Retour',
    title: 'Tourisme Local & Expatriation',
    intro: "Découvrez les meilleurs services pour touristes et expatriés en Tunisie. Hébergement, guides touristiques, services d'immigration et plus encore.",
    slogan: 'Votre guide pour un séjour réussi en Tunisie',
    sector: 'tourisme',
    recommended: 'Entreprises les plus recommandées par les clients',
    articleTitle: 'Guide du tourisme en Tunisie',
    articleExcerpt: 'Découvrez les meilleurs sites, hébergements et activités pour un séjour inoubliable en Tunisie.',
    heroAlt: 'Tourisme local et expatriation en Tunisie',
  },
  ar: {
    back: 'رجوع',
    title: 'السياحة المحلية والاغتراب',
    intro: 'اكتشف أفضل الخدمات للسياح والمغتربين في تونس: الإقامة، الأدلة السياحية، خدمات الهجرة والمزيد.',
    slogan: 'دليلك لإقامة ناجحة في تونس',
    sector: 'سياحة',
    recommended: 'المؤسسات الأكثر توصية من قبل العملاء',
    articleTitle: 'دليل السياحة في تونس',
    articleExcerpt: 'اكتشف أفضل المواقع والإقامات والأنشطة لإقامة لا تُنسى في تونس.',
    heroAlt: 'السياحة المحلية وخدمات المغتربين في تونس',
  },
  en: {
    back: 'Back',
    title: 'Local Tourism & Expatriation',
    intro: 'Discover services for tourists and expatriates in Tunisia, including accommodation, tourist guides, immigration services and more.',
    slogan: 'Your guide to a successful stay in Tunisia',
    sector: 'tourism',
    recommended: 'Most recommended businesses by customers',
    articleTitle: 'Tourism guide in Tunisia',
    articleExcerpt: 'Discover the best sites, accommodations and activities for an unforgettable stay in Tunisia.',
    heroAlt: 'Local tourism and expatriation services in Tunisia',
  },
  it: {
    back: 'Indietro',
    title: 'Turismo Locale ed Espatrio',
    intro: 'Scopri i servizi per turisti ed espatriati in Tunisia: alloggi, guide turistiche, servizi di immigrazione e molto altro.',
    slogan: 'La tua guida per un soggiorno di successo in Tunisia',
    sector: 'turismo',
    recommended: 'Aziende più raccomandate dai clienti',
    articleTitle: 'Guida al turismo in Tunisia',
    articleExcerpt: 'Scopri i migliori siti, alloggi e attività per un soggiorno indimenticabile in Tunisia.',
    heroAlt: 'Turismo locale e servizi per espatriati in Tunisia',
  },
  ru: {
    back: 'Назад',
    title: 'Местный туризм и жизнь за границей',
    intro: 'Найдите полезные услуги для туристов и экспатов в Тунисе: жильё, гидов, иммиграционные услуги и многое другое.',
    slogan: 'Ваш гид для комфортного пребывания в Тунисе',
    sector: 'туризм',
    recommended: 'Компании, которые чаще всего рекомендуют клиенты',
    articleTitle: 'Путеводитель по Тунису',
    articleExcerpt: 'Откройте лучшие места, варианты проживания и развлечения для незабываемой поездки по Тунису.',
    heroAlt: 'Местный туризм и услуги для экспатов в Тунисе',
  },
};

interface CitizensTourismProps {
  onNavigate?: (page: any) => void;
}

export default function CitizensTourism({ onNavigate: _onNavigate }: CitizensTourismProps = {}) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const t = copy[lang];
  const isRTL = lang === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="relative w-full h-[280px] overflow-hidden">
        <img
          src={getSupabaseImageUrl('entreprise_banner.webp')}
          alt={t.heroAlt}
          className="absolute inset-0 w-full h-full object-cover"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D43]/80 via-[#4A1D43]/70 to-transparent" />

        <button
          onClick={() => navigate('/citizens')}
          className={`absolute top-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#4A1D43] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white transition-colors shadow-sm ${isRTL ? 'right-4' : 'left-4'}`}
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          {t.back}
        </button>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2 drop-shadow-lg text-[#D4AF37]">{t.title}</h1>
          <p className="text-sm md:text-base font-light text-white/95 max-w-3xl leading-relaxed drop-shadow-lg">{t.intro}</p>
        </div>
      </section>

      <section className="py-6 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg md:text-xl font-light mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-[#4A0404]">{t.slogan}</span>
          </p>
          <div className="flex justify-center"><div className="w-[40px] h-[1px] bg-[#D4AF37]" /></div>
        </div>
      </section>

      <section className="py-2 px-4 relative z-[9999]" style={{ overflow: 'visible' }}>
        <div className="max-w-5xl mx-auto" style={{ overflow: 'visible' }}>
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#D4AF37] p-2.5 md:p-3" style={{ overflow: 'visible' }}>
            <SearchBar scope="tourism" intentEnabled={false} enabled resultMode="redirectToResults" />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <MeilleursSection
          secteurLabel={t.sector}
          listePage="tourisme local & expatriation"
          accentColor="#4A0404"
          sectionTitle={t.recommended}
          blogArticle={{ title: t.articleTitle, excerpt: t.articleExcerpt, slug: 'guide-tourisme-tunisie' }}
        />
      </div>
    </div>
  );
}
