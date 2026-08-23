import { describe, expect, it } from 'vitest';
import { formatINR, isValidAbsoluteUrl, cn } from '@/lib/utils';

describe('formatINR', () => {
  it('formats a whole number with the ₹ symbol and Indian digit grouping', () => {
    expect(formatINR(3200)).toBe('₹3,200');
  });

  it('formats large numbers with lakh/crore-style grouping', () => {
    expect(formatINR(120000)).toBe('₹1,20,000');
  });

  it('treats null/undefined/NaN as ₹0', () => {
    expect(formatINR(null)).toBe('₹0');
    expect(formatINR(undefined)).toBe('₹0');
    expect(formatINR(Number.NaN)).toBe('₹0');
  });
});

describe('isValidAbsoluteUrl', () => {
  it('accepts a valid https URL', () => {
    expect(isValidAbsoluteUrl('https://example.com/product')).toBe(true);
  });

  it('accepts a valid http URL', () => {
    expect(isValidAbsoluteUrl('http://example.com')).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(isValidAbsoluteUrl('')).toBe(false);
  });

  it('rejects null and undefined', () => {
    expect(isValidAbsoluteUrl(null)).toBe(false);
    expect(isValidAbsoluteUrl(undefined)).toBe(false);
  });

  it('rejects a relative path', () => {
    expect(isValidAbsoluteUrl('/products/gl-01')).toBe(false);
  });

  it('rejects a malformed value with no protocol', () => {
    expect(isValidAbsoluteUrl('www.example.com/product')).toBe(false);
  });

  it('rejects a javascript: scheme URL (XSS-adjacent defense-in-depth)', () => {
    expect(isValidAbsoluteUrl('javascript:alert(1)')).toBe(false);
  });
});

describe('cn', () => {
  it('joins truthy class names with a space', () => {
    expect(cn('a', 'b', undefined, false, null, 'c')).toBe('a b c');
  });
});
