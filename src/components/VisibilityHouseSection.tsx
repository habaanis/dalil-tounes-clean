import { ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const MAISON_DALIL_IMAGE = '/images/ChatGPT_Image_17_juil._2026,_13_09_03.png';
const MASCOTTE_DALIL_IMAGE = '/images/ChatGPT_Image_6_juil._2026,_21_21_12.png';

function VisibilityHouseIllustration() {
  return (
    <div className="relative mx-auto flex w-full max-w-[720px] flex-col items-center justify-center gap-2 sm:flex-row sm:items-end sm:gap-0">
      <img
        src={MASCOTTE_DALIL_IMAGE}
        alt="Mascotte Dalil qui accueille les visiteurs et présente la maison Dalil Tounes"
        loading="lazy"
        className="order-2 w-28 shrink-0 object-contain drop-shadow-[0_12px_28px_rgba(74,29,67,0.18)] sm:order-1 sm:-mr-4 sm:w-32 sm:self-center md:w-40 lg:w-44"
      />
      <img
        src={MAISON_DALIL_IMAGE}
        alt="Maison tunisienne Dalil Tounes avec sa porte verte et ses six fenêtres Google Business, Facebook, Instagram, WhatsApp, Site web et CV Business"
        loading="lazy"
        className="order-1 w-full max-w-[560px] object-contain drop-shadow-[0_18px_40px_rgba(74,29,67,0.18)] sm:order-2"
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
