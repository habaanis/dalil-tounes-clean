import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import TourismExperienceDiscovery from '../components/TourismExperienceDiscovery';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import { ChevronDown, Compass, ExternalLink, Home } from 'lucide-react';

type PublicLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

const copy: Record<PublicLanguage, {
  title: string;
  intro: string;
  slogan: string;
  sector: string;
  recommended: string;
  preferredTitle: string;
  preferredSubtitle: string;
  allReferenced: string;
  searchOther: string;
  searchQuery: string;
  articleTitle: string;
  articleExcerpt: string;
  heroAlt: string;
  seoTitle: string;
  expatTitle: string;
  expatIntro: string;
  quickLinks: readonly [string, string, string, string];
}> = {
  fr: {
    title: 'Tourisme Local & Expatriation',
    intro: "Découvrez les meilleurs services pour touristes et expatriés en Tunisie. Hébergement, guides touristiques, services d'immigration et plus encore.",
    slogan: 'Votre guide pour un séjour réussi en Tunisie',
    sector: 'tourisme',
    recommended: 'Entreprises les plus recommandées par les clients',
    preferredTitle: 'Les services utiles aux touristes et expatriés',
    preferredSubtitle: 'Des professionnels pour faciliter votre séjour ou votre installation en Tunisie',
    allReferenced: 'Tous les services tourisme & expatriation référencés',
    searchOther: "Rechercher d'autres services tourisme & expatriation",
    searchQuery: 'tourisme expatriation',
    articleTitle: 'Guide du tourisme en Tunisie',
    articleExcerpt: 'Découvrez les meilleurs sites, hébergements et activités pour un séjour inoubliable en Tunisie.',
    heroAlt: 'Tourisme local et expatriation en Tunisie',
    seoTitle: 'Tourisme et services pour expatriés en Tunisie | Dalil Tounes',
    expatTitle: "S'installer et vivre en Tunisie",
    expatIntro: 'Retrouvez rapidement les services essentiels pour préparer votre séjour, vos démarches et votre vie quotidienne.',
    quickLinks: ['Services publics', 'Santé', 'Éducation', 'Emploi'],
  },
  ar: {
    title: 'السياحة المحلية والاغتراب',
    intro: 'اكتشف أفضل الخدمات للسياح والمغتربين في تونس: الإقامة، الأدلة السياحية، خدمات الهجرة والمزيد.',
    slogan: 'دليلك لإقامة ناجحة في تونس',
    sector: 'سياحة',
    recommended: 'المؤسسات الأكثر توصية من قبل العملاء',
    preferredTitle: 'خدمات مفيدة للسياح والمقيمين الأجانب',
    preferredSubtitle: 'مهنيون يساعدونك على تسهيل إقامتك أو استقرارك في تونس',
    allReferenced: 'جميع خدمات السياحة والإقامة للأجانب المسجلة',
    searchOther: 'البحث عن خدمات سياحية وخدمات للمقيمين الأجانب',
    searchQuery: 'السياحة الإقامة الأجانب',
    articleTitle: 'دليل السياحة في تونس',
    articleExcerpt: 'اكتشف أفضل المواقع والإقامات والأنشطة لإقامة لا تُنسى في تونس.',
    heroAlt: 'السياحة المحلية وخدمات المغتربين في تونس',
    seoTitle: 'السياحة وخدمات المقيمين الأجانب في تونس | دليل تونس',
    expatTitle: 'الاستقرار والعيش في تونس',
    expatIntro: 'اعثر بسرعة على الخدمات الأساسية لتحضير إقامتك وإجراءاتك وحياتك اليومية.',
    quickLinks: ['الخدمات العامة', 'الصحة', 'التعليم', 'التوظيف'],
  },
  en: {
    title: 'Local Tourism & Expatriation',
    intro: 'Discover services for tourists and expatriates in Tunisia, including accommodation, tourist guides, immigration services and more.',
    slogan: 'Your guide to a successful stay in Tunisia',
    sector: 'tourism',
    recommended: 'Most recommended businesses by customers',
    preferredTitle: 'Useful services for tourists and expatriates',
    preferredSubtitle: 'Professionals who can make your stay or relocation to Tunisia easier',
    allReferenced: 'All listed tourism and expatriation services',
    searchOther: 'Search other tourism and expatriation services',
    searchQuery: 'tourism expatriation',
    articleTitle: 'Tourism guide in Tunisia',
    articleExcerpt: 'Discover the best sites, accommodations and activities for an unforgettable stay in Tunisia.',
    heroAlt: 'Local tourism and expatriation services in Tunisia',
    seoTitle: 'Tourism and expatriate services in Tunisia | Dalil Tounes',
    expatTitle: 'Settling and living in Tunisia',
    expatIntro: 'Quickly find essential services for your stay, administrative procedures and daily life.',
    quickLinks: ['Public services', 'Health', 'Education', 'Jobs'],
  },
  it: {
    title: 'Turismo Locale ed Espatrio',
    intro: 'Scopri i servizi per turisti ed espatriati in Tunisia: alloggi, guide turistiche, servizi di immigrazione e molto altro.',
    slogan: 'La tua guida per un soggiorno di successo in Tunisia',
    sector: 'turismo',
    recommended: 'Aziende più raccomandate dai clienti',
    preferredTitle: 'Servizi utili per turisti ed espatriati',
    preferredSubtitle: 'Professionisti che facilitano il tuo soggiorno o trasferimento in Tunisia',
    allReferenced: 'Tutti i servizi turistici e per espatriati registrati',
    searchOther: 'Cerca altri servizi turistici e per espatriati',
    searchQuery: 'turismo espatriati',
    articleTitle: 'Guida al turismo in Tunisia',
    articleExcerpt: 'Scopri i migliori siti, alloggi e attività per un soggiorno indimenticabile in Tunisia.',
    heroAlt: 'Turismo locale e servizi per espatriati in Tunisia',
    seoTitle: 'Turismo e servizi per espatriati in Tunisia | Dalil Tounes',
    expatTitle: 'Trasferirsi e vivere in Tunisia',
    expatIntro: 'Trova rapidamente i servizi essenziali per il soggiorno, le pratiche amministrative e la vita quotidiana.',
    quickLinks: ['Servizi pubblici', 'Salute', 'Istruzione', 'Lavoro'],
  },
  ru: {
    title: 'Местный туризм и жизнь за границей',
    intro: 'Найдите полезные услуги для туристов и экспатов в Тунисе: жильё, гидов, иммиграционные услуги и многое другое.',
    slogan: 'Ваш гид для комфортного пребывания в Тунисе',
    sector: 'туризм',
    recommended: 'Компании, которые чаще всего рекомендуют клиенты',
    preferredTitle: 'Полезные услуги для туристов и экспатов',
    preferredSubtitle: 'Специалисты, которые помогут с поездкой или переездом в Тунис',
    allReferenced: 'Все услуги для туристов и экспатов',
    searchOther: 'Найти другие услуги для туристов и экспатов',
    searchQuery: 'туризм экспаты',
    articleTitle: 'Путеводитель по Тунису',
    articleExcerpt: 'Откройте лучшие места, варианты проживания и развлечения для незабываемой поездки по Тунису.',
    heroAlt: 'Местный туризм и услуги для экспатов в Тунисе',
    seoTitle: 'Туризм и услуги для экспатов в Тунисе | Dalil Tounes',
    expatTitle: 'Переезд и жизнь в Тунисе',
    expatIntro: 'Быстро найдите основные услуги для поездки, административных процедур и повседневной жизни.',
    quickLinks: ['Госуслуги', 'Здоровье', 'Образование', 'Работа'],
  },
};

const QUICK_LINK_PATHS = ['/citizens/services', '/citizens/health', '/education', '/emplois'] as const;

const settleServiceIntros: Record<PublicLanguage, string[]> = {
  fr: [
    'Vous trouverez : les démarches de visa et de titre de séjour, les autorités compétentes et les documents à préparer.',
    'Vous trouverez : des pistes pour rechercher un logement, une agence immobilière ou un déménageur référencé.',
    'Vous trouverez : des médecins généralistes, spécialistes, dentistes, hôpitaux, cliniques et pharmacies sur la page Santé.',
    'Vous trouverez : les établissements scolaires et les informations utiles pour inscrire un enfant ou poursuivre ses études.',
    'Vous trouverez : des repères pour les comptes bancaires, les transferts, le change et les démarches fiscales.',
    'Vous trouverez : les démarches liées aux véhicules, aux bagages et aux effets personnels, avec accès aux informations douanières.',
    'Vous trouverez : des ressources pour chercher un emploi, créer une entreprise et identifier les organismes utiles.',
    'Vous trouverez : commerces, téléphonie, accès Internet et services utiles à proximité de votre lieu de vie.'
  ],
  ar: [
    'ستجد معلومات عن التأشيرات والإقامة والجهات المختصة والوثائق اللازمة.',
    'ستجد وسائل البحث عن سكن ووكالات عقارية وشركات نقل مدرجة.',
    'ستجد أطباء عامين وأخصائيين وأطباء أسنان ومستشفيات ومصحات وصيدليات في صفحة الصحة.',
    'ستجد المؤسسات التعليمية ومعلومات التسجيل ومتابعة الدراسة.',
    'ستجد معلومات عن الحسابات البنكية والتحويلات والصرف والإجراءات الجبائية.',
    'ستجد إجراءات السيارات والأمتعة والممتلكات الشخصية وروابط المعلومات الديوانية.',
    'ستجد موارد للبحث عن عمل وبعث مشروع والتواصل مع الهياكل المعنية.',
    'ستجد المتاجر والاتصالات والإنترنت والخدمات اليومية القريبة منك.'
  ],
  en: [
    'Find visa and residence procedures, responsible authorities and documents to prepare.',
    'Find ways to search for housing, estate agents and listed moving providers.',
    'Find general practitioners, specialists, dentists, hospitals, clinics and pharmacies on the Health page.',
    'Find schools, education providers and practical information about enrolment.',
    'Find guidance on bank accounts, transfers, currency exchange and tax procedures.',
    'Find vehicle, luggage and personal belongings procedures and links to customs information.',
    'Find resources for jobs, starting a business and the relevant support organisations.',
    'Find shops, mobile and internet providers and everyday services near your home.'
  ],
  it: [
    'Troverai procedure per visti e soggiorno, autorità competenti e documenti da preparare.',
    'Troverai come cercare casa, agenzie immobiliari e imprese di trasloco presenti nell’elenco.',
    'Troverai medici di base, specialisti, dentisti, ospedali, cliniche e farmacie nella pagina Salute.',
    'Troverai scuole, istituti e informazioni pratiche per le iscrizioni.',
    'Troverai indicazioni su conti bancari, trasferimenti, cambio e adempimenti fiscali.',
    'Troverai formalità per veicoli, bagagli e beni personali, con collegamenti alle informazioni doganali.',
    'Troverai risorse per il lavoro, l’avvio di un’impresa e gli enti di supporto.',
    'Troverai negozi, telefonia, Internet e servizi quotidiani nelle vicinanze.'
  ],
  ru: [
    'Здесь собраны сведения о визах, видах на жительство, компетентных органах и необходимых документах.',
    'Здесь можно найти варианты поиска жилья, агентств недвижимости и перевозчиков из каталога.',
    'В разделе «Здоровье» можно искать терапевтов, специалистов, стоматологов, больницы, клиники и аптеки.',
    'Здесь можно найти школы, образовательные учреждения и сведения о поступлении.',
    'Здесь собраны сведения о банковских счетах, переводах, обмене валют и налоговых процедурах.',
    'Здесь можно узнать о правилах ввоза автомобилей, багажа и личных вещей и перейти к таможенной информации.',
    'Здесь собраны ресурсы для поиска работы, открытия бизнеса и обращения в профильные организации.',
    'Здесь можно найти магазины, мобильную связь, Интернет и повседневные услуги рядом.'
  ]
};

const settleActionLabels: Record<PublicLanguage, string[]> = {
  fr: ['Consulter les formalités de séjour (site officiel)', 'Ouvrir l’annuaire pour rechercher un professionnel du logement', 'Rechercher un médecin, un hôpital ou une clinique sur la page Santé', 'Accéder à la page Éducation', 'Consulter les services fiscaux officiels', 'Consulter les formalités douanières officielles', 'Consulter les ressources officielles pour entreprendre', 'Consulter la page Commerces et magasins'],
  ar: ['الاطلاع على إجراءات الإقامة الرسمية', 'فتح الدليل للبحث عن خدمات السكن', 'البحث عن طبيب أو مستشفى أو مصحة في صفحة الصحة', 'الانتقال إلى صفحة التعليم', 'الاطلاع على الخدمات الجبائية الرسمية', 'الاطلاع على الإجراءات الديوانية الرسمية', 'الاطلاع على موارد الاستثمار الرسمية', 'الانتقال إلى صفحة المتاجر والمحلات'],
  en: ['View official residence procedures', 'Open the directory to search for housing and moving providers', 'Search for a doctor, hospital or clinic on the Health page', 'Go to the Education page', 'View official tax services', 'View official customs procedures', 'View official business and investment resources', 'Browse the Shops page'],
  it: ['Consultare le procedure ufficiali di soggiorno', 'Aprire l’elenco per cercare casa e trasloco', 'Cerca un medico, ospedale o clinica nella pagina Salute', 'Aprire la pagina Istruzione', 'Consultare i servizi fiscali ufficiali', 'Consultare le procedure doganali ufficiali', 'Consultare le risorse ufficiali per le imprese', 'Aprire la pagina Negozi'],
  ru: ['Открыть официальные правила пребывания', 'Открыть каталог для поиска услуг жилья и переезда', 'Найти врача, больницу или клинику на странице «Здоровье»', 'Перейти на страницу «Образование»', 'Открыть официальные налоговые сервисы', 'Открыть официальные таможенные правила', 'Открыть официальные ресурсы для бизнеса', 'Открыть страницу магазинов'],
};

const bankingGuide: Record<PublicLanguage, { title: string; steps: string[]; caution: string; banks: string; exchange: string }> = {
  fr: { title: 'Par où commencer ?', steps: ['Identifiez votre situation : résident, non-résident ou Tunisien résidant à l’étranger.', 'Demandez à la banque quels comptes sont accessibles à votre statut et quelles pièces elle exige.', 'Avant un virement international ou un achat immobilier, vérifiez les justificatifs d’origine des fonds et les règles de change.', 'Pour les impôts, utilisez les services officiels et demandez un avis adapté à votre situation.'], caution: 'Règles, documents et frais peuvent évoluer : confirmez toujours les exigences auprès de la banque et des autorités compétentes avant toute opération.', banks: 'Trouver une banque', exchange: 'Rechercher un bureau de change' },
  ar: { title: 'من أين تبدأ؟', steps: ['حدّد وضعيتك: مقيم أو غير مقيم أو تونسي مقيم بالخارج.', 'اسأل البنك عن أنواع الحسابات المتاحة والوثائق المطلوبة حسب وضعيتك.', 'قبل تحويل الأموال أو شراء عقار، تحقّق من إثبات مصدر الأموال وقواعد الصرف.', 'للإجراءات الجبائية، راجع الخدمات الرسمية واطلب مشورة مناسبة لوضعيتك.'], caution: 'قد تتغير القواعد والوثائق والمعاليم. تأكّد من البنك والجهات الرسمية قبل أي إجراء.', banks: 'البحث عن بنك', exchange: 'البحث عن مكتب صرف' },
  en: { title: 'Where should you start?', steps: ['Identify your status: resident, non-resident or Tunisian living abroad.', 'Ask the bank which accounts suit your status and which documents it requires.', 'Before transferring funds or buying property, check proof-of-funds requirements and exchange-control rules.', 'For tax matters, consult official services and seek advice specific to your situation.'], caution: 'Rules, documents and fees may change. Confirm current requirements with the bank and relevant authorities before acting.', banks: 'Find a bank', exchange: 'Find a currency exchange office' },
  it: { title: 'Da dove iniziare?', steps: ['Definisci il tuo status: residente, non residente o tunisino residente all’estero.', 'Chiedi alla banca quali conti sono disponibili e quali documenti richiede.', 'Prima di trasferimenti o acquisti immobiliari, verifica le prove dell’origine dei fondi e le regole valutarie.', 'Per il fisco, consulta i servizi ufficiali e chiedi indicazioni adeguate alla tua situazione.'], caution: 'Norme, documenti e costi possono cambiare. Verifica sempre con banca e autorità competenti.', banks: 'Cerca una banca', exchange: 'Cerca un ufficio di cambio' },
  ru: { title: 'С чего начать?', steps: ['Уточните свой статус: резидент, нерезидент или тунисец, проживающий за границей.', 'Узнайте в банке, какие счета доступны и какие документы необходимы.', 'Перед переводом средств или покупкой недвижимости проверьте требования к подтверждению происхождения средств и валютные правила.', 'По налоговым вопросам используйте официальные сервисы и получите консультацию с учётом своей ситуации.'], caution: 'Правила, документы и сборы могут меняться. Уточняйте требования в банке и государственных органах.', banks: 'Найти банк', exchange: 'Найти обменный пункт' }
};

const customsGuide: Record<PublicLanguage, { title: string; paths: { title: string; text: string; href: string; link: string }[]; caution: string }> = {
  fr: { title: 'Que souhaitez-vous apporter en Tunisie ?', paths: [
    { title: 'Ma voiture personnelle', text: 'Séjour temporaire, installation ou retour définitif : le régime et les conditions changent selon votre statut. Préparez carte grise, justificatif de propriété et pièces d’identité. L’âge autorisé dépend du dispositif.', href: 'https://www.douane.gov.tn/admission-temporaire/', link: 'Véhicule : règles officielles' },
    { title: 'Mes meubles et effets personnels', text: 'Dressez un inventaire avec quantités et valeurs. Les effets personnels, un déménagement et des biens à caractère commercial n’obéissent pas aux mêmes règles.', href: 'https://www.douane.gov.tn/declaration-des-effets-personnels/', link: 'Préparer la déclaration des effets' },
    { title: 'Mon matériel professionnel', text: 'Décrivez l’usage, la quantité, l’origine et la valeur de chaque équipement ; demandez à la Douane si une autorisation, une taxation ou un régime spécifique s’applique.', href: 'https://www.douane.gov.tn/particuliers-2/', link: 'Contacter les services douaniers' }
  ], caution: 'Ne commandez pas de transport ou de véhicule sur la seule base de cette rubrique. Âges limites, franchises, délais et justificatifs varient et peuvent évoluer : demandez confirmation écrite aux services compétents.' },
  ar: { title: 'ماذا تريد أن تجلب معك إلى تونس؟', paths: [
    { title: 'سيارتي الشخصية', text: 'تختلف الشروط حسب الإقامة المؤقتة أو الانتقال أو العودة النهائية. حضّر البطاقة الرمادية ووثيقة الملكية والهوية، وتحقق من عمر السيارة المسموح.', href: 'https://www.douane.gov.tn/admission-temporaire/', link: 'القواعد الرسمية للسيارات' },
    { title: 'الأثاث والأغراض الشخصية', text: 'حضّر قائمة مفصلة بالأغراض والكميات والقيم. تختلف الإجراءات بين الأمتعة الشخصية وأثاث الانتقال والبضائع التجارية.', href: 'https://www.douane.gov.tn/declaration-des-effets-personnels/', link: 'التصريح المسبق بالأغراض' },
    { title: 'المعدات المهنية', text: 'حدد نوع المعدات واستعمالها وقيمتها واسأل الديوانة عن التراخيص والمعاليم والنظام المناسب.', href: 'https://www.douane.gov.tn/particuliers-2/', link: 'الخدمات الديوانية الرسمية' }
  ], caution: 'تختلف الشروط والإعفاءات والآجال حسب وضعيتك وقد تتغير. تأكد من الديوانة قبل الشراء أو الشحن.' },
  en: { title: 'What are you bringing into Tunisia?', paths: [
    { title: 'My own car', text: 'Temporary stay, relocation and permanent return can follow different rules. Prepare the registration certificate, proof of ownership and ID; check age limits for your specific status.', href: 'https://www.douane.gov.tn/admission-temporaire/', link: 'Official vehicle rules' },
    { title: 'Furniture and personal belongings', text: 'Prepare an itemized inventory with quantities and values. Personal luggage, household removals and commercial goods have different rules.', href: 'https://www.douane.gov.tn/declaration-des-effets-personnels/', link: 'Prepare a belongings declaration' },
    { title: 'Professional equipment', text: 'List what each item is used for, its value and origin; ask customs about permits, taxes and the appropriate import regime.', href: 'https://www.douane.gov.tn/particuliers-2/', link: 'Official customs services' }
  ], caution: 'Rules, vehicle age limits, exemptions and deadlines vary and may change. Confirm with customs before buying or shipping.' },
  it: { title: 'Che cosa vuoi portare in Tunisia?', paths: [
    { title: 'La mia automobile', text: 'Soggiorno temporaneo, trasferimento e ritorno definitivo hanno regole diverse. Prepara libretto, prova di proprietà e documenti; verifica i limiti di età.', href: 'https://www.douane.gov.tn/admission-temporaire/', link: 'Regole ufficiali per i veicoli' },
    { title: 'Mobili ed effetti personali', text: 'Prepara un inventario con quantità e valori. Bagagli personali, trasloco e merci commerciali seguono procedure diverse.', href: 'https://www.douane.gov.tn/declaration-des-effets-personnels/', link: 'Preparare la dichiarazione' },
    { title: 'Attrezzature professionali', text: 'Indica uso, origine e valore degli strumenti e verifica permessi e imposte con la dogana.', href: 'https://www.douane.gov.tn/particuliers-2/', link: 'Servizi doganali ufficiali' }
  ], caution: 'Norme, età dei veicoli, franchigie e scadenze possono cambiare. Chiedi conferma alla dogana prima di acquistare o spedire.' },
  ru: { title: 'Что вы планируете ввезти в Тунис?', paths: [
    { title: 'Личный автомобиль', text: 'Временный приезд, переезд и окончательное возвращение регулируются по-разному. Подготовьте документы на автомобиль, подтверждение собственности и удостоверение личности.', href: 'https://www.douane.gov.tn/admission-temporaire/', link: 'Официальные правила для автомобилей' },
    { title: 'Мебель и личные вещи', text: 'Составьте опись с количеством и стоимостью. Багаж, имущество при переезде и коммерческие товары регулируются по-разному.', href: 'https://www.douane.gov.tn/declaration-des-effets-personnels/', link: 'Декларация личных вещей' },
    { title: 'Профессиональное оборудование', text: 'Уточните назначение, происхождение и стоимость оборудования, а также разрешения и пошлины в таможне.', href: 'https://www.douane.gov.tn/particuliers-2/', link: 'Официальные таможенные сервисы' }
  ], caution: 'Правила, возрастные ограничения, льготы и сроки могут меняться. Уточняйте их в таможне до покупки или отправки.' }
};

const schoolWorkGuides: Record<PublicLanguage, { schoolTitle: string; schoolSteps: string[]; schoolNote: string; workTitle: string; workSteps: string[]; workNote: string; registerLink: string; apiLink: string }> = {
  fr: { schoolTitle: 'Préparer une inscription scolaire', schoolSteps: ['Choisissez le système : public tunisien, privé, international ou français, puis identifiez les écoles de la région.', 'Demandez directement les conditions d’admission, la disponibilité des places et le calendrier.', 'Préparez les bulletins scolaires, pièces d’identité et autres justificatifs demandés, avec traductions ou équivalences si nécessaires.'], schoolNote: 'Les documents et priorités d’admission varient selon l’établissement et le niveau : obtenez sa liste actualisée avant tout déménagement.', workTitle: 'Travailler ou créer son activité', workSteps: ['Distinguez emploi salarié, activité indépendante et création de société ; les règles dépendent notamment de votre nationalité et de votre statut.', 'Pour créer une activité, vérifiez les autorisations éventuelles, la déclaration d’existence fiscale et l’immatriculation au RNE.', 'Préparez le type d’activité, une adresse/domiciliation et les justificatifs demandés ; confirmez le régime social et fiscal avant de démarrer.'], workNote: 'Conditions d’emploi des étrangers, autorisations, formalités et tarifs peuvent changer : vérifiez auprès des autorités compétentes.', registerLink: 'Formalités du registre des entreprises', apiLink: 'Guichet unique pour créer une entreprise' },
  ar: { schoolTitle: 'الاستعداد للتسجيل المدرسي', schoolSteps: ['اختر نوع التعليم: العمومي أو الخاص أو الدولي أو الفرنسي، وابحث عن المدارس القريبة.', 'اسأل المؤسسة عن شروط القبول والأماكن المتوفرة ومواعيد التسجيل.', 'حضّر الكشوف المدرسية ووثائق الهوية وما تطلبه المؤسسة من ترجمات أو معادلات.'], schoolNote: 'تختلف الوثائق ومواعيد التسجيل حسب المؤسسة والمستوى. تأكد من القائمة الحديثة قبل الانتقال.', workTitle: 'العمل أو إنشاء مشروع', workSteps: ['حدّد هل تريد العمل بأجر أو نشاطاً فردياً أو تأسيس شركة، وتحقق من شروط إقامتك وجنسيتك.', 'عند إنشاء مشروع تحقق من التراخيص والتصريح بالوجود الجبائي والتسجيل بالسجل الوطني للمؤسسات.', 'حضّر وصف النشاط والعنوان والوثائق المطلوبة، واسأل عن الالتزامات الجبائية والاجتماعية.'], workNote: 'قد تتغير شروط عمل الأجانب والتراخيص والإجراءات والمعاليم. تأكد لدى الإدارات المعنية.', registerLink: 'إجراءات السجل الوطني للمؤسسات', apiLink: 'الشباك الموحد لإنشاء مؤسسة' },
  en: { schoolTitle: 'Prepare a school enrolment', schoolSteps: ['Choose a public, private, international or French curriculum and identify schools in your area.', 'Ask the school about eligibility, available places, enrolment dates and fees.', 'Prepare school reports, identity documents and any translations or equivalency documents the school requests.'], schoolNote: 'Requirements vary by school and grade. Get an up-to-date checklist directly from the school before moving.', workTitle: 'Work or set up a business', workSteps: ['Distinguish employment, self-employment and company formation; your nationality and residence status matter.', 'Check business permits, tax registration and registration with Tunisia’s National Business Register (RNE).', 'Prepare a business activity description, address and supporting documents; confirm tax and social-security rules first.'], workNote: 'Work permits, eligibility, procedures and fees may change. Confirm with the relevant authorities.', registerLink: 'Business-register procedures', apiLink: 'Business creation one-stop shop' },
  it: { schoolTitle: 'Preparare l’iscrizione scolastica', schoolSteps: ['Scegli tra scuola pubblica, privata, internazionale o francese e cerca gli istituti nella tua zona.', 'Chiedi requisiti, posti disponibili, scadenze e costi direttamente alla scuola.', 'Prepara pagelle, documenti di identità ed eventuali traduzioni o equipollenze richieste.'], schoolNote: 'I requisiti variano in base alla scuola e alla classe: richiedi l’elenco aggiornato prima del trasferimento.', workTitle: 'Lavorare o avviare un’attività', workSteps: ['Distingui lavoro dipendente, autonomo e costituzione di società: contano nazionalità e residenza.', 'Verifica autorizzazioni, dichiarazione fiscale di inizio attività e iscrizione al registro RNE.', 'Prepara descrizione dell’attività, indirizzo e documenti, verificando regime fiscale e previdenziale.'], workNote: 'Permessi, procedure e costi possono cambiare. Verifica con le autorità competenti.', registerLink: 'Procedure del registro imprese', apiLink: 'Sportello unico per le imprese' },
  ru: { schoolTitle: 'Подготовка к поступлению в школу', schoolSteps: ['Выберите государственную, частную, международную или французскую школу и найдите варианты рядом.', 'Уточните в школе условия приема, наличие мест, сроки и стоимость.', 'Подготовьте табели, удостоверения личности и необходимые переводы или подтверждение эквивалентности.'], schoolNote: 'Требования зависят от школы и класса. Перед переездом запросите актуальный перечень документов.', workTitle: 'Работа или открытие бизнеса', workSteps: ['Различайте работу по найму, самозанятость и создание компании: важны гражданство и статус пребывания.', 'Проверьте разрешения, постановку на налоговый учет и регистрацию в реестре предприятий RNE.', 'Подготовьте описание деятельности, адрес и необходимые документы; уточните налоговые и социальные обязательства.'], workNote: 'Разрешения на работу, процедуры и сборы могут изменяться. Уточняйте в компетентных органах.', registerLink: 'Регистрация предприятия в RNE', apiLink: 'Единое окно создания бизнеса' }
};

const residenceGuide: Record<PublicLanguage, { title: string; steps: string[]; caution: string }> = {
  fr: { title: 'Préparer votre séjour selon votre situation', steps: ['Avant de partir : vérifiez auprès du consulat tunisien les conditions d’entrée et de visa selon votre nationalité et la durée prévue.', 'Pour un séjour prolongé : renseignez-vous sur le titre de séjour et les pièces requises selon votre motif (retraite, emploi, études, regroupement familial ou activité).', 'Préparez un passeport valide, les justificatifs d’hébergement et de ressources ainsi que les documents propres à votre situation, uniquement selon la liste communiquée par les autorités.', 'Avant l’échéance : vérifiez les délais de dépôt, les renouvellements et les démarches auprès des autorités locales compétentes.'], caution: 'Aucune durée de séjour ni liste de pièces n’est universelle. Les règles dépendent notamment de la nationalité, du statut et du motif du séjour ; confirmez-les avant le départ.' },
  ar: { title: 'حضّر إقامتك حسب وضعيتك', steps: ['قبل السفر، تحقّق من شروط الدخول والتأشيرة حسب الجنسية والمدة لدى القنصلية التونسية.', 'للإقامة الطويلة، اطلب شروط بطاقة الإقامة حسب سبب الإقامة: تقاعد أو عمل أو دراسة أو عائلة أو نشاط.', 'حضّر جواز السفر وإثبات السكن والموارد والوثائق المطلوبة وفق القائمة الرسمية.', 'تحقّق من آجال إيداع الملف وتجديد الإقامة لدى السلطات المختصة.'], caution: 'لا توجد مدة أو قائمة وثائق موحّدة للجميع. تختلف الإجراءات حسب الجنسية والوضعية والغرض من الإقامة.' },
  en: { title: 'Plan your stay according to your status', steps: ['Before travelling, check entry and visa requirements with a Tunisian consulate for your nationality and intended stay.', 'For longer stays, ask which residence permit applies to your purpose: retirement, employment, studies, family or business.', 'Prepare your passport, proof of accommodation and means of support, plus only the documents confirmed by the responsible authority.', 'Check application deadlines, renewals and local procedures well before your permission expires.'], caution: 'There is no universal permitted stay or document list. Requirements vary by nationality, status and reason for staying; verify before travel.' },
  it: { title: 'Prepara il soggiorno in base alla tua situazione', steps: ['Prima di partire, verifica con il consolato tunisino ingresso e visto in base a nazionalità e durata.', 'Per soggiorni lunghi, chiedi quale permesso sia richiesto per pensione, lavoro, studio, famiglia o attività.', 'Prepara passaporto, alloggio, risorse economiche e i documenti indicati dall’autorità competente.', 'Controlla scadenze, rinnovi e procedure locali in anticipo.'], caution: 'Non esiste una durata né un elenco di documenti valido per tutti: verifica le regole secondo nazionalità e motivo del soggiorno.' },
  ru: { title: 'Подготовьте пребывание с учетом вашего статуса', steps: ['До поездки уточните в консульстве Туниса правила въезда и визы для вашего гражданства и срока пребывания.', 'Для длительного проживания выясните условия ВНЖ для пенсионеров, работников, студентов, семьи или предпринимателей.', 'Подготовьте паспорт, подтверждение жилья и средств, а также документы по официальному списку.', 'Заранее уточните сроки подачи и продления разрешения.'], caution: 'Единого срока пребывания и списка документов для всех нет: правила зависят от гражданства, статуса и цели поездки.' }
};

const everydayGuides: Record<PublicLanguage, { housing: string[]; health: string[]; daily: string[]; caution: string }> = {
 fr: { housing: ['Définissez votre budget, votre ville et le type de logement avant de contacter une agence.', 'Avant de verser une somme, faites confirmer l’identité du bailleur, les conditions du bail, les charges et l’état du logement.', 'Pour déménager : demandez un devis écrit, l’inventaire, les conditions d’assurance et les éventuelles formalités douanières.'], health: ['Repérez à proximité un médecin, une pharmacie et un établissement de soins avant votre installation.', 'Demandez à votre assureur ou organisme de couverture les conditions de prise en charge en Tunisie, les exclusions et les justificatifs.', 'Conservez ordonnances et dossier médical utiles ; vérifiez avec un professionnel de santé les traitements et vaccinations nécessaires.'], daily: ['Vérifiez la disponibilité de l’eau, de l’électricité et d’Internet à votre future adresse avant de signer.', 'Demandez quels documents sont nécessaires pour un abonnement téléphonique et pour les contrats de services.', 'Repérez les commerces, transports, pharmacies et services administratifs de votre quartier.'], caution: 'Ces repères sont indicatifs : contrats, documents et conditions peuvent varier selon l’établissement et évoluer.' },
 ar: { housing: ['حدد الميزانية والمدينة ونوع السكن قبل الاتصال بوكالة عقارية.', 'قبل دفع أي مبلغ، تحقق من هوية المالك وشروط العقد والمصاريف وحالة السكن.', 'قبل الانتقال اطلب عرض سعر مكتوباً وقائمة الأثاث وشروط التأمين والإجراءات الديوانية عند اللزوم.'], health: ['حدد طبيباً وصيدلية ومؤسسة صحية قرب مكان الإقامة.', 'اسأل شركة التأمين أو الجهة المعنية عن التغطية في تونس والاستثناءات والوثائق.', 'احتفظ بالوصفات والملف الطبي واستشر مختصاً بشأن العلاج والتلاقيح عند الحاجة.'], daily: ['تحقق من الماء والكهرباء والإنترنت في عنوان السكن قبل التوقيع.', 'اسأل عن الوثائق المطلوبة للهاتف وعقود الخدمات.', 'حدد المتاجر والنقل والصيدليات والإدارات القريبة.'], caution: 'هذه معلومات إرشادية وقد تختلف الشروط والوثائق وتتغير؛ تأكد لدى الجهات المعنية.' },
 en: { housing: ['Choose your budget, area and housing type before contacting an agent.', 'Before paying, verify the landlord, lease terms, charges and property condition.', 'For moving, request a written quote, inventory, insurance details and any applicable customs requirements.'], health: ['Identify a nearby doctor, pharmacy and healthcare facility before moving.', 'Ask your insurer or health scheme about coverage in Tunisia, exclusions and documents required.', 'Keep useful prescriptions and medical records and ask a clinician about treatments or vaccinations when relevant.'], daily: ['Check water, electricity and Internet availability at the address before signing.', 'Ask providers which documents are required for phone and utility contracts.', 'Locate shops, transport, pharmacies and administrative services in your neighbourhood.'], caution: 'Requirements vary by provider and may change. Confirm details directly before committing.' },
 it: { housing: ['Definisci budget, città e tipo di alloggio prima di contattare un’agenzia.', 'Prima di pagare, verifica proprietario, condizioni del contratto, spese e stato dell’immobile.', 'Per il trasloco richiedi preventivo scritto, inventario, assicurazione ed eventuali formalità doganali.'], health: ['Individua medico, farmacia e struttura sanitaria vicini prima del trasferimento.', 'Chiedi all’assicurazione copertura in Tunisia, esclusioni e documenti necessari.', 'Conserva ricette e cartelle cliniche e consulta un medico per cure e vaccinazioni pertinenti.'], daily: ['Verifica acqua, elettricità e Internet all’indirizzo prima di firmare.', 'Chiedi i documenti per telefono e contratti delle utenze.', 'Individua negozi, trasporti, farmacie e uffici pubblici nella zona.'], caution: 'Condizioni e documenti possono variare o cambiare: chiedi conferma agli enti competenti.' },
 ru: { housing: ['Определите бюджет, город и тип жилья до обращения в агентство.', 'До оплаты проверьте арендодателя, договор, дополнительные расходы и состояние жилья.', 'Для переезда запросите письменную смету, опись вещей, условия страхования и таможенные требования.'], health: ['Найдите поблизости врача, аптеку и медицинское учреждение до переезда.', 'Уточните у страховщика покрытие в Тунисе, исключения и необходимые документы.', 'Сохраните рецепты и медицинские документы, проконсультируйтесь о лечении и прививках при необходимости.'], daily: ['До подписания договора проверьте доступность воды, электричества и Интернета.', 'Уточните документы для связи и коммунальных договоров.', 'Найдите магазины, транспорт, аптеки и административные службы поблизости.'], caution: 'Требования зависят от поставщика и могут меняться. Уточняйте актуальные условия.' }
};

type JourneyMode = 'visit' | 'settle';

const journeyCopy: Record<PublicLanguage, {
  visitTab: string;
  settleTab: string;
  visitTitle: string;
  visitIntro: string;
  settleTitle: string;
  settleIntro: string;
  discover: string;
  official: string;
  bookletTitle: string;
  bookletText: string;
  visitTopics: Array<{ title: string; text: string; href: string }>;
  settleTopics: Array<{ title: string; text: string; href: string; external?: boolean }>;
}> = {
  fr: {
    visitTab: 'Visiter autrement', settleTab: "S’installer en Tunisie",
    visitTitle: 'La Tunisie hors des sentiers battus',
    visitIntro: 'Explorez les territoires, les savoir-faire et les expériences locales, au-delà des circuits les plus connus.',
    settleTitle: 'Préparer son installation en Tunisie',
    settleIntro: 'Des repères simples pour comprendre les démarches et trouver les bons services sur place.',
    discover: 'Découvrir', official: 'Source officielle',
    bookletTitle: 'Le livret pratique des expatriés',
    bookletText: 'Une version détaillée avec checklists, budgets et démarches pas à pas est en préparation.',
    visitTopics: [
      { title: 'Villages & patrimoine', text: 'Découvrir des lieux de caractère, des médinas, des villages et un patrimoine moins connu.', href: '/citizens/tourism/guide/villages-patrimoine' },
      { title: 'Nature & randonnées', text: 'Trouver des activités de plein air, des accompagnateurs et des excursions locales.', href: '/citizens/tourism/guide/nature-randonnees' },
      { title: 'Artisanat & savoir-faire', text: 'Rencontrer les artisans et découvrir les métiers, ateliers et créations des régions.', href: '/citizens/tourism/guide/artisanat-savoir-faire' },
      { title: 'Saveurs & marchés locaux', text: 'Explorer les produits, tables, marchés et spécialités qui font vivre les territoires.', href: '/citizens/tourism/guide/marches-gastronomie' },
      { title: 'Culture & événements', text: 'Repérer les fêtes, festivals, expositions et rendez-vous près de votre destination.', href: '/citizens/tourism/guide/fetes-evenements' },
      { title: 'Séjours & expériences locales', text: 'Trouver des hébergements, guides et activités pour construire un séjour plus personnel.', href: '/citizens/tourism/guide/hebergements-experiences' },
    ],
    settleTopics: [
      { title: 'Visa, séjour & résidence', text: 'Avant le départ : vérifier les exigences de visa selon votre nationalité auprès du consulat tunisien. Pour une installation durable : consulter les pièces de la carte de séjour (passeport, justificatif d’hébergement et documents liés au travail, aux études ou à la situation familiale). Les règles varient selon votre situation ; confirmer auprès des autorités.', href: 'https://services.interieur.gov.tn/wap/fr/docs/demarches/05.html', external: true },
      { title: 'Logement & déménagement', text: 'Avant de signer un bail : vérifier le quartier, le budget total, les charges, les conditions du contrat et les justificatifs demandés. Pour déménager, demander un devis détaillé et vérifier les formalités éventuelles de douane. Rechercher ensuite les professionnels locaux.', href: '/recherche?categorie=immobilier' },
      { title: 'Santé & assurance', text: 'Avant de partir, vérifier la couverture santé et l’assistance rapatriement selon votre situation, les exclusions, les plafonds et les modalités de remboursement. Préparer ordonnances et documents médicaux utiles ; rechercher ensuite médecins, cliniques et pharmacies sur la page Santé.', href: '/citizens/health' },
      { title: 'École & scolarité', text: 'Comparer les établissements et retrouver les informations scolaires essentielles.', href: '/education' },
      { title: 'Banque, change & fiscalité', text: 'Consulter les services financiers et vérifier les règles officielles applicables.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'Véhicule, biens & douane', text: 'Vérifier les formalités avant d’importer un véhicule ou vos effets personnels.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'Travail & création d’entreprise', text: 'Trouver des opportunités et les organismes utiles pour développer un projet.', href: 'https://investintunisia.tn/', external: true },
      { title: 'Vie quotidienne', text: 'Téléphone, Internet, commerces et services : retrouver les professionnels proches de vous.', href: '/citizens/shops' },
    ],
  },
  ar: {
    visitTab: 'اكتشف تونس بطريقة مختلفة', settleTab: 'الاستقرار في تونس',
    visitTitle: 'تونس خارج المسارات المعتادة', visitIntro: 'اكتشف الجهات والحرف والتجارب المحلية بعيداً عن المسارات الأكثر شهرة.',
    settleTitle: 'الاستعداد للاستقرار في تونس', settleIntro: 'معلومات مبسطة لفهم الإجراءات والعثور على الخدمات المناسبة.',
    discover: 'اكتشف', official: 'مصدر رسمي', bookletTitle: 'الدليل العملي للمقيمين الأجانب', bookletText: 'نسخة مفصلة تتضمن قوائم التحقق والميزانيات والإجراءات خطوة بخطوة قيد الإعداد.',
    visitTopics: [
      { title: 'القرى والتراث', text: 'اكتشف المدن العتيقة والقرى والمواقع ذات الطابع المحلي الأصيل.', href: '/citizens/tourism/guide/villages-patrimoine' },
      { title: 'الطبيعة والمشي', text: 'ابحث عن أنشطة في الطبيعة ورحلات ومرافقين محليين.', href: '/citizens/tourism/guide/nature-randonnees' },
      { title: 'الحرف والمعارف المحلية', text: 'تعرّف على الحرفيين والورشات وإبداعات مختلف الجهات.', href: '/citizens/tourism/guide/artisanat-savoir-faire' },
      { title: 'النكهات والأسواق المحلية', text: 'اكتشف المنتجات والمطاعم والأسواق والاختصاصات المحلية.', href: '/citizens/tourism/guide/marches-gastronomie' },
      { title: 'الثقافة والفعاليات', text: 'اعثر على المهرجانات والمعارض والمواعيد القريبة من وجهتك.', href: '/citizens/tourism/guide/fetes-evenements' },
      { title: 'إقامات وتجارب محلية', text: 'ابحث عن إقامة أو دليل أو نشاط لبناء رحلة أكثر خصوصية.', href: '/citizens/tourism/guide/hebergements-experiences' },
    ],
    settleTopics: [
      { title: 'التأشيرة والإقامة', text: 'تحقق من الشروط حسب جنسيتك ووضعيتك قبل السفر.', href: 'https://services.interieur.gov.tn/wap/fr/docs/demarches/05.html', external: true },
      { title: 'السكن والانتقال', text: 'قبل توقيع عقد الإيجار، تحقّق من الحيّ والتكلفة الإجمالية والمصاريف وشروط العقد والوثائق المطلوبة. اطلب عرض سعر مفصلاً للنقل وتحقّق من الإجراءات الجمركية عند الحاجة، ثم ابحث عن المهنيين المحليين.', href: '/recherche?categorie=immobilier' },
      { title: 'الصحة والتأمين', text: 'قبل السفر، تحقّق من التغطية الصحية والمساعدة على العودة إلى بلدك حسب وضعيتك، والاستثناءات وحدود التغطية وشروط استرجاع المصاريف. حضّر الوصفات والوثائق الطبية المهمة، ثم ابحث عن الأطباء والمصحات والصيدليات في صفحة الصحة.', href: '/citizens/health' },
      { title: 'المدرسة والتعليم', text: 'قارن المؤسسات واعثر على المعلومات المدرسية الأساسية.', href: '/education' },
      { title: 'البنك والصرف والجباية', text: 'اطلع على الخدمات المالية والقواعد الرسمية المعمول بها.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'السيارة والأمتعة والديوانة', text: 'تحقق من الإجراءات قبل توريد سيارة أو أمتعتك الشخصية.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'العمل وبعث مشروع', text: 'اعثر على الفرص والهياكل المفيدة لتطوير مشروعك.', href: 'https://investintunisia.tn/', external: true },
      { title: 'الحياة اليومية', text: 'الهاتف والإنترنت والمتاجر والخدمات القريبة منك.', href: '/citizens/shops' },
    ],
  },
  en: {
    visitTab: 'Visit differently', settleTab: 'Settle in Tunisia', visitTitle: 'Tunisia off the beaten track', visitIntro: 'Explore local places, skills and experiences beyond the best-known routes.',
    settleTitle: 'Prepare your move to Tunisia', settleIntro: 'Simple guidance to understand procedures and find the right local services.', discover: 'Discover', official: 'Official source',
    bookletTitle: 'The practical expatriate handbook', bookletText: 'A detailed version with checklists, budgets and step-by-step procedures is being prepared.',
    visitTopics: [
      { title: 'Villages & heritage', text: 'Discover characterful places, medinas, villages and lesser-known heritage.', href: '/citizens/tourism/guide/villages-patrimoine' },
      { title: 'Nature & hiking', text: 'Find outdoor activities, local guides and excursions.', href: '/citizens/tourism/guide/nature-randonnees' },
      { title: 'Crafts & local skills', text: 'Meet craftspeople and discover regional workshops and creations.', href: '/citizens/tourism/guide/artisanat-savoir-faire' },
      { title: 'Flavours & local markets', text: 'Explore local products, food, markets and regional specialities.', href: '/citizens/tourism/guide/marches-gastronomie' },
      { title: 'Culture & events', text: 'Find festivals, exhibitions and events near your destination.', href: '/citizens/tourism/guide/fetes-evenements' },
      { title: 'Local stays & experiences', text: 'Find accommodation, guides and activities for a more personal trip.', href: '/citizens/tourism/guide/hebergements-experiences' },
    ],
    settleTopics: [
      { title: 'Visa, stay & residence', text: 'Check the conditions for your nationality and situation before departure.', href: 'https://services.interieur.gov.tn/wap/fr/docs/demarches/05.html', external: true },
      { title: 'Housing & moving', text: 'Before signing a lease, check the area, total budget, fees, contract terms and required documents. Request a detailed moving quote and verify any customs requirements before searching for local providers.', href: '/recherche?categorie=immobilier' },
      { title: 'Health & insurance', text: 'Before moving, check your health coverage and medical repatriation assistance, including exclusions, limits and reimbursement rules. Keep prescriptions and key medical records handy, then find doctors, clinics and pharmacies on the Health page.', href: '/citizens/health' },
      { title: 'School & education', text: 'Compare institutions and find essential school information.', href: '/education' },
      { title: 'Banking, exchange & tax', text: 'Find financial services and check the applicable official rules.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'Vehicle, belongings & customs', text: 'Check formalities before importing a vehicle or personal belongings.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'Work & starting a business', text: 'Find opportunities and useful organisations for developing a project.', href: 'https://investintunisia.tn/', external: true },
      { title: 'Daily life', text: 'Phone, Internet, shops and nearby services for everyday needs.', href: '/citizens/shops' },
    ],
  },
  it: {
    visitTab: 'Visitare diversamente', settleTab: 'Trasferirsi in Tunisia', visitTitle: 'La Tunisia fuori dai sentieri battuti', visitIntro: 'Esplora luoghi, saperi ed esperienze locali oltre gli itinerari più noti.',
    settleTitle: 'Preparare il trasferimento in Tunisia', settleIntro: 'Indicazioni semplici per capire le procedure e trovare i servizi giusti.', discover: 'Scopri', official: 'Fonte ufficiale',
    bookletTitle: 'La guida pratica per espatriati', bookletText: 'È in preparazione una versione dettagliata con checklist, budget e procedure passo dopo passo.',
    visitTopics: [
      { title: 'Borghi e patrimonio', text: 'Scopri medine, borghi e un patrimonio locale meno conosciuto.', href: '/citizens/tourism/guide/villages-patrimoine' },
      { title: 'Natura ed escursioni', text: 'Trova attività all’aria aperta, guide ed escursioni locali.', href: '/citizens/tourism/guide/nature-randonnees' },
      { title: 'Artigianato e saperi', text: 'Incontra artigiani e scopri laboratori e creazioni regionali.', href: '/citizens/tourism/guide/artisanat-savoir-faire' },
      { title: 'Sapori e mercati locali', text: 'Esplora prodotti, tavole, mercati e specialità regionali.', href: '/citizens/tourism/guide/marches-gastronomie' },
      { title: 'Cultura ed eventi', text: 'Trova festival, mostre ed eventi vicino alla destinazione.', href: '/citizens/tourism/guide/fetes-evenements' },
      { title: 'Soggiorni ed esperienze locali', text: 'Trova alloggi, guide e attività per un viaggio più personale.', href: '/citizens/tourism/guide/hebergements-experiences' },
    ],
    settleTopics: [
      { title: 'Visto, soggiorno e residenza', text: 'Verifica le condizioni per nazionalità e situazione prima della partenza.', href: 'https://services.interieur.gov.tn/wap/fr/docs/demarches/05.html', external: true },
      { title: 'Casa e trasloco', text: 'Prima di firmare un contratto, verifica zona, budget totale, spese, condizioni e documenti richiesti. Chiedi un preventivo dettagliato per il trasloco e verifica le eventuali formalità doganali.', href: '/recherche?categorie=immobilier' },
      { title: 'Salute e assicurazione', text: 'Prima di partire, verifica copertura sanitaria e assistenza al rimpatrio, comprese esclusioni, massimali e rimborsi. Prepara ricette e documenti medici utili, poi cerca medici, cliniche e farmacie nella pagina Salute.', href: '/citizens/health' },
      { title: 'Scuola e istruzione', text: 'Confronta gli istituti e trova informazioni scolastiche essenziali.', href: '/education' },
      { title: 'Banca, cambio e fiscalità', text: 'Trova servizi finanziari e verifica le regole ufficiali.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'Veicolo, beni e dogana', text: 'Verifica le formalità prima di importare un veicolo o beni personali.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'Lavoro e impresa', text: 'Trova opportunità e organismi utili per sviluppare un progetto.', href: 'https://investintunisia.tn/', external: true },
      { title: 'Vita quotidiana', text: 'Telefono, Internet, negozi e servizi utili vicino a te.', href: '/citizens/shops' },
    ],
  },
  ru: {
    visitTab: 'Открыть другую Тунис', settleTab: 'Переехать в Тунис', visitTitle: 'Тунис вдали от привычных маршрутов', visitIntro: 'Исследуйте местные места, ремёсла и впечатления за пределами известных маршрутов.',
    settleTitle: 'Подготовить переезд в Тунис', settleIntro: 'Простые ориентиры по процедурам и полезным местным услугам.', discover: 'Подробнее', official: 'Официальный источник',
    bookletTitle: 'Практический справочник экспата', bookletText: 'Готовится подробная версия с чек-листами, бюджетами и пошаговыми процедурами.',
    visitTopics: [
      { title: 'Деревни и наследие', text: 'Откройте медины, деревни и менее известное местное наследие.', href: '/citizens/tourism/guide/villages-patrimoine' },
      { title: 'Природа и походы', text: 'Найдите активный отдых, местных гидов и экскурсии.', href: '/citizens/tourism/guide/nature-randonnees' },
      { title: 'Ремёсла и мастерство', text: 'Познакомьтесь с мастерами и региональными мастерскими.', href: '/citizens/tourism/guide/artisanat-savoir-faire' },
      { title: 'Вкусы и рынки', text: 'Исследуйте продукты, рынки и региональную кухню.', href: '/citizens/tourism/guide/marches-gastronomie' },
      { title: 'Культура и события', text: 'Найдите фестивали, выставки и события рядом.', href: '/citizens/tourism/guide/fetes-evenements' },
      { title: 'Местный отдых и впечатления', text: 'Найдите жильё, гидов и занятия для индивидуальной поездки.', href: '/citizens/tourism/guide/hebergements-experiences' },
    ],
    settleTopics: [
      { title: 'Виза, пребывание и ВНЖ', text: 'Проверьте условия для вашего гражданства и ситуации до поездки.', href: 'https://services.interieur.gov.tn/wap/fr/docs/demarches/05.html', external: true },
      { title: 'Жильё и переезд', text: 'Перед подписанием договора проверьте район, полную стоимость, дополнительные расходы, условия аренды и документы. Запросите подробную смету переезда и проверьте таможенные требования.', href: '/recherche?categorie=immobilier' },
      { title: 'Здоровье и страхование', text: 'До переезда проверьте медицинскую страховку и помощь с медицинской репатриацией, исключения, лимиты и порядок возмещения. Подготовьте рецепты и важные медицинские документы, затем найдите врачей, клиники и аптеки в разделе «Здоровье».', href: '/citizens/health' },
      { title: 'Школа и образование', text: 'Сравните учреждения и найдите важную информацию об обучении.', href: '/education' },
      { title: 'Банк, обмен и налоги', text: 'Найдите финансовые услуги и проверьте официальные правила.', href: 'https://www.finances.gov.tn/fr/e-services', external: true },
      { title: 'Автомобиль, вещи и таможня', text: 'Проверьте формальности перед ввозом автомобиля или личных вещей.', href: 'https://www.douane.gov.tn/particuliers-2/', external: true },
      { title: 'Работа и бизнес', text: 'Найдите возможности и организации для развития проекта.', href: 'https://investintunisia.tn/', external: true },
      { title: 'Повседневная жизнь', text: 'Телефон, Интернет, магазины и полезные услуги рядом.', href: '/citizens/shops' },
    ],
  },
};

const visitExamples: Record<PublicLanguage, string[][]> = {
  fr: [
    ['Takrouna et Kesra', 'Chenini et Douiret', 'Matmata et ses habitats troglodytes', 'Ksour du Dahar'],
    ['Forêts de Kroumirie et Aïn Draham', 'Parc national de l’Ichkeul', 'Djebel Zaghouan', 'Canyons de Midès, Tamerza et Chebika', 'Dunes de Douz et Ksar Ghilane'],
    ['Poterie des femmes de Sejnane', 'Céramique de Nabeul', 'Tapis de Kairouan', 'Tissages du Dahar et de Djerba', 'Bijoux et objets des médinas'],
    ['Marché de Nabeul', 'Souks de Kairouan', 'Houmt Souk à Djerba', 'Marché central de Sfax', 'Cuisine des médinas et produits des oasis'],
    ['Festival du Sahara à Douz', 'Festival symphonique d’El Jem', 'Festival du Malouf à Testour', 'Jazz à Tabarka', 'Mouled à Kairouan'],
    ['Maisons d’hôtes dans les médinas', 'Écolodges du Nord-Ouest', 'Campements dans le désert', 'Hébergements troglodytes à Matmata', 'Séjours ruraux au Cap Bon et à Zaghouan'],
  ],
  ar: [
    ['تكرونة وكسرى', 'شنني ودويرات', 'مطماطة ومساكنها المحفورة', 'قصور جبال الظاهر'],
    ['غابات خمير وعين دراهم', 'الحديقة الوطنية بإشكل', 'جبل زغوان', 'أخاديد ميداس وتمغزة والشبيكة', 'كثبان دوز وقصر غيلان'],
    ['فخار نساء سجنان', 'خزف نابل', 'زرابي القيروان', 'منسوجات الظاهر وجربة', 'حلي ومنتجات المدن العتيقة'],
    ['سوق نابل', 'أسواق القيروان', 'حومة السوق بجربة', 'السوق المركزية بصفاقس', 'مأكولات المدن العتيقة ومنتجات الواحات'],
    ['مهرجان الصحراء بدوز', 'مهرجان الجم للموسيقى السمفونية', 'مهرجان المالوف بتستور', 'جاز طبرقة', 'المولد بالقيروان'],
    ['دور ضيافة في المدن العتيقة', 'نزل بيئية في الشمال الغربي', 'مخيمات صحراوية', 'إقامات محفورة بمطماطة', 'إقامات ريفية بالوطن القبلي وزغوان'],
  ],
  en: [
    ['Takrouna and Kesra', 'Chenini and Douiret', 'Matmata and its troglodyte homes', 'Ksour of the Dahar'],
    ['Kroumirie forests and Aïn Draham', 'Ichkeul National Park', 'Jebel Zaghouan', 'Midès, Tamerza and Chebika canyons', 'Douz dunes and Ksar Ghilane'],
    ['Sejnane women’s pottery', 'Nabeul ceramics', 'Kairouan carpets', 'Dahar and Djerba weaving', 'Medina jewellery and crafts'],
    ['Nabeul market', 'Kairouan souks', 'Houmt Souk in Djerba', 'Sfax central market', 'Medina food and oasis produce'],
    ['Douz Sahara Festival', 'El Jem Symphonic Festival', 'Testour Malouf Festival', 'Tabarka Jazz', 'Mouled in Kairouan'],
    ['Medina guest houses', 'North-West eco-lodges', 'Desert camps', 'Troglodyte stays in Matmata', 'Rural stays in Cap Bon and Zaghouan'],
  ],
  it: [
    ['Takrouna e Kesra', 'Chenini e Douiret', 'Matmata e le case troglodite', 'Ksour del Dahar'],
    ['Foreste della Kroumirie e Aïn Draham', 'Parco nazionale di Ichkeul', 'Jebel Zaghouan', 'Canyon di Midès, Tamerza e Chebika', 'Dune di Douz e Ksar Ghilane'],
    ['Ceramica delle donne di Sejnane', 'Ceramica di Nabeul', 'Tappeti di Kairouan', 'Tessuti del Dahar e di Djerba', 'Gioielli e artigianato delle medine'],
    ['Mercato di Nabeul', 'Souk di Kairouan', 'Houmt Souk a Djerba', 'Mercato centrale di Sfax', 'Cucina delle medine e prodotti delle oasi'],
    ['Festival del Sahara di Douz', 'Festival sinfonico di El Jem', 'Festival del Malouf di Testour', 'Jazz a Tabarka', 'Mouled a Kairouan'],
    ['Guest house nelle medine', 'Ecolodge del Nord-Ovest', 'Campi nel deserto', 'Alloggi trogloditi a Matmata', 'Soggiorni rurali nel Cap Bon e a Zaghouan'],
  ],
  ru: [
    ['Такруна и Кесра', 'Шенини и Дуирет', 'Матмата и троглодитские жилища', 'Ксуры Дахара'],
    ['Леса Крумирии и Айн-Драхам', 'Национальный парк Ишкёль', 'Джебель-Загуан', 'Каньоны Мидес, Тамерза и Шебика', 'Дюны Дуза и Ксар-Гилан'],
    ['Керамика женщин Седжнана', 'Керамика Набеля', 'Ковры Кайруана', 'Ткачество Дахара и Джербы', 'Украшения и ремёсла медин'],
    ['Рынок Набеля', 'Суки Кайруана', 'Хумт-Сук на Джербе', 'Центральный рынок Сфакса', 'Кухня медин и продукты оазисов'],
    ['Фестиваль Сахары в Дузе', 'Симфонический фестиваль Эль-Джема', 'Фестиваль малуфа в Тестуре', 'Джаз в Табарке', 'Маулид в Кайруане'],
    ['Гостевые дома в мединах', 'Эколоджи Северо-Запада', 'Лагеря в пустыне', 'Троглодитские отели Матматы', 'Сельский отдых на Кап-Бон и в Загуане'],
  ],
};

export default function CitizensTourism() {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const t = copy[lang];
  const journey = journeyCopy[lang];
  const isRTL = lang === 'ar';
  const [journeyMode, setJourneyMode] = useState<JourneyMode>('visit');
  const topics = journeyMode === 'visit' ? journey.visitTopics : journey.settleTopics;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead
        title={t.seoTitle}
        description={t.intro}
        canonical="https://dalil-tounes.com/citizens/tourism"
        currentPath="/citizens/tourism"
      />
      <section className="relative w-full h-[280px] overflow-hidden">
        <img
          src="https://commons.wikimedia.org/wiki/Special:FilePath/Sidi_bou_said_port.jpg?width=1600"
          alt={t.heroAlt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D43]/75 via-[#4A1D43]/60 to-[#4A1D43]/25" />
        <a className="absolute bottom-1 right-2 z-10 text-[10px] text-white/85 underline" href="https://commons.wikimedia.org/wiki/File:Sidi_bou_said_port.jpg" target="_blank" rel="noopener noreferrer" aria-label="Crédit photo Rania Haddad, licence CC BY-SA 4.0">Photo : Rania Haddad · CC BY-SA 4.0</a>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2 drop-shadow-lg text-[#D4AF37]">{t.title}</h1>
          <p className="text-sm md:text-base font-light text-white/95 max-w-3xl leading-relaxed drop-shadow-lg">{t.intro}</p>
        </div>
      </section>

      <section className="py-6 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg md:text-xl font-light mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-[#4A0404]">{t.slogan}</span>
          </p>
          <div className="flex justify-center"><div className="w-[40px] h-[1px] bg-[#D4AF37]" /></div>
        </div>
      </section>

      {journeyMode === 'settle' && <section className="py-2 px-4 relative z-[9999]" style={{ overflow: 'visible' }}>
        <div className="max-w-5xl mx-auto" style={{ overflow: 'visible' }}>
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#D4AF37] p-2.5 md:p-3" style={{ overflow: 'visible' }}>
            <SearchBar
              scope="tourism"
              intentEnabled={false}
              enabled
              resultMode="redirectToResults"
              preferredTitle={t.preferredTitle}
              preferredSubtitle={t.preferredSubtitle}
            />
          </div>
        </div>
      </section>}

      <section className="px-4 pt-6">
        <div className="max-w-5xl mx-auto rounded-2xl border border-[#D4AF37]/50 bg-white px-3 py-4 sm:px-5 shadow-sm">
          <div className="flex justify-center gap-2" role="tablist" aria-label={t.title}>
            <button type="button" role="tab" aria-selected={journeyMode === 'visit'} onClick={() => setJourneyMode('visit')} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs sm:text-sm font-semibold transition-colors ${journeyMode === 'visit' ? 'border-[#D4AF37] bg-[#4A1D43] text-[#D4AF37]' : 'border-[#D4AF37]/50 bg-white text-[#4A1D43] hover:bg-[#D4AF37]/10'}`}>
              <Compass className="h-4 w-4" aria-hidden="true" />{journey.visitTab}
            </button>
            <button type="button" role="tab" aria-selected={journeyMode === 'settle'} onClick={() => setJourneyMode('settle')} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs sm:text-sm font-semibold transition-colors ${journeyMode === 'settle' ? 'border-[#D4AF37] bg-[#4A1D43] text-[#D4AF37]' : 'border-[#D4AF37]/50 bg-white text-[#4A1D43] hover:bg-[#D4AF37]/10'}`}>
              <Home className="h-4 w-4" aria-hidden="true" />{journey.settleTab}
            </button>
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-[#4A0404]" style={{ fontFamily: "'Playfair Display', serif" }}>{journeyMode === 'visit' ? journey.visitTitle : journey.settleTitle}</h2>
            <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-relaxed text-gray-600">{journeyMode === 'visit' ? journey.visitIntro : journey.settleIntro}</p>
          </div>

          {journeyMode === 'visit' && <p className="mt-3 text-center text-xs font-semibold tracking-wide text-[#A45A27]">✨ Six façons de vivre la Tunisie, pas seulement de la visiter</p>}
          <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-3">
            {topics.map((topic, topicIndex) => journeyMode === 'visit' ? (
              <Link key={topic.title} to={topic.href} className={`group relative min-w-0 overflow-hidden rounded-2xl border border-white/70 px-2.5 py-3 sm:px-4 sm:py-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4A1D43] ${["bg-[#FFF0DB]","bg-[#E6F3E6]","bg-[#FFE9D7]","bg-[#F9EDD9]","bg-[#F3E9FA]","bg-[#E2F3F2]"][topicIndex % 6]}`}> 
                <div className="mb-2 flex items-center justify-between"><span className="text-2xl sm:text-3xl" aria-hidden="true">{['🏛️','🌿','🧶','🍲','🎉','🏡'][topicIndex] || '🇹🇳'}</span><span className="rounded-full bg-white/65 px-2 py-0.5 text-[10px] font-semibold text-[#784626]">Explorer</span></div>
                <div className="flex items-center justify-between gap-3 text-sm font-semibold text-[#4A1D43]">
                  <span>{topic.title}</span>
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 -rotate-90 text-[#D4AF37] ${isRTL ? 'rotate-90' : ''}`} aria-hidden="true" />
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{topic.text}</p>
                <ul className="mt-2 hidden flex-wrap gap-1.5 sm:flex" aria-label={topic.title}>
                  {visitExamples[lang][topicIndex].slice(0, 3).map((example) => (
                    <li key={example} className="rounded-full border border-[#D4AF37]/35 bg-white px-2.5 py-1 text-[11px] leading-tight text-gray-700">{example}</li>
                  ))}
                </ul>
                <span className="mt-3 inline-flex rounded-full bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#5B2345] shadow-sm transition group-hover:bg-white">{journey.discover}</span>
              </Link>
            ) : (
              <details key={topic.title} className="group min-w-0 rounded-xl border border-[#D4AF37]/45 bg-[#FFFDF8] px-3 py-2.5 open:border-[#D4AF37] max-md:open:fixed max-md:open:inset-x-3 max-md:open:top-[10dvh] max-md:open:bottom-[10dvh] max-md:open:z-[100] max-md:open:flex max-md:open:flex-col max-md:open:overflow-hidden max-md:open:bg-white max-md:open:p-0 max-md:open:shadow-2xl">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#4A1D43] [&::-webkit-details-marker]:hidden max-md:group-open:shrink-0 max-md:group-open:border-b max-md:group-open:border-[#D4AF37]/30 max-md:group-open:bg-[#FFFDF8] max-md:group-open:px-4 max-md:group-open:py-4">
                  <span>{topic.title}</span>
                  <span className="flex shrink-0 items-center gap-1.5"><span className="hidden text-[11px] font-semibold text-[#4A1D43] max-md:group-open:inline">{({fr:'Fermer',ar:'إغلاق',en:'Close',it:'Chiudi',ru:'Закрыть'} as Record<PublicLanguage, string>)[lang]}</span><ChevronDown className="h-4 w-4 text-[#D4AF37] transition-transform group-open:rotate-180" aria-hidden="true" /></span>
                </summary>
                <div className="max-md:group-open:min-h-0 max-md:group-open:flex-1 max-md:group-open:overflow-y-auto max-md:group-open:overscroll-contain max-md:group-open:px-4 max-md:group-open:pb-6">
                <p className="mt-2 text-xs font-medium leading-relaxed text-[#4A1D43]">{settleServiceIntros[lang][topicIndex]}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{topic.text}</p>
                {([1, 2, 7].includes(topicIndex)) && (
                  <div className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <ol className="list-decimal space-y-1.5 ps-4 text-xs leading-relaxed text-gray-700">
                      {(topicIndex === 1 ? everydayGuides[lang].housing : topicIndex === 2 ? everydayGuides[lang].health : everydayGuides[lang].daily).map(step => <li key={step}>{step}</li>)}
                    </ol>
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-600">{everydayGuides[lang].caution}</p>
                  </div>
                )}
                {topicIndex === 0 && (
                  <div className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{residenceGuide[lang].title}</p>
                    <ol className="mt-2 list-decimal space-y-1.5 ps-4 text-xs leading-relaxed text-gray-700">
                      {residenceGuide[lang].steps.map(step => <li key={step}>{step}</li>)}
                    </ol>
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-600">{residenceGuide[lang].caution}</p>
                  </div>
                )}
                {topicIndex === 3 && (
                  <div className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{schoolWorkGuides[lang].schoolTitle}</p>
                    <ol className="mt-2 list-decimal space-y-1.5 ps-4 text-xs leading-relaxed text-gray-700">
                      {schoolWorkGuides[lang].schoolSteps.map(step => <li key={step}>{step}</li>)}
                    </ol>
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-600">{schoolWorkGuides[lang].schoolNote}</p>
                  </div>
                )}
                {topicIndex === 6 && (
                  <div className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{schoolWorkGuides[lang].workTitle}</p>
                    <ol className="mt-2 list-decimal space-y-1.5 ps-4 text-xs leading-relaxed text-gray-700">
                      {schoolWorkGuides[lang].workSteps.map(step => <li key={step}>{step}</li>)}
                    </ol>

                    <p className="mt-2 text-[11px] leading-relaxed text-gray-600">{schoolWorkGuides[lang].workNote}</p>
                  </div>
                )}
                {topicIndex === 5 && (
                  <div className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{customsGuide[lang].title}</p>
                    <div className="mt-2 space-y-3">
                      {customsGuide[lang].paths.map((path) => (
                        <div key={path.title}>
                          <p className="text-xs font-semibold text-[#4A1D43]">{path.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-gray-700">{path.text}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-gray-600">{customsGuide[lang].caution}</p>
                  </div>
                )}
                {topicIndex === 4 && (
                  <div className="mt-3 rounded-lg border border-[#D4AF37]/30 bg-white p-3">
                    <p className="text-xs font-semibold text-[#4A1D43]">{bankingGuide[lang].title}</p>
                    <ol className="mt-2 list-decimal space-y-1.5 ps-4 text-xs leading-relaxed text-gray-700">
                      {bankingGuide[lang].steps.map((step) => <li key={step}>{step}</li>)}
                    </ol>
                    <p className="mt-2 text-[11px] leading-relaxed text-gray-600">{bankingGuide[lang].caution}</p>

                  </div>
                )}

                </div>
              </details>
            ))}
          </div>

          {journeyMode === 'settle' && (
            <div className="mt-4 rounded-xl border border-dashed border-[#D4AF37] bg-white px-4 py-3 text-center">
              <h3 className="text-sm font-semibold text-[#4A1D43]">{journey.bookletTitle}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{journey.bookletText}</p>
            </div>
          )}

          {journeyMode === 'settle' && (
            <nav className="mt-4 flex flex-wrap justify-center gap-2" aria-label={t.expatTitle}>
              {QUICK_LINK_PATHS.map((path, index) => (
                <Link key={path} to={path} className="rounded-full border border-[#D4AF37]/50 px-3 py-1.5 text-xs font-medium text-[#4A0404] hover:bg-[#D4AF37]/10">
                  {t.quickLinks[index]}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>

      {journeyMode === 'visit' && <TourismExperienceDiscovery />}

    </div>
  );
}
