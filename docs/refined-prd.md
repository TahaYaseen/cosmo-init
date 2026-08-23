# Refined PRD — Glowrie Product Catalog Storefront

## §1. Basic Information

| Field | Value |
|---|---|
| Project Name | Product Catalog Storefront — "Glowrie" ("Cosmo Init") |
| JIRA ID | N/A (no JIRA ticket — direct brainstorm → PRD flow) |
| Product Type | Greenfield web application (public e-commerce storefront) |
| Priority | TBD (not specified by stakeholder) |
| Target Release | Full build, single release — not time-boxed to a sprint cadence (see §7) |
| Date | 2026-08-23 |
| Version | 2.1 (Revision — post-Architecture/Development-Plan amendment adding UC-006 Visitor Analytics/Tracking Logging; supersedes v2.0) |

### Create Table

| Created By | Date |
|---|---|
| Harvey AI | 2026-08-23 |
| Mohammad Taha | 2026-08-22 |

### Sign-Off

| Role | Approver Name | Status |
|---|---|---|
| PM | Mohammad Taha (2026-08-23) | Approved |
| Engineering Lead | Mohammad Taha (2026-08-23) | Approved |
| Design | Mohammad Taha (2026-08-23) | Approved |

> Solo project — sole stakeholder approved across all 3 required roles (PM, Engineering Lead, Design) per gate policy `allowSameApproverForMultipleRoles: true`. v2.1 revision re-approved 2026-08-23.

> This document refines the approved `initial-prd.md` (v1.1, approved 2026-08-23) into `refined-prd.md` per Harvey PRD Phase 2. Context refresh (re-checked Jira/MCP — none configured; supplementary docs — none new; codebase — still pure greenfield, no application code exists yet; design assets at `/home/mohammady/Documents/learning/Glowrie` — unchanged since Phase 1, all four screen folders verified byte-identical `DESIGN.md`) found **no new information** since Phase 1 approval. Because `build_scope: full` was already confirmed in Phase 1 (not a timeline-boxed MVP), Phase 2 scope refinement is a confirmation pass rather than a phasing exercise — see §7. `[ASSUMPTION: all 5 use cases ship together as a single full release, matching the already-confirmed build_scope=full and continuing the existing Phase 1 direction. No signal was given to sequence delivery into phases. Flagged in §15 OQ-8 for explicit stakeholder acknowledgement before Architect handoff.]`
>
> **v2.1 REVISION NOTICE (2026-08-23):** After Architecture (`architecture.md`) and Development Plan (`development-plan.md`) were already approved, the stakeholder raised a new requirement — server-side visitor analytics/tracking logging for marketing attribution — that was not part of v1.1/v2.0 scope. This revision adds **UC-006** (§8), a new `visitor_logs` system entity (§9), DPDP Act compliance considerations and a footer privacy notice requirement (§12, §13), and two new non-blocking Open Questions (§15 OQ-9, OQ-10) plus a Domain-Expert-Review flag (OQ-11). **Source: verbal addition — not traceable to any prior source document (Jira/SOW/brainstorm); user-requested revision, 2026-08-23.** Architecture and Development Plan must be updated once this revision is approved. Sign-Off remains Pending until content is reviewed and approved.

---

## §2. Executive Summary

Glowrie is a real, live, public-facing product catalog/storefront for a premium skincare/beauty brand, refined here into its release-ready form. Visitors browse a curated catalog on a Home page and view rich product detail (formulation specs, fragrance notes, pricing in INR) — with no accounts, no in-app cart, and no in-app checkout of any kind. Each product's Detail page (and the Home page's Featured Product spotlight) offers a **Buy** button that redirects the Visitor off-site, in a new tab, to wherever the product is actually sold, via a per-product external purchase URL that the Content Operator sets in the existing Payload CMS admin panel. A single Content Operator maintains the entire product catalog through Payload CMS, with zero custom admin tooling required. The MVP starts with a small flat catalog of 4 products but is explicitly designed to grow. All six confirmed use cases (Browse, Detail, Buy-redirect, Brand/About, Content Operator CMS management, and — added in this v2.1 revision — passive server-side Visitor Analytics/Tracking Logging) are scoped for a single full release under `build_scope: full` — there is no MVP/Phase-2 split within this document; the true phasing boundary is the one already drawn in §7 Out of Scope (Cart/Checkout, accounts, search/filtering, custom admin, and stock tracking are deferred to a future product phase, not this release). The expected business impact is a durable, low-risk storefront foundation — a real product discovery experience that hands off the actual transaction to an existing, trusted external sales channel, while quietly capturing marketing/traffic-attribution data (IP, geolocation, referrer, UTM parameters) in a dedicated Supabase log table for future analysis — that can grow in scope (in-app purchasing, accounts, search/filtering, visitor-data reporting) once this discovery-first release proves out.

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

"Done" for this release means: a Visitor can complete the full **Browse → Detail → Buy (external redirect)** journey for every catalog product with a set purchase URL, the Brand/About page is reachable, and the Content Operator can independently manage the catalog — including each product's external purchase URL — end-to-end via Payload CMS.

---

## §6. Users & Personas

| Persona | Description | Goals | Pain Points |
|---|---|---|---|
| **Visitor / Shopper** | Anonymous public visitor browsing the storefront; no account, no login | Discover products, understand formulation/fragrance detail, and follow a clear path to buy the product on the external site where it's actually sold | No current storefront exists at all; cannot currently browse, evaluate, or find where to buy any product |
| **Content Operator** | The person maintaining the product catalog | Add/edit/publish/unpublish products and their full field set via the existing Payload CMS admin panel, without needing engineering help or a custom admin UI | No current customer-facing surface exists to see the impact of catalog changes; needs confidence that CMS edits go live reliably |

No org-published persona list was found to check against (greenfield project, no existing product wiki) — both personas are net-new and should be added to any future master persona list. Unchanged from `initial-prd.md`.

---

## §7. Scope

**`build_scope: full`** — confirmed in Phase 1 (CQ-8). All requirements captured in this PRD are in scope for a **single full release**. Because this is not a timeline-boxed MVP build, Phase 2 does not apply MVP/Phase-2 tagging to §8 use cases — every use case below ships together in this release. The real phase boundary in this product is the one already drawn below in "Out of Scope (Deferred)": those items are deferred to a **future product phase**, not staged within this release.

**Phase 2 confirmation (`[ASSUMPTION:]` — see §15 OQ-8):** All 5 originally-confirmed use cases (UC-001 through UC-005) ship together as this single release, carrying forward the `build_scope=full` decision from Phase 1 unchanged. No stakeholder input requested resequencing any use case into a later phase. This is a safe-default continuation of already-approved direction, not a new scope decision — flagged for final acknowledgement in §15, not blocking this document's completion.

**v2.1 addition:** UC-006 (Visitor Analytics/Tracking Logging) is added to this release under the same `build_scope: full` policy — it ships alongside UC-001–UC-005, not as a separate phase. It is a passive, invisible, server-side capability (no Visitor-facing feature beyond the footer privacy notice) and does not alter the Critical Path Journey.

### Scope Expansion Lineage (mandatory context — carried forward unchanged from `initial-prd.md` v1.1 — do not re-litigate)

`brainstorm-summary.md` originally scoped this as a **browse-only, 2-screen, name+image-only** catalog (its §3 Core Features and §8 assumptions #1–#3). During the PRD session, the stakeholder shared real design assets (`/home/mohammady/Documents/learning/Glowrie` — Home, Detail, Cart, Brand/About) that revealed a materially larger real design. This was surfaced directly to the stakeholder and explicitly resolved via a HITL gate on 2026-08-23:

1. **[SUPERSEDED 2026-08-23 — see "Scope Correction" below]** ~~Cart / Checkout-entry is now IN SCOPE~~ — superseded; see Scope Correction.
2. **Brand/About page is now IN SCOPE** (stakeholder: "yes part of mvp") — a 4th, purely static, marketing/storytelling screen.
3. **Product entity is richer than name+image** — per the Detail page design, Product now includes price, size/volume, description, technical specs (pH level, format, key actives), and fragrance notes (top/heart/base notes).
4. **Screen count is 4** (Home, Detail, Cart [unused], Brand/About).

### Scope Correction — Cart/Checkout Removed (resolved 2026-08-23, carried forward unchanged)

1. **Cart and Checkout are removed from scope entirely.** No add-to-cart action, no Cart entity, no Cart page/screen, no checkout flow — the entire Cart/Checkout use-case family (former UC-003 through UC-007 in v1.0) is removed from this PRD.
2. **Replacement model — external purchase redirect.** The Product Detail page and the Home page's Featured Product spotlight instead show a **Buy** button that redirects the Visitor off-site, in a new tab (see UC-003).
3. **New Product field** `purchaseUrl`, set per-product by the Content Operator via Payload CMS.
4. **Design asset status.** The `cart/` screen design asset is **out of scope / unused** for this release — retained in case Cart/Checkout scope is revisited in a future phase (Parking Lot below).

### In Scope (this release — all confirmed for single full release)

- Public Home/landing page with a product carousel showing all Published catalog products (currently 4), a marketing hero carousel, a trust-badge ribbon, and a single Featured Product spotlight with a direct Buy/external-purchase-link action
- Product Detail page showing the full Product field set (name, price in INR, size, description, technical specs, fragrance notes) and a Buy/external-purchase-link action
- Buy button behavior: clicking Buy opens the product's Content-Operator-set external purchase URL in a new browser tab; if no URL is set yet, the Buy button shows a disabled "Coming Soon" state instead (see UC-003)
- Brand/About page: static brand story, sourcing, and science/process content
- Anonymous browsing — no accounts, no login, no sign-up, no cart of any kind
- Content management entirely via the existing Payload CMS admin panel — no custom admin UI is built
- A flat, uncategorized product list for this release (no categories/tags/search/filtering) — see forward-looking note below
- **(v2.1)** Passive, server-side visitor analytics/tracking logging — every storefront page view is logged (IP address, geolocation, timestamp, user agent, referrer, landing page path, UTM parameters) to a dedicated `visitor_logs` table in Supabase, for marketing attribution/traffic analysis; a minimal footer privacy notice is shown on every page (see UC-006, §9, §12, §13)

### Out of Scope (Deferred — carried forward unchanged, this is the real phasing boundary for this product)

| Item | Reason |
|---|---|
| Cart / Checkout (all forms) — add-to-cart, cart page, quantity/remove management, checkout entry point, and any real payment gateway/processor integration | **Deferred — Reason:** Stakeholder reversed the earlier Cart/Checkout-in-scope decision during Phase 1 OQ resolution (2026-08-23) — see §7 Scope Correction. Replaced by a simple external Buy/purchase-link redirect (UC-003). The `cart/` design asset is retained, unused, for a possible future phase. |
| User accounts (sign-up/login/wishlist/favorites) | Deferred — Reason: stakeholder confirmed release is fully anonymous browsing; no account-gated feature was requested. |
| Categories / tags / filtering / search | Deferred — Reason: catalog is a small flat list (4 products) for this release; no categorization requested. Catalog is expected to grow beyond a flat list in the future — architecture should not hard-code a "flat list of exactly 4" assumption (see §14). |
| Custom internal admin UI | Deferred — Reason: Payload CMS's built-in admin panel is sufficient; no additional admin tooling requested (single Content Operator role, no additional roles). |
| CMS management of marketing/static content (Hero slides, Brand/About copy, trust-ribbon claims, Featured Product selection) | Deferred — Reason: only the Product entity is Payload-CMS-managed; marketing content is static/developer-maintained. |
| Product-level in-stock / out-of-stock indicator | Deferred — Reason: since the storefront never processes an in-app transaction (Buy only redirects externally), stock/availability tracking has no functional purpose; the Buy button's only gating condition is whether `purchaseUrl` is set (see §9, UC-003). |

### Parking Lot (carried forward unchanged)

| Idea | Raised by | Why not in this PRD | Category |
|---|---|---|---|
| Catalog growth beyond a flat list (categories/tags/pagination) | Stakeholder | Explicitly forward-looking; flat list of 4 is the confirmed starting point | future-phase-same-product |
| Multi-role / additional operator permissions | Stakeholder (default applied) | No additional roles requested | future-phase-same-product |
| Cart / Checkout / real payment processing | Stakeholder (Phase 1 OQ-1 resolution) | Reversed from in-scope to fully out-of-scope in favor of an external-redirect Buy model; the `cart/` design asset is retained unused | future-phase-same-product |
| Product-level in-stock/out-of-stock indicator (Content-Operator managed) | Harvey AI judgment call (Phase 1 OQ-7 resolution) | Not needed since there is no in-app transaction to gate; could be added later | nice-to-have |

### Critical Path Journey (formalized for release planning)

**Visitor:** Home (browse carousel) → Detail (view full product) → Click Buy → redirected to external purchase listing in a new tab. This is the single most important journey that proves core value and should be the first vertical slice built (UC-001 → UC-002 → UC-003), with UC-004 (Brand/About) and UC-005 (Content Operator CMS management) as parallel/supporting workstreams within the same release. **UC-006 (Visitor Analytics/Tracking Logging) runs invisibly alongside every step of this journey — it does not alter or gate the journey itself.**

**Content Operator:** Log into Payload CMS admin → Create/Edit a product record → Set status = Published → Change is live on the public storefront with no deploy. This journey must exist before the Visitor journey can be meaningfully tested end-to-end (content must exist to browse).

### Complexity Assessment (for release planning)

**(v2.1)** 6 use cases, 2 personas, 1 core CMS-managed entity (Product) plus static content plus 1 system-generated log entity (`visitor_logs`, direct Supabase table — not Payload-managed), no external API integrations beyond the CMS read, a browser-level redirect, and platform-native geolocation headers (Vercel), no authentication/authorization system to build (Payload CMS's existing auth is out of scope), no payment processing. This remains a low-to-moderate complexity release — the majority of engineering effort is in the frontend presentation layer (4 screens), CMS schema/field configuration, and a lightweight server-side logging middleware/route handler with a scheduled retention/purge job, not in complex backend business logic.

---

## §8. Use Cases

All 6 use cases below are confirmed for this single full release (`build_scope: full` — no MVP/Phase-2 tagging within this document). UC-001 through UC-005 are carried forward from `initial-prd.md` v1.1 unchanged except for the release-framing language. **UC-006 is new in v2.1** — a stakeholder-requested revision added after Architecture and Development Plan were already approved (source: verbal addition, not traceable to any prior source document).

### End-to-End Flows (Adaptive Section)

**Critical Path Journey — Visitor:** Home (browse carousel) → Detail (view full product) → Click Buy → redirected to external purchase listing in a new tab (this release ends here; no in-app cart or checkout). UC-006 logs every page view along this journey invisibly, in parallel — it is not a step in the journey itself.

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

**Business Rules:** This is a simple external redirect only — the storefront performs no purchase, payment, or order-tracking logic of any kind. Availability of the Buy action depends solely on whether the Content Operator has set a `purchaseUrl` for that product (see §9) — no stock/inventory check is performed.

**Acceptance Criteria:**
- AC1: Given a Published product has a non-empty `purchaseUrl`, When a Visitor clicks "Buy" on its Detail page, Then that exact URL opens in a new browser tab and the storefront tab is unaffected.
- AC2: Given a product is featured on the Home page and has a non-empty `purchaseUrl`, When a Visitor clicks "Buy" on the Featured Product spotlight, Then the same redirect behavior as AC1 occurs.
- AC3 (sad path — purchase URL not yet set): Given a Published product's `purchaseUrl` is empty/not yet set by the Content Operator, When a Visitor views that product (Detail page or Home Featured Product), Then the Buy button is shown in a disabled state labeled "Coming Soon" instead of being clickable, and no navigation occurs if interacted with.
- AC4 (sad path — malformed URL): Given a Content Operator has entered a value in `purchaseUrl` that is not a valid absolute URL, When a Visitor views that product, Then the system treats it the same as AC3 (disabled "Coming Soon" state) rather than attempting a broken redirect. `[Recommendation: Payload CMS field-level URL validation should prevent this at entry time — an Architect/CMS-config concern, not a PRD scope item.]`

**Source:** Stakeholder OQ-1 resolution, Phase 1, 2026-08-23 (Cart/Checkout removed; replaced by this external-redirect Buy model)

---

### UC-004: View Brand / About Page

**Actors:** Visitor
**Trigger:** Visitor clicks the "About" (Brand) navigation link
**Steps:**
1. Visitor clicks the Brand/About navigation link.
2. System displays the static Brand/About page (brand story/philosophy, sourcing, science/process sections).

**Business Rules:** Brand/About page content is static marketing copy for this release, not CMS-managed.

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

**Business Rules:** Single operator role for this release — no additional roles/permission tiers requested. Setting `purchaseUrl` is optional at creation time — a product can be Published with no `purchaseUrl` yet, in which case its Buy button shows the "Coming Soon" state (UC-003 AC3) until the Content Operator adds one later.

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

**Source:** `brainstorm-summary.md` §3.3, §5 Flow C; `purchaseUrl` field added per Phase 1 OQ-1 resolution

---

### UC-006: Visitor Analytics/Tracking Logging (Passive, Server-Side) — **NEW in v2.1**

**Actors:** System (primary — fully automated, no human actor initiates this use case); Visitor (indirect subject — the person whose page view is logged, but who takes no action to trigger it beyond simply visiting)
**Trigger:** A Visitor's browser requests any storefront page (Home, Detail, or Brand/About)
**Steps:**
1. Visitor's browser requests a storefront page (this is simply the normal act of browsing — UC-001, UC-002, or UC-004).
2. On the server side, System captures request metadata as part of handling that page request: source IP address, geolocation (country/city, derived from Vercel's platform-provided geolocation headers — `x-vercel-ip-country`, `x-vercel-ip-city`), timestamp, user agent string, referrer (if present), the requested landing page path, and UTM query parameters (if present: source, medium, campaign, term, content).
3. System writes one row capturing this metadata to a dedicated `visitor_logs` table in Supabase Postgres — this write happens without perceptibly delaying or blocking the page response returned to the Visitor.
4. No UI element, confirmation, or visible change is presented to the Visitor as a result of this logging — it is entirely passive and invisible, aside from the footer privacy notice (see AC7) that is present on every page regardless of any single visit.

**Business Rules:**
- Logging occurs for every storefront page view (Home, Detail, Brand/About) — it is not opt-in and not a Visitor-facing feature; it is a passive marketing/traffic-attribution capability.
- Logging must never block, delay, or fail the actual page render for the Visitor. If the log write fails for any reason, the page must still render normally for the Visitor (see AC6).
- Geolocation is derived exclusively from Vercel's platform-provided request headers — no third-party GeoIP API/service call is made.
- `visitor_logs` is a direct Supabase/Postgres table, written to independently of the Payload CMS collection layer — it is **not** a Payload CMS collection and is not managed through the Payload admin panel.
- This is a write-only/append-only capability for this release — no in-app reporting dashboard, admin UI, or query interface is being built to surface this data (any authorized review happens via direct Supabase console/SQL access outside this product's UI — see Parking Lot).
- Rows older than the confirmed retention period (default: 180 days — pending final confirmation, see §15 OQ-10) are automatically purged by a scheduled process.

**Acceptance Criteria:**
- AC1 (happy path — full capture): Given a Visitor requests any storefront page (Home, Detail, or Brand/About), When the request is served, Then the system writes one row to `visitor_logs` capturing IP address, timestamp, user agent, referrer (if present), landing page path, and UTM parameters (if present), without perceptibly delaying the page response to the Visitor.
- AC2 (geolocation available): Given Vercel's geolocation headers (`x-vercel-ip-country`, `x-vercel-ip-city`) are present on the incoming request, When the system logs the visit, Then the country and city values from those headers are stored on the log row.
- AC3 (sad path — geolocation unavailable): Given Vercel's geolocation headers are absent, empty, or unavailable (e.g., a local development environment, or any request that does not pass through Vercel's edge network), When the system logs the visit, Then the log row is still written, with country and city stored as null/unknown, rather than the log write failing or the page render being blocked.
- AC4 (sad path — no referrer): Given a Visitor navigates directly to a storefront page with no referrer header present (e.g., a typed URL or bookmark), When the system logs the visit, Then the referrer field is stored as null/empty rather than causing a logging error.
- AC5 (sad path — no UTM parameters): Given the incoming request has no UTM query parameters, When the system logs the visit, Then the UTM fields are stored as null/empty — this is the normal, expected case for organic (non-campaign) traffic, not treated as an error condition.
- AC6 (sad path — logging failure must never affect the Visitor): Given the write to `visitor_logs` fails for any reason (e.g., the Supabase database is temporarily unreachable), When a Visitor requests a storefront page, Then the page still renders normally for the Visitor with no visible error, delay, or degraded experience — the logging failure is handled silently server-side (e.g., surfaced only to server-side error tracking/logs) and never surfaces to the Visitor.
- AC7 (privacy notice visibility): Given a Visitor loads any storefront page, When they view the page footer, Then a minimal privacy notice is visible, acknowledging that visit data (IP address and related technical details) is logged for marketing/traffic-analysis purposes. `[Exact wording pending stakeholder confirmation — see §15 OQ-9; no cookie-consent banner is required, since this is passive server-side logging, not client-side cookies or tracking scripts.]`
- AC8 (retention/auto-purge): Given a `visitor_logs` row is older than the confirmed retention period (default: 180 days, pending confirmation — see §15 OQ-10), When the scheduled retention/purge process runs, Then that row is permanently deleted from the table.

**Test coverage:** None (new use case, greenfield — no existing code/tests to reference; this is the baseline requirement for future automated test authoring).

**Source:** Verbal addition — stakeholder-requested revision, 2026-08-23, raised after Architecture (`architecture.md`) and Development Plan (`development-plan.md`) were already approved. Not traceable to `initial-prd.md`, `brainstorm-summary.md`, or any JIRA/SOW. User's verbatim request: *"include to have source of truth table in backend to capture the users details in db like ip, and other details to track users landing on our website for marketing and tracking."*

---

## §9. Data, Entities & Information

UC-001 through UC-005 entities are carried forward unchanged from `initial-prd.md` v1.1. **v2.1 adds the `visitor_logs` system entity below (new — supports UC-006).**

### Product (business entity — system of record: Payload CMS)

| Field | Type | Required | Notes |
|---|---|---|---|
| id | string/UUID | Yes | System-generated |
| sku | string | Yes | Unique product code (e.g. "GL-01") |
| name | string | Yes | |
| categoryLabel | string | No | Short overline label (e.g. "Body Cleanser") |
| price | decimal | Yes | Currency: **INR (₹)** |
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
| **purchaseUrl** | **string / URL** | **No** | External listing URL where the product is actually sold (e.g. an Amazon product page). Set per-product by the Content Operator. When empty, the storefront's Buy button shows a disabled "Coming Soon" state (see UC-003 AC3). |
| status | enum (Draft, Published) | Yes | Controls storefront visibility — see UC-005 State Transitions |
| createdAt / updatedAt | timestamp | System | |

**Access control:** Content Operator = full CRUD via Payload CMS admin (existing auth, out of this PRD's scope). Visitor = read-only, Published products only, via the public storefront.

**Note on stock/availability:** No in-stock/out-of-stock field is included on Product for this release. Since the storefront performs no in-app transaction (Buy only redirects externally, per UC-003), stock/availability tracking has no functional purpose here — the external listing (e.g. Amazon) is the authoritative source for stock status. The Buy button's only gating condition is whether `purchaseUrl` is set. This is a documented scope decision, not an oversight — see §7 Out of Scope and Parking Lot for a possible future reconsideration.

**Note on design mockup data:** The Glowrie HTML mockups use varying placeholder product names/prices/currencies for illustration only — not a literal requirement for exactly those products. The real catalog for this release is a flat list of 4 real products maintained by the Content Operator.

### visitor_logs (system-generated log entity — **NEW in v2.1**, direct Supabase/Postgres table, NOT a Payload CMS collection)

Supports UC-006. This is an append-only operational/log object, distinct from the Product business entity — it is written directly to Supabase Postgres, bypassing the Payload CMS collection layer entirely.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | System-generated, primary key |
| ipAddress | string | Yes | **[PII]** Visitor's source IP address |
| countryCode | string | No | **[PII]** Derived from Vercel's `x-vercel-ip-country` header; null/unknown if unavailable (see UC-006 AC3) |
| city | string | No | **[PII]** Derived from Vercel's `x-vercel-ip-city` header; null/unknown if unavailable (see UC-006 AC3) |
| timestamp | timestamp | Yes | Time of the page request; defaults to server request time |
| userAgent | string | No | Raw User-Agent header from the request |
| referrer | string | No | Raw Referer header; null/empty for direct navigation (UC-006 AC4) |
| landingPagePath | string | Yes | The storefront path requested (e.g. `/`, `/product/gl-01`, `/about`) |
| utmSource | string | No | From `utm_source` query parameter, if present |
| utmMedium | string | No | From `utm_medium` query parameter, if present |
| utmCampaign | string | No | From `utm_campaign` query parameter, if present |
| utmTerm | string | No | From `utm_term` query parameter, if present |
| utmContent | string | No | From `utm_content` query parameter, if present |
| createdAt | timestamp | System | Row insert time |

**System Objects (Adaptive Section):**
- **What the system generates:** One `visitor_logs` row per storefront page view (Home, Detail, Brand/About).
- **Creation trigger:** Automatic, server-side, on every qualifying page request — no Visitor or Content Operator action creates this object directly.
- **Queryable:** Yes, but only via direct Supabase console/SQL access for this release — no in-app admin UI or reporting dashboard is built to query `visitor_logs` (Parking Lot item for a future phase).
- **Deletable:** Yes — rows are deleted only by the automated retention/purge job once they exceed the confirmed retention period (default 180 days, pending confirmation — §15 OQ-10), or manually by an authorized operator with direct database access. No in-app delete action exists.

**Access control:** Write-only via the server-side logging middleware/route handler (fully automated — no Visitor-facing or Content-Operator-facing UI creates, edits, or views these rows in-app). Read access is limited to direct Supabase console/SQL access for authorized marketing/ops personnel outside this product's UI. No update operations are ever performed on existing rows (strictly append-only). Delete occurs only via the scheduled retention/purge job (or ad hoc by an authorized operator with direct database access).

**PII / Compliance note:** `ipAddress`, `countryCode`, and `city` are tagged **[PII]** — under India's Digital Personal Data Protection Act (DPDP Act, 2023), IP address and derived geolocation can constitute personal data since they are technical identifiers capable of being linked to an individual. This corrects the earlier v1.1/v2.0 statement that "no personal data is collected" — that statement is now superseded for the `visitor_logs` entity only; it remains true for the Product entity and all other data in this PRD. See §12 for the corresponding compliance/NFR requirements and §15 OQ-9/OQ-10/OQ-11 for open confirmation items.

### Brand/About Page Content

Static marketing content (story/philosophy, sourcing, science/process sections). Confirmed not modeled as a dynamic/CMS-managed entity — content is static/developer-maintained. **(v2.1 correction)** No PII is involved in the Product or Brand/About data — the Visitor remains anonymous for browsing/Buy-redirect purposes (UC-001–UC-004) and no personal data is collected as part of those use cases. The only PII in this PRD's data model is the IP-address/geolocation data captured passively by UC-006 in the new `visitor_logs` entity above — the Visitor is not asked to identify themselves, and no account or profile is created or associated with this data.

### Removed Entities (superseded — Cart/Checkout out of scope)

The **Cart** and **CartLineItem** entities defined in v1.0 of `initial-prd.md` are removed. Documented here purely for audit-trail purposes:

- ~~Cart~~ (id, lineItems, subtotal, shippingLabel, taxPlaceholder, total, timestamps) — removed.
- ~~CartLineItem~~ (productRef, quantity, unitPriceSnapshot, lineSubtotal) — removed.

No replacement transactional entity is introduced — the Buy action (UC-003) is stateless and does not create any system object.

---

## §10. Integrations

UC-001–UC-005 integrations are carried forward unchanged from `initial-prd.md` v1.1. **v2.1 adds a platform-level dependency (row 3 below) to support UC-006.**

### Consumed (this storefront calls out to)

| System | Direction | Purpose | Notes |
|---|---|---|---|
| Payload CMS | Inbound read | System of record for Product data; storefront reads Published products | Existing system — already provisioned; API protocol/version is an Architect decision |
| External Product Listing (e.g. Amazon) | Outbound — browser-level redirect only | Visitor clicking "Buy" is redirected, via the Product's `purchaseUrl`, to the actual third-party listing where the product is sold | No API integration, no data exchange, no server-to-server call — the storefront never talks to the external site; it simply opens the stored URL in a new browser tab. Broken/incorrect links are outside the storefront's control once set by the Content Operator (see §14). |
| **(v2.1)** Vercel platform geolocation headers (`x-vercel-ip-country`, `x-vercel-ip-city`) | Inbound — platform-provided request metadata, not a network call | Supports UC-006 — provides country/city for `visitor_logs` without a third-party GeoIP API | Not an external API integration — these are request headers automatically populated by Vercel's edge network in production. Unavailable in non-Vercel environments (e.g. local dev) — see UC-006 AC3 sad path. No third-party GeoIP service is called. |

### Exposed (external clients calling in)

None. This storefront does not expose any client-facing API or webhook for this release.

---

## §11. Error Handling & Edge Cases

UC-001–UC-005 rows are carried forward unchanged from `initial-prd.md` v1.1. **v2.1 adds the last four rows below to support UC-006.**

| Scenario | Expected Behavior |
|---|---|
| Payload CMS/backend unreachable | Graceful degradation message on Home/Detail instead of a blank or crashed page |
| Product not found (deleted/unpublished, stale link) | Friendly "no longer available" message + link back to catalog (UC-002 AC2) |
| Product's `purchaseUrl` not yet set by Content Operator | Buy button shown disabled, labeled "Coming Soon", instead of a broken/dead link (UC-003 AC3) |
| Product's `purchaseUrl` is malformed/invalid | Treated the same as an unset URL — disabled "Coming Soon" state (UC-003 AC4) |
| Static asset (image) failure on Brand/About page | Page shell still renders; only affected region shows fallback (UC-004 AC2) |
| **(v2.1)** Vercel geolocation headers absent/unavailable when logging a page view | `visitor_logs` row still written, with country/city stored as null/unknown (UC-006 AC3) |
| **(v2.1)** No referrer header present on a page request | `visitor_logs.referrer` stored as null/empty; not treated as an error (UC-006 AC4) |
| **(v2.1)** No UTM query parameters present on a page request | `visitor_logs` UTM fields stored as null/empty; expected for organic traffic (UC-006 AC5) |
| **(v2.1)** `visitor_logs` write to Supabase fails | Page still renders normally for the Visitor; failure is handled silently server-side only, never surfaced to the Visitor (UC-006 AC6) |

---

## §12. Non-Functional Expectations

Rows 1–8 are carried forward unchanged from `initial-prd.md` v1.1. **v2.1 adds the Compliance & Privacy row and amends Security below to support UC-006.**

| Dimension | Target |
|---|---|
| **Performance** | Home page Largest Contentful Paint < 2.5s on a simulated 4G connection; carousel/detail interactions perceived latency < 200ms |
| **Scalability** | Support ≥ 500 concurrent visitors at launch; catalog expected to grow from 4 to up to ~50 products within 12 months — data model and UI must not hard-code an assumption of exactly 4 products |
| **Availability** | ≥ 99.5% uptime target (small storefront, non-mission-critical SLA) |
| **Security** | Standard OWASP Top 10 web-application practices; HTTPS enforced end-to-end; PCI-DSS is entirely out of scope — the storefront never handles payment, checkout, or cart data of any kind; the only external interaction is a client-side redirect to a third-party listing. **(v2.1)** `visitor_logs` PII fields (`ipAddress`, `countryCode`, `city`) must be protected with the same access-control rigor as any personal data at rest — no client-side/browser exposure of this table or its contents at any point. |
| **Accessibility** | WCAG 2.1 AA target for the public storefront (icon-only nav buttons currently lack labels in the design — flag for UX Design remediation) |
| **Platform support** | Latest 2 versions of Chrome, Firefox, Safari, Edge; responsive across the design's breakpoints: 4-col mobile (<768px, 16px margins), 8-col tablet (768–1024px, 40px margins), 12-col desktop (≥1440px, 64px margins) |
| **Internationalization** | Not required for this release — single language (English), single currency: INR (₹) |
| **Batch/throughput** | N/A — no batch/import operations in scope, except the scheduled `visitor_logs` retention/purge job (v2.1) — expected volume is low (a few hundred to low-thousands of rows/day for this catalog's traffic scale) |
| **Compliance & Privacy** — **NEW in v2.1** | Since this storefront targets India (INR currency, DPDP-Act jurisdiction), `visitor_logs`' IP address and geolocation fields are treated as personal data under India's Digital Personal Data Protection Act (DPDP Act, 2023). Requirements: (1) a minimal footer privacy notice must be shown on every storefront page acknowledging that visit data is logged for marketing/traffic-analysis purposes (UC-006 AC7) — no cookie-consent banner is required since this is passive server-side logging, not client-side cookies/tracking scripts; (2) a default 180-day rolling retention period with automated purge applies to `visitor_logs` (UC-006 AC8) rather than indefinite storage. **Both the exact privacy-notice wording and the 180-day retention default are flagged as non-blocking Open Questions pending explicit stakeholder/legal confirmation — see §15 OQ-9, OQ-10, OQ-11.** |

---

## §13. UI/UX Requirements

Carried forward unchanged from `initial-prd.md` v1.1 — re-verified against the design asset files during Phase 2 context refresh (all four screen folders confirmed present and unchanged: `home page/`, `detail/`, `Brand page/`, `cart/` [unused]).

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
  — Re-verified unchanged during Phase 2 context refresh (2026-08-23): all DESIGN.md files
    byte-identical (7866 bytes), confirming a single shared design system doc

screens:
  - screen: Home / Landing Page
    path: /home/mohammady/Documents/learning/Glowrie/home page/
  - screen: Product Detail
    path: /home/mohammady/Documents/learning/Glowrie/detail/
  - screen: Cart (UNUSED for this release — see notes below; retained for possible future phase)
    path: /home/mohammady/Documents/learning/Glowrie/cart/
  - screen: Brand / About Page
    path: /home/mohammady/Documents/learning/Glowrie/Brand page/

notes: |
  - HTML files use placeholder/sample product data (varying names, prices, item counts,
    and even inconsistent currencies) purely for illustration only — NOT the literal
    catalog for this release. Actual catalog is a flat list of 4 real products (see §9, §16).
  - Nav icons for search and account/person are decorative/removed for this release —
    no accounts, no search in scope. The cart/bag icon is also removed/not applicable —
    Cart is fully out of scope (see §7 Scope Correction); do not design or implement
    a cart icon.
  - Currency shown inconsistently (₹ vs $) across mockups — resolved to INR (₹).
  - The `cart/` screen folder (design + code.html + DESIGN.md + screen.png) is
    retained as a design asset but is UNUSED for this release — Cart/Checkout was
    removed from scope (see §7 Scope Correction). It remains available if
    cart/checkout scope is revisited in a future phase.
```

**Key screens/elements:** Sticky/frosted top nav (logo, Shop/Science/Ingredients/About links — search, account, and cart icons removed/not applicable, see notes above); Home hero marketing carousel (3 slides, autoplay 5s); horizontal product carousel/slider; Featured Product spotlight with a direct Buy/external-purchase-link action; trust-badge marquee ribbon; Detail page with technical specs table + fragrance-notes breakdown (top/heart/base with timing) and a Buy/external-purchase-link action; Brand/About page with static storytelling sections (sourcing, science/process). **No Cart page/screen** (Cart/Checkout removed from scope — see §7 Scope Correction). **Login screen: N/A** — no accounts/login in scope, so the iTN standard/custom login decision does not apply. **(v2.1) Footer privacy notice** — a small, non-intrusive text line/link in the site footer, present on every storefront page (Home, Detail, Brand/About), acknowledging that visit data is logged for marketing/traffic-analysis purposes (supports UC-006 AC7); exact copy pending confirmation (§15 OQ-9) — visually consistent with the existing "Golden Alchemist" design system (footer text style), not a modal, banner, or interstitial.

**Visual style:** Flat/Minimalist Editorial — explicitly no skeuomorphism, no full glassmorphism (only a subtle frosted-glass nav blur), light theme only, sharp corners, no drop shadows.

---

## §14. Constraints, Dependencies & Risks

Rows 1–5 are carried forward unchanged from `initial-prd.md` v1.1. **v2.1 adds the last three rows below to support UC-006.**

| Item | Type | Detail |
|---|---|---|
| Payload CMS availability | Dependency | Storefront's entire Product data layer depends on an already-provisioned Payload CMS instance being reachable |
| External purchase listing accuracy | Dependency / Risk | The storefront relies entirely on the Content Operator correctly setting and maintaining each product's `purchaseUrl` in Payload CMS; once a Visitor is redirected, a broken or incorrect external link is outside the storefront's control (§10) |
| Currency — resolved | Resolved risk | Mockups showed both ₹ and $; confirmed as INR (₹) |
| Catalog growth expectation | Constraint | Architecture/data model must not hard-code an assumption of exactly 4 products; flat-list UI should tolerate at least ~50 items without a redesign |
| Design assets are static mockups, not a component library | Constraint | `code.html` files are HTML/Tailwind reference implementations only — Architect/UX Design must translate the design intent into the actual production tech stack (tech stack selection is out of PRD scope); note the `cart/` mockup is unused for this release (§7, §13) |
| **(v2.1)** Vercel geolocation headers only available on Vercel's edge network | Dependency / Constraint | Geolocation fields on `visitor_logs` (`countryCode`, `city`) will be null/unknown for any request that does not pass through Vercel's production edge network (e.g. local development, or a future non-Vercel deployment target) — see UC-006 AC3; this is an accepted, documented limitation, not a defect |
| **(v2.1)** DPDP Act applicability to `visitor_logs` | Risk / Compliance | India's DPDP Act (2023) treats IP address and geolocation as personal data; this PRD applies a minimal footer privacy notice and a 180-day retention default as good-faith measures, but neither has been reviewed by legal counsel — flagged as `[Domain Expert Review Recommended]`, see §15 OQ-11 |
| **(v2.1)** Revision raised after Architecture/Plan approval | Risk / Process | This requirement surfaced after `architecture.md` and `development-plan.md` were already signed off; both documents must be amended to reflect UC-006 and the `visitor_logs` entity once this PRD revision (v2.1) is approved — this PRD amendment blocks any further Architecture/Plan work on this feature until approved |

---

## §15. Open Questions

| ID | Question | Impact if Unresolved | Status |
|---|---|---|---|
| OQ-1 – OQ-7 | (Phase 1 Open Questions) | — | **All Resolved 2026-08-23** — see `initial-prd.md` v1.1 §15 for full history. No Pending or Blocked items carried forward from Phase 1. |
| OQ-8 | Phase 2 scope-sequencing confirmation: should all 5 use cases (UC-001–UC-005) ship together as a single release under `build_scope: full`, or should any be sequenced into a later phase (e.g., ship Browse/Detail/Buy first, defer Brand/About or Content-Operator CMS tooling)? | Low impact if unresolved — Harvey proceeded with the safe default (single release, all 5 UCs, consistent with the already-approved `build_scope: full` decision) so this document is not blocked on it. If the stakeholder wants a different sequencing, §7/§8 would need a phasing pass before Architect handoff. | **Resolved 2026-08-23** — Mohammad Taha (Engineering Lead) confirmed: ship all 5 use cases together as a single release. |
| OQ-9 **(v2.1)** | What is the exact wording for the footer privacy notice acknowledging visitor-data logging (UC-006 AC7, §13)? | Low impact if unresolved — Harvey has documented the requirement (a notice must exist) but has not authored placeholder legal copy, since inventing compliance-facing wording without review is riskier than leaving it open. UX Design/Code will need final copy before the footer can be implemented, but this does not block PRD approval. | **Resolved 2026-08-23** — Mohammad Taha confirmed proceeding with a generic placeholder notice ("We log visit data for analytics purposes.") to be finalized as real copy before Code implements the footer. |
| OQ-10 **(v2.1)** | Is the default 180-day rolling retention period (with automated auto-purge) for `visitor_logs` (UC-006 AC8, §9, §12) the correct retention window, or should it be shorter/longer/indefinite? | Low impact if unresolved — Harvey applied 180 days as a reasonable good-faith default (documented as such, not silently assumed). If a different period is required, the retention/purge job's configuration would need updating before or shortly after launch — a config change, not a scope change. | **Resolved 2026-08-23** — Mohammad Taha confirmed: 180-day rolling retention with auto-purge is correct. |
| OQ-11 **(v2.1)** `[Domain Expert Review Recommended]` | Does India's DPDP Act (2023) impose additional obligations on `visitor_logs` beyond a footer privacy notice and retention limit — e.g., a right-to-erasure/access mechanism, even for anonymous (non-account) visitors, or a formal Data Protection Impact Assessment? | Medium impact if unresolved — this PRD's compliance measures (footer notice + 180-day retention) are Harvey's good-faith interpretation, not a legal determination. If DPDP requires more (e.g. an erasure request channel), that would be a new use case in a future revision. | **BLOCKED — user acknowledged 2026-08-23.** This is a learning project; formal legal/DPDP review is deferred. Will revisit if this project ever moves toward real production/commercial use. |

No other open items remain. All Open Questions above are non-blocking — this document is not held from approval pending their resolution, per Harvey's standard OQ-flagging process.

---

## §16. Appendix

### Domain Glossary

Carried forward unchanged from `initial-prd.md` v1.1.

| Term | Definition | Source | Confirmed by user |
|---|---|---|---|
| Catalog | The complete set of Published products available on the storefront | `brainstorm-summary.md` | Yes |
| Product | A single sellable item with name, price (₹), size, description, technical specs, fragrance notes, and an external purchase URL | `brainstorm-summary.md` + Glowrie design assets | Yes |
| Content Operator | The person who creates/edits/publishes/deletes products (including their external purchase URL) via the Payload CMS admin panel | `brainstorm-summary.md` | Yes |
| Visitor | An anonymous, unauthenticated person browsing the storefront | `brainstorm-summary.md` | Yes |
| Buy / External Purchase Link | The button on the Detail page and Home Featured Product spotlight that redirects a Visitor, in a new tab, to the external site where the product is actually sold | Phase 1 OQ-1 resolution | Yes |
| SKU | Product code shown on catalog cards (e.g. "GL-01") | Glowrie design assets — `home page/` | Yes (agent-inferred) |
| Fragrance Notes (Top/Heart/Base) | The scent profile breakdown of a product over time — Top (0–15 min), Heart (15–60 min), Base (1–6 hrs) | Glowrie design assets — `detail/` | Yes (agent-inferred) |
| Brand/About Page | Static marketing page telling the brand's story, sourcing, and science/process | Glowrie design assets — `Brand page/` | Yes (agent-inferred, scope-expansion term) |
| **visitor_logs** *(NEW v2.1)* | The Supabase/Postgres table storing one row per storefront page view (IP, geolocation, timestamp, user agent, referrer, landing page path, UTM parameters), for marketing/traffic attribution — not a Payload CMS collection | Stakeholder revision request, 2026-08-23 | Yes |
| **DPDP Act** *(NEW v2.1)* | India's Digital Personal Data Protection Act (2023) — the governing personal-data-protection law applicable since this storefront targets India (INR currency) | Stakeholder revision request, 2026-08-23 (agent-inferred applicability) | Yes (applicability confirmed by user; specific obligations pending legal review, §15 OQ-11) |

**Removed terms (audit trail — no longer part of the active product):** *Cart*, *Line Item*, and *Checkout* — see §9 Removed Entities. Retained here only for traceability, not as active domain terms.

### References

- `docs/initial-prd.md` (v1.1) — approved 2026-08-23, the direct source for this refined PRD
- `docs/brainstorm-summary.md` — original brainstorm, approved 2026-08-22
- Glowrie design assets — `/home/mohammady/Documents/learning/Glowrie/{home page, detail, cart, Brand page}/` (code.html + DESIGN.md + screen.png per screen) — source of truth for UI and Product field structure; passed to UX Design and Architect phases as-is. **Note:** the `cart/` asset is unused for this release (Cart/Checkout removed from scope) — retained for a possible future phase. Re-verified unchanged during Phase 2 context refresh.
- No JIRA/SOW/NPI/supplementary documents were provided for this session
- **(v2.1)** `docs/architecture.md` and `docs/development-plan.md` — already-approved documents that must be amended once this PRD revision is approved, to incorporate UC-006 and the `visitor_logs` entity
- **(v2.1)** UC-006 source: verbal stakeholder request, 2026-08-23 — verbatim quoted in UC-006 §8; not traceable to any prior written source document

### PRD Source Coverage Review (Step 3 — triggered by design-asset supplementary input)

The Glowrie design asset folder is the only non-conversational input source for this PRD (no JIRA/SOW/NPI). Coverage check:

| Source item | PRD destination | Status |
|---|---|---|
| `home page/` (code.html, DESIGN.md, screen.png) | §8 UC-001, §13 | Covered |
| `detail/` (code.html, DESIGN.md, screen.png) | §8 UC-002/UC-003, §9 Product fields, §13 | Covered |
| `Brand page/` (code.html, DESIGN.md, screen.png) | §8 UC-004, §13 | Covered |
| `cart/` (code.html, DESIGN.md, screen.png) | §7 Scope Correction, §13 (explicitly flagged unused/retained) | Covered — explicitly excluded, not a gap |
| Shared `DESIGN.md` design system spec (typography, palette, shape language, responsive grid) | §13 Design Assets block | Covered |

No gaps identified. Coverage review passes.

**(v2.1 note):** UC-006 (Visitor Analytics/Tracking Logging) originates from a verbal stakeholder request, not a JIRA/SOW/NPI/external-PRD/supplementary document, so it is not subject to this source coverage review mechanism — it is fully captured directly in §8 UC-006, §9 `visitor_logs`, §12, §13, §14, and §15 of this document instead.

---

## §17. Revision History

| Version | Date | Changed By | Sections Changed | Summary of Changes |
|---|---|---|---|---|
| 2.0 | 2026-08-23 | Harvey AI | All sections (Phase 2 refinement) | Refined `initial-prd.md` v1.1 into `refined-prd.md`. Phase 2 prerequisite verification passed (Phase 1 Complete + approved). Context refresh found no new information (no MCP/JIRA, no supplementary docs, design assets unchanged, still pure greenfield workspace). Since `build_scope: full` was already confirmed in Phase 1, Phase 2 applied a scope-confirmation pass rather than MVP/Phase-2 tagging: all 5 use cases (UC-001–UC-005) confirmed for a single full release, carried forward the existing Out-of-Scope/Deferred list unchanged, and formalized the Critical Path Journey and a Complexity Assessment for release planning. Added OQ-8 (scope-sequencing confirmation) as a non-blocking `[ASSUMPTION:]`-tagged item pending final stakeholder acknowledgement. Ran PRD Source Coverage Review against the Glowrie design asset folder — no gaps found. |
| 2.1 | 2026-08-23 | Harvey AI | §1 (Version, Sign-Off reset), §2, §7, §8 (new UC-006), §9 (new `visitor_logs` entity), §10, §11, §12, §13, §14, §15 (new OQ-9, OQ-10, OQ-11), §16 (glossary + references) | **Revision** requested by stakeholder after `architecture.md` and `development-plan.md` were already approved. Added UC-006 — Visitor Analytics/Tracking Logging: passive, server-side capture of IP address, geolocation (via Vercel headers), timestamp, user agent, referrer, landing page path, and UTM parameters into a new dedicated `visitor_logs` table in Supabase (not a Payload CMS collection), for marketing attribution/traffic analysis. Added full Given/When/Then acceptance criteria including sad paths (geolocation unavailable, no referrer, no UTM params, logging-failure-must-not-affect-Visitor). Updated §9 data model with the `visitor_logs` entity (fields, access control, System Objects sub-section) and corrected the prior "no PII" statement (IP/geo is now tagged `[PII]`). Updated §12 NFRs with a new Compliance & Privacy dimension flagging India's DPDP Act applicability, a footer privacy notice requirement, and a default 180-day retention/auto-purge policy. Updated §13 with the footer privacy notice UI element. Updated §10/§11/§14 with the Vercel-geolocation-header platform dependency and its sad-path handling. Flagged the exact privacy-notice wording (OQ-9) and the 180-day retention default (OQ-10) as non-blocking Open Questions pending stakeholder/legal confirmation, plus a broader `[Domain Expert Review Recommended]` flag (OQ-11) on DPDP Act obligations beyond these two measures. Source: verbal stakeholder addition, not traceable to any prior document. **Sign-Off reset to Pending for all 3 roles** — this revision requires fresh approval before Architecture/Development Plan can be amended. |

For prior history (v0.1 → v1.1), see `docs/initial-prd.md` §17.
