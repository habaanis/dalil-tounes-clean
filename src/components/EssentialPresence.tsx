import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { siteStructureCopy } from '../lib/siteStructureCopy';

export function EssentialPresence({ registration = false }: { registration?: boolean }) {
  const { language } = useLanguage();
  const t = siteStructureCopy[language];
  return <section id={registration ? 'presence-essentielle' : undefined} className="scroll-mt-32 rounded-2xl border border-[#C9B681] bg-[#FFFCF7] p-5 sm:p-6" aria-label={t.essential}>
    <p className="text-xs font-medium text-[#7C6335]">{t.essential}</p>
    <h2 className="mt-2 font-serif text-xl font-medium text-[#292725] sm:text-xl">{t.freeIntro}</h2>
    <ul className="my-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700">{t.fields.map(field => <li key={field}>{field}</li>)}</ul>
    <Link className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#C9A65D] bg-[#B62226] px-5 py-3 text-center text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]" to={registration ? '/inscription-entreprise' : '/subscription#presence-essentielle'}>{t.freeAction}</Link>
  </section>;
}
