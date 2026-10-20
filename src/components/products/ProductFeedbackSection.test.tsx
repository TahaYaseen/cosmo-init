import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductFeedbackSection } from './ProductFeedbackSection';
import type { ProductFeedback } from '@/lib/types';

const mk = (o: Partial<ProductFeedback> = {}): ProductFeedback => ({
  id: 'f1',
  product: 'p1',
  authorName: 'Asha',
  rating: 5,
  comment: 'Lovely glow',
  feedbackDate: '2026-09-01T00:00:00.000Z',
  status: 'published',
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
  ...o,
});

describe('ProductFeedbackSection', () => {
  it('renders nothing when empty', () => {
    const { container } = render(<ProductFeedbackSection feedback={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
  it('shows average, count and entries', () => {
    render(
      <ProductFeedbackSection
        feedback={[mk(), mk({ id: 'f2', authorName: 'Ravi', rating: 4, comment: 'Nice' })]}
      />,
    );
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(2 reviews)')).toBeInTheDocument();
    expect(screen.getByText('Asha')).toBeInTheDocument();
    expect(screen.getByText('Nice')).toBeInTheDocument();
  });
  it('uses singular for one review', () => {
    render(<ProductFeedbackSection feedback={[mk()]} />);
    expect(screen.getByText('(1 review)')).toBeInTheDocument();
  });
});
