/**
 * Hand-written equivalents of Payload's auto-generated collection types.
 *
 * NOTE ON PROVENANCE: architecture.md §3 calls for "shared TypeScript types
 * generated from Payload config" via `pnpm payload generate:types`. In this
 * sandboxed workspace, that CLI command fails because of a known upstream
 * bug (payloadcms/payload#16949 — tsx's async worker module loader mishandles
 * paths containing a space, and this workspace's path contains one:
 * ".../AI /cosmo-init"). These interfaces are kept in exact sync with
 * src/collections/*.ts by hand as a portable substitute.
 *
 * Once the project is moved to a path with no spaces, run
 * `pnpm payload generate:types` to produce the real src/lib/payload-types.ts
 * and switch these imports over (see README.md "Known Environment Issue").
 */

export interface Media {
  id: string;
  alt?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  url?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ProductBadge = 'NEW' | 'BESTSELLER';
export type ProductStatus = 'draft' | 'published';

export interface Product {
  id: string;
  sku: string;
  name: string;
  categoryLabel?: string | null;
  price: number;
  size?: string | null;
  badge?: ProductBadge | null;
  image: Media | string;
  description: string;
  keyActives?: string | null;
  phLevel?: string | null;
  format?: string | null;
  fragranceTopNotes?: string | null;
  fragranceHeartNotes?: string | null;
  fragranceBaseNotes?: string | null;
  purchaseUrl?: string | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFeedback {
  id: string;
  product: Product | string;
  authorName: string;
  rating: number;
  comment: string;
  feedbackDate: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
