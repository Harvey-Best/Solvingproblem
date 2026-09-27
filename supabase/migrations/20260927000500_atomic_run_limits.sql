-- ---------------------------------------------------------------------------
-- Atomic usage limits.
--
-- The allowance used to be "count rows, then insert one" as two separate
-- requests, so a burst of parallel requests could all see a count of zero and
-- all run. reserve_run does the count and the insert in one transaction, under
-- a transaction-scoped advisory lock per owner (and per IP for anonymous
-- visitors), and returns either the new pending row's id or why it was denied.
--
-- Follow-ups get a per-diagnosis lock instead: one run at a time per thread.
-- ---------------------------------------------------------------------------

alter table public.diagnoses add column followup_lock_until timestamptz;

create or replace function public.reserve_run(
  p_kind text,              -- 'diagnosis' | 'quote'
  p_user_id uuid,
  p_anon_id uuid,
  p_ip_hash text,
  p_user_per_day int,       -- signed in: both kinds combined, rolling 24h
  p_anon_free int,          -- anonymous: per kind, per anon id, ever
  p_ip_per_day int,         -- anonymous: both kinds combined per IP, rolling 24h
  p_pending_seconds int     -- how long an unfinished run still counts
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_since timestamptz := now() - interval '1 day';
  v_pending_since timestamptz := now() - make_interval(secs => p_pending_seconds);
  v_used bigint;
  v_id uuid;
begin
  if p_kind not in ('diagnosis', 'quote') then
    raise exception 'unknown run kind %', p_kind;
  end if;

  if p_user_id is not null then
    perform pg_advisory_xact_lock(hashtextextended('run:user:' || p_user_id::text, 0));
    select
      (select count(*) from public.diagnoses d
        where d.user_id = p_user_id and d.created_at >= v_since
          and (d.status = 'complete' or (d.status = 'pending' and d.created_at >= v_pending_since)))
      + (select count(*) from public.quote_checks q
        where q.user_id = p_user_id and q.created_at >= v_since
          and (q.status = 'complete' or (q.status = 'pending' and q.created_at >= v_pending_since)))
      into v_used;
    if v_used >= p_user_per_day then
      return jsonb_build_object('denied', 'rate_limited');
    end if;
  else
    -- Lock order is always anon id, then IP, so two requests can't deadlock.
    if p_anon_id is not null then
      perform pg_advisory_xact_lock(hashtextextended('run:anon:' || p_anon_id::text, 0));
      if p_kind = 'diagnosis' then
        select count(*) from public.diagnoses d
          where d.anon_id = p_anon_id
            and (d.status = 'complete' or (d.status = 'pending' and d.created_at >= v_pending_since))
          into v_used;
      else
        select count(*) from public.quote_checks q
          where q.anon_id = p_anon_id
            and (q.status = 'complete' or (q.status = 'pending' and q.created_at >= v_pending_since))
          into v_used;
      end if;
      if v_used >= p_anon_free then
        return jsonb_build_object('denied', 'signup_required');
      end if;
    end if;

    if p_ip_hash is not null then
      perform pg_advisory_xact_lock(hashtextextended('run:ip:' || p_ip_hash, 0));
      select
        (select count(*) from public.diagnoses d
          where d.user_id is null and d.ip_hash = p_ip_hash and d.created_at >= v_since
            and (d.status = 'complete' or (d.status = 'pending' and d.created_at >= v_pending_since)))
        + (select count(*) from public.quote_checks q
          where q.user_id is null and q.ip_hash = p_ip_hash and q.created_at >= v_since
            and (q.status = 'complete' or (q.status = 'pending' and q.created_at >= v_pending_since)))
        into v_used;
      if v_used >= p_ip_per_day then
        return jsonb_build_object('denied', 'signup_required');
      end if;
    end if;
  end if;

  if p_kind = 'diagnosis' then
    insert into public.diagnoses (user_id, anon_id, ip_hash, status)
      values (p_user_id, p_anon_id, p_ip_hash, 'pending')
      returning id into v_id;
  else
    insert into public.quote_checks (user_id, anon_id, ip_hash, status)
      values (p_user_id, p_anon_id, p_ip_hash, 'pending')
      returning id into v_id;
  end if;
  return jsonb_build_object('id', v_id);
end;
$$;

-- Server only (service role). Supabase grants new functions to anon and
-- authenticated by default, which would let anyone insert rows through it.
revoke execute on function public.reserve_run(text, uuid, uuid, text, int, int, int, int) from public, anon, authenticated;
grant execute on function public.reserve_run(text, uuid, uuid, text, int, int, int, int) to service_role;
