import { useEffect, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

type SupportedLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

export type PresentationModel = 'professional' | 'portfolio';

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  professional: string;
  professionalDescription: string;
  portfolio: string;
  portfolioDescription: string;
  note: string;
  selectedFormula: string;
  selectedModel: string;
  chooseFormulaFirst: string;
  chooseModel: string;
  swipeModels: string;
  continue: string;
  enlarge: string;
  close: string;
};

const COPY: Record<SupportedLanguage, Copy> = {
  fr: {
    eyebrow: 'Votre choix',
    title: 'Composez votre CV Business',
    subtitle: 'Choisissez votre formule, puis le modèle qui correspond le mieux à votre métier.',
    professional: 'Modèle Professionnel',
    professionalDescription: 'Clair, structuré et direct. Idéal pour présenter rapidement votre activité et vos informations.',
    portfolio: 'Modèle Portfolio',
    portfolioDescription: 'Plus visuel, avec davantage de place pour les photos, les réalisations et le savoir-faire.',
    note: 'Les deux modèles sont disponibles avec CV Business Artisan et CV Business Premium, sans changement de prix ni de contenu.',
    selectedFormula: 'Formule',
    selectedModel: 'Modèle',
    chooseFormulaFirst: 'Choisissez d’abord CV Business Artisan ou CV Business Premium ci-dessus.',
    chooseModel: 'Choisissez ensuite votre modèle de présentation.',
    swipeModels: 'Glissez pour voir l’autre modèle',
    continue: 'Continuer avec ce choix',
    enlarge: 'Agrandir le modèle',
    close: 'Fermer',
  },
  ar: {
    eyebrow: 'اختيارك',
    title: 'كوّن CV Business الخاص بك',
    subtitle: 'اختر الصيغة، ثم النموذج الأنسب لمهنتك.',
    professional: 'النموذج المهني',
    professionalDescription: 'واضح ومنظم ومباشر لعرض نشاطك ومعلوماتك بسرعة.',
    portfolio: 'نموذج Portfolio',
    portfolioDescription: 'أكثر اعتمادًا على الصور لإبراز الإنجازات والخبرة والأعمال.',
    note: 'النموذجان متاحان مع CV Business حرفي وCV Business Premium دون تغيير في السعر أو المحتوى.',
    selectedFormula: 'الصيغة',
    selectedModel: 'النموذج',
    chooseFormulaFirst: 'اختر أولاً CV Business حرفي أو CV Business Premium أعلاه.',
    chooseModel: 'ثم اختر نموذج العرض.',
    swipeModels: 'اسحب لرؤية النموذج الآخر',
    continue: 'متابعة بهذا الاختيار',
    enlarge: 'تكبير النموذج',
    close: 'إغلاق',
  },
  en: {
    eyebrow: 'Your choice',
    title: 'Build your Business CV',
    subtitle: 'Choose your plan, then the presentation model that best suits your profession.',
    professional: 'Professional Model',
    professionalDescription: 'Clear, structured and direct. Ideal for presenting your activity and key information quickly.',
    portfolio: 'Portfolio Model',
    portfolioDescription: 'More visual, with extra room for photos, completed work and expertise.',
    note: 'Both models are available with Artisan Business CV and Premium Business CV, with no change to price or included content.',
    selectedFormula: 'Plan',
    selectedModel: 'Model',
    chooseFormulaFirst: 'First choose Artisan Business CV or Premium Business CV above.',
    chooseModel: 'Then choose your presentation model.',
    swipeModels: 'Swipe to see the other model',
    continue: 'Continue with this choice',
    enlarge: 'Enlarge model',
    close: 'Close',
  },
  it: {
    eyebrow: 'La tua scelta',
    title: 'Componi il tuo CV Business',
    subtitle: 'Scegli la formula, poi il modello più adatto alla tua professione.',
    professional: 'Modello Professionale',
    professionalDescription: 'Chiaro, strutturato e diretto. Ideale per presentare rapidamente attività e informazioni.',
    portfolio: 'Modello Portfolio',
    portfolioDescription: 'Più visivo, con maggiore spazio per foto, realizzazioni e competenze.',
    note: 'Entrambi i modelli sono disponibili con CV Business Artisan e CV Business Premium, senza variazioni di prezzo o contenuto.',
    selectedFormula: 'Formula',
    selectedModel: 'Modello',
    chooseFormulaFirst: 'Scegli prima CV Business Artisan o CV Business Premium qui sopra.',
    chooseModel: 'Poi scegli il modello di presentazione.',
    swipeModels: 'Scorri per vedere l’altro modello',
    continue: 'Continua con questa scelta',
    enlarge: 'Ingrandisci il modello',
    close: 'Chiudi',
  },
  ru: {
    eyebrow: 'Ваш выбор',
    title: 'Соберите свой Business CV',
    subtitle: 'Выберите тариф, затем модель оформления, подходящую вашей профессии.',
    professional: 'Профессиональная модель',
    professionalDescription: 'Чёткая, структурированная и прямая подача деятельности и ключевой информации.',
    portfolio: 'Модель Portfolio',
    portfolioDescription: 'Более визуальная подача с акцентом на фотографии, работы и профессиональный опыт.',
    note: 'Обе модели доступны с Business CV Artisan и Business CV Premium без изменения цены или состава предложения.',
    selectedFormula: 'Тариф',
    selectedModel: 'Модель',
    chooseFormulaFirst: 'Сначала выберите Business CV Artisan или Business CV Premium выше.',
    chooseModel: 'Затем выберите модель оформления.',
    swipeModels: 'Проведите, чтобы увидеть другую модель',
    continue: 'Продолжить с этим выбором',
    enlarge: 'Увеличить модель',
    close: 'Закрыть',
  },
};

export function getPresentationModelLabel(language: string, model: PresentationModel): string {
  const copy = COPY[(language as SupportedLanguage)] ?? COPY.fr;
  return model === 'professional' ? copy.professional : copy.portfolio;
}

function ModelPreview({
  src,
  alt,
  enlargeLabel,
  onEnlarge,
  liveSrc,
}: {
  src: string;
  alt: string;
  enlargeLabel: string;
  onEnlarge: () => void;
  liveSrc?: string;
}) {
  return (
    <div className="group relative flex h-[300px] w-full items-start justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#F7F5EF] p-2 shadow-inner sm:rounded-2xl md:h-[420px]">
      {liveSrc ? (
        <div className="pointer-events-none h-full w-[184px] overflow-hidden transition duration-300 group-hover:scale-[1.06]">
          <iframe
            title={alt}
            src={liveSrc}
            className="h-[900px] w-[390px] origin-top-left scale-[0.47] border-0"
            loading="lazy"
          />
        </div>
      ) : (
        <img src={src} alt={alt} className="h-full w-full object-contain object-top transition duration-300 group-hover:scale-[1.06]" loading="lazy" decoding="async" />
      )}
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onEnlarge();
        }}
        className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-[#D6AF2E]/70 bg-white/95 text-[#07543F] shadow-md transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
        aria-label={enlargeLabel}
        title={enlargeLabel}
      >
        <ZoomIn className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}

export function CvPresentationModelSelector({
  language,
  formulaValue,
  onFormulaChange,
  artisanLabel,
  premiumLabel,
  value,
  onChange,
  selectedFormulaLabel,
  onContinue,
}: {
  language: string;
  formulaValue: 'artisan' | 'premium' | null;
  onFormulaChange: (formula: 'artisan' | 'premium') => void;
  artisanLabel: string;
  premiumLabel: string;
  value: PresentationModel | null;
  onChange: (model: PresentationModel) => void;
  selectedFormulaLabel: string | null;
  onContinue: () => void;
}) {
  const copy = COPY[(language as SupportedLanguage)] ?? COPY.fr;
  const [expandedModel, setExpandedModel] = useState<PresentationModel | null>(null);
  const selectedModelLabel = value ? getPresentationModelLabel(language, value) : null;
  const canContinue = Boolean(selectedFormulaLabel && value);

  useEffect(() => {
    if (!expandedModel) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedModel(null);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [expandedModel]);

  return (
    <section id="cv-presentation-models" className="mt-5 scroll-mt-24 rounded-3xl border border-[#D6AF2E]/55 bg-white p-3 shadow-[0_8px_24px_rgba(74,18,63,0.05)] sm:p-5">
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-600">{copy.eyebrow}</p>
        <h3 className="mt-1 text-xl font-black text-[#4A123F] sm:text-2xl">{copy.title}</h3>
        <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-5 text-slate-600">{copy.subtitle}</p>
      </div>

      <div className="mx-auto mt-4 max-w-4xl">
        <p className="mb-2 text-sm font-black text-[#4A123F]">1. {copy.selectedFormula}</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-pressed={formulaValue === 'artisan'}
            onClick={() => onFormulaChange('artisan')}
            className={`min-h-14 rounded-xl border px-3 py-2 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${formulaValue === 'artisan' ? 'border-[#D6AF2E] bg-[#07543F] text-white shadow-md' : 'border-slate-200 bg-[#FFFCF7] text-[#4A123F] hover:border-[#D6AF2E]'}`}
          >
            {artisanLabel}
          </button>
          <button
            type="button"
            aria-pressed={formulaValue === 'premium'}
            onClick={() => onFormulaChange('premium')}
            className={`min-h-14 rounded-xl border px-3 py-2 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${formulaValue === 'premium' ? 'border-[#D6AF2E] bg-[#07543F] text-white shadow-md' : 'border-slate-200 bg-[#FFFCF7] text-[#4A123F] hover:border-[#D6AF2E]'}`}
          >
            {premiumLabel}
          </button>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-4xl">
        <p className="mb-2 text-sm font-black text-[#4A123F]">2. {copy.selectedModel}</p>
        <div className="sm:hidden">
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-[#F4F0E7] p-1.5">
            <button
              type="button"
              aria-pressed={value === 'professional'}
              onClick={() => onChange('professional')}
              className={`min-h-12 rounded-xl px-2 py-2 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${value === 'professional' ? 'bg-[#4A123F] text-white shadow-sm' : 'bg-white text-[#4A123F]'}`}
            >
              {copy.professional}
            </button>
            <button
              type="button"
              aria-pressed={value === 'portfolio'}
              onClick={() => onChange('portfolio')}
              className={`min-h-12 rounded-xl px-2 py-2 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${value === 'portfolio' ? 'bg-[#4A123F] text-white shadow-sm' : 'bg-white text-[#4A123F]'}`}
            >
              {copy.portfolio}
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              const currentModel = value ?? 'professional';
              onChange(currentModel);
              setExpandedModel(currentModel);
            }}
            className={`mt-3 flex w-full justify-center overflow-hidden rounded-2xl border bg-[#F7F5EF] p-2 transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${value ? 'border-[#D6AF2E] shadow-md' : 'border-slate-200'}`}
            aria-label={value === 'portfolio' ? copy.portfolio : copy.professional}
          >
            {value === 'portfolio' ? (
              <img
                src="/images/cv-portfolio-aux-saveurs-anis-original.svg"
                alt={`${copy.portfolio} — Aux saveurs d’Anis`}
                className="h-[390px] w-auto max-w-none object-contain object-top"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <img
                src="/images/cv-business-portfolio-aux-saveurs-anis.png"
                alt={`${copy.professional} — Aux saveurs d’Anis`}
                className="h-[390px] w-auto max-w-none object-contain object-top"
                loading="lazy"
                decoding="async"
              />
            )}
          </button>
        </div>

        <div className="hidden grid-cols-2 gap-4 sm:grid">
        <button
          type="button"
          aria-pressed={value === 'professional'}
          onClick={() => onChange('professional')}
          className={`flex min-w-0 flex-col rounded-2xl border p-3.5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${value === 'professional' ? 'border-[#D6AF2E] bg-amber-50/70 shadow-md' : 'border-slate-200 bg-[#FFFCF7] hover:border-[#D6AF2E]/70'}`}
        >
          <ModelPreview
            src="/images/cv-business-portfolio-aux-saveurs-anis.png"
            alt={`${copy.professional} — Aux saveurs d’Anis`}
            enlargeLabel={`${copy.enlarge} — ${copy.professional}`}
            onEnlarge={() => setExpandedModel('professional')}
          />
          <span className="mt-3 min-w-0">
            <span className="block text-sm font-black leading-5 text-[#4A123F] sm:text-lg">{copy.professional}</span>
            <span className="mt-1.5 hidden text-sm leading-5 text-slate-600 sm:block">{copy.professionalDescription}</span>
          </span>
        </button>

        <button
          type="button"
          aria-pressed={value === 'portfolio'}
          onClick={() => onChange('portfolio')}
          className={`flex min-w-0 flex-col rounded-2xl border p-3.5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${value === 'portfolio' ? 'border-[#D6AF2E] bg-amber-50/70 shadow-md' : 'border-slate-200 bg-[#FFFCF7] hover:border-[#D6AF2E]/70'}`}
        >
          <ModelPreview
            src="/images/cv-portfolio-aux-saveurs-anis-original.svg"
            alt={`${copy.portfolio} — Aux saveurs d’Anis`}
            enlargeLabel={`${copy.enlarge} — ${copy.portfolio}`}
            onEnlarge={() => setExpandedModel('portfolio')}
          />
          <span className="mt-3 min-w-0">
            <span className="block text-sm font-black leading-5 text-[#4A123F] sm:text-lg">{copy.portfolio}</span>
            <span className="mt-1.5 hidden text-sm leading-5 text-slate-600 sm:block">{copy.portfolioDescription}</span>
          </span>
        </button>
        </div>
      </div>

      <p className="mx-auto mt-3 hidden max-w-3xl text-center text-xs font-semibold leading-5 text-slate-500 sm:block">{copy.note}</p>

      <div className="mx-auto mt-4 flex max-w-4xl flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm leading-5 text-slate-700">
          {selectedFormulaLabel ? (
            <p><strong className="text-[#4A123F]">{copy.selectedFormula} :</strong> {selectedFormulaLabel}</p>
          ) : (
            <p>{copy.chooseFormulaFirst}</p>
          )}
          {selectedModelLabel ? (
            <p><strong className="text-[#4A123F]">{copy.selectedModel} :</strong> {selectedModelLabel}</p>
          ) : (
            <p>{copy.chooseModel}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onContinue}
          aria-disabled={!canContinue}
          className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${canContinue ? 'bg-[#07543F] text-white hover:bg-emerald-800' : 'border border-[#D6AF2E] bg-white text-[#4A123F] hover:bg-amber-50'}`}
        >
          {copy.continue}
        </button>
      </div>

      {expandedModel && (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setExpandedModel(null);
          }}
        >
          <div role="dialog" aria-modal="true" aria-label={`${copy.enlarge} — ${getPresentationModelLabel(language, expandedModel)}`} className="relative max-h-[94dvh] max-w-full overflow-auto rounded-3xl bg-white p-3 shadow-2xl sm:p-5">
            <button
              type="button"
              onClick={() => setExpandedModel(null)}
              className="sticky top-0 z-10 ml-auto grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] rtl:ml-0 rtl:mr-auto"
              aria-label={copy.close}
              title={copy.close}
              autoFocus
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            {expandedModel === 'portfolio' ? (
              <img
                src="/images/cv-portfolio-aux-saveurs-anis-original.svg"
                alt={`${copy.portfolio} — Aux saveurs d’Anis`}
                className="mx-auto mt-1 max-h-[82dvh] max-w-[calc(100vw-48px)] object-contain object-top"
                decoding="async"
              />
            ) : (
              <img
                src="/images/cv-business-portfolio-aux-saveurs-anis.png"
                alt={`${copy.professional} — Aux saveurs d’Anis`}
                className="mx-auto mt-1 max-h-[82dvh] max-w-[calc(100vw-48px)] object-contain object-top"
                decoding="async"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
