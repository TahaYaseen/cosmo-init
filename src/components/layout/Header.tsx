'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * Sticky frosted-glass top nav. Every icon-only control has an explicit
 * aria-label (architecture.md §24 WCAG 2.1 AA remediation flag).
 *
 * Shop/Science/Ingredients have no dedicated screen in this release's scope
 * (PRD §7) — per the approved UX prototype's design decision, they route to
 * Home. Only "About" has a real destination.
 */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between border-b border-outline-variant bg-surface/80 px-4 backdrop-blur-md md:px-16"
      aria-label="Site header"
    >
      <Link href="/" className="font-body text-lg font-bold tracking-tight text-on-surface" aria-label="Glowrie — go to home">
        Glowrie
      </Link>

      <nav className="hidden gap-8 md:flex" aria-label="Primary">
        <Link href="/" className="text-base text-on-surface-variant hover:text-primary">
          Shop
        </Link>
        <Link href="/" className="text-base text-on-surface-variant hover:text-primary">
          Science
        </Link>
        <Link href="/" className="text-base text-on-surface-variant hover:text-primary">
          Ingredients
        </Link>
        <Link href="/about" className="text-base text-on-surface-variant hover:text-primary">
          About
        </Link>
      </nav>

      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center md:hidden"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {mobileOpen && (
        <nav
          className="absolute inset-x-0 top-20 flex flex-col gap-4 border-b border-outline-variant bg-surface p-6 md:hidden"
          aria-label="Primary, mobile"
        >
          <Link href="/" className="text-base text-on-surface-variant" onClick={() => setMobileOpen(false)}>
            Shop
          </Link>
          <Link href="/" className="text-base text-on-surface-variant" onClick={() => setMobileOpen(false)}>
            Science
          </Link>
          <Link href="/" className="text-base text-on-surface-variant" onClick={() => setMobileOpen(false)}>
            Ingredients
          </Link>
          <Link href="/about" className="text-base text-on-surface-variant" onClick={() => setMobileOpen(false)}>
            About
          </Link>
        </nav>
      )}
    </header>
  );
}
