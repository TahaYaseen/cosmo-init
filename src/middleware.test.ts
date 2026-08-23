import { describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

vi.mock('@/lib/visitor-logging', () => ({
  // Never resolves — simulates a slow/hung Supabase call. If the middleware
  // were to await this, the test itself would hang/timeout, proving the
  // non-blocking guarantee structurally rather than just "didn't throw".
  logVisitorPageView: vi.fn(() => new Promise<void>(() => {})),
}));

function makeEvent() {
  const waitUntil = vi.fn();
  return { event: { waitUntil } as unknown as import('next/server').NextFetchEvent, waitUntil };
}

describe('middleware (UC-006 AC1, AC6 — non-blocking guarantee)', () => {
  it('returns NextResponse.next() synchronously without awaiting the logging promise', () => {
    const request = new NextRequest('http://localhost:3000/');
    const { event, waitUntil } = makeEvent();

    const response = middleware(request, event);

    expect(response).toBeDefined();
    expect(response.headers.get('x-middleware-next')).toBe('1');
    // The logging call was scheduled via waitUntil, not awaited inline.
    expect(waitUntil).toHaveBeenCalledTimes(1);
  });

  it('is wired to all 3 storefront route patterns', async () => {
    const { config } = await import('@/middleware');
    expect(config.matcher).toEqual(['/', '/products/:path*', '/about']);
  });
});
