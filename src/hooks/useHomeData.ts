import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { withCache } from '../lib/supabaseCache';
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

async function fetchHomeData(): Promise<{ partners: HomeBusinessRow[]; totalCount: number }> {
  // Requête unique : récupère featured + top premium en une seule passe, avec count total
  const { data, count, error } = await supabase
    .from('entreprise')
    .select(FIELDS, { count: 'exact' })
    .or('is_featured.eq.true,"statut Abonnement".ilike.*Elite Pro*,"statut Abonnement".ilike.*Elite*,"statut Abonnement".ilike.*Premium*')
    .order('"niveau priorité abonnement"', { ascending: false, nullsFirst: false })
    .limit(12);

  if (error) throw error;

  const rows = (data as HomeBusinessRow[]) ?? [];

  // Trier : featured d'abord, puis par priorité d'abonnement
  const sorted = [...rows].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return getSubscriptionPriority(b['statut Abonnement']) - getSubscriptionPriority(a['statut Abonnement']);
  });

  // Pour le count total on refait un head-only si le count retourné est limité au filtre
  const { count: total } = await supabase
    .from('entreprise')
    .select('*', { count: 'exact', head: true });

  return { partners: sorted.slice(0, 4), totalCount: total ?? count ?? 0 };
}

export function useHomeData(): HomeData {
  const [partners, setPartners] = useState<HomeBusinessRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    withCache('home_data', {}, fetchHomeData, 5 * 60 * 1000)
      .then(({ partners: p, totalCount: c }) => {
        if (cancelled) return;
        setPartners(p);
        setTotalCount(c);
      })
      .catch((err) => {
        console.error('[useHomeData]', err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { partners, totalCount, loading };
}
