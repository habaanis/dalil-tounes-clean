# Lot PWA 07 — Livraison QA et reclassement prudent, 15 novembre 2026

## Déploiement contrôlé
- Projet exclusif : `dalil-tounes-pwa` (`prj_AJeQ8yjK2rQCPwQOG9R1CgDvKQmE`).
- Déploiement production : `dpl_FWmvi7AzYQASpKVoq4ajQJsZXPHi`, commit `4832e5aa6cf2672ed945c1cd600d22686b02faf1`, `READY`, alias `dalil-tounes-pwa.vercel.app`.
- Changement sur la branche : correction de deux chaînes de traduction mal délimitées dans `src/components/AlerteRechercheForm.tsx` ; ajout de `scripts/smoke-pwa-directory.mjs`.
- Test Playwright dédié au répertoire PWA sur navigateur mobile (390x844), testé avant publication contre le domaine de production précédent : **7/7 PASS** sur `sante`, `services`, `magasin`, `entreprises`, `tourisme`, `education`, `loisirs`, présence du `main`, titre visible, aucune erreur JS à ce niveau.
- L'ancien test navigateur générique `smoke-browser.mjs` passe 11/16 contrôles ; 5 échecs attendent un ancien onglet « S'installer » propre au site plutôt qu'à la PWA. Ce test n'a pas été remplacé pour le site officiel.
- `node scripts/business-page-classification.test.mjs` : PASS.
- `npm run typecheck` : toujours FAIL sur plusieurs erreurs historiques de chaînes dans `CitizensServices.tsx` et composants d'annonces ; 2 erreurs de traduction dans `AlerteRechercheForm.tsx` ont été corrigées. Ne pas prétendre le typecheck complet résolu.

## Classement supplémentaire — 6 enregistrements
Enregistrements initialement sans pages, identifiés dans Airtable, statut `terminer la saisi` et publication vide :
- `recIcUo0jE9z2u8F3` Fast Auto Service EL HAJ HAMMAMI → `entreprises `, `services citoyens`.
- `rec5B4Vy8v6Uhjjfs` Mestiri Auto Parts → `entreprises `, `commerces & magasins`.
- `rec7n9DwO3Ul5U9R2` Homejek, catégorie Medical / Aide à domicile → `santé`, `services citoyens`.
- `recV9cj7daXjmXZk7` My home, catégorie Conseiller santé / Health consultant → `santé`, `services citoyens`.
- `recuu6PjqtKQyjGmF` MK Finesse Wellness & Care Massage → `santé`, `services citoyens`.
- `rechyeAKgKAPLGSO6` Ibn Sina Medical Center for Cupping and Relaxation Massage → `santé`, `services citoyens`.
- **Synchronisation finale Supabase : 6/6**, **0 publication involontaire**, compteur total toujours **2487**.
- Retour arrière : remettre `liste pages` vide dans Airtable pour ces six records, attendre la synchronisation et vérifier `liste_pages=NULL` dans Supabase ; ne jamais supprimer de fiche ni changer son approbation.

## Garde-fous / limites
- Les fiches restantes sans catégorie explicite ne sont pas classées sur la seule base de leur nom ; les catégories contradictoires restent à examiner.
- Les 155 anciennes fiches visibles mais `approved IS NULL` gardent leur visibilité ; exception `Lessing-Institut` non réconciliée. Aucun changement global de RLS.
- Site officiel et mini-apps : aucun déploiement dans ce lot.
