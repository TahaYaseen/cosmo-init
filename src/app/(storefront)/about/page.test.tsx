import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutPage from './page';

describe('AboutPage (UC-004 AC1)', () => {
  it('renders story, sourcing, and science sections', () => {
    render(<AboutPage />);
    expect(screen.getByText('The Alchemy of Radiance')).toBeInTheDocument();
    expect(screen.getByText('Rooted in Reverence')).toBeInTheDocument();
    expect(screen.getByText('The Science of Efficacy')).toBeInTheDocument();
    expect(screen.getByText('Isolation')).toBeInTheDocument();
    expect(screen.getByText('Refinement')).toBeInTheDocument();
    expect(screen.getByText('Synergy')).toBeInTheDocument();
  });
});
