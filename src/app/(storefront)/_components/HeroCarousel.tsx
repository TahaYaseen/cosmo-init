'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';

export interface HeroSlide {
  /** Desktop/tablet image (wide ~16:7 canvas, subject on the right). */
  src: string;
  /** Optional mobile image (~6:5, subject centred). Falls back to `src`. */
  mobileSrc?: string;
  alt: string;
  headline: string;
  subline: string;
  linkLabel: string;
  linkHref: string;
}

/** Hero images are hosted on Cloudinary (res.cloudinary.com is allowed in next.config). */
const HERO_CDN = 'https://res.cloudinary.com/rav4zol0/image/upload/v1792494308/';

/**
 * Slides are plain data: re-uploading the images to Cloudinary (same file names)
 * or editing this array needs no component changes.
 * NOTE: the current images are PLACEHOLDERS composited from reference
 * packaging shots — swap in real campaign imagery when available.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    src: `${HERO_CDN}slide-sunscreen.webp`,
    mobileSrc: `${HERO_CDN}slide-sunscreen-mobile.webp`,
    alt: 'Glowrie Sunscreen SPF 50 tube',
    headline: 'Daily protection, weightless.',
    subline: 'SPF 50 that disappears into skin.',
    linkLabel: 'Shop sunscreen',
    linkHref: '/#core-formulations',
  },
  {
    src: `${HERO_CDN}slide-face-wash.webp`,
    mobileSrc: `${HERO_CDN}slide-face-wash-mobile.webp`,
    alt: 'Glowrie Hydrating Face Wash tube',
    headline: 'Cleanse. Balance. Refresh.',
    subline: 'A gentle daily wash for calm, clear skin.',
    linkLabel: 'Shop face wash',
    linkHref: '/#core-formulations',
  },
  {
    src: `${HERO_CDN}slide-face-lotion.webp`,
    mobileSrc: `${HERO_CDN}slide-face-lotion-mobile.webp`,
    alt: 'Glowrie Daily Moisturizing Lotion bottle',
    headline: 'Hydration, perfected.',
    subline: 'Ectoin, Vitamin C and E in one light lotion.',
    linkLabel: 'Shop face lotion',
    linkHref: '/#core-formulations',
  },
  {
    src: `${HERO_CDN}slide-body-wash.webp`,
    mobileSrc: `${HERO_CDN}slide-body-wash-mobile.webp`,
    alt: 'Glowrie Body Wash bottle',
    headline: 'Care, head to toe.',
    subline: 'A rich, nourishing wash for soft, healthy skin.',
    linkLabel: 'Shop body wash',
    linkHref: '/#core-formulations',
  },
];

export interface HeroCarouselProps {
  slides?: HeroSlide[];
  autoplayMs?: number;
}

const SWIPE_THRESHOLD_PX = 40;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function getReducedMotion() {
  return typeof window !== 'undefined' && !!window.matchMedia?.(REDUCED_MOTION_QUERY).matches;
}

function subscribeReducedMotion(onChange: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener?.('change', onChange);
  return () => mq.removeEventListener?.('change', onChange);
}

export function HeroCarousel({ slides = HERO_SLIDES, autoplayMs = 6000 }: HeroCarouselProps) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  // Autoplay: re-armed after every slide change (manual or automatic).
  useEffect(() => {
    if (paused || reducedMotion || count < 2) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), autoplayMs);
    return () => clearTimeout(t);
  }, [index, paused, reducedMotion, count, autoplayMs]);

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(index + 1);
    }
  }

  function onTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: TouchEvent) {
    const start = touchStartX.current;
    touchStartX.current = null;
    const end = e.changedTouches[0]?.clientX;
    if (start == null || end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    goTo(delta < 0 ? index + 1 : index - 1);
  }

  const arrowBase =
    'group absolute z-20 flex items-center justify-center text-on-surface/70 transition-colors ' +
    'bottom-3 h-10 w-10 rounded-full bg-white/60 hover:bg-white/90 ' +
    'md:bottom-auto md:top-0 md:h-full md:w-[9%] md:rounded-none md:bg-transparent md:hover:bg-black/[0.03]';

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured products"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative w-full overflow-hidden bg-[#f6f1e9] pt-16 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-outline md:pt-20"
    >
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
        aria-live={paused || reducedMotion ? 'polite' : 'off'}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            inert={i !== index}
            className="relative flex w-full shrink-0 flex-col md:h-[clamp(420px,50vw,720px)] md:flex-row"
          >
            <div className="relative z-10 flex flex-col justify-center gap-3 px-6 pb-2 pt-8 text-center md:w-[46%] md:items-start md:gap-4 md:py-0 md:pl-[12%] md:pr-6 md:text-left lg:w-[42%]">
              <h2 className="font-display text-[32px] font-medium leading-[1.05] tracking-tight text-on-surface md:text-[clamp(32px,3.6vw,56px)]">
                {slide.headline}
              </h2>
              <p className="text-base text-on-surface-variant md:text-lg">{slide.subline}</p>
              <a
                href={slide.linkHref}
                className="mt-1 w-max self-center text-xs font-medium uppercase tracking-[0.14em] text-on-surface underline decoration-outline-variant underline-offset-[6px] transition-colors hover:decoration-on-surface md:self-start"
              >
                {slide.linkLabel}
              </a>
            </div>
            <div className="relative aspect-[6/5] w-full md:absolute md:inset-0 md:aspect-auto">
              <picture>
                <source media="(min-width: 768px)" srcSet={slide.src} />
                <img
                  src={slide.mobileSrc ?? slide.src}
                  alt={slide.alt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-contain md:object-cover md:object-[75%_50%]"
                />
              </picture>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => goTo(index - 1)}
        className={`${arrowBase} left-3 md:left-0 md:cursor-w-resize`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => goTo(index + 1)}
        className={`${arrowBase} right-3 md:right-0 md:cursor-e-resize`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            onClick={() => goTo(i)}
            className="flex h-6 w-6 items-center justify-center"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-5 bg-on-surface' : 'w-1.5 bg-on-surface/30'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
