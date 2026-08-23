'use client';

import { ErrorState } from '@/components/feedback/ErrorState';

/**
 * Route-segment error boundary — the last-resort fallback if a Local API
 * call throws somewhere that isn't already caught in try/catch
 * (architecture.md §11).
 */
export default function StorefrontError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="pt-24">
      <ErrorState
        message="We're having trouble loading this page right now, please check back shortly"
        onRetry={reset}
      />
    </div>
  );
}
