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

const QUICK_LINK_PATHS = ['/citizens/services', '/citizens/health', '/education', '/emplois'] as const;

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
      { title: 'Visa, séjour & résidence', text: 'Vérifier les conditions selon votre nationalité et votre situation avant le départ.', href: 'https://www.diplomatie.gov.tn/', external: true },
      { title: 'Logement & déménagement', text: 'Rechercher un logement, un déménageur ou un professionnel pour faciliter votre arrivée.', href: '/recherche?q=immobilier%20d%C3%A9m%C3%A9nagement' },
      { title: 'Santé & assurance', text: 'Identifier les médecins, cliniques, assurances et services de santé utiles.', href: '/citizens/health' },
      { title: 'École & scolarité', text: 'Comparer les établissements et retrouver les informations scolaires essentielles.', href: '/education' },
      { title: 'Banque, change & fiscalité', text: 'Consulter les services financiers et vérifier les règles officielles applicables.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'Véhicule, biens & douane', text: 'Vérifier les formalités avant d’importer un véhicule ou vos effets personnels.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'Travail & création d’entreprise', text: 'Trouver des opportunités et les organismes utiles pour développer un projet.', href: 'https://investintunisia.tn/', external: true },
      { title: 'Vie quotidienne', text: 'Téléphone, Internet, commerces et services : retrouver les professionnels proches de vous.', href: '/recherche?q=services%20quotidien' },
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
      { title: 'التأشيرة والإقامة', text: 'تحقق من الشروط حسب جنسيتك ووضعيتك قبل السفر.', href: 'https://www.diplomatie.gov.tn/', external: true },
      { title: 'السكن والانتقال', text: 'ابحث عن سكن أو شركة نقل أو مهني لتسهيل وصولك.', href: '/recherche?q=%D8%B9%D9%82%D8%A7%D8%B1%D8%A7%D8%AA%20%D9%86%D9%82%D9%84' },
      { title: 'الصحة والتأمين', text: 'اعثر على الأطباء والمصحات والتأمينات والخدمات الصحية.', href: '/citizens/health' },
      { title: 'المدرسة والتعليم', text: 'قارن المؤسسات واعثر على المعلومات المدرسية الأساسية.', href: '/education' },
      { title: 'البنك والصرف والجباية', text: 'اطلع على الخدمات المالية والقواعد الرسمية المعمول بها.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'السيارة والأمتعة والديوانة', text: 'تحقق من الإجراءات قبل توريد سيارة أو أمتعتك الشخصية.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'العمل وبعث مشروع', text: 'اعثر على الفرص والهياكل المفيدة لتطوير مشروعك.', href: 'https://investintunisia.tn/', external: true },
      { title: 'الحياة اليومية', text: 'الهاتف والإنترنت والمتاجر والخدمات القريبة منك.', href: '/recherche?q=%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20%D9%8A%D9%88%D9%85%D9%8A%D8%A9' },
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
      { title: 'Visa, stay & residence', text: 'Check the conditions for your nationality and situation before departure.', href: 'https://www.diplomatie.gov.tn/', external: true },
      { title: 'Housing & moving', text: 'Find housing and professionals who can help with your arrival.', href: '/recherche?q=property%20moving' },
      { title: 'Health & insurance', text: 'Find doctors, clinics, insurers and useful health services.', href: '/citizens/health' },
      { title: 'School & education', text: 'Compare institutions and find essential school information.', href: '/education' },
      { title: 'Banking, exchange & tax', text: 'Find financial services and check the applicable official rules.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'Vehicle, belongings & customs', text: 'Check formalities before importing a vehicle or personal belongings.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'Work & starting a business', text: 'Find opportunities and useful organisations for developing a project.', href: 'https://investintunisia.tn/', external: true },
      { title: 'Daily life', text: 'Phone, Internet, shops and nearby services for everyday needs.', href: '/recherche?q=daily%20services' },
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
      { title: 'Visto, soggiorno e residenza', text: 'Verifica le condizioni per nazionalità e situazione prima della partenza.', href: 'https://www.diplomatie.gov.tn/', external: true },
      { title: 'Casa e trasloco', text: 'Trova alloggi e professionisti per facilitare l’arrivo.', href: '/recherche?q=immobiliare%20trasloco' },
      { title: 'Salute e assicurazione', text: 'Trova medici, cliniche, assicurazioni e servizi sanitari.', href: '/citizens/health' },
      { title: 'Scuola e istruzione', text: 'Confronta gli istituti e trova informazioni scolastiche essenziali.', href: '/education' },
      { title: 'Banca, cambio e fiscalità', text: 'Trova servizi finanziari e verifica le regole ufficiali.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'Veicolo, beni e dogana', text: 'Verifica le formalità prima di importare un veicolo o beni personali.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'Lavoro e impresa', text: 'Trova opportunità e organismi utili per sviluppare un progetto.', href: 'https://investintunisia.tn/', external: true },
      { title: 'Vita quotidiana', text: 'Telefono, Internet, negozi e servizi utili vicino a te.', href: '/recherche?q=servizi%20quotidiani' },
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
      { title: 'Виза, пребывание и ВНЖ', text: 'Проверьте условия для вашего гражданства и ситуации до поездки.', href: 'https://www.diplomatie.gov.tn/', external: true },
      { title: 'Жильё и переезд', text: 'Найдите жильё и специалистов, которые помогут с переездом.', href: '/recherche?q=property%20moving' },
      { title: 'Здоровье и страхование', text: 'Найдите врачей, клиники, страховые компании и медицинские услуги.', href: '/citizens/health' },
      { title: 'Школа и образование', text: 'Сравните учреждения и найдите важную информацию об обучении.', href: '/education' },
      { title: 'Банк, обмен и налоги', text: 'Найдите финансовые услуги и проверьте официальные правила.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'Автомобиль, вещи и таможня', text: 'Проверьте формальности перед ввозом автомобиля или личных вещей.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'Работа и бизнес', text: 'Найдите возможности и организации для развития проекта.', href: 'https://investintunisia.tn/', external: true },
      { title: 'Повседневная жизнь', text: 'Телефон, Интернет, магазины и полезные услуги рядом.', href: '/recherche?q=daily%20services' },
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

      <section className="py-2 px-4 relative z-[9999]" style={{ overflow: 'visible' }}>
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
      </section>

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

          <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-3">
            {topics.map((topic, topicIndex) => journeyMode === 'visit' ? (
              <Link key={topic.title} to={topic.href} className="group min-w-0 rounded-xl border border-[#D4AF37]/45 bg-[#FFFDF8] px-2.5 py-2.5 sm:px-3 sm:py-3 transition hover:border-[#D4AF37] hover:shadow-sm">
                <div className="flex items-center justify-between gap-3 text-sm font-semibold text-[#4A1D43]">
                  <span>{topic.title}</span>
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 -rotate-90 text-[#D4AF37] ${isRTL ? 'rotate-90' : ''}`} aria-hidden="true" />
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{topic.text}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={topic.title}>
                  {visitExamples[lang][topicIndex].slice(0, 3).map((example) => (
                    <li key={example} className="rounded-full border border-[#D4AF37]/35 bg-white px-2.5 py-1 text-[11px] leading-tight text-gray-700">{example}</li>
                  ))}
                </ul>
                <span className="mt-2 inline-flex text-xs font-semibold text-[#4A1D43] underline decoration-[#D4AF37] underline-offset-2">{journey.discover}</span>
              </Link>
            ) : (
              <details key={topic.title} className="group rounded-xl border border-[#D4AF37]/45 bg-[#FFFDF8] px-3 py-2.5 open:border-[#D4AF37]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#4A1D43] [&::-webkit-details-marker]:hidden">
                  <span>{topic.title}</span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0 text-[#D4AF37] transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">{topic.text}</p>
                {'external' in topic && topic.external ? (
                  <a href={topic.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A1D43] underline decoration-[#D4AF37] underline-offset-2">
                    {journey.official}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <Link to={topic.href} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A1D43] underline decoration-[#D4AF37] underline-offset-2">
                    {journey.discover}
                  </Link>
                )}
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
