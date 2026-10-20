import { getPayloadClient } from '@/lib/getPayloadClient';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { HeroCarousel } from './_components/HeroCarousel';
import { TrustRibbon } from './_components/TrustRibbon';
import { LovedByMillions } from './_components/LovedByMillions';
import { CustomerFeedback } from './_components/CustomerFeedback';
import { getLatestPublishedFeedback, getFeedbackSummaries } from '@/lib/feedback';
import type { Product } from '@/lib/types';

// ISR fallback window (architecture.md §9/ADR-009) in case the Products
// afterChange hook's revalidatePath('/') call ever fails to fire.
export const revalidate = 3600;

async function getPublishedProducts(): Promise<{
  products: Product[] | null;
  error: boolean;
}> {
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

  const [feedback, ratings] = await Promise.all([
    getLatestPublishedFeedback(6),
    getFeedbackSummaries(),
  ]);

  return (
    <>
      <HeroCarousel />
      <TrustRibbon />

      <section className="px-4 py-[120px] md:px-16" id="core-formulations">
        <ProductCarousel products={products} ratings={ratings} />
      </section>

      <LovedByMillions />

      <CustomerFeedback feedback={feedback} />
    </>
  );
}
