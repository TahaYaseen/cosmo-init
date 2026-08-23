import Image from 'next/image';
import { BuyButton } from '@/components/products/BuyButton';
import { formatINR } from '@/lib/utils';
import type { Product } from '@/lib/types';

export interface FeaturedSpotlightProps {
  products: Product[];
}

/**
 * Selects one Published product to feature — prefers a Content-Operator
 * flagged BESTSELLER, falling back to the most recently updated product
 * (the list is already sorted -createdAt by the Home page's query).
 * Implementation detail left to Code per development-plan.md S2 Task 3.
 */
export function FeaturedSpotlight({ products }: FeaturedSpotlightProps) {
  const featured = products.find((p) => p.badge === 'BESTSELLER') ?? products[0];
  if (!featured) return null;

  const image = typeof featured.image === 'object' ? featured.image : null;

  const specs: Array<{ label: string; value: string; span2?: boolean }> = [];
  if (featured.phLevel) specs.push({ label: 'pH Level', value: featured.phLevel });
  if (featured.keyActives) specs.push({ label: 'Key Actives', value: featured.keyActives });
  const aroma = [featured.fragranceTopNotes, featured.fragranceHeartNotes, featured.fragranceBaseNotes]
    .filter(Boolean)
    .join(', ');
  if (aroma) specs.push({ label: 'Aroma Profile', value: aroma, span2: true });

  return (
    <div className="grid grid-cols-1 border border-outline-variant md:grid-cols-2">
      <div className="relative flex min-h-[320px] items-center justify-center border-b border-outline-variant bg-gradient-to-br from-surface-low to-surface-lowest p-12 md:border-b-0 md:border-r">
        {image?.url ? (
          <Image src={image.url} alt={image.alt || featured.name} fill className="object-contain p-10" sizes="50vw" />
        ) : (
          <svg width="120" height="120" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-outline opacity-50" aria-hidden="true">
            <rect x="22" y="10" width="20" height="44" rx="2" />
            <path d="M27 10V6a5 5 0 0 1 10 0v4" />
            <path d="M22 24h20" />
          </svg>
        )}
      </div>
      <div className="flex flex-col bg-surface-lowest p-8 md:p-16">
        <span className="mb-5 font-mono text-sm uppercase text-outline">Featured Formula</span>
        <h2 className="mb-5 font-display text-4xl text-on-surface">{featured.name}</h2>
        <p className="mb-10 text-lg text-on-surface-variant">{featured.description}</p>
        {specs.length > 0 && (
          <div className="mb-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-outline-variant pt-7">
            {specs.map((spec) => (
              <div key={spec.label} className={spec.span2 ? 'col-span-2 flex flex-col gap-1.5' : 'flex flex-col gap-1.5'}>
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-outline">{spec.label}</span>
                <span className="font-mono text-sm uppercase text-on-surface">{spec.value}</span>
              </div>
            ))}
          </div>
        )}
        <p className="mb-6 text-base text-on-surface">{formatINR(featured.price)}</p>
        <BuyButton purchaseUrl={featured.purchaseUrl} size="lg" />
      </div>
    </div>
  );
}
