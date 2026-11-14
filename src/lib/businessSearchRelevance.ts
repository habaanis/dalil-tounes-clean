/**
 * Shared, read-only relevance rules for the public business directory.
 * Source of truth remains Airtable -> Supabase; no field or record mutations here.
 *
 * A profession query should not return an unrelated business just because its
 * free-text description mentions the word (e.g. an artisanal perfume "laboratoire").
 */
export const SEARCHABLE_BUSINESS_FIELDS = [
  'nom', 'sous_categories_texte', 'sous_categories_clean',
  'description', 'services', 'keywords_fr', 'search_text',
] as const;

type SearchableBusiness = Record<string, unknown>;

const EQUIVALENTS: readonly (readonly string[])[] = [
  ['coiffeur', 'coiffeuse', 'coiffure', 'salon de coiffure', 'hairdresser', 'barbier', 'barber'],
  ['lycee', 'lycée', 'lycees', 'lycées', 'enseignement secondaire', 'high school'],
  ['ecole', 'école', 'ecoles', 'écoles', 'school', 'primaire', 'enseignement primaire'],
  ['laboratoire', 'laboratoires', 'laboratory', 'laboratories', 'labo', "laboratoire d'analyses", 'analyses medicales'],
  ['dentiste', 'dentaire', 'dentistes', 'cabinet dentaire'],
  ['pharmacie', 'pharmacies', 'pharmacien'],
  ['medecin', 'médecin', 'docteur', 'cabinet medical', 'médecins'],
  ['boulangerie', 'boulanger', 'pain', 'baker', 'bakery'],
  ['restaurant', 'restaurants', 'resto', 'restauration'],
  ['plombier', 'plomberie', 'plombiers'],
  ['electricien', 'électricien', 'electricite', 'électricité'],
  ['mecanicien', 'mécanicien', 'garage automobile', 'mecanique', 'mécanique'],
  ['hotel', 'hôtel', 'hotels', 'hôtels', 'hebergement', 'hébergement'],
  ['avocat', 'avocats', 'cabinet juridique'],
  ['architecte', 'architectes', 'architecture'],
];

export function normalizeBusinessSearch(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function asText(value: unknown): string {
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(' ');
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return '';
}

function containsTerm(haystack: string, needle: string): boolean {
  if (!haystack || !needle) return false;
  return (' ' + haystack + ' ').includes(' ' + needle + ' ');
}

/** Exact intent variants, not a free-association synonym expansion. */
export function businessSearchVariants(query: string): string[] {
  const term = normalizeBusinessSearch(query);
  if (!term) return [];
  const values: string[] = [query.trim()];
  if (term.includes(' ') && term.length >= 5) {
    // Preserve full multiword intent; don't broaden "laboratoire medical" to all "medical".
    values.push(term);
  } else {
    for (const group of EQUIVALENTS) {
      if (group.some(entry => normalizeBusinessSearch(entry) === term)) {
        values.push(...group);
        break;
      }
    }
  }
  // Cover common plural terms without removing letters from proper names.
  if (term.length > 4 && term.endsWith('s')) values.push(term.slice(0, -1));
  return [...new Set(values.map(v => v.trim()).filter(v => v.length >= 2))].slice(0, 10);
}

export function businessQueryTerms(query: string): string[] {
  const raw = businessSearchVariants(query);
  const normalized = new Set<string>();
  const result: string[] = [];
  for (const term of raw) {
    // For PostgREST OR syntax, allow only safe plain words / spaces.
    const value = term.replace(/[,%()*\\]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!value) continue;
    const key = normalizeBusinessSearch(value);
    if (!key || normalized.has(key)) continue;
    normalized.add(key);
    result.push(value);
  }
  return result.slice(0, 8);
}

export function businessRelevance(row: SearchableBusiness, query: string): {
  score: number;
  strongMatch: boolean;
  matched: boolean;
  specificIntent: boolean;
} {
  const normalizedQuery = normalizeBusinessSearch(query);
  if (!normalizedQuery) return { score: 0, strongMatch: false, matched: false, specificIntent: false };
  const group = EQUIVALENTS.find(items => items.some(value => normalizeBusinessSearch(value) === normalizedQuery));
  const specificIntent = Boolean(group);
  const terms = businessSearchVariants(query).map(normalizeBusinessSearch).filter(Boolean);
  const match = (value: unknown) => {
    const text = normalizeBusinessSearch(asText(value));
    return terms.some(term => containsTerm(text, term) || (term.length >= 5 && text.split(' ').some(word => word.startsWith(term))));
  };

  const name = match(row.nom ?? row.name);
  const subtype = match([row.sous_categories_texte, row.sous_categories_clean, row.sous_categories, row.categorie]);
  const services = match(row.services);
  const keywords = match([row.keywords_fr, row['mots cles recherche'], row.search_text]);
  const description = match([row.description, row.description_ar]);
  const geographical = match([row.ville, row.gouvernorat]);
  const directName = containsTerm(normalizeBusinessSearch(row.nom ?? row.name), normalizedQuery);
  const strongMatch = name || subtype || services;

  let score = 0;
  if (subtype) score += 125;
  if (name) score += 110;
  if (directName) score += 35;
  if (services) score += 75;
  if (keywords) score += 22;
  if (description) score += 6;
  if (geographical) score += 4;

  // Search vocabulary is contaminated on some records; never treat prose alone
  // as a relevant professional category for an unambiguous profession search.
  const matched = specificIntent ? strongMatch || (keywords && subtype) : score > 0;
  return { score, strongMatch, matched, specificIntent };
}

/**
 * Keep all weak matches for general keyword/name searches, but for known
 * professions prefer true business classifications over incidental prose.
 */
export function rankBusinessSearchRows<T extends SearchableBusiness>(rows: T[], query: string): Array<T & { _searchRelevance: number }> {
  const rated = rows.map(row => ({ row, ...businessRelevance(row, query) }));
  const candidates = rated.some(entry => entry.specificIntent && entry.strongMatch)
    ? rated.filter(entry => !entry.specificIntent || entry.matched)
    : rated.filter(entry => entry.matched);
  return candidates
    .sort((a, b) => b.score - a.score)
    .map(({ row, score }) => ({ ...row, _searchRelevance: score }));
}
