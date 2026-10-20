-- 20260903000000_add_hero_bodywash_media.sql
--
-- Fixes a hero-section design issue reported against the storefront home
-- page (src/app/(storefront)/_components/HeroCarousel.tsx): GL-04
-- ("Overnight Recovery Mask") was pointing at an 800x800 SQUARE product
-- photo (bodywash.jpg), which HeroCarousel's right-side panel renders via
-- next/image `fill` + `object-contain` inside a tall/near-square flex
-- column (md:w-1/2 of a full-viewport-height header). A square source image
-- in that shape gets width-fit and leaves large empty vertical gaps above
-- and below it — the "incorrect proportions and spacing" / unpolished look
-- reported by the user. This is a data problem, not a CSS/layout bug:
-- HeroCarousel already uses object-contain (never crops/stretches), so no
-- component changes are needed once a properly composed source image is in
-- place.
--
-- This migration:
--   1. Inserts a new `media` row for a purpose-built 1600x1200 (4:3
--      landscape) campaign-style hero image — the Glowrie Body Wash bottle
--      centered with generous negative space, on a soft marble/off-white
--      background with subtle citrus + eucalyptus + stone accents (no
--      text/UI elements). File lives at
--      public/images/hero/glowrie-body-wash-hero.jpg (same convention as
--      public/images/loved-by-millions.jpg from the Root Cause 6 fix) and
--      is referenced via `url` exactly like every other media row (see
--      payload.config.ts's comment on why a non-serverURL-prefixed `url`
--      value is treated as "external" and passed through as-is).
--
--      NOTE: this dev environment auto-mirrors public/images/* assets
--      referenced by a `media` row onto the project's existing Cloudinary
--      account (the same one already used by GL-01/02/03/05's manually
--      uploaded photos) and rewrites `media.url` to the resulting
--      `res.cloudinary.com` URL once the asset is first served — this is
--      an environment-level behavior, not application code, so it is not
--      re-encoded here. The `url` value below is what the app itself
--      writes; the eventual Cloudinary URL is a runtime side effect that
--      requires no further action.
-- NOTE (superseded 2026-09-03, see 20260903000001): this migration originally
-- also repointed GL-04's products.image_id at this media row. That coupling
-- was reverted the same day — the hero banner is now decoupled from any
-- Product's `image` field entirely (src/app/(storefront)/page.tsx's
-- HERO_BANNER_IDS) so a product's own catalog/card photo (used by
-- ProductCard/FeaturedSpotlight) is never hijacked for marketing art. GL-04's
-- image_id has been reverted back to its original media row
-- (f8555160-5317-4e78-8c74-6b9f466bdce0). This media row's remaining purpose
-- is as one of the 3 hero banner ids seeded by
-- 20260903000001_hero_banner_placeholder_media.sql.
--
-- Idempotent: safe to re-run (ON CONFLICT no-ops the insert).

-- ============================================================================
-- MEDIA
-- ============================================================================

insert into media (id, filename, url, mime_type, filesize, width, height, alt) values
  (
    '79e45e11-5e8e-4519-9b62-6493515b5775',
    'glowrie-body-wash-hero.jpg',
    '/images/hero/glowrie-body-wash-hero.jpg',
    'image/jpeg',
    74199,
    1600,
    1200,
    'Glowrie Body Wash — premium campaign photo with citrus and eucalyptus accents on a marble surface'
  )
on conflict (id) do nothing;

-- ============================================================================
-- Verification query (run manually after applying — not part of the migration)
-- ============================================================================
-- select id, filename, url, width, height from media
-- where id = '79e45e11-5e8e-4519-9b62-6493515b5775';
-- -- Expect: filename = glowrie-body-wash-hero.jpg, width = 1600, height = 1200
