# MathMastery — Roadmap

**Strategy.** Ship the map first, then the loop, then the intelligence. Every milestone is usable on its own; no milestone depends on a feature that is still a mock.

---

## 1. Milestones

| Milestone | Name | User-visible outcome | Phases |
|---|---|---|---|
| **M0** | Foundation | Sign in, see the shell, CI green, database migrated | P1 |
| **M1** | The Atlas | All 429 concepts browsable, searchable, connected, with enrichment | P2 |
| **M2** | The Loop | Progress, streaks, AI tutor, evidence-based mastery, daily queue | P3–P5 |
| **M3** | The Compiler | Goal → curriculum → weekly plan; innovation lab; export | P6–P7 |
| **M4** | Public | Public mastery card, shareable progress, hardening, launch | post-v1 |

---

## 2. Phase overview

| Phase | Scope | Depends on | Exit metric (one line) |
|---|---|---|---|
| **P1** | Scaffold: Next.js, TS strict, Tailwind, shadcn, Drizzle, Neon, Better Auth, CI, tokens | — | CI green; sign-in/out works; migrations applied; health `db: ok` |
| **P2** | Content pipeline + Atlas: parser, seed, enrichment, embeddings, edges, concept/domain pages, search, map | P1 | 429/429 pages; 100% embedded; search p95 <100 ms; map 60 fps |
| **P3** | Progress: user state, manual level, activity, streaks, heatmap, dashboard | P2 | Streak tests pass in 4 timezones; heatmap 365 days exact; state auth-scoped |
| **P4** | AI tutor: streaming, context assembly, tools, citations, quotas, modes | P2 | First token p95 <2 s; 100% citations valid; injection suite blocked |
| **P5** | Assessment + FSRS: rubrics, grading, transitions, daily queue, retention | P3, P4 | ≥85% grader agreement; no level without evidence; scheduler deterministic |
| **P6** | Curriculum compiler: goal parse, planner, timeline, regeneration | P5 | 20 goals → DAG-valid plans; budget ±10%; regeneration preserves done items |
| **P7** | Innovation lab + polish: sparks, notes, export, public card, a11y, perf | P6 | Export round-trip; axe zero critical; Lighthouse ≥90 |
| **P8** | Launch hardening: load, backup restore, monitoring, docs | P7 | 99.9% simulated uptime; restore drill passes; runbook complete |

---

## 3. Milestone detail

### M0 — Foundation (P1)

- One deployable app, one database, one auth path.
- Design tokens committed; typography and color proven on a single page.
- CI runs lint, typecheck, unit tests, build on every push.
- **Demo:** sign in with GitHub, see an empty authenticated shell, sign out.

### M1 — The Atlas (P2)

- The 429-concept glossary is parsed, validated, enriched, embedded, and published.
- Domain pages, concept pages, hybrid search, and the graph are live.
- Coverage dashboard shows enrichment status per concept.
- **Demo:** open any of 429 concepts; see card, sources, and neighbors; search "forcing" and land on set theory.

### M2 — The Loop (P3–P5)

- State persists; manual levels and evidence coexist with clear visual distinction.
- Streak and 365-day heatmap are correct across timezones and DST.
- Tutor answers in context and cites the map.
- Assessments grade against rubrics; FSRS schedules reviews; the daily queue is real.
- **Demo:** study a concept, ask a question, explain it back, earn L1, see it scheduled, return in 7 days and retain it.

### M3 — The Compiler (P6–P7)

- A goal becomes a time-budgeted, prerequisite-correct curriculum.
- Completed work survives regeneration.
- Idea sparks and transfer hooks are captured and exportable.
- Public mastery card can be shared as an image/URL.
- **Demo:** "I want optimization for ML research, 5 h/week, 12 weeks" → a valid plan → week 1 starts.

---

## 4. Global definition of done

A phase is closed only when:

1. Every exit criterion in `docs/PHASES.md` is demonstrated with output, not asserted.
2. `pnpm lint && pnpm typecheck && pnpm test && pnpm build` passes.
3. Playwright covers the new happy path; the previous paths still pass.
4. Accessibility: axe zero critical on touched routes; keyboard flow verified.
5. Performance budgets in `docs/DESIGN.md` §10 are met on seeded data.
6. `docs/TODO.md` is updated; migrations are committed; docs match reality.
7. Exit report written: what shipped, evidence, criteria met, next phase proposed.

---

## 5. Sequencing rules

- **P2 before P3.** Progress needs concepts; no fake content.
- **P3 before P5.** Mastery needs a state machine; no grading into a void.
- **P4 before P5.** Assessment prompts are AI-generated; the tutor infrastructure comes first.
- **P5 before P6.** The planner needs real mastery state; no planning over guesses.
- **P7 last.** Polish is not a phase-zero activity; it lands on a working loop.

No phase starts before its dependency closes. No phase closes without approval.

---

## 6. Out of scope for v1

- Payments, plans, trials.
- Native mobile apps.
- Live classes, cohorts, human tutoring.
- Social feed, comments, leaderboards.
- Actual GitHub OAuth contribution sync (the graph is GitHub-*style*).
- Formal proof verification.
- Non-English content.
- Collaborative notes.

These are recorded deferrals, not forgotten features.

---

## 7. Indicative pace

| Phase | Focus | Indicative effort |
|---|---|---|
| P1 | Scaffold | 1 week |
| P2 | Atlas + content | 2–3 weeks |
| P3 | Progress | 1–2 weeks |
| P4 | Tutor | 2 weeks |
| P5 | Assessment | 2–3 weeks |
| P6 | Curriculum | 1–2 weeks |
| P7 | Lab + polish | 2 weeks |
| P8 | Launch hardening | 1 week |

Effort assumes one focused builder and the stack in `docs/DESIGN.md`. The sequence is fixed; the pace is not.
