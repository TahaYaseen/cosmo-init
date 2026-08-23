# Brainstorm Summary — Product Catalog Storefront

## 1. Product Vision

A small, live, public-facing product catalog storefront. Visitors land on a public dashboard/catalog page that lists the available products; clicking any product opens a dedicated product detail page. Content (products) is managed by an operator through the existing Payload CMS admin panel — no custom internal admin UI is being built for this MVP.

This is explicitly intended to run as a **real, live storefront** (not a throwaway learning exercise), starting small — an initial flat catalog of 4 products — with room to grow in scope over time (categories, accounts, checkout) once the MVP is validated.

## 2. Personas

| Persona | Description | Needs |
|---|---|---|
| **Visitor / Shopper** | Anonymous public visitor browsing the storefront | View the product catalog, open individual product details, no login required |
| **Content Operator** | Person maintaining the catalog | Add/edit/remove products and their image via the Payload CMS admin panel (no custom admin UI needed) |

## 3. Core Features (MVP — In Scope)

1. **Public Catalog / Dashboard Page** — publicly accessible landing page listing all products (flat list, no categories/tags for MVP; currently 4 products).
2. **Product Detail Page** — clicking a product from the catalog navigates to a dedicated detail page for that product.
3. **Content Management via Payload CMS Admin** — product data is authored and maintained entirely through the existing Payload CMS admin panel. No separate/custom admin UI is built.
4. **Anonymous Browsing** — the storefront is fully public; no sign-up or login required to browse the catalog or product details (see Assumption in §8).

## 4. Out of Scope

| Item | Reason |
|---|---|
| Checkout / payment / transactions | Deferred — Reason: user confirmed MVP is browse-only, no purchasing flow for now. |
| User accounts (sign-up/login/wishlist/favorites) | Deferred — Reason: MVP scope is anonymous public browsing only; no account-gated features requested (see Assumption §8 for confirmation path). |
| Categories / tags / filtering / search | Deferred — Reason: catalog is a small flat list (4 products) for MVP; no categorization requested. |
| Custom internal admin UI | Deferred — Reason: Payload CMS's built-in admin panel is sufficient for MVP content management; no additional admin tooling requested. |
| Product price / description / stock fields | Deferred — Reason: browse-only MVP with no transactions; minimal product data (name + image) is sufficient until purchasing is in scope (see Assumption §8). |

## 5. Key User Flows

**Flow A — Browse Catalog**
1. Visitor lands on the public catalog/dashboard page.
2. Visitor sees a flat list of all products (name + image) currently in the CMS.

**Flow B — View Product Detail**
1. From the catalog page, visitor clicks a product.
2. Visitor is taken to a dedicated product detail page showing that product's available data (name, image; additional fields as scoped by PRD).
3. Visitor can navigate back to the catalog.

**Flow C — Content Operator Updates Catalog**
1. Operator logs into the existing Payload CMS admin panel.
2. Operator adds, edits, or removes a product record (name, image).
3. Change is reflected on the public catalog/detail pages without any custom admin work.

## 6. Data & Integration Needs

- **Product entity** — minimum viable fields for MVP: name, image. Additional fields (price, description, stock/availability) are deferred until transactions are in scope (see §4, §8).
- **Content source of truth** — Payload CMS acts as the system of record for product data; the public storefront reads product data from Payload CMS.
- No external integrations (payment gateways, shipping, inventory systems) are needed for this MVP given the browse-only, account-less scope.

## 7. UI/UX Considerations

- Two public-facing screens for MVP: **Catalog/Dashboard** (list of products) and **Product Detail** (single product view).
- No admin-facing screens are being designed — Payload CMS's existing admin panel is used as-is.
- No login/sign-up screens for MVP (see Assumption §8).
- **Figma status:** no Figma file has been shared yet. Per the assumption in §8, functional scope has been structured now; exact screen layout, visual design, and interaction details remain an explicit Open Question pending the Figma file.

## 8. Open Questions for PRD to Resolve

1. **[ASSUMPTION — please confirm] Accounts/login:** The user's reply to the accounts question ("only image for now") did not directly address sign-up/login/wishlist. Given the confirmed browse-only MVP scope, this brainstorm defaults to **no accounts — fully anonymous browsing** for MVP. PRD should confirm this is correct, or revisit if any account-gated feature (e.g., wishlist) is actually wanted later.
2. **[ASSUMPTION — please confirm] Product fields / content scope:** The user's reply ("only image") is interpreted as: for MVP, the product entity needs only **name + image** — price, description, and stock/availability are not required since there's no checkout yet. PRD should confirm this minimal field set, or clarify if additional fields (e.g., a short description) are wanted on the detail page even without transactions.
3. **[ASSUMPTION — please confirm] Figma timing:** No answer was given on whether to wait for a Figma file before finalizing screen scope. This brainstorm proceeded with functional scope now (Catalog page + Detail page) and left exact layout/visual design as pending. PRD/UX Design should confirm whether to proceed on this functional scope now or hold for Figma before locking screen structure.
4. Should the catalog grow beyond a flat list in the near future (categories/tags), or is a flat list expected to remain sufficient for the foreseeable roadmap?
5. Is there any target audience, branding, or content-tone guidance for the storefront's products?

## 9. Handoff Summary

- Confirmed scope: public, anonymous, browse-only product catalog storefront with a catalog/dashboard page and a product detail page, backed by Payload CMS as the content source of truth, starting with a flat list of 4 products.
- Confirmed out of scope for MVP: checkout/transactions, accounts, categorization, custom admin UI.
- Three assumptions were made where user answers were ambiguous or missing (accounts/login default to none, minimal product fields default to name+image, Figma timing default to proceed now) — all flagged in §8 for explicit PRD-stage confirmation.
- Ready for PRD to formalize acceptance criteria and confirm the flagged assumptions with the user.

## Sign-Off

| Approver Name | Date | Status |
|---|---|---|
| Mohammad Taha | 2026-08-22 | Approved |
| _Pending_ | — | ⏳ Needs Approval |
