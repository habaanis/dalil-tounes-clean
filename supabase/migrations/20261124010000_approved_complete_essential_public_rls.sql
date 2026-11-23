-- Publication de fiches Essentielles: uniquement les enregistrements explicitement
-- approuves (approved=true) et suffisants pour une carte utilisable.
-- Aucune limite d'abonnement; ne publie pas les fiches non approuvees,
-- brouillons ou depourvues d'activite/contact/localisation.
create policy "Approved complete essential businesses are publicly readable"
on public.entreprise
for select
to anon, authenticated
using (
  approved is true
  and statut_validation = 'terminer la saisi'
  and (statut_publication is null or lower(btrim(statut_publication)) in ('publie','publié','published'))
  and nullif(btrim(nom),'') is not null
  and (coalesce(array_length(categorie,1),0) > 0 or nullif(btrim(sous_categories_texte),'') is not null)
  and (nullif(btrim(ville),'') is not null or nullif(btrim(gouvernorat),'') is not null)
  and (nullif(btrim(telephone),'') is not null or nullif(btrim(email),'') is not null or nullif(btrim(site_web),'') is not null)
);
