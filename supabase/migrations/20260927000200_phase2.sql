-- Phase 2: quote check guard log, prompt-cache accounting, and indexes for
-- the per-IP anonymous limit (which now spans diagnoses and quote checks).

alter table public.quote_checks
  add column guard_flags text[] not null default '{}',
  add column utm jsonb;

alter table public.diagnoses
  add column cache_read_tokens int,
  add column cache_write_tokens int;

alter table public.diagnosis_messages
  add column cache_read_tokens int,
  add column cache_write_tokens int;

alter table public.quote_checks
  add column cache_read_tokens int,
  add column cache_write_tokens int;

create index quote_checks_ip_hash_created_at_idx on public.quote_checks (ip_hash, created_at desc)
  where user_id is null;
