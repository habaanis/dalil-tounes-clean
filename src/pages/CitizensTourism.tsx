import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import TourismExperienceDiscovery from '../components/TourismExperienceDiscovery';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { ChevronDown, Compass, ExternalLink, Home } from 'lucide-react';

type PublicLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

const copy: Record<PublicLanguage, {
  title: string;
  intro: string;
  slogan: string;
  sector: string;
  recommended: string;
  preferredTitle: string;
  preferredSubtitle: string;
  allReferenced: string;
  searchOther: string;
  searchQuery: string;
  articleTitle: string;
  articleExcerpt: string;
  heroAlt: string;
  seoTitle: string;
  expatTitle: string;
  expatIntro: string;
  quickLinks: readonly [string, string, string, string];
}> = {
  fr: {
    title: 'Tourisme Local & Expatriation',
    intro: "Découvrez les meilleurs services pour touristes et expatriés en Tunisie. Hébergement, guides touristiques, services d'immigration et plus encore.",
    slogan: 'Votre guide pour un séjour réussi en Tunisie',
    sector: 'tourisme',
    recommended: 'Entreprises les plus recommandées par les clients',
    preferredTitle: 'Les services utiles aux touristes et expatriés',
    preferredSubtitle: 'Des professionnels pour faciliter votre séjour ou votre installation en Tunisie',
    allReferenced: 'Tous les services tourisme & expatriation référencés',
    searchOther: "Rechercher d'autres services tourisme & expatriation",
    searchQuery: 'tourisme expatriation',
    articleTitle: 'Guide du tourisme en Tunisie',
    articleExcerpt: 'Découvrez les meilleurs sites, hébergements et activités pour un séjour inoubliable en Tunisie.',
    heroAlt: 'Tourisme local et expatriation en Tunisie',
    seoTitle: 'Tourisme et services pour expatriés en Tunisie | Dalil Tounes',
    expatTitle: "S'installer et vivre en Tunisie",
    expatIntro: 'Retrouvez rapidement les services essentiels pour préparer votre séjour, vos démarches et votre vie quotidienne.',
    quickLinks: ['Services publics', 'Santé', 'Éducation', 'Emploi'],
  },
  ar: {
    title: 'السياحة المحلية والاغتراب',
    intro: 'اكتشف أفضل الخدمات للسياح والمغتربين في تونس: الإقامة، الأدلة السياحية، خدمات الهجرة والمزيد.',
    slogan: 'دليلك لإقامة ناجحة في تونس',
    sector: 'سياحة',
    recommended: 'المؤسسات الأكثر توصية من قبل العملاء',
    preferredTitle: 'خدمات مفيدة للسياح والمقيمين الأجانب',
    preferredSubtitle: 'مهنيون يساعدونك على تسهيل إقامتك أو استقرارك في تونس',
    allReferenced: 'جميع خدمات السياحة والإقامة للأجانب المسجلة',
    searchOther: 'البحث عن خدمات سياحية وخدمات للمقيمين الأجانب',
    searchQuery: 'السياحة الإقامة الأجانب',
    articleTitle: 'دليل السياحة في تونس',
    articleExcerpt: 'اكتشف أفضل المواقع والإقامات والأنشطة لإقامة لا تُنسى في تونس.',
    heroAlt: 'السياحة المحلية وخدمات المغتربين في تونس',
    seoTitle: 'السياحة وخدمات المقيمين الأجانب في تونس | دليل تونس',
    expatTitle: 'الاستقرار والعيش في تونس',
    expatIntro: 'اعثر بسرعة على الخدمات الأساسية لتحضير إقامتك وإجراءاتك وحياتك اليومية.',
    quickLinks: ['الخدمات العامة', 'الصحة', 'التعليم', 'التوظيف'],
  },
  en: {
    title: 'Local Tourism & Expatriation',
    intro: 'Discover services for tourists and expatriates in Tunisia, including accommodation, tourist guides, immigration services and more.',
    slogan: 'Your guide to a successful stay in Tunisia',
    sector: 'tourism',
    recommended: 'Most recommended businesses by customers',
    preferredTitle: 'Useful services for tourists and expatriates',
    preferredSubtitle: 'Professionals who can make your stay or relocation to Tunisia easier',
    allReferenced: 'All listed tourism and expatriation services',
    searchOther: 'Search other tourism and expatriation services',
    searchQuery: 'tourism expatriation',
    articleTitle: 'Tourism guide in Tunisia',
    articleExcerpt: 'Discover the best sites, accommodations and activities for an unforgettable stay in Tunisia.',
    heroAlt: 'Local tourism and expatriation services in Tunisia',
    seoTitle: 'Tourism and expatriate services in Tunisia | Dalil Tounes',
    expatTitle: 'Settling and living in Tunisia',
    expatIntro: 'Quickly find essential services for your stay, administrative procedures and daily life.',
    quickLinks: ['Public services', 'Health', 'Education', 'Jobs'],
  },
  it: {
    title: 'Turismo Locale ed Espatrio',
    intro: 'Scopri i servizi per turisti ed espatriati in Tunisia: alloggi, guide turistiche, servizi di immigrazione e molto altro.',
    slogan: 'La tua guida per un soggiorno di successo in Tunisia',
    sector: 'turismo',
    recommended: 'Aziende più raccomandate dai clienti',
    preferredTitle: 'Servizi utili per turisti ed espatriati',
    preferredSubtitle: 'Professionisti che facilitano il tuo soggiorno o trasferimento in Tunisia',
    allReferenced: 'Tutti i servizi turistici e per espatriati registrati',
    searchOther: 'Cerca altri servizi turistici e per espatriati',
    searchQuery: 'turismo espatriati',
    articleTitle: 'Guida al turismo in Tunisia',
    articleExcerpt: 'Scopri i migliori siti, alloggi e attività per un soggiorno indimenticabile in Tunisia.',
    heroAlt: 'Turismo locale e servizi per espatriati in Tunisia',
    seoTitle: 'Turismo e servizi per espatriati in Tunisia | Dalil Tounes',
    expatTitle: 'Trasferirsi e vivere in Tunisia',
    expatIntro: 'Trova rapidamente i servizi essenziali per il soggiorno, le pratiche amministrative e la vita quotidiana.',
    quickLinks: ['Servizi pubblici', 'Salute', 'Istruzione', 'Lavoro'],
  },
  ru: {
    title: 'Местный туризм и жизнь за границей',
    intro: 'Найдите полезные услуги для туристов и экспатов в Тунисе: жильё, гидов, иммиграционные услуги и многое другое.',
    slogan: 'Ваш гид для комфортного пребывания в Тунисе',
    sector: 'туризм',
    recommended: 'Компании, которые чаще всего рекомендуют клиенты',
    preferredTitle: 'Полезные услуги для туристов и экспатов',
    preferredSubtitle: 'Специалисты, которые помогут с поездкой или переездом в Тунис',
    allReferenced: 'Все услуги для туристов и экспатов',
    searchOther: 'Найти другие услуги для туристов и экспатов',
    searchQuery: 'туризм экспаты',
    articleTitle: 'Путеводитель по Тунису',
    articleExcerpt: 'Откройте лучшие места, варианты проживания и развлечения для незабываемой поездки по Тунису.',
    heroAlt: 'Местный туризм и услуги для экспатов в Тунисе',
    seoTitle: 'Туризм и услуги для экспатов в Тунисе | Dalil Tounes',
    expatTitle: 'Переезд и жизнь в Тунисе',
    expatIntro: 'Быстро найдите основные услуги для поездки, административных процедур и повседневной жизни.',
    quickLinks: ['Госуслуги', 'Здоровье', 'Образование', 'Работа'],
  },
};

const SETTLEMENT_SERVICE_PATHS: Record<number, string> = {
  1: '/recherche?categorie=immobilier',
  2: '/citizens/health',
  3: '/education',
  4: '/recherche?q=banque',
  6: '/emplois',
  7: '/citizens/shops',
};
const settlementServiceLinkLabels: Record<PublicLanguage, string> = {
  fr: 'Voir les professionnels',
  ar: 'عرض المهنيين والخدمات',
  en: 'Find local services',
  it: 'Trova i professionisti',
  ru: 'Найти специалистов',
};

const QUICK_LINK_PATHS = ['/citizens/services', '/citizens/health', '/education', '/emplois'] as const;

const settleServiceIntros: Record<PublicLanguage, string[]> = {
  fr: [
    'Comprenez les étapes du visa et de la résidence, puis préparez les justificatifs adaptés à votre situation.',
    'Préparez votre recherche de logement ; la flèche permet de consulter les agences immobilières référencées.',
    'Vous trouverez : des médecins généralistes, spécialistes, dentistes, hôpitaux, cliniques et pharmacies sur la page Santé.',
    'Vous trouverez : les établissements scolaires et les informations utiles pour inscrire un enfant ou poursuivre ses études.',
    'Vous trouverez : des repères pour les comptes bancaires, les transferts, le change et les démarches fiscales.',
    'Comprenez les trois situations : véhicule personnel, déménagement et matériel professionnel, avant de vérifier les règles douanières.',
    'Vous trouverez : des ressources pour chercher un emploi, créer une entreprise et identifier les organismes utiles.',
    'Vous trouverez : commerces, téléphonie, accès Internet et services utiles à proximité de votre lieu de vie.'
  ],
  ar: [
    'افهم خطوات التأشيرة والإقامة والوثائق التي ينبغي تحضيرها بحسب وضعيتك.',
    'حضّر بحثك عن سكن؛ يتيح السهم الاطلاع على الوكالات العقارية المدرجة.',
    'ستجد أطباء عامين وأخصائيين وأطباء أسنان ومستشفيات ومصحات وصيدليات في صفحة الصحة.',
    'ستجد المؤسسات التعليمية ومعلومات التسجيل ومتابعة الدراسة.',
    'ستجد معلومات عن الحسابات البنكية والتحويلات والصرف والإجراءات الجبائية.',
    'تعرّف على ثلاث حالات: السيارة الشخصية والأثاث والمعدات المهنية قبل التحقق من القواعد الديوانية.',
    'ستجد موارد للبحث عن عمل وبعث مشروع والتواصل مع الهياكل المعنية.',
    'ستجد المتاجر والاتصالات والإنترنت والخدمات اليومية القريبة منك.'
  ],
  en: [
    'Understand visa and residence steps, then prepare documents relevant to your situation.',
    'Prepare your housing search; use the arrow to view listed real-estate agencies.',
    'Find general practitioners, specialists, dentists, hospitals, clinics and pharmacies on the Health page.',
    'Find schools, education providers and practical information about enrolment.',
    'Find guidance on bank accounts, transfers, currency exchange and tax procedures.',
    'Understand the three paths—personal vehicle, household move and professional equipment—before checking customs rules.',
    'Find resources for jobs, starting a business and the relevant support organisations.',
    'Find shops, mobile and internet providers and everyday services near your home.'
  ],
  it: [
    'Scopri i passaggi per visto e soggiorno e prepara i documenti adatti alla tua situazione.',
    'Prepara la ricerca di casa; la freccia apre la lista delle agenzie immobiliari.',
    'Troverai medici di base, specialisti, dentisti, ospedali, cliniche e farmacie nella pagina Salute.',
    'Troverai scuole, istituti e informazioni pratiche per le iscrizioni.',
    'Troverai indicazioni su conti bancari, trasferimenti, cambio e adempimenti fiscali.',
    'Esamina i tre percorsi: automobile, trasloco e attrezzature professionali, poi verifica le norme doganali.',
    'Troverai risorse per il lavoro, l’avvio di un’impresa e gli enti di supporto.',
    'Troverai negozi, telefonia, Internet e servizi quotidiani nelle vicinanze.'
  ],
  ru: [
    'Узнайте основные шаги получения визы и вида на жительство и подготовьте документы для вашей ситуации.',
    'Подготовьтесь к поиску жилья; стрелка открывает каталог агентств недвижимости.',
    'В разделе «Здоровье» можно искать терапевтов, специалистов, стоматологов, больницы, клиники и аптеки.',
    'Здесь можно найти школы, образовательные учреждения и сведения о поступлении.',
    'Здесь собраны сведения о банковских счетах, переводах, обмене валют и налоговых процедурах.',
    'Изучите три сценария: личный автомобиль, переезд и профессиональное оборудование, затем уточните таможенные правила.',
    'Здесь собраны ресурсы для поиска работы, открытия бизнеса и обращения в профильные организации.',
    'Здесь можно найти магазины, мобильную связь, Интернет и повседневные услуги рядом.'
  ]
};

const settleActionLabels: Record<PublicLanguage, string[]> = {
  fr: ['Consulter les formalités de séjour (site officiel)', 'Ouvrir l’annuaire pour rechercher un professionnel du logement', 'Rechercher un médecin, un hôpital ou une clinique sur la page Santé', 'Accéder à la page Éducation', 'Consulter les services fiscaux officiels', 'Consulter les formalités douanières officielles', 'Consulter les ressources officielles pour entreprendre', 'Consulter la page Commerces et magasins'],
  ar: ['الاطلاع على إجراءات الإقامة الرسمية', 'فتح الدليل للبحث عن خدمات السكن', 'البحث عن طبيب أو مستشفى أو مصحة في صفحة الصحة', 'الانتقال إلى صفحة التعليم', 'الاطلاع على الخدمات الجبائية الرسمية', 'الاطلاع على الإجراءات الديوانية الرسمية', 'الاطلاع على موارد الاستثمار الرسمية', 'الانتقال إلى صفحة المتاجر والمحلات'],
  en: ['View official residence procedures', 'Open the directory to search for housing and moving providers', 'Search for a doctor, hospital or clinic on the Health page', 'Go to the Education page', 'View official tax services', 'View official customs procedures', 'View official business and investment resources', 'Browse the Shops page'],
  it: ['Consultare le procedure ufficiali di soggiorno', 'Aprire l’elenco per cercare casa e trasloco', 'Cerca un medico, ospedale o clinica nella pagina Salute', 'Aprire la pagina Istruzione', 'Consultare i servizi fiscali ufficiali', 'Consultare le procedure doganali ufficiali', 'Consultare le risorse ufficiali per le imprese', 'Aprire la pagina Negozi'],
  ru: ['Открыть официальные правила пребывания', 'Открыть каталог для поиска услуг жилья и переезда', 'Найти врача, больницу или клинику на странице «Здоровье»', 'Перейти на страницу «Образование»', 'Открыть официальные налоговые сервисы', 'Открыть официальные таможенные правила', 'Открыть официальные ресурсы для бизнеса', 'Открыть страницу магазинов'],
};

const bankingGuide: Record<PublicLanguage, { title: string; steps: string[]; caution: string; banks: string; exchange: string }> = {
  fr: { title: 'Par où commencer ?', steps: ['Identifiez votre situation : résident, non-résident ou Tunisien résidant à l’étranger.', 'Demandez à la banque quels comptes sont accessibles à votre statut et quelles pièces elle exige.', 'Avant un virement international ou un achat immobilier, vérifiez les justificatifs d’origine des fonds et les règles de change.', 'Pour les impôts, utilisez les services officiels et demandez un avis adapté à votre situation.'], caution: 'Règles, documents et frais peuvent évoluer : confirmez toujours les exigences auprès de la banque et des autorités compétentes avant toute opération.', banks: 'Trouver une banque', exchange: 'Rechercher un bureau de change' },
  ar: { title: 'من أين تبدأ؟', steps: ['حدّد وضعيتك: مقيم أو غير مقيم أو تونسي مقيم بالخارج.', 'اسأل البنك عن أنواع الحسابات المتاحة والوثائق المطلوبة حسب وضعيتك.', 'قبل تحويل الأموال أو شراء عقار، تحقّق من إثبات مصدر الأموال وقواعد الصرف.', 'للإجراءات الجبائية، راجع الخدمات الرسمية واطلب مشورة مناسبة لوضعيتك.'], caution: 'قد تتغير القواعد والوثائق والمعاليم. تأكّد من البنك والجهات الرسمية قبل أي إجراء.', banks: 'البحث عن بنك', exchange: 'البحث عن مكتب صرف' },
  en: { title: 'Where should you start?', steps: ['Identify your status: resident, non-resident or Tunisian living abroad.', 'Ask the bank which accounts suit your status and which documents it requires.', 'Before transferring funds or buying property, check proof-of-funds requirements and exchange-control rules.', 'For tax matters, consult official services and seek advice specific to your situation.'], caution: 'Rules, documents and fees may change. Confirm current requirements with the bank and relevant authorities before acting.', banks: 'Find a bank', exchange: 'Find a currency exchange office' },
  it: { title: 'Da dove iniziare?', steps: ['Definisci il tuo status: residente, non residente o tunisino residente all’estero.', 'Chiedi alla banca quali conti sono disponibili e quali documenti richiede.', 'Prima di trasferimenti o acquisti immobiliari, verifica le prove dell’origine dei fondi e le regole valutarie.', 'Per il fisco, consulta i servizi ufficiali e chiedi indicazioni adeguate alla tua situazione.'], caution: 'Norme, documenti e costi possono cambiare. Verifica sempre con banca e autorità competenti.', banks: 'Cerca una banca', exchange: 'Cerca un ufficio di cambio' },
  ru: { title: 'С чего начать?', steps: ['Уточните свой статус: резидент, нерезидент или тунисец, проживающий за границей.', 'Узнайте в банке, какие счета доступны и какие документы необходимы.', 'Перед переводом средств или покупкой недвижимости проверьте требования к подтверждению происхождения средств и валютные правила.', 'По налоговым вопросам используйте официальные сервисы и получите консультацию с учётом своей ситуации.'], caution: 'Правила, документы и сборы могут меняться. Уточняйте требования в банке и государственных органах.', banks: 'Найти банк', exchange: 'Найти обменный пункт' }
};

const customsGuide: Record<PublicLanguage, { title: string; paths: { title: string; text: string; href: string; link: string }[]; caution: string }> = {
  fr: { title: 'Que souhaitez-vous apporter en Tunisie ?', paths: [
    { title: 'Ma voiture personnelle', text: 'Séjour temporaire, installation ou retour définitif : le régime et les conditions changent selon votre statut. Préparez carte grise, justificatif de propriété et pièces d’identité. L’âge autorisé dépend du dispositif.', href: 'https://www.douane.gov.tn/admission-temporaire/', link: 'Véhicule : règles officielles' },
    { title: 'Mes meubles et effets personnels', text: 'Dressez un inventaire avec quantités et valeurs. Les effets personnels, un déménagement et des biens à caractère commercial n’obéissent pas aux mêmes règles.', href: 'https://www.douane.gov.tn/declaration-des-effets-personnels/', link: 'Préparer la déclaration des effets' },
    { title: 'Mon matériel professionnel', text: 'Décrivez l’usage, la quantité, l’origine et la valeur de chaque équipement ; demandez à la Douane si une autorisation, une taxation ou un régime spécifique s’applique.', href: 'https://www.douane.gov.tn/particuliers-2/', link: 'Contacter les services douaniers' }
  ], caution: 'Ne commandez pas de transport ou de véhicule sur la seule base de cette rubrique. Âges limites, franchises, délais et justificatifs varient et peuvent évoluer : demandez confirmation écrite aux services compétents.' },
  ar: { title: 'ماذا تريد أن تجلب معك إلى تونس؟', paths: [
    { title: 'سيارتي الشخصية', text: 'تختلف الشروط حسب الإقامة المؤقتة أو الانتقال أو العودة النهائية. حضّر البطاقة الرمادية ووثيقة الملكية والهوية، وتحقق من عمر السيارة المسموح.', href: 'https://www.douane.gov.tn/admission-temporaire/', link: 'القواعد الرسمية للسيارات' },
    { title: 'الأثاث والأغراض الشخصية', text: 'حضّر قائمة مفصلة بالأغراض والكميات والقيم. تختلف الإجراءات بين الأمتعة الشخصية وأثاث الانتقال والبضائع التجارية.', href: 'https://www.douane.gov.tn/declaration-des-effets-personnels/', link: 'التصريح المسبق بالأغراض' },
    { title: 'المعدات المهنية', text: 'حدد نوع المعدات واستعمالها وقيمتها واسأل الديوانة عن التراخيص والمعاليم والنظام المناسب.', href: 'https://www.douane.gov.tn/particuliers-2/', link: 'الخدمات الديوانية الرسمية' }
  ], caution: 'تختلف الشروط والإعفاءات والآجال حسب وضعيتك وقد تتغير. تأكد من الديوانة قبل الشراء أو الشحن.' },
  en: { title: 'What are you bringing into Tunisia?', paths: [
    { title: 'My own car', text: 'Temporary stay, relocation and permanent return can follow different rules. Prepare the registration certificate, proof of ownership and ID; check age limits for your specific status.', href: 'https://www.douane.gov.tn/admission-temporaire/', link: 'Official vehicle rules' },
    { title: 'Furniture and personal belongings', text: 'Prepare an itemized inventory with quantities and values. Personal luggage, household removals and commercial goods have different rules.', href: 'https://www.douane.gov.tn/declaration-des-effets-personnels/', link: 'Prepare a belongings declaration' },
    { title: 'Professional equipment', text: 'List what each item is used for, its value and origin; ask customs about permits, taxes and the appropriate import regime.', href: 'https://www.douane.gov.tn/particuliers-2/', link: 'Official customs services' }
  ], caution: 'Rules, vehicle age limits, exemptions and deadlines vary and may change. Confirm with customs before buying or shipping.' },
  it: { title: 'Che cosa vuoi portare in Tunisia?', paths: [
    { title: 'La mia automobile', text: 'Soggiorno temporaneo, trasferimento e ritorno definitivo hanno regole diverse. Prepara libretto, prova di proprietà e documenti; verifica i limiti di età.', href: 'https://www.douane.gov.tn/admission-temporaire/', link: 'Regole ufficiali per i veicoli' },
    { title: 'Mobili ed effetti personali', text: 'Prepara un inventario con quantità e valori. Bagagli personali, trasloco e merci commerciali seguono procedure diverse.', href: 'https://www.douane.gov.tn/declaration-des-effets-personnels/', link: 'Preparare la dichiarazione' },
    { title: 'Attrezzature professionali', text: 'Indica uso, origine e valore degli strumenti e verifica permessi e imposte con la dogana.', href: 'https://www.douane.gov.tn/particuliers-2/', link: 'Servizi doganali ufficiali' }
  ], caution: 'Norme, età dei veicoli, franchigie e scadenze possono cambiare. Chiedi conferma alla dogana prima di acquistare o spedire.' },
  ru: { title: 'Что вы планируете ввезти в Тунис?', paths: [
    { title: 'Личный автомобиль', text: 'Временный приезд, переезд и окончательное возвращение регулируются по-разному. Подготовьте документы на автомобиль, подтверждение собственности и удостоверение личности.', href: 'https://www.douane.gov.tn/admission-temporaire/', link: 'Официальные правила для автомобилей' },
    { title: 'Мебель и личные вещи', text: 'Составьте опись с количеством и стоимостью. Багаж, имущество при переезде и коммерческие товары регулируются по-разному.', href: 'https://www.douane.gov.tn/declaration-des-effets-personnels/', link: 'Декларация личных вещей' },
    { title: 'Профессиональное оборудование', text: 'Уточните назначение, происхождение и стоимость оборудования, а также разрешения и пошлины в таможне.', href: 'https://www.douane.gov.tn/particuliers-2/', link: 'Официальные таможенные сервисы' }
  ], caution: 'Правила, возрастные ограничения, льготы и сроки могут меняться. Уточняйте их в таможне до покупки или отправки.' }
};

const schoolWorkGuides: Record<PublicLanguage, { schoolTitle: string; schoolSteps: string[]; schoolNote: string; workTitle: string; workSteps: string[]; workNote: string; registerLink: string; apiLink: string }> = {
  fr: { schoolTitle: 'Préparer une inscription scolaire', schoolSteps: ['Choisissez le système : public tunisien, privé, international ou français, puis identifiez les écoles de la région.', 'Demandez directement les conditions d’admission, la disponibilité des places et le calendrier.', 'Préparez les bulletins scolaires, pièces d’identité et autres justificatifs demandés, avec traductions ou équivalences si nécessaires.'], schoolNote: 'Les documents et priorités d’admission varient selon l’établissement et le niveau : obtenez sa liste actualisée avant tout déménagement.', workTitle: 'Travailler ou créer son activité', workSteps: ['Distinguez emploi salarié, activité indépendante et création de société ; les règles dépendent notamment de votre nationalité et de votre statut.', 'Pour créer une activité, vérifiez les autorisations éventuelles, la déclaration d’existence fiscale et l’immatriculation au RNE.', 'Préparez le type d’activité, une adresse/domiciliation et les justificatifs demandés ; confirmez le régime social et fiscal avant de démarrer.'], workNote: 'Conditions d’emploi des étrangers, autorisations, formalités et tarifs peuvent changer : vérifiez auprès des autorités compétentes.', registerLink: 'Formalités du registre des entreprises', apiLink: 'Guichet unique pour créer une entreprise' },
  ar: { schoolTitle: 'الاستعداد للتسجيل المدرسي', schoolSteps: ['اختر نوع التعليم: العمومي أو الخاص أو الدولي أو الفرنسي، وابحث عن المدارس القريبة.', 'اسأل المؤسسة عن شروط القبول والأماكن المتوفرة ومواعيد التسجيل.', 'حضّر الكشوف المدرسية ووثائق الهوية وما تطلبه المؤسسة من ترجمات أو معادلات.'], schoolNote: 'تختلف الوثائق ومواعيد التسجيل حسب المؤسسة والمستوى. تأكد من القائمة الحديثة قبل الانتقال.', workTitle: 'العمل أو إنشاء مشروع', workSteps: ['حدّد هل تريد العمل بأجر أو نشاطاً فردياً أو تأسيس شركة، وتحقق من شروط إقامتك وجنسيتك.', 'عند إنشاء مشروع تحقق من التراخيص والتصريح بالوجود الجبائي والتسجيل بالسجل الوطني للمؤسسات.', 'حضّر وصف النشاط والعنوان والوثائق المطلوبة، واسأل عن الالتزامات الجبائية والاجتماعية.'], workNote: 'قد تتغير شروط عمل الأجانب والتراخيص والإجراءات والمعاليم. تأكد لدى الإدارات المعنية.', registerLink: 'إجراءات السجل الوطني للمؤسسات', apiLink: 'الشباك الموحد لإنشاء مؤسسة' },
  en: { schoolTitle: 'Prepare a school enrolment', schoolSteps: ['Choose a public, private, international or French curriculum and identify schools in your area.', 'Ask the school about eligibility, available places, enrolment dates and fees.', 'Prepare school reports, identity documents and any translations or equivalency documents the school requests.'], schoolNote: 'Requirements vary by school and grade. Get an up-to-date checklist directly from the school before moving.', workTitle: 'Work or set up a business', workSteps: ['Distinguish employment, self-employment and company formation; your nationality and residence status matter.', 'Check business permits, tax registration and registration with Tunisia’s National Business Register (RNE).', 'Prepare a business activity description, address and supporting documents; confirm tax and social-security rules first.'], workNote: 'Work permits, eligibility, procedures and fees may change. Confirm with the relevant authorities.', registerLink: 'Business-register procedures', apiLink: 'Business creation one-stop shop' },
  it: { schoolTitle: 'Preparare l’iscrizione scolastica', schoolSteps: ['Scegli tra scuola pubblica, privata, internazionale o francese e cerca gli istituti nella tua zona.', 'Chiedi requisiti, posti disponibili, scadenze e costi direttamente alla scuola.', 'Prepara pagelle, documenti di identità ed eventuali traduzioni o equipollenze richieste.'], schoolNote: 'I requisiti variano in base alla scuola e alla classe: richiedi l’elenco aggiornato prima del trasferimento.', workTitle: 'Lavorare o avviare un’attività', workSteps: ['Distingui lavoro dipendente, autonomo e costituzione di società: contano nazionalità e residenza.', 'Verifica autorizzazioni, dichiarazione fiscale di inizio attività e iscrizione al registro RNE.', 'Prepara descrizione dell’attività, indirizzo e documenti, verificando regime fiscale e previdenziale.'], workNote: 'Permessi, procedure e costi possono cambiare. Verifica con le autorità competenti.', registerLink: 'Procedure del registro imprese', apiLink: 'Sportello unico per le imprese' },
  ru: { schoolTitle: 'Подготовка к поступлению в школу', schoolSteps: ['Выберите государственную, частную, международную или французскую школу и найдите варианты рядом.', 'Уточните в школе условия приема, наличие мест, сроки и стоимость.', 'Подготовьте табели, удостоверения личности и необходимые переводы или подтверждение эквивалентности.'], schoolNote: 'Требования зависят от школы и класса. Перед переездом запросите актуальный перечень документов.', workTitle: 'Работа или открытие бизнеса', workSteps: ['Различайте работу по найму, самозанятость и создание компании: важны гражданство и статус пребывания.', 'Проверьте разрешения, постановку на налоговый учет и регистрацию в реестре предприятий RNE.', 'Подготовьте описание деятельности, адрес и необходимые документы; уточните налоговые и социальные обязательства.'], workNote: 'Разрешения на работу, процедуры и сборы могут изменяться. Уточняйте в компетентных органах.', registerLink: 'Регистрация предприятия в RNE', apiLink: 'Единое окно создания бизнеса' }
};

const dailySituations: Record<PublicLanguage, { title: string; choices: { title: string; detail: string }[] }> = {
 fr: { title: 'Quel besoin au quotidien ?', choices: [{ title: 'Eau et électricité', detail: 'Demandez au fournisseur les pièces nécessaires, les conditions d’ouverture et les délais de raccordement à votre adresse.' }, { title: 'Téléphone et Internet', detail: 'Vérifiez la couverture à votre adresse, les conditions d’abonnement, les frais et les justificatifs demandés.' }, { title: 'Transports et services de proximité', detail: 'Repérez les transports, pharmacies, commerces et administrations utiles selon votre quartier et vos horaires.' }] },
 ar: { title: 'ما هي حاجتك اليومية؟', choices: [{ title: 'الماء والكهرباء', detail: 'اسأل المزوّد عن الوثائق وشروط فتح الاشتراك وآجال الربط بالعنوان.' }, { title: 'الهاتف والإنترنت', detail: 'تحقق من التغطية وشروط الاشتراك والمصاريف والوثائق المطلوبة.' }, { title: 'النقل والخدمات القريبة', detail: 'حدد وسائل النقل والصيدليات والمحلات والإدارات القريبة حسب الحي والتوقيت.' }] },
 en: { title: 'What do you need day to day?', choices: [{ title: 'Water and electricity', detail: 'Ask providers about documents, account opening and connection timing for your address.' }, { title: 'Phone and Internet', detail: 'Check network coverage, contract conditions, fees and required identification.' }, { title: 'Transport and nearby services', detail: 'Locate local transport, pharmacies, shops and public services, checking their hours.' }] },
 it: { title: 'Di che cosa hai bisogno?', choices: [{ title: 'Acqua ed elettricità', detail: 'Chiedi ai fornitori documenti, condizioni e tempi di attivazione al tuo indirizzo.' }, { title: 'Telefono e Internet', detail: 'Verifica copertura, contratto, costi e documenti richiesti.' }, { title: 'Trasporti e servizi vicini', detail: 'Individua trasporti, farmacie, negozi e uffici nella zona, controllando gli orari.' }] },
 ru: { title: 'Что необходимо в повседневной жизни?', choices: [{ title: 'Вода и электричество', detail: 'Уточните у поставщика документы, условия подключения и сроки для вашего адреса.' }, { title: 'Телефон и Интернет', detail: 'Проверьте покрытие, условия договора, стоимость и необходимые документы.' }, { title: 'Транспорт и услуги рядом', detail: 'Найдите транспорт, аптеки, магазины и учреждения поблизости и проверьте часы работы.' }] }
};

const serviceSituationGuides: Record<PublicLanguage, { healthTitle: string; health: {title:string;text:string}[]; educationTitle:string; education:{title:string;text:string}[]; workTitle:string; work:{title:string;text:string}[] }> = {
fr:{healthTitle:'Quelle est votre situation ?',health:[{title:'Soins courants',text:'Repérez un médecin, une pharmacie et un établissement de soins proches ; demandez les modalités de rendez-vous et de paiement.'},{title:'Assurance et remboursements',text:'Vérifiez auprès de votre organisme les garanties en Tunisie, exclusions, avances de frais et justificatifs de remboursement.'},{title:'Traitement régulier',text:'Préparez vos ordonnances et vérifiez avec un professionnel la disponibilité et les conditions de transport de vos médicaments.'}],educationTitle:'Quel parcours scolaire ?',education:[{title:'École publique',text:'Demandez les conditions d’admission et les documents à l’établissement ou à l’autorité scolaire locale compétente.'},{title:'École privée ou internationale',text:'Comparez programme, langues, frais, transport et reconnaissance du cursus ; confirmez les places disponibles.'},{title:'Études supérieures',text:'Vérifiez les conditions d’admission, les équivalences éventuelles et le calendrier auprès de l’établissement.'}],workTitle:'Quel est votre projet professionnel ?',work:[{title:'Chercher un emploi',text:'Préparez CV et justificatifs de qualification ; vérifiez les conditions d’exercice applicables à votre nationalité.'},{title:'Activité indépendante',text:'Vérifiez les autorisations éventuelles, la déclaration fiscale et les obligations sociales avant de démarrer.'},{title:'Créer une société',text:'Précisez la forme juridique et l’activité, puis vérifiez immatriculation, fiscalité et autorisations requises.'}]},
ar:{healthTitle:'ما هي وضعيتك؟',health:[{title:'علاج يومي',text:'حدد طبيباً وصيدلية ومؤسسة صحية قريبة واسأل عن المواعيد والدفع.'},{title:'تأمين واسترجاع المصاريف',text:'تحقق من التغطية والاستثناءات والتسبقة والوثائق المطلوبة للاسترجاع.'},{title:'علاج مستمر',text:'احتفظ بالوصفات وتحقق مع المختص من توفر الأدوية وشروط نقلها.'}],educationTitle:'ما هو المسار الدراسي؟',education:[{title:'تعليم عمومي',text:'اسأل المؤسسة أو الإدارة المختصة عن شروط القبول والوثائق.'},{title:'تعليم خاص أو دولي',text:'قارن البرامج واللغات والمصاريف والنقل والاعتراف بالدراسة والأماكن.'},{title:'تعليم عال',text:'تحقق من القبول والمعادلات المحتملة والآجال لدى المؤسسة.'}],workTitle:'ما هو مشروعك المهني؟',work:[{title:'البحث عن عمل',text:'جهّز السيرة الذاتية والشهادات وتحقق من شروط العمل حسب جنسيتك.'},{title:'نشاط فردي',text:'تحقق من التراخيص والتصريح الجبائي والالتزامات الاجتماعية.'},{title:'تأسيس شركة',text:'حدد النشاط والشكل القانوني وتحقق من التسجيل والجباية والتراخيص.'}]},
en:{healthTitle:'What is your situation?',health:[{title:'Routine care',text:'Find a nearby doctor, pharmacy and care facility; check appointments and payment.'},{title:'Insurance and refunds',text:'Confirm coverage in Tunisia, exclusions, upfront charges and reimbursement documents with your provider.'},{title:'Ongoing treatment',text:'Keep prescriptions and ask a clinician about medicine availability and transport rules.'}],educationTitle:'Which education path?',education:[{title:'Public school',text:'Ask the school or local education authority about admission criteria and required documents.'},{title:'Private or international school',text:'Compare curriculum, languages, fees, transport, recognition and available places.'},{title:'Higher education',text:'Check admission criteria, equivalency requirements and deadlines with the institution.'}],workTitle:'What is your work plan?',work:[{title:'Find employment',text:'Prepare your CV and qualifications; check work eligibility for your nationality.'},{title:'Self-employment',text:'Check permits, tax registration and social obligations before starting.'},{title:'Set up a company',text:'Define the activity and company form; verify registration, taxation and required permits.'}]},
it:{healthTitle:'Qual è la tua situazione?',health:[{title:'Cure ordinarie',text:'Trova medico, farmacia e struttura sanitaria vicini; chiedi modalità di visita e pagamento.'},{title:'Assicurazione e rimborsi',text:'Verifica copertura, esclusioni, anticipi e documenti per il rimborso.'},{title:'Cure continuative',text:'Conserva le ricette e verifica disponibilità e trasporto dei farmaci con un medico.'}],educationTitle:'Quale percorso di studio?',education:[{title:'Scuola pubblica',text:'Chiedi criteri di ammissione e documenti alla scuola o autorità competente.'},{title:'Scuola privata o internazionale',text:'Confronta programmi, lingue, costi, trasporto, riconoscimento e posti disponibili.'},{title:'Università',text:'Verifica ammissione, equivalenze e scadenze con l’istituto.'}],workTitle:'Quale progetto professionale?',work:[{title:'Cercare lavoro',text:'Prepara CV e qualifiche e verifica i requisiti secondo la nazionalità.'},{title:'Lavoro autonomo',text:'Verifica permessi, registrazione fiscale e obblighi sociali.'},{title:'Creare una società',text:'Definisci attività e forma societaria; verifica iscrizione, imposte e autorizzazioni.'}]},
ru:{healthTitle:'Какова ваша ситуация?',health:[{title:'Обычная медицинская помощь',text:'Найдите врача, аптеку и медучреждение рядом; уточните запись и оплату.'},{title:'Страховка и возмещение',text:'Уточните покрытие в Тунисе, исключения, предоплату и документы для компенсации.'},{title:'Постоянное лечение',text:'Сохраните рецепты и уточните у врача наличие и перевозку лекарств.'}],educationTitle:'Какой вид образования?',education:[{title:'Государственная школа',text:'Уточните условия приема и документы в школе или местном органе образования.'},{title:'Частная или международная школа',text:'Сравните программу, языки, стоимость, транспорт, признание и наличие мест.'},{title:'Высшее образование',text:'Проверьте прием, признание документов и сроки в учебном заведении.'}],workTitle:'Какой профессиональный план?',work:[{title:'Поиск работы',text:'Подготовьте резюме и подтверждение квалификации; проверьте право на работу.'},{title:'Самостоятельная деятельность',text:'Уточните разрешения, налоговую регистрацию и социальные обязательства.'},{title:'Создание компании',text:'Определите сферу и форму компании; уточните регистрацию, налоги и разрешения.'}]}
};

const housingBankProfiles: Record<PublicLanguage, { housingTitle: string; housing: { title: string; text: string }[]; bankTitle: string; bank: { title: string; text: string }[] }> = {
 fr: { housingTitle: 'Quel est votre projet ?', housing: [{title:'Louer un logement',text:'Comparez le loyer, les charges, la durée du bail et les garanties. Vérifiez le bien et le propriétaire avant tout versement.'},{title:'Acheter un bien',text:'Faites vérifier le titre de propriété, les inscriptions et les autorisations éventuellement requises selon votre nationalité et le type de bien, avec un professionnel indépendant.'},{title:'Déménager ses affaires',text:'Préparez un inventaire précis, plusieurs devis et les documents nécessaires au transport et au passage en douane.'}],bankTitle:'Quelle opération préparez-vous ?',bank:[{title:'Ouvrir un compte',text:'Renseignez-vous sur les types de comptes accessibles à votre statut et sur les justificatifs exigés par la banque.'},{title:'Recevoir ou transférer des fonds',text:'Demandez les frais, délais, justificatifs de provenance et règles de change applicables avant le transfert.'},{title:'Financer un achat immobilier',text:'Vérifiez les conditions de financement et de transfert selon votre statut, ainsi que les justificatifs nécessaires à l’opération.'}]},
 ar: { housingTitle:'ما هو مشروعك؟',housing:[{title:'كراء مسكن',text:'قارن معلوم الكراء والمصاريف ومدة العقد والضمانات، وتحقق من المسكن والمالك قبل الدفع.'},{title:'شراء عقار',text:'اطلب التثبت من سند الملكية والترسيمات والتراخيص المحتملة حسب الجنسية ونوع العقار لدى مختص مستقل.'},{title:'نقل الأثاث',text:'حضّر قائمة مفصلة بالأغراض وعروض أسعار ووثائق النقل والديوانة.'}],bankTitle:'ما هي العملية البنكية؟',bank:[{title:'فتح حساب',text:'اسأل عن أنواع الحسابات حسب وضعيتك والوثائق المطلوبة.'},{title:'تحويل الأموال',text:'تثبت من المصاريف والآجال وإثبات مصدر الأموال وقواعد الصرف.'},{title:'تمويل شراء عقار',text:'تحقق من شروط التمويل والتحويل حسب وضعيتك والوثائق اللازمة.'}]},
 en: { housingTitle:'What is your housing plan?',housing:[{title:'Rent a home',text:'Compare rent, charges, lease duration and guarantees. Verify the property and landlord before paying.'},{title:'Buy property',text:'Have an independent professional verify ownership title, registrations and any authorisations required for your nationality and property type.'},{title:'Move belongings',text:'Prepare an itemised inventory, written quotes and transport or customs documents.'}],bankTitle:'What banking task?',bank:[{title:'Open an account',text:'Ask which account types are available for your status and what evidence the bank requires.'},{title:'Transfer money',text:'Check fees, timing, source-of-funds documents and exchange-control rules before sending funds.'},{title:'Finance a property',text:'Verify financing and transfer requirements for your status and supporting transaction documents.'}]},
 it: { housingTitle:'Qual è il tuo progetto?',housing:[{title:'Affittare casa',text:'Confronta canone, spese, durata e garanzie. Verifica immobile e proprietario prima di pagare.'},{title:'Comprare un immobile',text:'Chiedi a un professionista indipendente di verificare titolo, registrazioni e autorizzazioni eventualmente richieste.'},{title:'Traslocare',text:'Prepara inventario, preventivi scritti e documenti per trasporto e dogana.'}],bankTitle:'Quale operazione bancaria?',bank:[{title:'Aprire un conto',text:'Chiedi quali conti siano disponibili per il tuo status e quali documenti servano.'},{title:'Trasferire fondi',text:'Verifica costi, tempi, prova di provenienza e norme valutarie applicabili.'},{title:'Finanziare un acquisto',text:'Verifica condizioni di credito, trasferimento e documenti della transazione.'}]},
 ru: { housingTitle:'Какая у вас цель?',housing:[{title:'Арендовать жильё',text:'Сравните аренду, расходы, срок договора и гарантии. Проверьте жильё и собственника до оплаты.'},{title:'Купить недвижимость',text:'Поручите независимому специалисту проверить право собственности, записи и необходимые разрешения.'},{title:'Перевезти вещи',text:'Подготовьте опись, письменные расчёты и транспортные или таможенные документы.'}],bankTitle:'Какая банковская операция?',bank:[{title:'Открыть счёт',text:'Уточните доступные типы счетов для вашего статуса и необходимые документы.'},{title:'Перевести деньги',text:'Проверьте комиссии, сроки, подтверждение источника средств и валютные правила.'},{title:'Оплатить недвижимость',text:'Уточните условия финансирования, переводов и документы для сделки.'}]}
};

const residenceProfiles: Record<PublicLanguage, { label: string; profiles: string[]; details: string[] }> = {
  fr: { label: 'Selon votre situation', profiles: ['Retraite', 'Emploi salarié', 'Entreprise', 'Famille', 'Tunisien vivant à l’étranger'], details: ['Demandez quels justificatifs de pension, ressources et couverture santé sont requis pour votre statut.', 'Vérifiez séparément les règles de séjour et l’autorisation éventuelle d’exercer un emploi.', 'Vérifiez le séjour du dirigeant et les formalités de création ou d’exercice de l’activité.', 'Vérifiez les justificatifs de lien familial et les conditions applicables à chaque membre.', 'Renseignez-vous sur les démarches de retour et les dispositifs propres aux Tunisiens résidant à l’étranger.'] },
  ar: { label: 'حسب وضعيتك', profiles: ['متقاعد', 'عمل بأجر', 'مشروع', 'عائلة', 'تونسي مقيم بالخارج'], details: ['اسأل عن إثبات الجراية والموارد والتغطية الصحية حسب وضعيتك.', 'تأكد من شروط الإقامة ومن الترخيص المحتمل للعمل بشكل منفصل.', 'تحقق من إقامة صاحب المشروع وإجراءات بعث النشاط.', 'تحقق من وثائق القرابة والشروط الخاصة بكل فرد من العائلة.', 'اسأل عن إجراءات العودة والأنظمة الخاصة بالتونسيين المقيمين بالخارج.'] },
  en: { label: 'Depending on your situation', profiles: ['Retired', 'Employee', 'Business owner', 'Family', 'Tunisian abroad'], details: ['Ask what pension, funds and health cover evidence is required for your status.', 'Check residence requirements separately from any permission needed to work.', 'Check both the business owner’s residence status and business registration requirements.', 'Ask about proof of family ties and the rules for each family member.', 'Check return procedures and schemes specifically for Tunisians living abroad.'] },
  it: { label: 'Secondo la tua situazione', profiles: ['Pensionato', 'Dipendente', 'Imprenditore', 'Famiglia', 'Tunisino all’estero'], details: ['Chiedi quali prove di pensione, risorse e copertura sanitaria servono.', 'Verifica separatamente soggiorno ed eventuale autorizzazione al lavoro.', 'Verifica soggiorno del titolare e formalità per avviare l’attività.', 'Informati su documenti familiari e requisiti di ciascun componente.', 'Verifica procedure di rientro e regimi per i tunisini residenti all’estero.'] },
  ru: { label: 'В зависимости от ситуации', profiles: ['Пенсионер', 'Работник', 'Предприниматель', 'Семья', 'Тунисец за рубежом'], details: ['Уточните требования к подтверждению пенсии, средств и медицинского страхования.', 'Проверьте отдельно условия проживания и разрешение на работу, если требуется.', 'Уточните статус проживания владельца и порядок регистрации бизнеса.', 'Уточните документы о родстве и условия для каждого члена семьи.', 'Проверьте правила возвращения и программы для тунисцев, живущих за рубежом.'] }
};

const residenceGuide: Record<PublicLanguage, { title: string; steps: string[]; caution: string }> = {
  fr: { title: 'Préparer votre séjour selon votre situation', steps: ['Avant de partir : vérifiez auprès du consulat tunisien les conditions d’entrée et de visa selon votre nationalité et la durée prévue.', 'Pour un séjour prolongé : renseignez-vous sur le titre de séjour et les pièces requises selon votre motif (retraite, emploi, études, regroupement familial ou activité).', 'Préparez un passeport valide, les justificatifs d’hébergement et de ressources ainsi que les documents propres à votre situation, uniquement selon la liste communiquée par les autorités.', 'Avant l’échéance : vérifiez les délais de dépôt, les renouvellements et les démarches auprès des autorités locales compétentes.'], caution: 'Aucune durée de séjour ni liste de pièces n’est universelle. Les règles dépendent notamment de la nationalité, du statut et du motif du séjour ; confirmez-les avant le départ.' },
  ar: { title: 'حضّر إقامتك حسب وضعيتك', steps: ['قبل السفر، تحقّق من شروط الدخول والتأشيرة حسب الجنسية والمدة لدى القنصلية التونسية.', 'للإقامة الطويلة، اطلب شروط بطاقة الإقامة حسب سبب الإقامة: تقاعد أو عمل أو دراسة أو عائلة أو نشاط.', 'حضّر جواز السفر وإثبات السكن والموارد والوثائق المطلوبة وفق القائمة الرسمية.', 'تحقّق من آجال إيداع الملف وتجديد الإقامة لدى السلطات المختصة.'], caution: 'لا توجد مدة أو قائمة وثائق موحّدة للجميع. تختلف الإجراءات حسب الجنسية والوضعية والغرض من الإقامة.' },
  en: { title: 'Plan your stay according to your status', steps: ['Before travelling, check entry and visa requirements with a Tunisian consulate for your nationality and intended stay.', 'For longer stays, ask which residence permit applies to your purpose: retirement, employment, studies, family or business.', 'Prepare your passport, proof of accommodation and means of support, plus only the documents confirmed by the responsible authority.', 'Check application deadlines, renewals and local procedures well before your permission expires.'], caution: 'There is no universal permitted stay or document list. Requirements vary by nationality, status and reason for staying; verify before travel.' },
  it: { title: 'Prepara il soggiorno in base alla tua situazione', steps: ['Prima di partire, verifica con il consolato tunisino ingresso e visto in base a nazionalità e durata.', 'Per soggiorni lunghi, chiedi quale permesso sia richiesto per pensione, lavoro, studio, famiglia o attività.', 'Prepara passaporto, alloggio, risorse economiche e i documenti indicati dall’autorità competente.', 'Controlla scadenze, rinnovi e procedure locali in anticipo.'], caution: 'Non esiste una durata né un elenco di documenti valido per tutti: verifica le regole secondo nazionalità e motivo del soggiorno.' },
  ru: { title: 'Подготовьте пребывание с учетом вашего статуса', steps: ['До поездки уточните в консульстве Туниса правила въезда и визы для вашего гражданства и срока пребывания.', 'Для длительного проживания выясните условия ВНЖ для пенсионеров, работников, студентов, семьи или предпринимателей.', 'Подготовьте паспорт, подтверждение жилья и средств, а также документы по официальному списку.', 'Заранее уточните сроки подачи и продления разрешения.'], caution: 'Единого срока пребывания и списка документов для всех нет: правила зависят от гражданства, статуса и цели поездки.' }
};

const everydayGuides: Record<PublicLanguage, { housing: string[]; health: string[]; daily: string[]; caution: string }> = {
 fr: { housing: ['Définissez votre budget, votre ville et le type de logement avant de contacter une agence.', 'Avant de verser une somme, faites confirmer l’identité du bailleur, les conditions du bail, les charges et l’état du logement.', 'Pour déménager : demandez un devis écrit, l’inventaire, les conditions d’assurance et les éventuelles formalités douanières.'], health: ['Repérez à proximité un médecin, une pharmacie et un établissement de soins avant votre installation.', 'Demandez à votre assureur ou organisme de couverture les conditions de prise en charge en Tunisie, les exclusions et les justificatifs.', 'Conservez ordonnances et dossier médical utiles ; vérifiez avec un professionnel de santé les traitements et vaccinations nécessaires.'], daily: ['Vérifiez la disponibilité de l’eau, de l’électricité et d’Internet à votre future adresse avant de signer.', 'Demandez quels documents sont nécessaires pour un abonnement téléphonique et pour les contrats de services.', 'Repérez les commerces, transports, pharmacies et services administratifs de votre quartier.'], caution: 'Ces repères sont indicatifs : contrats, documents et conditions peuvent varier selon l’établissement et évoluer.' },
 ar: { housing: ['حدد الميزانية والمدينة ونوع السكن قبل الاتصال بوكالة عقارية.', 'قبل دفع أي مبلغ، تحقق من هوية المالك وشروط العقد والمصاريف وحالة السكن.', 'قبل الانتقال اطلب عرض سعر مكتوباً وقائمة الأثاث وشروط التأمين والإجراءات الديوانية عند اللزوم.'], health: ['حدد طبيباً وصيدلية ومؤسسة صحية قرب مكان الإقامة.', 'اسأل شركة التأمين أو الجهة المعنية عن التغطية في تونس والاستثناءات والوثائق.', 'احتفظ بالوصفات والملف الطبي واستشر مختصاً بشأن العلاج والتلاقيح عند الحاجة.'], daily: ['تحقق من الماء والكهرباء والإنترنت في عنوان السكن قبل التوقيع.', 'اسأل عن الوثائق المطلوبة للهاتف وعقود الخدمات.', 'حدد المتاجر والنقل والصيدليات والإدارات القريبة.'], caution: 'هذه معلومات إرشادية وقد تختلف الشروط والوثائق وتتغير؛ تأكد لدى الجهات المعنية.' },
 en: { housing: ['Choose your budget, area and housing type before contacting an agent.', 'Before paying, verify the landlord, lease terms, charges and property condition.', 'For moving, request a written quote, inventory, insurance details and any applicable customs requirements.'], health: ['Identify a nearby doctor, pharmacy and healthcare facility before moving.', 'Ask your insurer or health scheme about coverage in Tunisia, exclusions and documents required.', 'Keep useful prescriptions and medical records and ask a clinician about treatments or vaccinations when relevant.'], daily: ['Check water, electricity and Internet availability at the address before signing.', 'Ask providers which documents are required for phone and utility contracts.', 'Locate shops, transport, pharmacies and administrative services in your neighbourhood.'], caution: 'Requirements vary by provider and may change. Confirm details directly before committing.' },
 it: { housing: ['Definisci budget, città e tipo di alloggio prima di contattare un’agenzia.', 'Prima di pagare, verifica proprietario, condizioni del contratto, spese e stato dell’immobile.', 'Per il trasloco richiedi preventivo scritto, inventario, assicurazione ed eventuali formalità doganali.'], health: ['Individua medico, farmacia e struttura sanitaria vicini prima del trasferimento.', 'Chiedi all’assicurazione copertura in Tunisia, esclusioni e documenti necessari.', 'Conserva ricette e cartelle cliniche e consulta un medico per cure e vaccinazioni pertinenti.'], daily: ['Verifica acqua, elettricità e Internet all’indirizzo prima di firmare.', 'Chiedi i documenti per telefono e contratti delle utenze.', 'Individua negozi, trasporti, farmacie e uffici pubblici nella zona.'], caution: 'Condizioni e documenti possono variare o cambiare: chiedi conferma agli enti competenti.' },
 ru: { housing: ['Определите бюджет, город и тип жилья до обращения в агентство.', 'До оплаты проверьте арендодателя, договор, дополнительные расходы и состояние жилья.', 'Для переезда запросите письменную смету, опись вещей, условия страхования и таможенные требования.'], health: ['Найдите поблизости врача, аптеку и медицинское учреждение до переезда.', 'Уточните у страховщика покрытие в Тунисе, исключения и необходимые документы.', 'Сохраните рецепты и медицинские документы, проконсультируйтесь о лечении и прививках при необходимости.'], daily: ['До подписания договора проверьте доступность воды, электричества и Интернета.', 'Уточните документы для связи и коммунальных договоров.', 'Найдите магазины, транспорт, аптеки и административные службы поблизости.'], caution: 'Требования зависят от поставщика и могут меняться. Уточняйте актуальные условия.' }
};

const settlementPrep: Record<PublicLanguage, { heading: string; items: string[]; disclaimer: string }> = {
  fr: { heading: 'À préparer ou vérifier', items: ['Passeport et motif du séjour ; justificatif de logement et de ressources si exigés.', 'Budget, projet de bail, identité du bailleur et inventaire de déménagement.', 'Couverture santé, ordonnances utiles et coordonnées médicales locales.', 'Bulletins scolaires, identité de l’enfant et éventuelles traductions demandées.', 'Identité, statut de résidence et justificatifs d’origine des fonds selon l’opération.', 'Carte grise, preuve de propriété et inventaire détaillé des biens transportés.', 'Description de l’activité, adresse, situation de séjour et pièces d’immatriculation demandées.', 'Adresse précise, conditions des contrats d’eau, d’électricité et d’Internet.'], disclaimer: 'Liste indicative, non exhaustive : faites confirmer les pièces applicables à votre situation avant toute démarche.' },
  ar: { heading: 'وثائق ونقاط للتحضير', items: ['جواز السفر وسبب الإقامة وإثبات السكن والموارد عند الطلب.', 'الميزانية وعقد الكراء وهوية المالك وقائمة الأثاث.', 'التغطية الصحية والوصفات الطبية وأرقام المؤسسات الصحية.', 'الكشوف المدرسية وهوية الطفل والترجمات المطلوبة إن وجدت.', 'الهوية ووضعية الإقامة وإثبات مصدر الأموال حسب العملية.', 'البطاقة الرمادية وإثبات الملكية وقائمة الممتلكات المنقولة.', 'وصف النشاط والعنوان ووثائق التسجيل المطلوبة.', 'العنوان وشروط عقود الماء والكهرباء والإنترنت.'], disclaimer: 'قائمة إرشادية غير شاملة: تأكد من الوثائق اللازمة حسب وضعيتك قبل أي إجراء.' },
  en: { heading: 'Documents and checks to prepare', items: ['Passport, purpose of stay and accommodation or funds evidence if required.', 'Budget, draft lease, landlord identity and moving inventory.', 'Health coverage, useful prescriptions and local medical contacts.', 'School reports, child identity documents and translations if requested.', 'Identification, residence status and source-of-funds evidence as applicable.', 'Vehicle registration, proof of ownership and an inventory of transported goods.', 'Business activity description, address and required registration documents.', 'Exact address and conditions for water, power and Internet contracts.'], disclaimer: 'Illustrative, not exhaustive: confirm which documents apply to your circumstances.' },
  it: { heading: 'Documenti e verifiche da preparare', items: ['Passaporto, motivo del soggiorno e prove di alloggio o mezzi se richieste.', 'Budget, bozza del contratto, identità del locatore e inventario del trasloco.', 'Copertura sanitaria, ricette utili e contatti medici.', 'Pagelle, documenti del minore e traduzioni eventualmente richieste.', 'Identità, status di residenza e prova dell’origine dei fondi se applicabile.', 'Libretto dell’auto, prova di proprietà e inventario dei beni.', 'Descrizione dell’attività, indirizzo e documenti di registrazione richiesti.', 'Indirizzo e condizioni dei contratti di acqua, elettricità e Internet.'], disclaimer: 'Elenco indicativo e non esaustivo: verifica i requisiti del tuo caso.' },
  ru: { heading: 'Что подготовить и проверить', items: ['Паспорт, цель пребывания, подтверждение жилья и средств при необходимости.', 'Бюджет, проект договора аренды, данные арендодателя и опись вещей.', 'Медицинская страховка, рецепты и местные контакты врачей.', 'Школьные оценки, документы ребёнка и переводы при необходимости.', 'Документы личности, статус проживания и подтверждение источника средств.', 'Документы на автомобиль, право собственности и опись ввозимых вещей.', 'Описание деятельности, адрес и документы для регистрации компании.', 'Точный адрес и условия договоров на воду, электричество и Интернет.'], disclaimer: 'Примерный, неполный список: уточняйте требования для своей ситуации.' }
};

type JourneyMode = 'visit' | 'settle';

const journeyCopy: Record<PublicLanguage, {
  visitTab: string;
  settleTab: string;
  visitTitle: string;
  visitIntro: string;
  settleTitle: string;
  settleIntro: string;
  discover: string;
  official: string;
  bookletTitle: string;
  bookletText: string;
  visitTopics: Array<{ title: string; text: string; href: string }>;
  settleTopics: Array<{ title: string; text: string; href: string; external?: boolean }>;
}> = {
  fr: {
    visitTab: 'Visiter autrement', settleTab: "S’installer en Tunisie",
    visitTitle: 'La Tunisie hors des sentiers battus',
    visitIntro: 'Explorez les territoires, les savoir-faire et les expériences locales, au-delà des circuits les plus connus.',
    settleTitle: 'Préparer son installation en Tunisie',
    settleIntro: 'Des repères simples pour comprendre les démarches et trouver les bons services sur place.',
    discover: 'Découvrir', official: 'Source officielle',
    bookletTitle: 'Le livret pratique des expatriés',
    bookletText: 'Une version détaillée avec checklists, budgets et démarches pas à pas est en préparation.',
    visitTopics: [
      { title: 'Villages & patrimoine', text: 'Découvrir des lieux de caractère, des médinas, des villages et un patrimoine moins connu.', href: '/citizens/tourism/guide/villages-patrimoine' },
      { title: 'Nature & randonnées', text: 'Trouver des activités de plein air, des accompagnateurs et des excursions locales.', href: '/citizens/tourism/guide/nature-randonnees' },
      { title: 'Artisanat & savoir-faire', text: 'Rencontrer les artisans et découvrir les métiers, ateliers et créations des régions.', href: '/citizens/tourism/guide/artisanat-savoir-faire' },
      { title: 'Saveurs & marchés locaux', text: 'Explorer les produits, tables, marchés et spécialités qui font vivre les territoires.', href: '/citizens/tourism/guide/marches-gastronomie' },
      { title: 'Culture & événements', text: 'Repérer les fêtes, festivals, expositions et rendez-vous près de votre destination.', href: '/citizens/tourism/guide/fetes-evenements' },
      { title: 'Séjours & expériences locales', text: 'Trouver des hébergements, guides et activités pour construire un séjour plus personnel.', href: '/citizens/tourism/guide/hebergements-experiences' },
    ],
    settleTopics: [
      { title: 'Visa, séjour & résidence', text: 'Avant le départ : vérifier les exigences de visa selon votre nationalité auprès du consulat tunisien. Pour une installation durable : consulter les pièces de la carte de séjour (passeport, justificatif d’hébergement et documents liés au travail, aux études ou à la situation familiale). Les règles varient selon votre situation ; confirmer auprès des autorités.', href: 'https://services.interieur.gov.tn/wap/fr/docs/demarches/05.html', external: true },
      { title: 'Logement & déménagement', text: 'Avant de signer un bail : vérifier le quartier, le budget total, les charges, les conditions du contrat et les justificatifs demandés. Pour déménager, demander un devis détaillé et vérifier les formalités éventuelles de douane. Rechercher ensuite les professionnels locaux.', href: '/recherche?categorie=immobilier' },
      { title: 'Santé & assurance', text: 'Avant de partir, vérifier la couverture santé et l’assistance rapatriement selon votre situation, les exclusions, les plafonds et les modalités de remboursement. Préparer ordonnances et documents médicaux utiles ; rechercher ensuite médecins, cliniques et pharmacies sur la page Santé.', href: '/citizens/health' },
      { title: 'École & scolarité', text: 'Comparer les établissements et retrouver les informations scolaires essentielles.', href: '/education' },
      { title: 'Banque, change & fiscalité', text: 'Consulter les services financiers et vérifier les règles officielles applicables.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'Véhicule, biens & douane', text: 'Vérifier les formalités avant d’importer un véhicule ou vos effets personnels.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'Travail & création d’entreprise', text: 'Trouver des opportunités et les organismes utiles pour développer un projet.', href: 'https://investintunisia.tn/', external: true },
      { title: 'Vie quotidienne', text: 'Téléphone, Internet, commerces et services : retrouver les professionnels proches de vous.', href: '/citizens/shops' },
    ],
  },
  ar: {
    visitTab: 'اكتشف تونس بطريقة مختلفة', settleTab: 'الاستقرار في تونس',
    visitTitle: 'تونس خارج المسارات المعتادة', visitIntro: 'اكتشف الجهات والحرف والتجارب المحلية بعيداً عن المسارات الأكثر شهرة.',
    settleTitle: 'الاستعداد للاستقرار في تونس', settleIntro: 'معلومات مبسطة لفهم الإجراءات والعثور على الخدمات المناسبة.',
    discover: 'اكتشف', official: 'مصدر رسمي', bookletTitle: 'الدليل العملي للمقيمين الأجانب', bookletText: 'نسخة مفصلة تتضمن قوائم التحقق والميزانيات والإجراءات خطوة بخطوة قيد الإعداد.',
    visitTopics: [
      { title: 'القرى والتراث', text: 'اكتشف المدن العتيقة والقرى والمواقع ذات الطابع المحلي الأصيل.', href: '/citizens/tourism/guide/villages-patrimoine' },
      { title: 'الطبيعة والمشي', text: 'ابحث عن أنشطة في الطبيعة ورحلات ومرافقين محليين.', href: '/citizens/tourism/guide/nature-randonnees' },
      { title: 'الحرف والمعارف المحلية', text: 'تعرّف على الحرفيين والورشات وإبداعات مختلف الجهات.', href: '/citizens/tourism/guide/artisanat-savoir-faire' },
      { title: 'النكهات والأسواق المحلية', text: 'اكتشف المنتجات والمطاعم والأسواق والاختصاصات المحلية.', href: '/citizens/tourism/guide/marches-gastronomie' },
      { title: 'الثقافة والفعاليات', text: 'اعثر على المهرجانات والمعارض والمواعيد القريبة من وجهتك.', href: '/citizens/tourism/guide/fetes-evenements' },
      { title: 'إقامات وتجارب محلية', text: 'ابحث عن إقامة أو دليل أو نشاط لبناء رحلة أكثر خصوصية.', href: '/citizens/tourism/guide/hebergements-experiences' },
    ],
    settleTopics: [
      { title: 'التأشيرة والإقامة', text: 'تحقق من الشروط حسب جنسيتك ووضعيتك قبل السفر.', href: 'https://services.interieur.gov.tn/wap/fr/docs/demarches/05.html', external: true },
      { title: 'السكن والانتقال', text: 'قبل توقيع عقد الإيجار، تحقّق من الحيّ والتكلفة الإجمالية والمصاريف وشروط العقد والوثائق المطلوبة. اطلب عرض سعر مفصلاً للنقل وتحقّق من الإجراءات الجمركية عند الحاجة، ثم ابحث عن المهنيين المحليين.', href: '/recherche?categorie=immobilier' },
      { title: 'الصحة والتأمين', text: 'قبل السفر، تحقّق من التغطية الصحية والمساعدة على العودة إلى بلدك حسب وضعيتك، والاستثناءات وحدود التغطية وشروط استرجاع المصاريف. حضّر الوصفات والوثائق الطبية المهمة، ثم ابحث عن الأطباء والمصحات والصيدليات في صفحة الصحة.', href: '/citizens/health' },
      { title: 'المدرسة والتعليم', text: 'قارن المؤسسات واعثر على المعلومات المدرسية الأساسية.', href: '/education' },
      { title: 'البنك والصرف والجباية', text: 'اطلع على الخدمات المالية والقواعد الرسمية المعمول بها.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'السيارة والأمتعة والديوانة', text: 'تحقق من الإجراءات قبل توريد سيارة أو أمتعتك الشخصية.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'العمل وبعث مشروع', text: 'اعثر على الفرص والهياكل المفيدة لتطوير مشروعك.', href: 'https://investintunisia.tn/', external: true },
      { title: 'الحياة اليومية', text: 'الهاتف والإنترنت والمتاجر والخدمات القريبة منك.', href: '/citizens/shops' },
    ],
  },
  en: {
    visitTab: 'Visit differently', settleTab: 'Settle in Tunisia', visitTitle: 'Tunisia off the beaten track', visitIntro: 'Explore local places, skills and experiences beyond the best-known routes.',
    settleTitle: 'Prepare your move to Tunisia', settleIntro: 'Simple guidance to understand procedures and find the right local services.', discover: 'Discover', official: 'Official source',
    bookletTitle: 'The practical expatriate handbook', bookletText: 'A detailed version with checklists, budgets and step-by-step procedures is being prepared.',
    visitTopics: [
      { title: 'Villages & heritage', text: 'Discover characterful places, medinas, villages and lesser-known heritage.', href: '/citizens/tourism/guide/villages-patrimoine' },
      { title: 'Nature & hiking', text: 'Find outdoor activities, local guides and excursions.', href: '/citizens/tourism/guide/nature-randonnees' },
      { title: 'Crafts & local skills', text: 'Meet craftspeople and discover regional workshops and creations.', href: '/citizens/tourism/guide/artisanat-savoir-faire' },
      { title: 'Flavours & local markets', text: 'Explore local products, food, markets and regional specialities.', href: '/citizens/tourism/guide/marches-gastronomie' },
      { title: 'Culture & events', text: 'Find festivals, exhibitions and events near your destination.', href: '/citizens/tourism/guide/fetes-evenements' },
      { title: 'Local stays & experiences', text: 'Find accommodation, guides and activities for a more personal trip.', href: '/citizens/tourism/guide/hebergements-experiences' },
    ],
    settleTopics: [
      { title: 'Visa, stay & residence', text: 'Check the conditions for your nationality and situation before departure.', href: 'https://services.interieur.gov.tn/wap/fr/docs/demarches/05.html', external: true },
      { title: 'Housing & moving', text: 'Before signing a lease, check the area, total budget, fees, contract terms and required documents. Request a detailed moving quote and verify any customs requirements before searching for local providers.', href: '/recherche?categorie=immobilier' },
      { title: 'Health & insurance', text: 'Before moving, check your health coverage and medical repatriation assistance, including exclusions, limits and reimbursement rules. Keep prescriptions and key medical records handy, then find doctors, clinics and pharmacies on the Health page.', href: '/citizens/health' },
      { title: 'School & education', text: 'Compare institutions and find essential school information.', href: '/education' },
      { title: 'Banking, exchange & tax', text: 'Find financial services and check the applicable official rules.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'Vehicle, belongings & customs', text: 'Check formalities before importing a vehicle or personal belongings.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'Work & starting a business', text: 'Find opportunities and useful organisations for developing a project.', href: 'https://investintunisia.tn/', external: true },
      { title: 'Daily life', text: 'Phone, Internet, shops and nearby services for everyday needs.', href: '/citizens/shops' },
    ],
  },
  it: {
    visitTab: 'Visitare diversamente', settleTab: 'Trasferirsi in Tunisia', visitTitle: 'La Tunisia fuori dai sentieri battuti', visitIntro: 'Esplora luoghi, saperi ed esperienze locali oltre gli itinerari più noti.',
    settleTitle: 'Preparare il trasferimento in Tunisia', settleIntro: 'Indicazioni semplici per capire le procedure e trovare i servizi giusti.', discover: 'Scopri', official: 'Fonte ufficiale',
    bookletTitle: 'La guida pratica per espatriati', bookletText: 'È in preparazione una versione dettagliata con checklist, budget e procedure passo dopo passo.',
    visitTopics: [
      { title: 'Borghi e patrimonio', text: 'Scopri medine, borghi e un patrimonio locale meno conosciuto.', href: '/citizens/tourism/guide/villages-patrimoine' },
      { title: 'Natura ed escursioni', text: 'Trova attività all’aria aperta, guide ed escursioni locali.', href: '/citizens/tourism/guide/nature-randonnees' },
      { title: 'Artigianato e saperi', text: 'Incontra artigiani e scopri laboratori e creazioni regionali.', href: '/citizens/tourism/guide/artisanat-savoir-faire' },
      { title: 'Sapori e mercati locali', text: 'Esplora prodotti, tavole, mercati e specialità regionali.', href: '/citizens/tourism/guide/marches-gastronomie' },
      { title: 'Cultura ed eventi', text: 'Trova festival, mostre ed eventi vicino alla destinazione.', href: '/citizens/tourism/guide/fetes-evenements' },
      { title: 'Soggiorni ed esperienze locali', text: 'Trova alloggi, guide e attività per un viaggio più personale.', href: '/citizens/tourism/guide/hebergements-experiences' },
    ],
    settleTopics: [
      { title: 'Visto, soggiorno e residenza', text: 'Verifica le condizioni per nazionalità e situazione prima della partenza.', href: 'https://services.interieur.gov.tn/wap/fr/docs/demarches/05.html', external: true },
      { title: 'Casa e trasloco', text: 'Prima di firmare un contratto, verifica zona, budget totale, spese, condizioni e documenti richiesti. Chiedi un preventivo dettagliato per il trasloco e verifica le eventuali formalità doganali.', href: '/recherche?categorie=immobilier' },
      { title: 'Salute e assicurazione', text: 'Prima di partire, verifica copertura sanitaria e assistenza al rimpatrio, comprese esclusioni, massimali e rimborsi. Prepara ricette e documenti medici utili, poi cerca medici, cliniche e farmacie nella pagina Salute.', href: '/citizens/health' },
      { title: 'Scuola e istruzione', text: 'Confronta gli istituti e trova informazioni scolastiche essenziali.', href: '/education' },
      { title: 'Banca, cambio e fiscalità', text: 'Trova servizi finanziari e verifica le regole ufficiali.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'Veicolo, beni e dogana', text: 'Verifica le formalità prima di importare un veicolo o beni personali.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'Lavoro e impresa', text: 'Trova opportunità e organismi utili per sviluppare un progetto.', href: 'https://investintunisia.tn/', external: true },
      { title: 'Vita quotidiana', text: 'Telefono, Internet, negozi e servizi utili vicino a te.', href: '/citizens/shops' },
    ],
  },
  ru: {
    visitTab: 'Открыть другую Тунис', settleTab: 'Переехать в Тунис', visitTitle: 'Тунис вдали от привычных маршрутов', visitIntro: 'Исследуйте местные места, ремёсла и впечатления за пределами известных маршрутов.',
    settleTitle: 'Подготовить переезд в Тунис', settleIntro: 'Простые ориентиры по процедурам и полезным местным услугам.', discover: 'Подробнее', official: 'Официальный источник',
    bookletTitle: 'Практический справочник экспата', bookletText: 'Готовится подробная версия с чек-листами, бюджетами и пошаговыми процедурами.',
    visitTopics: [
      { title: 'Деревни и наследие', text: 'Откройте медины, деревни и менее известное местное наследие.', href: '/citizens/tourism/guide/villages-patrimoine' },
      { title: 'Природа и походы', text: 'Найдите активный отдых, местных гидов и экскурсии.', href: '/citizens/tourism/guide/nature-randonnees' },
      { title: 'Ремёсла и мастерство', text: 'Познакомьтесь с мастерами и региональными мастерскими.', href: '/citizens/tourism/guide/artisanat-savoir-faire' },
      { title: 'Вкусы и рынки', text: 'Исследуйте продукты, рынки и региональную кухню.', href: '/citizens/tourism/guide/marches-gastronomie' },
      { title: 'Культура и события', text: 'Найдите фестивали, выставки и события рядом.', href: '/citizens/tourism/guide/fetes-evenements' },
      { title: 'Местный отдых и впечатления', text: 'Найдите жильё, гидов и занятия для индивидуальной поездки.', href: '/citizens/tourism/guide/hebergements-experiences' },
    ],
    settleTopics: [
      { title: 'Виза, пребывание и ВНЖ', text: 'Проверьте условия для вашего гражданства и ситуации до поездки.', href: 'https://services.interieur.gov.tn/wap/fr/docs/demarches/05.html', external: true },
      { title: 'Жильё и переезд', text: 'Перед подписанием договора проверьте район, полную стоимость, дополнительные расходы, условия аренды и документы. Запросите подробную смету переезда и проверьте таможенные требования.', href: '/recherche?categorie=immobilier' },
      { title: 'Здоровье и страхование', text: 'До переезда проверьте медицинскую страховку и помощь с медицинской репатриацией, исключения, лимиты и порядок возмещения. Подготовьте рецепты и важные медицинские документы, затем найдите врачей, клиники и аптеки в разделе «Здоровье».', href: '/citizens/health' },
      { title: 'Школа и образование', text: 'Сравните учреждения и найдите важную информацию об обучении.', href: '/education' },
      { title: 'Банк, обмен и налоги', text: 'Найдите финансовые услуги и проверьте официальные правила.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'Автомобиль, вещи и таможня', text: 'Проверьте формальности перед ввозом автомобиля или личных вещей.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'Работа и бизнес', text: 'Найдите возможности и организации для развития проекта.', href: 'https://investintunisia.tn/', external: true },
      { title: 'Повседневная жизнь', text: 'Телефон, Интернет, магазины и полезные услуги рядом.', href: '/citizens/shops' },
    ],
  },
};

const visitExamples: Record<PublicLanguage, string[][]> = {
  fr: [
    ['Takrouna et Kesra', 'Chenini et Douiret', 'Matmata et ses habitats troglodytes', 'Ksour du Dahar'],
    ['Forêts de Kroumirie et Aïn Draham', 'Parc national de l’Ichkeul', 'Djebel Zaghouan', 'Canyons de Midès, Tamerza et Chebika', 'Dunes de Douz et Ksar Ghilane'],
    ['Poterie des femmes de Sejnane', 'Céramique de Nabeul', 'Tapis de Kairouan', 'Tissages du Dahar et de Djerba', 'Bijoux et objets des médinas'],
    ['Marché de Nabeul', 'Souks de Kairouan', 'Houmt Souk à Djerba', 'Marché central de Sfax', 'Cuisine des médinas et produits des oasis'],
    ['Festival du Sahara à Douz', 'Festival symphonique d’El Jem', 'Festival du Malouf à Testour', 'Jazz à Tabarka', 'Mouled à Kairouan'],
    ['Maisons d’hôtes dans les médinas', 'Écolodges du Nord-Ouest', 'Campements dans le désert', 'Hébergements troglodytes à Matmata', 'Séjours ruraux au Cap Bon et à Zaghouan'],
  ],
  ar: [
    ['تكرونة وكسرى', 'شنني ودويرات', 'مطماطة ومساكنها المحفورة', 'قصور جبال الظاهر'],
    ['غابات خمير وعين دراهم', 'الحديقة الوطنية بإشكل', 'جبل زغوان', 'أخاديد ميداس وتمغزة والشبيكة', 'كثبان دوز وقصر غيلان'],
    ['فخار نساء سجنان', 'خزف نابل', 'زرابي القيروان', 'منسوجات الظاهر وجربة', 'حلي ومنتجات المدن العتيقة'],
    ['سوق نابل', 'أسواق القيروان', 'حومة السوق بجربة', 'السوق المركزية بصفاقس', 'مأكولات المدن العتيقة ومنتجات الواحات'],
    ['مهرجان الصحراء بدوز', 'مهرجان الجم للموسيقى السمفونية', 'مهرجان المالوف بتستور', 'جاز طبرقة', 'المولد بالقيروان'],
    ['دور ضيافة في المدن العتيقة', 'نزل بيئية في الشمال الغربي', 'مخيمات صحراوية', 'إقامات محفورة بمطماطة', 'إقامات ريفية بالوطن القبلي وزغوان'],
  ],
  en: [
    ['Takrouna and Kesra', 'Chenini and Douiret', 'Matmata and its troglodyte homes', 'Ksour of the Dahar'],
    ['Kroumirie forests and Aïn Draham', 'Ichkeul National Park', 'Jebel Zaghouan', 'Midès, Tamerza and Chebika canyons', 'Douz dunes and Ksar Ghilane'],
    ['Sejnane women’s pottery', 'Nabeul ceramics', 'Kairouan carpets', 'Dahar and Djerba weaving', 'Medina jewellery and crafts'],
    ['Nabeul market', 'Kairouan souks', 'Houmt Souk in Djerba', 'Sfax central market', 'Medina food and oasis produce'],
    ['Douz Sahara Festival', 'El Jem Symphonic Festival', 'Testour Malouf Festival', 'Tabarka Jazz', 'Mouled in Kairouan'],
    ['Medina guest houses', 'North-West eco-lodges', 'Desert camps', 'Troglodyte stays in Matmata', 'Rural stays in Cap Bon and Zaghouan'],
  ],
  it: [
    ['Takrouna e Kesra', 'Chenini e Douiret', 'Matmata e le case troglodite', 'Ksour del Dahar'],
    ['Foreste della Kroumirie e Aïn Draham', 'Parco nazionale di Ichkeul', 'Jebel Zaghouan', 'Canyon di Midès, Tamerza e Chebika', 'Dune di Douz e Ksar Ghilane'],
    ['Ceramica delle donne di Sejnane', 'Ceramica di Nabeul', 'Tappeti di Kairouan', 'Tessuti del Dahar e di Djerba', 'Gioielli e artigianato delle medine'],
    ['Mercato di Nabeul', 'Souk di Kairouan', 'Houmt Souk a Djerba', 'Mercato centrale di Sfax', 'Cucina delle medine e prodotti delle oasi'],
    ['Festival del Sahara di Douz', 'Festival sinfonico di El Jem', 'Festival del Malouf di Testour', 'Jazz a Tabarka', 'Mouled a Kairouan'],
    ['Guest house nelle medine', 'Ecolodge del Nord-Ovest', 'Campi nel deserto', 'Alloggi trogloditi a Matmata', 'Soggiorni rurali nel Cap Bon e a Zaghouan'],
  ],
  ru: [
    ['Такруна и Кесра', 'Шенини и Дуирет', 'Матмата и троглодитские жилища', 'Ксуры Дахара'],
    ['Леса Крумирии и Айн-Драхам', 'Национальный парк Ишкёль', 'Джебель-Загуан', 'Каньоны Мидес, Тамерза и Шебика', 'Дюны Дуза и Ксар-Гилан'],
    ['Керамика женщин Седжнана', 'Керамика Набеля', 'Ковры Кайруана', 'Ткачество Дахара и Джербы', 'Украшения и ремёсла медин'],
    ['Рынок Набеля', 'Суки Кайруана', 'Хумт-Сук на Джербе', 'Центральный рынок Сфакса', 'Кухня медин и продукты оазисов'],
    ['Фестиваль Сахары в Дузе', 'Симфонический фестиваль Эль-Джема', 'Фестиваль малуфа в Тестуре', 'Джаз в Табарке', 'Маулид в Кайруане'],
    ['Гостевые дома в мединах', 'Эколоджи Северо-Запада', 'Лагеря в пустыне', 'Троглодитские отели Матматы', 'Сельский отдых на Кап-Бон и в Загуане'],
  ],
};

export default function CitizensTourism() {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const t = copy[lang];
  const journey = journeyCopy[lang];
  const isRTL = lang === 'ar';
  const [journeyMode, setJourneyMode] = useState<JourneyMode>('visit');
  const topics = journeyMode === 'visit' ? journey.visitTopics : journey.settleTopics;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead
        title={t.seoTitle}
        description={t.intro}
        canonical="https://dalil-tounes.com/citizens/tourism"
        currentPath="/citizens/tourism"
      />
      <section className="relative w-full h-[280px] overflow-hidden">
        <img
          src="https://commons.wikimedia.org/wiki/Special:FilePath/Sidi_bou_said_port.jpg?width=1600"
          alt={t.heroAlt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D43]/75 via-[#4A1D43]/60 to-[#4A1D43]/25" />
        <a className="absolute bottom-1 right-2 z-10 text-[10px] text-white/85 underline" href="https://commons.wikimedia.org/wiki/File:Sidi_bou_said_port.jpg" target="_blank" rel="noopener noreferrer" aria-label="Crédit photo Rania Haddad, licence CC BY-SA 4.0">Photo : Rania Haddad · CC BY-SA 4.0</a>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2 drop-shadow-lg text-[#D4AF37]">{t.title}</h1>
          <p className="text-sm md:text-base font-light text-white/95 max-w-3xl leading-relaxed drop-shadow-lg">{t.intro}</p>
        </div>
      </section>

      <section className="py-6 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg md:text-xl font-light mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-[#4A0404]">{t.slogan}</span>
          </p>
          <div className="flex justify-center"><div className="w-[40px] h-[1px] bg-[#D4AF37]" /></div>
        </div>
      </section>

      {journeyMode === 'settle' && <section className="py-2 px-4 relative z-0" style={{ overflow: 'visible' }}>
        <div className="max-w-5xl mx-auto" style={{ overflow: 'visible' }}>
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#D4AF37] p-2.5 md:p-3" style={{ overflow: 'visible' }}>
            <SearchBar
              scope="tourism"
              intentEnabled={false}
              enabled
              resultMode="redirectToResults"
              preferredTitle={t.preferredTitle}
              preferredSubtitle={t.preferredSubtitle}
            />
          </div>
        </div>
      </section>}

      <section className="px-4 pt-6">
        <div className="max-w-5xl mx-auto rounded-2xl border border-[#D4AF37]/50 bg-white px-3 py-4 sm:px-5 shadow-sm">
          <div className="flex justify-center gap-2" role="tablist" aria-label={t.title}>
            <button type="button" role="tab" aria-selected={journeyMode === 'visit'} onClick={() => setJourneyMode('visit')} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs sm:text-sm font-semibold transition-colors ${journeyMode === 'visit' ? 'border-[#D4AF37] bg-[#4A1D43] text-[#D4AF37]' : 'border-[#D4AF37]/50 bg-white text-[#4A1D43] hover:bg-[#D4AF37]/10'}`}>
              <Compass className="h-4 w-4" aria-hidden="true" />{journey.visitTab}
            </button>
            <button type="button" role="tab" aria-selected={journeyMode === 'settle'} onClick={() => setJourneyMode('settle')} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs sm:text-sm font-semibold transition-colors ${journeyMode === 'settle' ? 'border-[#D4AF37] bg-[#4A1D43] text-[#D4AF37]' : 'border-[#D4AF37]/50 bg-white text-[#4A1D43] hover:bg-[#D4AF37]/10'}`}>
              <Home className="h-4 w-4" aria-hidden="true" />{journey.settleTab}
            </button>
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-[#4A0404]" style={{ fontFamily: "'Playfair Display', serif" }}>{journeyMode === 'visit' ? journey.visitTitle : journey.settleTitle}</h2>
            <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-relaxed text-gray-600">{journeyMode === 'visit' ? journey.visitIntro : journey.settleIntro}</p>
          </div>

          {journeyMode === 'visit' && <p className="mt-3 text-center text-xs font-semibold tracking-wide text-[#A45A27]">✨ Six façons de vivre la Tunisie, pas seulement de la visiter</p>}
          <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-3">
            {topics.map((topic, topicIndex) => journeyMode === 'visit' ? (
              <Link key={topic.title} to={topic.href} className={`group relative min-w-0 overflow-hidden rounded-2xl border border-white/70 px-2.5 py-3 sm:px-4 sm:py-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A1D43] ${["bg-[#FFF0DB]","bg-[#E6F3E6]","bg-[#FFE9D7]","bg-[#F9EDD9]","bg-[#F3E9FA]","bg-[#E2F3F2]"][topicIndex % 6]}`}> 
                <div className="mb-2 flex items-center justify-between"><span className="text-2xl sm:text-3xl" aria-hidden="true">{['🏛️','🌿','🧶','🍲','🎉','🏡'][topicIndex] || '🇹🇳'}</span><span className="rounded-full bg-white/65 px-2 py-0.5 text-[10px] font-semibold text-[#784626]">Explorer</span></div>
                <div className="flex items-center justify-between gap-3 text-sm font-semibold text-[#4A1D43]">
                  <span>{topic.title}</span>
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 -rotate-90 text-[#D4AF37] ${isRTL ? 'rotate-90' : ''}`} aria-hidden="true" />
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{topic.text}</p>
                <ul className="mt-2 hidden flex-wrap gap-1.5 sm:flex" aria-label={topic.title}>
                  {visitExamples[lang][topicIndex].slice(0, 3).map((example) => (
                    <li key={example} className="rounded-full border border-[#D4AF37]/35 bg-white px-2.5 py-1 text-[11px] leading-tight text-gray-700">{example}</li>
                  ))}
                </ul>
                <span className="mt-3 inline-flex rounded-full bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#5B2345] shadow-sm transition group-hover:bg-white">{journey.discover}</span>
              </Link>
            ) : (
              <details key={topic.title} className="group min-w-0 rounded-xl border border-[#D4AF37]/45 bg-[#FFFDF8] px-3 py-2.5 open:border-[#D4AF37] max-md:open:fixed max-md:open:inset-x-3 max-md:open:top-[10dvh] max-md:open:bottom-[10dvh] max-md:open:z-[100] max-md:open:flex max-md:open:flex-col max-md:open:overflow-hidden max-md:open:bg-white max-md:open:p-0 max-md:open:shadow-2xl">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#4A1D43] [&::-webkit-details-marker]:hidden max-md:group-open:shrink-0 max-md:group-open:border-b max-md:group-open:border-[#D4AF37]/30 max-md:group-open:bg-[#FFFDF8] max-md:group-open:px-4 max-md:group-open:py-4">
                  <span>{topic.title}</span>
                  <span className="flex shrink-0 items-center gap-1.5"><span className="hidden text-[11px] font-semibold text-[#4A1D43] max-md:group-open:inline">{({fr:'Fermer',ar:'إغلاق',en:'Close',it:'Chiudi',ru:'Закрыть'} as Record<PublicLanguage, string>)[lang]}</span><ChevronDown className="h-4 w-4 text-[#D4AF37] transition-transform group-open:rotate-180" aria-hidden="true" /></span>
                </summary>
                <div className="max-md:group-open:min-h-0 max-md:group-open:flex-1 max-md:group-open:overflow-y-auto max-md:group-open:overscroll-contain max-md:group-open:px-4 max-md:group-open:pb-6">
                <div className="mt-3 flex items-start gap-2">
                  <p className="min-w-0 flex-1 text-xs font-medium leading-relaxed text-[#4A1D43]">{settleServiceIntros[lang][topicIndex]}</p>
                  {SETTLEMENT_SERVICE_PATHS[topicIndex] && (
                    <a href={SETTLEMENT_SERVICE_PATHS[topicIndex]} aria-label={settlementServiceLinkLabels[lang] + ' — ' + topic.title} title={settlementServiceLinkLabels[lang]} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-[#FFF8E8] text-[#4A1D43] transition hover:bg-[#F3E2B5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A1D43]">
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#7C5A31]">{({fr:'À faire',ar:'الخطوات',en:'What to do',it:'Cosa fare',ru:'Что делать'} as Record<PublicLanguage, string>)[lang]}</p>
                {(topicIndex === 1 || topicIndex === 4) && (
                  <div className="mt-2 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{topicIndex === 1 ? housingBankProfiles[lang].housingTitle : housingBankProfiles[lang].bankTitle}</p>
                    <div className="mt-2 space-y-1.5">
                      {(topicIndex === 1 ? housingBankProfiles[lang].housing : housingBankProfiles[lang].bank).map(item => (
                        <details key={item.title} className="rounded-md border border-[#D4AF37]/25 bg-[#FFFDF8] p-2">
                          <summary className="cursor-pointer text-xs font-medium text-[#4A1D43]">{item.title}</summary>
                          <p className="mt-1.5 text-xs leading-relaxed text-gray-700">{item.text}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
                {([2, 3, 6].includes(topicIndex)) && (
                  <div className="mt-2 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{topicIndex === 2 ? serviceSituationGuides[lang].healthTitle : topicIndex === 3 ? serviceSituationGuides[lang].educationTitle : serviceSituationGuides[lang].workTitle}</p>
                    <div className="mt-2 space-y-1.5">
                      {(topicIndex === 2 ? serviceSituationGuides[lang].health : topicIndex === 3 ? serviceSituationGuides[lang].education : serviceSituationGuides[lang].work).map(item => (
                        <details key={item.title} className="rounded-md border border-[#D4AF37]/25 bg-[#FFFDF8] p-2">
                          <summary className="cursor-pointer text-xs font-medium text-[#4A1D43]">{item.title}</summary>
                          <p className="mt-1.5 text-xs leading-relaxed text-gray-700">{item.text}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
                {topicIndex === 7 && (
                  <div className="mt-2 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{dailySituations[lang].title}</p>
                    <div className="mt-2 space-y-1.5">
                      {dailySituations[lang].choices.map(choice => (
                        <details key={choice.title} className="rounded-md border border-[#D4AF37]/25 bg-[#FFFDF8] p-2">
                          <summary className="cursor-pointer text-xs font-medium text-[#4A1D43]">{choice.title}</summary>
                          <p className="mt-1.5 text-xs leading-relaxed text-gray-700">{choice.detail}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
                {([1, 2, 7].includes(topicIndex)) && (
                  <div className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <ol className="list-decimal space-y-1.5 ps-4 text-xs leading-relaxed text-gray-700">
                      {(topicIndex === 1 ? everydayGuides[lang].housing : topicIndex === 2 ? everydayGuides[lang].health : everydayGuides[lang].daily).map(step => <li key={step}>{step}</li>)}
                    </ol>
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-600">{everydayGuides[lang].caution}</p>
                  </div>
                )}
                {topicIndex === 0 && (
                  <div className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{residenceGuide[lang].title}</p>
                    <ol className="mt-2 list-decimal space-y-1.5 ps-4 text-xs leading-relaxed text-gray-700">
                      {residenceGuide[lang].steps.map(step => <li key={step}>{step}</li>)}
                    </ol>
                    <p className="mt-3 text-xs font-semibold text-[#4A1D43]">{residenceProfiles[lang].label}</p>
                    <div className="mt-2 space-y-1.5">
                      {residenceProfiles[lang].profiles.map((name, index) => (
                        <details key={name} className="rounded-md border border-[#D4AF37]/25 bg-[#FFFDF8] p-2">
                          <summary className="cursor-pointer text-xs font-medium text-[#4A1D43]">{name}</summary>
                          <p className="mt-1.5 text-xs leading-relaxed text-gray-700">{residenceProfiles[lang].details[index]}</p>
                        </details>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-600">{residenceGuide[lang].caution}</p>
                  </div>
                )}
                {topicIndex === 3 && (
                  <div className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{schoolWorkGuides[lang].schoolTitle}</p>
                    <ol className="mt-2 list-decimal space-y-1.5 ps-4 text-xs leading-relaxed text-gray-700">
                      {schoolWorkGuides[lang].schoolSteps.map(step => <li key={step}>{step}</li>)}
                    </ol>
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-600">{schoolWorkGuides[lang].schoolNote}</p>
                  </div>
                )}
                {topicIndex === 6 && (
                  <div className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{schoolWorkGuides[lang].workTitle}</p>
                    <ol className="mt-2 list-decimal space-y-1.5 ps-4 text-xs leading-relaxed text-gray-700">
                      {schoolWorkGuides[lang].workSteps.map(step => <li key={step}>{step}</li>)}
                    </ol>

                    <p className="mt-2 text-[11px] leading-relaxed text-gray-600">{schoolWorkGuides[lang].workNote}</p>
                  </div>
                )}
                {topicIndex === 5 && (
                  <div className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{customsGuide[lang].title}</p>
                    <div className="mt-2 space-y-3">
                      {customsGuide[lang].paths.map((path) => (
                        <details key={path.title} className="rounded-md border border-[#D4AF37]/25 bg-[#FFFDF8] p-2">
                          <summary className="cursor-pointer text-xs font-semibold text-[#4A1D43]">{path.title}</summary>
                          <p className="mt-2 text-xs leading-relaxed text-gray-700">{path.text}</p>
                        </details>
                      ))}
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-gray-600">{customsGuide[lang].caution}</p>
                  </div>
                )}
                {topicIndex === 4 && (
                  <div className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{bankingGuide[lang].title}</p>
                    <ol className="mt-2 list-decimal space-y-1.5 ps-4 text-xs leading-relaxed text-gray-700">
                      {bankingGuide[lang].steps.map((step) => <li key={step}>{step}</li>)}
                    </ol>
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-600">{bankingGuide[lang].caution}</p>

                  </div>
                )}

                  <div className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-[#FFFDF8] p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{settlementPrep[lang].heading}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-700">{settlementPrep[lang].items[topicIndex]}</p>
                  </div>
                  <p className="mt-3 border-t border-[#D4AF37]/20 pt-2 text-[11px] leading-relaxed text-gray-500">{settlementPrep[lang].disclaimer}</p>

                </div>
              </details>
            ))}
          </div>

          {journeyMode === 'settle' && (
            <div className="mt-4 rounded-xl border border-dashed border-[#D4AF37] bg-white px-4 py-3 text-center">
              <h3 className="text-sm font-semibold text-[#4A1D43]">{journey.bookletTitle}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{journey.bookletText}</p>
            </div>
          )}

          {journeyMode === 'settle' && (
            <nav className="mt-4 flex flex-wrap justify-center gap-2" aria-label={t.expatTitle}>
              {QUICK_LINK_PATHS.map((path, index) => (
                <Link key={path} to={path} className="rounded-full border border-[#D4AF37]/50 px-3 py-1.5 text-xs font-medium text-[#4A0404] hover:bg-[#D4AF37]/10">
                  {t.quickLinks[index]}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>

      {journeyMode === 'visit' && <TourismExperienceDiscovery />}

    </div>
  );
}
