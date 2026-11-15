# Revue de livraison PWA et protection des publications — 15 novembre 2026

## Déploiement vérifié
- Projet Vercel : `dalil-tounes-pwa` (`prj_AJeQ8yjK2rQCPwQOG9R1CgDvKQmE`), **sans déploiement** de `dalil-tounes-clean`.
- Déploiement de production `dpl_Nzkvt55JuyyKfAvXYfWddKH9HfHv`, commit `6a80dfb53263ebbfda6f3f2e332ad6f72b219ceb`, état `READY`.
- Alias servi : `dalil-tounes-pwa.vercel.app`.
- Routage des scopes PWA partagé : `sante`, `services`, `magasin`, `entreprises`, `tourisme`, `education`, `loisirs`.
- Le test JS est enregistré dans `scripts/business-page-classification.test.mjs`. Le build Vercel est vérifié ; aucune exécution de ce test indépendant n'a été confirmée depuis le connecteur.

## Comptage et visibilité
- Total Supabase observé : **2487** fiches enregistrées. L'accueil conserve `get_enterprise_record_count()`, indépendant des statuts.
- Ancienne règle de publication : environ **549** fiches éligibles à la visibilité ; hypothèse strictement `approved=true` + marqueur publié : **384**.
- **155** fiches précédemment visibles ont `approved IS NULL`. Parmi celles-ci, **149** portent `statut_publication='Publié'` et **6** ont `statut_publication=NULL` avec `statut_validation='publie'`.
- Les 6 derniers cas identifiés : `Bergaoui Prod`, `Chwine Rent a car Mahdia`, `Mahdia Gym`, `Syrine Private School`, `TAIEB SAKKA Medical Analysis Laboratory`, `Viamercato`.
- Vérification directe dans Airtable : les 6 portent **`statut_validation=publie`**, liste de pages renseignée et **pas de marqueur de publication renseigné**. Il n'est pas prudent de les masquer ni de les approuver en masse avant revue humaine de leur décision de modération.
- Le contrôle du contenu ne vaut pas validation du circuit RLS. **Aucune politique RLS n'a été modifiée** : le site officiel et les mini-applications partagent la base.

## Ce qui est terminé
- 36 entreprises attribuées à des pages multiples sur les lots réellement confirmés.
- Automatisation Airtable de publication conditionnée à `Prêt à publier`.
- Filtres de scope unifiés dans `Businesses.tsx` uniquement si `isPlatformAppMode()`.
- PWA déployée et alias de production vérifié.
- Comptage Supabase inchangé.

## Ce qui n'est pas clôturable sans examen additionnel
1. Revue métier et traces de modération des 155 fiches `approved IS NULL`, dont les 6 sans marqueur de publication.
2. Migration RLS et validation sur site officiel + mini-apps + PWA (impact partagé).
3. Exécution explicite des tests unitaires et parcours navigateur de la recherche sur les 7 scopes. `READY` confirme la compilation, pas ces tests.
4. Inventaire des autres fiches dont `liste_pages` est vide, puis classement par lots seulement sur données métiers certaines.

**Ne pas qualifier la sécurité RLS ni tout le chantier de terminés.**
