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

    // On diffère le fetch au-delà du premier rendu pour ne pas concurrencer
    // le chargement de l'image LCP et du code critique. On utilise
    // requestIdleCallback si dispo, sinon un setTimeout de secours.
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const runFetch = () => {
      if (!state.loading) return;
      prefetchHomeData()
        .then((result) => {
          setState({ partners: result.partners, totalCount: result.totalCount, certifiedCount: result.certifiedCount, loading: false });
        })
        .catch(() => {
          setState((s) => ({ ...s, loading: false }));
        });
    };

    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(runFetch, { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(runFetch, 300);
    }

    return () => {
      unsub();
      if (idleId !== undefined && typeof w.cancelIdleCallback === 'function') w.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  // Intentionnellement sans dépendances — on ne veut s'exécuter qu'au montage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
