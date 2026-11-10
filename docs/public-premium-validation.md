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

- Sélection « Certifiés » non concluante dans le navigateur de secours : elle reste visuellement sur « Tous ». Le même comportement a été reproduit sur la prévisualisation de #198. La logique de recherche n’a pas changé ; ce contrôle doit être confirmé dans le navigateur connecté avant validation de fusion. Aucune règle de filtre n’a été modifiée pour contourner ce résultat.
- Traductions historiques : descriptions/secteur de certaines pages SEO restent en français en AR ; inscription entreprise ne possède que FR/AR et retombe en FR en EN/IT/RU. Contenus préservés conformément au périmètre graphique.
- Performances : délais HTTP ponctuels observés ; pas de mesure Lighthouse/Core Web Vitals ni de validation sur appareil physique. Les durées réseau de cet environnement ne constituent pas un benchmark utilisateur.
- Le navigateur connecté a cessé de répondre en fin de recette ; les pages légales et l’écran de géolocalisation ont été contrôlés avec le navigateur de secours.

## Verdict

Rendu prêt pour validation visuelle. **NON PRÊT À FUSIONNER** tant que le contrôle interactif de certification n’est pas clos et que la validation utilisateur n’est pas donnée. PR laissée en brouillon. Aucune fusion, production, écriture Airtable/Supabase, modification Stripe ou activation d’automatisation.
