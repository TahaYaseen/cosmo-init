-- 20260823000000_create_payload_collections.sql
--
-- Hand-written workaround migration for the `products`, `media`, and `users`
-- tables (architecture.md §6).
--
-- WHY THIS FILE EXISTS: architecture.md §6 states that Payload's Postgres
-- adapter (Drizzle ORM) should be the single source of truth for this
-- schema, generated via `payload migrate:create` / `payload migrate` from
-- src/collections/*.ts — NOT hand-written SQL. That remains the correct,
-- supported approach for this project going forward.
--
-- This file exists only because, in this specific workspace checkout
-- (a path containing a space — see README.md §4 "Known environment issue"),
-- the `payload` CLI's `generate:types`/`migrate:create`/`migrate` commands
-- fail due to an upstream tsx/Node worker-loader bug unrelated to this
-- project's code. This script hand-creates the same tables Payload would
-- have generated, so local development can proceed without the CLI.
--
-- RECOMMENDED LONGER-TERM FIX: once you're on a path with no spaces (or the
-- upstream tsx bug is fixed), delete this file and instead run:
--   pnpm payload migrate:create   # generates the real Payload/Drizzle migration
--   pnpm payload migrate          # applies it
-- Payload's own migration will supersede this hand-written one. Alternatively,
-- for pure local dev, you can add `push: true` to the postgresAdapter() config
-- in src/lib/payload.config.ts, which lets Payload auto-sync its schema on
-- every boot without any migration files at all (Prisma-`db push`-style) —
-- convenient for a learning project, but not recommended for production
-- (see Payload docs on `push` mode).
--
-- Tables created: products, media, users
-- Tables NOT created here: visitor_logs (see the sibling migration
-- 20260823000001_create_visitor_logs.sql — that one is real, not a
-- workaround; visitor_logs is intentionally outside Payload's pipeline
-- per architecture.md §6's "migration strategy exception").
-- Also NOT created here: payload_preferences, payload_migrations (Payload's
-- own internal bookkeeping tables) — Payload creates these itself on first
-- boot regardless of how the collection tables were created.

-- Required for gen_random_uuid() on Postgres < 13 core; a no-op on newer
-- versions where it's already built in. Supabase projects have this
-- available by default.
create extension if not exists pgcrypto;

-- ============================================================================
-- MEDIA (created before PRODUCTS since products.image_id references it)
-- ============================================================================

create table if not exists media (
  id           uuid primary key default gen_random_uuid(),
  filename     varchar(255) not null,
  url          text not null,
  mime_type    varchar(64) not null,
  filesize     integer not null,
  width        integer,
  height       integer,
  alt          varchar(255),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================================
-- PRODUCTS
-- ============================================================================

create table if not exists products (
  id                     uuid primary key default gen_random_uuid(),
  sku                    varchar(32) not null,
  name                   varchar(255) not null,
  category_label         varchar(64),
  price                  numeric(10, 2) not null check (price >= 0),
  size                   varchar(64),
  description            text not null,
  key_actives            text,
  ph_level               varchar(32),
  format                 varchar(64),
  fragrance_top_notes    text,
  fragrance_heart_notes  text,
  fragrance_base_notes   text,
  badge                  varchar(16) check (badge in ('NEW', 'BESTSELLER')),
  image_id               uuid not null references media(id),
  purchase_url           text,
  status                 varchar(16) not null default 'draft' check (status in ('draft', 'published')),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  constraint products_sku_unique unique (sku)
);

-- Partial index: every storefront query filters WHERE status = 'published'
-- (architecture.md §6 "Indexes").
create index if not exists products_status_published_idx
  on products (status)
  where status = 'published';

-- ============================================================================
-- USERS (Payload auth-enabled collection — Content Operator accounts)
-- ============================================================================

create table if not exists users (
  id                uuid primary key default gen_random_uuid(),
  email             varchar(255) not null,
  hashed_password   varchar(255) not null,
  login_attempts    integer not null default 0,
  lock_until        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint users_email_unique unique (email)
);

-- ============================================================================
-- Verification query (run manually after applying — not part of the migration)
-- ============================================================================
-- select table_name from information_schema.tables
--   where table_schema = 'public'
--   and table_name in ('products', 'media', 'users')
--   order by table_name;
