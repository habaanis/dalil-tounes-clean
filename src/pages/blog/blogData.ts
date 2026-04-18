export interface BlogArticleTranslation {
  title: string;
  subtitle: string;
  category: string;
  excerpt: string;
  content: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  author: string;
  date: string;
  readTime: string;
  coverImage: string;
  fr: BlogArticleTranslation;
  en?: BlogArticleTranslation;
  ar?: BlogArticleTranslation;
}

export const blogArticles: BlogArticle[] = [
  {
    id: '1',
    slug: 'comment-est-ne-dalil-tounes',
    author: "L'équipe Dalil Tounes",
    date: '15 avril 2026',
    readTime: '5 min',
    coverImage: '',
    fr: {
      title: 'Comment est né Dalil Tounes 🧡',
      subtitle: "L'histoire d'une idée née du terrain",
      category: 'Notre Histoire',
      excerpt: "Dalil Tounes n'est pas né dans un bureau de start-up. Il est né d'une frustration réelle, vécue sur le terrain.",
      content: `<h1>Comment est né Dalil Tounes 🧡</h1>
<p>Je vais te raconter pourquoi j'ai créé ce site 😊</p>
<p>À chaque fois que je viens en Tunisie, je vois la même scène. Dans la rue, quelqu'un cherche une adresse. Un citoyen, un touriste, peu importe. Il demande "tu connais ceci ? c'est par où ?". Et on lui répond "non je sais pas" ou alors "oui c'est en face du café machin". Sauf que toi tu connais pas le café non plus. Bref 😅</p>
<p>Dernièrement, j'ai dû faire ma première carte d'identité tunisienne. Enfin ! Pour acheter les timbres, je me suis trompé deux fois de bâtiment. Les gens veulent bien t'aider, mais ils ne savent pas vraiment. Ou alors ils te disent "non tu dois faire ci ou ça d'abord". Bon.</p>
<p>Donc je vais sur Internet. Et là, les infos sont éparpillées. Pas d'adresse précise. Parfois juste un GPS pas pratique quand t'es à pied. Tout en arabe (si tu maîtrises pas, bonne chance 🥲). Les horaires faux. Et je dois ouvrir Facebook, Instagram, Google en même temps. Ça me fatigue franchement.</p>
<p>Alors je me suis dit : si c'est galère pour moi de trouver une administration, alors pour trouver un plombier, un coiffeur, un médecin ou un artisan de confiance avec des bons avis, c'est pareil.</p>
<p>Et les commerçants dans tout ça ? Eux aussi ils galèrent. Ils sont sur Facebook, Instagram, Google Maps, mais tout est séparé. Et beaucoup n'ont pas le temps de bien s'en occuper. Du coup ça fait vite fait. Résultat : pas de vitrine unique. Pas de rue qui amène les clients.</p>
<p>L'idée est venue comme ça. Pourquoi pas <strong>un annuaire vivant qui relie les citoyens</strong> ? Pas juste une fiche froide. Quelque chose qui fait le lien entre les gens et les pros de confiance. Une sorte de CV business pour chaque pro. Adresse, horaires, photos, avis, contacts, GPS, réseaux sociaux, description. Tout en un clic. Et des infos vérifiées, pas n'importe quoi. 🧡</p>
<p>Dans mes projets, j'ai toujours eu cette envie d'aider les autres. Pas seulement pour l'argent. Je veux aider les petits commerçants, les petites entreprises qu'on connaît pas. Y'a tellement de gens qui méritent d'être plus visibles. Et même les associations (pour les enfants ou les animaux) qu'on connaît peu.</p>
<p>Je suis auto-entrepreneur en France, dans la traiteur. Rien à voir avec l'informatique. Je connaissais rien au début. Mais je me suis lancé. J'ai cherché, lu, appris, petit à petit.</p>
<p>Aujourd'hui, Dalil Tounes se construit pierre par pierre. Je ne veux pas faire juste un annuaire. Je veux créer un vrai lien entre les citoyens et les pros de leur quartier. Un annuaire vivant. Pas une liste morte. Et je suis convaincu que ça va marcher 🤲</p>
<p>Beaucoup pensent que Facebook, Instagram et Google suffisent. Oui, ce sont des fenêtres. Mais ce ne sont pas les rues qui amènent les clients. Dalil Tounes, c'est la rue. C'est le lien. C'est l'annuaire vivant qui rapproche les gens.</p>
<p>Je ne viens pas du numérique. Mais je crois en ce projet. Parce qu'il répond à un vrai besoin. Parce qu'il est né d'une galère que j'ai vraiment vécue. Parce que je l'ai fait avec le cœur. 🧡</p>
<p>Voilà. C'est mon histoire. Merci de l'avoir lue jusqu'ici 😌</p>`
    },
    en: {
      title: 'How Dalil Tounes was born 🧡',
      subtitle: 'The story of an idea born in the field',
      category: 'Our Story',
      excerpt: "Dalil Tounes was not born in a startup office. It was born from a real frustration, experienced in the field.",
      content: `<h1>How Dalil Tounes was born 🧡</h1>
<p>Let me tell you why I created this site 😊</p>
<p>Every time I come to Tunisia, I see the same scene. On the street, someone is looking for an address. A citizen, a tourist, it doesn't matter. They ask "do you know this place? Which way is it?". And the answer is "I don't know" or "yes, it's opposite the café so-and-so". Except you don't know that café either. Right 😅</p>
<p>Recently, I had to get my first Tunisian ID card. Finally! To buy the stamps, I went to the wrong building twice. People genuinely want to help, but they don't really know. Or they tell you "no, you have to do this or that first". Okay.</p>
<p>So I go online. And there, the information is scattered. No precise address. Sometimes just a GPS that isn't practical when you're on foot. Everything in Arabic (if you're not fluent, good luck 🥲). Wrong opening hours. And I have to open Facebook, Instagram, and Google at the same time. It's honestly exhausting.</p>
<p>So I thought: if it's a struggle for me to find a government office, then finding a trustworthy plumber, hairdresser, doctor or craftsman with good reviews must be just as hard.</p>
<p>And what about business owners? They struggle too. They're on Facebook, Instagram, Google Maps, but everything is separate. And many don't have time to manage it all properly. So it ends up rushed. Result: no single storefront. No street that brings customers in.</p>
<p>The idea came just like that. Why not <strong>a living directory that connects citizens</strong>? Not just a cold listing. Something that connects people with trusted professionals. A kind of business CV for each pro. Address, hours, photos, reviews, contacts, GPS, social media, description. All in one click. And verified information, not just anything. 🧡</p>
<p>In my projects, I've always had this desire to help others. Not just for money. I want to help small shopkeepers, small businesses that people don't know about. There are so many people who deserve more visibility. And even associations (for children or animals) that few people know about.</p>
<p>I'm a self-employed caterer in France. Nothing to do with tech. I knew nothing at the start. But I launched anyway. I searched, read, learned, step by step.</p>
<p>Today, Dalil Tounes is being built brick by brick. I don't just want to make a directory. I want to create a real connection between citizens and the professionals in their neighborhood. A living directory. Not a dead list. And I'm convinced it will work 🤲</p>
<p>Many people think Facebook, Instagram and Google are enough. Yes, they are windows. But they are not the streets that bring customers. Dalil Tounes is the street. It's the connection. It's the living directory that brings people together.</p>
<p>I don't come from the digital world. But I believe in this project. Because it responds to a real need. Because it was born from a struggle I truly experienced. Because I built it with heart. 🧡</p>
<p>There you go. That's my story. Thank you for reading it all the way through 😌</p>`
    },
    ar: {
      title: 'كيفاش تولّد "دليل تونس" 🧡',
      subtitle: 'قصة فكرة وُلدت من الواقع',
      category: 'قصتنا',
      excerpt: "دليل تونس موش مولود في مكتبة شركة ناشئة. تولد من إحباط حقيقي، عاشه أناس عاديون في الميدان.",
      content: `<h1>كيفاش تولّد "دليل تونس" 🧡</h1>
<p>خليني نحكيلكم علاش عملت الموقع هذا 😊</p>
<p>كل مرة نجي لتونس، نلقى نفس المشكلة. في الشارع، عباد تسأل على ادريسة: مواطن، سائح… ما يهمش. نقولو "تعرف هذا وين؟ كيفاش نوصل؟" والجواب ديما يا "ما نعرفش" يا "إيه، بحدا قهوة فلان"... أما إنت ما تعرفش القهوة هذيك أصلاً 😅</p>
<p>آخر مرة، كنت باش نعمل بطاقة تعريف. قلت أخيراً! أما باش نشري تنابر، غلّطت مرتين في البلاصة. الناس تحب تعاون، أما المعلومة موش ديما صحيحة. كل واحد يعطيك بطريقة مختلفة.</p>
<p>مشيت للإنترنت… وهنا زادة نفس المشكلة. المعلومات داخلة بعضها. ما فماش ادريسة واضحة. ساعات حتى GPS وما يعاونكش كتبدا تمشي على ساقيك. ساعات كل شيئ مكتوب بالعربي، وإذا ما تفهمش، الله غالب عليك 😅. الأوقات ساعات زادا غالطة. وتلقى روحك تحل في فيسبوك، إنستغرام، وقوقل في نفس الوقت… تعب برشا.</p>
<p>قلت: إذا أنا تعبت هكا باش نلقى إدارة، كيفاش باش نلقى بلومبيي، حجام، طبيب ولا صانع باهي؟ نفس الحكاية</p>
<p>والتجار في هذا الكل؟ زادة يعانيو. موجودين في برشا بلايص (فيسبوك، إنستغرام، قوقل)، أما كل شي مفرق. وبرشا ما عندهمش وقت بش يتلهاو بالحاجات هاذي. النتيجة: ما فماش تصويرة واضحة، وما فماش حاجة تجيب الحرفاء.</p>
<p>من غادي جات الفكرة: علاش ما نعملوش دليل يربط الناس ببعضها؟ موش كان لستا، أما حاجة حيّة. حاجة تربط الناس بالحرفيين الموثوقين. نوع من CV التجاري لكل خدام. ادريسة واضحة، أوقات خدمة، تصاور، تقييمات عباد، أرقام، GPS، روابط تواصل اجتماعي، وصف. الكل بنزلة وحدة، بمعلومات صحيحة وموثوقة، مش أي كلام. تلقى بسهولة الحرفي المناسب، والحرفي يلقى حريف جديد، والدائرة تكمل بالثقة 🧡</p>
<p>في مشاريعي، كانت عندي دائما الرغبة باش نعاون الآخرين. مش فقط باش نزيد الفلوس. نحب نعاون التجار الصغار، الشركات الصغيرة اللي ما نعرفهمش. فما برشا يستاهلو يكونو معروفين أكثر. وحتى الجمعيات (للأطفال ولا الحيوانات) اللي قليل اللي يعرفهم.</p>
<p>أنا مقاول ذاتي في فرنسا (auto-entrepreneur)، في مجال المأكولات. وما عندي حتى علاقة بالإعلامية. ما كنت نعرف شي، أما تعلمت شوية بشوية.</p>
<p>اليوم "دليل تونس" قاعد يتبنى حجر بحجر. موش كان دليل… نحب نخلق رابط حقيقي بين الناس والحرفيين. وأنا مقتنع أنه بش ينجح 🤲</p>
<p>برشا يخممو أنو فيسبوك، إنستغرام وقوقل كافيين. آي، هما نوافذ. لكنها مش شوارع تجيب الزبائن. "دليل تونس" هو الشارع. هو الرابط. هو الدليل الحي اللي يقرّب بين الناس.</p>
<p>أنا مش من عالم الرقمية. أما نؤمن بالمشروع هذا. خاترو يجيب حاجة حقيقية. خاترو تولد من معاناة عشتها انا. و خاترعملته بالقلب. 🧡</p>
<p>هذه حكايتي، عيشك كان قريتها للآخر 😌</p>`
    }
  },
  {
    id: '2',
    slug: 'qui-est-le-createur-de-dalil-tounes',
    author: "L'équipe Dalil Tounes",
    date: '15 avril 2026',
    readTime: '4 min',
    coverImage: '',
    fr: {
      title: 'Qui est le créateur de Dalil Tounes ? 🧡',
      subtitle: "L'histoire d'un auto-entrepreneur qui n'y connaissait rien",
      category: 'Notre Histoire',
      excerpt: "Derrière Dalil Tounes, il y a une personne avec son histoire, ses galères, ses regrets, et ses rêves.",
      content: `<h1>Qui est le créateur de Dalil Tounes ? 🧡</h1>
<p>Derrière Dalil Tounes, il y a une personne. Pas juste une entreprise ou un logo. Une personne avec son histoire, ses galères, ses regrets, et ses rêves. 😊</p>
<p>Je m'appelle Anis. Je suis auto-entrepreneur en France, dans la traiteur. Rien à voir avec l'informatique. Rien à voir avec les sites web. Au début, je ne connaissais rien. Vraiment rien.</p>
<p>Mais avant d'arriver ici, j'ai eu d'autres projets. Des projets que j'ai aimés, portés, et que je n'ai pas réussi à finir. Et ça, ça reste dans le cœur.</p>
<h2>Des projets que je n'ai pas menés jusqu'au bout 😔</h2>
<p>Il y a eu une <strong>chocolaterie belge</strong>. J'avais tout imaginé. Les recettes, le design, les bonbons qu'on offre à ceux qu'on aime. Mais ça ne s'est pas fait.</p>
<p>Il y a eu un <strong>restaurant gastronomique tunisien</strong>. Je voulais faire découvrir la cuisine de ma famille, celle de ma grand-mère, mais en version fine, élégante. Un endroit où les gens auraient dit "ah, la Tunisie c'est aussi ça". Ça non plus, ça n'a pas vu le jour.</p>
<p>Et il y a eu ce rêve un peu fou : <strong>inventer le derja en livre</strong>. Oui, je voulais écrire un dictionnaire ou une méthode pour apprendre le tunisien. Parce que notre langue parlée est belle, vivante, et elle mérite d'être transmise. Mais le livre n'est jamais sorti.</p>
<p>J'ai regretté ces projets. Longtemps. On se dit "et si j'avais insisté ? et si j'avais essayé autrement ?". Mais la vie fait son chemin. Et chaque regret m'a appris quelque chose.</p>
<h2>La Tunisie : ma famille, ma jeunesse, mon lien 🇹🇳</h2>
<p>La Tunisie, ce n'est pas un "marché" pour moi. C'est le pays de ma famille. C'est là où j'ai passé des étés, là où j'ai appris à rire autour d'un plat de couscous, là où j'ai entendu les histoires de mes grands-parents.</p>
<p>J'ai toujours eu ce lien. Et toujours eu cette envie de revenir. Pas en touriste, pas en investisseur froid. En quelqu'un qui veut <strong>aider à sa manière</strong>.</p>
<p>Dalil Tounes, c'est peut-être mon troisième projet. Ou mon quatrième. Mais c'est celui qui me ressemble le plus. Parce qu'il ne cherche pas à être parfait. Il cherche à être <strong>utile</strong>. Comme une petite rue qui relie les gens.</p>
<h2>D'autres projets en cours d'évolution 🤲</h2>
<p>Aujourd'hui, Dalil Tounes avance. Mais il y a aussi d'autres choses qui grandissent à côté. Je ne peux pas tout dire maintenant, mais il y a de la vie. Des idées. Des envies.</p>
<p>Ce que je sais, c'est que je n'abandonne plus. Les regrets d'avant m'ont donné une force : celle de continuer, même quand c'est dur, même quand on est seul sur certains aspects, même quand on ne connaît rien à l'informatique.</p>
<h2>Pourquoi vous pouvez me faire confiance 🧡</h2>
<p>Je ne viens pas du numérique. Mais j'ai un cœur. Et j'ai vécu les mêmes galères que vous : des adresses introuvables, des horaires faux, des "oui c'est en face du café" alors que vous ne connaissez pas le café.</p>
<p>Dalil Tounes, c'est un projet humain. Pas une machine à faire de l'argent. C'est un annuaire vivant, pas une liste froide. Et c'est avec une équipe que je le construis, pierre par pierre.</p>
<p>Merci d'être là. Merci de lire mon histoire. Et si vous voulez partager la vôtre, vous savez où me trouver.</p>
<p>Voilà. C'est moi. C'est Dalil Tounes. 🧡</p>
<p>Merci d'avoir lu jusqu'ici 😌</p>`
    },
    en: {
      title: 'Who is the creator of Dalil Tounes? 🧡',
      subtitle: "The story of a self-taught entrepreneur who knew nothing about tech",
      category: 'Our Story',
      excerpt: "Behind Dalil Tounes, there is a person with their story, struggles, regrets, and dreams.",
      content: `<h1>Who is the creator of Dalil Tounes? 🧡</h1>
<p>Behind Dalil Tounes, there is a person. Not just a company or a logo. A person with their story, struggles, regrets, and dreams. 😊</p>
<p>My name is Anis. I'm a self-employed caterer in France. Nothing to do with tech. Nothing to do with websites. At first, I knew nothing. Really nothing.</p>
<p>But before getting here, I had other projects. Projects I loved, carried, but didn't manage to finish. And that stays in the heart.</p>
<p>I regretted those projects. For a long time. You think "what if I had insisted? what if I had tried differently?". But life goes its own way. And every regret taught me something.</p>
<p>Tunisia is not a "market" for me. It's my family's country. It's where I spent my summers, where I learned to laugh over a plate of couscous, where I heard my grandparents' stories.</p>
<p>I've always had this connection. And always wanted to come back. Not as a tourist, not as a cold investor. As someone who wants to help in their own way.</p>
<p>Dalil Tounes might be my third project. Or my fourth. But it's the one that looks most like me. Because it doesn't try to be perfect. It tries to be useful. Like a small street that connects people.</p>
<p>I don't come from the digital world. But I have a heart. And I've lived through the same struggles as you: addresses that can't be found, wrong opening hours, "yes it's opposite the café" when you don't know that café.</p>
<p>Dalil Tounes is a human project. Not a money-making machine. It's a living directory, not a dead list. And with my team, I'm building it brick by brick.</p>
<p>That's my story. That's me. That's Dalil Tounes. 🧡</p>
<p>Thank you for reading this far 😌</p>`
    },
    ar: {
      title: 'شكون ورا "دليل تونس" 🧡',
      subtitle: 'حكاية مقاول ذاتي لم يكن يعرف شيئاً في الإعلامية',
      category: 'قصتنا',
      excerpt: "ورا دليل تونس، فما إنسان. موش كان شركة. شخص مع حكايته، صعوباته، ندومه، وأحلامه.",
      content: `<h1>شكون ورا "دليل تونس" 🧡</h1>
<p>ورا "دليل تونس"، فما إنسان. موش كان شركة ولا لوغو. إنسان عندو حكاية، تعب وأحلام.</p>
<p>أنا اسمي أنيس. نخدم كمقاول ذاتي في فرنسا، في مجال الماكلة. ما عندي حتى علاقة بالإعلامية ولا بالمواقع. في الأول ما كنت نعرف حتى شي. بالحق حتى شي.</p>
<p>أما قبل ما نوصل لهنا، كان عندي برشا مشاريع. مشاريع حبيتها وخدمت عليها… أما ما كملتهمش. والحاجة هذي تبقى في القلب.</p>
<h2>مشاريع ما كملتهمش 😔</h2>
<p>كان عندي مشروع <strong>شوكولا بلجيكية</strong>. كنت متخيل كل شي: الوصفات، الديزاين، والحلويات اللي تتعطى للناس اللي نحبّوهم... أما المشروع ما صارش.</p>
<p>كان عندي زادة مشروع <strong>مطعم تونسي راقي</strong>. كنت نحب نعرّف الناس على ماكلة عايلتي، ماكلة جدّتي، أما بطريقة عصرية. بلاصة وين الناس تقول: "آه، تونس فيها حتى هذا". أما حتى المشروع هذا ما خرجش للنور.</p>
<p>وكان عندي حلم شوية غريب: <strong>نكتب كتاب على الدارجة التونسية</strong>. إيه، كنت نحب نكتب dictionnaire ولا طريقة باش الناس تتعلّم التونسي. على خاطر لغتنا مزيانة، حيّة، وتستحق تتنقل للناس. أما المشروع هذا زادا ما تمّش.</p>
<p>ندمت على المشاريع هاذم برشا، ولفترة طويلة. ديما نقول: "يا ريتني كملت؟ يا ريت جرّبت بطريقة أخرى؟". أما الدنيا تمشي، وكل تجربة علمتني حاجة.</p>
<h2>تونس: موش مجرد مشروع 🇹🇳</h2>
<p>تونس بالنسبة ليا موش سوق. هي بلادي، عايلتي، ذكرياتي، صغري. هي البلاصة وين عديت صياف، وين تعلمت نضحك مع العايلة واحنا ملمومين على صحن كسكسي، وين سمعت حكايات جدودي.</p>
<p>ديما كان عندي حب نرجعلها… موش كسائح، أما كإنسان يحب يعاون بطريقتو.</p>
<p>يمكن "دليل تونس" هو ثالث ولا رابع مشروع ليا… أما هو أكثر واحد يشبهلي. على خاطر ما يسعاش باش يكون كامل، أما يسعى باش يكون مفيد. كيف زنقة صغيرة تربط بين العباد.</p>
<h2>مشروع قاعد يكبر 🤲</h2>
<p>اليوم "دليل تونس" قاعد يتبنى شوية بشوية. وفما أفكار أخرى زادة قاعدة تكبر معاه.</p>
<p>أما الحاجة اللي تبدلت واللي نعرفها اليوم، إني ما عادش نستسلم. الندم متاع قبل عطاني قوة: قوة إني نكمل، حتى كان صعيب، حتى كان وحدي في برشا حاجات، وحتى كان ما نعرف حتى شي في الإعلامية.</p>
<h2>علاش تنجم تثق فيا 🧡</h2>
<p>أنا موش من عالم الرقمية. أما عندي قلب. وعشت نفس المشاكل اللي عشتوهم: adresse ما تتلقاش، أوقات غالطة، وديما "إيه قدّام قهوة فلان" وإنت ما تعرفش القهوة أصلاً.</p>
<p>"دليل تونس" موش مشروع باش نربحو بيه برك. هو مشروع إنساني، دليل حي موش مجرد ليستة. وقاعدين نبنيو فيه أنا وفريقي، شوية بشوية.</p>
<p>عيشك اللي إنت هنا، وعيشك اللي قريت حكايتي. وإذا تحب تحكي على حكايتك، تعرف وين تلقاني.</p>
<p>هذا أنا وهذا "دليل تونس" 🧡</p>
<p>عيشك اللي قريت حتى للآخر 😌</p>`
    }
  },
  {
    id: '3',
    slug: 'comment-choisir-son-medecin',
    author: "L'équipe Dalil Tounes",
    date: '18 avril 2026',
    readTime: '4 min',
    coverImage: '',
    fr: {
      title: 'Comment choisir son médecin en Tunisie ?',
      subtitle: 'Les critères essentiels pour bien choisir son professionnel de santé',
      category: 'Santé',
      excerpt: "Trouver le bon médecin n'est pas toujours simple. Voici les questions à se poser avant de prendre rendez-vous.",
      content: `<h1>Comment choisir son médecin en Tunisie ?</h1>
<p>Que ce soit pour un médecin généraliste ou un spécialiste, choisir le bon professionnel de santé est une décision importante. Voici quelques critères pour vous aider.</p>
<h2>1. La localisation et l'accessibilité</h2>
<p>Un cabinet proche de votre domicile ou de votre lieu de travail facilitera les consultations régulières. Vérifiez aussi les horaires d'ouverture et la disponibilité pour des rendez-vous urgents.</p>
<h2>2. Les spécialités et compétences</h2>
<p>Renseignez-vous sur les domaines de compétence du médecin. Un médecin généraliste bien formé peut souvent vous orienter vers le bon spécialiste.</p>
<h2>3. La réputation et les avis</h2>
<p>Les avis d'autres patients sont précieux. Sur Dalil Tounes, vous pouvez consulter les notes et commentaires laissés par des patients de votre région.</p>
<h2>4. L'acceptation de la CNAM</h2>
<p>Vérifiez si le médecin accepte la CNAM pour éviter les mauvaises surprises financières.</p>
<p>Prenez le temps de comparer et n'hésitez pas à changer de médecin si vous ne vous sentez pas en confiance.</p>`
    }
  },
  {
    id: '4',
    slug: 'bien-choisir-son-ecole',
    author: "L'équipe Dalil Tounes",
    date: '18 avril 2026',
    readTime: '5 min',
    coverImage: '',
    fr: {
      title: 'Bien choisir son école en Tunisie',
      subtitle: 'Guide pratique pour les parents',
      category: 'Éducation',
      excerpt: "École publique, privée, cours particuliers... Comment s'y retrouver et faire le bon choix pour votre enfant ?",
      content: `<h1>Bien choisir son école en Tunisie</h1>
<p>Le choix de l'établissement scolaire est l'une des décisions les plus importantes pour l'avenir de votre enfant. Public, privé, ou soutien scolaire ? Voici un guide pratique.</p>
<h2>École publique vs école privée</h2>
<p>L'école publique offre un enseignement gratuit et un accès universel. L'école privée peut proposer des classes moins chargées, des méthodes pédagogiques différentes et des activités extrascolaires variées.</p>
<h2>Les critères de sélection</h2>
<ul>
<li><strong>La proximité</strong> : un trajet court réduit la fatigue de l'enfant.</li>
<li><strong>Le niveau académique</strong> : renseignez-vous sur les résultats aux examens nationaux.</li>
<li><strong>L'encadrement</strong> : le ratio élèves/enseignant et la qualité du suivi individuel.</li>
<li><strong>Les activités parascolaires</strong> : sport, arts, clubs… pour un développement complet.</li>
</ul>
<h2>Le soutien scolaire</h2>
<p>Les cours particuliers peuvent compléter l'enseignement scolaire. Sur Dalil Tounes, vous trouverez des enseignants certifiés dans votre gouvernorat.</p>
<p>Visitez les établissements, échangez avec d'autres parents, et faites confiance à votre instinct pour trouver l'environnement idéal pour votre enfant.</p>`
    }
  },
  {
    id: '5',
    slug: 'activites-en-famille',
    author: "L'équipe Dalil Tounes",
    date: '18 avril 2026',
    readTime: '4 min',
    coverImage: '',
    fr: {
      title: 'Activités à faire en famille en Tunisie',
      subtitle: 'Des idées pour profiter de vos loisirs ensemble',
      category: 'Loisirs',
      excerpt: "Sorties, sports, culture : découvrez les meilleures activités pour passer de bons moments en famille à travers la Tunisie.",
      content: `<h1>Activités à faire en famille en Tunisie</h1>
<p>La Tunisie regorge d'activités pour tous les âges. Voici une sélection pour profiter de vos weekends et vacances en famille.</p>
<h2>Plein air et nature</h2>
<p>Les plages de Hammamet, Djerba ou Sousse offrent des journées inoubliables. Pour les amoureux de la nature, les parcs nationaux comme Ichkeul ou Boukornine proposent des randonnées adaptées aux familles.</p>
<h2>Culture et histoire</h2>
<p>Faites découvrir à vos enfants la médina de Tunis, Carthage, ou El Jem. Ces visites éducatives et ludiques mêlent histoire et aventure.</p>
<h2>Sports et activités créatives</h2>
<p>Natation, football, arts martiaux, peinture... Les centres sportifs et culturels de votre ville proposent des cours pour tous les âges. Sur Dalil Tounes, filtrez par gouvernorat pour trouver les meilleures activités près de chez vous.</p>
<h2>Parcs de loisirs</h2>
<p>Friguia Park, Aqua Palace ou les parcs d'attractions locaux raviront les plus jeunes.</p>
<p>Quelle que soit votre région, il y a toujours quelque chose à découvrir ensemble en Tunisie.</p>`
    }
  },
  {
    id: '6',
    slug: 'que-faire-a-sousse',
    author: "L'équipe Dalil Tounes",
    date: '18 avril 2026',
    readTime: '5 min',
    coverImage: '',
    fr: {
      title: 'Que faire à Sousse ?',
      subtitle: 'Le guide complet pour visiter la Perle du Sahel',
      category: 'Tourisme',
      excerpt: "Sousse est l'une des villes les plus dynamiques de Tunisie. Découvrez ses incontournables, ses restaurants, et ses activités.",
      content: `<h1>Que faire à Sousse ?</h1>
<p>Sousse, surnommée la "Perle du Sahel", est une ville qui allie histoire, plages magnifiques et vie nocturne animée. Voici un guide pour profiter au maximum de votre séjour.</p>
<h2>La médina de Sousse</h2>
<p>Classée au patrimoine mondial de l'UNESCO, la médina de Sousse est un labyrinthe fascinant de ruelles, de souks et de monuments historiques. Ne manquez pas la Grande Mosquée et le Ribat.</p>
<h2>Les plages</h2>
<p>La corniche de Sousse et les plages de Port El Kantaoui offrent des eaux cristallines idéales pour la baignade et les sports nautiques.</p>
<h2>Port El Kantaoui</h2>
<p>Ce port de plaisance aménagé est parfait pour une promenade, un dîner au bord de l'eau ou une sortie en bateau.</p>
<h2>Le musée archéologique</h2>
<p>L'un des plus riches de Tunisie, il abrite une collection impressionnante de mosaïques romaines.</p>
<h2>Gastronomie locale</h2>
<p>Goûtez l'ojja au merguez, le couscous au poisson, et les pâtisseries locales dans les restaurants du centre-ville.</p>
<p>Sur Dalil Tounes, trouvez les meilleurs prestataires touristiques, hébergements et restaurants de Sousse recommandés par les habitants.</p>`
    }
  }
];

export function getArticleTranslation(article: BlogArticle, lang: string): BlogArticleTranslation {
  if (lang === 'en' && article.en) return article.en;
  if (lang === 'ar' && article.ar) return article.ar;
  return article.fr;
}