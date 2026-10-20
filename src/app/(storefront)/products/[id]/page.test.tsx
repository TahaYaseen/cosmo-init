import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { makeProduct, makeSparseProduct } from '@/test-utils/fixtures';

const findByIDMock = vi.fn();
const findMock = vi.fn();

vi.mock('@/lib/getPayloadClient', () => ({
  getPayloadClient: vi.fn(async () => ({ findByID: findByIDMock, find: findMock })),
}));

describe('ProductDetailPage (UC-002)', () => {
  beforeEach(() => {
    findByIDMock.mockReset();
    findMock.mockReset();
    findMock.mockResolvedValue({ docs: [] });
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

  it('shows published feedback and hides the section when none/DB error', async () => {
    findByIDMock.mockResolvedValue(makeProduct());
    findMock.mockResolvedValueOnce({
      docs: [{ id: 'f1', authorName: 'Asha', rating: 5, comment: 'Lovely glow', feedbackDate: '2026-09-01T00:00:00.000Z' }],
    });
    const { default: ProductDetailPage } = await import('./page');
    const first = render(await ProductDetailPage({ params: Promise.resolve({ id: 'gl-01' }) }));
    expect(screen.getByText('Customer Feedback')).toBeInTheDocument();
    expect(screen.getByText('Lovely glow')).toBeInTheDocument();
    first.unmount();

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    findMock.mockRejectedValueOnce(new Error('db down'));
    render(await ProductDetailPage({ params: Promise.resolve({ id: 'gl-01' }) }));
    expect(screen.queryByText('Customer Feedback')).not.toBeInTheDocument();
    expect(screen.getByText('Radiant C Elixir')).toBeInTheDocument();
    spy.mockRestore();
  });
});
