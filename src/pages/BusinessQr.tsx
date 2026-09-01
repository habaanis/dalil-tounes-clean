import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase, supabaseUrl } from '../lib/supabaseClient';
import { buildEntrepriseUrl, generateSlug } from '../lib/slugify';
import { getLogoUrl } from '../lib/logoUtils';
import { mapSubscriptionToTier } from '../lib/subscriptionTiers';
import { HERO_IMAGE_URL } from '../constants/images';
import { CvBusinessQrVisual } from '../components/CvBusinessProductVisuals';

interface BusinessQrRecord {
  id: string;
  nom: string;
  slug?: string | null;
  ville?: string | null;
  categorie?: string | null;
  image_url?: string | null;
  logo_url?: string | null;
  statut_abonnement?: string | null;
  cv_business_status?: string | null;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const COPY = {
  fr: {
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

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('entreprise')
        .select('id, nom, slug, ville, categorie, image_url, logo_url, statut_abonnement, cv_business_status')
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
    const handleInstalled = () => setInstallPrompt(null);

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
  const legacyPremiumAccess = tier === 'premium' || tier === 'elite' || tier === 'custom';
  const cvBusinessAccess = business?.cv_business_status === 'published';
  const qrAccess = cvBusinessAccess || legacyPremiumAccess;

  useEffect(() => {
    if (!business?.id || !qrAccess) return;

    const existing = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    const link = existing || document.createElement('link');
    link.rel = 'manifest';
    link.href = `/api/business-manifest?id=${encodeURIComponent(business.id)}&name=${encodeURIComponent(business.nom)}&logo=${encodeURIComponent(logoUrl)}`;
    if (!existing) document.head.appendChild(link);
    document.title = `${business.nom} — CV Business`;

    return () => {
      link.href = '/manifest.json';
      document.title = 'Dalil Tounes — Plateforme des professionnels en Tunisie | CV Business';
    };
  }, [business?.id, business?.nom, logoUrl, qrAccess]);

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
    return <div className="fixed inset-0 z-[10000] grid place-items-center bg-[#032D21] text-white">{text.loading}</div>;
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

  return (
    <main className="fixed inset-0 z-[10000] overflow-y-auto bg-[#032D21] px-3 py-4 sm:py-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <CvBusinessQrVisual
        language={language}
        name={business.nom}
        category={business.categorie || undefined}
        coverImage={coverUrl}
        logo={logoUrl}
        qrValue={cvUrl}
        shareLabel={shareConfirmed ? text.shared : text.share}
        downloadLabel={text.download}
        addLabel={text.install}
        openLabel={text.open}
        scanText={text.scan}
        poweredText={text.powered}
        openHref={cvPath}
        onShare={shareBusiness}
        onDownload={downloadPng}
        onInstall={installApp}
        qrId="dt-business-qr"
        interactive
      />
    </main>
  );
}
