import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useRef } from 'react';

interface PageHeaderProps {
  backTo?: string;
  backLabel?: string;
  hideBack?: boolean;
}

export const PageHeader = ({ backTo, backLabel = 'Retour', hideBack = false }: PageHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Track whether we navigated within the app to avoid empty-history back()
  const canGoBack = useRef(window.history.state?.idx > 0);

  const isHome = location.pathname === '/';
  if (isHome) return null;

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else if (canGoBack.current) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 sm:h-10 flex items-center justify-between">

        {!hideBack ? (
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-800 transition-colors duration-200"
            aria-label={`${backLabel} — page précédente`}
          >
            <ArrowLeft
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1"
              strokeWidth={2}
            />
            <span className="text-xs font-light tracking-widest uppercase">{backLabel}</span>
          </button>
        ) : (
          <div className="w-16" />
        )}

        {/* Logo centré — lien vers accueil */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-200"
          aria-label="Dalil Tounes — Accueil"
        >
          <picture>
            <source srcSet="/images/logo_dalil_tounes_sceau_luxe.webp" type="image/webp" width="140" height="140" />
            <img
              src="/images/logo_dalil_tounes_sceau_luxe.png"
              alt="Logo Dalil Tounes - Guide digital des services en Tunisie"
              className="w-5 h-5 rounded-full object-cover"
              width="140"
              height="140"
              loading="lazy"
            />
          </picture>
          <span className="text-xs font-light tracking-widest uppercase text-gray-600 hidden sm:inline">
            Dalil Tounes
          </span>
        </Link>

        <div className="w-16" />
      </div>
    </div>
  );
};
