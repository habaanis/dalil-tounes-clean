import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const story = {
 fr: {tag:'Le mot du fondateur',title:'Pourquoi j’ai créé Dalil Tounes',name:'Anis Haba — Fondateur',intro:'En Tunisie, lorsqu’on cherche un professionnel, on demande souvent autour de soi. Ce bouche-à-oreille rend bien des services, mais le résultat ne répond pas toujours à nos attentes. Et que deviennent les bons professionnels que notre entourage ne connaît pas ?',detail:'J’ai voulu faciliter la découverte des entreprises et de leurs savoir-faire, avec des CV Business et CV Portfolio pour leur permettre de se présenter. Dalil Tounes réunit aussi les services citoyens, le tourisme local, les informations pour expatriés et l’emploi. La Tunisie, ce sont ses plages, mais aussi l’intérieur du pays, ses traditions et son âme.',end:'Le site contient déjà des informations utiles et continuera de s’enrichir, région après région.',cta:'Découvrir mon histoire'},
 en: {tag:'From the founder',title:'Why I created Dalil Tounes',name:'Anis Haba — Founder',intro:'In Tunisia, people often ask family and friends to recommend a professional. It helps, but the result is not always satisfactory. And what about good professionals whom nobody around us knows?',detail:'I wanted to make it easier to discover businesses and their work, and let them introduce themselves through CV Business and CV Portfolio. Dalil Tounes also covers citizen services, local tourism, expatriate information and jobs — including Tunisia’s inland regions, traditions and cultural life.',end:'Useful information is already available, and the platform will keep growing, region by region.',cta:'Discover my story'},
 ar: {tag:'كلمة المؤسس',title:'لماذا أنشأت دليل تونس',name:'أنيس حبّة — المؤسس',intro:'في تونس، نسأل غالبًا الأهل والأصدقاء عن مهني نحتاج إليه. هذه الطريقة مفيدة، لكنها لا تضمن دائمًا نتيجة مرضية. وماذا عن المهنيين الجيدين الذين لا يعرفهم المحيطون بنا؟',detail:'أردت تسهيل اكتشاف المؤسسات وأعمالها، ومنحها فرصة لتقديم نفسها عبر CV Business وCV Portfolio. ويجمع دليل تونس أيضًا خدمات المواطنين والسياحة المحلية ومعلومات المقيمين بالخارج وفرص العمل، مع الاهتمام بالمناطق الداخلية وتقاليد البلاد وروحها.',end:'تتوفر بالفعل معلومات مفيدة على المنصة، وستواصل التوسع منطقة بعد أخرى.',cta:'اكتشف قصتي'}
} as const;
export function FounderStory({full=false}:{full?:boolean}) {
 const { language } = useLanguage();
 const t = story[language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'];
 return <section className="bg-white px-4 py-10 md:py-16" aria-label={t.title}>
  <div className="mx-auto grid max-w-6xl gap-6 rounded-3xl border border-[#D4AF37]/40 bg-[#FFFCF7] p-5 shadow-sm md:grid-cols-[190px_1fr] md:p-8">
   <div><img src="https://lienora.fr/brand/anis-haba-founder.jpg" alt="Anis Haba" loading="lazy" className="h-56 w-44 rounded-xl object-cover" /><p className="mt-3 text-sm font-bold text-[#4A1D43]">{t.name}</p></div>
   <div><p className="text-xs font-semibold uppercase tracking-widest text-[#A58128]">{t.tag}</p><h2 className="mt-2 font-serif text-2xl font-bold text-[#4A1D43] md:text-3xl">{t.title}</h2><p className="mt-4 leading-8 text-gray-700">{t.intro}</p>{full && <><p className="mt-4 leading-8 text-gray-700">{t.detail}</p><p className="mt-4 leading-8 text-gray-700">{t.end}</p></>}{!full && <Link to="/pourquoi-dalil-tounes#histoire-fondateur" className="mt-5 inline-flex rounded-xl border border-[#D4AF37] px-5 py-3 font-semibold text-[#4A1D43] hover:bg-[#FFF4D0]">{t.cta}</Link>}</div>
  </div>
 </section>;
}
