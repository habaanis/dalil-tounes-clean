import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  BusinessRegistrationError,
  submitBusinessRegistration,
  type BusinessRegistrationRequest,
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

type SupportedLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';
type PlanKind = 'cv' | 'artisan' | 'premium';
type Platform = 'facebook' | 'instagram' | 'whatsapp_business' | 'google_business' | 'website' | 'other' | 'none';

interface SubscriptionRequestFormProps {
  selectedPlan: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

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
    | 'cv_single_199'
    | 'cv_two_payments'
    | 'cv_three_payments'
    | 'advice'
    | 'annual_single'
    | 'annual_three';
  preferredContactMethod: '' | 'whatsapp' | 'phone' | 'email';
  preferredContactTime: '' | 'morning' | 'afternoon' | 'evening' | 'any';
  message: string;
  consent: boolean;
  verificationField: string;
}

interface FormCopy {
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
  consent: false,
  verificationField: '',
};

const PLATFORMS: Platform[] = [
  'facebook',
  'instagram',
  'whatsapp_business',
  'google_business',
  'website',
  'other',
  'none',
];

const inputClassName =
  'w-full rounded-xl border border-[#D4AF37]/70 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#4A1D43] focus:ring-2 focus:ring-[#4A1D43]/20 disabled:bg-gray-50 disabled:text-gray-500';

export function SubscriptionRequestForm({
  selectedPlan,
  onCancel,
  onSuccess,
}: SubscriptionRequestFormProps) {
  const { language } = useLanguage();
  const currentLanguage = isSupportedLanguage(language) ? language : 'fr';
  const copy = COPY[currentLanguage];
  const isArabic = currentLanguage === 'ar';
  const planKind = getPlanKind(selectedPlan);
  const startedAtRef = useRef(Date.now());
  const requestIdRef = useRef(createRequestId());
  const submittingRef = useRef(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<SubscriptionFormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    setForm((current) => {
      if (platform === 'none') {
        return { ...current, selectedPlatforms: current.selectedPlatforms.includes('none') ? [] : ['none'] };
      }
      const withoutNone = current.selectedPlatforms.filter((item) => item !== 'none');
      return {
        ...current,
        selectedPlatforms: withoutNone.includes(platform)
          ? withoutNone.filter((item) => item !== platform)
          : [...withoutNone, platform],
      };
    });
  };

  const validateStepOne = (): string | null => {
    if (!cleanSingleLine(form.companyName)) return copy.requiredCompanyName;
    if (!cleanSingleLine(form.managerName)) return copy.requiredManagerName;
    if (!form.sector) return copy.requiredSector;
    if (!form.governorate) return copy.requiredGovernorate;
    if (!cleanSingleLine(form.city)) return copy.requiredCity;
    if (!form.phone.trim()) return copy.requiredPhone;
    if (!isValidPhone(form.phone)) return copy.invalidPhone;
    if (!isValidEmail(form.email)) return copy.invalidEmail;
    return null;
  };

  const validateStepTwo = (): string | null => {
    if (planKind === 'cv' && !form.requestedPaymentSchedule) return copy.requiredPaymentSchedule;
    if (planKind !== 'cv' && !form.requestedBillingPeriod) return copy.requiredPlanChoice;
    if (
      planKind !== 'cv' &&
      form.requestedBillingPeriod === 'annual' &&
      !['annual_single', 'annual_three'].includes(form.requestedPaymentSchedule)
    ) {
      return copy.requiredPaymentSchedule;
    }
    if (!form.preferredContactMethod) return copy.requiredContactMethod;
    if (form.preferredContactMethod === 'email' && !form.email.trim()) return copy.emailNeeded;
    if (!form.preferredContactTime) return copy.requiredContactTime;
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
    if (step !== 2 || submittingRef.current) return;

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
      selectedPlan: cleanSingleLine(selectedPlan),
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
      selectedPlatforms: form.selectedPlatforms,
      requestedBillingPeriod: planKind === 'cv' ? '' : form.requestedBillingPeriod,
      requestedPaymentSchedule: form.requestedPaymentSchedule,
      preferredContactMethod: form.preferredContactMethod,
      preferredContactTime: form.preferredContactTime,
      message: cleanMultiline(form.message),
      consent: form.consent,
    };

    try {
      await submitBusinessRegistration(request);
      setSubmitted(true);
      onSuccess?.();
    } catch (error) {
      if (error instanceof BusinessRegistrationError) {
        if (error.code === 'network_error') setErrorMessage(copy.networkError);
        else if (error.code === 'timeout') setErrorMessage(copy.timeoutError);
        else if (error.code === 'validation_error') setErrorMessage(copy.formError);
        else setErrorMessage(copy.serverError);
      } else {
        setErrorMessage(copy.serverError);
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="subscription-request-verification">Do not fill in this field</label>
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
        <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.12em] text-[#4A1D43]">
          <span>{step === 1 ? copy.stepOne : copy.stepTwo}</span>
          <span aria-hidden="true">{step}/2</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#D4AF37]/20">
          <div className={`h-full rounded-full bg-[#D4AF37] transition-all ${step === 1 ? 'w-1/2' : 'w-full'}`} />
        </div>
      </div>

      {submitted && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800" role="status">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          {copy.success}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      {step === 1 ? (
        <section aria-labelledby="subscription-activity-title" className="space-y-4">
          <h3 id="subscription-activity-title" className="text-xl font-bold text-[#4A1D43]">{copy.activityTitle}</h3>
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

          <FieldLabel label={copy.emailOptional}>
            <input
              type="email"
              name="email"
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
      ) : (
        <section aria-labelledby="subscription-request-title" className="space-y-5">
          <h3 id="subscription-request-title" className="text-xl font-bold text-[#4A1D43]">{copy.requestTitle}</h3>

          <div className="rounded-2xl border border-[#D4AF37]/40 bg-[#FFF9E8] p-4">
            <span className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-600">{copy.selectedSolution}</span>
            <strong className="mt-1 block text-base text-[#4A1D43]">{selectedPlan}</strong>
          </div>

          {planKind === 'cv' ? (
            <ChoiceGroup legend={copy.cvPaymentQuestion}>
              <RadioChoice name="requestedPaymentSchedule" value="cv_single_199" checked={form.requestedPaymentSchedule === 'cv_single_199'} onChange={setField} label={copy.cvSingle} />
              <RadioChoice name="requestedPaymentSchedule" value="cv_two_payments" checked={form.requestedPaymentSchedule === 'cv_two_payments'} onChange={setField} label={copy.cvTwo} />
              <RadioChoice name="requestedPaymentSchedule" value="cv_three_payments" checked={form.requestedPaymentSchedule === 'cv_three_payments'} onChange={setField} label={copy.cvThree} />
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
                  <RadioChoice name="requestedPaymentSchedule" value="annual_single" checked={form.requestedPaymentSchedule === 'annual_single'} onChange={setField} label={copy.singlePayment} />
                  <RadioChoice name="requestedPaymentSchedule" value="annual_three" checked={form.requestedPaymentSchedule === 'annual_three'} onChange={setField} label={copy.threePayments} />
                </ChoiceGroup>
              )}

              {planKind === 'premium' && form.requestedBillingPeriod === 'annual' && (
                <p className="rounded-xl border border-[#D4AF37]/50 bg-[#FFF9E8] px-4 py-3 text-sm font-semibold leading-relaxed text-[#4A1D43]">
                  {copy.premiumFlyerInfo}
                </p>
              )}
            </>
          )}

          <ChoiceGroup legend={copy.platformsQuestion}>
            {PLATFORMS.map((platform) => (
              <CheckboxChoice
                key={platform}
                checked={form.selectedPlatforms.includes(platform)}
                onChange={() => togglePlatform(platform)}
                label={copy.platformLabels[platform]}
              />
            ))}
          </ChoiceGroup>

          <details className="group rounded-2xl border border-gray-200 bg-gray-50/70 p-4 open:bg-white">
            <summary className="cursor-pointer list-none font-semibold text-[#4A1D43] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]">
              {copy.linksSummary}
              <span className="ms-2 inline-block text-[#D4AF37] transition group-open:rotate-180" aria-hidden="true">⌄</span>
            </summary>
            <p className="mt-2 text-xs text-gray-500">{copy.linksHint}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <FieldLabel label={copy.website}>
                <input type="text" name="website" maxLength={300} value={form.website} onChange={setField} className={inputClassName} inputMode="url" dir="ltr" />
              </FieldLabel>
              <FieldLabel label={copy.whatsapp}>
                <input type="tel" name="whatsapp" maxLength={24} value={form.whatsapp} onChange={setField} className={inputClassName} inputMode="tel" dir="ltr" />
              </FieldLabel>
              <FieldLabel label={copy.facebook}>
                <input type="text" name="facebook" maxLength={300} value={form.facebook} onChange={setField} className={inputClassName} inputMode="url" dir="ltr" />
              </FieldLabel>
              <FieldLabel label={copy.instagram}>
                <input type="text" name="instagram" maxLength={300} value={form.instagram} onChange={setField} className={inputClassName} inputMode="url" dir="ltr" />
              </FieldLabel>
            </div>
          </details>

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
              <RadioChoice name="preferredContactTime" value="any" checked={form.preferredContactTime === 'any'} onChange={setField} label={copy.anyTime} />
            </ChoiceGroup>
          </div>

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
              className="mt-1 h-5 w-5 flex-none rounded border-gray-300 text-[#4A1D43] focus:ring-[#D4AF37]"
            />
            <span>
              {copy.consentPrefix}{' '}
              <a href="/cgu" className="font-semibold text-[#4A1D43] underline decoration-[#D4AF37] underline-offset-2">{copy.terms}</a>{' '}
              {copy.conjunction}{' '}
              <a href="/politique-confidentialite" className="font-semibold text-[#4A1D43] underline decoration-[#D4AF37] underline-offset-2">{copy.privacy}</a>.
            </span>
          </label>

          <p className="text-center text-sm font-semibold text-[#4A1D43]">{copy.freeNotice}</p>
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
            <button type="button" onClick={continueToStepTwo} disabled={submitting} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-[#4A1D43] px-5 py-3 text-sm font-bold text-[#D4AF37] transition hover:bg-[#5A2D53] disabled:opacity-60">
              {copy.continue}
              {isArabic ? <ArrowLeft className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => { setStep(1); setErrorMessage(''); }} disabled={submitting} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60">
              {isArabic ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : <ArrowLeft className="h-4 w-4" aria-hidden="true" />}
              {copy.back}
            </button>
            <button type="submit" disabled={submitting || submitted} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-[#4A1D43] px-5 py-3 text-sm font-bold text-[#D4AF37] transition hover:bg-[#5A2D53] disabled:cursor-not-allowed disabled:opacity-60">
              <Send className="h-4 w-4" aria-hidden="true" />
              {submitting ? copy.submitting : copy.submit}
            </button>
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
        {label} {required && <span className="text-[#800020]">*</span>}
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
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 text-[#4A1D43] focus:ring-[#D4AF37]" />
      <span>{label}</span>
    </label>
  );
}

function CheckboxChoice({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition has-[:checked]:border-[#D4AF37] has-[:checked]:bg-[#FFF9E8]">
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 rounded text-[#4A1D43] focus:ring-[#D4AF37]" />
      <span>{label}</span>
    </label>
  );
}

function getPlanKind(selectedPlan: string): PlanKind {
  const normalized = selectedPlan.toLowerCase();
  if (normalized.includes('premium') || normalized.includes('بريميوم')) return 'premium';
  if (normalized.includes('artisan') || normalized.includes('حرفي')) return 'artisan';
  return 'cv';
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
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}
