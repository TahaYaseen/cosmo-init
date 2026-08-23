import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BuyButton } from '@/components/products/BuyButton';

describe('BuyButton (UC-003)', () => {
  it('renders an enabled link that opens the exact purchaseUrl in a new tab (AC1/AC2)', () => {
    render(<BuyButton purchaseUrl="https://retailer.example.com/products/gl-01" />);
    const link = screen.getByRole('link', { name: /buy now/i });
    expect(link).toHaveAttribute('href', 'https://retailer.example.com/products/gl-01');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('renders disabled "Coming Soon" when purchaseUrl is empty (AC3)', async () => {
    const onClick = vi.fn();
    render(<BuyButton purchaseUrl="" />);
    const button = screen.getByRole('button', { name: 'Coming Soon' });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders disabled "Coming Soon" for a malformed purchaseUrl (AC4)', () => {
    render(<BuyButton purchaseUrl="www.retailer.example.com/products/gl-01" />);
    expect(screen.getByRole('button', { name: 'Coming Soon' })).toBeDisabled();
  });

  it('renders disabled "Coming Soon" when purchaseUrl is null/undefined', () => {
    render(<BuyButton purchaseUrl={null} />);
    expect(screen.getByRole('button', { name: 'Coming Soon' })).toBeDisabled();
  });
});
