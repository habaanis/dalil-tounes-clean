import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Search,
  MapPin,
  Award,
  Users,
  Euro,
  Bus,
  Star,
  ChevronDown,
  Filter,
  FileText,
  Briefcase,
  Globe,
  CheckCircle2,
  TrendingUp,
  Video,
  Navigation,
  Clock,
  Plus,
  X,
  Utensils,
  Home as HomeIcon,
  ArrowLeft,
  Calendar,
  Loader2,
  Tag
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';
import { supabase } from '../lib/supabaseClient';
import { Tables } from '../lib/dbTables';
import CityAutocomplete from '../components/CityAutocomplete';
import EducationCompare from '../components/EducationCompare';
import MeilleursSection from '../components/MeilleursSection';
import { getEducationCategoryLabel } from '../lib/educationCategories';
import { readParams } from '../lib/urlParams';
import UnifiedBusinessCard from '../components/UnifiedBusinessCard';
import { useNavigate } from '../lib/url';
import { getSupabaseImageUrl } from '../lib/imageUtils';
import BackButton from '../components/BackButton';
import { BusinessCard } from '../components/BusinessCard';
import { BusinessDetail } from '../components/BusinessDetail';

interface Etablissement {
  id: string;
  nom: string;
  type_etablissement: string;
  niveau_etude: string;
  systeme_enseignement: string;
  langue_principale: string;
  frais_scolarite_range: string;
  frais_min?: number;
  frais_max?: number;
  adresse: string;
  ville: string;
  delegation: string;
  telephone: string;
  email: string;
  site_web: string;
  description: string;
  accreditations: string[];
  homologue_francais: boolean;
  homologation_etrangere: boolean;
  agrement_ministre: boolean;
  ratio_eleves_enseignant?: number;
  ratio_eleves_prof?: number;
  taux_reussite_bac?: number;
  transport_scolaire: boolean;
  cantine: boolean;
  internat: boolean;
  latitude?: number;
  longitude?: number;
  note_moyenne: number;
  nombre_avis: number;
  niveau_abonnement: number;
  services_inclus?: string[];
  annee_fondation?: number;
  capacite_accueil?: number;
  langues_enseignees?: string[];
  activites_extra?: string[];
  lien_video_visite?: string;
  photos?: string[];
}

interface JobOffer {
  id: string;
  titre: string;
  entreprise: string;
  ville: string;
  type_contrat: string;
  created_at: string;
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
      sectionTitle: "Meilleurs établissements d'éducation",
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
      sectionTitle: "Best education institutions",
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
      sectionTitle: "أفضل مؤسسات التعليم",
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

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function EducationNew() {
  const { language } = useLanguage();
  const tGlobal = useTranslation(language);
  const t = translations[language as keyof typeof translations] || translations.fr;
  const isRTL = language === 'ar';
  const { q, ville } = readParams();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [niveauFilter, setNiveauFilter] = useState('all');
  const [langueFilter, setLangueFilter] = useState('all');
  const [prixFilter, setPrixFilter] = useState('all');
  const [systemFilter, setSystemFilter] = useState('all');

  const [isLoading, setIsLoading] = useState(false);
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [etablissementsWithDistance, setEtablissementsWithDistance] = useState<(Etablissement & {distance?: number, travelTime?: number})[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);

  const [selectedEducationBusiness, setSelectedEducationBusiness] = useState<any | null>(null);

  const [educationEvents, setEducationEvents] = useState<any[]>([]);
  const [eventsCity, setEventsCity] = useState('');

  const runSearch = async () => {
    setIsLoading(true);
    try {
      // TODO: Table etablissements_education en cours de création
      // Temporairement désactivé pour éviter les erreurs console
      /*
      let query = supabase
        .from('etablissements_education')
        .select('*');

      // Filtrer par page_categorie si la table l'a
      // Note: etablissements_education est une table dédiée, pas entreprise
      // Donc pas besoin de filtrer par page_categorie ici

      query = query
        .order('niveau_abonnement', { ascending: false })
        .order('note_moyenne', { ascending: false });

      if (keyword) {
        query = query.or(`nom.ilike.*${keyword}*,description.ilike.*${keyword}*`);
      }

      if (city) {
        query = query.or(`ville.ilike.*${city}*,delegation.ilike.*${city}*`);
      }

      if (typeFilter !== 'all') {
        const typeMap: Record<string, string> = {
          public: 'Public',
          prive: 'Privé',
          international: 'International'
        };
        query = query.eq('type_etablissement', typeMap[typeFilter]);
      }

      if (niveauFilter !== 'all') {
        const niveauMap: Record<string, string> = {
          creche: 'Crèche',
          primaire: 'Primaire',
          lycee: 'Lycée',
          superieur: 'Supérieur'
        };
        query = query.eq('niveau_etude', niveauMap[niveauFilter]);
      }

      if (langueFilter !== 'all') {
        const langueMap: Record<string, string> = {
          francais: 'Français',
          anglais: 'Anglais',
          arabe: 'Arabe',
          autre: 'Autre'
        };
        query = query.eq('langue_principale', langueMap[langueFilter]);
      }

      if (prixFilter !== 'all') {
        const prixMap: Record<string, string> = {
          faible: 'Faible',
          moyen: 'Moyen',
          eleve: 'Élevé'
        };
        query = query.eq('frais_scolarite_range', prixMap[prixFilter]);
      }

      if (systemFilter !== 'all') {
        const systemMap: Record<string, string> = {
          francais: 'Français',
          anglais: 'Anglais',
          arabe: 'National',
          allemand: 'Allemand',
          autre: 'International'
        };
        query = query.eq('systeme_enseignement', systemMap[systemFilter]);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEtablissements(data || []);

      if (userCoords && data) {
        const withDistance = data.map(etab => {
          if (etab.latitude && etab.longitude) {
            const dist = calculateDistance(userCoords.lat, userCoords.lng, etab.latitude, etab.longitude);
            const travelTime = Math.round((dist / 40) * 60);
            return { ...etab, distance: dist, travelTime };
          }
          return etab;
        });
        setEtablissementsWithDistance(withDistance);
      } else {
        setEtablissementsWithDistance(data || []);
      }
      */
      setEtablissements([]);
      setEtablissementsWithDistance([]);
    } catch (error) {
      console.error('Erreur recherche:', error);
      setEtablissements([]);
      setEtablissementsWithDistance([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDistances = async () => {
    if (!userAddress) return;

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            runSearch();
          },
          () => {
            alert(tGlobal.education.errors.geolocationDenied);
          }
        );
      }
    } catch (error) {
      console.error('Erreur géolocalisation:', error);
    }
  };

  const resetFilters = () => {
    setKeyword('');
    setCity('');
    setUserAddress('');
    setUserCoords(null);
    setTypeFilter('all');
    setNiveauFilter('all');
    setLangueFilter('all');
    setPrixFilter('all');
    setSystemFilter('all');
    setSelectedForCompare([]);
    setEtablissements([]);
    setEtablissementsWithDistance([]);
  };

  const toggleSelectForCompare = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      } else if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const fetchJobOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('id, title, company, city, contract_type, created_at')
        .ilike('category', '*enseignement*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setJobOffers(data || []);
    } catch (error) {
      console.error('Erreur chargement offres emploi:', error);
    }
  };

  useEffect(() => {
    fetchJobOffers();
    fetchEducationEvents();
  }, []);

  useEffect(() => {
    fetchEducationEvents();
  }, [eventsCity]);

  const fetchEducationEvents = async () => {
    try {
      let query = supabase
        .from('featured_events')
        .select('*')
        .eq('secteur_evenement', 'education')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(10);

      if (eventsCity) {
        query = query.ilike('city', `*${eventsCity}*`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setEducationEvents(data || []);
    } catch (error) {
      console.error('Erreur chargement événements éducation:', error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      // TODO: Table etablissements_education en cours de création
      // Temporairement désactivé pour éviter les erreurs console
      /*
      let query = supabase
        .from('etablissements_education')
        .select('*')
        .order('nom', { ascending: true })
        .limit(60);

      if (q) query = query.ilike('nom', `%${q}%`);
      if (ville) query = query.eq('gouvernorat', ville);

      const { data, error } = await query;
      if (error) {
        console.error('Erreur:', error);
        setEtablissements([]);
      } else {
        setEtablissements(data || []);
      }
      */
      setEtablissements([]);
      setIsLoading(false);
    })();
  }, [q, ville]);

  const displayedEtabs = userCoords ? etablissementsWithDistance : etablissements;

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

      <div className="max-w-5xl mx-auto px-4 py-6">

          {/* Bandeau informatif Événements Scolaires - Version compacte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-[#FAF9F6] rounded-lg px-3 py-2 mb-4 shadow-sm border border-[#D4AF37]"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-1.5">
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-semibold text-[#4A1D43] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t.eventBanner.title}
                </h3>
                <p className="text-xs text-gray-700 leading-snug mb-1.5">
                  {t.eventBanner.desc}
                </p>
                <a
                  href="#/education-event-form"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4A1D43] hover:bg-[#5A2D53] border border-[#D4AF37] text-[#D4AF37] hover:text-white font-semibold rounded-lg shadow-sm transition-all transform hover:scale-105 cursor-pointer text-xs"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{t.eventBanner.cta}</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* BARRE C SUPPRIMÉE - Barre de recherche principale avec filtres manuels (non connectée à Supabase)
          {(q || ville) && (
            <div className="mb-6 text-sm text-gray-500">
              {q && <>Recherche : <b>{q}</b> · </>}
              {ville && <>Ville : <b>{ville}</b></>}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <div className={`flex flex-col md:flex-row gap-3 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  data-search-bar="true"
                  data-search-scope="education"
                  data-component-name="EducationNew-Keyword"
                  className={`w-full ${isRTL ? 'pr-10 text-right' : 'pl-10'} py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 text-gray-900`}
                />
              </div>
              <div className="md:w-72">
                <CityAutocomplete
                  value={city}
                  onChange={setCity}
                  placeholder={t.cityPlaceholder}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden px-6 py-3 rounded-lg bg-white/20 hover:bg-white/30 text-white border border-white/30 transition flex items-center justify-center gap-2"
              >
                <Filter className="w-5 h-5" />
                {t.filters}
              </button>
            </div>

            <div className={`mt-4 flex ${isRTL ? 'flex-row-reverse' : ''} gap-3`}>
              <div className="flex-1 relative">
                <Navigation className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                <input
                  type="text"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  placeholder={t.yourAddress}
                  data-search-bar="true"
                  data-search-scope="adresse"
                  data-component-name="EducationNew-Address"
                  className={`w-full ${isRTL ? 'pr-10 text-right' : 'pl-10'} py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 text-gray-900`}
                />
              </div>
              <button
                onClick={calculateDistances}
                disabled={!userAddress}
                className="px-6 py-3 rounded-lg bg-[#4A1D43] hover:bg-[#5A2D53] border-2 border-[#D4AF37] text-[#D4AF37] hover:text-white font-semibold transition shadow-lg disabled:opacity-50 flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <MapPin className="w-5 h-5" />
                {t.calculateDistance}
              </button>
            </div>

            <div className={`mt-4 grid grid-cols-1 md:grid-cols-5 gap-3 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
              >
                <option value="all">{t.typeOptions.all}</option>
                <option value="public">{t.typeOptions.public}</option>
                <option value="prive">{t.typeOptions.prive}</option>
                <option value="international">{t.typeOptions.international}</option>
              </select>

              <select
                value={niveauFilter}
                onChange={(e) => setNiveauFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
              >
                <option value="all">{t.niveauOptions.all}</option>
                <option value="creche">{t.niveauOptions.creche}</option>
                <option value="primaire">{t.niveauOptions.primaire}</option>
                <option value="lycee">{t.niveauOptions.lycee}</option>
                <option value="superieur">{t.niveauOptions.superieur}</option>
              </select>

              <select
                value={langueFilter}
                onChange={(e) => setLangueFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
              >
                <option value="all">{t.langueOptions.all}</option>
                <option value="francais">{t.langueOptions.francais}</option>
                <option value="anglais">{t.langueOptions.anglais}</option>
                <option value="arabe">{t.langueOptions.arabe}</option>
                <option value="autre">{t.langueOptions.autre}</option>
              </select>

              <select
                value={prixFilter}
                onChange={(e) => setPrixFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
              >
                <option value="all">{t.prixOptions.all}</option>
                <option value="faible">{t.prixOptions.faible}</option>
                <option value="moyen">{t.prixOptions.moyen}</option>
                <option value="eleve">{t.prixOptions.eleve}</option>
              </select>

              <select
                value={systemFilter}
                onChange={(e) => setSystemFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
              >
                <option value="all">{t.systemOptions.all}</option>
                <option value="francais">{t.systemOptions.francais}</option>
                <option value="anglais">{t.systemOptions.anglais}</option>
                <option value="arabe">{t.systemOptions.arabe}</option>
                <option value="allemand">{t.systemOptions.allemand}</option>
                <option value="autre">{t.systemOptions.autre}</option>
              </select>
            </div>

            <div className={`mt-4 flex ${isRTL ? 'flex-row-reverse' : ''} gap-3`}>
              <button
                onClick={runSearch}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium transition shadow-lg disabled:opacity-50"
              >
                {t.searchBtn}
              </button>
              <button
                onClick={resetFilters}
                className="px-6 py-3 rounded-lg bg-white/20 hover:bg-white/30 text-white border border-white/30 transition"
              >
                {t.resetBtn}
              </button>
            </div>
          </motion.div>
          */}

          {/* Blocs d'information */}
          <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#4A1D43]/5 to-[#D4AF37]/5 rounded-2xl p-6 border border-[#D4AF37]"
          >
            <h3 className="text-lg font-semibold text-[#4A1D43] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{t.adminBlock.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{t.adminBlock.desc}</p>
            <a
              href="#/citizens/admin"
              className="inline-flex items-center gap-2 text-[#4A1D43] hover:text-[#D4AF37] font-medium text-sm transition-colors"
            >
              {t.adminBlock.link}
              <ChevronDown className={`w-4 h-4 ${isRTL ? 'rotate-90' : '-rotate-90'}`} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#4A1D43]/5 to-[#D4AF37]/5 rounded-2xl p-6 border border-[#D4AF37]"
          >
            <h3 className="text-lg font-semibold text-[#4A1D43] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{t.partnerBlock.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{t.partnerBlock.desc}</p>
            <button
              onClick={() => {
                const eventsSection = document.getElementById('education-events-section');
                eventsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="inline-flex items-center gap-2 text-[#4A1D43] hover:text-[#D4AF37] font-medium text-sm transition-colors"
            >
              {t.partnerBlock.link}
              <ChevronDown className={`w-4 h-4 ${isRTL ? 'rotate-90' : '-rotate-90'}`} />
            </button>
          </motion.div>
            </div>
          </section>
        </div>

      {/* Bouton comparaison flottant */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-8 right-8 z-40">
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setShowCompare(true)}
            className="bg-gradient-to-r from-[#4A1D43] to-[#6B2D5C] border-2 border-[#D4AF37] text-[#D4AF37] px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <Award className="w-6 h-6" />
            <div className="text-left">
              <div className="text-sm font-semibold">{t.compare}</div>
              <div className="text-xs opacity-90">{selectedForCompare.length} {t.selected}</div>
            </div>
          </motion.button>
        </div>
      )}

      {/* Modal comparaison */}
      {showCompare && selectedForCompare.length >= 2 && (
        <EducationCompare
          etablissements={displayedEtabs.filter(e => selectedForCompare.includes(e.id))}
          onClose={() => setShowCompare(false)}
          language={language}
        />
      )}

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
        />
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
                  <h3 className="font-semibold text-[#4A1D43] mb-1 text-sm">{job.titre}</h3>
                  <p className="text-xs text-gray-600 mb-1">{job.entreprise}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    <span>{job.ville}</span>
                  </div>
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#D4AF37]/20 text-[#4A1D43] rounded-full text-[10px] font-medium">
                    {job.type_contrat}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mb-3 text-sm">{t.careersBlock.noJobs}</p>
          )}

          <a
            href="#/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A1D43] hover:bg-[#5A2D53] text-[#D4AF37] hover:text-white rounded-lg transition font-semibold text-xs border border-[#D4AF37]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.careersBlock.viewAll}
            <ChevronDown className={`w-3.5 h-3.5 ${isRTL ? 'rotate-90' : '-rotate-90'}`} />
          </a>
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
                              {new Date(event.event_date).toLocaleDateString('fr-FR', {
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

      {/* Modal de détails entreprise */}
      {selectedEducationBusiness && (
        <BusinessDetail
          business={selectedEducationBusiness}
          onClose={() => setSelectedEducationBusiness(null)}
          asModal={true}
        />
      )}
    </div>
  );
}
