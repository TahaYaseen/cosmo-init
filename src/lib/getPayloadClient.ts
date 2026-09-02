import { getPayload, type Payload } from 'payload';
import config from '@/lib/payload.config';

let cached: Promise<Payload> | null = null;

/**
 * Thin memoized wrapper around Payload's Local API entry point.
 *
 * Data Access pattern (architecture.md §2.4): only Server Components and
 * Next.js Route Handlers may import this. Client Components must never
 * import payload.config.ts or call Payload directly.
 */
export function getPayloadClient(): Promise<Payload> {
  if (!cached) {
    cached = getPayload({ config })
      .then((payload) => {
        // Unambiguous deploy-log signal that the Supabase Postgres
        // connection (via Payload's db-postgres adapter) came up cleanly.
        console.log('[DB] ✅ Database connection successful (Supabase Postgres)');
        return payload;
      })
      .catch((error) => {
        console.error('[DB] ❌ Database connection FAILED:', error);
        // Don't permanently cache a rejected promise — otherwise every
        // future call keeps failing even after the DB recovers.
        cached = null;
        throw error;
      });
  }
  return cached;
}
