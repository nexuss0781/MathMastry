import { and, desc, eq } from "drizzle-orm";
import { cosine, decayedConfidence, embedText, type Level } from "@mm/shared";
import { db } from "../db/index.js";
import {
  conceptEdges,
  conceptSources,
  concepts,
  domains,
  notes,
  reviews,
  userConceptState,
  userStreaks,
} from "../db/schema.js";

export interface ContentConcept {
  id: string;
  slug: string;
  term: string;
  oneLiner: string;
  mechanism: string | null;
  assumptions: string[];
  failureModes: string[];
  transferHooks: string[];
  examples: string[];
  enrichmentStatus: "seed" | "draft" | "reviewed";
  domainId: string;
  embedding: number[] | null;
}

export interface EdgeView {
  slug: string;
  term: string;
  weight: number;
}

export interface ConceptCard {
  slug: string;
  term: string;
  oneLiner: string;
  domain: string;
  domainSlug: string;
  enrichmentStatus: "seed" | "draft" | "reviewed";
  level: number;
  claimedLevel: number;
  retention: "none" | "fresh" | "retained";
  status: "locked" | "available" | "active";
  confidence: number;
  unlocked: boolean;
  missingPrerequisites: Array<{ slug: string; term: string }>;
  prerequisites: EdgeView[];
  related: EdgeView[];
  nextReviewAt: string | null;
  lastReviewAt: string | null;
  leveledUpAt: string | null;
}

export interface ConceptStateRow {
  conceptId: string;
  level: number;
  claimedLevel: number;
  retention: "none" | "fresh" | "retained";
  status: "locked" | "available" | "active";
  confidence: number;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  fsrsState: number;
  lastReviewAt: Date | null;
  nextReviewAt: Date | null;
  leveledUpAt: Date | null;
}

interface Snapshot {
  domains: Array<{ id: string; slug: string; name: string; description: string; gap: boolean; sortOrder: number }>;
  concepts: ContentConcept[];
  bySlug: Map<string, ContentConcept>;
  byId: Map<string, ContentConcept>;
  domainById: Map<string, { slug: string; name: string }>;
  domainBySlug: Map<string, { id: string; slug: string; name: string; description: string; gap: boolean; sortOrder: number }>;
  prerequisites: Map<string, EdgeView[]>;
  dependents: Map<string, EdgeView[]>;
  related: Map<string, EdgeView[]>;
  sources: Map<string, Array<{ refNo: number; title: string; url: string }>>;
  loadedAt: number;
}

const SNAPSHOT_TTL_MS = 5 * 60 * 1000;
let snapshot: Snapshot | null = null;

export function invalidateContent(): void {
  snapshot = null;
}

export async function getContent(): Promise<Snapshot> {
  if (snapshot && Date.now() - snapshot.loadedAt < SNAPSHOT_TTL_MS) return snapshot;

  const [domainRows, conceptRows, sourceRows, edgeRows] = await Promise.all([
    db.select().from(domains).orderBy(domains.sortOrder),
    db.select().from(concepts),
    db.select().from(conceptSources),
    db.select().from(conceptEdges),
  ]);

  const bySlug = new Map<string, ContentConcept>();
  const byId = new Map<string, ContentConcept>();
  for (const row of conceptRows) {
    const concept: ContentConcept = {
      id: row.id,
      slug: row.slug,
      term: row.term,
      oneLiner: row.oneLiner,
      mechanism: row.mechanism,
      assumptions: row.assumptions,
      failureModes: row.failureModes,
      transferHooks: row.transferHooks,
      examples: row.examples,
      enrichmentStatus: row.enrichmentStatus,
      domainId: row.domainId,
      embedding: row.embedding ?? null,
    };
    bySlug.set(concept.slug, concept);
    byId.set(concept.id, concept);
  }

  const domainById = new Map(domainRows.map((row) => [row.id, { slug: row.slug, name: row.name }]));
  const domainBySlug = new Map(domainRows.map((row) => [row.slug, { id: row.id, slug: row.slug, name: row.name, description: row.description, gap: row.gap, sortOrder: row.sortOrder }]));

  const sources = new Map<string, Array<{ refNo: number; title: string; url: string }>>();
  for (const row of sourceRows) {
    const list = sources.get(row.conceptId) ?? [];
    list.push({ refNo: row.refNo, title: row.title, url: row.url });
    sources.set(row.conceptId, list);
  }

  const prerequisites = new Map<string, EdgeView[]>();
  const dependents = new Map<string, EdgeView[]>();
  const related = new Map<string, EdgeView[]>();
  for (const edge of edgeRows) {
    const from = byId.get(edge.fromId);
    const to = byId.get(edge.toId);
    if (!from || !to) continue;
    if (edge.kind === "prerequisite") {
      const incoming = prerequisites.get(to.slug) ?? [];
      incoming.push({ slug: from.slug, term: from.term, weight: edge.weight });
      prerequisites.set(to.slug, incoming);
      const outgoing = dependents.get(from.slug) ?? [];
      outgoing.push({ slug: to.slug, term: to.term, weight: edge.weight });
      dependents.set(from.slug, outgoing);
    } else if (edge.kind === "related") {
      const left = related.get(from.slug) ?? [];
      left.push({ slug: to.slug, term: to.term, weight: edge.weight });
      related.set(from.slug, left);
      const right = related.get(to.slug) ?? [];
      right.push({ slug: from.slug, term: from.term, weight: edge.weight });
      related.set(to.slug, right);
    }
  }

  snapshot = {
    domains: domainRows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      gap: row.gap,
      sortOrder: row.sortOrder,
    })),
    concepts: [...bySlug.values()],
    bySlug,
    byId,
    domainById,
    domainBySlug,
    prerequisites,
    dependents,
    related,
    sources,
    loadedAt: Date.now(),
  };
  return snapshot;
}

export async function getUserStates(userId: string): Promise<Map<string, ConceptStateRow>> {
  const rows = await db.select().from(userConceptState).where(eq(userConceptState.userId, userId));
  const map = new Map<string, ConceptStateRow>();
  for (const row of rows) {
    map.set(row.conceptId, {
      conceptId: row.conceptId,
      level: row.level,
      claimedLevel: row.claimedLevel,
      retention: row.retention,
      status: row.status,
      confidence: row.confidence,
      stability: row.stability,
      difficulty: row.difficulty,
      reps: row.reps,
      lapses: row.lapses,
      fsrsState: row.fsrsState,
      lastReviewAt: row.lastReviewAt,
      nextReviewAt: row.nextReviewAt,
      leveledUpAt: row.leveledUpAt,
    });
  }
  return map;
}

function toCard(
  content: Snapshot,
  concept: ContentConcept,
  states: Map<string, ConceptStateRow>,
): ConceptCard {
  const domain = content.domainById.get(concept.domainId);
  const prerequisites = content.prerequisites.get(concept.slug) ?? [];
  const related = content.related.get(concept.slug) ?? [];
  const state = states.get(concept.id);
  const level = state?.level ?? 0;
  const missing = prerequisites.filter((prerequisite) => {
    const prerequisiteConcept = content.bySlug.get(prerequisite.slug);
    if (!prerequisiteConcept) return false;
    return (states.get(prerequisiteConcept.id)?.level ?? 0) < 1;
  });
  const unlocked = missing.length === 0;
  const status = level > 0 ? "active" : unlocked ? "available" : "locked";
  return {
    slug: concept.slug,
    term: concept.term,
    oneLiner: concept.oneLiner,
    domain: domain?.name ?? "Unknown domain",
    domainSlug: domain?.slug ?? "unknown",
    enrichmentStatus: concept.enrichmentStatus,
    level,
    claimedLevel: state?.claimedLevel ?? 0,
    retention: state?.retention ?? "none",
    status,
    confidence: state
      ? decayedConfidence(
          {
            ...state,
            level: state.level as Level,
            claimedLevel: state.claimedLevel as Level,
            lastReviewAt: state.lastReviewAt?.toISOString() ?? null,
            leveledUpAt: state.leveledUpAt?.toISOString() ?? null,
          },
          new Date(),
        )
      : 0,
    unlocked,
    missingPrerequisites: missing.map((entry) => ({ slug: entry.slug, term: entry.term })),
    prerequisites,
    related,
    nextReviewAt: state?.nextReviewAt?.toISOString() ?? null,
    lastReviewAt: state?.lastReviewAt?.toISOString() ?? null,
    leveledUpAt: state?.leveledUpAt?.toISOString() ?? null,
  };
}

export async function listDomainProgress(userId: string) {
  const content = await getContent();
  const states = await getUserStates(userId);
  return content.domains.map((domain) => {
    const domainConcepts = content.concepts.filter((concept) => concept.domainId === domain.id);
    let l1 = 0;
    let l2 = 0;
    let l3 = 0;
    let active = 0;
    for (const concept of domainConcepts) {
      const level = states.get(concept.id)?.level ?? 0;
      if (level >= 1) l1 += 1;
      if (level >= 2) l2 += 1;
      if (level >= 3) l3 += 1;
      if (level > 0) active += 1;
    }
    return {
      slug: domain.slug,
      name: domain.name,
      description: domain.description,
      gap: domain.gap,
      total: domainConcepts.length,
      l1,
      l2,
      l3,
      active,
      progress: domainConcepts.length === 0 ? 0 : Math.round((l2 / domainConcepts.length) * 100),
    };
  });
}

export interface ConceptFilters {
  domain?: string;
  q?: string;
  level?: number;
  status?: "locked" | "available" | "active";
  limit?: number;
  offset?: number;
}

export async function listConcepts(userId: string, filters: ConceptFilters) {
  const content = await getContent();
  const states = await getUserStates(userId);
  const query = filters.q?.trim().toLowerCase();

  let cards = content.concepts.map((concept) => toCard(content, concept, states));
  if (filters.domain) cards = cards.filter((card) => card.domainSlug === filters.domain);
  if (typeof filters.level === "number") cards = cards.filter((card) => card.level === filters.level);
  if (filters.status) cards = cards.filter((card) => card.status === filters.status);
  if (query) {
    cards = cards.filter(
      (card) =>
        card.term.toLowerCase().includes(query) ||
        card.slug.includes(query.replace(/\s+/g, "-")) ||
        card.oneLiner.toLowerCase().includes(query),
    );
  }

  cards.sort((a, b) => a.term.localeCompare(b.term));
  const total = cards.length;
  const offset = filters.offset ?? 0;
  const limit = Math.min(500, filters.limit ?? 60);
  return { total, offset, limit, items: cards.slice(offset, offset + limit) };
}

export async function getConceptDetail(userId: string, slug: string) {
  const content = await getContent();
  const concept = content.bySlug.get(slug);
  if (!concept) return null;
  const states = await getUserStates(userId);
  const card = toCard(content, concept, states);
  const state = states.get(concept.id) ?? null;

  const [noteRows, reviewRows] = await Promise.all([
    db
      .select()
      .from(notes)
      .where(and(eq(notes.userId, userId), eq(notes.conceptId, concept.id)))
      .orderBy(desc(notes.createdAt))
      .limit(50),
    db
      .select({
        id: reviews.id,
        kind: reviews.kind,
        score: reviews.score,
        maxScore: reviews.maxScore,
        passed: reviews.passed,
        feedback: reviews.rubric,
        graderModel: reviews.graderModel,
        createdAt: reviews.createdAt,
        disputed: reviews.disputed,
      })
      .from(reviews)
      .where(and(eq(reviews.userId, userId), eq(reviews.conceptId, concept.id)))
      .orderBy(desc(reviews.createdAt))
      .limit(10),
  ]);

  return {
    ...card,
    mechanism: concept.mechanism,
    assumptions: concept.assumptions,
    failureModes: concept.failureModes,
    transferHooks: concept.transferHooks,
    examples: concept.examples,
    sources: content.sources.get(concept.id) ?? [],
    dependents: content.dependents.get(concept.slug) ?? [],
    state: state
      ? {
          ...state,
          lastReviewAt: state.lastReviewAt?.toISOString() ?? null,
          nextReviewAt: state.nextReviewAt?.toISOString() ?? null,
          leveledUpAt: state.leveledUpAt?.toISOString() ?? null,
        }
      : null,
    notes: noteRows.map((note) => ({
      id: note.id,
      kind: note.kind,
      body: note.body,
      createdAt: note.createdAt.toISOString(),
    })),
    reviews: reviewRows.map((review) => ({
      id: review.id,
      kind: review.kind,
      score: review.score,
      maxScore: review.maxScore,
      passed: review.passed,
      feedback: (review.feedback as { feedback?: string } | null)?.feedback ?? null,
      graderModel: review.graderModel,
      createdAt: review.createdAt.toISOString(),
      disputed: review.disputed,
    })),
  };
}

export async function searchConcepts(userId: string, rawQuery: string, limit = 20) {
  const query = rawQuery.trim();
  if (query.length < 2) return [];
  const content = await getContent();
  const states = await getUserStates(userId);
  const lower = query.toLowerCase();
  const queryVector = embedText(query);

  const scored = content.concepts.map((concept) => {
    const term = concept.term.toLowerCase();
    let score = 0;
    if (term === lower) score += 100;
    if (term.startsWith(lower)) score += 55;
    if (term.includes(lower)) score += 35;
    if (concept.slug.includes(lower.replace(/\s+/g, "-"))) score += 25;
    if (concept.oneLiner.toLowerCase().includes(lower)) score += 12;
    if (concept.embedding) score += cosine(queryVector, concept.embedding) * 18;
    return { concept, score };
  });

  return scored
    .filter((entry) => entry.score > 0.5)
    .sort((a, b) => b.score - a.score || a.concept.term.localeCompare(b.concept.term))
    .slice(0, limit)
    .map((entry) => {
      const card = toCard(content, entry.concept, states);
      return {
        slug: card.slug,
        term: card.term,
        domain: card.domain,
        domainSlug: card.domainSlug,
        oneLiner: card.oneLiner,
        level: card.level,
        status: card.status,
        score: Math.round(entry.score),
      };
    });
}

export async function getGraph(userId: string) {
  const content = await getContent();
  const states = await getUserStates(userId);
  return {
    nodes: content.concepts.map((concept) => {
      const domain = content.domainById.get(concept.domainId);
      return {
        slug: concept.slug,
        term: concept.term,
        domain: domain?.slug ?? "unknown",
        domainName: domain?.name ?? "",
        level: states.get(concept.id)?.level ?? 0,
        retention: states.get(concept.id)?.retention ?? "none",
      };
    }),
    edges: content.concepts.flatMap((concept) => {
      const prerequisites = content.prerequisites.get(concept.slug) ?? [];
      return prerequisites.map((prerequisite) => ({
        source: prerequisite.slug,
        target: concept.slug,
        kind: "prerequisite" as const,
        weight: prerequisite.weight,
      }));
    }),
    domains: content.domains.map((domain) => ({ slug: domain.slug, name: domain.name, gap: domain.gap })),
  };
}

export async function getStreak(userId: string) {
  const rows = await db.select().from(userStreaks).where(eq(userStreaks.userId, userId)).limit(1);
  const row = rows[0];
  if (!row) {
    const inserted = await db.insert(userStreaks).values({ userId }).onConflictDoNothing().returning();
    const created = inserted[0];
    return {
      current: created?.current ?? 0,
      longest: created?.longest ?? 0,
      lastEvidenceDay: created?.lastEvidenceDay ?? null,
      graceUsedWeek: created?.graceUsedWeek ?? null,
    };
  }
  return {
    current: row.current,
    longest: row.longest,
    lastEvidenceDay: row.lastEvidenceDay,
    graceUsedWeek: row.graceUsedWeek,
  };
}

export function conceptContext(detail: NonNullable<Awaited<ReturnType<typeof getConceptDetail>>>) {
  return {
    slug: detail.slug,
    term: detail.term,
    oneLiner: detail.oneLiner,
    mechanism: detail.mechanism,
    assumptions: detail.assumptions,
    failureModes: detail.failureModes,
    transferHooks: detail.transferHooks,
    examples: detail.examples,
    domain: detail.domain,
    enrichmentStatus: detail.enrichmentStatus,
    sources: detail.sources.map((source) => ({ title: source.title, url: source.url })),
    prerequisites: detail.prerequisites.map((entry) => ({ slug: entry.slug, term: entry.term })),
    related: detail.related.map((entry) => ({ slug: entry.slug, term: entry.term })),
  };
}
