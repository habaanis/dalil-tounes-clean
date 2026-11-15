# Dalil Tounes — Régularisation des approbations historiques et contrôle des 9 dossiers incomplets — 15 novembre 2026

## Références
Supabase `kmvjegbtroksjqaqliyv`, table `public.entreprise`. Airtable base `app9Q828Splwvm4jW`, table `tbl8B6aiFeUe0hoQS`.
Suite du rapport `audit/reconciliation-publication-175-2026-11-15.md` et du correctif `audit/correction-11-validations-publiees-2026-11-15.md`.

## Contrôle des neuf « terminer la saisi »
Neuf fiches possèdent `approved=true` et `statut_publication='Publié'` mais `statut_validation='terminer la saisi'` dans Airtable et Supabase. Vérification des commentaires et de la complétude:
- `recYiwGDkSkGi6yCz` Décoma — score 2, commentaire de contrôle documentaire sans vérification téléphonique, conserver le blocage.
- `recBTG8fhwR8uNLaX` Djerba Immo Vision — score 1, simple référencement local, conserver le blocage.
- `recGFjy5SFVyS59Qb` Dunes bois — score 2, contrôle documentaire sans vérification téléphonique, conserver le blocage.
- `recATCDoiTCkIvrxM` El Batoul Ste Immobilière & Services — score 1, référencement local, conserver le blocage.
- `recVyQOPPXTBTRJ7I` Immobilière Gafsa — score 1, référencement local, conserver le blocage.
- `recQYPAKUKhcrUG3K` LADOUS Real Estate Company — score 6 mais téléphone et description absents, conserver le blocage.
- `recn4RkyAVeTvLfib` Tecnocasa Hammamet Center — score 7 mais description absente, conserver le blocage.
- `reckXzEIUWgm1XErn` Tecnocasa Mahdia Tourist Zone — score 7 et vérification par Anis, commentaire explicite « contacter client », conserver le blocage jusqu'au retour client.
- `recTb4godAYSBO4Kc` Zarrouk Real Estate — score 7, commentaire de modération signalant l'e-mail incomplet/invalide; conserver le blocage.

**Aucune écriture sur ces neuf dossiers.**

## Régularisation de 22 approbations déjà autorisées
Une analyse de 155 fiches rendues lisibles par RLS avec `approved=NULL` a identifié **22 fiches Airtable** dont les commentaires du 05/11/2026 indiquent expressément une vérification documentaire de l'identité/activité/coordonnées et « Publication autorisée par Anis dans cette conversation ». Pour chacune, `statut_validation='publie'`, `Statut de publication='Publié'` et le correspondant Supabase avait `approved=NULL`.

La seule modification Airtable a été la case `fldXnmgyyySVC5E3z` (`approved`) passée à `true`. Aucun autre champ, commentaire, catégorie, rubrique, statut de publication, RLS ou code modifié.

Identifiants exacts:
`rec7y4LNwZX9kNR4A`, `rec8bq8nh8KWGnsWN`, `rec9scrIopo9iWgbG`, `recAFRXk4bhGvTBeK`, `recF3bRLDz4lLbcjw`, `recF4HOiYi0SYhfkc`, `recJH83tTyPQw4bKF`, `recLRNeLcQxilJqps`, `recOUCEgXS20Yg9he`, `recOWNP12okEFZUiw`, `recQpqwo2cGPdOU0s`, `recR7dFfv9PmidlbL`, `recSL7lSzx1ARCh59`, `recc79ENqYnkbxssr`, `recctk3qOHJ4tMIs5`, `reci3V2wtdTE38cju`, `recjGZv53j1p4XVch`, `recns37nnIOYNw303`, `recpkQBPSRljvjpHr`, `recuumzuav6gLwf6t`, `recy4y16W9EopAdIB`, `recyzoigbkN8bK4BC`.

## Vérification Supabase après synchronisation Airtable
- 22/22 identifiants correspondants avec `approved=true`, `statut_validation='publie'`, `statut_publication='Publié'`.
- Nombre total de lignes Supabase: 2293 (inchangé).
- RLS publique, décompte des fiches éligibles à la lecture: 560 (inchangé). Les 22 étaient déjà visibles; on a régularisé leur approbation historique, pas créé de nouvelles publications.
- Fiches historiquement accessibles avec `approved=NULL`: 155 -> **133**.
- 9 dossiers « terminer la saisi » restent bloqués.
- Aucune modification des politiques RLS et aucun déploiement Vercel.

## Reste à réconcilier : 133 dossiers
Parmi les 133: 132 correspondent à Airtable, 1 sans correspondance (`recuc8IWvSa7vBFxW`, Lessing-Institut), 6 avec publication Airtable/Supabase NULL, 8 portent une case de vérification cochée, 28 ont des commentaires de modération et 104 n'en ont pas. Il faut lire les commentaires en contexte: une mention « aucun refus » ou « ne pas renvoyer » dans un historique WhatsApp n'est pas une opposition à publication. **Ne jamais inférer une approbation de cette terminologie.**

Les 6 avec `statut_publication=NULL` sont Viamercato, Syrine Private School, Chwine Rent a car Mahdia, Bergaoui Prod, TAIEB SAKKA Medical Analysis Laboratory et Mahdia Gym. Leur traitement doit privilégier la correction des données avec accord administratif.

Pour reprendre sans reconstituer les identifiants:
```sql
SELECT id_airtable, nom, approved, statut_validation, statut_publication
FROM public.entreprise
WHERE approved IS NULL
  AND statut_validation='publie'
  AND (statut_publication IS NULL OR lower(trim(statut_publication)) IN ('publié','publie','published'))
ORDER BY id_airtable;
```

## Prochaines étapes
1. Relecture administrative des 8 « vérifiées » sans autorisation de publication explicite.
2. Revue des 6 avec statut_publication NULL et du dossier Lessing-Institut.
3. Revue des commentaires des autres dossiers ; ne cocher approved que lorsqu'une autorisation vérifiable existe.
4. Réévaluer ensuite la politique RLS permissive `approved IS DISTINCT FROM false` et préparer une migration testée; appliquer directement `approved IS TRUE` masquerait à ce stade 133 fiches.
5. Recette en vrai navigateur site/PWA distincte des contrôles SQL : recherche, détail, QR, boutique, compte et FR/AR.

## Garantie
Aucune approbation nouvelle sans autorisation antérieure écrite, aucune fiche supprimée, aucun changement RLS, aucune publication créée dans cette opération.
