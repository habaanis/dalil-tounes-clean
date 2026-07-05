import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppRouter from './AppRouter';
import { WelcomeModal } from './components/WelcomeModal';

const WELCOME_SEEN_KEY = 'dalilTounes_welcome_seen_v1';

const isWelcomeExcludedPath = (pathname: string) =>
  pathname.startsWith('/admin') ||
  pathname.startsWith('/debug') ||
  pathname === '/searchDebug';

const shouldShowWelcomeForPath = (pathname: string) => {
  if (isWelcomeExcludedPath(pathname)) {
    return false;
  }

  try {
    return localStorage.getItem(WELCOME_SEEN_KEY) !== 'true';
  } catch {
    // If private browsing blocks localStorage reads, keep the first-visit prompt visible.
    return true;
  }
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]';

  // Détection de l'environnement
  const isHashRouter = window.location.hash.startsWith('#/') || import.meta.env.DEV;
  const showWelcomeModal = !welcomeDismissed && shouldShowWelcomeForPath(location.pathname);
  const showWelcomeDevButton = import.meta.env.DEV && isLocalhost;

  const handleCloseWelcomeModal = () => {
    try {
      localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    } catch {
      // localStorage can be unavailable in private browsing contexts.
    }
    setWelcomeDismissed(true);
  };

  const handleReplayWelcomeModal = () => {
    try {
      localStorage.removeItem(WELCOME_SEEN_KEY);
    } catch {
      // localStorage can be unavailable in private browsing contexts.
    }
    setWelcomeDismissed(false);
  };

  // Intercepteur pour les changements de hash (uniquement en BrowserRouter/production)
  useEffect(() => {
    // Si on utilise HashRouter, pas besoin d'intercepteur
    if (isHashRouter && import.meta.env.DEV) return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#/')) {
        const hashPath = hash.replace('#/', '');
        const cleanPath = '/' + hashPath;
        console.log('🔄 Hash change detected, navigating to:', cleanPath);
        navigate(cleanPath, { replace: true });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [navigate, isHashRouter]);

  // Redirection initiale uniquement pour BrowserRouter (production)
  useEffect(() => {
    // En HashRouter (dev/Bolt), pas besoin de redirection - routes gérées automatiquement
    if (import.meta.env.DEV) {
      console.log('✅ HashRouter actif - pas de redirection nécessaire');
      return;
    }

    // Logique de redirection uniquement pour BrowserRouter (production)
    const hash = window.location.hash;

    if (hash && hash.startsWith('#/')) {
      const hashPath = hash.replace('#/', '');
      const cleanPath = hashPath.split('?')[0];

      const hashToPathMap: Record<string, string> = {
        'citizens/health': '/citizens/health',
        'citizens/sante': '/citizens/health',
        'citizens/admin': '/citizens/admin',
        'citizens/leisure': '/citizens/leisure',
        'citizens/loisirs': '/citizens/leisure',
        'citizens/shops': '/citizens/shops',
        'citizens/magasins': '/citizens/shops',
        'citizens/services': '/citizens/services',
        'citizens/tourism': '/citizens/tourism',
        'citizens/tourisme': '/citizens/tourism',
        'citizens/social': '/citizens/services',
        'citizens': '/citizens',
        'entreprises': '/businesses',
        'businesses': '/businesses',
        'jobs': '/jobs',
        'emploi': '/jobs',
        'emplois': '/jobs',
        'education': '/education',
        'evenements': '/culture-events',
        'culture-events': '/culture-events',
        'marketplace': '/marketplace',
        'marche-local': '/marketplace',
        'subscription': '/subscription',
        'abonnement': '/subscription',
        'concept': '/concept',
        'notre-concept': '/concept',
        'autour-de-moi': '/around-me',
        'around-me': '/around-me',
        'auth': '/auth',
        'connexion': '/auth',
        'inscription': '/auth',
        'dashboard/candidat': '/dashboard/candidat',
        'dashboard/entreprise': '/dashboard/entreprise',
      };

      if (cleanPath.startsWith('business/') || cleanPath.startsWith('entreprise/') || cleanPath.startsWith('entreprises/')) {
        const segments = cleanPath.split('/').slice(1);
        if (segments.length > 0) {
          const businessId = segments[0];
          const slug = segments[1] || '';
          if (slug) {
            navigate(`/business/${businessId}/${slug}`, { replace: true });
          } else {
            navigate(`/business/${businessId}`, { replace: true });
          }
        }
        return;
      }

      if (cleanPath.startsWith('p/')) {
        const slug = cleanPath.replace('p/', '');
        navigate(`/p/${slug}`, { replace: true });
        return;
      }

      if (cleanPath.startsWith('emplois/')) {
        const parts = cleanPath.split('/');
        if (parts[1] === 'publier') {
          navigate('/emplois/publier', { replace: true });
        } else if (parts[2] === 'candidats') {
          navigate(`/emplois/${parts[1]}/candidats`, { replace: true });
        } else if (parts[1] === 'mes-recommandations') {
          navigate('/emplois/mes-recommandations', { replace: true });
        }
        return;
      }

      const mappedPath = hashToPathMap[cleanPath];
      if (mappedPath) {
        console.log(`🔄 Redirection hash: ${hash} -> ${mappedPath}`);
        navigate(mappedPath, { replace: true });
        window.history.replaceState(null, '', mappedPath);
      }
    }
  }, [navigate]);

  return (
    <>
      <AppRouter />
      <WelcomeModal isOpen={showWelcomeModal} onClose={handleCloseWelcomeModal} />
      {showWelcomeDevButton && (
        <button
          type="button"
          onClick={handleReplayWelcomeModal}
          className="fixed bottom-4 right-4 z-[90] rounded-full border border-[#D4AF37]/50 bg-white/90 px-3 py-2 text-xs font-semibold text-[#4A1D43] shadow-lg backdrop-blur transition hover:border-[#D4AF37] hover:bg-[#FFF8E6] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
          aria-label="Revoir le WelcomeModal"
        >
          🧪 Revoir le Welcome
        </button>
      )}
    </>
  );
}

export default App;
