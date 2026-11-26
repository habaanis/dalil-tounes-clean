import type { CreationDossier, RegistrationIntegrationState, RegistrationIntegrationStatus } from './businessRegistration';
export type { CreationDossier } from './businessRegistration';

export type RegistrationPlan = 'artisan' | 'premium';
export type RegistrationStatus = 'received' | 'draft' | 'paid' | 'published' | 'active';
export type RegistrationAccountStatus = 'not_ready' | 'missing' | 'unverified' | 'ready' | 'linked' | 'conflict';
export type IntegrationState = RegistrationIntegrationState;


export interface Registration {
  id: string;
  version: number;
  created_at: string;
  name: string;
  city: string | null;
  email: string | null;
  phone: string | null;
  requested_plan: RegistrationPlan;
  status: RegistrationStatus;
  legacy: boolean;
  source_message: string;
  creation_dossier: CreationDossier | null;
  reviewed_dossier: CreationDossier | null;
  owner_email: string | null;
  entreprise_id: string | null;
  company_name: string | null;
  company_created: boolean;
  confirmed_plan: RegistrationPlan | null;
  payment_amount: number | null;
  payment_reference: string | null;
  payment_received_at: string | null;
  payment_confirmed_at: string | null;
  published_at: string | null;
  assets_ready: boolean;
  owner_linked_at: string | null;
  public_url: string | null;
  account_url: string | null;
  account_status: RegistrationAccountStatus;
  integration_status: RegistrationIntegrationStatus;
}

export interface RegistrationBusiness {
  id: string;
  name: string;
  city: string | null;
  plan: string | null;
  approved: boolean;
  slug: string | null;
}

const statuses = ['received', 'draft', 'paid', 'published', 'active'];
const accountStatuses = ['not_ready', 'missing', 'unverified', 'ready', 'linked', 'conflict'];
const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const optionalString = (value: unknown) => value === null || typeof value === 'string';

export function isRegistration(value: unknown): value is Registration {
  if (!isObject(value)) return false;
  return typeof value.id === 'string' && value.id.length > 0
    && Number.isInteger(value.version) && Number(value.version) >= 0
    && typeof value.name === 'string' && typeof value.created_at === 'string'
    && typeof value.legacy === 'boolean' && typeof value.company_created === 'boolean' && typeof value.assets_ready === 'boolean'
    && typeof value.source_message === 'string'
    && ['artisan', 'premium'].includes(String(value.requested_plan))
    && (value.confirmed_plan === null || ['artisan', 'premium'].includes(String(value.confirmed_plan)))
    && statuses.includes(String(value.status)) && accountStatuses.includes(String(value.account_status))
    && ['city', 'email', 'phone', 'owner_email', 'entreprise_id', 'company_name', 'payment_reference',
      'payment_received_at', 'payment_confirmed_at', 'published_at', 'owner_linked_at', 'public_url', 'account_url']
      .every(key => optionalString(value[key]))
    && (value.payment_amount === null || (typeof value.payment_amount === 'number' && Number.isFinite(value.payment_amount)))
    && (value.creation_dossier === null || isObject(value.creation_dossier))
    && (value.reviewed_dossier === null || isObject(value.reviewed_dossier))
    && isObject(value.integration_status);
}

export function isRegistrationList(value: unknown): value is { dossiers: Registration[]; businesses: RegistrationBusiness[] } {
  if (!isObject(value) || !Array.isArray(value.dossiers) || !Array.isArray(value.businesses)) return false;
  return value.dossiers.every(isRegistration) && value.businesses.every(item => isObject(item)
    && typeof item.id === 'string' && typeof item.name === 'string'
    && optionalString(item.city) && optionalString(item.plan) && optionalString(item.slug)
    && typeof item.approved === 'boolean');
}

const text = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;
const textList = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

// Only the active presentation choices are proposed when a Premium request did
// not choose them. The administrator must explicitly review before preparing.
export function reviewDossier(row: Registration): CreationDossier {
  const input = row.reviewed_dossier || row.creation_dossier;
  const value: Record<string, unknown> = isObject(input) ? input : {};
  const social = isObject(value.socialLinks) ? value.socialLinks : {};
  const plan = row.requested_plan;
  const logoChoice = value.logoChoice === 'create' || value.logoChoice === 'existing' ? value.logoChoice : 'none';
  const creationAmount = plan === 'artisan' ? 30 : 59;
  const logoAmount = logoChoice === 'create' ? 20 : 0;
  return {
    schemaVersion: 1, plan,
    companyName: text(value.companyName, row.name), managerName: text(value.managerName),
    phone: text(value.phone, row.phone || ''), email: text(value.email, row.email || ''),
    sector: text(value.sector), governorate: text(value.governorate), city: text(value.city, row.city || ''),
    assistance: value.assistance === 'assisted' ? 'assisted' : 'autonomous',
    presentationModel: value.presentationModel === 'portfolio' ? 'portfolio' : 'business',
    palette: value.palette === 'ivory' || value.palette === 'night' ? value.palette : 'prestige',
    openingStyle: value.openingStyle === 'framed' ? 'framed' : 'photo',
    address: text(value.address), openingHours: text(value.openingHours), googleMapsUrl: text(value.googleMapsUrl),
    googleReviewsUrl: text(value.googleReviewsUrl), logoChoice, logoUrl: text(value.logoUrl),
    photoUrls: textList(value.photoUrls), productsDescription: text(value.productsDescription),
    activityDescription: text(value.activityDescription), notes: text(value.notes),
    socialLinks: {
      facebook: text(social.facebook), instagram: text(social.instagram), tiktok: text(social.tiktok),
      youtube: text(social.youtube), linkedin: text(social.linkedin), website: text(social.website),
      other: text(social.other), whatsapp: text(social.whatsapp), googleBusiness: text(social.googleBusiness),
    },
    selectedPlatforms: textList(value.selectedPlatforms),
    preferredContactMethods: textList(value.preferredContactMethods).filter((item): item is 'whatsapp' | 'phone' | 'email' => ['whatsapp', 'phone', 'email'].includes(item)),
    preferredContactTimes: textList(value.preferredContactTimes).filter((item): item is 'morning' | 'afternoon' | 'evening' | 'anytime' => ['morning', 'afternoon', 'evening', 'anytime'].includes(item)),
    pricing: { currency: 'TND', creationAmount, logoAmount, totalAmount: creationAmount + logoAmount,
      maintenanceAnnualAmount: 50, firstYearIncluded: true, maintenanceOptional: true },
  };
}

export function registrationTotal(plan: RegistrationPlan, dossier: CreationDossier | null): number {
  return (plan === 'artisan' ? 30 : 59) + (dossier?.logoChoice === 'create' ? 20 : 0);
}

export function safeMiniappUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.origin === 'https://app.dalil-tounes.com' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function hasRetryableRegistrationIntegration(row: Registration): boolean {
  return (['airtable', 'notification'] as const).some(key => ['pending', 'failed'].includes(row.integration_status[key]?.status || ''));
}

export function sameReviewedDossier(actual: CreationDossier | null, expected: CreationDossier): boolean {
  if (!actual) return false;
  return ['companyName', 'city', 'phone', 'activityDescription', 'address', 'openingHours', 'googleMapsUrl',
    'googleReviewsUrl', 'logoChoice', 'logoUrl', 'presentationModel', 'palette', 'openingStyle', 'productsDescription', 'notes']
    .every(key => actual[key as keyof CreationDossier] === expected[key as keyof CreationDossier])
    && JSON.stringify(actual.photoUrls) === JSON.stringify(expected.photoUrls)
    && Object.entries(expected.socialLinks).every(([key, value]) => actual.socialLinks?.[key as keyof CreationDossier['socialLinks']] === value);
}
