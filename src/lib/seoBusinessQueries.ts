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

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? '').trim())
      .filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function mapEntrepriseRow(row: Record<string, unknown>): SeoBusiness {
  const sousCategories = normalizeStringArray(row.sous_categories_texte ?? row.sous_categories);
  const categories = normalizeStringArray(row.categorie);

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

const SIMILAR_SELECT = 'id, nom, adresse, ville, gouvernorat, telephone, categorie, sous_categories_texte, score_avis, logo_url, image_url, description, is_premium, statut_abonnement, horaires_ok, slug, "Note Google Globale", "Compteur Avis Google", statut_carte';

export async function fetchSimilarBusinesses(options: {
  excludeId: string;
  categorie?: string;
  ville?: string;
  gouvernorat?: string;
  limit?: number;
}): Promise<SeoBusiness[]> {
  const { excludeId, categorie, ville, gouvernorat, limit = 6 } = options;

  if (!categorie && !ville) return [];

  const results: SeoBusiness[] = [];
  const seenIds = new Set<string>([excludeId]);

  if (categorie && ville) {
    const { data } = await supabase
      .from('entreprise')
      .select(SIMILAR_SELECT)
      .neq('id', excludeId)
      .ilike('sous_categories_texte', `%${categorie}%`)
      .ilike('ville', `%${ville}%`)
      .order('is_premium', { ascending: false })
      .order('score_avis', { ascending: false, nullsFirst: false })
      .limit(limit);
    if (data) {
      for (const row of data as Record<string, unknown>[]) {
        const id = row.id as string;
        if (!seenIds.has(id)) {
          seenIds.add(id);
          results.push(mapEntrepriseRow(row));
        }
      }
    }
  }

  if (results.length < limit && categorie) {
    const { data } = await supabase
      .from('entreprise')
      .select(SIMILAR_SELECT)
      .neq('id', excludeId)
      .ilike('sous_categories_texte', `%${categorie}%`)
      .order('is_premium', { ascending: false })
      .order('score_avis', { ascending: false, nullsFirst: false })
      .limit(limit - results.length + 2);
    if (data) {
      for (const row of data as Record<string, unknown>[]) {
        const id = row.id as string;
        if (!seenIds.has(id)) {
          seenIds.add(id);
          results.push(mapEntrepriseRow(row));
        }
        if (results.length >= limit) break;
      }
    }
  }

  if (results.length < limit && ville) {
    const { data } = await supabase
      .from('entreprise')
      .select(SIMILAR_SELECT)
      .neq('id', excludeId)
      .ilike('ville', `%${ville}%`)
      .order('is_premium', { ascending: false })
      .order('score_avis', { ascending: false, nullsFirst: false })
      .limit(limit - results.length + 2);
    if (data) {
      for (const row of data as Record<string, unknown>[]) {
        const id = row.id as string;
        if (!seenIds.has(id)) {
          seenIds.add(id);
          results.push(mapEntrepriseRow(row));
        }
        if (results.length >= limit) break;
      }
    }
  }

  // Le gouvernorat n'est utilisé qu'en repli explicite, jamais comme équivalent d'une ville.
  if (results.length < limit && !ville && gouvernorat) {
    const { data } = await supabase
      .from('entreprise')
      .select(SIMILAR_SELECT)
      .neq('id', excludeId)
      .ilike('gouvernorat', `%${gouvernorat}%`)
      .order('is_premium', { ascending: false })
      .order('score_avis', { ascending: false, nullsFirst: false })
      .limit(limit - results.length + 2);
    if (data) {
      for (const row of data as Record<string, unknown>[]) {
        const id = row.id as string;
        if (!seenIds.has(id)) {
          seenIds.add(id);
          results.push(mapEntrepriseRow(row));
        }
        if (results.length >= limit) break;
      }
    }
  }

  return results.slice(0, limit);
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

  let query = supabase
    .from('entreprise')
    .select(SIMILAR_SELECT, { count: 'exact' });

  // Les métiers/sous-catégories sont stockés sous forme de texte normalisé
  // dans sous_categories_texte. On évite volontairement `ilike` sur `categorie`,
  // qui peut être un tableau Postgres et n'est donc pas un champ texte scalaire.
  if (metierValue) {
    query = query.ilike('sous_categories_texte', `%${metierValue}%`);
  }

  if (sousCategorie) {
    query = query.ilike('sous_categories_texte', `%${sousCategorie}%`);
  }

  // Une page ville doit représenter cette ville, pas tout son gouvernorat.
  if (city) {
    query = query.ilike('ville', `%${city}%`);
  }

  query = query
    .order('is_premium', { ascending: false })
    .order('score_avis', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error || !data) {
    return { data: [], total: 0, error };
  }

  return {
    data: (data as Record<string, unknown>[]).map(mapEntrepriseRow),
    total: count ?? 0,
    error: null,
  };
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

  const orFilters = metiers
    .map((m) => `sous_categories_texte.ilike.%${m.value}%`)
    .join(',');

  const { data, error, count } = await supabase
    .from('entreprise')
    .select(SIMILAR_SELECT, { count: 'exact' })
    .or(orFilters)
    .order('is_premium', { ascending: false })
    .order('score_avis', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error || !data) {
    return { data: [], total: 0, error };
  }

  return {
    data: (data as Record<string, unknown>[]).map(mapEntrepriseRow),
    total: count ?? 0,
    error: null,
  };
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

  const { data, error, count } = await supabase
    .from('entreprise')
    .select(SIMILAR_SELECT, { count: 'exact' })
    .ilike('gouvernorat', `%${gouv.label}%`)
    .order('is_premium', { ascending: false })
    .order('score_avis', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error || !data) {
    return { data: [], total: 0, error };
  }

  return {
    data: (data as Record<string, unknown>[]).map(mapEntrepriseRow),
    total: count ?? 0,
    error: null,
  };
}

const MIN_RATING = 4.0;
const MIN_REVIEWS = 5;

function parseRating(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === 'number') return isNaN(raw) ? 0 : raw;
  const n = parseFloat(String(raw).replace(',', '.'));
  return isNaN(n) ? 0 : Math.min(5, Math.max(0, n));
}

function parseCount(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === 'number') return isNaN(raw) ? 0 : Math.max(0, raw);
  const n = parseInt(String(raw).replace(/[^\d]/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

export async function fetchTopRecommendedByCity(
  ville: string,
  limit: number = 6,
): Promise<RecommendedBusiness[]> {
  if (!ville) return [];

  const { data, error } = await supabase
    .from('entreprise')
    .select(SIMILAR_SELECT)
    .ilike('ville', `%${ville}%`)
    .not('"Note Google Globale"', 'is', null)
    .gte('"Note Google Globale"', MIN_RATING)
    .gte('"Compteur Avis Google"', MIN_REVIEWS)
    .order('"Note Google Globale"', { ascending: false, nullsFirst: false })
    .limit(50);

  if (error || !data || data.length === 0) return [];

  const villeNorm = ville.toLowerCase().trim();
  const allRows = (data as Record<string, unknown>[]).map(mapEntrepriseRow);
  const rows = allRows.filter((r) => {
    const v = (r.ville || '').toLowerCase().trim();
    return v === villeNorm || v.startsWith(villeNorm + ' ') || v.startsWith(villeNorm + ',') || v.endsWith(' ' + villeNorm);
  });
  if (rows.length === 0) return [];

  const scored: RecommendedBusiness[] = rows.map((biz) => {
    const rating = parseRating(biz['Note Google Globale']);
    return { ...biz, confidenceScore: rating };
  });

  scored.sort((a, b) => {
    const ratingDiff = b.confidenceScore - a.confidenceScore;
    if (ratingDiff !== 0) return ratingDiff;
    return parseCount(b['Compteur Avis Google']) - parseCount(a['Compteur Avis Google']);
  });

  return scored.slice(0, limit);
}
