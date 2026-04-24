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
  loading: boolean;
}

export function useHomeData(): HomeData {
  const [state, setState] = useState<HomeData>(() => {
    const cached = readHomeCache();
    return {
      partners: cached?.partners ?? [],
      totalCount: cached?.totalCount ?? 0,
      // Cache frais → affichage immédiat, zéro spinner
      loading: cached === null,
    };
  });

  useEffect(() => {
    // S'abonner aux mises à jour provenant du prefetch déclenché par Layout
    const unsub = subscribeHomeData((result: HomeQueryResult) => {
      setState({ partners: result.partners, totalCount: result.totalCount, loading: false });
    });

    // Si le cache est périmé ou absent, déclencher le fetch (ou se raccrocher
    // à celui déjà en cours depuis Layout — le verrou inflight l'empêche d'être doublé)
    if (state.loading) {
      prefetchHomeData()
        .then((result) => {
          setState({ partners: result.partners, totalCount: result.totalCount, loading: false });
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
