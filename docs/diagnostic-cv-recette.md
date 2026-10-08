# Diagnostic CV interactif — état et vérifications

## Implémenté sur branche de travail
- Route `/diagnostic-cv` et six questions à réponses multiples.
- Sélection « Tous ces choix » : exclut les choix incompatibles.
- Traduction de toutes les questions, consignes, résultats et boutons en FR/EN/AR.
- Sélecteur de langue visible, arabe RTL. Les réponses utilisent des identifiants indépendants des traductions pour calculer le résultat.
- Règle de scoring de la question 3 : +2 Business pour activité/services; +2 Portfolio pour réalisations/produits; +1 chacun pour références. Écart >=2 sinon les deux.
- Démo publique de découverte `/cv-business`. Aucun faux lien vers une variante Portfolio.
- Choix Oui / Non après résultats. L'écran « Oui » n'affiche aucun faux formulaire : aucune coordonnée captée tant qu'un endpoint sécurisé n'est pas raccordé.
- Événements JS anonymes (`dalil_diagnostic_...`). Leur émission ne signifie pas qu'un outil d'analyse les collecte déjà.

## Avant publication
1. Vérifier typecheck/build et UX mobile sur la branche.
2. Configurer un endpoint de collecte propre à Dalil Tounes : base Airtable `app9Q828Splwvm4jW` ; table `tblitreiY2iFdUJAv`. Ne pas copier la connexion France.
3. Obtenir un consentement clair à l'étude, raccorder une vérification anti-robots et limiter les abus, tester refus, échecs et doublons.
4. Connecter le formulaire prospect volontaire à « Suivi clients — Dalil Tounes » ou à un nouveau flux adapté après validation de la correspondance des champs; ne pas envoyer aux paiements.
5. Identifier les vraies démonstrations CV Business / CV Portfolio.
6. Vérifier les traductions arabes dans leur contexte UX et prévoir les règles de confidentialité locales.

## Scénarios à vérifier
- Chaque réponse Q3 individuelle; tous ces choix; références seules; écart de score.
- Changement de langue après réponse 3, retour, poursuite sans perte.
- Sélection de « Pas encore » puis « Tous ces choix », et vice-versa.
- Refus de contact, retour résultat, aucune donnée personnelle.
- Liens, RTL, lisibilité et boutons sur petit mobile.

**Statut : code préparé, non compilé/testé en navigateur, non déployé.**
