import Image from 'next/image';
import Link from 'next/link';
import { getPayloadClient } from '@/lib/getPayloadClient';
import { ErrorState } from '@/components/feedback/ErrorState';
import { SpecTable } from '@/components/products/SpecTable';
import { FragranceNotesBreakdown } from '@/components/products/FragranceNotesBreakdown';
import { BuyButton } from '@/components/products/BuyButton';
import { ProductFeedbackSection } from '@/components/products/ProductFeedbackSection';
import { getPublishedFeedback } from '@/lib/feedback';
import { formatINR } from '@/lib/utils';
import type { Product } from '@/lib/types';

type DetailOutcome =
  | { kind: 'found'; product: Product }
  | { kind: 'not-found' }
  | { kind: 'error' };

async function getProduct(id: string): Promise<DetailOutcome> {
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findByID({
      collection: 'products',
      id,
      depth: 1,
    });
    // Payload's access control (Products.read) already hides Draft docs
    // from anonymous requests, so a successful result here is always
    // Published. Still guard defensively in case of a direct/admin-context
    // call ever reaching this path with a Draft doc.
    if (!doc || (doc as unknown as Product).status !== 'published') {
      return { kind: 'not-found' };
    }
    return { kind: 'found', product: doc as unknown as Product };
  } catch (err) {
    // Payload throws a NotFound-style error for a genuinely missing/deleted
    // ID, and a different error for a real connection failure. Distinguish
    // by name/status where available; default to not-found so a bad ID
    // never surfaces a raw crash.
    const name = (err as { name?: string; status?: number })?.name;
    const status = (err as { name?: string; status?: number })?.status;
    if (name === 'NotFound' || status === 404) {
      return { kind: 'not-found' };
    }
    console.error('[product-detail] failed to load product:', err);
    return { kind: 'error' };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const outcome = await getProduct(id);

  if (outcome.kind === 'error') {
    return (
      <div className="pt-24">
        <ErrorState message="We're having trouble loading this product right now, please check back shortly" />
      </div>
    );
  }

  if (outcome.kind === 'not-found') {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h2 className="mb-6 font-display text-2xl text-error">
          This product is no longer available
        </h2>
        <Link
          href="/"
          className="inline-block border border-primary-container px-8 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-on-surface hover:bg-primary-container hover:text-obsidian"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const { product } = outcome;
  const image = typeof product.image === 'object' ? product.image : null;
  const feedback = await getPublishedFeedback(String(product.id));

  return (
    <>
      <div className="px-4 pt-8 md:px-16">
        <Link href="/" className="border-b border-b-primary-container pb-[3px] text-on-surface hover:text-primary">
          ← Back to Home
        </Link>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pt-8 md:px-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[5fr_7fr] md:gap-16">
          <div className="order-2 flex flex-col md:order-1">
            {product.categoryLabel && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                {product.categoryLabel}
              </p>
            )}
            <h1 className="mb-5 font-display text-4xl text-on-surface">{product.name}</h1>
            <div className="mb-8 flex items-center justify-between border-b border-primary-container pb-6">
              <span className="font-mono text-lg text-on-surface">{formatINR(product.price)}</span>
              {product.size && (
                <span className="font-mono text-sm text-on-surface-variant">{product.size}</span>
              )}
            </div>
            <p className="mb-10 text-base text-on-surface-variant">{product.description}</p>
            <BuyButton purchaseUrl={product.purchaseUrl} size="lg" className="mb-12" />
            <SpecTable product={product} />
          </div>
          <div className="order-1 md:order-2">
            <div className="relative flex aspect-square min-h-[320px] items-center justify-center bg-gradient-to-br from-surface-low to-surface-lowest">
              {image?.url ? (
                <Image src={image.url} alt={image.alt || product.name} fill className="object-contain p-12" sizes="(min-width: 768px) 42vw, 100vw" />
              ) : (
                <svg width="120" height="120" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-outline opacity-50" aria-hidden="true">
                  <rect x="22" y="10" width="20" height="44" rx="2" />
                  <path d="M27 10V6a5 5 0 0 1 10 0v4" />
                  <path d="M22 24h20" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      <FragranceNotesBreakdown product={product} />

      <ProductFeedbackSection feedback={feedback} />
    </>
  );
}
