import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  CalendarDays,
  ChevronRight,
  Contact,
  FileText,
  Home,
  Images,
  Info,
  MapPin,
  Star,
  Store,
  type LucideIcon,
} from 'lucide-react';
import type { CvBusinessProfile } from '../lib/cvBusinessDalilAdapter';
import type { ResolvedCvPresentation } from '../lib/cvPresentationEngine';
import './cvPortfolioPresentation.css';
import './cvPortfolioSizing.css';

type PortfolioTab = 'home' | 'about' | 'services' | 'gallery' | 'reviews';

type PortfolioAction = {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

type GalleryItem = {
  thumbnail: string;
  full: string;
};

type Copy = {
  home: string;
  about: string;
  services: string;
  photos: string;
  reviews: string;
  aboutUs: string;
  learnMore: string;
  ourServices: string;
  viewAll: string;
  ourWork: string;
  noPhotos: string;
  openingHours: string;
  practical: string;
  book: string;
  quote: string;
  addContact: string;
  certified: string;
  poweredBy: string;
};

const COPY: Record<string, Copy> = {
  fr: {
    home: 'Accueil', about: 'À propos', services: 'Services', photos: 'Photos', reviews: 'Avis',
    aboutUs: 'À propos de nous', learnMore: 'En savoir plus', ourServices: 'Nos services',
    viewAll: 'Voir tout', ourWork: 'Nos réalisations', noPhotos: 'Aucune photo disponible.',
    openingHours: 'Horaires', practical: 'Informations pratiques', book: 'Réserver',
    quote: 'Demander un devis', addContact: 'Ajouter aux contacts', certified: 'Certifié Dalil Tounes',
    poweredBy: 'Propulsé par Dalil Tounes',
  },
  ar: {
    home: 'الرئيسية', about: 'من نحن', services: 'الخدمات', photos: 'الصور', reviews: 'الآراء',
    aboutUs: 'من نحن', learnMore: 'اكتشف المزيد', ourServices: 'خدماتنا', viewAll: 'عرض الكل',
    ourWork: 'أعمالنا', noPhotos: 'لا توجد صور متاحة.', openingHours: 'أوقات العمل',
    practical: 'معلومات عملية', book: 'احجز', quote: 'طلب عرض سعر', addContact: 'إضافة إلى جهات الاتصال',
    certified: 'معتمد من دليل تونس', poweredBy: 'بدعم من دليل تونس',
  },
  en: {
    home: 'Home', about: 'About', services: 'Services', photos: 'Photos', reviews: 'Reviews',
    aboutUs: 'About us', learnMore: 'Learn more', ourServices: 'Our services', viewAll: 'View all',
    ourWork: 'Our work', noPhotos: 'No photos available.', openingHours: 'Opening hours',
    practical: 'Practical information', book: 'Book', quote: 'Request a quote',
    addContact: 'Add to contacts', certified: 'Certified by Dalil Tounes', poweredBy: 'Powered by Dalil Tounes',
  },
  it: {
    home: 'Home', about: 'Chi siamo', services: 'Servizi', photos: 'Foto', reviews: 'Recensioni',
    aboutUs: 'Chi siamo', learnMore: 'Scopri di più', ourServices: 'I nostri servizi', viewAll: 'Vedi tutto',
    ourWork: 'I nostri lavori', noPhotos: 'Nessuna foto disponibile.', openingHours: 'Orari',
    practical: 'Informazioni pratiche', book: 'Prenota', quote: 'Richiedi un preventivo',
    addContact: 'Aggiungi ai contatti', certified: 'Certificato da Dalil Tounes', poweredBy: 'Offerto da Dalil Tounes',
  },
  ru: {
    home: 'Главная', about: 'О нас', services: 'Услуги', photos: 'Фото', reviews: 'Отзывы',
    aboutUs: 'О нас', learnMore: 'Узнать больше', ourServices: 'Наши услуги', viewAll: 'Показать все',
    ourWork: 'Наши работы', noPhotos: 'Фотографии отсутствуют.', openingHours: 'Часы работы',
    practical: 'Практическая информация', book: 'Забронировать', quote: 'Запросить смету',
    addContact: 'Добавить в контакты', certified: 'Сертифицировано Dalil Tounes', poweredBy: 'Работает на Dalil Tounes',
  },
};

export interface CvPortfolioPresentationProps {
  language: string;
  profile: CvBusinessProfile;
  presentation: ResolvedCvPresentation;
  coverImage: string;
  logoImage: string;
  productLabel: string;
  certification: string;
  actions: PortfolioAction[];
  gallery: GalleryItem[];
  onBack: () => void;
  bookingContent?: ReactNode;
  onQuote: () => void;
  onDownloadContact: () => void;
  onSelectImage: (url: string) => void;
  notice: string;
}

export function CvPortfolioPresentation({
  language,
  profile,
  presentation,
  coverImage,
  logoImage,
  productLabel,
  certification,
  actions,
  gallery,
  onBack,
  bookingContent,
  onQuote,
  onDownloadContact,
  onSelectImage,
  notice,
}: CvPortfolioPresentationProps) {
  const copy = COPY[language] || COPY.fr;
  const [activeTab, setActiveTab] = useState<PortfolioTab>('home');
  const [expandedAbout, setExpandedAbout] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const isRTL = language === 'ar';
  const hasSection = (section: ResolvedCvPresentation['visibleSections'][number]) =>
    presentation.visibleSections.includes(section);
  const description = profile.presentation.about || profile.presentation.description;
  const extraDescription = profile.presentation.about && profile.presentation.description !== profile.presentation.about
    ? profile.presentation.description
    : '';
  const serviceImages = gallery.length > 0 ? gallery : [{ thumbnail: coverImage, full: coverImage }];
  const actionPriority = (href: string) => {
    if (href.startsWith('/qr-business/')) return -1;
    if (href.startsWith('tel:')) return 0;
    if (href.includes('wa.me') || href.includes('whatsapp')) return 1;
    if (href.includes('maps') || href.includes('google.com/maps')) return 2;
    return 3;
  };
  const featuredActions = [...actions].sort((a, b) => actionPriority(a.href) - actionPriority(b.href)).slice(0, 3);
  const secondaryActions = actions.filter(action => !featuredActions.includes(action));

  const tabs = useMemo(() => [
    { id: 'home' as const, label: copy.home, icon: Home, visible: true },
    { id: 'about' as const, label: copy.about, icon: Info, visible: hasSection('about') },
    { id: 'services' as const, label: copy.services, icon: Store, visible: hasSection('services') },
    { id: 'gallery' as const, label: copy.photos, icon: Images, visible: hasSection('gallery') },
    { id: 'reviews' as const, label: copy.reviews, icon: Star, visible: hasSection('reviews') },
  ].filter(tab => tab.visible), [copy, presentation.visibleSections]);

  const goTo = (tab: PortfolioTab) => {
    setActiveTab(tab);
    window.requestAnimationFrame(() => {
      document.getElementById('cv-portfolio-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const aboutBlock = (
    <section className="cvp-section cvp-about">
      <div className="cvp-section-heading"><h2>{copy.aboutUs}</h2></div>
      <div className="cvp-about-grid">
        <div>
          <p>{description}</p>
          {expandedAbout && extraDescription && <p className="cvp-about-extra">{extraDescription}</p>}
        </div>
        {gallery[0] && (
          <button type="button" className="cvp-about-image" onClick={() => onSelectImage(gallery[0].full)}>
            <img src={gallery[0].thumbnail} alt={profile.identity.name} loading="lazy" decoding="async" />
          </button>
        )}
      </div>
      {(extraDescription || description.length > 220) && (
        <button type="button" className="cvp-wide-link" onClick={() => setExpandedAbout(value => !value)}>
          {copy.learnMore}<ChevronRight aria-hidden="true" />
        </button>
      )}
    </section>
  );

  const servicesBlock = (
    <section className="cvp-section">
      <div className="cvp-section-heading">
        <h2>{copy.ourServices}</h2>
        {profile.services.length > 3 && <button type="button" onClick={() => goTo('services')}>{copy.viewAll}<ChevronRight /></button>}
      </div>
      <div className="cvp-service-strip">
        {profile.services.map((service, index) => (
          <article className="cvp-service-card" key={`${service}-${index}`}>
            <img src={serviceImages[index % serviceImages.length].thumbnail} alt="" loading="lazy" decoding="async" />
            <span>{service}</span>
          </article>
        ))}
      </div>
    </section>
  );

  const galleryBlock = (
    <section className="cvp-section">
      <div className="cvp-section-heading"><h2>{copy.ourWork}</h2></div>
      {gallery.length > 0 ? (
        <div className="cvp-gallery-grid">
          {gallery.map((item, index) => (
            <button type="button" onClick={() => onSelectImage(item.full)} key={`${item.thumbnail}-${index}`}>
              <img src={item.thumbnail} alt={`${profile.identity.name} — ${index + 1}`} loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      ) : <p>{copy.noPhotos}</p>}
    </section>
  );

  return (
    <div
      className="cvp-page"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ '--cvp-accent': '#e8bd43', '--cvp-deep': '#003d35' } as CSSProperties}
    >
      <div className="cvp-shell">
        <button type="button" className="cvp-back" onClick={onBack}>‹ <span>{copy.home}</span></button>
        <article className="cvp-card">
          <header className="cvp-header">
            <div className="cvp-cover"><img src={coverImage} alt={profile.identity.name} loading="eager" decoding="async" /></div>
            <div className="cvp-identity">
              <div className="cvp-logo"><img src={logoImage} alt={`Logo ${profile.identity.name}`} /></div>
              <span className="cvp-activity">✦ {profile.identity.activity}</span>
              <div className="cvp-name-panel">
                <small>{productLabel}</small>
                <h1>{profile.identity.name}</h1>
                {profile.certification.certified && <strong>★ {certification || copy.certified}</strong>}
                {(profile.location.city || profile.location.governorate) && (
                  <p><MapPin />{[profile.location.city, profile.location.governorate].filter(Boolean).join(', ')}</p>
                )}
              </div>
            </div>
          </header>

          {featuredActions.length > 0 && (
            <section className="cvp-actions" aria-label="Actions">
              {featuredActions.map(({ label, href, icon: Icon, external }) => (
                <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} key={label}>
                  <Icon /><span>{label}</span>
                </a>
              ))}
            </section>
          )}

          <nav className="cvp-tabs" aria-label="Navigation du CV Portfolio">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button type="button" className={activeTab === id ? 'active' : ''} onClick={() => goTo(id)} key={id}>
                <Icon /><span>{label}</span>
              </button>
            ))}
          </nav>

          <div className={`cvp-content cvp-content-${activeTab}`} id="cv-portfolio-content">
            {activeTab === 'home' && <>{hasSection('about') && aboutBlock}{hasSection('services') && servicesBlock}</>}
            {activeTab === 'about' && aboutBlock}
            {activeTab === 'services' && servicesBlock}
            {activeTab === 'gallery' && galleryBlock}
            {activeTab === 'reviews' && (
              <section className="cvp-section cvp-review-panel">
                <Star fill="currentColor" />
                <h2>{profile.reviews.rating ? `${profile.reviews.rating.toFixed(1)} / 5` : copy.reviews}</h2>
                {profile.reviews.count > 0 && <p>{profile.reviews.count} {copy.reviews.toLowerCase()}</p>}
                {profile.reviews.url && <a href={profile.reviews.url} target="_blank" rel="noopener noreferrer">{copy.reviews}<ChevronRight /></a>}
              </section>
            )}

            {activeTab !== 'home' && (
              <>
                {secondaryActions.length > 0 && (
                  <section className="cvp-actions cvp-secondary-actions" aria-label={copy.practical}>
                    {secondaryActions.map(({ label, href, icon: Icon, external }) => (
                      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} key={label}>
                        <Icon /><span>{label}</span>
                      </a>
                    ))}
                  </section>
                )}
                <section className="cvp-extra-actions">
                  {presentation.visibleActions.includes('reservation') && bookingContent && <button type="button" onClick={() => setBookingOpen(value => !value)}><CalendarDays />{copy.book}</button>}
                  {(profile.contact.whatsapp || profile.contact.email) && <button type="button" onClick={onQuote}><FileText />{copy.quote}</button>}
                  {presentation.visibleActions.includes('add_contact') && <button type="button" onClick={onDownloadContact}><Contact />{copy.addContact}</button>}
                </section>
              </>
            )}
            {bookingOpen && bookingContent && <section className="cvp-booking">{bookingContent}</section>}
            {notice && <p className="cvp-notice" role="status">{notice}</p>}
          </div>
          {activeTab !== 'home' && <footer className="cvp-footer">{copy.poweredBy}</footer>}
        </article>
      </div>
    </div>
  );
}
