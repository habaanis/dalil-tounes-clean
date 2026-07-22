import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { CheckCircle2, Send, ShieldCheck } from 'lucide-react';
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
  type RegistrationMode,
} from '../lib/businessRegistrationValidation';

interface BusinessRegistrationRequestFormProps {
  mode?: RegistrationMode;
  selectedPlan?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

interface FormState {
  title: string;
  companyName: string;
  managerName: string;
  phone: string;
  email: string;
  governorate: string;
  city: string;
  sector: string;
  address: string;
  website: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  description: string;
  message: string;
  consent: boolean;
  verificationField: string;
}

const INITIAL_PUBLIC_STATE: FormState = {
  title: '',
  companyName: '',
  managerName: '',
  phone: '',
  email: '',
  governorate: '',
  city: '',
  sector: '',
  address: '',
  website: '',
  facebook: '',
  instagram: '',
  whatsapp: '',
  description: '',
  message: '',
  consent: false,
  verificationField: '',
};

const COPY = {
  fr: {
    subscriptionTitle: 'Titre de votre demande',
    subscriptionTitlePlaceholder: 'Ex : demande abonnement Premium, inscription entreprise...',
    phone: 'Téléphone',
    phonePlaceholder: '+216 XX XXX XXX',
    email: 'Email',
    emailPlaceholder: 'votre@email.com',
    contactHint: 'Merci d’indiquer au moins un moyen de contact : téléphone ou email.',
    message: 'Message',
    subscriptionMessagePlaceholder:
      'Expliquez brièvement votre activité, votre besoin, votre demande d’abonnement ou votre question...',
    companyName: 'Nom de l’entreprise ou de l’activité',
    managerName: 'Nom du responsable',
    governorate: 'Gouvernorat',
    city: 'Ville',
    sector: 'Secteur ou catégorie',
    choose: 'Sélectionner',
    description: 'Courte description de votre activité',
    descriptionPlaceholder: 'Présentez votre activité en quelques phrases.',
    particularNeed: 'Message ou besoin particulier',
    particularNeedPlaceholder: 'Ajoutez une précision utile pour notre équipe (facultatif).',
    optionalDetails: 'Ajouter mes coordonnées en ligne (facultatif)',
    optionalDetailsHint: 'Vous pourrez aussi transmettre ces informations plus tard.',
    address: 'Adresse',
    website: 'Site web',
    facebook: 'Facebook',
    instagram: 'Instagram',
    whatsapp: 'WhatsApp',
    whatsappHint: 'Laissez vide si votre numéro WhatsApp est le même que votre téléphone.',
    consentPrefix: 'J’accepte que Dalil Tounes utilise ces informations pour traiter ma demande. J’ai lu les',
    terms: 'conditions générales',
    privacy: 'politique de confidentialité',
    cancel: 'Annuler',
    submit: 'Envoyer ma demande',
    submitting: 'Envoi en cours...',
    successTitle: 'Votre demande a bien été envoyée.',
    successText: 'Merci ! L’équipe Dalil Tounes vous contactera prochainement.',
    anotherRequest: 'Envoyer une autre demande',
    requiredCompanyName: 'Indiquez le nom de votre entreprise ou de votre activité.',
    requiredManagerName: 'Indiquez le nom du responsable.',
    requiredPhone: 'Indiquez un numéro de téléphone valide.',
    invalidPhone: 'Le numéro de téléphone semble incorrect.',
    invalidEmail: 'Le format de l’email est incorrect.',
    requiredGovernorate: 'Sélectionnez un gouvernorat.',
    requiredCity: 'Indiquez la ville.',
    requiredSector: 'Sélectionnez un secteur ou une catégorie.',
    requiredConsent: 'Votre consentement est nécessaire pour envoyer la demande.',
    invalidWebsite: 'Le site web semble incorrect.',
    invalidFacebook: 'Le lien Facebook semble incorrect.',
    invalidInstagram: 'Le lien Instagram semble incorrect.',
    invalidWhatsapp: 'Le numéro WhatsApp semble incorrect.',
    requiredTitle: 'Le titre de votre demande est obligatoire.',
    requiredContact: 'Indiquez au moins un téléphone ou un email.',
    requiredMessage: 'Décrivez brièvement votre demande.',
    networkError: 'La connexion a été interrompue. Vérifiez Internet puis réessayez.',
    timeoutError: 'L’envoi prend trop de temps. Veuillez réessayer.',
    serverError: 'La demande n’a pas pu être envoyée. Veuillez réessayer dans quelques instants.',
    formError: 'Vérifiez les informations indiquées puis réessayez.',
  },
  ar: {
    subscriptionTitle: 'عنوان الطلب',
    subscriptionTitlePlaceholder: 'مثال: طلب اشتراك أو تسجيل مؤسسة...',
    phone: 'رقم الهاتف',
    phonePlaceholder: '+216 XX XXX XXX',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'votre@email.com',
    contactHint: 'يرجى إدخال وسيلة اتصال واحدة على الأقل: الهاتف أو البريد الإلكتروني.',
    message: 'الرسالة',
    subscriptionMessagePlaceholder: 'اشرح باختصار نشاطك أو حاجتك أو سؤالك...',
    companyName: 'اسم المؤسسة أو النشاط',
    managerName: 'اسم المسؤول',
    governorate: 'الولاية',
    city: 'المدينة',
    sector: 'القطاع أو الفئة',
    choose: 'اختر',
    description: 'وصف قصير للنشاط',
    descriptionPlaceholder: 'قدّم نشاطك في بضع جمل.',
    particularNeed: 'رسالة أو طلب خاص',
    particularNeedPlaceholder: 'أضف معلومة مفيدة لفريقنا (اختياري).',
    optionalDetails: 'إضافة معلومات الحضور على الإنترنت (اختياري)',
    optionalDetailsHint: 'يمكنك أيضاً إرسال هذه المعلومات لاحقاً.',
    address: 'العنوان',
    website: 'الموقع الإلكتروني',
    facebook: 'فيسبوك',
    instagram: 'إنستغرام',
    whatsapp: 'واتساب',
    whatsappHint: 'اتركه فارغاً إذا كان رقم واتساب هو نفسه رقم الهاتف.',
    consentPrefix: 'أوافق على استعمال دليل تونس لهذه المعلومات لمعالجة طلبي. قرأت',
    terms: 'الشروط العامة',
    privacy: 'سياسة الخصوصية',
    cancel: 'إلغاء',
    submit: 'إرسال طلبي',
    submitting: 'جارٍ الإرسال...',
    successTitle: 'تم إرسال طلبك بنجاح.',
    successText: 'شكراً! سيتصل بك فريق دليل تونس قريباً.',
    anotherRequest: 'إرسال طلب آخر',
    requiredCompanyName: 'أدخل اسم المؤسسة أو النشاط.',
    requiredManagerName: 'أدخل اسم المسؤول.',
    requiredPhone: 'أدخل رقم هاتف صحيحاً.',
    invalidPhone: 'رقم الهاتف غير صحيح.',
    invalidEmail: 'صيغة البريد الإلكتروني غير صحيحة.',
    requiredGovernorate: 'اختر الولاية.',
    requiredCity: 'أدخل المدينة.',
    requiredSector: 'اختر القطاع أو الفئة.',
    requiredConsent: 'الموافقة ضرورية لإرسال الطلب.',
    invalidWebsite: 'رابط الموقع الإلكتروني غير صحيح.',
    invalidFacebook: 'رابط فيسبوك غير صحيح.',
    invalidInstagram: 'رابط إنستغرام غير صحيح.',
    invalidWhatsapp: 'رقم واتساب غير صحيح.',
    requiredTitle: 'عنوان الطلب إجباري.',
    requiredContact: 'أدخل رقم هاتف أو بريداً إلكترونياً على الأقل.',
    requiredMessage: 'اشرح طلبك باختصار.',
    networkError: 'انقطع الاتصال. تحقق من الإنترنت ثم أعد المحاولة.',
    timeoutError: 'استغرق الإرسال وقتاً طويلاً. أعد المحاولة.',
    serverError: 'تعذر إرسال الطلب. أعد المحاولة بعد قليل.',
    formError: 'تحقق من المعلومات ثم أعد المحاولة.',
  },
};

const inputClassName =
  'w-full rounded-xl border border-[#D4AF37]/70 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#4A1D43] focus:ring-2 focus:ring-[#4A1D43]/20 disabled:bg-gray-50 disabled:text-gray-500';

export function BusinessRegistrationRequestForm({
  mode = 'company_registration',
  selectedPlan = '',
  onCancel,
  onSuccess,
}: BusinessRegistrationRequestFormProps) {
  const { language } = useLanguage();
  const text = language === 'ar' ? COPY.ar : COPY.fr;
  const isArabic = language === 'ar';
  const isSubscription = mode === 'subscription';
  const startedAtRef = useRef(Date.now());
  const requestIdRef = useRef(createRequestId());
  const submittingRef = useRef(false);
  const [form, setForm] = useState<FormState>(() => ({
    ...INITIAL_PUBLIC_STATE,
    title: selectedPlan ? `Demande abonnement ${selectedPlan}` : '',
  }));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const setField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  const validate = (): string | null => {
    if (isSubscription) {
      if (!cleanSingleLine(form.title)) return text.requiredTitle;
      if (!form.phone.trim() && !form.email.trim()) return text.requiredContact;
      if (form.phone.trim() && !isValidPhone(form.phone)) return text.invalidPhone;
      if (!isValidEmail(form.email)) return text.invalidEmail;
      if (!cleanMultiline(form.message)) return text.requiredMessage;
      return null;
    }

    if (!cleanSingleLine(form.companyName)) return text.requiredCompanyName;
    if (!cleanSingleLine(form.managerName)) return text.requiredManagerName;
    if (!form.phone.trim()) return text.requiredPhone;
    if (!isValidPhone(form.phone)) return text.invalidPhone;
    if (!isValidEmail(form.email)) return text.invalidEmail;
    if (!form.governorate) return text.requiredGovernorate;
    if (!cleanSingleLine(form.city)) return text.requiredCity;
    if (!form.sector) return text.requiredSector;
    if (!isValidWebAddress(form.website)) return text.invalidWebsite;
    if (!isValidWebAddress(form.facebook, 'facebook')) return text.invalidFacebook;
    if (!isValidWebAddress(form.instagram, 'instagram')) return text.invalidInstagram;
    if (form.whatsapp.trim() && !isValidPhone(form.whatsapp)) return text.invalidWhatsapp;
    if (!form.consent) return text.requiredConsent;
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setErrorMessage('');

    try {
      const request: BusinessRegistrationRequest = isSubscription
        ? {
            mode: 'subscription',
            language,
            sourcePage: 'subscription',
            requestId: requestIdRef.current,
            elapsedMs: Date.now() - startedAtRef.current,
            verificationField: form.verificationField,
            selectedPlan: cleanSingleLine(selectedPlan),
            title: cleanSingleLine(form.title),
            phone: form.phone.trim() ? normalizePhone(form.phone) : '',
            email: normalizeEmail(form.email),
            message: cleanMultiline(form.message),
          }
        : {
            mode: 'company_registration',
            language,
            sourcePage: 'inscription-entreprise',
            requestId: requestIdRef.current,
            elapsedMs: Date.now() - startedAtRef.current,
            verificationField: form.verificationField,
            companyName: cleanSingleLine(form.companyName),
            managerName: cleanSingleLine(form.managerName),
            phone: normalizePhone(form.phone),
            email: normalizeEmail(form.email),
            governorate: cleanSingleLine(form.governorate),
            city: cleanSingleLine(form.city),
            sector: cleanSingleLine(form.sector),
            address: cleanSingleLine(form.address),
            website: normalizeWebAddress(form.website),
            facebook: normalizeWebAddress(form.facebook, 'facebook'),
            instagram: normalizeWebAddress(form.instagram, 'instagram'),
            whatsapp: form.whatsapp.trim() ? normalizePhone(form.whatsapp) : '',
            description: cleanMultiline(form.description),
            message: cleanMultiline(form.message),
            consent: form.consent,
          };

      await submitBusinessRegistration(request);
      setSubmitted(true);
      onSuccess?.();
    } catch (error) {
      if (error instanceof BusinessRegistrationError) {
        if (error.code === 'network_error') setErrorMessage(text.networkError);
        else if (error.code === 'timeout') setErrorMessage(text.timeoutError);
        else if (error.code === 'validation_error') setErrorMessage(text.formError);
        else setErrorMessage(text.serverError);
      } else {
        setErrorMessage(text.serverError);
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ ...INITIAL_PUBLIC_STATE, title: selectedPlan ? `Demande abonnement ${selectedPlan}` : '' });
    setSubmitted(false);
    setErrorMessage('');
    startedAtRef.current = Date.now();
    requestIdRef.current = createRequestId();
  };

  if (submitted && !isSubscription) {
    return (
      <div className="rounded-3xl border border-green-200 bg-white p-7 text-center shadow-sm sm:p-10" role="status">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-9 w-9 text-green-700" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-[#4A1D43]">{text.successTitle}</h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-gray-600">{text.successText}</p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-7 rounded-xl border border-[#D4AF37] bg-white px-6 py-3 text-sm font-bold text-[#4A1D43] transition hover:bg-[#FFF9E8] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
        >
          {text.anotherRequest}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="registration-verification">Ne pas remplir ce champ</label>
        <input
          id="registration-verification"
          type="text"
          name="verificationField"
          value={form.verificationField}
          onChange={setField}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {submitted && isSubscription && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800" role="status">
          <span className="font-semibold">{text.successTitle}</span> {text.successText}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      {isSubscription ? (
        <>
          <FieldLabel label={text.subscriptionTitle} required>
            <input
              type="text"
              name="title"
              required
              maxLength={140}
              value={form.title}
              onChange={setField}
              placeholder={text.subscriptionTitlePlaceholder}
              className={inputClassName}
              disabled={submitting || submitted}
              autoComplete="organization-title"
            />
          </FieldLabel>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldLabel label={text.phone}>
              <input
                type="tel"
                name="phone"
                maxLength={24}
                value={form.phone}
                onChange={setField}
                placeholder={text.phonePlaceholder}
                className={inputClassName}
                disabled={submitting || submitted}
                autoComplete="tel"
                inputMode="tel"
                dir="ltr"
              />
            </FieldLabel>
            <FieldLabel label={text.email}>
              <input
                type="email"
                name="email"
                maxLength={180}
                value={form.email}
                onChange={setField}
                placeholder={text.emailPlaceholder}
                className={inputClassName}
                disabled={submitting || submitted}
                autoComplete="email"
                inputMode="email"
                dir="ltr"
              />
            </FieldLabel>
          </div>

          <p className="text-xs leading-relaxed text-gray-500">{text.contactHint}</p>

          <FieldLabel label={text.message} required>
            <textarea
              name="message"
              required
              rows={5}
              maxLength={1500}
              value={form.message}
              onChange={setField}
              placeholder={text.subscriptionMessagePlaceholder}
              className={`${inputClassName} resize-y`}
              disabled={submitting || submitted}
            />
          </FieldLabel>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#FFFDF7] p-4 text-sm leading-relaxed text-gray-700">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[#4A1D43]" aria-hidden="true" />
              <p>{isArabic ? 'نطلب فقط المعلومات الضرورية لبدء معالجة طلبك.' : 'Nous demandons uniquement les informations utiles pour commencer votre inscription.'}</p>
            </div>
          </div>

          <FieldLabel label={text.companyName} required>
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

          <div className="grid gap-4 md:grid-cols-2">
            <FieldLabel label={text.managerName} required>
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
            <FieldLabel label={text.phone} required>
              <input
                type="tel"
                name="phone"
                required
                maxLength={24}
                value={form.phone}
                onChange={setField}
                placeholder={text.phonePlaceholder}
                className={inputClassName}
                disabled={submitting}
                autoComplete="tel"
                inputMode="tel"
                dir="ltr"
              />
            </FieldLabel>
          </div>

          <FieldLabel label={text.email}>
            <input
              type="email"
              name="email"
              maxLength={180}
              value={form.email}
              onChange={setField}
              placeholder={text.emailPlaceholder}
              className={inputClassName}
              disabled={submitting}
              autoComplete="email"
              inputMode="email"
              dir="ltr"
            />
          </FieldLabel>

          <div className="grid gap-4 md:grid-cols-2">
            <FieldLabel label={text.governorate} required>
              <select
                name="governorate"
                required
                value={form.governorate}
                onChange={setField}
                className={inputClassName}
                disabled={submitting}
                autoComplete="address-level1"
              >
                <option value="">{text.choose}</option>
                {TUNISIA_GOVERNORATES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {isArabic ? option.labelAr : option.labelFr}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label={text.city} required>
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
          </div>

          <FieldLabel label={text.sector} required>
            <select
              name="sector"
              required
              value={form.sector}
              onChange={setField}
              className={inputClassName}
              disabled={submitting}
            >
              <option value="">{text.choose}</option>
              {BUSINESS_SECTORS.map((option) => (
                <option key={option.value} value={option.value}>
                  {isArabic ? option.labelAr : option.labelFr}
                </option>
              ))}
            </select>
          </FieldLabel>

          <FieldLabel label={text.description}>
            <textarea
              name="description"
              rows={4}
              maxLength={800}
              value={form.description}
              onChange={setField}
              placeholder={text.descriptionPlaceholder}
              className={`${inputClassName} resize-y`}
              disabled={submitting}
            />
          </FieldLabel>

          <FieldLabel label={text.particularNeed}>
            <textarea
              name="message"
              rows={3}
              maxLength={1200}
              value={form.message}
              onChange={setField}
              placeholder={text.particularNeedPlaceholder}
              className={`${inputClassName} resize-y`}
              disabled={submitting}
            />
          </FieldLabel>

          <details className="group rounded-2xl border border-gray-200 bg-gray-50/70 p-4 open:bg-white">
            <summary className="cursor-pointer list-none font-semibold text-[#4A1D43] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]">
              <span>{text.optionalDetails}</span>
              <span className="ms-2 inline-block text-[#D4AF37] transition group-open:rotate-180" aria-hidden="true">⌄</span>
            </summary>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">{text.optionalDetailsHint}</p>
            <div className="mt-4 space-y-4">
              <FieldLabel label={text.address}>
                <input
                  type="text"
                  name="address"
                  maxLength={240}
                  value={form.address}
                  onChange={setField}
                  className={inputClassName}
                  disabled={submitting}
                  autoComplete="street-address"
                />
              </FieldLabel>
              <div className="grid gap-4 md:grid-cols-2">
                <FieldLabel label={text.website}>
                  <input
                    type="text"
                    name="website"
                    maxLength={300}
                    value={form.website}
                    onChange={setField}
                    placeholder="www.exemple.tn"
                    className={inputClassName}
                    disabled={submitting}
                    autoComplete="url"
                    inputMode="url"
                    dir="ltr"
                  />
                </FieldLabel>
                <FieldLabel label={text.whatsapp}>
                  <input
                    type="tel"
                    name="whatsapp"
                    maxLength={24}
                    value={form.whatsapp}
                    onChange={setField}
                    placeholder={text.phonePlaceholder}
                    className={inputClassName}
                    disabled={submitting}
                    autoComplete="tel"
                    inputMode="tel"
                    dir="ltr"
                  />
                </FieldLabel>
              </div>
              <p className="-mt-2 text-xs text-gray-500">{text.whatsappHint}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <FieldLabel label={text.facebook}>
                  <input
                    type="text"
                    name="facebook"
                    maxLength={300}
                    value={form.facebook}
                    onChange={setField}
                    placeholder="facebook.com/... ou @nom"
                    className={inputClassName}
                    disabled={submitting}
                    inputMode="url"
                    dir="ltr"
                  />
                </FieldLabel>
                <FieldLabel label={text.instagram}>
                  <input
                    type="text"
                    name="instagram"
                    maxLength={300}
                    value={form.instagram}
                    onChange={setField}
                    placeholder="instagram.com/... ou @nom"
                    className={inputClassName}
                    disabled={submitting}
                    inputMode="url"
                    dir="ltr"
                  />
                </FieldLabel>
              </div>
            </div>
          </details>

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
              {text.consentPrefix}{' '}
              <a href="/cgu" className="font-semibold text-[#4A1D43] underline decoration-[#D4AF37] underline-offset-2">
                {text.terms}
              </a>{' '}
              {isArabic ? 'و' : 'et la'}{' '}
              <a href="/politique-confidentialite" className="font-semibold text-[#4A1D43] underline decoration-[#D4AF37] underline-offset-2">
                {text.privacy}
              </a>.
            </span>
          </label>
        </>
      )}

      <div className={`flex flex-col gap-3 pt-2 ${onCancel ? 'sm:flex-row' : ''}`}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {text.cancel}
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || submitted}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#D4AF37] bg-[#4A1D43] px-5 py-3 text-sm font-bold text-[#D4AF37] shadow-sm transition hover:bg-[#5A2D53] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {submitting ? text.submitting : text.submit}
        </button>
      </div>
    </form>
  );
}

function FieldLabel({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-800">
        {label} {required && <span className="text-[#800020]">*</span>}
      </span>
      {children}
    </label>
  );
}

function createRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}
