# Dalil Tounes — correction administrative de 11 validations manquantes — 15 novembre 2026

## Contexte
Projet Supabase `kmvjegbtroksjqaqliyv`, Airtable base `app9Q828Splwvm4jW`, table `tbl8B6aiFeUe0hoQS`. Continuité du dossier `audit/reconciliation-publication-175-2026-11-15.md`.

175 anomalies avaient été rapprochées: 155 fiches accessibles alors que la case d'approbation n'était pas explicitement renseignée, 20 approuvées et marquées `Publié` mais non lisibles selon la règle publique. 174/175 correspondances Airtable; Lessing-Institut sans correspondance.

## Lot corrigé (11)
Les 11 fiches ci-dessous possédaient toutes AVANT modification:
- `approved=true` à la fois dans Airtable et Supabase;
- `Statut de publication=Publié` à la fois dans Airtable et Supabase;
- `statut_validation=NULL` dans Supabase et statut_validation vide dans Airtable;
- téléphone, description, au moins une catégorie et une rubrique renseignés.

**Seul champ écrit dans Airtable**: `fldCMVfHSQAijXP7e` (statut_validation), passé de vide à l'option existante `publie`. Ni approbation, ni statut de publication, ni autre contenu modifié.

- recTRJCfJbMVOAtVb — ADAM Immobilière
- recqosuwoZoJH0mH8 — Agence Hannibal immobilière du Kef
- recbsH5km6FWZ7hKf — Agence Immobilière Ben Hamadi Zaghouan
- recE9mNmn4XFW2jRw — Agence immobilière Ben Houcine
- recsPGWyVVHSk8NOl — Agence immobilière Khemiri Immo
- recjAs6rq7sKDqapf — Agence Immobilière Larine
- recc0Wr2b25SoaRIk — Agence Immobilière Majdoub
- recSOIaQK5oWHMR18 — Agence immobilière Tozeur
- recrjQu1Sp2l43kAh — Agence Porte-Neuve Immobilier
- recCxl6mNiV7rESr3 — AMWAL Immobilière
- recSei7TmIP61m1LE — Maissem Immobilière Tabarka

## Résultats et vérifications
- Airtable UPDATE: 11/11 confirmations.
- Airtable relecture: 11/11 `approved=true`, `Publié`, `statut_validation=publie`.
- Supabase après automatisation: 11/11 `approved=true AND statut_publication='Publié' AND statut_validation='publie'`.
- Règle de visibilité RLS: total lisible au sens du prédicat passe de **549 à 560**; ces 11 étaient déjà approuvées/publiées mais bloquées par statut_validation vide.
- Total `public.entreprise`: **2293** inchangé.
- 9 fiches `approved=true` et `Publié`, avec validation explicite `terminer la saisi`, restent volontairement inchangées et non éligibles à la RLS.
- 155 fiches auparavant accessibles malgré `approved=NULL` restent INCHANGÉES (n'approuver ni masquer sans décision administrative). Le risque d'approbations héritées doit être traité séparément.
- Le nombre `approved=true AND statut_publication='Publié' AND statut_validation='publie'` est désormais 395. 10 autres fiches approuvées visibles ont la publication NULL et sont incluses dans le total RLS 560.
- Aucun changement RLS, aucun changement code, aucune création/suppression, aucun redéploiement Vercel.

## Reprise
1. Revoir individuellement les 9 dossiers explicitement marqués « terminer la saisi » (dont Tecnocasa Mahdia Tourist Zone vérifié par Anis). Ne pas convertir ce statut automatiquement.
2. Décider administrativement du traitement des 155 approbations NULL (154 appariées Airtable avec case non cochée, une Lessing-Institut sans correspondance).
3. Réaliser recette navigateur site/PWA réelle (recherche, detail, compte, boutique, QR, FR/AR) et vérifier la présence publique des 11 fiches avant de déclarer la recette E2E validée.
