-- Hand-written workaround migration (same convention as 20260823000000/000003/000005).
--
-- The original `users` table (20260823000000_create_payload_collections.sql)
-- invented a `hashed_password` column that Payload's local auth strategy
-- never actually reads or writes. Confirmed by reading
-- node_modules/payload/dist/auth/baseFields/auth.js directly: Payload's
-- built-in email/password auth stores credentials as separate `salt` +
-- `hash` text columns, plus `resetPasswordToken` / `resetPasswordExpiration`
-- for the password-reset flow. None of those four existed, which is why
-- the admin panel's user list query failed with
-- `column users.reset_password_token does not exist`. Additionally,
-- `hashed_password` being NOT NULL with no default would have blocked the
-- "create first user" insert (Payload never supplies a value for it).

alter table users
  drop column if exists hashed_password,
  add column if not exists reset_password_token text,
  add column if not exists reset_password_expiration timestamptz,
  add column if not exists salt text,
  add column if not exists hash text;
