# Compte professionnel — droits, galerie et commandes

Date : 26 novembre 2026. Périmètre exclusif Dalil Tounes, suivi #209 et #294.

## Point de départ vérifié

- Site et mini-applis : `main`, PR #444, `59b98a7994141ad41cf15868b44d8a377a90aa80` ; Vercel production READY.
- PWA indépendante : `release/dalil-tounes-pwa-independent-20261114`, PR #445, `e927ef4fccb60eb9c54452dc328f606b34251213` ; Vercel production READY.
- Supabase : `kmvjegbtroksjqaqliyv`. Aucun changement Lienora France/World.
- Autorisation du propriétaire : développement, tests, fusion et déploiement des trois corrections.

## Défaut de galerie établi

Le téléversement mobile avait créé un objet Storage, mais son rattachement à `entreprise.image_url` était rejeté par la fonction déployée. Le journal Postgres indique `Image non rattachée` à 09:27:07 UTC. La définition déployée contenait des expressions régulières doublement échappées et différait du fichier de migration. Aucune limite générale à huit photos n'a été trouvée dans l'affichage.

Le compte de référence est explicitement Premium dans les deux champs commerciaux. La photo téléversée a été rattachée après recette transactionnelle : neuf photos, limite dix, les huit références d'origine conservées. Aucun nouveau tarif ni formule n'a été créé.

## Droits cohérents et conservés

| Fonction | Artisan 30 DT | Premium 59 DT |
|---|---|---|
| Photos de présentation | 5 | 10 |
| Réseaux | 2 | Les 6 réseaux pris en charge |
| Modèles | Le modèle acquis | Business et Portfolio |
| Palettes | La palette acquise | 3 |
| Ouvertures | L'ouverture acquise | A et B |

Le serveur et les éditeurs utilisent le même résolveur, fondé sur `formule_commerciale` et les anciennes valeurs reconnues de `statut_abonnement`. Une valeur générique comme Actif n'accorde aucun forfait payant. Les contradictions sont signalées à confirmer, sans changer le forfait. Les capacités historiques sont protégées dans une colonne privée de la table de modifications propriétaire existante. Remplacer/supprimer une photo ne détruit pas une capacité acquise ; aucune ancienne photo n'est supprimée automatiquement.

Les RPC vérifient l'attribution dans `professional_profile_access`, verrouillent la fiche et refusent les versions périmées. Le choix d'un second modèle/palette/ouverture Artisan et l'ajout d'un troisième réseau sont refusés côté serveur. Les choix sauvegardés et images sont protégés contre une synchronisation Airtable ancienne. Les photos de produits restent indépendantes.

## Galerie

Compteur et places restantes, contrôle avant upload, remplacement/suppression et erreur explicite. Le succès nécessite le retour attendu du RPC et une relecture de la fiche. Invalidation du cache de tous les alias de la fiche. Même liste complète dans Business et Portfolio, y compris les contenus historiques au-dessus du quota courant. Textes ajoutés FR/AR/EN/IT/RU.

## Commandes

Voir [la documentation détaillée](./dalil-merchant-order-management.md).

Un menu Actions et une rubrique repliable d'archives conservent l'interface compacte. Les commandes terminées, refusées ou annulées s'archivent et se restaurent. La suppression confirmée est limitée aux demandes refusées/annulées sans paiement ni preuve financière. Les coordonnées et notes sont effacées ; une trace minimale de référence/statut empêche de recréer une ancienne demande et conserve le suivi client final. Les commandes actives et terminées sont protégées de la suppression. Les statistiques existantes des produits/abonnés ne changent pas.

## Vérifications effectuées

- 33 contrôles PostgreSQL isolés : quotas 5/10, neuvième/dixième, dépassement, droits historiques/incertains, réseau, choix, accès étranger, persistance et protection contre synchro ancienne.
- Composants React réellement montés avec services simulés : galerie 1/5/8/9/10/12, compteur, ajouts/remplacement/suppression, refus et relecture incohérente ; 8 groupes supplémentaires sur réseaux/présentation et échecs de droits.
- 28 tests des règles et handlers commandes ; 12 groupes PostgreSQL avec migration réelle et protections financières/concurrentes.
- Supabase réel : recettes transactionnelles annulées pour la photo de référence, droits, remplacement/suppression et accès étranger ; recette commande synthétique archivage/restauration/suppression, protections et notifications. Les données réelles sont conservées.
- `npm run build` réussi. TypeScript ciblé sur les composants de compte et leurs dépendances réussi. ESLint ciblé réussi. `git diff --check` réussi.
- Le TypeScript global reste bloqué par des erreurs de syntaxe préexistantes dans `CitizensServices.tsx` et `NegotiationModal.tsx`, non chargés par la compilation de production. L'ancien test de recherche de chaînes `test-client-account-orders-cv-return.mjs` contient une assertion de libellés obsolète, sans rapport avec ces corrections.
- Aucun test sur le téléphone physique du propriétaire. L'absence de Chromium local est compensée par les tests React et les contrôles de production disponibles ; ne pas confondre avec une recette mobile authentifiée réelle.

## Mise en ligne

Migrations appliquées et fonctions `dalil-boutique-customer-submit` v10 / `dalil-boutique-merchant-orders` v5 déployées ACTIVE. Authentification du professionnel vérifiée dans la fonction, aucune ouverture directe des tables de commandes. Service worker du site augmenté à v17 ; version de build générée automatiquement. La PWA garde sa configuration indépendante.

Les PR et preuves finales Vercel (URL, SHA, READY et contrôle public) seront consignées dans les descriptions des PR et dans le dossier de suivi après leur publication. Une compilation locale ne constitue pas une preuve de production.
