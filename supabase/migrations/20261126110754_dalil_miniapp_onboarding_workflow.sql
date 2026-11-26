-- A submitted request is never evidence of payment or business ownership.
-- Only the existing, protected administrators can review and advance this workflow.
create table public.dalil_miniapp_onboarding (
  suggestion_id uuid primary key references public.suggestions_entreprises(id) on delete restrict,
  entreprise_id text not null unique references public.entreprise(id) on delete restrict,
  company_created boolean not null,
  owner_email text not null check (owner_email = lower(btrim(owner_email)) and owner_email ~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'),
  reviewed_dossier jsonb not null check (jsonb_typeof(reviewed_dossier) = 'object'),
  version integer not null default 1 check (version > 0),
  confirmed_plan text check (confirmed_plan in ('artisan', 'premium')),
  payment_amount numeric(10,2),
  payment_reference text,
  payment_received_at timestamptz,
  payment_confirmed_at timestamptz,
  payment_confirmed_by uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  published_by uuid references auth.users(id) on delete set null,
  owner_linked_at timestamptz,
  owner_user_id uuid references auth.users(id) on delete restrict,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((payment_confirmed_at is null and confirmed_plan is null) or
    (payment_confirmed_at is not null and confirmed_plan is not null and payment_amount > 0
      and nullif(btrim(payment_reference), '') is not null and payment_received_at is not null)),
  check (published_at is null or payment_confirmed_at is not null),
  check (owner_user_id is null or (published_at is not null and owner_linked_at is not null))
);
create unique index dalil_miniapp_payment_reference_unique on public.dalil_miniapp_onboarding(lower(btrim(payment_reference)))
  where payment_confirmed_at is not null;
create index dalil_miniapp_owner_email_idx on public.dalil_miniapp_onboarding(owner_email)
  where published_at is not null and owner_user_id is null;
alter table public.dalil_miniapp_onboarding enable row level security;
revoke all on public.dalil_miniapp_onboarding from public, anon, authenticated;
grant select, insert, update on public.dalil_miniapp_onboarding to service_role;

create table public.dalil_miniapp_onboarding_events (
  id uuid primary key default gen_random_uuid(),
  suggestion_id uuid not null references public.suggestions_entreprises(id) on delete restrict,
  action text not null,
  actor_id uuid references auth.users(id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index dalil_miniapp_events_request_idx on public.dalil_miniapp_onboarding_events(suggestion_id, created_at);
alter table public.dalil_miniapp_onboarding_events enable row level security;
revoke all on public.dalil_miniapp_onboarding_events from public, anon, authenticated;
grant select, insert on public.dalil_miniapp_onboarding_events to service_role;

-- Internal invoker helpers are not API entry points.
create function public.dalil_registration_validate_dossier(p_dossier jsonb, p_plan text, p_require_logo boolean)
returns jsonb language plpgsql immutable set search_path = '' as $$
declare d jsonb := p_dossier; k text; v text; social_count integer; max_photos integer;
begin
  if p_plan is null or p_plan not in ('artisan','premium') or jsonb_typeof(d) is distinct from 'object'
    or octet_length(d::text) > 40000 then
    raise exception 'Dossier de création invalide.' using errcode = '22023';
  end if;
  foreach k in array array['companyName','city','sector','phone','email','activityDescription'] loop
    if jsonb_typeof(d->k) is distinct from 'string' or nullif(btrim(d->>k),'') is null
      or length(d->>k) > (case when k='activityDescription' then 10000 else 500 end) then
      raise exception 'Dossier incomplet : %.', k using errcode = '22023';
    end if;
  end loop;
  if (d->>'email') !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'
    or (d->>'presentationModel') is null or (d->>'presentationModel') not in ('business','portfolio')
    or (d->>'palette') is null or (d->>'palette') not in ('prestige','ivory','night')
    or (d->>'openingStyle') is null or (d->>'openingStyle') not in ('photo','framed')
    or coalesce(d->>'logoChoice','none') not in ('none','existing','create') then
    raise exception 'Vérifiez l’e-mail, le modèle, la palette et l’ouverture.' using errcode = '22023';
  end if;
  if jsonb_typeof(d->'photoUrls') is distinct from 'array' or jsonb_typeof(d->'socialLinks') is distinct from 'object' then
    raise exception 'Liste de photos ou de liens invalide.' using errcode='22023';
  end if;
  max_photos := case p_plan when 'artisan' then 5 else 10 end;
  if jsonb_array_length(d->'photoUrls') > max_photos then
    raise exception 'La formule autorise % photos de présentation.', max_photos using errcode='22023';
  end if;
  for v in select value from jsonb_array_elements_text(d->'photoUrls') loop
    if length(v)>4096 or v !~* '^https?://[^[:space:]/]+[^[:space:]]*$' then
      raise exception 'Lien de photo invalide.' using errcode='22023';
    end if;
  end loop;
  if (select count(*) from jsonb_array_elements_text(d->'photoUrls')) <>
    (select count(distinct value) from jsonb_array_elements_text(d->'photoUrls')) then
    raise exception 'Une photo est présente plusieurs fois.' using errcode='22023';
  end if;
  foreach k in array array['logoUrl','googleMapsUrl','googleReviewsUrl'] loop
    v := coalesce(d->>k,'');
    if v<>'' and (length(v)>4096 or v !~* '^https?://[^[:space:]/]+[^[:space:]]*$') then
      raise exception 'Lien invalide : %.', k using errcode='22023';
    end if;
  end loop;
  foreach k in array array['facebook','instagram','tiktok','youtube','linkedin','website','other','googleBusiness'] loop
    v := coalesce(d->'socialLinks'->>k,'');
    if v<>'' and (length(v)>4096 or v !~* '^https?://[^[:space:]/]+[^[:space:]]*$') then
      raise exception 'Lien invalide : %.', k using errcode='22023';
    end if;
  end loop;
  select count(*) into social_count from unnest(array['facebook','instagram','tiktok','youtube','linkedin','other']) as networks(network_key)
    where nullif(btrim(d->'socialLinks'->>networks.network_key),'') is not null;
  if p_plan='artisan' and social_count>2 then
    raise exception 'La formule Artisan autorise deux réseaux sociaux.' using errcode='22023';
  end if;
  if p_require_logo and d->>'logoChoice' in ('existing','create') and nullif(btrim(d->>'logoUrl'),'') is null then
    raise exception 'Ajoutez le logo prévu dans le dossier avant la publication.' using errcode='22023';
  end if;
  return d || jsonb_build_object('schemaVersion',1,'plan',p_plan,
    'pricing',jsonb_build_object('currency','TND','creationAmount',case p_plan when 'artisan' then 30 else 59 end,
      'logoAmount',case when d->>'logoChoice'='create' then 20 else 0 end,
      'totalAmount',(case p_plan when 'artisan' then 30 else 59 end)+(case when d->>'logoChoice'='create' then 20 else 0 end),
      'firstYearIncluded',true,'maintenanceAnnualAmount',50,'maintenanceOptional',true));
end;
$$;
revoke all on function public.dalil_registration_validate_dossier(jsonb,text,boolean) from public,anon,authenticated;

create function public.dalil_registration_snapshot(p_id uuid)
returns jsonb language plpgsql stable set search_path = '' as $$
declare s public.suggestions_entreprises%rowtype; o public.dalil_miniapp_onboarding%rowtype;
  e public.entreprise%rowtype; state text; account_state text; matched_uid uuid; confirmed_at timestamptz; public_slug text;
  matching_accounts integer; active_account boolean;
begin
  select * into s from public.suggestions_entreprises where id=p_id;
  if not found then raise exception 'Dossier introuvable.' using errcode='22023'; end if;
  select * into o from public.dalil_miniapp_onboarding where suggestion_id=p_id;
  if found then select * into e from public.entreprise where id=o.entreprise_id; end if;
  state := case when o.owner_linked_at is not null then 'active' when o.published_at is not null then 'published'
    when o.payment_confirmed_at is not null then 'paid' when o.suggestion_id is not null then 'draft' else 'received' end;
  account_state := 'not_ready';
  if o.published_at is not null then
    if o.owner_user_id is not null then
      account_state := case when exists(select 1 from public.professional_profile_access a where a.user_id=o.owner_user_id and a.entreprise_id=o.entreprise_id)
        then 'linked' else 'conflict' end;
    else
      select count(*)::integer,(array_agg(u.id order by u.id))[1],max(u.email_confirmed_at),
        bool_and(coalesce(u.is_anonymous,false)=false and u.deleted_at is null and (u.banned_until is null or u.banned_until<=now()))
        into matching_accounts,matched_uid,confirmed_at,active_account from auth.users u where lower(btrim(u.email))=o.owner_email;
      account_state := case when matching_accounts=0 then 'missing' when matching_accounts<>1 or active_account is not true then 'conflict'
        when confirmed_at is null then 'unverified'
        when exists(select 1 from public.professional_profile_access a where a.entreprise_id=o.entreprise_id and a.user_id<>matched_uid) then 'conflict'
        else 'ready' end;
    end if;
  end if;
  public_slug := coalesce(nullif(e.slug_court,''),nullif(e.slug,''),e.id);
  return jsonb_build_object(
    'id',s.id,'version',coalesce(o.version,0),'created_at',s.created_at,'name',coalesce(s.nom_entreprise,''),
    'city',s.ville,'email',coalesce(nullif(s.email,''),s.email_suggesteur),'phone',coalesce(nullif(s.telephone,''),s.contact_suggere),
    'requested_plan',s.pack_type,'status',state,'legacy',s.creation_dossier is null,'source_message',coalesce(s.message,s.raison_suggestion,''),
    'creation_dossier',s.creation_dossier,'reviewed_dossier',o.reviewed_dossier,'owner_email',o.owner_email,
    'entreprise_id',o.entreprise_id,'company_name',e.nom,'company_created',coalesce(o.company_created,false),
    'confirmed_plan',o.confirmed_plan,'payment_amount',o.payment_amount,'payment_reference',o.payment_reference,
    'payment_received_at',o.payment_received_at,'payment_confirmed_at',o.payment_confirmed_at,
    'published_at',o.published_at,'owner_linked_at',o.owner_linked_at,
    'public_url',case when o.published_at is not null and e.cv_business_status='published' and e.approved is true then 'https://app.dalil-tounes.com/'||public_slug||'/cv' else null end,
    'account_url',case when o.published_at is not null then 'https://app.dalil-tounes.com/'||public_slug||'/compte' else null end,
    'integration_status',coalesce(s.integration_status,'{}'::jsonb),'account_status',account_state,
    'assets_ready',case when o.suggestion_id is null then false
      when coalesce(o.reviewed_dossier->>'logoChoice','none')='none' then true
      else nullif(btrim(o.reviewed_dossier->>'logoUrl'),'') is not null
        and coalesce(e.logo_url,'')=o.reviewed_dossier->>'logoUrl' end);
end;
$$;
revoke all on function public.dalil_registration_snapshot(uuid) from public,anon,authenticated;

create function public.dalil_admin_registration_list(p_search text default '',p_limit integer default 100)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare dossiers jsonb; businesses jsonb; refresh_id uuid; term text:=left(coalesce(btrim(p_search),''),200);
begin
  if auth.uid() is null or not public.dalil_registration_is_admin() then raise exception 'Accès administrateur requis.' using errcode='42501'; end if;
  for refresh_id in select id from public.suggestions_entreprises
    where source_page='subscription' and pack_type in ('artisan','premium') and type_demande='demande_abonnement'
      and (term='' or concat_ws(' ',nom_entreprise,ville,email,email_suggesteur,telephone,contact_suggere,id::text) ilike '%'||term||'%')
    order by created_at desc limit greatest(1,least(coalesce(p_limit,100),100))
  loop
    perform public.dalil_registration_refresh_delivery_status(refresh_id);
  end loop;
  select coalesce(jsonb_agg(public.dalil_registration_snapshot(id) order by created_at desc),'[]'::jsonb) into dossiers
  from (select id,created_at from public.suggestions_entreprises
    where source_page='subscription' and pack_type in ('artisan','premium') and type_demande='demande_abonnement'
      and (term='' or concat_ws(' ',nom_entreprise,ville,email,email_suggesteur,telephone,contact_suggere,id::text) ilike '%'||term||'%')
    order by created_at desc limit greatest(1,least(coalesce(p_limit,100),100))) selected;
  select coalesce(jsonb_agg(jsonb_build_object('id',id,'name',coalesce(nom,''),'city',ville,
    'plan',coalesce(public.dalil_showcase_plan(formule_commerciale),public.dalil_showcase_plan(statut_abonnement),'unconfirmed'),
    'approved',coalesce(approved,false),'slug',coalesce(slug_court,slug,id)) order by nom),'[]'::jsonb) into businesses
  from (select * from public.entreprise where (term='' or concat_ws(' ',nom,ville,email,telephone,id) ilike '%'||term||'%')
    order by nom limit 50) selected;
  return jsonb_build_object('dossiers',dossiers,'businesses',businesses);
end;
$$;
revoke all on function public.dalil_admin_registration_list(text,integer) from public,anon;
grant execute on function public.dalil_admin_registration_list(text,integer) to authenticated;

create function public.dalil_admin_registration_prepare(p_request_id uuid,p_expected_version integer,p_business_id text,p_owner_email text,p_dossier jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare s public.suggestions_entreprises%rowtype; o public.dalil_miniapp_onboarding%rowtype; e public.entreprise%rowtype;
  d jsonb; company_id text; new_company boolean; slug_value text; owner_mail text:=lower(btrim(p_owner_email));
begin
  if auth.uid() is null or not public.dalil_registration_is_admin() then raise exception 'Accès administrateur requis.' using errcode='42501'; end if;
  select * into s from public.suggestions_entreprises where id=p_request_id for update;
  if not found or s.source_page is distinct from 'subscription' or s.type_demande is distinct from 'demande_abonnement'
    or s.pack_type is null or s.pack_type not in ('artisan','premium') then raise exception 'Dossier de création introuvable.' using errcode='22023'; end if;
  select * into o from public.dalil_miniapp_onboarding where suggestion_id=p_request_id for update;
  if p_expected_version is distinct from coalesce(o.version,0) then raise exception 'Le dossier a changé. Rechargez-le.' using errcode='40001'; end if;
  if o.payment_confirmed_at is not null then raise exception 'Le dossier payé est figé. Complétez seulement les éléments à livrer.'; end if;
  if owner_mail is null or length(owner_mail)>320 or owner_mail !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then
    raise exception 'E-mail du propriétaire invalide.' using errcode='22023'; end if;
  d:=public.dalil_registration_validate_dossier(p_dossier,s.pack_type,false);
  if o.suggestion_id is not null then
    if p_business_id is not null and p_business_id<>o.entreprise_id then raise exception 'Le rattachement de ce dossier est déjà fixé.' using errcode='22023'; end if;
    company_id:=o.entreprise_id; new_company:=o.company_created;
  elsif nullif(btrim(p_business_id),'') is not null then
    select * into e from public.entreprise where id=p_business_id for update;
    if not found then raise exception 'Établissement introuvable.' using errcode='22023'; end if;
    if exists(select 1 from public.dalil_miniapp_onboarding where entreprise_id=p_business_id) then
      raise exception 'Cet établissement possède déjà un dossier de création.' using errcode='22023'; end if;
    company_id:=e.id; new_company:=false;
  else
    company_id:=gen_random_uuid()::text; new_company:=true;
    slug_value:=btrim(regexp_replace(lower(translate(d->>'companyName','àâäçéèêëîïôöùûüÿ','aaaceeeeiioouuuy')),'[^a-z0-9]+','-','g'),'-');
    slug_value:=coalesce(nullif(left(slug_value,48),''),'mini-appli')||'-'||left(replace(company_id,'-',''),8);
    insert into public.entreprise(id,nom,slug,slug_court,approved,statut_validation,statut_publication,cv_business_status,created_at,updated_at)
      values(company_id,d->>'companyName',slug_value,slug_value,false,'en_attente','Brouillon','ordered',now(),now());
  end if;
  -- Existing businesses keep all their content, URLs and historical rights.
  if new_company then
    update public.entreprise set nom=d->>'companyName',adresse=coalesce(d->>'address',''),telephone=d->>'phone',
      email=d->>'email',ville=d->>'city',gouvernorat=coalesce(d->>'governorate',''),categorie=array[d->>'sector'],
      description=d->>'activityDescription',a_propos=d->>'activityDescription',services=coalesce(d->>'productsDescription',''),
      horaires_ok=coalesce(d->>'openingHours',''),logo_url=coalesce(d->>'logoUrl',''),
      image_url=(select coalesce(string_agg(value,','||chr(10) order by ordinal),'') from jsonb_array_elements_text(d->'photoUrls') with ordinality photos(value,ordinal)),
      "BTN_Maps"=coalesce(nullif(d->>'googleMapsUrl',''),d->'socialLinks'->>'googleBusiness',''),"Lien Avis Google"=coalesce(d->>'googleReviewsUrl',''),
      "lien facebook"=coalesce(d->'socialLinks'->>'facebook',''),"Lien Instagram"=coalesce(d->'socialLinks'->>'instagram',''),
      "Lien TikTok"=coalesce(d->'socialLinks'->>'tiktok',''),"Lien YouTube"=coalesce(d->'socialLinks'->>'youtube',''),
      "Lien LinkedIn"=coalesce(d->'socialLinks'->>'linkedin',''),lien_x=coalesce(d->'socialLinks'->>'other',''),site_web=coalesce(d->'socialLinks'->>'website',''),
      whatsapp=coalesce(d->'socialLinks'->>'whatsapp',''),modele_cv=d->>'presentationModel',palette_cv=d->>'palette',
      opening_style=d->>'openingStyle',palette_cv_user_selected=true,updated_at=clock_timestamp()
      where id=company_id;
  end if;
  insert into public.dalil_miniapp_onboarding(suggestion_id,entreprise_id,company_created,owner_email,reviewed_dossier,created_by)
    values(p_request_id,company_id,new_company,owner_mail,d,auth.uid())
    on conflict(suggestion_id) do update set owner_email=excluded.owner_email,reviewed_dossier=excluded.reviewed_dossier,
      version=dalil_miniapp_onboarding.version+1,updated_at=clock_timestamp();
  insert into public.dalil_miniapp_onboarding_events(suggestion_id,action,actor_id,details)
    values(p_request_id,'draft_reviewed',auth.uid(),jsonb_build_object('entreprise_id',company_id,'company_created',new_company));
  return public.dalil_registration_snapshot(p_request_id);
end;
$$;
revoke all on function public.dalil_admin_registration_prepare(uuid,integer,text,text,jsonb) from public,anon;
grant execute on function public.dalil_admin_registration_prepare(uuid,integer,text,text,jsonb) to authenticated;

create function public.dalil_admin_registration_confirm_payment(p_request_id uuid,p_expected_version integer,p_plan text,p_amount numeric,p_reference text,p_received_at timestamptz)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare o public.dalil_miniapp_onboarding%rowtype; e public.entreprise%rowtype; d jsonb; expected_amount numeric; existing_plan text;
begin
  if auth.uid() is null or not public.dalil_registration_is_admin() then raise exception 'Accès administrateur requis.' using errcode='42501'; end if;
  select * into o from public.dalil_miniapp_onboarding where suggestion_id=p_request_id for update;
  if not found then raise exception 'Préparez et vérifiez le dossier avant de confirmer le virement.' using errcode='22023'; end if;
  if o.payment_confirmed_at is not null then
    if o.confirmed_plan=p_plan and o.payment_amount=p_amount and o.payment_reference=btrim(p_reference) and o.payment_received_at=p_received_at then
      return public.dalil_registration_snapshot(p_request_id);
    end if;
    raise exception 'Un virement a déjà été confirmé pour ce dossier.' using errcode='22023';
  end if;
  if p_expected_version is distinct from o.version then raise exception 'Le dossier a changé. Rechargez-le.' using errcode='40001'; end if;
  d:=public.dalil_registration_validate_dossier(o.reviewed_dossier,p_plan,false);
  expected_amount:=(d->'pricing'->>'totalAmount')::numeric;
  if p_amount is distinct from expected_amount or nullif(btrim(p_reference),'') is null or length(btrim(p_reference)) not between 3 and 180
    or p_received_at is null or p_received_at>now()+interval '5 minutes' or p_received_at<'2020-01-01'::timestamptz then
    raise exception 'Virement invalide : montant attendu % TND, référence et date de réception requises.',expected_amount using errcode='22023';
  end if;
  select * into e from public.entreprise where id=o.entreprise_id for update;
  existing_plan:=public.dalil_resolve_showcase_entitlements(e)->>'plan';
  if existing_plan='legacy' or (existing_plan='premium' and p_plan='artisan') then
    raise exception 'Cette opération réduirait les droits acquis de l’établissement.' using errcode='22023'; end if;
  update public.dalil_miniapp_onboarding set confirmed_plan=p_plan,payment_amount=p_amount,payment_reference=btrim(p_reference),
    payment_received_at=p_received_at,payment_confirmed_at=clock_timestamp(),payment_confirmed_by=auth.uid(),reviewed_dossier=d,
    version=version+1,updated_at=clock_timestamp() where suggestion_id=p_request_id;
  insert into public.dalil_miniapp_onboarding_events(suggestion_id,action,actor_id,details)
    values(p_request_id,'payment_confirmed',auth.uid(),jsonb_build_object('plan',p_plan,'amount',p_amount,'currency','TND','reference',btrim(p_reference),'received_at',p_received_at));
  return public.dalil_registration_snapshot(p_request_id);
end;
$$;
revoke all on function public.dalil_admin_registration_confirm_payment(uuid,integer,text,numeric,text,timestamptz) from public,anon;
grant execute on function public.dalil_admin_registration_confirm_payment(uuid,integer,text,numeric,text,timestamptz) to authenticated;

create function public.dalil_admin_registration_finish_assets(p_request_id uuid,p_expected_version integer,p_logo_url text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare o public.dalil_miniapp_onboarding%rowtype; d jsonb; saved_logo text;
begin
  if auth.uid() is null or not public.dalil_registration_is_admin() then raise exception 'Accès administrateur requis.' using errcode='42501'; end if;
  select * into o from public.dalil_miniapp_onboarding where suggestion_id=p_request_id for update;
  if not found or o.payment_confirmed_at is null or o.published_at is not null
    or o.reviewed_dossier->>'logoChoice' not in ('existing','create') then
    raise exception 'Le logo prévu au dossier peut être livré après paiement et avant publication.' using errcode='22023'; end if;
  if p_expected_version is distinct from o.version then raise exception 'Le dossier a changé. Rechargez-le.' using errcode='40001'; end if;
  if nullif(btrim(p_logo_url),'') is null then raise exception 'Ajoutez le lien du logo livré.' using errcode='22023'; end if;
  d:=public.dalil_registration_validate_dossier(o.reviewed_dossier||jsonb_build_object('logoUrl',btrim(p_logo_url)),o.confirmed_plan,true);
  insert into public.dalil_owner_profile_fields as owned(entreprise_id,fields)
    values(o.entreprise_id,jsonb_build_object('logo_url',d->>'logoUrl'))
    on conflict(entreprise_id) do update set fields=owned.fields||excluded.fields;
  update public.entreprise set logo_url=d->>'logoUrl',updated_at=clock_timestamp() where id=o.entreprise_id returning logo_url into saved_logo;
  if saved_logo is distinct from d->>'logoUrl' then raise exception 'Enregistrement du logo non confirmé.'; end if;
  update public.dalil_miniapp_onboarding set reviewed_dossier=d,version=version+1,updated_at=clock_timestamp() where suggestion_id=p_request_id;
  insert into public.dalil_miniapp_onboarding_events(suggestion_id,action,actor_id) values(p_request_id,'logo_delivered',auth.uid());
  return public.dalil_registration_snapshot(p_request_id);
end;
$$;
revoke all on function public.dalil_admin_registration_finish_assets(uuid,integer,text) from public,anon;
grant execute on function public.dalil_admin_registration_finish_assets(uuid,integer,text) to authenticated;

create function public.dalil_admin_registration_publish(p_request_id uuid,p_expected_version integer)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare o public.dalil_miniapp_onboarding%rowtype; e public.entreprise%rowtype; rights jsonb; d jsonb; stored jsonb;
begin
  if auth.uid() is null or not public.dalil_registration_is_admin() then raise exception 'Accès administrateur requis.' using errcode='42501'; end if;
  select * into o from public.dalil_miniapp_onboarding where suggestion_id=p_request_id for update;
  if not found or o.payment_confirmed_at is null then raise exception 'Le virement doit être confirmé avant la publication.' using errcode='22023'; end if;
  if o.published_at is not null then return public.dalil_registration_snapshot(p_request_id); end if;
  if p_expected_version is distinct from o.version then raise exception 'Le dossier a changé. Rechargez-le.' using errcode='40001'; end if;
  d:=public.dalil_registration_validate_dossier(o.reviewed_dossier,o.confirmed_plan,true);
  select * into e from public.entreprise where id=o.entreprise_id for update;
  if not found or nullif(btrim(e.nom),'') is null or nullif(btrim(e.ville),'') is null
    or (coalesce(array_length(e.categorie,1),0)=0 and nullif(btrim(e.sous_categories_texte),'') is null)
    or (nullif(btrim(e.telephone),'') is null and nullif(btrim(e.email),'') is null)
    or nullif(btrim(coalesce(e.a_propos,e.description)),'') is null then
    raise exception 'La fiche doit contenir le nom, l’activité, la ville, un contact et une présentation.' using errcode='22023'; end if;
  if d->>'logoChoice' in ('existing','create') and coalesce(e.logo_url,'') is distinct from d->>'logoUrl' then
    raise exception 'Le logo prévu au dossier doit être enregistré sur la fiche avant publication.' using errcode='22023'; end if;
  rights:=public.dalil_resolve_showcase_entitlements(e);
  if rights->>'plan'='legacy' or (rights->>'plan'='premium' and o.confirmed_plan='artisan') then
    raise exception 'Les droits acquis ont changé. La publication ne peut pas les réduire.' using errcode='22023'; end if;
  -- Preserve acquired assets/choices before applying the explicitly verified purchase.
  stored:=case when o.company_created then jsonb_build_object(
    'image_url',coalesce(e.image_url,''),'logo_url',coalesce(e.logo_url,''),'adresse',coalesce(e.adresse,''),
    'telephone',coalesce(e.telephone,''),'email',coalesce(e.email,''),'whatsapp',coalesce(e.whatsapp,''),'site_web',coalesce(e.site_web,''),
    'BTN_Maps',coalesce(e."BTN_Maps",''),'Lien Avis Google',coalesce(e."Lien Avis Google",''),'horaires_ok',coalesce(e.horaires_ok,''),
    'a_propos',coalesce(e.a_propos,''),'lien facebook',coalesce(e."lien facebook",''),'Lien Instagram',coalesce(e."Lien Instagram",''),
    'Lien TikTok',coalesce(e."Lien TikTok",''),'Lien YouTube',coalesce(e."Lien YouTube",''),'Lien LinkedIn',coalesce(e."Lien LinkedIn",''),'lien_x',coalesce(e.lien_x,''),
    'modele_cv',e.modele_cv,'palette_cv',e.palette_cv,'opening_style',e.opening_style,'palette_cv_user_selected',true)
    else '{}'::jsonb end;
  insert into public.dalil_owner_profile_fields as preserved(entreprise_id,fields,preserved_rights)
    values(e.id,stored,rights) on conflict(entreprise_id) do update set preserved_rights=excluded.preserved_rights,
      fields=preserved.fields||excluded.fields;
  update public.dalil_miniapp_onboarding set published_at=clock_timestamp(),published_by=auth.uid(),version=version+1,updated_at=clock_timestamp()
    where suggestion_id=p_request_id;
  update public.entreprise set statut_abonnement=case o.confirmed_plan when 'artisan' then 'Artisan' else 'Premium' end,
    formule_commerciale=case o.confirmed_plan when 'artisan' then 'Artisan — 30 TND' else 'Premium — 59 TND' end,
    is_premium=true,approved=true,statut_validation='publie',statut_publication='Publié',cv_business_status='published',
    cv_business_paid_at=coalesce(cv_business_paid_at,o.payment_received_at),cv_business_published_at=coalesce(cv_business_published_at,clock_timestamp()),
    updated_at=clock_timestamp() where id=e.id returning * into e;
  if e.cv_business_status is distinct from 'published' or e.approved is not true
    or public.dalil_resolve_showcase_entitlements(e)->>'plan' is distinct from o.confirmed_plan then
    raise exception 'La publication et les droits n’ont pas été confirmés.';
  end if;
  update public.suggestions_entreprises set statut='traite' where id=p_request_id;
  insert into public.dalil_miniapp_onboarding_events(suggestion_id,action,actor_id,details)
    values(p_request_id,'published',auth.uid(),jsonb_build_object('entreprise_id',e.id,'plan',o.confirmed_plan));
  return public.dalil_registration_snapshot(p_request_id);
end;
$$;
revoke all on function public.dalil_admin_registration_publish(uuid,integer) from public,anon;
grant execute on function public.dalil_admin_registration_publish(uuid,integer) to authenticated;

-- An old external sync cannot overwrite a purchase confirmed through this workflow.
-- All pre-existing businesses without an onboarding record keep their current behavior.
create function public.dalil_keep_verified_miniapp_plan()
returns trigger language plpgsql security definer set search_path = '' as $$
declare paid_plan text;
begin
  select confirmed_plan into paid_plan from public.dalil_miniapp_onboarding where entreprise_id=new.id and published_at is not null;
  if paid_plan is not null then
    new.statut_abonnement:=case paid_plan when 'artisan' then 'Artisan' else 'Premium' end;
    new.formule_commerciale:=case paid_plan when 'artisan' then 'Artisan — 30 TND' else 'Premium — 59 TND' end;
    new.is_premium:=true;
  end if;
  return new;
end;
$$;
revoke all on function public.dalil_keep_verified_miniapp_plan() from public,anon,authenticated;
create trigger dalil_keep_verified_miniapp_plan before update of statut_abonnement,formule_commerciale,is_premium on public.entreprise
  for each row execute function public.dalil_keep_verified_miniapp_plan();
