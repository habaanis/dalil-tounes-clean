import { useState, useEffect } from 'react';
import {
  HomeBusinessRow,
  HomeQueryResult,
  prefetchHomeData,
  readHomeCache,
  subscribeHomeData,
} from '../lib/homeDataPrefetch';

export type { HomeBusinessRow };

interface HomeData {
  partners: HomeBusinessRow[];
  totalCount: number;
  certifiedCount: number;
  loading: boolean;
}

export function useHomeData(): HomeData {
  const [state, setState] = useState<HomeData>(() => {
    const cached = readHomeCache();
    return {
      partners: cached?.partners ?? [],
      totalCount: cached?.totalCount ?? 0,
      certifiedCount: cached?.certifiedCount ?? 0,
      loading: cached === null,
    };
  });

  useEffect(() => {
    const unsub = subscribeHomeData((result: HomeQueryResult) => {
      setState({ partners: result.partners, totalCount: result.totalCount, certifiedCount: result.certifiedCount, loading: false });
    });

    // Si le cache est périmé ou absent, déclencher le fetch
    if (state.loading) {
      prefetchHomeData()
        .then((result) => {
          setState({ partners: result.partners, totalCount: result.totalCount, certifiedCount: result.certifiedCount, loading: false });
        })
        .catch(() => {
          setState((s) => ({ ...s, loading: false }));
        });
    }

    return unsub;
  // Intentionnellement sans dépendances — on ne veut s'exécuter qu'au montage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
