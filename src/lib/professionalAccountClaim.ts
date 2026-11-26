import type { SupabaseClient } from '@supabase/supabase-js';

export type MiniappAccountClaim = {
  claimed: string[];
  conflicts: number;
  requires_confirmation: boolean;
};

/** The server derives identity and eligibility; no email or business id is sent. */
export async function claimMyMiniapps(client: SupabaseClient): Promise<MiniappAccountClaim> {
  const { data, error } = await client.rpc('dalil_claim_my_miniapps');
  if (error) throw error;
  if (!data || !Array.isArray(data.claimed) || !data.claimed.every((id: unknown) => typeof id === 'string')
    || !Number.isInteger(data.conflicts) || data.conflicts < 0 || typeof data.requires_confirmation !== 'boolean') {
    throw new Error('Account association was not confirmed.');
  }
  return data as MiniappAccountClaim;
}
