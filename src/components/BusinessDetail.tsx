import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Navigation,
  Download,
  ChevronDown,
  Link as LinkIcon,
  Check,
} from 'lucide-react';

const QRCodeSVG = lazy(() =>
  import('qrcode.react').then((m) => ({ default: m.QRCodeSVG }))
);

const ImageGallery = lazy(() =>
  import('../components/ImageGallery').then((m) => ({ default: m.ImageGallery }))
);

const VideoPlayer = lazy(() => import('../components/VideoPlayer'));

const SimilarBusinesses = lazy(() => import('../components/seo/SimilarBusinesses'));

import EntrepriseAvisForm from '../components/EntrepriseAvisForm';
import BusinessReviews from '../components/BusinessReviews';
import { buildEntrepriseUrl, buildEntrepriseShareUrl, generateSlug, extractShortIdFromSlug } from '../lib/slugify';
import { cleanAltText, extractFrenchName, cleanArabicField } from '../lib/textNormalization';
import { SEOHead } from './SEOHead';
import { getBusinessSeoMeta } from '../lib/seoMetaTemplates';
import { useHreflangPath } from '../hooks/useHreflangPath';
import {
  mapSubscriptionToTier,
  getTierLabel,
  getMediaLimits,
} from '../lib/subscriptionTiers';
import { useViewTracking } from '../hooks/useViewTracking';
import StructuredData from '../components/StructuredData';
import { generateLocalBusinessSchema } from '../lib/structuredDataSchemas';
import InfoModal from '../components/InfoModal';
import {
  getParsedSchedule,
  translateOpenStatus,
  translateClosedStatus,
  isCurrentlyOpen,
  getDayName,
  translateScheduleNotAvailable,
} from '../lib/horaireUtils';
import { useCategoryTranslation } from '../hooks/useCategoryTranslation';
import { getMultilingualField } from '../lib/databaseI18n';
import { getLogoUrl, getLogoStyle, getLogoContainerStyle } from '../lib/logoUtils';
import { generateHashtags, formatHashtagsForShare } from '../lib/hashtagGenerator';
import { HERO_IMAGE_URL } from '../constants/images';
import { findMetierByValue, findVilleByLabel } from '../lib/seoLandingData';
import GratuitCard from '../components/GratuitCard';
import ReservationForm from '../components/ReservationForm';

function getFullImageUrl(url?: string | null): string {
  if (!url || url.trim() === '') return HERO_IMAGE_URL;

  let finalUrl = url.trim();

  if (finalUrl.includes(',')) {
    finalUrl = finalUrl.split(',')[0].trim();
  }

  if (!finalUrl) return HERO_IMAGE_URL;

  if (finalUrl.startsWith('http://') || finalUrl.startsWith('https://')) {
    return finalUrl;
  }

  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/entreprises/${finalUrl}`;
}

function isQrCodeImageUrl(url: string): boolean {
  const lower = url.toLowerCase();
  if (/\.(png|jpg|jpeg|webp|svg|gif)(\?|$)/.test(lower)) return true;
  if (lower.includes('api.qrserver.com')) return true;
  if (lower.includes('imagekit.io')) return true;
  if (lower.includes('supabase.co/storage')) return true;
  if (lower.includes('qr-code') || lower.includes('qrcode')) return true;
  return false;
}

function isPhoneDisplayable(value: string, whatsappField?: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 4) return false;
  if (/wh?a[t]+|whats|what\s*app/i.test(value)) return false;
  if (whatsappField) {
    const digitsB = whatsappField.replace(/\D/g, '');
    if (digitsB && digits.length >= 6 && (digits === digitsB || digits.endsWith(digitsB) || digitsB.endsWith(digits))) return false;
  }
  return true;
}

function buildWhatsAppUrl(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  const normalized = digits.startsWith('216')
    ? digits
    : digits.startsWith('0')
      ? `216${digits.slice(1)}`
      : `216${digits}`;

  return `https://wa.me/${normalized}`;
}

function normalizeText(value: string | null | undefined): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function renderStatutCarteBadge(statut_carte: string | null | undefined) {
  if (!statut_carte) return null;

  const normalized = normalizeText(statut_carte);

  const isNonCertified =
    normalized.includes('NON CERTIFIE') ||
    normalized.includes('NON CERTIFIED') ||
    normalized.includes('NON');

  const isCertified =
    normalized.includes('CERTIFIE DALIL TOUNES') ||
    normalized.includes('CERTIFIED DALIL TOUNES') ||
    normalized.includes('CERTIFIE');

  const label = isNonCertified
    ? '⚠️ NON CERTIFIÉ'
    : isCertified
      ? '⭐ CERTIFIÉ DALIL TOUNES'
      : statut_carte;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '10px',
        fontWeight: 800,
        letterSpacing: '0.03em',
        padding: '4px 10px',
        borderRadius: '999px',
        color: '#ffffff',
        backgroundColor: isNonCertified ? '#ea580c' : '#15803d',
        boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
        textTransform: 'uppercase',
        lineHeight: 1.2,
      }}
    >
      {label}
    </span>
  );
}

function normalizeBusiness(business: any): any {
  if (!business) return null;

  return {
    id: business.id,
    nom: extractFrenchName(business.nom || business.name || ''),
    categorie: business['catégorie_fk_autre_table'] || business.categorie || business.category || '',
    sous_categories:
      business.sous_categories_texte ||
      business.sous_categories_clean ||
      business['Sous-catégorie entreprise'] ||
      business.sous_categories ||
      business.subCategories ||
      '',
    ville: business.ville || business.city || business.gouvernorat || '',
    gouvernorat: business.gouvernorat || business.city || '',
    adresse: business.adresse || business.address || '',
    telephone: business.telephone || business.phone || '',
    telephone2: business.telephone2 || '',
    telephone2_clean: business.telephone2_clean || '',
    whatsapp: business.whatsapp || '',
    email: business.email || '',
    email2: business.email2 || '',
    email2_clean: business.email2_clean || '',
    score_avis: business.score_avis ?? null,
    site_web: business.site_web || business.website || '',
    description: business.description || '',
    services: business.services || '',
    BTN_Maps: business.BTN_Maps || business['BTN_Maps'] || business.google_url || null,
    statut_validation: business.statut_validation || null,
    created_at: business.created_at,
    image_url: business.image_url || business.imageUrl,
    logo_url: getLogoUrl(business.logo_url || business.logoUrl),
    statut_abonnement: business.statut_abonnement || null,
    statut_carte: business.statut_carte || null,
    'Lien Instagram': business['Lien Instagram'] || business.instagram,
    'Lien TikTok': business['Lien TikTok'] || business.tiktok,
    'Lien LinkedIn': business['Lien LinkedIn'] || business.linkedin,
    'Lien YouTube': business['Lien YouTube'] || business.youtube,
    'lien facebook': business['lien facebook'] || business.facebook,
    'Lien Avis Google': business['Lien Avis Google'],
    video_url: business.video_url,
    horaires_ok: business.horaires_ok,
    name_ar: business.name_ar ? cleanArabicField(business.name_ar) : null,
    name_en: business.name_en || null,
    name_it: business.name_it || null,
    name_ru: business.name_ru || null,
    description_ar: business.description_ar ? cleanArabicField(business.description_ar) : null,
    description_en: business.description_en || null,
    description_it: business.description_it || null,
    description_ru: business.description_ru || null,
    slug: business.slug || null,
    qr_code_url: business.qr_code_url || null,
    google_url: business.google_url || null,
    latitude: business.latitude ?? null,
    longitude: business.longitude ?? null,
  };
}

export function normalizeMapsUrl(
  value: unknown,
  latitude: unknown,
  longitude: unknown,
  adresse: unknown,
  ville: unknown,
  gouvernorat: unknown
): string | null {
  const candidates = Array.isArray(value) ? value : [value];
  for (const raw of candidates) {
    if (typeof raw !== 'string') continue;
    const trimmed = raw.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
  }

  const lat = Number(latitude);
  const lng = Number(longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  const parts = [adresse, ville, gouvernorat]
    .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    .join(' ')
    .trim();
  if (parts) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${parts} Tunisie`)}`;
  }

  return null;
}

function buildMapsUrl(business: any): string | null {
  return normalizeMapsUrl(
    [business?.['BTN_Maps'], business?.google_url],
    business?.latitude,
    business?.longitude,
    business?.adresse,
    business?.ville,
    business?.gouvernorat
  );
}

interface BusinessDetailProps {
  businessId?: string;
  business?: any;
  onNavigateBack?: () => void;
  onClose?: () => void;
  asModal?: boolean;
}

interface Business {
  id: string;
  nom: string;
  categorie?: string;
  sous_categories?: string;
  ville: string;
  gouvernorat?: string;
  adresse: string;
  telephone: string;
  telephone2?: string;
  telephone2_clean?: string;
  whatsapp?: string;
  email: string;
  email2?: string;
  email2_clean?: string;
  score_avis?: string | number | null;
  site_web?: string;
  description: string;
  services?: string;
  BTN_Maps?: string | null;
  statut_validation?: string | null;
  created_at?: string;
  image_url?: string;
  logo_url?: string;
  statut_abonnement?: string | null;
  statut_carte?: string | null;
  'Lien Instagram'?: string;
  'Lien TikTok'?: string;
  'Lien LinkedIn'?: string;
  'Lien YouTube'?: string;
  'lien facebook'?: string;
  'Lien Avis Google'?: string;
  video_url?: string;
  horaires_ok?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  name_it?: string | null;
  name_ru?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  description_it?: string | null;
  description_ru?: string | null;
  slug?: string | null;
  qr_code_url?: string | null;
  google_url?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
}

export const BusinessDetail = ({
  businessId: businessIdProp,
  business: businessProp,
  onNavigateBack,
  onClose,
  asModal = false,
}: BusinessDetailProps) => {
  const { id: urlId, slug: urlSlug, villeSlug: urlVilleSlug } = useParams<{
    id?: string;
    slug?: string;
    villeSlug?: string;
  }>();

  const navigate = useNavigate();
  const routerLocation = useLocation();

  let extractedId: string | null = null;
  let legacyShortId: string | null = null;

  if (urlSlug && !urlId) {
    const uuidMatch = urlSlug.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
    );
    if (uuidMatch) {
      extractedId = uuidMatch[0];
    } else {
      const shortId = extractShortIdFromSlug(urlSlug);
      if (shortId) {
        legacyShortId = shortId;
        extractedId = shortId;
      }
    }
  }

  const cleanSlugOnly = urlSlug && !extractedId && !urlId ? urlSlug : null;

  const businessId = businessIdProp || urlId || extractedId;

  const { language } = useLanguage();
  const { getCategory } = useCategoryTranslation();
  const currentPath = useHreflangPath();

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const qrCodeRef = useRef<HTMLDivElement>(null);

  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const actualBusinessId = businessId || businessProp?.id;

  useViewTracking(actualBusinessId);

  const handleCloseRef = onClose || onNavigateBack || (() => navigate(-1));

  const translatedCategory = business
    ? getCategory(getMultilingualField(business, 'categorie', language, true) || business.categorie || '')
    : '';

  useEffect(() => {
    if (asModal && handleCloseRef) {
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = 'unset';
      };
    }

    return undefined;
  }, [asModal, handleCloseRef]);

  useEffect(() => {
    if (!actualBusinessId && !cleanSlugOnly && !businessProp?.id) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchBusiness = async () => {
      setLoading(true);
      setError(false);

      try {
        const fetchId = actualBusinessId || businessProp?.id || null;

        let data: any = null;
        let fetchError: any = null;

        // 1. Clean slug lookup (primary path for new URLs)
        if (cleanSlugOnly) {
          const normalized = cleanSlugOnly.trim().toLowerCase();
          const { data: slugRow } = await supabase
            .from('entreprise')
            .select('*')
            .eq('slug', normalized)
            .maybeSingle();
          if (slugRow) {
            data = slugRow;
          }

          if (!data && urlVilleSlug) {
            const villeLabel = urlVilleSlug
              .split('-')
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
            const { data: candidates } = await supabase
              .from('entreprise')
              .select('*')
              .ilike('ville', `%${villeLabel}%`)
              .limit(200);
            if (candidates) {
              const match = candidates.find(
                (row: any) => generateSlug(row.nom || '') === normalized
              );
              if (match) data = match;
            }
          }
        }

        // 2. ID-based lookup (legacy URLs with shortId or full UUID)
        if (!data && fetchId) {
          const isFullUuid =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(fetchId);

          if (isFullUuid) {
            const res = await supabase
              .from('entreprise')
              .select('*')
              .eq('id', fetchId)
              .maybeSingle();
            data = res.data;
            fetchError = res.error;
          } else {
            const { data: rpcData } = await supabase.rpc('find_entreprise_by_id_prefix', {
              prefix: fetchId,
            });
            if (rpcData && rpcData.length > 0) {
              data = rpcData[0];
            } else {
              const res = await supabase
                .from('entreprise')
                .select('*')
                .eq('id_airtable', fetchId)
                .maybeSingle();
              if (res.data) {
                data = res.data;
              }
            }
          }
        }

        if (fetchError || !data) {
          setError(true);
          setLoading(false);
          return;
        }

        const canonicalPath = buildEntrepriseUrl(data);
        const currentPathname = routerLocation.pathname;
        if (!asModal && !businessIdProp && canonicalPath !== '/' && currentPathname !== canonicalPath) {
          navigate(canonicalPath, { replace: true });
        }

        const mappedBusiness = {
          ...data,
          image_url: data.image_url || data.imageUrl || data.Image,
          logo_url: data.logo_url || data.logoUrl || data.Logo,
          statut_abonnement: (data.statut_abonnement || '').trim().toLowerCase() || null,
        };

        const normalized = normalizeBusiness(mappedBusiness);
        setBusiness(normalized as Business);

        try {
          const { data: avisData } = await supabase
            .from('avis_entreprise')
            .select('note')
            .eq('entreprise_id', data.id)
            .eq('status', 'approved');

          if (avisData && avisData.length > 0) {
            const totalRating = avisData.reduce((sum, avis) => sum + (avis.note || 0), 0);
            const avgRating = totalRating / avisData.length;
            setAverageRating(Number(avgRating.toFixed(1)));
            setReviewCount(avisData.length);
          } else {
            setAverageRating(null);
            setReviewCount(0);
          }
        } catch (avisErr) {
          console.error('Erreur avis:', avisErr);
        }
      } catch (err) {
        console.error('Erreur fetch business:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [businessId, businessProp, actualBusinessId, cleanSlugOnly, asModal, businessIdProp, navigate, urlVilleSlug]);

  const translations = {
    fr: {
      loading: 'Chargement...',
      notFound: 'Entreprise introuvable.',
      backToSearch: 'Retour',
      description: 'À propos',
      services: 'Services',
      contact: 'Contact',
      qrCodeTitle: 'QR Code',
      downloadQR: 'Télécharger le QR',
      qrLabel: 'QR de partage professionnel',
      directions: 'Itinéraire GPS',
      leaveReview: 'Mettez votre avis',
      openingHours: 'Horaires',
      linkCopied: 'Lien copié',
      recommendText: 'Recommander ce professionnel à un proche',
      shareViaWhatsApp: 'Partager via WhatsApp',
      shareViaTelegram: 'Partager via Telegram',
      reservationTitle: 'Réserver',
      reservationName: 'Nom complet',
      reservationPhone: 'Téléphone',
      reservationEmail: 'Email',
      reservationDate: 'Date souhaitée',
      reservationTime: 'Heure souhaitée',
      reservationMessage: 'Message',
      reservationSubmit: 'Envoyer la demande',
      reservationSuccess: 'Votre demande a bien été envoyée à l\'entreprise.',
      reservationNotice: 'Votre demande sera envoyée à l\'entreprise. Elle vous contactera directement pour confirmer. Pensez à téléphoner 24h avant pour confirmer votre venue.',
      reservationClose: 'Fermer',
      reservationSending: 'Envoi en cours...',
      reservationError: 'Une erreur est survenue. Veuillez réessayer.',
    },
    en: {
      loading: 'Loading...',
      notFound: 'Business not found.',
      backToSearch: 'Back',
      description: 'About',
      services: 'Services',
      contact: 'Contact',
      qrCodeTitle: 'QR Code',
      downloadQR: 'Download QR',
      qrLabel: 'Professional sharing QR',
      directions: 'Get Directions',
      leaveReview: 'Leave a Review',
      openingHours: 'Opening Hours',
      linkCopied: 'Link copied',
      recommendText: 'Recommend this professional to a friend',
      shareViaWhatsApp: 'Share via WhatsApp',
      shareViaTelegram: 'Share via Telegram',
      reservationTitle: 'Book',
      reservationName: 'Full Name',
      reservationPhone: 'Phone',
      reservationEmail: 'Email',
      reservationDate: 'Preferred Date',
      reservationTime: 'Preferred Time',
      reservationMessage: 'Message',
      reservationSubmit: 'Send Request',
      reservationSuccess: 'Your request has been successfully sent to the business.',
      reservationNotice: 'Your request will be sent to the business. They will contact you directly to confirm. Please call 24 hours before your appointment to confirm.',
      reservationClose: 'Close',
      reservationSending: 'Sending...',
      reservationError: 'An error occurred. Please try again.',
    },
    ar: {
      loading: 'جارٍ التحميل...',
      notFound: 'الشركة غير موجودة.',
      backToSearch: 'رجوع',
      description: 'حول',
      services: 'الخدمات',
      contact: 'اتصال',
      qrCodeTitle: 'رمز QR',
      downloadQR: 'تحميل QR',
      qrLabel: 'رمز QR للمشاركة المهنية',
      directions: 'الاتجاهات',
      leaveReview: 'أضف رأيك',
      openingHours: 'ساعات العمل',
      linkCopied: 'تم نسخ الرابط',
      recommendText: 'أوصي بهذا المحترف لصديق',
      shareViaWhatsApp: 'مشاركة عبر واتساب',
      shareViaTelegram: 'مشاركة عبر تيليجرام',
      reservationTitle: 'حجز',
      reservationName: 'الاسم الكامل',
      reservationPhone: 'رقم الهاتف',
      reservationEmail: 'البريد الإلكتروني',
      reservationDate: 'التاريخ المطلوب',
      reservationTime: 'الوقت المطلوب',
      reservationMessage: 'رسالة',
      reservationSubmit: 'إرسال الطلب',
      reservationSuccess: 'تم إرسال طلبك إلى المؤسسة بنجاح.',
      reservationNotice: 'سيتم إرسال طلبك إلى المؤسسة. ستتواصل معك مباشرة للتأكيد. يرجى الاتصال قبل 24 ساعة لتأكيد الموعد.',
      reservationClose: 'إغلاق',
      reservationSending: 'جارٍ الإرسال...',
      reservationError: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    },
    it: {
      loading: 'Caricamento...',
      notFound: 'Azienda non trovata.',
      backToSearch: 'Indietro',
      description: 'Informazioni',
      services: 'Servizi',
      contact: 'Contatto',
      qrCodeTitle: 'QR Code',
      downloadQR: 'Scarica QR',
      qrLabel: 'QR di condivisione professionale',
      directions: 'Indicazioni',
      leaveReview: 'Lascia una recensione',
      openingHours: 'Orari',
      linkCopied: 'Link copiato',
      recommendText: 'Consiglia questo professionista a un amico',
      shareViaWhatsApp: 'Condividi su WhatsApp',
      shareViaTelegram: 'Condividi su Telegram',
      reservationTitle: 'Prenota',
      reservationName: 'Nome completo',
      reservationPhone: 'Telefono',
      reservationEmail: 'Email',
      reservationDate: 'Data desiderata',
      reservationTime: 'Orario desiderato',
      reservationMessage: 'Messaggio',
      reservationSubmit: 'Invia richiesta',
      reservationSuccess: 'La tua richiesta è stata inviata con successo all\'azienda.',
      reservationNotice: 'La tua richiesta verrà inviata all\'azienda. Sarai contattato direttamente per la conferma. Ti consigliamo di telefonare 24 ore prima per confermare.',
      reservationClose: 'Chiudi',
      reservationSending: 'Invio in corso...',
      reservationError: 'Si è verificato un errore. Riprova.',
    },
    ru: {
      loading: 'Загрузка...',
      notFound: 'Компания не найдена.',
      backToSearch: 'Назад',
      description: 'О нас',
      services: 'Услуги',
      contact: 'Контакт',
      qrCodeTitle: 'QR код',
      downloadQR: 'Скачать QR',
      qrLabel: 'QR для профессионального обмена',
      directions: 'Маршрут',
      leaveReview: 'Оставить отзыв',
      openingHours: 'Часы работы',
      linkCopied: 'Ссылка скопирована',
      recommendText: 'Порекомендовать этого специалиста другу',
      shareViaWhatsApp: 'Поделиться в WhatsApp',
      shareViaTelegram: 'Поделиться в Telegram',
      reservationTitle: 'Забронировать',
      reservationName: 'Полное имя',
      reservationPhone: 'Телефон',
      reservationEmail: 'Электронная почта',
      reservationDate: 'Желаемая дата',
      reservationTime: 'Желаемое время',
      reservationMessage: 'Сообщение',
      reservationSubmit: 'Отправить запрос',
      reservationSuccess: 'Ваш запрос успешно отправлен.',
      reservationNotice: 'Ваш запрос будет отправлен компании. Они свяжутся с вами для подтверждения. Пожалуйста, позвоните за 24 часа до визита для подтверждения.',
      reservationClose: 'Закрыть',
      reservationSending: 'Отправка...',
      reservationError: 'Произошла ошибка. Попробуйте ещё раз.',
    },
  };

  const text = translations[language as keyof typeof translations] || translations.fr;
  const isRTL = language === 'ar';

  const downloadQRCode = () => {
    if (!qrCodeRef.current || !business) return;

    const imgEl = qrCodeRef.current.querySelector('img');

    if (imgEl && imgEl.src) {
      const a = document.createElement('a');
      a.href = imgEl.src;
      a.download = `qr-code-${business.nom || 'entreprise'}.png`;
      a.target = '_blank';
      a.rel = 'noopener';
      a.click();
      return;
    }

    const svg = qrCodeRef.current.querySelector('svg');

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');

      downloadLink.download = `qr-code-${business.nom || 'entreprise'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const getBusinessShareUrl = () => {
    if (!business) return '';
    return buildEntrepriseShareUrl(business);
  };

  const copyLink = () => {
    if (!business) return;

    const shareUrl = getBusinessShareUrl();

    navigator.clipboard.writeText(shareUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const getShareHashtags = () => {
    if (!business) return [];
    const tier = mapSubscriptionToTier(business.statut_abonnement);
    return generateHashtags({
      category: translatedCategory || business.categorie,
      ville: business.ville,
      gouvernorat: business.gouvernorat,
      isPremium: tier === 'premium' || tier === 'elite',
    });
  };

  const shareViaWhatsApp = () => {
    if (!business) return;

    const shareUrl = getBusinessShareUrl();
    const hashtags = getShareHashtags();
    const shareText = `${displayName} - ${translatedCategory}\n${shareUrl}${formatHashtagsForShare(hashtags)}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareViaTelegram = () => {
    if (!business) return;

    const shareUrl = getBusinessShareUrl();
    const hashtags = getShareHashtags();
    const shareText = `${displayName} - ${translatedCategory}${formatHashtagsForShare(hashtags)}`;

    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      '_blank'
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">{text.loading}</p>
      </div>
    );
  }

  if (error || !business) {
    const handleBack = onClose || onNavigateBack || (() => navigate(-1));

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">{text.notFound}</h1>
          <p className="text-gray-500 text-sm mb-8">
            {language === 'fr'
              ? "Cette fiche n'existe plus ou a ete deplacee. Essayez une nouvelle recherche."
              : language === 'ar'
                ? 'هذه الصفحة لم تعد موجودة. حاول البحث مرة أخرى.'
                : 'This page no longer exists. Try a new search.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-full hover:bg-[#c9a42e] transition-all font-semibold text-sm"
            >
              <ArrowLeft size={18} />
              {text.backToSearch}
            </button>
            <Link
              to="/entreprises"
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all font-semibold text-sm"
            >
              {language === 'fr' ? 'Rechercher' : language === 'ar' ? 'بحث' : 'Search'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tier = mapSubscriptionToTier({
    statut_abonnement: business.statut_abonnement || null,
  });

  const tierLabel = getTierLabel(tier, language);
  const mediaLimits = getMediaLimits(tier);
  const handleClose = onClose || onNavigateBack || (() => navigate(-1));

  const getTierColors = () => {
    switch (tier) {
      case 'elite':
        return {
          background: '#000000',
          border: '#D4AF37',
          gold: '#D4AF37',
        };

      case 'premium':
        return {
          background: '#064E3B',
          border: '#D4AF37',
          gold: '#D4AF37',
        };

      case 'artisan':
        return {
          background: '#7F1D1D',
          border: '#DC2626',
          gold: '#FCA5A5',
        };

      case 'gratuit':
      default:
        return {
          background: '#FFFFFF',
          border: '#D4AF37',
          gold: '#D4AF37',
        };
    }
  };

  const colors = getTierColors();

  const displayName =
    String(getMultilingualField(business, 'nom', language, true)) || business.nom;

  const displayDescription =
    String(getMultilingualField(business, 'description', language, true)) ||
    business.description ||
    '';

  const translatedDescription = displayDescription;

  const translatedServices = business
    ? getMultilingualField(business, 'services', language, true) || business.services || ''
    : '';

  const isArabicDisplay = language === 'ar';

  const content = (
    <div
      className={asModal ? 'overflow-x-hidden' : 'py-4 px-4 overflow-x-hidden'}
      style={{ wordBreak: 'break-word', padding: asModal ? '1rem' : undefined }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {business && actualBusinessId && (
        <>
          {(() => {
            const bizSeo = getBusinessSeoMeta({ nom: business.nom, ville: business.ville, telephone: business.telephone, categorie: translatedCategory, description: translatedDescription || undefined }, buildEntrepriseShareUrl(business));
            return (
              <SEOHead
                title={bizSeo.title}
                description={bizSeo.description}
                keywords={bizSeo.keywords}
                image={business.image_url || undefined}
                canonical={bizSeo.canonical}
                type="article"
                author={business.nom}
                currentPath={currentPath}
                noindex={business.statut_validation !== 'publié' && business.statut_validation !== 'publie'}
              />
            );
          })()}

          <StructuredData
            data={generateLocalBusinessSchema({
              nom: business.nom,
              ville: business.ville,
              adresse: business.adresse,
              telephone: business.telephone,
              site_web: business.site_web,
              photo_url: business.image_url,
              note_moyenne: averageRating || undefined,
              nombre_avis: reviewCount,
              categorie: translatedCategory,
              statut_abonnement: business.statut_abonnement || undefined,
              description: translatedDescription,
            })}
          />
        </>
      )}

      {tier === 'gratuit' && (
        <div className="flex justify-center py-4">
          <GratuitCard
            name={displayName}
            logoUrl={business.logo_url}
            category={translatedCategory}
            ville={business.ville}
            gouvernorat={business.gouvernorat}
            horaires_ok={business.horaires_ok}
            telephone={business.telephone}
            language={language}
            statut_carte={business.statut_carte}
          />
        </div>
      )}

      {tier !== 'gratuit' && (
        <div
          className="w-full mx-auto shadow-2xl transition-all duration-300"
          style={{
            borderRadius: '16px',
            border: `2px solid ${colors.border}`,
            backgroundColor: colors.background,
            position: 'relative',
          }}
        >
          <div className="absolute inset-0 pointer-events-none modal-shine-effect" />

          <div
            className="relative flex flex-col items-center pb-3"
            style={{ borderBottom: `1px solid ${colors.gold}20` }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 'clamp(90px, 14vw, 130px)',
                overflow: 'hidden',
                borderRadius: '14px 14px 0 0',
                backgroundColor: '#f0ede8',
              }}
            >
              <img
                src={getFullImageUrl(business.image_url)}
                aria-hidden="true"
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'blur(12px)',
                  opacity: 0.5,
                  transform: 'scale(1.15)',
                  display: 'block',
                }}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== HERO_IMAGE_URL && !img.src.endsWith(HERO_IMAGE_URL)) {
                    img.onerror = null;
                    img.src = HERO_IMAGE_URL;
                  }
                }}
                decoding="async"
              />

              <img
                src={getFullImageUrl(business.image_url)}
                alt={(() => {
                  const ville = business.ville || '';
                  const cat = cleanAltText(business.sous_categories || '');
                  if (!ville && !cat) return `${business.nom} - Professionnel en Tunisie`;
                  return `Couverture de ${business.nom} - ${cat || 'Professionnel'}${
                    ville ? ` à ${ville}` : ''
                  }`;
                })()}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block',
                }}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src !== HERO_IMAGE_URL && !img.src.endsWith(HERO_IMAGE_URL)) {
                    img.onerror = null;
                    img.src = HERO_IMAGE_URL;
                  }
                }}
                decoding="async"
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(to bottom, transparent 45%, ${colors.background}cc 100%)`,
                  pointerEvents: 'none',
                }}
              />
            </div>

            <div
              className="w-16 h-16 shadow-2xl"
              style={{
                ...getLogoContainerStyle(colors.gold, '3px'),
                backgroundColor: colors.background,
                marginTop: '-36px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <img
                src={business.logo_url}
                alt={(() => {
                  const ville = business.ville || '';
                  const cat = cleanAltText(business.sous_categories || '');

                  if (!ville && !cat) return `${business.nom} - Professionnel en Tunisie`;
                  if (!ville) return `${business.nom} - ${cat}`;
                  if (!cat) return `${business.nom} à ${ville} - Professionnel en Tunisie`;

                  return `${business.nom} à ${ville} - ${cat}`;
                })()}
                className="w-full h-full"
                style={getLogoStyle(business.logo_url)}
                loading="lazy"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;

                  img.src =
                    'https://ik.imagekit.io/gfdpqvshw/Design_Assets_Dalil_Tounes/logos/logo_dalil_tounes_sceau_luxe.png?updatedAt=1773327267816&tr=w-140,h-140,f-auto,q-85';
                }}
                decoding="async"
              />
            </div>

            {business.image_url && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setShowPhotosModal(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'none',
                  border: `1px solid ${colors.gold}60`,
                  borderRadius: '20px',
                  padding: '4px 12px',
                  marginTop: '10px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: '600',
                  color: colors.gold,
                  letterSpacing: '0.03em',
                  transition: 'background 0.2s ease, border-color 0.2s ease',
                  position: 'relative',
                  zIndex: 100,
                  pointerEvents: 'auto',
                }}
              >
                <span style={{ fontSize: '13px' }}>📷</span>
                Voir les photos
              </button>
            )}
          </div>

          {showPhotosModal && business.image_url && (
            <div
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
              style={{
                backgroundColor: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(6px)',
                animation: 'infoFadeIn 0.2s ease',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowPhotosModal(false);
              }}
            >
              <div
                className="relative w-full"
                style={{
                  maxWidth: '480px',
                  animation: 'infoScaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPhotosModal(false);
                  }}
                  style={{
                    position: 'absolute',
                    top: '-36px',
                    right: '0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '28px',
                    lineHeight: 1,
                    color: '#fff',
                    fontWeight: '300',
                    zIndex: 10,
                  }}
                  aria-label="Fermer"
                >
                  ×
                </button>

                <div
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
                  }}
                >
                  <Suspense fallback={<div style={{ height: '340px', background: '#1a0a18' }} />}>
                    <ImageGallery
                      imageUrls={business.image_url}
                      altText={business.nom}
                      className="w-full"
                      maxPhotos={mediaLimits.maxPhotos}
                      height="340px"
                      objectFit="contain"
                    />
                  </Suspense>
                </div>

                <p
                  style={{
                    textAlign: 'center',
                    marginTop: '12px',
                    fontSize: '12px',
                    fontFamily: 'Playfair Display, serif',
                    color: colors.gold,
                    opacity: 0.8,
                    letterSpacing: '0.04em',
                  }}
                >
                  {displayName}
                </p>
              </div>
            </div>
          )}

          {mediaLimits.showVideos && business.video_url && (
            <div className="px-4 pt-2">
              <Suspense
                fallback={<div className="w-full rounded-xl bg-black/20" style={{ aspectRatio: '16/9' }} />}
              >
                <VideoPlayer
                  videoUrls={business.video_url}
                  maxVideos={mediaLimits.maxVideos}
                  className="w-full rounded-xl overflow-hidden"
                />
              </Suspense>
            </div>
          )}

          <div className="px-4 pb-4 pt-3 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-2 px-1 flex-wrap">
              <h1
                className="text-lg md:text-xl font-bold tracking-tight leading-tight text-white"
                dir={isArabicDisplay ? 'rtl' : 'ltr'}
              >
                {displayName}{business.ville ? ` à ${business.ville}` : ''}
              </h1>

              {renderStatutCarteBadge(business.statut_carte)}

              <button
                onClick={copyLink}
                className="flex-shrink-0 transition-all hover:scale-110"
                style={{ color: linkCopied ? '#10B981' : colors.gold }}
                title={linkCopied ? text.linkCopied : 'Copier le lien'}
              >
                {linkCopied ? <Check size={16} /> : <LinkIcon size={16} />}
              </button>
            </div>

            {translatedCategory && (
              <p className="font-medium text-sm truncate px-1" style={{ color: colors.gold }}>
                {translatedCategory}
              </p>
            )}

            <div className="flex flex-col items-center text-gray-200 text-xs gap-0.5">
              <div className="flex items-center gap-1.5 max-w-full px-1 flex-nowrap">
                <MapPin size={13} className="flex-shrink-0" style={{ color: colors.gold }} />

                {business.adresse ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setShowAddressModal(true);
                    }}
                    className="truncate"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#e5e7eb',
                      padding: 0,
                      textAlign: 'left',
                      textDecoration: 'underline dotted',
                      textDecorationColor: colors.gold,
                      position: 'relative',
                      zIndex: 100,
                      pointerEvents: 'auto',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minWidth: 0,
                      maxWidth: '100%',
                    }}
                  >
                    {business.adresse}
                    {business.ville ? `, ${business.ville}` : ''}
                  </button>
                ) : (
                  <span
                    className="truncate"
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      fontStyle: 'italic',
                    }}
                  >
                    Adresse non renseignée{business.ville ? ` · ${business.ville}` : ''}
                  </span>
                )}

                {(() => {
                  console.log('[BusinessDetail GPS]', {
                    BTN_Maps: business['BTN_Maps'],
                    google_url: business.google_url,
                    adresse: business.adresse,
                    latitude: business.latitude,
                    longitude: business.longitude,
                  });
                  const mapsUrl = buildMapsUrl(business);
                  if (!mapsUrl) return null;
                  return (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                    }}
                    title={text.directions}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '1px 7px',
                      borderRadius: '999px',
                      border: `1px solid ${colors.gold}`,
                      background: `${colors.gold}22`,
                      color: colors.gold,
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      position: 'relative',
                      zIndex: 100,
                      pointerEvents: 'auto',
                      flexShrink: 0,
                    }}
                  >
                    <Navigation size={10} strokeWidth={3} />
                    <span>GPS</span>
                  </a>
                  );
                })()}
              </div>

              {business.telephone && isPhoneDisplayable(business.telephone, business.whatsapp) && (
                <a
                  href={`tel:${business.telephone}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                  className="flex items-center gap-1 font-bold truncate max-w-full px-1 hover:underline"
                  style={{
                    fontSize: '14px',
                    color: colors.gold,
                    textDecoration: 'none',
                    position: 'relative',
                    zIndex: 100,
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                  }}
                >
                  <Phone size={13} className="flex-shrink-0" />
                  <span>{business.telephone}</span>
                </a>
              )}

              {business.telephone2 && isPhoneDisplayable(business.telephone2, business.whatsapp) && (
                <a
                  href={`tel:${business.telephone2_clean || business.telephone2}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                  className="flex items-center gap-1 font-bold truncate max-w-full px-1 hover:underline"
                  style={{
                    fontSize: '14px',
                    color: colors.gold,
                    textDecoration: 'none',
                    position: 'relative',
                    zIndex: 100,
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    marginTop: '2px',
                  }}
                >
                  <Phone size={13} className="flex-shrink-0" />
                  <span>{business.telephone2}</span>
                </a>
              )}

              {business.whatsapp && buildWhatsAppUrl(business.whatsapp) && (
                <a
                  href={buildWhatsAppUrl(business.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                  className="flex items-center gap-1 font-bold truncate max-w-full px-1 hover:underline"
                  style={{
                    color: '#25D366',
                    textDecoration: 'none',
                    position: 'relative',
                    zIndex: 100,
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    marginTop: '2px',
                  }}
                >
                  <span style={{ fontSize: '11px', lineHeight: 1, flexShrink: 0 }}>💚</span>
                  <span>WhatsApp</span>
                </a>
              )}

              {(() => {
                const numericScore = Number(business.score_avis);
                if (!Number.isFinite(numericScore) || numericScore <= 0) return null;
                return (
                  <div
                    className="flex items-center gap-1.5 px-1 mt-1"
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: colors.gold,
                    }}
                  >
                    <Star
                      size={11}
                      className="flex-shrink-0"
                      style={{
                        fill: colors.gold,
                        color: colors.gold,
                      }}
                    />
                    <span>{numericScore} / 5</span>

                    {business['Lien Avis Google'] && (
                      <a
                        href={business['Lien Avis Google']}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                        }}
                        style={{
                          fontSize: '10px',
                          fontWeight: 300,
                          color: colors.gold,
                          opacity: 0.85,
                          textDecoration: 'underline',
                          textUnderlineOffset: '2px',
                          letterSpacing: '0.02em',
                          pointerEvents: 'auto',
                          position: 'relative',
                          zIndex: 100,
                        }}
                        title="Lire les avis Google"
                      >
                        (Lire les avis)
                      </a>
                    )}
                  </div>
                );
              })()}
            </div>

            {translatedDescription && (
              <div
                className={isArabicDisplay ? 'text-right px-1' : 'text-left px-1'}
                dir={isArabicDisplay ? 'rtl' : 'ltr'}
              >
                <div style={{ position: 'relative', maxHeight: '72px', overflow: 'hidden' }}>
                  <p
                    className="text-gray-300 break-words"
                    style={{
                      fontSize: '13px',
                      lineHeight: '1.65',
                      margin: 0,
                    }}
                  >
                    {translatedDescription}
                  </p>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '22px',
                      background: `linear-gradient(to bottom, transparent, ${colors.background})`,
                    }}
                  />
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    setShowDescriptionModal(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '3px 0 0 0',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: '700',
                    color: colors.gold,
                    letterSpacing: '0.03em',
                    fontFamily: 'Playfair Display, serif',
                    position: 'relative',
                    zIndex: 100,
                    pointerEvents: 'auto',
                  }}
                >
                  ... Lire la suite
                </button>
              </div>
            )}

            {showDescriptionModal && (
              <InfoModal
                title={displayName}
                content={translatedDescription}
                accentColor={colors.gold}
                onClose={() => setShowDescriptionModal(false)}
              />
            )}

            {showAddressModal && (
              <InfoModal
                title="Adresse"
                content={[business.adresse, business.ville, business.gouvernorat].filter(Boolean).join('\n')}
                accentColor={colors.gold}
                onClose={() => setShowAddressModal(false)}
              />
            )}

            {business.horaires_ok &&
              (() => {
                const parsedSchedule = getParsedSchedule(business.horaires_ok);
                const now = new Date();
                const todayIndex = (now.getDay() + 6) % 7;

                return (
                  <div className="text-left">
                    <button
                      onClick={() => setShowFullSchedule(!showFullSchedule)}
                      className="w-full flex items-center justify-between p-1.5 rounded-lg transition-all bg-white/5 hover:bg-white/10"
                      style={{
                        border: `1px solid ${colors.gold}20`,
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-white font-semibold text-xs">{text.openingHours}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                            parsedSchedule.isCurrentlyOpen
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {parsedSchedule.isCurrentlyOpen
                            ? translateOpenStatus(language)
                            : translateClosedStatus(language)}
                        </span>

                        <ChevronDown
                          size={12}
                          className="transition-transform"
                          style={{
                            color: colors.gold,
                            transform: showFullSchedule ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      </div>
                    </button>

                    <div
                      style={{
                        maxHeight: showFullSchedule ? '300px' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease, opacity 0.3s ease',
                        opacity: showFullSchedule ? 1 : 0,
                      }}
                    >
                      <div className="rounded-lg p-2 mt-1.5 bg-white/5">
                        {parsedSchedule.schedule.length > 0 ? (
                          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
                            {parsedSchedule.schedule.map((day, index) => {
                              const dayIndex = [
                                'Lundi',
                                'Mardi',
                                'Mercredi',
                                'Jeudi',
                                'Vendredi',
                                'Samedi',
                                'Dimanche',
                              ].findIndex((d) => day.day.includes(d));

                              const isToday = dayIndex === todayIndex;

                              return (
                                <React.Fragment key={`schedule-${index}`}>
                                  <span
                                    className="text-[11px] rounded px-1 py-0.5"
                                    style={{
                                      fontWeight: isToday ? '700' : '500',
                                      color: day.isOpen
                                        ? isToday
                                          ? '#FFFFFF'
                                          : 'rgba(255, 255, 255, 0.7)'
                                        : '#EF4444',
                                      backgroundColor: isToday
                                        ? 'rgba(59, 130, 246, 0.1)'
                                        : 'transparent',
                                    }}
                                  >
                                    {getDayName(dayIndex, language)}
                                  </span>

                                  <span
                                    className="text-[11px] text-left rounded px-1 py-0.5"
                                    style={{
                                      fontWeight: isToday ? '600' : '400',
                                      color: day.isOpen
                                        ? isToday
                                          ? '#FFFFFF'
                                          : 'rgba(255, 255, 255, 0.6)'
                                        : '#EF4444',
                                      backgroundColor: isToday
                                        ? 'rgba(59, 130, 246, 0.1)'
                                        : 'transparent',
                                    }}
                                  >
                                    {day.hours}
                                  </span>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-[10px] italic">
                            {translateScheduleNotAvailable(language)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

            {(tier === 'artisan' || tier === 'premium' || tier === 'elite') && (
              <div className="pt-0.5">
                <button
                  onClick={() => setShowQrCode(!showQrCode)}
                  className="w-full flex items-center justify-between p-1.5 rounded-lg transition-all bg-white/5 hover:bg-white/10"
                  style={{ border: `1px solid ${colors.gold}20` }}
                >
                  <span className="text-white font-semibold text-xs">{text.qrLabel}</span>
                  <ChevronDown
                    size={12}
                    className="transition-transform"
                    style={{
                      color: colors.gold,
                      transform: showQrCode ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                <div
                  style={{
                    maxHeight: showQrCode ? '200px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease, opacity 0.3s ease',
                    opacity: showQrCode ? 1 : 0,
                  }}
                >
                  <div className="flex flex-col items-center gap-1 pt-2 pb-1">
                    <div ref={qrCodeRef} className="inline-block rounded bg-white" style={{ padding: '3px' }}>
                      {business.qr_code_url && isQrCodeImageUrl(business.qr_code_url) ? (
                        <img
                          src={business.qr_code_url}
                          alt={`QR Code ${business.nom}`}
                          width={88}
                          height={88}
                          loading="lazy"
                          decoding="async"
                          style={{ display: 'block', width: '88px', height: '88px', objectFit: 'contain' }}
                        />
                      ) : (
                        <Suspense fallback={<div style={{ width: 88, height: 88, background: '#FFF' }} />}>
                          <QRCodeSVG
                            value={business.qr_code_url || window.location.href}
                            size={88}
                            level="M"
                            includeMargin={true}
                            fgColor="#000000"
                            bgColor="#FFFFFF"
                          />
                        </Suspense>
                      )}
                    </div>

                    <button
                      onClick={downloadQRCode}
                      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full transition-all text-[7px] font-medium"
                      style={{
                        backgroundColor: `${colors.gold}20`,
                        color: colors.gold,
                      }}
                    >
                      <Download size={7} />
                      {text.downloadQR}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div
              className="flex items-center justify-center gap-1.5 pt-0.5 flex-wrap px-1"
              style={{
                borderTop: `1px solid ${colors.gold}30`,
                position: 'relative',
                zIndex: 50,
                pointerEvents: 'auto',
              }}
            >
              {business.email && (
                <a
                  href={`mailto:${business.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110 bg-[#6B7280] cursor-pointer"
                  style={{
                    position: 'relative',
                    zIndex: 50,
                    pointerEvents: 'auto',
                  }}
                  title={business.email}
                >
                  <Mail size={10} className="text-white" />
                </a>
              )}

              {business.email2 && (
                <a
                  href={`mailto:${business.email2_clean || business.email2}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110 bg-[#6B7280] cursor-pointer"
                  style={{
                    position: 'relative',
                    zIndex: 50,
                    pointerEvents: 'auto',
                  }}
                  title={business.email2}
                >
                  <Mail size={10} className="text-white" />
                </a>
              )}

              {(tier === 'premium' || tier === 'elite') &&
                business['Lien Instagram'] &&
                business['Lien Instagram'].trim() !== '' && (
                  <a
                    href={business['Lien Instagram']}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] cursor-pointer"
                    style={{ position: 'relative', zIndex: 50, pointerEvents: 'auto' }}
                  >
                    <Instagram size={10} className="text-white" />
                  </a>
                )}

              {(tier === 'premium' || tier === 'elite') &&
                business['lien facebook'] &&
                business['lien facebook'].trim() !== '' && (
                  <a
                    href={business['lien facebook']}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110 bg-[#1877F2] cursor-pointer"
                    style={{ position: 'relative', zIndex: 50, pointerEvents: 'auto' }}
                  >
                    <Facebook size={10} className="text-white" />
                  </a>
                )}

              {(tier === 'premium' || tier === 'elite') &&
                business['Lien LinkedIn'] &&
                business['Lien LinkedIn'].trim() !== '' && (
                  <a
                    href={business['Lien LinkedIn']}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110 bg-[#0A66C2] cursor-pointer"
                    style={{ position: 'relative', zIndex: 50, pointerEvents: 'auto' }}
                  >
                    <Linkedin size={10} className="text-white" />
                  </a>
                )}

              {(tier === 'premium' || tier === 'elite') &&
                business['Lien YouTube'] &&
                business['Lien YouTube'].trim() !== '' && (
                  <a
                    href={business['Lien YouTube']}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110 bg-[#FF0000] cursor-pointer"
                    style={{ position: 'relative', zIndex: 50, pointerEvents: 'auto' }}
                  >
                    <Youtube size={10} className="text-white" />
                  </a>
                )}

              {business.site_web && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    window.open(
                      business.site_web!.startsWith('http')
                        ? business.site_web!
                        : `https://${business.site_web}`,
                      '_blank'
                    );
                  }}
                  className="inline-flex items-center gap-0.5 text-white px-2 py-0.5 rounded-full font-bold text-[8px] uppercase tracking-wide shadow-lg hover:scale-105 transition-transform flex-shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: '#1a7f5a',
                    position: 'relative',
                    zIndex: 50,
                    pointerEvents: 'auto',
                  }}
                  title={business.site_web}
                >
                  <Globe size={9} strokeWidth={3} />
                  <span className="truncate max-w-[80px]">Site web</span>
                </button>
              )}
            </div>

            <div className="mt-0.5 pt-0.5" style={{ borderTop: `1px solid ${colors.gold}30` }}>
              <button
                type="button"
                onClick={() => setShowReviewForm((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: `${colors.gold}15`,
                  color: colors.gold,
                  border: `1px solid ${colors.gold}40`,
                }}
                aria-expanded={showReviewForm}
              >
                <span className="flex items-center gap-1.5">
                  <span>{text.leaveReview}</span>
                  <span className="opacity-70">({reviewCount})</span>
                </span>

                <ChevronDown
                  size={14}
                  className="transition-transform"
                  style={{ transform: showReviewForm ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {showReviewForm && (
                <div className="mt-2">
                  <EntrepriseAvisForm entrepriseId={business?.id || null} />
                </div>
              )}
            </div>

            <div className="mt-0.5 pt-0.5" style={{ borderTop: `1px solid ${colors.gold}30` }}>
              <ReservationForm
                businessId={business.id}
                businessName={displayName}
                businessEmail={business.email || undefined}
                businessPhone={business.telephone || undefined}
                accentColor={colors.gold}
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

            <div className="mt-1 pt-1" style={{ borderTop: `0.5px solid ${colors.gold}40` }}>
              <p
                className="text-[9px] font-medium mb-1.5 px-1"
                style={{
                  color: colors.gold,
                  textAlign: isRTL ? 'right' : 'center',
                }}
              >
                {text.recommendText}
              </p>

              <div className={`flex items-center gap-2 ${isRTL ? 'justify-end' : 'justify-center'} px-1`}>
                <button
                  onClick={shareViaWhatsApp}
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110"
                  style={{
                    backgroundColor: `${colors.gold}15`,
                    border: `1px solid ${colors.gold}30`,
                    position: 'relative',
                    zIndex: 50,
                    pointerEvents: 'auto',
                  }}
                  title={text.shareViaWhatsApp}
                >
                  <span style={{ color: colors.gold, fontSize: '16px' }}>☏</span>
                </button>

                <a
                  href="https://m.me/daliltounes"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110 bg-[#0084FF] cursor-pointer"
                  style={{
                    position: 'relative',
                    zIndex: 50,
                    pointerEvents: 'auto',
                  }}
                  title="Nous contacter sur Messenger"
                >
                  <span className="text-white text-xs font-bold">M</span>
                </a>

                <button
                  onClick={shareViaTelegram}
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-all hover:scale-110"
                  style={{
                    backgroundColor: `${colors.gold}15`,
                    border: `1px solid ${colors.gold}30`,
                    position: 'relative',
                    zIndex: 50,
                    pointerEvents: 'auto',
                  }}
                  title={text.shareViaTelegram}
                >
                  <span style={{ color: colors.gold, fontSize: '14px' }}>✈</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {business?.id && (
        <div className="px-1 mt-3">
          <BusinessReviews entrepriseId={business.id} />
        </div>
      )}

      {business && !asModal && (() => {
        const catStr = typeof business.categorie === 'string' ? business.categorie : '';
        const seoMetier = findMetierByValue(catStr);
        const seoVille = findVilleByLabel(business.ville || '');
        if (!seoMetier && !seoVille) return null;
        return (
          <div className="px-1 mt-6 pt-4 border-t border-gray-800 space-y-3">
            {seoVille && (
              <Link
                to={`/ville/${seoVille.slug}`}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                <MapPin size={13} className="text-[#D4AF37] shrink-0" />
                <span>Tous les professionnels a {seoVille.label}</span>
              </Link>
            )}
            {seoMetier && (
              <Link
                to={`/metier/${seoMetier.slug}`}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                <ArrowLeft size={13} className="text-[#D4AF37] shrink-0 rotate-180" />
                <span>Tous les {seoMetier.label.toLowerCase()}s en Tunisie</span>
              </Link>
            )}
            {seoMetier && seoVille && (
              <Link
                to={`/${seoMetier.slug}-${seoVille.slug}`}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                <ArrowLeft size={13} className="text-[#D4AF37] shrink-0 rotate-180" />
                <span>{seoMetier.label} a {seoVille.label}</span>
              </Link>
            )}
          </div>
        );
      })()}

      {business && !asModal && actualBusinessId && (
        <div className="px-1">
          <Suspense fallback={null}>
            <SimilarBusinesses
              businessId={actualBusinessId}
              categorie={business.categorie}
              ville={business.ville}
              gouvernorat={business.gouvernorat}
            />
          </Suspense>
        </div>
      )}

      {handleClose && (
        <div className="text-center mt-4">
          <button
            onClick={handleClose}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full transition-all shadow-lg font-bold text-xs bg-[#D4AF37] text-white hover:bg-[#C19B2E]"
          >
            <ArrowLeft size={16} />
            {text.backToSearch}
          </button>
        </div>
      )}

      <style>{`
        .modal-shine-effect {
          pointer-events: none !important;
        }

        .modal-shine-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
          transform: skewX(-20deg);
          animation: autoShine 3s infinite ease-in-out;
          pointer-events: none !important;
        }

        @keyframes autoShine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
    </div>
  );

  if (asModal && handleClose) {
    return (
      <div
        className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/70 backdrop-blur-md p-3"
        onClick={handleClose}
      >
        <div
          className="relative"
          style={{
            maxWidth: '420px',
            width: '92%',
            maxHeight: '85vh',
            overflowY: 'auto',
            borderRadius: '16px',
            margin: '0 auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto overflow-x-hidden" style={{ maxWidth: '420px', width: '92%' }}>
      {content}
    </div>
  );
};