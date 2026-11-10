# PR #197 — validation finale du 10 novembre 2026

Verdict technique : **PRÊT À FUSIONNER**, dans le périmètre de cette PR. Fusion et publication en production en attente de validation d’Anis. La dette TypeScript/lint reste explicitement non résolue dans le document séparé.

## Références

- Base : `main` `10fc772421960dad18ce1498a21d75a7ed6f5166`.
- Correction transport/horaires : `e1413d120ac7e811dce5c67922164693cbfbc5f5`.
- Dernier code applicatif contrôlé : `837729cc4b56f487428b91632cd05bd19d555c5e`.
- Prévisualisation finale : https://dalil-tounes-clean-3ijl5lexm-haba-anis-projects.vercel.app
- Vercel `dpl_5qUXp9RG84jZsRwPk4tcPdP7u5pS` : READY ; statut GitHub Vercel success.
- Les trois transmissions réelles ont été réalisées sur la prévisualisation `9zbrb8ip9` du commit `e1413d1`. Le commit suivant ne modifie que trois éléments de présentation de Subscription.tsx ; formulaire et transport inchangés.

## Comparaison des diagnostics

Même installation de dépendances, deux worktrees isolés. Commandes :

```sh
node_modules/.bin/tsc --noEmit -p tsconfig.app.json --pretty false
node_modules/.bin/eslint . -f json
node --test scripts/pr197-regressions.test.mjs
npm run build
SMOKE_BASE_URL=https://dalil-tounes-clean-3ijl5lexm-haba-anis-projects.vercel.app node scripts/smoke-site-structure.mjs
```

| Contrôle | main | PR finale | Nouveaux diagnostics |
|---|---:|---:|---:|
| TypeScript global | 202 erreurs | 202 erreurs | 0, sorties identiques |
| ESLint global | 368 erreurs / 44 avertissements | 363 erreurs / 44 avertissements | 0 |

SHA-256 commun des sorties TypeScript : `de09bf78f55320860f24bc6f46bfbccdc89b0c8393f925664bed9bd33c613db5`.
Lint comparé par fichier relatif, règle, sévérité, message et ligne source, sans dépendre des numéros de lignes déplacés. Une erreur `prefer-const` réellement introduite était masquée par cinq suppressions de variables inutilisées : elle a été corrigée. Les 364 erreurs initiales ne pouvaient donc pas être déclarées toutes préexistantes sans cette correction.

- Tests ciblés : **4/4** (horaires sous plafond de 1 200 caractères, arabe, fermeture du relais en production et refus interorigine, validation amont conservée).
- Compilation Vite + génération SEO + sitemap : réussie ; 9 148 routes SEO, 333 pages entreprises, sitemap 597 URLs.
- HTTP : **16/16** routes publiques sur e1413d1 ; **10/10** contrôles structure/SEO/redirections/ressources sur 837729c. Les trois lignes de présentation ajoutées ensuite aux tests publics ne changent aucune route.
- `git diff --check` : réussi.

## Transmission et nettoyage des trois dossiers fictifs

Marqueur commun : `TEST PR197 20261110 … T6K9`. Coordonnées synthétiques, adresses `example.invalid`, aucune fiche cliente utilisée, aucune publication, aucun encaissement.

| Parcours | Supabase, identifiant reçu | Airtable, identifiant reçu | Résultat |
|---|---|---|---|
| Présence Essentielle, FR | `df6d65ad-b0e2-4e44-8390-7d4be42f0a50` | `rec5s9SyZgpGik0rW` | Réception puis suppression ciblée confirmées |
| Business / Artisan, FR, 30 TND | `29486294-9659-48f1-b6a3-60679b3ca827` | `recwfAa2S6KP7I0gT` | Réception puis suppression ciblée confirmées |
| Portfolio / Premium, AR, 59 TND | `c25c6983-bcdc-450d-adee-e08cab3bd316` | `rec2sESCo9DgVGb3p` | Réception puis suppression ciblée confirmées |

Les trois demandes étaient en attente, synchronisées vers Airtable, sans création dans `entreprise`. Le contrôle final du marqueur retourne **0 demande Supabase, 0 entreprise publique et 0 enregistrement Airtable**.

La demande gratuite contenait nom, activité, ville, téléphone et horaires : `Lun–Ven 09:00–17:30 ; samedi 09:00–12:00 [PR197 T6K9]`. Un message optionnel de 1 200 caractères vérifie le cas limite. Les horaires étaient perdus par troncature lorsque placés à la fin ; ils sont désormais placés en tête du message et ont été lus intacts dans Supabase puis Airtable. Aucun changement de schéma nécessaire.

Un premier appel a expiré ; la reprise a abouti. Le contrôle du même Request-ID a retourné `duplicate: true`, avec un seul dossier conservé. Business et Portfolio ont abouti directement. Le succès à l’écran et les deux réceptions ont été vérifiés ; la livraison de la notification e-mail administrative n’est pas certifiée.

Le domaine Vercel Preview était refusé par le CORS existant. Le relais ajouté fonctionne exclusivement avec `VERCEL_ENV=preview`, contrôle l’origine identique, la méthode, le type et la taille du corps, et conserve les validations et la déduplication de la fonction existante. Il utilise uniquement la clé publique fournie, jamais une clé privilégiée. Aucune fonction Supabase ni politique CORS de production n’a été modifiée.

Le parcours validé depuis septembre est une demande suivie d’instructions BIAT privées. Les tests ont atteint l’accusé de réception et les instructions correspondant au montant choisi. Aucun virement, paiement Stripe ni modification d’offre n’a été effectué.

## Historique Abonnement et conservation

L’historique Git a été récupéré sans limite de profondeur : inventaire de 40 commits touchant Subscription.tsx avant le dernier complément, et 70 sur la page et ses deux composants de présentation. Voir le document d’historique associé.

Les deux branches `release/site-cv-accueil-valide-20261106` et `release/site-cv-concept-valide-20261106` ont des objets Git identiques à main pour Subscription, CvPresentationModelSelector, CvBusinessJourney et SubscriptionRequestForm. L’ancienne branche preview n’a pas été fusionnée ; son ancien logo gratuit ne doit pas réapparaître après la décision ultérieure des cinq informations.

Comparaison syntaxique des cinq objets de traduction : `subscriptionCopy`, `mobileSubscriptionCopy`, `essentialCvCopy`, `offerCopy`, `simplifiedOfferCopy` sont identiques à main. Cela préserve prix, conditions, textes et traductions. CvBusinessJourney et SubscriptionRequestForm sont également inchangés.

| Amélioration antérieure | Conservation dans la PR |
|---|---|
| Formules distinctes des modèles, 48fd972 | Artisan 30 TND et Premium 59 TND ; chacun permet Business ou Portfolio |
| Modèles/aperçus corrigés, 9d075cd, 70053c0, 48fd972 | Images Business/Portfolio réelles, agrandissement et lien « Tester les boutons du modèle » |
| Palettes et actions, 70d5cfc, 63c9361 | Vert Prestige, Ivoire & Or, Bleu Nuit & Champagne ; vrai aperçu et valeur transmise au formulaire |
| Mobile compact, 73d6b57, 7660a46, ae588c5 | Sélection du modèle par boutons, visuel unique mobile, bénéfices dépliables |
| Vidéo et parcours PWA/QR/CV, a95b870, b75da5b | Composant inchangé, accessible dans les détails ; vidéo chargée (`readyState=4`) |
| Commande, b3b1fed puis 48fd972 | Modèle/formule/palette conservés ; demande BIAT et non réactivation d’un ancien paiement Stripe |
| Présence gratuite, 6ad3f22 | Cinq informations sans logo ; aperçu conservé |
| Offre de bienvenue et maintenance | 12 mois + 24 mois offerts ; 50 TND/an dès la quatrième année ; conditions de non-renouvellement conservées |
| Accompagnement, Élite et contacts | Conservés derrière le bouton existant des autres services |

Deux précisions d’affichage supprimées lors du regroupement ont été rétablies avec leurs cinq traductions : gratuit sans abonnement obligatoire ; complémentarité avec les plateformes existantes. Un lien direct aux modèles est ajouté au sommaire.

## Contrôles visuels et navigation

- Production `/subscription` comparée visuellement à la prévisualisation en dispositions ordinateur et mobile.
- Prévisualisation finale : ordinateur 1 440 px et mobile 390 px, français et arabe ; modèles, sélection, palettes, formulaire, ouverture des détails, image agrandie et vidéo contrôlés.
- Choix mobile Premium + Portfolio + Bleu Nuit & Champagne : le formulaire affiche bien les trois valeurs et 59 TND.
- Arabe : direction RTL et textes restaurés affichés. Anglais, italien et russe : titres et cinq informations vérifiés. Aucun débordement horizontal dans ces vues (scrollWidth = innerWidth).
- Recherche accueil « Academy Arrachida » puis Entrée : un résultat, ouverture du CV Academy Arrachida Group et actions présentes.
- Mini-application Academy : chargée, QR SVG 206 px, lien public vers le CV existant conservé. Contrôle par échantillon, sans scan physique ni nouvelle installation.
- Aperçus Business et Portfolio Aux Saveurs d’Anis chargés ; aucune modification des composants clients BusinessCard, BusinessDetail, BusinessShowcaseLienoraDetail, CvPortfolioPresentation ou BusinessQr.
- Compteur final : **2 476** affiché en FR/AR et confirmé par `get_enterprise_record_count()`. L’écart avec les 2 441 du précédent passage reflète les données courantes ; aucune entreprise n’a été ajoutée par ces tests.
- Redirections permanentes concept/notre-concept/abonnement, paramètres de langue, canonical, description, titre HTML avant JavaScript et sitemap : tests HTTP réussis.
- Aucune erreur console JavaScript dans les dernières vues contrôlées.

## Limites maintenues explicitement

Les commandes globales TypeScript/lint restent rouges à cause de la dette historique ; elles ne sont pas présentées comme réussies. La validation porte sur l’absence de nouveaux diagnostics et les parcours couverts. Pas de paiement réel, de scan QR physique, de test exhaustif de chaque client ou de certification de réception des e-mails. Aucun changement des règles de recherche, classement, publication, tarifs, automatisations, schémas ou clients. Aucune fusion ni publication de production, phase application non commencée.
