import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { extractVisitorPageViewMetadata, logVisitorPageView } from '@/lib/visitor-logging';

const insertMock = vi.fn();
const fromMock = vi.fn(() => ({ insert: insertMock }));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ from: fromMock })),
}));

function makeRequest(url: string, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(url, { headers });
}

describe('extractVisitorPageViewMetadata (UC-006 AC1)', () => {
  it('captures IP, UA, referrer, landing path, and UTM params on the happy path', () => {
    const request = makeRequest('http://localhost:3000/products/gl-01?utm_source=newsletter&utm_medium=email', {
      'x-forwarded-for': '203.0.113.5, 70.41.3.18',
      'user-agent': 'Mozilla/5.0 Test',
      referer: 'https://google.com/search',
      'x-vercel-ip-country': 'IN',
      'x-vercel-ip-city': 'Mumbai',
    });

    const meta = extractVisitorPageViewMetadata(request);

    expect(meta.ipAddress).toBe('203.0.113.5');
    expect(meta.userAgent).toBe('Mozilla/5.0 Test');
    expect(meta.referrer).toBe('https://google.com/search');
    expect(meta.landingPagePath).toBe('/products/gl-01');
    expect(meta.utmSource).toBe('newsletter');
    expect(meta.utmMedium).toBe('email');
    expect(meta.countryCode).toBe('IN');
    expect(meta.city).toBe('Mumbai');
  });

  it('stores country/city as null when Vercel geolocation headers are absent (AC3)', () => {
    const request = makeRequest('http://localhost:3000/');
    const meta = extractVisitorPageViewMetadata(request);
    expect(meta.countryCode).toBeNull();
    expect(meta.city).toBeNull();
  });

  it('stores referrer as null when no Referer header is present (AC4)', () => {
    const request = makeRequest('http://localhost:3000/about');
    const meta = extractVisitorPageViewMetadata(request);
    expect(meta.referrer).toBeNull();
  });

  it('stores all utm_* fields as null when no UTM params are present (AC5)', () => {
    const request = makeRequest('http://localhost:3000/');
    const meta = extractVisitorPageViewMetadata(request);
    expect(meta.utmSource).toBeNull();
    expect(meta.utmMedium).toBeNull();
    expect(meta.utmCampaign).toBeNull();
    expect(meta.utmTerm).toBeNull();
    expect(meta.utmContent).toBeNull();
  });
});

describe('logVisitorPageView (UC-006 AC1, AC6)', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.SUPABASE_URL = 'https://test-project.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
    insertMock.mockReset();
    fromMock.mockClear();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('inserts one row into visitor_logs on the happy path', async () => {
    insertMock.mockResolvedValueOnce({ error: null });
    const request = makeRequest('http://localhost:3000/');

    await logVisitorPageView(request);

    expect(fromMock).toHaveBeenCalledWith('visitor_logs');
    expect(insertMock).toHaveBeenCalledTimes(1);
  });

  it('resolves without throwing when the Supabase insert call itself throws (AC6)', async () => {
    insertMock.mockRejectedValueOnce(new Error('simulated Supabase outage'));
    const request = makeRequest('http://localhost:3000/');

    await expect(logVisitorPageView(request)).resolves.toBeUndefined();
  });

  it('resolves without throwing when Supabase returns an error object (AC6)', async () => {
    insertMock.mockResolvedValueOnce({ error: { message: 'RLS violation' } });
    const request = makeRequest('http://localhost:3000/');

    await expect(logVisitorPageView(request)).resolves.toBeUndefined();
  });

  it('resolves without throwing and without calling Supabase when env vars are unset', async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const request = makeRequest('http://localhost:3000/');

    await expect(logVisitorPageView(request)).resolves.toBeUndefined();
    expect(insertMock).not.toHaveBeenCalled();
  });
});
