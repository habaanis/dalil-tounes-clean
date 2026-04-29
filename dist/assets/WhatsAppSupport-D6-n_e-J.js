import{j as e}from"./vendor-react-D93DfVbF.js";import{u as p}from"./index-BScV_DIW.js";import{al as a}from"./vendor-icons-DVMNF9HL.js";import"./vendor-router-BqkCBVSV.js";import"./vendor-supabase-qSrGhBJl.js";const b=({phoneNumber:o="21627642252",messengerPageId:c="daliltounes"})=>{const{language:n}=p(),t={fr:{whatsapp:"Contactez-nous sur WhatsApp",messenger:"Contactez-nous sur Messenger"},en:{whatsapp:"Contact us on WhatsApp",messenger:"Contact us on Messenger"},ar:{whatsapp:"اتصل بنا عبر واتساب",messenger:"اتصل بنا عبر ماسنجر"},it:{whatsapp:"Contattaci su WhatsApp",messenger:"Contattaci su Messenger"},ru:{whatsapp:"Свяжитесь с нами в WhatsApp",messenger:"Свяжитесь с нами в Messenger"}},s=t[n]||t.fr,r=()=>{const l=encodeURIComponent("Bonjour, j'ai besoin d'aide sur Dalil Tounes");window.open(`https://wa.me/${o}?text=${l}`,"_blank")},i=()=>{window.open("https://m.me/daliltounes","_blank")};return e.jsxs("div",{className:"fixed bottom-6 right-6 z-50 flex flex-col gap-3",children:[e.jsxs("button",{onClick:i,className:"flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all hover:scale-110 hover:shadow-3xl group",style:{backgroundColor:"#0084FF",animation:"pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"},title:s.messenger,"aria-label":s.messenger,children:[e.jsx(a,{className:"w-7 h-7 text-white",strokeWidth:2.5,fill:"white"}),e.jsx("span",{className:"absolute top-0 right-0 w-3.5 h-3.5 bg-blue-300 rounded-full border-2 border-white",style:{animation:"ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite"}}),e.jsxs("span",{className:"absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:[s.messenger,e.jsx("span",{className:"absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"})]})]}),e.jsxs("button",{onClick:r,className:"flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all hover:scale-110 hover:shadow-3xl group",style:{backgroundColor:"#25D366",animation:"pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"},title:s.whatsapp,"aria-label":s.whatsapp,children:[e.jsx(a,{className:"w-7 h-7 text-white",strokeWidth:2.5}),e.jsx("span",{className:"absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white",style:{animation:"ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite"}}),e.jsxs("span",{className:"absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",children:[s.whatsapp,e.jsx("span",{className:"absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"})]})]}),e.jsx("style",{children:`
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
      `})]})};export{b as WhatsAppSupport};
