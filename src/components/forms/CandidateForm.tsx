import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { notifyAdmin } from '../../lib/notifyAdmin';
import { useLanguage } from '../../context/LanguageContext';
import { useFormTranslation } from '../../hooks/useFormTranslation';
import { useRTL } from '../../lib/useRTL';

interface CandidateFormProps {
  userId: string;
  onSuccess?: () => void;
}

interface RequestFormData {
  titre: string;
  telephone: string;
  email: string;
  message: string;
}

const translations = {
  fr: {
    title: "Demande d'information / inscription",
    intro: "Remplissez cette demande rapide. Notre équipe vous contactera pour finaliser votre inscription ou répondre à vos questions.",
    labelTitle: 'Titre de votre demande',
    labelPhone: 'Téléphone',
    labelEmail: 'Email',
    labelMessage: 'Message',
    placeholderTitle: 'Ex : Candidat emploi, professeur privé, chauffeur privé...',
    placeholderPhone: 'Votre numéro de téléphone',
    placeholderEmail: 'Votre adresse email',
    placeholderMessage: 'Expliquez brièvement votre demande...',
    submit: 'Envoyer ma demande',
    sending: 'Envoi en cours...',
    errTitle: 'Le titre de votre demande est obligatoire.',
    errPhone: 'Le téléphone est obligatoire.',
    errEmail: "L'email est obligatoire.",
    errEmailFormat: "Format email invalide.",
    errGeneric: 'Une erreur est survenue. Veuillez réessayer.',
    success: 'Merci ! Votre demande a bien été envoyée. Notre équipe vous contactera rapidement.',
  },
  en: {
    title: 'Information request / registration',
    intro: 'Fill out this quick request. Our team will contact you to finalize your registration or answer your questions.',
    labelTitle: 'Your request title',
    labelPhone: 'Phone',
    labelEmail: 'Email',
    labelMessage: 'Message',
    placeholderTitle: 'E.g.: Job seeker, private tutor, private driver...',
    placeholderPhone: 'Your phone number',
    placeholderEmail: 'Your email address',
    placeholderMessage: 'Briefly explain your request...',
    submit: 'Send my request',
    sending: 'Sending...',
    errTitle: 'The title of your request is required.',
    errPhone: 'Phone is required.',
    errEmail: 'Email is required.',
    errEmailFormat: 'Invalid email format.',
    errGeneric: 'An error occurred. Please try again.',
    success: 'Thank you! Your request has been sent. Our team will contact you shortly.',
  },
  ar: {
    title: 'طلب معلومات / تسجيل',
    intro: 'املأ هذا الطلب السريع. سيتصل بك فريقنا لإنهاء تسجيلك أو الإجابة على أسئلتك.',
    labelTitle: 'عنوان طلبك',
    labelPhone: 'الهاتف',
    labelEmail: 'البريد الإلكتروني',
    labelMessage: 'رسالة',
    placeholderTitle: 'مثال: باحث عن عمل، معلم خاص، سائق خاص...',
    placeholderPhone: 'رقم هاتفك',
    placeholderEmail: 'عنوان بريدك الإلكتروني',
    placeholderMessage: 'اشرح طلبك باختصار...',
    submit: 'إرسال طلبي',
    sending: 'جارٍ الإرسال...',
    errTitle: 'عنوان طلبك إلزامي.',
    errPhone: 'الهاتف إلزامي.',
    errEmail: 'البريد الإلكتروني إلزامي.',
    errEmailFormat: 'صيغة البريد الإلكتروني غير صالحة.',
    errGeneric: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    success: 'شكراً! تم إرسال طلبك بنجاح. سيتصل بك فريقنا قريباً.',
  },
  it: {
    title: 'Richiesta di informazioni / iscrizione',
    intro: 'Compila questa rapida richiesta. Il nostro team ti contatterà per finalizzare la tua iscrizione o rispondere alle tue domande.',
    labelTitle: 'Titolo della tua richiesta',
    labelPhone: 'Telefono',
    labelEmail: 'Email',
    labelMessage: 'Messaggio',
    placeholderTitle: 'Es: Candidato lavoro, insegnante privato, autista privato...',
    placeholderPhone: 'Il tuo numero di telefono',
    placeholderEmail: 'Il tuo indirizzo email',
    placeholderMessage: 'Spiega brevemente la tua richiesta...',
    submit: 'Invia la mia richiesta',
    sending: 'Invio in corso...',
    errTitle: 'Il titolo della tua richiesta è obbligatorio.',
    errPhone: 'Il telefono è obbligatorio.',
    errEmail: "L'email è obbligatoria.",
    errEmailFormat: 'Formato email non valido.',
    errGeneric: 'Si è verificato un errore. Riprova.',
    success: 'Grazie! La tua richiesta è stata inviata. Il nostro team ti contatterà a breve.',
  },
  ru: {
    title: 'Запрос информации / регистрация',
    intro: 'Заполните эту быструю заявку. Наша команда свяжется с вами для завершения регистрации или ответа на ваши вопросы.',
    labelTitle: 'Название заявки',
    labelPhone: 'Телефон',
    labelEmail: 'Электронная почта',
    labelMessage: 'Сообщение',
    placeholderTitle: 'Напр.: Соискатель работы, частный репетитор, частный водитель...',
    placeholderPhone: 'Ваш номер телефона',
    placeholderEmail: 'Ваш адрес электронной почты',
    placeholderMessage: 'Кратко опишите вашу заявку...',
    submit: 'Отправить заявку',
    sending: 'Отправка...',
    errTitle: 'Укажите название заявки.',
    errPhone: 'Укажите телефон.',
    errEmail: 'Укажите электронную почту.',
    errEmailFormat: 'Неверный формат email.',
    errGeneric: 'Произошла ошибка. Попробуйте ещё раз.',
    success: 'Спасибо! Ваша заявка отправлена. Наша команда свяжется с вами в ближайшее время.',
  },
};

export default function CandidateForm({ userId, onSuccess }: CandidateFormProps) {
  const { language } = useLanguage();
  const { submission_lang } = useFormTranslation();
  const { isRTL } = useRTL();

  const t = translations[language as keyof typeof translations] || translations.fr;

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<RequestFormData>({
    titre: '',
    telephone: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (!formData.titre.trim()) {
        setMessage({ type: 'error', text: t.errTitle });
        setSaving(false);
        return;
      }

      if (!formData.telephone.trim()) {
        setMessage({ type: 'error', text: t.errPhone });
        setSaving(false);
        return;
      }

      if (!formData.email.trim()) {
        setMessage({ type: 'error', text: t.errEmail });
        setSaving(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setMessage({ type: 'error', text: t.errEmailFormat });
        setSaving(false);
        return;
      }

      const payload = {
        nom_complet: formData.titre.trim(),
        prenom: '',
        email: formData.email.trim(),
        telephone: formData.telephone.trim(),
        adresse: '',
        ville_residence: '',
        category: 'demande_information_inscription',
        diplome: '',
        competences: [],
        annees_experience: 0,
        languages: [],
        contrats_souhaites: [],
        visibility: 'private',
        cv_url: '',
        availability: formData.message.trim(),
        est_premium: false,
        created_by: userId,
        updated_at: new Date().toISOString(),
        submission_lang,
      };

      const { error } = await supabase.from('candidates').upsert(payload);

      if (error) {
        console.error('[CandidateForm] Supabase error:', error);
        setMessage({ type: 'error', text: t.errGeneric });
        return;
      }

      notifyAdmin('Nouvelle demande candidat', {
        Titre: payload.nom_complet,
        Telephone: payload.telephone,
        Email: payload.email,
        Message: payload.availability,
      }, '/candidats');

      setMessage({ type: 'success', text: t.success });

      setFormData({
        titre: '',
        telephone: '',
        email: '',
        message: '',
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('[CandidateForm] Unexpected error:', error);
      setMessage({ type: 'error', text: t.errGeneric });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-2">
        <h3 className="text-xl font-bold text-[#F5F5DC] mb-2">
          {t.title}
        </h3>
        <p className="text-sm text-[#E8D5C4] leading-relaxed">
          {t.intro}
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-900/30 border border-green-600 text-green-300'
              : 'bg-red-900/30 border border-red-600 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#F5F5DC] mb-2">
          {t.labelTitle} <span className="text-[#D4AF37]">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.titre}
          onChange={(e) => setFormData((prev) => ({ ...prev, titre: e.target.value }))}
          className="w-full px-4 py-2 bg-[#2A1525] text-[#F5F5DC] border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
          placeholder={t.placeholderTitle}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5DC] mb-2">
          {t.labelPhone} <span className="text-[#D4AF37]">*</span>
        </label>
        <input
          type="tel"
          required
          value={formData.telephone}
          onChange={(e) => setFormData((prev) => ({ ...prev, telephone: e.target.value }))}
          className="w-full px-4 py-2 bg-[#2A1525] text-[#F5F5DC] border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
          placeholder={t.placeholderPhone}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5DC] mb-2">
          {t.labelEmail} <span className="text-[#D4AF37]">*</span>
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-2 bg-[#2A1525] text-[#F5F5DC] border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
          placeholder={t.placeholderEmail}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5DC] mb-2">
          {t.labelMessage}
        </label>
        <textarea
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-2 bg-[#2A1525] text-[#F5F5DC] border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] placeholder-gray-500"
          placeholder={t.placeholderMessage}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-white text-[#4A1D43] rounded-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-2 border-[#D4AF37] font-semibold"
        >
          {saving && (
            <span className="inline-block w-4 h-4 border-2 border-[#4A1D43] border-t-transparent rounded-full animate-spin" />
          )}
          {saving ? t.sending : t.submit}
        </button>
      </div>
    </form>
  );
}
