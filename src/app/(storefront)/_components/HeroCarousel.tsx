'use client';

import { useEffect, useRef, useState } from 'react';

export interface HeroCarouselProps {
  /** Name of the currently-featured product, used on the 3rd marketing slide. */
  featuredProductName?: string;
}

const AUTOPLAY_MS = 5000;

/**
 * Home hero marketing carousel — 3 slides, autoplay every 5s, pauses on
 * hover. This is static marketing content (not CMS-managed, per ADR-007's
 * spirit for non-Product content) except the 3rd slide's headline, which
 * reflects the real Featured Product name.
 */
export function HeroCarousel({ featuredProductName }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = [
    {
      eyebrow: 'The Modern Apothecary',
      heading: (
        <>
          Clinically
          <br />
          Formulated.
          <br />
          Transparently
          <br />
          Delivered.
        </>
      ),
      ctaLabel: 'Formulate Your Routine',
      ctaHref: '#core-formulations',
    },
    {
      eyebrow: 'Our Philosophy',
      heading: (
        <>
          Perpetual
          <br />
          Alchemy. The
          <br />
          Soul of Science.
        </>
      ),
      ctaLabel: 'Explore the Science',
      ctaHref: '/about',
    },
    {
      eyebrow: 'Featured Elixir',
      heading: <>{featuredProductName || 'Featured Formula'}</>,
      ctaLabel: 'Shop the Elixir',
      ctaHref: '#featured-spotlight',
    },
  ];

  function restart() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
  }

  useEffect(() => {
    restart();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goTo(next: number) {
    setIndex(((next % slides.length) + slides.length) % slides.length);
    restart();
  }

  return (
    <header
      className="relative h-screen min-h-[560px] w-full overflow-hidden"
      onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
      onMouseLeave={restart}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 flex flex-col opacity-0 transition-opacity duration-1000 md:flex-row ${
            i === index ? 'z-10 opacity-100' : 'z-0'
          }`}
          aria-hidden={i !== index}
        >
          <div className="flex w-full flex-col justify-center gap-6 bg-surface-lowest px-4 pb-12 pt-24 md:w-1/2 md:px-16 md:py-0">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-outline">
              {slide.eyebrow}
            </span>
            <h1 className="font-display text-[44px] font-semibold leading-[0.95] text-on-surface md:text-[80px]">
              {slide.heading}
            </h1>
            <a
              href={slide.ctaHref}
              className="mt-2 inline-flex w-max items-center gap-2 border border-obsidian bg-obsidian px-8 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-white hover:bg-secondary"
            >
              {slide.ctaLabel}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
          <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-surface-low to-surface-lowest md:w-1/2">
            <svg width="140" height="140" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-outline opacity-50" aria-hidden="true">
              <path d="M32 6c8 10 18 18 18 30a18 18 0 1 1-36 0C14 24 24 16 32 6Z" />
            </svg>
          </div>
        </div>
      ))}

      <div className="absolute inset-0 z-20 flex items-center justify-between px-4 md:px-16">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => goTo(index - 1)}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant bg-surface/85"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => goTo(index + 1)}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant bg-surface/85"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full bg-outline-variant transition-all ${i === index ? 'w-6 bg-obsidian' : 'w-2'}`}
          />
        ))}
      </div>
    </header>
  );
}
