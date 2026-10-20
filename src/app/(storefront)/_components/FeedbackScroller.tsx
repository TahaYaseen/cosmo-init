'use client';

import { useRef, type ReactNode } from 'react';

/**
 * Horizontal scroll track with prev/next arrows for feedback cards.
 * Children must be <li> elements (rendered inside a <ul>).
 */
export function FeedbackScroller({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLUListElement>(null);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('li');
    const step = (card ? card.getBoundingClientRect().width : 320) + 24;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  const arrow =
    'absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-outline-variant bg-surface shadow-md';

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Previous feedback"
        className={`${arrow} left-2 md:left-3`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <ul
        ref={trackRef}
        aria-label="Customer feedback"
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Next feedback"
        className={`${arrow} right-2 md:right-3`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
