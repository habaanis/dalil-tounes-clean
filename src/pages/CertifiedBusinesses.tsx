import { ArrowRight, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessCard } from '../components/BusinessCard';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { extractFrenchName } from '../lib/textNormalization';

type Row = Record<string, any>;
const CERTIFIED_LABEL = '⭐ CERTIFIÉ DALIL TOUNES';

export default function CertifiedBusinesses() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = language === 'ar' ? 'ar' : 'fr';
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    supabase
      .from('entreprise')
      .select('*')
      .eq('statut_carte', CERTIFIED_LABEL)
      .order('nom', { ascending: true })
      .limit(100)
      .then(({ data, error }) => {
        if (!active) return;
        if (!error) setRows(data || []);
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.nom, r.ville, r.gouvernorat, r.sous_categories_texte, r.sous_categories_clean]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [rows, query]);

  const title = lang === 'ar' ? 'المؤسسات الموثّقة على دليل تونس' : 'Entreprises certifiées Dalil Tounes';
  const subtitle = lang === 'ar'
    ? 'اكتشفوا المهنيين والمؤسسات الموثّقة والموجودة بالفعل على المنصة.'
    : 'Découvrez les professionnels et entreprises certifiés déjà présents sur la plateforme.';
  const placeholder = lang === 'ar' ? 'ابحث عن مؤسسة أو مدينة أو نشاط…' : 'Rechercher une entreprise, une ville ou une activité…';

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#FBF8F0]">
      <section className="relative overflow-hidden border-b border-[#D4AF37]/30 px-4 py-12 md:py-16">
        <img src="/images/entreprise_banner.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#032D21]/90 via-[#032D21]/72 to-[#032D21]/38" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F1D783]">
            {loading ? '—' : `${rows.length} ${lang === 'ar' ? 'مؤسسة موثّقة' : 'entreprises certifiées'}`}
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold text-white md:text-6xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 md:text-lg">{subtitle}</p>

          <div className="mt-7 flex max-w-3xl items-center gap-3 rounded-2xl border border-white/30 bg-white/95 p-3 shadow-xl">
            <Search className="h-5 w-5 shrink-0 text-[#4A1D43]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="min-h-11 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:py-10">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-[250px] animate-pulse rounded-2xl bg-white shadow-sm" />)}
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-[#4A1D43]">
                  {lang === 'ar' ? `${filtered.length} مؤسسة` : `${filtered.length} entreprises`}
                </p>
                <button type="button" onClick={() => navigate('/businesses')} className="inline-flex items-center gap-2 text-sm font-black text-[#B58A18]">
                  {lang === 'ar' ? 'كل المؤسسات' : 'Toutes les entreprises'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((biz) => (
                  <BusinessCard
                    key={biz.id}
                    business={{
                      id: biz.id,
                      name: extractFrenchName(biz.nom || ''),
                      category: biz.sous_categories_texte || biz.sous_categories_clean || '',
                      ville: biz.ville || null,
                      gouvernorat: biz.gouvernorat || null,
                      statut_abonnement: biz['statut Abonnement'] || biz.statut_abonnement || null,
                      niveau_priorite_abonnement: biz['niveau priorité abonnement'] || biz.niveau_priorite || null,
                      imageUrl: biz.image_url || null,
                      logoUrl: biz.logo_url || null,
                      horaires_ok: biz.horaires_ok || null,
                      telephone: biz.telephone || biz.telephone1 || null,
                      statut_carte: biz.statut_carte || null,
                      name_ar: biz.name_ar || null,
                      description_ar: biz.description_ar || null,
                    }}
                    onClick={() => navigate(`/business/${biz.id}`)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
