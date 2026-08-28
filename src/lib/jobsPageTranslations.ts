import type { Language } from './i18n';

export type JobRequestMode = 'employer' | 'candidate';

interface JobsPageCopy {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  employerBadge: string;
  employerTitle: string;
  employerDescription: string;
  employerButton: string;
  candidateBadge: string;
  candidateTitle: string;
  candidateDescription: string;
  candidateButton: string;
  offersEyebrow: string;
  offersTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyNote: string;
  businessLink: string;
  close: string;
  modalEmployerTitle: string;
  modalCandidateTitle: string;
  publishPageTitle: string;
  publishPageSubtitle: string;
  publishPageNotice: string;
  helpTitle: string;
  helpTips: string[];
  form: {
    employerIntro: string;
    candidateIntro: string;
    employerTitleLabel: string;
    candidateTitleLabel: string;
    employerTitlePlaceholder: string;
    candidateTitlePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    message: string;
    employerMessagePlaceholder: string;
    candidateMessagePlaceholder: string;
    employerSubmit: string;
    candidateSubmit: string;
    requiredTitle: string;
    requiredContact: string;
    invalidEmail: string;
    employerSuccess: string;
    candidateSuccess: string;
    genericError: string;
  };
}

const translations: Record<Language, JobsPageCopy> = {
  fr: {
    seoTitle: "Emploi en Tunisie : offres vérifiées et candidatures | Dalil Tounes",
    seoDescription: "L'espace Emploi de Dalil Tounes rapproche les entreprises tunisiennes et les candidats grâce à des demandes modérées et des offres vérifiées.",
    heroTitle: 'Emploi & talents en Tunisie',
    heroSubtitle: 'Un lien direct entre les entreprises et les compétences tunisiennes',
    heroDescription: "Complémentaire au Centre d’affaires, cet espace permet aux entreprises de demander la publication d’une offre et aux candidats de présenter leur profil. Chaque demande est vérifiée par l’équipe Dalil Tounes avant sa mise en relation.",
    employerBadge: 'ENTREPRISE',
    employerTitle: 'Rechercher un talent',
    employerDescription: "Décrivez le poste à pourvoir. Notre équipe vous accompagne avant la publication d’une offre vérifiée.",
    employerButton: "Demander la publication d’une offre",
    candidateBadge: 'CANDIDAT',
    candidateTitle: 'Présenter mon profil',
    candidateDescription: "Présentez votre métier, votre expérience et le poste recherché. Votre demande reste modérée par Dalil Tounes.",
    candidateButton: 'Déposer ma candidature',
    offersEyebrow: 'OFFRES VÉRIFIÉES',
    offersTitle: "Offres d’emploi en Tunisie",
    emptyTitle: 'Aucune offre vérifiée disponible actuellement',
    emptyDescription: "Les anciennes annonces de démonstration ont été retirées. Les prochaines offres apparaîtront ici après vérification de l’entreprise, du poste et du moyen de candidature.",
    emptyNote: "Dalil Tounes n’affiche pas d’annonce fictive et ne publie pas d’offre sans source identifiable.",
    businessLink: "Découvrir le Centre d’affaires",
    close: 'Fermer',
    modalEmployerTitle: "Demander la publication d’une offre",
    modalCandidateTitle: 'Déposer ma candidature',
    publishPageTitle: "Demander la publication d’une offre d’emploi",
    publishPageSubtitle: "Présentez votre besoin de recrutement à l’équipe Dalil Tounes.",
    publishPageNotice: "Votre demande sera contrôlée avant toute publication. Elle ne devient pas automatiquement une annonce publique.",
    helpTitle: 'Préparer une demande efficace',
    helpTips: [
      'Indiquez clairement le poste recherché.',
      'Précisez la ville et le type de contrat.',
      'Décrivez les principales missions et compétences attendues.',
      'Ajoutez un téléphone ou un e-mail permettant de vous recontacter.',
    ],
    form: {
      employerIntro: "Envoyez les premières informations sur votre recrutement. Notre équipe vous contactera pour vérifier et compléter l’offre avant sa publication.",
      candidateIntro: "Présentez brièvement votre profil. Notre équipe pourra vous recontacter lorsque le service de mise en relation sera activé ou si une demande correspond à votre métier.",
      employerTitleLabel: 'Poste à pourvoir',
      candidateTitleLabel: 'Métier ou poste recherché',
      employerTitlePlaceholder: 'Ex. : Comptable, développeur, serveur…',
      candidateTitlePlaceholder: 'Ex. : Chauffeur, secrétaire, artisan…',
      phone: 'Téléphone',
      phonePlaceholder: 'Votre numéro de téléphone',
      email: 'E-mail',
      emailPlaceholder: 'Votre adresse e-mail',
      message: 'Présentation',
      employerMessagePlaceholder: 'Ville, contrat, missions, compétences recherchées…',
      candidateMessagePlaceholder: 'Expérience, compétences, ville et disponibilités…',
      employerSubmit: 'Envoyer ma demande de publication',
      candidateSubmit: 'Envoyer ma candidature',
      requiredTitle: 'Merci d’indiquer le poste ou le métier concerné.',
      requiredContact: 'Merci d’indiquer au moins un téléphone ou un e-mail.',
      invalidEmail: 'Le format de l’e-mail est invalide.',
      employerSuccess: 'Votre demande a bien été envoyée. Notre équipe vous contactera avant toute publication.',
      candidateSuccess: 'Votre candidature a bien été envoyée. Notre équipe pourra vous recontacter selon les besoins reçus.',
      genericError: 'Une erreur est survenue. Veuillez réessayer.',
    },
  },
  en: {
    seoTitle: 'Jobs in Tunisia: verified offers and applications | Dalil Tounes',
    seoDescription: 'Dalil Tounes connects Tunisian companies and candidates through moderated requests and verified job offers.',
    heroTitle: 'Jobs & talent in Tunisia',
    heroSubtitle: 'A direct link between companies and Tunisian skills',
    heroDescription: 'Complementing the Business Center, this space lets companies request a job posting and candidates introduce their profile. Every request is reviewed by the Dalil Tounes team before any connection is made.',
    employerBadge: 'COMPANY', employerTitle: 'Find talent', employerDescription: 'Describe the position to fill. Our team assists you before publishing a verified offer.', employerButton: 'Request a job posting',
    candidateBadge: 'CANDIDATE', candidateTitle: 'Introduce my profile', candidateDescription: 'Share your profession, experience and desired role. Your request is moderated by Dalil Tounes.', candidateButton: 'Submit my application',
    offersEyebrow: 'VERIFIED OFFERS', offersTitle: 'Job offers in Tunisia', emptyTitle: 'No verified offers are currently available', emptyDescription: 'The former demonstration listings have been removed. New offers will appear here after the company, role and application method have been checked.', emptyNote: 'Dalil Tounes does not display fictitious listings or publish offers without an identifiable source.', businessLink: 'Discover the Business Center', close: 'Close', modalEmployerTitle: 'Request a job posting', modalCandidateTitle: 'Submit my application',
    publishPageTitle: 'Request the publication of a job offer', publishPageSubtitle: 'Present your recruitment need to the Dalil Tounes team.', publishPageNotice: 'Your request will be reviewed before publication. It does not automatically become a public listing.', helpTitle: 'Prepare an effective request', helpTips: ['Clearly state the position.', 'Specify the city and contract type.', 'Describe the main duties and expected skills.', 'Provide a phone number or email so we can contact you.'],
    form: { employerIntro: 'Send the initial details of your recruitment need. Our team will contact you to verify and complete the offer before publication.', candidateIntro: 'Briefly introduce your profile. Our team may contact you when the matching service is activated or when a request fits your profession.', employerTitleLabel: 'Position to fill', candidateTitleLabel: 'Profession or desired role', employerTitlePlaceholder: 'E.g. accountant, developer, waiter…', candidateTitlePlaceholder: 'E.g. driver, secretary, craftsperson…', phone: 'Phone', phonePlaceholder: 'Your phone number', email: 'Email', emailPlaceholder: 'Your email address', message: 'Introduction', employerMessagePlaceholder: 'City, contract, duties, required skills…', candidateMessagePlaceholder: 'Experience, skills, city and availability…', employerSubmit: 'Send my publication request', candidateSubmit: 'Send my application', requiredTitle: 'Please specify the relevant position or profession.', requiredContact: 'Please provide at least a phone number or email.', invalidEmail: 'The email format is invalid.', employerSuccess: 'Your request has been sent. Our team will contact you before publication.', candidateSuccess: 'Your application has been sent. Our team may contact you according to received needs.', genericError: 'An error occurred. Please try again.' },
  },
  ar: {
    seoTitle: 'فرص العمل في تونس: عروض موثقة وترشحات | دليل تونس', seoDescription: 'يربط فضاء العمل في دليل تونس بين المؤسسات والمترشحين من خلال طلبات خاضعة للمراجعة وعروض عمل موثقة.', heroTitle: 'العمل والكفاءات في تونس', heroSubtitle: 'حلقة وصل مباشرة بين المؤسسات والكفاءات التونسية', heroDescription: 'يكمّل هذا الفضاء مركز الأعمال، إذ يسمح للمؤسسات بطلب نشر عرض عمل وللمترشحين بتقديم ملفاتهم. يراجع فريق دليل تونس كل طلب قبل أي ربط بين الطرفين.', employerBadge: 'مؤسسة', employerTitle: 'البحث عن كفاءة', employerDescription: 'صف الوظيفة المطلوبة، وسيرافقك فريقنا قبل نشر عرض موثق.', employerButton: 'طلب نشر عرض عمل', candidateBadge: 'مترشح', candidateTitle: 'تقديم ملفي', candidateDescription: 'قدّم مهنتك وخبرتك والوظيفة التي تبحث عنها. يخضع طلبك لمراجعة دليل تونس.', candidateButton: 'إرسال ترشحي', offersEyebrow: 'عروض موثقة', offersTitle: 'عروض العمل في تونس', emptyTitle: 'لا توجد حالياً عروض عمل موثقة', emptyDescription: 'تم سحب إعلانات العرض التجريبي. ستظهر العروض الجديدة هنا بعد التحقق من المؤسسة والوظيفة وطريقة الترشح.', emptyNote: 'لا يعرض دليل تونس إعلانات وهمية ولا ينشر عرضاً دون مصدر واضح.', businessLink: 'اكتشف مركز الأعمال', close: 'إغلاق', modalEmployerTitle: 'طلب نشر عرض عمل', modalCandidateTitle: 'إرسال ترشحي', publishPageTitle: 'طلب نشر عرض عمل', publishPageSubtitle: 'قدّم حاجتك إلى الانتداب لفريق دليل تونس.', publishPageNotice: 'سيتم التحقق من طلبك قبل النشر، ولن يتحول آلياً إلى إعلان عام.', helpTitle: 'إعداد طلب فعّال', helpTips: ['حدّد الوظيفة المطلوبة بوضوح.', 'اذكر المدينة ونوع العقد.', 'صف المهام الأساسية والكفاءات المطلوبة.', 'أضف رقم هاتف أو بريداً إلكترونياً للتواصل معك.'], form: { employerIntro: 'أرسل المعلومات الأولى عن حاجتك إلى الانتداب. سيتصل بك فريقنا للتحقق من العرض واستكماله قبل النشر.', candidateIntro: 'قدّم ملفك باختصار. يمكن لفريقنا الاتصال بك عند تفعيل خدمة الربط أو عند توفر طلب يناسب مهنتك.', employerTitleLabel: 'الوظيفة المطلوبة', candidateTitleLabel: 'المهنة أو الوظيفة المطلوبة', employerTitlePlaceholder: 'مثال: محاسب، مطور، نادل…', candidateTitlePlaceholder: 'مثال: سائق، سكرتير، حرفي…', phone: 'الهاتف', phonePlaceholder: 'رقم هاتفك', email: 'البريد الإلكتروني', emailPlaceholder: 'عنوان بريدك الإلكتروني', message: 'تقديم', employerMessagePlaceholder: 'المدينة، العقد، المهام والكفاءات المطلوبة…', candidateMessagePlaceholder: 'الخبرة، الكفاءات، المدينة والتوفر…', employerSubmit: 'إرسال طلب النشر', candidateSubmit: 'إرسال ترشحي', requiredTitle: 'يرجى تحديد الوظيفة أو المهنة المعنية.', requiredContact: 'يرجى إضافة رقم هاتف أو بريد إلكتروني على الأقل.', invalidEmail: 'صيغة البريد الإلكتروني غير صحيحة.', employerSuccess: 'تم إرسال طلبك. سيتصل بك فريقنا قبل أي نشر.', candidateSuccess: 'تم إرسال ترشحك. يمكن لفريقنا الاتصال بك وفقاً للاحتياجات المتوفرة.', genericError: 'حدث خطأ. يرجى المحاولة مرة أخرى.' },
  },
  it: {
    seoTitle: 'Lavoro in Tunisia: offerte verificate e candidature | Dalil Tounes', seoDescription: 'Lo spazio Lavoro di Dalil Tounes mette in contatto imprese tunisine e candidati tramite richieste moderate e offerte verificate.', heroTitle: 'Lavoro e talenti in Tunisia', heroSubtitle: 'Un collegamento diretto tra imprese e competenze tunisine', heroDescription: 'A complemento del Centro d’affari, questo spazio consente alle imprese di richiedere la pubblicazione di un’offerta e ai candidati di presentare il proprio profilo. Ogni richiesta viene verificata dal team Dalil Tounes.', employerBadge: 'IMPRESA', employerTitle: 'Cercare un talento', employerDescription: 'Descrivi la posizione da coprire. Il nostro team ti accompagna prima della pubblicazione di un’offerta verificata.', employerButton: 'Richiedere la pubblicazione', candidateBadge: 'CANDIDATO', candidateTitle: 'Presentare il mio profilo', candidateDescription: 'Presenta professione, esperienza e posizione desiderata. La richiesta viene moderata da Dalil Tounes.', candidateButton: 'Inviare la candidatura', offersEyebrow: 'OFFERTE VERIFICATE', offersTitle: 'Offerte di lavoro in Tunisia', emptyTitle: 'Nessuna offerta verificata disponibile al momento', emptyDescription: 'I vecchi annunci dimostrativi sono stati rimossi. Le nuove offerte appariranno qui dopo la verifica dell’impresa, della posizione e del metodo di candidatura.', emptyNote: 'Dalil Tounes non mostra annunci fittizi e non pubblica offerte senza una fonte identificabile.', businessLink: 'Scopri il Centro d’affari', close: 'Chiudi', modalEmployerTitle: 'Richiedere la pubblicazione', modalCandidateTitle: 'Inviare la candidatura', publishPageTitle: 'Richiedere la pubblicazione di un’offerta', publishPageSubtitle: 'Presenta la tua esigenza di selezione al team Dalil Tounes.', publishPageNotice: 'La richiesta sarà verificata prima della pubblicazione e non diventerà automaticamente un annuncio pubblico.', helpTitle: 'Preparare una richiesta efficace', helpTips: ['Indica chiaramente la posizione.', 'Specifica città e tipo di contratto.', 'Descrivi mansioni e competenze richieste.', 'Aggiungi telefono o email per essere ricontattato.'], form: { employerIntro: 'Invia le prime informazioni sulla selezione. Il nostro team ti contatterà per verificare e completare l’offerta prima della pubblicazione.', candidateIntro: 'Presenta brevemente il tuo profilo. Il nostro team potrà contattarti quando il servizio di abbinamento sarà attivo o in presenza di una richiesta adatta.', employerTitleLabel: 'Posizione da coprire', candidateTitleLabel: 'Professione o posizione desiderata', employerTitlePlaceholder: 'Es. contabile, sviluppatore, cameriere…', candidateTitlePlaceholder: 'Es. autista, segretario, artigiano…', phone: 'Telefono', phonePlaceholder: 'Il tuo numero di telefono', email: 'Email', emailPlaceholder: 'Il tuo indirizzo email', message: 'Presentazione', employerMessagePlaceholder: 'Città, contratto, mansioni e competenze…', candidateMessagePlaceholder: 'Esperienza, competenze, città e disponibilità…', employerSubmit: 'Inviare la richiesta', candidateSubmit: 'Inviare la candidatura', requiredTitle: 'Indica la posizione o la professione interessata.', requiredContact: 'Indica almeno un telefono o un’email.', invalidEmail: 'Il formato dell’email non è valido.', employerSuccess: 'La richiesta è stata inviata. Il team ti contatterà prima della pubblicazione.', candidateSuccess: 'La candidatura è stata inviata. Il team potrà contattarti in base alle richieste ricevute.', genericError: 'Si è verificato un errore. Riprova.' },
  },
  ru: {
    seoTitle: 'Работа в Тунисе: проверенные вакансии и анкеты | Dalil Tounes', seoDescription: 'Раздел вакансий Dalil Tounes связывает тунисские компании и кандидатов через модерируемые запросы и проверенные предложения.', heroTitle: 'Работа и таланты в Тунисе', heroSubtitle: 'Прямая связь между компаниями и тунисскими специалистами', heroDescription: 'Этот раздел дополняет Деловой центр: компании могут запросить публикацию вакансии, а кандидаты — представить свой профиль. Команда Dalil Tounes проверяет каждый запрос до установления контакта.', employerBadge: 'КОМПАНИЯ', employerTitle: 'Найти специалиста', employerDescription: 'Опишите вакансию. Наша команда поможет подготовить проверенное объявление к публикации.', employerButton: 'Запросить публикацию вакансии', candidateBadge: 'КАНДИДАТ', candidateTitle: 'Представить мой профиль', candidateDescription: 'Расскажите о профессии, опыте и желаемой должности. Запрос модерируется Dalil Tounes.', candidateButton: 'Отправить анкету', offersEyebrow: 'ПРОВЕРЕННЫЕ ВАКАНСИИ', offersTitle: 'Вакансии в Тунисе', emptyTitle: 'Сейчас нет проверенных вакансий', emptyDescription: 'Старые демонстрационные объявления удалены. Новые вакансии появятся здесь после проверки компании, должности и способа отклика.', emptyNote: 'Dalil Tounes не показывает вымышленные объявления и не публикует вакансии без идентифицируемого источника.', businessLink: 'Открыть Деловой центр', close: 'Закрыть', modalEmployerTitle: 'Запросить публикацию вакансии', modalCandidateTitle: 'Отправить анкету', publishPageTitle: 'Запросить публикацию вакансии', publishPageSubtitle: 'Расскажите команде Dalil Tounes о потребности в подборе сотрудника.', publishPageNotice: 'Запрос будет проверен до публикации и не станет общедоступной вакансией автоматически.', helpTitle: 'Подготовьте эффективный запрос', helpTips: ['Чётко укажите должность.', 'Укажите город и тип договора.', 'Опишите задачи и требуемые навыки.', 'Добавьте телефон или email для связи.'], form: { employerIntro: 'Отправьте первые сведения о подборе. Наша команда свяжется с вами, проверит и дополнит вакансию перед публикацией.', candidateIntro: 'Кратко представьте свой профиль. Наша команда сможет связаться с вами после запуска подбора или при появлении подходящего запроса.', employerTitleLabel: 'Вакантная должность', candidateTitleLabel: 'Профессия или желаемая должность', employerTitlePlaceholder: 'Напр.: бухгалтер, разработчик, официант…', candidateTitlePlaceholder: 'Напр.: водитель, секретарь, мастер…', phone: 'Телефон', phonePlaceholder: 'Ваш номер телефона', email: 'Email', emailPlaceholder: 'Ваш адрес email', message: 'Представление', employerMessagePlaceholder: 'Город, договор, задачи и требуемые навыки…', candidateMessagePlaceholder: 'Опыт, навыки, город и доступность…', employerSubmit: 'Отправить запрос', candidateSubmit: 'Отправить анкету', requiredTitle: 'Укажите должность или профессию.', requiredContact: 'Укажите хотя бы телефон или email.', invalidEmail: 'Некорректный формат email.', employerSuccess: 'Запрос отправлен. Наша команда свяжется с вами до публикации.', candidateSuccess: 'Анкета отправлена. Наша команда сможет связаться с вами при наличии подходящих запросов.', genericError: 'Произошла ошибка. Повторите попытку.' },
  },
};

export function getJobsPageTranslations(language: Language): JobsPageCopy {
  return translations[language] || translations.fr;
}
