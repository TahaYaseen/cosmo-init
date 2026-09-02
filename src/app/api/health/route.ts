import { NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/getPayloadClient';

/**
 * Liveness/readiness probe (architecture.md §12). Exercises a real, cheap
 * Payload Local API call rather than a stub 200, so an external
 * uptime-monitoring tool can detect a real Postgres/backend outage.
 */
export async function GET() {
  try {
    const payload = await getPayloadClient();
    await payload.find({ collection: 'products', limit: 1 });
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('[DB] ❌ Health check failed — database unreachable:', error);
    return NextResponse.json({ status: 'error' }, { status: 503 });
  }
}
