import type { Language } from './i18n';

const translations = {
  fr: {
    title: 'Entreprises les plus recommandées par les clients',
    criteria: 'Note Google ≥ 4/5 · Au moins 5 avis · Note puis nombre d’avis',
    reviews: 'avis Google', empty: 'Aucun établissement ne remplit encore ces critères ici. Vous pouvez consulter les résultats ci-dessous ou utiliser la recherche.',
    error: 'Les recommandations sont momentanément indisponibles. La recherche reste accessible.',
    retry: 'Réessayer', loading: 'Chargement des recommandations',
    disclaimer: 'Les entreprises présentées sont affichées automatiquement selon les avis publics et notes disponibles sur Google. Dalil Tounes n’attribue aucune note et n’effectue aucun classement éditorial.',
  },
  en: {
    title: 'Businesses most recommended by customers',
    criteria: 'Google rating ≥ 4/5 · At least 5 reviews · Rating then review count',
    reviews: 'Google reviews', empty: 'No business meets these criteria here yet. Browse the results below or use search.',
    error: 'Recommendations are temporarily unavailable. Search is still available.',
    retry: 'Try again', loading: 'Loading recommendations',
    disclaimer: 'Businesses are displayed automatically using public reviews and ratings available on Google. Dalil Tounes does not assign ratings or produce an editorial ranking.',
  },
  ar: {
    title: 'المؤسسات الأكثر توصية من العملاء',
    criteria: 'تقييم Google ≥ 4/5 · خمس مراجعات على الأقل · حسب التقييم ثم عدد المراجعات',
    reviews: 'مراجعات Google', empty: 'لا توجد مؤسسات تستوفي هذه المعايير هنا حتى الآن. تصفح النتائج أدناه أو استخدم البحث.',
    error: 'التوصيات غير متاحة مؤقتًا. يمكنك مواصلة البحث.',
    retry: 'إعادة المحاولة', loading: 'جارٍ تحميل التوصيات',
    disclaimer: 'تُعرض المؤسسات آليًا حسب المراجعات والتقييمات العامة المتاحة على Google. لا يمنح دليل تونس تقييمات ولا يصدر ترتيبًا تحريريًا.',
  },
  it: {
    title: 'Aziende più consigliate dai clienti',
    criteria: 'Valutazione Google ≥ 4/5 · Almeno 5 recensioni · Valutazione poi numero di recensioni',
    reviews: 'recensioni Google', empty: 'Nessuna azienda soddisfa ancora questi criteri qui. Consulta i risultati sotto o usa la ricerca.',
    error: 'I consigli non sono temporaneamente disponibili. La ricerca resta disponibile.',
    retry: 'Riprova', loading: 'Caricamento dei consigli',
    disclaimer: 'Le aziende vengono mostrate automaticamente in base alle recensioni e valutazioni pubbliche disponibili su Google. Dalil Tounes non assegna voti e non produce classifiche editoriali.',
  },
  ru: {
    title: 'Компании, наиболее рекомендуемые клиентами',
    criteria: 'Оценка Google ≥ 4/5 · Не менее 5 отзывов · По оценке, затем числу отзывов',
    reviews: 'отзывов Google', empty: 'Здесь пока нет компаний, соответствующих этим критериям. Просмотрите результаты ниже или воспользуйтесь поиском.',
    error: 'Рекомендации временно недоступны. Поиск по-прежнему доступен.',
    retry: 'Повторить', loading: 'Загрузка рекомендаций',
    disclaimer: 'Компании отображаются автоматически по общедоступным отзывам и оценкам Google. Dalil Tounes не выставляет оценки и не составляет редакционный рейтинг.',
  },
};

export const getRecommendedTranslations = (language: Language) => translations[language];
