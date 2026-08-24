import fs from 'node:fs';

function load(path) {
  return fs.readFileSync(path, 'utf8');
}

function save(path, content) {
  fs.writeFileSync(path, content, 'utf8');
}

function replaceRequired(content, from, to, label) {
  if (!content.includes(from)) {
    throw new Error(`Missing expected source for ${label}`);
  }
  return content.replace(from, to);
}

function replaceOptional(content, from, to) {
  return content.includes(from) ? content.replace(from, to) : content;
}

function patchBusinesses() {
  const path = 'src/pages/Businesses.tsx';
  let s = load(path);

  s = replaceRequired(
    s,
    "import { useTranslation } from '../lib/i18n';",
    "import { useTranslation } from '../lib/i18n';\nimport { getBusinessesPageTranslations } from '../lib/businessesPageTranslations';",
    'Businesses translation import',
  );
  s = replaceRequired(
    s,
    '  const t = useTranslation(language);',
    '  const t = useTranslation(language);\n  const pageT = getBusinessesPageTranslations(language);',
    'Businesses pageT initialization',
  );

  s = replaceRequired(s, "message: language === 'fr'\n          ? 'Merci ! Votre demande a été envoyée avec succès. Nous vous recontacterons rapidement.'\n          : language === 'ar'\n          ? 'شكراً! تم إرسال طلبك بنجاح. سنتواصل معك قريباً.'\n          : 'Thank you! Your request has been sent successfully. We will contact you soon.',", 'message: pageT.form.success,', 'Businesses success toast');
  s = replaceRequired(s, "message: language === 'fr'\n          ? 'Une erreur est survenue. Veuillez réessayer.'\n          : language === 'ar'\n          ? 'حدث خطأ. يرجى المحاولة مرة أخرى.'\n          : 'An error occurred. Please try again.',", 'message: pageT.form.error,', 'Businesses error toast');

  s = replaceRequired(s, "name: business.name || 'Sans nom',", 'name: business.name || pageT.seo.unnamedBusiness,', 'Businesses unnamed business');
  s = replaceRequired(s, "            'Annuaire des Entreprises en Tunisie - Dalil Tounes',\n            'Trouvez les meilleures entreprises et professionnels en Tunisie par secteur d\\'activité',", '            pageT.seo.title,\n            pageT.seo.description,', 'Businesses structured data');

  const direct = [
    ['                  Professionnels', '                  {pageT.hero.eyebrow}'],
    ['                  Développez votre activité avec Dalil Tounes', '                  {pageT.hero.title}'],
    ['                  Présentez votre activité grâce à une fiche professionnelle complète, facilitez les contacts avec vos futurs clients et développez votre visibilité partout en Tunisie.', '                  {pageT.hero.description}'],
    ['                    Découvrir les offres', '                    {pageT.hero.offers}'],
    ['                    Rechercher une entreprise', '                    {pageT.hero.search}'],
    ['                title="Bonjour !"', '                title={pageT.hero.mascotTitle}'],
    ['                message="Je vais vous montrer comment une fiche professionnelle peut aider votre activité à gagner en visibilité et inspirer confiance."', '                message={pageT.hero.mascotMessage}'],
    ['              eyebrow="Présence en ligne"', '              eyebrow={pageT.onlinePresence.eyebrow}'],
    ['              title="Aujourd\'hui, vos futurs clients recherchent d\'abord sur Internet."', '              title={pageT.onlinePresence.title}'],
    ["              <p>Avant d'appeler, de se déplacer ou de réserver, beaucoup de personnes commencent par chercher une entreprise en ligne.</p>", '              <p>{pageT.onlinePresence.paragraphs[0]}</p>'],
    ["              <p>Elles veulent vérifier les horaires, l'adresse, les avis, les photos, les coordonnées et comprendre rapidement si le professionnel correspond à leur besoin.</p>", '              <p>{pageT.onlinePresence.paragraphs[1]}</p>'],
    ['              <p>Le bouche-à-oreille reste précieux. Beaucoup de personnes demandent encore conseil à leur entourage avant de choisir un artisan, un commerçant ou une entreprise.</p>', '              <p>{pageT.onlinePresence.paragraphs[2]}</p>'],
    ['              <p>Mais une recommandation ne permet pas toujours de vérifier le nouveau numéro, la nouvelle adresse, les horaires, les avis récents, les photos ou les services proposés.</p>', '              <p>{pageT.onlinePresence.paragraphs[3]}</p>'],
    ['              <p>Les citoyens souhaitent désormais compléter ces recommandations grâce à des informations fiables, cohérentes et régulièrement mises à jour. Quand ces informations sont faciles à retrouver, le premier contact devient naturellement plus simple.</p>', '              <p>{pageT.onlinePresence.paragraphs[4]}</p>'],
    ['              eyebrow="Pourquoi une fiche ?"', '              eyebrow={pageT.whyProfile.eyebrow}'],
    ['              title="Pourquoi une fiche professionnelle est-elle importante ?"', '              title={pageT.whyProfile.title}'],
    ['              <p>Beaucoup de professionnels possèdent un véritable savoir-faire. Pourtant, leurs informations sont parfois dispersées ou incomplètes.</p>', '              <p>{pageT.whyProfile.paragraphs[0]}</p>'],
    ["              <p>Une page Facebook peut afficher un ancien numéro. Google Business peut contenir des horaires non mis à jour. Instagram montre souvent de belles photos, mais peu d'informations pratiques.</p>", '              <p>{pageT.whyProfile.paragraphs[1]}</p>'],
    ['              <p>Une fiche professionnelle complète, cohérente et régulièrement mise à jour aide aussi les moteurs de recherche à mieux comprendre votre activité.</p>', '              <p>{pageT.whyProfile.paragraphs[2]}</p>'],
    ["              <p>Plus votre présence numérique est cohérente, plus vous augmentez vos chances d'être trouvé lors des recherches locales, sans jamais garantir une position précise sur Google.</p>", '              <p>{pageT.whyProfile.paragraphs[3]}</p>'],
    ['              <p>Une fiche professionnelle claire, complète et régulièrement mise à jour permet de rassurer les visiteurs et facilite le premier contact.</p>', '              <p>{pageT.whyProfile.paragraphs[4]}</p>'],
    ['                <h3 className="text-lg font-bold text-[#4A1D43]">Conseil de Dalil</h3>', '                <h3 className="text-lg font-bold text-[#4A1D43]">{pageT.whyProfile.adviceTitle}</h3>'],
    ['                Avant de chercher à être plus visible, assurez-vous que les informations de votre entreprise sont cohérentes partout où vos clients peuvent vous trouver.', '                {pageT.whyProfile.adviceText}'],
    ["              title=\"À vous d'explorer.\"", '              title={pageT.explore.mascotTitle}'],
    ['              message="Vous pouvez maintenant découvrir les professionnels déjà présents sur Dalil Tounes et voir comment leurs fiches sont présentées aux visiteurs."', '              message={pageT.explore.mascotMessage}'],
    ['              <h2 className="text-xl md:text-2xl font-bold text-[#4A1D43]">Découvrez les entreprises déjà présentes sur Dalil Tounes.</h2>', '              <h2 className="text-xl md:text-2xl font-bold text-[#4A1D43]">{pageT.explore.title}</h2>'],
    ['                Vous pouvez rechercher une entreprise, un artisan, un commerçant ou un professionnel partout en Tunisie et découvrir leur fiche.', '                {pageT.explore.description}'],
    ['                    <span className="font-medium">Recherchez parmi les entreprises déjà présentes sur Dalil Tounes.</span>', '                    <span className="font-medium">{pageT.explore.hint}</span>'],
    ['                  {hasActiveSearch ? ((t as any).businessesExtra?.searchResults || \'Résultats de votre recherche\') : ((t as any).businessesExtra?.featuredTitle || \'Entreprises en vedette\')}', '                  {hasActiveSearch ? pageT.results.searchResults : pageT.results.featured}'],
    ["                    ({hasActiveSearch ? filteredBusinesses.length : Math.min(3, filteredBusinesses.length)} {filteredBusinesses.length > 1 ? ((t as any).businessesExtra?.businessPlur || 'entreprises') : ((t as any).businessesExtra?.businessSing || 'entreprise')})", '                    ({hasActiveSearch ? filteredBusinesses.length : Math.min(3, filteredBusinesses.length)} {filteredBusinesses.length > 1 ? pageT.results.businessPlural : pageT.results.businessSingular})'],
    ["                    {(t as any).businessesExtra?.reset || 'Réinitialiser'}", '                    {pageT.results.reset}'],
    ['              <SectionIntro eyebrow="Le CV Business" title="Une fiche qui devient le CV numérique de votre entreprise.">', '              <SectionIntro eyebrow={pageT.cvBusiness.eyebrow} title={pageT.cvBusiness.title}>'],
    ['                <p>Le CV Business rassemble les informations utiles pour présenter votre activité, expliquer votre savoir-faire et aider les visiteurs à comprendre rapidement qui vous êtes.</p>', '                <p>{pageT.cvBusiness.paragraphs[0]}</p>'],
    ["                <p>Il ne s'agit pas seulement d'être visible. Il s'agit aussi d'inspirer confiance avec une fiche claire, complète et vérifiable.</p>", '                <p>{pageT.cvBusiness.paragraphs[1]}</p>'],
    ['                <FeaturePill icon={Phone} label="Téléphone" />', '                <FeaturePill icon={Phone} label={pageT.cvBusiness.features.phone} />'],
    ['                <FeaturePill icon={Mail} label="Description" />', '                <FeaturePill icon={Mail} label={pageT.cvBusiness.features.description} />'],
    ['                <FeaturePill icon={Award} label="Certificat" />', '                <FeaturePill icon={Award} label={pageT.cvBusiness.features.certificate} />'],
    ['                <FeaturePill icon={Clock} label="Horaires" />', '                <FeaturePill icon={Clock} label={pageT.cvBusiness.features.hours} />'],
    ['                <FeaturePill icon={Calendar} label="Réservation" />', '                <FeaturePill icon={Calendar} label={pageT.cvBusiness.features.booking} />'],
    ['                <FeaturePill icon={QrCode} label="QR Code" />', '                <FeaturePill icon={QrCode} label={pageT.cvBusiness.features.qrCode} />'],
    ['                Voir la fiche en grand', '                {pageT.cvBusiness.viewLarge}'],
    ['              eyebrow="Cohérence"', '              eyebrow={pageT.consistency.eyebrow}'],
    ['              title="Une présence en ligne cohérente inspire confiance."', '              title={pageT.consistency.title}'],
    ['              <p>Google Business, Facebook, Instagram, LinkedIn et votre site web restent utiles. Dalil Tounes ne les remplace pas : il les complète en rassemblant les informations importantes dans une fiche claire.</p>', '              <p>{pageT.consistency.paragraphs[0]}</p>'],
    ["              <p>Un client peut voir un ancien numéro sur Facebook, des horaires différents sur Google et peu d'informations pratiques sur Instagram. Dans ce cas, il hésite ou passe à une autre entreprise.</p>", '              <p>{pageT.consistency.paragraphs[1]}</p>'],
    ['              <p>Une fiche vérifiée et mise à jour aide à rendre vos informations plus cohérentes, plus faciles à consulter et plus rassurantes au moment de vous contacter.</p>', '              <p>{pageT.consistency.paragraphs[2]}</p>'],
    ["              {['Centraliser les informations utiles', 'Éviter les informations contradictoires', 'Faciliter le premier contact'].map((item) => (", '              {pageT.consistency.benefits.map((item: string) => ('],
    ['                eyebrow="Parcours client"', '                eyebrow={pageT.customerJourney.eyebrow}'],
    ['                title="Comment un citoyen découvre votre entreprise ?"', '                title={pageT.customerJourney.title}'],
    ['                <p>La fiche entreprise devient le point de rencontre entre les citoyens qui cherchent un professionnel et les professionnels qui souhaitent être trouvés.</p>', '                <p>{pageT.customerJourney.description}</p>'],
    ['                  <span className="font-bold text-[#4A1D43]">Message de Dalil : </span>', '                  <span className="font-bold text-[#4A1D43]">{pageT.customerJourney.dalilLabel}</span>'],
    ['                  quand les informations sont claires, le visiteur hésite moins. Il comprend mieux votre activité et sait comment vous contacter.', '                  {pageT.customerJourney.dalilMessage}'],
    ["                {[\n                  'Le citoyen recherche un professionnel, une entreprise ou un service.',\n                  'Il consulte une fiche claire avec les informations utiles pour se faire une première idée.',\n                  'Il contacte, réserve ou partage la fiche quand il pense avoir trouvé le bon professionnel.',\n                ].map((item, index) => (", '                {pageT.customerJourney.steps.map((item: string, index: number) => ('],
    ['              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37] mb-3">FAQ</p>', '              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D4AF37] mb-3">{pageT.faq.eyebrow}</p>'],
    ['              <h2 className="text-2xl md:text-3xl font-bold text-[#4A1D43]">Questions fréquentes des professionnels</h2>', '              <h2 className="text-2xl md:text-3xl font-bold text-[#4A1D43]">{pageT.faq.title}</h2>'],
    ['              {PROFESSIONAL_FAQ.map((item) => (', '              {pageT.faq.items.map((item: { question: string; answer: string }) => ('],
    ['            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F7D978]">Avec Dalil</p>', '            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F7D978]">{pageT.finalCta.eyebrow}</p>'],
    ['            <h2 className="mt-3 text-2xl md:text-4xl font-bold">Prêt à développer votre activité ?</h2>', '            <h2 className="mt-3 text-2xl md:text-4xl font-bold">{pageT.finalCta.title}</h2>'],
    ['              Découvrez les différentes offres proposées par Dalil Tounes et choisissez la solution la plus adaptée à votre activité.', '              {pageT.finalCta.description}'],
    ['              Dalil vous accompagne étape par étape, avec une approche simple, utile et progressive.', '              {pageT.finalCta.reassurance}'],
    ['              Découvrir les offres', '              {pageT.finalCta.button}'],
    ['                    Exemple de fiche professionnelle Dalil Tounes', '                    {pageT.demo.title}'],
    ["                    Cette démonstration vous permet de découvrir les principales fonctionnalités d'une fiche professionnelle.", '                    {pageT.demo.description}'],
    ['                  aria-label="Fermer la démonstration"', '                  aria-label={pageT.demo.close}'],
    ['                  <h2 className="text-xl font-medium text-gray-900">Demande d’information / inscription</h2>', '                  <h2 className="text-xl font-medium text-gray-900">{pageT.form.title}</h2>'],
    ['                    Une question ou une demande d’inscription ? Envoyez-nous votre demande, nous vous recontactons rapidement.', '                    {pageT.form.description}'],
    ['                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre de votre demande *</label>', '                  <label className="block text-sm font-medium text-gray-700 mb-1">{pageT.form.requestTitle}</label>'],
    ['                    placeholder="Ex : inscription entreprise, chauffeur privé, professeur, candidat emploi..."', '                    placeholder={pageT.form.requestPlaceholder}'],
    ['                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>', '                    <label className="block text-sm font-medium text-gray-700 mb-1">{pageT.form.phone}</label>'],
    ['                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>', '                    <label className="block text-sm font-medium text-gray-700 mb-1">{pageT.form.email}</label>'],
    ['                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>', '                  <label className="block text-sm font-medium text-gray-700 mb-1">{pageT.form.message}</label>'],
    ['                    placeholder="Expliquez brièvement votre demande."', '                    placeholder={pageT.form.messagePlaceholder}'],
  ];

  for (const [from, to] of direct) {
    s = replaceRequired(s, from, to, `Businesses text: ${from.slice(0, 50)}`);
  }

  save(path, s);
}

function patchAdmin() {
  const path = 'src/pages/CitizensAdmin.tsx';
  let s = load(path);

  const languageExtras = [
    ["      loading: 'Chargement...'", "      loading: 'Chargement...',\n      heroAlt: 'Services publics en Tunisie',\n      queryLabel: 'Recherche',\n      cityLabel: 'Ville',\n      adminFinanceTitle: 'Services Administratifs & Financiers',\n      adminFinanceDescription: 'Trouvez les banques, assurances, bureaux de change et autres services administratifs près de chez vous.',\n      resultsTitle: 'Résultats de recherche',\n      resultsCount: 'résultats',\n      resetSearch: 'Réinitialiser la recherche',\n      searching: 'Recherche en cours...',\n      noService: 'Aucun service trouvé',\n      modifySearch: 'Essayez de modifier vos critères de recherche'"],
    ["      loading: 'Loading...'", "      loading: 'Loading...',\n      heroAlt: 'Public services in Tunisia',\n      queryLabel: 'Search',\n      cityLabel: 'City',\n      adminFinanceTitle: 'Administrative & Financial Services',\n      adminFinanceDescription: 'Find banks, insurance companies, exchange offices and other administrative services near you.',\n      resultsTitle: 'Search results',\n      resultsCount: 'results',\n      resetSearch: 'Reset search',\n      searching: 'Searching...',\n      noService: 'No service found',\n      modifySearch: 'Try changing your search criteria'"],
    ["      loading: 'جاري التحميل...'", "      loading: 'جاري التحميل...',\n      heroAlt: 'الخدمات العامة في تونس',\n      queryLabel: 'البحث',\n      cityLabel: 'المدينة',\n      adminFinanceTitle: 'الخدمات الإدارية والمالية',\n      adminFinanceDescription: 'اعثر على البنوك وشركات التأمين ومكاتب الصرف وغيرها من الخدمات الإدارية القريبة منك.',\n      resultsTitle: 'نتائج البحث',\n      resultsCount: 'نتائج',\n      resetSearch: 'إعادة تعيين البحث',\n      searching: 'جارٍ البحث...',\n      noService: 'لم يتم العثور على خدمة',\n      modifySearch: 'حاول تعديل معايير البحث'"],
    ["      loading: 'Caricamento...'", "      loading: 'Caricamento...',\n      heroAlt: 'Servizi pubblici in Tunisia',\n      queryLabel: 'Ricerca',\n      cityLabel: 'Città',\n      adminFinanceTitle: 'Servizi Amministrativi e Finanziari',\n      adminFinanceDescription: 'Trova banche, assicurazioni, uffici di cambio e altri servizi amministrativi vicino a te.',\n      resultsTitle: 'Risultati della ricerca',\n      resultsCount: 'risultati',\n      resetSearch: 'Reimposta la ricerca',\n      searching: 'Ricerca in corso...',\n      noService: 'Nessun servizio trovato',\n      modifySearch: 'Prova a modificare i criteri di ricerca'"],
    ["      loading: 'Загрузка...'", "      loading: 'Загрузка...',\n      heroAlt: 'Государственные услуги в Тунисе',\n      queryLabel: 'Поиск',\n      cityLabel: 'Город',\n      adminFinanceTitle: 'Административные и финансовые услуги',\n      adminFinanceDescription: 'Найдите банки, страховые компании, обменные пункты и другие административные услуги рядом с вами.',\n      resultsTitle: 'Результаты поиска',\n      resultsCount: 'результатов',\n      resetSearch: 'Сбросить поиск',\n      searching: 'Поиск...',\n      noService: 'Услуги не найдены',\n      modifySearch: 'Попробуйте изменить критерии поиска'"],
  ];
  for (const [from, to] of languageExtras) s = replaceRequired(s, from, to, `Admin translations ${from}`);

  const direct = [
    ['          alt="Services Publics en Tunisie"', '          alt={t.heroAlt}'],
    ['              {q && <>Recherche : <b>{q}</b> · </>}', '              {q && <>{t.queryLabel} : <b>{q}</b> · </>}'],
    ['              {ville && <>Ville : <b>{ville}</b></>}', '              {ville && <>{t.cityLabel} : <b>{ville}</b></>}'],
    ['          <h2 className="text-lg font-semibold text-[#4A1D43] mb-2">Services Administratifs & Financiers</h2>', '          <h2 className="text-lg font-semibold text-[#4A1D43] mb-2">{t.adminFinanceTitle}</h2>'],
    ['            Trouvez les banques, assurances, bureaux de change et autres services administratifs près de chez vous.', '            {t.adminFinanceDescription}'],
    ['                Résultats de recherche', '                {t.resultsTitle}'],
    ['                  <span className="font-semibold text-[#4A1D43]">{adminResults.length}</span> résultats', '                  <span className="font-semibold text-[#4A1D43]">{adminResults.length}</span> {t.resultsCount}'],
    ['                  Réinitialiser la recherche', '                  {t.resetSearch}'],
    ['                <p className="text-xs text-gray-600 ml-3">Recherche en cours...</p>', '                <p className="text-xs text-gray-600 ml-3">{t.searching}</p>'],
    ['                <h3 className="text-sm font-semibold text-gray-700 mb-1">Aucun service trouvé</h3>', '                <h3 className="text-sm font-semibold text-gray-700 mb-1">{t.noService}</h3>'],
    ['                <p className="text-xs text-gray-500">Essayez de modifier vos critères de recherche</p>', '                <p className="text-xs text-gray-500">{t.modifySearch}</p>'],
  ];
  for (const [from, to] of direct) s = replaceRequired(s, from, to, `Admin text: ${from.slice(0, 50)}`);
  save(path, s);
}

function patchLeisure() {
  const path = 'src/pages/CitizensLeisure.tsx';
  let s = load(path);
  s = replaceRequired(
    s,
    '  const t = translations[language];',
    "  const t = translations[language];\n  const dateLocale: Record<Language, string> = { fr: 'fr-FR', en: 'en-US', ar: 'ar-TN', it: 'it-IT', ru: 'ru-RU' };\n  const currentDateLocale = dateLocale[language];\n  const leisureAlt = {\n    fr: { hero: 'Drapeau de la Tunisie - Loisirs et événements culturels tunisiens sur Dalil Tounes', chechia: 'Chéchia dorée tunisienne - Symbole du patrimoine artisanal de Tunisie' },\n    en: { hero: 'Flag of Tunisia - Leisure and cultural events on Dalil Tounes', chechia: 'Golden Tunisian chechia - Symbol of Tunisian craft heritage' },\n    ar: { hero: 'علم تونس - الترفيه والفعاليات الثقافية على دليل تونس', chechia: 'الشاشية التونسية الذهبية - رمز التراث الحرفي التونسي' },\n    it: { hero: 'Bandiera della Tunisia - Tempo libero ed eventi culturali su Dalil Tounes', chechia: 'Chechia tunisina dorata - Simbolo del patrimonio artigianale tunisino' },\n    ru: { hero: 'Флаг Туниса - Досуг и культурные мероприятия на Dalil Tounes', chechia: 'Золотая тунисская шешия - Символ ремесленного наследия Туниса' },\n  }[language];",
    'Leisure locale setup',
  );
  s = replaceRequired(s, "debut.toLocaleDateString(language === 'ar' ? 'ar-TN' : language === 'en' ? 'en-US' : 'fr-FR', options)", 'debut.toLocaleDateString(currentDateLocale, options)', 'Leisure single date locale');
  s = replaceRequired(s, "debut.toLocaleDateString(language === 'ar' ? 'ar-TN' : language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short' })", "debut.toLocaleDateString(currentDateLocale, { day: 'numeric', month: 'short' })", 'Leisure range start locale');
  s = replaceRequired(s, "fin.toLocaleDateString(language === 'ar' ? 'ar-TN' : language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short' })", "fin.toLocaleDateString(currentDateLocale, { day: 'numeric', month: 'short' })", 'Leisure range end locale');
  s = replaceRequired(s, "return date.toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' });", "return date.toLocaleDateString(currentDateLocale, { day: 'numeric', month: 'long', year: 'numeric' });", 'Leisure full date locale');
  s = replaceRequired(s, '              alt="Drapeau de la Tunisie - Loisirs et événements culturels tunisiens sur Dalil Tounes"', '              alt={leisureAlt.hero}', 'Leisure hero alt');
  s = replaceRequired(s, '                alt="Chéchia dorée tunisienne - Symbole du patrimoine artisanal de Tunisie"', '                alt={leisureAlt.chechia}', 'Leisure chechia alt');
  save(path, s);
}

patchBusinesses();
patchAdmin();
patchLeisure();
console.log('Public i18n migration applied successfully.');
