-- Phase 3: free trial, Stripe billing state, transactional email log.
--
-- The 7-day trial is app-managed (no card): it starts when the account is
-- created. Stripe only comes in when someone subscribes; its subscription
-- state is mirrored into public.subscriptions by the webhook.

alter table public.users
  add column trial_started_at timestamptz,
  add column trial_ends_at timestamptz;

-- The daily "trial ends in 2 days" job scans upcoming trial ends.
create index users_trial_ends_at_idx on public.users (trial_ends_at);

-- Newer Stripe API versions schedule portal cancellations with cancel_at.
alter table public.subscriptions
  add column cancel_at timestamptz;

-- ---------------------------------------------------------------------------
-- stripe_events: webhook deliveries already handled (Stripe retries and can
-- deliver an event more than once).
-- ---------------------------------------------------------------------------
create table public.stripe_events (
  id text primary key, -- evt_...
  type text not null,
  received_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- email_log: one row per transactional email, keyed so each is sent once
-- (welcome:<user>, trial_ending:<user>, receipt:<invoice>).
-- ---------------------------------------------------------------------------
create table public.email_log (
  key text primary key,
  kind text not null,
  user_id uuid references public.users (id) on delete cascade,
  to_email text not null,
  provider_id text,
  sent_at timestamptz not null default now()
);

create index email_log_user_id_idx on public.email_log (user_id);

-- Server-only tables: RLS on with no policies, so only the service role can
-- touch them.
alter table public.stripe_events enable row level security;
alter table public.email_log enable row level security;
