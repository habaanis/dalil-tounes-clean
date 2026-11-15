# Revue finale technique : autorisations, classements et tests PWA — 15/11/2026

## Périmètre
PWA `dalil-tounes-pwa.vercel.app` uniquement pour le code. Le site officiel et les mini-apps utilisent la base Supabase partagée ; aucune migration de RLS non vérifiée. Aucun changement d'autorisation automatique.

## Autorisations historiques : 155 examinées
Dossiers potentiellement visibles avec `statut_validation='publie'`, `approved IS NULL` :
- **155** dans Supabase ; **154/155** identifiants retrouvés dans Airtable et comparés, et **154/154** avec `statut_validation=publie` dans Airtable.
- Parmi ces 154, **148** ont `Statut de publication=Publié` dans Airtable ; **6** sont sans marqueur de publication, mais leur statut de validation reste `publie` des deux côtés.
- Les six sans marqueur sont Bergaoui Prod, Chwine Rent a car Mahdia, Mahdia Gym, Syrine Private School, TAIEB SAKKA Medical Analysis Laboratory, Viamercato.
- **1 exception** : `Lessing-Institut`, Supabase `id_airtable=recuc8IWvSa7vBFxW`, état publié, mais cet identifiant est absent d'Airtable. Une fiche différente `Lessing Institute`, `rec5nQWWUvSnByaTU`, existe en préparation à Mahdia. Les deux lignes existent distinctement dans Supabase ; elles ne doivent pas être fusionnées, approuvées ou supprimées sans vérification de l'historique/du client.
- Tous les 155 possèdent un nom, une catégorie, des pages et un identifiant Airtable Supabase ; **1** identifiant n'est plus présent dans Airtable.
- La politique de lecture active `Published and legacy entreprises are public` impose `approved IS DISTINCT FROM false`, `statut_validation='publie'`, `statut_publication IS NULL OR published`. Les 155 sont donc des **publications héritées**, pas nécessairement 155 dossiers non autorisés.
- **Aucune modification de `approved` ou de RLS** : l'approbation ne peut pas être inférée mécaniquement d'une autre colonne ; la disparition de fiches clients publiées serait une régression. Seule l'exception Lessing exige une décision de modération avec preuves supplémentaires.
- Différence de visibilité si `approved=true` exigé brutalement : 549 anciens visibles contre 384 stricts — impact 165 fiches potentiellement masquées. Ne pas effectuer.

## Classements des dossiers incomplets
- Lot nouveau : **28/28 fiches** avec activité explicite attribuées dans Airtable et synchronisées Supabase, sans changement de publication. Métier confirmé par catégorie + sous-catégorie cohérentes (santé, soins aux aînés, fournisseurs de matériel médical, réparation informatique, service de ménage, loisirs/danse, location auto, immobilier, etc.).
- Lots précédents : **36** affectations vérifiées ; cumul **64 fiches** reclassées.
- Après le lot : **2 487 fiches au total**, **1 405 sans liste_pages** : dont **1 359 sans catégorie**, **46 avec catégorie** mais cas restant incertains/incomplets. Il n'est pas fiable d'inventer une catégorie à ces 1 359 fiches sans source métier.
- Autres cas à revoir parmi les 46 : catégories imprécises ou contradictoires, sous-catégories vides, pages d'immeubles, établissements ambigus ou dossiers en brouillon. Ne pas publier par simple reclassement.
- L'automatisation Airtable de publication exige la sélection `Prêt à publier`; **0/28** nouvelles publications.

## Tests exécutés
- `node scripts/business-page-classification.test.mjs` : **PASS**, normalisation, suggestions multipages, routes PWA partagées.
- `node scripts/smoke-public-routes.mjs` : **16/16 PASS**, HTTP 200 sur les routes publiques.
- Chromium/Playwright installé dans sandbox temporaire avec les dépendances système : tests navigateur de production de l'ancien scénario `smoke-browser.mjs` : **11/16 PASS**. Les **5 échecs** portent tous sur l'attente du deuxième `role=tab` de la page « S'installer », conçu pour l'ancien site et absent/différent dans la PWA. Ne pas les présenter comme des parcours validés.
- Test navigateur PWA ciblé des **7 scopes** `sante`, `services`, `magasin`, `entreprises`, `tourisme`, `education`, `loisirs` : **7/7 PASS**, chargement HTTP 200 et DOM sans page d'erreur sur mobile (390x844). Cela ne prouve pas la pertinence des résultats de recherche pour chaque métier ; une vérification d'assertions métier resterait utile.
- `npm run typecheck` : **FAIL** sur une erreur préexistante de chaîne non échappée dans `src/components/AlerteRechercheForm.tsx` (vérifiée aussi sur `release/dalil-tounes-pwa-independent-20261114`). Le build Vercel ne remplace pas un typecheck réussi.

## Livraison
- Production PWA : `dpl_Nzkvt55JuyyKfAvXYfWddKH9HfHv` commit `6a80dfb53263ebbfda6f3f2e332ad6f72b219ceb`, READY, alias `dalil-tounes-pwa.vercel.app`.
- Le lot de 28 est **données Airtable/Supabase uniquement**, déjà visible pour tout dossier publié (aucune des 28 nouvelles fiches n'est publiée), donc **ne pas redéployer la même application**.
- Le total général `get_enterprise_record_count()` reste indépendant de la publication et valait **2487** à la vérification.

## Exceptions ouvertes qui nécessitent source externe ou décision métier
1. Réconcilier le cas `Lessing-Institut` avec son origine Airtable et son historique de validation ; éviter doublon ou rupture de lien.
2. Recueillir des catégories authentiques pour les **1 359** lignes sans catégorie ; traiter les **46** ambiguës par contrôle métier.
3. Adapter le scénario Playwright « S'installer » au design de la PWA et débloquer le typecheck historique avant de déclarer une QA exhaustive.

Ce document clôt l'inventaire technique vérifiable sans prétendre que ces exceptions sont résolues. Aucun changement global de RLS, aucune suppression, aucun déploiement site officiel.
