import fs from 'node:fs';
import path from 'node:path';

const publicPages = new Set([
  'HomeVitrineFirst.tsx','Subscription.tsx','PaiementConfirmation.tsx','NotFound.tsx','Businesses.tsx','Citizens.tsx','CitizensHealth.tsx','CitizensAdmin.tsx','CitizensLeisure.tsx','CitizensShops.tsx','CitizensServicesLocalized.tsx','CitizensTourism.tsx','CultureEvents.tsx','Jobs.tsx','PartnerSearch.tsx','BusinessEvents.tsx','BusinessNeeds.tsx','TransportInscription.tsx','EducationNew.tsx','EducationEventForm.tsx','LocalMarketplace.tsx','AroundMe.tsx','Auth.tsx','CandidateProfile.tsx','CandidateList.tsx','PublishJob.tsx','BusinessList.tsx','PartnerDirectory.tsx','CandidateJobMatches.tsx','JobCandidateMatches.tsx','BusinessNeedsPublic.tsx','BusinessRegistration.tsx','Concept.tsx','PourquoiDalilTounes.tsx','SuggestBusiness.tsx','CardPreview.tsx'
]);

const files = [];
for (const root of ['src/pages','src/components']) {
  const walk = d => {
    for (const e of fs.readdirSync(d,{withFileTypes:true})) {
      const p = path.join(d,e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.tsx$/.test(e.name)) files.push(p);
    }
  };
  walk(root);
}

const fr = /\b(Accueil|Retour|Chargement|Aucun|Aucune|Rechercher|Recherche|Sélectionnez|Ville|Catégorie|Téléphone|Adresse|Fermer|Suivant|Précédent|Envoyer|Annuler|Entreprise|Entreprises|Professionnel|Professionnels|Événement|Événements|Avis|Votre|Vos|Notre|Nous|Informations|Inscription|Connexion|Publier|Message|Résultats|Résultat|Voir|Découvrir|Propulsé|Réalisation|Services|Réserver|Réservation|Gratuit|Gratuite|Erreur)\b/i;
const out = [];
for (const file of files) {
  const base = path.basename(file);
  if (file.startsWith('src/pages/') && !publicPages.has(base)) continue;
  if (file.includes('/debug/') || base === 'DebugSearchPanel.tsx' || base === 'SupabaseStatus.tsx') continue;
  const lines = fs.readFileSync(file,'utf8').split(/\r?\n/);
  let inBlockComment = false;
  lines.forEach((line,i) => {
    let visible = line;
    if (inBlockComment) {
      const end = visible.indexOf('*/');
      if (end === -1) return;
      visible = visible.slice(end + 2);
      inBlockComment = false;
    }
    const start = visible.indexOf('/*');
    if (start !== -1) {
      const end = visible.indexOf('*/', start + 2);
      if (end === -1) {
        visible = visible.slice(0, start);
        inBlockComment = true;
      } else {
        visible = visible.slice(0, start) + visible.slice(end + 2);
      }
    }
    const t = visible.trim();
    if (!t || !fr.test(t)) return;
    if (/^(\/\/|\*|import\b|export type\b|interface\b)/.test(t)) return;
    if (/console\.|\.from\(|\.eq\(|\.ilike\(|secteur:|status:|moderation_status:|visibility:/.test(t)) return;
    const direct = />\s*[^<{][^<]*</.test(t)
      || /\b(?:placeholder|title|aria-label|alt)="[^"]*[A-Za-zÀ-ÿ][^"]*"/.test(t)
      || /(?:textContent|innerText)\s*=\s*['"`]/.test(t)
      || /(?:setError|window\.alert)\(\s*['"`]/.test(t);
    if (direct) out.push(`${file}:${i+1}: ${t.slice(0,260)}`);
  });
}
fs.mkdirSync('reports',{recursive:true});
fs.writeFileSync('reports/final-public-i18n-scan.txt', out.length ? out.join('\n')+'\n' : 'NO_DIRECT_FRENCH_CANDIDATES\n');
console.log(`Candidates: ${out.length}`);
console.log(out.join('\n'));
