import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeaturedSpotlight } from '@/components/products/FeaturedSpotlight';
import { makeProduct } from '@/test-utils/fixtures';

describe('FeaturedSpotlight (UC-003 AC2)', () => {
  it('features the BESTSELLER product when one exists', () => {
    const products = [
      makeProduct({ id: 'gl-01', name: 'Radiant C Elixir', badge: 'NEW' }),
      makeProduct({ id: 'gl-02', name: 'Overnight Recovery Crème', badge: 'BESTSELLER' }),
    ];
    render(<FeaturedSpotlight products={products} />);
    expect(screen.getByText('Overnight Recovery Crème')).toBeInTheDocument();
  });

  it('falls back to the first product when no BESTSELLER exists', () => {
    const products = [makeProduct({ id: 'gl-01', name: 'Radiant C Elixir', badge: null })];
    render(<FeaturedSpotlight products={products} />);
    expect(screen.getByText('Radiant C Elixir')).toBeInTheDocument();
  });

  it('renders a working BuyButton reflecting the featured product purchaseUrl state', () => {
    const products = [makeProduct({ purchaseUrl: '' })];
    render(<FeaturedSpotlight products={products} />);
    expect(screen.getByRole('button', { name: 'Coming Soon' })).toBeDisabled();
  });

  it('renders nothing when given an empty product list', () => {
    const { container } = render(<FeaturedSpotlight products={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
