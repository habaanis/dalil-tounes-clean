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
