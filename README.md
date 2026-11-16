# MathMastery

A mastery operating system for 429 mathematical concepts across 12 domains. The map is the curriculum.

## Overview

MathMastery is an evidence-first mathematics learning platform. Instead of passive consumption, you prove mastery through graded assessments (explain, apply, connect) and retain knowledge with spaced recall (FSRS). The atlas of 429 concepts forms a prerequisite graph — the planner walks backwards from your goal to sequence prerequisites against your weekly budget.

**Key principles:**
- **Evidence, not self-report** — Levels move only when a graded response passes a published rubric
- **Retention is separate** — FSRS schedules delayed recall; pass after 7 days = retained
- **Grounded tutoring** — The tutor receives the definition, assumptions, failure modes, graph neighbours, and sources
- **Your data, your format** — One-click JSON, Markdown, and Anki exports

## Architecture

```
mathmastery/
├── apps/
│   ├── web/          # Vite + React 19 SPA (TanStack Router/Query)
│   └── api/          # Hono on Node.js (Better Auth, Drizzle ORM)
├── packages/
│   └── shared/       # Domain logic, types, contracts (26/26 tests passing)
└── content/          # 429 concepts, 12 domains, 93 sources, 148 edges
```

**Stack:**
- **Frontend:** React 19, TanStack Router 1, TanStack Query 5, Tailwind CSS 4
- **Backend:** Hono 4, Better Auth 1.7, Drizzle ORM, PostgreSQL 16
- **Shared:** Zod 4, ts-fsrs, TypeScript 7
- **Dev:** pnpm 9, Vite 8, tsx, Vitest, Playwright

## Quick Start

### Prerequisites
- Node.js 24.18.0 (via nvm)
- pnpm 9.15.4
- PostgreSQL 16 (local cluster at `~/.local/share/mathmastery/pgdata` on port 55432)

### Setup

```bash
# Clone and install
git clone https://github.com/nexuss0781/MathMastry.git
cd MathMastry
pnpm install

# Start PostgreSQL (durable local cluster)
./scripts/pg.sh start

# Run migrations
pnpm db:migrate

# Parse and ingest content (one-time)
pnpm content:parse
pnpm content:ingest

# Create demo user
pnpm seed:dev

# Start development servers
pnpm dev
```

### Access
- **Web:** http://localhost:5173 (proxies `/api/*` to API)
- **API:** http://localhost:8787
- **Demo credentials:** `demo@mathmastery.local` / `mastery-demo-2026`

## Core Concepts

### The Atlas (429 concepts, 12 domains)
Every concept has:
- Sourced definition with mechanism, assumptions, failure modes, transfer hooks
- Prerequisite edges (weighted) and related edges
- Enrichment status: seed → draft → reviewed
- FSRS card state (stability, difficulty, reps, lapses)

### Mastery Ladder (L0–L3)
| Level | Name | Evidence |
|-------|------|----------|
| L0 | Unseen | No evidence |
| L1 | Explain | 8-point rubric: accuracy, mechanism, clarity, example |
| L2 | Apply | 7-point rubric: setup, steps, licensing, domain check, result |
| L3 | Connect | 6-point rubric: concept named, link stated, consequence checkable, precision |

**Self-report is capped at L1 and never unlocks prerequisites.**

### Retention (FSRS)
- Delayed recall scheduled after 7+ days
- Pass = retained; 2 consecutive failures = level down
- 1 grace day/week protects streak without faking evidence

### Planner
- State a goal: "measure theory and integration"
- Matcher finds atlas concepts (conservative, token-based)
- Walks prerequisites backwards (L2 goals need L1 prereqs, L3 needs L2)
- Budgets against weekly minutes (30–3000) and horizon (1–104 weeks)

### Tutor
- Modes: Socratic, Explain, Quiz, Deep Dive
- Grounded in concept definition, assumptions, failure modes, neighbours, sources
- Fixture mode (deterministic heuristic, confidence 0.5) when no API key
- Streams via SSE

## API Endpoints

### Auth
- `POST /api/auth/sign-up/email` — Email/password registration
- `POST /api/auth/sign-in/email` — Email/password login
- `POST /api/auth/email-otp/send-verification-otp` — Request OTP
- `POST /api/auth/sign-in/email-otp` — Verify OTP
- `GET /api/auth/session` — Current session

### Concepts
- `GET /api/domains` — Domain progress
- `GET /api/concepts` — List concepts (filterable)
- `GET /api/concepts/:slug` — Full concept detail with prompts
- `POST /api/concepts/:slug/claim` — Self-report (capped L1)
- `GET /api/search?q=` — Search concepts
- `GET /api/graph` — Prerequisite graph

### Assessments
- `POST /api/assessments` — Submit explain/apply/connect
- `POST /api/recall` — Delayed recall (yes/partial/no)
- `GET /api/review/queue` — Due recalls + new concepts
- `GET /api/progress/summary` — Mastery distribution, streak, activity
- `GET /api/progress/heatmap` — GitHub-style activity grid

### Curriculum
- `POST /api/curricula` — Create from goal
- `GET /api/curricula` — List curricula
- `GET /api/curricula/:id` — Full plan with weeks
- `PATCH /api/curricula/:id` — Update status
- `PATCH /api/curricula/:id/items/:itemId` — Mark item done/skipped

### Tutor
- `POST /api/tutor/threads` — Start thread
- `GET /api/tutor/threads` — List threads
- `POST /api/tutor/threads/:id/messages` — Send message
- `POST /api/tutor/threads/:id/messages/stream` — SSE stream
- `POST /api/tutor/deep-dive` — Generate deep dive

### Progress & Export
- `GET /api/progress/summary` — Mastery stats
- `GET /api/progress/heatmap` — Activity grid
- `GET /api/progress/reviews` — Recent reviews
- `GET /api/export?format=json|md|anki` — Export data

### Meta
- `GET /api/health` — Health check
- `GET /api/config` — App config
- `GET /api/public/atlas` — Public atlas summary
- `GET /api/me` — Current user + profile
- `PATCH /api/profile` — Update profile
- `GET /api/usage` — AI quota

## Development

### Database
```bash
# Start/stop/status
./scripts/pg.sh start|stop|restart|status

# Direct psql access
psql -h 127.0.0.1 -p 55432 -U postgres -d mathmastery
```

### Content Pipeline
```bash
pnpm content:parse    # Parse markdown glossary → concepts.seed.json
pnpm content:ingest   # Ingest to Postgres (concepts, domains, edges, sources)
pnpm content:enrich   # AI enrichment (definitions, embeddings)
pnpm content:approve  # Approve AI edges
```

### Testing
```bash
pnpm test              # All tests (shared + API)
pnpm --filter @mm/shared test   # Shared domain tests (26/26)
pnpm --filter @mm/api test      # API tests
pnpm test:e2e          # Playwright E2E
```

### Code Quality
```bash
pnpm typecheck         # TypeScript strict mode
pnpm lint              # ESLint + Prettier
pnpm format            # Prettier write
```

## Configuration

### Environment Variables (`.env`)
```bash
# Database
DATABASE_URL=postgresql://postgres@127.0.0.1:55432/mathmastery

# Auth
BETTER_AUTH_SECRET=your-32-char-secret
BETTER_AUTH_URL=http://localhost:8787
WEB_ORIGIN=http://localhost:5173
SITE_URL=http://localhost:8787
AUTH_PASSWORD_ENABLED=true

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# AI
AI_PROVIDER=fixture|openai
OPENAI_API_KEY=
AI_CHAT_MODEL=gpt-4.1-mini
AI_GRADER_MODEL=gpt-4.1-mini
AI_ENABLED=true
AI_DAILY_MESSAGES=40
AI_DAILY_ASSESSMENTS=15

# Runtime
NODE_ENV=development
PORT=8787
```

### Fixture Mode
Default `AI_PROVIDER=fixture` uses deterministic heuristic grader (confidence 0.5). No API key needed. All responses disclose fixture mode.

## Deployment

### Wasmer Edge (live)

**Live app:** https://mathmastery.wasmer.app

The whole stack (SPA + Hono API + managed Postgres) runs as one Wasmer Edge app in `fr-roub1`:

```bash
wasmer deploy --owner nexuss0781 --app-name mathmastery --build-remote
```

- `app.yaml` declares the Node build, managed Postgres capability, and runtime env.
- Secrets: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `CRON_SECRET`. Wasmer also injects
  `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USERNAME` / `DB_PASSWORD`; the API composes a
  TLS `DATABASE_URL` from those when the explicit secret is absent.
- `pnpm build` bundles every API dependency into `apps/api/dist/index.js`, then copies the
  SPA build and `content/concepts.seed.json` beside it. The Edge runtime therefore needs no
  `node_modules`.
- On first boot the API creates its schema and, when the atlas is missing or incomplete,
  ingests all 429 concepts idempotently. The same operation is available as
  `POST /api/admin/bootstrap` with header `x-cron-secret: $CRON_SECRET`.
- Health check: `GET /api/health`.

### Local Production Build
```bash
pnpm build
pnpm start
```

### Other hosts
- Set environment variables (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `SITE_URL`, ...).
- Attach PostgreSQL and run `pnpm db:migrate` (or let the API bootstrap a fresh database).
- Health check: `/api/health`.

## Project Structure

```
mathmastery/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/     # UI primitives, brand, level, heatmap, markdown, search
│   │   │   ├── pages/          # landing, auth, dashboard, atlas, concept, curriculum, review, progress, tutor, settings
│   │   │   ├── lib/            # api, auth, queries, types, utils, theme, domains
│   │   │   ├── router.tsx      # TanStack Router definition
│   │   │   └── main.tsx        # Entry point
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── api/
│       ├── src/
│       │   ├── routes/         # meta, content, learning, curriculum, tutor
│       │   ├── services/       # content, mastery, plan, tutor, activity
│       │   ├── middleware/     # session, auth
│       │   ├── db/             # schema, migrations
│       │   ├── ai/             # fixture, openai
│       │   └── index.ts        # Hono app + SPA shell
│       ├── scripts/            # content pipeline, seed
│       └── package.json
├── packages/
│   └── shared/
│       └── src/
│           ├── domain/         # mastery, rubric, scheduler, streak, heatmap, planner, edges, embedding, slug
│           ├── types.ts        # Core types (Level, Retention, Concept, etc.)
│           ├── contracts.ts    # Zod schemas + inferred types
│           └── time.ts         # Timezone helpers
├── content/
│   ├── concepts.seed.json      # 429 concepts + domains + sources
│   └── concepts.seed.md        # Source markdown
├── docs/
│   ├── PROJECT.md              # Vision, requirements, acceptance criteria
│   ├── DESIGN.md               # Architecture, stack, data models
│   ├── ROADMAP.md              # Phases P1–P8 with milestones
│   ├── PHASES.md               # Phase breakdown
│   └── TODO.md                 # Task checklist
├── scripts/
│   └── pg.sh                   # Durable Postgres cluster manager
├── .github/workflows/ci.yml
├── .eslintrc.json
├── .prettierrc
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
└── README.md
```

## Known Issues

- **Fixture mode grading** — Deterministic heuristic, not model-based. Disclosed in UI.
- **No pgvector** — Embeddings stored as `real[]`, cosine computed in-app (brute force).
- **No email provider** — Password + OTP sign-up needs `RESEND_API_KEY` in production; GitHub OAuth is hidden until its client credentials are configured.

## License

MIT License — see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run `pnpm typecheck && pnpm lint && pnpm test`
5. Submit a pull request

## Acknowledgments

- **Fraunces** (display font) — Undercase Type
- **Geist** (UI font) — Vercel
- **TanStack** — Router, Query
- **Hono** — Web framework
- **Better Auth** — Authentication
- **Drizzle ORM** — Database toolkit
- **ts-fsrs** — Spaced repetition scheduler