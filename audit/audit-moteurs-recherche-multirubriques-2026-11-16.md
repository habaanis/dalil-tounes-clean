# Dalil Tounes — audit grand lot catégories ↔ moteurs de recherche — 16 novembre 2026

## Périmètre et méthode
Lecture seule de `public.entreprise` (Supabase `kmvjegbtroksjqaqliyv`) et du code de la branche `audit/pwa-classification-multipages-20261114`. Catégories et pages comparées avec `lower(btrim(...))` pour éviter les faux positifs dus aux espaces. **Aucune correction en base, publication, migration, Boutique ou PWA dans cette passe.**

Source précédente : `audit/controle-transversal-commerce-loisirs-tourisme-2026-11-16.md`. Les 96 dossiers incomplets recensés séparément demeurent hors périmètre.

## Inventaire des associations de rubriques
Ce sont des **associations**, pas des entreprises uniques ni un compteur de fiches publiques. Une entreprise peut contribuer à plusieurs rubriques.

| Rubrique | Associations |
|---|---:|
| éducation | 656 |
| entreprises | 635 |
| tourisme local & expatriation | 555 |
| commerces & magasins | 516 |
| loisirs & évènements | 338 |
| services citoyens | 262 |
| santé | 227 |
| accueil | 84 |

## Grande matrice de contrôle (extraits, catégories pouvant être multiples)
| Catégorie normalisée | Fiches dans la catégorie | Commerces | Entreprises | Services | Loisirs | Tourisme |
|---|---:|---:|---:|---:|---:|---:|
| education & formation | 651 | 0 | 44 | 30 | 27 | 12 |
| mode & sport | 224 | 160 | 69 | 57 | 19 | 6 |
| medical | 191 | 1 | 23 | 12 | 0 | 7 |
| loisirs & divertissement | 167 | 9 | 11 | 1 | 165 | 82 |
| tourisme&expatriation | 160 | 21 | 7 | 1 | 27 | 160 |
| immobilier | 119 | 10 | 117 | 9 | 0 | 117 |
| alimentation | 109 | 101 | 47 | 0 | 30 | 23 |
| artisanal & terroir | 102 | 64 | 18 | 0 | 12 | 67 |
| hébergement & séjour | 71 | 4 | 3 | 0 | 3 | 70 |
| automobile | 63 | 35 | 55 | 9 | 0 | 24 |
| photographe professionnel | 62 | 1 | 61 | 0 | 61 | 0 |
| beauté & bien-être | 57 | 52 | 16 | 2 | 8 | 11 |
| agence architecture | 48 | 1 | 48 | 28 | 0 | 1 |
| justice & juridique | 46 | 0 | 2 | 46 | 0 | 20 |
| agence immobilière | 44 | 0 | 44 | 0 | 0 | 44 |
| gastronomie tunisienne | 43 | 41 | 26 | 0 | 22 | 7 |

Ne pas inférer que toutes les entrées d'une catégorie doivent apparaître dans chacune de ces rubriques. La sous-catégorie et la nature précise de l'activité prévalent.

## 11 pistes à examiner sans correction automatique
Contrôle par catégories `alimentation`, `hébergement & séjour`, `loisirs & divertissement`, `commerce & matériaux`, `agence immobilière`, comparées à la page généralement attendue. **Ce sont des écarts de règle générique, pas 11 erreurs confirmées.**

| Fiche | Airtable | Observation | Décision |
|---|---|---|---|
| Advanced Aquaculture Tunisienne | recpWnsbSiKbYZDQ9 | alimentation; entreprises seules | Production B2B plausible : ne pas forcer commerces |
| BHD MEDIA PROD | recn9q69EIg2JMNFt | loisirs; entreprises seules | Production audiovisuelle B2B : conserver en attente de description |
| Black Bee — entreprise solidaire | recSyl0b7VFkHLt0x | alimentation; entreprises seules; brouillon | Ne pas toucher |
| Bollywood Food | recFOIYZUTlPZVYvM | alimentation; tourisme seul | Vérifier vente/restaurant avant éventuel ajout commerces |
| El Walima Bent El Bey | rec3dzoYtpkJUXwhx | alimentation; tourisme seul | Vérifier type de restauration |
| JAD PROD | recmXIKnv17Vigbx2 | loisirs; entreprises seules | Prestataire B2B potentiel : ne pas forcer loisirs |
| Kim’s Table | recrhEQ9I73Q8QrFN | alimentation; restaurant coréen; tourisme seul; publié | **Priorité : vérifier ajout commerces** pour cohérence avec restaurants |
| Latifa Belaid — Formation pâtisserie | recjrYMX2sRsh2rvl | alimentation + formation; éducation et entreprises; publié | Formation, pas boutique : conserver |
| Medinat Alzahra Park | recp1jzCa1E2fpx3h | hébergement; loisirs; brouillon | Probable catégorie hébergement à requalifier, hors lot |
| Sou & Me Handmade | recxN6ebow8p5maM6 | alimentation; entreprises seules; brouillon | Ne pas toucher |
| Viamercato | rec87YWy8trIsGxvm | alimentation; restaurant italien; tourisme, loisirs, accueil | **Priorité : vérifier ajout commerces**, sans retirer ses autres pages |

## Incohérences de moteur à transmettre au chantier interface, sans modification ici
1. `src/lib/businessPageClassification.ts` expose 7 scopes `sante, services, magasin, entreprises, tourisme, education, loisirs` vers 7 valeurs de `liste_pages`.
2. `src/components/SearchBar.tsx` limite `appPageScope` à seulement `sante`, `services`, `magasin`. Les autres scopes ne reçoivent pas le filtre `liste_pages` dans ce composant : **risque de résultats inter-rubriques**, à confirmer dans le parcours effectif et les autres composants.
3. `src/components/SearchBar.tsx` utilise le scope texte `tourism` mais `businessPageClassification.ts` mappe `tourisme`; vérifier le parcours et unifier la convention avant correction.
4. `src/components/SearchBar.tsx` ne sélectionne pas explicitement `liste_pages` dans la requête des suggestions, alors que `src/pages/Businesses.tsx` gère le scope du répertoire. Bien comparer suggestion et page de résultats.
5. `src/lib/shopFilters.ts` exclut explicitement clubs de sport/garages pour le raccourci Mode & Sport et certaines installations thermales pour Beauté ; **ne pas supprimer ces protections**.

## Suite opérationnelle
- Revoir individuellement les deux restaurants **Kim’s Table** et **Viamercato** dans Airtable; ne modifier que si la nature commerçante est confirmée, conserver toutes les rubriques actuelles.
- Réviser la normalisation des libellés, les filtres par scope, la correspondance catégories/sous-catégories, et dédupliquer par `id_airtable` dans les listes de résultats, sans enlever les présences multi-rubriques.
- Garder les 96 incomplets dans `audit/liste-exhaustive-fiches-incompletes-2026-11-16.md` pour une session ultérieure.
- Ne pas modifier ici Boutique, commandes, comptes, PWA, design ni production.
