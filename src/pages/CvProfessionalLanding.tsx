import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, Palette, QrCode, Smartphone, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { RealPalettePreview, getPaletteLabel, PALETTE_IDS, PALETTE_SWATCHES, type PaletteId } from '../components/CvPresentationModelSelector';

type Lang = 'fr' | 'ar' | 'en' | 'it' | 'ru';
type Model = 'business' | 'portfolio';

type Texts = {
  eyebrow: string; title: string; intro: string; free: string; freeDesc: string;
  register: string; paid: string; paidDesc: string; inquire: string;
  modelEyebrow: string; modelTitle: string; modelIntro: string;
  business: string; businessDesc: string; portfolio: string; portfolioDesc: string;
  preview: string; close: string; demoNotice: string; featuresTitle: string;
  features: string[]; more: string; stagesTitle: string; stages: string[];
  priceTitle: string; installments: string; priceNote: string; finalTitle: string; finalText: string;
  returnHome: string; seeOffers: string;
};

const COPY: Record<Lang, Texts> = {
  fr: {
    eyebrow: 'DALIL TOUNES · SOLUTIONS PROFESSIONNELLES',
    title: 'Votre entreprise mérite mieux qu’une simple fiche.',
    intro: 'Votre CV Business ou CV Portfolio rassemble votre activité, vos réalisations, vos coordonnées et votre QR Business dans une présentation facile à partager.',
    free: 'Présence Essentielle', freeDesc: 'Votre entreprise peut être référencée gratuitement dans les recherches de Dalil Tounes, après vérification.', register: 'Référencer gratuitement mon entreprise',
    paid: 'CV professionnel accompagné', paidDesc: 'Une présentation personnalisée, préparée avec vous. Le CV Business et le CV Portfolio proposent les mêmes fonctions, avec deux styles différents.', inquire: 'Demander la création de mon CV',
    modelEyebrow: 'DEUX PRÉSENTATIONS, LES MÊMES FONCTIONS', modelTitle: 'Choisissez le style qui vous ressemble.',
    modelIntro: 'Le modèle Business privilégie les informations essentielles ; Portfolio donne plus de place aux photos et aux réalisations.',
    business: 'CV Business', businessDesc: 'Clair et direct : vos services, coordonnées, horaires et informations pratiques.',
    portfolio: 'CV Portfolio', portfolioDesc: 'Plus visuel : vos projets, créations, produits et réalisations au premier plan.',
    preview: 'Agrandir l’aperçu', close: 'Fermer l’aperçu', demoNotice: 'Démonstration visuelle fictive, sans entreprise tunisienne réelle.',
    featuresTitle: 'Tout pour présenter et partager votre activité',
    features: ['Présentation de votre activité et de vos services', 'Photos, réalisations et informations pratiques', 'Téléphone, itinéraire, horaires et réseaux sociaux', 'Un lien personnel et un QR Business à partager', 'Un accès depuis l’écran d’accueil du téléphone'],
    more: 'Voir toutes les possibilités', stagesTitle: 'Nous nous occupons de la création',
    stages: ['Vous nous expliquez votre activité et choisissez le modèle.', 'Nous préparons votre CV et organisons les informations avec vous.', 'Vous vérifiez l’aperçu, puis nous finalisons et publions après règlement complet.'],
    priceTitle: 'Les formules CV Business et Portfolio', installments: 'Choisissez le modèle qui correspond à votre activité. Nous précisons ensemble les tarifs et les conditions avant toute commande.',
    priceNote: 'Aucun règlement sur cette page de présentation. Le tarif et les prestations précises seront confirmés avec vous avant toute commande.',
    finalTitle: 'Parlons de votre projet.', finalText: 'Vous n’avez pas besoin de préparer seul votre CV. Décrivez votre activité : nous vous accompagnons pour choisir la présentation adaptée.',
    returnHome: 'Retour à l’annuaire', seeOffers: 'Voir les formules et la demande'
  },
  ar: {
    eyebrow: 'دليل تونس · حلول للمؤسسات', title: 'مؤسستك تستحق أكثر من مجرد بطاقة تعريف.',
    intro: 'يجمع CV Business أو CV Portfolio نشاطك وأعمالك ووسائل الاتصال ورمز QR Business في عرض مهني سهل المشاركة.',
    free: 'الحضور الأساسي', freeDesc: 'يمكن إدراج مؤسستك مجاناً في نتائج بحث دليل تونس بعد التحقق من المعلومات.', register: 'سجّل مؤسستي مجاناً',
    paid: 'السيرة المهنية بمرافقة فريقنا', paidDesc: 'عرض مخصص نعدّه معك. النموذجان يوفران الوظائف الأساسية نفسها بطريقتين مختلفتين.', inquire: 'اطلب إنشاء سيرتي المهنية',
    modelEyebrow: 'نموذجان، الوظائف نفسها', modelTitle: 'اختر العرض المناسب لنشاطك.',
    modelIntro: 'يعرض Business المعلومات الأساسية بوضوح، بينما يمنح Portfolio مساحة أكبر للصور والأعمال.',
    business: 'CV Business', businessDesc: 'عرض واضح للخدمات والاتصال وساعات العمل والمعلومات العملية.',
    portfolio: 'CV Portfolio', portfolioDesc: 'عرض بصري يبرز المشاريع والمنتجات والإنجازات.',
    preview: 'تكبير المعاينة', close: 'إغلاق المعاينة', demoNotice: 'معاينة توضيحية وليست بطاقة مؤسسة تونسية حقيقية.',
    featuresTitle: 'كل ما تحتاجه لعرض نشاطك ومشاركته',
    features: ['تعريف بنشاطك وخدماتك', 'صور وإنجازات ومعلومات عملية', 'الهاتف والموقع والأوقات والشبكات الاجتماعية', 'رابط شخصي ورمز QR Business للمشاركة', 'وصول من شاشة الهاتف الرئيسية'],
    more: 'عرض جميع المزايا', stagesTitle: 'نرافقك في إعداد السيرة',
    stages: ['تشرح لنا نشاطك وتختار النموذج.', 'نعدّ العرض وننظم المعلومات معك.', 'تراجع المعاينة ثم ننشر بعد إتمام الدفع.'],
    priceTitle: 'عروض CV Business وCV Portfolio', installments: 'اختر العرض الأنسب لنشاطك. نؤكد معك الأسعار والشروط قبل أي طلب.',
    priceNote: 'يتم تأكيد تفاصيل العرض مع فريق دليل تونس قبل الطلب أو أي دفع.',
    finalTitle: 'لنتحدث عن مشروعك.', finalText: 'لا تحتاج إلى إعداد سيرتك المهنية وحدك. أخبرنا عن نشاطك وسنساعدك على اختيار العرض الأنسب.',
    returnHome: 'العودة إلى الدليل', seeOffers: 'العروض وطلب الإنشاء'
  },
  en: {
    eyebrow: 'DALIL TOUNES · BUSINESS SOLUTIONS', title: 'Your business deserves more than a basic listing.',
    intro: 'Your Business CV or Portfolio CV brings together your work, photos, contact details and Business QR in an easy-to-share presentation.',
    free: 'Essential listing', freeDesc: 'Your business can be listed free in Dalil Tounes search results after verification.', register: 'List my business for free',
    paid: 'Assisted professional CV', paidDesc: 'A customized presentation prepared with you. Both models have the same core features with two different visual styles.', inquire: 'Request my professional CV',
    modelEyebrow: 'TWO STYLES, THE SAME FEATURES', modelTitle: 'Choose the style that suits your business.',
    modelIntro: 'Business emphasizes practical information, while Portfolio gives more room to photos and completed work.',
    business: 'Business CV', businessDesc: 'Clear and direct: services, contacts, opening hours and practical details.',
    portfolio: 'Portfolio CV', portfolioDesc: 'More visual: projects, creations, products and completed work.',
    preview: 'Enlarge preview', close: 'Close preview', demoNotice: 'Illustrative demonstration, not a real Tunisian company listing.',
    featuresTitle: 'Everything you need to present and share your work',
    features: ['Business introduction and services', 'Photos, work examples and practical details', 'Phone, directions, hours and social networks', 'Personal link and shareable Business QR', 'Quick access from a phone home screen'],
    more: 'See all benefits', stagesTitle: 'We help create your CV',
    stages: ['Tell us about your business and choose a model.', 'We prepare and organize your presentation with you.', 'Review the preview; we publish after full payment.'],
    priceTitle: 'Business CV and Portfolio CV offers', installments: 'Choose the model that suits your business. We confirm prices and terms together before any order.',
    priceNote: 'The exact scope and terms are confirmed with the Dalil Tounes team before any order or payment.',
    finalTitle: 'Tell us about your project.', finalText: 'You do not have to build your CV alone. Tell us about your business and we will help you choose the right presentation.',
    returnHome: 'Back to directory', seeOffers: 'Offers and request form'
  },
  it: {
    eyebrow: 'DALIL TOUNES · SOLUZIONI PROFESSIONALI', title: 'La tua attività merita più di una semplice scheda.',
    intro: 'Il CV Business o CV Portfolio riunisce attività, realizzazioni, contatti e QR Business in una presentazione facile da condividere.',
    free: 'Presenza essenziale', freeDesc: 'Puoi inserire gratuitamente la tua attività nelle ricerche di Dalil Tounes, previa verifica.', register: 'Registra gratuitamente la mia attività',
    paid: 'CV professionale assistito', paidDesc: 'Una presentazione personalizzata, preparata insieme a te. Entrambi i modelli hanno le stesse funzioni principali.', inquire: 'Richiedi la creazione del CV',
    modelEyebrow: 'DUE STILI, LE STESSE FUNZIONI', modelTitle: 'Scegli lo stile adatto alla tua attività.',
    modelIntro: 'Business mette in risalto le informazioni essenziali; Portfolio dà più spazio a foto e lavori.',
    business: 'CV Business', businessDesc: 'Chiaro e diretto: servizi, contatti, orari e informazioni utili.',
    portfolio: 'CV Portfolio', portfolioDesc: 'Più visivo: progetti, creazioni, prodotti e realizzazioni.',
    preview: 'Ingrandisci anteprima', close: 'Chiudi anteprima', demoNotice: 'Dimostrazione illustrativa, non una vera scheda tunisina.',
    featuresTitle: 'Tutto per presentare e condividere la tua attività',
    features: ['Presentazione dell’attività e dei servizi', 'Foto, lavori e informazioni utili', 'Telefono, indicazioni, orari e social network', 'Link personale e QR Business da condividere', 'Accesso rapido dalla schermata iniziale'],
    more: 'Scopri tutti i vantaggi', stagesTitle: 'Ci occupiamo della creazione',
    stages: ['Descrivi l’attività e scegli il modello.', 'Prepariamo e organizziamo i contenuti insieme a te.', 'Verifichi l’anteprima; pubblichiamo dopo il pagamento completo.'],
    priceTitle: 'Offerte CV Business e Portfolio', installments: 'Scegli il modello più adatto. Confermiamo prezzi e condizioni insieme prima di ogni ordine.',
    priceNote: 'I dettagli delle offerte vengono confermati con il team Dalil Tounes prima dell’ordine o del pagamento.',
    finalTitle: 'Parliamo del tuo progetto.', finalText: 'Non devi creare il CV da solo. Raccontaci la tua attività e ti aiuteremo a scegliere la presentazione adatta.',
    returnHome: 'Torna all’elenco', seeOffers: 'Offerte e richiesta'
  },
  ru: {
    eyebrow: 'DALIL TOUNES · ДЛЯ БИЗНЕСА', title: 'Ваш бизнес заслуживает большего, чем обычная карточка.',
    intro: 'Business CV или Portfolio CV объединяет описание, работы, контакты и Business QR в презентацию, которой легко поделиться.',
    free: 'Базовое размещение', freeDesc: 'Добавление компании в поиск Dalil Tounes бесплатно после проверки данных.', register: 'Разместить компанию бесплатно',
    paid: 'Профессиональное CV с поддержкой', paidDesc: 'Персональная презентация, созданная вместе с вами. Основные функции одинаковы, оформление разное.', inquire: 'Заказать создание CV',
    modelEyebrow: 'ДВА СТИЛЯ, ОДНИ ФУНКЦИИ', modelTitle: 'Выберите оформление для своего бизнеса.',
    modelIntro: 'Business показывает основные сведения; Portfolio уделяет больше внимания фотографиям и проектам.',
    business: 'Business CV', businessDesc: 'Услуги, контакты, часы работы и полезная информация.',
    portfolio: 'Portfolio CV', portfolioDesc: 'Наглядное представление проектов, товаров и выполненных работ.',
    preview: 'Увеличить пример', close: 'Закрыть', demoNotice: 'Иллюстративный пример, не карточка реальной компании Туниса.',
    featuresTitle: 'Всё для представления и продвижения бизнеса',
    features: ['Описание бизнеса и услуг', 'Фото, работы и полезные сведения', 'Телефон, маршрут, часы работы и соцсети', 'Личная ссылка и QR Business для обмена', 'Быстрый доступ с главного экрана телефона'],
    more: 'Все возможности', stagesTitle: 'Мы поможем создать CV',
    stages: ['Расскажите о бизнесе и выберите модель.', 'Мы подготовим презентацию вместе с вами.', 'Вы проверите пример; публикация после полной оплаты.'],
    priceTitle: 'Предложения Business CV и Portfolio CV', installments: 'Выберите подходящий вариант. Цены и условия подтверждаем до оформления заказа.',
    priceNote: 'Точные условия уточняются с командой Dalil Tounes до заказа или оплаты.',
    finalTitle: 'Обсудим ваш проект.', finalText: 'Не нужно создавать CV самостоятельно. Расскажите о бизнесе — мы поможем подобрать оформление.',
    returnHome: 'К каталогу', seeOffers: 'Предложения и заявка'
  }
};

const MODELS: { id: Model; src: string }[] = [
  { id: 'business', src: '/images/cv-business-portfolio-aux-saveurs-anis.png' },
  { id: 'portfolio', src: '/images/cv-business-professionnel-aux-saveurs-anis.png' }
];

export default function CvProfessionalLanding() {
  const { language } = useLanguage();
  const lang: Lang = language in COPY ? language as Lang : 'fr';
  const t = COPY[lang];
  const [activeModel, setActiveModel] = useState<Model>('business');
  const [palette, setPalette] = useState<PaletteId>('prestige');
  const [zoom, setZoom] = useState(false);
  const isRtl = lang === 'ar';
  const active = MODELS.find(item => item.id === activeModel)!;
  useEffect(() => {
    const previousTitle = document.title;
    document.title = t.title + ' | Dalil Tounes';
    return () => { document.title = previousTitle; };
  }, [t.title]);
  useEffect(() => {
    if (!zoom) return;
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setZoom(false); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [zoom]);

  return <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#FFFCF8] text-[#30162E]">
    <section className="bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.17),transparent_38%),linear-gradient(155deg,#fffdfa,#f9f1f5)] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="text-sm font-semibold text-[#70466B] underline underline-offset-4">{t.returnHome}</Link>
        <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-12">
          <div>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.16em] text-[#9F782C]">{t.eyebrow}</p>
        <h1 className="mt-3 max-w-4xl font-serif text-4xl font-bold leading-[1.14] sm:text-5xl lg:text-[3.45rem]">{t.title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#655B63] sm:text-lg">{t.intro}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#modeles" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#4A1D43] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#64305B]">{t.modelTitle}<ArrowRight size={16}/></a>
              <Link to="/contact" className="inline-flex min-h-12 items-center rounded-xl border border-[#D1B57B] bg-white px-5 py-3 text-sm font-bold text-[#4A1D43]">{t.inquire}</Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[385px]">
                    <div className="mx-auto max-w-[385px] rounded-[28px] border border-[#DBC18C] bg-white p-4 shadow-[0_20px_48px_rgba(55,22,49,0.10)]">
          <div className="flex justify-between gap-3 pb-3"><strong className="font-serif text-lg">{activeModel === 'business' ? t.business : t.portfolio}</strong><button type="button" className="text-sm font-bold text-[#795A22] underline underline-offset-4" onClick={() => setZoom(true)}>{t.preview}</button></div>
          <div className="flex min-h-[465px] items-start justify-center overflow-hidden rounded-2xl bg-[#F8F6F0] p-2"><RealPalettePreview palette={palette} model={activeModel} language={lang} /></div>
        </div>

          </div>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          <article className="rounded-[20px] border border-[#E3D6BF] bg-white/90 p-5 shadow-[0_8px_24px_rgba(45,18,40,.04)] sm:p-6">
            <div className="flex items-center justify-between gap-3"><h2 className="font-serif text-2xl font-bold">{t.free}</h2><span className="rounded-full bg-[#E6F4EB] px-3 py-1 text-sm font-black text-[#17633E]">{lang === 'ar' ? 'مجاني' : lang === 'en' ? 'Free' : lang === 'it' ? 'Gratis' : lang === 'ru' ? 'Бесплатно' : 'Gratuit'}</span></div>
            <p className="mt-3 min-h-[58px] text-sm leading-6 text-[#665D64]">{t.freeDesc}</p>
            <Link to="/inscription-entreprise" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#AE8639] px-4 py-3 text-sm font-bold text-[#4A1D43] hover:bg-[#FFF6DE]">{t.register}<ArrowRight size={17} aria-hidden="true" /></Link>
          </article>
          <article className="rounded-[20px] border border-[#C5A66A] bg-[#4A1D43] p-5 text-white shadow-[0_12px_35px_rgba(45,18,40,.12)] sm:p-6">
            <h2 className="font-serif text-2xl font-bold text-[#FFE1A0]">{t.paid}</h2>
            <p className="mt-3 min-h-[58px] text-sm leading-6 text-white/85">{t.paidDesc}</p>
            <Link to="/contact" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 text-sm font-black text-[#2E102A] hover:bg-[#E3C166]">{t.inquire}<ArrowRight size={17} aria-hidden="true" /></Link>
          </article>
        </div>
      </div>
    </section>

    <section className="px-4 py-12 sm:py-16" id="modeles">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#A17A32]">{t.modelEyebrow}</p>
        <h2 className="mt-2 max-w-3xl font-serif text-3xl font-bold sm:text-4xl">{t.modelTitle}</h2>
        <p className="mt-3 max-w-3xl leading-7 text-[#605A62]">{t.modelIntro}</p>
        <div className="mt-7 grid gap-3 md:grid-cols-2">
          {MODELS.map((model, index) => {
            const selected = activeModel === model.id;
            const name = model.id === 'business' ? t.business : t.portfolio;
            const description = model.id === 'business' ? t.businessDesc : t.portfolioDesc;
            return <button key={model.id} type="button" aria-pressed={selected} onClick={() => { setActiveModel(model.id); setZoom(true); }} className={`flex min-h-[145px] w-full items-center gap-4 rounded-[20px] border p-4 text-start transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9F782C] sm:p-5 ${selected ? 'border-[#B18D48] bg-[#FFF7E9]' : 'border-[#E5D8C5] bg-white hover:border-[#BD9A5B]'}`}>
              <img src={model.src} alt="" className="h-28 w-20 shrink-0 rounded-xl border border-[#CFB782] bg-[#073027] object-contain" loading="lazy"/>
              <span className="min-w-0 flex-1"><span className="block text-xs font-black tracking-widest text-[#A47C36]">0{index+1}</span><strong className="mt-1 block font-serif text-xl text-[#361831]">{name}</strong><span className="mt-1 block text-sm leading-6 text-[#625965]">{description}</span><span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#8B622B]">{t.preview}<ArrowRight size={14}/></span></span>
            </button>;
          })}
        </div>
        <details className="group mx-auto mt-5 max-w-3xl rounded-2xl border border-[#DDC99E] bg-[#FFFDF8]">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-2 px-4 py-3 text-sm font-bold text-[#4A1D43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#AA853B]"><span className="inline-flex items-center gap-2"><Palette size={17} />{({ fr: 'Découvrir les palettes', ar: 'اكتشف الألوان', en: 'Explore colour themes', it: 'Scopri le palette', ru: 'Варианты оформления' } as Record<Lang,string>)[lang]}</span><ChevronDown size={17} className="group-open:rotate-180"/></summary>
          <div className="grid gap-2 border-t border-[#E8D6B7] p-3 sm:grid-cols-3">
            {PALETTE_IDS.map(id => <button key={id} type="button" aria-pressed={palette === id} onClick={() => setPalette(id)} className={`flex min-h-12 items-center gap-3 rounded-xl border px-3 py-2 text-start text-xs font-bold ${palette === id ? 'border-[#A67B34] bg-[#FFF3DC]' : 'border-[#E7D7BB] bg-white'}`}><span className="h-7 w-7 shrink-0 rounded-full border border-[#D6C6A4]" style={{ background: PALETTE_SWATCHES[id].bg }} /><span>{getPaletteLabel(lang, id)}</span></button>)}
          </div>
        </details>
        <p className="mt-3 text-center text-xs text-[#726875]">{t.demoNotice}</p>
      </div>
    </section>

    <section className="bg-[#F8F2EA] px-4 py-12 sm:py-14">
      <div className="mx-auto grid max-w-6xl gap-7 md:grid-cols-2 md:items-start">
        <div><h2 className="font-serif text-3xl font-bold">{t.featuresTitle}</h2><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full border border-[#D8C197] bg-white px-3 py-2 text-sm font-bold"><Smartphone className="me-2 inline-block h-4 w-4" />Mini-application</span><span className="rounded-full border border-[#D8C197] bg-white px-3 py-2 text-sm font-bold"><QrCode className="me-2 inline-block h-4 w-4" />QR Business</span></div></div>
        <details className="group rounded-2xl border border-[#DDC99E] bg-white p-4 sm:p-5">
          <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 font-bold text-[#4A1D43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9F782C]">{t.more}<ChevronDown size={20} className="group-open:rotate-180" /></summary>
          <ul className="mt-3 space-y-3 border-t border-[#E8DFD2] pt-4">{t.features.map(item => <li key={item} className="flex items-start gap-2 text-sm leading-6 text-[#514B52]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#9A751D]" />{item}</li>)}</ul>
        </details>
      </div>
    </section>

    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl font-bold">{t.stagesTitle}</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">{t.stages.map((stage,index) => <div key={index} className="rounded-2xl border border-[#E2D0B0] bg-white p-5"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] font-bold text-[#30162E]">{index+1}</span><p className="mt-4 text-sm leading-7 text-[#554B51]">{stage}</p></div>)}</div>
        <div className="mt-7 rounded-2xl border border-[#DCC393] bg-[#FFFAF0] p-5 sm:p-7">
          <h3 className="font-serif text-2xl font-bold">{t.priceTitle}</h3>
          <p className="mt-3 font-semibold leading-7">{t.installments}</p>
          <p className="mt-2 text-sm leading-7 text-[#5E585D]">{t.priceNote}</p>
          <Link to="/contact" className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4A1D43] px-5 py-3 text-sm font-bold text-white hover:bg-[#602957]">{t.seeOffers}<ArrowRight size={17} /></Link>
        </div>
      </div>
    </section>

    <section className="bg-[#35162F] px-4 py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div><h2 className="font-serif text-3xl font-bold text-[#F8D78D]">{t.finalTitle}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">{t.finalText}</p></div>
        <Link to="/contact" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#30162E]">{t.inquire}<ArrowRight size={17} /></Link>
      </div>
    </section>

    {zoom && <div role="dialog" aria-modal="true" aria-label={t.preview} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4" onClick={() => setZoom(false)}>
      <div className="relative flex h-[min(92vh,900px)] w-full max-w-[650px] items-center justify-center rounded-2xl bg-[#F8F6F0] p-4" onClick={event => event.stopPropagation()}>
        <button type="button" autoFocus className="absolute right-2 top-2 z-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#30162E]" onClick={() => setZoom(false)}><X size={18} />{t.close}</button>
        <div className="h-full max-h-[85vh] w-full overflow-auto rounded-xl bg-[#F8F6F0]"><RealPalettePreview palette={palette} model={activeModel} language={lang} expanded /></div>
      </div>
    </div>}
  </main>;
}
