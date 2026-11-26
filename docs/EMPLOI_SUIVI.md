# Dalil Tounes — exploitation permanente de la rubrique Emploi

Validé le 26 novembre 2026. Périmètre : Tunisie exclusivement.

## Règles permanentes
- Reprendre les composants Jobs.tsx, PublishJob.tsx, VerifiedJobCard.tsx et JobPostForm.tsx existants. Conserver les cinq langues, les formulaires, la modération et les parcours talents.
- Vérifier main et release/dalil-tounes-pwa-independent-20261114 séparément. Supprimer le prune des surfaces publiques sans toucher aux palettes clients. Remonter les offres et ajouter la recherche métier et région.
- Vérifier les PR et déploiements avant intervention. Une branche et une PR distinctes par surface si nécessaire. Tester avant fusion.
- Chaque jour, rechercher des offres tunisiennes récentes et vérifiables, vérifier source directe, employeur, lieu, contrat si indiqué, date, moyen de candidature, doublons et validité. Ne jamais inventer.
- Chaque semaine, contrôler les liens existants; recontrôler au plus tard après 30 jours si aucune échéance explicite. Masquer les offres expirées selon le circuit existant.
- Ne pas publier avant validation du circuit de modération et de stockage. Ne contacter aucun employeur ni envoyer de candidature.
- Aucun changement Lienora France ou World.

## Exécution et preuve
Le présent document ne déclenche aucun travail. Utiliser une tâche planifiée indépendante du chat ou un ordonnanceur de production validé. Ne jamais déclarer la tâche active sans preuve de création et de statut. Préférer une exécution quotidienne vers 08h Europe/Paris, sans date de fin, avec alerte si aucun bilan depuis 48h. Aucun accès ou quota ne peut être garanti.
Chaque exécution doit consigner dans le journal durable : date/heure, sources consultées, nombre trouvé, vérifié, publié, rejeté, à contrôler, liens des offres et éventuels blocages. Un échec doit être visible, jamais assimilé à une réussite. Reprendre au dernier lot sans doublons.

## État initial
- PR historiques #91, #92 et #392.
- 8 lignes actives en job_postings (contrôle précédent), 6 offres statiques hors délai de recontrôle.
- Prune confirmé dans Jobs.tsx application et VerifiedJobCard.tsx et JobPostForm.tsx sur les deux branches.
- La tâche quotidienne annoncée n'a pas pu être recontrôlée (erreur 404). Ne pas présumer son fonctionnement.
- Aucun premier lot de 30–50 offres validé ou publié à ce stade.
