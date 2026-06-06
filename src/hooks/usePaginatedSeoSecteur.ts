import { useState, useEffect, useCallback } from 'react';
import { fetchSeoBusinessesBySecteur } from '../lib/seoBusinessQueries';
import type { SeoBusiness } from '../lib/seoBusinessQueries';

export function usePaginatedSeoSecteur(secteurSlug: string | undefined, pageSize = 20) {
  const [businesses, setBusinesses] = useState<SeoBusiness[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!secteurSlug) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setBusinesses([]);

    fetchSeoBusinessesBySecteur({
      secteurSlug,
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
  }, [secteurSlug, pageSize]);

  const loadMore = useCallback(() => {
    if (loadingMore || !secteurSlug || businesses.length >= total) return;

    setLoadingMore(true);
    fetchSeoBusinessesBySecteur({
      secteurSlug,
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
  }, [businesses.length, total, loadingMore, secteurSlug, pageSize]);

  const hasMore = businesses.length < total;

  return { businesses, total, loading, loadingMore, hasMore, loadMore };
}
