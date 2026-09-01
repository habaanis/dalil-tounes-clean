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

function JourneyArrow({ rtl }: { rtl: boolean }) {
  return (
    <div className="hidden items-center justify-center lg:flex" aria-hidden="true">
      <ArrowRight className={`h-9 w-9 text-[#D5B257] ${rtl ? 'rotate-180' : ''}`} />
    </div>
  );
}

function PwaPhone({ language }: { language: BusinessCardPreviewLanguage }) {
  const t = COPY[language];
  const rtl = language === 'ar';
  return (
    <div className="mx-auto flex h-[570px] w-[286px] flex-col overflow-hidden rounded-[42px] border-[5px] border-[#1b1b1b] bg-[#111820] shadow-[0_24px_55px_rgba(0,0,0,0.28)]" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between px-5 pt-4 text-[11px] font-bold text-white">
        <span>11:30</span>
        <span>● ● ▬</span>
      </div>
      <div className="px-7 pt-16">
        <img src={AUX_SAVEURS_LOGO} alt="Aux saveurs d'Anis" className="h-20 w-20 rounded-[22px] object-cover shadow-lg" />
        <p className="mt-3 text-sm font-semibold text-white">Aux saveurs d’Anis</p>
      </div>
      <div className="mt-auto p-4">
        <div className="rounded-[24px] bg-white p-4 text-[#1b1b1b] shadow-2xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">{t.installTitle}</p>
            <span className="text-lg text-gray-400">×</span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <img src={AUX_SAVEURS_LOGO} alt="" className="h-12 w-12 rounded-xl object-cover" />
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">Aux saveurs d’Anis</p>
              <p className="text-[10px] text-gray-500">dalil-tounes.com</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" className="rounded-xl px-3 py-2 text-xs font-semibold text-gray-700">{t.installCancel}</button>
            <button type="button" className="rounded-xl bg-[#032D21] px-3 py-2 text-xs font-bold text-white">{t.installAction}</button>
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
    <section className="border-y border-[#D5B257]/25 bg-[radial-gradient(circle_at_top,rgba(213,178,87,0.12),transparent_32%),linear-gradient(180deg,#fffdf8_0%,#ffffff_100%)] px-4 py-10 sm:py-12" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[1380px]">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D5B257]/45 bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.13em] text-[#4A1D43] shadow-sm">
            <Smartphone className="h-3.5 w-3.5 text-[#D5B257]" aria-hidden="true" />
            {t.eyebrow}
          </div>
          <h2 className="mt-4 font-serif text-3xl font-bold text-[#2E102A] sm:text-4xl">{t.title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">{t.subtitle}</p>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <article className="text-center">
            <div className="mb-3 inline-flex rounded-full bg-[#032D21] px-4 py-2 text-sm font-black text-[#F4CE55]">{t.pwaTitle}</div>
            <PwaPhone language={language} />
            <p className="mx-auto mt-4 max-w-[310px] text-sm leading-6 text-gray-700">{t.pwaText}</p>
          </article>

          <JourneyArrow rtl={rtl} />

          <article className="text-center">
            <div className="mb-3 inline-flex rounded-full bg-[#032D21] px-4 py-2 text-sm font-black text-[#F4CE55]">{t.qrTitle}</div>
            <div className="mx-auto h-[570px] w-[286px] overflow-visible">
              <div className="origin-top-left scale-[0.80] rtl:origin-top-right">
                <CvBusinessQrVisual language={language} />
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-[310px] text-sm leading-6 text-gray-700">{t.qrText}</p>
          </article>

          <JourneyArrow rtl={rtl} />

          <article className="text-center">
            <div className="mb-3 inline-flex rounded-full bg-[#032D21] px-4 py-2 text-sm font-black text-[#F4CE55]">{t.cvTitle}</div>
            <div className="mx-auto h-[570px] w-[286px] overflow-hidden">
              <BusinessCardPreview
                variant="premium"
                size="compact"
                language={language}
                name="Aux saveurs d’Anis"
                category={language === 'ar' ? 'ممون حفلات ومناسبات' : 'Traiteur événementiel'}
              />
            </div>
            <p className="mx-auto mt-4 max-w-[310px] text-sm leading-6 text-gray-700">{t.cvText}</p>
          </article>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-2 rounded-2xl border border-[#D5B257]/45 bg-[#032D21] px-4 py-3 text-center text-sm font-bold text-white shadow-sm">
          <Download className="h-4 w-4 shrink-0 text-[#F4CE55]" aria-hidden="true" />
          <span>{language === 'ar' ? 'التطبيق = وصول سريع • QR Business = مشاركة فورية • CV Business = العرض المهني الكامل' : 'Application = accès rapide • QR Business = partage immédiat • CV Business = présentation professionnelle complète'}</span>
        </div>
      </div>
    </section>
  );
}
