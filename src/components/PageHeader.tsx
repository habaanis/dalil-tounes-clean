import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PageHeaderProps {
  backTo?: string;
  backLabel?: string;
  hideBack?: boolean;
}

const pageHeaderCopy = {
  fr: { back: 'Retour', previousPage: 'page précédente', home: 'Accueil', logoAlt: 'Guide digital des services en Tunisie' },
  ar: { back: 'رجوع', previousPage: 'الصفحة السابقة', home: 'الرئيسية', logoAlt: 'الدليل الرقمي للخدمات في تونس' },
  en: { back: 'Back', previousPage: 'previous page', home: 'Home', logoAlt: 'Digital guide to services in Tunisia' },
  it: { back: 'Indietro', previousPage: 'pagina precedente', home: 'Home', logoAlt: 'Guida digitale ai servizi in Tunisia' },
  ru: { back: 'Назад', previousPage: 'предыдущая страница', home: 'Главная', logoAlt: 'Цифровой справочник услуг в Тунисе' },
} as const;

export const PageHeader = ({ backTo, backLabel, hideBack = false }: PageHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const copy = pageHeaderCopy[language] ?? pageHeaderCopy.fr;
  const resolvedBackLabel = backLabel ?? copy.back;

  const isHome = location.pathname === '/';
  if (isHome) return null;

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      const parentPath = location.pathname.split('/').slice(0, -1).join('/') || '/';
      navigate(parentPath);
    }
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 sm:h-10 flex items-center justify-between">

        {!hideBack ? (
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-800 transition-colors duration-200"
            aria-label={`${resolvedBackLabel} — ${copy.previousPage}`}
          >
            <ArrowLeft
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1"
              strokeWidth={2}
            />
            <span className="text-xs font-light tracking-widest uppercase">{resolvedBackLabel}</span>
          </button>
        ) : (
          <div className="w-16" />
        )}

        {/* Logo centré — lien vers accueil */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-200"
          aria-label={`Dalil Tounes — ${copy.home}`}
        >
          <picture>
            <source srcSet="/images/logo_dalil_tounes_sceau_luxe.webp" type="image/webp" width="140" height="140" />
            <img
              src="/images/logo_dalil_tounes_sceau_luxe.png"
              alt={`Logo Dalil Tounes - ${copy.logoAlt}`}
              className="w-5 h-5 rounded-full object-cover"
              width="140"
              height="140"
              loading="lazy"
              decoding="async"
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
