# Sécurité des fiches et compteur — plan de correction sans rupture

## État vérifié le 15 novembre 2026
- Base Supabase Dalil Tounes `kmvjegbtroksjqaqliyv`, table `public.entreprise`.
- `select count(*)` de toutes les fiches : **2487**.
- Fonction d'accueil `public.get_enterprise_record_count()` : `select count(*)::bigint from public.entreprise`, `SECURITY DEFINER`, `search_path=''`.
- Le compteur indépendant de la RLS est un invariant métier : **ne jamais ajouter une condition de publication à cette fonction**.
- Ancienne règle de lecture observée : **549** dossiers potentiellement accessibles publiquement.
- Règle hypothétique `approved=true AND statut_validation='publie' AND statut_publication publié` : **384**.
- **155** anciens dossiers visibles avec `approved IS NULL`. Des cas légitimes peuvent s'y trouver, notamment **Coin Bio** (`recH1GnRRVO0y9DiO`), CV Portfolio publié et validé dans Airtable mais `approved=NULL` dans Supabase.
- La différence **165** entre 549 et 384 ne peut pas être masquée sans revue : des lignes ont des statuts de publication `NULL`, certains cas se recoupent avec les 155.

## Mesures obligatoires avant tout durcissement RLS
1. Extraire une photographie des IDs et statuts de toutes les fiches potentiellement impactées ; vérifier les décisions de modération dans Airtable, sans approuver automatiquement les dossiers `NULL`.
2. Reconstituer la validation des CV publiés, des Présences Essentielles légitimes et des fiches en préparation ; repérer les désaccords de synchronisation.
3. Corriger les données légitimes selon un processus documenté et auditable. Aucun changement global `approved=true` par défaut.
4. Préparer une migration SQL avec la politique précédente conservée en texte, un retour arrière, et des tests SQL `SET LOCAL ROLE anon` comparant le résultat attendu.
5. Vérifier **deux consommateurs** de la même table : site officiel `dalil-tounes.com` et PWA `dalil-tounes-pwa.vercel.app`, ainsi que les CV et mini-apps clients, avant toute modification partagée.
6. Tester séparément `get_enterprise_record_count()` avant et après, et refuser toute migration qui réduit le compteur de toutes les fiches à cause de leur statut.
7. Valider avec le propriétaire produit toute disparition de fiche précédemment publiée.

## Contrôles SQL de lecture (pas de modification)
```sql
SELECT count(*) AS total FROM public.entreprise;

SELECT count(*) AS eligible_legacy
FROM public.entreprise
WHERE statut_validation = 'publie'
  AND approved IS DISTINCT FROM false
  AND (statut_publication IS NULL
       OR lower(trim(statut_publication)) IN ('publié','publie','published'));

SELECT count(*) AS strict_visible
FROM public.entreprise
WHERE statut_validation = 'publie'
  AND approved IS TRUE
  AND lower(trim(coalesce(statut_publication,''))) IN ('publié','publie','published');
```

**Statut : plan de correction uniquement.** Aucune RLS modifiée, aucune migration appliquée, aucune suppression de fiche, compteur inchangé à 2487 lors du contrôle.
