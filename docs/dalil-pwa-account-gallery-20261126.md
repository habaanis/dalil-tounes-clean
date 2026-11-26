# Dalil Tounes PWA — photos et compte professionnel

## Correctif du 26 novembre 2026

Portage ciblé des corrections publiques de la [PR #446](https://github.com/habaanis/dalil-tounes-clean/pull/446), commit source `9ab873932b3a9bed6bfac3ee2083a3304b8b431d`, sur la branche indépendante `release/dalil-tounes-pwa-independent-20261114`.

- Les galeries Business et Portfolio conservent toutes les photos de présentation enregistrées, y compris les neuvième et dixième photos et les photos historiques.
- Le même parseur traite les anciens séparateurs de photos et conserve les virgules présentes dans les noms de fichiers.
- La formule commerciale est reconnue lorsque le statut d’abonnement est générique, par exemple « Actif ».
- Le service worker passe de `v27` à `v28` pour renouveler les ressources installées.

## Architecture conservée

Le tableau de bord PWA continue d’ouvrir le compte partagé sur `https://app.dalil-tounes.com/{identifiant}/compte`, conformément à la PR #445. Le compte, ses quotas côté serveur, l’import de photos et l’archivage/suppression des commandes sont corrigés dans la PR #446 et les fonctions Supabase associées; aucun second compte n’est créé dans la PWA.

Les particularités de navigation, de référencement et de présentation de cette branche PWA sont conservées. Le quota de présentation ne s’applique pas aux photos des produits de la Boutique.

## Vérification

`node scripts/test-pwa-gallery.mjs` vérifie le parseur et les données transmises aux deux modèles pour 1, 5, 8, 9, 10 et 12 photos, ainsi que la reconnaissance des formules Artisan et Premium. Le compte partagé reste dans son composant PWA existant. Les preuves de build, de fusion et de déploiement sont consignées dans le suivi du chantier.

Contrôles locaux : compilation complète `npm run build` réussie, tests de galerie réussis et ESLint ciblé réussi. Le contrôle TypeScript global rencontre des erreurs de syntaxe préexistantes dans d’autres composants. La compilation TypeScript ciblée présente exactement les mêmes huit diagnostics avant et après le portage; aucun diagnostic nouveau n’est ajouté. Les fichiers générés dans `dist` sont exclus du correctif.
