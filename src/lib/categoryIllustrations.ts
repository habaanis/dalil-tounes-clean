/**
 * Photographies illustratives pour les cartes sans couverture réelle.
 * Ne jamais enregistrer ces URLs dans image_url : une photo fournie ensuite
 * par l'établissement prend automatiquement la priorité.
 *
 * Les images ci-dessous sont des photographies Wikimedia Commons vérifiées.
 * Le lien source et le crédit restent accessibles depuis la carte.
 */
type Illustration = {
  filename: string;
  author: string;
  licence: string;
  label: string;
};

const LIBRARY: Array<{ match: RegExp; illustration: Illustration }> = [
  { match: /plong[ée]e?|diving|scuba|subaquatique|snorkel|bapt[eê]me de plong[ée]e?/i,
    illustration: { filename: 'Diving underwater photo.jpg', author: 'Drummyfish', licence: 'CC0 1.0', label: 'Plongée sous-marine' } },
  { match: /plombier|plomberie|sanitaire|tuyauterie|installation d.eau/i,
    illustration: { filename: 'Plumber.jpg', author: 'Aubry Arihona', licence: 'CC BY-SA 4.0', label: 'Plomberie' } },
  { match: /[ée]lectricien|[ée]lectricit[ée]|c[aâ]blage [ée]lectrique/i,
    illustration: { filename: 'Electician Working.jpg', author: 'Christabeljenifer22', licence: 'CC BY-SA 4.0', label: 'Électricité' } },
  { match: /menuisier|menuiserie|[ée]b[ée]niste|charpentier|sculpture sur bois|bois d.olivier/i,
    illustration: { filename: "Carpenter's workshop.jpg", author: 'Shixart1985', licence: 'CC BY 2.0', label: 'Travail du bois' } },
  { match: /coiffure|coiffeur|coiffeuse|barbier|hairdress/i,
    illustration: { filename: 'Hairdresser cutting hair.jpg', author: 'Wilfredor', licence: 'CC0 1.0', label: 'Coiffure' } },
  { match: /restaurant|restauration|traiteur|chef|cuisine|gastronomie|p[aâ]tissier/i,
    illustration: { filename: 'Chef cooking.jpg', author: 'Delasoul1', licence: 'CC BY-SA 4.0', label: 'Cuisine et restauration' } },
  { match: /h[ôo]tel|h[ée]bergement|maison d.h[ôo]te|g[îi]te|auberge|r[ée]sidence touristique|chambre d.h[ôo]te/i,
    illustration: { filename: 'Hotel Room (32259665218).jpg', author: 'Open Grid Scheduler / Grid Engine', licence: 'CC0 1.0', label: 'Hébergement' } },
  { match: /[ée]cole|[ée]ducation|formation|cours|acad[ée]mie|language center|centre de langues/i,
    illustration: { filename: 'Classroom 1 TNMOC-CP.jpg', author: 'BadgersCP', licence: 'CC0 1.0', label: 'Éducation et formation' } },
  { match: /garage|m[ée]canicien|m[ée]canique automobile|r[ée]paration auto|automobile|batterie auto/i,
    illustration: { filename: 'Mechanic working on a car battery.jpg', author: 'Wikimedia Commons', licence: 'CC BY 4.0', label: 'Automobile et réparation' } },
  { match: /transport|logistique|camion|livraison|d[ée]m[ée]nagement/i,
    illustration: { filename: 'Truck transport.jpg', author: 'Wikimedia Commons', licence: 'CC BY-SA 4.0', label: 'Transport et logistique' } },
  { match: /poterie|potier|c[ée]ramique|guellala/i,
    illustration: { filename: 'La poterie de guellala.JPG', author: 'Noomen9', licence: 'Voir la fiche Wikimedia', label: 'Poterie traditionnelle' } },
  { match: /tissage|tisserand|tapis|textile artisanal|halfa|vannerie/i,
    illustration: { filename: 'Tissage des Tapis traditionnelles.jpg', author: 'Wikimedia Commons', licence: 'Voir la fiche Wikimedia', label: 'Tissage et artisanat' } },
  { match: /p[eê]cheur|p[eê]che traditionnelle|charfia|kerkennah/i,
    illustration: { filename: 'Plage kraten à kerkennah.jpg', author: 'Wikimedia Commons', licence: 'Voir la fiche Wikimedia', label: 'Littoral de Kerkennah' } },
];

export type CategoryIllustration = { url: string; source: string; author: string; licence: string; label: string };

export function getCategoryIllustration(
  category?: string | string[] | null,
  businessName?: string | null,
): CategoryIllustration | null {
  const categoryText = Array.isArray(category) ? category.join(' ') : category || '';
  const searchText = [businessName || '', categoryText].join(' ');
  const found = LIBRARY.find(entry => entry.match.test(searchText));
  if (!found) return null;
  const { filename, author, licence, label } = found.illustration;
  return {
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(filename) + '?width=900',
    source: 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(filename).replace(/%20/g, '_'),
    author, licence, label,
  };
}

export function isRealBusinessPhoto(value?: string | null): boolean {
  if (!value?.trim()) return false;
  const normalized = value.toLowerCase();
  return !/drapeau-tunisie|images\/placeholder\.|default-business|placeholder\./.test(normalized);
}
