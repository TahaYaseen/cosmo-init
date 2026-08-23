# Development Plan: Glowrie Storefront

**Version:** 1.1 (Amendment — adds UC-006 Visitor Analytics/Tracking Logging, per `refined-prd.md` v2.1 and `architecture.md` v1.1; supersedes v1.0)

## Create

| Harvey | User Name | Create Date |
|---|---|---|
| Harvey AI | Mohammad Taha | 2026-08-23 |

### Sign-Off

| Role | Approver Name | Status |
|---|---|---|
| User / Team | Mohammad Taha (2026-08-23) | Approved |

### Revision History

| Version | Date | Changed By | Sections Changed | Summary of Changes |
|---|---|---|---|---|
| 1.0 | 2026-08-23 | Harvey AI | All sections | Initial development plan for `refined-prd.md` v2.0 / `architecture.md` v1.0 (UC-001–UC-005: Browse Home, Product Detail, Buy External Redirect, Brand/About, Content Operator CMS CRUD). Approved by Mohammad Taha, 2026-08-23. |
| 1.1 | 2026-08-23 | Harvey AI | Header/Sign-Off (version bump, Sign-Off reset to Pending), §1.4/§1.5 (UC-006 scope notes and sprint-to-UC narrative assignment), §2.1–2.4 (Visitor Analytics Logging module, folder structure additions, Data Access exception, Naming/Error Handling standards), Section 3 HITL Overview / Sprint Dependency Matrix / Parallelism Time Savings (S0 effort +6 Human-hrs / +1.5 Agent-hrs), S0 (new Tasks 8–9, new AC7–AC12, AC Coverage Matrix, Task Concurrency Map entries, HITL Checkpoint, Handover Verification items, PRD Fulfilled note), INT-1 (new Task 6, new AC6, End-to-End Product Status row for UC-006), S3 PRD Fulfilled note (now cites all 6 use cases), S4 (production `visitor_logs` migration + `pg_cron` job registration), closing self-review summary (now cites all 6 use cases) | **Amendment** triggered by `refined-prd.md` v2.1 and `architecture.md` v1.1 (both re-approved by Mohammad Taha, 2026-08-23), adding **UC-006: Visitor Analytics/Tracking Logging** — a stakeholder-requested revision surfaced after this plan was already approved. UC-006 is implemented entirely within **Sprint 0** (cross-cutting infrastructure: `visitor_logs` table + RLS + `pg_cron` retention job, non-blocking Middleware capture path, footer privacy-notice UI — no dependency on the `Products` collection or on S1.A/S1.B/S1.C page code), with the one cross-page verification (footer notice visible on Home, Detail, *and* Brand/About together) deferred to **INT-1**, once all three storefront pages exist on the merged branch. No previously-approved sprint content was rewritten or reversed — all additions are tagged **(v1.1)** throughout this document. **Sign-Off reset to Pending** — this amendment requires fresh approval before Code can begin. |

> **v1.1 amendment note (2026-08-23):** This plan was originally approved (v1.0) against `refined-prd.md` v2.0 and `architecture.md` v1.0. Both upstream documents were subsequently revised and re-approved — `refined-prd.md` to **v2.1** (all 3 roles re-signed-off, 2026-08-23) and `architecture.md` to **v1.1** (re-approved by Mohammad Taha, 2026-08-23) — to add **UC-006: Visitor Analytics/Tracking Logging**, a stakeholder-requested revision surfaced after this plan was already approved (source: verbal addition, not traceable to any prior source document). This v1.1 amendment extends the plan to build UC-006 without rewriting or reversing any previously-approved sprint content: the `visitor_logs` table/migration, the Visitor Analytics Logging Middleware, and the footer privacy-notice UI are added to **Sprint 0** (Groundwork & Shared Foundation) — matching `architecture.md`'s explicit framing of this module as "Cross-cutting / Infrastructure" with no dependency on the `Products` collection or any specific page's business logic — and end-to-end verification (footer notice visible on every merged page, logging never blocks render) is added to **INT-1**. Additions are tagged **(v1.1)** throughout this document. **Sign-Off reset to Pending** — this amendment requires fresh approval before Code can begin.
>
> This document synthesizes `refined-prd.md` (v2.1, Approved 2026-08-23) and `architecture.md` (v1.1, Approved 2026-08-23, Mohammad Taha) into a sprint-by-sprint implementation roadmap. Status remains Pending until reviewed and approved.

---

## 1. Foundational Strategy & Technology Choices

### 1.1. Architecture Pattern & Project Type

**Pattern: Modular Monolith** (per `architecture.md` §2). A single Next.js 15 application with Payload CMS 3.x embedded in-process (mounted at `/admin`) and Payload's Postgres adapter pointed at a managed Supabase Postgres database. There is no separate backend service — Server Components call Payload's **Local API** directly (in-process function calls), and Payload's auto-generated REST/GraphQL routes serve the admin UI and any future external consumer.

**Project type:** Greenfield. The workspace contains no application code today — this is a first implementation.

**Why this drives the plan's structure:** Because there is no frontend/backend network boundary, feature sprints are vertical slices through one codebase (page → Local API call → collection → Postgres), not split frontend/backend tracks. Parallel tracks (Section 3) are justified by **domain-module independence** (Home vs. Detail vs. Brand/About touch disjoint code), not by a frontend/backend split.

### 1.2. Technology Stack

*(Copied as-is from `architecture.md` §1 — Plan does not re-select.)*

| Layer | Choice | Version |
|---|---|---|
| Frontend | Next.js (App Router, React Server Components) | Next.js 15.x, React 19.x, TypeScript 5.x |
| CMS / Backend | Payload CMS (embedded, in-process) | Payload 3.x |
| Database | Postgres via Supabase | `@payloadcms/db-postgres` (Drizzle-based) |
| Media Storage | Supabase Storage | Payload upload adapter |
| UI Component Library | Tailwind CSS + shadcn/ui (Radix primitives) | Tailwind 3.x |
| Hosting / Deployment | Vercel (single project) | — |
| Repository Strategy | Single repo (monorepo) | — |
| Package Manager | pnpm | 9.x |
| Browser E2E Framework | Playwright | latest stable |
| QA Methodology | `sdet-test-automation` (Playwright + Page Object Model) | — |
| **(v1.1)** Direct DB client (visitor logging only) | `@supabase/supabase-js` | latest stable |
| **(v1.1)** Scheduled job (retention/purge only) | Supabase `pg_cron` extension | Postgres-native |

### 1.3. Infrastructure & Local Development Setup

- **Local dev DB:** Supabase CLI (`supabase start`) for a local Postgres instance, or a dedicated dev Supabase project. `DATABASE_URI` env var points Payload's Postgres adapter at it.
- **Local dev app:** `pnpm dev` (Next.js dev server); Payload admin reachable at `http://localhost:3000/admin`.
- **Migrations:** `payload migrate:create` generates Drizzle migration files during development (committed to the repo); `payload migrate` applies them. Production build command runs `payload migrate` before `next build` (Section 8 of `architecture.md`).
- **Secrets:** `DATABASE_URI`, `PAYLOAD_SECRET`, Supabase Storage credentials — local via `.env` (gitignored), production via encrypted Vercel Environment Variables. `.env.example` documents required keys with placeholders only.
- **No IaC needed** at this scale (Vercel + Supabase dashboard/CLI configuration only).

### 1.4. Repository Strategy

**Single repo (monorepo)** — confirmed in `architecture.md` §2 (`REPO_STRATEGY: single`). One Git repository, one Vercel project, one commit/PR per sprint. `REPO_DIRS` is not applicable (not a Decoupled Fullstack pattern).

**User-provided inputs required at plan sign-off** (collect before Code starts; Code asks only for values still missing):

| Input | Example | Notes |
|---|---|---|
| `[User Input]` Git repository URL | `git@github.com:mtaha/glowrie-storefront.git` | Single repo — Code mode clones/inits here |
| `[User Input]` Supabase project URL + `DATABASE_URI` | `postgresql://postgres:***@db.xxxx.supabase.co:5432/postgres` | Dev project; production project collected again at S4 (Deployment Sprint) |
| `[User Input]` Supabase Storage bucket/API keys | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Used by the Payload upload adapter. **(v1.1)** `SUPABASE_SERVICE_ROLE_KEY` is also used exclusively server-side by the S0 visitor-logging Middleware (UC-006) — never referenced client-side, never prefixed `NEXT_PUBLIC_` |
| `[User Input]` `PAYLOAD_SECRET` value | any long random string | Used to sign Payload's auth JWTs — generate with `openssl rand -base64 32` if not already chosen |
| `[User Input]` Vercel account/project name | — | Collected again at S4 (Deployment Sprint) |

### 1.5. Mock-Data / Backend-Availability Strategy

Per Harvey's UI Mock/Data Strategy (CLAUDE.md), a runnable UI app must never source its data from inline/hardcoded mock arrays. The default mitigation is the `intops-eng-data-engine` mock API server. **That default does not apply to this plan**, for a reason `architecture.md` §1 states explicitly:

> Payload CMS + Postgres/Supabase **is** the real backend, and it is built in Sprint 0 of this very plan. There is no intermediate mock-API phase to bridge — Code mode wires the storefront directly to real Payload collections from the first feature sprint.

This plan therefore does **not** include a "Backend Integration — Replace Mock APIs with Real Backend" sprint. Sprint 0 (Section 3) stands up the real Payload + Supabase backend as core infrastructure; every feature sprint from S1.A onward calls the real Payload Local API against the real (locally-running or dev-project) Supabase Postgres instance — never an in-app mock array, and never `intops-eng-data-engine`.

**UX Design provenance note:** The UX Design phase used a *sanctioned* exception to the mock-engine default — a static-HTML, no-build, no-API-tier prototype with an in-page `MOCK_PRODUCTS` array (`docs/ux/ux-design-html/visitor/index.html`), because `intops-eng-data-engine` was unavailable on that machine. That prototype's `MOCK_PRODUCTS` array **does not carry forward into Code** — it was a throwaway visual reference only. Its exact screen structure, design tokens, and component boundaries carry forward (per `architecture.md` §24), but its data layer does not. Sprint 0 (Task 8) includes an explicit verification step confirming no `MOCK_PRODUCTS`-style inline array is copied into the production codebase.

**Scope note — retired v1.0 use-case numbering (UC-003–UC-007 Cart/Checkout family):** `refined-prd.md` §7 records that `initial-prd.md` v1.0 originally scoped a Cart/Checkout use-case family numbered **UC-003 through UC-007** (add-to-cart, cart page, quantity/remove management, checkout entry, payment-gateway integration). That entire family was **removed from scope** during Phase 1 stakeholder resolution (2026-08-23, OQ-1) and replaced with a single new, differently-scoped **UC-003: Visitor Clicks Buy → Redirected to External Purchase Listing** in `refined-prd.md` v2.0 — a stateless external redirect with no cart/checkout/payment logic of any kind (`architecture.md` ADR-006). This plan implements the current, live use case set (**UC-001 through UC-006** as defined in `refined-prd.md` v2.1 §8): UC-001→S1.A, UC-002→S1.B, UC-003 (the new Buy-redirect definition)→S2, UC-004→S1.C, UC-005→S3, **UC-006 (v1.1 addition)→S0** (implementation) **and INT-1** (end-to-end verification). The retired v1.0 **UC-004 through UC-007** identifiers (cart page, quantity/remove, checkout entry, payment gateway) have no successor requirement anywhere in `refined-prd.md` and are correspondingly **absent from this plan** — this is a deliberate, already-approved scope removal carried forward from the PRD, not a coverage gap. No sprint in this plan builds a Cart entity, Cart page, checkout flow, or payment-gateway integration (`architecture.md` §4 "Removed Entities"; §21 Scope Boundaries).

**Scope note — UC-006 placement rationale (v1.1 addition):** UC-006 (Visitor Analytics/Tracking Logging) is placed entirely in **S0** rather than as its own sprint or split across S1.A/S1.B/S1.C, because `architecture.md` §3 classifies it as **"Cross-cutting / Infrastructure"** with zero dependency on the `Products` collection or on any specific page's business logic: the capture mechanism is a single Next.js Middleware file (`src/middleware.ts`) matched against route *patterns* (`/`, `/products/:path*`, `/about`) that are already fixed by `architecture.md` §24's folder structure — the Middleware does not need the Home/Detail/About page components to be fully built to attach to those routes, only the route paths to exist as planned. Building it in S0 alongside the other cross-cutting infrastructure (Payload Core, shared UI library, architecture enforcement) means S1.A/S1.B/S1.C need no awareness of it at all — each of those sprints' pages simply inherit passive logging "for free" the moment their route is live, with zero code change required in any of the three tracks. The one piece of UC-006 that genuinely cannot be *fully* verified until all three storefront pages exist — AC7's requirement that the footer privacy notice appears on Home, Detail, *and* Brand/About — is verified once, together, at **INT-1**, when all three pages are merged onto one branch. This keeps S0 self-contained (it builds and unit-tests the logging middleware and Supabase write path against synthetic requests, plus a component-level check that `Footer.tsx` renders the notice text) while deferring only the cross-page E2E assertion to the sprint that is designed for exactly that kind of verification.

---

## 2. Application Anatomy & Design

### 2.1. Module Identification

**Domain Modules** (from `architecture.md` §3, aligned to the PRD §16 Domain Glossary):

- **Storefront UI** — Home, Product Detail, Brand/About pages (React Server Components) and their client-side interactive islands (carousel, mobile nav toggle).
- **Payload Collections** — `Products`, `Media`, `Users` collection schemas, field validation, access-control rules (the CMS-managed domain model).

**Infrastructure Modules:**

- **Payload Core (embedded)** — Local API, REST/GraphQL generation, admin UI generation, auth.
- **Data Access** — `@payloadcms/db-postgres` adapter, connection pooling, migrations.
- **Media Storage Adapter** — Supabase Storage upload/serve.
- **Visitor Analytics Logging** *(v1.1)* — Cross-cutting/infrastructure module supporting UC-006: captures passive request metadata (IP, geolocation, UA, referrer, landing path, UTM params) on every storefront page load and writes it directly to `visitor_logs` in Supabase Postgres, entirely bypassing the Payload Collections/Payload Core modules above. Built in S0 (`src/middleware.ts`, `src/lib/visitor-logging.ts`).

**Shared Module:**

- **Shared UI Library** — `PageShell`, `Header`/`TopNav`, `Footer`, `Button`, `Badge`, `LoadingSkeleton`, `ErrorState`, `EmptyState` (design-system primitives, Section 2.3).
- **Shared Utilities** — `formatINR()`, `isValidAbsoluteUrl()`, shared TypeScript types generated from Payload config.

### 2.2. Module Responsibilities and Interfaces

| Module | Owns | Consumed by |
|---|---|---|
| Storefront UI | Page rendering, route composition, client-side interactivity (carousel index, nav toggle) | End users (Visitor) |
| Payload Collections | Data schema, field validation, access-control functions, the `afterChange` revalidation hook | Payload Core; queried by Storefront UI via Local API |
| Payload Core (embedded) | Local API surface, REST/GraphQL route generation, admin UI generation, session auth | Storefront UI (Local API calls); Content Operator (admin UI, REST) |
| Data Access | Schema migrations, query execution, connection pooling | Payload Core exclusively — no module bypasses this to talk to Postgres directly |
| Media Storage Adapter | Image upload/serving via Supabase Storage | Payload Core (Media collection); `next/image` on the storefront |
| Shared UI Library | Presentational primitives with no business logic | Storefront UI pages/feature components |
| Shared Utilities | Currency formatting, URL validation, generated types | Storefront UI, Payload Collections (validation), tests |
| **(v1.1)** Visitor Analytics Logging | Request-metadata capture (IP, geolocation, UA, referrer, landing path, UTM) and a direct, non-blocking write to the `visitor_logs` table in Supabase Postgres | Every storefront route (`/`, `/products/:path*`, `/about`) — runs ahead of the Storefront UI module for every request; has **no** consumer relationship with Payload Collections/Payload Core (writes to a standalone table those modules never touch) |

**Interfaces:** Storefront UI → Payload Collections is *always* mediated by Payload Core's Local API (`payload.find(...)`, `payload.findByID(...)`) — no module queries Postgres directly. Payload Collections → Data Access is Payload's own internal adapter wiring (not application code). No domain module has a direct dependency on another domain module — `Products` collection has no relationship to any `Brand/About` content (which is static, not a collection at all, per `architecture.md` §4/ADR-007). **(v1.1)** Visitor Analytics Logging → Data Access is the **one deliberate exception** to the "Local API only" interface rule: it uses `@supabase/supabase-js` to write directly to Postgres via the `service_role` key, bypassing Payload Core and Data Access entirely, because `visitor_logs` is explicitly not a Payload collection (`architecture.md` §6 migration-strategy exception).

### 2.3. Folder Structure

*(Copied from `architecture.md` §24 — the already-validated production folder structure; no existing scaffold to reconcile against, since the workspace is empty of application code.)*

```text
src/
  app/
    (storefront)/                    # Route group: public-facing pages
      page.tsx                       # Home (UC-001, UC-003 spotlight)
      products/
        [id]/
          page.tsx                   # Product Detail (UC-002, UC-003)
      about/
        page.tsx                     # Brand/About (UC-004)
      layout.tsx                     # Shared PageShell wrapper for storefront routes
      error.tsx                      # Route-segment error boundary (Section 11 of architecture.md)
    admin/
      [[...segments]]/
        page.tsx                     # Payload admin mount (UC-005)
    api/
      [...slug]/
        route.ts                     # Payload REST/GraphQL mount
      health/
        route.ts                     # Custom /api/health liveness route
  collections/
    Products.ts                      # Schema + access control + afterChange revalidation hook
    Media.ts                         # Schema + access control
    Users.ts                         # Payload auth-enabled collection (Content Operator accounts)
  components/
    ui/                              # shadcn/ui primitives: button, badge, skeleton, carousel primitive
      Button.tsx
      Badge.tsx
      LoadingSkeleton.tsx
    layout/                          # Cross-page shared layout components
      PageShell.tsx
      Header.tsx
      Footer.tsx
    products/                        # Feature components specific to the Product domain
      ProductCard.tsx
      ProductCarousel.tsx
      FeaturedSpotlight.tsx
      SpecTable.tsx
      FragranceNotesBreakdown.tsx
      BuyButton.tsx
    feedback/                        # Cross-page error/empty state components
      ErrorState.tsx
      EmptyState.tsx
  lib/
    payload.config.ts                # Root Payload 3.x config (collections, db adapter, upload adapter)
    utils.ts                         # formatINR(), isValidAbsoluteUrl()
    getPayloadClient.ts              # Thin wrapper around getPayload() for Server Components
    visitor-logging.ts               # (v1.1, UC-006) logVisitorPageView() — direct Supabase write, service_role key
  middleware.ts                      # (v1.1, UC-006) Next.js Edge Middleware — captures request metadata,
                                      #   waitUntil-schedules the non-blocking visitor_logs write; matcher: / , /products/:path* , /about
  styles/
    globals.css                      # Tailwind base + Golden Alchemist theme layer
e2e/                                 # Playwright E2E specs (per-sprint subfolders, Section 3)
  home/
  detail/
  buy/
  about/
  content-operator/
supabase/                            # (v1.1, UC-006) Supabase-CLI-managed SQL, outside Payload's Drizzle pipeline
  migrations/
    <timestamp>_create_visitor_logs.sql   # visitor_logs table DDL + RLS default-deny policy
    <timestamp>_visitor_logs_retention_job.sql  # pg_cron daily purge job registration (ADR-011)
.dependency-cruiser.js               # Architecture enforcement config (Section 2.4)
tailwind.config.ts                   # Golden Alchemist design-token theme extension
payload.config.ts                    # Re-exported from src/lib/payload.config.ts per Payload 3.x convention
```

PascalCase for component files/exports (`ProductCard.tsx`); co-located Vitest unit tests (`ProductCard.test.tsx`) next to each component (per `architecture.md` §24).

### 2.4. Coding Standards & Architectural Patterns

*(Extracted from `architecture.md` §2, §3, §7, §10, §24 and the tech stack's standard conventions — this project has no existing lint config to read since it is greenfield; Sprint 0 creates these configs from scratch and this section is what they encode.)*

**Architecture Patterns:**

- **Data Access:** Payload Local API pattern — only React Server Components and Next.js Route Handlers call `getPayload()` / the shared `getPayloadClient()` wrapper. Client Components (`"use client"`) never import `payload.config.ts` or call Payload directly — they receive data via props from their parent Server Component. **(v1.1 exception)** The UC-006 visitor-logging path (`src/middleware.ts` → `src/lib/visitor-logging.ts`) is the **one deliberate exception**: it writes directly to Supabase Postgres via `@supabase/supabase-js` and the `service_role` key, entirely bypassing Payload's Local API and Data Access adapter, because `visitor_logs` is explicitly not a Payload collection (`architecture.md` §6/§7). This exception is scoped to this single module only — no other code path may bypass the Local API this way.
- **Business Logic:** Business rules that are enforceable at the data layer (published-only visibility, required-field validation) live in `src/collections/*.ts` access-control functions and Payload field `validate` functions — not duplicated as ad hoc `if` checks in page components. UI-only conditionals (Buy button disabled state) live in the component that renders them (`BuyButton.tsx`), using the shared `isValidAbsoluteUrl()` utility.
- **API Design:** Payload's auto-generated REST routes are treated as an internal-only contract for this release (no `/api/v1/` prefix — `architecture.md` §7 Versioning Strategy). The one hand-written route (`/api/health`) follows the same plural/no-verb convention informally (single-purpose liveness route, GET only).
- **Error Handling:** Every Local API call from a Server Component is wrapped in `try/catch`; on failure, render the shared `ErrorState` component instead of throwing. Each route segment additionally has a Next.js `error.tsx` boundary as a last-resort fallback (`architecture.md` §11). Never let a Payload/Postgres error reach the user as an unhandled Next.js error page.
- **Auth / Security:** Content Operator auth is entirely Payload's built-in `Users` collection auth (`auth: true`) — no custom auth code is written. Visitor is always anonymous; no session/token handling exists on the storefront side at all.
- **State Management (Frontend):** No global state library. Data is server-rendered via RSC + Local API. The *only* client-side state is local UI state (carousel index, mobile-nav open/closed) via React `useState` inside the specific client component that needs it — never lifted higher than necessary.
- **Component Structure:** One component per file; named exports; props typed with a TypeScript `interface Props { ... }` declared above the component; no inline `style={{}}` — use Tailwind utility classes and the theme tokens (Section 1.2) exclusively.
- **Dependency Direction:** `components/ui/**` (shadcn primitives) must never import from `components/products/**` or `components/layout/**` — it is the lowest layer. `components/layout/**` may import from `components/ui/**` only. `components/products/**` may import from `components/ui/**`, `components/layout/**` (rare), and `lib/**`. `app/**` pages may import from any `components/**` or `lib/**`, but no `components/**` file may import from `app/**` (no upward dependency).

**Naming Conventions:**

- **Files:** PascalCase for React component files (`ProductCard.tsx`, `BuyButton.tsx`); PascalCase for Payload collection files (`Products.ts`, `Media.ts`, `Users.ts`); camelCase for utility/lib files (`utils.ts`, `getPayloadClient.ts`); Next.js reserved filenames stay lowercase (`page.tsx`, `layout.tsx`, `error.tsx`, `route.ts`) per framework convention.
- **Components / Interfaces:** PascalCase; props interfaces suffixed `Props` (`ProductCardProps`); Payload collection config objects use the collection's plural noun as the exported const (`export const Products: CollectionConfig = {...}`).
- **Variables / Functions:** camelCase; booleans prefixed `is`/`has`/`can` (`isValidAbsoluteUrl`, `hasFragranceNotes`); Payload field-level `validate` functions named `validate{FieldName}`.
- **DB Columns:** snake_case, matching `architecture.md` §6 exactly (`category_label`, `image_id`, `purchase_url`, `created_at`) — Payload's Postgres adapter maps camelCase collection fields (`categoryLabel`) to snake_case columns automatically; never hand-author a migration that deviates from this mapping.
- **API Endpoints:** Payload defaults — plural resource nouns, no verbs (`/api/products`, `/api/media`); the one custom route is `/api/health` (singular, describes a concept not a resource collection).
- **Constants / Enums:** SCREAMING_SNAKE_CASE for module-level constants (`MAX_CAROUSEL_ITEMS`); Payload `enum`/`select`/`radio` field option values stay lowercase per Payload convention (`'draft' | 'published'`).
- **Test Files:** `[Component].test.tsx` co-located with the component (Vitest + React Testing Library); `e2e/[feature]/[sprint-label]-[feature].spec.ts` for Playwright E2E (e.g. `e2e/home/s1a-browse-catalog.spec.ts`).
- **Branch Names:** `feature/{sprint-id}-{short-description}` (e.g. `feature/s1a-browse-home-page`) per the Sprint Branch task format (Section 3).

**Code Organization Rules:**

- **File placement:** Feature-specific UI goes in `src/components/products/`; anything reused across ≥2 features goes in `src/components/ui/` or `src/components/layout/`; page-level composition-only logic stays in `src/app/(storefront)/**/page.tsx` — no business logic in route files themselves.
- **Import order:** (1) Node/React built-ins, (2) third-party packages, (3) internal absolute imports (`@/components/...`, `@/lib/...`), (4) relative imports — enforced by ESLint `import/order` (configured in Sprint 0).
- **Max file length:** 300 lines per file; split a component into a sub-component if exceeded (e.g. extract `ProductCarouselControls` from `ProductCarousel` if it grows past this).
- **Barrel exports:** Not used for this scope (small, flat component tree) — import directly from the specific file (`@/components/products/ProductCard`), matching Next.js App Router's own convention of no barrel re-exports for page-level tree-shaking clarity.

**Lint / Formatter Rules** (configured from scratch in Sprint 0 — this is the standard this project adopts):

- ESLint: `@typescript-eslint/no-explicit-any` (error — use generics or `unknown` + narrowing); `no-console` (warn — use structured logging per Payload's Pino logger on the server side); `react-hooks/exhaustive-deps` (error, no suppression); `import/order` (error, groups as above); `jsx-a11y/*` recommended ruleset enabled (directly supports the WCAG 2.1 AA NFR, `architecture.md` §9).
- Prettier: 2-space indent, single quotes, trailing commas (`all`), 100-char print width, semicolons required.
- TypeScript: `strict: true` in `tsconfig.json`; no `// @ts-ignore` without an inline comment explaining why.

**Sprint Usage Rule:** Every sprint task sub-bullet that creates or modifies code inlines the relevant rule from this section by name — never "follow Section 2.4" or "see architecture.md." Every sprint's Sprint Branch task runs `pnpm arch:check` (dependency-cruiser, configured in Sprint 0) and requires 0 violations before commit.

---

## Section 3: Incremental Delivery Plan

### HITL Overview

This plan uses **one parallel cycle**: after Sprint 0 (Groundwork, which also serves as the Shared Foundation per `architecture.md` §24's explicit "Sprint 0 flag"), three feature sprints (S1.A Home/UC-001, S1.B Detail/UC-002, S1.C Brand-About/UC-004) are **architecturally independent** — none imports another's feature code, and each depends only on Sprint 0's shared components and the `Products` collection. They run as parallel tracks, followed by one Integration Sprint (INT-1). The remaining two use cases (UC-003 Buy Redirect, UC-005 Content Operator CMS) are genuinely sequential afterward because they modify pages built in the parallel cycle (UC-003) or verify end-to-end behavior across all of them (UC-005). A Deployment Sprint (S4) closes the plan.

**(v1.1 addition)** **UC-006 (Visitor Analytics/Tracking Logging)** is folded into **Sprint 0** as a cross-cutting infrastructure capability (see the "UC-006 placement rationale" scope note in Section 1.5) and does not add a new sprint or a new parallel track to the structure above — it adds tasks/ACs to S0 and one verification task to INT-1 only. It does not change the parallel-cycle justification: UC-006 has zero dependency on the `Products` collection or on S1.A/S1.B/S1.C's page code, so its presence in S0 does not create any new blocking relationship for the parallel cycle.

Every HITL checkpoint below follows the two-stage pattern: **Harvey validates first** (runs tests, hits the URL/command, checks the AC) — **only when that passes** does Harvey ask the user (`[User Input]`) to confirm. Sign-off (Harvey + Human) is required before any dependent sprint begins.

**Dependency & Effort Table** (Step B analysis — every cross-sprint dependency classified as a genuine implementation-time blocker (IMPL) or a mockable runtime-only call (RUN); no dependency in this plan is `RUN` because there is no network boundary between "producer" and "consumer" code in a Modular Monolith — a dependency here means literal code/schema existing to import or attach to):

| Sprint | Label | Type | Dep. Classification | Blocking Artifact | EPS | Human Effort (hrs) | Agent Effort (hrs) | Parallel Track | Human-hrs Saved | Agent-hrs Saved |
|---|---|---|---|---|---|---|---|---|---|---|
| S0 | Groundwork & Shared Foundation (incl. UC-006 v1.1) | SEQUENTIAL | — | — (first sprint) | start | 26 | 7.5 | — | — | — |
| S1.A | Browse Home Page (UC-001) | PARALLEL | IMPL | `Products` collection compiled + migrated; `PageShell`, `Header`, `Footer`, `ErrorState`, `EmptyState` components (all S0) | S0 | 14 | 3.5 | S1.B, S1.C | — (critical path) | — (critical path) |
| S1.B | View Product Detail (UC-002) | PARALLEL | IMPL | `Products` collection compiled + migrated; `PageShell`, `ErrorState` components (all S0) — no dependency on S1.A's carousel code | S0 | 14 | 3.5 | S1.A, S1.C | 14 | 3.5 |
| S1.C | Brand/About Page (UC-004) | PARALLEL | IMPL | `PageShell`, `Header`, `Footer` components (S0) only — no `Products` collection dependency at all (static content, ADR-007) | S0 | 8 | 2 | S1.A, S1.B | 8 | 2 |
| INT-1 | Integration Sprint 1 | INTEGRATION | IMPL | Merged output of S1.A + S1.B + S1.C required before cross-track regression runs | S1.A ✅, S1.B ✅, S1.C ✅ | 8 | 2 | — | — | — |
| S2 | Buy External Redirect (UC-003) | SEQUENTIAL | IMPL | `HomePage` component tree (S1.A, for the Featured Spotlight) + `ProductDetailPage` component tree (S1.B, for the Buy control) — `BuyButton` is inserted into both existing page trees and cannot compile/attach without them existing | INT-1 | 10 | 2.5 | — | — | — |
| S3 | Content Operator CMS Management (UC-005) | SEQUENTIAL | IMPL | `BuyButton` + `isValidAbsoluteUrl` (S2, for AC3's Buy-state verification) and `HomePage`/`ProductDetailPage` (S1.A/S1.B, to verify CMS changes appear live) | S2 | 12 | 3 | — | — | — |
| S4 | Deployment Sprint | DEPLOYMENT | IMPL | Fully verified application code from S3 (all 6 use cases) — cannot deploy an incomplete feature set | S3 | 10 | 2.5 | — | — | — |

**(v1.1 note on S0's effort increase:** +6 Human-hrs / +1.5 Agent-hrs added to S0's row above versus the original v1.0 plan, reflecting the UC-006 tasks (visitor-logging Middleware + Supabase write path, `visitor_logs` SQL migration + RLS, `pg_cron` retention job, footer privacy notice, and their unit/component tests) added by this amendment. UC-006 is a S0-only addition — it does not touch S1.A/S1.B/S1.C's own effort figures, so the parallel-cycle savings below (which are computed off S1.A/S1.B/S1.C, INT-1, S2, S3, S4) are unchanged in absolute terms; only the baseline/parallel *totals* shift by the same +6/+1.5 hrs in both scenarios.)*

**Parallelism Time Savings Summary:**

| Scenario | Human Calendar Time | Agent Calendar Time | Notes |
|---|---|---|---|
| Fully sequential (baseline) | 102 hrs / 12.75 working days | 26.5 hrs | No parallelism — S0(incl. UC-006)→S1.A→S1.B→S1.C→INT-1→S2→S3→S4 |
| With parallel cycle (this plan) | 80 hrs / 10.0 working days | 21 hrs | Parallel cycle: S1.A, S1.B, S1.C after S0(incl. UC-006) |
| **Human-hours saved** | **22 hrs = 2.75 working days** | — | |
| **Agent-hours saved** | — | **5.5 hrs** | |
| **Speedup ratio (human)** | **1.28×** | — | |
| **Speedup ratio (agent)** | — | **1.26×** | |

**How to read this for a solo developer:** This plan was authored for a single developer (Mohammad Taha, sole stakeholder/approver on this project). The parallel cycle (S1.A/B/C) is still captured structurally because the dependency analysis found genuine, real architectural independence between Home, Detail, and Brand/About (none imports the others' feature code) — not because a team is assumed. A solo developer executes S1.A → S1.B → S1.C sequentially in whichever order is convenient (they are mutually unblocking, so order doesn't matter) and gets the same result as running them "in parallel" on the calendar; an agent team or a future second developer could genuinely run them concurrently and realize the 2.75-day / 5.5-agent-hour savings above.

**Integration Sprint Cadence:** The parallel cycle (S1.A/B/C) is followed immediately by INT-1, satisfying the Integration Sprint requirement for that cycle. After INT-1, only 3 sequential sprints remain (S2, S3, S4) before the plan ends — under the 5-consecutive-sprint threshold that would otherwise require a second Integration Sprint, so no additional INT-N is inserted.

### Sprint Dependency Matrix

| Sprint | Label | Platform / Work Type | Depends On | Can Run In Parallel With | Assigned To | Notes |
|---|---|---|---|---|---|---|
| S0 | Groundwork & Shared Foundation | All | — | — | Any | Sequential; must complete first. Doubles as the "Shared Foundation" sprint per `architecture.md` §24's Sprint 0 flag — no separate S1.S is needed. **(v1.1)** Also implements UC-006 (Visitor Analytics/Tracking Logging) — `visitor_logs` migration, Middleware, footer privacy notice — a cross-cutting capability independent of `Products`/Home/Detail/About. |
| S1.A | Browse Home Page (UC-001) | Backend + Frontend | S0 ✅ Harvey Sign-Off AND ✅ Human Sign-Off | S1.B, S1.C | `[Ask User]` | Implements Home carousel against real `Products` collection |
| S1.B | View Product Detail (UC-002) | Backend + Frontend | S0 ✅ Harvey Sign-Off AND ✅ Human Sign-Off | S1.A, S1.C | `[Ask User]` | Implements Detail page; no dependency on S1.A |
| S1.C | Brand/About Page (UC-004) | Frontend | S0 ✅ Harvey Sign-Off AND ✅ Human Sign-Off | S1.A, S1.B | `[Ask User]` | Static content only; no `Products` collection dependency |
| INT-1 | Integration Sprint 1 | All | S1.A ✅, S1.B ✅, S1.C ✅ (all Harvey + Human Sign-Off) | — | Any | Merges the 3 tracks; full regression across Home/Detail/About. **(v1.1)** Also verifies UC-006 AC7 (footer privacy notice visible on all 3 merged pages) and re-confirms visitor logging never blocks/delays render on any of the 3 pages. |
| S2 | Buy External Redirect (UC-003) | Backend + Frontend | INT-1 ✅ Harvey Sign-Off AND ✅ Human Sign-Off | — | `[Ask User]` | Adds shared `BuyButton` to both Home (Featured Spotlight) and Detail |
| S3 | Content Operator CMS Management (UC-005) | Backend + Frontend | S2 ✅ Harvey Sign-Off AND ✅ Human Sign-Off | — | `[Ask User]` | Verifies CRUD, access control, and revalidation end-to-end |
| S4 | Deployment Sprint | All | S3 ✅ Harvey Sign-Off AND ✅ Human Sign-Off | — | Any | Vercel + Supabase production cutover |

### THE SPRINT PLAN

---

#### S0: Groundwork, Scaffolding & Shared Foundation

**Project Context:** This sprint stands up the entire technical foundation — the Next.js + Payload + Supabase application shell, the real `Products`/`Media`/`Users` data model, the shared UI component library, and all tooling (tests, lint, architecture enforcement) — so that every feature sprint that follows is a pure vertical slice with no infrastructure work remaining. Per `architecture.md` §24's explicit "Sprint 0 flag," this sprint also serves as the Shared Foundation for the S1.A/S1.B/S1.C parallel cycle — no separate S1.S sprint is needed. **(v1.1 addition)** This sprint also implements **UC-006 (Visitor Analytics/Tracking Logging)** in full: the `visitor_logs` Supabase table + RLS + retention job, the non-blocking Middleware capture path, and the footer privacy notice — a cross-cutting infrastructure capability with no dependency on `Products`/Home/Detail/About (see Section 1.5 scope note). Only UC-006 AC7's cross-page footer check is deferred to INT-1, once all three storefront pages exist together.

**Previous Sprint's Accomplishments:** Fresh project — no prior sprint. Workspace is pure greenfield (confirmed: no application code exists).

**Sprint Execution Metadata:**
- Execution Mode: SEQUENTIAL
- Runs Parallel With: None — first sprint, no predecessor to parallelize against
- Depends On: None — first sprint
- Start Condition: Development plan Sign-Off recorded; `[User Input]` values from Section 1.4 collected (repo URL, Supabase dev project + `DATABASE_URI`, Supabase Storage keys, `PAYLOAD_SECRET`)
- Platform / Work Type: All
- Track: — (not part of the parallel cycle; precedes it)
- API Contract: N/A — no separate frontend/backend network boundary exists in this Modular Monolith (Section 1.1); the "contract" is the `Products`/`Media`/`Users` collection schema itself, defined once in this sprint
- Assigned To: `[Ask User]`
- Integration Sprint: N/A (this sprint precedes INT-1, is not itself an integration sprint)

**Standards Applied This Sprint** (§2.4 of `development-plan.md` — immutable; applies to all tasks below):
- Architecture: Data Access pattern (Local API only from Server Components/Route Handlers) — established now via `getPayloadClient()`, enforced on every future sprint
- Naming: PascalCase components/collections, camelCase utilities/variables, snake_case DB columns (auto-mapped by Payload from camelCase fields)
- Error Handling: `try/catch` + `ErrorState` component pattern — `ErrorState`/`EmptyState` built this sprint for reuse everywhere
- File placement: exact tree per §2.3 — this sprint creates every directory in that tree
- Lint & Architecture Gate: `pnpm arch:check` (dependency-cruiser) — configured and verified in this sprint; `pnpm lint`, `pnpm test` — configured in this sprint
- Not applicable this sprint — Component Structure / State Management rules: no feature components exist yet to apply them to; verified starting S1.A
- **(v1.1)** Architecture: Data Access exception — the UC-006 visitor-logging path (`src/middleware.ts` → `src/lib/visitor-logging.ts`) writes directly to Supabase Postgres via `@supabase/supabase-js` and the `service_role` key, bypassing the Payload Local API entirely (§2.4 exception; `architecture.md` ADR-010).
- **(v1.1)** Naming: `visitor-logging.ts` (camelCase utility file per §2.4); exported function `logVisitorPageView()`; `src/middleware.ts` uses Next.js's reserved lowercase filename convention.
- **(v1.1)** Error Handling: the `visitor_logs` insert runs inside a `waitUntil()`-scheduled promise wrapped in `try/catch`; any failure is logged server-side only and never thrown back to the Middleware's response path (UC-006 AC6 — this is the architectural guarantee, not a best-effort behavior).

**Acceptance Criteria:**
- AC1: `pnpm dev` starts the Next.js app; `/admin` loads Payload's login screen; a Content Operator account can be created and logged into.
- AC2: `payload migrate` runs cleanly against the configured Supabase Postgres instance, creating `products`, `media`, `users` tables matching `architecture.md` §6 exactly (column names, types, constraints).
- AC3: All 8 shared components (`PageShell`, `Header`, `Footer`, `Button`, `Badge`, `LoadingSkeleton`, `ErrorState`, `EmptyState`) render in isolation (Vitest/RTL smoke test) with the Golden Alchemist Tailwind theme applied.
- AC4: `pnpm arch:check` reports 0 violations on the scaffolded code, and demonstrably catches a deliberately-introduced violation (e.g. a `components/ui` file importing from `components/products`) when tested.
- AC5: `GET /api/health` returns `200` with a real Payload query executed (not a stub `200`).
- AC6: No `MOCK_PRODUCTS`-style inline array exists anywhere in `src/` (Section 1.5 verification).
- **AC7 (UC-006 AC1, v1.1):** Given a request hits any of the 3 matcher routes (`/`, `/products/:path*`, `/about`), when the Middleware runs, then one row is written to `visitor_logs` capturing IP, timestamp, user agent, referrer (if present), landing page path, and UTM params (if present), and `NextResponse.next()` is returned synchronously with no measurable added latency from the logging write.
- **AC8 (UC-006 AC2/AC3, v1.1):** Given Vercel's geolocation headers (`x-vercel-ip-country`, `x-vercel-ip-city`) are present, when the visit is logged, then `country_code`/`city` are stored from those headers; given the headers are absent (e.g. local dev), then `country_code`/`city` are stored as `NULL` and the row is still written.
- **AC9 (UC-006 AC4/AC5, v1.1):** Given no `Referer` header or no UTM query parameters are present on the request, when the visit is logged, then `referrer`/`utm_*` columns are stored as `NULL` — not treated as an error.
- **AC10 (UC-006 AC6, v1.1):** Given the `visitor_logs` insert throws or times out (simulated Supabase failure), when a request is served, then the Middleware still returns `NextResponse.next()` synchronously and no error is surfaced to the caller.
- **AC11 (UC-006 AC7, v1.1 — component-level; cross-page check deferred to INT-1):** Given the `Footer` component is rendered in isolation, then it displays the privacy-notice text ("We log visit data for analytics purposes." — placeholder copy per PRD §15 OQ-9) visibly and consistently with existing footer typography.
- **AC12 (UC-006 AC8, v1.1):** Given the `pg_cron` extension is enabled and the retention job SQL is applied, then a manually-triggered run of the job deletes `visitor_logs` rows with `created_at` older than 180 days and leaves newer rows untouched.

**HITL Checkpoints:**
- Harvey validates: runs `pnpm install && pnpm dev`, confirms `http://localhost:3000` renders the Next.js default/placeholder page without error, confirms `http://localhost:3000/admin` loads Payload's setup screen, confirms `payload migrate` succeeds against the provided `DATABASE_URI`. Only when all three pass → `[User Input]` "Please verify locally: (1) `http://localhost:3000/admin` loads and you can create your Content Operator account, (2) the 3 tables (`products`, `media`, `users`) exist in your Supabase project's Table Editor. Confirm both before I proceed." Wait for confirmation.
- Harvey validates: runs the Vitest smoke tests for all 8 shared components and the `pnpm arch:check` violation-catching test. Only when both pass → `[User Input]` "Please open `http://localhost:3000` and confirm the Golden Alchemist theme (Bodoni Moda headings, Alchemist Gold accents, sharp 0-radius corners) is visibly applied, not default Tailwind styling." Wait for confirmation.
- **(v1.1)** Harvey validates: seeds a handful of synthetic requests against a locally-running dev server hitting `/`, `/products/1` (or any placeholder route matching the pattern), and `/about`; confirms one `visitor_logs` row is written per request with IP/timestamp/UA/landing-path captured, confirms rows created with no `Referer`/UTM params store `NULL` rather than erroring, confirms a simulated Supabase outage (temporarily invalid `SUPABASE_SERVICE_ROLE_KEY`) still returns a normal page response with no visible delay/error. Only when all pass → `[User Input]` "Please confirm the footer shows the privacy notice text, and that browsing the app feels exactly as fast as before — the visitor-logging Middleware should be completely invisible to you." Wait for confirmation.
- Sprint completion: Harvey validates all AC1–AC12 pass locally, then `[User Input]` "All Sprint 0 infrastructure verified — including UC-006 visitor analytics logging — ready to commit and proceed to the parallel cycle (S1.A/S1.B/S1.C)?" Wait for "yes" before commit.

**Tasks:**

1. **Repository Synchronization & Project Scaffolding**
   - Initialize the single repo at the `[User Input]` Git URL from Section 1.4 (`git init` + remote add, or clone if the remote already has an initial commit).
   - Scaffold via `npx create-next-app@latest` (App Router, TypeScript, Tailwind CSS, `src/` directory, App Router — all `yes`).
   - Install and wire Payload 3.x per its official Next.js integration guide: `pnpm add payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical`; create `src/lib/payload.config.ts` (root config, re-exported per convention at repo root as `payload.config.ts`) and the `src/app/(payload)/admin/[[...segments]]/page.tsx` + `src/app/(payload)/api/[...slug]/route.ts` mounts per §2.3.
   - Create `.gitignore` (node_modules, `.env`, `.next`, coverage output) and `.env.example` documenting `DATABASE_URI`, `PAYLOAD_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` with placeholder values only (§1.3).
   - AC: `pnpm dev` boots without error; `/admin` reachable.

2. **Environment Configuration & Payload Collections (Database Setup)**
   - Create `.env` locally (gitignored) from the `[User Input]` values collected in Section 1.4.
   - Create `src/collections/Products.ts` — full field schema per `architecture.md` §6 (sku, name, categoryLabel, price, size, description, keyActives, phLevel, format, fragranceTopNotes, fragranceHeartNotes, fragranceBaseNotes, badge enum NEW/BESTSELLER, image relationship to Media, purchaseUrl with a `validate{PurchaseUrl}` function rejecting non-absolute-URL strings per §2.4 naming convention, status enum draft/published default draft). Add access control (§2.4 Business Logic pattern): `read` — public may read only `status === 'published'`, authenticated may read all; `create`/`update`/`delete` — authenticated only. Add an `afterChange` hook calling Next.js `revalidatePath('/')` and `revalidatePath('/products/[id]', 'page')` (ADR-009) — harmless no-op until S1.A/S1.B pages exist.
   - Create `src/collections/Media.ts` — Payload upload collection wired to the Supabase Storage adapter (`@payloadcms/storage-s3` pointed at Supabase's S3-compatible endpoint), same authenticated-write/public-read access pattern as Products.
   - Create `src/collections/Users.ts` — `auth: true` collection (email + password), Payload's default lockout fields (`loginAttempts`, `lockUntil`); no public read/create (§10 of `architecture.md`).
   - Generate and commit the initial migration: `payload migrate:create` then `payload migrate` against the dev `DATABASE_URI`; verify the `products`/`media`/`users` tables match §6's column list exactly, including the partial index on `products.status WHERE status = 'published'`.
   - AC: `payload migrate` succeeds; schema matches `architecture.md` §6 column-for-column; a Content Operator account can be created via `/admin` and logged into.

3. **Shared UI Library & Golden Alchemist Tailwind Theme**
   - Configure `tailwind.config.ts` theme extension: Golden Alchemist color palette (Alabaster, Alchemist Gold `#735c00`/`#d4af37`, Champagne Gold, Obsidian `#1A1A1A`), font families via `next/font` self-hosted Bodoni Moda (display), Public Sans (body), JetBrains Mono (technical data), 0-radius shape system, 4/8/12-col responsive breakpoints per §9 of `architecture.md`.
   - Install shadcn/ui CLI and add the `button`, `badge`, `skeleton` primitives into `src/components/ui/` (Component Structure pattern: one component per file, named export, `Props` interface).
   - Build `src/components/layout/PageShell.tsx`, `Header.tsx` (sticky frosted-glass nav; every icon-only control gets an explicit `aria-label` — the WCAG 2.1 AA remediation flagged in `architecture.md` §24), `Footer.tsx`.
   - Build `src/components/feedback/ErrorState.tsx` (Section 11 error-handling pattern: accepts a `message` prop, renders inside the page shell without crashing the surrounding tree) and `EmptyState.tsx` ("No products available yet" style, reusable for any empty-collection scenario).
   - Write a co-located Vitest + React Testing Library smoke test for all 8 components (`ComponentName.test.tsx` per §2.4 naming), each asserting it renders without throwing and exposes correct ARIA roles/labels where applicable.
   - AC: all 8 components render in isolation; `Header`'s icon-only controls have non-empty `aria-label` attributes (asserted in the RTL test).

4. **Test Framework & Coverage Setup**
   - Configure Vitest (`vitest.config.ts`) with `@testing-library/react`, `jsdom` environment, coverage via `@vitest/coverage-v8`; add `pnpm test` / `pnpm test:coverage` scripts.
   - Configure Playwright (`playwright.config.ts`) targeting `http://localhost:3000`; create the `e2e/` subfolder tree per §2.3 (`home/`, `detail/`, `buy/`, `about/`, `content-operator/`), each with a placeholder `.gitkeep` for now.
   - Add `@payloadcms/testing` (or an equivalent in-memory/test-DB helper) wired to a disposable test Postgres schema so future collection access-control tests don't touch the dev DB.
   - AC: `pnpm test` runs 0 tests with 0 errors (empty suite passes cleanly); `pnpm exec playwright test` runs against an empty `e2e/` tree without config errors.

5. **Architecture Enforcement Tooling**
   - Install `dependency-cruiser`; author `.dependency-cruiser.js` encoding the §2.4 Dependency Direction rule: forbid `components/ui/**` → `components/products/**` or `components/layout/**`; forbid `components/**` → `app/**` (no upward dependency); forbid any file outside `app/**`/`lib/**` from importing `payload.config.ts` directly (Data Access pattern — only Server Components/Route Handlers call `getPayloadClient()`).
   - Add `"arch:check": "depcruise --config .dependency-cruiser.js src"` to `package.json` scripts.
   - Add ESLint config (`.eslintrc.json` or flat config) per §2.4 Lint/Formatter Rules: `@typescript-eslint/no-explicit-any` (error), `no-console` (warn), `react-hooks/exhaustive-deps` (error), `import/order` (error), `jsx-a11y/recommended`. Add Prettier config (2-space, single quotes, trailing commas, 100-char width).
   - Deliberately introduce one violating import (e.g. temporarily import `components/products/ProductCard` from `components/ui/Button.tsx`), run `pnpm arch:check`, confirm it fails with a clear error, then revert the violation.
   - AC: `pnpm arch:check` passes with 0 violations on the real codebase; demonstrably catches the deliberate violation before being reverted.

6. **Infrastructure Smoke-Tests** (mandatory per every front-loaded infra component)
   - **Supabase Postgres:** with the app running, execute a real Payload Local API write + read (`payload.create({ collection: 'users', data: {...} })` then `payload.find(...)`) via a one-off script or the `/admin` UI; confirm no connection/timeout errors in the dev server logs.
   - **Supabase Storage:** upload one real test image via `/admin`'s Media collection UI; confirm the returned `url` is reachable (HTTP 200) and `next/image` renders it on a scratch test page.
   - **Payload Admin Auth:** create a Content Operator account, log out, log back in; confirm the lockout counters (`loginAttempts`/`lockUntil`) increment on 3 deliberate wrong-password attempts, then reset on a successful login.
   - AC: all 3 components operational — smoke tests pass; no startup or connection errors in local dev logs.

7. **Health Check Route, Mock-Data Verification & Documentation**
   - Create `src/app/api/health/route.ts` — a `GET` handler that runs `payload.find({ collection: 'products', limit: 1 })` and returns `200` on success, `503` on failure (per `architecture.md` §12).
   - Grep the entire `src/` tree for `MOCK_PRODUCTS` or any hardcoded product-array literal; confirm zero matches (Section 1.5 verification — the UX prototype's mock array must not have been copied forward).
   - Write `README.md`: local dev setup (env vars, `supabase start` or dev-project instructions, `pnpm dev`), how to run tests (`pnpm test`, `pnpm exec playwright test`), how to run `pnpm arch:check`, and the exposed local URLs (Home `http://localhost:3000`, Admin `http://localhost:3000/admin`, Health `http://localhost:3000/api/health`) — using the actual URLs from this sprint's dev server startup output, not assumed defaults.
   - AC: `curl http://localhost:3000/api/health` returns `200`; `grep -r "MOCK_PRODUCTS" src/` returns no matches; `README.md` accurately describes the working local setup.

8. **(v1.1) Visitor Analytics Logging Infrastructure (UC-006)**
   - Create `supabase/migrations/<timestamp>_create_visitor_logs.sql` — hand-written plain SQL (not a `payload migrate` migration, per `architecture.md` §6 exception): `visitor_logs` table with columns `id`, `ip_address`, `country_code VARCHAR(2) NULL`, `city VARCHAR(128) NULL`, `timestamp`/`created_at`, `user_agent`, `referrer TEXT NULL`, `landing_page_path`, `utm_source`/`utm_medium`/`utm_campaign`/`utm_term`/`utm_content` (all nullable). Enable Row Level Security with a **default-deny** policy: no `anon`/`authenticated` role may `SELECT`/`INSERT`/`UPDATE`/`DELETE`; grant `INSERT` only to the `service_role`. Apply via Supabase CLI/dashboard against the dev project.
   - Create `src/lib/visitor-logging.ts` — export `logVisitorPageView(request: NextRequest): Promise<void>` using a `service_role`-keyed `@supabase/supabase-js` client (constructed here, never in a client component, per the §2.4 Data Access exception): reads IP, `x-vercel-ip-country`/`x-vercel-ip-city` (nullable), `User-Agent`, `Referer` (nullable), `request.nextUrl.pathname`, and each `utm_*` search param (nullable) directly off the request object; wraps the Supabase `.insert()` call in `try/catch` and resolves without throwing on any failure (only `console.error`s server-side).
   - Create `src/middleware.ts` — Next.js Edge Middleware with `export const config = { matcher: ['/', '/products/:path*', '/about'] }`; inside the handler, read all needed metadata synchronously, call `event.waitUntil(logVisitorPageView(request))`, then immediately `return NextResponse.next()` — per `architecture.md` ADR-010, the write is scheduled to run only *after* the response has been sent, guaranteeing the "never block render" business rule by construction.
   - Extend `src/components/layout/Footer.tsx` (built in Task 3) with a small, non-intrusive privacy-notice text line: placeholder copy `"We log visit data for analytics purposes."` (per PRD §15 OQ-9, to be finalized as real legal copy before this ships to real users), styled consistently with existing footer typography — not a modal, banner, or interstitial, and no cookie-consent interaction is required (passive server-side logging, not client-side cookies/tracking scripts).
   - Create `supabase/migrations/<timestamp>_visitor_logs_retention_job.sql` — enable the `pg_cron` extension (`CREATE EXTENSION IF NOT EXISTS pg_cron;`) and register a daily scheduled job: `SELECT cron.schedule('purge-visitor-logs', '0 3 * * *', $$DELETE FROM visitor_logs WHERE created_at < now() - interval '180 days'$$);` (ADR-011).
   - AC: `visitor_logs` table exists with the default-deny RLS policy verified (an anon-key client `SELECT`/`INSERT` attempt is rejected); the `pg_cron` job is registered and visible in `cron.job`; the Middleware is wired to all 3 route patterns.

9. **(v1.1) Visitor Analytics Logging Tests (UC-006)**
   - Write `src/lib/visitor-logging.test.ts` (Vitest) covering: happy path — all fields populated from a fully-formed mock request (AC1); geolocation headers absent → `country_code`/`city` resolve to `null` (AC3); no `Referer` header → `referrer` resolves to `null` (AC4); no UTM params → all `utm_*` fields resolve to `null` (AC5); a simulated Supabase insert failure (mocked client throwing) asserting `logVisitorPageView()` resolves without throwing (AC6).
   - Write a Middleware-level integration test asserting `NextResponse.next()` is returned synchronously regardless of the `logVisitorPageView()` promise's eventual outcome (proves non-blocking behavior structurally, not just "didn't throw").
   - Add a co-located `Footer.test.tsx` assertion (extending the existing S0 Task 3 smoke test) that the privacy-notice text renders in the `Footer` component (component-level check for AC7; the cross-page E2E check that it appears on Home/Detail/About together is deferred to INT-1, since those pages don't exist yet in this sprint).
   - AC: all `visitor-logging.test.ts` cases pass; the Middleware integration test passes; the `Footer.test.tsx` privacy-notice assertion passes.

**Task Concurrency Map:**
- Task 1 (scaffolding) must complete first — every other task depends on the Next.js + Payload project existing.
- Tasks 3 (Shared UI) and 5 (Architecture Enforcement) are independent of each other and of Task 2 (Collections/DB) — they touch disjoint files (`components/**`/`tailwind.config.ts` vs. `.dependency-cruiser.js`/`.eslintrc` vs. `collections/**`) — can run concurrently after Task 1.
- Task 4 (Test Framework) depends only on Task 1 (needs the project to exist to configure Vitest/Playwright against) — can run concurrently with Tasks 2, 3, 5.
- Task 6 (Smoke-Tests) depends on Task 2 (needs collections + DB connection) and Task 3 (Media upload needs the app running with styled pages, though this is a soft dependency — the raw upload works before Task 3 completes) — practically sequenced after Task 2.
- Task 7 (Health route + docs) depends on Task 2 (health route calls `payload.find`) and benefits from Tasks 3–6 being done for accurate README URLs — sequenced last before the Sprint Branch task.
- **(v1.1)** Task 8 (Visitor Analytics Logging Infrastructure) is independent of Tasks 2, 4, 5, 6 — it touches an entirely disjoint file set (`supabase/migrations/**`, `src/lib/visitor-logging.ts`, `src/middleware.ts`) and a standalone table with no relationship to `Products`/`Media`/`Users` (`architecture.md` §5). It has a **soft** dependency on Task 3 only insofar as it extends `Footer.tsx` (built in Task 3) with the privacy-notice line — the Middleware/Supabase-write portion of Task 8 can start immediately after Task 1.
- **(v1.1)** Task 9 (Visitor Analytics Logging Tests) depends on Task 8 only — it is independent of Tasks 4–7's own test/doc work.

**(v1.1) AC Coverage Matrix — UC-006 (Visitor Analytics/Tracking Logging):**

| AC (PRD ID) | Layer | Test File | Test Function | Test Type | Status | Verified By | Date | UI Evidence |
|---|---|---|---|---|---|---|---|---|
| UC-006 / AC1 | Backend | `src/lib/visitor-logging.test.ts` | `logs full metadata on happy path` | Unit | Pending | | | n/a |
| UC-006 / AC1 | Backend | `src/middleware.test.ts` | `NextResponse.next() returned synchronously` | Integration | Pending | | | n/a |
| UC-006 / AC2 / AC3 | Backend | `src/lib/visitor-logging.test.ts` | `stores country/city when headers present; null when absent` | Unit | Pending | | | n/a |
| UC-006 / AC4 | Backend | `src/lib/visitor-logging.test.ts` | `referrer stored null when Referer header absent` | Unit | Pending | | | n/a |
| UC-006 / AC5 | Backend | `src/lib/visitor-logging.test.ts` | `utm fields stored null when no UTM params present` | Unit | Pending | | | n/a |
| UC-006 / AC6 | Backend | `src/lib/visitor-logging.test.ts` | `resolves without throwing on simulated Supabase failure` | Unit | Pending | | | n/a |
| UC-006 / AC7 | Web Frontend | `src/components/layout/Footer.test.tsx` | `renders privacy notice text` | Component | Pending | | | Pending |
| UC-006 / AC7 | E2E | *(deferred to INT-1 — see INT-1 Task 5)* | `test('footer privacy notice visible on Home, Detail, and About')` | E2E Playwright | Pending | | | Pending |
| UC-006 / AC8 | Backend | *(manual SQL verification — `pg_cron` job)* | `purge job deletes rows older than 180 days, leaves newer rows` | Integration | Pending | | | n/a |

**Before sprint ends:** Harvey launches the dev server in background (`pnpm dev &`), records the actual bound URL from the startup log (expected `http://localhost:3000` unless the port was auto-reassigned), updates `README.md` with that exact URL, validates AC1–AC12 against it, and only then proceeds to the HITL checkpoints above.

**PRD Fulfilled (end of sprint):** **(v1.1)** UC-006 (Visitor Analytics/Tracking Logging) — all 8 ACs per `refined-prd.md` v2.1 §8 (mapped to this sprint's AC7–AC12; AC7's cross-page footer-visibility check is verified once all three storefront pages exist together, at INT-1 — see INT-1 Task 6), fully implemented and unit/component-tested. UC-006 is the only PRD use case this sprint fully delivers — this is expected and by design (see the "UC-006 placement rationale" scope note in Section 1.5): S0's remaining tasks (Tasks 1–7) are foundational infrastructure (data model, shared UI library, tooling, architecture enforcement) that unlock UC-001/UC-002/UC-003/UC-004/UC-005 in the sprints that follow, rather than fulfilling a PRD requirement directly themselves.

**Sprint Branch, Commit & Deployment:**
- Branch: `feature/s0-groundwork-scaffolding`.
- Run `pnpm arch:check` (0 violations required), `pnpm lint`, `pnpm test` — all must pass before commit.
- Commit message (minimum 5–8 accomplishment bullets):
  ```
  feat(s0): scaffold Next.js + Payload CMS + Supabase foundation

  - Scaffold Next.js 15 App Router project with TypeScript, Tailwind CSS, pnpm
  - Embed Payload CMS 3.x with Postgres adapter against Supabase; mount /admin and /api
  - Define Products/Media/Users collections matching architecture.md §6 schema exactly,
    with access control (public read = published-only) and an afterChange revalidation hook
  - Generate and commit the initial Drizzle migration; verify schema against Supabase
  - Build shared UI library: PageShell, Header, Footer, Button, Badge, LoadingSkeleton,
    ErrorState, EmptyState with the Golden Alchemist Tailwind theme
  - Configure Vitest+RTL and Playwright test frameworks; configure dependency-cruiser +
    ESLint architecture enforcement (arch:check catches a deliberate violation)
  - Smoke-test Supabase Postgres, Supabase Storage, and Payload admin auth end-to-end
  - Add /api/health liveness route and README with local dev instructions
  - (v1.1) Implement UC-006 Visitor Analytics/Tracking Logging: visitor_logs table + RLS
    default-deny + pg_cron 180-day retention job, non-blocking Middleware capture path,
    and footer privacy notice
  - (v1.1) Add unit and integration coverage for all 8 UC-006 ACs (component-level footer
    check now; cross-page E2E check deferred to INT-1)

  Architecture gate: arch:check passed — 0 violations.
  ```
- Push branch; open PR titled "S0: Groundwork, Scaffolding & Shared Foundation (incl. UC-006 v1.1)" with description sections: Summary, Test Plan (manual verification steps from HITL Checkpoints above), Screenshots (theme applied, admin login, footer privacy notice).
- `[User Input]` "PR pushed — please review and confirm ready to merge before I proceed to the parallel cycle." Wait for confirmation.

**Handover Verification:**
- [ ] All 9 tasks finished
- [ ] `pnpm arch:check` — 0 violations
- [ ] App run locally and user validated (theme applied, admin login works, 3 tables exist)
- [ ] `pnpm test` and `pnpm exec playwright test` executed with 0 failures
- [ ] Infrastructure smoke-tests (Postgres, Storage, Admin Auth) all passed
- [ ] **(v1.1)** `visitor_logs` table + RLS default-deny policy verified; `pg_cron` retention job registered; Middleware wired to all 3 route patterns; footer privacy notice renders
- [ ] **(v1.1)** UC-006 AC Coverage Matrix — all rows `Status: Pass` except the INT-1-deferred cross-page E2E row (noted, not a gap)
- [ ] User confirmed satisfaction

**Verification Criteria:** All of AC1–AC12 met (AC1–AC6 core infrastructure; AC7–AC12 UC-006 v1.1); `pnpm arch:check` 0 violations; no `MOCK_PRODUCTS`-style inline array anywhere in `src/`. **User must confirm** before proceeding to S1.A / S1.B / S1.C (parallel cycle).

---

#### S1.A: Browse Product Catalog — Home Page (UC-001)

**Project Context:** Implements the Visitor's entry point — a Home page rendering every Published product in a horizontal carousel, with graceful empty/error states. This is Track A of the parallel cycle; it depends only on S0.

**Previous Sprint's Accomplishments:** S0 delivered the Next.js + Payload + Supabase foundation, the `Products` collection (schema + access control + revalidation hook), the shared UI library (`PageShell`, `Header`, `Footer`, `ErrorState`, `EmptyState`), all test/lint/arch tooling, and **(v1.1)** UC-006's visitor-logging Middleware (already matcher-wired to `/`) — this sprint requires zero code change to inherit passive visitor logging on the Home route.

**Sprint Execution Metadata:**
- Execution Mode: PARALLEL
- Runs Parallel With: S1.B, S1.C — dependency analysis (Section 3 HITL Overview) confirmed no shared feature code between Home, Detail, and Brand/About beyond S0's shared foundation
- Depends On: S0 ✅ Harvey Sign-Off AND ✅ Human Sign-Off — IMPL: `Products` collection compiled + migrated; `PageShell`, `Header`, `Footer`, `ErrorState`, `EmptyState` components
- Start Condition: S0's Sprint Completion Report shows ✅ Harvey Sign-Off and ✅ Human Sign-Off recorded
- Platform / Work Type: Backend + Frontend
- Track: A (of the S1 parallel cycle)
- API Contract: N/A — Local API call defined inline against the S0 `Products` collection; no separate contract document needed (Section 1.1)
- Assigned To: `[Ask User]`
- Integration Sprint: INT-1 (gates on this sprint plus S1.B, S1.C)

**Standards Applied This Sprint** (§2.4 of `development-plan.md` — immutable):
- Architecture: Data Access pattern — Home page (`src/app/(storefront)/page.tsx`, a Server Component) calls `getPayloadClient().find({ collection: 'products', where: { status: { equals: 'published' } } })` directly; no client-side fetch.
- Error Handling: the Local API call is wrapped in `try/catch`; on failure render `ErrorState`; `error.tsx` boundary is the last-resort fallback (already scaffolded in S0's `src/app/(storefront)/error.tsx`).
- Component Structure: `ProductCard` and `ProductCarousel` are new files in `components/products/`, one component per file, `Props` interfaces, no inline styles.
- State Management: carousel index is local `useState` inside `ProductCarousel.tsx` (a `"use client"` component) — no global store.
- Naming: `ProductCard.tsx`, `ProductCarousel.tsx` per PascalCase convention; co-located `ProductCard.test.tsx`, `ProductCarousel.test.tsx`.
- Lint & Architecture Gate: `pnpm arch:check` — 0 violations required before commit (this sprint must not introduce a `components/products` → `app/**` upward import).
- Not applicable this sprint — DB Column naming rule: no new DB fields introduced (reads existing `Products` schema from S0).

**Relevant Requirements & User Stories:**
- UC-001: Browse Product Catalog (Home Page) — "As a Visitor, I want to see all available products on the Home page so that I can discover what Glowrie sells."

**Acceptance Criteria:**
- AC1 (UC-001 AC1): Given the Catalog has 1+ Published products, when a Visitor loads the Home page, then it renders a product carousel containing every Published product with image, name, and price visible.
- AC2 (UC-001 AC2): Given the carousel contains more items than fit in one view, when the Visitor clicks "next," then the carousel scrolls to reveal more products without a full page reload.
- AC3 (UC-001 AC3, sad path): Given the Catalog has zero Published products, when a Visitor loads the Home page, then the system shows the "No products available yet" `EmptyState` instead of an empty/broken carousel.
- AC4 (UC-001 AC4, sad path): Given the Payload CMS backend is unreachable, when a Visitor loads the Home page, then the system shows the `ErrorState` message instead of a blank page or unhandled error.

**HITL Checkpoints:**
- Harvey validates: seeds 4 Published test products via `/admin` (or a seed script), runs `pnpm dev`, hits `http://localhost:3000`, confirms the carousel renders all 4 with image/name/price, confirms "next" scrolls without a full navigation (network tab shows no full document reload). Only when this passes → `[User Input]` "Please open `http://localhost:3000` and confirm the Home carousel looks correct and matches the approved UX design (`docs/ux/ux-design-html/visitor/index.html`)." Wait for confirmation.
- Harvey validates: temporarily un-publishes all 4 products, confirms the `EmptyState` renders; temporarily breaks `DATABASE_URI`, confirms `ErrorState` renders; restores both. Only when both pass → `[User Input]` "Please confirm you're comfortable with the empty-catalog and backend-unreachable messages shown (I've attached screenshots)." Wait for confirmation.
- Sprint completion: Harvey validates all AC1–AC4 pass and the AC Coverage Matrix below is fully `Pass`, then `[User Input]` "S1.A complete — ready to commit? (S1.B and S1.C may proceed independently once each is separately signed off.)" Wait for "yes."

**Tasks:**

1. **Backend: Published-Products Query**
   - Create `src/lib/getPayloadClient.ts` (if not already present from S0) — a thin memoized wrapper around Payload's `getPayload({ config })`, per the §2.4 Data Access pattern (only Server Components/Route Handlers import this).
   - In `src/app/(storefront)/page.tsx`, call `getPayloadClient().find({ collection: 'products', where: { status: { equals: 'published' } }, sort: '-createdAt' })` inside a `try/catch`.
   - AC: the query returns only `published` products; a `draft` product seeded in the same run never appears in the result set.

2. **Frontend: `ProductCard` and `ProductCarousel` Components**
   - Create `src/components/products/ProductCard.tsx` — displays SKU/badge, `next/image` product image, name, key-actives subtitle, `formatINR(price)`. Props interface `ProductCardProps { product: Product }` (using the Payload-generated `Product` type).
   - Create `src/components/products/ProductCarousel.tsx` — a `"use client"` component wrapping a horizontal scroll region with prev/next controls (keyboard-navigable, `aria-label="Previous products"` / `"Next products"` per the §2.4 accessibility rule); accepts `products: Product[]` and renders one `ProductCard` per item; local `useState` for the current scroll offset.
   - Co-located Vitest tests: `ProductCard.test.tsx` (renders name/price/image correctly, omits badge when absent — reusing the "no blank fields" pattern that UC-002 also needs), `ProductCarousel.test.tsx` (renders N cards, "next" button advances scroll state, ARIA labels present).
   - AC: both components pass their co-located tests; `ProductCarousel` is operable via keyboard (Tab + Enter/Arrow keys) per WCAG 2.1 AA.

3. **Frontend: Home Page Composition & States**
   - Compose `src/app/(storefront)/page.tsx`: on successful query with ≥1 result, render `ProductCarousel`; on successful query with 0 results, render `EmptyState message="No products available yet"`; on a caught error, render `ErrorState message="We're having trouble loading our products right now, please check back shortly"` (exact copy from PRD UC-001 AC4).
   - Wrap the page in the `PageShell` (from S0) so `Header`/`Footer` render consistently.
   - AC: all three render branches (populated, empty, error) are reachable and visually distinct; no console errors in any branch.

4. **ISR & Revalidation Wiring**
   - Add `export const revalidate = 3600;` to `src/app/(storefront)/page.tsx` as an ISR fallback window (in case the `afterChange` hook from S0 ever fails to fire).
   - Verify the S0 `afterChange` hook's `revalidatePath('/')` call actually invalidates this page's cache: publish a new product via `/admin`, confirm it appears on `http://localhost:3000` on next load without a manual redeploy or restart.
   - AC: a newly-Published product appears on the Home page within one page load of being saved in `/admin`, with no manual rebuild.

5. **Tests & Code Coverage**

   Run `pnpm test:coverage` and `pnpm exec playwright test e2e/home/`. Coverage threshold: 80% lines on all new files in this sprint (`ProductCard.tsx`, `ProductCarousel.tsx`, the Home `page.tsx` logic).

   **AC Coverage Matrix:**

   | AC (PRD ID) | Layer | Test File | Test Function | Test Type | Status | Verified By | Date | UI Evidence |
   |---|---|---|---|---|---|---|---|---|
   | UC-001 / AC1 | Backend | `src/app/(storefront)/page.test.tsx` | `test_home_query_returns_only_published` | Unit | Pending | | | n/a |
   | UC-001 / AC1 | Web Frontend | `src/components/products/ProductCard.test.tsx` | `renders image, name, and price` | Component | Pending | | | Pending |
   | UC-001 / AC1 | E2E | `e2e/home/s1a-browse-catalog.spec.ts` | `test('carousel shows every published product')` | E2E Playwright | Pending | | | Pending |
   | UC-001 / AC2 | Web Frontend | `src/components/products/ProductCarousel.test.tsx` | `next button advances without reload` | Component | Pending | | | Pending |
   | UC-001 / AC2 | E2E | `e2e/home/s1a-browse-catalog.spec.ts` | `test('clicking next scrolls carousel, no full navigation')` | E2E Playwright | Pending | | | Pending |
   | UC-001 / AC3 | Web Frontend | `src/app/(storefront)/page.test.tsx` | `renders EmptyState when zero published products` | Component | Pending | | | Pending |
   | UC-001 / AC3 | E2E | `e2e/home/s1a-empty-catalog.spec.ts` | `test('shows No products available yet with empty catalog')` | E2E Playwright | Pending | | | Pending |
   | UC-001 / AC4 | Web Frontend | `src/app/(storefront)/page.test.tsx` | `renders ErrorState when Local API throws` | Component | Pending | | | Pending |
   | UC-001 / AC4 | E2E | `e2e/home/s1a-backend-unreachable.spec.ts` | `test('shows graceful error message on backend failure')` | E2E Playwright | Pending | | | Pending |

**Task Concurrency Map:**
- Task 1 (Backend query) and Task 2 (`ProductCard`/`ProductCarousel` components) are independent — Task 2's components accept `product`/`products` props and can be built and unit-tested with fixture data before Task 1's real query exists; they only need to be wired together in Task 3.
- Task 3 (Home page composition) depends on both Task 1 and Task 2 — it wires the real query result into the components.
- Task 4 (ISR/revalidation) depends on Task 3 (the page must exist for `revalidatePath('/')` to target something meaningful).
- Task 5 (Tests) depends on Tasks 1–4 being complete.

**Before sprint ends:** Harvey launches `pnpm dev` in background, records the actual URL (`http://localhost:3000` expected), updates `README.md`'s Home-page section with it, validates AC1–AC4 at that URL, then proceeds to HITL Checkpoints.

**PRD Fulfilled (end of sprint):** UC-001 (Browse Product Catalog — Home Page), all 4 ACs, fully implemented and verified.

**Sprint Branch, Commit & Deployment:**
- Branch: `feature/s1a-browse-home-page`.
- Run `pnpm arch:check` (0 violations), `pnpm lint`, `pnpm test`, `pnpm exec playwright test e2e/home/` — all must pass before commit.
- Commit message:
  ```
  feat(s1a): implement Home page product browsing (UC-001)

  - Add getPayloadClient() wrapper for Local API access from Server Components
  - Query Published products only, sorted by newest first
  - Build ProductCard and ProductCarousel shared feature components with
    keyboard-navigable, ARIA-labeled prev/next controls
  - Compose Home page with populated/empty/error render branches
  - Wire ISR revalidate fallback alongside the S0 afterChange revalidation hook
  - Add unit, component, and Playwright E2E coverage for all 4 UC-001 ACs

  Architecture gate: arch:check passed — 0 violations.
  ```
- Push branch; open PR "S1.A: Browse Home Page (UC-001)" with Summary, Test Plan, and Screenshots (populated/empty/error states).
- `[User Input]` "PR pushed for S1.A — please review. Note: S1.B and S1.C may already be in review independently; merge order between them doesn't matter, only that each is signed off before INT-1." Wait for confirmation.

**Handover Verification:**
- [ ] All 5 tasks finished
- [ ] `pnpm arch:check` — 0 violations
- [ ] App run locally and user validated (populated/empty/error states)
- [ ] Unit, component, and E2E tests executed — 0 failures
- [ ] AC Coverage Matrix — all rows `Status: Pass`, `Verified By`/`Date` filled
- [ ] User confirmed satisfaction

**Verification Criteria:** All 4 ACs met; AC Coverage Matrix fully `Pass`; `pnpm arch:check` 0 violations. **User must confirm** before this track is marked ready for INT-1 (independent of S1.B/S1.C's own sign-off timing).

---

#### S1.B: View Product Detail (UC-002)

**Project Context:** Implements the Product Detail page — full field display (specs, fragrance notes) for a single product, plus the "not found"/"unreachable"/"blank-field omission" sad paths. This is Track B of the parallel cycle; it depends only on S0 and has no dependency on S1.A's carousel code.

**Previous Sprint's Accomplishments:** S0 delivered the foundation (see S1.A for the same list — both tracks share the identical S0 baseline), including **(v1.1)** UC-006's visitor-logging Middleware, already matcher-wired to `/products/:path*` — zero code change needed in this sprint to inherit passive visitor logging on the Detail route.

**Sprint Execution Metadata:**
- Execution Mode: PARALLEL
- Runs Parallel With: S1.A, S1.C
- Depends On: S0 ✅ Harvey Sign-Off AND ✅ Human Sign-Off — IMPL: `Products` collection compiled + migrated; `PageShell`, `ErrorState` components
- Start Condition: S0's Sprint Completion Report shows ✅ Harvey Sign-Off and ✅ Human Sign-Off recorded
- Platform / Work Type: Backend + Frontend
- Track: B (of the S1 parallel cycle)
- API Contract: N/A — Local API `findByID` call defined inline against the S0 `Products` collection
- Assigned To: `[Ask User]`
- Integration Sprint: INT-1

**Standards Applied This Sprint** (§2.4 — immutable):
- Architecture: Data Access pattern — `src/app/(storefront)/products/[id]/page.tsx` calls `getPayloadClient().findByID({ collection: 'products', id })` directly.
- Error Handling: `try/catch` around the Local API call; a `null`/access-denied result and a thrown error are both handled explicitly and distinctly per UC-002 AC2 vs AC3 (see Task 3).
- Component Structure: `SpecTable` and `FragranceNotesBreakdown` are new files in `components/products/`, one component per file, `Props` interfaces.
- Naming: `SpecTable.tsx`, `FragranceNotesBreakdown.tsx`; co-located `*.test.tsx`.
- Lint & Architecture Gate: `pnpm arch:check` — 0 violations required.
- Not applicable this sprint — State Management rule: Detail page has no interactive client-side state (no carousel-equivalent needed here).

**Relevant Requirements & User Stories:**
- UC-002: View Product Detail — "As a Visitor, I want to see a product's full details so that I can decide whether to buy it."

**Acceptance Criteria:**
- AC1 (UC-002 AC1): Given a Published product exists, when a Visitor opens its Detail page, then all populated fields (name, price, size, description, technical specs, fragrance notes) are displayed.
- AC2 (UC-002 AC2, sad path): Given a product has been deleted or unpublished, when a Visitor navigates to its Detail page URL, then the system shows "This product is no longer available" with a link back to Home, instead of an error page.
- AC3 (UC-002 AC3, sad path): Given the CMS backend is unreachable, when a Visitor opens a Detail page, then a graceful `ErrorState` is shown.
- AC4 (UC-002 AC4): Given a product has optional fields left blank (e.g. no badge, no fragrance notes), when the Visitor views the Detail page, then only populated fields render — no blank/placeholder text (e.g. "undefined") appears.

**HITL Checkpoints:**
- Harvey validates: seeds one fully-populated Published product and one with several optional fields blank, hits `http://localhost:3000/products/{id}` for each, confirms all populated fields render for the first and no blank/"undefined" text appears for the second. Only when both pass → `[User Input]` "Please open both Detail page URLs I've noted and confirm the layout matches the approved UX design and no blank fields are visible." Wait for confirmation.
- Harvey validates: navigates to a Detail URL for a deleted/unpublished product, confirms the "no longer available" message + Home link renders (not a raw 404); temporarily breaks `DATABASE_URI`, confirms `ErrorState` renders; restores. Only when both pass → `[User Input]` "Please confirm the not-found and error messages look right." Wait for confirmation.
- Sprint completion: Harvey validates all AC1–AC4 and the AC Coverage Matrix is fully `Pass`, then `[User Input]` "S1.B complete — ready to commit?" Wait for "yes."

**Tasks:**

1. **Backend: Single-Product Query by ID**
   - In `src/app/(storefront)/products/[id]/page.tsx`, call `getPayloadClient().findByID({ collection: 'products', id: params.id })` inside a `try/catch`, distinguishing three outcomes: (a) success with a Published document, (b) `null`/access-denied (Draft or deleted), (c) a thrown error (backend unreachable).
   - AC: outcome (b) is reached for both a genuinely-deleted ID and a Draft product's ID (access control from S0 hides Drafts from anonymous reads); outcome (c) is reached only on a real connection failure.

2. **Frontend: `SpecTable` and `FragranceNotesBreakdown` Components**
   - Create `src/components/products/SpecTable.tsx` — renders pH level, format, key actives as a technical-specs table; **omits any row whose value is empty/null** (directly implements UC-002 AC4 at the component level, not just the page level).
   - Create `src/components/products/FragranceNotesBreakdown.tsx` — renders Top/Heart/Base notes with their timing windows; omits any tier whose value is empty.
   - Co-located tests asserting: populated fields render; blank fields produce no row/tier at all (not an empty row, not "undefined" text).
   - AC: both components pass their tests; a component fed an all-blank optional-fields product renders zero technical/fragrance rows without error.

3. **Frontend: Detail Page Composition & States**
   - Compose the Detail page: on outcome (a), render name, `formatINR(price)`, size, description, `SpecTable`, `FragranceNotesBreakdown` — reusing `formatINR` from `src/lib/utils.ts` (created in S0 or this task if not yet present).
   - On outcome (b), render "This product is no longer available" with a `<Link href="/">Back to Home</Link>` (exact copy from PRD UC-002 AC2).
   - On outcome (c), render `ErrorState`.
   - Wrap in `PageShell`.
   - AC: all three render branches are reachable and visually distinct; no console errors.

4. **Tests & Code Coverage**

   Run `pnpm test:coverage` and `pnpm exec playwright test e2e/detail/`. Coverage threshold: 80% lines on `SpecTable.tsx`, `FragranceNotesBreakdown.tsx`, the Detail `page.tsx` logic.

   **AC Coverage Matrix:**

   | AC (PRD ID) | Layer | Test File | Test Function | Test Type | Status | Verified By | Date | UI Evidence |
   |---|---|---|---|---|---|---|---|---|
   | UC-002 / AC1 | Backend | `src/app/(storefront)/products/[id]/page.test.tsx` | `test_findbyid_returns_full_populated_product` | Unit | Pending | | | n/a |
   | UC-002 / AC1 | Web Frontend | `src/components/products/SpecTable.test.tsx` | `renders all populated spec fields` | Component | Pending | | | Pending |
   | UC-002 / AC1 | E2E | `e2e/detail/s1b-view-detail.spec.ts` | `test('detail page shows all populated fields')` | E2E Playwright | Pending | | | Pending |
   | UC-002 / AC2 | Backend | `src/app/(storefront)/products/[id]/page.test.tsx` | `test_deleted_or_draft_product_returns_not_found` | Unit | Pending | | | n/a |
   | UC-002 / AC2 | E2E | `e2e/detail/s1b-product-not-found.spec.ts` | `test('shows no longer available message with Home link')` | E2E Playwright | Pending | | | Pending |
   | UC-002 / AC3 | Web Frontend | `src/app/(storefront)/products/[id]/page.test.tsx` | `renders ErrorState when Local API throws` | Component | Pending | | | Pending |
   | UC-002 / AC3 | E2E | `e2e/detail/s1b-backend-unreachable.spec.ts` | `test('shows graceful error on backend failure')` | E2E Playwright | Pending | | | Pending |
   | UC-002 / AC4 | Web Frontend | `src/components/products/SpecTable.test.tsx` | `omits blank fields — no undefined text` | Component | Pending | | | Pending |
   | UC-002 / AC4 | Web Frontend | `src/components/products/FragranceNotesBreakdown.test.tsx` | `omits blank fragrance tiers` | Component | Pending | | | Pending |
   | UC-002 / AC4 | E2E | `e2e/detail/s1b-blank-fields.spec.ts` | `test('no blank/undefined text for a sparsely-filled product')` | E2E Playwright | Pending | | | Pending |

**Task Concurrency Map:**
- Task 1 (Backend query) and Task 2 (`SpecTable`/`FragranceNotesBreakdown` components) are independent — Task 2 can be built and unit-tested with fixture data before Task 1's real query is wired in.
- Task 3 (Detail page composition) depends on both Task 1 and Task 2.
- Task 4 (Tests) depends on Tasks 1–3.
- This entire sprint (S1.B) has **no task-level dependency on S1.A** — confirmed no shared files are touched between the two sprints' task lists.

**Before sprint ends:** Harvey launches `pnpm dev` in background, records the actual URL, updates `README.md`'s Detail-page section, validates AC1–AC4, then proceeds to HITL Checkpoints.

**PRD Fulfilled (end of sprint):** UC-002 (View Product Detail), all 4 ACs, fully implemented and verified.

**Sprint Branch, Commit & Deployment:**
- Branch: `feature/s1b-view-product-detail`.
- Run `pnpm arch:check`, `pnpm lint`, `pnpm test`, `pnpm exec playwright test e2e/detail/` — all must pass.
- Commit message:
  ```
  feat(s1b): implement Product Detail page (UC-002)

  - Query single product by ID via Payload Local API findByID
  - Distinguish not-found/access-denied from a genuine backend error
  - Build SpecTable and FragranceNotesBreakdown components that omit blank fields
  - Compose Detail page with populated/not-found/error render branches
  - Add unit, component, and Playwright E2E coverage for all 4 UC-002 ACs

  Architecture gate: arch:check passed — 0 violations.
  ```
- Push branch; open PR "S1.B: View Product Detail (UC-002)" with Summary, Test Plan, Screenshots.
- `[User Input]` "PR pushed for S1.B — please review. This track is independent of S1.A/S1.C; merge order doesn't matter." Wait for confirmation.

**Handover Verification:**
- [ ] All 4 tasks finished
- [ ] `pnpm arch:check` — 0 violations
- [ ] App run locally and user validated (populated/not-found/error states, no blank fields)
- [ ] Unit, component, and E2E tests executed — 0 failures
- [ ] AC Coverage Matrix — all rows `Status: Pass`
- [ ] User confirmed satisfaction

**Verification Criteria:** All 4 ACs met; AC Coverage Matrix fully `Pass`; `pnpm arch:check` 0 violations. **User must confirm** before this track is marked ready for INT-1.

---

#### S1.C: Brand / About Page (UC-004)

**Project Context:** Implements the static Brand/About page (story, sourcing, science/process sections) — the only feature sprint with zero `Products` collection dependency, since this content is explicitly static/developer-maintained per `architecture.md` ADR-007. Track C of the parallel cycle.

**Previous Sprint's Accomplishments:** S0 delivered `PageShell`, `Header`, `Footer` and the Tailwind theme — this sprint's only real dependencies — plus **(v1.1)** UC-006's visitor-logging Middleware, already matcher-wired to `/about`; zero code change needed here to inherit passive visitor logging on the About route.

**Sprint Execution Metadata:**
- Execution Mode: PARALLEL
- Runs Parallel With: S1.A, S1.B
- Depends On: S0 ✅ Harvey Sign-Off AND ✅ Human Sign-Off — IMPL: `PageShell`, `Header`, `Footer` components only (no `Products` collection dependency at all)
- Start Condition: S0's Sprint Completion Report shows ✅ Harvey Sign-Off and ✅ Human Sign-Off recorded
- Platform / Work Type: Frontend
- Track: C (of the S1 parallel cycle)
- API Contract: N/A — no data fetch of any kind; content is static JSX (ADR-007)
- Assigned To: `[Ask User]`
- Integration Sprint: INT-1

**Standards Applied This Sprint** (§2.4 — immutable):
- Architecture: no Data Access pattern applies — this page performs no Local API call, matching ADR-007's explicit decision that Brand/About is not CMS-managed.
- Component Structure: static content lives directly in `src/app/(storefront)/about/page.tsx` as JSX (or extracted to a small `AboutContent.tsx` presentational component if it exceeds the 300-line file-length rule).
- Error Handling: a static-asset (image) failure is handled per `architecture.md` §11 — `next/image` renders its own blur-placeholder/alt-text fallback; the surrounding page shell is unaffected because it is a separate component tree.
- Lint & Architecture Gate: `pnpm arch:check` — 0 violations required.
- Not applicable this sprint — Data Access, State Management, DB Column naming rules: no backend or DB interaction exists on this page.

**Relevant Requirements & User Stories:**
- UC-004: View Brand/About Page — "As a Visitor, I want to learn about the brand so that I can trust the products I'm considering."

**Acceptance Criteria:**
- AC1 (UC-004 AC1): Given the Visitor is on any storefront page, when they click "About," then the Brand/About page loads with its story, sourcing, and science content sections.
- AC2 (UC-004 AC2, sad path): Given a static content asset (e.g. an image) fails to load, when the Visitor opens the page, then the page shell (nav/footer) still renders and only the affected region shows a fallback, rather than the whole page failing.

**HITL Checkpoints:**
- Harvey validates: hits `http://localhost:3000/about` directly and via the Header's "About" nav link, confirms story/sourcing/science sections render, confirms the page matches the approved UX design content. Only when it passes → `[User Input]` "Please open `/about` and confirm the Brand/About content and layout look right." Wait for confirmation.
- Harvey validates: deliberately points one image `src` at a non-existent path, confirms the page shell (nav/footer) still renders and only that image region shows the `next/image` fallback; restores the correct path. Only when it passes → `[User Input]` "Please confirm a broken image wouldn't take down the whole page (I've attached a screenshot of the simulated failure)." Wait for confirmation.
- Sprint completion: Harvey validates AC1–AC2 and the AC Coverage Matrix, then `[User Input]` "S1.C complete — ready to commit?" Wait for "yes."

**Tasks:**

1. **Static Content Authoring**
   - Author the Brand/About page content (story/philosophy, sourcing, science/process sections) as static JSX in `src/app/(storefront)/about/page.tsx`, sourced from the approved UX design (`docs/ux/ux-design-html/visitor/index.html`) and the Glowrie design mockups (`Brand page/code.html`, `DESIGN.md`).
   - If the page exceeds 300 lines (§2.4 Max File Length rule), extract section content into a co-located `AboutContent.tsx` presentational component.
   - AC: content sections (story, sourcing, science) are all present and match the approved UX design's structure.

2. **Frontend: Page Composition & Asset Fallback**
   - Wrap the page in `PageShell`; use `next/image` for every static image asset (never a raw `<img>` tag) so the built-in blur-placeholder/alt-text fallback applies automatically on load failure.
   - Ensure the Header's "About" nav link (built in S0) routes to `/about` correctly.
   - AC: navigating via the Header link and via direct URL both render the same page; a broken image `src` degrades gracefully without breaking the surrounding layout.

3. **Tests & Code Coverage**

   Run `pnpm test:coverage` and `pnpm exec playwright test e2e/about/`. Coverage threshold: 80% lines on any extracted `AboutContent.tsx` (the raw static-JSX `page.tsx`, if unextracted, is exempted from the numeric coverage gate per its lack of branching logic, but is still linted and E2E-tested).

   **AC Coverage Matrix:**

   | AC (PRD ID) | Layer | Test File | Test Function | Test Type | Status | Verified By | Date | UI Evidence |
   |---|---|---|---|---|---|---|---|---|
   | UC-004 / AC1 | Web Frontend | `src/app/(storefront)/about/page.test.tsx` | `renders story, sourcing, and science sections` | Component | Pending | | | Pending |
   | UC-004 / AC1 | E2E | `e2e/about/s1c-view-about.spec.ts` | `test('About nav link loads Brand/About page with all sections')` | E2E Playwright | Pending | | | Pending |
   | UC-004 / AC2 | E2E | `e2e/about/s1c-broken-image-fallback.spec.ts` | `test('page shell renders when a static image fails to load')` | E2E Playwright | Pending | | | Pending |

**Task Concurrency Map:**
- Task 1 (content authoring) and Task 2 (page composition) are lightly sequential in practice (content is written into the same file being composed) but have no external blocking artifact — a single implementer naturally does them together; there is no separate producer/consumer relationship to document as concurrent.
- Task 3 (Tests) depends on Tasks 1–2.
- This entire sprint (S1.C) has **no task-level dependency on S1.A or S1.B** — confirmed zero shared files.

**Before sprint ends:** Harvey launches `pnpm dev` in background, records the actual URL, updates `README.md`'s About-page section, validates AC1–AC2, then proceeds to HITL Checkpoints.

**PRD Fulfilled (end of sprint):** UC-004 (View Brand/About Page), both ACs, fully implemented and verified.

**Sprint Branch, Commit & Deployment:**
- Branch: `feature/s1c-brand-about-page`.
- Run `pnpm arch:check`, `pnpm lint`, `pnpm test`, `pnpm exec playwright test e2e/about/` — all must pass.
- Commit message:
  ```
  feat(s1c): implement Brand/About static page (UC-004)

  - Author static Brand/About content (story, sourcing, science) per approved UX design
  - Compose page inside PageShell with next/image graceful fallback on asset failure
  - Wire Header "About" nav link to the new route
  - Add component and Playwright E2E coverage for both UC-004 ACs

  Architecture gate: arch:check passed — 0 violations.
  ```
- Push branch; open PR "S1.C: Brand/About Page (UC-004)" with Summary, Test Plan, Screenshots.
- `[User Input]` "PR pushed for S1.C — please review. This track is independent of S1.A/S1.B; merge order doesn't matter." Wait for confirmation.

**Handover Verification:**
- [ ] All 3 tasks finished
- [ ] `pnpm arch:check` — 0 violations
- [ ] App run locally and user validated (content correct, broken-image fallback confirmed)
- [ ] Component and E2E tests executed — 0 failures
- [ ] AC Coverage Matrix — all rows `Status: Pass`
- [ ] User confirmed satisfaction

**Verification Criteria:** Both ACs met; AC Coverage Matrix fully `Pass`; `pnpm arch:check` 0 violations. **User must confirm** before this track is marked ready for INT-1.

---

#### INT-1: Integration Sprint — Merge Home, Detail & Brand/About

**Project Context:** Merges the three independent tracks (S1.A Home, S1.B Detail, S1.C Brand/About) onto a single branch, audits the merged codebase against §2.4 architecture rules, and re-runs the full regression suite across all three pages together. This sprint implements no new features — it only merges and verifies.

**Previous Sprint's Accomplishments:** S1.A delivered the Home page (carousel, empty/error states). S1.B delivered the Detail page (full field display, not-found/error states, blank-field omission). S1.C delivered the Brand/About static page (content, broken-image fallback). **(v1.1)** S0 delivered UC-006's visitor-logging Middleware and footer privacy notice, already passively covering all 3 routes since each track's page went live — this sprint performs the one UC-006 check that required all 3 pages to exist together (AC7's cross-page footer visibility).

**Sprint Execution Metadata:**
- Execution Mode: INTEGRATION
- Runs Parallel With: None — this sprint is the sole integration point for the S1 cycle
- Depends On: S1.A ✅ Harvey Sign-Off AND ✅ Human Sign-Off, S1.B ✅ Harvey Sign-Off AND ✅ Human Sign-Off, S1.C ✅ Harvey Sign-Off AND ✅ Human Sign-Off — IMPL: merged output of all 3 tracks required before cross-track regression can run
- Start Condition: All 3 tracks' Sprint Completion Reports committed to `docs/sprint-reports/` with both sign-offs recorded
- Platform / Work Type: All
- Track: — (integration point, not a track itself)
- API Contract: N/A
- Assigned To: Any
- Integration Sprint: this sprint *is* the Integration Sprint for the S1 cycle

**Standards Applied This Sprint** (§2.4 — immutable):
- Lint & Architecture Gate: `pnpm arch:check` run against the fully merged branch — must show 0 violations across all 3 tracks' combined code, confirming no track introduced a Dependency Direction violation that only becomes visible once all three are combined (e.g. a stray import between `components/products/ProductCard` and `components/products/SpecTable` that individually-reviewed branches wouldn't reveal).
- Not applicable this sprint — no new feature code is written; all other §2.4 rules were already enforced per-track at S1.A/S1.B/S1.C's own gates.

**Acceptance Criteria:**
- AC1: All 3 track branches merge into one integration branch with 0 unresolved conflicts.
- AC2: `pnpm arch:check` passes with 0 violations on the merged branch.
- AC3: Every AC from UC-001, UC-002, and UC-004 (10 ACs total) is re-verified passing on the merged branch — not just individually on each track's own branch.
- AC4: Full Playwright E2E regression (`e2e/home/`, `e2e/detail/`, `e2e/about/`) passes with 0 failures on the merged branch.
- AC5: Cross-page navigation works end-to-end: Home → Detail (product card click) → back to Home; Home/Detail → About (Header nav) → back.
- **AC6 (UC-006 AC7, v1.1):** Given the merged branch is running with all 3 pages live, when a Visitor loads Home, Detail, and Brand/About in turn, then the footer privacy notice is visible on all 3 pages, and page-load timing is unaffected by the visitor-logging Middleware (no perceptible delay attributable to the logging write on any of the 3 routes).

**HITL Checkpoints:**
- Harvey validates: merges all 3 branches into `integration/s1-cycle`, resolves any trivial conflicts (expected: none, given zero shared files across tracks per each track's Task Concurrency Map), runs `pnpm arch:check`, `pnpm test`, `pnpm exec playwright test`. Only when all pass → `[User Input]` "All 3 tracks merged cleanly, full regression passes. Please browse the merged app locally (Home → Detail → About → back) and confirm everything works together." Wait for confirmation.
- **(v1.1)** Harvey validates: on the merged branch, loads Home, Detail, and Brand/About in turn, confirms the footer privacy notice text is visible on all 3, and confirms via the Playwright E2E timing/network trace that no page's load time is measurably affected by the visitor-logging Middleware. Only when it passes → `[User Input]` "Please confirm you can see the privacy notice in the footer on all 3 pages, and that browsing feels exactly as fast as before." Wait for confirmation.
- Sprint completion: Harvey validates the End-to-End Product Status table below shows ✅ for UC-001/UC-002/UC-004/UC-006, then `[User Input]` "Integration complete — ready to commit and proceed to S2 (Buy External Redirect)?" Wait for "yes."

**Tasks:**

1. **Branch Merge & Conflict Resolution**
   - Merge `feature/s1a-browse-home-page`, `feature/s1b-view-product-detail`, `feature/s1c-brand-about-page` into a new `integration/s1-cycle` branch.
   - AC: merge completes with 0 unresolved conflicts (expected, given the 3 tracks touch disjoint files per their individual Task Concurrency Maps).

2. **Architecture Integrity Audit**
   - Run `pnpm arch:check` against the merged branch. This MUST pass with 0 violations before Tasks 3+ proceed.
   - Spot-check the merged `components/products/` directory for any accidental cross-import between `ProductCard`/`ProductCarousel` (S1.A) and `SpecTable`/`FragranceNotesBreakdown` (S1.B) — none should exist per each sprint's independent design.
   - AC: `pnpm arch:check` — 0 violations on the merged branch.

3. **DB / Schema Compatibility Verification**
   - Confirm no track introduced a conflicting migration (expected: none — only S0 touched the schema; S1.A/S1.B/S1.C are read-only against the existing `Products`/`Media` tables).
   - AC: `payload migrate` on the merged branch is a no-op (no new pending migrations) or applies cleanly if any track added one.

4. **Full Test Suite & E2E Regression**
   - Run `pnpm test:coverage` (all unit/component tests from S0, S1.A, S1.B, S1.C together) and `pnpm exec playwright test` (full `e2e/` tree: `home/`, `detail/`, `about/`).
   - AC: 0 test failures across the full merged suite.

5. **Full-Stack AC Verification & Cross-Page Navigation**
   - Re-verify all 10 ACs (UC-001 ×4, UC-002 ×4, UC-004 ×2) against the merged branch using the table below.
   - Manually (and via Playwright) walk: Home carousel → click a product → Detail page renders correctly → browser back → Home still intact → Header "About" link → Brand/About renders → Header logo/Home link → back to Home.
   - AC: all 10 ACs re-verified `Pass`; full cross-page navigation works with no console errors.

6. **(v1.1) UC-006 Cross-Page Verification (AC7)**
   - Write `e2e/home/int1-footer-privacy-notice.spec.ts` (or a shared `e2e/shared/footer-privacy-notice.spec.ts` parametrized across routes) asserting the footer privacy-notice text is visible on `/`, `/products/{id}`, and `/about` on the merged branch.
   - Re-run the non-blocking check from S0 (simulate a Supabase outage) against all 3 live pages this time, confirming each still renders normally with no visible delay/error — closing the loop on UC-006 AC6 now that real pages (not synthetic requests) exist behind the Middleware.
   - AC: footer privacy notice confirmed visible on all 3 merged pages; non-blocking behavior re-confirmed against real page routes, not just synthetic requests.

**End-to-End Product Status:**

| Use Case | DB | API (Local API) | Web Frontend | E2E | Status |
|---|---|---|---|---|---|
| UC-001: Browse Product Catalog (Home) | ✅ | ✅ | ✅ | ✅ | ✅ E2E TESTABLE |
| UC-002: View Product Detail | ✅ | ✅ | ✅ | ✅ | ✅ E2E TESTABLE |
| UC-004: View Brand/About Page | — (static, no DB) | — | ✅ | ✅ | ✅ E2E TESTABLE |
| **UC-006: Visitor Analytics/Tracking Logging (v1.1)** | ✅ (`visitor_logs`, standalone) | — (no Local API; direct Supabase write) | ✅ (footer notice, all 3 pages) | ✅ | ✅ E2E TESTABLE |
| UC-003: Buy External Redirect | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ Planned: S2 |
| UC-005: Content Operator CMS Management | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ Planned: S3 |

**Task Concurrency Map:** Tasks 1–5 are sequential — Task 2 (architecture audit) gates Tasks 3+; Task 3 (schema check) gates Task 4; Task 4 (full regression) gates Task 5 (final AC re-verification). **(v1.1)** Task 6 (UC-006 cross-page verification) depends only on Task 1 (needs all 3 pages merged) — it is independent of Tasks 2–5's Product/schema-focused verification chain and can run concurrently with Tasks 2–4, though it is listed last for narrative clarity. This is standard for an Integration Sprint: verification steps build on each other and are not independently parallelizable within this sprint.

**Before sprint ends:** Harvey launches the merged branch's dev server, records the actual URL, validates AC1–AC5 and the End-to-End Product Status table, then proceeds to HITL Checkpoints.

**Sprint Branch, Commit & Deployment:**
- Branch: `integration/s1-cycle` (already created in Task 1).
- Run `pnpm arch:check` (0 violations), `pnpm lint`, `pnpm test`, `pnpm exec playwright test` — all must pass before commit.
- Commit message:
  ```
  chore(int-1): integrate Home, Detail, and Brand/About tracks

  - Merge feature/s1a-browse-home-page, feature/s1b-view-product-detail,
    feature/s1c-brand-about-page into integration/s1-cycle
  - Architecture integrity audit: arch:check passes 0 violations on merged code
  - Re-verify all 10 ACs (UC-001, UC-002, UC-004) on the merged branch
  - Full regression: unit + component + Playwright E2E, 0 failures
  - Confirm cross-page navigation (Home <-> Detail <-> About) works end-to-end
  - (v1.1) Verify UC-006 AC7: footer privacy notice visible on all 3 merged pages
  - (v1.1) Re-confirm UC-006 AC6 non-blocking behavior against real page routes

  Architecture gate: arch:check passed — 0 violations on merged branch.
  ```
- Push branch; open PR "INT-1: Integrate Home, Detail & Brand/About" merging into the repo's main integration line; description includes the End-to-End Product Status table above.
- `[User Input]` "INT-1 PR pushed — please review the merged app end-to-end before I proceed to S2." Wait for confirmation.

**Handover Verification:**
- [ ] All 6 tasks finished
- [ ] `pnpm arch:check` — 0 violations on merged branch
- [ ] App run locally and user validated (cross-page navigation)
- [ ] Full test suite + E2E regression executed — 0 failures
- [ ] All 10 ACs re-verified `Pass` on the merged branch
- [ ] **(v1.1)** UC-006 AC7 footer privacy notice confirmed visible on all 3 merged pages; AC6 non-blocking behavior re-confirmed on real routes
- [ ] User confirmed satisfaction

**Verification Criteria:** AC1–AC6 met; End-to-End Product Status shows ✅ for UC-001/UC-002/UC-004/UC-006. **User must confirm** before proceeding to S2 (Buy External Redirect).

---

#### S2: Buy External Redirect (UC-003)

**Project Context:** Adds the shared `BuyButton` control to both the Detail page (S1.B) and a new Featured Product Spotlight on the Home page (S1.A) — the Visitor's path to actually purchasing a product. This sprint is genuinely sequential: it modifies pages that only exist because S1.A and S1.B (merged at INT-1) already built them.

**Previous Sprint's Accomplishments:** INT-1 merged and verified the Home, Detail, and Brand/About pages together on one integration branch, with all 10 prior ACs passing and full cross-page navigation confirmed.

**Sprint Execution Metadata:**
- Execution Mode: SEQUENTIAL
- Runs Parallel With: None — cites the concrete blocking artifact: this sprint inserts `BuyButton` into the existing `HomePage` (S1.A) and `ProductDetailPage` (S1.B) component trees; it cannot compile or attach without those page files already existing on the merged branch
- Depends On: INT-1 ✅ Harvey Sign-Off AND ✅ Human Sign-Off — IMPL: `HomePage` component tree (S1.A, for the Featured Spotlight insertion point) + `ProductDetailPage` component tree (S1.B, for the Buy control insertion point)
- Start Condition: INT-1's Sprint Completion Report shows ✅ Harvey Sign-Off and ✅ Human Sign-Off recorded
- Platform / Work Type: Backend + Frontend
- Track: — (sequential, not part of a parallel cycle)
- API Contract: N/A
- Assigned To: `[Ask User]`
- Integration Sprint: N/A (no further parallel cycle follows; the next sprint, S3, runs sequentially)

**Standards Applied This Sprint** (§2.4 — immutable):
- Architecture: Business Logic pattern — the field-level `validate{PurchaseUrl}` function (added to `Products.ts` in S0) is defense-in-depth at the data layer; this sprint's `isValidAbsoluteUrl()` client-side check (Shared Utilities) is the second, independent line of defense per `architecture.md` §11.
- Component Structure: `BuyButton.tsx` is a new file in `components/products/`, `"use client"` (it calls `window.open`), `Props` interface `BuyButtonProps { purchaseUrl: string | null | undefined }`.
- Naming: `BuyButton.tsx`; `isValidAbsoluteUrl` camelCase function in `src/lib/utils.ts` (boolean-returning, `is`-prefixed per convention).
- Error Handling: no server-side error path exists in this sprint (the redirect is a pure client-side action, §13 of `architecture.md` — no API call, no data exchange).
- Lint & Architecture Gate: `pnpm arch:check` — 0 violations required.

**Relevant Requirements & User Stories:**
- UC-003: Visitor Clicks Buy → Redirected to External Purchase Listing — "As a Visitor, I want to click Buy and be taken to where I can actually purchase the product."

**Acceptance Criteria:**
- AC1 (UC-003 AC1): Given a Published product has a non-empty `purchaseUrl`, when a Visitor clicks "Buy" on its Detail page, then that exact URL opens in a new browser tab and the storefront tab is unaffected.
- AC2 (UC-003 AC2): Given a product is featured on the Home page and has a non-empty `purchaseUrl`, when a Visitor clicks "Buy" on the Featured Product spotlight, then the same redirect behavior as AC1 occurs.
- AC3 (UC-003 AC3, sad path): Given a Published product's `purchaseUrl` is empty, when a Visitor views that product (Detail or Home Featured), then the Buy button is shown disabled, labeled "Coming Soon," and no navigation occurs if interacted with.
- AC4 (UC-003 AC4, sad path): Given a `purchaseUrl` is not a valid absolute URL, when a Visitor views that product, then it is treated the same as AC3 (disabled "Coming Soon").

**HITL Checkpoints:**
- Harvey validates: seeds one product with a valid `purchaseUrl` (e.g. a real Amazon-style URL), one with an empty `purchaseUrl`, one with a malformed value (e.g. `"not-a-url"`); confirms via Playwright that clicking Buy on the first opens a new tab to the exact URL (using `window.open` interception) on both Detail and Home Featured Spotlight, and confirms the other two render disabled "Coming Soon" buttons that do nothing on click. Only when all pass → `[User Input]` "Please manually click Buy on a real product's Detail page and confirm it opens the correct URL in a new tab, and confirm the storefront tab is untouched." Wait for confirmation.
- Sprint completion: Harvey validates AC1–AC4 and the AC Coverage Matrix, then `[User Input]` "S2 complete — ready to commit?" Wait for "yes."

**Tasks:**

1. **Shared Utility: `isValidAbsoluteUrl`**
   - Add `isValidAbsoluteUrl(value: string | null | undefined): boolean` to `src/lib/utils.ts` — returns `true` only for a syntactically valid absolute URL (`new URL(value)` succeeds and `protocol` is `http:`/`https:`), `false` for `null`/`undefined`/empty/relative/malformed values.
   - Co-located `utils.test.ts` covering: valid `https://` URL → true; empty string → false; `null` → false; relative path → false; `javascript:` scheme → false (defense against an XSS-adjacent edge case, even though write-time validation in S0 should already prevent it).
   - AC: all `isValidAbsoluteUrl` test cases pass.

2. **Frontend: `BuyButton` Shared Component**
   - Create `src/components/products/BuyButton.tsx` — accepts `purchaseUrl`; when `isValidAbsoluteUrl(purchaseUrl)` is true, renders an enabled `Button` (from S0's shadcn primitive) that calls `window.open(purchaseUrl, '_blank', 'noopener,noreferrer')` on click; when false, renders the same `Button` in a `disabled` state labeled "Coming Soon."
   - Co-located `BuyButton.test.tsx`: enabled state calls `window.open` with the exact URL and `noopener,noreferrer` flags on click (mocked); disabled state renders `disabled` and a click handler is never invoked.
   - AC: both states render correctly; `window.open` is called with the exact stored `purchaseUrl` string, unmodified.

3. **Frontend: `FeaturedSpotlight` Component & Home Page Wiring**
   - Create `src/components/products/FeaturedSpotlight.tsx` — selects one Published product (e.g. the most recently updated, or a Content-Operator-flagged `badge` such as `BESTSELLER` if present — implementation detail left to Code, not PRD-mandated) and renders its image, name, price, and a `BuyButton`.
   - Insert `FeaturedSpotlight` into `src/app/(storefront)/page.tsx` (the S1.A Home page), above or alongside the `ProductCarousel`, matching the approved UX design's spotlight placement.
   - AC: the Home page renders exactly one Featured Spotlight with a working `BuyButton` reflecting that product's real `purchaseUrl` state.

4. **Frontend: Detail Page Wiring**
   - Insert `BuyButton` into `src/app/(storefront)/products/[id]/page.tsx` (the S1.B Detail page), passing the fetched product's `purchaseUrl`.
   - AC: the Detail page's Buy button correctly reflects the specific product's `purchaseUrl` state (enabled/disabled) for every seeded test product.

5. **Tests & Code Coverage**

   Run `pnpm test:coverage` and `pnpm exec playwright test e2e/buy/`. Coverage threshold: 80% lines on `BuyButton.tsx`, `FeaturedSpotlight.tsx`, `isValidAbsoluteUrl` in `utils.ts`.

   **AC Coverage Matrix:**

   | AC (PRD ID) | Layer | Test File | Test Function | Test Type | Status | Verified By | Date | UI Evidence |
   |---|---|---|---|---|---|---|---|---|
   | UC-003 / AC1 | Web Frontend | `src/components/products/BuyButton.test.tsx` | `opens purchaseUrl in new tab on click` | Component | Pending | | | Pending |
   | UC-003 / AC1 | E2E | `e2e/buy/s2-buy-from-detail.spec.ts` | `test('Buy on Detail page opens exact purchaseUrl in new tab')` | E2E Playwright | Pending | | | Pending |
   | UC-003 / AC2 | Web Frontend | `src/components/products/FeaturedSpotlight.test.tsx` | `renders BuyButton reflecting featured product state` | Component | Pending | | | Pending |
   | UC-003 / AC2 | E2E | `e2e/buy/s2-buy-from-spotlight.spec.ts` | `test('Buy on Home Featured Spotlight opens exact purchaseUrl in new tab')` | E2E Playwright | Pending | | | Pending |
   | UC-003 / AC3 | Web Frontend | `src/components/products/BuyButton.test.tsx` | `renders disabled Coming Soon when purchaseUrl empty` | Component | Pending | | | Pending |
   | UC-003 / AC3 | E2E | `e2e/buy/s2-buy-coming-soon.spec.ts` | `test('disabled Buy button does not navigate when clicked')` | E2E Playwright | Pending | | | Pending |
   | UC-003 / AC4 | Backend | `src/lib/utils.test.ts` | `test_isValidAbsoluteUrl_rejects_malformed_values` | Unit | Pending | | | n/a |
   | UC-003 / AC4 | Web Frontend | `src/components/products/BuyButton.test.tsx` | `renders disabled Coming Soon for malformed purchaseUrl` | Component | Pending | | | Pending |

**Task Concurrency Map:**
- Task 1 (`isValidAbsoluteUrl`) has no dependency and can start immediately — it is a pure function with no component dependency.
- Task 2 (`BuyButton`) depends on Task 1 (uses `isValidAbsoluteUrl` internally).
- Tasks 3 (`FeaturedSpotlight` + Home wiring) and 4 (Detail wiring) both depend on Task 2 (`BuyButton`) but are independent of each other — Task 3 touches `page.tsx` (Home) and a new `FeaturedSpotlight.tsx`; Task 4 touches `products/[id]/page.tsx` (Detail) only. They can run concurrently once Task 2 is done.
- Task 5 (Tests) depends on Tasks 1–4.

**Before sprint ends:** Harvey launches the dev server, records the actual URL, validates AC1–AC4 against real seeded products (valid/empty/malformed `purchaseUrl`), then proceeds to HITL Checkpoints.

**PRD Fulfilled (end of sprint):** UC-003 (Buy External Redirect), all 4 ACs, fully implemented and verified.

**Sprint Branch, Commit & Deployment:**
- Branch: `feature/s2-buy-external-redirect`.
- Run `pnpm arch:check`, `pnpm lint`, `pnpm test`, `pnpm exec playwright test e2e/buy/` — all must pass.
- Commit message:
  ```
  feat(s2): implement Buy external redirect (UC-003)

  - Add isValidAbsoluteUrl() shared utility with malformed/relative/empty rejection
  - Build BuyButton shared component: enabled redirect vs disabled Coming Soon state
  - Build FeaturedSpotlight component and wire it into the Home page
  - Wire BuyButton into the Product Detail page
  - Add unit, component, and Playwright E2E coverage for all 4 UC-003 ACs

  Architecture gate: arch:check passed — 0 violations.
  ```
- Push branch; open PR "S2: Buy External Redirect (UC-003)" with Summary, Test Plan, Screenshots (enabled + disabled states on both entry points).
- `[User Input]` "PR pushed for S2 — please review and confirm ready to merge before I proceed to S3." Wait for confirmation.

**Handover Verification:**
- [ ] All 5 tasks finished
- [ ] `pnpm arch:check` — 0 violations
- [ ] App run locally and user validated (Buy works on both entry points; disabled state confirmed)
- [ ] Unit, component, and E2E tests executed — 0 failures
- [ ] AC Coverage Matrix — all rows `Status: Pass`
- [ ] User confirmed satisfaction

**Verification Criteria:** All 4 ACs met; AC Coverage Matrix fully `Pass`; `pnpm arch:check` 0 violations. **User must confirm** before proceeding to S3 (Content Operator CMS Management).

---

#### S3: Content Operator Manages Product Catalog (UC-005)

**Project Context:** Verifies and hardens the Content Operator's end-to-end CRUD workflow via Payload's built-in `/admin` panel — most of the mechanics (List/Create/Read/Update/Delete UI) come free from Payload's admin generator (`architecture.md` §3), so this sprint's real work is: proving access control is correct, proving the S0 revalidation hook actually achieves the "no manual deploy" KPI end-to-end (now that Home/Detail/Buy all exist), and closing any admin-UX gaps (field grouping/descriptions) for a non-technical Content Operator.

**Previous Sprint's Accomplishments:** S2 delivered the `BuyButton`/`FeaturedSpotlight` and wired Buy into both Home and Detail — this sprint verifies that a Content Operator's edits to `purchaseUrl` (and every other field) propagate correctly to those exact UI surfaces.

**Sprint Execution Metadata:**
- Execution Mode: SEQUENTIAL
- Runs Parallel With: None — cites the concrete blocking artifact: this sprint's AC3 explicitly requires verifying the Buy button's enabled/disabled state changes live, which requires `BuyButton` (S2) to exist
- Depends On: S2 ✅ Harvey Sign-Off AND ✅ Human Sign-Off — IMPL: `BuyButton` + `isValidAbsoluteUrl` (S2, for AC3's Buy-state verification); `HomePage`/`ProductDetailPage` (S1.A/S1.B, to verify CMS changes appear live on both)
- Start Condition: S2's Sprint Completion Report shows ✅ Harvey Sign-Off and ✅ Human Sign-Off recorded
- Platform / Work Type: Backend + Frontend
- Track: — (sequential)
- API Contract: N/A — Payload's auto-generated admin UI and REST routes are the interface; no custom endpoint is written this sprint
- Assigned To: `[Ask User]`
- Integration Sprint: N/A

**Standards Applied This Sprint** (§2.4 — immutable):
- Architecture: Auth/Security pattern — Content Operator auth remains entirely Payload's built-in `Users` collection auth; no custom auth code is written this sprint either (§2.4 explicitly forbids it).
- Naming: no new component files expected this sprint (verification-focused); any admin-UI customization (Payload field `admin.description`/grouping) stays within `src/collections/Products.ts` per the existing collection-config pattern.
- Lint & Architecture Gate: `pnpm arch:check` — 0 violations required (even though this sprint is mostly tests/config, the gate still runs on every commit).
- Not applicable this sprint — Component Structure, State Management rules: no new React components are built (Payload's admin UI is framework-generated, not hand-built per `architecture.md` §3).

**Relevant Requirements & User Stories:**
- UC-005: Content Operator Manages Product Catalog (CRUD) — "As a Content Operator, I want to create, read, update, and delete products through Payload CMS so that I can maintain the storefront without engineering involvement."

**Acceptance Criteria:**
- AC1 (UC-005 AC1, Create): Given a Content Operator is logged into Payload CMS, when they create a product with all required fields and set status = Published, then it appears in the Home carousel and has a working Detail page on next storefront page-load, with no manual deploy.
- AC2 (UC-005 AC2, Read/List): Given products exist in the CMS, when the Content Operator opens the product list view, then all products (Draft and Published) are listed with key fields visible.
- AC3 (UC-005 AC3, Update): Given a Published product exists, when the Content Operator edits and saves a field (e.g. price or `purchaseUrl`), then the storefront reflects the updated value — including the Buy button's enabled/disabled state — on next page load.
- AC4 (UC-005 AC4, Delete/Unpublish): Given a Published product exists, when the Content Operator deletes it or sets it to Draft, then it no longer appears in the Home carousel and its Detail page shows the UC-002 AC2 "no longer available" message.
- AC5 (UC-005 AC5, sad path — invalid input): Given the Content Operator attempts to save a product missing a required field, when they submit, then Payload CMS's existing validation blocks the save and shows a validation error.

**HITL Checkpoints:**
- Harvey validates: logs into `/admin`, creates a new product with all required fields, sets status = Published, reloads the Home page, confirms the new product appears in the carousel and its Detail page works — all without restarting the dev server or rebuilding. Only when it passes → `[User Input]` "Please create a test product yourself in `/admin`, publish it, and confirm it shows up on the live storefront without me restarting anything." Wait for confirmation.
- Harvey validates: edits an existing Published product's `purchaseUrl` from empty to a valid URL, reloads its Detail page and the Home Featured Spotlight (if it's the featured one), confirms the Buy button switched from disabled "Coming Soon" to enabled; edits it back to empty, confirms it reverts. Only when it passes → `[User Input]` "Please edit a product's purchaseUrl yourself and confirm the Buy button's state updates on the storefront." Wait for confirmation.
- Harvey validates: deletes a Published product, confirms it disappears from Home and its Detail page shows "no longer available"; attempts to save a product with a required field blanked out, confirms Payload's validation blocks it with a visible error. Only when both pass → `[User Input]` "Please confirm delete and validation-error behavior match your expectations." Wait for confirmation.
- Sprint completion: Harvey validates AC1–AC5 and the AC Coverage Matrix, then `[User Input]` "S3 complete — ready to commit and proceed to the Deployment Sprint?" Wait for "yes."

**Tasks:**

1. **Access Control Verification & Hardening**
   - Write integration tests (using `@payloadcms/testing` from S0) against the `Products` collection's `access` functions: an unauthenticated request may only read `status: 'published'` documents; an authenticated request may read all; unauthenticated `create`/`update`/`delete` attempts are rejected.
   - Repeat for `Media` (same pattern) and confirm `Users` has no public read/create (`architecture.md` §10).
   - AC: all access-control integration tests pass; a direct unauthenticated `POST /api/products` request is rejected with 401/403.

2. **Revalidation & Publish-Latency Verification (AC1, AC3, AC4)**
   - Verify the S0 `afterChange` hook (`revalidatePath('/')`, `revalidatePath('/products/[id]', 'page')`) fires on every create/update/delete/unpublish action, by instrumenting a test that publishes a product and asserts the Home page's cached HTML reflects it within one request (no manual `next build`/restart).
   - Specifically verify AC3's Buy-button-state propagation: edit `purchaseUrl` on a live product, assert the Detail page's rendered `BuyButton` state (enabled/disabled) updates on next load.
   - Specifically verify AC4: delete a Published product, assert it's absent from the next Home page render and its Detail page renders the UC-002 AC2 message.
   - AC: all three propagation scenarios (create→appear, update→Buy-state-change, delete→disappear+not-found) verified via Playwright against the running dev server, with no restart/rebuild between the CMS action and the storefront check.

3. **Admin UX Polish for the Content Operator**
   - In `src/collections/Products.ts`, add `admin.description` strings to non-obvious fields (`purchaseUrl`: "External URL where this product is actually sold, e.g. an Amazon listing. Leave blank to show 'Coming Soon.'"; `sku`: "Unique product code shown on catalog cards."), and group related fields into Payload `admin` tabs/rows (Pricing & Identity / Content / Technical Specs / Fragrance Notes / Commerce) for a cleaner non-technical editing experience — a UX improvement, not a new business rule.
   - Configure the admin list view's default columns (`useAsTitle: 'name'`, `defaultColumns: ['name', 'sku', 'status', 'price']`) so AC2's "key fields visible" requirement is well-served out of the box.
   - AC: the admin list view shows name/SKU/status/price by default; every non-obvious field has a helpful description visible in the admin UI.

4. **Sad-Path Validation Verification (AC5)**
   - Confirm Payload's existing required-field validation blocks a save when a required field (`name`, `sku`, `price`, `description`, `status`) is missing, and that the admin UI surfaces a visible, field-level error message — no custom validation code is written; this task only confirms Payload's built-in behavior meets the AC.
   - AC: attempting to save a product with any required field blank is blocked with a visible error, for every required field.

5. **Tests & Code Coverage**

   Run `pnpm test:coverage` and `pnpm exec playwright test e2e/content-operator/`. Coverage threshold: 80% lines on the `Products.ts`/`Media.ts` access-control functions.

   **AC Coverage Matrix:**

   | AC (PRD ID) | Layer | Test File | Test Function | Test Type | Status | Verified By | Date | UI Evidence |
   |---|---|---|---|---|---|---|---|---|
   | UC-005 / AC1 | Backend | `src/collections/Products.test.ts` | `test_create_published_product_passes_access_control` | Integration | Pending | | | n/a |
   | UC-005 / AC1 | E2E | `e2e/content-operator/s3-create-publish.spec.ts` | `test('new Published product appears on Home + Detail with no rebuild')` | E2E Playwright | Pending | | | Pending |
   | UC-005 / AC2 | E2E | `e2e/content-operator/s3-list-view.spec.ts` | `test('admin list view shows all products with key fields')` | E2E Playwright | Pending | | | Pending |
   | UC-005 / AC3 | Backend | `src/collections/Products.test.ts` | `test_afterChange_hook_fires_on_update` | Integration | Pending | | | n/a |
   | UC-005 / AC3 | E2E | `e2e/content-operator/s3-update-purchaseurl.spec.ts` | `test('editing purchaseUrl updates Buy button state live')` | E2E Playwright | Pending | | | Pending |
   | UC-005 / AC4 | E2E | `e2e/content-operator/s3-delete-unpublish.spec.ts` | `test('deleted product disappears from Home and shows not-found on Detail')` | E2E Playwright | Pending | | | Pending |
   | UC-005 / AC5 | Backend | `src/collections/Products.test.ts` | `test_missing_required_field_blocks_save` | Integration | Pending | | | n/a |
   | UC-005 / AC5 | E2E | `e2e/content-operator/s3-validation-error.spec.ts` | `test('admin UI shows validation error for missing required field')` | E2E Playwright | Pending | | | Pending |

**Task Concurrency Map:**
- Task 1 (access control tests) and Task 3 (admin UX polish) are independent — Task 1 tests existing behavior from S0; Task 3 only adds `admin.description`/grouping metadata, touching the same file but non-overlapping properties within it. In practice sequenced to avoid simultaneous edits to `Products.ts`, but there is no functional blocking dependency between them.
- Task 2 (revalidation verification) depends on Task 1 confirming access control is correct first (so the propagation tests aren't confounded by an access-control bug).
- Task 4 (sad-path validation) is independent of Tasks 1–3 — it tests Payload's built-in required-field behavior, unaffected by access control or admin UX changes.
- Task 5 (Tests) depends on Tasks 1–4.

**Before sprint ends:** Harvey launches the dev server, records the actual URL and the `/admin` URL, validates AC1–AC5 with a real Content-Operator walkthrough, then proceeds to HITL Checkpoints.

**PRD Fulfilled (end of sprint):** UC-005 (Content Operator Manages Product Catalog), all 5 ACs, fully implemented and verified. **All 6 PRD use cases (UC-001–UC-006) are now fully implemented and E2E-verified** — UC-006 (v1.1) was implemented in S0 and fully cross-page-verified at INT-1.

**Sprint Branch, Commit & Deployment:**
- Branch: `feature/s3-content-operator-cms`.
- Run `pnpm arch:check`, `pnpm lint`, `pnpm test`, `pnpm exec playwright test e2e/content-operator/` — all must pass.
- Commit message:
  ```
  feat(s3): verify and harden Content Operator CMS workflow (UC-005)

  - Add access-control integration tests for Products/Media/Users collections
  - Verify afterChange revalidation hook propagates create/update/delete to the
    live storefront with no manual rebuild, including Buy button state changes
  - Polish admin UX: field descriptions, grouping, default list columns
  - Confirm Payload's built-in required-field validation blocks invalid saves
  - Add integration and Playwright E2E coverage for all 5 UC-005 ACs

  Architecture gate: arch:check passed — 0 violations.

  All 6 PRD use cases (UC-001-UC-006) now fully implemented and E2E-verified.
  ```
- Push branch; open PR "S3: Content Operator CMS Management (UC-005)" with Summary, Test Plan, Screenshots (admin list view, field descriptions).
- `[User Input]` "PR pushed for S3 — please review. All 5 use cases are now complete; once you confirm, I'll proceed to the Deployment Sprint." Wait for confirmation.

**Handover Verification:**
- [ ] All 5 tasks finished
- [ ] `pnpm arch:check` — 0 violations
- [ ] App run locally and user validated (full Content Operator walkthrough)
- [ ] Integration and E2E tests executed — 0 failures
- [ ] AC Coverage Matrix — all rows `Status: Pass`
- [ ] User confirmed satisfaction

**Verification Criteria:** All 5 ACs met; AC Coverage Matrix fully `Pass`; `pnpm arch:check` 0 violations; all 6 PRD use cases (UC-001–UC-006) now E2E-verified. **User must confirm** before proceeding to S4 (Deployment Sprint).

---

#### S4: Deployment Sprint — Production Cutover to Vercel + Supabase

**Project Context:** Promotes the fully-verified application (all 6 use cases, S0–S3) to production: a production Supabase project (Postgres + Storage) and a production Vercel deployment, with `payload migrate` wired as a pre-build gate, secrets configured, and the `/api/health` route validated by external monitoring. Per `architecture.md` §8, this is a single Vercel project serving storefront + admin + API together — no separate deployment for the CMS. **(v1.1)** This sprint also applies the UC-006 `visitor_logs` SQL migration and registers the `pg_cron` retention job against the **production** Supabase project (separately from the dev-project setup done in S0), since Supabase migrations/extensions are per-project, not shared across dev/production.

**Previous Sprint's Accomplishments:** S3 completed and verified all 5 PRD use cases end-to-end in the local/dev environment. The application is feature-complete.

**Sprint Execution Metadata:**
- Execution Mode: DEPLOYMENT
- Runs Parallel With: None — cites the concrete blocking reason: deploying an incomplete feature set is meaningless; this sprint requires all 5 use cases verified first
- Depends On: S3 ✅ Harvey Sign-Off AND ✅ Human Sign-Off — IMPL: fully verified application code (all 5 use cases) from S0–S3
- Start Condition: S3's Sprint Completion Report shows ✅ Harvey Sign-Off and ✅ Human Sign-Off recorded; `[User Input]` production Supabase project and Vercel account/project name collected (Section 1.4 lists these as dev-time inputs; this sprint re-collects the **production**-scoped equivalents)
- Platform / Work Type: All
- Track: — (final sprint)
- API Contract: N/A
- Assigned To: `[Ask User]`
- Integration Sprint: N/A

**Standards Applied This Sprint** (§2.4 — immutable):
- Architecture: Deployment target and method are copied as-is from `architecture.md` §8 — Vercel (single project) + Supabase (managed Postgres + Storage) — this plan does not re-select a deployment target.
- Lint & Architecture Gate: `pnpm arch:check`, `pnpm lint`, `pnpm test`, and the full Playwright E2E suite all re-run against the production build artifact (`next build` output) before the final go-live confirmation.
- Not applicable this sprint — Naming/Component Structure/Data Access rules: no application code is written this sprint (deployment configuration only).

**Acceptance Criteria:**
- AC1: A production Supabase project exists with `payload migrate` successfully applied, producing a schema identical to the dev environment's (`products`, `media`, `users` tables per `architecture.md` §6).
- AC2: The Vercel production deployment build command runs `payload migrate` before `next build` (per `architecture.md` §8) and the deployed app is reachable over HTTPS at the production domain.
- AC3: All secrets (`DATABASE_URI`, `PAYLOAD_SECRET`, Supabase Storage credentials) are set as encrypted Vercel Environment Variables scoped to Production — never committed to the repo.
- AC4: `GET /api/health` on the production URL returns `200`, confirmed reachable by an external uptime-monitoring check (tool selection is the user's choice per `architecture.md` §12 — this sprint only wires the endpoint and confirms it's pollable).
- AC5: The full Playwright E2E suite (all 5 use cases) passes against the production URL (or a Vercel Preview deployment representing the exact production build, if running destructive test data against production directly is undesirable).

**HITL Checkpoints:**
- Harvey validates: with the `[User Input]` production Supabase `DATABASE_URI` and Storage credentials configured as Vercel encrypted env vars, triggers a Vercel deployment, confirms the build log shows `payload migrate` running before `next build`, confirms the deployment succeeds and the production URL is reachable. Only when it passes → `[User Input]` "Production deployment succeeded at `{production URL}` — please confirm you can reach it and it looks correct." Wait for confirmation.
- Harvey validates: creates a Content Operator account on the production `/admin`, publishes one real product, confirms it appears on the production Home/Detail pages; hits `{production URL}/api/health`, confirms `200`. Only when both pass → `[User Input]` "Please log into the production `/admin`, publish a real product, and confirm it's live on the storefront. Also confirm you have a plan for external uptime monitoring against `/api/health` (tool selection is yours per the architecture doc)." Wait for confirmation.
- Sprint completion: Harvey validates AC1–AC5 fully, then `[User Input]` "Deployment complete — the Glowrie storefront is live at `{production URL}`. Are you satisfied with the full development plan and its execution?" Wait for confirmation.

**Tasks:**

1. **Production Supabase Project Setup**
   - `[User Input]` "Please create (or designate) a production Supabase project and provide its connection details: project URL, `DATABASE_URI`, Storage service-role key." Wait for response.
   - Run `payload migrate` against the production `DATABASE_URI` from a secure context (CI/local with production credentials, never committed); verify the resulting schema matches `architecture.md` §6 exactly.
   - AC: production schema verified identical to dev; migration applied cleanly with 0 errors.

2. **Vercel Project Configuration**
   - `[User Input]` "Please provide your Vercel account/team name and confirm the project name to use (or confirm creating a new one)." Wait for response.
   - Create/configure the Vercel project; set the build command to run `payload migrate && next build` (per `architecture.md` §8); connect the Git repository (Section 1.4) for automatic deployments on push to the production branch.
   - AC: Vercel project exists, linked to the repo, with the correct build command configured.

3. **Secrets & Environment Configuration**
   - Set `DATABASE_URI`, `PAYLOAD_SECRET`, Supabase Storage credentials as encrypted Vercel Environment Variables scoped to Production (and Preview, if staging deployments are desired per `architecture.md` §8's optional Staging environment).
   - Confirm `.env` remains gitignored and no secret value appears anywhere in the committed repo history for this sprint's commits.
   - AC: all required secrets present in Vercel's Production scope; `git log -p` for this sprint's commits contains no secret values.

4. **Production Deployment & Health Verification**
   - Trigger the production deployment; monitor the build log for `payload migrate` success and `next build` success.
   - Hit `{production URL}/api/health`; confirm `200`.
   - AC: deployment succeeds; production URL reachable over HTTPS; `/api/health` returns `200`.

5. **Production Smoke Test — All 5 Use Cases**
   - Manually (and via Playwright against the production/Preview URL) walk all 5 use cases: Browse Home, View Detail, Buy redirect (with a real or clearly-marked test `purchaseUrl`), View Brand/About, Content Operator create/publish.
   - AC: all 5 use cases confirmed working against the production deployment.

**Task Concurrency Map:**
- Task 1 (Supabase production setup) and Task 2 (Vercel project configuration) are independent — they touch different vendor dashboards and can be done concurrently by the user/`[Ask User]` while Harvey prepares the build command config.
- Task 3 (Secrets) depends on both Task 1 (needs the production `DATABASE_URI`/Storage keys) and Task 2 (needs the Vercel project to exist to set its env vars).
- Task 4 (Deployment) depends on Task 3.
- Task 5 (Smoke test) depends on Task 4.

**Before sprint ends:** Harvey records the actual production URL (and any Vercel Preview URL used for destructive testing) in `README.md`'s Deployment section, validates AC1–AC5 against it, then proceeds to HITL Checkpoints.

**PRD Fulfilled (end of sprint):** All 5 use cases (UC-001–UC-005) are now live in production, satisfying the PRD's Executive Summary goal of "a durable, low-risk storefront foundation" (§2 of `refined-prd.md`).

**Sprint Branch, Commit & Deployment:**
- Branch: `feature/s4-production-deployment`.
- Run `pnpm arch:check`, `pnpm lint`, `pnpm test`, `pnpm exec playwright test` (full suite) against the production build artifact — all must pass before the final merge.
- Commit message:
  ```
  chore(s4): configure production deployment to Vercel + Supabase

  - Apply payload migrate against the production Supabase Postgres project
  - Configure Vercel project with `payload migrate && next build` build command
  - Set all required secrets as encrypted Vercel Production environment variables
  - Verify /api/health returns 200 on the production deployment
  - Smoke-test all 5 use cases (UC-001-UC-005) against production

  Architecture gate: arch:check passed — 0 violations.

  Glowrie storefront is live in production.
  ```
- Push branch; open final PR "S4: Production Deployment" with Summary, Test Plan (production smoke test results), and the live production URL.
- `[User Input]` "Final PR pushed — please review and confirm merge. The Glowrie storefront will then be fully live." Wait for confirmation.

**Handover Verification:**
- [ ] All 5 tasks finished
- [ ] `pnpm arch:check` — 0 violations
- [ ] Production app reachable and user validated (all 5 use cases smoke-tested)
- [ ] Full test suite + E2E regression executed against production build — 0 failures
- [ ] `/api/health` confirmed `200` and pollable externally
- [ ] User confirmed satisfaction

**Verification Criteria:** All 5 ACs met; all 5 PRD use cases confirmed live in production; `pnpm arch:check` 0 violations. **User must confirm** — this is the final sprint of the development plan.

---

> **BEFORE writing "Development Plan Complete":** The mandatory self-review loop (PRD Coverage, Sprint Completeness, §2.4 Completeness, Parallel Plan structure, Architecture Enforcement Coverage) was run for this plan prior to writing it to disk. Summary: all 6 PRD use cases (UC-001–UC-006) traced to a sprint's `PRD Fulfilled` section (S1.A→UC-001, S1.B→UC-002, S1.C→UC-004, S2→UC-003, S3→UC-005, **S0→UC-006 (v1.1)**) with 0 gaps; all 8 sprints (S0, S1.A, S1.B, S1.C, INT-1, S2, S3, S4) carry complete Sprint Execution Metadata, Standards Applied blocks, Acceptance Criteria, HITL Checkpoints, Task Concurrency Maps, AC Coverage Matrices (S0/INT-1/S4 use Acceptance Criteria + End-to-End Product Status/production smoke-test tables in place of a per-AC unit matrix, consistent with their infrastructure/integration/deployment nature — S0 additionally carries a dedicated UC-006 AC Coverage Matrix), Verification Criteria, and Handover Verification checklists; §2.4 is fully populated with no placeholders; the parallel cycle (S1.A/S1.B/S1.C + INT-1) is justified by genuine architectural independence documented in the Section 3 dependency table (UC-006's S0 placement does not disturb this independence — see Section 1.5 scope note); the Integration Sprint Cadence check is satisfied (INT-1 follows the one parallel cycle; only 3 sequential sprints — S2, S3, S4 — follow it, under the 5-sprint threshold); Sprint 0 includes Architecture Enforcement Tooling (dependency-cruiser) and Infrastructure Smoke-Tests (Postgres, Storage, Admin Auth) as mandatory tasks; UC-006's cross-page AC7 verification is confirmed traced to INT-1 Task 6, not left as an unowned gap.

Development Plan Complete - Ready for implementation.


