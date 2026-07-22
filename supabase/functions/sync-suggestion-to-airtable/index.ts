import 'jsr:@supabase/functions-js@2.4.4/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import {
  buildAirtableFields,
  type SuggestionRow,
} from '../_shared/airtableSuggestion.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return json({ success: false, error: 'Method not allowed' }, 405);
  }

  try {
    const airtableToken = Deno.env.get('AIRTABLE_TOKEN');
    const airtableBaseId = Deno.env.get('AIRTABLE_BASE_ID');
    const airtableTableName = Deno.env.get('AIRTABLE_TABLE_NAME') || "Demande d'inscription";
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!airtableToken || !airtableBaseId || !supabaseUrl || !serviceRoleKey) {
      console.error('[sync-suggestion-to-airtable] Missing environment variables');
      return json({ success: false, error: 'Server configuration error' }, 500);
    }

    const body = await request.json() as { id?: unknown; record?: { id?: unknown } };
    const suggestionId = String(body.id ?? body.record?.id ?? '').trim();
    if (!/^[0-9a-f-]{36}$/i.test(suggestionId)) {
      return json({ success: false, error: 'Missing or invalid suggestion id' }, 400);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const fetched = await supabase
      .from('suggestions_entreprises')
      .select('*')
      .eq('id', suggestionId)
      .single();

    if (fetched.error || !fetched.data) {
      console.error('[sync-suggestion-to-airtable] Suggestion lookup failed', fetched.error);
      return json({ success: false, error: 'Suggestion not found' }, 404);
    }

    const record = fetched.data as SuggestionRow;
    if (record.synced_to_airtable && record.airtable_record_id) {
      return json({ success: true, skipped: true, airtable_record_id: record.airtable_record_id }, 200);
    }

    const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTableName)}`;
    const existing = await findExistingAirtableRecord(airtableUrl, airtableToken, record.id);
    if (!existing.ok) {
      console.error('[sync-suggestion-to-airtable] Idempotency lookup failed', existing.error);
      return json({ success: false, error: 'Airtable lookup failed' }, 502);
    }

    if (existing.id) {
      const updateError = await markSynced(supabase, record.id, existing.id);
      if (updateError) {
        console.error('[sync-suggestion-to-airtable] Existing Airtable record found but sync flag update failed', updateError);
        return json({ success: false, error: 'Supabase status update failed' }, 500);
      }
      return json({ success: true, skipped: true, airtable_record_id: existing.id }, 200);
    }

    const airtablePayload = {
      records: [{ fields: buildAirtableFields(record) }],
      typecast: true,
    };

    const airtableResponse = await fetchWithTimeout(airtableUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${airtableToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(airtablePayload),
    }, 15_000);

    const airtableResult = await safeJson(airtableResponse);
    if (!airtableResponse.ok) {
      console.error('[sync-suggestion-to-airtable] Airtable create failed', airtableResponse.status, airtableResult);
      return json({ success: false, error: 'Airtable sync failed' }, 502);
    }

    const airtableRecordId = String(
      (airtableResult as { records?: Array<{ id?: string }> }).records?.[0]?.id || '',
    );
    if (!airtableRecordId) {
      console.error('[sync-suggestion-to-airtable] Airtable response has no record id');
      return json({ success: false, error: 'Invalid Airtable response' }, 502);
    }

    const updateError = await markSynced(supabase, record.id, airtableRecordId);
    if (updateError) {
      console.error('[sync-suggestion-to-airtable] Supabase sync flag update failed', updateError);
      return json(
        {
          success: false,
          error: 'Airtable record created but Supabase status update failed',
          airtable_record_id: airtableRecordId,
        },
        500,
      );
    }

    return json({ success: true, airtable_record_id: airtableRecordId }, 200);
  } catch (error) {
    console.error('[sync-suggestion-to-airtable] Unexpected error', error);
    return json({ success: false, error: 'Unexpected sync error' }, 500);
  }
});

type AirtableLookupResult =
  | { ok: true; id: string | null }
  | { ok: false; error: string };

async function findExistingAirtableRecord(
  tableUrl: string,
  token: string,
  suggestionId: string,
): Promise<AirtableLookupResult> {
  const formula = `{Notes internes} = "ID Supabase: ${suggestionId}"`;
  const lookupUrl = `${tableUrl}?maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`;

  try {
    const response = await fetchWithTimeout(lookupUrl, {
      headers: { Authorization: `Bearer ${token}` },
    }, 10_000);
    const body = await safeJson(response) as { records?: Array<{ id?: string }> };

    if (!response.ok) {
      return { ok: false, error: `${response.status}: ${JSON.stringify(body).slice(0, 800)}` };
    }

    return { ok: true, id: body.records?.[0]?.id || null };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

async function markSynced(
  supabase: ReturnType<typeof createClient>,
  suggestionId: string,
  airtableRecordId: string,
): Promise<unknown | null> {
  const result = await supabase
    .from('suggestions_entreprises')
    .update({
      synced_to_airtable: true,
      synced_at: new Date().toISOString(),
      airtable_record_id: airtableRecordId,
    })
    .eq('id', suggestionId);
  return result.error || null;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function safeJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text.slice(0, 1000) };
  }
}

function json(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  });
}
