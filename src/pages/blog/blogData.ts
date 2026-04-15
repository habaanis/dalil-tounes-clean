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
];

export function getArticleTranslation(article: BlogArticle, lang: string): BlogArticleTranslation {
  if (lang === 'en' && article.en) return article.en;
  if (lang === 'ar' && article.ar) return article.ar;
  return article.fr;
}
