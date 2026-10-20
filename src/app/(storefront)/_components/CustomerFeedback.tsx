import Link from 'next/link';
import { summarizeFeedback, type HomeFeedbackItem } from '@/lib/feedback';
import { FeedbackScroller } from './FeedbackScroller';

function Stars({ value }: { value: number }) {
  const full = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span aria-hidden="true" className="tracking-[0.15em] text-primary">
      {'★'.repeat(full)}
      <span className="text-outline">{'★'.repeat(5 - full)}</span>
    </span>
  );
}

/**
 * Homepage "What Our Customers Say" section: overall rating + latest
 * published feedback across products. Renders nothing when there is none.
 */
export function CustomerFeedback({ feedback }: { feedback: HomeFeedbackItem[] }) {
  if (!feedback || feedback.length === 0) return null;
  const { count, average } = summarizeFeedback(feedback);

  return (
    <section
      className="px-4 pb-[120px] md:px-16"
      id="customer-feedback"
      aria-labelledby="customer-feedback-heading"
    >
      <div className="mx-auto mb-12 flex max-w-[640px] flex-col items-center gap-4 text-center">
        <h2 id="customer-feedback-heading" className="font-display text-4xl text-on-surface">
          What Our Customers Say
        </h2>
        <div className="flex items-center gap-3">
          <Stars value={average} />
          <span className="font-mono text-lg text-on-surface">{average.toFixed(1)}</span>
          <span className="text-sm text-on-surface-variant">
            ({count} {count === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>
      <FeedbackScroller>
        {feedback.map((f) => (
          <li
            key={f.id}
            className="flex min-h-[220px] w-[85%] shrink-0 snap-start flex-col gap-3 border border-primary/15 bg-surface-low p-6 md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-4.5rem)/4)]"
          >
            <p>
              <Stars value={f.rating} />
              <span className="sr-only">{f.rating} out of 5 stars</span>
            </p>
            <p className="text-base text-on-surface-variant">{f.comment}</p>
            <div className="mt-auto flex flex-col gap-1 pt-2">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-on-surface">
                {f.authorName}
              </span>
              {f.productRef && (
                <Link
                  href={`/products/${f.productRef.id}`}
                  className="text-sm text-on-surface-variant underline-offset-4 hover:text-secondary hover:underline"
                >
                  {f.productRef.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </FeedbackScroller>
    </section>
  );
}
