-- One resolver for the existing commercial fields, owner editors and write RPCs.
-- Never infer a paid plan from an active flag, a photo count or a published CV.
alter table public.dalil_owner_profile_fields
  add column if not exists preserved_rights jsonb not null default '{}'::jsonb;

create or replace function public.dalil_showcase_image_urls(p_raw text)
returns text[] language sql immutable set search_path = '' as $$
  select coalesce(array_agg(url order by position), array[]::text[])
  from (
    select regexp_replace(btrim(value), ',[[:space:]]*$', '') as url, position
    from regexp_split_to_table(
      replace(replace(coalesce(p_raw, ''), chr(92) || 'n', chr(10)), chr(92) || 'r', chr(13)),
      '[,\n\r]+[[:space:]]*(?=https?://|/)'
    ) with ordinality as parts(value, position)
  ) parsed where url <> '';
$$;
revoke all on function public.dalil_showcase_image_urls(text) from public, anon, authenticated;

create or replace function public.dalil_showcase_plan(p_value text)
returns text language sql immutable set search_path = '' as $$
  select case
    when lower(btrim(coalesce(p_value, ''))) ~ '^artisan([[:space:]—–-]|$)' then 'artisan'
    when lower(btrim(coalesce(p_value, ''))) ~ '^premium([[:space:]—–-]|$)' then 'premium'
    when lower(btrim(coalesce(p_value, ''))) ~ '^(elite|élite|custom|pack personnalis)' then 'legacy'
    when lower(btrim(coalesce(p_value, ''))) in ('business', 'portfolio') then 'legacy'
    when lower(btrim(coalesce(p_value, ''))) ~ '^(gratuit|free|découverte|decouverte|présence essentielle)' then 'free'
    else null end;
$$;
revoke all on function public.dalil_showcase_plan(text) from public, anon, authenticated;

create or replace function public.dalil_resolve_showcase_entitlements(e public.entreprise)
returns jsonb language plpgsql stable set search_path = '' as $$
declare
  commercial text := public.dalil_showcase_plan(e.formule_commerciale);
  historical text := public.dalil_showcase_plan(e.statut_abonnement);
  plan text; source text; saved jsonb; photos integer; socials integer;
  photo_base integer; social_base integer; models jsonb; palettes jsonb; openings jsonb;
  current_model text; current_palette text; current_opening text; uncertain boolean;
begin
  select preserved_rights into saved from public.dalil_owner_profile_fields where entreprise_id = e.id;
  saved := coalesce(saved, '{}'::jsonb);
  -- Contradictory named plans require review; preserve the existing assets meanwhile.
  uncertain := commercial is not null and historical is not null and commercial <> historical;
  plan := case when uncertain then 'unconfirmed' else coalesce(commercial, historical, 'unconfirmed') end;
  source := case when uncertain then 'conflicting_fields' when commercial is not null then 'formule_commerciale'
    when historical is not null then 'statut_abonnement' else 'existing_assets_only' end;
  if plan = 'free' then plan := 'unconfirmed'; end if;
  uncertain := uncertain or plan = 'unconfirmed';
  photos := cardinality(public.dalil_showcase_image_urls(e.image_url));
  select count(*) into socials from unnest(array['lien facebook','Lien Instagram','Lien TikTok','Lien LinkedIn','Lien YouTube','lien_x']) k
    where nullif(btrim(to_jsonb(e)->>k), '') is not null;
  photo_base := case plan when 'artisan' then 5 when 'premium' then 10 when 'legacy' then 10 else 0 end;
  social_base := case plan when 'artisan' then 2 when 'premium' then 6 when 'legacy' then 6 else 0 end;
  current_model := case when lower(coalesce(e.modele_cv,'')) like '%portfolio%' then 'portfolio' else 'business' end;
  current_opening := case when e.opening_style = 'framed' then 'framed' else 'photo' end;
  current_palette := case when e.palette_cv_user_selected is not true and e.statut_carte = '⭐ CERTIFIÉ DALIL TOUNES' then 'ivory'
    when lower(coalesce(e.palette_cv,'')) in ('night','ivory') then lower(e.palette_cv) else 'prestige' end;
  models := case when plan in ('premium','legacy') then '["business","portfolio"]'::jsonb
    else coalesce(saved->'models',jsonb_build_array(current_model)) end;
  palettes := case when plan in ('premium','legacy') then '["prestige","ivory","night"]'::jsonb
    else coalesce(saved->'palettes',jsonb_build_array(current_palette)) end;
  openings := case when plan in ('premium','legacy') then '["photo","framed"]'::jsonb
    else coalesce(saved->'openings',jsonb_build_array(current_opening)) end;
  return jsonb_build_object(
    'plan',plan,'source',source,'confirmation_required',uncertain,
    'base_photo_limit',photo_base,'photo_count',photos,
    'photo_limit',greatest(photo_base,photos,coalesce((saved->>'photo_limit')::integer,0)),
    'social_count',socials,'social_limit',greatest(social_base,socials,coalesce((saved->>'social_limit')::integer,0)),
    'models',models,'palettes',palettes,'openings',openings,
    'current_model',current_model,'current_palette',current_palette,'current_opening',current_opening);
end;
$$;
revoke all on function public.dalil_resolve_showcase_entitlements(public.entreprise) from public, anon, authenticated;

create or replace function public.dalil_get_my_showcase_entitlements(p_id text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare e public.entreprise%rowtype;
begin
  if auth.uid() is null or not exists(select 1 from public.professional_profile_access where user_id=auth.uid() and entreprise_id=p_id)
    then raise exception 'Accès refusé' using errcode='42501'; end if;
  select * into e from public.entreprise where id=p_id and approved is true;
  if not found then raise exception 'Fiche indisponible' using errcode='42501'; end if;
  return public.dalil_resolve_showcase_entitlements(e);
end;
$$;
revoke all on function public.dalil_get_my_showcase_entitlements(text) from public, anon;
grant execute on function public.dalil_get_my_showcase_entitlements(text) to authenticated;

-- Freeze existing capacities before edits can reduce the number of legacy photos/links.
insert into public.dalil_owner_profile_fields as owned(entreprise_id,fields,preserved_rights)
select e.id,'{}'::jsonb,public.dalil_resolve_showcase_entitlements(e)
from public.entreprise e
where exists(select 1 from public.professional_profile_access a where a.entreprise_id=e.id)
on conflict(entreprise_id) do update set preserved_rights=excluded.preserved_rights;

-- Avoid regex escaping differences between local files and remotely applied SQL.
alter policy dalil_owner_showcase_insert on storage.objects with check (
  bucket_id='dalil-owner-showcase' and array_length(storage.foldername(name),1)=1
  and storage.filename(name) ~ '^[a-f0-9-]{36}[.](jpg|png|webp)$'
  and exists(select 1 from public.professional_profile_access a
    where a.user_id=auth.uid() and a.entreprise_id=(storage.foldername(name))[1]));

create or replace function public.dalil_save_my_showcase_images(p_id text,p_field text,p_before text,p_images text[])
returns text language plpgsql security definer set search_path='' as $$
declare e public.entreprise%rowtype; previous text; legacy text[]; url text; prefix text;
  result text; rights jsonb; allowed integer; wanted text;
begin
  if auth.uid() is null or not exists(select 1 from public.professional_profile_access where user_id=auth.uid() and entreprise_id=p_id)
    then raise exception 'Accès refusé' using errcode='42501'; end if;
  select * into e from public.entreprise where id=p_id and approved is true for update;
  if not found or p_field is null or p_field not in ('logo_url','image_url') or p_images is null
    then raise exception 'Modification invalide'; end if;
  previous:=coalesce(to_jsonb(e)->>p_field,'');
  if previous is distinct from p_before then raise exception 'Les images ont changé. Rechargez la fiche.' using errcode='40001'; end if;
  legacy:=public.dalil_showcase_image_urls(previous);
  rights:=public.dalil_resolve_showcase_entitlements(e);
  allowed:=case when p_field='logo_url' then greatest(1,cardinality(legacy)) else (rights->>'photo_limit')::integer end;
  if cardinality(p_images)>allowed then raise exception 'Limite de photos atteinte' using errcode='22023'; end if;
  prefix:='https://kmvjegbtroksjqaqliyv.supabase.co/storage/v1/object/public/dalil-owner-showcase/'||p_id||'/';
  foreach url in array p_images loop
    if url is null or url='' or length(url)>4096 or url<>btrim(url) then raise exception 'Image invalide'; end if;
    if url=any(legacy) then continue; end if;
    if not starts_with(url,prefix) or substr(url,length(prefix)+1) !~ '^[a-f0-9-]{36}[.](jpg|png|webp)$'
      or not exists(select 1 from storage.objects where bucket_id='dalil-owner-showcase' and name=p_id||'/'||substr(url,length(prefix)+1))
      then raise exception 'Image non rattachée'; end if;
  end loop;
  wanted:=coalesce(array_to_string(p_images,','||chr(10)),'');
  insert into public.dalil_owner_profile_fields as owned(entreprise_id,fields,preserved_rights)
    values(p_id,jsonb_build_object(p_field,wanted),rights)
    on conflict(entreprise_id) do update set fields=owned.fields||excluded.fields,preserved_rights=excluded.preserved_rights;
  update public.entreprise set logo_url=logo_url,updated_at=clock_timestamp() where id=p_id
    returning to_jsonb(entreprise)->>p_field into result;
  if result is distinct from wanted then raise exception 'Enregistrement non confirmé'; end if;
  return result;
end;
$$;
revoke all on function public.dalil_save_my_showcase_images(text,text,text,text[]) from public,anon;
grant execute on function public.dalil_save_my_showcase_images(text,text,text,text[]) to authenticated;

create or replace function public.dalil_save_my_profile_fields(p_id text,p_before jsonb,p_changes jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare e public.entreprise%rowtype; k text; val text; snapshot jsonb; merged jsonb; rights jsonb;
  social text[]:=array['lien facebook','Lien Instagram','Lien TikTok','Lien LinkedIn','Lien YouTube','lien_x'];
begin
  if auth.uid() is null or not exists(select 1 from public.professional_profile_access where user_id=auth.uid() and entreprise_id=p_id)
    then raise exception 'Accès refusé' using errcode='42501'; end if;
  select * into e from public.entreprise where id=p_id and approved is true for update;
  if not found then raise exception 'Fiche indisponible'; end if;
  if jsonb_typeof(p_changes) is distinct from 'object' or jsonb_typeof(p_before) is distinct from 'object' or p_changes='{}'::jsonb
    then raise exception 'Modification vide'; end if;
  snapshot:=to_jsonb(e);
  rights:=public.dalil_resolve_showcase_entitlements(e);
  for k in select jsonb_object_keys(p_changes) loop
    if not(k=any(social||array['adresse','telephone','whatsapp','email','site_web','BTN_Maps','Lien Avis Google','horaires_ok','a_propos']))
      then raise exception 'Champ non autorisé'; end if;
    if not(p_before ? k) or coalesce(snapshot->>k,'') is distinct from p_before->>k then raise exception 'La fiche a changé. Rechargez-la.'; end if;
    if jsonb_typeof(p_changes->k) <> 'string' then raise exception 'Valeur invalide'; end if;
    val:=p_changes->>k;
    if length(val)>(case when k='a_propos' then 10000 else 2048 end) then raise exception 'Valeur trop longue'; end if;
    if val<>'' and k=any(social||array['site_web','BTN_Maps','Lien Avis Google']) and val !~* '^https?://[^[:space:]/]+[^[:space:]]*$' then raise exception 'Lien invalide'; end if;
    if k='email' and val<>'' and val !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then raise exception 'E-mail invalide'; end if;
  end loop;
  merged:=snapshot||p_changes;
  if (select count(*) from unnest(social) s where nullif(btrim(merged->>s),'') is not null) > (rights->>'social_limit')::integer
    then raise exception 'Limite de réseaux sociaux atteinte' using errcode='22023'; end if;
  insert into public.dalil_owner_profile_fields as owned(entreprise_id,fields,preserved_rights) values(p_id,p_changes,rights)
    on conflict(entreprise_id) do update set fields=owned.fields||excluded.fields,preserved_rights=excluded.preserved_rights;
  update public.entreprise set adresse=adresse,updated_at=clock_timestamp() where id=p_id returning to_jsonb(entreprise) into merged;
  if exists(select 1 from jsonb_each(p_changes) change where merged->change.key is distinct from change.value)
    then raise exception 'Enregistrement non confirmé'; end if;
  return (select jsonb_object_agg(key,merged->key) from jsonb_object_keys(p_changes) key);
end;
$$;

-- Owner choices use the same protection against stale Airtable synchronizations.
create trigger dalil_keep_owner_presentation before update of modele_cv,opening_style,palette_cv,palette_cv_user_selected
  on public.entreprise for each row execute function public.dalil_keep_owner_profile_fields();

create or replace function public.dalil_update_my_cv_presentation(p_entreprise_id text,p_modele_cv text,p_opening_style text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare e public.entreprise%rowtype; rights jsonb; changes jsonb; result jsonb; model text; opening text;
begin
  if auth.uid() is null or not exists(select 1 from public.professional_profile_access where user_id=auth.uid() and entreprise_id=p_entreprise_id)
    then raise exception 'Accès refusé' using errcode='42501'; end if;
  select * into e from public.entreprise where id=p_entreprise_id and approved is true for update;
  if not found then raise exception 'Fiche indisponible' using errcode='42501'; end if;
  rights:=public.dalil_resolve_showcase_entitlements(e);
  model:=lower(btrim(coalesce(p_modele_cv,''))); opening:=lower(btrim(coalesce(p_opening_style,'')));
  if not (rights->'models' ? model) or not (rights->'openings' ? opening)
    then raise exception 'Ce choix ne fait pas partie de vos droits actuels' using errcode='42501'; end if;
  changes:=jsonb_build_object('modele_cv',model,'opening_style',opening);
  insert into public.dalil_owner_profile_fields as owned(entreprise_id,fields,preserved_rights) values(e.id,changes,rights)
    on conflict(entreprise_id) do update set fields=owned.fields||excluded.fields,preserved_rights=excluded.preserved_rights;
  update public.entreprise set modele_cv=model,opening_style=opening,updated_at=clock_timestamp() where id=e.id returning to_jsonb(entreprise) into result;
  if result->>'modele_cv' is distinct from model or result->>'opening_style' is distinct from opening then raise exception 'Enregistrement non confirmé'; end if;
  return jsonb_build_object('entreprise_id',e.id,'modele_cv',model,'opening_style',opening);
end;
$$;

create or replace function public.dalil_update_my_cv_palette(p_entreprise_id text,p_palette text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare e public.entreprise%rowtype; rights jsonb; palette text; result text;
begin
  if auth.uid() is null or not exists(select 1 from public.professional_profile_access where user_id=auth.uid() and entreprise_id=p_entreprise_id)
    then raise exception 'Accès refusé' using errcode='42501'; end if;
  select * into e from public.entreprise where id=p_entreprise_id and approved is true for update;
  if not found then raise exception 'Fiche indisponible' using errcode='42501'; end if;
  rights:=public.dalil_resolve_showcase_entitlements(e); palette:=lower(btrim(coalesce(p_palette,'')));
  if not (rights->'palettes' ? palette) then raise exception 'Cette palette ne fait pas partie de vos droits actuels' using errcode='42501'; end if;
  insert into public.dalil_owner_profile_fields as owned(entreprise_id,fields,preserved_rights)
    values(e.id,jsonb_build_object('palette_cv',palette,'palette_cv_user_selected',true),rights)
    on conflict(entreprise_id) do update set fields=owned.fields||excluded.fields,preserved_rights=excluded.preserved_rights;
  update public.entreprise set palette_cv=palette,palette_cv_user_selected=true,updated_at=clock_timestamp() where id=e.id returning palette_cv into result;
  if result is distinct from palette then raise exception 'Enregistrement non confirmé'; end if;
  return jsonb_build_object('entreprise_id',e.id,'palette_cv',palette);
end;
$$;
revoke all on function public.dalil_update_my_cv_presentation(text,text,text) from public,anon;
revoke all on function public.dalil_update_my_cv_palette(text,text) from public,anon;
grant execute on function public.dalil_update_my_cv_presentation(text,text,text) to authenticated;
grant execute on function public.dalil_update_my_cv_palette(text,text) to authenticated;
