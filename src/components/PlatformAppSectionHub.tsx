import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DALIL_MASCOT_IMAGE } from '../lib/dalilMascotImage';

type Lang = 'fr' | 'ar' | 'en' | 'it' | 'ru';
type Hub = 'citizens' | 'tourism' | 'pros';
type Entry = { id: string; icon: string; href: string };

const CITIZEN_LINKS: Entry[] = [
  { id: 'health', icon: '🩺', href: '/citizens/health' },
  { id: 'education', icon: '🎓', href: '/education' },
  { id: 'services', icon: '🏛️', href: '/citizens/services' },
  { id: 'shops', icon: '🛍️', href: '/citizens/shops' },
  { id: 'leisure', icon: '🎭', href: '/citizens/leisure' },
  { id: 'jobs', icon: '💼', href: '/emplois' },
];

const VISIT_LINKS: Entry[] = [
  { id: 'heritage', icon: '🏛️', href: '/citizens/tourism/guide/villages-patrimoine' },
  { id: 'nature', icon: '🌿', href: '/citizens/tourism/guide/nature-randonnees' },
  { id: 'craft', icon: '🧵', href: '/citizens/tourism/guide/artisanat-savoir-faire' },
  { id: 'food', icon: '🍽️', href: '/citizens/tourism/guide/marches-gastronomie' },
  { id: 'events', icon: '🎉', href: '/citizens/tourism/guide/fetes-evenements' },
  { id: 'stays', icon: '🏡', href: '/citizens/tourism/guide/hebergements-experiences' },
];

const SETTLE_LINKS: Entry[] = [
  { id: 'settle', icon: '🧭', href: '/citizens/tourism?app-full=1&tab=settle' },
  { id: 'housing', icon: '🏠', href: '/citizens/tourism?app-full=1&tab=settle&topic=1' },
  { id: 'residence', icon: '📄', href: '/citizens/tourism?app-full=1&tab=settle&topic=0' },
  { id: 'health', icon: '🩺', href: '/citizens/tourism?app-full=1&tab=settle&topic=2' },
  { id: 'education', icon: '🎓', href: '/citizens/tourism?app-full=1&tab=settle&topic=3' },
  { id: 'jobs', icon: '💼', href: '/citizens/tourism?app-full=1&tab=settle&topic=6' },
];

const PRO_LINKS: Entry[] = [
  { id: 'free', icon: '🆓', href: '/inscription-entreprise' },
  { id: 'cv', icon: '📱', href: '/subscription?app-full=1#cv-professionnels' },
  { id: 'models', icon: '🎨', href: '/subscription?app-full=1#modeles' },
  { id: 'offers', icon: '💼', href: '/subscription?app-full=1#offres' },
  { id: 'partners', icon: '🤝', href: '/devenir-partenaire' },
  { id: 'businessPartners', icon: '🔗', href: '/partner-search' },
  { id: 'businessNeeds', icon: '📦', href: '/besoins-professionnels' },
];

const COPY: Record<Lang, {
  titles: Record<Hub, string>; intros: Record<Hub, string>;
  visit: string; settle: string; all: string; hint: string; moreTopics: string;
  topics: Record<string, string>;
}> = {
  fr: {
    titles: { citizens: 'De quoi avez-vous besoin ?', tourism: 'Découvrir la Tunisie', pros: 'Votre entreprise sur Dalil Tounes' },
    intros: { citizens: 'Accédez aux services de santé, à l’éducation, aux démarches administratives et aux commerces. Sélectionnez la rubrique correspondant à votre besoin.', tourism: 'Explorez les régions, le patrimoine et les expériences locales, ou préparez votre installation : séjour, logement, santé, scolarité et travail.', pros: 'Présentez votre activité, proposez vos produits dans une boutique et fidélisez vos clients. Inscription gratuite et modèles de mini-applis à découvrir.' },
    visit: 'Visiter & découvrir', settle: "S’installer & vivre en Tunisie", moreTopics: 'Autres rubriques', all: 'Afficher la page complète', hint: 'Les informations détaillées restent disponibles.',
    topics: { housing: 'Logement & installation', residence: 'Séjour & résidence',  health: 'Santé', education: 'Éducation', services: 'Services citoyens', shops: 'Commerces & magasins', leisure: 'Loisirs & événements', jobs: 'Emploi',
      heritage: 'Villages & patrimoine', nature: 'Nature & randonnées', craft: 'Artisanat & savoir-faire', food: 'Saveurs & marchés', events: 'Culture & événements',
      stays: 'Séjours & expériences', settle: 'Guide expatriation & installation', free: 'Inscription gratuite', cv: 'Votre mini-appli professionnelle', models: 'Voir les modèles', offers: 'Tarifs et inscription', partners: 'Devenir partenaire', businessPartners: 'Réseau professionnel', businessNeeds: 'Besoins professionnels' },
  },
  ar: {
    titles: { citizens: 'شنوة تحتاج اليوم؟', tourism: 'اكتشف تونس', pros: 'مؤسستك في دليل تونس' },
    intros: { citizens: 'تعرّف على خدمات الصحة والتعليم والإجراءات الإدارية والمحلات. اختر القسم المناسب لحاجتك.', tourism: 'اكتشف الجهات والتراث والتجارب المحلية، أو حضّر إقامتك: السكن والصحة والدراسة والعمل.', pros: 'سجّل مؤسستك مجاناً، وأنشئ تطبيقك المصغّر المهني، واكتشف النماذج والعروض المتوفرة.' },
    visit: 'زيارة واكتشاف', settle: 'الإقامة والعيش في تونس', moreTopics: 'أقسام أخرى', all: 'عرض الصفحة الكاملة', hint: 'التفاصيل الكاملة تبقى متوفرة.',
    topics: { housing: 'السكن والاستقرار', residence: 'الإقامة والتصاريح',  health: 'الصحة', education: 'التعليم', services: 'خدمات المواطن', shops: 'المحلات والمتاجر', leisure: 'الترفيه والفعاليات', jobs: 'الشغل',
      heritage: 'القرى والتراث', nature: 'الطبيعة والمشي', craft: 'الحرف والمعارف', food: 'النكهات والأسواق', events: 'الثقافة والفعاليات',
      stays: 'الإقامات والتجارب', settle: 'دليل الإقامة والاستقرار', free: 'تسجيل مجاني', cv: 'تطبيقك المصغّر المهني', models: 'شوف النماذج', offers: 'الأسعار والتسجيل', partners: 'كن شريك', businessPartners: 'شبكة المهنيين', businessNeeds: 'احتياجات المؤسسات' },
  },
  en: {
    titles: { citizens: 'What do you need?', tourism: 'Explore Tunisia', pros: 'Your business on Dalil Tounes' },
    intros: { citizens: 'Find health, education, administrative services and local shops. Choose the section you need.', tourism: 'Explore regions, heritage and local experiences, or prepare your move: housing, health, school and work.', pros: 'List your business for free, present it with a Business or Portfolio CV, and explore available designs and offers.' },
    visit: 'Explore & visit', settle: 'Move to & live in Tunisia', moreTopics: 'More topics', all: 'View the full page', hint: 'Full details remain available.',
    topics: { housing: 'Housing & settling in', residence: 'Stay & residence',  health: 'Health', education: 'Education', services: 'Citizen services', shops: 'Shops & stores', leisure: 'Leisure & events', jobs: 'Jobs',
      heritage: 'Villages & heritage', nature: 'Nature & hiking', craft: 'Crafts & skills', food: 'Food & markets', events: 'Culture & events',
      stays: 'Stays & experiences', settle: 'Moving & expat guide', free: 'Free business listing', cv: 'Your business mini-app', models: 'Explore models', offers: 'Pricing and registration', partners: 'Become a partner', businessPartners: 'Business network', businessNeeds: 'Business needs' },
  },
  it: {
    titles: { citizens: 'Di cosa hai bisogno?', tourism: 'Scopri la Tunisia', pros: 'La tua impresa su Dalil Tounes' },
    intros: { citizens: 'Trova sanità, istruzione, servizi amministrativi e negozi. Seleziona la sezione che ti serve.', tourism: 'Esplora regioni, patrimonio ed esperienze locali, oppure prepara il trasferimento: alloggio, salute, scuola e lavoro.', pros: 'Registra gratuitamente la tua attività, crea la tua mini-app professionale e scopri modelli e offerte.' },
    visit: 'Visitare & scoprire', settle: 'Vivere in Tunisia', moreTopics: 'Altre sezioni', all: 'Apri la pagina completa', hint: 'I dettagli sono sempre disponibili.',
    topics: { housing: 'Casa e sistemazione', residence: 'Soggiorno e residenza',  health: 'Salute', education: 'Istruzione', services: 'Servizi ai cittadini', shops: 'Negozi', leisure: 'Tempo libero & eventi', jobs: 'Lavoro',
      heritage: 'Borghi & patrimonio', nature: 'Natura & escursioni', craft: 'Artigianato', food: 'Sapori & mercati', events: 'Cultura & eventi',
      stays: 'Soggiorni & esperienze', settle: 'Guida al trasferimento', free: 'Iscrizione gratuita', cv: 'La tua mini-app professionale', models: 'Scopri i modelli', offers: 'Tariffe e iscrizione', partners: 'Diventa partner', businessPartners: 'Rete professionale', businessNeeds: 'Esigenze professionali' },
  },
  ru: {
    titles: { citizens: 'Что вам нужно?', tourism: 'Откройте Тунис', pros: 'Ваш бизнес на Dalil Tounes' },
    intros: { citizens: 'Найдите медицинские, образовательные, административные услуги и магазины. Выберите нужный раздел.', tourism: 'Исследуйте регионы, наследие и местные впечатления или подготовьте переезд: жильё, здоровье, учёба и работа.', pros: 'Зарегистрируйте компанию бесплатно, представьте её через Business или Portfolio CV и изучите модели и предложения.' },
    visit: 'Путешествия', settle: 'Переезд и жизнь в Тунисе', moreTopics: 'Другие разделы', all: 'Вся страница', hint: 'Полная информация остаётся доступной.',
    topics: { housing: 'Жильё и переезд', residence: 'Проживание и ВНЖ',  health: 'Здоровье', education: 'Образование', services: 'Услуги гражданам', shops: 'Магазины', leisure: 'Отдых и события', jobs: 'Работа',
      heritage: 'Деревни и наследие', nature: 'Природа и походы', craft: 'Ремёсла', food: 'Еда и рынки', events: 'Культура и события',
      stays: 'Проживание и экскурсии', settle: 'Переезд и жизнь', free: 'Бесплатная регистрация', cv: 'Мини-приложение для бизнеса', models: 'Модели', offers: 'Цены и регистрация', partners: 'Стать партнёром', businessPartners: 'Партнёрская сеть', businessNeeds: 'Запросы компаний' },
  },
};

export function getPlatformHub(pathname: string): Hub | null {
  if (pathname === '/citizens') return 'citizens';
  if (pathname === '/citizens/tourism' || pathname === '/citizens/tourisme') return 'tourism';
  if (pathname === '/subscription') return 'pros';
  return null;
}

function HubLinks({ items, topics }: { items: Entry[]; topics: Record<string, string> }) {
  return <div className="grid grid-cols-2 gap-2">
    {items.map(item => <Link key={item.id + item.href} to={item.href}
      className="flex min-h-[74px] flex-col items-start justify-between rounded-xl border border-[#E5D7BE] bg-white p-3 text-start shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B99143]">
      <span aria-hidden="true" className="text-xl leading-none">{item.icon}</span>
      <span className="mt-2 text-sm font-medium leading-5 text-[#45243A]">{topics[item.id]}</span>
    </Link>)}
  </div>;
}

export default function PlatformAppSectionHub({ kind }: { kind: Hub }) {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as Lang;
  const copy = COPY[lang];
  // Descriptions très courtes : toutes les cartes naviguent directement, sans panneau intermédiaire.
  const proSummaries: Record<Lang, Record<string, string>> = {
    fr: {
      free: 'Référencez gratuitement votre activité.',
      cv: 'Découvrez votre vitrine et ses fonctionnalités.',
      models: 'Comparez Business et Portfolio.',
      offers: 'Formules, tarifs et conditions.',
      partners: 'Recommandez Dalil Tounes.',
      businessPartners: 'Trouvez des partenaires professionnels.',
      businessNeeds: 'Consultez les demandes des professionnels.',
    },
    ar: {
      free: 'سجّل نشاطك مجاناً.',
      cv: 'اكتشف تطبيقك المصغّر ومميزاته.',
      models: 'قارن بين Business وPortfolio.',
      offers: 'العروض والأسعار والشروط.',
      partners: 'ساهم في التعريف بدليل تونس.',
      businessPartners: 'ابحث عن شركاء مهنيين.',
      businessNeeds: 'اطّلع على طلبات المهنيين.',
    },
    en: {
      free: 'List your business for free.',
      cv: 'Explore your mini-app and its features.',
      models: 'Compare Business and Portfolio.',
      offers: 'Plans, pricing and conditions.',
      partners: 'Recommend Dalil Tounes.',
      businessPartners: 'Find professional partners.',
      businessNeeds: 'Browse professional requests.',
    },
    it: {
      free: 'Registra gratuitamente la tua attività.',
      cv: 'Scopri la tua mini-app.',
      models: 'Confronta Business e Portfolio.',
      offers: 'Offerte, prezzi e condizioni.',
      partners: 'Consiglia Dalil Tounes.',
      businessPartners: 'Trova partner professionali.',
      businessNeeds: 'Consulta le richieste professionali.',
    },
    ru: {
      free: 'Добавьте компанию бесплатно.',
      cv: 'Посмотрите мини-приложение и функции.',
      models: 'Сравните Business и Portfolio.',
      offers: 'Тарифы, цены и условия.',
      partners: 'Рекомендуйте Dalil Tounes.',
      businessPartners: 'Найдите деловых партнёров.',
      businessNeeds: 'Посмотрите запросы специалистов.',
    },
  };
  const prosActions = PRO_LINKS.filter(item => item.id === 'free' || item.id === 'cv');
  const prosExtras = PRO_LINKS.filter(item => item.id !== 'free' && item.id !== 'cv');
  const renderProCards = (items: Entry[]) => <div className="grid grid-cols-2 gap-2">
    {items.map(item => (
      <a key={item.id} href={item.href}
        className="flex min-h-[96px] flex-col items-start rounded-xl border border-[#E5D7BE] bg-white p-3 text-start shadow-sm transition-colors hover:border-[#B99143] hover:bg-[#FFF9EF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B99143]">
        <span aria-hidden="true" className="text-xl leading-none">{item.icon}</span>
        <span className="mt-2 text-sm font-semibold leading-5 text-[#45243A]">{copy.topics[item.id]}</span>
        <span className="mt-1 text-xs leading-4 text-[#6A5B64]">{proSummaries[lang][item.id]}</span>
      </a>
    ))}
  </div>;

  return <div data-platform-app-hub={kind} className="space-y-4 px-3 py-4">
    <section className="flex items-center gap-3 rounded-2xl border border-[#D4AF37]/45 bg-[#FFF9EF] p-3">
      <div className="min-w-0 flex-1">
        <h1 className="font-serif text-xl font-medium text-[#35172F]">{copy.titles[kind]}</h1>
        <p className="mt-1 text-xs leading-5 text-[#6A5B64]">{copy.intros[kind]}</p>
      </div>
      <img src={DALIL_MASCOT_IMAGE} alt="" aria-hidden="true" decoding="async" loading="lazy"
        className="h-[76px] w-[70px] shrink-0 rounded-xl bg-white object-contain" />
    </section>

    {kind === 'citizens' && <div className="space-y-3">
      <HubLinks items={CITIZEN_LINKS} topics={copy.topics} />
    </div>}
    {kind === 'pros' && <>
      <section aria-label={lang === 'fr' ? 'Les avantages de votre mini-appli' : 'Business mini-app benefits'} className="rounded-2xl border border-[#D4AF37]/45 bg-[#FFFCF7] p-3">
        <h2 className="font-serif text-lg font-semibold leading-6 text-[#35172F]">
          {lang === 'fr' ? 'Présenter, vendre et fidéliser' : lang === 'ar' ? 'اعرض، بيع وحافظ على حرفائك' : lang === 'it' ? 'Presenta, vendi e fidelizza' : lang === 'ru' ? 'Рассказывайте, продавайте и удерживайте клиентов' : 'Showcase, sell and build loyalty'}
        </h2>
        <p className="mt-1 text-xs leading-5 text-[#6A5B64]">
          {lang === 'fr' ? 'Une mini-appli à partager par lien ou QR Business, pour faciliter les ventes et les échanges avec vos clients.' : lang === 'ar' ? 'تطبيق مصغّر تشاركه برابط أو رمز QR لتسهيل الطلبات والتواصل مع الحرفاء.' : 'A shareable mini-app with a link or Business QR code to simplify orders and customer relations.'}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {([
            { icon: '📱', title: lang === 'fr' ? 'Présenter' : lang === 'ar' ? 'التعريف' : 'Showcase', detail: lang === 'fr' ? 'CV Business, Portfolio, photos et QR Business' : lang === 'ar' ? 'عرض الأعمال والصور ورمز QR' : 'Business CV, Portfolio, photos and QR' },
            { icon: '🛍️', title: lang === 'fr' ? 'Vendre' : lang === 'ar' ? 'البيع' : 'Sell', detail: lang === 'fr' ? 'Boutique, catalogue, commandes et devis' : lang === 'ar' ? 'متجر، منتجات، طلبات وعروض أسعار' : 'Shop, catalogue, orders and quotes' },
            { icon: '🎁', title: lang === 'fr' ? 'Fidéliser' : lang === 'ar' ? 'الوفاء' : 'Loyalty', detail: lang === 'fr' ? 'Cartes de fidélité, cadeaux et offres selon activation' : lang === 'ar' ? 'بطاقات وفاء وهدايا وعروض حسب التفعيل' : 'Loyalty, gift cards and offers when enabled' },
            { icon: '📋', title: lang === 'fr' ? 'Suivre' : lang === 'ar' ? 'المتابعة' : 'Track', detail: lang === 'fr' ? 'Demandes suivies par le client et le professionnel' : lang === 'ar' ? 'متابعة الطلبات للحريف والمهني' : 'Customer and professional order tracking' },
          ] as const).map(item => (
            <div key={item.title} className="rounded-xl border border-[#E5D7BE] bg-[#FCFAF6] p-3">
              <span className="text-xl" aria-hidden="true">{item.icon}</span>
              <h3 className="mt-1 text-sm font-semibold text-[#35172F]">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#6A5B64]">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
      {renderProCards(prosActions)}
      <details className="group rounded-2xl border border-[#D4AF37]/40 bg-white p-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-1 font-medium text-[#45243A] [&::-webkit-details-marker]:hidden">
          {copy.moreTopics}<ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-[#A17D36] transition-transform group-open:rotate-180" />
        </summary>
        <div className="pt-2">{renderProCards(prosExtras)}</div>
      </details>
    </>}

    {kind === 'tourism' && <div className="space-y-3">
      <details className="group rounded-2xl border border-[#D4AF37]/45 bg-white p-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-1 font-medium text-[#45243A] [&::-webkit-details-marker]:hidden">
          <span>{copy.visit}</span><ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-[#A17D36] transition-transform group-open:rotate-180" />
        </summary>
        <div className="pt-2"><HubLinks items={VISIT_LINKS} topics={copy.topics} /></div>
      </details>
      <details className="group rounded-2xl border border-[#D4AF37]/45 bg-white p-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-1 font-medium text-[#45243A] [&::-webkit-details-marker]:hidden">
          <span>{copy.settle}</span><ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-[#A17D36] transition-transform group-open:rotate-180" />
        </summary>
        <div className="pt-2"><HubLinks items={SETTLE_LINKS} topics={copy.topics} /></div>
      </details>
    </div>}


  </div>;
}
