import { useState, useEffect } from 'react';
import {
  HomeBusinessRow,
  HomeQueryResult,
  prefetchHomeData,
  readHomeCache,
  revalidateHomeData,
  subscribeHomeData,
} from '../lib/homeDataPrefetch';

export type { HomeBusinessRow };

interface HomeData {
  partners: HomeBusinessRow[];
  totalCount: number;
  certifiedCount: number;
  legacyCertifiedCount: number;
  recommendedCount: number | null;
  loading: boolean;
}

export function useHomeData(): HomeData {
  const [state, setState] = useState<HomeData>(() => {
    const cached = readHomeCache();
    return {
      partners: cached?.partners ?? [],
      totalCount: cached?.totalCount ?? 0,
      certifiedCount: cached?.certifiedCount ?? 0,
      legacyCertifiedCount: cached?.legacyCertifiedCount ?? 0,
      recommendedCount: cached?.recommendedCount ?? null,
      loading: cached === null,
    };
  });

  useEffect(() => {
    const unsub = subscribeHomeData((result: HomeQueryResult) => {
      setState({ partners: result.partners, totalCount: result.totalCount, certifiedCount: result.certifiedCount, legacyCertifiedCount: result.legacyCertifiedCount, recommendedCount: result.recommendedCount, loading: false });
    });

    // On diffère le fetch au-delà du premier rendu pour ne pas concurrencer
    // le chargement de l'image LCP et du code critique. On utilise
    // requestIdleCallback si dispo, sinon un setTimeout de secours.
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const runFetch = () => {
      // Stale-While-Revalidate :
      // - Pas de cache → on affiche d'abord un état de chargement puis on
      //   remplit avec `prefetchHomeData`.
      // - Cache présent (frais ou périmé) → il a déjà été injecté dans `state`
      //   au premier rendu ; on lance quand même une vérification silencieuse
      //   vers Supabase. Les abonnés ne sont notifiés que si les données ont
      //   réellement changé (voir `revalidateHomeData`).
      const hasCache = readHomeCache() !== null;

      if (!hasCache) {
        prefetchHomeData()
          .then((result) => {
            setState({ partners: result.partners, totalCount: result.totalCount, certifiedCount: result.certifiedCount, legacyCertifiedCount: result.legacyCertifiedCount, recommendedCount: result.recommendedCount, loading: false });
          })
          .catch(() => {
            setState((s) => ({ ...s, loading: false }));
          });
      } else {
        revalidateHomeData().catch(() => {
          // Revalidation silencieuse : on garde les données en cache en cas d'échec.
        });
      }
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

    // Refresh when returning to an existing tab, so desktop/mobile converge.
    // Visibility events are throttled to avoid duplicate Supabase requests.
    let lastRefresh = 0;
    const refreshOnReturn = () => {
      if (document.visibilityState !== 'visible') return;
      const now = Date.now();
      if (now - lastRefresh < 60_000) return;
      lastRefresh = now;
      revalidateHomeData().catch(() => {
        // Keep the last valid count; a failed network request must not invent zeroes.
      });
    };
    document.addEventListener('visibilitychange', refreshOnReturn);
    window.addEventListener('focus', refreshOnReturn);

    return () => {
      document.removeEventListener('visibilitychange', refreshOnReturn);
      window.removeEventListener('focus', refreshOnReturn);
      unsub();
      if (idleId !== undefined && typeof w.cancelIdleCallback === 'function') w.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  // Intentionnellement sans dépendances — on ne veut s'exécuter qu'au montage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
