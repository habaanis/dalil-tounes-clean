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
    <main className="min-h-screen bg-[#4A1D43] px-4 py-16">
      <SEOHead
        title={copy.publishPageTitle}
        description={copy.publishPageSubtitle}
        canonical="https://dalil-tounes.com/emplois/publier"
        currentPath="/emplois/publier"
      />

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37] bg-[#2A1525] text-[#D4AF37]">
            <Briefcase className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mb-3 font-serif text-3xl font-light text-[#D4AF37] md:text-4xl">
            {copy.publishPageTitle}
          </h1>
          <p className="text-[#E8D5C4]">{copy.publishPageSubtitle}</p>
        </div>

        <div className="mb-8 rounded-lg border border-[#D4AF37] bg-[#2A1525] p-4">
          <p className="flex items-start gap-3 text-sm leading-6 text-[#F5F5DC]">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#D4AF37]" aria-hidden="true" />
            <span>{copy.publishPageNotice}</span>
          </p>
        </div>

        <div className="rounded-2xl border border-[#D4AF37] bg-[#1A1A1A] p-6 shadow-2xl md:p-8">
          <JobPostForm mode="employer" onSuccess={() => navigate('/jobs')} />
        </div>

        <div className="mt-8 rounded-lg border border-[#D4AF37] bg-[#2A1525] p-6">
          <h2 className="mb-3 text-lg font-medium text-[#F5F5DC]">{copy.helpTitle}</h2>
          <ul className="space-y-2 text-sm text-[#E8D5C4]">
            {copy.helpTips.map(tip => <li key={tip}>• {tip}</li>)}
          </ul>
        </div>
      </div>
    </main>
  );
}
