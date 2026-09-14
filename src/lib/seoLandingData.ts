import { generateSlug } from './slugify';
import type { Language } from './i18n';

export type LocalizedLabels = {
  fr: string;
  ar: string;
  en: string;
  it: string;
  ru: string;
};

export interface MetierEntry {
  slug: string;
  label: string;
  value: string;
  secteur?: string;
  labels?: LocalizedLabels;
}

export interface VilleEntry {
  slug: string;
  label: string;
  gouvernorat: string;
  labels?: LocalizedLabels;
}

export interface SousCategorieEntry {
  slug: string;
  label: string;
  labels?: LocalizedLabels;
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
  { slug: 'tunis', label: 'Tunis', gouvernorat: 'Tunis', labels: { fr: 'Tunis', ar: 'تونس', en: 'Tunis', it: 'Tunisi', ru: 'Тунис' } },
  { slug: 'la-marsa', label: 'La Marsa', gouvernorat: 'Tunis', labels: { fr: 'La Marsa', ar: 'المرسى', en: 'La Marsa', it: 'La Marsa', ru: 'Ла-Марса' } },
  { slug: 'carthage', label: 'Carthage', gouvernorat: 'Tunis', labels: { fr: 'Carthage', ar: 'قرطاج', en: 'Carthage', it: 'Cartagine', ru: 'Карфаген' } },
  { slug: 'ariana', label: 'Ariana', gouvernorat: 'Ariana', labels: { fr: 'Ariana', ar: 'أريانة', en: 'Ariana', it: 'Ariana', ru: 'Ариана' } },
  { slug: 'ennasr', label: 'Ennasr', gouvernorat: 'Ariana', labels: { fr: 'Ennasr', ar: 'النصر', en: 'Ennasr', it: 'Ennasr', ru: 'Эн-Наср' } },
  { slug: 'el-menzah', label: 'El Menzah', gouvernorat: 'Ariana', labels: { fr: 'El Menzah', ar: 'المنزه', en: 'El Menzah', it: 'El Menzah', ru: 'Эль-Мензах' } },
  { slug: 'ben-arous', label: 'Ben Arous', gouvernorat: 'Ben Arous', labels: { fr: 'Ben Arous', ar: 'بن عروس', en: 'Ben Arous', it: 'Ben Arous', ru: 'Бен-Арусс' } },
  { slug: 'rades', label: 'Radès', gouvernorat: 'Ben Arous', labels: { fr: 'Radès', ar: 'رادس', en: 'Radès', it: 'Radès', ru: 'Радес' } },
  { slug: 'la-manouba', label: 'La Manouba', gouvernorat: 'La Manouba', labels: { fr: 'La Manouba', ar: 'منوبة', en: 'La Manouba', it: 'La Manouba', ru: 'Мануба' } },
  // Nord-Est
  { slug: 'nabeul', label: 'Nabeul', gouvernorat: 'Nabeul', labels: { fr: 'Nabeul', ar: 'نابل', en: 'Nabeul', it: 'Nabeul', ru: 'Набель' } },
  { slug: 'hammamet', label: 'Hammamet', gouvernorat: 'Nabeul', labels: { fr: 'Hammamet', ar: 'حمامات', en: 'Hammamet', it: 'Hammamet', ru: 'Хаммамет' } },
  { slug: 'kelibia', label: 'Kélibia', gouvernorat: 'Nabeul', labels: { fr: 'Kélibia', ar: 'كليبية', en: 'Kélibia', it: 'Kélibia', ru: 'Келибия' } },
  { slug: 'korba', label: 'Korba', gouvernorat: 'Nabeul', labels: { fr: 'Korba', ar: 'قرمبالة', en: 'Korba', it: 'Korba', ru: 'Корба' } },
  { slug: 'dar-chaabane', label: 'Dar Chaabane', gouvernorat: 'Nabeul', labels: { fr: 'Dar Chaabane', ar: 'دار شعبان', en: 'Dar Chaabane', it: 'Dar Chaabane', ru: 'Дар-Шаабан' } },
  { slug: 'bizerte', label: 'Bizerte', gouvernorat: 'Bizerte', labels: { fr: 'Bizerte', ar: 'بنزرت', en: 'Bizerte', it: 'Bizerte', ru: 'Бизерта' } },
  { slug: 'zaghouan', label: 'Zaghouan', gouvernorat: 'Zaghouan', labels: { fr: 'Zaghouan', ar: 'زغوان', en: 'Zaghouan', it: 'Zaghouan', ru: 'Загуан' } },
  // Nord-Ouest
  { slug: 'beja', label: 'Béja', gouvernorat: 'Béja', labels: { fr: 'Béja', ar: 'باجة', en: 'Béja', it: 'Béja', ru: 'Беджа' } },
  { slug: 'jendouba', label: 'Jendouba', gouvernorat: 'Jendouba', labels: { fr: 'Jendouba', ar: 'جندوبة', en: 'Jendouba', it: 'Jendouba', ru: 'Жендуба' } },
  { slug: 'tabarka', label: 'Tabarka', gouvernorat: 'Jendouba', labels: { fr: 'Tabarka', ar: 'طبرقة', en: 'Tabarka', it: 'Tabarka', ru: 'Табарка' } },
  { slug: 'ain-draham', label: 'Aïn Draham', gouvernorat: 'Jendouba', labels: { fr: 'Aïn Draham', ar: 'عين دراهم', en: 'Aïn Draham', it: 'Aïn Draham', ru: 'Эн-Драхам' } },
  { slug: 'le-kef', label: 'Le Kef', gouvernorat: 'Le Kef', labels: { fr: 'Le Kef', ar: 'الكاف', en: 'Le Kef', it: 'Le Kef', ru: 'Эль-Кеф' } },
  { slug: 'siliana', label: 'Siliana', gouvernorat: 'Siliana', labels: { fr: 'Siliana', ar: 'سليانة', en: 'Siliana', it: 'Siliana', ru: 'Силиана' } },
  // Centre-Est
  { slug: 'sousse', label: 'Sousse', gouvernorat: 'Sousse', labels: { fr: 'Sousse', ar: 'سوسة', en: 'Sousse', it: 'Sousse', ru: 'Сус' } },
  { slug: 'msaken', label: 'Msaken', gouvernorat: 'Sousse', labels: { fr: 'Msaken', ar: 'مساكن', en: 'Msaken', it: 'Msaken', ru: 'Мсакен' } },
  { slug: 'kalaa-kebira', label: 'Kalaa Kebira', gouvernorat: 'Sousse', labels: { fr: 'Kalaa Kebira', ar: 'القلعة الكبيرة', en: 'Kalaa Kebira', it: 'Kalaa Kebira', ru: 'Калаа-Кебира' } },
  { slug: 'kalaa-sghira', label: 'Kalaa Sghira', gouvernorat: 'Sousse', labels: { fr: 'Kalaa Sghira', ar: 'القلعة الصغيرة', en: 'Kalaa Sghira', it: 'Kalaa Sghira', ru: 'Калаа-Сгира' } },
  { slug: 'monastir', label: 'Monastir', gouvernorat: 'Monastir', labels: { fr: 'Monastir', ar: 'المنستير', en: 'Monastir', it: 'Monastir', ru: 'Монастир' } },
  { slug: 'moknine', label: 'Moknine', gouvernorat: 'Monastir', labels: { fr: 'Moknine', ar: 'مكنين', en: 'Moknine', it: 'Moknine', ru: 'Мокнин' } },
  { slug: 'jemmal', label: 'Jemmal', gouvernorat: 'Monastir', labels: { fr: 'Jemmal', ar: 'جمّال', en: 'Jemmal', it: 'Jemmal', ru: 'Джеммаль' } },
  { slug: 'port-el-kantaoui', label: 'Port El Kantaoui', gouvernorat: 'Sousse', labels: { fr: 'Port El Kantaoui', ar: 'بور الكنتاوي', en: 'Port El Kantaoui', it: 'Port El Kantaoui', ru: 'Порт-эль-Кантауи' } },
  { slug: 'mahdia', label: 'Mahdia', gouvernorat: 'Mahdia', labels: { fr: 'Mahdia', ar: 'المهدية', en: 'Mahdia', it: 'Mahdia', ru: 'Махдия' } },
  // Centre
  { slug: 'kairouan', label: 'Kairouan', gouvernorat: 'Kairouan', labels: { fr: 'Kairouan', ar: 'القيروان', en: 'Kairouan', it: 'Kairouan', ru: 'Кайруан' } },
  { slug: 'kasserine', label: 'Kasserine', gouvernorat: 'Kasserine', labels: { fr: 'Kasserine', ar: 'القصرين', en: 'Kasserine', it: 'Kasserine', ru: 'Кассерин' } },
  { slug: 'sidi-bouzid', label: 'Sidi Bouzid', gouvernorat: 'Sidi Bouzid', labels: { fr: 'Sidi Bouzid', ar: 'سيدي بوزيد', en: 'Sidi Bouzid', it: 'Sidi Bouzid', ru: 'Сиди-Бузид' } },
  // Sud-Est
  { slug: 'sfax', label: 'Sfax', gouvernorat: 'Sfax', labels: { fr: 'Sfax', ar: 'صفاقس', en: 'Sfax', it: 'Sfax', ru: 'Сфакс' } },
  { slug: 'gabes', label: 'Gabès', gouvernorat: 'Gabès', labels: { fr: 'Gabès', ar: 'قابس', en: 'Gabès', it: 'Gabès', ru: 'Габес' } },
  { slug: 'medenine', label: 'Médenine', gouvernorat: 'Médenine', labels: { fr: 'Médenine', ar: 'مدنين', en: 'Médenine', it: 'Médenine', ru: 'Меденин' } },
  { slug: 'tataouine', label: 'Tataouine', gouvernorat: 'Tataouine', labels: { fr: 'Tataouine', ar: 'تطاوين', en: 'Tataouine', it: 'Tataouine', ru: 'Татауин' } },
  { slug: 'zarzis', label: 'Zarzis', gouvernorat: 'Médenine', labels: { fr: 'Zarzis', ar: 'جرجيس', en: 'Zarzis', it: 'Zarzis', ru: 'Зарзис' } },
  { slug: 'djerba', label: 'Djerba', gouvernorat: 'Médenine', labels: { fr: 'Djerba', ar: 'جربة', en: 'Djerba', it: 'Djerba', ru: 'Джерба' } },
  { slug: 'houmt-souk', label: 'Houmt Souk', gouvernorat: 'Médenine', labels: { fr: 'Houmt Souk', ar: 'حومة السوق', en: 'Houmt Souk', it: 'Houmt Souk', ru: 'Хумт-Сук' } },
  { slug: 'midoun', label: 'Midoun', gouvernorat: 'Médenine', labels: { fr: 'Midoun', ar: 'ميدون', en: 'Midoun', it: 'Midoun', ru: 'Мидун' } },
  // Sud-Ouest
  { slug: 'gafsa', label: 'Gafsa', gouvernorat: 'Gafsa', labels: { fr: 'Gafsa', ar: 'قفصة', en: 'Gafsa', it: 'Gafsa', ru: 'Гафса' } },
  { slug: 'tozeur', label: 'Tozeur', gouvernorat: 'Tozeur', labels: { fr: 'Tozeur', ar: 'توزر', en: 'Tozeur', it: 'Tozeur', ru: 'Тозёр' } },
  { slug: 'nefta', label: 'Nefta', gouvernorat: 'Tozeur', labels: { fr: 'Nefta', ar: 'نفتة', en: 'Nefta', it: 'Nefta', ru: 'Нефта' } },
  { slug: 'kebili', label: 'Kébili', gouvernorat: 'Kébili', labels: { fr: 'Kébili', ar: 'قبلي', en: 'Kébili', it: 'Kébili', ru: 'Кебили' } },
  { slug: 'douz', label: 'Douz', gouvernorat: 'Kébili', labels: { fr: 'Douz', ar: 'دوز', en: 'Douz', it: 'Douz', ru: 'Дуз' } },
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

export interface SecteurEntry {
  slug: string;
  label: string;
  description: string;
  keywords: string[];
  labels?: LocalizedLabels;
}

export const SEO_SECTEURS: SecteurEntry[] = [
  { slug: 'sante', label: 'Santé', description: 'Médecins, cliniques, laboratoires, pharmacies et professionnels de santé en Tunisie.', keywords: ['médecin', 'clinique', 'pharmacie', 'dentiste', 'laboratoire', 'santé tunisie'], labels: { fr: 'Santé', ar: 'الصحة', en: 'Health', it: 'Salute', ru: 'Здравоохранение' } },
  { slug: 'services', label: 'Services', description: 'Plombiers, électriciens, nettoyage, déménagement et services à domicile en Tunisie.', keywords: ['plombier', 'électricien', 'nettoyage', 'services tunisie', 'dépannage'], labels: { fr: 'Services', ar: 'الخدمات', en: 'Services', it: 'Servizi', ru: 'Услуги' } },
  { slug: 'artisanat', label: 'Artisanat', description: 'Menuisiers, peintres, carreleurs, maçons et artisans qualifiés en Tunisie.', keywords: ['menuisier', 'peintre', 'carreleur', 'maçon', 'artisan tunisie'], labels: { fr: 'Artisanat', ar: 'الحرف اليدوية', en: 'Crafts', it: 'Artigianato', ru: 'Ремесло' } },
  { slug: 'juridique', label: 'Juridique', description: 'Avocats, notaires, experts-comptables et conseil juridique en Tunisie.', keywords: ['avocat', 'notaire', 'expert-comptable', 'juridique tunisie', 'conseil'], labels: { fr: 'Juridique', ar: 'القانون', en: 'Legal', it: 'Giuridico', ru: 'Юридические услуги' } },
  { slug: 'beaute', label: 'Beauté', description: 'Coiffeurs, instituts de beauté, spas, hammams et soins esthétiques en Tunisie.', keywords: ['coiffeur', 'institut beauté', 'spa', 'esthéticienne', 'beauté tunisie'], labels: { fr: 'Beauté', ar: 'الجمال', en: 'Beauty', it: 'Bellezza', ru: 'Красота' } },
  { slug: 'restauration', label: 'Restauration', description: 'Restaurants, cafés, fast-food, traiteurs et restauration en Tunisie.', keywords: ['restaurant', 'café', 'fast-food', 'traiteur', 'restauration tunisie'], labels: { fr: 'Restauration', ar: 'المطاعم', en: 'Food & Dining', it: 'Ristorazione', ru: 'Общепит' } },
  { slug: 'alimentation', label: 'Alimentation', description: 'Boulangeries, pâtisseries, boucheries, épiceries et supermarchés en Tunisie.', keywords: ['boulangerie', 'pâtisserie', 'boucherie', 'épicerie', 'alimentation tunisie'], labels: { fr: 'Alimentation', ar: 'الأغذية', en: 'Food & Grocery', it: 'Alimentari', ru: 'Продукты питания' } },
  { slug: 'auto', label: 'Automobile', description: 'Garages, mécaniciens, carrossiers, lavage auto et vente de voitures en Tunisie.', keywords: ['garage', 'mécanicien', 'carrosserie', 'lavage auto', 'automobile tunisie'], labels: { fr: 'Automobile', ar: 'السيارات', en: 'Automotive', it: 'Automotive', ru: 'Автомобили' } },
  { slug: 'transport', label: 'Transport', description: 'Auto-écoles, taxis, location et transport de marchandises en Tunisie.', keywords: ['auto-école', 'taxi', 'location voiture', 'transport tunisie'], labels: { fr: 'Transport', ar: 'النقل', en: 'Transport', it: 'Trasporti', ru: 'Транспорт' } },
  { slug: 'education', label: 'Éducation', description: 'Écoles privées, jardins d\'enfant, centres de formation et cours particuliers en Tunisie.', keywords: ['école privée', 'formation', 'cours particuliers', 'éducation tunisie'], labels: { fr: 'Éducation', ar: 'التعليم', en: 'Education', it: 'Educazione', ru: 'Образование' } },
  { slug: 'immobilier', label: 'Immobilier', description: 'Agences immobilières, promoteurs et syndics en Tunisie.', keywords: ['agence immobilière', 'promoteur', 'immobilier tunisie', 'syndic'], labels: { fr: 'Immobilier', ar: 'العقارات', en: 'Real Estate', it: 'Immobiliare', ru: 'Недвижимость' } },
  { slug: 'tech', label: 'Technologie', description: 'Informatique, réparation, téléphonie, agences web et services numériques en Tunisie.', keywords: ['informatique', 'réparation', 'agence web', 'technologie tunisie'], labels: { fr: 'Technologie', ar: 'التكنولوجيا', en: 'Technology', it: 'Tecnologia', ru: 'Технологии' } },
  { slug: 'sport', label: 'Sport', description: 'Salles de sport, clubs sportifs, piscines et coaching sportif en Tunisie.', keywords: ['salle de sport', 'fitness', 'piscine', 'club sportif', 'sport tunisie'], labels: { fr: 'Sport', ar: 'الرياضة', en: 'Sports', it: 'Sport', ru: 'Спорт' } },
  { slug: 'bien-etre', label: 'Bien-être', description: 'Yoga, méditation, relaxation et bien-être en Tunisie.', keywords: ['yoga', 'bien-être', 'relaxation', 'méditation tunisie'], labels: { fr: 'Bien-être', ar: 'العافية', en: 'Wellness', it: 'Benessere', ru: 'Здоровье' } },
  { slug: 'mode', label: 'Mode', description: 'Boutiques de vêtements, chaussures, bijouteries et parfumeries en Tunisie.', keywords: ['boutique vêtements', 'bijouterie', 'parfumerie', 'mode tunisie'], labels: { fr: 'Mode', ar: 'الموضة', en: 'Fashion', it: 'Moda', ru: 'Мода' } },
  { slug: 'evenementiel', label: 'Événementiel', description: 'Traiteurs mariage, décoration, location de salles et animation en Tunisie.', keywords: ['mariage', 'décoration', 'location salle', 'événementiel tunisie'], labels: { fr: 'Événementiel', ar: 'المناسبات', en: 'Events', it: 'Eventi', ru: 'Мероприятия' } },
  { slug: 'art', label: 'Art', description: 'Photographes, vidéastes et graphistes en Tunisie.', keywords: ['photographe', 'vidéaste', 'graphiste', 'art tunisie'], labels: { fr: 'Art', ar: 'الفن', en: 'Art', it: 'Arte', ru: 'Искусство' } },
  { slug: 'animaux', label: 'Animaux', description: 'Vétérinaires, toiletteurs, animaleries et pensions pour animaux en Tunisie.', keywords: ['vétérinaire', 'toilettage', 'animalerie', 'animaux tunisie'], labels: { fr: 'Animaux', ar: 'الحيوانات', en: 'Pets', it: 'Animali', ru: 'Животные' } },
  { slug: 'profession-liberale', label: 'Profession libérale', description: 'Architectes, ingénieurs, géomètres et professions libérales en Tunisie.', keywords: ['architecte', 'ingénieur', 'géomètre', 'profession libérale tunisie'], labels: { fr: 'Profession libérale', ar: 'المهن الحرة', en: 'Liberal Professions', it: 'Professioni liberali', ru: 'Свободные профессии' } },
  { slug: 'shopping', label: 'Shopping', description: 'Boutiques cadeaux et commerces de détail en Tunisie.', keywords: ['cadeaux', 'shopping', 'commerce tunisie'], labels: { fr: 'Shopping', ar: 'التسوق', en: 'Shopping', it: 'Shopping', ru: 'Шопинг' } },
];

const SECTEUR_LABEL_TO_SLUG: Record<string, string> = {
  'Santé': 'sante',
  'Services': 'services',
  'Artisanat': 'artisanat',
  'Juridique': 'juridique',
  'Beauté': 'beaute',
  'Restauration': 'restauration',
  'Alimentation': 'alimentation',
  'Auto': 'auto',
  'Transport': 'transport',
  'Éducation': 'education',
  'Immobilier': 'immobilier',
  'Tech': 'tech',
  'Sport': 'sport',
  'Bien-être': 'bien-etre',
  'Mode': 'mode',
  'Événementiel': 'evenementiel',
  'Art': 'art',
  'Animaux': 'animaux',
  'Profession libérale': 'profession-liberale',
  'Shopping': 'shopping',
};

export interface GouvernoratEntry {
  slug: string;
  label: string;
  description: string;
  keywords: string[];
  labels?: LocalizedLabels;
}

export const SEO_GOUVERNORATS: GouvernoratEntry[] = [
  { slug: 'tunis', label: 'Tunis', description: 'Entreprises, commerces et professionnels dans le gouvernorat de Tunis, capitale de la Tunisie.', keywords: ['entreprise tunis', 'professionnel tunis', 'commerce tunis', 'services tunis'], labels: { fr: 'Tunis', ar: 'تونس', en: 'Tunis', it: 'Tunisi', ru: 'Тунис' } },
  { slug: 'ariana', label: 'Ariana', description: 'Trouvez des entreprises et services dans le gouvernorat de l\'Ariana, au nord de Tunis.', keywords: ['entreprise ariana', 'services ariana', 'commerce ariana'], labels: { fr: 'Ariana', ar: 'أريانة', en: 'Ariana', it: 'Ariana', ru: 'Ариана' } },
  { slug: 'ben-arous', label: 'Ben Arous', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Ben Arous.', keywords: ['entreprise ben arous', 'services ben arous', 'commerce ben arous'], labels: { fr: 'Ben Arous', ar: 'بن عروس', en: 'Ben Arous', it: 'Ben Arous', ru: 'Бен-Арусс' } },
  { slug: 'la-manouba', label: 'La Manouba', description: 'Entreprises et services dans le gouvernorat de La Manouba.', keywords: ['entreprise manouba', 'services manouba', 'commerce manouba'], labels: { fr: 'La Manouba', ar: 'منوبة', en: 'La Manouba', it: 'La Manouba', ru: 'Мануба' } },
  { slug: 'nabeul', label: 'Nabeul', description: 'Entreprises, artisans et services dans le gouvernorat de Nabeul et le Cap Bon.', keywords: ['entreprise nabeul', 'artisan nabeul', 'cap bon', 'hammamet'], labels: { fr: 'Nabeul', ar: 'نابل', en: 'Nabeul', it: 'Nabeul', ru: 'Набель' } },
  { slug: 'zaghouan', label: 'Zaghouan', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Zaghouan.', keywords: ['entreprise zaghouan', 'services zaghouan'], labels: { fr: 'Zaghouan', ar: 'زغوان', en: 'Zaghouan', it: 'Zaghouan', ru: 'Загуан' } },
  { slug: 'bizerte', label: 'Bizerte', description: 'Entreprises et services dans le gouvernorat de Bizerte, au nord de la Tunisie.', keywords: ['entreprise bizerte', 'services bizerte', 'commerce bizerte'], labels: { fr: 'Bizerte', ar: 'بنزرت', en: 'Bizerte', it: 'Bizerte', ru: 'Бизерта' } },
  { slug: 'beja', label: 'Béja', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Béja.', keywords: ['entreprise béja', 'services béja'], labels: { fr: 'Béja', ar: 'باجة', en: 'Béja', it: 'Béja', ru: 'Беджа' } },
  { slug: 'jendouba', label: 'Jendouba', description: 'Entreprises et services dans le gouvernorat de Jendouba, dont Tabarka et Aïn Draham.', keywords: ['entreprise jendouba', 'tabarka', 'ain draham'], labels: { fr: 'Jendouba', ar: 'جندوبة', en: 'Jendouba', it: 'Jendouba', ru: 'Жендуба' } },
  { slug: 'le-kef', label: 'Le Kef', description: 'Annuaire des entreprises et professionnels dans le gouvernorat du Kef.', keywords: ['entreprise kef', 'services kef'], labels: { fr: 'Le Kef', ar: 'الكاف', en: 'Le Kef', it: 'Le Kef', ru: 'Эль-Кеф' } },
  { slug: 'siliana', label: 'Siliana', description: 'Entreprises et services dans le gouvernorat de Siliana.', keywords: ['entreprise siliana', 'services siliana'], labels: { fr: 'Siliana', ar: 'سليانة', en: 'Siliana', it: 'Siliana', ru: 'Силиана' } },
  { slug: 'sousse', label: 'Sousse', description: 'Entreprises, commerces et professionnels dans le gouvernorat de Sousse, troisième ville de Tunisie.', keywords: ['entreprise sousse', 'commerce sousse', 'services sousse', 'port el kantaoui'], labels: { fr: 'Sousse', ar: 'سوسة', en: 'Sousse', it: 'Sousse', ru: 'Сус' } },
  { slug: 'monastir', label: 'Monastir', description: 'Annuaire des entreprises et services dans le gouvernorat de Monastir.', keywords: ['entreprise monastir', 'services monastir', 'moknine'], labels: { fr: 'Monastir', ar: 'المنستير', en: 'Monastir', it: 'Monastir', ru: 'Монастир' } },
  { slug: 'mahdia', label: 'Mahdia', description: 'Entreprises et professionnels dans le gouvernorat de Mahdia.', keywords: ['entreprise mahdia', 'services mahdia'], labels: { fr: 'Mahdia', ar: 'المهدية', en: 'Mahdia', it: 'Mahdia', ru: 'Махдия' } },
  { slug: 'sfax', label: 'Sfax', description: 'Entreprises, industries et services dans le gouvernorat de Sfax, deuxième ville de Tunisie.', keywords: ['entreprise sfax', 'industrie sfax', 'commerce sfax', 'services sfax'], labels: { fr: 'Sfax', ar: 'صفاقس', en: 'Sfax', it: 'Sfax', ru: 'Сфакс' } },
  { slug: 'kairouan', label: 'Kairouan', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Kairouan.', keywords: ['entreprise kairouan', 'services kairouan', 'artisan kairouan'], labels: { fr: 'Kairouan', ar: 'القيروان', en: 'Kairouan', it: 'Kairouan', ru: 'Кайруан' } },
  { slug: 'kasserine', label: 'Kasserine', description: 'Entreprises et services dans le gouvernorat de Kasserine.', keywords: ['entreprise kasserine', 'services kasserine'], labels: { fr: 'Kasserine', ar: 'القصرين', en: 'Kasserine', it: 'Kasserine', ru: 'Кассерин' } },
  { slug: 'sidi-bouzid', label: 'Sidi Bouzid', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Sidi Bouzid.', keywords: ['entreprise sidi bouzid', 'services sidi bouzid'], labels: { fr: 'Sidi Bouzid', ar: 'سيدي بوزيد', en: 'Sidi Bouzid', it: 'Sidi Bouzid', ru: 'Сиди-Бузид' } },
  { slug: 'gabes', label: 'Gabès', description: 'Entreprises et services dans le gouvernorat de Gabès.', keywords: ['entreprise gabès', 'services gabès', 'industrie gabès'], labels: { fr: 'Gabès', ar: 'قابس', en: 'Gabès', it: 'Gabès', ru: 'Габес' } },
  { slug: 'medenine', label: 'Médenine', description: 'Entreprises et services dans le gouvernorat de Médenine, dont Djerba et Zarzis.', keywords: ['entreprise médenine', 'djerba', 'zarzis', 'services médenine'], labels: { fr: 'Médenine', ar: 'مدنين', en: 'Médenine', it: 'Médenine', ru: 'Меденин' } },
  { slug: 'tataouine', label: 'Tataouine', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Tataouine.', keywords: ['entreprise tataouine', 'services tataouine'], labels: { fr: 'Tataouine', ar: 'تطاوين', en: 'Tataouine', it: 'Tataouine', ru: 'Татауин' } },
  { slug: 'gafsa', label: 'Gafsa', description: 'Entreprises et services dans le gouvernorat de Gafsa.', keywords: ['entreprise gafsa', 'services gafsa'], labels: { fr: 'Gafsa', ar: 'قفصة', en: 'Gafsa', it: 'Gafsa', ru: 'Гафса' } },
  { slug: 'tozeur', label: 'Tozeur', description: 'Entreprises et services dans le gouvernorat de Tozeur, porte du Sahara tunisien.', keywords: ['entreprise tozeur', 'services tozeur', 'nefta', 'tourisme tozeur'], labels: { fr: 'Tozeur', ar: 'توزر', en: 'Tozeur', it: 'Tozeur', ru: 'Тозёр' } },
  { slug: 'kebili', label: 'Kébili', description: 'Annuaire des entreprises et professionnels dans le gouvernorat de Kébili et Douz.', keywords: ['entreprise kébili', 'douz', 'services kébili'], labels: { fr: 'Kébili', ar: 'قبلي', en: 'Kébili', it: 'Kébili', ru: 'Кебили' } },
];

const GOUVERNORAT_LABEL_TO_SLUG: Record<string, string> = {
  'Tunis': 'tunis',
  'Ariana': 'ariana',
  'Ben Arous': 'ben-arous',
  'La Manouba': 'la-manouba',
  'Nabeul': 'nabeul',
  'Zaghouan': 'zaghouan',
  'Bizerte': 'bizerte',
  'Béja': 'beja',
  'Jendouba': 'jendouba',
  'Le Kef': 'le-kef',
  'Siliana': 'siliana',
  'Sousse': 'sousse',
  'Monastir': 'monastir',
  'Mahdia': 'mahdia',
  'Sfax': 'sfax',
  'Kairouan': 'kairouan',
  'Kasserine': 'kasserine',
  'Sidi Bouzid': 'sidi-bouzid',
  'Gabès': 'gabes',
  'Médenine': 'medenine',
  'Tataouine': 'tataouine',
  'Gafsa': 'gafsa',
  'Tozeur': 'tozeur',
  'Kébili': 'kebili',
};

export function findGouvernoratBySlug(slug: string): GouvernoratEntry | undefined {
  return SEO_GOUVERNORATS.find(g => g.slug === slug);
}

export function getVillesByGouvernorat(gouvernoratSlug: string): VilleEntry[] {
  const gouv = SEO_GOUVERNORATS.find(g => g.slug === gouvernoratSlug);
  if (!gouv) return [];
  return SEO_VILLES.filter(v => v.gouvernorat === gouv.label);
}

export function getGouvernoratSlugFromLabel(label: string): string | undefined {
  return GOUVERNORAT_LABEL_TO_SLUG[label];
}

export function findSecteurBySlug(slug: string): SecteurEntry | undefined {
  return SEO_SECTEURS.find(s => s.slug === slug);
}

export function getMetiersBySecteur(secteurSlug: string): MetierEntry[] {
  const secteur = SEO_SECTEURS.find(s => s.slug === secteurSlug);
  if (!secteur) return [];
  return SEO_METIERS.filter(m => {
    if (!m.secteur) return false;
    return SECTEUR_LABEL_TO_SLUG[m.secteur] === secteurSlug;
  });
}

export function getSecteurSlugFromLabel(label: string): string | undefined {
  return SECTEUR_LABEL_TO_SLUG[label];
}

export function findMetierBySlug(slug: string): MetierEntry | undefined {
  return SEO_METIERS.find(m => m.slug === slug);
}

export function getMetierLabel(metier: MetierEntry, lang: Language): string {
  if (metier.labels && lang in metier.labels) return metier.labels[lang];
  return metier.label;
}

export function getVilleLabel(ville: VilleEntry, lang: Language): string {
  if (ville.labels && lang in ville.labels) return ville.labels[lang];
  return ville.label;
}

export function getSecteurLabel(secteur: SecteurEntry, lang: Language): string {
  if (secteur.labels && lang in secteur.labels) return secteur.labels[lang];
  return secteur.label;
}

export function getGouvernoratLabel(gouvernorat: GouvernoratEntry, lang: Language): string {
  if (gouvernorat.labels && lang in gouvernorat.labels) return gouvernorat.labels[lang];
  return gouvernorat.label;
}

export function getSousCategorieLabel(sousCat: SousCategorieEntry, lang: Language): string {
  if (sousCat.labels && lang in sousCat.labels) return sousCat.labels[lang];
  return sousCat.label;
}

export function findMetierByValue(value: string): MetierEntry | undefined {
  const lower = value.toLowerCase();
  return SEO_METIERS.find(m => m.value.toLowerCase() === lower || m.label.toLowerCase() === lower);
}

export function findVilleBySlug(slug: string): VilleEntry | undefined {
  return SEO_VILLES.find(v => v.slug === slug);
}

export function findVilleByLabel(label: string): VilleEntry | undefined {
  const lower = label.toLowerCase();
  return SEO_VILLES.find(v => v.label.toLowerCase() === lower);
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
