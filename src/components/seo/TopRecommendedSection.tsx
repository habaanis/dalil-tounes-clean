import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Trophy, Building2 } from 'lucide-react';
import { fetchTopRecommended, type RecommendedBusiness, type RecommendedScope } from '../../lib/seoBusinessQueries';
import { buildEntrepriseUrl } from '../../lib/slugify';
import { getSupabaseImageUrl } from '../../lib/imageUtils';
import { extractFrenchName } from '../../lib/textNormalization';
import { useLanguage } from '../../context/LanguageContext';
import { getPublicComponentTranslations } from '../../lib/publicComponentTranslations';
import { getRecommendedTranslations } from '../../lib/recommendedTranslations';
import { useRTL } from '../../lib/useRTL';

interface TopRecommendedSectionProps extends RecommendedScope {
  contextLabel: string;
  sectionId: string;
}

function parseRating(raw: unknown): number {
  if (!raw) return 0;
  const n = typeof raw === 'string' ? parseFloat(raw.replace(',', '.')) : Number(raw);
  return isNaN(n) ? 0 : Math.min(5, Math.max(0, n));
}

function StarRating({ value }: { value: number }) {
  const { isRTL } = useRTL();
  const stars = Math.round(value * 2) / 2;
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= stars ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'}`}
        />
      ))}
      <span className={`${isRTL ? 'mr-1' : 'ml-1'} text-xs text-gray-600 font-medium`}>{value.toFixed(1)}</span>
    </span>
  );
}

function RecommendedCard({
  biz,
  rank,
  url,
  reviewsLabel,
}: {
  biz: RecommendedBusiness;
  rank: number;
  url: string;
  reviewsLabel: string;
}) {
  const { isRTL } = useRTL();
  const [imageFailed, setImageFailed] = useState(false);
  const name = extractFrenchName(biz.nom);
  const rating = parseRating(biz['Note Google Globale']);
  const cats = biz['catégorie'] || [];
  const subCat = (Array.isArray(cats) ? cats[0] || '' : String(cats)).replace(/^\{\}$/, '');

  const imgSrc = biz.logo_url
    ? getSupabaseImageUrl(biz.logo_url)
    : null;

  return (
    <Link
      to={url}
      className="group bg-white rounded-2xl border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] overflow-hidden relative"
    >
      {rank <= 3 && (
        <div
          className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} z-10 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md`}
          style={{ backgroundColor: rank === 1 ? '#D4AF37' : rank === 2 ? '#9CA3AF' : '#CD7F32' }}
        >
          {rank}
        </div>
      )}

      <div className="h-28 bg-gradient-to-br from-gray-50 to-[#D4AF37]/8 flex items-center justify-center overflow-hidden">
        {imgSrc && !imageFailed ? (
          <img
            src={imgSrc}
            alt={`${name}${biz.ville ? ` - ${biz.ville}` : ''} - Dalil Tounes`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm bg-[#4A1D43]">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-sm leading-snug mb-1 group-hover:text-[#D4AF37] transition-colors line-clamp-2 text-[#4A1D43]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {name}
        </h3>
        {subCat && (
          <p className="text-xs text-gray-500 mb-1.5 truncate">{subCat}</p>
        )}
        {(biz.ville || biz.gouvernorat) && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
            <span className="truncate">{biz.ville || biz.gouvernorat}</span>
          </p>
        )}
        <StarRating value={rating} />
        <p className="text-xs text-gray-500 mt-1">{biz['Compteur Avis Google']} {reviewsLabel}</p>
      </div>
    </Link>
  );
}

export default function TopRecommendedSection({ contextLabel, sectionId, city, metier, sousCategorie, secteurSlug, gouvernoratSlug }: TopRecommendedSectionProps) {
  const [items, setItems] = useState<RecommendedBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const { language } = useLanguage();
  const publicT = getPublicComponentTranslations(language);
  const t = getRecommendedTranslations(language);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    setLoading(true);
    setFailed(false);
    setItems([]);
    fetchTopRecommended({ city, metier, sousCategorie, secteurSlug, gouvernoratSlug }, 10, controller.signal)
      .then(result => { if (!cancelled) setItems(result); })
      .catch(() => { if (!cancelled) setFailed(true); })
      .finally(() => { window.clearTimeout(timeout); if (!cancelled) setLoading(false); });
    return () => { cancelled = true; window.clearTimeout(timeout); controller.abort(); };
  }, [city, metier, sousCategorie, secteurSlug, gouvernoratSlug, attempt]);

  return (
    <section className="mb-10" aria-labelledby={`top-recommended-${sectionId}`} aria-busy={loading}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h2 id={`top-recommended-${sectionId}`} className="text-lg md:text-xl font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t.title} <span className="text-[#D4AF37]">— {contextLabel}</span>
          </h2>
          <p className="text-xs text-gray-400 mt-2">{t.criteria}</p>
        </div>
      </div>

      {loading ? (
        <div role="status" aria-label={t.loading} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }, (_, i) => <div key={i} className="h-60 bg-gray-800 rounded-2xl animate-pulse motion-reduce:animate-none" />)}
        </div>
      ) : failed ? (
        <div role="status" className="text-center p-8 rounded-2xl border border-gray-700 text-gray-400">
          <p>{t.error}</p>
          <button onClick={() => setAttempt(value => value + 1)} className="mt-3 text-[#D4AF37] underline">{t.retry}</button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center p-8 bg-gray-50/5 rounded-2xl border border-dashed border-gray-700">
          <Building2 className="w-8 h-8 text-gray-500 mx-auto mb-3" />
          <p className="text-sm text-gray-400">{t.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((biz, idx) => (
            <RecommendedCard key={biz.id} biz={biz} rank={idx + 1}
              url={buildEntrepriseUrl({ slug: biz.slug ?? null, nom: biz.nom, ville: biz.ville, id: biz.id })}
              reviewsLabel={t.reviews} />
          ))}
        </div>
      )}
      <p className="text-center text-[11px] text-gray-400 mt-4 leading-relaxed">
        {t.disclaimer}{' '}
        <Link to="/info-avis" className="text-[#D4AF37] hover:underline">{publicT.learnMore}</Link>
      </p>
    </section>
  );
}
