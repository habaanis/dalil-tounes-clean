import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabaseClient';
import { getLogoUrl } from '../lib/logoUtils';
import { useLanguage } from '../context/LanguageContext';
import { getPublicComponentTranslations } from '../lib/publicComponentTranslations';
import BusinessShowcaseLienoraDetail from './BusinessShowcaseLienoraDetail';
import './businessShowcasePreviewEnhancements.css';

type BusinessRecord = {
  id?: string | null;
  slug?: string | null;
  nom?: string | null;
  ville?: string | null;
  logo_url?: string | null;
  google_url?: string | null;
  BTN_Maps?: string | null;
  [key: string]: unknown;
};

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const normalizeUrl = (value: unknown): string => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
};

const strictHttpUrl = (value: unknown): string => {
  const raw = String(value || '').trim();
  return /^https?:\/\//i.test(raw) ? raw : '';
};

const getGoogleReviewsUrl = (business: BusinessRecord | null): string => {
  if (!business) return '';

  const dedicatedCandidates = [
    business['Voir les avis'],
    business['Lien avis Google'],
    business['Lien Avis Google'],
    business['Google Reviews'],
    business['google_reviews_url'],
  ];

  for (const candidate of dedicatedCandidates) {
    const url = normalizeUrl(candidate);
    if (url) return url;
  }

  const listingCandidates = [business.google_url, business.BTN_Maps];
  for (const candidate of listingCandidates) {
    const url = strictHttpUrl(candidate);
    if (url) return url;
  }

  const query = [business.nom, business.ville, 'avis Google'].filter(Boolean).join(' ');
  return query ? `https://www.google.com/search?q=${encodeURIComponent(query)}` : 'https://www.google.com/';
};

const isReviewsLabel = (label: string): boolean => {
  const normalized = label.toLowerCase();
  return (
    normalized.includes('avis client') ||
    normalized.includes('customer review') ||
    normalized.includes('recension') ||
    normalized.includes('отзыв') ||
    normalized.includes('آراء')
  );
};

export default function BusinessShowcaseLienoraEnhanced() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const { language } = useLanguage();
  const text = getPublicComponentTranslations(language);
  const [business, setBusiness] = useState<BusinessRecord | null>(null);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [qrMount, setQrMount] = useState<HTMLElement | null>(null);

  const reviewsUrl = useMemo(() => getGoogleReviewsUrl(business), [business]);
  const logoUrl = useMemo(() => getLogoUrl(business?.logo_url), [business?.logo_url]);
  const qrValue = typeof window === 'undefined' ? 'https://dalil-tounes.com' : window.location.href;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      let record: BusinessRecord | null = null;

      if (id) {
        const { data } = await supabase.from('entreprise').select('*').eq('id', id).maybeSingle();
        record = data as BusinessRecord | null;
      }

      if (!record && slug) {
        const { data } = await supabase
          .from('entreprise')
          .select('*')
          .eq('slug', slug.trim().toLowerCase())
          .limit(1)
          .maybeSingle();
        record = data as BusinessRecord | null;
      }

      if (!cancelled) setBusiness(record);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [id, slug]);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    const enhance = () => {
      if (reviewsUrl) {
        document.querySelectorAll<HTMLButtonElement>('.dt-accordion-trigger').forEach(button => {
          if (!isReviewsLabel(button.textContent || '')) return;

          button.dataset.googleReviewsUrl = reviewsUrl;
          if (button.dataset.googleReviewsLinked === 'true') return;

          button.dataset.googleReviewsLinked = 'true';
          button.title = text.googleReviews;
          button.addEventListener(
            'click',
            event => {
              event.preventDefault();
              event.stopImmediatePropagation();
              const target = button.dataset.googleReviewsUrl;
              if (target) window.open(target, '_blank', 'noopener,noreferrer');
            },
            true,
          );
        });
      }

      const qrActions = document.querySelectorAll<HTMLButtonElement>('.dt-qr-actions button');
      qrActions.forEach((button, index) => {
        if (index > 1) button.classList.add('dt-preview-hide-contact');
      });

      const qrWrap = document.querySelector<HTMLElement>('.dt-qr-wrap');
      if (qrWrap && !qrWrap.querySelector('.dt-generated-qr')) {
        const mount = document.createElement('div');
        mount.className = 'dt-generated-qr';
        qrWrap.replaceChildren(mount);
        setQrMount(mount);
      }

      const qrCard = document.querySelector<HTMLElement>('.dt-qr-card');
      if (qrCard && !qrCard.querySelector('.dt-install-qr-preview')) {
        const installBox = document.createElement('div');
        installBox.className = 'dt-install-qr-preview';

        const title = document.createElement('strong');
        title.textContent = text.qrAlways;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'dt-install-qr-button';
        button.innerHTML = `<span aria-hidden="true">▦</span><span>${text.installQr}</span>`;
        button.addEventListener('click', async () => {
          if (installPrompt) {
            await installPrompt.prompt();
            await installPrompt.userChoice;
            setInstallPrompt(null);
            return;
          }

          const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
          window.alert(isIos ? text.installIos : text.installAndroid);
        });

        const note = document.createElement('p');
        note.textContent = text.qrNote;

        installBox.append(title, button, note);
        qrCard.appendChild(installBox);
      }
    };

    enhance();
    const observer = new MutationObserver(enhance);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [installPrompt, reviewsUrl, text]);

  return (
    <>
      <BusinessShowcaseLienoraDetail />
      {qrMount &&
        createPortal(
          <QRCodeSVG
            value={qrValue}
            size={116}
            level="H"
            includeMargin={false}
            title={`QR Code ${business?.nom || 'Dalil Tounes'}`}
            imageSettings={
              logoUrl
                ? {
                    src: logoUrl,
                    height: 30,
                    width: 30,
                    excavate: true,
                  }
                : undefined
            }
          />,
          qrMount,
        )}
    </>
  );
}