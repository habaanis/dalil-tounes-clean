-- Extend the existing service-role-only order inbox; do not recreate orders.
-- Archive keeps the complete order. Delete removes merchant visibility and
-- customer contact details while retaining its final state/idempotency reference.
-- A completed service may have been settled outside Dalil: archive it, never erase it.
alter table public.dalil_boutique_customer_orders
  add column if not exists archived_at timestamptz,
  add column if not exists deleted_at timestamptz;

alter table public.dalil_boutique_customer_orders
  add constraint dalil_order_archive_closed_only check (
    archived_at is null or status in ('completed','rejected','cancelled')
  ),
  add constraint dalil_order_delete_unpaid_abandoned_only check (
    deleted_at is null or (
      archived_at is not null and status in ('rejected','cancelled')
      and payment_status in ('not_requested','failed') and paid_amount=0
      and payment_provider is null and payment_reference is null
      and payment_verified_at is null
      and customer_name='Demande supprimée' and customer_contact='Supprimé'
      and customer_note is null
    )
  );

create index if not exists dalil_order_inbox_active_created
  on public.dalil_boutique_customer_orders (entreprise_id,created_at desc,id desc)
  where archived_at is null and deleted_at is null;
create index if not exists dalil_order_inbox_archived_created
  on public.dalil_boutique_customer_orders (entreprise_id,created_at desc,id desc)
  where archived_at is not null and deleted_at is null;

create table public.dalil_boutique_order_management_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.dalil_boutique_customer_orders(id),
  entreprise_id text not null references public.entreprise(id),
  actor_id uuid not null,
  action text not null check (action in ('archive','restore','delete')),
  occurred_at timestamptz not null default now()
);
alter table public.dalil_boutique_order_management_events enable row level security;
revoke all on table public.dalil_boutique_order_management_events from public,anon,authenticated;
grant select,insert on table public.dalil_boutique_order_management_events to service_role;
grant usage,select on sequence public.dalil_boutique_order_management_events_id_seq to service_role;
create index dalil_order_management_events_order
  on public.dalil_boutique_order_management_events (order_id,occurred_at desc);

-- An initial submission can still be finishing its optional push registration
-- while the merchant removes the request. Lock the parent so a subscription
-- cannot be reattached after deletion, regardless of which request wins the race.
create or replace function public.dalil_guard_order_push_subscription()
returns trigger language plpgsql security invoker set search_path=''
as $$
begin
  perform 1 from public.dalil_boutique_customer_orders
    where id=new.order_id and deleted_at is null for key share;
  if not found then raise exception 'order_not_available' using errcode='23514'; end if;
  return new;
end;
$$;
revoke all on function public.dalil_guard_order_push_subscription() from public,anon,authenticated;
grant execute on function public.dalil_guard_order_push_subscription() to service_role;
create trigger dalil_order_push_requires_live_order
  before insert or update on public.dalil_boutique_order_push_subscriptions
  for each row execute function public.dalil_guard_order_push_subscription();

-- SECURITY INVOKER, callable ONLY by the existing authenticated Edge Function's
-- service role. p_user_id comes from auth.getUser(token), never request JSON.
-- Rechecking membership and locking the order protects every mutation atomically.
create or replace function public.dalil_merchant_manage_order(
  p_user_id uuid,
  p_profile_id text,
  p_order_id uuid,
  p_action text,
  p_expected_updated_at timestamptz,
  p_confirm_delete boolean default false
) returns jsonb
language plpgsql
security invoker
set search_path=''
as $$
declare
  v_order public.dalil_boutique_customer_orders%rowtype;
  v_now timestamptz := clock_timestamp();
  v_changed boolean := false;
begin
  if p_user_id is null or p_profile_id is null then
    raise exception 'order_not_found' using errcode='42501';
  end if;
  perform 1 from public.professional_profile_access
    where user_id=p_user_id and entreprise_id=p_profile_id for key share;
  if not found then raise exception 'order_not_found' using errcode='42501'; end if;
  if p_action is null or p_action not in ('archive','restore','delete') then
    raise exception 'invalid_action' using errcode='22023';
  end if;

  select * into v_order from public.dalil_boutique_customer_orders
    where id=p_order_id and entreprise_id=p_profile_id and deleted_at is null
    for update;
  if not found then raise exception 'order_not_found' using errcode='P0002'; end if;
  if v_order.updated_at is distinct from p_expected_updated_at then
    raise exception 'order_changed' using errcode='40001';
  end if;
  if v_order.status not in ('completed','rejected','cancelled') then
    raise exception 'order_closed_required' using errcode='23514';
  end if;

  if p_action='archive' then
    if v_order.archived_at is null then
      update public.dalil_boutique_customer_orders
        set archived_at=v_now,updated_at=v_now where id=v_order.id
        returning * into v_order;
      v_changed:=true;
    end if;
  elsif p_action='restore' then
    if v_order.archived_at is not null then
      update public.dalil_boutique_customer_orders
        set archived_at=null,updated_at=v_now where id=v_order.id
        returning * into v_order;
      v_changed:=true;
    end if;
  else
    if not coalesce(p_confirm_delete,false) then
      raise exception 'delete_confirmation_required' using errcode='22023';
    end if;
    if v_order.status not in ('rejected','cancelled')
      or v_order.payment_status not in ('not_requested','failed')
      or v_order.paid_amount<>0 or v_order.payment_provider is not null
      or v_order.payment_reference is not null or v_order.payment_verified_at is not null
    then raise exception 'financial_history_protected' using errcode='23514'; end if;
    update public.dalil_boutique_customer_orders
      set archived_at=coalesce(archived_at,v_now),deleted_at=v_now,updated_at=v_now,
          customer_name='Demande supprimée',customer_contact='Supprimé',customer_note=null
      where id=v_order.id returning * into v_order;
    -- No further confirmation alert belongs to an erased, abandoned request.
    delete from public.dalil_boutique_order_push_subscriptions where order_id=v_order.id;
    v_changed:=true;
  end if;

  if v_changed then
    insert into public.dalil_boutique_order_management_events(order_id,entreprise_id,actor_id,action,occurred_at)
      values(v_order.id,p_profile_id,p_user_id,p_action,v_now);
  end if;
  return jsonb_build_object('id',v_order.id,'action',p_action,'status',v_order.status,
    'archived_at',v_order.archived_at,'deleted_at',v_order.deleted_at,'updated_at',v_order.updated_at);
end;
$$;
revoke all on function public.dalil_merchant_manage_order(uuid,text,uuid,text,timestamptz,boolean)
  from public,anon,authenticated;
grant execute on function public.dalil_merchant_manage_order(uuid,text,uuid,text,timestamptz,boolean)
  to service_role;

comment on column public.dalil_boutique_customer_orders.archived_at is
  'Merchant archive only. Customer final status, payment evidence and history are preserved.';
comment on column public.dalil_boutique_customer_orders.deleted_at is
  'Removed unpaid cancelled/refused request. Contact data redacted; minimal final-status/idempotency tombstone retained. Exclude from merchant inbox and future request statistics.';
comment on function public.dalil_merchant_manage_order(uuid,text,uuid,text,timestamptz,boolean) is
  'Service-role-only atomic owner-checked archive/restore/delete; verified actor supplied by dalil-boutique-merchant-orders.';
