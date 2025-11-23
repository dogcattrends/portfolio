-- Enable required extensions
create extension if not exists "pgcrypto";

-- Domain specific enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'item_status') then
    create type public.item_status as enum ('new', 'used', 'repair');
  end if;
  if not exists (select 1 from pg_type where typname = 'movement_type') then
    create type public.movement_type as enum ('in', 'out', 'repair');
  end if;
end
$$;

-- Organizations are implicit; store org_id directly in each table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  email text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  sku text not null unique,
  name text not null,
  category text not null,
  location text,
  status public.item_status not null default 'new',
  min_qty integer not null default 0 check (min_qty >= 0),
  qty integer not null default 0 check (qty >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.movements (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  item_id uuid not null references public.items(id) on delete cascade,
  type public.movement_type not null,
  qty integer not null check (qty > 0),
  note text,
  user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_users_org on public.users(org_id);
create index if not exists idx_items_org on public.items(org_id);
create index if not exists idx_movements_org on public.movements(org_id);
create index if not exists idx_movements_item on public.movements(item_id);

-- Helper function to read org_id from JWT
create or replace function public.current_org_id()
returns uuid
language sql
stable
as $$
  select nullif(auth.jwt()->>'org_id', '')::uuid;
$$;

-- Aggregated public view
create or replace view public.inventory_public_stats as
select
  category,
  status,
  sum(qty) as total_qty,
  sum(min_qty) as total_min_qty,
  count(*) as items_count
from public.items
group by category, status;

grant select on public.inventory_public_stats to anon;
grant select on public.inventory_public_stats to authenticated;

-- Row Level Security
alter table public.users enable row level security;
alter table public.items enable row level security;
alter table public.movements enable row level security;

-- Users policies
create policy "users_select_by_org"
on public.users
for select
using (
  auth.role() = 'service_role'
  or org_id = public.current_org_id()
);

create policy "users_insert_by_org"
on public.users
for insert
with check (
  auth.role() = 'service_role'
  or org_id = public.current_org_id()
);

create policy "users_update_by_org"
on public.users
for update
using (
  auth.role() = 'service_role'
  or org_id = public.current_org_id()
)
with check (
  auth.role() = 'service_role'
  or org_id = public.current_org_id()
);

-- Items policies
create policy "items_select_by_org"
on public.items
for select
using (
  auth.role() = 'service_role'
  or org_id = public.current_org_id()
);

create policy "items_insert_by_org"
on public.items
for insert
with check (
  auth.role() = 'service_role'
  or org_id = public.current_org_id()
);

create policy "items_update_by_org"
on public.items
for update
using (
  auth.role() = 'service_role'
  or org_id = public.current_org_id()
)
with check (
  auth.role() = 'service_role'
  or org_id = public.current_org_id()
);

-- Movements policies
create policy "movements_select_by_org"
on public.movements
for select
using (
  auth.role() = 'service_role'
  or org_id = public.current_org_id()
);

create policy "movements_insert_by_org"
on public.movements
for insert
with check (
  auth.role() = 'service_role'
  or org_id = public.current_org_id()
);

create policy "movements_update_by_org"
on public.movements
for update
using (
  auth.role() = 'service_role'
  or org_id = public.current_org_id()
)
with check (
  auth.role() = 'service_role'
  or org_id = public.current_org_id()
);
