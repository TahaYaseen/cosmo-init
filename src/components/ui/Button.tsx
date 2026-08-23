import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

/**
 * Returns the Golden Alchemist button classes for a given variant, so
 * non-<button> elements (e.g. BuyButton's enabled-state <a> tag) can share
 * the exact same visual treatment.
 */
export function buttonClasses(variant: ButtonVariant = 'primary'): string {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-none border px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.1em] transition-colors duration-200';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'border-obsidian bg-obsidian text-white hover:border-secondary hover:bg-secondary disabled:border-outline-variant disabled:bg-surface-high disabled:text-outline disabled:cursor-not-allowed',
    secondary:
      'border-primary-container bg-transparent text-on-surface hover:bg-primary-container hover:text-obsidian disabled:border-outline-variant disabled:text-outline disabled:cursor-not-allowed',
    ghost:
      'border-transparent bg-transparent p-0 pb-[3px] text-on-surface border-b border-b-primary-container hover:border-b-2 hover:text-primary disabled:text-outline disabled:cursor-not-allowed',
  };

  return cn(base, variants[variant]);
}

/** Sharp-edged, uppercase, letter-spaced button per the Golden Alchemist design system. */
export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return <button className={cn(buttonClasses(variant), className)} {...props} />;
}
