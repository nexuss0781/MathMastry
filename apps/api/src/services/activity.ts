import { and, eq, gte, sql } from "drizzle-orm";
import { buildHeatmap, localDay, updateStreak, type StreakState } from "@mm/shared";
import { db } from "../db/index.js";
import { dailyActivity, userStreaks } from "../db/schema.js";

export const XP = {
  explainPass: 30,
  applyPass: 40,
  connectPass: 20,
  recallPass: 15,
  attempt: 5,
  levelUp: 20,
  curriculumItem: 15,
  note: 2,
} as const;

export interface ActivityInput {
  xp?: number;
  minutes?: number;
  reviewCount?: number;
  conceptsAdvanced?: number;
  at?: Date;
}

export interface ActivityResult {
  day: string;
  streak: StreakState & { continued: boolean; graceUsed: boolean; reset: boolean };
}

export async function recordActivity(
  userId: string,
  timezone: string,
  input: ActivityInput,
): Promise<ActivityResult> {
  const at = input.at ?? new Date();
  const day = localDay(at, timezone);
  const xp = Math.max(0, input.xp ?? 0);
  const minutes = Math.max(0, input.minutes ?? 0);
  const reviewCount = Math.max(0, input.reviewCount ?? 0);
  const conceptsAdvanced = Math.max(0, input.conceptsAdvanced ?? 0);

  return db.transaction(async (tx) => {
    await tx
      .insert(dailyActivity)
      .values({ userId, day, xp, minutes, reviewCount, conceptsAdvanced })
      .onConflictDoUpdate({
        target: [dailyActivity.userId, dailyActivity.day],
        set: {
          xp: sql`${dailyActivity.xp} + ${xp}`,
          minutes: sql`${dailyActivity.minutes} + ${minutes}`,
          reviewCount: sql`${dailyActivity.reviewCount} + ${reviewCount}`,
          conceptsAdvanced: sql`${dailyActivity.conceptsAdvanced} + ${conceptsAdvanced}`,
        },
      });

    await tx.insert(userStreaks).values({ userId }).onConflictDoNothing();
    const rows = await tx.select().from(userStreaks).where(eq(userStreaks.userId, userId)).limit(1);
    const row = rows[0];
    const previous: StreakState = {
      current: row?.current ?? 0,
      longest: row?.longest ?? 0,
      lastEvidenceDay: row?.lastEvidenceDay ?? null,
      graceUsedWeek: row?.graceUsedWeek ?? null,
    };
    const next = updateStreak(previous, day);
    await tx
      .update(userStreaks)
      .set({
        current: next.current,
        longest: next.longest,
        lastEvidenceDay: next.lastEvidenceDay,
        graceUsedWeek: next.graceUsedWeek,
        updatedAt: at,
      })
      .where(eq(userStreaks.userId, userId));

    return { day, streak: next };
  });
}

export async function getActivity(userId: string, timezone: string, weeks = 53) {
  const endDay = localDay(new Date(), timezone);
  const start = new Date(Date.now() - weeks * 7 * 86_400_000).toISOString().slice(0, 10);
  const rows = await db
    .select()
    .from(dailyActivity)
    .where(and(eq(dailyActivity.userId, userId), gte(dailyActivity.day, start)));
  const cells = buildHeatmap(
    rows.map((row) => ({ day: row.day, xp: row.xp })),
    endDay,
    weeks,
  );
  return {
    cells,
    totalXp: rows.reduce((sum, row) => sum + row.xp, 0),
    activeDays: rows.filter((row) => row.xp > 0).length,
    minutes: rows.reduce((sum, row) => sum + row.minutes, 0),
    reviews: rows.reduce((sum, row) => sum + row.reviewCount, 0),
    endDay,
  };
}
