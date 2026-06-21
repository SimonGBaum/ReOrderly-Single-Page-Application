-- public.delivery_schedules
-- 1:1 with orders (enforced by UNIQUE on order_id).
-- Only created for recurring orders — no row exists for one-time orders.
-- Tracks the recurrence pattern and running delivery count.

create table public.delivery_schedules (
  id                     uuid        not null primary key default gen_random_uuid(),
  order_id               uuid        not null unique references public.orders (id) on delete cascade,
  delivery_frequency     varchar(20) not null
                         check (delivery_frequency in ('weekly','biweekly','monthly','custom')),
  custom_frequency_days  int         null check (custom_frequency_days > 0),  -- required when delivery_frequency = 'custom'
  until_cancelled        boolean     not null default false,  -- true = unlimited deliveries
  max_deliveries         int         null check (max_deliveries > 0),          -- required when until_cancelled = false
  delivery_count         int         not null default 0 check (delivery_count >= 0),
  last_delivery_date     timestamptz null,  -- null until first delivery is recorded
  expected_delivery_date timestamptz null,  -- null for draft orders
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Keep updated_at current on every write
create trigger set_delivery_schedules_updated_at
  before update on public.delivery_schedules
  for each row execute function public.set_updated_at();

-- Note: UNIQUE on order_id implies an index; no separate index needed.

-- RLS: enabled, default-deny.
-- A user owns a delivery_schedule if they own the parent order.
alter table public.delivery_schedules enable row level security;

create policy "delivery_schedules: select via order ownership"
  on public.delivery_schedules for select
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where id = delivery_schedules.order_id
        and user_id = auth.uid()
    )
  );

create policy "delivery_schedules: insert via order ownership"
  on public.delivery_schedules for insert
  to authenticated
  with check (
    exists (
      select 1 from public.orders
      where id = delivery_schedules.order_id
        and user_id = auth.uid()
    )
  );

create policy "delivery_schedules: update via order ownership"
  on public.delivery_schedules for update
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where id = delivery_schedules.order_id
        and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.orders
      where id = delivery_schedules.order_id
        and user_id = auth.uid()
    )
  );

create policy "delivery_schedules: delete via order ownership"
  on public.delivery_schedules for delete
  to authenticated
  using (
    exists (
      select 1 from public.orders
      where id = delivery_schedules.order_id
        and user_id = auth.uid()
    )
  );
