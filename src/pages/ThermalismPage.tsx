import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/SEOHead';
import ThermalWellnessExplorer from '../components/ThermalWellnessExplorer';

const copy = {
  fr: { heading: 'Thermalisme, sources naturelles et bien-être', intro: 'Explorez les stations thermales et les lieux de bien-être en Tunisie, ainsi que les sources naturelles en cours de vérification.', health: 'Retour à Santé', tourism: 'Retour à Tourisme & Expat' },
  ar: { heading: 'الحمامات المعدنية والعيون الطبيعية والرفاه', intro: 'اكتشف المحطات الحرارية والعيون الطبيعية في تونس مع معلومات الوصول المتاحة.', health: 'العودة إلى الصحة', tourism: 'العودة إلى السياحة والإقامة' },
  en: { heading: 'Thermal baths, natural springs and wellness', intro: 'Explore Tunisia’s thermal facilities, wellness venues and natural springs awaiting access verification.', health: 'Back to Health', tourism: 'Back to Tourism & Expat' },
  it: { heading: 'Terme, sorgenti naturali e benessere', intro: 'Scopri le strutture termali, il benessere e le sorgenti naturali della Tunisia.', health: 'Torna alla salute', tourism: 'Torna a Turismo ed espatriati' },
  ru: { heading: 'Термальные купальни, природные источники и отдых', intro: 'Откройте термальные комплексы и природные источники Туниса.', health: 'Назад к здоровью', tourism: 'Назад к туризму' },
} as const;

export default function ThermalismPage() {
  const { language } = useLanguage();
  const lang = (language in copy ? language : 'fr') as keyof typeof copy;
  const c = copy[lang];
  return <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="public-surface min-h-screen bg-[#fcfaf5] pb-12">
    <SEOHead title={c.heading + ' | Dalil Tounes'} description={c.intro} canonical="https://dalil-tounes.com/citizens/health/thermalisme" currentPath="/citizens/health/thermalisme" />
    <header className="bg-[#4A1D43] px-4 py-8 text-center text-white">
      <h1 className="public-title text-2xl font-semibold text-[#D4AF37] sm:text-3xl">♨️ {c.heading}</h1>
      <p className="mx-auto mt-2 max-w-3xl text-sm">{c.intro}</p>
    </header>
    <nav className="mx-auto mt-5 flex max-w-5xl flex-wrap justify-center gap-3 px-4" aria-label={c.heading}>
      <Link className="rounded-full border border-[#D4AF37] bg-white px-4 py-2 text-sm font-semibold text-[#292725]" to="/citizens/health">{c.health}</Link>
      <Link className="rounded-full border border-[#D4AF37] bg-white px-4 py-2 text-sm font-semibold text-[#292725]" to="/citizens/tourism">{c.tourism}</Link>
    </nav>
    <ThermalWellnessExplorer />
  </main>;
}
