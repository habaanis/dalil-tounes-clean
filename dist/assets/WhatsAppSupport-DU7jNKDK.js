import{j as e}from"./vendor-react-Baqs45qi.js";import{u as p}from"./index-D81bGtqQ.js";import{i as a}from"./vendor-icons-DeXe_bI3.js";import"./vendor-supabase-Dn_fvsz-.js";import"./vendor-router-DEmKf8lT.js";import"./vendor-motion-CWd6cBwP.js";const w=({phoneNumber:n="21627642252",messengerPageId:c="daliltounes"})=>{const{language:o}=p(),s={fr:{whatsapp:"Contactez-nous sur WhatsApp",messenger:"Contactez-nous sur Messenger"},en:{whatsapp:"Contact us on WhatsApp",messenger:"Contact us on Messenger"},ar:{whatsapp:"اتصل بنا عبر واتساب",messenger:"اتصل بنا عبر ماسنجر"},it:{whatsapp:"Contattaci su WhatsApp",messenger:"Contattaci su Messenger"},ru:{whatsapp:"Свяжитесь с нами в WhatsApp",messenger:"Свяжитесь с нами в Messenger"}},t=s[o]||s.fr,r=()=>{const l=encodeURIComponent("Bonjour, j'ai besoin d'aide sur Dalil Tounes");window.open(`https://wa.me/${n}?text=${l}`,"_blank")},i=()=>{window.open("https://m.me/daliltounes","_blank")};return e.jsxs("div",{className:"fixed bottom-3 right-3 z-40 flex flex-col gap-2",children:[e.jsxs("button",{onClick:i,className:"flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all hover:scale-110 group",style:{backgroundColor:"#0084FF",animation:"pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"},title:t.messenger,"aria-label":t.messenger,children:[e.jsx(a,{className:"w-5 h-5 text-white",strokeWidth:2.5,fill:"white"}),e.jsx("span",{className:"absolute top-0 right-0 w-3.5 h-3.5 bg-blue-300 rounded-full border-2 border-white",style:{animation:"ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite"}}),e.jsxs("span",{className:"absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:[t.messenger,e.jsx("span",{className:"absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"})]})]}),e.jsxs("button",{onClick:r,className:"flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all hover:scale-110 group",style:{backgroundColor:"#25D366",animation:"pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"},title:t.whatsapp,"aria-label":t.whatsapp,children:[e.jsx(a,{className:"w-5 h-5 text-white",strokeWidth:2.5}),e.jsx("span",{className:"absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white",style:{animation:"ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite"}}),e.jsxs("span",{className:"absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:[t.whatsapp,e.jsx("span",{className:"absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"})]})]}),e.jsx("style",{children:`
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
      `})]})};export{w as WhatsAppSupport};
