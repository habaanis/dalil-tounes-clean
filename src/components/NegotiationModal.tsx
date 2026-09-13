import { useState } from 'react';
import { X, DollarSign, Loader2 } from 'lucide-react';
import { supabase } from '../lib/BoltDatabase';
import { useLanguage } from '../context/LanguageContext';

interface NegotiationModalProps {
  announcementId: string;
  currentPrice: number;
  onClose: () => void;
}

const copy = {
  fr: {
    title: 'Faire une offre',
    currentPrice: 'Prix actuel',
    yourOffer: 'Votre offre (TND) *',
    offerPlaceholder: 'Entrez votre prix',
    suggestions: 'Suggestions:',
    messageLabel: 'Message (optionnel)',
    messagePlaceholder: 'Expliquez votre offre (état de l'objet souhaité, modalités de paiement...)',
    nameLabel: 'Votre nom *',
    phoneLabel: 'Téléphone *',
    phonePlaceholder: '+216',
    emailLabel: 'Email (optionnel)',
    cancel: 'Annuler',
    sending: 'Envoi...',
    submit: 'Envoyer l'offre',
    successTitle: 'Offre envoyée !',
    successText: 'Le vendeur a reçu votre proposition et vous contactera bientôt.',
    errorRequired: 'Veuillez remplir tous les champs obligatoires',
    errorInvalidPrice: 'Veuillez entrer un prix valide',
    errorOccurred: 'Une erreur est survenue. Veuillez réessayer.',
  },
  en: {
    title: 'Make an offer',
    currentPrice: 'Current price',
    yourOffer: 'Your offer (TND) *',
    offerPlaceholder: 'Enter your price',
    suggestions: 'Suggestions:',
    messageLabel: 'Message (optional)',
    messagePlaceholder: 'Explain your offer (item condition, payment method...)',
    nameLabel: 'Your name *',
    phoneLabel: 'Phone *',
    phonePlaceholder: '+216',
    emailLabel: 'Email (optional)',
    cancel: 'Cancel',
    sending: 'Sending...',
    submit: 'Send offer',
    successTitle: 'Offer sent!',
    successText: 'The seller has received your proposal and will contact you soon.',
    errorRequired: 'Please fill in all required fields',
    errorInvalidPrice: 'Please enter a valid price',
    errorOccurred: 'An error occurred. Please try again.',
  },
  ar: {
    title: 'تقديم عرض',
    currentPrice: 'السعر الحالي',
    yourOffer: 'عرضك (دينار) *',
    offerPlaceholder: 'أدخل سعرك',
    suggestions: 'اقتراحات:',
    messageLabel: 'رسالة (اختياري)',
    messagePlaceholder: 'اشرح عرضك (حالة المنتج، طريقة الدفع...)',
    nameLabel: 'اسمك *',
    phoneLabel: 'الهاتف *',
    phonePlaceholder: '+216',
    emailLabel: 'البريد الإلكتروني (اختياري)',
    cancel: 'إلغاء',
    sending: 'جاري الإرسال...',
    submit: 'إرسال العرض',
    successTitle: 'تم إرسال العرض!',
    successText: 'استلم البائع عرضك وسيتواصل معك قريباً.',
    errorRequired: 'يرجى ملء جميع الحقول المطلوبة',
    errorInvalidPrice: 'يرجى إدخال سعر صالح',
    errorOccurred: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
  },
  it: {
    title: 'Fai un'offerta',
    currentPrice: 'Prezzo attuale',
    yourOffer: 'La tua offerta (TND) *',
    offerPlaceholder: 'Inserisci il tuo prezzo',
    suggestions: 'Suggerimenti:',
    messageLabel: 'Messaggio (opzionale)',
    messagePlaceholder: 'Spiega la tua offerta (condizioni dell'oggetto, metodo di pagamento...)',
    nameLabel: 'Il tuo nome *',
    phoneLabel: 'Telefono *',
    phonePlaceholder: '+216',
    emailLabel: 'Email (opzionale)',
    cancel: 'Annulla',
    sending: 'Invio...',
    submit: 'Invia offerta',
    successTitle: 'Offerta inviata!',
    successText: 'Il venditore ha ricevuto la tua proposta e ti contatterà presto.',
    errorRequired: 'Compila tutti i campi obbligatori',
    errorInvalidPrice: 'Inserisci un prezzo valido',
    errorOccurred: 'Si è verificato un errore. Riprova.',
  },
  ru: {
    title: 'Сделать предложение',
    currentPrice: 'Текущая цена',
    yourOffer: 'Ваше предложение (ТНД) *',
    offerPlaceholder: 'Введите цену',
    suggestions: 'Предложения:',
    messageLabel: 'Сообщение (необязательно)',
    messagePlaceholder: 'Объясните ваше предложение (состояние товара, способ оплаты...)',
    nameLabel: 'Ваше имя *',
    phoneLabel: 'Телефон *',
    phonePlaceholder: '+216',
    emailLabel: 'Email (необязательно)',
    cancel: 'Отмена',
    sending: 'Отправка...',
    submit: 'Отправить предложение',
    successTitle: 'Предложение отправлено!',
    successText: 'Продавец получил ваше предложение и скоро свяжется с вами.',
    errorRequired: 'Пожалуйста, заполните все обязательные поля',
    errorInvalidPrice: 'Пожалуйста, введите действительную цену',
    errorOccurred: 'Произошла ошибка. Попробуйте снова.',
  },
};

type Lang = keyof typeof copy;

export default function NegotiationModal({ announcementId, currentPrice, onClose }: NegotiationModalProps) {
  const { language } = useLanguage();
  const t = copy[language as Lang] || copy.fr;
  const isRTL = language === 'ar';

  const [formData, setFormData] = useState({
    prix_propose: '',
    message: '',
    offrant_nom: '',
    offrant_tel: '',
    offrant_email: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.prix_propose || !formData.offrant_nom || !formData.offrant_tel) {
      setError(t.errorRequired);
      return;
    }

    const proposedPrice = parseFloat(formData.prix_propose);
    if (isNaN(proposedPrice) || proposedPrice <= 0) {
      setError(t.errorInvalidPrice);
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('offres')
        .insert([{
          annonce_id: announcementId,
          amount: proposedPrice,
          message: formData.message,
          buyer_id: null,
        }]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Erreur envoi offre:', err);
      setError(t.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrices = [
    Math.round(currentPrice * 0.7),
    Math.round(currentPrice * 0.8),
    Math.round(currentPrice * 0.9)
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{t.title}</h2>
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

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">{t.currentPrice}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {currentPrice.toLocaleString('fr-FR')} <span className="text-lg">TND</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.yourOffer}
                </label>
                <div className="relative">
                  <DollarSign className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                  <input
                    type="number"
                    step="0.001"
                    value={formData.prix_propose}
                    onChange={(e) => setFormData({ ...formData, prix_propose: e.target.value })}
                    className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-xl border-2 border-gray-200 focus:border-[#D62828] focus:ring-4 focus:ring-orange-100 outline-none transition-all`}
                    placeholder={t.offerPlaceholder}
                    required
                  />
                </div>

                <div className="flex gap-2 mt-3">
                  <p className="text-xs text-gray-500 mt-1">{t.suggestions}</p>
                  {suggestedPrices.map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => setFormData({ ...formData, prix_propose: price.toString() })}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      {price.toLocaleString()} TND
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.messageLabel}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D62828] focus:ring-4 focus:ring-orange-100 outline-none transition-all resize-none"
                  placeholder={t.messagePlaceholder}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={formData.offrant_nom}
                    onChange={(e) => setFormData({ ...formData, offrant_nom: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D62828] focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={formData.offrant_tel}
                    onChange={(e) => setFormData({ ...formData, offrant_tel: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D62828] focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                    placeholder={t.phonePlaceholder}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  value={formData.offrant_email}
                  onChange={(e) => setFormData({ ...formData, offrant_email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#D62828] focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                />
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
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D62828] to-[#b91c1c] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.sending}
                    </>
                  ) : (
                    t.submit
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
