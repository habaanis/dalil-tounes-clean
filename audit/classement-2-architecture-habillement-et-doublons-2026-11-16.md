# Dalil Tounes — classement de deux fiches avec correspondance téléphonique — 16 novembre 2026

Périmètre : qualité des données uniquement, sans toucher au site, à la PWA, aux PR Boutique ou aux migrations.
Airtable : app9Q828Splwvm4jW, table tbl8B6aiFeUe0hoQS.
Supabase production : kmvjegbtroksjqaqliyv, public.entreprise.

## Réconciliation et classements
1. **Shape And Shade Design**, ID Airtable `reciv9oYBbyMMorA5`. Annuaire Aslama, rubrique architectes Mahdia, numéro **+216 50 745 921** identique au dossier Airtable. Source : https://aslama.tn/architecte-mahdia/page/3/ ; https://aslama.tn/author-profile/aslamatn.info%40gmail.com/directory/services/page/5/?category=architectes&directory_type=maison-jardin . Classement `agence architecture`, `Maison & Équipement` ; pages `entreprises` et `commerces & magasins`.
2. **Espace Rania**, ID Airtable `recPFNXSoznoFH1f0`. Annuaire Cybo, catégorie commerces de vêtements à Monastir, numéro **+216 27 360 478** identique à Airtable. Source : https://halaman-kuning.cybo.com/TN/monastir-tunisia/kedai-pakaian?p=3 ; classement `Mode & Sport`, page `commerces & magasins`. Ne pas lui attribuer l'activité d'un salon de réception homonyme.

## Vérification
- Airtable : mise à jour des champs `categorie` et `liste pages` uniquement ; 2/2 relues.
- Supabase : 2/2 synchronisées, catégories et rubriques vérifiées individuellement.
- Total : 2293 fiches inchangées ; sans rubrique **132 -> 130** ; sans catégorie **121 -> 119**.
- Approbations historiques restant à clarifier : 132 inchangées.
- Aucune nouvelle publication et aucun déploiement Vercel.

## Contrôles additionnels
Plusieurs entreprises non classées semblent être des doublons historiques :
- `recZuJ5x3mo5raUoz` Clinique les Violettes : ligne archivée et non approuvée, alors que `recOUCEgXS20Yg9he` existe déjà publiée, approuvée et classée.
- `recqyR3oAXrqejsSq` École des Langues et d'Informatique pour Tous : ligne de saisie incomplète, alors que `recGkfP5q6hpVPw60` est déjà publiée/classée, même téléphone.
- `recbhF2GYXqgmAtCB` Wall Street English Tunis Lac 1 : ligne incomplète, alors que `recKi9nqaHveOobW3` est déjà publiée/classée, même téléphone.
Ils n'ont pas été supprimés ni fusionnés. Faire un audit des liens et statuts avant d'agir.

## Suite
Priorité à l'identification et aux doublons sûrs; ne pas affecter une catégorie par simple ressemblance d'un nom ou un lien social non corroboré.
