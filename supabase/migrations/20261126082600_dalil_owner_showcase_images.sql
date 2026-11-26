insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('dalil-owner-showcase','dalil-owner-showcase',true,5242880,array['image/jpeg','image/png','image/webp']);
create policy dalil_owner_showcase_insert on storage.objects for insert to authenticated with check (
 bucket_id='dalil-owner-showcase' and array_length(storage.foldername(name),1)=1
 and storage.filename(name) ~ '^[a-f0-9-]{36}\.(jpg|png|webp)$'
 and exists(select 1 from public.professional_profile_access a where a.user_id=auth.uid() and a.entreprise_id=(storage.foldername(name))[1]));
create trigger dalil_keep_owner_images before update of logo_url,image_url on public.entreprise
for each row execute function public.dalil_keep_owner_profile_fields();
create function public.dalil_save_my_showcase_images(p_id text,p_field text,p_before text,p_images text[]) returns text
language plpgsql security definer set search_path='' as $$
declare e public.entreprise%rowtype; previous text; legacy text[]; url text; prefix text; result text; allowed integer;
begin
 if auth.uid() is null or not exists(select 1 from public.professional_profile_access where user_id=auth.uid() and entreprise_id=p_id) then raise exception 'Accès refusé' using errcode='42501'; end if;
 select * into e from public.entreprise where id=p_id and approved for update;
 if not found or p_field is null or p_field not in ('logo_url','image_url') or p_images is null then raise exception 'Modification invalide'; end if;
 previous:=coalesce(to_jsonb(e)->>p_field,'');
 if previous is distinct from p_before then raise exception 'Les images ont changé. Rechargez la fiche.'; end if;
 select coalesce(array_agg(trim(v)),array[]::text[]) into legacy from regexp_split_to_table(previous,',(?=\s*(https?://|/))') v where trim(v)<>'';
 allowed:=case when p_field='logo_url' then 1 when lower(coalesce(e.statut_abonnement,''))='artisan' then 5 when lower(coalesce(e.statut_abonnement,'')) in ('premium','business','portfolio','elite','custom') then 10 else cardinality(legacy) end;
 if cardinality(p_images)>greatest(allowed,cardinality(legacy)) then raise exception 'Limite de photos atteinte'; end if;
 prefix:='https://kmvjegbtroksjqaqliyv.supabase.co/storage/v1/object/public/dalil-owner-showcase/'||p_id||'/';
 foreach url in array p_images loop
 if url is null or length(url)>4096 then raise exception 'Image invalide'; end if;
 if url=any(legacy) then continue; end if;
 if not starts_with(url,prefix) or substr(url,length(prefix)+1) !~ '^[a-f0-9-]{36}\.(jpg|png|webp)$'
 or not exists(select 1 from storage.objects where bucket_id='dalil-owner-showcase' and name=p_id||'/'||substr(url,length(prefix)+1)) then raise exception 'Image non rattachée'; end if;
 end loop;
 result:=coalesce(array_to_string(p_images,E',\n'),'');
 insert into public.dalil_owner_profile_fields as owned values(p_id,jsonb_build_object(p_field,result)) on conflict(entreprise_id) do update set fields=owned.fields||excluded.fields;
 update public.entreprise set logo_url=logo_url,updated_at=clock_timestamp() where id=p_id returning to_jsonb(entreprise)->>p_field into result;
 return result;
end; $$;
revoke all on function public.dalil_save_my_showcase_images(text,text,text,text[]) from public,anon;
grant execute on function public.dalil_save_my_showcase_images(text,text,text,text[]) to authenticated;