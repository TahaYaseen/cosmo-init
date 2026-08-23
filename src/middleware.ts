import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import { logVisitorPageView } from '@/lib/visitor-logging';

/**
 * Visitor Analytics Logging Middleware (UC-006) — architecture.md §12, ADR-010.
 *
 * Matched against the three storefront routes only. Reads request metadata
 * synchronously, then schedules the (non-blocking) visitor_logs write via
 * event.waitUntil() and returns NextResponse.next() immediately — the write
 * runs only AFTER the response has already been sent, guaranteeing the
 * "must never block or delay page render" business rule by construction.
 */
export function middleware(request: NextRequest, event: NextFetchEvent): NextResponse {
  event.waitUntil(logVisitorPageView(request));
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/products/:path*', '/about'],
};
