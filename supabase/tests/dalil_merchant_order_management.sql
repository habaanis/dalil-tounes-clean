-- Run after 20261126095355_dalil_merchant_order_archive_delete.sql.
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
  v_state text;
  v_step text;
  v_payment text;
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
    'QA rollback','qa@example.invalid','cancelled',gen_random_uuid(),repeat('b',64)) returning id into v_foreign_order;
  begin
    perform public.dalil_merchant_manage_order(v_actor,v_profile,v_foreign_order,'delete',v_row.updated_at,true);
    raise exception 'Cross-establishment order id unexpectedly accepted';
  exception when no_data_found then null; end;

  begin
    perform public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'archive',v_row.updated_at-interval '1 second',false);
    raise exception 'Stale revision unexpectedly accepted';
  exception when serialization_failure then null; end;

  -- All active processing states are protected from archiving, restoring and deleting.
  foreach v_state in array array['received','in_progress','confirmed'] loop
    update public.dalil_boutique_customer_orders set status=v_state where id=v_order returning * into v_row;
    foreach v_step in array array['archive','restore','delete'] loop
      begin
        perform public.dalil_merchant_manage_order(v_actor,v_profile,v_order,v_step,v_row.updated_at,true);
        raise exception 'Active order unexpectedly allowed %',v_step;
      exception when check_violation then null; end;
    end loop;
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
  foreach v_payment in array array['pending','paid','partially_paid','refunded'] loop
    update public.dalil_boutique_customer_orders set status='cancelled',payment_status=v_payment,
      paid_amount=case when v_payment='paid' then 10 when v_payment='partially_paid' then 5 else 0 end,
      payment_provider=case when v_payment='pending' then null else 'qa-provider' end,
      payment_reference=case when v_payment='pending' then null else 'qa-payment-reference' end,
      payment_verified_at=case when v_payment='pending' then null else now() end
      where id=v_order returning * into v_row;
    begin
      perform public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'delete',v_row.updated_at,true);
      raise exception 'Protected payment unexpectedly erased: %',v_payment;
    exception when check_violation then null; end;
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
  if (select count(*) from public.dalil_boutique_customer_orders where entreprise_id=v_profile)<>v_original_count+1
    then raise exception 'Unexpected real order mutation'; end if;
  begin
    perform public.dalil_merchant_manage_order(v_actor,v_profile,v_order,'restore',v_row.updated_at,false);
    raise exception 'Deleted request unexpectedly restored';
  exception when no_data_found then null; end;
  raise notice 'PASS merchant SQL: owner scope, stale revision, all active/payment guards, archive, restore, redaction, idempotency, push cleanup/recreation guard, audit';
end;
$$;
rollback;
