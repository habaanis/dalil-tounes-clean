import { useState } from 'react';
import { X, Flag, Loader2 } from 'lucide-react';
import { supabase } from '../lib/BoltDatabase';
import { useLanguage } from '../context/LanguageContext';

interface ReportModalProps {
  announcementId: string;
  onClose: () => void;
}

const copy = {
  fr: {
    title: 'Signaler cette annonce',
    warningTitle: '⚠️ Attention',
    warningText: 'Les faux signalements peuvent entraîner des sanctions. Veuillez signaler uniquement les annonces qui violent nos règles.',
    motifLabel: 'Motif du signalement *',
    descriptionLabel: 'Description détaillée (optionnel)',
    descriptionPlaceholder: 'Donnez plus de détails sur le problème...',
    emailLabel: 'Votre email (optionnel)',
    emailPlaceholder: 'Pour vous tenir informé',
    emailHint: 'Facultatif. Nous pourrons vous contacter si nécessaire.',
    selectMotifError: 'Veuillez sélectionner un motif',
    successTitle: 'Signalement envoyé !',
    successText: 'Merci pour votre contribution. Nous allons examiner cette annonce rapidement.',
    cancel: 'Annuler',
    sending: 'Envoi...',
    submit: 'Signaler',
    reasons: [
      { value: 'arnaque', label: '🚫 Arnaque / Fraude' },
      { value: 'contenu_illegal', label: '⚠️ Contenu illégal' },
      { value: 'fausse_annonce', label: '❌ Fausse annonce' },
      { value: 'prix_abusif', label: '💰 Prix abusif' },
      { value: 'contenu_inapproprie', label: '🔞 Contenu inapproprié' },
      { value: 'doublon', label: '📋 Annonce en doublon' },
      { value: 'autre', label: '❓ Autre raison' },
    ],
    errorOccurred: 'Une erreur est survenue. Veuillez réessayer.',
  },
  en: {
    title: 'Report this ad',
    warningTitle: '⚠️ Warning',
    warningText: 'False reports may result in penalties. Please report only ads that violate our rules.',
    motifLabel: 'Reason for reporting *',
    descriptionLabel: 'Detailed description (optional)',
    descriptionPlaceholder: 'Provide more details about the issue...',
    emailLabel: 'Your email (optional)',
    emailPlaceholder: 'To keep you informed',
    emailHint: 'Optional. We may contact you if needed.',
    selectMotifError: 'Please select a reason',
    successTitle: 'Report sent!',
    successText: 'Thank you for your contribution. We will review this ad shortly.',
    cancel: 'Cancel',
    sending: 'Sending...',
    submit: 'Report',
    reasons: [
      { value: 'arnaque', label: '🚫 Scam / Fraud' },
      { value: 'contenu_illegal', label: '⚠️ Illegal content' },
      { value: 'fausse_annonce', label: '❌ Fake ad' },
      { value: 'prix_abusif', label: '💰 Abusive price' },
      { value: 'contenu_inapproprie', label: '🔞 Inappropriate content' },
      { value: 'doublon', label: '📋 Duplicate ad' },
      { value: 'autre', label: '❓ Other reason' },
    ],
    errorOccurred: 'An error occurred. Please try again.',
  },
  ar: {
    title: 'الإبلاغ عن هذا الإعلان',
    warningTitle: '⚠️ تنبيه',
    warningText: 'قد يؤدي الإبلاغ الكاذب إلى عقوبات. يرجى الإبلاغ فقط عن الإعلانات التي تنتهك قواعدنا.',
    motifLabel: 'سبب الإبلاغ *',
    descriptionLabel: 'وصف تفصيلي (اختياري)',
    descriptionPlaceholder: 'قدم المزيد من التفاصيل حول المشكلة...',
    emailLabel: 'بريدك الإلكتروني (اختياري)',
    emailPlaceholder: 'لإبقائك على اطلاع',
    emailHint: 'اختياري. قد نتصل بك إذا لزم الأمر.',
    selectMotifError: 'يرجى اختيار سبب',
    successTitle: 'تم إرسال البلاغ!',
    successText: 'شكراً على مساهمتك. سنقوم بمراجعة هذا الإعلان قريباً.',
    cancel: 'إلغاء',
    sending: 'جاري الإرسال...',
    submit: 'إبلاغ',
    reasons: [
      { value: 'arnaque', label: '🚫 احتيال / غش' },
      { value: 'contenu_illegal', label: '⚠️ محتوى غير قانوني' },
      { value: 'fausse_annonce', label: '❌ إعلان كاذب' },
      { value: 'prix_abusif', label: '💰 سعر تعسفي' },
      { value: 'contenu_inapproprie', label: '🔞 محتوى غير لائق' },
      { value: 'doublon', label: '📋 إعلان مكرر' },
      { value: 'autre', label: '❓ سبب آخر' },
    ],
    errorOccurred: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
  },
  it: {
    title: 'Segnala questo annuncio',
    warningTitle: '⚠️ Attenzione',
    warningText: 'Le segnalazioni false possono comportare sanzioni. Segnala solo gli annunci che violano le nostre regole.',
    motifLabel: 'Motivo della segnalazione *',
    descriptionLabel: 'Descrizione dettagliata (opzionale)',
    descriptionPlaceholder: 'Fornisci maggiori dettagli sul problema...',
    emailLabel: 'La tua email (opzionale)',
    emailPlaceholder: 'Per tenerti informato',
    emailHint: 'Facoltativo. Potremo contattarti se necessario.',
    selectMotifError: 'Seleziona un motivo',
    successTitle: 'Segnalazione inviata!',
    successText: 'Grazie per il tuo contributo. Esamineremo questo annuncio a breve.',
    cancel: 'Annulla',
    sending: 'Invio...',
    submit: 'Segnala',
    reasons: [
      { value: 'arnaque', label: '🚫 Truffa / Frode' },
      { value: 'contenu_illegal', label: '⚠️ Contenuto illegale' },
      { value: 'fausse_annonce', label: '❌ Annuncio falso' },
      { value: 'prix_abusif', label: '💰 Prezzo abusivo' },
      { value: 'contenu_inapproprie', label: '🔞 Contenuto inappropriato' },
      { value: 'doublon', label: '📋 Annuncio duplicato' },
      { value: 'autre', label: '❓ Altro motivo' },
    ],
    errorOccurred: 'Si è verificato un errore. Riprova.',
  },
  ru: {
    title: 'Пожаловаться на это объявление',
    warningTitle: '⚠️ Внимание',
    warningText: 'Ложные жалобы могут привести к санкциям. Сообщайте только о объявлениях, нарушающих наши правила.',
    motifLabel: 'Причина жалобы *',
    descriptionLabel: 'Подробное описание (необязательно)',
    descriptionPlaceholder: 'Укажите подробности проблемы...',
    emailLabel: 'Ваш email (необязательно)',
    emailPlaceholder: 'Чтобы держать вас в курсе',
    emailHint: 'Необязательно. Мы можем связаться с вами при необходимости.',
    selectMotifError: 'Пожалуйста, выберите причину',
    successTitle: 'Жалоба отправлена!',
    successText: 'Спасибо за ваш вклад. Мы рассмотрим это объявление в ближайшее время.',
    cancel: 'Отмена',
    sending: 'Отправка...',
    submit: 'Пожаловаться',
    reasons: [
      { value: 'arnaque', label: '🚫 Мошенничество / Подделка' },
      { value: 'contenu_illegal', label: '⚠️ Незаконный контент' },
      { value: 'fausse_annonce', label: '❌ Ложное объявление' },
      { value: 'prix_abusif', label: '💰 Завышенная цена' },
      { value: 'contenu_inapproprie', label: '🔞 Неприемлемый контент' },
      { value: 'doublon', label: '📋 Дубликат объявления' },
      { value: 'autre', label: '❓ Другая причина' },
    ],
    errorOccurred: 'Произошла ошибка. Попробуйте снова.',
  },
};

type Lang = keyof typeof copy;

export default function ReportModal({ announcementId, onClose }: ReportModalProps) {
  const { language } = useLanguage();
  const t = copy[language as Lang] || copy.fr;
  const isRTL = language === 'ar';

  const [motif, setMotif] = useState('');
  const [description, setDescription] = useState('');
  const [signalePar, setSignalePar] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!motif) {
      setError(t.selectMotifError);
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('annonces_signales')
        .insert([{
          annonce_id: announcementId,
          motif: motif,
          description: description,
          signale_par: signalePar || 'Anonyme'
        }]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Erreur signalement:', err);
      setError(t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Flag className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.successTitle}</h3>
              <p className="text-gray-600">{t.successText}</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-2">{t.warningTitle}</p>
                <p className="text-sm text-gray-600">
                  {t.warningText}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t.motifLabel}
                </label>
                <div className="space-y-2">
                  {t.reasons.map((reason) => (
                    <label
                      key={reason.value}
                      className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#D62828] transition-all"
                    >
                      <input
                        type="radio"
                        name="motif"
                        value={reason.value}
                        checked={motif === reason.value}
                        onChange={(e) => setMotif(e.target.value)}
                        className="w-5 h-5 text-[#D62828] focus:ring-[#D62828]"
                      />
                      <span className="font-medium">{reason.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.descriptionLabel}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D62828] focus:ring-4 focus:ring-orange-100 outline-none transition-all resize-none"
                  placeholder={t.descriptionPlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  value={signalePar}
                  onChange={(e) => setSignalePar(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D62828] focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                  placeholder={t.emailPlaceholder}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {t.emailHint}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.sending}
                    </>
                  ) : (
                    <>
                      <Flag className="w-5 h-5" />
                      {t.submit}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
