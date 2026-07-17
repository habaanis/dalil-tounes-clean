import { ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const MAISON_DALIL_IMAGE = '/images/ChatGPT_Image_17_juil._2026,_12_53_27.png';

function VisibilityHouseIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <img
        src={MAISON_DALIL_IMAGE}
        alt="Maison Dalil Tounes réunissant Google Business, Facebook, Instagram, WhatsApp, Site web et Dalil Tounes autour de la mascotte Dalil"
        loading="lazy"
        className="mx-auto w-full rounded-[28px] object-contain shadow-[0_24px_80px_rgba(74,29,67,0.18)]"
      />
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
