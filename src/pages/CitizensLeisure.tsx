import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, DollarSign, Ticket, Music, Sparkles, PartyPopper, ChevronLeft, ChevronRight, Camera, Waves, Utensils, Film, MapPinned, Plus, X, ExternalLink } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { supabase } from '../lib/BoltDatabase';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../lib/i18n';
import { getSupabaseImageUrl } from '../lib/imageUtils';
import { HERO_IMAGE_URL } from '../constants/images';
import EventCard from '../components/EventCard';
import AppLeisureEventCard from '../components/AppLeisureEventCard';
import LeisureEventProposalForm from '../components/LeisureEventProposalForm';
import { SECTEURS_CULTURE } from '../lib/cultureEventCategories';
import MeilleursSection from '../components/MeilleursSection';
import { SEOHead } from '../components/SEOHead';
import { isPlatformAppMode } from '../lib/platformAppMode';
import { DALIL_MASCOT_IMAGE } from '../lib/dalilMascotImage';

const GOUVERNORATS_TUNISIE = [
  'Tunis',
  'Ariana',
  'Ben Arous',
  'Manouba',
  'Nabeul',
  'Zaghouan',
  'Bizerte',
  'Béja',
  'Le Kef',
  'Siliana',
  'Sousse',
  'Monastir',
  'Mahdia',
  'Sfax',
  'Kairouan',
  'Kasserine',
  'Sidi Bouzid',
  'Gabès',
  'Medenine',
  'Tataouine',
  'Gafsa',
  'Tozeur',
  'Kebili',
  'Jendouba'
];

const ACTIVITY_LABELS: Record<Language, Record<string, string>> = {
  fr: {
    'Saveurs & Traditions': 'Saveurs & Traditions',
    'Musée & Patrimoine': 'Musée & Patrimoine',
    'Escapades & Nature': 'Escapades & Nature',
    'Festivals & artisanat': 'Festivals & artisanat',
    'Sport & Aventure': 'Sport & Aventure',
    'Art & Culture': 'Art & Culture',
    'Sorties & Soirées': 'Sorties & Soirées',
  },
  en: {
    'Saveurs & Traditions': 'Flavours & Traditions',
    'Musée & Patrimoine': 'Museums & Heritage',
    'Escapades & Nature': 'Nature Getaways',
    'Festivals & artisanat': 'Festivals & Crafts',
    'Sport & Aventure': 'Sport & Adventure',
    'Art & Culture': 'Art & Culture',
    'Sorties & Soirées': 'Outings & Nightlife',
  },
  ar: {
    'Saveurs & Traditions': 'النكهات والتقاليد',
    'Musée & Patrimoine': 'المتاحف والتراث',
    'Escapades & Nature': 'رحلات وطبيعة',
    'Festivals & artisanat': 'مهرجانات وحرف',
    'Sport & Aventure': 'رياضة ومغامرة',
    'Art & Culture': 'فن وثقافة',
    'Sorties & Soirées': 'خروجات وسهرات',
  },
  it: {
    'Saveurs & Traditions': 'Sapori & Tradizioni',
    'Musée & Patrimoine': 'Musei & Patrimonio',
    'Escapades & Nature': 'Escursioni & Natura',
    'Festivals & artisanat': 'Festival & Artigianato',
    'Sport & Aventure': 'Sport & Avventura',
    'Art & Culture': 'Arte & Cultura',
    'Sorties & Soirées': 'Uscite & Vita notturna',
  },
  ru: {
    'Saveurs & Traditions': 'Вкусы и традиции',
    'Musée & Patrimoine': 'Музеи и наследие',
    'Escapades & Nature': 'Природа и поездки',
    'Festivals & artisanat': 'Фестивали и ремёсла',
    'Sport & Aventure': 'Спорт и приключения',
    'Art & Culture': 'Искусство и культура',
    'Sorties & Soirées': 'Отдых и вечерняя жизнь',
  },
};

interface Evenement {
  id: string;
  titre: string;
  titre_ar?: string;
  titre_en?: string;
  titre_it?: string;
  titre_ru?: string;
  description: string;
  description_ar?: string;
  description_en?: string;
  description_it?: string;
  description_ru?: string;
  description_courte?: string;
  date_debut: string;
  date_fin: string;
  localisation_ville: string;
  lieu?: string;
  prix: string;
  type_evenement: string;
  type_affichage?: string;
  lien_billetterie?: string;
  image_url?: string;
  telephone_contact?: string;
  niveau_abonnement: string;
  organisateur?: string;
  est_annuel?: boolean;
  secteur_evenement?: string;
  note_moyenne?: number;
  nombre_avis?: number;
}

export default function CitizensLeisure() {
  const { language } = useLanguage();
  const inPlatformApp = isPlatformAppMode();
  const [appSection, setAppSection] = useState<'recommended' | 'agenda' | 'events'>('events');
  const [eventPage, setEventPage] = useState(0);
  const [calendarYear, setCalendarYear] = useState('all');
  const [calendarMonth, setCalendarMonth] = useState('all');
  const [calendarPage, setCalendarPage] = useState(0);
  const [openedEvent, setOpenedEvent] = useState<Evenement | null>(null);

  const url = new URL(window.location.href);
  const qParam = (url.searchParams.get('q') || '').trim();
  const villeParam = (url.searchParams.get('ville') || '').trim();
  const categoryParam = url.searchParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState(qParam);
  const [selectedLocation, setSelectedLocation] = useState(villeParam || 'all');
  const [selectedTemporalite, setSelectedTemporalite] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedActivityType, setSelectedActivityType] = useState(categoryParam || 'all');
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Evenement[]>([]);
  const [weeklyEvent, setWeeklyEvent] = useState<Evenement | null>(null);
  const [monthlyEvent, setMonthlyEvent] = useState<Evenement | null>(null);
  const [annualEvent, setAnnualEvent] = useState<Evenement | null>(null);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const eventResultsRef = useRef<HTMLDivElement>(null);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [showProposalForm, setShowProposalForm] = useState(false);

  const translations = {
    fr: {
      title: 'Agenda Loisirs & événements',
      seoTitle: 'Loisirs et événements en Tunisie | Dalil Tounes',
      subtitle: 'Votre guide Premium des sorties en Tunisie.',
      description: 'Marre de l\'ennui ? Devenez l\'expert de votre propre ville ! De la plage la plus secrète au festival incontournable, Dalil Tounes vous connecte aux meilleures activités et événements de votre ville et de toute la Tunisie.',
      backButton: 'Retour aux catégories',
      premiumAgenda: {
        weekly: {
          badge: 'Cette Semaine',
          title: 'Concert de Malouf',
          date: 'Vendredi 7 Fév.',
          location: 'Médina de Mahdia'
        },
        monthly: {
          badge: 'Ce Mois-ci',
          title: 'Festival des Cerfs-Volants',
          date: 'Du 15 au 20 Fév.',
          location: 'Plage de Mahdia'
        },
        annual: {
          badge: 'Événements Annuels',
          title: 'Festival International de Musique Symphonique',
          date: 'Été 2026',
          location: 'Amphithéâtre d\'El Jem'
        }
      },
      tabEvents: 'ÉVÉNEMENTS',
      tabPlaces: 'LIEUX PERMANENTS',
      searchPlaceholder: 'Ex: cinéma, festival, plage, concert...',
      locationAll: 'Toute la Tunisie',
      temporaliteAll: 'Toutes les dates',
      temporaliteWeekly: 'Cette Semaine',
      temporaliteMonthly: 'Ce Mois-ci',
      temporaliteAnnual: 'Cette Année',
      kidsAccessible: 'Accessible aux enfants',
      priceAll: 'Tous les prix',
      priceFree: 'Gratuit',
      pricePaid: 'Payant',
      featured: 'À la Une - Événements',
      buyTickets: 'Acheter des billets',
      moreInfo: 'Plus d\'infos',
      noEvents: 'Aucun événement trouvé',
      noPlaces: 'Aucun lieu trouvé',
      modifyFilters: 'Essayez de modifier vos filtres',
      touristInfo: 'Vous êtes visiteur ? Découvrez notre guide des Sites Historiques avec accès aux informations en Anglais/Français.',
      touristLink: 'Guide Touristique',
      organizer: 'Organisé par',
      from: 'Du',
      to: 'au',
      loading: 'Chargement...',
      authenticTourism: 'Découvrez la Tunisie des Terres. Loin des circuits balisés et du béton des hôtels, l\'âme de la Tunisie se cache dans ses villages de montagne, ses sites antiques méconnus et le savoir-faire de ses artisans. Nous avons sélectionné pour vous des expériences authentiques pour valoriser notre patrimoine et soutenir l\'économie locale.',
      authenticTourismHighlight: 'Explorez l\'intérieur, rencontrez l\'histoire.',
      proposeEvent: 'Proposer un événement loisir',
      sector: 'loisirs et événements',
      recommended: 'Entreprises les plus recommandées par les clients',
      allReferenced: 'Tous les lieux de loisirs référencés',
      searchOther: 'Rechercher d\'autres lieux de loisirs',
      eventsIntro: 'Recherchez un événement à venir par ville, activité, date ou prix.',
      activityAll: 'Tous les types',
      activeFilter: 'Filtre actif',
      clearFilter: 'Effacer le filtre'
    },
    en: {
      title: 'Leisure & Events Agenda',
      seoTitle: 'Leisure and events in Tunisia | Dalil Tounes',
      subtitle: 'Your Premium guide to outings in Tunisia.',
      description: 'Your source of inspiration for outings! Find the nearest cinema, the best beach, or discover upcoming cultural events, festivals and concerts. From local to national, plan your free time with Dalil Tounes.',
      backButton: 'Back to categories',
      premiumAgenda: {
        weekly: {
          badge: 'This Week',
          title: 'Malouf Concert',
          date: 'Friday, Feb 7',
          location: 'Mahdia Medina'
        },
        monthly: {
          badge: 'This Month',
          title: 'Kite Festival',
          date: 'Feb 15-20',
          location: 'Mahdia Beach'
        },
        annual: {
          badge: 'Annual Events',
          title: 'International Symphonic Music Festival',
          date: 'Summer 2026',
          location: 'El Jem Amphitheater'
        }
      },
      tabEvents: 'EVENTS',
      tabPlaces: 'PERMANENT PLACES',
      searchPlaceholder: 'Ex: cinema, festival, beach, concert...',
      locationAll: 'All Tunisia',
      temporaliteAll: 'All dates',
      temporaliteWeekly: 'This Week',
      temporaliteMonthly: 'This Month',
      temporaliteAnnual: 'This Year',
      kidsAccessible: 'Kids friendly',
      priceAll: 'All prices',
      priceFree: 'Free',
      pricePaid: 'Paid',
      featured: 'Featured Events',
      buyTickets: 'Buy tickets',
      moreInfo: 'More info',
      noEvents: 'No events found',
      noPlaces: 'No places found',
      modifyFilters: 'Try modifying your filters',
      touristInfo: 'Are you a visitor? Discover our Historical Sites guide with access to information in English/French.',
      touristLink: 'Tourist Guide',
      organizer: 'Organized by',
      from: 'From',
      to: 'to',
      loading: 'Loading...',
      authenticTourism: 'Discover Authentic Tunisia. Far from standard tourist circuits and hotel concrete, Tunisia\'s soul lies in its mountain villages, ancient hidden sites, and artisan craftsmanship. We\'ve selected authentic experiences to showcase our heritage and support the local economy.',
      authenticTourismHighlight: 'Explore the interior, meet history.',
      proposeEvent: 'Propose a leisure event',
      sector: 'leisure and events',
      recommended: 'Businesses most recommended by customers',
      allReferenced: 'All listed leisure venues',
      searchOther: 'Search for other leisure venues',
      eventsIntro: 'Search upcoming events by city, activity, date or price.',
      activityAll: 'All types',
      activeFilter: 'Active filter',
      clearFilter: 'Clear filter'
    },
    ar: {
      title: 'أجندة الترفيه والفعاليات',
      seoTitle: 'الترفيه والفعاليات في تونس | دليل تونس',
      subtitle: 'دليلك البريميوم للخروجات في تونس.',
      description: 'مصدر إلهامك للخروج! ابحث عن أقرب سينما، أفضل شاطئ، أو اكتشف الفعاليات الثقافية والمهرجانات والحفلات القادمة. من المحلي إلى الوطني، خطط لوقت فراغك مع دليل تونس.',
      backButton: 'العودة إلى الفئات',
      premiumAgenda: {
        weekly: {
          badge: 'هذا الأسبوع',
          title: 'حفل المالوف',
          date: 'الجمعة 7 فبراير',
          location: 'مدينة المهدية العتيقة'
        },
        monthly: {
          badge: 'هذا الشهر',
          title: 'مهرجان الطائرات الورقية',
          date: 'من 15 إلى 20 فبراير',
          location: 'شاطئ المهدية'
        },
        annual: {
          badge: 'الفعاليات السنوية',
          title: 'مهرجان الموسيقى السيمفونية الدولي',
          date: 'صيف 2026',
          location: 'مسرح الجم الروماني'
        }
      },
      tabEvents: 'الفعاليات',
      tabPlaces: 'الأماكن الدائمة',
      searchPlaceholder: 'مثال: سينما، مهرجان، شاطئ، حفل...',
      locationAll: 'كل تونس',
      temporaliteAll: 'جميع التواريخ',
      temporaliteWeekly: 'هذا الأسبوع',
      temporaliteMonthly: 'هذا الشهر',
      temporaliteAnnual: 'هذا العام',
      kidsAccessible: 'مناسب للأطفال',
      priceAll: 'جميع الأسعار',
      priceFree: 'مجاني',
      pricePaid: 'مدفوع',
      featured: 'الفعاليات المميزة',
      buyTickets: 'شراء التذاكر',
      moreInfo: 'المزيد من المعلومات',
      noEvents: 'لم يتم العثور على فعاليات',
      noPlaces: 'لم يتم العثور على أماكن',
      modifyFilters: 'حاول تعديل المرشحات',
      touristInfo: 'هل أنت زائر؟ اكتشف دليل المواقع التاريخية مع الوصول إلى المعلومات بالإنجليزية/الفرنسية.',
      touristLink: 'دليل السياحة',
      organizer: 'منظم من قبل',
      from: 'من',
      to: 'إلى',
      loading: 'جاري التحميل...',
      authenticTourism: 'اكتشف تونس الأصيلة. بعيداً عن المسارات السياحية المعتادة وخرسانة الفنادق، تكمن روح تونس في قراها الجبلية ومواقعها الأثرية المخفية وحرفية حرفييها. لقد اخترنا لك تجارب أصيلة لتسليط الضوء على تراثنا ودعم الاقتصاد المحلي.',
      authenticTourismHighlight: 'استكشف الداخل، التقِ بالتاريخ.',
      proposeEvent: 'اقترح حدثاً ترفيهياً',
      sector: 'الترفيه والفعاليات',
      recommended: 'المؤسسات الأكثر توصية من قبل العملاء',
      allReferenced: 'جميع أماكن الترفيه المسجلة',
      searchOther: 'البحث عن أماكن ترفيه أخرى',
      eventsIntro: 'ابحث عن فعالية قادمة حسب المدينة أو النشاط أو التاريخ أو السعر.',
      activityAll: 'جميع الأنواع',
      activeFilter: 'المرشح النشط',
      clearFilter: 'مسح المرشح'
    },
    it: {
      title: 'Agenda Tempo Libero ed Eventi',
      seoTitle: 'Tempo libero ed eventi in Tunisia | Dalil Tounes',
      subtitle: 'La tua guida Premium alle uscite in Tunisia.',
      description: 'La tua fonte di ispirazione per le uscite! Trova il cinema più vicino, la migliore spiaggia, o scopri eventi culturali, festival e concerti in arrivo. Dal locale al nazionale, pianifica il tuo tempo libero con Dalil Tounes.',
      backButton: 'Torna alle categorie',
      premiumAgenda: {
        weekly: {
          badge: 'Questa Settimana',
          title: 'Concerto di Malouf',
          date: 'Venerdì 7 Feb.',
          location: 'Medina di Mahdia'
        },
        monthly: {
          badge: 'Questo Mese',
          title: 'Festival degli Aquiloni',
          date: 'Dal 15 al 20 Feb.',
          location: 'Spiaggia di Mahdia'
        },
        annual: {
          badge: 'Eventi Annuali',
          title: 'Festival Internazionale di Musica Sinfonica',
          date: 'Estate 2026',
          location: 'Anfiteatro di El Jem'
        }
      },
      tabEvents: 'EVENTI',
      tabPlaces: 'LUOGHI PERMANENTI',
      searchPlaceholder: 'Es: cinema, festival, spiaggia, concerto...',
      locationAll: 'Tutta la Tunisia',
      locationMahdia: 'Mahdia',
      locationCenter: 'Regione Centro',
      locationNorth: 'Regione Nord',
      locationSouth: 'Regione Sud',
      temporaliteAll: 'Tutte le date',
      temporaliteWeekly: 'Questa Settimana',
      temporaliteMonthly: 'Questo Mese',
      temporaliteAnnual: 'Quest\'Anno',
      kidsAccessible: 'Adatto ai bambini',
      priceAll: 'Tutti i prezzi',
      priceFree: 'Gratuito',
      pricePaid: 'A pagamento',
      featured: 'Eventi in Evidenza',
      buyTickets: 'Acquista biglietti',
      moreInfo: 'Più informazioni',
      noEvents: 'Nessun evento trovato',
      noPlaces: 'Nessun luogo trovato',
      modifyFilters: 'Prova a modificare i filtri',
      touristInfo: 'Sei un visitatore? Scopri la nostra guida ai Siti Storici con accesso alle informazioni in Inglese/Francese.',
      touristLink: 'Guida Turistica',
      organizer: 'Organizzato da',
      from: 'Dal',
      to: 'al',
      loading: 'Caricamento...',
      authenticTourism: 'Scopri la Tunisia Autentica. Lontano dai circuiti turistici standard e dal cemento degli hotel, l\'anima della Tunisia si trova nei suoi villaggi di montagna, nei siti antichi nascosti e nell\'artigianato. Abbiamo selezionato esperienze autentiche per valorizzare il nostro patrimonio e sostenere l\'economia locale.',
      authenticTourismHighlight: 'Esplora l\'interno, incontra la storia.',
      proposeEvent: 'Proponi un evento per il tempo libero',
      sector: 'tempo libero ed eventi',
      recommended: 'Le aziende più consigliate dai clienti',
      allReferenced: 'Tutti i luoghi per il tempo libero registrati',
      searchOther: 'Cerca altri luoghi per il tempo libero',
      eventsIntro: 'Cerca i prossimi eventi per città, attività, data o prezzo.',
      activityAll: 'Tutti i tipi',
      activeFilter: 'Filtro attivo',
      clearFilter: 'Cancella filtro'
    },
    ru: {
      title: 'Программа Досуга и Мероприятий',
      seoTitle: 'Досуг и мероприятия в Тунисе | Dalil Tounes',
      subtitle: 'Ваш премиум-гид по развлечениям в Тунисе.',
      description: 'Ваш источник вдохновения для прогулок! Найдите ближайший кинотеатр, лучший пляж или откройте для себя предстоящие культурные мероприятия, фестивали и концерты. От местного до национального, планируйте свое свободное время с Dalil Tounes.',
      backButton: 'Вернуться к категориям',
      premiumAgenda: {
        weekly: {
          badge: 'На Этой Неделе',
          title: 'Концерт Малуфа',
          date: 'Пятница, 7 Февраля',
          location: 'Медина Махдии'
        },
        monthly: {
          badge: 'В Этом Месяце',
          title: 'Фестиваль Воздушных Змеев',
          date: 'С 15 по 20 Февр.',
          location: 'Пляж Махдии'
        },
        annual: {
          badge: 'Ежегодные События',
          title: 'Международный Фестиваль Симфонической Музыки',
          date: 'Лето 2026',
          location: 'Амфитеатр Эль-Джема'
        }
      },
      tabEvents: 'МЕРОПРИЯТИЯ',
      tabPlaces: 'ПОСТОЯННЫЕ МЕСТА',
      searchPlaceholder: 'Например: кино, фестиваль, пляж, концерт...',
      locationAll: 'Весь Тунис',
      locationMahdia: 'Махдия',
      locationCenter: 'Центральный регион',
      locationNorth: 'Северный регион',
      locationSouth: 'Южный регион',
      temporaliteAll: 'Все даты',
      temporaliteWeekly: 'На Этой Неделе',
      temporaliteMonthly: 'В Этом Месяце',
      temporaliteAnnual: 'В Этом Году',
      kidsAccessible: 'Подходит для детей',
      priceAll: 'Все цены',
      priceFree: 'Бесплатно',
      pricePaid: 'Платно',
      featured: 'Избранные события',
      buyTickets: 'Купить билеты',
      moreInfo: 'Подробнее',
      noEvents: 'События не найдены',
      noPlaces: 'Места не найдены',
      modifyFilters: 'Попробуйте изменить фильтры',
      touristInfo: 'Вы посетитель? Откройте для себя наш гид по историческим местам с доступом к информации на английском/французском.',
      touristLink: 'Туристический гид',
      organizer: 'Организатор',
      from: 'С',
      to: 'по',
      loading: 'Загрузка...',
      authenticTourism: 'Откройте для себя настоящий Тунис. Вдали от стандартных туристических маршрутов и бетона отелей, душа Туниса живет в горных деревнях, скрытых древних местах и ремесленном мастерстве. Мы отобрали аутентичные впечатления, чтобы показать наше наследие и поддержать местную экономику.',
      authenticTourismHighlight: 'Исследуйте внутренние районы, встретьте историю.',
      proposeEvent: 'Предложить развлекательное мероприятие',
      sector: 'досуг и мероприятия',
      recommended: 'Компании, которые чаще всего рекомендуют клиенты',
      allReferenced: 'Все зарегистрированные места для досуга',
      searchOther: 'Найти другие места для досуга',
      eventsIntro: 'Ищите предстоящие события по городу, типу, дате или цене.',
      activityAll: 'Все типы',
      activeFilter: 'Активный фильтр',
      clearFilter: 'Сбросить фильтр'
    }
  };

  const t = translations[language];
  const dateLocale: Record<Language, string> = { fr: 'fr-FR', en: 'en-US', ar: 'ar-TN', it: 'it-IT', ru: 'ru-RU' };
  const currentDateLocale = dateLocale[language];
  const leisureAlt = {
    fr: { hero: 'Drapeau de la Tunisie - Loisirs et événements culturels tunisiens sur Dalil Tounes', chechia: 'Chéchia dorée tunisienne - Symbole du patrimoine artisanal de Tunisie' },
    en: { hero: 'Flag of Tunisia - Leisure and cultural events on Dalil Tounes', chechia: 'Golden Tunisian chechia - Symbol of Tunisian craft heritage' },
    ar: { hero: 'علم تونس - الترفيه والفعاليات الثقافية على دليل تونس', chechia: 'الشاشية التونسية الذهبية - رمز التراث الحرفي التونسي' },
    it: { hero: 'Bandiera della Tunisia - Tempo libero ed eventi culturali su Dalil Tounes', chechia: 'Chechia tunisina dorata - Simbolo del patrimonio artigianale tunisino' },
    ru: { hero: 'Флаг Туниса - Досуг и культурные мероприятия на Dalil Tounes', chechia: 'Золотая тунисская шешия - Символ ремесленного наследия Туниса' },
  }[language];

  const getTranslatedText = (item: Evenement, field: 'titre' | 'description'): string => {
    if (language === 'fr') return item[field] || '';
    const translated = item[`${field}_${language}` as keyof Evenement];
    return typeof translated === 'string' && translated.trim() ? translated : (item[field] || '');
  };

  const isSafeTicketLink = (link?: string): link is string => {
    if (!link?.trim()) return false;
    return !/example\.com|description/i.test(link);
  };

  const formatEventDate = (dateDebut: string, dateFin: string): string => {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin || dateDebut);

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    };

    if (debut.toDateString() === fin.toDateString()) {
      return debut.toLocaleDateString(currentDateLocale, options);
    } else {
      return `${debut.toLocaleDateString(currentDateLocale, { day: 'numeric', month: 'short' })} - ${fin.toLocaleDateString(currentDateLocale, { day: 'numeric', month: 'short' })}`;
    }
  };

  const loadFeaturedEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('evenements_locaux')
        .select('*')
        .eq('est_valide', true)
        .gte('date_debut', new Date().toISOString())
        .order('date_debut', { ascending: true })
        .limit(5);

      if (!error && data) {
        setFeaturedEvents(data);
      }
    } catch (error) {
      console.error('Erreur chargement événements VIP:', error);
    }
  };

  const loadAgendaEvents = async () => {
    try {
      const { data: weekly } = await supabase
        .from('evenements_locaux')
        .select('*')
        .eq('est_valide', true)
        .eq('type_affichage', 'hebdo')
        .gte('date_debut', new Date().toISOString())
        .order('date_debut', { ascending: true })
        .limit(1)
        .maybeSingle();

      setWeeklyEvent(weekly ?? null);

      const { data: monthly } = await supabase
        .from('evenements_locaux')
        .select('*')
        .eq('est_valide', true)
        .eq('type_affichage', 'mensuel')
        .gte('date_debut', new Date().toISOString())
        .order('date_debut', { ascending: true })
        .limit(1)
        .maybeSingle();

      setMonthlyEvent(monthly ?? null);

      const { data: annual } = await supabase
        .from('evenements_locaux')
        .select('*')
        .eq('est_valide', true)
        .eq('type_affichage', 'annuel')
        .gte('date_debut', new Date().toISOString())
        .order('date_debut', { ascending: true })
        .limit(1)
        .maybeSingle();

      setAnnualEvent(annual ?? null);
    } catch (error) {
      console.error('Erreur chargement événements agenda:', error);
    }
  };

  const loadEvenements = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('evenements_locaux')
        .select('*')
        .eq('est_valide', true)
        .gte('date_debut', new Date().toISOString());

      if (searchQuery) {
        query = query.or(`titre.ilike.*${searchQuery}*,description_courte.ilike.*${searchQuery}*,secteur_evenement.ilike.*${searchQuery}*`);
      }

      if (selectedLocation !== 'all') {
        query = query.ilike('localisation_ville', selectedLocation);
      }

      if (selectedTemporalite !== 'all') {
        const now = new Date();
        const end = new Date(now);
        if (selectedTemporalite === 'hebdo') {
          end.setDate(end.getDate() + 7);
        } else if (selectedTemporalite === 'mensuel') {
          end.setMonth(end.getMonth() + 1);
        } else {
          end.setFullYear(end.getFullYear() + 1);
        }
        query = query.lte('date_debut', end.toISOString());
      }

      if (selectedPrice === 'Gratuit') {
        query = query.ilike('prix', '%gratuit%');
      } else if (selectedPrice === 'Payant') {
        query = query.not('prix', 'ilike', '%gratuit%');
      }

      if (selectedActivityType !== 'all' && selectedActivityType !== '') {
        query = query.eq('secteur_evenement', selectedActivityType);
      }

      const { data, error } = await query.order('date_debut', { ascending: true });

      if (!error && data) {
        setEvenements(data);
      }
    } catch (error) {
      console.error('Erreur chargement événements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedEvents();
    loadAgendaEvents();
  }, []);

  useEffect(() => {
    loadEvenements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, selectedTemporalite, selectedPrice, searchQuery, selectedActivityType]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentDateLocale, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getTypeIcon = (type: string) => {
    const typeMap: Record<string, LucideIcon> = {
      'Cinéma': Film,
      'Cinema': Film,
      'Concert': Music,
      'Festival': PartyPopper,
      'Sport': MapPinned,
      'Plage': Waves,
      'Beach': Waves,
      'Restaurant': Utensils,
      'Exposition': Camera,
      'Exhibition': Camera
    };
    return typeMap[type] || MapPinned;
  };

  const eventTypeLabels: Record<string, Record<string, string>> = {
    fr: { 'Cinéma': 'Cinéma', 'Cinema': 'Cinéma', 'Concert': 'Concert', 'Festival': 'Festival', 'Sport': 'Sport', 'Plage': 'Plage', 'Beach': 'Plage', 'Restaurant': 'Restaurant', 'Exposition': 'Exposition', 'Exhibition': 'Exposition' },
    ar: { 'Cinéma': 'سينما', 'Cinema': 'سينما', 'Concert': 'حفلة موسيقية', 'Festival': 'مهرجان', 'Sport': 'رياضة', 'Plage': 'شاطئ', 'Beach': 'شاطئ', 'Restaurant': 'مطعم', 'Exposition': 'معرض', 'Exhibition': 'معرض' },
    en: { 'Cinéma': 'Cinema', 'Cinema': 'Cinema', 'Concert': 'Concert', 'Festival': 'Festival', 'Sport': 'Sport', 'Plage': 'Beach', 'Beach': 'Beach', 'Restaurant': 'Restaurant', 'Exposition': 'Exhibition', 'Exhibition': 'Exhibition' },
    it: { 'Cinéma': 'Cinema', 'Cinema': 'Cinema', 'Concert': 'Concerto', 'Festival': 'Festival', 'Sport': 'Sport', 'Plage': 'Spiaggia', 'Beach': 'Spiaggia', 'Restaurant': 'Ristorante', 'Exposition': 'Esposizione', 'Exhibition': 'Esposizione' },
    ru: { 'Cinéma': 'Кино', 'Cinema': 'Кино', 'Concert': 'Концерт', 'Festival': 'Фестиваль', 'Sport': 'Спорт', 'Plage': 'Пляж', 'Beach': 'Пляж', 'Restaurant': 'Ресторан', 'Exposition': 'Выставка', 'Exhibition': 'Выставка' },
  };

  const getEventTypeLabel = (type: string): string => {
    return eventTypeLabels[language]?.[type] || type;
  };

  // Five visible events on both mobile and desktop; all results remain accessible by pages.
  const EVENT_PAGE_SIZE = 5;
  const eventPageCount = Math.max(1, Math.ceil(evenements.length / EVENT_PAGE_SIZE));
  const safeEventPage = Math.min(eventPage, eventPageCount - 1);
  const pagedEvents = evenements.slice(
    safeEventPage * EVENT_PAGE_SIZE, (safeEventPage + 1) * EVENT_PAGE_SIZE
  );
  useEffect(() => setEventPage(0), [selectedLocation, selectedTemporalite, selectedPrice, searchQuery, selectedActivityType]);
  const changeEventPage = (nextPage: number) => {
    setEventPage(nextPage);
    window.setTimeout(() => eventResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  };

  // The calendar has its own selection and pagination, independent of
  // the event search. Offer only years and months with published future events.
  const availableCalendarYears = Array.from(new Set(evenements
    .map(event => new Date(event.date_debut).getFullYear())
    .filter(year => Number.isFinite(year)))).sort((a, b) => a - b);
  const availableCalendarMonths = Array.from(new Set(evenements
    .filter(event => calendarYear === 'all' || String(new Date(event.date_debut).getFullYear()) === calendarYear)
    .map(event => new Date(event.date_debut).getMonth())
    .filter(month => Number.isInteger(month) && month >= 0 && month <= 11))).sort((a, b) => a - b);
  const calendarEvents = evenements.filter(event => {
    const date = new Date(event.date_debut);
    if (Number.isNaN(date.getTime())) return false;
    return (calendarYear === 'all' || String(date.getFullYear()) === calendarYear)
      && (calendarMonth === 'all' || String(date.getMonth()) === calendarMonth);
  });
  const calendarPageCount = Math.max(1, Math.ceil(calendarEvents.length / EVENT_PAGE_SIZE));
  const safeCalendarPage = Math.min(calendarPage, calendarPageCount - 1);
  const pagedCalendarEvents = calendarEvents.slice(
    safeCalendarPage * EVENT_PAGE_SIZE, (safeCalendarPage + 1) * EVENT_PAGE_SIZE
  );
  const calendarMonthLabel = (month: number) => new Date(2026, month, 1)
    .toLocaleDateString(currentDateLocale, { month: 'long' });

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      className="public-surface min-h-screen bg-[#fcfaf5]"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      style={language === 'ar' ? { fontFamily: "'Amiri', 'Cairo', 'Tajawal', serif" } : {}}
    >
      {inPlatformApp && <section className="mx-3 mt-2 rounded-2xl border border-[#E3D4B8] bg-[#FFFDF8] px-3 py-4 text-[#421D3B]">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#96743B]">Dalil Tounes · 🇹🇳</p>
            <h1 className="font-serif text-xl font-medium leading-tight">{language === 'ar' ? 'الترفيه والفعاليات في تونس' : language === 'en' ? 'Leisure & events in Tunisia' : language === 'it' ? 'Tempo libero ed eventi in Tunisia' : language === 'ru' ? 'Отдых и события в Тунисе' : 'Loisirs & événements en Tunisie'}</h1>
            <p className="mt-1 text-xs leading-5 text-[#71616E]">{language === 'ar' ? 'خرجات، مهرجانات، معارض وأماكن ترفيه.' : language === 'en' ? 'Outings, festivals, exhibitions and places to explore.' : language === 'it' ? 'Uscite, festival, fiere e luoghi da scoprire.' : language === 'ru' ? 'Афиша, фестивали, выставки и места отдыха.' : 'Sorties, salons, festivals et bonnes adresses pour vos loisirs.'}</p>
          </div>
          <img src={DALIL_MASCOT_IMAGE} alt="" aria-hidden="true" loading="lazy" decoding="async"
            className="h-[64px] w-[60px] shrink-0 rounded-xl border border-[#D4AF37]/35 bg-white object-contain" />
        </div>
        <nav aria-label={t.title} className="mt-3 grid grid-cols-3 gap-1.5">
          {([
            { id: 'events' as const, fr: 'Événements à venir', ar: 'الفعاليات القادمة', en: 'Upcoming events', it: 'Prossimi eventi', ru: 'Скоро', icon: '📅' },
            { id: 'recommended' as const, fr: 'Lieux de loisirs recommandés', ar: 'أماكن ترفيه موصى بها', en: 'Top leisure places', it: 'Luoghi consigliati', ru: 'Места отдыха', icon: '⭐' },
            { id: 'agenda' as const, fr: 'Calendrier des événements', ar: 'رزنامة الفعاليات', en: 'Event calendar', it: 'Calendario eventi', ru: 'Календарь', icon: '🗓️' },
          ]).map(item => (
            <button key={item.id} type="button" aria-pressed={appSection === item.id}
              onClick={() => {
                setAppSection(item.id);
                if (item.id === 'agenda') {
                  setSearchQuery('');
                  setSelectedLocation('all');
                  setSelectedTemporalite('all');
                  setSelectedPrice('all');
                  setSelectedActivityType('all');
                }
              }}
              className={`flex min-h-[68px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border px-1.5 py-2 text-center text-[11px] font-medium leading-[1.2] ${appSection === item.id
                ? 'border-[#D4AF37] bg-[#4A1D43] text-white'
                : 'border-[#DFD0B7] bg-white text-[#4A1D43]'}`}>
              <span aria-hidden="true" className="text-base">{item.icon}</span>
              <span>{item[language as 'fr' | 'ar' | 'en' | 'it' | 'ru'] || item.fr}</span>
            </button>
          ))}
        </nav>
      </section>}
      <div className={`${inPlatformApp ? 'hidden' : ''} mx-auto max-w-7xl px-4 pt-5`}>
        <a href="/citizens/tourism/guide/fetes-evenements" className="flex items-center justify-between gap-4 rounded-xl border border-[#D4AF37] bg-white p-4 text-[#4A1D43] shadow-sm hover:bg-amber-50">
          <span><strong className="block">🎨 Festivals culturels de Tunisie</strong><span className="mt-1 block text-sm">Découvrez les festivals régionaux et leur patrimoine, même hors des dates de l'agenda.</span></span>
          <span className="shrink-0 text-sm font-semibold">Voir les festivals →</span>
        </a>
        <a href="/citizens/tourism" className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-[#D4AF37] bg-white p-4 text-[#4A1D43] shadow-sm hover:bg-amber-50">
          <span><strong className="block">🤿 Plongée sous-marine et loisirs nautiques</strong><span className="mt-1 block text-sm">Découvrez les clubs, baptêmes et expériences de plongée référencés en Tunisie.</span></span>
          <span className="shrink-0 text-sm font-semibold">Voir les clubs →</span>
        </a>
        <section className="mt-4 rounded-xl border border-[#D4AF37]/65 bg-white p-4 text-[#4A1D43] shadow-sm" aria-label="Découvertes culturelles régionales">
          <h2 className="public-heading mb-1 text-base font-medium">{language === 'ar' ? 'اكتشف الجهات التونسية' : language === 'en' ? 'Explore Tunisia by region' : 'Découvrir les régions autrement'}</h2>
          <p className="mb-3 text-xs text-gray-600">{language === 'ar' ? 'ثقافة، تراث، حرف وتجارب محلية. تأكد من تواريخ المهرجانات والزيارات قبل التنقل.' : language === 'en' ? 'Cultural sites, craftsmanship and local experiences. Check event dates and visits before travelling.' : 'Patrimoine, artisanat et expériences locales. Les dates des festivals et les possibilités de visite sont à vérifier.'}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Siliana · Kasserine · Gafsa', href: '/citizens/tourism/guide/nature-randonnees', hint: 'Montagnes, oasis et patrimoine rural' },
              { name: 'Gabès · Matmata', href: '/citizens/tourism/guide/villages-patrimoine', hint: 'Oasis, villages et habitat troglodyte' },
              { name: 'Djerba · Médenine', href: '/citizens/tourism/guide/artisanat-savoir-faire', hint: 'Poterie, menzels et culture insulaire' },
              { name: 'Sfax · Kerkennah', href: '/citizens/tourism/guide/marches-gastronomie', hint: 'Gastronomie, pêche et artisanat' }
            ].map((item) => (
              <a key={item.name} href={item.href} className="rounded-xl border border-[#D4AF37]/45 bg-[#FBF8EF] p-3 transition hover:bg-amber-50">
                <strong className="block text-sm">{item.name}</strong>
                <span className="mt-1 block text-xs text-gray-600">{item.hint}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
      <SEOHead
        title={t.seoTitle}
        description={t.description}
        canonical="https://dalil-tounes.com/citizens/leisure"
        currentPath="/citizens/leisure"
      />
      {/* Premium Header Section avec Image Drapeau Tunisien */}
      <div className={`${inPlatformApp ? 'hidden' : ''} relative py-6 overflow-hidden`} style={{ borderBottom: '2px solid #D4AF37' }}>
        {/* Image de fond - Drapeau Tunisien */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE_URL}
            alt={leisureAlt.hero}
            className="w-full h-full object-cover brightness-105"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1600';
            }}
            decoding="async"
          />
          {/* Overlay bleu profond pour lisibilité */}
          <div className="absolute inset-0 bg-[#0c2461] opacity-65"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Logo Chéchia Dorée */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#D4AF37] blur-2xl opacity-30 rounded-full"></div>
              <img
                src={getSupabaseImageUrl('logo-chechia-dore.png')}
                alt={leisureAlt.chechia}
                className="relative w-12 h-12 object-contain drop-shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%23D4AF37"/%3E%3Ctext x="50" y="60" text-anchor="middle" fill="%23fff" font-size="40" font-family="serif"%3E✺%3C/text%3E%3C/svg%3E';
                }} decoding="async"
              />
            </div>
          </div>

          {/* Titre Principal */}
          <div className="text-center mb-6">
            <h1 className="public-title text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-[#D4AF37] mb-3" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>
              {t.title}
            </h1>
            <p className="text-sm md:text-base text-gray-300 font-light tracking-wide mb-4">
              {t.subtitle}
            </p>

            {/* Texte descriptif intégré dans le header */}
            <div className="max-w-4xl mx-auto mt-6">
              <p className="text-white/95 text-base md:text-lg leading-relaxed italic font-light" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.8), 0px 0px 10px rgba(0,0,0,0.5)' }}>
                {t.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className={`${inPlatformApp && appSection !== 'recommended' ? 'hidden' : ''} ${inPlatformApp ? 'bg-white px-2 py-3' : 'px-4 py-8 bg-white'}`}>
        {inPlatformApp && <p className="mb-3 px-2 text-xs leading-5 text-[#766673]">{language === 'ar' ? 'أماكن ترفيه وخروجات: المقترحات هنا عندها تقييم Google 4/5 على الأقل و5 آراء على الأقل.' : language === 'en' ? 'Places to go out and enjoy leisure activities, with at least 4/5 on Google and 5 customer reviews.' : 'Lieux de sorties et de loisirs avec une note Google d’au moins 4/5 et 5 avis clients minimum.'}</p>}
        <div className="max-w-5xl mx-auto">
          <MeilleursSection
            secteurLabel={t.sector}
            listePage="loisirs & évènements"
            accentColor="#4A1D43"
            sectionTitle={inPlatformApp ? (language === 'ar' ? 'أماكن الترفيه الموصى بها من الحرفاء' : language === 'en' ? 'Leisure places recommended by customers' : 'Lieux de loisirs les plus recommandés par les clients') : t.recommended}
            useGoogleRecommendationCriteria
            includeRecommendedInTotal
            allReferencedLabel={t.allReferenced}
            searchOtherLabel={t.searchOther}
          />
        </div>
      </section>

      {/* Premium Agenda Cards - 3 Columns (hors header, sur fond beige) */}
      {inPlatformApp && appSection === 'agenda' && <section className="px-3 py-4">
        <h2 className="font-serif text-lg font-medium text-[#421D3B]">{language === 'ar' ? 'رزنامة الفعاليات القادمة' : language === 'en' ? 'Upcoming events calendar' : language === 'it' ? 'Calendario dei prossimi eventi' : language === 'ru' ? 'Календарь предстоящих событий' : 'Calendrier des événements à venir'}</h2>
        <p className="mt-1 text-xs leading-5 text-[#756575]">{language === 'ar' ? 'اختار السنة والشهر باش تلقى الفعالية مباشرة.' : language === 'en' ? 'Select a year and month to find events directly.' : language === 'it' ? 'Scegli anno e mese per trovare subito gli eventi.' : language === 'ru' ? 'Выберите год и месяц, чтобы быстро найти события.' : 'Choisissez une année et un mois pour trouver directement les événements.'}</p>

        <div className="mt-3 rounded-xl border border-[#D7C5A3] bg-[#FFFBF3] p-3">
          <div className="grid grid-cols-2 gap-2">
            <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-[#4A1D43]">
              <span>{language === 'ar' ? 'السنة' : language === 'en' ? 'Year' : language === 'it' ? 'Anno' : language === 'ru' ? 'Год' : 'Année'}</span>
              <select value={calendarYear} onChange={e => {
                const nextYear = e.target.value;
                setCalendarYear(nextYear);
                setCalendarMonth('all');
                setCalendarPage(0);
              }}
                className="min-h-11 w-full min-w-0 rounded-lg border border-[#C7B38D] bg-white px-2 text-sm font-medium text-[#4A1D43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A17D36]">
                <option value="all">{language === 'ar' ? 'كل السنوات' : language === 'en' ? 'All years' : language === 'it' ? 'Tutti gli anni' : language === 'ru' ? 'Все годы' : 'Toutes les années'}</option>
                {availableCalendarYears.map(year => <option key={year} value={String(year)}>{year}</option>)}
              </select>
            </label>
            <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-[#4A1D43]">
              <span>{language === 'ar' ? 'الشهر' : language === 'en' ? 'Month' : language === 'it' ? 'Mese' : language === 'ru' ? 'Месяц' : 'Mois'}</span>
              <select value={calendarMonth} onChange={e => {
                setCalendarMonth(e.target.value);
                setCalendarPage(0);
              }}
                className="min-h-11 w-full min-w-0 rounded-lg border border-[#C7B38D] bg-white px-2 text-sm font-medium text-[#4A1D43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A17D36]">
                <option value="all">{language === 'ar' ? 'كل الشهور' : language === 'en' ? 'All months' : language === 'it' ? 'Tutti i mesi' : language === 'ru' ? 'Все месяцы' : 'Tous les mois'}</option>
                {availableCalendarMonths.map(month => <option key={month} value={String(month)}>{calendarMonthLabel(month)}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <p aria-live="polite" className="text-xs font-medium text-[#6D5A66]">
              {calendarEvents.length} {language === 'ar' ? 'فعالية' : language === 'en' ? 'events' : language === 'it' ? 'eventi' : language === 'ru' ? 'событий' : calendarEvents.length > 1 ? 'événements' : 'événement'}
            </p>
            {(calendarYear !== 'all' || calendarMonth !== 'all') && <button type="button" onClick={() => {
              setCalendarYear('all');
              setCalendarMonth('all');
              setCalendarPage(0);
            }} className="min-h-9 rounded-lg border border-[#D7C5A3] bg-white px-3 text-xs font-semibold text-[#4A1D43]">
              {language === 'ar' ? 'إظهار الكل' : language === 'en' ? 'Show all' : language === 'it' ? 'Mostra tutti' : language === 'ru' ? 'Показать все' : 'Tout afficher'}
            </button>}
          </div>
        </div>

        {loading ? <p className="py-5 text-center text-sm text-[#766673]">{t.loading}</p>
          : evenements.length === 0 ? <p className="py-6 text-sm text-[#766673]">{t.noEvents}</p>
          : calendarEvents.length === 0 ? <p className="py-6 text-sm text-[#766673]">{language === 'ar' ? 'ما فماش فعاليات مسجلة للفترة هاذي.' : language === 'en' ? 'No events listed for this period.' : language === 'it' ? 'Nessun evento per questo periodo.' : language === 'ru' ? 'На этот период событий нет.' : 'Aucun événement enregistré pour cette période.'}</p>
          : <div className="mt-4 space-y-4">
              {Array.from(new Set(pagedCalendarEvents.map(event => new Date(event.date_debut).toLocaleDateString(currentDateLocale, { month: 'long', year: 'numeric' })))).map(month => (
                <div key={month} className="space-y-2">
                  <h3 className="border-b border-[#D7C7A6] pb-1 font-serif text-base font-semibold capitalize text-[#421D3B]">{month}</h3>
                  {pagedCalendarEvents.filter(event => new Date(event.date_debut).toLocaleDateString(currentDateLocale, { month: 'long', year: 'numeric' }) === month)
                    .map(event => <AppLeisureEventCard key={event.id} event={event}
                      title={getTranslatedText(event, 'titre')} description={getTranslatedText(event, 'description')}
                      dateLabel={formatEventDate(event.date_debut, event.date_fin)}
                      viewLabel={language === 'ar' ? 'شوف التفاصيل' : language === 'en' ? 'View details' : language === 'it' ? 'Dettagli' : language === 'ru' ? 'Подробнее' : 'Voir la fiche'} onOpen={() => setOpenedEvent(event)} />)}
                </div>
              ))}
            </div>}
        {!loading && calendarPageCount > 1 && <nav aria-label="Pagination du calendrier" className="mt-4 flex items-center justify-center gap-3">
          <button type="button" disabled={safeCalendarPage === 0} onClick={() => setCalendarPage(p => Math.max(0, p - 1))} className="min-h-11 rounded-lg border border-[#D4AF37]/50 bg-white px-3 text-sm disabled:opacity-40">{language === 'ar' ? 'السابق' : language === 'en' ? 'Previous' : language === 'it' ? 'Precedente' : language === 'ru' ? 'Назад' : 'Précédent'}</button>
          <span className="text-xs tabular-nums">{safeCalendarPage + 1} / {calendarPageCount}</span>
          <button type="button" disabled={safeCalendarPage >= calendarPageCount - 1} onClick={() => setCalendarPage(p => Math.min(calendarPageCount - 1, p + 1))} className="min-h-11 rounded-lg border border-[#D4AF37]/50 bg-white px-3 text-sm disabled:opacity-40">{language === 'ar' ? 'التالي' : language === 'en' ? 'Next' : language === 'it' ? 'Successivo' : language === 'ru' ? 'Далее' : 'Suivant'}</button>
        </nav>}
      </section>}
      <div className={`${inPlatformApp ? 'hidden' : ''} bg-[#fcfaf5] py-6 border-b border-[#D4AF37]/30`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CARTE 1 - L'Hebdo (Affinée) */}
            {weeklyEvent ? (
              <div className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg" style={{ border: '1px solid #D4AF37' }}>
                <div className="bg-[#4A1D43] px-3 py-1.5 text-center">
                  <span className="text-white font-semibold text-xs tracking-wider uppercase">{t.premiumAgenda.weekly.badge}</span>
                </div>
                <div className="relative h-24 overflow-hidden">
                  <img
                    src={(weeklyEvent.image_url?.split(',')[0]?.trim()) || '/images/drapeau-tunisie.webp'}
                    alt={getTranslatedText(weeklyEvent, 'titre')}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  decoding="async"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="text-sm font-medium text-[#4A1D43] line-clamp-2">
                    {getTranslatedText(weeklyEvent, 'titre')}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[#4A1D43]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{formatEventDate(weeklyEvent.date_debut, weeklyEvent.date_fin)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#4A1D43]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs">{weeklyEvent.localisation_ville}</span>
                  </div>
                  {weeklyEvent.prix && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#4A1D43] rounded-full text-xs font-medium">
                        {weeklyEvent.prix}
                      </span>
                    </div>
                  )}
                  {isSafeTicketLink(weeklyEvent.lien_billetterie) && (
                    <a
                      href={weeklyEvent.lien_billetterie}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#4A1D43] hover:bg-[#5A2D53] text-white rounded-md transition-colors text-xs font-medium"
                      style={{ border: '1px solid #D4AF37' }}
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{t.buyTickets}</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative bg-white/50 rounded-lg overflow-hidden opacity-60" style={{ border: '1px solid #D4AF37' }}>
                <div className="bg-[#4A1D43]/70 px-3 py-1.5 text-center">
                  <span className="text-white font-semibold text-xs tracking-wider uppercase">{t.premiumAgenda.weekly.badge}</span>
                </div>
                <div className="p-6 text-center text-gray-500">
                  <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#4A1D43]" />
                  <p className="text-xs">{t.noEvents}</p>
                </div>
              </div>
            )}

            {/* CARTE 2 - Le Mensuel (Affinée) */}
            {monthlyEvent ? (
              <div className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg" style={{ border: '1px solid #D4AF37' }}>
                <div className="bg-[#4A1D43] px-3 py-1.5 text-center">
                  <span className="text-white font-semibold text-xs tracking-wider uppercase">{t.premiumAgenda.monthly.badge}</span>
                </div>
                <div className="relative h-24 overflow-hidden">
                  <img
                    src={(monthlyEvent.image_url?.split(',')[0]?.trim()) || '/images/drapeau-tunisie.webp'}
                    alt={getTranslatedText(monthlyEvent, 'titre')}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  decoding="async"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="text-sm font-medium text-[#4A1D43] line-clamp-2">
                    {getTranslatedText(monthlyEvent, 'titre')}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[#4A1D43]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{formatEventDate(monthlyEvent.date_debut, monthlyEvent.date_fin)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#4A1D43]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs">{monthlyEvent.localisation_ville}</span>
                  </div>
                  {monthlyEvent.prix && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#4A1D43] rounded-full text-xs font-medium">
                        {monthlyEvent.prix}
                      </span>
                    </div>
                  )}
                  {isSafeTicketLink(monthlyEvent.lien_billetterie) && (
                    <a
                      href={monthlyEvent.lien_billetterie}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#4A1D43] hover:bg-[#5A2D53] text-white rounded-md transition-colors text-xs font-medium"
                      style={{ border: '1px solid #D4AF37' }}
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{t.buyTickets}</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative bg-white/50 rounded-lg overflow-hidden opacity-60" style={{ border: '1px solid #D4AF37' }}>
                <div className="bg-[#4A1D43]/70 px-3 py-1.5 text-center">
                  <span className="text-white font-semibold text-xs tracking-wider uppercase">{t.premiumAgenda.monthly.badge}</span>
                </div>
                <div className="p-6 text-center text-gray-500">
                  <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#4A1D43]" />
                  <p className="text-xs">{t.noEvents}</p>
                </div>
              </div>
            )}

            {/* CARTE 3 - L'Annuel (Premium Bordeaux avec bordure dorée) */}
            {annualEvent ? (
              <div className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg" style={{ border: '2px solid #D4AF37' }}>
                <div className="bg-[#4A1D43] px-3 py-1.5 text-center">
                  <span className="text-white font-semibold text-xs tracking-wider uppercase">{t.premiumAgenda.annual.badge}</span>
                </div>
                <div className="relative h-24 overflow-hidden">
                  <img
                    src={(annualEvent.image_url?.split(',')[0]?.trim()) || '/images/drapeau-tunisie.webp'}
                    alt={getTranslatedText(annualEvent, 'titre')}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  decoding="async"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="text-sm font-medium text-[#4A1D43] line-clamp-2">
                    {getTranslatedText(annualEvent, 'titre')}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[#4A1D43]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{formatEventDate(annualEvent.date_debut, annualEvent.date_fin)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#4A1D43]">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-xs">{annualEvent.localisation_ville}</span>
                  </div>
                  {annualEvent.prix && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#4A1D43] rounded-full text-xs font-medium">
                        {annualEvent.prix}
                      </span>
                    </div>
                  )}
                  {isSafeTicketLink(annualEvent.lien_billetterie) && (
                    <a
                      href={annualEvent.lien_billetterie}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#4A1D43] hover:bg-[#5A2D53] text-white rounded-md transition-colors text-xs font-medium"
                      style={{ border: '1px solid #D4AF37' }}
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{t.buyTickets}</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative bg-white/50 rounded-lg overflow-hidden opacity-60" style={{ border: '2px solid #D4AF37' }}>
                <div className="bg-[#4A1D43]/70 px-3 py-1.5 text-center">
                  <span className="text-white font-semibold text-xs tracking-wider uppercase">{t.premiumAgenda.annual.badge}</span>
                </div>
                <div className="p-6 text-center text-gray-500">
                  <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#4A1D43]" />
                  <p className="text-xs">{t.noEvents}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`${inPlatformApp && appSection !== 'events' ? 'hidden' : ''} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${inPlatformApp ? 'py-3' : 'py-8'}`}>
        <div className={inPlatformApp ? 'mb-3 text-start' : 'mb-6 text-center'}>
          <h2 className={inPlatformApp ? 'public-heading text-lg font-medium text-[#4A1D43]' : 'public-heading text-2xl font-medium text-[#4A1D43]'}>{t.tabEvents}</h2>
          <p className={inPlatformApp ? 'mt-1 text-xs leading-5 text-gray-600' : 'mt-2 text-sm text-gray-600'}>{t.eventsIntro}</p>
        </div>

        {/* Search and Filters */}
        <div className={inPlatformApp ? 'mb-4 rounded-xl border border-[#D4AF37]/60 bg-white p-3 shadow-sm' : 'bg-white rounded-xl shadow-sm p-5 mb-8'} style={inPlatformApp ? undefined : { border: '2px solid #D4AF37' }}>
          {/* Active Filter Badge */}
          {selectedActivityType !== 'all' && (
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A1D43] text-white rounded-full font-semibold text-sm shadow-lg">
                {t.activeFilter}: {ACTIVITY_LABELS[language][selectedActivityType] || selectedActivityType}
              </span>
              <button
                onClick={() => {
                  setSelectedActivityType('all');
                  const cleanUrl = new URL(window.location.href);
                  cleanUrl.searchParams.delete('category');
                  window.history.replaceState({}, '', `${cleanUrl.pathname}${cleanUrl.search}`);
                }}
                className="text-sm text-gray-600 hover:text-[#4A1D43] underline"
              >
                {t.clearFilter}
              </button>
            </div>
          )}

          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 bg-[#4A1D43] rounded-full p-1`}>
                <Search className="w-3.5 h-3.5 text-white" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                data-search-bar="true"
                data-search-scope="loisir"
                data-component-name="CitizensLeisure-Search"
                className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 rounded-lg border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm shadow-sm`}
              />
            </div>

            {/* Filters */}
            <div className={inPlatformApp ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'}>
              {/* Location Filter */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none bg-white font-medium shadow-sm transition-all hover:shadow-md max-h-96 overflow-y-auto text-xs"
              >
                <option value="all">{t.locationAll}</option>
                {GOUVERNORATS_TUNISIE.map((gouvernorat) => (
                  <option key={gouvernorat} value={gouvernorat}>
                    {gouvernorat}
                  </option>
                ))}
              </select>

              <select
                value={selectedActivityType}
                onChange={(e) => setSelectedActivityType(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none bg-white font-medium shadow-sm transition-all hover:shadow-md text-xs"
              >
                <option value="all">🎨 {t.activityAll}</option>
                {SECTEURS_CULTURE.map((secteur) => (
                  <option key={secteur} value={secteur}>
                    {ACTIVITY_LABELS[language][secteur] || secteur}
                  </option>
                ))}
              </select>

              <select
                value={selectedTemporalite}
                onChange={(e) => setSelectedTemporalite(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none bg-white font-medium shadow-sm transition-all hover:shadow-md text-xs"
              >
                <option value="all">📅 {t.temporaliteAll}</option>
                <option value="hebdo">📆 {t.temporaliteWeekly}</option>
                <option value="mensuel">🗓️ {t.temporaliteMonthly}</option>
                <option value="annuel">⭐ {t.temporaliteAnnual}</option>
              </select>

              {/* Price Filter */}
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="px-3 py-2 rounded-lg border border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none bg-white font-medium shadow-sm transition-all hover:shadow-md text-xs"
              >
                <option value="all">{t.priceAll}</option>
                <option value="Gratuit">{t.priceFree}</option>
                <option value="Payant">{t.pricePaid}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bouton Proposer un événement */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowProposalForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4A1D43] hover:bg-[#5A2D53] text-[#D4AF37] hover:text-white rounded-lg font-semibold hover:shadow-sm transition-all hover:scale-105 text-xs"
            style={{ border: '1px solid #D4AF37', fontFamily: "'Playfair Display', serif" }}
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            {t.proposeEvent}
          </button>
        </div>

        {/* Compact mobile preview: the old VIP carousel remains on the desktop site only. */}
        {inPlatformApp && featuredEvents.length > 0
          && !searchQuery && selectedLocation === 'all'
          && selectedTemporalite === 'all' && selectedPrice === 'all'
          && selectedActivityType === 'all' && (
          <section className="mb-5 space-y-2" aria-label={t.featured}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#4A1D43]">
                <Sparkles className="h-4 w-4 text-[#B99143]" aria-hidden="true" />{t.featured}
              </h2>
              <span className="rounded-full bg-[#FAF0D8] px-2 py-1 text-[10px] font-semibold text-[#77571C]">⭐ À la une</span>
            </div>
            {featuredEvents.slice(0, 2).map(event => (
              <AppLeisureEventCard key={event.id} event={event}
                title={getTranslatedText(event, 'titre')}
                description={getTranslatedText(event, 'description')}
                dateLabel={formatEventDate(event.date_debut, event.date_fin)}
                viewLabel={language === 'ar' ? 'شوف التفاصيل' : language === 'en' ? 'View details' : language === 'it' ? 'Dettagli' : language === 'ru' ? 'Подробнее' : 'Voir la fiche'}
                onOpen={() => setOpenedEvent(event)} />
            ))}
          </section>
        )}
        {/* Existing featured carousel kept for the website, unchanged. */}
        {!inPlatformApp && featuredEvents.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="public-heading text-3xl font-medium text-[#4A1D43] flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-[#D4AF37] animate-pulse" />
                {t.featured}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="p-3 bg-white rounded-full shadow-lg hover:shadow-sm hover:scale-110 transition-all duration-300"
                  style={{ border: '2px solid #D4AF37' }}
                >
                  <ChevronLeft className="w-6 h-6 text-[#4A1D43]" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="p-3 bg-white rounded-full shadow-lg hover:shadow-sm hover:scale-110 transition-all duration-300"
                  style={{ border: '2px solid #D4AF37' }}
                >
                  <ChevronRight className="w-6 h-6 text-[#4A1D43]" />
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredEvents.map((event) => {
                const TypeIcon = getTypeIcon(event.type_evenement);
                return (
                  <div
                    key={event.id}
                    onMouseEnter={() => setHoveredEventId(event.id)}
                    onMouseLeave={() => setHoveredEventId(null)}
                    className={`flex-shrink-0 w-64 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                      hoveredEventId === event.id ? 'scale-105 shadow-2xl' : ''
                    }`}
                    style={{ border: '2px solid #D4AF37' }}
                  >
                    <div className="relative h-32 bg-gradient-to-br from-gray-200 to-gray-300">
                      <img
                        src={event.image_url?.split(',')[0]?.trim() || '/images/drapeau-tunisie.webp'}
                        alt={event.image_url ? getTranslatedText(event, 'titre') : `Drapeau de la Tunisie — ${getTranslatedText(event, 'titre')}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(imageEvent) => {
                          const image = imageEvent.currentTarget;
                          if (!image.src.endsWith('/images/drapeau-tunisie.webp')) image.src = '/images/drapeau-tunisie.webp';
                        }}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className={`absolute top-3 ${language === 'ar' ? 'right-3' : 'left-3'} flex gap-2`}>
                        <span className="px-2.5 py-1 bg-[#D4AF37] text-[#4A1D43] font-medium text-xs rounded-full shadow-lg">
                          ⭐ VIP
                        </span>
                      </div>
                      <div className={`absolute bottom-3 ${language === 'ar' ? 'right-3' : 'left-3'}`}>
                        <div className="flex items-center gap-2 text-white">
                          <TypeIcon className="w-4 h-4" />
                          <span className="font-semibold text-xs">{getEventTypeLabel(event.type_evenement)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="text-base font-medium text-gray-900 mb-2.5 line-clamp-2 hover:text-[#D4AF37] transition-colors">
                        {getTranslatedText(event, 'titre')}
                      </h3>

                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-[#D4AF37]" />
                          <span className="font-medium">{formatDate(event.date_debut)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-[#D4AF37]" />
                          <span>{event.localisation_ville}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                          <span className="font-medium text-[#D4AF37]">{event.prix}</span>
                        </div>
                      </div>

                      {isSafeTicketLink(event.lien_billetterie) && (
                        <a
                          href={event.lien_billetterie}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-2 bg-[#4A1D43] hover:bg-[#5A2D53] text-white rounded-lg font-medium text-center hover:shadow-sm transition-all hover:scale-105 text-sm"
                          style={{ border: '2px solid #D4AF37' }}
                        >
                          <Ticket className={`w-4 h-4 inline ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                          {t.buyTickets}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-[#4A1D43] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div ref={eventResultsRef} className={inPlatformApp ? 'flex scroll-mt-24 flex-col gap-3' : 'grid scroll-mt-24 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'}>
            {evenements.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t.noEvents}</p>
                <p className="text-sm text-gray-400 mt-2">{t.modifyFilters}</p>
              </div>
            ) : (
              pagedEvents.map((event) => inPlatformApp ? (
                <AppLeisureEventCard key={event.id} event={event}
                  title={getTranslatedText(event, 'titre')} description={getTranslatedText(event, 'description')}
                  dateLabel={formatEventDate(event.date_debut, event.date_fin)}
                  viewLabel={language === 'ar' ? 'شوف التفاصيل' : language === 'en' ? 'View details' : language === 'it' ? 'Dettagli' : language === 'ru' ? 'Подробнее' : 'Voir la fiche'}
                  onOpen={() => setOpenedEvent(event)} />
              ) : (
                <EventCard
                  key={event.id}
                  id={event.id}
                  titre={getTranslatedText(event, 'titre')}
                  description={getTranslatedText(event, 'description')}
                  date_debut={event.date_debut}
                  localisation_ville={event.localisation_ville}
                  prix={event.prix}
                  type_evenement={event.type_evenement}
                  lien_billetterie={event.lien_billetterie}
                  image_url={event.image_url}
                  niveau_abonnement={event.niveau_abonnement}
                  organisateur={event.organisateur}
                  note_moyenne={event.note_moyenne}
                  nombre_avis={event.nombre_avis}
                />
              ))
            )}
          </div>
        )}
        {!loading && eventPageCount > 1 && (
          <nav aria-label="Pagination événements" className="mt-5 flex items-center justify-center gap-3 border-t border-[#D4AF37]/30 pt-3">
            <button type="button" disabled={safeEventPage === 0} onClick={() => changeEventPage(Math.max(0, safeEventPage - 1))}
              className="min-h-11 rounded-lg border border-[#D4AF37]/50 bg-white px-3 text-xs font-medium text-[#4A1D43] disabled:opacity-40">
              {language === 'ar' ? 'السابق' : language === 'en' ? 'Previous' : language === 'it' ? 'Precedente' : language === 'ru' ? 'Назад' : 'Précédent'}
            </button>
            <span className="text-xs font-semibold tabular-nums">{safeEventPage + 1} / {eventPageCount}</span>
            <button type="button" disabled={safeEventPage >= eventPageCount - 1} onClick={() => changeEventPage(Math.min(eventPageCount - 1, safeEventPage + 1))}
              className="min-h-11 rounded-lg border border-[#D4AF37]/50 bg-white px-3 text-xs font-medium text-[#4A1D43] disabled:opacity-40">
              {language === 'ar' ? 'التالي' : language === 'en' ? 'Next' : language === 'it' ? 'Successivo' : language === 'ru' ? 'Далее' : 'Suivant'}
            </button>
          </nav>
        )}
      </div>

      {inPlatformApp && openedEvent && (
        <div role="presentation" className="fixed inset-0 z-[90] flex items-end justify-center bg-[#251624]/70 p-2 sm:items-center sm:p-4"
          onClick={() => setOpenedEvent(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="app-leisure-detail-title"
            className="max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#D4AF37]/60 bg-[#FFFCF7] p-4 shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 id="app-leisure-detail-title" className="min-w-0 font-serif text-lg font-semibold leading-6 text-[#421D3B]">{getTranslatedText(openedEvent, 'titre')}</h2>
              <button type="button" onClick={() => setOpenedEvent(null)} aria-label={language === 'ar' ? 'إغلاق' : 'Fermer'}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E1D1B6] bg-white"><X className="h-5 w-5" /></button>
            </div>
            {openedEvent.image_url && <img src={openedEvent.image_url.split(',')[0].trim()} alt="" className="mb-3 h-40 w-full rounded-xl object-cover" onError={e => { e.currentTarget.style.display = 'none'; }} />}
            <div className="space-y-2 text-sm leading-6 text-[#604D5D]">
              <p><Calendar className="me-2 inline h-4 w-4 text-[#96743B]" />{formatEventDate(openedEvent.date_debut, openedEvent.date_fin)}</p>
              <p><MapPin className="me-2 inline h-4 w-4 text-[#96743B]" />{[openedEvent.lieu, openedEvent.localisation_ville].filter(Boolean).join(' · ')}</p>
              {openedEvent.type_evenement && <p className="font-medium text-[#421D3B]">{getEventTypeLabel(openedEvent.type_evenement)}</p>}
              {openedEvent.prix && <p>{openedEvent.prix}</p>}
              {openedEvent.organisateur && <p>{language === 'ar' ? 'تنظيم' : 'Organisé par'} {openedEvent.organisateur}</p>}
              <p className="whitespace-pre-line break-words">{getTranslatedText(openedEvent, 'description')}</p>
            </div>
            {isSafeTicketLink(openedEvent.lien_billetterie) && <a href={openedEvent.lien_billetterie} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#4A1D43] px-4 py-2 text-sm font-semibold text-white">
              <ExternalLink className="h-4 w-4" />{t.buyTickets}
            </a>}
          </section>
        </div>
      )}
      {showProposalForm && (
        <LeisureEventProposalForm onClose={() => setShowProposalForm(false)} />
      )}

    </div>
  );
}
