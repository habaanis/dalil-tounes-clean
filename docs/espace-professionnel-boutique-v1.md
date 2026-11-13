# Dalil Tounes — Espace professionnel et Boutique (V1)

## Objectif
Créer un accès client par entreprise, inspiré de l'espace client Lienora, et permettre de proposer des produits (commande ou devis) en vue d'une publication contrôlée. Ne pas confondre compte utilisateur et propriété d'une fiche.

## État vérifié le 13 novembre 2026
- L'application dispose déjà de Supabase Auth et de `/dashboard/entreprise`, actuellement orienté offres d'emploi et candidats.
- La table `public.entreprise` contient environ 2487 lignes et son identifiant métier est `text`, sans clé primaire détectée dans le résultat d'inspection.
- Il n'existe pas encore de table dédiée d'attribution explicite entre une session professionnelle et une fiche publique.
- Les fiches publiées sont synchronisées depuis des sources administrées : éviter toute modification directe de `entreprise` depuis le navigateur.

## Étapes techniques avant activation client
1. Créer un modèle d'accès distinct : `professional_profile_access(user_id uuid, entreprise_id text, granted_at, granted_by)`, avec paire unique et FK sur `auth.users`. Ajouter une FK vers `entreprise` seulement après avoir vérifié et garanti une clé métier unique.
2. Un administrateur attribue manuellement le compte au bon établissement après vérification de l'identité du représentant ; aucune auto-attribution sur simple e-mail ou numéro.
3. Tables `boutique_product_submissions` : id, user_id, entreprise_id, title, description, price, currency=TND, mode=order|quote, private_media_path, status=draft|submitted|approved|rejected, created_at.
4. Activer RLS avec contrôles conjoints `auth.uid() = user_id` ET existence d'une attribution validée `professional_profile_access` pour `entreprise_id`. Refuser les changements de propriétaire avec `WITH CHECK`. Seule une fonction serveur/admin approuve.
5. Utiliser un bucket Storage privé ; politiques de téléversement basées sur `auth.uid()` + attribution à l'entreprise ; formats image jpeg/png/webp, maximum 5 Mo ; éviter de stocker les URL privées dans les données publiques.
6. Publication de produits via une projection publique en lecture seule et filtrée par statut approved ; la vitrine n'affiche que des produits publiés ET un établissement approuvé/public. Les produits peuvent être supprimés/désactivés indépendamment.
7. L'espace `/dashboard/entreprise` ajoutera un onglet `Ma vitrine` et un onglet `Ma boutique`, mais seulement si l'API renvoie une attribution confirmée ; garder les onglets emploi existants.
8. Connexion paiement : prestataire tunisien adapté, onboarding du commerçant par le prestataire ; ne jamais collecter le RIB via Dalil. Vérifier côté serveur la destination, le montant, la devise et la confirmation paiement. Aucun lien de paiement arbitraire saisi par un commerçant dans l'interface publique.

## Parcours prévu
Connexion sécurisée -> Ma vitrine -> Ma boutique -> Ajouter une petite carte produit -> envoyer photo et prix ou devis -> soumettre -> validation -> apparition d'un bouton Commander sur la mini-application -> galerie trois petites cartes par ligne -> photo agrandie avec croix X -> demande et éventuellement paiement directement chez le marchand.

## Critères de validation
- Un utilisateur sans attribution voit une page d'information et ne peut ni lire ni modifier les soumissions d'autrui.
- Un utilisateur attribué ne peut créer ou consulter que les produits de sa propre entreprise.
- Un professionnel ne peut publier, modifier le prix approuvé ou activer le paiement sans vérification.
- Une fiche non publiée ne doit pas exposer sa boutique.
- Accessibilité mobile, fermeture par X et touche Echap, aucun changement de route pour consulter les produits.
- Tester en environnement isolé avant toute fusion ; pas de backfill automatique et pas de modification de la table `entreprise` sans plan de migration.

## Statut
Spécification de migration et de sécurité, pas une fonctionnalité client activée. L'implémentation doit suivre validation de schéma et recette RLS.
