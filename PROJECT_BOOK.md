# 📖 Dalil Tounes Project Book

Version : 1.0

---

# Bienvenue

Ce dossier constitue la documentation officielle de Dalil Tounes.

Il rassemble l'ensemble des informations nécessaires pour comprendre le projet, son fonctionnement, sa vision, son évolution et ses choix techniques.

Ce Project Book est destiné à devenir la référence principale du projet.

Il est utilisé pour :

- documenter le développement ;
- conserver les décisions importantes ;
- accompagner les futurs développeurs ;
- préparer les dossiers incubateurs et investisseurs ;
- structurer la roadmap produit ;
- préserver la vision du projet.

---

# Qu'est-ce que Dalil Tounes ?

Dalil Tounes est la vitrine numérique de l'économie tunisienne.

La plateforme permet aux entreprises, artisans, commerçants, professions libérales et citoyens de se rencontrer grâce à une plateforme moderne de visibilité, de référencement et de mise en relation.

L'objectif n'est pas uniquement de référencer des entreprises.

L'ambition est de construire progressivement l'écosystème numérique professionnel de la Tunisie.

---

# Vision

Dalil Tounes souhaite devenir la plateforme de référence permettant de connecter les entreprises tunisiennes, leurs partenaires, leurs clients et leurs futurs collaborateurs.

Le projet évoluera progressivement :

- Annuaire professionnel
- Référencement SEO national
- Centre d'affaires
- Marketplace B2B
- Plateforme de mise en relation
- Outils numériques pour les entreprises

---

# Les piliers du projet

Le projet repose sur plusieurs grands piliers.

## Citoyens

Permettre aux visiteurs de trouver rapidement une entreprise ou un professionnel.

---

## Entreprises

Améliorer la visibilité numérique des entreprises tunisiennes.

---

## SEO

Créer le plus grand réseau de pages locales et métiers de Tunisie.

---

## Centre d'affaires

Créer un environnement favorisant les échanges professionnels.

---

## Innovation

Développer progressivement des outils modernes répondant aux besoins des entreprises.

---

# Organisation du Project Book

Le Project Book est organisé en plusieurs chapitres.

[01 - Vision](docs/project-book/01-vision.md)

Mission, vision, valeurs.

[02 - Produit](docs/project-book/02-produit/publication-besoins-professionnels.md)

Présentation générale de Dalil Tounes.

- [Publication de besoins professionnels](docs/project-book/02-produit/publication-besoins-professionnels.md)

03 - Pages

Documentation détaillée de chaque page.

04 - Technique

Architecture, SEO, Supabase, Vercel, GitHub.

- [Internationalisation](#internationalisation)
- [Checklist obligatoire avant validation d'une fonctionnalité](#checklist-obligatoire-avant-validation-dune-fonctionnalité)

05 - Business

Lean Startup, Business Model, Positionnement.

06 - Décisions

Historique des décisions importantes.

07 - Roadmap

Évolution du projet.

08 - Audit

Audits techniques réalisés avec Codex.

09 - Idées

Toutes les idées du projet.

10 - Histoire

L'histoire complète de Dalil Tounes.

---

# Philosophie

Chaque nouvelle fonctionnalité importante devra suivre cette méthode :

1. Définition du besoin
2. Documentation
3. Validation
4. Développement
5. Tests
6. Déploiement
7. Mise à jour du Project Book

---

# Règles

Le Project Book est un document vivant.

Chaque évolution importante du projet devra être documentée.

Aucune idée importante ne doit être perdue.

---

# Internationalisation

Toutes les nouvelles pages, tous les formulaires, tous les boutons, tous les messages de confirmation, toutes les erreurs et toutes les nouvelles fonctionnalités doivent être entièrement compatibles avec le système de traduction de Dalil Tounes.

Les langues à supporter sont :

- Français
- Arabe
- Anglais
- Italien
- Russe

Aucun texte ne doit être codé en dur dans les composants React.

Toutes les chaînes doivent être ajoutées au système de traduction existant afin de garantir une expérience identique dans toutes les langues de la plateforme.

---

# Checklist obligatoire avant validation d'une fonctionnalité

Avant de considérer une fonctionnalité terminée, vérifier systématiquement :

- Fonctionnement sur mobile et desktop
- Traductions (FR / AR / EN / IT / RU)
- SEO si la page est publique
- Accessibilité
- Responsive
- Messages de confirmation
- Messages d'erreur
- Vérification Supabase
- Vérification des permissions (RLS)
- Compatibilité avec les composants existants

---

# Objectif

Construire, documenter et faire évoluer la plateforme numérique de référence dédiée à l'économie tunisienne.
