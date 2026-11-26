/** Versioned creation input. Requested choices never grant paid entitlements. */
export interface CreationDossier {
  schemaVersion: 1;
  plan: 'artisan' | 'premium';
  companyName: string;
  managerName: string;
  phone: string;
  email: string;
  sector: string;
  governorate: string;
  city: string;
  assistance: 'autonomous' | 'assisted';
  presentationModel: 'business' | 'portfolio' | null;
  palette: 'prestige' | 'ivory' | 'night' | null;
  openingStyle: 'photo' | 'framed' | null;
  address: string;
  openingHours: string;
  googleMapsUrl: string;
  googleReviewsUrl: string;
  logoChoice: 'existing' | 'create' | 'none';
  logoUrl: string;
  photoUrls: string[];
  productsDescription: string;
  activityDescription: string;
  notes: string;
  socialLinks: Record<'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'website' | 'other' | 'whatsapp' | 'googleBusiness', string>;
  selectedPlatforms: string[];
  preferredContactMethods: Array<'whatsapp' | 'phone' | 'email'>;
  preferredContactTimes: Array<'morning' | 'afternoon' | 'evening' | 'anytime'>;
  pricing: { currency: 'TND'; creationAmount: 30 | 59; logoAmount: 0 | 20; totalAmount: number; maintenanceAnnualAmount: 50; firstYearIncluded: true; maintenanceOptional: true };
}

type Identity = Pick<CreationDossier, 'companyName' | 'managerName' | 'phone' | 'email' | 'sector' | 'governorate' | 'city'> & { selectedPlan: string };
type Result = { ok: true; value: CreationDossier | null } | { ok: false; message: string; field: string };
const SOCIAL_KEYS = ['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin', 'website', 'other', 'whatsapp', 'googleBusiness'] as const;
const PLATFORMS = ['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin', 'website', 'other', 'whatsapp_business', 'google_business', 'none'];
const SOCIAL_QUOTA_KEYS = ['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin', 'other'];

export function validateCreationDossier(input: unknown, identity: Identity): Result {
  // Old cached clients remain receivable, but no model, price or rights are guessed.
  if (input === undefined || input === null) return { ok: true, value: null };
  try {
    const raw = object(input, 'creationDossier');
    if (raw.schemaVersion !== 1) fail('schemaVersion');
    const plan = choice(identity.selectedPlan, ['artisan', 'premium'] as const, 'plan');
    if (!identity.email) fail('email');
    const assistance = choice(raw.assistance, ['autonomous', 'assisted'] as const, 'assistance');
    const presentationModel = optionalChoice(raw.presentationModel, ['business', 'portfolio'] as const, 'presentationModel');
    const palette = optionalChoice(raw.palette, ['prestige', 'ivory', 'night'] as const, 'palette');
    const openingStyle = optionalChoice(raw.openingStyle, ['photo', 'framed'] as const, 'openingStyle');
    if (plan === 'artisan' && (!presentationModel || !palette || !openingStyle)) fail('presentation');
    const logoChoice = choice(raw.logoChoice, ['existing', 'create', 'none'] as const, 'logoChoice');
    const photoUrls = array(raw.photoUrls, 'photoUrls', plan === 'premium' ? 10 : 5).map((link, index) => url(link, `photoUrls.${index}`));
    if (photoUrls.some(link => !link)) fail('photoUrls');
    const selectedPlatforms = choices(raw.selectedPlatforms, PLATFORMS, 'selectedPlatforms');
    if (selectedPlatforms.includes('none') && selectedPlatforms.length !== 1) fail('selectedPlatforms');
    if (plan === 'artisan' && selectedPlatforms.filter(value => SOCIAL_QUOTA_KEYS.includes(value)).length > 2) fail('selectedPlatforms');
    const rawLinks = object(raw.socialLinks, 'socialLinks');
    const socialLinks = Object.fromEntries(SOCIAL_KEYS.map(key => [key, key === 'whatsapp' ? phone(rawLinks[key], key) : url(rawLinks[key], key)])) as CreationDossier['socialLinks'];
    const platformToLink: Record<string, keyof typeof socialLinks> = { whatsapp_business: 'whatsapp', google_business: 'googleBusiness' };
    for (const selected of selectedPlatforms) {
      if (selected !== 'none' && !socialLinks[platformToLink[selected] || selected as keyof typeof socialLinks]) fail(`socialLinks.${selected}`);
    }
    // Do not allow quota bypass by sending links hidden from selectedPlatforms.
    if (plan === 'artisan' && SOCIAL_QUOTA_KEYS.filter(key => socialLinks[key as keyof typeof socialLinks]).length > 2) fail('socialLinks');
    const preferredContactMethods = choices(raw.preferredContactMethods, ['whatsapp', 'phone', 'email'] as const, 'preferredContactMethods');
    const preferredContactTimes = choices(raw.preferredContactTimes, ['morning', 'afternoon', 'evening', 'anytime'] as const, 'preferredContactTimes');
    if (!preferredContactMethods.length || !preferredContactTimes.length) fail('contactPreferences');
    if (preferredContactTimes.includes('anytime') && preferredContactTimes.length > 1) fail('preferredContactTimes');
    const creationAmount = plan === 'artisan' ? 30 : 59;
    const logoAmount = logoChoice === 'create' ? 20 : 0;
    return { ok: true, value: {
      schemaVersion: 1, plan,
      companyName: identity.companyName, managerName: identity.managerName, phone: identity.phone,
      email: identity.email, sector: identity.sector, governorate: identity.governorate, city: identity.city,
      assistance, presentationModel, palette, openingStyle, logoChoice,
      address: text(raw.address, 'address', 500), openingHours: text(raw.openingHours, 'openingHours', 2500, true),
      googleMapsUrl: url(raw.googleMapsUrl, 'googleMapsUrl'), googleReviewsUrl: url(raw.googleReviewsUrl, 'googleReviewsUrl'),
      logoUrl: logoChoice === 'existing' ? url(raw.logoUrl, 'logoUrl') : '', photoUrls,
      productsDescription: text(raw.productsDescription, 'productsDescription', 6000, true),
      activityDescription: text(raw.activityDescription, 'activityDescription', 1500, true),
      notes: text(raw.notes, 'notes', 1500, true), socialLinks, selectedPlatforms, preferredContactMethods, preferredContactTimes,
      pricing: { currency: 'TND', creationAmount, logoAmount, totalAmount: creationAmount + logoAmount, maintenanceAnnualAmount: 50, firstYearIncluded: true, maintenanceOptional: true },
    } };
  } catch (error) {
    return { ok: false, field: `creationDossier.${error instanceof Error ? error.message : 'invalid'}`, message: 'Le dossier de création contient une information invalide ou trop longue.' };
  }
}

function fail(field: string): never { throw new Error(field); }
function object(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(field);
  return value as Record<string, unknown>;
}
function text(value: unknown, field: string, limit: number, multiline = false): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') fail(field);
  const clean = Array.from(value.replace(/\r\n/g, '\n'), character => {
    const code = character.charCodeAt(0);
    if (multiline && [9, 10, 13].includes(code)) return character;
    return code <= 31 || code === 127 ? ' ' : character;
  }).join('').trim();
  if (clean.length > limit) fail(field);
  return multiline ? clean : clean.replace(/\s+/g, ' ');
}
function choice<T extends string>(value: unknown, allowed: readonly T[], field: string): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) fail(field);
  return value as T;
}
function optionalChoice<T extends string>(value: unknown, allowed: readonly T[], field: string): T | null {
  return value === undefined || value === null ? null : choice(value, allowed, field);
}
function array(value: unknown, field: string, max: number): unknown[] {
  if (!Array.isArray(value) || value.length > max) fail(field);
  return value;
}
function choices<T extends string>(value: unknown, allowed: readonly T[], field: string): T[] {
  return [...new Set(array(value, field, allowed.length).map(item => choice(item, allowed, field)))];
}
function url(value: unknown, field: string): string {
  const raw = text(value, field, 2048);
  if (!raw) return '';
  try {
    const parsed = new URL(raw);
    if (!['https:', 'http:'].includes(parsed.protocol) || !parsed.hostname.includes('.') || parsed.username || parsed.password) fail(field);
    return parsed.toString();
  } catch { return fail(field); }
}
function phone(value: unknown, field: string): string {
  const raw = text(value, field, 24);
  if (!raw) return '';
  const normalized = (raw.startsWith('+') ? '+' : '') + raw.replace(/\D/g, '');
  if (!/^\+?\d{8,15}$/.test(normalized)) fail(field);
  return normalized;
}
