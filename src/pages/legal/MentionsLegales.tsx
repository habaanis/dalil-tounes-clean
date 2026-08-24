import React from 'react';
import { SEOHead } from '../../components/SEOHead';
import { useLanguage } from '../../context/LanguageContext';

type PublicLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

type LegalCopy = {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  updated: string;
  editorTitle: string;
  editorIntro: string;
  name: string;
  status: string;
  statusValue: string;
  siret: string;
  address: string;
  contact: string;
  tradeNameNotice: string;
  hostTitle: string;
  hostIntro: string;
  company: string;
  hostAddress: string;
  site: string;
  purposeTitle: string;
  purposeText: string;
  liabilityTitle: string;
  liabilityTexts: string[];
  healthTitle: string;
  healthLead: string;
  healthTexts: string[];
  ipTitle: string;
  ipText: string;
  dataTitle: string;
  dataTexts: string[];
  privacyLink: string;
  lawTitle: string;
  lawText: string;
};

const COPY: Record<PublicLanguage, LegalCopy> = {
  fr: {
    seoTitle: 'Mentions Légales — Dalil Tounes',
    seoDescription: 'Mentions légales du site dalil-tounes.com : éditeur, hébergeur, responsabilité et protection des données.',
    eyebrow: 'Informations légales',
    title: 'Mentions Légales',
    updated: 'Dernière mise à jour : avril 2026',
    editorTitle: '1. Éditeur du site',
    editorIntro: "Le présent site internet accessible à l'adresse www.dalil-tounes.com est édité par :",
    name: 'Nom :',
    status: 'Statut :',
    statusValue: 'Entrepreneur individuel',
    siret: 'SIRET :',
    address: 'Siège social :',
    contact: 'Contact :',
    tradeNameNotice: 'Le nom commercial « Ste Dalil Tounes » est réservé au Registre National des Entreprises (RNE) de Tunisie sous le numéro 2026134575186. Toute utilisation non autorisée de ce nom constitue une atteinte aux droits de son titulaire et est susceptible d’engager la responsabilité civile et pénale de son auteur.',
    hostTitle: '2. Hébergement',
    hostIntro: 'Le site est hébergé par :',
    company: 'Société :',
    hostAddress: 'Adresse :',
    site: 'Site :',
    purposeTitle: '3. Objet du site',
    purposeText: 'Dalil Tounes est une plateforme digitale à destination des professionnels et des particuliers en Tunisie. Elle a pour vocation de mettre en relation des utilisateurs avec des entreprises, prestataires de services et professionnels de santé référencés sur le territoire tunisien.',
    liabilityTitle: '4. Limitation de responsabilité — Mise en relation',
    liabilityTexts: [
      "Dalil Tounes agit en qualité d'intermédiaire technique et ne saurait être tenu responsable des relations contractuelles, commerciales ou autres qui pourraient s'établir entre les utilisateurs et les entreprises ou professionnels référencés sur la plateforme.",
      "Les informations figurant sur les fiches professionnelles (coordonnées, horaires, tarifs, description des activités) sont fournies par les professionnels eux-mêmes ou collectées à partir de sources publiques. L'éditeur ne garantit pas l'exactitude, l'exhaustivité ni la mise à jour en temps réel de ces données.",
      "En conséquence, toute décision prise par un utilisateur sur la base des informations consultées sur la plateforme relève de sa seule appréciation. L'éditeur décline toute responsabilité quant aux dommages directs ou indirects pouvant résulter de l'utilisation de ces informations ou d'une mise en relation effectuée via la plateforme.",
    ],
    healthTitle: '5. Avertissement — Section e-santé',
    healthLead: 'Important : Les informations de la section santé ne constituent pas un avis médical.',
    healthTexts: [
      'Les contenus publiés dans la rubrique « Santé » du site Dalil Tounes ont une vocation exclusivement informative et générale. Ils ne sauraient en aucun cas se substituer à une consultation médicale, à un diagnostic établi par un professionnel de santé qualifié, ni à un traitement prescrit par un médecin.',
      "En cas de symptômes, de doute sur votre état de santé ou de situation d'urgence médicale, l'utilisateur est expressément invité à consulter un médecin ou à contacter les services d'urgence compétents. L'éditeur décline toute responsabilité en cas d'utilisation des informations de santé publiées sur la plateforme à des fins diagnostiques ou thérapeutiques.",
    ],
    ipTitle: '6. Propriété intellectuelle',
    ipText: "L'ensemble des éléments composant le site Dalil Tounes (structure, textes, graphismes, logotype, icônes, images, code source) est protégé par les dispositions du Code de la propriété intellectuelle applicable en France. Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, de ces éléments sans l'autorisation préalable et écrite de l'éditeur est strictement interdite et constitutive d'une contrefaçon.",
    dataTitle: '7. Protection des données personnelles',
    dataTexts: [
      'Les données à caractère personnel collectées via le site sont traitées conformément au Règlement général sur la protection des données (RGPD — Règlement UE 2016/679) et à la législation française en vigueur.',
      "L'utilisateur dispose d'un droit d'accès, de rectification, d'effacement, de limitation du traitement et de portabilité de ses données. Il peut exercer ces droits en adressant une demande écrite à l'adresse :",
      'Pour plus d’informations, veuillez consulter notre',
    ],
    privacyLink: 'Politique de confidentialité',
    lawTitle: '8. Droit applicable et juridiction compétente',
    lawText: "Les présentes mentions légales sont régies par le droit français. En cas de litige relatif à l'interprétation ou à l'exécution des présentes, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.",
  },
  ar: {
    seoTitle: 'الإشعارات القانونية — دليل تونس',
    seoDescription: 'الإشعارات القانونية لموقع dalil-tounes.com: الناشر، الاستضافة، المسؤولية وحماية البيانات.',
    eyebrow: 'معلومات قانونية',
    title: 'الإشعارات القانونية',
    updated: 'آخر تحديث: أبريل 2026',
    editorTitle: '1. ناشر الموقع',
    editorIntro: 'الموقع المتاح على العنوان www.dalil-tounes.com منشور من طرف:',
    name: 'الاسم:',
    status: 'الصفة:',
    statusValue: 'مقاول فردي',
    siret: 'SIRET:',
    address: 'المقر الاجتماعي:',
    contact: 'الاتصال:',
    tradeNameNotice: 'الاسم التجاري « Ste Dalil Tounes » محجوز لدى السجل الوطني للمؤسسات (RNE) في تونس تحت الرقم 2026134575186. وكل استعمال غير مصرح به لهذا الاسم يمثل مساساً بحقوق صاحبه وقد يرتب المسؤولية المدنية والجزائية على مرتكبه.',
    hostTitle: '2. الاستضافة',
    hostIntro: 'يتم استضافة الموقع لدى:',
    company: 'الشركة:',
    hostAddress: 'العنوان:',
    site: 'الموقع:',
    purposeTitle: '3. غرض الموقع',
    purposeText: 'دليل تونس منصة رقمية موجهة للمهنيين والأفراد في تونس. وتهدف إلى ربط المستخدمين بالشركات ومقدمي الخدمات والمهنيين الصحيين المدرجين على التراب التونسي.',
    liabilityTitle: '4. تحديد المسؤولية — الربط بين الأطراف',
    liabilityTexts: [
      'يعمل دليل تونس كوسيط تقني ولا يتحمل مسؤولية العلاقات التعاقدية أو التجارية أو غيرها التي قد تنشأ بين المستخدمين والشركات أو المهنيين المدرجين على المنصة.',
      'المعلومات الواردة في البطاقات المهنية (بيانات الاتصال، الأوقات، الأسعار، وصف الأنشطة) يقدمها المهنيون أنفسهم أو يتم جمعها من مصادر عامة. ولا يضمن الناشر دقة هذه البيانات أو اكتمالها أو تحديثها في الوقت الفعلي.',
      'وبالتالي فإن أي قرار يتخذه المستخدم استناداً إلى المعلومات المنشورة على المنصة يبقى من مسؤوليته وحده. ولا يتحمل الناشر مسؤولية الأضرار المباشرة أو غير المباشرة الناتجة عن استخدام هذه المعلومات أو عن عملية ربط تمت عبر المنصة.',
    ],
    healthTitle: '5. تنبيه — قسم الصحة الإلكترونية',
    healthLead: 'هام: المعلومات الواردة في قسم الصحة لا تمثل رأياً طبياً.',
    healthTexts: [
      'المحتويات المنشورة في قسم «الصحة» على دليل تونس ذات طابع إعلامي وعام فقط، ولا يمكن بأي حال أن تحل محل استشارة طبية أو تشخيص من مهني صحي مؤهل أو علاج موصوف من طبيب.',
      'عند ظهور أعراض أو وجود شك في الحالة الصحية أو في حالة طوارئ طبية، يُطلب من المستخدم صراحة استشارة طبيب أو الاتصال بخدمات الطوارئ المختصة. ويخلي الناشر مسؤوليته عن استخدام المعلومات الصحية المنشورة على المنصة لأغراض تشخيصية أو علاجية.',
    ],
    ipTitle: '6. الملكية الفكرية',
    ipText: 'جميع العناصر المكونة لموقع دليل تونس (البنية، النصوص، الرسوم، الشعار، الأيقونات، الصور، الشفرة المصدرية) محمية بموجب أحكام قانون الملكية الفكرية المطبق في فرنسا. ويحظر تماماً نسخها أو تمثيلها أو تعديلها أو نشرها أو تكييفها كلياً أو جزئياً دون إذن كتابي مسبق من الناشر، ويعد ذلك تقليداً.',
    dataTitle: '7. حماية البيانات الشخصية',
    dataTexts: [
      'تتم معالجة البيانات الشخصية التي يتم جمعها عبر الموقع وفقاً للائحة العامة لحماية البيانات (RGPD — اللائحة الأوروبية 2016/679) والتشريع الفرنسي الساري.',
      'للمستخدم حق الوصول والتصحيح والمحو وتقييد المعالجة ونقل بياناته. ويمكنه ممارسة هذه الحقوق بإرسال طلب كتابي إلى العنوان:',
      'لمزيد من المعلومات، يرجى الاطلاع على',
    ],
    privacyLink: 'سياسة الخصوصية',
    lawTitle: '8. القانون المطبق والاختصاص القضائي',
    lawText: 'تخضع هذه الإشعارات القانونية للقانون الفرنسي. وفي حال نشوء نزاع بشأن تفسيرها أو تنفيذها وعدم التوصل إلى حل ودي، تكون المحاكم الفرنسية وحدها مختصة.',
  },
  en: {
    seoTitle: 'Legal Notice — Dalil Tounes',
    seoDescription: 'Legal notice for dalil-tounes.com: publisher, hosting, liability and data protection.',
    eyebrow: 'Legal information',
    title: 'Legal Notice',
    updated: 'Last updated: April 2026',
    editorTitle: '1. Website publisher',
    editorIntro: 'The website available at www.dalil-tounes.com is published by:',
    name: 'Name:',
    status: 'Status:',
    statusValue: 'Sole trader',
    siret: 'SIRET:',
    address: 'Registered office:',
    contact: 'Contact:',
    tradeNameNotice: 'The trade name “Ste Dalil Tounes” is reserved with Tunisia’s National Business Register (RNE) under number 2026134575186. Any unauthorized use of this name infringes the rights of its holder and may give rise to civil and criminal liability.',
    hostTitle: '2. Hosting',
    hostIntro: 'The website is hosted by:',
    company: 'Company:',
    hostAddress: 'Address:',
    site: 'Website:',
    purposeTitle: '3. Purpose of the website',
    purposeText: 'Dalil Tounes is a digital platform for professionals and individuals in Tunisia. Its purpose is to connect users with businesses, service providers and healthcare professionals listed in Tunisia.',
    liabilityTitle: '4. Limitation of liability — Referral service',
    liabilityTexts: [
      'Dalil Tounes acts as a technical intermediary and cannot be held responsible for contractual, commercial or other relationships that may arise between users and businesses or professionals listed on the platform.',
      'Information shown on professional profiles (contact details, opening hours, prices and activity descriptions) is provided by the professionals themselves or collected from public sources. The publisher does not guarantee the accuracy, completeness or real-time updating of this information.',
      'Accordingly, any decision made by a user on the basis of information viewed on the platform remains the user’s sole responsibility. The publisher accepts no liability for direct or indirect damage resulting from the use of this information or from a connection made through the platform.',
    ],
    healthTitle: '5. Warning — E-health section',
    healthLead: 'Important: Information in the health section does not constitute medical advice.',
    healthTexts: [
      'Content published in the “Health” section of Dalil Tounes is for general information purposes only. It cannot replace a medical consultation, a diagnosis made by a qualified healthcare professional or treatment prescribed by a doctor.',
      'In the event of symptoms, concerns about your health or a medical emergency, users are expressly advised to consult a doctor or contact the appropriate emergency services. The publisher accepts no liability for the use of health information published on the platform for diagnostic or therapeutic purposes.',
    ],
    ipTitle: '6. Intellectual property',
    ipText: 'All elements making up the Dalil Tounes website (structure, texts, graphics, logo, icons, images and source code) are protected by the provisions of French intellectual property law. Any reproduction, representation, modification, publication or adaptation, in whole or in part, without the publisher’s prior written authorization is strictly prohibited and constitutes infringement.',
    dataTitle: '7. Personal data protection',
    dataTexts: [
      'Personal data collected through the website is processed in accordance with the General Data Protection Regulation (GDPR — EU Regulation 2016/679) and applicable French law.',
      'Users have rights of access, rectification, erasure, restriction of processing and data portability. These rights may be exercised by sending a written request to:',
      'For more information, please see our',
    ],
    privacyLink: 'Privacy Policy',
    lawTitle: '8. Applicable law and jurisdiction',
    lawText: 'This legal notice is governed by French law. In the event of a dispute concerning its interpretation or application, and failing an amicable settlement, the French courts shall have exclusive jurisdiction.',
  },
  it: {
    seoTitle: 'Note Legali — Dalil Tounes',
    seoDescription: 'Note legali di dalil-tounes.com: editore, hosting, responsabilità e protezione dei dati.',
    eyebrow: 'Informazioni legali',
    title: 'Note Legali',
    updated: 'Ultimo aggiornamento: aprile 2026',
    editorTitle: '1. Editore del sito',
    editorIntro: 'Il sito accessibile all’indirizzo www.dalil-tounes.com è pubblicato da:',
    name: 'Nome:',
    status: 'Status:',
    statusValue: 'Imprenditore individuale',
    siret: 'SIRET:',
    address: 'Sede legale:',
    contact: 'Contatto:',
    tradeNameNotice: 'Il nome commerciale “Ste Dalil Tounes” è riservato presso il Registro Nazionale delle Imprese (RNE) della Tunisia con il numero 2026134575186. Qualsiasi uso non autorizzato di tale nome costituisce una violazione dei diritti del titolare e può comportare responsabilità civile e penale.',
    hostTitle: '2. Hosting',
    hostIntro: 'Il sito è ospitato da:',
    company: 'Società:',
    hostAddress: 'Indirizzo:',
    site: 'Sito:',
    purposeTitle: '3. Finalità del sito',
    purposeText: 'Dalil Tounes è una piattaforma digitale destinata a professionisti e privati in Tunisia. Ha lo scopo di mettere in contatto gli utenti con aziende, fornitori di servizi e professionisti sanitari presenti sul territorio tunisino.',
    liabilityTitle: '4. Limitazione di responsabilità — Messa in contatto',
    liabilityTexts: [
      'Dalil Tounes opera come intermediario tecnico e non può essere ritenuto responsabile dei rapporti contrattuali, commerciali o di altra natura che possono instaurarsi tra gli utenti e le aziende o i professionisti presenti sulla piattaforma.',
      'Le informazioni riportate nelle schede professionali (contatti, orari, tariffe e descrizione delle attività) sono fornite dai professionisti stessi o raccolte da fonti pubbliche. L’editore non garantisce l’esattezza, la completezza o l’aggiornamento in tempo reale di tali dati.',
      'Di conseguenza, qualsiasi decisione presa dall’utente sulla base delle informazioni consultate sulla piattaforma resta di sua esclusiva responsabilità. L’editore declina ogni responsabilità per danni diretti o indiretti derivanti dall’utilizzo di tali informazioni o da una messa in contatto effettuata tramite la piattaforma.',
    ],
    healthTitle: '5. Avvertenza — Sezione e-salute',
    healthLead: 'Importante: le informazioni della sezione salute non costituiscono un parere medico.',
    healthTexts: [
      'I contenuti pubblicati nella sezione “Salute” di Dalil Tounes hanno finalità esclusivamente informative e generali. Non possono in alcun caso sostituire una visita medica, una diagnosi formulata da un professionista sanitario qualificato o un trattamento prescritto da un medico.',
      'In caso di sintomi, dubbi sul proprio stato di salute o emergenza medica, l’utente è espressamente invitato a consultare un medico o a contattare i servizi di emergenza competenti. L’editore declina ogni responsabilità per l’utilizzo delle informazioni sanitarie pubblicate sulla piattaforma a fini diagnostici o terapeutici.',
    ],
    ipTitle: '6. Proprietà intellettuale',
    ipText: 'Tutti gli elementi che compongono il sito Dalil Tounes (struttura, testi, grafica, logo, icone, immagini e codice sorgente) sono protetti dalle disposizioni del diritto francese sulla proprietà intellettuale. Qualsiasi riproduzione, rappresentazione, modifica, pubblicazione o adattamento, totale o parziale, senza previa autorizzazione scritta dell’editore è severamente vietato e costituisce contraffazione.',
    dataTitle: '7. Protezione dei dati personali',
    dataTexts: [
      'I dati personali raccolti tramite il sito sono trattati in conformità al Regolamento generale sulla protezione dei dati (GDPR — Regolamento UE 2016/679) e alla legislazione francese vigente.',
      'L’utente dispone dei diritti di accesso, rettifica, cancellazione, limitazione del trattamento e portabilità dei dati. Può esercitare tali diritti inviando una richiesta scritta a:',
      'Per maggiori informazioni, consulta la nostra',
    ],
    privacyLink: 'Informativa sulla Privacy',
    lawTitle: '8. Legge applicabile e foro competente',
    lawText: 'Le presenti note legali sono disciplinate dal diritto francese. In caso di controversia relativa alla loro interpretazione o applicazione e in assenza di una soluzione amichevole, saranno competenti esclusivamente i tribunali francesi.',
  },
  ru: {
    seoTitle: 'Юридическая информация — Dalil Tounes',
    seoDescription: 'Юридическая информация dalil-tounes.com: издатель, хостинг, ответственность и защита данных.',
    eyebrow: 'Юридическая информация',
    title: 'Юридическая информация',
    updated: 'Последнее обновление: апрель 2026 г.',
    editorTitle: '1. Издатель сайта',
    editorIntro: 'Сайт www.dalil-tounes.com публикуется:',
    name: 'Имя:',
    status: 'Статус:',
    statusValue: 'Индивидуальный предприниматель',
    siret: 'SIRET:',
    address: 'Юридический адрес:',
    contact: 'Контакт:',
    tradeNameNotice: 'Торговое наименование «Ste Dalil Tounes» зарегистрировано в Национальном реестре предприятий Туниса (RNE) под номером 2026134575186. Любое несанкционированное использование этого наименования нарушает права его владельца и может повлечь гражданскую и уголовную ответственность.',
    hostTitle: '2. Хостинг',
    hostIntro: 'Сайт размещен у:',
    company: 'Компания:',
    hostAddress: 'Адрес:',
    site: 'Сайт:',
    purposeTitle: '3. Назначение сайта',
    purposeText: 'Dalil Tounes — цифровая платформа для профессионалов и частных лиц в Тунисе. Ее задача — связывать пользователей с компаниями, поставщиками услуг и медицинскими специалистами, представленными на территории Туниса.',
    liabilityTitle: '4. Ограничение ответственности — Посредничество',
    liabilityTexts: [
      'Dalil Tounes выступает техническим посредником и не несет ответственности за договорные, коммерческие или иные отношения, которые могут возникнуть между пользователями и компаниями или специалистами, представленными на платформе.',
      'Информация в профессиональных карточках (контактные данные, часы работы, тарифы и описание деятельности) предоставляется самими специалистами или собирается из открытых источников. Издатель не гарантирует точность, полноту или обновление этих данных в режиме реального времени.',
      'Следовательно, любое решение пользователя, принятое на основании информации, размещенной на платформе, остается исключительно в зоне ответственности пользователя. Издатель не несет ответственности за прямой или косвенный ущерб, возникший в результате использования этой информации или контакта, установленного через платформу.',
    ],
    healthTitle: '5. Предупреждение — Раздел e-health',
    healthLead: 'Важно: информация в разделе здоровья не является медицинской консультацией.',
    healthTexts: [
      'Материалы раздела «Здоровье» Dalil Tounes имеют исключительно общий информационный характер. Они не заменяют медицинскую консультацию, диагноз квалифицированного медицинского специалиста или лечение, назначенное врачом.',
      'При наличии симптомов, сомнений относительно состояния здоровья или медицинской неотложной ситуации пользователю настоятельно рекомендуется обратиться к врачу или в соответствующие экстренные службы. Издатель не несет ответственности за использование опубликованной на платформе медицинской информации в диагностических или лечебных целях.',
    ],
    ipTitle: '6. Интеллектуальная собственность',
    ipText: 'Все элементы сайта Dalil Tounes (структура, тексты, графика, логотип, иконки, изображения и исходный код) защищены положениями законодательства Франции об интеллектуальной собственности. Любое полное или частичное воспроизведение, представление, изменение, публикация или адаптация без предварительного письменного разрешения издателя строго запрещены и являются нарушением прав.',
    dataTitle: '7. Защита персональных данных',
    dataTexts: [
      'Персональные данные, собираемые через сайт, обрабатываются в соответствии с Общим регламентом по защите данных (GDPR — Регламент ЕС 2016/679) и действующим законодательством Франции.',
      'Пользователь имеет право на доступ, исправление, удаление, ограничение обработки и переносимость данных. Для реализации этих прав можно направить письменный запрос по адресу:',
      'Дополнительную информацию см. в нашей',
    ],
    privacyLink: 'Политике конфиденциальности',
    lawTitle: '8. Применимое право и юрисдикция',
    lawText: 'Настоящая юридическая информация регулируется законодательством Франции. В случае спора, связанного с ее толкованием или применением, и при отсутствии мирного урегулирования исключительной компетенцией обладают французские суды.',
  },
};

const MentionsLegales: React.FC = () => {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const copy = COPY[lang];
  const isRTL = lang === 'ar';
  const listClass = `mt-3 space-y-1 ${isRTL ? 'pr-4 border-r-2' : 'pl-4 border-l-2'} border-[#D4AF37]`;

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead title={copy.seoTitle} description={copy.seoDescription} />

      <div className="pt-16 pb-10 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-6">{copy.eyebrow}</span>
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{copy.title}</h1>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-8" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">{copy.editorTitle}</h2>
          <p>{copy.editorIntro}</p>
          <ul className={listClass}>
            <li><span className="font-medium">{copy.name}</span> Anis Taieb HABA</li>
            <li><span className="font-medium">{copy.status}</span> {copy.statusValue}</li>
            <li><span className="font-medium">{copy.siret}</span> 89217073900015</li>
            <li><span className="font-medium">{copy.address}</span> 266, rue de l'école</li>
            <li><span className="font-medium">{copy.contact}</span>{' '}<a href="mailto:contact@dalil-tounes.com" className="text-[#D4AF37] hover:underline">contact@dalil-tounes.com</a></li>
          </ul>
          <p className="mt-4 text-xs text-gray-500 italic">{copy.tradeNameNotice}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">{copy.hostTitle}</h2>
          <p>{copy.hostIntro}</p>
          <ul className={listClass}>
            <li><span className="font-medium">{copy.company}</span> Namecheap, Inc.</li>
            <li><span className="font-medium">{copy.hostAddress}</span> 4600 East Washington Street, Suite 300, Phoenix, AZ 85034, USA</li>
            <li><span className="font-medium">{copy.site}</span>{' '}<a href="https://www.namecheap.com" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">www.namecheap.com</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">{copy.purposeTitle}</h2>
          <p>{copy.purposeText}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">{copy.liabilityTitle}</h2>
          {copy.liabilityTexts.map((text, index) => <p key={index} className={index ? 'mt-3' : ''}>{text}</p>)}
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">{copy.healthTitle}</h2>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="font-medium text-amber-900 mb-2">{copy.healthLead}</p>
            {copy.healthTexts.map((text, index) => <p key={index} className={`text-amber-800 ${index ? 'mt-2' : ''}`}>{text}</p>)}
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">{copy.ipTitle}</h2>
          <p>{copy.ipText}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">{copy.dataTitle}</h2>
          <p>{copy.dataTexts[0]}</p>
          <p className="mt-3">{copy.dataTexts[1]}{' '}<a href="mailto:contact@dalil-tounes.com" className="text-[#D4AF37] hover:underline">contact@dalil-tounes.com</a>.</p>
          <p className="mt-3">{copy.dataTexts[2]}{' '}<a href="/politique-confidentialite" className="text-[#D4AF37] hover:underline">{copy.privacyLink}</a>.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">{copy.lawTitle}</h2>
          <p>{copy.lawText}</p>
        </section>

        <p className="text-xs text-gray-400 pt-6 border-t border-gray-100">{copy.updated}</p>
      </div>
    </div>
  );
};

export default MentionsLegales;
