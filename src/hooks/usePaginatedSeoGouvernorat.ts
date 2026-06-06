import { useState, useEffect, useCallback } from 'react';
import { fetchSeoBusinessesByGouvernorat } from '../lib/seoBusinessQueries';
import type { SeoBusiness } from '../lib/seoBusinessQueries';

export function usePaginatedSeoGouvernorat(gouvernoratSlug: string | undefined, pageSize = 20) {
  const [businesses, setBusinesses] = useState<SeoBusiness[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!gouvernoratSlug) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setBusinesses([]);

    fetchSeoBusinessesByGouvernorat({
      gouvernoratSlug,
      limit: pageSize,
      offset: 0,
    }).then(({ data, total: t }) => {
      if (!cancelled) {
        setBusinesses(data);
        setTotal(t);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [gouvernoratSlug, pageSize]);

  const loadMore = useCallback(() => {
    if (loadingMore || !gouvernoratSlug || businesses.length >= total) return;

    setLoadingMore(true);
    fetchSeoBusinessesByGouvernorat({
      gouvernoratSlug,
      limit: pageSize,
      offset: businesses.length,
    }).then(({ data }) => {
      setBusinesses(prev => {
        const ids = new Set(prev.map(b => b.id));
        const unique = data.filter(b => !ids.has(b.id));
        return [...prev, ...unique];
      });
      setLoadingMore(false);
    });
  }, [businesses.length, total, loadingMore, gouvernoratSlug, pageSize]);

  const hasMore = businesses.length < total;

  return { businesses, total, loading, loadingMore, hasMore, loadMore };
}
