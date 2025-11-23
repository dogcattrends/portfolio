alter table public.conversations
add column if not exists assigned_to uuid;
