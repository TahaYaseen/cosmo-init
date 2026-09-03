import { getPayloadClient } from '@/lib/getPayloadClient';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { FeaturedSpotlight } from '@/components/products/FeaturedSpotlight';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { HeroCarousel } from './_components/HeroCarousel';
import { TrustRibbon } from './_components/TrustRibbon';
import { LovedByMillions } from './_components/LovedByMillions';
import type { Product } from '@/lib/types';

// ISR fallback window (architecture.md §9/ADR-009) in case the Products
// afterChange hook's revalidatePath('/') call ever fails to fire.
export const revalidate = 3600;

// Hero banner images are intentionally decoupled from any single Product's
// `image` field (a Product's image is its own catalog/card asset, reused
// across ProductCard/FeaturedSpotlight — it should not double as marketing
// banner art). One media id per slide, index-aligned; a proper CMS-managed
// "homepage hero" field (e.g. a Payload Global with 3 banner slots) is the
// natural next step instead of a hardcoded array.
//
// TEMPORARY: all 3 ids currently resolve to the same underlying image
// (media.filename = 'glowrie-body-wash-hero.jpg' for all three) — this is a
// deliberate placeholder so the 3-slot wiring can be tested end-to-end
// before the real, distinct per-slide photos are uploaded. Swap each id's
// `media.url` (via the admin UI or a migration) to a different photo when
// ready; no code change will be needed.
const HERO_BANNER_IDS = [
  '3067290f-20c5-4d28-8afe-26c1ba86bb96',
  '796a26cd-85da-4cff-a1ce-3d54a395a74e',
  'e9313d16-1343-4e06-a2d5-6e0b4b60a9fe',
] as const;

async function getPublishedProducts(): Promise<{ products: Product[] | null; error: boolean }> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'products',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      depth: 1,
      limit: 100,
    });
    return { products: result.docs as unknown as Product[], error: false };
  } catch (error) {
    console.error('[home] failed to load products:', error);
    return { products: null, error: true };
  }
}

type HeroBannerVisual = { url: string; alt?: string | null } | null;

async function getHeroBannerVisual(id: string): Promise<HeroBannerVisual> {
  try {
    const payload = await getPayloadClient();
    const media = await payload.findByID({ collection: 'media', id });
    if (!media?.url) return null;
    return { url: media.url, alt: media.alt };
  } catch (error) {
    console.error(`[home] failed to load hero banner media (id=${id}):`, error);
    return null;
  }
}

// Index-aligned with HERO_BANNER_IDS — fetched independently per slide so one
// missing/broken id degrades only that slide (falls back to the placeholder
// icon in HeroCarousel) instead of the whole banner.
async function getHeroBannerVisuals(): Promise<HeroBannerVisual[]> {
  return Promise.all(HERO_BANNER_IDS.map((id) => getHeroBannerVisual(id)));
}

export default async function HomePage() {
  const [{ products, error }, heroSlideVisuals] = await Promise.all([
    getPublishedProducts(),
    getHeroBannerVisuals(),
  ]);

  if (error) {
    return (
      <div className="pt-24">
        <ErrorState message="We're having trouble loading our products right now, please check back shortly" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="pt-24">
        <EmptyState
          message="No products available yet"
          description="Our alchemists are still perfecting this collection. Please check back shortly."
        />
      </div>
    );
  }

  const featured = products.find((p) => p.badge === 'BESTSELLER') ?? products[0];

  return (
    <>
      <HeroCarousel featuredProductName={featured?.name} slideImages={heroSlideVisuals} />
      <TrustRibbon />

      <section className="px-4 py-[120px] md:px-16" id="core-formulations">
        <div className="mx-auto mb-12 flex max-w-[640px] flex-col items-center gap-4 text-center">
          <h2 className="font-display text-4xl text-on-surface">The Core Formulations</h2>
          <p className="text-lg text-on-surface-variant">
            Targeted treatments designed with maximum efficacy and absolute ingredient
            transparency.
          </p>
        </div>
        <ProductCarousel products={products} />
      </section>

      <section className="px-4 pb-[120px] md:px-16" id="featured-spotlight">
        <FeaturedSpotlight products={products} />
      </section>

      <LovedByMillions />
    </>
  );
}
