-- Shared trigger function: keeps updated_at in sync on every UPDATE.
-- Applied to all tables via a BEFORE UPDATE trigger.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
