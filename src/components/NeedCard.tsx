import { Link } from 'react-router-dom';
import { Building2, CalendarDays, Clock3, Eye, ExternalLink, MapPin, Star, WalletCards } from 'lucide-react';

export interface PublicBusinessNeed {
  id: string;
  created_at: string;
  published_at: string | null;
  type: string;
  title: string;
  summary: string | null;
  description: string;
  category: string | null;
  subcategory: string | null;
  tags: string[] | null;
  company_name: string;
  company_slug: string | null;
  company_city: string | null;
  city: string;
  governorate: string;
  zone_intervention: string | null;
  budget_min: number | null;
  budget_max: number | null;
  currency: string | null;
  deadline: string | null;
  urgency: string;
  status: string;
  visibility: string;
  moderation_status: string;
  is_featured: boolean | null;
  submission_lang: string | null;
}

interface NeedCardLabels {
  typeLabels: Record<string, string>;
  urgencyLabels: Record<string, string>;
  company: string;
  location: string;
  publishedAt: string;
  budget: string;
  deadline: string;
  featured: string;
  viewNeed: string;
  viewCompanyProfile: string;
}

interface NeedCardProps {
  need: PublicBusinessNeed;
  labels: NeedCardLabels;
  locale: string;
  companyProfileUrl?: string;
  onView: (need: PublicBusinessNeed) => void;
}

function formatDate(value: string | null, locale: string): string {
  if (!value) return '';

  try {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
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

function getExcerpt(need: PublicBusinessNeed): string {
  const text = (need.summary || need.description || '').trim();
  if (text.length <= 180) return text;
  return `${text.slice(0, 177).trim()}...`;
}

function getUrgencyClasses(urgency: string): string {
  if (urgency === 'urgent') {
    return 'border-red-200 bg-red-50 text-red-700';
  }

  if (urgency === 'low') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }

  return 'border-amber-200 bg-amber-50 text-amber-700';
}

export default function NeedCard({ need, labels, locale, companyProfileUrl, onView }: NeedCardProps) {
  const publishedDate = formatDate(need.published_at || need.created_at, locale);
  const budget = formatBudget(need, locale);
  const deadline = formatDate(need.deadline, locale);
  const typeLabel = labels.typeLabels[need.type] || need.type;
  const urgencyLabel = labels.urgencyLabels[need.urgency] || need.urgency;

  return (
    <article className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#D4AF37]/70 hover:shadow-md">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1 text-xs font-semibold text-[#4A1D43]">
          {typeLabel}
        </span>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getUrgencyClasses(need.urgency)}`}>
          {urgencyLabel}
        </span>
        {need.is_featured && (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/50 bg-[#4A1D43] px-3 py-1 text-xs font-semibold text-white">
            <Star className="h-3 w-3" aria-hidden="true" />
            {labels.featured}
          </span>
        )}
      </div>

      <h2 className="mb-2 text-lg font-bold leading-snug text-[#4A1D43]">{need.title}</h2>
      <p className="mb-5 text-sm leading-relaxed text-gray-600">{getExcerpt(need)}</p>

      <div className="mt-auto space-y-3 text-sm text-gray-700">
        <div className="flex items-start gap-2">
          <Building2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D4AF37]" aria-hidden="true" />
          <span>
            <span className="font-medium text-gray-900">{labels.company} :</span> {need.company_name}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D4AF37]" aria-hidden="true" />
          <span>
            <span className="font-medium text-gray-900">{labels.location} :</span> {need.city} · {need.governorate}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <CalendarDays className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D4AF37]" aria-hidden="true" />
          <span>
            <span className="font-medium text-gray-900">{labels.publishedAt} :</span> {publishedDate}
          </span>
        </div>

        {budget && (
          <div className="flex items-start gap-2">
            <WalletCards className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D4AF37]" aria-hidden="true" />
            <span>
              <span className="font-medium text-gray-900">{labels.budget} :</span> {budget}
            </span>
          </div>
        )}

        {deadline && (
          <div className="flex items-start gap-2">
            <Clock3 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D4AF37]" aria-hidden="true" />
            <span>
              <span className="font-medium text-gray-900">{labels.deadline} :</span> {deadline}
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onView(need)}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#4A1D43] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5A2D53] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
        style={{ border: '1px solid #D4AF37' }}
      >
        <Eye className="h-4 w-4" aria-hidden="true" />
        {labels.viewNeed}
      </button>

      {companyProfileUrl && (
        <Link
          to={companyProfileUrl}
          className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/50 bg-white px-4 py-2 text-xs font-semibold text-[#4A1D43] transition hover:bg-[#D4AF37]/10 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          {labels.viewCompanyProfile}
        </Link>
      )}
    </article>
  );
}
