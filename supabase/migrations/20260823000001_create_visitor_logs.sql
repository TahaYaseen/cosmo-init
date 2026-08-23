-- UC-006: Visitor Analytics/Tracking Logging (v1.1)
-- Hand-written plain SQL migration — architecture.md §6 migration-strategy
-- exception: visitor_logs is explicitly NOT a Payload collection, so it
-- falls outside payload migrate's Drizzle-diff pipeline. Apply via the
-- Supabase CLI (`supabase db push` / `supabase migration up`) or the
-- Supabase dashboard's SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.visitor_logs (
  id                 uuid primary key default gen_random_uuid(),
  ip_address         inet         not null,
  country_code       varchar(2),
  city               varchar(128),
  occurred_at        timestamptz  not null default now(),
  user_agent         text,
  referrer           text,
  landing_page_path  varchar(512) not null,
  utm_source         varchar(255),
  utm_medium         varchar(255),
  utm_campaign       varchar(255),
  utm_term           varchar(255),
  utm_content        varchar(255),
  created_at         timestamptz  not null default now()
);

comment on table public.visitor_logs is
  'Append-only operational log of storefront page views for marketing/traffic '
  'attribution (UC-006). Written directly by the Next.js Middleware via the '
  'service_role key — NOT a Payload CMS collection, not visible in /admin.';

-- Supports the retention/auto-purge job's WHERE created_at < now() - interval
-- filter at low-thousands-of-rows/day scale. No other index is needed — this
-- table has no read-path/query API (write-only per PRD §9).
create index if not exists visitor_logs_created_at_idx on public.visitor_logs (created_at);

-- Row Level Security: default-deny. No anon/authenticated Postgres role may
-- SELECT/INSERT/UPDATE/DELETE. Only the service_role key (used exclusively
-- server-side by src/lib/visitor-logging.ts) bypasses RLS entirely, which is
-- how Supabase's service_role has always worked — no policy is needed to
-- grant it access, only ones would be needed to grant anon/authenticated
-- access, and none are created here (architecture.md §6/§10).
alter table public.visitor_logs enable row level security;
alter table public.visitor_logs force row level security;

-- Explicitly revoke default grants so anon/authenticated cannot read or
-- write even before RLS is considered (defense-in-depth alongside RLS).
revoke all on public.visitor_logs from anon, authenticated;
