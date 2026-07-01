/**
 * Cache persistant pour les données par défaut de /businesses.
 * Même stratégie que homeDataPrefetch : staleTime 5 min, gcTime 1 h, localStorage.
 *
 * Seules les données "sans filtre" (liste initiale + premium jobs) sont cachées.
 * Les résultats de recherche ne sont jamais cachés.
 */

import { supabase } from './supabaseClient';
import { Tables } from './dbTables';
import { extractFrenchName } from './textNormalization';

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
  niveau_priorite_abonnement?: number | null;
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
  slug: string | null;
  ville: string | null;
  name_ar?: string | null;
  description_ar?: string | null;
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

const CACHE_KEY   = 'businesses_default_v2';
const STALE_TIME  = 5 * 60_000;
const GC_TIME     = 60 * 60_000;

const FIELDS = [
  'id', 'nom', 'sous_categories_texte', 'sous_categories_clean', 'categorie', 'gouvernorat', 'ville',
  'adresse', 'telephone', 'email', 'site_web', 'description', 'services',
  'image_url', 'logo_url', 'statut_abonnement',
  '"mots cles recherche"', '"Lien Instagram"', '"lien facebook"', '"Lien TikTok"',
  '"Lien LinkedIn"', '"Lien YouTube"', 'lien_x', 'horaires_ok', 'statut_carte',
  'name_ar', 'description_ar', 'slug',
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

function toTextList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [];
}

function joinUnique(values: string[]): string {
  return Array.from(new Set(values)).join(', ');
}

function mapRow(item: Record<string, unknown>): BusinessRow {
  const subCategoryLabel = joinUnique([
    ...toTextList(item.sous_categories_texte),
    ...toTextList(item.sous_categories_clean),
  ]);
  const categoryLabel = subCategoryLabel || joinUnique(toTextList(item.categorie));
  const secteurLabel = joinUnique([
    ...toTextList(item.categorie),
    ...toTextList(item.sous_categories_texte),
    ...toTextList(item.sous_categories_clean),
  ]);

  return {
    id: item.id as string,
    name: extractFrenchName(item.nom as string),
    category: categoryLabel,
    subCategories: subCategoryLabel,
    gouvernorat: (item.gouvernorat as string) || '',
    secteur: secteurLabel,
    city: (item.ville as string) || '',
    address: (item.adresse as string) || '',
    phone: (item.telephone as string) || '',
    email: (item.email as string) || '',
    website: (item.site_web as string) || '',
    description: (item.description as string) || '',
    services: (item.services as string) || '',
    imageUrl: (item.image_url as string | null) ?? null,
    logoUrl: (item.logo_url as string | null) ?? null,
    statut_abonnement: (item.statut_abonnement as string | null) ?? null,
    niveau_priorite_abonnement: null,
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
    slug: (item.slug as string | null) ?? null,
    ville: (item.ville as string | null) ?? null,
    name_ar: (item.name_ar as string | null) ?? null,
    description_ar: (item.description_ar as string | null) ?? null,
  };
}

async function doFetch(): Promise<BusinessesDefaultData> {
  const [listRes, jobsRes] = await Promise.all([
    supabase
      .from(Tables.ENTREPRISE)
      .select(FIELDS)
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

  const rows = Array.isArray(listRes.data) ? (listRes.data as unknown[]) : [];
  const businesses = rows.map((item) => mapRow(item as Record<string, unknown>));
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
