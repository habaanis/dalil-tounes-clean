import { ArrowDown, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessCard } from '../components/BusinessCard';
import CvCapabilitiesSection from '../components/CvCapabilitiesSection';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { extractFrenchName } from '../lib/textNormalization';

type Row = Record<string, any>;
const CERTIFIED_LABEL = '⭐ CERTIFIÉ DALIL TOUNES';
const PAGE_SIZE = 8;

export default function CertifiedBusinesses() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = language === 'ar' ? 'ar' : 'fr';
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

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

  useEffect(() => {
    setPage(1);
  }, [query]);

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

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const title = lang === 'ar' ? 'المؤسسات الموثّقة على دليل تونس' : 'Entreprises certifiées Dalil Tounes';
  const subtitle = lang === 'ar'
    ? 'اكتشفوا المهنيين والمؤسسات الموثّقة والموجودة بالفعل على المنصة.'
    : 'Découvrez les professionnels et entreprises certifiés déjà présents sur la plateforme.';
  const placeholder = lang === 'ar' ? 'ابحث عن مؤسسة أو مدينة أو نشاط…' : 'Rechercher une entreprise, une ville ou une activité…';

  const scrollToBenefits = () => {
    document.getElementById('cv-benefits')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#FBF8F0]">
      <section className="relative overflow-hidden border-b border-[#D4AF37]/30 px-4 py-7 md:py-9">
        <img src="/images/entreprise_banner.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#032D21]/92 via-[#032D21]/76 to-[#032D21]/42" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#F1D783]">
            {loading ? '—' : `${rows.length} ${lang === 'ar' ? 'مؤسسة موثّقة' : 'entreprises certifiées'}`}
          </p>
          <h1 className="mt-1.5 max-w-3xl font-serif text-3xl font-bold leading-tight text-white md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90 md:text-base">{subtitle}</p>

          <div className="mt-4 flex max-w-3xl items-center gap-3 rounded-xl border border-white/30 bg-white/95 px-3 py-2 shadow-lg">
            <Search className="h-4 w-4 shrink-0 text-[#4A1D43]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="min-h-9 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-7 md:py-9">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => <div key={i} className="h-[250px] animate-pulse rounded-2xl bg-white shadow-sm" />)}
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-[#4A1D43]">
                  {lang === 'ar' ? `${filtered.length} مؤسسة` : `${filtered.length} entreprises`}
                </p>
                <button type="button" onClick={() => navigate('/businesses')} className="inline-flex items-center gap-2 text-sm font-black text-[#B58A18]">
                  {lang === 'ar' ? 'كل المؤسسات' : 'Toutes les entreprises'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mx-auto mb-6 max-w-3xl rounded-3xl border border-[#D4AF37]/45 bg-white px-5 py-5 text-center shadow-[0_12px_30px_rgba(74,29,67,0.07)] md:px-7 md:py-6">
                <h2 className="font-serif text-xl font-bold text-[#2E102A] md:text-2xl">
                  {lang === 'ar' ? 'هل تريد نفس البطاقة المهنية ونفس المزايا؟' : 'Vous voulez la même carte professionnelle et les mêmes avantages ?'}
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                  {lang === 'ar'
                    ? 'اكتشف ما يتضمنه CV Business من دليل تونس وكيف يمكن أن يساعدك على تقديم نشاطك ومشاركته بسهولة.'
                    : 'Découvrez ce que comprend le CV Business Dalil Tounes et comment il peut vous aider à présenter et partager votre activité.'}
                </p>
                <button
                  type="button"
                  onClick={scrollToBenefits}
                  className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#A51A30] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#851528]"
                >
                  {lang === 'ar' ? 'عرض مزايا CV Business' : 'Voir les avantages du CV Business'}
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {visibleRows.map((biz) => (
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

              {filtered.length > PAGE_SIZE && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/50 bg-white text-[#4A1D43] disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label={lang === 'ar' ? 'الصفحة السابقة' : 'Page précédente'}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: pageCount }).map((_, index) => {
                    const n = index + 1;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPage(n)}
                        className={`h-10 min-w-10 rounded-xl px-3 text-sm font-black transition ${currentPage === n ? 'bg-[#4A1D43] text-white' : 'border border-[#D4AF37]/40 bg-white text-[#4A1D43]'}`}
                      >
                        {n}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    disabled={currentPage === pageCount}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/50 bg-white text-[#4A1D43] disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label={lang === 'ar' ? 'الصفحة التالية' : 'Page suivante'}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

            </>
          )}
        </div>
      </section>

      <div id="cv-benefits" className="scroll-mt-24">
        <CvCapabilitiesSection language={lang} />
      </div>
    </div>
  );
}
