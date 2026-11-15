import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ auth */

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("user_email_unique").on(table.email)],
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("session_token_unique").on(table.token),
    index("session_user_idx").on(table.userId),
  ],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("account_provider_unique").on(table.providerId, table.accountId),
    index("account_user_idx").on(table.userId),
  ],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

/* --------------------------------------------------------------- content */

export const enrichmentStatus = pgEnum("enrichment_status", ["seed", "draft", "reviewed"]);
export const edgeKind = pgEnum("edge_kind", ["prerequisite", "related", "transfer"]);
export const edgeOrigin = pgEnum("edge_origin", ["glossary", "ai", "human"]);

export interface SourceRefJson {
  refNo: number;
  title: string;
  url: string;
}

export const domains = pgTable(
  "domains",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    mscCodes: text("msc_codes").array().notNull().default(sql`'{}'::text[]`),
    sortOrder: integer("sort_order").notNull().default(0),
    gap: boolean("gap").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("domains_slug_unique").on(table.slug)],
);

export const concepts = pgTable(
  "concepts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    domainId: uuid("domain_id")
      .notNull()
      .references(() => domains.id, { onDelete: "cascade" }),
    term: text("term").notNull(),
    oneLiner: text("one_liner").notNull(),
    mechanism: text("mechanism"),
    assumptions: text("assumptions").array().notNull().default(sql`'{}'::text[]`),
    failureModes: text("failure_modes").array().notNull().default(sql`'{}'::text[]`),
    transferHooks: text("transfer_hooks").array().notNull().default(sql`'{}'::text[]`),
    examples: text("examples").array().notNull().default(sql`'{}'::text[]`),
    enrichmentStatus: enrichmentStatus("enrichment_status").notNull().default("seed"),
    contentVersion: integer("content_version").notNull().default(1),
    embedding: real("embedding").array(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("concepts_slug_unique").on(table.slug),
    index("concepts_domain_idx").on(table.domainId),
    index("concepts_enrichment_idx").on(table.enrichmentStatus),
  ],
);

export const conceptSources = pgTable(
  "concept_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conceptId: uuid("concept_id")
      .notNull()
      .references(() => concepts.id, { onDelete: "cascade" }),
    refNo: integer("ref_no").notNull(),
    title: text("title").notNull(),
    url: text("url").notNull().default(""),
  },
  (table) => [
    uniqueIndex("concept_sources_unique").on(table.conceptId, table.refNo),
    index("concept_sources_concept_idx").on(table.conceptId),
  ],
);

export const conceptEdges = pgTable(
  "concept_edges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fromId: uuid("from_id")
      .notNull()
      .references(() => concepts.id, { onDelete: "cascade" }),
    toId: uuid("to_id")
      .notNull()
      .references(() => concepts.id, { onDelete: "cascade" }),
    kind: edgeKind("kind").notNull(),
    weight: real("weight").notNull().default(1),
    origin: edgeOrigin("origin").notNull().default("glossary"),
    approved: boolean("approved").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("concept_edges_unique").on(table.fromId, table.toId, table.kind),
    index("concept_edges_from_idx").on(table.fromId),
    index("concept_edges_to_idx").on(table.toId),
  ],
);

export const contentVersions = pgTable("content_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  artifact: text("artifact").notNull(),
  version: integer("version").notNull(),
  checksum: text("checksum").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------- user state */

export const retentionKind = pgEnum("retention_kind", ["none", "fresh", "retained"]);
export const conceptStatus = pgEnum("concept_status", ["locked", "available", "active"]);
export const reviewKind = pgEnum("review_kind", ["explain", "apply", "connect", "recall"]);
export const noteKind = pgEnum("note_kind", ["note", "idea", "question"]);

export const profiles = pgTable("profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  timezone: text("timezone").notNull().default("UTC"),
  goal: text("goal"),
  weeklyMinutes: integer("weekly_minutes").notNull().default(300),
  role: text("role").notNull().default("user"),
  onboardedAt: timestamp("onboarded_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userConceptState = pgTable(
  "user_concept_state",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    conceptId: uuid("concept_id")
      .notNull()
      .references(() => concepts.id, { onDelete: "cascade" }),
    level: smallint("level").notNull().default(0),
    claimedLevel: smallint("claimed_level").notNull().default(0),
    retention: retentionKind("retention").notNull().default("none"),
    status: conceptStatus("status").notNull().default("available"),
    confidence: smallint("confidence").notNull().default(0),
    stability: real("stability").notNull().default(0),
    difficulty: real("difficulty").notNull().default(0),
    reps: integer("reps").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
    fsrsState: integer("fsrs_state").notNull().default(0),
    lastReviewAt: timestamp("last_review_at", { withTimezone: true }),
    nextReviewAt: timestamp("next_review_at", { withTimezone: true }),
    leveledUpAt: timestamp("leveled_up_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.conceptId] }),
    index("user_concept_state_due_idx").on(table.userId, table.nextReviewAt),
    index("user_concept_state_level_idx").on(table.userId, table.level),
  ],
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    conceptId: uuid("concept_id")
      .notNull()
      .references(() => concepts.id, { onDelete: "cascade" }),
    kind: reviewKind("kind").notNull(),
    prompt: text("prompt").notNull(),
    answer: text("answer").notNull(),
    rubric: jsonb("rubric").$type<Record<string, unknown>>(),
    score: integer("score").notNull().default(0),
    maxScore: integer("max_score").notNull().default(0),
    passed: boolean("passed").notNull().default(false),
    graderModel: text("grader_model").notNull().default("fixture"),
    latencyMs: integer("latency_ms").notNull().default(0),
    idempotencyKey: text("idempotency_key").notNull(),
    disputed: boolean("disputed").notNull().default(false),
    disputeReason: text("dispute_reason"),
    resolutionNote: text("resolution_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("reviews_idempotency_unique").on(table.userId, table.idempotencyKey),
    index("reviews_user_created_idx").on(table.userId, table.createdAt),
    index("reviews_user_concept_idx").on(table.userId, table.conceptId, table.createdAt),
  ],
);

export const conceptClaims = pgTable(
  "concept_claims",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    conceptId: uuid("concept_id")
      .notNull()
      .references(() => concepts.id, { onDelete: "cascade" }),
    level: smallint("level").notNull(),
    note: text("note").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("concept_claims_user_idx").on(table.userId, table.createdAt)],
);

export const dailyActivity = pgTable(
  "daily_activity",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    day: date("day", { mode: "string" }).notNull(),
    minutes: integer("minutes").notNull().default(0),
    reviewCount: integer("review_count").notNull().default(0),
    conceptsAdvanced: integer("concepts_advanced").notNull().default(0),
    xp: integer("xp").notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.day] }),
    index("daily_activity_user_day_idx").on(table.userId, table.day),
  ],
);

export const userStreaks = pgTable("user_streaks", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  current: integer("current").notNull().default(0),
  longest: integer("longest").notNull().default(0),
  lastEvidenceDay: date("last_evidence_day", { mode: "string" }),
  graceUsedWeek: text("grace_used_week"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------- curriculum */

export const curriculumStatus = pgEnum("curriculum_status", ["draft", "active", "paused", "done"]);
export const itemStatus = pgEnum("item_status", ["pending", "done", "skipped"]);

export const curricula = pgTable(
  "curricula",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    goal: text("goal").notNull(),
    targetLevel: smallint("target_level").notNull().default(1),
    weeklyMinutes: integer("weekly_minutes").notNull().default(300),
    startDate: date("start_date", { mode: "string" }).notNull(),
    targetDate: date("target_date", { mode: "string" }),
    status: curriculumStatus("status").notNull().default("draft"),
    planVersion: integer("plan_version").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("curricula_user_status_idx").on(table.userId, table.status)],
);

export const curriculumItems = pgTable(
  "curriculum_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    curriculumId: uuid("curriculum_id")
      .notNull()
      .references(() => curricula.id, { onDelete: "cascade" }),
    conceptId: uuid("concept_id")
      .notNull()
      .references(() => concepts.id, { onDelete: "cascade" }),
    targetLevel: smallint("target_level").notNull().default(1),
    week: integer("week").notNull(),
    position: integer("position").notNull(),
    estimatedMinutes: integer("estimated_minutes").notNull().default(25),
    status: itemStatus("status").notNull().default("pending"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("curriculum_items_unique").on(table.curriculumId, table.conceptId),
    index("curriculum_items_week_idx").on(table.curriculumId, table.week, table.position),
  ],
);

/* --------------------------------------------------------------------- ai */

export const aiRole = pgEnum("ai_role", ["user", "assistant", "tool"]);
export const aiMessageStatus = pgEnum("ai_message_status", ["complete", "partial", "failed"]);
export const chatMode = pgEnum("chat_mode", ["socratic", "explain", "quiz", "deep_dive"]);

export const aiThreads = pgTable(
  "ai_threads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    conceptId: uuid("concept_id").references(() => concepts.id, { onDelete: "set null" }),
    mode: chatMode("mode").notNull().default("socratic"),
    title: text("title").notNull().default("New thread"),
    summary: text("summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("ai_threads_user_idx").on(table.userId, table.createdAt)],
);

export const aiMessages = pgTable(
  "ai_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    threadId: uuid("thread_id")
      .notNull()
      .references(() => aiThreads.id, { onDelete: "cascade" }),
    role: aiRole("role").notNull(),
    content: text("content").notNull(),
    citations: jsonb("citations").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    model: text("model"),
    tokensIn: integer("tokens_in").notNull().default(0),
    tokensOut: integer("tokens_out").notNull().default(0),
    status: aiMessageStatus("status").notNull().default("complete"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("ai_messages_thread_idx").on(table.threadId, table.createdAt)],
);

export const aiUsage = pgTable(
  "ai_usage",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    day: date("day", { mode: "string" }).notNull(),
    messages: integer("messages").notNull().default(0),
    assessments: integer("assessments").notNull().default(0),
    tokensIn: integer("tokens_in").notNull().default(0),
    tokensOut: integer("tokens_out").notNull().default(0),
    costCents: integer("cost_cents").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.userId, table.day] })],
);

export const notes = pgTable(
  "notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    conceptId: uuid("concept_id")
      .notNull()
      .references(() => concepts.id, { onDelete: "cascade" }),
    kind: noteKind("kind").notNull().default("note"),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("notes_user_concept_idx").on(table.userId, table.conceptId, table.createdAt)],
);

/* ------------------------------------------------------------------- ops */

export const jobStatus = pgEnum("job_status", ["queued", "running", "done", "failed"]);

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: text("kind").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    status: jobStatus("status").notNull().default("queued"),
    attempts: integer("attempts").notNull().default(0),
    runAfter: timestamp("run_after", { withTimezone: true }).notNull().defaultNow(),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("jobs_status_run_idx").on(table.status, table.runAfter)],
);
