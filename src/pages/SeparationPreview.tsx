import { ArrowRight, Building2, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import CvBusinessJourney from '../components/CvBusinessJourney';
import SearchBar from '../components/SearchBar';
import VisibilityHouseSection from '../components/VisibilityHouseSection';
import { useHomeData } from '../hooks/useHomeData';

const categories = [
  ['Santé', '/citizens/sante'],
  ['Éducation', '/education'],
  ['Commerces', '/citizens/shops'],
  ['Services', '/citizens/services'],
];

export default function SeparationPreview() {
  const [view, setView] = useState<'platform' | 'cv'>('platform');
  const { totalCount, loading } = useHomeData();

  return (
    <div className="bg-white text-slate-900">
      <div className="sticky top-0 z-40 border-b border-[#D4AF37]/35 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <p className="hidden text-sm font-bold text-[#4A1D43] sm:block">Maquette de séparation — aucun changement publié</p>
          <div className="grid w-full grid-cols-2 gap-2 rounded-2xl bg-[#F7F2E8] p-1.5 sm:w-auto">
            <button type="button" onClick={() => setView('platform')} className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${view === 'platform' ? 'bg-[#4A1D43] text-white shadow-sm' : 'bg-white text-[#4A1D43]'}`}>
              Accueil plateforme
            </button>
            <button type="button" onClick={() => setView('cv')} className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${view === 'cv' ? 'bg-[#4A1D43] text-white shadow-sm' : 'bg-white text-[#4A1D43]'}`}>
              Espace CV Business
            </button>
          </div>
        </div>
      </div>

      {view === 'platform' ? (
        <>
          <section className="border-b border-[#D4AF37]/25 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_28%),linear-gradient(135deg,#fffdf8_0%,#ffffff_52%,#f7f0f5_100%)] px-4 py-10 md:py-16">
            <div className="mx-auto max-w-5xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#4A1D43] shadow-sm">
                <Building2 className="h-4 w-4 text-[#D4AF37]" /> Plateforme et annuaire tunisien
              </div>
              <h1 className="mx-auto mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight text-[#2E102A] md:text-6xl">Trouvez les entreprises et les services dont vous avez besoin en Tunisie.</h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">Recherchez une activité, découvrez les professionnels référencés et contactez-les directement.</p>
              <div className="mx-auto mt-7 max-w-3xl rounded-2xl border border-[#D4AF37]/40 bg-white p-3 shadow-[0_18px_45px_rgba(74,29,67,0.10)]">
                <SearchBar scope="global" autoSearch resultMode="redirectToResults" />
              </div>
              <div className="mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4">
                {categories.map(([label, href]) => (
                  <a key={href} href={href} className="min-h-11 rounded-xl border border-[#D4AF37]/40 bg-white px-3 py-3 text-sm font-bold text-[#4A1D43] transition hover:bg-[#FFF8DF]">{label}</a>
                ))}
              </div>
            </div>
          </section>

          <VisibilityHouseSection totalCount={totalCount} loading={loading} />

          <section className="bg-[#2E102A] px-4 py-8 text-white">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#F1D783]">Vous êtes professionnel ?</p>
                <h2 className="mt-2 font-serif text-2xl font-bold md:text-3xl">Présentez votre activité avec un CV Business Dalil Tounes.</h2>
                <p className="mt-2 text-sm text-white/80">CV Business, CV Portfolio et QR Business dans un espace dédié.</p>
              </div>
              <button type="button" onClick={() => setView('cv')} className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-black text-[#2E102A]">
                Découvrir le CV Business <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="border-b border-[#D4AF37]/25 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_28%),linear-gradient(135deg,#fffdf8_0%,#ffffff_52%,#f7f0f5_100%)] px-4 py-8 md:py-14">
            <div className="mx-auto grid max-w-[1180px] items-center gap-8 lg:grid-cols-[1fr_0.72fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#4A1D43] shadow-sm">
                  <Sparkles className="h-4 w-4 text-[#D4AF37]" /> Espace professionnel Dalil Tounes
                </div>
                <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-[#2E102A] md:text-5xl">Votre entreprise mérite mieux qu’une simple fiche.</h1>
                <p className="mt-3 font-serif text-2xl font-bold leading-tight text-[#B58A18] md:text-3xl">Créez votre CV Business et choisissez le modèle adapté à votre métier.</p>
                <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">Réunissez votre activité, vos services, vos réalisations, vos contacts et votre QR Code dans une présentation professionnelle facile à partager.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="/subscription" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#4A1D43] px-5 py-3 text-sm font-black text-white">Découvrir les offres <ArrowRight className="h-4 w-4" /></a>
                  <a href="/contact" className="inline-flex min-h-12 items-center rounded-xl border border-[#D4AF37] bg-white px-5 py-3 text-sm font-bold text-[#4A1D43]">Demander des informations</a>
                </div>
              </div>
              <div className="rounded-[30px] border border-[#D4AF37]/45 bg-white/90 p-4 shadow-[0_28px_70px_rgba(74,29,67,0.16)]">
                <p className="mb-3 text-center text-xs font-bold text-[#4A1D43]">Exemple réel : Aux saveurs d’Anis</p>
                <div className="flex h-[390px] justify-center overflow-hidden">
                  <img src="/images/cv-business-portfolio-aux-saveurs-anis.png" alt="CV Business Aux saveurs d’Anis" className="h-[390px] w-auto object-contain object-top" />
                </div>
              </div>
            </div>
          </section>

          <CvBusinessJourney language="fr" />

          <section className="bg-[#2E102A] px-4 py-7 text-white">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div>
                <h2 className="font-serif text-2xl font-bold">Vous cherchez plutôt une entreprise ?</h2>
                <p className="mt-1 text-sm text-white/80">Retournez à la plateforme et à l’annuaire Dalil Tounes.</p>
              </div>
              <button type="button" onClick={() => setView('platform')} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#D4AF37] px-5 py-3 text-sm font-black text-[#F1D783]">
                <Search className="h-4 w-4" /> Explorer la plateforme
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
