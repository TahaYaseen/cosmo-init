import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';

/**
 * Visitor Analytics Logging (UC-006) — architecture.md ADR-010.
 *
 * This is the ONE deliberate exception to the "Local API only" Data Access
 * rule (architecture.md §2.4): it writes directly to Supabase Postgres via
 * @supabase/supabase-js and the service_role key, entirely bypassing
 * Payload's Local API and Drizzle adapter, because `visitor_logs` is
 * explicitly NOT a Payload collection (architecture.md §6/§7).
 *
 * Called exclusively from src/middleware.ts inside an event.waitUntil()
 * callback, i.e. AFTER the response has already been sent to the Visitor —
 * this function must never be awaited on the response-critical path.
 */

export interface VisitorPageViewMetadata {
  ipAddress: string | null;
  countryCode: string | null;
  city: string | null;
  userAgent: string | null;
  referrer: string | null;
  landingPagePath: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
}

/**
 * Pure function: extracts all loggable metadata synchronously off the
 * request object. Split out from logVisitorPageView() so it can be unit
 * tested without a network dependency.
 */
export function extractVisitorPageViewMetadata(request: NextRequest): VisitorPageViewMetadata {
  const { searchParams, pathname } = request.nextUrl;

  // Vercel's platform-provided geolocation (architecture.md §12) — absent
  // outside Vercel's edge network (e.g. local dev); always treated as
  // optional/nullable (UC-006 AC3).
  const countryCode = request.headers.get('x-vercel-ip-country');
  const city = request.headers.get('x-vercel-ip-city');

  // x-forwarded-for may carry a comma-separated chain; the first entry is
  // the originating client. Fall back to Vercel's x-real-ip, then null.
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ipAddress = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || null;

  return {
    ipAddress,
    countryCode: countryCode || null,
    city: city || null,
    userAgent: request.headers.get('user-agent') || null,
    referrer: request.headers.get('referer') || null,
    landingPagePath: pathname,
    utmSource: searchParams.get('utm_source') || null,
    utmMedium: searchParams.get('utm_medium') || null,
    utmCampaign: searchParams.get('utm_campaign') || null,
    utmTerm: searchParams.get('utm_term') || null,
    utmContent: searchParams.get('utm_content') || null,
  };
}

/**
 * Writes one row to visitor_logs. Never throws — any failure (missing env
 * vars, network error, RLS misconfiguration, etc.) is caught and only
 * console.error'd server-side (captured by Vercel's function logs), so a
 * logging failure can never surface to, delay, or block the Visitor
 * (UC-006 AC6 — the architecture's primary answer to the "must never block
 * page render" constraint).
 */
export async function logVisitorPageView(request: NextRequest): Promise<void> {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      // Not configured (e.g. local dev without Supabase set up yet) — this
      // is expected and must not throw or log noisily on every request.
      return;
    }

    const metadata = extractVisitorPageViewMetadata(request);

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from('visitor_logs').insert({
      ip_address: metadata.ipAddress,
      country_code: metadata.countryCode,
      city: metadata.city,
      user_agent: metadata.userAgent,
      referrer: metadata.referrer,
      landing_page_path: metadata.landingPagePath,
      utm_source: metadata.utmSource,
      utm_medium: metadata.utmMedium,
      utm_campaign: metadata.utmCampaign,
      utm_term: metadata.utmTerm,
      utm_content: metadata.utmContent,
    });

    if (error) {
      console.error('[visitor-logging] insert failed:', error.message);
    }
  } catch (err) {
    console.error('[visitor-logging] unexpected failure:', err);
  }
}
