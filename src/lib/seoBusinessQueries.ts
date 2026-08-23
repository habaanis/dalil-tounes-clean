import { supabase } from './supabaseClient';
import { extractFrenchName } from './textNormalization';
import { getMetiersBySecteur, findGouvernoratBySlug } from './seoLandingData';

export interface SeoBusiness {
  id: string;
  nom: string;
  adresse?: string;
  ville?: string;
  gouvernorat?: string;
  telephone?: string;
  'catégorie'?: string[];
  'Note Google Globale'?: number | null;
  'Compteur Avis Google'?: number | null;
  logo_url?: string;
  description?: string;
  is_premium?: boolean;
  statut_abonnement?: string | null;
  horaires_ok?: string | null;
  slug?: string | null;
  statut_carte?: string | null;
}

export interface RecommendedBusiness extends SeoBusiness {
  confidenceScore: number;
}

type EntrepriseRow = Record<string, unknown>;

const SIMILAR_SELECT = 'id, nom, adresse, ville, gouvernorat, telephone, categorie, sous_categories_texte, score_avis, logo_url, image_url, description, is_premium, statut_abonnement, horaires_ok, slug, "Note Google Globale", "Compteur Avis Google", statut_carte, statut_validation';
const PUBLIC_FETCH_LIMIT = 5000;

function normalizeText(value: unknown): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function rowCategories(row: EntrepriseRow): string[] {
  const raw = row.categorie;
  if (Array.isArray(raw)) {
    return raw.map(value => String(value).trim()).filter(Boolean);
  }
  if (typeof raw === 'string' && raw.trim()) {
    return [raw.trim()];
  }
  return [];
}

function rowSousCategories(row: EntrepriseRow): string[] {
  const raw = row.sous_categories_texte;
  if (Array.isArray(raw)) {
    return raw.map(value => String(value).trim()).filter(Boolean);
  }
  return String(raw ?? '')
    .split(/[,;\n]+/)
    .map(value => value.trim())
    .filter(Boolean);
}

function businessMatchesTerm(row: EntrepriseRow, term?: string): boolean {
  if (!term) return true;
  const needle = normalizeText(term);
  if (!needle) return true;

  const values = [...rowCategories(row), ...rowSousCategories(row)];
  return values.some(value => {
    const normalized = normalizeText(value);
    return normalized === needle || normalized.includes(needle) || needle.includes(normalized);
  });
}

function mapEntrepriseRow(row: EntrepriseRow): SeoBusiness {
  const categories = rowCategories(row);
  const sousCategories = rowSousCategories(row);

  return {
    id: row.id as string,
    nom: extractFrenchName((row.nom as string) ?? ''),
    adresse: row.adresse as string | undefined,
    ville: row.ville as string | undefined,
    gouvernorat: row.gouvernorat as string | undefined,
    telephone: row.telephone as string | undefined,
    'catégorie': sousCategories.length > 0 ? sousCategories : categories,
    'Note Google Globale': (row['Note Google Globale'] as number | null) ?? null,
    'Compteur Avis Google': (row['Compteur Avis Google'] as number | null) ?? null,
    logo_url: (row.logo_url as string | undefined) || (row.image_url as string | undefined),
    description: row.description as string | undefined,
    is_premium: (row.is_premium as boolean | undefined) ?? false,
    statut_abonnement: (row.statut_abonnement as string | null) ?? null,
    horaires_ok: (row.horaires_ok as string | null) ?? null,
    slug: (row.slug as string | null) ?? null,
    statut_carte: (row.statut_carte as string | null) ?? null,
  };
}

function sortRows(rows: EntrepriseRow[]): EntrepriseRow[] {
  return [...rows].sort((a, b) => {
    const premiumA = a.is_premium === true ? 1 : 0;
    const premiumB = b.is_premium === true ? 1 : 0;
    if (premiumA !== premiumB) return premiumB - premiumA;

    const scoreA = Number(a.score_avis ?? 0) || 0;
    const scoreB = Number(b.score_avis ?? 0) || 0;
    if (scoreA !== scoreB) return scoreB - scoreA;

    const ratingA = parseRating(a['Note Google Globale']);
    const ratingB = parseRating(b['Note Google Globale']);
    if (ratingA !== ratingB) return ratingB - ratingA;

    return parseCount(b['Compteur Avis Google']) - parseCount(a['Compteur Avis Google']);
  });
}

async function fetchPublishedRows(filters?: {
  ville?: string;
  gouvernorat?: string;
}): Promise<{ rows: EntrepriseRow[]; error: unknown }> {
  let query = supabase
    .from('entreprise')
    .select(SIMILAR_SELECT)
    // publie / publié / published sont tous couverts par ce préfixe.
    .ilike('statut_validation', 'publi%')
    .limit(PUBLIC_FETCH_LIMIT);

  if (filters?.ville) {
    // Une page ville ne doit pas récupérer tout le gouvernorat : cela évite
    // le chevauchement ville ↔ gouvernorat et la cannibalisation SEO.
    query = query.ilike('ville', `%${filters.ville}%`);
  }

  if (filters?.gouvernorat) {
    query = query.ilike('gouvernorat', `%${filters.gouvernorat}%`);
  }

  const { data, error } = await query;
  return {
    rows: (data ?? []) as EntrepriseRow[],
    error,
  };
}

function paginateRows(rows: EntrepriseRow[], offset: number, limit: number) {
  const sorted = sortRows(rows);
  return {
    data: sorted.slice(offset, offset + limit).map(mapEntrepriseRow),
    total: sorted.length,
  };
}

export async function fetchSimilarBusinesses(options: {
  excludeId: string;
  categorie?: string;
  ville?: string;
  gouvernorat?: string;
  limit?: number;
}): Promise<SeoBusiness[]> {
  const { excludeId, categorie, ville, gouvernorat, limit = 6 } = options;
  if (!categorie && !ville && !gouvernorat) return [];

  // On récupère uniquement les fiches publiques, puis on filtre les catégories
  // côté application. `categorie` est un ARRAY PostgreSQL : utiliser `ilike`
  // directement sur cette colonne provoquait les erreurs historiques.
  const { rows, error } = await fetchPublishedRows(
    ville ? { ville } : gouvernorat ? { gouvernorat } : undefined,
  );
  if (error) return [];

  let candidates = rows.filter(row => String(row.id) !== excludeId);
  if (categorie) {
    candidates = candidates.filter(row => businessMatchesTerm(row, categorie));
  }

  // Si la ville exacte ne donne pas assez de résultats, on autorise ensuite le
  // même gouvernorat sans dupliquer les entreprises déjà trouvées.
  let selected = sortRows(candidates).slice(0, limit);
  if (selected.length < limit && ville && gouvernorat) {
    const { rows: governorateRows } = await fetchPublishedRows({ gouvernorat });
    const seen = new Set(selected.map(row => String(row.id)));
    const extras = governorateRows
      .filter(row => String(row.id) !== excludeId)
      .filter(row => !seen.has(String(row.id)))
      .filter(row => !categorie || businessMatchesTerm(row, categorie));

    selected = [...selected, ...sortRows(extras)].slice(0, limit);
  }

  return selected.map(mapEntrepriseRow);
}

export async function fetchSeoBusinesses(options: {
  limit?: number;
  offset?: number;
  metier?: string;
  sousCategorie?: string;
  city?: string;
  categorie?: string;
}): Promise<{ data: SeoBusiness[]; total: number; error: unknown }> {
  const { limit = 20, offset = 0, sousCategorie, city } = options;
  const metierValue = options.metier ?? options.categorie;

  const { rows, error } = await fetchPublishedRows(city ? { ville: city } : undefined);
  if (error) return { data: [], total: 0, error };

  const filtered = rows.filter(row => {
    if (metierValue && !businessMatchesTerm(row, metierValue)) return false;
    if (sousCategorie && !businessMatchesTerm(row, sousCategorie)) return false;
    return true;
  });

  const page = paginateRows(filtered, offset, limit);
  return { ...page, error: null };
}

export async function fetchSeoBusinessesBySecteur(options: {
  secteurSlug: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: SeoBusiness[]; total: number; error: unknown }> {
  const { secteurSlug, limit = 20, offset = 0 } = options;
  const metiers = getMetiersBySecteur(secteurSlug);

  if (metiers.length === 0) {
    return { data: [], total: 0, error: null };
  }

  const { rows, error } = await fetchPublishedRows();
  if (error) return { data: [], total: 0, error };

  const filtered = rows.filter(row =>
    metiers.some(metier => businessMatchesTerm(row, metier.value)),
  );

  const page = paginateRows(filtered, offset, limit);
  return { ...page, error: null };
}

export async function fetchSeoBusinessesByGouvernorat(options: {
  gouvernoratSlug: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: SeoBusiness[]; total: number; error: unknown }> {
  const { gouvernoratSlug, limit = 20, offset = 0 } = options;
  const gouv = findGouvernoratBySlug(gouvernoratSlug);

  if (!gouv) {
    return { data: [], total: 0, error: null };
  }

  const { rows, error } = await fetchPublishedRows({ gouvernorat: gouv.label });
  if (error) return { data: [], total: 0, error };

  const page = paginateRows(rows, offset, limit);
  return { ...page, error: null };
}

const MIN_RATING = 4.0;
const MIN_REVIEWS = 5;

function parseRating(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === 'number') return Number.isNaN(raw) ? 0 : raw;
  const n = parseFloat(String(raw).replace(',', '.'));
  return Number.isNaN(n) ? 0 : Math.min(5, Math.max(0, n));
}

function parseCount(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === 'number') return Number.isNaN(raw) ? 0 : Math.max(0, raw);
  const n = parseInt(String(raw).replace(/[^\d]/g, ''), 10);
  return Number.isNaN(n) ? 0 : n;
}

export async function fetchTopRecommendedByCity(
  ville: string,
  limit: number = 6,
): Promise<RecommendedBusiness[]> {
  if (!ville) return [];

  const { rows, error } = await fetchPublishedRows({ ville });
  if (error || rows.length === 0) return [];

  const villeNorm = normalizeText(ville);
  const filteredRows = rows.filter(row => {
    const rowVille = normalizeText(row.ville);
    if (
      rowVille !== villeNorm &&
      !rowVille.startsWith(`${villeNorm} `) &&
      !rowVille.startsWith(`${villeNorm},`) &&
      !rowVille.endsWith(` ${villeNorm}`)
    ) {
      return false;
    }

    return (
      parseRating(row['Note Google Globale']) >= MIN_RATING &&
      parseCount(row['Compteur Avis Google']) >= MIN_REVIEWS
    );
  });

  const scored: RecommendedBusiness[] = filteredRows.map(row => {
    const business = mapEntrepriseRow(row);
    return {
      ...business,
      confidenceScore: parseRating(row['Note Google Globale']),
    };
  });

  scored.sort((a, b) => {
    const ratingDiff = b.confidenceScore - a.confidenceScore;
    if (ratingDiff !== 0) return ratingDiff;
    return parseCount(b['Compteur Avis Google']) - parseCount(a['Compteur Avis Google']);
  });

  return scored.slice(0, limit);
}
