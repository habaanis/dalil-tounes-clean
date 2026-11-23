/**
 * Public, RLS-aware spelling suggestions sourced from the live enterprise
 * classifications in Supabase (synced from Airtable), plus FR/AR aliases.
 * Never silently overwrite the customer's original input.
 */
export type SearchCorrection = {
  suggestion: string;
  searchQuery: string;
  confidence: number;
};

export async function findSearchCorrection(
  client: { rpc: (name: string, args: Record<string, string>) => PromiseLike<{ data: any; error: any }> },
  typed: string,
): Promise<SearchCorrection | null> {
  const query = typed.trim();
  if (query.length < 3 || query.length > 80) return null;
  const { data, error } = await client.rpc('dalil_search_suggest', { p_query: query });
  if (error || !Array.isArray(data) || !data.length) return null;
  const row = data[0];
  if (!row || typeof row.suggestion !== 'string' || typeof row.search_query !== 'string') return null;
  const confidence = Number(row.confidence);
  if (!Number.isFinite(confidence) || confidence < 0.7) return null;
  return {
    suggestion: row.suggestion.trim(),
    searchQuery: row.search_query.trim(),
    confidence,
  };
}

export function isArabicSearch(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export function isNewSearchSuggestion(
  typed: string,
  correction: SearchCorrection | null
): boolean {
  return !!correction && correction.suggestion.toLocaleLowerCase('fr') !== typed.trim().toLocaleLowerCase('fr');
}
