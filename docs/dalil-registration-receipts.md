# Dalil — réception fiable des demandes de création

## Portée

Le formulaire existant conserve ses trois étapes et les tarifs validés : Artisan 30 TND, Premium 59 TND, création de logo facultative 20 TND, première année incluse puis entretien facultatif 50 TND/an. L’enregistrement d’une demande ne confirme ni paiement, ni droits achetés, ni publication.

Le point d’entrée reste `submit-company-registration`. Sa base est le code déployé v11. La notification part de `notify-form` v7, la synchronisation Airtable de `sync-suggestion-to-airtable` v26. Les règles Emploi déjà présentes dans le helper Airtable déployé sont conservées. Aucun dossier historique n’est transformé en formule supposée.

## Reçu et dossier structuré

Le client accepte la réussite seulement si la réponse contient `success: true` et l’UUID du dossier réellement enregistré. Il affiche cette référence. Le serveur refuse explicitement les soumissions antispam (`422 submission_rejected`), la limite de fréquence (`429 rate_limited`, `Retry-After: 600`) et la réutilisation d’une tentative avec un contenu différent (`409 request_conflict`).

Le client garde un ID de tentative pendant les reprises. `request_id` est unique, distinct de l’ID du dossier. Les anciens identifiants textuels sont convertis en UUID déterministe. Une empreinte du contenu normalisé, sans le temps écoulé, empêche de confirmer un autre dossier sous la même tentative. L’ancienne déduplication approximative par titre/contact est remplacée : elle pouvait masquer un dossier différent.

`creation_dossier` conserve le snapshot v1 normalisé : identité, formule demandée, assistance, modèle/palette/ouverture, adresse et horaires, liens Maps/avis/logo/photos, prestations, description, notes et préférences. Les montants sont calculés au serveur. Les quotas de cinq/dix photos et deux réseaux Artisan sont contrôlés au serveur. Le texte historique est conservé ; Airtable accepte désormais 20 000 caractères pour inclure un dossier de 10 000 caractères et ses en-têtes.

Les anciens clients sans JSON structuré restent recevables avec `creation_dossier = null`. Leur traitement exige une révision explicite. `requester_user_id` provient exclusivement de `auth.getUser` sur le JWT reçu, jamais du corps de la requête. Le transport de preview transmet aussi le JWT utilisateur et applique la limite de 65 536 octets de l’Edge.

## Transmission et reprise

La RPC privée `dalil_registration_store` enregistre le dossier et deux jobs (Airtable, notification) dans une seule transaction. Une concurrence sur la même tentative donne un seul dossier. La limite de trois demandes par contact/source sur dix minutes est sérialisée également.

Chaque canal possède son propre statut dans `integration_status` : `pending`, `running`, `ok`, `failed` ou `unknown`, avec compteur de tentatives, date et code d’erreur. Les RPC privées `claim_delivery` et `finish_delivery` utilisent une lease de deux minutes et un jeton unique. Un ancien jeton ne peut écraser un résultat plus récent.

La reprise administrateur utilise `POST /functions/v1/retry-company-registration-integrations`, corps `{ "id": "UUID-du-dossier" }`, avec le JWT d’un administrateur. Le handler vérifie l’utilisateur puis `dalil_registration_is_admin()`. Seuls les jobs `pending` ou `failed` sont repris ; les canaux déjà réussis et les notifications inconnues sont ignorés. Le résultat contient `integration_status` pour rafraîchir l’interface.

`dalil_registration_refresh_delivery_status` ne fait aucun envoi. Elle expire les leases interrompues : Airtable devient `failed`, une notification devient `unknown`. Elle peut être appelée depuis la liste administrative protégée. Les anciens dossiers sans jobs gardent leur historique inconnu et ne sont pas rejoués.

Pour les demandes de création, `notify-form` n’accepte qu’un jeton de job privé valide, puis relit le payload figé en base. Le contenu et la date du mail restent identiques entre les tentatives, avec la clé fournisseur `dalil-registration/<id>/admin-v1`. Les autres utilisateurs existants de `notify-form` conservent leur chemin.

Resend conserve ses clés d’idempotence pendant 24 heures et exige un payload identique : [documentation fournisseur](https://resend.com/changelog/idempotency-keys). Le code ne considère pas cette fenêtre comme une garantie permanente : un résultat incertain (timeout, conflit ou réponse fournisseur sans confirmation) devient `unknown` et n’est pas renvoyé automatiquement. Il faut contrôler l’acceptation chez le fournisseur avant de décider d’un nouvel envoi. Un rejet certain peut être repris.

Les échecs secondaires ne font pas disparaître le reçu déjà enregistré. L’utilisateur reçoit sa référence et le dossier reste récupérable côté administration. Une réponse fournisseur sans identifiant de confirmation ne suffit jamais à marquer une transmission `ok`.

## Déploiement et vérification

Appliquer `20261126111211_dalil_registration_receipt_integrations.sql` avec les migrations du circuit administratif avant de déployer les handlers. Déployer `submit-company-registration`, `notify-form`, `retry-company-registration-integrations` et `sync-suggestion-to-airtable` avec leurs helpers, en conservant `verify_jwt = true`.

Les nouvelles colonnes et les jobs ne sont pas insérables par `anon`/`authenticated`. Le droit d’insertion sur les anciennes colonnes est conservé pour les autres formulaires publics. Les RPC de réception/transmission sont accessibles uniquement à `service_role` ; la reprise publique requiert un administrateur vérifié.

Tests sans effet externe :

```sh
node scripts/test-registration-receipts.mjs
PGLITE_MODULE=/chemin/@electric-sql/pglite/dist/index.js node scripts/test-registration-receipts-sql.mjs
```

La première suite exécute les vrais adaptateurs clients et handlers transpilés, en simulant chaque accès externe. La seconde applique la vraie migration dans PostgreSQL PGlite isolé et vérifie permissions, idempotence, rollback atomique, leases et conservation des résultats incertains. Aucune demande réelle, aucun paiement, aucun email et aucune modification de données de production ne sont nécessaires pour ces tests.
