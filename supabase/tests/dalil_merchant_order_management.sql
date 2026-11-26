-- Run after the archive/delete and direct-delete migrations.
-- ALL fixtures and mutations are rolled back; no real order/contact is touched.
begin;
set local role service_role;
do $$
declare
  v_profile text;
  v_actor uuid;
  v_product uuid;
  v_order uuid;
  v_foreign_profile text;
  v_foreign_order uuid;
  v_reference uuid := gen_random_uuid();
  v_result jsonb;
  v_row public.dalil_boutique_customer_orders%rowtype;
  v_direct public.dalil_boutique_customer_orders%rowtype;
  v_before jsonb;
  v_original_rows jsonb;
  v_fixture_ids uuid[] := array[]::uuid[];
  v_state text;
  v_step text;
  v_payment text;
  v_kind text;
  v_confirmation boolean;
  v_changed_count integer;
  v_original_count integer;
begin
  select e.id,a.user_id,p.id into v_profile,v_actor,v_product
  from public.entreprise e
  join public.professional_profile_access a on a.entreprise_id=e.id
  join public.dalil_boutique_products p on p.entreprise_id=e.id
  where e.id='36f84b99-2c37-47d1-91ba-4c35cda8c1af'
  order by p.created_at limit 1;
  if v_profile is null then raise exception 'Aux Saveurs test reference unavailable'; end if;
  select count(*) into v_original_count from public.dalil_boutique_customer_orders where entreprise_id=v_profile;
  select coalesce(jsonb_agg(to_jsonb(o) order by o.id),'[]'::jsonb) into v_original_rows
    from public.dalil_boutique_customer_orders o where entreprise_id=v_profile;

  if has_function_privilege('anon','public.dalil_merchant_manage_order(uuid,text,uuid,text,timestamptz,boolean)','EXECUTE')
    or has_function_privilege('authenticated','public.dalil_merchant_manage_order(uuid,text,uuid,text,timestamptz,boolean)','EXECUTE')
  then raise exception 'Mutation RPC must be service-role-only'; end if;
  if has_table_privilege('authenticated','public.dalil_boutique_customer_orders','UPDATE')
    or has_table_privilege('authenticated','public.dalil_boutique_customer_orders','DELETE')
  then raise exception 'Authenticated clients must not bypass the Edge authorization'; end if;

  insert into public.dalil_boutique_customer_orders(
    entreprise_id,product_id,kind,quantity,product_title,currency,unit_price,amount_total,
    customer_name,customer_contact,customer_note,status,idempotency_key,request_fingerprint
  ) values(v_profile,v_product,'order',1,'QA rollback only','TND',10,10,
    'QA rollback','qa@example.invalid','QA no transaction','cancelled',v_reference,repeat('a',64))
    returning * into v_row;
  v_order:=v_row.id;
  v_fixture_ids:=array_append(v_fixture_ids,v_order);
  insert into public.dalil_boutique_order_push_subscriptions(order_id,endpoint,p256dh,auth)
    values(v_order,'https://fcm.googleapis.com/fcm/send/qa-rollback-never-send',repeat('A',87),repeat('B',22));

  -- Exact owner and immutable company scope, including an order id from elsewhere.
  begin
    perform public.dalil_merchant_manage_order(gen_random_uuid(),v_profile,v_order,'archive',v_row.updated_at,false);
    raise exception 'Unassigned user unexpectedly archived an order';
  exception when insufficient_privilege then null; end;
  select e.id into v_foreign_profile from public.entreprise e where e.id<>v_profile limit 1;
  if v_foreign_profile is null then raise exception 'Second establishment required for scope test'; end if;
  insert into public.dalil_boutique_customer_orders(
    entreprise_id,product_id,kind,quantity,product_title,currency,unit_price,amount_total,
    customer_name,customer_contact,status,idempotency_key,request_fingerprint
  ) values(v_foreign_profile,v_product,'order',1,'QA foreign rollback only','TND',10,10,
    'QA rollback','qa@example.invalid','received',gen_random_uuid(),repeat('b',64)) returning id into v_foreign_order;
  select to_jsonb(o) into v_before from public.dalil_boutique_customer_orders o where id=v_foreign_order;
  begin
    perform public.dalil_merchant_manage_order(v_actor,v_profile,v_foreign_order,'delete',v_row.updated_at,true);
    raise exception 'Cross-establishment order id unexpectedly accepted';
  exception when no_data_found then null; end;
  if (select to_jsonb(o) from public.dalil_boutique_customer_orders o where id=v_foreign_order)
    is distinct from v_before then raise exception 'Foreign request changed after refused deletion'; end if;

  begin
    perform public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'archive',v_row.updated_at-interval '1 second',false);
    raise exception 'Stale revision unexpectedly accepted';
  exception when serialization_failure then null; end;

  -- Active requests cannot archive/restore. Confirmed business cannot delete directly.
  foreach v_state in array array['received','in_progress','confirmed'] loop
    update public.dalil_boutique_customer_orders set status=v_state where id=v_order returning * into v_row;
    v_before:=to_jsonb(v_row);
    foreach v_step in array array['archive','restore'] loop
      begin
        perform public.dalil_merchant_manage_order(v_actor,v_profile,v_order,v_step,v_row.updated_at,true);
        raise exception 'Active order unexpectedly allowed %',v_step;
      exception when check_violation then null; end;
    end loop;
    if v_state='confirmed' then
      begin
        perform public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'delete',v_row.updated_at,true);
        raise exception 'Confirmed request unexpectedly allowed direct deletion';
      exception when check_violation then null; end;
    end if;
    if (select to_jsonb(o) from public.dalil_boutique_customer_orders o where id=v_order)
      is distinct from v_before then raise exception 'Protected active request was modified'; end if;
  end loop;

  -- Completed business, even with no online payment, cannot be erased.
  update public.dalil_boutique_customer_orders set status='completed' where id=v_order returning * into v_row;
  begin
    perform public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'delete',v_row.updated_at,true);
    raise exception 'Completed service history unexpectedly erased';
  exception when check_violation then null; end;
  v_result:=public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'archive',v_row.updated_at,false);
  if v_result->>'archived_at' is null then raise exception 'Completed archive failed'; end if;
  select * into v_row from public.dalil_boutique_customer_orders where id=v_order;
  perform public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'restore',v_row.updated_at,false);

  -- Payment waiting, paid, partially paid and refunded all retain financial evidence.
  foreach v_state in array array['received','in_progress','rejected','cancelled'] loop
    foreach v_payment in array array['pending','paid','partially_paid','refunded'] loop
      update public.dalil_boutique_customer_orders set status=v_state,payment_status=v_payment,
        paid_amount=case when v_payment='paid' then 10 when v_payment='partially_paid' then 5 else 0 end,
        payment_provider=case when v_payment='pending' then null else 'qa-provider' end,
        payment_reference=case when v_payment='pending' then null else 'qa-payment-reference' end,
        payment_verified_at=case when v_payment='pending' then null else now() end
        where id=v_order returning * into v_row;
      v_before:=to_jsonb(v_row);
      begin
        perform public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'delete',v_row.updated_at,true);
        raise exception 'Protected payment unexpectedly erased: % / %',v_state,v_payment;
      exception when check_violation then null; end;
      if (select to_jsonb(o) from public.dalil_boutique_customer_orders o where id=v_order)
        is distinct from v_before then raise exception 'Refused deletion changed payment or processing state'; end if;
    end loop;
  end loop;
  update public.dalil_boutique_customer_orders set payment_status='not_requested',paid_amount=0,
    payment_provider=null,payment_reference=null,payment_verified_at=null,status='rejected'
    where id=v_order returning * into v_row;

  -- End-to-end archive, restore and confirmed deletion of the test fixture.
  v_result:=public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'archive',v_row.updated_at,false);
  select * into v_row from public.dalil_boutique_customer_orders where id=v_order;
  if v_row.archived_at is null or v_row.status<>'rejected' or v_row.customer_contact<>'qa@example.invalid'
    or v_row.idempotency_key<>v_reference then raise exception 'Archive changed customer history'; end if;
  v_result:=public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'restore',v_row.updated_at,false);
  select * into v_row from public.dalil_boutique_customer_orders where id=v_order;
  if v_row.archived_at is not null or v_row.customer_note<>'QA no transaction' then raise exception 'Restore lost history'; end if;
  begin
    perform public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'delete',v_row.updated_at,false);
    raise exception 'Unconfirmed deletion unexpectedly accepted';
  exception when invalid_parameter_value then null; end;
  v_result:=public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'delete',v_row.updated_at,true);
  select * into v_row from public.dalil_boutique_customer_orders where id=v_order;
  if v_row.deleted_at is null or v_row.customer_name<>'Demande supprimée'
    or v_row.customer_contact<>'Supprimé' or v_row.customer_note is not null
    or v_row.status<>'rejected' or v_row.idempotency_key<>v_reference
    or v_row.request_fingerprint<>repeat('a',64)
  then raise exception 'Deletion did not preserve only the safe final tracking state'; end if;
  if exists(select 1 from public.dalil_boutique_order_push_subscriptions where order_id=v_order)
    then raise exception 'Deleted request retained its push subscription'; end if;
  begin
    insert into public.dalil_boutique_order_push_subscriptions(order_id,endpoint,p256dh,auth)
      values(v_order,'https://fcm.googleapis.com/fcm/send/qa-rollback-never-send',repeat('A',87),repeat('B',22));
    raise exception 'Deleted request unexpectedly accepted a later push subscription';
  exception when check_violation then null; end;
  if (select count(*) from public.dalil_boutique_order_management_events where order_id=v_order)<>5
    then raise exception 'Order action audit incomplete'; end if;
  if exists(select 1 from public.dalil_boutique_customer_orders where id=v_order and deleted_at is null)
    then raise exception 'Deleted request still visible in merchant lists'; end if;
  begin
    perform public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'restore',v_row.updated_at,false);
    raise exception 'Deleted request unexpectedly restored';
  exception when no_data_found then null; end;

  -- Direct removal is a single confirmed action for both orders and quote requests.
  -- Each fixture starts active; there is no preliminary update/cancellation call.
  foreach v_state in array array['received','in_progress'] loop
    foreach v_kind in array array['order','quote'] loop
      insert into public.dalil_boutique_customer_orders(
        entreprise_id,product_id,kind,quantity,product_title,currency,unit_price,amount_total,
        customer_name,customer_contact,customer_note,status,payment_status,idempotency_key,request_fingerprint
      ) values(v_profile,v_product,v_kind,1,'QA direct delete rollback only','TND',
        case when v_kind='order' then 10 else null end,case when v_kind='order' then 10 else null end,
        'QA direct delete','qa-direct@example.invalid','QA direct no transaction',v_state,
        case when v_state='received' then 'not_requested' else 'failed' end,gen_random_uuid(),repeat('d',64))
        returning * into v_direct;
      v_fixture_ids:=array_append(v_fixture_ids,v_direct.id);
      v_before:=to_jsonb(v_direct);
      insert into public.dalil_boutique_order_push_subscriptions(order_id,endpoint,p256dh,auth)
        values(v_direct.id,'https://fcm.googleapis.com/fcm/send/qa-direct-never-send',repeat('A',87),repeat('B',22));

      begin
        perform public.dalil_merchant_manage_order(gen_random_uuid(),v_profile,v_direct.id,'delete',v_direct.updated_at,true);
        raise exception 'Unassigned user unexpectedly deleted an active request';
      exception when insufficient_privilege then null; end;
      begin
        perform public.dalil_merchant_manage_order(v_actor,v_profile,v_direct.id,'delete',v_direct.updated_at-interval '1 second',true);
        raise exception 'Stale active request unexpectedly deleted';
      exception when serialization_failure then null; end;
      foreach v_confirmation in array array[false,null::boolean] loop
        begin
          perform public.dalil_merchant_manage_order(v_actor,v_profile,v_direct.id,'delete',v_direct.updated_at,v_confirmation);
          raise exception 'Active request deleted without explicit confirmation';
        exception when invalid_parameter_value then null; end;
      end loop;
      if (select to_jsonb(o) from public.dalil_boutique_customer_orders o where id=v_direct.id)
        is distinct from v_before then raise exception 'Refused direct deletion partially changed the active request'; end if;
      if exists(select 1 from public.dalil_boutique_order_management_events where order_id=v_direct.id)
        or not exists(select 1 from public.dalil_boutique_order_push_subscriptions where order_id=v_direct.id)
        then raise exception 'Refused direct deletion changed the audit or subscription'; end if;

      v_result:=public.dalil_merchant_manage_order(v_actor,v_profile,v_direct.id,'delete',v_direct.updated_at,true);
      select * into v_direct from public.dalil_boutique_customer_orders where id=v_direct.id;
      if v_result->>'id' is distinct from v_direct.id::text or v_result->>'action' is distinct from 'delete'
        or v_result->>'status' is distinct from 'cancelled' or v_result->>'deleted_at' is null
        or v_result->>'archived_at' is null or v_result->>'updated_at' is null
        then raise exception 'Direct deletion response did not confirm cancellation and removal'; end if;
      if v_direct.status<>'cancelled' or v_direct.archived_at is null or v_direct.deleted_at is null
        or v_direct.archived_at<>v_direct.deleted_at or v_direct.updated_at<>v_direct.deleted_at
        or v_direct.customer_name<>'Demande supprimée' or v_direct.customer_contact<>'Supprimé'
        or v_direct.customer_note is not null
        or v_direct.idempotency_key::text is distinct from v_before->>'idempotency_key'
        or v_direct.request_fingerprint is distinct from v_before->>'request_fingerprint'
        or v_direct.payment_status is distinct from v_before->>'payment_status'
        or v_direct.kind<>v_kind or v_direct.paid_amount<>0
        then raise exception 'Direct deletion did not atomically preserve a safe cancelled tombstone'; end if;
      if (select count(*) from public.dalil_boutique_order_management_events
        where order_id=v_direct.id and entreprise_id=v_profile and actor_id=v_actor and action='delete')<>1
        or (select count(*) from public.dalil_boutique_order_management_events where order_id=v_direct.id)<>1
        then raise exception 'Direct deletion did not record exactly one owner-scoped delete action'; end if;
      if exists(select 1 from public.dalil_boutique_order_push_subscriptions where order_id=v_direct.id)
        then raise exception 'Direct deletion retained its push subscription'; end if;
      begin
        insert into public.dalil_boutique_order_push_subscriptions(order_id,endpoint,p256dh,auth)
          values(v_direct.id,'https://fcm.googleapis.com/fcm/send/qa-direct-never-send',repeat('A',87),repeat('B',22));
        raise exception 'Directly deleted request accepted a late push subscription';
      exception when check_violation then null; end;
      foreach v_step in array array['restore','delete'] loop
        begin
          perform public.dalil_merchant_manage_order(v_actor,v_profile,v_direct.id,v_step,v_direct.updated_at,true);
          raise exception 'Deleted request unexpectedly accepted a repeated %',v_step;
        exception when no_data_found then null; end;
      end loop;

      -- Same predicates as the status-update handler: an old request cannot
      -- confirm the tombstone after direct deletion wins the race.
      update public.dalil_boutique_customer_orders set status='confirmed',updated_at=clock_timestamp()
        where id=v_direct.id and entreprise_id=v_profile and status=v_state
        and payment_status=v_direct.payment_status and archived_at is null and deleted_at is null;
      get diagnostics v_changed_count=row_count;
      if v_changed_count<>0 then raise exception 'Late confirmation updated a deleted request'; end if;
      begin
        insert into public.dalil_boutique_customer_orders(
          entreprise_id,product_id,kind,quantity,product_title,customer_name,customer_contact,idempotency_key,request_fingerprint
        ) values(v_profile,v_product,'quote',1,'QA replay rollback only','QA replay','qa@example.invalid',
          v_direct.idempotency_key,v_direct.request_fingerprint);
        raise exception 'Deleted request idempotency reference could be recreated';
      exception when unique_violation then null; end;
    end loop;
  end loop;

  if (select count(*) from public.dalil_boutique_customer_orders where entreprise_id=v_profile)
    <>v_original_count+cardinality(v_fixture_ids) then raise exception 'Unexpected order count change'; end if;
  if (select coalesce(jsonb_agg(to_jsonb(o) order by o.id),'[]'::jsonb)
    from public.dalil_boutique_customer_orders o where entreprise_id=v_profile and not (id=any(v_fixture_ids)))
    is distinct from v_original_rows then raise exception 'An existing real order changed'; end if;
  raise notice 'PASS merchant SQL: direct received/in_progress order/quote deletion to cancelled, confirmation/owner/stale/payment guards, protected confirmed/completed, archive/restore, redaction, idempotency, push cleanup/recreation guard, audit, unchanged real orders';
end;
$$;
rollback;
