import { supabaseAnonKey, supabaseUrl } from './supabaseClient';

export type EmploymentRequestMode = 'candidate' | 'employer' | 'candidate-contact' | 'candidate-info';

export async function submitEmploymentRequest(payload: {
  requestId: string;
  mode: EmploymentRequestMode;
  title: string;
  phone: string;
  email: string;
  message: string;
  language: string;
}): Promise<{ requestId: string; airtable: 'ok' | 'pending' }> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/dalil-employment-intake`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.success !== true) throw new Error('Employment intake failed');
    return { requestId: body.requestId, airtable: body.airtable === 'ok' ? 'ok' : 'pending' };
  } finally {
    window.clearTimeout(timeout);
  }
}
