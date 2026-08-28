import { Briefcase, CalendarCheck, ExternalLink, MapPin } from 'lucide-react';
import type { VerifiedJobOffer } from '../lib/verifiedJobs';

interface VerifiedJobCardProps {
  offer: VerifiedJobOffer;
  labels: {
    verifiedOn: string;
    reviewUntil: string;
    source: string;
    apply: string;
    externalNotice: string;
  };
  locale: string;
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00Z`));
}

export default function VerifiedJobCard({ offer, labels, locale }: VerifiedJobCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#D4AF37]/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg md:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-[#9A7418]">{offer.company}</p>
          <h3 className="font-serif text-xl leading-snug text-[#4A1D43]">{offer.title}</h3>
        </div>
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#4A1D43] text-[#D4AF37]">
          <Briefcase className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-[#800020]" aria-hidden="true" />
          {offer.city}
        </span>
        <span>{offer.contract}</span>
        <span>{offer.experience}</span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#4A1D43]/10 px-2.5 py-1 text-xs font-semibold text-[#4A1D43]">{offer.sector}</span>
        {offer.skills.map((skill) => (
          <span key={skill} className="rounded-full border border-[#D4AF37]/70 px-2.5 py-1 text-xs text-gray-700">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto border-t border-gray-200 pt-4">
        <div className="mb-4 space-y-1.5 text-xs text-gray-600">
          <p className="flex items-center gap-1.5">
            <CalendarCheck className="h-4 w-4 text-[#9A7418]" aria-hidden="true" />
            {labels.verifiedOn} {formatDate(offer.verifiedAt, locale)} · {labels.reviewUntil} {formatDate(offer.reviewUntil, locale)}
          </p>
          <p>{labels.source} : {offer.sourceName}</p>
        </div>
        <a
          href={offer.sourceUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#4A1D43] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5A2D53] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          aria-label={`${labels.apply} — ${offer.title}, ${offer.company}`}
        >
          {labels.apply}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
        <p className="mt-2 text-center text-[11px] leading-4 text-gray-500">{labels.externalNotice}</p>
      </div>
    </article>
  );
}
