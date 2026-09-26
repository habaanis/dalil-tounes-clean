import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase, supabaseUrl } from '../lib/supabaseClient';
import { buildEntrepriseUrl, buildShortSharePath, generateSlug } from '../lib/slugify';
import { getLogoUrl } from '../lib/logoUtils';
import { mapSubscriptionToTier } from '../lib/subscriptionTiers';
import { HERO_IMAGE_URL } from '../constants/images';
import { CvBusinessQrVisual } from '../components/CvBusinessProductVisuals';
import { getMultilingualField } from '../lib/databaseI18n';
import { getCvPaletteTheme } from '../lib/cvPalette';

interface BusinessQrRecord {
  id: string;
  nom: string;
  slug?: string | null;
  slug_court?: string | null;
  ville?: string | null;
  categorie?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  name_it?: string | null;
  name_ru?: string | null;
  categorie_ar?: string | null;
  image_url?: string | null;
  logo_url?: string | null;
  statut_abonnement?: string | null;
  cv_business_status?: string | null;
  modele_cv?: string | null;
  palette_cv?: string | null;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const COPY = {
  fr: {
    product: 'CV Business',
    scan: 'Scannez ce QR pour ouvrir directement le CV Business.',
    share: 'Partager',
    shared: 'Lien copié',
    download: 'Télécharger',
    install: "Ajouter à l’écran d’accueil",
    open: 'Ouvrir le CV Business',
    powered: 'Propulsé par Dalil Tounes',
    installIos: 'iPhone : ouvrez cette page dans Safari, puis Partager → Ajouter à l’écran d’accueil.',
    installAndroid: 'Android : ouvrez cette page dans Chrome, puis Menu → Ajouter à l’écran d’accueil ou Installer.',
    loading: 'Chargement du QR Business…',
    unavailable: "Ce QR Business sera disponible lorsque le CV Business sera publié.",
    back: 'Retour au CV Business',
  },
  ar: {
    product: 'السيرة المهنية',
    scan: 'امسح رمز QR لفتح السيرة المهنية مباشرة.',
    share: 'مشاركة',
    shared: 'تم نسخ الرابط',
    download: 'تنزيل',
    install: 'إضافة إلى الشاشة الرئيسية',
    open: 'فتح السيرة المهنية',
    powered: 'بدعم من دليل تونس',
    installIos: 'iPhone: افتح هذه الصفحة في Safari، ثم مشاركة ← إضافة إلى الشاشة الرئيسية.',
    installAndroid: 'Android: افتح هذه الصفحة في Chrome، ثم القائمة ← إضافة إلى الشاشة الرئيسية أو تثبيت.',
    loading: 'جارٍ تحميل رمز QR…',
    unavailable: 'سيصبح QR Business متاحًا عند نشر CV Business.',
    back: 'العودة إلى السيرة المهنية',
  },
  en: {
    product: 'Business CV',
    scan: 'Scan this QR to open the Business CV directly.',
    share: 'Share',
    shared: 'Link copied',
    download: 'Download',
    install: 'Add to home screen',
    open: 'Open Business CV',
    powered: 'Powered by Dalil Tounes',
    installIos: 'iPhone: open this page in Safari, then Share → Add to Home Screen.',
    installAndroid: 'Android: open this page in Chrome, then Menu → Add to Home Screen or Install.',
    loading: 'Loading Business QR…',
    unavailable: 'This Business QR will be available once the Business CV is published.',
    back: 'Back to Business CV',
  },
  it: {
    product: 'CV Business',
    scan: 'Scansiona questo QR per aprire direttamente il CV Business.',
    share: 'Condividi',
    shared: 'Link copiato',
    download: 'Scarica',
    install: 'Aggiungi alla schermata Home',
    open: 'Apri il CV Business',
    powered: 'Powered by Dalil Tounes',
    installIos: 'iPhone: apri questa pagina in Safari, quindi Condividi → Aggiungi alla schermata Home.',
    installAndroid: 'Android: apri questa pagina in Chrome, quindi Menu → Aggiungi alla schermata Home o Installa.',
    loading: 'Caricamento QR Business…',
    unavailable: 'Il QR Business sarà disponibile quando il CV Business sarà pubblicato.',
    back: 'Torna al CV Business',
  },
  ru: {
    product: 'Business CV',
    scan: 'Отсканируйте QR-код, чтобы сразу открыть Business CV.',
    share: 'Поделиться',
    shared: 'Ссылка скопирована',
    download: 'Скачать',
    install: 'Добавить на главный экран',
    open: 'Открыть Business CV',
    powered: 'При поддержке Dalil Tounes',
    installIos: 'iPhone: откройте эту страницу в Safari, затем Поделиться → На экран «Домой».',
    installAndroid: 'Android: откройте эту страницу в Chrome, затем Меню → Добавить на главный экран или Установить.',
    loading: 'Загрузка Business QR…',
    unavailable: 'Business QR станет доступен после публикации Business CV.',
    back: 'Назад к Business CV',
  },
} as const;

type CvModel = 'business' | 'portfolio';

const MODEL_COPY = {
  fr: {
    business: { product: 'CV Business', scan: 'Scannez ce QR pour ouvrir directement le CV Business.', open: 'Ouvrir le CV Business' },
    portfolio: { product: 'CV Portfolio', scan: 'Scannez ce QR pour découvrir directement le CV Portfolio.', open: 'Ouvrir le CV Portfolio' },
  },
  ar: {
    business: { product: 'CV Business', scan: 'امسح رمز QR لفتح CV Business مباشرة.', open: 'فتح CV Business' },
    portfolio: { product: 'CV Portfolio', scan: 'امسح رمز QR لاكتشاف CV Portfolio مباشرة.', open: 'فتح CV Portfolio' },
  },
  en: {
    business: { product: 'CV Business', scan: 'Scan this QR to open the CV Business directly.', open: 'Open the CV Business' },
    portfolio: { product: 'CV Portfolio', scan: 'Scan this QR to discover the CV Portfolio directly.', open: 'Open the CV Portfolio' },
  },
  it: {
    business: { product: 'CV Business', scan: 'Scansiona questo QR per aprire direttamente il CV Business.', open: 'Apri il CV Business' },
    portfolio: { product: 'CV Portfolio', scan: 'Scansiona questo QR per scoprire direttamente il CV Portfolio.', open: 'Apri il CV Portfolio' },
  },
  ru: {
    business: { product: 'CV Business', scan: 'Отсканируйте QR-код, чтобы сразу открыть CV Business.', open: 'Открыть CV Business' },
    portfolio: { product: 'CV Portfolio', scan: 'Отсканируйте QR-код, чтобы сразу открыть CV Portfolio.', open: 'Открыть CV Portfolio' },
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
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [shareConfirmed, setShareConfirmed] = useState(false);
  const [showBrandSplash, setShowBrandSplash] = useState(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    return new URLSearchParams(window.location.search).get('source') === 'pwa' || isStandalone;
  });
  const launchPalette = new URLSearchParams(window.location.search).get('palette');
  const paletteTheme = getCvPaletteTheme(business?.palette_cv || launchPalette);
  const cvModel: CvModel = String(business?.modele_cv || '').toLowerCase().includes('portfolio')
    ? 'portfolio'
    : 'business';
  const modelText = MODEL_COPY[language as keyof typeof MODEL_COPY]?.[cvModel] || MODEL_COPY.fr[cvModel];

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const baseQuery = supabase
        .from('entreprise')
        .select('id, nom, slug, slug_court, ville, categorie, name_ar, name_en, name_it, name_ru, categorie_ar, image_url, logo_url, statut_abonnement, cv_business_status, modele_cv, palette_cv');
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      const { data } = await (isUuid ? baseQuery.eq('id', id) : baseQuery.eq('slug', id)).maybeSingle();
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
    const handleInstalled = () => setInstallPrompt(null);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const cvPath = useMemo(
    () => business ? buildShortSharePath(business) || buildEntrepriseUrl(business) : '/entreprises',
    [business],
  );
  const displayName = business
    ? String(getMultilingualField(business, 'nom', language) || business.nom)
    : '';
  const displayCategory = business
    ? String(getMultilingualField(business, 'categorie', language) || business.categorie || '')
    : '';
  const cvUrl = `https://dalil-tounes.com${cvPath}?lang=${language}`;
  const logoUrl = business ? getLogoUrl(business.logo_url) : '';
  const coverUrl = getCoverUrl(business?.image_url);
  const tier = business ? mapSubscriptionToTier(business) : 'gratuit';
  const legacyPremiumAccess = tier === 'artisan' || tier === 'premium' || tier === 'elite' || tier === 'custom';
  const cvBusinessAccess = business?.cv_business_status === 'published';
  const qrAccess = cvBusinessAccess || legacyPremiumAccess;

  useEffect(() => {
    if (!business?.id || !qrAccess) return;
    const isAppLaunch = new URLSearchParams(window.location.search).get('source') === 'pwa'
      || window.matchMedia('(display-mode: standalone)').matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (!isAppLaunch) return;

    setShowBrandSplash(true);
    const timer = window.setTimeout(() => setShowBrandSplash(false), 2400);
    return () => window.clearTimeout(timer);
  }, [business?.id, qrAccess]);

  useEffect(() => {
    if (!business?.id || !qrAccess) return;

    const existing = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    const link = existing || document.createElement('link');
    link.rel = 'manifest';
    link.href = `/api/business-manifest?id=${encodeURIComponent(id || business.id)}&name=${encodeURIComponent(displayName)}&logo=${encodeURIComponent(logoUrl)}&lang=${language}&palette=${paletteTheme.id}&model=${cvModel}&v=client-5`;
    if (!existing) document.head.appendChild(link);
    document.title = `${displayName} — ${modelText.product}`;

    return () => {
      link.href = '/manifest.json';
      document.title = 'Dalil Tounes — Plateforme des professionnels en Tunisie | CV Business';
    };
  }, [id, business?.id, cvModel, displayName, language, logoUrl, modelText.product, paletteTheme.id, qrAccess]);

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) return;
    const previous = meta.content;
    meta.content = paletteTheme.page;
    return () => { meta.content = previous; };
  }, [paletteTheme.page]);

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
      link.download = `qr-${cvModel}-${generateSlug(business?.nom || 'dalil-tounes')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`;
  };

  const shareBusiness = async () => {
    if (!business) return;
    const shareData = {
      title: displayName,
      text: `${displayName} — ${modelText.product} Dalil Tounes`,
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
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') setInstallPrompt(null);
      return;
    }

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    window.alert(isIos ? text.installIos : text.installAndroid);
  };

  if (loading) {
    return <div className="fixed inset-0 z-[10000] grid place-items-center" style={{ backgroundColor: paletteTheme.page, color: paletteTheme.text }}>{text.loading}</div>;
  }

  if (!business || !qrAccess) {
    return (
      <div className="fixed inset-0 z-[10000] grid place-items-center overflow-y-auto bg-[#F6F7F4] px-4 text-center">
        <div className="max-w-md rounded-3xl border border-[#D4AF37]/40 bg-white p-8 shadow-xl">
          <p className="text-gray-700">{text.unavailable}</p>
          <Link to={cvPath} className="mt-5 inline-flex rounded-full bg-[#0B4B3E] px-5 py-2.5 font-semibold text-white">{text.back}</Link>
        </div>
      </div>
    );
  }

  if (showBrandSplash) {
    return (
      <main className="fixed inset-0 z-[10000] grid place-items-center px-6 text-center" style={{ backgroundColor: paletteTheme.page, color: paletteTheme.text }}>
        <div className="flex flex-col items-center">
          <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-full border-[3px] p-1 shadow-2xl" style={{ backgroundColor: paletteTheme.surface, borderColor: paletteTheme.border }}>
            <img src={logoUrl} alt={`Logo ${displayName}`} className="h-full w-full rounded-full object-cover" />
          </div>
          <h1 className="mt-5 font-serif text-2xl font-bold">{displayName}</h1>
          <p className="mt-2 text-sm" style={{ color: paletteTheme.accent }}>{modelText.product}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 z-[10000] overflow-y-auto px-3 py-4 sm:py-6" style={{ backgroundColor: paletteTheme.page }} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <CvBusinessQrVisual
        language={language}
        name={displayName}
        category={displayCategory || undefined}
        coverImage={coverUrl}
        logo={logoUrl}
        qrValue={cvUrl}
        shareLabel={shareConfirmed ? text.shared : text.share}
        downloadLabel={text.download}
        addLabel={text.install}
        openLabel={modelText.open}
        scanText={modelText.scan}
        productLabel={modelText.product}
        poweredText={text.powered}
        openHref={`${cvPath}?source=pwa&lang=${language}`}
        onShare={shareBusiness}
        onDownload={downloadPng}
        onInstall={installApp}
        qrId="dt-business-qr"
        palette={paletteTheme.id}
        interactive
      />
    </main>
  );
}
