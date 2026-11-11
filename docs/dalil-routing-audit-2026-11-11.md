# Dalil Tounes — audit de classification et synchronisation

Date de contrôle : 11 novembre 2026. Chantier rattaché à la PR #202.
Source de vérité éditoriale : Airtable, base `app9Q828Splwvm4jW`, table `entreprise`.
Projection publique : Supabase, table `public.entreprise`.

## Champs métiers à utiliser

- Airtable `secteur` : univers général, **pas** une preuve de sous-catégorie.
- Airtable `categorie` : famille du métier (ex. `État / Service public`, `Medical`, `Automobile`).
- Airtable `sous_categories` : spécialité opérationnelle (ex. `Administration / Direction régionale`, `CNSS / CNAM`, `Taxi / Grand Taxi`).
- Airtable `liste pages` : destinations éditoriales autorisées, à compléter **uniquement** après la vérification du métier.
- Supabase : `categorie`, `sous_categories_texte`, `liste_pages` résultent de la fonction `sync-airtable` ; ne pas écrire dans Supabase en parallèle des automatisations.
- La note Google et le compteur d'avis sont des signaux de **classement**, pas des critères de classification métier.

## Règle de cohérence

Une affectation à la page `services citoyens` ne veut pas dire que l'entreprise est un bureau administratif.
Le bouton **Bureaux** exige la catégorie `État / Service public` **et** une sous-catégorie administrative explicite ; la requête continue à respecter les conditions de visibilité/publication.

Les avocats, banques, professionnels de santé, transports, photographes et commerces restent accessibles dans leurs univers appropriés. Ne jamais publier une fiche brouillon dans le seul but de remplir une rubrique.

## Corrections effectuées

- Vague 1 : 42 fiches Airtable précédemment mal affectées à `services citoyens` ont été déplacées vers les pages pertinentes (entreprises, tourisme/expatriation, commerces ou loisirs), en conservant les autres destinations déjà valides.
- Une location de voitures initialement catégorisée dans `Alimentation` a été reclassée dans `Automobile`.
- Vague 2 : cinq établissements de sport, fitness ou spa ont quitté la page `santé` pour leurs rubriques loisirs et/ou tourisme.
- Vague 3 : 37 fiches ont reçu une sous-catégorie métier plus précise : 16 `Location de Voitures`, 8 `Taxi / Grand Taxi`, 12 `photographe`, 1 `Agence de Voyage (Billetterie)`.
- Aucune modification des statuts de publication, des CV clients, des notes et des avis Google.

## Synchronisation vérifiée

Automatisations Airtable **déployées** :
- `Synchronisation des nouvelles entreprises vers Dalil Tounes` (`recordCreated`)
- `Synchronisation des modifications vers Dalil Tounes` (`recordUpdated`, toutes les colonnes)

Fonction Supabase existante : `sync-airtable`, version 15. Elle lit les champs `liste pages`, `categorie` et `sous_categories`, et met à jour `liste_pages`, `categorie` et `sous_categories_texte` dans Supabase.

Les cinq fiches pilotes ont été retrouvées dans Supabase avec leurs nouvelles destinations. La synchronisation a un délai ; **une réponse Airtable réussie n'est pas une preuve immédiate de propagation à Supabase**.

Contrôle SQL après les corrections : **zéro fiche** de ces huit familles incompatibles conservée dans `services citoyens` ; **zéro fiche** de catégorie `Mode & Sport` ou `Beauté & Bien-être` conservée dans `santé`.

## Écarts et points à surveiller

Audit de 2 254 fiches Airtable : 1 162 sans catégorie et 1 268 sans page assignée. Ces absences concernent pour l'essentiel des dossiers incomplets ou non publiés ; **ne pas remplir automatiquement au hasard**.
Les fiches ayant les champs `{}` comme sous-catégories exigent une validation métier ; seuls les 37 cas explicites ont été corrigés.
Plusieurs véritables administrations figurent encore en brouillon : ne pas les publier automatiquement, même si la rubrique Bureaux devient temporairement vide.

## Contrôles à reproduire après import / synchronisation

1. Vérifier que chaque fiche **publiée** a une catégorie, une sous-catégorie exploitable et au moins une destination.
2. Établir un tableau catégorie × page, pour détecter des familles manifestement mal placées.
3. Vérifier séparément les **Bureaux** (catégorie et sous-catégorie, pas seulement `liste_pages`).
4. Comparer cinq `id_airtable` modifiés aux enregistrements Supabase ; attendre la fin des automatisations, puis relire.
5. Confirmer que le nombre de fiches / leurs avis / leurs statuts de publication n'a pas changé à cause d'un reclassement.
6. Ne promouvoir la PR #202 qu'après contrôles de navigation mobile et résultats métiers.

Cette classification est une amélioration contrôlée des données existantes ; ce document ne remplace pas une revue humaine des cas ambigus.
