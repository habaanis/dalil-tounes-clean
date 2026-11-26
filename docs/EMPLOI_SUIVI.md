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


## Avancement du 26 novembre 2026 — connexion dynamique
- PR #459 et #460 fusionnées et déploiements de production READY (commits 215d22f4 et 5f5b0f02).
- Table publique dédiée `verified_job_offers` créée dans Supabase, distincte de `job_postings` et du circuit des demandes `suggestions_entreprises`.
- RLS activée : SELECT anonyme/authentifié réservé aux lignes published dont verified_at <= jour tunisien <= review_until. Aucun INSERT/UPDATE/DELETE public. Ecriture par service_role ou administrateur SQL uniquement. URL HTTPS unique; statut pending par défaut; validité maximale de 30 jours après vérification.
- Test transactionnel avec trois lignes temporaires (active, expirée, pending) sous rôle anon : seule la ligne active lisible; écriture interdite. ROLLBACK confirmé, zéro ligne de test restante.
- PR #461 site et #462 PWA : lecture dynamique paginée par 200, rafraîchissement toutes les cinq minutes et au focus, messages de chargement/erreur en cinq langues, recherche incluant ville et gouvernorat. Pas de retour aux anciennes annonces statiques en cas d'erreur.
- À vérifier : builds, accès Data API réel depuis navigateur, rendu et filtre avec offres réelles, migration versionnée du schéma, journal administratif, automatisation quotidienne et compteur exact. Les anciens droits de job_postings restent à auditer séparément.
- Aucun lot d'annonces réelles publié à cette date.

## Suite — accueil et suivi administratif
- PR #461 et #462 fusionnées et production READY (2dd95e74, 42b46054).
- Journal privé `emploi_collection_runs` créé; premier bilan partiel enregistré. Cinq pistes pending, zéro publiée.
- Tâche quotidienne existante retrouvée active (27/11/2026 08h Europe/Paris); premier résultat à contrôler. Vérifier réellement le journal et les alertes.
- Compteur accueil : SELECT count exact sur verified_job_offers, filtré explicitement par statut published et date tunisienne, rafraîchissement au focus et toutes les 5 minutes; texte générique si erreur. La PWA ne disposait que de trois univers; ajout du quatrième Emploi dans les cinq langues sans remplacer les autres textes.
- Page site /admin/emploi en lecture seule, contrôle d'identité via Supabase Auth et table admins existante; accès données protégé par RLS. Journal des 30 derniers bilans, 100 dernières offres pending, comptages exacts, alerte visuelle si dernier bilan complet absent ou >48h. Pas de nouvelle authentification.
- Les tests navigateur et la publication de vraies offres restent nécessaires. Aucun changement Lienora.

## Retour utilisateur du 26 novembre — annonces compactes
- 50 pistes enregistrées ; 2 passées au statut published (ANPE et Hamelin) sur preuve éditoriale indexée, ouverture directe HTTP non confirmée, 48 pending. Ne pas assimiler à 50 offres validées.
- Carte VerifiedJobCard existante compactée sur site et PWA : titre, employeur, ville, contrat, bouton détails replié. Expérience, secteur, compétences, source et lien candidature à l’intérieur. Dates verified_at/review_until non affichées aux candidats ; restent inchangées dans Supabase pour contrôle et expiration. Cinq langues conservées.
- Espacement de grille réduit, alignement en haut afin que l’ouverture d’une carte ne dilate pas les autres cartes. Vérifier compilation et rendu mobile avant fusion.

## Pagination des annonces — 26 novembre
- PR #466/#467 fusionnées et productions READY. 50 fiches publiées dans Supabase et lisibles sous rôle anon; contrôle éditorial indexé mais accès HTTP direct non confirmé. 48 nouvelles publications à recontrôler au plus tard sous 7 jours, ou avant échéance réelle.
- Pagination publique par 10 après filtrage intégral du catalogue, et non avant. Recherche multi-mots insensible aux accents et à la casse, inclut métier, entreprise, secteur, ville, gouvernorat, contrat, expérience et compétences. Changement de filtre remet en page 1; réduction du catalogue borne la page; précédent/suivant et intervalle de résultats, 5 langues. Préserver la pagination lors des futurs lots.
