import { supabaseAnonKey, supabaseUrl } from './supabaseClient';
import type { RegistrationMode } from './businessRegistrationValidation';

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
  success: boolean;
  id?: string;
  duplicate?: boolean;
  integrations?: {
    airtable: 'ok' | 'failed' | 'skipped';
    notification: 'ok' | 'failed' | 'skipped';
  };
}

export type BusinessRegistrationErrorCode =
  | 'validation_error'
  | 'network_error'
  | 'timeout'
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
    const response = await fetch(`${supabaseUrl}/functions/v1/submit-company-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    let body: BusinessRegistrationResponse & { error?: string; code?: string };
    try {
      body = await response.json();
    } catch {
      body = { success: false, error: 'Invalid server response' };
    }

    if (!response.ok || !body.success) {
      const code: BusinessRegistrationErrorCode =
        response.status === 400 || response.status === 422
          ? 'validation_error'
          : response.status === 408 || response.status === 504
            ? 'timeout'
            : 'server_error';
      throw new BusinessRegistrationError(code, body.error || 'Request failed');
    }

    return body;
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

function createRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `legacy-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}
