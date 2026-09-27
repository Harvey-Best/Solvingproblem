-- Home Doctor: initial schema.
--
-- Access model: the Next.js server does all writes with the service role key.
-- RLS is enabled everywhere so the public anon key can only ever read a
-- signed-in user's own rows (and nothing for anonymous visitors).

-- ---------------------------------------------------------------------------
-- helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- users: one row per auth.users row, created by trigger on signup
-- ---------------------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  stripe_customer_id text unique,
  -- first-touch attribution (utm_*, click ids, referrer) captured on landing
  utm jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- subscriptions: mirror of Stripe subscription state (written by webhook)
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  id text primary key, -- Stripe subscription id (sub_...)
  user_id uuid not null references public.users (id) on delete cascade,
  stripe_customer_id text not null,
  status text not null, -- trialing | active | past_due | canceled | unpaid | incomplete | incomplete_expired | paused
  price_id text,
  plan_interval text, -- month | year
  trial_end timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions (user_id);

create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- diagnoses: one row per diagnosis request. Doubles as the model request log
-- for quality review (never stores image bytes, only storage paths).
-- ---------------------------------------------------------------------------
create table public.diagnoses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete cascade,
  anon_id uuid, -- hd_anon cookie; lets anonymous work be claimed on signup
  ip_hash text, -- salted sha256, only used for anonymous abuse limits
  category text, -- category chip the user picked (null = not picked)
  description text,
  image_paths text[] not null default '{}', -- paths in the private "uploads" bucket
  status text not null default 'pending' check (status in ('pending', 'complete', 'failed')),
  title text,
  severity text,
  result_json jsonb,
  -- quality-review log
  model text,
  prompt_version text,
  request_json jsonb, -- the text we sent (images replaced by placeholders)
  raw_response text, -- raw model text of the last attempt
  error text,
  safety_overrides text[] not null default '{}', -- hazards our server-side guard escalated
  attempts int not null default 0,
  input_tokens int,
  output_tokens int,
  latency_ms int,
  utm jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index diagnoses_user_id_created_at_idx on public.diagnoses (user_id, created_at desc);
create index diagnoses_anon_id_idx on public.diagnoses (anon_id) where anon_id is not null;
create index diagnoses_ip_hash_created_at_idx on public.diagnoses (ip_hash, created_at desc)
  where user_id is null;

create trigger diagnoses_set_updated_at
before update on public.diagnoses
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- diagnosis_messages: follow-up thread under a diagnosis
-- ---------------------------------------------------------------------------
create table public.diagnosis_messages (
  id uuid primary key default gen_random_uuid(),
  diagnosis_id uuid not null references public.diagnoses (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text, -- user: their answer. assistant: short summary of what changed
  result_json jsonb, -- assistant: the full re-run diagnosis
  model text,
  prompt_version text,
  raw_response text,
  error text,
  attempts int,
  input_tokens int,
  output_tokens int,
  latency_ms int,
  created_at timestamptz not null default now()
);

create index diagnosis_messages_diagnosis_id_idx
  on public.diagnosis_messages (diagnosis_id, created_at);

-- ---------------------------------------------------------------------------
-- quote_checks: contractor quote reviews
-- ---------------------------------------------------------------------------
create table public.quote_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete cascade,
  anon_id uuid,
  ip_hash text,
  description text,
  image_paths text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'complete', 'failed')),
  title text,
  result_json jsonb,
  model text,
  prompt_version text,
  request_json jsonb,
  raw_response text,
  error text,
  attempts int not null default 0,
  input_tokens int,
  output_tokens int,
  latency_ms int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index quote_checks_user_id_created_at_idx on public.quote_checks (user_id, created_at desc);
create index quote_checks_anon_id_idx on public.quote_checks (anon_id) where anon_id is not null;

create trigger quote_checks_set_updated_at
before update on public.quote_checks
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: owners can read their own rows; all writes go through the server.
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.diagnoses enable row level security;
alter table public.diagnosis_messages enable row level security;
alter table public.quote_checks enable row level security;

create policy "Users can read their own profile"
  on public.users for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users can read their own subscriptions"
  on public.subscriptions for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own diagnoses"
  on public.diagnoses for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read messages on their own diagnoses"
  on public.diagnosis_messages for select to authenticated
  using (
    exists (
      select 1 from public.diagnoses d
      where d.id = diagnosis_id and d.user_id = (select auth.uid())
    )
  );

create policy "Users can read their own quote checks"
  on public.quote_checks for select to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Storage: private bucket for photos. Clients upload via short-lived signed
-- upload URLs minted by the server; reads go through server-signed URLs.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('uploads', 'uploads', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
