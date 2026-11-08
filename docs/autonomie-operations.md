# Autonomie opérationnelle — Dalil Tounes

État vérifié le 8 novembre 2026. Le chantier visuel est préservé : aucune page, composant ou route n’est modifié dans cette intervention.

## Suivi transmissible
Dans Suivi clients — Dalil Tounes, les champs Responsable du dossier, Prochaine action et Échéance prochaine action servent à organiser la reprise. Ils ne contactent personne et n’autorisent pas la publication. Les champs restent vides jusqu’à une décision vérifiée.

1. Rapprocher la demande reçue de sa fiche entreprise avant création pour éviter les doublons.
2. Vérifier coordonnées, modèle et offre ; garder la proposition en aperçu privé.
3. Enregistrer une acceptation explicite et vérifier le paiement à sa source avant confirmation de mise en ligne.
4. Les automatisations Airtable de création et de modification appellent sync-airtable. Un HTTP 200 seul ne suffit pas : le résultat doit confirmer synced=true, une fiche traitée et aucune erreur.
5. Les correctifs des deux scripts sont enregistrés uniquement en brouillon Airtable. Les versions actives restent inchangées jusqu’à validation puis application des changements.
6. Après synchronisation autorisée, vérifier le résultat public puis dater la livraison et attribuer la prochaine action.
7. Une erreur partielle, une réponse non JSON, un conflit ou un doublon imposent une relecture avant réessai.

## Surveillance
Le workflow public-browser-smoke.yml est programmé quotidiennement à 04:25 UTC (05:25 en Tunisie). Son exécution planifiée du 7 novembre a échoué avant les tests car la référence actions/setup-node était introuvable. La correction proposée remplace uniquement cette référence par le commit vérifié du tag officiel v4 ; elle ne prouve pas que les contrôles navigateur passent après redémarrage.

## File à réconcilier
L’audit constate huit suggestions en attente non marquées synchronisées dans Supabase, trois demandes Nouveau dans Airtable et un dossier client En attente du paiement. Ces nombres ne prouvent ni trois demandes distinctes des huit suggestions ni un paiement dû confirmé. Avant reprise : vérifier les identifiants, les doublons, la pertinence et les traces d’envoi. Ne pas publier automatiquement ce stock.

## CENTS en pratique
- Contrôle : identité unique entre bases, journal et gestion des erreurs confirmées.
- Entrée : dossiers vérifiés, pertinents localement, puis priorité aux professionnels avec CV existant et avis fiables.
- Besoin : mesurer demandes, acceptations et paiements confirmés ; traiter les retours des professionnels.
- Temps : transmettre les dossiers avec responsable, action et échéance ; limiter les validations du fondateur aux exceptions.
- Échelle : traiter par lots avec la même règle qualité et mesurer le temps réel de traitement, sans diminuer les contrôles.

Aucune fonction Supabase, donnée entreprise, page ou règle de publication n’est changée par cette proposition GitHub.
