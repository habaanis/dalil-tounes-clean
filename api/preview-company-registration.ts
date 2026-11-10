// Preview-only same-origin transport. The public Edge endpoint still owns
// validation, anti-spam, deduplication and persistence; no privileged key is used.
type PreviewRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};
type PreviewResponse = {
  status(code: number): PreviewResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): void;
};

export default async function handler(request: PreviewRequest, response: PreviewResponse) {
  response.setHeader('Cache-Control', 'no-store');
  if (process.env.VERCEL_ENV !== 'preview') return response.status(404).json({ success: false });
  if (request.method !== 'POST') return response.status(405).json({ success: false });

  const origin = request.headers.origin;
  const host = request.headers.host;
  if (typeof origin !== 'string' || typeof host !== 'string') return response.status(403).json({ success: false });
  try {
    if (new URL(origin).origin !== `https://${host}`) return response.status(403).json({ success: false });
  } catch {
    return response.status(403).json({ success: false });
  }
  if (request.headers['sec-fetch-site'] && request.headers['sec-fetch-site'] !== 'same-origin') {
    return response.status(403).json({ success: false });
  }
  if (!String(request.headers['content-type'] || '').startsWith('application/json')) {
    return response.status(415).json({ success: false });
  }
  const key = request.headers.apikey;
  if (typeof key !== 'string' || !key) return response.status(401).json({ success: false });
  let payload: Record<string, unknown>;
  try {
    payload = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Invalid body');
  } catch {
    return response.status(400).json({ success: false });
  }
  const body = JSON.stringify(payload);
  if (new TextEncoder().encode(body).length > 30000) return response.status(413).json({ success: false });
  if (!['company_registration', 'subscription'].includes(String(payload.mode))) {
    return response.status(422).json({ success: false });
  }
  try {
    const upstream = await fetch('https://kmvjegbtroksjqaqliyv.supabase.co/functions/v1/submit-company-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
      body,
      signal: AbortSignal.timeout(19000),
    });
    return response.status(upstream.status).json(await upstream.json());
  } catch {
    console.error('[preview-company-registration] Upstream unavailable');
    return response.status(502).json({ success: false, error: 'Registration service unavailable' });
  }
}
