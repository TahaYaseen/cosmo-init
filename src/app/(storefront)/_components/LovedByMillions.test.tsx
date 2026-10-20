import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LovedByMillions } from './LovedByMillions';

describe('LovedByMillions (bug-fix-scope Root Cause 6)', () => {
  it('renders the heading and descriptive paragraph', () => {
    render(<LovedByMillions />);
    expect(screen.getByText("We're Loved By Millions!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "There's a reason everybody loves Glowrie: IT WORKS! Our clinical formulas are rigorously tested and dermatologist-recommended for visible results.",
      ),
    ).toBeInTheDocument();
  });

  it('renders all three feature bullets with their titles and descriptions', () => {
    render(<LovedByMillions />);

    expect(screen.getByText('Dermatologist Recommended')).toBeInTheDocument();
    expect(
      screen.getByText('Formulated with pure, active ingredients at optimal pH levels.'),
    ).toBeInTheDocument();

    expect(screen.getByText('Clinically Proven Efficacy')).toBeInTheDocument();
    expect(
      screen.getByText('Visible reduction in blemishes within 72 hours of targeted use.'),
    ).toBeInTheDocument();

    expect(screen.getByText('Best-Selling Formula')).toBeInTheDocument();
    expect(
      screen.getByText('Trusted by millions to deliver clear, glowing skin daily.'),
    ).toBeInTheDocument();
  });

  it('renders a "Read Clinical Studies" link', () => {
    render(<LovedByMillions />);
    const link = screen.getByRole('link', { name: /Read Clinical Studies/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#');
  });

  it('renders the supporting image with appropriate alt text', () => {
    render(<LovedByMillions />);
    const image = screen.getByAltText('Glowrie Daily Moisturizing Lotion bottle');
    expect(image).toBeInTheDocument();
  });
});
