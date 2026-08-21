# Dalil Tounes — Feuille de route « CV Business d'abord »

Version : 1.0

## Décision stratégique

Dalil Tounes adopte désormais une logique produit centrée d'abord sur le CV Business vivant.

Le CV Business devient le produit principal présenté, partagé et vendu aux professionnels tunisiens.

La plateforme Dalil Tounes reste essentielle, mais elle devient le moteur de découverte et d'amplification placé derrière chaque CV Business.

Nouvelle logique :

```text
CV Business professionnel
        ↓
Présence Google, partage, QR code et réseaux sociaux
        ↓
Intégration dans Dalil Tounes
        ↓
Visibilité par métier, ville, gouvernorat et secteur
```

Cette évolution ne transforme pas Dalil Tounes en Lienora.

Lienora sert uniquement de référence méthodologique pour la qualité d'une vitrine, la richesse du contenu et la rigueur SEO. Dalil Tounes conserve son identité, son architecture, son positionnement tunisien et son écosystème.

---

# 1. Produit principal : le CV Business vivant V2

Chaque entreprise doit disposer d'une page professionnelle pouvant vivre seule sur Internet et être utilisée comme mini-site officiel.

Le CV Business V2 doit pouvoir présenter, selon les données et l'offre choisie :

- identité de l'entreprise ;
- logo et image de couverture ;
- métier, spécialités et secteur ;
- ville et gouvernorat ;
- présentation de l'entreprise ;
- services ;
- réalisations et galerie photos ;
- vidéo lorsque l'offre le permet ;
- adresse, carte et itinéraire ;
- horaires ;
- téléphone, WhatsApp, email et site web ;
- réseaux sociaux ;
- avis ;
- réservation lorsque disponible ;
- QR code et partage ;
- liens vers les pages métier, ville, gouvernorat et secteur ;
- entreprises similaires.

Le CV Business doit rester cohérent avec l'identité visuelle de Dalil Tounes. Le modèle visuel de Lienora ne doit pas être copié.

---

# 2. Rôle de la plateforme Dalil Tounes

La plateforme devient la couche de diffusion des CV Business.

Elle doit permettre de découvrir les entreprises selon plusieurs portes d'entrée :

- recherche directe ;
- métier ;
- ville ;
- métier + ville ;
- gouvernorat ;
- secteur ;
- recommandations ;
- entreprises similaires.

La plateforme ne doit pas créer des pages artificielles ou vides. Chaque page SEO doit correspondre à un besoin réel et contenir des résultats fiables.

---

# 3. Principes obligatoires

1. Une seule URL officielle par entreprise.
2. Chaque CV Business publié doit posséder un title, une description, un canonical et des données structurées propres.
3. Les informations importantes doivent être disponibles dans le HTML initial, sans dépendre uniquement de React.
4. Les anciennes URL doivent rediriger vers la nouvelle URL officielle lorsqu'une correspondance existe.
5. Les pages inexistantes doivent répondre avec un vrai statut 404.
6. Les sitemaps doivent contenir uniquement les URL canoniques utiles et indexables.
7. Une fiche gratuite peut être plus simple qu'une fiche Premium, mais elle ne doit pas être vide.
8. Les pages ville et gouvernorat doivent avoir des périmètres distincts.
9. Seules les entreprises réellement publiées doivent alimenter les pages SEO publiques.
10. Les données affichées ne doivent jamais être inventées.

---

# 4. Entreprises pilotes

Le développement sera d'abord validé sur trois cas réels complémentaires.

## Pilote A — CV Business Premium riche

**SKILA Mahdia**

Objectif : vérifier la meilleure version possible du CV Business V2 avec description riche, images, horaires, coordonnées, avis, QR code et maillage Dalil Tounes.

## Pilote B — fiche classique bien remplie

**Syrine Private School**

Objectif : vérifier qu'une fiche gratuite ou classique utilise réellement les informations disponibles dans la base et reste utile pour le visiteur et pour Google.

## Pilote C — fiche pauvre

**TAIEB SAKKA Medical Analysis Laboratory**

Objectif : définir le comportement d'une fiche qui possède des informations pratiques mais aucun contenu éditorial suffisant. Cette fiche pourra rester visible dans l'annuaire tout en étant exclue temporairement de l'indexation jusqu'à son enrichissement.

---

# 5. Programme de réalisation

## Phase 0 — Sécurisation technique

- travailler uniquement sur une branche dédiée ;
- préserver la production actuelle ;
- repartir du dernier état applicatif complet ;
- vérifier build, typecheck et comportement avant toute mise en production ;
- ne jamais modifier directement la base ou les Edge Functions sans besoin validé.

**Validation attendue :** environnement de travail sûr et reproductible.

## Phase 1 — Architecture fonctionnelle du CV Business V2

- définir les sections communes ;
- définir ce qui est visible pour chaque niveau d'offre ;
- garantir un contenu minimum pour les fiches gratuites ;
- conserver l'identité graphique Dalil Tounes ;
- organiser la page pour qu'elle soit claire sur mobile ;
- identifier les champs existants Airtable/Supabase utilisés par chaque section.

**Validation attendue :** maquette fonctionnelle complète sur les trois pilotes.

## Phase 2 — Prototype CV Business V2

- construire un composant réutilisable ;
- commencer par SKILA Mahdia ;
- adapter ensuite le même composant aux fiches classique et pauvre ;
- vérifier les images, attributs alt, titres, services, horaires, coordonnées et boutons ;
- vérifier que la fiche reste utile même lorsqu'un champ est absent.

**Validation attendue :** trois fiches pilotes cohérentes sans casser le reste du site.

## Phase 3 — Moteur SEO des CV Business

- générer le HTML initial propre à chaque fiche ;
- ajouter title, meta description, canonical, robots et Open Graph individuels ;
- produire les données structurées LocalBusiness et Breadcrumb ;
- corriger les hreflang ;
- définir une règle index/noindex selon publication et richesse ;
- préparer les redirections des anciennes URL ;
- produire un sitemap entreprises propre.

**Validation attendue :** le code source initial d'une fiche contient déjà son identité et ses métadonnées avant l'exécution de React.

## Phase 4 — Raccordement à la plateforme

- réparer les requêtes métier, ville, secteur et gouvernorat ;
- utiliser les vrais champs Supabase ;
- filtrer les entreprises publiées ;
- distinguer ville exacte et gouvernorat ;
- relier chaque fiche à son métier, sa ville, son gouvernorat et son secteur ;
- corriger les pages sans résultat et éviter les pages faibles.

**Validation attendue :** les pages de la plateforme affichent les bonnes entreprises et mènent vers les URL officielles des CV Business.

## Phase 5 — Nettoyage des URL et des sitemaps

- établir la liste des anciennes URL ;
- créer les redirections permanentes vers les nouvelles URL ;
- supprimer du sitemap les tests, doublons, slugs vides et pages non publiées ;
- inclure les pages métier, ville, métier + ville, secteur et gouvernorat réellement utiles ;
- vérifier les statuts HTTP et les canonicals.

**Validation attendue :** Google reçoit une seule adresse officielle par contenu.

## Phase 6 — Repositionnement commercial

- présenter le CV Business comme produit principal ;
- présenter la plateforme comme avantage de diffusion ;
- retravailler les pages de présentation et d'abonnement ;
- préparer un discours simple pour la prospection ;
- créer les supports QR code, réseaux sociaux et démonstration client.

**Validation attendue :** un professionnel comprend immédiatement ce qu'il obtient et pourquoi cela lui est utile.

## Phase 7 — Test terrain

- déployer cinq établissements pilotes ;
- observer la compréhension du produit ;
- mesurer les partages, visites, contacts et retours ;
- vérifier l'apparition dans Google et Google Images ;
- améliorer le produit avant un lancement plus large.

**Validation attendue :** validation du besoin avant validation du paiement à grande échelle.

---

# 6. Critères de réussite du premier chantier

Le premier chantier sera considéré comme réussi lorsque :

- SKILA Mahdia possède un CV Business V2 complet ;
- la fiche classique reste utile sans recevoir gratuitement toutes les fonctions Premium ;
- la fiche pauvre est gérée proprement sans créer une page SEO faible ;
- chaque fiche possède une URL officielle unique ;
- les métadonnées sont présentes dans le HTML initial ;
- les anciennes URL peuvent être redirigées ;
- les trois fiches sont correctement reliées à la plateforme ;
- le site actuel n'a subi aucune régression.

---

# 7. Ordre de travail immédiat

1. Sécuriser la branche de travail.
2. Cartographier les champs utilisés dans BusinessDetail et Supabase.
3. Définir la structure exacte du CV Business V2.
4. Construire le prototype SKILA Mahdia.
5. Tester la fiche classique.
6. Tester la fiche pauvre.
7. Valider le produit avant de modifier les pages générales de la plateforme.

---

> Le CV Business attire, rassure et se partage.
> La plateforme Dalil Tounes organise, amplifie et crée la découverte.
