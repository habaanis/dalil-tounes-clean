# Dalil Tounes — revue des doublons historiques (16/11/2026)

Périmètre: qualité des données, Supabase projet kmvjegbtroksjqaqliyv, Airtable app9Q828Splwvm4jW. **Lecture seule**; aucune suppression, migration, modification des approbations, code ou déploiement.

## Quatre paires hautement probables

1. **Clinique les Violettes** (Nabeul) : ancienne ligne `recZuJ5x3mo5raUoz`, `approved=false`, `statut_publication=Archivé`, sans rubrique ni catégorie; ligne de référence `recOUCEgXS20Yg9he`, publiée, approuvée et classée. Même téléphone sous des formats différents, même établissement, **slug identique** `clinique-les-violettes`.
2. **École des Langues et d'Informatique pour Tous** : ancienne ligne `recqyR3oAXrqejsSq`, saisie incomplète, sans rubrique/catégorie; ligne publiée `recGkfP5q6hpVPw60`, classée. Téléphone identique `73 219 875`. Slugs différents en raison des apostrophes typographiques.
3. **Wall Street English Tunis Lac 1** : ancienne ligne `recbhF2GYXqgmAtCB`, saisie incomplète, sans rubrique/catégorie; ligne publiée `recKi9nqaHveOobW3`, classée. Téléphone identique `70 244 777`; slugs différents (`tunis`/`tunisia`).
4. **Bouzguenda Training Center** : ancienne ligne `recuSzuIQkaLNJGRG`, saisie incomplète, sans rubrique/catégorie; ligne publiée `recN6IbBY2Saz6JZn`, catégorie Education & Formation et rubrique éducation. Téléphone identique `24 729 333`; **slug identique** `bouzguenda-training-center`.

Dans ces quatre paires, la version publiée dispose d'un identifiant Airtable toujours présent dans la table consultée, contrairement à la version incomplète/archivée (requête Airtable par recordIds exacts). Pour les huit lignes, les quatre tables relationnelles vérifiées ont zéro association : `business_needs`, `dalil_boutique_products`, `dalil_boutique_change_requests`, `dalil_boutique_push_subscriptions`. Cela ne prouve pas qu'il n'existe aucun lien externe, historique ou référence dans une autre table.

Une recherche de numéros de téléphone partagés parmi les lignes sans catégorie et rubrique a également identifié un dossier sans nom `recr23RyZ9d93NcEG` portant le même téléphone qu'une station TotalEnergies publiée; ce dossier n'est pas inclus dans les quatre paires à traiter, en l'absence d'identité certaine.

## Décision

**Ne pas supprimer ni fusionner automatiquement** : vérifier d'abord URLs publiques, SEO/anciens liens, éventuels liens non couverts par les FK, nécessité d'une redirection canonique et possibilité de retrouver les sources Airtable historiques. Les deux collisions exactes de slug sont prioritaires pour l'audit de navigation.

## Chiffres vérifiés

2293 établissements Supabase, 130 sans rubrique, 119 sans catégorie (aucune donnée changée par cette analyse). Les 132 approbations historiques non explicites font l'objet d'une revue séparée. Le chantier Boutique/commandes, les PR empilées, les migrations et la PWA relèvent d'autres conversations et n'ont pas été touchés.
