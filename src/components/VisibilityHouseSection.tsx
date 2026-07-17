import { ArrowRight, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const platformWindows = [
  {
    label: 'Google Business',
    description: 'Les clients vous trouvent localement.',
    position: { left: '30.6%', top: '39.5%', width: '8.1%', height: '5.8%' },
  },
  {
    label: 'Facebook',
    description: 'Vous échangez avec votre communauté.',
    position: { left: '39.7%', top: '39.8%', width: '7.8%', height: '4.8%' },
  },
  {
    label: 'Instagram',
    description: 'Vous montrez vos réalisations.',
    position: { left: '49.0%', top: '39.8%', width: '7.5%', height: '4.8%' },
  },
  {
    label: 'WhatsApp',
    description: 'Vous facilitez le contact direct.',
    position: { left: '30.2%', top: '56.4%', width: '8.4%', height: '5.3%' },
  },
  {
    label: 'Site web',
    description: 'Vous présentez votre activité en détail.',
    position: { left: '40.0%', top: '57.0%', width: '7.8%', height: '4.9%' },
  },
  {
    label: 'CV Business',
    description: 'Vous rassemblez toutes vos informations dans une fiche claire.',
    position: { left: '48.5%', top: '49.0%', width: '8.5%', height: '12.7%' },
    featured: true,
  },
];

function VisibilityHouseIllustration() {
  const [activeWindow, setActiveWindow] = useState(platformWindows[5]);

  return (
    <div className="relative mx-auto w-full max-w-[760px]" aria-label="Maison Dalil Tounes de la visibilité numérique">
      <div className="relative aspect-[3/2] overflow-visible">
        <img
          src="/images/maison-dalil-tounes-validee.png"
          alt="Maison Dalil Tounes représentant la présence numérique d'une entreprise"
          className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_22px_48px_rgba(74,29,67,0.16)]"
          loading="lazy"
        />

        <img
          src="/images/mascotte-dalil-transparent.png"
          alt="Dalil, la mascotte officielle, présente la Maison Dalil Tounes"
          className="absolute bottom-[7%] left-[9%] z-20 h-[39%] w-auto -rotate-3 drop-shadow-[0_18px_24px_rgba(74,29,67,0.22)] sm:bottom-[8%] sm:left-[10%] sm:h-[40%] md:bottom-[8%] md:left-[7%] md:h-[42%] lg:left-[6%]"
          loading="lazy"
        />

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
              className={`absolute z-30 flex items-center justify-center rounded-[7%] border border-[#D4AF37]/45 bg-[#FFEAA8]/95 px-1 text-center font-black leading-tight text-[#1F1B16] shadow-[0_0_12px_rgba(255,220,110,0.6)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#FFF1B8] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/80 ${
                isActive ? 'ring-2 ring-[#D4AF37]/75' : ''
              } ${room.featured ? 'text-[10px] sm:text-xs md:text-sm' : 'text-[8px] sm:text-[10px] md:text-xs'}`}
              style={room.position}
            >
              <span>{room.label}</span>
            </button>
          );
        })}

        <div className="absolute left-[82.1%] top-[27.4%] z-30 flex h-[11.3%] w-[8.2%] flex-col items-center justify-center rounded-xl bg-[#222018]/95 px-1 text-center text-[10px] font-black leading-tight text-white shadow-[0_0_10px_rgba(0,0,0,0.35)] sm:text-xs md:text-sm">
          <span>Dalil</span>
          <span>Tounes</span>
        </div>

        <div className="absolute left-[81.0%] top-[69.1%] z-30 flex h-[12.4%] w-[9.4%] items-center justify-center rounded-md bg-[#201F1A]/95 px-1.5 text-center text-[7px] font-bold leading-tight text-white shadow-[0_0_8px_rgba(0,0,0,0.4)] sm:text-[9px] md:text-[10px]">
          <span>
            Un seul endroit,
            <br />
            toutes vos connexions !
          </span>
        </div>

        <div className="absolute bottom-[2%] left-1/2 z-30 max-w-[58%] -translate-x-1/2 rounded-2xl border border-[#D4AF37]/35 bg-white/90 px-4 py-2 text-center shadow-sm backdrop-blur-sm" aria-live="polite">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#D4AF37] sm:text-[10px]">{activeWindow.label}</p>
          <p className="mt-0.5 text-[10px] font-semibold leading-relaxed text-[#4A1D43] sm:text-xs">{activeWindow.description}</p>
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
            🏠 Votre présence sur Internet
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-[#4A1D43] md:text-lg">
            Aucune plateforme ne suffit à elle seule.
            <br />
            C'est l'ensemble de votre présence sur Internet qui fait votre force.
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
