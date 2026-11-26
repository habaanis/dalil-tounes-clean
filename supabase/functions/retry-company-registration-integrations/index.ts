import 'jsr:@supabase/functions-js@2.4.4/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { deliverRegistrationIntegrations, integrationSummary } from '../_shared/companyRegistrationDelivery.ts';

const ORIGINS = ['https://dalil-tounes.com', 'https://www.dalil-tounes.com', 'https://appli.dalil-tounes.com', 'https://app.dalil-tounes.com', 'http://localhost:5173', 'http://127.0.0.1:5173'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (request: Request) => {
  const origin = request.headers.get('origin');
  const headers = { 'Access-Control-Allow-Origin': origin && ORIGINS.includes(origin) ? origin : ORIGINS[0], 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin' };
  const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
  if (origin && !ORIGINS.includes(origin)) return json({ success: false, error: 'Origin not allowed' }, 403);
  if (request.method === 'OPTIONS') return new Response('ok', { headers });
  if (request.method !== 'POST') return json({ success: false, error: 'Method not allowed' }, 405);
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const authorization = request.headers.get('authorization') || '';
  if (!url || !key) return json({ success: false, error: 'Server configuration error' }, 500);
  if (!authorization.startsWith('Bearer ')) return json({ success: false, error: 'Authentication required' }, 401);
  try {
    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const user = await db.auth.getUser(authorization.slice(7));
    if (user.error || !user.data.user) return json({ success: false, error: 'Authentication required' }, 401);
    const actor = createClient(url, Deno.env.get('SUPABASE_ANON_KEY') || key, { global: { headers: { Authorization: authorization } }, auth: { persistSession: false, autoRefreshToken: false } });
    const permission = await actor.rpc('dalil_registration_is_admin');
    if (permission.error || permission.data !== true) return json({ success: false, error: 'Administrator access required' }, 403);
    const raw = await request.text();
    if (raw.length > 1000) return json({ success: false, error: 'Request too large' }, 413);
    let body: { id?: unknown };
    try { body = JSON.parse(raw); } catch { return json({ success: false, error: 'Invalid request' }, 400); }
    if (typeof body.id !== 'string' || !UUID.test(body.id)) return json({ success: false, error: 'Invalid dossier ID' }, 400);
    const found = await db.from('suggestions_entreprises').select('id').eq('id', body.id).maybeSingle();
    if (found.error) return json({ success: false, error: 'Dossier lookup failed' }, 500);
    if (!found.data) return json({ success: false, error: 'Dossier not found' }, 404);
    const status = await deliverRegistrationIntegrations(db, url, key, body.id);
    return json({ success: true, id: body.id, integration_status: status, integrations: integrationSummary(status) });
  } catch (error) {
    console.error('[retry-registration] Recovery failed', error instanceof Error ? error.message : 'unknown');
    return json({ success: false, error: 'Delivery status could not be confirmed. Refresh before retrying.' }, 500);
  }
});
