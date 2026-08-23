import { Copy, ExternalLink, Home, QrCode, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { BusinessCardPreview, type BusinessCardPreviewLanguage } from './BusinessCardPreview';

const AUX_SAVEURS_LOGO =
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-logo-v2?updatedAt=1787096555330';

const DEMO_URL = 'https://dalil-tounes.com/entreprise/mahdia/skila-mahdia';

const copy: Record<BusinessCardPreviewLanguage, {
  productLabel: string;
  productTitle: string;
  productText: string;
  qrLabel: string;
  qrTitle: string;
  qrText: string;
  share: string;
  copy: string;
  add: string;
  installTitle: string;
  install: string;
  installText: string;
  powered: string;
}> = {
  fr: {
    productLabel: 'Le CV Business vivant',
    productTitle: 'Toute votre activité dans une vitrine professionnelle.',
    productText: 'Un seul lien réunit vos informations, vos actions de contact, vos services, vos avis, vos réalisations et vos réseaux sociaux.',
    qrLabel: 'Accès direct',
    qrTitle: 'Scannez ce CV Business',
    qrText: 'Le QR ouvre directement la vitrine professionnelle.',
    share: 'Partager',
    copy: 'Copier',
    add: "Ajouter à l’écran d’accueil",
    installTitle: 'Votre QR toujours avec vous',
    install: 'Installer mon QR',
    installText: 'Ouvrez cette vitrine directement depuis votre écran d’accueil.',
    powered: 'Propulsé par Dalil Tounes',
  },
  ar: {
    productLabel: 'CV Business الحي',
    productTitle: 'كل نشاطك في واجهة مهنية واحدة.',
    productText: 'رابط واحد يجمع معلوماتك ووسائل الاتصال والخدمات والآراء والأعمال وشبكات التواصل.',
    qrLabel: 'وصول مباشر',
    qrTitle: 'امسح رمز CV Business',
    qrText: 'يفتح رمز QR الواجهة المهنية مباشرة.',
    share: 'مشاركة',
    copy: 'نسخ',
    add: 'إضافة إلى الشاشة الرئيسية',
    installTitle: 'رمز QR معك دائماً',
    install: 'تثبيت QR',
    installText: 'افتح هذه الواجهة مباشرة من شاشتك الرئيسية.',
    powered: 'بدعم من دليل تونس',
  },
  en: {
    productLabel: 'The living Business CV',
    productTitle: 'Your whole business in one professional showcase.',
    productText: 'One link brings together your information, contact actions, services, reviews, work and social networks.',
    qrLabel: 'Direct access',
    qrTitle: 'Scan this Business CV',
    qrText: 'The QR code opens the professional showcase directly.',
    share: 'Share',
    copy: 'Copy',
    add: 'Add to home screen',
    installTitle: 'Keep your QR with you',
    install: 'Install my QR',
    installText: 'Open this showcase directly from your home screen.',
    powered: 'Powered by Dalil Tounes',
  },
  it: {
    productLabel: 'Il CV Business vivo',
    productTitle: 'Tutta la tua attività in una vetrina professionale.',
    productText: 'Un solo link riunisce informazioni, contatti, servizi, recensioni, lavori e social network.',
    qrLabel: 'Accesso diretto',
    qrTitle: 'Scansiona questo CV Business',
    qrText: 'Il QR apre direttamente la vetrina professionale.',
    share: 'Condividi',
    copy: 'Copia',
    add: 'Aggiungi alla schermata Home',
    installTitle: 'Il tuo QR sempre con te',
    install: 'Installa il mio QR',
    installText: 'Apri questa vetrina direttamente dalla schermata Home.',
    powered: 'Powered by Dalil Tounes',
  },
  ru: {
    productLabel: 'Живой Business CV',
    productTitle: 'Весь ваш бизнес в одной профессиональной витрине.',
    productText: 'Одна ссылка объединяет информацию, контакты, услуги, отзывы, работы и социальные сети.',
    qrLabel: 'Прямой доступ',
    qrTitle: 'Сканируйте этот Business CV',
    qrText: 'QR-код сразу открывает профессиональную витрину.',
    share: 'Поделиться',
    copy: 'Копировать',
    add: 'Добавить на главный экран',
    installTitle: 'Ваш QR всегда с вами',
    install: 'Установить мой QR',
    installText: 'Открывайте витрину прямо с главного экрана.',
    powered: 'При поддержке Dalil Tounes',
  },
};

function QrVisual({ language }: { language: BusinessCardPreviewLanguage }) {
  const t = copy[language] ?? copy.fr;
  const isRtl = language === 'ar';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-[390px] overflow-hidden rounded-[28px] border-2 border-[#D4AF37] bg-[radial-gradient(circle_at_50%_0%,rgba(20,111,77,0.32),transparent_28%),linear-gradient(180deg,#063E31_0%,#032A22_45%,#011D18_100%)] p-4 text-white shadow-[0_24px_55px_rgba(0,38,29,0.35)]"
    >
      <div className="flex justify-center">
        <img
          src={AUX_SAVEURS_LOGO}
          alt="Aux saveurs d'Anis"
          className="h-14 w-14 rounded-full border-2 border-[#D4AF37] bg-white object-cover shadow-lg"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="mt-3 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#F4CE55]">{t.qrLabel}</p>
        <h3 className="mt-1 font-serif text-xl font-bold text-white">{t.qrTitle}</h3>
        <p className="mt-1 text-xs text-emerald-100/85">{t.qrText}</p>
      </div>

      <div className="mx-auto mt-4 w-fit rounded-2xl bg-white p-3 shadow-xl">
        <QRCodeSVG value={DEMO_URL} size={180} level="M" includeMargin imageSettings={{ src: AUX_SAVEURS_LOGO, height: 38, width: 38, excavate: true }} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { icon: Share2, label: t.share },
          { icon: Copy, label: t.copy },
          { icon: Home, label: t.add },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-xl border border-[#D4AF37]/65 bg-black/10 px-2 py-2 text-center text-[10px] font-bold text-[#F4CE55]">
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-[#D4AF37]/45 bg-black/10 p-3">
        <p className="text-xs font-bold text-[#F4CE55]">{t.installTitle}</p>
        <div className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/70 bg-[#087A50] px-3 text-sm font-black text-white shadow-inner">
          <QrCode className="h-4 w-4 text-[#F4CE55]" aria-hidden="true" />
          {t.install}
        </div>
        <p className="mt-2 text-[10px] leading-4 text-emerald-100/80">{t.installText}</p>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-emerald-100/70">
        <ExternalLink className="h-3 w-3 text-[#D4AF37]" aria-hidden="true" />
        {t.powered}
      </p>
    </div>
  );
}

export function CvBusinessProductVisuals({
  language = 'fr',
  compact = false,
  showExplanations = true,
}: {
  language?: BusinessCardPreviewLanguage;
  compact?: boolean;
  showExplanations?: boolean;
}) {
  const t = copy[language] ?? copy.fr;
  const isRtl = language === 'ar';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full">
      {showExplanations && (
        <div className="mx-auto mb-5 max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">{t.productLabel}</p>
          <h3 className="mt-2 text-xl font-bold text-[#4A1D43] md:text-2xl">{t.productTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{t.productText}</p>
        </div>
      )}

      <div className={`grid items-start gap-5 ${compact ? 'lg:grid-cols-2' : 'md:grid-cols-2'} `}>
        <div className="flex justify-center">
          <BusinessCardPreview variant="premium" size={compact ? 'compact' : 'full'} interactive={false} language={language} />
        </div>
        <div className="flex justify-center">
          <QrVisual language={language} />
        </div>
      </div>
    </div>
  );
}

export default CvBusinessProductVisuals;
