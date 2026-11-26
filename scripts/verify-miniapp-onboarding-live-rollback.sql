-- Execute only after the four onboarding migrations, with the existing database
-- administration connection. This is an assertion script, not a migration.
-- It never writes auth.users, admins, profiles or the real Aux Saveurs record.
-- It never invokes Edge Functions, delivery jobs, signup, email or real payments.
-- All business/request/access fixtures disappear at the mandatory ROLLBACK.
-- Do not replace ROLLBACK with COMMIT or execute isolated fragments.
begin;
set local statement_timeout = '30s';
set local lock_timeout = '3s';

do $qa$
declare
  admin_uid uuid;
  owner_uid uuid;
  other_uid uuid;
  owner_mail text;
  unknown_uid constant uuid := 'da110099-2026-4112-8112-000000000099';
  request_a constant uuid := 'da110001-2026-4112-8112-000000000001';
  request_b constant uuid := 'da110002-2026-4112-8112-000000000002';
  dossier jsonb;
  a jsonb;
  b jsonb;
  response jsonb;
  previous_version integer;
  received_at timestamptz := now() - interval '1 minute';
  count_rows integer;
  admins_before text;
  auth_before text;
  aux_before jsonb;
  aux_access_before jsonb;
begin
  if exists(select 1 from auth.users where id=unknown_uid)
    or exists(select 1 from public.suggestions_entreprises where id in (request_a,request_b)) then
    raise exception 'QA fixture identity already exists; stop without changing it.';
  end if;

  -- Read existing identities; never create or edit them. Excluding all existing
  -- dossiers for this email ensures self-claim can only touch our two fixtures.
  select u.id into admin_uid from auth.users u join public.admins ad on ad.id=u.id
    where ad.role in ('admin','super_admin') and u.email_confirmed_at is not null
      and u.deleted_at is null and not coalesce(u.is_anonymous,false)
      and (u.banned_until is null or u.banned_until<=now()) order by u.id limit 1;
  select u.id,lower(btrim(u.email)) into owner_uid,owner_mail from auth.users u
    where u.email_confirmed_at is not null and u.deleted_at is null
      and not coalesce(u.is_anonymous,false) and (u.banned_until is null or u.banned_until<=now())
      and nullif(btrim(u.email),'') is not null
      and not exists(select 1 from public.admins ad where ad.id=u.id)
      and not exists(select 1 from public.professional_profile_access ac where ac.user_id=u.id)
      and not exists(select 1 from public.dalil_miniapp_onboarding o where o.owner_email=lower(btrim(u.email)))
    order by u.id limit 1;
  select u.id into other_uid from auth.users u where u.id<>owner_uid
    and u.email_confirmed_at is not null and u.deleted_at is null
    and not coalesce(u.is_anonymous,false) and (u.banned_until is null or u.banned_until<=now())
    and not exists(select 1 from public.admins ad where ad.id=u.id) order by u.id limit 1;
  if admin_uid is null or owner_uid is null or other_uid is null then
    raise exception 'QA needs one existing admin and two existing confirmed non-admins; no account was created.';
  end if;

  select md5(string_agg(to_jsonb(ad)::text,'' order by ad.id)) into admins_before from public.admins ad;
  select md5(string_agg(to_jsonb(u)::text,'' order by u.id)) into auth_before from auth.users u;
  select to_jsonb(e) into aux_before from public.entreprise e where e.id='36f84b99-2c37-47d1-91ba-4c35cda8c1af';
  select coalesce(jsonb_agg(to_jsonb(ac) order by ac.user_id),'[]'::jsonb) into aux_access_before
    from public.professional_profile_access ac where ac.entreprise_id='36f84b99-2c37-47d1-91ba-4c35cda8c1af';

  if has_table_privilege('authenticated','public.admins','INSERT,UPDATE,DELETE,TRUNCATE')
    or has_table_privilege('anon','public.admins','INSERT,UPDATE,DELETE,TRUNCATE')
    or exists(select 1 from pg_policies where schemaname='public' and tablename='admins' and policyname='Full access') then
    raise exception 'QA failed: administrator table permits untrusted writes.';
  end if;
  if not exists(select 1 from pg_trigger where tgrelid='public.profiles'::regclass
    and tgname='dalil_protect_profile_role' and not tgisinternal and tgenabled<>'D') then
    raise exception 'QA failed: profile role promotion guard is missing.';
  end if;

  dossier := jsonb_build_object('schemaVersion',1,'plan','artisan','companyName','Dalil QA rollback fictif',
    'managerName','Contrôle transactionnel','phone','+21600000000','email',owner_mail,
    'sector','Artisanat','city','Tunis','governorate','Tunis','assistance','autonomous',
    'presentationModel','business','palette','prestige','openingStyle','photo',
    'activityDescription','Dossier synthétique annulé dans la même transaction.',
    'productsDescription','','address','Adresse fictive','openingHours','','googleMapsUrl','',
    'googleReviewsUrl','','logoChoice','none','logoUrl','','photoUrls','[]'::jsonb,'socialLinks','{}'::jsonb);
  insert into public.suggestions_entreprises(id,nom_entreprise,ville,email,telephone,pack_type,source_page,type_demande,message,creation_dossier)
    values(request_a,'Dalil QA rollback fictif A','Tunis',owner_mail,'+21600000000','artisan','subscription','demande_abonnement','QA transaction ROLLBACK',dossier),
      (request_b,'Dalil QA rollback fictif B','Tunis',owner_mail,'+21600000000','artisan','subscription','demande_abonnement','QA transaction ROLLBACK',dossier);

  perform set_config('request.jwt.claim.sub',owner_uid::text,true);
  perform set_config('request.jwt.claim.role','authenticated',true);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',owner_uid,'role','authenticated',
    'email',owner_mail,'user_metadata',jsonb_build_object('role','admin'))::text,true);
  execute 'set local role authenticated';
  if public.dalil_registration_is_admin() then raise exception 'QA failed: forged metadata confers admin.'; end if;
  begin
    perform public.dalil_admin_registration_prepare(request_a,0,null,owner_mail,dossier);
    raise exception 'QA failed: non-admin prepared a dossier.';
  exception when insufficient_privilege then null; end;
  begin
    perform 1 from public.dalil_miniapp_onboarding;
    raise exception 'QA failed: direct workflow read permitted.';
  exception when insufficient_privilege then null; end;
  execute 'reset role';

  perform set_config('request.jwt.claim.sub',admin_uid::text,true);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',admin_uid,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  if not public.dalil_registration_is_admin() then raise exception 'QA failed: persisted admin is rejected.'; end if;
  a := public.dalil_admin_registration_prepare(request_a,0,null,owner_mail,dossier);
  if a->>'status'<>'draft' or a->>'public_url' is not null or a->>'confirmed_plan' is not null then
    raise exception 'QA failed: draft received payment/publication automatically.';
  end if;
  begin
    perform public.dalil_admin_registration_link_account(request_a,(a->>'version')::integer);
    raise exception 'QA failed: unpaid draft owner was linked.';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.dalil_admin_registration_publish(request_a,(a->>'version')::integer);
    raise exception 'QA failed: unpaid draft was published.';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.dalil_admin_registration_confirm_payment(request_a,(a->>'version')::integer,'artisan',1,'QA-ROLLBACK-A',received_at);
    raise exception 'QA failed: incorrect payment amount was accepted.';
  exception when invalid_parameter_value then null; end;
  execute 'reset role';

  perform set_config('request.jwt.claim.sub','',true);
  perform set_config('request.jwt.claim.role','anon',true);
  perform set_config('request.jwt.claims','{"role":"anon"}',true);
  execute 'set local role anon';
  select count(*) into count_rows from public.entreprise where id=a->>'entreprise_id';
  if count_rows<>0 then raise exception 'QA failed: draft is publicly readable.'; end if;
  begin
    perform public.dalil_claim_my_miniapps();
    raise exception 'QA failed: anonymous claim was allowed.';
  exception when insufficient_privilege then null; end;
  execute 'reset role';

  perform set_config('request.jwt.claim.sub',admin_uid::text,true);
  perform set_config('request.jwt.claim.role','authenticated',true);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',admin_uid,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  previous_version := (a->>'version')::integer;
  a := public.dalil_admin_registration_confirm_payment(request_a,previous_version,'artisan',30,'QA-ROLLBACK-A',received_at);
  response := public.dalil_admin_registration_confirm_payment(request_a,previous_version,'artisan',30,'QA-ROLLBACK-A',received_at);
  if response->>'version' is distinct from a->>'version' or a->>'status'<>'paid' then
    raise exception 'QA failed: payment retry changed state twice.';
  end if;
  a := public.dalil_admin_registration_publish(request_a,(a->>'version')::integer);
  if a->>'status'<>'published' or a->>'public_url' is null or a->>'account_url' is null then
    raise exception 'QA failed: publication was not confirmed.';
  end if;
  b := public.dalil_admin_registration_prepare(request_b,0,null,owner_mail,dossier);
  b := public.dalil_admin_registration_confirm_payment(request_b,(b->>'version')::integer,'artisan',30,'QA-ROLLBACK-B',received_at);
  b := public.dalil_admin_registration_publish(request_b,(b->>'version')::integer);
  execute 'reset role';
  -- This access row concerns only fixture B. It simulates an already-bound
  -- other owner and must prevent either admin or email claimant overwriting it.
  insert into public.professional_profile_access(user_id,entreprise_id,granted_by)
    values(other_uid,b->>'entreprise_id',admin_uid);

  perform set_config('request.jwt.claim.sub',admin_uid::text,true);
  execute 'set local role authenticated';
  begin
    perform public.dalil_admin_registration_link_account(request_b,(b->>'version')::integer);
    raise exception 'QA failed: admin link overwrote another owner.';
  exception when insufficient_privilege then null; end;
  execute 'reset role';

  -- No unconfirmed non-admin exists in the live inventory. A nonexistent UID
  -- plus forged matching email must still receive zero access. The actual
  -- email_confirmed_at=NULL case is covered by the isolated PostgreSQL tests.
  perform set_config('request.jwt.claim.sub',unknown_uid::text,true);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',unknown_uid,'role','authenticated','email',owner_mail)::text,true);
  execute 'set local role authenticated';
  response := public.dalil_claim_my_miniapps();
  if response->'claimed'<>'[]'::jsonb or response->>'requires_confirmation'<>'true' then
    raise exception 'QA failed: token email without confirmed Auth identity received access.';
  end if;
  execute 'reset role';

  perform set_config('request.jwt.claim.sub',owner_uid::text,true);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',owner_uid,'role','authenticated','email',owner_mail)::text,true);
  execute 'set local role authenticated';
  response := public.dalil_claim_my_miniapps();
  if response->'claimed'<>jsonb_build_array(a->>'entreprise_id') or (response->>'conflicts')::integer<>1 then
    raise exception 'QA failed: self claim did not preserve the other owner.';
  end if;
  response := public.dalil_get_my_showcase_entitlements(a->>'entreprise_id');
  if response->>'plan'<>'artisan' or (response->>'photo_limit')::integer<>5 then
    raise exception 'QA failed: linked owner did not receive the verified Artisan rights.';
  end if;
  execute 'reset role';
  select version into previous_version from public.dalil_miniapp_onboarding where suggestion_id=request_a;

  perform set_config('request.jwt.claim.sub',owner_uid::text,true);
  execute 'set local role authenticated';
  perform public.dalil_claim_my_miniapps();
  execute 'reset role';
  if (select version from public.dalil_miniapp_onboarding where suggestion_id=request_a)<>previous_version
    or (select count(*) from public.dalil_miniapp_onboarding_events where suggestion_id=request_a and action='owner_linked')<>1 then
    raise exception 'QA failed: owner retry created duplicate grants/events.';
  end if;

  perform set_config('request.jwt.claim.sub',other_uid::text,true);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',other_uid,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  begin
    perform public.dalil_get_my_showcase_entitlements(a->>'entreprise_id');
    raise exception 'QA failed: another professional read owner rights.';
  exception when insufficient_privilege then null; end;
  if exists(select 1 from public.professional_profile_access where entreprise_id=a->>'entreprise_id') then
    raise exception 'QA failed: access RLS disclosed another owner grant.';
  end if;
  update public.entreprise set formule_commerciale='Premium — 59 TND' where id=a->>'entreprise_id';
  get diagnostics count_rows=row_count;
  if count_rows<>0 then raise exception 'QA failed: another professional rewrote the purchased plan.'; end if;
  execute 'reset role';

  perform set_config('request.jwt.claim.sub','',true);
  perform set_config('request.jwt.claim.role','anon',true);
  perform set_config('request.jwt.claims','{"role":"anon"}',true);
  execute 'set local role anon';
  select count(*) into count_rows from public.entreprise where id=a->>'entreprise_id'
    and approved is true and cv_business_status='published' and statut_validation='publie' and statut_publication='Publié';
  if count_rows<>1 then raise exception 'QA failed: published fixture is not visible under public RLS.'; end if;
  execute 'reset role';

  if (select md5(string_agg(to_jsonb(ad)::text,'' order by ad.id)) from public.admins ad) is distinct from admins_before
    or (select md5(string_agg(to_jsonb(u)::text,'' order by u.id)) from auth.users u) is distinct from auth_before
    or (select to_jsonb(e) from public.entreprise e where e.id='36f84b99-2c37-47d1-91ba-4c35cda8c1af') is distinct from aux_before
    or (select coalesce(jsonb_agg(to_jsonb(ac) order by ac.user_id),'[]'::jsonb) from public.professional_profile_access ac
      where ac.entreprise_id='36f84b99-2c37-47d1-91ba-4c35cda8c1af') is distinct from aux_access_before then
    raise exception 'QA failed: an existing identity, administrator or Aux Saveurs record changed.';
  end if;
  if exists(select 1 from public.dalil_registration_integration_jobs where suggestion_id in (request_a,request_b)) then
    raise exception 'QA failed: a delivery job was unexpectedly enqueued.';
  end if;
end;
$qa$;

rollback;

-- This result is emitted only after every assertion and the rollback completed.
select jsonb_build_object(
  'assertions','passed',
  'transaction','rolled_back',
  'fixture_requests_remaining',(select count(*) from public.suggestions_entreprises
    where id in ('da110001-2026-4112-8112-000000000001','da110002-2026-4112-8112-000000000002')),
  'fixture_businesses_remaining',(select count(*) from public.entreprise where nom='Dalil QA rollback fictif'),
  'auth_users_written',false,'emails_sent',false,'real_payment_performed',false,
  'unconfirmed_live_user_case','unavailable; nonexistent identity with forged email tested; actual unconfirmed user covered in isolated tests'
) as verification;
