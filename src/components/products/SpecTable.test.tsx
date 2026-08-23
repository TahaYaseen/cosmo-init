import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpecTable } from '@/components/products/SpecTable';

describe('SpecTable (UC-002 AC1, AC4)', () => {
  it('renders all populated spec fields', () => {
    render(<SpecTable product={{ phLevel: '5.5 – 6.0', format: 'Viscous Gel', keyActives: 'Niacinamide' }} />);
    expect(screen.getByText('pH Level')).toBeInTheDocument();
    expect(screen.getByText('5.5 – 6.0')).toBeInTheDocument();
    expect(screen.getByText('Format')).toBeInTheDocument();
    expect(screen.getByText('Key Actives')).toBeInTheDocument();
  });

  it('omits blank fields — no empty row or "undefined" text', () => {
    render(<SpecTable product={{ phLevel: '5.0', format: null, keyActives: null }} />);
    expect(screen.queryByText('Format')).not.toBeInTheDocument();
    expect(screen.queryByText('Key Actives')).not.toBeInTheDocument();
    expect(screen.queryByText(/undefined/i)).not.toBeInTheDocument();
  });

  it('renders nothing when every optional field is blank', () => {
    const { container } = render(<SpecTable product={{ phLevel: null, format: null, keyActives: null }} />);
    expect(container).toBeEmptyDOMElement();
  });
});
