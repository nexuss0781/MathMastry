import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import {
  applyAssessment,
  emptySchedule,
  ratingForScore,
  scheduleReview,
  type MasteryState,
  type ReviewScore,
} from "@mm/shared";
import { db } from "../db/index.js";
import {
  concepts,
  curricula,
  curriculumItems,
  dailyActivity,
  reviews,
  userConceptState,
} from "../db/schema.js";
import { assessmentPrompt } from "../ai/prompts.js";
import type { ConceptContext } from "../ai/types.js";
import {
  conceptContext,
  getContent,
  getUserStates,
  listDomainProgress,
  getStreak,
  type ContentConcept,
  type ConceptStateRow,
} from "./content.js";
import { recordActivity, XP } from "./activity.js";

export type ReviewKind = "explain" | "apply" | "connect" | "recall";

const BASE_XP: Record<ReviewKind, number> = {
  explain: XP.explainPass,
  apply: XP.applyPass,
  connect: XP.connectPass,
  recall: XP.recallPass,
};

function toMastery(row: ConceptStateRow): MasteryState {
  return {
    level: row.level as MasteryState["level"],
    claimedLevel: row.claimedLevel as MasteryState["level"],
    retention: row.retention,
    confidence: row.confidence,
    leveledUpAt: row.leveledUpAt?.toISOString() ?? null,
    lastReviewAt: row.lastReviewAt?.toISOString() ?? null,
    lapses: row.lapses,
  };
}

function contextFor(
  content: Awaited<ReturnType<typeof getContent>>,
  concept: ContentConcept,
): ConceptContext {
  const domain = content.domainById.get(concept.domainId);
  return {
    slug: concept.slug,
    term: concept.term,
    oneLiner: concept.oneLiner,
    mechanism: concept.mechanism,
    assumptions: concept.assumptions,
    failureModes: concept.failureModes,
    transferHooks: concept.transferHooks,
    examples: concept.examples,
    domain: domain?.name ?? "",
    enrichmentStatus: concept.enrichmentStatus,
    sources: (content.sources.get(concept.id) ?? []).map((source) => ({
      title: source.title,
      url: source.url,
    })),
    prerequisites: (content.prerequisites.get(concept.slug) ?? []).map((entry) => ({
      slug: entry.slug,
      term: entry.term,
    })),
    related: (content.related.get(concept.slug) ?? []).map((entry) => ({
      slug: entry.slug,
      term: entry.term,
    })),
  };
}

export { contextFor };

export interface CommitReviewInput {
  userId: string;
  timezone: string;
  conceptId: string;
  conceptSlug: string;
  kind: ReviewKind;
  prompt: string;
  answer: string;
  score: Omit<ReviewScore, "kind">;
  graderModel: string;
  idempotencyKey: string;
  latencyMs: number;
}

export async function commitReview(input: CommitReviewInput) {
  const existing = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.userId, input.userId), eq(reviews.idempotencyKey, input.idempotencyKey)))
    .limit(1);
  if (existing[0]) {
    return { duplicate: true as const, review: existing[0], state: null };
  }

  const now = new Date();
  const rows = await db
    .select()
    .from(userConceptState)
    .where(
      and(
        eq(userConceptState.userId, input.userId),
        eq(userConceptState.conceptId, input.conceptId),
      ),
    )
    .limit(1);

  const previous: ConceptStateRow = rows[0] ?? {
    conceptId: input.conceptId,
    level: 0,
    claimedLevel: 0,
    retention: "none",
    status: "available",
    confidence: 0,
    stability: 0,
    difficulty: 0,
    reps: 0,
    lapses: 0,
    fsrsState: 0,
    lastReviewAt: null,
    nextReviewAt: null,
    leveledUpAt: null,
  };

  const mastery = applyAssessment(toMastery(previous), {
    kind: input.kind,
    passed: input.score.pass,
    at: now,
  });

  const scheduler =
    previous.reps === 0
      ? emptySchedule()
      : {
          stability: previous.stability,
          difficulty: previous.difficulty,
          reps: previous.reps,
          lapses: previous.lapses,
          lastReviewAt: previous.lastReviewAt?.toISOString() ?? null,
          nextReviewAt: previous.nextReviewAt?.toISOString() ?? null,
          fsrsState: previous.fsrsState,
        };
  const rating =
    input.kind === "recall"
      ? input.score.pass
        ? "good"
        : "again"
      : ratingForScore(input.score.total, input.score.max);
  const scheduled = scheduleReview(scheduler, rating, now);

  const nextStatus = mastery.state.level > 0 ? "active" : previous.status;

  const savedReview = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(reviews)
      .values({
        userId: input.userId,
        conceptId: input.conceptId,
        kind: input.kind,
        prompt: input.prompt,
        answer: input.answer,
        rubric: {
          scores: input.score.scores,
          feedback: input.score.feedback,
          missing: input.score.missing,
          confidence: input.score.confidence,
        },
        score: input.score.total,
        maxScore: input.score.max,
        passed: input.score.pass,
        graderModel: input.graderModel,
        latencyMs: input.latencyMs,
        idempotencyKey: input.idempotencyKey,
      })
      .returning();

    await tx
      .insert(userConceptState)
      .values({
        userId: input.userId,
        conceptId: input.conceptId,
        level: mastery.state.level,
        claimedLevel: mastery.state.claimedLevel,
        retention: mastery.state.retention,
        status: nextStatus,
        confidence: mastery.state.confidence,
        stability: scheduled.stability,
        difficulty: scheduled.difficulty,
        reps: scheduled.reps,
        lapses: scheduled.lapses,
        fsrsState: scheduled.fsrsState,
        lastReviewAt: now,
        nextReviewAt: new Date(scheduled.nextReviewAt ?? now),
        leveledUpAt: mastery.state.leveledUpAt ? new Date(mastery.state.leveledUpAt) : null,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [userConceptState.userId, userConceptState.conceptId],
        set: {
          level: mastery.state.level,
          claimedLevel: mastery.state.claimedLevel,
          retention: mastery.state.retention,
          status: nextStatus,
          confidence: mastery.state.confidence,
          stability: scheduled.stability,
          difficulty: scheduled.difficulty,
          reps: scheduled.reps,
          lapses: scheduled.lapses,
          fsrsState: scheduled.fsrsState,
          lastReviewAt: now,
          nextReviewAt: new Date(scheduled.nextReviewAt ?? now),
          leveledUpAt: mastery.state.leveledUpAt ? new Date(mastery.state.leveledUpAt) : null,
          updatedAt: now,
        },
      });

    // Evidence at or above a planned target closes matching active plan items.
    await tx
      .update(curriculumItems)
      .set({ status: "done", completedAt: now })
      .where(
        and(
          eq(curriculumItems.conceptId, input.conceptId),
          eq(curriculumItems.status, "pending"),
          lte(curriculumItems.targetLevel, mastery.state.level),
          sql`${curriculumItems.curriculumId} in (select id from ${curricula} where user_id = ${input.userId} and status = 'active')`,
        ),
      );

    if (!inserted) throw new Error("Review insert returned no row");
    return inserted;
  });

  const xp = input.score.pass
    ? BASE_XP[input.kind] + (mastery.levelUp ? XP.levelUp : 0)
    : XP.attempt;
  const activity = await recordActivity(input.userId, input.timezone, {
    xp,
    minutes: 5,
    reviewCount: 1,
    conceptsAdvanced: mastery.levelUp ? 1 : 0,
    at: now,
  });

  return {
    duplicate: false as const,
    review: savedReview,
    state: {
      level: mastery.state.level,
      claimedLevel: mastery.state.claimedLevel,
      retention: mastery.state.retention,
      confidence: mastery.state.confidence,
      nextReviewAt: scheduled.nextReviewAt,
      intervalDays: scheduled.intervalDays,
      lapses: mastery.state.lapses,
    },
    transition: {
      levelUp: mastery.levelUp,
      levelDown: mastery.levelDown,
      retained: mastery.retained,
      reason: mastery.reason,
    },
    xp,
    streak: activity.streak,
    day: activity.day,
  };
}

export async function getDueQueue(userId: string, timezone: string) {
  const content = await getContent();
  const states = await getUserStates(userId);
  const now = new Date();

  const due = [...states.values()]
    .filter((state) => state.level > 0 && state.nextReviewAt && state.nextReviewAt <= now)
    .sort((a, b) => (a.nextReviewAt?.getTime() ?? 0) - (b.nextReviewAt?.getTime() ?? 0))
    .map((state) => {
      const concept = content.byId.get(state.conceptId);
      if (!concept) return null;
      const domain = content.domainById.get(concept.domainId);
      return {
        slug: concept.slug,
        term: concept.term,
        domain: domain?.name ?? "",
        domainSlug: domain?.slug ?? "",
        level: state.level,
        retention: state.retention,
        nextReviewAt: state.nextReviewAt?.toISOString() ?? null,
        daysOverdue: Math.max(
          0,
          Math.floor((now.getTime() - (state.nextReviewAt?.getTime() ?? now.getTime())) / 86_400_000),
        ),
        prompt: assessmentPrompt("explain", contextFor(content, concept)),
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const unlockedNew = content.concepts
    .filter((concept) => {
      const level = states.get(concept.id)?.level ?? 0;
      if (level > 0) return false;
      const prerequisites = content.prerequisites.get(concept.slug) ?? [];
      return prerequisites.every((prerequisite) => {
        const prerequisiteConcept = content.bySlug.get(prerequisite.slug);
        return prerequisiteConcept ? (states.get(prerequisiteConcept.id)?.level ?? 0) >= 1 : true;
      });
    })
    .slice(0, 12)
    .map((concept) => {
      const domain = content.domainById.get(concept.domainId);
      return {
        slug: concept.slug,
        term: concept.term,
        oneLiner: concept.oneLiner,
        domain: domain?.name ?? "",
        domainSlug: domain?.slug ?? "",
        level: 0,
        status: "available" as const,
      };
    });

  return { due, newConcepts: unlockedNew, today: timezone };
}

export async function getSummary(userId: string, timezone: string) {
  const content = await getContent();
  const states = await getUserStates(userId);
  const [streak, activityRows, domainProgress, dueRow] = await Promise.all([
    getStreak(userId),
    db
      .select()
      .from(dailyActivity)
      .where(eq(dailyActivity.userId, userId))
      .orderBy(desc(dailyActivity.day))
      .limit(30),
    listDomainProgress(userId),
    db
      .select({ value: sql<number>`count(*)::int` })
      .from(userConceptState)
      .where(
        and(
          eq(userConceptState.userId, userId),
          gte(userConceptState.level, 1),
          lte(userConceptState.nextReviewAt, new Date()),
        ),
      ),
  ]);

  const levels = [0, 0, 0, 0];
  let retained = 0;
  let confidenceSum = 0;
  for (const concept of content.concepts) {
    const state = states.get(concept.id);
    const level = state?.level ?? 0;
    levels[level] = (levels[level] ?? 0) + 1;
    if (state?.retention === "retained") retained += 1;
    confidenceSum += state?.confidence ?? 0;
  }

  return {
    totalConcepts: content.concepts.length,
    levels: { l0: levels[0] ?? 0, l1: levels[1] ?? 0, l2: levels[2] ?? 0, l3: levels[3] ?? 0 },
    retained,
    touched: (levels[1] ?? 0) + (levels[2] ?? 0) + (levels[3] ?? 0),
    due: dueRow[0]?.value ?? 0,
    streak,
    averageConfidence: Math.round(confidenceSum / Math.max(1, content.concepts.length)),
    domains: domainProgress,
    recentActivity: activityRows.map((row) => ({
      day: row.day,
      xp: row.xp,
      minutes: row.minutes,
      reviews: row.reviewCount,
      conceptsAdvanced: row.conceptsAdvanced,
    })),
  };
}

export async function listRecentReviews(userId: string, limit = 20) {
  const rows = await db
    .select({
      id: reviews.id,
      kind: reviews.kind,
      score: reviews.score,
      maxScore: reviews.maxScore,
      passed: reviews.passed,
      createdAt: reviews.createdAt,
      conceptSlug: concepts.slug,
      conceptTerm: concepts.term,
      graderModel: reviews.graderModel,
    })
    .from(reviews)
    .innerJoin(concepts, eq(concepts.id, reviews.conceptId))
    .where(eq(reviews.userId, userId))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
  return rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }));
}
