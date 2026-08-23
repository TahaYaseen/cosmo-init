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
