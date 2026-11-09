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
Le workflow public-browser-smoke.yml est programmé quotidiennement à 04:25 UTC (05:25 en Tunisie), avec un déclenchement manuel disponible. GitHub peut retarder un démarrage planifié. Le planning s’exécute sur la branche par défaut : sa remise en état effective restera à vérifier après fusion autorisée.

Cause confirmée sur main : la référence actions/setup-node était introuvable pendant la préparation du job. La PR utilise le SHA du tag officiel v4 (49933ea5288caeca8642d1e84afbd3f7d6820020) et Ubuntu 24.04. Le workflow ne dispose que de contents:read, le checkout ne conserve pas ses identifiants et aucun secret personnalisé n’est requis. SMOKE_BASE_URL est explicitement défini sur le domaine public de production. Le script accepte aussi cette variable pour vérifier une prévisualisation en lecture seule.

Validation du 9 novembre 2026 :
- Relance manuelle GitHub du code initial 280ec4b : 16/16 contrôles réussis, y compris l’initialisation : https://github.com/habaanis/dalil-tounes-clean/actions/runs/42484193235/job/129143307467 .
- Contrôles renforcés au commit 608e81b : 16/16 réussis : https://github.com/habaanis/dalil-tounes-clean/actions/runs/42612674157/job/129144783005 . Les routes exigent désormais un contenu principal avec titre, la suggestion doit conserver le nom choisi et le détail doit afficher le titre Academy Arrachida Group. Le bilan exige exactement 16 succès.
- HTTP public : 16/16 routes réussies sur la production et 16/16 sur la prévisualisation du commit initial.
- Build local : réussi. TypeScript et lint échouent avec des résultats identiques sur main et la PR (368 erreurs et 44 avertissements lint). Ces défauts préexistants, dont des chaînes italiennes non échappées dans CitizensServices.tsx, ne sont pas corrigés ici pour préserver le périmètre sans modification de page.
- Le téléchargement Chromium local a échoué dans cet environnement ; les contrôles navigateur attestés ci-dessus ont été exécutés sur les runners GitHub.
Aucune demande, réservation, publication ou synchronisation de fiche n’est soumise par ces contrôles.

Après fusion autorisée :
1. Lancer manuellement ce workflow sur main et confirmer le SHA fusionné, le domaine cible et 16/16 contrôles.
2. Vérifier la prochaine exécution dont event=schedule, avec le nouveau code sur main, une initialisation réussie et 16/16 contrôles. Une réussite sur PR ne suffit pas à valider le planning.
3. En cas d’échec, conserver les logs et les captures smoke-artifacts, identifier la cause puis corriger sans intervention automatique sur les données.
4. Vérifier que les éventuelles notifications d’échec GitHub sont reçues par le responsable. Aucun canal de notification externe n’est configuré par cette PR.

## File à réconcilier
Constat historique du 8 novembre, à revérifier avant toute reprise : l’audit constate huit suggestions en attente non marquées synchronisées dans Supabase, trois demandes Nouveau dans Airtable et un dossier client En attente du paiement. Ces nombres ne prouvent ni trois demandes distinctes des huit suggestions ni un paiement dû confirmé. Avant reprise : vérifier les identifiants, les doublons, la pertinence et les traces d’envoi. Ne pas publier automatiquement ce stock.

## CENTS en pratique
- Contrôle : identité unique entre bases, journal et gestion des erreurs confirmées.
- Entrée : dossiers vérifiés, pertinents localement, puis priorité aux professionnels avec CV existant et avis fiables.
- Besoin : mesurer demandes, acceptations et paiements confirmés ; traiter les retours des professionnels.
- Temps : transmettre les dossiers avec responsable, action et échéance ; limiter les validations du fondateur aux exceptions.
- Échelle : traiter par lots avec la même règle qualité et mesurer le temps réel de traitement, sans diminuer les contrôles.

Aucune fonction Supabase, donnée entreprise, page ou règle de publication n’est changée par cette proposition GitHub.
