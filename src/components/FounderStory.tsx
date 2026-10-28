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
      "Je m'appelle Anis Haba, fondateur de Dalil Tounes. L'idée m'est venue d'un constat assez simple.",
      "En Tunisie, lorsqu'on cherche un artisan, un professionnel ou une entreprise, on demande souvent à la famille, aux amis ou aux voisins. Le bouche-à-oreille rend bien des services, mais il arrive aussi qu'on ne soit pas satisfait du résultat. Et puis, il y a tous les bons professionnels que personne dans notre entourage ne connaît.",
      "Je me suis demandé pourquoi on devrait forcément connaître quelqu'un pour trouver un professionnel. Pourquoi ne pas pouvoir chercher un métier, un service ou une activité dans sa ville et découvrir plusieurs entreprises ?",
      "Beaucoup d'entreprises tunisiennes montrent leur travail sur Facebook ou Instagram. D'autres ont moins de temps ou de moyens pour se faire connaître. Pourtant, derrière ces activités, il y a du savoir-faire et des années d'expérience.",
      "Je voulais aussi que les entreprises puissent mieux se présenter. C'est pour cela que Dalil Tounes propose des CV Business et CV Portfolio : leurs services, leurs photos, leurs réalisations et leurs coordonnées, accessibles depuis un téléphone et partageables grâce à un lien ou un QR Business.",
      "Mais un pays, ce ne sont pas uniquement ses entreprises et ses côtes touristiques. Il y a aussi l'intérieur de la Tunisie, ses villages, ses traditions, ses artisans, ses festivals et les personnes qui font vivre leurs régions. Pour moi, découvrir la Tunisie, c'est aussi découvrir son âme.",
      "C'est pour cela que Dalil Tounes rassemble également des pages Citoyens pour les services du quotidien, du tourisme local pour découvrir les régions, des informations pour les expatriés et un espace Emploi.",
      "Dalil Tounes contient déjà des entreprises, des services et des informations utiles. Bien sûr, il reste énormément de choses à ajouter, et je pense qu'il y en aura toujours. Chaque région possède ses particularités et chaque ville de nouvelles découvertes.",
      "Mon objectif n'est pas de prétendre tout répertorier, mais de faire grandir cette plateforme vivante, région après région, pour faciliter la vie des habitants, faire connaître les professionnels et montrer la Tunisie dans toute sa richesse."
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
  <div className="mx-auto grid max-w-6xl gap-6 rounded-3xl border border-[#D4AF37]/40 bg-[#FFFCF7] p-5 shadow-sm md:grid-cols-[190px_1fr] md:p-8">
   <div><img src="https://lienora.fr/brand/anis-haba-founder.jpg" alt="Anis Haba" loading="lazy" className="h-56 w-44 rounded-xl object-cover" /><p className="mt-3 text-sm font-bold text-[#4A1D43]">{t.name}</p></div>
   <div><p className="text-xs font-semibold uppercase tracking-widest text-[#A58128]">{t.tag}</p><h2 className="mt-2 font-serif text-2xl font-bold text-[#4A1D43] md:text-3xl">{t.title}</h2>{full ? t.paragraphs.map((paragraph, index) => <p key={index} className="mt-4 leading-8 text-gray-700">{paragraph}</p>) : <p className="mt-4 leading-8 text-gray-700">{t.intro}</p>}{!full && <Link to="/pourquoi-dalil-tounes#histoire-fondateur" className="mt-5 inline-flex rounded-xl border border-[#D4AF37] px-5 py-3 font-semibold text-[#4A1D43] hover:bg-[#FFF4D0]">{t.cta}</Link>}</div>
  </div>
 </section>;
}
