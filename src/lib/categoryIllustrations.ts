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
  { match: /immobilier|agence immobili[eè]re|real estate|propri[ée]t[ée]s immobili[eè]res/i,
    illustration: { filename: 'Living Room Interior Designer - Picker Online.jpg', author: 'Picker Online / Pixabay', licence: 'CC0 1.0', label: 'Logement et immobilier' } },
  { match: /m[eé]dical|m[eé]decin|clinique|cabinet dentaire|dentiste|infirmier|sant[ée]|maison de sant[ée]|pharmacie/i,
    illustration: { filename: 'Doctor office waiting room.jpg', author: 'Kurt Kaiser', licence: 'CC0 1.0', label: 'Soins et santé' } },
  { match: /salle de sport|fitness|musculation|gymnase|club de sport|mode & sport|sport et loisirs/i,
    illustration: { filename: 'Westminster College gym interior face E.jpg', author: 'Ammodramus', licence: 'CC0 1.0', label: 'Sport et activité physique' } },
  { match: /beaut[ée]|esth[ée]tique|spa|bien-[eê]tre|massage|institut de beaut[ée]/i,
    illustration: { filename: 'Beauty salon.jpg', author: 'Mostafa Meraji', licence: 'CC0 1.0', label: 'Beauté et bien-être' } },
  { match: /alimentation|[eé]picerie|fruits et l[ée]gumes|commerce alimentaire|march[ée] alimentaire/i,
    illustration: { filename: 'Fruit section of a grocery store.jpg', author: 'Alabama Extension', licence: 'CC0 1.0', label: 'Commerce alimentaire' } },
  { match: /maison & [eé]quipement|meuble|ameublement|d[ée]coration int[ée]rieure|mobilier/i,
    illustration: { filename: 'Living Room Interior Designer - Picker Online.jpg', author: 'Picker Online / Pixabay', licence: 'CC0 1.0', label: 'Maison et équipement' } },
  { match: /v[eê]tement|pr[eê]t.[aà].porter|boutique mode|habillement|textile de mode/i,
    illustration: { filename: 'Clothing store banner.JPG', author: 'Usien', licence: 'CC0 1.0', label: 'Mode et vêtements' } },
  { match: /photograph|photographe|studio photo|photo professionnelle/i,
    illustration: { filename: 'Photographer-camera.jpg', author: 'CCØ BAY', licence: 'CC0 1.0', label: 'Photographie professionnelle' } },
  { match: /paintball/i,
    illustration: { filename: 'Paintball 2 players.jpg', author: 'Jon Sullivan', licence: 'Domaine public / CC0', label: 'Paintball' } },
  { match: /oliveraie|ol[ée]iculture|huile d.olive|domaine agricole|agricult|palmeraie|oasis|ferme|terroir/i,
    illustration: { filename: 'OliveGroveKritsa.jpg', author: 'ERAGON', licence: 'CC0 1.0', label: 'Agriculture et terroir' } },
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
