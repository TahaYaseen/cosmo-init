import type { CollectionConfig } from 'payload';
import { revalidatePath } from 'next/cache';

/**
 * ProductFeedback — admin-managed customer feedback shown on product pages.
 * Entries are authored by Content Operators in the Payload admin (not
 * customer-submitted). Table: product_feedback.
 *
 * Access: public may read only status === 'published'; authenticated admin
 * sessions may read/create/update/delete everything.
 */
export const ProductFeedback: CollectionConfig = {
  slug: 'product-feedback',
  labels: { singular: 'Product Feedback', plural: 'Product Feedback' },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'product', 'rating', 'status', 'feedbackDate'],
    group: 'Catalog',
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { status: { equals: 'published' } };
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    { name: 'authorName', type: 'text', required: true },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: { description: 'Whole-number rating from 1 to 5.', step: 1 },
    },
    { name: 'comment', type: 'textarea', required: true },
    {
      name: 'feedbackDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        description: 'Only Published feedback appears on the public product page.',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc }) => revalidateFeedbackPages(doc, previousDoc),
    ],
    afterDelete: [async ({ doc }) => revalidateFeedbackPages(doc)],
  },
};

function productIdOf(doc: { product?: unknown } | undefined): string | null {
  const p = doc?.product;
  if (!p) return null;
  if (typeof p === 'object') {
    const id = (p as { id?: unknown }).id;
    return id == null ? null : String(id);
  }
  return String(p);
}

/**
 * Mirrors Products' afterChange hook: on-demand revalidation so edits are
 * live on next load. Also revalidates the previous product if the entry was
 * moved to a different product. Never blocks a Payload save.
 */
export function revalidateFeedbackPages(
  doc: { product?: unknown },
  previousDoc?: { product?: unknown },
): void {
  try {
    const ids = new Set<string>();
    const current = productIdOf(doc);
    const previous = productIdOf(previousDoc);
    if (current) ids.add(current);
    if (previous) ids.add(previous);
    for (const id of ids) revalidatePath(`/products/${id}`);
    // The homepage "Customer Feedback" section lists the latest feedback.
    revalidatePath('/');
  } catch {
    // revalidatePath throws outside a request context (e.g. seed scripts).
  }
}
