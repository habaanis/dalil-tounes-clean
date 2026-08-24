import fs from 'node:fs';
const p = 'src/pages/BusinessEvents.tsx';
let s = fs.readFileSync(p, 'utf8');
const replacements = [
  ["import { useTranslation } from '../lib/i18n';", "import { useTranslation } from '../lib/i18n';\nimport { getBusinessEventsPageTranslations } from '../lib/businessEventsPageTranslations';"],
  ["  const t = useTranslation(language);", "  const t = useTranslation(language);\n  const pageT = getBusinessEventsPageTranslations(language);"],
  ["setError('Impossible de charger les événements pour le moment.');", "setError(pageT.loadError);"],
  ["setError('Une erreur est survenue lors du chargement des événements.');", "setError(pageT.loadErrorGeneric);"],
  ['Rechercher un événement', '{pageT.searchLabel}'],
  ['placeholder="Rechercher un événement, une ville, une entreprise..."', 'placeholder={pageT.searchPlaceholder}'],
  ['>\n                  Ville\n                </label>', '>\n                  {pageT.city}\n                </label>'],
  ['<option value="">Toutes les villes</option>', '<option value="">{pageT.allCities}</option>'],
  ['>\n                  Catégorie\n                </label>', '>\n                  {pageT.category}\n                </label>'],
  ['<option value="">Toutes les catégories</option>', '<option value="">{pageT.allCategories}</option>'],
  ['Afficher uniquement les événements à venir', '{pageT.upcomingOnly}'],
  ['<p className="mt-4 text-sm text-gray-600">Chargement des événements...</p>', '<p className="mt-4 text-sm text-gray-600">{pageT.loading}</p>'],
  ['Aucun événement trouvé pour ces critères.', '{pageT.empty}'],
  ['<strong>Date:</strong>', '<strong>{pageT.date}:</strong>'],
  ['return `Du ${startLabel} au ${endLabel}`;', 'return `${pageT.from} ${startLabel} ${pageT.to} ${endLabel}`;'],
  ['<strong>Lieu:</strong>', '<strong>{pageT.location}:</strong>'],
  ['<strong>Org:</strong>', '<strong>{pageT.organizer}:</strong>'],
  ["Demande d'information / inscription", '{pageT.formTitle}'],
  ["Pour toute demande d'information ou d'inscription, remplissez le formulaire ci-dessous.", '{pageT.formIntro}'],
  ["Pour toute demande d'information ou d'inscription, envoyez-nous votre message. Notre équipe vous contactera directement.", '{pageT.formHelp}'],
  ['Titre *', '{pageT.titleLabel}'],
  ['placeholder="Ex : Inscription événement, demande d\'information, partenariat..."', 'placeholder={pageT.titlePlaceholder}'],
  ['Téléphone *', '{pageT.phone}'],
  ['Email *', '{pageT.email}'],
  ['Message *', '{pageT.message}'],
  ['placeholder="Expliquez votre demande..."', 'placeholder={pageT.messagePlaceholder}'],
  ['Envoyer la demande', '{t.businessEvents.submitForm.submit}'],
];
for (const [from, to] of replacements) {
  if (!s.includes(from)) console.warn('Missing:', from);
  s = s.split(from).join(to);
}
fs.writeFileSync(p, s);
