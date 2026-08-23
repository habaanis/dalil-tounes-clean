import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { getLogoUrl } from '../lib/logoUtils';
import BusinessShowcaseLienoraDetail from './BusinessShowcaseLienoraDetail';
import './businessShowcasePreviewEnhancements.css';

type BusinessRecord = {
  id?: string | null;
  slug?: string | null;
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

const getGoogleReviewsUrl = (business: BusinessRecord | null): string => {
  if (!business) return '';

  const candidates = [
    business['Voir les avis'],
    business['Lien avis Google'],
    business['Lien Avis Google'],
    business['Google Reviews'],
    business['google_reviews_url'],
    business.google_url,
    business.BTN_Maps,
  ];

  for (const candidate of candidates) {
    const url = normalizeUrl(candidate);
    if (url) return url;
  }

  return '';
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

const isContactLabel = (label: string): boolean => {
  const normalized = label.toLowerCase();
  return (
    normalized.includes('ajouter aux contacts') ||
    normalized.includes('add to contacts') ||
    normalized.includes('aggiungi ai contatti') ||
    normalized.includes('добавить в контакты') ||
    normalized.includes('جهات الاتصال')
  );
};

export default function BusinessShowcaseLienoraEnhanced() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [business, setBusiness] = useState<BusinessRecord | null>(null);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);

  const reviewsUrl = useMemo(() => getGoogleReviewsUrl(business), [business]);
  const logoUrl = useMemo(() => getLogoUrl(business?.logo_url), [business?.logo_url]);

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
      document.querySelectorAll<HTMLButtonElement>('.dt-accordion-trigger').forEach(button => {
        if (!reviewsUrl || !isReviewsLabel(button.textContent || '')) return;
        if (button.dataset.googleReviewsLinked === 'true') return;

        button.dataset.googleReviewsLinked = 'true';
        button.title = 'Voir les avis Google';
        button.addEventListener('click', event => {
          event.preventDefault();
          event.stopImmediatePropagation();
          window.open(reviewsUrl, '_blank', 'noopener,noreferrer');
        }, true);
      });

      document.querySelectorAll<HTMLButtonElement>('.dt-qr-actions button').forEach(button => {
        if (isContactLabel(button.textContent || '')) {
          button.classList.add('dt-preview-hide-contact');
        }
      });

      const qrWrap = document.querySelector<HTMLElement>('.dt-qr-wrap');
      if (qrWrap && logoUrl && !qrWrap.querySelector('.dt-qr-logo-overlay')) {
        const logo = document.createElement('img');
        logo.className = 'dt-qr-logo-overlay';
        logo.src = logoUrl;
        logo.alt = '';
        logo.setAttribute('aria-hidden', 'true');
        qrWrap.appendChild(logo);
      }

      const qrCard = document.querySelector<HTMLElement>('.dt-qr-card');
      if (qrCard && !qrCard.querySelector('.dt-install-qr-preview')) {
        const installBox = document.createElement('div');
        installBox.className = 'dt-install-qr-preview';

        const title = document.createElement('strong');
        title.textContent = 'Votre QR toujours avec vous';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'dt-install-qr-button';
        button.innerHTML = '<span aria-hidden="true">▦</span><span>Installer mon QR</span>';
        button.addEventListener('click', async () => {
          if (installPrompt) {
            await installPrompt.prompt();
            await installPrompt.userChoice;
            setInstallPrompt(null);
            return;
          }

          const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
          window.alert(
            isIos
              ? 'Sur iPhone : ouvrez Partager puis « Ajouter à l’écran d’accueil ». Le raccourci ouvrira directement cette vitrine.'
              : 'Dans le menu de votre navigateur, choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil ». Le raccourci ouvrira directement cette vitrine.',
          );
        });

        const note = document.createElement('p');
        note.textContent = 'Ajoutez cette vitrine à l’écran d’accueil pour l’ouvrir directement comme une application.';

        installBox.append(title, button, note);
        qrCard.appendChild(installBox);
      }
    };

    enhance();
    const observer = new MutationObserver(enhance);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [installPrompt, logoUrl, reviewsUrl]);

  return <BusinessShowcaseLienoraDetail />;
}
