# Journal des modifications de classement — 2026-11-14

Toutes les corrections doivent être effectuées dans Airtable puis vérifiées dans Supabase. Ce journal contient exclusivement les modifications effectivement faites.

## Lot 001 — S2M Real Estate
- Airtable base : `app9Q828Splwvm4jW`; table : `tbl8B6aiFeUe0hoQS`
- Record : `recwAcgZQLS4rifhs`
- Avant : `liste pages` vide.
- Après : `entreprises `, `tourisme local & expatriation`, `services citoyens`.
- Justification : catégorie Immobilier ; sous-catégories Agence Immobilière et Promoteur Immobilier ; description explicite de promotion immobilière, logements et gestion de propriétés.
- Autres champs : inchangés. `statut_validation` = `terminer la saisi` ; `statut_publication` = NULL ; `approved` = false.
- Synchronisation Supabase : confirmée, `liste_pages` = `['entreprises','tourisme local & expatriation','services citoyens']`.
- Visibilité : ne pas publier ; pas de test d'affichage public nécessaire tant que non approuvée.
- Retour arrière : rétablir le champ Airtable `liste pages` à vide pour ce record ; attendre puis vérifier le retour à NULL/tableau vide dans Supabase.

## Point de sécurité important
`Coin Bio` (`recH1GnRRVO0y9DiO`) : Airtable validation publie et publication Publié ; Supabase `approved` NULL malgré `cv_business_status` = published et `modele_cv` = portfolio. Toute politique RLS exigeant immédiatement `approved=true` masquerait cette fiche client. Ne pas changer globalement la RLS sans inventaire des exceptions, validation du circuit de modération et rollback documenté.


## Lot 002 — Agences immobilières explicitement identifiées
- Airtable : `recvxcGSx028DsKmb` — Narjess Real Estate Agency ; `recwMjGZo4bdw2fpy` — Real Estate Agency Immo's By Selim.
- Avant pour les deux : `liste pages` vide.
- Après Airtable pour les deux : `entreprises `, `tourisme local & expatriation`, `services citoyens`.
- Base du classement : nom contenant explicitement `Real Estate Agency`, catégorie `Immobilier`, sous-catégorie `Agence Immobilière`, concordantes dans Airtable.
- Statut préservé : `terminer la saisi` ; `approved=false` et `statut_publication=NULL` dans Supabase, donc fiches non publiques.
- Première vérification Supabase : synchronisation en attente ; second contrôle : **synchronisation confirmée** pour les deux, `liste_pages=['entreprises','tourisme local & expatriation','services citoyens']`.
- Retour arrière : rétablir `liste pages` vide dans Airtable pour chacun, puis vérifier la synchronisation Supabase.


## Lot 003 — Immobilier explicite, sans publication
- Avant : `liste pages` vide pour chacun.
- Après Airtable : `entreprises `, `tourisme local & expatriation`, `services citoyens`.
- Enregistrements : `recKhwzq8l1uRhYSI` DAR KLIF ; `recvb5B009QCgyu0T` Hachfi Real Estate ; `recEaFq7BH4A6Bcp0` HOME IN TUNISIA ; `recIgqTCiFYlDajb7` STE ALPINIA de promotion immobilière.
- Justification : catégorie Immobilier ; sous-catégorie Agence Immobilière pour les trois premiers, dénomination `promotion immobilière` pour le dernier.
- Statuts inchangés : `terminer la saisi`, `statut_publication=NULL`; `approved` NULL ou false selon la fiche.
- Premier contrôle Supabase : champs `liste_pages` encore à NULL ; second contrôle : **synchronisation confirmée pour les 4 fiches** avec les trois pages, statuts inchangés.
- Retour arrière : rétablir `liste pages` vide dans Airtable pour ces 4 records, vérifier Supabase ensuite.


## Lot 004 — 27 fiches sans pages : établissements personnes âgées et automobile
- Source : Supabase sans liste_pages, croisé avec Airtable. Affectations écrites **uniquement dans Airtable**. Aucun statut de publication ni d'approbation modifié.
- 14 établissements de personnes âgées : `recTHCMu6nQlJYNnz`, `reczycQgUo8HPAqeQ`, `recRTB3QyVMdQen9F`, `recRqQS7mQoWFVbdJ`, `recQsDgUA25t6hIFm`, `rec2NmVdPPcA7Kce8`, `recAy4Hg2LZxDwbmh`, `reclPcF3dzfBqbUsH`, `recJJFR3ldZH5xH6f`, `rec52cEqop4vVGz50`, `rec2MV5kxOXorGYOI`, `recMjzzszkpXQRDvw`, `recctHifxH4jP3Pd7`, `recfYooKbhWjngfSK`. Catégories Maison de retraite, Retirement home ou Casa di riposo ; sous-catégories Retirement home ou Assisted living facility. Pages attribuées : `santé`, `services citoyens`.
- Automobile — `entreprises ` + `services citoyens` : garages `recV2kg2wtttMYvsG`, `recZqRmk3rg5MgpEa`, `recnik1PSxlku85DN` ; lavage `recCbDmEEw2O7zpmV`.
- Automobile — `entreprises ` + `commerces & magasins` : vente véhicules `recKwMoG3Z2vjp8pJ`, vente accessoires et pièces `recgkbBMMod5ySoaS`, `recoUwtT6ssfB4HQ6`, `reci3GFF6jlDPfiVm`, `recy5aQpcrBDAMnH7`.
- Automobile — `entreprises ` + `services citoyens` + `commerces & magasins` : réparation et ventes pièces/véhicules `recJl1fAZPDVa3XVz`, `rec4fodWtcECYHXem`, `rec7MTFkjfYYr8iBh`.
- Automobile — `entreprises ` + `tourisme local & expatriation` + `services citoyens` : location de véhicules `rec8AYKRasyxA3wsy`.
- Validation avant écriture : champs Airtable liste pages vides, métiers/catégories vérifiés, statut `terminer la saisi` pour les 27.
- Premier contrôle Supabase : 27 présentes, 4 synchronisées, 23 en attente, aucune avec `approved=true`, aucune `statut_publication` non vide.
- Retour arrière : pour chacune des 27 fiches ci-dessus, remettre le champ Airtable `liste pages` vide, puis attendre le retour à tableau vide/NULL dans Supabase ; vérifier les statuts inchangés.

## INCIDENT — Lot 004 totalement annulé, sécurité de publication (14 novembre 2026)
- Après les seules affectations `liste pages` sur Airtable, la synchronisation a fait passer **11 fiches automobiles** de `terminer la saisi` / publication vide à `publie` / `Publié` dans Airtable et Supabase ; les 14 établissements de retraite et deux autres fiches automobiles n'ont pas subi ce basculement au moment du constat.
- Ne pas conclure que la modification de pages seule est la cause certaine : autre automatisation ou traitement concurrent possible. Le fait avéré est une dérive de statuts pendant le lot.
- Mesures de restauration : remise de `liste pages` vide pour **les 27 fiches dans Airtable**, remise de `statut_validation=terminer la saisi` et `Statut de publication` vide ; remise de `liste_pages=NULL`, `statut_validation='terminer la saisi'`, `statut_publication=NULL` dans Supabase pour les mêmes IDs.
- Vérification SQL Supabase après restauration : **27 fiches retrouvées, 0 avec pages, 0 ayant `publie` ou statut_publication non vide**.
- Aucun trigger SQL standard déclaré dans `information_schema.triggers` pour `public.entreprise` au moment de l'audit ; vérifier Airtable Automations, synchronisation bidirectionnelle, Edge Functions et autres traitements externes avant de reprendre.
- **Ne pas réappliquer le lot 004 tant que le circuit de publication n'est pas isolé.** Les suggestions restent documentées ci-dessus, pas validées pour déploiement.


## Cause identifiée et vérifiée dans Airtable Automations
- Automatisation **active** : `Publication gratuite — saisie terminée` (ID `wflZa2t6KtvYOSP7f`).
- Son déclencheur `recordMatchesConditions` exige simultanément `statut_validation = terminer la saisi`, **`liste pages` non vide**, ainsi que nom et plusieurs autres champs requis. Il n'exige pas un geste de validation indépendant quand la dernière condition remplie est `liste pages`.
- Son action `updateRecord` écrit la formule Présence essentielle, `Statut de publication = Publié`, `statut_validation = publie`, statut carte non certifiée. C'est l'explication directe de l'apparition de publications après le reclassement de certaines fiches complètes.
- Historique des exécutions : **14 succès les 14 novembre à 22:40–22:41 UTC**, concordant avec le lot de modifications. Ce mécanisme est confirmé.
- Automatisation de synchronisation des modifications vers Supabase `wflVyPTiHCmOaxoof` : active, surveille tous les champs, relaie les modifications via Edge Function `sync-airtable`.
- Les **7 fiches du lot immobilier précédent** restent affectées aux pages attendues, non publiées au contrôle final.
- **Ne pas désactiver ou changer l'automatisation de publication sans revue du workflow commercial** : certaines fiches doivent effectivement être publiées automatiquement après validation. Il faut dissocier le classement technique de l'autorisation de publier (champ de validation explicite, ou workflow équivalent) avant de reprendre une migration en masse.
