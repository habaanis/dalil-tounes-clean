# Dalil Tounes — Espace professionnel compact (site public)

Date : 26 novembre 2026

## Objet

Rétablir sur le SITE `https://dalil-tounes.com/subscription` l'organisation compacte du parcours professionnel, déjà validée dans l'application installée. Il ne s'agit ni d'une réécriture de la PWA ni de la création d'un nouveau compte professionnel.

## Problème constaté

L'ancienne page du site affichait l'inscription essentielle, une longue démonstration de mini-appli et le comparatif complet Artisan/Premium dans le même flux. La PR #453 avait compacté les modèles mais n'avait pas modifié cette structure fondamentale. Le hub professionnel de la PWA est distinct et propose des rubriques compactes.

## Correction

PR #454, branche `fix/site-pro-compact-section-hub-20261126`, cible `main`.

- Première vue resserrée : titre court et quatre rubriques visibles sans dérouler toutes les sections.
- Rubriques : Inscription gratuite, Votre mini-appli, Voir les modèles, Tarifs et inscription.
- Une seule rubrique ouverte à la fois, avec ancres `#presence-essentielle`, `#cv-professionnels`, `#modeles`, `#offres` utilisables depuis le menu.
- Votre mini-appli : quatre bénéfices présentés simplement (présentation/QR, boutique/commandes, fidélité selon activation, suivi), boutons vers modèles et tarifs.
- Voir les modèles : réutilise la démonstration Business/Portfolio existante et son choix de modèle.
- Tarifs : Artisan 30 DT, Premium 59 DT, accès direct au formulaire existant, comparaison détaillée et entretien annuel dans des panneaux repliables.
- Liens vers les services complémentaires et présentation secondaire restent dans leur parcours existant; ne pas ajouter une longue succession de cartes sur l'accueil Pro.
- Contenu FR/AR avec libellés multilingues de navigation.

## Conservation et limites

- Conserver `EssentialPresence`, `CvBusinessHome`, `SubscriptionRequestForm`, et le circuit paiement/activation du site (#440, #451).
- Aucune modification du prix commercial, du backend Supabase, des mini-applis clientes ou de la branche indépendante de la PWA.
- La formule Premium et Artisan conservent leurs droits définis par les règles métier existantes.
- La compilation Vercel valide le code, mais la recette visuelle sur téléphone doit être distinguée de la vérification technique.

## Règle de maintenance

Avant toute intervention ultérieure sur l'espace professionnel, consulter #419 (ancienne proposition site non fusionnée), #420 (PWA), #453 (harmonisation partielle site) et #454 (rubriques compactes site). Ne pas remettre les versions longues, ni dupliquer le formulaire ou le comparatif des offres.
