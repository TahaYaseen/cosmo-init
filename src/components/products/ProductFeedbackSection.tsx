import { summarizeFeedback } from '@/lib/feedback';
import type { ProductFeedback } from '@/lib/types';

function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span aria-hidden="true" className="tracking-[0.15em] text-primary">
      {'★'.repeat(full)}
      <span className="text-outline">{'★'.repeat(5 - full)}</span>
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Published customer feedback list with average + count. Renders nothing when empty. */
export function ProductFeedbackSection({ feedback }: { feedback: ProductFeedback[] }) {
  if (!feedback || feedback.length === 0) return null;
  const { count, average } = summarizeFeedback(feedback);

  return (
    <section
      aria-labelledby="product-feedback-heading"
      className="mx-auto max-w-[1440px] px-4 pb-16 pt-12 md:px-16"
    >
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-primary-container pb-6">
        <h2 id="product-feedback-heading" className="font-display text-2xl text-on-surface">
          Customer Feedback
        </h2>
        <div className="flex items-center gap-3">
          <Stars value={average} />
          <span className="font-mono text-lg text-on-surface">{average.toFixed(1)}</span>
          <span className="text-sm text-on-surface-variant">
            ({count} {count === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>
      <ul>
        {feedback.map((f) => (
          <li key={f.id} className="border-b border-primary/15 py-6">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-on-surface">
                {f.authorName}
              </span>
              <span className="font-mono text-xs text-on-surface-variant">
                {formatDate(f.feedbackDate)}
              </span>
            </div>
            <p className="mb-2 text-sm">
              <Stars value={f.rating} />
              <span className="sr-only">{f.rating} out of 5 stars</span>
            </p>
            <p className="text-base text-on-surface-variant">{f.comment}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
