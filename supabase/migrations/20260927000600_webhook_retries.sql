-- ---------------------------------------------------------------------------
-- Stripe webhook robustness.
--
-- 1. stripe_events.processed_at: an event id used to be recorded before it was
--    handled, so if the function died in between, Stripe's retries were
--    acknowledged as duplicates and the event was lost (a missed
--    customer.subscription.deleted would leave access on forever). Now an
--    event only counts as done once processed_at is set; an unprocessed claim
--    older than a few minutes is taken over by the next delivery.
-- 2. Subscriptions never leave canceled / incomplete_expired in Stripe, so a
--    stale "active" snapshot written by a slower concurrent sync (success page
--    vs webhook) must not overwrite one.
-- ---------------------------------------------------------------------------

alter table public.stripe_events add column processed_at timestamptz;
-- Rows from before this column were handled successfully (failures deleted them).
update public.stripe_events set processed_at = received_at where processed_at is null;

-- Returns 'claimed' (handle it now), 'processed' (already done) or
-- 'in_progress' (another delivery is handling it right now).
create or replace function public.claim_stripe_event(p_id text, p_type text, p_stale_seconds int)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_processed_at timestamptz;
begin
  insert into public.stripe_events (id, type) values (p_id, p_type)
    on conflict (id) do nothing;
  if found then
    return 'claimed';
  end if;

  -- Seen before and never finished: take it over once the old claim is stale.
  update public.stripe_events
    set received_at = now()
    where id = p_id
      and processed_at is null
      and received_at < now() - make_interval(secs => p_stale_seconds);
  if found then
    return 'claimed';
  end if;

  select processed_at into v_processed_at from public.stripe_events where id = p_id;
  return case when v_processed_at is not null then 'processed' else 'in_progress' end;
end;
$$;

revoke execute on function public.claim_stripe_event(text, text, int) from public, anon, authenticated;
grant execute on function public.claim_stripe_event(text, text, int) to service_role;

create or replace function public.keep_terminal_subscription_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status in ('canceled', 'incomplete_expired')
     and new.status not in ('canceled', 'incomplete_expired') then
    return null; -- stale snapshot: keep the terminal row as it is
  end if;
  return new;
end;
$$;

revoke execute on function public.keep_terminal_subscription_status() from public, anon, authenticated;

create trigger subscriptions_keep_terminal_status
before update on public.subscriptions
for each row execute function public.keep_terminal_subscription_status();
