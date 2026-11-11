import { Link } from 'react-router-dom';
import { BriefcaseBusiness, Compass, Search, Users, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import SearchBar from './SearchBar';
import { useLanguage } from '../context/LanguageContext';

type Lang = 'fr' | 'ar' | 'en' | 'it' | 'ru';
const COPY: Record<Lang, {
  headline: string; intro: string; search: string; count: (n: string) => string;
  certified: (n: string) => string; citizens: string; citizensDetail: string;
  tourism: string; tourismDetail: string; businesses: string; businessesDetail: string;
  recommend: string; recommendDetail: string; review: string; certifiedHint: string;
  founder: string; founderDetail: string; founderAction: string;
  free: string; freeDetail: string; freeAction: string; more: string;
}> = {
  fr: {
    headline: 'La Tunisie à portée de main', intro: 'Trouvez une entreprise, un service ou une découverte près de chez vous.',
    search: 'Rechercher en Tunisie', count: n => `${n} fiches enregistrées`, certified: n => `${n} entreprises certifiées`,
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
    search: 'ابحث في تونس', count: n => `${n} مؤسسة مسجلة`, certified: n => `${n} مؤسسة موثّقة`,
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
    search: 'Search Tunisia', count: n => `${n} listed records`, certified: n => `${n} certified businesses`,
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
    search: 'Cerca in Tunisia', count: n => `${n} schede registrate`, certified: n => `${n} imprese certificate`,
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
    search: 'Поиск по Тунису', count: n => `${n} записей`, certified: n => `${n} сертифицированных компаний`,
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
  const universes = [
    { to: '/citizens', icon: Users, title: t.citizens, detail: t.citizensDetail },
    { to: '/citizens/tourism', icon: Compass, title: t.tourism, detail: t.tourismDetail },
    { to: '/subscription', icon: BriefcaseBusiness, title: t.businesses, detail: t.businessesDetail },
  ];
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
    {(totalCount || certifiedCount) && <div className="flex flex-wrap gap-x-4 gap-y-1 px-2 text-xs text-[#76616A]" aria-live="polite">
      {totalCount && <span>{t.count(totalCount)}</span>}
      {certifiedCount && <span>{t.certified(certifiedCount)}</span>}
    </div>}
    <nav className="space-y-2" aria-label={t.more}>
      {universes.map(({ to, icon: Icon, title, detail }) => <Link key={to} to={to}
        className="flex min-h-[76px] items-center gap-3 rounded-2xl border border-[#E4D6B8] bg-white p-3 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B99143]">
        <span className="rounded-xl bg-[#F8F0E1] p-2.5"><Icon className="h-6 w-6 text-[#A17D36]" strokeWidth={1.5} /></span>
        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[#45243A]">{title}</span>
          <span className="mt-1 block text-xs leading-4 text-[#766D71]">{detail}</span></span>
        <ArrowRight className="h-4 w-4 shrink-0 text-[#A17D36] rtl:rotate-180" />
      </Link>)}
    </nav>
    <section className="rounded-2xl border border-[#E4D6B8] bg-white p-4">
      <div className="flex items-center gap-2"><Search className="h-4 w-4 text-[#A17D36]" />
        <h2 className="font-serif text-base font-medium text-[#45243A]">{t.recommend}</h2></div>
      <p className="mt-2 text-sm leading-5 text-[#70656B]">{t.recommendDetail}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#725D42]">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#FBF5EA] px-2 py-1"><Star className="h-3 w-3" />{t.review}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#FBF5EA] px-2 py-1"><ShieldCheck className="h-3 w-3" />{t.certifiedHint}</span>
      </div>
      <Link to="/entreprises" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#45243A] underline decoration-[#B99143] underline-offset-4">{t.search}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
    </section>
    <section className="rounded-2xl border border-[#D4AF37]/40 bg-[#FFFCF7] p-4">
      <h2 className="font-serif text-lg font-medium text-[#45243A]">{t.founder}</h2>
      <p className="mt-2 text-sm leading-6 text-[#70656B]">{t.founderDetail}</p>
      <Link to="/pourquoi-dalil-tounes#histoire-fondateur" className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#45243A]">{t.founderAction}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
    </section>
    <section className="rounded-2xl bg-[#35172F] p-4 text-white">
      <h2 className="font-serif text-lg font-medium">{t.free}</h2>
      <p className="mt-2 text-sm text-white/85">{t.freeDetail}</p>
      <Link to="/subscription" className="mt-3 inline-flex min-h-11 items-center rounded-xl border border-[#D4AF37] px-4 text-sm font-semibold text-[#F1D783]">{t.freeAction}</Link>
    </section>
  </div>;
}
