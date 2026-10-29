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
    "intro": "When you need a tradesperson, a professional or simply a service in Tunisia, what do you usually do? You ask around. And that got me thinking: how many good professionals go unnoticed simply because we don't know anyone who can recommend them?",
    "paragraphs": [
      "When you need a tradesperson, a professional or simply a service in Tunisia, what do you usually do? You ask around.",
      "“Do you know a good plumber?” “Is there someone you could recommend?” “Do you know a company that does this kind of work?”",
      "You call a friend, a neighbour or someone in the family. And quite often, you find someone. But sometimes the result isn't what you had hoped for. Someone who was perfect for one person may not be the right fit for another.",
      "And that got me thinking: how many good professionals go unnoticed simply because we don't know anyone who can recommend them?",
      "That is where it all began",
      "I wondered why we couldn't just search for a trade, an activity or a service in a town and discover several professionals. Not only the best-known ones, or those who post the most on Facebook.",
      "There are skilled craftspeople and small businesses with years of experience who don't always know how to get noticed. And if you don't know their name, finding them can be difficult. I thought that was a shame.",
      "That's how I began imagining Dalil Tounes.",
      "But finding a business isn't always enough",
      "Once you've found someone, you also want to see what they actually do: their work, services, projects and photos. Because before contacting someone, it's only natural to want to know who you're dealing with.",
      "That's why I wanted to introduce CV Business and CV Portfolio. A business can present its activity, keep that presentation on its phone, and share it through a link or a QR Business.",
      "It mattered to me that Dalil Tounes should help both people looking for a professional and those wanting to show what they do.",
      "And then there is the whole of Tunisia…",
      "As the project developed, I realised I didn't want to stop at businesses. When people talk about Tunisia, they often think of its beaches, hotels and big cities. But there is so much more to the country.",
      "There are the inland regions too: villages, markets, traditions, craftspeople, festivals, landscapes and places we rarely hear about. And above all, there are the people who keep those places alive.",
      "I find it a shame that sometimes we know famous tourist destinations better than the treasures just a few kilometres from home. I'd love Dalil Tounes to help people discover this other Tunisia, the one that is part of its soul.",
      "A place that can be useful to everyone",
      "Little by little, other ideas came. Why not make it easier to find healthcare services, schools and practical information for everyday life? Why not help Tunisians living abroad, or people moving to Tunisia, find what they need?",
      "And why not help connect people looking for work with companies that are hiring? That's how Dalil Tounes started growing into something broader.",
      "With its Citizens pages, local tourism, information for expatriates, employment and professional presentations, I'd like it to be a place where everyone can find something useful.",
      "An adventure that is only just beginning",
      "Dalil Tounes already exists today. You can find businesses, professionals, services and information on it. Of course, there's still a huge amount to add. And I think there always will be.",
      "Every town has its professionals, every region its own character, every village its stories and discoveries. I'm not trying to build a website that claims to know everything about Tunisia. I'd simply like it to grow with the country.",
      "For someone to find a professional they'd never heard of. For a small business to be discovered by new customers. For a family to find something to do nearby. Or for someone to discover a part of Tunisia they never knew existed.",
      "If Dalil Tounes can already do these things, then it's beginning to serve the purpose I imagined. And we'll build what comes next, little by little."
    ],
    "cta": "Discover my story"
  },
  "ar": {
    "tag": "كلمة المؤسس",
    "title": "لماذا أنشأت دليل تونس",
    "name": "أنيس حبّة — المؤسس",
    "intro": "كي نلوجوا في تونس على حرفي، أو مهني، أو حتى خدمة بسيطة، شنوة نعملوا عادة؟ نسألوا الناس اللي نعرفوهم. ومن هنا جاتني فكرة: قداش من مهني شاطر ما يعرفه حد، فقط خاطر ما عناش شكون يدلّنا عليه؟",
    "paragraphs": [
      "كي نلوجوا في تونس على حرفي، أو مهني، أو حتى خدمة بسيطة، شنوة نعملوا عادة؟ نسألوا الناس اللي نعرفوهم.",
      "«تعرف سبّاك باهي؟» «ما عندكش شكون تنصحني بيه؟» «تعرف شركة تخدم في المجال هذا؟»",
      "نتصلوا بصاحب، بجار، أو بواحد من العائلة… وبرشا مرات نلقاو شكون يعاوننا. أما ساعات النتيجة ما تكونش كيف ما توقعنا. المهني اللي عجب شخص، موش بالضرورة يناسب شخص آخر.",
      "ومن هنا جاتني فكرة: قداش من مهني شاطر ما يعرفه حد، فقط خاطر ما عناش شكون يدلّنا عليه؟",
      "من هنا بدات الحكاية",
      "قلت علاش ما ننجموش نلوجوا مباشرة على حرفة أو نشاط أو خدمة في مدينة معيّنة، ونكتشفوا أكثر من مهني؟ موش كان الناس المعروفة أو اللي تنشر برشا على فيسبوك.",
      "فمّا حرفيين يخدموا خدمة باهية، ومؤسسات صغيرة عندها سنين خبرة، أما موش ديما تعرف كيفاش تعرّف بخدمتها. وإذا ما تعرفش اسمها، ساعات يصعب عليك تلقاها. وهذا شيء حسّيتو خسارة.",
      "وهكّا بديت نتخيّل مشروع دليل تونس.",
      "أما تلقى مؤسسة وحده موش ديما يكفي",
      "بعد ما تلقى المهني، تحب زادة تشوف شنوة يخدم بالضبط: الخدمات متاعه، إنجازاته، تصاوير خدمته… خاطر قبل ما تتصل بحد، تحب تعرف مع شكون باش تتعامل.",
      "على خاطر هذا حبيت نضيف CV Business وCV Portfolio. المؤسسة تنجم تقدّم نشاطها، وتخلي العرض متاعها ديما في تليفونها، وتشاركه برابط أو برمز QR Business.",
      "بالنسبة ليا، كان مهم أن دليل تونس ينفع الزوز: اللي يفتّش على مهني، واللي يحب يعرّف الناس بخدمته.",
      "وزيد، تونس فيها برشا حاجات أخرى…",
      "مع تقدّم المشروع، فهمت اللي ما نحبّش نوقف عند المؤسسات فقط. كي نحكيو على تونس، نفكّروا عادة في الشواطئ والنزل والمدن الكبيرة. أما تونس موش كان هاذم.",
      "فمّا زادة داخل البلاد: قرى، أسواق، عادات وتقاليد، حرفيين، مهرجانات، طبيعة وبلايص ما نسمعوش عليها برشا. وفوق هذا الكل، فمّا الناس اللي تعطي الحياة للجهات هاذي.",
      "نستحسر كي نلقاو رواحنا نعرفوا وجهات سياحية مشهورة أكثر من كنوز موجودة على بعد كيلومترات من ديارنا. نحب دليل تونس يعاوننا نكتشفوا تونس الأخرى، تونس اللي فيها روح البلاد.",
      "فضاء ينجم ينفع الناس الكل",
      "شوية بشوية، جات أفكار أخرى. علاش ما نسهّلوش زادة البحث على خدمات الصحة والتعليم والمعلومات اللي يحتاجها المواطن كل يوم؟ وعلاش ما نعاونوش التوانسة اللي عايشين في الخارج، أو الناس اللي باش يستقرّوا في تونس، باش يلقاو اللي يحتاجوه؟",
      "وعلاش ما نقرّبوش زادة بين الناس اللي تلوج على خدمة والمؤسسات اللي تنتدب؟ وهكّا ولى دليل تونس يكبر ويتوسّع.",
      "بصفحات المواطنين، والسياحة المحلية، ومعلومات المقيمين بالخارج، والتشغيل، والعروض المهنية، نحبّه يكون فضاء يلقى فيه كل واحد حاجة تنفعه.",
      "مشوار ما زال في بدايته",
      "اليوم دليل تونس موجود بالفعل. تنجم تلقى فيه مؤسسات، ومهنيين، وخدمات، ومعلومات. صحيح ما زال برشا ما يلزمنا نزيدوه. ونظن ديما باش تبقى حاجات جديدة.",
      "كل مدينة فيها مهنييها، وكل جهة عندها خصوصياتها، وكل قرية عندها حكاياتها واكتشافاتها. موش هدفي نعمل موقع يدّعي اللي يعرف كل شيء على تونس. نحبّه ببساطة يكبر معاها.",
      "نحب ساكن يكتشف مهني ما كانش يعرفه. ومؤسسة صغيرة يلقاوها حرفاء جدد. وعائلة تلقى نشاط تعملو في جهتها. أو شخص يكتشف بلاصة في تونس ما سمعش بيها قبل.",
      "إذا دليل تونس ينجم من توا يقدّم الخدمات هاذي، معناها بدا يحقّق الفكرة اللي تخيّلتها. والباقي نبنيوه شوية بشوية."
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
   <div><p className="text-xs font-semibold uppercase tracking-widest text-[#A58128]">{t.tag}</p><h2 className="mt-2 font-serif text-2xl font-bold text-[#4A1D43] md:text-3xl">{t.title}</h2>{full ? t.paragraphs.map((paragraph, index) => [4,8,12,16,20].includes(index) ? <h3 key={index} className="mt-8 font-serif text-xl font-bold text-[#4A1D43]">{paragraph}</h3> : <p key={index} className="mt-4 max-w-[72ch] leading-8 text-gray-700">{paragraph}</p>) : <p className="mt-4 max-w-[72ch] leading-8 text-gray-700">{t.intro}</p>}{!full && <Link to="/pourquoi-dalil-tounes#histoire-fondateur" className="mt-5 inline-flex rounded-xl border border-[#D4AF37] px-5 py-3 font-semibold text-[#4A1D43] hover:bg-[#FFF4D0]">{t.cta}</Link>}</div>
  </div>
 </section>;
}
