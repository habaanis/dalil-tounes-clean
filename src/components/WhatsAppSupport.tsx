import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
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
  const [helpTopic,setHelpTopic] = useState('compte');
  const [helpDetails,setHelpDetails] = useState('');

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

  const topics:Record<string,string> = {
    compte:'Connexion / compte', boutique:'Boutique / commande',
    fidelite:'Fidélité / carte cadeau', fiche:'Fiche professionnelle', autre:'Autre question'
  };
  const sendHelp = () => {
    const details=helpDetails.trim();
    if(details.length<8)return;
    const message = encodeURIComponent('Dalil Tounes — Assistance\nSujet : '+topics[helpTopic]+'\nMa demande : '+details+'\n(Page : '+window.location.pathname+')');
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

      {helpOpen && <section role="dialog" aria-label="Préciser votre demande Dalil Tounes"
        className="w-[min(88vw,310px)] max-h-[70dvh] overflow-y-auto rounded-xl border border-[#d5b66a] bg-[#fbf8f0] p-3 text-sm text-[#252525] shadow-xl">
        <div className="mb-2 flex items-center justify-between gap-2">
          <strong>Assistance Dalil Tounes</strong>
          <button type="button" onClick={()=>setHelpOpen(false)} aria-label="Fermer le formulaire" className="min-h-9 rounded-lg px-2">✕</button>
        </div>
        <p className="mb-2 text-xs">Précisez votre problème avant d’envoyer le message WhatsApp.</p>
        <label className="mb-2 grid gap-1 text-xs">Votre sujet
          <select value={helpTopic} onChange={e=>setHelpTopic(e.target.value)} className="min-h-11 rounded-lg border border-[#d5b66a] bg-white p-2">
            {Object.entries(topics).map(([value,label])=><option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs">Expliquez votre demande
          <textarea rows={3} minLength={8} maxLength={500} value={helpDetails}
            onChange={e=>setHelpDetails(e.target.value)}
            placeholder="Ex. Je ne retrouve pas mes commandes…" className="rounded-lg border border-[#d5b66a] bg-white p-2" />
        </label>
        <button type="button" disabled={helpDetails.trim().length<8} onClick={sendHelp}
          className="mt-2 min-h-11 w-full rounded-xl bg-[#073b30] px-3 text-xs font-semibold text-white disabled:opacity-50">
          Envoyer sur WhatsApp
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
