import { useEffect, useState } from 'react';
import { ArrowRight, Download, Smartphone, X, ZoomIn } from 'lucide-react';
import type { BusinessCardPreviewLanguage } from './BusinessCardPreview';
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
  summary: string;
  openPreview: string;
  closePreview: string;
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
    summary: 'Application = accès rapide • QR Business = partage immédiat • CV Business = présentation professionnelle complète',
    openPreview: 'Agrandir le visuel',
    closePreview: 'Fermer le visuel',
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
    summary: 'التطبيق = وصول سريع • QR Business = مشاركة فورية • CV Business = العرض المهني الكامل',
    openPreview: 'تكبير الصورة',
    closePreview: 'إغلاق الصورة',
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
    summary: 'App = quick access • Business QR = instant sharing • Business CV = complete professional presentation',
    openPreview: 'Enlarge visual',
    closePreview: 'Close visual',
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
    summary: 'App = accesso rapido • QR Business = condivisione immediata • CV Business = presentazione professionale completa',
    openPreview: 'Ingrandisci il visual',
    closePreview: 'Chiudi il visual',
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
    summary: 'Приложение = быстрый доступ • Business QR = мгновенная отправка • Business CV = полная профессиональная презентация',
    openPreview: 'Увеличить изображение',
    closePreview: 'Закрыть изображение',
  },
};

function JourneyArrow({ rtl }: { rtl: boolean }) {
  return (
    <div className="hidden h-[360px] items-center justify-center lg:flex" aria-hidden="true">
      <ArrowRight className={`h-6 w-6 text-[#D5B257] ${rtl ? 'rotate-180' : ''}`} />
    </div>
  );
}

function PwaPhone({ language }: { language: BusinessCardPreviewLanguage }) {
  const t = COPY[language];
  const rtl = language === 'ar';
  return (
    <div className="mx-auto flex h-[360px] w-[180px] flex-col overflow-hidden rounded-[28px] border-[4px] border-[#1b1b1b] bg-[#111820] shadow-[0_16px_36px_rgba(0,0,0,0.22)]" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between px-3.5 pt-2.5 text-[8px] font-bold text-white">
        <span>11:30</span>
        <span>● ● ▬</span>
      </div>
      <div className="px-4 pt-8">
        <img src={AUX_SAVEURS_LOGO} alt="Aux saveurs d'Anis" className="h-12 w-12 rounded-[14px] object-cover shadow-lg" />
        <p className="mt-2 text-[10px] font-semibold text-white">Aux saveurs d’Anis</p>
      </div>
      <div className="mt-auto p-2.5">
        <div className="rounded-[16px] bg-white p-2.5 text-[#1b1b1b] shadow-2xl">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold">{t.installTitle}</p>
            <span className="text-sm text-gray-400">×</span>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <img src={AUX_SAVEURS_LOGO} alt="" className="h-8 w-8 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="truncate text-[8px] font-bold">Aux saveurs d’Anis</p>
              <p className="text-[7px] text-gray-500">dalil-tounes.com</p>
            </div>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-1">
            <button type="button" className="rounded-lg px-2 py-1 text-[8px] font-semibold text-gray-700">{t.installCancel}</button>
            <button type="button" className="rounded-lg bg-[#032D21] px-2 py-1 text-[8px] font-bold text-white">{t.installAction}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

type JourneyVisual = 'pwa' | 'qr' | 'cv';

function PreviewButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-2 top-2 z-20 grid h-8 w-8 cursor-zoom-in place-items-center rounded-full border border-[#D5B257]/70 bg-white/95 text-[#032D21] shadow-md transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#D5B257]"
      aria-label={label}
      title={label}
    >
      <ZoomIn className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function ExpandedJourneyVisual({
  language,
  visual,
  onClose,
}: {
  language: BusinessCardPreviewLanguage;
  visual: JourneyVisual;
  onClose: () => void;
}) {
  const t = COPY[language];
  const title = visual === 'pwa' ? t.pwaTitle : visual === 'qr' ? t.qrTitle : t.cvTitle;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${t.openPreview} — ${title}`}
        className="relative max-h-[94dvh] max-w-full overflow-auto rounded-3xl bg-white p-4 shadow-2xl sm:p-5"
      >
        <button
          type="button"
          onClick={onClose}
          className="sticky top-0 z-30 ml-auto grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:border-[#D5B257] hover:text-[#032D21] focus:outline-none focus:ring-2 focus:ring-[#D5B257] rtl:ml-0 rtl:mr-auto"
          aria-label={t.closePreview}
          title={t.closePreview}
          autoFocus
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="mt-2 flex min-w-0 justify-center">
          {visual === 'pwa' && (
            <div className="h-[486px] w-[243px] overflow-hidden sm:h-[540px] sm:w-[270px]">
              <div className="origin-top-left scale-[1.35] sm:scale-150">
                <PwaPhone language={language} />
              </div>
            </div>
          )}
          {visual === 'qr' && (
            <div className="pointer-events-none w-[min(354px,calc(100vw-48px))]">
              <CvBusinessQrVisual language={language} />
            </div>
          )}
          {visual === 'cv' && (
            <img
              src="/images/cv-business-professionnel-aux-saveurs-anis.png"
              alt={`${t.cvTitle} — Aux saveurs d’Anis`}
              className="max-h-[82dvh] max-w-[calc(100vw-48px)] object-contain"
              decoding="async"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function CvBusinessJourney({ language }: { language: BusinessCardPreviewLanguage }) {
  const t = COPY[language];
  const rtl = language === 'ar';
  const [expandedVisual, setExpandedVisual] = useState<JourneyVisual | null>(null);

  return (
    <section className="border-y border-[#D5B257]/25 bg-[radial-gradient(circle_at_top,rgba(213,178,87,0.12),transparent_32%),linear-gradient(180deg,#fffdf8_0%,#ffffff_100%)] px-4 py-5 sm:py-6" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[900px]">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D5B257]/45 bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.11em] text-[#4A1D43] shadow-sm">
            <Smartphone className="h-3 w-3 text-[#D5B257]" aria-hidden="true" />
            {t.eyebrow}
          </div>
          <h2 className="mt-2 font-serif text-2xl font-bold text-[#2E102A] sm:text-[28px]">{t.title}</h2>
          <p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-gray-600 sm:text-[13px]">{t.subtitle}</p>
        </div>

        <div className="mt-4 grid items-start justify-center gap-y-5 lg:grid-cols-[180px_32px_180px_32px_180px] lg:gap-x-3">
          <article className="w-[180px] text-center">
            <div className="mb-1.5 inline-flex rounded-full bg-[#032D21] px-2.5 py-1 text-[10px] font-black text-[#F4CE55]">{t.pwaTitle}</div>
            <div className="relative mx-auto w-[180px]">
              <PwaPhone language={language} />
              <PreviewButton label={`${t.openPreview} — ${t.pwaTitle}`} onClick={() => setExpandedVisual('pwa')} />
            </div>
            <p className="mx-auto mt-2 max-w-[180px] text-[11px] leading-4.5 text-gray-700">{t.pwaText}</p>
          </article>

          <JourneyArrow rtl={rtl} />

          <article className="w-[180px] text-center">
            <div className="mb-1.5 inline-flex rounded-full bg-[#032D21] px-2.5 py-1 text-[10px] font-black text-[#F4CE55]">{t.qrTitle}</div>
            <div className="relative mx-auto h-[360px] w-[180px] overflow-hidden">
              <div className="absolute left-[2px] top-0 w-[354px] origin-top-left scale-[0.496] rtl:left-auto rtl:right-[2px] rtl:origin-top-right">
                <CvBusinessQrVisual language={language} />
              </div>
              <PreviewButton label={`${t.openPreview} — ${t.qrTitle}`} onClick={() => setExpandedVisual('qr')} />
            </div>
            <p className="mx-auto mt-2 max-w-[180px] text-[11px] leading-4.5 text-gray-700">{t.qrText}</p>
          </article>

          <JourneyArrow rtl={rtl} />

          <article className="w-[180px] text-center">
            <div className="mb-1.5 inline-flex rounded-full bg-[#032D21] px-2.5 py-1 text-[10px] font-black text-[#F4CE55]">{t.cvTitle}</div>
            <div className="relative mx-auto flex h-[360px] w-[180px] items-center justify-center overflow-hidden">
              <img
                src="/images/cv-business-professionnel-aux-saveurs-anis.png"
                alt={`${t.cvTitle} — Aux saveurs d’Anis`}
                className="h-[374px] w-auto max-w-none object-contain"
                loading="lazy"
                decoding="async"
              />
              <PreviewButton label={`${t.openPreview} — ${t.cvTitle}`} onClick={() => setExpandedVisual('cv')} />
            </div>
            <p className="mx-auto mt-2 max-w-[180px] text-[11px] leading-4.5 text-gray-700">{t.cvText}</p>
          </article>
        </div>

        <div className="mx-auto mt-4 flex max-w-2xl items-center justify-center gap-2 rounded-xl border border-[#D5B257]/45 bg-[#032D21] px-3 py-2 text-center text-[11px] font-bold text-white shadow-sm">
          <Download className="h-3.5 w-3.5 shrink-0 text-[#F4CE55]" aria-hidden="true" />
          <span>{t.summary}</span>
        </div>
      </div>

      {expandedVisual && (
        <ExpandedJourneyVisual
          language={language}
          visual={expandedVisual}
          onClose={() => setExpandedVisual(null)}
        />
      )}
    </section>
  );
}
