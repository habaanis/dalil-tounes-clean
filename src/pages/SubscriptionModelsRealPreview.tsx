import { useState } from 'react';

export default function SubscriptionModelsRealPreview() {
  const [formula, setFormula] = useState<'artisan' | 'business'>('artisan');
  const [model, setModel] = useState<'professional' | 'portfolio'>('professional');

  const formulaLabel = formula === 'artisan' ? 'CV Artisan' : 'CV Business';
  const modelLabel = model === 'professional' ? 'Modèle Professionnel' : 'Modèle Portfolio';

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-8 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <header className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">Étape 1</p>
          <h1 className="mt-2 text-3xl font-black text-[#4A123F]">Choisissez votre formule</h1>
          <p className="mt-2 text-sm text-slate-600">La formule détermine le contenu et les fonctionnalités inclus dans votre CV.</p>
        </header>

        <div className="mx-auto mt-6 grid max-w-4xl gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setFormula('artisan')}
            className={`rounded-2xl border-2 bg-[#07543F] p-5 text-left text-white transition ${formula === 'artisan' ? 'border-[#D6AF2E] ring-4 ring-[#D6AF2E]/20' : 'border-[#D6AF2E]/65'}`}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#F5D85C]">Formule</span>
            <span className="mt-1 block text-xl font-black">CV Artisan</span>
            <span className="mt-1 block text-sm text-emerald-50">Une présentation essentielle et professionnelle, jusqu’à 5 photos.</span>
            <span className="mt-3 block text-2xl font-black text-[#F5D85C]">30 TND</span>
          </button>

          <button
            type="button"
            onClick={() => setFormula('business')}
            className={`rounded-2xl border-2 bg-[#07543F] p-5 text-left text-white transition ${formula === 'business' ? 'border-[#D6AF2E] ring-4 ring-[#D6AF2E]/20' : 'border-[#D6AF2E]/65'}`}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#F5D85C]">Formule</span>
            <span className="mt-1 block text-xl font-black">CV Business</span>
            <span className="mt-1 block text-sm text-emerald-50">Une présentation plus complète, avec davantage de contenus et de fonctionnalités.</span>
            <span className="mt-3 block text-2xl font-black text-[#F5D85C]">59 TND</span>
          </button>
        </div>

        <section className="mt-6 rounded-3xl border border-[#D6AF2E]/60 bg-white p-5 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-600">Étape 2</p>
            <h2 className="mt-1 text-2xl font-black text-[#4A123F]">Choisissez votre modèle de présentation</h2>
            <p className="mt-1 text-sm text-slate-600">Même formule, même contenu : vous choisissez simplement la présentation que vous préférez.</p>
          </div>

          <div className="mx-auto mt-6 grid max-w-5xl gap-5 lg:grid-cols-2">
            <article className={`rounded-2xl border p-4 transition ${model === 'professional' ? 'border-[#D6AF2E] bg-amber-50/60' : 'border-slate-200 bg-white'}`}>
              <button type="button" onClick={() => setModel('professional')} className="block w-full text-left">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-[#4A123F]">Modèle Professionnel</h3>
                    <p className="text-sm text-slate-600">Le CV Business actuel, affiché directement depuis le site.</p>
                  </div>
                  <span className={`h-5 w-5 rounded-full border-2 ${model === 'professional' ? 'border-[#07543F] bg-[#07543F] shadow-[inset_0_0_0_4px_white]' : 'border-slate-300'}`} />
                </div>
              </button>

              <div className="mx-auto h-[520px] w-[292px] overflow-hidden rounded-[28px] border-2 border-[#D6AF2E]/80 bg-[#052F24] shadow-lg sm:w-[310px]">
                <iframe
                  title="CV Business réel — Aux Saveurs d'Anis"
                  src="/entreprise/sousse/aux-saveurs-d-anis?preview-model=professional"
                  className="h-[860px] w-[390px] origin-top-left scale-[0.795] border-0 sm:scale-[0.795]"
                />
              </div>

              <a
                href="/entreprise/sousse/aux-saveurs-d-anis"
                target="_blank"
                rel="noreferrer"
                className="mx-auto mt-3 block w-fit rounded-xl border border-[#07543F]/20 bg-white px-4 py-2 text-sm font-bold text-[#07543F] hover:bg-emerald-50"
              >
                Voir le vrai CV Business
              </a>
            </article>

            <article className={`rounded-2xl border p-4 transition ${model === 'portfolio' ? 'border-[#D6AF2E] bg-amber-50/60' : 'border-slate-200 bg-white'}`}>
              <button type="button" onClick={() => setModel('portfolio')} className="block w-full text-left">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-[#4A123F]">Modèle Portfolio</h3>
                    <p className="text-sm text-slate-600">Le modèle visuel validé, repris tel quel.</p>
                  </div>
                  <span className={`h-5 w-5 rounded-full border-2 ${model === 'portfolio' ? 'border-[#07543F] bg-[#07543F] shadow-[inset_0_0_0_4px_white]' : 'border-slate-300'}`} />
                </div>
              </button>

              <div className="mx-auto flex h-[520px] w-[292px] items-start justify-center overflow-hidden rounded-[28px] border-2 border-[#D6AF2E]/80 bg-[#f7f2ea] shadow-lg sm:w-[310px]">
                <img
                  src="/images/cv-portfolio-reference.webp"
                  alt="CV Portfolio Aux Saveurs d'Anis"
                  className="h-full w-full object-contain object-top"
                />
              </div>

              <a
                href="/images/cv-portfolio-reference.webp"
                target="_blank"
                rel="noreferrer"
                className="mx-auto mt-3 block w-fit rounded-xl border border-[#07543F]/20 bg-white px-4 py-2 text-sm font-bold text-[#07543F] hover:bg-emerald-50"
              >
                Voir le CV Portfolio en grand
              </a>
            </article>
          </div>

          <div className="mx-auto mt-5 flex max-w-5xl flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-700">
              <p><strong className="text-[#4A123F]">Formule :</strong> {formulaLabel}</p>
              <p><strong className="text-[#4A123F]">Modèle :</strong> {modelLabel}</p>
            </div>
            <button type="button" className="rounded-xl bg-[#07543F] px-5 py-2.5 text-sm font-bold text-white">Continuer avec ce choix</button>
          </div>
        </section>
      </div>
    </main>
  );
}
