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
