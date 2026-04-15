export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  coverImage: string;
  excerpt: string;
  content: string;
}

export const blogArticles: BlogArticle[] = [
  {
    id: '1',
    slug: 'comment-est-ne-dalil-tounes',
    title: 'Comment est né Dalil Tounes 🧡',
    subtitle: "L'histoire d'une idée née du terrain",
    author: 'L\'équipe Dalil Tounes',
    date: '15 avril 2026',
    readTime: '5 min',
    category: 'Notre Histoire',
    coverImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600',
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
];
