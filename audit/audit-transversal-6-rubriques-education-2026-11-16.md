# Dalil Tounes — audit transversal des fiches déjà classées — 16/11/2026

## Périmètre et séparation
Contrôle en lecture Supabase projet `kmvjegbtroksjqaqliyv`, table `public.entreprise`, puis modification des seules rubriques `fld4CGEZ8oLqMsdvx` dans Airtable `app9Q828Splwvm4jW`, table `tbl8B6aiFeUe0hoQS`. Aucune modification des autorisations, approbations, statuts de publication, Boutique, commandes, QR ou PWA.

## Diagnostic
Sur 2293 entrées, 2197 possèdent au moins une catégorie ET une rubrique. Les 96 autres dossiers sont déjà listés dans `audit/liste-exhaustive-fiches-incompletes-2026-11-16.md` et laissés à part comme demandé.

Recherche d'incohérences de rubriques parmi les fiches classées :
- 0 champ `liste_pages` sous forme JSON sérialisé dans le miroir Supabase.
- 0 fiche de catégorie Medical privée des rubriques santé ET services citoyens.
- 6 fiches de catégorie Education & Formation dont la rubrique éducation était absente.
- 0 fiche immobilière (Immobilier/Agence immobilière/وكالة عقارات) dépourvue des rubriques entreprises ET tourisme local & expatriation.

## Six corrections réalisées et synchronisées
Pour chaque fiche, **on a ajouté** la rubrique éducation en conservant les rubriques déjà existantes :
| ID Airtable | Établissement | Rubriques après ajout |
|---|---|---|
| rec28gKHHgSkxuFt7 | 25 July School | entreprises; tourisme local & expatriation; éducation |
| recHphgDZogqTlLKp | Abc School Preparatory School | tourisme local & expatriation; éducation |
| recWSN6agyNPSG9hk | Academia Primary School | tourisme local & expatriation; éducation |
| recYvMP5WkpPaFbYN | Pointdev | entreprises; éducation |
| recOvTOYoCZNTETWp | Psynapse | entreprises; éducation |
| recqm8qtyGyDxESld | revival coaching space | entreprises; éducation |

Les six lignes ont une catégorie Education & Formation renseignée au préalable. Les trois dernières étaient déjà publiées; leurs états de publication sont restés inchangés. Avant correction chaque ligne Airtable a été relue, puis l'écriture a été confirmée (6/6) et le miroir Supabase a été revérifié (6/6).

## Résultat
Après correction: 2293 entreprises, 2197 fiches possédant catégorie+rubrique, **0 incohérence éducation sur le contrôle ciblé**, 0 incohérence santé sur le contrôle ciblé, 87 sans rubrique, 80 sans catégorie. Les indicateurs incomplets restent identiques car les six fiches possédaient déjà d'autres rubriques.

Cette opération complète la revue de qualité transversale. Elle ne prouve pas que toutes les catégories/rubriques de la base sont sémantiquement correctes. Un futur contrôle doit couvrir les autres familles métier, les synonymes de catégories et les doublons de rubriques sans modifier les 96 dossiers mis de côté.
