# Harmonisation des pages publiques — complément dépendant de #198

Base validée : 3b6e3d6a9ce43abbd3e7b5a88fd68bcd56d67999.
Branche : style/public-pages-premium. Ne pas fusionner avant validation visuelle.

41 implémentations de pages examinées : 39 modifiées directement et 2 annuaires via BusinessDirectory. Neuf composants partagés modifiés, une politique de périmètre et une feuille commune étendue.

Familles : santé, commerces, services citoyens, éducation, loisirs, thermalisme, guides touristiques ; recherche et résultats ; métiers, spécialités, villes, secteurs et gouvernorats ; entreprises certifiées ; emploi et formulaires ; partenaires et besoins professionnels ; blog et pages légales. L’accueil, Citoyens, Tourisme, Abonnement et les parcours CV commerciaux validés dans #198 restent la référence.

Les titres opt-in public-title/public-heading n’affectent pas les modèles CV embarqués. Les exclusions de routes protègent CV, QR, alias clients, hôtes dédiés, administration et démonstrations. Les composants SEO changent uniquement de classes de présentation : métadonnées et JSON-LD inchangés.

Aucune modification de requête, classement, tarif, traduction ou gestionnaire d’envoi. Les CV clients, palettes, mini-apps, données et automatisations ne sont pas modifiés.

## Validation en cours
- Tests de séparation de styles : 2/2.
- Tests de régression PR197 : 4/4.
- Premier build complet réussi (9148 routes SEO, 369 fiches HTML lors de cette lecture).
- TypeScript : sortie identique à la base #198 ; dette historique non corrigée.
- ESLint src : 361 erreurs et 44 avertissements avant/après, à comparer au périmètre exact (pas le lint global).
- Contrôles visuels et prévisualisation : en cours. Aucun verdict de fusion à ce stade.
