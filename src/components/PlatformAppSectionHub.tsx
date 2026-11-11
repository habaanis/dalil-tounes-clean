import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  { id: 'health', icon: '🩺', href: '/citizens/health' },
  { id: 'education', icon: '🎓', href: '/education' },
  { id: 'shops', icon: '🛍️', href: '/citizens/shops' },
  { id: 'jobs', icon: '💼', href: '/emplois' },
];

const PRO_LINKS: Entry[] = [
  { id: 'free', icon: '🆓', href: '/inscription-entreprise' },
  { id: 'cv', icon: '📱', href: '/cv-business' },
  { id: 'models', icon: '🎨', href: '/subscription?app-full=1#modeles' },
  { id: 'offers', icon: '💼', href: '/subscription?app-full=1#offres' },
  { id: 'partners', icon: '🤝', href: '/devenir-partenaire' },
];

const COPY: Record<Lang, {
  titles: Record<Hub, string>; intros: Record<Hub, string>;
  visit: string; settle: string; all: string; hint: string;
  topics: Record<string, string>;
}> = {
  fr: {
    titles: { citizens: 'De quoi avez-vous besoin ?', tourism: 'Découvrir la Tunisie', pros: 'Votre entreprise sur Dalil Tounes' },
    intros: { citizens: 'Choisissez directement un service.', tourism: 'Visitez la Tunisie ou préparez votre installation.', pros: 'Accédez directement à la démarche souhaitée.' },
    visit: 'Visiter & découvrir', settle: "S’installer & vivre en Tunisie", all: 'Afficher la page complète', hint: 'Les informations détaillées restent disponibles.',
    topics: { health: 'Santé', education: 'Éducation', services: 'Services citoyens', shops: 'Commerces & magasins', leisure: 'Loisirs & événements', jobs: 'Emploi',
      heritage: 'Villages & patrimoine', nature: 'Nature & randonnées', craft: 'Artisanat & savoir-faire', food: 'Saveurs & marchés', events: 'Culture & événements',
      stays: 'Séjours & expériences', settle: 'Guide expatriation & installation', free: 'Inscription gratuite', cv: 'CV Business & Portfolio', models: 'Voir les modèles', offers: 'Offres & tarifs', partners: 'Devenir partenaire' },
  },
  ar: {
    titles: { citizens: 'شنوة تحتاج اليوم؟', tourism: 'اكتشف تونس', pros: 'مؤسستك في دليل تونس' },
    intros: { citizens: 'اختار الخدمة مباشرة.', tourism: 'اكتشف الجهات أو حضّر إقامتك.', pros: 'اختار الخدمة اللي تحتاجها.' },
    visit: 'زيارة واكتشاف', settle: 'الإقامة والعيش في تونس', all: 'عرض الصفحة الكاملة', hint: 'التفاصيل الكاملة تبقى متوفرة.',
    topics: { health: 'الصحة', education: 'التعليم', services: 'خدمات المواطن', shops: 'المحلات والمتاجر', leisure: 'الترفيه والفعاليات', jobs: 'الشغل',
      heritage: 'القرى والتراث', nature: 'الطبيعة والمشي', craft: 'الحرف والمعارف', food: 'النكهات والأسواق', events: 'الثقافة والفعاليات',
      stays: 'الإقامات والتجارب', settle: 'دليل الإقامة والاستقرار', free: 'تسجيل مجاني', cv: 'CV Business وPortfolio', models: 'شوف النماذج', offers: 'العروض والأسعار', partners: 'كن شريك' },
  },
  en: {
    titles: { citizens: 'What do you need?', tourism: 'Explore Tunisia', pros: 'Your business on Dalil Tounes' },
    intros: { citizens: 'Go straight to a service.', tourism: 'Explore the country or prepare your move.', pros: 'Choose the service you need.' },
    visit: 'Explore & visit', settle: 'Move to & live in Tunisia', all: 'View the full page', hint: 'Full details remain available.',
    topics: { health: 'Health', education: 'Education', services: 'Citizen services', shops: 'Shops & stores', leisure: 'Leisure & events', jobs: 'Jobs',
      heritage: 'Villages & heritage', nature: 'Nature & hiking', craft: 'Crafts & skills', food: 'Food & markets', events: 'Culture & events',
      stays: 'Stays & experiences', settle: 'Moving & expat guide', free: 'Free business listing', cv: 'Business & Portfolio CV', models: 'Explore models', offers: 'Offers & pricing', partners: 'Become a partner' },
  },
  it: {
    titles: { citizens: 'Di cosa hai bisogno?', tourism: 'Scopri la Tunisia', pros: 'La tua impresa su Dalil Tounes' },
    intros: { citizens: 'Scegli direttamente un servizio.', tourism: 'Scopri il paese o prepara il trasferimento.', pros: 'Vai direttamente alla sezione desiderata.' },
    visit: 'Visitare & scoprire', settle: 'Vivere in Tunisia', all: 'Apri la pagina completa', hint: 'I dettagli sono sempre disponibili.',
    topics: { health: 'Salute', education: 'Istruzione', services: 'Servizi ai cittadini', shops: 'Negozi', leisure: 'Tempo libero & eventi', jobs: 'Lavoro',
      heritage: 'Borghi & patrimonio', nature: 'Natura & escursioni', craft: 'Artigianato', food: 'Sapori & mercati', events: 'Cultura & eventi',
      stays: 'Soggiorni & esperienze', settle: 'Guida al trasferimento', free: 'Iscrizione gratuita', cv: 'CV Business & Portfolio', models: 'Scopri i modelli', offers: 'Offerte & prezzi', partners: 'Diventa partner' },
  },
  ru: {
    titles: { citizens: 'Что вам нужно?', tourism: 'Откройте Тунис', pros: 'Ваш бизнес на Dalil Tounes' },
    intros: { citizens: 'Перейдите прямо к услуге.', tourism: 'Исследуйте страну или подготовьте переезд.', pros: 'Выберите нужный раздел.' },
    visit: 'Путешествия', settle: 'Переезд и жизнь в Тунисе', all: 'Вся страница', hint: 'Полная информация остаётся доступной.',
    topics: { health: 'Здоровье', education: 'Образование', services: 'Услуги гражданам', shops: 'Магазины', leisure: 'Отдых и события', jobs: 'Работа',
      heritage: 'Деревни и наследие', nature: 'Природа и походы', craft: 'Ремёсла', food: 'Еда и рынки', events: 'Культура и события',
      stays: 'Проживание и экскурсии', settle: 'Переезд и жизнь', free: 'Бесплатная регистрация', cv: 'CV Business & Portfolio', models: 'Модели', offers: 'Предложения и цены', partners: 'Стать партнёром' },
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
      className="flex min-h-[84px] flex-col items-start justify-between rounded-xl border border-[#E5D7BE] bg-white p-3 text-start shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B99143]">
      <span aria-hidden="true" className="text-xl leading-none">{item.icon}</span>
      <span className="mt-2 text-sm font-medium leading-5 text-[#45243A]">{topics[item.id]}</span>
    </Link>)}
  </div>;
}

export default function PlatformAppSectionHub({ kind }: { kind: Hub }) {
  const location = useLocation();
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as Lang;
  const copy = COPY[lang];
  const fullLink = { pathname: location.pathname, search: '?app-full=1' };

  return <div data-platform-app-hub={kind} className="space-y-4 px-3 py-4">
    <section className="rounded-2xl border border-[#D4AF37]/45 bg-[#FFF9EF] p-4">
      <h1 className="font-serif text-xl font-medium text-[#35172F]">{copy.titles[kind]}</h1>
      <p className="mt-2 text-sm leading-5 text-[#6A5B64]">{copy.intros[kind]}</p>
    </section>

    {kind === 'citizens' && <HubLinks items={CITIZEN_LINKS} topics={copy.topics} />}
    {kind === 'pros' && <HubLinks items={PRO_LINKS} topics={copy.topics} />}

    {kind === 'tourism' && <div className="space-y-3">
      <details className="group rounded-2xl border border-[#D4AF37]/45 bg-white p-3" open>
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

    <div className="rounded-xl border border-[#E5D7BE] bg-white px-3 py-3">
      <p className="text-xs text-[#776B71]">{copy.hint}</p>
      <Link to={fullLink} className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#45243A] underline decoration-[#B99143] underline-offset-4">
        {copy.all}<ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
      </Link>
    </div>
  </div>;
}
