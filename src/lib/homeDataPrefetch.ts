/**
 * Cache persistant pour les données home — équivalent de React Query
 * sans dépendance externe.
 *
 * staleTime  : 5 minutes  → les visites dans la fenêtre n'émettent aucune requête
 * gcTime     : 1 heure    → les données sont gardées en localStorage pour un retour rapide
 *                           même après fermeture de l'onglet
 *
 * Le prefetch peut être déclenché n'importe où (Layout, service worker, etc.)
 * sans provoquer de double-fetch grâce au verrou `inflight`.
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
  'statut Abonnement': string | null;
  'niveau priorité abonnement': number | null;
  image_url: string | null;
  logo_url: string | null;
  horaires_ok: string | null;
  telephone: string | null;
  statut_carte: string | null;
  name_ar: string | null;
  description_ar: string | null;
}

export interface HomeQueryResult {
  partners: HomeBusinessRow[];
  totalCount: number;
  certifiedCount: number;
}

interface CacheEntry extends HomeQueryResult {
  ts: number;
}

const CACHE_KEY = 'home_data_v7';
const STALE_TIME = 5 * 60_000;   // 5 minutes — pas de refetch dans cette fenêtre
const GC_TIME   = 60 * 60_000;   // 1 heure  — TTL maximale en localStorage

const FIELDS = [
  'id', 'nom', 'ville', 'gouvernorat', 'sous_categories',
  '"statut Abonnement"', '"niveau priorité abonnement"',
  'image_url', 'logo_url', 'horaires_ok', 'telephone', 'statut_carte',
  'name_ar', 'description_ar',
].join(', ');

// Verrou contre les appels simultanés (évite les doubles requêtes en cas de
// montage multiple du composant)
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
    return { partners: entry.partners, totalCount: entry.totalCount, certifiedCount: entry.certifiedCount ?? 0, fresh: age < STALE_TIME };
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

async function doFetch(): Promise<HomeQueryResult> {
  const supabase = await getSupabase();
  const [listRes, countRes, certifiedRes] = await Promise.all([
    supabase
      .from('entreprise')
      .select(FIELDS)
      .or('"statut Abonnement".ilike.*Elite Pro*,"statut Abonnement".ilike.*Elite*,"statut Abonnement".ilike.*Premium*')
      .order('"niveau priorité abonnement"', { ascending: false, nullsFirst: false })
      .limit(12),
    supabase
      .from('entreprise')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('entreprise')
      .select('id', { count: 'exact', head: true })
      .ilike('statut_carte', '%CERTIFIÉ%')
      .not('statut_carte', 'ilike', '%NON CERTIFIÉ%'),
  ]);

  if (listRes.error) throw listRes.error;
  if (countRes.error) console.error('[homeDataPrefetch] countRes error:', countRes.error);
  if (certifiedRes.error) console.error('[homeDataPrefetch] certifiedRes error:', certifiedRes.error);

  const rows = (listRes.data as HomeBusinessRow[]) ?? [];
  const sorted = [...rows].sort((a, b) =>
    getSubscriptionPriority(b['statut Abonnement']) - getSubscriptionPriority(a['statut Abonnement'])
  );

  return {
    partners: sorted.slice(0, 4),
    totalCount: countRes.count ?? 0,
    certifiedCount: certifiedRes.count ?? 0,
  };
}

/**
 * Peut être appelé depuis n'importe quel endroit de l'arbre React.
 * - Si le cache est frais (< staleTime)  → résout immédiatement depuis localStorage
 * - Si le cache est périmé ou absent     → déclenche une requête (une seule à la fois)
 * - Les abonnés sont notifiés via `subscribers` quand les nouvelles données arrivent
 */
export function prefetchHomeData(): Promise<HomeQueryResult> {
  const cached = readHomeCache();
  if (cached?.fresh) return Promise.resolve(cached);

  if (inflight) return inflight;

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
 * Stale-While-Revalidate : lance un refetch en arrière-plan, même si le cache
 * est frais. Les abonnés reçoivent la mise à jour uniquement si le contenu
 * renvoyé diffère réellement de ce qui est en cache (évite les re-render inutiles).
 */
export function revalidateHomeData(): Promise<HomeQueryResult> {
  if (inflight) return inflight;

  inflight = doFetch()
    .then((result) => {
      const previous = readHomeCache();
      writeHomeCache(result);
      const changed = !previous || !sameResult(previous, result);
      if (changed) notifySubscribers(result);
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

// ── Pub/Sub léger pour notifier les composants montés ──────────────────────
type Subscriber = (result: HomeQueryResult) => void;
const subscribers = new Set<Subscriber>();

export function subscribeHomeData(fn: Subscriber): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function notifySubscribers(result: HomeQueryResult): void {
  subscribers.forEach((fn) => fn(result));
}
