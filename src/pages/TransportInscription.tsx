import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/BoltDatabase';
import { notifyAdmin } from '../lib/notifyAdmin';
import {
  Ambulance,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  MessageSquare,
} from 'lucide-react';

interface FormData {
  title: string;
  email: string;
  phone: string;
  message: string;
}

const copy = {
  fr: {
    requiredTitle: 'Le titre de votre demande est obligatoire', requiredContact: 'Veuillez indiquer au moins un téléphone ou un email', invalidEmail: 'Veuillez entrer une adresse email valide', requiredMessage: 'Merci de décrire brièvement votre demande', sendError: 'Une erreur est survenue lors de l’envoi. Veuillez réessayer.', unexpectedError: 'Une erreur inattendue est survenue. Veuillez réessayer.', successTitle: 'Demande envoyée !', successText: 'Merci, votre demande a bien été transmise à notre équipe.', successHint: 'Nous vous contacterons rapidement pour finaliser les informations nécessaires.', newRequest: 'Nouvelle demande', title: 'Demande d’information / inscription', intro: 'Une question, une inscription ou une demande professionnelle ? Envoyez-nous votre demande, notre équipe vous contactera rapidement.', contactTitle: 'Vos coordonnées', requestTitle: 'Titre de votre demande', titlePlaceholder: "Ex : Inscription transport médical, demande d'information, partenariat...", phone: 'Téléphone', email: 'Email', emailPlaceholder: 'votre.email@exemple.com', contactHint: 'Indiquez au moins un moyen de contact : téléphone ou email.', descriptionTitle: 'Description de votre demande', message: 'Votre message', messagePlaceholder: 'Décrivez votre demande, votre activité, votre besoin ou votre question...', sending: 'Envoi en cours...', submit: 'Envoyer ma demande', footer: 'Votre demande sera examinée par l’équipe Dalil Tounes. Nous vous contacterons rapidement.'
  },
  en: {
    requiredTitle: 'The request title is required', requiredContact: 'Please provide at least a phone number or email', invalidEmail: 'Please enter a valid email address', requiredMessage: 'Please briefly describe your request', sendError: 'An error occurred while sending. Please try again.', unexpectedError: 'An unexpected error occurred. Please try again.', successTitle: 'Request sent!', successText: 'Thank you, your request has been sent to our team.', successHint: 'We will contact you shortly to finalize the necessary information.', newRequest: 'New request', title: 'Information / registration request', intro: 'A question, registration, or professional request? Send us your request and our team will contact you shortly.', contactTitle: 'Your contact details', requestTitle: 'Request title', titlePlaceholder: 'E.g. medical transport registration, information request, partnership...', phone: 'Phone', email: 'Email', emailPlaceholder: 'your.email@example.com', contactHint: 'Provide at least one contact method: phone or email.', descriptionTitle: 'Request description', message: 'Your message', messagePlaceholder: 'Describe your request, activity, need, or question...', sending: 'Sending...', submit: 'Send my request', footer: 'Your request will be reviewed by the Dalil Tounes team. We will contact you shortly.'
  },
  ar: {
    requiredTitle: 'عنوان الطلب مطلوب', requiredContact: 'يرجى إدخال رقم هاتف أو بريد إلكتروني على الأقل', invalidEmail: 'يرجى إدخال بريد إلكتروني صالح', requiredMessage: 'يرجى وصف طلبك باختصار', sendError: 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.', unexpectedError: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.', successTitle: 'تم إرسال الطلب!', successText: 'شكراً، تم إرسال طلبك إلى فريقنا.', successHint: 'سنتواصل معك قريباً لاستكمال المعلومات اللازمة.', newRequest: 'طلب جديد', title: 'طلب معلومات / تسجيل', intro: 'لديك سؤال أو تسجيل أو طلب مهني؟ أرسل طلبك وسيتواصل معك فريقنا قريباً.', contactTitle: 'بيانات الاتصال', requestTitle: 'عنوان الطلب', titlePlaceholder: 'مثال: تسجيل نقل طبي، طلب معلومات، شراكة...', phone: 'الهاتف', email: 'البريد الإلكتروني', emailPlaceholder: 'your.email@example.com', contactHint: 'أدخل وسيلة اتصال واحدة على الأقل: الهاتف أو البريد الإلكتروني.', descriptionTitle: 'وصف الطلب', message: 'رسالتك', messagePlaceholder: 'صف طلبك أو نشاطك أو حاجتك أو سؤالك...', sending: 'جارٍ الإرسال...', submit: 'إرسال طلبي', footer: 'سيتم مراجعة طلبك من طرف فريق دليل تونس وسنتواصل معك قريباً.'
  },
  it: {
    requiredTitle: 'Il titolo della richiesta è obbligatorio', requiredContact: 'Indica almeno un numero di telefono o un’email', invalidEmail: 'Inserisci un indirizzo email valido', requiredMessage: 'Descrivi brevemente la tua richiesta', sendError: 'Si è verificato un errore durante l’invio. Riprova.', unexpectedError: 'Si è verificato un errore imprevisto. Riprova.', successTitle: 'Richiesta inviata!', successText: 'Grazie, la tua richiesta è stata inviata al nostro team.', successHint: 'Ti contatteremo rapidamente per completare le informazioni necessarie.', newRequest: 'Nuova richiesta', title: 'Richiesta di informazioni / iscrizione', intro: 'Hai una domanda, un’iscrizione o una richiesta professionale? Inviaci la tua richiesta e il nostro team ti contatterà rapidamente.', contactTitle: 'I tuoi contatti', requestTitle: 'Titolo della richiesta', titlePlaceholder: 'Es.: iscrizione trasporto medico, richiesta di informazioni, partnership...', phone: 'Telefono', email: 'Email', emailPlaceholder: 'tua.email@esempio.com', contactHint: 'Indica almeno un mezzo di contatto: telefono o email.', descriptionTitle: 'Descrizione della richiesta', message: 'Il tuo messaggio', messagePlaceholder: 'Descrivi la tua richiesta, attività, esigenza o domanda...', sending: 'Invio in corso...', submit: 'Invia la mia richiesta', footer: 'La tua richiesta sarà esaminata dal team Dalil Tounes. Ti contatteremo rapidamente.'
  },
  ru: {
    requiredTitle: 'Укажите заголовок запроса', requiredContact: 'Укажите хотя бы телефон или email', invalidEmail: 'Введите корректный email', requiredMessage: 'Кратко опишите ваш запрос', sendError: 'При отправке произошла ошибка. Попробуйте снова.', unexpectedError: 'Произошла непредвиденная ошибка. Попробуйте снова.', successTitle: 'Запрос отправлен!', successText: 'Спасибо, ваш запрос отправлен нашей команде.', successHint: 'Мы скоро свяжемся с вами для уточнения необходимых данных.', newRequest: 'Новый запрос', title: 'Запрос информации / регистрация', intro: 'Есть вопрос, регистрация или деловой запрос? Отправьте заявку, и наша команда скоро свяжется с вами.', contactTitle: 'Контактные данные', requestTitle: 'Заголовок запроса', titlePlaceholder: 'Например: регистрация медицинского транспорта, запрос информации, партнерство...', phone: 'Телефон', email: 'Email', emailPlaceholder: 'your.email@example.com', contactHint: 'Укажите хотя бы один способ связи: телефон или email.', descriptionTitle: 'Описание запроса', message: 'Ваше сообщение', messagePlaceholder: 'Опишите ваш запрос, деятельность, потребность или вопрос...', sending: 'Отправка...', submit: 'Отправить запрос', footer: 'Ваш запрос будет рассмотрен командой Dalil Tounes. Мы скоро свяжемся с вами.'
  },
};

export default function TransportInscription() {
  const { language } = useLanguage();
  const t = copy[language] || copy.fr;
  const [form, setForm] = useState<FormData>({ title: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!form.title.trim()) { setErrorMsg(t.requiredTitle); return false; }
    if (!form.phone.trim() && !form.email.trim()) { setErrorMsg(t.requiredContact); return false; }
    if (form.email.trim() && !form.email.includes('@')) { setErrorMsg(t.invalidEmail); return false; }
    if (!form.message.trim()) { setErrorMsg(t.requiredMessage); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccess(false);
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const payload = {
        nom_entreprise: form.title.trim(),
        secteur: 'Transport médical / demande d’information',
        ville: null,
        contact_suggere: `${form.phone.trim() || ''}${form.phone.trim() && form.email.trim() ? ' - ' : ''}${form.email.trim() || ''}`.trim(),
        raison_suggestion: `Demande d’information / inscription\n\n${form.message.trim()}`,
        submission_lang: 'fr',
      };

      const { error } = await supabase.from('suggestions_entreprises').insert([payload]);
      if (error) {
        console.error('Supabase error:', error);
        setErrorMsg(t.sendError);
      } else {
        setSuccess(true);
        notifyAdmin('Nouvelle demande transport médical', {
          Titre: form.title,
          Email: form.email || 'Non renseigné',
          Telephone: form.phone || 'Non renseigné',
          Message: form.message,
        });
        setForm({ title: '', email: '', phone: '', message: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg(t.unexpectedError);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 py-16 px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto">
          <div className="bg-white border border-green-200 rounded-3xl p-8 md:p-12 shadow-xl text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">{t.successTitle}</h1>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
              <p className="text-gray-700 leading-relaxed mb-4">{t.successText}</p>
              <p className="text-sm text-gray-600">{t.successHint}</p>
            </div>
            <button onClick={() => setSuccess(false)} className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              <Ambulance className="w-5 h-5" />
              {t.newRequest}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-12 px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6"><Ambulance className="w-8 h-8 text-red-600" /></div>
          <h1 className="text-3xl md:text-5xl font-light text-gray-900 mb-4">{t.title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.intro}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2"><Mail className="w-5 h-5 text-red-600" />{t.contactTitle}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.requestTitle} <span className="text-red-600">*</span></label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" name="title" value={form.title} onChange={handleChange} placeholder={t.titlePlaceholder} className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.phone}</label>
                  <div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+216 XX XXX XXX" className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
                  <div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" name="email" value={form.email} onChange={handleChange} placeholder={t.emailPlaceholder} className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" /></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">{t.contactHint}</p>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-red-600" />{t.descriptionTitle}</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.message} <span className="text-red-600">*</span></label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={6} placeholder={t.messagePlaceholder} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none" required />
              </div>
            </div>

            {errorMsg && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"><AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-red-800">{errorMsg}</p></motion.div>}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button type="submit" disabled={submitting} className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                {submitting ? <><Loader2 className="w-5 h-5 animate-spin" />{t.sending}</> : <><Ambulance className="w-5 h-5" />{t.submit}</>}
              </button>
            </div>
            <p className="text-xs text-center text-gray-500">{t.footer}</p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
