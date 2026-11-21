import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface WhatsAppSupportProps {
  phoneNumber?: string;
  messengerPageId?: string;
}

export const WhatsAppSupport = ({
  phoneNumber = '21627642252',
  messengerPageId = 'daliltounes'
}: WhatsAppSupportProps) => {
  const { language } = useLanguage();
  const [helpOpen,setHelpOpen] = useState(false);
  const [helpTopic,setHelpTopic] = useState('inscription');
  const [helpDetails,setHelpDetails] = useState('');
  const [answerLanguage,setAnswerLanguage] = useState<'fr'|'ar'>(language === 'ar' ? 'ar' : 'fr');
  useEffect(()=>setAnswerLanguage(language === 'ar' ? 'ar' : 'fr'),[language]);

  const translations = {
    fr: {
      whatsapp: 'Contactez-nous sur WhatsApp',
      messenger: 'Contactez-nous sur Messenger'
    },
    en: {
      whatsapp: 'Contact us on WhatsApp',
      messenger: 'Contact us on Messenger'
    },
    ar: {
      whatsapp: 'اتصل بنا عبر واتساب',
      messenger: 'اتصل بنا عبر ماسنجر'
    },
    it: {
      whatsapp: 'Contattaci su WhatsApp',
      messenger: 'Contattaci su Messenger'
    },
    ru: {
      whatsapp: 'Свяжитесь с нами в WhatsApp',
      messenger: 'Свяжитесь с нами в Messenger'
    }
  };

  const text = translations[language as keyof typeof translations] || translations.fr;

  const topics:Record<string,{fr:{label:string;answer:string};ar:{label:string;answer:string}}> = {
    inscription:{
      fr:{label:'Je souhaite m’inscrire sur Dalil Tounes',answer:'Vous pouvez demander l’inscription de votre activité sur Dalil Tounes. Une présence gratuite et une mini-appli professionnelle sont proposées selon vos besoins. Pour être accompagné, contactez-nous sur WhatsApp.'},
      ar:{label:'أريد تسجيل نشاطي في دليل تونس',answer:'يمكنك طلب تسجيل نشاطك في دليل تونس. تتوفر خدمة حضور مجاني وميني تطبيق مهني حسب احتياجاتك. إذا أردت المساعدة، تواصل معنا عبر واتساب.'}
    },
    decouvrir:{
      fr:{label:'À quoi servent Dalil Tounes et son application ?',answer:'Dalil Tounes aide à trouver des professionnels, commerces et services en Tunisie. Son application permet de les découvrir et de les contacter plus facilement. Les professionnels peuvent présenter leur activité dans une mini-appli.'},
      ar:{label:'ما فائدة دليل تونس وتطبيقه؟',answer:'يساعدك دليل تونس على العثور على مهنيين ومحلات وخدمات في تونس، والتواصل معهم بسهولة. ويمكن لأصحاب الأنشطة عرض خدماتهم عبر ميني تطبيق مهني.'}
    },
    commercant:{
      fr:{label:'Je suis commerçant : quels avantages pour mon activité et mes clients ?',answer:'Votre mini-appli réunit votre présentation, vos coordonnées et, selon les fonctions activées, un catalogue, des commandes, des offres et la fidélité. Vos clients accèdent à vos informations et peuvent vous contacter ou commander plus facilement.'},
      ar:{label:'أنا تاجر: ما الفائدة لي ولحرفائي؟',answer:'يجمع الميني تطبيق التعريف بنشاطك وطرق التواصل معك، ويمكن أن يضم كتالوج المنتجات والطلبات والعروض والوفاء حسب الخدمات المفعّلة. هكذا يجد حرفاؤك معلوماتك ويتواصلون معك أو يطلبون بسهولة أكبر.'}
    },
    offres:{
      fr:{label:'Je souhaite découvrir les offres professionnelles',answer:'Dalil Tounes propose une présence essentielle gratuite et des mini-applis professionnelles avec des outils de présentation et de vente. Contactez-nous pour connaître les possibilités et les conditions de l’offre qui vous convient.'},
      ar:{label:'أريد معرفة العروض المخصصة للمهنيين',answer:'يوفّر دليل تونس حضوراً أساسياً مجانياً وميني تطبيقات مهنية بأدوات للتعريف بالنشاط وتسهيل البيع. تواصل معنا لمعرفة الخيارات والشروط المناسبة لنشاطك.'}
    },
    autre:{
      fr:{label:'J’ai une autre question',answer:'Vous pouvez nous écrire directement. Choisissez ce sujet, précisez votre question si vous le souhaitez, puis envoyez-la sur WhatsApp.'},
      ar:{label:'عندي سؤال آخر',answer:'يمكنك مراسلتنا مباشرة. اختر هذا الموضوع، واكتب سؤالك إذا أردت، ثم أرسله عبر واتساب.'}
    }
  };
  const ui = answerLanguage === 'ar'
    ? {heading:'كيف يمكننا مساعدتك؟',instruction:'اختر موضوعك لعرض إجابة فورية.',subject:'موضوع السؤال',answer:'الإجابة',more:'هل لديك سؤال آخر؟ (اختياري)',placeholder:'اكتب رسالتك هنا…',send:'متابعة عبر واتساب',close:'إغلاق'}
    : {heading:'Comment pouvons-nous vous aider ?',instruction:'Choisissez un sujet pour voir une première réponse.',subject:'Votre demande concerne',answer:'Notre réponse',more:'Une autre question ? (facultatif)',placeholder:'Votre message…',send:'Continuer sur WhatsApp',close:'Fermer'};
  const sendHelp = () => {
    const details=helpDetails.trim();
    const subject=topics[helpTopic][answerLanguage].label;
    const message = encodeURIComponent((answerLanguage==='ar'?'مرحباً دليل تونس،\nالموضوع: ':'Bonjour Dalil Tounes,\nSujet : ')+subject+(details?(answerLanguage==='ar'?'\nسؤالي: ':'\nMa question : ')+details:'')+'\n(Page : '+window.location.pathname+')');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
    setHelpOpen(false);setHelpDetails('');
  };
  const handleWhatsAppClick = () => setHelpOpen(v=>!v);

  const handleMessengerClick = () => {
    window.open('https://m.me/daliltounes', '_blank');
  };

  return (
    <div className="fixed bottom-3 right-3 z-40 flex flex-col gap-2">
      {/* Bouton Messenger */}
      <button
        onClick={handleMessengerClick}
        className="flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all hover:scale-110 group"
        style={{
          backgroundColor: '#0084FF',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
        title={text.messenger}
        aria-label={text.messenger}
      >
        <MessageCircle className="w-5 h-5 text-white" strokeWidth={2.5} fill="white" />

        {/* Indicateur de disponibilité */}
        <span
          className="absolute top-0 right-0 w-3.5 h-3.5 bg-blue-300 rounded-full border-2 border-white"
          style={{
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />

        {/* Tooltip au survol */}
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {text.messenger}
          <span className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900" />
        </span>
      </button>

      {helpOpen && <section role="dialog" aria-label={ui.heading} dir={answerLanguage==='ar'?'rtl':'ltr'}
        className="w-[min(88vw,340px)] max-h-[75dvh] overflow-y-auto rounded-xl border border-[#d5b66a] bg-[#fbf8f0] p-3 text-sm text-[#252525] shadow-xl">
        <div className="mb-2 flex items-start justify-between gap-2">
          <strong>{ui.heading}</strong>
          <button type="button" onClick={()=>setHelpOpen(false)} aria-label={ui.close} className="min-h-9 rounded-lg px-2">✕</button>
        </div>
        <div className="mb-2 flex gap-2" role="group" aria-label="Langue de la réponse">
          <button type="button" aria-pressed={answerLanguage==='fr'} onClick={()=>setAnswerLanguage('fr')} className={`min-h-9 rounded-lg border px-3 text-xs ${answerLanguage==='fr'?'border-[#b8954c] bg-[#f1e2bc] font-bold':'border-[#d5b66a]'}`}>Français</button>
          <button type="button" aria-pressed={answerLanguage==='ar'} onClick={()=>setAnswerLanguage('ar')} className={`min-h-9 rounded-lg border px-3 text-xs ${answerLanguage==='ar'?'border-[#b8954c] bg-[#f1e2bc] font-bold':'border-[#d5b66a]'}`}>العربية</button>
        </div>
        <p className="mb-2 text-xs">{ui.instruction}</p>
        <label className="mb-2 grid gap-1 text-xs">{ui.subject}
          <select value={helpTopic} onChange={e=>setHelpTopic(e.target.value)} className="min-h-11 w-full rounded-lg border border-[#d5b66a] bg-white p-2">
            {Object.entries(topics).map(([value,labels])=><option key={value} value={value}>{labels[answerLanguage].label}</option>)}
          </select>
        </label>
        <div className="mb-2 rounded-lg border border-[#d5b66a] bg-white p-3" role="status" aria-live="polite">
          <strong className="text-xs text-[#715427]">{ui.answer}</strong>
          <p className="mt-1 text-xs leading-relaxed">{topics[helpTopic][answerLanguage].answer}</p>
        </div>
        <label className="grid gap-1 text-xs">{ui.more}
          <textarea rows={2} maxLength={500} value={helpDetails}
            onChange={e=>setHelpDetails(e.target.value)}
            placeholder={ui.placeholder} className="rounded-lg border border-[#d5b66a] bg-white p-2" />
        </label>
        <button type="button" onClick={sendHelp}
          className="mt-2 min-h-11 w-full rounded-xl bg-[#073b30] px-3 text-xs font-semibold text-white">
          {ui.send}
        </button>
      </section>}
      {/* Bouton WhatsApp */}
      <button
        onClick={handleWhatsAppClick}
        aria-expanded={helpOpen}
        className="flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all hover:scale-110 group"
        style={{
          backgroundColor: '#25D366',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
        title={text.whatsapp}
        aria-label={text.whatsapp}
      >
        <MessageCircle className="w-5 h-5 text-white" strokeWidth={2.5} />

        {/* Indicateur de disponibilité */}
        <span
          className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"
          style={{
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />

        {/* Tooltip au survol */}
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {text.whatsapp}
          <span className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900" />
        </span>
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
