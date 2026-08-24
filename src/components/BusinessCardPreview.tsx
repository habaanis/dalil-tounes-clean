import { useEffect, useRef, useState } from 'react';
import { ChevronRight, Copy, Home, QrCode, Share2, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import LegacyBusinessCardPreview, {
  type BusinessCardPreviewLanguage,
  type BusinessCardPreviewProps,
  type BusinessCardPreviewSize,
  type BusinessCardPreviewVariant,
} from './BusinessCardPreviewLegacy';
import './subscriptionCompactCards.css';

export type {
  BusinessCardPreviewLanguage,
  BusinessCardPreviewProps,
  BusinessCardPreviewSize,
  BusinessCardPreviewVariant,
};

const AUX_SAVEURS_PREVIEW: Record<BusinessCardPreviewLanguage, {
  name: string; category: string; city: string; status: string; hours: string; reviews: string; gallery: string; galleryTitle: string; qrTitle: string;
}> = {
  fr: { name: "Aux saveurs d'Anis", category: 'Traiteur événementiel', city: '49260 Montreuil-Bellay, France', status: 'Sur réservation', hours: 'Lun–Sam : 10:00–18:00', reviews: 'Avis clients', gallery: 'Buffets et créations culinaires', galleryTitle: 'Galerie', qrTitle: 'QR Code et partage' },
  ar: { name: "Aux saveurs d'Anis", category: 'متعهد حفلات وتموين', city: '49260 مونتروي-بيلي، فرنسا', status: 'بالحجز', hours: 'الاثنين–السبت: 10:00–18:00', reviews: 'آراء العملاء', gallery: 'بوفيهات وإبداعات في فن الطبخ', galleryTitle: 'الصور', qrTitle: 'رمز QR والمشاركة' },
  en: { name: "Aux saveurs d'Anis", category: 'Event caterer', city: '49260 Montreuil-Bellay, France', status: 'By reservation', hours: 'Mon–Sat: 10:00–18:00', reviews: 'Customer reviews', gallery: 'Buffets and culinary creations', galleryTitle: 'Gallery', qrTitle: 'QR Code and sharing' },
  it: { name: "Aux saveurs d'Anis", category: 'Catering per eventi', city: '49260 Montreuil-Bellay, Francia', status: 'Su prenotazione', hours: 'Lun–Sab: 10:00–18:00', reviews: 'Recensioni clienti', gallery: 'Buffet e creazioni culinarie', galleryTitle: 'Galleria', qrTitle: 'QR Code e condivisione' },
  ru: { name: "Aux saveurs d'Anis", category: 'Выездной кейтеринг', city: '49260 Монтрёй-Белле, Франция', status: 'По бронированию', hours: 'Пн–Сб: 10:00–18:00', reviews: 'Отзывы клиентов', gallery: 'Банкеты и кулинарные работы', galleryTitle: 'Галерея', qrTitle: 'QR-код и поделиться' },
};

const INTERACTION_COPY = {
  fr: { copied:'Lien copié', direct:'Accès direct', scan:'Scannez ce CV Business', share:'Partager', copy:'Copier', add:"Ajouter à l’écran d’accueil", always:'Votre QR toujours avec vous', install:'Installer mon QR', open:'Ouvre cette vitrine directement depuis votre écran d’accueil.', iosAdd:'Sur iPhone : Safari → Partager → Ajouter à l’écran d’accueil.', androidAdd:'Sur Android : Chrome → Menu → Ajouter à l’écran d’accueil.', iosInstall:'Sur iPhone : Safari → Partager → Ajouter à l’écran d’accueil. Le raccourci ouvrira directement ce CV Business.', androidInstall:'Sur Android : Chrome → Menu → Installer l’application ou Ajouter à l’écran d’accueil. Le raccourci ouvrira directement ce CV Business.', close:'Fermer', premium:'CV Business Premium', artisan:'Vitrine Business Artisan', realSing:'photo réelle de la vitrine Lienora', realPlural:'photos réelles de la vitrine Lienora', creation:'réalisation' },
  ar: { copied:'تم نسخ الرابط', direct:'وصول مباشر', scan:'امسح رمز CV Business', share:'مشاركة', copy:'نسخ', add:'إضافة إلى الشاشة الرئيسية', always:'رمز QR معك دائماً', install:'تثبيت رمز QR', open:'افتح هذه الواجهة مباشرة من شاشتك الرئيسية.', iosAdd:'على iPhone: Safari ← مشاركة ← إضافة إلى الشاشة الرئيسية.', androidAdd:'على Android: Chrome ← القائمة ← إضافة إلى الشاشة الرئيسية.', iosInstall:'على iPhone: Safari ← مشاركة ← إضافة إلى الشاشة الرئيسية. سيفتح الاختصار CV Business مباشرة.', androidInstall:'على Android: Chrome ← القائمة ← تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية. سيفتح الاختصار CV Business مباشرة.', close:'إغلاق', premium:'CV Business بريميوم', artisan:'Vitrine Business حرفي', realSing:'صورة حقيقية من واجهة Lienora', realPlural:'صور حقيقية من واجهة Lienora', creation:'عمل' },
  en: { copied:'Link copied', direct:'Direct access', scan:'Scan this Business CV', share:'Share', copy:'Copy', add:'Add to home screen', always:'Keep your QR with you', install:'Install my QR', open:'Open this showcase directly from your home screen.', iosAdd:'On iPhone: Safari → Share → Add to Home Screen.', androidAdd:'On Android: Chrome → Menu → Add to Home screen.', iosInstall:'On iPhone: Safari → Share → Add to Home Screen. The shortcut will open this Business CV directly.', androidInstall:'On Android: Chrome → Menu → Install app or Add to Home screen. The shortcut will open this Business CV directly.', close:'Close', premium:'Premium Business CV', artisan:'Artisan Business Showcase', realSing:'real photo from the Lienora showcase', realPlural:'real photos from the Lienora showcase', creation:'work' },
  it: { copied:'Link copiato', direct:'Accesso diretto', scan:'Scansiona questo CV Business', share:'Condividi', copy:'Copia', add:'Aggiungi alla schermata Home', always:'Il tuo QR sempre con te', install:'Installa il mio QR', open:'Apri questa vetrina direttamente dalla schermata Home.', iosAdd:'Su iPhone: Safari → Condividi → Aggiungi a Home.', androidAdd:'Su Android: Chrome → Menu → Aggiungi a Home.', iosInstall:'Su iPhone: Safari → Condividi → Aggiungi a Home. Il collegamento aprirà direttamente questo CV Business.', androidInstall:'Su Android: Chrome → Menu → Installa app o Aggiungi a Home. Il collegamento aprirà direttamente questo CV Business.', close:'Chiudi', premium:'CV Business Premium', artisan:'Vetrina Business Artisan', realSing:'foto reale della vetrina Lienora', realPlural:'foto reali della vetrina Lienora', creation:'realizzazione' },
  ru: { copied:'Ссылка скопирована', direct:'Прямой доступ', scan:'Сканируйте этот Business CV', share:'Поделиться', copy:'Копировать', add:'Добавить на главный экран', always:'Ваш QR всегда с вами', install:'Установить мой QR', open:'Открывайте эту витрину прямо с главного экрана.', iosAdd:'На iPhone: Safari → Поделиться → На экран «Домой».', androidAdd:'На Android: Chrome → Меню → Добавить на главный экран.', iosInstall:'На iPhone: Safari → Поделиться → На экран «Домой». Ярлык откроет этот Business CV напрямую.', androidInstall:'На Android: Chrome → Меню → Установить приложение или Добавить на главный экран. Ярлык откроет этот Business CV напрямую.', close:'Закрыть', premium:'Premium Business CV', artisan:'Artisan Business-витрина', realSing:'реальное фото витрины Lienora', realPlural:'реальные фото витрины Lienora', creation:'работа' },
} as const;

const GENERIC_DEMO_NAMES = new Set(['Fiche Démonstration Dalil Tounes','بطاقة دليل تونس التجريبية','Dalil Tounes Demonstration Profile','Scheda dimostrativa Dalil Tounes','Демонстрационный профиль Dalil Tounes']);
const GENERIC_DEMO_CATEGORIES = new Set(['Plateforme tunisienne','منصة تونسية','Tunisian platform','Piattaforma tunisiana','Тунисская платформа']);
const AUX_SAVEURS_COVER = 'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-gastronomie.jpg?updatedAt=1787090066953';
const AUX_SAVEURS_LOGO = 'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-logo-v2?updatedAt=1787096555330';
const AUX_SAVEURS_GALLERY = [
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/Aux-saveurs-danis-dessert-assiette?updatedAt=1787090066955',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-mariage?updatedAt=1787090066964',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-evenement.jpg?updatedAt=1787090429737',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-plat-emporter.jpg?updatedAt=1787090477302',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-amuse-bouche.jpg?updatedAt=1787090516040',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-creation-menu.jpg?updatedAt=1787090578091',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/Aux-saveurs-danis-logo?updatedAt=1787090066957',
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-tradition?updatedAt=1787096633576',
];
const GALLERY_LABELS = ['Galerie','الصور','Gallery','Galleria','Галерея'];
const SERVICE_LABELS = ['Services','الخدمات','Servizi','Услуги'];
const LEGACY_QR_LABELS = ['QR de partage professionnel','رمز QR للمشاركة المهنية','Professional sharing QR','QR di condivisione professionale','Профессиональный QR-код'];

export function BusinessCardPreview(props: BusinessCardPreviewProps) {
  const language = props.language ?? 'fr';
  const preview = AUX_SAVEURS_PREVIEW[language];
  const t = INTERACTION_COPY[language];
  const usesGenericName = !props.name || GENERIC_DEMO_NAMES.has(props.name);
  const usesGenericCategory = !props.category || GENERIC_DEMO_CATEGORIES.has(props.category);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');
  const legacyPreviewRef = useRef<HTMLDivElement>(null);
  const qrBlockRef = useRef<HTMLDivElement>(null);
  const imageLimit = props.variant === 'premium' ? 10 : 5;
  const galleryImages = AUX_SAVEURS_GALLERY.slice(0, imageLimit);
  const previewWidthClass = props.variant === 'premium' ? 'max-w-[350px]' : 'max-w-[360px]';
  const qrValue = typeof window === 'undefined' ? 'https://dalil-tounes.com' : window.location.href;

  useEffect(() => {
    if (props.variant !== 'premium') return;
    const root = legacyPreviewRef.current; const qrBlock = qrBlockRef.current; if (!root || !qrBlock) return;
    const placeQrBlock = () => {
      root.querySelectorAll<HTMLButtonElement>('button').forEach((button) => { const label = button.textContent?.replace(/\s+/g,' ').trim() ?? ''; if (LEGACY_QR_LABELS.some((qrLabel) => label.includes(qrLabel))) button.style.display = 'none'; });
      const serviceButton = Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find((button) => { const label = button.textContent?.replace(/\s+/g,' ').trim() ?? ''; return SERVICE_LABELS.some((serviceLabel) => label.includes(serviceLabel)); });
      const serviceRow = serviceButton?.parentElement;
      if (serviceRow?.parentElement && qrBlock.parentElement !== serviceRow.parentElement) serviceRow.parentElement.insertBefore(qrBlock, serviceRow.nextSibling);
      else if (serviceRow?.parentElement && qrBlock.previousElementSibling !== serviceRow) serviceRow.parentElement.insertBefore(qrBlock, serviceRow.nextSibling);
    };
    placeQrBlock(); const observer = new MutationObserver(placeQrBlock); observer.observe(root,{childList:true,subtree:true}); return () => observer.disconnect();
  }, [language, props.variant]);

  const handlePreviewClickCapture = (event: React.MouseEvent<HTMLDivElement>) => { const button = (event.target as HTMLElement).closest('button'); if (!button) return; const label = button.textContent?.trim() ?? ''; if (GALLERY_LABELS.some((galleryLabel)=>label.includes(galleryLabel))) setGalleryOpen(true); };
  const handleShare = async () => { if (navigator.share) { await navigator.share({ title: preview.name, url: qrValue }).catch(()=>undefined); return; } await navigator.clipboard?.writeText(qrValue); setCopyFeedback(t.copied); };
  const handleCopy = async () => { await navigator.clipboard?.writeText(qrValue); setCopyFeedback(t.copied); };
  const handleAddToHome = () => { const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent); window.alert(isIos ? t.iosAdd : t.androidAdd); };
  const handleInstallQr = () => { const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent); window.alert(isIos ? t.iosInstall : t.androidInstall); };

  const photoLabel = `${galleryImages.length} ${galleryImages.length > 1 ? t.realPlural : t.realSing}`;

  return <>
    <div className={`mx-auto w-full ${previewWidthClass}`} onClickCapture={handlePreviewClickCapture} dir={language === 'ar' ? 'rtl' : 'ltr'}><div ref={legacyPreviewRef}>
      <LegacyBusinessCardPreview {...props} name={usesGenericName ? preview.name : props.name} category={usesGenericCategory ? preview.category : props.category} city={props.city ?? preview.city} status={props.status ?? preview.status} hours={props.hours ?? preview.hours} reviews={props.reviews ?? preview.reviews} gallery={props.gallery ?? `${preview.gallery} · ${galleryImages.length}`} logo={props.logo ?? AUX_SAVEURS_LOGO} coverImage={props.coverImage ?? AUX_SAVEURS_COVER} />
      {props.variant === 'premium' && <div ref={qrBlockRef} className="mt-1 overflow-hidden rounded-lg border border-[#D9B43A]/60 bg-[linear-gradient(90deg,#042E25,#011F1A)] shadow-[0_0_5px_rgba(217,180,58,0.06)]">
        <button type="button" aria-expanded={qrOpen} onClick={()=>setQrOpen(v=>!v)} className="flex min-h-9 w-full items-center gap-2 px-2.5 py-1 text-start text-[11px] font-bold text-white transition hover:bg-[#D6AF2E]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D6AF2E]"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D6AF2E]/10 text-[#F4CE55]"><QrCode className="h-3.5 w-3.5" aria-hidden="true" /></span><span className="flex-1">{preview.qrTitle}</span><ChevronRight className={`h-3.5 w-3.5 text-[#F4CE55] transition ${qrOpen ? 'rotate-90' : ''}`} aria-hidden="true" /></button>
        {qrOpen && <div className="border-t border-[#D9B43A]/30 bg-[#021E19] px-2.5 py-2.5"><div className="flex items-center gap-3"><div className="rounded-lg bg-white p-1.5"><QRCodeSVG value={qrValue} size={78} level="H" imageSettings={{src:AUX_SAVEURS_LOGO,width:20,height:20,excavate:true}} /></div><div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#D6AF2E]">{t.direct}</p><p className="mt-0.5 text-xs font-bold text-white">{t.scan}</p><div className="mt-2 grid grid-cols-3 gap-1.5"><button type="button" onClick={handleShare} className="inline-flex min-h-8 items-center justify-center gap-1 rounded-md border border-[#D9B43A]/55 px-1.5 text-[8.5px] font-bold text-[#F4CE55] hover:bg-[#D6AF2E]/10"><Share2 className="h-3 w-3" /> {t.share}</button><button type="button" onClick={handleCopy} className="inline-flex min-h-8 items-center justify-center gap-1 rounded-md border border-[#D9B43A]/55 px-1.5 text-[8.5px] font-bold text-[#F4CE55] hover:bg-[#D6AF2E]/10"><Copy className="h-3 w-3" /> {t.copy}</button><button type="button" onClick={handleAddToHome} className="inline-flex min-h-8 items-center justify-center gap-1 rounded-md border border-[#D9B43A]/55 px-1.5 text-center text-[8px] font-bold leading-tight text-[#F4CE55] hover:bg-[#D6AF2E]/10"><Home className="h-3 w-3 shrink-0" /> {t.add}</button></div><p className="mt-1 min-h-3 text-[8px] text-emerald-200">{copyFeedback}</p></div></div><div className="mt-2 rounded-lg border border-[#D9B43A]/45 bg-white/[0.035] p-2"><p className="text-[9px] font-black text-[#F4CE55]">{t.always}</p><button type="button" onClick={handleInstallQr} className="mt-1.5 flex min-h-9 w-full items-center justify-center gap-2 rounded-md border border-[#D6AF2E] bg-[#087A50] px-3 text-[10px] font-black text-white transition hover:bg-[#0A8B5B]"><QrCode className="h-3.5 w-3.5 text-[#F4CE55]" /> {t.install}</button><p className="mt-1.5 text-[8px] leading-3 text-emerald-100/75">{t.open}</p></div></div>}
      </div>}
    </div></div>
    {galleryOpen && <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label={`${preview.galleryTitle} — ${preview.name}`} onMouseDown={(event)=>{if(event.target===event.currentTarget)setGalleryOpen(false);}} dir={language === 'ar' ? 'rtl' : 'ltr'}><div className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-3xl border-2 border-[#D6AF2E] bg-[#032A22] p-4 shadow-2xl sm:p-6"><button type="button" onClick={()=>setGalleryOpen(false)} className={`${language === 'ar' ? 'absolute left-3' : 'absolute right-3'} top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#D6AF2E]/70 bg-[#011B17] text-[#F4CE55] shadow-lg transition hover:bg-[#063D31] focus:outline-none focus-visible:ring-2 focus-visible:ring-white`} aria-label={t.close}><X className="h-5 w-5" aria-hidden="true" /></button><div className={language === 'ar' ? 'pl-12' : 'pr-12'}><p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#D6AF2E]">{props.variant === 'premium' ? t.premium : t.artisan}</p><h3 className="mt-1 font-serif text-2xl font-bold text-white">{preview.galleryTitle} — {preview.name}</h3><p className="mt-1 text-sm text-emerald-100/80">{photoLabel}</p></div><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">{galleryImages.map((src,index)=><a key={src} href={src} target="_blank" rel="noreferrer" className={`group relative overflow-hidden rounded-xl border border-[#D6AF2E]/35 bg-black/20 ${index===0?'col-span-2 aspect-[16/10] sm:col-span-2':'aspect-square'}`}><img src={src} alt={`${preview.name} — ${t.creation} ${index+1}`} loading={index<3?'eager':'lazy'} decoding="async" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" /></a>)}</div></div></div>}
  </>;
}

export default BusinessCardPreview;
