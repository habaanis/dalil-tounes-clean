import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getSubscriptionPriority } from '../lib/subscriptionHelper';

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
}

interface HomeData {
  partners: HomeBusinessRow[];
  totalCount: number;
  loading: boolean;
}

const FIELDS = `id, nom, ville, gouvernorat, sous_categories, "statut Abonnement", "niveau priorité abonnement", image_url, logo_url, horaires_ok, telephone, is_featured`;
const CACHE_KEY = 'home_data_v1';
const STALE_TIME = 60_000; // 1 minute

interface CacheEntry {
  partners: HomeBusinessRow[];
  totalCount: number;
  ts: number;
}

function readLocalCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.ts > STALE_TIME) return null;
    return entry;
  } catch {
    return null;
  }
}

function writeLocalCache(entry: Omit<CacheEntry, 'ts'>): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...entry, ts: Date.now() }));
  } catch {
    // localStorage peut être indisponible (mode privé, quota dépassé)
  }
}

async function fetchHomeData(): Promise<{ partners: HomeBusinessRow[]; totalCount: number }> {
  // Les deux requêtes partent en parallèle
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
    return getSubscriptionPriority(b['statut Abonnement']) - getSubscriptionPriority(a['statut Abonnement']);
  });

  return {
    partners: sorted.slice(0, 4),
    totalCount: countRes.count ?? 0,
  };
}

export function useHomeData(): HomeData {
  const cached = readLocalCache();

  const [partners, setPartners] = useState<HomeBusinessRow[]>(cached?.partners ?? []);
  const [totalCount, setTotalCount] = useState(cached?.totalCount ?? 0);
  // Si on a un cache valide, pas de spinner — on affiche directement
  const [loading, setLoading] = useState(cached === null);

  useEffect(() => {
    // Cache encore frais : pas besoin de refetch
    if (cached !== null) return;

    let cancelled = false;

    fetchHomeData()
      .then(({ partners: p, totalCount: c }) => {
        if (cancelled) return;
        setPartners(p);
        setTotalCount(c);
        writeLocalCache({ partners: p, totalCount: c });
      })
      .catch((err) => {
        console.error('[useHomeData]', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { partners, totalCount, loading };
}
