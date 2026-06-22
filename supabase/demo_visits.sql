-- ─────────────────────────────────────────────────────────────────────────────
--  onenccc demo-visit tracking table
--  Paste into the Supabase SQL editor (same project as the HVAC site) and run.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.demo_visits (
  id          bigint generated always as identity primary key,
  page        text,                      -- landing | us | uae | india
  phase       text,                      -- open | engaged
  kind        text,                      -- human (open/engaged) | scanner
  reason      text,                      -- why flagged a scanner (UA / datacenter / automation)
  location    text,                      -- "City, Region, Country"
  country     text,
  org         text,                      -- ISP / org / AS name
  is_mobile   boolean,
  user_agent  text,
  created_at  timestamptz default now()
);

-- Inserts come only from the server (service-role key), which bypasses RLS.
-- Enable RLS with no public policies so nothing is readable/writable anonymously.
alter table public.demo_visits enable row level security;

-- Handy view: real human visits only, newest first.
create or replace view public.demo_human_visits as
  select created_at, page, phase, location, org, is_mobile
  from public.demo_visits
  where kind <> 'scanner'
  order by created_at desc;
