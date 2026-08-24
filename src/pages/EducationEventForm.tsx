import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mail, Phone, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/BoltDatabase';
import { notifyAdmin } from '../lib/notifyAdmin';

const copy = {
  fr: { title: 'Demande d’information / inscription', intro: 'Une question, un événement ou une demande professionnelle ? Envoyez-nous votre demande et notre équipe vous contactera rapidement.', requestTitle: 'Titre de votre demande *', titlePlaceholder: 'Ex : Organisation d’un événement scolaire, partenariat, sortie éducative...', phone: 'Téléphone', email: 'Email', emailPlaceholder: 'votre.email@exemple.com', description: 'Description de votre demande *', descriptionPlaceholder: 'Décrivez votre événement, votre besoin, votre question ou votre demande...', contactHint: 'Merci d’indiquer au moins un moyen de contact : téléphone ou email.', successTitle: 'Demande envoyée avec succès !', successText: 'Notre équipe vous contactera rapidement.', errorTitle: 'Une erreur est survenue', errorText: 'Vérifiez les informations puis réessayez.', sending: 'Envoi en cours...', submit: 'Envoyer ma demande' },
  en: { title: 'Information / registration request', intro: 'A question, an event, or a professional request? Send us your request and our team will contact you shortly.', requestTitle: 'Request title *', titlePlaceholder: 'E.g. school event organization, partnership, educational outing...', phone: 'Phone', email: 'Email', emailPlaceholder: 'your.email@example.com', description: 'Request description *', descriptionPlaceholder: 'Describe your event, need, question, or request...', contactHint: 'Please provide at least one contact method: phone or email.', successTitle: 'Request sent successfully!', successText: 'Our team will contact you shortly.', errorTitle: 'An error occurred', errorText: 'Check the information and try again.', sending: 'Sending...', submit: 'Send my request' },
  ar: { title: 'طلب معلومات / تسجيل', intro: 'لديك سؤال أو فعالية أو طلب مهني؟ أرسل طلبك وسيتواصل معك فريقنا قريباً.', requestTitle: 'عنوان الطلب *', titlePlaceholder: 'مثال: تنظيم فعالية مدرسية، شراكة، خرجة تعليمية...', phone: 'الهاتف', email: 'البريد الإلكتروني', emailPlaceholder: 'your.email@example.com', description: 'وصف الطلب *', descriptionPlaceholder: 'صف فعاليتك أو حاجتك أو سؤالك أو طلبك...', contactHint: 'يرجى توفير وسيلة اتصال واحدة على الأقل: الهاتف أو البريد الإلكتروني.', successTitle: 'تم إرسال الطلب بنجاح!', successText: 'سيتواصل معك فريقنا قريباً.', errorTitle: 'حدث خطأ', errorText: 'تحقق من المعلومات ثم أعد المحاولة.', sending: 'جارٍ الإرسال...', submit: 'إرسال طلبي' },
  it: { title: 'Richiesta di informazioni / iscrizione', intro: 'Hai una domanda, un evento o una richiesta professionale? Inviaci la tua richiesta e il nostro team ti contatterà rapidamente.', requestTitle: 'Titolo della richiesta *', titlePlaceholder: 'Es.: organizzazione di un evento scolastico, partnership, uscita didattica...', phone: 'Telefono', email: 'Email', emailPlaceholder: 'tua.email@esempio.com', description: 'Descrizione della richiesta *', descriptionPlaceholder: 'Descrivi il tuo evento, la tua esigenza, domanda o richiesta...', contactHint: 'Indica almeno un mezzo di contatto: telefono o email.', successTitle: 'Richiesta inviata con successo!', successText: 'Il nostro team ti contatterà rapidamente.', errorTitle: 'Si è verificato un errore', errorText: 'Controlla le informazioni e riprova.', sending: 'Invio in corso...', submit: 'Invia la mia richiesta' },
  ru: { title: 'Запрос информации / регистрация', intro: 'Есть вопрос, мероприятие или деловой запрос? Отправьте заявку, и наша команда свяжется с вами в ближайшее время.', requestTitle: 'Заголовок запроса *', titlePlaceholder: 'Например: организация школьного мероприятия, партнерство, учебная поездка...', phone: 'Телефон', email: 'Email', emailPlaceholder: 'your.email@example.com', description: 'Описание запроса *', descriptionPlaceholder: 'Опишите мероприятие, потребность, вопрос или запрос...', contactHint: 'Укажите хотя бы один способ связи: телефон или email.', successTitle: 'Запрос успешно отправлен!', successText: 'Наша команда скоро свяжется с вами.', errorTitle: 'Произошла ошибка', errorText: 'Проверьте данные и попробуйте снова.', sending: 'Отправка...', submit: 'Отправить запрос' },
};

export const EducationEventForm = () => {
  const { language } = useLanguage();
  const t = copy[language] || copy.fr;
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({ title: '', phone: '', email: '', message: '' });

  const validateForm = () => {
    if (!formData.title.trim()) { setSubmitError(true); return false; }
    if (!formData.phone.trim() && !formData.email.trim()) { setSubmitError(true); return false; }
    if (!formData.message.trim()) { setSubmitError(true); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(false);
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const payload = {
        nom_entreprise: formData.title,
        secteur: 'Événement / Éducation / Loisirs',
        ville: null,
        contact_suggere: `${formData.phone}${formData.phone && formData.email ? ' - ' : ''}${formData.email}`,
        raison_suggestion: formData.message,
        submission_lang: 'fr',
      };

      const { error } = await supabase.from('suggestions_entreprises').insert([payload]);
      if (error) {
        console.warn('⚠️ Cannot submit request:', error.message);
        setSubmitError(true);
        setSubmitting(false);
        return;
      }

      notifyAdmin('Nouvelle demande evenement / education', {
        Titre: formData.title,
        Telephone: formData.phone,
        Email: formData.email,
        Message: formData.message,
      });

      setSubmitSuccess(true);
      setFormData({ title: '', phone: '', email: '', message: '' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting request:', err);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-light text-gray-900 mb-3">{t.title}</h1>
            <p className="text-gray-600">{t.intro}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.requestTitle}</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t.titlePlaceholder} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.phone}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="+216 XX XXX XXX" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder={t.emailPlaceholder} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.description}</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                <textarea required rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder={t.descriptionPlaceholder} />
              </div>
            </div>

            <p className="text-xs text-gray-500">{t.contactHint}</p>

            {submitSuccess && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div><p className="font-medium">{t.successTitle}</p><p className="text-sm mt-1">{t.successText}</p></div>
              </motion.div>
            )}

            {submitError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div><p className="font-medium">{t.errorTitle}</p><p className="text-sm mt-1">{t.errorText}</p></div>
              </motion.div>
            )}

            <button type="submit" disabled={submitting} className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? <span className="inline-flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />{t.sending}</span> : t.submit}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EducationEventForm;