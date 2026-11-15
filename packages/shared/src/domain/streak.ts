import { calendarDaysBetween, isoWeekKey } from "../time.js";
import type { StreakState } from "../types.js";

export interface StreakUpdate extends StreakState {
  continued: boolean;
  graceUsed: boolean;
  reset: boolean;
}

/**
 * Evidence days only. One automatic rest day per ISO week bridges a single
 * missed day; a second missed day resets the streak.
 */
export function updateStreak(previous: StreakState, day: string): StreakUpdate {
  const base: StreakState = {
    current: previous.current,
    longest: previous.longest,
    lastEvidenceDay: previous.lastEvidenceDay,
    graceUsedWeek: previous.graceUsedWeek,
  };

  if (base.lastEvidenceDay === day) {
    return { ...base, continued: true, graceUsed: false, reset: false };
  }

  if (base.lastEvidenceDay === null) {
    return {
      ...base,
      current: 1,
      longest: Math.max(base.longest, 1),
      lastEvidenceDay: day,
      continued: false,
      graceUsed: false,
      reset: false,
    };
  }

  const gap = calendarDaysBetween(base.lastEvidenceDay, day);
  if (gap < 0) {
    return { ...base, continued: false, graceUsed: false, reset: false };
  }

  let current: number;
  let graceUsed = false;
  let reset = false;

  if (gap === 1) {
    current = base.current + 1;
  } else if (gap === 2 && base.graceUsedWeek !== isoWeekKey(day)) {
    current = base.current + 1;
    graceUsed = true;
    base.graceUsedWeek = isoWeekKey(day);
  } else {
    current = 1;
    reset = base.current > 1;
  }

  return {
    ...base,
    current,
    longest: Math.max(base.longest, current),
    lastEvidenceDay: day,
    continued: current > 1,
    graceUsed,
    reset,
  };
}
