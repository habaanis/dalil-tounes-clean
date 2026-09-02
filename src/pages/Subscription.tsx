import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Check,
  ChevronRight,
  Clock3,
  Info,
  MapPin,
  Phone,
  Rocket,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { SubscriptionRequestForm } from '../components/SubscriptionRequestForm';
import type { BillingPeriod, CheckoutOffer, SubscriptionPlanCode } from '../components/SubscriptionRequestForm';
import { BusinessCardPreview } from '../components/BusinessCardPreview';
import CvBusinessJourney from '../components/CvBusinessJourney';
import {
  CvPresentationModelSelector,
  getPresentationModelLabel,
  type PresentationModel,
} from '../components/CvPresentationModelSelector';
import { useLanguage } from '../context/LanguageContext';

type PreviewType = 'free' | 'artisan' | 'premium' | 'launch' | 'request' | null;
type ModalSize = 'preview' | 'compact' | 'medium' | 'large';

const LOGO_PATH = '/images/logo_dalil_tounes_sceau_luxe.webp';
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
    requestCreation: 'Demander la création de mon CV Business',
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
    premiumDemoServices: 'Plateforme professionnelle, Visibilité locale, Présentation des activités',
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
    requestCreation: 'اطلب إنشاء CV Business الخاص بي',
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
    requestCreation: 'Request my Business CV creation',
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
    premiumDemoServices: 'Professional platform, Local visibility, Business presentation',
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
    requestCreation: 'Richiedi la creazione del mio CV Business',
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
    requestCreation: 'Заказать создание моего Business CV',
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

const mobileSubscriptionCopy: Record<OfferLanguage, {
  showBenefits: string;
  hideBenefits: string;
  showSecondary: string;
  hideSecondary: string;
}> = {
  fr: {
    showBenefits: 'Voir tout ce qui est inclus',
    hideBenefits: 'Réduire la liste',
    showSecondary: 'Voir l’accompagnement et les autres services',
    hideSecondary: 'Masquer les informations secondaires',
  },
  ar: {
    showBenefits: 'عرض كل ما تتضمنه الصيغة',
    hideBenefits: 'تقليص القائمة',
    showSecondary: 'عرض المرافقة والخدمات الأخرى',
    hideSecondary: 'إخفاء المعلومات الإضافية',
  },
  en: {
    showBenefits: 'See everything included',
    hideBenefits: 'Show less',
    showSecondary: 'See support and other services',
    hideSecondary: 'Hide secondary information',
  },
  it: {
    showBenefits: 'Vedi tutto ciò che è incluso',
    hideBenefits: 'Riduci la lista',
    showSecondary: 'Vedi assistenza e altri servizi',
    hideSecondary: 'Nascondi le informazioni secondarie',
  },
  ru: {
    showBenefits: 'Показать всё включённое',
    hideBenefits: 'Свернуть список',
    showSecondary: 'Показать сопровождение и другие услуги',
    hideSecondary: 'Скрыть дополнительную информацию',
  },
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
      'QR Business à présenter depuis ton téléphone — Ton client le scanne et ouvre directement ton CV Business.',
      'Jusqu’à 10 photos — Présente plus largement tes produits, ton établissement, ton équipe ou tes réalisations.',
      'Des statistiques plus détaillées — Suis les consultations, clics WhatsApp, appels, visites du site et l’évolution de ta visibilité.',
      'Bouton de réservation ou de demande — Selon ton activité, les visiteurs peuvent demander un rendez-vous, une réservation ou des informations.',
      'Un accompagnement prioritaire — Tes questions et demandes de modification sont traitées plus rapidement.',
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
    premiumFeatures: ['A more detailed presentation', 'Wider visibility across Tunisia', 'Higher priority than Artisan and free profiles', 'Presence in important Dalil Tounes spaces', 'Dalil Tounes Certified badge', 'Business QR to present from your phone — your customer scans it and opens your Business CV directly', 'Up to 10 photos', 'More detailed statistics', 'Booking or enquiry button', 'Priority support'],
    cvSectionTitle: 'Much more than a simple presentation', cvSectionParagraphs: ['Your CV Business becomes a digital business card you can use every day.', 'Send it by WhatsApp, email or message, share it on social media or use it after a first contact.', 'Your activity, services, expertise, work, contact details and professional platforms are gathered on one page.'], cvActionsIntro: 'Visitors can directly:', cvActions: ['call you', 'contact you on WhatsApp', 'open your Google Maps location', 'visit your website', 'discover your social networks', 'use your other contact methods'], cvClosing: 'Its personal link and QR Code make it easy to share on business cards, flyers, your storefront or posts.', oneTimeService: 'One-time service', cvDistinction: 'Subscriptions cover visibility and ongoing support. CV Business is a complete, structured professional presentation created with you.', eliteTitle: 'Elite Pro', customSolution: 'Tailored solution', eliteIntro: 'Every business has different needs. Talk to us to build a solution suited to your organisation, goals and budget.', contactUs: 'Contact us', contactEmail: 'By email', contactWhatsApp: 'On WhatsApp', certifiedDisclaimer: 'This badge confirms the reliability of the displayed information. It does not certify the quality of the products or services offered.', showAllFeatures: 'See all benefits', hideAllFeatures: 'Show fewer benefits', showCvDetails: 'See full service details', hideCvDetails: 'Show fewer details',
  },
  ar: {
    showAllFeatures: 'عرض كل المزايا', hideAllFeatures: 'تقليص المزايا', showCvDetails: 'عرض تفاصيل الخدمة كاملة', hideCvDetails: 'تقليص التفاصيل',
    cvIdealTitle: 'مثالي لك إذا كنت:',
    cvIdealItems: ['ترسل عرض مؤسستك إلى العملاء باستمرار', 'ترد بانتظام على طلبات عروض الأسعار', 'تشارك نشاطك على فيسبوك أو واتساب أو شبكات أخرى', 'ترغب في تقديم مؤسستك بشكل واضح ومهني'],
    artisanPrice: '30 د.ت', premiumPrice: '59 د.ت', perMonth: '/ شهر', premiumIncludesArtisan: 'تشمل باقة بريميوم جميع مزايا اشتراك حرفي.', artisanIntro: 'صيغة للحرفيين والمستقلين والتجار والمؤسسات الصغيرة الراغبة في عرض أوضح وظهور أفضل في منطقتها.', premiumIntro: 'صيغة للمؤسسات التي تريد الوصول إلى جمهور أوسع والاستفادة من مرافقة أكثر انتظامًا.', artisanFeatures: ['ننشىء بطاقتك معك', 'تقديم واضح لنشاطك', 'كل معلوماتك المفيدة في مكان واحد', 'حتى 5 صور', 'ظهور أفضل في منطقتك', 'ترتيب أفضل من البطاقات المجانية', 'شارة حرفي', 'إحصائيات بسيطة', 'رمز QR الخاص بك', 'يمكنك تحديث معلوماتك', 'مساعدة عبر البريد أو واتساب'], premiumFeatures: ['تقديم أكثر تفصيلًا', 'ظهور أوسع في تونس', 'أولوية أعلى في النتائج', 'حضور في المساحات المهمة', 'شارة دليل تونس موثّق', 'رمز QR للأعمال لعرضه من هاتفك — يمسحه العميل ويفتح مباشرة السيرة المهنية لنشاطك', 'حتى 10 صور', 'إحصائيات أكثر تفصيلًا', 'زر حجز أو طلب', 'مرافقة ذات أولوية'], cvSectionTitle: 'أكثر بكثير من مجرد تقديم', cvSectionParagraphs: ['تصبح سيرة نشاطك بطاقة رقمية تستخدمها كل يوم.', 'أرسلها عبر واتساب أو البريد أو شاركها على شبكات التواصل.', 'يجتمع نشاطك وخدماتك وخبرتك وإنجازاتك وبيانات اتصالك في صفحة واحدة.'], cvActionsIntro: 'يمكن للزوار مباشرة:', cvActions: ['الاتصال بك', 'مراسلتك على واتساب', 'فتح موقعك على خرائط Google', 'زيارة موقعك', 'اكتشاف شبكاتك الاجتماعية', 'استخدام وسائل الاتصال الأخرى'], cvClosing: 'يسهّل الرابط الشخصي ورمز QR مشاركتها على بطاقات الزيارة والمنشورات والواجهة.', oneTimeService: 'خدمة لمرة واحدة', cvDistinction: 'الاشتراكات تخص الظهور والمتابعة المستمرة، أما CV Business فهو تقديم مهني كامل ومنظم ننشئه معك.', eliteTitle: 'إيليت برو', customSolution: 'حل حسب الطلب', eliteIntro: 'لكل مؤسسة احتياجات مختلفة. تواصل معنا لبناء حل يناسب تنظيمك وأهدافك وميزانيتك.', contactUs: 'تواصل معنا', contactEmail: 'بالبريد الإلكتروني', contactWhatsApp: 'عبر واتساب', certifiedDisclaimer: 'تؤكد هذه الشارة موثوقية المعلومات المعروضة، ولا تعد شهادة على جودة المنتجات أو الخدمات.',
  },
  it: {
    showAllFeatures: 'Vedi tutti i vantaggi', hideAllFeatures: 'Riduci i vantaggi', showCvDetails: 'Vedi tutti i dettagli della prestazione', hideCvDetails: 'Riduci i dettagli',
    cvIdealTitle: 'Ideale se:',
    cvIdealItems: ['invii spesso la presentazione della tua azienda ai clienti', 'rispondi regolarmente alle richieste di preventivo', 'condividi la tua attività su Facebook, WhatsApp o altri social', 'desideri presentare la tua azienda in modo chiaro e professionale'],
    artisanPrice: '30 TND', premiumPrice: '59 TND', perMonth: '/ mese', premiumIncludesArtisan: 'Premium include tutti i vantaggi dell’abbonamento Artisan.', artisanIntro: 'Una formula per artigiani, indipendenti, commercianti e piccole imprese che desiderano una presentazione migliore e più visibilità locale.', premiumIntro: 'Una formula per le aziende che vogliono raggiungere un pubblico più ampio e ricevere un supporto più regolare.', artisanFeatures: ['Creiamo la tua scheda con te', 'Una presentazione chiara', 'Tutte le informazioni utili insieme', 'Fino a 5 foto', 'Più visibilità nella tua regione', 'Posizione migliore delle schede gratuite', 'Badge Artisan', 'Statistiche semplici', 'Il tuo QR Code', 'Puoi aggiornare le informazioni', 'Supporto via e-mail o WhatsApp'], premiumFeatures: ['Presentazione più sviluppata', 'Visibilità più ampia in Tunisia', 'Priorità superiore nei risultati', 'Presenza negli spazi importanti', 'Badge Dalil Tounes Certificato', 'QR Business da mostrare dal telefono — il cliente lo scansiona e apre direttamente il tuo CV Business', 'Fino a 10 foto', 'Statistiche dettagliate', 'Pulsante prenotazione o richiesta', 'Supporto prioritario'], cvSectionTitle: 'Molto più di una semplice presentazione', cvSectionParagraphs: ['Il tuo CV Business diventa un vero biglietto da visita digitale.', 'Invialo via WhatsApp, e-mail o messaggio e condividilo sui social.', 'Attività, servizi, competenze, lavori e contatti sono riuniti in una pagina.'], cvActionsIntro: 'I visitatori possono:', cvActions: ['chiamarti', 'contattarti su WhatsApp', 'aprire la posizione su Google Maps', 'visitare il sito', 'scoprire i social', 'usare gli altri contatti'], cvClosing: 'Il link personale e il QR Code facilitano la condivisione su biglietti, volantini, vetrina e pubblicazioni.', oneTimeService: 'Prestazione una tantum', cvDistinction: 'Gli abbonamenti riguardano visibilità e assistenza continua. CV Business è una presentazione professionale completa creata con te.', eliteTitle: 'Elite Pro', customSolution: 'Soluzione su misura', eliteIntro: 'Ogni azienda ha esigenze diverse. Parla con noi per costruire una soluzione adatta alla tua organizzazione, ai tuoi obiettivi e al tuo budget.', contactUs: 'Contattaci', contactEmail: 'Via e-mail', contactWhatsApp: 'Su WhatsApp', certifiedDisclaimer: 'Il badge conferma l’affidabilità delle informazioni mostrate, non certifica la qualità dei prodotti o servizi.',
  },
  ru: {
    showAllFeatures: 'Показать все преимущества', hideAllFeatures: 'Свернуть преимущества', showCvDetails: 'Показать все детали услуги', hideCvDetails: 'Свернуть детали',
    cvIdealTitle: 'Подходит вам, если вы:',
    cvIdealItems: ['часто отправляете клиентам презентацию своей компании', 'регулярно отвечаете на запросы коммерческих предложений', 'рассказываете о своей деятельности в Facebook, WhatsApp или других сетях', 'хотите представить свою компанию понятно и профессионально'],
    artisanPrice: '30 TND', premiumPrice: '59 TND', perMonth: '/ месяц', premiumIncludesArtisan: 'Premium включает все преимущества тарифа Artisan.', artisanIntro: 'Тариф для мастеров, независимых специалистов, магазинов и малого бизнеса, которым нужны понятная презентация и локальная видимость.', premiumIntro: 'Тариф для компаний, которые хотят расширить аудиторию и получать регулярное сопровождение.', artisanFeatures: ['Создаём профиль вместе с вами', 'Понятная презентация деятельности', 'Вся полезная информация в одном месте', 'До 5 фотографий', 'Больше видимости в вашем регионе', 'Позиция выше бесплатных профилей', 'Значок Artisan', 'Простая статистика', 'Ваш QR-код', 'Самостоятельное обновление данных', 'Помощь по e-mail или WhatsApp'], premiumFeatures: ['Более подробная презентация', 'Видимость по всему Тунису', 'Повышенный приоритет в результатах', 'Размещение в важных разделах', 'Значок «Проверено Dalil Tounes»', 'Business QR для показа с телефона — клиент сканирует его и сразу открывает ваш Business CV', 'До 10 фотографий', 'Подробная статистика', 'Кнопка бронирования или запроса', 'Приоритетная поддержка'], cvSectionTitle: 'Гораздо больше, чем презентация', cvSectionParagraphs: ['CV Business становится цифровой визитной карточкой на каждый день.', 'Отправляйте её через WhatsApp, e-mail или сообщения и делитесь в соцсетях.', 'Деятельность, услуги, опыт, работы и контакты собраны на одной странице.'], cvActionsIntro: 'Посетители могут:', cvActions: ['позвонить вам', 'написать в WhatsApp', 'открыть адрес в Google Maps', 'посетить сайт', 'открыть социальные сети', 'использовать другие контакты'], cvClosing: 'Персональная ссылка и QR-код позволяют делиться профилем на визитках, флаерах, витрине и в публикациях.', oneTimeService: 'Разовая услуга', cvDistinction: 'Подписки обеспечивают видимость и постоянное сопровождение. CV Business — полная профессиональная презентация, созданная вместе с вами.', eliteTitle: 'Elite Pro', customSolution: 'Индивидуальное решение', eliteIntro: 'У каждой компании свои потребности. Свяжитесь с нами, чтобы создать решение под вашу организацию, цели и бюджет.', contactUs: 'Связаться с нами', contactEmail: 'По e-mail', contactWhatsApp: 'В WhatsApp', certifiedDisclaimer: 'Значок подтверждает достоверность показанной информации, но не качество товаров или услуг.',
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

function ResponsiveFeatureList({
  items,
  showLabel,
  hideLabel,
  columns = false,
  variant = 'light',
}: {
  items: string[];
  showLabel: string;
  hideLabel: string;
  columns?: boolean;
  variant?: 'light' | 'dark';
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="sm:hidden">
        <FeatureList items={expanded ? items : items.slice(0, 3)} columns={columns} variant={variant} />
        {items.length > 3 && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((current) => !current)}
            className={`mt-3 text-sm font-bold underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${variant === 'dark' ? 'text-[#F4CE55] decoration-white/50' : 'text-[#4A123F] decoration-[#D6AF2E]'}`}
          >
            {expanded ? hideLabel : showLabel}
          </button>
        )}
      </div>
      <div className="hidden sm:block">
        <FeatureList items={items} columns={columns} variant={variant} />
      </div>
    </>
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

function EssentialCardPreview({ copy, previewText }: { copy: SubscriptionCopy; previewText: string }) {
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
      <p className="mt-4 text-sm leading-6 text-slate-600">{previewText}</p>
    </div>
  );
}

const simplifiedOfferCopy: Record<OfferLanguage, {
  productsTitle: string;
  productsSubtitle: string;
  welcomeBadge: string;
  welcomeTitle: string;
  welcomeDescription: string;
  welcomeHighlight: string;
  welcomePayment: string;
  creationLabel: string;
  firstYearIncluded: string;
  artisanTitle: string;
  artisanIntro: string;
  artisanFeatures: string[];
  premiumTitle: string;
  premiumIntro: string;
  maintenanceTitle: string;
  maintenanceTiming: string;
  maintenancePrice: string;
  maintenanceIntro: string;
  maintenanceFeatures: string[];
  noRenewal: string;
  preview: string;
  chooseArtisan: string;
  choosePremium: string;
  essentialFeatures: string[];
  essentialPreviewText: string;
}> = {
  fr: {
    productsTitle: 'Choisissez votre CV Business',
    productsSubtitle: 'Un prix de création simple, sans abonnement mensuel.',
    welcomeBadge: 'Offre de bienvenue',
    welcomeTitle: 'Notre modèle évolue pour mieux accompagner les professionnels tunisiens',
    welcomeDescription: 'Nous connaissons les réalités des artisans, des indépendants et des petites entreprises. Dalil Tounes supprime donc les abonnements mensuels : vous réglez une seule fois la création du CV Business de votre choix.',
    welcomeHighlight: 'La première année est incluse et les deux années suivantes sont offertes : 3 ans de CV Business sans renouvellement à régler, avec votre carte Business et son QR Code.',
    welcomePayment: 'Seul le prix de création du CV Business choisi est à régler : 30 TND pour Artisan ou 59 TND pour Premium.',
    creationLabel: 'Création — paiement unique',
    firstYearIncluded: '12 mois inclus + 24 mois offerts — 3 ans au total',
    artisanTitle: 'CV Business Artisan',
    artisanIntro: 'Une présentation légère et professionnelle pour les artisans, indépendants, commerçants et petites activités.',
    artisanFeatures: ['Présentation légère', 'Activité et services', 'Coordonnées', 'Téléphone et WhatsApp', 'Horaires', '2 réseaux sociaux du professionnel', 'Jusqu’à 5 photos', 'QR Code Business'],
    premiumTitle: 'CV Business Premium',
    premiumIntro: 'Le CV Business complet de Dalil Tounes, avec la présentation Premium et les fonctionnalités actuelles de la formule.',
    maintenanceTitle: 'Maintien annuel du CV Business',
    maintenanceTiming: 'À partir de la 4e année',
    maintenancePrice: '50 TND / an',
    maintenanceIntro: 'Après les trois années de l’offre de bienvenue, vous choisissez librement de maintenir votre CV Business actif et entretenu.',
    maintenanceFeatures: ['Maintien du CV Business en ligne', 'Hébergement inclus', 'QR Business actif', 'Maintenance technique', 'Mises à jour techniques de la plateforme Dalil Tounes', 'Jusqu’à 10 demandes de modification par an', 'Assistance Dalil Tounes'],
    noRenewal: 'Sans renouvellement, votre entreprise reste présente gratuitement sur Dalil Tounes avec la Présence essentielle. Les fonctions du CV Business sont désactivées jusqu’à sa réactivation.',
    preview: 'Aperçu du CV Business',
    chooseArtisan: 'Choisir CV Business Artisan',
    choosePremium: 'Choisir CV Business Premium',
    essentialFeatures: ["Nom de l'activité", 'Activité', 'Ville', 'Téléphone', "Horaires d'ouverture"],
    essentialPreviewText: "Une présence gratuite avec le nom, l’activité, la ville, le téléphone et les horaires.",
  },
  ar: {
    productsTitle: 'اختر CV Business الخاص بك',
    productsSubtitle: 'سعر إنشاء واضح دون اشتراك شهري.',
    welcomeBadge: 'عرض ترحيبي',
    welcomeTitle: 'طوّرنا نموذجنا لمرافقة المهنيين التونسيين بشكل أفضل',
    welcomeDescription: 'نحن ندرك واقع الحرفيين والمستقلين والمؤسسات الصغيرة. لذلك ألغى دليل تونس الاشتراكات الشهرية: تدفع مرة واحدة فقط مقابل إنشاء CV Business الذي تختاره.',
    welcomeHighlight: 'السنة الأولى مشمولة والسنتان التاليتان مجانًا: 3 سنوات من CV Business دون أي تجديد، مع بطاقة Business ورمز QR الخاص بها.',
    welcomePayment: 'تدفع فقط سعر إنشاء CV Business المختار: 30 د.ت لصيغة الحرفي أو 59 د.ت لصيغة Premium.',
    creationLabel: 'الإنشاء — دفعة واحدة',
    firstYearIncluded: '12 شهرًا مشمولة + 24 شهرًا مجانًا — 3 سنوات إجمالًا',
    artisanTitle: 'CV Business حرفي',
    artisanIntro: 'عرض مهني خفيف للحرفيين والمستقلين والتجار والأنشطة الصغيرة.',
    artisanFeatures: ['عرض مختصر', 'النشاط والخدمات', 'بيانات الاتصال', 'الهاتف وواتساب', 'أوقات العمل', 'شبكتان اجتماعيتان للمهني', 'حتى 5 صور', 'QR Business'],
    premiumTitle: 'CV Business Premium',
    premiumIntro: 'النسخة الكاملة من CV Business في دليل تونس مع عرض Premium ووظائفه الحالية.',
    maintenanceTitle: 'الصيانة السنوية لـ CV Business',
    maintenanceTiming: 'ابتداءً من السنة الرابعة',
    maintenancePrice: '50 د.ت / سنة',
    maintenanceIntro: 'بعد السنوات الثلاث للعرض الترحيبي، تختار بحرية مواصلة صيانة CV Business ليبقى نشطًا ومحدّثًا.',
    maintenanceFeatures: ['إبقاء CV Business منشورًا', 'الاستضافة مشمولة', 'QR Business نشط', 'الصيانة التقنية', 'التحديثات التقنية لمنصة دليل تونس', 'حتى 10 طلبات تعديل في السنة', 'مساعدة دليل تونس'],
    noRenewal: 'دون تجديد، يبقى نشاطك حاضرًا مجانًا على دليل تونس ضمن الحضور الأساسي، ويتم تعطيل وظائف CV Business إلى حين إعادة تفعيله.',
    preview: 'معاينة CV Business',
    chooseArtisan: 'اختر CV Business حرفي',
    choosePremium: 'اختر CV Business Premium',
    essentialFeatures: ['اسم النشاط', 'النشاط', 'المدينة', 'الهاتف', 'أوقات العمل'],
    essentialPreviewText: 'حضور مجاني يتضمن اسم النشاط والنشاط والمدينة والهاتف وأوقات العمل.',
  },
  en: {
    productsTitle: 'Choose your Business CV',
    productsSubtitle: 'A simple creation price, with no monthly subscription.',
    welcomeBadge: 'Welcome offer',
    welcomeTitle: 'Our model is evolving to better support Tunisian professionals',
    welcomeDescription: 'We understand the realities faced by craftspeople, independents and small businesses. Dalil Tounes has therefore removed monthly subscriptions: you pay once for the creation of the Business CV you choose.',
    welcomeHighlight: 'The first year is included and the following two years are free: 3 years of Business CV with no renewal to pay, including your Business card and its QR Code.',
    welcomePayment: 'You only pay the creation price of your chosen Business CV: 30 TND for Artisan or 59 TND for Premium.',
    creationLabel: 'Creation — one-time payment',
    firstYearIncluded: '12 months included + 24 months free — 3 years in total',
    artisanTitle: 'Artisan Business CV',
    artisanIntro: 'A light professional presentation for craftspeople, independents, shops and small businesses.',
    artisanFeatures: ['Light presentation', 'Activity and services', 'Contact details', 'Phone and WhatsApp', 'Opening hours', '2 client social networks', 'Up to 5 photos', 'Business QR Code'],
    premiumTitle: 'Premium Business CV',
    premiumIntro: 'The complete Dalil Tounes Business CV with the current Premium presentation and features.',
    maintenanceTitle: 'Annual Business CV maintenance',
    maintenanceTiming: 'From the 4th year',
    maintenancePrice: '50 TND / year',
    maintenanceIntro: 'After the three years included in the welcome offer, you freely choose whether to keep your Business CV active and maintained.',
    maintenanceFeatures: ['Business CV kept online', 'Hosting included', 'Business QR Code kept active', 'Technical maintenance', 'Dalil Tounes platform technical updates', 'Up to 10 modification requests per year', 'Dalil Tounes assistance'],
    noRenewal: 'Without renewal, your business remains listed for free on Dalil Tounes with Essential Presence. Business CV features are disabled until reactivation.',
    preview: 'Business CV preview',
    chooseArtisan: 'Choose Artisan Business CV',
    choosePremium: 'Choose Premium Business CV',
    essentialFeatures: ['Business name', 'Activity', 'City', 'Phone', 'Opening hours'],
    essentialPreviewText: 'A free presence with the business name, activity, city, phone and opening hours.',
  },
  it: {
    productsTitle: 'Scegli il tuo CV Business',
    productsSubtitle: 'Un prezzo di creazione semplice, senza abbonamento mensile.',
    welcomeBadge: 'Offerta di benvenuto',
    welcomeTitle: 'Il nostro modello evolve per sostenere meglio i professionisti tunisini',
    welcomeDescription: 'Conosciamo la realtà di artigiani, indipendenti e piccole imprese. Per questo Dalil Tounes elimina gli abbonamenti mensili: paghi una sola volta la creazione del CV Business che scegli.',
    welcomeHighlight: 'Il primo anno è incluso e i due anni successivi sono offerti: 3 anni di CV Business senza rinnovi da pagare, con la tua carta Business e il suo QR Code.',
    welcomePayment: 'Paghi solo il prezzo di creazione del CV Business scelto: 30 TND per Artisan o 59 TND per Premium.',
    creationLabel: 'Creazione — pagamento unico',
    firstYearIncluded: '12 mesi inclusi + 24 mesi offerti — 3 anni in totale',
    artisanTitle: 'CV Business Artisan',
    artisanIntro: 'Una presentazione professionale leggera per artigiani, indipendenti, commercianti e piccole attività.',
    artisanFeatures: ['Presentazione leggera', 'Attività e servizi', 'Recapiti', 'Telefono e WhatsApp', 'Orari', '2 social network del cliente', 'Fino a 5 foto', 'QR Code Business'],
    premiumTitle: 'CV Business Premium',
    premiumIntro: 'Il CV Business completo di Dalil Tounes con la presentazione Premium e le funzionalità attuali.',
    maintenanceTitle: 'Mantenimento annuale del CV Business',
    maintenanceTiming: 'Dal 4° anno',
    maintenancePrice: '50 TND / anno',
    maintenanceIntro: 'Dopo i tre anni dell’offerta di benvenuto, scegli liberamente se mantenere attivo e curato il tuo CV Business.',
    maintenanceFeatures: ['CV Business mantenuto online', 'Hosting incluso', 'QR Business attivo', 'Manutenzione tecnica', 'Aggiornamenti tecnici della piattaforma Dalil Tounes', 'Fino a 10 richieste di modifica all’anno', 'Assistenza Dalil Tounes'],
    noRenewal: 'Senza rinnovo, l’attività resta presente gratuitamente su Dalil Tounes con la Presenza essenziale. Le funzioni del CV Business vengono disattivate fino alla riattivazione.',
    preview: 'Anteprima CV Business',
    chooseArtisan: 'Scegli CV Business Artisan',
    choosePremium: 'Scegli CV Business Premium',
    essentialFeatures: ["Nome dell’attività", 'Attività', 'Città', 'Telefono', 'Orari di apertura'],
    essentialPreviewText: 'Una presenza gratuita con nome, attività, città, telefono e orari.',
  },
  ru: {
    productsTitle: 'Выберите свой Business CV',
    productsSubtitle: 'Простая цена создания без ежемесячной подписки.',
    welcomeBadge: 'Приветственное предложение',
    welcomeTitle: 'Наша модель развивается, чтобы лучше поддерживать тунисских специалистов',
    welcomeDescription: 'Мы понимаем реальное положение мастеров, независимых специалистов и малого бизнеса. Поэтому Dalil Tounes отменяет ежемесячную подписку: вы один раз оплачиваете создание выбранного Business CV.',
    welcomeHighlight: 'Первый год включён, а следующие два года предоставляются бесплатно: 3 года Business CV без оплаты продления, включая вашу Business-карту и её QR-код.',
    welcomePayment: 'Оплачивается только создание выбранного Business CV: 30 TND за Artisan или 59 TND за Premium.',
    creationLabel: 'Создание — разовая оплата',
    firstYearIncluded: '12 месяцев включены + 24 месяца бесплатно — всего 3 года',
    artisanTitle: 'Business CV Artisan',
    artisanIntro: 'Лёгкая профессиональная презентация для мастеров, независимых специалистов, магазинов и малого бизнеса.',
    artisanFeatures: ['Краткая презентация', 'Деятельность и услуги', 'Контактные данные', 'Телефон и WhatsApp', 'Часы работы', '2 социальные сети клиента', 'До 5 фотографий', 'Business QR Code'],
    premiumTitle: 'Business CV Premium',
    premiumIntro: 'Полный Business CV Dalil Tounes с текущей Premium-презентацией и функциями.',
    maintenanceTitle: 'Ежегодное обслуживание Business CV',
    maintenanceTiming: 'С 4-го года',
    maintenancePrice: '50 TND / год',
    maintenanceIntro: 'После трёх лет приветственного предложения вы сами решаете, продолжать ли обслуживание активного Business CV.',
    maintenanceFeatures: ['Business CV остаётся онлайн', 'Хостинг включён', 'Business QR Code активен', 'Техническое обслуживание', 'Технические обновления платформы Dalil Tounes', 'До 10 запросов на изменения в год', 'Поддержка Dalil Tounes'],
    noRenewal: 'Без продления компания остаётся бесплатно представлена на Dalil Tounes в формате Essential Presence. Функции Business CV отключаются до повторной активации.',
    preview: 'Предпросмотр Business CV',
    chooseArtisan: 'Выбрать Business CV Artisan',
    choosePremium: 'Выбрать Business CV Premium',
    essentialFeatures: ['Название деятельности', 'Деятельность', 'Город', 'Телефон', 'Часы работы'],
    essentialPreviewText: 'Бесплатное присутствие с названием, деятельностью, городом, телефоном и часами работы.',
  },
};

function CreationPlanCard({
  title,
  price,
  creationLabel,
  firstYearIncluded,
  intro,
  features,
  previewLabel,
  chooseLabel,
  onPreview,
  onRequest,
  showBenefitsLabel,
  hideBenefitsLabel,
  selected = false,
}: {
  title: string;
  price: string;
  creationLabel: string;
  firstYearIncluded: string;
  intro: string;
  features: string[];
  previewLabel: string;
  chooseLabel: string;
  onPreview: () => void;
  onRequest: () => void;
  showBenefitsLabel: string;
  hideBenefitsLabel: string;
  selected?: boolean;
}) {
  return (
    <article className={`relative flex h-full flex-col overflow-hidden rounded-3xl border-2 bg-[#07543F] p-5 text-white shadow-[0_12px_30px_rgba(7,84,63,0.16)] transition sm:p-6 ${selected ? 'border-white ring-4 ring-[#D6AF2E]' : 'border-[#D6AF2E]'}`}>
      <span className="absolute right-0 top-0 rounded-bl-2xl bg-[#D6AF2E] px-4 py-2 text-[11px] font-black tracking-[0.12em] text-[#07543F]">CV BUSINESS</span>
      <h3 className="mt-8 text-2xl font-bold">{title}</h3>
      <div className="mt-2 flex items-end gap-2 text-[#F4CE55]">
        <span className="text-4xl font-black">{price}</span>
      </div>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-emerald-100">{creationLabel}</p>
      <p className="mt-3 text-sm leading-6 text-emerald-50">{intro}</p>
      <p className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white">{firstYearIncluded}</p>
      <div className="mt-4 flex-1">
        <ResponsiveFeatureList items={features} showLabel={showBenefitsLabel} hideLabel={hideBenefitsLabel} variant="dark" />
      </div>
      <div className="grid gap-2 pt-6 sm:grid-cols-2">
        <button type="button" onClick={onPreview} className="rounded-xl border border-[#D6AF2E] bg-transparent px-4 py-3 text-sm font-bold text-[#F0C537] transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]">{previewLabel}</button>
        <button type="button" onClick={onRequest} className="rounded-xl bg-[#D6AF2E] px-4 py-3 text-sm font-bold text-[#07543F] transition hover:bg-[#E5C64D] focus:outline-none focus:ring-2 focus:ring-white">{chooseLabel}</button>
      </div>
    </article>
  );
}

export const Subscription = ({ showMobileJourney = true }: { showMobileJourney?: boolean } = {}) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const copy = subscriptionCopy[language as keyof typeof subscriptionCopy] ?? subscriptionCopy.fr;
  const essentialCopy = essentialCvCopy[language as OfferLanguage] ?? essentialCvCopy.fr;
  const simpleCopy = simplifiedOfferCopy[language as OfferLanguage] ?? simplifiedOfferCopy.fr;
  const mobileCopy = mobileSubscriptionCopy[language as OfferLanguage] ?? mobileSubscriptionCopy.fr;
  const [activePreview, setActivePreview] = useState<PreviewType>(null);
  const [selectedPlan, setSelectedPlan] = useState<{
    code: SubscriptionPlanCode;
    label: string;
    checkoutOffer: CheckoutOffer;
    billingPeriod?: BillingPeriod;
    presentationModelLabel?: string;
  } | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<'artisan' | 'premium' | null>(null);
  const [selectedPresentationModel, setSelectedPresentationModel] = useState<PresentationModel | null>(null);
  const [showSecondaryMobile, setShowSecondaryMobile] = useState(false);

  const closePreview = () => setActivePreview(null);
  const openRequest = (code: SubscriptionPlanCode, label: string, checkoutOffer: CheckoutOffer, billingPeriod?: BillingPeriod, presentationModelLabel?: string) => {
    setSelectedPlan({ code, label, checkoutOffer, billingPeriod, presentationModelLabel });
    setActivePreview('request');
  };
  const selectFormula = (formula: 'artisan' | 'premium') => {
    setSelectedFormula(formula);
    window.requestAnimationFrame(() => {
      document.getElementById('cv-presentation-models')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };
  const selectedFormulaLabel = selectedFormula
    ? `${simplifiedOfferCopy[language as OfferLanguage][`${selectedFormula}Title`]} — ${(offerCopy[language as OfferLanguage] ?? offerCopy.fr)[`${selectedFormula}Price`]}`
    : null;
  const continueWithModel = () => {
    if (!selectedFormula || !selectedPresentationModel || !selectedFormulaLabel) return;
    const modelLabel = getPresentationModelLabel(language, selectedPresentationModel);
    openRequest(selectedFormula, `${selectedFormulaLabel} — ${modelLabel}`, selectedFormula, undefined, modelLabel);
  };

  return (
    <div className="bg-[#FFFCF7] px-4 py-8 text-slate-900 sm:py-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <main className="mx-auto flex max-w-6xl flex-col">
        <header className="order-1 mb-2 text-center sm:mb-10 lg:order-none">
          <p className="mb-3 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-amber-600">
            <span className="h-px w-8 bg-amber-400" /> {copy.heroEyebrow} <span className="h-px w-8 bg-amber-400" />
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#4A123F] sm:text-4xl lg:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">{copy.heroSubtitle}</p>
        </header>

        <section aria-label={copy.startingSolutions} className="order-3 mx-auto mt-7 max-w-2xl lg:order-none lg:mt-0">
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
            <ResponsiveFeatureList
              items={simplifiedOfferCopy[language as OfferLanguage].essentialFeatures}
              showLabel={mobileCopy.showBenefits}
              hideLabel={mobileCopy.hideBenefits}
            />
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

        <section aria-labelledby="cv-business-products-title" className="order-2 mt-5 sm:mt-11 lg:order-none">
<div className="mb-6 text-center">
  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">CV BUSINESS DALIL TOUNES</p>
  <h2 id="cv-business-products-title" className="mt-2 text-2xl font-black text-[#4A123F] sm:text-3xl">{simpleCopy.productsTitle}</h2>
  <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">{simpleCopy.productsSubtitle}</p>
</div>

<div className="mb-6 overflow-hidden rounded-3xl border border-[#D6AF2E]/60 bg-gradient-to-br from-[#FFF8DF] via-white to-emerald-50 p-5 shadow-[0_12px_30px_rgba(74,18,63,0.07)] sm:p-7">
  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
    <div className="max-w-3xl">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#4A123F] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
        <Sparkles className="h-3.5 w-3.5 text-[#F0C537]" aria-hidden="true" />
        {simpleCopy.welcomeBadge}
      </span>
      <h3 className="mt-3 text-xl font-black text-[#4A123F] sm:text-2xl">{simpleCopy.welcomeTitle}</h3>
      <p className="mt-3 hidden text-sm leading-6 text-slate-700 sm:block">{simpleCopy.welcomeDescription}</p>
    </div>
    <div className="hidden rounded-2xl bg-[#07543F] px-5 py-4 text-center text-white shadow-sm sm:block lg:max-w-xs">
      <p className="text-lg font-black leading-6 text-[#F4CE55]">{simpleCopy.welcomeHighlight}</p>
    </div>
  </div>
  <p className="mt-4 rounded-2xl border border-[#D6AF2E]/45 bg-white px-4 py-3 text-sm font-black leading-6 text-[#4A123F]">{simpleCopy.welcomePayment}</p>
</div>

<div className="grid items-stretch gap-5 lg:grid-cols-2">
  <CreationPlanCard
    title={simplifiedOfferCopy[language as OfferLanguage].artisanTitle}
    price={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).artisanPrice}
    creationLabel={simplifiedOfferCopy[language as OfferLanguage].creationLabel}
    firstYearIncluded={simplifiedOfferCopy[language as OfferLanguage].firstYearIncluded}
    intro={simplifiedOfferCopy[language as OfferLanguage].artisanIntro}
    features={simplifiedOfferCopy[language as OfferLanguage].artisanFeatures}
    previewLabel={simplifiedOfferCopy[language as OfferLanguage].preview}
    chooseLabel={simplifiedOfferCopy[language as OfferLanguage].chooseArtisan}
    onPreview={() => setActivePreview('artisan')}
    onRequest={() => selectFormula('artisan')}
    showBenefitsLabel={mobileCopy.showBenefits}
    hideBenefitsLabel={mobileCopy.hideBenefits}
    selected={selectedFormula === 'artisan'}
  />
  <CreationPlanCard
    title={simplifiedOfferCopy[language as OfferLanguage].premiumTitle}
    price={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).premiumPrice}
    creationLabel={simplifiedOfferCopy[language as OfferLanguage].creationLabel}
    firstYearIncluded={simplifiedOfferCopy[language as OfferLanguage].firstYearIncluded}
    intro={simplifiedOfferCopy[language as OfferLanguage].premiumIntro}
    features={(offerCopy[language as OfferLanguage] ?? offerCopy.fr).premiumFeatures}
    previewLabel={simplifiedOfferCopy[language as OfferLanguage].preview}
    chooseLabel={simplifiedOfferCopy[language as OfferLanguage].choosePremium}
    onPreview={() => setActivePreview('premium')}
    onRequest={() => selectFormula('premium')}
    showBenefitsLabel={mobileCopy.showBenefits}
    hideBenefitsLabel={mobileCopy.hideBenefits}
    selected={selectedFormula === 'premium'}
  />
</div>

{showMobileJourney && (
  <div className="mt-5 lg:hidden">
    <CvBusinessJourney language={language as OfferLanguage} />
  </div>
)}

<CvPresentationModelSelector
  language={language}
  value={selectedPresentationModel}
  onChange={setSelectedPresentationModel}
  selectedFormulaLabel={selectedFormulaLabel}
  onContinue={continueWithModel}
/>

<div className="mt-5 rounded-3xl border border-[#D6AF2E]/60 bg-white p-5 shadow-[0_10px_28px_rgba(74,18,63,0.06)] sm:p-6">
  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
    <div>
      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-800">{simpleCopy.maintenanceTiming}</span>
      <h3 className="mt-3 text-2xl font-bold text-[#4A123F]">{simpleCopy.maintenanceTitle}</h3>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{simpleCopy.maintenanceIntro}</p>
    </div>
    <div className="text-3xl font-black text-[#07543F]">{simpleCopy.maintenancePrice}</div>
  </div>
  <div className="mt-5">
    <ResponsiveFeatureList
      items={simpleCopy.maintenanceFeatures}
      showLabel={mobileCopy.showBenefits}
      hideLabel={mobileCopy.hideBenefits}
      columns
    />
  </div>
  <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-[#4A123F]">{simpleCopy.noRenewal}</p>
</div>
        </section>

        <button
          type="button"
          aria-expanded={showSecondaryMobile}
          onClick={() => setShowSecondaryMobile((current) => !current)}
          className="order-4 mt-5 rounded-xl border border-[#D6AF2E] bg-white px-4 py-3 text-sm font-black text-[#4A123F] shadow-sm lg:hidden"
        >
          {showSecondaryMobile ? mobileCopy.hideSecondary : mobileCopy.showSecondary}
        </button>

        <aside className={`${showSecondaryMobile ? 'block' : 'hidden'} order-5 mt-5 rounded-2xl border border-amber-200 bg-white p-5 text-center shadow-sm lg:order-none lg:block`} aria-labelledby="cv-choice-help-title">
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

        <section className={`${showSecondaryMobile ? 'block' : 'hidden'} order-6 mt-5 rounded-3xl bg-gradient-to-r from-[#4A123F] to-[#5F174F] p-5 text-white shadow-xl sm:p-7 lg:order-none lg:block`}>
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

        <div className={`${showSecondaryMobile ? 'flex' : 'hidden'} order-7 mt-5 items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-white px-4 py-4 text-center text-sm text-slate-700 lg:order-none lg:flex`}>
          <Info className="h-5 w-5 shrink-0 text-[#4A123F]" aria-hidden="true" />
          <p>{copy.disclaimer}</p>
        </div>

        <section className={`${showSecondaryMobile ? 'flex' : 'hidden'} order-8 mt-5 flex-col gap-5 rounded-3xl bg-gradient-to-r from-[#4A123F] to-[#5F174F] p-5 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-7 lg:order-none lg:flex`}>
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
            href="#cv-business-products-title"
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#4A123F] transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
          >
            {copy.ctaButton} <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </section>
      </main>

      {activePreview === 'free' && (
        <Modal title={copy.previewEssentialTitle} onClose={closePreview} closeLabel={copy.closeModal} size="compact">
          <h2 className="mb-4 text-center text-2xl font-bold text-[#4A123F]">{copy.previewEssentialTitle}</h2>
          <EssentialCardPreview copy={copy} previewText={simplifiedOfferCopy[language as OfferLanguage].essentialPreviewText} />
        </Modal>
      )}

      {activePreview === 'artisan' && (
        <Modal title={simplifiedOfferCopy[language as OfferLanguage].artisanTitle} onClose={closePreview} closeLabel={copy.closeModal} size="preview">
          <h2 className="mb-4 text-center text-2xl font-bold text-[#4A123F]">{simplifiedOfferCopy[language as OfferLanguage].artisanTitle}</h2>
          <BusinessCardPreview
            variant="artisan"
            size="full"
            language={language as OfferLanguage}
            name={copy.demoName}
            category={copy.demoCategory}
          />
        </Modal>
      )}

      {activePreview === 'premium' && (
        <Modal title={simplifiedOfferCopy[language as OfferLanguage].premiumTitle} onClose={closePreview} closeLabel={copy.closeModal} size="preview">
          <h2 className="mb-4 text-center text-2xl font-bold text-[#4A123F]">{simplifiedOfferCopy[language as OfferLanguage].premiumTitle}</h2>
          <BusinessCardPreview
            variant="premium"
            size="full"
            language={language as OfferLanguage}
            name={copy.demoName}
            category={copy.demoCategory}
          />
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
              creationMode={selectedPlan.code === 'artisan' || selectedPlan.code === 'premium'}
              presentationModelLabel={selectedPlan.presentationModelLabel}
              onCancel={closePreview}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
