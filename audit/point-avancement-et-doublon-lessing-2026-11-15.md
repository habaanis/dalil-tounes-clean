# Point d'avancement chantier Dalil Tounes - 15 novembre 2026 (22h28, Africa/Tunis)

## Bilan actuel confirmé par connecteurs Supabase, Airtable, Vercel
- `public.entreprise` = 2293 lignes (dont 3 sans nom)
- 140 sans `liste_pages`
- 129 sans `categorie`
- 560 satisfont la politique de lecture publique (calcul du prédicat RLS; pas une recette navigateur)
- 132 parmi ces 560 ont `approved IS NULL` et restent à réconcilier
- 9 dossiers avec `approved=true`, `statut_publication='Publié'`, `statut_validation='terminer la saisi'` ne satisfont pas la lecture publique. Leur blocage est intentionnel en attente de complétude.
- Airtable table `tbl8B6aiFeUe0hoQS`: 2255 lignes.
- Déploiement production site `dalil-tounes-clean`: READY, commit `82d436bf3c7cd2d415b20cc22552d0bde43d2af0`
- Déploiement production PWA `dalil-tounes-pwa`: READY, commit `44299150534e6eca171eabe83fbdf6f4e8a461bc`. Aucune nouvelle livraison applicative effectuée dans ce point d'avancement.

## Découverte documentée: Lessing-Institut est un doublon historique probable
Les recherches nom/coordonnées donnent deux établissements dans Supabase :
1. `Lessing Institute`, UUID `461075a6-0644-4d3a-9f51-05f4f04e7291`, `id_airtable=rec5nQWWUvSnByaTU`, référence Airtable toujours présente; Mahdia, Avenue 02 Mars 1934, Immeuble Snen 1 Etage, téléphone +216 26 615 614; `statut_validation='terminer la saisi'`, `statut_publication=NULL`, `approved=NULL`, deux rubriques, une catégorie.
2. `Lessing-Institut`, UUID `52eb3126-3edd-4126-8c3d-aebc9b8d5c4b`, `id_airtable=recuc8IWvSa7vBFxW`, identifiant Airtable introuvable dans la table actuelle ; même ville, même adresse, même téléphone, description quasi identique ; `statut_validation='publie'`, `statut_publication='Publié'`, `approved=NULL`, une rubrique, une catégorie. Cette ligne est admissible à la RLS publique actuelle.
Les quatre tables de relations explicitement référencées par FK ont chacune **0 enregistrements liés** aux deux UUID: `business_needs`, `dalil_boutique_products`, `dalil_boutique_change_requests`, `dalil_boutique_push_subscriptions`.
Conclusion : très forte probabilité de doublon historique, MAIS il faut vérifier les URL publiques, les index et les éventuelles références métier avant fusion, suppression ou redirection; ne pas supprimer ni fusionner automatiquement.

## Travail accompli précédemment
- Suppression vérifiée des 14 brouillons totalement vides puis de 180 doublons techniques supplémentaires sans activité et sans relations observées.
- Lots de classement enregistrés et synchronisés dans Supabase; 140 sans rubrique et 129 sans catégorie restent.
- 11 corrections de validation vide mais `approved=true` et `Publié` déjà établis.
- 22 approbations historiques avec preuve écrite explicite de validation antérieure; puis Coin Bio régularisé sur note du fondateur.
- 132 approbations historiques non explicites conservées sans modification.
- 9 dossiers « terminer la saisie » examinés et laissés bloqués en raison des notes de modération / complétude.

## Actions et limite de ce contrôle
Aucune nouvelle correction de données, aucune publication, aucune modification RLS, aucun changement code, aucun déploiement; seulement audit, recherche d'appariement Lessing, constat des déploiements, vérification des clés étrangères et enregistrement du point.
Avant lancement de nouvelles corrections: revoir décisions d'approbation des 132, politique RLS et effet sur utilisateurs; planifier recette navigateur web/mobile (recherche, compte, CV, QR, boutique, FR/AR).
