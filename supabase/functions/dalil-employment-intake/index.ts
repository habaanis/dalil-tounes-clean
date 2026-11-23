import 'jsr:@supabase/functions-js@2.4.4/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const origins = new Set([
  'https://dalil-tounes.com',
  'https://www.dalil-tounes.com',
  'https://appli.dalil-tounes.com',
  'https://app.dalil-tounes.com',
  'https://dalil-tounes-pwa.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);
const allowedModes = new Set(['candidate', 'employer', 'candidate-contact', 'candidate-info']);
const labelByMode: Record<string, string> = {
  candidate: 'Candidature emploi',
  employer: 'Demande publication offre emploi',
  'candidate-contact': 'Demande mise en relation candidat',
  'candidate-info': 'Demande information candidat',
};
function json(body: Record<string, unknown>, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } });
}
Deno.serve(async request => {
  const origin = request.headers.get('origin');
  const allowed = !origin || origins.has(origin);
  const headers = {
    'Access-Control-Allow-Origin': allowed && origin ? origin : 'https://appli.dalil-tounes.com',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
  if (request.method === 'OPTIONS') return allowed ? new Response('ok', { headers }) : json({ success: false, error: 'Origin not allowed' }, 403, headers);
  if (request.method !== 'POST') return json({ success: false, error: 'Method not allowed' }, 405, headers);
  if (!allowed) return json({ success: false, error: 'Origin not allowed' }, 403, headers);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) return json({ success: false, error: 'Server configuration error' }, 500, headers);

  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > 16000) return json({ success: false, error: 'Request too large' }, 413, headers);
    const body = JSON.parse(raw) as Record<string, unknown>;
    const str = (key: string, max: number) => String(body[key] ?? '').trim().slice(0, max);
    const id = str('requestId', 36);
    const mode = str('mode', 40);
    const title = str('title', 180);
    const phone = str('phone', 48);
    const email = str('email', 254);
    const message = str('message', 5500);
    const lang = str('language', 8).toLowerCase();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      || !allowedModes.has(mode) || title.length < 2 || (!phone && !email)
      || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      || !['fr','ar','en','it','ru'].includes(lang)) {
      return json({ success: false, error: 'Invalid request' }, 400, headers);
    }
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: existing, error: existingError } = await admin.from('suggestions_entreprises')
      .select('id').eq('id', id).maybeSingle();
    if (existingError) return json({ success: false, error: 'Database lookup failed' }, 500, headers);
    if (!existing) {
      const contact = [phone, email].filter(Boolean).join(' - ');
      const recent = await admin.from('suggestions_entreprises')
        .select('id')
        .eq('contact_suggere', contact)
        .gte('created_at', new Date(Date.now() - 10 * 60_000).toISOString())
        .limit(4);
      if (recent.error) return json({ success: false, error: 'Rate limit lookup failed' }, 500, headers);
      if ((recent.data?.length || 0) >= 3) return json({ success: false, error: 'Too many submissions' }, 429, headers);
      const label = labelByMode[mode];
      const row = {
        id,
        titre_demande: title,
        nom_entreprise: title,
        secteur: label,
        type_demande: label,
        source_page: 'emploi',
        telephone: phone || null,
        email: email || null,
        contact_suggere: [phone, email].filter(Boolean).join(' - '),
        message,
        raison_suggestion: [label, message || 'Aucun complément.'].join('\n\n'),
        submission_lang: lang,
        langue: lang,
        statut: 'Nouveau',
      };
      const inserted = await admin.from('suggestions_entreprises').insert(row);
      if (inserted.error && inserted.error.code !== '23505') {
        console.error('[employment-intake] database insert failed', inserted.error.code);
        return json({ success: false, error: 'Database insert failed' }, 500, headers);
      }
    }
    // Airtable is a secondary copy, never the source of truth. An ID makes retries idempotent.
    const syncResponse = await fetch(`${supabaseUrl}/functions/v1/sync-suggestion-to-airtable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
      body: JSON.stringify({ id }),
      signal: AbortSignal.timeout(16000),
    }).catch(() => null);
    const synced = !!syncResponse?.ok && (await syncResponse.json().catch(() => ({}))).success === true;
    if (!synced) console.error('[employment-intake] Airtable synchronization pending', id, syncResponse?.status);
    return json({ success: true, requestId: id, airtable: synced ? 'ok' : 'pending' }, 200, headers);
  } catch (error) {
    console.error('[employment-intake] unexpected error', error instanceof Error ? error.message : String(error));
    return json({ success: false, error: 'Unexpected server error' }, 500, headers);
  }
});
