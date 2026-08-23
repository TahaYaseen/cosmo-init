import type { AnchorHTMLAttributes, ReactNode } from 'react';

/** Vitest-only stand-in for next/link: renders a plain <a>. */
export default function Link({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
