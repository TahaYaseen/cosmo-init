'use client';

import { useRef } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/lib/types';

export interface ProductCarouselProps {
  products: Product[];
}

/** Horizontal, keyboard-navigable product carousel with prev/next controls. */
export function ProductCarousel({ products }: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-carousel-card]');
    const step = card ? card.getBoundingClientRect().width : 400;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Previous products"
        className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-outline-variant bg-surface/90 md:left-4"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto border border-outline-variant [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Product carousel"
        tabIndex={0}
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-carousel-card
            className="min-w-full snap-start md:min-w-[33.333%]"
            role="listitem"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Next products"
        className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-outline-variant bg-surface/90 md:right-4"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
