import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: string;
  variant?: 'new' | 'bestseller';
  className?: string;
}

/** Small uppercase catalog-card badge (NEW / BESTSELLER). */
export function Badge({ children, variant, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block border px-2 py-1 font-body text-[10px] font-bold uppercase tracking-[0.12em]',
        variant === 'new'
          ? 'border-[#a15a1f] text-[#a15a1f]'
          : 'border-outline text-outline',
        className,
      )}
    >
      {children}
    </span>
  );
}
