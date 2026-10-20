import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/products/ProductCard';
import { makeProduct } from '@/test-utils/fixtures';

describe('ProductCard (UC-001 AC1)', () => {
  it('renders image, name, and price', () => {
    render(<ProductCard product={makeProduct()} />);
    expect(screen.getByText('Radiant C Elixir')).toBeInTheDocument();
    expect(screen.getByText('₹3,200')).toBeInTheDocument();
    expect(screen.getByAltText('Radiant C Elixir bottle')).toBeInTheDocument();
  });

  it('renders the badge when present', () => {
    render(<ProductCard product={makeProduct({ badge: 'BESTSELLER' })} />);
    expect(screen.getByText('BESTSELLER')).toBeInTheDocument();
  });

  it('omits the badge element when absent (no blank/placeholder badge)', () => {
    render(<ProductCard product={makeProduct({ badge: null })} />);
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
    expect(screen.queryByText('BESTSELLER')).not.toBeInTheDocument();
  });

  it('links to the product detail page', () => {
    render(<ProductCard product={makeProduct({ id: 'gl-02' })} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/gl-02');
  });
});

describe('ProductCard rating', () => {
  it('shows average and review count when feedback exists', () => {
    render(<ProductCard product={makeProduct()} rating={{ count: 12, average: 4.5 }} />);
    expect(screen.getByText('(12 reviews)')).toBeInTheDocument();
    expect(screen.getByText('4.5 out of 5 stars')).toBeInTheDocument();
  });

  it('hides the rating row when there is no feedback', () => {
    render(<ProductCard product={makeProduct()} rating={{ count: 0, average: 0 }} />);
    expect(screen.queryByText(/reviews?\)/)).not.toBeInTheDocument();
  });
});
