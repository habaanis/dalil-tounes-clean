import { FounderStory } from './FounderStory';
import { DALIL_MASCOT_IMAGE } from '../lib/dalilMascotImage';
import SearchBar from './SearchBar';
import { Building2, ShieldCheck, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PlatformAppHelp from './PlatformAppHelp';

type Lang = 'fr' | 'ar' | 'en' | 'it' | 'ru';
const COPY: Record<Lang, {
  headline: string; intro: string; search: string; count: (n: string) => string;
  certified: (n: string) => string; legacyCertified: (n: string) => string; recommended: (n: string) => string; recommendedRule: string; discoverCopy: string; citizens: string; citizensDetail: string;
  tourism: string; tourismDetail: string; businesses: string; businessesDetail: string;
  recommend: string; recommendDetail: string; review: string; certifiedHint: string;
  founder: string; founderDetail: string; founderAction: string;
  free: string; freeDetail: string; freeAction: string; more: string;
}> = {
  fr: {
    headline: 'La Tunisie à portée de main', intro: 'Trouvez une entreprise, un service ou une découverte près de chez vous.',
    search: 'Rechercher en Tunisie', count: n => `Déjà ${n} fiches enregistrées.`, certified: n => `${n} CV Business ou Portfolio publiés.`, legacyCertified: n => `${n} fiches portant la mention « Certifié Dalil Tounes ».`, recommended: n => `${n} entreprises recommandées par les clients.`,   discoverCopy: 'Découvrez les activités publiées sur Dalil Tounes.', recommendedRule: 'Note Google d’au moins 4/5 et minimum 5 avis.',
    citizens: 'Citoyens', citizensDetail: 'Santé, éducation, services et commerces',
    tourism: 'Tourisme & Expat', tourismDetail: 'Visites, régions et installation en Tunisie',
    businesses: 'Entreprises', businessesDetail: 'Présence gratuite et mini-appli professionnelle',
    recommend: 'Trouver des professionnels', recommendDetail: 'Explorez les entreprises selon les métiers, les villes et les avis.',
    review: 'Avis Google indépendants des offres', certifiedHint: 'CV Business ou Portfolio publié',
    founder: 'Pourquoi j’ai créé Dalil Tounes', founderDetail: 'Faire découvrir les bons professionnels, les services utiles et les richesses de toute la Tunisie.',
    founderAction: 'Découvrir mon histoire', free: 'Vous êtes professionnel ?', freeDetail: 'Faites connaître votre activité gratuitement ou créez votre mini-appli professionnelle.',
    freeAction: 'Découvrir les offres', more: 'Tous les services',
  },
  ar: {
    headline: 'تونس الكل في يدك', intro: 'اكتشف مؤسسات وخدمات وأماكن في تونس.',
    search: 'ابحث في تونس', count: n => `تم تسجيل ${n} مؤسسة.`, certified: n => `${n} ملفات CV منشورة.`, legacyCertified: n => `${n} بطاقات تحمل علامة « موثّق من دليل تونس ».`, recommended: n => `${n} مؤسسات موصى بها من الحرفاء.`,   discoverCopy: 'اكتشف الأنشطة المنشورة على دليل تونس.', recommendedRule: 'تقييم Google لا يقل عن 4/5 وبـ5 تقييمات على الأقل.',
    citizens: 'المواطنون', citizensDetail: 'الصحة والتعليم والخدمات والمحلات',
    tourism: 'السياحة والمقيمون', tourismDetail: 'جهات وزيارات وإقامة في تونس',
    businesses: 'المؤسسات', businessesDetail: 'حضور مجاني وسيرة مهنية رقمية',
    recommend: 'اكتشف المهنيين', recommendDetail: 'ابحث حسب المهنة والمدينة وتقييمات الحرفاء.',
    review: 'تقييمات Google مستقلة عن الاشتراك', certifiedHint: 'CV Business أو Portfolio منشور',
    founder: 'علاش عملت دليل تونس', founderDetail: 'باش نعرّف بالمهنيين والخدمات وثروات تونس الكل.',
    founderAction: 'اكتشف حكايتي', free: 'عندك مؤسسة؟', freeDetail: 'سجّل نشاطك مجانًا أو اكتشف العرض المهني.',
    freeAction: 'اكتشف العروض', more: 'كل الخدمات',
  },
  en: {
    headline: 'Tunisia at your fingertips', intro: 'Find businesses, services and local discoveries across Tunisia.',
    search: 'Search Tunisia', count: n => `Already ${n} businesses registered.`, certified: n => `${n} published Business or Portfolio CVs.`, legacyCertified: n => `${n} listings carrying the “Certified Dalil Tounes” label.`, recommended: n => `${n} businesses recommended by customers.`,   discoverCopy: 'Explore the activities published on Dalil Tounes.', recommendedRule: 'Google rating of at least 4/5 and 5 or more reviews.',
    citizens: 'Citizens', citizensDetail: 'Health, education, services and shops',
    tourism: 'Travel & Expat', tourismDetail: 'Explore Tunisia and plan your stay',
    businesses: 'Businesses', businessesDetail: 'Free listing and a business mini-app',
    recommend: 'Find professionals', recommendDetail: 'Explore by trade, town and customer reviews.',
    review: 'Google reviews independent of plans', certifiedHint: 'Published Business or Portfolio CV',
    founder: 'Why I created Dalil Tounes', founderDetail: 'Help people discover local professionals, useful services and every region.',
    founderAction: 'Read my story', free: 'Own a business?', freeDetail: 'List your business free or explore professional CVs.',
    freeAction: 'Explore plans', more: 'All services',
  },
  it: {
    headline: 'La Tunisia a portata di mano', intro: 'Trova imprese, servizi e luoghi da scoprire.',
    search: 'Cerca in Tunisia', count: n => `Già ${n} schede registrate.`, certified: n => `${n} CV Business o Portfolio pubblicati.`, legacyCertified: n => `${n} schede con la dicitura « Certificato Dalil Tounes ».`, recommended: n => `${n} imprese consigliate dai clienti.`,   discoverCopy: 'Scopri le attività pubblicate su Dalil Tounes.', recommendedRule: 'Valutazione Google di almeno 4/5 e minimo 5 recensioni.',
    citizens: 'Cittadini', citizensDetail: 'Salute, istruzione, servizi e negozi',
    tourism: 'Turismo & Expat', tourismDetail: 'Scopri il paese e organizza il soggiorno',
    businesses: 'Imprese', businessesDetail: 'Presenza gratuita e mini-app professionale',
    recommend: 'Trova professionisti', recommendDetail: 'Cerca per attività, città e recensioni.',
    review: 'Recensioni Google indipendenti dai piani', certifiedHint: 'CV Business o Portfolio pubblicato',
    founder: 'Perché ho creato Dalil Tounes', founderDetail: 'Far conoscere professionisti, servizi e regioni della Tunisia.',
    founderAction: 'Leggi la mia storia', free: 'Hai un’impresa?', freeDetail: 'Registra gratuitamente la tua attività o scopri i CV.',
    freeAction: 'Scopri le offerte', more: 'Tutti i servizi',
  },
  ru: {
    headline: 'Тунис под рукой', intro: 'Найдите компании, услуги и интересные места.',
    search: 'Поиск по Тунису', count: n => `Уже зарегистрировано ${n} организаций.`, certified: n => `${n} опубликованных CV Business или Portfolio.`, legacyCertified: n => `${n} карточек с отметкой « Сертифицировано Dalil Tounes ».`, recommended: n => `${n} компаний рекомендуют клиенты.`,   discoverCopy: 'Откройте компании, опубликованные на Dalil Tounes.', recommendedRule: 'Оценка Google не ниже 4/5 и не менее 5 отзывов.',
    citizens: 'Гражданам', citizensDetail: 'Здоровье, образование, услуги и магазины',
    tourism: 'Туризм и переезд', tourismDetail: 'Откройте Тунис и планируйте пребывание',
    businesses: 'Компаниям', businessesDetail: 'Бесплатное размещение и мини-приложение',
    recommend: 'Найти специалистов', recommendDetail: 'Поиск по профессии, городу и отзывам.',
    review: 'Отзывы Google не зависят от тарифа', certifiedHint: 'Опубликованный CV Business или Portfolio',
    founder: 'Почему я создал Dalil Tounes', founderDetail: 'Помогаем находить специалистов, услуги и открывать регионы страны.',
    founderAction: 'Моя история', free: 'У вас бизнес?', freeDetail: 'Добавьте компанию бесплатно или изучите CV.',
    freeAction: 'Узнать об услугах', more: 'Все услуги',
  },
};

export default function PlatformAppHome({ totalCount, legacyCertifiedCount, recommendedCount }: {
  totalCount?: string | null; legacyCertifiedCount?: string | null; recommendedCount?: string | null;
}) {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as Lang;
  const t = COPY[lang];
  return <div data-home-color-test="rouge-or-v2" className="space-y-4 bg-[#FAF9F6] px-3 py-4">
    <section className="rounded-2xl border border-[#C9A65D] border-l-[4px] border-l-[#B8954F] bg-gradient-to-br from-white via-white to-[#FFF4E6] px-4 py-5 shadow-[0_4px_20px_rgba(35,32,28,0.035)]">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wide text-[#B62226]">🇹🇳 DALIL TOUNES</p>
          <h1 className="mt-1 font-serif text-xl font-semibold leading-tight text-[#242424]">{t.headline}</h1>
          <p className="mt-1 text-xs leading-5 text-[#64605D]">{t.intro}</p>
        </div>
        <img src={DALIL_MASCOT_IMAGE} alt="Mascotte Dalil Tounes"
          className="h-[82px] w-[76px] shrink-0 rounded-xl border border-[#D4B575] bg-[#FCFAF5] object-contain" loading="lazy" decoding="async" />
      </div>
    </section>
    <section className="relative z-10 rounded-2xl border border-[#C9A65D] bg-[#FFFCF8] p-3.5 shadow-[0_2px_14px_rgba(30,25,20,0.03)]" aria-label={t.search}>
      <h2 className="mb-2 font-serif text-base font-semibold text-[#242424]">{t.search}</h2>
      <SearchBar scope="global" autoSearch resultMode="redirectToResults" />
    </section>
    <section className="rounded-xl border border-[#C9A65D] bg-gradient-to-br from-[#FFF5E7] to-[#FFFCF7] px-4 py-4 text-center shadow-sm" aria-label="Dalil Tounes et mini-appli professionnelle">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#242424]">{lang === 'fr' ? 'Vous êtes professionnel ?' : lang === 'ar' ? 'عندك مؤسسة؟' : lang === 'en' ? 'Are you a professional?' : lang === 'it' ? 'Sei un professionista?' : 'Вы профессионал?'}</p>
      <p className="text-sm font-semibold leading-5 text-[#292929]">{lang === 'ar' ? 'خلّي مؤسستك موجودة في دليل تونس.' : lang === 'en' ? 'Get listed on Dalil Tounes.' : lang === 'it' ? 'Fai conoscere la tua attività su Dalil Tounes.' : lang === 'ru' ? 'Разместите свою компанию на Dalil Tounes.' : 'Soyez répertorié sur Dalil Tounes.'}</p>
      <p className="mt-1 text-xs leading-5 text-[#66615D]">{lang === 'ar' ? 'عزّز حضور نشاطك عبر تطبيق مصغّر مهني خاص بمؤسستك.' : lang === 'en' ? 'Give your business greater impact with your own business mini-app.' : lang === 'it' ? 'Dai più visibilità alla tua attività con una mini-app personalizzata.' : lang === 'ru' ? 'Представьте бизнес с помощью собственного мини-приложения.' : 'Développez votre visibilité avec votre mini-appli professionnelle.'}</p>
    </section>
    <PlatformAppHelp language={lang} />
    <section aria-label={t.count(totalCount ?? '—')} className="rounded-xl border border-[#C9A65D] bg-[#FFFDF9] px-4 py-4 shadow-[0_2px_12px_rgba(30,25,20,0.025)]" aria-live="polite">
      <div className="flex items-start gap-2.5">
        <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#B28A44]" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5 text-[#9B2027]">{totalCount === null || totalCount === undefined ? '—' : t.count(totalCount)}</p>
          <p className="mt-0.5 text-xs leading-5 text-[#6B6762]">{t.discoverCopy}</p>
        </div>
      </div>
      {legacyCertifiedCount !== null && legacyCertifiedCount !== undefined && <div className="mt-2 flex items-start gap-2.5 border-t border-[#EEE8E0] pt-2">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#B28A44]" aria-hidden="true" />
        <p className="text-xs font-medium leading-5 text-[#44403C]">{t.legacyCertified(legacyCertifiedCount)}</p>
      </div>}
      {recommendedCount !== null && recommendedCount !== undefined && <div className="mt-2 flex items-start gap-2.5 border-t border-[#EEE8E0] pt-2">
        <Star className="mt-0.5 h-4 w-4 shrink-0 text-[#B28A44]" aria-hidden="true" />
        <div><p className="text-xs font-medium leading-5 text-[#44403C]">{t.recommended(recommendedCount)}</p><p className="mt-0.5 text-[11px] leading-4 text-[#736C66]">{t.recommendedRule}</p></div>
      </div>}
    </section>


    {/* Preview-only visual accents for components shared with the classic site. */}
    <style>{`
      [data-home-color-test="rouge-or-v2"] [data-platform-app-founder] {
        border: 1px solid #c9a65d; background: linear-gradient(135deg,#fffdfa 0%,#fff7ec 100%);
        box-shadow: 0 3px 16px rgba(84,45,27,.045);
      }
      [data-home-color-test="rouge-or-v2"] [data-platform-app-founder] h2 {
        color:#242424;
      }
      [data-home-color-test="rouge-or-v2"] [data-platform-app-founder] details {
        border-color:#c9a65d; background:white;
      }
      [data-home-color-test="rouge-or-v2"] [data-platform-app-founder] summary { color:#242424; }
      [data-home-color-test="rouge-or-v2"] [data-platform-app-founder] [class*="text-[#4A1D43]"] { color:#242424; }
      [data-home-color-test="rouge-or-v2"] [data-platform-app-founder] details h3 { color:#242424; }
      [data-home-color-test="rouge-or-v2"] .public-search button[type="submit"] {
        background:#ad242b; color:white; border-color:#ad242b;
      }
      [data-home-color-test="rouge-or-v2"] .public-search button[type="submit"]:hover { background:#8d1c23; }
      [data-home-color-test="rouge-or-v2"] .public-search input[type="search"] { border-color:#c9a65d; }
      [data-home-color-test="rouge-or-v2"] .public-search input:focus {
        border-color:#bd9958; box-shadow:0 0 0 1px #bd9958;
      }
      [data-home-color-test="rouge-or-v2"] [data-app-help] details { border-color:#c9a65d; background:#fffdfa; }
      [data-home-color-test="rouge-or-v2"] [data-app-help] summary { color:#98252a; }
    `}</style>

    <FounderStory compact />

  </div>;
}
