import { useEffect, useState } from 'react';
import './platformOpening.css';

const PRESTIGE_ART = 'https://raw.githubusercontent.com/habaanis/dalil-tounes-clean/main/dalil-tounes-prestige.png';
const FIRST_OPEN_KEY = 'dalil-platform-prestige-opened-v2';

function shouldShowPlatformOpening() {
  if (typeof window === 'undefined' || window.location.pathname !== '/') return false;
  // Show the platform branding on an ordinary link as well as on the installed app.
  // Only once per browser tab to avoid interrupting every return to the homepage.
  try {
    if (window.sessionStorage.getItem(FIRST_OPEN_KEY) === '1') return false;
    window.sessionStorage.setItem(FIRST_OPEN_KEY, '1');
  } catch { /* Private browsing can disable storage. */ }
  return true;
}

/** Platform opening is deliberately separate from individual client CV openings. */
export function PlatformPrestigeLaunch() {
  const [visible, setVisible] = useState(shouldShowPlatformOpening);
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const safety = window.setTimeout(() => setVisible(false), 3600);
    return () => window.clearTimeout(safety);
  }, [visible]);

  useEffect(() => {
    if (!visible || !imageReady) return;
    const close = window.setTimeout(() => setVisible(false), 1800);
    return () => window.clearTimeout(close);
  }, [visible, imageReady]);

  if (!visible) return null;
  return <div className="dalil-prestige-launch" role="status" aria-label="Ouverture de Dalil Tounes">
    <img className="dalil-prestige-launch-fallback" src="/icons/dalil-prestige-512.png" alt="Dalil Tounes" />
    <img className="platform-opening-art" src={PRESTIGE_ART} alt="Dalil Tounes — Découvrir, Trouver, Vivre" loading="eager" decoding="async"
      onLoad={() => setImageReady(true)} onError={() => setImageReady(false)} />
    <button type="button" onClick={() => setVisible(false)} aria-label="Passer l'ouverture">Passer</button>
    <style>{`
      .dalil-prestige-launch{position:fixed;inset:0;z-index:2147483600;background:#06172b;display:grid;place-items:center;overflow:hidden}
      .dalil-prestige-launch-fallback{position:absolute;width:clamp(110px,30vw,190px);height:auto;object-fit:contain}
      .dalil-prestige-launch .platform-opening-art{position:relative;z-index:1;max-height:100dvh}
      .dalil-prestige-launch button{position:absolute;z-index:2;right:17px;bottom:max(18px,env(safe-area-inset-bottom));background:#081c30d9;border:1px solid #d9b873;border-radius:24px;color:#fff3d7;padding:9px 16px;font:600 13px Arial,sans-serif;cursor:pointer}
      @media(prefers-reduced-motion:reduce){.dalil-prestige-launch{transition:none}}
    `}</style>
  </div>;
}
