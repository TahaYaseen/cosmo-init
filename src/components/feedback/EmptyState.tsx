export interface EmptyStateProps {
  message: string;
  description?: string;
}

/** Reusable empty-collection state (e.g. "No products available yet"). */
export function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center md:py-28">
      <h2 className="mb-4 font-display text-2xl text-on-surface">{message}</h2>
      {description && <p className="text-on-surface-variant">{description}</p>}
    </div>
  );
}
