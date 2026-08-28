import SearchBar from '../components/SearchBar';
import { getSupabaseImageUrl } from '../lib/imageUtils';
import MeilleursSection from '../components/MeilleursSection';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/SEOHead';

type PublicLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

const copy: Record<PublicLanguage, {
  title: string;
  intro: string;
  slogan: string;
  sector: string;
  recommended: string;
  preferredTitle: string;
  preferredSubtitle: string;
  allReferenced: string;
  searchOther: string;
  searchQuery: string;
  articleTitle: string;
  articleExcerpt: string;
  heroAlt: string;
  seoTitle: string;
  expatTitle: string;
  expatIntro: string;
  quickLinks: readonly [string, string, string, string];
}> = {
  fr: {
    title: 'Tourisme Local & Expatriation',
    intro: "Découvrez les meilleurs services pour touristes et expatriés en Tunisie. Hébergement, guides touristiques, services d'immigration et plus encore.",
    slogan: 'Votre guide pour un séjour réussi en Tunisie',
    sector: 'tourisme',
    recommended: 'Entreprises les plus recommandées par les clients',
    preferredTitle: 'Les services utiles aux touristes et expatriés',
    preferredSubtitle: 'Des professionnels pour faciliter votre séjour ou votre installation en Tunisie',
    allReferenced: 'Tous les services tourisme & expatriation référencés',
    searchOther: "Rechercher d'autres services tourisme & expatriation",
    searchQuery: 'tourisme expatriation',
    articleTitle: 'Guide du tourisme en Tunisie',
    articleExcerpt: 'Découvrez les meilleurs sites, hébergements et activités pour un séjour inoubliable en Tunisie.',
    heroAlt: 'Tourisme local et expatriation en Tunisie',
    seoTitle: 'Tourisme et services pour expatriés en Tunisie | Dalil Tounes',
    expatTitle: "S'installer et vivre en Tunisie",
    expatIntro: 'Retrouvez rapidement les services essentiels pour préparer votre séjour, vos démarches et votre vie quotidienne.',
    quickLinks: ['Services publics', 'Santé', 'Éducation', 'Emploi'],
  },
  ar: {
    title: 'السياحة المحلية والاغتراب',
    intro: 'اكتشف أفضل الخدمات للسياح والمغتربين في تونس: الإقامة، الأدلة السياحية، خدمات الهجرة والمزيد.',
    slogan: 'دليلك لإقامة ناجحة في تونس',
    sector: 'سياحة',
    recommended: 'المؤسسات الأكثر توصية من قبل العملاء',
    preferredTitle: 'خدمات مفيدة للسياح والمقيمين الأجانب',
    preferredSubtitle: 'مهنيون يساعدونك على تسهيل إقامتك أو استقرارك في تونس',
    allReferenced: 'جميع خدمات السياحة والإقامة للأجانب المسجلة',
    searchOther: 'البحث عن خدمات سياحية وخدمات للمقيمين الأجانب',
    searchQuery: 'السياحة الإقامة الأجانب',
    articleTitle: 'دليل السياحة في تونس',
    articleExcerpt: 'اكتشف أفضل المواقع والإقامات والأنشطة لإقامة لا تُنسى في تونس.',
    heroAlt: 'السياحة المحلية وخدمات المغتربين في تونس',
    seoTitle: 'السياحة وخدمات المقيمين الأجانب في تونس | دليل تونس',
    expatTitle: 'الاستقرار والعيش في تونس',
    expatIntro: 'اعثر بسرعة على الخدمات الأساسية لتحضير إقامتك وإجراءاتك وحياتك اليومية.',
    quickLinks: ['الخدمات العامة', 'الصحة', 'التعليم', 'التوظيف'],
  },
  en: {
    title: 'Local Tourism & Expatriation',
    intro: 'Discover services for tourists and expatriates in Tunisia, including accommodation, tourist guides, immigration services and more.',
    slogan: 'Your guide to a successful stay in Tunisia',
    sector: 'tourism',
    recommended: 'Most recommended businesses by customers',
    preferredTitle: 'Useful services for tourists and expatriates',
    preferredSubtitle: 'Professionals who can make your stay or relocation to Tunisia easier',
    allReferenced: 'All listed tourism and expatriation services',
    searchOther: 'Search other tourism and expatriation services',
    searchQuery: 'tourism expatriation',
    articleTitle: 'Tourism guide in Tunisia',
    articleExcerpt: 'Discover the best sites, accommodations and activities for an unforgettable stay in Tunisia.',
    heroAlt: 'Local tourism and expatriation services in Tunisia',
    seoTitle: 'Tourism and expatriate services in Tunisia | Dalil Tounes',
    expatTitle: 'Settling and living in Tunisia',
    expatIntro: 'Quickly find essential services for your stay, administrative procedures and daily life.',
    quickLinks: ['Public services', 'Health', 'Education', 'Jobs'],
  },
  it: {
    title: 'Turismo Locale ed Espatrio',
    intro: 'Scopri i servizi per turisti ed espatriati in Tunisia: alloggi, guide turistiche, servizi di immigrazione e molto altro.',
    slogan: 'La tua guida per un soggiorno di successo in Tunisia',
    sector: 'turismo',
    recommended: 'Aziende più raccomandate dai clienti',
    preferredTitle: 'Servizi utili per turisti ed espatriati',
    preferredSubtitle: 'Professionisti che facilitano il tuo soggiorno o trasferimento in Tunisia',
    allReferenced: 'Tutti i servizi turistici e per espatriati registrati',
    searchOther: 'Cerca altri servizi turistici e per espatriati',
    searchQuery: 'turismo espatriati',
    articleTitle: 'Guida al turismo in Tunisia',
    articleExcerpt: 'Scopri i migliori siti, alloggi e attività per un soggiorno indimenticabile in Tunisia.',
    heroAlt: 'Turismo locale e servizi per espatriati in Tunisia',
    seoTitle: 'Turismo e servizi per espatriati in Tunisia | Dalil Tounes',
    expatTitle: 'Trasferirsi e vivere in Tunisia',
    expatIntro: 'Trova rapidamente i servizi essenziali per il soggiorno, le pratiche amministrative e la vita quotidiana.',
    quickLinks: ['Servizi pubblici', 'Salute', 'Istruzione', 'Lavoro'],
  },
  ru: {
    title: 'Местный туризм и жизнь за границей',
    intro: 'Найдите полезные услуги для туристов и экспатов в Тунисе: жильё, гидов, иммиграционные услуги и многое другое.',
    slogan: 'Ваш гид для комфортного пребывания в Тунисе',
    sector: 'туризм',
    recommended: 'Компании, которые чаще всего рекомендуют клиенты',
    preferredTitle: 'Полезные услуги для туристов и экспатов',
    preferredSubtitle: 'Специалисты, которые помогут с поездкой или переездом в Тунис',
    allReferenced: 'Все услуги для туристов и экспатов',
    searchOther: 'Найти другие услуги для туристов и экспатов',
    searchQuery: 'туризм экспаты',
    articleTitle: 'Путеводитель по Тунису',
    articleExcerpt: 'Откройте лучшие места, варианты проживания и развлечения для незабываемой поездки по Тунису.',
    heroAlt: 'Местный туризм и услуги для экспатов в Тунисе',
    seoTitle: 'Туризм и услуги для экспатов в Тунисе | Dalil Tounes',
    expatTitle: 'Переезд и жизнь в Тунисе',
    expatIntro: 'Быстро найдите основные услуги для поездки, административных процедур и повседневной жизни.',
    quickLinks: ['Госуслуги', 'Здоровье', 'Образование', 'Работа'],
  },
};

const QUICK_LINK_PATHS = ['/citizens/services', '/citizens/health', '/education', '/emplois'] as const;

export default function CitizensTourism() {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const t = copy[lang];
  const isRTL = lang === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead
        title={t.seoTitle}
        description={t.intro}
        canonical="https://dalil-tounes.com/citizens/tourism"
        currentPath="/citizens/tourism"
      />
      <section className="relative w-full h-[280px] overflow-hidden">
        <img
          src={getSupabaseImageUrl('entreprise_banner.webp')}
          alt={t.heroAlt}
          className="absolute inset-0 w-full h-full object-cover"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D43]/80 via-[#4A1D43]/70 to-transparent" />

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
            <SearchBar
              scope="tourism"
              intentEnabled={false}
              enabled
              resultMode="redirectToResults"
              preferredTitle={t.preferredTitle}
              preferredSubtitle={t.preferredSubtitle}
            />
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="max-w-5xl mx-auto rounded-2xl border border-[#D4AF37]/50 bg-white px-5 py-5 shadow-sm">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#4A0404]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.expatTitle}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{t.expatIntro}</p>
          </div>
          <nav className="mt-4 flex flex-wrap justify-center gap-2" aria-label={t.expatTitle}>
            {QUICK_LINK_PATHS.map((path, index) => (
              <Link
                key={path}
                to={path}
                className="rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#4A0404] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                {t.quickLinks[index]}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <MeilleursSection
          secteurLabel={t.sector}
          listePage="tourisme local & expatriation"
          accentColor="#4A0404"
          sectionTitle={t.recommended}
          useGoogleRecommendationCriteria
          includeRecommendedInTotal={false}
          allReferencedLabel={t.allReferenced}
          searchOtherLabel={t.searchOther}
          searchQuery={t.searchQuery}
          blogArticle={{ title: t.articleTitle, excerpt: t.articleExcerpt, slug: 'guide-tourisme-tunisie' }}
        />
      </div>
    </div>
  );
}
