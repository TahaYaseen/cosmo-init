import { describe, expect, it, vi, beforeEach } from 'vitest';

const findMock = vi.fn();
vi.mock('@/lib/getPayloadClient', () => ({
  getPayloadClient: vi.fn(async () => ({ find: findMock })),
}));

import { getLatestPublishedFeedback, getPublishedFeedback, summarizeFeedback } from './feedback';

describe('summarizeFeedback', () => {
  it('returns zeros for empty input', () => {
    expect(summarizeFeedback([])).toEqual({ count: 0, average: 0 });
  });
  it('averages to one decimal', () => {
    expect(summarizeFeedback([{ rating: 5 }, { rating: 4 }, { rating: 4 }])).toEqual({ count: 3, average: 4.3 });
  });
});

describe('getPublishedFeedback', () => {
  beforeEach(() => findMock.mockReset());

  it('queries only published feedback for the product', async () => {
    findMock.mockResolvedValueOnce({ docs: [{ id: 'f1', rating: 5 }] });
    const docs = await getPublishedFeedback('p1');
    expect(docs).toHaveLength(1);
    expect(findMock.mock.calls[0][0]).toMatchObject({
      collection: 'product-feedback',
      where: { and: [{ product: { equals: 'p1' } }, { status: { equals: 'published' } }] },
    });
  });

  it('returns [] on DB error instead of throwing', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    findMock.mockRejectedValueOnce(new Error('ECONNREFUSED'));
    await expect(getPublishedFeedback('p1')).resolves.toEqual([]);
    spy.mockRestore();
  });
});

describe('getLatestPublishedFeedback', () => {
  beforeEach(() => findMock.mockReset());

  it('queries published feedback across products with depth 1 and maps product', async () => {
    findMock.mockResolvedValueOnce({
      docs: [
        { id: 'f1', rating: 5, product: { id: 'p1', name: 'Serum' } },
        { id: 'f2', rating: 4, product: 'p2' },
      ],
    });
    const docs = await getLatestPublishedFeedback(6);
    expect(findMock.mock.calls[0][0]).toMatchObject({
      collection: 'product-feedback',
      where: { status: { equals: 'published' } },
      sort: '-feedbackDate',
      limit: 6,
      depth: 1,
    });
    expect(docs[0].productRef).toEqual({ id: 'p1', name: 'Serum' });
    expect(docs[1].productRef).toBeNull();
  });

  it('returns [] on DB error instead of throwing', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    findMock.mockRejectedValueOnce(new Error('ECONNREFUSED'));
    await expect(getLatestPublishedFeedback()).resolves.toEqual([]);
    spy.mockRestore();
  });
});
