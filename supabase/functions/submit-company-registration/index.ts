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

const MAX_BODY_BYTES = 30_000;
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;
const SUBMISSION_BURST_WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_CONTACT = 3;
const DEFAULT_ALLOWED_ORIGINS = [
  'https://dalil-tounes.com',
  'https://www.dalil-tounes.com',
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
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    console.error('[submit-company-registration] Missing Supabase environment variables');
    return json({ success: false, error: 'Server configuration error' }, 500, corsHeaders);
  }

  if (!constantTimeEqual(request.headers.get('apikey') || '', anonKey)) {
    return json({ success: false, error: 'Invalid public API key' }, 401, corsHeaders);
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
    } catch {
      return json({ success: false, error: 'Invalid JSON body' }, 400, corsHeaders);
    }

    const validation = validateRegistrationRequest(rawPayload);
    if (!validation.ok) {
      if (validation.code === 'spam') {
        // Réponse volontairement neutre : le robot ne peut pas déduire la protection utilisée.
        return json({ success: true, duplicate: true, integrations: skippedIntegrations() }, 200, corsHeaders);
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

    const existingByRequestId = await adminClient
      .from('suggestions_entreprises')
      .select('id, synced_to_airtable, airtable_record_id')
      .ilike('message', `%Request-ID: ${form.requestId}%`)
      .maybeSingle();

    if (existingByRequestId.error) {
      console.error('[submit-company-registration] request_id lookup failed', existingByRequestId.error);
      return json({ success: false, error: 'Database lookup failed' }, 500, corsHeaders);
    }

    if (existingByRequestId.data) {
      return json(
        {
          success: true,
          id: existingByRequestId.data.id,
          duplicate: true,
          integrations: {
            airtable: existingByRequestId.data.synced_to_airtable ? 'ok' : 'skipped',
            notification: 'skipped',
          },
        },
        200,
        corsHeaders,
      );
    }

    const burstCheck = await hasSubmissionBurst(adminClient, form);
    if (burstCheck.error) {
      console.error('[submit-company-registration] submission burst lookup failed', burstCheck.error);
      return json({ success: false, error: 'Database lookup failed' }, 500, corsHeaders);
    }

    if (burstCheck.blocked) {
      return json(
        { success: true, duplicate: true, integrations: skippedIntegrations() },
        200,
        corsHeaders,
      );
    }

    const recentDuplicate = await findRecentDuplicate(adminClient, form);
    if (recentDuplicate.error) {
      console.error('[submit-company-registration] recent duplicate lookup failed', recentDuplicate.error);
      return json({ success: false, error: 'Database lookup failed' }, 500, corsHeaders);
    }

    if (recentDuplicate.id) {
      return json(
        {
          success: true,
          id: recentDuplicate.id,
          duplicate: true,
          integrations: skippedIntegrations(),
        },
        200,
        corsHeaders,
      );
    }

    const row = buildSuggestionRow(form);
    const inserted = await adminClient
      .from('suggestions_entreprises')
      .insert(row)
      .select('*')
      .single();

    if (inserted.error || !inserted.data) {
      console.error('[submit-company-registration] insert failed', inserted.error);
      return json({ success: false, error: 'Database insert failed' }, 500, corsHeaders);
    }

    const [airtableResult, notificationResult] = await Promise.all([
      callEdgeFunction(
        `${supabaseUrl}/functions/v1/sync-suggestion-to-airtable`,
        serviceRoleKey,
        { id: inserted.data.id },
      ),
      callEdgeFunction(
        `${supabaseUrl}/functions/v1/notify-form`,
        serviceRoleKey,
        buildNotificationPayload(form, inserted.data.id),
      ),
    ]);

    if (!airtableResult.ok) {
      console.error('[submit-company-registration] Airtable sync failed', airtableResult.error);
    }
    if (!notificationResult.ok) {
      console.error('[submit-company-registration] Admin notification failed', notificationResult.error);
    }

    return json(
      {
        success: true,
        id: inserted.data.id,
        duplicate: false,
        integrations: {
          airtable: airtableResult.ok ? 'ok' : 'failed',
          notification: notificationResult.ok ? 'ok' : 'failed',
        },
      },
      201,
      corsHeaders,
    );
  } catch (error) {
    console.error('[submit-company-registration] Unexpected error', error);
    return json({ success: false, error: 'Unexpected server error' }, 500, corsHeaders);
  }
});

async function hasSubmissionBurst(
  adminClient: ReturnType<typeof createClient>,
  form: NormalizedRegistrationRequest,
): Promise<{ blocked: boolean; error: unknown | null }> {
  const cutoff = new Date(Date.now() - SUBMISSION_BURST_WINDOW_MS).toISOString();
  let query = adminClient
    .from('suggestions_entreprises')
    .select('id', { count: 'exact', head: true })
    .eq('source_page', form.sourcePage)
    .gte('created_at', cutoff);

  query = form.phone ? query.eq('telephone', form.phone) : query.eq('email', form.email);
  const result = await query;
  return {
    blocked: (result.count || 0) >= MAX_SUBMISSIONS_PER_CONTACT,
    error: result.error || null,
  };
}

async function findRecentDuplicate(
  adminClient: ReturnType<typeof createClient>,
  form: NormalizedRegistrationRequest,
): Promise<{ id: string | null; error: unknown | null }> {
  const cutoff = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
  let query = adminClient
    .from('suggestions_entreprises')
    .select('id')
    .eq('titre_demande', form.mode === 'subscription' ? form.title : form.companyName)
    .eq('source_page', form.sourcePage)
    .gte('created_at', cutoff)
    .order('created_at', { ascending: false })
    .limit(1);

  query = form.phone ? query.eq('telephone', form.phone) : query.eq('email', form.email);
  const result = await query.maybeSingle();
  return { id: result.data?.id || null, error: result.error || null };
}

async function callEdgeFunction(
  url: string,
  serviceRoleKey: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; error?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { ok: false, error: `${response.status}: ${await response.text()}`.slice(0, 1000) };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function skippedIntegrations() {
  return { airtable: 'skipped' as const, notification: 'skipped' as const };
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
