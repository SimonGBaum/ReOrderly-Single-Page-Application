-- public.users
-- Stores app-specific profile data for authenticated users.
-- Credentials (email, password) are managed by Supabase Auth in auth.users.
-- This row is created immediately after a successful auth.users signup.

create table public.users (
  id             uuid         not null primary key references auth.users (id) on delete cascade,
  username       varchar(50)  not null unique,
  first_name     varchar(100) not null,
  last_name      varchar(100) not null,
  mailing_address text        null,  -- not collected at signup; filled on Profile page
  billing_address text        null,  -- not collected at signup; filled on Profile page
  created_at     timestamptz  not null default now(),
  updated_at     timestamptz  not null default now()
);

-- Keep updated_at current on every write
create trigger set_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- RLS: enabled, default-deny. Users can only see and modify their own row.
alter table public.users enable row level security;

create policy "users: select own row"
  on public.users for select
  to authenticated
  using (id = auth.uid());

create policy "users: insert own row"
  on public.users for insert
  to authenticated
  with check (id = auth.uid());

create policy "users: update own row"
  on public.users for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "users: delete own row"
  on public.users for delete
  to authenticated
  using (id = auth.uid());
