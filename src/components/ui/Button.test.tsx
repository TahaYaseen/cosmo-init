import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders children and responds to click', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Buy Now</Button>);
    const button = screen.getByRole('button', { name: 'Buy Now' });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders in a disabled state', () => {
    render(<Button disabled>Coming Soon</Button>);
    expect(screen.getByRole('button', { name: 'Coming Soon' })).toBeDisabled();
  });
});
