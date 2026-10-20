-- 20261006000000_create_product_feedback.sql
--
-- Hand-written migration (same convention as 20260823000000/000003/000005/
-- 000006/000007 — Payload push is disabled, schema is kept in sync by SQL).
-- Creates the table backing the `product-feedback` Payload collection
-- (src/collections/ProductFeedback.ts) plus the locked-documents rels column
-- Payload's admin needs for the new collection.
--
-- Do NOT apply to a remote DB without review.

create table if not exists product_feedback (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  author_name    varchar not null,
  rating         numeric not null check (rating >= 1 and rating <= 5),
  comment        text not null,
  feedback_date  timestamptz(3) not null default now(),
  status         varchar(16) not null default 'draft' check (status in ('draft', 'published')),
  updated_at     timestamptz(3) not null default now(),
  created_at     timestamptz(3) not null default now()
);

create index if not exists product_feedback_product_idx on product_feedback using btree (product_id);
create index if not exists product_feedback_updated_at_idx on product_feedback using btree (updated_at);
create index if not exists product_feedback_created_at_idx on product_feedback using btree (created_at);

-- Storefront query: published feedback for a product, newest first.
create index if not exists product_feedback_published_idx
  on product_feedback (product_id, feedback_date desc)
  where status = 'published';

-- Payload admin document-locking needs a rels column per collection.
alter table payload_locked_documents_rels
  add column if not exists product_feedback_id uuid references product_feedback(id) on delete cascade;
create index if not exists payload_locked_documents_rels_product_feedback_id_idx
  on payload_locked_documents_rels using btree (product_feedback_id);
