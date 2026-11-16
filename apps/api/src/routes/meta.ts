import { Hono } from "hono";
import { z } from "zod";
import { timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { profileUpdateSchema } from "@mm/shared";
import type { AppEnv } from "../types.js";
import { db } from "../db/index.js";
import { profiles, user as userTable } from "../db/schema.js";
import { env, googleEnabled } from "../env.js";
import { aiMode } from "../ai/index.js";
import { currentProfile, currentUser, parseBody } from "./helpers.js";
import { getContent } from "../services/content.js";
import { ensureDatabase } from "../services/bootstrap.js";

export const metaRoutes = new Hono<AppEnv>();

function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

metaRoutes.get("/health", async (c) => {
  const started = Date.now();
  let database = "ok";
  try {
    await db.execute("select 1");
  } catch {
    database = "down";
  }
  return c.json({
    status: database === "ok" ? "ok" : "degraded",
    database,
    ai: aiMode,
    version: process.env.npm_package_version ?? "0.1.0",
    latencyMs: Date.now() - started,
    time: new Date().toISOString(),
  });
});

/**
 * Operational endpoint for first boot or disaster recovery on a managed
 * database. Guarded by CRON_SECRET; idempotent by design.
 */
metaRoutes.post("/admin/bootstrap", async (c) => {
  const provided = c.req.header("x-cron-secret") ?? "";
  if (!secretMatches(provided, env.CRON_SECRET)) {
    return c.json({ error: "unauthorized" }, 401);
  }
  const result = await ensureDatabase();
  return c.json(result);
});

metaRoutes.get("/config", (c) =>
  c.json({
    appName: "MathMastery",
    googleEnabled,
    aiMode,
    aiEnabled: env.AI_ENABLED,
    dailyMessages: env.AI_DAILY_MESSAGES,
    dailyAssessments: env.AI_DAILY_ASSESSMENTS,
    totalConcepts: 429,
    domains: 12,
  }),
);

/**
 * Public atlas summary for the landing page. No learner data, no auth: just
 * what the atlas contains, so the marketing copy can be checked against the
 * database instead of being maintained by hand.
 */
metaRoutes.get("/public/atlas", async (c) => {
  const content = await getContent();
  const populated = content.domains.filter((domain) => !domain.gap);
  const sources = new Set<string>();
  for (const concept of content.concepts) {
    for (const source of content.sources.get(concept.id) ?? []) sources.add(source.url);
  }
  return c.json({
    totalConcepts: content.concepts.length,
    totalDomains: populated.length,
    totalSources: sources.size,
    totalEdges: [...content.prerequisites.values()].reduce((sum, list) => sum + list.length, 0),
    domains: populated.map((domain) => {
      const concepts = content.concepts.filter((concept) => concept.domainId === domain.id);
      const sample = concepts
        .slice()
        .sort((a, b) => a.term.localeCompare(b.term))
        .slice(0, 4)
        .map((concept) => ({ slug: concept.slug, term: concept.term }));
      const domainSources = new Set<string>();
      for (const concept of concepts) {
        for (const source of content.sources.get(concept.id) ?? []) domainSources.add(source.url);
      }
      return {
        slug: domain.slug,
        name: domain.name,
        description: domain.description,
        count: concepts.length,
        sources: domainSources.size,
        sample,
      };
    }),
  });
});

metaRoutes.get("/me", (c) => {
  const user = c.get("user");
  const profile = c.get("profile");
  if (!user || !profile) return c.json({ user: null, profile: null });
  return c.json({
    user,
    profile: {
      displayName: profile.displayName,
      timezone: profile.timezone,
      goal: profile.goal,
      weeklyMinutes: profile.weeklyMinutes,
      role: profile.role,
      onboardedAt: profile.onboardedAt?.toISOString() ?? null,
    },
    capabilities: { google: googleEnabled, aiMode },
  });
});

metaRoutes.patch("/profile", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const body = await parseBody(c, profileUpdateSchema);

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (body.displayName !== undefined) updates.displayName = body.displayName;
  if (body.timezone !== undefined) updates.timezone = body.timezone;
  if (body.weeklyMinutes !== undefined) updates.weeklyMinutes = body.weeklyMinutes;
  if (body.goal !== undefined) updates.goal = body.goal;
  if (body.displayName !== undefined || body.timezone !== undefined) {
    updates.onboardedAt = profile.onboardedAt ?? new Date();
  }

  const [updated] = await db.update(profiles).set(updates).where(eq(profiles.userId, user.id)).returning();
  if (body.displayName) {
    await db
      .update(userTable)
      .set({ name: body.displayName, updatedAt: new Date() })
      .where(eq(userTable.id, currentUser(c).id));
  }

  return c.json({
    profile: updated
      ? {
          displayName: updated.displayName,
          timezone: updated.timezone,
          goal: updated.goal,
          weeklyMinutes: updated.weeklyMinutes,
          role: updated.role,
          onboardedAt: updated.onboardedAt?.toISOString() ?? null,
        }
      : null,
  });
});

metaRoutes.get("/usage", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: profile.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const { aiUsage } = await import("../db/schema.js");
  const { and } = await import("drizzle-orm");
  const rows = await db
    .select()
    .from(aiUsage)
    .where(and(eq(aiUsage.userId, user.id), eq(aiUsage.day, day)))
    .limit(1);
  const row = rows[0];
  return c.json({
    day,
    messages: row?.messages ?? 0,
    messageLimit: env.AI_DAILY_MESSAGES,
    assessments: row?.assessments ?? 0,
    assessmentLimit: env.AI_DAILY_ASSESSMENTS,
    tokensIn: row?.tokensIn ?? 0,
    tokensOut: row?.tokensOut ?? 0,
  });
});

metaRoutes.get("/schema", (c) => c.json({ ok: true }));
