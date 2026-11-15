# Audit final partiel – Dalil Tounes – 2026-11-15

## Point de départ de cette mission
Supabase projet `kmvjegbtroksjqaqliyv`, Airtable base `app9Q828Splwvm4jW`, table `tbl8B6aiFeUe0hoQS`, branche `audit/pwa-classification-multipages-20261114`.
2473 établissements, 332 sans rubrique, 317 sans catégorie.

## Écritures de classification vérifiées
10/10 fiches classées et synchronisées en production, en trois sous-lots 7+2+3 :
- recP3fMJIoycWWaPN : ATELIER 5D -> agence architecture, entreprises
- recQcjHwTmF4hot3V : Atec Group -> Education & Formation, éducation + entreprises
- rec6OdYcPLPwtYgr2 : Dianthus studio -> agence architecture, entreprises + tourisme local & expatriation
- recxtKe7mL1VQXSCb : Dar Khiari -> catégorie Medical conservée, rubrique santé
- recoRSLf0DkIirKmn : Dar Mohamed Jlassi -> catégorie Medical conservée, rubrique santé
- recVBla9pGvEsLWAn : Aycha Medical -> catégorie Entrepreneur conservée, rubrique entreprises
- reccWmZEeWMwql6GC : Sfax Trading -> catégorie Immobilier conservée, entreprises + services citoyens + tourisme local & expatriation
- recxu63JkxI0qxppQ : SODIS SLIM -> Mode & Sport, commerces & magasins
- recoaS8bb8mQWekiX : Flèche Le Cavalier Msaken -> Loisirs & Divertissement, loisirs & évènements + tourisme local & expatriation
- recsk9KyLk5OU6OUY : Dar Sidi Abdallah - IN'ART -> Loisirs & Divertissement, loisirs & évènements + tourisme local & expatriation
- rec9RtzHKMbHEy8dv : Association Apollon -> Loisirs & Divertissement, loisirs & évènements + services citoyens
- recmMNXYFnPQYnH9P : Artech -> Education & Formation, éducation + loisirs & évènements

ATTENTION : Il y a **12 fiches** dans cette liste (7 + 2 + 3 = 12), pas 10. Toutes les trois écritures contrôlées et synchronisées. Aucun statut de publication ou approbation modifié.

## Nettoyage autorisé
Après les 14 lignes quasi vides supprimées précédemment, contrôle de 183 lignes encore sans nom :
- 180 lignes `hanine-pastry`, statut `Brouillon`, approved=false, nom vide, autres champs d'identité/contact/médias vides ; aucun ID d'enregistrement correspondant dans les 2255 enregistrements de la table Airtable.
- Aucune relation détectée dans business_needs, dalil_boutique_products, dalil_boutique_change_requests, dalil_boutique_push_subscriptions.
- **180 suppressions effectuées** via SQL DELETE muni de garde-fous stricts, DELETE RETURNING count=180.
- Les 3 fiches sans nom restantes n'ont PAS été supprimées : l'une est une fiche de préinscription vide atypique et deux ont téléphone et name_ar / name_en. Ne pas traiter ces trois fiches comme doublons techniques avant revue.

## État final vérifié dans Supabase
- 2293 établissements
- 320 sans rubrique
- 309 sans catégorie
- 3 sans nom
- 137 nommés sans rubrique.
- 16 des 137 ont au moins une catégorie existante ; 121 n'en ont pas.
- Parmi les 137, 7 IDs Airtable ne sont pas retrouvés dans la table Airtable (Bouzguenda Training Center, Centre de Soins Esthétiques Mahdia, Clinique les Violettes, École des Langues et d’Informatique pour Tous, deux fiches nour, Wall Street English Tunis Lac 1).
- Les 320 ne sont PAS tous classés : les fiches restantes demandent vérification métier ou réparation de correspondance ; ne pas remplir de catégories artificielles.

## Sécurité et production
Aucune approbation, aucun statut de publication, aucun changement RLS, aucun code PWA ou site modifié. Les changements Airtable sont synchronisés dans la base Supabase de production ; aucun rebuild Vercel nécessaire pour des changements de données. Affichage public non vérifié individuellement.
