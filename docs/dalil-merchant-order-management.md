# Dalil Tounes — archivage et suppression des demandes

Implémentation du 26 novembre 2026, limitée aux commandes Boutique existantes.

## Comportement

- La liste principale contient les demandes non archivées et non supprimées. Le menu compact « Actions » apparaît dès qu'une action de gestion est disponible.
- Une commande terminée, refusée ou annulée peut être archivée. « Commandes archivées » est repliable; la restauration la remet dans la liste principale sans modifier son statut.
- Une demande reçue ou en cours peut être supprimée directement avec « Actions → Supprimer », sans annulation manuelle préalable. Une seule confirmation et un seul appel serveur annulent et retirent la demande des listes. Le suivi client affiche alors « Annulée ».
- Une demande refusée ou annulée peut aussi être supprimée, en conservant son statut final. Toute suppression exige la confirmation explicite qu'il s'agit d'un test, d'un doublon ou d'une demande sans transaction à conserver. Les paiements en attente, partiellement payés, payés ou remboursés, les montants encaissés et toute preuve de paiement interdisent cette suppression.
- Une commande confirmée ne propose pas la suppression directe ; son traitement existant (terminer ou annuler) est conservé.
- Une commande terminée reste conservée et archivable, même sans paiement enregistré : le règlement peut avoir eu lieu directement entre le client et le professionnel.
- La suppression retire définitivement la demande des listes du professionnel, efface son nom, son contact et sa note et retire son abonnement de notification. Une référence minimale, le statut final, la clé d'idempotence et l'empreinte privée restent conservés dans la ligne existante. Le suivi client conserve donc le refus/l'annulation. Une relance technique de l'ancien envoi retourne HTTP 410 et ne recrée aucune demande.
- Les listes et archives ont chacune leur pagination par 50 demandes. Les statistiques existantes de produits/abonnements restent inchangées; les compteurs de la liste excluent les demandes supprimées. Toute future statistique de demandes devra filtrer `deleted_at is null`.

## Autorisation et intégrité

`dalil-boutique-merchant-orders` conserve l'authentification via `auth.getUser(token)` et vérifie `professional_profile_access`. Le nouvel RPC `dalil_merchant_manage_order` est `SECURITY INVOKER` et exécutable seulement par `service_role`. Le professionnel ne peut pas choisir un autre acteur : l'Edge Function transmet l'identité vérifiée, jamais un identifiant utilisateur fourni dans le JSON.

Le RPC revérifie l'accès, verrouille la ligne, compare `updated_at`, puis contrôle l'état et les preuves de paiement avant de modifier. La suppression d'une demande reçue/en cours passe son statut à `cancelled` dans le même `UPDATE` que l'anonymisation et les marqueurs de suppression. Les contraintes SQL restent inchangées : elles interdisent les marqueurs d'archive sur une demande active et les marqueurs de suppression sans anonymisation ni garanties de paiement. Le journal privé conserve l'acteur, la référence, l'action et la date, sans recopier les coordonnées. Une confirmation concurrente empêche une suppression fondée sur une ancienne révision ; une suppression déjà effectuée empêche toute confirmation tardive.

Le trigger de l'abonnement de notification verrouille/vérifie la commande : une soumission initiale concurrente ne peut pas recréer cet abonnement après suppression.

## Sources reprises

Les sources de deux fonctions déjà déployées n'étaient pas dans `main`. Elles ont été récupérées du projet Dalil avant modification :

- `dalil-boutique-merchant-orders`, version 4, SHA-256 `73dd71637b88da45e6783e76ab64f1bf94c87eac11be52ca5fa035aa0f309a09`.
- `dalil-boutique-customer-submit`, version 9, SHA-256 `853ebef48c3ab11f60a252ea0a0410c06f1df9a55815b52a6c3dd09ad6b1d35b`.

Le comportement public de création, les validations, l'antispam, les notifications et les statuts existants sont conservés. La fonction `dalil-boutique-customer-status` n'a pas à être redéployée : elle retrouve la référence et le statut final, avec la note effacée après suppression.

## Mise en service initiale et évolution directe

1. Appliquer `20261126095355_dalil_merchant_order_archive_delete.sql`.
2. Déployer `dalil-boutique-customer-submit` (`verify_jwt=false`), source `index.ts`.
3. Déployer `dalil-boutique-merchant-orders` (`verify_jwt=false`), sources `index.ts` et `order-policy.ts`.
4. Déployer le compte partagé sur `main` (site/mini-applis). La PWA indépendante ouvre ce même compte ; elle ne duplique pas le composant de commandes.

Aucune commande existante n'est archivée ou supprimée par la migration.

Pour l'évolution de suppression directe du 26 novembre : appliquer ensuite `20261126104230_dalil_merchant_order_direct_delete.sql`, redéployer seulement `dalil-boutique-merchant-orders` avec ses deux sources (`verify_jwt=false`, authentification interne conservée), puis publier le composant sur `main` avec le service worker v18. La migration remplace le RPC sans changer de table, de contrainte ni de droits. Les fonctions de création et de suivi client restent compatibles et n'ont pas à être redéployées. Aucun redéploiement de la PWA indépendante n'est nécessaire.

## Vérification reproductible

- `node scripts/test-merchant-order-management.mjs` : 31 tests de protections et des véritables handlers avec services simulés, sans requête externe.
- `PGLITE_MODULE=/chemin/vers/@electric-sql/pglite/dist/index.js node scripts/test-merchant-order-management-sql.mjs` : 16 contrôles regroupés dans un PostgreSQL isolé ; exécution des deux migrations réelles et du scénario complet de la ligne suivante, sous rôle `service_role`.
- `supabase/tests/dalil_merchant_order_management.sql` : scénario transactionnel, nouvelles fixtures seulement, prenant Aux Saveurs d'Anis comme référence. Suppressions reçue/en cours pour commandes et devis ; accès étranger, révision périmée et confirmation absente refusés sans modification ; 16 combinaisons statut/paiement protégées ; commandes confirmées/terminées protégées ; archivage, restauration, anonymisation atomique, référence/idempotence, suppression du Push et refus de réabonnement. Comparaison intégrale des commandes réelles avant/après, puis `ROLLBACK`.
- `node scripts/boutique-order-actions.test.mjs` : huit groupes React réellement montés avec services simulés (menu, confirmation acceptée/refusée, appel unique, protection financière et statuts, archives/restauration, erreurs sans faux succès et double envoi). Le runtime React de test peut être fourni hors dépôt via `DALIL_QA_RUNTIME`.
- ESLint ciblé sur `BoutiqueCustomerOrders.tsx`.

Ces vérifications de code et de base isolée ne constituent pas, à elles seules, une preuve de déploiement ni un test sur le téléphone du propriétaire. Le suivi de chantier doit préciser les contrôles réels effectués après mise en service.
