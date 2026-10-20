import { getPayloadClient } from '@/lib/getPayloadClient';
import type { ProductFeedback } from '@/lib/types';

export interface FeedbackSummary {
  count: number;
  average: number;
}

/** Average rating (1 decimal) and count over the given entries. */
export function summarizeFeedback(items: Pick<ProductFeedback, 'rating'>[]): FeedbackSummary {
  const valid = items.filter((i) => typeof i.rating === 'number' && Number.isFinite(i.rating));
  if (valid.length === 0) return { count: 0, average: 0 };
  const total = valid.reduce((sum, i) => sum + i.rating, 0);
  return {
    count: valid.length,
    average: Math.round((total / valid.length) * 10) / 10,
  };
}

/**
 * Published feedback for a product, newest first. Never throws: on any DB
 * error returns [] (logged) so the product page keeps rendering.
 */
export async function getPublishedFeedback(productId: string): Promise<ProductFeedback[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'product-feedback',
      where: {
        and: [{ product: { equals: productId } }, { status: { equals: 'published' } }],
      },
      sort: '-feedbackDate',
      limit: 100,
      depth: 0,
      pagination: false,
    });
    return (result?.docs ?? []) as unknown as ProductFeedback[];
  } catch (err) {
    console.error('[product-feedback] failed to load feedback:', err);
    return [];
  }
}

export interface HomeFeedbackItem extends ProductFeedback {
  /** Populated product (depth 1) when available, else null. */
  productRef: { id: string; name: string } | null;
}

/**
 * Latest published feedback across all products (newest first) with the
 * related product's id/name populated. Never throws: on any DB error returns
 * [] (logged) so the homepage keeps rendering.
 */
export async function getLatestPublishedFeedback(limit = 6): Promise<HomeFeedbackItem[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'product-feedback',
      where: { status: { equals: 'published' } },
      sort: '-feedbackDate',
      limit,
      depth: 1,
    });
    const docs = (result?.docs ?? []) as unknown as ProductFeedback[];
    return docs.map((d) => {
      const p = d.product;
      const productRef =
        p && typeof p === 'object' && p.id != null && p.name
          ? { id: String(p.id), name: p.name }
          : null;
      return { ...d, productRef };
    });
  } catch (err) {
    console.error('[product-feedback] failed to load latest feedback:', err);
    return [];
  }
}

/**
 * Rating summary (count + average) per product, over all published feedback,
 * keyed by product id. Never throws: returns {} on any DB error (logged) so
 * the catalog keeps rendering without ratings.
 */
export async function getFeedbackSummaries(): Promise<Record<string, FeedbackSummary>> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: 'product-feedback',
      where: { status: { equals: 'published' } },
      limit: 0,
      depth: 0,
      pagination: false,
    });
    const docs = (result?.docs ?? []) as unknown as ProductFeedback[];
    const byProduct = new Map<string, ProductFeedback[]>();
    for (const d of docs) {
      const pid = typeof d.product === 'object' && d.product ? d.product.id : d.product;
      if (pid == null) continue;
      const key = String(pid);
      byProduct.set(key, [...(byProduct.get(key) ?? []), d]);
    }
    const out: Record<string, FeedbackSummary> = {};
    byProduct.forEach((items, key) => {
      out[key] = summarizeFeedback(items);
    });
    return out;
  } catch (err) {
    console.error('[product-feedback] failed to load feedback summaries:', err);
    return {};
  }
}
