import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CustomerFeedback } from './CustomerFeedback';
import type { HomeFeedbackItem } from '@/lib/feedback';

const item = (over: Partial<HomeFeedbackItem> = {}): HomeFeedbackItem => ({
  id: 'f1',
  product: 'p1',
  productRef: { id: 'p1', name: 'Radiant C Elixir' },
  authorName: 'Asha',
  rating: 5,
  comment: 'Loved it',
  feedbackDate: '2026-01-01T00:00:00.000Z',
  status: 'published',
  createdAt: '',
  updatedAt: '',
  ...over,
});

describe('CustomerFeedback', () => {
  it('renders nothing when there is no feedback', () => {
    const { container } = render(<CustomerFeedback feedback={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders summary, entries, and product link', () => {
    render(
      <CustomerFeedback
        feedback={[item(), item({ id: 'f2', rating: 4, authorName: 'Ravi', comment: 'Nice' })]}
      />,
    );
    expect(screen.getByText('What Our Customers Say')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(2 reviews)')).toBeInTheDocument();
    expect(screen.getByText('Nice')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Radiant C Elixir' })[0]).toHaveAttribute(
      'href',
      '/products/p1',
    );
  });

  it('omits the product link when the product is unavailable', () => {
    render(<CustomerFeedback feedback={[item({ productRef: null })]} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
