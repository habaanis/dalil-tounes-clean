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
  statut_abonnement: string | null;
  niveau_priorite_abonnement: number | null;
  image_url: string | null;
  logo_url: string | null;
  horaires_ok: string | null;
  telephone: string | null;
  statut_carte: string | null;
  name_ar: string | null;
  description_ar: string | null;
}

// Les colonnes d'abonnement existent en base avec un espace / un accent
// (heritage Airtable). PostgREST ne sait pas appliquer .in() / .order() de
// maniere fiable sur ces noms quotes, on lit donc large et on filtre / trie
// cote client.
const SUBSCRIPTION_COL_RAW = 'statut Abonnement';
const PRIORITY_COL_RAW = 'niveau priorité abonnement';
const CERTIFIED_LABEL = '⭐ CERTIFIÉ DALIL TOUNES';

// 🔧 CORRECTION : Filtre plus large qui capture toutes les valeurs contenant
// "premium" ou "elite" (insensible à la casse)
// Cela permet de capturer :
// - premium 99tTND
// - elite pro 189tnd
// - premium, Elite, Elite Pro (sans chiffres)
const HOME_TIERS_KEYWORDS = new Set(['premium', 'elite']);

export interface HomeQueryResult {
  partners: HomeBusinessRow[];
  totalCount: number;
  certifiedCount: number;
}

interface CacheEntry extends HomeQueryResult {
  ts: number;
}

const CACHE_KEY = 'home_data_v11';
const STALE_TIME = 5 * 60_000;   // 5 minutes — pas de refetch dans cette fenêtre
const GC_TIME   = 60 * 60_000;   // 1 heure  — TTL maximale en localStorage

// On selectionne avec '*' pour eviter d'avoir a quoter manuellement les
// colonnes contenant un espace ou un accent dans la liste select.
const FIELDS = '*';

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

  // [HOME-DIAG] Confirme la cible Supabase reellement utilisee par le bundle
  // (utile pour detecter un bundle qui pointe vers un autre projet que celui
  // ou se trouvent les 1891 lignes).
  console.log('[HOME-DIAG] target Supabase URL =', (import.meta as unknown as { env: Record<string, string> }).env.VITE_SUPABASE_URL);
  console.log('[HOME-DIAG] FIELDS =', FIELDS);
  console.log('[HOME-DIAG] CERTIFIED_LABEL =', JSON.stringify(CERTIFIED_LABEL));

  const [listRes, countRes, certifiedRes] = await Promise.all([
    // Établissements à la Une : on ne peut pas filtrer .in() sur une colonne
    // contenant un espace via PostgREST (erreur 400). On lit donc un échantillon
    // large et on filtre/trie côté client sur les colonnes "statut Abonnement"
    // et "niveau priorité abonnement".
    supabase
      .from('entreprise')
      .select(FIELDS)
      .limit(200),
    // Compteur global : toutes les fiches entreprises (aucun filtre)
    supabase
      .from('entreprise')
      .select('id', { count: 'exact', head: true }),
    // Compteur certifiées : match exact sur le label complet
    supabase
      .from('entreprise')
      .select('id', { count: 'exact', head: true })
      .eq('statut_carte', CERTIFIED_LABEL),
  ]);

  // [HOME-DIAG] Log brut de chaque réponse (status, error, count, sample)
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
    firstRowKeys: Array.isArray(listRes.data) && listRes.data[0] ? Object.keys(listRes.data[0]) : [],
    firstRow: Array.isArray(listRes.data) ? listRes.data[0] : null,
  });

  if (listRes.error) {
    console.error('[homeDataPrefetch] listRes error:', listRes.error);
    // On ne throw plus : on veut quand même que les counts s'affichent si possible.
  }
  if (countRes.error) console.error('[homeDataPrefetch] countRes error:', countRes.error);
  if (certifiedRes.error) console.error('[homeDataPrefetch] certifiedRes error:', certifiedRes.error);

  // Normalise les clés avec espaces vers les clés plates exposées par HomeBusinessRow.
  // Si jamais les colonnes "statut Abonnement" / "niveau priorité abonnement" ne sont
  // pas retournées par PostgREST, on tombe sur le fallback snake_case.
  const rawRows = (listRes.data as Record<string, unknown>[] | null) ?? [];
  const allMapped: HomeBusinessRow[] = rawRows.map((r) => ({
    id: r.id as string,
    nom: r.nom as string,
    ville: (r.ville as string | null) ?? null,
    gouvernorat: (r.gouvernorat as string | null) ?? null,
    sous_categories: (r.sous_categories_texte as string | null) ?? (r.sous_categories_clean as string | null) ?? null,
    statut_abonnement: (r[SUBSCRIPTION_COL_RAW] as string | null) ?? (r.statut_abonnement as string | null) ?? null,
    niveau_priorite_abonnement: (r[PRIORITY_COL_RAW] as number | null) ?? (r.niveau_priorite as number | null) ?? null,
    image_url: (r.image_url as string | null) ?? null,
    logo_url: (r.logo_url as string | null) ?? null,
    horaires_ok: (r.horaires_ok as string | null) ?? null,
    telephone: (r.telephone as string | null) ?? null,
    statut_carte: (r.statut_carte as string | null) ?? null,
    name_ar: (r.name_ar as string | null) ?? null,
    description_ar: (r.description_ar as string | null) ?? null,
  }));

  // 🔧 CORRECTION : Filtrage côté client plus large
  // Capture toutes les valeurs contenant "premium" ou "elite" (insensible à la casse)
  // Exemples capturés : premium, premium 99tTND, Elite, Elite Pro, elite pro 189tnd
  const rows = allMapped.filter((p) => {
    const tier = (p.statut_abonnement || '').toLowerCase().trim();
    return HOME_TIERS_KEYWORDS.has('premium') && tier.includes('premium') ||
           HOME_TIERS_KEYWORDS.has('elite') && tier.includes('elite');
  });

  console.log('[HOME-DIAG] rows fetched =', allMapped.length, '| filtered carrousel =', rows.length);
  console.log('[HOME-DIAG] sample carrousel =', rows.slice(0, 4).map((p) => ({
    id: p.id,
    nom: p.nom,
    statut_abonnement: p.statut_abonnement,
    niveau_priorite_abonnement: p.niveau_priorite_abonnement,
    statut_carte: p.statut_carte,
  })));

  const sorted = [...rows].sort((a, b) => {
    const pa = a.niveau_priorite_abonnement ?? -1;
    const pb = b.niveau_priorite_abonnement ?? -1;
    if (pa !== pb) return pb - pa;
    return getSubscriptionPriority(b.statut_abonnement) - getSubscriptionPriority(a.statut_abonnement);
  });

  const result = {
    partners: sorted.slice(0, 8), // Augmenté à 8 pour avoir plus de résultats
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