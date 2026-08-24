import { ArrowRight, Briefcase, QrCode } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

type Lang = 'fr' | 'ar' | 'en' | 'it' | 'ru';

const copy: Record<Lang, {
  ariaHouse: string;
  houseAlt: string;
  mascotAlt: string;
  slogan1: string;
  slogan2: string;
  label: string;
  title: string;
  intro1: string;
  intro2: string;
  summary1: string;
  summary2: string;
  qr: string;
  cta: string;
  windows: Array<{ label: string; description: string }>;
}> = {
  fr: {
    ariaHouse: 'Maison Dalil Tounes de la visibilité numérique', houseAlt: "Maison Dalil Tounes représentant la présence numérique d'une entreprise", mascotAlt: 'Dalil, la mascotte officielle, présente la Maison Dalil Tounes', slogan1: 'Un seul endroit,', slogan2: 'toutes vos connexions !', label: 'Maison Dalil Tounes', title: '🏠 Votre présence sur Internet', intro1: 'Aucune plateforme ne suffit à elle seule.', intro2: "C'est l'ensemble de votre présence sur Internet qui fait votre force.", summary1: 'Google Business, Facebook, Instagram, WhatsApp et votre site jouent chacun un rôle. La Vitrine Business les réunit dans un seul espace professionnel, clair, rassurant et facile à retrouver.', summary2: "C'est cette réunion de toute votre présence numérique qui fait la force de votre CV Business.", qr: 'Et votre Vitrine Business se partage aussi en un scan grâce à votre QR professionnel.', cta: 'Découvrir le CV Business', windows: [
      { label: 'Google Business', description: 'Les clients vous trouvent localement.' }, { label: 'Facebook', description: 'Vous échangez avec votre communauté.' }, { label: 'Instagram', description: 'Vous montrez vos réalisations.' }, { label: 'WhatsApp', description: 'Vous facilitez le contact direct.' }, { label: 'Site web', description: 'Vous présentez votre activité en détail.' }, { label: 'CV Business', description: 'Votre Vitrine Business réunit vos informations, services, photos, horaires, contacts et plateformes existantes.' },
    ] },
  ar: {
    ariaHouse: 'بيت دليل تونس للحضور الرقمي', houseAlt: 'بيت دليل تونس الذي يوضح الحضور الرقمي للمؤسسة', mascotAlt: 'دليل، الشخصية الرسمية، يقدم بيت دليل تونس', slogan1: 'مكان واحد،', slogan2: 'كل روابطك معاً!', label: 'بيت دليل تونس', title: '🏠 حضورك على الإنترنت', intro1: 'لا توجد منصة واحدة تكفي بمفردها.', intro2: 'قوة نشاطك تأتي من تكامل حضورك على الإنترنت.', summary1: 'لكل من Google Business وFacebook وInstagram وWhatsApp وموقعك الإلكتروني دور مختلف. تجمع Vitrine Business كل ذلك في مساحة مهنية واحدة واضحة وموثوقة وسهلة الوصول.', summary2: 'هذا التكامل بين مختلف قنوات حضورك الرقمي هو ما يمنح CV Business قوته.', qr: 'ويمكن مشاركة Vitrine Business أيضاً بمسح رمز QR المهني الخاص بك.', cta: 'اكتشف CV Business', windows: [
      { label: 'Google Business', description: 'يساعد العملاء على العثور عليك محلياً.' }, { label: 'Facebook', description: 'تتواصل من خلاله مع مجتمعك.' }, { label: 'Instagram', description: 'تعرض من خلاله أعمالك وإنجازاتك.' }, { label: 'WhatsApp', description: 'يسهّل التواصل المباشر معك.' }, { label: 'الموقع', description: 'يعرض نشاطك بالتفصيل.' }, { label: 'CV Business', description: 'تجمع Vitrine Business معلوماتك وخدماتك وصورك وأوقات العمل ووسائل الاتصال ومنصاتك الحالية.' },
    ] },
  en: {
    ariaHouse: 'Dalil Tounes digital visibility house', houseAlt: 'Dalil Tounes house representing a business digital presence', mascotAlt: 'Dalil, the official mascot, presents the Dalil Tounes House', slogan1: 'One place,', slogan2: 'all your connections!', label: 'Dalil Tounes House', title: '🏠 Your online presence', intro1: 'No single platform is enough on its own.', intro2: 'The strength of your business comes from your whole online presence.', summary1: 'Google Business, Facebook, Instagram, WhatsApp and your website each play a role. The Business Showcase brings them together in one clear, reassuring and easy-to-find professional space.', summary2: 'Bringing your full digital presence together is what makes your Business CV powerful.', qr: 'Your Business Showcase can also be shared instantly with your professional QR code.', cta: 'Discover the Business CV', windows: [
      { label: 'Google Business', description: 'Customers find you locally.' }, { label: 'Facebook', description: 'You engage with your community.' }, { label: 'Instagram', description: 'You show your work.' }, { label: 'WhatsApp', description: 'You make direct contact easy.' }, { label: 'Website', description: 'You present your activity in detail.' }, { label: 'Business CV', description: 'Your Business Showcase brings together your information, services, photos, hours, contacts and existing platforms.' },
    ] },
  it: {
    ariaHouse: 'Casa Dalil Tounes della visibilità digitale', houseAlt: 'Casa Dalil Tounes che rappresenta la presenza digitale di un’attività', mascotAlt: 'Dalil, la mascotte ufficiale, presenta la Casa Dalil Tounes', slogan1: 'Un solo posto,', slogan2: 'tutte le tue connessioni!', label: 'Casa Dalil Tounes', title: '🏠 La tua presenza online', intro1: 'Nessuna piattaforma basta da sola.', intro2: 'La forza della tua attività nasce dall’insieme della tua presenza online.', summary1: 'Google Business, Facebook, Instagram, WhatsApp e il tuo sito hanno ciascuno un ruolo. La Vetrina Business li riunisce in un unico spazio professionale, chiaro, rassicurante e facile da trovare.', summary2: 'Riunire tutta la tua presenza digitale è ciò che rende forte il tuo CV Business.', qr: 'La tua Vetrina Business si condivide anche con una scansione grazie al QR professionale.', cta: 'Scopri il CV Business', windows: [
      { label: 'Google Business', description: 'I clienti ti trovano localmente.' }, { label: 'Facebook', description: 'Comunichi con la tua community.' }, { label: 'Instagram', description: 'Mostri i tuoi lavori.' }, { label: 'WhatsApp', description: 'Faciliti il contatto diretto.' }, { label: 'Sito web', description: 'Presenti la tua attività in dettaglio.' }, { label: 'CV Business', description: 'La Vetrina Business riunisce informazioni, servizi, foto, orari, contatti e piattaforme esistenti.' },
    ] },
  ru: {
    ariaHouse: 'Дом цифровой видимости Dalil Tounes', houseAlt: 'Дом Dalil Tounes, представляющий цифровое присутствие бизнеса', mascotAlt: 'Dalil, официальный талисман, представляет Дом Dalil Tounes', slogan1: 'Одно место,', slogan2: 'все ваши связи!', label: 'Дом Dalil Tounes', title: '🏠 Ваше присутствие в интернете', intro1: 'Одной платформы недостаточно.', intro2: 'Сила бизнеса — в совокупности всего онлайн-присутствия.', summary1: 'Google Business, Facebook, Instagram, WhatsApp и ваш сайт выполняют разные задачи. Business-витрина объединяет их в одном понятном, надежном и доступном профессиональном пространстве.', summary2: 'Именно объединение всего цифрового присутствия делает Business CV сильным.', qr: 'Business-витриной также можно мгновенно поделиться через профессиональный QR-код.', cta: 'Открыть Business CV', windows: [
      { label: 'Google Business', description: 'Клиенты находят вас рядом.' }, { label: 'Facebook', description: 'Вы общаетесь со своей аудиторией.' }, { label: 'Instagram', description: 'Вы показываете свои работы.' }, { label: 'WhatsApp', description: 'Вы упрощаете прямой контакт.' }, { label: 'Сайт', description: 'Вы подробно представляете свой бизнес.' }, { label: 'Business CV', description: 'Business-витрина объединяет информацию, услуги, фотографии, часы работы, контакты и существующие платформы.' },
    ] },
};

const positions = [
  { left: '30.6%', top: '39.5%', width: '8.1%', height: '5.8%' },
  { left: '39.7%', top: '39.8%', width: '7.8%', height: '4.8%' },
  { left: '49.0%', top: '39.8%', width: '7.5%', height: '4.8%' },
  { left: '30.2%', top: '56.4%', width: '8.4%', height: '5.3%' },
  { left: '40.0%', top: '57.0%', width: '7.8%', height: '4.9%' },
  { left: '48.5%', top: '49.0%', width: '8.5%', height: '12.7%' },
];

function VisibilityHouseIllustration({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const rooms = t.windows.map((room, index) => ({ ...room, position: positions[index], featured: index === 5 }));
  const [activeIndex, setActiveIndex] = useState(5);
  const activeWindow = rooms[activeIndex];
  return <div className="relative mx-auto w-full max-w-[760px]" aria-label={t.ariaHouse}><div className="relative aspect-[3/2] overflow-visible">
    <img src="/images/maison-dalil-tounes-validee.webp" alt={t.houseAlt} className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_22px_48px_rgba(74,29,67,0.16)]" loading="lazy" decoding="async" />
    <img src="/images/mascotte-dalil-transparent.webp" alt={t.mascotAlt} className="absolute bottom-[7%] left-[9%] z-20 h-[39%] w-auto -rotate-3 drop-shadow-[0_18px_24px_rgba(74,29,67,0.22)] sm:bottom-[8%] sm:left-[10%] sm:h-[40%] md:bottom-[8%] md:left-[7%] md:h-[42%] lg:left-[6%]" loading="lazy" decoding="async" />
    {rooms.map((room, index) => <button key={`${room.label}-${index}`} type="button" onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onClick={() => setActiveIndex(index)} aria-label={`${room.label} : ${room.description}`} className={`absolute z-30 flex items-center justify-center rounded-[7%] border border-[#D4AF37]/45 bg-[#FFEAA8]/95 px-1 text-center font-black leading-tight text-[#1F1B16] shadow-[0_0_12px_rgba(255,220,110,0.6)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#FFF1B8] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/80 ${activeIndex === index ? 'ring-2 ring-[#D4AF37]/75' : ''} ${room.featured ? 'text-[10px] sm:text-xs md:text-sm' : 'text-[8px] sm:text-[10px] md:text-xs'}`} style={room.position}><span>{room.label}</span></button>)}
    <div className="absolute left-[82.1%] top-[27.4%] z-30 flex h-[11.3%] w-[8.2%] flex-col items-center justify-center rounded-xl bg-[#222018]/95 px-1 text-center text-[10px] font-black leading-tight text-white shadow-[0_0_10px_rgba(0,0,0,0.35)] sm:text-xs md:text-sm"><span>Dalil</span><span>Tounes</span></div>
    <div className="absolute left-[81.0%] top-[69.1%] z-30 flex h-[12.4%] w-[9.4%] items-center justify-center rounded-md bg-[#201F1A]/95 px-1.5 text-center text-[7px] font-bold leading-tight text-white shadow-[0_0_8px_rgba(0,0,0,0.4)] sm:text-[9px] md:text-[10px]"><span>{t.slogan1}<br />{t.slogan2}</span></div>
    <div className="absolute bottom-[2%] left-1/2 z-30 max-w-[58%] -translate-x-1/2 rounded-2xl border border-[#D4AF37]/35 bg-white/90 px-4 py-2 text-center shadow-sm backdrop-blur-sm" aria-live="polite"><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#D4AF37] sm:text-[10px]">{activeWindow.label}</p><p className="mt-0.5 text-[10px] font-semibold leading-relaxed text-[#4A1D43] sm:text-xs">{activeWindow.description}</p></div>
  </div></div>;
}

function VisibilitySummary({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return <div className="mx-auto max-w-md rounded-[26px] border border-[#D4AF37]/30 bg-white/80 p-5 shadow-[0_18px_45px_rgba(74,29,67,0.08)] backdrop-blur"><p className="text-sm leading-relaxed text-gray-700">{t.summary1}</p><p className="mt-3 text-sm font-semibold leading-relaxed text-[#4A1D43]">{t.summary2}</p><div className="mt-3 flex items-start gap-2 rounded-xl border border-[#D4AF37]/20 bg-[#FFF8E6]/70 px-3 py-2.5"><QrCode className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" /><p className="text-xs font-medium leading-relaxed text-[#4A1D43]">{t.qr}</p></div><Link to="/businesses" className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-[#D4AF37] bg-[#4A1D43] px-6 py-3 text-sm font-bold text-[#D4AF37] shadow-[0_12px_30px_rgba(74,29,67,0.18)] transition hover:bg-[#5A2D53] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70"><Briefcase className="h-4 w-4" aria-hidden="true" />{t.cta}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>;
}

export default function VisibilityHouseSection() {
  const { language } = useLanguage();
  const lang = (['fr','ar','en','it','ru'].includes(language) ? language : 'fr') as Lang;
  const t = copy[lang];
  return <section id="maison-visibilite" dir={lang === 'ar' ? 'rtl' : 'ltr'} className="scroll-mt-24 bg-gradient-to-b from-white via-[#FFFCF5] to-white px-4 py-10 md:py-14"><div className="mx-auto max-w-6xl"><div className="mx-auto mb-8 max-w-3xl text-center"><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37]">{t.label}</p><h2 className="text-2xl font-bold leading-tight text-[#4A1D43] md:text-4xl">{t.title}</h2><p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-[#4A1D43] md:text-lg">{t.intro1}<br />{t.intro2}</p></div><div className="grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr]"><VisibilityHouseIllustration lang={lang} /><VisibilitySummary lang={lang} /></div></div></section>;
}
