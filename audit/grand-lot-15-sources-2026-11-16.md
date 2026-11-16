# Dalil Tounes — grand lot de classement vérifié de 15 fiches — 16/11/2026

Périmètre exclusif : catégories et liste_pages Airtable, synchronisation Supabase. Aucun statut de publication, approbation, composant Boutique, commande, migration RLS, PR concurrente ou déploiement Vercel modifié.

## Base
Airtable `app9Q828Splwvm4jW`, table `tbl8B6aiFeUe0hoQS`. Champs `fldIIcE1DPdcwm40B` et `fld4CGEZ8oLqMsdvx`.
Supabase `kmvjegbtroksjqaqliyv`, table `public.entreprise`.

## Fiches classées
| Fiche | ID Airtable | Catégorie | Rubriques |
|---|---|---|---|
| ROSA GARDEN | recES0o0fLYbVMG3N | Loisirs & Divertissement | loisirs & évènements; tourisme local & expatriation |
| Wahret nes zmen sousse | reccfpEqBadc2KaRB | Mode & Sport; Artisanal & Terroir | commerces & magasins; loisirs & évènements; tourisme local & expatriation |
| Le Savoir | recl5uIrQsoYiDLWE | Education & Formation | éducation; entreprises |
| Yes You Can Bardo | recrz1vtLdwCzeD7R | Education & Formation | éducation; entreprises |
| Getusion Sousse | recGseFYea4AUvYJ6 | Education & Formation | éducation; entreprises |
| Warcha | rec6hrKaNZwBwnxvK | Education & Formation; Loisirs & Divertissement | éducation; loisirs & évènements |
| Altesse | recLHjEeitTwYplNj | Mode & Sport | commerces & magasins |
| Medlec | recwVaghTgw9shE4R | Education & Formation | éducation; entreprises |
| La Fontaine | rechUs02Afqw3meuj | Education & Formation | éducation |
| Dar El Ers | recsCqVwAndmAKauT | Mode & Sport | commerces & magasins |
| Clara Msaken | recsq3gHeuu0PpGe4 | Mode & Sport | commerces & magasins |
| Black House | recW3PBgJ3w7dOZWW | Alimentation | commerces & magasins; tourisme local & expatriation |
| CMA | recagmFnoJpAXBw52 | Mode & Sport | entreprises |
| Espace Manar | recLuCvnFEiT0gKuK | Mode & Sport | commerces & magasins |
| Dar el joud | recJFekWp08HOITcX | catégorie non modifiée | entreprises |

## Sources corroborantes (activité et téléphones)
- ROSA GARDEN, événements Ksar Hellal 54 511 458 : https://www.bonsplansmariage.com/vendors/tunis/salle-des-fetes/rosa-garden-2/
- Wahret nes zmen, location et vente habits traditionnels, 54 482 360 : https://www.findglocal.com/TN/Sousse/1430545243912209/Wahret-nes-zmen-sousse---%D9%88%D9%87%D8%B1%D8%A9-%D9%86%D8%A7%D8%B3-%D8%B2%D9%85%D8%A7%D9%86-%D8%B3%D9%88%D8%B3%D8%A9
- Le Savoir, centre d'apprentissage, 29 707 252 : https://www.africabizinfo.com/fr-TN/le-savoir_25-27-679-912
- Yes You Can Bardo, école de langue anglaise, 28 154 154 : https://www.schoolandcollegelistings.com/TN/Le-Bardo/420744928117967/Yes-you-can
- Getusion Sousse, école de langues, 73 217 847 : https://barka.tn/service/sousse/cours-de-francais/b07d06d11559c24d66fc062092ad2f75
- Warcha, cours de peinture, 23 955 115 : https://barka.tn/service/sousse/cours-francais
- Altesse, boutique de vêtements, 24 575 575 : https://altessemode.wixsite.com/altesse/contact
- Medlec, formation culturelle, 71 860 002 : https://www.cybo.com/TN-postal-code/1053_tunis/education-other/
- La Fontaine, école privée Ksar Hellal, 73 587 420 : https://www.ecoles.com.tn/etablissements/primaire/la-fontaine
- Dar El Ers, boutique de vêtements, 97 309 909 : https://www.cybo.com/TN/akouda/clothing-stores/
- Clara Msaken, boutique de mode, 73 257 951 : https://www.africabizinfo.com/fr-TN/clara-msaken-73-257-951
- Black House, restaurant, 27 700 637 : https://fr.restaurantguru.com/Black-House-Masakin
- CMA, confection de maillots d'Akouda, 73 358 687 : https://catalog.data.gov.tn/dataset/4f2bb6f2-2322-4221-8911-59f2f7d4dadb/resource/acfaa0a0-b592-4669-b890-7d31017c66d2/download/entreprisespartenaires.pdf
- Espace Manar, boutique vêtements, 24 608 607 : https://fr.cybo.com/TN/akouda/shopping/?p=5
- Dar el joud, coordonnées et activité commerciale confirmées par site officiel, 52 757 373 : https://dareljoud.net/contact/ . Classement générique entreprises uniquement, spécialité non inférée.

## Résultat
- Airtable : 15/15 modifications et relecture confirmées. Catégories ajoutées pour 14/15.
- Supabase : synchronisation 15/15 pour rubriques, 14/15 pour catégories, puis comptages SQL vérifiés.
- Avant : 2293 fiches, **115 sans rubrique**, **113 sans catégorie**.
- Après : 2293 fiches, **100 sans rubrique**, **99 sans catégorie**.
- Approbations historiques sans confirmation explicite : 132 (inchangé).
- Fiches éligibles au public selon RLS : 560 (inchangé).
- Aucune suppression; aucun redéploiement code nécessaire pour ces changements de données.

## Prochaine phase
Sur les 100 sans rubrique restants, plusieurs sont des lieux sans activité commerciale fiable, des doublons historiques (7 ID Airtable introuvables dans la table), des noms partiels ou des brouillons. Ne pas ajouter une rubrique artificielle sans identification ni modifier les statuts de publication. Réviser les futurs contrôles métier concernant la catégorie de restaurant/événement si la taxonomie est enrichie.
