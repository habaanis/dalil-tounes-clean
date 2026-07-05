import { supabase } from './supabaseClient';
import { Tables } from './dbTables';
import { isPremiumBusiness } from './subscriptionHelper';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'not_found';

export interface PaymentStatusResult {
  status: PaymentStatus;
  tier: string | null;
  isPremium: boolean;
}

export async function checkPaymentStatus(entrepriseId: string): Promise<PaymentStatusResult> {
  if (!entrepriseId) {
    return { status: 'not_found', tier: null, isPremium: false };
  }

  const { data, error } = await supabase
    .from(Tables.ENTREPRISE)
    .select('id, "statut abonnement"')
    .eq('id', entrepriseId)
    .maybeSingle();

  if (error || !data) {
    return { status: 'not_found', tier: null, isPremium: false };
  }

  const tier = (data as Record<string, string | null>)['statut abonnement'] ?? null;
  const premium = isPremiumBusiness(tier);

  return {
    status: premium ? 'success' : 'pending',
    tier,
    isPremium: premium,
  };
}

export async function pollPaymentStatus(
  entrepriseId: string,
  { intervalMs = 3000, timeoutMs = 60000 }: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<PaymentStatusResult> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const result = await checkPaymentStatus(entrepriseId);
    if (result.status === 'success') return result;
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  return checkPaymentStatus(entrepriseId);
}
