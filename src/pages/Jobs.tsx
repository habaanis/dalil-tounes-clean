import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Building2, ShieldCheck, Sparkles, UserRound, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import JobPostForm from '../components/forms/JobPostForm';
import VerifiedJobCard from '../components/VerifiedJobCard';
import { HERO_IMAGE_JPG_URL, HERO_IMAGE_URL } from '../constants/images';
import { useLanguage } from '../context/LanguageContext';
import { generateCollectionPageSchema } from '../lib/structuredDataSchemas';
import { getJobsPageTranslations, type JobRequestMode } from '../lib/jobsPageTranslations';
import { type VerifiedJobOffer } from '../lib/verifiedJobs';
import { supabase } from '../lib/supabaseClient';

const JOB_LOCALES = {
  fr: 'fr-FR',
  ar: 'ar-TN',
  en: 'en-GB',
  it: 'it-IT',
  ru: 'ru-RU',
} as const;

const SEARCH_COPY = {
  fr: ['Métier ou mot-clé', 'Toutes les villes', 'Aucun résultat pour ces critères', 'Réinitialiser'],
  ar: ['المهنة أو كلمة البحث', 'جميع المدن', 'لا توجد نتائج مطابقة', 'إعادة ضبط'],
  en: ['Job or keyword', 'All cities', 'No matching results', 'Reset'],
  it: ['Professione o parola chiave', 'Tutte le città', 'Nessun risultato', 'Azzera'],
  ru: ['Профессия или ключевое слово', 'Все города', 'Нет результатов', 'Сбросить'],
} as const;
const PAGE_SIZE = 10;
const PAGE_COPY = {
  fr: ['Précédent', 'Suivant', 'Page', 'sur', 'Pages des offres'],
  ar: ['السابق', 'التالي', 'الصفحة', 'من', 'صفحات العروض'],
  en: ['Previous', 'Next', 'Page', 'of', 'Job offer pages'],
  it: ['Precedente', 'Successiva', 'Pagina', 'di', 'Pagine delle offerte'],
  ru: ['Назад', 'Далее', 'Страница', 'из', 'Страницы вакансий'],
} as const;
const LOAD_COPY = {
  fr: ['Chargement des offres…', 'Les offres sont temporairement indisponibles.', 'Réessayer'],
  ar: ['جار تحميل العروض…', 'العروض غير متاحة مؤقتاً.', 'إعادة المحاولة'],
  en: ['Loading jobs…', 'Job offers are temporarily unavailable.', 'Retry'],
  it: ['Caricamento delle offerte…', 'Offerte temporaneamente non disponibili.', 'Riprova'],
  ru: ['Загрузка вакансий…', 'Вакансии временно недоступны.', 'Повторить'],
} as const;
type LiveOffer = VerifiedJobOffer & { governorate: string | null };
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export const Jobs = () => {
  const { language } = useLanguage();
  const copy = getJobsPageTranslations(language);
  const [requestMode, setRequestMode] = useState<JobRequestMode | null>(null);
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [page, setPage] = useState(1);
  const resultsTop = useRef<HTMLParagraphElement>(null);
  const pageCopy = PAGE_COPY[language];
  const searchCopy = SEARCH_COPY[language];
  const [currentJobs, setCurrentJobs] = useState<LiveOffer[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retry, setRetry] = useState(0);
  const loadCopy = LOAD_COPY[language];
  useEffect(() => {
    let disposed = false;
    let running = false;
    const load = async () => {
      if (running || disposed) return;
      running = true;
      try {
        const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Tunis', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
        const date = ['year', 'month', 'day'].map(part => day.find(p => p.type === part)?.value).join('-');
        const offers: LiveOffer[] = [];
        const batch = 200;
        for (let offset = 0; ; offset += batch) {
          const { data, error } = await supabase.from('verified_job_offers')
            .select('id,title,company,city,governorate,contract,sector,experience,skills,source_name,source_url,verified_at,review_until')
            .eq('status', 'published').lte('verified_at', date).gte('review_until', date)
            .order('verified_at', { ascending: false }).order('id').range(offset, offset + batch - 1);
          if (disposed) return;
          if (error) throw error;
          for (const row of data ?? []) {
            if (!row.source_url.startsWith('https://')) continue;
            offers.push({ id: row.id, title: row.title, company: row.company, city: row.city, governorate: row.governorate, contract: row.contract, sector: row.sector, experience: row.experience, skills: row.skills, sourceName: row.source_name, sourceUrl: row.source_url, verifiedAt: row.verified_at, reviewUntil: row.review_until });
          }
          if (!data || data.length < batch) break;
        }
        if (!disposed) { setCurrentJobs(offers); setLoadState('ready'); }
      } catch {
        if (!disposed) { setCurrentJobs([]); setLoadState('error'); }
      } finally { running = false; }
    };
    setLoadState('loading');
    void load();
    const timer = window.setInterval(load, 5 * 60 * 1000);
    window.addEventListener('focus', load);
    return () => { disposed = true; window.clearInterval(timer); window.removeEventListener('focus', load); };
  }, [retry]);
  const cities = [...new Set(currentJobs.map(offer => offer.city))].sort();
  const terms = normalize(keyword.trim()).split(/\s+/).filter(Boolean);
  const verifiedJobs = currentJobs.filter(offer =>
    (!city || offer.city === city) &&
    terms.every(term => normalize([offer.title, offer.company, offer.sector, offer.city, offer.governorate ?? '', offer.contract, offer.experience, ...offer.skills].join(' ')).includes(term))
  ).sort((a, b) => b.verifiedAt.localeCompare(a.verifiedAt) || a.id.localeCompare(b.id));
  const pageCount = Math.max(1, Math.ceil(verifiedJobs.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleJobs = verifiedJobs.slice(start, start + PAGE_SIZE);
  useEffect(() => { setPage(value => Math.min(value, pageCount)); }, [pageCount]);
  const changePage = (value: number) => {
    setPage(Math.max(1, Math.min(value, pageCount)));
    resultsTop.current?.scrollIntoView({ block: 'start' });
  };

  useEffect(() => {
    if (!requestMode) return undefined;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setRequestMode(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [requestMode]);

  const structuredData = generateCollectionPageSchema(
    copy.offersTitle,
    copy.seoDescription,
    [],
    '/jobs',
  );

  return (
    <main className="public-surface min-h-screen overflow-x-hidden bg-[#F8F6F2]">
      <SEOHead
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical="https://dalil-tounes.com/jobs"
        currentPath="/jobs"
      />
      <StructuredData data={structuredData} />

      <section className="relative overflow-hidden border-b-2 border-[#D4AF37] px-4 py-8">
        <picture>
          <source srcSet={HERO_IMAGE_URL} type="image/webp" />
          <img
            src={HERO_IMAGE_JPG_URL}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover brightness-105"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-[#292725]/70" aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <h1 className="public-title mb-4 font-serif text-3xl font-light leading-tight text-[#D4AF37] drop-shadow-lg md:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mx-auto mb-5 max-w-3xl text-base font-medium text-white md:text-xl">
            {copy.heroSubtitle}
          </p>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-white/95 md:text-base">
            {copy.heroDescription}
          </p>
        </motion.div>
      </section>

      <section className="px-4 pb-16 pt-4">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#9A7418]">
            {copy.offersEyebrow}
          </p>
          <h2 className="public-heading mb-3 text-center font-serif text-3xl text-[#292725]">{copy.offersTitle}</h2>
          <div className="mb-4 grid gap-2 sm:grid-cols-2">
            <input type="search" aria-label={searchCopy[0]} placeholder={searchCopy[0]} value={keyword} onChange={event => { setKeyword(event.target.value); setPage(1); }} className="rounded-lg border border-[#D4AF37] bg-white px-4 py-3 text-[#292725]" />
            <select aria-label={searchCopy[1]} value={city} onChange={event => { setCity(event.target.value); setPage(1); }} className="rounded-lg border border-[#D4AF37] bg-white px-4 py-3 text-[#292725]">
              <option value="">{searchCopy[1]}</option>
              {cities.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
          <p ref={resultsTop} aria-live="polite" className="mb-3 scroll-mt-24 text-center text-sm font-medium text-gray-600">
            {loadState === 'ready' ? <>{verifiedJobs.length} {copy.offersFound}{verifiedJobs.length > 0 && <> · {start + 1}–{Math.min(start + PAGE_SIZE, verifiedJobs.length)} / {verifiedJobs.length}</>}</> : null}
          </p>

          {loadState !== 'ready' ? (
            <div role="status" className="rounded-xl border border-[#D4AF37] bg-white p-5 text-center text-sm text-[#292725]">
              {loadState === 'loading' ? loadCopy[0] : <>{loadCopy[1]} <button type="button" className="underline" onClick={() => setRetry(value => value + 1)}>{loadCopy[2]}</button></>}
            </div>
          ) : verifiedJobs.length > 0 ? (
            <>
            <div className="grid items-start gap-2 md:grid-cols-2 md:gap-3">
              {visibleJobs.map((offer) => (
                <VerifiedJobCard
                  key={offer.id}
                  offer={offer}
                  locale={JOB_LOCALES[language]}
                  labels={{
                    verifiedOn: copy.verifiedOn,
                    reviewUntil: copy.reviewUntil,
                    source: copy.source,
                    apply: copy.applyAtSource,
                    externalNotice: copy.externalNotice,
                  }}
                />
              ))}
            </div>
            {pageCount > 1 && <nav aria-label={pageCopy[4]} className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
              <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} className="rounded-lg border border-[#D4AF37] bg-white px-3 py-2 text-[#292725] disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]">{pageCopy[0]}</button>
              <span aria-live="polite" className="px-1 font-medium text-[#292725]">{pageCopy[2]} {currentPage} {pageCopy[3]} {pageCount}</span>
              <button type="button" disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)} className="rounded-lg border border-[#D4AF37] bg-white px-3 py-2 text-[#292725] disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]">{pageCopy[1]}</button>
            </nav>}
            </>
          ) : (
            <div className="rounded-xl border border-[#D4AF37] bg-white px-4 py-6 text-center shadow-sm md:px-12">
              <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#D6B86D] text-[#292725]">
                <Briefcase className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mb-3 text-xl font-semibold text-[#292725]">{currentJobs.length ? searchCopy[2] : copy.emptyTitle}</h3>
              <p className="mx-auto mb-4 max-w-3xl text-sm leading-6 text-gray-600 md:text-base">{currentJobs.length ? <button type="button" onClick={() => { setKeyword(''); setCity(''); setPage(1); }} className="underline">{searchCopy[3]}</button> : copy.emptyDescription}</p>
            </div>
          )}

          <p className="mx-auto mt-8 flex max-w-3xl items-start justify-center gap-2 text-center text-sm font-medium text-gray-700">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[#9A7418]" aria-hidden="true" />
            <span>{copy.emptyNote}</span>
          </p>

      <section className="py-4" aria-label={copy.heroSubtitle}>
        <div className="mx-auto grid max-w-5xl gap-3 md:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative flex h-full flex-col rounded-xl border border-[#D4AF37] bg-[#FFF8EA] p-4 md:p-5 shadow-sm"
          >
            <span className="absolute right-4 top-4 rounded-md border border-[#D4AF37] bg-black px-2 py-1 text-[10px] font-medium tracking-wider text-[#D4AF37]">
              {copy.employerBadge}
            </span>
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#D6B86D] text-[#292725]">
              <Building2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="public-heading mb-2 font-serif text-xl text-[#292725]">{copy.employerTitle}</h2>
            <p className="mb-3 flex-1 text-sm leading-5 text-[#514B43]">{copy.employerDescription}</p>
            <button
              type="button"
              onClick={() => setRequestMode('employer')}
              className="w-full rounded-lg border border-[#D4AF37] bg-white px-4 py-2.5 text-sm font-semibold text-[#292725] transition hover:bg-[#fcfaf5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              {copy.employerButton}
            </button>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="relative flex h-full flex-col rounded-xl border border-[#D4AF37] bg-[#FFF8EA] p-4 md:p-5 shadow-sm"
          >
            <span className="absolute right-4 top-4 rounded-md border border-[#D4AF37] bg-black px-2 py-1 text-[10px] font-medium tracking-wider text-[#D4AF37]">
              {copy.candidateBadge}
            </span>
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#D6B86D] text-[#292725]">
              <UserRound className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="public-heading mb-2 font-serif text-xl text-[#292725]">{copy.candidateTitle}</h2>
            <p className="mb-3 flex-1 text-sm leading-5 text-[#514B43]">{copy.candidateDescription}</p>
            <button
              type="button"
              onClick={() => setRequestMode('candidate')}
              className="w-full rounded-lg border border-[#D4AF37] bg-white px-4 py-2.5 text-sm font-semibold text-[#292725] transition hover:bg-[#fcfaf5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              {copy.candidateButton}
            </button>
          </motion.article>
        </div>
      </section>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-[#D4AF37] bg-[#FFF8EA] p-4 md:p-5 text-[#292725]">
              <Sparkles className="mb-2 h-6 w-6 text-[#D4AF37]" aria-hidden="true" />
              <h3 className="mb-2 font-serif text-xl text-[#292725]">{copy.talentsTitle}</h3>
              <p className="mb-3 text-sm leading-5 text-[#514B43]">{copy.talentsDescription}</p>
              <Link
                to="/candidats"
                className="inline-flex items-center gap-2 rounded-lg border border-[#D4AF37] bg-white px-4 py-2.5 text-sm font-semibold text-[#292725] transition hover:bg-[#fcfaf5]"
              >
                {copy.talentsLink}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
            <div className="rounded-xl border border-[#D4AF37] bg-white p-4 md:p-5">
              <Building2 className="mb-2 h-6 w-6 text-[#292725]" aria-hidden="true" />
              <h3 className="mb-2 font-serif text-xl text-[#292725]">{copy.businessLink}</h3>
              <p className="mb-3 text-sm leading-5 text-gray-600">{copy.heroDescription}</p>
              <Link
                to="/businesses"
                className="inline-flex items-center gap-2 rounded-lg border border-[#C9A65D] px-4 py-2.5 text-sm font-semibold text-[#292725] transition hover:bg-[#F0E2BD] hover:text-[#292725]"
              >
                {copy.businessLink}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {requestMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="job-request-dialog-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setRequestMode(null);
          }}
        >
          <div className="my-6 w-full max-w-2xl overflow-hidden rounded-xl border border-[#D4AF37] bg-[#1A1A1A] shadow-sm">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#D4AF37]/60 bg-[#FFF8EA] px-5 py-4">
              <h2 id="job-request-dialog-title" className="public-heading pr-4 font-serif text-xl text-[#292725] md:text-2xl">
                {requestMode === 'employer' ? copy.modalEmployerTitle : copy.modalCandidateTitle}
              </h2>
              <button
                type="button"
                onClick={() => setRequestMode(null)}
                aria-label={copy.close}
                className="rounded-full p-2 text-[#292725] transition hover:bg-[#F0E2BD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-5 md:p-7">
              <JobPostForm
                mode={requestMode}
                onSuccess={() => setRequestMode(null)}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
