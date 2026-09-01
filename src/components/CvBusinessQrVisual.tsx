import { Download, ExternalLink, Home, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { BusinessCardPreviewLanguage } from './BusinessCardPreviewBase';

export const AUX_SAVEURS_COVER =
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-gastronomie.jpg?updatedAt=1787090066953';
export const AUX_SAVEURS_LOGO =
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-logo-v2?updatedAt=1787096555330';

const DEMO_URL = 'https://dalil-tounes.com/businesses';
const REFERENCE_GREEN = '#032D21';
const REFERENCE_GOLD = '#D5B257';

type VisualCopy = {
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
  fr: { name: "Aux saveurs d'Anis", category: 'Traiteur événementiel', scan: 'Présentez ce QR pour ouvrir directement le CV Business.', share: 'Partager', download: 'Télécharger', add: "Ajouter à l’écran d’accueil", open: 'Ouvrir le CV Business', powered: 'Propulsé par Dalil Tounes' },
  ar: { name: "Aux saveurs d'Anis", category: 'متعهد حفلات وتموين', scan: 'قدّم رمز QR هذا لفتح السيرة المهنية مباشرة.', share: 'مشاركة', download: 'تنزيل', add: 'إضافة إلى الشاشة الرئيسية', open: 'فتح السيرة المهنية', powered: 'بدعم من دليل تونس' },
  en: { name: "Aux saveurs d'Anis", category: 'Event caterer', scan: 'Present this QR to open the Business CV directly.', share: 'Share', download: 'Download', add: 'Add to home screen', open: 'Open Business CV', powered: 'Powered by Dalil Tounes' },
  it: { name: "Aux saveurs d'Anis", category: 'Catering per eventi', scan: 'Presenta questo QR per aprire direttamente il CV Business.', share: 'Condividi', download: 'Scarica', add: 'Aggiungi alla schermata Home', open: 'Apri il CV Business', powered: 'Powered by Dalil Tounes' },
  ru: { name: "Aux saveurs d'Anis", category: 'Выездной кейтеринг', scan: 'Покажите этот QR-код, чтобы сразу открыть Business CV.', share: 'Поделиться', download: 'Скачать', add: 'Добавить на главный экран', open: 'Открыть Business CV', powered: 'При поддержке Dalil Tounes' },
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
  language = 'fr', name, category, coverImage = AUX_SAVEURS_COVER, logo = AUX_SAVEURS_LOGO,
  qrValue = DEMO_URL, shareLabel, downloadLabel, addLabel, openLabel, scanText, poweredText,
  openHref, onShare, onDownload, onInstall, qrId, interactive = false,
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
    <section dir={isRtl ? 'rtl' : 'ltr'} aria-label={`${displayName} — QR Business`}
      className="mx-auto w-full max-w-[354px] rounded-[28px] border-[2px] px-[15px] pb-[16px] pt-[13px] text-white shadow-[0_14px_34px_rgba(0,0,0,0.16)]"
      style={{ backgroundColor: REFERENCE_GREEN, borderColor: REFERENCE_GOLD }}>
      <div className="overflow-hidden rounded-[18px] border bg-[#062D24]" style={{ borderColor: `${REFERENCE_GOLD}99` }}>
        <img src={coverImage} alt="" className="block h-[136px] w-full object-cover" loading="eager" decoding="async" />
      </div>
      <div className="relative -mt-[41px] flex justify-center">
        <div className="grid h-[86px] w-[86px] place-items-center overflow-hidden rounded-full border-[2px] p-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
          style={{ backgroundColor: REFERENCE_GREEN, borderColor: REFERENCE_GOLD }}>
          <img src={logo} alt={`Logo ${displayName}`} className="h-full w-full rounded-full object-cover" />
        </div>
      </div>
      <div className="px-3 text-center">
        <h3 className="mt-[10px] font-serif text-[27px] font-bold leading-[1.04] tracking-[-0.015em] text-[#FFFDF7]">{displayName}</h3>
        <p className="mt-[4px] text-[13px] font-medium leading-tight" style={{ color: REFERENCE_GOLD }}>{displayCategory}</p>
        <p className="mx-auto mt-[12px] max-w-[264px] text-[13px] leading-[1.42] text-white/90">{scanText || t.scan}</p>
      </div>
      <div className="mx-auto mt-[14px] w-[226px] rounded-[16px] bg-white p-[10px] shadow-[0_7px_18px_rgba(0,0,0,0.14)]">
        <div className="relative mx-auto h-[206px] w-[206px]">
          <QRCodeSVG id={qrId} value={qrValue} size={206} level="H" includeMargin={false} bgColor="#ffffff" fgColor="#000000" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 grid h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 place-items-center overflow-hidden rounded-full border-[3px] border-white shadow-md" style={{ backgroundColor: REFERENCE_GREEN }}>
            <img src={logo} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-[16px] grid w-[252px] grid-cols-3 divide-x divide-[#D5B257]/25 rtl:divide-x-reverse">
        {actions.map(({ icon: Icon, label, action }) => (
          <button key={label} type="button" onClick={interactive ? action : undefined}
            className="flex min-h-[62px] min-w-0 flex-col items-center justify-start gap-[6px] px-1 py-[7px] text-center"
            style={{ color: REFERENCE_GOLD }} aria-label={label}>
            <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
            <span className="max-w-[82px] text-[10px] font-medium leading-[1.18]">{label}</span>
          </button>
        ))}
      </div>
      {openHref ? (
        <a href={openHref} className="mx-auto mt-[8px] flex min-h-[45px] w-[252px] items-center justify-center gap-2 rounded-[11px] border px-4 py-2.5 text-[14px] font-bold text-white no-underline" style={{ borderColor: REFERENCE_GOLD }}>
          <ExternalLink size={17} strokeWidth={1.8} aria-hidden="true" />{openLabel || t.open}
        </a>
      ) : (
        <div className="mx-auto mt-[8px] flex min-h-[45px] w-[252px] items-center justify-center gap-2 rounded-[11px] border px-4 py-2.5 text-[14px] font-bold text-white" style={{ borderColor: REFERENCE_GOLD }}>
          <ExternalLink size={17} strokeWidth={1.8} aria-hidden="true" />{openLabel || t.open}
        </div>
      )}
      <p className="mb-0 mt-[15px] text-center text-[10px] font-normal text-white/62">{poweredText || t.powered}</p>
    </section>
  );
}

export default CvBusinessQrVisual;
