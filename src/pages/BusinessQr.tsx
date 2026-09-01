import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, ExternalLink, Home, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { supabase, supabaseUrl } from '../lib/supabaseClient';
import { buildEntrepriseUrl, generateSlug } from '../lib/slugify';
import { getLogoUrl } from '../lib/logoUtils';
import { mapSubscriptionToTier } from '../lib/subscriptionTiers';
import { HERO_IMAGE_URL } from '../constants/images';

interface BusinessQrRecord {
  id: string;
  nom: string;
  slug?: string | null;
  ville?: string | null;
  categorie?: string | null;
  image_url?: string | null;
  logo_url?: string | null;
  statut_abonnement?: string | null;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const COPY = {
  fr: {
    scan: 'Scannez ce QR pour ouvrir le CV Business.',
    share: 'Partager',
    shared: 'Lien copié',
    download: 'Télécharger',
    install: "Ajouter à l’écran d’accueil",
    open: 'Ouvrir le CV Business',
    powered: 'Propulsé par',
    installTitle: "Installer le CV Business",
    installIos: 'iPhone : ouvrez cette page dans Safari, puis Partager → Ajouter à l’écran d’accueil.',
    installAndroid: 'Android : ouvrez cette page dans Chrome, puis Menu → Ajouter à l’écran d’accueil ou Installer.',
    loading: 'Chargement du QR Business…',
    unavailable: 'Cette présentation QR est réservée au CV Business Premium.',
    back: 'Retour au CV Business',
  },
  ar: {
    scan: 'امسح رمز QR لفتح السيرة المهنية.',
    share: 'مشاركة',
    shared: 'تم نسخ الرابط',
    download: 'تنزيل',
    install: 'إضافة إلى الشاشة الرئيسية',
    open: 'فتح السيرة المهنية',
    powered: 'بدعم من',
    installTitle: 'تثبيت السيرة المهنية',
    installIos: 'iPhone: افتح هذه الصفحة في Safari، ثم مشاركة ← إضافة إلى الشاشة الرئيسية.',
    installAndroid: 'Android: افتح هذه الصفحة في Chrome، ثم القائمة ← إضافة إلى الشاشة الرئيسية أو تثبيت.',
    loading: 'جارٍ تحميل رمز QR…',
    unavailable: 'عرض QR هذا مخصص لـ CV Business Premium.',
    back: 'العودة إلى السيرة المهنية',
  },
  en: {
    scan: 'Scan this QR to open the Business CV.',
    share: 'Share',
    shared: 'Link copied',
    download: 'Download',
    install: 'Add to home screen',
    open: 'Open Business CV',
    powered: 'Powered by',
    installTitle: 'Install the Business CV',
    installIos: 'iPhone: open this page in Safari, then Share → Add to Home Screen.',
    installAndroid: 'Android: open this page in Chrome, then Menu → Add to Home Screen or Install.',
    loading: 'Loading Business QR…',
    unavailable: 'This QR presentation is reserved for the Premium Business CV.',
    back: 'Back to Business CV',
  },
  it: {
    scan: 'Scansiona questo QR per aprire il CV Business.',
    share: 'Condividi',
    shared: 'Link copiato',
    download: 'Scarica',
    install: 'Aggiungi alla schermata Home',
    open: 'Apri il CV Business',
    powered: 'Offerto da',
    installTitle: 'Installa il CV Business',
    installIos: 'iPhone: apri questa pagina in Safari, quindi Condividi → Aggiungi alla schermata Home.',
    installAndroid: 'Android: apri questa pagina in Chrome, quindi Menu → Aggiungi alla schermata Home o Installa.',
    loading: 'Caricamento QR Business…',
    unavailable: 'Questa presentazione QR è riservata al CV Business Premium.',
    back: 'Torna al CV Business',
  },
  ru: {
    scan: 'Отсканируйте QR-код, чтобы открыть Business CV.',
    share: 'Поделиться',
    shared: 'Ссылка скопирована',
    download: 'Скачать',
    install: 'Добавить на главный экран',
    open: 'Открыть Business CV',
    powered: 'При поддержке',
    installTitle: 'Установить Business CV',
    installIos: 'iPhone: откройте эту страницу в Safari, затем Поделиться → На экран «Домой».',
    installAndroid: 'Android: откройте эту страницу в Chrome, затем Меню → Добавить на главный экран или Установить.',
    loading: 'Загрузка Business QR…',
    unavailable: 'Эта QR-презентация доступна для Premium Business CV.',
    back: 'Назад к Business CV',
  },
} as const;

function getCoverUrl(value?: string | null): string {
  if (!value?.trim()) return HERO_IMAGE_URL;
  const first = value.split(',')[0]?.trim();
  if (!first) return HERO_IMAGE_URL;
  if (/^https?:\/\//i.test(first)) return first;
  return `${supabaseUrl}/storage/v1/object/public/entreprises/${first}`;
}

export default function BusinessQr() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const text = COPY[language as keyof typeof COPY] || COPY.fr;
  const [business, setBusiness] = useState<BusinessQrRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [shareConfirmed, setShareConfirmed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('entreprise')
        .select('id, nom, slug, ville, categorie, image_url, logo_url, statut_abonnement')
        .eq('id', id)
        .maybeSingle();
      if (!cancelled) {
        setBusiness(data as BusinessQrRecord | null);
        setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setShowInstallHelp(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const cvPath = useMemo(() => business ? buildEntrepriseUrl(business) : '/entreprises', [business]);
  const cvUrl = `https://dalil-tounes.com${cvPath}`;
  const logoUrl = business ? getLogoUrl(business.logo_url) : '';
  const coverUrl = getCoverUrl(business?.image_url);
  const tier = business ? mapSubscriptionToTier(business) : 'gratuit';
  const premiumAccess = tier === 'premium' || tier === 'elite' || tier === 'custom';

  const downloadPng = () => {
    const svg = document.getElementById('dt-business-qr');
    if (!(svg instanceof SVGElement)) return;
    const serialized = new XMLSerializer().serializeToString(svg);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const link = document.createElement('a');
      link.download = `qr-business-${generateSlug(business?.nom || 'dalil-tounes')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`;
  };

  const shareBusiness = async () => {
    if (!business) return;
    const shareData = {
      title: business.nom,
      text: `${business.nom} — CV Business Dalil Tounes`,
      url: cvUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(cvUrl);
      setShareConfirmed(true);
      window.setTimeout(() => setShareConfirmed(false), 1800);
    } catch (error) {
      if ((error as DOMException)?.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(cvUrl);
          setShareConfirmed(true);
          window.setTimeout(() => setShareConfirmed(false), 1800);
        } catch {
          // Clipboard can be unavailable in some embedded browsers.
        }
      }
    }
  };

  const installApp = async () => {
    if (!installPrompt) {
      setShowInstallHelp((value) => !value);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setInstallPrompt(null);
      setShowInstallHelp(false);
    }
  };

  if (loading) {
    return <div className="min-h-[70vh] grid place-items-center text-gray-600">{text.loading}</div>;
  }

  if (!business || !premiumAccess) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-4 text-center">
        <div className="max-w-md rounded-3xl border border-[#D4AF37]/40 bg-white p-8 shadow-xl">
          <p className="text-gray-700">{text.unavailable}</p>
          <Link to={cvPath} className="mt-5 inline-flex rounded-full bg-[#0B4B3E] px-5 py-2.5 font-semibold text-white">{text.back}</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F7F4] px-3 py-4 sm:py-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-[26px] border-[1.5px] border-[#D4AF37] bg-[#063D33] text-center text-white shadow-[0_18px_45px_rgba(0,45,35,0.24)]">
        <div className="relative h-[116px] overflow-hidden bg-[#0A3A31]">
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = HERO_IMAGE_URL;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#063D33]/35" />
        </div>

        <div className="relative px-5 pb-4">
          <div className="mx-auto -mt-[38px] flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-full border-2 border-[#D4AF37] bg-[#063D33] p-[3px] shadow-lg">
            <img src={logoUrl} alt={`Logo ${business.nom}`} className="h-full w-full rounded-full object-cover" />
          </div>

          <h1 className="mt-3 font-serif text-[25px] font-bold leading-[1.05] tracking-[-0.02em] text-[#FFFDF5]">
            {business.nom}
          </h1>
          {business.categorie && (
            <p className="mt-1 text-[13px] font-semibold text-[#E7C65A]">{business.categorie}</p>
          )}
          <p className="mx-auto mt-3 max-w-[285px] text-[13px] leading-[1.45] text-white/88">{text.scan}</p>

          <div className="mx-auto mt-4 w-[244px] rounded-[18px] bg-white p-[10px] shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
            <div className="relative mx-auto w-fit">
              <QRCodeSVG id="dt-business-qr" value={cvUrl} size={224} level="H" includeMargin={false} bgColor="#ffffff" fgColor="#000000" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 grid h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 place-items-center overflow-hidden rounded-full border-[3px] border-white bg-[#063D33] shadow-md">
                <img src={logoUrl} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 divide-x divide-[#D4AF37]/25 rtl:divide-x-reverse">
            <button type="button" onClick={shareBusiness} className="flex min-w-0 flex-col items-center justify-start gap-1 px-1 py-2 text-[#E7C65A] transition hover:bg-white/[0.03]">
              <Share2 size={18} strokeWidth={1.8} />
              <span className="text-[10px] font-medium leading-[1.15]">{shareConfirmed ? text.shared : text.share}</span>
            </button>
            <button type="button" onClick={downloadPng} className="flex min-w-0 flex-col items-center justify-start gap-1 px-1 py-2 text-[#E7C65A] transition hover:bg-white/[0.03]">
              <Download size={18} strokeWidth={1.8} />
              <span className="text-[10px] font-medium leading-[1.15]">{text.download}</span>
            </button>
            <button type="button" onClick={installApp} className="flex min-w-0 flex-col items-center justify-start gap-1 px-1 py-2 text-[#E7C65A] transition hover:bg-white/[0.03]">
              <Home size={18} strokeWidth={1.8} />
              <span className="max-w-[88px] text-[10px] font-medium leading-[1.15]">{text.install}</span>
            </button>
          </div>

          {showInstallHelp && (
            <div className="mt-2.5 rounded-xl border border-white/12 bg-black/10 px-3 py-2.5 text-start text-[10px] leading-4 text-white/78">
              <p className="font-bold text-[#E7C65A]">{text.installTitle}</p>
              <p className="mt-1.5">{text.installIos}</p>
              <p>{text.installAndroid}</p>
            </div>
          )}

          <Link to={cvPath} className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#D4AF37] px-4 py-2.5 text-[14px] font-bold text-white transition hover:bg-white/[0.04]">
            <ExternalLink size={16} />{text.open}
          </Link>

          <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[10px] text-white/50">
            <span>{text.powered}</span>
            <span className="font-semibold text-white/72">Dalil Tounes</span>
          </div>
        </div>
      </div>
    </main>
  );
}
