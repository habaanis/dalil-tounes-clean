import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, QrCode, Smartphone, UserRound } from 'lucide-react';
import { BusinessCardPreview, type BusinessCardPreviewLanguage } from './BusinessCardPreview';
import { CvBusinessQrVisual, AUX_SAVEURS_LOGO } from './CvBusinessQrVisual';

const COPY: Record<BusinessCardPreviewLanguage, {
  eyebrow: string;
  title: string;
  subtitle: string;
  pwaTitle: string;
  pwaText: string;
  installTitle: string;
  installCancel: string;
  installAction: string;
  qrTitle: string;
  qrText: string;
  cvTitle: string;
  cvText: string;
}> = {
  fr: {
    eyebrow: 'Votre CV Business dans votre poche',
    title: '3 outils complémentaires, un seul parcours',
    subtitle: 'Votre application vous donne un accès rapide à votre QR Business. Le QR ouvre ensuite votre CV Business professionnel.',
    pwaTitle: '1. Application mobile (PWA)',
    pwaText: 'Votre activité accessible depuis l’écran d’accueil comme une application.',
    installTitle: "Installer l’application",
    installCancel: 'Annuler',
    installAction: 'Installer',
    qrTitle: '2. QR Business',
    qrText: 'Présentez, partagez ou imprimez votre QR Business.',
    cvTitle: '3. CV Business',
    cvText: 'Votre présentation professionnelle complète, toujours accessible.',
  },
  ar: {
    eyebrow: 'CV Business الخاص بك دائمًا معك',
    title: '3 أدوات متكاملة، في مسار واحد',
    subtitle: 'يمنحك التطبيق وصولًا سريعًا إلى QR Business، ومنه يتم فتح CV Business المهني الخاص بنشاطك.',
    pwaTitle: '1. تطبيق الهاتف (PWA)',
    pwaText: 'نشاطك متاح من الشاشة الرئيسية مثل تطبيق.',
    installTitle: 'تثبيت التطبيق',
    installCancel: 'إلغاء',
    installAction: 'تثبيت',
    qrTitle: '2. QR Business',
    qrText: 'اعرض QR Business أو شاركه أو اطبعه بسهولة.',
    cvTitle: '3. CV Business',
    cvText: 'عرضك المهني الكامل متاح دائمًا.',
  },
  en: {
    eyebrow: 'Your Business CV in your pocket',
    title: '3 complementary tools, one simple journey',
    subtitle: 'Your app gives you quick access to your Business QR. The QR then opens your professional Business CV.',
    pwaTitle: '1. Mobile app (PWA)',
    pwaText: 'Your business is available from the home screen like an app.',
    installTitle: 'Install app',
    installCancel: 'Cancel',
    installAction: 'Install',
    qrTitle: '2. Business QR',
    qrText: 'Show, share or print your Business QR.',
    cvTitle: '3. Business CV',
    cvText: 'Your complete professional presentation, always accessible.',
  },
  it: {
    eyebrow: 'Il tuo CV Business sempre con te',
    title: '3 strumenti complementari, un solo percorso',
    subtitle: "L’app ti dà accesso rapido al QR Business. Il QR apre poi il tuo CV Business professionale.",
    pwaTitle: '1. Applicazione mobile (PWA)',
    pwaText: 'La tua attività è accessibile dalla schermata Home come un’app.',
    installTitle: "Installa l’applicazione",
    installCancel: 'Annulla',
    installAction: 'Installa',
    qrTitle: '2. QR Business',
    qrText: 'Mostra, condividi o stampa il tuo QR Business.',
    cvTitle: '3. CV Business',
    cvText: 'La tua presentazione professionale completa, sempre accessibile.',
  },
  ru: {
    eyebrow: 'Ваш Business CV всегда с вами',
    title: '3 взаимосвязанных инструмента, один путь',
    subtitle: 'Приложение даёт быстрый доступ к Business QR, а QR открывает ваш профессиональный Business CV.',
    pwaTitle: '1. Мобильное приложение (PWA)',
    pwaText: 'Ваш бизнес доступен с главного экрана как приложение.',
    installTitle: 'Установить приложение',
    installCancel: 'Отмена',
    installAction: 'Установить',
    qrTitle: '2. Business QR',
    qrText: 'Показывайте, отправляйте или печатайте ваш Business QR.',
    cvTitle: '3. Business CV',
    cvText: 'Ваша полная профессиональная презентация всегда доступна.',
  },
};

function PwaPhone({ language }: { language: BusinessCardPreviewLanguage }) {
  const t = COPY[language];
  const rtl = language === 'ar';
  return (
    <div className="mx-auto flex h-[380px] w-[206px] flex-col overflow-hidden rounded-[30px] border-[4px] border-[#1b1b1b] bg-[#111820] shadow-[0_16px_34px_rgba(0,0,0,0.20)]" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between px-4 pt-3 text-[8px] font-bold text-white"><span>11:30</span><span>● ● ▬</span></div>
      <div className="px-5 pt-7">
        <img src={AUX_SAVEURS_LOGO} alt="Aux saveurs d'Anis" className="h-12 w-12 rounded-[14px] object-cover shadow-lg" />
        <p className="mt-2.5 text-[10px] font-semibold text-white">Aux saveurs d’Anis</p>
      </div>
      <div className="mt-auto p-3">
        <div className="rounded-[17px] bg-white p-3 text-[#1b1b1b] shadow-2xl">
          <div className="flex items-center justify-between"><p className="text-[9px] font-bold">{t.installTitle}</p><span className="text-sm text-gray-400">×</span></div>
          <div className="mt-2 flex items-center gap-2">
            <img src={AUX_SAVEURS_LOGO} alt="" className="h-8 w-8 rounded-lg object-cover" />
            <div className="min-w-0"><p className="truncate text-[8px] font-bold">Aux saveurs d’Anis</p><p className="text-[7px] text-gray-500">dalil-tounes.com</p></div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button type="button" className="rounded-xl px-2 py-1.5 text-[8px] font-semibold text-gray-700">{t.installCancel}</button>
            <button type="button" className="rounded-xl bg-[#032D21] px-2 py-1.5 text-[8px] font-bold text-white">{t.installAction}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CvBusinessJourney({ language }: { language: BusinessCardPreviewLanguage }) {
  const t = COPY[language];
  const rtl = language === 'ar';
  const [active, setActive] = useState(0);
  const items = [
    { title: t.pwaTitle, text: t.pwaText, icon: Smartphone },
    { title: t.qrTitle, text: t.qrText, icon: QrCode },
    { title: t.cvTitle, text: t.cvText, icon: UserRound },
  ];
  const previous = () => setActive((active + 2) % 3);
  const next = () => setActive((active + 1) % 3);

  return (
    <section className="border-y border-[#D5B257]/25 bg-[radial-gradient(circle_at_top,rgba(213,178,87,0.12),transparent_32%),linear-gradient(180deg,#fffdf8_0%,#ffffff_100%)] px-4 py-4 sm:py-5" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[940px]">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D5B257]/45 bg-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.11em] text-[#4A1D43] shadow-sm"><Smartphone className="h-3 w-3 text-[#D5B257]" />{t.eyebrow}</div>
          <h2 className="mt-2 font-serif text-2xl font-bold text-[#2E102A] sm:text-[27px]">{t.title}</h2>
          <p className="mx-auto mt-1 max-w-2xl text-xs leading-5 text-gray-600 sm:text-[13px]">{t.subtitle}</p>
        </div>

        <div className="mt-3 grid overflow-hidden rounded-2xl border border-[#D5B257]/35 bg-white shadow-sm sm:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon;
            const selected = active === index;
            return (
              <button key={item.title} type="button" onClick={() => setActive(index)} className={`flex items-center justify-center gap-2 px-4 py-2.5 text-[12px] font-black transition ${selected ? 'bg-[#032D21] text-[#F4CE55]' : 'bg-white text-[#2E102A] hover:bg-[#fffaf0]'}`}>
                <Icon className="h-4 w-4" />{item.title}
              </button>
            );
          })}
        </div>

        <div className="relative mt-3 rounded-[20px] border border-[#D5B257]/40 bg-white px-4 py-1.5 shadow-[0_12px_28px_rgba(46,16,42,0.06)] sm:px-5 sm:py-2">
          <button type="button" onClick={previous} aria-label="Previous" className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#D5B257]/50 bg-white p-2 text-[#B98920] shadow-sm hover:bg-[#fff8e8]"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" onClick={next} aria-label="Next" className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#D5B257]/50 bg-white p-2 text-[#B98920] shadow-sm hover:bg-[#fff8e8]"><ChevronRight className="h-5 w-5" /></button>

          <div className="grid min-h-[380px] items-center gap-3 md:grid-cols-[220px_1fr_55px] lg:grid-cols-[230px_1fr_60px]">
            <div className="hidden md:block pl-2">
              <p className="font-serif text-[21px] font-bold leading-tight text-[#032D21]">{items[active].title}</p>
              <div className="mt-2 h-px w-8 bg-[#D5B257]" />
              <p className="mt-3 max-w-[210px] text-[13px] leading-5 text-gray-600">{items[active].text}</p>
            </div>

            <div className="flex min-h-[380px] items-center justify-center overflow-visible">
              {active === 0 && <PwaPhone language={language} />}
              {active === 1 && <div className="origin-center scale-[0.67] sm:scale-[0.70]"><CvBusinessQrVisual language={language} /></div>}
              {active === 2 && <div className="origin-center scale-[0.60] sm:scale-[0.64]"><BusinessCardPreview variant="premium" size="compact" language={language} name="Aux saveurs d’Anis" category={language === 'ar' ? 'ممون حفلات ومناسبات' : 'Traiteur événementiel'} /></div>}
            </div>

            <div className="hidden md:block" aria-hidden="true" />
          </div>

          <p className="mt-1 text-center text-sm leading-5 text-gray-700 md:hidden">{items[active].text}</p>
          <div className="mt-1.5 flex justify-center gap-2">
            {[0,1,2].map((index) => <button key={index} type="button" onClick={() => setActive(index)} aria-label={`Slide ${index + 1}`} className={`h-2.5 w-2.5 rounded-full ${active === index ? 'bg-[#032D21]' : 'bg-gray-300'}`} />)}
          </div>
        </div>

        <div className="mx-auto mt-3 flex max-w-[880px] items-center justify-center gap-2 rounded-xl border border-[#D5B257]/45 bg-[#032D21] px-4 py-2 text-center text-[11px] font-bold text-white shadow-sm">
          <Download className="h-3.5 w-3.5 shrink-0 text-[#F4CE55]" />
          <span>{language === 'ar' ? 'التطبيق = وصول سريع • QR Business = مشاركة فورية • CV Business = العرض المهني الكامل' : 'Application = accès rapide • QR Business = partage immédiat • CV Business = présentation professionnelle complète'}</span>
        </div>
      </div>
    </section>
  );
}
