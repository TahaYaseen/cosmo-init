import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { makeProduct, makeSparseProduct } from '@/test-utils/fixtures';

const findByIDMock = vi.fn();

vi.mock('@/lib/getPayloadClient', () => ({
  getPayloadClient: vi.fn(async () => ({ findByID: findByIDMock })),
}));

describe('ProductDetailPage (UC-002)', () => {
  beforeEach(() => {
    findByIDMock.mockReset();
  });

  it('renders all populated fields for a fully-populated product (AC1)', async () => {
    findByIDMock.mockResolvedValueOnce(makeProduct());
    const { default: ProductDetailPage } = await import('./page');
    render(await ProductDetailPage({ params: Promise.resolve({ id: 'gl-01' }) }));

    expect(screen.getByText('Radiant C Elixir')).toBeInTheDocument();
    expect(screen.getByText('₹3,200')).toBeInTheDocument();
    expect(screen.getByText('30ml / 1.0 fl oz')).toBeInTheDocument();
    expect(screen.getByText(/high-potency 15% Vitamin C serum/)).toBeInTheDocument();
    expect(screen.getByText('pH Level')).toBeInTheDocument();
    expect(screen.getByText('Top Notes')).toBeInTheDocument();
  });

  it('renders "no longer available" for a Draft/deleted product, with a Home link (AC2)', async () => {
    findByIDMock.mockResolvedValueOnce(null);
    const { default: ProductDetailPage } = await import('./page');
    render(await ProductDetailPage({ params: Promise.resolve({ id: 'missing' }) }));

    expect(screen.getByText('This product is no longer available')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Home' })).toHaveAttribute('href', '/');
  });

  it('renders "no longer available" when the doc exists but is not published', async () => {
    findByIDMock.mockResolvedValueOnce(makeProduct({ status: 'draft' }));
    const { default: ProductDetailPage } = await import('./page');
    render(await ProductDetailPage({ params: Promise.resolve({ id: 'gl-05' }) }));

    expect(screen.getByText('This product is no longer available')).toBeInTheDocument();
  });

  it('renders ErrorState on a genuine backend failure (AC3)', async () => {
    findByIDMock.mockRejectedValueOnce(new Error('ECONNREFUSED'));
    const { default: ProductDetailPage } = await import('./page');
    render(await ProductDetailPage({ params: Promise.resolve({ id: 'gl-01' }) }));

    expect(
      screen.getByText(
        "We're having trouble loading this product right now, please check back shortly",
      ),
    ).toBeInTheDocument();
  });

  it('renders no blank/undefined text for a sparsely-filled product (AC4)', async () => {
    findByIDMock.mockResolvedValueOnce(makeSparseProduct());
    const { default: ProductDetailPage } = await import('./page');
    render(await ProductDetailPage({ params: Promise.resolve({ id: 'gl-06' }) }));

    expect(screen.queryByText(/undefined/i)).not.toBeInTheDocument();
    expect(screen.queryByText('pH Level')).not.toBeInTheDocument();
    expect(screen.queryByText('Top Notes')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Coming Soon' })).toBeInTheDocument();
  });
});
