# UX Design Sign-Off — Glowrie Product Catalog Storefront

**Mode:** HTML
**Output:** `docs/ux/ux-design-html/visitor/index.html`
**Personas:** Visitor (single persona — Content Operator (UC-005) is served entirely by the existing Payload CMS admin panel; no custom admin UI is in scope for this prototype)
**Screens:** 3 — Home / Landing, Product Detail, Brand / About (all internally linked in one self-contained, offline-capable HTML file; no dead ends)
**Architecture Used:** No — design-first (tech stack: html)
**Approved: Yes**
**Approver:** Mohammad Taha
**Date:** 2026-08-23

---

## Mode Change Note

This UX Design phase was originally scoped as TypeScript (Next.js) wired to the `intops-eng-data-engine`, matching the user's intended production stack (Next.js / Node.js / Payload CMS / Supabase / Vercel). The engine was not available on this machine (no `SKILL.md`/engine repo, not published to npm, no `ITN_MOCK_DATA_ENGINE_PATH` set, nothing on port 4000). The user approved falling back to a **self-contained static HTML prototype** (Option B) for this phase only. Static HTML is the sanctioned exception to Harvey's "no inline mock data" rule (a deliberately throwaway prototype, no build step, no API tier), so the in-page `MOCK_PRODUCTS` JS array is compliant, not a workaround. The production stack itself is unaffected — Architecture and Code stages still target Next.js / Payload CMS / Supabase / Vercel, and the mock-engine requirement re-applies once those stages begin.

## Build Summary

- Pixel-sourced from the user-provided Glowrie "Golden Alchemist" mockups (`home page/`, `detail/`, `Brand page/` — `cart/` explicitly excluded per scope).
- Custom CSS replicates the full design-token system (colors, typography scale, spacing, 0-radius shape language, no-drop-shadow elevation system) extracted from the mockups' `DESIGN.md`.
- Data: in-page `MOCK_PRODUCTS` array, 7 realistic skincare products (GL-01–GL-07), 5 Published / 2 Draft, mixed `purchaseUrl` presence (proves both enabled-Buy and disabled "Coming Soon" states, plus a malformed-URL edge case), 2 products with intentionally omitted optional fields (proves no blank/"undefined" rendering).
- All screen states implemented: loading, empty, error/not-found, and populated, per PRD §11 Error Handling.
- Reviewed by `harvey-ux-design-review` (HTML_VALIDATION mode) — see `docs/ux-design-review.md`. Round 1: 3 gaps found and fixed (Home carousel showing wrong field; missing malformed-URL test case; unused error-token accent). Final status: **PASS**, 0 remaining gaps.

## New Requirements

None discovered during prototyping beyond what is already captured in `refined-prd.md` and reflected in the review fixes above (all three review-round fixes were corrections to already-specified PRD behavior, not new scope).
