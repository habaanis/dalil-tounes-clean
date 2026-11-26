-- Actual Aux Saveurs owner and existing uploaded photo, all mutations rolled back.
begin;
do $$
declare
  e public.entreprise%rowtype; actor uuid; urls text[]; saved text; rights jsonb;
  uploaded text; changed_rows integer;
begin
  select * into e from public.entreprise where slug_court='aux-saveurs-anis' for update;
  select user_id into actor from public.professional_profile_access where entreprise_id=e.id limit 1;
  if actor is null then raise exception 'Reference owner unavailable'; end if;
  urls:=public.dalil_showcase_image_urls(e.image_url);
  if cardinality(urls) not in (8,9) then raise exception 'Reference gallery changed; review test inputs'; end if;
  select 'https://kmvjegbtroksjqaqliyv.supabase.co/storage/v1/object/public/dalil-owner-showcase/'||name
    into uploaded from storage.objects where bucket_id='dalil-owner-showcase'
    and name=e.id||'/24c93c68-836d-40ff-a59c-a519e21af3ec.jpg';
  if uploaded is null then raise exception 'Reference upload unavailable'; end if;
  urls:=array_remove(urls,uploaded);
  if cardinality(urls)<>8 then raise exception 'Expected eight original reference photos'; end if;
  perform set_config('request.jwt.claim.sub',actor::text,true);
  execute 'set local role authenticated';
  rights:=public.dalil_get_my_showcase_entitlements(e.id);
  if rights->>'plan'<>'premium' or (rights->>'photo_limit')::integer<>10
    or jsonb_array_length(rights->'models')<>2 or jsonb_array_length(rights->'palettes')<>3
    or jsonb_array_length(rights->'openings')<>2 then raise exception 'Premium rights mismatch'; end if;
  saved:=public.dalil_save_my_showcase_images(e.id,'image_url',e.image_url,array_append(urls,uploaded));
  if saved not like '%'||uploaded or (public.dalil_get_my_showcase_entitlements(e.id)->>'photo_count')::integer<>9
    then raise exception 'Actual ninth upload not persisted'; end if;
  -- Replace the first photo by the valid uploaded photo; do not consume a new slot.
  saved:=public.dalil_save_my_showcase_images(e.id,'image_url',saved,array_prepend(uploaded,urls[2:8]));
  if (public.dalil_get_my_showcase_entitlements(e.id)->>'photo_count')::integer<>8 then raise exception 'Replacement failed'; end if;
  saved:=public.dalil_save_my_showcase_images(e.id,'image_url',saved,urls[2:8]);
  if (public.dalil_get_my_showcase_entitlements(e.id)->>'photo_count')::integer<>7 then raise exception 'Explicit removal failed'; end if;
  begin
    perform public.dalil_save_my_showcase_images(e.id,'image_url',e.image_url,urls);
    raise exception 'Stale photo revision accepted';
  exception when serialization_failure then null; end;
  begin
    perform public.dalil_save_my_showcase_images(e.id,'image_url',saved,array_append(urls[2:8],'https://example.invalid/not-uploaded.jpg'));
    raise exception 'Unuploaded photo accepted';
  exception when others then
    if sqlerrm<>'Image non rattachée' then raise; end if;
  end;
  perform set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
  begin
    perform public.dalil_get_my_showcase_entitlements(e.id);
    raise exception 'Foreign account read accepted';
  exception when insufficient_privilege then null; end;
  begin
    perform public.dalil_save_my_showcase_images(e.id,'image_url',saved,urls);
    raise exception 'Foreign account write accepted';
  exception when insufficient_privilege then null; end;
  begin
    update public.entreprise set formule_commerciale='Premium — 59 TND' where id=e.id;
    get diagnostics changed_rows=row_count;
    if changed_rows<>0 then raise exception 'Foreign account direct write accepted'; end if;
  exception when insufficient_privilege then null; end;
  execute 'reset role';
  -- A stale synchronization cannot overwrite a professional's saved references.
  update public.entreprise set image_url=e.image_url where id=e.id;
  if (select image_url from public.entreprise where id=e.id) is distinct from saved
    then raise exception 'Synchronization overwrote owner gallery'; end if;
end;
$$;
rollback;
select 'PASS live rollback: actual Premium rights, ninth upload, replacement, removal, errors, ownership and sync protection' as result;
