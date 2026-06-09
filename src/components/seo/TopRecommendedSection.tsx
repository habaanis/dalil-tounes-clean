import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Trophy, Building2 } from 'lucide-react';
import { fetchTopRecommendedByCity, type RecommendedBusiness } from '../../lib/seoBusinessQueries';
import { buildEntrepriseUrl } from '../../lib/slugify';
import { getSupabaseImageUrl } from '../../lib/imageUtils';
import { extractFrenchName } from '../../lib/textNormalization';

interface TopRecommendedSectionProps {
  ville: string;
  villeSlug: string;
}

const ACCENT = '#D4AF37';

function parseRating(raw: unknown): number {
  if (!raw) return 0;
  const n = typeof raw === 'string' ? parseFloat(raw.replace(',', '.')) : Number(raw);
  return isNaN(n) ? 0 : Math.min(5, Math.max(0, n));
}

function StarRating({ value }: { value: number }) {
  const stars = Math.round(value * 2) / 2;
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= stars ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-600 font-medium">{value.toFixed(1)}</span>
    </span>
  );
}

function RecommendedCard({
  biz,
  rank,
  onClick,
}: {
  biz: RecommendedBusiness;
  rank: number;
  onClick: () => void;
}) {
  const name = extractFrenchName(biz.nom);
  const rating = parseRating(biz['Note Google Globale']);
  const cats = biz['catégorie'] || [];
  const subCat = Array.isArray(cats) ? cats[0] || '' : String(cats);

  const imgSrc = biz.logo_url
    ? getSupabaseImageUrl(biz.logo_url)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.06 }}
      onClick={onClick}
      className="group bg-white rounded-2xl border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative"
    >
      {rank <= 3 && (
        <div
          className="absolute top-3 left-3 z-10 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
          style={{ backgroundColor: rank === 1 ? '#D4AF37' : rank === 2 ? '#9CA3AF' : '#CD7F32' }}
        >
          {rank}
        </div>
      )}

      <div className="h-28 bg-gradient-to-br from-gray-50 to-[#D4AF37]/8 flex items-center justify-center overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={`${name}${biz.ville ? ` - ${biz.ville}` : ''} - Dalil Tounes`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
            loading="lazy"
            decoding="async"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
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
        {rating > 0 ? (
          <StarRating value={rating} />
        ) : (
          <span className="text-xs text-gray-300 italic">Note non disponible</span>
        )}
      </div>
    </motion.div>
  );
}

export default function TopRecommendedSection({ ville, villeSlug }: TopRecommendedSectionProps) {
  const [items, setItems] = useState<RecommendedBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchTopRecommendedByCity(ville, 6).then((result) => {
      if (!cancelled) {
        setItems(result);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [ville]);

  if (!loading && items.length < 3) return null;

  return (
    <section className="mb-10" aria-labelledby={`top-recommended-${villeSlug}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h2
            id={`top-recommended-${villeSlug}`}
            className="text-lg md:text-xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Entreprises les plus recommandees par les clients a{' '}
            <span className="text-[#D4AF37]">{ville}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Les mieux notees par la communaute
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-14">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${ACCENT} transparent ${ACCENT} ${ACCENT}` }} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50/5 rounded-2xl border border-dashed border-gray-700">
          <Building2 className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 italic">Aucun professionnel reference pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {items.map((biz, idx) => {
            const url = buildEntrepriseUrl({ slug: biz.slug ?? null, nom: biz.nom, ville: biz.ville, id: biz.id });
            return (
              <RecommendedCard
                key={biz.id}
                biz={biz}
                rank={idx + 1}
                onClick={() => navigate(url)}
              />
            );
          })}
        </div>
      )}

      <p className="text-center text-[11px] text-gray-600 mt-4 leading-relaxed">
        Les classements reposent sur des criteres automatises (avis publics, notes Google, volume d'avis).{' '}
        <Link to="/info-avis" className="text-[#D4AF37] hover:underline">En savoir plus</Link>
      </p>
    </section>
  );
}
