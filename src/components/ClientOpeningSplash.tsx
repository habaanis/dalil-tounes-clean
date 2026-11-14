import { useEffect, useState, type CSSProperties } from 'react';

export type ClientOpeningStyle = 'photo' | 'framed';

type Props = {
  name: string;
  product: string;
  logo: string;
  cover: string;
  palette: { page: string; surface: string; border: string; text: string; accent: string };
  style: ClientOpeningStyle;
  onSkip: () => void;
};

export default function ClientOpeningSplash({ name, product, logo, cover, palette, style, onSkip }: Props) {
  const isFramed = style === 'framed';
  // Both client variants use the same elegant Lienora-inspired composition:
  // a real product/facade photo across the center, light gold curves, and the client's own logo.
  const surface: CSSProperties = {
    backgroundColor: palette.page,
    color: palette.text,
  };
  return <main className="dt-client-opening" style={surface} aria-label={`Ouverture de ${name}`}>
    <div className="dt-client-opening-glow" aria-hidden="true" />
    <div className="dt-client-opening-photo" aria-hidden="true">
      <img src={cover} alt="" loading="eager" decoding="async" />
    </div>
    <svg className="dt-client-opening-curves" viewBox="0 0 400 760" preserveAspectRatio="none" aria-hidden="true">
      <path d="M -25 228 C 94 176, 261 154, 425 226" />
      <path d="M -25 533 C 113 490, 256 494, 425 553" />
    </svg>
    <div className={`dt-client-opening-identity${isFramed ? ' is-framed' : ''}`}>
      <div className="dt-client-opening-logo" style={{ borderColor: palette.border, backgroundColor: palette.surface }}>
        <img src={logo} alt="" loading="eager" decoding="async" />
      </div>
      <strong style={{ color: '#fff9e8' }}>{name}</strong>
      <span style={{ color: palette.accent }}>{product}</span>
    </div>
    <button type="button" className="dt-client-opening-skip" style={{ borderColor: palette.border }} onClick={onSkip}>Passer</button>
    <style>{`
      .dt-client-opening{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;overflow:hidden;isolation:isolate;background:var(--cvp-background,#063b30)}
      .dt-client-opening-glow{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 52%,#e3ba4e1e 0%,transparent 70%);pointer-events:none}
      .dt-client-opening-photo{position:absolute;inset:28% -3% 26%;clip-path:polygon(0 12%,12% 9%,27% 3%,43% 0,59% 5%,77% 11%,100% 2%,100% 86%,82% 94%,64% 100%,47% 96%,29% 88%,12% 98%,0 91%);overflow:hidden}
      .dt-client-opening-photo:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#061d15a6 0%,transparent 24%,transparent 73%,#061d1555 100%)}
      .dt-client-opening-photo img{display:block;width:100%;height:100%;object-fit:cover}
      .dt-client-opening-curves{position:absolute;inset:0;width:100%;height:100%;fill:none;stroke:#e9c36f;stroke-width:1.2;opacity:.82;filter:drop-shadow(0 0 2px #e5b65b55)}
      .dt-client-opening-identity{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;transform:translateY(4%);max-width:88vw;text-align:center}
      .dt-client-opening-logo{display:grid;place-items:center;width:clamp(114px,36vw,154px);height:clamp(114px,36vw,154px);padding:7px;overflow:hidden;border:3px solid #d6ac51;border-radius:50%;box-shadow:0 10px 28px #001e18ad,0 0 0 8px #fffaf0d1}
      .dt-client-opening-logo img{display:block;width:100%;height:100%;border-radius:50%;object-fit:contain}
      .dt-client-opening-identity strong{max-width:80vw;font:600 clamp(1.04rem,4.3vw,1.4rem)/1.2 Georgia,serif;text-shadow:0 2px 9px #001913;overflow-wrap:anywhere}
      .dt-client-opening-identity span{font:600 .69rem/1.2 Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase;text-shadow:0 2px 8px #001913}
      .dt-client-opening-identity.is-framed .dt-client-opening-logo{box-shadow:0 12px 32px #001e18ad,0 0 0 9px #f9e8b1d6,0 0 0 12px #d6ac51ad}
      .dt-client-opening-skip{position:absolute;right:18px;bottom:max(20px,env(safe-area-inset-bottom));z-index:3;padding:8px 17px;color:#fff6e2;background:#001e18c9;border:1px solid #d6ac51;border-radius:24px;font:600 .75rem Arial,sans-serif;cursor:pointer}
      @media(min-width:768px){.dt-client-opening-photo{inset:30% 12% 28%}.dt-client-opening-identity{transform:none}}
      @media(prefers-reduced-motion:reduce){.dt-client-opening-identity,.dt-client-opening-photo{transition:none}}
    `}</style>
  </main>;
}

/** Personal client opening: one short appearance per client and browser tab. */
export function ClientOpeningAuto(props: Omit<Props, 'onSkip'> & { clientId: string }) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined' || !props.logo || !props.cover) return false;
    const key = 'dalil-client-opening-v1:' + props.clientId;
    try {
      if (window.sessionStorage.getItem(key) === '1') return false;
      window.sessionStorage.setItem(key, '1');
    } catch { /* Storage might be unavailable; keep splash non-blocking. */ }
    return true;
  });
  useEffect(() => {
    if (!visible) return;
    const timeout = window.setTimeout(() => setVisible(false), 1900);
    return () => window.clearTimeout(timeout);
  }, [visible]);
  return visible ? <ClientOpeningSplash {...props} onSkip={() => setVisible(false)} /> : null;
}
