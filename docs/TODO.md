# MathMastery — TODO

**Legend:** `[ ]` pending · `[~]` in progress · `[x]` done · `[!]` blocked
**Current phase:** none active — **P1 awaits approval**

---

## Epics

| Epic | Phases | Status |
|---|---|---|
| E1 Foundation: app, auth, CI, design tokens | P1 | pending |
| E2 Content: parse, enrich, embed, edges, coverage | P2 | pending |
| E3 Atlas: domain pages, concept pages, search, map | P2 | pending |
| E4 Progress: state, activity, streak, heatmap | P3 | pending |
| E5 Tutor: context, streaming, tools, citations, quotas | P4 | pending |
| E6 Mastery: rubrics, grading, FSRS, retention | P5 | pending |
| E7 Curriculum: goal parse, planner, timeline | P6 | pending |
| E8 Innovation: notes, sparks, export, public card | P7 | pending |
| E9 Hardening: load, restore, security, launch | P8 | pending |

---

## P1 — Scaffold `[ ]`

- [ ] Initialize Next.js (App Router, `src/`, TypeScript strict, Tailwind v4)
- [ ] TypeScript strict flags + path aliases
- [ ] ESLint + Prettier + import order; warnings fail CI
- [ ] shadcn/ui init; commit used primitives
- [ ] Design tokens + fonts (paper/ink/vermilion; Fraunces/Geist/Geist Mono)
- [ ] Git init, `.gitignore`, first commit
- [ ] Drizzle + Neon connection; `drizzle.config.ts`
- [ ] Better Auth: email OTP + GitHub OAuth; auth route
- [ ] `profiles` table + migration; auto-create on first sign-in
- [ ] App shell: landing placeholder, sign-in, authenticated layout, user menu
- [ ] `GET /api/health` (app, db, ai configured)
- [ ] `src/lib/env.ts` Zod validation, fail fast
- [ ] Vitest + first unit test
- [ ] Playwright + first smoke test
- [ ] GitHub Actions CI (lint, typecheck, unit, build, smoke)
- [ ] `.env.example` + README linking docs
- [ ] **Exit report + approval gate**

---

## P2 — Content pipeline + Atlas `[ ]`

- [ ] Parser: glossary → `content/concepts.seed.json` (429/12 assertion)
- [ ] Parser golden tests: duplicates, missing refs, related links
- [ ] Schema + migration: `domains`, `concepts`, `concept_sources`, `concept_edges`
- [ ] Idempotent ingest CLI
- [ ] Enrichment CLI: JSON schema, batching, cache, resume, dry-run
- [ ] Review path: CLI approve + `/admin/content`
- [ ] Embeddings + HNSW index + backfill
- [ ] Edge builder: related, prerequisites, embeddings; SCC cycle removal; degree caps
- [ ] Hybrid search (FTS + trigram + vector, RRF)
- [ ] `/atlas`, `/atlas/[domain]`, `/concept/[slug]`
- [ ] Map: SVG + d3-force, clustering, filters
- [ ] Concept card sections + sources + relations
- [ ] Coverage dashboard (pages/enriched/reviewed/embedded)
- [ ] Metadata + sitemap
- [ ] **Exit report + approval gate**

---

## P3 — Progress, streaks, dashboard `[ ]`

- [ ] Schema + migration: `user_concept_state`, `daily_activity`, `user_streaks`
- [ ] `startConcept` + lazy state
- [ ] Claimed level (max L1, hollow, no unlock)
- [ ] Activity writer + XP
- [ ] `domain/streak.ts` + grace day
- [ ] `domain/heatmap.ts` + zero fill
- [ ] Nightly recompute job + drift repair
- [ ] `GET /api/progress/summary`
- [ ] Dashboard + `/progress`
- [ ] `ActivityHeatmap`, `DomainMasteryTable`, `StreakStrip`
- [ ] Settings: timezone, weekly minutes, goal
- [ ] Empty states
- [ ] **Exit report + approval gate**

---

## P4 — AI tutor `[ ]`

- [ ] Schema + migration: `ai_threads`, `ai_messages`, `ai_usage`
- [ ] Provider routing + embeddings + timeouts
- [ ] Context assembly (card, neighbors, state, sources, history, summary)
- [ ] `POST /api/ai/chat` streaming + abort + partial persistence
- [ ] Tools: search, get concept, neighbors, user state, create note, propose review
- [ ] Modes: Socratic, Explain, Quiz, Deep dive
- [ ] Assessment lock
- [ ] Citation validation + logging
- [ ] Quotas + kill switch
- [ ] Tutor panel UI
- [ ] 30-question eval + 10 injection cases
- [ ] **Exit report + approval gate**

---

## P5 — Assessment, mastery, scheduling `[ ]`

- [ ] `domain/mastery.ts` transitions + property tests
- [ ] Rubric prompts + structured output (explain/apply/connect/recall)
- [ ] `submitAssessment` with idempotency + serialized state
- [ ] FSRS wrapper + deterministic tests
- [ ] Daily queue (due ≤25 + curriculum + exploration)
- [ ] Assessment drawer (Markdown + LaTeX preview)
- [ ] 7-day retention flow; lapse handling
- [ ] Dispute + admin override
- [ ] 50-answer gold set + agreement report
- [ ] **Exit report + approval gate**

---

## P6 — Curriculum compiler `[ ]`

- [ ] `domain/planner.ts` (closure, filter, topo order, packing)
- [ ] Goal parser + slug validation + retry
- [ ] Schema + migration: `curricula`, `curriculum_items`
- [ ] `generateCurriculum` + preview + apply
- [ ] Regeneration with immutable completed items + diff
- [ ] Curriculum timeline UI
- [ ] 20 goal fixtures + invariants
- [ ] **Exit report + approval gate**

---

## P7 — Innovation lab + polish `[ ]`

- [ ] Notes/sparks schema + concept capture + `/lab`
- [ ] Transfer hooks as first-class cards
- [ ] Export: JSON, Markdown, Anki
- [ ] Public mastery card + OG image (opt-in)
- [ ] Command palette
- [ ] Accessibility pass (6 routes, keyboard, screen reader)
- [ ] Performance pass (Lighthouse budgets)
- [ ] PostHog loop events
- [ ] Empty/error/loading states
- [ ] **Exit report + approval gate**

---

## P8 — Launch hardening `[ ]`

- [ ] Load test 200 concurrent, p95 held
- [ ] Backup restore drill
- [ ] Security review + dependency audit + secret scan
- [ ] Monitoring dashboards + alerts + runbook
- [ ] AI cost review + quota tuning
- [ ] Content spot-check (50 concepts)
- [ ] Launch checklist + rollback plan
- [ ] **Exit report + approval gate**

---

## External dependencies awaiting

| Dependency | Needed by | Status | Fallback |
|---|---|---|---|
| Neon Postgres connection string | P1 | not provided | local Postgres 16 + pgvector |
| GitHub OAuth app (client id/secret) | P1 | not provided | email OTP only |
| Resend API key (email OTP) | P1 | not provided | GitHub OAuth only |
| AI provider key + model choice | P2/P4 | not provided | fixture server; seed-only cards |
| Production domain | P8 | not provided | Vercel preview URL |
| Analytics keys (PostHog, Sentry) | P7/P8 | not provided | console logging |

**Rule:** a missing external dependency never blocks a phase. The fallback ships; the blocker is recorded here until cleared.

---

## Open decisions (recorded, not blocking)

| Decision | Default | Revisit |
|---|---|---|
| Email provider | Resend | P1 |
| Chat model family | configured by env; cheap/fast default | P4 |
| Grader model family | reasoning-class, temperature 0.2 | P5 |
| Public profiles default | off (opt-in) | P7 |
| XP weights | review 10, level-up 25, item 15, note 5 | P3 |
| Free AI quota | 40 messages / 15 assessments per day | P4 |
| Heatmap intensity | fixed XP buckets (0/1–49/50–149/150–299/300+) | P3 |

---

## Deferred beyond v1

- Payments and subscription tiers
- Native mobile apps
- Live cohorts and human tutoring
- Social feed, comments, leaderboards
- Actual GitHub contribution sync
- Formal proof checking
- Localization
- Collaborative notes
