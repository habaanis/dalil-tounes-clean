import type { Language } from './i18n';

export const siteStructureCopy = {
  "fr": {
    "professional": "Espace professionnel",
    "essential": "Présence Essentielle gratuite",
    "freeIntro": "Inscrivez gratuitement votre activité sur Dalil Tounes.",
    "freeAction": "Inscrire gratuitement mon activité",
    "fields": [
      "Nom de l’activité",
      "Activité",
      "Ville",
      "Téléphone",
      "Horaires d’ouverture"
    ],
    "concept": "Découvrir notre concept",
    "story": "Lire notre histoire",
    "details": "Voir les détails",
    "models": "Découvrir les modèles",
    "prices": "Modèles et tarifs",
    "visit": "Visiter autrement",
    "settle": "S’installer",
    "platform": "La plateforme Dalil Tounes",
    "intro": "Recherchez un professionnel, découvrez la Tunisie et contactez directement les activités référencées.",
    "cvIntro": "Choisissez une présentation professionnelle à partager par lien ou QR Code.",
    "offers": "Offres et inscription",
    "products": "CV Business et CV Portfolio",
    "services": "Services et informations utiles"
  },
  "ar": {
    "professional": "الفضاء المهني",
    "essential": "الحضور الأساسي المجاني",
    "freeIntro": "سجّل نشاطك مجاناً على دليل تونس.",
    "freeAction": "سجّل نشاطي مجاناً",
    "fields": [
      "اسم النشاط",
      "النشاط",
      "المدينة",
      "الهاتف",
      "أوقات العمل"
    ],
    "concept": "اكتشف فكرتنا",
    "story": "اقرأ قصتنا",
    "details": "عرض التفاصيل",
    "models": "اكتشف النماذج",
    "prices": "النماذج والأسعار",
    "visit": "زيارة مختلفة",
    "settle": "الاستقرار في تونس",
    "platform": "منصة دليل تونس",
    "intro": "ابحث عن مهني واكتشف تونس واتصل مباشرة بالأنشطة المدرجة.",
    "cvIntro": "اختر عرضاً مهنياً تشاركه عبر رابط أو رمز QR.",
    "offers": "العروض والتسجيل",
    "products": "CV Business وCV Portfolio",
    "services": "الخدمات والمعلومات المفيدة"
  },
  "en": {
    "professional": "Professional space",
    "essential": "Free Essential Presence",
    "freeIntro": "List your activity on Dalil Tounes for free.",
    "freeAction": "List my activity for free",
    "fields": [
      "Business name",
      "Activity",
      "City",
      "Phone",
      "Opening hours"
    ],
    "concept": "Discover our concept",
    "story": "Read our story",
    "details": "View details",
    "models": "Discover the models",
    "prices": "Models and prices",
    "visit": "Visit differently",
    "settle": "Settle in Tunisia",
    "platform": "Dalil Tounes platform",
    "intro": "Find a professional, discover Tunisia and contact listed businesses directly.",
    "cvIntro": "Choose a professional presentation to share by link or QR code.",
    "offers": "Offers and registration",
    "products": "Business CV and Portfolio CV",
    "services": "Useful services and information"
  },
  "it": {
    "professional": "Spazio professionale",
    "essential": "Presenza Essenziale gratuita",
    "freeIntro": "Iscrivi gratuitamente la tua attività su Dalil Tounes.",
    "freeAction": "Iscrivi gratuitamente la mia attività",
    "fields": [
      "Nome dell’attività",
      "Attività",
      "Città",
      "Telefono",
      "Orari di apertura"
    ],
    "concept": "Scopri il nostro concetto",
    "story": "Leggi la nostra storia",
    "details": "Vedi i dettagli",
    "models": "Scopri i modelli",
    "prices": "Modelli e prezzi",
    "visit": "Visitare diversamente",
    "settle": "Stabilirsi in Tunisia",
    "platform": "La piattaforma Dalil Tounes",
    "intro": "Trova un professionista, scopri la Tunisia e contatta direttamente le attività elencate.",
    "cvIntro": "Scegli una presentazione professionale da condividere tramite link o codice QR.",
    "offers": "Offerte e iscrizione",
    "products": "CV Business e CV Portfolio",
    "services": "Servizi e informazioni utili"
  },
  "ru": {
    "professional": "Для профессионалов",
    "essential": "Бесплатное базовое присутствие",
    "freeIntro": "Добавьте свою деятельность на Dalil Tounes бесплатно.",
    "freeAction": "Добавить мою деятельность бесплатно",
    "fields": [
      "Название деятельности",
      "Деятельность",
      "Город",
      "Телефон",
      "Часы работы"
    ],
    "concept": "Узнать нашу концепцию",
    "story": "Прочитать нашу историю",
    "details": "Подробнее",
    "models": "Посмотреть модели",
    "prices": "Модели и цены",
    "visit": "Другие путешествия",
    "settle": "Переезд в Тунис",
    "platform": "Платформа Dalil Tounes",
    "intro": "Найдите специалиста, откройте Тунис и свяжитесь с компаниями напрямую.",
    "cvIntro": "Выберите профессиональную презентацию для отправки по ссылке или QR-коду.",
    "offers": "Предложения и регистрация",
    "products": "Business CV и Portfolio CV",
    "services": "Полезные услуги и информация"
  }
} as const satisfies Record<Language, {
  professional: string;
  essential: string;
  freeIntro: string;
  freeAction: string;
  fields: readonly string[];
  concept: string;
  story: string;
  details: string;
  models: string;
  prices: string;
  visit: string;
  settle: string;
  platform: string;
  intro: string;
  cvIntro: string;
  offers: string;
  products: string;
  services: string;
}>;
