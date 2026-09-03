import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Contact,
  Copy,
  ExternalLink,
  Facebook,
  FileText,
  Globe2,
  Images,
  Info,
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
  Smartphone,
  Star,
  X,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import { mapSubscriptionToTier } from '../lib/subscriptionTiers';
import { getBusinessShowcaseCapabilities } from '../lib/businessShowcaseConfig';
import {
  buildEntrepriseUrl,
  extractShortIdFromSlug,
  generateSlug,
} from '../lib/slugify';
import { getCoverImageUrl, getGalleryImageUrls } from '../lib/imagekitUtils';
import { getLogoUrl } from '../lib/logoUtils';
import { adaptDalilBusiness } from '../lib/cvBusinessDalilAdapter';
import {
  dalilCapabilitiesToPresentationEntitlements,
  getDalilContentAvailability,
} from '../lib/cvPresentationDalilBridge';
import {
  resolveCvPresentation,
  type CvPresentationAction,
  type CvPresentationSection,
} from '../lib/cvPresentationEngine';
import { getBusinessSeoMeta } from '../lib/seoMetaTemplates';
import {
  findGouvernoratBySlug,
  findMetierByValue,
  findVilleByLabel,
  SEO_SECTEURS,
} from '../lib/seoLandingData';
import {
  generateBreadcrumbSchema,
  generateLocalBusinessSchema,
} from '../lib/structuredDataSchemas';
import {
  getDayName,
  getParsedSchedule,
  translateClosedStatus,
  translateOpenStatus,
} from '../lib/horaireUtils';
import { useViewTracking } from '../hooks/useViewTracking';
import { SEOHead } from './SEOHead';
import StructuredData from './StructuredData';
import BusinessReviews from './BusinessReviews';
import EntrepriseAvisForm from './EntrepriseAvisForm';
import ReservationForm from './ReservationForm';
import SimilarBusinesses from './seo/SimilarBusinesses';
import VideoPlayer from './VideoPlayer';
import { CvPortfolioPresentation } from './CvPortfolioPresentation';
import './businessShowcaseLienora.css';

interface BusinessRecord {
  id: string;
  nom: string;
  slug?: string | null;
  ville?: string | null;
  gouvernorat?: string | null;
  adresse?: string | null;
  telephone?: string | null;
  telephone2?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  email2?: string | null;
  site_web?: string | null;
  categorie?: string | string[] | null;
  sous_categories_texte?: string | null;
  sous_categories_clean?: string | null;
  description?: string | null;
  services?: string | null;
  a_propos?: string | null;
  image_url?: string | null;
  logo_url?: string | null;
  video_url?: string | null;
  horaires_ok?: string | null;
  statut_abonnement?: string | null;
  statut_validation?: string | null;
  statut_carte?: string | null;
  qr_code_url?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  BTN_Maps?: string | null;
  google_url?: string | null;
  'Note Google Globale'?: number | string | null;
  'Compteur Avis Google'?: number | string | null;
  'Lien Instagram'?: string | null;
  'Lien TikTok'?: string | null;
  'Lien LinkedIn'?: string | null;
  'Lien YouTube'?: string | null;
  'lien facebook'?: string | null;
  [key: string]: unknown;
}

interface ShowcaseCopy {
  presentation: string;
  introProfessional: string;
  introArtisan: string;
  readMore: string;
  readLess: string;
  services: string;
  gallery: string;
  video: string;
  hours: string;
  practical: string;
  booking: string;
  reviews: string;
  leaveReview: string;
  platform: string;
  sharing: string;
  call: string;
  whatsapp: string;
  email: string;
  directions: string;
  website: string;
  social: string;
  share: string;
  copy: string;
  copied: string;
  addContact: string;
  requestQuote: string;
  book: string;
  professional: string;
  contactNotice: string;
  address: string;
  phone: string;
  secondPhone: string;
  emailLabel: string;
  noServices: string;
  noPlatformLinks: string;
  qrEyebrow: string;
  qrHeading: string;
  qrDescription: string;
  installTitle: string;
  installDescription: string;
  installIphone: string;
  installAndroid: string;
  back: string;
  loading: string;
  similar: string;
  reservationTitle: string;
  reservationName: string;
  reservationPhone: string;
  reservationEmail: string;
  reservationDate: string;
  reservationTime: string;
  reservationMessage: string;
  reservationSubmit: string;
  reservationSuccess: string;
  reservationNotice: string;
  reservationClose: string;
  reservationSending: string;
  reservationError: string;
}

const FR: ShowcaseCopy = {
  presentation: 'Présentation',
  introProfessional: 'Un professionnel proche de vos projets',
  introArtisan: 'Un artisan proche de vos projets',
  readMore: 'Lire la présentation',
  readLess: 'Réduire la présentation',
  services: 'Services proposés',
  gallery: 'Photos et réalisations',
  video: 'Vidéo',
  hours: 'Horaires',
  practical: 'Informations pratiques',
  booking: 'Réservation',
  reviews: 'Avis clients',
  leaveReview: 'Donner un avis',
  platform: 'Dans Dalil Tounes',
  sharing: 'QR Code et partage',
  call: 'Appeler',
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  directions: 'Itinéraire',
  website: 'Site web',
  social: 'Retrouvez-nous',
  share: 'Partager',
  copy: 'Copier le lien',
  copied: 'Lien copié',
  addContact: 'Ajouter aux contacts',
  requestQuote: 'Demander un devis',
  book: 'Réserver',
  professional: 'Professionnel de proximité',
  contactNotice: 'Coordonnées fournies par le professionnel.',
  address: 'Adresse',
  phone: 'Téléphone',
  secondPhone: 'Second téléphone',
  emailLabel: 'E-mail',
  noServices: 'Les services détaillés seront ajoutés prochainement.',
  noPlatformLinks: 'Les liens vers la plateforme seront ajoutés dès que le métier et la localisation seront normalisés.',
  qrEyebrow: 'Toujours à portée de main',
  qrHeading: 'Scannez ce CV Business',
  qrDescription: 'Le QR Code ouvre directement cette page, sans application à installer.',
  installTitle: "Ajouter à l'écran d'accueil",
  installDescription: 'Ajoutez ce CV Business à votre écran d’accueil pour y accéder comme une application.',
  installIphone: 'iPhone : Safari → Partager → Ajouter à l’écran d’accueil',
  installAndroid: 'Android : Chrome → Menu → Installer l’application',
  back: 'Retour',
  loading: 'Chargement du CV Business...',
  similar: 'Entreprises similaires',
  reservationTitle: 'Réserver',
  reservationName: 'Nom complet',
  reservationPhone: 'Téléphone',
  reservationEmail: 'E-mail',
  reservationDate: 'Date souhaitée',
  reservationTime: 'Heure souhaitée',
  reservationMessage: 'Message',
  reservationSubmit: 'Envoyer la demande',
  reservationSuccess: "Votre demande a bien été envoyée à l'entreprise.",
  reservationNotice: "L'entreprise vous contactera directement pour confirmer. Pensez à téléphoner 24 h avant votre venue.",
  reservationClose: 'Fermer',
  reservationSending: 'Envoi en cours...',
  reservationError: 'Une erreur est survenue. Veuillez réessayer.',
};

const COPY: Record<string, ShowcaseCopy> = {
  fr: FR,
  en: {
    ...FR,
    presentation: 'About',
    introProfessional: 'A local professional for your projects',
    introArtisan: 'A local artisan for your projects',
    readMore: 'Read the presentation',
    readLess: 'Show less',
    services: 'Services',
    gallery: 'Photos and work',
    hours: 'Opening hours',
    practical: 'Practical information',
    booking: 'Booking',
    reviews: 'Customer reviews',
    leaveReview: 'Leave a review',
    platform: 'On Dalil Tounes',
    sharing: 'QR Code and sharing',
    call: 'Call',
    email: 'Email',
    directions: 'Directions',
    website: 'Website',
    social: 'Find us online',
    share: 'Share',
    copy: 'Copy link',
    copied: 'Link copied',
    addContact: 'Add to contacts',
    requestQuote: 'Request a quote',
    book: 'Book',
    professional: 'Local professional',
    contactNotice: 'Contact details provided by the professional.',
    address: 'Address',
    phone: 'Phone',
    secondPhone: 'Second phone',
    emailLabel: 'Email',
    qrEyebrow: 'Always within reach',
    qrHeading: 'Scan this Business CV',
    qrDescription: 'The QR Code opens this page directly, with no app to install.',
    installTitle: 'Add to home screen',
    installDescription: 'Add this Business CV to your home screen for app-like access.',
    installIphone: 'iPhone: Safari → Share → Add to Home Screen',
    installAndroid: 'Android: Chrome → Menu → Install app',
    back: 'Back',
    loading: 'Loading the Business CV...',
  },
  ar: {
    ...FR,
    presentation: 'نبذة عن المؤسسة',
    introProfessional: 'مهني قريب من مشاريعكم',
    introArtisan: 'حرفي قريب من مشاريعكم',
    readMore: 'قراءة التعريف',
    readLess: 'عرض أقل',
    services: 'الخدمات المقترحة',
    gallery: 'الصور والإنجازات',
    hours: 'أوقات العمل',
    practical: 'معلومات عملية',
    booking: 'الحجز',
    reviews: 'آراء العملاء',
    leaveReview: 'أضف رأيك',
    platform: 'على دليل تونس',
    sharing: 'رمز QR والمشاركة',
    call: 'اتصال',
    email: 'البريد الإلكتروني',
    directions: 'الاتجاهات',
    website: 'الموقع الإلكتروني',
    social: 'تابعونا',
    share: 'مشاركة',
    copy: 'نسخ الرابط',
    copied: 'تم نسخ الرابط',
    addContact: 'إضافة إلى جهات الاتصال',
    requestQuote: 'طلب عرض سعر',
    book: 'حجز',
    professional: 'مهني قريب منكم',
    contactNotice: 'بيانات الاتصال مقدمة من المهني.',
    address: 'العنوان',
    phone: 'الهاتف',
    secondPhone: 'الهاتف الثاني',
    emailLabel: 'البريد الإلكتروني',
    qrEyebrow: 'دائماً في متناول اليد',
    qrHeading: 'امسح رمز السيرة المهنية',
    qrDescription: 'يفتح رمز QR هذه الصفحة مباشرة دون تثبيت تطبيق.',
    installTitle: 'إضافة إلى الشاشة الرئيسية',
    installDescription: 'أضف السيرة المهنية إلى شاشتك الرئيسية للوصول السريع.',
    installIphone: 'iPhone: Safari ← مشاركة ← إضافة إلى الشاشة الرئيسية',
    installAndroid: 'Android: Chrome ← القائمة ← تثبيت التطبيق',
    back: 'رجوع',
    loading: 'جارٍ تحميل السيرة المهنية...',
  },
  it: {
    ...FR,
    presentation: 'Presentazione',
    introProfessional: 'Un professionista vicino ai tuoi progetti',
    introArtisan: 'Un artigiano vicino ai tuoi progetti',
    readMore: 'Leggi la presentazione',
    readLess: 'Riduci',
    services: 'Servizi proposti',
    gallery: 'Foto e realizzazioni',
    hours: 'Orari',
    practical: 'Informazioni pratiche',
    booking: 'Prenotazione',
    reviews: 'Recensioni',
    platform: 'Su Dalil Tounes',
    sharing: 'QR Code e condivisione',
    call: 'Chiama',
    directions: 'Indicazioni',
    website: 'Sito web',
    social: 'Seguici',
    share: 'Condividi',
    copy: 'Copia il link',
    copied: 'Link copiato',
    addContact: 'Aggiungi ai contatti',
    requestQuote: 'Richiedi un preventivo',
    book: 'Prenota',
    professional: 'Professionista locale',
    contactNotice: 'Contatti forniti dal professionista.',
    address: 'Indirizzo',
    phone: 'Telefono',
    secondPhone: 'Secondo telefono',
    emailLabel: 'Email',
    qrEyebrow: 'Sempre a portata di mano',
    qrHeading: 'Scansiona questo CV Business',
    qrDescription: 'Il QR Code apre direttamente questa pagina, senza app.',
    installTitle: 'Aggiungi alla schermata Home',
    back: 'Indietro',
    loading: 'Caricamento del CV Business...',
  },
  ru: {
    ...FR,
    presentation: 'О компании',
    introProfessional: 'Профессионал рядом с вашими проектами',
    introArtisan: 'Мастер рядом с вашими проектами',
    readMore: 'Читать описание',
    readLess: 'Свернуть',
    services: 'Услуги',
    gallery: 'Фотографии и работы',
    hours: 'Часы работы',
    practical: 'Практическая информация',
    booking: 'Бронирование',
    reviews: 'Отзывы клиентов',
    platform: 'На Dalil Tounes',
    sharing: 'QR-код и публикация',
    call: 'Позвонить',
    directions: 'Маршрут',
    website: 'Сайт',
    social: 'Мы в сети',
    share: 'Поделиться',
    copy: 'Копировать ссылку',
    copied: 'Ссылка скопирована',
    addContact: 'Добавить в контакты',
    requestQuote: 'Запросить цену',
    book: 'Забронировать',
    professional: 'Местный профессионал',
    contactNotice: 'Контакты предоставлены профессионалом.',
    address: 'Адрес',
    phone: 'Телефон',
    secondPhone: 'Второй телефон',
    emailLabel: 'Email',
    qrEyebrow: 'Всегда под рукой',
    qrHeading: 'Сканируйте Business CV',
    qrDescription: 'QR-код открывает эту страницу напрямую, без приложения.',
    installTitle: 'Добавить на главный экран',
    back: 'Назад',
    loading: 'Загрузка Business CV...',
  },
};

type SectionId =
  | 'services'
  | 'gallery'
  | 'video'
  | 'hours'
  | 'practical'
  | 'booking'
  | 'reviews'
  | 'platform'
  | 'sharing';

type AccordionConfig = {
  id: SectionId;
  title: string;
  icon: LucideIcon;
  badge?: string;
  content: ReactNode;
};

type ActionConfig = {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

const normalizeForComparison = (value: unknown): string =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const normalizeExternalUrl = (value: unknown): string => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
};

const buildWhatsAppUrl = (value: unknown): string => {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';
  const normalized = digits.startsWith('216')
    ? digits
    : digits.startsWith('0')
      ? `216${digits.slice(1)}`
      : `216${digits}`;
  return `https://wa.me/${normalized}`;
};

const isQrCodeImageUrl = (value: unknown): boolean => {
  const url = String(value || '').trim().toLowerCase();
  if (!url) return false;
  return (
    /\.(png|jpe?g|webp|svg|gif)(\?|$)/.test(url) ||
    url.includes('api.qrserver.com') ||
    url.includes('imagekit.io') ||
    url.includes('supabase.co/storage') ||
    url.includes('/qr-code') ||
    url.includes('/qrcode')
  );
};

const isPublished = (value: unknown): boolean => {
  const normalized = normalizeForComparison(value);
  return normalized === 'publie' || normalized === 'published';
};

const themeVariables = (variant: 'artisan' | 'premium'): CSSProperties => {
  if (variant === 'artisan') {
    return {
      '--dt-page': '#f3eeee',
      '--dt-ink': '#5f1111',
      '--dt-accent': '#FCA5A5',
      '--dt-border': '#DC2626',
      '--dt-muted': '#FECACA',
      '--dt-glow': 'rgba(185, 28, 28, 0.28)',
      '--dt-glow-soft': 'rgba(239, 68, 68, 0.18)',
      '--dt-shell-start': '#290707',
      '--dt-shell-mid': '#4f1515',
      '--dt-shell-end': '#190303',
      '--dt-identity-start': '#5f1717fa',
      '--dt-identity-end': '#250707fc',
      '--dt-panel-start': '#641b1beb',
      '--dt-panel-end': '#270707f0',
      '--dt-panel-dark': '#2d0808',
      '--dt-badge-start': '#9f1239',
      '--dt-badge-end': '#be123c',
      '--dt-action-start': '#681c1c',
      '--dt-action-end': '#2e0808',
    } as CSSProperties;
  }

  return {
    '--dt-page': '#eef1ef',
    '--dt-ink': '#0f2d23',
    '--dt-accent': '#F4CE55',
    '--dt-border': '#D4AF37',
    '--dt-muted': '#B8D2C9',
    '--dt-glow': 'rgba(20, 111, 77, 0.34)',
    '--dt-glow-soft': 'rgba(17, 92, 67, 0.25)',
    '--dt-shell-start': '#031d18',
    '--dt-shell-mid': '#042d24',
    '--dt-shell-end': '#011914',
    '--dt-identity-start': '#032a22fa',
    '--dt-identity-end': '#011915fc',
    '--dt-panel-start': '#05352aeb',
    '--dt-panel-end': '#011915f0',
    '--dt-panel-dark': '#021e19',
    '--dt-badge-start': '#076044',
    '--dt-badge-end': '#087a50',
    '--dt-action-start': '#06382d',
    '--dt-action-end': '#011f1a',
  } as CSSProperties;
};

function AccordionSection({
  config,
  open,
  onToggle,
}: {
  config: AccordionConfig;
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = config.icon;
  return (
    <section className={`dt-accordion ${open ? 'open' : ''}`} id={`dt-section-${config.id}`}>
      <button
        type="button"
        className="dt-accordion-trigger"
        aria-expanded={open}
        aria-controls={`dt-panel-${config.id}`}
        onClick={onToggle}
      >
        <Icon aria-hidden="true" />
        <span>{config.title}</span>
        {config.badge && <small className="dt-section-badge">{config.badge}</small>}
        <ChevronRight className="dt-accordion-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="dt-accordion-panel" id={`dt-panel-${config.id}`}>
          {config.content}
        </div>
      )}
    </section>
  );
}

export default function BusinessShowcaseLienoraDetail() {
  const { id: urlId, slug: urlSlug, villeSlug: urlVilleSlug } = useParams<{
    id?: string;
    slug?: string;
    villeSlug?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const text = COPY[language] || FR;
  const isRTL = language === 'ar';

  const [business, setBusiness] = useState<BusinessRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [expandedIntro, setExpandedIntro] = useState(false);
  const [openSection, setOpenSection] = useState<SectionId | null>(null);
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const presentationRef = useRef<HTMLElement>(null);

  const togglePresentation = () => {
    const nextOpen = !presentationOpen;
    setPresentationOpen(nextOpen);

    if (nextOpen) {
      window.requestAnimationFrame(() => {
        presentationRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }
  };

  const tier = useMemo(
    () => mapSubscriptionToTier({ statut_abonnement: business?.statut_abonnement }),
    [business?.statut_abonnement],
  );
  const capabilities = useMemo(() => getBusinessShowcaseCapabilities(tier), [tier]);

  useViewTracking(capabilities.variant === 'directory' ? undefined : business?.id);

  useEffect(() => {
    let cancelled = false;

    const chooseByCity = (rows: BusinessRecord[]): BusinessRecord | null => {
      if (rows.length === 0) return null;
      if (!urlVilleSlug) return rows[0];
      return rows.find(row => generateSlug(String(row.ville || '')) === urlVilleSlug) || rows[0];
    };

    const loadBusiness = async () => {
      setLoading(true);
      setFailed(false);

      try {
        let record: BusinessRecord | null = null;
        const fullUuid = urlId || urlSlug?.match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
        )?.[0];

        if (fullUuid) {
          const { data } = await supabase
            .from('entreprise')
            .select('*')
            .eq('id', fullUuid)
            .maybeSingle();
          record = data as BusinessRecord | null;
        }

        if (!record && urlSlug) {
          const airtableId = urlSlug.match(/(rec[a-z0-9]+)$/i)?.[1];
          if (airtableId) {
            const { data } = await supabase
              .from('entreprise')
              .select('*')
              .eq('id_airtable', airtableId)
              .maybeSingle();
            record = data as BusinessRecord | null;
          }
        }

        if (!record && urlSlug) {
          const normalizedSlug = urlSlug.trim().toLowerCase();
          const { data } = await supabase
            .from('entreprise')
            .select('*')
            .eq('slug', normalizedSlug)
            .limit(20);
          record = chooseByCity((data || []) as BusinessRecord[]);
        }

        if (!record && urlSlug) {
          const shortId = extractShortIdFromSlug(urlSlug);
          if (shortId) {
            const { data } = await supabase.rpc('find_entreprise_by_id_prefix', {
              prefix: shortId,
            });
            record = Array.isArray(data) && data.length > 0
              ? data[0] as BusinessRecord
              : null;
          }
        }

        if (cancelled) return;
        if (!record) {
          setFailed(true);
          return;
        }

        setBusiness(record);
        const canonicalPath = buildEntrepriseUrl(record);
        if (canonicalPath !== '/' && location.pathname !== canonicalPath) {
          navigate(canonicalPath, { replace: true });
        }
      } catch (error) {
        console.error('[BusinessShowcaseLienoraDetail] Unable to load business:', error);
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadBusiness();
    return () => {
      cancelled = true;
    };
  }, [location.pathname, navigate, urlId, urlSlug, urlVilleSlug]);

  if (loading) {
    return (
      <div className="dt-showcase-page flex items-center justify-center text-center text-gray-600">
        <div>
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
          <p>{text.loading}</p>
        </div>
      </div>
    );
  }

  if (failed || !business || capabilities.variant === 'directory') {
    return (
      <div className="dt-showcase-page flex items-center justify-center px-4 text-center">
        <div className="max-w-md">
          <p className="text-sm text-gray-600">{language === 'ar' ? 'تعذر عرض هذا السجل المهني.' : language === 'en' ? 'This Business CV cannot be displayed.' : language === 'it' ? 'Questo CV Business non può essere visualizzato.' : language === 'ru' ? 'Этот Business CV не может быть отображён.' : 'Ce CV Business ne peut pas être affiché.'}</p>
          <button type="button" onClick={() => navigate('/entreprises')} className="mt-4 rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-semibold text-white">
            {language === 'ar' ? 'العودة إلى البحث' : language === 'en' ? 'Back to search' : language === 'it' ? 'Torna alla ricerca' : language === 'ru' ? 'Вернуться к поиску' : 'Retour à la recherche'}
          </button>
        </div>
      </div>
    );
  }

  const visualVariant = capabilities.variant === 'artisan' ? 'artisan' : 'premium';
  const storedPresentationModel = [
    business.modele_presentation,
    business.presentation_model,
    business.modele_cv,
    business.cv_model,
  ].map(value => String(value || '').trim()).find(Boolean)?.toLowerCase() || '';
  const previewPresentationModel = new URLSearchParams(location.search).get('preview-model');
  const presentationStyle = previewPresentationModel === 'portfolio' || storedPresentationModel.includes('portfolio')
    ? 'portfolio'
    : 'business';
  const cvProfile = adaptDalilBusiness(business, {
    language,
    style: presentationStyle,
  });
  const resolvedPresentation = resolveCvPresentation({
    brand: 'dalil_tounes',
    style: cvProfile.display.style,
    entitlements: dalilCapabilitiesToPresentationEntitlements(capabilities),
    content: getDalilContentAvailability(cvProfile),
  });
  const hasAction = (action: CvPresentationAction) =>
    resolvedPresentation.visibleActions.includes(action);
  const hasSection = (section: CvPresentationSection) =>
    resolvedPresentation.visibleSections.includes(section);
  const displayName = cvProfile.identity.name;
  const categoryLabel = cvProfile.identity.activity;
  const translatedDescription = cvProfile.presentation.description;
  const serviceItems = cvProfile.services;
  const aboutText = cvProfile.presentation.about;
  const presentationSummary = aboutText || translatedDescription;
  const presentationDetails = aboutText && translatedDescription && aboutText !== translatedDescription
    ? translatedDescription
    : '';
  const slogan = cvProfile.identity.slogan;
  const canonicalPath = buildEntrepriseUrl(business);
  const canonicalUrl = `https://dalil-tounes.com${canonicalPath}`;
  const coverImage = getCoverImageUrl(business.image_url);
  const logoImage = getLogoUrl(business.logo_url);
  const mapsUrl = cvProfile.location.directionsUrl;
  const whatsappUrl = buildWhatsAppUrl(business.whatsapp || business.telephone);
  const websiteUrl = hasAction('website') ? cvProfile.contact.website : '';
  const rating = cvProfile.reviews.rating || 0;
  const googleReviewCount = cvProfile.reviews.count;
  const schedule = business.horaires_ok ? getParsedSchedule(business.horaires_ok) : null;
  const galleryThumbs = capabilities.showGallery
    ? getGalleryImageUrls(business.image_url, 'thumbnail').slice(0, capabilities.maxPhotos)
    : [];
  const galleryFull = capabilities.showGallery
    ? getGalleryImageUrls(business.image_url, 'full').slice(0, capabilities.maxPhotos)
    : [];
  const galleryItems = galleryThumbs.map((thumbnail, index) => ({
    thumbnail,
    full: galleryFull[index] || thumbnail,
  }));
  const qrImageUrl = isQrCodeImageUrl(business.qr_code_url)
    ? String(business.qr_code_url)
    : '';
  const certification = String(business.statut_carte || '').trim();
  const activityPill = serviceItems[0] || categoryLabel || displayName;
  const contactNotice = notice || text.contactNotice;

  const seo = getBusinessSeoMeta(
    {
      nom: displayName,
      ville: business.ville,
      telephone: business.telephone,
      categorie: categoryLabel,
      description: translatedDescription,
    },
    canonicalUrl,
  );

  const localBusinessSchema = {
    ...generateLocalBusinessSchema({
      nom: displayName,
      ville: business.ville || undefined,
      gouvernorat: business.gouvernorat || undefined,
      adresse: business.adresse || undefined,
      telephone: business.telephone || undefined,
      site_web: canonicalUrl,
      photo_url: business.image_url || undefined,
      image_url: business.image_url || undefined,
      latitude: Number.isFinite(Number(business.latitude)) ? Number(business.latitude) : undefined,
      longitude: Number.isFinite(Number(business.longitude)) ? Number(business.longitude) : undefined,
      note_moyenne: rating || undefined,
      nombre_avis: googleReviewCount || undefined,
      horaires: business.horaires_ok || undefined,
      categorie: categoryLabel,
      statut_abonnement: business.statut_abonnement || undefined,
      description: translatedDescription,
    }),
    url: canonicalUrl,
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    ...(business.ville
      ? [{ name: business.ville, url: `/ville/${generateSlug(business.ville)}` }]
      : []),
    { name: displayName, url: canonicalPath },
  ]);

  const seoMetier = [categoryLabel, ...serviceItems]
    .map(value => findMetierByValue(value))
    .find(Boolean);
  const seoVille = findVilleByLabel(String(business.ville || ''));
  const seoGovernorate = findGouvernoratBySlug(generateSlug(String(business.gouvernorat || '')));
  const sectorLabel = seoMetier?.secteur || categoryLabel;
  const normalizedSector = normalizeForComparison(sectorLabel);
  const seoSector = SEO_SECTEURS.find(sector => {
    const normalizedLabel = normalizeForComparison(sector.label);
    return normalizedSector.includes(normalizedLabel) || normalizedLabel.includes(normalizedSector);
  });

  const socialLinks = hasSection('social_links')
    ? [
        { label: 'Instagram', href: normalizeExternalUrl(business['Lien Instagram']), icon: Instagram },
        { label: 'Facebook', href: normalizeExternalUrl(business['lien facebook']), icon: Facebook },
        { label: 'LinkedIn', href: normalizeExternalUrl(business['Lien LinkedIn']), icon: Linkedin },
        { label: 'YouTube', href: normalizeExternalUrl(business['Lien YouTube']), icon: Youtube },
        { label: 'TikTok', href: normalizeExternalUrl(business['Lien TikTok']), icon: Music2 },
      ].filter(link => link.href).slice(0, capabilities.variant === 'artisan' ? 2 : undefined)
    : [];

  const primaryActions = [
    {
      label: language === 'ar'
        ? 'تثبيت التطبيق'
        : language === 'en'
          ? 'Install the app'
          : language === 'it'
            ? "Installa l'app"
            : language === 'ru'
              ? 'Установить приложение'
              : "Installer l’application",
      href: `/qr-business/${business.id}`,
      icon: Smartphone,
    },
    hasAction('call') && business.telephone && {
      label: text.call,
      href: `tel:${business.telephone}`,
      icon: Phone,
    },
    hasAction('whatsapp') && whatsappUrl && {
      label: text.whatsapp,
      href: whatsappUrl,
      icon: MessageCircle,
      external: true,
    },
    hasAction('email') && business.email && {
      label: text.email,
      href: `mailto:${business.email}`,
      icon: Mail,
    },
    hasAction('directions') && mapsUrl && {
      label: text.directions,
      href: mapsUrl,
      icon: Navigation,
      external: true,
    },
    websiteUrl && {
      label: text.website,
      href: websiteUrl,
      icon: Globe2,
      external: true,
    },
  ].filter((action): action is ActionConfig => Boolean(action));

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setNotice(text.copied);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setNotice(text.copy);
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: displayName,
          text: slogan || translatedDescription,
          url: canonicalUrl,
        });
      } else {
        await copyLink();
      }
    } catch {
      setNotice(text.share);
    }
  };

  const downloadContact = () => {
    const escape = (value: string) => value.replace(/([,;])/g, '\\$1');
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${escape(displayName)}`,
      `ORG:${escape(displayName)}`,
      business.telephone ? `TEL;TYPE=WORK:${business.telephone}` : '',
      business.email ? `EMAIL:${business.email}` : '',
      business.adresse
        ? `ADR;TYPE=WORK:;;${escape(business.adresse)};${escape(String(business.ville || ''))};;;Tunisie`
        : '',
      websiteUrl ? `URL:${websiteUrl}` : '',
      `NOTE:CV Business Dalil Tounes - ${canonicalUrl}`,
      'END:VCARD',
    ].filter(Boolean).join('\r\n');
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${business.slug || generateSlug(displayName)}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice(text.addContact);
  };

  const requestQuote = () => {
    const message = `Bonjour ${displayName}, je souhaite obtenir plus d'informations sur vos services.`;
    if (whatsappUrl) {
      window.open(`${whatsappUrl}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      return;
    }
    if (business.email) {
      window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(text.requestQuote)}&body=${encodeURIComponent(message)}`;
      return;
    }
    setNotice(text.contactNotice);
  };

  const openBooking = () => {
    setOpenSection('booking');
    window.setTimeout(() => {
      document.getElementById('dt-section-booking')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 50);
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/entreprises');
  };

  const platformLinks = [
    seoMetier && {
      label: seoMetier.label,
      href: `/metier/${seoMetier.slug}`,
      icon: Briefcase,
    },
    seoVille && {
      label: seoVille.label,
      href: `/ville/${seoVille.slug}`,
      icon: MapPin,
    },
    seoGovernorate && {
      label: seoGovernorate.label,
      href: `/gouvernorat/${seoGovernorate.slug}`,
      icon: Navigation,
    },
    seoSector && {
      label: seoSector.label,
      href: `/secteur/${seoSector.slug}`,
      icon: Globe2,
    },
  ].filter(Boolean) as Array<{ label: string; href: string; icon: LucideIcon }>;

  const galleryContent = galleryItems.length > 0 ? (
    <>
      <div className="dt-gallery-main">
        {galleryItems.slice(0, 3).map((item, index) => (
          <button
            type="button"
            className="dt-gallery-item"
            onClick={() => setSelectedImage(item.full)}
            key={`${item.thumbnail}-${index}`}
          >
            <img
              src={item.thumbnail}
              alt={`Réalisation ${index + 1} de ${displayName}`}
              loading="lazy"
              decoding="async"
            />
            <span>Réalisation {index + 1}</span>
          </button>
        ))}
      </div>
      {galleryItems.length > 3 && (
        <div className="dt-gallery-extra">
          {galleryItems.slice(3).map((item, index) => (
            <button
              type="button"
              className="dt-gallery-item"
              onClick={() => setSelectedImage(item.full)}
              key={`${item.thumbnail}-${index + 3}`}
            >
              <img
                src={item.thumbnail}
                alt={`Réalisation ${index + 4} de ${displayName}`}
                loading="lazy"
                decoding="async"
              />
              <span>Réalisation {index + 4}</span>
            </button>
          ))}
        </div>
      )}
    </>
  ) : null;

  const practicalContent = (
    <div>
      <div className="dt-info-list">
        {business.adresse && (
          <div className="dt-info-row">
            <MapPin aria-hidden="true" />
            <span><b>{text.address}</b>{business.adresse}</span>
          </div>
        )}
        {business.telephone && (
          <div className="dt-info-row">
            <Phone aria-hidden="true" />
            <span><b>{text.phone}</b>{business.telephone}</span>
          </div>
        )}
        {business.telephone2 && (
          <div className="dt-info-row">
            <Phone aria-hidden="true" />
            <span><b>{text.secondPhone}</b>{business.telephone2}</span>
          </div>
        )}
        {business.email && (
          <div className="dt-info-row">
            <Mail aria-hidden="true" />
            <span><b>{text.emailLabel}</b>{business.email}</span>
          </div>
        )}
        {websiteUrl && (
          <div className="dt-info-row">
            <Globe2 aria-hidden="true" />
            <span>
              <b>{text.website}</b>
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer">{websiteUrl}</a>
            </span>
          </div>
        )}
      </div>
      {socialLinks.length > 0 && (
        <div className="dt-socials">
          <b>{text.social}</b>
          <div className="dt-social-grid">
            {socialLinks.map(link => {
              const Icon = link.icon;
              return (
                <a
                  className="dt-social-link"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={link.label}
                >
                  <Icon aria-hidden="true" />
                  <span>{link.label}</span>
                  <ExternalLink aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const sharingContent = (
    <div className="dt-qr-card">
      <div className="dt-qr-copy">
        <p className="dt-eyebrow">{text.qrEyebrow}</p>
        <h2>{text.qrHeading}</h2>
        <p>{text.qrDescription}</p>
      </div>
      <div className="dt-qr-wrap">
        {qrImageUrl ? (
          <img
            src={qrImageUrl}
            alt={`QR Code de ${displayName}`}
            width={100}
            height={100}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <QRCodeSVG value={canonicalUrl} size={100} level="M" title={`QR Code de ${displayName}`} />
        )}
      </div>
      <div className="dt-qr-actions">
        {capabilities.variant === 'premium' && (
          <Link className="dt-qr-action" to={`/qr-business/${business.id}`}>
            <QrCode aria-hidden="true" />
            {language === 'ar' ? 'تثبيت أو عرض CV Business' : language === 'en' ? 'Install / present my Business CV' : language === 'it' ? 'Installa / mostra il mio CV Business' : language === 'ru' ? 'Установить / показать Business CV' : 'Installer / présenter mon CV Business'}
          </Link>
        )}
        <button type="button" className="dt-qr-action" onClick={() => void share()}>
          <Share2 aria-hidden="true" />{text.share}
        </button>
        <button type="button" className="dt-qr-action" onClick={() => void copyLink()}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? text.copied : text.copy}
        </button>
        <button type="button" className="dt-qr-action" onClick={downloadContact}>
          <Contact aria-hidden="true" />{text.addContact}
        </button>
      </div>
      <details className="dt-install-help">
        <summary>{text.installTitle}</summary>
        <p>{text.installDescription}</p>
        <ul>
          <li>{text.installIphone}</li>
          <li>{text.installAndroid}</li>
        </ul>
      </details>
    </div>
  );

  const sections = [
    hasSection('services') && {
      id: 'services' as const,
      title: text.services,
      icon: Briefcase,
      badge: String(serviceItems.length),
      content: serviceItems.length > 0 ? (
        <div className="dt-service-grid">
          {serviceItems.map((service, index) => (
            <div className="dt-service-item" key={`${service}-${index}`}>
              <span className="dt-service-icon"><Check aria-hidden="true" /></span>
              <span>{service}</span>
            </div>
          ))}
        </div>
      ) : <p className="dt-empty-copy">{text.noServices}</p>,
    },
    galleryContent && {
      id: 'gallery' as const,
      title: text.gallery,
      icon: Images,
      badge: String(galleryItems.length),
      content: galleryContent,
    },
    hasSection('video') && business.video_url && {
      id: 'video' as const,
      title: text.video,
      icon: Images,
      badge: '1',
      content: (
        <VideoPlayer
          videoUrls={business.video_url}
          maxVideos={capabilities.maxVideos}
          className="overflow-hidden rounded-xl"
        />
      ),
    },
    schedule && schedule.schedule.length > 0 && {
      id: 'hours' as const,
      title: text.hours,
      icon: Clock3,
      badge: schedule.isCurrentlyOpen
        ? translateOpenStatus(language)
        : translateClosedStatus(language),
      content: (
        <dl className="dt-hours">
          {schedule.schedule.map((day, index) => (
            <div className={`dt-hour-row ${day.isOpen ? '' : 'closed'}`} key={`${day.day}-${index}`}>
              <dt>{getDayName(index, language)}</dt>
              <dd>{day.hours}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: 'practical' as const,
      title: text.practical,
      icon: Info,
      content: practicalContent,
    },
    hasAction('reservation') && {
      id: 'booking' as const,
      title: text.booking,
      icon: CalendarDays,
      content: (
        <ReservationForm
          businessId={business.id}
          businessName={displayName}
          businessEmail={business.email || business.email2 || undefined}
          businessPhone={business.telephone || business.whatsapp || business.telephone2 || undefined}
          accentColor={visualVariant === 'artisan' ? '#FCA5A5' : '#F4CE55'}
          isRTL={isRTL}
          translations={{
            title: text.reservationTitle,
            formName: text.reservationName,
            formPhone: text.reservationPhone,
            formEmail: text.reservationEmail,
            formDate: text.reservationDate,
            formTime: text.reservationTime,
            formMessage: text.reservationMessage,
            formSubmit: text.reservationSubmit,
            success: text.reservationSuccess,
            notice: text.reservationNotice,
            close: text.reservationClose,
            sending: text.reservationSending,
            error: text.reservationError,
          }}
        />
      ),
    },
    hasSection('reviews') && {
      id: 'reviews' as const,
      title: text.reviews,
      icon: Star,
      content: (
        <div>
          <BusinessReviews entrepriseId={business.id} />
          <div className="mt-3 rounded-xl border border-[#D4AF37]/20 bg-black/10 p-3">
            <p className="mb-3 text-xs font-bold text-[#F4CE55]">{text.leaveReview}</p>
            <EntrepriseAvisForm entrepriseId={business.id} />
          </div>
        </div>
      ),
    },
    capabilities.showPlatformLinks && {
      id: 'platform' as const,
      title: text.platform,
      icon: Building2,
      badge: platformLinks.length ? String(platformLinks.length) : undefined,
      content: platformLinks.length > 0 ? (
        <div className="dt-platform-grid">
          {platformLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link className="dt-platform-link" to={link.href} key={link.href}>
                <Icon aria-hidden="true" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      ) : <p className="dt-empty-copy">{text.noPlatformLinks}</p>,
    },
    (capabilities.showQrCode || capabilities.showShareTools) && {
      id: 'sharing' as const,
      title: text.sharing,
      icon: QrCode,
      content: sharingContent,
    },
  ].filter(Boolean) as AccordionConfig[];

  if (resolvedPresentation.style === 'portfolio') {
    return (
      <main dir={isRTL ? 'rtl' : 'ltr'}>
        <SEOHead
          title={seo.title}
          description={seo.description}
          keywords={seo.keywords}
          image={coverImage}
          canonical={canonicalUrl}
          currentPath={canonicalPath}
          type="website"
          author={displayName}
          noindex={!isPublished(business.statut_validation)}
        />
        <StructuredData data={[localBusinessSchema, breadcrumbSchema]} />
        <CvPortfolioPresentation
          language={language}
          profile={cvProfile}
          presentation={resolvedPresentation}
          coverImage={coverImage}
          logoImage={logoImage}
          productLabel={resolvedPresentation.productName}
          certification={certification}
          actions={primaryActions}
          gallery={galleryItems}
          onBack={handleBack}
          bookingContent={sections.find(section => section.id === 'booking')?.content}
          onQuote={requestQuote}
          onDownloadContact={downloadContact}
          onSelectImage={setSelectedImage}
          notice={contactNotice}
        />
        {selectedImage && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setSelectedImage('')}
          >
            <button
              type="button"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37] bg-[#0f2d23] text-[#F4CE55]"
              onClick={() => setSelectedImage('')}
              aria-label={text.reservationClose}
            >
              <X aria-hidden="true" />
            </button>
            <img
              src={selectedImage}
              alt={`${text.gallery}: ${displayName}`}
              className="max-h-[90vh] max-w-full rounded-xl object-contain"
              onClick={event => event.stopPropagation()}
            />
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="dt-showcase-page" style={themeVariables(visualVariant)} dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        image={coverImage}
        canonical={canonicalUrl}
        currentPath={canonicalPath}
        type="website"
        author={displayName}
        noindex={!isPublished(business.statut_validation)}
      />
      <StructuredData data={[localBusinessSchema, breadcrumbSchema]} />

      <div className="dt-showcase-wrap">
        <button type="button" className="dt-back-button" onClick={handleBack}>
          <ArrowLeft aria-hidden="true" />{text.back}
        </button>

        <article className="dt-showcase">
          <header>
            <div className="dt-cover">
              <img
                src={coverImage}
                alt={`${displayName}${business.ville ? ` à ${business.ville}` : ''}`}
                width={1200}
                height={630}
                loading="eager"
                decoding="async"
                {...{ fetchpriority: 'high' }}
              />
            </div>
            <div className="dt-identity">
              <div className="dt-logo">
                <img
                  src={logoImage}
                  alt={`Logo ${displayName}`}
                  width={82}
                  height={82}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <span className="dt-activity-pill">⚒ {activityPill}</span>
              <div className="dt-identity-panel">
                <small className="dt-product-label">{capabilities.productLabel}</small>
                <h1>{displayName}</h1>
                <strong className="dt-professional-badge">
                  {certification || `★ ${text.professional}`}
                </strong>
                {slogan && <p className="dt-slogan">{slogan}</p>}
                {(business.ville || business.gouvernorat) && (
                  <p className="dt-location">
                    <MapPin aria-hidden="true" />
                    {[business.ville, business.gouvernorat]
                      .filter((value, index, values) => value && values.indexOf(value) === index)
                      .join(', ')}
                  </p>
                )}
                {rating > 0 && (
                  <p className="dt-rating">
                    <Star aria-hidden="true" fill="currentColor" />
                    {rating.toFixed(1)} / 5 {googleReviewCount > 0 ? `(${googleReviewCount})` : ''}
                  </p>
                )}
              </div>
            </div>
          </header>

          <section className="dt-actions" aria-label="Actions">
            {primaryActions.length > 0 && (
              <div
                className="dt-primary-actions"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(primaryActions.length, 4)}, minmax(0, 1fr))`,
                }}
              >
                {primaryActions.map(action => {
                  const Icon = action.icon;
                  return (
                    <a
                      className="dt-primary-action"
                      href={action.href}
                      target={action.external ? '_blank' : undefined}
                      rel={action.external ? 'noopener noreferrer' : undefined}
                      key={action.label}
                    >
                      <Icon aria-hidden="true" />
                      <span>{action.label}</span>
                    </a>
                  );
                })}
              </div>
            )}
            <div className="dt-secondary-actions">
              {(hasAction('reservation') || whatsappUrl || business.email) && (
                <button
                  type="button"
                  className="dt-secondary-action"
                  onClick={hasAction('reservation') ? openBooking : requestQuote}
                >
                  {hasAction('reservation')
                    ? <CalendarDays aria-hidden="true" />
                    : <FileText aria-hidden="true" />}
                  {hasAction('reservation') ? text.book : text.requestQuote}
                </button>
              )}
              <button type="button" className="dt-secondary-action" onClick={downloadContact}>
                <Contact aria-hidden="true" />{text.addContact}
              </button>
            </div>
            <p className="dt-action-notice" role="status" aria-live="polite">{contactNotice}</p>
          </section>

          <div className="dt-showcase-body">
            {(translatedDescription || aboutText) && (
              <section
                ref={presentationRef}
                className={`dt-intro dt-presentation-accordion ${presentationOpen ? 'open' : ''} ${expandedIntro ? 'expanded' : ''}`}
              >
                <button
                  type="button"
                  className="dt-accordion-trigger dt-presentation-trigger"
                  aria-expanded={presentationOpen}
                  aria-controls="dt-presentation-panel"
                  onClick={togglePresentation}
                >
                  <span className="dt-presentation-icon" aria-hidden="true">i</span>
                  <span>{text.presentation}</span>
                  <span className="dt-presentation-spacer" aria-hidden="true" />
                  <ChevronRight className="dt-accordion-chevron dt-presentation-chevron" aria-hidden="true" />
                </button>
                <div className="dt-presentation-content" id="dt-presentation-panel">
                  <p className="dt-eyebrow">{text.presentation}</p>
                  <h2>{visualVariant === 'artisan' ? text.introArtisan : text.introProfessional}</h2>
                  {presentationSummary && (
                    <p className="dt-intro-description">{presentationSummary}</p>
                  )}
                  {expandedIntro && presentationDetails && (
                    <div className="dt-about-quote">{presentationDetails}</div>
                  )}
                  {(presentationSummary.length > 220 || presentationDetails) && (
                    <button
                      type="button"
                      className="dt-read-intro"
                      aria-expanded={expandedIntro}
                      onClick={() => setExpandedIntro(value => !value)}
                    >
                      {expandedIntro ? text.readLess : text.readMore}
                    </button>
                  )}
                </div>
              </section>
            )}

            <div className="dt-accordion-list">
              {sections.map(section => (
                <AccordionSection
                  config={section}
                  open={openSection === section.id}
                  onToggle={() => setOpenSection(current => current === section.id ? null : section.id)}
                  key={section.id}
                />
              ))}
            </div>
          </div>

          <p className="dt-powered-by">
            {language === 'ar' ? 'مدعوم من' : language === 'en' ? 'Powered by' : language === 'it' ? 'Offerto da' : language === 'ru' ? 'При поддержке' : 'Propulsé par'}
            <img src="/images/logo_dalil_tounes_crop.png" alt="" />
            Dalil Tounes
          </p>
        </article>

        {capabilities.showSimilarBusinesses && (
          <section className="dt-similar-wrap rounded-2xl bg-[#0f0f0f] p-4">
            <h2 className="sr-only">{text.similar}</h2>
            <SimilarBusinesses
              businessId={business.id}
              categorie={categoryLabel}
              ville={business.ville || undefined}
              gouvernorat={business.gouvernorat || undefined}
            />
          </section>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImage('')}
        >
          <button
            type="button"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37] bg-[#0f2d23] text-[#F4CE55]"
            onClick={() => setSelectedImage('')}
            aria-label={text.reservationClose}
          >
            <X aria-hidden="true" />
          </button>
          <img
            src={selectedImage}
            alt={`${text.gallery}: ${displayName}`}
            className="max-h-[90vh] max-w-full rounded-xl object-contain"
            onClick={event => event.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
