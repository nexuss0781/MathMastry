import { describe, expect, it } from "vitest";
import { updateStreak } from "../domain/streak.js";
import { localDay } from "../time.js";
import type { StreakState } from "../types.js";

const empty: StreakState = {
  current: 0,
  longest: 0,
  lastEvidenceDay: null,
  graceUsedWeek: null,
};

describe("streak", () => {
  it("counts consecutive evidence days", () => {
    let state = updateStreak(empty, "2026-01-01");
    state = updateStreak(state, "2026-01-02");
    state = updateStreak(state, "2026-01-03");
    expect(state.current).toBe(3);
    expect(state.longest).toBe(3);
  });

  it("does not double-count the same day", () => {
    const once = updateStreak(empty, "2026-01-01");
    const twice = updateStreak(once, "2026-01-01");
    expect(twice.current).toBe(1);
  });

  it("uses one grace day per ISO week", () => {
    let state = updateStreak(empty, "2026-01-01");
    state = updateStreak(state, "2026-01-02");
    state = updateStreak(state, "2026-01-03");
    state = updateStreak(state, "2026-01-05");
    expect(state.current).toBe(4);
    expect(state.graceUsed).toBe(true);
    state = updateStreak(state, "2026-01-07");
    expect(state.current).toBe(1);
    expect(state.reset).toBe(true);
  });

  it("computes local days across DST", () => {
    const instant = new Date("2026-03-08T06:30:00Z");
    expect(localDay(instant, "America/New_York")).toBe("2026-03-08");
    expect(localDay(new Date("2026-01-01T04:30:00Z"), "America/New_York")).toBe("2025-12-31");
    expect(localDay(new Date("2026-01-01T20:30:00Z"), "Asia/Kolkata")).toBe("2026-01-02");
  });
});
