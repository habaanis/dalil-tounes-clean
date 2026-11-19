# Harness de coordination — Dalil Tounes

Ce fichier complète `AGENTS.md` sans modifier les règles métier et sans donner un droit de déploiement automatique.

## Règles essentielles
1. Avant tout travail, lire `AGENTS.md`, ce document, le [tableau de pilotage](https://github.com/habaanis/dalil-tounes-clean/issues/294), les issues et PR du chantier. Vérifier la branche de base et l'environnement concerné.
2. Une mission = une issue GitHub de référence. Réutiliser les tickets existants ; ne pas inventer un second chantier en parallèle.
3. Signaler dans l'issue avant modification : périmètre, branche, fichiers ciblés, risques, critères de validation et dépendances.
4. Privilégier une branche isolée et une PR. Effectuer les contrôles TypeScript, lint, build et tests concernés, documenter leur résultat réel (ne jamais inventer).
5. Utiliser les previews pour validation. **Ne pas fusionner ni déployer la production sans validation du propriétaire** ; la seule rédaction d'une issue ou d'une PR n'autorise pas la publication.
6. Après intervention, consigner dans l'issue la liste des fichiers changés, le lien de PR, les tests, les blocages, les travaux restants, le commit et les liens de preview.
7. Distinguer strictement les états : `à faire`, `en cours`, `PR ouverte`, `tests passés`, `preview disponible`, `validé`, `fusionné`, `production vérifiée`. Un état ne remplace jamais le suivant.
8. Pour attester une mise en production, relever le domaine, l'environnement, le SHA réellement servi, l'état du déploiement et un contrôle fonctionnel ciblé (mobile si nécessaire). Sans preuve, écrire `non vérifié`.
9. Ne publier ni secrets ni données personnelles dans les issues. Ne pas toucher à une migration, aux permissions, aux paiements ou aux clés sans instruction explicite et procédure de sécurité.
10. Les conversations d'agents ne partagent **pas automatiquement** leur mémoire. Chaque agent doit consulter et mettre à jour GitHub pour se coordonner.

## Périmètre spécifique
Site dalil-tounes.com et PWA indépendante; conserver la base Tunisie et ses règles RLS; ne pas mélanger avec Lienora.

## Références réutilisées
#209 (Boutique), #229 (publications), #294 (pilotage).

## État automatique
Le workflow `.github/workflows/harness-status.yml` lit les issues/PR/exécutions GitHub et rafraîchit l'issue de pilotage chaque jour et sur lancement manuel **après fusion sur la branche par défaut**. Son tableau n'inclut pas une vérification Vercel/Cloudflare ni une lecture de la production réelle. Aucun push ni déploiement n'est déclenché par ce rapport.

## Format de compte rendu d'un agent
- Mission / issue :
- Branche / PR :
- Réalisé (avec fichiers/commit) :
- Tests effectués et résultat :
- Preview et validation :
- Production : vérifiée (avec preuve) / non vérifiée :
- Blocages et points restants :
- Prochain responsable ou chantier dépendant :
