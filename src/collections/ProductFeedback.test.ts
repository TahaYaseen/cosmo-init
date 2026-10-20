import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { ProductFeedback, revalidateFeedbackPages } from '@/collections/ProductFeedback';
import { revalidatePath } from 'next/cache';

interface AccessArgs {
  req: { user: { id: string } | null };
}
const read = ProductFeedback.access!.read as unknown as (a: AccessArgs) => unknown;

describe('ProductFeedback access', () => {
  it('restricts anonymous reads to published', () => {
    expect(read({ req: { user: null } })).toEqual({ status: { equals: 'published' } });
  });
  it('lets admins read all', () => {
    expect(read({ req: { user: { id: 'u' } } })).toBe(true);
  });
  it('requires auth for writes', () => {
    for (const k of ['create', 'update', 'delete'] as const) {
      const fn = ProductFeedback.access![k] as unknown as (a: AccessArgs) => boolean;
      expect(fn({ req: { user: null } })).toBe(false);
      expect(fn({ req: { user: { id: 'u' } } })).toBe(true);
    }
  });
});

describe('ProductFeedback schema', () => {
  it('bounds rating 1-5 and defaults status to draft', () => {
    const fields = ProductFeedback.fields as unknown as Array<Record<string, unknown>>;
    const rating = fields.find((f) => f.name === 'rating')!;
    expect(rating).toMatchObject({ min: 1, max: 5 });
    expect(fields.find((f) => f.name === 'status')).toMatchObject({ defaultValue: 'draft' });
  });
});

describe('revalidateFeedbackPages', () => {
  beforeEach(() => vi.mocked(revalidatePath).mockReset());

  it('revalidates the product page', () => {
    revalidateFeedbackPages({ product: 'p1' });
    expect(revalidatePath).toHaveBeenCalledWith('/products/p1');
  });
  it('revalidates the homepage', () => {
    revalidateFeedbackPages({ product: 'p1' });
    expect(revalidatePath).toHaveBeenCalledWith('/');
  });
  it('revalidates both old and new product when moved', () => {
    revalidateFeedbackPages({ product: { id: 'p2' } }, { product: 'p1' });
    expect(revalidatePath).toHaveBeenCalledWith('/products/p1');
    expect(revalidatePath).toHaveBeenCalledWith('/products/p2');
  });
  it('never throws if revalidatePath throws', () => {
    vi.mocked(revalidatePath).mockImplementationOnce(() => {
      throw new Error('no ctx');
    });
    expect(() => revalidateFeedbackPages({ product: 'p1' })).not.toThrow();
  });
});
