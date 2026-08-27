import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/BoltDatabase';
import { Toast } from './Toast';
import { useFormTranslation } from '../hooks/useFormTranslation';
import { notifyAdmin } from '../lib/notifyAdmin';

interface LeisureEventProposalFormProps {
  onClose: () => void;
}

const formCopy = {
  fr: { title: 'Proposer un événement', subtitle: 'Partagez votre événement avec la communauté', intro: 'Vous connaissez un événement à ne pas manquer ? Partagez-le avec la communauté !', who: 'Qui êtes-vous ?', organizer: 'Je suis organisateur de cet événement', phoneHint: 'Commencez par le code pays sans le + (ex. : 21621234567)', optional: 'optionnel', infoTitle: 'Information', info: 'Votre événement sera vérifié par notre équipe avant publication. Vous serez contacté par WhatsApp une fois validé.', close: 'Fermer', invalidDates: 'La date de fin doit être postérieure ou égale à la date de début.' },
  en: { title: 'Propose an event', subtitle: 'Share your event with the community', intro: 'Know an event not to be missed? Share it with the community!', who: 'Who are you?', organizer: 'I organize this event', phoneHint: 'Start with the country code without the + (e.g. 21621234567)', optional: 'optional', infoTitle: 'Information', info: 'Our team will verify your event before publication. We will contact you on WhatsApp once it is approved.', close: 'Close', invalidDates: 'The end date must be on or after the start date.' },
  it: { title: 'Proponi un evento', subtitle: 'Condividi il tuo evento con la comunità', intro: 'Conosci un evento da non perdere? Condividilo con la comunità!', who: 'Chi sei?', organizer: 'Sono l’organizzatore di questo evento', phoneHint: 'Inizia con il prefisso internazionale senza + (es. 21621234567)', optional: 'facoltativo', infoTitle: 'Informazione', info: 'Il nostro team verificherà il tuo evento prima della pubblicazione. Ti contatteremo su WhatsApp dopo l’approvazione.', close: 'Chiudi', invalidDates: 'La data di fine deve essere uguale o successiva alla data di inizio.' },
  ru: { title: 'Предложить мероприятие', subtitle: 'Поделитесь мероприятием с сообществом', intro: 'Знаете мероприятие, которое нельзя пропустить? Поделитесь им с сообществом!', who: 'Кто вы?', organizer: 'Я организатор этого мероприятия', phoneHint: 'Начните с кода страны без знака + (например, 21621234567)', optional: 'необязательно', infoTitle: 'Информация', info: 'Наша команда проверит мероприятие перед публикацией. После одобрения мы свяжемся с вами в WhatsApp.', close: 'Закрыть', invalidDates: 'Дата окончания должна совпадать с датой начала или быть позже.' },
  ar: { title: 'اقترح فعالية', subtitle: 'شارك فعاليتك مع المجتمع', intro: 'هل تعرف فعالية لا ينبغي تفويتها؟ شاركها مع المجتمع!', who: 'من أنت؟', organizer: 'أنا منظم هذه الفعالية', phoneHint: 'ابدأ برمز البلد دون علامة + (مثال: 21621234567)', optional: 'اختياري', infoTitle: 'معلومة', info: 'سيتحقق فريقنا من الفعالية قبل نشرها، وسنتواصل معك عبر واتساب بعد الموافقة عليها.', close: 'إغلاق', invalidDates: 'يجب أن يكون تاريخ النهاية مساوياً لتاريخ البداية أو بعده.' },
} as const;

const LeisureEventProposalForm: React.FC<LeisureEventProposalFormProps> = ({ onClose }) => {
  const { label, placeholder, button, message, submission_lang, language } = useFormTranslation();
  const copy = formCopy[language] || formCopy.fr;
  const today = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    prenom: '',
    nom_evenement: '',
    organisateur: '',
    ville: '',
    date_evenement: '',
    date_fin_evenement: '',
    prix_entree: '',
    lien_billetterie: '',
    description: '',
    whatsapp: '',
    email: '',
    est_organisateur: false,
  });

  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const tunisianCities = [
    'Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana', 'Gafsa',
    'Monastir', 'Ben Arous', 'Kasserine', 'Médenine', 'Nabeul', 'Tataouine',
    'Béja', 'Jendouba', 'Mahdia', 'Sidi Bouzid', 'Siliana', 'Kébili',
    'Le Kef', 'Tozeur', 'Manouba', 'Zaghouan'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.date_fin_evenement && formData.date_fin_evenement < formData.date_evenement) {
      setToastType('error');
      setToastMessage(copy.invalidDates);
      setShowToast(true);
      return;
    }
    setLoading(true);

    try {
      const cleanPhone = formData.whatsapp.replace(/\D/g, '');
      const phoneNumber = cleanPhone.startsWith('216') ? cleanPhone : `216${cleanPhone}`;

      const whatsappMessage = `Bonjour, je souhaite valider l'inscription de ${formData.prenom} pour ${formData.nom_evenement}`;
      const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      const inscriptionData = {
        nom_et_prenom: formData.prenom,
        titre_nom_evenement: formData.nom_evenement,
        organisateur: formData.organisateur,
        ville: formData.ville,
        date_debut: formData.date_evenement || null,
        date_fin: formData.date_fin_evenement || null,
        date_prevue: formData.date_evenement || null,
        prix: formData.prix_entree || null,
        lien_billetterie: formData.lien_billetterie || null,
        description: formData.description,
        whatsapp: formData.whatsapp,
        email: formData.email || null,
        type_affichage: null,
        statut_whalesync: 'Nouveau',
        lien_contact_whatsapp: whatsappLink,
        submission_lang: submission_lang,
      };

      const { error } = await supabase
        .from('inscriptions_loisirs')
        .insert([inscriptionData]);

      if (error) throw error;

      setToastType('success');
      setToastMessage(message('succes'));
      setShowToast(true);

      notifyAdmin('Nouvelle proposition evenement loisir', {
        Nom: formData.prenom,
        Evenement: formData.nom_evenement,
        Organisateur: formData.organisateur,
        Ville: formData.ville,
        Date: formData.date_evenement,
        Prix: formData.prix_entree || 'Non precise',
        WhatsApp: formData.whatsapp,
        Email: formData.email || 'Non precise',
      }, '/admin/inscriptions-loisirs');

      setTimeout(() => {
        setFormData({
          prenom: '',
          nom_evenement: '',
          organisateur: '',
          ville: '',
          date_evenement: '',
          date_fin_evenement: '',
          prix_entree: '',
          lien_billetterie: '',
          description: '',
          whatsapp: '',
          email: '',
          est_organisateur: false,
        });
        onClose();
      }, 2500);
    } catch (error: unknown) {
      console.error('Erreur lors de la soumission:', error);
      console.error('Détails de l\'erreur:', JSON.stringify(error, null, 2));

      const formError = error as { message?: string; error_description?: string; details?: string; hint?: string };
      const errorMessage = formError.message || formError.error_description || message('erreur');
      const errorDetails = formError.details || '';
      const errorHint = formError.hint || '';

      const fullErrorMessage = `Erreur: ${errorMessage}${errorDetails ? ` - ${errorDetails}` : ''}${errorHint ? ` (${errorHint})` : ''}`;

      setToastType('error');
      setToastMessage(fullErrorMessage);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-[#F8F9FA] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ border: '2px solid #D4AF37' }}>
          <div className="sticky top-0 bg-gradient-to-r from-[#4A1D43] via-[#6B2A5C] to-[#4A1D43] p-6 flex items-center justify-between rounded-t-3xl">
            <div>
              <h2 className="text-2xl font-bold text-white">{copy.title}</h2>
              <p className="text-sm text-gray-200 mt-1">{copy.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              aria-label={copy.close}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="bg-[#F8F9FA] p-4 mb-6 rounded-xl" style={{ borderLeft: '4px solid #D4AF37' }}>
              <p className="text-sm font-medium text-[#4A1D43]">
                {copy.intro}
              </p>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 space-y-4">
              <h3 className="text-lg font-bold text-gray-800">
                {copy.who}
              </h3>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="est_organisateur"
                  checked={formData.est_organisateur}
                  onChange={(e) => setFormData(prev => ({ ...prev, est_organisateur: e.target.checked }))}
                  className="w-5 h-5 text-[#D4AF37]500 rounded focus:ring-2 focus:ring-[#D4AF37]/20500"
                />
                <label htmlFor="est_organisateur" className="text-sm font-medium text-gray-700 cursor-pointer">
                  {copy.organizer}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {label('prenom')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="prenom"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#D4AF37] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 outline-none transition-all"
                  placeholder={placeholder('prenom')}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {label('whatsapp')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#D4AF37] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 outline-none transition-all"
                  placeholder={placeholder('whatsapp')}
                />
                <p className="text-xs text-gray-500 italic flex items-center gap-1">
                  <span>💡</span>
                  {copy.phoneHint}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {label('email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#D4AF37] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 outline-none transition-all"
                placeholder={placeholder('email')}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {label('nom_evenement')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom_evenement"
                required
                value={formData.nom_evenement}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#D4AF37] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 outline-none transition-all"
                placeholder={placeholder('nom_evenement')}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {label('organisateur')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="organisateur"
                required
                value={formData.organisateur}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#D4AF37] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 outline-none transition-all"
                placeholder={placeholder('organisateur')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {label('ville')} <span className="text-red-500">*</span>
                </label>
                <select
                  name="ville"
                  required
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#D4AF37] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 outline-none transition-all bg-white"
                >
                  <option value="">{placeholder('ville')}</option>
                  {tunisianCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {label('date_debut')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date_evenement"
                  required
                  min={today}
                  value={formData.date_evenement}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#D4AF37] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {label('date_fin')}
              </label>
              <input
                type="date"
                name="date_fin_evenement"
                value={formData.date_fin_evenement}
                onChange={handleChange}
                min={formData.date_evenement || today}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#D4AF37] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 outline-none transition-all"
                placeholder={placeholder('date_fin')}
              />
            </div>

            <div className="space-y-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {label('prix_entree')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="prix_entree"
                  required
                  value={formData.prix_entree}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#D4AF37] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 outline-none transition-all"
                  placeholder={placeholder('prix_entree')}
                />
              </div>

            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {label('lien_billetterie')} <span className="text-gray-500 text-xs">({copy.optional})</span>
              </label>
              <input
                type="url"
                name="lien_billetterie"
                value={formData.lien_billetterie}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#D4AF37] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 outline-none transition-all"
                placeholder={placeholder('lien_billetterie')}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {label('description')} <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#D4AF37] focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 outline-none transition-all resize-none"
                placeholder={placeholder('description')}
              />
            </div>

            <div className="bg-[#F8F9FA] rounded-xl p-4" style={{ border: '1px solid #D4AF37' }}>
              <p className="text-sm text-[#4A1D43] flex items-start gap-2">
                <span className="text-lg">ℹ️</span>
                <span><strong>{copy.infoTitle}:</strong> {copy.info}</span>
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                {button('annuler')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#4A1D43] to-[#6B2A5C] text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ border: '1px solid #D4AF37' }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {button('envoyer')}...
                  </>
                ) : (
                  <>
                    {button('soumettre')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default LeisureEventProposalForm;
