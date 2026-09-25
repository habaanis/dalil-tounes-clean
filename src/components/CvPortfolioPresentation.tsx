import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  CalendarDays,
  ChevronRight,
  Contact,
  FileText,
  Home,
  Images,
  Info,
  MapPin,
  Search,
  Star,
  Store,
  type LucideIcon,
} from 'lucide-react';
import type { CvBusinessProfile } from '../lib/cvBusinessDalilAdapter';
import type { ResolvedCvPresentation } from '../lib/cvPresentationEngine';
import './cvPortfolioPresentation.css';
import './cvPortfolioSizing.css';

type PortfolioTab = 'home' | 'about' | 'services' | 'gallery' | 'reviews';
type PortfolioPalette = 'prestige' | 'ivory' | 'night';

const PORTFOLIO_PALETTE_THEMES: Record<PortfolioPalette, CSSProperties> = {
  prestige: {
    '--cvp-page': '#eef1ef', '--cvp-text': '#f7f4ec', '--cvp-shell-start': '#005044',
    '--cvp-shell-mid': '#002f2b', '--cvp-shell-end': '#001d1b', '--cvp-identity-start': '#004e42',
    '--cvp-identity-end': '#002723', '--cvp-panel': '#003c35', '--cvp-action': 'rgba(0,74,61,.55)',
    '--cvp-badge': '#087051', '--cvp-overlay': 'rgba(0,45,39,.95)', '--cvp-accent': '#e8bd43',
  } as CSSProperties,
  ivory: {
    '--cvp-page': '#FFFFF0', '--cvp-text': '#3B3126', '--cvp-shell-start': '#FFFFF8',
    '--cvp-shell-mid': '#FFFFF0', '--cvp-shell-end': '#F4E4B7', '--cvp-identity-start': '#FFFFF8',
    '--cvp-identity-end': '#F4E4B7', '--cvp-panel': '#F0D999', '--cvp-action': 'rgba(255,255,240,.82)',
    '--cvp-badge': '#D4AF37', '--cvp-overlay': 'rgba(59,49,38,.62)', '--cvp-accent': '#D4AF37',
  } as CSSProperties,
  night: {
    '--cvp-page': '#06101d', '--cvp-text': '#f8f1e4', '--cvp-shell-start': '#1d3a5a',
    '--cvp-shell-mid': '#10243a', '--cvp-shell-end': '#06101d', '--cvp-identity-start': '#1d3a5a',
    '--cvp-identity-end': '#172f4b', '--cvp-panel': '#172f4b', '--cvp-action': 'rgba(29,58,90,.72)',
    '--cvp-badge': '#1d3a5a', '--cvp-overlay': 'rgba(16,36,58,.95)', '--cvp-accent': '#e5c486',
  } as CSSProperties,
};

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
  viewReviews: string;
  giveReview: string;
  moreActions: string;
  moreActionsSummary: string;
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
    viewReviews: 'Voir les avis', giveReview: 'Donner un avis',
    moreActions: 'Plus d’actions', moreActionsSummary: 'WhatsApp · E-mail · Réserver · Avis',
    poweredBy: 'Propulsé par Dalil Tounes',
  },
  ar: {
    home: 'الرئيسية', about: 'من نحن', services: 'الخدمات', photos: 'الصور', reviews: 'الآراء',
    aboutUs: 'من نحن', learnMore: 'اكتشف المزيد', ourServices: 'خدماتنا', viewAll: 'عرض الكل',
    ourWork: 'أعمالنا', noPhotos: 'لا توجد صور متاحة.', openingHours: 'أوقات العمل',
    practical: 'معلومات عملية', book: 'احجز', quote: 'طلب عرض سعر', addContact: 'إضافة إلى جهات الاتصال',
    viewReviews: 'عرض الآراء', giveReview: 'إضافة رأي',
    moreActions: 'المزيد من الإجراءات', moreActionsSummary: 'واتساب · البريد · الحجز · الآراء',
    certified: 'معتمد من دليل تونس', poweredBy: 'بدعم من دليل تونس',
  },
  en: {
    home: 'Home', about: 'About', services: 'Services', photos: 'Photos', reviews: 'Reviews',
    aboutUs: 'About us', learnMore: 'Learn more', ourServices: 'Our services', viewAll: 'View all',
    ourWork: 'Our work', noPhotos: 'No photos available.', openingHours: 'Opening hours',
    practical: 'Practical information', book: 'Book', quote: 'Request a quote',
    addContact: 'Add to contacts', certified: 'Certified by Dalil Tounes', poweredBy: 'Powered by Dalil Tounes',
    viewReviews: 'View reviews', giveReview: 'Leave a review',
    moreActions: 'More actions', moreActionsSummary: 'WhatsApp · E-mail · Booking · Reviews',
  },
  it: {
    home: 'Home', about: 'Chi siamo', services: 'Servizi', photos: 'Foto', reviews: 'Recensioni',
    aboutUs: 'Chi siamo', learnMore: 'Scopri di più', ourServices: 'I nostri servizi', viewAll: 'Vedi tutto',
    ourWork: 'I nostri lavori', noPhotos: 'Nessuna foto disponibile.', openingHours: 'Orari',
    practical: 'Informazioni pratiche', book: 'Prenota', quote: 'Richiedi un preventivo',
    addContact: 'Aggiungi ai contatti', certified: 'Certificato da Dalil Tounes', poweredBy: 'Offerto da Dalil Tounes',
    viewReviews: 'Vedi le recensioni', giveReview: 'Lascia una recensione',
    moreActions: 'Altre azioni', moreActionsSummary: 'WhatsApp · E-mail · Prenota · Recensioni',
  },
  ru: {
    home: 'Главная', about: 'О нас', services: 'Услуги', photos: 'Фото', reviews: 'Отзывы',
    aboutUs: 'О нас', learnMore: 'Узнать больше', ourServices: 'Наши услуги', viewAll: 'Показать все',
    ourWork: 'Наши работы', noPhotos: 'Фотографии отсутствуют.', openingHours: 'Часы работы',
    practical: 'Практическая информация', book: 'Забронировать', quote: 'Запросить смету',
    addContact: 'Добавить в контакты', certified: 'Сертифицировано Dalil Tounes', poweredBy: 'Работает на Dalil Tounes',
    viewReviews: 'Посмотреть отзывы', giveReview: 'Оставить отзыв',
    moreActions: 'Другие действия', moreActionsSummary: 'WhatsApp · E-mail · Бронь · Отзывы',
  },
};

export interface CvPortfolioPresentationProps {
  language: string;
  profile: CvBusinessProfile;
  presentation: ResolvedCvPresentation;
  coverImage: string;
  logoImage: string;
  productLabel: string;
  certification?: string;
  actions: PortfolioAction[];
  gallery: GalleryItem[];
  onBack: () => void;
  bookingContent?: ReactNode;
  reviewsContent?: ReactNode;
  onQuote: () => void;
  onDownloadContact: () => void;
  onSelectImage: (url: string) => void;
  notice: string;
  hideBack?: boolean;
  embeddedPreview?: boolean;
  palette?: PortfolioPalette | null;
}

export function CvPortfolioPresentation({
  language,
  profile,
  presentation,
  coverImage,
  logoImage,
  productLabel,
  actions,
  gallery,
  onBack,
  bookingContent,
  reviewsContent,
  onQuote,
  onDownloadContact,
  onSelectImage,
  notice,
  hideBack = false,
  embeddedPreview = false,
  palette = 'prestige',
}: CvPortfolioPresentationProps) {
  const copy = COPY[language] || COPY.fr;
  const localizedProductLabel = language === 'ar'
    ? (presentation.style === 'portfolio' ? 'الملف المهني المصوّر' : 'الملف المهني للأعمال')
    : productLabel;
  const [activeTab, setActiveTab] = useState<PortfolioTab>('home');
  const [expandedAbout, setExpandedAbout] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const isRTL = language === 'ar';
  const hasSection = (section: ResolvedCvPresentation['visibleSections'][number]) =>
    presentation.visibleSections.includes(section);
  const description = profile.presentation.about || profile.presentation.description;
  const reviewRating = profile.reviews.rating || 0;
  const reviewCount = profile.reviews.count || 0;
  const extraDescription = profile.presentation.about && profile.presentation.description !== profile.presentation.about
    ? profile.presentation.description
    : '';
  const serviceImages = gallery.length > 0 ? gallery : [{ thumbnail: coverImage, full: coverImage }];
  const hasPrimaryContact = presentation.visibleActions.includes('add_contact');
  const callAction = actions.find(action => action.href.startsWith('tel:'));
  const directionsAction = actions.find(action =>
    action.href.includes('maps') || action.href.includes('google.com/maps'),
  );
  const extraActions = actions.filter(action =>
    !action.href.startsWith('/qr-business/')
      && action !== callAction
      && action !== directionsAction,
  );
  const portfolioGallery = gallery.slice(0, 4);

  const tabs = [
    { id: 'home' as const, label: copy.home, icon: Home, visible: true },
    { id: 'about' as const, label: copy.about, icon: Info, visible: hasSection('about') },
    { id: 'services' as const, label: copy.services, icon: Store, visible: hasSection('services') },
    { id: 'gallery' as const, label: copy.photos, icon: Images, visible: hasSection('gallery') },
    { id: 'reviews' as const, label: copy.reviews, icon: Star, visible: hasSection('reviews') },
  ].filter(tab => tab.visible);

  const goTo = (tab: PortfolioTab) => {
    setActiveTab(tab);
    if (embeddedPreview) return;
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
      className={`cvp-page cvp-page--lienora${embeddedPreview || hideBack ? ' cvp-page--embedded' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={PORTFOLIO_PALETTE_THEMES[palette || 'prestige']}
    >
      <div className="cvp-lienora-shell">
        {!hideBack && <button type="button" className="cvp-back" onClick={onBack}>‹ <span>{copy.home}</span></button>}
        <article className="cvp-lienora-card">
          <div className="cvp-lienora-cover"><img src={coverImage} alt="" loading="eager" decoding="async" /></div>
          <img className="cvp-lienora-logo" src={logoImage} alt={`Logo ${profile.identity.name}`} />

          <div className="cvp-lienora-main">
            <span className="cvp-lienora-activity">✦ {profile.identity.activity}</span>
            <section className="cvp-lienora-identity">
              <small>{localizedProductLabel}</small>
              <h1>{profile.identity.name}</h1>
              {(reviewRating > 0 || reviewCount > 0) && (
                <div className="cvp-lienora-rating">
                  <Star fill="currentColor" />
                  {reviewRating > 0 && <b>{reviewRating.toFixed(1)}</b>}
                  {reviewCount > 0 && <span>{reviewCount} {copy.reviews.toLowerCase()}</span>}
                </div>
              )}
              {(profile.location.city || profile.location.governorate) && (
                <p><MapPin />{[profile.location.city, profile.location.governorate].filter(Boolean).join(', ')}</p>
              )}
            </section>

            <section className="cvp-lienora-actions" aria-label="Actions">
              {callAction && (() => {
                const Icon = callAction.icon;
                return <a href={callAction.href}><Icon /><span>{callAction.label}</span></a>;
              })()}
              {hasPrimaryContact && <button type="button" onClick={onDownloadContact}><Contact /><span>{copy.addContact}</span></button>}
              {directionsAction && (() => {
                const Icon = directionsAction.icon;
                return <a href={directionsAction.href} target="_blank" rel="noopener noreferrer"><Icon /><span>{directionsAction.label}</span></a>;
              })()}
            </section>

            <button className="cvp-lienora-more" type="button" onClick={() => setMoreOpen(open => !open)} aria-expanded={moreOpen}>
              <b>{copy.moreActions}</b><small>{copy.moreActionsSummary}</small>
            </button>
            {moreOpen && (
              <div className="cvp-lienora-extra-actions">
                {extraActions.map(({ label, href, icon: Icon, external }) => (
                  <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} key={label}>
                    <Icon />{label}
                  </a>
                ))}
                {presentation.visibleActions.includes('reservation') && bookingContent && (
                  <button type="button" onClick={() => setBookingOpen(value => !value)}><CalendarDays />{copy.book}</button>
                )}
                {(profile.contact.whatsapp || profile.contact.email) && (
                  <button type="button" onClick={onQuote}><FileText />{copy.quote}</button>
                )}
                {profile.reviews.url && (
                  <a href={profile.reviews.url} target="_blank" rel="noopener noreferrer"><Star />{copy.viewReviews}</a>
                )}
                {reviewsContent && (
                  <button type="button" onClick={() => { setMoreOpen(false); goTo('reviews'); }}><FileText />{copy.giveReview}</button>
                )}
              </div>
            )}

            <nav className="cvp-lienora-tabs" aria-label="Navigation du CV Portfolio">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button type="button" className={activeTab === id ? 'active' : ''} onClick={() => goTo(id)} key={id}>
                  <Icon /><span>{label}</span>
                </button>
              ))}
            </nav>

            <div className="cvp-lienora-content">
              {activeTab === 'home' && (
                <>
                  {hasSection('about') && (
                    <section className="cvp-lienora-about">
                      <div><h2>{copy.aboutUs}</h2><p>{description}</p></div>
                      {gallery[0] && (
                        <button type="button" className="cvp-lienora-zoom" onClick={() => onSelectImage(gallery[0].full)}>
                          <img src={gallery[0].thumbnail} alt={profile.identity.name} loading="lazy" decoding="async" /><Search />
                        </button>
                      )}
                    </section>
                  )}
                  {hasSection('services') && portfolioGallery.length > 0 && (
                    <section className="cvp-lienora-services">
                      <header><h2>{copy.ourServices}</h2><button type="button" onClick={() => goTo('services')}>{copy.viewAll} ›</button></header>
                      <div>
                        {portfolioGallery.map((item, index) => (
                          <article key={`${item.thumbnail}-${index}`}>
                            <button type="button" className="cvp-lienora-zoom" onClick={() => onSelectImage(item.full)}>
                              <img src={item.thumbnail} alt={profile.services[index] || profile.identity.activity} loading="lazy" decoding="async" /><Search />
                            </button>
                            {profile.services[index] && <b>{profile.services[index]}</b>}
                          </article>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
              {activeTab === 'about' && aboutBlock}
              {activeTab === 'services' && servicesBlock}
              {activeTab === 'gallery' && galleryBlock}
              {activeTab === 'reviews' && (
                <section className="cvp-section cvp-review-panel">
                  <Star fill="currentColor" />
                  <h2>{reviewRating ? `${reviewRating.toFixed(1)} / 5` : copy.reviews}</h2>
                  {reviewCount > 0 && <p>{reviewCount} {copy.reviews.toLowerCase()}</p>}
                  {profile.reviews.url && <a href={profile.reviews.url} target="_blank" rel="noopener noreferrer">{copy.reviews}<ChevronRight /></a>}
                </section>
              )}
              {activeTab === 'reviews' && reviewsContent && <section className="cvp-section">{reviewsContent}</section>}
              {bookingOpen && bookingContent && <section className="cvp-booking">{bookingContent}</section>}
              {notice && <p className="cvp-notice" role="status">{notice}</p>}
            </div>
          </div>
          <p className="cvp-lienora-credit">{copy.poweredBy}</p>
        </article>
      </div>
    </div>
  );
}
