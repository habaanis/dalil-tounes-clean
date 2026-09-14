import BusinessCardPreview from './BusinessCardPreviewBase';
import { CvPortfolioPresentation } from './CvPortfolioPresentation';
import type { ResolvedCvPresentation } from '../lib/cvPresentationEngine';
import type { CvBusinessProfile } from '../lib/cvBusinessDalilAdapter';
import { Phone, MessageCircle, Mail, Navigation, Globe as Globe2, Contact, FileText, CalendarDays } from 'lucide-react';

type PreviewLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

const DEFAULT_LOGO = '/images/logo_dalil_tounes_sceau_luxe.webp';
const DEFAULT_COVER = '/images/drapeau-tunisie.webp';

const PREMIUM_PRODUCT_LABELS: Record<PreviewLanguage, string> = {
  fr: 'CV BUSINESS PREMIUM',
  ar: 'CV BUSINESS PREMIUM',
  en: 'PREMIUM BUSINESS CV',
  it: 'CV BUSINESS PREMIUM',
  ru: 'PREMIUM BUSINESS CV',
};

const CERTIFICATION_LABELS: Record<PreviewLanguage, string> = {
  fr: 'Certifié Dalil Tounes',
  ar: 'معتمد من دليل تونس',
  en: 'Certified by Dalil Tounes',
  it: 'Certificato da Dalil Tounes',
  ru: 'Сертифицировано Dalil Tounes',
};

const NOTICE_TEXT: Record<PreviewLanguage, string> = {
  fr: 'Coordonnées fournies par le professionnel.',
  ar: 'بيانات الاتصال مقدمة من المهني.',
  en: 'Contact details provided by the professional.',
  it: 'Contatti forniti dal professionista.',
  ru: 'Контакты предоставлены профессионалом.',
};

const CATEGORY_BY_LANG: Record<PreviewLanguage, string> = {
  fr: 'Traiteur événementiel',
  ar: 'تموين مناسبات',
  en: 'Event catering',
  it: 'Catering per eventi',
  ru: 'Кейтеринг мероприятий',
};

const CITY_BY_LANG: Record<PreviewLanguage, string> = {
  fr: 'Sousse, Tunisie',
  ar: 'سوسة، تونس',
  en: 'Sousse, Tunisia',
  it: 'Sousse, Tunisia',
  ru: 'Сус, Тунис',
};

const ABOUT_BY_LANG: Record<PreviewLanguage, string> = {
  fr: "Aux saveurs d'Anis vous propose une cuisine tunisienne raffinée, élaborée avec des produits frais et locaux. Notre équipe vous accompagne pour tous vos événements avec des menus sur mesure et un service complet.",
  ar: "يوفر لك «Aux saveurs d'Anis» مأكولات تونسية راقية محضرة بمكونات طازجة محلية. يرافقك فريقنا في جميع مناسباتك بقوائم مخصصة وخدمة كاملة.",
  en: "Aux saveurs d'Anis offers refined Tunisian cuisine, prepared with fresh, locally sourced ingredients. Our team supports all your events with custom menus and full service.",
  it: "Aux saveurs d'Anis offre cucina tunisina raffinata, preparata con ingredienti freschi e locali. Il nostro team accompagna tutti i tuoi eventi con menu personalizzati e servizio completo.",
  ru: "Aux saveurs d'Anis предлагает изысканную тунисскую кухню из свежих местных продуктов. Наша команда сопровождает все ваши мероприятия с индивидуальным меню и полным обслуживанием.",
};

const SERVICES_BY_LANG: Record<PreviewLanguage, string[]> = {
  fr: ['Buffets & événements', 'Cuisine sur mesure', 'Réceptions privées'],
  ar: ['بوفيهات ومناسبات', 'مأكولات حسب الطلب', 'استقبالات خاصة'],
  en: ['Events & buffets', 'Custom cuisine', 'Private receptions'],
  it: ['Buffet ed eventi', 'Cucina su misura', 'Ricevimenti privati'],
  ru: ['Буфеты и мероприятия', 'Кухня на заказ', 'Частные приёмы'],
};

function buildDemoProfile(language: PreviewLanguage): CvBusinessProfile {
  return {
    identity: {
      id: 'aux-saveurs-anis',
      name: "Aux saveurs d'Anis",
      activity: CATEGORY_BY_LANG[language],
      slogan: CATEGORY_BY_LANG[language],
    },
    presentation: {
      description: ABOUT_BY_LANG[language],
      about: ABOUT_BY_LANG[language],
    },
    media: {
      logo: DEFAULT_LOGO,
      cover: DEFAULT_COVER,
      gallery: [DEFAULT_COVER, DEFAULT_COVER, DEFAULT_COVER, DEFAULT_COVER],
      video: '',
    },
    services: SERVICES_BY_LANG[language],
    contact: {
      phone: '+216 73 200 000',
      secondaryPhone: '',
      whatsapp: '+216 73 200 000',
      email: 'contact@auxsaveursdanis.tn',
      secondaryEmail: '',
      website: 'https://auxsaveursdanis.tn',
    },
    location: {
      address: '12 avenue Habib Bourguiba',
      city: 'Sousse',
      governorate: 'Sousse',
      directionsUrl: 'https://maps.google.com',
    },
    hours: language === 'fr' ? 'Lun–Sam : 10:00–18:00'
      : language === 'ar' ? 'الإثنين–السبت: 10:00–18:00'
      : language === 'en' ? 'Mon–Sat: 10:00–18:00'
      : language === 'it' ? 'Lun–Sab: 10:00–18:00'
      : 'Пн–Сб: 10:00–18:00',
    socialLinks: [
      { network: 'facebook', url: 'https://facebook.com' },
      { network: 'instagram', url: 'https://instagram.com' },
    ],
    reviews: {
      rating: 5.0,
      count: 27,
      url: 'https://google.com',
    },
    certification: {
      certified: true,
      label: CERTIFICATION_LABELS[language],
    },
    display: {
      brand: 'dalil_tounes',
      language: language as any,
      style: 'portfolio',
      direction: language === 'ar' ? 'rtl' : 'ltr',
    },
  };
}

function buildDemoPresentation(): ResolvedCvPresentation {
  return {
    brand: 'dalil_tounes',
    style: 'portfolio',
    productName: 'CV Portfolio',
    visibleActions: ['call', 'whatsapp', 'email', 'directions', 'website', 'add_contact', 'reservation', 'share'],
    visibleSections: ['identity', 'about', 'services', 'gallery', 'reviews', 'hours', 'social_links', 'certification'],
    media: { photoCount: 4, videoCount: 0 },
    layout: {
      hero: 'immersive_cover',
      navigation: 'tabs',
      sectionOrder: ['identity', 'certification', 'about', 'services', 'gallery', 'reviews', 'hours', 'social_links', 'platform_links', 'video'],
    },
  };
}

const noop = () => {};

export function ProfessionalPreviewInline({ language, variant = 'premium' }: { language: string; variant?: 'artisan' | 'premium' }) {
  const lang = (language as PreviewLanguage) || 'fr';
  return (
    <div className="pointer-events-none origin-top scale-[0.47]" style={{ width: '390px', margin: '0 auto' }}>
      <BusinessCardPreview
        variant={variant}
        language={lang}
        interactive={false}
        name="Aux saveurs d'Anis"
        category={CATEGORY_BY_LANG[lang]}
        city={CITY_BY_LANG[lang]}
        status={lang === 'fr' ? 'Ouvert' : lang === 'ar' ? 'مفتوح' : lang === 'en' ? 'Open' : lang === 'it' ? 'Aperto' : 'Открыто'}
        logo={DEFAULT_LOGO}
        coverImage={DEFAULT_COVER}
        headingLevel="h1"
      />
    </div>
  );
}

export function PortfolioPreviewInline({ language }: { language: string }) {
  const lang = (language as PreviewLanguage) || 'fr';
  const profile = buildDemoProfile(lang);
  const presentation = buildDemoPresentation();
  const actions = [
    { label: lang === 'fr' ? 'Appeler' : lang === 'ar' ? 'اتصال' : lang === 'en' ? 'Call' : lang === 'it' ? 'Chiama' : 'Позвонить', href: 'tel:+21673200000', icon: Phone },
    { label: 'WhatsApp', href: 'https://wa.me/21673200000', icon: MessageCircle, external: true },
    { label: lang === 'fr' ? 'Itinéraire' : lang === 'ar' ? 'الاتجاهات' : lang === 'en' ? 'Directions' : lang === 'it' ? 'Indicazioni' : 'Маршрут', href: 'https://maps.google.com', icon: Navigation, external: true },
    { label: lang === 'fr' ? 'E-mail' : lang === 'ar' ? 'بريد إلكتروني' : lang === 'en' ? 'Email' : lang === 'it' ? 'Email' : 'Эл. почта', href: 'mailto:contact@auxsaveursdanis.tn', icon: Mail },
    { label: lang === 'fr' ? 'Site web' : lang === 'ar' ? 'الموقع' : lang === 'en' ? 'Website' : lang === 'it' ? 'Sito web' : 'Сайт', href: 'https://auxsaveursdanis.tn', icon: Globe2, external: true },
  ];
  const gallery = profile.media.gallery.map(thumbnail => ({ thumbnail, full: thumbnail }));

  return (
    <div className="pointer-events-none origin-top scale-[0.47]" style={{ width: '390px', margin: '0 auto' }}>
      <CvPortfolioPresentation
        language={lang}
        profile={profile}
        presentation={presentation}
        coverImage={DEFAULT_COVER}
        logoImage={DEFAULT_LOGO}
        productLabel={PREMIUM_PRODUCT_LABELS[lang]}
        certification={CERTIFICATION_LABELS[lang]}
        actions={actions}
        gallery={gallery}
        onBack={noop}
        onQuote={noop}
        onDownloadContact={noop}
        onSelectImage={noop}
        notice={NOTICE_TEXT[lang]}
      />
    </div>
  );
}

export function EnlargedPreviewInline({ model, language }: { model: 'professional' | 'portfolio'; language: string }) {
  if (model === 'portfolio') {
    return <PortfolioPreviewInline language={language} />;
  }
  return <ProfessionalPreviewInline language={language} />;
}
