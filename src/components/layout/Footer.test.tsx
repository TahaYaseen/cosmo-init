import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/Footer';

describe('Footer', () => {
  it('renders the UC-006 AC7 privacy notice text', () => {
    render(<Footer />);
    expect(screen.getByTestId('privacy-notice')).toHaveTextContent(
      'We log visit data for analytics purposes.',
    );
  });
});
