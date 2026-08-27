import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { scrollToWithOffsetDelayed } from '../lib/scrollUtils';
import MeilleursSection from '../components/MeilleursSection';
import { useLanguage } from '../context/LanguageContext';
import SearchBar from '../components/SearchBar';
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
  seoTitle: string;
  offerText: string;
  offerButton: string;
}> = {
  fr: {
    title: 'Commerces & Magasins',
    intro: "Votre guide des commerces de proximité en Tunisie. Trouvez un magasin, consultez ses horaires, sa localisation, ses avis et ses coordonnées. Achetez local et soutenez l'économie tunisienne.",
    slogan: 'Vous êtes présent, mais êtes-vous trouvable ?',
    sector: 'commerces',
    recommended: 'Entreprises les plus recommandées par les clients',
    preferredTitle: 'Les commerces préférés de vos voisins',
    preferredSubtitle: 'Les commerces qui ont gagné la confiance des habitants',
    allReferenced: 'Tous les commerces référencés',
    searchOther: "Rechercher d'autres commerces",
    seoTitle: 'Commerces et magasins en Tunisie | Dalil Tounes',
    offerText: 'Découvrez nos offres • Artisan & Premium • Développez votre visibilité',
    offerButton: 'Voir nos offres',
  },
  ar: {
    title: 'المحلات والمتاجر',
    intro: 'دليلك إلى المتاجر القريبة في تونس. اعثر على متجر، واطّلع على توقيته وموقعه وآراء حرفائه وبيانات الاتصال به. اشترِ محلياً وادعم الاقتصاد التونسي.',
    slogan: 'أنت موجود، لكن هل يمكن العثور عليك؟',
    sector: 'محلات',
    recommended: 'المؤسسات الأكثر توصية من قبل العملاء',
    preferredTitle: 'المحلات المفضلة لدى جيرانك',
    preferredSubtitle: 'المحلات التي كسبت ثقة السكان',
    allReferenced: 'جميع المحلات المسجلة',
    searchOther: 'البحث عن محلات أخرى',
    seoTitle: 'المحلات والمتاجر في تونس | دليل تونس',
    offerText: 'اكتشف عروضنا • Artisan وPremium • عزّز ظهور نشاطك',
    offerButton: 'اطّلع على عروضنا',
  },
  en: {
    title: 'Shops & Stores',
    intro: 'Your guide to local shops in Tunisia. Find a shop and check its opening hours, location, reviews and contact details. Buy local and support the Tunisian economy.',
    slogan: 'You are present, but can you be found?',
    sector: 'shops',
    recommended: 'Most recommended businesses by customers',
    preferredTitle: "Your neighbors' favorite shops",
    preferredSubtitle: 'Shops that have earned the trust of local residents',
    allReferenced: 'All listed shops',
    searchOther: 'Search other shops',
    seoTitle: 'Shops and stores in Tunisia | Dalil Tounes',
    offerText: 'Discover our offers • Artisan & Premium • Grow your visibility',
    offerButton: 'See our offers',
  },
  it: {
    title: 'Negozi e Commerci',
    intro: "La tua guida ai negozi di prossimità in Tunisia. Trova un negozio e consulta orari, posizione, recensioni e contatti. Compra locale e sostieni l'economia tunisina.",
    slogan: 'Sei presente, ma sei trovabile?',
    sector: 'commerci',
    recommended: 'Aziende più raccomandate dai clienti',
    preferredTitle: 'I negozi preferiti dai tuoi vicini',
    preferredSubtitle: 'I negozi che hanno conquistato la fiducia dei residenti',
    allReferenced: 'Tutti i negozi registrati',
    searchOther: 'Cerca altri negozi',
    seoTitle: 'Negozi e commerci in Tunisia | Dalil Tounes',
    offerText: 'Scopri le nostre offerte • Artisan & Premium • Aumenta la tua visibilità',
    offerButton: 'Vedi le nostre offerte',
  },
  ru: {
    title: 'Магазины и торговые точки',
    intro: 'Ваш гид по местным магазинам Туниса. Найдите магазин и проверьте часы работы, адрес, отзывы и контактные данные. Покупайте местное и поддерживайте экономику Туниса.',
    slogan: 'Вы представлены в интернете, но легко ли вас найти?',
    sector: 'магазины',
    recommended: 'Компании, которые чаще всего рекомендуют клиенты',
    preferredTitle: 'Любимые магазины ваших соседей',
    preferredSubtitle: 'Магазины, заслужившие доверие местных жителей',
    allReferenced: 'Все зарегистрированные магазины',
    searchOther: 'Найти другие магазины',
    seoTitle: 'Магазины и торговые точки в Тунисе | Dalil Tounes',
    offerText: 'Откройте наши предложения • Artisan и Premium • Сделайте вашу компанию заметнее',
    offerButton: 'Посмотреть предложения',
  },
};

interface CitizensShopsProps {
  onNavigate?: (page: 'subscription') => void;
}

export default function CitizensShops({ onNavigate }: CitizensShopsProps = {}) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const t = copy[lang];
  const isRTL = lang === 'ar';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead
        title={t.seoTitle}
        description={t.intro}
        canonical="https://dalil-tounes.com/citizens/shops"
        currentPath="/citizens/shops"
      />
      <section
        className="relative w-full overflow-hidden rounded-b-2xl shadow-md h-[300px] bg-cover"
        style={{
          backgroundImage: 'linear-gradient(to top, rgba(74, 29, 67, 0.8), rgba(74, 29, 67, 0.3), transparent), url(/images/cat_magasin.jpg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%'
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2 drop-shadow-lg text-[#D4AF37]">{t.title}</h1>
          <p className="text-sm md:text-base font-light text-white/95 max-w-3xl leading-relaxed drop-shadow-lg">{t.intro}</p>
        </div>
      </section>

      <section className="py-6 px-4 relative z-[9999]" style={{ overflow: 'visible' }}>
        <div className="max-w-5xl mx-auto" style={{ overflow: 'visible' }}>
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#D4AF37] p-2.5 md:p-3" style={{ overflow: 'visible' }}>
            <SearchBar
              scope="magasin"
              intentEnabled={false}
              enabled
              resultMode="redirectToResults"
              preferredTitle={t.preferredTitle}
              preferredSubtitle={t.preferredSubtitle}
            />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="py-8">
          <MeilleursSection
            secteurLabel={t.sector}
            listePage="commerces & magasins"
            accentColor="#4A0404"
            sectionTitle={t.recommended}
            useGoogleRecommendationCriteria
            includeRecommendedInTotal={false}
            allReferencedLabel={t.allReferenced}
            searchOtherLabel={t.searchOther}
          />
        </div>

        <div className="mt-10 relative overflow-hidden rounded-xl border border-[#D4AF37] shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A0404] via-[#8B0000] to-[#4A0404]/60" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 p-5">
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="text-lg font-bold text-white mb-1 drop-shadow" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.slogan}</h3>
              <p className="text-sm text-white/90 font-light leading-snug">{t.offerText}</p>
            </div>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('subscription');
                else navigate('/subscription');
                scrollToWithOffsetDelayed('form-inscription-entreprise', 100, 300);
              }}
              className="flex items-center gap-2 bg-white text-[#4A0404] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-white hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap shadow-md text-sm"
            >
              {t.offerButton}
              <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
