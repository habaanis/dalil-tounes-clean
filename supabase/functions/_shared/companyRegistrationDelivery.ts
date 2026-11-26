import type { SupabaseClient } from 'npm:@supabase/supabase-js@2.57.4';

export type DeliveryChannel = 'airtable' | 'notification';
export type DeliveryStatus = 'pending' | 'running' | 'ok' | 'failed' | 'unknown';
export type IntegrationStatus = Partial<Record<DeliveryChannel, { status: DeliveryStatus; attempts: number; updated_at: string; last_error?: string | null }>>;
type Claim = { token: string; payload: Record<string, unknown>; attempts: number };
type Outcome = { status: 'ok' | 'failed' | 'unknown'; providerId?: string; error?: string };

/** Only pending/failed jobs can be claimed. Unknown notifications and historical rows are never replayed. */
export async function deliverRegistrationIntegrations(
  db: SupabaseClient, supabaseUrl: string, serviceRoleKey: string, id: string,
): Promise<IntegrationStatus> {
  const results = await Promise.allSettled((['airtable', 'notification'] as const).map(async channel => {
    const claimed = await db.rpc('dalil_registration_claim_delivery', { p_id: id, p_channel: channel });
    if (claimed.error) throw new Error(`claim_${channel}_failed`);
    const claim = claimed.data as Claim | null;
    if (!claim) return;
    const outcome = await send(channel, claim, id, supabaseUrl, serviceRoleKey);
    const finished = await db.rpc('dalil_registration_finish_delivery', {
      p_id: id, p_channel: channel, p_token: claim.token, p_status: outcome.status,
      p_provider_id: outcome.providerId || null, p_error: outcome.error || null,
    });
    if (finished.error) throw new Error(`finish_${channel}_failed`);
  }));
  for (const result of results) {
    if (result.status === 'rejected') console.error('[registration-delivery] Durable job needs recovery', String(result.reason));
  }
  const refreshed = await db.rpc('dalil_registration_refresh_delivery_status', { p_id: id });
  if (refreshed.error || !refreshed.data) throw new Error('delivery_status_unavailable');
  return refreshed.data as IntegrationStatus;
}

export function integrationSummary(status: IntegrationStatus) {
  const summarize = (channel: DeliveryChannel): 'ok' | 'failed' | 'pending' | 'unknown' => {
    const state = status[channel]?.status;
    return state === 'ok' || state === 'failed' ? state : state === 'pending' || state === 'running' ? 'pending' : 'unknown';
  };
  return { airtable: summarize('airtable'), notification: summarize('notification') };
}

async function send(channel: DeliveryChannel, claim: Claim, id: string, url: string, key: string): Promise<Outcome> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(`${url}/functions/v1/${channel === 'airtable' ? 'sync-suggestion-to-airtable' : 'notify-form'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify(channel === 'airtable' ? claim.payload : { registration_id: id, delivery_token: claim.token }),
      signal: controller.signal,
    });
    let body: Record<string, unknown>;
    try { body = await response.json(); } catch { return uncertain(channel, 'invalid_delivery_response'); }
    const providerId = channel === 'airtable' ? body.airtable_record_id : body.id;
    if (response.ok && body.success === true && typeof providerId === 'string' && providerId.length > 0) {
      return { status: 'ok', providerId };
    }
    // Airtable recovery always checks the existing Supabase ID before creating a record.
    // A notification is replayable only when the sender positively knows no email was accepted.
    if (channel === 'airtable' || body.delivery === 'not_sent') {
      return { status: 'failed', error: `${channel}_rejected_${response.status}` };
    }
    return uncertain(channel, `${channel}_unconfirmed_${response.status}`);
  } catch {
    return uncertain(channel, `${channel}_delivery_unconfirmed`);
  } finally { clearTimeout(timeout); }
}

function uncertain(channel: DeliveryChannel, error: string): Outcome {
  return { status: channel === 'notification' ? 'unknown' : 'failed', error };
}
