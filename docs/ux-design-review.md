# UX Design Review — Glowrie Storefront (Visitor persona, static HTML prototype)

**Mode:** HTML_VALIDATION | **Round:** 1 | **UX_DESIGN_MODE:** html (static HTML, not Angular/iTN — DS3 tool gates N/A, see Tooling Note below)
**Target:** `docs/ux/ux-design-html/visitor/index.html`
**Sources:** `docs/refined-prd.md` (UC-001–UC-005, §9 Data, §13 UI/UX), Golden Alchemist `DESIGN.md`/`code.html` mockups at `/home/mohammady/Documents/learning/Glowrie/*`

## Tooling Note (Step 0 / Mandatory First Gate)

`DS3` (the iTN DS3.0 tool) is not present in this environment (`ds3.py` not found under any Harvey skill scope) and is not applicable to this artifact: this is a plain static-HTML, no-build, non-Angular, non-`itn-library2` consumer storefront prototype (design-first, no architecture.md) — none of the `ng audit`/`ng audit-project`/`ng verify` gates (which check `itn-*` selectors, Angular template contracts, and a running Angular dev server) have a target to run against. This is the explicitly sanctioned exception path (throwaway static-HTML prototype, in-page mock array, offline-capable). In place of the DS3 gate, a headless-Chrome runtime check was run directly against the file (`google-chrome --headless=new --dump-dom`) to confirm zero console/runtime errors and correct DOM population — see `DS3 VERIFY` line below.

## Verdict

**PASS** — 100% requirement coverage after Round 1 fixes (3 gaps found, all fixed; 0 remaining).

## Audit Performed

- **Use cases:** UC-001 (Browse/Home), UC-002 (Product Detail), UC-003 (Buy/external redirect, embedded in Home+Detail), UC-004 (Brand/About) — all ACs walked individually. UC-005 (Content Operator CMS) confirmed out of scope for this prototype per instructions.
- **Screen states:** loading/empty/error/populated on Home; loading/error(not-found)/populated on Detail; static on Brand/About. All state markup + JS branches present and correct.
- **Navigation:** every `showScreen()`/`goToProduct()` call target-checked against existing screen IDs and functions; footer decorative links (`onclick="return false;"`) confirmed as sanctioned static placeholder groups, not dead functional links — no genuine dead ends found.
- **Quality rules:** no `alert`/`confirm`/`prompt`; no `TODO`/`FIXME`/lorem-ipsum; single responsive file (`@media` breakpoints only); `innerHTML` usage audited — all 8 call sites interpolate only the trusted in-page `MOCK_PRODUCTS` constant (no user input path), so no live XSS surface; every `onclick` resolved to a defined function.
- **Design tokens:** full Golden Alchemist palette cross-checked against `:root` custom properties and against the source `DESIGN.md` (colors + typography scale, byte-for-byte size/weight/line-height match); sharp 0-radius rule confirmed on buttons, with circular use limited to genuinely decorative controls (hero/carousel arrows, hero dots, fragrance-note icons, step-number badges) consistent with the source mockup; confirmed zero `box-shadow` anywhere; confirmed currency is `₹` only (no literal `$` found).
- **Runtime verification:** headless Chrome dump of the file confirmed: Home screen resolves loading→populated with no console/JS errors, the product carousel renders exactly the 5 Published products (GL-01/02/03/04/06) with Draft GL-05/GL-07 correctly excluded, the hero carousel initializes (3 dots), and the Featured spotlight populates.
- **Font/offline decision:** verified as a documented, deliberate choice (system-font stacks in place of a Google Fonts CDN) — typography sizes/weights/line-heights match `DESIGN.md` exactly; not treated as a gap per instructions.

## Gaps Fixed (3)

1. **[MEDIUM] Entity-field coverage — Home carousel card missing key-actives highlight (UC-001 Step 3).** The PRD explicitly requires each carousel card to show "SKU/code, optional badge, image, name, **key-actives highlight**, price." The card subtitle was rendering `categoryLabel` instead of `keyActives`. Cross-checked against the source mockup (`home page/code.html`), which confirms that card-subtitle slot is always the key-actives text (e.g. "8% GLYCOLIC + 2% SALICYLIC ACID"), never a category label. **Fix:** `renderHomeCarousel()` now renders `p.keyActives || p.categoryLabel` (falls back cleanly, never blank, preserving the UC-002 AC4 no-blank-field rule).
2. **[LOW] UC-003 AC4 (malformed `purchaseUrl`) had no exercising data.** `isValidAbsoluteUrl()` correctly implements "malformed → same disabled Coming Soon state as unset," but no `MOCK_PRODUCTS` record had a non-empty-but-invalid URL — only the empty-string case (AC3, via GL-02) was exercised. **Fix:** gave GL-06 a protocol-less malformed URL (`www.glowrie-retailer.example.com/...`) with an inline comment explaining the intent; verified via unit-level check that `isValidAbsoluteUrl()` returns `false` for it and `true`/`false` unchanged for the other fixtures.
3. **[LOW] Design-token consistency — `--color-error` (#ba1a1a) defined but never applied.** The token is part of the required Golden Alchemist verification set but had zero usage in the stylesheet, so the two error states (`home-error`, `pd-error`) had no distinguishing accent at all. **Fix:** added a 1px hairline top-rule + heading color using `--color-error` on both error states (`.state-error .state-message` / `.pd-not-available`) — consistent with the system's "depth via tonal layering + hairline rules, never drop shadows" elevation rule (no `box-shadow` introduced).

## Remaining Gaps (0 — for user decision)

None.

## DS3 AUDIT / VERIFY

```
DS3 AUDIT: N/A — no ds3.py present in this environment and no Angular/itn-library2 target exists in this static-HTML, no-build prototype (sanctioned exception per PRD/instructions).
DS3 VERIFY: PASS (substitute headless-Chrome runtime check) — gridRows n/a, emptyCols n/a, rawKeys none found, failedRequests 0 (offline SVG-only, no <img>/network deps), consoleErrors 0, visualDefects none observed (home-loading/empty/error correctly hidden, home-content correctly populated with 5/5 expected Published cards, hero dots initialized).
```
