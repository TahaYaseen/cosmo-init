/**
 * Formats a numeric amount as an Indian Rupee string, e.g. formatINR(3200) => "₹3,200".
 * Centralizes currency formatting so a future i18n pass has one integration point.
 */
export function formatINR(amount: number | null | undefined): string {
  const value = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0;
  return `₹${value.toLocaleString('en-IN')}`;
}

/**
 * Returns true only for a syntactically valid absolute http(s) URL.
 * Used to gate the Buy button's enabled/disabled ("Coming Soon") state
 * (UC-003 AC3/AC4) — defense-in-depth alongside the Payload field-level
 * validator on Products.purchaseUrl.
 */
export function isValidAbsoluteUrl(value: string | null | undefined): boolean {
  if (!value || typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
