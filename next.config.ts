import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  images: {
    // Local dev only — the `localhost:3000` remotePattern above means
    // next/image's optimizer proxy has to fetch from a hostname that
    // resolves to 127.0.0.1, which Next blocks by default as an SSRF
    // guard (fetching attacker-supplied URLs pointing at internal/private
    // IPs is a classic SSRF vector). Safe here because the "attacker
    // supplied URL" in this case is our own DB, in our own dev process,
    // pointing at our own dev server — there's no untrusted third party
    // in the loop locally. Do not rely on this in production; a real
    // deployment's NEXT_PUBLIC_SERVER_URL points at a public domain, not
    // localhost, so this flag becomes irrelevant there.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      // Local/dev seed data only (supabase/migrations/20260823000004_seed_products.sql
      // uses picsum.photos placeholder images since no real Supabase Storage
      // media has been uploaded yet in this environment). Safe to leave in
      // production config — next/image only ever fetches whatever URL is
      // actually stored on a `media` row; this just widens the allowed
      // remote-image allowlist, it doesn't serve as a data source itself.
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      // Local dev only. payload.config.ts now sets `serverURL:
      // http://localhost:3000` (required for the picsum.photos external-URL
      // fix above), which has the side effect of making Payload's upload
      // `url` field return an ABSOLUTE URL for locally-uploaded files too
      // (e.g. http://localhost:3000/api/media/file/facewash.jpeg) instead
      // of a relative path. next/image treats any absolute URL as remote,
      // so it needs an explicit allowlist entry even though it's actually
      // same-origin. Harmless in production: a real deployment would set
      // NEXT_PUBLIC_SERVER_URL to its real domain (or use Supabase Storage
      // entirely), making this entry a no-op.
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      // Cloudinary-hosted product images.
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
