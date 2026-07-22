-- Bloque toute lecture publique des demandes et de leurs données personnelles.
-- Les anciens formulaires publics conservent uniquement le droit d'insérer.
-- Les administrateurs authentifiés restent autorisés via public.is_admin().

alter table public.suggestions_entreprises enable row level security;

drop policy if exists "Lecture publique des suggestions" on public.suggestions_entreprises;
drop policy if exists "Lecture pour authentifiés" on public.suggestions_entreprises;

drop policy if exists "Tout le monde peut suggérer une entreprise" on public.suggestions_entreprises;
drop policy if exists "Tout le monde peut suggérer" on public.suggestions_entreprises;
drop policy if exists "Autoriser insertion publique" on public.suggestions_entreprises;
drop policy if exists "Envoi public" on public.suggestions_entreprises;
drop policy if exists "Envoi public toutes demandes" on public.suggestions_entreprises;

create policy "Formulaires publics peuvent inserer"
  on public.suggestions_entreprises
  for insert
  to anon, authenticated
  with check (true);

create policy "Administrateurs peuvent lire les demandes"
  on public.suggestions_entreprises
  for select
  to authenticated
  using ((select public.is_admin()));

revoke all privileges on table public.suggestions_entreprises from anon, authenticated;
grant insert on table public.suggestions_entreprises to anon, authenticated;
grant select on table public.suggestions_entreprises to authenticated;
