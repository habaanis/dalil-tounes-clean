import type { Language } from './i18n';

export type SeoPageTranslations = {
  resultsCount: (count: number) => string;
  businessCount: (count: number) => string;
  businessCountInSector: (count: number) => string;
  tradeCount: (count: number) => string;
  cityCount: (count: number) => string;
  establishmentCountFound: (count: number) => string;
  establishmentCountListed: (count: number) => string;

  allProfessionals: string;
  viewAllProfessionals: string;
  searchByTrade: string;
  searchByCity: string;
  otherCities: string;
  otherSectors: string;
  otherGovernorates: string;
  associatedTrades: string;
  popularTrades: string;
  sectorByCity: string;
  specializationsAvailable: string;
  tradesInSector: (sectorLabel: string) => string;
  citiesInGovernorate: (governorateLabel: string) => string;
  sectorTrades: (sectorLabel: string) => string;

  noResultsCity: (cityLabel: string) => string;
  noResultsTrade: (tradeLabel: string) => string;
  noResultsTradeCity: (tradeLabel: string, cityLabel: string) => string;
  noResultsSector: (sectorLabel: string) => string;
  noResultsGovernorate: (governorateLabel: string) => string;
  noResultsTradeSubcat: (tradeLabel: string, subcatLabel: string, cityLabel: string) => string;

  registerEstablishment: string;
  registerEstablishmentFree: string;
  beFirstToRegister: string;
  noEstablishmentReferenced: string;
  exploreAllProfessionals: string;
  allTradesInCity: (tradeLabel: string, cityLabel: string) => string;

  platform: (cityLabel: string) => string;
  tradeInTunisia: (tradeLabel: string) => string;
  sectorInTunisia: (sectorLabel: string) => string;
  businessesInGovernorate: (gouvernoratLabel: string) => string;
  tradeInOtherCities: (tradeLabel: string) => string;
  tradeCity: (tradeLabel: string, cityLabel: string) => string;

  badgeSector: string;
  badgeGovernorate: string;
  tunisia: string;
  cityTunisia: (cityLabel: string) => string;

  faqTitle: (label: string) => string;
  faqTitleTradeCity: (tradeLabel: string, cityLabel: string) => string;
  faqTitleTradeSubcatCity: (tradeLabel: string, subcatLabel: string, cityLabel: string) => string;
  faqTitleGovernorate: (gouvernoratLabel: string) => string;

  learnMore: string;
  disclaimer: string;

  loadingMore: string;
  seeMore: string;
  shownOfTotal: (shown: number, total: number) => string;

  breadcrumbHome: string;
  breadcrumbBusinesses: string;
  breadcrumbGovernorate: (label: string) => string;

  faqHowToFindProfessionalCity: (cityLabel: string) => string;
  faqHowToFindProfessionalCityAnswer: (cityLabel: string) => string;
  faqWhatBusinessesCity: (cityLabel: string) => string;
  faqWhatBusinessesCityAnswer: (cityLabel: string) => string;
  faqReliableCity: (cityLabel: string) => string;
  faqReliableCityAnswer: string;

  faqHowToFindTradeTunisia: (tradeLabel: string) => string;
  faqHowToFindTradeTunisiaAnswer: (tradeLabel: string) => string;
  faqReliableTrade: (tradeLabel: string) => string;
  faqReliableTradeAnswer: string;
  faqRegisterTrade: (tradeLabel: string) => string;
  faqRegisterTradeAnswer: string;

  faqHowToFindTradeCity: (tradeLabel: string, cityLabel: string) => string;
  faqHowToFindTradeCityAnswer: string;
  faqHowManyTradeCity: (tradeLabel: string, cityLabel: string) => string;
  faqHowManyTradeCityAnswer: (tradeLabel: string, cityLabel: string, gouvernoratLabel: string) => string;

  faqFindSectorProfessional: (sectorLabel: string) => string;
  faqFindSectorProfessionalAnswer: (sectorLabel: string) => string;
  faqWhatTradesInSector: (sectorLabel: string) => string;
  faqWhatTradesInSectorAnswer: (count: number, tradesList: string) => string;
  faqSectorVerified: (sectorLabel: string) => string;
  faqSectorVerifiedAnswer: string;

  faqWhatBusinessesGovernorate: (gouvernoratLabel: string) => string;
  faqWhatBusinessesGovernorateAnswer: (gouvernoratLabel: string) => string;
  faqFindGovernorateProfessional: (gouvernoratLabel: string) => string;
  faqFindGovernorateProfessionalAnswer: (gouvernoratLabel: string, citiesList: string) => string;
  faqHowManyCitiesGovernorate: (gouvernoratLabel: string) => string;
  faqHowManyCitiesGovernorateAnswer: (count: number, gouvernoratLabel: string, citiesList: string) => string;

  faqFindTradeSubcatCity: (tradeLabel: string, subcatLabel: string, cityLabel: string) => string;
  faqFindTradeSubcatCityAnswer: (tradeLabel: string, subcatLabel: string, cityLabel: string) => string;
  faqTradeSubcatVerified: (tradeLabel: string, subcatLabel: string, cityLabel: string) => string;
  faqTradeSubcatVerifiedAnswer: string;
};

const translations: Record<Language, SeoPageTranslations> = {
  fr: {
    resultsCount: (c) => `${c} résultat${c !== 1 ? 's' : ''}`,
    businessCount: (c) => `${c} entreprise${c !== 1 ? 's' : ''} référencée${c !== 1 ? 's' : ''}`,
    businessCountInSector: (c) => `${c} entreprise${c !== 1 ? 's' : ''} dans ce secteur`,
    tradeCount: (c) => `${c} métier${c !== 1 ? 's' : ''} référencé${c !== 1 ? 's' : ''}`,
    cityCount: (c) => `${c} ville${c !== 1 ? 's' : ''}`,
    establishmentCountFound: (c) => `${c} établissement${c !== 1 ? 's' : ''} trouvé${c !== 1 ? 's' : ''}`,
    establishmentCountListed: (c) => `${c} établissement${c !== 1 ? 's' : ''} référencé${c !== 1 ? 's' : ''}`,

    allProfessionals: 'Tous les professionnels',
    viewAllProfessionals: 'Voir tous les professionnels',
    searchByTrade: 'Chercher par métier',
    searchByCity: 'Chercher par ville',
    otherCities: 'Autres villes en Tunisie',
    otherSectors: 'Autres secteurs',
    otherGovernorates: 'Autres gouvernorats',
    associatedTrades: 'Métiers associés',
    popularTrades: 'Métiers populaires',
    sectorByCity: (s) => `${s} par ville`,
    specializationsAvailable: (c) => `Spécialisations disponibles à ${c}`,
    tradesInSector: (s) => `Métiers du secteur ${s}`,
    citiesInGovernorate: (g) => `Villes du gouvernorat de ${g}`,
    sectorTrades: (s) => `Métiers du secteur ${s}`,

    noResultsCity: (c) => `Aucun établissement à ${c} pour l'instant`,
    noResultsTrade: (t) => `Aucun ${t} référencé pour l'instant`,
    noResultsTradeCity: (t, c) => `Aucun résultat pour ${t} à ${c}`,
    noResultsSector: (s) => `Aucune entreprise dans le secteur ${s} pour l'instant`,
    noResultsGovernorate: (g) => `Aucune entreprise dans le gouvernorat de ${g} pour l'instant`,
    noResultsTradeSubcat: (t, sc, c) => `Aucun ${t} spécialisé en ${sc} à ${c} pour le moment.`,

    registerEstablishment: 'Inscrire mon établissement',
    registerEstablishmentFree: 'Référencez votre établissement gratuitement dès maintenant.',
    beFirstToRegister: 'Soyez le premier à inscrire votre établissement.',
    noEstablishmentReferenced: 'Aucun établissement n\'a encore été référencé. Explorez tous les professionnels pour plus d\'options.',
    exploreAllProfessionals: 'Explorez tous les professionnels pour plus d\'options.',
    allTradesInCity: (t, c) => `Tous les ${t.toLowerCase()}s à ${c}`,

    platform: (c) => `Plateforme ${c}`,
    tradeInTunisia: (t) => `${t} en Tunisie`,
    sectorInTunisia: (s) => `${s} en Tunisie`,
    businessesInGovernorate: (g) => `Entreprises et services dans le gouvernorat de ${g}`,
    tradeInOtherCities: (t) => `${t} dans d'autres villes`,
    tradeCity: (t, c) => `${t} ${c}`,

    badgeSector: 'Secteur',
    badgeGovernorate: 'Gouvernorat',
    tunisia: 'Tunisie',
    cityTunisia: (c) => `${c}, Tunisie`,

    faqTitle: (l) => `Questions fréquentes - ${l}`,
    faqTitleTradeCity: (t, c) => `Questions fréquentes - ${t} à ${c}`,
    faqTitleTradeSubcatCity: (t, sc, c) => `Questions fréquentes - ${t} ${sc} à ${c}`,
    faqTitleGovernorate: (g) => `Questions fréquentes - Gouvernorat de ${g}`,

    learnMore: 'En savoir plus',
    disclaimer: 'Les résultats affichés reposent sur des critères automatisés (avis publics, notes Google, complétude de la fiche).',

    loadingMore: 'Chargement...',
    seeMore: 'Voir plus d\'entreprises',
    shownOfTotal: (s, t) => `${s} sur ${t} entreprises`,

    breadcrumbHome: 'Accueil',
    breadcrumbBusinesses: 'Entreprises',
    breadcrumbGovernorate: (l) => `Gouvernorat de ${l}`,

    faqHowToFindProfessionalCity: (c) => `Comment trouver un professionnel à ${c} ?`,
    faqHowToFindProfessionalCityAnswer: (c) => `Utilisez la barre de recherche Dalil Tounes ou parcourez les catégories disponibles pour ${c}. Vous pouvez filtrer par métier : médecin, avocat, plombier, coiffeur, restaurant et bien d'autres.`,
    faqWhatBusinessesCity: (c) => `Quels types d'entreprises sont référencées à ${c} ?`,
    faqWhatBusinessesCityAnswer: (c) => `Dalil Tounes référence tous types d'établissements à ${c} : professionnels de santé, artisans, commerces, restaurants, hôtels, services juridiques, beauté et bien-être, et plus encore.`,
    faqReliableCity: (c) => `Les informations des entreprises à ${c} sont-elles fiables ?`,
    faqReliableCityAnswer: `Les données proviennent de sources publiques ou sont communiquées par les entreprises elles-mêmes. Les notes affichées sont basées sur les avis Google publics. Dalil Tounes n'attribue aucune note et n'effectue aucun classement éditorial.`,

    faqHowToFindTradeTunisia: (t) => `Comment trouver un ${t.toLowerCase()} en Tunisie ?`,
    faqHowToFindTradeTunisiaAnswer: (t) => `Utilisez la barre de recherche Dalil Tounes ou parcourez la liste ci-dessous. Vous pouvez également filtrer par ville pour trouver un ${t.toLowerCase()} proche de chez vous.`,
    faqReliableTrade: (t) => `Les avis sur les ${t.toLowerCase()}s sont-ils fiables ?`,
    faqReliableTradeAnswer: `Les notes affichées proviennent des avis Google publics. Dalil Tounes n'attribue aucune note et n'effectue aucun classement éditorial. Les résultats sont triés selon des critères automatisés : avis, complétude de la fiche et présence de photos.`,
    faqRegisterTrade: (t) => `Comment inscrire mon cabinet ou établissement de ${t.toLowerCase()} sur Dalil Tounes ?`,
    faqRegisterTradeAnswer: `Vous pouvez référencer votre établissement gratuitement sur Dalil Tounes. Rendez-vous sur la page Abonnement pour découvrir les options de mise en avant disponibles.`,

    faqHowToFindTradeCity: (t, c) => `Comment trouver un ${t.toLowerCase()} à ${c} ?`,
    faqHowToFindTradeCityAnswer: `Consultez la liste ci-dessous ou utilisez la barre de recherche Dalil Tounes. Les résultats sont triés par note Google et complétude de la fiche.`,
    faqHowManyTradeCity: (t, c) => `Combien de ${t.toLowerCase()}s sont référencés à ${c} ?`,
    faqHowManyTradeCityAnswer: (t, c, g) => `Dalil Tounes référence actuellement les ${t.toLowerCase()}s disponibles à ${c} et dans le gouvernorat de ${g}. De nouveaux établissements sont ajoutés régulièrement.`,

    faqFindSectorProfessional: (s) => `Comment trouver un professionnel du secteur ${s} en Tunisie ?`,
    faqFindSectorProfessionalAnswer: (s) => `Utilisez la barre de recherche Dalil Tounes ou parcourez les métiers du secteur ${s} ci-dessous. Vous pouvez également filtrer par ville pour trouver un professionnel proche de chez vous.`,
    faqWhatTradesInSector: (s) => `Quels métiers sont disponibles dans le secteur ${s} ?`,
    faqWhatTradesInSectorAnswer: (count, list) => `Dalil Tounes référence ${count} métiers dans ce secteur, dont ${list}${count > 4 ? ' et bien d\'autres' : ''}.`,
    faqSectorVerified: (s) => `Les entreprises du secteur ${s} sont-elles vérifiées ?`,
    faqSectorVerifiedAnswer: `Les données proviennent de sources publiques ou sont communiquées par les professionnels. Les notes affichées sont basées sur les avis Google publics. Dalil Tounes n'attribue aucune note et n'effectue aucun classement éditorial.`,

    faqWhatBusinessesGovernorate: (g) => `Quels types d'entreprises trouve-t-on dans le gouvernorat de ${g} ?`,
    faqWhatBusinessesGovernorateAnswer: (g) => `Dalil Tounes référence tous types d'entreprises dans le gouvernorat de ${g} : professionnels de santé, artisans, commerces, restaurants, services juridiques et bien plus encore.`,
    faqFindGovernorateProfessional: (g) => `Comment trouver un professionnel dans le gouvernorat de ${g} ?`,
    faqFindGovernorateProfessionalAnswer: (g, citiesList) => `Utilisez la barre de recherche Dalil Tounes ou parcourez les villes et métiers ci-dessous. Vous pouvez filtrer par ville${citiesList ? ` (${citiesList}...)` : ''} ou par métier.`,
    faqHowManyCitiesGovernorate: (g) => `Combien de villes sont référencées dans le gouvernorat de ${g} ?`,
    faqHowManyCitiesGovernorateAnswer: (count, g, citiesList) => `Dalil Tounes couvre ${count} villes dans le gouvernorat de ${g}, dont ${citiesList}. De nouvelles localités sont ajoutées régulièrement.`,

    faqFindTradeSubcatCity: (t, sc, c) => `Comment trouver un ${t.toLowerCase()} ${sc} à ${c} ?`,
    faqFindTradeSubcatCityAnswer: (t, sc, c) => `Consultez la liste ci-dessous ou utilisez la barre de recherche Dalil Tounes pour trouver un ${t.toLowerCase()} spécialisé en ${sc} à ${c}.`,
    faqTradeSubcatVerified: (t, sc, c) => `Les ${t.toLowerCase()}s ${sc} à ${c} sont-ils vérifiés ?`,
    faqTradeSubcatVerifiedAnswer: `Les informations proviennent de sources publiques ou sont communiquées par les professionnels. Les notes affichées sont basées sur les avis Google publics.`,
  },

  ar: {
    resultsCount: (c) => `${c} نتيجة`,
    businessCount: (c) => `${c} مؤسسة مسجلة`,
    businessCountInSector: (c) => `${c} مؤسسة في هذا القطاع`,
    tradeCount: (c) => `${c} مهنة مسجلة`,
    cityCount: (c) => `${c} مدينة`,
    establishmentCountFound: (c) => `${c} مؤسسة موجودة`,
    establishmentCountListed: (c) => `${c} مؤسسة مسجلة`,

    allProfessionals: 'كل المهنيين',
    viewAllProfessionals: 'عرض جميع المهنيين',
    searchByTrade: 'البحث حسب المهنة',
    searchByCity: 'البحث حسب المدينة',
    otherCities: 'مدن أخرى في تونس',
    otherSectors: 'قطاعات أخرى',
    otherGovernorates: 'ولايات أخرى',
    associatedTrades: 'مهن مرتبطة',
    popularTrades: 'مهن شائعة',
    sectorByCity: (s) => `${s} حسب المدينة`,
    specializationsAvailable: (c) => `التخصصات المتاحة في ${c}`,
    tradesInSector: (s) => `مهن قطاع ${s}`,
    citiesInGovernorate: (g) => `مدن ولاية ${g}`,
    sectorTrades: (s) => `مهن قطاع ${s}`,

    noResultsCity: (c) => `لا توجد مؤسسات في ${c} حاليا`,
    noResultsTrade: (t) => `لا يوجد ${t} مسجل حاليا`,
    noResultsTradeCity: (t, c) => `لا توجد نتائج لـ ${t} في ${c}`,
    noResultsSector: (s) => `لا توجد مؤسسات في قطاع ${s} حاليا`,
    noResultsGovernorate: (g) => `لا توجد مؤسسات في ولاية ${g} حاليا`,
    noResultsTradeSubcat: (t, sc, c) => `لا يوجد ${t} متخصص في ${sc} في ${c} حاليا.`,

    registerEstablishment: 'تسجيل مؤسستي',
    registerEstablishmentFree: 'سجّل مؤسستك مجانا الآن.',
    beFirstToRegister: 'كن أول من يسجل مؤسسته.',
    noEstablishmentReferenced: 'لم يتم تسجيل أي مؤسسة بعد. استكشف جميع المهنيين لمزيد من الخيارات.',
    exploreAllProfessionals: 'استكشف جميع المهنيين لمزيد من الخيارات.',
    allTradesInCity: (t, c) => `جميع ${t} في ${c}`,

    platform: (c) => `منصة ${c}`,
    tradeInTunisia: (t) => `${t} في تونس`,
    sectorInTunisia: (s) => `${s} في تونس`,
    businessesInGovernorate: (g) => `المؤسسات والخدمات في ولاية ${g}`,
    tradeInOtherCities: (t) => `${t} في مدن أخرى`,
    tradeCity: (t, c) => `${t} ${c}`,

    badgeSector: 'قطاع',
    badgeGovernorate: 'ولاية',
    tunisia: 'تونس',
    cityTunisia: (c) => `${c}، تونس`,

    faqTitle: (l) => `الأسئلة الشائعة - ${l}`,
    faqTitleTradeCity: (t, c) => `الأسئلة الشائعة - ${t} في ${c}`,
    faqTitleTradeSubcatCity: (t, sc, c) => `الأسئلة الشائعة - ${t} ${sc} في ${c}`,
    faqTitleGovernorate: (g) => `الأسئلة الشائعة - ولاية ${g}`,

    learnMore: 'اعرف المزيد',
    disclaimer: 'النتائج المعروضة تعتمد على معايير آلية (المراجعات العامة، تقييمات Google، اكتمال الملف).',

    loadingMore: 'جاري التحميل...',
    seeMore: 'عرض المزيد من المؤسسات',
    shownOfTotal: (s, t) => `${s} من ${t} مؤسسة`,

    breadcrumbHome: 'الرئيسية',
    breadcrumbBusinesses: 'المؤسسات',
    breadcrumbGovernorate: (l) => `ولاية ${l}`,

    faqHowToFindProfessionalCity: (c) => `كيف تجد محترفا في ${c}؟`,
    faqHowToFindProfessionalCityAnswer: (c) => `استخدم شريط البحث في دليل تونس أو تصفح الفئات المتاحة لـ ${c}. يمكنك التصفية حسب المهنة: طبيب، محامي، سبّاك، حلاق، مطعم وغيرها الكثير.`,
    faqWhatBusinessesCity: (c) => `ما أنواع المؤسسات المسجلة في ${c}؟`,
    faqWhatBusinessesCityAnswer: (c) => `يسجل دليل تونس جميع أنواع المؤسسات في ${c}: مهنيون صحيون، حرفيون، متاجر، مطاعم، فنادق، خدمات قانونية، جمال وعافية، والمزيد.`,
    faqReliableCity: (c) => `هل معلومات المؤسسات في ${c} موثوقة؟`,
    faqReliableCityAnswer: `البيانات مصدرها عام أو مقدمة من المؤسسات نفسها. التقييمات المعروضة مبنية على مراجعات Google العامة. دليل تونس لا يمنح أي تقييم ولا يجري أي ترتيب تحريري.`,

    faqHowToFindTradeTunisia: (t) => `كيف تجد ${t} في تونس؟`,
    faqHowToFindTradeTunisiaAnswer: (t) => `استخدم شريط البحث في دليل تونس أو تصفح القائمة أدناه. يمكنك أيضا التصفية حسب المدينة للعثور على ${t} بالقرب منك.`,
    faqReliableTrade: (t) => `هل مراجعات ${t} موثوقة؟`,
    faqReliableTradeAnswer: `التقييمات المعروضة مصدرها مراجعات Google العامة. دليل تونس لا يمنح أي تقييم ولا يجري أي ترتيب تحريري. النتائج مرتبة حسب معايير آلية: المراجعات، اكتمال الملف، ووجود الصور.`,
    faqRegisterTrade: (t) => `كيف أسجل مكتبي أو مؤسستي في ${t} على دليل تونس؟`,
    faqRegisterTradeAnswer: `يمكنك تسجيل مؤسستك مجانا على دليل تونس. انتقل إلى صفحة الاشتراك لاكتشاف خيارات الظهور المتاحة.`,

    faqHowToFindTradeCity: (t, c) => `كيف تجد ${t} في ${c}؟`,
    faqHowToFindTradeCityAnswer: `استعرض القائمة أدناه أو استخدم شريط البحث في دليل تونس. النتائج مرتبة حسب تقييم Google واكتمال الملف.`,
    faqHowManyTradeCity: (t, c) => `كم عدد ${t} المسجلين في ${c}؟`,
    faqHowManyTradeCityAnswer: (t, c, g) => `يسجل دليل تونس حاليا ${t} المتاحين في ${c} وفي ولاية ${g}. تتم إضافة مؤسسات جديدة بانتظام.`,

    faqFindSectorProfessional: (s) => `كيف تجد محترفا في قطاع ${s} في تونس؟`,
    faqFindSectorProfessionalAnswer: (s) => `استخدم شريط البحث في دليل تونس أو تصفح مهن قطاع ${s} أدناه. يمكنك أيضا التصفية حسب المدينة للعثور على محترف بالقرب منك.`,
    faqWhatTradesInSector: (s) => `ما المهن المتاحة في قطاع ${s}؟`,
    faqWhatTradesInSectorAnswer: (count, list) => `يسجل دليل تونس ${count} مهن في هذا القطاع، منها ${list}${count > 4 ? ' وغيرها الكثير' : ''}.`,
    faqSectorVerified: (s) => `هل المؤسسات في قطاع ${s} موثقة؟`,
    faqSectorVerifiedAnswer: `البيانات مصدرها عام أو مقدمة من المهنيين. التقييمات المعروضة مبنية على مراجعات Google العامة. دليل تونس لا يمنح أي تقييم ولا يجري أي ترتيب تحريري.`,

    faqWhatBusinessesGovernorate: (g) => `ما أنواع المؤسسات الموجودة في ولاية ${g}؟`,
    faqWhatBusinessesGovernorateAnswer: (g) => `يسجل دليل تونس جميع أنواع المؤسسات في ولاية ${g}: مهنيون صحيون، حرفيون، متاجر، مطاعم، خدمات قانونية والمزيد.`,
    faqFindGovernorateProfessional: (g) => `كيف تجد محترفا في ولاية ${g}؟`,
    faqFindGovernorateProfessionalAnswer: (g, citiesList) => `استخدم شريط البحث في دليل تونس أو تصفح المدن والمهن أدناه. يمكنك التصفية حسب المدينة${citiesList ? ` (${citiesList}...)` : ''} أو حسب المهنة.`,
    faqHowManyCitiesGovernorate: (g) => `كم عدد المدن المسجلة في ولاية ${g}؟`,
    faqHowManyCitiesGovernorateAnswer: (count, g, citiesList) => `يغطي دليل تونس ${count} مدن في ولاية ${g}، منها ${citiesList}. تتم إضافة مواقع جديدة بانتظام.`,

    faqFindTradeSubcatCity: (t, sc, c) => `كيف تجد ${t} ${sc} في ${c}؟`,
    faqFindTradeSubcatCityAnswer: (t, sc, c) => `استعرض القائمة أدناه أو استخدم شريط البحث في دليل تونس للعثور على ${t} متخصص في ${sc} في ${c}.`,
    faqTradeSubcatVerified: (t, sc, c) => `هل ${t} ${sc} في ${c} موثوقون؟`,
    faqTradeSubcatVerifiedAnswer: `المعلومات مصدرها عام أو مقدمة من المهنيين. التقييمات المعروضة مبنية على مراجعات Google العامة.`,
  },

  en: {
    resultsCount: (c) => `${c} result${c !== 1 ? 's' : ''}`,
    businessCount: (c) => `${c} business${c !== 1 ? 'es' : ''} listed`,
    businessCountInSector: (c) => `${c} business${c !== 1 ? 'es' : ''} in this sector`,
    tradeCount: (c) => `${c} trade${c !== 1 ? 's' : ''} listed`,
    cityCount: (c) => `${c} cit${c !== 1 ? 'ies' : 'y'}`,
    establishmentCountFound: (c) => `${c} establishment${c !== 1 ? 's' : ''} found`,
    establishmentCountListed: (c) => `${c} establishment${c !== 1 ? 's' : ''} listed`,

    allProfessionals: 'All professionals',
    viewAllProfessionals: 'View all professionals',
    searchByTrade: 'Search by trade',
    searchByCity: 'Search by city',
    otherCities: 'Other cities in Tunisia',
    otherSectors: 'Other sectors',
    otherGovernorates: 'Other governorates',
    associatedTrades: 'Related trades',
    popularTrades: 'Popular trades',
    sectorByCity: (s) => `${s} by city`,
    specializationsAvailable: (c) => `Specializations available in ${c}`,
    tradesInSector: (s) => `Trades in the ${s} sector`,
    citiesInGovernorate: (g) => `Cities in the governorate of ${g}`,
    sectorTrades: (s) => `Trades in the ${s} sector`,

    noResultsCity: (c) => `No establishments in ${c} yet`,
    noResultsTrade: (t) => `No ${t} listed yet`,
    noResultsTradeCity: (t, c) => `No results for ${t} in ${c}`,
    noResultsSector: (s) => `No businesses in the ${s} sector yet`,
    noResultsGovernorate: (g) => `No businesses in the governorate of ${g} yet`,
    noResultsTradeSubcat: (t, sc, c) => `No ${t} specialized in ${sc} in ${c} yet.`,

    registerEstablishment: 'List my establishment',
    registerEstablishmentFree: 'List your establishment for free now.',
    beFirstToRegister: 'Be the first to list your establishment.',
    noEstablishmentReferenced: 'No establishment has been listed yet. Explore all professionals for more options.',
    exploreAllProfessionals: 'Explore all professionals for more options.',
    allTradesInCity: (t, c) => `All ${t.toLowerCase()}s in ${c}`,

    platform: (c) => `Platform ${c}`,
    tradeInTunisia: (t) => `${t} in Tunisia`,
    sectorInTunisia: (s) => `${s} in Tunisia`,
    businessesInGovernorate: (g) => `Businesses and services in the governorate of ${g}`,
    tradeInOtherCities: (t) => `${t} in other cities`,
    tradeCity: (t, c) => `${t} ${c}`,

    badgeSector: 'Sector',
    badgeGovernorate: 'Governorate',
    tunisia: 'Tunisia',
    cityTunisia: (c) => `${c}, Tunisia`,

    faqTitle: (l) => `Frequently asked questions - ${l}`,
    faqTitleTradeCity: (t, c) => `Frequently asked questions - ${t} in ${c}`,
    faqTitleTradeSubcatCity: (t, sc, c) => `Frequently asked questions - ${t} ${sc} in ${c}`,
    faqTitleGovernorate: (g) => `Frequently asked questions - Governorate of ${g}`,

    learnMore: 'Learn more',
    disclaimer: 'The results displayed are based on automated criteria (public reviews, Google ratings, profile completeness).',

    loadingMore: 'Loading...',
    seeMore: 'Show more businesses',
    shownOfTotal: (s, t) => `${s} of ${t} businesses`,

    breadcrumbHome: 'Home',
    breadcrumbBusinesses: 'Businesses',
    breadcrumbGovernorate: (l) => `Governorate of ${l}`,

    faqHowToFindProfessionalCity: (c) => `How to find a professional in ${c}?`,
    faqHowToFindProfessionalCityAnswer: (c) => `Use the Dalil Tounes search bar or browse the categories available for ${c}. You can filter by trade: doctor, lawyer, plumber, hairdresser, restaurant, and many more.`,
    faqWhatBusinessesCity: (c) => `What types of businesses are listed in ${c}?`,
    faqWhatBusinessesCityAnswer: (c) => `Dalil Tounes lists all types of establishments in ${c}: health professionals, artisans, shops, restaurants, hotels, legal services, beauty and wellness, and more.`,
    faqReliableCity: (c) => `Is the business information in ${c} reliable?`,
    faqReliableCityAnswer: `The data comes from public sources or is provided by the businesses themselves. The ratings displayed are based on public Google reviews. Dalil Tounes does not assign any rating and does not perform any editorial ranking.`,

    faqHowToFindTradeTunisia: (t) => `How to find a ${t.toLowerCase()} in Tunisia?`,
    faqHowToFindTradeTunisiaAnswer: (t) => `Use the Dalil Tounes search bar or browse the list below. You can also filter by city to find a ${t.toLowerCase()} near you.`,
    faqReliableTrade: (t) => `Are the reviews on ${t.toLowerCase()}s reliable?`,
    faqReliableTradeAnswer: `The ratings displayed come from public Google reviews. Dalil Tounes does not assign any rating and does not perform any editorial ranking. Results are sorted by automated criteria: reviews, profile completeness, and photo presence.`,
    faqRegisterTrade: (t) => `How to list my ${t.toLowerCase()} practice or establishment on Dalil Tounes?`,
    faqRegisterTradeAnswer: `You can list your establishment for free on Dalil Tounes. Visit the Subscription page to discover available visibility options.`,

    faqHowToFindTradeCity: (t, c) => `How to find a ${t.toLowerCase()} in ${c}?`,
    faqHowToFindTradeCityAnswer: `Browse the list below or use the Dalil Tounes search bar. Results are sorted by Google rating and profile completeness.`,
    faqHowManyTradeCity: (t, c) => `How many ${t.toLowerCase()}s are listed in ${c}?`,
    faqHowManyTradeCityAnswer: (t, c, g) => `Dalil Tounes currently lists ${t.toLowerCase()}s available in ${c} and in the governorate of ${g}. New establishments are added regularly.`,

    faqFindSectorProfessional: (s) => `How to find a professional in the ${s} sector in Tunisia?`,
    faqFindSectorProfessionalAnswer: (s) => `Use the Dalil Tounes search bar or browse the trades in the ${s} sector below. You can also filter by city to find a professional near you.`,
    faqWhatTradesInSector: (s) => `What trades are available in the ${s} sector?`,
    faqWhatTradesInSectorAnswer: (count, list) => `Dalil Tounes lists ${count} trade${count !== 1 ? 's' : ''} in this sector, including ${list}${count > 4 ? ' and many more' : ''}.`,
    faqSectorVerified: (s) => `Are the businesses in the ${s} sector verified?`,
    faqSectorVerifiedAnswer: `The data comes from public sources or is provided by the professionals. The ratings displayed are based on public Google reviews. Dalil Tounes does not assign any rating and does not perform any editorial ranking.`,

    faqWhatBusinessesGovernorate: (g) => `What types of businesses are found in the governorate of ${g}?`,
    faqWhatBusinessesGovernorateAnswer: (g) => `Dalil Tounes lists all types of businesses in the governorate of ${g}: health professionals, artisans, shops, restaurants, legal services, and much more.`,
    faqFindGovernorateProfessional: (g) => `How to find a professional in the governorate of ${g}?`,
    faqFindGovernorateProfessionalAnswer: (g, citiesList) => `Use the Dalil Tounes search bar or browse the cities and trades below. You can filter by city${citiesList ? ` (${citiesList}...)` : ''} or by trade.`,
    faqHowManyCitiesGovernorate: (g) => `How many cities are listed in the governorate of ${g}?`,
    faqHowManyCitiesGovernorateAnswer: (count, g, citiesList) => `Dalil Tounes covers ${count} cities in the governorate of ${g}, including ${citiesList}. New locations are added regularly.`,

    faqFindTradeSubcatCity: (t, sc, c) => `How to find a ${t.toLowerCase()} ${sc} in ${c}?`,
    faqFindTradeSubcatCityAnswer: (t, sc, c) => `Browse the list below or use the Dalil Tounes search bar to find a ${t.toLowerCase()} specialized in ${sc} in ${c}.`,
    faqTradeSubcatVerified: (t, sc, c) => `Are the ${t.toLowerCase()}s ${sc} in ${c} verified?`,
    faqTradeSubcatVerifiedAnswer: `The information comes from public sources or is provided by the professionals. The ratings displayed are based on public Google reviews.`,
  },

  it: {
    resultsCount: (c) => `${c} risultat${c !== 1 ? 'i' : 'o'}`,
    businessCount: (c) => `${c} attività registrat${c !== 1 ? 'e' : 'a'}`,
    businessCountInSector: (c) => `${c} attività in questo settore`,
    tradeCount: (c) => `${c} mestier${c !== 1 ? 'i' : 'e'} registrat${c !== 1 ? 'i' : 'o'}`,
    cityCount: (c) => `${c} citt${c !== 1 ? 'à' : 'à'}`,
    establishmentCountFound: (c) => `${c} struttura trovat${c !== 1 ? 'e' : 'a'}`,
    establishmentCountListed: (c) => `${c} struttura registrat${c !== 1 ? 'e' : 'a'}`,

    allProfessionals: 'Tutti i professionisti',
    viewAllProfessionals: 'Vedi tutti i professionisti',
    searchByTrade: 'Cerca per mestiere',
    searchByCity: 'Cerca per città',
    otherCities: 'Altre città in Tunisia',
    otherSectors: 'Altri settori',
    otherGovernorates: 'Altri governatorati',
    associatedTrades: 'Mestieri correlati',
    popularTrades: 'Mestieri popolari',
    sectorByCity: (s) => `${s} per città`,
    specializationsAvailable: (c) => `Specializzazioni disponibili a ${c}`,
    tradesInSector: (s) => `Mestieri del settore ${s}`,
    citiesInGovernorate: (g) => `Città del governatorato di ${g}`,
    sectorTrades: (s) => `Mestieri del settore ${s}`,

    noResultsCity: (c) => `Nessuna struttura a ${c} al momento`,
    noResultsTrade: (t) => `Nessun ${t} registrato al momento`,
    noResultsTradeCity: (t, c) => `Nessun risultato per ${t} a ${c}`,
    noResultsSector: (s) => `Nessuna attività nel settore ${s} al momento`,
    noResultsGovernorate: (g) => `Nessuna attività nel governatorato di ${g} al momento`,
    noResultsTradeSubcat: (t, sc, c) => `Nessun ${t} specializzato in ${sc} a ${c} al momento.`,

    registerEstablishment: 'Registra la mia struttura',
    registerEstablishmentFree: 'Registra la tua struttura gratuitamente ora.',
    beFirstToRegister: 'Sii il primo a registrare la tua struttura.',
    noEstablishmentReferenced: 'Nessuna struttura è ancora stata registrata. Esplora tutti i professionisti per più opzioni.',
    exploreAllProfessionals: 'Esplora tutti i professionisti per più opzioni.',
    allTradesInCity: (t, c) => `Tutti i ${t.toLowerCase()} a ${c}`,

    platform: (c) => `Piattaforma ${c}`,
    tradeInTunisia: (t) => `${t} in Tunisia`,
    sectorInTunisia: (s) => `${s} in Tunisia`,
    businessesInGovernorate: (g) => `Attività e servizi nel governatorato di ${g}`,
    tradeInOtherCities: (t) => `${t} in altre città`,
    tradeCity: (t, c) => `${t} ${c}`,

    badgeSector: 'Settore',
    badgeGovernorate: 'Governatorato',
    tunisia: 'Tunisia',
    cityTunisia: (c) => `${c}, Tunisia`,

    faqTitle: (l) => `Domande frequenti - ${l}`,
    faqTitleTradeCity: (t, c) => `Domande frequenti - ${t} a ${c}`,
    faqTitleTradeSubcatCity: (t, sc, c) => `Domande frequenti - ${t} ${sc} a ${c}`,
    faqTitleGovernorate: (g) => `Domande frequenti - Governatorato di ${g}`,

    learnMore: 'Scopri di più',
    disclaimer: 'I risultati visualizzati si basano su criteri automatizzati (recensioni pubbliche, valutazioni Google, completezza del profilo).',

    loadingMore: 'Caricamento...',
    seeMore: 'Vedi più attività',
    shownOfTotal: (s, t) => `${s} di ${t} attività`,

    breadcrumbHome: 'Home',
    breadcrumbBusinesses: 'Attività',
    breadcrumbGovernorate: (l) => `Governatorato di ${l}`,

    faqHowToFindProfessionalCity: (c) => `Come trovare un professionista a ${c}?`,
    faqHowToFindProfessionalCityAnswer: (c) => `Usa la barra di ricerca Dalil Tounes o sfoglia le categorie disponibili per ${c}. Puoi filtrare per mestiere: medico, avvocato, idraulico, parrucchiere, ristorante e molti altri.`,
    faqWhatBusinessesCity: (c) => `Quali tipi di attività sono registrate a ${c}?`,
    faqWhatBusinessesCityAnswer: (c) => `Dalil Tounes registra tutti i tipi di strutture a ${c}: professionisti sanitari, artigiani, negozi, ristoranti, hotel, servizi legali, bellezza e benessere, e altro ancora.`,
    faqReliableCity: (c) => `Le informazioni sulle attività a ${c} sono affidabili?`,
    faqReliableCityAnswer: `I dati provengono da fonti pubbliche o sono forniti dalle attività stesse. Le valutazioni visualizzate si basano sulle recensioni pubbliche di Google. Dalil Tounes non assegna alcuna valutazione e non effettua alcuna classifica editoriale.`,

    faqHowToFindTradeTunisia: (t) => `Come trovare un ${t.toLowerCase()} in Tunisia?`,
    faqHowToFindTradeTunisiaAnswer: (t) => `Usa la barra di ricerca Dalil Tounes o sfoglia l'elenco qui sotto. Puoi anche filtrare per città per trovare un ${t.toLowerCase()} vicino a te.`,
    faqReliableTrade: (t) => `Le recensioni sui ${t.toLowerCase()} sono affidabili?`,
    faqReliableTradeAnswer: `Le valutazioni visualizzate provengono dalle recensioni pubbliche di Google. Dalil Tounes non assegna alcuna valutazione e non effettua alcuna classifica editoriale. I risultati sono ordinati secondo criteri automatizzati: recensioni, completezza del profilo e presenza di foto.`,
    faqRegisterTrade: (t) => `Come registrare il mio studio o struttura di ${t.toLowerCase()} su Dalil Tounes?`,
    faqRegisterTradeAnswer: `Puoi registrare la tua struttura gratuitamente su Dalil Tounes. Visita la pagina Abbonamento per scoprire le opzioni di visibilità disponibili.`,

    faqHowToFindTradeCity: (t, c) => `Come trovare un ${t.toLowerCase()} a ${c}?`,
    faqHowToFindTradeCityAnswer: `Sfoglia l'elenco qui sotto o usa la barra di ricerca Dalil Tounes. I risultati sono ordinati per valutazione Google e completezza del profilo.`,
    faqHowManyTradeCity: (t, c) => `Quanti ${t.toLowerCase()} sono registrati a ${c}?`,
    faqHowManyTradeCityAnswer: (t, c, g) => `Dalil Tounes attualmente registra i ${t.toLowerCase()} disponibili a ${c} e nel governatorato di ${g}. Nuove strutture vengono aggiunte regolarmente.`,

    faqFindSectorProfessional: (s) => `Come trovare un professionista del settore ${s} in Tunisia?`,
    faqFindSectorProfessionalAnswer: (s) => `Usa la barra di ricerca Dalil Tounes o sfoglia i mestieri del settore ${s} qui sotto. Puoi anche filtrare per città per trovare un professionista vicino a te.`,
    faqWhatTradesInSector: (s) => `Quali mestieri sono disponibili nel settore ${s}?`,
    faqWhatTradesInSectorAnswer: (count, list) => `Dalil Tounes registra ${count} mestier${count !== 1 ? 'i' : 'e'} in questo settore, tra cui ${list}${count > 4 ? ' e molti altri' : ''}.`,
    faqSectorVerified: (s) => `Le attività del settore ${s} sono verificate?`,
    faqSectorVerifiedAnswer: `I dati provengono da fonti pubbliche o sono forniti dai professionisti. Le valutazioni visualizzate si basano sulle recensioni pubbliche di Google. Dalil Tounes non assegna alcuna valutazione e non effettua alcuna classifica editoriale.`,

    faqWhatBusinessesGovernorate: (g) => `Quali tipi di attività si trovano nel governatorato di ${g}?`,
    faqWhatBusinessesGovernorateAnswer: (g) => `Dalil Tounes registra tutti i tipi di attività nel governatorato di ${g}: professionisti sanitari, artigiani, negozi, ristoranti, servizi legali e molto altro.`,
    faqFindGovernorateProfessional: (g) => `Come trovare un professionista nel governatorato di ${g}?`,
    faqFindGovernorateProfessionalAnswer: (g, citiesList) => `Usa la barra di ricerca Dalil Tounes o sfoglia le città e i mestieri qui sotto. Puoi filtrare per città${citiesList ? ` (${citiesList}...)` : ''} o per mestiere.`,
    faqHowManyCitiesGovernorate: (g) => `Quante città sono registrate nel governatorato di ${g}?`,
    faqHowManyCitiesGovernorateAnswer: (count, g, citiesList) => `Dalil Tounes copre ${count} città nel governatorato di ${g}, tra cui ${citiesList}. Nuove località vengono aggiunte regolarmente.`,

    faqFindTradeSubcatCity: (t, sc, c) => `Come trovare un ${t.toLowerCase()} ${sc} a ${c}?`,
    faqFindTradeSubcatCityAnswer: (t, sc, c) => `Sfoglia l'elenco qui sotto o usa la barra di ricerca Dalil Tounes per trovare un ${t.toLowerCase()} specializzato in ${sc} a ${c}.`,
    faqTradeSubcatVerified: (t, sc, c) => `I ${t.toLowerCase()} ${sc} a ${c} sono verificati?`,
    faqTradeSubcatVerifiedAnswer: `Le informazioni provengono da fonti pubbliche o sono fornite dai professionisti. Le valutazioni visualizzate si basano sulle recensioni pubbliche di Google.`,
  },

  ru: {
    resultsCount: (c) => `${c} результат${c === 1 ? '' : c < 5 ? 'а' : 'ов'}`,
    businessCount: (c) => `${c} компани${c === 1 ? 'я' : c < 5 ? 'и' : 'й'} в реестре`,
    businessCountInSector: (c) => `${c} компани${c === 1 ? 'я' : c < 5 ? 'и' : 'й'} в этом секторе`,
    tradeCount: (c) => `${c} професси${c === 1 ? 'я' : c < 5 ? 'и' : 'й'} в реестре`,
    cityCount: (c) => `${c} город${c === 1 ? '' : c < 5 ? 'а' : 'ов'}`,
    establishmentCountFound: (c) => `Найдено ${c} заведени${c === 1 ? 'е' : c < 5 ? 'я' : 'й'}`,
    establishmentCountListed: (c) => `${c} заведени${c === 1 ? 'е' : c < 5 ? 'я' : 'й'} в реестре`,

    allProfessionals: 'Все профессионалы',
    viewAllProfessionals: 'Показать всех профессионалов',
    searchByTrade: 'Поиск по профессии',
    searchByCity: 'Поиск по городу',
    otherCities: 'Другие города Туниса',
    otherSectors: 'Другие сектора',
    otherGovernorates: 'Другие губернаторства',
    associatedTrades: 'Смежные профессии',
    popularTrades: 'Популярные профессии',
    sectorByCity: (s) => `${s} по городам`,
    specializationsAvailable: (c) => `Доступные специализации в ${c}`,
    tradesInSector: (s) => `Профессии сектора ${s}`,
    citiesInGovernorate: (g) => `Города губернаторства ${g}`,
    sectorTrades: (s) => `Профессии сектора ${s}`,

    noResultsCity: (c) => `Пока нет заведений в ${c}`,
    noResultsTrade: (t) => `Пока нет зарегистрированных: ${t}`,
    noResultsTradeCity: (t, c) => `Нет результатов для ${t} в ${c}`,
    noResultsSector: (s) => `Пока нет компаний в секторе ${s}`,
    noResultsGovernorate: (g) => `Пока нет компаний в губернаторстве ${g}`,
    noResultsTradeSubcat: (t, sc, c) => `Пока нет ${t} со специализацией ${sc} в ${c}.`,

    registerEstablishment: 'Зарегистрировать заведение',
    registerEstablishmentFree: 'Зарегистрируйте ваше заведение бесплатно прямо сейчас.',
    beFirstToRegister: 'Будьте первым, кто зарегистрирует заведение.',
    noEstablishmentReferenced: 'Заведений пока не зарегистрировано. Просмотрите всех профессионалов для большего выбора.',
    exploreAllProfessionals: 'Просмотрите всех профессионалов для большего выбора.',
    allTradesInCity: (t, c) => `Все ${t} в ${c}`,

    platform: (c) => `Платформа ${c}`,
    tradeInTunisia: (t) => `${t} в Тунисе`,
    sectorInTunisia: (s) => `${s} в Тунисе`,
    businessesInGovernorate: (g) => `Компании и услуги в губернаторстве ${g}`,
    tradeInOtherCities: (t) => `${t} в других городах`,
    tradeCity: (t, c) => `${t} ${c}`,

    badgeSector: 'Сектор',
    badgeGovernorate: 'Губернаторство',
    tunisia: 'Тунис',
    cityTunisia: (c) => `${c}, Тунис`,

    faqTitle: (l) => `Часто задаваемые вопросы - ${l}`,
    faqTitleTradeCity: (t, c) => `Часто задаваемые вопросы - ${t} в ${c}`,
    faqTitleTradeSubcatCity: (t, sc, c) => `Часто задаваемые вопросы - ${t} ${sc} в ${c}`,
    faqTitleGovernorate: (g) => `Часто задаваемые вопросы - Губернаторство ${g}`,

    learnMore: 'Подробнее',
    disclaimer: 'Результаты основаны на автоматических критериях (публичные отзывы, оценки Google, полнота профиля).',

    loadingMore: 'Загрузка...',
    seeMore: 'Показать больше компаний',
    shownOfTotal: (s, t) => `${s} из ${t} компаний`,

    breadcrumbHome: 'Главная',
    breadcrumbBusinesses: 'Компании',
    breadcrumbGovernorate: (l) => `Губернаторство ${l}`,

    faqHowToFindProfessionalCity: (c) => `Как найти профессионала в ${c}?`,
    faqHowToFindProfessionalCityAnswer: (c) => `Используйте строку поиска Dalil Tounes или просмотрите категории, доступные для ${c}. Вы можете фильтровать по профессии: врач, юрист, сантехник, парикмахер, ресторан и многие другие.`,
    faqWhatBusinessesCity: (c) => `Какие типы компаний зарегистрированы в ${c}?`,
    faqWhatBusinessesCityAnswer: (c) => `Dalil Tounes регистрирует все типы заведений в ${c}: медицинских работников, ремесленников, магазины, рестораны, отели, юридические услуги, красоту и здоровье, и многое другое.`,
    faqReliableCity: (c) => `Надёжна ли информация о компаниях в ${c}?`,
    faqReliableCityAnswer: `Данные поступают из публичных источников или предоставляются самими компаниями. Отображаемые оценки основаны на публичных отзывах Google. Dalil Tounes не присваивает оценки и не составляет редакционных рейтингов.`,

    faqHowToFindTradeTunisia: (t) => `Как найти ${t} в Тунисе?`,
    faqHowToFindTradeTunisiaAnswer: (t) => `Используйте строку поиска Dalil Tounes или просмотрите список ниже. Вы также можете фильтровать по городу, чтобы найти ${t} поблизости.`,
    faqReliableTrade: (t) => `Надёжны ли отзывы о ${t}?`,
    faqReliableTradeAnswer: `Отображаемые оценки взяты из публичных отзывов Google. Dalil Tounes не присваивает оценки и не составляет редакционных рейтингов. Результаты отсортированы по автоматическим критериям: отзывы, полнота профиля и наличие фото.`,
    faqRegisterTrade: (t) => `Как зарегистрировать мою практику или заведение ${t} на Dalil Tounes?`,
    faqRegisterTradeAnswer: `Вы можете бесплатно зарегистрировать своё заведение на Dalil Tounes. Перейдите на страницу подписки, чтобы узнать о доступных вариантах продвижения.`,

    faqHowToFindTradeCity: (t, c) => `Как найти ${t} в ${c}?`,
    faqHowToFindTradeCityAnswer: `Просмотрите список ниже или используйте строку поиска Dalil Tounes. Результаты отсортированы по оценке Google и полноте профиля.`,
    faqHowManyTradeCity: (t, c) => `Сколько ${t} зарегистрировано в ${c}?`,
    faqHowManyTradeCityAnswer: (t, c, g) => `Dalil Tounes в настоящее время регистрирует ${t}, доступных в ${c} и в губернаторстве ${g}. Новые заведения добавляются регулярно.`,

    faqFindSectorProfessional: (s) => `Как найти профессионала в секторе ${s} в Тунисе?`,
    faqFindSectorProfessionalAnswer: (s) => `Используйте строку поиска Dalil Tounes или просмотрите профессии сектора ${s} ниже. Вы также можете фильтровать по городу, чтобы найти профессионала поблизости.`,
    faqWhatTradesInSector: (s) => `Какие профессии доступны в секторе ${s}?`,
    faqWhatTradesInSectorAnswer: (count, list) => `Dalil Tounes регистрирует ${count} професси${count === 1 ? 'ю' : count < 5 ? 'и' : 'й'} в этом секторе, включая ${list}${count > 4 ? ' и многие другие' : ''}.`,
    faqSectorVerified: (s) => `Проверены ли компании в секторе ${s}?`,
    faqSectorVerifiedAnswer: `Данные поступают из публичных источников или предоставляются профессионалами. Отображаемые оценки основаны на публичных отзывах Google. Dalil Tounes не присваивает оценки и не составляет редакционных рейтингов.`,

    faqWhatBusinessesGovernorate: (g) => `Какие типы компаний есть в губернаторстве ${g}?`,
    faqWhatBusinessesGovernorateAnswer: (g) => `Dalil Tounes регистрирует все типы компаний в губернаторстве ${g}: медицинских работников, ремесленников, магазины, рестораны, юридические услуги и многое другое.`,
    faqFindGovernorateProfessional: (g) => `Как найти профессионала в губернаторстве ${g}?`,
    faqFindGovernorateProfessionalAnswer: (g, citiesList) => `Используйте строку поиска Dalil Tounes или просмотрите города и профессии ниже. Вы можете фильтровать по городу${citiesList ? ` (${citiesList}...)` : ''} или по профессии.`,
    faqHowManyCitiesGovernorate: (g) => `Сколько городов зарегистрировано в губернаторстве ${g}?`,
    faqHowManyCitiesGovernorateAnswer: (count, g, citiesList) => `Dalil Tounes охватывает ${count} город${count === 1 ? '' : count < 5 ? 'а' : 'ов'} в губернаторстве ${g}, включая ${citiesList}. Новые локации добавляются регулярно.`,

    faqFindTradeSubcatCity: (t, sc, c) => `Как найти ${t} ${sc} в ${c}?`,
    faqFindTradeSubcatCityAnswer: (t, sc, c) => `Просмотрите список ниже или используйте строку поиска Dalil Tounes, чтобы найти ${t} со специализацией ${sc} в ${c}.`,
    faqTradeSubcatVerified: (t, sc, c) => `Проверены ли ${t} ${sc} в ${c}?`,
    faqTradeSubcatVerifiedAnswer: `Информация поступает из публичных источников или предоставляется профессионалами. Отображаемые оценки основаны на публичных отзывах Google.`,
  },
};

export function getSeoPageTranslations(lang: Language): SeoPageTranslations {
  return translations[lang] || translations.fr;
}
