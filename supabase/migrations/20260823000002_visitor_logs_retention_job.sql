-- UC-006 AC8 (v1.1): 180-day rolling retention with automated auto-purge —
-- architecture.md ADR-011. Implemented entirely inside the database tier via
-- Supabase's pg_cron extension — no new application code, Route Handler, or
-- external scheduler.
--
-- NOTE: pg_cron must be enabled per-project (one-click in the Supabase
-- dashboard's Database > Extensions panel, or the CREATE EXTENSION statement
-- below, which requires sufficient privileges — typically run by Supabase's
-- own migration/dashboard tooling rather than an app-level migration user).
-- This must be applied separately to each environment (dev, staging,
-- production) per architecture.md §8's "One-time per-environment setup."

create extension if not exists pg_cron;

select
  cron.schedule(
    'purge-visitor-logs',
    '0 3 * * *', -- daily at 03:00 UTC, off-peak
    $$delete from public.visitor_logs where created_at < now() - interval '180 days'$$
  )
where not exists (
  select 1 from cron.job where jobname = 'purge-visitor-logs'
);
