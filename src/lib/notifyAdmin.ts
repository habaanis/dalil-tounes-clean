import { supabaseUrl, supabaseAnonKey } from './supabaseClient';

const NOTIFY_URL = `${supabaseUrl}/functions/v1/notify-form`;

export async function notifyAdmin(
  type: string,
  data: Record<string, unknown>,
  adminUrl?: string,
): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(NOTIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ type, data, admin_url: adminUrl }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn(`[notifyAdmin] Notification refusée (${response.status}).`);
      return false;
    }

    return true;
  } catch (error) {
    console.warn(
      '[notifyAdmin] Notification non envoyée.',
      error instanceof Error ? error.message : String(error),
    );
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
