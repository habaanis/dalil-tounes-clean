import { supabase, supabaseAnonKey, supabaseUrl } from './supabaseClient';
import type { RegistrationMode } from './businessRegistrationValidation';

export interface CreationDossierInput {
  schemaVersion: 1;
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
}

export interface CreationDossier extends CreationDossierInput {
  plan: 'artisan' | 'premium';
  companyName: string;
  managerName: string;
  phone: string;
  email: string;
  sector: string;
  governorate: string;
  city: string;
  pricing: {
    currency: 'TND';
    creationAmount: 30 | 59;
    logoAmount: 0 | 20;
    totalAmount: number;
    maintenanceAnnualAmount: 50;
    firstYearIncluded: true;
    maintenanceOptional: true;
  };
}

export type RegistrationIntegrationState = 'pending' | 'running' | 'ok' | 'failed' | 'unknown';
export type RegistrationIntegrationStatus = Partial<Record<'airtable' | 'notification', {
  status: RegistrationIntegrationState;
  attempts: number;
  updated_at: string;
  last_error?: string | null;
}>>;

export interface BusinessRegistrationRequest {
  mode: RegistrationMode | 'legacy_suggestion';
  language: string;
  sourcePage: 'inscription-entreprise' | 'subscription' | 'businesses' | 'medical-transport';
  requestId: string;
  elapsedMs: number;
  verificationField: string;
  selectedPlan?: string;
  title?: string;
  companyName?: string;
  managerName?: string;
  phone: string;
  email: string;
  governorate?: string;
  city?: string;
  sector?: string;
  address?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  selectedPlatforms?: string[];
  requestedBillingPeriod?: string;
  requestedPaymentSchedule?: string;
  preferredContactMethod?: string;
  preferredContactTime?: string;
  description?: string;
  message: string;
  consent?: boolean;
  legacyType?: 'general' | 'medical_transport';
  presentationModel?: string;
  palette?: string;
  creationDossier?: CreationDossierInput;
}

export interface LegacySuggestionRequest {
  language: string;
  sourcePage: 'businesses' | 'medical-transport';
  legacyType: 'general' | 'medical_transport';
  title: string;
  phone: string;
  email: string;
  message: string;
  elapsedMs: number;
}

export interface BusinessRegistrationResponse {
  success: true;
  id: string;
  duplicate?: boolean;
  integration_status?: RegistrationIntegrationStatus;
  integrations?: {
    airtable: 'ok' | 'failed' | 'skipped' | 'pending' | 'unknown';
    notification: 'ok' | 'failed' | 'skipped' | 'pending' | 'unknown';
  };
}

export type BusinessRegistrationErrorCode =
  | 'validation_error'
  | 'network_error'
  | 'timeout'
  | 'rate_limited'
  | 'submission_rejected'
  | 'request_conflict'
  | 'server_error'
  | 'unknown_error';

export class BusinessRegistrationError extends Error {
  readonly code: BusinessRegistrationErrorCode;

  constructor(code: BusinessRegistrationErrorCode, message: string) {
    super(message);
    this.name = 'BusinessRegistrationError';
    this.code = code;
  }
}

export async function submitBusinessRegistration(
  request: BusinessRegistrationRequest,
): Promise<BusinessRegistrationResponse> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 20_000);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const endpoint = window.location.hostname.endsWith('.vercel.app')
      ? '/api/preview-company-registration'
      : `${supabaseUrl}/functions/v1/submit-company-registration`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${session?.access_token || supabaseAnonKey}`,
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    let body: Partial<BusinessRegistrationResponse> & { error?: string; code?: string };
    try {
      const parsed = await response.json();
      body = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      body = { error: 'Invalid server response' };
    }

    if (!response.ok || body.success !== true || typeof body.id !== 'string' || !UUID_PATTERN.test(body.id)) {
      const code: BusinessRegistrationErrorCode =
        response.status === 429 ? 'rate_limited'
          : body.code === 'submission_rejected' ? 'submission_rejected'
            : response.status === 409 ? 'request_conflict'
          : response.status === 400 || response.status === 422
          ? 'validation_error'
          : response.status === 408 || response.status === 504
            ? 'timeout'
            : 'server_error';
      throw new BusinessRegistrationError(code, body.error || 'Request failed');
    }

    return body as BusinessRegistrationResponse;
  } catch (error) {
    if (error instanceof BusinessRegistrationError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new BusinessRegistrationError('timeout', 'Request timed out');
    }
    if (error instanceof TypeError) {
      throw new BusinessRegistrationError('network_error', error.message);
    }
    throw new BusinessRegistrationError('unknown_error', 'Unexpected request error');
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function submitLegacySuggestion(request: LegacySuggestionRequest) {
  return submitBusinessRegistration({
    mode: 'legacy_suggestion',
    language: request.language,
    sourcePage: request.sourcePage,
    legacyType: request.legacyType,
    requestId: createRequestId(),
    elapsedMs: request.elapsedMs,
    verificationField: '',
    title: request.title,
    phone: request.phone,
    email: request.email,
    message: request.message,
  });
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createRegistrationRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') crypto.getRandomValues(bytes);
  else for (let index = 0; index < bytes.length; index++) bytes[index] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const createRequestId = createRegistrationRequestId;

// Existing form props carry translated labels. Keep that interface while storing stable IDs.
export function resolveCreationModel(label: string): CreationDossierInput['presentationModel'] {
  const value = label.toLowerCase().replace(/\s/g, '');
  return value === 'cvbusiness' || value === 'businesscv' ? 'business'
    : value === 'cvportfolio' || value === 'portfoliocv' ? 'portfolio' : null;
}

export function resolveCreationPalette(label: string): CreationDossierInput['palette'] {
  const labels = {
    prestige: ['Vert Prestige', 'الأخضر الفاخر', 'Green Prestige', 'Verde Prestige', 'Зеленый Престиж'],
    ivory: ['Ivoire & Or', 'العاج والذهب', 'Ivory & Gold', 'Avorio & Oro', 'Слоновая кость и золото'],
    night: ['Bleu Nuit & Champagne', 'الأزرق الليلي والشامبانيا', 'Night Blue & Champagne', 'Blu Notte & Champagne', 'Ночной синий и шампань'],
  } as const;
  return (Object.keys(labels) as Array<keyof typeof labels>).find(key => (labels[key] as readonly string[]).includes(label)) || null;
}
