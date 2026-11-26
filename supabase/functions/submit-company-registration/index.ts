import 'jsr:@supabase/functions-js@2.4.4/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import {
  validateRegistrationRequest,
  type NormalizedRegistrationRequest,
  type RawRegistrationRequest,
} from '../_shared/companyRegistration.ts';
import {
  buildNotificationPayload,
  buildSuggestionRow,
} from '../_shared/companyRegistrationRecord.ts';
import { deliverRegistrationIntegrations, integrationSummary, type IntegrationStatus } from '../_shared/companyRegistrationDelivery.ts';

const MAX_BODY_BYTES = 65_536;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DEFAULT_ALLOWED_ORIGINS = [
  'https://dalil-tounes.com',
  'https://www.dalil-tounes.com',
  'https://appli.dalil-tounes.com',
  'https://app.dalil-tounes.com',
  'https://dalil-tounes-pwa.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

Deno.serve(async (request: Request) => {
  const origin = request.headers.get('origin');
  const corsHeaders = buildCorsHeaders(origin);

  if (request.method === 'OPTIONS') {
    if (!isAllowedOrigin(origin)) {
      return json({ success: false, error: 'Origin not allowed' }, 403, corsHeaders);
    }
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return json({ success: false, error: 'Method not allowed' }, 405, corsHeaders);
  }

  if (!isAllowedOrigin(origin)) {
    return json({ success: false, error: 'Origin not allowed' }, 403, corsHeaders);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[submit-company-registration] Missing Supabase environment variables');
    return json({ success: false, error: 'Server configuration error' }, 500, corsHeaders);
  }

  try {
    const contentLength = Number(request.headers.get('content-length') || '0');
    if (contentLength > MAX_BODY_BYTES) {
      return json({ success: false, error: 'Request too large' }, 413, corsHeaders);
    }

    const rawText = await request.text();
    if (new TextEncoder().encode(rawText).byteLength > MAX_BODY_BYTES) {
      return json({ success: false, error: 'Request too large' }, 413, corsHeaders);
    }

    let rawPayload: RawRegistrationRequest;
    try {
      rawPayload = JSON.parse(rawText) as RawRegistrationRequest;
      if (!rawPayload || typeof rawPayload !== 'object' || Array.isArray(rawPayload)) throw new Error('Invalid body');
    } catch {
      return json({ success: false, error: 'Invalid JSON body' }, 400, corsHeaders);
    }

    const validation = validateRegistrationRequest(rawPayload);
    if (!validation.ok) {
      if (validation.code === 'spam') {
        return json({ success: false, code: 'submission_rejected', error: 'La demande n’a pas été enregistrée. Vérifiez le formulaire puis réessayez.' }, 422, corsHeaders);
      }
      return json(
        {
          success: false,
          code: validation.code,
          error: validation.message,
          field: validation.field,
        },
        422,
        corsHeaders,
      );
    }

    const form = validation.value;
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const row = buildSuggestionRow(form);
    // Old cached forms can retry an already-saved receipt without replaying unknown old notifications.
    const legacyReceipt = await adminClient
      .from('suggestions_entreprises')
      .select('id, message, telephone, email, synced_to_airtable, integration_status')
      .is('request_id', null)
      .eq('source_page', form.sourcePage)
      .ilike('message', `%Request-ID: ${form.requestId}%`)
      .maybeSingle();

    if (legacyReceipt.error) {
      console.error('[submit-company-registration] Legacy receipt lookup failed', legacyReceipt.error.code);
      return json({ success: false, error: 'Database lookup failed' }, 500, corsHeaders);
    }
    if (legacyReceipt.data) {
      if (legacyReceipt.data.message !== row.message || (legacyReceipt.data.telephone || '') !== form.phone || (legacyReceipt.data.email || '') !== form.email) {
        return json({ success: false, code: 'request_conflict', error: 'This attempt already belongs to a different dossier.' }, 409, corsHeaders);
      }
      return json(
        {
          success: true,
          id: legacyReceipt.data.id,
          duplicate: true,
          integration_status: legacyReceipt.data.integration_status || {},
          integrations: {
            airtable: legacyReceipt.data.synced_to_airtable ? 'ok' : 'unknown',
            notification: 'unknown',
          },
        },
        200,
        corsHeaders,
      );
    }

    let requesterUserId: string | null = null;
    const bearer = request.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
    if (bearer) {
      const user = await adminClient.auth.getUser(bearer);
      if (!user.error && user.data.user) requesterUserId = user.data.user.id;
    }
    const stored = await adminClient.rpc('dalil_registration_store', {
      p_request_id: await registrationAttemptId(form.requestId),
      p_fingerprint: await registrationFingerprint(form),
      p_row: row,
      p_creation_dossier: form.creationDossier || null,
      p_requester_user_id: requesterUserId,
      p_notification: buildNotificationPayload(form, ''),
    });
    if (stored.error) {
      console.error('[submit-company-registration] Receipt transaction failed', stored.error.code);
      return json({ success: false, error: 'Database insert failed' }, 500, corsHeaders);
    }
    if (stored.data?.error === 'rate_limited') {
      return json({ success: false, code: 'rate_limited', error: 'Veuillez attendre avant de renvoyer une demande.', retryAfterSeconds: 600 }, 429, { ...corsHeaders, 'Retry-After': '600' });
    }
    if (stored.data?.error === 'request_conflict') {
      return json({ success: false, code: 'request_conflict', error: 'This attempt already belongs to a different dossier.' }, 409, corsHeaders);
    }
    if (typeof stored.data?.id !== 'string' || !UUID.test(stored.data.id)) {
      return json({ success: false, error: 'Receipt could not be confirmed' }, 500, corsHeaders);
    }
    let status = (stored.data.integration_status || {}) as IntegrationStatus;
    try {
      status = await deliverRegistrationIntegrations(adminClient, supabaseUrl, serviceRoleKey, stored.data.id);
    } catch (error) {
      // The receipt and its jobs are already committed; the admin can resume them without another dossier.
      console.error('[submit-company-registration] Delivery status pending', error instanceof Error ? error.message : 'unknown');
    }
    return json(
      {
        success: true,
        id: stored.data.id,
        duplicate: stored.data.duplicate === true,
        integration_status: status,
        integrations: integrationSummary(status),
      },
      stored.data.duplicate ? 200 : 201,
      corsHeaders,
    );
  } catch (error) {
    console.error('[submit-company-registration] Unexpected error', error);
    return json({ success: false, error: 'Unexpected server error' }, 500, corsHeaders);
  }
});

async function registrationFingerprint(form: NormalizedRegistrationRequest): Promise<string> {
  const stable = { ...form } as Partial<NormalizedRegistrationRequest>;
  delete stable.requestId; delete stable.elapsedMs; delete stable.verificationField;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(stable)));
  return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
}

async function registrationAttemptId(requestId: string): Promise<string> {
  if (UUID.test(requestId)) return requestId.toLowerCase();
  // Backward-compatible deterministic UUID for old clients' timestamp/random attempt IDs.
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`dalil-registration:${requestId}`)));
  hash[6] = (hash[6] & 15) | 80; hash[8] = (hash[8] & 63) | 128;
  const hex = Array.from(hash.slice(0, 16), value => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  const configured = (Deno.env.get('REGISTRATION_ALLOWED_ORIGINS') || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return [...DEFAULT_ALLOWED_ORIGINS, ...configured].includes(origin);
}

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && isAllowedOrigin(origin) ? origin : DEFAULT_ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

function json(body: Record<string, unknown>, status: number, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  });
}
