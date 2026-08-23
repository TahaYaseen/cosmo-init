import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { makeProduct } from '@/test-utils/fixtures';

const findMock = vi.fn();

vi.mock('@/lib/getPayloadClient', () => ({
  getPayloadClient: vi.fn(async () => ({ find: findMock })),
}));

describe('HomePage (UC-001)', () => {
  beforeEach(() => {
    findMock.mockReset();
  });

  it('renders the carousel and featured spotlight when Published products exist (AC1)', async () => {
    findMock.mockResolvedValueOnce({
      docs: [makeProduct({ id: 'gl-01', name: 'Radiant C Elixir' })],
    });
    const { default: HomePage } = await import('./page');
    render(await HomePage());
    // "Radiant C Elixir" legitimately appears more than once (hero slide 3
    // headline, carousel card, and featured spotlight all reference the same
    // featured product) — assert presence, not uniqueness.
    expect(screen.getAllByText('Radiant C Elixir').length).toBeGreaterThan(0);
    expect(screen.getByText('The Core Formulations')).toBeInTheDocument();
  });

  it('queries only published products, sorted newest-first', async () => {
    findMock.mockResolvedValueOnce({ docs: [makeProduct()] });
    const { default: HomePage } = await import('./page');
    render(await HomePage());
    expect(findMock).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'products',
        where: { status: { equals: 'published' } },
        sort: '-createdAt',
      }),
    );
  });

  it('renders EmptyState when zero published products exist (AC3)', async () => {
    findMock.mockResolvedValueOnce({ docs: [] });
    const { default: HomePage } = await import('./page');
    render(await HomePage());
    expect(screen.getByText('No products available yet')).toBeInTheDocument();
  });

  it('renders ErrorState when the Local API call throws (AC4)', async () => {
    findMock.mockRejectedValueOnce(new Error('connection refused'));
    const { default: HomePage } = await import('./page');
    render(await HomePage());
    expect(
      screen.getByText(
        "We're having trouble loading our products right now, please check back shortly",
      ),
    ).toBeInTheDocument();
  });
});
