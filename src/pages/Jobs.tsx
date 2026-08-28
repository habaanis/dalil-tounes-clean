import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Building2, ShieldCheck, UserRound, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import JobPostForm from '../components/forms/JobPostForm';
import { HERO_IMAGE_JPG_URL, HERO_IMAGE_URL } from '../constants/images';
import { useLanguage } from '../context/LanguageContext';
import { generateCollectionPageSchema } from '../lib/structuredDataSchemas';
import { getJobsPageTranslations, type JobRequestMode } from '../lib/jobsPageTranslations';

export const Jobs = () => {
  const { language } = useLanguage();
  const copy = getJobsPageTranslations(language);
  const [requestMode, setRequestMode] = useState<JobRequestMode | null>(null);

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
    <main className="min-h-screen overflow-x-hidden bg-[#F8F6F2]">
      <SEOHead
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical="https://dalil-tounes.com/jobs"
        currentPath="/jobs"
      />
      <StructuredData data={structuredData} />

      <section className="relative overflow-hidden border-b-2 border-[#D4AF37] px-4 py-20">
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
        <div className="absolute inset-0 bg-[#4A1D43]/75" aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <h1 className="mb-4 font-serif text-3xl font-light leading-tight text-[#D4AF37] drop-shadow-lg md:text-5xl">
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

      <section className="px-4 py-12" aria-label={copy.heroSubtitle}>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative flex h-full flex-col rounded-2xl border border-[#D4AF37] bg-[#4A1D43] p-6 shadow-xl"
          >
            <span className="absolute right-4 top-4 rounded-md border border-[#D4AF37] bg-black px-2 py-1 text-[10px] font-bold tracking-wider text-[#D4AF37]">
              {copy.employerBadge}
            </span>
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#2A1525] text-[#D4AF37]">
              <Building2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mb-3 font-serif text-2xl text-[#D4AF37]">{copy.employerTitle}</h2>
            <p className="mb-6 flex-1 text-sm leading-6 text-white/90">{copy.employerDescription}</p>
            <button
              type="button"
              onClick={() => setRequestMode('employer')}
              className="w-full rounded-lg border border-[#D4AF37] bg-white px-5 py-3 text-sm font-semibold text-[#4A1D43] transition hover:bg-[#F5F5DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              {copy.employerButton}
            </button>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="relative flex h-full flex-col rounded-2xl border border-[#D4AF37] bg-[#4A1D43] p-6 shadow-xl"
          >
            <span className="absolute right-4 top-4 rounded-md border border-[#D4AF37] bg-black px-2 py-1 text-[10px] font-bold tracking-wider text-[#D4AF37]">
              {copy.candidateBadge}
            </span>
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#2A1525] text-[#D4AF37]">
              <UserRound className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mb-3 font-serif text-2xl text-[#D4AF37]">{copy.candidateTitle}</h2>
            <p className="mb-6 flex-1 text-sm leading-6 text-white/90">{copy.candidateDescription}</p>
            <button
              type="button"
              onClick={() => setRequestMode('candidate')}
              className="w-full rounded-lg border border-[#D4AF37] bg-white px-5 py-3 text-sm font-semibold text-[#4A1D43] transition hover:bg-[#F5F5DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              {copy.candidateButton}
            </button>
          </motion.article>
        </div>
      </section>

      <section className="px-4 pb-16 pt-4">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#9A7418]">
            {copy.offersEyebrow}
          </p>
          <h2 className="mb-8 text-center font-serif text-3xl text-[#4A1D43]">{copy.offersTitle}</h2>

          <div className="rounded-2xl border border-[#D4AF37] bg-white px-6 py-10 text-center shadow-sm md:px-12">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#4A1D43] text-[#D4AF37]">
              <Briefcase className="h-7 w-7" aria-hidden="true" />
            </span>
            <h3 className="mb-3 text-xl font-semibold text-[#4A1D43]">{copy.emptyTitle}</h3>
            <p className="mx-auto mb-4 max-w-3xl text-sm leading-6 text-gray-600 md:text-base">{copy.emptyDescription}</p>
            <p className="mx-auto mb-7 flex max-w-2xl items-start justify-center gap-2 text-sm font-medium text-gray-700">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[#9A7418]" aria-hidden="true" />
              <span>{copy.emptyNote}</span>
            </p>
            <Link
              to="/businesses"
              className="inline-flex items-center gap-2 rounded-lg border border-[#4A1D43] px-5 py-3 text-sm font-semibold text-[#4A1D43] transition hover:bg-[#4A1D43] hover:text-white"
            >
              {copy.businessLink}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
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
          <div className="my-6 w-full max-w-2xl overflow-hidden rounded-2xl border border-[#D4AF37] bg-[#1A1A1A] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#D4AF37]/60 bg-[#4A1D43] px-5 py-4">
              <h2 id="job-request-dialog-title" className="pr-4 font-serif text-xl text-[#D4AF37] md:text-2xl">
                {requestMode === 'employer' ? copy.modalEmployerTitle : copy.modalCandidateTitle}
              </h2>
              <button
                type="button"
                onClick={() => setRequestMode(null)}
                aria-label={copy.close}
                className="rounded-full p-2 text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
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
