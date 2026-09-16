export type RegistrationMode = 'company_registration' | 'subscription' | 'legacy_suggestion';

export interface RawRegistrationRequest {
  mode?: unknown;
  language?: unknown;
  sourcePage?: unknown;
  requestId?: unknown;
  elapsedMs?: unknown;
  verificationField?: unknown;
  selectedPlan?: unknown;
  title?: unknown;
  companyName?: unknown;
  managerName?: unknown;
  phone?: unknown;
  email?: unknown;
  governorate?: unknown;
  city?: unknown;
  sector?: unknown;
  address?: unknown;
  website?: unknown;
  facebook?: unknown;
  instagram?: unknown;
  whatsapp?: unknown;
  selectedPlatforms?: unknown;
  requestedBillingPeriod?: unknown;
  requestedPaymentSchedule?: unknown;
  preferredContactMethod?: unknown;
  preferredContactTime?: unknown;
  description?: unknown;
  message?: unknown;
  consent?: unknown;
  legacyType?: unknown;
}

export interface NormalizedRegistrationRequest {
  mode: RegistrationMode;
  language: 'fr' | 'ar' | 'en' | 'it' | 'ru';
  sourcePage: 'inscription-entreprise' | 'subscription' | 'businesses' | 'medical-transport';
  requestId: string;
  elapsedMs: number;
  verificationField: string;
  selectedPlan: string;
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
  selectedPlatforms: string[];
  requestedBillingPeriod: string;
  requestedPaymentSchedule: string;
  preferredContactMethod: string;
  preferredContactTime: string;
  description: string;
  message: string;
  consent: boolean;
  legacyType: 'general' | 'medical_transport' | '';
}

export type ValidationResult =
  | { ok: true; value: NormalizedRegistrationRequest }
  | { ok: false; code: 'spam' | 'validation_error'; message: string; field?: string };

const LANGUAGES = new Set(['fr', 'ar', 'en', 'it', 'ru']);

const GOVERNORATES = new Set([
  'Ariana',
  'Béja',
  'Ben Arous',
  'Bizerte',
  'Gabès',
  'Gafsa',
  'Jendouba',
  'Kairouan',
  'Kasserine',
  'Kébili',
  'Le Kef',
  'Mahdia',
  'La Manouba',
  'Médenine',
  'Monastir',
  'Nabeul',
  'Sfax',
  'Sidi Bouzid',
  'Siliana',
  'Sousse',
  'Tataouine',
  'Tozeur',
  'Tunis',
  'Zaghouan',
]);

const SECTORS = new Set([
  'Artisanat',
  'Commerce',
  'Services aux particuliers',
  'Services aux entreprises',
  'Bâtiment et travaux',
  'Automobile',
  'Santé',
  'Beauté et bien-être',
  'Restauration et alimentation',
  'Tourisme et loisirs',
  'Éducation et formation',
  'Transport et logistique',
  'Informatique et numérique',
  'Finance, assurance et conseil',
  'Agriculture et environnement',
  'Industrie',
  'Profession libérale',
  'Association ou organisation',
  'Autre',
]);

const PLATFORMS = new Set([
  'facebook',
  'instagram',
  'whatsapp_business',
  'google_business',
  'website',
  'other',
  'none',
]);
const BILLING_PERIODS = new Set(['monthly', 'annual', 'advice']);
const SUBSCRIPTION_PLANS = new Set(['cv_business', 'artisan', 'premium']);
const CV_PAYMENT_SCHEDULES = new Set([
  'one_payment',
  'two_installments',
  'three_installments',
  'advice',
]);
const ANNUAL_PAYMENT_SCHEDULES = new Set(['one_payment', 'three_installments']);
const CONTACT_METHODS = new Set(['whatsapp', 'phone', 'email']);
const CONTACT_TIMES = new Set(['morning', 'afternoon', 'evening', 'anytime']);

const MIN_FORM_TIME_MS = 1_000;
const MAX_FORM_TIME_MS = 7 * 24 * 60 * 60 * 1000;

export function validateRegistrationRequest(raw: RawRegistrationRequest): ValidationResult {
  const mode = raw.mode === 'subscription'
    ? 'subscription'
    : raw.mode === 'company_registration'
      ? 'company_registration'
      : raw.mode === 'legacy_suggestion'
        ? 'legacy_suggestion'
        : null;
  if (!mode) return invalid('Mode de formulaire invalide.', 'mode');

  const verificationField = singleLine(raw.verificationField, 200);
  if (verificationField) {
    return { ok: false, code: 'spam', message: 'Submission rejected.' };
  }

  const elapsedMs = numberValue(raw.elapsedMs);
  if (!Number.isFinite(elapsedMs) || elapsedMs < MIN_FORM_TIME_MS || elapsedMs > MAX_FORM_TIME_MS) {
    return { ok: false, code: 'spam', message: 'Submission rejected.' };
  }

  const requestId = singleLine(raw.requestId, 100);
  if (!/^[a-zA-Z0-9-]{10,100}$/.test(requestId)) {
    return invalid('Identifiant de demande invalide.', 'requestId');
  }

  const languageRaw = singleLine(raw.language, 10).toLowerCase();
  const language = LANGUAGES.has(languageRaw) ? languageRaw as NormalizedRegistrationRequest['language'] : 'fr';

  const phone = normalizePhone(singleLine(raw.phone, 24));
  const email = normalizeEmail(singleLine(raw.email, 180));
  const message = multiline(raw.message, mode === 'subscription' ? 1500 : 1200);

  if (mode === 'legacy_suggestion') {
    const title = singleLine(raw.title, 140);
    const sourcePage = raw.sourcePage === 'businesses'
      ? 'businesses'
      : raw.sourcePage === 'medical-transport'
        ? 'medical-transport'
        : null;
    const legacyType = raw.legacyType === 'general'
      ? 'general'
      : raw.legacyType === 'medical_transport'
        ? 'medical_transport'
        : null;

    if (!sourcePage || !legacyType) return invalid('Source de formulaire invalide.', 'sourcePage');
    if ((sourcePage === 'businesses') !== (legacyType === 'general')) {
      return invalid('Type de formulaire invalide.', 'legacyType');
    }
    if (title.length < 2) return invalid('Le titre de la demande est obligatoire.', 'title');
    if (!phone && !email) return invalid('Indiquez un téléphone ou un email.', 'phone');
    if (phone && !isValidPhone(phone)) return invalid('Numéro de téléphone invalide.', 'phone');
    if (email && !isValidEmail(email)) return invalid('Adresse email invalide.', 'email');
    if (message.length < 3) return invalid('Décrivez brièvement votre demande.', 'message');

    return {
      ok: true,
      value: {
        mode,
        language,
        sourcePage,
        requestId,
        elapsedMs,
        verificationField: '',
        selectedPlan: '',
        title,
        companyName: title,
        managerName: '',
        phone,
        email,
        governorate: '',
        city: '',
        sector: '',
        address: '',
        website: '',
        facebook: '',
        instagram: '',
        whatsapp: '',
        selectedPlatforms: [],
        requestedBillingPeriod: '',
        requestedPaymentSchedule: '',
        preferredContactMethod: '',
        preferredContactTime: '',
        description: '',
        message,
        consent: false,
        legacyType,
      },
    };
  }

  if (mode === 'subscription') {
    const selectedPlan = singleLine(raw.selectedPlan, 80);
    if (!SUBSCRIPTION_PLANS.has(selectedPlan)) {
      return invalid('Formule sélectionnée invalide.', 'selectedPlan');
    }
    const planKind = getPlanKind(selectedPlan);
    const title = planKind === 'premium'
      ? 'Demande — Formule Premium'
      : planKind === 'artisan'
        ? 'Demande — Formule Artisan'
        : 'Demande — CV Business';
    const companyName = singleLine(raw.companyName, 160);
    const managerName = singleLine(raw.managerName, 120);
    const governorate = singleLine(raw.governorate, 80);
    const city = singleLine(raw.city, 100);
    const sector = singleLine(raw.sector, 100);
    const website = normalizeUrl(singleLine(raw.website, 300));
    const facebook = normalizeUrl(singleLine(raw.facebook, 300), 'facebook');
    const instagram = normalizeUrl(singleLine(raw.instagram, 300), 'instagram');
    const whatsapp = normalizePhone(singleLine(raw.whatsapp, 24));
    const selectedPlatforms = stringArray(raw.selectedPlatforms, PLATFORMS, 7);
    const requestedBillingPeriod = singleLine(raw.requestedBillingPeriod, 40);
    const requestedPaymentSchedule = singleLine(raw.requestedPaymentSchedule, 60);
    const preferredContactMethod = singleLine(raw.preferredContactMethod, 40);
    const preferredContactTime = singleLine(raw.preferredContactTime, 40);
    const consent = raw.consent === true;

    if (companyName.length < 2) return invalid('Nom de l’activité obligatoire.', 'companyName');
    if (managerName.length < 2) return invalid('Nom du responsable obligatoire.', 'managerName');
    if (!phone || !isValidPhone(phone)) return invalid('Numéro de téléphone invalide.', 'phone');
    if (email && !isValidEmail(email)) return invalid('Adresse email invalide.', 'email');
    if (!GOVERNORATES.has(governorate)) return invalid('Gouvernorat invalide.', 'governorate');
    if (city.length < 2) return invalid('Ville obligatoire.', 'city');
    if (!SECTORS.has(sector)) return invalid('Secteur invalide.', 'sector');
    if (website && !isValidUrl(website)) return invalid('Site web invalide.', 'website');
    if (facebook && !isValidUrl(facebook, 'facebook')) return invalid('Lien Facebook invalide.', 'facebook');
    if (instagram && !isValidUrl(instagram, 'instagram')) return invalid('Lien Instagram invalide.', 'instagram');
    if (whatsapp && !isValidPhone(whatsapp)) return invalid('Numéro WhatsApp invalide.', 'whatsapp');
    if (planKind === 'cv' && !CV_PAYMENT_SCHEDULES.has(requestedPaymentSchedule)) {
      return invalid('Mode de paiement invalide.', 'requestedPaymentSchedule');
    }
    if (planKind !== 'cv' && !BILLING_PERIODS.has(requestedBillingPeriod)) {
      return invalid('Durée d’abonnement invalide.', 'requestedBillingPeriod');
    }
    if (
      planKind !== 'cv' &&
      requestedBillingPeriod === 'annual' &&
      !ANNUAL_PAYMENT_SCHEDULES.has(requestedPaymentSchedule)
    ) {
      return invalid('Mode de paiement annuel invalide.', 'requestedPaymentSchedule');
    }
    if (!CONTACT_METHODS.has(preferredContactMethod)) {
      return invalid('Préférence de contact invalide.', 'preferredContactMethod');
    }
    if (preferredContactMethod === 'email' && !email) {
      return invalid('Email obligatoire pour ce mode de contact.', 'email');
    }
    if (!CONTACT_TIMES.has(preferredContactTime)) {
      return invalid('Moment de contact invalide.', 'preferredContactTime');
    }
    if (!consent) return invalid('Consentement obligatoire.', 'consent');

    return {
      ok: true,
      value: {
        mode,
        language,
        sourcePage: 'subscription',
        requestId,
        elapsedMs,
        verificationField: '',
        selectedPlan,
        title,
        companyName,
        managerName,
        phone,
        email,
        governorate,
        city,
        sector,
        address: '',
        website,
        facebook,
        instagram,
        whatsapp,
        selectedPlatforms,
        requestedBillingPeriod: planKind === 'cv' ? '' : requestedBillingPeriod,
        requestedPaymentSchedule:
          planKind !== 'cv' && requestedBillingPeriod !== 'annual'
            ? ''
            : requestedPaymentSchedule,
        preferredContactMethod,
        preferredContactTime,
        description: '',
        message,
        consent,
        legacyType: '',
      },
    };
  }

  const companyName = singleLine(raw.companyName, 160);
  const managerName = singleLine(raw.managerName, 120);
  const governorate = singleLine(raw.governorate, 80);
  const city = singleLine(raw.city, 100);
  const sector = singleLine(raw.sector, 100);
  const address = singleLine(raw.address, 240);
  const website = normalizeUrl(singleLine(raw.website, 300));
  const facebook = normalizeUrl(singleLine(raw.facebook, 300), 'facebook');
  const instagram = normalizeUrl(singleLine(raw.instagram, 300), 'instagram');
  const whatsapp = normalizePhone(singleLine(raw.whatsapp, 24));
  const description = multiline(raw.description, 800);
  const consent = raw.consent === true;

  if (companyName.length < 2) return invalid('Nom de l’entreprise obligatoire.', 'companyName');
  if (managerName.length < 2) return invalid('Nom du responsable obligatoire.', 'managerName');
  if (!phone || !isValidPhone(phone)) return invalid('Numéro de téléphone invalide.', 'phone');
  if (email && !isValidEmail(email)) return invalid('Adresse email invalide.', 'email');
  if (!GOVERNORATES.has(governorate)) return invalid('Gouvernorat invalide.', 'governorate');
  if (city.length < 2) return invalid('Ville obligatoire.', 'city');
  if (!SECTORS.has(sector)) return invalid('Secteur invalide.', 'sector');
  if (website && !isValidUrl(website)) return invalid('Site web invalide.', 'website');
  if (facebook && !isValidUrl(facebook, 'facebook')) return invalid('Lien Facebook invalide.', 'facebook');
  if (instagram && !isValidUrl(instagram, 'instagram')) return invalid('Lien Instagram invalide.', 'instagram');
  if (whatsapp && !isValidPhone(whatsapp)) return invalid('Numéro WhatsApp invalide.', 'whatsapp');
  if (!consent) return invalid('Consentement obligatoire.', 'consent');

  return {
    ok: true,
    value: {
      mode,
      language,
      sourcePage: 'inscription-entreprise',
      requestId,
      elapsedMs,
      verificationField: '',
      selectedPlan: '',
      title: `Inscription entreprise - ${companyName}`,
      companyName,
      managerName,
      phone,
      email,
      governorate,
      city,
      sector,
      address,
      website,
      facebook,
      instagram,
      whatsapp,
      selectedPlatforms: [],
      requestedBillingPeriod: '',
      requestedPaymentSchedule: '',
      preferredContactMethod: '',
      preferredContactTime: '',
      description,
      message,
      consent,
      legacyType: '',
    },
  };
}

function getPlanKind(selectedPlan: string): 'cv' | 'artisan' | 'premium' {
  if (selectedPlan === 'premium') return 'premium';
  if (selectedPlan === 'artisan') return 'artisan';
  return 'cv';
}

function stringArray(raw: unknown, allowed: Set<string>, maxItems: number): string[] {
  if (!Array.isArray(raw)) return [];
  const values = Array.from(new Set(
    raw
      .map((value) => singleLine(value, 60))
      .filter((value) => allowed.has(value)),
  )).slice(0, maxItems);
  return values.includes('none') ? ['none'] : values;
}

function invalid(message: string, field?: string): ValidationResult {
  return { ok: false, code: 'validation_error', message, field };
}

function singleLine(value: unknown, maxLength: number): string {
  return stripControlCharacters(String(value ?? ''), false)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function multiline(value: unknown, maxLength: number): string {
  return stripControlCharacters(String(value ?? '').replace(/\r\n/g, '\n'), true)
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength);
}

function stripControlCharacters(value: string, preserveLayout: boolean): string {
  return Array.from(value, (character) => {
    const code = character.charCodeAt(0);
    if (preserveLayout && (code === 9 || code === 10 || code === 13)) return character;
    if (code <= 31 || code === 127) return preserveLayout ? '' : ' ';
    return character;
  }).join('');
}

function numberValue(value: unknown): number {
  return typeof value === 'number' ? value : Number(value);
}

function normalizePhone(value: string): string {
  const hasLeadingPlus = value.startsWith('+');
  const digits = value.replace(/\D/g, '');
  return digits ? `${hasLeadingPlus ? '+' : ''}${digits}` : '';
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (value.startsWith('+216')) return digits.length === 11;
  if (!value.startsWith('+') && digits.length === 8) return true;
  return digits.length >= 8 && digits.length <= 15;
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeUrl(value: string, network?: 'facebook' | 'instagram'): string {
  if (!value) return '';
  if (network && value.startsWith('@')) {
    const handle = value.slice(1).replace(/[^a-zA-Z0-9._-]/g, '');
    return handle ? `https://${network}.com/${handle}` : '';
  }
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function isValidUrl(value: string, network?: 'facebook' | 'instagram'): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    if ((url.protocol !== 'http:' && url.protocol !== 'https:') || !hostname.includes('.')) return false;

    if (network === 'facebook') {
      return hostname === 'facebook.com' || hostname.endsWith('.facebook.com');
    }
    if (network === 'instagram') {
      return hostname === 'instagram.com' || hostname.endsWith('.instagram.com');
    }
    return true;
  } catch {
    return false;
  }
}
