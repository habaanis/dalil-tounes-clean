import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { BusinessRegistrationRequestForm } from '../../components/BusinessRegistrationRequestForm';
import { useLanguage } from '../../context/LanguageContext';

type PublicLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

const COPY: Record<PublicLanguage, {
  eyebrow: string;
  title: string;
  subtitle: string;
  formTitle: string;
  emailLabel: string;
}> = {
  fr: {
    eyebrow: 'Demande d’informations',
    title: 'Une question sur Dalil Tounes ?',
    subtitle: 'Envoyez votre demande sans passer par la commande ni le paiement. Notre équipe vous répondra directement.',
    formTitle: 'Parlez-nous de votre besoin',
    emailLabel: 'Vous préférez écrire directement ?',
  },
  ar: {
    eyebrow: 'طلب معلومات',
    title: 'عندك سؤال على دليل تونس؟',
    subtitle: 'ابعث طلبك من غير ما تمرّ بالطلب أو الدفع. فريقنا يجاوبك مباشرة.',
    formTitle: 'احكيلنا على طلبك',
    emailLabel: 'تفضّل تراسلنا مباشرة؟',
  },
  en: {
    eyebrow: 'Information request',
    title: 'A question about Dalil Tounes?',
    subtitle: 'Send your question without starting an order or payment. Our team will reply directly.',
    formTitle: 'Tell us what you need',
    emailLabel: 'Prefer to email us directly?',
  },
  it: {
    eyebrow: 'Richiesta di informazioni',
    title: 'Hai una domanda su Dalil Tounes?',
    subtitle: 'Invia la tua richiesta senza avviare un ordine o un pagamento. Il nostro team ti risponderà direttamente.',
    formTitle: 'Raccontaci di cosa hai bisogno',
    emailLabel: 'Preferisci scriverci direttamente?',
  },
  ru: {
    eyebrow: 'Запрос информации',
    title: 'Есть вопрос о Dalil Tounes?',
    subtitle: 'Отправьте вопрос без оформления заказа и оплаты. Наша команда ответит вам напрямую.',
    formTitle: 'Расскажите, что вам нужно',
    emailLabel: 'Предпочитаете написать нам напрямую?',
  },
};

const PARTNER_COPY: typeof COPY = {
  fr: {
    eyebrow: 'Candidature partenaire',
    title: 'Devenez partenaire Dalil Tounes',
    subtitle: 'Débutant motivé ou commercial expérimenté : présentez votre activité actuelle, votre zone et le réseau professionnel que vous connaissez. Aucun paiement ne vous sera demandé.',
    formTitle: 'Présentez votre candidature',
    emailLabel: 'Vous préférez nous écrire directement ?',
  },
  ar: {
    eyebrow: 'ترشح شريك',
    title: 'ولّي شريك دليل تونس',
    subtitle: 'مبتدئ متحمس ولا عندك خبرة في البيع؟ عرّفنا بنشاطك الحالي، جهتك، والمهنيين اللي تعرفهم. ما ثماش حتى خلاص مطلوب منك.',
    formTitle: 'قدّم ترشحك',
    emailLabel: 'تفضّل تراسلنا مباشرة؟',
  },
  en: {
    eyebrow: 'Partner application',
    title: 'Become a Dalil Tounes partner',
    subtitle: 'Motivated beginner or experienced salesperson: tell us about your current activity, area and professional network. No payment is required.',
    formTitle: 'Submit your application',
    emailLabel: 'Prefer to email us directly?',
  },
  it: {
    eyebrow: 'Candidatura partner',
    title: 'Diventa partner di Dalil Tounes',
    subtitle: 'Principiante motivato o commerciale esperto: presentaci la tua attività, la tua zona e la tua rete professionale. Non è richiesto alcun pagamento.',
    formTitle: 'Presenta la tua candidatura',
    emailLabel: 'Preferisci scriverci direttamente?',
  },
  ru: {
    eyebrow: 'Заявка партнёра',
    title: 'Станьте партнёром Dalil Tounes',
    subtitle: 'Мотивированный новичок или опытный специалист: расскажите о своей деятельности, регионе и профессиональных контактах. Оплата не требуется.',
    formTitle: 'Подайте заявку',
    emailLabel: 'Предпочитаете написать нам напрямую?',
  },
};

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const [searchParams] = useSearchParams();
  const isPartnerRequest = searchParams.get('objet') === 'partenariat';
  const copy = isPartnerRequest ? PARTNER_COPY[lang] : COPY[lang];
  const rtl = lang === 'ar';

  return (
    <main dir={rtl ? 'rtl' : 'ltr'} className="min-h-[70vh] bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_100%)] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <header className={rtl ? 'text-right' : 'text-left'}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#4A1D43] shadow-sm">
            <MessageCircle className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
            {copy.eyebrow}
          </div>
          <h1 className="mt-4 font-serif text-3xl font-bold text-[#2E102A] sm:text-4xl">{copy.title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">{copy.subtitle}</p>
        </header>

        <section className="mt-8 rounded-3xl border border-[#D4AF37]/40 bg-white p-5 shadow-[0_18px_55px_rgba(74,29,67,0.10)] sm:p-8" aria-labelledby="information-form-title">
          <h2 id="information-form-title" className="mb-5 font-serif text-2xl font-bold text-[#4A1D43]">{copy.formTitle}</h2>
          <BusinessRegistrationRequestForm mode="subscription" />
        </section>

        <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <Mail className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
          <span>{copy.emailLabel}</span>
          <a className="font-bold text-[#4A1D43] underline decoration-[#D4AF37] underline-offset-4" href="mailto:contact@dalil-tounes.com">contact@dalil-tounes.com</a>
        </p>
      </div>
    </main>
  );
};

export default Contact;
