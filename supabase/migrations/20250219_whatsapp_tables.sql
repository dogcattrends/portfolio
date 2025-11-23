create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  id_ext text not null unique,
  phone text not null,
  last_message_at timestamptz not null default timezone('utc', now()),
  tags text[] not null default '{}'::text[],
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  id_ext text not null unique,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  direction text not null check (direction in ('in', 'out')),
  type text not null,
  body text,
  media_url text,
  status text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "service_role_manage_conversations"
on public.conversations
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "service_role_manage_messages"
on public.messages
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
