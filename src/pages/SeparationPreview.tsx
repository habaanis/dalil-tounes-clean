import { ArrowRight, Building2, MapPin, QrCode, Search, Share2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import CvBusinessJourney from '../components/CvBusinessJourney';
import SearchBar from '../components/SearchBar';
import VisibilityHouseSection from '../components/VisibilityHouseSection';
import { useLanguage } from '../context/LanguageContext';
import { useHomeData } from '../hooks/useHomeData';

type Lang = 'fr' | 'ar' | 'en' | 'it' | 'ru';

const COPY: Record<Lang, {
  previewNotice: string; platformTab: string; cvTab: string; platformLabel: string;
  platformTitle: string; platformDescription: string; categories: Array<[string, string]>;
  professionalEyebrow: string; platformPromoTitle: string; platformPromoText: string;
  discoverCv: string; cvLabel: string; cvTitle: string; cvSubtitle: string;
  cvDescription: string; offers: string; information: string; example: string;
  cardEyebrow: string; cardTitle: string; cardIntro: string; qrBenefit: string;
  informationBenefit: string; sharingBenefit: string; physicalCard: string;
  visibilityTitle: string; visibilityText: string; searchEyebrow: string;
  searchTitle: string; explorePlatform: string;
}> = {
  fr: {
    previewNotice: 'Maquette de séparation — aucun changement publié', platformTab: 'Accueil plateforme', cvTab: 'Espace CV Business',
    platformLabel: 'Plateforme et annuaire tunisien', platformTitle: 'Trouvez les entreprises et les services dont vous avez besoin en Tunisie.',
    platformDescription: 'Recherchez une activité, découvrez les professionnels référencés et contactez-les directement.',
    categories: [['Santé', '/citizens/sante'], ['Éducation', '/education'], ['Commerces', '/citizens/shops'], ['Services', '/citizens/services']],
    professionalEyebrow: 'Vous êtes professionnel ?',
    platformPromoTitle: 'Donnez à votre activité une présentation claire et partageable avec le CV Business Dalil Tounes.',
    platformPromoText: 'Présentez toutes vos informations, partagez-les par lien ou QR Code et renforcez votre présence sur Dalil Tounes ainsi que votre visibilité sur Google.',
    discoverCv: 'Découvrir le CV Business', cvLabel: 'Espace professionnel Dalil Tounes', cvTitle: 'Votre entreprise mérite mieux qu’une simple fiche.',
    cvSubtitle: 'Créez votre CV Business et choisissez le modèle adapté à votre métier.',
    cvDescription: 'Réunissez votre activité, vos services, vos réalisations, vos contacts et votre QR Code dans une présentation professionnelle facile à partager.',
    offers: 'Découvrir les offres', information: 'Demander des informations', example: 'Exemple réel : Aux saveurs d’Anis',
    cardEyebrow: 'Votre carte professionnelle, toujours avec vous', cardTitle: 'Présentez, partagez et faites connaître votre entreprise.',
    cardIntro: 'Lors d’un rendez-vous, d’une rencontre ou d’un événement, votre QR Business donne immédiatement accès à votre CV Business.',
    qrBenefit: 'Un QR Code à présenter, imprimer ou faire scanner.',
    informationBenefit: 'Présentation, services, réalisations, photos, adresse, téléphone, WhatsApp, GPS et liens utiles réunis au même endroit.',
    sharingBenefit: 'Un lien facile à envoyer et à partager avec vos clients et vos contacts.',
    physicalCard: 'Vous n’avez plus besoin de distribuer systématiquement une carte de visite physique. Vous pouvez aussi y imprimer votre QR Business pour relier le papier à votre présentation numérique.',
    visibilityTitle: 'Une présence plus facile à retrouver',
    visibilityText: 'Votre CV Business enrichit votre présence sur Dalil Tounes. Sa présentation structurée et accessible en ligne donne également à Google davantage d’informations pour comprendre et référencer votre activité. Le positionnement dans les résultats dépend ensuite des critères propres à Google.',
    searchEyebrow: 'Vous cherchez une entreprise ou un service en Tunisie ?', searchTitle: 'Retrouvez les activités référencées sur la plateforme Dalil Tounes.',
    explorePlatform: 'Explorer la plateforme',
  },
  ar: {
    previewNotice: 'نموذج الفصل — لم يتم نشر أي تغيير', platformTab: 'واجهة المنصة', cvTab: 'فضاء CV Business',
    platformLabel: 'منصة ودليل مهني تونسي', platformTitle: 'اعثر على الشركات والخدمات التي تحتاجها في تونس.',
    platformDescription: 'ابحث عن نشاط، واكتشف المهنيين المدرجين وتواصل معهم مباشرة.',
    categories: [['الصحة', '/citizens/sante'], ['التعليم', '/education'], ['المتاجر', '/citizens/shops'], ['الخدمات', '/citizens/services']],
    professionalEyebrow: 'هل أنت مهني؟', platformPromoTitle: 'امنح نشاطك عرضاً واضحاً وسهل المشاركة مع CV Business من دليل تونس.',
    platformPromoText: 'اعرض كل معلوماتك وشاركها عبر رابط أو رمز QR، وعزّز حضورك على دليل تونس وظهور نشاطك على Google.',
    discoverCv: 'اكتشف CV Business', cvLabel: 'الفضاء المهني لدليل تونس', cvTitle: 'شركتك تستحق أكثر من مجرد بطاقة بسيطة.',
    cvSubtitle: 'أنشئ CV Business واختر النموذج الأنسب لمهنتك.',
    cvDescription: 'اجمع نشاطك وخدماتك وإنجازاتك ووسائل الاتصال ورمز QR في عرض مهني سهل المشاركة.',
    offers: 'اكتشف العروض', information: 'اطلب معلومات', example: 'مثال حقيقي: Aux saveurs d’Anis',
    cardEyebrow: 'بطاقتك المهنية معك دائماً', cardTitle: 'قدّم شركتك وشاركها واجعلها معروفة.',
    cardIntro: 'أثناء موعد أو لقاء أو فعالية، يتيح QR Business الوصول فوراً إلى CV Business الخاص بك.',
    qrBenefit: 'رمز QR يمكنك عرضه أو طباعته أو جعله قابلاً للمسح.',
    informationBenefit: 'العرض والخدمات والإنجازات والصور والعنوان والهاتف وWhatsApp والموقع عبر GPS والروابط المفيدة في مكان واحد.',
    sharingBenefit: 'رابط سهل الإرسال والمشاركة مع عملائك ومعارفك.',
    physicalCard: 'لم تعد مضطراً إلى توزيع بطاقة ورقية في كل مرة. ويمكنك أيضاً طباعة QR Business عليها لربط البطاقة بعرضك الرقمي.',
    visibilityTitle: 'حضور يسهل العثور عليه',
    visibilityText: 'يعزّز CV Business حضورك على دليل تونس. كما يمنح عرضه المنظم والمتاح على الإنترنت Google معلومات أكثر لفهم نشاطك وفهرسته. ويبقى ترتيب النتائج خاضعاً لمعايير Google الخاصة.',
    searchEyebrow: 'هل تبحث عن شركة أو خدمة في تونس؟', searchTitle: 'اكتشف الأنشطة المدرجة على منصة دليل تونس.', explorePlatform: 'استكشف المنصة',
  },
  en: {
    previewNotice: 'Separation preview — no changes published', platformTab: 'Platform home', cvTab: 'Business CV space',
    platformLabel: 'Tunisian platform and directory', platformTitle: 'Find the businesses and services you need in Tunisia.',
    platformDescription: 'Search for an activity, discover listed professionals and contact them directly.',
    categories: [['Health', '/citizens/sante'], ['Education', '/education'], ['Shops', '/citizens/shops'], ['Services', '/citizens/services']],
    professionalEyebrow: 'Are you a professional?', platformPromoTitle: 'Give your activity a clear, shareable presentation with the Dalil Tounes Business CV.',
    platformPromoText: 'Present all your information, share it by link or QR code and strengthen your presence on Dalil Tounes and your visibility on Google.',
    discoverCv: 'Discover the Business CV', cvLabel: 'Dalil Tounes professional space', cvTitle: 'Your business deserves more than a simple listing.',
    cvSubtitle: 'Create your Business CV and choose the model that suits your profession.',
    cvDescription: 'Bring together your activity, services, work, contact details and QR code in a professional presentation that is easy to share.',
    offers: 'Discover the offers', information: 'Request information', example: 'Real example: Aux saveurs d’Anis',
    cardEyebrow: 'Your professional card, always with you', cardTitle: 'Present, share and promote your business.',
    cardIntro: 'At a meeting, appointment or event, your Business QR gives immediate access to your Business CV.',
    qrBenefit: 'A QR code to show, print or scan.',
    informationBenefit: 'Presentation, services, work, photos, address, phone, WhatsApp, GPS and useful links brought together in one place.',
    sharingBenefit: 'A link that is easy to send and share with clients and contacts.',
    physicalCard: 'You no longer need to hand out a physical business card every time. You can also print your Business QR on it to connect paper with your digital presentation.',
    visibilityTitle: 'A presence that is easier to find',
    visibilityText: 'Your Business CV enriches your presence on Dalil Tounes. Its structured, accessible online presentation also gives Google more information to understand and index your activity. Ranking in results then depends on Google’s own criteria.',
    searchEyebrow: 'Looking for a business or service in Tunisia?', searchTitle: 'Find listed activities on the Dalil Tounes platform.', explorePlatform: 'Explore the platform',
  },
  it: {
    previewNotice: 'Anteprima della separazione — nessuna modifica pubblicata', platformTab: 'Home piattaforma', cvTab: 'Spazio CV Business',
    platformLabel: 'Piattaforma e directory tunisina', platformTitle: 'Trova le imprese e i servizi di cui hai bisogno in Tunisia.',
    platformDescription: 'Cerca un’attività, scopri i professionisti presenti e contattali direttamente.',
    categories: [['Salute', '/citizens/sante'], ['Istruzione', '/education'], ['Negozi', '/citizens/shops'], ['Servizi', '/citizens/services']],
    professionalEyebrow: 'Sei un professionista?', platformPromoTitle: 'Dai alla tua attività una presentazione chiara e condivisibile con il CV Business Dalil Tounes.',
    platformPromoText: 'Presenta tutte le tue informazioni, condividile tramite link o QR Code e rafforza la tua presenza su Dalil Tounes e la tua visibilità su Google.',
    discoverCv: 'Scopri il CV Business', cvLabel: 'Spazio professionale Dalil Tounes', cvTitle: 'La tua impresa merita più di una semplice scheda.',
    cvSubtitle: 'Crea il tuo CV Business e scegli il modello adatto alla tua professione.',
    cvDescription: 'Riunisci attività, servizi, lavori, contatti e QR Code in una presentazione professionale facile da condividere.',
    offers: 'Scopri le offerte', information: 'Richiedi informazioni', example: 'Esempio reale: Aux saveurs d’Anis',
    cardEyebrow: 'La tua carta professionale, sempre con te', cardTitle: 'Presenta, condividi e fai conoscere la tua impresa.',
    cardIntro: 'Durante un appuntamento, un incontro o un evento, il tuo QR Business dà accesso immediato al tuo CV Business.',
    qrBenefit: 'Un QR Code da mostrare, stampare o far scansionare.',
    informationBenefit: 'Presentazione, servizi, lavori, foto, indirizzo, telefono, WhatsApp, GPS e link utili riuniti in un solo posto.',
    sharingBenefit: 'Un link facile da inviare e condividere con clienti e contatti.',
    physicalCard: 'Non devi più distribuire ogni volta un biglietto da visita fisico. Puoi anche stamparvi il QR Business per collegare la carta alla tua presentazione digitale.',
    visibilityTitle: 'Una presenza più facile da trovare',
    visibilityText: 'Il CV Business arricchisce la tua presenza su Dalil Tounes. La sua presentazione strutturata e accessibile online offre anche a Google più informazioni per comprendere e indicizzare la tua attività. Il posizionamento dipende poi dai criteri propri di Google.',
    searchEyebrow: 'Cerchi un’impresa o un servizio in Tunisia?', searchTitle: 'Trova le attività presenti sulla piattaforma Dalil Tounes.', explorePlatform: 'Esplora la piattaforma',
  },
  ru: {
    previewNotice: 'Макет разделения — изменения не опубликованы', platformTab: 'Главная платформы', cvTab: 'Раздел Business CV',
    platformLabel: 'Тунисская платформа и каталог', platformTitle: 'Найдите нужные компании и услуги в Тунисе.',
    platformDescription: 'Ищите виды деятельности, находите представленных специалистов и связывайтесь с ними напрямую.',
    categories: [['Здоровье', '/citizens/sante'], ['Образование', '/education'], ['Магазины', '/citizens/shops'], ['Услуги', '/citizens/services']],
    professionalEyebrow: 'Вы профессионал?', platformPromoTitle: 'Представьте свою деятельность понятно и удобно с Business CV Dalil Tounes.',
    platformPromoText: 'Покажите всю информацию, делитесь ею по ссылке или QR-коду и укрепляйте присутствие на Dalil Tounes и видимость в Google.',
    discoverCv: 'Открыть Business CV', cvLabel: 'Профессиональное пространство Dalil Tounes', cvTitle: 'Ваш бизнес заслуживает большего, чем простая карточка.',
    cvSubtitle: 'Создайте Business CV и выберите модель для своей профессии.',
    cvDescription: 'Объедините деятельность, услуги, работы, контакты и QR-код в профессиональной презентации, которой легко поделиться.',
    offers: 'Посмотреть предложения', information: 'Запросить информацию', example: 'Реальный пример: Aux saveurs d’Anis',
    cardEyebrow: 'Ваша профессиональная карточка всегда с вами', cardTitle: 'Представляйте, делитесь и продвигайте свою компанию.',
    cardIntro: 'На встрече, переговорах или мероприятии ваш Business QR мгновенно открывает Business CV.',
    qrBenefit: 'QR-код, который можно показать, распечатать или отсканировать.',
    informationBenefit: 'Презентация, услуги, работы, фотографии, адрес, телефон, WhatsApp, GPS и полезные ссылки в одном месте.',
    sharingBenefit: 'Ссылка, которую легко отправить клиентам и контактам.',
    physicalCard: 'Больше не нужно каждый раз раздавать бумажную визитку. На ней также можно напечатать Business QR и связать её с цифровой презентацией.',
    visibilityTitle: 'Присутствие, которое легче найти',
    visibilityText: 'Business CV делает ваше присутствие на Dalil Tounes более полным. Структурированная онлайн-презентация также даёт Google больше информации для понимания и индексирования вашей деятельности. Позиция в результатах зависит от собственных критериев Google.',
    searchEyebrow: 'Ищете компанию или услугу в Тунисе?', searchTitle: 'Найдите представленные виды деятельности на платформе Dalil Tounes.', explorePlatform: 'Перейти на платформу',
  },
};

export default function SeparationPreview() {
  const [view, setView] = useState<'platform' | 'cv'>('platform');
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as Lang;
  const t = COPY[lang];
  const { totalCount, loading } = useHomeData();

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="bg-white text-slate-900">
      <div className="sticky top-0 z-40 border-b border-[#D4AF37]/35 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <p className="hidden text-sm font-bold text-[#4A1D43] sm:block">{t.previewNotice}</p>
          <div className="grid w-full grid-cols-2 gap-2 rounded-2xl bg-[#F7F2E8] p-1.5 sm:w-auto">
            <button type="button" onClick={() => setView('platform')} className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${view === 'platform' ? 'bg-[#4A1D43] text-white shadow-sm' : 'bg-white text-[#4A1D43]'}`}>{t.platformTab}</button>
            <button type="button" onClick={() => setView('cv')} className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${view === 'cv' ? 'bg-[#4A1D43] text-white shadow-sm' : 'bg-white text-[#4A1D43]'}`}>{t.cvTab}</button>
          </div>
        </div>
      </div>

      {view === 'platform' ? (
        <>
          <section className="border-b border-[#D4AF37]/25 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_28%),linear-gradient(135deg,#fffdf8_0%,#ffffff_52%,#f7f0f5_100%)] px-4 py-10 md:py-16">
            <div className="mx-auto max-w-5xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#4A1D43] shadow-sm"><Building2 className="h-4 w-4 text-[#D4AF37]" /> {t.platformLabel}</div>
              <h1 className="mx-auto mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight text-[#2E102A] md:text-6xl">{t.platformTitle}</h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">{t.platformDescription}</p>
              <div className="mx-auto mt-7 max-w-3xl rounded-2xl border border-[#D4AF37]/40 bg-white p-3 shadow-[0_18px_45px_rgba(74,29,67,0.10)]"><SearchBar scope="global" autoSearch resultMode="redirectToResults" /></div>
              <div className="mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4">{t.categories.map(([label, href]) => <a key={href} href={href} className="min-h-11 rounded-xl border border-[#D4AF37]/40 bg-white px-3 py-3 text-sm font-bold text-[#4A1D43] transition hover:bg-[#FFF8DF]">{label}</a>)}</div>
            </div>
          </section>

          <VisibilityHouseSection totalCount={totalCount} loading={loading} />

          <section className="bg-[#2E102A] px-4 py-9 text-white">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left rtl:md:text-right">
              <div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#F1D783]">{t.professionalEyebrow}</p><h2 className="mt-2 max-w-3xl font-serif text-2xl font-bold md:text-3xl">{t.platformPromoTitle}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-white/85 md:text-base">{t.platformPromoText}</p></div>
              <button type="button" onClick={() => setView('cv')} className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-black text-[#2E102A]">{t.discoverCv} <ArrowRight className={`h-4 w-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /></button>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="border-b border-[#D4AF37]/25 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_28%),linear-gradient(135deg,#fffdf8_0%,#ffffff_52%,#f7f0f5_100%)] px-4 py-8 md:py-14">
            <div className="mx-auto grid max-w-[1180px] items-center gap-8 lg:grid-cols-[1fr_0.72fr]">
              <div><div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#4A1D43] shadow-sm"><Sparkles className="h-4 w-4 text-[#D4AF37]" /> {t.cvLabel}</div><h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-[#2E102A] md:text-5xl">{t.cvTitle}</h1><p className="mt-3 font-serif text-2xl font-bold leading-tight text-[#B58A18] md:text-3xl">{t.cvSubtitle}</p><p className="mt-5 max-w-xl text-base leading-7 text-gray-600">{t.cvDescription}</p><div className="mt-6 flex flex-wrap gap-3"><a href="/subscription" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#4A1D43] px-5 py-3 text-sm font-black text-white">{t.offers} <ArrowRight className={`h-4 w-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /></a><a href="/contact" className="inline-flex min-h-12 items-center rounded-xl border border-[#D4AF37] bg-white px-5 py-3 text-sm font-bold text-[#4A1D43]">{t.information}</a></div></div>
              <div className="rounded-[30px] border border-[#D4AF37]/45 bg-white/90 p-4 shadow-[0_28px_70px_rgba(74,29,67,0.16)]"><p className="mb-3 text-center text-xs font-bold text-[#4A1D43]">{t.example}</p><div className="flex h-[390px] justify-center overflow-hidden"><img src="/images/cv-business-portfolio-aux-saveurs-anis.png" alt="CV Business Aux saveurs d’Anis" className="h-[390px] w-auto object-contain object-top" /></div></div>
            </div>
          </section>

          <section className="bg-white px-4 py-10 md:py-14">
            <div className="mx-auto max-w-6xl rounded-[30px] border border-[#D4AF37]/35 bg-[#FFFCF5] p-5 shadow-[0_20px_55px_rgba(74,29,67,0.08)] md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#B58A18]">{t.cardEyebrow}</p><h2 className="mt-2 max-w-4xl font-serif text-3xl font-bold text-[#2E102A] md:text-4xl">{t.cardTitle}</h2><p className="mt-4 max-w-4xl text-base leading-7 text-gray-700">{t.cardIntro}</p>
              <div className="mt-6 grid gap-3 md:grid-cols-3"><div className="rounded-2xl border border-[#D4AF37]/25 bg-white p-4"><QrCode className="h-5 w-5 text-[#B58A18]" aria-hidden="true" /><p className="mt-3 text-sm font-semibold leading-6 text-[#4A1D43]">{t.qrBenefit}</p></div><div className="rounded-2xl border border-[#D4AF37]/25 bg-white p-4"><MapPin className="h-5 w-5 text-[#B58A18]" aria-hidden="true" /><p className="mt-3 text-sm font-semibold leading-6 text-[#4A1D43]">{t.informationBenefit}</p></div><div className="rounded-2xl border border-[#D4AF37]/25 bg-white p-4"><Share2 className="h-5 w-5 text-[#B58A18]" aria-hidden="true" /><p className="mt-3 text-sm font-semibold leading-6 text-[#4A1D43]">{t.sharingBenefit}</p></div></div>
              <p className="mt-5 max-w-5xl rounded-2xl border border-[#D4AF37]/25 bg-white px-4 py-3 text-sm leading-6 text-gray-700">{t.physicalCard}</p>
              <div className="mt-5 rounded-2xl bg-[#2E102A] p-5 text-white md:p-6"><h3 className="font-serif text-xl font-bold text-[#F1D783] md:text-2xl">{t.visibilityTitle}</h3><p className="mt-2 max-w-5xl text-sm leading-6 text-white/85 md:text-base">{t.visibilityText}</p></div>
            </div>
          </section>

          <CvBusinessJourney language={lang} />

          <section className="bg-[#2E102A] px-4 py-7 text-white"><div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left rtl:sm:text-right"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#F1D783]">{t.searchEyebrow}</p><h2 className="mt-2 max-w-3xl font-serif text-2xl font-bold">{t.searchTitle}</h2></div><button type="button" onClick={() => setView('platform')} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#D4AF37] px-5 py-3 text-sm font-black text-[#F1D783]"><Search className="h-4 w-4" /> {t.explorePlatform}</button></div></section>
        </>
      )}
    </div>
  );
}
