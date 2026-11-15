import { Hono } from "hono";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { claimedLevelSchema, noteInputSchema } from "@mm/shared";
import type { AppEnv } from "../types.js";
import { db } from "../db/index.js";
import { conceptClaims, notes, userConceptState } from "../db/schema.js";
import {
  getConceptDetail,
  getContent,
  getGraph,
  getUserStates,
  listConcepts,
  listDomainProgress,
  searchConcepts,
} from "../services/content.js";
import { recordActivity, XP } from "../services/activity.js";
import { currentProfile, currentUser, parseBody, parseQuery } from "./helpers.js";
import { assessmentPrompt } from "../ai/prompts.js";

export const contentRoutes = new Hono<AppEnv>();

const listQuerySchema = z.object({
  domain: z.string().min(1).max(120).optional(),
  q: z.string().max(200).optional(),
  level: z.coerce.number().int().min(0).max(3).optional(),
  status: z.enum(["locked", "available", "active"]).optional(),
  limit: z.coerce.number().int().min(1).max(500).default(60),
  offset: z.coerce.number().int().min(0).default(0),
});

contentRoutes.get("/domains", async (c) => {
  const user = currentUser(c);
  const [domains, content] = await Promise.all([listDomainProgress(user.id), getContent()]);
  return c.json({
    domains,
    totals: {
      concepts: content.concepts.length,
      populatedDomains: content.domains.filter((domain) => !domain.gap).length,
      gapDomains: content.domains.filter((domain) => domain.gap).length,
    },
  });
});

contentRoutes.get("/concepts", async (c) => {
  const user = currentUser(c);
  const query = parseQuery(c, listQuerySchema);
  const result = await listConcepts(user.id, query);
  return c.json({ ...result, filters: query });
});

contentRoutes.get("/concepts/:slug", async (c) => {
  const user = currentUser(c);
  const slug = c.req.param("slug");
  const detail = await getConceptDetail(user.id, slug);
  if (!detail) return c.json({ error: "not_found", message: "Concept not found." }, 404);

  const context = {
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

  return c.json({
    ...detail,
    prompts: {
      explain: assessmentPrompt("explain", context),
      apply: assessmentPrompt("apply", context),
      connect: assessmentPrompt("connect", context),
    },
  });
});

contentRoutes.post("/concepts/:slug/claim", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const slug = c.req.param("slug");
  const body = await parseBody(c, claimedLevelSchema.omit({ conceptSlug: true }));
  const content = await getContent();
  const concept = content.bySlug.get(slug);
  if (!concept) return c.json({ error: "not_found" }, 404);

  const states = await getUserStates(user.id);
  const current = states.get(concept.id);

  await db.insert(conceptClaims).values({
    userId: user.id,
    conceptId: concept.id,
    level: body.level,
    note: body.note,
  });

  await db
    .insert(userConceptState)
    .values({ userId: user.id, conceptId: concept.id, claimedLevel: body.level, status: "active" })
    .onConflictDoUpdate({
      target: [userConceptState.userId, userConceptState.conceptId],
      set: {
        claimedLevel: Math.max(current?.claimedLevel ?? 0, body.level),
        updatedAt: new Date(),
      },
    });

  await recordActivity(user.id, profile.timezone, { xp: XP.note, minutes: 2 });

  return c.json({
    claimedLevel: Math.max(current?.claimedLevel ?? 0, body.level),
    level: current?.level ?? 0,
    note: "Self-report never raises mastery or unlocks prerequisites. Only graded evidence does that.",
  });
});

contentRoutes.get("/search", async (c) => {
  const user = currentUser(c);
  const q = c.req.query("q") ?? "";
  const items = await searchConcepts(user.id, q, 24);
  return c.json({ query: q, items });
});

contentRoutes.get("/graph", async (c) => {
  const user = currentUser(c);
  const graph = await getGraph(user.id);
  return c.json(graph);
});

contentRoutes.get("/notes", async (c) => {
  const user = currentUser(c);
  const rows = await db
    .select({
      id: notes.id,
      conceptId: notes.conceptId,
      kind: notes.kind,
      body: notes.body,
      createdAt: notes.createdAt,
    })
    .from(notes)
    .where(eq(notes.userId, user.id))
    .orderBy(desc(notes.createdAt))
    .limit(50);
  return c.json({ notes: rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() })) });
});

contentRoutes.post("/notes", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const body = await parseBody(c, noteInputSchema);
  const content = await getContent();
  const concept = content.bySlug.get(body.conceptSlug);
  if (!concept) return c.json({ error: "not_found", message: "Concept not found." }, 404);

  const [note] = await db
    .insert(notes)
    .values({ userId: user.id, conceptId: concept.id, kind: body.kind, body: body.body })
    .returning();
  await recordActivity(user.id, profile.timezone, { xp: XP.note, minutes: 2 });

  return c.json({ note: note ? { ...note, createdAt: note.createdAt.toISOString() } : null }, 201);
});

contentRoutes.delete("/notes/:id", async (c) => {
  const user = currentUser(c);
  const id = c.req.param("id");
  const deleted = await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, user.id)))
    .returning({ id: notes.id });
  if (!deleted[0]) return c.json({ error: "not_found" }, 404);
  return c.json({ deleted: deleted[0].id });
});
