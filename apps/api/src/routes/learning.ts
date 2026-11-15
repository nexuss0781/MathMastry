import { Hono } from "hono";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import {
  assessmentSubmissionSchema,
  disputeSchema,
  localDay,
  recallSubmissionSchema,
  scoreRubric,
  type AssessmentKind,
} from "@mm/shared";
import type { AppEnv } from "../types.js";
import { db } from "../db/index.js";
import { aiUsage, reviews } from "../db/schema.js";
import { ai } from "../ai/index.js";
import { assessmentPrompt } from "../ai/prompts.js";
import { env } from "../env.js";
import { getActivity } from "../services/activity.js";
import { getContent } from "../services/content.js";
import {
  commitReview,
  contextFor,
  getDueQueue,
  getSummary,
  listRecentReviews,
} from "../services/mastery.js";
import { currentProfile, currentUser, parseBody, parseQuery } from "./helpers.js";

export const learningRoutes = new Hono<AppEnv>();

async function usageToday(userId: string, timezone: string, assessmentInc = 0) {
  const day = localDay(new Date(), timezone);
  const rows = await db
    .select()
    .from(aiUsage)
    .where(and(eq(aiUsage.userId, userId), eq(aiUsage.day, day)))
    .limit(1);
  if (assessmentInc > 0) {
    await db
      .insert(aiUsage)
      .values({ userId, day, assessments: assessmentInc })
      .onConflictDoUpdate({
        target: [aiUsage.userId, aiUsage.day],
        set: { assessments: sql`${aiUsage.assessments} + ${assessmentInc}` },
      });
  }
  return { day, row: rows[0] ?? null };
}

function serializeReview(review: typeof reviews.$inferSelect) {
  return {
    id: review.id,
    kind: review.kind,
    prompt: review.prompt,
    answer: review.answer,
    score: review.score,
    maxScore: review.maxScore,
    passed: review.passed,
    rubric: review.rubric,
    graderModel: review.graderModel,
    createdAt: review.createdAt.toISOString(),
    disputed: review.disputed,
  };
}

learningRoutes.post("/assessments", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const body = await parseBody(c, assessmentSubmissionSchema);

  const usage = await usageToday(user.id, profile.timezone);
  if ((usage.row?.assessments ?? 0) >= env.AI_DAILY_ASSESSMENTS) {
    return c.json(
      {
        error: "quota_exceeded",
        message: `Daily assessment limit reached (${env.AI_DAILY_ASSESSMENTS}). It resets at midnight in your timezone.`,
      },
      429,
    );
  }

  const content = await getContent();
  const concept = content.bySlug.get(body.conceptSlug);
  if (!concept) return c.json({ error: "not_found", message: "Concept not found." }, 404);

  const context = contextFor(content, concept);
  const prompt = assessmentPrompt(body.kind, context);
  const started = Date.now();

  let grade;
  try {
    grade = await ai.grade({
      concept: context,
      kind: body.kind as AssessmentKind,
      answer: body.answer,
      prompt,
    });
  } catch (error) {
    return c.json(
      { error: "grader_unavailable", message: error instanceof Error ? error.message : "Grader failed." },
      502,
    );
  }

  const score = scoreRubric(body.kind, grade.scores, grade.feedback, grade.missing, grade.confidence);
  const result = await commitReview({
    userId: user.id,
    timezone: profile.timezone,
    conceptId: concept.id,
    conceptSlug: concept.slug,
    kind: body.kind,
    prompt,
    answer: body.answer,
    score,
    graderModel: grade.model,
    idempotencyKey: body.idempotencyKey,
    latencyMs: Date.now() - started,
  });

  if (!result.duplicate) await usageToday(user.id, profile.timezone, 1);

  return c.json({
    duplicate: result.duplicate,
    review: serializeReview(result.review),
    score,
    state: result.state,
    transition: result.duplicate ? null : result.transition,
    xp: result.duplicate ? 0 : result.xp,
    streak: result.duplicate ? null : result.streak,
    grader: { model: grade.model, confidence: grade.confidence, mode: ai.name },
  });
});

learningRoutes.post("/recall", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const body = await parseBody(c, recallSubmissionSchema);

  const content = await getContent();
  const concept = content.bySlug.get(body.conceptSlug);
  if (!concept) return c.json({ error: "not_found", message: "Concept not found." }, 404);

  const pass = body.grade === "yes";
  const feedback =
    body.grade === "yes"
      ? "Delayed retrieval passed. If seven days have elapsed since the level-up, retention is now marked retained."
      : body.grade === "partial"
        ? "Partial retrieval is not evidence of retention. Review the definition and reschedule sooner."
        : "Retrieval failed. This schedules a shorter interval; two consecutive failures lower the level by one.";

  const result = await commitReview({
    userId: user.id,
    timezone: profile.timezone,
    conceptId: concept.id,
    conceptSlug: concept.slug,
    kind: "recall",
    prompt: `Recall ${concept.term} without looking anything up: definition, mechanism, and one example or failure mode.`,
    answer: body.grade,
    score: {
      scores: { recall: pass ? 1 : 0 },
      total: pass ? 1 : 0,
      max: 1,
      pass,
      feedback,
      missing: pass ? [] : ["Re-read the sourced definition, then retry tomorrow."],
      confidence: 1,
    },
    graderModel: "self-report-recall",
    idempotencyKey: body.idempotencyKey,
    latencyMs: 0,
  });

  return c.json({
    duplicate: result.duplicate,
    review: serializeReview(result.review),
    state: result.state,
    transition: result.duplicate ? null : result.transition,
    xp: result.duplicate ? 0 : result.xp,
    note: "Recall is a retention check, not a new level. It can lower a level after two consecutive failures.",
  });
});

learningRoutes.get("/review/queue", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const queue = await getDueQueue(user.id, profile.timezone);
  return c.json(queue);
});

learningRoutes.get("/progress/summary", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const summary = await getSummary(user.id, profile.timezone);
  return c.json(summary);
});

learningRoutes.get("/progress/heatmap", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const weeks = Math.min(53, Math.max(4, Number(c.req.query("weeks") ?? 53)));
  const activity = await getActivity(user.id, profile.timezone, weeks);
  return c.json(activity);
});

learningRoutes.get("/progress/reviews", async (c) => {
  const user = currentUser(c);
  const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") ?? 20)));
  return c.json({ reviews: await listRecentReviews(user.id, limit) });
});

learningRoutes.post("/reviews/:id/dispute", async (c) => {
  const user = currentUser(c);
  const id = c.req.param("id");
  const body = await parseBody(c, disputeSchema);
  const updated = await db
    .update(reviews)
    .set({ disputed: true, disputeReason: body.reason })
    .where(and(eq(reviews.id, id), eq(reviews.userId, user.id)))
    .returning({ id: reviews.id, disputed: reviews.disputed });
  if (!updated[0]) return c.json({ error: "not_found" }, 404);
  return c.json({
    review: updated[0],
    note: "Disputes are recorded for audit. The original score stands until a human reviewer rules on it.",
  });
});

const exportSchema = z.object({ format: z.enum(["json", "md", "anki"]).default("json") });

learningRoutes.get("/export", async (c) => {
  const user = currentUser(c);
  const { format } = parseQuery(c, exportSchema);
  const content = await getContent();
  const { getUserStates } = await import("../services/content.js");
  const states = await getUserStates(user.id);

  if (format === "json") {
    const payload = {
      exportedAt: new Date().toISOString(),
      user: { id: user.id, name: user.name },
      concepts: [...states.entries()].map(([conceptId, state]) => {
        const concept = content.byId.get(conceptId);
        return {
          slug: concept?.slug,
          term: concept?.term,
          level: state.level,
          claimedLevel: state.claimedLevel,
          retention: state.retention,
          confidence: state.confidence,
          nextReviewAt: state.nextReviewAt?.toISOString() ?? null,
          lastReviewAt: state.lastReviewAt?.toISOString() ?? null,
        };
      }),
    };
    c.header("content-disposition", 'attachment; filename="mathmastery-progress.json"');
    return c.json(payload);
  }

  if (format === "anki") {
    const lines = content.concepts
      .map((concept) => {
        const state = states.get(concept.id);
        if (!state || state.level === 0) return null;
        return `${concept.term}\t${concept.oneLiner.replace(/\t/g, " ")}\tL${state.level} ${state.retention}`;
      })
      .filter((line): line is string => line !== null);
    c.header("content-type", "text/tab-separated-values; charset=utf-8");
    c.header("content-disposition", 'attachment; filename="mathmastery-anki.tsv"');
    return c.body(lines.join("\n"));
  }

  const grouped = new Map<string, typeof content.concepts>();
  for (const concept of content.concepts) {
    const domain = content.domainById.get(concept.domainId);
    const key = domain?.name ?? "Unknown";
    const list = grouped.get(key) ?? [];
    list.push(concept);
    grouped.set(key, list);
  }
  const markdown: string[] = [
    `# MathMastery progress — ${user.name}`,
    "",
    `Exported ${new Date().toISOString()}`,
    "",
  ];
  for (const [domain, conceptList] of grouped) {
    markdown.push(`## ${domain}`, "");
    for (const concept of conceptList) {
      const state = states.get(concept.id);
      markdown.push(
        `- **${concept.term}** — ${concept.oneLiner} _(${state ? `L${state.level}, ${state.retention}` : "not started"})_`,
      );
    }
    markdown.push("");
  }
  c.header("content-type", "text/markdown; charset=utf-8");
  c.header("content-disposition", 'attachment; filename="mathmastery-progress.md"');
  return c.body(markdown.join("\n"));
});
