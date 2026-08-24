import type { Language } from './i18n';

const translations: Record<Language, any> = {
  fr: {
    back: "Retour au Centre d'affaires", title: 'Besoins professionnels', intro: 'Découvrez les besoins publiés par les entreprises tunisiennes et identifiez de nouvelles opportunités.', search: 'Rechercher un besoin...', allTypes: 'Tous les types', published: 'publié', publishedPlural: 'publiés', empty: 'Aucun besoin publié pour le moment.', comeBack: 'Revenez bientôt pour découvrir de nouvelles opportunités.', from: 'À partir de', until: "Jusqu'à", deadline: 'Échéance', zone: 'Zone', locale: 'fr-TN', types: { supplier_search:'Recherche fournisseur', service_provider_search:'Recherche prestataire', equipment_purchase:'Achat matériel', equipment_sale:'Vente matériel', liquidation:'Liquidation', partnership:'Partenariat', business_opportunity:"Opportunité d'affaires", other:'Autre' }, urgency: { low:'Pas urgent', medium:'Moyen', high:'Urgent', critical:'Très urgent' }
  },
  en: {
    back: 'Back to the Business Center', title: 'Professional needs', intro: 'Discover needs published by Tunisian businesses and identify new opportunities.', search: 'Search needs...', allTypes: 'All types', published: 'published need', publishedPlural: 'published needs', empty: 'No published needs at the moment.', comeBack: 'Check back soon to discover new opportunities.', from: 'From', until: 'Up to', deadline: 'Deadline', zone: 'Area', locale: 'en-US', types: { supplier_search:'Supplier search', service_provider_search:'Service provider search', equipment_purchase:'Equipment purchase', equipment_sale:'Equipment sale', liquidation:'Liquidation', partnership:'Partnership', business_opportunity:'Business opportunity', other:'Other' }, urgency: { low:'Not urgent', medium:'Medium', high:'Urgent', critical:'Very urgent' }
  },
  ar: {
    back: 'العودة إلى مركز الأعمال', title: 'الاحتياجات المهنية', intro: 'اكتشف احتياجات المؤسسات التونسية المنشورة وحدد فرصاً جديدة.', search: 'البحث في الاحتياجات...', allTypes: 'كل الأنواع', published: 'احتياج منشور', publishedPlural: 'احتياجات منشورة', empty: 'لا توجد احتياجات منشورة حالياً.', comeBack: 'عد قريباً لاكتشاف فرص جديدة.', from: 'ابتداءً من', until: 'حتى', deadline: 'آخر أجل', zone: 'المنطقة', locale: 'ar-TN', types: { supplier_search:'البحث عن مورد', service_provider_search:'البحث عن مقدم خدمة', equipment_purchase:'شراء معدات', equipment_sale:'بيع معدات', liquidation:'تصفية معدات', partnership:'شراكة', business_opportunity:'فرصة أعمال', other:'أخرى' }, urgency: { low:'غير مستعجل', medium:'متوسط', high:'مستعجل', critical:'مستعجل جداً' }
  },
  it: {
    back: 'Torna al Centro affari', title: 'Esigenze professionali', intro: 'Scopri le esigenze pubblicate dalle imprese tunisine e individua nuove opportunità.', search: 'Cerca un’esigenza...', allTypes: 'Tutti i tipi', published: 'esigenza pubblicata', publishedPlural: 'esigenze pubblicate', empty: 'Nessuna esigenza pubblicata al momento.', comeBack: 'Torna presto per scoprire nuove opportunità.', from: 'A partire da', until: 'Fino a', deadline: 'Scadenza', zone: 'Zona', locale: 'it-IT', types: { supplier_search:'Ricerca fornitore', service_provider_search:'Ricerca prestatore', equipment_purchase:'Acquisto attrezzature', equipment_sale:'Vendita attrezzature', liquidation:'Liquidazione', partnership:'Partnership', business_opportunity:'Opportunità di affari', other:'Altro' }, urgency: { low:'Non urgente', medium:'Media', high:'Urgente', critical:'Molto urgente' }
  },
  ru: {
    back: 'Назад в Бизнес-центр', title: 'Профессиональные потребности', intro: 'Ознакомьтесь с потребностями тунисских компаний и находите новые возможности.', search: 'Поиск потребностей...', allTypes: 'Все типы', published: 'опубликованная потребность', publishedPlural: 'опубликованные потребности', empty: 'Пока нет опубликованных потребностей.', comeBack: 'Загляните позже, чтобы найти новые возможности.', from: 'От', until: 'До', deadline: 'Срок', zone: 'Зона', locale: 'ru-RU', types: { supplier_search:'Поиск поставщика', service_provider_search:'Поиск подрядчика', equipment_purchase:'Покупка оборудования', equipment_sale:'Продажа оборудования', liquidation:'Ликвидация', partnership:'Партнерство', business_opportunity:'Деловая возможность', other:'Другое' }, urgency: { low:'Не срочно', medium:'Средняя', high:'Срочно', critical:'Очень срочно' }
  }
};

export function getBusinessNeedsPublicTranslations(language: Language) {
  return translations[language] || translations.fr;
}
