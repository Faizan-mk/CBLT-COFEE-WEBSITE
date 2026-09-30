-- ============================================================
-- The Coffee Bean & Tea Leaf Pakistan - backend schema
-- Run in Supabase: SQL Editor -> New query -> paste -> Run
-- Safe to run more than once.
--
-- Sign In / Sign Up use Supabase Auth (auth.users), which needs no table here.
-- Read submissions in the dashboard: Table Editor -> the table name.
-- ============================================================

-- 1) Newsletter subscribers (footer/home newsletter form)
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique check (char_length(email) <= 320),
  created_at timestamptz default now()
);

-- 2) Contact messages (Contact page form)
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) <= 200),
  email      text not null check (char_length(email) <= 320),
  subject    text check (char_length(subject) <= 300),
  message    text not null check (char_length(message) <= 5000),
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- Visitors may only add rows. Nobody can read them through the website;
-- you read them in the Supabase dashboard, which bypasses these rules.
-- ============================================================
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages      enable row level security;

drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

drop policy if exists "Anyone can send a message" on public.contact_messages;
create policy "Anyone can send a message"
  on public.contact_messages for insert
  with check (true);

-- Removed: this let any signed-up visitor read every contact message.
drop policy if exists "Authenticated users can read messages" on public.contact_messages;
