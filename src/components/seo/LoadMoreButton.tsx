import React from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getSeoPageTranslations } from '../../lib/seoPageTranslations';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading: boolean;
  shown: number;
  total: number;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onClick, loading, shown, total }) => {
  const { language } = useLanguage();
  const t = getSeoPageTranslations(language);

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <button
        onClick={onClick}
        disabled={loading}
        className="group flex items-center gap-2 px-8 py-3 rounded-xl border border-[#D4AF37]/50 text-[#D4AF37] text-sm font-medium hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t.loadingMore}
          </>
        ) : (
          <>
            {t.seeMore}
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </>
        )}
      </button>
      <span className="text-xs text-gray-600">
        {t.shownOfTotal(shown, total)}
      </span>
    </div>
  );
};

export default LoadMoreButton;
