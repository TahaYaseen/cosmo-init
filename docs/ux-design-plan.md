# UX Design Plan — Glowrie Product Catalog Storefront

**Mode:** HTML
**Mode change (2026-08-23):** Originally scoped as TypeScript (Next.js) wired to the `intops-eng-data-engine`. That engine is not available on this machine (see Section 6 — resolved below), so this UX Design phase falls back to a **self-contained static HTML prototype** (Option B, user-approved) — pixel-sourced from the same Glowrie mockups, using an in-page JS data array instead of live HTTP calls. The user's actual target production stack (Next.js / Node.js / Payload CMS / Supabase / Vercel) is unaffected; Architecture and Code stages still target that stack. This change only affects how *this* prototype is powered.
**Persona mode:** Single (Visitor) — Content Operator manages the catalog entirely via the existing Payload CMS admin panel (UC-005); no custom admin UI is in scope, so no Content Operator screens are built.
**Design source:** Local Glowrie mockups at `/home/mohammady/Documents/learning/Glowrie/{home page, detail, Brand page}/` (code.html + DESIGN.md + screen.png per screen) — pixel-fidelity source of truth. `cart/` is present on disk but explicitly out of scope (UC-003 replaced cart/checkout with an external Buy redirect).
**Architecture used:** No — design-first (`uxDesignStartedWithoutArchitecture: true`). Tech stack for this prototype: static HTML/CSS/JS, self-contained, no build step. Custom CSS replicates the Glowrie "Golden Alchemist" token system exactly (Section 4) — no external CSS framework.

---

## 1. Screen Plan

| # | Screen | Type | Key Entities | Actions | PRD Source |
|---|---|---|---|---|---|
| 1 | Home / Landing | dashboard/list | Product | Browse hero carousel (3 slides, autoplay 5s, prev/next, dots); browse horizontal product carousel (prev/next); view Featured Product spotlight; Buy (external redirect or disabled "Coming Soon"); nav to Product Detail (click any card); nav to Brand/About; nav to Home (Shop link) | UC-001, UC-003 (Featured spotlight Buy) |
| 2 | Product Detail | detail | Product | View full spec (price, size, description, technical specs: pH/format/key actives, fragrance notes top/heart/base with timing); Buy (external redirect or disabled "Coming Soon"); back to Home | UC-002, UC-003 |
| 3 | Brand / About | static content | — (static copy) | Nav to Home; nav to Detail (only if a cross-link is added — none defined in mockup, so none built) | UC-004 |

No Cart/Checkout screen (removed from scope — UC-003 is a stateless external redirect only). No Content Operator / admin screens (out of scope — UC-005 is served by the existing Payload CMS admin, not this prototype).

### UX Consolidation Notes
- 3 screens total for 5 use cases — within the ≤8 UC → 5–8 screen band (below it, appropriately, since UC-003 is not a screen but an action embedded in screens 1 and 2, and UC-005 has no UI in this prototype's scope).
- No list/detail merge, tab consolidation, or wizard collapsing was needed — the screen set is already minimal and maps 1:1 to the mockup's three in-scope folders.

---

## 2. Global Navigation (every screen)

Sticky, frosted-glass top nav (`bg-surface/90` + backdrop blur, 1px gold-tinted `outline-variant` bottom border), height 80px, fixed to viewport top.

- **Left:** "Glowrie" wordmark (Public Sans, bold, tracked-tight) — links to Home.
- **Center/left-of-right-cluster (desktop only, hidden <768px):** Shop → Home · Science → Home (no dedicated Science screen exists in the PRD/mockups; treat as an anchor to Home for this release, per `<!-- DESIGN DECISION -->`) · Ingredients → Home (same rationale) · About → Brand/About.
- **Right:** search / shopping-bag / person icons are **removed** per PRD §13 notes (no accounts, no search, no cart in scope for this release) — do not build them, even though they appear in the raw mockup HTML.
- Footer (present on all 3 screens, content varies per mockup): Glowrie wordmark, discover/support/legal or sustainability/contact/shipping/terms links (static, non-functional placeholders acceptable — no PRD-defined destination pages exist for these).

No dead ends: Home ↔ Detail ↔ Home, Home ↔ Brand/About ↔ Home. Every screen reachable from the nav on every other screen.

---

## 3. Screen States (per PRD §11 Error Handling)

| Screen | Loading | Empty | Error | Populated |
|---|---|---|---|---|
| Home | Skeleton/spinner while fetching catalog | "No products available yet" friendly message (UC-001 AC3) | "We're having trouble loading our products right now, please check back shortly" (UC-001 AC4) | Hero carousel + product carousel + Featured Product spotlight, built from Published products only |
| Product Detail | Skeleton/spinner while fetching product | — | "This product is no longer available" + link back to Home (UC-002 AC2, product deleted/unpublished/not found); generic backend-unreachable error (UC-002 AC3) | All populated fields only — never render blank/"undefined" for empty optional fields (UC-002 AC4) |
| Brand/About | N/A (static content, no fetch) | N/A | Per-region fallback if a static image fails to load; page shell (nav/footer) still renders (UC-004 AC2) | Static story/sourcing/science sections |

**Buy button logic (Home Featured spotlight + Detail, UC-003):**
- `purchaseUrl` set and a valid absolute URL → enabled, opens in a new tab (`target="_blank" rel="noopener noreferrer"`).
- `purchaseUrl` empty OR not a valid absolute URL → disabled, labeled "Coming Soon" (AC3/AC4) — treated identically, no distinction shown to the Visitor.

---

## 4. Design Tokens (Golden Alchemist design system — extracted from `DESIGN.md`, byte-identical across all 3 screen folders)

**Colors**
| Token | Value | Usage |
|---|---|---|
| `primary` (Alchemist Gold) | `#735c00` | Critical interactive elements, hairline dividers |
| `primary-container` | `#d4af37` | Secondary-button border, key branding accents |
| `secondary` (Champagne Gold) | `#6c5d2e` | Hover states, subtle icons |
| `on-background` / `on-surface` (Obsidian) | `#1c1b1b` (buttons rendered as `#1A1A1A`) | Primary button background, all typography |
| `surface` | `#fcf9f8` | Page background |
| `surface-container-lowest` | `#ffffff` | Card/panel background |
| `surface-container-low` | `#f6f3f2` | Product image tiles |
| `outline` | `#7f7663` | Overline/label text, borders |
| `outline-variant` | `#d0c5af` | Nav border, dividers |
| `error` | `#ba1a1a` | Error states |

**Typography** — Bodoni Moda (serif, display/headline), Public Sans (sans, body/labels), JetBrains Mono (technical data: SKU, price, specs, fragrance timing)
| Style | Font | Size / Line-height / Weight |
|---|---|---|
| `display-xl` | Bodoni Moda | 80px / 92px / 600, tracking -0.02em |
| `headline-lg` | Bodoni Moda | 48px / 56px / 500, tracking -0.01em |
| `headline-lg-mobile` | Bodoni Moda | 32px / 40px / 500 |
| `headline-md` | Bodoni Moda | 32px / 40px / 400 |
| `body-lg` | Public Sans | 18px / 28px / 400 |
| `body-md` | Public Sans | 16px / 24px / 400 |
| `label-sm` | Public Sans | 12px / 16px / 600, tracking 0.1em, uppercase |
| `data-mono` | JetBrains Mono | 14px / 20px / 400 |

**Spacing:** 4px base unit · 24px gutter · 16px mobile margin · 64px desktop margin · 120px section gap.
**Grid:** 12-col desktop (≥1440px, 64px margins) · 8-col tablet (768–1024px, 40px margins) · 4-col fluid mobile (<768px, 16px margins).
**Shape:** sharp, 0-radius corners everywhere (buttons, inputs, cards) except a few decorative circular elements (carousel dots, fragrance-note icon circles, pagination arrows).
**Elevation:** no drop shadows anywhere — depth via tonal layering (white cards on alabaster background), 1px gold hairline rules, and a frosted-glass nav blur only.
**Buttons:** Primary = sharp Obsidian (`#1A1A1A`) background, white text, uppercase tracked label. Secondary = transparent, 1px Alchemist Gold border. Tertiary/ghost = text-only with gold underline that expands on hover.

**Currency:** INR (₹) only — resolved per PRD §13 (mockups inconsistently show ₹/$; all product prices in the design must render as ₹).

**Component library / CSS approach for the Next.js build:** Tailwind CSS with a custom theme extension replicating the exact token table above (mirrors the mockups' inline `tailwind.config` extension) — no Material/shadcn/Bootstrap. No dark mode (light theme only, per DESIGN.md).

---

## 5. Data / API (KNOWLEDGE_BASELINE — no architecture.md yet, PRD-derived)

**Entity — Product** (system of record: Payload CMS, read-only from this storefront's perspective)

| Field | Type | Required |
|---|---|---|
| id | string/UUID | Yes |
| sku | string | Yes |
| name | string | Yes |
| categoryLabel | string | No |
| price | decimal (INR) | Yes |
| size | string | No |
| description | text | Yes |
| keyActives | string/list | No |
| phLevel | string | No |
| format | string | No |
| fragranceTopNotes / fragranceHeartNotes / fragranceBaseNotes | string/list | No |
| badge | enum: NEW, BESTSELLER, none | No |
| image | media reference | Yes |
| purchaseUrl | string/URL | No |
| status | enum: Draft, Published | Yes |
| createdAt / updatedAt | timestamp | System |

**API endpoints (design-first defaults — real endpoints for the future Next.js/Payload build; NOT called by this static prototype):**
- `GET /api/products?status=Published` — Home carousel + Featured spotlight
- `GET /api/products/:id` — Product Detail (404/not-found → UC-002 AC2 messaging)

**Auth:** None — Visitor is anonymous, read-only, no login screen (PRD §13: "Login screen: N/A").

**Seed data:** ≥6 realistic skincare/beauty products (status mix: mostly Published, 1–2 Draft to prove the filter), SKUs like `GL-01`, `GL-04`, `GL-07`; at least one product with `purchaseUrl` unset (proves the "Coming Soon" disabled state) and at least one with a valid `purchaseUrl`. In this static prototype, seed data lives in an in-page JS array (`MOCK_PRODUCTS`) — no backend call is made; a client-side `status === 'Published'` filter and `products.find(id)` lookup simulate the two endpoints above so the same data-shape/behavior carries forward when the real API is wired in Code mode.

---

## 6. Build Prerequisite — Mock Data Engine (RESOLVED — static HTML fallback)

Per Harvey's UI Mock/Data Strategy, a `typescript-standard` prototype must wire real HTTP calls to the `intops-eng-data-engine` (never inline/hardcoded mock data). This machine does not have that engine available (no `SKILL.md`/engine repo under `~/.claude/skills/intops-eng-data-engine/` — templates only, not published to npm, no `ITN_MOCK_DATA_ENGINE_PATH` set, no running instance on port 4000).

**Resolution (2026-08-23, user-approved):** Fall back to a static HTML wireframe (Option B) for this UX Design phase only. Static HTML is the sanctioned exception to the mock-engine rule (a deliberately throwaway prototype with no build step / no API tier), so the in-page `MOCK_PRODUCTS` array is compliant, not a workaround. The engine requirement re-applies once the pipeline reaches Architecture/Code and the real Next.js app is built.

---

## 7. Open Design Decisions (annotate in build)

- Shop / Science / Ingredients nav links: no dedicated screens exist in PRD scope → all three route to Home for this release (`DESIGN DECISION`).
- Footer secondary links (Sustainability/Contact/Shipping/Terms, Discover/Support/Legal): no PRD-defined destination → static non-functional placeholders, acceptable per scope.
- Hero carousel autoplay: 5s interval, pause on hover, matches `home page/code.html` reference implementation exactly.
