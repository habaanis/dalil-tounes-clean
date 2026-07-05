import { useState, useEffect, useCallback } from 'react';
import { fetchSeoBusinesses } from '../lib/seoBusinessQueries';
import type { SeoBusiness } from '../lib/seoBusinessQueries';

interface UsePaginatedOptions {
  metier?: string;
  sousCategorie?: string;
  city?: string;
  pageSize?: number;
}

export function usePaginatedSeoBusinesses(options: UsePaginatedOptions, deps: unknown[]) {
  const { metier, sousCategorie, city, pageSize = 20 } = options;
  const [businesses, setBusinesses] = useState<SeoBusiness[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!metier && !city) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setBusinesses([]);

    fetchSeoBusinesses({
      limit: pageSize,
      offset: 0,
      metier,
      sousCategorie,
      city,
    }).then(({ data, total: t }) => {
      if (!cancelled) {
        setBusinesses(data);
        setTotal(t);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, deps);

  const loadMore = useCallback(() => {
    if (loadingMore || businesses.length >= total) return;

    setLoadingMore(true);
    fetchSeoBusinesses({
      limit: pageSize,
      offset: businesses.length,
      metier,
      sousCategorie,
      city,
    }).then(({ data }) => {
      setBusinesses(prev => {
        const ids = new Set(prev.map(b => b.id));
        const unique = data.filter(b => !ids.has(b.id));
        return [...prev, ...unique];
      });
      setLoadingMore(false);
    });
  }, [businesses.length, total, loadingMore, metier, sousCategorie, city, pageSize]);

  const hasMore = businesses.length < total;

  return { businesses, total, loading, loadingMore, hasMore, loadMore };
}
