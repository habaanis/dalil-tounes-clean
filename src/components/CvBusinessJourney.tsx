import { ArrowRight, Download, Smartphone } from 'lucide-react';
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

const PREVIEW_WIDTH = 230;
const PREVIEW_HEIGHT = 400;

function JourneyArrow({ rtl }: { rtl: boolean }) {
  return (
    <div className="hidden h-[400px] items-center justify-center lg:flex" aria-hidden="true">
      <ArrowRight className={`h-7 w-7 text-[#D5B257] ${rtl ? 'rotate-180' : ''}`} />
    </div>
  );
}

function PwaPhone({ language }: { language: BusinessCardPreviewLanguage }) {
  const t = COPY[language];
  const rtl = language === 'ar';
  return (
    <div className="mx-auto flex h-[400px] w-[230px] flex-col overflow-hidden rounded-[32px] border-[4px] border-[#1b1b1b] bg-[#111820] shadow-[0_16px_36px_rgba(0,0,0,0.22)]" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between px-4 pt-3 text-[9px] font-bold text-white">
        <span>11:30</span>
        <span>● ● ▬</span>
      </div>
      <div className="px-5 pt-8">
        <img src={AUX_SAVEURS_LOGO} alt="Aux saveurs d'Anis" className="h-14 w-14 rounded-[16px] object-cover shadow-lg" />
        <p className="mt-2 text-[11px] font-semibold text-white">Aux saveurs d’Anis</p>
      </div>
      <div className="mt-auto p-3">
        <div className="rounded-[17px] bg-white p-3 text-[#1b1b1b] shadow-2xl">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold">{t.installTitle}</p>
            <span className="text-sm text-gray-400">×</span>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <img src={AUX_SAVEURS_LOGO} alt="" className="h-9 w-9 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="truncate text-[9px] font-bold">Aux saveurs d’Anis</p>
              <p className="text-[8px] text-gray-500">dalil-tounes.com</p>
            </div>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <button type="button" className="rounded-lg px-2 py-1.5 text-[9px] font-semibold text-gray-700">{t.installCancel}</button>
            <button type="button" className="rounded-lg bg-[#032D21] px-2 py-1.5 text-[9px] font-bold text-white">{t.installAction}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CvBusinessJourney({ language }: { language: BusinessCardPreviewLanguage }) {
  const t = COPY[language];
  const rtl = language === 'ar';

  return (
    <section className="overflow-hidden border-y border-[#D5B257]/25 bg-[radial-gradient(circle_at_top,rgba(213,178,87,0.12),transparent_32%),linear-gradient(180deg,#fffdf8_0%,#ffffff_100%)] px-4 py-5 sm:py-6" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[900px]">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D5B257]/45 bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.11em] text-[#4A1D43] shadow-sm">
            <Smartphone className="h-3 w-3 text-[#D5B257]" aria-hidden="true" />
            {t.eyebrow}
          </div>
          <h2 className="mt-2 font-serif text-2xl font-bold text-[#2E102A] sm:text-[28px]">{t.title}</h2>
          <p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-gray-600 sm:text-[13px]">{t.subtitle}</p>
        </div>

        <div className="mt-4 grid items-start justify-center gap-y-8 lg:grid-cols-[230px_28px_230px_28px_230px] lg:gap-x-4">
          <article className="w-[230px] text-center">
            <div className="mb-2 inline-flex rounded-full bg-[#032D21] px-3 py-1.5 text-[11px] font-black text-[#F4CE55]">{t.pwaTitle}</div>
            <div className="h-[400px] w-[230px] overflow-hidden">
              <PwaPhone language={language} />
            </div>
            <p className="mx-auto mt-2 max-w-[230px] text-[12px] leading-5 text-gray-700">{t.pwaText}</p>
          </article>

          <JourneyArrow rtl={rtl} />

          <article className="w-[230px] text-center">
            <div className="mb-2 inline-flex rounded-full bg-[#032D21] px-3 py-1.5 text-[11px] font-black text-[#F4CE55]">{t.qrTitle}</div>
            <div className="relative mx-auto h-[400px] w-[230px] overflow-hidden rounded-[32px]">
              <div className="absolute left-1/2 top-0 origin-top -translate-x-1/2 scale-[0.65]">
                <CvBusinessQrVisual language={language} />
              </div>
            </div>
            <p className="mx-auto mt-2 max-w-[230px] text-[12px] leading-5 text-gray-700">{t.qrText}</p>
          </article>

          <JourneyArrow rtl={rtl} />

          <article className="w-[230px] text-center">
            <div className="mb-2 inline-flex rounded-full bg-[#032D21] px-3 py-1.5 text-[11px] font-black text-[#F4CE55]">{t.cvTitle}</div>
            <div className="relative mx-auto h-[400px] w-[230px] overflow-hidden rounded-[32px]">
              <div className="absolute left-1/2 top-0 origin-top -translate-x-1/2 scale-[0.80]">
                <BusinessCardPreview
                  variant="premium"
                  size="compact"
                  language={language}
                  name="Aux saveurs d’Anis"
                  category={language === 'ar' ? 'ممون حفلات ومناسبات' : 'Traiteur événementiel'}
                />
              </div>
            </div>
            <p className="mx-auto mt-2 max-w-[230px] text-[12px] leading-5 text-gray-700">{t.cvText}</p>
          </article>
        </div>

        <div className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 rounded-xl border border-[#D5B257]/45 bg-[#032D21] px-3 py-2 text-center text-[11px] font-bold text-white shadow-sm">
          <Download className="h-3.5 w-3.5 shrink-0 text-[#F4CE55]" aria-hidden="true" />
          <span>{language === 'ar' ? 'التطبيق = وصول سريع • QR Business = مشاركة فورية • CV Business = العرض المهني الكامل' : 'Application = accès rapide • QR Business = partage immédiat • CV Business = présentation professionnelle complète'}</span>
        </div>
      </div>
    </section>
  );
}
