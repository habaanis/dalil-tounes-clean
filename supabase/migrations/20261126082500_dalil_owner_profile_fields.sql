create table public.dalil_owner_profile_fields (
 entreprise_id text primary key references public.entreprise(id) on delete cascade,
 fields jsonb not null default '{}'::jsonb
);
alter table public.dalil_owner_profile_fields enable row level security;
revoke all on public.dalil_owner_profile_fields from public,anon,authenticated;

create function public.dalil_keep_owner_profile_fields() returns trigger
language plpgsql security definer set search_path='' as $$
declare changes jsonb;
begin
 select fields into changes from public.dalil_owner_profile_fields where entreprise_id=new.id;
 if changes is not null then new:=jsonb_populate_record(new,changes); end if;
 return new;
end; $$;
revoke all on function public.dalil_keep_owner_profile_fields() from public,anon,authenticated;
create trigger dalil_keep_owner_profile_fields before update of adresse,telephone,whatsapp,email,site_web,"BTN_Maps","Lien Avis Google",horaires_ok,"lien facebook","Lien Instagram","Lien TikTok","Lien LinkedIn","Lien YouTube",lien_x,a_propos on public.entreprise
for each row execute function public.dalil_keep_owner_profile_fields();

create function public.dalil_save_my_profile_fields(p_id text,p_before jsonb,p_changes jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare e public.entreprise%rowtype; k text; val text; snapshot jsonb; merged jsonb;
social text[]:=array['lien facebook','Lien Instagram','Lien TikTok','Lien LinkedIn','Lien YouTube','lien_x'];
begin
 if auth.uid() is null or not exists(select 1 from public.professional_profile_access where user_id=auth.uid() and entreprise_id=p_id) then raise exception 'Accès refusé' using errcode='42501'; end if;
 select * into e from public.entreprise where id=p_id and approved for update;
 if not found then raise exception 'Fiche indisponible'; end if;
 if jsonb_typeof(p_changes) is distinct from 'object' or jsonb_typeof(p_before) is distinct from 'object' or p_changes='{}'::jsonb then raise exception 'Modification vide'; end if;
 snapshot:=to_jsonb(e);
 for k in select jsonb_object_keys(p_changes) loop
 if not(k=any(social||array['adresse','telephone','whatsapp','email','site_web','BTN_Maps','Lien Avis Google','horaires_ok','a_propos'])) then raise exception 'Champ non autorisé'; end if;
 if not(p_before ? k) or coalesce(snapshot->>k,'') is distinct from p_before->>k then raise exception 'La fiche a changé. Rechargez-la.'; end if;
 if jsonb_typeof(p_changes->k) <> 'string' then raise exception 'Valeur invalide'; end if;
 val:=p_changes->>k;
 if length(val)>(case when k='a_propos' then 10000 else 2048 end) then raise exception 'Valeur trop longue'; end if;
 if val<>'' and k=any(social||array['site_web','BTN_Maps','Lien Avis Google']) and val !~* '^https?://[^[:space:]/]+[^[:space:]]*$' then raise exception 'Lien invalide'; end if;
 if k='email' and val<>'' and val !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'E-mail invalide'; end if;
 end loop;
 merged:=snapshot||p_changes;
 if lower(concat_ws(' ',e.formule_commerciale,e.statut_abonnement)) like '%artisan%' and
 (select count(*) from unnest(social) s where coalesce(merged->>s,'')<>'') > greatest(2,(select count(*) from unnest(social) s where coalesce(snapshot->>s,'')<>'')) then raise exception 'Deux réseaux maximum pour la formule Artisan'; end if;
 insert into public.dalil_owner_profile_fields as owned values(p_id,p_changes) on conflict(entreprise_id) do update set fields=owned.fields||excluded.fields;
 update public.entreprise set adresse=adresse,updated_at=clock_timestamp() where id=p_id returning to_jsonb(entreprise) into merged;
 return (select jsonb_object_agg(key,merged->key) from jsonb_object_keys(p_changes) key);
end; $$;
revoke all on function public.dalil_save_my_profile_fields(text,jsonb,jsonb) from public,anon;
grant execute on function public.dalil_save_my_profile_fields(text,jsonb,jsonb) to authenticated;