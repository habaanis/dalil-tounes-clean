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
  continue: string;
};

const COPY: Record<SupportedLanguage, Copy> = {
  fr: {
    eyebrow: 'Étape 2',
    title: 'Choisissez votre modèle de présentation',
    subtitle: 'La formule détermine le contenu. Ici, vous choisissez seulement le style de votre CV.',
    professional: 'Modèle Professionnel',
    professionalDescription: 'Clair, structuré et direct. Idéal pour présenter rapidement votre activité et vos informations.',
    portfolio: 'Modèle Portfolio',
    portfolioDescription: 'Plus visuel, avec davantage de place pour les photos, les réalisations et le savoir-faire.',
    note: 'Les deux modèles sont disponibles avec CV Business Artisan et CV Business Premium, sans changement de prix ni de contenu.',
    selectedFormula: 'Formule',
    selectedModel: 'Modèle',
    chooseFormulaFirst: 'Choisissez d’abord CV Business Artisan ou CV Business Premium ci-dessus.',
    chooseModel: 'Choisissez ensuite votre modèle de présentation.',
    continue: 'Continuer avec ce choix',
  },
  ar: {
    eyebrow: 'الخطوة 2',
    title: 'اختر نموذج العرض',
    subtitle: 'الصيغة تحدد المحتوى. هنا تختار فقط شكل عرض CV الخاص بك.',
    professional: 'النموذج المهني',
    professionalDescription: 'واضح ومنظم ومباشر لعرض نشاطك ومعلوماتك بسرعة.',
    portfolio: 'نموذج Portfolio',
    portfolioDescription: 'أكثر اعتمادًا على الصور لإبراز الإنجازات والخبرة والأعمال.',
    note: 'النموذجان متاحان مع CV Business حرفي وCV Business Premium دون تغيير في السعر أو المحتوى.',
    selectedFormula: 'الصيغة',
    selectedModel: 'النموذج',
    chooseFormulaFirst: 'اختر أولاً CV Business حرفي أو CV Business Premium أعلاه.',
    chooseModel: 'ثم اختر نموذج العرض.',
    continue: 'متابعة بهذا الاختيار',
  },
  en: {
    eyebrow: 'Step 2',
    title: 'Choose your presentation model',
    subtitle: 'Your plan determines the content. Here, you only choose how your CV is presented.',
    professional: 'Professional Model',
    professionalDescription: 'Clear, structured and direct. Ideal for presenting your activity and key information quickly.',
    portfolio: 'Portfolio Model',
    portfolioDescription: 'More visual, with extra room for photos, completed work and expertise.',
    note: 'Both models are available with Artisan Business CV and Premium Business CV, with no change to price or included content.',
    selectedFormula: 'Plan',
    selectedModel: 'Model',
    chooseFormulaFirst: 'First choose Artisan Business CV or Premium Business CV above.',
    chooseModel: 'Then choose your presentation model.',
    continue: 'Continue with this choice',
  },
  it: {
    eyebrow: 'Passaggio 2',
    title: 'Scegli il modello di presentazione',
    subtitle: 'La formula determina i contenuti. Qui scegli soltanto lo stile di presentazione del tuo CV.',
    professional: 'Modello Professionale',
    professionalDescription: 'Chiaro, strutturato e diretto. Ideale per presentare rapidamente attività e informazioni.',
    portfolio: 'Modello Portfolio',
    portfolioDescription: 'Più visivo, con maggiore spazio per foto, realizzazioni e competenze.',
    note: 'Entrambi i modelli sono disponibili con CV Business Artisan e CV Business Premium, senza variazioni di prezzo o contenuto.',
    selectedFormula: 'Formula',
    selectedModel: 'Modello',
    chooseFormulaFirst: 'Scegli prima CV Business Artisan o CV Business Premium qui sopra.',
    chooseModel: 'Poi scegli il modello di presentazione.',
    continue: 'Continua con questa scelta',
  },
  ru: {
    eyebrow: 'Шаг 2',
    title: 'Выберите модель оформления',
    subtitle: 'Тариф определяет содержание. Здесь вы выбираете только стиль оформления CV.',
    professional: 'Профессиональная модель',
    professionalDescription: 'Чёткая, структурированная и прямая подача деятельности и ключевой информации.',
    portfolio: 'Модель Portfolio',
    portfolioDescription: 'Более визуальная подача с акцентом на фотографии, работы и профессиональный опыт.',
    note: 'Обе модели доступны с Business CV Artisan и Business CV Premium без изменения цены или состава предложения.',
    selectedFormula: 'Тариф',
    selectedModel: 'Модель',
    chooseFormulaFirst: 'Сначала выберите Business CV Artisan или Business CV Premium выше.',
    chooseModel: 'Затем выберите модель оформления.',
    continue: 'Продолжить с этим выбором',
  },
};

export function getPresentationModelLabel(language: string, model: PresentationModel): string {
  const copy = COPY[(language as SupportedLanguage)] ?? COPY.fr;
  return model === 'professional' ? copy.professional : copy.portfolio;
}

function ModelPreview({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="flex h-[360px] w-full items-start justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#F7F5EF] p-2 shadow-inner sm:h-[420px]">
      <img src={src} alt={alt} className="h-full w-full object-contain object-top" loading="lazy" decoding="async" />
    </div>
  );
}

export function CvPresentationModelSelector({
  language,
  value,
  onChange,
  selectedFormulaLabel,
  onContinue,
}: {
  language: string;
  value: PresentationModel | null;
  onChange: (model: PresentationModel) => void;
  selectedFormulaLabel: string | null;
  onContinue: () => void;
}) {
  const copy = COPY[(language as SupportedLanguage)] ?? COPY.fr;
  const selectedModelLabel = value ? getPresentationModelLabel(language, value) : null;
  const canContinue = Boolean(selectedFormulaLabel && value);

  return (
    <section id="cv-presentation-models" className="mt-5 rounded-3xl border border-[#D6AF2E]/55 bg-white p-4 shadow-[0_8px_24px_rgba(74,18,63,0.05)] sm:p-5">
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-600">{copy.eyebrow}</p>
        <h3 className="mt-1 text-xl font-black text-[#4A123F] sm:text-2xl">{copy.title}</h3>
        <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-5 text-slate-600">{copy.subtitle}</p>
      </div>

      <div className="mx-auto mt-4 grid max-w-4xl gap-4 md:grid-cols-2">
        <button
          type="button"
          aria-pressed={value === 'professional'}
          onClick={() => onChange('professional')}
          className={`flex flex-col rounded-2xl border p-3.5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${value === 'professional' ? 'border-[#D6AF2E] bg-amber-50/70 shadow-md' : 'border-slate-200 bg-[#FFFCF7] hover:border-[#D6AF2E]/70'}`}
        >
          <ModelPreview
            src="/images/cv-business-professionnel-aux-saveurs-anis.png"
            alt={`${copy.professional} — Aux saveurs d’Anis`}
          />
          <span className="mt-3 min-w-0">
            <span className="block text-base font-black text-[#4A123F] sm:text-lg">{copy.professional}</span>
            <span className="mt-1.5 block text-sm leading-5 text-slate-600">{copy.professionalDescription}</span>
          </span>
        </button>

        <button
          type="button"
          aria-pressed={value === 'portfolio'}
          onClick={() => onChange('portfolio')}
          className={`flex flex-col rounded-2xl border p-3.5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${value === 'portfolio' ? 'border-[#D6AF2E] bg-amber-50/70 shadow-md' : 'border-slate-200 bg-[#FFFCF7] hover:border-[#D6AF2E]/70'}`}
        >
          <ModelPreview
            src="/images/cv-business-portfolio-aux-saveurs-anis.png"
            alt={`${copy.portfolio} — Aux saveurs d’Anis`}
          />
          <span className="mt-3 min-w-0">
            <span className="block text-base font-black text-[#4A123F] sm:text-lg">{copy.portfolio}</span>
            <span className="mt-1.5 block text-sm leading-5 text-slate-600">{copy.portfolioDescription}</span>
          </span>
        </button>
      </div>

      <p className="mx-auto mt-3 max-w-3xl text-center text-xs font-semibold leading-5 text-slate-500">{copy.note}</p>

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
          disabled={!canContinue}
          onClick={onContinue}
          className="shrink-0 rounded-xl bg-[#07543F] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {copy.continue}
        </button>
      </div>
    </section>
  );
}
