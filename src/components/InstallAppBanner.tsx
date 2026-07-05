import { useState, useEffect, useCallback } from 'react';
import { Download, X, Share } from 'lucide-react';
import { isAppInstalled } from '../lib/registerServiceWorker';
import { supabase } from '../lib/supabaseClient';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type Platform = 'android' | 'ios' | 'desktop' | 'unknown';

function detectPlatform(): Platform {
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'android';
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Win|Mac|Linux/.test(navigator.platform) && navigator.maxTouchPoints <= 1) return 'desktop';
  return 'unknown';
}

function isInStandaloneMode(): boolean {
  return isAppInstalled();
}

function trackDownloadEvent(actionType: string, deviceType: string) {
  supabase.from('app_download_events').insert({
    action_type: actionType,
    device_type: deviceType,
    page_source: window.location.pathname,
    user_agent: navigator.userAgent.slice(0, 500),
  }).then(({ error }) => {
    if (error) console.warn('[InstallTrack] Error:', error.message);
  });
}

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const platform = detectPlatform();

  useEffect(() => {
    if (isInStandaloneMode()) {
      setInstalled(true);
      return;
    }

    const dismissed = sessionStorage.getItem('pwa-banner-dismissed');
    if (dismissed) setDismissed(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => setInstalled(true));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (platform === 'ios') {
      trackDownloadEvent('pwa_ios_guide_shown', platform);
      setShowIOSGuide(true);
      return;
    }

    trackDownloadEvent('pwa_install_click', platform);

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        trackDownloadEvent('pwa_install_accepted', platform);
        setInstalled(true);
      }
      setDeferredPrompt(null);
      return;
    }
  }, [platform, deferredPrompt]);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa-banner-dismissed', '1');
  };

  if (installed || dismissed) return null;
  if (platform === 'desktop' && !deferredPrompt) return null;
  if (platform !== 'ios' && platform !== 'android' && !deferredPrompt) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-[#4A1D43] to-[#6B2D63] rounded-xl border border-[#D4AF37]/40 p-4 flex items-center gap-3 shadow-lg">
        <div className="flex-shrink-0 w-10 h-10 bg-[#D4AF37]/15 rounded-lg flex items-center justify-center">
          <Download className="w-5 h-5 text-[#D4AF37]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">
            Installer Dalil Tounes
          </p>
          <p className="text-xs text-gray-300 mt-0.5 leading-snug">
            {platform === 'ios'
              ? 'Ajoutez l\'app sur votre iPhone'
              : 'Accès rapide depuis votre mobile'}
          </p>
        </div>

        <button
          onClick={handleInstallClick}
          className="flex-shrink-0 px-3.5 py-2 bg-[#D4AF37] text-[#4A1D43] text-xs font-bold rounded-lg hover:bg-[#E5C048] transition-colors"
        >
          Installer
        </button>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1.5 text-gray-400 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {showIOSGuide && (
        <div
          className="fixed inset-0 bg-black/70 z-[99999] flex items-end sm:items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowIOSGuide(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="bg-[#4A1D43] px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#D4AF37]">
                Installer sur iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-gray-300 hover:text-white transition"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4A1D43] text-[#D4AF37] flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Appuyez sur le bouton Partager
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Share className="w-4 h-4 text-[#007AFF]" />
                    <span className="text-xs text-gray-500">en bas de Safari</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4A1D43] text-[#D4AF37] flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Faites defiler et appuyez sur
                  </p>
                  <p className="text-sm font-semibold text-[#4A1D43] mt-0.5">
                    "Sur l'ecran d'accueil"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4A1D43] text-[#D4AF37] flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Confirmez en appuyant sur "Ajouter"
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    L'icone Dalil Tounes apparaitra sur votre ecran d'accueil
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center pt-2 border-t border-gray-100">
                Fonctionne uniquement avec Safari
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
