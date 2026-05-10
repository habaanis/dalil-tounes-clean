import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './lib/registerServiceWorker';
import { supportsWebP } from './lib/imageUtils';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

// Suppression des warnings Supabase tracing non critiques
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args[0]?.toString() || '';
  if (
    message.includes('Could not add aborted') ||
    message.includes('no active span found') ||
    message.includes('aborted.isDebounce') ||
    message.includes('Multiple GoTrueClient instances')
  ) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Détection de l'environnement Bolt WebContainer (dev ET preview)
const isBoltWebContainer =
  window.location.hostname.includes('webcontainer') ||
  window.location.hostname.includes('stackblitz') ||
  window.location.hostname.includes('bolt.new') ||
  (import.meta.env.DEV && window.location.port === '5173');

// Utiliser HashRouter pour Bolt/dev, BrowserRouter pour production
const Router = isBoltWebContainer ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  </StrictMode>
);

if (import.meta.env.PROD) {
  registerServiceWorker();
}

supportsWebP();

// Applique loading="lazy" + decoding="async" automatiquement à toutes les balises img.
// Les images prioritaires (hero, logo, LCP) doivent porter loading="eager" pour
// être exclues — voir fetchpriority/priority dans OptimizedImage.
const tuneImg = (img: HTMLImageElement) => {
  if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
  if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
};
const applyImgDefaults = (root: ParentNode) => {
  root.querySelectorAll<HTMLImageElement>('img').forEach(tuneImg);
};
applyImgDefaults(document);
const imgObserver = new MutationObserver((mutations) => {
  for (const m of mutations) {
    m.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        if (node.tagName === 'IMG') {
          tuneImg(node as HTMLImageElement);
        } else {
          applyImgDefaults(node);
        }
      }
    });
  }
});
imgObserver.observe(document.body, { childList: true, subtree: true });
