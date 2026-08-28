import { useState, type FormEvent } from 'react';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { notifyAdmin } from '../../lib/notifyAdmin';
import { useLanguage } from '../../context/LanguageContext';
import { useFormTranslation } from '../../hooks/useFormTranslation';
import { getJobsPageTranslations, type JobRequestMode } from '../../lib/jobsPageTranslations';

interface JobPostFormProps {
  userId?: string;
  mode?: JobRequestMode;
  onSuccess?: () => void;
}

interface RequestData {
  title: string;
  phone: string;
  email: string;
  message: string;
}

const EMPTY_FORM: RequestData = { title: '', phone: '', email: '', message: '' };

export default function JobPostForm({
  userId = 'public-jobs-page',
  mode = 'employer',
  onSuccess,
}: JobPostFormProps) {
  const { language } = useLanguage();
  const copy = getJobsPageTranslations(language);
  const { submission_lang } = useFormTranslation();
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<RequestData>(EMPTY_FORM);
  const isEmployer = mode === 'employer';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    const title = formData.title.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!title) {
      setFeedback({ type: 'error', text: copy.form.requiredTitle });
      setSaving(false);
      return;
    }

    if (!phone && !email) {
      setFeedback({ type: 'error', text: copy.form.requiredContact });
      setSaving(false);
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback({ type: 'error', text: copy.form.invalidEmail });
      setSaving(false);
      return;
    }

    const requestType = isEmployer ? 'Demande publication offre emploi' : 'Candidature emploi';
    const contact = [phone, email].filter(Boolean).join(' - ');

    try {
      const { error } = await supabase.from('suggestions_entreprises').insert([{
        nom_entreprise: isEmployer ? title : `Candidature : ${title}`,
        secteur: requestType,
        ville: null,
        contact_suggere: contact,
        raison_suggestion: [requestType, message || 'Aucune présentation complémentaire.'].join('\n\n'),
        submission_lang,
      }]);

      if (error) throw error;

      notifyAdmin(
        isEmployer ? 'Nouvelle demande de publication emploi' : 'Nouvelle candidature emploi',
        {
          Poste: title,
          Telephone: phone || 'Non renseigné',
          Email: email || 'Non renseigné',
          Presentation: message || 'Non renseignée',
          Langue: language,
          UserId: userId,
        },
        '/admin/sourcing',
      );

      setFeedback({
        type: 'success',
        text: isEmployer ? copy.form.employerSuccess : copy.form.candidateSuccess,
      });
      setFormData(EMPTY_FORM);

      if (onSuccess) window.setTimeout(onSuccess, 1500);
    } catch (error) {
      console.error('[JobPostForm] submission error:', error);
      setFeedback({ type: 'error', text: copy.form.genericError });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-lg border border-[#D4AF37] bg-[#4A1D43]/20 p-4">
        <p className="text-sm leading-relaxed text-[#E8D5C4]">
          {isEmployer ? copy.form.employerIntro : copy.form.candidateIntro}
        </p>
      </div>

      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={feedback.type === 'success'
            ? 'flex items-start gap-3 rounded-lg border border-green-600 bg-green-900/30 p-4 text-green-200'
            : 'rounded-lg border border-red-600 bg-red-900/30 p-4 text-red-200'}
        >
          {feedback.type === 'success' && <CheckCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />}
          <p>{feedback.text}</p>
        </div>
      )}

      <div>
        <label htmlFor={`job-request-title-${mode}`} className="mb-2 block text-sm font-medium text-[#F5F5DC]">
          {isEmployer ? copy.form.employerTitleLabel : copy.form.candidateTitleLabel}<span className="text-[#D4AF37]"> *</span>
        </label>
        <input
          id={`job-request-title-${mode}`}
          type="text"
          required
          value={formData.title}
          onChange={(event) => setFormData(previous => ({ ...previous, title: event.target.value }))}
          className="w-full rounded-lg border border-[#D4AF37] bg-[#2A1525] px-4 py-3 text-[#F5F5DC] placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]"
          placeholder={isEmployer ? copy.form.employerTitlePlaceholder : copy.form.candidateTitlePlaceholder}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`job-request-phone-${mode}`} className="mb-2 block text-sm font-medium text-[#F5F5DC]">{copy.form.phone}</label>
          <input
            id={`job-request-phone-${mode}`}
            type="tel"
            value={formData.phone}
            onChange={(event) => setFormData(previous => ({ ...previous, phone: event.target.value }))}
            className="w-full rounded-lg border border-[#D4AF37] bg-[#2A1525] px-4 py-3 text-[#F5F5DC] placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]"
            placeholder={copy.form.phonePlaceholder}
          />
        </div>
        <div>
          <label htmlFor={`job-request-email-${mode}`} className="mb-2 block text-sm font-medium text-[#F5F5DC]">{copy.form.email}</label>
          <input
            id={`job-request-email-${mode}`}
            type="email"
            value={formData.email}
            onChange={(event) => setFormData(previous => ({ ...previous, email: event.target.value }))}
            className="w-full rounded-lg border border-[#D4AF37] bg-[#2A1525] px-4 py-3 text-[#F5F5DC] placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]"
            placeholder={copy.form.emailPlaceholder}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`job-request-message-${mode}`} className="mb-2 block text-sm font-medium text-[#F5F5DC]">{copy.form.message}</label>
        <textarea
          id={`job-request-message-${mode}`}
          rows={5}
          value={formData.message}
          onChange={(event) => setFormData(previous => ({ ...previous, message: event.target.value }))}
          className="w-full rounded-lg border border-[#D4AF37] bg-[#2A1525] px-4 py-3 text-[#F5F5DC] placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]"
          placeholder={isEmployer ? copy.form.employerMessagePlaceholder : copy.form.candidateMessagePlaceholder}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#D4AF37] bg-white px-6 py-3 font-semibold text-[#4A1D43] transition-all hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#4A1D43] border-t-transparent" aria-hidden="true" />}
        {isEmployer ? copy.form.employerSubmit : copy.form.candidateSubmit}
      </button>
    </form>
  );
}
