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
  chooseTitle: string;
  welcome1: string;
  welcome2: string;
  results: string;
  categories: [string, string, string, string, string, string];
  schemaNames: [string, string, string, string, string, string];
  schemaTitle: string;
  schemaDescription: string;
  flagAlt: string;
}> = {
  fr: {
    title: "Que recherchez-vous aujourd’hui ?",
    subtitle: 'Choisissez une rubrique pour trouver rapidement un professionnel, un commerce ou un service près de chez vous.',
    chooseTitle: 'Choisissez votre rubrique',
    welcome1: "Parce qu'en Tunisie, l'accueil est une tradition…",
    welcome2: 'nous voulons que vous vous sentiez comme chez vous ❤️',
    results: 'Résultats de recherche',
    categories: ['Santé', 'Éducation', 'Services Citoyens', 'Tourisme & Expat', 'Commerces & Magasins', 'Loisirs & Événements'],
    schemaNames: ['Services de Santé', 'Services Administratifs', 'Éducation et Formation', 'Commerce et Shopping', 'Loisirs et Événements', 'Services Sociaux'],
    schemaTitle: 'Services Citoyens - Dalil Tounes',
    schemaDescription: 'Découvrez les services citoyens en Tunisie : santé, administration, éducation, commerces, loisirs et services sociaux.',
    flagAlt: 'Drapeau de la Tunisie - services citoyens sur Dalil Tounes',
  },
  ar: {
    title: 'ماذا تبحث عنه اليوم؟',
    subtitle: 'اختر قسماً للعثور بسرعة على مهني أو متجر أو خدمة بالقرب منك.',
    chooseTitle: 'اختر القسم المناسب',
    welcome1: 'لأن حسن الاستقبال في تونس تقليد راسخ…',
    welcome2: 'نريدك أن تشعر وكأنك في بيتك ❤️',
    results: 'نتائج البحث',
    categories: ['الصحة', 'التعليم', 'خدمات المواطنين', 'السياحة والاغتراب', 'المحلات والمتاجر', 'الترفيه والفعاليات'],
    schemaNames: ['الخدمات الصحية', 'الخدمات الإدارية', 'التعليم والتكوين', 'التجارة والتسوق', 'الترفيه والفعاليات', 'الخدمات الاجتماعية'],
    schemaTitle: 'خدمات المواطنين - دليل تونس',
    schemaDescription: 'اكتشف خدمات المواطنين في تونس: الصحة والإدارة والتعليم والتجارة والترفيه والخدمات الاجتماعية.',
    flagAlt: 'علم تونس - خدمات المواطنين على دليل تونس',
  },
  en: {
    title: 'What are you looking for today?',
    subtitle: 'Choose a category to quickly find a professional, shop or service near you.',
    chooseTitle: 'Choose a category',
    welcome1: 'In Tunisia, hospitality is a tradition…',
    welcome2: 'we want you to feel at home ❤️',
    results: 'Search results',
    categories: ['Health', 'Education', 'Citizen Services', 'Tourism & Expat', 'Shops & Stores', 'Leisure & Events'],
    schemaNames: ['Health Services', 'Administrative Services', 'Education and Training', 'Shops and Shopping', 'Leisure and Events', 'Social Services'],
    schemaTitle: 'Citizen Services - Dalil Tounes',
    schemaDescription: 'Discover citizen services in Tunisia: health, administration, education, shops, leisure and social services.',
    flagAlt: 'Tunisian flag - citizen services on Dalil Tounes',
  },
  it: {
    title: 'Cosa cerchi oggi?',
    subtitle: 'Scegli una categoria per trovare rapidamente un professionista, un negozio o un servizio vicino a te.',
    chooseTitle: 'Scegli una categoria',
    welcome1: "In Tunisia l'ospitalità è una tradizione…",
    welcome2: 'vogliamo che tu ti senta a casa ❤️',
    results: 'Risultati della ricerca',
    categories: ['Salute', 'Istruzione', 'Servizi ai cittadini', 'Turismo & Espatrio', 'Negozi e Commerci', 'Tempo libero & Eventi'],
    schemaNames: ['Servizi sanitari', 'Servizi amministrativi', 'Istruzione e formazione', 'Commercio e shopping', 'Tempo libero ed eventi', 'Servizi sociali'],
    schemaTitle: 'Servizi ai cittadini - Dalil Tounes',
    schemaDescription: 'Scopri i servizi ai cittadini in Tunisia: salute, amministrazione, istruzione, commercio, tempo libero e servizi sociali.',
    flagAlt: 'Bandiera tunisina - servizi ai cittadini su Dalil Tounes',
  },
  ru: {
    title: 'Что вы ищете сегодня?',
    subtitle: 'Выберите категорию, чтобы быстро найти специалиста, магазин или услугу рядом с вами.',
    chooseTitle: 'Выберите категорию',
    welcome1: 'В Тунисе гостеприимство — это традиция…',
    welcome2: 'мы хотим, чтобы вы чувствовали себя как дома ❤️',
    results: 'Результаты поиска',
    categories: ['Здоровье', 'Образование', 'Государственные услуги', 'Туризм и экспаты', 'Магазины', 'Досуг и события'],
    schemaNames: ['Медицинские услуги', 'Административные услуги', 'Образование и обучение', 'Магазины и покупки', 'Досуг и события', 'Социальные услуги'],
    schemaTitle: 'Услуги для граждан - Dalil Tounes',
    schemaDescription: 'Откройте услуги для граждан в Тунисе: здоровье, администрация, образование, магазины, досуг и социальная помощь.',
    flagAlt: 'Флаг Туниса - услуги для граждан на Dalil Tounes',
  },
};

const CATEGORY_ROUTES = [
  { key: 'health', route: '/citizens/sante', image: 'sante.jpg' },
  { key: 'education', route: '/education', image: 'education.jpg' },
  { key: 'services', route: '/citizens/services', image: 'cat_administratif.jpg' },
  { key: 'tourism', route: '/citizens/tourisme', image: 'service-social.jpg' },
  { key: 'shops', route: '/citizens/shops', image: 'cat_magasin.jpg' },
  { key: 'leisure', route: '/citizens/loisirs', image: 'loisir.jpg' },
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

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 overflow-hidden rounded-3xl border border-[#D4AF37]/30"
        >
          <div className="absolute inset-0 z-0">
            <picture>
              <source srcSet={HERO_IMAGE_URL} type="image/webp" />
              <img src={HERO_IMAGE_JPG_URL} alt={t.flagAlt} className="h-full w-full object-cover opacity-35" loading="lazy" decoding="async" />
            </picture>
          </div>
          <div className="absolute inset-0 bg-white/65" />

          <div className="relative z-10 px-5 py-8 text-center sm:px-8 md:py-10">
            <h1 className="text-3xl font-bold text-[#4A1D43] md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>{t.title}</h1>
            <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-gray-700 md:text-lg">{t.subtitle}</p>
          </div>
        </motion.div>

        {results.length > 0 && (
          <div className="mb-8 rounded-2xl border border-[#D4AF37]/40 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-[#4A1D43]">{t.results}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} aria-labelledby="citizen-categories">
          <h2 id="citizen-categories" className="mb-4 text-center text-2xl font-bold text-[#4A1D43] md:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>{t.chooseTitle}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {CATEGORY_ROUTES.map((category, index) => (
              <Link
                key={category.key}
                to={category.route}
                className="group relative h-32 overflow-hidden rounded-2xl border border-[#D4AF37]/70 bg-[#4A1D43] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 sm:h-40 md:h-44"
              >
                <img src={getSupabaseImageUrl(category.image)} alt="" className="absolute inset-0 h-full w-full object-cover brightness-[0.65]" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
                  <h3 className={`text-base font-bold leading-tight text-white md:text-lg ${isRTL ? 'text-right' : 'text-left'}`} style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)' }}>
                    {t.categories[index]}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        <div className="mt-8 rounded-2xl border border-[#D4AF37]/30 bg-white px-5 py-4 text-center shadow-sm">
          <p className="text-base italic leading-7 text-gray-700">
            {t.welcome1}{' '}
            <span>{lang === 'fr' ? 'et sur ' : lang === 'ar' ? 'وعلى ' : lang === 'en' ? 'and on ' : lang === 'it' ? 'e su ' : 'и в '}</span>
            <span className="font-semibold text-[#D62828]">Dalil Tounes</span>, {t.welcome2}
          </p>
        </div>
      </div>
    </div>
  );
}
