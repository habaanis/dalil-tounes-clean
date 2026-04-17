import { generateSlug } from './slugify';

export interface MetierEntry {
  slug: string;
  label: string;
  value: string;
  secteur?: string;
}

export interface VilleEntry {
  slug: string;
  label: string;
  gouvernorat: string;
}

export interface SousCategorieEntry {
  slug: string;
  label: string;
}

export const SEO_METIERS: MetierEntry[] = [
  // Santé
  { slug: 'medecin-generaliste', label: 'Médecin Généraliste', value: 'Médecin Généraliste', secteur: 'Santé' },
  { slug: 'medecin-specialiste', label: 'Médecin Spécialiste', value: 'Médecin Spécialiste', secteur: 'Santé' },
  { slug: 'cardiologue', label: 'Cardiologue', value: 'Cardiologue', secteur: 'Santé' },
  { slug: 'dentiste', label: 'Dentiste', value: 'Dentiste', secteur: 'Santé' },
  { slug: 'chirurgien-dentiste', label: 'Chirurgien-dentiste', value: 'Chirurgien-dentiste', secteur: 'Santé' },
  { slug: 'orthodontiste', label: 'Orthodontiste', value: 'Orthodontiste', secteur: 'Santé' },
  { slug: 'pediatre', label: 'Pédiatre', value: 'Pédiatre', secteur: 'Santé' },
  { slug: 'gynecologue', label: 'Gynécologue', value: 'Gynécologue', secteur: 'Santé' },
  { slug: 'dermatologue', label: 'Dermatologue', value: 'Dermatologue', secteur: 'Santé' },
  { slug: 'ophtalmologue', label: 'Ophtalmologue', value: 'Ophtalmologue', secteur: 'Santé' },
  { slug: 'orl', label: 'ORL', value: 'ORL', secteur: 'Santé' },
  { slug: 'kinesitherapeute', label: 'Kinésithérapeute', value: 'Kinésithérapeute', secteur: 'Santé' },
  { slug: 'osteopathe', label: 'Ostéopathe', value: 'Ostéopathe', secteur: 'Santé' },
  { slug: 'podologue', label: 'Podologue', value: 'Podologue', secteur: 'Santé' },
  { slug: 'psychologue', label: 'Psychologue', value: 'Psychologue', secteur: 'Santé' },
  { slug: 'psychiatre', label: 'Psychiatre', value: 'Psychiatre', secteur: 'Santé' },
  { slug: 'orthophoniste', label: 'Orthophoniste', value: 'Orthophoniste', secteur: 'Santé' },
  { slug: 'dieticien', label: 'Diététicien', value: 'Diététicien', secteur: 'Santé' },
  { slug: 'pharmacie', label: 'Pharmacie', value: 'Pharmacie', secteur: 'Santé' },
  { slug: 'laboratoire-analyse', label: 'Laboratoire d\'analyses', value: 'Laboratoire d\'analyses', secteur: 'Santé' },
  { slug: 'radiologie', label: 'Radiologie', value: 'Radiologie', secteur: 'Santé' },
  { slug: 'infirmier', label: 'Infirmier', value: 'Infirmier', secteur: 'Santé' },
  { slug: 'sage-femme', label: 'Sage-femme', value: 'Sage-femme', secteur: 'Santé' },
  { slug: 'ambulance', label: 'Ambulance', value: 'Ambulance', secteur: 'Santé' },
  { slug: 'optique-lunetterie', label: 'Optique - Lunetterie', value: 'Optique - Lunetterie', secteur: 'Santé' },
  { slug: 'audioprothesiste', label: 'Audioprothésiste', value: 'Audioprothésiste', secteur: 'Santé' },

  // Artisanat & Services
  { slug: 'plombier', label: 'Plombier', value: 'Plombier', secteur: 'Services' },
  { slug: 'electricien', label: 'Électricien', value: 'Électricien', secteur: 'Services' },
  { slug: 'menuisier', label: 'Menuisier', value: 'Menuisier', secteur: 'Artisanat' },
  { slug: 'serrurier', label: 'Serrurier', value: 'Serrurier', secteur: 'Services' },
  { slug: 'peintre', label: 'Peintre', value: 'Peintre', secteur: 'Artisanat' },
  { slug: 'carreleur', label: 'Carreleur', value: 'Carreleur', secteur: 'Artisanat' },
  { slug: 'maccon', label: 'Maçon', value: 'Maçon', secteur: 'Artisanat' },
  { slug: 'architecte', label: 'Architecte', value: 'Architecte', secteur: 'Profession libérale' },
  { slug: 'ingenieur', label: 'Ingénieur', value: 'Ingénieur', secteur: 'Profession libérale' },
  { slug: 'geometre', label: 'Géomètre', value: 'Géomètre', secteur: 'Profession libérale' },
  { slug: 'notaire', label: 'Notaire', value: 'Notaire', secteur: 'Juridique' },
  { slug: 'avocat', label: 'Avocat', value: 'Avocat', secteur: 'Juridique' },
  { slug: 'expert-comptable', label: 'Expert-comptable', value: 'Expert-comptable', secteur: 'Juridique' },
  { slug: 'conseil-juridique', label: 'Conseil juridique', value: 'Conseil juridique', secteur: 'Juridique' },
  { slug: 'huissier', label: 'Huissier de justice', value: 'Huissier de justice', secteur: 'Juridique' },

  // Coiffure & Beauté
  { slug: 'coiffeur', label: 'Coiffeur', value: 'Coiffeur', secteur: 'Beauté' },
  { slug: 'coiffeur-homme', label: 'Coiffeur Homme', value: 'Coiffeur Homme', secteur: 'Beauté' },
  { slug: 'coiffeur-femme', label: 'Coiffeur Femme', value: 'Coiffeur Femme', secteur: 'Beauté' },
  { slug: 'coiffeur-domicile', label: 'Coiffeur à domicile', value: 'Coiffeur à domicile', secteur: 'Beauté' },
  { slug: 'barbier', label: 'Barbier', value: 'Barbier', secteur: 'Beauté' },
  { slug: 'institut-beaute', label: 'Institut de beauté', value: 'Institut de beauté', secteur: 'Beauté' },
  { slug: 'esthethicienne', label: 'Esthéticienne', value: 'Esthéticienne', secteur: 'Beauté' },
  { slug: 'onglerie', label: 'Onglerie', value: 'Onglerie', secteur: 'Beauté' },
  { slug: 'maquilleuse', label: 'Maquilleuse', value: 'Maquilleuse', secteur: 'Beauté' },
  { slug: 'spa-hammam', label: 'Spa & Hammam', value: 'Spa & Hammam', secteur: 'Beauté' },
  { slug: 'epilation', label: 'Épilation', value: 'Épilation', secteur: 'Beauté' },
  { slug: 'massage', label: 'Massage', value: 'Massage', secteur: 'Beauté' },

  // Auto & Transport
  { slug: 'auto-ecole', label: 'Auto-école', value: 'Auto-école', secteur: 'Transport' },
  { slug: 'mecanicien', label: 'Mécanicien', value: 'Mécanicien', secteur: 'Auto' },
  { slug: 'garage', label: 'Garage', value: 'Garage', secteur: 'Auto' },
  { slug: 'carrosserie', label: 'Carrosserie', value: 'Carrosserie', secteur: 'Auto' },
  { slug: 'lavage-auto', label: 'Lavage auto', value: 'Lavage auto', secteur: 'Auto' },
  { slug: 'vente-voiture', label: 'Vente de voitures', value: 'Vente de voitures', secteur: 'Auto' },
  { slug: 'location-voiture', label: 'Location de voitures', value: 'Location de voitures', secteur: 'Transport' },
  { slug: 'taxi', label: 'Taxi', value: 'Taxi', secteur: 'Transport' },
  { slug: 'transport-marchandises', label: 'Transport de marchandises', value: 'Transport de marchandises', secteur: 'Transport' },
  { slug: 'demenagement', label: 'Déménagement', value: 'Déménagement', secteur: 'Services' },

  // Alimentation & Restauration
  { slug: 'restaurant', label: 'Restaurant', value: 'Restaurant', secteur: 'Restauration' },
  { slug: 'restaurant-tunisien', label: 'Restaurant tunisien', value: 'Restaurant tunisien', secteur: 'Restauration' },
  { slug: 'fast-food', label: 'Fast-food', value: 'Fast-food', secteur: 'Restauration' },
  { slug: 'cafe', label: 'Café', value: 'Café', secteur: 'Restauration' },
  { slug: 'patisserie', label: 'Pâtisserie', value: 'Pâtisserie', secteur: 'Alimentation' },
  { slug: 'boulangerie', label: 'Boulangerie', value: 'Boulangerie', secteur: 'Alimentation' },
  { slug: 'boucherie', label: 'Boucherie', value: 'Boucherie', secteur: 'Alimentation' },
  { slug: 'poissonnerie', label: 'Poissonnerie', value: 'Poissonnerie', secteur: 'Alimentation' },
  { slug: 'epicerie', label: 'Épicerie', value: 'Épicerie', secteur: 'Alimentation' },
  { slug: 'supermarche', label: 'Supermarché', value: 'Supermarché', secteur: 'Alimentation' },
  { slug: 'traiteur', label: 'Traiteur', value: 'Traiteur', secteur: 'Restauration' },
  { slug: 'catering', label: 'Catering', value: 'Catering', secteur: 'Restauration' },

  // Mode & Shopping
  { slug: 'boutique-vetement', label: 'Boutique vêtements', value: 'Boutique vêtements', secteur: 'Mode' },
  { slug: 'boutique-chaussures', label: 'Boutique chaussures', value: 'Boutique chaussures', secteur: 'Mode' },
  { slug: 'bijouterie', label: 'Bijouterie', value: 'Bijouterie', secteur: 'Mode' },
  { slug: 'parfumerie', label: 'Parfumerie', value: 'Parfumerie', secteur: 'Mode' },
  { slug: 'cosmetiques', label: 'Cosmétiques', value: 'Cosmétiques', secteur: 'Beauté' },
  { slug: 'maroquinerie', label: 'Maroquinerie', value: 'Maroquinerie', secteur: 'Mode' },
  { slug: 'lingerie', label: 'Lingerie', value: 'Lingerie', secteur: 'Mode' },
  { slug: 'optique', label: 'Optique', value: 'Optique', secteur: 'Mode' },

  // Éducation & Formation
  { slug: 'jardin-enfant', label: 'Jardin d\'enfant', value: 'Jardin d\'enfant', secteur: 'Éducation' },
  { slug: 'ecole-privee', label: 'École privée', value: 'École privée', secteur: 'Éducation' },
  { slug: 'centre-formation', label: 'Centre de formation', value: 'Centre de formation', secteur: 'Éducation' },
  { slug: 'cours-particuliers', label: 'Cours particuliers', value: 'Cours particuliers', secteur: 'Éducation' },
  { slug: 'soutien-scolaire', label: 'Soutien scolaire', value: 'Soutien scolaire', secteur: 'Éducation' },
  { slug: 'universite', label: 'Université', value: 'Université', secteur: 'Éducation' },

  // Sports & Bien-être
  { slug: 'salle-sport', label: 'Salle de sport', value: 'Salle de sport', secteur: 'Sport' },
  { slug: 'fitness', label: 'Fitness', value: 'Fitness', secteur: 'Sport' },
  { slug: 'yoga', label: 'Yoga', value: 'Yoga', secteur: 'Bien-être' },
  { slug: 'piscine', label: 'Piscine', value: 'Piscine', secteur: 'Sport' },
  { slug: 'club-sportif', label: 'Club sportif', value: 'Club sportif', secteur: 'Sport' },
  { slug: 'coach-sportif', label: 'Coach sportif', value: 'Coach sportif', secteur: 'Sport' },

  // Multimédia & Tech
  { slug: 'informatique', label: 'Informatique', value: 'Informatique', secteur: 'Tech' },
  { slug: 'reparation-informatique', label: 'Réparation informatique', value: 'Réparation informatique', secteur: 'Tech' },
  { slug: 'telephonie', label: 'Téléphonie', value: 'Téléphonie', secteur: 'Tech' },
  { slug: 'internet-cafe', label: 'Internet café', value: 'Internet café', secteur: 'Tech' },
  { slug: 'photographe', label: 'Photographe', value: 'Photographe', secteur: 'Art' },
  { slug: 'videaste', label: 'Vidéaste', value: 'Vidéaste', secteur: 'Art' },
  { slug: 'graphiste', label: 'Graphiste', value: 'Graphiste', secteur: 'Art' },
  { slug: 'webmaster', label: 'Webmaster', value: 'Webmaster', secteur: 'Tech' },
  { slug: 'agence-web', label: 'Agence web', value: 'Agence web', secteur: 'Tech' },
  { slug: 'impression', label: 'Impression', value: 'Impression', secteur: 'Services' },

  // Immobilier & Construction
  { slug: 'agence-immobiliere', label: 'Agence immobilière', value: 'Agence immobilière', secteur: 'Immobilier' },
  { slug: 'promoteur-immobilier', label: 'Promoteur immobilier', value: 'Promoteur immobilier', secteur: 'Immobilier' },
  { slug: 'syndic', label: 'Syndic', value: 'Syndic', secteur: 'Immobilier' },
  { slug: 'diagnostiqueur', label: 'Diagnostiqueur', value: 'Diagnostiqueur', secteur: 'Immobilier' },

  // Événementiel & Loisirs
  { slug: 'traiteur-mariage', label: 'Traiteur mariage', value: 'Traiteur mariage', secteur: 'Événementiel' },
  { slug: 'decoration-mariage', label: 'Décoration mariage', value: 'Décoration mariage', secteur: 'Événementiel' },
  { slug: 'location-salle', label: 'Location de salle', value: 'Location de salle', secteur: 'Événementiel' },
  { slug: 'animation', label: 'Animation', value: 'Animation', secteur: 'Événementiel' },
  { slug: 'dj', label: 'DJ', value: 'DJ', secteur: 'Événementiel' },
  { slug: 'fleuriste', label: 'Fleuriste', value: 'Fleuriste', secteur: 'Événementiel' },
  { slug: 'cadeaux', label: 'Cadeaux', value: 'Cadeaux', secteur: 'Shopping' },

  // Animaux
  { slug: 'veterinaire', label: 'Vétérinaire', value: 'Vétérinaire', secteur: 'Animaux' },
  { slug: 'toilettage-animaux', label: 'Toilettage animaux', value: 'Toilettage animaux', secteur: 'Animaux' },
  { slug: 'animalerie', label: 'Animalerie', value: 'Animalerie', secteur: 'Animaux' },
  { slug: 'pension-animaux', label: 'Pension animaux', value: 'Pension animaux', secteur: 'Animaux' },

  // Nettoyage & Entretien
  { slug: 'nettoyage', label: 'Nettoyage', value: 'Nettoyage', secteur: 'Services' },
  { slug: 'femme-menage', label: 'Femme de ménage', value: 'Femme de ménage', secteur: 'Services' },
  { slug: 'nettoyage-industriel', label: 'Nettoyage industriel', value: 'Nettoyage industriel', secteur: 'Services' },
  { slug: 'jardinier', label: 'Jardinier', value: 'Jardinier', secteur: 'Services' },
  { slug: 'paysagiste', label: 'Paysagiste', value: 'Paysagiste', secteur: 'Services' },
  { slug: 'pisciniste', label: 'Pisciniste', value: 'Pisciniste', secteur: 'Services' },
];

export const SEO_VILLES: VilleEntry[] = [
  // Grand Tunis
  { slug: 'tunis', label: 'Tunis', gouvernorat: 'Tunis' },
  { slug: 'la-marsa', label: 'La Marsa', gouvernorat: 'Tunis' },
  { slug: 'carthage', label: 'Carthage', gouvernorat: 'Tunis' },
  { slug: 'ariana', label: 'Ariana', gouvernorat: 'Ariana' },
  { slug: 'ennasr', label: 'Ennasr', gouvernorat: 'Ariana' },
  { slug: 'el-menzah', label: 'El Menzah', gouvernorat: 'Ariana' },
  { slug: 'ben-arous', label: 'Ben Arous', gouvernorat: 'Ben Arous' },
  { slug: 'rades', label: 'Radès', gouvernorat: 'Ben Arous' },
  { slug: 'la-manouba', label: 'La Manouba', gouvernorat: 'La Manouba' },
  // Nord-Est
  { slug: 'nabeul', label: 'Nabeul', gouvernorat: 'Nabeul' },
  { slug: 'hammamet', label: 'Hammamet', gouvernorat: 'Nabeul' },
  { slug: 'kelibia', label: 'Kélibia', gouvernorat: 'Nabeul' },
  { slug: 'korba', label: 'Korba', gouvernorat: 'Nabeul' },
  { slug: 'dar-chaabane', label: 'Dar Chaabane', gouvernorat: 'Nabeul' },
  { slug: 'bizerte', label: 'Bizerte', gouvernorat: 'Bizerte' },
  { slug: 'zaghouan', label: 'Zaghouan', gouvernorat: 'Zaghouan' },
  // Nord-Ouest
  { slug: 'beja', label: 'Béja', gouvernorat: 'Béja' },
  { slug: 'jendouba', label: 'Jendouba', gouvernorat: 'Jendouba' },
  { slug: 'tabarka', label: 'Tabarka', gouvernorat: 'Jendouba' },
  { slug: 'ain-draham', label: 'Aïn Draham', gouvernorat: 'Jendouba' },
  { slug: 'le-kef', label: 'Le Kef', gouvernorat: 'Le Kef' },
  { slug: 'siliana', label: 'Siliana', gouvernorat: 'Siliana' },
  // Centre-Est
  { slug: 'sousse', label: 'Sousse', gouvernorat: 'Sousse' },
  { slug: 'msaken', label: 'Msaken', gouvernorat: 'Sousse' },
  { slug: 'kalaa-kebira', label: 'Kalaa Kebira', gouvernorat: 'Sousse' },
  { slug: 'kalaa-sghira', label: 'Kalaa Sghira', gouvernorat: 'Sousse' },
  { slug: 'monastir', label: 'Monastir', gouvernorat: 'Monastir' },
  { slug: 'moknine', label: 'Moknine', gouvernorat: 'Monastir' },
  { slug: 'jemmal', label: 'Jemmal', gouvernorat: 'Monastir' },
  { slug: 'port-el-kantaoui', label: 'Port El Kantaoui', gouvernorat: 'Sousse' },
  { slug: 'mahdia', label: 'Mahdia', gouvernorat: 'Mahdia' },
  // Centre
  { slug: 'kairouan', label: 'Kairouan', gouvernorat: 'Kairouan' },
  { slug: 'kasserine', label: 'Kasserine', gouvernorat: 'Kasserine' },
  { slug: 'sidi-bouzid', label: 'Sidi Bouzid', gouvernorat: 'Sidi Bouzid' },
  // Sud-Est
  { slug: 'sfax', label: 'Sfax', gouvernorat: 'Sfax' },
  { slug: 'gabes', label: 'Gabès', gouvernorat: 'Gabès' },
  { slug: 'medenine', label: 'Médenine', gouvernorat: 'Médenine' },
  { slug: 'tataouine', label: 'Tataouine', gouvernorat: 'Tataouine' },
  { slug: 'zarzis', label: 'Zarzis', gouvernorat: 'Médenine' },
  { slug: 'djerba', label: 'Djerba', gouvernorat: 'Médenine' },
  { slug: 'houmt-souk', label: 'Houmt Souk', gouvernorat: 'Médenine' },
  { slug: 'midoun', label: 'Midoun', gouvernorat: 'Médenine' },
  // Sud-Ouest
  { slug: 'gafsa', label: 'Gafsa', gouvernorat: 'Gafsa' },
  { slug: 'tozeur', label: 'Tozeur', gouvernorat: 'Tozeur' },
  { slug: 'nefta', label: 'Nefta', gouvernorat: 'Tozeur' },
  { slug: 'kebili', label: 'Kébili', gouvernorat: 'Kébili' },
  { slug: 'douz', label: 'Douz', gouvernorat: 'Kébili' },
];

export const SEO_SOUS_CATEGORIES: Record<string, SousCategorieEntry[]> = {
  avocat: [
    { slug: 'fiscaliste', label: 'fiscaliste' },
    { slug: 'droit-du-travail', label: 'droit du travail' },
    { slug: 'immobilier', label: 'immobilier' },
    { slug: 'droit-des-societes', label: 'droit des sociétés' },
    { slug: 'droit-penal', label: 'droit pénal' },
    { slug: 'droit-familial', label: 'droit familial' },
  ],
  'medecin-specialiste': [
    { slug: 'cardiologue', label: 'cardiologue' },
    { slug: 'dermatologue', label: 'dermatologue' },
    { slug: 'gynecologue', label: 'gynécologue' },
    { slug: 'pediatre', label: 'pédiatre' },
    { slug: 'ophtalmologue', label: 'ophtalmologue' },
    { slug: 'orl', label: 'ORL' },
    { slug: 'rhumatologue', label: 'rhumatologue' },
    { slug: 'neurologue', label: 'neurologue' },
  ],
  coiffeur: [
    { slug: 'homme', label: 'homme' },
    { slug: 'femme', label: 'femme' },
    { slug: 'enfant', label: 'enfant' },
    { slug: 'domicile', label: 'domicile' },
    { slug: 'mariage', label: 'mariage' },
    { slug: 'balayage', label: 'balayage' },
    { slug: 'brushing', label: 'brushing' },
    { slug: 'coloration', label: 'coloration' },
  ],
  plombier: [
    { slug: 'chauffage', label: 'chauffage' },
    { slug: 'depannage', label: 'dépannage' },
    { slug: 'installation', label: 'installation' },
    { slug: 'fuite-eau', label: 'fuite d\'eau' },
    { slug: 'climatisation', label: 'climatisation' },
    { slug: 'sanitaire', label: 'sanitaire' },
  ],
  electricien: [
    { slug: 'installation', label: 'installation' },
    { slug: 'depannage', label: 'dépannage' },
    { slug: 'domotique', label: 'domotique' },
    { slug: 'eclairage', label: 'éclairage' },
    { slug: 'tableau-electrique', label: 'tableau électrique' },
  ],
  dentiste: [
    { slug: 'implantologie', label: 'implantologie' },
    { slug: 'orthodontie', label: 'orthodontie' },
    { slug: 'parodontologie', label: 'parodontologie' },
    { slug: 'esthetique', label: 'esthétique' },
    { slug: 'pedodontie', label: 'pédodontie' },
    { slug: 'endodontie', label: 'endodontie' },
  ],
  'institut-beaute': [
    { slug: 'epilation', label: 'épilation' },
    { slug: 'soins-visage', label: 'soins visage' },
    { slug: 'massage', label: 'massage' },
    { slug: 'onglerie', label: 'onglerie' },
    { slug: 'maquillage', label: 'maquillage' },
    { slug: 'soins-corps', label: 'soins corps' },
  ],
  restaurant: [
    { slug: 'tunisien', label: 'tunisien' },
    { slug: 'italien', label: 'italien' },
    { slug: 'francais', label: 'français' },
    { slug: 'fast-food', label: 'fast-food' },
    { slug: 'pizzeria', label: 'pizzeria' },
    { slug: 'poisson', label: 'poisson' },
    { slug: 'viande', label: 'viande' },
    { slug: 'vegetarien', label: 'végétarien' },
  ],
  'auto-ecole': [
    { slug: 'permis-b', label: 'permis B' },
    { slug: 'permis-a', label: 'permis A' },
    { slug: 'permis-poids-lourd', label: 'poids lourd' },
    { slug: 'permis-moto', label: 'moto' },
    { slug: 'remorquage', label: 'remorquage' },
  ],
  photographe: [
    { slug: 'mariage', label: 'mariage' },
    { slug: 'grossesse', label: 'grossesse' },
    { slug: 'bebe', label: 'bébé' },
    { slug: 'portrait', label: 'portrait' },
    { slug: 'produit', label: 'produit' },
    { slug: 'evenementiel', label: 'événementiel' },
  ],
};

export function findMetierBySlug(slug: string): MetierEntry | undefined {
  return SEO_METIERS.find(m => m.slug === slug);
}

export function findVilleBySlug(slug: string): VilleEntry | undefined {
  return SEO_VILLES.find(v => v.slug === slug);
}

export function findSousCategorieBySlug(metierSlug: string, sousCatSlug: string): SousCategorieEntry | undefined {
  return SEO_SOUS_CATEGORIES[metierSlug]?.find(s => s.slug === sousCatSlug);
}

export function metierVilleSlug(metierSlug: string, villeSlug: string): string {
  return `${metierSlug}-${villeSlug}`;
}

export function metierSousCatVilleSlug(metierSlug: string, sousCatSlug: string, villeSlug: string): string {
  return `${metierSlug}-${sousCatSlug}-${villeSlug}`;
}

export type ParsedSeoSlug =
  | { type: 'metier-souscategorie-ville'; metier: MetierEntry; sousCategorie: SousCategorieEntry; ville: VilleEntry }
  | { type: 'metier-ville'; metier: MetierEntry; ville: VilleEntry };

export function parseSeoSlug(combinedSlug: string): ParsedSeoSlug | null {
  for (const ville of SEO_VILLES) {
    if (!combinedSlug.endsWith(`-${ville.slug}`)) continue;

    const withoutVille = combinedSlug.slice(0, combinedSlug.length - ville.slug.length - 1);

    for (const metier of SEO_METIERS) {
      if (!withoutVille.startsWith(`${metier.slug}-`)) continue;

      const sousCatSlug = withoutVille.slice(metier.slug.length + 1);
      const sousCategorie = findSousCategorieBySlug(metier.slug, sousCatSlug);

      if (sousCategorie) {
        return { type: 'metier-souscategorie-ville', metier, sousCategorie, ville };
      }
    }

    const metierSlug = withoutVille;
    const metier = findMetierBySlug(metierSlug);
    if (metier) return { type: 'metier-ville', metier, ville };
  }

  return null;
}

export function parseMetierVilleSlug(combinedSlug: string): { metier: MetierEntry; ville: VilleEntry } | null {
  const parsed = parseSeoSlug(combinedSlug);
  if (!parsed) return null;
  return { metier: parsed.metier, ville: parsed.ville };
}
