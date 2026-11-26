# Circuit de création des mini-applis Dalil Tounes

## Problème corrigé

Le formulaire du site et de la PWA enregistrait les demandes, mais l'administration
d'activation utilisait deux colonnes absentes (`subscription_tier` et `statut abonnement`).
Le dossier, la vérification du virement, la fiche publique et le compte professionnel
n'étaient pas reliés par un circuit persistant. Une création de compte sans session
était également annoncée comme une connexion réussie.

Les routes `/admin/premium` et `/admin/abonnements` réutilisent maintenant un seul
écran compact. La création n'est pas assimilée à un abonnement mensuel. Les montants
existants sont conservés : Artisan 30 TND, Premium 59 TND et création de logo 20 TND
si demandée. L'entretien annuel facultatif reste distinct du règlement initial.

### Périmètre des composants

`BusinessShowcaseLienoraDetail.tsx` est un nom historique du composant **Dalil Tounes** :
`AppRouter` → `BusinessShowcaseDetail` → `BusinessShowcaseLienoraEnhanced` le charge pour
`/cv/:slug` et les mini-applis. Son adaptateur déclare uniquement la marque
`dalil_tounes`. Les alias de production Vercel vérifiés sont `dalil-tounes.com`,
`www.dalil-tounes.com` et `app.dalil-tounes.com` ; aucun domaine Lienora n'y figure.
Le diff de ce composant se limite à six lignes ajoutées et seize retirées pour
afficher les réseaux persistés. Aucun dépôt, domaine ou déploiement Lienora France
ou Lienora World n'est modifié. `AdminCommercial.tsx` est conservé à l'identique.

## Parcours opérationnel

1. Le professionnel remplit le formulaire existant. Le succès exige un UUID de
   dossier réellement enregistré et affiche cette référence.
2. L'administrateur ouvre le dossier, vérifie les informations et les choix, puis
   prépare une nouvelle fiche privée ou sélectionne explicitement une fiche existante.
3. Après contrôle réel du virement, il saisit la formule payée, le montant, la
   référence bancaire et la date de réception. Le serveur calcule le total attendu.
4. Le logo prévu au dossier doit être réellement enregistré avant publication.
5. La publication applique les champs réellement lus par les vitrines et le système
   de droits existant. Le serveur relit le résultat avant d'annoncer une réussite.
6. Un compte dont l'e-mail est confirmé reçoit l'accès à la fiche validée. Il peut
   être rattaché dans l'administration ou à sa première connexion au compte/PWA.
   L'identifiant Auth reste ensuite lié durablement au dossier.

La vérification du virement reste une action de l'administrateur : l'envoi du
formulaire et la création d'un compte ne constituent jamais une preuve de paiement.

## Protection et conservation

- Les administrateurs existants sont conservés. Un navigateur ne peut plus créer
  sa propre autorité dans `admins`, ni modifier son rôle dans `profiles`.
- Les tables de suivi, d'audit et de transmission ne sont pas accessibles directement
  aux rôles publics. Les RPC d'administration contrôlent l'identité à chaque appel.
- Les transitions utilisent des verrous et une version attendue. Les reprises de
  paiement, publication et rattachement ne créent pas de second événement métier.
- Les anciennes demandes restent à vérifier ; aucune formule ni aucun paiement
  ne leur est attribué par la migration.
- Rattacher une fiche existante conserve son contenu et ses URLs. Un remplacement
  de logo payé est une action explicite. Aucune ancienne photo n'est supprimée.
- Les droits acquis sont conservés par le résolveur existant. Premium vers Artisan
  et la conversion automatique des cas historiques `legacy` sont refusés.
- Les photos sont celles de la présentation, sans modification du catalogue boutique.
- Les liens persistés restent visibles dans Business et Portfolio, y compris le
  sixième emplacement X/autre réseau et les réseaux historiques.

## Réception et transmissions

Voir [dalil-registration-receipts.md](dalil-registration-receipts.md) pour le reçu
atomique, les identifiants de tentative, les erreurs explicites et les reprises
indépendantes d'Airtable et de notification. Un résultat de notification incertain
reste à vérifier auprès du fournisseur ; il n'est pas renvoyé automatiquement.

Les sources déployées précédemment ont servi de base : réception v11, notification
v7 et synchronisation Airtable v26. Les fonctions actives après cette correction
sont réception v12, notification v8, synchronisation v27 et reprise v1, toutes avec
vérification JWT conservée. Le message Airtable accepte les 10 000 caractères du
dossier plus ses en-têtes ; les règles Emploi déjà présentes en production sont conservées.

## Validation du 26 novembre 2026

| Contrôle | Résultat |
| --- | --- |
| Migration réelle du parcours complet : brouillon, paiement, publication, droits et conservation | 36 assertions PostgreSQL réussies |
| Autorité administrateur et rattachement | 41 assertions PostgreSQL réussies |
| Reçu et reprises transactionnelles | 14 assertions PostgreSQL réussies |
| Handlers, adaptateur client, notification, proxy et mapping Airtable | 35 contrôles réussis avec fournisseurs simulés |
| Administration React et affichage des réseaux | 10 groupes réussis |
| Inscription React | 16 contrôles réussis |
| Dashboard indépendant PWA | 4 groupes réussis |
| Galerie et droits professionnels antérieurs | Tests React de non-régression réussis |
| Build site et PWA | Réussi, y compris génération SEO et sitemap |
| Contrôle transactionnel sur Supabase réel | Réussi, puis ROLLBACK ; zéro dossier ou établissement fictif conservé |
| Contrôle HTTP des fonctions déployées | Requête invalide 422, prévol PWA 200, reprise sans identité 401 |

Le contrôle réel est reproductible avec
`scripts/verify-miniapp-onboarding-live-rollback.sql`, exécuté entier. Il ne modifie
ni `auth.users`, ni les administrateurs, ni Aux Saveurs d'Anis ; il n'appelle aucun
envoi de message. Les empreintes avant/après des deux administrateurs, des deux
accès professionnels, des sept demandes existantes et d'Aux Saveurs sont identiques.
Aux Saveurs conserve sa formule Premium et ses neuf photos.

Le contrôle global TypeScript rencontre toujours des erreurs préexistantes hors de
ce lot, notamment `CitizensServices.tsx`, `NegotiationModal.tsx` et, selon le graphe
d'import ciblé, `databaseI18n.ts`. Les fichiers modifiés ont été contrôlés par comparaison
avec la base ; les builds passent. Les avertissements de sécurité préexistants de
Supabase n'ont pas été étendus à un chantier séparé. Les nouvelles tables privées
ont volontairement RLS et aucun accès public direct.

## Limites de vérification

- Aucun virement réel, e-mail de confirmation, invitation ou notification client
  n'a été envoyé pour les essais. Les fournisseurs externes sont simulés dans les tests.
- Le scénario Auth non confirmé est testé dans PostgreSQL isolé. Aucun compte Auth
  non confirmé n'existait dans l'inventaire réel ; le contrôle réel vérifie une identité
  absente avec un e-mail usurpé, sans créer de compte.
- La liste distante des URLs autorisées pour le retour d'e-mail n'est pas exposée
  par les accès disponibles. Le retour direct vers app/PWA n'est donc pas attesté.
  L'interface demande explicitement de confirmer l'e-mail puis de se connecter.
- La PWA conserve son dashboard indépendant et ouvre le compte professionnel commun.
  Les services workers passent à v20 pour le site/mini-applis et v30 pour la PWA.
