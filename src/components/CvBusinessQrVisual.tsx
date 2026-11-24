import { ChevronDown, CreditCard, Truck, Store, Monitor, FileText, Package, Download, ExternalLink, Home, Share2, UserRound } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { BusinessCardPreviewLanguage } from './BusinessCardPreviewBase';
import { getCvPaletteTheme, type CvPaletteId } from '../lib/cvPalette';
import { isDedicatedClientHostname } from '../lib/clientAppUrl';
import LanguageSelector from './LanguageSelector';

export const AUX_SAVEURS_COVER =
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-gastronomie.jpg?updatedAt=1787090066953';
export const AUX_SAVEURS_LOGO =
  'https://ik.imagekit.io/gfdpqvshw/Lienora/client/aux-saveurs-danis/aux-saveurs-danis-logo-v2?updatedAt=1787096555330';

const DEMO_URL = 'https://dalil-tounes.com/businesses';
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

const usageCopy: Record<BusinessCardPreviewLanguage, [string, string, string[], string]> = {
  "fr": [
    "Où utiliser votre QR Business ?",
    "Téléchargez et imprimez votre QR code personnalisé pour donner à vos clients un accès direct à votre mini-appli, vos services et votre boutique.",
    [
      "Cartes de visite",
      "Véhicules professionnels",
      "Devant votre établissement ou sur votre vitrine",
      "Bureau et comptoir",
      "Flyers et menus",
      "Produits et emballages"
    ],
    "Un simple scan pour découvrir votre activité, consulter vos produits, vous contacter ou passer commande."
  ],
  "ar": [
    "أين تستخدم رمز QR Business؟",
    "نزّل رمز QR الشخصي واطبعه ليتمكن عملاؤك من الوصول مباشرة إلى تطبيقك المصغّر وخدماتك ومتجرك.",
    [
      "بطاقات العمل",
      "المركبات المهنية",
      "أمام مؤسستك أو على واجهتها",
      "المكتب وطاولة الاستقبال",
      "المنشورات وقوائم الطعام",
      "المنتجات والتغليف"
    ],
    "مسح واحد للتعرّف على نشاطك وتصفّح منتجاتك والتواصل معك أو تقديم طلب."
  ],
  "en": [
    "Where can you use your QR Business?",
    "Download and print your personalised QR code to give customers direct access to your mini-app, services and shop.",
    [
      "Business cards",
      "Business vehicles",
      "Outside your premises or on your shop window",
      "Desk and counter",
      "Flyers and menus",
      "Products and packaging"
    ],
    "One scan to discover your business, browse your products, contact you or place an order."
  ],
  "it": [
    "Dove usare il tuo QR Business?",
    "Scarica e stampa il tuo codice QR personalizzato per offrire ai clienti accesso diretto alla tua mini-app, ai servizi e al negozio.",
    [
      "Biglietti da visita",
      "Veicoli aziendali",
      "All’esterno della sede o in vetrina",
      "Scrivania e bancone",
      "Volantini e menu",
      "Prodotti e confezioni"
    ],
    "Una semplice scansione per scoprire la tua attività, consultare i prodotti, contattarti o effettuare un ordine."
  ],
  "ru": [
    "Где использовать ваш QR Business?",
    "Скачайте и распечатайте персональный QR-код, чтобы клиенты могли сразу открыть ваше мини-приложение, услуги и магазин.",
    [
      "Визитные карточки",
      "Служебный транспорт",
      "Перед заведением или на витрине",
      "Рабочий стол и стойка",
      "Листовки и меню",
      "Товары и упаковка"
    ],
    "Одно сканирование, чтобы узнать о вашей деятельности, посмотреть товары, связаться с вами или оформить заказ."
  ]
};
const usageIcons = [CreditCard, Truck, Store, Monitor, FileText, Package];

export function QrBusinessUsage({ language = 'fr' }: { language?: BusinessCardPreviewLanguage }) {
  const usage = usageCopy[language] ?? usageCopy.fr;
  return (
      <details dir={language === 'ar' ? 'rtl' : 'ltr'} className="group mx-auto mt-2 w-full max-w-xl rounded-lg border border-[#C5A56A] bg-[#FBF8F0] text-[#292929]">
        <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-2 px-2.5 py-2 text-[11px] font-semibold [&::-webkit-details-marker]:hidden">
          {usage[0]} <ChevronDown size={14} className="shrink-0 text-[#92703B] group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="px-2.5 pb-2.5 text-[11px] leading-relaxed">
          <p>{usage[1]}</p>
          <ul className="my-2 grid grid-cols-2 gap-1.5 md:grid-cols-3">
            {usageIcons.map((Icon, index) => (
              <li key={index} className="flex min-w-0 flex-col items-center gap-1 rounded-md border border-[#C5A56A]/40 p-1.5 text-center leading-tight">
                <Icon size={19} strokeWidth={1.6} className="text-[#92703B]" aria-hidden="true" />
                <span>{usage[2][index]}</span>
              </li>
            ))}
          </ul>
          <p className="font-semibold">{usage[3]}</p>
        </div>
      </details>
  );
}

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
  productLabel?: string;
  openHref?: string;
  accountHref?: string;
  model?: 'business' | 'portfolio';
  onModelChange?: (model: 'business' | 'portfolio') => void;
  onShare?: () => void;
  onDownload?: () => void;
  onInstall?: () => void;
  qrId?: string;
  interactive?: boolean;
  showUsage?: boolean;
  palette?: CvPaletteId | string | null;
};

export function CvBusinessQrVisual({
  language = 'fr', name, category, coverImage = AUX_SAVEURS_COVER, logo = AUX_SAVEURS_LOGO,
  qrValue = DEMO_URL, shareLabel, downloadLabel, addLabel, openLabel, scanText, poweredText,
  openHref, accountHref, model, onModelChange, onShare, onDownload, onInstall, qrId, interactive = false, palette, productLabel, showUsage = true,
}: CvBusinessQrVisualProps) {
  const t = copy[language] ?? copy.fr;
  const theme = getCvPaletteTheme(palette);
  const isRtl = language === 'ar';
  const displayName = name || t.name;
  const displayCategory = category || t.category;
  const showClientLanguageSelector = interactive && typeof window !== 'undefined'
    && (isDedicatedClientHostname(window.location.hostname)
      || window.location.pathname.startsWith('/qr-business/'));
  const actions = [
    { icon: Share2, label: shareLabel || t.share, action: onShare },
    { icon: Download, label: downloadLabel || t.download, action: onDownload },
    { icon: Home, label: addLabel || t.add, action: onInstall },
  ];

  return (
    <>
    <section dir={isRtl ? 'rtl' : 'ltr'} aria-label={`${displayName} — ${productLabel || 'CV Business'}`}
      className="mx-auto w-full max-w-[354px] rounded-[20px] border px-3 pb-3 pt-3 shadow-[0_9px_24px_rgba(0,0,0,0.12)]"
      style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }}>
      <div className="overflow-hidden rounded-[18px] border" style={{ backgroundColor: theme.surfaceAlt, borderColor: `${theme.border}99` }}>
        <img src={coverImage} alt="" className="block h-[94px] w-full object-cover" loading="eager" decoding="async" />
      </div>
      <div className="relative -mt-[29px] flex justify-center">
        <div className="grid h-[64px] w-[64px] place-items-center overflow-hidden rounded-full border-[2px] p-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <img src={logo} alt={`Logo ${displayName}`} className="h-full w-full rounded-full object-cover" />
        </div>
      </div>
      <div className="px-3 text-center">
        <h3 className="mt-[7px] font-serif text-[21px] font-bold leading-[1.04] tracking-[-0.015em]" style={{ color: theme.text }}>{displayName}</h3>
        <p className="mt-[4px] text-[13px] font-medium leading-tight" style={{ color: theme.accent }}>{displayCategory}</p>
        <p className="mx-auto mt-[7px] max-w-[264px] text-[12px] leading-[1.42]" style={{ color: theme.muted }}>{scanText || t.scan}</p>
      </div>
      {(showClientLanguageSelector || onModelChange) && <div className="mx-auto mt-3 flex w-full max-w-[285px] items-center justify-between gap-2" dir="ltr">
        {onModelChange && <div className="flex min-w-0 flex-1 rounded-lg border p-0.5" style={{ borderColor: theme.border }} aria-label="Choisir le CV à présenter">
          {(['portfolio','business'] as const).map(choice => <button key={choice} type="button" onClick={() => onModelChange(choice)} aria-pressed={model === choice}
            className="min-h-9 min-w-0 flex-1 rounded-md px-1.5 text-[11px] font-semibold"
            style={{ backgroundColor: model === choice ? theme.border : 'transparent', color: model === choice ? theme.surface : theme.text }}>
            {choice === 'portfolio' ? 'Portfolio' : 'Business'}
          </button>)}
        </div>}
        {showClientLanguageSelector && <LanguageSelector clientApp />}
      </div>}
      {openHref && (
        <a href={openHref}
          className="mx-auto mt-2.5 flex min-h-10 w-full max-w-[225px] items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[12px] font-semibold no-underline"
          style={{ borderColor: theme.border, backgroundColor: theme.border, color: theme.surface }}>
          <ExternalLink size={15} strokeWidth={1.8} aria-hidden="true" />{openLabel || t.open}
        </a>
      )}
      <div className="mx-auto mt-[9px] w-[200px] rounded-[14px] p-[6px] shadow-[0_7px_18px_rgba(0,0,0,0.14)]" style={{ backgroundColor: theme.qrBackground }}>
        <div className="relative mx-auto h-[188px] w-[188px]">
          <QRCodeSVG id={qrId} value={qrValue} size={188} level="H" includeMargin bgColor={theme.qrBackground} fgColor={theme.qrForeground} />
        </div>
      </div>
      {accountHref && <a href={accountHref}
        className="mx-auto mt-2 flex min-h-10 w-full max-w-[235px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-center text-[12px] font-semibold"
        style={{ borderColor: theme.border, color: theme.text, backgroundColor: theme.surfaceAlt }}>
        <UserRound size={17} aria-hidden="true" />{language === 'ar' ? 'حسابي المهني' : language === 'en' ? 'My professional account' : 'Mon compte professionnel'}
      </a>}
      <div className="mx-auto mt-[8px] grid w-full max-w-[252px] grid-cols-3">
        {actions.map(({ icon: Icon, label, action }, index) => (
          <button key={label} type="button" onClick={interactive ? action : undefined}
            className="flex min-h-[54px] min-w-0 flex-col items-center justify-start gap-[4px] px-1 py-[5px] text-center"
            style={{ color: theme.accent, borderInlineStart: index > 0 ? `1px solid ${theme.border}40` : undefined }} aria-label={label}>
            <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
            <span className="max-w-[82px] text-[10px] font-medium leading-[1.18]">{label}</span>
          </button>
        ))}
      </div>

      {showUsage && <QrBusinessUsage language={language} />}

      <p className="mb-0 mt-[12px] text-center text-[10px] font-normal" style={{ color: theme.muted }}>
        {poweredText || t.powered}
      </p>
    </section>
    </>
  );
}

export default CvBusinessQrVisual;
