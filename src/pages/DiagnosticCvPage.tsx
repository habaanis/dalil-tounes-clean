import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type Lang = 'fr' | 'en' | 'ar';
type Recommendation = 'business' | 'portfolio' | 'both';
const copy = {"fr":{"language":"Langue","brand":"Dalil Tounes · Diagnostic interactif","multiple":"Plusieurs réponses possibles","instruction":"Choisissez une ou plusieurs réponses. « Tous ces choix » sélectionne les réponses compatibles.","all":"Tous ces choix","back":"← Retour","next":"Continuer →","show":"Voir mon résultat","done":"Votre diagnostic est terminé","matchOne":"pourrait vous correspondre","matchBoth":"peuvent vous correspondre","disclaimer":"Cette orientation présente les modèles disponibles, sans évaluer votre entreprise.","discover":"Découvrez les présentations","demoNotice":"Une véritable démonstration correspondant à ce modèle sera reliée après vérification.","actual":"Découvrir le CV Business Dalil Tounes ↗","ask":"Souhaitez-vous recevoir un exemple adapté à votre activité ?","yes":"Oui, recevoir un exemple","no":"Non, merci","request":"Recevoir un exemple personnalisé","notReady":"Le formulaire sécurisé n'est pas encore disponible. Aucune coordonnée n'est demandée ni enregistrée sur cette version.","privacy":"Confidentialité","thanks":"Merci d’avoir participé !","thanksBody":"Vous pouvez découvrir les modèles Dalil Tounes sans communiquer vos coordonnées.","review":"Revoir mon résultat","recommended":"Recommandé","question":"Question","both":"Les deux modèles","descB":"Vous souhaitez surtout présenter votre activité, vos services et faciliter les échanges.","descP":"Vous souhaitez mettre en avant vos produits et réalisations, tout en restant joignable.","descBoth":"Vous souhaitez présenter votre activité et montrer vos réalisations. Les deux modèles peuvent convenir.","demoB":"Présentation de l’activité, des services et des contacts.","demoP":"Une place importante pour les produits, photos et réalisations."},"en":{"language":"Language","brand":"Dalil Tounes · Interactive questionnaire","multiple":"Multiple answers allowed","instruction":"Select one or more answers. “All of these” selects compatible options.","all":"All of these","back":"← Back","next":"Continue →","show":"See my result","done":"Your questionnaire is complete","matchOne":"could suit you","matchBoth":"could suit you","disclaimer":"This guidance introduces available models; it is not an assessment of your business.","discover":"Explore the presentations","demoNotice":"A verified demonstration for this specific model will be linked here once available.","actual":"Explore Dalil Tounes CV Business ↗","ask":"Would you like an example tailored to your activity?","yes":"Yes, request an example","no":"No, thank you","request":"Request a personalized example","notReady":"The secure contact form is not yet available. No contact details are requested or saved in this version.","privacy":"Privacy","thanks":"Thank you for taking part!","thanksBody":"You can explore Dalil Tounes models without providing contact details.","review":"Review my result","recommended":"Recommended","question":"Question","both":"Both models","descB":"You mainly want to introduce your business, services and make contact easier.","descP":"You want to showcase products and work while remaining easy to reach.","descBoth":"You want to introduce your business and showcase your work. Either model may suit you.","demoB":"Business presentation, services and contact information.","demoP":"Focus on products, pictures and completed work."},"ar":{"language":"اللغة","brand":"دليل تونس · استبيان تفاعلي","multiple":"يمكن اختيار عدة إجابات","instruction":"اختر إجابة واحدة أو أكثر. خيار «جميع هذه الخيارات» يحدد الخيارات المتوافقة.","all":"جميع هذه الخيارات","back":"→ رجوع","next":"متابعة ←","show":"عرض النتيجة","done":"اكتمل الاستبيان","matchOne":"قد يناسب نشاطك","matchBoth":"قد يناسبان نشاطك","disclaimer":"تساعدك هذه النتيجة على التعرف على النموذجين، ولا تمثل تقييماً لمؤسستك.","discover":"اكتشف نماذج العرض","demoNotice":"ستُضاف هنا نسخة تجريبية موثوقة لهذا النموذج بعد التحقق من رابطها.","actual":"اكتشف CV Business من دليل تونس ↗","ask":"هل ترغب في الحصول على مثال مخصص لنشاطك؟","yes":"نعم، أريد مثالاً","no":"لا، شكراً","request":"طلب مثال مخصص","notReady":"استمارة الاتصال الآمنة غير متاحة بعد. لن نطلب أو نسجل بيانات اتصال في هذه النسخة.","privacy":"سياسة الخصوصية","thanks":"شكراً لمشاركتك!","thanksBody":"يمكنك اكتشاف نماذج دليل تونس دون مشاركة بيانات الاتصال.","review":"مراجعة النتيجة","recommended":"موصى به","question":"السؤال","both":"النموذجان","descB":"ترغب أساساً في تقديم نشاطك وخدماتك وتسهيل التواصل مع حرفائك.","descP":"ترغب في إبراز منتجاتك وأعمالك مع تسهيل التواصل معك.","descBoth":"ترغب في تقديم نشاطك وعرض أعمالك؛ وقد يناسبك كلا النموذجين.","demoB":"عرض النشاط والخدمات ووسائل الاتصال.","demoP":"مساحة أكبر للمنتجات والصور والأعمال المنجزة."}};

type ResultDetailCopy = {
  allTitle: string;
  allIntro: string;
  allFeatures: string[];
  modelsTitle: string;
  businessFocus: string[];
  portfolioFocus: string[];
  formulaTitle: string;
  formulaIntro: string;
  artisanTitle: string;
  artisanFeatures: string[];
  premiumTitle: string;
  premiumFeatures: string[];
  limitsNotice: string;
  usesTitle: string;
  usesIntro: string;
  useCases: string[];
  hesitationTitle: string;
  hesitationHelp: string;
  hesitationChoices: string[];
  directContact: string;
};
const resultDetails: Record<Lang, ResultDetailCopy> = {
  fr: {
    allTitle: 'Tout ce que votre CV professionnel peut proposer',
    allIntro: 'Le CV ne se limite pas à une photo et un numéro de téléphone : voici les possibilités de présentation, de contact et de partage.',
    allFeatures: [
      'Identité professionnelle : nom, métier, logo, photo de couverture, slogan et description de l’activité.',
      'Présentation détaillée du savoir-faire, des prestations, des services et des informations essentielles.',
      'Galerie de photos pour présenter les produits, chantiers, projets ou réalisations, avec possibilité d’agrandir les images.',
      'Vidéo de présentation de l’activité selon la formule choisie.',
      'Coordonnées : téléphone et bouton Appeler, WhatsApp et e-mail, lorsque ces informations sont fournies.',
      'Adresse, ville, zone d’intervention, horaires et bouton Itinéraire vers Google Maps, selon les données disponibles.',
      'Liens vers le site internet et les réseaux sociaux : Facebook, Instagram, LinkedIn, TikTok ou YouTube, selon la formule.',
      'Avis clients : possibilité de consulter les avis ou de donner un avis lorsque ces fonctions sont disponibles.',
      'Demande de devis ou réservation lorsque les coordonnées et les options correspondantes sont configurées.',
      'Bouton Ajouter aux contacts pour enregistrer les coordonnées dans le téléphone.',
      'Lien personnel partageable par message, e-mail, WhatsApp ou réseau social.',
      'QR Business à afficher sur le téléphone ou à imprimer sur des supports physiques, via son espace dédié.',
      'Accès rapide depuis une application pouvant être ajoutée à l’écran d’accueil du téléphone.',
      'Choix entre CV Business et CV Portfolio, avec des palettes Vert Prestige, Ivoire & Or ou Bleu Nuit & Champagne.',
      'Présentation adaptée au mobile, avec des langues comme le français, l’anglais et l’arabe selon les contenus disponibles.',
    ],
    modelsTitle: 'Deux présentations possibles',
    businessFocus: ['Présentation structurée de l’entreprise et du parcours.', 'Mise en avant des services, des informations utiles et des actions de contact.', 'Idéal pour expliquer rapidement ce que vous proposez.'],
    portfolioFocus: ['Présentation plus visuelle, centrée sur les photos et les réalisations.', 'Galeries de travaux, produits et projets pour illustrer le savoir-faire.', 'Idéal pour montrer des exemples concrets de votre travail.'],
    formulaTitle: 'Ce qui dépend de votre formule',
    formulaIntro: 'Le modèle (Business ou Portfolio) change la présentation. La formule choisie détermine les limites et certaines fonctionnalités.',
    artisanTitle: 'Formule Artisan',
    artisanFeatures: ['Jusqu’à 5 photos.', 'Pas de vidéo de présentation intégrée.', 'Jusqu’à 2 liens de réseaux sociaux.', 'Pas de réservation intégrée dans cette formule.'],
    premiumTitle: 'Formule Premium',
    premiumFeatures: ['Jusqu’à 10 photos.', 'Jusqu’à 1 vidéo de présentation.', 'Davantage de liens de réseaux sociaux.', 'Réservation possible lorsqu’elle est configurée.'],
    limitsNotice: 'Les fonctions affichées sur un CV dépendent de la formule, des informations transmises et des options configurées. Un bouton non configuré n’est pas présenté comme un service actif.',
    usesTitle: 'Ce que vous pouvez concrètement faire avec votre CV',
    usesIntro: 'Quelques situations du quotidien, sans devoir créer un site internet ni demander à vos clients d’installer une application pour consulter votre présentation.',
    useCases: [
      'Pendant un rendez-vous : montrer votre QR Business depuis votre téléphone.',
      'Sur WhatsApp : envoyer votre lien à un client qui vous demande des informations.',
      'Sur une carte de visite, un devis, un flyer, un comptoir ou une vitrine : imprimer le QR Business.',
      'Sur Instagram ou Facebook : partager votre lien pour présenter votre activité au-delà d’une simple publication.',
      'Pour présenter votre savoir-faire : envoyer une galerie de réalisations à un client ou un partenaire.',
      'Pour faciliter le contact : permettre un appel, un message, un e-mail ou un itinéraire en quelques gestes.',
      'Pour rester accessible : proposer l’ajout du CV à l’écran d’accueil et des coordonnées aux contacts.',
      'Pour rassurer : montrer vos informations, vos horaires et les avis disponibles.',
    ],
    hesitationTitle: 'Qu’est-ce qui vous aiderait à passer à l’action ?',
    hesitationHelp: 'Question facultative, plusieurs réponses possibles.',
    hesitationChoices: ['Voir un exemple adapté à mon métier', 'Comprendre exactement ce qui est inclus', 'Connaître le prix et les modalités', 'Parler directement à une personne', 'Je suis intéressé, mais pas maintenant'],
    directContact: 'Poser une question sans paiement',
  },
  en: {
    allTitle: 'Everything your professional CV can offer',
    allIntro: 'This is more than a photo and phone number. Explore the presentation, contact and sharing possibilities.',
    allFeatures: [
      'Professional identity: business name, trade, logo, cover photo, tagline and business description.',
      'A detailed introduction to your expertise, services and key information.',
      'Photo gallery for products, projects and completed work, with image zoom.',
      'Business presentation video depending on the selected plan.',
      'Phone and Call button, WhatsApp and email when these details are provided.',
      'Address, city, service area, business hours and Google Maps directions when available.',
      'Website and social media links: Facebook, Instagram, LinkedIn, TikTok or YouTube, depending on the plan.',
      'Customer reviews: view reviews or leave a review where supported.',
      'Quote requests or bookings when the relevant contact options are configured.',
      'Add to contacts button to save business details on a phone.',
      'Personal link to share by message, email, WhatsApp or social media.',
      'Business QR code to display on your phone or print on physical materials, through a dedicated QR space.',
      'Quick access through an app that can be added to a phone home screen.',
      'Business or Portfolio layouts, with Prestige Green, Ivory & Gold or Midnight Blue & Champagne palettes.',
      'Mobile-friendly presentation, with languages including French, English and Arabic when content is available.',
    ],
    modelsTitle: 'Two ways to present your activity',
    businessFocus: ['Structured introduction to your business and professional background.', 'A clear focus on services, practical details and contact actions.', 'Suited to explaining your offer quickly.'],
    portfolioFocus: ['A more visual layout centred on photos and completed work.', 'Galleries of projects, products and work to demonstrate expertise.', 'Suited to showing real examples of what you do.'],
    formulaTitle: 'What depends on the plan',
    formulaIntro: 'Business or Portfolio determines the layout. Your plan determines limits and some capabilities.',
    artisanTitle: 'Artisan plan',
    artisanFeatures: ['Up to 5 photos.', 'No integrated presentation video.', 'Up to 2 social network links.', 'No integrated booking in this plan.'],
    premiumTitle: 'Premium plan',
    premiumFeatures: ['Up to 10 photos.', 'Up to 1 presentation video.', 'More social network links.', 'Booking when configured.'],
    limitsNotice: 'Available functions depend on your plan, the details you provide and what is configured. An unconfigured action is not presented as an active service.',
    usesTitle: 'What you can actually do with your CV',
    usesIntro: 'Practical examples, without building a traditional website or requiring customers to install an app to view your profile.',
    useCases: [
      'At a meeting: show your Business QR code on your phone.',
      'On WhatsApp: send a link to customers asking for information.',
      'On a business card, quotation, flyer, counter or shop window: print your QR code.',
      'On Instagram or Facebook: share a link with a fuller picture of your activity.',
      'To show your expertise: send project and work galleries to clients or partners.',
      'To make contact easy: offer calling, messaging, email or directions.',
      'To stay accessible: add the CV to a home screen and the details to phone contacts.',
      'To build trust: display practical information, hours and available reviews.',
    ],
    hesitationTitle: 'What would help you take the next step?',
    hesitationHelp: 'Optional; select more than one if you like.',
    hesitationChoices: ['See an example for my trade', 'Understand exactly what is included', 'Know the price and conditions', 'Talk directly with someone', 'Interested, but not right now'],
    directContact: 'Ask a question without payment',
  },
  ar: {
    allTitle: 'جميع الإمكانيات التي يمكن أن يوفرها ملفك المهني',
    allIntro: 'ملفك المهني ليس مجرد صورة ورقم هاتف؛ اكتشف إمكانيات التعريف بنشاطك والتواصل والمشاركة.',
    allFeatures: [
      'الهوية المهنية: اسم المؤسسة والمهنة والشعار وصورة الغلاف والعبارة التعريفية ووصف النشاط.',
      'التعريف بالتجربة المهنية والخدمات والاختصاصات والمعلومات الأساسية.',
      'معرض صور للمنتجات والمشاريع والأعمال المنجزة مع إمكانية تكبير الصور.',
      'فيديو تعريفي بالنشاط حسب الصيغة المختارة.',
      'وسائل الاتصال: زر الاتصال الهاتفي وواتساب والبريد الإلكتروني عند توفير البيانات.',
      'العنوان والمدينة ومناطق التدخل وأوقات العمل وزر الاتجاهات عبر خرائط Google عند توفر المعلومات.',
      'روابط الموقع الإلكتروني وشبكات التواصل: فيسبوك وإنستغرام ولينكدإن وتيك توك ويوتيوب حسب الصيغة.',
      'آراء الحرفاء: الاطلاع على الآراء أو ترك رأي عند توفر هذه الإمكانيات.',
      'طلب عرض سعر أو الحجز عند تهيئة خيارات الاتصال والخدمات المناسبة.',
      'زر إضافة بيانات المؤسسة إلى جهات الاتصال على الهاتف.',
      'رابط شخصي يمكن مشاركته عبر الرسائل والبريد الإلكتروني وواتساب والشبكات الاجتماعية.',
      'رمز QR Business يمكن عرضه على الهاتف أو طباعته على وسائل ورقية من خلال فضائه المخصص.',
      'وصول سريع عبر تطبيق يمكن إضافته إلى الشاشة الرئيسية للهاتف.',
      'الاختيار بين CV Business وCV Portfolio، مع ألوان الأخضر الفاخر أو العاجي والذهبي أو الأزرق الليلي والشمبانيا.',
      'عرض مناسب للهاتف وبلغات منها الفرنسية والإنجليزية والعربية عند توفر المحتوى.',
    ],
    modelsTitle: 'طريقتان لعرض نشاطك',
    businessFocus: ['تقديم منظم للمؤسسة والخبرة المهنية.', 'التركيز على الخدمات والمعلومات العملية وأزرار الاتصال.', 'مناسب لشرح نشاطك بسرعة ووضوح.'],
    portfolioFocus: ['تصميم بصري يبرز الصور والأعمال المنجزة.', 'معارض للمشاريع والمنتجات والأعمال لإظهار خبرتك.', 'مناسب لعرض أمثلة حقيقية من أعمالك.'],
    formulaTitle: 'إمكانيات تختلف حسب الصيغة',
    formulaIntro: 'يحدد النموذج Business أو Portfolio شكل العرض، أما الصيغة فتحدد الحدود وبعض الإمكانيات.',
    artisanTitle: 'صيغة Artisan',
    artisanFeatures: ['حتى 5 صور.', 'دون فيديو تعريفي مدمج.', 'حتى رابطين للشبكات الاجتماعية.', 'دون حجز مدمج في هذه الصيغة.'],
    premiumTitle: 'صيغة Premium',
    premiumFeatures: ['حتى 10 صور.', 'حتى فيديو تعريفي واحد.', 'عدد أكبر من روابط الشبكات الاجتماعية.', 'إمكانية الحجز إذا تمت تهيئتها.'],
    limitsNotice: 'تعتمد الإمكانيات الظاهرة على الصيغة المختارة والمعلومات المقدمة والإعدادات المفعلة. لا يُعرض أي زر غير مهيأ على أنه خدمة جاهزة.',
    usesTitle: 'كيف يمكنك الاستفادة من ملفك المهني عملياً؟',
    usesIntro: 'أمثلة من الحياة اليومية، دون الحاجة إلى إنشاء موقع تقليدي أو إلزام الحرفاء بتثبيت تطبيق لعرض الملف.',
    useCases: [
      'أثناء لقاء مهني: اعرض رمز QR Business على هاتفك.',
      'عبر واتساب: أرسل الرابط إلى حريف يطلب معلومات عن خدماتك.',
      'على بطاقة عمل أو عرض سعر أو منشور أو واجهة محل: اطبع رمز QR.',
      'على فيسبوك وإنستغرام: شارك الرابط لتقديم نشاطك بشكل أوضح.',
      'لإبراز خبرتك: أرسل معرض أعمالك ومشاريعك إلى حريف أو شريك.',
      'لتسهيل التواصل: أتح الاتصال والرسائل والبريد الإلكتروني والاتجاهات.',
      'للوصول السريع: أضف الملف إلى الشاشة الرئيسية واحفظ بيانات الاتصال.',
      'لتعزيز الثقة: اعرض معلوماتك وأوقات العمل والآراء المتوفرة.',
    ],
    hesitationTitle: 'ما الذي يساعدك على اتخاذ الخطوة التالية؟',
    hesitationHelp: 'سؤال اختياري، يمكنك اختيار أكثر من إجابة.',
    hesitationChoices: ['رؤية مثال مناسب لمهنتي', 'فهم جميع الخدمات المشمولة', 'معرفة السعر والشروط', 'التحدث مباشرة مع شخص', 'أنا مهتم ولكن ليس الآن'],
    directContact: 'طرح سؤال دون دفع',
  },
};


const introCopy: Record<Lang, {title:string;desc:string;time:string;free:string}> = {
  fr: {
    title: 'Quel CV professionnel correspond à votre activité ?',
    desc: 'Répondez à six questions simples pour découvrir le CV Business, le CV Portfolio ou les deux. Un choix à la fois, plusieurs réponses possibles.',
    time: '6 questions rapides',
    free: 'Gratuit et sans engagement',
  },
  en: {
    title: 'Which professional CV suits your activity?',
    desc: 'Answer six simple questions to discover Business CV, Portfolio CV or both. One question at a time, multiple answers possible.',
    time: '6 quick questions',
    free: 'Free, no commitment',
  },
  ar: {
    title: 'أي ملف مهني يناسب نشاطك؟',
    desc: 'أجب عن ستة أسئلة بسيطة لاكتشاف CV Business أو CV Portfolio أو كليهما. سؤال واحد في كل مرحلة مع إمكانية اختيار عدة إجابات.',
    time: '6 أسئلة سريعة',
    free: 'مجاني ودون التزام',
  },
};

type Questionnaire = {fr:string[]; en:string[]; ar:string[]; exclusive?:number};
const questions: Questionnaire[] = [{"fr":["Comment présentez-vous votre activité aujourd’hui ?","Bouche-à-oreille","Réseaux sociaux","Site internet","Carte de visite","Pas encore"],"en":["How do you currently present your business?","Word of mouth","Social media","Website","Business card","Not yet"],"ar":["كيف تقدم نشاطك حالياً؟","التوصيات الشفهية","شبكات التواصل الاجتماعي","موقع إلكتروني","بطاقة عمل","ليس بعد"],"exclusive":4},{"fr":["Qu’aimeriez-vous faciliter pour vos clients ?","Me contacter","Comprendre mes services","Voir mon travail","Me localiser","Consulter les avis"],"en":["What would you like to make easier for customers?","Contact me","Understand my services","See my work","Find my location","Read reviews"],"ar":["ما الذي تريد تسهيله على حرفائك؟","التواصل معي","فهم خدماتي","مشاهدة أعمالي","العثور على موقعي","الاطلاع على التقييمات"]},{"fr":["Qu’avez-vous surtout envie de montrer ?","Mon activité","Mes services","Mes réalisations","Mes produits","Mes références"],"en":["What do you most want to showcase?","My business","My services","My work","My products","My references"],"ar":["ما الذي ترغب في إبرازه بشكل أساسي؟","نشاطي","خدماتي","أعمالي المنجزة","منتجاتي","مراجعي المهنية"]},{"fr":["Qu’utilisez-vous déjà pour présenter votre travail ?","Photos","Vidéos","Exemples de projets","Présentation écrite","Pas encore de contenu"],"en":["What content do you already use?","Photos","Videos","Project examples","Written introduction","No content yet"],"ar":["ما المحتوى الذي تستخدمه حالياً للتعريف بعملك؟","صور","فيديوهات","أمثلة لمشاريع","نبذة مكتوبة","لا أملك محتوى بعد"],"exclusive":4},{"fr":["Comment aimeriez-vous partager votre présentation ?","Lien direct","QR Business","WhatsApp","E-mail","Réseaux sociaux"],"en":["How would you like to share your presentation?","Direct link","QR Business","WhatsApp","Email","Social media"],"ar":["كيف ترغب في مشاركة ملفك المهني؟","رابط مباشر","رمز QR Business","واتساب","البريد الإلكتروني","شبكات التواصل الاجتماعي"]},{"fr":["Que souhaitez-vous découvrir maintenant ?","Voir un exemple","Recevoir un exemple adapté","Mieux comprendre","Pas maintenant"],"en":["What would you like to do next?","See an example","Request a tailored example","Learn more","Not now"],"ar":["ماذا ترغب في اكتشافه الآن؟","مشاهدة مثال","طلب مثال مخصص","معرفة المزيد","ليس الآن"],"exclusive":3}];
const recommend = (values: number[]): Recommendation => {
  const b = (values.includes(0) ? 2 : 0) + (values.includes(1) ? 2 : 0) + (values.includes(4) ? 1 : 0);
  const p = (values.includes(2) ? 2 : 0) + (values.includes(3) ? 2 : 0) + (values.includes(4) ? 1 : 0);
  return b - p >= 2 ? 'business' : p - b >= 2 ? 'portfolio' : 'both';
};
function emit(event: string, detail: Record<string,string|number> = {}) {
  const source = new URLSearchParams(window.location.search).get('utm_source') || 'direct';
  const payload = {event:'dalil_diagnostic_' + event, source, ...detail};
  window.dispatchEvent(new CustomEvent('dalil:diagnostic',{detail:payload}));
  const layer = (window as Window & {dataLayer?: Record<string,string|number>[]}).dataLayer;
  if (Array.isArray(layer)) layer.push(payload);
}
export default function DiagnosticCvPage() {
  const [lang, setLang] = useState<Lang>(() => {
    const param = new URLSearchParams(window.location.search).get('lang');
    return param === 'ar' || param === 'en' ? param : 'fr';
  });
  const t = copy[lang];
  const intro = introCopy[lang];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[][]>(() => questions.map(() => []));
  const [view, setView] = useState<'questions'|'result'|'request'|'thanks'>('questions');
  const [hesitations, setHesitations] = useState<number[]>([]);
  const rd = resultDetails[lang];
  const started = useRef(false);
  useEffect(() => { emit('view',{language:lang}); }, [lang]);
  const selection = answers[step];
  const current = questions[step];
  const eligible = current[lang].slice(1).map((_,i)=>i).filter(i=>i!==current.exclusive);
  const allChecked = eligible.every(i=>selection.includes(i)) && !selection.includes(current.exclusive ?? -1);
  const result = useMemo(() => recommend(answers[2]),[answers]);
  function toggle(i:number) {
    if (!started.current) {started.current=true;emit('start',{language:lang});}
    setAnswers(prev => prev.map((row,n) => {
      if(n!==step) return row;
      if(i===-1) return allChecked ? [] : eligible;
      if(i===current.exclusive) return row.includes(i)?[]:[i];
      return row.includes(i)?row.filter(x=>x!==i):[...row.filter(x=>x!==current.exclusive),i];
    }));
  }
  function next() {
    emit('question_completed',{question:step+1,language:lang});
    if(step===5) {emit('completed',{recommendation:result,language:lang});setView('result');}
    else setStep(x=>x+1);
  }
  const resultTitle = result==='business'?'CV Business':result==='portfolio'?'CV Portfolio':t.both;
  const summary = result==='business'?t.descB:result==='portfolio'?t.descP:t.descBoth;
  return <main className="dt-diagnostic" dir={lang==='ar'?'rtl':'ltr'} lang={lang}>
    <style>{`
      .dt-diagnostic{font-family:inherit;min-height:75vh;padding:38px 14px;color:#3b2022;background:#fffdfa8ef}
      .dt-diagnostic .panel{max-width:720px;margin:0 auto;padding:clamp(20px,5vw,40px);border-radius:20px;background:#fffdfa;border:1px solid #edddcb}
      .dt-diagnostic h1{font-size:clamp(24px,4vw,36px);line-height:1.3;margin:15px 0}
      .dt-diagnostic p{line-height:1.65}.dt-diagnostic .muted{color:#74635b;font-size:14px}
      .dt-diagnostic .top{display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap}
      .dt-diagnostic .top select{background:#fffdfa;color:inherit;border:1px solid #cbbcaf;border-radius:9px;padding:9px}
      .dt-diagnostic .progress{display:flex;gap:6px;margin:24px 0}
      .dt-diagnostic .progress span{height:7px;flex:1;border-radius:8px;background:#ecdcc9}
      .dt-diagnostic .progress span.active{background:#b51c2f}
      .dt-diagnostic .options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:24px 0}
      .dt-diagnostic button{font:inherit;cursor:pointer}
      .dt-diagnostic .choice{background:white;color:inherit;border:1px solid #decbbf;border-radius:11px;min-height:62px;padding:14px;text-align:start}
      .dt-diagnostic .choice[aria-pressed=true]{background:#fff0e5;border-color:#b51c2f;font-weight:700}
      .dt-diagnostic .choice.all{grid-column:1/-1}
      .dt-diagnostic .actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
      .dt-diagnostic .action{padding:13px 20px;border-radius:10px;border:1px solid #b51c2f;background:#b51c2f;color:white;text-decoration:none}
      .dt-diagnostic .action.alt{color:#b51c2f;background:transparent}
      .dt-diagnostic button:disabled{opacity:.45;cursor:not-allowed}
      .dt-diagnostic :focus-visible{outline:3px solid #dcb466;outline-offset:2px}
      .dt-diagnostic .demo{border:1px solid #edddcb;border-radius:12px;padding:15px;margin:12px 0}
      .dt-diagnostic .result-section{padding:20px 0;border-top:1px solid #e9d8c5;margin-top:24px}
      .dt-diagnostic .result-section h2{font-size:clamp(19px,3vw,24px);line-height:1.3;margin:0 0 12px;font-weight:750}
      .dt-diagnostic .result-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      .dt-diagnostic .result-card{border:1px solid #ead6c7;border-radius:12px;padding:16px;background:#fff9f0}
      .dt-diagnostic .result-card h3{font-size:18px;font-weight:750;margin:0 0 9px}
      .dt-diagnostic .result-list{margin:12px 0;padding-inline-start:23px;display:grid;gap:10px;line-height:1.55;font-size:14px}
      .dt-diagnostic .result-list li::marker{color:#b51c2f}
      .dt-diagnostic .hesitations{display:grid;grid-template-columns:1fr;gap:8px;margin:12px 0}
      .dt-diagnostic .hesitation-choice{display:flex;align-items:center;gap:10px;text-align:start;background:#fffdfa;border:1px solid #ddc8bd;border-radius:10px;padding:12px;color:inherit}
      .dt-diagnostic .hesitation-choice[aria-pressed=true]{border-color:#b51c2f;background:#fff0e5;font-weight:650}
      @media(max-width:540px){.dt-diagnostic .result-grid{grid-template-columns:1fr}}
      @media(max-width:540px){.dt-diagnostic .options{grid-template-columns:1fr}.dt-diagnostic .action{flex:1}}

      .dt-diagnostic{background:radial-gradient(circle at 88% 1%, #fff0da 0, transparent 48%),linear-gradient(180deg,#fff8ed 0%,#fff5e8 100%);padding:clamp(16px,4vw,38px) 14px 64px;color:#3b2022}
      .dt-diagnostic .panel{max-width:840px;box-shadow:0 18px 55px #632f2310;border-color:#eed7bf}
      .dt-diagnostic .brand-lockup{display:flex;align-items:center;gap:10px;min-width:0}
      .dt-diagnostic .brand-logo{height:62px;width:auto;max-width:210px;object-fit:contain}
      .dt-diagnostic .top{padding-bottom:16px;border-bottom:1px solid #f2e1d0}
      .dt-diagnostic .top label{font-size:13px;font-weight:650;color:#6b4243}
      .dt-diagnostic .top select{min-height:40px;border:1px solid #d7c0ab}
      .dt-diagnostic .welcome-strip{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:17px 22px 13px;margin-top:20px;border-radius:15px;background:linear-gradient(105deg,#fff0e0,#fff9ee);border:1px solid #f3dfc6}
      .dt-diagnostic .welcome-strip .intro-copy{max-width:580px}
      .dt-diagnostic .welcome-strip h2{font-weight:800;font-size:clamp(19px,3.6vw,26px);margin:8px 0;color:#681e2c;line-height:1.3}
      .dt-diagnostic .welcome-strip p{font-size:14px;color:#6b4c48;line-height:1.5;margin:5px 0}
      .dt-diagnostic .intro-badges{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}
      .dt-diagnostic .intro-badges span{font-size:12px;padding:6px 10px;border-radius:50px;background:#fffdf7;color:#793d29;border:1px solid #eed9c0;font-weight:650}
      .dt-diagnostic .mascot{height:130px;width:124px;object-fit:contain;flex-shrink:0}
      .dt-diagnostic .choice{background:#fff;color:#3b2022;box-shadow:0 2px 6px #6f382008;transition:border-color .15s,background .15s}
      .dt-diagnostic .choice:hover{border-color:#b51c2f;background:#fff7ee}
      .dt-diagnostic .choice[aria-pressed=true]{background:#fff0e6;border-color:#b51c2f;color:#8d1526}
      .dt-diagnostic .action{background:#b51c2f;border-color:#b51c2f;color:#fff;display:inline-flex;align-items:center;justify-content:center;text-align:center;font-weight:700;min-height:48px;box-shadow:0 3px 6px #79282d17}
      .dt-diagnostic .action.alt{background:#fffdf9;color:#9c2232;border-color:#c44149}
      .dt-diagnostic .action:hover:not(:disabled){filter:brightness(.96)}
      .dt-diagnostic .progress span.active{background:#b51c2f}
      .dt-diagnostic h1{color:#3b2022;font-weight:800}
      .dt-diagnostic .result-section h2{color:#761c2a}
      .dt-diagnostic .result-list li::marker{color:#b51c2f}
      .dt-diagnostic .result-card{background:#fffaf3}
      @media(max-width:540px){
        .dt-diagnostic .top{align-items:flex-start}
        .dt-diagnostic .brand-logo{height:52px;max-width:155px}
        .dt-diagnostic .welcome-strip{padding:14px 12px}
        .dt-diagnostic .mascot{height:92px;width:80px}
        .dt-diagnostic .welcome-strip h2{font-size:19px}
        .dt-diagnostic .intro-badges span{font-size:11px}
        .dt-diagnostic .panel{padding:18px}
      }
    `}</style>
    <div className="panel">
      <div className="top"><div className="brand-lockup"><img className="brand-logo" src="/images/logo_dalil_tounes_crop.png" alt="Dalil Tounes" /></div><label>{t.language} <select aria-label={t.language} value={lang} onChange={e=>setLang(e.target.value as Lang)}><option value="fr">Français</option><option value="en">English</option><option value="ar">العربية</option></select></label></div>
      {view==='questions'?<>
        <div className="welcome-strip">
          <div className="intro-copy">
            <h2>{intro.title}</h2>
            <p>{intro.desc}</p>
            <div className="intro-badges"><span>✓ {intro.time}</span><span>✓ {intro.free}</span></div>
          </div>
          <img className="mascot" src="/images/mascotte-dalil-transparent.webp" alt="" aria-hidden="true" width="124" height="130" decoding="async" />
        </div>
        <div className="progress" aria-label={t.question+' '+(step+1)+' / 6'}>{questions.map((_,i)=><span key={i} className={i<=step?'active':''}/>)}</div>
        <p className="muted">{t.question} {step+1} / 6 · {t.multiple}</p>
        <h1>{current[lang][0]}</h1><p className="muted">{t.instruction}</p>
        <div className="options">{current[lang].slice(1).map((label,i)=><button type="button" key={i} className="choice" aria-pressed={selection.includes(i)} onClick={()=>toggle(i)}>{selection.includes(i)?'✓ ':''}{label}</button>)}
        <button type="button" className="choice all" aria-pressed={allChecked} onClick={()=>toggle(-1)}>✓ {t.all}</button></div>
        <div className="actions"><button type="button" className="action alt" disabled={step===0} onClick={()=>setStep(i=>i-1)}>{t.back}</button><button type="button" className="action" disabled={!selection.length} onClick={next}>{step===5?t.show:t.next}</button></div>
      </>:view==='result'?<>
        <p className="muted">{t.done}</p><h1>{resultTitle} {result==='both'?t.matchBoth:t.matchOne}</h1><p>{summary}</p><p className="muted">{t.disclaimer}</p><div className="actions"><a href="/cv-business" target="_blank" rel="noopener noreferrer" className="action alt" onClick={()=>emit('demo_opened',{demo:'cv-business-dalil',language:lang})}>{t.actual}</a><Link to="/contact" className="action" onClick={()=>emit('contact_opened',{language:lang,source:'diagnostic_result_top'})}>{rd.directContact}</Link></div><h2>{t.discover}</h2>
        {(['business','portfolio'] as const).map((model,i)=><div className="demo" key={model}><strong>{i===0?'CV Business':'CV Portfolio'} {result===model?'· '+t.recommended:''}</strong><p>{i===0?t.demoB:t.demoP}</p><p className="muted">{t.demoNotice}</p></div>)}

        <section className="result-section" aria-labelledby="dt-diagnostic-all-features">
          <h2 id="dt-diagnostic-all-features">{rd.allTitle}</h2>
          <p>{rd.allIntro}</p>
          <ul className="result-list">{rd.allFeatures.map((item,i)=><li key={i}>{item}</li>)}</ul>
        </section>
        <section className="result-section">
          <h2>{rd.modelsTitle}</h2>
          <div className="result-grid">
            <div className="result-card"><h3>CV Business</h3><ul className="result-list">{rd.businessFocus.map((item,i)=><li key={i}>{item}</li>)}</ul></div>
            <div className="result-card"><h3>CV Portfolio</h3><ul className="result-list">{rd.portfolioFocus.map((item,i)=><li key={i}>{item}</li>)}</ul></div>
          </div>
        </section>
        <section className="result-section">
          <h2>{rd.formulaTitle}</h2><p>{rd.formulaIntro}</p>
          <div className="result-grid">
            <div className="result-card"><h3>{rd.artisanTitle}</h3><ul className="result-list">{rd.artisanFeatures.map((item,i)=><li key={i}>{item}</li>)}</ul></div>
            <div className="result-card"><h3>{rd.premiumTitle}</h3><ul className="result-list">{rd.premiumFeatures.map((item,i)=><li key={i}>{item}</li>)}</ul></div>
          </div>
          <p className="muted">{rd.limitsNotice}</p>
        </section>
        <section className="result-section">
          <h2>{rd.usesTitle}</h2><p>{rd.usesIntro}</p>
          <ul className="result-list">{rd.useCases.map((item,i)=><li key={i}>{item}</li>)}</ul>
        </section>
        <section className="result-section">
          <h2>{rd.hesitationTitle}</h2><p className="muted">{rd.hesitationHelp}</p>
          <div className="hesitations">
            {rd.hesitationChoices.map((item,i)=><button type="button" key={i} className="hesitation-choice" aria-pressed={hesitations.includes(i)} onClick={()=>setHesitations(prev=>prev.includes(i)?prev.filter(v=>v!==i):[...prev,i])}>{hesitations.includes(i)?'✓ ':''}{item}</button>)}
          </div>
        </section>

        <p><a href="/cv-business" target="_blank" rel="noopener noreferrer" onClick={()=>emit('demo_opened',{demo:'cv-business-dalil',language:lang})}>{t.actual}</a></p>
        <p><Link to="/contact" className="action alt" onClick={()=>emit('contact_opened',{language:lang,source:'diagnostic_result'})}>{rd.directContact}</Link></p>
        <h2>{t.ask}</h2><div className="actions"><Link to="/contact" className="action" onClick={()=>{emit('request_yes',{language:lang,hesitations:hesitations.join(',')});emit('contact_opened',{language:lang,source:'diagnostic_request'});}}>{t.yes}</Link><button type="button" className="action alt" onClick={()=>{emit('request_no',{language:lang,hesitations:hesitations.join(',')});setView('thanks');}}>{t.no}</button></div>
      </>:view==='request'?<>
        <h1>{t.request}</h1><p>{t.notReady}</p><p><Link to="/politique-confidentialite">{t.privacy}</Link></p>
        <p><Link to="/contact" className="action" onClick={()=>emit('contact_opened',{language:lang,source:'diagnostic_request'})}>{rd.directContact}</Link></p>
        <button type="button" className="action alt" onClick={()=>setView('result')}>{t.back}</button>
      </>:<>
        <h1>{t.thanks}</h1><p>{t.thanksBody}</p><button type="button" className="action" onClick={()=>setView('result')}>{t.review}</button>
      </>}
    </div>
  </main>;
}
