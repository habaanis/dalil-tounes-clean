import fs from 'node:fs';
import path from 'node:path';

const roots = ['src/pages', 'src/components'];
const files = [];
for (const root of roots) {
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx|ts)$/.test(entry.name)) files.push(full);
    }
  };
  walk(root);
}

const publicPageNames = new Set([
  'HomeVitrineFirst.tsx','Subscription.tsx','PaiementConfirmation.tsx','NotFound.tsx','Businesses.tsx','Citizens.tsx','CitizensHealth.tsx','CitizensAdmin.tsx','CitizensLeisure.tsx','CitizensShops.tsx','CitizensServicesLocalized.tsx','CitizensTourism.tsx','CultureEvents.tsx','Jobs.tsx','PartnerSearch.tsx','BusinessEvents.tsx','BusinessNeeds.tsx','TransportInscription.tsx','EducationNew.tsx','EducationEventForm.tsx','LocalMarketplace.tsx','AroundMe.tsx','Auth.tsx','CandidateProfile.tsx','CandidateList.tsx','PublishJob.tsx','BusinessList.tsx','PartnerDirectory.tsx','CandidateJobMatches.tsx','JobCandidateMatches.tsx','BusinessNeedsPublic.tsx','BusinessRegistration.tsx','Concept.tsx','PourquoiDalilTounes.tsx','SuggestBusiness.tsx','CardPreview.tsx'
]);

const frenchHints = /\b(Accueil|Retour|Rechercher|Recherche|Découvrir|Voir|Fermer|Annuler|Envoyer|Inscription|Connexion|Entreprise|Entreprises|Professionnel|Professionnels|Citoyen|Citoyens|Ville|Gouvernorat|Secteur|Métier|Service|Services|Aucun|Aucune|Chargement|Résultat|Résultats|Téléphone|Adresse|Horaires|Réservation|Événement|Événements|Offre|Offres|Emploi|Emplois|Candidat|Candidats|Partenaire|Partenaires|Marché|Autour|Pourquoi|Comment|Votre|Vos|Notre|Nos|Bienvenue|Merci|Erreur|Profil|Publier|Modifier|Supprimer|Suivant|Précédent|Continuer|Choisir|Informations|Description|Message|Envoyé|Gratuit|Payant|Disponible|Indisponible|Aujourd'hui|Trouvez|Trouvez|Essayez|Prêt|Développez)\b/i;
const skipLine = /(console\.|\/\/|\/\*|\*\/|import |from\(|\.from\(|\.eq\(|\.ilike\(|\.or\(|const .*translations|type |interface |debug|admin)/i;

const findings = [];
for (const file of files) {
  const base = path.basename(file);
  const isPublicPage = file.startsWith('src/pages/') && publicPageNames.has(base);
  const isComponent = file.startsWith('src/components/');
  if (!isPublicPage && !isComponent) continue;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, idx) => {
    if (!frenchHints.test(line) || skipLine.test(line)) return;
    const visibleCandidate = />[^<{][^<]*</.test(line) || /\b(alt|title|placeholder|aria-label|message|label)=['\"][^'\"]+['\"]/.test(line) || /:\s*['\"][^'\"]*[A-Za-zÀ-ÿ][^'\"]*['\"]/.test(line);
    if (!visibleCandidate) return;
    findings.push({ file, line: idx + 1, text: line.trim().slice(0, 300) });
  });
}

const grouped = new Map();
for (const f of findings) {
  if (!grouped.has(f.file)) grouped.set(f.file, []);
  grouped.get(f.file).push(f);
}
let out = '# Public i18n scan report\n\n';
out += `Candidates: ${findings.length} across ${grouped.size} files.\n\n`;
for (const [file, items] of [...grouped.entries()].sort()) {
  out += `## ${file}\n`;
  for (const item of items) out += `- L${item.line}: \`${item.text.replace(/`/g, '\\`')}\`\n`;
  out += '\n';
}
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/public-i18n-scan.md', out, 'utf8');
console.log(out);
