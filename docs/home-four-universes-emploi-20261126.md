# Dalil Tounes — Accueil : quatre univers (26/11/2026)

## Décision validée

Accueil public du site `https://dalil-tounes.com/` : conserver le bloc de recherche, les compteurs du réseau, les services repliables et toutes les sections existantes. Dans la grille des univers seulement, afficher quatre cartes :

1. Citoyens → `/citizens`
2. Tourisme & Expat → `/citizens/tourism`
3. Entreprises → `/subscription`
4. Emploi → `/jobs`

Disposition : **2 × 2 sur téléphone**, **4 colonnes sur grand écran**. Même composant visuel et même palette que les trois cartes précédentes. Ajouter les traductions FR/AR/EN/IT/RU. L'Emploi n'est pas un nouveau bloc distinct et la recherche générale reste prioritaire.

## Compteur emploi

**Pas de compteur pour le moment.** Ne jamais afficher de nombre d'offres fictif, ancien ou expiré. Un éventuel compteur ultérieur devra utiliser uniquement les offres validées, publiées, non expirées et réellement accessibles depuis la rubrique. Le chantier de collecte et de validation des annonces est indépendant.

## Références techniques

- Route d'accueil actuelle : `src/pages/SeparationPreview.tsx` (`PlatformHome`)
- Traductions et cartes : `src/lib/siteStructureCopy.ts`
- Route emploi existante : `/jobs` vers `Jobs` (réutilisée, sans modification)
- Branche site `main`, application indépendante non modifiée
- Correction réalisée via branche `feat/home-four-universes-jobs-20261126`; conserver la structure existante, sans recréer le design.
