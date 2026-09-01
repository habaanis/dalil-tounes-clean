import { Download, ExternalLink, Home, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { BusinessCardPreview, type BusinessCardPreviewLanguage } from './BusinessCardPreview';

export const AUX_SAVEURS_COVER =
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-gastronomie.jpg?updatedAt=1787090066953';
export const AUX_SAVEURS_LOGO =
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-logo-v2?updatedAt=1787096555330';

const DEMO_URL = 'https://dalil-tounes.com/businesses';

type VisualCopy = {
  productLabel: string;
  productTitle: string;
  productText: string;
  name: string;
  category: string;
  scan: string;
  share: string;
  download: string;
  add: string;
  open: string;
  powered: string;
};

const copy: Record<BusinessCardPreviewLanguage, VisualCopy> = {
  fr: {
    productLabel: 'Le CV Business vivant',
    productTitle: 'Toute votre activité dans une vitrine professionnelle.',
    productText: 'Un seul lien réunit vos informations, vos actions de contact, vos services, vos avis, vos réalisations et vos réseaux sociaux.',
    name: "Aux saveurs d'Anis",
    category: 'Traiteur événementiel',
    scan: 'Présentez ce QR pour ouvrir directement le CV Business.',
    share: 'Partager',
    download: 'Télécharger',
    add: "Ajouter à l’écran d’accueil",
    open: 'Ouvrir le CV Business',
    powered: 'Propulsé par Dalil Tounes',
  },
  ar: {
    productLabel: 'CV Business الحي',
    productTitle: 'كل نشاطك في واجهة مهنية واحدة.',
    productText: 'رابط واحد يجمع معلوماتك ووسائل الاتصال والخدمات والآراء والأعمال وشبكات التواصل.',
    name: "Aux saveurs d'Anis",
    category: 'متعهد حفلات وتموين',
    scan: 'قدّم رمز QR هذا لفتح السيرة المهنية مباشرة.',
    share: 'مشاركة',
    download: 'تنزيل',
    add: 'إضافة إلى الشاشة الرئيسية',
    open: 'فتح السيرة المهنية',
    powered: 'بدعم من دليل تونس',
  },
  en: {
    productLabel: 'The living Business CV',
    productTitle: 'Your whole business in one professional showcase.',
    productText: 'One link brings together your information, contact actions, services, reviews, work and social networks.',
    name: "Aux saveurs d'Anis",
    category: 'Event caterer',
    scan: 'Present this QR to open the Business CV directly.',
    share: 'Share',
    download: 'Download',
    add: 'Add to home screen',
    open: 'Open Business CV',
    powered: 'Powered by Dalil Tounes',
  },
  it: {
    productLabel: 'Il CV Business vivo',
    productTitle: 'Tutta la tua attività in una vetrina professionale.',
    productText: 'Un solo link riunisce informazioni, contatti, servizi, recensioni, lavori e social network.',
    name: "Aux saveurs d'Anis",
    category: 'Catering per eventi',
    scan: 'Presenta questo QR per aprire direttamente il CV Business.',
    share: 'Condividi',
    download: 'Scarica',
    add: 'Aggiungi alla schermata Home',
    open: 'Apri il CV Business',
    powered: 'Powered by Dalil Tounes',
  },
  ru: {
    productLabel: 'Живой Business CV',
    productTitle: 'Весь ваш бизнес в одной профессиональной витрине.',
    productText: 'Одна ссылка объединяет информацию, контакты, услуги, отзывы, работы и социальные сети.',
    name: "Aux saveurs d'Anis",
    category: 'Выездной кейтеринг',
    scan: 'Покажите этот QR-код, чтобы сразу открыть Business CV.',
    share: 'Поделиться',
    download: 'Скачать',
    add: 'Добавить на главный экран',
    open: 'Открыть Business CV',
    powered: 'При поддержке Dalil Tounes',
  },
};

export type CvBusinessQrVisualProps = {
  language?: BusinessCardPreviewLanguage;
  name?: string;
  category?: string;
  coverImage?: string;
  logo?: string;
  qrValue?: string;
  shareLabel?: string;
  downloadLabel?: string;
  addLabel?: string;
  openLabel?: string;
  scanText?: string;
  poweredText?: string;
  openHref?: string;
  onShare?: () => void;
  onDownload?: () => void;
  onInstall?: () => void;
  qrId?: string;
  interactive?: boolean;
};

export function CvBusinessQrVisual({
  language = 'fr',
  name,
  category,
  coverImage = AUX_SAVEURS_COVER,
  logo = AUX_SAVEURS_LOGO,
  qrValue = DEMO_URL,
  shareLabel,
  downloadLabel,
  addLabel,
  openLabel,
  scanText,
  poweredText,
  openHref,
  onShare,
  onDownload,
  onInstall,
  qrId,
  interactive = false,
}: CvBusinessQrVisualProps) {
  const t = copy[language] ?? copy.fr;
  const isRtl = language === 'ar';
  const displayName = name || t.name;
  const displayCategory = category || t.category;
  const actions = [
    { icon: Share2, label: shareLabel || t.share, action: onShare },
    { icon: Download, label: downloadLabel || t.download, action: onDownload },
    { icon: Home, label: addLabel || t.add, action: onInstall },
  ];

  return (
    <section
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-label={`${displayName} — QR Business`}
      className="mx-auto w-full max-w-[354px] rounded-[30px] border-[2px] border-[#D6B44A] bg-[#003D32] px-[13px] pb-[15px] pt-[13px] text-white shadow-[0_18px_48px_rgba(0,43,34,0.20)]"
    >
      <div className="overflow-hidden rounded-[18px] border border-[#D6B44A]/45 bg-[#073B32]">
        <img
          src={coverImage}
          alt=""
          className="block h-[142px] w-full object-cover"
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="relative -mt-[43px] flex justify-center">
        <div className="grid h-[88px] w-[88px] place-items-center overflow-hidden rounded-full border-[2px] border-[#D6B44A] bg-[#003D32] p-[3px] shadow-[0_5px_16px_rgba(0,0,0,0.18)]">
          <img src={logo} alt={`Logo ${displayName}`} className="h-full w-full rounded-full object-cover" />
        </div>
      </div>

      <div className="px-3 text-center">
        <h3 className="mt-[10px] font-serif text-[28px] font-bold leading-[1.05] tracking-[-0.015em] text-[#FFFDF7]">
          {displayName}
        </h3>
        <p className="mt-[4px] text-[14px] font-medium leading-tight text-[#DAB94E]">{displayCategory}</p>
        <p className="mx-auto mt-[13px] max-w-[278px] text-[13px] leading-[1.45] text-white/90">
          {scanText || t.scan}
        </p>
      </div>

      <div className="mx-auto mt-[14px] w-[242px] rounded-[16px] bg-white p-[10px] shadow-[0_8px_20px_rgba(0,0,0,0.14)]">
        <div className="relative mx-auto h-[222px] w-[222px]">
          <QRCodeSVG
            id={qrId}
            value={qrValue}
            size={222}
            level="H"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#000000"
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 grid h-[56px] w-[56px] -translate-x-1/2 -translate-y-1/2 place-items-center overflow-hidden rounded-full border-[3px] border-white bg-[#003D32] shadow-md">
            <img src={logo} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="mx-[7px] mt-[15px] grid grid-cols-3 divide-x divide-[#D6B44A]/25 rtl:divide-x-reverse">
        {actions.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            type="button"
            onClick={interactive ? action : undefined}
            className="flex min-h-[62px] min-w-0 flex-col items-center justify-start gap-[6px] px-1 py-[7px] text-center text-[#DAB94E]"
            aria-label={label}
          >
            <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
            <span className="max-w-[92px] text-[10px] font-medium leading-[1.18]">{label}</span>
          </button>
        ))}
      </div>

      {openHref ? (
        <a
          href={openHref}
          className="mx-[8px] mt-[4px] flex min-h-[46px] items-center justify-center gap-2 rounded-[11px] border border-[#D6B44A] px-4 py-2.5 text-[14px] font-bold text-white no-underline"
        >
          <ExternalLink size={17} strokeWidth={1.8} aria-hidden="true" />
          {openLabel || t.open}
        </a>
      ) : (
        <div className="mx-[8px] mt-[4px] flex min-h-[46px] items-center justify-center gap-2 rounded-[11px] border border-[#D6B44A] px-4 py-2.5 text-[14px] font-bold text-white">
          <ExternalLink size={17} strokeWidth={1.8} aria-hidden="true" />
          {openLabel || t.open}
        </div>
      )}

      <p className="mb-0 mt-[14px] text-center text-[10px] font-normal text-white/62">{poweredText || t.powered}</p>
    </section>
  );
}

export function CvBusinessProductVisuals({
  language = 'fr',
  showExplanations = true,
}: {
  language?: BusinessCardPreviewLanguage;
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

      <div className="grid items-start gap-5 md:grid-cols-2">
        <div className="flex justify-center">
          <BusinessCardPreview variant="premium" size="compact" interactive={false} language={language} />
        </div>
        <div className="flex justify-center">
          <CvBusinessQrVisual language={language} />
        </div>
      </div>
    </div>
  );
}

export default CvBusinessProductVisuals;
