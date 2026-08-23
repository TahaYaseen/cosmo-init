import { describe, expect, it, vi } from 'vitest';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { Products, validatePurchaseUrl } from '@/collections/Products';
import { revalidatePath } from 'next/cache';

interface AccessArgs {
  req: { user: { id: string } | null };
}

describe('validatePurchaseUrl (UC-003 AC4, field-level defense-in-depth)', () => {
  it('allows an empty/undefined value (optional field)', () => {
    expect(validatePurchaseUrl('')).toBe(true);
    expect(validatePurchaseUrl(undefined)).toBe(true);
    expect(validatePurchaseUrl(null)).toBe(true);
  });

  it('allows a valid absolute https URL', () => {
    expect(validatePurchaseUrl('https://example.com/product')).toBe(true);
  });

  it('rejects a relative or protocol-less value with an error message', () => {
    expect(validatePurchaseUrl('www.example.com/product')).not.toBe(true);
    expect(typeof validatePurchaseUrl('not-a-url')).toBe('string');
  });

  it('rejects a non-http(s) protocol', () => {
    expect(typeof validatePurchaseUrl('ftp://example.com/file')).toBe('string');
  });
});

describe('Products.access.read (architecture.md §10)', () => {
  it('restricts anonymous reads to Published documents only', () => {
    const result = (Products.access!.read as unknown as (args: AccessArgs) => unknown)({
      req: { user: null },
    } as AccessArgs);
    expect(result).toEqual({ status: { equals: 'published' } });
  });

  it('allows an authenticated admin session to read all documents', () => {
    const result = (Products.access!.read as unknown as (args: AccessArgs) => unknown)({
      req: { user: { id: 'operator-1' } },
    } as AccessArgs);
    expect(result).toBe(true);
  });
});

describe('Products.access create/update/delete (Content Operator only)', () => {
  it('rejects unauthenticated create/update/delete', () => {
    const args = { req: { user: null } } as AccessArgs;
    expect((Products.access!.create as unknown as (a: AccessArgs) => unknown)(args)).toBe(false);
    expect((Products.access!.update as unknown as (a: AccessArgs) => unknown)(args)).toBe(false);
    expect((Products.access!.delete as unknown as (a: AccessArgs) => unknown)(args)).toBe(false);
  });

  it('allows an authenticated session to create/update/delete', () => {
    const args = { req: { user: { id: 'operator-1' } } } as AccessArgs;
    expect((Products.access!.create as unknown as (a: AccessArgs) => unknown)(args)).toBe(true);
    expect((Products.access!.update as unknown as (a: AccessArgs) => unknown)(args)).toBe(true);
    expect((Products.access!.delete as unknown as (a: AccessArgs) => unknown)(args)).toBe(true);
  });
});

describe('Products afterChange hook (ADR-009 revalidation)', () => {
  it('calls revalidatePath for both Home and the specific product on save', async () => {
    const hook = Products.hooks!.afterChange![0];
    await hook({ doc: { id: 'gl-01' } } as never);
    expect(revalidatePath).toHaveBeenCalledWith('/');
    expect(revalidatePath).toHaveBeenCalledWith('/products/gl-01');
  });

  it('never throws even if revalidatePath throws (e.g. outside a request context)', async () => {
    vi.mocked(revalidatePath).mockImplementationOnce(() => {
      throw new Error('no request context');
    });
    const hook = Products.hooks!.afterChange![0];
    await expect(hook({ doc: { id: 'gl-02' } } as never)).resolves.toBeUndefined();
  });
});
