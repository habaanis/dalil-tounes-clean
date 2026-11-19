# Recette Boutique — Aux Saveurs d'Anis, fêtes 2026 (fixture non publiée)

Source : menu transmis par le propriétaire le 16/11/2026. **Aucune entrée du catalogue réel, aucune commande ni paiement créé par ce document.**

## Référentiel source en euros

| Catégorie | Article | EUR |
|---|---|---:|
| Entrée | Œuf poché, saumon fumé, champignons, pommes de terre | 11,50 |
| Entrée | Pain brioché façon pain perdu, foie gras, figues | 14,00 |
| Entrée | Poireaux fondants, dés de foie gras, noisettes | 14,00 |
| Entrée | Duo de croquettes bleu d'Auvergne & crevette | 12,00 |
| Plat | Poisson de saison rôti | 18,50 |
| Plat | Cuisse de canard confite | 21,00 |
| Plat | Joue de bœuf confite | 21,00 |
| Fromage | Croustillant de chèvre chaud | 9,50 |
| Fromage | Assiette de trois fromages | 8,50 |
| Dessert | Riz au lait, caramel beurre salé | 7,50 |
| Dessert | Pomme confite façon tatin | 8,00 |
| Dessert | Mousse au chocolat noir | 8,00 |
| Formule | Menu de fêtes : amuse-bouches + 1 entrée + 1 plat + 1 dessert | 41,00 |
| Formule | Menu complet : amuse-bouches + 1 entrée + 1 plat + 1 fromage + 1 dessert | 47,00 |

Réservation indiquée **avant le 18 décembre**, millésime à confirmer avant publication. Coordonnées et conditions de retrait/livraison à confirmer séparément.

## Scénarios contrôlables

- [x] Source structurée : 12 plats à l'unité et 2 formules, 4 catégories.
- [x] Arithmétique hors ligne : 2 menus de fêtes = 82 EUR ; 3 menus complets = 141 EUR ; un de chaque = 88 EUR ; 2 canards = 42 EUR.
- [ ] Affichage catalogue réel : uniquement les articles approuvés, jamais les brouillons.
- [ ] Formule : choix obligatoires de l'entrée, du plat et du dessert ; fromage obligatoire pour la formule complète.
- [ ] Refuser l'envoi d'une formule avec un choix manquant ; inclure les choix dans la référence de commande et son empreinte d'idempotence.
- [ ] Rejouer la même référence après coupure réseau sans doublon ; si changement de choix, répondre conflit 409.
- [ ] Tester deux comptes commerçants distincts et la séparation de leurs commandes.
- [ ] Vérifier la date limite et une politique explicite de retrait/livraison.
- [ ] Vérifier acompte ou paiement intégral via prestataire autorisé ; ne jamais déclarer payé via WhatsApp.
- [ ] Tester RLS, migrations, Edge Functions et secrets en environnement sûr avant la production.

## Bloqueur de devise

La fonction serveur actuelle `dalil-boutique-customer-submit` rejette toute devise autre que `TND`, tandis que le menu français est en **EUR**. **Ne jamais convertir silencieusement ni présenter 41 EUR comme 41 TND.** Prévoir un modèle de devises par établissement et une intégration de paiement adaptée, avec tests et migration validés, avant tout usage réel de cette fixture.

## État de production

Cette recette ne débloque pas les PR #282 à #286. Les vérifications précédentes n'ont trouvé aucune table de commandes ni les deux Edge Functions de commande en production ; les 18 tests existants de la PR #286 sont simulés. Le scénario des menus ci-dessus est un complément de recette, pas un feu vert pour l'encaissement.
