# MathMastery — System Design

**Status:** approved design, pre-implementation
**Source of truth:** this document + `docs/Project.md`. Code follows the docs, not the other way around.

---

## 1. Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                            BROWSER                                         │
│  Vite SPA · React 19 · TanStack Router/Query · lazy routes                  │
│  lazy views: atlas map, assessment editor, tutor stream                     │
└───────────────┬────────────────────────────────────────────────────────────┘
                │ same-origin fetch / SSE
┌───────────────▼────────────────────────────────────────────────────────────┐
│                     HONO API (Node 22) — also serves the SPA               │
│  auth guard · zod validation · rate limit · use-cases · authorization       │
│  static assets · SPA fallback · meta injection for public routes            │
│                                                                            │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Mastery      │  │ Scheduler     │  │ Planner      │  │ Streak        │  │
│  │ state machine│  │ (FSRS)        │  │ (graph)      │  │ calculator    │  │
│  └──────────────┘  └───────────────┘  └──────────────┘  └───────────────┘  │
│                          pure TypeScript domain layer                      │
└───────┬──────────────────────┬───────────────────────┬─────────────────────┘
        │                      │                       │
┌───────▼────────┐   ┌─────────▼──────────┐   ┌────────▼─────────────────────┐
│ Postgres (Neon)│   │ AI gateway         │   │ Job runner (in-process +     │
│ Drizzle        │   │ AI SDK             │   │ advisory lock): retries,     │
│ pgvector       │   │ chat/grade/embed   │   │ streak recompute, rollups    │
└────────────────┘   └────────────────────┘   └──────────────────────────────┘
        ▲
        │ offline, reproducible
┌───────┴────────────────────────────────────────────────────────────────────┐
│ CONTENT PIPELINE (CLI)                                                     │
│ glossary.md → parse → seed.json → enrich (batch) → embed → propose edges   │
│ → cycle check → human review → publish                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

**Boundary rule.** The runtime never performs bulk content generation. Ingestion and enrichment are offline CLI steps producing versioned artifacts; the server only reads published content and streams small, per-user generations.

---

## 2. Stack

| Layer | Choice | Version policy |
|---|---|---|
| UI | React 19 + Vite (SPA) | pinned |
| Language | TypeScript, `strict: true`, `noUncheckedIndexedAccess` | pinned |
| Routing / server state | TanStack Router + TanStack Query | pinned |
| API | Hono 4 on Node 22 | pinned |
| Monorepo | pnpm workspaces: `apps/web`, `apps/api`, `packages/shared` | — |
| Styling | Tailwind CSS v4 + shadcn/ui + Radix primitives | pinned minor |
| Database | Postgres 16 + pgvector (Neon) | managed |
| ORM | Drizzle ORM + drizzle-kit migrations | pinned |
| Auth | Better Auth (Hono adapter): email OTP + GitHub OAuth | pinned |
| AI | AI SDK, provider-agnostic; env (`AI_CHAT_MODEL`, `AI_GRADER_MODEL`, `AI_EMBED_MODEL`) | config, not code |
| Scheduling | `ts-fsrs` wrapped in a domain module | pinned |
| Validation | Zod at every boundary | pinned |
| Math | KaTeX (pre-rendered where possible) | pinned |
| Search | Postgres FTS + trigram + pgvector, reciprocal-rank fusion | native |
| Tests | Vitest, Playwright, axe | pinned |
| CI/CD | GitHub Actions → Fly.io (or Railway); Neon branches for staging | — |
| Email | Resend | — |
| Analytics | PostHog (product events), Sentry (errors) | — |
| Logging | pino, structured JSON | — |

**Rejected:** Next.js (SSR/RSC overhead and slower dev/build for an authenticated app), a graph database (429 nodes is small), Redux (no need), Prisma (Drizzle's SQL transparency wins here), a separate vector store (pgvector is enough), microservices (one deployable).

### 2.1 Why not Next.js

- The product is authenticated and interactive. SSR buys almost nothing; every route is user-specific except the public atlas.
- Vite gives sub-100 ms HMR and route-level code splitting without a framework runtime or a server component model.
- Hono is a small, Web-standard server. It serves `/api/*` and the built SPA on **one origin**, so cookies, CORS, and streaming stay simple.
- AI streaming is SSE, not RSC streaming; no framework feature is lost.
- SEO for the 429 public concept pages is handled by injecting title/description/OG/JSON-LD into the shell, plus a generated sitemap and a `<noscript>` summary. No SSR required.
- **Trade-off accepted:** bots that do not execute JavaScript see metadata and a summary, not the rendered body. Google renders the SPA; social cards use the injected OG tags.

---

## 3. Layers and responsibilities

| Layer | Owns | Must not |
|---|---|---|
| **Presentation** | Vite SPA routes, client state, design tokens, accessibility | contain business rules |
| **Application** | Hono routes and middleware, auth guard, zod parsing, rate limits, use-cases, transaction boundaries | render |
| **Domain** | mastery transitions, FSRS, planner, streak, rubric aggregation | touch the DB or network |
| **Data** | Drizzle schemas, repositories, SQL, migrations | make authorization decisions |
| **Integrations** | AI provider, email, OAuth | receive raw user input unvalidated |
| **Ops** | scheduler, ingestion CLI, observability | mutate published content silently |

The domain layer is pure and deterministic. Every algorithm below is unit-tested with an injected clock.

---

## 4. Data model

Auth tables managed by Better Auth: `user`, `session`, `account`, `verification`.

### 4.1 Core content

| Table | Columns (essential) | Keys / indexes |
|---|---|---|
| `domains` | `id`, `slug` unique, `name`, `msc_codes text[]`, `description`, `sort_order`, `concept_count` | unique `slug` |
| `concepts` | `id`, `slug` unique, `domain_id`, `term`, `one_liner`, `mechanism`, `assumptions`, `failure_modes`, `transfer_hooks jsonb`, `examples jsonb`, `source_refs jsonb`, `msc_codes text[]`, `enrichment_status enum(seed,draft,reviewed)`, `content_version`, `embedding vector(1536)`, `search_vector tsvector generated`, timestamps | `domain_id`; GIN `search_vector`; HNSW `embedding` (cosine); unique `(domain_id, term)` |
| `concept_sources` | `id`, `concept_id`, `ref_no`, `title`, `url`, `kind` | `(concept_id, ref_no)` unique |
| `concept_edges` | `id`, `from_id`, `to_id`, `kind enum(prerequisite,related,transfer)`, `weight numeric(3,2)`, `origin enum(glossary,ai,human)`, `approved bool` | unique `(from_id,to_id,kind)`; indexes both directions; CHECK `from_id <> to_id` |

**Graph invariants.**

- Prerequisite subgraph is a DAG. Ingest runs SCC detection and removes the lowest-weight edge in each cycle; the removal is logged.
- Degree caps: ≤8 prerequisites, ≤12 related per concept. Excess is truncated by weight, not silently kept.
- `approved = false` edges are excluded from planning and unlocked-state math.

### 4.2 User state

| Table | Columns | Keys / indexes |
|---|---|---|
| `profiles` | `user_id` pk, `display_name`, `timezone` (IANA), `goal`, `weekly_minutes`, `role enum(user,admin)`, `onboarded_at`, timestamps | pk `user_id` |
| `user_concept_state` | `user_id`, `concept_id`, `level smallint 0–3`, `claimed_level smallint 0–3`, `retention enum(none,fresh,retained)`, `status enum(locked,available,active)`, `confidence smallint`, `stability real`, `difficulty real`, `reps int`, `lapses int`, `last_review_at`, `next_review_at`, `updated_at` | pk `(user_id,concept_id)`; index `(user_id,next_review_at)`; index `(user_id,level)` |
| `reviews` | `id`, `user_id`, `concept_id`, `kind enum(explain,apply,connect,recall)`, `prompt`, `answer`, `rubric jsonb`, `score int`, `max_score int`, `passed bool`, `grader_model`, `latency_ms`, `idempotency_key` unique, `created_at` | `(user_id,created_at desc)`; `(user_id,concept_id,created_at desc)` |
| `daily_activity` | `user_id`, `day date`, `minutes int`, `review_count int`, `concepts_advanced int`, `xp int` | pk `(user_id,day)`; index `(user_id,day desc)` |
| `user_streaks` | `user_id` pk, `current int`, `longest int`, `last_evidence_day date`, `grace_used_week date`, `updated_at` | pk `user_id` — derived cache, recomputable |

### 4.3 Learning plans

| Table | Columns | Keys / indexes |
|---|---|---|
| `curricula` | `id`, `user_id`, `title`, `goal`, `target_level smallint`, `weekly_minutes`, `start_date`, `target_date`, `status enum(draft,active,paused,done)`, `plan_version int`, timestamps | `(user_id,status)` |
| `curriculum_items` | `id`, `curriculum_id`, `concept_id`, `target_level`, `week int`, `position int`, `estimated_minutes`, `status enum(pending,done,skipped)`, `completed_at` | `(curriculum_id,week,position)`; unique `(curriculum_id,concept_id)` |

### 4.4 AI and notes

| Table | Columns | Keys / indexes |
|---|---|---|
| `ai_threads` | `id`, `user_id`, `concept_id`, `mode enum(socratic,explain,quiz,deep_dive)`, `title`, `summary`, timestamps | `(user_id,concept_id,created_at desc)` |
| `ai_messages` | `id`, `thread_id`, `role enum(user,assistant,tool)`, `content`, `citations jsonb`, `model`, `tokens_in`, `tokens_out`, `status enum(complete,partial,failed)`, `created_at` | `(thread_id,created_at)` |
| `ai_usage` | `user_id`, `day date`, `messages int`, `assessments int`, `tokens_in int`, `tokens_out int`, `cost_cents int` | pk `(user_id,day)` |
| `notes` | `id`, `user_id`, `concept_id`, `kind enum(note,idea,question)`, `body`, `created_at`, `updated_at` | `(user_id,concept_id,created_at desc)`; FTS index |

### 4.5 Operations

| Table | Columns | Keys / indexes |
|---|---|---|
| `jobs` | `id`, `kind`, `payload jsonb`, `status enum(queued,running,done,failed)`, `attempts`, `run_after`, `locked_at`, `error`, timestamps | `(status,run_after)` |
| `content_versions` | `id`, `artifact`, `version`, `checksum`, `created_at` | unique `(artifact,version)` |

**Rules.**

- No soft deletes for user data; deletion is a hard cascade and satisfies export/delete.
- `user_concept_state` is created lazily on first touch, never pre-seeded for 429 concepts.
- All timestamps are `timestamptz`; calendar days are computed, never stored in UTC-naive form.

---

## 5. Content pipeline

**Input:** `math_topics_glossary_index.md` — 429 anchors, 12 domains, 1 declared gap.

### 5.1 Parse

- Split on `###` headings → domains.
- Extract anchors `<a id="term-{n}-{slug}">`, bold term, definition, `[ref]` citations, `Related:` links.
- Normalize slugs; reject duplicates; assert counts.
- **Exit gate:** exactly 429 concepts, 12 domains, every concept has term + definition + ≥1 source ref. A mismatch fails CI.

**Artifact:** `content/concepts.seed.json` — deterministic ordering, stable IDs (`dom_*`, `cpt_*`), checksum recorded.

### 5.2 Enrich

For each concept, generate a draft with a strict JSON schema:

```json
{
  "mechanism": "3-5 sentences, plain language, no new claims beyond standard references",
  "assumptions": ["..."],
  "failure_modes": ["..."],
  "transfer_hooks": ["This is structurally like X in field Y because ..."],
  "examples": ["one concrete example"],
  "prerequisites": [{"slug": "concept-slug", "confidence": 0.0}],
  "related": [{"slug": "concept-slug", "confidence": 0.0}]
}
```

- Batch, cached by `content_hash`, idempotent, resumable.
- Model returns unknown slugs → rejected, not invented.
- Output is a **draft**; `enrichment_status = draft` until reviewed.
- Review can be CLI or `/admin/content`; approval flips to `reviewed` and bumps `content_version`.
- Re-enrichment never overwrites `reviewed` content without a new version.

### 5.3 Embed and index

- Embed `term + one_liner + mechanism` (1536 dimensions).
- HNSW index, cosine distance.
- Generated `search_vector` from term, one-liner, mechanism; GIN index.

### 5.4 Edge proposal

1. Glossary `Related:` links → `related`, origin `glossary`.
2. AI prerequisites → `prerequisite`, confidence as weight.
3. Embedding neighbors (≥0.82 cosine) → `related` candidates.
4. Cycle check + degree caps.
5. Auto-approve: glossary links, AI prereqs with weight ≥0.8, embedding links ≥0.88. Everything else waits for review.

### 5.5 Coverage metrics

`coverage = { pages: 429/429, enriched: n/429, reviewed: n/429, embedded: n/429, edges: n }` exposed on `/admin/content` and in CI output.

---

## 6. Mastery engine

### 6.1 State

```
level:      0 | 1 | 2 | 3          earned depth
claimed:    0 | 1                  self-reported, hollow badge, never > 1
retention:  none | fresh | retained
status:     locked | available | active
confidence: 0..100                 decays with time since review
```

### 6.2 Transitions

| Event | Effect |
|---|---|
| Concept first opened | `status: available → active`; creates state row; level stays 0 |
| Pass `explain` (L1 rubric) | `level = max(level,1)`, `retention = fresh`, confidence 100, schedule FSRS |
| Pass `apply` (L2 rubric) and level ≥1 | `level = max(level,2)`, `retention = fresh` |
| Pass `connect` (transfer rubric) | recorded as evidence; does **not** raise level by itself; strengthens L2 confidence |
| Pass delayed `recall` ≥7 days after level-up | `retention = retained` |
| Fail `recall` | `lapses += 1`, confidence −25, reschedule; two consecutive fails at the current level → `level -= 1`, `retention = none` |
| Self-report | `claimed_level = min(1, …)`; UI renders hollow; cannot unlock dependents |
| No evidence for 30 days | confidence decays; UI shows `rusty`; level is not silently erased |

**Unlock rule.** A concept becomes `available` when every approved prerequisite has `level ≥ 1` (or has no prerequisites). Everything is readable at any time; only the *guided path* respects locks. The Atlas never hides knowledge.

### 6.3 Rubrics

| Kind | Dimensions (points) | Pass |
|---|---|---|
| **Explain** | accuracy 0–2, mechanism 0–2, clarity 0–2, example 0–2 | total ≥6/8 and accuracy ≥1 |
| **Apply** | correctness 0–3, method 0–2, edge cases 0–1 | total ≥4/6 and correctness ≥2 |
| **Connect** | validity 0–2, non-triviality 0–2, testable implication 0–2 | total ≥4/6 |
| **Recall** | correct / partial / incorrect | correct or partial with repair |

Grader returns structured JSON, validated by Zod; one retry; then `pending_review` with the answer preserved. Feedback must reference what is missing, not just a score.

### 6.4 FSRS

- `ts-fsrs`, wrapped in `domain/scheduler.ts`, clock injected.
- Rating map: fail → Again, weak pass → Hard, pass → Good, strong pass → Easy.
- Persist stability, difficulty, due, reps, lapses on `user_concept_state`.
- Daily queue = due (`next_review_at <= now`) ordered by due date, capped at 25, plus one exploration card.

### 6.5 Integrity

- An assessment freezes the tutor for that concept and session; tutor returns "assessment in progress" and cannot reveal the prompt's answer.
- Answers are stored verbatim with the rubric and grader model for audit.
- Disputes enqueue a job and mark the review `disputed`; admin can override with a note.
- L3 requires a project artifact or derivation plus human or admin sign-off; AI alone cannot grant it.

---

## 7. Curriculum planner

Deterministic given `(user state, goal, weekly_minutes, horizon)`.

1. **Goal parse (AI).** Free text → `{ targets: [{slug, target_level, weight}], domains }`; cap 30 targets; every slug validated against `concepts`; unknown slugs rejected and the parse retried once.
2. **Closure.** Recursive CTE over approved prerequisite edges: add every ancestor at `target_level - 1`.
3. **Filter.** Remove concepts already at or above target.
4. **Order.** Kahn topological sort with a priority queue:
   `priority = weight × domain_weight × (1 − mastery_fraction)`; tie-break by slug for determinism.
5. **Budget.** Estimates: L0 8 min, L1 25, L2 120, L3 480, review 10. Greedy week packing; no week exceeds `weekly_minutes × 1.1`; overflow moves forward, never dropped.
6. **Persist.** `curricula` + `curriculum_items` with week, position, target level.
7. **Regenerate.** Completed items are immutable; the remainder is recomputed against current state; a diff is shown before applying.

**Invariants (tested):** DAG-valid order; every item's prerequisites appear earlier or are already satisfied; total minutes within ±10% of the horizon budget.

---

## 8. AI subsystem

### 8.1 Context assembly

Per request, in order:

1. System contract (static, cacheable).
2. Concept card: term, one-liner, mechanism, assumptions, failure modes, transfer hooks.
3. Up to 8 neighbor one-liners (prerequisites first).
4. User state for the concept: level, retention, confidence, recent scores.
5. Retrieved sources (DB rows only).
6. Last 10 messages; older turns replaced by a rolling summary.

Budget: 6k input tokens hard cap. Prompt prefix is stable for cache hits.

### 8.2 Tutor contract

- Ground every claim in the card or a cited source; cite as `[concept:slug]`.
- Never award mastery; never claim a grade.
- Socratic by default: one question at a time; reveal after an attempt.
- If a question is outside the 429-concept map, say so and route to the nearest concept.
- Mathematics in KaTeX; no HTML; no unsupported claims about the user.
- Refuse to solve an active assessment; teaching before/after is allowed.

### 8.3 Tools (server-side, auth-scoped)

| Tool | Purpose |
|---|---|
| `search_concepts(query, domain?, limit?)` | hybrid retrieval |
| `get_concept(slug)` | card + sources |
| `get_neighbors(slug, kind?)` | prerequisites / related / transfer |
| `get_user_state(slug)` | level, retention, recent evidence |
| `create_note(slug, kind, body)` | capture an idea spark |
| `propose_review(slug, kind)` | draft an assessment prompt (does not grade) |

Tool arguments validated; results size-capped; no tool can write mastery.

### 8.4 Routing and cost

| Task | Model class | Notes |
|---|---|---|
| Tutor chat | fast/cheap | streaming, 1–2 tool rounds max |
| Assessment grading | reasoning | structured output, temperature 0.2 |
| Goal parsing | reasoning | once per curriculum |
| Enrichment | batch/cheap | offline only |
| Embeddings | small | 1536d |

Target: **< $0.03 per active user-day** at MVP volumes. Controls: quotas (40 messages, 15 assessments/day), prompt caching, thread summaries, per-user and global spend alerts, `AI_ENABLED=false` kill switch.

### 8.5 Prompt-injection and output safety

- Concept content, notes, and retrieved text are **data**, fenced and labeled; they never become instructions.
- Tools are allowlisted; no shell, no network, no SQL from the model.
- No user-supplied system prompt; mode is an enum.
- Output rendered as Markdown with raw HTML disabled; KaTeX sanitized.
- Citations validated against the DB before display; invalid citations are stripped and logged.

---

## 9. API surface

| Method | Path | Purpose |
|---|---|---|
| `*` | `/api/auth/*` | Better Auth (Hono adapter) |
| `POST` | `/api/ai/chat` | SSE tutor stream; tools; quota-checked |
| `GET` | `/api/search?q=&domain=&level=` | hybrid search |
| `GET` | `/api/concepts/:slug` | card, sources, edges, user state |
| `GET` | `/api/atlas/graph?domain=` | nodes + edges for the map |
| `GET` | `/api/progress/summary` | heatmap, domain mastery, streak, due count |
| `POST` | `/api/concepts/:id/start` | create/touch state |
| `POST` | `/api/assessments` | grade + transition + activity |
| `POST` | `/api/reviews` | FSRS recall |
| `PATCH` | `/api/concepts/:id/level` | self-report, capped at 1 |
| `POST` | `/api/notes` | note / idea / question |
| `POST` | `/api/curricula` | compile plan |
| `PATCH` | `/api/profile` | timezone, goal, minutes |
| `POST` | `/api/reviews/:id/dispute` | audit path |
| `GET` | `/api/export?format=json|md|anki` | user data + notes |
| `POST` | `/api/jobs/run` | scheduler only, shared secret |
| `GET` | `/api/health` | app + DB + AI config |
| `GET` | `/sitemap.xml`, `/robots.txt` | generated from published content |
| `GET` | `/*` | SPA shell; meta injection for public routes |

All mutations are **same-origin JSON fetches**; TanStack Query owns cache invalidation. There are no server actions. Streaming is SSE via Hono's `streamSSE`; the client consumes it with `fetch` + `ReadableStream` and aborts with `AbortController`.

---

## 10. Read and write paths

### 10.1 Concept read

1. Client calls `GET /api/concepts/:slug`; TanStack Query dedupes and caches for 60 s.
2. Server fetches concept + domain + sources (one query).
3. Fetch edges + neighbor one-liners (one query).
4. Fetch user state (one query, skipped for anonymous).
5. Assemble; public content cacheable 60 s; user state never cached across users.

**Target:** p95 < 50 ms server time.

### 10.2 Assessment write — `POST /api/assessments` (single transaction)

1. `SELECT … FOR UPDATE` on user state (serialize per user+concept).
2. Insert `reviews` with idempotency key (duplicate → return existing result).
3. Grade (outside the transaction, before it; retry-safe).
4. Apply mastery transition; update FSRS fields.
5. Upsert `daily_activity` (minutes from session, xp).
6. Update `user_streaks` using the user's local day.
7. Commit; return score, feedback, new level, next due.

**Guarantee:** zero lost submissions; duplicate submits return the same result.

### 10.3 Chat write — SSE

- `POST /api/ai/chat` opens `streamSSE`; persist the user message before the call.
- Headers: `Cache-Control: no-cache`, `Connection: keep-alive`, `X-Accel-Buffering: no`; heartbeat event every 15 s.
- Stream tokens as `data:` events; persist the assistant message on finish.
- Abort → `status: partial`; content preserved.
- Usage increment after completion, never blocks the stream.

### 10.4 Dashboard read

`GET /api/progress/summary` runs three aggregate queries: last 365 days of activity, per-domain state counts, next 20 due items. Cache 30 s per user. **Target:** p95 < 150 ms.

---

## 11. Streaks and the activity graph

**Evidence day:** a day with ≥1 passed or failed assessment/recall — opening the app does not count.

- Day boundary = calendar date in `profiles.timezone`.
- Streak: same day → no change; yesterday → +1; gap → 1.
- **Grace:** one automatic rest day per ISO week. If the gap is 2 days and grace is unused that week, the streak continues and grace is consumed.
- `user_streaks` is a cache; a nightly job recomputes from `daily_activity` and repairs drift.
- Heatmap: 53 weeks × 7 days, intensity from XP buckets: 0, 1–49, 50–149, 150–299, 300+.
- XP: review 10, level-up 25, curriculum item done 15, notes/idea 5; minutes are displayed but not converted to XP.

**Test matrix:** `America/New_York`, `Europe/London`, `Asia/Kolkata`, `Pacific/Auckland`, plus both DST transitions.

---

## 12. UI system

### 12.1 Routes

| Route | Surface |
|---|---|
| `/` | landing: thesis, live atlas preview, sample concept |
| `/sign-in` | email OTP + GitHub |
| `/onboarding` | goal, weekly minutes, timezone, domain self-rating |
| `/today` | daily queue, streak, next curriculum item |
| `/atlas` | domains, list, filters |
| `/atlas/map` | graph view |
| `/atlas/$domain` | domain detail |
| `/concept/$slug` | workspace: card, evidence, tutor |
| `/curriculum` | plans |
| `/curriculum/$id` | weekly timeline |
| `/progress` | heatmap, stats, mastery table, forecast |
| `/lab` | idea sparks, transfer notes |
| `/settings` | profile, timezone, AI quota, export/delete |
| `/admin/content` | coverage, enrichment queue (role-gated) |

### 12.2 Visual language — "The Atlas"

| Token | Light | Dark |
|---|---|---|
| `--paper` | `#F7F4EC` | `#12110E` |
| `--surface` | `#FFFDF7` | `#1A1813` |
| `--ink` | `#17140F` | `#F3EDDF` |
| `--muted` | `#6E6658` | `#A49B89` |
| `--line` | `#DCD4C2` | `#332E24` |
| `--accent` | `#C6432B` | `#E46B4F` |
| `--cobalt` | `#1F4FD8` | `#7C9BFF` |
| `--success` | `#2F6B4F` | `#6FBF97` |

- **Type:** Fraunces (display), Geist (UI), Geist Mono (numbers, formulas, IDs). Scale 12/14/16/20/28/40/64.
- **Space:** 4 pt base; radii 6/10/16; 1 px rules; shadows nearly absent.
- **Texture:** faint paper grain on marketing surfaces only; none inside data views.
- **Map:** domain clusters, engraved lines, ink nodes; level shown by fill weight (hollow → solid), not color alone.
- **Motion:** 160–240 ms ease-out; map transitions 400 ms; `prefers-reduced-motion` disables all non-essential motion.
- **Anti-patterns:** gradients as decoration, glass cards, confetti, emoji-led UI, generic dashboard cards.

### 12.3 Key components

`MasteryRing`, `DepthBadge` (L0–L3 + fresh/retained), `ConceptCard`, `EdgeList`, `ActivityHeatmap`, `DomainMasteryTable`, `StreakStrip`, `TutorPanel`, `RubricScore`, `AssessmentDrawer`, `CurriculumTimeline`, `CommandK`, `CoverageBar`.

### 12.4 Accessibility

- WCAG AA contrast in both themes; focus rings never removed.
- Heatmap has a table alternative and tooltips; level is never color-only.
- Streaming tutor output uses `aria-live="polite"`; grading results announced.
- Full keyboard flow: atlas → concept → assess → next; `Cmd/Ctrl+K` search.
- Map has a list fallback with identical actions.

### 12.5 Map implementation

SVG + `d3-force` with domain clustering, 429 nodes and <2k edges, viewport culling. Target 60 fps pan/zoom on a 2020 laptop. If the graph grows past ~800 nodes, move to canvas — not before.

---

## 13. Security

| Boundary | Control |
|---|---|
| Sessions | httpOnly, secure, sameSite=lax, 30-day rolling; Better Auth CSRF |
| Authorization | repository functions require `userId`; ownership in SQL, never in the client |
| Input | Zod at every route/mutation; parameterized queries via Drizzle |
| AI | content treated as data; tool allowlist; no secrets in prompts; sanitized output; assessment lock |
| Rate limits | 60 req/min/user; login throttling; AI daily quotas; global kill switch |
| Admin | `profiles.role = 'admin'` checked server-side; separate route group |
| Headers | CSP, HSTS, `frame-ancestors 'none'`, strict referrer policy |
| Privacy | no training on user answers; export + hard delete; minimal PII |
| Secrets | server-only env; `.env.example` lists names, never values |

**Threat notes.** Prompt injection via notes/concept text is contained by data fencing and tool allowlisting. Grade manipulation is contained by server-side rubrics and stored evidence. Cost abuse is contained by quotas and spend alerts.

---

## 14. Failure modes and recovery

| Failure | Behavior | Recovery |
|---|---|---|
| AI provider 429/5xx | 2 retries with jitter, then fallback model, then static card + "tutor unavailable" | message preserved; retry button |
| Grader returns invalid JSON | one retry, then `pending_review` | answer stored; job retries; user notified |
| Stream aborted | partial message stored as `partial` | resume/regenerate |
| Duplicate assessment submit | idempotency key returns the original result | no double state transition |
| DB connection loss | request fails cleanly; no partial write (transaction) | Neon retry; error boundary |
| Streak drift | nightly recompute from `daily_activity` | `user_streaks` repaired |
| Edge cycle | ingest SCC check removes lowest-weight edge | logged; graph stays a DAG |
| Bad enrichment | content versioned; review gate | revert artifact version |
| Cost spike | quota + alert; `AI_ENABLED=false` | degrade to static content |
| Cron missed | jobs table retains queued work | next run drains; idempotent |

---

## 15. Observability

- **Logs:** structured JSON: request id, hashed user id, route, latency, status, AI model/tokens/cost.
- **Errors:** Sentry with release + route tags.
- **AI traces:** mode, model, tool calls, latency, citation validity, grader score distribution.
- **Product metrics:** DAU, evidence days, assessments/day, pass rate, disputes, retention cohort, cost/user.
- **Alerts:** error rate >1%, AI failure >5%, p95 latency budget breach, daily spend > cap, scheduler silence >15 min.

---

## 16. Deployment

| Environment | App | DB | Notes |
|---|---|---|---|
| dev | local: Vite `5173` + Hono `8787` | Neon dev branch | Vite proxies `/api` to Hono |
| staging | Fly.io or Railway app | Neon branch | migrations on deploy |
| prod | Fly.io or Railway | Neon primary | one Node service, PITR 7 days |

- Build: `pnpm build` emits `apps/web/dist` and `apps/api/dist`; a Docker image runs Hono, which serves hashed assets with immutable caching and falls back to the SPA shell.
- CI order: install → lint → typecheck → unit → integration → build → migrate (staging) → deploy → smoke.
- Migrations are forward-only; destructive changes require a two-step expand/contract.
- Scheduler: in-process interval (60 s) guarded by a Postgres advisory lock; `/api/jobs/run` remains available for manual or external triggers; `/api/health` reports the last successful run.
- Backups: Neon PITR; content artifacts are in git, so content is recoverable by design.
- No CDN framework layer: static assets are content-hashed and cached at the edge in front of the single Node service.

---

## 17. Testing strategy

| Layer | Tool | What is proven |
|---|---|---|
| Domain unit | Vitest | parser counts, state transitions, rubric aggregation, FSRS determinism, planner DAG/budget, streak across timezones/DST |
| API integration | Vitest + Hono `app.request()` + real Postgres | routes, auth scoping, SSE framing, idempotency, ownership |
| Data integration | Vitest + real Postgres | migrations, transactions, index usage on hot queries |
| E2E | Playwright | sign-in → concept → assessment → level-up → review due → curriculum → export, against the built single-origin app |
| AI evals | script + golden set | 50 graded answers: ≥85% agreement; 100% citation validity; 10 prompt-injection cases blocked |
| Accessibility | axe + manual keyboard | zero critical issues on 6 core routes |
| Performance | Lighthouse CI + SQL benchmarks + size-limit | budgets in §10; initial JS <200 KB gzip; LCP <2 s |

**Definition of done for any feature:** typed, tested, accessible, no console errors, budget met, docs updated.

---

## 18. Design decisions that absorb physical constraints

| Constraint | Absorption |
|---|---|
| 429 concepts is small | Full coverage is mandatory, not aspirational; coverage is a CI number. |
| LLM latency | Stream; static card first; tutor is additive, never blocking. |
| LLM cost | Quotas, routing, caching, batch enrichment, kill switch. |
| LLM error | Rubrics, evidence ledger, disputes, human sign-off for L3. |
| Long-running batch work | Offline CLI only; the runtime is per-request and streaming. |
| Framework overhead | Vite SPA + Hono; no SSR/RSC runtime; one Node process. |
| SEO without SSR | Shell meta injection for public routes; sitemap; JSON-LD; `<noscript>` summary. |
| SPA deep links | Hono SPA fallback + route-level code splitting; no blank 404 on refresh. |
| Human attention | Weekly minutes stored; planner never exceeds them by >10%. |
| Timezone complexity | One function computes the local day; one test matrix proves it. |
| Graph correctness | DAG check at ingest; locks computed from approved edges only. |
| Content drift | Versioned artifacts + checksums + CI count assertions. |
