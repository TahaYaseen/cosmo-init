import type { CollectionConfig } from 'payload';

/**
 * Media collection — Payload's standard upload collection.
 * Access pattern: authenticated write, public read (architecture.md §10).
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      admin: {
        description: 'Accessibility alt text (WCAG 2.1 AA requirement).',
      },
    },
  ],
};
