/**
 * Tri de pertinence appliqué côté front sur les résultats de recherche.
 *
 * Règles (du plus fort au plus faible) :
 *   4 : le nom commence strictement par le terme recherché
 *   3 : un mot du nom commence par le terme (match "début de mot")
 *   2 : le nom contient le terme quelque part
 *   1 : le terme apparaît dans la description ou les mots-clés
 *   0 : aucune correspondance textuelle directe (l'item vient d'un fallback fuzzy / RPC)
 *
 * En cas d'égalité : on départage par "niveau priorité abonnement" desc
 * (pour garder les partenaires premium devant), puis on conserve l'ordre d'origine.
 */

const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalize = (s: string | null | undefined): string =>
  (s ?? '')
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .toLowerCase()
    .trim();

export interface ScorableItem {
  nom?: string | null;
  title?: string | null;
  description?: string | null;
  short_description?: string | null;
  tags?: string[] | string | null;
  'niveau priorité abonnement'?: number | null;
  niveau_priorite_abonnement?: number | null;
}

export function relevanceScore(item: ScorableItem, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const name = normalize(item.nom ?? item.title);
  if (name.startsWith(q)) return 4;
  // "début de mot" : on considère comme séparateurs les espaces et tout
  // caractère non alphanumérique (tirets, apostrophes, points, etc.).
  // Ex. "Tels-rent-car" contient le mot "rent" commençant après "-".
  const wordStartRe = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(q)}`, 'u');
  if (wordStartRe.test(name)) return 3;
  if (name.includes(q)) return 2;

  const desc = normalize(item.description ?? item.short_description);
  if (desc.includes(q)) return 1;

  const rawTags = item.tags;
  const tagsText = normalize(
    Array.isArray(rawTags) ? rawTags.join(' ') : rawTags ?? ''
  );
  if (tagsText && tagsText.includes(q)) return 1;

  return 0;
}

export function sortByRelevance<T extends ScorableItem>(
  items: T[],
  query: string,
  options: { debug?: boolean } = {}
): T[] {
  if (!query || !items?.length) return items;

  const scored = items.map((item, idx) => ({
    item,
    idx,
    score: relevanceScore(item, query),
    priority:
      Number(item['niveau priorité abonnement'] ?? item.niveau_priorite_abonnement ?? 0),
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.idx - b.idx; // stabilité : ordre d'origine
  });

  if (options.debug) {
    // Log temporaire pour debug — à retirer après validation
    // eslint-disable-next-line no-console
    console.table(
      scored.map((s) => ({
        nom: s.item.nom ?? s.item.title,
        score: s.score,
        priority: s.priority,
      }))
    );
  }

  return scored.map((s) => s.item);
}
