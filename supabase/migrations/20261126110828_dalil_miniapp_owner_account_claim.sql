-- A professional can receive access only to the reviewed, paid, published
-- dossier that names their server-confirmed email address. No browser-supplied
-- email, role, company id or user metadata can establish ownership.
begin;

create or replace function public.dalil_link_reviewed_miniapp_owner(
  p_request_id uuid, p_owner_user_id uuid, p_actor_id uuid
) returns boolean language plpgsql security definer set search_path = '' as $function$
declare
  dossier public.dalil_miniapp_onboarding%rowtype;
  inserted_count integer;
begin
  if auth.uid() is null or p_actor_id is distinct from auth.uid() then
    raise exception 'Accès refusé.' using errcode = '42501';
  end if;
  select * into dossier from public.dalil_miniapp_onboarding
    where suggestion_id = p_request_id for update;
  if not found or dossier.entreprise_id is null
    or dossier.payment_confirmed_at is null or dossier.published_at is null
    or dossier.confirmed_plan is null or dossier.confirmed_plan not in ('artisan', 'premium')
    or dossier.payment_confirmed_by is null or dossier.published_by is null then
    return false;
  end if;
  if not exists (select 1 from auth.users u where u.id = p_owner_user_id
    and u.email_confirmed_at is not null
    and lower(btrim(u.email)) = dossier.owner_email
    and coalesce(u.is_anonymous, false) = false
    and u.deleted_at is null and (u.banned_until is null or u.banned_until <= now())) then
    return false;
  end if;
  if (select count(*) from auth.users u where lower(btrim(u.email)) = dossier.owner_email
    and u.email_confirmed_at is not null and coalesce(u.is_anonymous, false) = false
    and u.deleted_at is null and (u.banned_until is null or u.banned_until <= now())) <> 1 then
    return false;
  end if;
  -- The bound UID is durable even if the owner later changes their email.
  if dossier.owner_user_id is not null and dossier.owner_user_id <> p_owner_user_id then
    return false;
  end if;
  perform 1 from public.entreprise where id = dossier.entreprise_id for update;
  if not found then return false; end if;
  if exists (select 1 from public.professional_profile_access
    where entreprise_id = dossier.entreprise_id and user_id <> p_owner_user_id) then
    return false;
  end if;
  insert into public.professional_profile_access(user_id, entreprise_id, granted_by)
    values(p_owner_user_id, dossier.entreprise_id, p_actor_id)
    on conflict (user_id, entreprise_id) do nothing;
  get diagnostics inserted_count = row_count;
  if dossier.owner_user_id is distinct from p_owner_user_id
    or dossier.owner_linked_at is null or inserted_count > 0 then
    update public.dalil_miniapp_onboarding set
      owner_user_id = p_owner_user_id, owner_linked_at = coalesce(owner_linked_at, now()),
      version = version + 1, updated_at = now()
      where suggestion_id = p_request_id;
    insert into public.dalil_miniapp_onboarding_events(suggestion_id, action, actor_id, details)
      values(p_request_id, 'owner_linked', p_actor_id,
        jsonb_build_object('entreprise_id', dossier.entreprise_id, 'owner_user_id', p_owner_user_id));
  end if;
  return true;
end;
$function$;
revoke all on function public.dalil_link_reviewed_miniapp_owner(uuid, uuid, uuid)
  from public, anon, authenticated, service_role;

create or replace function public.dalil_admin_registration_link_account(
  p_request_id uuid, p_expected_version integer
) returns jsonb language plpgsql security definer set search_path = '' as $function$
declare
  dossier public.dalil_miniapp_onboarding%rowtype;
  matched_users uuid[];
begin
  if not public.dalil_registration_is_admin() then
    raise exception 'Accès administrateur requis.' using errcode = '42501';
  end if;
  select * into dossier from public.dalil_miniapp_onboarding
    where suggestion_id = p_request_id for update;
  if not found then raise exception 'Dossier introuvable.' using errcode = '22023'; end if;
  if dossier.payment_confirmed_at is null or dossier.published_at is null then
    raise exception 'Confirmez le paiement et publiez la mini-appli avant le rattachement.' using errcode = '22023';
  end if;
  select array_agg(u.id order by u.id) into matched_users from auth.users u
    where lower(btrim(u.email)) = dossier.owner_email and u.email_confirmed_at is not null
      and coalesce(u.is_anonymous, false) = false
      and u.deleted_at is null and (u.banned_until is null or u.banned_until <= now());
  if coalesce(cardinality(matched_users), 0) <> 1 then
    raise exception 'Un compte propriétaire unique avec email confirmé est requis.' using errcode = '22023';
  end if;
  -- Retrying a completed link does not create a second grant or event. All other
  -- stale writes must refresh the dossier before changing it.
  if p_expected_version is null or (p_expected_version <> dossier.version and not (
    dossier.owner_user_id is not distinct from matched_users[1] and dossier.owner_linked_at is not null
    and exists(select 1 from public.professional_profile_access
      where user_id = matched_users[1] and entreprise_id = dossier.entreprise_id)
  )) then
    raise exception 'Ce dossier a changé. Actualisez avant de réessayer.' using errcode = '40001';
  end if;
  if not public.dalil_link_reviewed_miniapp_owner(p_request_id, matched_users[1], auth.uid()) then
    raise exception 'Rattachement impossible : vérifiez le dossier et le propriétaire existant.' using errcode = '42501';
  end if;
  return public.dalil_registration_snapshot(p_request_id);
end;
$function$;
revoke all on function public.dalil_admin_registration_link_account(uuid, integer) from public, anon;
grant execute on function public.dalil_admin_registration_link_account(uuid, integer) to authenticated;

create or replace function public.dalil_claim_my_miniapps()
returns jsonb language plpgsql security definer set search_path = '' as $function$
declare
  actor uuid := auth.uid();
  verified_email text;
  dossier record;
  claimed text[] := array[]::text[];
  conflicts integer := 0;
begin
  if actor is null then raise exception 'Connexion requise.' using errcode = '42501'; end if;
  select lower(btrim(u.email)) into verified_email from auth.users u
    where u.id = actor and u.email_confirmed_at is not null
      and coalesce(u.is_anonymous, false) = false
      and u.deleted_at is null and (u.banned_until is null or u.banned_until <= now());
  if verified_email is null or verified_email = '' then
    return jsonb_build_object('claimed', claimed, 'conflicts', 0, 'requires_confirmation', true);
  end if;
  for dossier in select suggestion_id, entreprise_id from public.dalil_miniapp_onboarding
    where owner_email = verified_email and payment_confirmed_at is not null and published_at is not null
    order by suggestion_id for update
  loop
    if public.dalil_link_reviewed_miniapp_owner(dossier.suggestion_id, actor, actor) then
      claimed := array_append(claimed, dossier.entreprise_id);
    else
      conflicts := conflicts + 1;
    end if;
  end loop;
  return jsonb_build_object('claimed', claimed, 'conflicts', conflicts, 'requires_confirmation', false);
end;
$function$;
revoke all on function public.dalil_claim_my_miniapps() from public, anon;
grant execute on function public.dalil_claim_my_miniapps() to authenticated;

notify pgrst, 'reload schema';
commit;
