import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/Badge';

describe('Badge', () => {
  it('renders its label text', () => {
    render(<Badge variant="new">NEW</Badge>);
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });
});
