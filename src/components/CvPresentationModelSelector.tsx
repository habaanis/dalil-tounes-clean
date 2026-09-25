import { useEffect, useState, type CSSProperties } from 'react';
import { Check, Palette, X, ZoomIn } from 'lucide-react';
import BusinessShowcaseLienoraDetail from './BusinessShowcaseLienoraDetail';

type SupportedLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

export type PresentationModel = 'business' | 'portfolio';
export type PaletteId = 'prestige' | 'ivory' | 'night';

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  business: string;
  businessDescription: string;
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
  testModel: string;
  customizeColors: string;
  paletteLabel: string;
  prestige: string;
  ivory: string;
  night: string;
  paletteIncluded: string;
  palettePreview: string;
  enlargedPreview: string;
  selectedPalette: string;
};

const COPY: Record<SupportedLanguage, Copy> = {
  fr: {
    eyebrow: 'Votre choix',
    title: 'Composez votre CV Business',
    subtitle: 'Choisissez votre formule, puis le modèle qui correspond le mieux à votre métier.',
    business: 'CV Business',
    businessDescription: 'Clair, structuré et direct. Idéal pour présenter rapidement votre activité et vos informations.',
    portfolio: 'CV Portfolio',
    portfolioDescription: 'Plus visuel, avec davantage de place pour les photos, les réalisations et le savoir-faire.',
    note: 'Les deux modèles sont disponibles avec la Formule Artisan et la Formule Premium, sans changement de prix ni de contenu.',
    selectedFormula: 'Formule',
    selectedModel: 'Modèle',
    chooseFormulaFirst: "Choisissez d'abord la Formule Artisan ou la Formule Premium ci-dessus.",
    chooseModel: 'Choisissez ensuite votre modèle de présentation.',
    swipeModels: "Glissez pour voir l'autre modèle",
    continue: 'Continuer avec ce choix',
    enlarge: 'Agrandir le modèle',
    close: 'Fermer',
    testModel: 'Tester les boutons du modèle',
    customizeColors: 'Personnaliser les couleurs',
    paletteLabel: 'Palette',
    prestige: 'Vert Prestige',
    ivory: 'Ivoire & Or',
    night: 'Bleu Nuit & Champagne',
    paletteIncluded: 'Palette incluse',
    palettePreview: 'Aperçu',
    enlargedPreview: 'APERÇU AGRANDI',
    selectedPalette: 'Palette',
  },
  ar: {
    eyebrow: 'اختيارك',
    title: 'كوّن CV Business الخاص بك',
    subtitle: 'اختر الصيغة، ثم النموذج الأنسب لمهنتك.',
    business: 'CV Business',
    businessDescription: 'واضح ومنظم ومباشر لعرض نشاطك ومعلوماتك بسرعة.',
    portfolio: 'CV Portfolio',
    portfolioDescription: 'أكثر اعتمادًا على الصور لإبراز الإنجازات والخبرة والأعمال.',
    note: 'النموذجان متاحان مع صيغة الحرفي وصيغة Premium دون تغيير في السعر أو المحتوى.',
    selectedFormula: 'الصيغة',
    selectedModel: 'النموذج',
    chooseFormulaFirst: 'اختر أولاً صيغة الحرفي أو صيغة Premium أعلاه.',
    chooseModel: 'ثم اختر نموذج العرض.',
    swipeModels: 'اسحب لرؤية النموذج الآخر',
    continue: 'متابعة بهذا الاختيار',
    enlarge: 'تكبير النموذج',
    close: 'إغلاق',
    testModel: 'جرّب أزرار النموذج',
    customizeColors: 'تخصيص الألوان',
    paletteLabel: 'لوحة الألوان',
    prestige: 'الأخضر الفاخر',
    ivory: 'العاج والذهب',
    night: 'الأزرق الليلي والشامبانيا',
    paletteIncluded: 'لوحة ألوان مشمولة',
    palettePreview: 'معاينة',
    enlargedPreview: 'معاينة مكبرة',
    selectedPalette: 'اللوحة',
  },
  en: {
    eyebrow: 'Your choice',
    title: 'Build your Business CV',
    subtitle: 'Choose your plan, then the presentation model that best suits your profession.',
    business: 'Business CV',
    businessDescription: 'Clear, structured and direct. Ideal for presenting your activity and key information quickly.',
    portfolio: 'Portfolio CV',
    portfolioDescription: 'More visual, with extra room for photos, completed work and expertise.',
    note: 'Both models are available with the Artisan Plan and Premium Plan, with no change to price or included content.',
    selectedFormula: 'Plan',
    selectedModel: 'Model',
    chooseFormulaFirst: 'First choose the Artisan Plan or Premium Plan above.',
    chooseModel: 'Then choose your presentation model.',
    swipeModels: 'Swipe to see the other model',
    continue: 'Continue with this choice',
    enlarge: 'Enlarge model',
    close: 'Close',
    testModel: 'Test the model buttons',
    customizeColors: 'Customize colors',
    paletteLabel: 'Palette',
    prestige: 'Green Prestige',
    ivory: 'Ivory & Gold',
    night: 'Night Blue & Champagne',
    paletteIncluded: 'Palette included',
    palettePreview: 'Preview',
    enlargedPreview: 'ENLARGED PREVIEW',
    selectedPalette: 'Palette',
  },
  it: {
    eyebrow: 'La tua scelta',
    title: 'Componi il tuo CV business',
    subtitle: 'Scegli la formula, poi il modello più adatto alla tua professione.',
    business: 'CV Business',
    businessDescription: 'Chiaro, strutturato e diretto. Ideale per presentare rapidamente attività e informazioni.',
    portfolio: 'CV Portfolio',
    portfolioDescription: 'Più visivo, con maggiore spazio per foto, realizzazioni e competenze.',
    note: 'Entrambi i modelli sono disponibili con la Formula Artisan e la Formula Premium, senza variazioni di prezzo o contenuto.',
    selectedFormula: 'Formula',
    selectedModel: 'Modello',
    chooseFormulaFirst: 'Scegli prima la Formula Artisan o la Formula Premium qui sopra.',
    chooseModel: 'Poi scegli il modello di presentazione.',
    swipeModels: "Scorri per vedere l'altro modello",
    continue: 'Continua con questa scelta',
    enlarge: 'Ingrandisci il modello',
    close: 'Chiudi',
    testModel: 'Prova i pulsanti del modello',
    customizeColors: 'Personalizza i colori',
    paletteLabel: 'Palette',
    prestige: 'Verde Prestige',
    ivory: 'Avorio & Oro',
    night: 'Blu Notte & Champagne',
    paletteIncluded: 'Palette inclusa',
    palettePreview: 'Anteprima',
    enlargedPreview: 'ANTEPRIMA INGRANDITA',
    selectedPalette: 'Palette',
  },
  ru: {
    eyebrow: 'Ваш выбор',
    title: 'Соберите свой Business CV',
    subtitle: 'Выберите тариф, затем модель оформления, подходящую вашей профессии.',
    business: 'CV Business',
    businessDescription: 'Чёткая, структурированная и прямая подача деятельности и ключевой информации.',
    portfolio: 'CV Portfolio',
    portfolioDescription: 'Более визуальная подача с акцентом на фотографии, работы и профессиональный опыт.',
    note: 'Обе модели доступны с тарифами Artisan и Premium без изменения цены или состава предложения.',
    selectedFormula: 'Тариф',
    selectedModel: 'Модель',
    chooseFormulaFirst: 'Сначала выберите тариф Artisan или Premium выше.',
    chooseModel: 'Затем выберите модель оформления.',
    swipeModels: 'Проведите, чтобы увидеть другую модель',
    continue: 'Продолжить с этим выбором',
    enlarge: 'Увеличить модель',
    close: 'Закрыть',
    testModel: 'Проверить кнопки модели',
    customizeColors: 'Настроить цвета',
    paletteLabel: 'Палитра',
    prestige: 'Зеленый Престиж',
    ivory: 'Слоновая кость и золото',
    night: 'Ночной синий и шампань',
    paletteIncluded: 'Палитра включена',
    palettePreview: 'Предпросмотр',
    enlargedPreview: 'УВЕЛИЧЕННЫЙ ПРОСМОТР',
    selectedPalette: 'Палитра',
  },
};

const PROFESSIONAL_IMAGE = '/images/cv-business-professionnel-aux-saveurs-anis.png';
const PORTFOLIO_IMAGE = '/images/cv-business-portfolio-aux-saveurs-anis.png';

export const PALETTE_IDS: PaletteId[] = ['prestige', 'ivory', 'night'];

export const PALETTE_SWATCHES: Record<PaletteId, { bg: string; accent: string; text: string }> = {
  prestige: { bg: '#042d24', accent: '#D4AF37', text: '#F4CE55' },
  ivory: { bg: '#FFFFF0', accent: '#D4AF37', text: '#3B3126' },
  night: { bg: '#10243a', accent: '#e5c486', text: '#f8f1e4' },
};

export function getPresentationModelLabel(language: string, model: PresentationModel): string {
  const copy = COPY[(language as SupportedLanguage)] ?? COPY.fr;
  return model === 'business' ? copy.business : copy.portfolio;
}

export function getPaletteLabel(language: string, palette: PaletteId): string {
  const copy = COPY[(language as SupportedLanguage)] ?? COPY.fr;
  return copy[palette];
}

function ModelPreview({
  src,
  alt,
  enlargeLabel,
  onEnlarge,
}: {
  src: string;
  alt: string;
  enlargeLabel: string;
  onEnlarge: () => void;
}) {
  return (
    <div className="group relative flex h-[300px] w-full items-start justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#F7F5EF] p-2 shadow-inner sm:rounded-2xl md:h-[420px]">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain object-top transition duration-300 group-hover:scale-[1.06]"
        loading="lazy"
        decoding="async"
      />
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

function RealPalettePreview({
  palette,
  model,
  language,
  expanded = false,
}: {
  palette: PaletteId;
  model: PresentationModel;
  language: string;
  expanded?: boolean;
}) {
  const previewUrl = `/entreprise/sousse/aux-saveurs-d-anis?preview-model=${model}&palette=${palette}&source=subscription&lang=${language}`;

  return (
    <div
      className={expanded
        ? 'mx-auto w-full bg-[#F8F6F0]'
        : 'mx-auto h-[450px] w-[292px] max-w-full overflow-hidden rounded-[26px] border-2 border-[#D6AF2E]/70 bg-[#F7F5EF] shadow-lg'}
    >
      <div
        key={previewUrl}
        className={expanded
          ? 'pointer-events-auto w-full bg-[#F8F6F0]'
          : 'w-[584px] origin-top-left bg-white'}
        style={expanded ? undefined : ({ zoom: 0.5 } as CSSProperties)}
      >
        <BusinessShowcaseLienoraDetail
          embeddedPreview
          previewSlug="aux-saveurs-d-anis"
          previewVilleSlug="sousse"
          previewPalette={palette}
          previewPresentationModel={model}
        />
      </div>
    </div>
  );
}

function PaletteChoice({
  palette,
  selected,
  label,
  onSelect,
}: {
  palette: PaletteId;
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  const sw = PALETTE_SWATCHES[palette];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex min-h-16 items-center gap-2 rounded-xl border-2 px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${selected ? 'border-[#D6AF2E] bg-white shadow-sm' : 'border-transparent bg-white/70 hover:border-[#D6AF2E]/50'}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200" style={{ background: sw.bg }}>
        <span className="block h-4 w-4 rounded-full" style={{ background: sw.accent }} />
      </span>
      <span className="min-w-0 flex-1 text-xs font-black leading-4 text-slate-700">{label}</span>
      {selected && <Check className="h-4 w-4 shrink-0 text-[#07543F]" aria-hidden="true" />}
    </button>
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
  paletteValue,
  onPaletteChange,
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
  paletteValue: PaletteId;
  onPaletteChange: (palette: PaletteId) => void;
}) {
  const copy = COPY[(language as SupportedLanguage)] ?? COPY.fr;
  const [expandedModel, setExpandedModel] = useState<PresentationModel | null>(null);
  const [expandedPalette, setExpandedPalette] = useState<PaletteId | null>(null);
  const [showPalettePanel, setShowPalettePanel] = useState(false);
  const selectedModelLabel = value ? getPresentationModelLabel(language, value) : null;
  const selectedPaletteLabel = getPaletteLabel(language, paletteValue);
  const canContinue = Boolean(selectedFormulaLabel && value);

  useEffect(() => {
    if (!expandedModel && !expandedPalette) return;
    const scrollY = window.scrollY;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpandedModel(null);
        setExpandedPalette(null);
      }
    };
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [expandedModel, expandedPalette]);

  // The phone-first visual is the photo-led Portfolio model; the long,
  // structured visual is the Business model.
  const currentImage = expandedModel === 'portfolio' ? PROFESSIONAL_IMAGE : PORTFOLIO_IMAGE;
  const mobileImage = value === 'portfolio' ? PROFESSIONAL_IMAGE : PORTFOLIO_IMAGE;

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
              aria-pressed={value === 'business'}
              onClick={() => onChange('business')}
              className={`min-h-12 rounded-xl px-2 py-2 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${value === 'business' ? 'bg-[#4A123F] text-white shadow-sm' : 'bg-white text-[#4A123F]'}`}
            >
              {copy.business}
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
              const currentModel = value ?? 'business';
              onChange(currentModel);
              setExpandedModel(currentModel);
            }}
            className={`mt-3 flex w-full justify-center overflow-hidden rounded-2xl border bg-[#F7F5EF] p-2 transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${value ? 'border-[#D6AF2E] shadow-md' : 'border-slate-200'}`}
            aria-label={value === 'portfolio' ? copy.portfolio : copy.business}
          >
            <img
              src={mobileImage}
              alt={`${value === 'portfolio' ? copy.portfolio : copy.business} — Aux saveurs d'Anis`}
              className="h-[390px] w-auto max-w-none object-contain object-top"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>

        <div className="hidden grid-cols-2 gap-4 sm:grid">
        <button
          type="button"
          aria-pressed={value === 'portfolio'}
          onClick={() => onChange('portfolio')}
          className={`flex min-w-0 flex-col rounded-2xl border p-3.5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${value === 'portfolio' ? 'border-[#D6AF2E] bg-amber-50/70 shadow-md' : 'border-slate-200 bg-[#FFFCF7] hover:border-[#D6AF2E]/70'}`}
        >
          <ModelPreview
            src={PROFESSIONAL_IMAGE}
            alt={`${copy.portfolio} — Aux saveurs d'Anis`}
            enlargeLabel={`${copy.enlarge} — ${copy.portfolio}`}
            onEnlarge={() => setExpandedModel('portfolio')}
          />
          <span className="mt-3 min-w-0">
            <span className="block text-sm font-black leading-5 text-[#4A123F] sm:text-lg">{copy.portfolio}</span>
            <span className="mt-1.5 hidden text-sm leading-5 text-slate-600 sm:block">{copy.portfolioDescription}</span>
          </span>
        </button>

        <button
          type="button"
          aria-pressed={value === 'business'}
          onClick={() => onChange('business')}
          className={`flex min-w-0 flex-col rounded-2xl border p-3.5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#D6AF2E] ${value === 'business' ? 'border-[#D6AF2E] bg-amber-50/70 shadow-md' : 'border-slate-200 bg-[#FFFCF7] hover:border-[#D6AF2E]/70'}`}
        >
          <ModelPreview
            src={PORTFOLIO_IMAGE}
            alt={`${copy.business} — Aux saveurs d'Anis`}
            enlargeLabel={`${copy.enlarge} — ${copy.business}`}
            onEnlarge={() => setExpandedModel('business')}
          />
          <span className="mt-3 min-w-0">
            <span className="block text-sm font-black leading-5 text-[#4A123F] sm:text-lg">{copy.business}</span>
            <span className="mt-1.5 hidden text-sm leading-5 text-slate-600 sm:block">{copy.businessDescription}</span>
          </span>
        </button>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-4xl">
        <button
          type="button"
          aria-expanded={showPalettePanel}
          aria-pressed={showPalettePanel}
          onClick={() => setShowPalettePanel((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-xl border border-[#D6AF2E]/50 bg-[#FFFCF7] px-4 py-3 text-sm font-black text-[#4A123F] transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
        >
          <span className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-[#D6AF2E]" aria-hidden="true" />
            {copy.customizeColors}
          </span>
          <span className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200" style={{ background: PALETTE_SWATCHES[paletteValue].bg }}>
              <span className="block h-2.5 w-2.5 rounded-full" style={{ background: PALETTE_SWATCHES[paletteValue].accent }} />
            </span>
            <span className="text-xs font-bold text-slate-600">{selectedPaletteLabel}</span>
          </span>
        </button>

        {showPalettePanel && (
          <div className="mt-2 rounded-2xl border border-amber-200 bg-amber-50/40 p-3">
            <p className="mb-2 text-xs font-bold text-slate-600">{copy.paletteLabel}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label={copy.paletteLabel}>
              {PALETTE_IDS.map((id) => (
                <PaletteChoice
                  key={id}
                  palette={id}
                  selected={paletteValue === id}
                  label={getPaletteLabel(language, id)}
                  onSelect={() => onPaletteChange(id)}
                />
              ))}
            </div>

            <div className="relative mx-auto mt-4 w-fit max-w-full">
              <RealPalettePreview
                palette={paletteValue}
                model={value ?? 'business'}
                language={language}
              />
              <button
                type="button"
                onClick={() => setExpandedPalette(paletteValue)}
                className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full border-2 border-white bg-[#D6AF2E] text-[#07543F] shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#07543F]"
                aria-label={`${copy.palettePreview} — ${selectedPaletteLabel}`}
                title={`${copy.palettePreview} — ${selectedPaletteLabel}`}
              >
                <ZoomIn className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-center text-xs font-semibold text-slate-500">{copy.paletteIncluded}</p>
          </div>
        )}
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
          <p><strong className="text-[#4A123F]">{copy.selectedPalette} :</strong> {selectedPaletteLabel}</p>
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
            <img
              src={currentImage}
              alt={`${expandedModel === 'portfolio' ? copy.portfolio : copy.business} — Aux saveurs d'Anis`}
              className="mx-auto mt-1 max-h-[82dvh] max-w-[calc(100vw-48px)] object-contain object-top"
              decoding="async"
            />
            <a
              href={`/entreprise/sousse/aux-saveurs-d-anis?preview-model=${expandedModel === 'portfolio' ? 'portfolio' : 'business'}&palette=${paletteValue}&source=subscription&lang=${language}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-[#07543F] px-5 py-2.5 text-center text-sm font-bold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-[#D6AF2E]"
            >
              {copy.testModel}
            </a>
          </div>
        </div>
      )}

      {expandedPalette && (
        <div
          className="fixed inset-0 z-[145] flex items-start justify-center overflow-hidden bg-[#021410]/80 p-0 backdrop-blur-md sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setExpandedPalette(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${copy.palettePreview} — ${getPaletteLabel(language, expandedPalette)}`}
            className="relative my-auto h-dvh w-full min-w-0 overflow-y-auto overscroll-contain bg-[#F8F6F0] shadow-2xl sm:h-auto sm:max-h-[calc(100dvh-48px)] sm:rounded-[22px] sm:border sm:border-[#C89B4A]/55"
            style={{ maxWidth: '760px' }}
          >
            <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-[#A07E3E]/25 bg-white px-4 py-2.5 sm:min-h-[70px] sm:px-5 sm:py-3">
              <div className="flex min-w-0 flex-col gap-0.5">
                <small className="text-[0.65rem] font-black tracking-[0.13em] text-[#9A722C]">{copy.enlargedPreview}</small>
                <strong className="truncate font-serif text-base font-bold text-[#0A2F27] sm:text-lg">{getPaletteLabel(language, expandedPalette)} · {value === 'portfolio' ? copy.portfolio : copy.business}</strong>
              </div>
              <button
                type="button"
                onClick={() => setExpandedPalette(null)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-0 bg-[#0B392F] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                aria-label={copy.close}
                title={copy.close}
                autoFocus
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>
            <RealPalettePreview
              palette={expandedPalette}
              model={value ?? 'business'}
              language={language}
              expanded
            />
          </div>
        </div>
      )}
    </section>
  );
}
