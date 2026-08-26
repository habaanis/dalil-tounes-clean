import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Contact,
  Facebook,
  Globe2,
  Images,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Navigation,
  Phone,
  QrCode,
  Share2,
  Star,
  Wrench,
  Youtube,
} from 'lucide-react';
import './businessShowcaseLienora.css';
import '../styles/cvBusinessPolish.css';

export type BusinessCardPreviewVariant = 'artisan' | 'premium';
export type BusinessCardPreviewSize = 'full' | 'compact';
export type BusinessCardPreviewLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';
export type BusinessCardPreviewNetwork = 'Instagram' | 'Facebook' | 'LinkedIn' | 'YouTube' | 'TikTok';

export interface BusinessCardPreviewProps {
  variant: BusinessCardPreviewVariant;
  language?: BusinessCardPreviewLanguage;
  size?: BusinessCardPreviewSize;
  interactive?: boolean;
  name?: string;
  category?: string;
  city?: string;
  status?: string;
  logo?: string;
  coverImage?: string;
  networks?: BusinessCardPreviewNetwork[];
  actions?: [string, string, string, string, string, string];
  gallery?: string | string[];
  reviews?: string;
  hours?: string;
}

const DEFAULT_LOGO = '/images/logo_dalil_tounes_sceau_luxe.webp';
const DEFAULT_COVER = '/images/drapeau-tunisie.webp';

const DEFAULT_ARTISAN_NETWORKS: BusinessCardPreviewNetwork[] = ['Facebook', 'Instagram'];
const DEFAULT_PREMIUM_NETWORKS: BusinessCardPreviewNetwork[] = ['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'TikTok'];

type PreviewCopy = {
  productPremium: string;
  productArtisan: string;
  certified: string;
  introEyebrow: string;
  introTitle: string;
  introText: string;
  read: string;
  services: string;
  photos: string;
  hours: string;
  practical: string;
  reviews: string;
  sharing: string;
  call: string;
  whatsapp: string;
  email: string;
  directions: string;
  website: string;
  socialNetworks: string;
  twoNetworksChoice: string;
  book: string;
  addContact: string;
  contactNotice: string;
  address: string;
  phone: string;
  qrText: string;
  powered: string;
};

const COPY: Record<BusinessCardPreviewLanguage, PreviewCopy> = {
  fr: {
    productPremium: 'CV BUSINESS PREMIUM', productArtisan: 'CV BUSINESS ARTISAN', certified: '★ CERTIFIÉ DALIL TOUNES',
    introEyebrow: 'PRÉSENTATION', introTitle: 'Un professionnel proche de vos projets', introText: 'Une présentation claire de votre activité, de votre savoir-faire et de ce qui vous différencie.', read: 'Lire la présentation',
    services: 'Services proposés', photos: 'Photos et réalisations', hours: 'Horaires', practical: 'Informations pratiques', reviews: 'Avis clients', sharing: 'QR Code et partage',
    call: 'Appeler', whatsapp: 'WhatsApp', email: 'E-mail', directions: 'Itinéraire', website: 'Site web', socialNetworks: 'Réseaux sociaux', twoNetworksChoice: '2 réseaux au choix', book: 'Réserver', addContact: 'Ajouter aux contacts', contactNotice: 'Coordonnées fournies par le professionnel.',
    address: 'Adresse', phone: 'Téléphone', qrText: 'Scannez ce CV Business pour l’ouvrir directement.', powered: 'Propulsé par 🇹🇳 Dalil Tounes',
  },
  ar: {
    productPremium: 'CV BUSINESS PREMIUM', productArtisan: 'CV BUSINESS ARTISAN', certified: '★ موثّق من دليل تونس',
    introEyebrow: 'نبذة عن المؤسسة', introTitle: 'مهني قريب من مشاريعكم', introText: 'عرض واضح للنشاط والخبرة وما يميز هذا المهني.', read: 'قراءة التعريف',
    services: 'الخدمات المقترحة', photos: 'الصور والإنجازات', hours: 'أوقات العمل', practical: 'معلومات عملية', reviews: 'آراء العملاء', sharing: 'رمز QR والمشاركة',
    call: 'اتصال', whatsapp: 'واتساب', email: 'البريد الإلكتروني', directions: 'الاتجاهات', website: 'الموقع الإلكتروني', socialNetworks: 'شبكات التواصل', twoNetworksChoice: 'شبكتان من اختيارك', book: 'حجز', addContact: 'إضافة إلى جهات الاتصال', contactNotice: 'بيانات الاتصال مقدمة من المهني.',
    address: 'العنوان', phone: 'الهاتف', qrText: 'امسح رمز CV Business لفتحه مباشرة.', powered: 'بدعم من 🇹🇳 دليل تونس',
  },
  en: {
    productPremium: 'PREMIUM BUSINESS CV', productArtisan: 'ARTISAN BUSINESS CV', certified: '★ DALIL TOUNES CERTIFIED',
    introEyebrow: 'ABOUT', introTitle: 'A local professional for your projects', introText: 'A clear presentation of the activity, expertise and what makes this professional different.', read: 'Read the presentation',
    services: 'Services', photos: 'Photos and work', hours: 'Opening hours', practical: 'Practical information', reviews: 'Customer reviews', sharing: 'QR Code and sharing',
    call: 'Call', whatsapp: 'WhatsApp', email: 'Email', directions: 'Directions', website: 'Website', socialNetworks: 'Social networks', twoNetworksChoice: '2 networks of your choice', book: 'Book', addContact: 'Add to contacts', contactNotice: 'Contact details provided by the professional.',
    address: 'Address', phone: 'Phone', qrText: 'Scan this Business CV to open it directly.', powered: 'Powered by 🇹🇳 Dalil Tounes',
  },
  it: {
    productPremium: 'CV BUSINESS PREMIUM', productArtisan: 'CV BUSINESS ARTISAN', certified: '★ CERTIFICATO DALIL TOUNES',
    introEyebrow: 'PRESENTAZIONE', introTitle: 'Un professionista vicino ai tuoi progetti', introText: 'Una presentazione chiara dell’attività, delle competenze e dei punti di forza.', read: 'Leggi la presentazione',
    services: 'Servizi proposti', photos: 'Foto e realizzazioni', hours: 'Orari', practical: 'Informazioni pratiche', reviews: 'Recensioni', sharing: 'QR Code e condivisione',
    call: 'Chiama', whatsapp: 'WhatsApp', email: 'Email', directions: 'Indicazioni', website: 'Sito web', socialNetworks: 'Social network', twoNetworksChoice: '2 social a scelta', book: 'Prenota', addContact: 'Aggiungi ai contatti', contactNotice: 'Contatti forniti dal professionista.',
    address: 'Indirizzo', phone: 'Telefono', qrText: 'Scansiona questo CV Business per aprirlo direttamente.', powered: 'Offerto da 🇹🇳 Dalil Tounes',
  },
  ru: {
    productPremium: 'PREMIUM BUSINESS CV', productArtisan: 'ARTISAN BUSINESS CV', certified: '★ ПРОВЕРЕНО DALIL TOUNES',
    introEyebrow: 'О КОМПАНИИ', introTitle: 'Профессионал рядом с вашими проектами', introText: 'Понятное представление деятельности, опыта и сильных сторон специалиста.', read: 'Читать описание',
    services: 'Услуги', photos: 'Фотографии и работы', hours: 'Часы работы', practical: 'Практическая информация', reviews: 'Отзывы клиентов', sharing: 'QR-код и публикация',
    call: 'Позвонить', whatsapp: 'WhatsApp', email: 'Email', directions: 'Маршрут', website: 'Сайт', socialNetworks: 'Социальные сети', twoNetworksChoice: '2 сети на выбор', book: 'Забронировать', addContact: 'Добавить в контакты', contactNotice: 'Контакты предоставлены профессионалом.',
    address: 'Адрес', phone: 'Телефон', qrText: 'Сканируйте Business CV, чтобы открыть его напрямую.', powered: 'На платформе 🇹🇳 Dalil Tounes',
  },
};

type SectionId = 'services' | 'gallery' | 'hours' | 'practical' | 'reviews' | 'sharing';
type PreviewSection = { id: SectionId; title: string; icon: typeof Wrench; badge?: string; content: ReactNode; };

const PREMIUM_THEME = {
  '--dt-page': '#eef1ef', '--dt-ink': '#0f2d23', '--dt-accent': '#F4CE55', '--dt-border': '#D4AF37', '--dt-muted': '#B8D2C9',
  '--dt-glow': 'rgba(20, 111, 77, 0.34)', '--dt-glow-soft': 'rgba(17, 92, 67, 0.25)', '--dt-shell-start': '#031d18', '--dt-shell-mid': '#042d24', '--dt-shell-end': '#011914',
  '--dt-identity-start': '#032a22fa', '--dt-identity-end': '#011915fc', '--dt-panel-start': '#05352aeb', '--dt-panel-end': '#011915f0', '--dt-panel-dark': '#021e19',
  '--dt-badge-start': '#076044', '--dt-badge-end': '#087a50', '--dt-action-start': '#06382d', '--dt-action-end': '#011f1a',
} as CSSProperties;

function NetworkIcon({ network }: { network: BusinessCardPreviewNetwork }) {
  const className = 'h-4 w-4';
  if (network === 'Facebook') return <Facebook className={className} aria-hidden="true" />;
  if (network === 'Instagram') return <Instagram className={className} aria-hidden="true" />;
  if (network === 'LinkedIn') return <Linkedin className={className} aria-hidden="true" />;
  if (network === 'YouTube') return <Youtube className={className} aria-hidden="true" />;
  return <Music2 className={className} aria-hidden="true" />;
}

export default function BusinessCardPreview({
  variant, language = 'fr', size = 'full', interactive = true, name = "Aux saveurs d'Anis", category = 'Traiteur événementiel', city = 'Sousse, Tunisie', status = 'Ouvert',
  logo = DEFAULT_LOGO, coverImage = DEFAULT_COVER, networks, gallery, reviews, hours,
}: BusinessCardPreviewProps) {
  const t = COPY[language];
  const isPremium = variant === 'premium';
  const [openSection, setOpenSection] = useState<SectionId | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);
  const ratingLabel = reviews || '5.0 ★ · 27 avis';
  const moreActionsLabel = language === 'ar' ? 'المزيد من الإجراءات' : language === 'en' ? 'More actions' : language === 'it' ? 'Altre azioni' : language === 'ru' ? 'Другие действия' : "Plus d’actions";
  const socialLabel = isPremium ? t.socialNetworks : t.twoNetworksChoice;
  const activeNetworks = (networks?.length ? networks : isPremium ? DEFAULT_PREMIUM_NETWORKS : DEFAULT_ARTISAN_NETWORKS).slice(0, isPremium ? 5 : 2);
  const suppliedGallery = Array.isArray(gallery)
    ? gallery.filter(Boolean)
    : gallery && /^https?:\/\//i.test(gallery)
      ? [gallery]
      : [];
  const tierPhotoLimit = isPremium ? 10 : 5;
  const galleryImages = suppliedGallery.length > 0
    ? suppliedGallery.slice(0, tierPhotoLimit)
    : [coverImage].slice(0, tierPhotoLimit);
  const galleryCount = suppliedGallery.length > 0
    ? Math.min(suppliedGallery.length, tierPhotoLimit)
    : tierPhotoLimit;

  const toggle = (id: SectionId) => {
    if (!interactive) return;
    setOpenSection(current => current === id ? null : id);
  };

  const galleryContent = (
    <div>
      <div className={`dt-preview-gallery-grid dt-preview-gallery-count-${galleryImages.length}`}>
        {galleryImages.map((image, index) => (
          <figure className={`dt-preview-gallery-item dt-preview-gallery-item-${index + 1}`} key={`${image}-${index}`}>
            <img src={image} alt={`${name} - réalisation ${index + 1}`} />
            <figcaption>Réalisation {index + 1}</figcaption>
          </figure>
        ))}
      </div>
      {typeof gallery === 'string' && gallery && !/^https?:\/\//i.test(gallery) && (
        <p className="mt-2 text-xs text-[#d8eee6]">{gallery}</p>
      )}
    </div>
  );

  const sections: PreviewSection[] = [
    { id: 'services', title: t.services, icon: Wrench, badge: '3', content: <div className="dt-service-grid"><div className="dt-service-item">Buffets & événements</div><div className="dt-service-item">Cuisine sur mesure</div><div className="dt-service-item">Réceptions privées</div></div> },
    { id: 'gallery', title: t.photos, icon: Images, badge: String(galleryCount), content: galleryContent },
    { id: 'hours', title: t.hours, icon: Clock3, badge: status, content: <div className="whitespace-pre-line text-xs leading-6 text-[#d8eee6]">{hours || 'Lun–Sam : 10:00–18:00'}</div> },
    { id: 'practical', title: t.practical, icon: MapPin, content: <div className="space-y-2 text-xs text-[#d8eee6]"><p><strong>{t.address}</strong><br />Sousse, Tunisie</p><p><strong>{t.phone}</strong><br />+216 XX XXX XXX</p><p><strong>{t.email}</strong><br />contact@exemple.tn</p></div> },
    { id: 'reviews', title: t.reviews, icon: Star, badge: ratingLabel, content: <div className="text-xs text-[#d8eee6]">Google · 5.0/5 · 27 avis</div> },
    { id: 'sharing', title: t.sharing, icon: QrCode, content: <div className="flex items-center gap-3"><div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-[#D4AF37]/40 bg-white text-[#0f2d23]"><QrCode className="h-10 w-10" /></div><p className="text-xs leading-5 text-[#d8eee6]">{t.qrText}</p></div> },
  ];

  return (
    <div className={size === 'compact' ? 'mx-auto w-full max-w-[360px]' : 'mx-auto w-full max-w-[400px]'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="dt-showcase" style={PREMIUM_THEME}>
        <div className="dt-cover"><img src={coverImage} alt={name} /></div>

        <section className="dt-identity">
          <div className="dt-logo"><img src={logo} alt={`Logo ${name}`} /></div>
          <div className="dt-activity-pill"><Wrench className="h-3 w-3" /> {category}</div>
          <div className="dt-identity-panel">
            <div className="dt-product-label">{isPremium ? t.productPremium : t.productArtisan}</div>
            <h1>{name}</h1>
            {isPremium && <div className="dt-professional-badge">{t.certified}</div>}
            <p className="dt-location"><MapPin /> {city}</p>
          </div>
        </section>

        <section className="dt-actions">
          <div className="dt-primary-actions" style={{ gridTemplateColumns: 'repeat(2,minmax(0,1fr))' }}>
            <button className="dt-primary-action" type="button"><Phone />{t.call}</button>
            <button className="dt-primary-action" type="button"><MessageCircle />{t.whatsapp}</button>
          </div>

          <button
            type="button"
            className="dt-secondary-action dt-more-actions-trigger"
            onClick={() => interactive && setActionsOpen(value => !value)}
            aria-expanded={actionsOpen}
          >
            <span>{moreActionsLabel}</span>
            <ChevronRight className={actionsOpen ? 'rotate-90' : ''} aria-hidden="true" />
          </button>

          {actionsOpen && (
            <>
              <div
                className="dt-more-actions-panel"
                style={{ gridTemplateColumns: isPremium ? 'repeat(2,minmax(0,1fr))' : 'repeat(3,minmax(0,1fr))' }}
              >
                <button className="dt-primary-action" type="button"><Mail />{t.email}</button>
                <button className="dt-primary-action" type="button"><Navigation />{t.directions}</button>
                {isPremium && <button className="dt-primary-action" type="button"><Globe2 />{t.website}</button>}
                <button
                  className="dt-primary-action"
                  type="button"
                  onClick={() => interactive && setSocialsOpen(value => !value)}
                  aria-expanded={socialsOpen}
                >
                  <Share2 />{socialLabel}
                </button>
              </div>

              {socialsOpen && (
                <div className="dt-preview-social-panel" aria-label={t.socialNetworks}>
                  {activeNetworks.map(network => (
                    <span className="dt-preview-social-chip" key={network}>
                      <NetworkIcon network={network} />
                      <span>{network}</span>
                    </span>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="dt-secondary-actions">
            <button className="dt-secondary-action" type="button"><CalendarDays />{t.book}</button>
            <button className="dt-secondary-action" type="button"><Contact />{t.addContact}</button>
          </div>
          <p className="dt-action-notice">{t.contactNotice}</p>
        </section>

        <div className="dt-showcase-body">
          <section className="dt-intro">
            <p className="dt-eyebrow">{t.introEyebrow}</p>
            <h2>{t.introTitle}</h2>
            <p className="dt-intro-description">{t.introText}</p>
            <button type="button" className="dt-read-intro">{t.read}</button>
          </section>

          <div className="dt-accordion-list">
            {sections.map(section => {
              const Icon = section.icon;
              const open = openSection === section.id;
              return (
                <section className={`dt-accordion ${open ? 'open' : ''}`} key={section.id}>
                  <button type="button" className="dt-accordion-trigger" onClick={() => toggle(section.id)} aria-expanded={open}>
                    <Icon aria-hidden="true" />
                    <span>{section.title}</span>
                    {section.badge && <small className={`dt-section-badge ${section.id === 'reviews' ? 'dt-google-review-badge' : ''}`}>{section.badge}</small>}
                    <ChevronRight className="dt-accordion-chevron" aria-hidden="true" />
                  </button>
                  {open && <div className="dt-accordion-panel">{section.content}</div>}
                </section>
              );
            })}
          </div>

          <div className="mt-3 text-center text-[8px] text-[#B8D2C9]">{t.powered}</div>
        </div>
      </div>
    </div>
  );
}
