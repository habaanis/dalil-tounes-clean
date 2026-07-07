import{j as e}from"./vendor-react-Baqs45qi.js";import{L as p}from"./vendor-router-DEmKf8lT.js";const o="/images/mascotte-dalil-transparent.png",b={sm:"w-20 h-20 sm:w-24 sm:h-24",md:"w-28 h-28 sm:w-32 sm:h-32",lg:"w-36 h-36 sm:w-44 sm:h-44"},w={welcome:"border-[#D4AF37]/25 bg-gradient-to-br from-[#FFFDF6] to-[#FBF6E8]",tip:"border-[#D4AF37]/30 bg-gradient-to-br from-[#FFFDF6] to-[#FBF3DE]",info:"border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100",success:"border-green-200 bg-gradient-to-br from-green-50 to-emerald-50",business:"border-[#D4AF37]/30 bg-gradient-to-br from-[#FBF6E8] to-[#F3ECD8]"},F={hello:o,point:o,thumbsUp:o,idea:o,celebrate:o,thinking:o};function j({size:t,pose:s}){return e.jsx("div",{className:`flex-shrink-0 ${b[t]} guide-mascot-figure`,children:e.jsx("img",{src:F[s],alt:"Dalil, la mascotte officielle de Dalil Tounes",className:"w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] guide-mascot-img",loading:"lazy",width:624,height:638})})}function y({label:t,href:s,onClick:a}){const r="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-white font-semibold text-sm hover:bg-[#c9a42e] transition-colors shadow-sm hover:shadow-md";return s?/^https?:\/\//i.test(s)?e.jsx("a",{href:s,target:"_blank",rel:"noopener noreferrer",className:r,children:t}):e.jsx(p,{to:s,className:r,children:t}):e.jsx("button",{type:"button",onClick:a,className:r,children:t})}const A=`
  @keyframes guideMascotAppear {
    from { opacity: 0; transform: translate3d(0, 12px, 0); }
    to   { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes guideMascotBreathe {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50%      { transform: translate3d(0, -2px, 0); }
  }
  @keyframes guideMascotGreet {
    0%   { transform: rotate(0deg); }
    25%  { transform: rotate(-2.5deg); }
    55%  { transform: rotate(1.5deg); }
    100% { transform: rotate(0deg); }
  }
  .guide-mascot {
    animation: guideMascotAppear 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .guide-mascot-figure {
    animation: guideMascotBreathe 4.5s ease-in-out infinite;
    will-change: transform;
  }
  .guide-mascot-img {
    transform-origin: 50% 88%;
  }
  @media (hover: hover) and (pointer: fine) {
    .guide-mascot-figure:hover .guide-mascot-img {
      animation: guideMascotGreet 300ms ease-in-out;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .guide-mascot,
    .guide-mascot-figure,
    .guide-mascot-figure:hover .guide-mascot-img {
      animation: none;
    }
  }
`;function v({title:t,message:s,children:a,position:r="left",size:l="md",variant:g="welcome",pose:f="hello",ctaLabel:i,ctaHref:n,onCtaClick:m,className:u=""}){const c=a??s,d=r==="center",x=d?"flex-col items-center text-center":r==="right"?"flex-col sm:flex-row-reverse items-center text-center sm:text-right":"flex-col sm:flex-row items-center text-center sm:text-left",h=!!(i&&(n||m));return e.jsxs("div",{className:`guide-mascot flex ${x} gap-5 sm:gap-6 rounded-2xl border p-5 sm:p-6 shadow-sm ${w[g]} ${u}`,children:[e.jsx("style",{children:A}),e.jsx(j,{size:l,pose:f}),e.jsxs("div",{className:"flex-1 space-y-2",children:[t&&e.jsx("h3",{className:"text-lg sm:text-xl font-bold text-gray-900 leading-tight",children:t}),c&&e.jsx("div",{className:"text-sm sm:text-base text-gray-600 leading-relaxed",children:c}),h&&e.jsx("div",{className:`pt-2 ${d?"flex justify-center":""}`,children:e.jsx(y,{label:i,href:n,onClick:m})})]})]})}export{v as G};
