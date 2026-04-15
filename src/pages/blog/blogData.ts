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
    coverImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600',
    fr: {
      title: 'Comment est né Dalil Tounes 🧡',
      subtitle: "L'histoire d'une idée née du terrain",
      category: 'Notre Histoire',
      excerpt: "Dalil Tounes n'est pas né dans un bureau de start-up ni lors d'une réunion de brainstorming. Il est né d'une frustration réelle, vécue sur le terrain, par des gens ordinaires qui cherchaient des réponses simples à des questions simples.",
      content: `
<h1>Comment est né Dalil Tounes 🧡</h1>

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

<p>Voilà. C'est mon histoire. Merci de l'avoir lue jusqu'ici 😌</p>
      `.trim(),
    },
    en: {
      title: 'How Dalil Tounes was born 🧡',
      subtitle: 'The story of an idea born in the field',
      category: 'Our Story',
      excerpt: "Dalil Tounes was not born in a startup office or during a brainstorming session. It was born from a real frustration, experienced in the field, by ordinary people looking for simple answers to simple questions.",
      content: `
<h1>How Dalil Tounes was born 🧡</h1>

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

<p>There you go. That's my story. Thank you for reading it all the way through 😌</p>
      `.trim(),
    },
    ar: {
      title: 'كيف وُلد دليل تونس 🧡',
      subtitle: 'قصة فكرة وُلدت من الواقع',
      category: 'قصتنا',
      excerpt: "لم يولد دليل تونس في مكتب شركة ناشئة ولا في جلسة عصف ذهني. وُلد من إحباط حقيقي، عاشه أناس عاديون في الميدان، كانوا يبحثون عن إجابات بسيطة لأسئلة بسيطة.",
      content: `
<h1>كيف وُلد دليل تونس 🧡</h1>

<p>سأحكي لك لماذا أنشأت هذا الموقع 😊</p>

<p>في كل مرة أزور فيها تونس، أرى نفس المشهد. في الشارع، شخص يبحث عن عنوان. مواطن، سائح، لا يهم. يسأل "هل تعرف هذا المكان؟ من أي اتجاه؟". فيجيبه أحدهم "لا أعرف" أو "نعم، هو أمام مقهى فلان". لكنك أنت أيضاً لا تعرف ذلك المقهى. هكذا الأمر 😅</p>

<p>مؤخراً، اضطررت لاستخراج أول بطاقة هوية تونسية لي. أخيراً! لشراء الطوابع، ذهبت إلى المبنى الخطأ مرتين. الناس يريدون المساعدة فعلاً، لكنهم لا يعرفون حقاً. أو يقولون لك "لا، عليك أولاً فعل كذا أو كذا". حسناً.</p>

<p>فذهبت إلى الإنترنت. وجدت المعلومات مبعثرة في كل مكان. لا عنوان دقيق. أحياناً مجرد GPS غير عملي حين تكون سيراً على الأقدام. كل شيء بالعربية فقط (إن لم تكن متقناً لها، حظاً موفقاً 🥲). أوقات العمل خاطئة. وعليّ فتح فيسبوك وإنستغرام وجوجل في نفس الوقت. هذا أمر مرهق حقاً.</p>

<p>فقلت في نفسي: إذا كان العثور على مصلحة حكومية أمراً صعباً، فالعثور على سباك أو حلاق أو طبيب أو حرفي موثوق ذو تقييمات جيدة لا بد أن يكون بنفس الصعوبة.</p>

<p>وماذا عن أصحاب المحلات؟ هم أيضاً يعانون. موجودون على فيسبوك وإنستغرام وخرائط جوجل، لكن كل شيء مفرّق. وكثيرون منهم لا يجدون وقتاً للاعتناء بكل ذلك جيداً. فيصبح الأمر سطحياً. النتيجة: لا واجهة موحدة. لا شارع يجلب الزبائن.</p>

<p>جاءت الفكرة هكذا. لماذا لا يكون هناك <strong>دليل حيّ يربط المواطنين</strong>؟ لا مجرد بطاقة جافة. شيء يربط الناس بالمختصين الموثوقين. نوع من السيرة الذاتية التجارية لكل محترف. العنوان، أوقات العمل، الصور، التقييمات، معلومات الاتصال، GPS، شبكات التواصل، الوصف. كل ذلك بنقرة واحدة. ومعلومات موثوقة، ليست عشوائية. 🧡</p>

<p>في مشاريعي، كانت لديّ دائماً هذه الرغبة في مساعدة الآخرين. ليس فقط من أجل المال. أريد مساعدة صغار التجار، الشركات الصغيرة التي لا يعرفها أحد. هناك الكثير من الناس الذين يستحقون مزيداً من الظهور. وحتى الجمعيات (للأطفال أو الحيوانات) التي يعرفها القليل.</p>

<p>أنا عامل مستقل في فرنسا، في مجال تقديم الطعام. لا علاقة له بالتكنولوجيا. لم أكن أعرف شيئاً في البداية. لكنني انطلقت. بحثت، قرأت، تعلمت، خطوة بخطوة.</p>

<p>اليوم، يُبنى دليل تونس لبنة لبنة. لا أريد فقط إنشاء دليل. أريد خلق رابط حقيقي بين المواطنين والمختصين في حيّهم. دليل حيّ. لا قائمة ميتة. وأنا مقتنع بأن هذا سينجح 🤲</p>

<p>يعتقد كثيرون أن فيسبوك وإنستغرام وجوجل كافية. نعم، هي نوافذ. لكنها ليست الشوارع التي تجلب الزبائن. دليل تونس هو الشارع. هو الرابط. هو الدليل الحيّ الذي يجمع الناس.</p>

<p>أنا لست من عالم الرقمي. لكنني أؤمن بهذا المشروع. لأنه يلبّي حاجة حقيقية. لأنه وُلد من معاناة عشتها فعلاً. لأنني بنيته بقلبي. 🧡</p>

<p>ها هو ذا. هذه قصتي. شكراً لقراءتها حتى النهاية 😌</p>
      `.trim(),
    },
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
      excerpt: 'Derrière Dalil Tounes, il y a une personne avec son histoire, ses galères, ses regrets, et ses rêves.',
      content: `<h1>Qui est le créateur de Dalil Tounes ? 🧡</h1><p>Derrière Dalil Tounes, il y a une personne. Pas juste une entreprise ou un logo. Une personne avec son histoire, ses galères, ses regrets, et ses rêves. 😊</p><p>Je m'appelle Anis. Je suis auto-entrepreneur en France, dans la traiteur. Rien à voir avec l'informatique. Rien à voir avec les sites web. Au début, je ne connaissais rien. Vraiment rien.</p><p>Mais avant d'arriver ici, j'ai eu d'autres projets. Des projets que j'ai aimés, portés, et que je n'ai pas réussi à finir. Et ça, ça reste dans le cœur.</p><h2>Des projets que je n'ai pas menés jusqu'au bout 😔</h2><p>Il y a eu une <strong>chocolaterie belge</strong>. J'avais tout imaginé. Les recettes, le design, les bonbons qu'on offre à ceux qu'on aime. Mais ça ne s'est pas fait.</p><p>Il y a eu un <strong>restaurant gastronomique tunisien</strong>. Je voulais faire découvrir la cuisine de ma famille, celle de ma grand-mère, mais en version fine, élégante. Un endroit où les gens auraient dit "ah, la Tunisie c'est aussi ça". Ça non plus, ça n'a pas vu le jour.</p><p>Et il y a eu ce rêve un peu fou : <strong>inventer le derja en livre</strong>. Oui, je voulais écrire un dictionnaire ou une méthode pour apprendre le tunisien. Parce que notre langue parlée est belle, vivante, et elle mérite d'être transmise. Mais le livre n'est jamais sorti.</p><p>J'ai regretté ces projets. Longtemps. On se dit "et si j'avais insisté ? et si j'avais essayé autrement ?". Mais la vie fait son chemin. Et chaque regret m'a appris quelque chose.</p><h2>La Tunisie : ma famille, ma jeunesse, mon lien 🇹🇳</h2><p>La Tunisie, ce n'est pas un "marché" pour moi. C'est le pays de ma famille. C'est là où j'ai passé des étés, là où j'ai appris à rire autour d'un plat de couscous, là où j'ai entendu les histoires de mes grands-parents.</p><p>J'ai toujours eu ce lien. Et toujours eu cette envie de revenir. Pas en touriste, pas en investisseur froid. En quelqu'un qui veut <strong>aider à sa manière</strong>.</p><p>Dalil Tounes, c'est peut-être mon troisième projet. Ou mon quatrième. Mais c'est celui qui me ressemble le plus. Parce qu'il ne cherche pas à être parfait. Il cherche à être <strong>utile</strong>. Comme une petite rue qui relie les gens.</p><h2>D'autres projets en cours d'évolution 🤲</h2><p>Aujourd'hui, Dalil Tounes avance. Mais il y a aussi d'autres choses qui grandissent à côté. Je ne peux pas tout dire maintenant, mais il y a de la vie. Des idées. Des envies.</p><p>Ce que je sais, c'est que je n'abandonne plus. Les regrets d'avant m'ont donné une force : celle de continuer, même quand c'est dur, même quand on est seul sur certains aspects, même quand on ne connaît rien à l'informatique.</p><h2>Pourquoi vous pouvez me faire confiance 🧡</h2><p>Je ne viens pas du numérique. Mais j'ai un cœur. Et j'ai vécu les mêmes galères que vous : des adresses introuvables, des horaires faux, des "oui c'est en face du café" alors que vous ne connaissez pas le café.</p><p>Dalil Tounes, c'est un projet humain. Pas une machine à faire de l'argent. C'est un annuaire vivant, pas une liste froide. Et c'est avec une équipe que je le construis, pierre par pierre.</p><p>Merci d'être là. Merci de lire mon histoire. Et si vous voulez partager la vôtre, vous savez où me trouver.</p><p>Voilà. C'est moi. C'est Dalil Tounes. 🧡</p><p>Merci d'avoir lu jusqu'ici 😌</p>`,
    },
    en: {
      title: 'Who is the creator of Dalil Tounes? 🧡',
      subtitle: 'The story of a self-taught entrepreneur who knew nothing about tech',
      category: 'Our Story',
      excerpt: 'Behind Dalil Tounes, there is a person with their story, struggles, regrets, and dreams.',
      content: `<h1>Who is the creator of Dalil Tounes? 🧡</h1><p>Behind Dalil Tounes, there is a person. Not just a company or a logo. A person with their story, struggles, regrets, and dreams. 😊</p><p>My name is Anis. I'm a self-employed caterer in France. Nothing to do with tech. Nothing to do with websites. At first, I knew nothing. Really nothing.</p><p>But before getting here, I had other projects. Projects I loved, carried, but didn't manage to finish. And that stays in the heart.</p><p>I regretted those projects. For a long time. You think "what if I had insisted? what if I had tried differently?". But life goes its own way. And every regret taught me something.</p><p>Tunisia is not a "market" for me. It's my family's country. It's where I spent my summers, where I learned to laugh over a plate of couscous, where I heard my grandparents' stories.</p><p>I've always had this connection. And always wanted to come back. Not as a tourist, not as a cold investor. As someone who wants to help in their own way.</p><p>Dalil Tounes might be my third project. Or my fourth. But it's the one that looks most like me. Because it doesn't try to be perfect. It tries to be useful. Like a small street that connects people.</p><p>I don't come from the digital world. But I have a heart. And I've lived through the same struggles as you: addresses that can't be found, wrong opening hours, "yes it's opposite the café" when you don't know that café.</p><p>Dalil Tounes is a human project. Not a money-making machine. It's a living directory, not a dead list. And with my team, I'm building it brick by brick.</p><p>That's my story. That's me. That's Dalil Tounes. 🧡</p><p>Thank you for reading this far 😌</p>`,
    },
    ar: {
      title: 'من هو مبتكر دليل تونس؟ 🧡',
      subtitle: 'حكاية مقاول ذاتي لم يكن يعرف شيئاً في الإعلامية',
      category: 'قصتنا',
      excerpt: 'خلف دليل تونس، هناك شخص مع حكايته، صعوباته، ندومه، وأحلامه.',
      content: `<h1>من هو مبتكر دليل تونس؟ 🧡</h1><p>خلف دليل تونس، هناك شخص. ليس مجرد شركة أو شعار. شخص مع حكايته، صعوباته، ندومه، وأحلامه. 😊</p><p>أنا مقاول ذاتي في فرنسا، في مجال المأكولات. لا علاقة لي بالإعلامية. لا علاقة لي بمواقع الويب. في البداية، لم أكن أعرف شيئاً. حقاً لا شيء.</p><p>لكن قبل أن أصل إلى هنا، كانت لدي مشاريع أخرى. مشاريع أحببتها، حملتها، لكن لم أنجح في إنهائها. وهذا يبقى في القلب.</p><p>ندمت على هذه المشاريع. طويلاً. تقول لنفسك "وماذا لو كنت أصررت؟ وماذا لو حاولت بطريقة أخرى؟". لكن الحياة تسير في طريقها. وكل ندم علمني شيئاً.</p><p>تونس ليست "سوقاً" بالنسبة لي. إنها بلد عائلتي. إنها المكان الذي قضيت فيه صيفي، حيث تعلمت الضحك حول طبق الكسكسي، حيث سمعت حكايات أجدادي.</p><p>طالما كان لدي هذا الرابط. وطالما كانت لدي هذه الرغبة في العودة. ليس كسائح، ولا كمستثمر بارد. بل كشخص يريد المساعدة بطريقته الخاصة.</p><p>دليل تونس، ربما هو مشروعي الثالث. أو الرابع. لكنه أكثر ما يشبهني. لأنه لا يسعى لأن يكون مثالياً. إنه يسعى لأن يكون مفيداً. مثل شارع صغير يربط الناس.</p><p>أنا لست من عالم الرقمي. لكن لدي قلب. وعشت نفس الصعوبات التي تعيشونها : عناوين لا تُعرف، أوقات خاطئة، عبارات "نعم هناك أمام المقهى" وأنتم لا تعرفون المقهى.</p><p>دليل تونس، هو مشروع إنساني. ليس آلة لصنع المال. إنه دليل حي، ليس قائمة ميتة. وأنا مع فريقي أبنيه حجراً حجراً.</p><p>هذه حكايتي. هذه أنا. هذا دليل تونس. 🧡</p><p>شكراً لقراءتها حتى النهاية 😌</p>`,
    },
  },
];

export function getArticleTranslation(article: BlogArticle, lang: string): BlogArticleTranslation {
  if (lang === 'en' && article.en) return article.en;
  if (lang === 'ar' && article.ar) return article.ar;
  return article.fr;
}
