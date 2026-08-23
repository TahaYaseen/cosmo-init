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
    cached = getPayload({ config });
  }
  return cached;
}
