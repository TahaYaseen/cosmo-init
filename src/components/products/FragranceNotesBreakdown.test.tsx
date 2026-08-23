import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FragranceNotesBreakdown } from '@/components/products/FragranceNotesBreakdown';

describe('FragranceNotesBreakdown (UC-002 AC1, AC4)', () => {
  it('renders all three tiers when populated', () => {
    render(
      <FragranceNotesBreakdown
        product={{
          fragranceTopNotes: 'Bergamot',
          fragranceHeartNotes: 'Neroli',
          fragranceBaseNotes: 'Sandalwood',
        }}
      />,
    );
    expect(screen.getByText('Top Notes')).toBeInTheDocument();
    expect(screen.getByText('Heart Notes')).toBeInTheDocument();
    expect(screen.getByText('Base Notes')).toBeInTheDocument();
    expect(screen.getByText('Bergamot')).toBeInTheDocument();
  });

  it('omits blank fragrance tiers', () => {
    render(
      <FragranceNotesBreakdown
        product={{ fragranceTopNotes: 'Bergamot', fragranceHeartNotes: null, fragranceBaseNotes: null }}
      />,
    );
    expect(screen.getByText('Top Notes')).toBeInTheDocument();
    expect(screen.queryByText('Heart Notes')).not.toBeInTheDocument();
    expect(screen.queryByText('Base Notes')).not.toBeInTheDocument();
  });

  it('renders nothing when no fragrance notes are set at all', () => {
    const { container } = render(
      <FragranceNotesBreakdown
        product={{ fragranceTopNotes: null, fragranceHeartNotes: null, fragranceBaseNotes: null }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
