// Short-lived in-memory reuse prevents sequential duplicate Supabase fetches
// when transitioning through the showcase wrappers. No persistent customer data.
type CachedRecord = Record<string, unknown>;
const records = new Map<string, { value: CachedRecord; expires: number }>();
const normalize = (s: string) => s.trim().toLowerCase();
export function rememberShowcaseRecord(record: CachedRecord) {
  for (const field of ['id', 'slug', 'slug_court', 'id_airtable']) {
    const key = record[field];
    if (typeof key === 'string' && key.trim()) records.set(normalize(key), { value: record, expires: Date.now() + 15000 });
  }
}
export function cachedShowcaseRecord(identifier?: string | null): CachedRecord | null {
  if (!identifier) return null;
  const entry = records.get(normalize(identifier));
  if (!entry) return null;
  if (Date.now() > entry.expires) { records.delete(normalize(identifier)); return null; }
  return entry.value;
}
