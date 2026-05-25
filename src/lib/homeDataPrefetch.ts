/**
 * Cache persistant pour les données home — équivalent de React Query
 * sans dépendance externe.
 *
 * staleTime  : 5 minutes  → les visites dans la fenêtre n'émettent aucune requête
 * gcTime     : 1 heure    → les données sont gardées en localStorage pour un retour rapide
 *                           même après fermeture de l'onglet
 */

import { getSubscriptionPriority } from './subscriptionHelper';

// Import dynamique : le chunk vendor-supabase (~167 kB) n'entre pas dans
// le graphe statique du module Home, donc Vite ne génère pas de modulepreload
// pour lui. Le SDK n'est chargé qu'au premier fetch réel.
async function getSupabase() {
  const m = await import('./supabaseClient');
  return m.supabase;
}

export interface HomeBusinessRow {
  id: string;
  nom: string;
  ville: string | null;
  gouvernorat: string | null;
  sous_categories: string | null;
  statut_abonnement: string | null;
  niveau_priorite_abonnement: number | null;
  image_url: string | null;
  logo_url: string | null;
  horaires_ok: string | null;
  telephone: string | null;
  statut_carte: string | null;
  name_ar: string | null;
  description_ar: string | null;

  // Champs utiles au diagnostic / tri éventuel
  featured: boolean | null;
  is_premium: boolean | null;
  approved: boolean | null;
  statut_validation: string | null;
}

const SUBSCRIPTION_COL_RAW = 'statut Abonnement';
const PRIORITY_COL_RAW = 'niveau priorité abonnement';

// Règle métier actuelle : les cartes visibles dans "Établissements à la Une"
// sont les fiches dont statut_carte vaut exactement ce label.
const CERTIFIED_LABEL = '⭐ CERTIFIÉ DALIL TOUNES';

export interface HomeQueryResult {
  partners: HomeBusinessRow[];
  totalCount: number;
  certifiedCount: number;
}

interface CacheEntry extends HomeQueryResult {
  ts: number;
}

// Nouvelle clé pour éviter de réutiliser l'ancien cache home_data_v11/v12.
const CACHE_KEY = 'home_data_v13';

const STALE_TIME = 5 * 60_000;
const GC_TIME = 60 * 60_000;

// On sélectionne avec '*' pour éviter d'avoir à quoter manuellement les
// colonnes contenant un espace ou un accent dans la liste select.
const FIELDS = '*';

// Verrou contre les appels simultanés
let inflight: Promise<HomeQueryResult> | null = null;

export function readHomeCache(): (HomeQueryResult & { fresh: boolean }) | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const entry: CacheEntry = JSON.parse(raw);
    const age = Date.now() - entry.ts;

    if (age > GC_TIME) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return {
      partners: entry.partners,
      totalCount: entry.totalCount,
      certifiedCount: entry.certifiedCount ?? 0,
      fresh: age < STALE_TIME,
    };
  } catch {
    return null;
  }
}

function writeHomeCache(result: HomeQueryResult): void {
  try {
    const entry: CacheEntry = { ...result, ts: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Quota dépassé ou mode privé — silencieux
  }
}

function normalizeText(value: string | null | undefined): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function isCertifiedDalilTounes(value: string | null): boolean {
  return normalizeText(value) === normalizeText(CERTIFIED_LABEL);
}

function mapHomeBusinessRow(r: Record<string, unknown>): HomeBusinessRow {
  return {
    id: r.id as string,
    nom: (r.nom as string) ?? '',

    ville: (r.ville as string | null) ?? null,
    gouvernorat: (r.gouvernorat as string | null) ?? null,

    sous_categories:
      (r.sous_categories_texte as string | null) ??
      (r.sous_categories_clean as string | null) ??
      null,

    statut_abonnement:
      (r[SUBSCRIPTION_COL_RAW] as string | null) ??
      (r.statut_abonnement as string | null) ??
      null,

    niveau_priorite_abonnement:
      (r[PRIORITY_COL_RAW] as number | null) ??
      (r.niveau_priorite as number | null) ??
      null,

    image_url: (r.image_url as string | null) ?? null,
    logo_url: (r.logo_url as string | null) ?? null,
    horaires_ok: (r.horaires_ok as string | null) ?? null,
    telephone: (r.telephone as string | null) ?? null,
    statut_carte: (r.statut_carte as string | null) ?? null,

    name_ar: (r.name_ar as string | null) ?? null,
    description_ar: (r.description_ar as string | null) ?? null,

    featured: (r.featured as boolean | null) ?? null,
    is_premium: (r.is_premium as boolean | null) ?? null,
    approved: (r.approved as boolean | null) ?? null,
    statut_validation: (r.statut_validation as string | null) ?? null,
  };
}

async function doFetch(): Promise<HomeQueryResult> {
  const supabase = await getSupabase();

  console.log(
    '[HOME-DIAG] target Supabase URL =',
    (import.meta as unknown as { env: Record<string, string> }).env.VITE_SUPABASE_URL
  );

  console.log('[HOME-DIAG] CERTIFIED_LABEL =', JSON.stringify(CERTIFIED_LABEL));

  const [listRes, countRes, certifiedRes] = await Promise.all([
    // Établissements à la Une :
    // on récupère directement les fiches certifiées côté Supabase.
    supabase
      .from('entreprise')
      .select(FIELDS)
      .eq('statut_carte', CERTIFIED_LABEL)
      .limit(8),

    // Compteur global : toutes les fiches entreprises.
    supabase
      .from('entreprise')
      .select('id', { count: 'exact', head: true }),

    // Compteur certifiées : même règle métier que la section à la une.
    supabase
      .from('entreprise')
      .select('id', { count: 'exact', head: true })
      .eq('statut_carte', CERTIFIED_LABEL),
  ]);

  console.log('[HOME-DIAG] countRes', {
    count: countRes.count,
    status: countRes.status,
    statusText: countRes.statusText,
    error: countRes.error,
  });

  console.log('[HOME-DIAG] certifiedRes', {
    count: certifiedRes.count,
    status: certifiedRes.status,
    statusText: certifiedRes.statusText,
    error: certifiedRes.error,
  });

  console.log('[HOME-DIAG] listRes', {
    rows: Array.isArray(listRes.data) ? listRes.data.length : 0,
    status: listRes.status,
    statusText: listRes.statusText,
    error: listRes.error,
    firstRowKeys:
      Array.isArray(listRes.data) && listRes.data[0]
        ? Object.keys(listRes.data[0])
        : [],
    firstRow:
      Array.isArray(listRes.data) && listRes.data[0]
        ? listRes.data[0]
        : null,
  });

  if (listRes.error) {
    console.error('[homeDataPrefetch] listRes error:', listRes.error);
  }

  if (countRes.error) {
    console.error('[homeDataPrefetch] countRes error:', countRes.error);
  }

  if (certifiedRes.error) {
    console.error('[homeDataPrefetch] certifiedRes error:', certifiedRes.error);
  }

  const rawRows = (listRes.data as Record<string, unknown>[] | null) ?? [];

  const allMapped = rawRows.map(mapHomeBusinessRow);

  // Sécurité côté client : même si Supabase retourne quelque chose d'inattendu,
  // on garde uniquement les fiches certifiées.
  const rows = allMapped.filter((p) => isCertifiedDalilTounes(p.statut_carte));

  console.log('[HOME-DIAG] rows fetched from Supabase =', allMapped.length);
  console.log('[HOME-DIAG] certified carousel rows after client filter =', rows.length);

  console.log(
    '[HOME-DIAG] sample certified carousel =',
    rows.slice(0, 8).map((p) => ({
      id: p.id,
      nom: p.nom,
      statut_carte: p.statut_carte,
      featured: p.featured,
      is_premium: p.is_premium,
      approved: p.approved,
      statut_validation: p.statut_validation,
      statut_abonnement: p.statut_abonnement,
      niveau_priorite_abonnement: p.niveau_priorite_abonnement,
    }))
  );

  // Tri :
  // 1. priorité abonnement si elle existe
  // 2. priorité calculée depuis le statut d'abonnement si elle existe
  // 3. nom alphabétique pour un ordre stable
  const sorted = [...rows].sort((a, b) => {
    const pa = a.niveau_priorite_abonnement ?? -1;
    const pb = b.niveau_priorite_abonnement ?? -1;

    if (pa !== pb) return pb - pa;

    const subPriority =
      getSubscriptionPriority(b.statut_abonnement) -
      getSubscriptionPriority(a.statut_abonnement);

    if (subPriority !== 0) return subPriority;

    return (a.nom || '').localeCompare(b.nom || '', 'fr');
  });

  const result: HomeQueryResult = {
    partners: sorted.slice(0, 8),
    totalCount: countRes.count ?? 0,
    certifiedCount: certifiedRes.count ?? 0,
  };

  console.log('[HOME-DIAG] final HomeQueryResult =', {
    totalCount: result.totalCount,
    certifiedCount: result.certifiedCount,
    partners: result.partners.length,
  });

  return result;
}

/**
 * Peut être appelé depuis n'importe quel endroit de l'arbre React.
 * - Si le cache est frais (< staleTime)  → résout immédiatement depuis localStorage
 * - Si le cache est périmé ou absent     → déclenche une requête
 * - Les abonnés sont notifiés via `subscribers` quand les nouvelles données arrivent
 */
export function prefetchHomeData(): Promise<HomeQueryResult> {
  const cached = readHomeCache();

  if (cached?.fresh) {
    return Promise.resolve(cached);
  }

  if (inflight) {
    return inflight;
  }

  inflight = doFetch()
    .then((result) => {
      writeHomeCache(result);
      notifySubscribers(result);
      return result;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/**
 * Stale-While-Revalidate : lance un refetch en arrière-plan.
 */
export function revalidateHomeData(): Promise<HomeQueryResult> {
  if (inflight) {
    return inflight;
  }

  inflight = doFetch()
    .then((result) => {
      const previous = readHomeCache();

      writeHomeCache(result);

      const changed = !previous || !sameResult(previous, result);

      if (changed) {
        notifySubscribers(result);
      }

      return result;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

function sameResult(a: HomeQueryResult, b: HomeQueryResult): boolean {
  if (a.totalCount !== b.totalCount) return false;
  if (a.certifiedCount !== b.certifiedCount) return false;
  if (a.partners.length !== b.partners.length) return false;

  for (let i = 0; i < a.partners.length; i++) {
    if (a.partners[i].id !== b.partners[i].id) return false;
  }

  return true;
}

// Pub/Sub léger pour notifier les composants montés
type Subscriber = (result: HomeQueryResult) => void;

const subscribers = new Set<Subscriber>();

export function subscribeHomeData(fn: Subscriber): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function notifySubscribers(result: HomeQueryResult): void {
  subscribers.forEach((fn) => fn(result));
}