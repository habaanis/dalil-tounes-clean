import { ChevronDown } from 'lucide-react';

type Lang = 'fr' | 'ar' | 'en' | 'it' | 'ru';
type IntroKey = 'home' | 'citizens' | 'health' | 'education' | 'services' | 'shops' | 'leisure' | 'tourism' | 'settle' | 'pros' | 'jobs' | 'search';
type IntroText = { short: string; long: string };

// Short, route-specific introductions for the PLATFORM APP only.
// Do not render this on the public website or within client CV/QR routes.
const CONTENT: Record<IntroKey, Record<Lang, IntroText>> = {
  "home": {
    "fr": {
      "short": "Bienvenue sur Dalil Tounes : trouvez des entreprises, des commerces, des services et des idées de sorties partout en Tunisie.",
      "long": "Dalil Tounes rassemble des établissements et des informations pratiques pour faciliter vos recherches. Explorez les rubriques, consultez les fiches disponibles et contactez directement les professionnels. Les entreprises peuvent aussi s'y référencer et présenter leurs activités."
    },
    "ar": {
      "short": "مرحبا بيك في دليل تونس: تلقى مؤسسات، محلات، خدمات وأفكار خروجات في مختلف الجهات.",
      "long": "دليل تونس يجمع مؤسسات ومعلومات عملية باش يسهّل عليك البحث. اختار القسم، شوف بطاقات المؤسسات واتصل بيهم مباشرة. والمؤسسات تنجم زادة تسجّل نشاطها وتعرّف بخدماتها."
    },
    "en": {
      "short": "Welcome to Dalil Tounes: find businesses, shops, services and things to do across Tunisia.",
      "long": "Dalil Tounes brings together local listings and practical information to make searching easier. Explore the sections, read available business profiles and contact professionals directly. Businesses can also list and present their activities."
    },
    "it": {
      "short": "Benvenuti su Dalil Tounes: trovate imprese, negozi, servizi e idee per uscire in tutta la Tunisia.",
      "long": "Dalil Tounes riunisce attività e informazioni pratiche per facilitare le ricerche. Esplorate le sezioni, consultate le schede e contattate direttamente i professionisti. Anche le imprese possono registrarsi e presentarsi."
    },
    "ru": {
      "short": "Добро пожаловать в Dalil Tounes: компании, магазины, услуги и идеи для отдыха по всему Тунису.",
      "long": "Dalil Tounes объединяет сведения о местных компаниях и полезную информацию. Выберите раздел, изучите карточки и свяжитесь с организациями напрямую. Предприниматели также могут зарегистрировать и представить свой бизнес."
    }
  },
  "citizens": {
    "fr": {
      "short": "Santé, éducation, démarches, commerces et loisirs : accédez rapidement aux rubriques utiles à votre quotidien.",
      "long": "Vous ne savez pas vers quel établissement ou service vous tourner ? Choisissez le thème correspondant à votre besoin, puis consultez les informations et coordonnées disponibles. Cet espace vous aide à vous orienter et à gagner du temps."
    },
    "ar": {
      "short": "صحة، تعليم، إجراءات، محلات وترفيه: أقسام تعاوِنك في حياتك اليومية.",
      "long": "موش عارف وين تتوجّه؟ اختار القسم المناسب لحاجتك، وشوف المعلومات ووسائل الاتصال الموجودة. الفضاء هذا يساعدك تلقى الجهة المناسبة وتربح وقت."
    },
    "en": {
      "short": "Health, education, public services, shops and leisure: quickly reach the sections you need.",
      "long": "Not sure which service or business to contact? Choose a topic, then consult the available information and contact details. This space helps you find your way and save time."
    },
    "it": {
      "short": "Salute, istruzione, servizi pubblici, negozi e tempo libero: tutto a portata di mano.",
      "long": "Non sapete a chi rivolgervi? Scegliete l'argomento e consultate le informazioni e i contatti disponibili. Questa sezione vi aiuta a orientarvi e risparmiare tempo."
    },
    "ru": {
      "short": "Здоровье, образование, госуслуги, магазины и отдых — полезные разделы для повседневных задач.",
      "long": "Не знаете, куда обратиться? Выберите нужную тему, изучите доступную информацию и контакты. Раздел помогает сориентироваться и сэкономить время."
    }
  },
  "health": {
    "fr": {
      "short": "Besoin d'un professionnel de santé ? Retrouvez les établissements, spécialités et coordonnées disponibles en Tunisie.",
      "long": "Médecins, pharmacies, laboratoires et autres structures : cherchez un professionnel et consultez sa fiche pour retrouver son adresse, ses contacts et, si renseignés, ses horaires. Ces informations pratiques ne remplacent pas un avis médical."
    },
    "ar": {
      "short": "تلوّج على مهني صحة؟ تلقى المؤسسات والاختصاصات ووسائل الاتصال المتوفرة في تونس.",
      "long": "أطباء، صيدليات، مخابر ومؤسسات أخرى: ابحث وشوف بطاقة كل مؤسسة باش تلقى العنوان والتليفون والأوقات إذا كانت موجودة. المعلومات هاذي ما تعوّضش استشارة طبية."
    },
    "en": {
      "short": "Looking for healthcare services? Explore listed providers, specialties and contact details in Tunisia.",
      "long": "Find doctors, pharmacies, laboratories and other facilities. Business profiles may include addresses, phone numbers and opening hours. These practical listings do not replace medical advice."
    },
    "it": {
      "short": "Cercate un servizio sanitario? Trovate professionisti, specialità e contatti disponibili in Tunisia.",
      "long": "Medici, farmacie, laboratori e altre strutture: consultate le schede per indirizzi, numeri e orari, quando indicati. Queste informazioni non sostituiscono il parere medico."
    },
    "ru": {
      "short": "Ищете медицинскую помощь? Найдите учреждения, специалистов и контактные данные в Тунисе.",
      "long": "В разделе представлены врачи, аптеки, лаборатории и другие организации. Карточки могут содержать адреса, телефоны и часы работы. Информация не заменяет консультацию врача."
    }
  },
  "education": {
    "fr": {
      "short": "Écoles, établissements et formations : trouvez des ressources pour accompagner vos projets d'apprentissage.",
      "long": "Parents, étudiants ou professionnels : recherchez des établissements scolaires, des centres de formation et d'autres structures éducatives. Consultez les renseignements disponibles pour identifier les organismes utiles et prendre contact."
    },
    "ar": {
      "short": "مدارس، مؤسسات وتكوين: اكتشف موارد تنفعك في مسارك الدراسي والمهني.",
      "long": "للأولياء والطلبة والمهنيين: لوّج على المدارس ومراكز التكوين والمؤسسات التعليمية. اطّلع على المعلومات الموجودة واعرف كيفاش تتصل بالجهة المناسبة."
    },
    "en": {
      "short": "Schools, institutions and training: find resources for your learning plans.",
      "long": "Whether you are a parent, student or professional, explore schools, training centers and educational organizations. Use available details to identify and contact the right institution."
    },
    "it": {
      "short": "Scuole, istituti e formazione: trovate risorse per il vostro percorso di apprendimento.",
      "long": "Genitori, studenti e professionisti possono cercare scuole, centri di formazione e strutture educative. Consultate le informazioni disponibili per trovare e contattare l'istituto adatto."
    },
    "ru": {
      "short": "Школы, учебные заведения и курсы — ресурсы для обучения и развития.",
      "long": "Родители, учащиеся и специалисты могут найти школы, учебные центры и другие организации. Изучайте доступные сведения и контакты, чтобы выбрать подходящее учреждение."
    }
  },
  "services": {
    "fr": {
      "short": "Une démarche administrative à effectuer ? Identifiez les services citoyens et les contacts utiles pour vous orienter.",
      "long": "Cette rubrique rassemble des repères pratiques et des informations sur les organismes administratifs en Tunisie. Trouvez le service qui vous concerne et vérifiez les conditions et documents requis auprès de l'administration officielle."
    },
    "ar": {
      "short": "عندك إجراء إداري؟ تلقى الخدمات والجهات اللي تعاونك تعرف وين تتوجّه.",
      "long": "القسم هذا يجمع معلومات عملية على الإدارات والخدمات للمواطنين في تونس. ابحث على المصلحة المناسبة وثبّت الشروط والوثائق المطلوبة مع الإدارة الرسمية."
    },
    "en": {
      "short": "Need to complete an administrative process? Find citizen services and useful contacts.",
      "long": "Browse practical information about administrative bodies in Tunisia. Identify the right office and always confirm requirements and documents directly with the official authority."
    },
    "it": {
      "short": "Dovete svolgere una pratica amministrativa? Trovate servizi pubblici e contatti utili.",
      "long": "Questa sezione raccoglie informazioni pratiche sugli uffici e i servizi in Tunisia. Individuate l'ente competente e verificate sempre requisiti e documenti con l'autorità ufficiale."
    },
    "ru": {
      "short": "Нужно оформить документы? Найдите государственные службы и полезные контакты.",
      "long": "Раздел содержит справочную информацию об административных органах Туниса. Найдите нужную службу и уточняйте требования и перечень документов в официальном учреждении."
    }
  },
  "shops": {
    "fr": {
      "short": "Découvrez les commerces de proximité : alimentation, mode, beauté, maison, fleurs, cadeaux et bien plus.",
      "long": "Dalil Tounes vous aide à découvrir les boutiques de votre quartier et d'autres régions. Retrouvez leurs activités, leurs coordonnées et leurs présentations, lorsqu'elles sont disponibles. Une façon de mieux connaître les commerces tunisiens et de soutenir l'activité locale."
    },
    "ar": {
      "short": "اكتشف محلات قريبة منك: مواد غذائية، ملابس، تجميل، تجهيزات منزلية، ورود وهدايا.",
      "long": "دليل تونس يعاونك تكتشف المحلات في حومتك وفي الجهات الأخرى. شوف النشاط والمعلومات ووسائل الاتصال، حسب الموجود في البطاقات. فرصة باش تتعرّف أكثر على التجارة المحلية."
    },
    "en": {
      "short": "Discover local shops: food, fashion, beauty, home goods, flowers, gifts and more.",
      "long": "Browse businesses in your neighborhood or elsewhere in Tunisia. Find their activities, contact information and profiles when available. Discover local retailers and the services they offer."
    },
    "it": {
      "short": "Scoprite i negozi locali: alimentari, moda, bellezza, casa, fiori, regali e altro.",
      "long": "Esplorate le attività del vostro quartiere e di altre regioni tunisine. Consultate categorie, contatti e presentazioni disponibili. Un modo semplice per conoscere il commercio locale."
    },
    "ru": {
      "short": "Найдите магазины рядом: продукты, мода, косметика, товары для дома, цветы, подарки и многое другое.",
      "long": "Откройте для себя магазины своего района и других регионов Туниса. Смотрите ассортимент, контакты и описания, если они доступны. Узнавайте больше о местных торговых точках."
    }
  },
  "leisure": {
    "fr": {
      "short": "Envie de sortir ? Retrouvez les événements à venir, les festivals et les lieux de loisirs recommandés en Tunisie.",
      "long": "Concerts, foires, expositions, festivals ou sorties en famille : recherchez les événements par ville, date ou activité. Le calendrier aide à choisir une période et les lieux recommandés répondent aux critères d'avis Google indiqués sur la page."
    },
    "ar": {
      "short": "تحب تخرج؟ اكتشف الفعاليات الجاية والمهرجانات وأماكن الترفيه المقترحة في تونس.",
      "long": "حفلات، معارض، مهرجانات وخرجات عائلية: لوّج حسب المدينة والتاريخ والنشاط. الرزنامة تساعدك تختار الفترة، والأماكن الموصى بها تتبع شروط تقييمات Google المذكورة في الصفحة."
    },
    "en": {
      "short": "Looking for something to do? Explore upcoming events, festivals and recommended leisure places in Tunisia.",
      "long": "Search concerts, fairs, exhibitions, festivals and family outings by city, date or activity. The calendar helps you choose a period; recommended venues follow the Google review criteria shown on the page."
    },
    "it": {
      "short": "Voglia di uscire? Scoprite eventi, festival e luoghi consigliati per il tempo libero in Tunisia.",
      "long": "Cercate concerti, fiere, mostre, festival e attività per famiglie per città, data o tipo. Il calendario aiuta a scegliere il periodo; i luoghi consigliati seguono i criteri delle recensioni Google indicati."
    },
    "ru": {
      "short": "Ищете, куда сходить? Изучайте афишу, фестивали и рекомендуемые места отдыха в Тунисе.",
      "long": "Ищите концерты, ярмарки, выставки и семейные мероприятия по городу, дате и тематике. Календарь поможет выбрать период, а рекомендации основаны на указанных критериях отзывов Google."
    }
  },
  "tourism": {
    "fr": {
      "short": "Découvrez une Tunisie riche de ses villages, paysages, traditions, artisanats et sites historiques.",
      "long": "Des médinas aux oasis, des montagnes aux îles méditerranéennes : explorez les régions et leur patrimoine. Cette rubrique met aussi en lumière des lieux moins connus et des expériences locales. Vérifiez les conditions de visite avant de vous déplacer."
    },
    "ar": {
      "short": "اكتشف تونس بقراها وطبيعتها وتقاليدها وحرفها ومعالمها التاريخية.",
      "long": "من المدن العتيقة للواحات، ومن الجبال للجزر: اكتشف الجهات وتراثها. تلقى زادة أماكن أقل شهرة وتجارب محلية. تثبّت من أوقات وشروط الزيارة قبل التنقل."
    },
    "en": {
      "short": "Explore Tunisia through its villages, landscapes, traditions, crafts and historic places.",
      "long": "From medinas and oases to mountains and islands, discover local heritage and lesser-known places. Explore regional experiences and check visiting conditions before travelling."
    },
    "it": {
      "short": "Scoprite la Tunisia attraverso villaggi, paesaggi, tradizioni, artigianato e luoghi storici.",
      "long": "Dalle medine alle oasi, dalle montagne alle isole: esplorate il patrimonio regionale e luoghi meno conosciuti. Verificate le condizioni di visita prima di partire."
    },
    "ru": {
      "short": "Откройте Тунис: деревни, пейзажи, традиции, ремесла и исторические памятники.",
      "long": "От медин и оазисов до гор и островов — исследуйте наследие регионов и малоизвестные места. Перед поездкой уточняйте условия посещения."
    }
  },
  "settle": {
    "fr": {
      "short": "Vous préparez une installation en Tunisie ? Retrouvez des repères pour organiser vos démarches et votre quotidien.",
      "long": "Logement, administration, santé, école, emploi et services : ce guide vous aide à identifier les sujets à préparer et les interlocuteurs utiles. Les règles administratives peuvent évoluer : confirmez toujours les conditions officielles avant d'entreprendre une démarche."
    },
    "ar": {
      "short": "تحضّر باش تعيش في تونس؟ تلقى معلومات تعاونك تنظّم الإجراءات وحياتك اليومية.",
      "long": "سكن، إدارة، صحة، تعليم وخدمة: الدليل هذا يعاونك تحدّد الأمور اللي يلزمك تحضّرها والجهات المعنية. القوانين تتبدّل؛ ثبّت دائمًا المعلومات عند الجهات الرسمية."
    },
    "en": {
      "short": "Planning to live in Tunisia? Find practical guidance for preparing your move and daily life.",
      "long": "Housing, paperwork, health, schools, jobs and services: use this guide to identify key steps and useful contacts. Administrative rules may change, so confirm requirements with official authorities."
    },
    "it": {
      "short": "State pensando di trasferirvi in Tunisia? Trovate indicazioni per organizzare pratiche e vita quotidiana.",
      "long": "Casa, documenti, sanità, scuola, lavoro e servizi: questa guida aiuta a individuare i passi importanti. Le regole cambiano; verificate sempre i requisiti presso gli enti ufficiali."
    },
    "ru": {
      "short": "Планируете переехать в Тунис? Найдите ориентиры для оформления документов и повседневной жизни.",
      "long": "Жилье, документы, здоровье, школы, работа и услуги — основные вопросы переезда. Правила могут меняться: всегда уточняйте требования в официальных органах."
    }
  },
  "pros": {
    "fr": {
      "short": "Vous êtes entrepreneur ou professionnel ? Référencez votre activité gratuitement et découvrez les présentations CV Business et Portfolio.",
      "long": "Dalil Tounes permet aux artisans, commerçants et entreprises de présenter leur activité et d'être plus faciles à contacter. L'inscription Essentielle est gratuite. Les CV Business et Portfolio offrent une présentation enrichie et partageable par lien ou QR Business."
    },
    "ar": {
      "short": "عندك مؤسسة أو نشاط مهني؟ سجّلو مجانًا واكتشف عروض CV Business وPortfolio.",
      "long": "دليل تونس يعاون الحرفيين والتجار والمؤسسات يعرّفوا بخدماتهم ويسهّلوا التواصل مع الحرفاء. التسجيل الأساسي مجاني، وCV Business وPortfolio يقدّموا عرض أوسع يتشارك برابط أو QR Business."
    },
    "en": {
      "short": "Run a business? List it for free and explore the Business and Portfolio CV presentations.",
      "long": "Dalil Tounes helps artisans, shops and companies present their activities and make contact easier. An Essential listing is free, while Business and Portfolio CVs provide richer shareable profiles with a link or Business QR."
    },
    "it": {
      "short": "Avete un'attività? Registratela gratuitamente e scoprite le presentazioni CV Business e Portfolio.",
      "long": "Dalil Tounes aiuta artigiani, negozi e imprese a farsi conoscere e a essere contattati. La scheda Essentielle è gratuita; i CV Business e Portfolio offrono una presentazione più completa condivisibile via link o QR."
    },
    "ru": {
      "short": "Ведете бизнес? Добавьте его бесплатно и узнайте о презентациях Business CV и Portfolio.",
      "long": "Dalil Tounes помогает мастерам, магазинам и компаниям рассказать о себе и принимать обращения. Базовая карточка бесплатна; Business CV и Portfolio предлагают расширенное описание с ссылкой или QR-кодом."
    }
  },
  "jobs": {
    "fr": {
      "short": "Vous cherchez un emploi ou une opportunité professionnelle ? Explorez les offres et ressources disponibles.",
      "long": "Candidats, étudiants et employeurs peuvent consulter les annonces et outils professionnels disponibles. Utilisez les informations publiées pour identifier des pistes, préparer votre démarche et prendre contact avec les acteurs concernés."
    },
    "ar": {
      "short": "تلوّج على خدمة أو فرصة مهنية؟ اكتشف العروض والموارد الموجودة.",
      "long": "المترشحين والطلبة والمؤسسات ينجموا يشوفوا العروض والأدوات المهنية المتوفرة. استعمل المعلومات المنشورة باش تكتشف الفرص وتتصل بالجهات المعنية."
    },
    "en": {
      "short": "Looking for a job or professional opportunity? Explore available offers and resources.",
      "long": "Candidates, students and employers can browse listings and professional tools. Use published information to discover opportunities and contact the relevant people or organizations."
    },
    "it": {
      "short": "Cercate lavoro o nuove opportunità professionali? Esplorate offerte e risorse disponibili.",
      "long": "Candidati, studenti e datori di lavoro possono consultare annunci e strumenti. Usate le informazioni pubblicate per trovare opportunità e contattare le organizzazioni interessate."
    },
    "ru": {
      "short": "Ищете работу или профессиональные возможности? Изучайте предложения и ресурсы.",
      "long": "Соискатели, студенты и работодатели могут просматривать доступные объявления и инструменты. Используйте опубликованную информацию, чтобы искать возможности и связываться с организациями."
    }
  },
  "search": {
    "fr": {
      "short": "Trouvez l'entreprise ou le professionnel dont vous avez besoin grâce à la recherche par nom, activité ou ville.",
      "long": "Explorez les établissements référencés, utilisez les filtres disponibles et consultez leurs fiches Essentielles. Certaines entreprises proposent aussi un CV Business ou Portfolio plus détaillé. Les coordonnées affichées permettent de contacter directement l'établissement."
    },
    "ar": {
      "short": "تلقى المؤسسة أو المهني اللي تحتاجه بالبحث بالاسم أو النشاط أو المدينة.",
      "long": "اكتشف المؤسسات المسجّلة واستعمل الفلاتر وشوف البطاقات الأساسية. بعض المؤسسات عندها زادة CV Business أو Portfolio فيه تفاصيل أكثر. وسائل الاتصال الموجودة تخلّيك تتواصل مباشرة."
    },
    "en": {
      "short": "Find the business or professional you need by name, activity or city.",
      "long": "Explore listed businesses, use the filters and read their Essential profiles. Some also offer a more detailed Business or Portfolio CV. Available contact information helps you reach the business directly."
    },
    "it": {
      "short": "Trovate l'impresa o il professionista che cercate per nome, attività o città.",
      "long": "Esplorate le attività registrate, usate i filtri e consultate le schede Essentielle. Alcune imprese hanno anche CV Business o Portfolio più dettagliati. I contatti disponibili permettono di rivolgersi direttamente all'attività."
    },
    "ru": {
      "short": "Найдите компанию или специалиста по названию, виду деятельности или городу.",
      "long": "Используйте фильтры и изучайте базовые карточки организаций. У некоторых есть подробные Business CV или Portfolio. Доступные контакты помогают связаться с компанией напрямую."
    }
  }
};

const UI: Record<Lang, { more: string; less: string; label: string }> = {
  fr: { more: 'En savoir plus', less: 'Réduire', label: 'À propos de cette rubrique' },
  ar: { more: 'اعرف أكثر', less: 'إخفاء التفاصيل', label: 'على القسم هذا' },
  en: { more: 'Learn more', less: 'Show less', label: 'About this section' },
  it: { more: 'Scopri di più', less: 'Mostra meno', label: 'Informazioni sulla sezione' },
  ru: { more: 'Подробнее', less: 'Свернуть', label: 'Об этом разделе' },
};

function resolveIntro(pathname: string, search: string): IntroKey | null {
  if (pathname === '/') return 'home';
  if (pathname === '/citizens') return 'citizens';
  if (pathname === '/citizens/health' || pathname === '/citizens/sante') return 'health';
  if (pathname === '/education') return 'education';
  if (pathname === '/citizens/services' || pathname === '/citizens/admin') return 'services';
  if (pathname === '/citizens/shops' || pathname === '/citizens/magasins') return 'shops';
  if (pathname === '/citizens/leisure' || pathname === '/citizens/loisirs') return 'leisure';
  if (pathname === '/citizens/tourism' || pathname === '/citizens/tourisme') {
    return new URLSearchParams(search).get('tab') === 'settle' ? 'settle' : 'tourism';
  }
  if (pathname.startsWith('/citizens/tourism/guide/')) return 'tourism';
  if (pathname === '/subscription' || pathname === '/abonnement' || pathname === '/cv-business' || pathname === '/inscription-entreprise') return 'pros';
  if (pathname === '/emplois' || pathname === '/emploi' || pathname === '/jobs') return 'jobs';
  if (pathname === '/entreprises' || pathname === '/recherche' || pathname === '/businesses') return 'search';
  return null;
}

export default function PlatformAppIntro({ pathname, search = '', language, detailsOnly = false }: {
  pathname: string; search?: string; language: string; detailsOnly?: boolean;
}) {
  const key = resolveIntro(pathname, search);
  if (!key) return null;
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as Lang;
  const copy = CONTENT[key][lang];
  const ui = UI[lang];
  if (detailsOnly) return (
    <details className="group relative z-10 mt-2 w-full rounded-lg border border-[#D8C59C] bg-[#FFF9EC] px-3 py-2 text-[#45243A]">
      <summary className="inline-flex min-h-9 cursor-pointer list-none items-center gap-1.5 rounded-md text-xs font-semibold text-[#785823] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B99143] [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">{ui.more}</span>
        <span className="hidden group-open:inline">{ui.less}</span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-1 border-t border-[#E8DAC2] pt-2 text-xs leading-5 text-[#45243A]">{copy.long}</p>
    </details>
  );
  return (
    <section aria-label={ui.label} className="mx-3 mt-2 rounded-xl border border-[#E2D4BB] bg-white px-3 py-2.5 text-[#45243A]">
      <p className="text-xs leading-[1.55] text-[#655562]">{copy.short}</p>
      <details className="group mt-1.5">
        <summary className="inline-flex min-h-9 cursor-pointer list-none items-center gap-1.5 rounded-md py-1 text-xs font-semibold text-[#87672E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B99143] [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">{ui.more}</span>
          <span className="hidden group-open:inline">{ui.less}</span>
          <ChevronDown aria-hidden="true" className="h-4 w-4 transition-transform group-open:rotate-180" />
        </summary>
        <p className="mt-1 border-t border-[#EDE4D4] pt-2 text-xs leading-5 text-[#655562]">{copy.long}</p>
      </details>
    </section>
  );
}
