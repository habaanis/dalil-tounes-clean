import { Briefcase, ChevronDown, ExternalLink, MapPin } from 'lucide-react';
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

export default function VerifiedJobCard({ offer, labels, locale }: VerifiedJobCardProps) {
  const lang = locale.split('-')[0];
  const details = ({fr:'Voir les détails', ar:'عرض التفاصيل', en:'View details', it:'Vedi dettagli', ru:'Подробнее'} as Record<string,string>)[lang] || 'Voir les détails';
  return (
    <article className="self-start rounded-xl border border-[#D4AF37]/65 bg-white px-3 py-2.5 shadow-sm sm:px-4">
      <div className="flex items-start gap-2.5">
        <Briefcase className="mt-1 h-4 w-4 shrink-0 text-[#9A7418]" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-semibold leading-snug text-[#292725] sm:text-base">{offer.title}</h3>
          <p className="mt-0.5 break-words text-xs font-medium text-[#514B43]">{offer.company}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-[#9A7418]" aria-hidden="true" />{offer.city}</span>
            {offer.contract && <span>· {offer.contract}</span>}
          </div>
        </div>
      </div>
      <details className="group mt-2 border-t border-[#D4AF37]/25 pt-1.5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-md py-1 text-xs font-semibold text-[#765817] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] [&::-webkit-details-marker]:hidden">
          {details}<ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="mt-2 space-y-2">
          {offer.experience && <p className="text-xs text-gray-700">{offer.experience}</p>}
          {(offer.sector || offer.skills.length > 0) && <div className="flex flex-wrap gap-1">
            {offer.sector && <span className="rounded-full bg-[#292725]/10 px-2 py-0.5 text-xs font-medium text-[#292725]">{offer.sector}</span>}
            {offer.skills.map(skill => <span key={skill} className="rounded-full border border-[#D4AF37]/60 px-2 py-0.5 text-xs text-gray-700">{skill}</span>)}
          </div>}
          <p className="break-words text-xs text-gray-600">{labels.source} : {offer.sourceName}</p>
          <a href={offer.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#292725] px-3 py-2 text-xs font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]" aria-label={labels.apply + ' — ' + offer.title + ', ' + offer.company}>{labels.apply}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>
          <p className="text-center text-[11px] leading-4 text-gray-500">{labels.externalNotice}</p>
        </div>
      </details>
    </article>
  );
}
