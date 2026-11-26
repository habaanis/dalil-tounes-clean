import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  BusinessRegistrationError,
  createRegistrationRequestId,
  resolveCreationModel,
  resolveCreationPalette,
  submitBusinessRegistration,
  type BusinessRegistrationRequest,
  type BusinessRegistrationResponse,
} from '../lib/businessRegistration';
import {
  BUSINESS_SECTORS,
  TUNISIA_GOVERNORATES,
  cleanMultiline,
  cleanSingleLine,
  isValidEmail,
  isValidPhone,
  isValidWebAddress,
  normalizeEmail,
  normalizePhone,
  normalizeWebAddress,
  type SelectOption,
} from '../lib/businessRegistrationValidation';
import { trackMetaEvent } from '../lib/metaPixel';

type SupportedLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';
export type SubscriptionPlanCode = 'cv_business' | 'artisan' | 'premium';
export type CheckoutOffer = 'cv_essential' | 'cv_complete' | 'artisan' | 'premium';
export type BillingPeriod = 'monthly' | 'annual';
type PlanKind = 'cv' | 'artisan' | 'premium';
type Platform = 'tiktok' | 'youtube' | 'linkedin' | 'facebook' | 'instagram' | 'whatsapp_business' | 'google_business' | 'website' | 'other' | 'none';

interface SubscriptionRequestFormProps {
  selectedPlan: SubscriptionPlanCode;
  selectedPlanLabel: string;
  checkoutOffer: CheckoutOffer;
  initialBillingPeriod?: BillingPeriod;
  creationMode?: boolean;
  presentationModelLabel?: string;
  paletteLabel?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const CHECKOUT_COPY: Record<SupportedLanguage, {
  currencyNotice: string;
  installmentsNotice: string;
  paySecurely: string;
  checkoutLoading: string;
  checkoutError: string;
  stripeEquivalent: string;
  monthlyPrice: string;
  annualPrice: string;
}> = {
  fr: {
    currencyNotice: 'Le paiement sécurisé est effectué en euros selon l’équivalent indiqué. Des frais de conversion peuvent éventuellement être appliqués par ta banque.',
    installmentsNotice: 'Le paiement en trois fois reste possible après échange avec notre équipe.',
    paySecurely: 'Payer maintenant', checkoutLoading: 'Ouverture du paiement…', checkoutError: 'Le paiement sécurisé ne peut pas être ouvert pour le moment. Réessaie ou contacte notre équipe.', stripeEquivalent: 'Paiement sécurisé Stripe', monthlyPrice: 'Prix mensuel', annualPrice: 'Prix annuel',
  },
  ar: {
    currencyNotice: 'يتم الدفع الآمن باليورو وفق القيمة المعادلة الموضحة. قد يطبق بنكك رسوم تحويل إضافية.',
    installmentsNotice: 'يبقى الدفع على ثلاث دفعات ممكنًا بعد التواصل مع فريقنا.',
    paySecurely: 'الدفع الآن', checkoutLoading: 'جارٍ فتح الدفع…', checkoutError: 'تعذر فتح الدفع الآمن حاليًا. حاول مجددًا أو تواصل مع فريقنا.', stripeEquivalent: 'دفع آمن عبر Stripe', monthlyPrice: 'السعر الشهري', annualPrice: 'السعر السنوي',
  },
  en: {
    currencyNotice: 'Secure payment is made in euros at the equivalent amount shown. Your bank may apply currency conversion fees.',
    installmentsNotice: 'Payment in three instalments remains available after speaking with our team.',
    paySecurely: 'Pay now', checkoutLoading: 'Opening payment…', checkoutError: 'Secure payment cannot be opened right now. Try again or contact our team.', stripeEquivalent: 'Secure Stripe payment', monthlyPrice: 'Monthly price', annualPrice: 'Annual price',
  },
  it: {
    currencyNotice: 'Il pagamento sicuro viene effettuato in euro secondo l’equivalente indicato. La tua banca potrebbe applicare commissioni di conversione.',
    installmentsNotice: 'Il pagamento in tre rate resta possibile dopo aver parlato con il nostro team.',
    paySecurely: 'Paga ora', checkoutLoading: 'Apertura del pagamento…', checkoutError: 'Al momento non è possibile aprire il pagamento sicuro. Riprova o contatta il nostro team.', stripeEquivalent: 'Pagamento sicuro Stripe', monthlyPrice: 'Prezzo mensile', annualPrice: 'Prezzo annuale',
  },
  ru: {
    currencyNotice: 'Безопасная оплата производится в евро по указанному эквиваленту. Ваш банк может взимать комиссию за конвертацию.',
    installmentsNotice: 'Оплата тремя частями доступна после согласования с нашей командой.',
    paySecurely: 'Оплатить сейчас', checkoutLoading: 'Переход к оплате…', checkoutError: 'Сейчас не удаётся открыть безопасную оплату. Повторите попытку или свяжитесь с нашей командой.', stripeEquivalent: 'Безопасная оплата Stripe', monthlyPrice: 'Цена за месяц', annualPrice: 'Цена за год',
  },
};

const CHECKOUT_AMOUNTS = {
  cv_essential: { oneTime: '23 €' },
  cv_complete: { oneTime: '59 €' },
  artisan: { monthly: { tnd: '30', eur: '8,90 €' }, annual: { tnd: '299', eur: '89 €' } },
  premium: { monthly: { tnd: '59', eur: '17,90 €' }, annual: { tnd: '595', eur: '175 €' } },
} as const;

interface SubscriptionFormState {
  companyName: string;
  managerName: string;
  sector: string;
  governorate: string;
  city: string;
  phone: string;
  email: string;
  selectedPlatforms: Platform[];
  website: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  requestedBillingPeriod: '' | 'monthly' | 'annual' | 'advice';
  requestedPaymentSchedule:
    | ''
    | 'one_payment'
    | 'two_installments'
    | 'three_installments'
    | 'advice';
  preferredContactMethod: '' | 'whatsapp' | 'phone' | 'email';
  preferredContactTime: '' | 'morning' | 'afternoon' | 'evening' | 'anytime';
  message: string;
  activityDescription: string;
  assistance: 'self' | 'assisted';
  address: string;
  openingHours: string;
  googleMapsUrl: string;
  googleReviewsUrl: string;
  logoUrl: string;
  logoChoice: 'existing' | 'create' | 'none';
  openingStyle: 'photo' | 'framed';
  photoUrls: string;
  productsDescription: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
  otherPlatformUrl: string;
  preferredContactMethods: Array<'whatsapp' | 'phone' | 'email'>;
  preferredContactTimes: Array<'morning' | 'afternoon' | 'evening' | 'anytime'>;
  consent: boolean;
  verificationField: string;
}

interface FormCopy {
  honeypotLabel: string;
  stepOne: string;
  stepTwo: string;
  activityTitle: string;
  requestTitle: string;
  companyName: string;
  managerName: string;
  sector: string;
  governorate: string;
  city: string;
  phone: string;
  emailOptional: string;
  choose: string;
  selectedSolution: string;
  cvPaymentQuestion: string;
  cvSingle: string;
  cvTwo: string;
  cvThree: string;
  advice: string;
  durationQuestion: string;
  monthly: string;
  annual: string;
  annualPaymentQuestion: string;
  singlePayment: string;
  threePayments: string;
  premiumFlyerInfo: string;
  platformsQuestion: string;
  platformLabels: Record<Platform, string>;
  linksSummary: string;
  linksHint: string;
  website: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  contactMethod: string;
  contactWhatsApp: string;
  contactPhone: string;
  contactEmail: string;
  contactTime: string;
  morning: string;
  afternoon: string;
  evening: string;
  anyTime: string;
  messageOptional: string;
  messagePlaceholder: string;
  consentPrefix: string;
  terms: string;
  conjunction: string;
  privacy: string;
  freeNotice: string;
  continue: string;
  back: string;
  cancel: string;
  submit: string;
  submitting: string;
  success: string;
  requiredCompanyName: string;
  requiredManagerName: string;
  requiredSector: string;
  requiredGovernorate: string;
  requiredCity: string;
  requiredPhone: string;
  invalidPhone: string;
  invalidEmail: string;
  requiredPlanChoice: string;
  requiredPaymentSchedule: string;
  requiredContactMethod: string;
  requiredContactTime: string;
  emailNeeded: string;
  requiredConsent: string;
  invalidWebsite: string;
  invalidFacebook: string;
  invalidInstagram: string;
  invalidWhatsapp: string;
  networkError: string;
  timeoutError: string;
  serverError: string;
  formError: string;
}

const COPY: Record<SupportedLanguage, FormCopy> = {
  fr: {
    honeypotLabel: 'Ne remplissez pas ce champ',
    stepOne: 'Étape 1 sur 2',
    stepTwo: 'Étape 2 sur 2',
    activityTitle: 'Votre activité',
    requestTitle: 'Votre demande',
    companyName: 'Nom de l’activité',
    managerName: 'Nom et prénom du responsable',
    sector: 'Métier ou catégorie',
    governorate: 'Gouvernorat',
    city: 'Ville',
    phone: 'Téléphone ou WhatsApp',
    emailOptional: 'Email — facultatif',
    choose: 'Sélectionner',
    selectedSolution: 'Solution sélectionnée',
    cvPaymentQuestion: 'Comment souhaitez-vous payer ?',
    cvSingle: '199 TND en une fois',
    cvTwo: '100 TND puis 99 TND',
    cvThree: '67 TND puis 66 TND puis 66 TND',
    advice: 'Je souhaite d’abord être conseillé',
    durationQuestion: 'Quelle durée vous intéresse ?',
    monthly: 'Mensuel',
    annual: 'Annuel',
    annualPaymentQuestion: 'Mode de paiement souhaité',
    singlePayment: 'En une fois',
    threePayments: 'En trois fois',
    premiumFlyerInfo: '500 flyers sont inclus après le paiement complet et la validation du modèle.',
    platformsQuestion: 'Quelles plateformes utilisez-vous déjà ? — facultatif',
    platformLabels: {
      tiktok: 'TikTok',
      youtube: 'YouTube',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
      instagram: 'Instagram',
      whatsapp_business: 'WhatsApp Business',
      google_business: 'Google Business',
      website: 'Site Internet',
      other: 'Autre',
      none: 'Aucune pour le moment',
    },
    linksSummary: 'Ajouter mes liens maintenant — facultatif',
    linksHint: 'Vous pourrez également les transmettre plus tard.',
    website: 'Site Internet',
    facebook: 'Facebook',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    contactMethod: 'Comment préférez-vous être contacté ?',
    contactWhatsApp: 'WhatsApp',
    contactPhone: 'Téléphone',
    contactEmail: 'Email',
    contactTime: 'Moment préférable',
    morning: 'Matin',
    afternoon: 'Après-midi',
    evening: 'Soir',
    anyTime: 'Peu importe',
    messageOptional: 'Une précision à nous donner ? — facultatif',
    messagePlaceholder: 'Par exemple : je débute mon activité, j’ai déjà une page Facebook ou je souhaite mieux présenter mes services.',
    consentPrefix: 'J’accepte que Dalil Tounes utilise ces informations pour traiter ma demande et me contacter. J’ai lu les',
    terms: 'conditions générales',
    conjunction: 'et la',
    privacy: 'politique de confidentialité',
    freeNotice: 'Cette demande est gratuite et ne vous engage à aucun paiement.',
    continue: 'Continuer',
    back: 'Retour',
    cancel: 'Annuler',
    submit: 'Envoyer ma demande',
    submitting: 'Envoi en cours...',
    success: 'Votre demande a bien été envoyée.',
    requiredCompanyName: 'Indiquez le nom de votre activité.',
    requiredManagerName: 'Indiquez le nom et le prénom du responsable.',
    requiredSector: 'Sélectionnez un métier ou une catégorie.',
    requiredGovernorate: 'Sélectionnez un gouvernorat.',
    requiredCity: 'Indiquez la ville.',
    requiredPhone: 'Indiquez un numéro de téléphone ou WhatsApp.',
    invalidPhone: 'Le numéro de téléphone semble incorrect.',
    invalidEmail: 'Le format de l’email est incorrect.',
    requiredPlanChoice: 'Sélectionnez une durée ou demandez à être conseillé.',
    requiredPaymentSchedule: 'Sélectionnez un mode de paiement.',
    requiredContactMethod: 'Sélectionnez un moyen de contact.',
    requiredContactTime: 'Sélectionnez un moment de contact.',
    emailNeeded: 'Indiquez un email pour être contacté par email.',
    requiredConsent: 'Votre consentement est nécessaire pour envoyer la demande.',
    invalidWebsite: 'Le site Internet semble incorrect.',
    invalidFacebook: 'Le lien Facebook semble incorrect.',
    invalidInstagram: 'Le lien Instagram semble incorrect.',
    invalidWhatsapp: 'Le numéro WhatsApp semble incorrect.',
    networkError: 'La connexion a été interrompue. Vérifiez Internet puis réessayez.',
    timeoutError: 'L’envoi prend trop de temps. Veuillez réessayer.',
    serverError: 'La demande n’a pas pu être envoyée. Veuillez réessayer dans quelques instants.',
    formError: 'Vérifiez les informations indiquées puis réessayez.',
  },
  ar: {
    honeypotLabel: 'لا تملأ هذا الحقل',
    stepOne: 'الخطوة 1 من 2',
    stepTwo: 'الخطوة 2 من 2',
    activityTitle: 'نشاطك',
    requestTitle: 'طلبك',
    companyName: 'اسم النشاط',
    managerName: 'اسم ولقب المسؤول',
    sector: 'المهنة أو الفئة',
    governorate: 'الولاية',
    city: 'المدينة',
    phone: 'الهاتف أو واتساب',
    emailOptional: 'البريد الإلكتروني — اختياري',
    choose: 'اختر',
    selectedSolution: 'الخدمة المختارة',
    cvPaymentQuestion: 'كيف ترغب في الدفع؟',
    cvSingle: '199 د.ت دفعة واحدة',
    cvTwo: '100 د.ت ثم 99 د.ت',
    cvThree: '67 د.ت ثم 66 د.ت ثم 66 د.ت',
    advice: 'أرغب أولاً في الحصول على استشارة',
    durationQuestion: 'ما المدة التي تهمك؟',
    monthly: 'شهري',
    annual: 'سنوي',
    annualPaymentQuestion: 'طريقة الدفع المطلوبة',
    singlePayment: 'دفعة واحدة',
    threePayments: 'ثلاث دفعات',
    premiumFlyerInfo: 'يشمل العرض 500 منشور إعلاني بعد اكتمال الدفع والمصادقة على النموذج.',
    platformsQuestion: 'ما المنصات التي تستخدمها حالياً؟ — اختياري',
    platformLabels: {
      tiktok: 'TikTok',
      youtube: 'YouTube',
      linkedin: 'LinkedIn',
      facebook: 'فيسبوك',
      instagram: 'إنستغرام',
      whatsapp_business: 'واتساب للأعمال',
      google_business: 'Google Business',
      website: 'موقع إلكتروني',
      other: 'أخرى',
      none: 'لا أستخدم أي منصة حالياً',
    },
    linksSummary: 'إضافة روابطي الآن — اختياري',
    linksHint: 'يمكنك أيضاً إرسالها لاحقاً.',
    website: 'الموقع الإلكتروني',
    facebook: 'فيسبوك',
    instagram: 'إنستغرام',
    whatsapp: 'واتساب',
    contactMethod: 'كيف تفضل أن نتصل بك؟',
    contactWhatsApp: 'واتساب',
    contactPhone: 'الهاتف',
    contactEmail: 'البريد الإلكتروني',
    contactTime: 'الوقت المفضل',
    morning: 'صباحاً',
    afternoon: 'بعد الظهر',
    evening: 'مساءً',
    anyTime: 'لا فرق',
    messageOptional: 'هل لديك توضيح إضافي؟ — اختياري',
    messagePlaceholder: 'مثال: بدأت نشاطي حديثاً، لدي صفحة فيسبوك أو أريد تقديم خدماتي بشكل أفضل.',
    consentPrefix: 'أوافق على استخدام دليل تونس لهذه المعلومات لمعالجة طلبي والاتصال بي. قرأت',
    terms: 'الشروط العامة',
    conjunction: 'و',
    privacy: 'سياسة الخصوصية',
    freeNotice: 'هذا الطلب مجاني ولا يلزمك بأي دفع.',
    continue: 'متابعة',
    back: 'رجوع',
    cancel: 'إلغاء',
    submit: 'إرسال طلبي',
    submitting: 'جارٍ الإرسال...',
    success: 'تم إرسال طلبك بنجاح.',
    requiredCompanyName: 'أدخل اسم النشاط.',
    requiredManagerName: 'أدخل اسم ولقب المسؤول.',
    requiredSector: 'اختر المهنة أو الفئة.',
    requiredGovernorate: 'اختر الولاية.',
    requiredCity: 'أدخل المدينة.',
    requiredPhone: 'أدخل رقم هاتف أو واتساب.',
    invalidPhone: 'رقم الهاتف غير صحيح.',
    invalidEmail: 'صيغة البريد الإلكتروني غير صحيحة.',
    requiredPlanChoice: 'اختر المدة أو اطلب استشارة.',
    requiredPaymentSchedule: 'اختر طريقة الدفع.',
    requiredContactMethod: 'اختر وسيلة الاتصال.',
    requiredContactTime: 'اختر وقت الاتصال.',
    emailNeeded: 'أدخل بريداً إلكترونياً ليتم الاتصال بك عبر البريد.',
    requiredConsent: 'الموافقة ضرورية لإرسال الطلب.',
    invalidWebsite: 'رابط الموقع الإلكتروني غير صحيح.',
    invalidFacebook: 'رابط فيسبوك غير صحيح.',
    invalidInstagram: 'رابط إنستغرام غير صحيح.',
    invalidWhatsapp: 'رقم واتساب غير صحيح.',
    networkError: 'انقطع الاتصال. تحقق من الإنترنت ثم أعد المحاولة.',
    timeoutError: 'استغرق الإرسال وقتاً طويلاً. أعد المحاولة.',
    serverError: 'تعذر إرسال الطلب. أعد المحاولة بعد قليل.',
    formError: 'تحقق من المعلومات ثم أعد المحاولة.',
  },
  en: {
    honeypotLabel: 'Do not fill in this field',
    stepOne: 'Step 1 of 2',
    stepTwo: 'Step 2 of 2',
    activityTitle: 'Your business',
    requestTitle: 'Your request',
    companyName: 'Business name',
    managerName: 'Manager’s first and last name',
    sector: 'Trade or category',
    governorate: 'Governorate',
    city: 'City',
    phone: 'Phone or WhatsApp',
    emailOptional: 'Email — optional',
    choose: 'Select',
    selectedSolution: 'Selected solution',
    cvPaymentQuestion: 'How would you like to pay?',
    cvSingle: '199 TND in one payment',
    cvTwo: '100 TND then 99 TND',
    cvThree: '67 TND then 66 TND then 66 TND',
    advice: 'I would like advice first',
    durationQuestion: 'Which duration interests you?',
    monthly: 'Monthly',
    annual: 'Annual',
    annualPaymentQuestion: 'Preferred payment method',
    singlePayment: 'One payment',
    threePayments: 'Three payments',
    premiumFlyerInfo: '500 flyers are included after full payment and approval of the design.',
    platformsQuestion: 'Which platforms do you already use? — optional',
    platformLabels: {
      tiktok: 'TikTok',
      youtube: 'YouTube',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
      instagram: 'Instagram',
      whatsapp_business: 'WhatsApp Business',
      google_business: 'Google Business',
      website: 'Website',
      other: 'Other',
      none: 'None at the moment',
    },
    linksSummary: 'Add my links now — optional',
    linksHint: 'You can also send them later.',
    website: 'Website',
    facebook: 'Facebook',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    contactMethod: 'How would you prefer to be contacted?',
    contactWhatsApp: 'WhatsApp',
    contactPhone: 'Phone',
    contactEmail: 'Email',
    contactTime: 'Preferred time',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    anyTime: 'Any time',
    messageOptional: 'Anything else you would like to tell us? — optional',
    messagePlaceholder: 'For example: I am starting my business, I already have a Facebook page, or I want to present my services more clearly.',
    consentPrefix: 'I agree that Dalil Tounes may use this information to process my request and contact me. I have read the',
    terms: 'terms and conditions',
    conjunction: 'and the',
    privacy: 'privacy policy',
    freeNotice: 'This request is free and does not commit you to any payment.',
    continue: 'Continue',
    back: 'Back',
    cancel: 'Cancel',
    submit: 'Send my request',
    submitting: 'Sending...',
    success: 'Your request has been sent.',
    requiredCompanyName: 'Enter your business name.',
    requiredManagerName: 'Enter the manager’s first and last name.',
    requiredSector: 'Select a trade or category.',
    requiredGovernorate: 'Select a governorate.',
    requiredCity: 'Enter the city.',
    requiredPhone: 'Enter a phone or WhatsApp number.',
    invalidPhone: 'The phone number appears to be invalid.',
    invalidEmail: 'The email format is invalid.',
    requiredPlanChoice: 'Select a duration or request advice.',
    requiredPaymentSchedule: 'Select a payment method.',
    requiredContactMethod: 'Select a contact method.',
    requiredContactTime: 'Select a contact time.',
    emailNeeded: 'Enter an email address to be contacted by email.',
    requiredConsent: 'Your consent is required to send the request.',
    invalidWebsite: 'The website address appears to be invalid.',
    invalidFacebook: 'The Facebook link appears to be invalid.',
    invalidInstagram: 'The Instagram link appears to be invalid.',
    invalidWhatsapp: 'The WhatsApp number appears to be invalid.',
    networkError: 'The connection was interrupted. Check your Internet connection and try again.',
    timeoutError: 'Sending is taking too long. Please try again.',
    serverError: 'The request could not be sent. Please try again in a few moments.',
    formError: 'Check the information and try again.',
  },
  it: {
    honeypotLabel: 'Non compilare questo campo',
    stepOne: 'Passaggio 1 di 2',
    stepTwo: 'Passaggio 2 di 2',
    activityTitle: 'La tua attività',
    requestTitle: 'La tua richiesta',
    companyName: 'Nome dell’attività',
    managerName: 'Nome e cognome del responsabile',
    sector: 'Professione o categoria',
    governorate: 'Governatorato',
    city: 'Città',
    phone: 'Telefono o WhatsApp',
    emailOptional: 'Email — facoltativa',
    choose: 'Seleziona',
    selectedSolution: 'Soluzione selezionata',
    cvPaymentQuestion: 'Come desideri pagare?',
    cvSingle: '199 TND in un’unica soluzione',
    cvTwo: '100 TND poi 99 TND',
    cvThree: '67 TND poi 66 TND poi 66 TND',
    advice: 'Desidero prima una consulenza',
    durationQuestion: 'Quale durata ti interessa?',
    monthly: 'Mensile',
    annual: 'Annuale',
    annualPaymentQuestion: 'Modalità di pagamento desiderata',
    singlePayment: 'In un’unica soluzione',
    threePayments: 'In tre rate',
    premiumFlyerInfo: '500 volantini sono inclusi dopo il pagamento completo e l’approvazione del modello.',
    platformsQuestion: 'Quali piattaforme utilizzi già? — facoltativo',
    platformLabels: {
      tiktok: 'TikTok',
      youtube: 'YouTube',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
      instagram: 'Instagram',
      whatsapp_business: 'WhatsApp Business',
      google_business: 'Google Business',
      website: 'Sito Internet',
      other: 'Altro',
      none: 'Nessuna al momento',
    },
    linksSummary: 'Aggiungi ora i miei link — facoltativo',
    linksHint: 'Potrai anche inviarli in seguito.',
    website: 'Sito Internet',
    facebook: 'Facebook',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    contactMethod: 'Come preferisci essere contattato?',
    contactWhatsApp: 'WhatsApp',
    contactPhone: 'Telefono',
    contactEmail: 'Email',
    contactTime: 'Momento preferito',
    morning: 'Mattina',
    afternoon: 'Pomeriggio',
    evening: 'Sera',
    anyTime: 'Indifferente',
    messageOptional: 'Vuoi aggiungere una precisazione? — facoltativo',
    messagePlaceholder: 'Ad esempio: sto avviando la mia attività, ho già una pagina Facebook o desidero presentare meglio i miei servizi.',
    consentPrefix: 'Accetto che Dalil Tounes utilizzi queste informazioni per elaborare la mia richiesta e contattarmi. Ho letto i',
    terms: 'termini e condizioni',
    conjunction: 'e la',
    privacy: 'politica sulla privacy',
    freeNotice: 'Questa richiesta è gratuita e non comporta alcun obbligo di pagamento.',
    continue: 'Continua',
    back: 'Indietro',
    cancel: 'Annulla',
    submit: 'Invia la mia richiesta',
    submitting: 'Invio in corso...',
    success: 'La tua richiesta è stata inviata.',
    requiredCompanyName: 'Inserisci il nome dell’attività.',
    requiredManagerName: 'Inserisci nome e cognome del responsabile.',
    requiredSector: 'Seleziona una professione o categoria.',
    requiredGovernorate: 'Seleziona un governatorato.',
    requiredCity: 'Inserisci la città.',
    requiredPhone: 'Inserisci un numero di telefono o WhatsApp.',
    invalidPhone: 'Il numero di telefono non sembra corretto.',
    invalidEmail: 'Il formato dell’email non è corretto.',
    requiredPlanChoice: 'Seleziona una durata o richiedi una consulenza.',
    requiredPaymentSchedule: 'Seleziona una modalità di pagamento.',
    requiredContactMethod: 'Seleziona un metodo di contatto.',
    requiredContactTime: 'Seleziona un momento di contatto.',
    emailNeeded: 'Inserisci un’email per essere contattato via email.',
    requiredConsent: 'Il consenso è necessario per inviare la richiesta.',
    invalidWebsite: 'L’indirizzo del sito non sembra corretto.',
    invalidFacebook: 'Il link Facebook non sembra corretto.',
    invalidInstagram: 'Il link Instagram non sembra corretto.',
    invalidWhatsapp: 'Il numero WhatsApp non sembra corretto.',
    networkError: 'La connessione è stata interrotta. Controlla Internet e riprova.',
    timeoutError: 'L’invio sta impiegando troppo tempo. Riprova.',
    serverError: 'Impossibile inviare la richiesta. Riprova tra qualche istante.',
    formError: 'Controlla le informazioni e riprova.',
  },
  ru: {
    honeypotLabel: 'Не заполняйте это поле',
    stepOne: 'Шаг 1 из 2',
    stepTwo: 'Шаг 2 из 2',
    activityTitle: 'Ваша деятельность',
    requestTitle: 'Ваш запрос',
    companyName: 'Название деятельности',
    managerName: 'Имя и фамилия ответственного лица',
    sector: 'Профессия или категория',
    governorate: 'Губернаторство',
    city: 'Город',
    phone: 'Телефон или WhatsApp',
    emailOptional: 'Email — необязательно',
    choose: 'Выбрать',
    selectedSolution: 'Выбранное решение',
    cvPaymentQuestion: 'Как вы хотите оплатить?',
    cvSingle: '199 TND одним платежом',
    cvTwo: '100 TND, затем 99 TND',
    cvThree: '67 TND, затем 66 TND и 66 TND',
    advice: 'Сначала я хочу получить консультацию',
    durationQuestion: 'Какой срок вас интересует?',
    monthly: 'Ежемесячно',
    annual: 'Ежегодно',
    annualPaymentQuestion: 'Предпочтительный способ оплаты',
    singlePayment: 'Одним платежом',
    threePayments: 'Тремя платежами',
    premiumFlyerInfo: '500 флаеров включены после полной оплаты и утверждения макета.',
    platformsQuestion: 'Какие платформы вы уже используете? — необязательно',
    platformLabels: {
      tiktok: 'TikTok',
      youtube: 'YouTube',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
      instagram: 'Instagram',
      whatsapp_business: 'WhatsApp Business',
      google_business: 'Google Business',
      website: 'Веб-сайт',
      other: 'Другое',
      none: 'Пока ни одной',
    },
    linksSummary: 'Добавить ссылки сейчас — необязательно',
    linksHint: 'Вы также сможете отправить их позже.',
    website: 'Веб-сайт',
    facebook: 'Facebook',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    contactMethod: 'Как с вами лучше связаться?',
    contactWhatsApp: 'WhatsApp',
    contactPhone: 'Телефон',
    contactEmail: 'Email',
    contactTime: 'Предпочтительное время',
    morning: 'Утро',
    afternoon: 'День',
    evening: 'Вечер',
    anyTime: 'Не имеет значения',
    messageOptional: 'Хотите что-то уточнить? — необязательно',
    messagePlaceholder: 'Например: я начинаю свою деятельность, у меня уже есть страница Facebook или я хочу лучше представить свои услуги.',
    consentPrefix: 'Я разрешаю Dalil Tounes использовать эту информацию для обработки запроса и связи со мной. Я прочитал(а)',
    terms: 'условия использования',
    conjunction: 'и',
    privacy: 'политику конфиденциальности',
    freeNotice: 'Этот запрос бесплатный и не обязывает вас производить оплату.',
    continue: 'Продолжить',
    back: 'Назад',
    cancel: 'Отмена',
    submit: 'Отправить запрос',
    submitting: 'Отправка...',
    success: 'Ваш запрос отправлен.',
    requiredCompanyName: 'Укажите название деятельности.',
    requiredManagerName: 'Укажите имя и фамилию ответственного лица.',
    requiredSector: 'Выберите профессию или категорию.',
    requiredGovernorate: 'Выберите губернаторство.',
    requiredCity: 'Укажите город.',
    requiredPhone: 'Укажите номер телефона или WhatsApp.',
    invalidPhone: 'Номер телефона указан неверно.',
    invalidEmail: 'Формат email указан неверно.',
    requiredPlanChoice: 'Выберите срок или запросите консультацию.',
    requiredPaymentSchedule: 'Выберите способ оплаты.',
    requiredContactMethod: 'Выберите способ связи.',
    requiredContactTime: 'Выберите время для связи.',
    emailNeeded: 'Укажите email, чтобы с вами можно было связаться по электронной почте.',
    requiredConsent: 'Для отправки запроса необходимо согласие.',
    invalidWebsite: 'Адрес сайта указан неверно.',
    invalidFacebook: 'Ссылка Facebook указана неверно.',
    invalidInstagram: 'Ссылка Instagram указана неверно.',
    invalidWhatsapp: 'Номер WhatsApp указан неверно.',
    networkError: 'Соединение прервано. Проверьте Интернет и повторите попытку.',
    timeoutError: 'Отправка занимает слишком много времени. Повторите попытку.',
    serverError: 'Не удалось отправить запрос. Повторите попытку через несколько минут.',
    formError: 'Проверьте введённые данные и повторите попытку.',
  },
};

const INITIAL_STATE: SubscriptionFormState = {
  companyName: '',
  managerName: '',
  sector: '',
  governorate: '',
  city: '',
  phone: '',
  email: '',
  selectedPlatforms: [],
  website: '',
  facebook: '',
  instagram: '',
  whatsapp: '',
  requestedBillingPeriod: '',
  requestedPaymentSchedule: '',
  preferredContactMethod: '',
  preferredContactTime: '',
  message: '',
  activityDescription: '',
  assistance: 'self',
  address: '',
  openingHours: '',
  googleMapsUrl: '',
  googleReviewsUrl: '',
  logoUrl: '',
  logoChoice: 'none',
  openingStyle: 'photo',
  photoUrls: '',
  productsDescription: '',
  tiktok: '',
  youtube: '',
  linkedin: '',
  otherPlatformUrl: '',
  preferredContactMethods: [],
  preferredContactTimes: [],
  consent: false,
  verificationField: '',
};

const PLATFORMS: Platform[] = [
  'facebook',
  'instagram',
  'tiktok',
  'youtube',
  'linkedin',
  'whatsapp_business',
  'google_business',
  'website',
  'other',
  'none',
];

const inputClassName =
  'w-full rounded-xl border border-[#D4AF37]/70 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#292725] focus:ring-2 focus:ring-[#292725]/20 disabled:bg-gray-50 disabled:text-gray-500';

const RECEIPT_COPY: Record<SupportedLanguage, { saved: string; reference: string; pending: string; rateLimited: string; rejected: string; conflict: string }> = {
  fr: { saved: 'Votre demande a bien été enregistrée.', reference: 'Référence', pending: 'Votre dossier est conservé. Notre équipe pourra reprendre sa transmission sans vous demander de le renvoyer.', rateLimited: 'Plusieurs demandes ont été envoyées récemment. Attendez quelques minutes avant de réessayer.', rejected: 'Cette demande n’a pas été enregistrée. Vérifiez le formulaire puis réessayez.', conflict: 'Cette tentative correspond déjà à un dossier différent. Fermez puis rouvrez le formulaire pour envoyer une nouvelle demande.' },
  ar: { saved: 'تم تسجيل طلبك بنجاح.', reference: 'المرجع', pending: 'تم حفظ ملفك. يمكن لفريقنا متابعة إرساله دون الحاجة إلى إعادة تقديمه.', rateLimited: 'تم إرسال عدة طلبات مؤخراً. انتظر بضع دقائق ثم أعد المحاولة.', rejected: 'لم يتم تسجيل الطلب. تحقق من الاستمارة ثم أعد المحاولة.', conflict: 'هذه المحاولة مرتبطة بملف مختلف. أغلق الاستمارة وافتحها مجدداً لتقديم طلب جديد.' },
  en: { saved: 'Your request has been saved.', reference: 'Reference', pending: 'Your dossier is saved. Our team can resume its delivery without asking you to submit it again.', rateLimited: 'Several requests were sent recently. Wait a few minutes before trying again.', rejected: 'This request was not saved. Check the form and try again.', conflict: 'This attempt already belongs to a different dossier. Close and reopen the form to submit a new request.' },
  it: { saved: 'La tua richiesta è stata registrata.', reference: 'Riferimento', pending: 'Il tuo dossier è stato salvato. Il nostro team può riprenderne la trasmissione senza chiederti di inviarlo di nuovo.', rateLimited: 'Sono state inviate diverse richieste di recente. Attendi qualche minuto prima di riprovare.', rejected: 'La richiesta non è stata registrata. Controlla il modulo e riprova.', conflict: 'Questo tentativo corrisponde già a un dossier diverso. Chiudi e riapri il modulo per inviare una nuova richiesta.' },
  ru: { saved: 'Ваш запрос сохранён.', reference: 'Номер заявки', pending: 'Ваше досье сохранено. Команда сможет продолжить его передачу без повторной отправки с вашей стороны.', rateLimited: 'Недавно было отправлено несколько запросов. Подождите несколько минут и повторите попытку.', rejected: 'Запрос не сохранён. Проверьте форму и повторите попытку.', conflict: 'Эта попытка уже относится к другому досье. Закройте и снова откройте форму для новой заявки.' },
};

export function SubscriptionRequestForm({
  selectedPlan,
  selectedPlanLabel,
  checkoutOffer,
  initialBillingPeriod,
  creationMode = false,
  presentationModelLabel,
  paletteLabel,
  onCancel,
  onSuccess,
}: SubscriptionRequestFormProps) {
  const { language } = useLanguage();
  const currentLanguage = isSupportedLanguage(language) ? language : 'fr';
  const copy = COPY[currentLanguage];
  const checkoutCopy = CHECKOUT_COPY[currentLanguage];
  const isArabic = currentLanguage === 'ar';
  const planKind = getPlanKind(selectedPlan);
  const premiumCreation = creationMode && planKind === 'premium';
  const maxPhotos = premiumCreation ? 10 : 5;
  const startedAtRef = useRef(Date.now());
  const requestIdRef = useRef(createRequestId());
  const submittingRef = useRef(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<SubscriptionFormState>(() => ({
    ...INITIAL_STATE,
    requestedBillingPeriod: initialBillingPeriod ?? '',
    requestedPaymentSchedule: initialBillingPeriod === 'annual' ? 'one_payment' : '',
  }));
  const [artisanModel, setArtisanModel] = useState(presentationModelLabel ?? '');
  const [artisanPalette, setArtisanPalette] = useState(paletteLabel ?? '');
  const [weeklyHours, setWeeklyHours] = useState(() => ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'].map(day => ({ day, status: '', start: '09:00', end: '18:00', split: false, secondStart: '14:00', secondEnd: '18:00' })));
  const updateHours = (index: number, patch: Partial<(typeof weeklyHours)[number]>) => {
    const next = weeklyHours.map((day, i) => i === index ? { ...day, ...patch } : day);
    setWeeklyHours(next);
    setForm(current => ({ ...current, openingHours: next.filter(day => day.status).map(day => day.day + ' : ' + (day.status === 'closed' ? 'Fermé' : day.start + '–' + day.end + (day.split ? ' / ' + day.secondStart + '–' + day.secondEnd : ''))).join('\n') }));
    setErrorMessage('');
  };
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [receipt, setReceipt] = useState<BusinessRegistrationResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [openingCheckout, setOpeningCheckout] = useState(false);

  useEffect(() => {
    if (!errorMessage && !submitted) return;
    feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    feedbackRef.current?.focus({ preventScroll: true });
  }, [errorMessage, submitted]);

  const setField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));
    setErrorMessage('');
  };

  const setBillingPeriod = (value: SubscriptionFormState['requestedBillingPeriod']) => {
    setForm((current) => ({
      ...current,
      requestedBillingPeriod: value,
      requestedPaymentSchedule: value === 'annual' ? current.requestedPaymentSchedule : '',
    }));
    setErrorMessage('');
  };

  const togglePlatform = (platform: Platform) => {
    setForm(current => {
      const linkFields = { facebook: 'facebook', instagram: 'instagram', tiktok: 'tiktok', youtube: 'youtube', linkedin: 'linkedin', website: 'website', other: 'otherPlatformUrl', whatsapp_business: 'whatsapp' } as const;
      if (platform === 'none') return { ...current, selectedPlatforms: current.selectedPlatforms.includes('none') ? [] : ['none'], ...(creationMode ? {facebook:'',instagram:'',tiktok:'',youtube:'',linkedin:'',website:'',otherPlatformUrl:'',whatsapp:''} : {}) };
      const withoutNone = current.selectedPlatforms.filter(item => item !== 'none');
      const removing = withoutNone.includes(platform);
      const field = linkFields[platform as keyof typeof linkFields];
      return { ...current, ...(creationMode && removing && field ? {[field]: ''} : {}), selectedPlatforms: removing ? withoutNone.filter(item => item !== platform) : [...withoutNone, platform] };
    });
    setErrorMessage('');
  };

  const validateStepOne = (): string | null => {
    if (creationMode && !premiumCreation && (!artisanModel || !artisanPalette)) return isArabic ? 'اختر النموذج والألوان.' : 'Choisissez votre modèle et votre palette.';
    if (!cleanSingleLine(form.companyName)) return copy.requiredCompanyName;
    if (!cleanSingleLine(form.managerName)) return copy.requiredManagerName;
    if (!form.sector) return copy.requiredSector;
    if (!form.governorate) return copy.requiredGovernorate;
    if (!cleanSingleLine(form.city)) return copy.requiredCity;
    if (!form.phone.trim()) return copy.requiredPhone;
    if (!isValidPhone(form.phone)) return copy.invalidPhone;
    if (creationMode && !form.email.trim()) return isArabic ? 'أدخل بريدك الإلكتروني.' : 'Renseignez votre adresse e-mail.';
    if (!isValidEmail(form.email)) return copy.invalidEmail;
    return null;
  };

  const validateStepTwo = (): string | null => {
    if (!creationMode && planKind === 'cv' && !form.requestedPaymentSchedule) return copy.requiredPaymentSchedule;
    if (!creationMode && planKind !== 'cv' && !form.requestedBillingPeriod) return copy.requiredPlanChoice;
    if (
      !creationMode &&
      planKind !== 'cv' &&
      form.requestedBillingPeriod === 'annual' &&
      !['one_payment', 'three_installments'].includes(form.requestedPaymentSchedule)
    ) {
      return copy.requiredPaymentSchedule;
    }
    if (creationMode) {
      if (weeklyHours.some(day => day.status === 'open' && (!day.start || !day.end || day.start >= day.end || (day.split && (!day.secondStart || !day.secondEnd || day.end > day.secondStart || day.secondStart >= day.secondEnd))))) return 'Vérifiez les horaires : les créneaux doivent se suivre sans chevauchement.';
      const socialCount = form.selectedPlatforms.filter(platform => ['facebook','instagram','tiktok','youtube','linkedin','other'].includes(platform)).length;
      if (!premiumCreation && socialCount > 2) return isArabic ? 'اختر شبكتين اجتماعيتين كحد أقصى.' : 'La formule Artisan comprend deux réseaux sociaux au maximum.';
      if (form.photoUrls.split(/\n/).filter(link => link.trim()).length > maxPhotos) return `Maximum ${maxPhotos} photos.`;
      if (!form.preferredContactMethods.length) return copy.requiredContactMethod;
      if (form.preferredContactMethods.includes('email') && !form.email.trim()) return copy.emailNeeded;
      if (!form.preferredContactTimes.length) return copy.requiredContactTime;
      const chosenLinks: Array<[Platform,string,string]> = [
        ['facebook',form.facebook,'Facebook'],['instagram',form.instagram,'Instagram'],['tiktok',form.tiktok,'TikTok'],['youtube',form.youtube,'YouTube'],['linkedin',form.linkedin,'LinkedIn'],
        ['whatsapp_business',form.whatsapp || form.phone,'WhatsApp'],
        ['google_business',form.googleMapsUrl,'Google Maps'],
        ['website',form.website,'Site Internet'],['other',form.otherPlatformUrl,'Autre plateforme'],
      ];
      for(const [platform,link,label] of chosenLinks) {
        if(form.selectedPlatforms.includes(platform) && !link.trim()) return `Lien ou numéro obligatoire : ${label}`;
      }
      for(const link of [form.googleMapsUrl,form.googleReviewsUrl,form.logoUrl,form.tiktok,form.youtube,form.linkedin,form.otherPlatformUrl,...form.photoUrls.split(/\n/).filter(Boolean)]) {
        if(link.trim() && !isValidWebAddress(link.trim())) return 'Un lien est invalide. Vérifiez les adresses saisies.';
      }
    } else {
      if (!form.preferredContactMethod) return copy.requiredContactMethod;
      if (form.preferredContactMethod === 'email' && !form.email.trim()) return copy.emailNeeded;
      if (!form.preferredContactTime) return copy.requiredContactTime;
    }
    if (!isValidWebAddress(form.website)) return copy.invalidWebsite;
    if (!isValidWebAddress(form.facebook, 'facebook')) return copy.invalidFacebook;
    if (!isValidWebAddress(form.instagram, 'instagram')) return copy.invalidInstagram;
    if (form.whatsapp.trim() && !isValidPhone(form.whatsapp)) return copy.invalidWhatsapp;
    if (!form.consent) return copy.requiredConsent;
    return null;
  };

  const continueToStepTwo = () => {
    const validationError = validateStepOne();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step !== (creationMode ? 3 : 2) || submittingRef.current) return;

    const validationError = validateStepOne() || validateStepTwo();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setErrorMessage('');

    const request: BusinessRegistrationRequest = {
      mode: 'subscription',
      language: currentLanguage,
      sourcePage: 'subscription',
      requestId: requestIdRef.current,
      elapsedMs: Date.now() - startedAtRef.current,
      verificationField: form.verificationField,
      selectedPlan,
      companyName: cleanSingleLine(form.companyName),
      managerName: cleanSingleLine(form.managerName),
      phone: normalizePhone(form.phone),
      email: normalizeEmail(form.email),
      governorate: cleanSingleLine(form.governorate),
      city: cleanSingleLine(form.city),
      sector: cleanSingleLine(form.sector),
      website: normalizeWebAddress(form.website),
      facebook: normalizeWebAddress(form.facebook, 'facebook'),
      instagram: normalizeWebAddress(form.instagram, 'instagram'),
      whatsapp: form.whatsapp.trim() ? normalizePhone(form.whatsapp) : '',
      selectedPlatforms: form.selectedPlatforms.filter(platform => !['tiktok','youtube','linkedin'].includes(platform)),
      requestedBillingPeriod: creationMode ? 'one_time' : planKind === 'cv' ? '' : form.requestedBillingPeriod,
      requestedPaymentSchedule: form.requestedPaymentSchedule,
      preferredContactMethod: creationMode ? (form.preferredContactMethods.includes('whatsapp') ? 'whatsapp' : form.preferredContactMethods.includes('phone') ? 'phone' : 'email') : form.preferredContactMethod,
      preferredContactTime: creationMode ? (form.preferredContactTimes.length > 1 || form.preferredContactTimes.includes('anytime') ? 'anytime' : form.preferredContactTimes[0] || 'anytime') : form.preferredContactTime,
      message: cleanMultiline([
        // Internal admin-only label — not user-visible, intentionally kept in French
        creationMode ? `OFFRE ACTUELLE — paiement unique — ${planKind === 'artisan' ? 'Formule Artisan 30 TND' : 'Formule Premium 59 TND'} — ne pas traiter comme un abonnement mensuel` : '',
        !premiumCreation && (creationMode ? artisanModel : presentationModelLabel) ? `Modèle de présentation choisi : ${creationMode ? artisanModel : presentationModelLabel}` : '',
        !premiumCreation && (creationMode ? artisanPalette : paletteLabel) ? `Palette choisie : ${creationMode ? artisanPalette : paletteLabel}` : '',
        form.activityDescription ? `Description de l'activité : ${cleanMultiline(form.activityDescription)}` : '',
        ...(creationMode ? [
          `Parcours : ${form.assistance === 'assisted' ? 'Accompagnement demandé' : 'Autonome'}`,
          premiumCreation ? 'Inclus : Business + Portfolio, 3 palettes, ouvertures A + B, 10 photos.' : 'Inclus : 1 modèle, 1 palette, 1 ouverture, 5 photos, 2 réseaux.',
          `Adresse : ${cleanSingleLine(form.address)}`,
          `Horaires : ${cleanMultiline(form.openingHours)}`,
          `Google Maps : ${form.googleMapsUrl}`,
          `Lien avis Google : ${form.googleReviewsUrl}`,
          form.logoUrl ? `Lien logo : ${form.logoUrl}` : '',
          `Logo choisi : ${form.logoChoice === 'create' ? 'Création Dalil Tounes +20 TND — droits sur le logo final transférés après paiement et livraison' : form.logoChoice === 'existing' ? 'Logo fourni par le professionnel' : 'Aucun logo demandé'}`,
          premiumCreation ? 'Ouvertures mini-appli : A et B incluses ; aucun choix initial imposé.' : `Ouverture mini-appli : ${form.openingStyle === 'photo' ? 'A · Photo plein fond' : 'B · Présentation encadrée Prestige'}`,
          `Supplément création logo : ${form.logoChoice === 'create' ? '20 TND' : '0 TND'}`,
          `Montant total demandé : ${(selectedPlan === 'artisan' ? 30 : 59) + (form.logoChoice === 'create' ? 20 : 0)} TND`,
          `Photos : ${form.photoUrls}`,
          `Catalogue et produits : ${cleanMultiline(form.productsDescription)}`,
          `Plateformes sélectionnées : ${form.selectedPlatforms.map(platform => copy.platformLabels[platform]).join(', ')}`, form.tiktok ? `TikTok : ${form.tiktok}` : '', form.youtube ? `YouTube : ${form.youtube}` : '', form.linkedin ? `LinkedIn : ${form.linkedin}` : '',
          `Autre plateforme : ${form.otherPlatformUrl}`,
          `Contacts souhaités : ${form.preferredContactMethods.join(', ')}`,
          `Moments souhaités : ${form.preferredContactTimes.join(', ')}`,
        ] : []),
        form.message,
      ].filter(Boolean).join('\n')),
      consent: form.consent,
      ...(creationMode ? {
        creationDossier: {
          schemaVersion: 1 as const,
          assistance: form.assistance === 'self' ? 'autonomous' as const : 'assisted' as const,
          presentationModel: premiumCreation ? null : resolveCreationModel(artisanModel),
          palette: premiumCreation ? null : resolveCreationPalette(artisanPalette),
          openingStyle: premiumCreation ? null : form.openingStyle,
          address: cleanSingleLine(form.address),
          openingHours: cleanMultiline(form.openingHours),
          googleMapsUrl: normalizeWebAddress(form.googleMapsUrl),
          googleReviewsUrl: normalizeWebAddress(form.googleReviewsUrl),
          logoChoice: form.logoChoice,
          logoUrl: form.logoChoice === 'existing' ? normalizeWebAddress(form.logoUrl) : '',
          photoUrls: form.photoUrls.split(/\n/).map(link => link.trim()).filter(Boolean).map(link => normalizeWebAddress(link)),
          productsDescription: cleanMultiline(form.productsDescription),
          activityDescription: cleanMultiline(form.activityDescription),
          notes: cleanMultiline(form.message),
          socialLinks: {
            facebook: normalizeWebAddress(form.facebook, 'facebook'), instagram: normalizeWebAddress(form.instagram, 'instagram'),
            tiktok: normalizeWebAddress(form.tiktok), youtube: normalizeWebAddress(form.youtube), linkedin: normalizeWebAddress(form.linkedin),
            website: normalizeWebAddress(form.website), other: normalizeWebAddress(form.otherPlatformUrl),
            whatsapp: normalizePhone(form.whatsapp || form.phone), googleBusiness: normalizeWebAddress(form.googleMapsUrl),
          },
          selectedPlatforms: [...form.selectedPlatforms],
          preferredContactMethods: [...form.preferredContactMethods],
          preferredContactTimes: [...form.preferredContactTimes],
        },
      } : {}),
    };

    // Creation dossiers allow 10,000 characters; legacy subscriptions retain 1,500.
    // Fail explicitly rather than silently losing CV details during the transition.
    if (request.message.length > (creationMode ? 10000 : 1500)) {
      setErrorMessage('Votre dossier dépasse la longueur autorisée. Réduisez les notes ou les listes de produits avant l’envoi.');
      submittingRef.current = false;
      setSubmitting(false);
      return;
    }

    try {
      const response = await submitBusinessRegistration(request);
      setReceipt(response);
      setSubmitted(true);
      if (!response.duplicate) {
        // Analytics must never turn a confirmed receipt into an apparent submission failure.
        try { trackMetaEvent('Lead', { content_name: 'Business offer request' }); } catch { /* receipt already confirmed */ }
      }
      onSuccess?.();
    } catch (error) {
      if (error instanceof BusinessRegistrationError) {
        if (error.code === 'network_error') setErrorMessage(copy.networkError);
        else if (error.code === 'timeout') setErrorMessage(copy.timeoutError);
        else if (error.code === 'validation_error') setErrorMessage(copy.formError);
        else if (error.code === 'rate_limited') setErrorMessage(RECEIPT_COPY[currentLanguage].rateLimited);
        else if (error.code === 'submission_rejected') setErrorMessage(RECEIPT_COPY[currentLanguage].rejected);
        else if (error.code === 'request_conflict') setErrorMessage(RECEIPT_COPY[currentLanguage].conflict);
        else setErrorMessage(copy.serverError);
      } else {
        setErrorMessage(copy.serverError);
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const checkoutSelection = (() => {
    if (planKind === 'cv') {
      if (form.requestedPaymentSchedule !== 'one_payment') return null;
      const amount = CHECKOUT_AMOUNTS[checkoutOffer as 'cv_essential' | 'cv_complete']?.oneTime;
      return amount ? { offer: checkoutOffer, amount } : null;
    }
    if (form.requestedBillingPeriod === 'monthly') {
      const amount = CHECKOUT_AMOUNTS[checkoutOffer as 'artisan' | 'premium']?.monthly;
      return amount ? { offer: `${checkoutOffer}_monthly`, ...amount, tnd: `${amount.tnd} TND / ${copy.monthly.toLowerCase()}`, period: copy.monthly, priceLabel: checkoutCopy.monthlyPrice } : null;
    }
    if (form.requestedBillingPeriod === 'annual' && form.requestedPaymentSchedule === 'one_payment') {
      const amount = CHECKOUT_AMOUNTS[checkoutOffer as 'artisan' | 'premium']?.annual;
      return amount ? { offer: `${checkoutOffer}_annual`, ...amount, tnd: `${amount.tnd} TND / ${copy.annual.toLowerCase()}`, period: copy.annual, priceLabel: checkoutCopy.annualPrice } : null;
    }
    return null;
  })();

  const openStripeCheckout = async () => {
    const validationError = validateStepOne() || validateStepTwo();
    if (validationError || !checkoutSelection) {
      setErrorMessage(validationError || copy.requiredPaymentSchedule);
      return;
    }

    setOpeningCheckout(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/create-stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer: checkoutSelection.offer,
          email: normalizeEmail(form.email),
        }),
      });
      const body = await response.json() as { url?: string };
      if (!response.ok || !body.url) throw new Error('Checkout unavailable');
      window.location.assign(body.url);
    } catch {
      setErrorMessage(checkoutCopy.checkoutError);
      setOpeningCheckout(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="subscription-request-verification">{copy.honeypotLabel}</label>
        <input
          id="subscription-request-verification"
          type="text"
          name="verificationField"
          value={form.verificationField}
          onChange={setField}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="rounded-2xl border border-[#D4AF37]/35 bg-[#FFFDF7] p-4">
        <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.12em] text-[#292725]">
          <span>{creationMode ? (step === 1 ? (isArabic ? '١. النشاط' : '1. Activité') : step === 2 ? (isArabic ? '٢. التفاصيل' : '2. Informations') : (isArabic ? '٣. المراجعة' : '3. Récapitulatif')) : (step === 1 ? copy.stepOne : copy.stepTwo)}</span>
          <span aria-hidden="true">{step}/{creationMode ? 3 : 2}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#D4AF37]/20">
          <div className={`h-full rounded-full bg-[#D4AF37] transition-all ${creationMode ? (step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full') : (step === 1 ? 'w-1/2' : 'w-full')}`} />
        </div>
      </div>

      {(submitted || errorMessage) && (
        <div ref={feedbackRef} tabIndex={-1} className="focus:outline-none">
          {submitted ? (
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800" role="status" aria-live="polite">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <div className="min-w-0">
                <p>{RECEIPT_COPY[currentLanguage].saved}</p>
                {receipt && <p className="mt-1 break-all text-xs">{RECEIPT_COPY[currentLanguage].reference} : <span dir="ltr">{receipt.id}</span></p>}
                {receipt && Object.values(receipt.integration_status || {}).some(item => item?.status !== 'ok') && (
                  <p className="mt-2 text-xs">{RECEIPT_COPY[currentLanguage].pending}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert" aria-live="assertive">
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {step === 1 ? (
        <section aria-labelledby="subscription-activity-title" className="space-y-4">
          <h3 id="subscription-activity-title" className="text-xl font-bold text-[#292725]">{copy.activityTitle}</h3>
          {creationMode && <div className="space-y-3 rounded-xl border border-[#D4AF37]/50 bg-[#FFFDF7] p-3">
            <p className="font-semibold text-[#07543F]">{premiumCreation ? (isArabic ? "النموذجان والألوان الثلاثة وشاشتا الافتتاح مشمولة" : "✓ Business et Portfolio · 3 palettes · 2 ouvertures incluses") : (isArabic ? "نموذج واحد وألوان وشاشة افتتاحية" : "✓ 1 modèle · 1 palette · 1 ouverture")}</p>
            {!premiumCreation && <div className="grid gap-2 sm:grid-cols-2">
              <FieldLabel label="Modèle"><select value={artisanModel} onChange={event=>setArtisanModel(event.target.value)} className={inputClassName}><option value="">Choisir</option>{Array.from(new Set([artisanModel,'CV Business','CV Portfolio'].filter(Boolean))).map(model=><option key={model}>{model}</option>)}</select></FieldLabel>
              <FieldLabel label="Palette"><select value={artisanPalette} onChange={event=>setArtisanPalette(event.target.value)} className={inputClassName}><option value="">Choisir</option>{Array.from(new Set([artisanPalette,'Vert Prestige','Ivoire & Or','Bleu Nuit & Champagne'].filter(Boolean))).map(palette=><option key={palette}>{palette}</option>)}</select></FieldLabel>
            </div>}
            <fieldset className="grid gap-2"><legend className="mb-2 text-sm font-semibold">{isArabic ? "كيف تريد إعداد تطبيقك؟" : "Comment souhaitez-vous créer votre mini-appli ?"}</legend>
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="assistance" value="self" checked={form.assistance === "self"} onChange={setField}/>{isArabic ? "أقوم بذلك بنفسي" : "Je le fais moi-même"}</label>
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="assistance" value="assisted" checked={form.assistance === "assisted"} onChange={setField}/>{isArabic ? "أرغب في المساعدة" : "Je souhaite être accompagné"}</label>
            </fieldset>
          </div>}
          <div className="grid gap-4 md:grid-cols-2">
            <FieldLabel label={copy.companyName} required>
              <input
                type="text"
                name="companyName"
                required
                maxLength={160}
                value={form.companyName}
                onChange={setField}
                className={inputClassName}
                disabled={submitting}
                autoComplete="organization"
              />
            </FieldLabel>
            <FieldLabel label={copy.managerName} required>
              <input
                type="text"
                name="managerName"
                required
                maxLength={120}
                value={form.managerName}
                onChange={setField}
                className={inputClassName}
                disabled={submitting}
                autoComplete="name"
              />
            </FieldLabel>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldLabel label={copy.sector} required>
              <select name="sector" required value={form.sector} onChange={setField} className={inputClassName} disabled={submitting}>
                <option value="">{copy.choose}</option>
                {BUSINESS_SECTORS.map((option) => (
                  <option key={option.value} value={option.value}>{getOptionLabel(option, currentLanguage)}</option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label={copy.governorate} required>
              <select
                name="governorate"
                required
                value={form.governorate}
                onChange={setField}
                className={inputClassName}
                disabled={submitting}
                autoComplete="address-level1"
              >
                <option value="">{copy.choose}</option>
                {TUNISIA_GOVERNORATES.map((option) => (
                  <option key={option.value} value={option.value}>{getOptionLabel(option, currentLanguage)}</option>
                ))}
              </select>
            </FieldLabel>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldLabel label={copy.city} required>
              <input
                type="text"
                name="city"
                required
                maxLength={100}
                value={form.city}
                onChange={setField}
                className={inputClassName}
                disabled={submitting}
                autoComplete="address-level2"
              />
            </FieldLabel>
            <FieldLabel label={copy.phone} required>
              <input
                type="tel"
                name="phone"
                required
                maxLength={24}
                value={form.phone}
                onChange={setField}
                placeholder="+216 XX XXX XXX"
                className={inputClassName}
                disabled={submitting}
                autoComplete="tel"
                inputMode="tel"
                dir="ltr"
              />
            </FieldLabel>
          </div>

          <FieldLabel label={creationMode ? (isArabic ? 'البريد الإلكتروني *' : 'E-mail *') : copy.emailOptional}>
            <input
              type="email"
              name="email"
              required={creationMode}
              maxLength={180}
              value={form.email}
              onChange={setField}
              placeholder="name@example.com"
              className={inputClassName}
              disabled={submitting}
              autoComplete="email"
              inputMode="email"
              dir="ltr"
            />
          </FieldLabel>
        </section>
      ) : step === 2 ? (
        <section aria-labelledby="subscription-request-title" className="space-y-5">
          <h3 id="subscription-request-title" className="text-xl font-bold text-[#292725]">{copy.requestTitle}</h3>

          <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#FFF9E8] p-4">
            <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-600">{copy.selectedSolution}</span>
            <strong className="mt-1 block text-base text-[#292725]">{selectedPlanLabel}</strong>
            {planKind !== 'cv' && checkoutSelection && 'tnd' in checkoutSelection && (
              <div className="mt-3 border-t border-[#D4AF37]/30 pt-3 text-sm text-slate-700">
                <p className="font-bold text-[#07543F]">{selectedPlanLabel}{checkoutSelection.period ? ` — ${checkoutSelection.period}` : ''}</p>
                <p className="mt-1"><span className="font-semibold">{checkoutSelection.priceLabel} :</span> {checkoutSelection.tnd}</p>
                <p><span className="font-semibold">{checkoutCopy.stripeEquivalent} :</span> {checkoutSelection.eur}</p>
              </div>
            )}
          </div>

          {creationMode ? null : planKind === 'cv' ? (
            <ChoiceGroup legend={copy.cvPaymentQuestion}>
              <RadioChoice name="requestedPaymentSchedule" value="one_payment" checked={form.requestedPaymentSchedule === 'one_payment'} onChange={setField} label={copy.cvSingle} />
              <RadioChoice name="requestedPaymentSchedule" value="two_installments" checked={form.requestedPaymentSchedule === 'two_installments'} onChange={setField} label={copy.cvTwo} />
              <RadioChoice name="requestedPaymentSchedule" value="three_installments" checked={form.requestedPaymentSchedule === 'three_installments'} onChange={setField} label={copy.cvThree} />
              <RadioChoice name="requestedPaymentSchedule" value="advice" checked={form.requestedPaymentSchedule === 'advice'} onChange={setField} label={copy.advice} />
            </ChoiceGroup>
          ) : (
            <>
              <ChoiceGroup legend={copy.durationQuestion}>
                <RadioChoice name="requestedBillingPeriod" value="monthly" checked={form.requestedBillingPeriod === 'monthly'} onChange={() => setBillingPeriod('monthly')} label={copy.monthly} />
                <RadioChoice name="requestedBillingPeriod" value="annual" checked={form.requestedBillingPeriod === 'annual'} onChange={() => setBillingPeriod('annual')} label={copy.annual} />
                <RadioChoice name="requestedBillingPeriod" value="advice" checked={form.requestedBillingPeriod === 'advice'} onChange={() => setBillingPeriod('advice')} label={copy.advice} />
              </ChoiceGroup>

              {form.requestedBillingPeriod === 'annual' && (
                <ChoiceGroup legend={copy.annualPaymentQuestion}>
                  <RadioChoice name="requestedPaymentSchedule" value="one_payment" checked={form.requestedPaymentSchedule === 'one_payment'} onChange={setField} label={copy.singlePayment} />
                  <RadioChoice name="requestedPaymentSchedule" value="three_installments" checked={form.requestedPaymentSchedule === 'three_installments'} onChange={setField} label={copy.threePayments} />
                </ChoiceGroup>
              )}

              {planKind === 'premium' && form.requestedBillingPeriod === 'annual' && (
                <p className="rounded-xl border border-[#D4AF37]/50 bg-[#FFF9E8] px-4 py-3 text-sm font-semibold leading-relaxed text-[#292725]">
                  {copy.premiumFlyerInfo}
                </p>
              )}
            </>
          )}

          <section className="rounded-2xl border border-[#D4AF37]/40 bg-white p-4 space-y-3" aria-label="Réseaux sociaux et liens">
            <h4 className="text-base font-semibold text-[#292725]">Réseaux sociaux, site et Google</h4>
            <p className="text-xs text-slate-600">Sélectionnez vos plateformes et renseignez leurs liens directement ici. Les liens des plateformes cochées sont obligatoires.</p>
            <ChoiceGroup legend={copy.platformsQuestion}>
              {PLATFORMS.filter(platform => creationMode || !['tiktok','youtube','linkedin'].includes(platform)).map((platform) => (
                <CheckboxChoice
                  key={platform}
                  checked={form.selectedPlatforms.includes(platform)}
                  onChange={() => togglePlatform(platform)}
                  label={copy.platformLabels[platform]}
                />
              ))}
            </ChoiceGroup>
            <div className="grid gap-3 md:grid-cols-2">
              {(!creationMode || form.selectedPlatforms.includes('website')) && <FieldLabel label={creationMode ? 'Site Internet *' : copy.website}><input type="url" name="website" value={form.website} onChange={setField} className={inputClassName} placeholder="https://..." /></FieldLabel>}
              {(!creationMode || form.selectedPlatforms.includes('facebook')) && <FieldLabel label={creationMode ? 'Facebook *' : copy.facebook}><input type="url" name="facebook" value={form.facebook} onChange={setField} className={inputClassName} placeholder="https://www.facebook.com/..." /></FieldLabel>}
              {(!creationMode || form.selectedPlatforms.includes('instagram')) && <FieldLabel label={creationMode ? 'Instagram *' : copy.instagram}><input type="url" name="instagram" value={form.instagram} onChange={setField} className={inputClassName} placeholder="https://www.instagram.com/..." /></FieldLabel>}
              {(!creationMode || form.selectedPlatforms.includes('whatsapp_business')) && <FieldLabel label="Numéro WhatsApp (si différent du téléphone)"><input type="tel" name="whatsapp" value={form.whatsapp} onChange={setField} className={inputClassName} placeholder="+216..." /></FieldLabel>}
              {creationMode && form.selectedPlatforms.includes('google_business') && <FieldLabel label="Lien Google Maps / Fiche Google *"><input type="url" name="googleMapsUrl" value={form.googleMapsUrl} onChange={setField} className={inputClassName} placeholder="https://maps.app.goo.gl/..." /></FieldLabel>}
              {creationMode && form.selectedPlatforms.includes('other') && <FieldLabel label="Autre plateforme *"><input type="url" name="otherPlatformUrl" value={form.otherPlatformUrl} onChange={setField} className={inputClassName} placeholder="https://..." /></FieldLabel>}
              {creationMode && form.selectedPlatforms.includes('tiktok') && <FieldLabel label="TikTok *"><input type="url" name="tiktok" value={form.tiktok} onChange={setField} className={inputClassName} placeholder="https://www.tiktok.com/@..." /></FieldLabel>}
              {creationMode && form.selectedPlatforms.includes('youtube') && <FieldLabel label="YouTube *"><input type="url" name="youtube" value={form.youtube} onChange={setField} className={inputClassName} placeholder="https://www.youtube.com/..." /></FieldLabel>}
              {creationMode && form.selectedPlatforms.includes('linkedin') && <FieldLabel label="LinkedIn *"><input type="url" name="linkedin" value={form.linkedin} onChange={setField} className={inputClassName} placeholder="https://www.linkedin.com/..." /></FieldLabel>}
            </div>
          </section>

          {creationMode && (
            <div className="space-y-4 rounded-2xl border border-[#D4AF37]/40 p-4">
              <h4 className="font-semibold">Informations du CV professionnel</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <FieldLabel label="Adresse complète"><input name="address" value={form.address} onChange={setField} maxLength={240} className={inputClassName} placeholder="Rue, numéro et quartier" /></FieldLabel>
                {!form.selectedPlatforms.includes('google_business') && <FieldLabel label="Lien Google Maps (facultatif)"><input name="googleMapsUrl" type="url" value={form.googleMapsUrl} onChange={setField} className={inputClassName} placeholder="https://maps.app.goo.gl/..." /></FieldLabel>}
              </div>
              <details className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"><summary className="cursor-pointer font-medium">Comment récupérer mon lien GPS / Google Maps ?</summary><p className="mt-2">Ouvrez Google Maps, recherchez votre établissement ou son emplacement exact, cliquez sur « Partager », puis « Copier le lien ». Collez ce lien dans le champ Google Maps.</p></details>
              <fieldset className="rounded-xl border border-[#D4AF37]/40 p-3">
                <legend className="px-1 font-semibold">Horaires d’ouverture</legend>
                <div className="grid gap-3">{weeklyHours.map((day,i)=><div key={day.day} className="border-b border-slate-100 pb-2">
                  <div className="flex items-center justify-between gap-2"><span className="text-sm font-medium">{day.day}</span><select aria-label={day.day+' — état'} value={day.status} onChange={event=>updateHours(i,{status:event.target.value})} className="rounded-lg border border-slate-300 p-2 text-sm"><option value="">Non renseigné</option><option value="open">Ouvert</option><option value="closed">Fermé</option></select></div>
                  {day.status==='open' && <div className="mt-2 grid gap-2"><div className="flex items-center gap-2"><input aria-label={day.day+' début'} type="time" value={day.start} onChange={event=>updateHours(i,{start:event.target.value})} className="min-w-0 flex-1 rounded-lg border p-2"/><span>à</span><input aria-label={day.day+' fin'} type="time" value={day.end} onChange={event=>updateHours(i,{end:event.target.value})} className="min-w-0 flex-1 rounded-lg border p-2"/></div>
                  <label className="flex gap-2 text-sm"><input type="checkbox" checked={day.split} onChange={event=>updateHours(i,{split:event.target.checked})}/>Deuxième créneau</label>
                  {day.split && <div className="flex items-center gap-2"><input aria-label={day.day+' reprise'} type="time" value={day.secondStart} onChange={event=>updateHours(i,{secondStart:event.target.value})} className="min-w-0 flex-1 rounded-lg border p-2"/><span>à</span><input aria-label={day.day+' deuxième fin'} type="time" value={day.secondEnd} onChange={event=>updateHours(i,{secondEnd:event.target.value})} className="min-w-0 flex-1 rounded-lg border p-2"/></div>}</div>}
                </div>)}</div>
              </fieldset>
              {!premiumCreation && <fieldset className="rounded-xl border border-[#D4AF37]/40 bg-[#FFFDF7] p-3">
                <legend className="px-1 font-semibold text-[#292725]">Ouverture de votre mini-appli</legend>
                <p className="mb-2 text-xs text-slate-600">{premiumCreation ? 'Les deux ouvertures sont incluses : choisissez celle affichée au départ.' : 'Choisissez votre présentation d’ouverture.'}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {([['photo', 'A · Photo plein fond'], ['framed', 'B · Présentation Prestige encadrée']] as const).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm">
                      <input type="radio" name="openingStyle" value={value} checked={form.openingStyle === value} onChange={setField} />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>}
              <details className="rounded-xl border border-slate-200 p-3">
                <summary className="cursor-pointer font-semibold">Logo, photos, avis et catalogue</summary>
                <div className="mt-3 space-y-3">
                  <p className="text-xs text-slate-600">Indiquez les liens de vos images déjà en ligne, ou demandez à notre équipe de vous accompagner pour les transmettre. L’envoi direct de fichiers n’est pas encore disponible.</p>
                  <fieldset className="rounded-xl border border-[#D4AF37]/40 bg-[#FFFDF7] p-3">
                    <legend className="px-1 font-semibold text-[#292725]">Votre logo</legend>
                    <div className="mt-2 grid gap-2">
                      {([
                        ['existing', 'J’ai déjà mon logo'],
                        ['create', 'Je souhaite que Dalil Tounes crée mon logo (+20 TND)'],
                        ['none', 'Je ne souhaite pas de logo pour le moment'],
                      ] as const).map(([value, label]) => (
                        <label key={value} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                          <input type="radio" name="logoChoice" value={value} checked={form.logoChoice === value} onChange={setField} className="h-4 w-4 accent-[#07543F]" />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                    {form.logoChoice === 'create' && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-3 text-sm leading-6 text-[#07543F]"><strong>Le logo final sera votre propriété après règlement et livraison.</strong> Vous pourrez le réutiliser librement en dehors de Dalil Tounes. Les éventuels éléments ou polices sous licence tierce restent soumis à leurs conditions d’utilisation. Création simple avec une proposition et deux ajustements inclus.</p>}
                    {form.logoChoice === 'existing' && (
                      <div className="mt-3 space-y-2">
                        <FieldLabel label="Lien du logo"><input type="url" name="logoUrl" value={form.logoUrl} onChange={setField} className={inputClassName} placeholder="https://..." /></FieldLabel>
                      </div>
                    )}
                  </fieldset>
                  <FieldLabel label={`Liens des photos (maximum ${maxPhotos}, un par ligne)`}><textarea name="photoUrls" value={form.photoUrls} onChange={setField} rows={3} className={inputClassName} placeholder="https://.../photo1.jpg" /></FieldLabel>
                  <FieldLabel label="Lien des avis Google"><input type="url" name="googleReviewsUrl" value={form.googleReviewsUrl} onChange={setField} className={inputClassName} placeholder="https://g.page/r/.../review" /></FieldLabel><details className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"><summary className="cursor-pointer font-medium">Comment récupérer mon lien d’avis Google ?</summary><p className="mt-2">Connectez-vous au compte Google qui gère votre fiche d’établissement. Ouvrez votre fiche, choisissez « Demander des avis » (ou « Obtenir plus d’avis »), puis copiez le lien proposé et collez-le ci-dessus.</p></details>
                  <FieldLabel label="Produits, prestations et prix"><textarea name="productsDescription" value={form.productsDescription} onChange={setField} rows={4} className={inputClassName} placeholder="Produit — prix — description" /></FieldLabel>
                </div>
              </details>
            </div>
          )}
          {creationMode ? (
            <div className="grid gap-4 md:grid-cols-2">
              <fieldset className="rounded-2xl border border-gray-200 p-4">
                <legend className="font-semibold">{copy.contactMethod} — plusieurs choix possibles</legend>
                {(['whatsapp','phone','email'] as const).map(method => <CheckboxChoice key={method} checked={form.preferredContactMethods.includes(method)} label={method==='whatsapp'?copy.contactWhatsApp:method==='phone'?copy.contactPhone:copy.contactEmail} onChange={() => { setForm(current=>({...current,preferredContactMethods:current.preferredContactMethods.includes(method)?current.preferredContactMethods.filter(m=>m!==method):[...current.preferredContactMethods,method]}));setErrorMessage(''); }} />)}
              </fieldset>
              <fieldset className="rounded-2xl border border-gray-200 p-4">
                <legend className="font-semibold">{copy.contactTime} — plusieurs choix possibles</legend>
                {(['morning','afternoon','evening','anytime'] as const).map(time => (
                  <CheckboxChoice key={time} checked={form.preferredContactTimes.includes(time)}
                    label={time === 'morning' ? copy.morning : time === 'afternoon' ? copy.afternoon : time === 'evening' ? copy.evening : copy.anyTime}
                    onChange={() => {
                      setForm(current => ({
                        ...current,
                        preferredContactTimes: time === 'anytime'
                          ? (current.preferredContactTimes.includes('anytime') ? [] : ['anytime'])
                          : current.preferredContactTimes.includes(time)
                            ? current.preferredContactTimes.filter(item => item !== time)
                            : [...current.preferredContactTimes.filter(item => item !== 'anytime'), time],
                      }));
                      setErrorMessage('');
                    }}
                  />
                ))}
              </fieldset>
            </div>
          ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <ChoiceGroup legend={copy.contactMethod}>
              <RadioChoice name="preferredContactMethod" value="whatsapp" checked={form.preferredContactMethod === 'whatsapp'} onChange={setField} label={copy.contactWhatsApp} />
              <RadioChoice name="preferredContactMethod" value="phone" checked={form.preferredContactMethod === 'phone'} onChange={setField} label={copy.contactPhone} />
              <RadioChoice name="preferredContactMethod" value="email" checked={form.preferredContactMethod === 'email'} onChange={setField} label={copy.contactEmail} />
            </ChoiceGroup>
            <ChoiceGroup legend={copy.contactTime}>
              <RadioChoice name="preferredContactTime" value="morning" checked={form.preferredContactTime === 'morning'} onChange={setField} label={copy.morning} />
              <RadioChoice name="preferredContactTime" value="afternoon" checked={form.preferredContactTime === 'afternoon'} onChange={setField} label={copy.afternoon} />
              <RadioChoice name="preferredContactTime" value="evening" checked={form.preferredContactTime === 'evening'} onChange={setField} label={copy.evening} />
              <RadioChoice name="preferredContactTime" value="anytime" checked={form.preferredContactTime === 'anytime'} onChange={setField} label={copy.anyTime} />
            </ChoiceGroup>
          </div>
          )}

          {creationMode && (
            <FieldLabel label={isArabic ? 'وصف نشاطك (اختياري)' : 'Description de votre activité (facultatif)'}>
              <textarea name="activityDescription" rows={3} maxLength={1500} value={form.activityDescription} onChange={setField} className={`${inputClassName} resize-y`} disabled={submitting} placeholder={isArabic ? 'ماذا تقدم لعملائك؟' : 'Présentez vos services, spécialités et ce qui vous distingue.'} />
            </FieldLabel>
          )}
          {creationMode && (
            <p className="text-xs font-semibold text-[#07543F]">Réseaux sélectionnés : les liens correspondants doivent être remplis. L’adresse du site ou les autres liens non sélectionnés restent facultatifs.</p>
          )}
          <FieldLabel label={copy.messageOptional}>
            <textarea
              name="message"
              rows={4}
              maxLength={1500}
              value={form.message}
              onChange={setField}
              placeholder={copy.messagePlaceholder}
              className={`${inputClassName} resize-y`}
              disabled={submitting}
            />
          </FieldLabel>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-700">
            <input
              type="checkbox"
              name="consent"
              required
              checked={form.consent}
              onChange={setField}
              disabled={submitting}
              className="mt-1 h-5 w-5 flex-none rounded border-gray-300 text-[#292725] focus:ring-[#D4AF37]"
            />
            <span>
              {copy.consentPrefix}{' '}
              <a href="/cgu" className="font-semibold text-[#292725] underline decoration-[#D4AF37] underline-offset-2">{copy.terms}</a>{' '}
              {copy.conjunction}{' '}
              <a href="/politique-confidentialite" className="font-semibold text-[#292725] underline decoration-[#D4AF37] underline-offset-2">{copy.privacy}</a>.
            </span>
          </label>

          <p className="text-center text-sm font-semibold text-[#292725]">{creationMode ? (isArabic ? 'إرسال الطلب لا يعني أن الدفع قد تم. يتم التحقق من التحويل البنكي قبل بدء التحضير.' : 'L’envoi de la demande ne confirme aucun paiement. Le virement sera vérifié avant la préparation.') : copy.freeNotice}</p>
          {!creationMode && (
            <div className="rounded-xl border border-[#D4AF37]/40 bg-[#FFF9E8] px-4 py-3 text-sm leading-6 text-[#292725]">
              <p>{checkoutCopy.currencyNotice}</p>
              <p className="mt-1 font-semibold">{checkoutCopy.installmentsNotice}</p>
            </div>
          )}
          {creationMode && (
            <div className="rounded-2xl border border-[#D4AF37]/55 bg-[#FFF9E8] p-4 text-sm leading-6 text-[#292725]">
              <p className="text-base font-black">{language === 'fr' ? 'Commande et paiement en dinars tunisiens' : language === 'ar' ? 'الطلب والدفع بالدينار التونسي' : language === 'it' ? 'Ordine e pagamento in dinari tunisini' : language === 'ru' ? 'Заказ и оплата в тунисских динарах' : 'Order and payment in Tunisian dinars'}</p>
              <p className="mt-2">{language === 'fr' ? `Montant : ${planKind === 'artisan' ? '30 TND' : '59 TND'}. Envoyez d’abord votre demande ci-dessous. Notre équipe vous transmettra ensuite les instructions bancaires en privé par WhatsApp.` : language === 'ar' ? `المبلغ: ${planKind === 'artisan' ? '30 د.ت' : '59 د.ت'}. أرسل طلبك أولاً أدناه، ثم يرسل لك فريقنا تعليمات التحويل البنكي بشكل خاص على واتساب.` : language === 'it' ? `Importo: ${planKind === 'artisan' ? '30 TND' : '59 TND'}. Invia prima la richiesta qui sotto; il nostro team ti comunicherà privatamente su WhatsApp le istruzioni per il bonifico.` : language === 'ru' ? `Сумма: ${planKind === 'artisan' ? '30 TND' : '59 TND'}. Сначала отправьте заявку ниже, затем команда лично пришлёт банковские реквизиты в WhatsApp.` : `Amount: ${planKind === 'artisan' ? '30 TND' : '59 TND'}. First send your request below; our team will then privately send the bank transfer instructions via WhatsApp.`}</p>
              <p className="mt-2 font-semibold">{language === 'fr' ? 'Aucune coordonnée bancaire n’est publiée sur le site. La création commence après vérification du règlement.' : language === 'ar' ? 'لا يتم نشر أي بيانات بنكية على الموقع. يبدأ العمل بعد التحقق من الدفع.' : language === 'it' ? 'Nessun dato bancario viene pubblicato sul sito. La creazione inizia dopo la verifica del pagamento.' : language === 'ru' ? 'Банковские реквизиты на сайте не публикуются. Работа начинается после проверки оплаты.' : 'No bank details are published on the website. Creation starts after payment verification.'}</p>
            </div>
          )}
          {!creationMode && checkoutSelection && (
            <button
              type="button"
              onClick={openStripeCheckout}
              disabled={submitting || openingCheckout}
              className="w-full rounded-xl bg-[#07543F] px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] disabled:cursor-wait disabled:opacity-60"
            >
              {openingCheckout ? checkoutCopy.checkoutLoading : `${checkoutCopy.paySecurely} — ${'eur' in checkoutSelection ? checkoutSelection.eur : checkoutSelection.amount}`}
            </button>
          )}
        </section>
      ) : (
        <section aria-labelledby="miniapp-review-title" className="space-y-4">
          <h3 id="miniapp-review-title" className="text-xl font-bold text-[#292725]">{isArabic ? 'تحقق من طلبك قبل الإرسال' : 'Vérifiez votre demande avant envoi'}</h3>
          <div className="rounded-2xl border border-[#D4AF37]/45 bg-[#FFFDF7] p-4 text-sm leading-7 text-[#292725]">
            <p><strong>{isArabic ? 'العرض' : 'Formule'} :</strong> {selectedPlanLabel}</p>
            <p>{form.assistance === "assisted" ? "Accompagnement demandé" : "Création autonome"}</p>
            {premiumCreation && <p className="font-semibold text-[#07543F]">✓ Business + Portfolio · 3 palettes · 2 ouvertures incluses</p>}
            {!premiumCreation && artisanModel && <p><strong>Modèle :</strong> {artisanModel}</p>}
            {!premiumCreation && artisanPalette && <p><strong>Palette :</strong> {artisanPalette}</p>}
            <p><strong>Ouverture :</strong> {premiumCreation ? 'A et B incluses' : form.openingStyle === 'photo' ? 'A · Photo plein fond' : 'B · Présentation Prestige'}</p>
            <p><strong>{isArabic ? 'السعر' : 'Prix de création'} :</strong> {selectedPlan === 'artisan' ? '30 TND' : '59 TND'}</p>
            <p><strong>Logo :</strong> {form.logoChoice === 'create' ? 'Création de logo Dalil Tounes (+20 TND)' : form.logoChoice === 'existing' ? 'Logo fourni' : 'Aucun logo demandé'}</p>
            <p><strong>Total :</strong> {(selectedPlan === 'artisan' ? 30 : 59) + (form.logoChoice === 'create' ? 20 : 0)} TND</p>
            {form.logoChoice === 'create' && <p className="text-xs text-[#07543F]">Le logo final vous appartient après règlement et livraison, sous réserve des licences éventuelles d’éléments tiers.</p>}
            <p>{isArabic ? 'السنة الأولى مشمولة، ثم صيانة اختيارية بقيمة 50 د.ت/سنة.' : 'Première année incluse ; entretien facultatif ensuite : 50 TND/an.'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700">
            <p><strong>{isArabic ? 'النشاط' : 'Activité'} :</strong> {form.companyName}</p>
            <p><strong>{isArabic ? 'المسؤول' : 'Responsable'} :</strong> {form.managerName}</p>
            <p><strong>{isArabic ? 'القطاع' : 'Secteur'} :</strong> {form.sector}</p>
            <p><strong>{isArabic ? 'المدينة' : 'Localisation'} :</strong> {form.city}, {form.governorate}</p>
            <p><strong>{isArabic ? 'الهاتف' : 'Téléphone'} :</strong> {form.phone}</p>
            {form.email && <p><strong>Email :</strong> {form.email}</p>}
            {form.activityDescription && <p className="whitespace-pre-wrap"><strong>{isArabic ? 'الوصف' : 'Description'} :</strong> {form.activityDescription}</p>}
            {form.address && <p><strong>Adresse :</strong> {form.address}</p>}
            {form.openingHours && <p className="whitespace-pre-wrap"><strong>Horaires :</strong> {form.openingHours}</p>}
            {form.googleMapsUrl && <p className="break-all"><strong>Google Maps :</strong> {form.googleMapsUrl}</p>}{form.googleReviewsUrl && <p className="break-all"><strong>Avis Google :</strong> {form.googleReviewsUrl}</p>}
            {form.logoUrl && <p className="break-all"><strong>Logo :</strong> {form.logoUrl}</p>}
            {form.photoUrls && <p className="whitespace-pre-wrap"><strong>Photos :</strong> {form.photoUrls}</p>}
            {form.productsDescription && <p className="whitespace-pre-wrap"><strong>Produits :</strong> {form.productsDescription}</p>}
            <p><strong>Contacts :</strong> {form.preferredContactMethods.join(', ')}</p>
            <p><strong>Créneaux :</strong> {form.preferredContactTimes.join(', ')}</p>
            {form.selectedPlatforms.length > 0 && <p><strong>{isArabic ? 'المنصات' : 'Plateformes'} :</strong> {form.selectedPlatforms.map((item) => copy.platformLabels[item]).join(', ')}</p>}
            {[form.website, form.facebook, form.instagram, form.whatsapp, form.tiktok, form.youtube, form.linkedin, form.otherPlatformUrl].filter(Boolean).length > 0 && <p className="break-words"><strong>{isArabic ? 'الروابط' : 'Liens et WhatsApp'} :</strong> {[form.website, form.facebook, form.instagram, form.whatsapp, form.tiktok, form.youtube, form.linkedin, form.otherPlatformUrl].filter(Boolean).join(' · ')}</p>}
            {form.message && <p className="whitespace-pre-wrap"><strong>{isArabic ? 'ملاحظات' : 'Précisions'} :</strong> {form.message}</p>}
          </div>
          <div className="rounded-xl border border-[#D4AF37]/40 bg-[#FFF9E8] px-4 py-3 text-sm leading-6 text-[#292725]">
            {isArabic ? 'بعد إرسال الطلب، سيرسل لك فريق دليل تونس تعليمات التحويل البنكي بشكل خاص. لا يتم تأكيد الدفع أو النشر آلياً.' : 'Après l’envoi, Dalil Tounes vous communiquera les instructions de virement en privé. Ni le paiement ni la publication ne seront confirmés automatiquement.'}
          </div>
          <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-[#07543F] underline underline-offset-2">{isArabic ? 'تعديل بيانات النشاط' : 'Modifier les coordonnées de mon activité'}</button>
        </section>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        {step === 1 ? (
          <>
            {onCancel && (
              <button type="button" onClick={onCancel} disabled={submitting} className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60">
                {copy.cancel}
              </button>
            )}
            <button type="button" onClick={continueToStepTwo} disabled={submitting} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-[#292725] px-5 py-3 text-sm font-bold text-[#D4AF37] transition hover:bg-[#383634] disabled:opacity-60">
              {copy.continue}
              {isArabic ? <ArrowLeft className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => { setStep(step === 3 ? 2 : 1); setErrorMessage(''); }} disabled={submitting} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60">
              {isArabic ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : <ArrowLeft className="h-4 w-4" aria-hidden="true" />}
              {copy.back}
            </button>
            {creationMode && step === 2 ? (
              <button type="button" onClick={() => { const error = validateStepTwo(); if (error) setErrorMessage(error); else { setErrorMessage(''); setStep(3); } }} disabled={submitting} className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-[#D4AF37] bg-[#07543F] px-5 py-3 text-sm font-bold text-white">{isArabic ? 'مراجعة الطلب' : 'Voir le récapitulatif'}</button>
            ) : (
              <button type="submit" disabled={submitting || submitted} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-[#292725] px-5 py-3 text-sm font-bold text-[#D4AF37] transition hover:bg-[#383634] disabled:cursor-not-allowed disabled:opacity-60">
                <Send className="h-4 w-4" aria-hidden="true" />
                {submitting ? copy.submitting : copy.submit}
              </button>
            )}
          </>
        )}
      </div>
    </form>
  );
}

function FieldLabel({ label, required = false, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-800">
        {label} {required && <span className="text-[#B62226]">*</span>}
      </span>
      {children}
    </label>
  );
}

function ChoiceGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-gray-200 bg-white p-4">
      <legend className="px-1 text-sm font-bold text-gray-800">{legend}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function RadioChoice({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition has-[:checked]:border-[#D4AF37] has-[:checked]:bg-[#FFF9E8]">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 text-[#292725] focus:ring-[#D4AF37]" />
      <span>{label}</span>
    </label>
  );
}

function CheckboxChoice({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition has-[:checked]:border-[#D4AF37] has-[:checked]:bg-[#FFF9E8]">
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 rounded text-[#292725] focus:ring-[#D4AF37]" />
      <span>{label}</span>
    </label>
  );
}

function getPlanKind(selectedPlan: SubscriptionPlanCode): PlanKind {
  return selectedPlan === 'cv_business' ? 'cv' : selectedPlan;
}

function getOptionLabel(option: SelectOption, language: SupportedLanguage): string {
  if (language === 'ar') return option.labelAr;
  if (language === 'en') return option.labelEn || option.labelFr;
  if (language === 'it') return option.labelIt || option.labelFr;
  if (language === 'ru') return option.labelRu || option.labelFr;
  return option.labelFr;
}

function isSupportedLanguage(language: string): language is SupportedLanguage {
  return ['fr', 'ar', 'en', 'it', 'ru'].includes(language);
}

function createRequestId(): string {
  return createRegistrationRequestId();
}
