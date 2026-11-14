# PWA — classement multipages : audit et règles de migration (14 novembre 2026)

Base de travail : `release/dalil-tounes-pwa-independent-20261114` au commit `5c0f31a2df43485b6ca7667ef08e39abf0134c68`.
Document d'audit, **aucune migration ni publication**.

## Environnements isolés
- PWA : `dalil-tounes-pwa.vercel.app`, projet Vercel attendu `dalil-tounes-pwa`.
- Site / mini-CV : projet `dalil-tounes-clean`, **ne pas promouvoir** la branche PWA sur ce projet.
- Supabase : `kmvjegbtroksjqaqliyv`; Airtable base `entreprise `, table `entreprise`.
- Référentiel unique de fiches via `id_airtable`; aucune duplication pour affectations multipages.

## Réutiliser l'existant
Fichiers trouvés dans la branche : `src/lib/categories.ts`, `entrepriseCategories.ts`, `magasinCategories.ts`, `santeCategories.ts`, `educationCategories.ts`, `loisirCategories.ts`, `shopFilters.ts`, `src/pages/Businesses.tsx`.
Filtres magasin existants : food, fashion, home, beauty, flowers, all. Les exceptions par mots-clés dans `shopFilters.ts` constituent un correctif local, pas une taxonomie générale.

## Données observées dans public.entreprise
- 2487 fiches ; 1018 affectées à une page ; 519 multipages ; 1469 sans page.
- 1124 avec catégorie ; 719 avec texte de sous-catégorie non vide ; 553 avec statut_publication = Publié ; 417 avec approved = true.
- 36 fiches ont des valeurs de liste_pages avec espaces en bordure.
- Répartition des affectations : tourisme local & expatriation 462 ; entreprises 345 ; commerces & magasins 320 ; loisirs & évènements 172 ; santé 156 ; accueil 84 ; services citoyens 76 ; éducation 45.
- Catégories fréquentes (avec nombre sans pages) : Medical 163 (9), tourisme&expatriation 155 (1), Immobilier 128 (19), Loisirs & Divertissement 97 (2), Artisanal & Terroir 93 (7), Alimentation 88 (7), Automobile 62 (15), Mode & Sport 55 (2), Maison de retraite 9 (9).
- Variantes linguistiques à cartographier sans réécriture automatique : Maison de retraite, Retirement home, Casa di riposo ; agence immobilière, Immobilier, وكالة عقارات.

## Visibilité publique : problème préalable
Politique SELECT `Published and legacy entreprises are public` pour anon et authenticated :
`approved IS DISTINCT FROM false AND statut_validation = 'publie' AND (statut_publication IS NULL OR lower(trim(statut_publication)) IN ('publié','publie','published'))`.
Test SQL en rôle anon : 549 fiches visibles, dont 155 avec approved NULL et 16 avec statut_publication NULL. Groupes pouvant se chevaucher. Ne pas accroître la visibilité pendant le classement.
**Avant correction RLS partagée avec le site**, sauvegarder politique et états, mesurer les fiches impactées, préparer rollback et coordonner avec le responsable du site.

## Correspondances candidates (validation obligatoire)
- `Immobilier` + `Agence Immobilière` : entreprises, tourisme local & expatriation, services citoyens (sous-page logement lorsque ce routage est implémenté) ; accueil uniquement via sélection manuelle.
- `Mode & Sport` + `Nutrition sportive & compléments` : commerces & magasins > mode/sport.
- `Mode & Sport` + `Salle de Sport / Fitness` : sport/loisirs, pas une boutique d'habillement ; vérifier le routage.
- `Beauté & Bien-être` + coiffure : commerces & magasins, services citoyens si sous-page adaptée.
- `Medical`, `Santé / Pharmacie` : santé, services citoyens / santé selon sous-catégorie vérifiée.
- `Maison de retraite` / `Retirement home` / `Casa di riposo` : santé et services citoyens après revue humaine.
Ces propositions ne valent pas attribution automatique, et les sous-pages doivent être confirmées dans le routeur.

## Lots de traitement
1. Débloquer le vrai projet Vercel PWA et son domaine. Le compte connecté ne montre que le projet `dalil-tounes-clean` ; création de `dalil-tounes-pwa` refusée (403).
2. Protéger visibilité, auditer les RPC et les politiques anonymes ; sauvegarde + rollback AVANT toute modification.
3. Relever les routes et leurs paramètres, puis étendre la table commune de correspondance, en réutilisant les fichiers existants.
4. Faire des petits lots Airtable de corrections certaines, enregistrer l'avant/après, contrôler Supabase ; jamais changer le statut de validation/publication.
5. Tester recherche, déduplication, pagination et compteurs par page, déployer dans le projet PWA indépendant et valider sur son domaine.
