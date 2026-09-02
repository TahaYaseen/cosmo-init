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

export default async function HomePage() {
  const { products, error } = await getPublishedProducts();

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
      <HeroCarousel featuredProductName={featured?.name} />
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
