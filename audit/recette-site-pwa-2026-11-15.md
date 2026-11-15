# Recette technique site / PWA Dalil Tounes — 15 novembre 2026

## Périmètre et limites
- Site: https://dalil-tounes.com ; Vercel dalil-tounes-clean (prj_EaqUHYR8DyFcWsN169lir0Pszqmw)
- PWA: https://dalil-tounes-pwa.vercel.app ; Vercel dalil-tounes-pwa (prj_AJeQ8yjK2rQCPwQOG9R1CgDvKQmE)
- Base: Supabase kmvjegbtroksjqaqliyv, public.entreprise.
- Cette recette est un **audit de données, code et Vercel**, pas une recette visuelle E2E. Les requêtes directes aux URL n'ont pas été accessibles depuis l'environnement de test; aucune navigation interactive navigateur réelle n'a été validée. Les scripts e2e du chantier précédent ont été identifiés dans GitHub mais pas exécutés ici.
- Aucun changement RLS, code, statuts métier ou déploiement pendant la recette.

## Déploiements
- Dernier déploiement de production Vercel du site READY: dpl_3nX5GKG2WzjigATgqKZYK8LABLpg, branche main, commit 82d436bf3c7cd2d415b20cc22552d0bde43d2af0 (corrections QR/CV et compte).
- Dernier déploiement **production** listé de PWA READY: dpl_CUPwVbLm7dQy33DDzqftiTb1Ru1m, branche feat/pwa-house-three-commercial-benefits-20261115, commit 7050e4fa1ddbb3ac4d268aa9c75e539fc135e5a8. Un déploiement plus récent de PWA avec target null est une preview et ne doit pas être présenté comme production.
- Vercel get_runtime_errors 24h pour les deux projets: aucun groupe d'erreur retourné. N'exclut pas les anomalies UI et fonctionnelles.

## Compteur réel et logique
- SELECT count(*) FROM public.entreprise = 2293.
- Fonction public.get_enterprise_record_count() = 2293.
- La fonction est une fonction SQL SECURITY DEFINER calculant count(*) sur public.entreprise, sans exposer les brouillons.
- Code main src/lib/homeDataPrefetch.ts utilise supabase.rpc('get_enterprise_record_count'), puis un cache localStorage clé home_data_v19, staleTime 5 min et revalidation au retour sur onglet/focus. src/components/CompanyCountCard.tsx affiche totalCount via CountUp.
- 2290 lignes avec nom non vide; 3 lignes sans nom.
- Affichage réel dans navigateur non vérifié. Un navigateur ayant un ancien cache peut momentanément afficher l'ancien chiffre avant la revalidation.

## Publication / sécurité — blocage prioritaire à arbitrer
- 404 lignes approved=true et statut_publication='Publié'.
- RLS actuelle SELECT anon/authenticated: approved IS DISTINCT FROM false AND statut_validation='publie' AND (statut_publication IS NULL OR lower(btrim(statut_publication)) IN ('publié','publie','published')).
- 549 lignes satisfont ce prédicat, réparties: 394 approved=true, 155 approved=NULL. Parmi les 155: 149 statut_publication='Publié', 6 statut_publication=NULL. Les 155 ne sont donc pas explicitement approuvées, mais sont éligibles à la lecture via la politique publique.
- 20 lignes approved=true et statut_publication='Publié' ne satisfont pas le prédicat de lecture publique, car statut_validation est NULL (11) ou 'terminer la saisi' (9).
- Le cas des 155 peut être un héritage intentionnel; il faut rapprocher les statuts Airtable avant de décider de les masquer. Ne PAS modifier les 155 approbations ou politiques RLS à l'aveugle. Une modification RLS brutale ferait disparaître 155 fiches publiques, ce qui requiert une revue métier des approbations et une analyse de régression.
- Les fiches publiques au sens de la RLS ont toutes un nom et une rubrique (0 sans nom et 0 sans rubrique).
- Ne confondez pas 404 approuvées+publiées et 549 lisibles selon RLS.

## Recherche / rubriques
- Code main src/components/SearchBar.tsx utilise un client Supabase anon, filtre nom non NULL, statut_publication nul ou 'Publié' puis la RLS et classe les réponses sur pertinence et statut CV.
- Configuration main src/config/searchBars.ts: recherche globale accueil active; navbar désactivée; catégories sante/education/administration/loisirs/magasin/marche_local activées sauf éventuel flag VITE_DISABLE_SECONDARY_SEARCH.
- Entrées de rubrique (toutes fiches, y compris non publiées, donc somme > 2293 en raison des multipages): éducation 636, entreprises 608, tourisme local & expatriation 529, commerces & magasins 489, loisirs & évènements 321, services citoyens 260, santé 227, accueil 84.
- Fiche test 'aux saveurs d'anis': approved=true, statut_publication='Publié', catégorie Alimentation, pages accueil/commerces & magasins/loisirs & évènements/tourisme local & expatriation.
- Pas de vérification naviguée des URL, des parcours utilisateur ou du rendu sur mobile effectuée ici.

## Suite recommandée
1. Examiner les 155 fiches lisibles via RLS avec approved=NULL et les 20 approuvées publiées mais non lisibles. Harmoniser les statuts dans Airtable avant tout changement de politique RLS.
2. Exécuter les tests navigateur E2E du site et de la PWA (accueil/recherche/7 rubriques, FR/AR, détail entreprise, QR/CV, boutique et compte) sur les domaines publics et sur mobile avant validation visuelle.
3. Contrôler en navigation réelle le compteur 2293 après revalidation du cache, le nombre de cartes publiques et le parcours Aux Saveurs d'Anis.
4. Ne déployer de nouveau code que si un correctif est testé et validé; les données sont déjà en production.
