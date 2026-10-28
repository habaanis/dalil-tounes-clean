import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const story = {
  "fr": {
    "tag": "Le mot du fondateur",
    "title": "Pourquoi j’ai créé Dalil Tounes",
    "name": "Anis Haba — Fondateur",
    "intro": "En Tunisie, lorsqu'on cherche un artisan, un professionnel ou une entreprise, on demande souvent à la famille, aux amis ou aux voisins. Le bouche-à-oreille rend bien des services, mais il arrive aussi qu'on ne soit pas satisfait du résultat. Et puis, il y a tous les bons professionnels que personne dans notre entourage ne connaît.",
    "paragraphs": [
      "Quand on cherche un artisan, un professionnel ou simplement un service en Tunisie, qu'est-ce qu'on fait généralement ? On demande autour de soi.",
      "« Tu connais un bon plombier ? » « Tu n'aurais pas quelqu'un à me conseiller ? » « Tu connais une entreprise qui fait ça ? »",
      "On appelle un ami, un voisin, quelqu'un de la famille… Et bien souvent, on finit par trouver. Mais parfois, le résultat n'est pas celui qu'on espérait. Ce qui convenait très bien à une personne ne convient pas forcément à une autre.",
      "Et puis, je me suis fait cette réflexion : combien de bons professionnels passent inaperçus simplement parce qu'on ne connaît personne pour nous les recommander ?",
      "C'est de là que tout est parti",
      "Je me suis demandé pourquoi on ne pourrait pas chercher directement un métier, une activité ou un service dans une ville, et découvrir plusieurs professionnels. Pas uniquement les plus connus, ni ceux qui publient le plus sur Facebook.",
      "Il y a des artisans qui travaillent très bien, des petites entreprises qui ont des années d'expérience, mais qui ne savent pas toujours comment se faire connaître. Et quand on ne connaît pas leur nom, il est parfois difficile de les trouver. Je trouvais ça dommage.",
      "C'est comme ça que j'ai commencé à imaginer Dalil Tounes.",
      "Mais trouver une entreprise ne suffit pas toujours",
      "Je me suis aussi dit qu'une fois le professionnel trouvé, il fallait pouvoir découvrir ce qu'il fait réellement : voir son travail, ses services, ses réalisations, ses photos… Parce qu'avant de contacter quelqu'un, on aime bien savoir à qui on a affaire.",
      "C'est pour cela que j'ai voulu intégrer les CV Business et CV Portfolio. L'entreprise peut présenter son activité, mais aussi garder cette présentation sur son téléphone et la partager avec un lien ou un QR Business.",
      "Pour moi, c'était important que Dalil Tounes serve aussi bien à celui qui cherche un professionnel qu'à celui qui souhaite faire connaître son travail.",
      "Et puis, il y a toute la Tunisie…",
      "En avançant sur le projet, je me suis rendu compte que je ne voulais pas m'arrêter aux entreprises. Quand on parle de la Tunisie, on pense souvent à ses plages, à ses hôtels, à ses grandes villes. Mais la Tunisie, ce n'est pas seulement ça.",
      "Il y a aussi l'intérieur du pays. Des villages, des marchés, des traditions, des artisans, des festivals, des paysages et des endroits dont on entend rarement parler. Et surtout, il y a les gens qui font vivre tout cela.",
      "Je trouve dommage qu'on connaisse parfois mieux certaines destinations touristiques que les richesses qui se trouvent à quelques kilomètres de chez nous. J'aimerais que Dalil Tounes permette aussi de découvrir cette autre Tunisie, celle qui fait partie de son âme.",
      "Un site qui peut servir à tout le monde",
      "Petit à petit, d'autres idées sont venues. Pourquoi ne pas faciliter aussi la recherche des services de santé, d'éducation ou des informations pratiques pour les citoyens ? Pourquoi ne pas aider ceux qui vivent à l'étranger, ou ceux qui viennent s'installer en Tunisie, à trouver plus facilement ce dont ils ont besoin ?",
      "Et pourquoi ne pas rapprocher aussi les personnes qui cherchent un emploi des entreprises qui recrutent ? C'est ainsi que Dalil Tounes a commencé à prendre une autre dimension.",
      "Avec ses pages Citoyens, le tourisme local, les informations pour expatriés, l'emploi et les présentations professionnelles, je voudrais en faire un endroit où chacun puisse trouver quelque chose d'utile.",
      "Une aventure qui ne fait que commencer",
      "Aujourd'hui, Dalil Tounes existe déjà. On peut y trouver des entreprises, des professionnels, des services et des informations. Bien sûr, il reste énormément de choses à ajouter. Et je pense qu'il en restera toujours.",
      "Chaque ville a ses professionnels, chaque région ses particularités, chaque village ses histoires et ses découvertes. Je ne cherche pas à créer un site qui prétend tout connaître de la Tunisie. J'aimerais simplement qu'il grandisse avec elle.",
      "Qu'un habitant puisse y trouver un professionnel qu'il ne connaissait pas. Qu'une petite entreprise puisse être découverte par de nouveaux clients. Qu'une famille trouve une activité à faire dans sa région. Ou qu'une personne découvre un endroit de Tunisie dont elle n'avait jamais entendu parler.",
      "Si Dalil Tounes peut déjà rendre ces services, alors il commence à remplir le rôle que j'avais imaginé. Et la suite, nous la construirons progressivement."
    ],
    "cta": "Découvrir mon histoire"
  },
  "en": {
    "tag": "From the founder",
    "title": "Why I created Dalil Tounes",
    "name": "Anis Haba — Founder",
    "intro": "In Tunisia, when we look for a professional, we often ask family, friends or neighbours. Recommendations help, but do not always meet our needs. And many skilled professionals remain unknown.",
    "paragraphs": [
      "I am Anis Haba, founder of Dalil Tounes. The idea began with a simple observation.",
      "In Tunisia, when we look for a professional, we often ask family, friends or neighbours. Recommendations help, but do not always meet our needs. And many skilled professionals remain unknown.",
      "I wanted people to find businesses by profession, activity and town, and discover several options instead of just one recommendation.",
      "Many Tunisian companies share work on social media, while others have less visibility despite their experience. With CV Business and CV Portfolio they can present services, work, photos and contact details via a personal link and QR Business.",
      "Tunisia is much more than its businesses and beaches. Its inland regions, villages, crafts, traditions, festivals and people are part of its soul.",
      "That is why Dalil Tounes also covers citizen services, local tourism, expatriate information and employment.",
      "The platform already contains useful information, and there will always be more to add, region by region. I want it to keep growing and help people discover professionals and Tunisia's richness."
    ],
    "cta": "Discover my story"
  },
  "ar": {
    "tag": "كلمة المؤسس",
    "title": "لماذا أنشأت دليل تونس",
    "name": "أنيس حبّة — المؤسس",
    "intro": "في تونس، عندما نبحث عن مهني، نسأل غالبًا العائلة والأصدقاء والجيران. التوصيات مفيدة لكنها لا تحقق دائمًا ما ننتظره. وهناك مهنيون جيدون لا يعرفهم محيطنا.",
    "paragraphs": [
      "أنا أنيس حبّة، مؤسس دليل تونس. بدأت الفكرة من ملاحظة بسيطة.",
      "في تونس، عندما نبحث عن مهني، نسأل غالبًا العائلة والأصدقاء والجيران. التوصيات مفيدة لكنها لا تحقق دائمًا ما ننتظره. وهناك مهنيون جيدون لا يعرفهم محيطنا.",
      "أردت أن يستطيع الناس البحث حسب المهنة أو الخدمة والمدينة واكتشاف عدة مؤسسات، لا الاكتفاء بتوصية واحدة.",
      "بعض المؤسسات تعرض أعمالها على الشبكات الاجتماعية، بينما لا تحظى مؤسسات أخرى بالظهور الكافي رغم خبرتها. وتساعد نماذج CV Business وCV Portfolio على تقديم الخدمات والصور والإنجازات ووسائل الاتصال عبر رابط وQR Business.",
      "لكن تونس ليست فقط مؤسساتها وشواطئها. هناك أيضًا المناطق الداخلية والقرى والحرف والتقاليد والمهرجانات وأهل الجهات. هذه أيضًا روح تونس.",
      "لهذا يجمع دليل تونس خدمات المواطنين والسياحة المحلية ومعلومات المغتربين وفرص العمل.",
      "تتوفر معلومات وخدمات ومؤسسات بالفعل على المنصة، وسيبقى المزيد لإضافته مع الوقت، جهة بعد جهة. أريدها منصة حيّة تساعد الناس وتعرّف بالمهنيين وبثراء تونس."
    ],
    "cta": "اكتشف قصتي"
  }
} as const;
export function FounderStory({full=false}:{full?:boolean}) {
 const { language } = useLanguage();
 const { hash } = useLocation();
 useEffect(() => { if (full && hash === '#histoire-fondateur') { const frame = requestAnimationFrame(() => document.getElementById('histoire-fondateur')?.scrollIntoView({behavior:'auto',block:'start'})); return () => cancelAnimationFrame(frame); } }, [full, hash]);
 const t = story[language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'];
 return <section className="bg-white px-4 py-10 md:py-16" aria-label={t.title}>
  <div className="mx-auto grid max-w-5xl gap-6 rounded-3xl border border-[#D4AF37]/40 bg-[#FFFCF7] p-5 shadow-sm md:grid-cols-[190px_1fr] md:p-8">
   <div><img src="https://lienora.fr/brand/anis-haba-founder.jpg" alt="Anis Haba" loading="lazy" className="h-56 w-44 rounded-xl object-cover" /><p className="mt-3 text-sm font-bold text-[#4A1D43]">{t.name}</p></div>
   <div><p className="text-xs font-semibold uppercase tracking-widest text-[#A58128]">{t.tag}</p><h2 className="mt-2 font-serif text-2xl font-bold text-[#4A1D43] md:text-3xl">{t.title}</h2>{full ? t.paragraphs.map((paragraph, index) => language === 'fr' && [4,8,12,16,20].includes(index) ? <h3 key={index} className="mt-8 font-serif text-xl font-bold text-[#4A1D43]">{paragraph}</h3> : <p key={index} className="mt-4 max-w-[72ch] leading-8 text-gray-700">{paragraph}</p>) : <p className="mt-4 max-w-[72ch] leading-8 text-gray-700">{t.intro}</p>}{!full && <Link to="/pourquoi-dalil-tounes#histoire-fondateur" className="mt-5 inline-flex rounded-xl border border-[#D4AF37] px-5 py-3 font-semibold text-[#4A1D43] hover:bg-[#FFF4D0]">{t.cta}</Link>}</div>
  </div>
 </section>;
}
