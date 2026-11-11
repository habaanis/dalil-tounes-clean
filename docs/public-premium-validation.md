# Harmonisation publique premium — complément #199 dépendant de #198

Date : 10 novembre 2026. Base validée : `3b6e3d6a9ce43abbd3e7b5a88fd68bcd56d67999`.
Code vérifié : `9a3a310764905ab1353a037677de37e39b4bd71d`.
Prévisualisation : https://dalil-tounes-clean-c31p81kqa-haba-anis-projects.vercel.app/
PR : https://github.com/habaanis/dalil-tounes-clean/pull/199
Base de PR : `fix/post197-ivoire-accueil-ouverture` (#198), pas main.

## Réalisation

43 implémentations de pages couvertes : 41 fichiers de pages modifiés directement, 2 annuaires via BusinessDirectory. 10 composants partagés modifiés, une politique explicite de périmètre et la feuille premium commune étendue. L’inventaire recense 105 motifs de routes, dont 63 publics (les alias représentent parfois la même page).

Familles traitées : santé, commerces, services citoyens, éducation, loisirs/culture, thermalisme, guides touristiques ; recherche et résultats ; métiers/spécialités/villes/secteurs/gouvernorats ; entreprises certifiées ; emploi et formulaires ; partenaires/besoins professionnels ; blog/pages légales ; présentation commerciale CV et titres de confirmation. Accueil, Citoyens, Tourisme, Abonnement restent basés sur la direction validée dans #198.

Présentation : surfaces ivoire, titres plus fins, cartes moins arrondies et ombres réduites, chrome commun prune/or. Les anciennes pages SEO noires passent à l’ivoire. Les bandeaux Santé, Services et Commerces s’adaptent au texte pour éviter le rognage mobile. Les accordéons existants sont conservés ; aucune suppression de texte.

Les classes public-title/public-heading sont opt-in : elles ne ciblent pas les titres des modèles CV embarqués. Layout exclut CV, QR, alias clients, hôtes dédiés, administration et démonstrations. Les composants SEO ne changent que de présentation : métadonnées et JSON-LD inchangés.

## Contrôles automatisés

- Build complet réussi : compilation Vite, 9148 routes SEO, génération des fiches HTML et sitemap. Le dernier build a lu 401 fiches éligibles ; ce chiffre dépend des données en cours, aucune donnée n’a été écrite.
- 7/7 tests : 4 régressions PR197, 2 tests de frontières des styles, 1 comparaison AST des 41 pages garantissant que contenus, liens, requêtes et gestionnaires restent identiques hors classes/styles.
- TypeScript : 202 diagnostics identiques, sortie avant/après identique à #198.
- ESLint `src` : 361 erreurs / 44 avertissements avant et après ; comparaison par fichier/règle/message/sévérité, aucun diagnostic ajouté. Ce périmètre n’est pas le lint global du dépôt.
- Dernière prévisualisation : 60/60 contrôles HTTP de familles réussis ; 10/10 contrôles SEO/redirections/assets réussis.
- Un ancien passage du smoke de 16 routes a dépassé son délai de 12 s sur /entreprises (deux essais), alors que cette route répond dans le contrôle étendu à 15 s et dans les navigateurs. Ne pas présenter ce passage comme réussi.
- Aucun changement de dépendance, requête, classement, tarif, traduction ou gestionnaire d’envoi. Aucun fichier de CV client, palette ou mini-app modifié. `git diff --check` réussi.

## Recette navigateur effectivement réalisée

- 32 captures avant/après : huit familles × ordinateur/mobile × avant/après. Familles : Santé, recherche, SEO métier, guide touristique, emploi, contact, blog, partenaires. Les captures après sont issues de 004d1f4 puis 9a3a31 pour la dernière correction d’alignement SEO ; les autres vues n’ont pas changé entre ces commits.
- FR : huit familles inspectées visuellement en 1440×1000 et 390×844. Contrôles complémentaires de rendu : commerces, éducation, loisirs, thermalisme, certifiés, villes, secteurs, gouvernorats, métier-ville, annuaire partenaires, recherche partenaires, événements professionnels, besoins, publication emploi, candidature, formulaires transport/éducation, candidats, annuaire entreprises et pages légales. Pas de page blanche confirmée ni débordement horizontal dans les vues contrôlées.
- AR/RTL : Services sur ordinateur, métier et culture sur mobile, partenaire ; navigation inversée et contenu lisible sans débordement.
- EN/IT/RU : accueil et titres traduits vérifiés, sans débordement sur ordinateur. Pas une inspection de chaque URL dans les cinq langues.
- Recherche « dentiste » via Entrée : navigation vers les résultats et affichage des fiches réussis.
- Compteur réel observé : 2483 dossiers et 38 certifiés pendant la recette ; aucune valeur codée en dur ajoutée.
- Inscription gratuite : cinq informations présentes dans le bloc, champ horaires du formulaire rempli et relu, sans envoi.
- Contact : saisie d’un titre de contrôle, sans envoi.
- Commande Business / Artisan / Ivoire & Or et Portfolio / Premium / Bleu Nuit & Champagne : sélection et ouverture des formulaires avec reprise correcte des choix et tarifs ; aucune commande créée ni paiement.
- CV Academy Arrachida et Aux Saveurs d’Anis : affichage réussi, classes public-page et premium-chrome absentes. Partage Academy actionné sans envoi externe. Pas de test exhaustif de tous les clients ni d’installation PWA.
- Autour de moi : écran explicite de géolocalisation indisponible inspecté ; carte avec position autorisée non testée.

## Points séparés / limites

- Réserve historique de certification : levée par le correctif ciblé et les tests du 11 novembre ci-dessous. Les anciennes captures ne représentent pas ce correctif.
- Traductions historiques : descriptions/secteur de certaines pages SEO restent en français en AR ; inscription entreprise ne possède que FR/AR et retombe en FR en EN/IT/RU. Contenus préservés conformément au périmètre graphique.
- Performances : délais HTTP ponctuels observés ; pas de mesure Lighthouse/Core Web Vitals ni de validation sur appareil physique. Les durées réseau de cet environnement ne constituent pas un benchmark utilisateur.
- Le navigateur connecté a cessé de répondre en fin de recette ; les pages légales et l’écran de géolocalisation ont été contrôlés avec le navigateur de secours.

## Verdict

Validation technique du correctif terminée sur tests automatisés ; prêt pour revue finale, avec les limites ci-dessous. PR laissée en brouillon, sans autorisation de fusion ou publication. Aucune écriture Airtable/Supabase, modification Stripe ou activation d’automatisation.


## Correctif ciblé de certification — 11 novembre 2026

Référence avant correction : PR #199 `8a4a0df6decfa8ea14f5558619840339e353cb55`, fondée sur PR #198 `3b6e3d6a9ce43abbd3e7b5a88fd68bcd56d67999`.

Le sélecteur SearchBar gardait son état local « Tous » alors que Businesses appliquait le filtre de l’URL. Businesses transmet maintenant son filtre appliqué au sélecteur. Un changement de ce filtre resynchronise la sélection avant le rendu des enfants ; les choix locaux restent interactifs tant que le filtre appliqué ne change pas. `aria-pressed` expose également la sélection. Aucun traitement des résultats n’est modifié.

### Preuves conservées

La comparaison navigateur antérieure entre #198 et #199 a observé les mêmes résultats : 37 certifiés, 200 non certifiés (limite de requête), 12 certifiés à Mahdia, 3 fiches mises en avant après réinitialisation. Le défaut visuel était présent sur les deux versions et préexistait à #198. Ces nombres sont des observations antérieures sur données évolutives, pas des assertions ni de nouvelles mesures après correction.

### Tests ajoutés et exécutés

Commande reproductible, avec React 18.3.1 et react-test-renderer 18.3.1 installés dans un répertoire isolé :

```sh
npm install --prefix /tmp/dalil-cert-tests --no-package-lock --ignore-scripts react@18.3.1 react-test-renderer@18.3.1
CERT_TEST_RUNTIME=/tmp/dalil-cert-tests/package.json node --test scripts/certification-filter.test.mjs scripts/public-presentation-integrity.test.mjs scripts/public-theme.test.mjs scripts/pr197-regressions.test.mjs
```

**15/15 tests réussis** : 8 nouveaux contrôles de certification et les 7 contrôles existants.

- Certifiés et Non certifiés : hydratation après navigation, sélection visuelle et paramètre soumis.
- Certifiés + Mahdia : paramètres combinés et ville préservés lors d’un rendu supplémentaire.
- Rechargement : démontage/remontage avec hydratation depuis les trois variantes d’URL.
- Réinitialisation : retour à Tous et absence du paramètre de certification au prochain envoi.
- Choix local et autres barres de recherche : comportement interactif conservé.
- Intégrité : Businesses est strictement identique à la référence avant correction, hors la seule liaison de propriété. Requêtes, filtres combinés, classement, données, traitement des URL et réinitialisation sont inchangés.
- Le contrôle AST des pages autorise uniquement cette nouvelle propriété, dont il vérifie la valeur exacte ; tous les autres contrôles sont conservés.

Contre-épreuve : la même suite de certification sur l’ancien SearchBar échoue sur les quatre tests navigation certifié/non certifié, combinaison Mahdia et rechargement (4 échecs / 4 succès). Elle vérifie la couleur effectivement sélectionnée, pas seulement le nouvel attribut d’accessibilité.

### Compilation et diagnostics

- `vite build` réussi (8,86 s). Cette exécution compile l’application ; les générateurs SEO du build complet ne sont pas réexécutés, leurs preuves antérieures restent conservées.
- TypeScript : 202 diagnostics historiques, identiques avant/après après normalisation des numéros de ligne. Le contrôle global reste en échec préexistant.
- ESLint des deux fichiers applicatifs modifiés : 87 erreurs / 6 avertissements historiques identiques avant/après par fichier, règle, message et sévérité. Aucun diagnostic ajouté ; le lint global n’est pas déclaré vert.
- Aucun changement de dépendance applicative, de fichier généré, de données, d’harmonisation ou de configuration du dépôt.

### Limites et verdict final

La nouvelle suite exécute le véritable composant React et le véritable fragment d’hydratation URL, avec routeur, géolocalisation et fournisseur de données simulés. Le rechargement est un remontage React, pas un rechargement de navigateur de la version déployée. Aucune nouvelle recette visuelle de la version corrigée déployée : aucune publication demandée ni effectuée. Les tests ne constituent pas une nouvelle mesure des résultats Supabase.

**Correctif ciblé validé automatiquement, prêt pour revue finale de la PR #199.** #198 reste inchangée ; le correctif est porté par #199 au-dessus de #198. Les 43 pages harmonisées sont conservées. Ni fusion ni publication autorisée.


## Finalisation ciblée depuis 8709ed3 — 11 novembre 2026

### Règle de certification et audit en lecture seule

La certification publique dépend uniquement de `cv_business_status === "published"`, pour Business (y compris le modèle historique nul) et Portfolio. Ni l'abonnement, ni un ancien `statut_carte`, ni une date de publication seule ne suffisent. Aucun statut, CV, abonnement ou autre enregistrement client n'est écrit ou migré.

Audit Supabase du 11 novembre : 38 anciens statuts « certifié », 3 CV marqués `published`. Parmi les 3 publiés, 2 portent encore l'ancien statut « non certifié » ; 37 anciens « certifié » ne sont pas marqués publiés. Ces écarts restent à examiner manuellement, sans migration automatique. Les 3 CV publiés sont approuvés et publiés au niveau de la fiche.

Lecture anonyme avec les filtres publics réellement utilisés : 3 certifiées, 544 non certifiées ; combinaison certifiées + gouvernorat Mahdia : 0. Ces nombres sont des observations datées, pas des constantes du produit. Le filtre non certifié inclut les statuts CV nuls ; les OR de ville/catégorie/publication restent combinés. Les caches concernés changent de version pour éviter un ancien compteur ou des cartes privées du champ CV.

Le compteur et la page des certifiées utilisent le statut de publication ; les badges et adaptateurs le reçoivent explicitement, y compris Essentielle et Portfolio. Le classement et la sélection/rotation des partenaires restent inchangés : la sélection historique des partenaires n'est pas utilisée pour déterminer la certification.

### Avis et fondateur

Mentions indépendantes de l'abonnement : de 4 à moins de 4,5/5 avec au moins 5 avis, « Bien notée par les clients » ; dès 4,5/5 avec au moins 5 avis, « Très bien notée par les clients ». La note numérique peut rester affichée sans mention de confiance sous ces seuils. Virgule décimale prise en charge ; libellés FR/AR/EN/IT/RU. Fiches Essentielles incluses. Aucun tri par note ou nombre d'avis modifié.

Accueil : réutilisation de `<FounderStory />`, résumé existant et bouton « Découvrir mon histoire » vers `/pourquoi-dalil-tounes#histoire-fondateur`. Le fichier du récit et sa version intégrale restent byte-identiques à 8709ed3.

### Validation reproductible

- `CERT_TEST_RUNTIME=/chemin/vers/runtime/package.json node --test scripts/*test.mjs` : 21/21 réussis. Runtime isolé existant avec react-test-renderer 18.3.1 ; aucune dépendance applicative ajoutée.
- 7 tests React conservés : sélection certifiés/non certifiés, Mahdia, navigation, remontage/rechargement, réinitialisation et choix locaux.
- 7 tests ciblés supplémentaires : publication/anciens statuts contradictoires, construction réelle des requêtes Supabase et filtres combinés, seuils d'avis, rendu du vrai composant Essentielle, résumé/lien du fondateur, propagation du statut dans la normalisation de fiche, invariants du classement et des pages.
- Tests de présentation et exclusions CV/QR existants conservés. L'invariant AST de l'harmonisation reste appliqué aux pages hors SeparationPreview (accueil réellement servi), Businesses et CertifiedBusinesses, les seuls points d'entrée volontairement corrigés. Un invariant distinct limite les modifications de pages à ces trois fichiers et vérifie les fonctions de classement byte pour byte.
- `npm run build` : compilation Vite et génération SEO/sitemap réussies.
- `npm run typecheck` : 202 diagnostics syntaxiques historiques, sortie identique au commit de départ. Un contrôle sémantique ciblé des fichiers corrigés retrouve les 54 diagnostics historiques, aucun nouveau.
- ESLint ciblé comparé au commit de départ : 128 erreurs / 10 avertissements contre 132 / 10 ; aucun nouveau diagnostic après normalisation des numéros de ligne. Ces contrôles historiques ne sont pas présentés comme verts.
- `git diff --check` : réussi. Aucune migration, RLS, fonction distante ou donnée client modifiée. Aucun changement de route, SEOHead, thème ou palette client.

### Contrôle navigateur local et limite de livraison

Le contrôle navigateur a permis de rectifier le point d'intégration : `/` utilise `PlatformHome` dans `SeparationPreview.tsx`, et non l'ancien `Home.tsx` (restauré sans modification). Résumé et bouton visibles dans l'accueil réellement servi ; navigation par le lien vers le récit intégral constatée. Le récit lui-même reste inchangé.

Observations dans le navigateur local : accueil à 3 certifiées ; filtre Certifiés sélectionné et 3 résultats avec badges ; avis 4,0/5 et 5 avis avec mention « Bien notée », 5/5 et 35 avis avec « Très bien notée », 4/5 et 4 avis sans mention. Les fiches gratuites affichent ces signaux. URL certifiées + Mahdia : aucun résultat et sélection Certifiés conservée, également après rechargement. URL non certifiées : sélection cohérente, liste plafonnée à 200 comme auparavant, aucun badge de certification. Les essais de soumission et de réinitialisation par clic dans ce navigateur local n'ont pas confirmé un changement d'URL ; ne pas les présenter comme une recette navigateur réussie. Le comportement de sélection après réinitialisation reste vérifié par les tests React sur fournisseur/routeur simulés. Aucune correction supplémentaire hors des trois points demandés.

La mise à jour distante est bloquée : l'écriture GitHub a été rejetée par la revue automatique, qui interprète l'interdiction de publication comme couvrant la branche de PR. Aucun commit de ce correctif n'a atteint GitHub ; la PR #199 reste à 8709ed3 et aucune nouvelle prévisualisation Vercel n'a été créée. La prévisualisation locale a été actualisée et inspectée ; elle n'est pas un lien de prévisualisation public à communiquer.

Verdict : correctif ciblé implémenté et contrôlé localement, prêt pour revue du code. Validation distante et recette complète après déploiement preview restent à effectuer. Aucune fusion, aucune mise en production, aucune écriture client. Autorisation explicite requise uniquement pour mettre à jour la branche #199 et sa prévisualisation, sans production.
