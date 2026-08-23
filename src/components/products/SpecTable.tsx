import type { Product } from '@/lib/types';

export interface SpecTableProps {
  product: Pick<Product, 'phLevel' | 'format' | 'keyActives'>;
}

/**
 * Technical-specs table: pH level, format, key actives.
 * Omits any row whose value is empty/null — implements UC-002 AC4 at the
 * component level (no blank/"undefined" rows), not just the page level.
 */
export function SpecTable({ product }: SpecTableProps) {
  const rows: Array<{ label: string; value: string }> = [];
  if (product.phLevel) rows.push({ label: 'pH Level', value: product.phLevel });
  if (product.format) rows.push({ label: 'Format', value: product.format });
  if (product.keyActives) rows.push({ label: 'Key Actives', value: product.keyActives });

  if (rows.length === 0) return null;

  return (
    <div className="mb-12">
      <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.1em] text-on-surface">
        Technical Specifications
      </h3>
      <div>
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between border-b border-primary/15 py-3"
          >
            <span className="text-base text-on-surface-variant">{row.label}</span>
            <span className="font-mono text-sm uppercase text-on-surface">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
