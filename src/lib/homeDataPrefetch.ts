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

import { supabase } from './supabaseClient';
import { getSubscriptionPriority } from './subscriptionHelper';

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
  is_featured: boolean | null;
  statut_carte: string | null;
}

export interface HomeQueryResult {
  partners: HomeBusinessRow[];
  totalCount: number;
}

interface CacheEntry extends HomeQueryResult {
  ts: number;
}

const CACHE_KEY = 'home_data_v4';
const STALE_TIME = 5 * 60_000;   // 5 minutes — pas de refetch dans cette fenêtre
const GC_TIME   = 60 * 60_000;   // 1 heure  — TTL maximale en localStorage

const FIELDS = [
  'id', 'nom', 'ville', 'gouvernorat', 'sous_categories',
  '"statut Abonnement"', '"niveau priorité abonnement"',
  'image_url', 'logo_url', 'horaires_ok', 'telephone', 'is_featured', 'statut_carte',
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
    return { partners: entry.partners, totalCount: entry.totalCount, fresh: age < STALE_TIME };
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
  const [listRes, countRes] = await Promise.all([
    supabase
      .from('entreprise')
      .select(FIELDS)
      .or('is_featured.eq.true,"statut Abonnement".ilike.*Elite Pro*,"statut Abonnement".ilike.*Elite*,"statut Abonnement".ilike.*Premium*')
      .order('"niveau priorité abonnement"', { ascending: false, nullsFirst: false })
      .limit(12),
    supabase
      .from('entreprise')
      .select('*', { count: 'exact', head: true }),
  ]);

  if (listRes.error) throw listRes.error;

  const rows = (listRes.data as HomeBusinessRow[]) ?? [];
  const sorted = [...rows].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return (
      getSubscriptionPriority(b['statut Abonnement']) -
      getSubscriptionPriority(a['statut Abonnement'])
    );
  });

  // Si le count Supabase retourne 0 ou null (table vide / RLS / env dev),
  // on tente une deuxième requête sans filtre sur la liste pour avoir au moins
  // le nombre d'éléments retournés. Le chiffre réel sera celui de countRes si > 0.
  const rawCount = countRes.count ?? 0;
  return { partners: sorted.slice(0, 4), totalCount: rawCount };
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
