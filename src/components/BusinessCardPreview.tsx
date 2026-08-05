import { useState } from 'react';
import {
  CalendarDays, ChevronRight, Clock3, Facebook, Globe2, ImageIcon, Instagram, Linkedin,
  Mail, MapPin, MessageCircle, Music2, Navigation, Phone, QrCode, Share2, Star,
  UserRound, Wrench, Youtube,
} from 'lucide-react';

export type BusinessCardPreviewVariant = 'artisan' | 'premium';
export type BusinessCardPreviewSize = 'full' | 'compact';
export type BusinessCardPreviewLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

export interface BusinessCardPreviewProps {
  variant: BusinessCardPreviewVariant;
  language?: BusinessCardPreviewLanguage;
  size?: BusinessCardPreviewSize;
  interactive?: boolean;
  name?: string;
  category?: string;
  city?: string;
  status?: string;
  logo?: string;
  coverImage?: string;
  networks?: Array<'Instagram' | 'Facebook' | 'LinkedIn' | 'YouTube' | 'TikTok'>;
  actions?: [string, string, string, string, string, string];
  gallery?: string;
  reviews?: string;
  hours?: string;
}

const DEFAULT_LOGO = '/images/logo_dalil_tounes_sceau_luxe.webp';
const DEFAULT_COVER = '/images/drapeau-tunisie.webp';

const previewCopy = {
  fr: { name: 'Fiche Démonstration Dalil Tounes', category: 'Plateforme tunisienne', artisanBadge: 'Artisan', certified: 'Certifié Dalil Tounes', serviceCategory: 'Services professionnels', city: 'Tunis, Tunisie', status: 'Ouvert', actions: ['Appeler', 'WhatsApp', 'Itinéraire', 'Réserver', 'Site web', 'Partager'], sections: ['À propos', 'Services', 'Horaires', 'Avis clients', 'Galerie'], hints: ['Découvre qui nous sommes', 'Ce que nous faisons pour toi', 'Lun–Sam : 08:00–18:00', '5,0 · Avis de démonstration', 'Photos de nos réalisations'], social: 'Réseaux sociaux', email: 'E-mail', recommend: 'Recommander ce professionnel', qr: 'QR de partage professionnel', feedback: 'Interaction de démonstration :', sharing: ['WhatsApp', 'Telegram', 'SMS', 'Messenger'] },
  ar: { name: 'بطاقة دليل تونس التجريبية', category: 'منصة تونسية', artisanBadge: 'حرفي', certified: 'موثّق من دليل تونس', serviceCategory: 'خدمات مهنية', city: 'تونس، تونس', status: 'مفتوح', actions: ['اتصال', 'واتساب', 'الاتجاهات', 'حجز', 'الموقع', 'مشاركة'], sections: ['من نحن', 'الخدمات', 'الأوقات', 'آراء العملاء', 'الصور'], hints: ['اكتشف من نحن', 'ما نقدمه لك', 'الإثنين–السبت: 08:00–18:00', '5.0 · آراء تجريبية', 'صور من إنجازاتنا'], social: 'شبكات التواصل', email: 'البريد الإلكتروني', recommend: 'أوصِ بهذا المهني', qr: 'رمز QR للمشاركة المهنية', feedback: 'تفاعل تجريبي:', sharing: ['واتساب', 'تيليغرام', 'رسالة نصية', 'ماسنجر'] },
  en: { name: 'Dalil Tounes Demo Profile', category: 'Tunisian platform', artisanBadge: 'Artisan', certified: 'Dalil Tounes Certified', serviceCategory: 'Professional services', city: 'Tunis, Tunisia', status: 'Open', actions: ['Call', 'WhatsApp', 'Directions', 'Book', 'Website', 'Share'], sections: ['About', 'Services', 'Hours', 'Customer reviews', 'Gallery'], hints: ['Discover who we are', 'What we do for you', 'Mon–Sat: 08:00–18:00', '5.0 · Demo reviews', 'Photos of our work'], social: 'Social networks', email: 'E-mail', recommend: 'Recommend this professional', qr: 'Professional sharing QR', feedback: 'Demo interaction:', sharing: ['WhatsApp', 'Telegram', 'SMS', 'Messenger'] },
  it: { name: 'Scheda dimostrativa Dalil Tounes', category: 'Piattaforma tunisina', artisanBadge: 'Artisan', certified: 'Certificato Dalil Tounes', serviceCategory: 'Servizi professionali', city: 'Tunisi, Tunisia', status: 'Aperto', actions: ['Chiama', 'WhatsApp', 'Indicazioni', 'Prenota', 'Sito web', 'Condividi'], sections: ['Chi siamo', 'Servizi', 'Orari', 'Recensioni', 'Galleria'], hints: ['Scopri chi siamo', 'Cosa facciamo per te', 'Lun–Sab: 08:00–18:00', '5,0 · Recensioni demo', 'Foto dei nostri lavori'], social: 'Reti sociali', email: 'E-mail', recommend: 'Consiglia questo professionista', qr: 'QR di condivisione professionale', feedback: 'Interazione demo:', sharing: ['WhatsApp', 'Telegram', 'SMS', 'Messenger'] },
  ru: { name: 'Демонстрационный профиль Dalil Tounes', category: 'Тунисская платформа', artisanBadge: 'Artisan', certified: 'Проверено Dalil Tounes', serviceCategory: 'Профессиональные услуги', city: 'Тунис, Тунис', status: 'Открыто', actions: ['Позвонить', 'WhatsApp', 'Маршрут', 'Бронь', 'Сайт', 'Поделиться'], sections: ['О нас', 'Услуги', 'Часы работы', 'Отзывы', 'Галерея'], hints: ['Узнайте о нас', 'Что мы делаем для вас', 'Пн–Сб: 08:00–18:00', '5,0 · Демо-отзывы', 'Фотографии наших работ'], social: 'Социальные сети', email: 'Эл. почта', recommend: 'Рекомендовать специалиста', qr: 'Профессиональный QR-код', feedback: 'Демонстрация:', sharing: ['WhatsApp', 'Telegram', 'СМС', 'Messenger'] },
} as const;

function PreviewLogo({ alt, src }: { alt: string; src: string }) {
  return <img src={src} alt={alt} className="h-20 w-20 rounded-full border-4 border-[#D6AF2E] bg-white object-cover shadow-lg" />;
}

function SharingBrandIcon({ brand }: { brand: 'email' | 'whatsapp' | 'telegram' | 'sms' | 'messenger' }) {
  if (brand === 'email') return <Mail className="h-5 w-5 stroke-[2.4]" aria-hidden="true" />;
  if (brand === 'telegram') return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="currentColor" d="M20.7 3.4 3.6 10c-1.2.5-1.2 1.1-.2 1.4l4.4 1.4 1.7 5.2c.2.6.1.8.7.8.5 0 .7-.2 1-.5l2.1-2 4.4 3.2c.8.5 1.4.2 1.6-.8l2.9-13.8c.3-1.2-.5-1.8-1.5-1.5ZM9.5 12.5l8.6-5.4c.4-.2.8-.1.5.2l-7.1 6.4-.3 3.2-1.7-4.4Z" /></svg>;
  if (brand === 'messenger') return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="currentColor" d="M12 2C6.4 2 2 6.1 2 11.5c0 3.1 1.5 5.8 3.9 7.5v3l2.8-1.5c1 .3 2.1.5 3.3.5 5.6 0 10-4.1 10-9.5S17.6 2 12 2Zm1 12.8-2.5-2.7-4.9 2.7 5.4-5.7 2.5 2.7 4.9-2.7-5.4 5.7Z" /></svg>;
  if (brand === 'sms') return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="currentColor" d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5.7 3.4A.85.85 0 0 1 2 20.7V5a2 2 0 0 1 2-2Zm3 8.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm5 0A1.25 1.25 0 1 0 12 9a1.25 1.25 0 0 0 0 2.5Zm5 0A1.25 1.25 0 1 0 17 9a1.25 1.25 0 0 0 0 2.5Z" /></svg>;
  return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.5 15.3L2.2 22l4.8-1.3A10 10 0 1 0 12 2Zm5.6 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.2.2-3.8-.9-3.2-1.4-5.3-4.7-5.5-4.9-.1-.2-1.3-1.8-1.3-3.4 0-1.6.8-2.4 1.1-2.8.3-.3.7-.4 1-.4h.7c.2 0 .5-.1.7.6l.9 2.2c.1.2.1.5 0 .7l-.4.6-.6.6c-.2.2-.4.4-.2.8.2.3.8 1.3 1.8 2.1 1.2 1.1 2.3 1.5 2.6 1.7.3.2.5.2.7-.1l1.1-1.3c.2-.3.5-.3.8-.2l2.1 1c.3.2.6.2.7.4.1.2.1.8-.1 1.5Z" /></svg>;
}

export function BusinessCardPreview({
  variant, language = 'fr', size = 'full', interactive = true,
  name, category, city, status, logo = DEFAULT_LOGO, coverImage = DEFAULT_COVER,
  networks = ['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'TikTok'], actions,
  gallery, reviews, hours,
}: BusinessCardPreviewProps) {
  const labels = previewCopy[language];
  const displayName = name ?? labels.name;
  const displayCategory = category ?? labels.category;
  const displayCity = city ?? labels.city;
  const displayStatus = status ?? labels.status;
  const displayActions = actions ?? [...labels.actions];
  const hints = [...labels.hints];
  if (hours) hints[2] = hours;
  if (reviews) hints[3] = reviews;
  if (gallery) hints[4] = gallery;
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const isPremium = variant === 'premium';
  const isCompact = size === 'compact';
  const actionIcons = [Phone, MessageCircle, Navigation, CalendarDays, Globe2, Share2];
  const sectionIcons = [UserRound, Wrench, Clock3, Star, ImageIcon];
  const socialNetworks = [
    { label: 'Instagram' as const, icon: Instagram, className: 'bg-gradient-to-br from-fuchsia-600 via-rose-500 to-amber-400' },
    { label: 'Facebook' as const, icon: Facebook, className: 'bg-[#1877F2]' },
    { label: 'LinkedIn' as const, icon: Linkedin, className: 'bg-[#0A66C2]' },
    { label: 'YouTube' as const, icon: Youtube, className: 'bg-[#FF0000]' },
    { label: 'TikTok' as const, icon: Music2, className: 'bg-black shadow-[inset_1px_0_0_#25F4EE,inset_-1px_0_0_#FE2C55]' },
  ].filter(({ label }) => networks.includes(label));
  const sharingNetworks = [
    { brand: 'email' as const, label: labels.email, className: 'bg-gradient-to-br from-[#1264A3] to-[#208BD0]' },
    { brand: 'whatsapp' as const, label: labels.sharing[0], className: 'bg-[#25D366]' },
    { brand: 'telegram' as const, label: labels.sharing[1], className: 'bg-[#229ED9]' },
    { brand: 'sms' as const, label: labels.sharing[2], className: 'bg-[#3976D8]' },
    { brand: 'messenger' as const, label: labels.sharing[3], className: 'bg-gradient-to-br from-[#00B2FF] via-[#696BFF] to-[#D329C6]' },
  ];
  const sectionOrder = isPremium ? [2, 3, 1] : [0, 1, 2, 3, 4];
  const activate = (label: string) => { if (interactive) setFeedback(`${labels.feedback} ${label}`); };

  return (
    <article aria-label={`${displayName} — ${displayStatus}`} dir={language === 'ar' ? 'rtl' : 'ltr'} style={isCompact ? { maxWidth: isPremium ? 360 : 370 } : undefined} className={`mx-auto w-full overflow-hidden text-white ${isPremium ? 'max-w-[400px] rounded-[24px] border-2 border-[#E0B93E] bg-[radial-gradient(circle_at_50%_8%,rgba(20,111,77,0.34),transparent_28%),linear-gradient(145deg,#031D18_0%,#042D24_50%,#011914_100%)] p-1.5 shadow-[0_20px_44px_rgba(0,24,19,0.48),0_0_12px_rgba(224,185,62,0.16),inset_0_0_24px_rgba(224,185,62,0.07)]' : 'max-w-[410px] rounded-[25px] border border-[#CDA82F] bg-[radial-gradient(circle_at_35%_0%,rgba(17,103,74,0.28),transparent_34%),linear-gradient(180deg,#064735_0%,#032F27_48%,#021F1A_100%)] shadow-[0_16px_34px_rgba(0,38,29,0.38),0_0_7px_rgba(205,168,47,0.1),inset_0_0_18px_rgba(0,0,0,0.2)]'}`}>
      <div className={`relative overflow-hidden ${isPremium ? 'h-[88px] rounded-t-[19px] border border-[#D6AF2E]/40' : 'h-20'}`}><img src={coverImage} alt={`${displayName} — ${labels.serviceCategory}`} className="h-full w-full object-cover" /><div className={`absolute inset-0 ${isPremium ? 'bg-gradient-to-t from-[#021E19] via-black/10 to-black/10' : 'bg-gradient-to-t from-[#043A2D] via-transparent to-black/5'}`} /></div>
      <div className={`${isPremium ? '-mt-5 rounded-[20px] border border-[#D9B43A]/70 bg-[radial-gradient(circle_at_50%_8%,rgba(17,92,67,0.25),transparent_28%),linear-gradient(180deg,rgba(3,42,34,0.98),rgba(1,25,21,0.99))] px-3 pb-3 pt-0 shadow-[0_0_11px_rgba(224,185,62,0.12),inset_0_0_18px_rgba(0,0,0,0.3)]' : 'px-3.5 pb-3'} relative`}>
        {isPremium ? <div className="text-center"><div className="relative mx-auto h-10"><div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-6 scale-[0.78] drop-shadow-[0_0_7px_rgba(239,198,66,0.48)]"><PreviewLogo alt={displayName} src={logo} /></div></div><span className="inline-flex rounded-full border border-[#E0B93E]/85 bg-[#021E19] px-3.5 py-0.5 text-[11px] font-black text-[#F4CE55] shadow-[0_0_8px_rgba(224,185,62,0.18),inset_0_1px_4px_rgba(224,185,62,0.08)]">⚒ {labels.serviceCategory}</span><div className="mx-auto mt-1.5 max-w-[310px] rounded-xl border border-[#D9B43A]/65 bg-[linear-gradient(145deg,rgba(5,53,42,0.92),rgba(1,25,21,0.94))] px-3 py-2 shadow-[0_0_8px_rgba(224,185,62,0.1),inset_0_0_10px_rgba(0,0,0,0.24)]"><h3 className="font-serif text-[19px] font-bold leading-tight tracking-[0.01em] text-[#FFFDF2] sm:text-[21px]">{displayName}</h3><span className="mt-1.5 inline-flex items-center justify-center rounded-full border border-[#E0B93E]/80 bg-gradient-to-r from-[#076044] to-[#087A50] px-3 py-0.5 text-[10px] font-black uppercase tracking-wide text-white shadow-[inset_0_1px_4px_rgba(255,255,255,0.08)]">★ {labels.certified}</span><p className="mt-1.5 text-xs font-semibold text-[#F4CE55]">{displayCategory}</p><p className="mt-1 inline-flex items-center gap-1.5 text-xs text-emerald-50"><MapPin className="h-3.5 w-3.5 text-[#F4CE55]" aria-hidden="true" />{displayCity}</p><p className="mt-1 text-xs font-bold text-emerald-300">WhatsApp</p></div></div> : <div className="-mt-7 flex items-start gap-2.5"><div className="shrink-0 scale-90"><PreviewLogo alt={displayName} src={logo} /></div><div className="min-w-0 flex-1 pt-7"><h3 className="truncate text-[20px] font-black leading-tight text-white sm:text-[22px]">{displayName}</h3><span className="mt-2 inline-flex rounded-full bg-emerald-600/70 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white">★ {labels.artisanBadge}</span><p className="mt-1 text-sm font-semibold text-[#F4CE55]">{displayCategory}</p><div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-emerald-50"><span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4 text-emerald-300" aria-hidden="true" />{displayCity}</span><button type="button" onClick={() => activate(displayActions[2])} className="rounded-full border border-[#D6AF2E]/70 px-2 py-0.5 font-bold text-[#F4CE55] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">GPS</button></div><p className="mt-1 text-sm font-bold text-emerald-300">WhatsApp</p></div></div>}
        <div className={`${isPremium ? 'mt-2' : 'mt-3'} grid grid-cols-3 gap-1.5`}>{displayActions.map((label, index) => { const Icon = actionIcons[index]; return <button key={label} type="button" onClick={() => activate(label)} className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1 text-[10px] font-bold transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${isPremium ? 'min-h-[48px] border border-[#DDB638]/75 bg-[linear-gradient(145deg,#06382D,#011F1A)] text-[#FFFDF2] shadow-[0_0_6px_rgba(221,182,56,0.1),inset_0_1px_7px_rgba(242,202,75,0.11),inset_0_-4px_8px_rgba(0,0,0,0.2)] hover:border-[#F0CB50] hover:shadow-[0_0_9px_rgba(221,182,56,0.2),inset_0_1px_7px_rgba(242,202,75,0.13)]' : 'min-h-[54px] border border-[#B99B32]/45 bg-[linear-gradient(145deg,rgba(5,58,45,0.88),rgba(2,38,31,0.94))] text-emerald-50 shadow-[inset_0_1px_5px_rgba(255,255,255,0.03)] hover:border-[#D6AF2E]/70 hover:bg-[#073D30]'}`}><Icon className={`${isPremium ? 'h-4 w-4' : 'h-[18px] w-[18px]'} ${index === 1 ? 'text-emerald-300' : 'text-[#F4CE55]'}`} aria-hidden="true" /><span>{isPremium && index === 2 ? 'GPS' : label}</span></button>; })}</div>
        <div className={`mt-2.5 rounded-xl ${isPremium ? 'space-y-1' : 'overflow-hidden border border-[#B99B32]/35 bg-black/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.14)]'}`}>{sectionOrder.map((index) => { const label = labels.sections[index]; const Icon = sectionIcons[index]; const expanded = openSection === index; return <div key={label} className={isPremium ? 'overflow-hidden rounded-lg border border-[#D9B43A]/60 bg-[linear-gradient(90deg,#042E25,#011F1A)] shadow-[0_0_5px_rgba(217,180,58,0.06),inset_0_1px_5px_rgba(224,185,62,0.04)]' : 'border-b border-white/10 last:border-b-0'}>{isPremium && index === 3 && <button type="button" onClick={() => activate(labels.qr)} className="flex min-h-9 w-full items-center gap-2 border-b border-[#D9B43A]/25 px-2.5 py-1 text-start text-[11px] font-bold transition hover:bg-[#D6AF2E]/8 hover:shadow-[inset_0_0_7px_rgba(214,175,46,0.06)] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D6AF2E]"><QrCode className="h-4 w-4 text-white" aria-hidden="true" />{labels.qr}<ChevronRight className="ms-auto h-3.5 w-3.5 text-[#F4CE55] rtl:rotate-180" aria-hidden="true" /></button>}<button type="button" aria-expanded={expanded} onClick={() => setOpenSection(expanded ? null : index)} className={`flex w-full items-center gap-2 px-2.5 text-start transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D6AF2E] ${isPremium ? 'min-h-9 py-1 hover:bg-[#D6AF2E]/8 hover:shadow-[inset_0_0_7px_rgba(214,175,46,0.06)]' : 'min-h-[42px] py-1.5 hover:bg-white/8'}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isPremium ? 'bg-[#D6AF2E]/10 text-[#F4CE55]' : 'bg-emerald-900/65 text-emerald-300'}`}><Icon className="h-3.5 w-3.5" aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-bold">{label}</span>{!isPremium && <span className="block truncate text-[10px] text-emerald-100/70">{hints[index]}</span>}</span><ChevronRight className={`h-3.5 w-3.5 shrink-0 text-[#F4CE55] transition ${expanded ? 'rotate-90 rtl:-rotate-90' : 'rtl:rotate-180'}`} aria-hidden="true" /></button>{expanded && <div className="bg-black/15 px-3 pb-2 text-[11px] leading-4 text-emerald-50">{hints[index]}</div>}</div>; })}</div>
        {!isPremium && <section className="mt-2.5 rounded-xl border border-[#B99B32]/35 bg-[#021F1A]/70 p-2.5 text-center shadow-[inset_0_0_9px_rgba(0,0,0,0.16)]" aria-label={labels.social}><h4 className="text-sm font-bold text-[#F4CE55]">{labels.social}</h4><div className="mt-2 flex flex-wrap justify-center gap-2">{socialNetworks.map(({ label, icon: Icon, className }) => <button key={label} type="button" onClick={() => activate(label)} aria-label={label} className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AF2E] ${className}`}><Icon className="h-4 w-4" aria-hidden="true" /></button>)}</div></section>}
        {!isPremium && <section className="mt-1 rounded-xl border border-[#C6A333]/45 bg-[#011B17]/80 px-2.5 py-1.5 text-center shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]" aria-label={labels.recommend}><h4 className="text-[11px] font-bold text-[#F4CE55]">{labels.recommend}</h4><div className="mt-1 flex justify-center gap-2 sm:gap-2.5">{sharingNetworks.map(({ brand, label, className }) => <button key={brand} type="button" onClick={() => activate(label)} aria-label={label} title={label} className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white shadow-sm transition hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-9 sm:w-9 ${className}`}><SharingBrandIcon brand={brand} /></button>)}</div></section>}
        {isPremium && <><section className="mt-2 rounded-xl border border-[#DDB638]/60 bg-[linear-gradient(145deg,#032A22,#011B17)] px-2.5 py-2 text-center shadow-[0_0_6px_rgba(221,182,56,0.08),inset_0_0_9px_rgba(0,0,0,0.24)]" aria-label={labels.social}><h4 className="text-[11px] font-bold tracking-wide text-[#E7C75A]">{labels.social}</h4><div className="mt-1.5 flex justify-center gap-2.5">{socialNetworks.map(({ label, icon: Icon, className }) => <button key={label} type="button" onClick={() => activate(label)} aria-label={label} title={label} className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white opacity-95 shadow-[0_3px_7px_rgba(0,0,0,0.28),0_0_5px_rgba(221,182,56,0.08)] transition hover:scale-105 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}><Icon className="h-3.5 w-3.5" aria-hidden="true" /></button>)}</div></section><div className="mt-2 flex justify-center gap-6 border-t border-[#D6AF2E]/35 pt-2">{[Phone, MessageCircle, Navigation].map((Icon, index) => <button key={displayActions[index]} type="button" onClick={() => activate(displayActions[index])} aria-label={displayActions[index]} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E0B93E]/80 bg-[radial-gradient(circle_at_40%_30%,#084B39,#011C17_70%)] text-[#F4CE55] shadow-[0_0_8px_rgba(224,185,62,0.25),inset_0_1px_5px_rgba(244,206,85,0.1)] transition hover:scale-105 hover:shadow-[0_0_11px_rgba(224,185,62,0.34)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"><Icon className="h-4 w-4" aria-hidden="true" /></button>)}</div></>}
        <p className="mt-1 min-h-4 text-center text-[10px] text-emerald-100" aria-live="polite">{feedback}</p>
      </div>
    </article>
  );
}

export default BusinessCardPreview;
