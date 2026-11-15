# Dalil Tounes — revue des 132 approbations restantes — 15 novembre 2026

## But
Identifier les fiches historiques qui peuvent être régularisées sur preuve d'autorisation antérieure, sans approuver des fiches par déduction et sans déployer une RLS stricte qui ferait disparaître des établissements actuellement visibles.

## Vérifications entreprises
Sources en lecture seule : Supabase kmvjegbtroksjqaqliyv/public.entreprise et Airtable base app9Q828Splwvm4jW, table tbl8B6aiFeUe0hoQS.
- 2293 établissements dans Supabase.
- 560 fiches répondent actuellement au prédicat de visibilité RLS public.
- 132 fiches parmi elles sont toujours `approved=NULL` et `statut_validation=publie`.
- 131/132 ont leur correspondant exact Airtable, une fiche **Lessing-Institut** (`recuc8IWvSa7vBFxW`) n'a pas de correspondant.
- 125/132 ont un statut de publication `Publié`, 6 ont `statut_publication=NULL`, 1 au titre de Lessing figure dans les 125. Les six dossiers avec publication vide : Viamercato, Syrine Private School, Chwine Rent a car Mahdia, Bergaoui Prod, TAIEB SAKKA Medical Analysis Laboratory, Mahdia Gym.
- 7/132 possèdent une case « vérifiée » cochée, mais la vérification ne constitue pas à elle seule une autorisation de publier; cf. compte rendu précédent `audit/verif-8-et-publications-vides-2026-11-15.md`, Coin Bio déjà régularisé.
- 28 dossiers sur les 131 appariés ont un commentaire Airtable; 104 n'en ont pas (les comptages du rapport précédent étaient 28/104 avant retrait de Coin Bio et demeurent à affiner selon filtres, vérifier si nécessaire avant diffusion externe).

## Lecture qualitative des commentaires
Exemples de messages WhatsApp envoyés à des professionnels attestent une communication sur l'existence de leur fiche gratuite, mais ne prouvent pas nécessairement une décision de publication administrative ni l'accord/validation du professionnel. On ne coche pas `approved` sur cette seule base.
Cas nécessitant explicitement contact ou complément : boa studio (« contacter client »), Syrine Private School (« vérifier les numéros »), Mahdia Gym (« voir email et site web avec client »), Viamercato (« contacter le client »). D'autres dossiers disposent de sources officielles documentaires mais sans permission administrative explicite.
Sept dossiers « vérifiés » restants : Syrine Private School (publication NULL), boa studio (Publié), Chwine Rent a car Mahdia (publication NULL), Bergaoui Prod (publication NULL), TAIEB SAKKA Medical Analysis Laboratory (publication NULL), Mahdia Gym (publication NULL), tattoo riadh by felfoul (Publié).

## Décisions et garanties
- **Aucune nouvelle approbation accordée** sur les 132 dossiers dans cette revue : absence de preuve écrite aussi claire que les 22 régularisations historiques et Coin Bio.
- **Aucune modification de `statut_publication`, `statut_validation`, `approved`, RLS, code ou infrastructure.**
- Les 132 restent lisibles par le prédicat RLS historique ; c'est le risque à résoudre par revue administrative avant migration, et non un état sécurisé définitif.
- Les 9 `terminer la saisi` restent bloquées.
- Les statuts de production du site `dalil-tounes-clean` et de la PWA `dalil-tounes-pwa` sont READY. Les données validées dans Airtable/Supabase sont déjà appliquées en production; **aucun nouveau build/déploiement Vercel déclenché**, faute de changement de code à mettre en ligne.

## File d'action administrative
1. Examiner les dossiers sans preuve de consentement/publication dans Airtable, en priorité les sept cases « vérifiée » et les six statuts publication=NULL, sans les republier par défaut.
2. Retrouver le lien source de Lessing-Institut; ne pas fusionner sur similarité de nom.
3. Obtenir une décision d'approbation explicite pour les 132 avant de transformer la RLS `approved IS DISTINCT FROM false` en `approved IS TRUE`.
4. Préparer une migration RLS avec simulation d'impact; aujourd'hui un durcissement immédiat pourrait masquer 132 fiches, abaissant le prédicat de 560 à 428, indépendamment des 9 dossiers déjà bloqués.
5. Réaliser la recette navigateur site/PWA sur le domaine public; les statuts Vercel READY ne constituent pas une validation fonctionnelle.

## Requête de reprise
```sql
select id_airtable,nom,approved,statut_validation,statut_publication
from public.entreprise
where approved is null and statut_validation='publie'
  and (statut_publication is null or lower(trim(statut_publication)) in ('publié','publie','published'))
order by id_airtable;
```
