# Level of Effort (LOE) Estimate

**Project:** Glowrie Storefront ("Cosmo Init")
**JIRA ID:** N/A (no JIRA ticket configured for this workspace)
**Generated:** 2026-08-23
**Source document:** `development-plan.md` — all effort data below is derived from Section 3's Dependency & Effort Table (Step B). Do not edit LOE numbers independently; if a sprint changes, regenerate this file.
**LOE Version:** 1.0

---

## 1. Executive Summary

| Field | Value |
|---|---|
| Total sprints | 8 (S0 + 5 feature sprints [S1.A, S1.B, S1.C, S2, S3] + 1 integration [INT-1] + 1 Deployment) |
| Total human effort (solo dev, all sprints) | **96 hrs / 12.0 working days** |
| Total agent effort (implementation only) | **25 hrs** |
| Total HITL human effort (agent scenario) | **28.5 hrs** — minimum human investment when agents implement; includes HITL gate reviews + PR review per sprint |
| Critical path (sequential baseline) | 12.0 working days — solo developer, all sprints sequential |
| Fastest delivery — parallel tracks | **9.25 working days** with 2 developers |
| Fastest delivery — agent-assisted | **19.5 hrs wall-clock** agent execution (plus HITL review turnaround between sequential gates) |
| Human-days saved by parallelism | **2.75 working days** |
| Agent-hours saved by parallelism | **5.5 hrs** |
| Speedup ratio (human team) | **1.30×** faster with the parallel cycle (S1.A/S1.B/S1.C) |
| Speedup ratio (agent team) | **1.28×** faster (near-ideal — zero coordination overhead) |
| Recommended minimum team | 2 developers (to realize the parallel-cycle speedup) — a solo developer is fully viable given this project's small scope |
| LOE confidence | **High** — this is a small, fully-scoped greenfield app; every task sub-bullet in `development-plan.md` specifies exact file paths, component/collection names, and the §2.4 standard it applies; `architecture.md` is unusually detailed with 0 open architecture questions remaining |
| Total person-days (net, no buffer) | **12.0 days** |
| Risk/contingency buffer | **10%** — High confidence |
| Total person-days (with buffer) | **13.2 days** |
| Story points (total) | **17.6 SP** — at 1 SP ≈ 0.75 person-days |
| Recommended team (FTE) | **~1 FTE** (a single full-stack developer generalist covers Backend+Frontend+DB, given the Modular Monolith pattern with no separate services) — see Resource Plan for the role-split hypothetical |
| Peak sprint group / milestone | **S0 (Groundwork)** — 20 hrs / 2.5 days — within capacity for any reasonable single-developer schedule |
| Over-capacity periods | None — total scope (12 person-days) is comfortably deliverable within a single calendar month even solo |
| **— Harvey AI Comparison —** | |
| Harvey AI person-days (HITL-only) | **3.6 days** — total human time when Harvey agents implement; HITL gate reviews + PR reviews only |
| Harvey AI FTE required | **~0.2 FTE** (part-time reviewer) vs **~1 FTE** traditional |
| FTE reduction (Traditional → Harvey AI) | **~0.8 FTE saved** — ~80% reduction in human staffing cost |
| Days saved (Traditional → Harvey AI) | **~8.4 days** saved — ~70% delivery-time reduction in human effort (agent execution time still requires the dependency chain to run) |

> **Three effort dimensions:**
> - **Human-hrs** — full human implementation effort; baseline (no agents)
> - **Agent-hrs** — agent execution time; Human × 0.25 applied throughout, since this plan's task sub-bullets are consistently well-defined (exact file paths, component/collection names, §2.4 patterns named inline)
> - **HITL Human-hrs** — the irreducible human time that remains even when agents implement everything: HITL gate reviews (`[User Input]` approvals) + PR review + sprint sign-off

> **Confidence definition applied:** High — all 8 sprints in `development-plan.md` have task sub-bullets with exact file paths, class/component names, and inline §2.4 pattern references; no vague phrases; no unresolved integrations (the one dependency this project has — Payload CMS + Supabase — is stood up in Sprint 0 itself, not deferred).

---

## Estimation Methodology

Effort per sprint is taken directly from `development-plan.md` §3's Dependency & Effort Table (Step B), which used the standard reference rates: DDL/schema ~2–4h human; backend service/collection logic ~6–10h; frontend UI ~6–10h; tests ~3–6h; infra/config ~2–4h; sprint overhead ~1–2h. Agent-hrs = Human-hrs × 0.25 throughout (well-defined tasks — this plan has no vague sub-bullets warranting the ×0.5 multiplier). HITL Human-hrs = `(count of [User Input] checkpoints × 0.5 hrs) + 1.5 hrs` per sprint (`+2 hrs` base for the integration sprint INT-1; S0 uses a flat `2 hrs` base per the standard rule for groundwork sprints).

**Role classification** (task description keywords → role bucket, applied per sprint's task list in `development-plan.md`):

| Role | Keywords |
|---|---|
| Backend Developer | Payload Local API queries, collection config logic (non-DDL), route handlers |
| Frontend Developer | React components, pages, Tailwind/shadcn UI, client-side state |
| Database / DBA | Collection schema definition, migrations, access-control field validation |
| QA Engineer | Tests & Code Coverage tasks, AC Coverage Matrix, Playwright E2E |
| DevOps / CI | Scaffolding, environment config, test/lint framework setup, deployment |
| Architecture / Integration | `arch:check` tooling setup, Integration Sprint merge + audit |
| HITL Reviewer | `[User Input]` checkpoints + PR review + sprint sign-off |

**Story point conversion:** 1 SP ≈ 0.75 person-days (Harvey default).

---

## 2. Delivery Scenario Comparison

_Derived from the Parallelism Time Savings Summary in `development-plan.md` §3 HITL Overview._

| Scenario | Calendar Days | Total Human-hrs | Total Agent-hrs | HITL Human-hrs | Human-days Saved vs Baseline | Agent-hrs Saved vs Baseline | Notes |
|---|---|---|---|---|---|---|---|
| **Baseline — solo developer, fully sequential** | 12.0 | 96 | 25 (reference) | N/A | — | — | No parallelism; S0→S1.A→S1.B→S1.C→INT-1→S2→S3→S4, all sequential |
| **2-person team — parallel cycle active** | 10.5 | ~106 (+10% coordination overhead) | N/A | N/A | **1.5 days** | — | S1.A/S1.B split across 2 devs, S1.C absorbed by whichever finishes first |
| **3-person team — full parallel cycle** | 9.5 | ~110 (+15% coordination overhead) | N/A | N/A | **2.5 days** | — | S1.A, S1.B, S1.C each fully assigned to one developer, run simultaneously |
| **Solo developer + agents (hybrid)** | ~6 (sequential HITL-gate turnaround) | N/A | 19.5 | **28.5** | **6 days** | **5.5 hrs** | Developer reviews only at each of the 6 sequential gate points (S0, S1-cycle, INT-1, S2, S3, S4); agents implement + test |
| **Full agent team — no human implementers** | ~5 | N/A | 19.5 (critical path) | **28.5** | **7 days** | **5.5 hrs** | Agents run S1.A/S1.B/S1.C concurrently; same 6 sequential HITL gates, same-day turnaround assumed |

> **How to use this table:** This is a solo-developer project today (Mohammad Taha, sole stakeholder). The 2-/3-person rows show the calendar-time benefit *if* additional capacity is added — not a requirement. The agent-assisted rows are the most realistic near-term path for a solo stakeholder: **28.5 hrs of HITL review time** spread across the plan (not 96 hrs of implementation) is the real cost if Harvey agents execute the plan.

---

## 3. Sprint-by-Sprint Effort Breakdown

| Sprint | Label | Type | Human Effort (hrs) | Human Effort (days) | Agent Effort (hrs) | HITL Human-hrs | Dep. Class | On Critical Path? | Parallel Track | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| S0 | Groundwork, Scaffolding & Shared Foundation | SEQUENTIAL | 20 | 2.5 | 6 | 2.0 | — | ✓ | — | High |
| S1.A | Browse Home Page (UC-001) | PARALLEL | 14 | 1.75 | 3.5 | 3.5 | IMPL | ✓ (critical-path pick) | S1.B / S1.C | High |
| S1.B | View Product Detail (UC-002) | PARALLEL | 14 | 1.75 | 3.5 | 3.5 | IMPL | — | S1.A / S1.C | High |
| S1.C | Brand/About Page (UC-004) | PARALLEL | 8 | 1.0 | 2.0 | 3.5 | IMPL | — | S1.A / S1.B | High |
| INT-1 | Integration Sprint 1 | INTEGRATION | 8 | 1.0 | 2.0 | 3.5 | IMPL | ✓ | — | High |
| S2 | Buy External Redirect (UC-003) | SEQUENTIAL | 10 | 1.25 | 2.5 | 3.0 | IMPL | ✓ | — | High |
| S3 | Content Operator CMS Management (UC-005) | SEQUENTIAL | 12 | 1.5 | 3.0 | 4.0 | IMPL | ✓ | — | High |
| S4 | Deployment Sprint | DEPLOYMENT | 10 | 1.25 | 2.5 | 5.5 | IMPL | ✓ | — | High |
| **TOTAL** | | | **96** | **12.0** | **25.0** | **28.5** | | | | |

**Note on effort vs. calendar time:** S1.A/S1.B/S1.C all appear above but only the longest (S1.A/S1.B, tied at 14h) adds to critical-path calendar time. The critical path is S0(20) + S1.A(14) + INT-1(8) + S2(10) + S3(12) + S4(10) = **74 hrs = 9.25 days**.

---

## 3b. Per-Sprint Human vs Agent Task-Type Breakdown

| Sprint | Task Type | Human-hrs | Agent-hrs | HITL Human-hrs | Human−Agent−HITL Net Savings | % Human Time Saved |
|---|---|---|---|---|---|---|
| S0 | Scaffolding, env config, DB collections/migrations | 8 | 2.0 | 0 | 6.0 hrs | 75% |
| S0 | Shared UI library + Tailwind theme | 5 | 1.25 | 0 | 3.75 hrs | 75% |
| S0 | Test framework + architecture enforcement tooling | 5 | 1.25 | 0 | 3.75 hrs | 75% |
| S0 | Infra smoke-tests + health route + docs | 2 | 0.5 | 0 | 1.5 hrs | 75% |
| S0 | **HITL gate (Harvey validation + User review + PR review)** | **0** | **0** | **2.0** | — | — |
| S1.A | Backend query + Frontend carousel/card + ISR wiring | 10 | 2.5 | 0 | 7.5 hrs | 75% |
| S1.A | Tests & Code Coverage (AC Coverage Matrix) | 4 | 1.0 | 0 | 3.0 hrs | 75% |
| S1.A | **HITL gate** | **0** | **0** | **3.5** | — | — |
| S1.B | Backend query + Frontend spec/fragrance components | 10 | 2.5 | 0 | 7.5 hrs | 75% |
| S1.B | Tests & Code Coverage | 4 | 1.0 | 0 | 3.0 hrs | 75% |
| S1.B | **HITL gate** | **0** | **0** | **3.5** | — | — |
| S1.C | Content authoring + page composition | 5 | 1.25 | 0 | 3.75 hrs | 75% |
| S1.C | Tests & Code Coverage | 3 | 0.75 | 0 | 2.25 hrs | 75% |
| S1.C | **HITL gate** | **0** | **0** | **3.5** | — | — |
| INT-1 | Branch merge + arch audit + schema check | 4 | 1.0 | 0 | 3.0 hrs | 75% |
| INT-1 | Full regression + AC re-verification | 4 | 1.0 | 0 | 3.0 hrs | 75% |
| INT-1 | **HITL gates (2 checkpoints)** | **0** | **0** | **3.5** | — | — |
| S2 | `isValidAbsoluteUrl` + `BuyButton` + Spotlight + Detail wiring | 7 | 1.75 | 0 | 5.25 hrs | 75% |
| S2 | Tests & Code Coverage | 3 | 0.75 | 0 | 2.25 hrs | 75% |
| S2 | **HITL gate** | **0** | **0** | **3.0** | — | — |
| S3 | Access control tests + revalidation verification + admin UX polish | 8 | 2.0 | 0 | 6.0 hrs | 75% |
| S3 | Tests & Code Coverage | 4 | 1.0 | 0 | 3.0 hrs | 75% |
| S3 | **HITL gate (3 checkpoints)** | **0** | **0** | **4.0** | — | — |
| S4 | Production Supabase + Vercel config + secrets + deployment | 8 | 2.0 | 0 | 6.0 hrs | 75% |
| S4 | Production smoke test (all 5 use cases) | 2 | 0.5 | 0 | 1.5 hrs | 75% |
| S4 | **HITL gate (data-collection + validation checkpoints)** | **0** | **0** | **5.5** | — | — |
| **Total — implementation tasks** | | **86** | **21.5** | **0** | **64.5 hrs saved** | **75%** |
| **Total — HITL rows** | | **0** | **0** | **28.5** | — | — |
| **Grand Total** | | **96** | **25.0** | **28.5** | **42.5 hrs** | **44%** |

> **Reading the Grand Total:** Even after adding back the 28.5 hrs of irreducible HITL review time, the agent scenario costs ~53.5 hrs total (25 agent-hrs + 28.5 HITL hrs) vs. 96 hrs of pure human implementation — a **44% reduction in total elapsed effort**, and more importantly, only **28.5 of those 96 hrs require a human** (a 70% reduction in human time specifically).

**Agent-readiness tiers for this plan:**
- **Tier 1 — Agent-optimal:** Payload collection schema/migrations, shared UI primitives (S0), `isValidAbsoluteUrl`/`BuyButton` (S2), Tests & Code Coverage tasks across all sprints (AC Coverage Matrix pre-defined)
- **Tier 2 — Agent-efficient:** Home/Detail/About page composition, access-control integration tests (S3)
- **Tier 3 — Human-preferred:** None identified — this plan's scope (3 static-ish pages, 1 collection, no complex business logic) is unusually agent-friendly
- **Tier 0 — HITL only:** All `[User Input]` gate reviews, PR approvals, sprint sign-offs

---

## 4. Role-Based Effort Breakdown

_Hypothetical multi-role split — presented per the standard LOE format even though this project's small scope (12 person-days total) is realistically covered by a single full-stack generalist developer (see Resource Plan below)._

| Role | Sprints Involved | Human Effort (hrs) | Human Effort (days) | Agent Effort (hrs) | HITL Human-hrs | % of Total Human-hrs |
|---|---|---|---|---|---|---|
| Frontend / UI (components, pages, Tailwind/shadcn) | S0, S1.A, S1.B, S1.C, S2 | 32 | 4.0 | 8.25 | 0 | 33.3% |
| QA / Testing (Tests tasks, AC Coverage Matrix, E2E) | S1.A, S1.B, S1.C, INT-1, S2, S3, S4 | 24 | 3.0 | 6.25 | 0 | 25.0% |
| Backend (Payload Local API queries, collection logic, access control) | S0, S1.A, S1.B, S2, S3 | 17 | 2.125 | 4.5 | 0 | 17.7% |
| DevOps / Infrastructure (scaffolding, test/lint setup, deployment) | S0, S4 | 13 | 1.625 | 3.5 | 0 | 13.5% |
| Architecture / Integration (`arch:check` setup, INT-1 merge + audit) | S0, INT-1 | 7 | 0.875 | 1.75 | 0 | 7.3% |
| Database / Schema (collection schema, migrations) | S0 | 3 | 0.375 | 0.75 | 0 | 3.1% |
| **HITL Reviewer** (gate reviews, `[User Input]` approvals, PR review, sign-off) | All sprints | **0** | **0** | **0** | **28.5** | — |
| **Total** | | **96** | **12.0** | **25.0** | **28.5** | **100%** |

> **Reading the HITL Reviewer row:** If Harvey agents run every sprint, the human's total time investment is **28.5 hrs** spread across 8 sprints — roughly **1 hour of review time per sprint on average**, not the 96 hrs of full implementation.

---

## Resource Plan & Team Composition

_Given this project's very small total scope (12 person-days), a role-by-role FTE breakdown overstates organizational complexity. The practical recommendation is below the formal table._

| Role | Headcount | Allocation | Total Person-Days | FTE | Rationale |
|---|---|---|---|---|---|
| Full-Stack Developer (Frontend+Backend+DB) | 1 | ~60% | 9.75 | 0.6 | Covers Frontend (4.0d) + Backend (2.1d) + Database (0.4d) + Architecture (0.9d) + a share of DevOps — this is one person on a Modular Monolith with no service boundary |
| QA Engineer | 1 | 15% | 3.0 | 0.15 | Tests & Code Coverage tasks, embedded within each sprint rather than a separate QA phase |
| DevOps / CI | 1 | 10% | 1.6 | 0.1 | S0 tooling setup + S4 deployment — front-loaded and back-loaded, not sustained |
| **Total** | | | **~14.4** (some overlap with the Full-Stack role above) | **~0.85 FTE** | |

**Practical recommendation:** Given the total effort (12 person-days) and the Modular Monolith architecture (no frontend/backend service split), the realistic staffing model is **1 full-stack developer at ~60–75% allocation for approximately 3 calendar weeks**, personally covering the Frontend/Backend/Database/QA/DevOps roles above rather than a multi-person team. The role table exists to show *where* the effort concentrates (Frontend 33%, QA 25%, Backend 18%), not to imply 6 separate hires are needed.

**Monthly capacity:** 1 developer × 20 working days = **20 person-days available per month** — comfortably exceeds this project's 12-day (13.2 with buffer) requirement within a single month.

### Harvey AI Staffing Scenario (Agent-Assisted)

| Role | Headcount | Allocation | Total Person-Days (HITL) | FTE | Notes |
|---|---|---|---|---|---|
| HITL Reviewer | 1 | ~18% | **3.6 days** | **~0.2** | Gate reviews + `[User Input]` approvals + PR sign-off across all 8 sprints |

**Harvey AI monthly capacity:** 0.2 FTE × 20 = **4 person-days/month** of human review overhead — well within a single stakeholder's part-time availability.

> **Traditional vs Harvey AI:** Traditional staffing requires **~1 FTE** for ~3 weeks (12 person-days). The Harvey AI scenario requires **~0.2 FTE** — an **~80% reduction** in human effort. The remaining human investment (3.6 days) is irreducible oversight (reviewing Harvey's work at each gate), not implementation.

---

## Monthly Capacity Plan

_This project's entire scope fits within a single calendar month regardless of scenario — no over-capacity periods exist._

| Month / Period | Sprint Group / Milestone | Working Days | Team Capacity (Traditional) | Required LOE (Traditional) | Harvey AI Required (person-days) | Days Saved (Harvey AI) | Surplus / Deficit (Traditional) |
|---|---|---|---|---|---|---|---|
| Month 1 | S0 → S1.A/S1.B/S1.C → INT-1 → S2 → S3 → S4 (entire plan) | 20 | 20 (1 FTE × 20) | 13.2 (with buffer) | 3.6 | **9.6 days** | +6.8 (surplus) |
| **Totals** | | **20** | **20** | **13.2** | **3.6** | **9.6** | **+6.8** |

**Capacity analysis:** The entire plan fits comfortably within a single developer's monthly capacity in either scenario. No augmentation or re-sequencing is needed.

---

## 5. Timeline Projection

**Selected scenario for timeline:** Solo developer, fully sequential (this project's actual staffing today)
**Sprint start date:** _(fill at plan sign-off)_
**Working days per week:** 5

| Week | Sprint(s) | Type | Owner(s) | HITL Human-hrs This Band | Milestone / Gate |
|---|---|---|---|---|---|
| 1 | S0 | SEQUENTIAL | Solo dev | 2.0 hrs | S0 Harvey Sign-Off + Human Sign-Off ✅ |
| 2 | S1.A, S1.B, S1.C | PARALLEL (executed sequentially by solo dev, or concurrently if a 2nd dev/agent joins) | Solo dev (or Dev A/Dev B/Agent) | 10.5 hrs | All 3 tracks Harvey Sign-Off + Human Sign-Off ✅ |
| 3 (early) | INT-1 | INTEGRATION | Solo dev | 3.5 hrs | INT-1 full-stack AC verification ✅ |
| 3 (mid) | S2 | SEQUENTIAL | Solo dev | 3.0 hrs | S2 Harvey Sign-Off + Human Sign-Off ✅ |
| 3 (late) – 4 (early) | S3 | SEQUENTIAL | Solo dev | 4.0 hrs | S3 Harvey Sign-Off + Human Sign-Off ✅ — all 5 use cases complete |
| 4 | S4 (Deployment) | DEPLOYMENT | Solo dev | 5.5 hrs | Production deployment verified ✅ — project complete |

**Projected completion date (no buffer):** ~4 calendar weeks from sprint start (12 working days of effort, spread across a realistic solo-developer cadence)
**Projected completion date (with recommended 10% buffer):** ~4.5 calendar weeks (13.2 working days of effort)

---

## 6. Confidence & Risk Register

| Sprint | Confidence | Risk Factor | Probability | Impact | Buffer (hrs) | Mitigation |
|---|---|---|---|---|---|---|
| S0 | High | Payload 3.x + Supabase Postgres adapter integration friction (young ecosystem per `architecture.md` §16) | Low | Medium | +2h | Follow Payload's official Next.js integration guide exactly; smoke-test DB/Storage before proceeding |
| S1.A | High | None significant | Low | Low | +1h | — |
| S1.B | High | None significant | Low | Low | +1h | — |
| S1.C | High | None significant | Low | Low | +0.5h | — |
| INT-1 | High | Merge conflicts (expected: none, given zero shared files across tracks) | Low | Low | +1h | Task Concurrency Maps in S1.A/B/C confirm disjoint file sets |
| S2 | High | Field-level `purchaseUrl` validation edge cases (malformed URL schemes) | Low | Medium | +1h | `isValidAbsoluteUrl` test suite explicitly covers malformed/relative/`javascript:` cases |
| S3 | High | Payload access-control function edge cases under concurrent admin sessions | Low | Low | +1h | Integration tests via `@payloadcms/testing` against a disposable test DB |
| S4 (Deployment) | Medium | Production Supabase/Vercel environment variable misconfiguration | Medium | High | +2h | `.env.example` documents every required key; smoke-test `/api/health` immediately post-deploy |

**Total buffer recommendation:** 9.5 hrs / 1.2 working days

**Aggregate confidence for this plan:** **High** — one sprint (S4, Deployment) is rated Medium due to the inherent unpredictability of first-time production environment configuration; all 7 other sprints are High confidence.

---

## 7. Critical Path

**Critical path sprints (in order):**

```
S0 → S1.A → INT-1 → S2 → S3 → S4
```

**Critical path length:** 9.25 working days (without buffer) / ~10.2 days (with 10% buffer)

**Off-critical-path sprints (parallel tracks — do not add to calendar time):**

| Sprint | Runs in Parallel With | Calendar Band | Human-hrs on Critical Path Saved |
|---|---|---|---|
| S1.B | S1.A | Week 2 | 14 hrs |
| S1.C | S1.A, S1.B | Week 2 | 8 hrs |

> **What "critical path" means for scheduling:** Only S0, S1.A (the longest of the 3 parallel tracks, tied with S1.B), INT-1, S2, S3, and S4 determine the delivery date. Adding a second developer to build S1.B and S1.C concurrently with S1.A does not change S1.A's own duration — it only avoids adding S1.B's and S1.C's hours to the calendar sequentially.

---

## 8. Task-Level Concurrency Summary

| Sprint | Total Tasks | Tasks on Sequential Chain | Concurrently Executable Pairs | Agent-hrs Saved (within-sprint) | HITL Human-hrs (this sprint) |
|---|---|---|---|---|---|
| S0 | 7 | 3 (Task 1 → Task 6/7 tail) | Tasks 2, 3, 5 concurrently after Task 1; Task 4 concurrent with 2/3/5 | ~2.5 hrs | 2.0 |
| S1.A | 5 | 3 | Tasks 1 and 2 concurrently (independent until Task 3 wiring) | ~0.75 hrs | 3.5 |
| S1.B | 4 | 3 | Tasks 1 and 2 concurrently | ~0.75 hrs | 3.5 |
| S1.C | 3 | 3 | None significant (content authoring and composition are tightly coupled) | 0 hrs | 3.5 |
| INT-1 | 5 | 5 (integration verification is inherently sequential) | None — Task 2 gates 3, which gates 4, which gates 5 | 0 hrs | 3.5 |
| S2 | 5 | 3 | Tasks 3 and 4 concurrently after Task 2 (`BuyButton`) | ~1.0 hrs | 3.0 |
| S3 | 5 | 3 | Task 1 and Task 3 concurrently; Task 4 independent of Tasks 1–3 | ~1.25 hrs | 4.0 |
| S4 | 5 | 4 | Tasks 1 and 2 concurrently (different vendor dashboards) | ~0.5 hrs | 5.5 |
| **Total within-sprint savings** | | | | **~6.75 hrs** | **28.5 hrs** |

> **For agent orchestration:** S0's Task Concurrency Map offers the largest within-sprint speedup — Tasks 2 (Shared UI), 3 (unlabeled — see plan; actually Test Framework), and 5 (Architecture Enforcement) can be dispatched to 3 separate agents simultaneously once Task 1 (scaffolding) completes.

---

## 9. Assumptions & Exclusions

### Assumptions

| # | Assumption | Affects |
|---|---|---|
| 1 | All external service credentials (Supabase dev project, Storage keys, `PAYLOAD_SECRET`, Git repo URL) are available before S0 starts, per `development-plan.md` §1.4 | S0 infra setup |
| 2 | The tech stack in `architecture.md` (Next.js 15 + Payload 3.x + Supabase Postgres + Vercel) is final — no stack changes after plan sign-off | All sprints |
| 3 | This is a pure greenfield workspace (confirmed — no existing application code) | All sprints |
| 4 | The developer works 8 hours/day on this project when actively engaged (no context-switching to other projects during a sprint) | All human effort estimates |
| 5 | Agents have access to the full codebase, run tool calls without approval for non-destructive operations, and can execute tests/`arch:check` locally | All agent effort estimates |
| 6 | HITL Human-hrs per sprint = `(count of [User Input] checkpoints × 0.5 hrs) + 1.5 hrs` (PR review + sprint sign-off). INT-1 = `(checkpoint count × 0.5 hrs) + 2 hrs`. S0 uses a flat 2 hrs base. | §3, §3b, §4 HITL Reviewer row, §8 |
| 7 | Harvey's own validation steps (health endpoint checks, test execution, `arch:check` runs) cost 0 HITL human hours — the human only reviews Harvey's output at `[User Input]` gates | All HITL estimates |
| 8 | PR review and merge by the human reviewer takes ~1–1.5 hrs per sprint — included in the 1.5 hrs base of the HITL formula | §3 HITL column, §4 HITL Reviewer |
| 9 | No new requirements are added after plan sign-off (scope is frozen at the 5 PRD use cases, UC-001–UC-005) | All sprints |
| 10 | Agent-hrs = Human-hrs × 0.25 throughout, since every task sub-bullet in this plan names an exact file path, component/collection name, and §2.4 pattern — no sub-bullet warranted the ×0.5 "vague" multiplier | §3, §3b, §4 |

### Exclusions

| # | Exclusion | Reason |
|---|---|---|
| 1 | QA plan creation and execution | Separate Harvey QA mode artifact; effort tracked in `qa-plan.md` when that stage runs |
| 2 | Security review and penetration testing | Separate Harvey Secure mode artifact |
| 3 | Ongoing production deployment monitoring, uptime-tool subscription cost | Harvey Deploy mode covers the initial cutover only; ongoing ops is out of this LOE's scope |
| 4 | Stakeholder communication and project management overhead beyond the HITL gates already counted | Not a development task |
| 5 | Supabase/Vercel account creation and billing setup | Pre-requisite; assumed the user creates these accounts before S0 |
| 6 | UX Design work | Already complete — Harvey UX Design mode delivered and signed off the approved prototype (`docs/ux-design-sign-off.md`) prior to this plan |

---

## 10. LOE Sign-Off

> **Note:** This LOE is a planning estimate, not a commitment. Estimates have inherent uncertainty; confidence ratings in §6 indicate the reliability of each sprint's estimate. Significant scope changes after sign-off require LOE revision.

| Role | Name | Date | Sign-Off |
|---|---|---|---|
| Engineering Lead / Architect | | | ☐ Approved |
| Product Manager | | | ☐ Approved |
| Project Sponsor / Client | | | ☐ Approved (optional — for external-facing LOEs) |

**Approved LOE Version:** 1.0
**Next revision trigger:** Any sprint added, removed, or scope-changed after this sign-off requires LOE v1.1.

---

> This file is generated by Harvey Plan mode. Source: `development-plan.md`. Do not modify independently.
