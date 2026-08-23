# Glowrie — Product Catalog Storefront

A public product catalog/storefront for a premium skincare brand, built per
`docs/refined-prd.md` (v2.1), `docs/architecture.md` (v1.1), and
`docs/development-plan.md` (v1.1). Single Next.js 15/16 app with Payload
CMS 3.x embedded (mounted at `/admin`), Postgres via Supabase, no separate
backend service.

Visitors browse a product carousel on Home, view full Product Detail pages,
and click **Buy** to redirect to an external listing. A single Content
Operator manages the catalog entirely through Payload's built-in admin
panel. Every storefront page view is passively logged (IP, geolocation,
UTM params) to a standalone `visitor_logs` Supabase table for marketing
attribution (UC-006), with a 180-day auto-purge and a footer privacy notice.

**Cart/checkout is explicitly out of scope** — see `docs/refined-prd.md` §7.

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16.3.2 (App Router, React 19, TypeScript, Turbopack) |
| CMS / Backend | Payload CMS 3.88.0, embedded in-process |
| Database | Postgres via Supabase (`@payloadcms/db-postgres`) |
| Media Storage | Supabase Storage (S3-compatible, via `@payloadcms/storage-s3`) |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Visitor logging | `@supabase/supabase-js` (direct write, bypasses Payload) |
| Retention job | Supabase `pg_cron` |
| Testing | Vitest + React Testing Library (unit/component), Playwright (E2E) |
| Package manager | pnpm 9.x |

### Deviations from the planning documents (and why)

The planning docs were written assuming a slightly earlier point in the
tooling's release cycle. Where the installed tooling had since moved on,
the newer, still-compatible version was used rather than pinning to an
older release for its own sake:

- **Next.js 16.3.2, not 15.x.** `create-next-app@latest` installed Next 16;
  Payload 3.88.0's own `peerDependencies` explicitly support
  `next: '>=16.2.6 <17.0.0'`, so this is an officially supported
  combination, not a risky mismatch. A full production build
  (`next build`) succeeds against this stack (see §7 below).
- **Tailwind CSS v4, not v3.x.** v4's CSS-first `@theme` block
  (`src/styles/globals.css`) is used to declare the exact Golden Alchemist
  design tokens (colors, fonts, spacing, 0-radius shape system) instead of
  a `tailwind.config.ts` theme extension — functionally equivalent, just
  v4's idiomatic approach.
- **Hand-built `Button`/`Badge`/`LoadingSkeleton` primitives instead of the
  shadcn/ui CLI.** The Golden Alchemist system's exact tokens (sharp
  0-radius corners, specific gold/obsidian palette, no drop shadows) are
  applied directly; pulling in shadcn's default component templates would
  have meant immediately overriding most of their styling anyway. Radix
  primitives were not needed since this release has no complex interactive
  widgets (no dropdowns/dialogs/tooltips) — the client components that do
  need interactivity (`Header`'s mobile toggle, `ProductCarousel`'s scroll
  controls, `HeroCarousel`'s autoplay) are hand-built with explicit ARIA
  labels for WCAG 2.1 AA.
- **Hand-written `src/lib/types.ts` instead of Payload's generated
  `payload-types.ts`.** See §4 "Known Environment Issue" below — the
  `payload generate:types` CLI command fails in this specific workspace
  path (which contains a space) due to an upstream tsx/Node bug. The
  interfaces in `src/lib/types.ts` are kept in exact field-for-field sync
  with `src/collections/Products.ts`/`Media.ts`. Once the project is moved
  to a path without spaces, run `pnpm payload generate:types` and switch
  the imports over to the real generated file.

Everything else — the Modular Monolith pattern, Payload Local API data
access, the `visitor_logs` direct-Postgres exception, the Middleware +
`waitUntil()` non-blocking logging design, the `pg_cron` retention job, the
folder structure, and all 6 use cases — follows `docs/architecture.md` and
`docs/development-plan.md` exactly.

---

## 2. What's Built

- **Payload collections:** `Products` (full field set per architecture.md
  §6, tabbed admin UI, field-level `purchaseUrl` validation, `afterChange`
  revalidation hook), `Media` (Supabase Storage-backed uploads), `Users`
  (Content Operator auth with lockout).
- **Storefront pages:** Home (`/`) — hero carousel, trust ribbon, product
  carousel, Featured Spotlight, all three UC-001 render branches
  (populated/empty/error); Product Detail (`/products/[id]`) — full field
  display, Buy button, Spec Table, Fragrance Notes, all four UC-002 render
  branches; Brand/About (`/about`) — static content per the approved UX
  design.
- **UC-003 Buy redirect:** shared `BuyButton` component, `isValidAbsoluteUrl`
  utility, enabled (new-tab redirect) vs. disabled ("Coming Soon") states.
- **UC-006 Visitor Analytics Logging:** `src/middleware.ts` (Edge
  Middleware, `waitUntil()`-scheduled, matched to `/`, `/products/:path*`,
  `/about`), `src/lib/visitor-logging.ts` (direct Supabase write via
  `service_role` key), SQL migrations for the `visitor_logs` table + RLS
  default-deny policy + `pg_cron` 180-day retention job, and the footer
  privacy notice.
- **Shared UI library:** `PageShell`, `Header`, `Footer`, `Button`, `Badge`,
  `LoadingSkeleton`, `ErrorState`, `EmptyState`, plus the product-domain
  components (`ProductCard`, `ProductCarousel`, `SpecTable`,
  `FragranceNotesBreakdown`, `BuyButton`, `FeaturedSpotlight`).
- **`/api/health`** — a real liveness probe (executes a cheap Payload query).
- **Architecture enforcement:** `.dependency-cruiser.cjs` encoding the
  Dependency Direction rules from `development-plan.md` §2.4 (verified
  passing — see §6).
- **73 unit/component tests** (Vitest + RTL) covering all 6 use cases'
  acceptance criteria, including every UC-006 sad path (geolocation
  absent, no referrer, no UTM params, simulated Supabase failure).
- **18 Playwright E2E spec files** (23 tests) covering the full Critical
  Path Journey and every documented sad path — see §5 for why these
  couldn't be *executed* in this environment, and what's needed to run them
  for real.

---

## 3. Prerequisites

- Node.js 20+ (tested with Node 24.16.0)
- pnpm 9.x (`corepack enable && corepack prepare pnpm@9 --activate`)
- A Supabase project (free tier is sufficient for development)

---

## 4. Local Setup

```bash
pnpm install
cp .env.example .env
```

Fill in `.env` with real values:

1. **Create a Supabase project** at https://supabase.com/dashboard.
2. **`DATABASE_URI`** — Project Settings → Database → Connection string
   (use the "Session pooler" or "Transaction pooler" URI).
3. **`PAYLOAD_SECRET`** — any long random string, e.g. `openssl rand -base64 32`.
4. **Supabase Storage (`SUPABASE_S3_*`)** — Project Settings → Storage → S3
   Connection. If left unset, the app falls back to Payload's default
   local-disk upload storage (fine for local dev only, **not** for
   production/Vercel's ephemeral filesystem).
5. **Visitor logging (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)** —
   Project Settings → API. `SUPABASE_SERVICE_ROLE_KEY` is a high-privilege,
   server-only secret — never prefix it `NEXT_PUBLIC_`, never reference it
   from a Client Component. If unset, visitor logging silently no-ops
   (never blocks the page, per UC-006 AC6) — the app works fine without it,
   you just won't get analytics rows.

### Apply the database schema

**Payload's own tables** (`products`, `media`, `users`) are managed via
Payload's Postgres/Drizzle migration pipeline:

```bash
pnpm payload migrate:create   # generates a migration from src/collections/*.ts
pnpm payload migrate          # applies it
```

> **Known environment issue:** in *this* sandboxed workspace
> (`.../AI /cosmo-init` — note the space before `/cosmo-init`), the
> `payload` CLI's `generate:types`/`migrate:create`/`migrate` commands fail
> with a module-resolution error. This is an upstream bug
> ([payloadcms/payload#16949](https://github.com/payloadcms/payload/issues/16949))
> in how `tsx`'s async worker-based module loader (forced on Node 23.5+ to
> work around a *different*, unrelated tsx bug) handles file paths that
> contain a space. It reproduces with a minimal `tsx` script too — it is
> not caused by anything in this project's code. **Workaround:** run these
> three commands from a checkout at a path with no spaces (e.g.
> `~/glowrie-storefront` instead of `.../AI /cosmo-init`), or wait for the
> upstream fix. Everything else (`next dev`, `next build`, `pnpm test`,
> `pnpm lint`, `pnpm arch:check`) runs fine in this workspace as-is, since
> Next's own bundler (Turbopack/webpack) resolves these same files
> correctly — this build has been verified to succeed (see §7).

**`visitor_logs`** (v1.1, UC-006) is a direct Supabase table, intentionally
**outside** Payload's migration pipeline (`architecture.md` §6 exception).
Apply its two hand-written SQL migrations via the Supabase CLI or the
dashboard's SQL editor, in order:

```bash
# via Supabase CLI (recommended):
supabase link --project-ref your-project-ref
supabase db push   # applies everything in supabase/migrations/

# — or paste each file's contents into the Supabase dashboard's SQL editor,
#   in filename order:
#   1. supabase/migrations/20260823000001_create_visitor_logs.sql
#   2. supabase/migrations/20260823000002_visitor_logs_retention_job.sql
```

The second migration enables the `pg_cron` extension and registers the
daily 180-day retention/purge job — `pg_cron` can also be enabled with one
click in the Supabase dashboard's **Database → Extensions** panel first, if
`CREATE EXTENSION` fails due to plan/permission restrictions.

### Run the app

```bash
pnpm dev
```

- Storefront: http://localhost:3000
- Payload admin: http://localhost:3000/admin (first visit prompts you to
  create the first Content Operator account — no separate seed step needed)
- Health check: http://localhost:3000/api/health

### Seed a few products

Log into `/admin`, create 3–4 products (see `docs/refined-prd.md` §9 for
the full field list), upload an image for each, and set **Status =
Published**. Leave one product's `purchaseUrl` blank to see the "Coming
Soon" Buy state, and set a real absolute URL on another to see the
enabled/redirect state.

---

## 5. Testing

### Unit / component tests (Vitest + React Testing Library)

```bash
pnpm test              # run once
pnpm test:watch        # watch mode
pnpm test:coverage     # with coverage report
```

**73 tests across 20 files, all passing**, covering:

- `formatINR`, `isValidAbsoluteUrl` (`src/lib/utils.test.ts`)
- `extractVisitorPageViewMetadata`/`logVisitorPageView` — every UC-006 AC
  including the "must never throw, even on a simulated Supabase outage"
  guarantee (`src/lib/visitor-logging.test.ts`)
- The Middleware's non-blocking `NextResponse.next()` guarantee
  (`src/middleware.test.ts` — asserts synchronous return even when the
  logging promise never resolves)
- `Products` collection access control and the `afterChange` revalidation
  hook (`src/collections/Products.test.ts`)
- Every shared UI component and product-feature component (smoke +
  behavior tests, including "omits blank fields" for `SpecTable`/
  `FragranceNotesBreakdown` and enabled/disabled states for `BuyButton`)
- The Home and Product Detail Server Components themselves, with
  `getPayloadClient` mocked, covering all render branches (populated/
  empty/error, found/not-found/error)

### E2E tests (Playwright)

18 spec files (23 tests) exist under `e2e/`, one per acceptance criterion
group named exactly per `development-plan.md`'s file-naming convention
(e.g. `e2e/home/s1a-browse-catalog.spec.ts`, `e2e/buy/s2-buy-from-detail.spec.ts`).

**These could not be executed in this sandboxed environment**, for two
independent reasons, neither related to the app code:

1. **No live Supabase/Payload backend.** E2E tests exercise the real
   running app end-to-end (no mocking layer, per `architecture.md` §14) —
   they need seeded Published products, and the content-operator specs
   need a real admin login, exactly as documented in each spec file's
   header comment.
2. **Playwright's browser binary could not be downloaded** in this sandbox
   (`self-signed certificate in certificate chain` — a corporate/VPN
   TLS-interception artifact of this specific machine, unrelated to the
   project). `npx playwright install --with-deps chromium` also requires
   `sudo`, unavailable here.

**To actually run them:** complete §4's Supabase setup, seed products per
each spec's header comment (a couple of specs read `E2E_ADMIN_EMAIL`/
`E2E_ADMIN_PASSWORD`/`E2E_SEED_PRODUCT_ID`/`E2E_DISPOSABLE_PRODUCT_ID` env
vars — set these to match your seed data), then:

```bash
npx playwright install chromium   # one-time, needs real network/cert access
pnpm e2e
```

---

## 6. Code Quality Gates

```bash
pnpm lint         # ESLint — 0 errors (a few intentional console.error warnings
                  # for server-side-only error logging, per development-plan.md §2.4)
npx tsc --noEmit  # TypeScript strict mode — 0 errors
pnpm arch:check   # dependency-cruiser — 0 violations (verified against a
                  # deliberately-introduced violation during development, then reverted)
```

---

## 7. Production Build

Verified locally in this workspace:

```bash
npx next build
```

completes successfully (`✓ Compiled successfully`, TypeScript pass,
all 8 routes generated) even **without** a live database — the Home page's
`try/catch` around the Payload Local API call correctly falls back to the
`ErrorState` UI (UC-001 AC4) during the build's static-generation pass,
rather than crashing the build. With a real `DATABASE_URI`, the same route
will statically/incrementally render actual product data instead.

Build command for deployment (already wired into `package.json`):

```json
"build": "payload migrate && next build"
```

(matches `architecture.md` §8 — schema is always current before the new
build serves traffic). Note: run this build command from a path without
spaces, per the §4 "Known environment issue" — `payload migrate` inside
this composite command hits the same CLI bug as the standalone commands.

---

## 8. Deployment (Vercel + Supabase) — what you still need to do

Per `development-plan.md` S4, this is not yet deployed (no live credentials
exist in this sandbox). To actually go live:

1. Create a **production** Supabase project (separate from your dev
   project) and run through §4's migration/`pg_cron` steps against it.
2. Create a Vercel project, connect this Git repository.
3. Set all `.env.example` variables as **encrypted Vercel Environment
   Variables**, scoped to Production (and Preview, if you want staging).
4. Set the Vercel build command to `payload migrate && next build`
   (already the default `pnpm build` script).
5. Deploy. Confirm `https://your-domain/api/health` returns `200`.
6. Log into `/admin` on the production URL, create your real Content
   Operator account, and publish your real catalog.
7. Set up external uptime monitoring against `/api/health` (tool choice is
   yours, per `architecture.md` §12 — e.g. UptimeRobot, Better Uptime,
   Vercel's own monitoring).

---

## 9. Project Structure

```
src/
  app/
    (storefront)/          # Home, Product Detail, Brand/About + layout/error boundary
    (payload)/              # Payload admin mount + REST/GraphQL API mount
    api/health/              # Liveness probe
  collections/               # Products, Media, Users (Payload collection configs)
  components/
    ui/                      # Button, Badge, LoadingSkeleton (lowest layer)
    layout/                  # PageShell, Header, Footer
    products/                # ProductCard, ProductCarousel, SpecTable,
                              # FragranceNotesBreakdown, BuyButton, FeaturedSpotlight
    feedback/                # ErrorState, EmptyState
  lib/                       # payload.config.ts, getPayloadClient, utils,
                              # visitor-logging.ts, types.ts
  middleware.ts               # UC-006 visitor-logging Middleware
  styles/globals.css          # Golden Alchemist Tailwind v4 theme
  test-utils/                 # Vitest fixtures + next/image|link mocks
supabase/migrations/          # visitor_logs table + RLS + pg_cron retention job
e2e/                          # Playwright specs, one per AC group
.dependency-cruiser.cjs       # Architecture enforcement config
```

---

## 10. Scope Reminders (see `docs/refined-prd.md` for full detail)

- Currency: INR only. No accounts/login/search/cart/checkout.
- Content Operator manages the catalog entirely via Payload's built-in
  admin — no custom admin UI was built (per PRD §7).
- `visitor_logs` is intentionally **not** a Payload collection and has
  **no** in-app reporting UI — it's write-only from the app's perspective;
  any review happens via direct Supabase SQL access (PRD §9).
- DPDP Act (India) formal legal review is explicitly deferred by the
  stakeholder (PRD §15 OQ-11) — the footer privacy notice + 180-day
  retention are good-faith measures, not a legal determination.
