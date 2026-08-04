import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import {
  Check,
  CalendarDays,
  ChevronRight,
  Clock3,
  Facebook,
  Globe2,
  ImageIcon,
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
  Rocket,
  Send,
  Share2,
  Sparkles,
  Star,
  UserRound,
  Wrench,
  X,
  Youtube,
} from 'lucide-react';
import { SubscriptionRequestForm } from '../components/SubscriptionRequestForm';
import type { BillingPeriod, CheckoutOffer, SubscriptionPlanCode } from '../components/SubscriptionRequestForm';
import { useLanguage } from '../context/LanguageContext';

type PreviewType = 'free' | 'artisan' | 'premium' | 'launch' | 'request' | null;
type ModalSize = 'preview' | 'compact' | 'medium' | 'large';

const LOGO_PATH = '/images/logo_dalil_tounes_sceau_luxe.webp';
const PREMIUM_PREVIEW_IMAGE_PATH = '/images/drapeau-tunisie.webp';
const MODAL_SIZE_CLASS_NAME: Record<ModalSize, string> = {
  preview: 'w-[min(500px,calc(100vw-16px))] sm:w-[min(500px,calc(100vw-32px))]',
  compact: 'w-[min(700px,calc(100vw-24px))] sm:w-[min(700px,calc(100vw-48px))]',
  medium: 'w-[min(960px,calc(100vw-24px))] sm:w-[min(960px,calc(100vw-48px))]',
  large: 'w-[min(1080px,calc(100vw-24px))] sm:w-[min(1080px,calc(100vw-48px))]',
};

const subscriptionCopy = {
  fr: {
    closeModal: 'Fermer la fenêtre',
    heroEyebrow: 'Solutions pour les professionnels',
    heroTitle: 'Choisissez votre manière de commencer',
    heroSubtitle: "Dalil Tounes rassemble les informations de votre activité sans remplacer les plateformes.",
    startingSolutions: 'Solutions de démarrage',
    selfService: 'Je crée moi-même',
    yourLogo: 'Votre\nlogo',
    essentialTitle: 'Présence essentielle',
    essentialFree: 'Gratuit, sans abonnement obligatoire',
    essentialFeatures: [
      "Nom de l'activité",
      'Catégorie et ville',
      'Téléphone ou WhatsApp',
      "Horaires d'ouverture",
      'Courte description',
      "Logo de l'activité",
      'Présence dans la recherche Dalil Tounes',
    ],
    addActivity: 'Ajouter mon activité',
    previewCard: 'Aperçu de la carte',
    humanSupport: 'Accompagnement humain',
    cvTitle: 'CV Business créé avec vous',
    cvPriceNotice: 'Paiement unique — le prix total reste toujours 199 TND.',
    paymentOptions: 'Possibilités de paiement',
    payOnce: '199 TND en une fois',
    or: 'ou',
    payTwice: '100 TND puis 99 TND',
    payThreeTimes: '67 + 66 + 66 TND',
    cvPublication: 'Votre CV Business est préparé pendant les différentes étapes et publié après le paiement complet.',
    cvFeatures: [
      'Entretien et collecte des informations',
      'Rédaction de la présentation',
      'Organisation des services',
      'Présentation du savoir-faire',
      'Coordonnées complètes',
      'Horaires',
      "Zones d'intervention",
      'Portfolio et réalisations',
      "Jusqu'à 10 photos fournies par le professionnel",
      'Connexion des plateformes existantes',
      'QR Code numérique',
      'Aperçu privé avant publication',
      'Une correction groupée',
      'Publication finale après le paiement complet',
    ],
    requestCreation: 'Demander la création',
    continuousServices: 'Services continus & options',
    launchBadge: 'OFFRE DE LANCEMENT',
    launchTitle: 'Offre spéciale de lancement',
    launchIntro: "Profitez de 3 mois d'accès Artisan ou Premium offerts dès votre inscription.",
    launchAnnualPrefix: "En choisissant l'abonnement annuel, bénéficiez de 3 mois supplémentaires :",
    launchAnnualStrong: "18 mois d'accès au total pour le prix de 12.",
    launchPayment: 'Paiement annuel possible en trois fois.',
    seeConditions: 'Voir les conditions',
    artisan: 'Artisan',
    premium: 'Premium',
    artisanIntro: 'Des outils pratiques pour gérer et développer votre présence avec une carte simple.',
    artisanFeatures: [
      'Statistiques et vues',
      'Formulaires de demande de devis ou de contact',
      'Outils pratiques pour améliorer votre présence',
      'Support technique',
    ],
    premiumIntro: 'Un suivi accompagné pour garder votre CV Business et vos informations à jour.',
    premiumFeatures: [
      'Mises à jour groupées',
      "Ajout d'informations et de photos",
      'Vérification des liens et horaires',
      'Assistance prioritaire',
    ],
    requestArtisan: 'Choisir Artisan',
    requestPremium: 'Choisir Premium',
    certifiedTitle: 'Badge Dalil Tounes Certifié',
    certifiedText: "Attribué après vérification de l'identité, des informations et des justificatifs.",
    certifiedIndependence: 'Cette vérification est indépendante de la formule choisie.',
    flyers: 'Flyers',
    annualPremiumOnly: 'PREMIUM ANNUEL UNIQUEMENT',
    flyerDescription: '500 flyers inclus avec l’abonnement annuel Premium.',
    flyerProduction: 'Conception et impression réalisées par Dalil Tounes.',
    trialClarification: "Les 3 mois d'essai commencent dès l'inscription. L'abonnement annuel est confirmé après le paiement complet. Les 500 flyers sont réservés à l'abonnement annuel Premium.",
    disclaimer: 'Dalil Tounes ne remplace pas vos réseaux sociaux et ne constitue pas une prestation de publicité.',
    ctaTitle: 'Prêt à présenter votre activité plus clairement ?',
    ctaText: 'Commencez gratuitement ou demandez un accompagnement pour créer votre CV Business.',
    ctaButton: 'Choisir ma solution',
    demoName: 'Fiche Démonstration Dalil Tounes',
    demoCategory: 'Plateforme tunisienne',
    tunisia: 'Tunisie',
    open: 'Ouvert',
    todaySchedule: "Aujourd'hui : horaires indiqués sur la fiche",
    todayCardSchedule: "Aujourd'hui : horaires affichés sur la carte",
    demoHours: 'Lundi : 08:00–18:00\nMardi : 08:00–18:00\nMercredi : 08:00–18:00\nJeudi : 08:00–18:00\nVendredi : 08:00–18:00\nSamedi : 09:00–13:00\nDimanche : Fermé',
    contactDalil: 'Contacter Dalil Tounes',
    call: 'Appeler',
    essentialPreviewText: "Une carte gratuite avec le logo et les informations essentielles de l'activité, sans galerie ni portfolio.",
    artisanPreviewText: 'Carte simple pour présenter clairement les informations essentielles. Aucun accès à une fiche Premium détaillée.',
    viewDetails: 'Voir les détails',
    premiumDemoDescription: 'Découvrez comment fonctionne une fiche professionnelle sur Dalil Tounes.',
    premiumDemoServices: 'Annuaire professionnel, Visibilité locale, Présentation des activités',
    previewEssentialTitle: 'Aperçu — Présence essentielle',
    previewArtisanTitle: 'Aperçu — Artisan',
    previewPremiumTitle: 'Aperçu — Premium',
    premiumDetailTitle: 'Fiche Premium détaillée',
    launchConditionsDialog: "Conditions de l'offre spéciale de lancement",
    launchConditionsTitle: "Conditions de l'offre spéciale",
    launchConditions: [
      'Offre réservée aux nouveaux abonnés Artisan et Premium.',
      'Une seule offre par activité.',
      "Les trois mois d'essai commencent à la date d'inscription.",
      'La période totale de 18 mois est calculée à partir de cette date.',
      "L'abonnement annuel est confirmé après le dernier versement.",
      "En cas de paiement annuel incomplet, le compte revient à la formule gratuite à la fin de la période d'essai.",
    ],
    flyerConditions: [
      'En cas de paiement annuel Premium en trois fois, les 500 flyers sont préparés et imprimés après le troisième et dernier versement.',
      'Le modèle du flyer est soumis au professionnel pour validation avant impression.',
      'Le professionnel doit vérifier le nom de l’activité, les coordonnées, le téléphone, les horaires, les textes et le QR Code.',
      'Une impression de 500 exemplaires est incluse après validation.',
      'Toute réimpression demandée à la suite d’une modification effectuée après validation est facturée séparément.',
    ],
    requestTitle: 'Demander cette solution',
    requestModal: 'Demande',
    cvPlanLabel: 'CV Business — paiement unique 199 TND',
    artisanPlanLabel: 'Abonnement Artisan',
    premiumPlanLabel: 'Abonnement Premium',
  },
  ar: {
    closeModal: 'إغلاق النافذة',
    heroEyebrow: 'حلول للمهنيين',
    heroTitle: 'اختر الطريقة المناسبة للبدء',
    heroSubtitle: 'يجمع دليل تونس معلومات نشاطك دون أن يحل محل المنصات التي تستخدمها.',
    startingSolutions: 'حلول البدء',
    selfService: 'أنشئها بنفسي',
    yourLogo: 'شعار\nنشاطك',
    essentialTitle: 'الحضور الأساسي',
    essentialFree: 'مجاني، دون اشتراك إلزامي',
    essentialFeatures: [
      'اسم النشاط',
      'الفئة والمدينة',
      'الهاتف أو واتساب',
      'أوقات العمل',
      'وصف مختصر',
      'شعار النشاط',
      'الظهور في بحث دليل تونس',
    ],
    addActivity: 'أضف نشاطي',
    previewCard: 'معاينة البطاقة',
    humanSupport: 'مرافقة بشرية',
    cvTitle: 'سيرة النشاط المهنية ننشئها معك',
    cvPriceNotice: 'دفعة واحدة — يبقى السعر الإجمالي دائمًا 199 د.ت.',
    paymentOptions: 'خيارات الدفع',
    payOnce: '199 د.ت دفعة واحدة',
    or: 'أو',
    payTwice: '100 د.ت ثم 99 د.ت',
    payThreeTimes: '67 + 66 + 66 د.ت',
    cvPublication: 'يتم إعداد سيرة نشاطك المهنية خلال المراحل المختلفة ونشرها بعد اكتمال الدفع.',
    cvFeatures: [
      'مقابلة وجمع المعلومات',
      'صياغة العرض التعريفي',
      'تنظيم الخدمات',
      'عرض الخبرة المهنية',
      'بيانات اتصال كاملة',
      'أوقات العمل',
      'مناطق التدخل',
      'ملف الأعمال والإنجازات',
      'ما يصل إلى 10 صور يقدمها المهني',
      'ربط المنصات الموجودة',
      'رمز QR رقمي',
      'معاينة خاصة قبل النشر',
      'تعديل مجمع واحد',
      'النشر النهائي بعد اكتمال الدفع',
    ],
    requestCreation: 'اطلب الإنشاء',
    continuousServices: 'خدمات مستمرة وخيارات',
    launchBadge: 'عرض الإطلاق',
    launchTitle: 'عرض إطلاق خاص',
    launchIntro: 'استفد من 3 أشهر مجانية من خدمة حرفي أو بريميوم فور تسجيلك.',
    launchAnnualPrefix: 'عند اختيار الاشتراك السنوي، تستفيد من 3 أشهر إضافية:',
    launchAnnualStrong: '18 شهرًا من النفاذ إجمالًا بسعر 12 شهرًا.',
    launchPayment: 'يمكن دفع الاشتراك السنوي على ثلاث دفعات.',
    seeConditions: 'عرض الشروط',
    artisan: 'حرفي',
    premium: 'بريميوم',
    artisanIntro: 'أدوات عملية لإدارة حضورك وتطويره باستخدام بطاقة بسيطة.',
    artisanFeatures: [
      'الإحصائيات والمشاهدات',
      'نماذج طلب عرض سعر أو اتصال',
      'أدوات عملية لتحسين حضورك',
      'دعم فني',
    ],
    premiumIntro: 'مرافقة تساعدك على تحديث سيرة نشاطك المهنية ومعلوماتك.',
    premiumFeatures: [
      'تحديثات مجمعة',
      'إضافة معلومات وصور',
      'التحقق من الروابط وأوقات العمل',
      'مساعدة ذات أولوية',
    ],
    requestArtisan: 'اختر حرفي',
    requestPremium: 'اختر بريميوم',
    certifiedTitle: 'موثّق من دليل تونس',
    certifiedText: 'يُمنح بعد التحقق من الهوية والمعلومات والمستندات الثبوتية.',
    certifiedIndependence: 'هذا التحقق مستقل عن الصيغة المختارة.',
    flyers: 'المنشورات الإعلانية',
    annualPremiumOnly: 'للاشتراك السنوي PREMIUM فقط',
    flyerDescription: 'يشمل الاشتراك السنوي Premium طباعة 500 منشور إعلاني.',
    flyerProduction: 'يتولى دليل تونس التصميم والطباعة.',
    trialClarification: 'تبدأ فترة التجربة المجانية لمدة 3 أشهر فور التسجيل. يتم تأكيد الاشتراك السنوي بعد اكتمال الدفع. تقتصر طباعة 500 منشور إعلاني على الاشتراك السنوي Premium.',
    disclaimer: 'لا يحل دليل تونس محل شبكاتك الاجتماعية ولا يشكل خدمة إعلانية.',
    ctaTitle: 'هل أنت مستعد لتقديم نشاطك بصورة أوضح؟',
    ctaText: 'ابدأ مجانًا أو اطلب مرافقة لإنشاء سيرة نشاطك المهنية.',
    ctaButton: 'اختر الحل المناسب',
    demoName: 'بطاقة دليل تونس التجريبية',
    demoCategory: 'منصة تونسية',
    tunisia: 'تونس',
    open: 'مفتوح',
    todaySchedule: 'اليوم: الأوقات مبيّنة في البطاقة',
    todayCardSchedule: 'اليوم: الأوقات معروضة على البطاقة',
    demoHours: 'الاثنين: 08:00–18:00\nالثلاثاء: 08:00–18:00\nالأربعاء: 08:00–18:00\nالخميس: 08:00–18:00\nالجمعة: 08:00–18:00\nالسبت: 09:00–13:00\nالأحد: مغلق',
    contactDalil: 'اتصل بدليل تونس',
    call: 'اتصل',
    essentialPreviewText: 'بطاقة مجانية تضم الشعار والمعلومات الأساسية للنشاط، دون معرض صور أو ملف أعمال.',
    artisanPreviewText: 'بطاقة بسيطة لعرض المعلومات الأساسية بوضوح، دون النفاذ إلى بطاقة بريميوم المفصلة.',
    viewDetails: 'عرض التفاصيل',
    premiumDemoDescription: 'اكتشف كيف تعمل البطاقة المهنية على دليل تونس.',
    premiumDemoServices: 'دليل مهني، حضور محلي، عرض الأنشطة',
    previewEssentialTitle: 'معاينة — الحضور الأساسي',
    previewArtisanTitle: 'معاينة — حرفي',
    previewPremiumTitle: 'معاينة — بريميوم',
    premiumDetailTitle: 'بطاقة بريميوم المفصلة',
    launchConditionsDialog: 'شروط عرض الإطلاق الخاص',
    launchConditionsTitle: 'شروط العرض الخاص',
    launchConditions: [
      'العرض مخصص للمشتركين الجدد في حرفي وبريميوم.',
      'عرض واحد فقط لكل نشاط.',
      'تبدأ فترة التجربة المجانية لمدة ثلاثة أشهر من تاريخ التسجيل.',
      'تُحتسب المدة الإجمالية البالغة 18 شهرًا ابتداءً من هذا التاريخ.',
      'يُؤكد الاشتراك السنوي بعد الدفعة الأخيرة.',
      'إذا لم يكتمل الدفع السنوي، يعود الحساب إلى الحضور الأساسي المجاني عند نهاية فترة التجربة.',
    ],
    flyerConditions: [
      'عند دفع الاشتراك السنوي Premium على ثلاث دفعات، يتم إعداد وطباعة 500 منشور إعلاني بعد الدفعة الثالثة والأخيرة.',
      'يُعرض نموذج المنشور الإعلاني على المهني للمصادقة عليه قبل الطباعة.',
      'يجب على المهني التحقق من اسم النشاط وبيانات الاتصال ورقم الهاتف وأوقات العمل والنصوص ورمز QR.',
      'تشمل الخدمة طباعة 500 نسخة بعد المصادقة.',
      'تُفوتر بشكل منفصل أي إعادة طباعة مطلوبة نتيجة تعديل تم بعد المصادقة.',
    ],
    requestTitle: 'اطلب هذا الحل',
    requestModal: 'طلب',
    cvPlanLabel: 'سيرة النشاط المهنية — دفعة واحدة 199 د.ت',
    artisanPlanLabel: 'اشتراك حرفي',
    premiumPlanLabel: 'اشتراك بريميوم',
  },
  en: {
    closeModal: 'Close window',
    heroEyebrow: 'Solutions for professionals',
    heroTitle: 'Choose how you want to get started',
    heroSubtitle: 'Dalil Tounes brings together your business information without replacing the platforms you use.',
    startingSolutions: 'Getting-started solutions',
    selfService: 'I create it myself',
    yourLogo: 'Your\nlogo',
    essentialTitle: 'Essential presence',
    essentialFree: 'Free, with no mandatory subscription',
    essentialFeatures: [
      'Business name',
      'Category and city',
      'Phone or WhatsApp',
      'Opening hours',
      'Short description',
      'Business logo',
      'Visibility in Dalil Tounes search',
    ],
    addActivity: 'Add my business',
    previewCard: 'Preview the card',
    humanSupport: 'Personal support',
    cvTitle: 'CV Business created with you',
    cvPriceNotice: 'One-time payment — the total price always remains 199 TND.',
    paymentOptions: 'Payment options',
    payOnce: '199 TND in one payment',
    or: 'or',
    payTwice: '100 TND then 99 TND',
    payThreeTimes: '67 + 66 + 66 TND',
    cvPublication: 'Your CV Business is prepared through the different stages and published after full payment.',
    cvFeatures: [
      'Interview and information collection',
      'Writing the presentation',
      'Organising the services',
      'Presenting professional expertise',
      'Full contact details',
      'Opening hours',
      'Service areas',
      'Portfolio and completed work',
      'Up to 10 photos supplied by the professional',
      'Connection to existing platforms',
      'Digital QR Code',
      'Private preview before publication',
      'One grouped revision',
      'Final publication after full payment',
    ],
    requestCreation: 'Request creation',
    continuousServices: 'Ongoing services & options',
    launchBadge: 'LAUNCH OFFER',
    launchTitle: 'Special launch offer',
    launchIntro: 'Enjoy 3 months of Artisan or Premium access free of charge from the date you register.',
    launchAnnualPrefix: 'By choosing the annual subscription, you receive 3 additional months:',
    launchAnnualStrong: '18 months of access in total for the price of 12.',
    launchPayment: 'The annual subscription can be paid in three installments.',
    seeConditions: 'View conditions',
    artisan: 'Artisan',
    premium: 'Premium',
    artisanIntro: 'Practical tools to manage and develop your presence with a simple card.',
    artisanFeatures: [
      'Statistics and views',
      'Quote request or contact forms',
      'Practical tools to improve your presence',
      'Technical support',
    ],
    premiumIntro: 'Guided support to keep your CV Business and information up to date.',
    premiumFeatures: [
      'Grouped updates',
      'Adding information and photos',
      'Verification of links and opening hours',
      'Priority assistance',
    ],
    requestArtisan: 'Choose Artisan',
    requestPremium: 'Choose Premium',
    certifiedTitle: 'Certified by Dalil Tounes',
    certifiedText: 'Awarded after verification of identity, information and supporting documents.',
    certifiedIndependence: 'This verification is independent of the selected plan.',
    flyers: 'Flyers',
    annualPremiumOnly: 'ANNUAL PREMIUM ONLY',
    flyerDescription: '500 flyers included with the annual Premium subscription.',
    flyerProduction: 'Design and printing by Dalil Tounes.',
    trialClarification: 'The 3-month trial starts when you register. The annual subscription is confirmed after full payment. The 500 flyers are reserved for the annual Premium subscription.',
    disclaimer: 'Dalil Tounes does not replace your social media and is not an advertising service.',
    ctaTitle: 'Ready to present your business more clearly?',
    ctaText: 'Start for free or request support to create your CV Business.',
    ctaButton: 'Choose my solution',
    demoName: 'Dalil Tounes Demonstration Profile',
    demoCategory: 'Tunisian platform',
    tunisia: 'Tunisia',
    open: 'Open',
    todaySchedule: 'Today: hours shown on the profile',
    todayCardSchedule: 'Today: hours shown on the card',
    demoHours: 'Monday: 08:00–18:00\nTuesday: 08:00–18:00\nWednesday: 08:00–18:00\nThursday: 08:00–18:00\nFriday: 08:00–18:00\nSaturday: 09:00–13:00\nSunday: Closed',
    contactDalil: 'Contact Dalil Tounes',
    call: 'Call',
    essentialPreviewText: 'A free card with the logo and essential business information, without a gallery or portfolio.',
    artisanPreviewText: 'A simple card that clearly presents essential information. It does not include access to a detailed Premium profile.',
    viewDetails: 'View details',
    premiumDemoDescription: 'Discover how a professional profile works on Dalil Tounes.',
    premiumDemoServices: 'Professional directory, Local visibility, Business presentation',
    previewEssentialTitle: 'Preview — Essential presence',
    previewArtisanTitle: 'Preview — Artisan',
    previewPremiumTitle: 'Preview — Premium',
    premiumDetailTitle: 'Detailed Premium profile',
    launchConditionsDialog: 'Special launch offer conditions',
    launchConditionsTitle: 'Special offer conditions',
    launchConditions: [
      'Offer reserved for new Artisan and Premium subscribers.',
      'Only one offer per business.',
      'The three-month trial starts on the registration date.',
      'The total 18-month period is calculated from that date.',
      'The annual subscription is confirmed after the final installment.',
      'If the annual payment is incomplete, the account returns to the free plan at the end of the trial period.',
    ],
    flyerConditions: [
      'If the annual Premium subscription is paid in three installments, the 500 flyers are prepared and printed after the third and final installment.',
      'The flyer design is submitted to the professional for approval before printing.',
      'The professional must check the business name, contact details, phone number, opening hours, texts and QR Code.',
      'One print run of 500 copies is included after approval.',
      'Any reprint requested following a change made after approval is billed separately.',
    ],
    requestTitle: 'Request this solution',
    requestModal: 'Request',
    cvPlanLabel: 'CV Business — one-time payment of 199 TND',
    artisanPlanLabel: 'Artisan subscription',
    premiumPlanLabel: 'Premium subscription',
  },
  it: {
    closeModal: 'Chiudi la finestra',
    heroEyebrow: 'Soluzioni per i professionisti',
    heroTitle: 'Scegli come iniziare',
    heroSubtitle: 'Dalil Tounes riunisce le informazioni della tua attività senza sostituire le piattaforme che utilizzi.',
    startingSolutions: 'Soluzioni per iniziare',
    selfService: 'Creo il profilo autonomamente',
    yourLogo: 'Il tuo\nlogo',
    essentialTitle: 'Presenza essenziale',
    essentialFree: 'Gratuito, senza abbonamento obbligatorio',
    essentialFeatures: [
      'Nome dell’attività',
      'Categoria e città',
      'Telefono o WhatsApp',
      'Orari di apertura',
      'Breve descrizione',
      'Logo dell’attività',
      'Presenza nella ricerca Dalil Tounes',
    ],
    addActivity: 'Aggiungi la mia attività',
    previewCard: 'Anteprima della scheda',
    humanSupport: 'Assistenza personalizzata',
    cvTitle: 'CV Business creato con te',
    cvPriceNotice: 'Pagamento unico — il prezzo totale rimane sempre 199 TND.',
    paymentOptions: 'Modalità di pagamento',
    payOnce: '199 TND in un’unica soluzione',
    or: 'oppure',
    payTwice: '100 TND e poi 99 TND',
    payThreeTimes: '67 + 66 + 66 TND',
    cvPublication: 'Il tuo CV Business viene preparato durante le varie fasi e pubblicato dopo il pagamento completo.',
    cvFeatures: [
      'Colloquio e raccolta delle informazioni',
      'Redazione della presentazione',
      'Organizzazione dei servizi',
      'Presentazione delle competenze professionali',
      'Recapiti completi',
      'Orari di apertura',
      'Zone di intervento',
      'Portfolio e lavori realizzati',
      'Fino a 10 foto fornite dal professionista',
      'Collegamento alle piattaforme esistenti',
      'QR Code digitale',
      'Anteprima privata prima della pubblicazione',
      'Una revisione raggruppata',
      'Pubblicazione finale dopo il pagamento completo',
    ],
    requestCreation: 'Richiedi la creazione',
    continuousServices: 'Servizi continuativi e opzioni',
    launchBadge: 'OFFERTA DI LANCIO',
    launchTitle: 'Offerta speciale di lancio',
    launchIntro: 'Ottieni 3 mesi di accesso Artisan o Premium gratuiti a partire dalla registrazione.',
    launchAnnualPrefix: 'Scegliendo l’abbonamento annuale, ricevi altri 3 mesi:',
    launchAnnualStrong: '18 mesi di accesso totali al prezzo di 12.',
    launchPayment: 'L’abbonamento annuale può essere pagato in tre rate.',
    seeConditions: 'Vedi le condizioni',
    artisan: 'Artisan',
    premium: 'Premium',
    artisanIntro: 'Strumenti pratici per gestire e sviluppare la tua presenza con una scheda semplice.',
    artisanFeatures: [
      'Statistiche e visualizzazioni',
      'Moduli per richieste di preventivo o contatto',
      'Strumenti pratici per migliorare la tua presenza',
      'Assistenza tecnica',
    ],
    premiumIntro: 'Assistenza dedicata per mantenere aggiornati il tuo CV Business e le tue informazioni.',
    premiumFeatures: [
      'Aggiornamenti raggruppati',
      'Aggiunta di informazioni e foto',
      'Verifica dei link e degli orari',
      'Assistenza prioritaria',
    ],
    requestArtisan: 'Scegli Artisan',
    requestPremium: 'Scegli Premium',
    certifiedTitle: 'Certificato da Dalil Tounes',
    certifiedText: 'Attribuito dopo la verifica dell’identità, delle informazioni e dei documenti giustificativi.',
    certifiedIndependence: 'Questa verifica è indipendente dalla formula scelta.',
    flyers: 'Volantini',
    annualPremiumOnly: 'SOLO PREMIUM ANNUALE',
    flyerDescription: '500 volantini inclusi con l’abbonamento annuale Premium.',
    flyerProduction: 'Progettazione grafica e stampa a cura di Dalil Tounes.',
    trialClarification: 'I 3 mesi di prova iniziano con la registrazione. L’abbonamento annuale è confermato dopo il pagamento completo. I 500 volantini sono riservati all’abbonamento annuale Premium.',
    disclaimer: 'Dalil Tounes non sostituisce i tuoi social network e non costituisce un servizio pubblicitario.',
    ctaTitle: 'Vuoi presentare la tua attività in modo più chiaro?',
    ctaText: 'Inizia gratuitamente o richiedi assistenza per creare il tuo CV Business.',
    ctaButton: 'Scegli la mia soluzione',
    demoName: 'Scheda dimostrativa Dalil Tounes',
    demoCategory: 'Piattaforma tunisina',
    tunisia: 'Tunisia',
    open: 'Aperto',
    todaySchedule: 'Oggi: orari indicati nella scheda',
    todayCardSchedule: 'Oggi: orari mostrati sulla scheda',
    demoHours: 'Lunedì: 08:00–18:00\nMartedì: 08:00–18:00\nMercoledì: 08:00–18:00\nGiovedì: 08:00–18:00\nVenerdì: 08:00–18:00\nSabato: 09:00–13:00\nDomenica: Chiuso',
    contactDalil: 'Contatta Dalil Tounes',
    call: 'Chiama',
    essentialPreviewText: 'Una scheda gratuita con il logo e le informazioni essenziali dell’attività, senza galleria né portfolio.',
    artisanPreviewText: 'Una scheda semplice per presentare chiaramente le informazioni essenziali. Non include l’accesso a una scheda Premium dettagliata.',
    viewDetails: 'Vedi i dettagli',
    premiumDemoDescription: 'Scopri come funziona una scheda professionale su Dalil Tounes.',
    premiumDemoServices: 'Elenco professionale, Visibilità locale, Presentazione delle attività',
    previewEssentialTitle: 'Anteprima — Presenza essenziale',
    previewArtisanTitle: 'Anteprima — Artisan',
    previewPremiumTitle: 'Anteprima — Premium',
    premiumDetailTitle: 'Scheda Premium dettagliata',
    launchConditionsDialog: 'Condizioni dell’offerta speciale di lancio',
    launchConditionsTitle: 'Condizioni dell’offerta speciale',
    launchConditions: [
      'Offerta riservata ai nuovi abbonati Artisan e Premium.',
      'Una sola offerta per attività.',
      'I tre mesi di prova iniziano dalla data di registrazione.',
      'Il periodo totale di 18 mesi viene calcolato a partire da tale data.',
      'L’abbonamento annuale è confermato dopo l’ultima rata.',
      'In caso di pagamento annuale incompleto, l’account torna alla formula gratuita al termine del periodo di prova.',
    ],
    flyerConditions: [
      'In caso di pagamento dell’abbonamento annuale Premium in tre rate, i 500 volantini vengono preparati e stampati dopo la terza e ultima rata.',
      'Il modello del volantino viene sottoposto al professionista per l’approvazione prima della stampa.',
      'Il professionista deve verificare il nome dell’attività, i recapiti, il telefono, gli orari, i testi e il QR Code.',
      'Dopo l’approvazione è inclusa una tiratura di 500 copie.',
      'Qualsiasi ristampa richiesta a seguito di una modifica effettuata dopo l’approvazione viene fatturata separatamente.',
    ],
    requestTitle: 'Richiedi questa soluzione',
    requestModal: 'Richiesta',
    cvPlanLabel: 'CV Business — pagamento unico di 199 TND',
    artisanPlanLabel: 'Abbonamento Artisan',
    premiumPlanLabel: 'Abbonamento Premium',
  },
  ru: {
    closeModal: 'Закрыть окно',
    heroEyebrow: 'Решения для профессионалов',
    heroTitle: 'Выберите, как начать',
    heroSubtitle: 'Dalil Tounes объединяет информацию о вашей деятельности, не заменяя используемые вами платформы.',
    startingSolutions: 'Решения для начала работы',
    selfService: 'Я создаю профиль самостоятельно',
    yourLogo: 'Ваш\nлоготип',
    essentialTitle: 'Базовое присутствие',
    essentialFree: 'Бесплатно, без обязательной подписки',
    essentialFeatures: [
      'Название деятельности',
      'Категория и город',
      'Телефон или WhatsApp',
      'Часы работы',
      'Краткое описание',
      'Логотип деятельности',
      'Отображение в поиске Dalil Tounes',
    ],
    addActivity: 'Добавить мою деятельность',
    previewCard: 'Предпросмотр карточки',
    humanSupport: 'Персональное сопровождение',
    cvTitle: 'CV Business, созданное вместе с вами',
    cvPriceNotice: 'Единовременная оплата — общая стоимость всегда составляет 199 TND.',
    paymentOptions: 'Варианты оплаты',
    payOnce: '199 TND одним платежом',
    or: 'или',
    payTwice: '100 TND, затем 99 TND',
    payThreeTimes: '67 + 66 + 66 TND',
    cvPublication: 'Ваше CV Business подготавливается поэтапно и публикуется после полной оплаты.',
    cvFeatures: [
      'Собеседование и сбор информации',
      'Подготовка презентации',
      'Организация услуг',
      'Представление профессионального опыта',
      'Полные контактные данные',
      'Часы работы',
      'Зоны обслуживания',
      'Портфолио и выполненные работы',
      'До 10 фотографий, предоставленных профессионалом',
      'Подключение существующих платформ',
      'Цифровой QR-код',
      'Закрытый предпросмотр перед публикацией',
      'Одна групповая правка',
      'Окончательная публикация после полной оплаты',
    ],
    requestCreation: 'Запросить создание',
    continuousServices: 'Постоянные услуги и опции',
    launchBadge: 'СТАРТОВОЕ ПРЕДЛОЖЕНИЕ',
    launchTitle: 'Специальное стартовое предложение',
    launchIntro: 'Получите 3 месяца доступа Artisan или Premium бесплатно с момента регистрации.',
    launchAnnualPrefix: 'При выборе годовой подписки вы получаете ещё 3 месяца:',
    launchAnnualStrong: 'всего 18 месяцев доступа по цене 12.',
    launchPayment: 'Годовую подписку можно оплатить тремя платежами.',
    seeConditions: 'Посмотреть условия',
    artisan: 'Artisan',
    premium: 'Premium',
    artisanIntro: 'Практичные инструменты для управления и развития вашего присутствия с помощью простой карточки.',
    artisanFeatures: [
      'Статистика и просмотры',
      'Формы запроса расчёта или связи',
      'Практичные инструменты для улучшения вашего присутствия',
      'Техническая поддержка',
    ],
    premiumIntro: 'Сопровождение для поддержания актуальности вашего CV Business и информации.',
    premiumFeatures: [
      'Пакетные обновления',
      'Добавление информации и фотографий',
      'Проверка ссылок и часов работы',
      'Приоритетная помощь',
    ],
    requestArtisan: 'Выбрать Artisan',
    requestPremium: 'Выбрать Premium',
    certifiedTitle: 'Сертифицировано Dalil Tounes',
    certifiedText: 'Присваивается после проверки личности, информации и подтверждающих документов.',
    certifiedIndependence: 'Эта проверка не зависит от выбранного тарифа.',
    flyers: 'Флаеры',
    annualPremiumOnly: 'ТОЛЬКО ГОДОВАЯ ПОДПИСКА PREMIUM',
    flyerDescription: '500 флаеров включены в годовую подписку Premium.',
    flyerProduction: 'Дизайн и печать выполняет Dalil Tounes.',
    trialClarification: 'Трёхмесячный пробный период начинается при регистрации. Годовая подписка подтверждается после полной оплаты. 500 флаеров доступны только в рамках годовой подписки Premium.',
    disclaimer: 'Dalil Tounes не заменяет ваши социальные сети и не является рекламной услугой.',
    ctaTitle: 'Готовы представить свою деятельность более понятно?',
    ctaText: 'Начните бесплатно или запросите сопровождение для создания CV Business.',
    ctaButton: 'Выбрать решение',
    demoName: 'Демонстрационный профиль Dalil Tounes',
    demoCategory: 'Тунисская платформа',
    tunisia: 'Тунис',
    open: 'Открыто',
    todaySchedule: 'Сегодня: часы работы указаны в профиле',
    todayCardSchedule: 'Сегодня: часы работы указаны на карточке',
    demoHours: 'Понедельник: 08:00–18:00\nВторник: 08:00–18:00\nСреда: 08:00–18:00\nЧетверг: 08:00–18:00\nПятница: 08:00–18:00\nСуббота: 09:00–13:00\nВоскресенье: Закрыто',
    contactDalil: 'Связаться с Dalil Tounes',
    call: 'Позвонить',
    essentialPreviewText: 'Бесплатная карточка с логотипом и основной информацией о деятельности, без галереи и портфолио.',
    artisanPreviewText: 'Простая карточка для понятного представления основной информации. Доступ к подробному профилю Premium не включён.',
    viewDetails: 'Посмотреть подробности',
    premiumDemoDescription: 'Узнайте, как работает профессиональный профиль на Dalil Tounes.',
    premiumDemoServices: 'Профессиональный каталог, Локальная видимость, Презентация деятельности',
    previewEssentialTitle: 'Предпросмотр — Базовое присутствие',
    previewArtisanTitle: 'Предпросмотр — Artisan',
    previewPremiumTitle: 'Предпросмотр — Premium',
    premiumDetailTitle: 'Подробный профиль Premium',
    launchConditionsDialog: 'Условия специального стартового предложения',
    launchConditionsTitle: 'Условия специального предложения',
    launchConditions: [
      'Предложение предназначено для новых подписчиков Artisan и Premium.',
      'Только одно предложение на одну деятельность.',
      'Трёхмесячный пробный период начинается с даты регистрации.',
      'Общий период в 18 месяцев рассчитывается с этой даты.',
      'Годовая подписка подтверждается после последнего платежа.',
      'Если годовая оплата не завершена, после окончания пробного периода аккаунт возвращается на бесплатный тариф.',
    ],
    flyerConditions: [
      'При оплате годовой подписки Premium тремя платежами 500 флаеров подготавливаются и печатаются после третьего и последнего платежа.',
      'Макет флаера перед печатью предоставляется профессионалу на утверждение.',
      'Профессионал должен проверить название деятельности, контактные данные, телефон, часы работы, тексты и QR-код.',
      'После утверждения включена печать 500 экземпляров.',
      'Любая повторная печать, запрошенная из-за изменения после утверждения, оплачивается отдельно.',
    ],
    requestTitle: 'Запросить это решение',
    requestModal: 'Запрос',
    cvPlanLabel: 'CV Business — единовременная оплата 199 TND',
    artisanPlanLabel: 'Подписка Artisan',
    premiumPlanLabel: 'Подписка Premium',
  },
} as const;

type SubscriptionCopy = (typeof subscriptionCopy)[keyof typeof subscriptionCopy];

type OfferLanguage = keyof typeof subscriptionCopy;

const businessPreviewCopy: Record<OfferLanguage, {
  artisanBadge: string; certified: string; category: string; city: string; status: string;
  actions: [string, string, string, string, string, string];
  sections: [string, string, string, string, string];
  sectionHints: [string, string, string, string, string];
  social: string; email: string; recommend: string; qr: string; demoFeedback: string;
  sharing: [string, string, string, string];
}> = {
  fr: { artisanBadge: 'Artisan', certified: 'Certifié Dalil Tounes', category: 'Services professionnels', city: 'Tunis, Tunisie', status: 'Ouvert', actions: ['Appeler', 'WhatsApp', 'Itinéraire', 'Réserver', 'Site web', 'Partager'], sections: ['À propos', 'Services', 'Horaires', 'Avis clients', 'Galerie'], sectionHints: ['Découvre qui nous sommes', 'Ce que nous faisons pour toi', 'Lun–Sam : 08:00–18:00', '5,0 · Avis de démonstration', 'Photos de nos réalisations'], social: 'Réseaux sociaux', email: 'E-mail', recommend: 'Recommander ce professionnel', qr: 'QR de partage professionnel', demoFeedback: 'Interaction de démonstration :', sharing: ['WhatsApp', 'Telegram', 'SMS', 'Messenger'] },
  ar: { artisanBadge: 'حرفي', certified: 'موثّق من دليل تونس', category: 'خدمات مهنية', city: 'تونس، تونس', status: 'مفتوح', actions: ['اتصال', 'واتساب', 'الاتجاهات', 'حجز', 'الموقع', 'مشاركة'], sections: ['من نحن', 'الخدمات', 'الأوقات', 'آراء العملاء', 'الصور'], sectionHints: ['اكتشف من نحن', 'ما نقدمه لك', 'الإثنين–السبت: 08:00–18:00', '5.0 · آراء تجريبية', 'صور من إنجازاتنا'], social: 'شبكات التواصل', email: 'البريد الإلكتروني', recommend: 'أوصِ بهذا المهني', qr: 'رمز QR للمشاركة المهنية', demoFeedback: 'تفاعل تجريبي:', sharing: ['واتساب', 'تيليغرام', 'رسالة نصية', 'ماسنجر'] },
  en: { artisanBadge: 'Artisan', certified: 'Dalil Tounes Certified', category: 'Professional services', city: 'Tunis, Tunisia', status: 'Open', actions: ['Call', 'WhatsApp', 'Directions', 'Book', 'Website', 'Share'], sections: ['About', 'Services', 'Hours', 'Customer reviews', 'Gallery'], sectionHints: ['Discover who we are', 'What we do for you', 'Mon–Sat: 08:00–18:00', '5.0 · Demo reviews', 'Photos of our work'], social: 'Social networks', email: 'E-mail', recommend: 'Recommend this professional', qr: 'Professional sharing QR', demoFeedback: 'Demo interaction:', sharing: ['WhatsApp', 'Telegram', 'SMS', 'Messenger'] },
  it: { artisanBadge: 'Artisan', certified: 'Certificato Dalil Tounes', category: 'Servizi professionali', city: 'Tunisi, Tunisia', status: 'Aperto', actions: ['Chiama', 'WhatsApp', 'Indicazioni', 'Prenota', 'Sito web', 'Condividi'], sections: ['Chi siamo', 'Servizi', 'Orari', 'Recensioni', 'Galleria'], sectionHints: ['Scopri chi siamo', 'Cosa facciamo per te', 'Lun–Sab: 08:00–18:00', '5,0 · Recensioni demo', 'Foto dei nostri lavori'], social: 'Reti sociali', email: 'E-mail', recommend: 'Consiglia questo professionista', qr: 'QR di condivisione professionale', demoFeedback: 'Interazione demo:', sharing: ['WhatsApp', 'Telegram', 'SMS', 'Messenger'] },
  ru: { artisanBadge: 'Artisan', certified: 'Проверено Dalil Tounes', category: 'Профессиональные услуги', city: 'Тунис, Тунис', status: 'Открыто', actions: ['Позвонить', 'WhatsApp', 'Маршрут', 'Бронь', 'Сайт', 'Поделиться'], sections: ['О нас', 'Услуги', 'Часы работы', 'Отзывы', 'Галерея'], sectionHints: ['Узнайте о нас', 'Что мы делаем для вас', 'Пн–Сб: 08:00–18:00', '5,0 · Демо-отзывы', 'Фотографии наших работ'], social: 'Социальные сети', email: 'Эл. почта', recommend: 'Рекомендовать специалиста', qr: 'Профессиональный QR-код', demoFeedback: 'Демонстрация:', sharing: ['WhatsApp', 'Telegram', 'СМС', 'Messenger'] },
};

const personalAccessCopy: Record<OfferLanguage, string> = {
  fr: 'Accès personnel pour gérer tes informations',
  ar: 'دخول شخصي لإدارة معلوماتك',
  en: 'Personal access to manage your information',
  it: 'Accesso personale per gestire le tue informazioni',
  ru: 'Личный доступ для управления информацией',
};

const accordionDescriptionLeadCopy: Record<OfferLanguage, string> = {
  fr: 'Cette prestation est incluse et adaptée aux informations de ton activité.',
  ar: 'هذه الخدمة مشمولة ويتم تكييفها مع معلومات نشاطك.',
  en: 'This service is included and tailored to your business information.',
  it: 'Questa prestazione è inclusa e adattata alle informazioni della tua attività.',
  ru: 'Эта услуга включена и адаптируется к информации о вашей деятельности.',
};

const essentialCvCopy: Record<OfferLanguage, {
  title: string;
  subtitle: string;
  badge: string;
  humanMessage: string[];
  features: string[];
  payOnce: string;
  payThreeTimes: string;
  publication: string;
  ideal: string;
  choose: string;
  planLabel: string;
  completeIdeal: string;
  helpTitle: string;
  helpText: string;
}> = {
  fr: {
    title: 'CV Business Essentiel',
    subtitle: 'Une première présentation professionnelle pour lancer ton activité sans dépasser ton budget.',
    badge: 'Formule de démarrage',
    humanMessage: [
      'Chez Dalil Tounes, nous savons que chaque activité avance à son rythme.',
      'Si tu viens de commencer ou que ton budget est encore limité, nous pouvons t’aider à construire une première présence professionnelle, simple et claire.',
      'Notre objectif est de t’accompagner aujourd’hui et de faire évoluer ta présentation avec ton activité.',
    ],
    features: ['Entretien court et collecte des informations essentielles', 'Présentation courte de l’activité', 'Coordonnées complètes', 'Horaires', 'Zones d’intervention', 'Jusqu’à 5 photos fournies par le professionnel', 'Connexion de WhatsApp, Facebook, Instagram, du site internet et de Google Maps', 'Lien personnel partageable', 'QR Code numérique', 'Aperçu privé avant publication', 'Une correction groupée', 'Publication après paiement complet'],
    payOnce: '79 TND en une fois', payThreeTimes: '27 + 26 + 26 TND',
    publication: 'La publication finale intervient après le paiement complet.',
    ideal: 'Idéal pour commencer avec une présentation claire et les informations essentielles.',
    choose: 'Choisir la formule Essentielle', planLabel: 'CV Business Essentiel — 79 TND',
    completeIdeal: 'Idéal si tu veux une présentation plus complète, structurée et détaillée de ton activité, de tes services et de ton savoir-faire.',
    helpTitle: 'Tu hésites entre les deux formules ?',
    helpText: 'Écris-nous sur WhatsApp ou par e-mail. Nous t’aiderons à choisir la solution la plus adaptée à ton activité et à ton budget, sans te pousser vers une offre inutilement élevée.',
  },
  ar: {
    title: 'CV Business الأساسي', subtitle: 'عرض مهني أول لإطلاق نشاطك دون تجاوز ميزانيتك.', badge: 'صيغة للانطلاق',
    humanMessage: ['في دليل تونس، نعرف أن لكل نشاط وتيرته الخاصة.', 'إذا كنت قد بدأت للتو أو كانت ميزانيتك ما تزال محدودة، يمكننا مساعدتك على بناء حضور مهني أول بسيط وواضح.', 'هدفنا هو مرافقتك اليوم وتطوير عرضك مع تطور نشاطك.'],
    features: ['محادثة قصيرة وجمع المعلومات الأساسية', 'تقديم مختصر للنشاط', 'بيانات اتصال كاملة', 'أوقات العمل', 'مناطق التدخل', 'حتى 5 صور يقدمها المهني', 'ربط واتساب وفيسبوك وإنستغرام والموقع الإلكتروني وخرائط Google', 'رابط شخصي قابل للمشاركة', 'رمز QR رقمي', 'معاينة خاصة قبل النشر', 'تعديل واحد مجمّع', 'النشر بعد إتمام الدفع'],
    payOnce: '79 د.ت دفعة واحدة', payThreeTimes: '27 + 26 + 26 د.ت', publication: 'يتم النشر النهائي بعد إتمام الدفع.', ideal: 'مثالي للبدء بعرض واضح ومعلومات أساسية.', choose: 'اختر الصيغة الأساسية', planLabel: 'CV Business الأساسي — 79 د.ت', completeIdeal: 'مثالي إذا كنت تريد عرضًا أكمل ومنظمًا ومفصلًا لنشاطك وخدماتك وخبرتك.', helpTitle: 'هل تتردد بين الصيغتين؟', helpText: 'اكتب لنا عبر واتساب أو البريد الإلكتروني. سنساعدك على اختيار الحل الأنسب لنشاطك وميزانيتك، دون دفعك إلى صيغة أعلى لا تحتاج إليها.',
  },
  en: {
    title: 'Essential Business CV', subtitle: 'A first professional presentation to launch your activity without exceeding your budget.', badge: 'Starter plan',
    humanMessage: ['At Dalil Tounes, we know that every activity moves at its own pace.', 'If you have just started or your budget is still limited, we can help you build a simple, clear first professional presence.', 'Our goal is to support you today and develop your presentation as your activity grows.'],
    features: ['Short interview and collection of essential information', 'Short presentation of the activity', 'Full contact details', 'Opening hours', 'Service areas', 'Up to 5 photos supplied by the professional', 'Connection to WhatsApp, Facebook, Instagram, website and Google Maps', 'Personal shareable link', 'Digital QR Code', 'Private preview before publication', 'One grouped revision', 'Publication after full payment'],
    payOnce: '79 TND in one payment', payThreeTimes: '27 + 26 + 26 TND', publication: 'Final publication takes place after full payment.', ideal: 'Ideal for getting started with a clear presentation and essential information.', choose: 'Choose the Essential plan', planLabel: 'Essential Business CV — 79 TND', completeIdeal: 'Ideal if you want a fuller, structured and detailed presentation of your activity, services and expertise.', helpTitle: 'Not sure which plan to choose?', helpText: 'Write to us on WhatsApp or by email. We will help you choose the solution best suited to your activity and budget, without pushing you towards an unnecessarily expensive plan.',
  },
  it: {
    title: 'CV Business Essenziale', subtitle: 'Una prima presentazione professionale per avviare la tua attività senza superare il budget.', badge: 'Formula di partenza',
    humanMessage: ['In Dalil Tounes sappiamo che ogni attività procede con i propri tempi.', 'Se hai appena iniziato o il tuo budget è ancora limitato, possiamo aiutarti a creare una prima presenza professionale semplice e chiara.', 'Il nostro obiettivo è accompagnarti oggi e far evolvere la tua presentazione insieme alla tua attività.'],
    features: ['Breve colloquio e raccolta delle informazioni essenziali', 'Breve presentazione dell’attività', 'Recapiti completi', 'Orari', 'Zone di intervento', 'Fino a 5 foto fornite dal professionista', 'Collegamento di WhatsApp, Facebook, Instagram, sito internet e Google Maps', 'Link personale condivisibile', 'QR Code digitale', 'Anteprima privata prima della pubblicazione', 'Una revisione raggruppata', 'Pubblicazione dopo il pagamento completo'],
    payOnce: '79 TND in un’unica soluzione', payThreeTimes: '27 + 26 + 26 TND', publication: 'La pubblicazione finale avviene dopo il pagamento completo.', ideal: 'Ideale per iniziare con una presentazione chiara e le informazioni essenziali.', choose: 'Scegli la formula Essenziale', planLabel: 'CV Business Essenziale — 79 TND', completeIdeal: 'Ideale se desideri una presentazione più completa, strutturata e dettagliata della tua attività, dei servizi e delle competenze.', helpTitle: 'Sei indeciso tra le due formule?', helpText: 'Scrivici su WhatsApp o via e-mail. Ti aiuteremo a scegliere la soluzione più adatta alla tua attività e al tuo budget, senza spingerti verso una formula inutilmente più costosa.',
  },
  ru: {
    title: 'CV Business Essential', subtitle: 'Первая профессиональная презентация для запуска деятельности без превышения бюджета.', badge: 'Стартовый вариант',
    humanMessage: ['В Dalil Tounes мы понимаем, что каждый бизнес развивается в своём темпе.', 'Если вы только начали или ваш бюджет пока ограничен, мы поможем создать первое простое и понятное профессиональное представление.', 'Наша цель — поддержать вас сегодня и развивать презентацию вместе с вашей деятельностью.'],
    features: ['Короткое интервью и сбор основной информации', 'Краткое представление деятельности', 'Полные контактные данные', 'Часы работы', 'Зоны обслуживания', 'До 5 фотографий от специалиста', 'Подключение WhatsApp, Facebook, Instagram, сайта и Google Maps', 'Персональная ссылка для публикации', 'Цифровой QR-код', 'Закрытый предпросмотр до публикации', 'Один пакет правок', 'Публикация после полной оплаты'],
    payOnce: '79 TND одним платежом', payThreeTimes: '27 + 26 + 26 TND', publication: 'Окончательная публикация выполняется после полной оплаты.', ideal: 'Подходит для старта с понятной презентацией и основной информацией.', choose: 'Выбрать Essential', planLabel: 'CV Business Essential — 79 TND', completeIdeal: 'Подходит, если вам нужна более полная, структурированная и подробная презентация деятельности, услуг и опыта.', helpTitle: 'Не уверены, какой вариант выбрать?', helpText: 'Напишите нам в WhatsApp или по электронной почте. Мы поможем выбрать решение под вашу деятельность и бюджет, не склоняя вас к неоправданно дорогому варианту.',
  },
};

const paymentChoiceCopy: Record<OfferLanguage, {
  title: string;
  monthly: string;
  annual: string;
  threeMonthsFree: string;
  mostEconomical: string;
  artisanAnnualPrice: string;
  premiumAnnualPrice: string;
}> = {
  fr: { title: 'Choisis ton rythme de paiement', monthly: 'Mensuel', annual: 'Annuel', threeMonthsFree: '3 mois offerts', mostEconomical: 'Le plus économique', artisanAnnualPrice: '299 TND / an', premiumAnnualPrice: '595 TND / an' },
  ar: { title: 'اختر وتيرة الدفع', monthly: 'شهري', annual: 'سنوي', threeMonthsFree: '3 أشهر مجانًا', mostEconomical: 'الأكثر توفيرًا', artisanAnnualPrice: '299 TND / سنة', premiumAnnualPrice: '595 TND / سنة' },
  en: { title: 'Choose your payment schedule', monthly: 'Monthly', annual: 'Annual', threeMonthsFree: '3 months free', mostEconomical: 'Best value', artisanAnnualPrice: '299 TND / year', premiumAnnualPrice: '595 TND / year' },
  it: { title: 'Scegli il ritmo di pagamento', monthly: 'Mensile', annual: 'Annuale', threeMonthsFree: '3 mesi gratuiti', mostEconomical: 'Il più conveniente', artisanAnnualPrice: '299 TND / anno', premiumAnnualPrice: '595 TND / anno' },
  ru: { title: 'Выбери периодичность оплаты', monthly: 'Ежемесячно', annual: 'Ежегодно', threeMonthsFree: '3 месяца бесплатно', mostEconomical: 'Самый выгодный вариант', artisanAnnualPrice: '299 TND / год', premiumAnnualPrice: '595 TND / год' },
};
function ensureFeatureDescriptions(items: readonly string[], description: string) {
  return items.map((item) => splitFeature(item).description ? item : `${item} — ${description}`);
}

const offerCopy: Record<OfferLanguage, {
  artisanPrice: string;
  premiumPrice: string;
  perMonth: string;
  premiumIncludesArtisan: string;
  artisanIntro: string;
  premiumIntro: string;
  artisanFeatures: string[];
  premiumFeatures: string[];
  cvSectionTitle: string;
  cvSectionParagraphs: string[];
  cvIdealTitle: string;
  cvIdealItems: string[];
  cvActionsIntro: string;
  cvActions: string[];
  cvClosing: string;
  oneTimeService: string;
  cvDistinction: string;
  eliteTitle: string;
  customSolution: string;
  eliteIntro: string;
  contactUs: string;
  contactEmail: string;
  contactWhatsApp: string;
  certifiedDisclaimer: string;
  showAllFeatures: string;
  hideAllFeatures: string;
  showCvDetails: string;
  hideCvDetails: string;
}> = {
  fr: {
    artisanPrice: '30 TND', premiumPrice: '59 TND', perMonth: '/ mois',
    premiumIncludesArtisan: 'Premium inclut tous les avantages de l’abonnement Artisan.',
    artisanIntro: 'Une formule pensée pour les artisans, les indépendants, les commerçants et les petites entreprises qui souhaitent être mieux présentés et plus facilement trouvés dans leur région.',
    premiumIntro: 'Une formule destinée aux entreprises qui souhaitent aller plus loin, toucher un public plus large et bénéficier d’un accompagnement plus régulier.',
    artisanFeatures: [
      'Nous créons ta fiche avec toi — Nous échangeons avec toi et mettons en place une fiche claire, sans te laisser seul devant un formulaire.',
      'Une présentation claire de ton activité — Une courte présentation aide les visiteurs à comprendre rapidement ce que tu proposes.',
      'Tes informations utiles au même endroit — Téléphone, WhatsApp, adresse, horaires, zones d’intervention, site, réseaux sociaux et Google Maps.',
      'Jusqu’à 5 photos — Présente ton commerce, tes produits, ton travail ou tes réalisations avec les photos que tu nous fournis.',
      'Une meilleure visibilité dans ta région — Ta fiche est davantage mise en avant auprès des personnes qui recherchent ton activité localement.',
      'Une position améliorée dans les recherches — Ta fiche apparaît avant les présences gratuites dans les résultats liés à ton activité.',
      'Badge Artisan — Un repère visuel permet aux visiteurs d’identifier facilement ton inscription Artisan.',
      'Des statistiques simples — Consulte les visites de ta fiche et les clics vers tes principaux moyens de contact.',
      'Ton QR Code — Accède directement à ta fiche Dalil Tounes et partage-la facilement.',
      'Tu restes libre de modifier tes informations — Mets à jour horaires, coordonnées, services et autres informations depuis ton espace.',
      'Nous restons disponibles — Contacte-nous par e-mail ou WhatsApp lorsque tu as besoin d’aide concernant ta fiche.',
    ],
    premiumFeatures: [
      'Une présentation plus développée — Nous pouvons mieux détailler ton activité, tes services et ce qui te différencie.',
      'Une visibilité plus large en Tunisie — Ton entreprise peut être présentée à un public plus large selon son activité et les recherches.',
      'Une priorité supérieure dans les résultats — Ta fiche apparaît avant les fiches Artisan et les présences gratuites.',
      'Une présence dans les espaces importants — Page d’accueil, pages liées à ton métier et certaines sélections Dalil Tounes.',
      'Badge Dalil Tounes Certifié — Les informations recueillies et vérifiées sont clairement signalées.',
      'Jusqu’à 15 photos — Présente plus largement tes produits, ton établissement, ton équipe ou tes réalisations.',
      'Des statistiques plus détaillées — Suis les consultations, clics WhatsApp, appels, visites du site et l’évolution de ta visibilité.',
      'Des mises en avant au fil du temps — Ton entreprise peut apparaître dans des sélections et pages thématiques.',
      'Partage de tes actualités — Présente une promotion, une nouveauté, un événement ou une réalisation récente.',
      'Bouton de réservation ou de demande — Selon ton activité, les visiteurs peuvent demander un rendez-vous, une réservation ou des informations.',
      'Un accompagnement prioritaire — Tes questions et demandes de modification sont traitées plus rapidement.',
      'Des conseils adaptés à ta présence — Nous proposons des améliorations simples pour clarifier ta fiche et faciliter les contacts.',
      'Des avantages sur les autres services — Profite de tarifs préférentiels sur le CV Business et certaines prestations Dalil Tounes.',
    ],
    cvSectionTitle: 'Bien plus qu’une simple présentation',
    cvSectionParagraphs: [
      'Ton CV Business devient une véritable carte de visite numérique que tu peux utiliser au quotidien.',
      'Tu peux l’envoyer à tes clients par WhatsApp, e-mail ou message, le partager sur tes réseaux sociaux ou présenter ton entreprise après un premier contact.',
      'Toutes les informations utiles sont réunies sur une page : ton activité, tes services, ton savoir-faire, tes réalisations, tes coordonnées et tes plateformes professionnelles.',
    ],
    cvIdealTitle: 'Idéal si tu :',
    cvIdealItems: [
      'tu envoies souvent la présentation de ton entreprise à des clients',
      'tu réponds régulièrement à des demandes de devis',
      'tu partages ton activité sur Facebook, WhatsApp ou d’autres réseaux',
      'tu souhaites présenter ton entreprise de manière claire et professionnelle',
    ],
    cvActionsIntro: 'Les visiteurs peuvent directement :',
    cvActions: ['t’appeler', 'te contacter sur WhatsApp', 'consulter ton emplacement sur Google Maps', 'visiter ton site internet', 'découvrir tes réseaux sociaux', 'accéder aux autres moyens de contact disponibles'],
    cvClosing: 'Grâce à son lien personnel et à son QR Code, partage ton CV Business sur tes cartes de visite, tes flyers, ta vitrine ou tes publications. Tu disposes ainsi d’un support professionnel simple à transmettre, facile à consulter et toujours accessible.',
    oneTimeService: 'Prestation ponctuelle',
    cvDistinction: 'Les abonnements concernent ta visibilité, ton suivi et l’accompagnement continu. Le CV Business est une présentation professionnelle complète et structurée, réalisée avec toi.',
    eliteTitle: 'Élite Pro', customSolution: 'Solution sur mesure',
    eliteIntro: 'Chaque entreprise a des besoins différents. Échange avec nous afin de construire une solution adaptée à ton organisation, à tes objectifs et à ton budget.',
    contactUs: 'Nous contacter', contactEmail: 'Par e-mail', contactWhatsApp: 'Sur WhatsApp',
    certifiedDisclaimer: 'Ce badge confirme la fiabilité des informations affichées. Il ne constitue pas une certification de la qualité des produits ou des services proposés.',
    showAllFeatures: 'Voir tous les avantages', hideAllFeatures: 'Réduire les avantages',
    showCvDetails: 'Voir le détail complet de la prestation', hideCvDetails: 'Réduire le détail',
  },
  en: {
    cvIdealTitle: 'Ideal if you:',
    cvIdealItems: ['often send your company presentation to clients', 'regularly respond to quote requests', 'share your activity on Facebook, WhatsApp or other networks', 'want to present your business clearly and professionally'],
    artisanPrice: '30 TND', premiumPrice: '59 TND', perMonth: '/ month', premiumIncludesArtisan: 'Premium includes every benefit of the Artisan plan.',
    artisanIntro: 'A plan for artisans, independents, shops and small businesses that want a clearer profile and better local visibility.', premiumIntro: 'A plan for businesses that want to go further, reach a wider audience and receive more regular support.',
    artisanFeatures: ['We create your profile with you', 'A clear presentation of your activity', 'All your useful information in one place', 'Up to 5 photos', 'Better visibility in your region', 'A higher position than free profiles', 'Artisan badge', 'Simple statistics', 'Your QR Code', 'You can update your information', 'Support by email or WhatsApp'],
    premiumFeatures: ['A more detailed presentation', 'Wider visibility across Tunisia', 'Higher priority than Artisan and free profiles', 'Presence in important Dalil Tounes spaces', 'Dalil Tounes Certified badge', 'Up to 15 photos', 'More detailed statistics', 'Ongoing highlights', 'Share your news', 'Booking or enquiry button', 'Priority support', 'Advice tailored to your presence', 'Preferential rates on other services'],
    cvSectionTitle: 'Much more than a simple presentation', cvSectionParagraphs: ['Your CV Business becomes a digital business card you can use every day.', 'Send it by WhatsApp, email or message, share it on social media or use it after a first contact.', 'Your activity, services, expertise, work, contact details and professional platforms are gathered on one page.'], cvActionsIntro: 'Visitors can directly:', cvActions: ['call you', 'contact you on WhatsApp', 'open your Google Maps location', 'visit your website', 'discover your social networks', 'use your other contact methods'], cvClosing: 'Its personal link and QR Code make it easy to share on business cards, flyers, your storefront or posts.', oneTimeService: 'One-time service', cvDistinction: 'Subscriptions cover visibility and ongoing support. CV Business is a complete, structured professional presentation created with you.', eliteTitle: 'Elite Pro', customSolution: 'Tailored solution', eliteIntro: 'Every business has different needs. Talk to us to build a solution suited to your organisation, goals and budget.', contactUs: 'Contact us', contactEmail: 'By email', contactWhatsApp: 'On WhatsApp', certifiedDisclaimer: 'This badge confirms the reliability of the displayed information. It does not certify the quality of the products or services offered.', showAllFeatures: 'See all benefits', hideAllFeatures: 'Show fewer benefits', showCvDetails: 'See full service details', hideCvDetails: 'Show fewer details',
  },
  ar: {
    showAllFeatures: 'عرض كل المزايا', hideAllFeatures: 'تقليص المزايا', showCvDetails: 'عرض تفاصيل الخدمة كاملة', hideCvDetails: 'تقليص التفاصيل',
    cvIdealTitle: 'مثالي لك إذا كنت:',
    cvIdealItems: ['ترسل عرض مؤسستك إلى العملاء باستمرار', 'ترد بانتظام على طلبات عروض الأسعار', 'تشارك نشاطك على فيسبوك أو واتساب أو شبكات أخرى', 'ترغب في تقديم مؤسستك بشكل واضح ومهني'],
    artisanPrice: '30 د.ت', premiumPrice: '59 د.ت', perMonth: '/ شهر', premiumIncludesArtisan: 'تشمل باقة بريميوم جميع مزايا اشتراك حرفي.', artisanIntro: 'صيغة للحرفيين والمستقلين والتجار والمؤسسات الصغيرة الراغبة في عرض أوضح وظهور أفضل في منطقتها.', premiumIntro: 'صيغة للمؤسسات التي تريد الوصول إلى جمهور أوسع والاستفادة من مرافقة أكثر انتظامًا.', artisanFeatures: ['ننشىء بطاقتك معك', 'تقديم واضح لنشاطك', 'كل معلوماتك المفيدة في مكان واحد', 'حتى 5 صور', 'ظهور أفضل في منطقتك', 'ترتيب أفضل من البطاقات المجانية', 'شارة حرفي', 'إحصائيات بسيطة', 'رمز QR الخاص بك', 'يمكنك تحديث معلوماتك', 'مساعدة عبر البريد أو واتساب'], premiumFeatures: ['تقديم أكثر تفصيلًا', 'ظهور أوسع في تونس', 'أولوية أعلى في النتائج', 'حضور في المساحات المهمة', 'شارة دليل تونس موثّق', 'حتى 15 صورة', 'إحصائيات أكثر تفصيلًا', 'إبراز مستمر', 'مشاركة أخبارك', 'زر حجز أو طلب', 'مرافقة ذات أولوية', 'نصائح مناسبة لحضورك', 'أسعار تفضيلية للخدمات الأخرى'], cvSectionTitle: 'أكثر بكثير من مجرد تقديم', cvSectionParagraphs: ['تصبح سيرة نشاطك بطاقة رقمية تستخدمها كل يوم.', 'أرسلها عبر واتساب أو البريد أو شاركها على شبكات التواصل.', 'يجتمع نشاطك وخدماتك وخبرتك وإنجازاتك وبيانات اتصالك في صفحة واحدة.'], cvActionsIntro: 'يمكن للزوار مباشرة:', cvActions: ['الاتصال بك', 'مراسلتك على واتساب', 'فتح موقعك على خرائط Google', 'زيارة موقعك', 'اكتشاف شبكاتك الاجتماعية', 'استخدام وسائل الاتصال الأخرى'], cvClosing: 'يسهّل الرابط الشخصي ورمز QR مشاركتها على بطاقات الزيارة والمنشورات والواجهة.', oneTimeService: 'خدمة لمرة واحدة', cvDistinction: 'الاشتراكات تخص الظهور والمتابعة المستمرة، أما CV Business فهو تقديم مهني كامل ومنظم ننشئه معك.', eliteTitle: 'إيليت برو', customSolution: 'حل حسب الطلب', eliteIntro: 'لكل مؤسسة احتياجات مختلفة. تواصل معنا لبناء حل يناسب تنظيمك وأهدافك وميزانيتك.', contactUs: 'تواصل معنا', contactEmail: 'بالبريد الإلكتروني', contactWhatsApp: 'عبر واتساب', certifiedDisclaimer: 'تؤكد هذه الشارة موثوقية المعلومات المعروضة، ولا تعد شهادة على جودة المنتجات أو الخدمات.',
  },
  it: {
    showAllFeatures: 'Vedi tutti i vantaggi', hideAllFeatures: 'Riduci i vantaggi', showCvDetails: 'Vedi tutti i dettagli della prestazione', hideCvDetails: 'Riduci i dettagli',
    cvIdealTitle: 'Ideale se:',
    cvIdealItems: ['invii spesso la presentazione della tua azienda ai clienti', 'rispondi regolarmente alle richieste di preventivo', 'condividi la tua attività su Facebook, WhatsApp o altri social', 'desideri presentare la tua azienda in modo chiaro e professionale'],
    artisanPrice: '30 TND', premiumPrice: '59 TND', perMonth: '/ mese', premiumIncludesArtisan: 'Premium include tutti i vantaggi dell’abbonamento Artisan.', artisanIntro: 'Una formula per artigiani, indipendenti, commercianti e piccole imprese che desiderano una presentazione migliore e più visibilità locale.', premiumIntro: 'Una formula per le aziende che vogliono raggiungere un pubblico più ampio e ricevere un supporto più regolare.', artisanFeatures: ['Creiamo la tua scheda con te', 'Una presentazione chiara', 'Tutte le informazioni utili insieme', 'Fino a 5 foto', 'Più visibilità nella tua regione', 'Posizione migliore delle schede gratuite', 'Badge Artisan', 'Statistiche semplici', 'Il tuo QR Code', 'Puoi aggiornare le informazioni', 'Supporto via e-mail o WhatsApp'], premiumFeatures: ['Presentazione più sviluppata', 'Visibilità più ampia in Tunisia', 'Priorità superiore nei risultati', 'Presenza negli spazi importanti', 'Badge Dalil Tounes Certificato', 'Fino a 15 foto', 'Statistiche dettagliate', 'Visibilità nel tempo', 'Condivisione delle novità', 'Pulsante prenotazione o richiesta', 'Supporto prioritario', 'Consigli adatti alla tua presenza', 'Tariffe preferenziali sugli altri servizi'], cvSectionTitle: 'Molto più di una semplice presentazione', cvSectionParagraphs: ['Il tuo CV Business diventa un vero biglietto da visita digitale.', 'Invialo via WhatsApp, e-mail o messaggio e condividilo sui social.', 'Attività, servizi, competenze, lavori e contatti sono riuniti in una pagina.'], cvActionsIntro: 'I visitatori possono:', cvActions: ['chiamarti', 'contattarti su WhatsApp', 'aprire la posizione su Google Maps', 'visitare il sito', 'scoprire i social', 'usare gli altri contatti'], cvClosing: 'Il link personale e il QR Code facilitano la condivisione su biglietti, volantini, vetrina e pubblicazioni.', oneTimeService: 'Prestazione una tantum', cvDistinction: 'Gli abbonamenti riguardano visibilità e assistenza continua. CV Business è una presentazione professionale completa creata con te.', eliteTitle: 'Elite Pro', customSolution: 'Soluzione su misura', eliteIntro: 'Ogni azienda ha esigenze diverse. Parla con noi per costruire una soluzione adatta alla tua organizzazione, ai tuoi obiettivi e al tuo budget.', contactUs: 'Contattaci', contactEmail: 'Via e-mail', contactWhatsApp: 'Su WhatsApp', certifiedDisclaimer: 'Il badge conferma l’affidabilità delle informazioni mostrate, non certifica la qualità dei prodotti o servizi.',
  },
  ru: {
    showAllFeatures: 'Показать все преимущества', hideAllFeatures: 'Свернуть преимущества', showCvDetails: 'Показать все детали услуги', hideCvDetails: 'Свернуть детали',
    cvIdealTitle: 'Подходит вам, если вы:',
    cvIdealItems: ['часто отправляете клиентам презентацию своей компании', 'регулярно отвечаете на запросы коммерческих предложений', 'рассказываете о своей деятельности в Facebook, WhatsApp или других сетях', 'хотите представить свою компанию понятно и профессионально'],
    artisanPrice: '30 TND', premiumPrice: '59 TND', perMonth: '/ месяц', premiumIncludesArtisan: 'Premium включает все преимущества тарифа Artisan.', artisanIntro: 'Тариф для мастеров, независимых специалистов, магазинов и малого бизнеса, которым нужны понятная презентация и локальная видимость.', premiumIntro: 'Тариф для компаний, которые хотят расширить аудиторию и получать регулярное сопровождение.', artisanFeatures: ['Создаём профиль вместе с вами', 'Понятная презентация деятельности', 'Вся полезная информация в одном месте', 'До 5 фотографий', 'Больше видимости в вашем регионе', 'Позиция выше бесплатных профилей', 'Значок Artisan', 'Простая статистика', 'Ваш QR-код', 'Самостоятельное обновление данных', 'Помощь по e-mail или WhatsApp'], premiumFeatures: ['Более подробная презентация', 'Видимость по всему Тунису', 'Повышенный приоритет в результатах', 'Размещение в важных разделах', 'Значок «Проверено Dalil Tounes»', 'До 15 фотографий', 'Подробная статистика', 'Регулярное продвижение', 'Публикация новостей', 'Кнопка бронирования или запроса', 'Приоритетная поддержка', 'Персональные рекомендации', 'Льготные цены на другие услуги'], cvSectionTitle: 'Гораздо больше, чем презентация', cvSectionParagraphs: ['CV Business становится цифровой визитной карточкой на каждый день.', 'Отправляйте её через WhatsApp, e-mail или сообщения и делитесь в соцсетях.', 'Деятельность, услуги, опыт, работы и контакты собраны на одной странице.'], cvActionsIntro: 'Посетители могут:', cvActions: ['позвонить вам', 'написать в WhatsApp', 'открыть адрес в Google Maps', 'посетить сайт', 'открыть социальные сети', 'использовать другие контакты'], cvClosing: 'Персональная ссылка и QR-код позволяют делиться профилем на визитках, флаерах, витрине и в публикациях.', oneTimeService: 'Разовая услуга', cvDistinction: 'Подписки обеспечивают видимость и постоянное сопровождение. CV Business — полная профессиональная презентация, созданная вместе с вами.', eliteTitle: 'Elite Pro', customSolution: 'Индивидуальное решение', eliteIntro: 'У каждой компании свои потребности. Свяжитесь с нами, чтобы создать решение под вашу организацию, цели и бюджет.', contactUs: 'Связаться с нами', contactEmail: 'По e-mail', contactWhatsApp: 'В WhatsApp', certifiedDisclaimer: 'Значок подтверждает достоверность показанной информации, но не качество товаров или услуг.',
  },
};

function FeatureList({
  items,
  columns = false,
  variant = 'light',
}: {
  items: string[];
  columns?: boolean;
  variant?: 'light' | 'dark';
}) {
  const isDark = variant === 'dark';

  return (
    <ul className={columns ? 'grid gap-x-6 gap-y-2 sm:grid-cols-2' : 'space-y-2'}>
      {items.map((item) => (
        <li key={item} className={`flex items-start gap-2 text-sm font-medium leading-5 ${isDark ? 'text-emerald-50' : 'text-slate-700'}`}>
          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isDark ? 'bg-white/15 text-[#F4CE55]' : 'bg-emerald-50 text-emerald-700'}`}>
            <Check className="h-3 w-3" aria-hidden="true" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function splitFeature(feature: string) {
  const separatorIndex = feature.indexOf(' — ');
  if (separatorIndex === -1) return { title: feature, description: '' };

  return {
    title: feature.slice(0, separatorIndex),
    description: feature.slice(separatorIndex + 3),
  };
}

function FeatureAccordion({
  items,
  variant = 'dark',
  columns = false,
}: {
  items: string[];
  variant?: 'dark' | 'light';
  columns?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const accordionId = useId().replace(/:/g, '');
  const isDark = variant === 'dark';

  return (
    <div className={columns ? 'grid items-start gap-x-6 sm:grid-cols-2' : ''}>
      {items.map((feature, index) => {
        const { title, description } = splitFeature(feature);
        const isOpen = openIndex === index;
        const panelId = `${accordionId}-panel-${index}`;
        const buttonId = `${accordionId}-button-${index}`;

        return (
          <div
            key={feature}
            className={isDark ? 'border-b border-white/15 last:border-b-0' : 'border-b border-amber-100 last:border-b-0'}
          >
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className={`flex min-h-12 w-full items-center gap-3 py-3 text-start text-sm font-semibold leading-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AF2E] focus-visible:ring-inset ${
                isDark ? `text-emerald-50 hover:text-white ${isOpen ? 'text-white' : ''}` : 'text-slate-700 hover:text-[#4A123F]'
              }`}
            >
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isDark ? 'bg-white/10 text-[#F0C537]' : 'bg-emerald-50 text-emerald-700'}`}>
                <Check className="h-3 w-3" aria-hidden="true" />
              </span>
              <span className="flex-1">{title}</span>
              <ChevronRight
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                aria-hidden="true"
              />
              <span className="sr-only">{isOpen ? '−' : '+'}</span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                {description && (
                  <p className={`pb-4 ps-8 pe-2 text-sm leading-6 ${isDark ? 'text-emerald-100/90' : 'text-slate-600'}`}>
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
  closeLabel,
  size = 'compact',
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  closeLabel: string;
  size?: ModalSize;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute('hidden'));

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative max-h-[90dvh] overflow-y-auto rounded-3xl bg-white shadow-2xl ${MODAL_SIZE_CLASS_NAME[size]}`}
      >
        <div className="sticky top-0 z-20 flex justify-end bg-gradient-to-b from-white via-white/95 to-transparent px-3 pb-1 pt-3 sm:px-4">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#D6AF2E] hover:text-[#4A123F] focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
            aria-label={closeLabel}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">{children}</div>
      </div>
    </div>
  );
}

function DemoLogo({ alt, src = LOGO_PATH }: { alt: string; src?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-20 w-20 rounded-full border-4 border-[#D6AF2E] bg-white object-cover shadow-lg"
    />
  );
}

function EssentialCardPreview({ copy }: { copy: SubscriptionCopy }) {
  return (
    <div className="mx-auto max-w-lg rounded-[26px] border-[3px] border-[#D6AF2E] bg-white p-5 text-slate-800 shadow-xl sm:p-7">
      <div className="mb-5 flex justify-center">
        <DemoLogo alt={copy.demoName} />
      </div>
      <h3 className="text-xl font-bold sm:text-2xl">{copy.demoName}</h3>
      <p className="mt-1 font-semibold text-[#C89E19]">{copy.demoCategory}</p>
      <p className="mt-3 flex items-center gap-2 text-slate-600">
        <MapPin className="h-5 w-5" aria-hidden="true" /> {copy.tunisia}
      </p>
      <p className="mt-4 flex items-center gap-2 font-semibold text-emerald-700">
        <Clock3 className="h-5 w-5" aria-hidden="true" /> {copy.open}
      </p>
      <p className="mt-1 text-slate-600">{copy.todaySchedule}</p>
      <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#D6AF2E] px-5 py-3 font-bold text-[#173429]">
        <Phone className="h-5 w-5" aria-hidden="true" /> {copy.contactDalil}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{copy.essentialPreviewText}</p>
    </div>
  );
}

function SharingBrandIcon({ brand }: { brand: 'whatsapp' | 'telegram' | 'sms' | 'messenger' }) {
  if (brand === 'telegram') {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="currentColor" d="M20.7 3.4 3.6 10c-1.2.5-1.2 1.1-.2 1.4l4.4 1.4 1.7 5.2c.2.6.1.8.7.8.5 0 .7-.2 1-.5l2.1-2 4.4 3.2c.8.5 1.4.2 1.6-.8l2.9-13.8c.3-1.2-.5-1.8-1.5-1.5ZM9.5 12.5l8.6-5.4c.4-.2.8-.1.5.2l-7.1 6.4-.3 3.2-1.7-4.4Z" /></svg>;
  }
  if (brand === 'messenger') {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="currentColor" d="M12 2C6.4 2 2 6.1 2 11.5c0 3.1 1.5 5.8 3.9 7.5v3l2.8-1.5c1 .3 2.1.5 3.3.5 5.6 0 10-4.1 10-9.5S17.6 2 12 2Zm1 12.8-2.5-2.7-4.9 2.7 5.4-5.7 2.5 2.7 4.9-2.7-5.4 5.7Z" /></svg>;
  }
  if (brand === 'sms') {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="currentColor" d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5.7 3.4A.85.85 0 0 1 2 20.7V5a2 2 0 0 1 2-2Zm3 8.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm5 0A1.25 1.25 0 1 0 12 9a1.25 1.25 0 0 0 0 2.5Zm5 0A1.25 1.25 0 1 0 17 9a1.25 1.25 0 0 0 0 2.5Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.5 15.3L2.2 22l4.8-1.3A10 10 0 1 0 12 2Zm5.6 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.2.2-3.8-.9-3.2-1.4-5.3-4.7-5.5-4.9-.1-.2-1.3-1.8-1.3-3.4 0-1.6.8-2.4 1.1-2.8.3-.3.7-.4 1-.4h.7c.2 0 .5-.1.7.6l.9 2.2c.1.2.1.5 0 .7l-.4.6-.6.6c-.2.2-.4.4-.2.8.2.3.8 1.3 1.8 2.1 1.2 1.1 2.3 1.5 2.6 1.7.3.2.5.2.7-.1l1.1-1.3c.2-.3.5-.3.8-.2l2.1 1c.3.2.6.2.7.4.1.2.1.8-.1 1.5Z" /></svg>;
}

function SubscriptionBusinessCardPreview({ variant, copy, language }: { variant: 'artisan' | 'premium'; copy: SubscriptionCopy; language: OfferLanguage }) {
  const labels = businessPreviewCopy[language] ?? businessPreviewCopy.fr;
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const isPremium = variant === 'premium';
  const actionIcons = [Phone, MessageCircle, Navigation, CalendarDays, Globe2, Share2];
  const sectionIcons = [UserRound, Wrench, Clock3, Star, ImageIcon];
  const socialNetworks = [
    { label: 'Instagram', icon: Instagram, className: 'bg-gradient-to-br from-fuchsia-600 via-rose-500 to-amber-400' },
    { label: 'Facebook', icon: Facebook, className: 'bg-[#1877F2]' },
    { label: 'LinkedIn', icon: Linkedin, className: 'bg-[#0A66C2]' },
    { label: 'YouTube', icon: Youtube, className: 'bg-[#FF0000]' },
    { label: 'TikTok', icon: Music2, className: 'bg-black shadow-[inset_1px_0_0_#25F4EE,inset_-1px_0_0_#FE2C55]' },
  ];
  const sharingNetworks = [
    { brand: 'whatsapp' as const, label: labels.sharing[0], className: 'bg-[#25D366]' },
    { brand: 'telegram' as const, label: labels.sharing[1], className: 'bg-[#229ED9]' },
    { brand: 'sms' as const, label: labels.sharing[2], className: 'bg-[#3976D8]' },
    { brand: 'messenger' as const, label: labels.sharing[3], className: 'bg-gradient-to-br from-[#00B2FF] via-[#696BFF] to-[#D329C6]' },
  ];
  const sectionOrder = isPremium ? [2, 3, 1] : [0, 1, 2, 3, 4];
  const activate = (label: string) => setFeedback(`${labels.demoFeedback} ${label}`);

  return (
    <article className={`mx-auto w-full overflow-hidden text-white ${isPremium ? 'max-w-[400px] rounded-[24px] border-2 border-[#D6AF2E] bg-[radial-gradient(circle_at_50%_12%,#09543F_0%,#04392E_45%,#022A22_100%)] p-1.5 shadow-[0_18px_38px_rgba(3,44,36,0.34),inset_0_0_22px_rgba(240,197,55,0.08)]' : 'max-w-[410px] rounded-[25px] border border-[#D6AF2E] bg-gradient-to-b from-[#07543F] to-[#04392E] shadow-[0_14px_30px_rgba(7,84,63,0.24)]'}`}>
      <div className={`relative overflow-hidden ${isPremium ? 'h-[88px] rounded-t-[19px] border border-[#D6AF2E]/40' : 'h-20'}`}>
        <img src={PREMIUM_PREVIEW_IMAGE_PATH} alt={`${copy.demoName} — ${labels.category}`} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#064333] via-[#064333]/15 to-transparent" />
      </div>

      <div className={`${isPremium ? '-mt-5 rounded-[20px] border border-[#D6AF2E]/55 bg-[#04372D]/95 px-3 pb-3 pt-0 shadow-[0_0_10px_rgba(214,175,46,0.09),inset_0_0_10px_rgba(214,175,46,0.04)]' : 'px-3.5 pb-3'} relative`}>
        {isPremium ? (
          <div className="text-center">
            <div className="mx-auto -translate-y-6 scale-[0.78]"><DemoLogo alt={copy.demoName} /></div>
            <span className="-mt-7 inline-flex rounded-full border border-[#D6AF2E]/80 bg-[#063C30] px-3.5 py-0.5 text-[11px] font-black text-[#F4CE55]">⚒ {labels.category}</span>
            <div className="mx-auto mt-2 max-w-[310px] rounded-xl border border-[#D6AF2E]/65 bg-black/10 px-3 py-2 shadow-[0_0_8px_rgba(214,175,46,0.08),inset_0_0_8px_rgba(214,175,46,0.04)]">
              <h3 className="text-[18px] font-black leading-tight text-white sm:text-[20px]">{copy.demoName}</h3>
              <span className="mt-1.5 inline-flex items-center justify-center rounded-full border border-[#D6AF2E]/70 bg-emerald-700/65 px-3 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">★ {labels.certified}</span>
              <p className="mt-1.5 text-xs font-semibold text-[#F4CE55]">{copy.demoCategory}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-emerald-50"><MapPin className="h-3.5 w-3.5 text-[#F4CE55]" aria-hidden="true" />{labels.city}</p>
              <p className="mt-1 text-xs font-bold text-emerald-300">WhatsApp</p>
            </div>
          </div>
        ) : (
          <div className="-mt-7 flex items-start gap-2.5">
            <div className="shrink-0 scale-90"><DemoLogo alt={copy.demoName} /></div>
            <div className="min-w-0 flex-1 pt-7">
              <h3 className="truncate text-[20px] font-black leading-tight text-white sm:text-[22px]">{copy.demoName}</h3>
              <span className="mt-2 inline-flex rounded-full bg-emerald-600/70 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white">★ {labels.artisanBadge}</span>
              <p className="mt-1 text-sm font-semibold text-[#F4CE55]">{copy.demoCategory}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-emerald-50"><span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4 text-emerald-300" aria-hidden="true" />{labels.city}</span><button type="button" onClick={() => activate(labels.actions[2])} className="rounded-full border border-[#D6AF2E]/70 px-2 py-0.5 font-bold text-[#F4CE55] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">GPS</button></div>
              <p className="mt-1 text-sm font-bold text-emerald-300">WhatsApp</p>
            </div>
          </div>
        )}

        <div className={`${isPremium ? 'mt-2' : 'mt-3'} grid grid-cols-3 gap-1.5`}>
          {labels.actions.map((label, index) => {
            const Icon = actionIcons[index];
            return <button key={label} type="button" onClick={() => activate(label)} className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1 text-[10px] font-bold transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${isPremium ? 'min-h-[48px] border border-[#D6AF2E]/55 bg-[#03352B] text-white shadow-[inset_0_1px_4px_rgba(244,206,85,0.07)] hover:bg-[#D6AF2E]/8' : 'min-h-[54px] border border-white/15 bg-white/5 text-emerald-50 hover:bg-white/12'}`}><Icon className={`${isPremium ? 'h-4 w-4' : 'h-[18px] w-[18px]'} ${index === 1 ? 'text-emerald-300' : 'text-[#F4CE55]'}`} aria-hidden="true" /><span>{isPremium && index === 2 ? 'GPS' : label}</span></button>;
          })}
        </div>

        <div className={`mt-2.5 overflow-hidden rounded-xl ${isPremium ? 'border border-[#D6AF2E]/65 shadow-[inset_0_0_9px_rgba(214,175,46,0.05)]' : 'border border-white/15'}`}>
          {sectionOrder.map((index) => {
            const label = labels.sections[index];
            const Icon = sectionIcons[index];
            const expanded = openSection === index;
            return <div key={label} className="border-b border-white/10 last:border-b-0">{isPremium && index === 3 && <button type="button" onClick={() => activate(labels.qr)} className="flex min-h-10 w-full items-center gap-2 border-b border-white/10 px-2.5 py-1.5 text-start text-[11px] font-bold transition hover:bg-white/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D6AF2E]"><QrCode className="h-4 w-4 text-white" aria-hidden="true" />{labels.qr}<ChevronRight className="ms-auto h-3.5 w-3.5 text-[#F4CE55] rtl:rotate-180" aria-hidden="true" /></button>}<button type="button" aria-expanded={expanded} onClick={() => setOpenSection(expanded ? null : index)} className="flex min-h-[42px] w-full items-center gap-2 px-2.5 py-1.5 text-start transition hover:bg-white/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D6AF2E]"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isPremium ? 'bg-[#D6AF2E]/10 text-[#F4CE55]' : 'bg-white/8 text-emerald-200'}`}><Icon className="h-3.5 w-3.5" aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-bold">{label}</span>{!isPremium && <span className="block truncate text-[10px] text-emerald-100/70">{labels.sectionHints[index]}</span>}</span><ChevronRight className={`h-3.5 w-3.5 shrink-0 text-[#F4CE55] transition ${expanded ? 'rotate-90 rtl:-rotate-90' : 'rtl:rotate-180'}`} aria-hidden="true" /></button>{expanded && <div className="bg-black/10 px-3 pb-2 text-[11px] leading-4 text-emerald-50">{labels.sectionHints[index]}</div>}</div>;
          })}
        </div>

        {!isPremium && <section className="mt-2.5 rounded-xl border border-white/15 bg-white/5 p-2.5 text-center" aria-label={labels.social}>
          <h4 className="text-sm font-bold text-[#F4CE55]">{labels.social}</h4>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {socialNetworks.map(({ label, icon: Icon, className }) => <button key={label} type="button" onClick={() => activate(label)} aria-label={label} className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AF2E] ${className}`}><Icon className="h-4 w-4" aria-hidden="true" /></button>)}
          </div>
        </section>}

        {!isPremium && <>
          <button type="button" onClick={() => activate(labels.email)} aria-label={labels.email} className="mx-auto mt-1.5 flex h-9 items-center justify-center gap-2 rounded-lg border border-sky-200/60 bg-gradient-to-r from-[#1264A3] to-[#208BD0] pe-3 ps-1.5 text-[11px] font-bold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <span className="flex h-6 w-7 items-center justify-center rounded bg-white/95 text-[#1264A3] shadow-sm"><Mail className="h-4 w-4 stroke-[2.4]" aria-hidden="true" /></span>{labels.email}
          </button>
          <section className="mt-1.5 rounded-xl border border-[#D6AF2E]/45 bg-black/10 px-2.5 py-2 text-center" aria-label={labels.recommend}>
            <h4 className="text-[11px] font-bold text-[#F4CE55]">{labels.recommend}</h4>
            <div className="mt-1.5 flex justify-center gap-2.5">
              {sharingNetworks.map(({ brand, label, className }) => <button key={brand} type="button" onClick={() => activate(label)} aria-label={label} title={label} className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white shadow-sm transition hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}><SharingBrandIcon brand={brand} /></button>)}
            </div>
          </section>
        </>}
        {isPremium && <>
          <section className="mt-2 rounded-xl border border-[#D6AF2E]/45 bg-[#032F27]/90 px-2.5 py-2 text-center shadow-[inset_0_0_7px_rgba(214,175,46,0.03)]" aria-label={labels.social}>
            <h4 className="text-[11px] font-bold tracking-wide text-[#E7C75A]">{labels.social}</h4>
            <div className="mt-1.5 flex justify-center gap-2.5">
              {socialNetworks.map(({ label, icon: Icon, className }) => <button key={label} type="button" onClick={() => activate(label)} aria-label={label} title={label} className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-white opacity-90 transition hover:scale-105 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}><Icon className="h-3.5 w-3.5" aria-hidden="true" /></button>)}
            </div>
          </section>
          <div className="mt-2 flex justify-center gap-6 border-t border-[#D6AF2E]/30 pt-2">{[Phone, MessageCircle, Navigation].map((Icon, index) => <button key={index} type="button" onClick={() => activate(labels.actions[index])} aria-label={labels.actions[index]} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6AF2E]/60 bg-black/10 text-[#F4CE55] shadow-[inset_0_1px_4px_rgba(214,175,46,0.06)] transition hover:bg-[#D6AF2E]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"><Icon className="h-4 w-4" aria-hidden="true" /></button>)}</div>
        </>}
        <p className="mt-1 min-h-4 text-center text-[10px] text-emerald-100" aria-live="polite">{feedback}</p>
      </div>
    </article>
  );
}

function ContinuousPlanCard({
  tier,
  copy,
  price,
  perMonth,
  paymentCopy,
  annualPrice,
  includesLabel,
  certifiedDisclaimer,
  intro,
  features,
  descriptionLead,
  showAllLabel,
  hideAllLabel,
  onPreview,
  onRequest,
}: {
  tier: 'ARTISAN' | 'PREMIUM';
  copy: SubscriptionCopy;
  price: string;
  perMonth: string;
  paymentCopy: (typeof paymentChoiceCopy)[OfferLanguage];
  annualPrice: string;
  includesLabel?: string;
  certifiedDisclaimer?: string;
  intro: string;
  features: string[];
  descriptionLead: string;
  showAllLabel: string;
  hideAllLabel: string;
  onPreview: () => void;
  onRequest: (billingPeriod: BillingPeriod) => void;
}) {
  const tierLabel = tier === 'ARTISAN' ? copy.artisan : copy.premium;
  const requestLabel = tier === 'ARTISAN' ? copy.requestArtisan : copy.requestPremium;
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const featuredIndexes = tier === 'ARTISAN' ? [0, 4, 3, 7, 9] : [1, 2, 4, 6];
  const featuredItems = featuredIndexes.map((index) => splitFeature(features[index]).title);
  const detailsId = useId().replace(/:/g, '');

  return (
    <article className="relative flex flex-col self-start overflow-hidden rounded-3xl border-2 border-[#D6AF2E] bg-[#07543F] p-5 text-white shadow-[0_12px_30px_rgba(7,84,63,0.16)] sm:p-6">
      <span className="absolute right-0 top-0 rounded-bl-2xl bg-[#D6AF2E] px-4 py-2 text-[11px] font-black tracking-[0.16em] text-[#07543F]">
        {tierLabel}
      </span>
      <h3 className="mt-8 text-2xl font-bold">{tierLabel}</h3>
      <div className="mt-2 flex items-end gap-2 text-[#F4CE55]">
        <span className="text-4xl font-black">{price}</span><span className="pb-1 text-sm font-bold">{perMonth}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-emerald-50">{intro}</p>
      {includesLabel && <p className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white">{includesLabel}</p>}
      <div className="mt-4">
        <FeatureList items={featuredItems} variant="dark" />
        <button
          type="button"
          aria-expanded={showAllFeatures}
          aria-controls={`${detailsId}-details`}
          onClick={() => setShowAllFeatures((current) => !current)}
          className="mt-3 rounded-lg px-1 py-2 text-sm font-bold text-[#F4CE55] underline decoration-[#F4CE55]/80 underline-offset-4 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AF2E]"
        >
          {showAllFeatures ? hideAllLabel : showAllLabel}
        </button>
        <div
          id={`${detailsId}-details`}
          hidden={!showAllFeatures}
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${showAllFeatures ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        >
          <div className="overflow-hidden">
            <FeatureAccordion items={ensureFeatureDescriptions(features, descriptionLead)} />
          </div>
        </div>
      </div>
      {certifiedDisclaimer && (
        <p className="mt-3 rounded-xl border border-[#D6AF2E]/40 bg-black/10 p-2.5 text-xs leading-5 text-emerald-50">
          {certifiedDisclaimer}
        </p>
      )}
      <fieldset className="mt-5 rounded-2xl border border-[#D6AF2E]/50 bg-white/10 p-3">
        <legend className="px-1 text-sm font-bold text-white">{paymentCopy.title}</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className="relative flex min-h-16 cursor-pointer items-center rounded-xl border border-white/30 bg-[#064634] px-3 py-2.5 transition has-[:checked]:border-[#F4CE55] has-[:checked]:bg-white has-[:checked]:text-[#07543F] focus-within:ring-2 focus-within:ring-[#F4CE55] focus-within:ring-offset-2 focus-within:ring-offset-[#07543F]">
            <input
              type="radio"
              name={`${detailsId}-billing-period`}
              value="monthly"
              checked={billingPeriod === 'monthly'}
              onChange={() => setBillingPeriod('monthly')}
              className="sr-only"
            />
            <span>
              <span className="block text-sm font-black">{paymentCopy.monthly}</span>
              <span className="mt-0.5 block text-xs font-semibold">{price} {perMonth}</span>
            </span>
          </label>
          <label className="relative flex min-h-16 cursor-pointer items-center rounded-xl border border-white/30 bg-[#064634] px-3 py-2.5 pe-24 transition has-[:checked]:border-[#F4CE55] has-[:checked]:bg-white has-[:checked]:text-[#07543F] focus-within:ring-2 focus-within:ring-[#F4CE55] focus-within:ring-offset-2 focus-within:ring-offset-[#07543F] sm:pe-3 sm:pt-7">
            <input
              type="radio"
              name={`${detailsId}-billing-period`}
              value="annual"
              checked={billingPeriod === 'annual'}
              onChange={() => setBillingPeriod('annual')}
              className="sr-only"
            />
            <span>
              <span className="block text-sm font-black">{paymentCopy.annual}</span>
              <span className="mt-0.5 block text-xs font-semibold">{annualPrice}</span>
            </span>
            <span className="absolute end-2 top-2 rounded-full bg-[#D6AF2E] px-2 py-1 text-[10px] font-black text-[#07543F]">
              {paymentCopy.threeMonthsFree}
            </span>
          </label>
        </div>
      </fieldset>
      <div className="grid gap-2 pt-6 sm:grid-cols-2">
        <button
          type="button"
          onClick={onPreview}
          className="rounded-xl border border-[#D6AF2E] bg-transparent px-4 py-3 text-sm font-bold text-[#F0C537] transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
        >
          {copy.previewCard}
        </button>
        <button
          type="button"
          onClick={() => onRequest(billingPeriod)}
          className="rounded-xl bg-[#D6AF2E] px-4 py-3 text-sm font-bold text-[#07543F] transition hover:bg-[#E5C64D] focus:outline-none focus:ring-2 focus:ring-white"
        >
          {requestLabel}
        </button>
      </div>
    </article>
  );
}

export const Subscription = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const copy = subscriptionCopy[language as keyof typeof subscriptionCopy] ?? subscriptionCopy.fr;
  const essentialCopy = essentialCvCopy[language as OfferLanguage] ?? essentialCvCopy.fr;
  const paymentCopy = paymentChoiceCopy[language as OfferLanguage] ?? paymentChoiceCopy.fr;
  const [activePreview, setActivePreview] = useState<PreviewType>(null);
  const [showCvDetails, setShowCvDetails] = useState(false);
  const cvDetailsId = useId().replace(/:/g, '');
  const [selectedPlan, setSelectedPlan] = useState<{
    code: SubscriptionPlanCode;
    label: string;
    checkoutOffer: CheckoutOffer;
    billingPeriod?: BillingPeriod;
  } | null>(null);

  const closePreview = () => setActivePreview(null);
  const openRequest = (code: SubscriptionPlanCode, label: string, checkoutOffer: CheckoutOffer, billingPeriod?: BillingPeriod) => {
    setSelectedPlan({ code, label, checkoutOffer, billingPeriod });
    setActivePreview('request');
  };

  return (
    <div className="bg-[#FFFCF7] px-4 py-8 text-slate-900 sm:py-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <main className="mx-auto max-w-6xl">
        <header className="mb-8 text-center sm:mb-10">
          <p className="mb-3 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-amber-600">
            <span className="h-px w-8 bg-amber-400" /> {copy.heroEyebrow} <span className="h-px w-8 bg-amber-400" />
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#4A123F] sm:text-4xl lg:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">{copy.heroSubtitle}</p>
        </header>

        <section aria-label={copy.startingSolutions} className="mx-auto max-w-2xl">
          <article className="flex flex-col rounded-3xl border border-[#D6AF2E] bg-white p-5 shadow-[0_12px_30px_rgba(74,18,63,0.07)] sm:p-7">
            <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-800">
              {copy.selfService}
            </span>
            <div className="my-5 flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[#4A123F]/35 text-center text-[10px] font-bold uppercase text-[#4A123F]">
              {copy.yourLogo.split('\n').map((line) => <span key={line}>{line}<br /></span>)}
            </div>
            <h2 className="text-2xl font-bold text-[#4A123F]">{copy.essentialTitle}</h2>
            <div className="mt-3 flex items-end gap-2 text-[#07543F]">
              <span className="text-4xl font-black">0</span><span className="pb-1 font-bold">TND</span>
            </div>
            <p className="mt-1 text-sm font-bold text-[#4A123F]">{copy.essentialFree}</p>
            <div className="my-5 h-px bg-amber-100" />
            <FeatureList items={[...copy.essentialFeatures]} />
            <div className="mt-auto grid gap-2 pt-6">
              <a
                href="/inscription-entreprise"
                className="rounded-xl border-2 border-[#4A123F]/20 bg-white px-4 py-3 text-center text-sm font-bold text-[#4A123F] transition hover:border-[#D6AF2E] hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
              >
                {copy.addActivity}
              </a>
              <button
                type="button"
                onClick={() => setActivePreview('free')}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 underline decoration-[#D6AF2E] underline-offset-4 transition hover:text-[#4A123F] focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
              >
                {copy.previewCard}
              </button>
            </div>
          </article>

        </section>

        <section aria-labelledby="continuous-services-title" className="mt-9 sm:mt-11">
          <div className="mb-5 flex items-center justify-center gap-3 text-center">
            <span className="h-px w-8 bg-amber-400" />
            <h2 id="continuous-services-title" className="text-sm font-black uppercase tracking-[0.18em] text-amber-600">
              {copy.continuousServices}
            </h2>
            <span className="h-px w-8 bg-amber-400" />
          </div>

          <div className="mb-5 rounded-2xl border border-[#D6AF2E]/55 bg-gradient-to-r from-amber-50 via-white to-emerald-50 p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5">
            <div>
              <span className="inline-flex rounded-full bg-[#D6AF2E] px-3 py-1 text-[10px] font-black tracking-[0.14em] text-[#07543F]">
                {copy.launchBadge}
              </span>
              <h3 className="mt-2 text-lg font-bold text-[#4A123F]">{copy.launchTitle}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-700">{copy.launchIntro}</p>
              <p className="text-sm leading-6 text-slate-700">
                {copy.launchAnnualPrefix} <strong>{copy.launchAnnualStrong}</strong>
              </p>
              <p className="text-sm font-semibold leading-6 text-[#07543F]">{copy.launchPayment}</p>
            </div>
            <button
              type="button"
              onClick={() => setActivePreview('launch')}
              className="mt-3 shrink-0 text-sm font-semibold text-[#4A123F] underline decoration-[#D6AF2E] underline-offset-4 hover:text-[#07543F] focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] sm:mt-0"
            >
              {copy.seeConditions}
            </button>
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-2">
            <ContinuousPlanCard
              tier="ARTISAN"
              copy={copy}
              price={offerCopy[language as OfferLanguage]?.artisanPrice ?? offerCopy.fr.artisanPrice}
              perMonth={offerCopy[language as OfferLanguage]?.perMonth ?? offerCopy.fr.perMonth}
              paymentCopy={paymentCopy}
              annualPrice={paymentCopy.artisanAnnualPrice}
              intro={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).artisanIntro}
              features={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).artisanFeatures}
              descriptionLead={accordionDescriptionLeadCopy[language as OfferLanguage] ?? accordionDescriptionLeadCopy.fr}
              showAllLabel={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).showAllFeatures}
              hideAllLabel={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).hideAllFeatures}
              onPreview={() => setActivePreview('artisan')}
              onRequest={(billingPeriod) => openRequest('artisan', copy.artisanPlanLabel, 'artisan', billingPeriod)}
            />
            <ContinuousPlanCard
              tier="PREMIUM"
              copy={copy}
              price={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).premiumPrice}
              perMonth={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).perMonth}
              paymentCopy={paymentCopy}
              annualPrice={paymentCopy.premiumAnnualPrice}
              includesLabel={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).premiumIncludesArtisan}
              certifiedDisclaimer={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).certifiedDisclaimer}
              intro={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).premiumIntro}
              features={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).premiumFeatures}
              descriptionLead={accordionDescriptionLeadCopy[language as OfferLanguage] ?? accordionDescriptionLeadCopy.fr}
              showAllLabel={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).showAllFeatures}
              hideAllLabel={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).hideAllFeatures}
              onPreview={() => setActivePreview('premium')}
              onRequest={(billingPeriod) => openRequest('premium', copy.premiumPlanLabel, 'premium', billingPeriod)}
            />

          </div>

          <p className="mt-4 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-center text-sm font-semibold text-[#07543F]">
            {copy.trialClarification}
          </p>
        </section>

        <section className="mt-9 rounded-3xl border border-[#D6AF2E]/60 bg-white p-5 shadow-[0_10px_28px_rgba(74,18,63,0.06)] sm:mt-11 sm:p-6" aria-labelledby="essential-cv-title">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div>
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-800">
                {essentialCopy.badge}
              </span>
              <h2 id="essential-cv-title" className="mt-3 text-2xl font-bold text-[#4A123F]">{essentialCopy.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{essentialCopy.subtitle}</p>
            </div>
            <div className="flex items-end gap-2 text-[#07543F] lg:justify-end">
              <span className="text-4xl font-black">79</span><span className="pb-1 font-bold">TND</span>
            </div>
          </div>

          <aside className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4" aria-label={essentialCopy.badge}>
            {essentialCopy.humanMessage.map((paragraph) => (
              <p key={paragraph} className="mt-2 first:mt-0 text-sm leading-6 text-slate-700">{paragraph}</p>
            ))}
          </aside>

          <div className="mt-5">
            <FeatureList items={essentialCopy.features} columns />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2" aria-label={copy.paymentOptions}>
            <span className="rounded-lg bg-[#07543F] px-4 py-2 text-sm font-bold text-white">{essentialCopy.payOnce}</span>
            <span className="text-xs text-slate-400">{copy.or}</span>
            <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#4A123F]">{essentialCopy.payThreeTimes}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-600">{essentialCopy.publication}</p>
          <p className="mt-4 border-t border-amber-100 pt-4 text-sm font-bold text-[#07543F]">{essentialCopy.ideal}</p>
          <button
            type="button"
            onClick={() => openRequest('cv_business', essentialCopy.planLabel, 'cv_essential')}
            className="mt-5 w-full rounded-xl bg-[#07543F] px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AF2E] sm:w-auto"
          >
            {essentialCopy.choose}
          </button>
        </section>

        <section className="mt-5 rounded-3xl border-2 border-[#D6AF2E] bg-gradient-to-br from-white via-white to-amber-50/80 p-5 shadow-[0_14px_36px_rgba(214,175,46,0.12)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-800">
                {(offerCopy[language as OfferLanguage] ?? offerCopy.fr).oneTimeService}
              </span>
              <h2 className="mt-4 text-2xl font-bold text-[#4A123F] sm:text-3xl">{copy.cvTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{(offerCopy[language as OfferLanguage] ?? offerCopy.fr).cvDistinction}</p>
            </div>
            <div className="shrink-0 lg:text-end">
              <div className="flex items-end gap-2 text-[#07543F] lg:justify-end">
                <span className="text-4xl font-black">199</span><span className="pb-1 font-bold">TND</span>
              </div>
              <p className="mt-1 text-sm font-bold text-[#4A123F]">{copy.cvPriceNotice}</p>
            </div>
          </div>

          <aside className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5" aria-labelledby="cv-business-ideal-title">
            <h3 id="cv-business-ideal-title" className="font-bold text-[#07543F]">
              {(offerCopy[language as OfferLanguage] ?? offerCopy.fr).cvIdealTitle}
            </h3>
            <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {(offerCopy[language as OfferLanguage] ?? offerCopy.fr).cvIdealItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-5 text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm" aria-hidden="true">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-emerald-200 pt-3 text-sm font-bold leading-6 text-[#07543F]">{essentialCopy.completeIdeal}</p>
          </aside>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-white/80 p-5 sm:p-6">
            <h3 className="text-xl font-bold text-[#4A123F]">{(offerCopy[language as OfferLanguage] ?? offerCopy.fr).cvSectionTitle}</h3>
            {(offerCopy[language as OfferLanguage] ?? offerCopy.fr).cvSectionParagraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-6 text-slate-700">{paragraph}</p>
            ))}
            <p className="mt-4 text-sm font-bold text-[#07543F]">{(offerCopy[language as OfferLanguage] ?? offerCopy.fr).cvActionsIntro}</p>
            <FeatureList items={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).cvActions} columns />
            <p className="mt-4 text-sm leading-6 text-slate-700">{(offerCopy[language as OfferLanguage] ?? offerCopy.fr).cvClosing}</p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2" aria-label={copy.paymentOptions}>
            <span className="rounded-lg bg-[#07543F] px-4 py-2 text-sm font-bold text-white">{copy.payOnce}</span>
            <span className="text-xs text-slate-400">{copy.or}</span>
            <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#4A123F]">{copy.payTwice}</span>
            <span className="text-xs text-slate-400">{copy.or}</span>
            <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#4A123F]">{copy.payThreeTimes}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{copy.cvPublication}</p>
          <div className="my-5 h-px bg-amber-100" />
          <FeatureList
            items={[0, 1, 2, 3, 7, 9].map((index) => splitFeature(copy.cvFeatures[index]).title)}
            columns
          />
          <button
            type="button"
            aria-expanded={showCvDetails}
            aria-controls={`${cvDetailsId}-details`}
            onClick={() => setShowCvDetails((current) => !current)}
            className="mt-4 rounded-lg px-1 py-2 text-sm font-bold text-[#4A123F] underline decoration-[#D6AF2E] underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AF2E]"
          >
            {showCvDetails
              ? (offerCopy[language as OfferLanguage] ?? offerCopy.fr).hideCvDetails
              : (offerCopy[language as OfferLanguage] ?? offerCopy.fr).showCvDetails}
          </button>
          <div
            id={`${cvDetailsId}-details`}
            hidden={!showCvDetails}
            className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${showCvDetails ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
          >
            <div className="overflow-hidden">
              <FeatureAccordion
                items={ensureFeatureDescriptions(
                  [...copy.cvFeatures, copy.certifiedTitle, personalAccessCopy[language as OfferLanguage] ?? personalAccessCopy.fr],
                  accordionDescriptionLeadCopy[language as OfferLanguage] ?? accordionDescriptionLeadCopy.fr,
                )}
                variant="light"
                columns
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => openRequest('cv_business', copy.cvPlanLabel, 'cv_complete')}
            className="mt-6 w-full rounded-xl bg-[#4A123F] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#5B1C4E] focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] sm:w-auto"
          >
            {copy.requestCreation}
          </button>
        </section>

        <aside className="mt-5 rounded-2xl border border-amber-200 bg-white p-5 text-center shadow-sm" aria-labelledby="cv-choice-help-title">
          <h2 id="cv-choice-help-title" className="text-lg font-bold text-[#4A123F]">{essentialCopy.helpTitle}</h2>
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-6 text-slate-700">{essentialCopy.helpText}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a href="https://wa.me/21650390546" target="_blank" rel="noreferrer" className="rounded-xl bg-[#07543F] px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AF2E]">
              {(offerCopy[language as OfferLanguage] ?? offerCopy.fr).contactWhatsApp}
            </a>
            <a href="mailto:contact@dalil-tounes.com" className="rounded-xl border border-[#4A123F]/20 bg-white px-5 py-3 text-sm font-bold text-[#4A123F] transition hover:border-[#D6AF2E] hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AF2E]">
              {(offerCopy[language as OfferLanguage] ?? offerCopy.fr).contactEmail}
            </a>
          </div>
        </aside>

        <section className="mt-5 rounded-3xl bg-gradient-to-r from-[#4A123F] to-[#5F174F] p-5 text-white shadow-xl sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#D6AF2E] text-[#F0C537]">
                <Sparkles className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-2xl font-bold">{(offerCopy[language as OfferLanguage] ?? offerCopy.fr).eliteTitle}</h2>
                <p className="mt-1 font-bold text-[#F0C537]">{(offerCopy[language as OfferLanguage] ?? offerCopy.fr).customSolution}</p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-purple-100">{(offerCopy[language as OfferLanguage] ?? offerCopy.fr).eliteIntro}</p>
              </div>
            </div>
            <div className="grid shrink-0 gap-2 sm:min-w-48">
              <a href="mailto:contact@dalil-tounes.com" aria-label={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).contactEmail} className="rounded-xl bg-white px-5 py-3 text-center text-sm font-bold text-[#4A123F] transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]">
                {(offerCopy[language as OfferLanguage] ?? offerCopy.fr).contactUs}
              </a>
              <a href="https://wa.me/21650390546" target="_blank" rel="noreferrer" className="rounded-xl border border-[#D6AF2E] px-5 py-3 text-center text-sm font-bold text-[#F0C537] transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]">
                {(offerCopy[language as OfferLanguage] ?? offerCopy.fr).contactWhatsApp}
              </a>
            </div>
          </div>
        </section>

        <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-white px-4 py-4 text-center text-sm text-slate-700">
          <Info className="h-5 w-5 shrink-0 text-[#4A123F]" aria-hidden="true" />
          <p>{copy.disclaimer}</p>
        </div>

        <section className="mt-5 flex flex-col gap-5 rounded-3xl bg-gradient-to-r from-[#4A123F] to-[#5F174F] p-5 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#D6AF2E] text-[#F0C537]">
              <Rocket className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold">{copy.ctaTitle}</h2>
              <p className="mt-1 text-sm text-purple-100">{copy.ctaText}</p>
            </div>
          </div>
          <a
            href="#continuous-services-title"
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#4A123F] transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
          >
            {copy.ctaButton} <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </section>
      </main>

      {activePreview === 'free' && (
        <Modal title={copy.previewEssentialTitle} onClose={closePreview} closeLabel={copy.closeModal} size="compact">
          <h2 className="mb-4 text-center text-2xl font-bold text-[#4A123F]">{copy.previewEssentialTitle}</h2>
          <EssentialCardPreview copy={copy} />
        </Modal>
      )}

      {activePreview === 'artisan' && (
        <Modal title={copy.previewArtisanTitle} onClose={closePreview} closeLabel={copy.closeModal} size="preview">
          <h2 className="mb-4 text-center text-2xl font-bold text-[#4A123F]">{copy.previewArtisanTitle}</h2>
          <SubscriptionBusinessCardPreview variant="artisan" copy={copy} language={language as OfferLanguage} />
        </Modal>
      )}

      {activePreview === 'premium' && (
        <Modal title={copy.premiumDetailTitle} onClose={closePreview} closeLabel={copy.closeModal} size="preview">
          <h2 className="mb-4 text-center text-2xl font-bold text-[#4A123F]">{copy.premiumDetailTitle}</h2>
          <SubscriptionBusinessCardPreview variant="premium" copy={copy} language={language as OfferLanguage} />
        </Modal>
      )}

      {activePreview === 'launch' && (
        <Modal title={copy.launchConditionsDialog} onClose={closePreview} closeLabel={copy.closeModal} size="compact">
          <div className="mx-auto max-w-lg">
            <span className="rounded-full bg-[#D6AF2E] px-3 py-1 text-[10px] font-black tracking-[0.14em] text-[#07543F]">{copy.launchBadge}</span>
            <h2 className="mt-3 text-2xl font-bold text-[#4A123F]">{copy.launchConditionsTitle}</h2>
            <ul className="mt-4 space-y-3">
              {copy.launchConditions.map((condition) => (
                <li key={condition} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#07543F]" aria-hidden="true" /> {condition}
                </li>
              ))}
              {copy.flyerConditions.map((condition) => (
                <li key={condition} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#07543F]" aria-hidden="true" /> {condition}
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}

      {activePreview === 'request' && selectedPlan && (
        <Modal title={`${copy.requestModal} — ${selectedPlan.label}`} onClose={closePreview} closeLabel={copy.closeModal} size="medium">
          <div className="mx-auto max-w-[800px]">
            <div className="mb-4 text-center">
              <Send className="mx-auto h-8 w-8 text-[#D6AF2E]" aria-hidden="true" />
              <h2 className="mt-2 text-2xl font-bold text-[#4A123F]">{copy.requestTitle}</h2>
              <p className="mt-1 text-sm text-slate-600">{selectedPlan.label}</p>
            </div>
            <SubscriptionRequestForm
              selectedPlan={selectedPlan.code}
              selectedPlanLabel={selectedPlan.label}
              checkoutOffer={selectedPlan.checkoutOffer}
              initialBillingPeriod={selectedPlan.billingPeriod}
              onCancel={closePreview}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
