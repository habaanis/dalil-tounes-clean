-- Direct deletion from the existing Actions menu for unconfirmed unpaid requests.
-- Existing orders, financial guards, access controls, and table constraints are preserved.
-- Customer tracking keeps a final cancelled state; no intermediate update can escape.
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
  if p_action in ('archive','restore') and v_order.status not in ('completed','rejected','cancelled') then
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
    if v_order.status not in ('received','in_progress','rejected','cancelled')
      or v_order.payment_status not in ('not_requested','failed')
      or v_order.paid_amount<>0 or v_order.payment_provider is not null
      or v_order.payment_reference is not null or v_order.payment_verified_at is not null
    then raise exception 'financial_history_protected' using errcode='23514'; end if;
    -- Cancel an unconfirmed request and redact it in the same locked update.
    -- The existing closed/unpaid tombstone constraints remain in force.
    update public.dalil_boutique_customer_orders
      set status=case when status in ('received','in_progress') then 'cancelled' else status end,
          archived_at=coalesce(archived_at,v_now),deleted_at=v_now,updated_at=v_now,
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

comment on function public.dalil_merchant_manage_order(uuid,text,uuid,text,timestamptz,boolean) is
  'Service-role-only owner-checked archive/restore/delete. Deleting an unconfirmed unpaid request atomically cancels and redacts it; confirmed/completed and financial history remain protected.';
