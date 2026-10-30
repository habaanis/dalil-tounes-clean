import { useEffect, useState } from 'react';

const PRESTIGE_ART = 'https://raw.githubusercontent.com/habaanis/dalil-tounes-clean/main/dalil-tounes-prestige.png';

function isInstalledPlatformHome() {
  if (typeof window === 'undefined') return false;
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
  return Boolean(standalone && /^(dalil-tounes\.com|www\.dalil-tounes\.com)$/.test(window.location.hostname) && window.location.pathname === '/');
}

/** Branding for the installed platform only, never for business CV mini-apps. */
export function PlatformPrestigeLaunch() {
  const [visible, setVisible] = useState(isInstalledPlatformHome);
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    if (!visible) return;
    // Never prevent the visitor from accessing Dalil Tounes.
    const safety = window.setTimeout(() => setVisible(false), 8500);
    return () => window.clearTimeout(safety);
  }, [visible]);

  useEffect(() => {
    if (!visible || !imageReady) return;
    const timeout = window.setTimeout(() => setVisible(false), 5200);
    return () => window.clearTimeout(timeout);
  }, [visible, imageReady]);

  if (!visible) return null;
  return <div className="dalil-prestige-launch" role="status" aria-label="Ouverture de Dalil Tounes">
    <img src={PRESTIGE_ART} alt="" loading="eager" decoding="async" onLoad={() => setImageReady(true)} onError={() => setVisible(false)} />
    <button type="button" onClick={() => setVisible(false)} aria-label="Passer l'ouverture">Passer</button>
    <style>{`
      .dalil-prestige-launch{position:fixed;inset:0;z-index:2147483600;background:#06172b;display:grid;place-items:center;overflow:hidden}
      .dalil-prestige-launch img{width:100%;height:100%;object-fit:contain;object-position:center}
      .dalil-prestige-launch button{position:absolute;right:17px;bottom:max(18px,env(safe-area-inset-bottom));background:#081c30d9;border:1px solid #d9b873;border-radius:24px;color:#fff3d7;padding:9px 16px;font:600 13px Arial,sans-serif;cursor:pointer}
      @media(prefers-reduced-motion:reduce){.dalil-prestige-launch{transition:none}}
    `}</style>
  </div>;
}
