import type { Product } from '@/lib/types';

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'gl-01',
    sku: 'GL-01',
    name: 'Radiant C Elixir',
    categoryLabel: 'Vitamin C Serum',
    price: 3200,
    size: '30ml / 1.0 fl oz',
    badge: 'NEW',
    image: {
      id: 'media-1',
      url: 'https://example.supabase.co/storage/v1/object/public/media/radiant-c.jpg',
      alt: 'Radiant C Elixir bottle',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    description:
      'A high-potency 15% Vitamin C serum stabilized with Ferulic Acid and Vitamin E.',
    keyActives: '15% Vitamin C, Ferulic Acid, Vitamin E',
    phLevel: '3.2 – 3.5',
    format: 'Lightweight Serum',
    fragranceTopNotes: 'Bergamot, Blood Orange',
    fragranceHeartNotes: 'Neroli, White Tea',
    fragranceBaseNotes: 'Sandalwood, Musk',
    purchaseUrl: 'https://www.glowrie-retailer.example.com/products/radiant-c-elixir',
    status: 'published',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

/** A product with every optional field left blank — for UC-002 AC4 tests. */
export function makeSparseProduct(overrides: Partial<Product> = {}): Product {
  return makeProduct({
    categoryLabel: null,
    size: null,
    badge: null,
    keyActives: null,
    phLevel: null,
    format: null,
    fragranceTopNotes: null,
    fragranceHeartNotes: null,
    fragranceBaseNotes: null,
    purchaseUrl: null,
    ...overrides,
  });
}
