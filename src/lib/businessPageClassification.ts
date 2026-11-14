/**
 * Suggestions de pages pour la revue Airtable / Supabase.
 *
 * Ce module ne publie rien et ne modifie jamais liste_pages : une affectation
 * n'est pas une autorisation de publication. Il garde les libellés stockés dans
 * Airtable comme source de vérité et propose des pages à vérifier.
 */
export const BUSINESS_PAGE_IDS = [
  'accueil',
  'entreprises',
  'tourisme local & expatriation',
  'commerces & magasins',
  'santé',
  'loisirs & évènements',
  'services citoyens',
  'éducation',
] as const;

export type BusinessPageId = typeof BUSINESS_PAGE_IDS[number];

export interface ClassifiedBusiness {
  categorie?: unknown;
  sous_categories_texte?: unknown;
  sous_categories_clean?: unknown;
  liste_pages?: unknown;
}

export function normalizeTaxonomyText(value: string): string {
  return value.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s*&\s*/g, ' & ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function taxonomyValues(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
      .map(item => item.trim())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [];
}

const PAGE_ALIASES: Readonly<Record<BusinessPageId, readonly string[]>> = {
  accueil: ['accueil'],
  entreprises: ['entreprises'],
  'tourisme local & expatriation': ['tourisme local & expatriation', 'tourisme & expatriation'],
  'commerces & magasins': ['commerces & magasins', 'commerce local'],
  'santé': ['santé', 'sante'],
  'loisirs & évènements': ['loisirs & évènements', 'loisirs & événements'],
  'services citoyens': ['services citoyens'],
  'éducation': ['éducation', 'education'],
};

export function canonicalPageId(value: string): BusinessPageId | null {
  const needle = normalizeTaxonomyText(value);
  for (const page of BUSINESS_PAGE_IDS) {
    if (PAGE_ALIASES[page].some(alias => normalizeTaxonomyText(alias) === needle)) return page;
  }
  return null;
}

export function assignedBusinessPages(row: ClassifiedBusiness): BusinessPageId[] {
  const pages = taxonomyValues(row.liste_pages)
    .map(canonicalPageId)
    .filter((page): page is BusinessPageId => page !== null);
  return [...new Set(pages)];
}

export interface BusinessPageSuggestion {
  page: BusinessPageId;
  reason: string;
}

/**
 * Suggestions à forte confiance uniquement : aucune inscription sur l'accueil.
 * Une rubrique encore absente du routeur devra être validée avant l'application.
 */
export function suggestBusinessPages(row: ClassifiedBusiness): BusinessPageSuggestion[] {
  const categories = taxonomyValues(row.categorie).map(normalizeTaxonomyText);
  const subcategories = [
    ...taxonomyValues(row.sous_categories_texte),
    ...taxonomyValues(row.sous_categories_clean),
  ].map(normalizeTaxonomyText);
  const hasCategory = (...terms: string[]) =>
    terms.some(term => categories.includes(normalizeTaxonomyText(term)));
  const hasSubcategory = (...terms: string[]) =>
    terms.some(term => subcategories.some(sub => sub.includes(normalizeTaxonomyText(term))));

  if ((hasCategory('Immobilier', 'Agence immobilière', 'وكالة عقارات') &&
       hasSubcategory('Agence immobilière', 'Promoteur immobilier')) ||
      (hasCategory('Immobilier') && hasSubcategory('promotion immobilière'))) {
    return [
      { page: 'entreprises', reason: 'Métier immobilier confirmé' },
      { page: 'tourisme local & expatriation', reason: 'Recherche de logement pour expatriation' },
      { page: 'services citoyens', reason: 'Services liés au logement' },
    ];
  }

  if (hasCategory('Maison de retraite', 'Retirement home', 'Casa di riposo') &&
      hasSubcategory('Retirement home', 'Assisted living facility', 'Maison de retraite')) {
    return [
      { page: 'santé', reason: 'Établissement pour personnes âgées confirmé' },
      { page: 'services citoyens', reason: 'Service aux familles et aux personnes âgées' },
    ];
  }

  if (hasCategory('Automobile')) {
    const repairs = hasSubcategory(
      'Garage Mécanique', 'Entretien & Réparation', 'mecanicien',
      'Lavage Auto', 'Électricité Auto', 'Tôlerie & Peinture',
    );
    const sales = hasSubcategory(
      'Vente de Pièces', 'Pièces de rechange', 'Magasin de pièces',
      'Vente de Voitures',
    );
    const rental = hasSubcategory('Location de Voitures');
    if (repairs || sales || rental) {
      const suggestions: BusinessPageSuggestion[] = [
        { page: 'entreprises', reason: 'Activité automobile identifiée' },
      ];
      if (repairs || rental) {
        suggestions.push({ page: 'services citoyens', reason: 'Service automobile aux particuliers' });
      }
      if (rental) {
        suggestions.push({ page: 'tourisme local & expatriation', reason: 'Location de véhicule pour les visiteurs' });
      }
      if (sales) {
        suggestions.push({ page: 'commerces & magasins', reason: 'Vente automobile ou de pièces et accessoires' });
      }
      return suggestions;
    }
  }

  if (hasCategory('Mode & Sport') && hasSubcategory('Nutrition sportive & compléments')) {
    return [{ page: 'commerces & magasins', reason: 'Boutique de nutrition sportive' }];
  }

  if (hasCategory('Medical', 'Santé / Pharmacie') &&
      hasSubcategory('Pharmacie', 'Pharmacie de nuit')) {
    return [{ page: 'santé', reason: 'Pharmacie clairement identifiée' }];
  }

  return [];
}

export function missingSuggestedPages(row: ClassifiedBusiness): BusinessPageSuggestion[] {
  const assigned = new Set(assignedBusinessPages(row));
  return suggestBusinessPages(row).filter(suggestion => !assigned.has(suggestion.page));
}
