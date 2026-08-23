import type { CollectionConfig } from 'payload';

/**
 * Users collection — Content Operator admin authentication accounts.
 * Payload's built-in auth (email + bcrypt password + lockout counters).
 * No public read/create — admin accounts are provisioned out-of-band
 * (architecture.md §10).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    lockTime: 10 * 60 * 1000, // 10 minutes
    maxLoginAttempts: 5,
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    // Email added by default via auth: true
  ],
};
