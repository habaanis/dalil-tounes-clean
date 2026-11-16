# Dalil Tounes — grand balayage des 91 fiches restantes et 3 classements — 16 novembre 2026

## Portée
Revue de l'ensemble des 91 fiches sans `liste_pages` dans Supabase `kmvjegbtroksjqaqliyv`, appariées par identifiant exact avec la table Airtable `app9Q828Splwvm4jW/tbl8B6aiFeUe0hoQS`. 82/91 avec correspondant Airtable, 9/91 sans correspondant, y compris des doublons historiques et enregistrements incomplets. Aucun changement sur les approbations, statuts de publication, Boutique, commandes, PWA ou migrations.

## Trois nouveaux classements vérifiés
1. **Slim Centre** (`recZhlgNWr8029bfY`) : centre commercial de Sousse, téléphone +216 58 449 616, identité corroborée par l'annuaire professionnel Go Africa Online et Cybo. Sources : https://www.goafricaonline.com/tn/708722-slim-centre et https://fr.cybo.com/TN-biz/slim-centre. Catégorie Airtable `Commerce & Matériaux` (option générique la plus proche dans la taxonomie existante; préférable à un intitulé textile inventé) ; rubriques `commerces & magasins`, `tourisme local & expatriation`. Point de taxonomie : idéalement ajouter un choix spécifique « Centre commercial » dans une modification coordonnée ultérieure.
2. **M.Gallery** (`reccEseymOegrWdTn`) : boutique de vêtements à Monastir, téléphone +216 55 776 006, identique au dossier Airtable. Source : https://halaman-kuning.cybo.com/TN/monastir-tunisia/kedai-pakaian?p=3 ; https://www.waze.com/ar/live-map/directions/tn/monastir/monastir/m.gallery?to=place.ChIJ2Qh895MTAhMRJ2qsxCtYJME. Catégorie `Mode & Sport`, rubrique `commerces & magasins`.
3. **Blue Wave Chebba** (`rectl9bkTYA2cuZxe`) : location de matériels de sports nautiques à Chebba. Un annuaire spécialisé confirme nom, ville, catégorie et numéro partiellement masqué compatible avec `+216 54 888 229`, sans fournir le numéro entier en libre accès. Source : https://poidata.io/report/water-sports-equipment-rental-service/tunisia. Catégories `Loisirs & Divertissement` et `Mode & Sport` ; rubriques `loisirs & évènements`, `tourisme local & expatriation`. Signal de correspondance moins fort qu'un numéro affiché intégralement ; à conserver comme classification révisable.

Écritures Airtable : trois modifications sur `fldIIcE1DPdcwm40B` et `fld4CGEZ8oLqMsdvx` uniquement, 3/3 confirmées. Synchronisation Supabase 3/3 confirmée par relecture des lignes. **Avant** 2293 fiches, 91 sans rubrique, 90 sans catégorie. **Après** 2293 fiches, **88 sans rubrique**, **87 sans catégorie**. 132 approbations historiques et 560 éligibles au public inchangées.

## Observations importantes au cours du grand balayage
- Un numéro téléphone commun n'est pas une preuve absolue d'identité. Le numéro `24 575 575` est annoncé par deux entreprises distinctes sur le web (Altesse, PEGAS SERVICES). Ne pas fusionner ni requalifier automatiquement.
- Une ligne nommée « Mahdia » porte le `55 201 822`, numéro annoncé par une crèche « My First Steps » à Mahdia : la fiche « Mahdia » ne peut être identifiée comme cette crèche sur le seul téléphone. Pas de modification.
- Le nom « ODYSEA » n'est pas sûrement celui de l'école de plongée homonyme, les numéros diffèrent. Pas de modification.
- « Mascotte Tunisie » et « Mascotte Gonflable Tunisie » affichent des numéros différents : ne pas assimiler sans preuve.
- Plusieurs lieux sans activité commerciale ("El Jem", "Sousse Tunisie", "Wardanin"), noms non distinctifs ("House", "TV") et doublons archivés/historiques restent hors classification automatique. Aucun enregistrement supprimé.
- 9 lignes sans rubrique et sans correspondant Airtable sont à traiter dans la réconciliation des doublons, pas par écriture SQL directe.

## Conditions de continuation
Pour les 88 dossiers restants, privilégier des preuves par nom+adresse/téléphone exact, site original ou source de confiance; établir un fichier de décisions (classer, contacter, doublon, exclure) avant toute suppression. Ne pas changer la RLS (132 dossiers historiques encore sans approbation explicitement reconnue), ni publier de fiches non autorisées.
