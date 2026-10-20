'use client';

import { useRef } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/lib/types';
import type { FeedbackSummary } from '@/lib/feedback';

export interface ProductCarouselProps {
  products: Product[];
  /** Rating summary keyed by product id (optional). */
  ratings?: Record<string, FeedbackSummary>;
}

/** Horizontal, keyboard-navigable product carousel with prev/next controls. */
export function ProductCarousel({ products, ratings }: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-carousel-card]');
    const step = card ? card.getBoundingClientRect().width + 24 : 400;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Previous products"
        className="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-obsidian shadow-lg ring-1 ring-black/5 transition hover:bg-obsidian hover:text-white md:-left-5"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Product carousel"
        tabIndex={0}
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-carousel-card
            className="min-w-full snap-start md:min-w-[calc((100%-3rem)/3)]"
            role="listitem"
          >
            <ProductCard product={product} rating={ratings?.[String(product.id)]} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Next products"
        className="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-obsidian shadow-lg ring-1 ring-black/5 transition hover:bg-obsidian hover:text-white md:-right-5"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
