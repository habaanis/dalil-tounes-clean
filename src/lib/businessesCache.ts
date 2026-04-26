/**
 * Cache persistant pour les données par défaut de /businesses.
 * Même stratégie que homeDataPrefetch : staleTime 5 min, gcTime 1 h, localStorage.
 *
 * Seules les données "sans filtre" (liste initiale + premium jobs) sont cachées.
 * Les résultats de recherche ne sont jamais cachés.
 */

import { supabase } from './supabaseClient';
import { Tables } from './dbTables';

export interface BusinessRow {
  id: string;
  name: string;
  category: string;
  subCategories: string;
  gouvernorat: string;
  secteur: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  services: string;
  imageUrl: string | null;
  logoUrl: string | null;
  statut_abonnement: string | null;
  'niveau priorité abonnement': number | null;
  badges: never[];
  mots_cles_recherche: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  linkedin: string;
  youtube: string;
  lien_x: string;
  horaires_ok: string | null;
  statut_carte: string | null;
}

export interface PremiumJob {
  id: string;
  [key: string]: unknown;
}

export interface BusinessesDefaultData {
  businesses: BusinessRow[];
  premiumJobs: PremiumJob[];
}

interface CacheEntry extends BusinessesDefaultData {
  ts: number;
}

const CACHE_KEY   = 'businesses_default_v1';
const STALE_TIME  = 5 * 60_000;
const GC_TIME     = 60 * 60_000;

const FIELDS = [
  'id', 'nom', 'secteur', 'sous_categories', '"catégorie"', 'gouvernorat', 'ville',
  'adresse', 'telephone', 'email', 'site_web', 'description', 'services',
  'image_url', 'logo_url', '"statut Abonnement"', '"niveau priorité abonnement"',
  '"mots cles recherche"', '"Lien Instagram"', '"lien facebook"', '"Lien TikTok"',
  '"Lien LinkedIn"', '"Lien YouTube"', 'lien_x', 'horaires_ok', 'statut_carte',
].join(', ');

let inflight: Promise<BusinessesDefaultData> | null = null;

export function readBusinessesCache(): (BusinessesDefaultData & { fresh: boolean }) | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    const age = Date.now() - entry.ts;
    if (age > GC_TIME) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return { businesses: entry.businesses, premiumJobs: entry.premiumJobs, fresh: age < STALE_TIME };
  } catch {
    return null;
  }
}

function writeBusinessesCache(data: BusinessesDefaultData): void {
  try {
    const entry: CacheEntry = { ...data, ts: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Quota ou mode privé — silencieux
  }
}

function mapRow(item: Record<string, unknown>): BusinessRow {
  return {
    id: item.id as string,
    name: (item.nom as string) || '',
    category: Array.isArray(item.sous_categories)
      ? (item.sous_categories as string[]).join(', ')
      : ((item.sous_categories as string) || ''),
    subCategories: Array.isArray(item.sous_categories)
      ? (item.sous_categories as string[]).join(', ')
      : ((item.sous_categories as string) || ''),
    gouvernorat: (item.gouvernorat as string) || '',
    secteur: Array.isArray(item.secteur)
      ? (item.secteur as string[]).join(', ')
      : ((item.secteur as string) || ''),
    city: (item.ville as string) || '',
    address: (item.adresse as string) || '',
    phone: (item.telephone as string) || '',
    email: (item.email as string) || '',
    website: (item.site_web as string) || '',
    description: (item.description as string) || '',
    services: (item.services as string) || '',
    imageUrl: (item.image_url as string | null) ?? null,
    logoUrl: (item.logo_url as string | null) ?? null,
    statut_abonnement: (item['statut Abonnement'] as string | null) ?? null,
    'niveau priorité abonnement': (item['niveau priorité abonnement'] as number | null) ?? null,
    badges: [],
    mots_cles_recherche: (item['mots cles recherche'] as string) || '',
    instagram: (item['Lien Instagram'] as string) || '',
    facebook: (item['lien facebook'] as string) || '',
    tiktok: (item['Lien TikTok'] as string) || '',
    linkedin: (item['Lien LinkedIn'] as string) || '',
    youtube: (item['Lien YouTube'] as string) || '',
    lien_x: (item.lien_x as string) || '',
    horaires_ok: (item.horaires_ok as string | null) ?? null,
    statut_carte: (item.statut_carte as string | null) ?? null,
  };
}

async function doFetch(): Promise<BusinessesDefaultData> {
  const [listRes, jobsRes] = await Promise.all([
    supabase
      .from(Tables.ENTREPRISE)
      .select(FIELDS)
      .order('"niveau priorité abonnement"', { ascending: false, nullsFirst: false })
      .order('nom', { ascending: true })
      .limit(10),
    supabase
      .from(Tables.JOB_POSTINGS)
      .select('*')
      .eq('statut', 'active')
      .eq('est_premium', true)
      .order('created_at', { ascending: false })
      .limit(6),
  ]);

  const businesses = (listRes.data ?? []).map((item) => mapRow(item as Record<string, unknown>));
  const premiumJobs = (jobsRes.data ?? []) as PremiumJob[];

  return { businesses, premiumJobs };
}

export function prefetchBusinessesData(): Promise<BusinessesDefaultData> {
  const cached = readBusinessesCache();
  if (cached?.fresh) return Promise.resolve(cached);

  if (inflight) return inflight;

  inflight = doFetch()
    .then((result) => {
      writeBusinessesCache(result);
      notifySubscribers(result);
      return result;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

// Pub/Sub léger
type Subscriber = (result: BusinessesDefaultData) => void;
const subscribers = new Set<Subscriber>();

export function subscribeBusinessesData(fn: Subscriber): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function notifySubscribers(result: BusinessesDefaultData): void {
  subscribers.forEach((fn) => fn(result));
}
