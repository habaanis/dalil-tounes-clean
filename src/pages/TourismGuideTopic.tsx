import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, ExternalLink, Info, MapPin, Navigation, Search, X } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/SEOHead';

type Place = {
  name: string;
  region: string;
  text: string;
  tags: string[];
  image?: string;
  photoSource?: string;
  mapQuery?: string;
  bestTime?: string;
  practical?: string;
  history?: string;
  landscapes?: string[];
};
type Topic = { title: string; intro: string; query: string; source?: string; places: Place[] };

const commonsImage = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=900`;

const landscapeFilters = [
  { id: 'all', label: 'Tous' }, { id: 'forêt', label: 'Forêts' }, { id: 'montagne', label: 'Montagnes' },
  { id: 'lac', label: 'Lacs' }, { id: 'canyon', label: 'Canyons' }, { id: 'oasis', label: 'Oasis' }, { id: 'désert', label: 'Désert' },
];

const matchesLandscape = (place: Place, filter: string) => {
  if (filter === 'all') return true;
  const searchable = `${place.name} ${place.text} ${place.tags.join(' ')}`.toLocaleLowerCase('fr');
  const terms: Record<string, string[]> = {
    forêt: ['forêt', 'kroumirie'], montagne: ['montagne', 'massif', 'djebel', 'sommet'], lac: ['lac'],
    canyon: ['canyon', 'gorge', 'ravin'], oasis: ['oasis', 'palmeraie'], désert: ['désert', 'sahara', 'dunes', 'chott'],
  };
  return terms[filter]?.some((term) => searchable.includes(term)) ?? false;
};

const topics: Record<string, Topic> = {
  'villages-patrimoine': {
    title: 'Villages et patrimoine méconnus',
    intro: 'Des villages perchés, des habitats troglodytes, des médinas et des architectures régionales à découvrir en prenant le temps.',
    query: 'guide touristique patrimoine village',
    source: 'https://www.discovertunisia.com/tunisie-sahara/ksour-et-villages-berberes',
    places: [
      { name: 'Takrouna', region: 'Sousse', text: 'Village perché offrant un paysage ouvert sur le Sahel et une architecture traditionnelle.', tags: ['village', 'panorama'], image: commonsImage('Takrouna, vue depuis des champs - Tunisie.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Takrouna,_vue_depuis_des_champs_-_Tunisie.jpg', mapQuery: 'Village de Takrouna Tunisie', bestTime: 'Automne, hiver doux et printemps.', practical: 'Les ruelles et les passages sont parfois raides : prévoyez de bonnes chaussures et respectez les habitations.', history: 'Installé sur un piton rocheux, Takrouna conserve la mémoire d’un ancien habitat amazigh du Sahel. Le village et ses alentours furent aussi marqués par les combats de la campagne de Tunisie en 1943.' },
      { name: 'Kesra', region: 'Siliana', text: 'Village de montagne connu pour ses ruelles, ses sources et son environnement rocheux.', tags: ['montagne', 'patrimoine'], image: commonsImage('Kesra.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Kesra.jpg', mapQuery: 'Vieux village de Kesra Tunisie', bestTime: 'Printemps et automne.', practical: 'Le village se situe en altitude : prévoyez une veste hors saison et prenez le temps de visiter le musée du patrimoine.', history: 'L’occupation du site remonte à l’Antiquité. Le village a conservé un bâti de pierre sèche, des ruelles étroites et un rapport étroit aux sources qui structurent encore son identité.' },
      { name: 'Chenini', region: 'Tataouine', text: 'Village berbère accroché à la montagne, avec ghorfas et habitations creusées dans la roche.', tags: ['Dahar', 'berbère'], image: commonsImage('Vue panoramique du village berbère de Chenini, Tataouine, Tunisie.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Vue_panoramique_du_village_berb%C3%A8re_de_Chenini,_Tataouine,_Tunisie.jpg', mapQuery: 'Chenini Tataouine Tunisie', bestTime: 'Octobre à avril.', practical: 'Privilégiez une visite accompagnée pour comprendre l’architecture, l’histoire et accéder aux chemins adaptés.', history: 'Chenini illustre l’adaptation des communautés amazighes au relief du Dahar : habitat adossé à la montagne, greniers et position défensive formaient un ensemble pensé pour vivre et conserver les récoltes.' },
      { name: 'Douiret', region: 'Tataouine', text: 'Ancien village fortifié du Dahar, remarquable par son implantation et sa mosquée souterraine.', tags: ['ksar', 'architecture'], image: commonsImage('Douiret, village berbere du sud tunisien.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Douiret,_village_berbere_du_sud_tunisien.jpg', mapQuery: 'Vieux village Douiret Tataouine Tunisie', bestTime: 'Octobre à avril.', practical: 'Le site est étendu et exposé au soleil : eau, chaussures stables et accompagnement local sont recommandés.', history: 'Le vieux village s’est développé autour d’un grenier fortifié. Ses ghorfas protégeaient céréales et biens, tandis que son implantation en hauteur sécurisait les échanges et la vie communautaire.' },
      { name: 'Matmata', region: 'Gabès', text: 'Territoire célèbre pour ses habitations troglodytes organisées autour de cours creusées.', tags: ['troglodyte', 'Sud'], image: commonsImage('Matmata Panorama.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Matmata_Panorama.jpg', mapQuery: 'Matmata ancienne Tunisie', bestTime: 'Octobre à avril.', practical: 'Certaines maisons sont encore habitées : demandez l’autorisation avant d’entrer ou de photographier.', history: 'Creusées autour d’une cour centrale, les maisons troglodytes offrent une protection naturelle contre les fortes chaleurs et le froid. Elles témoignent d’un savoir-faire transmis sur plusieurs générations.' },
      { name: 'Testour', region: 'Béja', text: 'Ville d’héritage andalou connue pour sa médina, son architecture et sa tradition musicale.', tags: ['andalou', 'médina'], image: commonsImage('Andalusian Testour (39070672135).jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Andalusian_Testour_(39070672135).jpg', mapQuery: 'Médina de Testour Tunisie', bestTime: 'Toute l’année, avec une préférence pour le printemps et l’automne.', practical: 'Parcourez le centre à pied et prenez le temps d’observer la Grande Mosquée et les détails de l’architecture andalouse.', history: 'Testour fut profondément façonnée au XVIIe siècle par l’arrivée de populations morisques venues d’Espagne. Leur héritage se lit dans l’urbanisme, les tuiles, la Grande Mosquée et la tradition du malouf.' },
      { name: 'Zriba Olia', region: 'Zaghouan', text: 'Ancien village de pierre installé entre deux reliefs, avec vues sur le Djebel Zaghouan.', tags: ['ruines', 'montagne'], image: commonsImage('Zriba Olia tunisia.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Zriba_Olia_tunisia.jpg', mapQuery: 'Zriba Olia Zaghouan Tunisie', bestTime: 'Automne à printemps.', practical: 'Le terrain est irrégulier et le site fragile : restez sur les passages existants et ne montez pas sur les murs.', history: 'Ce village d’origine amazighe s’est développé entre deux pics rocheux. Aujourd’hui en ruines, il conserve des maisons, une mosquée et l’organisation serrée d’un habitat de montagne.' },
      { name: 'Toujane', region: 'Gabès', text: 'Village accroché à la montagne, connu pour ses maisons de pierre et ses tissages.', tags: ['Dahar', 'tissage'], image: commonsImage('Toujane (Tunisie).JPG'), photoSource: 'https://commons.wikimedia.org/wiki/File:Toujane_(Tunisie).JPG', mapQuery: 'Toujane Gabès Tunisie', bestTime: 'Octobre à avril.', practical: 'La route est sinueuse ; stationnez sans gêner les habitants et privilégiez une découverte à pied.', history: 'Toujane s’inscrit dans l’ancien peuplement amazigh du Sud-Est. Son implantation sur le relief et ses constructions en pierre répondent au climat et à la nécessité de protéger terres et ressources.' },
      { name: 'Tamezret', region: 'Gabès', text: 'Village amazigh du Dahar aux ruelles en pente et aux maisons minérales.', tags: ['amazigh', 'musée'], image: commonsImage('View of Tamezret.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:View_of_Tamezret.jpg', mapQuery: 'Tamezret Gabès Tunisie', bestTime: 'Octobre à avril.', practical: 'Visitez à pied et renseignez-vous sur les petits musées ou initiatives locales avant votre arrivée.', history: 'Tamezret conserve une forte identité amazighe, visible dans son implantation, ses traditions et les efforts locaux de transmission de la langue et de la mémoire du village.' },
      { name: 'Guermessa', region: 'Tataouine', text: 'Ancien village de montagne dont les ruines épousent une crête rocheuse.', tags: ['village perché', 'Dahar'], image: commonsImage('Guermassa , village berbere du sud tunisien.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Guermassa_%2C_village_berbere_du_sud_tunisien.jpg', mapQuery: 'Vieux village Guermessa Tataouine Tunisie', bestTime: 'Octobre à avril.', practical: 'Site isolé, escarpé et sans beaucoup d’ombre : eau, chaussures adaptées et guide local sont conseillés.', history: 'Le vieux Guermessa formait un habitat défensif perché du Dahar. Ses constructions, ses grottes et ses espaces de stockage racontent l’organisation des communautés montagnardes du Sud.' },
      { name: 'Ksar Ouled Soltane', region: 'Tataouine', text: 'Grenier collectif remarquable par ses cours et ses ghorfas superposées.', tags: ['ksar', 'ghorfas'], image: commonsImage('Ksar Ouled Soltane.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Ksar_Ouled_Soltane.jpg', mapQuery: 'Ksar Ouled Soltane Tataouine Tunisie', bestTime: 'Octobre à avril.', practical: 'Respectez les artisans et les parties restaurées ; demandez avant de photographier une personne ou son étal.', history: 'Le ksar servait de grenier collectif : chaque famille utilisait des ghorfas fermées pour conserver céréales, huile et biens précieux. Les cellules superposées entourent deux cours intérieures.' },
      { name: 'Ksar Hadada', region: 'Tataouine', text: 'Ensemble de ghorfas en terre, caractéristique des greniers collectifs du Sud tunisien.', tags: ['ksar', 'architecture'], image: commonsImage('Ksar Hadadda.JPG'), photoSource: 'https://commons.wikimedia.org/wiki/File:Ksar_Hadadda.JPG', mapQuery: 'Ksar Hadada Tataouine Tunisie', bestTime: 'Octobre à avril.', practical: 'Certaines parties accueillent des activités touristiques : vérifiez les horaires et respectez les zones non accessibles.', history: 'Ksar Hadada appartenait au réseau de greniers collectifs du Sud-Est. Ses ghorfas voûtées, regroupées autour de cours, protégeaient les réserves des familles et facilitaient leur gestion commune.' },
    ],
  },
  'nature-randonnees': {
    title: 'Nature et randonnées en Tunisie',
    intro: 'Forêts, montagnes, lacs, ravins, canyons, oasis et désert : la Tunisie offre des paysages très différents selon les régions et les saisons.',
    query: 'randonnée guide excursion nature',
    source: 'https://www.discovertunisia.com/en/discover',
    places: [
      { name: 'Aïn Draham et les forêts de Kroumirie', region: 'Jendouba', text: 'Un paysage forestier dense de chênes-lièges et de reliefs, adapté aux promenades et randonnées accompagnées.', tags: ['forêt', 'montagne'], image: commonsImage('Foret de pin et de chenes à Ain Draham.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Foret_de_pin_et_de_chenes_%C3%A0_Ain_Draham.jpg', mapQuery: 'Aïn Draham Tunisie', bestTime: 'Automne et printemps ; hiver pour l’ambiance brumeuse.', practical: 'Prévoir chaussures adhérentes et vêtements chauds : pluie et brouillard peuvent arriver rapidement.' },
      { name: 'Beni M’Tir', region: 'Jendouba', text: 'Village de montagne entouré de forêts, de vallées et de points de vue sur le Nord-Ouest.', tags: ['forêt', 'village'], image: commonsImage('Beni Mtir village.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Beni_Mtir_village.jpg', mapQuery: 'Beni M Tir Tunisie', bestTime: 'Printemps et automne.', practical: 'Le village et le barrage se découvrent tranquillement ; vérifiez les accès avant une randonnée isolée.' },
      { name: 'Parc national d’El Feija', region: 'Jendouba', text: 'Massif forestier du Nord-Ouest connu pour ses paysages naturels et sa biodiversité.', tags: ['parc national', 'forêt'], image: commonsImage('01 Feija national park.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:01_Feija_national_park.jpg', mapQuery: 'Parc national El Feija Tunisie', bestTime: 'Printemps et automne.', practical: 'Renseignez-vous localement sur les horaires, autorisations et secteurs accessibles avant le départ.' },
      { name: 'Parc national de l’Ichkeul', region: 'Bizerte', text: 'Lac, marais et montagne composent une grande zone naturelle importante pour les oiseaux migrateurs.', tags: ['lac', 'oiseaux'], image: commonsImage('201echkkell5.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:201echkkell5.jpg', mapQuery: 'Parc national Ichkeul Tunisie', bestTime: 'Automne et hiver pour l’observation des oiseaux.', practical: 'Jumelles utiles ; respectez les sentiers et les zones naturelles protégées.' },
      { name: 'Cap Serrat et Sejnane', region: 'Bizerte', text: 'Une région où se rencontrent littoral sauvage, collines, forêts et savoir-faire ruraux.', tags: ['littoral', 'forêt'], image: commonsImage('Cap Serrat Bizerte.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/Category:Cap_Serrat', mapQuery: 'Cap Serrat Tunisie', bestTime: 'Printemps, début d’été et automne.', practical: 'Certaines routes sont sinueuses ou peu équipées : prévoyez eau, carburant et réseau hors ligne.' },
      { name: 'Djebel Zaghouan', region: 'Zaghouan', text: 'Massif calcaire dominant la région, apprécié pour les sentiers, les panoramas et les sources.', tags: ['montagne', 'randonnée'], image: commonsImage('Jbal Zaghouan.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Jbal_Zaghouan.jpg', mapQuery: 'Djebel Zaghouan Tunisie', bestTime: 'Automne, hiver doux et printemps.', practical: 'Choisissez un parcours adapté à votre niveau et évitez les heures les plus chaudes.' },
      { name: 'Parc national de Boukornine', region: 'Ben Arous', text: 'Montagne proche du Grand Tunis offrant des itinéraires nature et des vues sur le golfe.', tags: ['parc national', 'Grand Tunis'], image: commonsImage('Bougarnine au lever du soleil.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Bougarnine_au_lever_du_soleil.jpg', mapQuery: 'Parc national Boukornine Tunisie', bestTime: 'Automne à printemps.', practical: 'Vérifiez l’ouverture et les accès autorisés ; partez tôt avec eau et protection solaire.' },
      { name: 'Djebel Chambi', region: 'Kasserine', text: 'Le plus haut sommet de Tunisie, dans un environnement montagneux à aborder avec préparation et renseignements locaux.', tags: ['sommet', 'montagne'], image: commonsImage('Djebel Chambi.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Djebel_Chambi.jpg', mapQuery: 'Djebel Chambi Tunisie', bestTime: 'Printemps et automne, selon les conditions locales.', practical: 'Consultez impérativement les autorités et guides locaux sur l’accessibilité et la sécurité avant tout déplacement.' },
      { name: 'Chebika', region: 'Tozeur', text: 'Oasis de montagne où l’eau descend entre les roches, avec palmeraie, sentiers et points de vue.', tags: ['oasis', 'cascade'], image: commonsImage('Abandoned Chebika Village and Oasis.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Abandoned_Chebika_Village_and_Oasis.jpg', mapQuery: 'Oasis Chebika Tozeur Tunisie', bestTime: 'Octobre à avril.', practical: 'Bonnes chaussures, eau et chapeau ; les pierres peuvent être glissantes près des sources.' },
      { name: 'Tamerza', region: 'Tozeur', text: 'Paysages de montagne, cascades et gorges aux portes du Sahara.', tags: ['gorge', 'oasis'], image: commonsImage('A waterfall in the Tamaghza (Tamerza) oasis.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:A_waterfall_in_the_Tamaghza_(Tamerza)_oasis.jpg', mapQuery: 'Cascade Tamerza Tunisie', bestTime: 'Octobre à avril.', practical: 'La chaleur devient forte en journée ; combinez la visite avec Chebika et Midès avec un accompagnateur local.' },
      { name: 'Canyon et oasis de Midès', region: 'Tozeur', text: 'Un ravin spectaculaire bordé par une ancienne oasis de montagne et sa palmeraie, près de la frontière algérienne.', tags: ['oasis', 'canyon', 'ravin'], image: commonsImage('Tunisia 10-12 - 173 - Atlas Mountains & Mides Canyon (6610491215).jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Tunisia_10-12_-_173_-_Atlas_Mountains_%26_Mides_Canyon_(6610491215).jpg', mapQuery: 'Canyon Midès Tunisie', bestTime: 'Octobre à avril.', practical: 'Site proche de la frontière : restez sur les parcours autorisés et renseignez-vous sur les conditions locales.' },
      { name: 'Sidi Bouhlel', region: 'Tozeur', text: 'Canyon désertique aux falaises minérales, à découvrir de préférence avec un accompagnement local.', tags: ['canyon', 'désert'], image: commonsImage('Sidi Bouhlel 1.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Sidi_Bouhlel_1.jpg', mapQuery: 'Sidi Bouhlel canyon Tunisie', bestTime: 'Octobre à avril.', practical: 'Terrain isolé : privilégiez une excursion encadrée et ne partez pas sans eau ni moyen de communication.' },
      { name: 'Chott el-Jérid', region: 'Kébili / Tozeur', text: 'Immense étendue saline dont les couleurs et mirages changent selon la lumière et la saison.', tags: ['chott', 'paysage'], image: commonsImage('Chott el Djerid.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/Category:Chott_el_Djerid', mapQuery: 'Chott el Jérid Tunisie', bestTime: 'Octobre à avril, tôt le matin ou avant le coucher du soleil.', practical: 'Ne quittez pas la route ou les zones aménagées : la croûte saline peut être instable.' },
      { name: 'Douz et le Grand Erg Oriental', region: 'Kébili', text: 'Porte du désert pour découvrir les dunes et organiser une sortie saharienne encadrée.', tags: ['dunes', 'Sahara'], image: commonsImage('Le désert de Douz.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Le_d%C3%A9sert_de_Douz.jpg', mapQuery: 'Douz Tunisie', bestTime: 'Novembre à mars.', practical: 'Pour entrer dans les dunes, choisissez un guide reconnu et vérifiez météo, véhicule et moyens de communication.' },
      { name: 'Ksar Ghilane', region: 'Kébili', text: 'Oasis aux portes des grandes dunes, point de départ d’expériences dans le désert.', tags: ['oasis', 'dunes'], image: commonsImage('Ksar ghilane, Qibili,Tunisie.webp'), photoSource: 'https://commons.wikimedia.org/wiki/File:Ksar_ghilane,_Qibili,Tunisie.webp', mapQuery: 'Ksar Ghilane Tunisie', bestTime: 'Octobre à avril.', practical: 'La route est longue et les services espacés : vérifiez carburant, eau et état du véhicule.' },
      { name: 'Palmeraie de Tozeur', region: 'Tozeur', text: 'Une vaste palmeraie irriguée où chemins, jardins et cultures se déploient sous les dattiers.', tags: ['oasis', 'palmeraie'], image: commonsImage('Tozeur-palmeraie.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Tozeur-palmeraie.jpg', mapQuery: 'Palmeraie de Tozeur Tunisie', bestTime: 'Octobre à avril, tôt le matin ou en fin de journée.', practical: 'Privilégiez une visite guidée à pied ou à vélo et respectez les parcelles cultivées ainsi que les canaux d’irrigation.' },
      { name: 'Nefta et la Corbeille', region: 'Tozeur', text: 'Une oasis historique organisée autour d’une cuvette naturelle, avec palmiers et points de vue sur le Jérid.', tags: ['oasis', 'palmeraie'], image: commonsImage('Corbeille in Nefta.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Corbeille_in_Nefta.jpg', mapQuery: 'Corbeille de Nefta Tunisie', bestTime: 'Octobre à avril.', practical: 'Restez sur les chemins aménagés et évitez les heures chaudes ; certains passages peuvent être glissants après la pluie.' },
      { name: 'Oasis littorale de Gabès', region: 'Gabès', text: 'Une oasis rare au contact de la mer, où palmiers, cultures étagées et habitat composent un paysage vivant.', tags: ['oasis', 'littoral'], image: commonsImage('Oasis de Gabès (15881).jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Oasis_de_Gab%C3%A8s_(15881).jpg', mapQuery: 'Oasis de Chenini Gabès Tunisie', bestTime: 'Automne à printemps.', practical: 'Découvrez-la avec un acteur local : l’oasis est un espace agricole habité, pas seulement un site de promenade.' },
      { name: 'Degache et sa palmeraie', region: 'Tozeur', text: 'Une ville-oasis du Jérid bordée de palmiers-dattiers, proche du Chott el-Jérid et de l’ancien site de Thagis.', tags: ['oasis', 'dattes'], image: commonsImage('Degache.JPG'), photoSource: 'https://commons.wikimedia.org/wiki/File:Degache.JPG', mapQuery: 'Degache Tozeur Tunisie', bestTime: 'Octobre à avril.', practical: 'Combinez la palmeraie avec une découverte du bourg ; demandez l’autorisation avant d’entrer dans une parcelle agricole.' },
      { name: 'Parc national de Dghoumès', region: 'Tozeur', text: 'Un paysage saharien protégé où reliefs arides, végétation adaptée et faune réintroduite racontent le désert vivant.', tags: ['désert', 'parc national'], image: commonsImage('Payasage du parc dghoumes.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Payasage_du_parc_dghoumes.jpg', mapQuery: 'Parc national de Dghoumès Tunisie', bestTime: 'Novembre à mars.', practical: 'Renseignez-vous avant le départ sur l’ouverture, l’accès et la nécessité d’un accompagnement ; ne quittez pas les parcours autorisés.' },
      { name: 'Massif du Dahar', region: 'Tataouine / Médenine', text: 'Montagnes, plateaux désertiques, villages berbères et ksour forment des itinéraires très variés.', tags: ['montagne', 'désert'], image: commonsImage('Vue panoramique du village berbère de Chenini, Tataouine, Tunisie.jpg'), photoSource: 'https://commons.wikimedia.org/wiki/File:Vue_panoramique_du_village_berb%C3%A8re_de_Chenini,_Tataouine,_Tunisie.jpg', mapQuery: 'Dahar Tataouine Tunisie', bestTime: 'Octobre à avril.', practical: 'Le territoire est vaste : préparez une boucle précise et privilégiez un guide pour les pistes et villages éloignés.' },
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
  fr: { back: 'Retour à Tourisme & Expatriation', useful: 'À savoir', note: 'Pour les zones isolées, montagneuses ou désertiques, vérifiez la météo, l’accès et les conditions locales. Faites appel à un guide lorsque le terrain l’exige.', pros: 'Trouver les professionnels et services associés', source: 'Consulter la source touristique officielle', discover: 'Voir la fiche', route: 'Itinéraire', period: 'Meilleure période', practical: 'Conseil pratique', history: 'Un peu d’histoire', photo: 'Source de la photo', close: 'Fermer' },
  ar: { back: 'العودة إلى السياحة والإقامة', useful: 'معلومة مهمة', note: 'بالنسبة إلى المناطق المعزولة أو الجبلية أو الصحراوية، تحقق من الطقس والطريق والظروف المحلية واستعن بدليل عند الحاجة.', pros: 'البحث عن المهنيين والخدمات المرتبطة', source: 'الاطلاع على المصدر السياحي الرسمي', discover: 'عرض التفاصيل', route: 'المسار', period: 'أفضل فترة', practical: 'نصيحة عملية', history: 'لمحة تاريخية', photo: 'مصدر الصورة', close: 'إغلاق' },
  en: { back: 'Back to Tourism & Expatriation', useful: 'Good to know', note: 'For remote, mountain or desert areas, check weather, access and local conditions. Use a guide where the terrain requires it.', pros: 'Find related professionals and services', source: 'View the official tourism source', discover: 'View details', route: 'Directions', period: 'Best time', practical: 'Practical advice', history: 'A little history', photo: 'Photo source', close: 'Close' },
  it: { back: 'Torna a Turismo ed Espatrio', useful: 'Da sapere', note: 'Per zone isolate, montane o desertiche, verifica meteo, accesso e condizioni locali. Affidati a una guida quando necessario.', pros: 'Trova professionisti e servizi collegati', source: 'Consulta la fonte turistica ufficiale', discover: 'Vedi dettagli', route: 'Itinerario', period: 'Periodo migliore', practical: 'Consiglio pratico', history: 'Un po’ di storia', photo: 'Fonte foto', close: 'Chiudi' },
  ru: { back: 'Назад к туризму и переезду', useful: 'Полезно знать', note: 'Для удалённых, горных или пустынных районов проверяйте погоду, доступ и местные условия. При необходимости обращайтесь к гиду.', pros: 'Найти специалистов и услуги', source: 'Открыть официальный туристический источник', discover: 'Подробнее', route: 'Маршрут', period: 'Лучшее время', practical: 'Практический совет', history: 'Немного истории', photo: 'Источник фото', close: 'Закрыть' },
} as const;

export default function TourismGuideTopic() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as keyof typeof labels;
  const topic = slug ? topics[slug] : undefined;
  useEffect(() => { setSelectedPlace(null); setActiveFilter('all'); }, [slug]);
  if (!topic) return <Navigate to="/citizens/tourism" replace />;
  const ui = labels[lang];
  const isRTL = lang === 'ar';
  const visiblePlaces = topic.places.filter((place) => slug !== 'nature-randonnees' || matchesLandscape(place, activeFilter));
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead title={`${topic.title} | Dalil Tounes`} description={topic.intro} canonical={`https://dalil-tounes.com/citizens/tourism/guide/${slug}`} currentPath={`/citizens/tourism/guide/${slug}`} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Link to="/citizens/tourism" className="inline-flex items-center gap-2 text-sm font-medium text-[#4A1D43] hover:text-[#D4AF37]"><ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />{ui.back}</Link>
        <header className="mt-5 border-b border-[#D4AF37]/40 pb-5">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#4A1D43]" style={{ fontFamily: "'Playfair Display', serif" }}>{topic.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">{topic.intro}</p>
        </header>
        {slug === 'nature-randonnees' && <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filtrer par paysage">{landscapeFilters.map((filter) => <button key={filter.id} type="button" onClick={() => setActiveFilter(filter.id)} aria-pressed={activeFilter === filter.id} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${activeFilter === filter.id ? 'border-[#4A1D43] bg-[#4A1D43] text-white' : 'border-[#D4AF37]/50 bg-white text-[#4A1D43] hover:border-[#D4AF37]'}`}>{filter.label}</button>)}</div>}
        <section className="mt-5 grid gap-3 sm:grid-cols-2">
          {visiblePlaces.map((place) => (
            <article key={place.name} className="overflow-hidden rounded-xl border border-[#D4AF37]/45 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              {place.image && <img src={place.image} alt={place.name} loading="lazy" className="h-36 w-full object-cover" onError={(event) => { event.currentTarget.src = '/images/drapeau-tunisie.webp'; event.currentTarget.className = 'h-36 w-full bg-gray-50 object-contain p-6'; }} />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3"><h2 className="text-base font-semibold text-[#4A1D43]">{place.name}</h2><span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-gray-500"><MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />{place.region}</span></div>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">{place.text}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">{place.tags.map((tag) => <span key={tag} className="rounded-full bg-[#D4AF37]/10 px-2 py-1 text-[10px] text-[#4A1D43]">{tag}</span>)}</div>
                {(place.mapQuery || place.practical) && <button type="button" onClick={() => setSelectedPlace(place)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A1D43] hover:text-[#D4AF37]"><Info className="h-3.5 w-3.5" />{ui.discover}</button>}
              </div>
            </article>
          ))}
        </section>
        <aside className="mt-5 rounded-xl border border-[#D4AF37] bg-[#FFFDF8] p-4"><h2 className="text-sm font-semibold text-[#4A1D43]">{ui.useful}</h2><p className="mt-1 text-xs leading-relaxed text-gray-600">{ui.note}</p></aside>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link to={`/recherche?q=${encodeURIComponent(topic.query)}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37] bg-[#4A1D43] px-4 py-2.5 text-sm font-semibold text-[#D4AF37]"><Search className="h-4 w-4" />{ui.pros}</Link>
          {topic.source && <a href={topic.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/60 bg-white px-4 py-2.5 text-sm font-semibold text-[#4A1D43]"><ExternalLink className="h-4 w-4" />{ui.source}</a>}
        </div>
      </main>
      {selectedPlace && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={selectedPlace.name} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedPlace(null); }}>
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="relative">
              {selectedPlace.image && <img src={selectedPlace.image} alt={selectedPlace.name} className="h-48 w-full object-cover sm:h-56" onError={(event) => { event.currentTarget.src = '/images/drapeau-tunisie.webp'; event.currentTarget.className = 'h-48 w-full bg-gray-50 object-contain p-8 sm:h-56'; }} />}
              <button type="button" onClick={() => setSelectedPlace(null)} aria-label={ui.close} className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-[#4A1D43] shadow"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3"><h2 className="text-xl font-semibold text-[#4A1D43]">{selectedPlace.name}</h2><span className="inline-flex shrink-0 items-center gap-1 text-xs text-gray-500"><MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />{selectedPlace.region}</span></div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{selectedPlace.text}</p>
              {selectedPlace.history && <div className="mt-4 rounded-lg border-l-2 border-[#D4AF37] bg-[#FFFDF8] p-3"><p className="text-xs font-semibold text-[#4A1D43]">{ui.history}</p><p className="mt-1 text-xs leading-relaxed text-gray-600">{selectedPlace.history}</p></div>}
              {selectedPlace.bestTime && <div className="mt-4 flex gap-3 rounded-lg bg-[#FFF9E9] p-3"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#B38A16]" /><div><p className="text-xs font-semibold text-[#4A1D43]">{ui.period}</p><p className="mt-0.5 text-xs leading-relaxed text-gray-600">{selectedPlace.bestTime}</p></div></div>}
              {selectedPlace.practical && <div className="mt-2 flex gap-3 rounded-lg bg-gray-50 p-3"><Info className="mt-0.5 h-4 w-4 shrink-0 text-[#4A1D43]" /><div><p className="text-xs font-semibold text-[#4A1D43]">{ui.practical}</p><p className="mt-0.5 text-xs leading-relaxed text-gray-600">{selectedPlace.practical}</p></div></div>}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                {selectedPlace.mapQuery && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.mapQuery)}`} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#4A1D43] px-4 py-2.5 text-sm font-semibold text-[#D4AF37]"><Navigation className="h-4 w-4" />{ui.route}</a>}
                <Link to={`/recherche?q=${encodeURIComponent(`${topic.query} ${selectedPlace.region}`)}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#D4AF37] px-4 py-2.5 text-center text-xs font-semibold text-[#4A1D43]"><Search className="h-4 w-4" />{ui.pros}</Link>
              </div>
              {selectedPlace.photoSource && <a href={selectedPlace.photoSource} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-[#4A1D43]"><ExternalLink className="h-3 w-3" />{ui.photo}</a>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
