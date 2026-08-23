import { cn } from '@/lib/utils';

export interface LoadingSkeletonProps {
  className?: string;
  'aria-label'?: string;
}

/** Shimmering placeholder block used while content is loading. */
export function LoadingSkeleton({ className, 'aria-label': ariaLabel = 'Loading' }: LoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={cn(
        'animate-pulse bg-gradient-to-r from-surface-low via-surface-high to-surface-low bg-[length:400%_100%]',
        className,
      )}
    />
  );
}
