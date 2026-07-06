import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export const MASCOT_IMAGE_URL = '/images/mascotte-dalil-transparent.png';

type MascotPosition = 'left' | 'right' | 'center';
type MascotSize = 'sm' | 'md' | 'lg';

interface GuideMascotProps {
  title?: string;
  message?: ReactNode;
  children?: ReactNode;
  position?: MascotPosition;
  size?: MascotSize;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
}

const SIZE_MAP: Record<MascotSize, string> = {
  sm: 'w-20 h-20 sm:w-24 sm:h-24',
  md: 'w-28 h-28 sm:w-32 sm:h-32',
  lg: 'w-36 h-36 sm:w-44 sm:h-44',
};

function MascotImage({ size }: { size: MascotSize }) {
  return (
    <div className={`flex-shrink-0 ${SIZE_MAP[size]} guide-mascot-figure`}>
      <img
        src={MASCOT_IMAGE_URL}
        alt="Dalil, la mascotte officielle de Dalil Tounes"
        className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] guide-mascot-img"
        loading="lazy"
        width={624}
        height={638}
      />
    </div>
  );
}

const MASCOT_ANIMATION_CSS = `
  @keyframes guideMascotAppear {
    from { opacity: 0; transform: translate3d(0, 12px, 0); }
    to   { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes guideMascotBreathe {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50%      { transform: translate3d(0, -2px, 0); }
  }
  @keyframes guideMascotGreet {
    0%   { transform: rotate(0deg); }
    25%  { transform: rotate(-2.5deg); }
    55%  { transform: rotate(1.5deg); }
    100% { transform: rotate(0deg); }
  }
  .guide-mascot {
    animation: guideMascotAppear 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .guide-mascot-figure {
    animation: guideMascotBreathe 4.5s ease-in-out infinite;
    will-change: transform;
  }
  .guide-mascot-img {
    transform-origin: 50% 88%;
  }
  @media (hover: hover) and (pointer: fine) {
    .guide-mascot-figure:hover .guide-mascot-img {
      animation: guideMascotGreet 300ms ease-in-out;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .guide-mascot,
    .guide-mascot-figure,
    .guide-mascot-figure:hover .guide-mascot-img {
      animation: none;
    }
  }
`;

function MascotCta({ label, href, onClick }: { label: string; href?: string; onClick?: () => void }) {
  const classes =
    'inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4AF37] text-white font-semibold text-sm hover:bg-[#c9a42e] transition-colors shadow-sm hover:shadow-md';

  if (href) {
    if (/^https?:\/\//i.test(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {label}
        </a>
      );
    }
    return (
      <Link to={href} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {label}
    </button>
  );
}

export function GuideMascot({
  title,
  message,
  children,
  position = 'left',
  size = 'md',
  ctaLabel,
  ctaHref,
  onCtaClick,
  className = '',
}: GuideMascotProps) {
  const body = children ?? message;
  const isCenter = position === 'center';

  const layout = isCenter
    ? 'flex-col items-center text-center'
    : position === 'right'
      ? 'flex-col sm:flex-row-reverse items-center text-center sm:text-right'
      : 'flex-col sm:flex-row items-center text-center sm:text-left';

  const showCta = Boolean(ctaLabel && (ctaHref || onCtaClick));

  return (
    <div
      className={`guide-mascot flex ${layout} gap-5 sm:gap-6 rounded-2xl border border-[#D4AF37]/25 bg-gradient-to-br from-[#FFFDF6] to-[#FBF6E8] p-5 sm:p-6 shadow-sm ${className}`}
    >
      <style>{MASCOT_ANIMATION_CSS}</style>
      <MascotImage size={size} />

      <div className="flex-1 space-y-2">
        {title && (
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{title}</h3>
        )}
        {body && (
          <div className="text-sm sm:text-base text-gray-600 leading-relaxed">{body}</div>
        )}
        {showCta && (
          <div className={`pt-2 ${isCenter ? 'flex justify-center' : ''}`}>
            <MascotCta label={ctaLabel!} href={ctaHref} onClick={onCtaClick} />
          </div>
        )}
      </div>
    </div>
  );
}

export default GuideMascot;
