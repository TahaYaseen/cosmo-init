import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroCarousel } from './HeroCarousel';

describe('HeroCarousel — product images (bug fix)', () => {
  it('renders a real product image on every slide when slideImages are provided', () => {
    const { container } = render(
      <HeroCarousel
        featuredProductName="Radiant C Elixir"
        slideImages={[
          { url: 'https://example.supabase.co/storage/v1/object/public/media/a.jpg', alt: 'Product A' },
          { url: 'https://example.supabase.co/storage/v1/object/public/media/b.jpg', alt: 'Product B' },
          {
            url: 'https://example.supabase.co/storage/v1/object/public/media/radiant-c.jpg',
            alt: 'Radiant C Elixir bottle',
          },
        ]}
      />,
    );

    expect(screen.getByAltText('Product A')).toBeInTheDocument();
    expect(screen.getByAltText('Product B')).toBeInTheDocument();
    expect(screen.getByAltText('Radiant C Elixir bottle')).toBeInTheDocument();
    // Only the active slide is exposed via role (others are aria-hidden until
    // rotated into view) — assert real <img> element count via the DOM instead.
    expect(container.querySelectorAll('img')).toHaveLength(3);
  });

  it('falls back to the placeholder icon per-slide when a slide has no image', () => {
    const { container } = render(
      <HeroCarousel
        featuredProductName="Radiant C Elixir"
        slideImages={[
          null,
          null,
          {
            url: 'https://example.supabase.co/storage/v1/object/public/media/radiant-c.jpg',
            alt: 'Radiant C Elixir bottle',
          },
        ]}
      />,
    );

    expect(screen.getByAltText('Radiant C Elixir bottle')).toBeInTheDocument();
    expect(container.querySelectorAll('img')).toHaveLength(1);
    // The other 2 slides still render the placeholder droplet icon.
    expect(container.querySelectorAll('svg path[d^="M32 6c8 10 18 18 18 30"]')).toHaveLength(2);
  });

  it('falls back to the placeholder icon on every slide when no slideImages prop is passed', () => {
    const { container } = render(<HeroCarousel featuredProductName="Radiant C Elixir" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelectorAll('svg path[d^="M32 6c8 10 18 18 18 30"]')).toHaveLength(3);
  });

  it('uses the product name as alt text fallback when the image has no alt', () => {
    render(
      <HeroCarousel
        featuredProductName="Radiant C Elixir"
        slideImages={[
          null,
          null,
          {
            url: 'https://example.supabase.co/storage/v1/object/public/media/radiant-c.jpg',
            alt: null,
            name: 'Radiant C Elixir',
          },
        ]}
      />,
    );

    expect(screen.getByAltText('Radiant C Elixir')).toBeInTheDocument();
  });
});
