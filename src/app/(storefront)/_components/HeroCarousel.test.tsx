import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { HeroCarousel, HERO_SLIDES } from './HeroCarousel';

function track(container: HTMLElement) {
  return container.querySelector('[style*="translateX"]') as HTMLElement;
}

function activeIndex(container: HTMLElement) {
  return -parseInt(/translateX\(-?(\d+)%\)/.exec(track(container).style.transform)![1], 10) / 100 || 0;
}

describe('HeroCarousel', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders 4 slides with carousel semantics; only the active slide is exposed', () => {
    const { container } = render(<HeroCarousel />);
    expect(HERO_SLIDES).toHaveLength(4);
    expect(screen.getByRole('region', { name: 'Featured products' })).toHaveAttribute(
      'aria-roledescription',
      'carousel',
    );
    const slides = container.querySelectorAll('[aria-roledescription="slide"]');
    expect(slides).toHaveLength(4);
    expect(slides[0]).toHaveAttribute('aria-hidden', 'false');
    expect(slides[1]).toHaveAttribute('aria-hidden', 'true');
    expect(slides[0]).toHaveAttribute('aria-label', '1 of 4');
    expect(screen.getByRole('heading', { name: HERO_SLIDES[0].headline })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: HERO_SLIDES[0].linkLabel })).toBeInTheDocument();
  });

  it('arrow buttons navigate and wrap around', () => {
    const { container } = render(<HeroCarousel />);
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(track(container).style.transform).toBe('translateX(-100%)');
    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    expect(track(container).style.transform).toBe('translateX(-300%)');
  });

  it('dots jump to a slide and mark the current one', () => {
    const { container } = render(<HeroCarousel />);
    const dots = screen.getAllByRole('button', { name: /Go to slide/ });
    expect(dots).toHaveLength(4);
    fireEvent.click(dots[2]);
    expect(track(container).style.transform).toBe('translateX(-200%)');
    expect(dots[2]).toHaveAttribute('aria-current', 'true');
    expect(dots[0]).not.toHaveAttribute('aria-current');
  });

  it('supports keyboard arrows', () => {
    const { container } = render(<HeroCarousel />);
    const region = screen.getByRole('region', { name: 'Featured products' });
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    expect(track(container).style.transform).toBe('translateX(-100%)');
    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    expect(activeIndex(container)).toBe(0);
  });

  it('supports swipe on touch (and ignores tiny movements)', () => {
    const { container } = render(<HeroCarousel />);
    const region = screen.getByRole('region', { name: 'Featured products' });
    fireEvent.touchStart(region, { touches: [{ clientX: 300 }] });
    fireEvent.touchEnd(region, { changedTouches: [{ clientX: 290 }] });
    expect(track(container).style.transform).toBe('translateX(-0%)');
    fireEvent.touchStart(region, { touches: [{ clientX: 300 }] });
    fireEvent.touchEnd(region, { changedTouches: [{ clientX: 100 }] });
    expect(track(container).style.transform).toBe('translateX(-100%)');
    fireEvent.touchStart(region, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(region, { changedTouches: [{ clientX: 300 }] });
    expect(track(container).style.transform).toBe('translateX(-0%)');
  });

  it('autoplays, and pauses while hovered', () => {
    const { container } = render(<HeroCarousel autoplayMs={1000} />);
    const region = screen.getByRole('region', { name: 'Featured products' });
    act(() => void vi.advanceTimersByTime(1000));
    expect(track(container).style.transform).toBe('translateX(-100%)');

    fireEvent.mouseEnter(region);
    act(() => void vi.advanceTimersByTime(5000));
    expect(track(container).style.transform).toBe('translateX(-100%)');

    fireEvent.mouseLeave(region);
    act(() => void vi.advanceTimersByTime(1000));
    expect(track(container).style.transform).toBe('translateX(-200%)');
  });

  it('does not autoplay when prefers-reduced-motion is set', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );
    const { container } = render(<HeroCarousel autoplayMs={1000} />);
    act(() => void vi.advanceTimersByTime(5000));
    expect(track(container).style.transform).toBe('translateX(-0%)');
    vi.unstubAllGlobals();
  });

  it('renders slide images from the data array with alt text and mobile fallback', () => {
    const { container } = render(
      <HeroCarousel
        slides={[
          { src: '/a.webp', alt: 'A', headline: 'HA', subline: 'SA', linkLabel: 'LA', linkHref: '/a' },
          { src: '/b.webp', mobileSrc: '/b-m.webp', alt: 'B', headline: 'HB', subline: 'SB', linkLabel: 'LB', linkHref: '/b' },
        ]}
      />,
    );
    const imgs = container.querySelectorAll('img');
    expect(imgs).toHaveLength(2);
    expect(imgs[0]).toHaveAttribute('src', '/a.webp');
    expect(imgs[1]).toHaveAttribute('src', '/b-m.webp');
    expect(container.querySelectorAll('source[srcset="/b.webp"]')).toHaveLength(1);
  });
});
