type SectorHashtags = Record<string, string[]>;

const SECTOR_HASHTAGS: SectorHashtags = {
  'Santé': ['#SanteTunisie', '#BienEtre'],
  'Beauté': ['#BeauteTunisie', '#BienEtre', '#SoinsTunisie'],
  'Alimentation': ['#FoodTunisie', '#BonnesAdresses', '#GastronomeTunisie'],
  'Commerce': ['#ShoppingTunisie', '#BonnesAdresses'],
  'Juridique': ['#DroitTunisie', '#ConseilJuridique'],
  'Finance': ['#FinanceTunisie', '#ConseilFinancier'],
  'Construction': ['#BatimentTunisie', '#TravauxTunisie'],
  'Automobile': ['#AutoTunisie', '#GarageTunisie'],
  'Éducation': ['#EducationTunisie', '#FormationTunisie'],
  'Tourisme': ['#TourismeTunisie', '#VacancesTunisie', '#VisitTunisia'],
  'Immobilier': ['#ImmobilierTunisie', '#RealEstateTunisia'],
  'Technologie': ['#TechTunisie', '#DigitalTunisie'],
  'Communication': ['#CommunicationTunisie', '#MarketingTunisie'],
  'Transport': ['#TransportTunisie'],
  'Services': ['#ServicesTunisie'],
};

const CATEGORY_TO_SECTOR: Record<string, string> = {
  'Médecin': 'Santé', 'Dentiste': 'Santé', 'Pharmacie': 'Santé',
  'Kinésithérapeute': 'Santé', 'Infirmier': 'Santé', 'Psychologue': 'Santé',
  'Vétérinaire': 'Santé',
  'Coiffeur': 'Beauté', 'Esthéticienne': 'Beauté', 'Salon de beauté': 'Beauté',
  'Institut de beauté': 'Beauté',
  'Restaurant': 'Alimentation', 'Café': 'Alimentation', 'Pâtisserie': 'Alimentation',
  'Boulangerie': 'Alimentation',
  'Supermarché': 'Commerce', 'Épicerie': 'Commerce',
  'Avocat': 'Juridique', 'Notaire': 'Juridique', 'Huissier': 'Juridique',
  'Expert-comptable': 'Finance', 'Banque': 'Finance', 'Assurance': 'Finance',
  'Architecte': 'Construction', 'Ingénieur': 'Construction', 'Maçon': 'Construction',
  'Électricien': 'Construction', 'Plombier': 'Construction', 'Menuisier': 'Construction',
  'Peintre': 'Construction',
  'Garage': 'Automobile', 'Mécanicien': 'Automobile', 'Carrossier': 'Automobile',
  'École': 'Éducation', 'Université': 'Éducation', 'Centre de formation': 'Éducation',
  'Hôtel': 'Tourisme', 'Agence de voyage': 'Tourisme', 'Location de voitures': 'Tourisme',
  'Agence immobilière': 'Immobilier',
  'Informatique': 'Technologie', 'Développeur web': 'Technologie',
  'Graphiste': 'Communication', 'Photographe': 'Communication', 'Imprimerie': 'Communication',
  'Transporteur': 'Transport', 'Taxi': 'Transport',
  'Pressing': 'Services', 'Blanchisserie': 'Services', 'Nettoyage': 'Services',
};

function removeAccents(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function sanitizeHashtag(text: string): string {
  return removeAccents(text)
    .replace(/[\s\-''/().,;:!?]+/g, '')
    .replace(/[^\p{L}\p{N}_]/gu, '');
}

function buildCategoryHashtag(category: string): string | null {
  const clean = sanitizeHashtag(category);
  return clean.length >= 3 ? `#${clean}` : null;
}

function buildCityHashtag(ville: string): string | null {
  const clean = sanitizeHashtag(ville);
  return clean.length >= 2 ? `#${clean}` : null;
}

function buildCityCategoryHashtag(category: string, ville: string): string | null {
  const catClean = sanitizeHashtag(category);
  const villeClean = sanitizeHashtag(ville);
  if (catClean.length < 3 || villeClean.length < 2) return null;
  return `#${catClean}${villeClean}`;
}

function detectSector(category: string): string | null {
  if (!category) return null;
  const direct = CATEGORY_TO_SECTOR[category];
  if (direct) return direct;
  const lower = category.toLowerCase();
  for (const [key, sector] of Object.entries(CATEGORY_TO_SECTOR)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return sector;
    }
  }
  const labelMatch = category.match(/\/\s*(.+)$/);
  if (labelMatch) {
    const sectorName = labelMatch[1].trim();
    if (SECTOR_HASHTAGS[sectorName]) return sectorName;
  }
  return null;
}

export interface HashtagInput {
  category?: string | null;
  ville?: string | null;
  gouvernorat?: string | null;
  isPremium?: boolean;
}

export function generateHashtags(input: HashtagInput): string[] {
  const tags = new Set<string>();
  const { category, ville, gouvernorat, isPremium } = input;

  tags.add('#DalilTounes');

  if (category) {
    const catTag = buildCategoryHashtag(category);
    if (catTag) tags.add(catTag);

    if (ville) {
      const combo = buildCityCategoryHashtag(category, ville);
      if (combo) tags.add(combo);
    }
  }

  if (ville) {
    const villeTag = buildCityHashtag(ville);
    if (villeTag) tags.add(villeTag);
  }

  if (gouvernorat && gouvernorat !== ville) {
    const govTag = buildCityHashtag(gouvernorat);
    if (govTag) tags.add(govTag);
  }

  if (category) {
    const sector = detectSector(category);
    if (sector && SECTOR_HASHTAGS[sector]) {
      for (const sectorTag of SECTOR_HASHTAGS[sector]) {
        if (tags.size >= 9) break;
        tags.add(sectorTag);
      }
    }
  }

  if (isPremium && tags.size < 10) {
    tags.add('#PremiumTunisie');
  }

  tags.add('#BusinessTunisie');
  if (tags.size < 7) {
    tags.add('#GuideTunisie');
  }

  const result = Array.from(tags);
  return result.slice(0, 10);
}

export function formatHashtagsForShare(hashtags: string[]): string {
  return '\n\n' + hashtags.join(' ');
}

export function generateBlogHashtags(articleCategory?: string): string[] {
  const tags = new Set<string>();

  tags.add('#DalilTounes');
  tags.add('#BlogTunisie');

  if (articleCategory) {
    const catTag = buildCategoryHashtag(articleCategory);
    if (catTag) tags.add(catTag);
  }

  tags.add('#GuideTunisie');
  tags.add('#ConseilsPro');
  tags.add('#BusinessTunisie');

  return Array.from(tags).slice(0, 8);
}

export function generateMarketplaceHashtags(category?: string, ville?: string): string[] {
  const tags = new Set<string>();

  tags.add('#DalilTounes');
  tags.add('#BonnesAffairesTunisie');

  if (category) {
    const catTag = buildCategoryHashtag(category);
    if (catTag) tags.add(catTag);
  }

  if (ville) {
    const villeTag = buildCityHashtag(ville);
    if (villeTag) tags.add(villeTag);
  }

  tags.add('#VenteTunisie');
  tags.add('#Marketplace');

  return Array.from(tags).slice(0, 8);
}


export { generateMarketplaceHashtags, formatHashtagsForShare }