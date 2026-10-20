-- 20260903000001_hero_banner_placeholder_media.sql
--
-- The storefront hero (src/app/(storefront)/_components/HeroCarousel.tsx,
-- driven by src/app/(storefront)/page.tsx's HERO_BANNER_IDS) now takes 3
-- independent media ids — one per marketing slide — completely decoupled
-- from any Product's own `image` field (see 20260903000000's superseding
-- note for why that coupling was removed).
--
-- TEMPORARY STATE: all 3 ids inserted here point at the exact same asset
-- (glowrie-body-wash-hero.jpg, the same file/dimensions as the media row
-- from 20260903000000) — this is a deliberate placeholder requested to
-- validate the 3-slot wiring end-to-end before the real, distinct per-slide
-- photos are ready. Each row's `url` can be independently updated later
-- (admin UI or a follow-up migration) to a different photo with zero code
-- changes, since page.tsx fetches each id independently.
--
-- Idempotent: safe to re-run (ON CONFLICT no-ops each insert).

insert into media (id, filename, url, mime_type, filesize, width, height, alt) values
  (
    '3067290f-20c5-4d28-8afe-26c1ba86bb96',
    'glowrie-body-wash-hero.jpg',
    '/images/hero/glowrie-body-wash-hero.jpg',
    'image/jpeg',
    74199,
    1600,
    1200,
    'Glowrie Body Wash — premium campaign photo (temporary placeholder — hero slide 1, same asset as slides 2-3 until distinct photos are provided)'
  ),
  (
    '796a26cd-85da-4cff-a1ce-3d54a395a74e',
    'glowrie-body-wash-hero.jpg',
    '/images/hero/glowrie-body-wash-hero.jpg',
    'image/jpeg',
    74199,
    1600,
    1200,
    'Glowrie Body Wash — premium campaign photo (temporary placeholder — hero slide 2, same asset as slides 1 and 3 until distinct photos are provided)'
  ),
  (
    'e9313d16-1343-4e06-a2d5-6e0b4b60a9fe',
    'glowrie-body-wash-hero.jpg',
    '/images/hero/glowrie-body-wash-hero.jpg',
    'image/jpeg',
    74199,
    1600,
    1200,
    'Glowrie Body Wash — premium campaign photo (temporary placeholder — hero slide 3, same asset as slides 1-2 until distinct photos are provided)'
  )
on conflict (id) do nothing;

-- ============================================================================
-- Verification query (run manually after applying — not part of the migration)
-- ============================================================================
-- select id, filename, url, width, height, alt from media
-- where id in (
--   '3067290f-20c5-4d28-8afe-26c1ba86bb96',
--   '796a26cd-85da-4cff-a1ce-3d54a395a74e',
--   'e9313d16-1343-4e06-a2d5-6e0b4b60a9fe'
-- );
-- -- Expect: 3 rows, all filename = glowrie-body-wash-hero.jpg (until swapped)
