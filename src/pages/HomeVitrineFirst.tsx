import { ArrowRight, CheckCircle2, QrCode, Share2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessCardPreview, type BusinessCardPreviewLanguage } from '../components/BusinessCardPreview';
import CvBusinessJourney from '../components/CvBusinessJourney';
import VisibilityHouseSection from '../components/VisibilityHouseSection';
import { useLanguage } from '../context/LanguageContext';
import { Home as PlatformHome } from './Home';

const COPY: Record<BusinessCardPreviewLanguage, {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  example: string;
  primary: string;
  secondary: string;
  offerBadge: string;
  offerTitle: string;
  offerDetail: string;
  proof1: string;
  proof2: string;
  proof3: string;
  bridgeTitle: string;
  bridgeText: string;
  mobileDescription: string;
  platformTitle: string;
  platformText: string;
  platformCta: string;
  platformDetailsOpen: string;
  platformDetailsClose: string;
}> = {
  fr: {
    eyebrow: 'Votre présence professionnelle commence ici',
    title: 'Votre entreprise mérite mieux qu’une simple fiche.',
    accent: 'Créez votre CV Business professionnel.',
    description: 'Un CV Business vivant qui réunit votre activité, vos services, vos réalisations, vos contacts, vos avis et votre QR Code dans une vitrine élégante, facile à montrer et à partager.',
    example: "Exemple réel de présentation : Aux saveurs d'Anis",
    primary: 'Découvrir les offres',
    secondary: 'Découvrir la plateforme',
    offerBadge: 'Offre de bienvenue',
    offerTitle: '3 ans de CV Business — 2 années offertes',
    offerDetail: 'Payez uniquement la création du CV Business de votre choix.',
    proof1: 'Une présentation qui rassure',
    proof2: 'Un QR Code toujours avec vous',
    proof3: 'Un lien simple à partager partout',
    bridgeTitle: 'Le CV Business attire, rassure et se partage.',
    bridgeText: 'La plateforme Dalil Tounes organise, amplifie et crée la découverte.',
    mobileDescription: 'Votre activité, vos services, vos contacts et votre QR Code réunis dans une présentation professionnelle facile à partager.',
    platformTitle: 'Vous cherchez un professionnel en Tunisie ?',
    platformText: 'Accédez directement aux entreprises et services référencés sur Dalil Tounes.',
    platformCta: 'Rechercher sur Dalil Tounes',
    platformDetailsOpen: 'Comprendre la plateforme',
    platformDetailsClose: 'Masquer les explications',
  },
  ar: {
    eyebrow: 'حضورك المهني يبدأ من هنا',
    title: 'مؤسستك تستحق أكثر من مجرد بطاقة بسيطة.',
    accent: 'أنشئ CV Business احترافيًا.',
    description: 'CV Business حي يجمع نشاطك وخدماتك وإنجازاتك ووسائل الاتصال والآراء ورمز QR في واجهة أنيقة وسهلة العرض والمشاركة.',
    example: "مثال تقديم: Aux saveurs d'Anis",
    primary: 'اكتشف العروض',
    secondary: 'اكتشف المنصة',
    offerBadge: 'عرض ترحيبي',
    offerTitle: '3 سنوات من CV Business — سنتان مجانًا',
    offerDetail: 'ادفع فقط تكلفة إنشاء CV Business الذي تختاره.',
    proof1: 'تقديم مهني يبعث الثقة',
    proof2: 'رمز QR معك دائماً',
    proof3: 'رابط واحد سهل المشاركة',
    bridgeTitle: 'CV Business يجذب ويطمئن ويسهل مشاركته.',
    bridgeText: 'منصة دليل تونس تنظّم الظهور وتضخّمه وتخلق فرص الاكتشاف.',
    mobileDescription: 'نشاطك وخدماتك ووسائل الاتصال ورمز QR في عرض مهني واحد سهل المشاركة.',
    platformTitle: 'هل تبحث عن مهني في تونس؟',
    platformText: 'ادخل مباشرة إلى المؤسسات والخدمات المسجلة على دليل تونس.',
    platformCta: 'ابحث في دليل تونس',
    platformDetailsOpen: 'اكتشف كيف تعمل المنصة',
    platformDetailsClose: 'إخفاء الشرح',
  },
  en: {
    eyebrow: 'Your professional presence starts here',
    title: 'Your business deserves more than a simple listing.',
    accent: 'Create your professional Business CV.',
    description: 'A living Business CV bringing together your activity, services, work, contact options, reviews and QR Code in one elegant showcase that is easy to present and share.',
    example: "Presentation example: Aux saveurs d'Anis",
    primary: 'Discover the offers',
    secondary: 'Discover the platform',
    offerBadge: 'Welcome offer',
    offerTitle: '3 years of Business CV — 2 years free',
    offerDetail: 'Only pay for the creation of the Business CV you choose.',
    proof1: 'A presentation that builds trust',
    proof2: 'A QR Code always with you',
    proof3: 'One simple link to share anywhere',
    bridgeTitle: 'The Business CV attracts, reassures and gets shared.',
    bridgeText: 'Dalil Tounes organizes, amplifies and creates discovery.',
    mobileDescription: 'Your activity, services, contacts and QR Code in one professional presentation that is easy to share.',
    platformTitle: 'Looking for a professional in Tunisia?',
    platformText: 'Go straight to the businesses and services listed on Dalil Tounes.',
    platformCta: 'Search Dalil Tounes',
    platformDetailsOpen: 'How the platform works',
    platformDetailsClose: 'Hide explanations',
  },
  it: {
    eyebrow: 'La tua presenza professionale inizia qui',
    title: 'La tua attività merita più di una semplice scheda.',
    accent: 'Crea il tuo CV Business professionale.',
    description: 'Un CV Business vivo che riunisce attività, servizi, lavori, contatti, recensioni e QR Code in una vetrina elegante, facile da mostrare e condividere.',
    example: "Esempio di presentazione: Aux saveurs d'Anis",
    primary: 'Scopri le offerte',
    secondary: 'Scopri la piattaforma',
    offerBadge: 'Offerta di benvenuto',
    offerTitle: '3 anni di CV Business — 2 anni offerti',
    offerDetail: 'Paghi solo la creazione del CV Business che scegli.',
    proof1: 'Una presentazione che crea fiducia',
    proof2: 'Un QR Code sempre con te',
    proof3: 'Un solo link da condividere ovunque',
    bridgeTitle: 'Il CV Business attira, rassicura e si condivide.',
    bridgeText: 'Dalil Tounes organizza, amplifica e crea scoperta.',
    mobileDescription: 'Attività, servizi, contatti e QR Code riuniti in una presentazione professionale facile da condividere.',
    platformTitle: 'Cerchi un professionista in Tunisia?',
    platformText: 'Accedi direttamente alle attività e ai servizi presenti su Dalil Tounes.',
    platformCta: 'Cerca su Dalil Tounes',
    platformDetailsOpen: 'Come funziona la piattaforma',
    platformDetailsClose: 'Nascondi le spiegazioni',
  },
  ru: {
    eyebrow: 'Ваше профессиональное присутствие начинается здесь',
    title: 'Ваш бизнес заслуживает большего, чем простая карточка.',
    accent: 'Создайте профессиональный Business CV.',
    description: 'Живой Business CV объединяет деятельность, услуги, работы, контакты, отзывы и QR-код в одной элегантной витрине, которую легко показывать и делиться.',
    example: "Пример презентации: Aux saveurs d'Anis",
    primary: 'Посмотреть предложения',
    secondary: 'Открыть платформу',
    offerBadge: 'Приветственное предложение',
    offerTitle: '3 года Business CV — 2 года бесплатно',
    offerDetail: 'Оплатите только создание выбранного Business CV.',
    proof1: 'Презентация, вызывающая доверие',
    proof2: 'QR-код всегда с вами',
    proof3: 'Одна ссылка для любого канала',
    bridgeTitle: 'Business CV привлекает, убеждает и легко распространяется.',
    bridgeText: 'Dalil Tounes организует, усиливает и создаёт новые возможности быть найденным.',
    mobileDescription: 'Деятельность, услуги, контакты и QR-код в одной профессиональной презентации, которой легко делиться.',
    platformTitle: 'Ищете специалиста в Тунисе?',
    platformText: 'Перейдите сразу к компаниям и услугам, представленным на Dalil Tounes.',
    platformCta: 'Найти на Dalil Tounes',
    platformDetailsOpen: 'Как работает платформа',
    platformDetailsClose: 'Скрыть объяснения',
  },
};

export default function HomeVitrineFirst() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as BusinessCardPreviewLanguage;
  const t = COPY[lang];
  const rtl = lang === 'ar';
  const [showPlatformMobile, setShowPlatformMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const updateDesktop = () => setIsDesktop(desktopQuery.matches);
    updateDesktop();
    desktopQuery.addEventListener('change', updateDesktop);
    return () => desktopQuery.removeEventListener('change', updateDesktop);
  }, []);

  return (
    <div dir={rtl ? 'rtl' : 'ltr'}>
      <section className="relative overflow-hidden border-b border-[#D4AF37]/25 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_28%),linear-gradient(135deg,#fffdf8_0%,#ffffff_52%,#f7f0f5_100%)] px-4 py-6 md:py-12">
        <div className="mx-auto grid max-w-[1280px] items-center gap-5 lg:grid-cols-[1fr_0.72fr] lg:gap-8">
          <div className={rtl ? 'text-right' : 'text-left'}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-white/85 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#4A1D43] shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
              {t.eyebrow}
            </div>

            <h1 className="mt-3 max-w-2xl font-serif text-3xl font-bold leading-tight text-[#2E102A] md:mt-5 md:text-5xl">
              {t.title}
            </h1>
            <p className="mt-2 max-w-2xl font-serif text-2xl font-bold leading-tight text-[#B58A18] md:text-4xl">
              {t.accent}
            </p>
            <p className="mt-4 hidden max-w-xl text-sm leading-7 text-gray-600 sm:block md:mt-5 md:text-base">
              {t.description}
            </p>
            <p className="mt-3 max-w-xl text-base leading-6 text-gray-600 sm:hidden">{t.mobileDescription}</p>

            <button
              type="button"
              onClick={() => navigate('/subscription')}
              className="mt-5 hidden w-full max-w-xl items-center justify-between gap-3 rounded-2xl border border-[#D4AF37]/60 bg-white/90 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FFF8DF] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] sm:flex"
            >
              <span>
                <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#B58A18]">{t.offerBadge}</span>
                <span className="mt-0.5 block text-sm font-black text-[#4A1D43] sm:text-base">{t.offerTitle}</span>
                <span className="mt-0.5 block text-xs font-semibold text-gray-600">{t.offerDetail}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#4A1D43]" aria-hidden="true" />
            </button>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/subscription')}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#4A1D43] px-5 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(74,29,67,0.2)] transition hover:-translate-y-0.5 hover:bg-[#5B2553] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {t.primary}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/businesses')}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#D4AF37] bg-white px-5 py-3 text-sm font-bold text-[#4A1D43] transition hover:bg-[#FFF8DF] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {t.secondary}
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate('/subscription')}
              className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-[#D4AF37]/60 bg-[#FFF8DF] px-3 py-2.5 text-left shadow-sm sm:hidden"
            >
              <span>
                <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#B58A18]">{t.offerBadge}</span>
                <span className="block text-sm font-black text-[#4A1D43]">{t.offerTitle}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#4A1D43]" aria-hidden="true" />
            </button>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {[
                [CheckCircle2, t.proof1],
                [QrCode, t.proof2],
                [Share2, t.proof3],
              ].map(([Icon, label]) => {
                const FeatureIcon = Icon as typeof CheckCircle2;
                return (
                  <div key={String(label)} className="flex items-center gap-2 rounded-xl border border-[#D4AF37]/25 bg-white/75 px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm">
                    <FeatureIcon className="h-4 w-4 shrink-0 text-[#B58A18]" aria-hidden="true" />
                    <span>{String(label)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-[#D4AF37]/18 via-transparent to-[#4A1D43]/10 blur-2xl" aria-hidden="true" />
            <div className="relative rounded-[30px] border border-[#D4AF37]/45 bg-white/90 p-4 shadow-[0_28px_70px_rgba(74,29,67,0.16)] backdrop-blur-sm">
              <p className="mb-3 text-center text-[11px] font-bold text-[#4A1D43]">{t.example}</p>
              <div className="flex h-[310px] justify-center overflow-hidden sm:hidden">
                <img
                  src="/images/cv-business-portfolio-aux-saveurs-anis.png"
                  alt={`${t.example} — ${t.proof1}`}
                  className="h-[310px] w-auto object-contain object-top"
                  decoding="async"
                />
              </div>
              <div className="hidden justify-center sm:flex">
                <BusinessCardPreview variant="premium" size="compact" interactive language={lang} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CvBusinessJourney language={lang} />

      <section className="bg-[#2E102A] px-4 py-6 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <p className="font-serif text-xl font-bold md:text-2xl">{t.bridgeTitle}</p>
          <p className="mt-1 text-sm font-semibold text-[#F1D783] md:text-base">{t.bridgeText}</p>
        </div>
      </section>

      <section className="bg-white px-4 py-7 lg:hidden">
        <div className="mx-auto max-w-md rounded-3xl border border-[#D4AF37]/40 bg-[#FFFCF7] p-5 text-center shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-[#2E102A]">{t.platformTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">{t.platformText}</p>
          <button
            type="button"
            onClick={() => navigate('/businesses')}
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4A1D43] px-5 py-3 text-sm font-black text-white"
          >
            {t.platformCta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-expanded={showPlatformMobile}
            onClick={() => setShowPlatformMobile((current) => !current)}
            className="mt-3 text-sm font-bold text-[#4A1D43] underline decoration-[#D4AF37] underline-offset-4"
          >
            {showPlatformMobile ? t.platformDetailsClose : t.platformDetailsOpen}
          </button>
        </div>
      </section>

      {(isDesktop || showPlatformMobile) && (
        <div>
          <VisibilityHouseSection />

          <style>{`.platform-home-after-vitrine #maison-visibilite{display:none}`}</style>
          <div className="platform-home-after-vitrine">
            <PlatformHome />
          </div>
        </div>
      )}
    </div>
  );
}
