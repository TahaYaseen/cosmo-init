import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';

import { Products } from '../collections/Products';
import { Media } from '../collections/Media';
import { Users } from '../collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const supabaseStorageConfigured = Boolean(
  process.env.SUPABASE_S3_ENDPOINT &&
    process.env.SUPABASE_S3_ACCESS_KEY_ID &&
    process.env.SUPABASE_S3_SECRET_ACCESS_KEY &&
    process.env.SUPABASE_S3_BUCKET,
);

export default buildConfig({
  // Required for Payload's upload `url` field to correctly pass through
  // external URLs as-is (e.g. the picsum.photos placeholder URLs used by
  // supabase/migrations/20260823000004_seed_products.sql's seed data).
  // node_modules/payload/dist/uploads/generateFilePathOrURL.js only treats
  // a stored `url` value as "external" when it does NOT start with
  // `config.serverURL` — if serverURL is unset (empty string), every
  // string "starts with" '' and the external-URL branch never triggers,
  // so Payload always falls back to constructing its own local-disk file
  // route (`/api/media/file/{filename}`), which then 500s because no such
  // file was ever actually uploaded to local disk (the seed data only ever
  // intended to reference the external picsum.photos URL directly, and no
  // Supabase Storage/S3 credentials are configured in local dev — see
  // `supabaseStorageConfigured` below).
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
  },
  collections: [Products, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // Every hand-written table in supabase/migrations/ uses
    // `uuid primary key default gen_random_uuid()` for its `id` column
    // (and for every foreign key referencing another collection's id).
    // @payloadcms/db-postgres defaults `idType` to 'serial', which makes
    // Payload treat ALL ids as JS `number` internally (see
    // node_modules/@payloadcms/db-postgres/dist/index.js:
    // `payloadIDType = postgresIDType === 'serial' ? 'number' : 'text'`).
    // Left unset, this silently corrupts every relationship field on read:
    // Payload parseInt()s the stored UUID string, e.g. `6cd02bbb-...`
    // becomes `6` and `d956d27f-...` becomes `NaN` -> null. Confirmed via a
    // temporary debug route hitting payload.find({depth:0}) directly.
    // `idType: 'uuid'` tells Payload every id is a string, matching the
    // real DB schema.
    idType: 'uuid',
    // Disable Drizzle's interactive dev-mode schema push. Without this,
    // every request that (re-)initializes the Postgres adapter in dev
    // triggers pushDevSchema(), which diffs the live DB against the
    // Drizzle schema and — since stdin isn't a prompt-capable channel at
    // that point in the request lifecycle — hangs for ~90-100s per request
    // instead of resolving an ambiguous "create vs rename" prompt (see
    // docs/bug-fix-scope.md Root Cause 2). Schema is kept in sync entirely
    // via the hand-written SQL migrations in supabase/migrations/ instead.
    push: false,
  }),
  // (v1.1) visitor_logs is intentionally NOT declared here — it is a direct
  // Supabase Postgres table, written to by src/lib/visitor-logging.ts,
  // outside Payload's collection/migration pipeline entirely
  // (architecture.md §6 migration-strategy exception).
  plugins: [
    // Media Storage Adapter (architecture.md §3): Supabase Storage is
    // S3-compatible, so the official S3 storage plugin points at Supabase's
    // S3-compatible endpoint. Only enabled when the Supabase Storage env
    // vars are actually configured (local dev without a Supabase project
    // yet falls back to Payload's default local-disk upload handling).
    ...(supabaseStorageConfigured
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: process.env.SUPABASE_S3_BUCKET || '',
            config: {
              endpoint: process.env.SUPABASE_S3_ENDPOINT,
              region: process.env.SUPABASE_S3_REGION || 'us-east-1',
              credentials: {
                accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY || '',
              },
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
});
