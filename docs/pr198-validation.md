# PR #198 — trois correctifs après fusion #197
Date : 2026-11-10. Base main : 81c77ffafd38f7e9e59fabcc8f7dd605b73afb62.
Branche unique : fix/post197-ivoire-accueil-ouverture.
Commit applicatif contrôlé : 68c41be618e1a9ab3c5256f5fa05f60bca414b42.

## Résultat
PRÊT À FUSIONNER pour ces trois changements de présentation, sous réserve de validation du propriétaire. Aucune fusion ni publication en production effectuée.

## Historique et modifications
- Les styles Ivoire & Or validés se trouvent dans CvProfessionalLanding.tsx sur ux/pilote-accueil-professionnels-compact-20261106 : c3dd5ff536f3a12552e800b3dc5a0b54f124e1db (cartes/offre), 0dc3f5e225b59cc79769632d546ce261029afea6 (contraste), conservés dans e5df8063fd23934d56b0b1c5caa0fbc4b468c2f2. Couleurs adaptées aux composants actuels sans importer l'ancienne page ou ses conditions.
- Subscription : cartes de création, encart de bienvenue, prix de maintenance, sélection de formule harmonisés ivoire/or/prune. Concept fusionné, accordéons, tarifs et commandes conservés.
- Accueil : accroche demandée, texte visibilité/confiance/partage et deux liens vers /subscription#presence-essentielle et /subscription#modeles. Ajout traduit FR/AR/EN/IT/RU. Recherche, compteur et cinq informations gratuites inchangés.
- Ouverture de la plateforme : CSS partagé avec /apercu-ouverture-prestige ; à partir de 1024 px, hauteur min(70dvh, 640px), proportions conservées. Mobile inchangé. ClientOpeningSplash et BusinessQr non modifiés.

## Vérifications
| Contrôle | Résultat |
|---|---|
| npm run build | PASS |
| node --test scripts/pr197-regressions.test.mjs | 4/4 |
| smoke-site-structure.mjs sur Vercel | 10/10 |
| smoke-public-routes.mjs sur Vercel | 16/16 |
| ESLint fichiers modifiés | 0 erreur ; 4 avertissements Fast Refresh préexistants |
| TypeScript global | 202 erreurs historiques, diagnostic identique au témoin (SHA256 de09bf78f55320860f24bc6f46bfbccdc89b0c8393f925664bed9bd33c613db5) |
| ESLint global | 363 erreurs, 44 avertissements ; comparaison normalisée avec témoin post-197 : aucune différence |
| Textes commerciaux | AST des cinq objets de contenu identique à main |
| Formulaires / CV / QR | fichiers de logique identiques à main |
| Accueil FR ordinateur / AR mobile | accroche, 2 CTA, cinq infos et compteur 2 476 observés ; AR RTL, aucun débordement à 390 px |
| Subscription FR mobile/ordinateur, AR ordinateur | modèles, accordéons et cartes lisibles ; 3 palettes présentes ; aucun débordement à 1440 px |
| Parcours Business / Portfolio | formulaire ouvert avec Artisan 30 TND + Business, puis Premium 59 TND + Portfolio, palette conservée |
| Inscription gratuite FR/AR | page et champs dont horaires accessibles ; aucune soumission effectuée |
| Ouverture desktop/mobile | image 360 × 640 à 1440 × 1000 ; mobile 390 × 844 à 390 × 844, object-fit contain |
| CV existant | Academy Arrachida Group chargé sur preview : présentation, actions, partage, contacts et lien mini-app présents |
| Console du parcours contrôlé | aucune erreur capturée |

## Limites explicites
Le contrôle visuel de l'ouverture utilise la route d'aperçu partageant le CSS du composant installé ; lancement natif de la PWA non rejoué. Pas de nouvel envoi de formulaire ni paiement réel, pas d'écriture Airtable/Supabase. Le CV client a été vérifié en lecture ; pas de recette exhaustive de toutes les fiches ou de toutes les actions externes. Les autres langues disposent des nouvelles traductions, mais la recette visuelle porte sur FR/AR. Les délais ponctuels du navigateur ont été contournés par les liens visibles ; pas de régression applicative confirmée.

## Dette technique hors périmètre
Les 202 diagnostics TypeScript et 363 erreurs ESLint globales préexistent et ne sont pas réparés dans cette PR. Les quatre avertissements Fast Refresh du sélecteur de modèles préexistent également.

## Prévisualisation
https://dalil-tounes-clean-516qz7b76-haba-anis-projects.vercel.app
Déploiement READY dpl_4igtzByXFLQQEKcPGwKYdkLJTjVp du commit applicatif ci-dessus.
