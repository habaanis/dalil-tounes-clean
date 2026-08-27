import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Baby, Building2, CheckCircle, Clock, ExternalLink, FileText, Heart, Phone, Shield, X, type LucideIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getStructureImageUrl } from '../lib/imageUtils';
import SearchBar from '../components/SearchBar';
import MeilleursSection from '../components/MeilleursSection';
import { SEOHead } from '../components/SEOHead';

type Lang = 'fr' | 'ar' | 'en' | 'it' | 'ru';
type Tab = 'bureaux' | 'demarches' | 'social';

type ProcedureCopy = {
  title: string;
  description: string;
  documents: string[];
  delay: string;
  cost: string;
  authority: string;
  formUrl?: string;
  sourceUrl?: string;
};

type PageCopy = {
  back: string;
  title: string;
  intro: string;
  tabs: { offices: string; procedures: string; social: string };
  searchTitle: string;
  searchSubtitle: string;
  recommended: string;
  sector: string;
  articleTitle: string;
  articleExcerpt: string;
  proceduresTitle: string;
  proceduresIntro: string;
  pieces: string;
  processingTime: string;
  cost: string;
  requiredDocuments: string;
  authority: string;
  onlineForm: string;
  warning: string;
  socialTitle: string;
  socialIntro: string;
  officesTitle: string;
  officesIntro: string;
  usefulLinksTitle: string;
  officialLinks: { registry: string; justice: string; passport: string };
  together: string;
  procedures: ProcedureCopy[];
};

const COPY: Record<Lang, PageCopy> = {
  fr: {
    back: 'Retour', title: 'Services Citoyens',
    intro: "Retrouvez les services publics et sociaux utiles en Tunisie, les démarches administratives essentielles et les numéros d'urgence.",
    tabs: { offices: 'Bureaux', procedures: 'Démarches', social: 'Social' },
    searchTitle: 'Services administratifs et citoyens recommandés près de chez vous',
    searchSubtitle: 'Associations, services juridiques, sociaux et administratifs évalués par leurs usagers',
    recommended: 'Entreprises les plus recommandées par les clients', sector: 'services citoyens',
    articleTitle: 'Activités à faire en famille en Tunisie', articleExcerpt: 'Sorties, sports, culture : découvrez des idées pour passer de bons moments en famille.',
    proceduresTitle: 'Démarches administratives', proceduresIntro: 'Retrouvez les documents requis, délais, coûts et services compétents pour les principales démarches.',
    pieces: 'pièces', processingTime: 'Délai de traitement', cost: 'Coût', requiredDocuments: 'Pièces requises', authority: 'Service compétent', onlineForm: 'Accéder au formulaire en ligne',
    warning: "Vérifiez toujours les informations et les formulaires auprès de l'administration concernée avant de vous déplacer.",
    socialTitle: "Aide sociale et numéros d'urgence", socialIntro: 'Retrouvez rapidement les principaux services d’aide et de protection.',
    officesTitle: 'Bureaux & établissements publics', officesIntro: 'Recherchez une administration ou un service public près de chez vous.',
    usefulLinksTitle: 'Liens administratifs officiels',
    officialLinks: { registry: 'Registre National des Entreprises', justice: 'Services judiciaires en ligne', passport: 'Rendez-vous passeport en ligne' },
    together: 'Ensemble, construisons une société plus juste, accessible et solidaire.',
    procedures: [
      { title: "Carte d'identité nationale", description: "Obtention ou renouvellement de la carte d'identité nationale pour les citoyens tunisiens.", documents: ['Acte de naissance (original + 2 photocopies)', 'Certificat de résidence (moins de 3 mois)', "2 photos d'identité récentes", "Ancienne carte d'identité (si renouvellement)"], delay: '15 jours ouvrables', cost: '10 TND', authority: 'Mairie / Municipalité' },
      { title: 'Passeport biométrique', description: 'Demande de passeport biométrique pour les voyages internationaux.', documents: ["Carte d'identité nationale en cours de validité", 'Extrait de naissance (n°12) original', 'Certificat de résidence (moins de 3 mois)', "4 photos d'identité aux normes biométriques", 'Ancien passeport (si renouvellement)'], delay: '3 à 6 semaines', cost: '100 TND (ordinaire) / 150 TND (urgent)', authority: 'Préfecture / Direction Générale de la Sûreté Nationale', formUrl: 'https://www.passeport.gov.tn' },
      { title: 'Acte de naissance (Extrait n°12)', description: "Obtention d'un extrait officiel d'acte de naissance.", documents: ["Carte d'identité du demandeur", 'Formulaire de demande rempli', 'Frais de timbre'], delay: 'Immédiat à 48 h', cost: '2 TND', authority: "Mairie / Bureau d'État Civil" },
      { title: 'Certificat de résidence', description: 'Document attestant votre lieu de résidence actuel.', documents: ["Carte d'identité nationale", 'Justificatif de domicile (facture STEG, SONEDE ou quittance de loyer)', 'Présence physique obligatoire'], delay: 'Immédiat', cost: 'Gratuit', authority: 'Omda / Cheikh' },
      { title: 'Extrait de casier judiciaire (Bulletin n°3)', description: "Document attestant l'absence de condamnations pénales.", documents: ["Carte d'identité nationale", 'Timbre fiscal de 1 TND', 'Formulaire de demande'], delay: '3 à 7 jours', cost: '1 TND', authority: 'Tribunal de Première Instance', formUrl: 'https://www.e-justice.tn' },
      { title: 'Certificat de vie', description: 'Document attestant que vous êtes en vie, souvent demandé aux retraités.', documents: ["Carte d'identité nationale", 'Présence physique obligatoire'], delay: 'Immédiat', cost: 'Gratuit', authority: 'Omda / Cheikh / Municipalité' },
    ],
  },
  ar: {
    back: 'رجوع', title: 'خدمات المواطنين',
    intro: 'اعثر على الخدمات العمومية والاجتماعية المفيدة في تونس، والإجراءات الإدارية الأساسية وأرقام الطوارئ.',
    tabs: { offices: 'المكاتب', procedures: 'الإجراءات', social: 'الشؤون الاجتماعية' },
    searchTitle: 'الخدمات الإدارية وخدمات المواطنين الموصى بها بالقرب منك',
    searchSubtitle: 'جمعيات وخدمات قانونية واجتماعية وإدارية قيّمها مستخدموها',
    recommended: 'المؤسسات الأكثر توصية من قبل العملاء', sector: 'خدمات المواطنين',
    articleTitle: 'أنشطة عائلية في تونس', articleExcerpt: 'نزهات ورياضة وثقافة: اكتشف أفكاراً لقضاء أوقات ممتعة مع العائلة.',
    proceduresTitle: 'الإجراءات الإدارية', proceduresIntro: 'اعثر على الوثائق المطلوبة والآجال والتكاليف والمصالح المختصة لأهم الإجراءات.',
    pieces: 'وثائق', processingTime: 'مدة المعالجة', cost: 'التكلفة', requiredDocuments: 'الوثائق المطلوبة', authority: 'المصلحة المختصة', onlineForm: 'الوصول إلى النموذج عبر الإنترنت',
    warning: 'تحقق دائماً من المعلومات والنماذج لدى الإدارة المعنية قبل التنقل.',
    socialTitle: 'المساعدة الاجتماعية وأرقام الطوارئ', socialIntro: 'اعثر بسرعة على أهم خدمات المساعدة والحماية.',
    officesTitle: 'المكاتب والمؤسسات العمومية', officesIntro: 'ابحث عن إدارة أو خدمة عمومية قريبة منك.',
    usefulLinksTitle: 'روابط إدارية رسمية',
    officialLinks: { registry: 'السجل الوطني للمؤسسات', justice: 'الخدمات القضائية عبر الإنترنت', passport: 'حجز موعد جواز السفر عبر الإنترنت' },
    together: 'معاً، لنبني مجتمعاً أكثر عدلاً وإتاحة وتضامناً.',
    procedures: [
      { title: 'بطاقة التعريف الوطنية', description: 'الحصول على بطاقة التعريف الوطنية أو تجديدها للمواطنين التونسيين.', documents: ['شهادة ميلاد (الأصل + نسختان)', 'شهادة إقامة (أقل من 3 أشهر)', 'صورتان شمسيتان حديثتان', 'بطاقة التعريف القديمة (في حالة التجديد)'], delay: '15 يوم عمل', cost: '10 د.ت', authority: 'البلدية' },
      { title: 'جواز السفر البيومتري', description: 'طلب جواز سفر بيومتري للسفر الدولي.', documents: ['بطاقة التعريف الوطنية سارية المفعول', 'نسخة أصلية من عقد الميلاد رقم 12', 'شهادة إقامة (أقل من 3 أشهر)', '4 صور شمسية بمقاييس بيومترية', 'جواز السفر القديم (في حالة التجديد)'], delay: 'من 3 إلى 6 أسابيع', cost: '100 د.ت (عادي) / 150 د.ت (استعجالي)', authority: 'المصلحة المختصة بالأمن الوطني', formUrl: 'https://www.passeport.gov.tn' },
      { title: 'مضمون ولادة (نسخة رقم 12)', description: 'الحصول على نسخة رسمية من عقد الميلاد.', documents: ['بطاقة تعريف مقدم الطلب', 'استمارة طلب معمرة', 'معلوم الطابع'], delay: 'فوري إلى 48 ساعة', cost: '2 د.ت', authority: 'البلدية / مكتب الحالة المدنية' },
      { title: 'شهادة إقامة', description: 'وثيقة تثبت مكان إقامتك الحالي.', documents: ['بطاقة التعريف الوطنية', 'ما يثبت العنوان (فاتورة STEG أو SONEDE أو وصل إيجار)', 'الحضور الشخصي إلزامي'], delay: 'فوري', cost: 'مجاني', authority: 'العمدة / الشيخ' },
      { title: 'بطاقة السوابق العدلية (النشرة رقم 3)', description: 'وثيقة تثبت عدم وجود سوابق عدلية.', documents: ['بطاقة التعريف الوطنية', 'طابع جبائي بقيمة 1 د.ت', 'استمارة الطلب'], delay: 'من 3 إلى 7 أيام', cost: '1 د.ت', authority: 'المحكمة الابتدائية', formUrl: 'https://www.e-justice.tn' },
      { title: 'شهادة حياة', description: 'وثيقة تثبت أن صاحبها على قيد الحياة وتطلب غالباً للمتقاعدين.', documents: ['بطاقة التعريف الوطنية', 'الحضور الشخصي إلزامي'], delay: 'فوري', cost: 'مجاني', authority: 'العمدة / الشيخ / البلدية' },
    ],
  },
  en: {
    back: 'Back', title: 'Citizen Services',
    intro: 'Find useful public and social services in Tunisia, essential administrative procedures and emergency numbers.',
    tabs: { offices: 'Offices', procedures: 'Procedures', social: 'Social' },
    searchTitle: 'Recommended administrative and citizen services near you',
    searchSubtitle: 'Associations and legal, social and administrative services rated by their users',
    recommended: 'Most recommended businesses by customers', sector: 'citizen services',
    articleTitle: 'Family activities in Tunisia', articleExcerpt: 'Outings, sports and culture: discover ideas for quality family time.',
    proceduresTitle: 'Administrative procedures', proceduresIntro: 'Find required documents, processing times, costs and competent authorities for key procedures.',
    pieces: 'documents', processingTime: 'Processing time', cost: 'Cost', requiredDocuments: 'Required documents', authority: 'Competent authority', onlineForm: 'Access online form',
    warning: 'Always verify information and forms with the relevant authority before travelling.',
    socialTitle: 'Social assistance & emergency numbers', socialIntro: 'Quickly find the main assistance and protection services.',
    officesTitle: 'Public offices & institutions', officesIntro: 'Search for a public office or service near you.',
    usefulLinksTitle: 'Official administrative links',
    officialLinks: { registry: 'National Register of Enterprises', justice: 'Online judicial services', passport: 'Online passport appointments' },
    together: 'Together, let us build a fairer, more accessible and supportive society.',
    procedures: [
      { title: 'National ID Card', description: 'Obtain or renew the national ID card for Tunisian citizens.', documents: ['Birth certificate (original + 2 copies)', 'Residence certificate (less than 3 months)', '2 recent ID photos', 'Old ID card (if renewing)'], delay: '15 working days', cost: '10 TND', authority: 'Municipality' },
      { title: 'Biometric Passport', description: 'Apply for a biometric passport for international travel.', documents: ['Valid national ID card', 'Original birth certificate extract n°12', 'Residence certificate (less than 3 months)', '4 biometric ID photos', 'Old passport (if renewing)'], delay: '3 to 6 weeks', cost: '100 TND (standard) / 150 TND (urgent)', authority: 'Prefecture / National Security authority', formUrl: 'https://www.passeport.gov.tn' },
      { title: 'Birth Certificate (Extract n°12)', description: 'Obtain an official birth certificate extract.', documents: ["Applicant's ID card", 'Completed application form', 'Stamp fee'], delay: 'Immediate to 48 h', cost: '2 TND', authority: 'Municipality / Civil Registry Office' },
      { title: 'Residence Certificate', description: 'Document certifying your current place of residence.', documents: ['National ID card', 'Proof of address (STEG, SONEDE bill or rent receipt)', 'Physical presence required'], delay: 'Immediate', cost: 'Free', authority: 'Omda / Cheikh' },
      { title: 'Criminal Record Extract (Bulletin n°3)', description: 'Document certifying the absence of criminal convictions.', documents: ['National ID card', '1 TND fiscal stamp', 'Application form'], delay: '3 to 7 days', cost: '1 TND', authority: 'Court of First Instance', formUrl: 'https://www.e-justice.tn' },
      { title: 'Life Certificate', description: 'Document certifying that you are alive, often required for retirees.', documents: ['National ID card', 'Physical presence required'], delay: 'Immediate', cost: 'Free', authority: 'Omda / Cheikh / Municipality' },
    ],
  },
  it: {
    back: 'Indietro', title: 'Servizi al Cittadino',
    intro: 'Trova i servizi pubblici e sociali utili in Tunisia, le principali pratiche amministrative e i numeri di emergenza.',
    tabs: { offices: 'Uffici', procedures: 'Pratiche', social: 'Sociale' },
    searchTitle: 'Servizi amministrativi e al cittadino consigliati vicino a te',
    searchSubtitle: 'Associazioni e servizi legali, sociali e amministrativi valutati dagli utenti',
    recommended: 'Aziende più raccomandate dai clienti', sector: 'servizi al cittadino',
    articleTitle: 'Attività da fare in famiglia in Tunisia', articleExcerpt: 'Uscite, sport e cultura: scopri idee per trascorrere bei momenti in famiglia.',
    proceduresTitle: 'Pratiche amministrative', proceduresIntro: 'Trova documenti richiesti, tempi, costi e uffici competenti per le principali pratiche.',
    pieces: 'documenti', processingTime: 'Tempo di elaborazione', cost: 'Costo', requiredDocuments: 'Documenti richiesti', authority: 'Ufficio competente', onlineForm: 'Accedi al modulo online',
    warning: "Verifica sempre informazioni e moduli presso l'amministrazione competente prima di spostarti.",
    socialTitle: 'Assistenza sociale e numeri di emergenza', socialIntro: 'Trova rapidamente i principali servizi di assistenza e protezione.',
    officesTitle: 'Uffici ed enti pubblici', officesIntro: 'Cerca un ufficio o un servizio pubblico vicino a te.',
    usefulLinksTitle: 'Link amministrativi ufficiali',
    officialLinks: { registry: 'Registro Nazionale delle Imprese', justice: 'Servizi giudiziari online', passport: 'Appuntamenti passaporto online' },
    together: 'Insieme, costruiamo una società più giusta, accessibile e solidale.',
    procedures: [
      { title: "Carta d'identità nazionale", description: "Rilascio o rinnovo della carta d'identità nazionale per i cittadini tunisini.", documents: ['Certificato di nascita (originale + 2 copie)', 'Certificato di residenza (meno di 3 mesi)', '2 foto tessera recenti', "Vecchia carta d'identità (in caso di rinnovo)"], delay: '15 giorni lavorativi', cost: '10 TND', authority: 'Comune / Municipalità' },
      { title: 'Passaporto biometrico', description: 'Richiesta di passaporto biometrico per viaggi internazionali.', documents: ["Carta d'identità nazionale valida", 'Estratto di nascita n°12 originale', 'Certificato di residenza (meno di 3 mesi)', '4 foto tessera biometriche', 'Vecchio passaporto (in caso di rinnovo)'], delay: 'Da 3 a 6 settimane', cost: '100 TND (ordinario) / 150 TND (urgente)', authority: 'Prefettura / Autorità di sicurezza nazionale', formUrl: 'https://www.passeport.gov.tn' },
      { title: 'Certificato di nascita (Estratto n°12)', description: 'Ottenimento di un estratto ufficiale del certificato di nascita.', documents: ["Carta d'identità del richiedente", 'Modulo di domanda compilato', 'Imposta di bollo'], delay: 'Immediato fino a 48 h', cost: '2 TND', authority: 'Comune / Ufficio di Stato Civile' },
      { title: 'Certificato di residenza', description: 'Documento che attesta il luogo di residenza attuale.', documents: ["Carta d'identità nazionale", 'Prova di domicilio (bolletta STEG/SONEDE o ricevuta di affitto)', 'Presenza fisica obbligatoria'], delay: 'Immediato', cost: 'Gratuito', authority: 'Omda / Cheikh' },
      { title: 'Certificato del casellario giudiziale (Bollettino n°3)', description: "Documento che attesta l'assenza di condanne penali.", documents: ["Carta d'identità nazionale", 'Marca fiscale da 1 TND', 'Modulo di domanda'], delay: 'Da 3 a 7 giorni', cost: '1 TND', authority: 'Tribunale di primo grado', formUrl: 'https://www.e-justice.tn' },
      { title: 'Certificato di esistenza in vita', description: 'Documento che certifica che la persona è in vita, spesso richiesto ai pensionati.', documents: ["Carta d'identità nazionale", 'Presenza fisica obbligatoria'], delay: 'Immediato', cost: 'Gratuito', authority: 'Omda / Cheikh / Comune' },
    ],
  },
  ru: {
    back: 'Назад', title: 'Государственные услуги',
    intro: 'Найдите полезные государственные и социальные службы Туниса, основные административные процедуры и экстренные номера.',
    tabs: { offices: 'Учреждения', procedures: 'Процедуры', social: 'Социальная помощь' },
    searchTitle: 'Рекомендуемые административные и государственные услуги рядом с вами',
    searchSubtitle: 'Ассоциации, юридические, социальные и административные службы по оценкам пользователей',
    recommended: 'Компании, которые чаще всего рекомендуют клиенты', sector: 'государственные услуги',
    articleTitle: 'Семейные занятия в Тунисе', articleExcerpt: 'Прогулки, спорт и культура: идеи для приятного семейного отдыха.',
    proceduresTitle: 'Административные процедуры', proceduresIntro: 'Документы, сроки, стоимость и компетентные учреждения для основных административных процедур.',
    pieces: 'документов', processingTime: 'Срок обработки', cost: 'Стоимость', requiredDocuments: 'Необходимые документы', authority: 'Компетентное учреждение', onlineForm: 'Открыть онлайн-форму',
    warning: 'Перед поездкой всегда уточняйте актуальность информации и форм в соответствующем учреждении.',
    socialTitle: 'Социальная помощь и экстренные номера', socialIntro: 'Быстрый доступ к основным службам помощи и защиты.',
    officesTitle: 'Государственные учреждения', officesIntro: 'Найдите государственное учреждение или службу рядом с вами.',
    usefulLinksTitle: 'Официальные административные ссылки',
    officialLinks: { registry: 'Национальный реестр предприятий', justice: 'Судебные услуги онлайн', passport: 'Онлайн-запись на получение паспорта' },
    together: 'Вместе создаём более справедливое, доступное и солидарное общество.',
    procedures: [
      { title: 'Национальное удостоверение личности', description: 'Получение или продление национального удостоверения личности для граждан Туниса.', documents: ['Свидетельство о рождении (оригинал + 2 копии)', 'Справка о месте жительства (не старше 3 месяцев)', '2 свежие фотографии на документы', 'Старое удостоверение личности (при продлении)'], delay: '15 рабочих дней', cost: '10 TND', authority: 'Муниципалитет' },
      { title: 'Биометрический паспорт', description: 'Подача заявления на биометрический паспорт для международных поездок.', documents: ['Действующее национальное удостоверение личности', 'Оригинал выписки из свидетельства о рождении №12', 'Справка о месте жительства (не старше 3 месяцев)', '4 биометрические фотографии', 'Старый паспорт (при продлении)'], delay: 'От 3 до 6 недель', cost: '100 TND (обычно) / 150 TND (срочно)', authority: 'Префектура / компетентная служба национальной безопасности', formUrl: 'https://www.passeport.gov.tn' },
      { title: 'Свидетельство о рождении (выписка №12)', description: 'Получение официальной выписки из свидетельства о рождении.', documents: ['Удостоверение личности заявителя', 'Заполненная форма заявления', 'Гербовый сбор'], delay: 'Сразу или до 48 часов', cost: '2 TND', authority: 'Муниципалитет / отдел ЗАГС' },
      { title: 'Справка о месте жительства', description: 'Документ, подтверждающий текущее место жительства.', documents: ['Национальное удостоверение личности', 'Подтверждение адреса (счёт STEG/SONEDE или квитанция об аренде)', 'Личное присутствие обязательно'], delay: 'Сразу', cost: 'Бесплатно', authority: 'Omda / Cheikh' },
      { title: 'Справка об отсутствии судимости (бюллетень №3)', description: 'Документ, подтверждающий отсутствие судимости.', documents: ['Национальное удостоверение личности', 'Фискальная марка 1 TND', 'Форма заявления'], delay: 'От 3 до 7 дней', cost: '1 TND', authority: 'Суд первой инстанции', formUrl: 'https://www.e-justice.tn' },
      { title: 'Справка о нахождении в живых', description: 'Документ, подтверждающий, что человек жив; часто требуется пенсионерам.', documents: ['Национальное удостоверение личности', 'Личное присутствие обязательно'], delay: 'Сразу', cost: 'Бесплатно', authority: 'Omda / Cheikh / муниципалитет' },
    ],
  },
};

const CIN_SOURCE = 'https://services.interieur.gov.tn/wap/fr/docs/demarches/01.html';
const PASSPORT_SOURCE = 'https://www.sicad.gov.tn/m/Fr/Prestation_Obtention-dun-passeport-pour-la-premiere-fois-ou-son-renouvellement-pour-les-Tunisiens-residents-sur-le-territoire-tunisien_57_3_D1618';
const B3_SOURCE = 'https://b3.interieur.gov.tn/ar/demande';

const VERIFIED_PROCEDURES: Record<Lang, ProcedureCopy[]> = {
  fr: [
    { title: "Carte d'identité nationale — première demande", description: "Première obtention de la carte d'identité nationale pour les citoyens tunisiens.", documents: ['Formulaire administratif rempli et signé', 'Extrait de naissance datant de moins de 3 mois', 'Justificatif de nationalité tunisienne', 'Attestation de résidence', "Attestation de travail, de scolarité ou d'études", "3 photos d'identité récentes", 'Reçu de paiement du droit de timbre'], delay: '15 jours', cost: 'Droit de timbre en vigueur', authority: 'Poste de police ou de garde nationale du lieu de résidence', sourceUrl: CIN_SOURCE },
    { title: "Carte d'identité nationale — renouvellement", description: "Renouvellement de la carte en cas d'expiration, de modification des données ou de détérioration.", documents: ['Formulaire administratif rempli et signé', 'Extrait de naissance datant de moins de 3 mois', "3 photos d'identité récentes", "Ancienne carte d'identité", 'Justificatif du changement déclaré, le cas échéant', 'Reçu de paiement du droit de timbre'], delay: '15 jours', cost: '3 TND (carte intacte) / 25 TND (carte détériorée)', authority: 'Poste de police ou de garde nationale du lieu de résidence', sourceUrl: CIN_SOURCE },
    { title: 'Passeport ordinaire — première demande ou renouvellement', description: "Demande ou renouvellement du passeport ordinaire tunisien. Les pièces et le tarif varient selon l'âge et la situation.", documents: ["Formulaire de demande rempli et signé", "Copie de la carte d'identité avec présentation de l'original", '4 photos récentes sur fond blanc (3,5 × 4,5 cm)', 'Autorisation du représentant légal pour un mineur', 'Justificatif scolaire ou universitaire, le cas échéant', "Ancien passeport en cas de renouvellement", 'Reçu de paiement du droit de timbre'], delay: '15 jours', cost: 'Selon la situation : 25, 80 ou 150 TND', authority: 'Poste de police ou de garde nationale territorialement compétent', sourceUrl: PASSPORT_SOURCE },
    ...COPY.fr.procedures.slice(2).map((item, index) => index === 2 ? { ...item, formUrl: B3_SOURCE } : item),
  ],
  ar: [
    { title: 'بطاقة التعريف الوطنية — أول طلب', description: 'الحصول لأول مرة على بطاقة التعريف الوطنية للمواطنين التونسيين.', documents: ['استمارة إدارية معمرة وممضاة', 'مضمون ولادة لم يمض على استخراجه أكثر من 3 أشهر', 'ما يثبت الجنسية التونسية', 'شهادة إقامة', 'شهادة عمل أو حضور مدرسي أو جامعي', '3 صور شمسية حديثة', 'وصل خلاص معلوم الطابع'], delay: '15 يوماً', cost: 'معلوم الطابع الجاري به العمل', authority: 'مركز الشرطة أو الحرس الوطني التابع لمكان الإقامة', sourceUrl: CIN_SOURCE },
    { title: 'بطاقة التعريف الوطنية — التجديد', description: 'تجديد البطاقة عند انتهاء الصلاحية أو تغيير البيانات أو التلف.', documents: ['استمارة إدارية معمرة وممضاة', 'مضمون ولادة لم يمض على استخراجه أكثر من 3 أشهر', '3 صور شمسية حديثة', 'بطاقة التعريف القديمة', 'ما يثبت التغيير المصرح به عند الاقتضاء', 'وصل خلاص معلوم الطابع'], delay: '15 يوماً', cost: '3 د.ت (بطاقة سليمة) / 25 د.ت (بطاقة تالفة)', authority: 'مركز الشرطة أو الحرس الوطني التابع لمكان الإقامة', sourceUrl: CIN_SOURCE },
    { title: 'جواز سفر عادي — أول طلب أو تجديد', description: 'طلب أو تجديد جواز السفر التونسي العادي. تختلف الوثائق والتعريفة حسب السن والوضعية.', documents: ['استمارة طلب معمرة وممضاة', 'نسخة من بطاقة التعريف مع الاستظهار بالأصل', '4 صور حديثة بخلفية بيضاء (3.5 × 4.5 صم)', 'ترخيص الولي للقاصر', 'ما يثبت الدراسة عند الاقتضاء', 'جواز السفر القديم عند التجديد', 'وصل خلاص معلوم الطابع'], delay: '15 يوماً', cost: 'حسب الوضعية: 25 أو 80 أو 150 د.ت', authority: 'مركز الشرطة أو الحرس الوطني المختص ترابياً', sourceUrl: PASSPORT_SOURCE },
    ...COPY.ar.procedures.slice(2).map((item, index) => index === 2 ? { ...item, formUrl: B3_SOURCE } : item),
  ],
  en: [
    { title: 'National ID card — first application', description: 'First application for a Tunisian national identity card.', documents: ['Completed and signed administrative form', 'Birth certificate issued within the last 3 months', 'Proof of Tunisian nationality', 'Proof of residence', 'Work, school or university certificate', '3 recent ID photos', 'Stamp-duty payment receipt'], delay: '15 days', cost: 'Current stamp duty', authority: 'Police or National Guard station for the place of residence', sourceUrl: CIN_SOURCE },
    { title: 'National ID card — renewal', description: 'Renewal following expiry, a change of information or damage to the card.', documents: ['Completed and signed administrative form', 'Birth certificate issued within the last 3 months', '3 recent ID photos', 'Previous identity card', 'Evidence of any declared change, where applicable', 'Stamp-duty payment receipt'], delay: '15 days', cost: '3 TND (intact card) / 25 TND (damaged card)', authority: 'Police or National Guard station for the place of residence', sourceUrl: CIN_SOURCE },
    { title: 'Ordinary passport — first application or renewal', description: 'Application or renewal of an ordinary Tunisian passport. Documents and fees vary by age and circumstances.', documents: ['Completed and signed application form', 'Copy of the identity card with the original presented', '4 recent photos on a white background (3.5 × 4.5 cm)', 'Legal guardian authorisation for a minor', 'Proof of student status, where applicable', 'Previous passport for a renewal', 'Stamp-duty payment receipt'], delay: '15 days', cost: 'Depending on circumstances: 25, 80 or 150 TND', authority: 'Territorially competent Police or National Guard station', sourceUrl: PASSPORT_SOURCE },
    ...COPY.en.procedures.slice(2).map((item, index) => index === 2 ? { ...item, formUrl: B3_SOURCE } : item),
  ],
  it: [
    { title: "Carta d'identità nazionale — prima richiesta", description: "Prima richiesta della carta d'identità nazionale tunisina.", documents: ['Modulo amministrativo compilato e firmato', 'Certificato di nascita rilasciato da meno di 3 mesi', 'Prova della nazionalità tunisina', 'Attestazione di residenza', 'Certificato di lavoro, scolastico o universitario', '3 foto tessera recenti', "Ricevuta di pagamento dell'imposta di bollo"], delay: '15 giorni', cost: 'Imposta di bollo vigente', authority: 'Posto di polizia o della Guardia nazionale del luogo di residenza', sourceUrl: CIN_SOURCE },
    { title: "Carta d'identità nazionale — rinnovo", description: 'Rinnovo per scadenza, modifica dei dati o deterioramento della carta.', documents: ['Modulo amministrativo compilato e firmato', 'Certificato di nascita rilasciato da meno di 3 mesi', '3 foto tessera recenti', "Vecchia carta d'identità", 'Prova della modifica dichiarata, se applicabile', "Ricevuta di pagamento dell'imposta di bollo"], delay: '15 giorni', cost: '3 TND (carta integra) / 25 TND (carta deteriorata)', authority: 'Posto di polizia o della Guardia nazionale del luogo di residenza', sourceUrl: CIN_SOURCE },
    { title: 'Passaporto ordinario — prima richiesta o rinnovo', description: "Richiesta o rinnovo del passaporto ordinario tunisino. Documenti e tariffa variano in base all'età e alla situazione.", documents: ['Modulo di richiesta compilato e firmato', "Copia della carta d'identità con presentazione dell'originale", '4 foto recenti su fondo bianco (3,5 × 4,5 cm)', 'Autorizzazione del tutore per un minore', 'Attestazione scolastica o universitaria, se applicabile', 'Vecchio passaporto in caso di rinnovo', "Ricevuta di pagamento dell'imposta di bollo"], delay: '15 giorni', cost: 'Secondo la situazione: 25, 80 o 150 TND', authority: 'Posto di polizia o della Guardia nazionale territorialmente competente', sourceUrl: PASSPORT_SOURCE },
    ...COPY.it.procedures.slice(2).map((item, index) => index === 2 ? { ...item, formUrl: B3_SOURCE } : item),
  ],
  ru: [
    { title: 'Национальное удостоверение личности — первая подача', description: 'Первичное получение национального удостоверения личности гражданина Туниса.', documents: ['Заполненная и подписанная административная форма', 'Свидетельство о рождении, выданное не более 3 месяцев назад', 'Подтверждение гражданства Туниса', 'Справка о месте жительства', 'Справка с работы, из школы или университета', '3 свежие фотографии', 'Квитанция об оплате гербового сбора'], delay: '15 дней', cost: 'Действующий гербовый сбор', authority: 'Отделение полиции или Национальной гвардии по месту жительства', sourceUrl: CIN_SOURCE },
    { title: 'Национальное удостоверение личности — продление', description: 'Продление при истечении срока, изменении данных или повреждении карты.', documents: ['Заполненная и подписанная административная форма', 'Свидетельство о рождении, выданное не более 3 месяцев назад', '3 свежие фотографии', 'Старое удостоверение личности', 'Подтверждение заявленного изменения, если применимо', 'Квитанция об оплате гербового сбора'], delay: '15 дней', cost: '3 TND (карта целая) / 25 TND (карта повреждена)', authority: 'Отделение полиции или Национальной гвардии по месту жительства', sourceUrl: CIN_SOURCE },
    { title: 'Обычный паспорт — первая подача или продление', description: 'Подача или продление обычного паспорта Туниса. Документы и сбор зависят от возраста и ситуации.', documents: ['Заполненная и подписанная форма', 'Копия удостоверения личности с предъявлением оригинала', '4 свежие фотографии на белом фоне (3,5 × 4,5 см)', 'Разрешение законного представителя для несовершеннолетнего', 'Подтверждение статуса учащегося, если применимо', 'Старый паспорт при продлении', 'Квитанция об оплате гербового сбора'], delay: '15 дней', cost: 'В зависимости от ситуации: 25, 80 или 150 TND', authority: 'Территориально компетентное отделение полиции или Национальной гвардии', sourceUrl: PASSPORT_SOURCE },
    ...COPY.ru.procedures.slice(2).map((item, index) => index === 2 ? { ...item, formUrl: B3_SOURCE } : item),
  ],
};

const UI_LABELS: Record<Lang, { close: string; verified: string; source: string; childProtection: string; seoTitle: string }> = {
  fr: { close: 'Fermer la démarche', verified: 'Informations vérifiées le 27 août 2026', source: 'Consulter la source officielle', childProtection: "Signalement à la protection de l'enfance", seoTitle: 'Services Citoyens en Tunisie | Dalil Tounes' },
  ar: { close: 'إغلاق الإجراء', verified: 'تم التحقق من المعلومات في 27 أوت 2026', source: 'الاطلاع على المصدر الرسمي', childProtection: 'الإبلاغ لمندوبي حماية الطفولة', seoTitle: 'خدمات المواطنين في تونس | دليل تونس' },
  en: { close: 'Close procedure', verified: 'Information verified on 27 August 2026', source: 'View the official source', childProtection: 'Report to child protection services', seoTitle: 'Citizen Services in Tunisia | Dalil Tounes' },
  it: { close: 'Chiudi la pratica', verified: 'Informazioni verificate il 27 agosto 2026', source: 'Consulta la fonte ufficiale', childProtection: 'Segnalazioni alla protezione dell’infanzia', seoTitle: 'Servizi al Cittadino in Tunisia | Dalil Tounes' },
  ru: { close: 'Закрыть процедуру', verified: 'Информация проверена 27 августа 2026 года', source: 'Открыть официальный источник', childProtection: 'Обращение в службу защиты детей', seoTitle: 'Государственные услуги в Тунисе | Dalil Tounes' },
};

const EMERGENCY_LABELS: Record<Lang, [string, string, string, string, string]> = {
  fr: ['SAMU', 'Protection civile', 'Police secours', 'Écoute et assistance aux enfants', 'Violences faites aux femmes'],
  ar: ['الإسعاف الطبي الاستعجالي', 'الحماية المدنية', 'شرطة النجدة', 'الإصغاء ومساعدة الأطفال', 'العنف ضد النساء'],
  en: ['Emergency medical service', 'Civil Protection', 'Police emergency', 'Child listening and assistance', 'Violence against women'],
  it: ['Emergenza sanitaria', 'Protezione civile', 'Polizia', 'Ascolto e assistenza ai minori', 'Violenza contro le donne'],
  ru: ['Скорая помощь', 'Гражданская защита', 'Полиция', 'Помощь детям', 'Насилие в отношении женщин'],
};

const SOCIAL_PROGRAMS: Record<Lang, Array<{ title: string; body: string }>> = {
  fr: [
    { title: 'Programme Amen Social', body: 'Aide financière directe aux familles en situation de vulnérabilité afin de soutenir un revenu minimum et l’accès aux services essentiels.' },
    { title: 'PNAFN — Programme national d’aide aux familles nécessiteuses', body: 'Allocations régulières et accompagnement social destinés aux familles répondant aux conditions du programme.' },
    { title: 'CNAM — Caisse nationale d’assurance maladie', body: 'Couverture des soins des assurés sociaux et de leurs ayants droit, selon les conditions en vigueur.' },
    { title: 'Allocations familiales', body: 'Aides financières versées par la CNSS aux familles avec enfants qui remplissent les conditions requises.' },
  ],
  ar: [
    { title: 'برنامج الأمان الاجتماعي', body: 'مساعدة مالية مباشرة للعائلات في وضعية هشاشة لدعم حد أدنى من الدخل والنفاذ إلى الخدمات الأساسية.' },
    { title: 'البرنامج الوطني لإعانة العائلات المعوزة', body: 'منح دورية ومرافقة اجتماعية للعائلات التي تستجيب لشروط البرنامج.' },
    { title: 'الصندوق الوطني للتأمين على المرض', body: 'تغطية علاج المضمونين الاجتماعيين ومنظوريهم حسب الشروط الجاري بها العمل.' },
    { title: 'المنح العائلية', body: 'مساعدات مالية يصرفها الصندوق الوطني للضمان الاجتماعي للعائلات التي تستجيب للشروط.' },
  ],
  en: [
    { title: 'Amen Social Programme', body: 'Direct financial support for vulnerable families to help secure a minimum income and access to essential services.' },
    { title: 'PNAFN — National programme for needy families', body: 'Regular allowances and social support for families meeting the programme’s eligibility conditions.' },
    { title: 'CNAM — National Health Insurance Fund', body: 'Healthcare coverage for insured people and their eligible dependants under the applicable conditions.' },
    { title: 'Family allowances', body: 'Financial support paid by the CNSS to families with children who meet the eligibility conditions.' },
  ],
  it: [
    { title: 'Programma Amen Social', body: 'Sostegno finanziario diretto alle famiglie vulnerabili per garantire un reddito minimo e l’accesso ai servizi essenziali.' },
    { title: 'PNAFN — Programma nazionale per le famiglie bisognose', body: 'Assegni regolari e accompagnamento sociale per le famiglie che soddisfano i requisiti del programma.' },
    { title: 'CNAM — Cassa nazionale di assicurazione malattia', body: 'Copertura sanitaria per gli assicurati e i familiari aventi diritto secondo le condizioni vigenti.' },
    { title: 'Assegni familiari', body: 'Aiuti finanziari versati dalla CNSS alle famiglie con figli che soddisfano i requisiti.' },
  ],
  ru: [
    { title: 'Программа Amen Social', body: 'Прямая финансовая помощь семьям в уязвимом положении для обеспечения минимального дохода и доступа к основным услугам.' },
    { title: 'PNAFN — Национальная программа помощи нуждающимся семьям', body: 'Регулярные пособия и социальное сопровождение для семей, отвечающих условиям программы.' },
    { title: 'CNAM — Национальная касса медицинского страхования', body: 'Медицинское страхование застрахованных лиц и их правообладателей в соответствии с действующими условиями.' },
    { title: 'Семейные пособия', body: 'Финансовая помощь семьям с детьми, выплачиваемая CNSS при соблюдении установленных условий.' },
  ],
};

const SERVICE_EXCLUDED_KEYWORDS = [
  'dentiste',
  'dentaire',
  'orthodont',
  'pharmacie',
  'clinique',
  'hopital',
  'hôpital',
  'laboratoire medical',
  'laboratoire médical',
  'location de voiture',
  'location voiture',
  'rent a car',
  'tendance car',
];

const OFFICIAL_LINKS = [
  { key: 'registry' as const, url: 'https://www.rne.tn' },
  { key: 'justice' as const, url: B3_SOURCE },
  { key: 'passport' as const, url: PASSPORT_SOURCE },
];

export default function CitizensServicesLocalized() {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as Lang;
  const c = COPY[lang];
  const procedures = VERIFIED_PROCEDURES[lang];
  const labels = UI_LABELS[lang];
  const isRTL = lang === 'ar';
  const [activeTab, setActiveTab] = useState<Tab>('bureaux');
  const [selectedProcedure, setSelectedProcedure] = useState<number | null>(null);
  const [samu, protection, police, children, women] = EMERGENCY_LABELS[lang];

  const emergencyNumbers = [
    { label: samu, number: '190', icon: Phone },
    { label: protection, number: '198', icon: Shield },
    { label: police, number: '197', icon: AlertCircle },
    { label: children, number: '1809', icon: Baby },
    { label: women, number: '1899', icon: Heart },
    { label: labels.childProtection, number: '192', icon: Shield },
  ];

  const procedure = selectedProcedure === null ? null : procedures[selectedProcedure];

  if (procedure) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <SEOHead
          title={`${procedure.title} | ${c.title} | Dalil Tounes`}
          description={procedure.description}
          canonical="https://dalil-tounes.com/citizens/services"
          currentPath="/citizens/services"
        />
        <div className="max-w-4xl mx-auto">
          <button type="button" onClick={() => setSelectedProcedure(null)} aria-label={labels.close} className="inline-flex items-center gap-2 mb-6 text-gray-500 hover:text-[#4A1D43]">
            <X className="w-4 h-4" /> {labels.close}
          </button>
          <div className="bg-white rounded-2xl border-2 border-[#D4AF37] shadow-lg p-6">
            <h1 className="text-3xl font-bold text-[#4A1D43] mb-4">{procedure.title}</h1>
            <p className="text-gray-700 leading-relaxed mb-6">{procedure.description}</p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <InfoCard icon={Clock} label={c.processingTime} value={procedure.delay} />
              <InfoCard icon={CheckCircle} label={c.cost} value={procedure.cost} />
            </div>
            <div className="mb-6">
              <h2 className="flex items-center gap-2 font-bold text-lg text-[#4A1D43] mb-3"><FileText className="w-5 h-5" />{c.requiredDocuments}</h2>
              <ul className="space-y-3">
                {procedure.documents.map((item) => <li key={item} className="flex items-start gap-3 text-gray-700"><CheckCircle className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />{item}</li>)}
              </ul>
            </div>
            <InfoCard icon={Building2} label={c.authority} value={procedure.authority} />
            {procedure.formUrl && <div className="mt-6"><a href={procedure.formUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#4A1D43] text-[#D4AF37] border border-[#D4AF37] font-semibold"><ExternalLink className="w-4 h-4" />{c.onlineForm}</a></div>}
            {procedure.sourceUrl && <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 text-sm"><span className="text-gray-600">{labels.verified}</span><a href={procedure.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-[#4A1D43] underline underline-offset-2"><ExternalLink className="w-4 h-4" />{labels.source}</a></div>}
            <div className="mt-5 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-900 flex items-start gap-2"><AlertCircle className="w-5 h-5 flex-shrink-0" />{c.warning}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead
        title={labels.seoTitle}
        description={c.intro}
        canonical="https://dalil-tounes.com/citizens/services"
        currentPath="/citizens/services"
      />
      <section className="relative h-[240px] overflow-hidden">
        <img src={getStructureImageUrl('/images/service-social.jpg')} alt={c.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D43]/90 via-[#4A1D43]/75 to-[#D4AF37]/30" />
        <div className="relative h-full flex items-center justify-center px-4 text-center text-white">
          <div className="max-w-4xl"><h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#D4AF37]">{c.title}</h1><p className="text-sm md:text-base leading-relaxed">{c.intro}</p></div>
        </div>
      </section>

      <section className="sticky top-[60px] z-10 px-4 py-2 bg-white border-b border-[#D4AF37] shadow-sm">
        <div className="max-w-5xl mx-auto flex gap-2 justify-center flex-wrap">
          <TabButton active={activeTab === 'bureaux'} onClick={() => setActiveTab('bureaux')} icon={Building2} label={c.tabs.offices} />
          <TabButton active={activeTab === 'demarches'} onClick={() => setActiveTab('demarches')} icon={FileText} label={c.tabs.procedures} />
          <TabButton active={activeTab === 'social'} onClick={() => setActiveTab('social')} icon={Heart} label={c.tabs.social} />
        </div>
      </section>

      {activeTab === 'bureaux' && (
        <>
          <section className="px-4 pt-8 pb-3">
            <div className="max-w-5xl mx-auto text-center">
              <Building2 className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-[#4A1D43]">{c.officesTitle}</h2>
              <p className="mt-2 text-gray-600">{c.officesIntro}</p>
            </div>
          </section>
          <section className="py-3 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-xl border border-[#D4AF37] p-3">
                <SearchBar
                  scope="services"
                  intentEnabled={false}
                  enabled
                  resultMode="redirectToResults"
                  preferredTitle={c.searchTitle}
                  preferredSubtitle={c.searchSubtitle}
                />
              </div>
            </div>
          </section>
          <section className="py-6 bg-white">
            <MeilleursSection
              secteurLabel={c.sector}
              listePage="services citoyens"
              accentColor="#4A1D43"
              sectionTitle={c.recommended}
              useGoogleRecommendationCriteria
              excludedKeywords={SERVICE_EXCLUDED_KEYWORDS}
              blogArticle={{ title: c.articleTitle, excerpt: c.articleExcerpt, slug: 'activites-en-famille' }}
            />
          </section>
        </>
      )}

      {activeTab === 'demarches' && <section className="px-4 py-8 bg-white"><div className="max-w-6xl mx-auto"><div className="text-center mb-6"><h2 className="text-2xl font-bold text-[#4A1D43]">{c.proceduresTitle}</h2><p className="mt-2 text-gray-600">{c.proceduresIntro}</p></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">{procedures.map((item, index) => <motion.button key={item.title} type="button" whileHover={{ y: -3 }} onClick={() => setSelectedProcedure(index)} className={`text-start bg-white rounded-xl border-2 border-[#D4AF37] p-4 hover:shadow-lg ${isRTL ? 'text-right' : 'text-left'}`}><h3 className="font-bold text-[#4A1D43] mb-2">{item.title}</h3><p className="text-gray-600 text-xs line-clamp-3 mb-3">{item.description}</p><div className="flex justify-between text-xs text-[#4A1D43]"><span>{item.documents.length} {c.pieces}</span><span>{item.delay}</span></div></motion.button>)}</div></div></section>}

      {activeTab === 'social' && <section className="px-4 py-8"><div className="max-w-5xl mx-auto"><div className="text-center mb-5"><h2 className="text-2xl font-bold text-[#4A1D43]">{c.socialTitle}</h2><p className="mt-2 text-gray-600">{c.socialIntro}</p></div><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">{emergencyNumbers.map(({ label, number, icon: Icon }) => <a key={number} href={`tel:${number}`} className="flex flex-col items-center justify-center rounded-xl bg-[#4A1D43] border border-[#D4AF37] p-3 text-center"><Icon className="w-5 h-5 text-[#D4AF37] mb-2" /><span className="text-xs text-white">{label}</span><strong className="text-lg text-[#D4AF37]">{number}</strong></a>)}</div><div className="mt-7 grid md:grid-cols-2 gap-3">{SOCIAL_PROGRAMS[lang].map((item) => <SocialCard key={item.title} title={item.title} body={item.body} />)}</div></div></section>}

      <section className="px-4 py-8 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-[#4A1D43] text-center mb-4">{c.usefulLinksTitle}</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {OFFICIAL_LINKS.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-[#D4AF37] bg-[#FFFDF6] p-4 text-sm font-semibold text-[#4A1D43] hover:bg-[#D4AF37]/10 transition-colors">
                <span>{c.officialLinks[link.key]}</span>
                <ExternalLink className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-4 bg-[#4A1D43] border-t border-[#D4AF37]"><p className="max-w-4xl mx-auto text-center text-sm text-[#D4AF37] font-medium">{c.together}</p></section>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: LucideIcon; label: string }) {
  return <button type="button" onClick={onClick} aria-pressed={active} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold border-2 transition ${active ? 'bg-[#4A1D43] text-[#D4AF37] border-[#D4AF37]' : 'bg-gray-100 text-gray-700 border-transparent'}`}><Icon className="w-4 h-4" />{label}</button>;
}

function InfoCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="rounded-xl border border-[#D4AF37] bg-[#FFFDF6] p-4"><div className="flex items-center gap-2 text-[#4A1D43] mb-2"><Icon className="w-5 h-5" /><strong>{label}</strong></div><p className="text-gray-800">{value}</p></div>;
}

function SocialCard({ title, body }: { title: string; body: string }) {
  return <div className="rounded-xl border border-[#D4AF37] bg-white p-4"><h3 className="font-bold text-[#4A1D43] mb-2">{title}</h3><p className="text-sm text-gray-700">{body}</p></div>;
}
