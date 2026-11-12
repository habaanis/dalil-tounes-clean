import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Compass, Facebook, Home, Instagram, Menu, MessageCircle, Phone, Search, Users, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import PlatformAppSectionHub, { getPlatformHub } from './PlatformAppSectionHub';
import PlatformAppIntro from './PlatformAppIntro';

type AppLang = 'fr' | 'ar' | 'en' | 'it' | 'ru';
const APP_COPY: Record<AppLang, {
  home: string; search: string; citizens: string; discover: string; pros: string;
  more: string; menu: string; close: string; back: string; jobs: string; events: string;
  partners: string; blog: string; contact: string;
}> = {
  fr: { home: 'Accueil', search: 'Chercher', citizens: 'Citoyens', discover: 'Tourisme & Expat', pros: 'Pros',
    more: 'Plus de rubriques', menu: 'Ouvrir le menu', close: 'Fermer le menu', back: 'Retour', jobs: 'Emploi',
    events: 'Événements', partners: 'Partenaires', blog: 'Guides & articles', contact: 'Contact' },
  ar: { home: 'الرئيسية', search: 'بحث', citizens: 'مواطنون', discover: 'سياحة ومقيمون', pros: 'مهنيون',
    more: 'أقسام أخرى', menu: 'فتح القائمة', close: 'إغلاق القائمة', back: 'رجوع', jobs: 'الشغل',
    events: 'الفعاليات', partners: 'الشركاء', blog: 'مقالات وأدلة', contact: 'اتصل بنا' },
  en: { home: 'Home', search: 'Search', citizens: 'Citizens', discover: 'Tourism & Expat', pros: 'Business',
    more: 'More sections', menu: 'Open menu', close: 'Close menu', back: 'Back', jobs: 'Jobs',
    events: 'Events', partners: 'Partners', blog: 'Guides & articles', contact: 'Contact' },
  it: { home: 'Home', search: 'Cerca', citizens: 'Cittadini', discover: 'Turismo & Expat', pros: 'Imprese',
    more: 'Altre sezioni', menu: 'Apri menu', close: 'Chiudi menu', back: 'Indietro', jobs: 'Lavoro',
    events: 'Eventi', partners: 'Partner', blog: 'Guide e articoli', contact: 'Contatti' },
  ru: { home: 'Главная', search: 'Поиск', citizens: 'Граждане', discover: 'Туризм & экспат', pros: 'Бизнес',
    more: 'Другие разделы', menu: 'Открыть меню', close: 'Закрыть меню', back: 'Назад', jobs: 'Работа',
    events: 'События', partners: 'Партнёры', blog: 'Статьи и гиды', contact: 'Контакты' },
};

const HELP_COPY: Record<AppLang, {
  heading: string; choose: string; french: string; tunisian: string;
  scope: string; exclusion: string; call: string;
}> = {
  fr: {
    heading: 'Besoin d’aide sur Dalil Tounes ?', choose: 'Appeler notre équipe',
    french: 'En français · Anis', tunisian: 'En tunisien · Azziz',
    scope: 'Inscriptions, CV Business / Portfolio et fonctionnement de Dalil Tounes.',
    exclusion: 'Pour les adresses et horaires des établissements, consultez directement leurs fiches.',
    call: 'Appeler',
  },
  ar: {
    heading: 'تحتاج مساعدة في دليل تونس؟', choose: 'اتصل بفريقنا',
    french: 'بالفرنسية · أنيس', tunisian: 'بالتونسي · عزيز',
    scope: 'لترسيم المؤسسات، CV Business / Portfolio وكيفاش تستعمل دليل تونس.',
    exclusion: 'لعناوين وأوقات خدمة المؤسسات، شوف بطاقاتهم مباشرة.',
    call: 'اتصل',
  },
  en: {
    heading: 'Need help with Dalil Tounes?', choose: 'Call our team',
    french: 'French-speaking · Anis', tunisian: 'Tunisian Arabic · Azziz',
    scope: 'Business registration, Business / Portfolio CVs and using Dalil Tounes.',
    exclusion: 'For business addresses and opening hours, check the business listing itself.',
    call: 'Call',
  },
  it: {
    heading: 'Serve aiuto con Dalil Tounes?', choose: 'Chiama il nostro team',
    french: 'In francese · Anis', tunisian: 'In tunisino · Azziz',
    scope: 'Registrazioni, CV Business / Portfolio e utilizzo di Dalil Tounes.',
    exclusion: 'Per indirizzi e orari delle attività, consulta direttamente le loro schede.',
    call: 'Chiama',
  },
  ru: {
    heading: 'Нужна помощь с Dalil Tounes?', choose: 'Позвонить команде',
    french: 'На французском · Анис', tunisian: 'На тунисском арабском · Азиз',
    scope: 'Регистрация компаний, CV Business / Portfolio и работа с Dalil Tounes.',
    exclusion: 'Адреса и часы работы компаний смотрите в их карточках.',
    call: 'Позвонить',
  },
};

export default function PlatformAppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as AppLang;
  const copy = APP_COPY[lang];
  const helpCopy = HELP_COPY[lang];
  const rtl = lang === 'ar';
  const hub = getPlatformHub(location.pathname);
  const useCompactHub = hub !== null && new URLSearchParams(location.search).get('app-full') !== '1';
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);
  useEffect(() => {
    if (useCompactHub) window.scrollTo({ top: 0, left: 0 });
  }, [useCompactHub, location.pathname]);

  const tabs = [
    { label: copy.home, to: '/', icon: Home, active: location.pathname === '/' },
    { label: copy.search, to: '/entreprises', icon: Search, active: /^\/(entreprises|businesses|recherche)(?:\/|$)/.test(location.pathname) },
    { label: copy.citizens, to: '/citizens', icon: Users, active: /^\/citizens(?:\/|$)/.test(location.pathname) && !/^\/citizens\/tourism(?:\/|$)/.test(location.pathname) },
    { label: copy.discover, to: '/citizens/tourism', icon: Compass, active: /^\/citizens\/tourism(?:\/|$)/.test(location.pathname) },
    { label: copy.pros, to: '/subscription', icon: Building2, active: /^\/(subscription|cv-business|inscription-entreprise|abonnement)(?:\/|$)/.test(location.pathname) },
  ];

  const extra = [
    { label: copy.jobs, to: '/emplois' },
    { label: copy.events, to: '/citizens/leisure' },
    { label: copy.partners, to: '/devenir-partenaire' },
    { label: copy.blog, to: '/blog' },
    { label: copy.contact, to: '/contact' },
  ];

  return (
    <div data-platform-app-shell className="min-h-screen bg-[#FFFCF7] text-[#35172F]" dir={rtl ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-50 border-b border-[#D4AF37]/40 bg-[#FFFCF7]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-xl items-center justify-between gap-2 px-3">
          <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B99143]" aria-label="Dalil Tounes">
            <span aria-hidden="true" className="text-xl">🇹🇳</span>
            <span className="font-serif text-base font-semibold tracking-wide text-[#45243A]">Dalil Tounes</span>
          </Link>
          <div className="flex items-center gap-1">
            <LanguageSelector />
            <button type="button" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen}
              aria-controls="dalil-platform-app-more" aria-label={menuOpen ? copy.close : copy.menu}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4D6B8] bg-white text-[#45243A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B99143]">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {menuOpen && <nav id="dalil-platform-app-more" aria-label={copy.more} className="mx-auto max-w-xl border-t border-[#E4D6B8] bg-white px-3 py-2">
          <div className="grid grid-cols-2 gap-2">
            {extra.map(item => <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
              className="flex min-h-11 items-center rounded-xl border border-[#E4D6B8] px-3 text-sm font-medium text-[#45243A]">{item.label}</Link>)}
          </div>
        </nav>}
      </header>

      {location.pathname === '/' && <div aria-label="Réseaux sociaux Dalil Tounes" className="mx-auto flex max-w-xl items-center justify-end gap-2 px-3 pt-2">
        <a href="https://www.facebook.com/daliltounes/" target="_blank" rel="noopener noreferrer"
          aria-label="Facebook Dalil Tounes (nouvel onglet)"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/45 bg-white text-[#4A1D43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A17D36]">
          <Facebook aria-hidden="true" className="h-4 w-4" />
        </a>
        <a href="https://www.instagram.com/dalil.tounes/" target="_blank" rel="noopener noreferrer"
          aria-label="Instagram Dalil Tounes (nouvel onglet)"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/45 bg-white text-[#4A1D43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A17D36]">
          <Instagram aria-hidden="true" className="h-4 w-4" />
        </a>
        <a href="https://wa.me/21627642252" target="_blank" rel="noopener noreferrer"
          aria-label="WhatsApp Dalil Tounes (nouvel onglet)"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/45 bg-white text-[#4A1D43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A17D36]">
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>}

      {location.pathname === '/' && <div className="mx-auto max-w-xl px-3 pt-2">
        <details className="group rounded-xl border border-[#D4AF37]/40 bg-white px-3 py-2">
          <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-2 text-xs font-semibold text-[#45243A] [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-[#A17D36]" aria-hidden="true" />{helpCopy.heading}</span>
            <span className="inline-flex items-center gap-1 text-[#8B6C35]">{helpCopy.choose}<span className="text-base group-open:rotate-180" aria-hidden="true">⌄</span></span>
          </summary>
          <div className="mt-2 space-y-2 border-t border-[#E8DCC4] pt-3">
            <p className="text-xs leading-5 text-[#655661]">{helpCopy.scope}</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { label: helpCopy.french, phone: '+216 27 642 252', href: 'tel:+21627642252' },
                { label: helpCopy.tunisian, phone: '+216 24 225 585', href: 'tel:+21624225585' },
              ]).map(item => (
                <a key={item.href} href={item.href}
                  className="flex min-h-[78px] flex-col justify-center gap-1 rounded-xl border border-[#D4AF37]/50 bg-[#FFFAF0] px-2 py-2 text-center text-[#45243A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A17D36]"
                  aria-label={`${helpCopy.call} — ${item.label} : ${item.phone}`}>
                  <span className="text-[11px] font-medium leading-4">{item.label}</span>
                  <span className="text-xs font-semibold tabular-nums" dir="ltr">{item.phone}</span>
                </a>
              ))}
            </div>
            <p className="text-[11px] leading-5 text-[#756971]">{helpCopy.exclusion}</p>
          </div>
        </details>
      </div>}

      <main id="platform-app-content" className="mx-auto min-h-[calc(100vh-9rem)] max-w-xl overflow-x-clip pb-[calc(5.8rem+env(safe-area-inset-bottom))]">
        {location.pathname !== '/' && <div className="px-3 pt-2">
          <button type="button" onClick={() => {
            const index = (window.history.state as { idx?: number } | null)?.idx;
            if (typeof index === 'number' && index > 0) {
              navigate(-1);
            } else {
              // A directly opened preview has no in-app history.
              // Return to the logical parent rather than the homepage.
              const path = location.pathname;
              const fallback = path === '/citizens' ? '/'
                : path.startsWith('/citizens/') ? '/citizens'
                : path === '/education' ? '/citizens'
                : path === '/recherche' && new URLSearchParams(location.search).get('categorie')?.startsWith('shop:')
                  ? '/citizens/shops'
                : '/';
              navigate(fallback, { replace: true });
            }
          }} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#45243A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A17D36]" aria-label={copy.back}>
            <ArrowLeft className={`h-4 w-4 ${rtl ? 'rotate-180' : ''}`} aria-hidden="true" />
            {copy.back}
          </button>
        </div>}
        <PlatformAppIntro key={location.pathname + location.search} pathname={location.pathname} search={location.search} language={lang} />
        {useCompactHub && hub ? <PlatformAppSectionHub kind={hub} /> : children}
      </main>

      <nav data-platform-app-tabs aria-label={copy.more} className="fixed inset-x-0 bottom-0 z-50 border-t border-[#D4AF37]/40 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_22px_rgba(53,23,47,0.08)] backdrop-blur">
        <div className="mx-auto grid max-w-xl grid-cols-5 items-stretch px-1">
          {tabs.map(({ label, to, icon: Icon, active }) => (
            <Link key={to} to={to} aria-current={active ? 'page' : undefined}
              className={`flex min-h-[70px] flex-col items-center justify-center gap-1 rounded-lg px-0.5 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#B99143] ${active ? 'font-semibold text-[#45243A]' : 'font-medium text-[#806F79]'}`}>
              <Icon className={`h-5 w-5 ${active ? 'text-[#A17D36]' : ''}`} strokeWidth={active ? 2 : 1.6} aria-hidden="true" />
              <span className="max-w-full break-words px-0.5 text-[9px] leading-[1.15] sm:text-[10px]">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
