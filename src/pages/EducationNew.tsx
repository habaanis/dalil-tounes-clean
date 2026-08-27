import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  ChevronDown,
  Clock,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import MeilleursSection from '../components/MeilleursSection';
import { getSupabaseImageUrl } from '../lib/imageUtils';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';

interface JobOffer {
  id: string;
  title: string;
  company: string;
  city: string;
  contract_type: string;
  created_at: string;
}

interface EducationEvent {
  id: string;
  event_name: string;
  organizer?: string | null;
  event_date?: string | null;
  city?: string | null;
  registration_url?: string | null;
}

const translations = {
  fr: {
    title: "Éducation & Formation : Trouvez l'établissement idéal",
    welcome: "Votre guide complet pour l'éducation en Tunisie. De la maternelle à l'université, et pour la formation continue, Dalil Tounes vous aide à choisir le meilleur parcours. Comparez les programmes, consultez les avis des parents, et inscrivez vos enfants en toute confiance.",
    searchPlaceholder: "École primaire, Lycée, Cours de langue, Université...",
    cityPlaceholder: "Dans quelle ville / délégation ?",
    yourAddress: "Votre adresse pour calculer les distances",
    calculateDistance: "Calculer",
    searchBtn: "Rechercher",
    resetBtn: "Réinitialiser",
    filters: "Filtres",
    compare: "Comparer",
    compareSelected: "Comparer les établissements sélectionnés",
    selectToCompare: "Sélectionner pour comparer",
    selected: "sélectionné(s)",
    maxSelection: "Maximum 3 établissements",
    distance: "Distance",
    travelTime: "Temps estimé",
    minutes: "min",
    typeOptions: {
      all: "Tous",
      public: "Public",
      prive: "Privé",
      international: "International/Homologué"
    },
    niveauOptions: {
      all: "Tous niveaux",
      creche: "Crèche",
      primaire: "Primaire",
      lycee: "Lycée",
      superieur: "Supérieur"
    },
    langueOptions: {
      all: "Toutes",
      francais: "Français",
      anglais: "Anglais",
      arabe: "Arabe",
      autre: "Autre"
    },
    prixOptions: {
      all: "Tous",
      faible: "Frais faibles",
      moyen: "Frais moyens",
      eleve: "Frais élevés"
    },
    systemFilter: "Système & Langue",
    systemOptions: {
      all: "Tous les systèmes",
      francais: "Français (Mission)",
      anglais: "Anglais (IB/Cambridge)",
      arabe: "Arabe (National)",
      allemand: "Allemand",
      autre: "Autre International"
    },
    results: "résultats",
    noResults: "Aucun établissement trouvé",
    homologue: "Homologué Français",
    homologueEtr: "Homologation Étrangère",
    agrementMin: "Agrément Ministère",
    ratio: "Ratio",
    tauxReussite: "Taux réussite BAC",
    transport: "Transport scolaire",
    cantine: "Cantine",
    internat: "Internat",
    avis: "avis",
    virtualTour: "Visite virtuelle disponible",
    founded: "Fondé en",
    adminBlock: {
      title: "Documents requis pour l'inscription",
      desc: "Trouvez les démarches administratives nécessaires",
      link: "Accéder à la section Administrative"
    },
    partnerBlock: {
      title: "Portes Ouvertes & Événements",
      desc: "Découvrez les événements organisés par nos établissements partenaires",
      link: "Voir les événements"
    },
    careersBlock: {
      title: "Carrières dans l'Éducation",
      desc: "Découvrez les dernières opportunités d'emploi dans le secteur éducatif",
      noJobs: "Aucune offre disponible pour le moment",
      viewAll: "Voir toutes les offres d'emploi"
    },
    eventBanner: {
      title: "Vous organisez un événement scolaire ?",
      desc: "Journée portes ouvertes, forum d'orientation, inscriptions… Proposez vos événements aux familles de votre région.",
      cta: "Proposer un événement"
    },
    meilleurs: {
      secteurLabel: "établissements d'éducation",
      sectionTitle: "Entreprises les plus recommandées par les clients",
      blogTitle: "Bien choisir son école en Tunisie",
      blogExcerpt: "École publique, privée, cours particuliers... Comment s'y retrouver et faire le bon choix pour votre enfant ?"
    },
    events: {
      upcoming: "Événements à venir",
      filterByCity: "Filtrer par ville",
      allCities: "Toutes les villes",
      noneInCity: "Aucun événement à venir à",
      noneAtAll: "Aucun événement éducatif à venir pour le moment",
      register: "S'inscrire"
    }
  },
  en: {
    title: "Education & Training: Find the Ideal Institution",
    welcome: "Your complete guide to education in Tunisia. From kindergarten to university, and for all continuous training, Dalil Tounes helps you choose the best path. Compare programs, check parent reviews, and register your children with confidence.",
    searchPlaceholder: "Primary School, High School, Language Course, University...",
    cityPlaceholder: "In which city / delegation?",
    yourAddress: "Your address to calculate distances",
    calculateDistance: "Calculate",
    searchBtn: "Search",
    resetBtn: "Reset",
    filters: "Filters",
    compare: "Compare",
    compareSelected: "Compare selected schools",
    selectToCompare: "Select to compare",
    selected: "selected",
    maxSelection: "Maximum 3 schools",
    distance: "Distance",
    travelTime: "Estimated time",
    minutes: "min",
    typeOptions: {
      all: "All",
      public: "Public",
      prive: "Private",
      international: "International/Accredited"
    },
    niveauOptions: {
      all: "All levels",
      creche: "Nursery",
      primaire: "Primary",
      lycee: "High School",
      superieur: "Higher Education"
    },
    langueOptions: {
      all: "All",
      francais: "French",
      anglais: "English",
      arabe: "Arabic",
      autre: "Other"
    },
    prixOptions: {
      all: "All",
      faible: "Low fees",
      moyen: "Medium fees",
      eleve: "High fees"
    },
    systemFilter: "System & Language",
    systemOptions: {
      all: "All systems",
      francais: "French (Mission)",
      anglais: "English (IB/Cambridge)",
      arabe: "Arabic (National)",
      allemand: "German",
      autre: "Other International"
    },
    results: "results",
    noResults: "No institutions found",
    homologue: "French Accredited",
    homologueEtr: "Foreign Accreditation",
    agrementMin: "Ministry Approval",
    ratio: "Ratio",
    tauxReussite: "BAC Success Rate",
    transport: "School transport",
    cantine: "Canteen",
    internat: "Boarding",
    avis: "reviews",
    virtualTour: "Virtual tour available",
    founded: "Founded",
    adminBlock: {
      title: "Required Documents for Registration",
      desc: "Find the necessary administrative procedures",
      link: "Access Administrative Section"
    },
    partnerBlock: {
      title: "Open Days & Events",
      desc: "Discover events organized by our partner institutions",
      link: "View events"
    },
    careersBlock: {
      title: "Careers in Education",
      desc: "Discover the latest job opportunities in the education sector",
      noJobs: "No offers available at the moment",
      viewAll: "View all job offers"
    },
    eventBanner: {
      title: "Are you organizing a school event?",
      desc: "Open house, orientation fair, registrations… Share your events with families in your region.",
      cta: "Propose an event"
    },
    meilleurs: {
      secteurLabel: "education institutions",
      sectionTitle: "Most recommended businesses by customers",
      blogTitle: "Choosing the right school in Tunisia",
      blogExcerpt: "Public school, private, tutoring... How to find your way and make the right choice for your child?"
    },
    events: {
      upcoming: "Upcoming events",
      filterByCity: "Filter by city",
      allCities: "All cities",
      noneInCity: "No upcoming events in",
      noneAtAll: "No upcoming educational events at the moment",
      register: "Register"
    }
  },
  ar: {
    title: "التعليم والتكوين: اعثر على المؤسسة المثالية",
    welcome: "دليلك الشامل للتعليم في تونس. من رياض الأطفال إلى الجامعة، ومروراً بالتدريب المستمر، يساعدك دليل تونس على اختيار المسار الأفضل. قارن البرامج، واطلع على آراء أولياء الأمور، وسجل أطفالك بثقة.",
    searchPlaceholder: "مدرسة ابتدائية، معهد، دروس لغة، جامعة...",
    cityPlaceholder: "في أي مدينة / ولاية؟",
    yourAddress: "عنوانك لحساب المسافات",
    calculateDistance: "احسب",
    searchBtn: "بحث",
    resetBtn: "إعادة تعيين",
    filters: "التصفية",
    compare: "قارن",
    compareSelected: "قارن المدارس المختارة",
    selectToCompare: "حدد للمقارنة",
    selected: "محدد",
    maxSelection: "بحد أقصى 3 مدارس",
    distance: "المسافة",
    travelTime: "الوقت المقدر",
    minutes: "دقيقة",
    typeOptions: {
      all: "الكل",
      public: "عمومي",
      prive: "خاص",
      international: "دولي / معتمد"
    },
    niveauOptions: {
      all: "جميع المستويات",
      creche: "روضة",
      primaire: "ابتدائي",
      lycee: "ثانوي",
      superieur: "عالي"
    },
    langueOptions: {
      all: "الكل",
      francais: "فرنسي",
      anglais: "إنجليزي",
      arabe: "عربي",
      autre: "أخرى"
    },
    prixOptions: {
      all: "الكل",
      faible: "رسوم منخفضة",
      moyen: "رسوم متوسطة",
      eleve: "رسوم مرتفعة"
    },
    systemFilter: "النظام واللغة",
    systemOptions: {
      all: "جميع الأنظمة",
      francais: "فرنسي (بعثة)",
      anglais: "إنجليزي (IB/Cambridge)",
      arabe: "عربي (وطني)",
      allemand: "ألماني",
      autre: "دولي آخر"
    },
    results: "نتيجة",
    noResults: "لم يتم العثور على مؤسسات",
    homologue: "معتمد فرنسي",
    homologueEtr: "اعتماد أجنبي",
    agrementMin: "موافقة الوزارة",
    ratio: "النسبة",
    tauxReussite: "معدل نجاح البكالوريا",
    transport: "نقل مدرسي",
    cantine: "مقصف",
    internat: "سكن داخلي",
    avis: "تقييم",
    virtualTour: "جولة افتراضية متاحة",
    founded: "تأسست",
    adminBlock: {
      title: "المستندات المطلوبة للتسجيل",
      desc: "اعثر على الإجراءات الإدارية اللازمة",
      link: "الوصول إلى القسم الإداري"
    },
    partnerBlock: {
      title: "أيام مفتوحة وفعاليات",
      desc: "اكتشف الأحداث التي تنظمها مؤسساتنا الشريكة",
      link: "عرض الفعاليات"
    },
    careersBlock: {
      title: "وظائف في التعليم",
      desc: "اكتشف أحدث فرص العمل في قطاع التعليم",
      noJobs: "لا توجد عروض متاحة في الوقت الحالي",
      viewAll: "عرض جميع عروض العمل"
    },
    eventBanner: {
      title: "هل تنظم حدثاً مدرسياً؟",
      desc: "أيام مفتوحة، منتدى التوجيه، تسجيلات… اقترح فعالياتك على العائلات في منطقتك.",
      cta: "اقترح حدثاً"
    },
    meilleurs: {
      secteurLabel: "مؤسسات تعليمية",
      sectionTitle: "المؤسسات الأكثر توصية من قبل العملاء",
      blogTitle: "كيف تختار المدرسة المناسبة في تونس",
      blogExcerpt: "مدرسة عمومية، خاصة، دروس خصوصية... كيف تتعرف على الخيارات وتتخذ القرار المناسب لطفلك؟"
    },
    events: {
      upcoming: "الفعاليات القادمة",
      filterByCity: "تصفية حسب المدينة",
      allCities: "جميع المدن",
      noneInCity: "لا توجد فعاليات قادمة في",
      noneAtAll: "لا توجد فعاليات تعليمية قادمة في الوقت الحالي",
      register: "التسجيل"
    }
  }
};

const educationPageTranslations = {
  fr: {
    ...translations.fr,
    searchPreferredTitle: "Trouvez l'établissement adapté à votre parcours",
    searchPreferredSubtitle: "Recherchez une école, une université ou une formation en Tunisie"
  },
  en: {
    ...translations.en,
    searchPreferredTitle: 'Find the right institution for your path',
    searchPreferredSubtitle: 'Search for a school, university or training course in Tunisia'
  },
  ar: {
    ...translations.ar,
    searchPreferredTitle: 'اعثر على المؤسسة المناسبة لمسارك',
    searchPreferredSubtitle: 'ابحث عن مدرسة أو جامعة أو دورة تكوينية في تونس'
  },
  it: {
    ...translations.en,
    title: "Istruzione e formazione: trova l'istituto ideale",
    welcome: "La tua guida completa all'istruzione in Tunisia. Dalla scuola dell'infanzia all'università e alla formazione continua, Dalil Tounes ti aiuta a scegliere il percorso migliore. Confronta i programmi, consulta le recensioni dei genitori e iscrivi i tuoi figli con fiducia.",
    adminBlock: {
      title: "Documenti richiesti per l'iscrizione",
      desc: 'Trova le procedure amministrative necessarie',
      link: 'Vai alla sezione amministrativa'
    },
    partnerBlock: {
      title: 'Giornate aperte ed eventi',
      desc: 'Scopri gli eventi organizzati dai nostri istituti partner',
      link: 'Vedi gli eventi'
    },
    careersBlock: {
      title: "Carriere nell'istruzione",
      desc: "Scopri le ultime opportunità di lavoro nel settore dell'istruzione",
      noJobs: 'Nessuna offerta disponibile al momento',
      viewAll: 'Vedi tutte le offerte di lavoro'
    },
    eventBanner: {
      title: 'Organizzi un evento scolastico?',
      desc: 'Giornata aperta, fiera di orientamento, iscrizioni… Condividi i tuoi eventi con le famiglie della tua regione.',
      cta: 'Proponi un evento'
    },
    meilleurs: {
      secteurLabel: 'istituti di istruzione',
      sectionTitle: 'Le attività più consigliate dai clienti',
      blogTitle: 'Come scegliere la scuola giusta in Tunisia',
      blogExcerpt: 'Scuola pubblica, privata, lezioni individuali... Come orientarsi e fare la scelta giusta per tuo figlio?'
    },
    events: {
      upcoming: 'Prossimi eventi',
      filterByCity: 'Filtra per città',
      allCities: 'Tutte le città',
      noneInCity: 'Nessun prossimo evento a',
      noneAtAll: 'Nessun evento educativo in programma al momento',
      register: 'Iscriviti'
    },
    searchPreferredTitle: "Trova l'istituto adatto al tuo percorso",
    searchPreferredSubtitle: 'Cerca una scuola, università o formazione in Tunisia'
  },
  ru: {
    ...translations.en,
    title: 'Образование и обучение: найдите подходящее учебное заведение',
    welcome: 'Ваш полный путеводитель по образованию в Тунисе. От детского сада до университета и непрерывного обучения — Dalil Tounes поможет выбрать лучший путь. Сравнивайте программы, читайте отзывы родителей и уверенно записывайте детей на обучение.',
    adminBlock: {
      title: 'Документы, необходимые для поступления',
      desc: 'Узнайте о необходимых административных процедурах',
      link: 'Перейти в административный раздел'
    },
    partnerBlock: {
      title: 'Дни открытых дверей и мероприятия',
      desc: 'Узнайте о мероприятиях наших учебных заведений-партнёров',
      link: 'Посмотреть мероприятия'
    },
    careersBlock: {
      title: 'Карьера в образовании',
      desc: 'Откройте для себя новые вакансии в сфере образования',
      noJobs: 'В данный момент вакансий нет',
      viewAll: 'Посмотреть все вакансии'
    },
    eventBanner: {
      title: 'Организуете школьное мероприятие?',
      desc: 'День открытых дверей, профориентационная ярмарка, набор учащихся… Расскажите о мероприятии семьям вашего региона.',
      cta: 'Предложить мероприятие'
    },
    meilleurs: {
      secteurLabel: 'учебных заведений',
      sectionTitle: 'Компании, которые чаще всего рекомендуют клиенты',
      blogTitle: 'Как выбрать подходящую школу в Тунисе',
      blogExcerpt: 'Государственная или частная школа, индивидуальные занятия... Как разобраться и сделать правильный выбор для ребёнка?'
    },
    events: {
      upcoming: 'Предстоящие мероприятия',
      filterByCity: 'Фильтр по городу',
      allCities: 'Все города',
      noneInCity: 'Нет предстоящих мероприятий в городе',
      noneAtAll: 'В данный момент образовательных мероприятий не запланировано',
      register: 'Зарегистрироваться'
    },
    searchPreferredTitle: 'Найдите учебное заведение для своего пути',
    searchPreferredSubtitle: 'Ищите школы, университеты и учебные курсы в Тунисе'
  }
};

const dateLocales = {
  fr: 'fr-FR',
  en: 'en-GB',
  ar: 'ar-TN',
  it: 'it-IT',
  ru: 'ru-RU'
} as const;

export default function EducationNew() {
  const { language } = useLanguage();
  const t = educationPageTranslations[language as keyof typeof educationPageTranslations] || educationPageTranslations.fr;
  const dateLocale = dateLocales[language as keyof typeof dateLocales] || dateLocales.fr;
  const isRTL = language === 'ar';

  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [educationEvents, setEducationEvents] = useState<EducationEvent[]>([]);
  const [eventsCity, setEventsCity] = useState('');

  useEffect(() => {
    let isActive = true;

    const fetchJobOffers = async () => {
      try {
        const { data, error } = await supabase
          .from('job_postings')
          .select('id, title, company, city, contract_type, created_at')
          .ilike('category', '*enseignement*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        if (isActive) setJobOffers((data || []) as JobOffer[]);
      } catch (error) {
        console.error('Erreur chargement offres emploi:', error);
      }
    };

    fetchJobOffers();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const fetchEducationEvents = async () => {
      try {
        let query = supabase
          .from('featured_events')
          .select('id, event_name, organizer, event_date, city, registration_url')
          .eq('secteur_evenement', 'education')
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true })
          .limit(10);

        if (eventsCity) {
          query = query.ilike('city', `*${eventsCity}*`);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (isActive) setEducationEvents((data || []) as EducationEvent[]);
      } catch (error) {
        console.error('Erreur chargement événements éducation:', error);
      }
    };

    fetchEducationEvents();
    return () => {
      isActive = false;
    };
  }, [eventsCity]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section with Background Image */}
      <section
        className="relative text-white pb-10 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(74, 29, 67, 0.6), rgba(74, 29, 67, 0.6)), url(${getSupabaseImageUrl('classe-ecole.jpg')})`
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-3 py-8"
          >
            <h1 className="text-3xl md:text-4xl font-light mb-2 text-white drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>{t.title}</h1>
            <p className="text-base md:text-lg text-white leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              {t.welcome}
            </p>
          </motion.div>

        </div>
      </section>

      {/* SearchBar Éducation */}
      <section className="py-2 px-4 relative z-[9999]" style={{ overflow: 'visible' }}>
        <div className="max-w-5xl mx-auto" style={{ overflow: 'visible' }}>
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#D4AF37] p-2.5 md:p-3" style={{ overflow: 'visible' }}>
            <SearchBar
              scope="global"
              intentEnabled={false}
              enabled
              resultMode="redirectToResults"
              preferredTitle={t.searchPreferredTitle}
              preferredSubtitle={t.searchPreferredSubtitle}
            />
          </div>
        </div>
      </section>

      {/* Meilleurs établissements + article blog */}
      <section className="py-8 bg-white">
        <MeilleursSection
          secteurLabel={t.meilleurs.secteurLabel}
          listePage="éducation"
          accentColor="#4A1D43"
          sectionTitle={t.meilleurs.sectionTitle}
          blogArticle={{
            title: t.meilleurs.blogTitle,
            excerpt: t.meilleurs.blogExcerpt,
            slug: "bien-choisir-son-ecole"
          }}
          useGoogleRecommendationCriteria
        />
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-8" aria-label={t.eventBanner.title}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-[#FAF9F6] rounded-lg px-3 py-2 mb-6 shadow-sm border border-[#D4AF37]"
        >
          <h2 className="text-base md:text-lg font-semibold text-[#4A1D43] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t.eventBanner.title}
          </h2>
          <p className="text-xs text-gray-700 leading-snug mb-1.5">{t.eventBanner.desc}</p>
          <Link
            to="/education-event-form"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4A1D43] hover:bg-[#5A2D53] border border-[#D4AF37] text-[#D4AF37] hover:text-white font-semibold rounded-lg shadow-sm transition-all transform hover:scale-105 text-xs"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span>{t.eventBanner.cta}</span>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#4A1D43]/5 to-[#D4AF37]/5 rounded-2xl p-6 border border-[#D4AF37]"
          >
            <h2 className="text-lg font-semibold text-[#4A1D43] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{t.adminBlock.title}</h2>
            <p className="text-sm text-gray-600 mb-4">{t.adminBlock.desc}</p>
            <Link to="/citizens/services" className="inline-flex items-center gap-2 text-[#4A1D43] hover:text-[#D4AF37] font-medium text-sm transition-colors">
              {t.adminBlock.link}
              <ChevronDown className={`w-4 h-4 ${isRTL ? 'rotate-90' : '-rotate-90'}`} aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#4A1D43]/5 to-[#D4AF37]/5 rounded-2xl p-6 border border-[#D4AF37]"
          >
            <h2 className="text-lg font-semibold text-[#4A1D43] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{t.partnerBlock.title}</h2>
            <p className="text-sm text-gray-600 mb-4">{t.partnerBlock.desc}</p>
            <button
              type="button"
              onClick={() => document.getElementById('education-events-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="inline-flex items-center gap-2 text-[#4A1D43] hover:text-[#D4AF37] font-medium text-sm transition-colors"
            >
              {t.partnerBlock.link}
              <ChevronDown className={`w-4 h-4 ${isRTL ? 'rotate-90' : '-rotate-90'}`} aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Bloc Carrières dans l'Éducation - Version compacte */}
      <section className="max-w-7xl mx-auto px-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl px-4 py-4 border border-[#D4AF37] shadow-sm"
        >
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-[#4A1D43] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{t.careersBlock.title}</h2>
            <p className="text-xs text-gray-600">{t.careersBlock.desc}</p>
          </div>

          {jobOffers.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-3 mb-3">
              {jobOffers.map((job) => (
                <div key={job.id} className="bg-[#FAF9F6] rounded-lg px-3 py-2 border border-[#D4AF37]/30 hover:shadow-md transition">
                  <h3 className="font-semibold text-[#4A1D43] mb-1 text-sm">{job.title}</h3>
                  <p className="text-xs text-gray-600 mb-1">{job.company}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    <span>{job.city}</span>
                  </div>
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#D4AF37]/20 text-[#4A1D43] rounded-full text-[10px] font-medium">
                    {job.contract_type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mb-3 text-sm">{t.careersBlock.noJobs}</p>
          )}

          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A1D43] hover:bg-[#5A2D53] text-[#D4AF37] hover:text-white rounded-lg transition font-semibold text-xs border border-[#D4AF37]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.careersBlock.viewAll}
            <ChevronDown className={`w-3.5 h-3.5 ${isRTL ? 'rotate-90' : '-rotate-90'}`} />
          </Link>
        </motion.div>
      </section>

      {/* Section Événements Éducation (en bas avec ancre) - Version ultra compacte */}
      <section id="education-events-section" className="max-w-7xl mx-auto px-4 pb-6 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#4A1D43]/5 to-[#D4AF37]/5 rounded-xl px-3 py-3 border border-[#D4AF37] shadow-sm"
        >
          <div className="mb-2">
            <h2 className="text-lg font-semibold text-[#4A1D43]" style={{ fontFamily: "'Playfair Display', serif" }}>{t.events.upcoming}</h2>
          </div>

          {/* Filtre par ville */}
          <div className="mb-3 max-w-md">
            <label className="block text-xs font-medium text-[#4A1D43] mb-1.5">
              {t.events.filterByCity}
            </label>
            <select
              value={eventsCity}
              onChange={(e) => setEventsCity(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-[#D4AF37] focus:ring-2 focus:ring-[#4A1D43] focus:border-transparent text-sm"
            >
              <option value="">{t.events.allCities}</option>
              <option value="Tunis">Tunis</option>
              <option value="Ariana">Ariana</option>
              <option value="Ben Arous">Ben Arous</option>
              <option value="La Manouba">La Manouba</option>
              <option value="Nabeul">Nabeul</option>
              <option value="Sousse">Sousse</option>
              <option value="Monastir">Monastir</option>
              <option value="Sfax">Sfax</option>
              <option value="Bizerte">Bizerte</option>
            </select>
          </div>

          {/* Liste simplifiée des événements */}
          {educationEvents.length > 0 ? (
            <div className="space-y-2">
              {educationEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg px-3 py-2 border border-[#D4AF37]/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#4A1D43] mb-1 text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {event.event_name}
                      </h3>
                      {event.organizer && (
                        <p className="text-xs text-gray-600 mb-1.5">{event.organizer}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        {event.event_date && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0 text-[#D4AF37]" />
                            <span>
                              {new Date(event.event_date).toLocaleDateString(dateLocale, {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        )}
                        {event.city && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0 text-[#D4AF37]" />
                            <span>{event.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {event.registration_url && (
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 px-3 py-1.5 bg-[#4A1D43] hover:bg-[#5A2D53] border border-[#D4AF37] text-[#D4AF37] hover:text-white rounded-lg transition text-xs font-semibold"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {t.events.register}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {eventsCity
                  ? `${t.events.noneInCity} ${eventsCity}`
                  : t.events.noneAtAll}
              </p>
            </div>
          )}
        </motion.div>
      </section>

    </div>
  );
}
