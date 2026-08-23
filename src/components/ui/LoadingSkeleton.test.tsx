import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders with an accessible status role', () => {
    render(<LoadingSkeleton aria-label="Loading products" />);
    expect(screen.getByRole('status', { name: 'Loading products' })).toBeInTheDocument();
  });
});
