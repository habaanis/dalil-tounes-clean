# Dalil Tounes — Parcours de commande de mini-appli (chantier isolé)

État au 23 novembre 2026. Document de cadrage et d'audit, **aucune modification ni publication de production**.

## Objectif validé

Depuis la PWA, « Vous êtes professionnel ? » doit conduire directement à « Créez votre mini-appli » : choix de l'offre (Artisan 30 TND / Premium 59 TND), choix Business ou Portfolio selon l'offre, palette et options, formulaire en plusieurs étapes, récapitulatif, virement bancaire tunisien, confirmation, suivi, validation humaine du paiement et de la publication. Première année incluse ; entretien ensuite 50 TND/an (conditions de non-renouvellement à conserver et à présenter explicitement). Objectif commercial : présenter, vendre et fidéliser.

## Inventaire vérifié — réutiliser, ne pas dupliquer

- `src/components/CvPresentationModelSelector.tsx` : choix Business/Portfolio et palettes. Son texte actuel indique les deux modèles disponibles pour Artisan et Premium : vérifier la règle commerciale avant tout changement.
- `src/components/SubscriptionRequestForm.tsx` : formulaire de demande en deux étapes, MAIS il contient les anciens montants (notamment forfaits mensuels, annuels et prix en euros). Ne pas le réexposer sans revoir ses tarifs et sa logique.
- `src/components/BusinessRegistrationRequestForm.tsx`, `src/pages/BusinessRegistration.tsx`, `src/lib/businessRegistration.ts` : circuit d'inscription existant ; la page d'inscription standard précise qu'elle n'encaisse pas de paiement.
- `src/components/CheckoutRegistrationBridge.tsx`, `api/create-stripe-checkout.ts`, `api/verify-stripe-checkout.ts` : ancien passage Stripe ; ne pas supposer qu'il convient au virement TND.
- `supabase/functions/submit-company-registration` et `supabase/functions/_shared/companyRegistrationRecord.ts` : fonction active de réception et notification ; les demandes sont actuellement représentées dans `public.suggestions_entreprises`.
- Supabase `public.dalil_boutique_customer_orders` : commandes **des clients des boutiques des professionnels**, pas les commandes d'achat de mini-appli. Ne pas réutiliser cette table pour les achats de mini-appli.
- Airtable : table **Suivi clients — Dalil Tounes** avec modèle, formule, palette, référence paiement, date de vérification, aperçu, publication et prochaine action. Elle doit rester un miroir administratif, Supabase étant source principale.
- `src/components/boutique/*` et fonctions `dalil-boutique-*` : outils Boutique/Catalogue déjà présents, à rattacher aux mini-applis sans les recréer.

## Points non démontrés — tests obligatoires avant déploiement

1. URL précise et comportement actuel du bouton « Vous êtes professionnel ? » dans la vraie PWA publiée.
2. Persistance de la formule, du modèle et de la palette jusqu'à Supabase et au suivi Airtable.
3. Notification réelle vers `contact@dalil-tounes.com`, avec déduplication et reprise si Airtable échoue.
4. Circuit sécurisé de transfert logo, photos et produits (permissions, formats, quotas, modération).
5. Génération d'aperçu non public, rattachement à la carte professionnelle Premium et référencement conditionné à la publication.
6. Sécurisation des statuts, du suivi client et de la validation administrateur.
7. Vérification de non-régression sur l'inscription gratuite, la Boutique, le compte professionnel et les mini-applis déjà publiées.

## Parcours recommandé

1. **Offre** : deux offres à prix unique, affichage clair du contenu inclus et de la maintenance.
2. **Présentation** : réutiliser le sélecteur de modèle/palette existant.
3. **Informations** : coordonnées, activité, description, liens, logo/photos et produits facultatifs à compléter ultérieurement ; sauvegarde du brouillon si possible.
4. **Récapitulatif** : correction possible avant validation ; consentements enregistrés.
5. **Virement** : référence de commande unique ; instructions affichées via configuration sécurisée, sans RIB codé en dur dans le dépôt ; ne pas marquer comme payé après un clic ou un justificatif.
6. **Suivi** : commande reçue -> paiement annoncé/à vérifier -> paiement vérifié -> préparation -> aperçu proposé -> accord client -> validation éditoriale -> publié.

## Séparation des responsabilités

- **Supabase** : dossier canonique (référence unique, offre et prix figés à la commande, configuration de CV, fichiers autorisés, historique d'état et preuves de validations).
- **Airtable** : suivi administratif, responsable, prochaine action et notifications internes ; garder la table existante.
- **Client** : peut envoyer ses éléments, consulter ses propres étapes et demander une correction, sans pouvoir écrire directement `payment_verified_at` ou `published_at`.
- **Administrateur** : contrôle la réception effective du virement et autorise la première publication ; un justificatif n'est pas une confirmation bancaire.
- **Compte bancaire** : personnel pour le démarrage selon la décision du propriétaire ; vérifier l'autorisation par la banque et les exigences légales/fiscales avant d'afficher les instructions de paiement.

## Conventions et garde-fous à respecter à l'implémentation

- Ne jamais associer une commande Boutique à une commande d'achat de mini-appli ; ne pas mélanger Lienora.
- Ne créer ni nouvelle table ni nouveau composant avant d'avoir contrôlé la couverture de ceux existants.
- Si une entité commande distincte devient indispensable, préparer un schéma de migration revu, avec RLS stricte, rôle admin côté serveur, idempotence et vérification des droits ; **aucune migration sans revue**.
- Ne pas stocker de RIB ni de coordonnées sensibles en dur dans le code frontend ou GitHub.
- Le statut « paiement vérifié » ne peut provenir que d'une action administrateur authentifiée ou d'un futur prestataire de paiement vérifié côté serveur.
- Aucune publication automatique : l'accord client ne remplace pas la validation initiale Dalil Tounes.
- Préparer les changements sur une branche isolée ; aucune fusion/déploiement sans autorisation explicite.

## Première livraison technique prévue

Après le contrôle du routage réel de la PWA : raccorder uniquement le bouton « Vous êtes professionnel ? » au premier écran du parcours existant, faire persister le choix d'offre / modèle / palette, supprimer les anciens montants **dans le flux client concerné** sans perturber les routes historiques ; tester sur aperçu non productif. Ensuite seulement traiter paiement et dossier complet.
