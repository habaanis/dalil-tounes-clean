# Dalil Tounes — archivage et suppression des demandes

Implémentation du 26 novembre 2026, limitée aux commandes Boutique existantes.

## Comportement

- La liste principale contient les demandes non archivées et non supprimées. Les demandes reçues, en cours et confirmées restent protégées.
- Une commande terminée, refusée ou annulée peut être archivée. « Commandes archivées » est repliable; la restauration la remet dans la liste principale sans modifier son statut.
- Une demande refusée ou annulée peut être supprimée après confirmation explicite qu'elle est un test, un doublon ou une demande sans transaction à conserver. Les paiements en attente, partiellement payés, payés ou remboursés, les montants encaissés et toute preuve de paiement interdisent cette suppression.
- Une commande terminée reste conservée et archivable, même sans paiement enregistré : le règlement peut avoir eu lieu directement entre le client et le professionnel.
- La suppression retire définitivement la demande des listes du professionnel, efface son nom, son contact et sa note et retire son abonnement de notification. Une référence minimale, le statut final, la clé d'idempotence et l'empreinte privée restent conservés dans la ligne existante. Le suivi client conserve donc le refus/l'annulation. Une relance technique de l'ancien envoi retourne HTTP 410 et ne recrée aucune demande.
- Les listes et archives ont chacune leur pagination par 50 demandes. Les statistiques existantes de produits/abonnements restent inchangées; les compteurs de la liste excluent les demandes supprimées. Toute future statistique de demandes devra filtrer `deleted_at is null`.

## Autorisation et intégrité

`dalil-boutique-merchant-orders` conserve l'authentification via `auth.getUser(token)` et vérifie `professional_profile_access`. Le nouvel RPC `dalil_merchant_manage_order` est `SECURITY INVOKER` et exécutable seulement par `service_role`. Le professionnel ne peut pas choisir un autre acteur : l'Edge Function transmet l'identité vérifiée, jamais un identifiant utilisateur fourni dans le JSON.

Le RPC revérifie l'accès, verrouille la ligne, compare `updated_at`, puis contrôle l'état et les preuves de paiement avant de modifier. Les contraintes SQL interdisent également les marqueurs d'archive sur une demande active et les marqueurs de suppression sans anonymisation ni garanties de paiement. Le journal privé conserve l'acteur, la référence, l'action et la date, sans recopier les coordonnées.

Le trigger de l'abonnement de notification verrouille/vérifie la commande : une soumission initiale concurrente ne peut pas recréer cet abonnement après suppression.

## Sources reprises

Les sources de deux fonctions déjà déployées n'étaient pas dans `main`. Elles ont été récupérées du projet Dalil avant modification :

- `dalil-boutique-merchant-orders`, version 4, SHA-256 `73dd71637b88da45e6783e76ab64f1bf94c87eac11be52ca5fa035aa0f309a09`.
- `dalil-boutique-customer-submit`, version 9, SHA-256 `853ebef48c3ab11f60a252ea0a0410c06f1df9a55815b52a6c3dd09ad6b1d35b`.

Le comportement public de création, les validations, l'antispam, les notifications et les statuts existants sont conservés. La fonction `dalil-boutique-customer-status` n'a pas à être redéployée : elle retrouve la référence et le statut final, avec la note effacée après suppression.

## Ordre de mise en service

1. Appliquer `20261126095355_dalil_merchant_order_archive_delete.sql`.
2. Déployer `dalil-boutique-customer-submit` (`verify_jwt=false`), source `index.ts`.
3. Déployer `dalil-boutique-merchant-orders` (`verify_jwt=false`), sources `index.ts` et `order-policy.ts`.
4. Déployer le composant partagé sur les branches site/mini-applis et PWA.

Aucune commande existante n'est archivée ou supprimée par la migration.

## Vérification reproductible

- `node scripts/test-merchant-order-management.mjs` : 28 tests de protections et des véritables handlers avec services simulés, sans requête externe.
- `PGLITE_MODULE=/chemin/vers/@electric-sql/pglite/dist/index.js node scripts/test-merchant-order-management-sql.mjs` : 12 contrôles regroupés dans un PostgreSQL isolé; exécution de la migration réelle et du scénario complet de la ligne suivante, sous rôle `service_role`.
- `supabase/tests/dalil_merchant_order_management.sql` : scénario transactionnel, nouvelles fixtures seulement, prenant Aux Saveurs d'Anis comme référence. Accès refusé hors établissement, révision périmée, neuf combinaisons état actif/action, quatre états de paiement protégés, conservation des commandes terminées, archivage, restauration, confirmation, anonymisation, référence/idempotence, suppression du Push et refus de réabonnement. Toujours terminé par `ROLLBACK`.
- ESLint ciblé sur `BoutiqueCustomerOrders.tsx`.

Ces vérifications de code et de base isolée ne constituent pas, à elles seules, une preuve de déploiement ni un test sur le téléphone du propriétaire. Le suivi de chantier doit préciser les contrôles réels effectués après mise en service.
