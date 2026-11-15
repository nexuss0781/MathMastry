# MathMastery — Phases

Each phase ships a working slice, proves it, and stops for approval. Acceptance criteria are executable facts, not intentions. Phase 1 is scaffold by rule.

---

## P1 — Scaffold

**Goal.** One deployable app, one database, one auth path, one green pipeline.

**Tasks**

- Initialize the pnpm workspace: `apps/web` (Vite + React + TypeScript), `apps/api` (Hono + Node 22), `packages/shared`.
- Enable `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`; path aliases; project references.
- ESLint + Prettier + import ordering; fail CI on warnings.
- TanStack Router + TanStack Query; route skeleton with lazy chunks.
- shadcn/ui init; commit the component primitives actually used.
- Design tokens in `apps/web/src/styles/globals.css`: paper/ink/vermilion, Fraunces + Geist + Geist Mono, light/dark.
- Repo hygiene: `.gitignore`, `README.md`, links to `docs/`.
- Drizzle + Neon: `apps/api/src/db/index.ts`, `drizzle.config.ts`, migration workflow.
- Better Auth (Hono adapter): email OTP + GitHub OAuth; `apps/api/src/auth.ts`, session middleware.
- `profiles` table + migration; auto-create profile on first sign-in.
- Hono serves `/api/*` and the built SPA; Vite proxies `/api` in dev; SPA fallback for deep links.
- App shell: marketing landing placeholder, `/sign-in`, authenticated layout with nav and user menu.
- `GET /api/health` → `{ app, db, ai }` (AI reports configured/not configured, never the key).
- Zod-validated env at boot in both apps; only `VITE_*` public values reach the client.
- Vitest (web/api/shared), Playwright, first unit test, first smoke E2E.
- Dockerfile + production build: one Node process serving API and static assets.
- GitHub Actions: install → lint → typecheck → unit → build → e2e (smoke).
- `.env.example`.

**Exit criteria**

1. CI is green on a fresh push with zero lint warnings and zero type errors.
2. `pnpm dev` starts both processes; a component edit reflects in <100 ms; `/api` is proxied without CORS.
3. GitHub sign-in works same-origin; session survives refresh; sign-out clears it.
4. From an empty database, `drizzle-kit migrate` creates auth + `profiles`; health reports `db: "ok"`.
5. `/api/health` leaks no secret and returns 503 when the DB is unreachable.
6. `pnpm build` then `docker run` serves the SPA and returns 200 on a deep link (`/atlas`) after refresh; hashed assets are immutable; initial JS <200 KB gzip.
7. Playwright smoke: landing loads, sign-in page loads, health responds.
8. Landing shell meets AA contrast in both themes; fonts load without layout shift.
9. No `.env` values committed; only `VITE_*` appears in the client bundle (grep test).

**Depends on:** nothing.

---

## P2 — Content pipeline + Atlas

**Goal.** All 429 concepts live, sourced, connected, searchable.

**Tasks**

- `scripts/content/parse.ts`: parse `math_topics_glossary_index.md` → `content/concepts.seed.json`.
  - Domains from `###`; anchors, terms, definitions, `[n]` refs, `Related:` links.
  - Stable IDs, deterministic order, checksum.
  - Validation: 429 concepts, 12 domains, every concept has term + definition + ≥1 ref.
- Schema + migration: `domains`, `concepts`, `concept_sources`, `concept_edges`.
- `scripts/content/ingest.ts`: transactional, idempotent upsert by slug; prints coverage.
- Enrichment CLI `scripts/content/enrich.ts`:
  - Strict JSON schema (mechanism, assumptions, failure modes, transfer hooks, examples, prerequisites, related).
  - Batching, content-hash cache, resume, `--dry-run`, `--limit`, `--reviewed-only` guard.
  - Unknown slugs rejected; output `draft`.
- Review path: `pnpm content:approve <slug>` and `/admin/content` table (role-gated) with coverage.
- Embeddings: batch embed, HNSW index, backfill command.
- Edge builder: glossary related + AI prerequisites + embedding neighbors; confidence weights; SCC cycle removal; degree caps.
- Hybrid search: FTS + trigram + vector, RRF fusion; `GET /api/search`.
- Atlas UI (TanStack Router): `/atlas`, `/atlas/$domain`, `/concept/$slug`, `/atlas/map` (SVG + d3-force, lazy chunk).
- Concept page: card sections, sources, prerequisites/related, mastery placeholder, "Ask" entry point.
- Coverage surface: counts for pages, enriched, reviewed, embedded.
- SEO surface: Hono injects title/description/OG/JSON-LD into the shell for concept and domain routes; generated `sitemap.xml`, `robots.txt`, and a `<noscript>` summary.

**Exit criteria**

1. Parse test asserts exactly **429 concepts / 12 domains**; CI fails on drift.
2. 429/429 concept routes return the SPA shell with concept-specific title, description, and OG tags in the initial HTML (`curl` test); the app renders term, one-liner, and ≥1 source.
3. 100% of concepts embedded; search returns results in <100 ms p95 over 50 queries.
4. Relevance: top-3 hit rate ≥85% on a 20-query golden set.
5. Graph is a DAG: zero cycles, ≤8 prerequisites per node; map holds 60 fps pan/zoom with 429 nodes.
6. Enrichment coverage ≥90% draft (or 100% of what the configured model produced, with failures listed); no invented slugs.
7. Coverage dashboard numbers match the database exactly.
8. Deep-link refresh (`/concept/forcing`) returns 200 via SPA fallback; no blank page.
9. E2E: browse domain → open concept → follow a related edge.

**Depends on:** P1.

**Blocked dependency:** AI provider key for enrichment. Fallback: publish seed cards (definition only) and mark enrichment `seed`; the phase still closes on pages/search/graph, with enrichment measured separately.

---

## P3 — Progress, streaks, dashboard

**Goal.** The user's state is real, persistent, and timezone-correct.

**Tasks**

- Schema + migration: `user_concept_state`, `daily_activity`, `user_streaks`.
- `POST /api/concepts/:id/start`: lazy state creation, status transition.
- Manual/claimed level: max L1, hollow badge, note required, never unlocks dependents.
- Activity writer: review, level-up, minutes, XP; single transaction with state changes.
- `packages/shared/src/domain/streak.ts`: local-day computation, streak update, one grace day per ISO week.
- `packages/shared/src/domain/heatmap.ts`: 365-day series, XP buckets, zero-filled.
- Nightly recompute job from `daily_activity`; drift repair.
- `GET /api/progress/summary`; dashboard and `/progress`.
- `ActivityHeatmap` (53×7, tooltip, table alternative), `DomainMasteryTable`, `StreakStrip`.
- Settings: timezone (IANA), weekly minutes, goal.
- Empty states for a brand-new account.

**Exit criteria**

1. State persists across sessions and devices; every query is scoped by `userId` (integration test attempts cross-user access and fails).
2. Streak unit suite passes for `America/New_York`, `Europe/London`, `Asia/Kolkata`, `Pacific/Auckland`, including both DST transitions.
3. Heatmap renders exactly 365 days, zero-filled, with today in the correct local column.
4. Grace rule: one missed day per ISO week preserves the streak; a second breaks it.
5. Nightly recompute produces byte-identical streak values to the live path on seeded data.
6. Dashboard p95 <150 ms on a seeded account with 10k reviews.
7. Claimed L1 is visually distinct and does not unlock a dependent concept (test).
8. E2E: sign in → mark level → see heatmap and streak update.

**Depends on:** P2.

---

## P4 — AI tutor

**Goal.** A grounded tutor that knows the map and the user, and cannot fake mastery.

**Tasks**

- Schema + migration: `ai_threads`, `ai_messages`, `ai_usage`.
- `apps/api/src/ai/provider.ts`: model routing from env; embeddings; timeouts.
- Context assembly: system contract, concept card, ≤8 neighbor one-liners, user state, sources, last 10 turns, rolling summary.
- `POST /api/ai/chat`: SSE via Hono `streamSSE`; abort via `AbortController`; persistence; `status: partial` on abort.
- Tools: `search_concepts`, `get_concept`, `get_neighbors`, `get_user_state`, `create_note`, `propose_review`; Zod-validated, auth-scoped.
- Modes: Socratic (default), Explain, Quiz, Deep dive; assessment lock.
- Citation validation against DB; strip invalid citations; log.
- Quotas: 40 messages/day, soft warning at 80%, hard stop with reset time; global kill switch.
- Tutor panel UI: streaming, citations as chips, mode switcher, thread history, "new thread".
- Eval harness: 30-question golden set (grounding, citation, refusal outside map), 10 prompt-injection cases.

**Exit criteria**

1. First token p95 <2 s; full response p95 <12 s on the reference model.
2. 100% of displayed citations resolve to real concept slugs (automated check).
3. Grounding eval ≥90% on the 30-question set; no answer claims to award mastery.
4. Injection suite: 10/10 attacks fail to call non-allowlisted tools or leak system prompts.
5. Quota enforced server-side; the 41st message returns a typed, friendly 429.
6. Abort preserves the partial message; no orphan threads.
7. Assessment lock: during an active assessment, the tutor refuses to solve it (test).
8. Cost per active user-day <$0.03 on the seeded scenario.

**Depends on:** P2.

**Blocked dependency:** AI key + provider choice. Fallback: contract tests against a recorded fixture server; the phase closes on plumbing and evals run in CI with the fixture.

---

## P5 — Assessment, mastery, scheduling

**Goal.** Levels are earned, stored, and reviewed at the edge of forgetting.

**Tasks**

- `packages/shared/src/domain/mastery.ts`: transition table from `docs/DESIGN.md` §6; pure, clock-injected.
- Rubric prompts + structured output for explain/apply/connect/recall; Zod validation; one retry.
- `POST /api/assessments`: idempotency key, serialized state update, grading, transition, activity, streak, next due — one transaction after grading.
- `ts-fsrs` wrapper; rating map; deterministic tests with fixed clock.
- Daily queue: due reviews (≤25) + next curriculum item + one exploration.
- Assessment drawer: prompt, answer editor (Markdown + LaTeX preview), rubric result, missing-elements feedback.
- 7-day delayed retention flow; `fresh → retained`; lapse handling and level drop.
- Dispute endpoint + admin override with note.
- Gold set: 50 labeled answers across levels and kinds.

**Exit criteria**

1. Grader agreement ≥85% with the 50-answer gold set (pass/fail), reported by kind.
2. No path raises a level without a passing review: property test over all API mutations.
3. Self-report cannot exceed L1 or unlock dependents (test).
4. Scheduler is deterministic: same state + same clock → same due date, across 100 cases.
5. Duplicate submission returns the original score exactly once; state transitions once.
6. Retention: passing a recall ≥7 days after level-up sets `retained`; failing twice lowers the level by one.
7. Daily queue semantics: due items first, cap 25, stable order, no duplicates.
8. E2E: answer → grade → level-up → due in queue → 7-day simulated recall → retained.

**Depends on:** P3, P4.

---

## P6 — Curriculum compiler

**Goal.** Any goal becomes a prerequisite-correct, time-budgeted plan.

**Tasks**

- `packages/shared/src/domain/planner.ts`: closure, filter, topological order with priority, week packing, estimates.
- Goal parser (AI, structured output) → validated target slugs; reject unknown; retry once.
- Schema + migration: `curricula`, `curriculum_items`.
- `POST /api/curricula`; plan preview; apply.
- Regeneration: immutable completed items, recompute remainder, show diff.
- Curriculum UI: timeline by week, minutes budget bar, item states, "start today".
- Tests: 20 goal fixtures (ML, analysis, geometry, logic, etc.), DAG validity, budget tolerance.

**Exit criteria**

1. 20/20 goals produce DAG-valid plans; every prerequisite appears before its dependent or is already satisfied.
2. Total planned minutes within ±10% of `weekly_minutes × horizon`.
3. No week exceeds budget ×1.1.
4. Regeneration preserves 100% of completed items and never duplicates a concept.
5. Unknown/hallucinated slugs are rejected: parser test with 5 bad outputs recovers or fails cleanly.
6. Plan generation p95 <3 s (AI parse included).
7. E2E: onboarding goal → plan → week 1 → complete item → regenerate → item preserved.

**Depends on:** P5.

---

## P7 — Innovation lab, export, polish

**Goal.** The output of learning is ideas, and the system is pleasant enough to live in.

**Tasks**

- Notes/idea sparks: `notes` schema, concept-level capture, `/lab` list, filters, search.
- Transfer hooks rendered as first-class cards with cross-domain links.
- Export: JSON, Markdown, Anki CSV; deterministic, documented schema.
- Public mastery card: `/u/$handle` (opt-in) + OG image.
- Command palette (`Cmd/Ctrl+K`): search, jump, start review.
- Accessibility pass: axe on 6 routes, keyboard-only flow, screen-reader labels for streaming and grades.
- Performance pass: route-level lazy chunks, size-limit, query plans, image/font optimization.
- PostHog events: the loop (orient, ask, prove, review), not surveillance.
- Empty/error/loading states everywhere.
- SPA polish: deep-link fallback, scroll restoration, prefetch on hover.

**Exit criteria**

1. Export → import round-trip preserves all notes and levels (JSON), verified by test.
2. axe: zero critical issues on landing, atlas, concept, today, progress, curriculum.
3. Keyboard-only: complete the full loop without a mouse.
4. Lighthouse: performance ≥90, accessibility 100, best practices ≥95 on concept and dashboard.
5. Command palette opens <100 ms and searches concepts and actions.
6. Public card is opt-in, correct, and hides notes and answers.
7. Streaming and grading announcements work with a screen reader (manual check recorded).

**Depends on:** P6.

---

## P8 — Launch hardening

**Goal.** Prove it survives contact with reality.

**Tasks**

- Load test: 200 concurrent users, p95 budgets held; DB connection pooling verified.
- Backup restore drill: Neon PITR → staging → smoke passes.
- Security review: authz matrix, rate limits, headers, dependency audit, secret scan.
- Monitoring: dashboards, alerts, on-call runbook.
- Cost review: AI spend per cohort, quotas tuned.
- Content QA: spot-check 50 enriched concepts; fix systemic issues.
- Launch checklist and rollback plan.

**Exit criteria**

1. Load test meets all p95 budgets at 200 concurrent users.
2. Restore drill completes with zero data loss and a green smoke suite.
3. Security checklist signed: no critical/high findings; all medium findings triaged.
4. Alerts fire in a staged incident; runbook resolves it.
5. AI cost within budget at projected usage.
6. Rollback to the previous deployment is demonstrated.

**Depends on:** P7.

---

## Phase package (every phase)

| Artifact | Requirement |
|---|---|
| Plan | Proposed before execution; files/modules, approach, acceptance criteria; approved by the user |
| Implementation | Typed, linted, tested, accessible, no dead code |
| Tests | Unit + integration + E2E for the slice; all green |
| Exit report | Evidence per criterion, numbers, links, next-phase proposal |
| Docs | `docs/TODO.md` updated; design docs corrected if reality diverged |

**Rule:** no phase begins before the previous one is approved and closed. If reality diverges, change the route, not the endpoint.
