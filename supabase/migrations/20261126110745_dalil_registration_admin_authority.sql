-- Keep the existing administrators. Browser clients must never provision their
-- own authority; registrations reuse the persisted admins table only.
begin;

alter table public.admins enable row level security;
revoke all privileges on table public.admins from public, anon, authenticated;
-- Explicit column grants can survive a table-level REVOKE on older schemas.
do $migration$
declare column_name text;
begin
  for column_name in select a.attname from pg_catalog.pg_attribute a
    where a.attrelid = 'public.admins'::regclass and a.attnum > 0 and not a.attisdropped
  loop
    execute format('revoke insert (%I), update (%I), references (%I) on public.admins from public, anon, authenticated',
      column_name, column_name, column_name);
  end loop;
end;
$migration$;

drop policy if exists "Full access" on public.admins;
drop policy if exists "Admin whitelist self insert" on public.admins;
drop policy if exists "Admin whitelist self update" on public.admins;
drop policy if exists "Admins sont visibles par les authentifiés" on public.admins;
drop policy if exists "Admin voit sa fiche admin" on public.admins;
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins for select to authenticated
  using (id = (select auth.uid()));
grant select on public.admins to authenticated;

create or replace function public.dalil_registration_is_admin()
returns boolean language sql stable security definer set search_path = '' as $function$
  select (select auth.uid()) is not null and exists (
    select 1 from public.admins a
    where a.id = (select auth.uid()) and a.role in ('admin', 'super_admin')
  );
$function$;
revoke all on function public.dalil_registration_is_admin() from public, anon;
grant execute on function public.dalil_registration_is_admin() to authenticated, service_role;

-- Existing enterprise policies use profiles.role through is_admin(). Protect
-- that authority without changing users' existing roles or editable details.
create or replace function public.dalil_guard_profile_role()
returns trigger language plpgsql security invoker set search_path = '' as $function$
begin
  if current_user in ('anon', 'authenticated') then
    if (tg_op = 'INSERT' and new.role::text <> 'user')
      or (tg_op = 'UPDATE' and new.role is distinct from old.role) then
      raise exception 'Le rôle du compte ne peut pas être modifié ici.' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$function$;
revoke all on function public.dalil_guard_profile_role() from public, anon, authenticated;
drop trigger if exists dalil_protect_profile_role on public.profiles;
create trigger dalil_protect_profile_role before insert or update of role on public.profiles
  for each row execute function public.dalil_guard_profile_role();
-- TRUNCATE bypasses row policies and is never part of these browser interfaces.
revoke truncate on public.profiles, public.commerciaux from public, anon, authenticated;

notify pgrst, 'reload schema';
commit;
