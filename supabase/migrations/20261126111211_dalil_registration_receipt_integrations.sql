-- Receipt identity and durable, individually recoverable delivery jobs.
-- Existing dossiers/notifications are not replayed or assigned a creation plan.
alter table public.suggestions_entreprises
  add column if not exists request_id uuid,
  add column if not exists request_fingerprint text,
  add column if not exists creation_dossier jsonb,
  add column if not exists requester_user_id uuid references auth.users(id) on delete set null,
  add column if not exists integration_status jsonb not null default '{}'::jsonb;

create unique index if not exists suggestions_entreprises_request_id_key
  on public.suggestions_entreprises(request_id) where request_id is not null;

-- Keep other public forms compatible while protecting server-authored fields.
revoke insert on public.suggestions_entreprises from anon, authenticated;
grant insert (
  id, created_at, nom_entreprise, secteur, ville, contact_suggere, email_suggesteur,
  raison_suggestion, statut, type_demande, capacite_vehicule, type_evenement,
  date_evenement, video_url, pack_type, image_url, facebook_url, instagram_url,
  linkedin_url, tiktok_url, youtube_url, submission_lang, titre_demande,
  telephone, email, message, source_page, langue, priorite,
  airtable_record_id, synced_to_airtable, synced_at
) on public.suggestions_entreprises to anon, authenticated;

create table public.dalil_registration_integration_jobs (
  suggestion_id uuid not null references public.suggestions_entreprises(id) on delete cascade,
  channel text not null check (channel in ('airtable', 'notification')),
  status text not null default 'pending' check (status in ('pending', 'running', 'ok', 'failed', 'unknown')),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  attempts integer not null default 0 check (attempts >= 0),
  first_attempt_at timestamptz,
  lease_token uuid,
  lease_expires_at timestamptz,
  provider_id text,
  last_error text,
  updated_at timestamptz not null default now(),
  primary key (suggestion_id, channel)
);
alter table public.dalil_registration_integration_jobs enable row level security;
revoke all on public.dalil_registration_integration_jobs from public, anon, authenticated;
grant all on public.dalil_registration_integration_jobs to service_role;

create or replace function public.dalil_registration_refresh_delivery_status(p_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_status jsonb;
begin
  perform 1 from public.suggestions_entreprises where id = p_id for update;
  if not found then return null; end if;
  -- A timed-out notification may already have reached the provider. Never resend it blindly.
  update public.dalil_registration_integration_jobs
    set status = case when channel = 'notification' then 'unknown' else 'failed' end,
        last_error = 'delivery_interrupted', lease_token = null, lease_expires_at = null, updated_at = now()
    where suggestion_id = p_id and status = 'running' and lease_expires_at <= now();
  select coalesce(jsonb_object_agg(channel, jsonb_build_object(
    'status', status, 'attempts', attempts, 'updated_at', updated_at, 'last_error', last_error
  )), '{}'::jsonb) into v_status
    from public.dalil_registration_integration_jobs where suggestion_id = p_id;
  -- Historical dossiers without jobs retain their unknown history and are not enqueued.
  if v_status <> '{}'::jsonb then
    update public.suggestions_entreprises set integration_status = v_status where id = p_id;
  else
    select integration_status into v_status from public.suggestions_entreprises where id = p_id;
  end if;
  return v_status;
end;
$$;

create or replace function public.dalil_registration_store(
  p_request_id uuid, p_fingerprint text, p_row jsonb, p_creation_dossier jsonb,
  p_requester_user_id uuid, p_notification jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_row public.suggestions_entreprises%rowtype;
  v_contact text;
  v_count integer;
  v_status jsonb;
begin
  if p_request_id is null or p_fingerprint is null or p_fingerprint !~ '^[a-f0-9]{64}$'
    or jsonb_typeof(p_row) is distinct from 'object'
    or jsonb_typeof(p_notification) is distinct from 'object' then
    raise exception 'Invalid registration receipt input' using errcode = '22023';
  end if;
  if p_creation_dossier is not null and (
    jsonb_typeof(p_creation_dossier) <> 'object' or p_creation_dossier->>'schemaVersion' is distinct from '1'
  ) then raise exception 'Invalid creation dossier' using errcode = '22023'; end if;

  -- Same client attempt is serialized before any insert, rate-limit or external effect.
  perform pg_advisory_xact_lock(hashtextextended('dalil-registration:' || p_request_id::text, 0));
  select * into v_row from public.suggestions_entreprises where request_id = p_request_id for update;
  if found then
    if v_row.request_fingerprint is distinct from p_fingerprint then
      return jsonb_build_object('error', 'request_conflict');
    end if;
    v_status := public.dalil_registration_refresh_delivery_status(v_row.id);
    return jsonb_build_object('id', v_row.id, 'duplicate', true, 'integration_status', v_status);
  end if;

  v_contact := coalesce(nullif(p_row->>'telephone', ''), p_row->>'email', '');
  perform pg_advisory_xact_lock(hashtextextended('dalil-registration-contact:' || coalesce(p_row->>'source_page', '') || ':' || v_contact, 0));
  select count(*) into v_count from public.suggestions_entreprises
    where source_page = p_row->>'source_page' and created_at >= now() - interval '10 minutes'
      and (case when nullif(p_row->>'telephone', '') is not null then telephone = p_row->>'telephone' else email = p_row->>'email' end);
  if v_count >= 3 then return jsonb_build_object('error', 'rate_limited', 'retryAfterSeconds', 600); end if;

  insert into public.suggestions_entreprises (
    titre_demande, telephone, email, message, type_demande, source_page, langue, priorite,
    statut, nom_entreprise, secteur, ville, contact_suggere, email_suggesteur, raison_suggestion,
    pack_type, facebook_url, instagram_url, submission_lang,
    request_id, request_fingerprint, creation_dossier, requester_user_id
  ) values (
    p_row->>'titre_demande', p_row->>'telephone', p_row->>'email', p_row->>'message',
    p_row->>'type_demande', p_row->>'source_page', p_row->>'langue', p_row->>'priorite',
    'en_attente', p_row->>'nom_entreprise', p_row->>'secteur', p_row->>'ville',
    p_row->>'contact_suggere', p_row->>'email_suggesteur', p_row->>'raison_suggestion',
    p_row->>'pack_type', p_row->>'facebook_url', p_row->>'instagram_url', p_row->>'submission_lang',
    p_request_id, p_fingerprint, p_creation_dossier, p_requester_user_id
  ) returning * into v_row;

  insert into public.dalil_registration_integration_jobs (suggestion_id, channel, payload) values
    (v_row.id, 'airtable', jsonb_build_object('id', v_row.id)),
    (v_row.id, 'notification', p_notification || jsonb_build_object(
      'registration_id', v_row.id, 'received_at', v_row.created_at,
      'data', coalesce(p_notification->'data', '{}'::jsonb) || jsonb_build_object('ID Supabase', v_row.id::text)
    ));
  v_status := public.dalil_registration_refresh_delivery_status(v_row.id);
  return jsonb_build_object('id', v_row.id, 'duplicate', false, 'integration_status', v_status);
end;
$$;

create or replace function public.dalil_registration_claim_delivery(p_id uuid, p_channel text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_job public.dalil_registration_integration_jobs%rowtype;
begin
  perform public.dalil_registration_refresh_delivery_status(p_id);
  select * into v_job from public.dalil_registration_integration_jobs
    where suggestion_id = p_id and channel = p_channel for update;
  if not found or v_job.status not in ('pending', 'failed') then return null; end if;
  update public.dalil_registration_integration_jobs set
    status = 'running', attempts = attempts + 1, first_attempt_at = coalesce(first_attempt_at, now()),
    lease_token = gen_random_uuid(), lease_expires_at = now() + interval '2 minutes',
    last_error = null, updated_at = now()
    where suggestion_id = p_id and channel = p_channel returning * into v_job;
  perform public.dalil_registration_refresh_delivery_status(p_id);
  return jsonb_build_object('token', v_job.lease_token, 'payload', v_job.payload, 'attempts', v_job.attempts);
end;
$$;

create or replace function public.dalil_registration_finish_delivery(
  p_id uuid, p_channel text, p_token uuid, p_status text, p_provider_id text default null, p_error text default null
) returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform 1 from public.suggestions_entreprises where id = p_id for update;
  if p_status not in ('ok', 'failed', 'unknown') then raise exception 'Invalid delivery status' using errcode = '22023'; end if;
  update public.dalil_registration_integration_jobs set
    status = p_status, provider_id = left(p_provider_id, 200), last_error = left(p_error, 200),
    lease_token = null, lease_expires_at = null, updated_at = now()
    where suggestion_id = p_id and channel = p_channel and status = 'running' and lease_token = p_token;
  return public.dalil_registration_refresh_delivery_status(p_id);
end;
$$;

revoke all on function public.dalil_registration_store(uuid, text, jsonb, jsonb, uuid, jsonb) from public, anon, authenticated;
revoke all on function public.dalil_registration_refresh_delivery_status(uuid) from public, anon, authenticated;
revoke all on function public.dalil_registration_claim_delivery(uuid, text) from public, anon, authenticated;
revoke all on function public.dalil_registration_finish_delivery(uuid, text, uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.dalil_registration_store(uuid, text, jsonb, jsonb, uuid, jsonb) to service_role;
grant execute on function public.dalil_registration_refresh_delivery_status(uuid) to service_role;
grant execute on function public.dalil_registration_claim_delivery(uuid, text) to service_role;
grant execute on function public.dalil_registration_finish_delivery(uuid, text, uuid, text, text, text) to service_role;
