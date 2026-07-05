import { supabaseUrl, supabaseAnonKey } from './supabaseClient';

const NOTIFY_URL = `${supabaseUrl}/functions/v1/notify-form`;

export async function notifyAdmin(
  type: string,
  data: Record<string, unknown>,
  adminUrl?: string
): Promise<void> {
  try {
    await fetch(NOTIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ type, data, admin_url: adminUrl }),
    });
  } catch {
    // Silent fail - notification should never block user flow
  }
}
