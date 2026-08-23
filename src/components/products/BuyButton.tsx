'use client';

import { buttonClasses } from '@/components/ui/Button';
import { isValidAbsoluteUrl, cn } from '@/lib/utils';

export interface BuyButtonProps {
  purchaseUrl: string | null | undefined;
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * Shared Buy control used on both the Detail page and the Home Featured
 * Spotlight (UC-003). When purchaseUrl is a valid absolute http(s) URL,
 * renders an enabled link that opens it in a new tab. Otherwise renders a
 * disabled "Coming Soon" button — no navigation occurs on click (AC3/AC4).
 */
export function BuyButton({ purchaseUrl, size = 'md', className }: BuyButtonProps) {
  const label = size === 'lg' ? 'Shop This Formula' : 'Buy Now';

  if (isValidAbsoluteUrl(purchaseUrl)) {
    return (
      <a
        href={purchaseUrl as string}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonClasses('primary'), 'w-max', className)}
      >
        {label}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      title="This product is not yet available for purchase"
      className={cn(buttonClasses('primary'), 'w-max', className)}
    >
      Coming Soon
    </button>
  );
}
