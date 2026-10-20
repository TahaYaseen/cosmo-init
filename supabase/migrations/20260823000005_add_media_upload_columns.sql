-- Hand-written workaround migration (same convention as 20260823000000).
-- Adds columns Payload's upload field always generates for the `media`
-- collection (src/collections/Media.ts) that were missing from the original
-- hand-written `media` table DDL:
--   - thumbnailURL -> thumbnail_u_r_l  (always added by getBaseFields.js)
--   - focalX / focalY -> focal_x / focal_y (added whenever `focalPoint` is
--     not explicitly set to false on the upload config; Media.ts does not
--     set it, so it defaults to enabled)
-- Confirmed by reading node_modules/payload/dist/uploads/getBaseFields.js
-- directly. All three are nullable text/numeric columns with no DB-side
-- default (Payload populates them at write time via field hooks).
--
-- Symptom this fixes: `column "thumbnail_u_r_l" does not exist` (42703)
-- thrown from Payload's `media.find` query on every storefront page load
-- that includes a related product image.

alter table media
  add column if not exists thumbnail_u_r_l text,
  add column if not exists focal_x numeric,
  add column if not exists focal_y numeric;
