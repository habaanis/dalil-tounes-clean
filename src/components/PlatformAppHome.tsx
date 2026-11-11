import { FounderStory } from './FounderStory';
import SearchBar from './SearchBar';
import { Building2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type Lang = 'fr' | 'ar' | 'en' | 'it' | 'ru';
const COPY: Record<Lang, {
  headline: string; intro: string; search: string; count: (n: string) => string;
  certified: (n: string) => string; discoverCopy: string; citizens: string; citizensDetail: string;
  tourism: string; tourismDetail: string; businesses: string; businessesDetail: string;
  recommend: string; recommendDetail: string; review: string; certifiedHint: string;
  founder: string; founderDetail: string; founderAction: string;
  free: string; freeDetail: string; freeAction: string; more: string;
}> = {
  fr: {
    headline: 'La Tunisie à portée de main', intro: 'Trouvez une entreprise, un service ou une découverte près de chez vous.',
    search: 'Rechercher en Tunisie', count: n => `Déjà ${n} fiches enregistrées.`, certified: n => `Dont ${n} établissements certifiés Dalil Tounes.`, discoverCopy: 'Découvrez les activités publiées sur Dalil Tounes.',
    citizens: 'Citoyens', citizensDetail: 'Santé, éducation, services et commerces',
    tourism: 'Tourisme & Expat', tourismDetail: 'Visites, régions et installation en Tunisie',
    businesses: 'Entreprises', businessesDetail: 'Présence gratuite et CV professionnels',
    recommend: 'Trouver des professionnels', recommendDetail: 'Explorez les entreprises selon les métiers, les villes et les avis.',
    review: 'Avis Google indépendants des offres', certifiedHint: 'CV Business ou Portfolio publié',
    founder: 'Pourquoi j’ai créé Dalil Tounes', founderDetail: 'Faire découvrir les bons professionnels, les services utiles et les richesses de toute la Tunisie.',
    founderAction: 'Découvrir mon histoire', free: 'Vous êtes professionnel ?', freeDetail: 'Faites connaître votre activité gratuitement ou découvrez les CV professionnels.',
    freeAction: 'Découvrir les offres', more: 'Tous les services',
  },
  ar: {
    headline: 'تونس الكل في يدك', intro: 'اكتشف مؤسسات وخدمات وأماكن في تونس.',
    search: 'ابحث في تونس', count: n => `تم تسجيل ${n} مؤسسة.`, certified: n => `من بينها ${n} مؤسسات موثّقة من دليل تونس.`, discoverCopy: 'اكتشف الأنشطة المنشورة على دليل تونس.',
    citizens: 'المواطنون', citizensDetail: 'الصحة والتعليم والخدمات والمحلات',
    tourism: 'السياحة والمقيمون', tourismDetail: 'جهات وزيارات وإقامة في تونس',
    businesses: 'المؤسسات', businessesDetail: 'حضور مجاني وسيرة مهنية رقمية',
    recommend: 'اكتشف المهنيين', recommendDetail: 'ابحث حسب المهنة والمدينة وتقييمات الحرفاء.',
    review: 'تقييمات Google مستقلة عن الاشتراك', certifiedHint: 'CV Business أو Portfolio منشور',
    founder: 'علاش عملت دليل تونس', founderDetail: 'باش نعرّف بالمهنيين والخدمات وثروات تونس الكل.',
    founderAction: 'اكتشف حكايتي', free: 'عندك مؤسسة؟', freeDetail: 'سجّل نشاطك مجانًا أو اكتشف العرض المهني.',
    freeAction: 'اكتشف العروض', more: 'كل الخدمات',
  },
  en: {
    headline: 'Tunisia at your fingertips', intro: 'Find businesses, services and local discoveries across Tunisia.',
    search: 'Search Tunisia', count: n => `Already ${n} businesses registered.`, certified: n => `Including ${n} Dalil Tounes certified businesses.`, discoverCopy: 'Explore the activities published on Dalil Tounes.',
    citizens: 'Citizens', citizensDetail: 'Health, education, services and shops',
    tourism: 'Travel & Expat', tourismDetail: 'Explore Tunisia and plan your stay',
    businesses: 'Businesses', businessesDetail: 'Free listing and professional CVs',
    recommend: 'Find professionals', recommendDetail: 'Explore by trade, town and customer reviews.',
    review: 'Google reviews independent of plans', certifiedHint: 'Published Business or Portfolio CV',
    founder: 'Why I created Dalil Tounes', founderDetail: 'Help people discover local professionals, useful services and every region.',
    founderAction: 'Read my story', free: 'Own a business?', freeDetail: 'List your business free or explore professional CVs.',
    freeAction: 'Explore plans', more: 'All services',
  },
  it: {
    headline: 'La Tunisia a portata di mano', intro: 'Trova imprese, servizi e luoghi da scoprire.',
    search: 'Cerca in Tunisia', count: n => `Già ${n} schede registrate.`, certified: n => `Di cui ${n} imprese certificate Dalil Tounes.`, discoverCopy: 'Scopri le attività pubblicate su Dalil Tounes.',
    citizens: 'Cittadini', citizensDetail: 'Salute, istruzione, servizi e negozi',
    tourism: 'Turismo & Expat', tourismDetail: 'Scopri il paese e organizza il soggiorno',
    businesses: 'Imprese', businessesDetail: 'Presenza gratuita e CV professionali',
    recommend: 'Trova professionisti', recommendDetail: 'Cerca per attività, città e recensioni.',
    review: 'Recensioni Google indipendenti dai piani', certifiedHint: 'CV Business o Portfolio pubblicato',
    founder: 'Perché ho creato Dalil Tounes', founderDetail: 'Far conoscere professionisti, servizi e regioni della Tunisia.',
    founderAction: 'Leggi la mia storia', free: 'Hai un’impresa?', freeDetail: 'Registra gratuitamente la tua attività o scopri i CV.',
    freeAction: 'Scopri le offerte', more: 'Tutti i servizi',
  },
  ru: {
    headline: 'Тунис под рукой', intro: 'Найдите компании, услуги и интересные места.',
    search: 'Поиск по Тунису', count: n => `Уже зарегистрировано ${n} организаций.`, certified: n => `Из них ${n} сертифицированы Dalil Tounes.`, discoverCopy: 'Откройте компании, опубликованные на Dalil Tounes.',
    citizens: 'Гражданам', citizensDetail: 'Здоровье, образование, услуги и магазины',
    tourism: 'Туризм и переезд', tourismDetail: 'Откройте Тунис и планируйте пребывание',
    businesses: 'Компаниям', businessesDetail: 'Бесплатная запись и профессиональные CV',
    recommend: 'Найти специалистов', recommendDetail: 'Поиск по профессии, городу и отзывам.',
    review: 'Отзывы Google не зависят от тарифа', certifiedHint: 'Опубликованный CV Business или Portfolio',
    founder: 'Почему я создал Dalil Tounes', founderDetail: 'Помогаем находить специалистов, услуги и открывать регионы страны.',
    founderAction: 'Моя история', free: 'У вас бизнес?', freeDetail: 'Добавьте компанию бесплатно или изучите CV.',
    freeAction: 'Узнать об услугах', more: 'Все услуги',
  },
};

export default function PlatformAppHome({ totalCount, certifiedCount }: {
  totalCount?: string | null; certifiedCount?: string | null;
}) {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as Lang;
  const t = COPY[lang];
  return <div className="space-y-4 px-3 py-4">
    <section className="rounded-2xl border border-[#D4AF37]/55 bg-gradient-to-br from-[#FFFCF7] to-[#F8F1E5] px-4 py-5">
      <p className="text-xs font-semibold tracking-wide text-[#9D7731]">🇹🇳 DALIL TOUNES</p>
      <h1 className="mt-2 font-serif text-2xl font-medium leading-tight text-[#35172F]">{t.headline}</h1>
      <p className="mt-2 text-sm leading-6 text-[#665565]">{t.intro}</p>
    </section>
    <section className="relative z-10 rounded-2xl border border-[#D4AF37]/40 bg-white p-3" aria-label={t.search}>
      <h2 className="mb-2 font-serif text-base font-medium text-[#35172F]">{t.search}</h2>
      <SearchBar scope="global" autoSearch resultMode="redirectToResults" />
    </section>
    <section aria-label={t.count(totalCount ?? '—')} className="rounded-xl border border-[#D8C59C] bg-[#FFFBF4] px-3 py-3 shadow-sm" aria-live="polite">
      <div className="flex items-start gap-2.5">
        <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#9A793E]" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5 text-[#45243A]">{totalCount === null || totalCount === undefined ? '—' : t.count(totalCount)}</p>
          <p className="mt-0.5 text-xs leading-5 text-[#756B70]">{t.discoverCopy}</p>
        </div>
      </div>
      {certifiedCount !== null && certifiedCount !== undefined && <div className="mt-2 flex items-start gap-2.5 border-t border-[#E6D9BD] pt-2">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#9A793E]" aria-hidden="true" />
        <p className="text-xs font-medium leading-5 text-[#594052]">{t.certified(certifiedCount)}</p>
      </div>}
    </section>

    <FounderStory compact />

  </div>;
}
