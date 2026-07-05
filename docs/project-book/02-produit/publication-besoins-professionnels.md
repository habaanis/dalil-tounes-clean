# Publication de besoins professionnels

## Objectif du document

Ce document définit la spécification fonctionnelle et technique de la fonctionnalité **Publication de besoins professionnels**.

Il sert de base de validation avant tout développement.

Cette fonctionnalité doit être construite avec une structure propre, évolutive et séparée.

Elle ne doit pas réutiliser directement `partner_requests`, `projets_services_b2b` ou `LocalMarketplace` comme base principale.

---

## 1. Nom recommandé côté utilisateur

Nom recommandé : **Publier un besoin professionnel**

Nom de section possible :

- **Besoins professionnels**
- **Opportunités B2B**

---

## 2. Nom recommandé des futures tables Supabase

Structure principale recommandée :

- `business_needs` : besoins publiés par les entreprises.
- `business_need_responses` : réponses envoyées par d'autres entreprises.

Tables futures possibles, non nécessaires au démarrage :

- `business_need_attachments`
- `business_need_status_history`
- `business_need_notifications`

---

## 3. Types de besoins possibles

Valeurs recommandées :

- `supplier_search` : recherche fournisseur
- `service_provider_search` : recherche prestataire
- `equipment_purchase` : achat matériel
- `equipment_sale` : vente matériel
- `liquidation` : liquidation
- `partnership` : partenariat
- `business_opportunity` : opportunité d'affaires
- `other` : autre

---

## 4. Statuts possibles

Valeurs recommandées :

- `draft` : brouillon
- `pending_review` : en attente
- `published` : publié
- `closed` : fermé
- `expired` : expiré
- `rejected` : rejeté

---

## 5. Champs nécessaires pour la table des besoins

Table recommandée : `business_needs`

Champs principaux :

- `id`
- `created_at`
- `updated_at`
- `published_at`
- `expires_at`
- `closed_at`
- `created_by`
- `company_id`
- `company_name`
- `type`
- `title`
- `slug`
- `summary`
- `description`
- `category`
- `subcategory`
- `tags`
- `city`
- `governorate`
- `zone_intervention`
- `budget_min`
- `budget_max`
- `currency`
- `deadline`
- `urgency`
- `status`
- `visibility`
- `moderation_status`
- `moderation_reason`
- `response_count`
- `is_featured`
- `submission_lang`

Champs privés à protéger :

- `contact_name`
- `contact_email`
- `contact_phone`
- `internal_notes`

---

## 6. Champs nécessaires pour la table des réponses

Table recommandée : `business_need_responses`

Champs recommandés :

- `id`
- `need_id`
- `created_at`
- `updated_at`
- `respondent_user_id`
- `respondent_company_id`
- `respondent_company_name`
- `contact_name`
- `contact_email`
- `contact_phone`
- `message`
- `proposal_summary`
- `estimated_price`
- `currency`
- `estimated_delay`
- `status`
- `submission_lang`

Statuts de réponse possibles :

- `new`
- `viewed`
- `shortlisted`
- `accepted`
- `rejected`
- `archived`

---

## 7. Règles de visibilité

Règles par statut :

- `draft` : visible uniquement par l'entreprise créatrice.
- `pending_review` : visible par l'entreprise créatrice et l'administration.
- `published` : visible selon le niveau choisi.
- `closed` : visible avec badge "fermé", mais réponse désactivée.
- `expired` : visible ou masqué selon décision produit.
- `rejected` : visible uniquement par l'entreprise créatrice et l'administration.

Niveaux de visibilité possibles :

- `public`
- `verified_companies`
- `premium_only`
- `private_link`

---

## 8. Règles de modération

Tout besoin publié doit passer par le statut `pending_review` avant visibilité publique.

Points à contrôler :

- clarté du titre ;
- catégorie correcte ;
- absence de données sensibles dans la description ;
- absence de spam ;
- absence d'offre illégale ;
- cohérence entre l'entreprise et le contact ;
- cohérence de la date d'expiration ;
- respect des règles de qualité de Dalil Tounes.

---

## 9. Protection des coordonnées

Les coordonnées ne doivent pas être affichées publiquement par défaut.

Principe recommandé :

- les entreprises répondent via Dalil Tounes ;
- les coordonnées complètes restent privées ;
- l'entreprise créatrice voit les coordonnées des répondants ;
- l'entreprise répondante voit sa propre réponse ;
- l'administration peut consulter les coordonnées pour modération et suivi ;
- une mise en relation peut révéler les coordonnées après acceptation.

Les champs `contact_email`, `contact_phone` et `contact_name` doivent être traités comme des données sensibles.

---

## 10. Parcours utilisateur complet

1. L'entreprise clique sur **Publier un besoin professionnel**.
2. Elle choisit le type de besoin.
3. Elle renseigne le titre, la description, la catégorie, la ville, le gouvernorat, le délai et le budget optionnel.
4. Elle ajoute ses coordonnées privées.
5. Elle enregistre en brouillon ou soumet son besoin.
6. Le besoin passe en modération.
7. Après validation, le besoin apparaît dans la liste des besoins professionnels.
8. Les autres entreprises filtrent les besoins par type, catégorie, ville, gouvernorat, urgence ou statut.
9. Une entreprise ouvre un besoin.
10. Elle répond via un formulaire dédié.
11. L'entreprise créatrice consulte les réponses dans son tableau de bord.
12. Elle marque une réponse comme retenue, rejetée ou archivée.
13. Elle ferme le besoin une fois résolu.

---

## 11. Intégration dans la page Centre d'affaires

Dans la future page Centre d'affaires :

- placer un bouton principal **Publier un besoin professionnel** en haut de page ;
- afficher une section **Besoins professionnels récents** ;
- placer les filtres au-dessus de la liste ;
- prévoir des filtres par type, catégorie, ville, gouvernorat, urgence et statut ;
- utiliser des cartes dédiées de type `NeedCard`, séparées de `BusinessCard` ;
- ne pas mélanger visuellement les besoins avec l'annuaire entreprises.

---

## 12. Intégration dans CompanyDashboard

Ajouter plus tard des onglets dédiés :

- **Mes besoins**
- **Mes réponses**
- **Publier un besoin**
- **Brouillons**
- **Réponses reçues**

Cette fonctionnalité ne doit pas être mélangée avec l'onglet emploi actuel.

Le dashboard entreprise doit devenir l'espace naturel de suivi des besoins publiés, réponses reçues, statuts et mises en relation.

---

## 13. Ce qu'il ne faut surtout pas modifier

Ne pas modifier :

- `BusinessCard`
- `BusinessDetail`
- `SearchBar`
- les routes publiques existantes
- le SEO existant
- `partner_requests`
- `projets_services_b2b`
- `LocalMarketplace`
- les fichiers Supabase, RLS ou Edge Functions sans demande explicite
- les URLs publiques actuelles

Cette fonctionnalité doit être isolée au départ pour éviter de casser les flux existants.

---

## 14. Plan de développement en phases

### Phase 1 - Validation produit

- Valider les types de besoins.
- Valider les statuts.
- Valider les règles de visibilité.
- Valider les règles de modération.
- Valider la protection des coordonnées.

### Phase 2 - Audit Supabase live en lecture seule

- Comparer la base réelle aux migrations locales.
- Vérifier les tables existantes liées aux demandes et opportunités.
- Ne créer aucune table pendant cette phase.

### Phase 3 - Création contrôlée de la structure dédiée

- Créer `business_needs`.
- Créer `business_need_responses`.
- Activer RLS.
- Définir des policies strictes.
- Tester lecture, création, modification et visibilité.

### Phase 4 - Administration minimale

- Ajouter une vue de modération.
- Permettre validation, rejet, fermeture et expiration.
- Ajouter un motif de rejet.

### Phase 5 - Dashboard entreprise

- Ajouter l'onglet **Mes besoins**.
- Ajouter les brouillons.
- Ajouter les besoins soumis.
- Ajouter les réponses reçues.

### Phase 6 - Liste publique ou semi-publique

- Ajouter la liste filtrable des besoins publiés.
- Ajouter les cartes dédiées.
- Préserver le SEO existant.
- Ne pas indexer massivement avant validation qualité.

### Phase 7 - Système de réponses

- Ajouter le formulaire de réponse.
- Ajouter le suivi des réponses.
- Ajouter les statuts des réponses.

### Phase 8 - Évolutions B2B

- Notifications.
- Mise en avant premium.
- Matching B2B.
- Opportunités recommandées.
- Marketplace B2B.

---

## Conclusion

Cette structure propre évite de mélanger des flux historiques instables avec une fonctionnalité centrale du Centre d'affaires.

Elle protège le SEO, les routes, les composants sensibles et les données existantes.

Elle permet de construire progressivement une base saine pour évoluer vers une marketplace B2B, sans casser l'annuaire actuel de Dalil Tounes.
