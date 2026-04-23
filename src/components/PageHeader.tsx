import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  /** Surcharge le comportement retour (par défaut : history.back) */
  backTo?: string;
  /** Surcharge le label retour (par défaut : "Retour") */
  backLabel?: string;
  /** Masque le bouton retour (ex: page d'accueil) */
  hideBack?: boolean;
}

/**
 * Barre de navigation secondaire standardisée, placée sous le nav principal.
 * Flèche ← Retour à gauche, logo centré (lien vers /).
 * Style Bottega : minimaliste, typographie espacée, discret.
 */
export const PageHeader = ({ backTo, backLabel = 'Retour', hideBack = false }: PageHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  if (isHome) return null;

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="w-full border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
        {/* Bouton retour — gauche */}
        {!hideBack ? (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors duration-200 group"
            aria-label={backLabel}
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={1.5} />
            <span className="text-xs font-light tracking-widest uppercase">{backLabel}</span>
          </button>
        ) : (
          <div />
        )}

        {/* Logo centré → accueil */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-200"
          aria-label="Dalil Tounes — Accueil"
        >
          <img
            src="/images/logo_dalil_tounes_sceau_luxe.png"
            alt="Dalil Tounes"
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-xs font-light tracking-widest uppercase text-gray-600 hidden sm:inline">
            Dalil Tounes
          </span>
        </Link>

        {/* Espace droit — symétrie */}
        <div className="w-16" />
      </div>
    </div>
  );
};
