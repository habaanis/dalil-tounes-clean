import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, ExternalLink, Filter, Loader2, RefreshCw, X } from 'lucide-react';
import NeedCard, { PublicBusinessNeed } from '../components/NeedCard';
import { SEOHead } from '../components/SEOHead';
import StructuredData from '../components/StructuredData';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';
import { buildEntrepriseUrl } from '../lib/slugify';
import { generateCollectionPageSchema } from '../lib/structuredDataSchemas';
import { supabase } from '../lib/supabaseClient';

const PUBLIC_BUSINESS_NEEDS_FIELDS = `
  id,
  created_at,
  published_at,
  type,
  title,
  summary,
  description,
  category,
  subcategory,
  tags,
  company_name,
  company_slug,
  company_city,
  city,
  governorate,
  zone_intervention,
  budget_min,
  budget_max,
  currency,
  deadline,
  urgency,
  status,
  visibility,
  moderation_status,
  is_featured,
  submission_lang
`;

const NEED_TYPE_VALUES = [
  'supplier_search',
  'service_provider_search',
  'equipment_purchase',
  'equipment_sale',
  'liquidation',
  'partnership',
  'business_opportunity',
  'other',
];

const URGENCY_VALUES = ['low', 'normal', 'urgent'];

function getLocale(language: string): string {
  const locales: Record<string, string> = {
    fr: 'fr-FR',
    ar: 'ar-TN',
    en: 'en-US',
    it: 'it-IT',
    ru: 'ru-RU',
  };

  return locales[language] || 'fr-FR';
}

function sortUnique(values: Array<string | null | undefined>, locale: string): string[] {
  return Array.from(new Set(values.map(value => value?.trim()).filter(Boolean) as string[]))
    .sort((a, b) => a.localeCompare(b, locale));
}

function formatDate(value: string | null, locale: string): string {
  if (!value) return '';

  try {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatMoney(value: number, currency: string | null, locale: string): string {
  const safeCurrency = currency || 'TND';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value} ${safeCurrency}`;
  }
}

function formatBudget(need: PublicBusinessNeed, locale: string): string {
  if (need.budget_min !== null && need.budget_max !== null) {
    return `${formatMoney(need.budget_min, need.currency, locale)} - ${formatMoney(need.budget_max, need.currency, locale)}`;
  }

  if (need.budget_min !== null) {
    return `${formatMoney(need.budget_min, need.currency, locale)}+`;
  }

  if (need.budget_max !== null) {
    return formatMoney(need.budget_max, need.currency, locale);
  }

  return '';
}

function getCompanyProfileUrl(need: PublicBusinessNeed): string | null {
  if (!need.company_slug || !need.company_city) return null;
  return buildEntrepriseUrl({ slug: need.company_slug, ville: need.company_city });
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;

  return (
    <div className="grid gap-1 rounded-lg bg-gray-50 p-3 sm:grid-cols-[160px_1fr]">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}

export default function BusinessNeeds() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const copy = t.businessNeeds;
  const locale = getLocale(language);
  const navigate = useNavigate();

  const [needs, setNeeds] = useState<PublicBusinessNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const [selectedNeed, setSelectedNeed] = useState<PublicBusinessNeed | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchNeeds() {
      setLoading(true);
      setError(null);

      const { data, error: readError } = await supabase
        .from('business_needs')
        .select(PUBLIC_BUSINESS_NEEDS_FIELDS)
        .eq('status', 'published')
        .eq('moderation_status', 'approved')
        .eq('visibility', 'public')
        .is('deleted_at', null)
        .order('is_featured', { ascending: false, nullsFirst: false })
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(50);

      if (!active) return;

      if (readError) {
        console.error('[BusinessNeeds] public read error:', readError);
        setError(readError.message);
        setNeeds([]);
        setLoading(false);
        return;
      }

      const publicRows = ((data || []) as PublicBusinessNeed[]).filter(need =>
        need.status === 'published' &&
        need.moderation_status === 'approved' &&
        need.visibility === 'public'
      );

      setNeeds(publicRows);
      setLoading(false);
    }

    fetchNeeds();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedNeed) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedNeed(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedNeed]);

  const cityOptions = useMemo(() => sortUnique(needs.map(need => need.city), locale), [needs, locale]);
  const governorateOptions = useMemo(() => sortUnique(needs.map(need => need.governorate), locale), [needs, locale]);

  const filteredNeeds = useMemo(() => {
    return needs.filter(need => {
      if (selectedType && need.type !== selectedType) return false;
      if (selectedCity && need.city !== selectedCity) return false;
      if (selectedGovernorate && need.governorate !== selectedGovernorate) return false;
      if (selectedUrgency && need.urgency !== selectedUrgency) return false;
      return true;
    });
  }, [needs, selectedType, selectedCity, selectedGovernorate, selectedUrgency]);

  const structuredData = useMemo(() => (
    generateCollectionPageSchema(
      copy.title,
      copy.seoDescription,
      filteredNeeds.slice(0, 20).map(need => ({ name: need.title, url: '/besoins-professionnels' })),
      '/besoins-professionnels'
    )
  ), [copy.seoDescription, copy.title, filteredNeeds]);

  const hasFilters = Boolean(selectedType || selectedCity || selectedGovernorate || selectedUrgency);
  const selectedCompanyProfileUrl = selectedNeed ? getCompanyProfileUrl(selectedNeed) : null;

  const resetFilters = () => {
    setSelectedType('');
    setSelectedCity('');
    setSelectedGovernorate('');
    setSelectedUrgency('');
  };

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <SEOHead
        title={copy.seoTitle}
        description={copy.seoDescription}
        currentPath="/besoins-professionnels"
      />
      <StructuredData data={structuredData} />

      <section className="border-b border-[#D4AF37]/30 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 text-sm font-semibold text-[#4A1D43]">
              <Briefcase className="h-4 w-4" aria-hidden="true" />
              {copy.badge}
            </span>
            <h1 className="text-3xl font-bold tracking-normal text-[#4A1D43] md:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-700 md:text-lg">
              {copy.subtitle}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
              {copy.introduction}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/entreprises')}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#D4AF37] bg-white px-5 py-2.5 text-sm font-semibold text-[#4A1D43] transition hover:bg-[#D4AF37]/10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
              >
                {copy.publishNeed}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#4A1D43]">
              <Filter className="h-4 w-4" aria-hidden="true" />
              {copy.filters.title}
            </div>
            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                {copy.filters.reset}
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="grid gap-1 text-sm font-medium text-gray-700">
              {copy.filters.type}
              <select
                value={selectedType}
                onChange={event => setSelectedType(event.target.value)}
                className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
              >
                <option value="">{copy.filters.allTypes}</option>
                {NEED_TYPE_VALUES.map(type => (
                  <option key={type} value={type}>{copy.typeLabels[type]}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-sm font-medium text-gray-700">
              {copy.filters.city}
              <select
                value={selectedCity}
                onChange={event => setSelectedCity(event.target.value)}
                className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
              >
                <option value="">{copy.filters.allCities}</option>
                {cityOptions.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-sm font-medium text-gray-700">
              {copy.filters.governorate}
              <select
                value={selectedGovernorate}
                onChange={event => setSelectedGovernorate(event.target.value)}
                className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
              >
                <option value="">{copy.filters.allGovernorates}</option>
                {governorateOptions.map(governorate => (
                  <option key={governorate} value={governorate}>{governorate}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-sm font-medium text-gray-700">
              {copy.filters.urgency}
              <select
                value={selectedUrgency}
                onChange={event => setSelectedUrgency(event.target.value)}
                className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
              >
                <option value="">{copy.filters.allUrgencies}</option>
                {URGENCY_VALUES.map(urgency => (
                  <option key={urgency} value={urgency}>{copy.urgencyLabels[urgency]}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 text-center">
            <div>
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#D4AF37]" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-gray-600">{copy.loading}</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            <p className="font-semibold">{copy.errorTitle}</p>
            <p className="mt-1">{copy.errorDescription}</p>
          </div>
        ) : needs.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <Briefcase className="mx-auto h-10 w-10 text-[#D4AF37]" aria-hidden="true" />
            <p className="mt-4 text-base font-semibold text-[#4A1D43]">{copy.empty}</p>
          </div>
        ) : filteredNeeds.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-base font-semibold text-[#4A1D43]">{copy.noFilteredResults}</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#4A1D43] transition hover:bg-[#D4AF37]/10"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {copy.filters.reset}
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredNeeds.map(need => (
              <NeedCard
                key={need.id}
                need={need}
                labels={{
                  ...copy.card,
                  typeLabels: copy.typeLabels,
                  urgencyLabels: copy.urgencyLabels,
                }}
                locale={locale}
                companyProfileUrl={getCompanyProfileUrl(need) || undefined}
                onView={setSelectedNeed}
              />
            ))}
          </div>
        )}
      </section>

      {selectedNeed && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="business-need-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setSelectedNeed(null)}
            aria-label={copy.modal.close}
          />
          <div className="relative z-[100000] max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-5 shadow-2xl md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span className="mb-3 inline-flex rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#4A1D43]">
                  {copy.typeLabels[selectedNeed.type] || selectedNeed.type}
                </span>
                <h2 id="business-need-modal-title" className="text-2xl font-bold text-[#4A1D43]">
                  {selectedNeed.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNeed(null)}
                className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                aria-label={copy.modal.close}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {selectedNeed.description}
              </p>
            </div>

            <dl className="grid gap-3">
              <DetailRow label={copy.fields.company} value={selectedNeed.company_name} />
              <DetailRow label={copy.fields.city} value={selectedNeed.city} />
              <DetailRow label={copy.fields.governorate} value={selectedNeed.governorate} />
              <DetailRow label={copy.fields.category} value={selectedNeed.category} />
              <DetailRow label={copy.fields.subcategory} value={selectedNeed.subcategory} />
              <DetailRow label={copy.fields.zone} value={selectedNeed.zone_intervention} />
              <DetailRow label={copy.fields.budget} value={formatBudget(selectedNeed, locale)} />
              <DetailRow label={copy.fields.deadline} value={formatDate(selectedNeed.deadline, locale)} />
              <DetailRow label={copy.fields.urgency} value={copy.urgencyLabels[selectedNeed.urgency] || selectedNeed.urgency} />
              <DetailRow label={copy.fields.publishedAt} value={formatDate(selectedNeed.published_at || selectedNeed.created_at, locale)} />
            </dl>

            {selectedCompanyProfileUrl && (
              <Link
                to={selectedCompanyProfileUrl}
                className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/60 bg-white px-4 py-2 text-sm font-semibold text-[#4A1D43] transition hover:bg-[#D4AF37]/10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {copy.card.viewCompanyProfile}
              </Link>
            )}

            <div className="mt-5 rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-4 text-sm font-medium text-[#4A1D43]">
              {copy.modal.responseComingSoon}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
