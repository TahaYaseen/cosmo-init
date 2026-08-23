import Link from 'next/link';

/**
 * Site footer, present on every storefront page.
 *
 * (v1.1, UC-006 AC7): includes a minimal, non-intrusive privacy notice
 * acknowledging visitor-data logging — placeholder copy per PRD §15 OQ-9
 * ("We log visit data for analytics purposes."), to be finalized as real
 * legal copy before this ships to real users. Not a modal/banner/
 * interstitial — no cookie-consent interaction is required since this is
 * passive server-side logging, not client-side cookies/tracking scripts.
 */
export function Footer() {
  return (
    <footer className="bg-obsidian px-4 pb-10 pt-20 text-white md:px-16 md:pb-12 md:pt-24">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 border-b border-white/15 pb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 font-display text-3xl uppercase tracking-tight">Glowrie</p>
          <p className="font-mono text-sm uppercase tracking-[0.15em] text-outline-variant">
            Perpetual Alchemy.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary-container">
              Discover
            </span>
            <a href="#" className="text-sm text-white/75 hover:text-white hover:underline">
              Philosophy
            </a>
            <a href="#" className="text-sm text-white/75 hover:text-white hover:underline">
              Clinical Data
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary-container">
              Support
            </span>
            <a href="#" className="text-sm text-white/75 hover:text-white hover:underline">
              Shipping
            </a>
            <a href="#" className="text-sm text-white/75 hover:text-white hover:underline">
              Contact
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary-container">
              Legal
            </span>
            <a href="#" className="text-sm text-white/75 hover:text-white hover:underline">
              Privacy
            </a>
            <a href="#" className="text-sm text-white/75 hover:text-white hover:underline">
              Terms
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-3 pt-10 text-center md:flex-row md:justify-between md:text-left">
        <span className="text-xs uppercase tracking-[0.12em] text-outline-variant">
          © 2026 Glowrie Apothecary. All rights reserved.
        </span>
        <p data-testid="privacy-notice" className="text-xs text-outline-variant">
          We log visit data for analytics purposes.{' '}
          <Link href="/about" className="underline hover:text-white">
            Learn more
          </Link>
        </p>
      </div>
    </footer>
  );
}
