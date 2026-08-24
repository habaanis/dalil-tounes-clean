import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Tables } from '../lib/dbTables';
import { useLanguage } from '../context/LanguageContext';
import { getSupabaseImageUrl } from '../lib/imageUtils';
import { HERO_IMAGE_URL, HERO_IMAGE_JPG_URL } from '../constants/images';
import StructuredData from '../components/StructuredData';
import { generateCollectionPageSchema } from '../lib/structuredDataSchemas';

type PublicLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

type ResultRow = {
  id: string;
  nom?: string | null;
  ville?: string | null;
  description?: string | null;
  telephone?: string | null;
};

const COPY: Record<PublicLanguage, {
  title: string;
  subtitle: string;
  welcome1: string;
  welcome2: string;
  results: string;
  categories: [string, string, string, string, string, string];
  schemaNames: [string, string, string, string, string, string];
  schemaTitle: string;
  schemaDescription: string;
  flagAlt: string;
  ibnAlt: string;
  bourguibaAlt: string;
}> = {
  fr: {
    title: 'Citoyens',
    subtitle: 'Trouvez facilement les services et établissements de votre région',
    welcome1: "Parce qu'en Tunisie, l'accueil est une tradition…",
    welcome2: 'nous voulons que vous vous sentiez comme chez vous ❤️',
    results: 'Résultats de recherche',
    categories: ['Santé', 'Éducation', 'Services Citoyens', 'Tourisme & Expat', 'Commerces & Magasins', 'Loisirs & Événements'],
    schemaNames: ['Services de Santé', 'Services Administratifs', 'Éducation et Formation', 'Commerce et Shopping', 'Loisirs et Événements', 'Services Sociaux'],
    schemaTitle: 'Services Citoyens - Dalil Tounes',
    schemaDescription: 'Découvrez les services citoyens en Tunisie : santé, administration, éducation, commerces, loisirs et services sociaux.',
    flagAlt: 'Drapeau de la Tunisie - services citoyens sur Dalil Tounes',
    ibnAlt: 'Ibn Khaldoun, historien et penseur tunisien',
    bourguibaAlt: 'Habib Bourguiba, figure historique tunisienne',
  },
  ar: {
    title: 'المواطنون',
    subtitle: 'اعثر بسهولة على الخدمات والمؤسسات القريبة منك',
    welcome1: 'لأن حسن الاستقبال في تونس تقليد راسخ…',
    welcome2: 'نريدك في دليل تونس أن تشعر وكأنك في بيتك ❤️',
    results: 'نتائج البحث',
    categories: ['الصحة', 'التعليم', 'خدمات المواطنين', 'السياحة والاغتراب', 'المحلات والمتاجر', 'الترفيه والفعاليات'],
    schemaNames: ['الخدمات الصحية', 'الخدمات الإدارية', 'التعليم والتكوين', 'التجارة والتسوق', 'الترفيه والفعاليات', 'الخدمات الاجتماعية'],
    schemaTitle: 'خدمات المواطنين - دليل تونس',
    schemaDescription: 'اكتشف خدمات المواطنين في تونس: الصحة والإدارة والتعليم والتجارة والترفيه والخدمات الاجتماعية.',
    flagAlt: 'علم تونس - خدمات المواطنين على دليل تونس',
    ibnAlt: 'ابن خلدون، المؤرخ والمفكر التونسي',
    bourguibaAlt: 'الحبيب بورقيبة، شخصية تاريخية تونسية',
  },
  en: {
    title: 'Citizens',
    subtitle: 'Easily find services and establishments in your area',
    welcome1: 'In Tunisia, hospitality is a tradition…',
    welcome2: 'and on Dalil Tounes, we want you to feel at home ❤️',
    results: 'Search results',
    categories: ['Health', 'Education', 'Citizen Services', 'Tourism & Expat', 'Shops & Stores', 'Leisure & Events'],
    schemaNames: ['Health Services', 'Administrative Services', 'Education and Training', 'Shops and Shopping', 'Leisure and Events', 'Social Services'],
    schemaTitle: 'Citizen Services - Dalil Tounes',
    schemaDescription: 'Discover citizen services in Tunisia: health, administration, education, shops, leisure and social services.',
    flagAlt: 'Tunisian flag - citizen services on Dalil Tounes',
    ibnAlt: 'Ibn Khaldoun, Tunisian historian and thinker',
    bourguibaAlt: 'Habib Bourguiba, Tunisian historical figure',
  },
  it: {
    title: 'Cittadini',
    subtitle: 'Trova facilmente servizi e attività nella tua zona',
    welcome1: "In Tunisia l'ospitalità è una tradizione…",
    welcome2: 'e su Dalil Tounes vogliamo che tu ti senta a casa ❤️',
    results: 'Risultati della ricerca',
    categories: ['Salute', 'Istruzione', 'Servizi ai cittadini', 'Turismo & Espatrio', 'Negozi e Commerci', 'Tempo libero & Eventi'],
    schemaNames: ['Servizi sanitari', 'Servizi amministrativi', 'Istruzione e formazione', 'Commercio e shopping', 'Tempo libero ed eventi', 'Servizi sociali'],
    schemaTitle: 'Servizi ai cittadini - Dalil Tounes',
    schemaDescription: 'Scopri i servizi ai cittadini in Tunisia: salute, amministrazione, istruzione, commercio, tempo libero e servizi sociali.',
    flagAlt: 'Bandiera tunisina - servizi ai cittadini su Dalil Tounes',
    ibnAlt: 'Ibn Khaldoun, storico e pensatore tunisino',
    bourguibaAlt: 'Habib Bourguiba, figura storica tunisina',
  },
  ru: {
    title: 'Гражданам',
    subtitle: 'Легко находите услуги и организации рядом с вами',
    welcome1: 'В Тунисе гостеприимство — это традиция…',
    welcome2: 'и в Dalil Tounes мы хотим, чтобы вы чувствовали себя как дома ❤️',
    results: 'Результаты поиска',
    categories: ['Здоровье', 'Образование', 'Государственные услуги', 'Туризм и экспаты', 'Магазины', 'Досуг и события'],
    schemaNames: ['Медицинские услуги', 'Административные услуги', 'Образование и обучение', 'Магазины и покупки', 'Досуг и события', 'Социальные услуги'],
    schemaTitle: 'Услуги для граждан - Dalil Tounes',
    schemaDescription: 'Откройте услуги для граждан в Тунисе: здоровье, администрация, образование, магазины, досуг и социальная помощь.',
    flagAlt: 'Флаг Туниса - услуги для граждан на Dalil Tounes',
    ibnAlt: 'Ибн Хальдун, тунисский историк и мыслитель',
    bourguibaAlt: 'Хабиб Бургиба, историческая фигура Туниса',
  },
};

const CATEGORY_ROUTES = [
  { key: 'health', route: '/citizens/sante', image: 'sante.jpg', top: '12%', left: '18%', width: 220, height: 180, z: 10 },
  { key: 'education', route: '/education', image: 'education.jpg', top: '5%', left: '32%', width: 260, height: 210, z: 5 },
  { key: 'services', route: '/citizens/services', image: 'administratif.jpg', top: '7%', left: '55%', width: 240, height: 190, z: 8 },
  { key: 'tourism', route: '/citizens/tourisme', image: 'service-social.jpg', top: '30%', left: '30%', width: 300, height: 220, z: 20 },
  { key: 'shops', route: '/citizens/magasins', image: 'cat_magasin.jpg', top: '40%', left: '12%', width: 230, height: 190, z: 13 },
  { key: 'leisure', route: '/citizens/loisirs', image: 'loisir.jpg', top: '38%', left: '60%', width: 220, height: 180, z: 9 },
] as const;

export default function Citizens() {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const t = COPY[lang];
  const isRTL = lang === 'ar';
  const [results, setResults] = useState<ResultRow[]>([]);

  const url = new URL(window.location.href);
  const q = (url.searchParams.get('q') || '').trim();
  const ville = (url.searchParams.get('ville') || '').trim();

  useEffect(() => {
    if (!q && !ville) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const run = async () => {
      let query = supabase
        .from(Tables.ENTREPRISE)
        .select('id, nom, ville, telephone, description')
        .order('nom', { ascending: true })
        .limit(60);

      if (q) query = query.ilike('nom', `%${q}%`);
      if (ville) query = query.ilike('ville', `%${ville}%`);

      const { data } = await query;
      if (!cancelled) setResults((data ?? []) as ResultRow[]);
    };

    run();
    return () => { cancelled = true; };
  }, [q, ville]);

  const citizensItems = t.schemaNames.map((name, index) => ({
    name,
    url: `${window.location.origin}${CATEGORY_ROUTES[index].route}`,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 pb-24 pt-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <StructuredData data={generateCollectionPageSchema(t.schemaTitle, t.schemaDescription, citizensItems)} />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6 overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 z-0">
            <picture>
              <source srcSet={HERO_IMAGE_URL} type="image/webp" />
              <img src={HERO_IMAGE_JPG_URL} alt={t.flagAlt} className="h-full w-full object-cover opacity-50 blur-sm" loading="lazy" decoding="async" />
            </picture>
          </div>

          <div className="relative z-10 flex items-center justify-center gap-6 px-4 py-8">
            <img src={getSupabaseImageUrl('ibn-khaldoun.jpg')} alt={t.ibnAlt} className="hidden h-20 w-20 rounded-full object-cover shadow-xl sm:block md:h-28 md:w-28" loading="lazy" decoding="async" />
            <div className="text-center">
              <h1 className="mb-3 text-4xl font-light text-gray-900 md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>{t.title}</h1>
              <p className="mx-auto max-w-2xl text-lg font-medium text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>{t.subtitle}</p>
            </div>
            <img src={getSupabaseImageUrl('habib.jpg')} alt={t.bourguibaAlt} className="hidden h-20 w-20 rounded-full object-cover shadow-xl sm:block md:h-28 md:w-28" loading="lazy" decoding="async" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-12 text-center">
          <p className="text-xl font-light italic leading-relaxed text-gray-700 md:text-2xl">
            {t.welcome1}<br />
            <span>{lang === 'fr' ? 'et sur ' : lang === 'ar' ? 'وعلى ' : lang === 'en' ? 'and on ' : lang === 'it' ? 'e su ' : 'и в '}</span>
            <span className="font-semibold text-[#D62828]">Dalil Tounes</span>, {t.welcome2}
          </p>
        </motion.div>

        <div className="mx-auto mb-16 max-w-7xl px-4 md:px-8">
          <div className="relative flex h-auto w-full flex-col gap-3 bg-white md:block md:h-[800px] md:gap-0">
            {CATEGORY_ROUTES.map((category, index) => (
              <Link
                key={category.key}
                to={category.route}
                className="relative mx-auto h-32 w-[95%] cursor-pointer overflow-hidden rounded-lg border-2 border-[#D4AF37] no-underline transition-all duration-500 ease-out md:absolute md:mx-0 md:h-auto md:w-auto"
                style={{
                  top: category.top,
                  left: isRTL ? undefined : category.left,
                  right: isRTL ? category.left : undefined,
                  width: window.innerWidth >= 768 ? `${category.width}px` : '95%',
                  height: window.innerWidth >= 768 ? `${category.height}px` : '128px',
                  zIndex: category.z,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                }}
                onMouseEnter={(event) => {
                  const mobile = window.innerWidth < 768;
                  event.currentTarget.style.transform = mobile ? 'scale(1.03)' : 'scale(1.15)';
                  event.currentTarget.style.zIndex = '999';
                  event.currentTarget.style.boxShadow = '0 20px 50px rgba(212, 175, 55, 0.5)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = 'scale(1)';
                  event.currentTarget.style.zIndex = String(category.z);
                  event.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                }}
              >
                <img src={getSupabaseImageUrl(category.image)} alt="" className="absolute inset-0 h-full w-full object-cover brightness-[0.65]" loading="lazy" decoding="async" />
                <div className={`absolute inset-0 ${category.key === 'education' ? 'bg-gradient-to-b' : 'bg-gradient-to-t'} from-black/90 via-black/50 to-transparent`} />
                <div className={`pointer-events-none absolute left-0 right-0 z-10 p-3 ${category.key === 'education' ? 'top-0' : 'bottom-0'}`}>
                  <h2 className={`text-base font-light leading-tight tracking-wide text-[#D4AF37] md:text-lg ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)' }}>
                    {t.categories[index]}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {results.length > 0 && (
          <div className="mb-16 rounded-xl border-2 border-[#D4AF37] bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-medium text-gray-900">{t.results}</h2>
            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {results.map((result) => (
                <div key={result.id} className="rounded-xl border border-gray-100 p-4 transition hover:shadow-sm">
                  <h3 className="font-semibold text-gray-900">{result.nom}</h3>
                  <p className="text-sm text-gray-500">{result.ville}</p>
                  {result.description && <p className="mt-1 line-clamp-2 text-sm text-gray-600">{result.description}</p>}
                  {result.telephone && <a href={`tel:${result.telephone}`} className="mt-2 block text-sm font-medium text-[#4A1D43] hover:underline">📞 {result.telephone}</a>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
