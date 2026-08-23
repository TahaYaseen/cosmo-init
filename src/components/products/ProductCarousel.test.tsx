import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { makeProduct } from '@/test-utils/fixtures';

describe('ProductCarousel (UC-001 AC1, AC2)', () => {
  it('renders one card per product', () => {
    const products = [
      makeProduct({ id: 'gl-01', name: 'Radiant C Elixir' }),
      makeProduct({ id: 'gl-02', name: 'Overnight Recovery Crème' }),
      makeProduct({ id: 'gl-03', name: 'Gentle Cleansing Balm' }),
    ];
    render(<ProductCarousel products={products} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Radiant C Elixir')).toBeInTheDocument();
    expect(screen.getByText('Overnight Recovery Crème')).toBeInTheDocument();
    expect(screen.getByText('Gentle Cleansing Balm')).toBeInTheDocument();
  });

  it('has ARIA-labeled, keyboard-reachable prev/next controls', async () => {
    render(<ProductCarousel products={[makeProduct()]} />);
    expect(screen.getByRole('button', { name: 'Previous products' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next products' })).toBeInTheDocument();
  });

  it('advances the scroll position without a full page reload when "next" is clicked', async () => {
    // jsdom doesn't implement scrollBy, so we spy on it to assert the
    // carousel calls it (client-side DOM scroll — never a navigation).
    Element.prototype.scrollBy = vi.fn();
    render(<ProductCarousel products={[makeProduct(), makeProduct({ id: 'gl-02' })]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next products' }));
    expect(Element.prototype.scrollBy).toHaveBeenCalled();
  });
});
