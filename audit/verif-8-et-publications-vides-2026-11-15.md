# Dalil Tounes — examen ciblé des huit fiches vérifiées et six publications sans statut — 15 novembre 2026

## Utilité du chantier
Avant de rendre la politique RLS stricte, distinguer les établissements dont la publication avait déjà été autorisée des fiches marquées simplement « vérifiées », sans transformer une vérification de coordonnées en autorisation de publier. Éviter de masquer des établissements légitimes ou de publier par erreur des brouillons.

Sources: Supabase `kmvjegbtroksjqaqliyv/public.entreprise`; Airtable `app9Q828Splwvm4jW/tbl8B6aiFeUe0hoQS`. Relecture directe des champs d'approbation, de publication, de vérification et des notes de modération.

## 8 dossiers avec case « date_verif » cochée parmi les 133 approbations historiques

- `recH1GnRRVO0y9DiO` **Coin Bio** : case vérifiée, par anis, `statut_validation=publie`, `Statut de publication=Publié`. Note du 13/11/2026 : « Fiche Supabase CV déjà publiée par décision fondateur » ; fiche cliente reconnue. **Régularisation effectuée** : uniquement case Airtable approved passée de vide à true; synchronisation Supabase vérifiée. Ne pas confondre la validation de la fiche avec l'hébergement des sept médias encore en attente de traitement ; aucun fichier ni URL média modifiés.
- `recEKohWo2RM60dCn` **boa studio - Architecture & Deco** : vérifié par anis, mais note « contacter client » ; approbation non cochée, aucune écriture.
- `recTi0281DdIRxlBO` **tattoo riadh by felfoul** : vérifié par ines, statut Publié mais aucune autorisation de publication écrite retrouvée; aucune écriture.
- `recCst7vomkPR7yOW` **Syrine Private School** : vérifiée, statut de publication vide, note « vérifier les numeros de téléphones » ; aucune écriture.
- `recF3dAAhQuh7issR` **Chwine Rent a car Mahdia** : vérifiée par anis, publication vide; pas de preuve de validation administrative de la publication ; aucune écriture.
- `recNDOaswHZX2TxuP` **Bergaoui Prod** : vérifiée par anis, publication vide; aucune écriture.
- `recppIxboFSy2caVC` **TAIEB SAKKA Medical Analysis Laboratory** : vérifiée par Stéphanie, publication vide; aucune écriture.
- `rectHHPlhjIyNbjON` **Mahdia Gym** : vérifiée par Stéphanie, publication vide, note « Voir pour email et site web avec client » ; aucune écriture.

## 6 fiches où statut_publication est vide
`rec87YWy8trIsGxvm` Viamercato (note « contacter le client »);
`recCst7vomkPR7yOW` Syrine Private School;
`recF3dAAhQuh7issR` Chwine Rent a car Mahdia;
`recNDOaswHZX2TxuP` Bergaoui Prod;
`recppIxboFSy2caVC` TAIEB SAKKA Medical Analysis Laboratory;
`rectHHPlhjIyNbjON` Mahdia Gym.

Toutes les six sont actuellement lisibles selon la politique RLS historique (`approved IS DISTINCT FROM false`, `statut_validation=publie`, et `statut_publication IS NULL` accepté). Aucun statut publication n'a été inventé, aucune case approved cochée. La correction de la politique nécessite une décision de traitement de ces fiches.

## Tests après changement Coin Bio
- Airtable `approved` de Coin Bio = true, `statut_validation=publie`, `publication=Publié`.
- Supabase `approved=true` confirmé après synchronisation.
- 132 fiches historiques encore éligibles au public mais `approved=NULL`.
- Total éligible au public 560, inchangé; total des établissements 2293 inchangé.
- Neuf « terminer la saisi » examinées dans le lot précédent toujours bloquées.
- Pas de modification RLS, pas de déploiement Vercel, pas de modification des données commerciales ni des médias.

## Prochaine action
Revoir les 132 autres dossiers et produire une liste de décisions de publication avec justification (preuve antérieure, sinon contrôle administratif). Traiter séparément le cas Lessing-Institut sans correspondance Airtable. Avant de remplacer le prédicat RLS permissif, estimer précisément l'impact et exécuter des tests recherche/détail côté site et PWA.
