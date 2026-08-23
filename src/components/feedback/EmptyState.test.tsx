import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/feedback/EmptyState';

describe('EmptyState', () => {
  it('renders the "No products available yet" message (UC-001 AC3)', () => {
    render(<EmptyState message="No products available yet" description="Check back shortly." />);
    expect(screen.getByText('No products available yet')).toBeInTheDocument();
    expect(screen.getByText('Check back shortly.')).toBeInTheDocument();
  });
});
