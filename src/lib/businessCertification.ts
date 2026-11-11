/** Public certification is derived from current CV publication, never legacy labels.
 * A timestamp alone can survive an unpublication. Missing model means legacy Business.
 * No customer record is changed by this presentation rule.
 */
export interface CertificationRecord { cv_business_status?: string | null; }
export const CERTIFIED_LABEL = 'Certifiée Dalil Tounes';
export function isCertifiedBusiness(record: CertificationRecord): boolean {
  return record.cv_business_status === 'published';
}
export function applyCertificationFilter<T extends { eq: (column: string, value: string) => unknown; or: (filter: string) => unknown }>(query: T, filter: string): T {
  if (filter === 'certifie') return query.eq('cv_business_status', 'published') as T;
  if (filter === 'non_certifie') return query.or('cv_business_status.is.null,cv_business_status.neq.published') as T;
  return query;
}
