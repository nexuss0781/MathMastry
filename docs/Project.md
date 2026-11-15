# MathMastery — Project

**Thesis.** Mathematics is a graph, not a syllabus. Build the map, prove mastery on the map, and let AI compile the path. The product is not a course library — it is a **mastery operating system** for 429 concepts across 12 domains, built so a working engineer can cover the whole territory at orientation depth and go deep only where it compounds.

---

## 1. The problem

Three failures define every "learn all of math" attempt:

1. **Linearization.** Courses impose one order on a graph. The learner needs many entry points and many exits.
2. **Completion theater.** Watching a lecture or checking a box is not mastery. Nothing in the system can tell the difference.
3. **Breadth–depth collapse.** Trying to prove every theorem costs decades; skimming everything produces trivia. There is no mechanism that allocates depth deliberately.

MathMastery fixes all three with one primitive: **every concept has a depth level, and every level is earned by evidence.**

---

## 2. The product in one screen

```
┌──────────────────────────────────────────────────────────────────────┐
│  ATLAS            TODAY             CURRICULUM          PROGRESS     │
│  429 concepts      due reviews       goal → weekly plan   heatmap     │
│  graph + search    next concept      time-budgeted        streaks     │
├──────────────────────────────────────────────────────────────────────┤
│  CONCEPT WORKSPACE                                                   │
│  ┌───────────────┐  ┌──────────────────────┐  ┌───────────────────┐  │
│  │ Card          │  │ Evidence             │  │ AI Tutor          │  │
│  │ one-liner     │  │ explain → grade      │  │ grounded, cited   │  │
│  │ mechanism     │  │ apply → grade        │  │ Socratic default  │  │
│  │ failure modes │  │ connect → grade      │  │ quiz + deep dive  │  │
│  │ transfer hooks│  │ delayed retention    │  │ tools + memory    │  │
│  └───────────────┘  └──────────────────────┘  └───────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

Four surfaces, one loop: **Map → Ask → Prove → Schedule → Repeat.**

---

## 3. The mastery ladder

| Level | Name | Evidence required | Time estimate |
|---|---|---|---|
| **L0** | Place | Opened the card, can locate it on the map | 5 min |
| **L1** | Explain | Passed explanation rubric: accurate, mechanistic, plain-language, one example | 25 min |
| **L2** | Use | Passed application task: solve, implement, or derive with method shown | 2 h |
| **L3** | Produce | Extended result, project, or original derivation; graded + optional human review | 8 h+ |

**Rules.**

- Chat never awards mastery. Only a scored assessment does.
- Self-report caps at L1 and is labeled `claimed`.
- A level is **retained** only after a delayed retrieval (≥7 days) passes. Until then it shows as `fresh`.
- Failure does not erase work; it lowers confidence and schedules repair.
- L3 is deliberately rare. The planner allocates it to 1–2 concepts at a time.

---

## 4. Core loop

1. **Orient** — the Atlas shows 12 domains, 429 concepts, and the user's position.
2. **Ask** — the tutor answers inside the concept's context, with citations to the concept graph.
3. **Prove** — three short assessments: explain, apply, connect.
4. **Schedule** — FSRS schedules the next retrieval at the edge of forgetting.
5. **Compound** — the daily queue mixes due reviews, the next curriculum item, and one exploration card.
6. **Capture** — every concept carries transfer hooks and an idea notebook; innovation is a first-class output.

---

## 5. Features

| # | Feature | Contract |
|---|---|---|
| F1 | **Atlas** | All 429 concepts browsable by domain, graph, and hybrid search; zero dead ends. |
| F2 | **Concept workspace** | Card, sources, prerequisites, related concepts, personal notes, mastery state. |
| F3 | **AI tutor** | Grounded in the card + graph + user state; cites concept IDs; Socratic, Explain, Quiz, Deep-dive modes. |
| F4 | **Evidence engine** | Rubric-scored explanations, applications, connections; stored answers; dispute path. |
| F5 | **Daily queue** | FSRS due reviews + next curriculum item + one optional exploration. |
| F6 | **Curriculum compiler** | Goal → target concepts → prerequisite closure → weekly plan within a time budget. |
| F7 | **Progress** | GitHub-style activity graph, per-domain mastery heatmap, streaks, retention, forecast. |
| F8 | **Innovation lab** | Transfer hooks, idea sparks, cross-domain links, export to Markdown/Anki/JSON. |
| F9 | **Auth & profile** | Email OTP + GitHub OAuth, timezone-aware days, data export and deletion. |
| F10 | **Content ops** | Deterministic ingestion, AI enrichment, edge proposal, coverage dashboard, admin review. |

---

## 6. Who it is for

**Primary:** the technical builder — ML engineer, researcher, founder — who needs the *conceptual skeleton of all mathematics* to transfer mechanisms across fields, and needs depth on demand without a decade of sequential study.

**Secondary:** serious self-learners who want proof of understanding rather than video completion.

The product is designed for one user first: the builder-learner. Every feature must serve the loop above or it is out of scope.

---

## 7. What makes it different

| Existing pattern | MathMastery |
|---|---|
| Course catalog | Concept graph |
| Binary complete/incomplete | Four earned depth levels |
| Video watched = learned | Rubric-scored evidence |
| Fixed sequence | Compiled curriculum per goal |
| AI chatbot bolted on | Tutor grounded in graph + state, with tools |
| Vanity streaks | Evidence days only |
| Knowledge in, nothing out | Transfer hooks + idea lab |

---

## 8. Scope

**In scope.**

- Complete coverage of the 429 concepts in `math_topics_glossary_index.md`.
- Depth tracking L0–L3, evidence, scheduling, curricula, progress, streaks.
- AI tutor and grader with quotas and citations.
- Responsive web app, dark/light, keyboard accessible.
- Content pipeline that can ingest a revised glossary without manual rework.

**Out of scope (v1).**

- Video lectures, live cohorts, tutoring marketplace.
- Native mobile apps (responsive web only).
- Formal proof checking (Lean/Coq).
- Payments and subscriptions.
- Social feed, comments, leaderboards.
- Syncing actual GitHub contributions. The GitHub-style graph is a visualization, not an integration.

---

## 9. Decisions

| Choice | Rationale |
|---|---|
| **Next.js 15 App Router + TypeScript strict** | One codebase for SSR pages, streaming AI, and server mutations; strong typing end to end. |
| **Postgres + pgvector (Neon)** | Relational mastery state and semantic retrieval in one store; no second database to operate. |
| **Drizzle ORM** | Typed SQL without hiding it; migrations are explicit; complex aggregates stay readable. |
| **Offline content pipeline (CLI)** | 429-concept enrichment is batch work; serverless time limits are the wrong shape. Reproducible artifacts, reviewable diffs. |
| **Better Auth** | Own the user table; email OTP + GitHub OAuth; no vendor lock on identity. |
| **FSRS** | Current best open scheduling algorithm; deterministic, testable, no proprietary service. |
| **Rubric grading with structured output** | Mastery must be a number with evidence, not a vibe. |
| **AI SDK with provider env vars** | Model churn is constant; routing lives in config, not code. |
| **No graph database** | 429 nodes and <2,000 edges. Recursive SQL is sufficient and cheaper. |
| **No global state library** | Server components + URL state + local state cover the app; less machinery, fewer bugs. |
| **Tailwind + shadcn/ui + custom tokens** | Speed without a generic look; components are owned, not imported as a black box. |

---

## 10. Constraints turned into mechanisms

| Constraint | Mechanism |
|---|---|
| Content is finite (429 concepts) | A coverage contract and dashboard: 100% pages, enrichment %, mastery %. "All" becomes a number. |
| LLM cost | Per-user quotas, model routing, prompt-prefix caching, batch enrichment, hard kill switch. |
| LLM fallibility | Rubrics + evidence ledger + dispute path + no AI-only L3. Grades are auditable. |
| Serverless execution limits | Enrichment and embedding run offline; runtime only streams and scores. |
| User attention is the real limit | Weekly minutes drive the curriculum; daily queue is capped; no infinite feed. |
| Streak anxiety | Only evidence days count; rest tokens; the graph tells the truth without punishment. |
| Timezones and DST | Day boundaries computed in the user's IANA timezone; tested across DST edges. |
| Scope creep | Gated phases; one active phase; no next phase without approval. |
| Privacy | Answers are never used for training; export and delete are first-class. |

---

## 11. Success metrics

| Dimension | Target |
|---|---|
| Coverage | 429/429 concept pages; 100% with one-liner and sources; ≥90% enriched with mechanism, assumptions, failure modes, transfer hooks by M2. |
| Learning | ≥60% of started concepts reach L1; ≥25% reach L2 inside an active curriculum. |
| Retention | ≥80% pass rate on 7-day delayed retrieval for reviewed concepts. |
| Habit | ≥4 evidence days per week for active users; median session 25 min. |
| AI quality | ≥90% citation validity; ≥85% grader agreement with gold labels; <3% disputed grades. |
| Performance | Concept read p95 <50 ms; LCP <2 s; AI first token p95 <2 s. |
| Reliability | 99.9% uptime; zero lost assessment submissions. |

---

## 12. Content contract

- Source of truth: `math_topics_glossary_index.md` (429 anchors, 12 domains, 1 declared gap).
- Ingested deterministically into `content/concepts.seed.json`; CI fails if the count or domain mapping drifts.
- Enrichment adds: mechanism, assumptions, failure modes, transfer hooks, examples, prerequisite proposals.
- Every enrichment is a draft until reviewed; `enrichment_status` is visible on the page.
- The declared gap — *Interdisciplinary applications* — is shown as a gap, not invented.

---

## 13. Brand

**Name:** MathMastery
**Tagline:** *The map is the curriculum.*
**Voice:** precise, calm, unhyped. A cartographer's lab, not a casino.
**Visual:** paper and ink, one vermilion accent, engraved map lines, editorial serif display, geometric sans for UI, mono for mathematics and numbers.
**Anti-look:** no gradient soup, no glassmorphism, no gamified confetti, no stock-photo students.

---

## 14. No artificial limits

The limit is attention, not content. MathMastery does not meter ambition; it allocates attention where it compounds. Every concept is reachable, every depth is available on demand, every plan fits the hours the user actually has. The system never says "that is advanced" — it says "here is the cost, here is the order, here is the evidence."
