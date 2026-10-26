import { ArrowLeft, ExternalLink, MapPin, Search } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/SEOHead';

type Place = { name: string; region: string; text: string; tags: string[] };
type Topic = { title: string; intro: string; query: string; source?: string; places: Place[] };

const topics: Record<string, Topic> = {
  'villages-patrimoine': {
    title: 'Villages et patrimoine méconnus',
    intro: 'Des villages perchés, des habitats troglodytes, des médinas et des architectures régionales à découvrir en prenant le temps.',
    query: 'guide touristique patrimoine village',
    source: 'https://www.discovertunisia.com/tunisie-sahara/ksour-et-villages-berberes',
    places: [
      { name: 'Takrouna', region: 'Sousse', text: 'Village perché offrant un paysage ouvert sur le Sahel et une architecture traditionnelle.', tags: ['village', 'panorama'] },
      { name: 'Kesra', region: 'Siliana', text: 'Village de montagne connu pour ses ruelles, ses sources et son environnement rocheux.', tags: ['montagne', 'patrimoine'] },
      { name: 'Chenini', region: 'Tataouine', text: 'Village berbère accroché à la montagne, avec ghorfas et habitations creusées dans la roche.', tags: ['Dahar', 'berbère'] },
      { name: 'Douiret', region: 'Tataouine', text: 'Ancien village fortifié du Dahar, remarquable par son implantation et sa mosquée souterraine.', tags: ['ksar', 'architecture'] },
      { name: 'Matmata', region: 'Gabès', text: 'Territoire célèbre pour ses habitations troglodytes organisées autour de cours creusées.', tags: ['troglodyte', 'Sud'] },
      { name: 'Testour', region: 'Béja', text: 'Ville d’héritage andalou connue pour sa médina, son architecture et sa tradition musicale.', tags: ['andalou', 'médina'] },
    ],
  },
  'nature-randonnees': {
    title: 'Nature et randonnées en Tunisie',
    intro: 'Forêts, montagnes, lacs, ravins, canyons, oasis et désert : la Tunisie offre des paysages très différents selon les régions et les saisons.',
    query: 'randonnée guide excursion nature',
    source: 'https://www.discovertunisia.com/en/discover',
    places: [
      { name: 'Aïn Draham et les forêts de Kroumirie', region: 'Jendouba', text: 'Un paysage forestier dense de chênes-lièges et de reliefs, adapté aux promenades et randonnées accompagnées.', tags: ['forêt', 'montagne'] },
      { name: 'Beni M’Tir', region: 'Jendouba', text: 'Village de montagne entouré de forêts, de vallées et de points de vue sur le Nord-Ouest.', tags: ['forêt', 'village'] },
      { name: 'Parc national d’El Feija', region: 'Jendouba', text: 'Massif forestier du Nord-Ouest connu pour ses paysages naturels et sa biodiversité.', tags: ['parc national', 'forêt'] },
      { name: 'Parc national de l’Ichkeul', region: 'Bizerte', text: 'Lac, marais et montagne composent une grande zone naturelle importante pour les oiseaux migrateurs.', tags: ['lac', 'oiseaux'] },
      { name: 'Cap Serrat et Sejnane', region: 'Bizerte', text: 'Une région où se rencontrent littoral sauvage, collines, forêts et savoir-faire ruraux.', tags: ['littoral', 'forêt'] },
      { name: 'Djebel Zaghouan', region: 'Zaghouan', text: 'Massif calcaire dominant la région, apprécié pour les sentiers, les panoramas et les sources.', tags: ['montagne', 'randonnée'] },
      { name: 'Parc national de Boukornine', region: 'Ben Arous', text: 'Montagne proche du Grand Tunis offrant des itinéraires nature et des vues sur le golfe.', tags: ['parc national', 'Grand Tunis'] },
      { name: 'Djebel Chambi', region: 'Kasserine', text: 'Le plus haut sommet de Tunisie, dans un environnement montagneux à aborder avec préparation et renseignements locaux.', tags: ['sommet', 'montagne'] },
      { name: 'Chebika', region: 'Tozeur', text: 'Oasis de montagne où l’eau descend entre les roches, avec palmeraie, sentiers et points de vue.', tags: ['oasis', 'cascade'] },
      { name: 'Tamerza', region: 'Tozeur', text: 'Paysages de montagne, cascades et gorges aux portes du Sahara.', tags: ['gorge', 'oasis'] },
      { name: 'Canyon de Midès', region: 'Tozeur', text: 'Ravin spectaculaire creusé dans un plateau rocheux près de la frontière algérienne.', tags: ['canyon', 'ravin'] },
      { name: 'Sidi Bouhlel', region: 'Tozeur', text: 'Canyon désertique aux falaises minérales, à découvrir de préférence avec un accompagnement local.', tags: ['canyon', 'désert'] },
      { name: 'Chott el-Jérid', region: 'Kébili / Tozeur', text: 'Immense étendue saline dont les couleurs et mirages changent selon la lumière et la saison.', tags: ['chott', 'paysage'] },
      { name: 'Douz et le Grand Erg Oriental', region: 'Kébili', text: 'Porte du désert pour découvrir les dunes et organiser une sortie saharienne encadrée.', tags: ['dunes', 'Sahara'] },
      { name: 'Ksar Ghilane', region: 'Kébili', text: 'Oasis aux portes des grandes dunes, point de départ d’expériences dans le désert.', tags: ['oasis', 'dunes'] },
      { name: 'Massif du Dahar', region: 'Tataouine / Médenine', text: 'Montagnes, plateaux désertiques, villages berbères et ksour forment des itinéraires très variés.', tags: ['montagne', 'désert'] },
    ],
  },
  'artisanat-savoir-faire': {
    title: 'Artisanat et savoir-faire', intro: 'Rencontrer les gestes, matières et ateliers qui racontent les régions tunisiennes.', query: 'artisanat atelier',
    source: 'https://ich.unesco.org/fr/RL/les-savoir-faire-lies-a-la-poterie-des-femmes-de-sejnane-01406',
    places: [
      { name: 'Poterie modelée de Sejnane', region: 'Bizerte', text: 'Un savoir-faire féminin de modelage et de décoration de la terre inscrit par l’UNESCO.', tags: ['poterie', 'UNESCO'] },
      { name: 'Céramique de Nabeul', region: 'Nabeul', text: 'Ateliers et créations en céramique, entre usages quotidiens et décoration.', tags: ['céramique', 'atelier'] },
      { name: 'Tapis de Kairouan', region: 'Kairouan', text: 'Tradition textile emblématique à découvrir auprès d’ateliers et de vendeurs spécialisés.', tags: ['tapis', 'tissage'] },
      { name: 'Tissages du Dahar', region: 'Tataouine / Médenine', text: 'Tissus, couvertures et objets inspirés des traditions du Sud.', tags: ['tissage', 'Sud'] },
      { name: 'Artisanat des médinas', region: 'Tunis / Sousse / Sfax', text: 'Métal, cuir, bois, textile et bijoux se découvrent dans les souks et ateliers.', tags: ['médina', 'souk'] },
    ],
  },
  'marches-gastronomie': {
    title: 'Marchés et gastronomie locale', intro: 'Découvrir les produits et spécialités d’une région à travers ses marchés, souks et tables locales.', query: 'marché restaurant produits locaux',
    places: [
      { name: 'Marché de Nabeul', region: 'Nabeul', text: 'Produits agricoles, épices, artisanat et spécialités du Cap Bon.', tags: ['marché', 'Cap Bon'] },
      { name: 'Souks de Kairouan', region: 'Kairouan', text: 'Pâtisseries, épices, tapis et produits traditionnels au cœur de la médina.', tags: ['souk', 'tradition'] },
      { name: 'Houmt Souk', region: 'Djerba', text: 'Marchés, poisson, épices et produits insulaires dans le principal centre de Djerba.', tags: ['île', 'marché'] },
      { name: 'Marché central de Sfax', region: 'Sfax', text: 'Poissons, produits de la mer, huile d’olive et produits du Sud.', tags: ['poisson', 'huile d’olive'] },
      { name: 'Produits des oasis', region: 'Tozeur / Kébili / Gabès', text: 'Dattes, préparations locales et produits issus des palmeraies.', tags: ['oasis', 'dattes'] },
    ],
  },
  'fetes-evenements': {
    title: 'Fêtes et événements régionaux', intro: 'Des rendez-vous culturels et populaires qui permettent de découvrir les régions autrement.', query: 'festival événement culturel',
    source: 'https://www.discovertunisia.com/evenements',
    places: [
      { name: 'Festival international du Sahara', region: 'Douz', text: 'Un rendez-vous culturel consacré aux traditions et aux expressions du monde saharien.', tags: ['festival', 'Sahara'] },
      { name: 'Festival symphonique d’El Jem', region: 'Mahdia', text: 'Des concerts dans le cadre historique de l’amphithéâtre d’El Jem.', tags: ['musique', 'patrimoine'] },
      { name: 'Festival du Malouf', region: 'Testour', text: 'Un événement consacré à la musique malouf et à l’héritage andalou.', tags: ['musique', 'andalou'] },
      { name: 'Jazz à Tabarka', region: 'Jendouba', text: 'Des rendez-vous musicaux estivaux dans une ville entre mer et forêt.', tags: ['jazz', 'été'] },
      { name: 'Mouled à Kairouan', region: 'Kairouan', text: 'Une période de rassemblements religieux, culturels et populaires dans la ville.', tags: ['tradition', 'Kairouan'] },
    ],
  },
  'hebergements-experiences': {
    title: 'Hébergements et expériences locales', intro: 'Choisir un séjour qui rapproche des territoires, des habitants et des paysages.', query: 'maison hôtes ecolodge camp désert',
    places: [
      { name: 'Maisons d’hôtes en médina', region: 'Plusieurs régions', text: 'Séjourner dans une demeure traditionnelle restaurée au cœur d’un tissu historique.', tags: ['médina', 'maison d’hôtes'] },
      { name: 'Écolodges du Nord-Ouest', region: 'Jendouba / Béja / Bizerte', text: 'Des hébergements tournés vers la forêt, la campagne et les activités nature.', tags: ['nature', 'écotourisme'] },
      { name: 'Campements sahariens', region: 'Douz / Ksar Ghilane', text: 'Dormir aux portes des dunes dans le cadre d’une expérience encadrée.', tags: ['désert', 'camp'] },
      { name: 'Séjours troglodytes', region: 'Matmata', text: 'Découvrir l’architecture creusée et la vie traditionnelle du Sud montagneux.', tags: ['troglodyte', 'Matmata'] },
      { name: 'Séjours ruraux', region: 'Cap Bon / Zaghouan / Nord-Ouest', text: 'Fermes, domaines et maisons rurales pour découvrir les produits et rythmes locaux.', tags: ['rural', 'terroir'] },
    ],
  },
};

const labels = {
  fr: { back: 'Retour à Tourisme & Expatriation', useful: 'À savoir', note: 'Pour les zones isolées, montagneuses ou désertiques, vérifiez la météo, l’accès et les conditions locales. Faites appel à un guide lorsque le terrain l’exige.', pros: 'Trouver les professionnels et services associés', source: 'Consulter la source touristique officielle' },
  ar: { back: 'العودة إلى السياحة والإقامة', useful: 'معلومة مهمة', note: 'بالنسبة إلى المناطق المعزولة أو الجبلية أو الصحراوية، تحقق من الطقس والطريق والظروف المحلية واستعن بدليل عند الحاجة.', pros: 'البحث عن المهنيين والخدمات المرتبطة', source: 'الاطلاع على المصدر السياحي الرسمي' },
  en: { back: 'Back to Tourism & Expatriation', useful: 'Good to know', note: 'For remote, mountain or desert areas, check weather, access and local conditions. Use a guide where the terrain requires it.', pros: 'Find related professionals and services', source: 'View the official tourism source' },
  it: { back: 'Torna a Turismo ed Espatrio', useful: 'Da sapere', note: 'Per zone isolate, montane o desertiche, verifica meteo, accesso e condizioni locali. Affidati a una guida quando necessario.', pros: 'Trova professionisti e servizi collegati', source: 'Consulta la fonte turistica ufficiale' },
  ru: { back: 'Назад к туризму и переезду', useful: 'Полезно знать', note: 'Для удалённых, горных и пустынных районов проверяйте погоду, доступ и местные условия. При необходимости обращайтесь к гиду.', pros: 'Найти специалистов и услуги', source: 'Открыть официальный туристический источник' },
} as const;

export default function TourismGuideTopic() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as keyof typeof labels;
  const topic = slug ? topics[slug] : undefined;
  if (!topic) return <Navigate to="/citizens/tourism" replace />;
  const ui = labels[lang];
  const isRTL = lang === 'ar';
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead title={`${topic.title} | Dalil Tounes`} description={topic.intro} canonical={`https://dalil-tounes.com/citizens/tourism/guide/${slug}`} currentPath={`/citizens/tourism/guide/${slug}`} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Link to="/citizens/tourism" className="inline-flex items-center gap-2 text-sm font-medium text-[#4A1D43] hover:text-[#D4AF37]"><ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />{ui.back}</Link>
        <header className="mt-5 border-b border-[#D4AF37]/40 pb-5">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#4A1D43]" style={{ fontFamily: "'Playfair Display', serif" }}>{topic.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">{topic.intro}</p>
        </header>
        <section className="mt-5 grid gap-3 sm:grid-cols-2">
          {topic.places.map((place) => (
            <article key={place.name} className="rounded-xl border border-[#D4AF37]/45 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3"><h2 className="text-base font-semibold text-[#4A1D43]">{place.name}</h2><span className="inline-flex items-center gap-1 text-[11px] text-gray-500"><MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />{place.region}</span></div>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">{place.text}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">{place.tags.map((tag) => <span key={tag} className="rounded-full bg-[#D4AF37]/10 px-2 py-1 text-[10px] text-[#4A1D43]">{tag}</span>)}</div>
            </article>
          ))}
        </section>
        <aside className="mt-5 rounded-xl border border-[#D4AF37] bg-[#FFFDF8] p-4"><h2 className="text-sm font-semibold text-[#4A1D43]">{ui.useful}</h2><p className="mt-1 text-xs leading-relaxed text-gray-600">{ui.note}</p></aside>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link to={`/recherche?q=${encodeURIComponent(topic.query)}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37] bg-[#4A1D43] px-4 py-2.5 text-sm font-semibold text-[#D4AF37]"><Search className="h-4 w-4" />{ui.pros}</Link>
          {topic.source && <a href={topic.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/60 bg-white px-4 py-2.5 text-sm font-semibold text-[#4A1D43]"><ExternalLink className="h-4 w-4" />{ui.source}</a>}
        </div>
      </main>
    </div>
  );
}
