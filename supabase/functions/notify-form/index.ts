import 'jsr:@supabase/functions-js@2.4.4/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const ADMIN_EMAILS = ['zenanis75@hotmail.com', 'contact@dalil-tounes.com'];
const FROM_EMAIL = 'Dalil Tounes <notifications@dalil-tounes.com>';
const MAX_DATA_FIELDS = 30;

type NotifyPayload = {
  type?: unknown;
  data?: unknown;
  admin_url?: unknown;
};

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return json({ success: false, error: 'Method not allowed' }, 405);
  }

  try {
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) {
      console.error('[notify-form] RESEND_API_KEY is not configured');
      return json({ success: false, error: 'Server configuration error' }, 500);
    }

    const raw = await request.json() as NotifyPayload;
    const type = cleanSingleLine(raw.type, 120);
    const data = normalizeData(raw.data);
    const adminUrl = normalizeAdminUrl(raw.admin_url);

    if (!type || Object.keys(data).length === 0) {
      return json({ success: false, error: "Missing 'type' or 'data' in payload" }, 400);
    }

    const subject = `[Dalil Tounes] ${type}`.replace(/[\r\n]+/g, ' ').slice(0, 180);
    const html = buildHtml(type, data, adminUrl);

    const resendResponse = await fetchWithTimeout('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: ADMIN_EMAILS,
        subject,
        html,
      }),
    }, 10_000);

    if (!resendResponse.ok) {
      const details = (await resendResponse.text()).slice(0, 1000);
      console.error('[notify-form] Resend API error', resendResponse.status, details);
      return json({ success: false, error: 'Email notification failed' }, 502);
    }

    const result = await resendResponse.json() as { id?: string };
    return json({ success: true, id: result.id || null }, 200);
  } catch (error) {
    console.error('[notify-form] Unexpected error', error);
    return json({ success: false, error: 'Unexpected notification error' }, 500);
  }
});

function buildHtml(type: string, data: Record<string, string>, adminUrl: string | null): string {
  const receivedAt = new Date().toLocaleString('fr-TN', { timeZone: 'Africa/Tunis' });
  const rows = Object.entries(data)
    .map(([key, value]) => `
      <tr>
        <td style="padding:8px 12px;font-weight:600;vertical-align:top;border-bottom:1px solid #eee;">${escapeHtml(key)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap;word-break:break-word;">${escapeHtml(value)}</td>
      </tr>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:#f7f7f8;padding:20px;color:#222;">
  <div style="max-width:680px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e0e0e0;">
    <div style="background:#4A1D43;color:#D4AF37;padding:18px 24px;">
      <h2 style="margin:0;font-size:19px;">Dalil Tounes — ${escapeHtml(type)}</h2>
    </div>
    <div style="padding:24px;">
      <p style="color:#666;margin:0 0 16px;">Soumission reçue le <strong>${escapeHtml(receivedAt)}</strong></p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
      ${adminUrl ? `<p style="margin:24px 0 0;"><a href="${escapeAttribute(adminUrl)}" style="display:inline-block;background:#D4AF37;color:#1a1a2e;padding:11px 20px;border-radius:7px;text-decoration:none;font-weight:700;">Voir dans l’admin</a></p>` : ''}
    </div>
    <div style="background:#f5f5f5;padding:12px 24px;font-size:12px;color:#777;">Dalil Tounes — Notification automatique</div>
  </div>
</body>
</html>`;
}

function normalizeData(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const normalized: Record<string, string> = {};
  for (const [rawKey, rawValue] of Object.entries(value as Record<string, unknown>).slice(0, MAX_DATA_FIELDS)) {
    const key = cleanSingleLine(rawKey, 100);
    if (!key || rawValue === null || rawValue === undefined || rawValue === '') continue;

    const text = typeof rawValue === 'string'
      ? rawValue
      : typeof rawValue === 'number' || typeof rawValue === 'boolean'
        ? String(rawValue)
        : JSON.stringify(rawValue);
    normalized[key] = cleanMultiline(text, 2500);
  }
  return normalized;
}

function normalizeAdminUrl(value: unknown): string | null {
  const raw = cleanSingleLine(value, 500);
  if (!raw) return null;
  if (raw.startsWith('/')) return `https://dalil-tounes.com${raw}`;

  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return null;
    if (url.hostname !== 'dalil-tounes.com' && url.hostname !== 'www.dalil-tounes.com') return null;
    return url.toString();
  } catch {
    return null;
  }
}

function cleanSingleLine(value: unknown, maxLength: number): string {
  return stripControlCharacters(String(value ?? ''), false)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanMultiline(value: string, maxLength: number): string {
  return stripControlCharacters(value.replace(/\r\n/g, '\n'), true)
    .replace(/\n{4,}/g, '\n\n\n')
    .trim()
    .slice(0, maxLength);
}

function stripControlCharacters(value: string, preserveLayout: boolean): string {
  return Array.from(value, (character) => {
    const code = character.charCodeAt(0);
    if (preserveLayout && (code === 9 || code === 10 || code === 13)) return character;
    if (code <= 31 || code === 127) return preserveLayout ? '' : ' ';
    return character;
  }).join('');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/`/g, '&#096;');
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

function json(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  });
}
