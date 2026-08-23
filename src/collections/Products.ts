import type { CollectionConfig } from 'payload';
import { revalidatePath } from 'next/cache';

/**
 * Products collection — the single CMS-managed business entity for Glowrie.
 * Schema matches architecture.md §6 exactly (camelCase fields map to
 * snake_case columns automatically via Payload's Postgres adapter).
 *
 * Access control (architecture.md §10):
 *  - read: public may read only status === 'published'; authenticated may read all.
 *  - create/update/delete: authenticated (Content Operator) only.
 */
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'status', 'price'],
    group: 'Catalog',
  },
  access: {
    read: ({ req }) => {
      // Authenticated admin sessions may read all (Draft + Published).
      if (req.user) return true;
      // Anonymous/public requests may only read Published documents.
      return {
        status: {
          equals: 'published',
        },
      };
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Pricing & Identity',
          fields: [
            {
              name: 'sku',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'Unique product code shown on catalog cards (e.g. "GL-01").',
              },
            },
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'categoryLabel',
              type: 'text',
              required: false,
              admin: {
                description: 'Short overline label shown on the catalog card (e.g. "Body Cleanser").',
              },
            },
            {
              name: 'price',
              type: 'number',
              required: true,
              min: 0,
              admin: {
                description: 'Price in INR (₹). No currency field — single-currency release.',
                step: 0.01,
              },
            },
            {
              name: 'size',
              type: 'text',
              required: false,
              admin: {
                description: 'e.g. "500ml / 16.9 fl oz"',
              },
            },
            {
              name: 'badge',
              type: 'select',
              required: false,
              options: [
                { label: 'New', value: 'NEW' },
                { label: 'Bestseller', value: 'BESTSELLER' },
              ],
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Product hero/card image.',
              },
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Long-form marketing/product copy.',
              },
            },
            {
              name: 'keyActives',
              type: 'text',
              required: false,
              admin: {
                description: 'Short list of key actives, e.g. "15% Vitamin C, Ferulic Acid". Used both as a card subtitle and in Technical Specs.',
              },
            },
          ],
        },
        {
          label: 'Technical Specs',
          fields: [
            {
              name: 'phLevel',
              type: 'text',
              required: false,
              admin: {
                description: 'e.g. "5.5 – 6.0"',
              },
            },
            {
              name: 'format',
              type: 'text',
              required: false,
              admin: {
                description: 'e.g. "Viscous Gel"',
              },
            },
          ],
        },
        {
          label: 'Fragrance Notes',
          fields: [
            {
              name: 'fragranceTopNotes',
              type: 'text',
              required: false,
              admin: {
                description: 'e.g. "Bergamot, Blood Orange" — implied timing window 0–15 minutes.',
              },
            },
            {
              name: 'fragranceHeartNotes',
              type: 'text',
              required: false,
              admin: {
                description: 'e.g. "Neroli, White Tea" — implied timing window 15–60 minutes.',
              },
            },
            {
              name: 'fragranceBaseNotes',
              type: 'text',
              required: false,
              admin: {
                description: 'e.g. "Sandalwood, Musk" — implied timing window 1–6 hours.',
              },
            },
          ],
        },
        {
          label: 'Commerce',
          fields: [
            {
              name: 'purchaseUrl',
              type: 'text',
              required: false,
              validate: validatePurchaseUrl,
              admin: {
                description:
                  "External URL where this product is actually sold, e.g. an Amazon listing. Leave blank to show 'Coming Soon.'",
              },
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
                description: 'Controls storefront visibility — only Published products appear on the public site.',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        // ADR-009: on-demand ISR revalidation so a publish/update is live on
        // next page load with no manual deploy (PRD §5 KPI).
        try {
          revalidatePath('/');
          revalidatePath(`/products/${doc.id}`);
        } catch {
          // revalidatePath is a no-op / throws outside of a request context
          // (e.g. seed scripts run outside Next's server runtime) — never
          // let this block a Payload save.
        }
      },
    ],
  },
};

/**
 * Field-level validation for purchaseUrl (architecture.md §6): rejects
 * non-absolute-URL strings at write time, directly implementing PRD §9
 * UC-003 AC4's recommendation. Empty/undefined is allowed (optional field).
 */
export function validatePurchaseUrl(value: string | null | undefined): true | string {
  if (value === null || value === undefined || value === '') return true;
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return 'Purchase URL must start with http:// or https://';
    }
    return true;
  } catch {
    return 'Purchase URL must be a valid absolute URL (e.g. https://example.com/product)';
  }
}
