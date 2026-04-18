import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Tables } from '../lib/dbTables';
import { generateBusinessUrl } from '../lib/slugify';
import { getSupabaseImageUrl } from '../lib/imageUtils';

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
      <span className="ml-1 text-xs text-gray-600">{value.toFixed(1)}</span>
    </span>
  );
}

export default function MeilleursSection({
  secteurLabel,
  listePage,
  accentColor = '#4A1D43',
  sectionTitle,
  blogArticle,
}: MeilleursProps) {
  const navigate = useNavigate();
  const [items, setItems] = useState<MeilleursItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTop() {
      setLoading(true);
      try {
        const { data } = await supabase
          .from(Tables.ENTREPRISE)
          .select(`id, nom, ville, gouvernorat, logo_url, image_url, sous_categories, "Note Google Globale", "Compteur Avis Google"`)
          .contains('"liste pages"', [listePage])
          .not('"Note Google Globale"', 'is', null)
          .order('"Note Google Globale"', { ascending: false, nullsFirst: false })
          .limit(6);
        setItems(data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTop();
  }, [listePage]);

  const getRating = (item: MeilleursItem): number => {
    const raw = item['Note Google Globale'];
    if (!raw) return 0;
    const n = typeof raw === 'string' ? parseFloat(raw.replace(',', '.')) : raw;
    return isNaN(n) ? 0 : Math.min(5, Math.max(0, n));
  };

  const getSubCategory = (item: MeilleursItem): string => {
    const sc = item.sous_categories;
    if (!sc) return '';
    if (Array.isArray(sc)) return sc[0] || '';
    return String(sc);
  };

  return (
    <div className="space-y-8">
      {/* Meilleurs professionnels */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
          <h2
            className="text-xl font-semibold"
            style={{ fontFamily: "'Playfair Display', serif", color: accentColor }}
          >
            {sectionTitle || `Meilleurs ${secteurLabel}`}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D4AF37 transparent #D4AF37 #D4AF37' }} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500 italic">Aucun professionnel référencé pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item, idx) => {
              const rating = getRating(item);
              const subCat = getSubCategory(item);
              const url = generateBusinessUrl(item.nom, item.id);
              const imgSrc = item.logo_url
                ? getSupabaseImageUrl(item.logo_url)
                : item.image_url
                ? getSupabaseImageUrl(item.image_url)
                : null;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  onClick={() => navigate(url)}
                  className="group bg-white rounded-xl border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                >
                  <div className="h-24 bg-gradient-to-br from-gray-50 to-[#D4AF37]/10 flex items-center justify-center overflow-hidden">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.nom}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: accentColor }}
                      >
                        {item.nom.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3
                      className="font-semibold text-sm leading-tight mb-1 group-hover:text-[#D4AF37] transition-colors line-clamp-2"
                      style={{ color: accentColor, fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.nom}
                    </h3>
                    {subCat && (
                      <p className="text-xs text-gray-500 mb-1 truncate">{subCat}</p>
                    )}
                    {(item.ville || item.gouvernorat) && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        {item.ville || item.gouvernorat}
                      </p>
                    )}
                    {rating > 0 && <StarRating value={rating} />}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Article de blog */}
      {blogArticle && (
        <section className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/blog/${blogArticle.slug}`)}
            className="group cursor-pointer bg-gradient-to-r from-[#4A1D43]/5 to-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-2xl p-5 hover:border-[#D4AF37] hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#D4AF37] uppercase tracking-wide mb-1">Article</p>
                <h3
                  className="font-semibold text-base mb-1 group-hover:text-[#D4AF37] transition-colors"
                  style={{ color: accentColor, fontFamily: "'Playfair Display', serif" }}
                >
                  {blogArticle.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">{blogArticle.excerpt}</p>
              </div>
              <ArrowRight className="shrink-0 w-5 h-5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
