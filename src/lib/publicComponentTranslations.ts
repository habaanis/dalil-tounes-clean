import type { Language } from './i18n';

const translations: Record<Language, any> = {
  fr: {
    loadingProfile: 'Chargement de la fiche...',
    backServices: 'Retour aux services',
    home: 'Accueil',
    reviewsLoading: 'Chargement des avis...',
    reviewsTitle: 'Avis clients',
    reviewsEmpty: 'Aucun avis pour le moment.',
    anonymous: 'Anonyme',
    previous: 'Précédent',
    next: 'Suivant',
    topRecommendedPrefix: 'Entreprises les plus recommandées par les clients à',
    topRecommendedSubtitle: 'Les mieux notées par la communauté',
    ratingUnavailable: 'Note non disponible',
    noProfessional: 'Aucun professionnel référencé pour le moment.',
    rankingInfo: "Les classements reposent sur des critères automatisés (avis publics, notes Google, volume d'avis).",
    learnMore: 'En savoir plus',
  },
  en: {
    loadingProfile: 'Loading profile...', backServices: 'Back to services', home: 'Home', reviewsLoading: 'Loading reviews...', reviewsTitle: 'Customer reviews', reviewsEmpty: 'No reviews yet.', anonymous: 'Anonymous', previous: 'Previous', next: 'Next', topRecommendedPrefix: 'Businesses most recommended by customers in', topRecommendedSubtitle: 'Top rated by the community', ratingUnavailable: 'Rating unavailable', noProfessional: 'No professional listed yet.', rankingInfo: 'Rankings are based on automated criteria (public reviews, Google ratings, review volume).', learnMore: 'Learn more',
  },
  ar: {
    loadingProfile: 'جارٍ تحميل البطاقة...', backServices: 'العودة إلى الخدمات', home: 'الرئيسية', reviewsLoading: 'جارٍ تحميل الآراء...', reviewsTitle: 'آراء العملاء', reviewsEmpty: 'لا توجد آراء حتى الآن.', anonymous: 'مجهول', previous: 'السابق', next: 'التالي', topRecommendedPrefix: 'المؤسسات الأكثر توصية من العملاء في', topRecommendedSubtitle: 'الأعلى تقييماً من المجتمع', ratingUnavailable: 'التقييم غير متوفر', noProfessional: 'لا يوجد مهني مدرج حالياً.', rankingInfo: 'تعتمد التصنيفات على معايير آلية (الآراء العامة، تقييمات Google، وعدد الآراء).', learnMore: 'اعرف المزيد',
  },
  it: {
    loadingProfile: 'Caricamento della scheda...', backServices: 'Torna ai servizi', home: 'Home', reviewsLoading: 'Caricamento delle recensioni...', reviewsTitle: 'Recensioni dei clienti', reviewsEmpty: 'Nessuna recensione per il momento.', anonymous: 'Anonimo', previous: 'Precedente', next: 'Successivo', topRecommendedPrefix: 'Le imprese più consigliate dai clienti a', topRecommendedSubtitle: 'Le più apprezzate dalla comunità', ratingUnavailable: 'Valutazione non disponibile', noProfessional: 'Nessun professionista presente al momento.', rankingInfo: 'Le classifiche si basano su criteri automatici (recensioni pubbliche, valutazioni Google, volume delle recensioni).', learnMore: 'Scopri di più',
  },
  ru: {
    loadingProfile: 'Загрузка карточки...', backServices: 'Назад к услугам', home: 'Главная', reviewsLoading: 'Загрузка отзывов...', reviewsTitle: 'Отзывы клиентов', reviewsEmpty: 'Отзывов пока нет.', anonymous: 'Аноним', previous: 'Предыдущий', next: 'Следующий', topRecommendedPrefix: 'Компании, которые чаще всего рекомендуют клиенты в', topRecommendedSubtitle: 'Лучшие оценки сообщества', ratingUnavailable: 'Оценка недоступна', noProfessional: 'Пока нет зарегистрированных специалистов.', rankingInfo: 'Рейтинг формируется автоматически на основе публичных отзывов, оценок Google и их количества.', learnMore: 'Подробнее',
  },
};

export function getPublicComponentTranslations(language: Language) {
  return translations[language] || translations.fr;
}
