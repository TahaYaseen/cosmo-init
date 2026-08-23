import type { Product } from '@/lib/types';

export interface FragranceNotesBreakdownProps {
  product: Pick<Product, 'fragranceTopNotes' | 'fragranceHeartNotes' | 'fragranceBaseNotes'>;
}

const TIER_META = {
  top: { label: 'Top Notes', timing: '0–15 Minutes' },
  heart: { label: 'Heart Notes', timing: '15–60 Minutes' },
  base: { label: 'Base Notes', timing: '1–6 Hours' },
} as const;

/**
 * Top/Heart/Base fragrance notes with their timing windows.
 * Omits any tier whose value is empty (UC-002 AC4 — no blank rows).
 */
export function FragranceNotesBreakdown({ product }: FragranceNotesBreakdownProps) {
  const tiers: Array<{ key: keyof typeof TIER_META; value: string }> = [];
  if (product.fragranceTopNotes) tiers.push({ key: 'top', value: product.fragranceTopNotes });
  if (product.fragranceHeartNotes) tiers.push({ key: 'heart', value: product.fragranceHeartNotes });
  if (product.fragranceBaseNotes) tiers.push({ key: 'base', value: product.fragranceBaseNotes });

  if (tiers.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 md:px-16">
      <div className="mx-auto mb-14 flex max-w-[640px] flex-col gap-4 text-center">
        <h2 className="font-display text-3xl text-on-surface">Olfactory Architecture</h2>
        <p className="text-on-surface-variant">
          A layered, evolving fragrance designed to transform upon contact with skin warmth.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier.key} className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/35 text-primary">
              <NoteIcon kind={tier.key} />
            </div>
            <h4 className="mt-2 text-xs font-semibold uppercase tracking-[0.1em] text-on-surface">
              {TIER_META[tier.key].label}
            </h4>
            <p className="font-mono text-sm text-on-surface-variant">{TIER_META[tier.key].timing}</p>
            <p className="text-base text-on-surface-variant">{tier.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NoteIcon({ kind }: { kind: 'top' | 'heart' | 'base' }) {
  if (kind === 'top') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
      </svg>
    );
  }
  if (kind === 'heart') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 20s-7-4.35-9.5-8.5C.7 8 2.4 4.5 6 4.5c2.1 0 3.6 1.3 6 4 2.4-2.7 3.9-4 6-4 3.6 0 5.3 3.5 3.5 7C19 15.65 12 20 12 20Z" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 2c4 4 8 8 8 13a8 8 0 1 1-16 0c0-5 4-9 8-13Z" />
    </svg>
  );
}
