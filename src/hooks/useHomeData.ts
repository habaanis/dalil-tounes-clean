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
const STALE_TIME = 5 * 60_000; // 5 minutes

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
    // localStorage indisponible (mode privé, quota)
  }
}

async function fetchHomeData(): Promise<{ partners: HomeBusinessRow[]; totalCount: number }> {
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
  // Lire le cache une seule fois au montage pour initialiser l'état synchrone
  const [state, setState] = useState<{ partners: HomeBusinessRow[]; totalCount: number; loading: boolean }>(() => {
    const cached = readLocalCache();
    return {
      partners: cached?.partners ?? [],
      totalCount: cached?.totalCount ?? 0,
      // Cache valide → pas de spinner, le contenu s'affiche immédiatement
      loading: cached === null,
    };
  });

  useEffect(() => {
    // Cache encore frais au montage : pas de requête réseau
    if (!state.loading) return;

    let cancelled = false;

    fetchHomeData()
      .then(({ partners, totalCount }) => {
        if (cancelled) return;
        setState({ partners, totalCount, loading: false });
        writeLocalCache({ partners, totalCount });
      })
      .catch((err) => {
        console.error('[useHomeData]', err);
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      });

    return () => { cancelled = true; };
  // Ne pas relancer si state.loading change après le montage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
