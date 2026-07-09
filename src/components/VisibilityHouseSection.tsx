import { ArrowRight, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const platformWindows = [
  {
    label: 'Google Business',
    shortLabel: 'Google',
    description: 'Les clients vous trouvent localement.',
    tone: 'from-white to-[#F7FBFF]',
  },
  {
    label: 'Facebook',
    shortLabel: 'Facebook',
    description: 'Vous échangez avec votre communauté.',
    tone: 'from-[#F7FBFF] to-white',
  },
  {
    label: 'Instagram',
    shortLabel: 'Instagram',
    description: 'Vous montrez vos réalisations.',
    tone: 'from-[#FFF7FB] to-white',
  },
  {
    label: 'WhatsApp',
    shortLabel: 'WhatsApp',
    description: 'Vous facilitez le contact direct.',
    tone: 'from-[#F4FFF8] to-white',
  },
  {
    label: 'Site web',
    shortLabel: 'Site web',
    description: 'Vous présentez votre activité en détail.',
    tone: 'from-[#FFFCF2] to-white',
  },
  {
    label: 'Avis Google',
    shortLabel: 'Avis',
    description: 'Vous rassurez grâce aux retours clients.',
    tone: 'from-white to-[#FFFCF2]',
  },
  {
    label: 'Portfolio',
    shortLabel: 'Portfolio',
    description: 'Vous montrez votre savoir-faire.',
    tone: 'from-[#F8F6FB] to-white',
  },
  {
    label: 'CV Business Dalil Tounes',
    shortLabel: 'CV Business',
    description: 'Vous rassemblez toutes vos informations dans une fiche claire.',
    tone: 'from-[#FFF8E1] to-white',
  },
];

function VisibilityHouseIllustration() {
  const [activeWindow, setActiveWindow] = useState(platformWindows[7]);

  return (
    <div className="relative mx-auto w-full max-w-[680px]" aria-label="Maison Dalil Tounes de la visibilité numérique">
      <div className="absolute -left-4 top-16 hidden h-20 w-20 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 md:block" />
      <div className="absolute -right-4 bottom-20 hidden h-24 w-24 rounded-full border border-[#065F46]/10 bg-[#065F46]/5 md:block" />

      <div className="relative pt-16">
        <div
          className="absolute left-1/2 top-0 z-0 h-52 w-52 -translate-x-1/2 rotate-45 rounded-[30px] border-l border-t border-[#D4AF37]/70 bg-gradient-to-br from-[#4A1D43] via-[#63305B] to-[#065F46] shadow-[0_18px_45px_rgba(74,29,67,0.22)]"
          aria-hidden="true"
        />
        <div className="absolute left-[58%] top-5 z-10 h-16 w-8 rounded-t-lg border border-[#D4AF37]/45 bg-[#4A1D43] shadow-md" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-[560px] rounded-[30px] border border-[#D4AF37]/55 bg-gradient-to-b from-white via-[#FFFCF5] to-[#F8F4EA] p-4 shadow-[0_24px_80px_rgba(74,29,67,0.18)] md:p-6">
          <div className="absolute left-1/2 top-0 h-10 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/60 bg-white px-3 py-2 text-center text-xs font-bold text-[#4A1D43] shadow-sm">
            Maison Dalil
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {platformWindows.map((room) => {
              const isActive = activeWindow.label === room.label;

              return (
                <button
                  key={room.label}
                  type="button"
                  onMouseEnter={() => setActiveWindow(room)}
                  onFocus={() => setActiveWindow(room)}
                  onClick={() => setActiveWindow(room)}
                  aria-label={`${room.label} : ${room.description}`}
                  className={`group relative flex min-h-[82px] items-center justify-center overflow-hidden rounded-2xl border px-3 py-3 text-center text-xs font-bold leading-snug shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(74,29,67,0.16)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70 ${
                    isActive
                      ? 'border-[#D4AF37] bg-[#FFF8E1] text-[#4A1D43] ring-2 ring-[#D4AF37]/35'
                      : `border-[#D4AF37]/35 bg-gradient-to-br ${room.tone} text-[#4A1D43]`
                  }`}
                >
                  <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-[#D4AF37]/70 transition group-hover:scale-125" aria-hidden="true" />
                  <span className="relative z-10">{room.shortLabel}</span>
                  <span className="absolute inset-x-3 bottom-2 h-1 rounded-full bg-[#065F46]/10" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div className="relative mx-auto mt-5 flex max-w-sm items-center justify-center gap-3 rounded-2xl border border-[#D4AF37]/55 bg-[#4A1D43] px-5 py-4 text-white shadow-inner">
            <span className="text-3xl" aria-hidden="true">🏠</span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">Au centre</p>
              <p className="text-lg font-bold leading-tight">Votre entreprise</p>
            </div>
          </div>

          <div className="mx-auto mt-4 max-w-md rounded-2xl border border-[#D4AF37]/35 bg-white/90 p-4 text-center shadow-sm" aria-live="polite">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D4AF37]">{activeWindow.label}</p>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-[#4A1D43]">{activeWindow.description}</p>
          </div>

          <div className="mx-auto mt-5 grid w-44 grid-cols-3 overflow-hidden rounded-t-2xl border border-[#D4AF37]/40 bg-[#F8F4EA]" aria-hidden="true">
            <span className="h-5 border-r border-[#D4AF37]/30 bg-[#065F46]/10" />
            <span className="h-5 border-r border-[#D4AF37]/30 bg-[#D4AF37]/20" />
            <span className="h-5 bg-[#4A1D43]/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function VisibilitySummary() {
  return (
    <div className="mx-auto max-w-md rounded-[26px] border border-[#D4AF37]/30 bg-white/80 p-5 shadow-[0_18px_45px_rgba(74,29,67,0.08)] backdrop-blur">
      <p className="text-sm leading-relaxed text-gray-700">
        Chaque fenêtre joue un rôle. Ensemble, elles construisent une présence numérique plus claire, plus rassurante et plus facile à retrouver.
      </p>
      <Link
        to="/businesses"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-[#D4AF37] bg-[#4A1D43] px-6 py-3 text-sm font-bold text-[#D4AF37] shadow-[0_12px_30px_rgba(74,29,67,0.18)] transition hover:bg-[#5A2D53] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/70"
      >
        <Briefcase className="h-4 w-4" aria-hidden="true" />
        Découvrir le CV Business
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function VisibilityHouseSection() {
  return (
    <section id="maison-visibilite" className="scroll-mt-24 bg-gradient-to-b from-white via-[#FFFCF5] to-white px-4 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
            Maison Dalil Tounes
          </p>
          <h2 className="text-2xl font-bold leading-tight text-[#4A1D43] md:text-4xl">
            La Maison de la visibilité numérique
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-[#4A1D43] md:text-lg">
            Aucune plateforme ne suffit à elle seule.
            <br />
            C'est l'ensemble de votre présence numérique qui fait votre force.
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <VisibilityHouseIllustration />
          <VisibilitySummary />
        </div>
      </div>
    </section>
  );
}
