/**
 * Public card presentation rules. A published CV is always green.
 * Legacy records may still carry the earlier certified premium presentation
 * without a migrated CV publication flag; preserve their prior green display
 * while the underlying client publication status is reconciled separately.
 *
 * This is presentation only: it never changes a CV's published status or
 * grants the current "Certifiée Dalil Tounes" certification.
 */
export interface BusinessCardPresentationRecord {
  cv_business_status?: string | null;
  statut_abonnement?: string | null;
  statut_carte?: string | null;
}

export function hasGreenBusinessCard(record: BusinessCardPresentationRecord): boolean {
  if (record.cv_business_status?.toLowerCase() === 'published') return true;
  const plan = (record.statut_abonnement || '').toLowerCase();
  const paidPlan = /premium|artisan|elite/.test(plan);
  const historicalCertifiedCard = /certifi[eé].*dalil\s*tounes/i.test(record.statut_carte || '');
  return paidPlan && historicalCertifiedCard;
}
