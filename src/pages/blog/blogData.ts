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
<p>Dalil Tounes n'est pas né dans un bureau de start-up ni lors d'une réunion de brainstorming.</p>

<p>Il est né d'une frustration réelle, vécue sur le terrain, par des gens ordinaires qui cherchaient des réponses simples à des questions simples :</p>

<blockquote>« Où est le meilleur mécanicien de ma ville ? »<br/>« Est-ce que ce restaurant est vraiment bon ? »<br/>« Qui peut me faire une rénovation sérieuse à Sfax ? »</blockquote>

<p>Des questions que tout le monde pose. Et auxquelles personne ne répondait vraiment bien.</p>

<h2>Le vide qu'on a voulu combler</h2>

<p>En Tunisie, les bonnes adresses se transmettent encore aujourd'hui de bouche à oreille. On demande à un voisin, à un cousin, à un ami. Les plateformes internationales sont soit absentes, soit inadaptées à la réalité locale. Et les annuaires existants ? Souvent vides, obsolètes, ou trop complexes pour les petits commerçants qui n'ont pas le temps de gérer une présence digitale.</p>

<p>L'idée de Dalil Tounes est née de ce constat simple : <strong>les Tunisiens méritent un outil qui leur ressemble.</strong></p>

<h2>Une plateforme construite avec le terrain</h2>

<p>Dès le départ, nous avons fait le choix d'aller à la rencontre des commerçants, des artisans, des prestataires. Pas pour leur vendre un abonnement, mais pour comprendre leur réalité. Ce que nous avons entendu nous a guidés :</p>

<ul>
<li>« Je n'ai pas le temps de gérer ça. »</li>
<li>« J'ai essayé d'autres plateformes, personne ne m'a appelé. »</li>
<li>« Mes clients me trouvent sur WhatsApp, pas sur internet. »</li>
</ul>

<p>Ces retours ont façonné chaque décision de conception. La simplicité d'inscription. L'interface en arabe, français et anglais. L'intégration native de WhatsApp. La mise en avant des avis clients.</p>

<h2>Ce que Dalil Tounes est aujourd'hui</h2>

<p>Dalil Tounes, c'est un annuaire vivant. Un espace où les entreprises tunisiennes — des plus grandes aux plus petites — peuvent exister dignement en ligne. Où les citoyens peuvent trouver rapidement ce qu'ils cherchent, comparer, contacter, faire confiance.</p>

<p>C'est aussi une communauté. Chaque avis laissé, chaque fiche remplie, chaque partage contribue à construire une cartographie de confiance du commerce tunisien.</p>

<h2>La route est encore longue</h2>

<p>Nous sommes encore jeunes. Beaucoup de villes sont sous-représentées. Beaucoup de secteurs manquent d'acteurs référencés. Mais chaque semaine, de nouvelles entreprises rejoignent la plateforme. Chaque jour, des citoyens trouvent ce qu'ils cherchaient.</p>

<p>C'est pour ça que nous continuons. Avec humilité. Avec ambition. Et avec beaucoup d'amour pour notre pays. 🧡</p>

<p><em>— L'équipe Dalil Tounes</em></p>
    `.trim(),
  },
];
