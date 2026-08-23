import { useEffect, useState } from 'react';

/**
 * Hook pour détecter le chemin actuel et gérer les URLs hreflang.
 *
 * Dalil Tounes utilise BrowserRouter : l'ancien code basé sur
 * window.location.hash produisait des variantes de langue en #/... qui ne
 * correspondent plus aux vraies URLs publiques.
 */
export const useHreflangPath = () => {
  const [currentPath, setCurrentPath] = useState<string>('/');

  useEffect(() => {
    const updatePath = () => {
      const pathname = window.location.pathname || '/';
      setCurrentPath(pathname.startsWith('/') ? pathname : `/${pathname}`);
    };

    updatePath();

    // React Router utilise l'historique du navigateur. Les événements natifs
    // couvrent les retours/avances ; le composant appelant se remonte aussi à
    // chaque changement de route normal dans l'application.
    window.addEventListener('popstate', updatePath);

    return () => {
      window.removeEventListener('popstate', updatePath);
    };
  }, []);

  return currentPath;
};

/**
 * Génère l'URL complète avec le paramètre de langue sans réintroduire de hash.
 */
export const generateLanguageUrl = (path: string, lang: string): string => {
  const baseUrl = window.location.origin;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(cleanPath, baseUrl);
  url.searchParams.set('lang', lang);
  return url.toString();
};

/**
 * Extrait le paramètre de langue de l'URL.
 */
export const getLanguageFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('lang');
};
