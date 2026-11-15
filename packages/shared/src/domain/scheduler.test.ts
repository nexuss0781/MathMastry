import { describe, expect, it } from "vitest";
import { emptySchedule, ratingForScore, scheduleReview } from "../domain/scheduler.js";

describe("scheduler", () => {
  it("creates a future due date and increments reps", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const result = scheduleReview(emptySchedule(), "good", now);
    expect(result.reps).toBe(1);
    expect(result.stability).toBeGreaterThan(0);
    expect(new Date(result.nextReviewAt ?? 0).getTime()).toBeGreaterThan(now.getTime());
  });

  it("is deterministic", () => {
    const now = new Date("2026-02-01T12:00:00Z");
    const a = scheduleReview(emptySchedule(), "easy", now);
    const b = scheduleReview(emptySchedule(), "easy", now);
    expect(a).toEqual(b);
  });

  it("maps rubric ratios to ratings", () => {
    expect(ratingForScore(2, 8)).toBe("again");
    expect(ratingForScore(5, 8)).toBe("hard");
    expect(ratingForScore(7, 8)).toBe("good");
    expect(ratingForScore(8, 8)).toBe("easy");
  });
});
