import { useEffect, useMemo, useState } from 'react';
import { Award, Clock, MapPin, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import JobPostForm from '../components/forms/JobPostForm';
import { useLanguage } from '../context/LanguageContext';
import { getCandidateSelectionTranslations } from '../lib/candidateSelectionTranslations';
import { supabase } from '../lib/supabaseClient';

interface PublicCandidate {
  id: string;
  city: string | null;
  category: string | null;
  skills: string[] | null;
  experience_years: number | null;
  languages: string[] | null;
  desired_contracts: string[] | null;
  updated_at: string;
}

type ExperienceFilter = 'all' | '0-1' | '2-5' | '6+';

function normalize(value: string | null | undefined) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function profileScore(candidate: PublicCandidate) {
  let score = 0;
  if (candidate.category) score += 20;
  if (candidate.city) score += 10;
  score += Math.min(candidate.skills?.length || 0, 5) * 5;

  const experience = candidate.experience_years || 0;
  if (experience >= 1) score += 5;
  if (experience >= 3) score += 5;
  if (experience >= 5) score += 5;

  score += Math.min(candidate.languages?.length || 0, 2) * 5;
  if (candidate.desired_contracts?.length) score += 10;

  const updatedAt = new Date(candidate.updated_at).getTime();
  const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
  if (Number.isFinite(updatedAt) && updatedAt >= oneYearAgo) score += 5;

  return Math.min(score, 100);
}

export default function CandidateList() {
  const { language } = useLanguage();
  const copy = getCandidateSelectionTranslations(language);
  const [candidates, setCandidates] = useState<PublicCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [experienceFilter, setExperienceFilter] = useState<ExperienceFilter>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<PublicCandidate | null>(null);

  useEffect(() => {
    let active = true;

    const loadCandidates = async () => {
      const { data, error: queryError } = await supabase
        .from('candidates')
        .select('id, city, category, skills, experience_years, languages, desired_contracts, updated_at')
        .eq('visibility', 'public');

      if (!active) return;
      if (queryError) {
        console.error('[CandidateList] public profiles error:', queryError);
        setError(true);
      } else {
        setCandidates((data || []) as PublicCandidate[]);
      }
      setLoading(false);
    };

    void loadCandidates();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selectedCandidate) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedCandidate(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedCandidate]);

  const cityOptions = useMemo(() => Array.from(new Set(
    candidates.map((candidate) => candidate.city?.trim()).filter((city): city is string => Boolean(city)),
  )).sort((a, b) => a.localeCompare(b, language)), [candidates, language]);

  const filteredCandidates = useMemo(() => {
    const query = normalize(searchTerm);
    return candidates
      .filter((candidate) => {
        const experience = candidate.experience_years || 0;
        const matchesExperience = experienceFilter === 'all'
          || (experienceFilter === '0-1' && experience <= 1)
          || (experienceFilter === '2-5' && experience >= 2 && experience <= 5)
          || (experienceFilter === '6+' && experience >= 6);
        const haystack = normalize([
          candidate.category,
          candidate.city,
          ...(candidate.skills || []),
          ...(candidate.languages || []),
        ].filter(Boolean).join(' '));

        return (!selectedCity || candidate.city === selectedCity)
          && matchesExperience
          && (!query || haystack.includes(query));
      })
      .sort((first, second) => {
        const scoreDifference = profileScore(second) - profileScore(first);
        if (scoreDifference) return scoreDifference;
        const experienceDifference = (second.experience_years || 0) - (first.experience_years || 0);
        if (experienceDifference) return experienceDifference;
        return new Date(second.updated_at).getTime() - new Date(first.updated_at).getTime();
      });
  }, [candidates, experienceFilter, searchTerm, selectedCity]);

  return (
    <main className="min-h-screen bg-[#F8F6F2] px-4 py-12" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <SEOHead
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical="https://dalil-tounes.com/candidats"
        currentPath="/candidats"
      />

      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#9A7418]">{copy.eyebrow}</p>
          <h1 className="mb-4 font-serif text-3xl text-[#4A1D43] md:text-5xl">{copy.title}</h1>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-gray-700 md:text-base">{copy.subtitle}</p>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2" aria-label={copy.methodTitle}>
          <div className="rounded-2xl border border-[#D4AF37] bg-white p-5">
            <Award className="mb-3 h-6 w-6 text-[#9A7418]" aria-hidden="true" />
            <h2 className="mb-2 font-serif text-xl text-[#4A1D43]">{copy.methodTitle}</h2>
            <p className="text-sm leading-6 text-gray-600">{copy.methodText}</p>
          </div>
          <div className="rounded-2xl border border-[#D4AF37] bg-[#4A1D43] p-5 text-white">
            <ShieldCheck className="mb-3 h-6 w-6 text-[#D4AF37]" aria-hidden="true" />
            <p className="text-sm leading-6 text-white/90">{copy.privacyText}</p>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-[#D4AF37] bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="md:col-span-1">
              <span className="mb-2 block text-sm font-medium text-[#4A1D43]">{copy.searchLabel}</span>
              <span className="relative block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-3" aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="w-full rounded-lg border border-[#D4AF37] py-3 pl-10 pr-3 text-sm focus:ring-2 focus:ring-[#4A1D43] rtl:pl-3 rtl:pr-10"
                />
              </span>
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium text-[#4A1D43]">{copy.cityLabel}</span>
              <select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)} className="w-full rounded-lg border border-[#D4AF37] px-3 py-3 text-sm focus:ring-2 focus:ring-[#4A1D43]">
                <option value="">{copy.allCities}</option>
                {cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium text-[#4A1D43]">{copy.experienceLabel}</span>
              <select value={experienceFilter} onChange={(event) => setExperienceFilter(event.target.value as ExperienceFilter)} className="w-full rounded-lg border border-[#D4AF37] px-3 py-3 text-sm focus:ring-2 focus:ring-[#4A1D43]">
                <option value="all">{copy.allExperiences}</option>
                <option value="0-1">{copy.experience0to1}</option>
                <option value="2-5">{copy.experience2to5}</option>
                <option value="6+">{copy.experience6plus}</option>
              </select>
            </label>
          </div>
        </section>

        {loading && <p className="py-16 text-center text-gray-600">{copy.loading}</p>}
        {!loading && error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-red-800">{copy.error}</p>}

        {!loading && !error && filteredCandidates.length === 0 && (
          <section className="rounded-2xl border border-dashed border-[#D4AF37] bg-white px-6 py-12 text-center">
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-[#9A7418]" aria-hidden="true" />
            <h2 className="mb-3 font-serif text-2xl text-[#4A1D43]">{copy.emptyTitle}</h2>
            <p className="mx-auto mb-6 max-w-2xl text-sm leading-6 text-gray-600">{copy.emptyText}</p>
            <Link to="/jobs" className="inline-flex rounded-lg bg-[#4A1D43] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5A2D53]">
              {copy.submitProfile}
            </Link>
          </section>
        )}

        {!loading && !error && filteredCandidates.length > 0 && (
          <section className="grid gap-5 md:grid-cols-2">
            {filteredCandidates.map((candidate) => {
              const score = profileScore(candidate);
              const experience = candidate.experience_years || 0;
              return (
                <article key={candidate.id} className="flex h-full flex-col rounded-2xl border border-[#D4AF37] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-xl text-[#4A1D43]">{candidate.category || copy.profileFallback}</h2>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                        {candidate.city && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" aria-hidden="true" />{candidate.city}</span>}
                        <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" aria-hidden="true" />{experience} {experience === 1 ? copy.year : copy.years}</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#4A1D43] px-3 py-1 text-xs font-bold text-[#D4AF37]">{score}%</span>
                  </div>

                  {candidate.skills?.length ? (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {candidate.skills.slice(0, 6).map((skill) => <span key={skill} className="rounded-full border border-[#D4AF37] px-2.5 py-1 text-xs text-gray-700">{skill}</span>)}
                    </div>
                  ) : null}

                  <p className="mb-4 text-xs text-gray-500">{copy.profileStrength} {score}%</p>
                  <button type="button" onClick={() => setSelectedCandidate(candidate)} className="mt-auto w-full rounded-lg bg-[#4A1D43] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5A2D53]">
                    {copy.contact}
                  </button>
                </article>
              );
            })}
          </section>
        )}

        <div className="mt-8 text-center">
          <Link to="/jobs" className="text-sm font-semibold text-[#4A1D43] underline decoration-[#D4AF37] underline-offset-4">{copy.backToJobs}</Link>
        </div>
      </div>

      {selectedCandidate && (
        <div role="dialog" aria-modal="true" aria-labelledby="candidate-contact-title" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelectedCandidate(null); }}>
          <div className="my-6 w-full max-w-2xl overflow-hidden rounded-2xl border border-[#D4AF37] bg-[#1A1A1A] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/60 bg-[#4A1D43] px-5 py-4">
              <h2 id="candidate-contact-title" className="font-serif text-xl text-[#D4AF37]">{copy.modalTitle}</h2>
              <button type="button" onClick={() => setSelectedCandidate(null)} aria-label={copy.close} className="rounded-full p-2 text-white hover:bg-white/15"><X className="h-6 w-6" aria-hidden="true" /></button>
            </div>
            <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-5 md:p-7">
              <JobPostForm mode="candidate-contact" initialTitle={`${selectedCandidate.category || copy.profileFallback} · ${selectedCandidate.city || ''}`} onSuccess={() => setSelectedCandidate(null)} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
