import 'jsr:@supabase/functions-js@2.4.4/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { deliverRegistrationIntegrations, integrationSummary } from '../_shared/companyRegistrationDelivery.ts';

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
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
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
        // Keep the existing database enum; the precise employment mode is in secteur.
        type_demande: 'demande_information',
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
    // Freeze the original stored request, never trust a retry's notification payload.
    const saved = await admin.from('suggestions_entreprises')
      .select('id,source_page,secteur,titre_demande,telephone,email,message,submission_lang,created_at,synced_to_airtable,airtable_record_id')
      .eq('id', id).maybeSingle();
    if (saved.error || !saved.data) return json({ success: false, error: 'Database lookup failed' }, 500, headers);
    const row = saved.data;
    if (row.source_page !== 'emploi' || row.secteur !== labelByMode[mode] ||
        row.titre_demande !== title || (row.telephone || '') !== phone ||
        (row.email || '') !== email || (row.message || '') !== message || row.submission_lang !== lang) {
      return json({ success: false, error: 'Request ID already in use' }, 409, headers);
    }
    // Reuse existing durable delivery jobs; a conflicting insert must not reset a delivery.
    const jobs = [
      { suggestion_id: id, channel: 'airtable', payload: { id },
        status: row.synced_to_airtable && row.airtable_record_id ? 'ok' : 'pending',
        provider_id: row.synced_to_airtable ? row.airtable_record_id : null },
      { suggestion_id: id, channel: 'notification', status: 'pending', provider_id: null,
        payload: { type: row.secteur, data: { 'Référence': id, 'Titre': row.titre_demande,
          'Langue': lang }, admin_url: '/admin/sourcing', received_at: row.created_at } },
    ];
    const queued = await admin.from('dalil_registration_integration_jobs')
      .upsert(jobs, { onConflict: 'suggestion_id,channel', ignoreDuplicates: true });
    if (queued.error) {
      console.error('[employment-intake] delivery queue failed', queued.error.code);
      return json({ success: false, error: 'Request saved; retry delivery setup with the same ID' }, 503, headers);
    }
    let summary: { airtable: string; notification: string } = { airtable: 'pending', notification: 'pending' };
    try {
      summary = integrationSummary(await deliverRegistrationIntegrations(admin, supabaseUrl, serviceKey, id));
    } catch {
      console.error('[employment-intake] delivery needs recovery', id);
    }
    return json({ success: true, requestId: id, airtable: summary.airtable === 'ok' ? 'ok' : 'pending', notification: summary.notification }, 200, headers);
  } catch (error) {
    console.error('[employment-intake] unexpected error', error instanceof Error ? error.message : String(error));
    return json({ success: false, error: 'Unexpected server error' }, 500, headers);
  }
});
