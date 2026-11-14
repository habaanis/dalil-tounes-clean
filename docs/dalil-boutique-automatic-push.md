# Dalil — notifications automatiques des produits Boutique

Mise en service serveur : **14 novembre 2026**. Projet Supabase : `kmvjegbtroksjqaqliyv`.

- Edge Function `dalil-boutique-push-dispatch` version 4 accepte un JWT admin autorisé dans `admins` **ou** le secret interne conservé chiffré dans Supabase Vault `dalil_boutique_dispatch_internal_v1`. La table RLS `dalil_push_internal_config` conserve uniquement l'empreinte SHA-256 et refuse la lecture anonyme.
- Trigger `dalil_push_on_boutique_approval` sur la table `public.dalil_boutique_products` : après insertion approuvée ou passage du statut à `approved`, planifie un POST asynchrone via `pg_net`. Fonction `public.dalil_dispatch_push_on_approval()` en mode `SECURITY DEFINER` avec `search_path` vide ; aucun jeton n'est stocké dans le dépôt.
- Table de suivi privée `dalil_push_webhook_requests` et réponse `net._http_response`. Garde antiflood/dédoublonnage dans `dalil_push_sent_events`. Aucun Push sans abonnement volontaire.
- Paire VAPID spécifique à Dalil, initialisée dans `dalil_push_config` par l'Edge Function publique `dalil-boutique-push` action `config`. Contrôle SQL : une ligne, clés valides, réponse 200.
- Pilote `aux saveurs d'anis` (Sousse) : fiche `36f84b99-2c37-47d1-91ba-4c35cda8c1af`, produit `Buffet de mariage` `f371389d-5db1-4987-a47d-d275ed085d2c` passé de brouillon à approuvé le 14/11/2026 19:59:36 UTC, aucune commande ni paiement; les trois autres produits restent brouillons.
- Test déclenchement : `dalil_push_webhook_requests` ID de requête 1, réponse HTTP **200** avec `{"sent":0,"reason":"No push configuration"}` avant initialisation VAPID. Ce résultat ne valide pas un envoi d'alerte. Configuration VAPID ensuite initialisée, réponse HTTP 200, mais **aucun abonné réel enregistré** à ce stade. Faire le test complet sur téléphone avant tout engagement client.
- Pour obtenir un abonné Dalil : ouvrir `https://dalil-tounes.com/entreprise/sousse/aux-saveurs-d-anis`, Boutique > Suivre les nouveautés et accepter dans le navigateur. Contrairement à Lienora, l'auto-test client n'est pas encore prévu sur Dalil. Une deuxième nouveauté pilotée pourra valider le Push.
- Aucun changement sur les prix, comptes clients ou catalogue à ce stade. Catalogue optionnel et accès commerçant suivis dans l'issue #234.

À améliorer : reprise/retry des échecs partiels, révisions de produits déjà approuvés, robustesse pour >500 abonnés, contrôle de sécurité et vrai test de réception appareil.
