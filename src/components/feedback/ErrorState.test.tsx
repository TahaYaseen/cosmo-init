import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from '@/components/feedback/ErrorState';

describe('ErrorState', () => {
  it('renders the provided message', () => {
    render(<ErrorState message="We're having trouble loading our products right now" />);
    expect(
      screen.getByText("We're having trouble loading our products right now"),
    ).toBeInTheDocument();
  });

  it('calls onRetry when the Retry button is clicked, and omits it when not provided', async () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Error" onRetry={onRetry} />);
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders no retry button when onRetry is not provided', () => {
    render(<ErrorState message="Error" />);
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });
});
