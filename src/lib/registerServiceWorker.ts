// Service Worker Registration
// Enregistre le service worker et signale proprement les nouvelles versions.

const UPDATE_KEY = 'dalil-tounes-pwa-update-ready';

function announceUpdate(): void {
  sessionStorage.setItem(UPDATE_KEY, '1');
  window.dispatchEvent(new Event('pwa-update-ready'));
}

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const hadController = Boolean(navigator.serviceWorker.controller);

      navigator.serviceWorker
        .register('/service-worker.js', { updateViaCache: 'none' })
        .then((registration) => {
          console.log('[PWA] Service Worker enregistré avec succès:', registration.scope);

          const checkForUpdate = () => registration.update().catch(() => undefined);
          void checkForUpdate();

          setInterval(checkForUpdate, 60 * 60 * 1000);
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') void checkForUpdate();
          });
        })
        .catch((error) => {
          console.error('[PWA] Échec de l\'enregistrement du Service Worker:', error);
        });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (hadController) announceUpdate();
      });
    });
  } else {
    console.warn('[PWA] Service Worker non supporté par ce navigateur');
  }
}

export function unregisterServiceWorker(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.getRegistrations().then((registrations) => {
      return Promise.all(
        registrations.map((registration) => registration.unregister())
      ).then(() => {
        console.log('[PWA] Service Workers désinstallés');
        return true;
      });
    });
  }
  return Promise.resolve(false);
}

export function clearCache(): Promise<void> {
  if ('caches' in window) {
    return caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[PWA] Suppression du cache:', cacheName);
          return caches.delete(cacheName);
        })
      ).then(() => {
        console.log('[PWA] Tous les caches ont été supprimés');
      });
    });
  }
  return Promise.resolve();
}

export function isAppInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

export function promptInstall(): Promise<void> {
  return new Promise((resolve, reject) => {
    let deferredPrompt: any;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('[PWA] Installation acceptée');
          resolve();
        } else {
          console.log('[PWA] Installation refusée');
          reject(new Error('Installation refusée'));
        }
        deferredPrompt = null;
      });
    } else {
      reject(new Error('Prompt d\'installation non disponible'));
    }
  });
}
