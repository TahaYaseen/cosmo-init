import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/layout/Header';

describe('Header', () => {
  it('renders the primary nav with a link to Home and About', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /go to home/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'About' }).length).toBeGreaterThan(0);
  });

  it('gives the mobile menu toggle a non-empty accessible name (WCAG 2.1 AA)', () => {
    render(<Header />);
    const toggle = screen.getByRole('button', { name: /open menu|close menu/i });
    expect(toggle).toHaveAccessibleName();
  });
});
