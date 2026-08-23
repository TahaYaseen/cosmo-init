export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/** Graceful backend-unreachable / not-found messaging (architecture.md §11). */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="mx-auto max-w-xl border-t border-error px-4 py-20 text-center md:py-28">
      <h2 className="mb-6 font-display text-2xl text-error">{message}</h2>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="border border-obsidian bg-obsidian px-8 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-white hover:bg-secondary"
        >
          Retry
        </button>
      )}
    </div>
  );
}
