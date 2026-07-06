import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * GuideMascot — Dalil, le guide officiel de Dalil Tounes.
 *
 * REGLES D'USAGE (à respecter sur tout le site) :
 * - Une seule apparition de Dalil par page.
 * - Dalil doit toujours aider ou expliquer quelque chose : jamais une simple décoration.
 * - Ne jamais le placer avant l'action principale de la page d'accueil.
 * - Ne pas surcharger une page avec plusieurs mascottes.
 * - Ton : professionnel, discret, chaleureux et utile — jamais enfantin ni envahissant.
 */

export const MASCOT_IMAGE_URL = '/images/mascotte-dalil-transparent.png';

type MascotPosition = 'left' | 'right' | 'center';
type MascotSize = 'sm' | 'md' | 'lg';
export type MascotVariant = 'welcome' | 'tip' | 'info' | 'success' | 'business';
export type MascotPose = 'hello' | 'point' | 'thumbsUp' | 'idea' | 'celebrate' | 'thinking';

interface GuideMascotProps {
  title?: string;
  message?: ReactNode;
  children?: ReactNode;
  position?: MascotPosition;
  size?: MascotSize;
  variant?: MascotVariant;
  pose?: MascotPose;
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

// Habillage discret de la carte selon l'intention du message.
// Les fonds restent clairs et le texte toujours foncé pour garder un contraste lisible.
const VARIANT_STYLES: Record<MascotVariant, string> = {
  welcome: 'border-[#D4AF37]/25 bg-gradient-to-br from-[#FFFDF6] to-[#FBF6E8]',
  tip: 'border-[#D4AF37]/30 bg-gradient-to-br from-[#FFFDF6] to-[#FBF3DE]',
  info: 'border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100',
  success: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50',
  business: 'border-[#D4AF37]/30 bg-gradient-to-br from-[#FBF6E8] to-[#F3ECD8]',
};

// Chaque pose pourra recevoir plus tard sa propre image officielle détourée.
// Tant qu'une pose n'a pas d'image dédiée, on retombe sur l'image officielle actuelle.
const POSE_IMAGES: Record<MascotPose, string> = {
  hello: MASCOT_IMAGE_URL,
  point: MASCOT_IMAGE_URL,
  thumbsUp: MASCOT_IMAGE_URL,
  idea: MASCOT_IMAGE_URL,
  celebrate: MASCOT_IMAGE_URL,
  thinking: MASCOT_IMAGE_URL,
};

/**
 * Textes prédéfinis réutilisables. Import : `MASCOT_PRESETS.welcome`, etc.
 * `home` est préparé pour une future intégration sur la page d'accueil (non utilisé pour l'instant).
 */
export const MASCOT_PRESETS: Record<
  'welcome' | 'search' | 'tip' | 'business' | 'success' | 'home',
  { title: string; message: string; variant: MascotVariant; pose: MascotPose }
> = {
  welcome: {
    title: 'Bonjour ! Je suis Dalil.',
    message: "Je vais t'aider à découvrir Dalil Tounes.",
    variant: 'welcome',
    pose: 'hello',
  },
  search: {
    title: 'Tu cherches un professionnel ?',
    message: 'Indique simplement un métier, une activité ou une ville.',
    variant: 'info',
    pose: 'point',
  },
  tip: {
    title: 'Le conseil de Dalil',
    message: 'Regarde les informations utiles avant de contacter un professionnel.',
    variant: 'tip',
    pose: 'idea',
  },
  business: {
    title: 'Tu souhaites développer ton activité ?',
    message:
      "Dalil Tounes peut t'aider à être plus visible et à recevoir plus de contacts.",
    variant: 'business',
    pose: 'thumbsUp',
  },
  success: {
    title: 'Bien joué !',
    message: 'Tu avances dans la découverte de la plateforme.',
    variant: 'success',
    pose: 'celebrate',
  },
  home: {
    title: 'Bonjour ! Je suis Dalil.',
    message:
      'Je peux t\u2019aider à trouver un artisan, un commerçant ou un professionnel de confiance.',
    variant: 'welcome',
    pose: 'hello',
  },
};

function MascotImage({ size, pose }: { size: MascotSize; pose: MascotPose }) {
  return (
    <div className={`flex-shrink-0 ${SIZE_MAP[size]} guide-mascot-figure`}>
      <img
        src={POSE_IMAGES[pose]}
        alt="Dalil, la mascotte officielle de Dalil Tounes"
        className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] guide-mascot-img"
        loading="lazy"
        width={624}
        height={638}
      />
    </div>
  );
}

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

// Animations volontairement très discrètes (transforms GPU uniquement, désactivées si
// l'utilisateur préfère moins de mouvement). Objectif : donner vie à Dalil sans distraire.
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

export function GuideMascot({
  title,
  message,
  children,
  position = 'left',
  size = 'md',
  variant = 'welcome',
  pose = 'hello',
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
      className={`guide-mascot flex ${layout} gap-5 sm:gap-6 rounded-2xl border p-5 sm:p-6 shadow-sm ${VARIANT_STYLES[variant]} ${className}`}
    >
      <style>{MASCOT_ANIMATION_CSS}</style>
      <MascotImage size={size} pose={pose} />

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
