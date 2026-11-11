import { Briefcase, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import JobPostForm from '../components/forms/JobPostForm';
import { useLanguage } from '../context/LanguageContext';
import { getJobsPageTranslations } from '../lib/jobsPageTranslations';

export default function PublishJob() {
  const { language } = useLanguage();
  const copy = getJobsPageTranslations(language);
  const navigate = useNavigate();

  return (
    <main className="public-surface min-h-screen bg-[#fcfaf5] px-4 py-16">
      <SEOHead
        title={copy.publishPageTitle}
        description={copy.publishPageSubtitle}
        canonical="https://dalil-tounes.com/emplois/publier"
        currentPath="/emplois/publier"
      />

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37] bg-[#fffdf9] text-[#806336]">
            <Briefcase className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="public-title mb-3 font-serif text-3xl font-light text-[#806336] md:text-4xl">
            {copy.publishPageTitle}
          </h1>
          <p className="text-[#6c6068]">{copy.publishPageSubtitle}</p>
        </div>

        <div className="mb-8 rounded-lg border border-[#D4AF37] bg-[#fffdf9] p-4">
          <p className="flex items-start gap-3 text-sm leading-6 text-[#35172f]">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#806336]" aria-hidden="true" />
            <span>{copy.publishPageNotice}</span>
          </p>
        </div>

        <div className="rounded-xl border border-[#D4AF37] bg-[#fffdf9] p-6 shadow-sm md:p-8">
          <JobPostForm mode="employer" onSuccess={() => navigate('/jobs')} />
        </div>

        <div className="mt-8 rounded-lg border border-[#D4AF37] bg-[#fffdf9] p-6">
          <h2 className="public-heading mb-3 text-lg font-medium text-[#35172f]">{copy.helpTitle}</h2>
          <ul className="space-y-2 text-sm text-[#6c6068]">
            {copy.helpTips.map(tip => <li key={tip}>• {tip}</li>)}
          </ul>
        </div>
      </div>
    </main>
  );
}
