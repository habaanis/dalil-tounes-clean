# Dalil Tounes — audit transversal Commerces, Loisirs, Services, Tourisme — 16 novembre 2026

## Cadre
Base Airtable `app9Q828Splwvm4jW`, table `tbl8B6aiFeUe0hoQS`, champs `fld4CGEZ8oLqMsdvx` liste_pages. Synchronisation dans Supabase `kmvjegbtroksjqaqliyv`, `public.entreprise`. Les **96 fiches déjà mises en attente** et documentées dans `audit/liste-exhaustive-fiches-incompletes-2026-11-16.md` n'ont pas été modifiées.

## Audit par famille
- **Mode & Sport** : 57 alertes de règles simplistes. L'essentiel sont des ateliers de couture avec rubriques `entreprises` et `services citoyens`, parfaitement plausibles pour l'activité de confection sur commande. Ne pas forcer la rubrique Commerces sur tous.
- **Commerce & Matériaux** : aucune anomalie dans le contrôle testé.
- **Loisirs & Divertissement** : 3 alertes, dont `Fatimah events` comportait déjà la rubrique `loisirs & évènements ` avec espace terminal dans la donnée. Cette valeur est logique et ne doit pas être réécrite à cause d'une comparaison SQL stricte de chaînes. `BHD MEDIA PROD` et `JAD PROD` sont plutôt des prestataires professionnels, vérification individuelle avant éventuelle correction.
- **Beauté & Bien-être** : 3 alertes, dont spa et salles de sport classés dans `loisirs & évènements` / `tourisme local & expatriation` ou entreprises. Rien ne justifie d'ajouter automatiquement commerces ou services citoyens.
- **Services à la personne / Artisans & BTP** : aucune anomalie selon contrôle ciblé.
- **Hébergement & Séjour** : 2 alertes, dont une fiche brouillon `Medinat Alzahra Park` classée loisirs, sans preuve claire d'hébergement; rester en attente.

## Deux corrections de rubriques réalisées
1. **OLYFO — huile d’olive et antipasti**, ID Airtable `recHidKooJyIRS5X4` : catégorie `Alimentation ` et `Artisanal & Terroir`. Rubrique existante `entreprises` conservée, `commerces & magasins` ajoutée. La fiche était déjà publiée.
2. **DIAR FATMA Sidi Bou Said**, ID Airtable `recnDD6puVt0zB2fZ` : catégorie `Hébergement & Séjour`. Rubriques existantes `accueil`, `commerces & magasins` conservées; `tourisme local & expatriation` ajoutée. Fiche toujours non publiée (saisie à terminer).

Écriture Airtable 2/2 confirmée, puis synchronisation Supabase 2/2 relue individuellement. Aucun changement de catégorie, approbation, validation, publication, boutique, commandes, code ou déploiement.

## Contrôle et limites
- 2293 fiches conservées.
- 2197 fiches ont catégorie ET rubrique.
- 87 sans rubrique, 80 sans catégorie, soit 96 fiches distinctes incomplètes, laissées à part.
- Une interrogation postérieure montre 11 alertes « Alimentation » avec catégorie sans espace terminal et 1 alerte Hébergement, tandis que la première interrogation avait utilisé le libellé `Alimentation ` avec espace. Ces contrôles ne sont **pas directement comparables**; auditer la normalisation des libellés et la pertinence métier avant de promettre une disparition des alertes.
- La taxonomie `liste_pages` comprend certaines chaînes avec espace final dans Airtable, mais Supabase les normalise. Les conditions SQL exactes peuvent donc fabriquer de faux positifs; utiliser `btrim()` pour les revues ultérieures.

Les 96 fiches de classement incomplètes sont disponibles dans `audit/liste-exhaustive-fiches-incompletes-2026-11-16.md`.
