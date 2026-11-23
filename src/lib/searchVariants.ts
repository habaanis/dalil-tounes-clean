/**
 * Match the spellings stored in Airtable / Supabase without relying on an
 * unaccent database extension. PostgREST ILIKE is not accent insensitive.
 * Keep short explicit variants to avoid broad unrelated search results.
 */
export function getSearchVariants(input: string): string[] {
  const value = input.trim().toLocaleLowerCase('fr');
  const withoutAccents = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const variations = new Set([value, withoutAccents]);
  const aliases: Record<string, string[]> = {
    gite: ['gîte', 'gîtes', 'gite', 'gites', 'gît'],
    gites: ['gîte', 'gîtes', 'gite', 'gites', 'gît'],
    ecole: ['école', 'ecole', 'écoles', 'ecoles'],
    ecoles: ['école', 'ecole', 'écoles', 'ecoles'],
    hopital: ['hôpital', 'hopital', 'hôpitaux', 'hopitaux'],
    hopitaux: ['hôpital', 'hopital', 'hôpitaux', 'hopitaux'],
  };
  for (const alias of aliases[withoutAccents] ?? []) variations.add(alias);
  return [...variations].filter(term => term.length >= 2);
}
