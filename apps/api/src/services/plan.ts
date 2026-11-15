import { and, asc, desc, eq, sql } from "drizzle-orm";
import { addDays, cosine, embedText, localDay, planCurriculum, tokenize, type PlannerNode } from "@mm/shared";
import { db } from "../db/index.js";
import { curricula, curriculumItems } from "../db/schema.js";
import { getContent, getUserStates } from "./content.js";
import type { CurriculumRequest } from "@mm/shared";
import { contextFor } from "./mastery.js";

const TARGET_LEVEL = 2;

interface GoalMatch {
  slug: string;
  term: string;
  score: number;
}

/**
 * Goal matching is deliberately conservative. A hashed bag-of-words embedding
 * will happily equate "measure theory" with "model theory" because both contain
 * "theory"; that produces a curriculum about the wrong subject. Generic
 * mathematical nouns are stripped, and a concept must share a specific token
 * in its term or at least two in its definition to be eligible.
 */
const GENERIC_GOAL_TOKENS = new Set([
  "theory",
  "theories",
  "mathematical",
  "mathematic",
  "general",
  "method",
  "structure",
  "learn",
  "study",
  "understand",
  "want",
  "need",
  "basic",
  "introduction",
  "intro",
  "concept",
  "topic",
  "subject",
  "applied",
  "application",
]);

function tokenKey(token: string): string {
  return token.length >= 5 ? token.slice(0, 5) : token;
}

/**
 * Prefix keys keep morphological variants together (integration/integral,
 * measure/measurable) without collapsing unrelated words.
 */
function specificTokens(text: string): string[] {
  return tokenize(text)
    .filter((token) => token.length > 2 && !GENERIC_GOAL_TOKENS.has(token))
    .map(tokenKey);
}

async function matchGoals(goal: string, limit = 6): Promise<GoalMatch[]> {
  const content = await getContent();
  const goalVector = embedText(goal);
  const goalTokens = new Set(specificTokens(goal));
  if (goalTokens.size === 0) return [];

  const scored = content.concepts
    .map((concept) => {
      const termTokens = specificTokens(concept.term);
      const bodyTokens = specificTokens(concept.oneLiner);
      const termHits = termTokens.filter((token) => goalTokens.has(token)).length;
      const bodyHits = bodyTokens.filter((token) => goalTokens.has(token)).length;
      const coverage = termTokens.length === 0 ? 0 : termHits / termTokens.length;
      const lowerGoal = goal.toLowerCase();
      const lowerTerm = concept.term.toLowerCase();
      const exact = lowerGoal.includes(lowerTerm);
      const vector = concept.embedding ?? embedText(`${concept.term} ${concept.oneLiner}`);
      const similarity = cosine(goalVector, vector);
      const score =
        (exact ? 12 : 0) +
        coverage * 9 +
        Math.min(termHits, 3) * 2.4 +
        Math.min(bodyHits, 5) * 1.2 +
        similarity * 4;
      const eligible = exact || termHits > 0 || bodyHits >= 2;
      return { slug: concept.slug, term: concept.term, score, eligible };
    })
    .filter((entry) => entry.eligible && entry.score >= 3.2)
    .sort((a, b) => b.score - a.score || a.term.localeCompare(b.term));

  const top = scored[0];
  if (!top) return [];
  const floor = Math.max(3.2, top.score * 0.45);
  return scored
    .filter((entry) => entry.score >= floor)
    .slice(0, limit)
    .map(({ slug, term, score }) => ({
      slug,
      term,
      score: Math.round(score * 100) / 100,
    }));
}

export async function createCurriculum(
  userId: string,
  timezone: string,
  input: CurriculumRequest,
) {
  const content = await getContent();
  const states = await getUserStates(userId);
  const goals = await matchGoals(input.goal);
  if (goals.length === 0) {
    throw new Error(
      "No atlas concepts matched that goal. Try naming a mathematical subject, structure, or technique.",
    );
  }

  const goalSet = new Set(goals.map((goal) => goal.slug));
  const nodes: PlannerNode[] = content.concepts.map((concept) => ({
    slug: concept.slug,
    targetLevel: goalSet.has(concept.slug) ? TARGET_LEVEL : 0,
    weight: goalSet.has(concept.slug) ? 2 : 1,
    domainWeight: 1,
    currentLevel: (states.get(concept.id)?.level ?? 0) as PlannerNode["currentLevel"],
    prerequisites: (content.prerequisites.get(concept.slug) ?? []).map((entry) => entry.slug),
  }));

  const plan = planCurriculum(nodes, {
    weeklyMinutes: input.weeklyMinutes,
    horizonWeeks: input.horizonWeeks,
    goalSlugs: [...goalSet],
  });

  if (plan.items.length === 0) {
    throw new Error("Every matched concept is already at or above the target level.");
  }

  const startDate = localDay(new Date(), timezone);
  const title = input.goal.trim().slice(0, 90);

  const [curriculum] = await db
    .insert(curricula)
    .values({
      userId,
      title,
      goal: input.goal,
      targetLevel: TARGET_LEVEL,
      weeklyMinutes: input.weeklyMinutes,
      startDate,
      targetDate: addDays(startDate, input.horizonWeeks * 7),
      status: "active",
    })
    .returning();

  if (!curriculum) throw new Error("Could not create curriculum");

  const bySlug = new Map(content.concepts.map((concept) => [concept.slug, concept]));
  const rows = plan.items.map((item) => {
    const concept = bySlug.get(item.slug);
    if (!concept) throw new Error(`Planner produced unknown concept ${item.slug}`);
    return {
      curriculumId: curriculum.id,
      conceptId: concept.id,
      targetLevel: item.targetLevel,
      week: item.week,
      position: item.position,
      estimatedMinutes: item.estimatedMinutes,
    };
  });

  await db.insert(curriculumItems).values(rows).onConflictDoNothing();

  return {
    curriculum,
    plan: {
      totalMinutes: plan.totalMinutes,
      weeksUsed: plan.weeksUsed,
      overHorizon: plan.overHorizon,
      goalMatches: goals,
      itemCount: plan.items.length,
    },
  };
}

export async function listCurricula(userId: string) {
  const rows = await db
    .select({
      id: curricula.id,
      title: curricula.title,
      goal: curricula.goal,
      status: curricula.status,
      weeklyMinutes: curricula.weeklyMinutes,
      startDate: curricula.startDate,
      targetDate: curricula.targetDate,
      createdAt: curricula.createdAt,
      total: sql<number>`count(${curriculumItems.id})::int`,
      done: sql<number>`count(${curriculumItems.id}) filter (where ${curriculumItems.status} = 'done')::int`,
    })
    .from(curricula)
    .leftJoin(curriculumItems, eq(curriculumItems.curriculumId, curricula.id))
    .where(eq(curricula.userId, userId))
    .groupBy(curricula.id)
    .orderBy(desc(curricula.createdAt));

  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
    progress: row.total === 0 ? 0 : Math.round((row.done / row.total) * 100),
  }));
}

export async function getCurriculum(userId: string, id: string) {
  const rows = await db
    .select()
    .from(curricula)
    .where(and(eq(curricula.id, id), eq(curricula.userId, userId)))
    .limit(1);
  const curriculum = rows[0];
  if (!curriculum) return null;

  const content = await getContent();
  const states = await getUserStates(userId);
  const items = await db
    .select()
    .from(curriculumItems)
    .where(eq(curriculumItems.curriculumId, id))
    .orderBy(asc(curriculumItems.week), asc(curriculumItems.position));

  const shaped = items.map((item) => {
    const concept = content.byId.get(item.conceptId);
    const domain = concept ? content.domainById.get(concept.domainId) : undefined;
    return {
      id: item.id,
      slug: concept?.slug ?? "",
      term: concept?.term ?? "",
      oneLiner: concept?.oneLiner ?? "",
      domain: domain?.name ?? "",
      domainSlug: domain?.slug ?? "",
      targetLevel: item.targetLevel,
      currentLevel: states.get(item.conceptId)?.level ?? 0,
      week: item.week,
      position: item.position,
      estimatedMinutes: item.estimatedMinutes,
      status: item.status,
      completedAt: item.completedAt?.toISOString() ?? null,
    };
  });

  const done = shaped.filter((item) => item.status === "done").length;
  const weeks = new Map<number, typeof shaped>();
  for (const item of shaped) {
    const list = weeks.get(item.week) ?? [];
    list.push(item);
    weeks.set(item.week, list);
  }

  return {
    ...curriculum,
    createdAt: curriculum.createdAt.toISOString(),
    updatedAt: curriculum.updatedAt.toISOString(),
    progress: shaped.length === 0 ? 0 : Math.round((done / shaped.length) * 100),
    done,
    total: shaped.length,
    weeks: [...weeks.entries()].map(([week, entries]) => ({ week, items: entries })),
    goalConcepts: shaped.filter((item) => item.targetLevel >= 2).slice(0, 20),
  };
}

export async function getActiveCurriculum(userId: string) {
  const rows = await db
    .select({ id: curricula.id })
    .from(curricula)
    .where(and(eq(curricula.userId, userId), eq(curricula.status, "active")))
    .orderBy(desc(curricula.createdAt))
    .limit(1);
  if (!rows[0]) return null;
  return getCurriculum(userId, rows[0].id);
}

export async function setCurriculumStatus(
  userId: string,
  id: string,
  status: "draft" | "active" | "paused" | "done",
) {
  const updated = await db
    .update(curricula)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(curricula.id, id), eq(curricula.userId, userId)))
    .returning();
  return updated[0] ?? null;
}

export async function updateItemStatus(
  userId: string,
  curriculumId: string,
  itemId: string,
  status: "pending" | "done" | "skipped",
) {
  const owned = await db
    .select({ id: curricula.id })
    .from(curricula)
    .where(and(eq(curricula.id, curriculumId), eq(curricula.userId, userId)))
    .limit(1);
  if (!owned[0]) return null;
  const updated = await db
    .update(curriculumItems)
    .set({ status, completedAt: status === "done" ? new Date() : null })
    .where(and(eq(curriculumItems.id, itemId), eq(curriculumItems.curriculumId, curriculumId)))
    .returning();
  return updated[0] ?? null;
}

export async function nextCurriculumItems(userId: string, limit = 5) {
  const active = await getActiveCurriculum(userId);
  if (!active) return null;
  const pending = active.weeks
    .flatMap((week) => week.items)
    .filter((item) => item.status === "pending")
    .sort((a, b) => a.week - b.week || a.position - b.position)
    .slice(0, limit);
  return { curriculum: { id: active.id, title: active.title, progress: active.progress }, items: pending };
}

export async function curriculumConceptContext(userId: string, slug: string) {
  const content = await getContent();
  const concept = content.bySlug.get(slug);
  if (!concept) return null;
  return contextFor(content, concept);
}
