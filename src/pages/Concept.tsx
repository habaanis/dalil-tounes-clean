import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Search } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { LazyImage } from '../components/LazyImage';
import StructuredData from '../components/StructuredData';
import Breadcrumb from '../components/seo/Breadcrumb';
import { useHreflangPath } from '../hooks/useHreflangPath';
import { GuideMascot } from '../components/GuideMascot';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../lib/i18n';

type ConceptCopy = {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  heroTitleBefore: string;
  heroTitleAfter: string;
  heroDescription: string;
  heroAlt: string;
  mascotTitle: string;
  mascotMessage: string;
  pathsTitle: string;
  citizenLabel: string;
  professionalLabel: string;
  howTitle: string;
  visionTitle: string;
  demoTrade: string;
  demoCity: string;
  demoSearch: string;
  demoAll: string;
  demoCertified: string;
  demoNotCertified: string;
  stepLabel: string;
  problem: string;
  solution: string;
  call: string;
  reserve: string;
  trySearch: string;
  businessTitle: string;
  businessDescription: string;
  offers: string;
  conclusion: string;
  searchProfessional: string;
  why: string;
  businessOffers: string;
  contact: string;
  steps: Array<{ emoji: string; title: string; problem: string | null; solution: string; component: string | null }>;
  flowSteps: string[];
};

const copy: Record<Language, ConceptCopy> = {
  fr: {
    seoTitle: 'Comment fonctionne Dalil Tounes ? | Recherche professionnelle en Tunisie',
    seoDescription: 'Découvrez comment Dalil Tounes aide les citoyens à trouver des professionnels et les entreprises à développer leur visibilité en Tunisie.',
    seoKeywords: 'Dalil Tounes, professionnels Tunisie, entreprises Tunisie, CV Business, visibilité professionnelle',
    breadcrumbHome: 'Accueil', breadcrumbCurrent: 'Comment fonctionne Dalil Tounes ?', heroTitleBefore: 'Comment fonctionne', heroTitleAfter: ' ?',
    heroDescription: 'Découvrez comment trouver rapidement un artisan, un commerçant, un professionnel ou une entreprise de confiance en Tunisie, et comment Dalil Tounes aide les professionnels à développer leur visibilité.',
    heroAlt: 'Commerces et artisans en Tunisie', mascotTitle: 'Bonjour ! Je suis Dalil.', mascotMessage: 'Je vais te montrer comment trouver rapidement un professionnel de confiance et comprendre comment fonctionne Dalil Tounes.',
    pathsTitle: 'Dalil Tounes répond à deux besoins', citizenLabel: 'Pour les visiteurs', professionalLabel: 'Pour les professionnels', howTitle: 'Une recherche simple, un contact direct', visionTitle: 'Une plateforme tunisienne utile et vivante',
    demoTrade: 'Plombier', demoCity: 'Sousse', demoSearch: 'Rechercher', demoAll: 'Tous', demoCertified: 'Certifiés', demoNotCertified: 'Non certifiés', stepLabel: 'Étape', problem: 'Problème :', solution: 'Solution :', call: 'Appeler', reserve: 'Réserver', trySearch: 'Essayer une recherche',
    businessTitle: 'Tu souhaites être plus visible pour attirer davantage de clients ?', businessDescription: "Dalil Tounes t'aide à présenter ton activité grâce à une fiche professionnelle complète, à être trouvé plus facilement sur Internet et à faciliter le contact avec tes futurs clients.", offers: 'Découvrir les offres entreprises',
    conclusion: 'simplifie la recherche des citoyens et aide les artisans, commerçants, indépendants, PME et entreprises tunisiennes à être visibles, trouvés et contactés plus facilement.', searchProfessional: 'Rechercher un professionnel', why: 'Pourquoi Dalil Tounes ?', businessOffers: 'Offres entreprises', contact: 'Contact',
    steps: [
      { emoji: '🔎', title: 'Tu recherches un professionnel', problem: "Aujourd'hui, il n'est pas toujours facile de trouver rapidement un professionnel de confiance.", solution: "Il te suffit d'indiquer un métier, une activité ou une ville pour commencer ta recherche.", component: 'searchbar' },
      { emoji: '📋', title: 'Dalil Tounes te propose plusieurs résultats', problem: 'Les informations importantes sont souvent dispersées ou difficiles à consulter rapidement.', solution: 'En quelques secondes, découvre les professionnels correspondant à ta recherche grâce aux Business Cards.', component: 'businesscard' },
      { emoji: '📄', title: 'Tu ouvres une fiche complète', problem: 'Tu dois parfois consulter plusieurs sites ou applications pour réunir toutes les informations utiles.', solution: 'Le CV Business rassemble les informations essentielles sur une seule fiche : horaires, téléphone, GPS, photos, services, avis, réservation, QR Code et bien plus encore.', component: 'cvbusiness' },
      { emoji: '📞', title: 'Tu contactes facilement le professionnel', problem: 'Trouver le bon numéro, les horaires ou la localisation peut faire perdre du temps.', solution: 'Depuis la fiche, tu peux appeler, réserver, utiliser le GPS ou contacter directement le professionnel.', component: null },
      { emoji: '⭐', title: 'Tu poursuis ta recherche si tu le souhaites', problem: null, solution: "Dalil Tounes peut également te proposer d'autres professionnels correspondant à ta recherche afin de t'aider à trouver celui qui répond le mieux à tes besoins.", component: null },
    ],
    flowSteps: ['Business Card', 'CV Business', 'Plus de visibilité', 'Plus de contacts', "Plus d'opportunités"],
  },
  en: {
    seoTitle: 'How does Dalil Tounes work? | Professional search in Tunisia', seoDescription: 'Discover how Dalil Tounes helps citizens find professionals and businesses grow their visibility in Tunisia.', seoKeywords: 'Dalil Tounes, professionals Tunisia, businesses Tunisia, Business CV, professional visibility',
    breadcrumbHome: 'Home', breadcrumbCurrent: 'How does Dalil Tounes work?', heroTitleBefore: 'How does', heroTitleAfter: ' work?', heroDescription: 'Discover how to quickly find a trusted craftsperson, merchant, professional or business in Tunisia, and how Dalil Tounes helps professionals grow their visibility.', heroAlt: 'Shops and craftspeople in Tunisia', mascotTitle: 'Hello! I am Dalil.', mascotMessage: 'I will show you how to quickly find a trusted professional and understand how Dalil Tounes works.',
    pathsTitle: 'Dalil Tounes meets two needs', citizenLabel: 'For visitors', professionalLabel: 'For professionals', howTitle: 'A simple search, direct contact', visionTitle: 'A useful and living Tunisian platform',
    demoTrade: 'Plumber', demoCity: 'Sousse', demoSearch: 'Search', demoAll: 'All', demoCertified: 'Certified', demoNotCertified: 'Not certified', stepLabel: 'Step', problem: 'Problem:', solution: 'Solution:', call: 'Call', reserve: 'Book', trySearch: 'Try a search', businessTitle: 'Want to be more visible and attract more customers?', businessDescription: 'Dalil Tounes helps you present your activity with a complete professional profile, be found more easily online and make it easier for future customers to contact you.', offers: 'Discover business offers', conclusion: 'makes searches easier for citizens and helps Tunisian craftspeople, merchants, independents, SMEs and businesses be more visible, easier to find and easier to contact.', searchProfessional: 'Search for a professional', why: 'Why Dalil Tounes?', businessOffers: 'Business offers', contact: 'Contact',
    steps: [
      { emoji: '🔎', title: 'You search for a professional', problem: 'It is not always easy to quickly find a trusted professional.', solution: 'Simply enter a trade, activity or city to start your search.', component: 'searchbar' },
      { emoji: '📋', title: 'Dalil Tounes shows several results', problem: 'Important information is often scattered or difficult to review quickly.', solution: 'In seconds, discover professionals matching your search through Business Cards.', component: 'businesscard' },
      { emoji: '📄', title: 'You open a complete profile', problem: 'You sometimes need several websites or apps to gather all the useful information.', solution: 'The Business CV brings together key information in one profile: opening hours, phone, GPS, photos, services, reviews, booking, QR Code and more.', component: 'cvbusiness' },
      { emoji: '📞', title: 'You easily contact the professional', problem: 'Finding the right number, opening hours or location can take time.', solution: 'From the profile, you can call, book, use GPS or contact the professional directly.', component: null },
      { emoji: '⭐', title: 'Continue searching if you wish', problem: null, solution: 'Dalil Tounes can also suggest other professionals matching your search so you can find the one that best meets your needs.', component: null },
    ],
    flowSteps: ['Business Card', 'Business CV', 'More visibility', 'More contacts', 'More opportunities'],
  },
  ar: {
    seoTitle: 'كيف تعمل Dalil Tounes؟ | البحث عن المهنيين في تونس', seoDescription: 'اكتشف كيف تساعد Dalil Tounes المواطنين على العثور على المهنيين وتساعد المؤسسات على تطوير حضورها في تونس.', seoKeywords: 'Dalil Tounes، مهنيون تونس، مؤسسات تونس، السيرة المهنية، الظهور الرقمي',
    breadcrumbHome: 'الرئيسية', breadcrumbCurrent: 'كيف تعمل Dalil Tounes؟', heroTitleBefore: 'كيف تعمل', heroTitleAfter: '؟', heroDescription: 'اكتشف كيف تجد بسرعة حرفياً أو تاجراً أو مهنياً أو مؤسسة موثوقة في تونس، وكيف تساعد Dalil Tounes المهنيين على تطوير ظهورهم.', heroAlt: 'متاجر وحرفيون في تونس', mascotTitle: 'مرحباً! أنا دليل.', mascotMessage: 'سأريك كيف تعثر بسرعة على مهني موثوق وتفهم كيف تعمل Dalil Tounes.',
    pathsTitle: 'تلبي Dalil Tounes حاجتين', citizenLabel: 'للزوار', professionalLabel: 'للمهنيين', howTitle: 'بحث بسيط واتصال مباشر', visionTitle: 'منصة تونسية مفيدة ومتجددة',
    demoTrade: 'سباك', demoCity: 'سوسة', demoSearch: 'بحث', demoAll: 'الكل', demoCertified: 'موثّق', demoNotCertified: 'غير موثّق', stepLabel: 'المرحلة', problem: 'المشكلة:', solution: 'الحل:', call: 'اتصال', reserve: 'حجز', trySearch: 'جرّب البحث', businessTitle: 'هل تريد ظهوراً أكبر لجذب المزيد من العملاء؟', businessDescription: 'تساعدك Dalil Tounes على تقديم نشاطك عبر ملف مهني متكامل، والظهور بسهولة أكبر على الإنترنت، وتسهيل تواصل عملائك المستقبليين معك.', offers: 'اكتشف عروض المؤسسات', conclusion: 'تسهّل بحث المواطنين وتساعد الحرفيين والتجار والمستقلين والمؤسسات التونسية على الظهور والعثور عليهم والتواصل معهم بسهولة أكبر.', searchProfessional: 'البحث عن مهني', why: 'لماذا Dalil Tounes؟', businessOffers: 'عروض المؤسسات', contact: 'اتصل بنا',
    steps: [
      { emoji: '🔎', title: 'تبحث عن مهني', problem: 'ليس من السهل دائماً العثور بسرعة على مهني موثوق.', solution: 'يكفي إدخال المهنة أو النشاط أو المدينة لبدء البحث.', component: 'searchbar' },
      { emoji: '📋', title: 'تعرض لك Dalil Tounes عدة نتائج', problem: 'غالباً ما تكون المعلومات المهمة متفرقة أو صعبة المراجعة بسرعة.', solution: 'في ثوانٍ، اكتشف المهنيين المطابقين لبحثك عبر بطاقات Business Card.', component: 'businesscard' },
      { emoji: '📄', title: 'تفتح ملفاً متكاملاً', problem: 'قد تحتاج إلى عدة مواقع أو تطبيقات لجمع كل المعلومات المفيدة.', solution: 'يجمع CV Business المعلومات الأساسية في ملف واحد: التوقيت، الهاتف، GPS، الصور، الخدمات، الآراء، الحجز، QR Code والمزيد.', component: 'cvbusiness' },
      { emoji: '📞', title: 'تتواصل بسهولة مع المهني', problem: 'قد يستغرق العثور على الرقم الصحيح أو التوقيت أو الموقع وقتاً.', solution: 'من الملف يمكنك الاتصال أو الحجز أو استخدام GPS أو التواصل مباشرة مع المهني.', component: null },
      { emoji: '⭐', title: 'تواصل البحث إذا رغبت', problem: null, solution: 'يمكن لـ Dalil Tounes أيضاً اقتراح مهنيين آخرين مطابقين لبحثك لمساعدتك على اختيار الأنسب لاحتياجاتك.', component: null },
    ],
    flowSteps: ['Business Card', 'CV Business', 'ظهور أكبر', 'اتصالات أكثر', 'فرص أكثر'],
  },
  it: {
    seoTitle: 'Come funziona Dalil Tounes? | Ricerca professionale in Tunisia', seoDescription: 'Scopri come Dalil Tounes aiuta i cittadini a trovare professionisti e le imprese a sviluppare la propria visibilità in Tunisia.', seoKeywords: 'Dalil Tounes, professionisti Tunisia, imprese Tunisia, CV Business, visibilità professionale',
    breadcrumbHome: 'Home', breadcrumbCurrent: 'Come funziona Dalil Tounes?', heroTitleBefore: 'Come funziona', heroTitleAfter: '?', heroDescription: 'Scopri come trovare rapidamente un artigiano, commerciante, professionista o impresa affidabile in Tunisia e come Dalil Tounes aiuta i professionisti a sviluppare la loro visibilità.', heroAlt: 'Negozi e artigiani in Tunisia', mascotTitle: 'Ciao! Sono Dalil.', mascotMessage: 'Ti mostrerò come trovare rapidamente un professionista affidabile e capire come funziona Dalil Tounes.',
    pathsTitle: 'Dalil Tounes risponde a due esigenze', citizenLabel: 'Per i visitatori', professionalLabel: 'Per i professionisti', howTitle: 'Una ricerca semplice, un contatto diretto', visionTitle: 'Una piattaforma tunisina utile e viva',
    demoTrade: 'Idraulico', demoCity: 'Sousse', demoSearch: 'Cerca', demoAll: 'Tutti', demoCertified: 'Certificati', demoNotCertified: 'Non certificati', stepLabel: 'Passaggio', problem: 'Problema:', solution: 'Soluzione:', call: 'Chiama', reserve: 'Prenota', trySearch: 'Prova una ricerca', businessTitle: 'Vuoi essere più visibile e attirare più clienti?', businessDescription: 'Dalil Tounes ti aiuta a presentare la tua attività con un profilo professionale completo, essere trovato più facilmente online e facilitare il contatto con i futuri clienti.', offers: 'Scopri le offerte per imprese', conclusion: 'semplifica la ricerca dei cittadini e aiuta artigiani, commercianti, indipendenti, PMI e imprese tunisine a essere più visibili, trovati e contattati più facilmente.', searchProfessional: 'Cerca un professionista', why: 'Perché Dalil Tounes?', businessOffers: 'Offerte imprese', contact: 'Contatti',
    steps: [
      { emoji: '🔎', title: 'Cerchi un professionista', problem: 'Non è sempre facile trovare rapidamente un professionista affidabile.', solution: 'Basta indicare un mestiere, un’attività o una città per iniziare la ricerca.', component: 'searchbar' },
      { emoji: '📋', title: 'Dalil Tounes propone più risultati', problem: 'Le informazioni importanti sono spesso sparse o difficili da consultare rapidamente.', solution: 'In pochi secondi scopri i professionisti corrispondenti alla ricerca tramite le Business Card.', component: 'businesscard' },
      { emoji: '📄', title: 'Apri un profilo completo', problem: 'A volte servono più siti o app per raccogliere tutte le informazioni utili.', solution: 'Il CV Business raccoglie in un unico profilo orari, telefono, GPS, foto, servizi, recensioni, prenotazione, QR Code e molto altro.', component: 'cvbusiness' },
      { emoji: '📞', title: 'Contatti facilmente il professionista', problem: 'Trovare il numero giusto, gli orari o la posizione può far perdere tempo.', solution: 'Dal profilo puoi chiamare, prenotare, usare il GPS o contattare direttamente il professionista.', component: null },
      { emoji: '⭐', title: 'Continui la ricerca se vuoi', problem: null, solution: 'Dalil Tounes può proporti altri professionisti compatibili con la ricerca per aiutarti a trovare quello più adatto alle tue esigenze.', component: null },
    ],
    flowSteps: ['Business Card', 'CV Business', 'Più visibilità', 'Più contatti', 'Più opportunità'],
  },
  ru: {
    seoTitle: 'Как работает Dalil Tounes? | Поиск специалистов в Тунисе', seoDescription: 'Узнайте, как Dalil Tounes помогает жителям находить специалистов, а компаниям развивать видимость в Тунисе.', seoKeywords: 'Dalil Tounes, специалисты Тунис, компании Тунис, Business CV, профессиональная видимость',
    breadcrumbHome: 'Главная', breadcrumbCurrent: 'Как работает Dalil Tounes?', heroTitleBefore: 'Как работает', heroTitleAfter: '?', heroDescription: 'Узнайте, как быстро найти надежного мастера, продавца, специалиста или компанию в Тунисе и как Dalil Tounes помогает профессионалам повышать видимость.', heroAlt: 'Магазины и мастера в Тунисе', mascotTitle: 'Здравствуйте! Я Dalil.', mascotMessage: 'Я покажу, как быстро найти надежного специалиста и понять, как работает Dalil Tounes.',
    pathsTitle: 'Dalil Tounes решает две задачи', citizenLabel: 'Для посетителей', professionalLabel: 'Для профессионалов', howTitle: 'Простой поиск и прямой контакт', visionTitle: 'Полезная и развивающаяся тунисская платформа',
    demoTrade: 'Сантехник', demoCity: 'Сус', demoSearch: 'Найти', demoAll: 'Все', demoCertified: 'Сертифицированные', demoNotCertified: 'Без сертификата', stepLabel: 'Шаг', problem: 'Проблема:', solution: 'Решение:', call: 'Позвонить', reserve: 'Забронировать', trySearch: 'Попробовать поиск', businessTitle: 'Хотите стать заметнее и привлечь больше клиентов?', businessDescription: 'Dalil Tounes помогает представить деятельность в полном профессиональном профиле, легче находиться в интернете и упростить связь с будущими клиентами.', offers: 'Посмотреть предложения для бизнеса', conclusion: 'упрощает поиск для жителей и помогает тунисским мастерам, продавцам, независимым специалистам, МСП и компаниям быть заметнее, легче находиться и получать контакты.', searchProfessional: 'Найти специалиста', why: 'Почему Dalil Tounes?', businessOffers: 'Предложения для бизнеса', contact: 'Контакты',
    steps: [
      { emoji: '🔎', title: 'Вы ищете специалиста', problem: 'Быстро найти надежного специалиста не всегда просто.', solution: 'Укажите профессию, вид деятельности или город, чтобы начать поиск.', component: 'searchbar' },
      { emoji: '📋', title: 'Dalil Tounes показывает несколько результатов', problem: 'Важная информация часто разбросана или ее сложно быстро сравнить.', solution: 'За несколько секунд найдите специалистов, соответствующих запросу, с помощью Business Card.', component: 'businesscard' },
      { emoji: '📄', title: 'Вы открываете полный профиль', problem: 'Иногда приходится открывать несколько сайтов и приложений, чтобы собрать полезную информацию.', solution: 'Business CV объединяет часы работы, телефон, GPS, фото, услуги, отзывы, бронирование, QR Code и многое другое в одном профиле.', component: 'cvbusiness' },
      { emoji: '📞', title: 'Вы легко связываетесь со специалистом', problem: 'Поиск правильного номера, времени работы или адреса может занимать время.', solution: 'Из профиля можно позвонить, забронировать, открыть GPS или напрямую связаться со специалистом.', component: null },
      { emoji: '⭐', title: 'Продолжайте поиск при необходимости', problem: null, solution: 'Dalil Tounes также может предложить других специалистов по вашему запросу, чтобы помочь выбрать наиболее подходящего.', component: null },
    ],
    flowSteps: ['Business Card', 'Business CV', 'Больше видимости', 'Больше контактов', 'Больше возможностей'],
  },
};

export default function Concept() {
  const currentPath = useHreflangPath();
  const { language } = useLanguage();
  const t = copy[language] || copy.fr;
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <StructuredData data={[{ '@context': 'https://schema.org', '@type': 'AboutPage', name: t.breadcrumbCurrent, description: t.seoDescription, url: 'https://dalil-tounes.com/concept' }, { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: t.breadcrumbHome, item: 'https://dalil-tounes.com/' }, { '@type': 'ListItem', position: 2, name: t.breadcrumbCurrent }] }]} />
      <SEOHead title={t.seoTitle} description={t.seoDescription} keywords={t.seoKeywords} image="/images/pourquoi-business-card.png" type="website" canonical="https://dalil-tounes.com/concept" currentPath={currentPath} />

      <div className="max-w-5xl mx-auto px-4 pt-6"><Breadcrumb items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.breadcrumbCurrent }]} /></div>

      <section className="relative flex min-h-[38vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0"><LazyImage src="/images/cat_magasin-1920.webp" alt={t.heroAlt} className="w-full h-full object-cover" style={{ filter: 'brightness(0.55)' }} fallbackSrc="https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&w=1920" /><div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" /></div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-12 text-center"><h1 className="mb-4 text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl">{t.heroTitleBefore} <span className="text-[#D4AF37]">Dalil Tounes</span>{t.heroTitleAfter}</h1><p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-100 drop-shadow sm:text-lg">{t.heroDescription}</p></div>
      </section>

      <section className="px-4 pt-7"><div className="mx-auto max-w-5xl"><GuideMascot variant="welcome" pose="hello" position="left" size="sm" title={t.mascotTitle} message={t.mascotMessage} /></div></section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-[#2E102A] sm:text-3xl">{t.pathsTitle}</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-[#D4AF37]/35 bg-[#FFFCF7] p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#4A1D43]"><Search className="h-5 w-5" aria-hidden="true" /></span>
              <p className="mt-4 text-sm font-black uppercase tracking-[0.12em] text-[#B58A18]">{t.citizenLabel}</p>
              <h3 className="mt-2 text-xl font-bold text-[#2E102A]">{t.steps[0].title}</h3>
              <p className="mt-3 text-base leading-7 text-gray-600">{t.steps[0].solution}</p>
              <Link to="/entreprises" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#4A1D43] px-5 py-3 text-sm font-bold text-white">{t.trySearch}<ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} /></Link>
            </article>
            <article className="rounded-3xl border border-emerald-800/20 bg-emerald-50/60 p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-800/10 text-emerald-800"><Building2 className="h-5 w-5" aria-hidden="true" /></span>
              <p className="mt-4 text-sm font-black uppercase tracking-[0.12em] text-emerald-800">{t.professionalLabel}</p>
              <h3 className="mt-2 text-xl font-bold text-[#2E102A]">{t.businessTitle}</h3>
              <p className="mt-3 text-base leading-7 text-gray-600">{t.businessDescription}</p>
              <Link to="/abonnement" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#07543F] px-5 py-3 text-sm font-bold text-white">{t.offers}<ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} /></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-[#2E102A] sm:text-3xl">{t.howTitle}</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[t.steps[0], t.steps[2], t.steps[3]].map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37]/15 text-sm font-black text-[#4A1D43]">{index + 1}</span>
                <h3 className="mt-4 text-lg font-bold text-[#2E102A]">{step.title}</h3>
                <p className="mt-2 text-base leading-7 text-gray-600">{step.solution}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-[#4A1D43] to-[#07543F] p-7 text-center text-white shadow-xl sm:p-10">
          <h2 className="text-2xl font-bold sm:text-3xl">{t.visionTitle}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-white/85"><strong className="text-[#F1D783]">Dalil Tounes</strong> {t.conclusion}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">{t.flowSteps.map((label) => <span key={label} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold">{label}</span>)}</div>
        </div>
      </section>
      <section className="py-8 px-4 border-t border-gray-100"><div className="max-w-3xl mx-auto"><nav className="flex flex-wrap justify-center gap-4 text-sm"><Link to="/entreprises" className="text-[#D4AF37] hover:underline font-medium">{t.searchProfessional}</Link><Link to="/pourquoi-dalil-tounes" className="text-[#D4AF37] hover:underline font-medium">{t.why}</Link><Link to="/abonnement" className="text-[#D4AF37] hover:underline font-medium">{t.businessOffers}</Link><Link to="/contact" className="text-[#D4AF37] hover:underline font-medium">{t.contact}</Link></nav></div></section>
    </div>
  );
}
