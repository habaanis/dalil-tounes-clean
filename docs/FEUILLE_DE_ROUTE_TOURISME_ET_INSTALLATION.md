# Dalil Tounes — Feuille de route produit (29 octobre 2026)

## Décision validée — « Visiter autrement »
Conserver les fiches, modèles et parcours existants, sans reconstruction ni doublons.
1. Terminer l'enrichissement et la vérification des expériences locales de Siliana, Kasserine puis Gafsa; priorité aux personnes, artisans, agriculteurs, guides et producteurs, avec sources fiables et contacts vérifiables.
2. Améliorer progressivement le parcours actuel : découverte par gouvernorat et type d'expérience, sans saisie inutile.
3. Distinguer clairement les statuts « expérience confirmée » (preuve récente), « contacter avant la visite » (pas de visite garantie) et « établissement référencé ».
4. Améliorer les fiches avec photographies authentiques réutilisables, contexte de la rencontre, coordonnées, informations pratiques sourcées; ne jamais inventer prix, horaires, durées ou possibilités de visite.
5. Proposer des découvertes pertinentes à proximité et des itinéraires, puis des favoris et du partage mobile, enfin mesurer vues et clics utiles, dans le respect de la confidentialité.
6. Pas de réservation ni paiement en ligne à court terme. Préserver la simplicité mobile et les cinq langues FR/AR/EN/IT/RU.

## Carte GPS « autour de moi » : EXISTANTE — ne pas recréer
- Routes déjà branchées : /around-me et /autour-de-moi dans src/AppRouter.tsx.
- Page existante : src/pages/AroundMe.tsx, basée sur React Leaflet / OpenStreetMap, geolocation navigateur, marqueurs et directions Google Maps.
- Audit fonctionnel à effectuer avant tout changement : source Supabase, coordonnées réelles, filtres des fiches approuvées/publiées, permissions de localisation, accès depuis les rubriques Tourisme et S'installer.
- Pour « Visiter autrement », réutiliser ce composant/cette page et connecter uniquement les expériences locales publiées avec coordonnées fiables. Ne pas créer une deuxième carte.

## Phase suivante après tourisme : « S'installer en Tunisie »
Réutiliser les fiches Dalil Tounes existantes dans les rubriques logement, formalités, banque/assurances, santé, éducation, transport, travail/entrepreneuriat et vie quotidienne, avec « une entreprise, plusieurs rubriques ». Classer par ville/gouvernorat et besoin ; éviter les doublons, vérifier l'information administrative et utiliser la carte « autour de moi ».

## Règles permanentes de réalisation
Avant toute création/modification : auditer Airtable, Supabase, GitHub, Vercel et les fonctions existantes.
Ne pas publier les brouillons faute de preuve actuelle de visite; garder les contacts à confirmer.
Ne pas prétendre qu'une modification est en production sans vérifier le déploiement.
Maintenir un bilan des travaux terminés et des dépendances restantes.
