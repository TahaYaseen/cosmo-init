/**
 * Next.js instrumentation hook.
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * `register()` runs once when the server process boots — including in
 * deployed/production environments — making it the earliest, most
 * unambiguous place to confirm the Supabase Postgres connection (via
 * Payload's db-postgres adapter) is actually reachable, rather than only
 * finding out from a failed request later.
 */
export async function register() {
  // Payload's db-postgres adapter uses Node-only APIs (the `pg` driver), so
  // only run this check in the Node.js server runtime. `register()` also
  // fires for the Edge runtime (e.g. because middleware.ts runs on the
  // edge) — importing/initializing Payload there would throw.
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  const { getPayloadClient } = await import('@/lib/getPayloadClient');

  try {
    const payload = await getPayloadClient();
    // Cheap, real round-trip — proves the pool can actually reach Supabase
    // Postgres, not just that the client object constructed successfully.
    await payload.find({ collection: 'products', limit: 1 });
  } catch (error) {
    // getPayloadClient() already logs connection-level failures on its own.
    // This also covers the case where the pool connects but the startup
    // query itself fails (e.g. a missing table/migration), so a DB issue
    // is always surfaced at boot either way.
    console.error('[DB] ❌ Startup DB readiness check failed:', error);
  }
}
