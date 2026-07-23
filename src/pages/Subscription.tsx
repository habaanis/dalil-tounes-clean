import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Info,
  MapPin,
  Phone,
  Rocket,
  Send,
  X,
} from 'lucide-react';
import { SubscriptionRequestForm } from '../components/SubscriptionRequestForm';
import type { SubscriptionPlanCode } from '../components/SubscriptionRequestForm';
import { BusinessDetail } from '../components/BusinessDetail';
import { useLanguage } from '../context/LanguageContext';

type PreviewType = 'free' | 'artisan' | 'premium' | 'premium-detail' | 'launch' | 'request' | null;

const LOGO_PATH = '/images/logo_dalil_tounes_sceau_luxe.webp';

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
    requestArtisan: 'Demander Artisan',
    requestPremium: 'Demander Premium',
    certifiedTitle: 'Certifié Dalil Tounes',
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
    requestArtisan: 'اطلب حرفي',
    requestPremium: 'اطلب بريميوم',
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
    demoName: 'Fiche Démonstration Dalil Tounes',
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
    requestArtisan: 'Request Artisan',
    requestPremium: 'Request Premium',
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
    requestArtisan: 'Richiedi Artisan',
    requestPremium: 'Richiedi Premium',
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
    requestArtisan: 'Запросить Artisan',
    requestPremium: 'Запросить Premium',
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

function FeatureList({ items, columns = false }: { items: string[]; columns?: boolean }) {
  return (
    <ul className={columns ? 'grid gap-x-6 gap-y-2 sm:grid-cols-2' : 'space-y-2'}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm leading-5 text-slate-700">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Check className="h-3 w-3" aria-hidden="true" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Modal({
  title,
  onClose,
  children,
  closeLabel,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  closeLabel: string;
  wide?: boolean;
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
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl ${wide ? 'max-w-4xl' : 'max-w-xl'}`}
      >
        <div className="sticky top-0 z-20 flex justify-end bg-gradient-to-b from-white via-white/95 to-transparent px-4 pb-2 pt-4">
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
        <div className="px-4 pb-5 sm:px-7 sm:pb-7">{children}</div>
      </div>
    </div>
  );
}

function DemoLogo({ alt }: { alt: string }) {
  return (
    <img
      src={LOGO_PATH}
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

function GreenCardPreview({
  tier,
  copy,
  onDetails,
}: {
  tier: 'ARTISAN' | 'PREMIUM';
  copy: SubscriptionCopy;
  onDetails?: () => void;
}) {
  const tierLabel = tier === 'ARTISAN' ? copy.artisan : copy.premium;

  return (
    <div className="mx-auto max-w-xl rounded-[26px] border-[3px] border-[#D6AF2E] bg-[#07543F] p-5 text-white shadow-2xl sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <DemoLogo alt={copy.demoName} />
        <span className="rounded-full border border-[#D6AF2E]/60 bg-[#D6AF2E]/15 px-3 py-1 text-xs font-bold tracking-widest text-[#F4CE55]">
          {tierLabel}
        </span>
      </div>
      <h3 className="mt-5 text-2xl font-bold text-[#F0C537]">{copy.demoName}</h3>
      <p className="mt-1 font-semibold text-[#F0C537]">{copy.demoCategory}</p>
      <p className="mt-3 flex items-center gap-2 text-emerald-50">
        <MapPin className="h-5 w-5" aria-hidden="true" /> {copy.tunisia}
      </p>
      <p className="mt-4 flex items-center gap-2 font-semibold text-emerald-300">
        <Clock3 className="h-5 w-5" aria-hidden="true" /> {copy.open}
      </p>
      <p className="mt-1 text-emerald-50">{copy.todayCardSchedule}</p>
      <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#D6AF2E] px-5 py-3 font-bold text-[#07543F]">
        <Phone className="h-5 w-5" aria-hidden="true" /> {copy.call}
      </div>
      {tier === 'ARTISAN' && (
        <p className="mt-4 border-t border-[#D6AF2E]/35 pt-4 text-sm leading-6 text-emerald-50">{copy.artisanPreviewText}</p>
      )}
      {tier === 'PREMIUM' && (
        <button
          type="button"
          onClick={onDetails}
          className="mt-4 flex w-full items-center justify-center gap-2 border-t border-[#D6AF2E]/35 pt-4 text-base font-bold text-[#F0C537] transition hover:text-white focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
        >
          {copy.viewDetails} <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function PremiumDetailPreview({ copy }: { copy: SubscriptionCopy }) {
  const demonstrationBusiness = {
    id: 'demo-dalil-tounes-premium',
    nom: copy.demoName,
    name_ar: copy.demoName,
    categorie: copy.demoCategory,
    adresse: `${copy.tunisia}, ${copy.tunisia}`,
    description: copy.premiumDemoDescription,
    description_ar: copy.premiumDemoDescription,
    whatsapp: '+216 XX XXX XXX',
    email: 'contact@dalil-tounes.com',
    site_web: 'https://dalil-tounes.com',
    services: copy.premiumDemoServices,
    sous_categories_texte: copy.premiumDemoServices,
    statut_abonnement: 'premium',
    logo_url: LOGO_PATH,
    image_url: null,
    horaires_ok: copy.demoHours,
    statut_carte: copy.certifiedTitle,
    latitude: 36.8065,
    longitude: 10.1815,
    'lien facebook': 'https://www.facebook.com/daliltounes',
    'Lien Instagram': 'https://www.instagram.com/dalil.tounes/',
    'Lien LinkedIn': 'https://www.linkedin.com/company/daliltounes',
  };

  return <BusinessDetail preview business={demonstrationBusiness} />;
}

function ContinuousPlanCard({
  tier,
  copy,
  intro,
  features,
  onPreview,
  onRequest,
}: {
  tier: 'ARTISAN' | 'PREMIUM';
  copy: SubscriptionCopy;
  intro: string;
  features: string[];
  onPreview: () => void;
  onRequest: () => void;
}) {
  const tierLabel = tier === 'ARTISAN' ? copy.artisan : copy.premium;
  const requestLabel = tier === 'ARTISAN' ? copy.requestArtisan : copy.requestPremium;

  return (
    <article className="relative flex h-full min-h-[350px] flex-col overflow-hidden rounded-3xl border-2 border-[#D6AF2E] bg-[#07543F] p-5 text-white shadow-[0_12px_30px_rgba(7,84,63,0.16)] sm:p-6">
      <span className="absolute right-0 top-0 rounded-bl-2xl bg-[#D6AF2E] px-4 py-2 text-[11px] font-black tracking-[0.16em] text-[#07543F]">
        {tierLabel}
      </span>
      <span className="mb-5 w-fit rounded-full border border-[#D6AF2E]/50 bg-[#D6AF2E]/15 px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-[#F4CE55]">
        {copy.launchBadge}
      </span>
      <h3 className="text-2xl font-bold">{tierLabel}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-emerald-50">{intro}</p>
      <ul className="mt-5 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm leading-5 text-emerald-50">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#F0C537]">
              <Check className="h-3 w-3" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-auto grid gap-2 pt-6 sm:grid-cols-2">
        <button
          type="button"
          onClick={onPreview}
          className="rounded-xl border border-[#D6AF2E] bg-transparent px-4 py-3 text-sm font-bold text-[#F0C537] transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
        >
          {copy.previewCard}
        </button>
        <button
          type="button"
          onClick={onRequest}
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
  const [activePreview, setActivePreview] = useState<PreviewType>(null);
  const [selectedPlan, setSelectedPlan] = useState<{
    code: SubscriptionPlanCode;
    label: string;
  } | null>(null);

  const closePreview = () => setActivePreview(null);
  const openRequest = (code: SubscriptionPlanCode, label: string) => {
    setSelectedPlan({ code, label });
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

        <section aria-label={copy.startingSolutions} className="grid items-stretch gap-5 lg:grid-cols-[0.82fr_1.18fr]">
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

          <article className="flex flex-col rounded-3xl border-2 border-[#D6AF2E] bg-gradient-to-br from-white via-white to-amber-50/80 p-5 shadow-[0_14px_36px_rgba(214,175,46,0.12)] sm:p-7">
            <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-800">
              {copy.humanSupport}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-[#4A123F] sm:text-3xl">{copy.cvTitle}</h2>
            <div className="mt-2 flex items-end gap-2 text-[#07543F]">
              <span className="text-4xl font-black">199</span><span className="pb-1 font-bold">TND</span>
            </div>
            <p className="mt-3 text-sm font-bold text-[#4A123F]">{copy.cvPriceNotice}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2" aria-label={copy.paymentOptions}>
              <span className="rounded-lg bg-[#07543F] px-4 py-2 text-sm font-bold text-white">{copy.payOnce}</span>
              <span className="text-xs text-slate-400">{copy.or}</span>
              <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#4A123F]">{copy.payTwice}</span>
              <span className="text-xs text-slate-400">{copy.or}</span>
              <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#4A123F]">{copy.payThreeTimes}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{copy.cvPublication}</p>
            <div className="my-5 h-px bg-amber-100" />
            <FeatureList items={[...copy.cvFeatures]} columns />
            <button
              type="button"
              onClick={() => openRequest('cv_business', copy.cvPlanLabel)}
              className="mt-6 w-full rounded-xl bg-[#4A123F] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#5B1C4E] focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
            >
              {copy.requestCreation}
            </button>
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

          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_0.82fr]">
            <ContinuousPlanCard
              tier="ARTISAN"
              copy={copy}
              intro={copy.artisanIntro}
              features={[...copy.artisanFeatures]}
              onPreview={() => setActivePreview('artisan')}
              onRequest={() => openRequest('artisan', copy.artisanPlanLabel)}
            />
            <ContinuousPlanCard
              tier="PREMIUM"
              copy={copy}
              intro={copy.premiumIntro}
              features={[...copy.premiumFeatures]}
              onPreview={() => setActivePreview('premium')}
              onRequest={() => openRequest('premium', copy.premiumPlanLabel)}
            />

            <div className="grid content-start gap-4">
              <article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="h-9 w-9 shrink-0 text-amber-500" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-[#4A123F]">{copy.certifiedTitle}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{copy.certifiedText}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{copy.certifiedIndependence}</p>
                  </div>
                </div>
              </article>
              <article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <FileText className="h-8 w-8 shrink-0 text-[#4A123F]" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-[#4A123F]">{copy.flyers}</h3>
                    <p className="mt-1 text-sm text-slate-600">{copy.flyerDescription}</p>
                    <p className="mt-1 text-sm text-slate-600">{copy.flyerProduction}</p>
                    <p className="mt-2 text-xs font-bold text-[#07543F]">{copy.annualPremiumOnly}</p>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <p className="mt-4 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-center text-sm font-semibold text-[#07543F]">
            {copy.trialClarification}
          </p>
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
        <Modal title={copy.previewEssentialTitle} onClose={closePreview} closeLabel={copy.closeModal}>
          <h2 className="mb-5 text-center text-2xl font-bold text-[#4A123F]">{copy.previewEssentialTitle}</h2>
          <EssentialCardPreview copy={copy} />
        </Modal>
      )}

      {activePreview === 'artisan' && (
        <Modal title={copy.previewArtisanTitle} onClose={closePreview} closeLabel={copy.closeModal}>
          <h2 className="mb-5 text-center text-2xl font-bold text-[#4A123F]">{copy.previewArtisanTitle}</h2>
          <GreenCardPreview tier="ARTISAN" copy={copy} />
        </Modal>
      )}

      {activePreview === 'premium' && (
        <Modal title={copy.previewPremiumTitle} onClose={closePreview} closeLabel={copy.closeModal}>
          <h2 className="mb-5 text-center text-2xl font-bold text-[#4A123F]">{copy.previewPremiumTitle}</h2>
          <GreenCardPreview tier="PREMIUM" copy={copy} onDetails={() => setActivePreview('premium-detail')} />
        </Modal>
      )}

      {activePreview === 'premium-detail' && (
        <Modal title={copy.premiumDetailTitle} onClose={closePreview} closeLabel={copy.closeModal} wide>
          <h2 className="mb-5 text-center text-2xl font-bold text-[#4A123F]">{copy.premiumDetailTitle}</h2>
          <PremiumDetailPreview copy={copy} />
        </Modal>
      )}

      {activePreview === 'launch' && (
        <Modal title={copy.launchConditionsDialog} onClose={closePreview} closeLabel={copy.closeModal}>
          <div className="mx-auto max-w-lg">
            <span className="rounded-full bg-[#D6AF2E] px-3 py-1 text-[10px] font-black tracking-[0.14em] text-[#07543F]">{copy.launchBadge}</span>
            <h2 className="mt-4 text-2xl font-bold text-[#4A123F]">{copy.launchConditionsTitle}</h2>
            <ul className="mt-5 space-y-3">
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
        <Modal title={`${copy.requestModal} — ${selectedPlan.label}`} onClose={closePreview} closeLabel={copy.closeModal} wide>
          <div className="mx-auto max-w-[860px]">
            <div className="mb-5 text-center">
              <Send className="mx-auto h-8 w-8 text-[#D6AF2E]" aria-hidden="true" />
              <h2 className="mt-2 text-2xl font-bold text-[#4A123F]">{copy.requestTitle}</h2>
              <p className="mt-1 text-sm text-slate-600">{selectedPlan.label}</p>
            </div>
            <SubscriptionRequestForm
              selectedPlan={selectedPlan.code}
              selectedPlanLabel={selectedPlan.label}
              onCancel={closePreview}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
