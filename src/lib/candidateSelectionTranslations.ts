import type { Language } from './i18n';

interface CandidateSelectionCopy {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  methodTitle: string;
  methodText: string;
  privacyText: string;
  searchLabel: string;
  searchPlaceholder: string;
  cityLabel: string;
  allCities: string;
  experienceLabel: string;
  allExperiences: string;
  experience0to1: string;
  experience2to5: string;
  experience6plus: string;
  loading: string;
  error: string;
  emptyTitle: string;
  emptyText: string;
  submitProfile: string;
  profileFallback: string;
  years: string;
  year: string;
  profileStrength: string;
  available: string;
  contact: string;
  modalTitle: string;
  close: string;
  backToJobs: string;
}

const copies: Record<Language, CandidateSelectionCopy> = {
  fr: {
    seoTitle: 'Talents vérifiés en Tunisie | Dalil Tounes',
    seoDescription: 'Découvrez les profils professionnels validés par Dalil Tounes et demandez une mise en relation confidentielle.',
    eyebrow: 'SÉLECTION DE TALENTS', title: 'Les profils les plus complets', subtitle: 'Dalil Tounes présente aux entreprises uniquement les candidats ayant accepté une visibilité publique et dont le profil a été validé.',
    methodTitle: 'Un classement transparent', methodText: 'L’ordre dépend de la complétude du profil, de l’expérience, des compétences et de la mise à jour des informations. L’abonnement ne modifie pas ce classement.', privacyText: 'Le nom, l’e-mail et le téléphone restent masqués. Toute mise en relation passe d’abord par Dalil Tounes.',
    searchLabel: 'Rechercher une compétence ou un métier', searchPlaceholder: 'Ex. : comptable, chauffeur, informatique…', cityLabel: 'Ville', allCities: 'Toutes les villes', experienceLabel: 'Expérience', allExperiences: 'Toutes les expériences', experience0to1: '0 à 1 an', experience2to5: '2 à 5 ans', experience6plus: '6 ans et plus',
    loading: 'Chargement des profils validés…', error: 'Impossible de charger les profils pour le moment.', emptyTitle: 'Aucun profil public validé actuellement', emptyText: 'Les candidatures reçues restent privées tant que l’équipe Dalil Tounes ne les a pas contrôlées et que le candidat n’a pas autorisé leur affichage.', submitProfile: 'Présenter mon profil', profileFallback: 'Profil professionnel', years: 'ans', year: 'an', profileStrength: 'Profil complété à', available: 'Disponibilité', contact: 'Demander une mise en relation', modalTitle: 'Demander une mise en relation', close: 'Fermer', backToJobs: 'Retour aux offres d’emploi',
  },
  en: {
    seoTitle: 'Verified talent in Tunisia | Dalil Tounes', seoDescription: 'Discover professional profiles validated by Dalil Tounes and request a confidential introduction.', eyebrow: 'TALENT SELECTION', title: 'The most complete profiles', subtitle: 'Dalil Tounes shows companies only candidates who accepted public visibility and whose profile has been validated.', methodTitle: 'Transparent ranking', methodText: 'Order is based on profile completeness, experience, skills and information freshness. Subscription does not affect ranking.', privacyText: 'Name, email and phone remain hidden. Every introduction is first moderated by Dalil Tounes.', searchLabel: 'Search for a skill or profession', searchPlaceholder: 'E.g. accountant, driver, IT…', cityLabel: 'City', allCities: 'All cities', experienceLabel: 'Experience', allExperiences: 'All experience levels', experience0to1: '0 to 1 year', experience2to5: '2 to 5 years', experience6plus: '6 years or more', loading: 'Loading validated profiles…', error: 'Profiles cannot be loaded right now.', emptyTitle: 'No validated public profile yet', emptyText: 'Applications remain private until the Dalil Tounes team reviews them and the candidate authorizes display.', submitProfile: 'Introduce my profile', profileFallback: 'Professional profile', years: 'years', year: 'year', profileStrength: 'Profile completed at', available: 'Availability', contact: 'Request an introduction', modalTitle: 'Request an introduction', close: 'Close', backToJobs: 'Back to job offers',
  },
  ar: {
    seoTitle: 'كفاءات موثقة في تونس | دليل تونس', seoDescription: 'اكتشف الملفات المهنية التي صادق عليها دليل تونس واطلب ربطاً سرياً مع المترشح.', eyebrow: 'اختيار الكفاءات', title: 'الملفات الأكثر اكتمالاً', subtitle: 'لا يعرض دليل تونس للمؤسسات إلا المترشحين الذين وافقوا على الظهور العام وتم التحقق من ملفاتهم.', methodTitle: 'ترتيب شفاف', methodText: 'يعتمد الترتيب على اكتمال الملف والخبرة والمهارات وتحديث المعلومات. لا يؤثر الاشتراك في هذا الترتيب.', privacyText: 'يبقى الاسم والبريد الإلكتروني والهاتف مخفياً، ويمر كل ربط أولاً عبر دليل تونس.', searchLabel: 'البحث عن مهارة أو مهنة', searchPlaceholder: 'مثال: محاسب، سائق، إعلامية…', cityLabel: 'المدينة', allCities: 'كل المدن', experienceLabel: 'الخبرة', allExperiences: 'كل مستويات الخبرة', experience0to1: 'من 0 إلى سنة', experience2to5: 'من سنتين إلى 5 سنوات', experience6plus: '6 سنوات أو أكثر', loading: 'جارٍ تحميل الملفات الموثقة…', error: 'تعذر تحميل الملفات حالياً.', emptyTitle: 'لا يوجد حالياً ملف عام موثق', emptyText: 'تبقى الترشحات خاصة إلى أن يراجعها فريق دليل تونس ويوافق المترشح على عرضها.', submitProfile: 'تقديم ملفي', profileFallback: 'ملف مهني', years: 'سنوات', year: 'سنة', profileStrength: 'اكتمال الملف', available: 'التوفر', contact: 'طلب ربط مع المترشح', modalTitle: 'طلب ربط مع مترشح', close: 'إغلاق', backToJobs: 'العودة إلى عروض العمل',
  },
  it: {
    seoTitle: 'Talenti verificati in Tunisia | Dalil Tounes', seoDescription: 'Scopri i profili professionali convalidati da Dalil Tounes e richiedi un contatto riservato.', eyebrow: 'SELEZIONE TALENTI', title: 'I profili più completi', subtitle: 'Dalil Tounes presenta alle imprese solo candidati che hanno accettato la visibilità pubblica e il cui profilo è stato convalidato.', methodTitle: 'Una classifica trasparente', methodText: 'L’ordine dipende dalla completezza del profilo, dall’esperienza, dalle competenze e dall’aggiornamento delle informazioni. L’abbonamento non influisce.', privacyText: 'Nome, email e telefono restano nascosti. Ogni contatto passa prima da Dalil Tounes.', searchLabel: 'Cerca una competenza o professione', searchPlaceholder: 'Es. contabile, autista, informatica…', cityLabel: 'Città', allCities: 'Tutte le città', experienceLabel: 'Esperienza', allExperiences: 'Tutti i livelli', experience0to1: 'Da 0 a 1 anno', experience2to5: 'Da 2 a 5 anni', experience6plus: '6 anni o più', loading: 'Caricamento dei profili convalidati…', error: 'Impossibile caricare i profili al momento.', emptyTitle: 'Nessun profilo pubblico convalidato', emptyText: 'Le candidature restano private finché il team Dalil Tounes non le controlla e il candidato non autorizza la visualizzazione.', submitProfile: 'Presentare il mio profilo', profileFallback: 'Profilo professionale', years: 'anni', year: 'anno', profileStrength: 'Profilo completato al', available: 'Disponibilità', contact: 'Richiedere un contatto', modalTitle: 'Richiedere un contatto', close: 'Chiudi', backToJobs: 'Torna alle offerte di lavoro',
  },
  ru: {
    seoTitle: 'Проверенные специалисты в Тунисе | Dalil Tounes', seoDescription: 'Просматривайте профессиональные анкеты, проверенные Dalil Tounes, и запрашивайте конфиденциальное знакомство.', eyebrow: 'ОТБОР СПЕЦИАЛИСТОВ', title: 'Наиболее полные анкеты', subtitle: 'Dalil Tounes показывает компаниям только кандидатов, согласившихся на публичность и прошедших проверку.', methodTitle: 'Прозрачный рейтинг', methodText: 'Порядок зависит от полноты анкеты, опыта, навыков и актуальности сведений. Подписка не влияет на рейтинг.', privacyText: 'Имя, email и телефон скрыты. Любое знакомство сначала модерирует Dalil Tounes.', searchLabel: 'Поиск навыка или профессии', searchPlaceholder: 'Напр.: бухгалтер, водитель, IT…', cityLabel: 'Город', allCities: 'Все города', experienceLabel: 'Опыт', allExperiences: 'Любой опыт', experience0to1: 'От 0 до 1 года', experience2to5: 'От 2 до 5 лет', experience6plus: '6 лет и более', loading: 'Загрузка проверенных анкет…', error: 'Сейчас невозможно загрузить анкеты.', emptyTitle: 'Пока нет проверенных публичных анкет', emptyText: 'Анкеты остаются закрытыми, пока команда Dalil Tounes не проверит их, а кандидат не разрешит публикацию.', submitProfile: 'Представить мою анкету', profileFallback: 'Профессиональная анкета', years: 'лет', year: 'год', profileStrength: 'Анкета заполнена на', available: 'Доступность', contact: 'Запросить знакомство', modalTitle: 'Запросить знакомство', close: 'Закрыть', backToJobs: 'Вернуться к вакансиям',
  },
};

export function getCandidateSelectionTranslations(language: Language) {
  return copies[language] || copies.fr;
}
