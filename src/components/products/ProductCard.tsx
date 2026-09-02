import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/utils';
import type { Product } from '@/lib/types';

export interface ProductCardProps {
  product: Product;
  onSelect?: (id: string) => void;
}

/** Catalog card: SKU/badge, image, name, key-actives subtitle, price. */
export function ProductCard({ product }: ProductCardProps) {
  const image = typeof product.image === 'object' ? product.image : null;

  return (
    <Link
      href={`/products/${product.id}`}
      className="flex h-full w-full flex-col border-r border-outline-variant bg-transparent text-left last:border-r-0"
    >
      <div className="flex items-center justify-between border-b border-outline-variant p-4">
        <span className="font-mono text-xs uppercase text-outline">{product.sku}</span>
        {product.badge && (
          <Badge variant={product.badge === 'NEW' ? 'new' : 'bestseller'}>{product.badge}</Badge>
        )}
      </div>
      <div className="relative flex h-[220px] items-center justify-center bg-gradient-to-br from-surface-low to-surface-lowest p-8">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            fill
            className="object-contain p-6"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        ) : (
          <PlaceholderIcon />
        )}
      </div>
      <div className="flex-1 bg-surface-lowest p-6">
        <h3 className="mb-2 font-display text-2xl text-on-surface">{product.name}</h3>
        <span className="mb-3 block font-mono text-sm uppercase text-outline">
          {product.keyActives || product.categoryLabel}
        </span>
        <p className="text-base text-on-surface">{formatINR(product.price)}</p>
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
