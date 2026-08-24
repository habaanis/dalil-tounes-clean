import type { Language } from './i18n';

const translations: Record<Language, any> = {
  fr: {
    loadError: 'Impossible de charger les événements pour le moment.',
    loadErrorGeneric: 'Une erreur est survenue lors du chargement des événements.',
    searchLabel: 'Rechercher un événement',
    searchPlaceholder: 'Rechercher un événement, une ville, une entreprise...',
    city: 'Ville', allCities: 'Toutes les villes', category: 'Catégorie', allCategories: 'Toutes les catégories', upcomingOnly: 'Afficher uniquement les événements à venir', loading: 'Chargement des événements...', empty: 'Aucun événement trouvé pour ces critères.', date: 'Date', location: 'Lieu', organizer: 'Org', from: 'Du', to: 'au',
    formTitle: "Demande d'information / inscription", formIntro: "Pour toute demande d'information ou d'inscription, remplissez le formulaire ci-dessous.", formButton: "Demande d'information / inscription", formHelp: "Pour toute demande d'information ou d'inscription, envoyez-nous votre message. Notre équipe vous contactera directement.", titleLabel: 'Titre *', titlePlaceholder: "Ex : Inscription événement, demande d'information, partenariat...", phone: 'Téléphone *', email: 'Email *', message: 'Message *', messagePlaceholder: 'Expliquez votre demande...',
  },
  en: {
    loadError: 'Unable to load events at the moment.', loadErrorGeneric: 'An error occurred while loading events.', searchLabel: 'Search for an event', searchPlaceholder: 'Search for an event, city, company...', city: 'City', allCities: 'All cities', category: 'Category', allCategories: 'All categories', upcomingOnly: 'Show upcoming events only', loading: 'Loading events...', empty: 'No events found for these criteria.', date: 'Date', location: 'Location', organizer: 'Org', from: 'From', to: 'to', formTitle: 'Information / registration request', formIntro: 'For any information or registration request, fill in the form below.', formButton: 'Information / registration request', formHelp: 'For any information or registration request, send us your message. Our team will contact you directly.', titleLabel: 'Title *', titlePlaceholder: 'E.g. event registration, information request, partnership...', phone: 'Phone *', email: 'Email *', message: 'Message *', messagePlaceholder: 'Explain your request...',
  },
  ar: {
    loadError: 'تعذر تحميل الفعاليات في الوقت الحالي.', loadErrorGeneric: 'حدث خطأ أثناء تحميل الفعاليات.', searchLabel: 'البحث عن فعالية', searchPlaceholder: 'ابحث عن فعالية أو مدينة أو شركة...', city: 'المدينة', allCities: 'كل المدن', category: 'الفئة', allCategories: 'كل الفئات', upcomingOnly: 'عرض الفعاليات القادمة فقط', loading: 'جارٍ تحميل الفعاليات...', empty: 'لم يتم العثور على فعاليات بهذه المعايير.', date: 'التاريخ', location: 'المكان', organizer: 'المنظم', from: 'من', to: 'إلى', formTitle: 'طلب معلومات / تسجيل', formIntro: 'لأي طلب معلومات أو تسجيل، يرجى ملء النموذج أدناه.', formButton: 'طلب معلومات / تسجيل', formHelp: 'لأي طلب معلومات أو تسجيل، أرسل لنا رسالتك وسيتواصل معك فريقنا مباشرة.', titleLabel: 'العنوان *', titlePlaceholder: 'مثال: تسجيل في فعالية، طلب معلومات، شراكة...', phone: 'الهاتف *', email: 'البريد الإلكتروني *', message: 'الرسالة *', messagePlaceholder: 'اشرح طلبك...',
  },
  it: {
    loadError: 'Impossibile caricare gli eventi al momento.', loadErrorGeneric: 'Si è verificato un errore durante il caricamento degli eventi.', searchLabel: 'Cerca un evento', searchPlaceholder: 'Cerca un evento, una città, un’impresa...', city: 'Città', allCities: 'Tutte le città', category: 'Categoria', allCategories: 'Tutte le categorie', upcomingOnly: 'Mostra solo gli eventi futuri', loading: 'Caricamento degli eventi...', empty: 'Nessun evento trovato per questi criteri.', date: 'Data', location: 'Luogo', organizer: 'Org', from: 'Dal', to: 'al', formTitle: 'Richiesta di informazioni / iscrizione', formIntro: 'Per qualsiasi richiesta di informazioni o iscrizione, compila il modulo qui sotto.', formButton: 'Richiesta di informazioni / iscrizione', formHelp: 'Per qualsiasi richiesta di informazioni o iscrizione, inviaci il tuo messaggio. Il nostro team ti contatterà direttamente.', titleLabel: 'Titolo *', titlePlaceholder: 'Es.: iscrizione evento, richiesta di informazioni, partnership...', phone: 'Telefono *', email: 'Email *', message: 'Messaggio *', messagePlaceholder: 'Spiega la tua richiesta...',
  },
  ru: {
    loadError: 'Сейчас не удается загрузить мероприятия.', loadErrorGeneric: 'Произошла ошибка при загрузке мероприятий.', searchLabel: 'Найти мероприятие', searchPlaceholder: 'Найти мероприятие, город или компанию...', city: 'Город', allCities: 'Все города', category: 'Категория', allCategories: 'Все категории', upcomingOnly: 'Показывать только предстоящие мероприятия', loading: 'Загрузка мероприятий...', empty: 'По этим критериям мероприятия не найдены.', date: 'Дата', location: 'Место', organizer: 'Орг', from: 'С', to: 'по', formTitle: 'Запрос информации / регистрация', formIntro: 'Для запроса информации или регистрации заполните форму ниже.', formButton: 'Запрос информации / регистрация', formHelp: 'Для запроса информации или регистрации отправьте нам сообщение. Наша команда свяжется с вами напрямую.', titleLabel: 'Заголовок *', titlePlaceholder: 'Например: регистрация на мероприятие, запрос информации, партнерство...', phone: 'Телефон *', email: 'Email *', message: 'Сообщение *', messagePlaceholder: 'Опишите ваш запрос...',
  },
};

export function getBusinessEventsPageTranslations(language: Language) {
  return translations[language] || translations.fr;
}
