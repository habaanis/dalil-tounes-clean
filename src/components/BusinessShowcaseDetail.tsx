import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Check,
  Copy,
  Facebook,
  Globe2,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
  Share2,
  Star,
  Youtube,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import {
  mapSubscriptionToTier,
  type SubscriptionTier,
} from '../lib/subscriptionTiers';
import { getBusinessShowcaseCapabilities } from '../lib/businessShowcaseConfig';
import {
  buildEntrepriseUrl,
  extractShortIdFromSlug,
  generateSlug,
} from '../lib/slugify';
import { getCoverImageUrl } from '../lib/imagekitUtils';
import { getLogoUrl } from '../lib/logoUtils';
import { getMultilingualField } from '../lib/databaseI18n';
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
import { getDayName, getParsedSchedule } from '../lib/horaireUtils';
import { useViewTracking } from '../hooks/useViewTracking';
import { SEOHead } from './SEOHead';
import StructuredData from './StructuredData';
import Breadcrumb from './seo/Breadcrumb';
import ImageGallery from './ImageGallery';
import VideoPlayer from './VideoPlayer';
import BusinessReviews from './BusinessReviews';
import EntrepriseAvisForm from './EntrepriseAvisForm';
import ReservationForm from './ReservationForm';
import SimilarBusinesses from './seo/SimilarBusinesses';
import { BusinessDetail as LegacyBusinessDetail } from './BusinessDetail';

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
  about: string;
  services: string;
  achievements: string;
  practical: string;
  openingHours: string;
  gallery: string;
  video: string;
  reviews: string;
  leaveReview: string;
  platform: string;
  social: string;
  call: string;
  whatsapp: string;
  email: string;
  website: string;
  directions: string;
  share: string;
  copied: string;
  qr: string;
  similar: string;
  back: string;
  loading: string;
  noServices: string;
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

const COPY: Record<string, ShowcaseCopy> = {
  fr: {
    about: 'Présentation',
    services: 'Services et spécialités',
    achievements: 'Réalisations',
    practical: 'Informations pratiques',
    openingHours: 'Horaires',
    gallery: 'Photos et réalisations',
    video: 'Vidéo',
    reviews: 'Avis clients',
    leaveReview: 'Donner un avis',
    platform: 'Découvrir aussi sur Dalil Tounes',
    social: 'Réseaux sociaux',
    call: 'Appeler',
    whatsapp: 'WhatsApp',
    email: 'Email',
    website: 'Site web',
    directions: 'Itinéraire',
    share: 'Partager',
    copied: 'Lien copié',
    qr: 'QR code professionnel',
    similar: 'Entreprises similaires',
    back: 'Retour',
    loading: 'Chargement de la vitrine...',
    noServices: 'Les services détaillés seront ajoutés prochainement.',
    reservationTitle: 'Réserver',
    reservationName: 'Nom complet',
    reservationPhone: 'Téléphone',
    reservationEmail: 'Email',
    reservationDate: 'Date souhaitée',
    reservationTime: 'Heure souhaitée',
    reservationMessage: 'Message',
    reservationSubmit: 'Envoyer la demande',
    reservationSuccess: "Votre demande a bien été envoyée à l'entreprise.",
    reservationNotice: "L'entreprise vous contactera directement pour confirmer. Pensez à téléphoner 24 h avant votre venue.",
    reservationClose: 'Fermer',
    reservationSending: 'Envoi en cours...',
    reservationError: 'Une erreur est survenue. Veuillez réessayer.',
  },
  en: {
    about: 'About',
    services: 'Services and specialties',
    achievements: 'Achievements',
    practical: 'Practical information',
    openingHours: 'Opening hours',
    gallery: 'Photos and achievements',
    video: 'Video',
    reviews: 'Customer reviews',
    leaveReview: 'Leave a review',
    platform: 'Discover more on Dalil Tounes',
    social: 'Social media',
    call: 'Call',
    whatsapp: 'WhatsApp',
    email: 'Email',
    website: 'Website',
    directions: 'Directions',
    share: 'Share',
    copied: 'Link copied',
    qr: 'Professional QR code',
    similar: 'Similar businesses',
    back: 'Back',
    loading: 'Loading the showcase...',
    noServices: 'Detailed services will be added soon.',
    reservationTitle: 'Book',
    reservationName: 'Full name',
    reservationPhone: 'Phone',
    reservationEmail: 'Email',
    reservationDate: 'Preferred date',
    reservationTime: 'Preferred time',
    reservationMessage: 'Message',
    reservationSubmit: 'Send request',
    reservationSuccess: 'Your request has been sent to the business.',
    reservationNotice: 'The business will contact you directly to confirm. Please call 24 hours before your visit.',
    reservationClose: 'Close',
    reservationSending: 'Sending...',
    reservationError: 'An error occurred. Please try again.',
  },
  ar: {
    about: 'نبذة عن المؤسسة',
    services: 'الخدمات والاختصاصات',
    achievements: 'الإنجازات',
    practical: 'معلومات عملية',
    openingHours: 'أوقات العمل',
    gallery: 'الصور والإنجازات',
    video: 'فيديو',
    reviews: 'آراء العملاء',
    leaveReview: 'أضف رأيك',
    platform: 'اكتشف المزيد على دليل تونس',
    social: 'الشبكات الاجتماعية',
    call: 'اتصال',
    whatsapp: 'واتساب',
    email: 'البريد الإلكتروني',
    website: 'الموقع الإلكتروني',
    directions: 'الاتجاهات',
    share: 'مشاركة',
    copied: 'تم نسخ الرابط',
    qr: 'رمز QR المهني',
    similar: 'مؤسسات مشابهة',
    back: 'رجوع',
    loading: 'جارٍ تحميل الواجهة...',
    noServices: 'ستتم إضافة تفاصيل الخدمات قريباً.',
    reservationTitle: 'حجز',
    reservationName: 'الاسم الكامل',
    reservationPhone: 'الهاتف',
    reservationEmail: 'البريد الإلكتروني',
    reservationDate: 'التاريخ المطلوب',
    reservationTime: 'الوقت المطلوب',
    reservationMessage: 'رسالة',
    reservationSubmit: 'إرسال الطلب',
    reservationSuccess: 'تم إرسال طلبك إلى المؤسسة.',
    reservationNotice: 'ستتصل بك المؤسسة للتأكيد. يرجى الاتصال قبل 24 ساعة من الموعد.',
    reservationClose: 'إغلاق',
    reservationSending: 'جارٍ الإرسال...',
    reservationError: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
  },
  it: {
    about: 'Presentazione',
    services: 'Servizi e specialità',
    achievements: 'Realizzazioni',
    practical: 'Informazioni pratiche',
    openingHours: 'Orari',
    gallery: 'Foto e realizzazioni',
    video: 'Video',
    reviews: 'Recensioni',
    leaveReview: 'Lascia una recensione',
    platform: 'Scopri anche su Dalil Tounes',
    social: 'Social network',
    call: 'Chiama',
    whatsapp: 'WhatsApp',
    email: 'Email',
    website: 'Sito web',
    directions: 'Indicazioni',
    share: 'Condividi',
    copied: 'Link copiato',
    qr: 'QR professionale',
    similar: 'Aziende simili',
    back: 'Indietro',
    loading: 'Caricamento della vetrina...',
    noServices: 'I servizi dettagliati saranno aggiunti presto.',
    reservationTitle: 'Prenota',
    reservationName: 'Nome completo',
    reservationPhone: 'Telefono',
    reservationEmail: 'Email',
    reservationDate: 'Data desiderata',
    reservationTime: 'Ora desiderata',
    reservationMessage: 'Messaggio',
    reservationSubmit: 'Invia richiesta',
    reservationSuccess: "La richiesta è stata inviata all'azienda.",
    reservationNotice: "L'azienda ti contatterà per confermare. Chiama 24 ore prima della visita.",
    reservationClose: 'Chiudi',
    reservationSending: 'Invio...',
    reservationError: 'Si è verificato un errore. Riprova.',
  },
  ru: {
    about: 'О компании',
    services: 'Услуги и специализации',
    achievements: 'Работы',
    practical: 'Практическая информация',
    openingHours: 'Часы работы',
    gallery: 'Фотографии и работы',
    video: 'Видео',
    reviews: 'Отзывы клиентов',
    leaveReview: 'Оставить отзыв',
    platform: 'Больше на Dalil Tounes',
    social: 'Социальные сети',
    call: 'Позвонить',
    whatsapp: 'WhatsApp',
    email: 'Email',
    website: 'Сайт',
    directions: 'Маршрут',
    share: 'Поделиться',
    copied: 'Ссылка скопирована',
    qr: 'Профессиональный QR-код',
    similar: 'Похожие компании',
    back: 'Назад',
    loading: 'Загрузка витрины...',
    noServices: 'Подробные услуги будут добавлены позже.',
    reservationTitle: 'Забронировать',
    reservationName: 'Полное имя',
    reservationPhone: 'Телефон',
    reservationEmail: 'Email',
    reservationDate: 'Желаемая дата',
    reservationTime: 'Желаемое время',
    reservationMessage: 'Сообщение',
    reservationSubmit: 'Отправить запрос',
    reservationSuccess: 'Ваш запрос отправлен компании.',
    reservationNotice: 'Компания свяжется с вами для подтверждения. Позвоните за 24 часа до визита.',
    reservationClose: 'Закрыть',
    reservationSending: 'Отправка...',
    reservationError: 'Произошла ошибка. Попробуйте ещё раз.',
  },
};

const normalizeForComparison = (value: unknown): string =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const firstText = (business: BusinessRecord, keys: string[]): string => {
  for (const key of keys) {
    const value = business[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

const splitList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean);
  }
  return String(value || '')
    .split(/[,;\n]+/)
    .map(item => item.trim())
    .filter(Boolean)
    .filter(item => item !== '{}');
};

const numericValue = (value: unknown): number => {
  const parsed = Number(String(value ?? '').replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

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

const buildMapsUrl = (business: BusinessRecord): string => {
  const existing = firstText(business, ['BTN_Maps', 'google_url']);
  if (/^https?:\/\//i.test(existing)) return existing;

  const coordinatePair = existing.match(
    /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/,
  );
  if (coordinatePair) {
    return `https://www.google.com/maps/search/?api=1&query=${coordinatePair[1]},${coordinatePair[2]}`;
  }

  const latitude = Number(business.latitude);
  const longitude = Number(business.longitude);
  if (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    (latitude !== 0 || longitude !== 0)
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }

  const location = [business.adresse, business.ville, business.gouvernorat, 'Tunisie']
    .filter(Boolean)
    .join(' ');
  return location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    : '';
};

const isPublished = (value: unknown): boolean => {
  const normalized = normalizeForComparison(value);
  return normalized === 'publie' || normalized === 'published';
};

const themeForTier = (tier: SubscriptionTier) => {
  if (tier === 'artisan') {
    return {
      page: '#15090d',
      card: '#4f1515',
      accent: '#FCA5A5',
      border: '#DC2626',
    };
  }

  if (tier === 'elite' || tier === 'custom') {
    return {
      page: '#080808',
      card: '#050505',
      accent: '#D4AF37',
      border: '#D4AF37',
    };
  }

  return {
    page: '#07130f',
    card: '#064E3B',
    accent: '#D4AF37',
    border: '#D4AF37',
  };
};

function Section({
  title,
  children,
  accent,
}: {
  title: string;
  children: ReactNode;
  accent: string;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/15 p-4 md:p-5">
      <h2
        className="mb-3 text-base font-semibold"
        style={{ color: accent, fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function ActionLink({
  href,
  label,
  icon,
  accent,
  external = false,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  accent: string;
  external?: boolean;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition hover:-translate-y-0.5 hover:bg-white/10"
      style={{ borderColor: `${accent}70`, color: accent }}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

export default function BusinessShowcaseDetail() {
  const { id: urlId, slug: urlSlug, villeSlug: urlVilleSlug } = useParams<{
    id?: string;
    slug?: string;
    villeSlug?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const text = COPY[language] || COPY.fr;
  const isRTL = language === 'ar';

  const [business, setBusiness] = useState<BusinessRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  const tier = useMemo(
    () => mapSubscriptionToTier({ statut_abonnement: business?.statut_abonnement }),
    [business?.statut_abonnement],
  );
  const capabilities = useMemo(() => getBusinessShowcaseCapabilities(tier), [tier]);
  const theme = useMemo(() => themeForTier(tier), [tier]);

  useViewTracking(capabilities.variant === 'directory' ? undefined : business?.id);

  useEffect(() => {
    let cancelled = false;

    const chooseByCity = (rows: BusinessRecord[]): BusinessRecord | null => {
      if (rows.length === 0) return null;
      if (!urlVilleSlug) return rows[0];
      return (
        rows.find(row => generateSlug(String(row.ville || '')) === urlVilleSlug) ||
        rows[0]
      );
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
        console.error('[BusinessShowcaseDetail] Unable to load business:', error);
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadBusiness();
    return () => {
      cancelled = true;
    };
  }, [location.pathname, navigate, urlId, urlSlug, urlVilleSlug]);

  const displayName = business
    ? String(getMultilingualField(business, 'nom', language, true) || business.nom || '')
    : '';
  const categoryLabel = business ? splitList(business.categorie).join(', ') : '';
  const translatedDescription = business
    ? String(getMultilingualField(business, 'description', language, true) || business.description || '')
    : '';
  const translatedServices = business
    ? String(getMultilingualField(business, 'services', language, true) || business.services || '')
    : '';
  const serviceItems = business
    ? splitList(
        translatedServices ||
          business.sous_categories_texte ||
          business.sous_categories_clean,
      )
    : [];
  const aboutText = business
    ? firstText(business, ['a_propos', 'about', 'À propos', 'A propos'])
    : '';
  const achievementsText = business
    ? firstText(business, [
        'realisations',
        'réalisations',
        'Realisations',
        'Réalisations',
        'portfolio',
        'projets',
      ])
    : '';

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#0f0f0f] px-4 text-center text-gray-300">
        <div>
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
          <p>{text.loading}</p>
        </div>
      </div>
    );
  }

  if (failed || !business) {
    return <LegacyBusinessDetail />;
  }

  if (capabilities.variant === 'directory') {
    return <LegacyBusinessDetail businessId={business.id} />;
  }

  const canonicalPath = buildEntrepriseUrl(business);
  const canonicalUrl = `https://dalil-tounes.com${canonicalPath}`;
  const coverImage = getCoverImageUrl(business.image_url);
  const logoImage = getLogoUrl(business.logo_url);
  const mapsUrl = buildMapsUrl(business);
  const whatsappUrl = buildWhatsAppUrl(business.whatsapp || business.telephone);
  const websiteUrl = capabilities.showWebsite
    ? normalizeExternalUrl(business.site_web)
    : '';
  const rating = numericValue(business['Note Google Globale']);
  const googleReviewCount = Math.floor(numericValue(business['Compteur Avis Google']));
  const schedule = business.horaires_ok ? getParsedSchedule(business.horaires_ok) : null;
  const qrImageUrl = isQrCodeImageUrl(business.qr_code_url)
    ? String(business.qr_code_url)
    : '';
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
      latitude: Number.isFinite(Number(business.latitude))
        ? Number(business.latitude)
        : undefined,
      longitude: Number.isFinite(Number(business.longitude))
        ? Number(business.longitude)
        : undefined,
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

  const socialLinks = capabilities.showSocialLinks
    ? [
        { label: 'Instagram', href: normalizeExternalUrl(business['Lien Instagram']), icon: <Instagram size={16} /> },
        { label: 'Facebook', href: normalizeExternalUrl(business['lien facebook']), icon: <Facebook size={16} /> },
        { label: 'LinkedIn', href: normalizeExternalUrl(business['Lien LinkedIn']), icon: <Linkedin size={16} /> },
        { label: 'YouTube', href: normalizeExternalUrl(business['Lien YouTube']), icon: <Youtube size={16} /> },
        { label: 'TikTok', href: normalizeExternalUrl(business['Lien TikTok']), icon: <Send size={16} /> },
      ].filter(link => link.href)
    : [];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleShare = () => {
    const message = `${displayName}${business.ville ? ` - ${business.ville}` : ''}\n${canonicalUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/entreprises');
  };

  const certification = String(business.statut_carte || '').trim();
  const showGallery = capabilities.showGallery && Boolean(business.image_url);
  const showVideo = capabilities.showVideos && Boolean(business.video_url);
  const showAchievements = capabilities.variant === 'premium' && Boolean(achievementsText);
  const hasContact = Boolean(
    business.telephone ||
      whatsappUrl ||
      business.email ||
      websiteUrl ||
      mapsUrl,
  );

  return (
    <div
      className="min-h-screen pb-14 text-white"
      style={{ backgroundColor: theme.page }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
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

      <div className="mx-auto max-w-5xl px-4 pt-5 md:px-6">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '/' },
            ...(business.ville
              ? [{ label: business.ville, href: `/ville/${generateSlug(business.ville)}` }]
              : []),
            { label: displayName },
          ]}
        />

        <article
          className="mt-3 overflow-hidden rounded-[28px] border shadow-2xl"
          style={{
            backgroundColor: theme.card,
            borderColor: theme.border,
            boxShadow: `0 28px 80px ${theme.page}cc`,
          }}
        >
          <header className="relative min-h-[260px] overflow-hidden md:min-h-[330px]">
            <img
              src={coverImage}
              alt={`${displayName}${business.ville ? ` à ${business.ville}` : ''}`}
              className="absolute inset-0 h-full w-full object-cover"
              width={1200}
              height={630}
              loading="eager"
              decoding="async"
              {...{ fetchpriority: 'high' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20" />

            <div className="absolute left-4 top-4 flex flex-wrap gap-2 md:left-6 md:top-6">
              <span
                className="rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] backdrop-blur-md"
                style={{
                  borderColor: `${theme.accent}90`,
                  backgroundColor: `${theme.card}d9`,
                  color: theme.accent,
                }}
              >
                {capabilities.productLabel}
              </span>
              {certification && (
                <span className="rounded-full border border-white/25 bg-black/55 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
                  {certification}
                </span>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div
                  className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 bg-white shadow-2xl md:h-24 md:w-24"
                  style={{ borderColor: theme.accent }}
                >
                  <img
                    src={logoImage}
                    alt={`Logo ${displayName}`}
                    className="h-full w-full object-contain"
                    width={96}
                    height={96}
                    loading="eager"
                    decoding="async"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h1
                    className="text-3xl font-bold leading-tight text-white md:text-5xl"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {displayName}
                  </h1>
                  {categoryLabel && (
                    <p className="mt-2 text-sm font-semibold md:text-base" style={{ color: theme.accent }}>
                      {categoryLabel}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-200">
                    {(business.ville || business.gouvernorat) && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={16} style={{ color: theme.accent }} />
                        {[business.ville, business.gouvernorat]
                          .filter((value, index, values) => value && values.indexOf(value) === index)
                          .join(', ')}
                      </span>
                    )}
                    {rating > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <Star size={16} fill={theme.accent} style={{ color: theme.accent }} />
                        {rating.toFixed(1)} / 5
                        {googleReviewCount > 0 ? ` (${googleReviewCount})` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-7">
            {hasContact && (
              <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-5">
                <ActionLink
                  href={business.telephone ? `tel:${business.telephone}` : ''}
                  label={text.call}
                  icon={<Phone size={16} />}
                  accent={theme.accent}
                />
                <ActionLink
                  href={whatsappUrl}
                  label={text.whatsapp}
                  icon={<MessageCircle size={16} />}
                  accent={theme.accent}
                  external
                />
                <ActionLink
                  href={business.email ? `mailto:${business.email}` : ''}
                  label={text.email}
                  icon={<Mail size={16} />}
                  accent={theme.accent}
                />
                <ActionLink
                  href={websiteUrl}
                  label={text.website}
                  icon={<Globe2 size={16} />}
                  accent={theme.accent}
                  external
                />
                <ActionLink
                  href={mapsUrl}
                  label={text.directions}
                  icon={<Navigation size={16} />}
                  accent={theme.accent}
                  external
                />
              </div>
            )}

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]">
              <div className="space-y-5">
                {capabilities.showDetailedPresentation && translatedDescription && (
                  <Section title={text.about} accent={theme.accent}>
                    <p className="whitespace-pre-line text-sm leading-7 text-gray-100 md:text-[15px]">
                      {translatedDescription}
                    </p>
                  </Section>
                )}

                {showGallery && (
                  <Section title={text.gallery} accent={theme.accent}>
                    <ImageGallery
                      imageUrls={business.image_url}
                      altText={`${displayName}${business.ville ? ` à ${business.ville}` : ''}`}
                      maxPhotos={capabilities.maxPhotos}
                      height="clamp(220px, 40vw, 380px)"
                      objectFit="contain"
                      className="rounded-xl"
                    />
                  </Section>
                )}

                {capabilities.showServices && (
                  <Section title={text.services} accent={theme.accent}>
                    {serviceItems.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {serviceItems.map((service, index) => (
                          <span
                            key={`${service}-${index}`}
                            className="rounded-full border px-3 py-1.5 text-xs font-semibold"
                            style={{
                              borderColor: `${theme.accent}55`,
                              backgroundColor: `${theme.accent}12`,
                              color: theme.accent,
                            }}
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm italic text-gray-400">{text.noServices}</p>
                    )}
                  </Section>
                )}

                {capabilities.showAbout && aboutText && aboutText !== translatedDescription && (
                  <Section title={text.about} accent={theme.accent}>
                    <p className="whitespace-pre-line text-sm leading-7 text-gray-100">{aboutText}</p>
                  </Section>
                )}

                {showAchievements && (
                  <Section title={text.achievements} accent={theme.accent}>
                    <p className="whitespace-pre-line text-sm leading-7 text-gray-100">{achievementsText}</p>
                  </Section>
                )}

                {showVideo && (
                  <Section title={text.video} accent={theme.accent}>
                    <VideoPlayer
                      videoUrls={business.video_url || ''}
                      maxVideos={capabilities.maxVideos}
                      className="overflow-hidden rounded-xl"
                    />
                  </Section>
                )}
              </div>

              <aside className="space-y-5">
                <Section title={text.practical} accent={theme.accent}>
                  <div className="space-y-3 text-sm text-gray-100">
                    {business.adresse && (
                      <div className="flex gap-2.5">
                        <MapPin className="mt-0.5 shrink-0" size={17} style={{ color: theme.accent }} />
                        <span>{business.adresse}</span>
                      </div>
                    )}
                    {business.telephone && (
                      <div className="flex gap-2.5">
                        <Phone className="mt-0.5 shrink-0" size={17} style={{ color: theme.accent }} />
                        <span>{business.telephone}</span>
                      </div>
                    )}
                    {business.telephone2 && (
                      <div className="flex gap-2.5">
                        <Phone className="mt-0.5 shrink-0" size={17} style={{ color: theme.accent }} />
                        <span>{business.telephone2}</span>
                      </div>
                    )}
                    {business.email && (
                      <div className="flex gap-2.5 break-all">
                        <Mail className="mt-0.5 shrink-0" size={17} style={{ color: theme.accent }} />
                        <span>{business.email}</span>
                      </div>
                    )}
                  </div>
                </Section>

                {schedule && schedule.schedule.length > 0 && (
                  <Section title={text.openingHours} accent={theme.accent}>
                    <div className="space-y-1.5 text-xs">
                      {schedule.schedule.map((day, index) => (
                        <div
                          key={`${day.day}-${index}`}
                          className="grid grid-cols-[90px_1fr] gap-3 rounded-lg px-2.5 py-2"
                          style={{ backgroundColor: `${theme.accent}0b` }}
                        >
                          <span className="font-semibold" style={{ color: theme.accent }}>
                            {getDayName(index, language)}
                          </span>
                          <span className={day.isOpen ? 'text-gray-200' : 'text-red-300'}>
                            {day.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {socialLinks.length > 0 && (
                  <Section title={text.social} accent={theme.accent}>
                    <div className="grid grid-cols-2 gap-2">
                      {socialLinks.map(link => (
                        <ActionLink
                          key={link.label}
                          href={link.href}
                          label={link.label}
                          icon={link.icon}
                          accent={theme.accent}
                          external
                        />
                      ))}
                    </div>
                  </Section>
                )}

                {(capabilities.showQrCode || capabilities.showShareTools) && (
                  <Section title={text.qr} accent={theme.accent}>
                    <div className="flex flex-col items-center gap-4 text-center">
                      {capabilities.showQrCode && (
                        <div className="rounded-2xl bg-white p-3 shadow-xl">
                          {qrImageUrl ? (
                            <img
                              src={qrImageUrl}
                              alt={`QR code ${displayName}`}
                              width={150}
                              height={150}
                              className="h-[150px] w-[150px] object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <QRCodeSVG value={canonicalUrl} size={150} level="M" includeMargin />
                          )}
                        </div>
                      )}

                      {capabilities.showShareTools && (
                        <div className="grid w-full grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition hover:bg-white/10"
                            style={{ borderColor: `${theme.accent}70`, color: theme.accent }}
                          >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? text.copied : text.share}
                          </button>
                          <button
                            type="button"
                            onClick={handleShare}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition hover:bg-white/10"
                            style={{ borderColor: `${theme.accent}70`, color: theme.accent }}
                          >
                            <Share2 size={16} />
                            WhatsApp
                          </button>
                        </div>
                      )}
                    </div>
                  </Section>
                )}
              </aside>
            </div>

            {capabilities.showReservation && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-4 md:p-5">
                <ReservationForm
                  businessId={business.id}
                  businessName={displayName}
                  businessEmail={business.email || business.email2 || undefined}
                  businessPhone={business.telephone || business.whatsapp || business.telephone2 || undefined}
                  accentColor={theme.accent}
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
              </div>
            )}
          </div>
        </article>

        {capabilities.showReviews && (
          <section className="mt-6">
            <h2 className="sr-only">{text.reviews}</h2>
            <BusinessReviews entrepriseId={business.id} />
            <div className="mt-4 rounded-2xl border border-[#D4AF37]/25 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#D4AF37]">
                <Star size={16} />
                {text.leaveReview}
              </div>
              <EntrepriseAvisForm entrepriseId={business.id} />
            </div>
          </section>
        )}

        {capabilities.showPlatformLinks && (
          <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2
              className="mb-4 text-lg font-semibold"
              style={{ color: theme.accent, fontFamily: "'Playfair Display', serif" }}
            >
              {text.platform}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {seoMetier && (
                <Link
                  to={`/metier/${seoMetier.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/15 p-3 text-sm text-gray-200 transition hover:border-[#D4AF37]/60"
                >
                  <Building2 size={18} style={{ color: theme.accent }} />
                  <span>{seoMetier.label}</span>
                </Link>
              )}
              {seoVille && (
                <Link
                  to={`/ville/${seoVille.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/15 p-3 text-sm text-gray-200 transition hover:border-[#D4AF37]/60"
                >
                  <MapPin size={18} style={{ color: theme.accent }} />
                  <span>{seoVille.label}</span>
                </Link>
              )}
              {seoGovernorate && (
                <Link
                  to={`/gouvernorat/${seoGovernorate.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/15 p-3 text-sm text-gray-200 transition hover:border-[#D4AF37]/60"
                >
                  <Navigation size={18} style={{ color: theme.accent }} />
                  <span>{seoGovernorate.label}</span>
                </Link>
              )}
              {seoSector && (
                <Link
                  to={`/secteur/${seoSector.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/15 p-3 text-sm text-gray-200 transition hover:border-[#D4AF37]/60"
                >
                  <Globe2 size={18} style={{ color: theme.accent }} />
                  <span>{seoSector.label}</span>
                </Link>
              )}
            </div>
          </section>
        )}

        {capabilities.showSimilarBusinesses && (
          <section className="mt-6">
            <h2 className="sr-only">{text.similar}</h2>
            <SimilarBusinesses
              businessId={business.id}
              categorie={categoryLabel}
              ville={business.ville || undefined}
              gouvernorat={business.gouvernorat || undefined}
            />
          </section>
        )}

        <div className="mt-7 text-center">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition hover:bg-white/10"
            style={{ borderColor: `${theme.accent}80`, color: theme.accent }}
          >
            <ArrowLeft size={17} />
            {text.back}
          </button>
        </div>
      </div>
    </div>
  );
}
