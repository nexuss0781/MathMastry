import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { eq } from "drizzle-orm";
import { auth } from "../auth.js";
import { db } from "../db/index.js";
import { profiles } from "../db/schema.js";
import type { AppEnv } from "../types.js";

async function loadProfile(userId: string, name: string) {
  const rows = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  const existing = rows[0];
  if (existing) return existing;
  const inserted = await db
    .insert(profiles)
    .values({ userId, displayName: name })
    .onConflictDoNothing()
    .returning();
  if (inserted[0]) return inserted[0];
  const retry = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  if (!retry[0]) throw new Error("Profile provisioning failed");
  return retry[0];
}

export const withSession = createMiddleware<AppEnv>(async (c, next) => {
  const result = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!result) {
    await next();
    return;
  }
  const profile = await loadProfile(result.user.id, result.user.name);
  c.set("user", {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    image: result.user.image ?? null,
    emailVerified: result.user.emailVerified,
  });
  c.set("profile", {
    userId: profile.userId,
    displayName: profile.displayName,
    timezone: profile.timezone,
    goal: profile.goal,
    weeklyMinutes: profile.weeklyMinutes,
    role: profile.role,
    onboardedAt: profile.onboardedAt,
  });
  await next();
});

export type SessionContext = Context<AppEnv> & {
  get: <K extends keyof AppEnv["Variables"]>(key: K) => AppEnv["Variables"][K];
};

export async function requireUser(c: Context<AppEnv>) {
  const user = c.get("user");
  if (!user) return null;
  return user;
}

export function unauthorized(c: Context<AppEnv>) {
  return c.json({ error: "unauthorized", message: "Sign in to continue." }, 401);
}
