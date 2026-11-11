import { Star } from 'lucide-react';

interface GoogleRatingSummaryProps {
  rating?: string | number | null;
  reviewCount?: string | number | null;
  language: string;
  className?: string;
  trustOnly?: boolean;
}

const REVIEW_LABELS: Record<string, { singular: string; plural: string; aria: string; outOfFive: string }> = {
  fr: { singular: 'avis', plural: 'avis', aria: 'Note Google', outOfFive: 'sur 5' },
  ar: { singular: 'تقييم', plural: 'تقييمات', aria: 'تقييم Google', outOfFive: 'من 5' },
  en: { singular: 'review', plural: 'reviews', aria: 'Google rating', outOfFive: 'out of 5' },
  it: { singular: 'recensione', plural: 'recensioni', aria: 'Valutazione Google', outOfFive: 'su 5' },
  ru: { singular: 'отзыв', plural: 'отзывов', aria: 'Рейтинг Google', outOfFive: 'из 5' },
};

const TRUST_LABELS: Record<string, [string, string]> = {
  fr: ['Bien notée par les clients', 'Très bien notée par les clients'],
  ar: ['تقييم جيد من العملاء', 'تقييم ممتاز من العملاء'],
  en: ['Well rated by customers', 'Very well rated by customers'],
  it: ['Ben valutata dai clienti', 'Molto ben valutata dai clienti'],
  ru: ['Высоко оценена клиентами', 'Очень высоко оценена клиентами'],
};

function parseNumber(value: string | number | null | undefined): number {
  if (value == null || value === '') return 0;
  const normalized = typeof value === 'string' ? value.replace(',', '.') : value;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseReviewCount(value: string | number | null | undefined): number {
  if (value == null || value === '') return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const parsed = Number.parseInt(value.replace(/[^\d]/g, ''), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function GoogleRatingSummary({
  rating,
  reviewCount,
  language,
  className = '',
  trustOnly = false,
}: GoogleRatingSummaryProps) {
  const normalizedRating = Math.min(5, Math.max(0, parseNumber(rating)));
  const normalizedReviewCount = parseReviewCount(reviewCount);
  if (normalizedRating <= 0) return null;

  const copy = REVIEW_LABELS[language] || REVIEW_LABELS.fr;
  const trustLabels = TRUST_LABELS[language] || TRUST_LABELS.fr;
  const trustLabel = normalizedReviewCount >= 5 && normalizedRating >= 4 && parseNumber(rating) <= 5
    ? trustLabels[normalizedRating >= 4.5 ? 1 : 0] : null;
  const reviewLabel = normalizedReviewCount === 1 ? copy.singular : copy.plural;

  if (trustOnly) return trustLabel ? <span className={className}>{trustLabel}</span> : null;

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-1 text-[11px] font-semibold ${className}`}
      aria-label={`${copy.aria} ${normalizedRating.toFixed(1)} ${copy.outOfFive}, ${normalizedReviewCount} ${reviewLabel}${trustLabel ? `, ${trustLabel}` : ''}`}
    >
      <Star className="h-3 w-3 shrink-0 fill-[#D4AF37] text-[#D4AF37]" aria-hidden="true" />
      <span>{normalizedRating.toFixed(1)}</span>
      <span aria-hidden="true">·</span>
      <span>{normalizedReviewCount} {reviewLabel}</span>
      {trustLabel && <span className="basis-full text-[10px]">{trustLabel}</span>}
    </div>
  );
}
