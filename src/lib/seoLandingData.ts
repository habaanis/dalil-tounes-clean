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

export const SEO_METIERS: MetierEntry[] = [
  { slug: 'medecin', label: 'Médecin', value: 'Médecin', secteur: 'Santé' },
  { slug: 'dentiste', label: 'Dentiste', value: 'Dentiste', secteur: 'Santé' },
  { slug: 'pharmacie', label: 'Pharmacie', value: 'Pharmacie', secteur: 'Santé' },
  { slug: 'kinesitherapeute', label: 'Kinésithérapeute', value: 'Kinésithérapeute', secteur: 'Santé' },
  { slug: 'infirmier', label: 'Infirmier', value: 'Infirmier', secteur: 'Santé' },
  { slug: 'psychologue', label: 'Psychologue', value: 'Psychologue', secteur: 'Santé' },
  { slug: 'veterinaire', label: 'Vétérinaire', value: 'Vétérinaire', secteur: 'Santé' },
  { slug: 'avocat', label: 'Avocat', value: 'Avocat', secteur: 'Juridique' },
  { slug: 'notaire', label: 'Notaire', value: 'Notaire', secteur: 'Juridique' },
  { slug: 'huissier', label: 'Huissier', value: 'Huissier', secteur: 'Juridique' },
  { slug: 'expert-comptable', label: 'Expert-comptable', value: 'Expert-comptable', secteur: 'Finance' },
  { slug: 'banque', label: 'Banque', value: 'Banque', secteur: 'Finance' },
  { slug: 'assurance', label: 'Assurance', value: 'Assurance', secteur: 'Finance' },
  { slug: 'architecte', label: 'Architecte', value: 'Architecte', secteur: 'Construction' },
  { slug: 'ingenieur', label: 'Ingénieur', value: 'Ingénieur', secteur: 'Construction' },
  { slug: 'macon', label: 'Maçon', value: 'Maçon', secteur: 'Construction' },
  { slug: 'electricien', label: 'Électricien', value: 'Électricien', secteur: 'Construction' },
  { slug: 'plombier', label: 'Plombier', value: 'Plombier', secteur: 'Construction' },
  { slug: 'menuisier', label: 'Menuisier', value: 'Menuisier', secteur: 'Construction' },
  { slug: 'peintre', label: 'Peintre', value: 'Peintre', secteur: 'Construction' },
  { slug: 'restaurant', label: 'Restaurant', value: 'Restaurant', secteur: 'Alimentation' },
  { slug: 'cafe', label: 'Café', value: 'Café', secteur: 'Alimentation' },
  { slug: 'patisserie', label: 'Pâtisserie', value: 'Pâtisserie', secteur: 'Alimentation' },
  { slug: 'boulangerie', label: 'Boulangerie', value: 'Boulangerie', secteur: 'Alimentation' },
  { slug: 'supermarche', label: 'Supermarché', value: 'Supermarché', secteur: 'Commerce' },
  { slug: 'epicerie', label: 'Épicerie', value: 'Épicerie', secteur: 'Commerce' },
  { slug: 'coiffeur', label: 'Coiffeur', value: 'Coiffeur', secteur: 'Beauté' },
  { slug: 'estheticienne', label: 'Esthéticienne', value: 'Esthéticienne', secteur: 'Beauté' },
  { slug: 'salon-de-beaute', label: 'Salon de beauté', value: 'Salon de beauté', secteur: 'Beauté' },
  { slug: 'garage', label: 'Garage', value: 'Garage', secteur: 'Automobile' },
  { slug: 'mecanicien', label: 'Mécanicien', value: 'Mécanicien', secteur: 'Automobile' },
  { slug: 'carrossier', label: 'Carrossier', value: 'Carrossier', secteur: 'Automobile' },
  { slug: 'ecole', label: 'École', value: 'École', secteur: 'Éducation' },
  { slug: 'universite', label: 'Université', value: 'Université', secteur: 'Éducation' },
  { slug: 'centre-de-formation', label: 'Centre de formation', value: 'Centre de formation', secteur: 'Éducation' },
  { slug: 'hotel', label: 'Hôtel', value: 'Hôtel', secteur: 'Tourisme' },
  { slug: 'agence-de-voyage', label: 'Agence de voyage', value: 'Agence de voyage', secteur: 'Tourisme' },
  { slug: 'location-de-voitures', label: 'Location de voitures', value: 'Location de voitures', secteur: 'Tourisme' },
  { slug: 'agence-immobiliere', label: 'Agence immobilière', value: 'Agence immobilière', secteur: 'Immobilier' },
  { slug: 'informatique', label: 'Informatique', value: 'Informatique', secteur: 'Technologie' },
  { slug: 'developpeur-web', label: 'Développeur web', value: 'Développeur web', secteur: 'Technologie' },
  { slug: 'graphiste', label: 'Graphiste', value: 'Graphiste', secteur: 'Communication' },
  { slug: 'photographe', label: 'Photographe', value: 'Photographe', secteur: 'Communication' },
  { slug: 'imprimerie', label: 'Imprimerie', value: 'Imprimerie', secteur: 'Communication' },
  { slug: 'transporteur', label: 'Transporteur', value: 'Transporteur', secteur: 'Transport' },
  { slug: 'taxi', label: 'Taxi', value: 'Taxi', secteur: 'Transport' },
  { slug: 'pressing', label: 'Pressing', value: 'Pressing', secteur: 'Services' },
  { slug: 'blanchisserie', label: 'Blanchisserie', value: 'Blanchisserie', secteur: 'Services' },
  { slug: 'nettoyage', label: 'Nettoyage', value: 'Nettoyage', secteur: 'Services' },
];

export const SEO_VILLES: VilleEntry[] = [
  { slug: 'tunis', label: 'Tunis', gouvernorat: 'Tunis' },
  { slug: 'ariana', label: 'Ariana', gouvernorat: 'Ariana' },
  { slug: 'ben-arous', label: 'Ben Arous', gouvernorat: 'Ben Arous' },
  { slug: 'la-manouba', label: 'La Manouba', gouvernorat: 'La Manouba' },
  { slug: 'nabeul', label: 'Nabeul', gouvernorat: 'Nabeul' },
  { slug: 'hammamet', label: 'Hammamet', gouvernorat: 'Nabeul' },
  { slug: 'zaghouan', label: 'Zaghouan', gouvernorat: 'Zaghouan' },
  { slug: 'bizerte', label: 'Bizerte', gouvernorat: 'Bizerte' },
  { slug: 'beja', label: 'Béja', gouvernorat: 'Béja' },
  { slug: 'jendouba', label: 'Jendouba', gouvernorat: 'Jendouba' },
  { slug: 'le-kef', label: 'Le Kef', gouvernorat: 'Le Kef' },
  { slug: 'siliana', label: 'Siliana', gouvernorat: 'Siliana' },
  { slug: 'sousse', label: 'Sousse', gouvernorat: 'Sousse' },
  { slug: 'monastir', label: 'Monastir', gouvernorat: 'Monastir' },
  { slug: 'mahdia', label: 'Mahdia', gouvernorat: 'Mahdia' },
  { slug: 'sfax', label: 'Sfax', gouvernorat: 'Sfax' },
  { slug: 'kairouan', label: 'Kairouan', gouvernorat: 'Kairouan' },
  { slug: 'kasserine', label: 'Kasserine', gouvernorat: 'Kasserine' },
  { slug: 'sidi-bouzid', label: 'Sidi Bouzid', gouvernorat: 'Sidi Bouzid' },
  { slug: 'gabes', label: 'Gabès', gouvernorat: 'Gabès' },
  { slug: 'medenine', label: 'Médenine', gouvernorat: 'Médenine' },
  { slug: 'tataouine', label: 'Tataouine', gouvernorat: 'Tataouine' },
  { slug: 'gafsa', label: 'Gafsa', gouvernorat: 'Gafsa' },
  { slug: 'tozeur', label: 'Tozeur', gouvernorat: 'Tozeur' },
  { slug: 'kebili', label: 'Kébili', gouvernorat: 'Kébili' },
  { slug: 'la-marsa', label: 'La Marsa', gouvernorat: 'Tunis' },
  { slug: 'carthage', label: 'Carthage', gouvernorat: 'Tunis' },
  { slug: 'ennasr', label: 'Ennasr', gouvernorat: 'Ariana' },
  { slug: 'el-menzah', label: 'El Menzah', gouvernorat: 'Ariana' },
  { slug: 'rades', label: 'Radès', gouvernorat: 'Ben Arous' },
  { slug: 'moknine', label: 'Moknine', gouvernorat: 'Monastir' },
  { slug: 'djerba', label: 'Djerba', gouvernorat: 'Médenine' },
];

export function findMetierBySlug(slug: string): MetierEntry | undefined {
  return SEO_METIERS.find(m => m.slug === slug);
}

export function findVilleBySlug(slug: string): VilleEntry | undefined {
  return SEO_VILLES.find(v => v.slug === slug);
}

export function metierVilleSlug(metierSlug: string, villeSlug: string): string {
  return `${metierSlug}-${villeSlug}`;
}

export function parseMetierVilleSlug(combinedSlug: string): { metier: MetierEntry; ville: VilleEntry } | null {
  for (const ville of SEO_VILLES) {
    if (combinedSlug.endsWith(`-${ville.slug}`)) {
      const metierSlug = combinedSlug.slice(0, combinedSlug.length - ville.slug.length - 1);
      const metier = findMetierBySlug(metierSlug);
      if (metier) return { metier, ville };
    }
  }
  return null;
}
