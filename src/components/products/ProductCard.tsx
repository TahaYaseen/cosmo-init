import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/utils';
import type { Product } from '@/lib/types';
import type { FeedbackSummary } from '@/lib/feedback';

export interface ProductCardProps {
  product: Product;
  onSelect?: (id: string) => void;
  /** Published-feedback summary; stars are hidden when absent or empty. */
  rating?: FeedbackSummary;
}

/** Catalog card: image with badge overlay, name, key-actives subtitle, SKU, price. */
export function ProductCard({ product, rating }: ProductCardProps) {
  const image = typeof product.image === 'object' ? product.image : null;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex h-full w-full flex-col bg-surface-lowest text-left shadow-[0_1px_0_0_rgba(0,0,0,0.04)] ring-1 ring-outline-variant transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.25)]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-surface-low to-surface-lowest">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <PlaceholderIcon />
          </div>
        )}
        {product.badge && (
          <div className="absolute left-4 top-4">
            <Badge
              className="bg-white/90 backdrop-blur-sm"
              variant={product.badge === 'NEW' ? 'new' : 'bestseller'}
            >
              {product.badge}
            </Badge>
          </div>
        )}
        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-obsidian/90 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
          View product
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-outline">
          {product.sku}
        </span>
        <h3 className="font-display text-2xl leading-tight text-on-surface">{product.name}</h3>
        <span className="block font-mono text-xs uppercase tracking-wide text-on-surface-variant">
          {product.keyActives || product.categoryLabel}
        </span>
        {rating && rating.count > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span aria-hidden="true" className="tracking-[0.12em] text-[#c9953a]">
              {'★'.repeat(Math.round(rating.average))}
              <span className="text-outline-variant">
                {'★'.repeat(5 - Math.round(rating.average))}
              </span>
            </span>
            <span className="sr-only">{rating.average.toFixed(1)} out of 5 stars</span>
            <span className="font-medium text-on-surface">{rating.average.toFixed(1)}</span>
            <span className="text-on-surface-variant">
              ({rating.count} {rating.count === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}
        <p className="mt-auto pt-3 text-lg font-medium text-on-surface">
          {formatINR(product.price)}
        </p>
      </div>
    </Link>
  );
}

function PlaceholderIcon() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-outline opacity-50"
      aria-hidden="true"
    >
      <rect x="22" y="10" width="20" height="44" rx="2" />
      <path d="M27 10V6a5 5 0 0 1 10 0v4" />
      <path d="M22 24h20" />
    </svg>
  );
}
