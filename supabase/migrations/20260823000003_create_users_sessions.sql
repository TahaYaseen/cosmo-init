-- 20260823000003_create_users_sessions.sql
--
-- Hand-written workaround migration for the `users_sessions` table
-- (docs/bug-fix-scope.md Root Cause 2).
--
-- WHY THIS FILE EXISTS: `Users.ts` has `auth: { lockTime, maxLoginAttempts }`
-- enabled, which leaves Payload's `useSessions` option at its default of
-- `true` (node_modules/payload/dist/collections/config/defaults.js). That
-- causes Payload to attach its built-in `sessions` array field
-- (node_modules/payload/dist/auth/baseFields/sessions.js) to the `users`
-- collection, which Payload's Postgres/Drizzle adapter materializes as a
-- separate child table named `users_sessions`. That table was never created
-- by 20260823000000_create_payload_collections.sql, because `payload
-- migrate`/`migrate:create` have never been able to run in this checkout
-- (see that migration's header comment + README.md §4 — upstream tsx bug
-- triggered by the space in this workspace's path). Without this table,
-- Payload's dev-mode schema-push (`pushDevSchema()`) detects the missing
-- table on every request and blocks on an interactive "create vs rename"
-- prompt that can never be answered mid-request, hanging each `GET /` for
-- 90+ seconds. This migration hand-creates the exact table Payload's own
-- Drizzle schema-builder would generate, so the table exists up front and
-- `pushDevSchema()` (now additionally disabled via `push: false` in
-- src/lib/payload.config.ts) never has anything to diff or prompt about.
--
-- Column/index/FK shapes below were derived by reading the installed
-- @payloadcms/drizzle@3.88.0 schema-builder source directly (not guessed):
--   - traverseFields.js (array-field table construction: base columns,
--     indexes, foreign key)
--   - postgres/schema/setColumnID.js (the array's own `id` sub-field is
--     `type: 'text'`, which makes the adapter use a `varchar` primary key
--     column instead of the default `uuid` — no DB-side default generator,
--     Payload's application code supplies the id value on insert)
--   - build.js (confirms array child tables do NOT get generic
--     created_at/updated_at audit columns — only the field-defined
--     `created_at`/`expires_at` columns from sessionsFieldConfig itself)
--
-- Table name: users_sessions (createTableName.js: `${parentTable}_${fieldName}`)
-- NOT created here: any change to `users`, `products`, `media`, or
-- `visitor_logs` — this migration only adds the new child table.

create table if not exists users_sessions (
  id          varchar primary key not null,
  "_order"    integer not null,
  "_parent_id" uuid not null,
  created_at  timestamptz(3),
  expires_at  timestamptz(3) not null,

  constraint users_sessions_parent_id_fk
    foreign key ("_parent_id") references users(id) on delete cascade
);

create index if not exists users_sessions_order_idx
  on users_sessions ("_order");

create index if not exists users_sessions_parent_id_idx
  on users_sessions ("_parent_id");

-- ============================================================================
-- Verification query (run manually after applying — not part of the migration)
-- ============================================================================
-- select table_name from information_schema.tables
--   where table_schema = 'public'
--   and table_name = 'users_sessions';
