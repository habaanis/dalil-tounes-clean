import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight, BookOpen, Search, Trophy, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Tables } from '../lib/dbTables';
import { generateBusinessUrl } from '../lib/slugify';
import { getSupabaseImageUrl } from '../lib/imageUtils';
import { extractFrenchName } from '../lib/textNormalization';

interface MeilleursItem {
  id: string;
  nom: string;
  ville?: string;
  gouvernorat?: string;
  logo_url?: string;
  image_url?: string;
  sous_categories?: string | string[];
  'Note Google Globale'?: number | string | null;
  'Compteur Avis Google'?: number | string | null;
}

interface BlogArticleLink {
  title: string;
  excerpt: string;
  slug: string;
}

interface MeilleursProps {
  secteurLabel: string;
  listePage: string;
  accentColor?: string;
  sectionTitle?: string;
  blogArticle?: BlogArticleLink;
  searchQuery?: string;
}

const PAGE_SIZE = 10;
const TOP_COUNT = 5;

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

function BusinessCard({
  item,
  accentColor,
  rank,
  onClick,
}: {
  item: MeilleursItem;
  accentColor: string;
  rank?: number;
  onClick: () => void;
}) {
  const getRating = (): number => {
    const raw = item['Note Google Globale'];
    if (!raw) return 0;
    const n = typeof raw === 'string' ? parseFloat(raw.replace(',', '.')) : raw;
    return isNaN(n) ? 0 : Math.min(5, Math.max(0, n));
  };

  const getSubCategory = (): string => {
    const sc = item.sous_categories;
    if (!sc) return '';
    if (Array.isArray(sc)) return sc[0] || '';
    return String(sc);
  };

  const rating = getRating();
  const subCat = getSubCategory();
  const imgSrc = item.logo_url
    ? getSupabaseImageUrl(item.logo_url)
    : item.image_url
    ? getSupabaseImageUrl(item.image_url)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="group bg-white rounded-2xl border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative"
    >
      {rank && rank <= 3 && (
        <div className="absolute top-3 left-3 z-10 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
          style={{ backgroundColor: rank === 1 ? '#D4AF37' : rank === 2 ? '#9CA3AF' : '#CD7F32' }}>
          {rank}
        </div>
      )}
      <div className="h-28 bg-gradient-to-br from-gray-50 to-[#D4AF37]/8 flex items-center justify-center overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={`${item.nom}${item.ville ? ` à ${item.ville}` : ''} - Meilleur établissement Tunisie - Dalil Tounes`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
            loading="lazy"
            decoding="async"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            {item.nom.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3
          className="font-semibold text-sm leading-snug mb-1 group-hover:text-[#D4AF37] transition-colors line-clamp-2"
          style={{ color: accentColor, fontFamily: "'Playfair Display', serif" }}
        >
          {item.nom}
        </h3>
        {subCat && (
          <p className="text-xs text-gray-500 mb-1.5 truncate">{subCat}</p>
        )}
        {(item.ville || item.gouvernorat) && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
            <span className="truncate">{item.ville || item.gouvernorat}</span>
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

function ListRow({ item, accentColor, onClick }: { item: MeilleursItem; accentColor: string; onClick: () => void }) {
  const getRating = (): number => {
    const raw = item['Note Google Globale'];
    if (!raw) return 0;
    const n = typeof raw === 'string' ? parseFloat(raw.replace(',', '.')) : raw;
    return isNaN(n) ? 0 : Math.min(5, Math.max(0, n));
  };

  const getSubCategory = (): string => {
    const sc = item.sous_categories;
    if (!sc) return '';
    if (Array.isArray(sc)) return sc[0] || '';
    return String(sc);
  };

  const rating = getRating();
  const subCat = getSubCategory();
  const imgSrc = item.logo_url
    ? getSupabaseImageUrl(item.logo_url)
    : item.image_url
    ? getSupabaseImageUrl(item.image_url)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className="group flex items-center gap-4 bg-white rounded-xl border border-gray-100 hover:border-[#D4AF37]/60 hover:shadow-md transition-all duration-200 cursor-pointer p-3"
    >
      <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-[#D4AF37]/10 flex items-center justify-center">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={item.nom}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: accentColor }}
          >
            {item.nom.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4
          className="font-medium text-sm group-hover:text-[#D4AF37] transition-colors truncate"
          style={{ color: accentColor, fontFamily: "'Playfair Display', serif" }}
        >
          {item.nom}
        </h4>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {subCat && <span className="text-xs text-gray-400 truncate max-w-[120px]">{subCat}</span>}
          {(item.ville || item.gouvernorat) && (
            <span className="text-xs text-gray-400 flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5 text-[#D4AF37]" />
              {item.ville || item.gouvernorat}
            </span>
          )}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {rating > 0 && (
          <span className="flex items-center gap-0.5 text-xs text-[#D4AF37] font-semibold">
            <Star className="w-3 h-3 fill-[#D4AF37]" />
            {rating.toFixed(1)}
          </span>
        )}
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
      </div>
    </motion.div>
  );
}

export default function MeilleursSection({
  secteurLabel,
  listePage,
  accentColor = '#4A1D43',
  sectionTitle,
  blogArticle,
  searchQuery,
}: MeilleursProps) {
  const navigate = useNavigate();
  const [topItems, setTopItems] = useState<MeilleursItem[]>([]);
  const [allItems, setAllItems] = useState<MeilleursItem[]>([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoadingTop(true);
      setLoadingAll(true);
      try {
        const { data } = await supabase
          .from(Tables.ENTREPRISE)
          .select(`id, nom, ville, gouvernorat, logo_url, image_url, sous_categories, "Note Google Globale", "Compteur Avis Google"`)
          .contains('"liste pages"', [listePage])
          .order('"Note Google Globale"', { ascending: false, nullsFirst: false });

        const all: MeilleursItem[] = (data || []).map((item: any) => ({
          ...item,
          nom: extractFrenchName(item.nom),
        }));

        const withRating = all.filter((item) => {
          const raw = item['Note Google Globale'];
          if (!raw) return false;
          const n = typeof raw === 'string' ? parseFloat(raw.replace(',', '.')) : raw;
          return !isNaN(n) && n > 0;
        });

        const top = withRating.slice(0, TOP_COUNT);
        const topIds = new Set(top.map((t) => t.id));
        const rest = all.filter((item) => !topIds.has(item.id));

        setTopItems(top);
        setAllItems(rest);
      } catch {
        setTopItems([]);
        setAllItems([]);
      } finally {
        setLoadingTop(false);
        setLoadingAll(false);
      }
    }

    fetchData();
    setPage(0);
  }, [listePage]);

  const totalPages = Math.ceil(allItems.length / PAGE_SIZE);
  const pagedItems = allItems.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const searchTarget = searchQuery || secteurLabel;

  return (
    <div className="space-y-12">
      {/* === Section 1 : Meilleurs === */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h2
              className="text-2xl font-bold leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", color: accentColor }}
            >
              {sectionTitle || `Les meilleurs ${secteurLabel}`}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Les mieux notés par la communauté</p>
          </div>
        </div>

        {loadingTop ? (
          <div className="flex items-center justify-center py-14">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${accentColor} transparent ${accentColor} ${accentColor}` }} />
          </div>
        ) : topItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400 italic">Aucun professionnel référencé pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {topItems.map((item, idx) => (
              <BusinessCard
                key={item.id}
                item={item}
                accentColor={accentColor}
                rank={idx + 1}
                onClick={() => navigate(generateBusinessUrl(item.nom, item.id))}
              />
            ))}
          </div>
        )}
      </section>

      {/* === Article de blog === */}
      {blogArticle && (
        <section className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/blog/${blogArticle.slug}`)}
            className="group cursor-pointer bg-gradient-to-r from-[#4A1D43]/5 via-white to-[#D4AF37]/8 border border-[#D4AF37]/40 rounded-2xl p-5 hover:border-[#D4AF37] hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mb-1">Guide</p>
                <h3
                  className="font-semibold text-base mb-1.5 group-hover:text-[#D4AF37] transition-colors"
                  style={{ color: accentColor, fontFamily: "'Playfair Display', serif" }}
                >
                  {blogArticle.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{blogArticle.excerpt}</p>
              </div>
              <ArrowRight className="shrink-0 w-5 h-5 text-[#D4AF37] mt-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </section>
      )}

      {/* === Section 2 : Tous les établissements === */}
      {(loadingAll || allItems.length > 0) && (
        <section className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h2
                  className="text-xl font-bold leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif", color: accentColor }}
                >
                  Tous les {secteurLabel} référencés
                </h2>
                {!loadingAll && (
                  <p className="text-xs text-gray-400 mt-0.5">{allItems.length} établissement{allItems.length > 1 ? 's' : ''}</p>
                )}
              </div>
            </div>
          </div>

          {loadingAll ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${accentColor} transparent ${accentColor} ${accentColor}` }} />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {pagedItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <ListRow
                      item={item}
                      accentColor={accentColor}
                      onClick={() => navigate(generateBusinessUrl(item.nom, item.id))}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    style={{ color: page === 0 ? undefined : accentColor }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </button>
                  <span className="text-sm text-gray-400 px-2">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    style={{ color: page >= totalPages - 1 ? undefined : accentColor }}
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* === CTA Recherche === */}
      <section className="max-w-5xl mx-auto px-4 pb-4">
        <div className="text-center">
          <button
            onClick={() => navigate(`/recherche?q=${encodeURIComponent(searchTarget)}`)}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            style={{ backgroundColor: accentColor, color: '#fff' }}
          >
            <Search className="w-4 h-4" />
            Rechercher d'autres {secteurLabel}
          </button>
          <p className="text-xs text-gray-400 mt-2">Affiner par ville, spécialité, disponibilité...</p>
        </div>
      </section>
    </div>
  );
}
