# Dalil Tounes — classement documentaire de 2 établissements — 2026-11-15

## Périmètre
Airtable base `app9Q828Splwvm4jW`, table `tbl8B6aiFeUe0hoQS`; Supabase `kmvjegbtroksjqaqliyv`, table `public.entreprise`. Branche `audit/pwa-classification-multipages-20261114`.

Avant opération : 2293 fiches, 140 sans rubrique, 129 sans catégorie. Les deux candidats étaient uniques dans Supabase, catégorie et rubriques vides également dans Airtable.

## Sources documentaires et modifications
1. `recyUOvR0sjVaRIXG` — cogeb_groupe. Source officielle https://cogebgroupe.com/ : groupe tunisien construction, vente de matériaux et activité immobilière. Champs Airtable:
   - `fldIIcE1DPdcwm40B` : Commerce & Matériaux ; Immobilier
   - `fld4CGEZ8oLqMsdvx` : entreprises ; commerces & magasins
2. `rechIktagHmGROPkN` — hub design mahdia. Source https://creativetunisia.tn/2022/08/29/hub-design-mahdia-le-nouveau-centre-de-services-dedie-a-lartisanat-et-au-design/ : accompagnement artisans, formations techniques, coworking, photographie et design. Champs:
   - catégorie : Artisanal & Terroir ; Education & Formation
   - liste pages : entreprises ; éducation ; loisirs & évènements

## Vérification
- Écriture Airtable **2/2**, modification des champs de catégorie/rubriques uniquement.
- Synchronisation Supabase **2/2** confirmée, sans écriture directe en base.
- Après : **2293 fiches**, **138 sans rubrique**, **127 sans catégorie**.
- Les deux fiches n'ont pas de publication approuvée. Aucun statut de publication ou de validation modifié; aucune nouvelle fiche rendue publique.
- Aucun code ni migration RLS changé; aucun déploiement Vercel nécessaire pour ces données.

## Observation non confirmée : compteur d'accueil
Un résultat de recherche web récemment indexé affiche encore « 2,487 records registered » mais il peut être un contenu de cache/index non actualisé. Supabase `get_enterprise_record_count()` retournait 2293 lors de la recette antérieure. Vérifier le rendu **navigateur réel** du compteur avant toute correction frontend; ne pas conclure à une anomalie en production sur la base du seul crawl.

## Suite
- 138 fiches sans rubrique restantes : nombreuses lignes de tests, lieux génériques ou noms sans preuve métier; ne pas classer artificiellement.
- 132 approbations historiques en lecture publique sans approval explicite, 9 `terminer la saisi` : revue métier sécuritaire distincte.
- Travail commercial déjà en cours; traiter le fonctionnement en production et non comme pré-lancement.
