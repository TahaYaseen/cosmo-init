# Initial PRD — Glowrie Product Catalog Storefront

## §1. Basic Information

| Field | Value |
|---|---|
| Project Name | Product Catalog Storefront — "Glowrie" ("Cosmo Init") |
| JIRA ID | N/A (no JIRA ticket — direct brainstorm → PRD flow) |
| Product Type | Greenfield web application (public e-commerce storefront) |
| Priority | TBD (not specified by stakeholder) |
| Target Release | Full build — not time-boxed to a sprint cadence (see §7) |
| Date | 2026-08-23 |
| Version | 1.1 (Phase 1 — Complete, pending user content approval; all 7 v1.0 Open Questions resolved) |

### Create Table

| Created By | Date |
|---|---|
| Harvey AI | 2026-08-22 |
| Mohammad Taha | 2026-08-22 |

### Sign-Off

| Role | Approver Name | Status |
|---|---|---|
| PM | _Pending_ | Pending |
| Engineering Lead | _Pending_ | Pending |
| Design | _Pending_ | Pending |

> This document is generated from the approved `brainstorm-summary.md` (signed off by Mohammad Taha, 2026-08-22) plus a resolved round of 14 clarifying questions (CQ-1..CQ-14), a stakeholder-approved scope expansion driven by real design assets provided mid-session (see §7 lineage note), and a subsequent resolution round of all 7 v1.0 Open Questions (OQ-1..OQ-7, resolved 2026-08-23) that includes a major scope reversal: Cart/Checkout has been removed entirely and replaced with an external Buy/purchase-link redirect (see §7 Scope Correction). Sign-Off remains Pending until content is reviewed and approved.

---

## §2. Executive Summary

Glowrie is a real, live, public-facing product catalog/storefront for a premium skincare/beauty brand. Visitors browse a curated catalog on a Home page and view rich product detail (formulation specs, fragrance notes, pricing in INR) — with no accounts, no in-app cart, and no in-app checkout of any kind. Instead, each product's Detail page (and the Home page's Featured Product spotlight) offers a **Buy** button that redirects the Visitor off-site, in a new tab, to wherever the product is actually sold (e.g. an Amazon listing), via a per-product external purchase URL that the Content Operator sets in the existing Payload CMS admin panel. A single Content Operator maintains the entire product catalog through Payload CMS, with zero custom admin tooling required. The MVP starts with a small flat catalog of 4 products but is explicitly designed to grow. This PRD reflects two rounds of stakeholder-confirmed scope changes: a mid-session expansion that added a static Brand/About storytelling page on top of the original browse-only concept, followed by a subsequent, more fundamental reversal that removed all Cart/Checkout functionality in favor of the simpler external-redirect purchase model described above (see §7 Scope Correction). The expected business impact is a durable, low-risk storefront foundation — a real product discovery experience that hands off the actual transaction to an existing, trusted external sales channel — that can grow in scope (in-app purchasing, accounts, search/filtering) once this discovery-first MVP proves out.

---

## §3. Problem Statement

There is currently no live, public storefront for the Glowrie product catalog. Prospective customers have no way to browse available products, see product details (pricing, formulation, fragrance profile), or find out where to actually buy them. Today, product information exists only wherever the Content Operator manages it directly (e.g., internal notes or the bare Payload CMS records) — there is no customer-facing presentation layer at all. The Content Operator needs a way to publish and maintain product content without engineering involvement per change, using CMS tooling they already have access to (Payload CMS admin). Visitors need a fast, anonymous, low-friction way to discover products and understand them well enough to want to buy, without being forced to create an account first — and, once they decide to buy, a clear path to the external listing where the product is actually sold.

---

## §4. KPIs & Business Justification

| KPI | Baseline | Target | Measurement |
|---|---|---|---|
| Catalog → Detail navigation reachability | N/A (new product) | 100% of Published products reachable from Home carousel with 0 broken links | Manual QA pass / synthetic check each release |
| Content Operator publish-to-live latency | N/A | Change visible on storefront on next page load, no manual deploy or developer involvement required | Manual verification during Content Operator UAT |
| Storefront availability | N/A | ≥ 99.5% uptime (see §12) | Uptime monitoring (tool selection is an Architect decision) |
| External Buy-link redirect reliability | N/A | 100% of catalog products with a Content-Operator-set external purchase URL correctly redirect the Visitor to that URL in a new tab, with 0 broken/incorrect links | Manual QA pass across all catalog products |

**Why now:** The stakeholder has explicitly framed this as a real, live storefront (not a throwaway exercise) and has already produced production-quality design assets for four screens. Publishing now validates the headless-CMS-backed storefront pattern (Payload CMS as system of record + a purpose-built frontend) on a small, low-risk catalog (4 products) before committing to larger investments (accounts, real payments, search) once the pattern is proven.

---

## §5. Success Criteria

| # | Criterion | Threshold |
|---|---|---|
| SC1 | Home page product carousel renders every Published product | 100% of the 4 initial catalog products display image, name, and price correctly on first load |
| SC2 | Catalog-to-Detail navigation | A Visitor reaches any product's Detail page in ≤ 2 clicks from Home, with 0 broken links, across all 4 products |
| SC3 | External Buy-link correctness | 100% of the 4 catalog products with a set `purchaseUrl` open the correct external listing in a new browser tab when the Buy button is clicked, verified across all 4 products |
| SC4 | Brand/About reachability | The Brand/About page is reachable from primary navigation on every screen, 100% of the time |
| SC5 | Content Operator self-service publishing | A Content Operator can publish a new product via Payload CMS and see it live on the storefront with zero developer involvement and zero code deployment |

"Done" for this MVP means: a Visitor can complete the full **Browse → Detail → Buy (external redirect)** journey for every catalog product with a set purchase URL, the Brand/About page is reachable, and the Content Operator can independently manage the catalog — including each product's external purchase URL — end-to-end via Payload CMS.

---

## §6. Users & Personas

| Persona | Description | Goals | Pain Points |
|---|---|---|---|
| **Visitor / Shopper** | Anonymous public visitor browsing the storefront; no account, no login | Discover products, understand formulation/fragrance detail, and follow a clear path to buy the product on the external site where it's actually sold | No current storefront exists at all; cannot currently browse, evaluate, or find where to buy any product |
| **Content Operator** | The person maintaining the product catalog | Add/edit/publish/unpublish products and their full field set via the existing Payload CMS admin panel, without needing engineering help or a custom admin UI | No current customer-facing surface exists to see the impact of catalog changes; needs confidence that CMS edits go live reliably |

No org-published persona list was found to check against (greenfield project, no existing product wiki) — both personas are net-new and should be added to any future master persona list.

---

## §7. Scope

**`build_scope: full`** — the stakeholder confirmed a full build (CQ-8), not a timeline-boxed MVP. All requirements captured in this PRD are in scope for the initial release; there is no MVP/Phase-2 phasing applied in this document (phasing, if any, is a Phase 2 refinement activity).

### Scope Expansion Lineage (mandatory context — do not re-litigate)

`brainstorm-summary.md` originally scoped this as a **browse-only, 2-screen, name+image-only** catalog (its §3 Core Features and §8 assumptions #1–#3). During this PRD session, the stakeholder shared real design assets (`/home/mohammady/Documents/learning/Glowrie` — Home, Detail, Cart, Brand/About) that revealed a materially larger real design. This was surfaced directly to the stakeholder and explicitly resolved via an orchestrator-mediated HITL gate on 2026-08-23:

1. **[SUPERSEDED 2026-08-23 — see "Scope Correction" below]** ~~Cart / Checkout-entry is now IN SCOPE~~ (stakeholder: "yes include") — the design includes "Add to Ritual" (add-to-cart) actions on Home and Detail, and a full Cart page (line items, quantity control, remove, Order Summary, "Proceed to Checkout"). The original brainstorm's item marking "Checkout / payment / transactions" as out-of-scope-for-later is **superseded**: Cart management and reaching the Checkout entry point are now in scope; only the actual payment-processing mechanics beyond that entry point remain unresolved (§15 OQ-1).
2. **Brand/About page is now IN SCOPE** (stakeholder: "yes part of mvp") — a 4th, purely static, marketing/storytelling screen.
3. **Product entity is richer than name+image** — per the Detail page design, Product now includes price, size/volume, description, technical specs (pH level, format, key actives), and fragrance notes (top/heart/base notes). The brainstorm's original assumption treating "Product price/description/stock fields" as out-of-scope-for-later is **superseded**.
4. **Screen count is now 4** (Home, Detail, Cart, Brand/About), not 2.

This lineage is preserved here rather than silently overwriting `brainstorm-summary.md`, per the PRD scope-and-deferral consent rule.

### Scope Correction — Cart/Checkout Removed (Post-v1.0, resolved 2026-08-23)

During resolution of the v1.0 Open Questions, the stakeholder reversed the Cart/Checkout decision recorded above (§7 Scope Expansion Lineage, item 1). This correction **supersedes** that item:

1. **Cart and Checkout are removed from scope entirely.** There is no "Add to Ritual"/add-to-cart action, no Cart entity, no Cart page/screen, and no checkout flow of any kind — the entire Cart/Checkout use-case family (former UC-003 through UC-007) is removed from this PRD.
2. **Replacement model — external purchase redirect.** The Product Detail page and the Home page's Featured Product spotlight instead show a **Buy** button. Clicking it redirects the Visitor off-site, in a new tab, to wherever the product is actually sold (e.g. an Amazon product listing) — a simple external URL redirect with no in-app transaction logic. See new UC-003 (§8).
3. **New Product field.** Product gains an external purchase URL field (`purchaseUrl`), set per-product by the Content Operator via the Payload CMS admin panel (see §9).
4. **Design asset status.** The `cart/` screen design asset at `/home/mohammady/Documents/learning/Glowrie/cart` is now **out of scope / unused** for this MVP. It is retained (not deleted or ignored) in case Cart/Checkout scope is revisited in a future phase — see Parking Lot below.

This correction is preserved here alongside the original expansion lineage, rather than silently rewriting history, per the PRD scope-and-deferral consent rule.

### In Scope

- Public Home/landing page with a product carousel showing all Published catalog products (currently 4), a marketing hero carousel, a trust-badge ribbon, and a single Featured Product spotlight with a direct Buy/external-purchase-link action
- Product Detail page showing the full Product field set (name, price in INR, size, description, technical specs, fragrance notes) and a Buy/external-purchase-link action
- Buy button behavior: clicking Buy (on Home Featured Product or Detail page) opens the product's Content-Operator-set external purchase URL in a new browser tab; if no URL is set yet, the Buy button shows a disabled "Coming Soon" state instead (see UC-003)
- Brand/About page: static brand story, sourcing, and science/process content
- Anonymous browsing — no accounts, no login, no sign-up, no cart of any kind (CQ-3 confirmed; cart/checkout formally removed — see Scope Correction above)
- Content management entirely via the existing Payload CMS admin panel — no custom admin UI is built; the Content Operator manages each product's external purchase URL there
- A flat, uncategorized product list for MVP (no categories/tags/search/filtering) — see forward-looking note below

### Out of Scope (Deferred)

| Item | Reason |
|---|---|
| Cart / Checkout (all forms) — add-to-cart, cart page, quantity/remove management, checkout entry point, and any real payment gateway/processor integration | **Deferred — Reason:** Stakeholder reversed the earlier Cart/Checkout-in-scope decision during OQ resolution (2026-08-23) — see §7 Scope Correction. Replaced by a simple external Buy/purchase-link redirect (UC-003). The `cart/` design asset is retained, unused, for a possible future phase. |
| User accounts (sign-up/login/wishlist/favorites) | Deferred — Reason: stakeholder confirmed MVP is fully anonymous browsing; no account-gated feature was requested (CQ-3 confirmed). |
| Categories / tags / filtering / search | Deferred — Reason: catalog is a small flat list (4 products) for MVP; no categorization requested. Catalog is expected to grow beyond a flat list in the future (CQ-6) — architecture should not hard-code a "flat list of exactly 4" assumption (see §14). |
| Custom internal admin UI | Deferred — Reason: Payload CMS's built-in admin panel is sufficient for MVP content management; no additional admin tooling requested (CQ-11 confirmed: single Content Operator role, no additional roles). |
| CMS management of marketing/static content (Hero slides, Brand/About copy, trust-ribbon claims, Featured Product selection) | Deferred — Reason: **Resolved (OQ-3, 2026-08-23)** as originally assumed — only the Product entity is Payload-CMS-managed; marketing content is static/developer-maintained for MVP. |
| Product-level in-stock / out-of-stock indicator | Deferred — Reason: judgment call made during OQ-7 resolution (2026-08-23) — since the storefront never processes an in-app transaction (Buy only redirects externally), stock/availability tracking has no functional purpose for MVP; the Buy button's only gating condition is whether `purchaseUrl` is set (see §9, UC-003). Captured in Parking Lot below for possible future reconsideration. |

### Parking Lot

| Idea | Raised by | Why not in this PRD | Category |
|---|---|---|---|
| Catalog growth beyond a flat list (categories/tags/pagination) | Stakeholder (CQ-6) | Explicitly forward-looking; flat list of 4 is the confirmed MVP starting point | future-phase-same-product |
| Multi-role / additional operator permissions | Stakeholder (CQ-11, unanswered — default applied) | No additional roles requested; single Content Operator via Payload CMS admin assumed sufficient | future-phase-same-product |
| Cart / Checkout / real payment processing | Stakeholder (OQ-1 resolution, 2026-08-23) | Reversed from in-scope to fully out-of-scope for this MVP in favor of an external-redirect Buy model; the `cart/` design asset is retained unused | future-phase-same-product |
| Product-level in-stock/out-of-stock indicator (Content-Operator managed) | Harvey AI judgment call (OQ-7 resolution, 2026-08-23) | Not needed for MVP since there is no in-app transaction to gate; could be added later if the Content Operator wants to proactively hide the Buy button independent of `purchaseUrl` | nice-to-have |

---

## §8. Use Cases

### End-to-End Flows (Adaptive Section)

**Critical Path Journey — Visitor:** Home (browse carousel) → Detail (view full product) → Click Buy → redirected to external purchase listing in a new tab (MVP ends here; no in-app cart or checkout).

**Critical Path Journey — Content Operator:** Log into Payload CMS admin → Create/Edit a product record → Set status = Published → Change is live on the public storefront with no deploy.

---

### UC-001: Browse Product Catalog (Home Page)

**Actors:** Visitor (primary), System (reads from Payload CMS)
**Trigger:** Visitor navigates to the storefront's Home/root URL
**Steps:**
1. Visitor loads the Home page.
2. System retrieves all Published products from the Catalog.
3. System renders each product in a horizontal product carousel (SKU/code, optional badge, image, name, key-actives highlight, price).
4. Visitor navigates the carousel via prev/next controls.
5. Visitor clicks any product card to go to UC-002.

**Business Rules:** Only products with status = Published are visible to Visitors; Draft products are hidden.

**Acceptance Criteria:**
- AC1: Given the Catalog has 1+ Published products, When a Visitor loads the Home page, Then the Home page renders a product carousel containing every Published product with image, name, and price visible.
- AC2: Given the carousel contains more items than fit in one view, When the Visitor clicks "next", Then the carousel scrolls to reveal more products without a full page reload.
- AC3 (sad path — no data): Given the Catalog has zero Published products, When a Visitor loads the Home page, Then the system shows a friendly "No products available yet" message instead of an empty/broken carousel.
- AC4 (sad path — service unavailable): Given the Payload CMS backend is unreachable, When a Visitor loads the Home page, Then the system shows a graceful error message (e.g. "We're having trouble loading our products right now, please check back shortly") instead of a blank page or unhandled error.

**Source:** `brainstorm-summary.md` §3.1, §5 Flow A; Glowrie design assets — `home page/`

---

### UC-002: View Product Detail

**Actors:** Visitor
**Trigger:** Visitor clicks a product from the Home carousel, the Featured Product panel, or another entry point
**Steps:**
1. Visitor clicks a product.
2. System navigates to that product's Detail page.
3. System displays category label, name, price (₹), size, description, technical specs (pH level, format, key actives), fragrance notes (top/heart/base with timing), and a "Buy" button.
4. Visitor may click Buy (UC-003) or navigate back.

**Acceptance Criteria:**
- AC1: Given a Published product exists, When a Visitor opens its Detail page, Then all populated fields (name, price, size, description, technical specs, fragrance notes) are displayed.
- AC2 (sad path — not found): Given a product has been deleted or unpublished, When a Visitor navigates to a link pointing at that product's Detail page, Then the system shows "This product is no longer available" with a link back to Home/Catalog, instead of an error page.
- AC3 (sad path — service unavailable): Given the CMS backend is unreachable, When a Visitor opens a Detail page, Then a graceful error message is shown.
- AC4: Given a product has optional fields left blank (e.g. no badge, no fragrance notes), When the Visitor views the Detail page, Then only populated fields render — no blank/placeholder text (e.g. "undefined") appears.

**Source:** `brainstorm-summary.md` §5 Flow B; Glowrie design assets — `detail/`

---

### UC-003: Visitor Clicks Buy → Redirected to External Purchase Listing

**Actors:** Visitor
**Trigger:** Visitor clicks the "Buy" button on the Home page's Featured Product spotlight or on a product's Detail page
**Steps:**
1. Visitor clicks "Buy" for a product that has a `purchaseUrl` set.
2. System opens that product's `purchaseUrl` in a new browser tab.
3. The storefront tab remains open and unchanged — no in-app cart, transaction, or state change occurs.

**Business Rules:** This is a simple external redirect only — the storefront performs no purchase, payment, or order-tracking logic of any kind. Availability of the Buy action depends solely on whether the Content Operator has set a `purchaseUrl` for that product (see §9) — no stock/inventory check is performed (see §15 OQ-7 resolution).

**Acceptance Criteria:**
- AC1: Given a Published product has a non-empty `purchaseUrl`, When a Visitor clicks "Buy" on its Detail page, Then that exact URL opens in a new browser tab and the storefront tab is unaffected.
- AC2: Given a product is featured on the Home page and has a non-empty `purchaseUrl`, When a Visitor clicks "Buy" on the Featured Product spotlight, Then the same redirect behavior as AC1 occurs.
- AC3 (sad path — purchase URL not yet set): Given a Published product's `purchaseUrl` is empty/not yet set by the Content Operator, When a Visitor views that product (Detail page or Home Featured Product), Then the Buy button is shown in a disabled state labeled "Coming Soon" instead of being clickable, and no navigation occurs if interacted with.
- AC4 (sad path — malformed URL): Given a Content Operator has entered a value in `purchaseUrl` that is not a valid absolute URL, When a Visitor views that product, Then the system treats it the same as AC3 (disabled "Coming Soon" state) rather than attempting a broken redirect. `[Recommendation: Payload CMS field-level URL validation should prevent this at entry time — an Architect/CMS-config concern, not a PRD scope item.]`

**Source:** Stakeholder OQ-1 resolution, 2026-08-23 (Cart/Checkout removed; replaced by this external-redirect Buy model) — supersedes former UC-003 through UC-007 in v1.0 of this document.

---

### UC-004: View Brand / About Page

**Actors:** Visitor
**Trigger:** Visitor clicks the "About" (Brand) navigation link
**Steps:**
1. Visitor clicks the Brand/About navigation link.
2. System displays the static Brand/About page (brand story/philosophy, sourcing, science/process sections).

**Business Rules:** Brand/About page content is static marketing copy for MVP, confirmed not CMS-managed (OQ-3 resolved).

**Acceptance Criteria:**
- AC1: Given the Visitor is on any storefront page, When they click "About", Then the Brand/About page loads with its story, sourcing, and science content sections.
- AC2 (sad path): Given a static content asset (e.g. an image) fails to load, When the Visitor opens the page, Then the page shell (nav/footer) still renders and only the affected region shows a fallback, rather than the whole page failing.

**Source:** Glowrie design assets — `Brand page/`; scope expansion HITL 2026-08-23

---

### UC-005: Content Operator Manages Product Catalog (Create / Read / Update / Delete / List)

**Actors:** Content Operator (primary), System (Payload CMS — existing tool)
**Trigger:** Content Operator logs into the existing Payload CMS admin panel
**Steps:**
1. Content Operator logs into Payload CMS admin (existing authentication mechanism — out of this PRD's scope).
2. Content Operator can **List** all products (Draft and Published), **Create** a new product (all §9 fields, including `purchaseUrl`), **Read** any product's full field set, **Update** any field (including setting/changing `purchaseUrl`), and **Delete**/unpublish a product.
3. Changes made in Payload CMS are reflected on the live public storefront for Published products.

**Business Rules:** Single operator role for MVP — no additional roles/permission tiers requested (CQ-11 default). Setting `purchaseUrl` is optional at creation time — a product can be Published with no `purchaseUrl` yet, in which case its Buy button shows the "Coming Soon" state (UC-003 AC3) until the Content Operator adds one later.

**State Transitions (Product lifecycle):**

| From State | Trigger | To State | Guard Conditions | Side Effects |
|---|---|---|---|---|
| (new record) | Content Operator creates a product | Draft | none | Not visible on storefront |
| Draft | Content Operator publishes | Published | Required fields complete | Appears in Home carousel and gains a working Detail page; Buy button state depends on whether `purchaseUrl` is set |
| Published | Content Operator unpublishes or deletes | Draft / Removed | none | Removed from Home carousel; direct Detail page URL shows UC-002 AC2 |

**Acceptance Criteria:**
- AC1 (Create): Given a Content Operator is logged into Payload CMS, When they create a product with all required fields and set status = Published, Then it appears in the Home carousel and has a working Detail page on next storefront page-load, with no manual deploy.
- AC2 (Read/List): Given products exist in the CMS, When the Content Operator opens the product list view, Then all products (Draft and Published) are listed with key fields visible.
- AC3 (Update): Given a Published product exists, When the Content Operator edits and saves a field (e.g. price or `purchaseUrl`), Then the storefront reflects the updated value — including the Buy button's enabled/disabled state — on next page load.
- AC4 (Delete/Unpublish): Given a Published product exists, When the Content Operator deletes it or sets it to Draft, Then it no longer appears in the Home carousel and its Detail page shows UC-002 AC2.
- AC5 (sad path — invalid input): Given the Content Operator attempts to save a product missing a required field, When they submit, Then Payload CMS's existing validation blocks the save and shows a validation error (existing CMS behavior, not custom-built for this PRD).

**Source:** `brainstorm-summary.md` §3.3, §5 Flow C; CQ-11 default; `purchaseUrl` field added per OQ-1 resolution, 2026-08-23

---

## §9. Data, Entities & Information

### Product (business entity — system of record: Payload CMS)

| Field | Type | Required | Notes |
|---|---|---|---|
| id | string/UUID | Yes | System-generated |
| sku | string | Yes | Unique product code (e.g. "GL-01") |
| name | string | Yes | |
| categoryLabel | string | No | Short overline label (e.g. "Body Cleanser") |
| price | decimal | Yes | Currency: **INR (₹)** — resolved via OQ-2 |
| size | string | No | e.g. "500ml / 16.9 fl oz" |
| description | text | Yes | Long-form marketing/product copy |
| keyActives | string / list | No | Used both as a short card subtitle and in Technical Specs |
| phLevel | string | No | e.g. "5.5 – 6.0" |
| format | string | No | e.g. "Viscous Gel" |
| fragranceTopNotes | string / list | No | Includes an implied timing window (e.g. "0–15 minutes") |
| fragranceHeartNotes | string / list | No | e.g. "15–60 minutes" |
| fragranceBaseNotes | string / list | No | e.g. "1–6 hours" |
| badge | enum (NEW, BESTSELLER, none) | No | |
| image | media reference | Yes | Product hero/card image |
| **purchaseUrl** | **string / URL** | **No** | **New field (OQ-1 resolution, 2026-08-23). External listing URL where the product is actually sold (e.g. an Amazon product page). Set per-product by the Content Operator. When empty, the storefront's Buy button shows a disabled "Coming Soon" state (see UC-003 AC3).** |
| status | enum (Draft, Published) | Yes | Controls storefront visibility — see UC-005 State Transitions |
| createdAt / updatedAt | timestamp | System | |

**Access control:** Content Operator = full CRUD via Payload CMS admin (existing auth, out of this PRD's scope). Visitor = read-only, Published products only, via the public storefront.

**Note on stock/availability (OQ-7 resolution, 2026-08-23):** No in-stock/out-of-stock field is included on Product for MVP. Since the storefront performs no in-app transaction (Buy only redirects externally, per UC-003), stock/availability tracking has no functional purpose here — the external listing (e.g. Amazon) is the authoritative source for stock status. The Buy button's only gating condition is whether `purchaseUrl` is set. This is a documented scope decision, not an oversight — see §7 Out of Scope and Parking Lot for a possible future reconsideration.

**Note on design mockup data:** The Glowrie HTML mockups use varying placeholder product names/prices/currencies for illustration only (e.g. 5 items in the Home slider, 2 different items in the Cart, 1 in Detail) — this is **not** a literal requirement for exactly those products. The real MVP catalog is a flat list of 4 real products maintained by the Content Operator. (Note: the mockups' `cart/` folder is no longer relevant to the data model — Cart/Checkout is out of scope per §7 Scope Correction.)

### Brand/About Page Content

Static marketing content (story/philosophy, sourcing, science/process sections). **Resolved (OQ-3, 2026-08-23):** confirmed not modeled as a dynamic/CMS-managed entity for MVP — content is static/developer-maintained. No PII involved anywhere in this PRD's data model — Visitor is anonymous and no personal data is collected at this scope boundary.

### Removed Entities (superseded — Cart/Checkout out of scope)

The **Cart** (system object) and **CartLineItem** entities defined in v1.0 of this PRD are **removed** as of the OQ-1 resolution (2026-08-23) — see §7 Scope Correction. They are documented here, struck from the active data model, purely for audit-trail purposes:

- ~~Cart~~ (id, lineItems, subtotal, shippingLabel, taxPlaceholder, total, timestamps) — removed.
- ~~CartLineItem~~ (productRef, quantity, unitPriceSnapshot, lineSubtotal) — removed.

No replacement transactional entity is introduced — the Buy action (UC-003) is stateless and does not create any system object.

---

## §10. Integrations

### Consumed (this storefront calls out to)

| System | Direction | Purpose | Notes |
|---|---|---|---|
| Payload CMS | Inbound read | System of record for Product data; storefront reads Published products | Existing system — already provisioned; API protocol/version is an Architect decision |
| External Product Listing (e.g. Amazon) | Outbound — browser-level redirect only | Visitor clicking "Buy" is redirected, via the Product's `purchaseUrl`, to the actual third-party listing where the product is sold | **Resolved (OQ-1, 2026-08-23).** No API integration, no data exchange, no server-to-server call — the storefront never talks to the external site; it simply opens the stored URL in a new browser tab. Broken/incorrect links are outside the storefront's control once set by the Content Operator (see §14). |

### Exposed (external clients calling in)

None. This storefront does not expose any client-facing API or webhook for MVP.

---

## §11. Error Handling & Edge Cases

| Scenario | Expected Behavior |
|---|---|
| Payload CMS/backend unreachable | Graceful degradation message on Home/Detail (CQ-12 confirmed) instead of a blank or crashed page |
| Product not found (deleted/unpublished, stale link) | Friendly "no longer available" message + link back to catalog (UC-002 AC2) |
| Product's `purchaseUrl` not yet set by Content Operator | Buy button shown disabled, labeled "Coming Soon", instead of a broken/dead link (UC-003 AC3) |
| Product's `purchaseUrl` is malformed/invalid | Treated the same as an unset URL — disabled "Coming Soon" state (UC-003 AC4) |
| Static asset (image) failure on Brand/About page | Page shell still renders; only affected region shows fallback (UC-004 AC2) |

---

## §12. Non-Functional Expectations

| Dimension | Target |
|---|---|
| **Performance** | Home page Largest Contentful Paint < 2.5s on a simulated 4G connection; carousel/detail interactions perceived latency < 200ms |
| **Scalability** | Support ≥ 500 concurrent visitors at launch; catalog expected to grow from 4 to up to ~50 products within 12 months (per CQ-6) — data model and UI must not hard-code an assumption of exactly 4 products |
| **Availability** | ≥ 99.5% uptime target (small storefront, non-mission-critical SLA) |
| **Security** | Standard OWASP Top 10 web-application practices; HTTPS enforced end-to-end; PCI-DSS is entirely out of scope — the storefront never handles payment, checkout, or cart data of any kind (Cart/Checkout removed per OQ-1 resolution, 2026-08-23); the only external interaction is a client-side redirect to a third-party listing |
| **Accessibility** | WCAG 2.1 AA target for the public storefront (icon-only nav buttons currently lack labels in the design — flag for UX Design remediation) |
| **Platform support** | Latest 2 versions of Chrome, Firefox, Safari, Edge; responsive across the design's breakpoints: 4-col mobile (<768px, 16px margins), 8-col tablet (768–1024px, 40px margins), 12-col desktop (≥1440px, 64px margins) |
| **Internationalization** | Not required for MVP — single language (English), single currency: **INR (₹)** — resolved via OQ-2, 2026-08-23 |
| **Batch/throughput** | N/A — no batch/import operations in scope for MVP |

---

## §13. UI/UX Requirements

**Design Assets:**
```
design_system: "Golden Alchemist" (see DESIGN.md in each screen folder)
  — Minimalist Editorial, luxury beauty aesthetic
  — Typography: Bodoni Moda (serif display/headline), Public Sans (body), JetBrains Mono (technical/data — prices, specs, SKUs, fragrance timings)
  — Shape language: sharp, 0-radius corners everywhere except a few decorative circular/pill elements
  — Elevation: no drop shadows — depth via tonal layering, 1px "Alchemist Gold" hairline rules, and soft frosted-glass nav blur
  — Palette: light "alabaster" surfaces, Alchemist Gold (#735c00 / #d4af37) primary accent, Champagne Gold secondary, Obsidian (#1c1b1b / #1A1A1A) for text and primary buttons
  — Theme: light only — no dark mode variant was designed
  — Responsive: fixed 12-col grid desktop / 8-col tablet / 4-col fluid mobile (see §12)

source: Local design mockups (not Figma) at /home/mohammady/Documents/learning/Glowrie
  — 4 screen folders, each containing code.html (HTML/Tailwind reference implementation),
    DESIGN.md (design system spec), and screen.png (visual reference)

screens:
  - screen: Home / Landing Page
    path: /home/mohammady/Documents/learning/Glowrie/home page/
  - screen: Product Detail
    path: /home/mohammady/Documents/learning/Glowrie/detail/
  - screen: Cart (UNUSED for MVP — see notes below; retained for possible future phase)
    path: /home/mohammady/Documents/learning/Glowrie/cart/
  - screen: Brand / About Page
    path: /home/mohammady/Documents/learning/Glowrie/Brand page/

notes: |
  - HTML files use placeholder/sample product data (varying names, prices, item counts,
    and even inconsistent currencies) purely for illustration — NOT the literal MVP
    catalog. Actual catalog is a flat list of 4 real products (see §9, §16).
  - Nav icons for search and account/person are decorative/removed for MVP (RESOLVED,
    OQ-4, 2026-08-23) — no accounts, no search in scope. The cart/bag icon is also
    removed/not applicable — Cart is fully out of scope (see §7 Scope Correction);
    do not design or implement a cart icon.
  - Currency shown inconsistently (₹ vs $) across mockups — RESOLVED to INR (₹) for
    MVP (OQ-2, 2026-08-23).
  - The `cart/` screen folder (design + code.html + DESIGN.md + screen.png) is
    retained as a design asset but is UNUSED for this MVP — Cart/Checkout was
    removed from scope during OQ resolution (see §7 Scope Correction). It remains
    available if cart/checkout scope is revisited in a future phase.
```

**Key screens/elements:** Sticky/frosted top nav (logo, Shop/Science/Ingredients/About links — search, account, and cart icons removed/not applicable for MVP, see notes above); Home hero marketing carousel (3 slides, autoplay 5s); horizontal product carousel/slider; Featured Product spotlight with a direct Buy/external-purchase-link action; trust-badge marquee ribbon; Detail page with technical specs table + fragrance-notes breakdown (top/heart/base with timing) and a Buy/external-purchase-link action; Brand/About page with static storytelling sections (sourcing, science/process). **No Cart page/screen for MVP** (Cart/Checkout removed from scope — see §7 Scope Correction). **Login screen: N/A** — no accounts/login in MVP scope, so the iTN standard/custom login decision does not apply.

**Visual style:** Flat/Minimalist Editorial — explicitly no skeuomorphism, no full glassmorphism (only a subtle frosted-glass nav blur), light theme only, sharp corners, no drop shadows.

---

## §14. Constraints, Dependencies & Risks

| Item | Type | Detail |
|---|---|---|
| Payload CMS availability | Dependency | Storefront's entire Product data layer depends on an already-provisioned Payload CMS instance being reachable |
| External purchase listing accuracy | Dependency / Risk | The storefront relies entirely on the Content Operator correctly setting and maintaining each product's `purchaseUrl` in Payload CMS; once a Visitor is redirected, a broken or incorrect external link is outside the storefront's control (§10) |
| Currency — RESOLVED | Resolved risk | Mockups showed both ₹ and $; confirmed as INR (₹) for MVP (OQ-2, 2026-08-23) |
| Catalog growth expectation | Constraint | Architecture/data model must not hard-code an assumption of exactly 4 products; flat-list UI should tolerate at least ~50 items without a redesign (CQ-6) |
| Design assets are static mockups, not a component library | Constraint | `code.html` files are HTML/Tailwind reference implementations only — Architect/UX Design must translate the design intent into the actual production tech stack (tech stack selection is out of PRD scope); note the `cart/` mockup is unused for MVP (§7, §13) |

---

## §15. Open Questions

| ID | Question | Impact if Unresolved | Status |
|---|---|---|---|
| OQ-1 | Should "Proceed to Checkout" lead to a full checkout flow (address collection + real payment gateway integration) in this MVP, or is it a stub boundary with real payment processing postponed to a later phase? | Blocked Architecture's design of the post-Cart checkout flow | **Resolved (2026-08-23)** — Major scope reversal: Cart/Checkout removed from scope entirely. Replaced by an external Buy/purchase-link redirect (see §7 Scope Correction, UC-003, §9 Product.purchaseUrl). No in-app payment or checkout logic exists in this PRD. |
| OQ-2 | What single currency should the storefront use? (Design mockups show both ₹ and $ inconsistently.) | Affected §9 Product.price field and all price displays in §13 | **Resolved (2026-08-23)** — Currency confirmed as **INR (₹)**. Updated in §9, §12, §13. |
| OQ-3 | Should marketing/static content (Hero carousel slides, Brand/About copy, trust-ribbon claims, Featured Product selection) be Payload-CMS-managed by the Content Operator, or hardcoded/developer-maintained? | Affected §9 data model scope, §10, §14 | **Resolved (2026-08-23)** — Confirmed as originally assumed: only the Product entity is Payload-CMS-managed; static marketing content is hardcoded/developer-maintained. |
| OQ-4 | Are the nav bar's search and account/person icons intentional (future functionality) or purely decorative for MVP, given no accounts or search are in scope? | Affected §13 UI/UX Requirements and UX Design phase fidelity | **Resolved (2026-08-23)** — Search and account icons are decorative/removed for MVP. Additionally, per the OQ-1 reversal, the cart/bag icon is also removed/not applicable — no cart icon is designed or implemented. |
| OQ-5 | Is there any target audience, branding, or content-tone guidance for the storefront beyond what's inferable from the provided design (premium/luxury skincare positioning)? (CQ-7, unanswered) | Low impact — affected future marketing copy tone only | **Resolved (2026-08-23)** — No additional guidance beyond what's inferable from the provided Glowrie design assets; proceed with the design as-is. |
| OQ-6 | Should the anonymous Cart persist beyond the current browser session/tab (e.g., across days on the same device)? | Affected §9 Cart entity persistence design and NFRs | **Resolved / Moot (2026-08-23)** — Cart no longer exists per the OQ-1 reversal; this question no longer applies. |
| OQ-7 | Is a maximum quantity per cart line item needed, and if so what value? (No inventory/stock tracking was requested — is unlimited stock assumed for MVP?) | Affected §8 UC-003/UC-005 acceptance criteria and §9 CartLineItem | **Resolved / Moot (2026-08-23)** — The cart-quantity-limit portion is moot; no cart exists. On the stock-tracking portion: judgment call made (not genuinely ambiguous given the redirect-only model) — no in-stock/out-of-stock field is added to Product for MVP, since the storefront performs no in-app transaction and the external listing is the authoritative stock source. Captured in §7 Parking Lot for possible future reconsideration. |

All seven Open Questions from v1.0 are now **Resolved**. No Pending or Blocked items remain in this section as of v1.1 (2026-08-23). The OQ-1 resolution constitutes a major, stakeholder-confirmed scope reversal (Cart/Checkout removed) that is reflected throughout §7, §8, §9, §10, §11, §12, §13, §14, and §16 of this document.

---

## §16. Appendix

### Domain Glossary

| Term | Definition | Source | Confirmed by user |
|---|---|---|---|
| Catalog | The complete set of Published products available on the storefront | `brainstorm-summary.md` | Yes (CQ-14 default) |
| Product | A single sellable item with name, price (₹), size, description, technical specs, fragrance notes, and an external purchase URL | `brainstorm-summary.md` + Glowrie design assets | Yes (CQ-14 default; fields superseded per scope expansion, then per OQ-1 reversal, 2026-08-23) |
| Content Operator | The person who creates/edits/publishes/deletes products (including their external purchase URL) via the Payload CMS admin panel | `brainstorm-summary.md` | Yes (CQ-14 default) |
| Visitor | An anonymous, unauthenticated person browsing the storefront | `brainstorm-summary.md` | Yes (CQ-14 default) |
| Buy / External Purchase Link | The button on the Detail page and Home Featured Product spotlight that redirects a Visitor, in a new tab, to the external site where the product is actually sold | OQ-1 resolution, 2026-08-23 | Yes — resolved directly by stakeholder |
| SKU | Product code shown on catalog cards (e.g. "GL-01") | Glowrie design assets — `home page/` | Yes (CQ-14 default — agent-inferred) |
| Fragrance Notes (Top/Heart/Base) | The scent profile breakdown of a product over time — Top (0–15 min), Heart (15–60 min), Base (1–6 hrs) | Glowrie design assets — `detail/` | Yes (CQ-14 default — agent-inferred) |
| Brand/About Page | Static marketing page telling the brand's story, sourcing, and science/process | Glowrie design assets — `Brand page/` | Yes (CQ-14 default — agent-inferred, scope-expansion term) |

**Removed terms (audit trail — no longer part of the active product):** *Cart*, *Line Item*, and *Checkout* were defined in v1.0 of this PRD when Cart/Checkout was in scope. They were removed per the OQ-1 resolution (2026-08-23) — see §7 Scope Correction, §9 Removed Entities. Retained here only for traceability, not as active domain terms.

### References

- `docs/brainstorm-summary.md` — original brainstorm, approved 2026-08-22
- Glowrie design assets — `/home/mohammady/Documents/learning/Glowrie/{home page, detail, cart, Brand page}/` (code.html + DESIGN.md + screen.png per screen) — source of truth for UI and Product field structure; passed to UX Design and Architect phases as-is. **Note:** the `cart/` asset is unused for this MVP (Cart/Checkout removed from scope, OQ-1 resolution 2026-08-23) — retained for a possible future phase.
- No JIRA/SOW/NPI/supplementary documents were provided for this session (CQ-2: skip)

---

## §17. Revision History

| Version | Date | Changed By | Sections Changed | Summary of Changes |
|---|---|---|---|---|
| 0.1 | 2026-08-22 | Harvey AI | §1 only | Initial stub created from approved brainstorm-summary.md; 14 clarifying questions issued |
| 1.0 | 2026-08-23 | Harvey AI | All sections | Phase 1 resumed with relayed CQ-1..CQ-14 answers; incorporated stakeholder-approved scope expansion (Cart/Checkout-entry, Brand/About page, richer Product entity, 4 screens) driven by real Glowrie design assets; full 16-section PRD authored; 7 new non-blocking Open Questions raised (OQ-1..OQ-7) |
| 1.1 | 2026-08-23 | Harvey AI | §1, §2, §3, §4, §5, §6, §7, §8, §9, §10, §11, §12, §13, §14, §15, §16 | Resolved all 7 v1.0 Open Questions (OQ-1..OQ-7). Major scope reversal (OQ-1): Cart/Checkout removed entirely, replaced with an external Buy/purchase-link redirect model; former UC-003–UC-007 removed, new UC-003 added, remaining use cases renumbered; Cart/CartLineItem entities removed; new Product.purchaseUrl field added. Currency resolved to INR (₹) (OQ-2). CMS scope confirmed as Product-only (OQ-3). Nav search/account/cart icons confirmed decorative/removed (OQ-4). No additional branding guidance (OQ-5). Cart-persistence and cart-quantity-limit questions rendered moot (OQ-6, OQ-7); stock-tracking judgment call made (no stock field added for MVP). §15 fully resolved — no Pending/Blocked items remain. |
