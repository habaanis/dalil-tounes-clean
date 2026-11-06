import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CvPresentationModelSelector, type PaletteId, type PresentationModel } from '../components/CvPresentationModelSelector';
import CvCapabilitiesSection from '../components/CvCapabilitiesSection';
import { simplifiedOfferCopy, offerCopy } from './Subscription';

type Lang = 'fr' | 'ar' | 'en' | 'it' | 'ru';

type Texts = {
  eyebrow: string; title: string; intro: string; free: string; freeDesc: string;
  register: string; paid: string; paidDesc: string; inquire: string;
  modelEyebrow: string; modelTitle: string; modelIntro: string;
  business: string; businessDesc: string; portfolio: string; portfolioDesc: string;
  preview: string; close: string; demoNotice: string; featuresTitle: string;
  features: string[]; more: string; stagesTitle: string; stages: string[];
  priceTitle: string; installments: string; priceNote: string; finalTitle: string; finalText: string;
  returnHome: string; seeOffers: string; trialTitle: string; trialDesc: string; trialCta: string;
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
    trialTitle: "Essayez votre CV professionnel pendant 14 jours", trialDesc: "Essai privé, sans engagement et sans obligation d’achat. Échangez avec notre équipe pour organiser votre démonstration avant de choisir une formule.", trialCta: "Demander mon essai de 14 jours",
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
    trialTitle: "جرّب سيرتك المهنية لمدة 14 يوماً", trialDesc: "تجربة خاصة دون التزام أو إلزام بالشراء. تواصل مع فريقنا لتنظيم التجربة قبل اختيار العرض.", trialCta: "اطلب تجربة 14 يوماً",
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
    trialTitle: "Try your professional CV for 14 days", trialDesc: "Private trial with no commitment or obligation to buy. Contact our team to arrange your trial before choosing an offer.", trialCta: "Request my 14-day trial",
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
    trialTitle: "Prova il tuo CV professionale per 14 giorni", trialDesc: "Prova privata senza impegno né obbligo di acquisto. Contatta il nostro team prima di scegliere un’offerta.", trialCta: "Richiedi la prova di 14 giorni",
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
    trialTitle: "Попробуйте профессиональное CV в течение 14 дней", trialDesc: "Частный пробный период без обязательств и необходимости покупки. Свяжитесь с командой, чтобы организовать демонстрацию.", trialCta: "Запросить пробный период 14 дней",
    returnHome: 'К каталогу', seeOffers: 'Предложения и заявка'
  }
};

export default function CvProfessionalLanding() {
  const { language } = useLanguage();
  const lang: Lang = language in COPY ? language as Lang : 'fr';
  const t = COPY[lang];
  const offers = simplifiedOfferCopy[lang];
  const pricing = offerCopy[lang];
  const navigate = useNavigate();
  const [selectedFormula, setSelectedFormula] = useState<'artisan' | 'premium' | null>(null);
  const [selectedModel, setSelectedModel] = useState<PresentationModel | null>(null);
  const [palette, setPalette] = useState<PaletteId>('prestige');
  const isRtl = lang === 'ar';
  useEffect(() => {
    const previousTitle = document.title;
    document.title = t.title + ' | Dalil Tounes';
    return () => { document.title = previousTitle; };
  }, [t.title]);
  const continueWithModel = () => {
    if (!selectedFormula || !selectedModel) {
      document.getElementById('cv-presentation-models')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const params = new URLSearchParams({ formula: selectedFormula, model: selectedModel, palette });
    navigate(`/subscription?${params.toString()}#cv-presentation-models`);
  };
  return <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#FFFCF8] text-[#30162E]">
    <section className="bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.17),transparent_38%),linear-gradient(155deg,#fffdfa,#f9f1f5)] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="text-sm font-semibold text-[#70466B] underline underline-offset-4">{t.returnHome}</Link>
        <div className="max-w-4xl">
          <p className="mt-8 inline-flex rounded-full bg-[#4A1D43] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#F4D58A]">{offers.welcomeBadge}</p>
          <h1 className="mt-4 max-w-4xl font-serif text-3xl font-bold leading-[1.14] sm:text-4xl lg:text-[3.1rem]">{offers.welcomeTitle}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#655B63] sm:text-base">{offers.welcomeDescription}</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#655B63]">{t.intro}</p>
          <Link to="/contact" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#D1B57B] bg-white px-5 py-3 text-sm font-bold text-[#4A1D43]">{t.inquire}<ArrowRight size={16} /></Link>
        </div>
        <section className="px-4 pt-7 pb-1 sm:pt-9 sm:pb-3" aria-labelledby="cv-trial-title">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 rounded-2xl border border-[#D7BB7F] bg-[#FFFAEF] p-5 sm:flex-row sm:items-center sm:p-7">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7029]">14 JOURS · 14 DAYS</p>
          <h2 id="cv-trial-title" className="mt-2 font-serif text-2xl font-bold sm:text-3xl">{t.trialTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-[#5A555A]">{t.trialDesc}</p>
        </div>
        <Link to="/contact" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#4A1D43] px-5 py-3 text-sm font-bold text-white hover:bg-[#602957]">{t.trialCta}<ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
        </section>
        <div className="mt-8 rounded-[20px] border border-[#D3B16F] bg-[#FFF9ED] p-5 text-[#3E1D36] shadow-[0_12px_30px_rgba(7,84,63,.12)] sm:p-6">
          <p className="font-serif text-lg font-bold leading-7 text-[#4A1D43]">{offers.welcomeHighlight}</p>
          <p className="mt-3 text-sm font-semibold leading-7 text-[#594F57]">{offers.welcomePayment}</p>
        </div>
        <div id="formules" className="mt-6 grid gap-4 md:grid-cols-2">
          {(['artisan', 'premium'] as const).map(formula => {
            const isPremium = formula === 'premium';
            const features = isPremium ? pricing.premiumFeatures : offers.artisanFeatures;
            return <article key={formula} className="flex min-w-0 flex-col rounded-[20px] border border-[#C8A557] bg-[#FFF9ED] p-5 text-[#35172F] shadow-[0_10px_26px_rgba(7,84,63,.11)] sm:p-6">
              <p className="text-xs font-black uppercase tracking-[.13em] text-[#986F25]">CV BUSINESS</p>
              <h2 className="mt-3 font-serif text-2xl font-bold">{isPremium ? offers.premiumTitle : offers.artisanTitle}</h2>
              <p className="mt-2 text-3xl font-black text-[#4A1D43]">{isPremium ? pricing.premiumPrice : pricing.artisanPrice}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#645861]">{offers.creationLabel}</p>
              <p className="mt-3 min-h-[50px] text-sm leading-6 text-[#594F57]">{isPremium ? offers.premiumIntro : offers.artisanIntro}</p>
              <p className="mt-3 rounded-xl border border-[#D9C69F] bg-[#F8F0DE] px-3 py-2 text-xs font-semibold leading-5">{offers.firstYearIncluded}</p>
              <details className="group mt-4 rounded-xl border border-[#D2B77A]">
                <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-[#815E28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#986F25]">{t.more}<ChevronDown className="h-5 w-5 shrink-0 group-open:rotate-180" aria-hidden="true"/></summary>
                <ul className="space-y-3 border-t border-[#D9C69F] px-4 py-4">{features.map(item => <li key={item} className="flex items-start gap-2 text-sm leading-6 text-[#594F57]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#4A1D43]" aria-hidden="true"/>{item}</li>)}</ul>
              </details>
              
            </article>;
          })}
        </div>
        <CvPresentationModelSelector
          language={lang}
          formulaValue={selectedFormula}
          onFormulaChange={setSelectedFormula}
          artisanLabel={`${offers.artisanTitle} — ${pricing.artisanPrice}`}
          premiumLabel={`${offers.premiumTitle} — ${pricing.premiumPrice}`}
          value={selectedModel}
          onChange={setSelectedModel}
          selectedFormulaLabel={selectedFormula ? `${selectedFormula === 'artisan' ? offers.artisanTitle : offers.premiumTitle} — ${selectedFormula === 'artisan' ? pricing.artisanPrice : pricing.premiumPrice}` : null}
          onContinue={continueWithModel}
          paletteValue={palette}
          onPaletteChange={setPalette}
          liveModelPreviews
        />
        <details className="group mt-5 rounded-[18px] border border-[#DAC395] bg-white">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 p-4 font-bold text-[#4A1D43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B58C3C]">
            <span>{offers.maintenanceTitle} · {offers.maintenancePrice} · {offers.maintenanceTiming}</span><ChevronDown className="h-5 w-5 shrink-0 group-open:rotate-180" aria-hidden="true"/>
          </summary>
          <div className="border-t border-[#E5D6B6] px-4 pb-5">
            <p className="mt-4 text-sm leading-7 text-[#5A555A]">{offers.maintenanceIntro}</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">{offers.maintenanceFeatures.map(item => <li key={item} className="flex items-start gap-2 text-sm leading-6 text-[#5A555A]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#98762F]" aria-hidden="true"/>{item}</li>)}</ul>
            <p className="mt-4 rounded-xl bg-[#FFF5DD] p-3 text-sm leading-6 text-[#4A1D43]">{offers.noRenewal}</p>
          </div>
        </details>
        <div className="mt-5 flex flex-col justify-between gap-3 rounded-[16px] border border-[#E2D6BE] bg-white p-4 sm:flex-row sm:items-center">
          <div><strong className="text-base text-[#4A1D43]">{t.free} · 0 TND</strong><p className="mt-1 text-sm leading-6 text-[#665D64]">{offers.essentialPreviewText}</p></div>
          <Link to="/inscription-entreprise" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#BA9853] px-4 py-2 text-sm font-bold text-[#4A1D43]">{t.register}<ArrowRight className="h-4 w-4"/></Link>
        </div>
      </div>
    </section>

    <CvCapabilitiesSection language={lang} compact />

    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl font-bold">{t.stagesTitle}</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">{t.stages.map((stage,index) => <div key={index} className="rounded-2xl border border-[#E2D0B0] bg-white p-5"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] font-bold text-[#30162E]">{index+1}</span><p className="mt-4 text-sm leading-7 text-[#554B51]">{stage}</p></div>)}</div>
      </div>
    </section>

    <section className="bg-[#35162F] px-4 py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div><h2 className="font-serif text-3xl font-bold text-[#F8D78D]">{t.finalTitle}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">{t.finalText}</p></div>
        <Link to="/contact" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#30162E]">{t.inquire}<ArrowRight size={17} /></Link>
      </div>
    </section>

  </main>;
}
