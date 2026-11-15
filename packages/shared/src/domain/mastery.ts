import type { AssessmentKind, Level, MasteryState } from "../types.js";

export interface AssessmentOutcome {
  kind: AssessmentKind | "recall";
  passed: boolean;
  at: Date;
}

export interface MasteryTransition {
  state: MasteryState;
  levelUp: boolean;
  levelDown: boolean;
  retained: boolean;
  reason: string;
}

const asLevel = (value: number): Level => Math.max(0, Math.min(3, value)) as Level;

const iso = (date: Date): string => date.toISOString();

export function initialMastery(): MasteryState {
  return {
    level: 0,
    claimedLevel: 0,
    retention: "none",
    confidence: 0,
    leveledUpAt: null,
    lastReviewAt: null,
    lapses: 0,
  };
}

export function applyAssessment(state: MasteryState, outcome: AssessmentOutcome): MasteryTransition {
  const now = iso(outcome.at);
  const next: MasteryState = { ...state, lastReviewAt: now };
  let levelUp = false;
  let levelDown = false;
  let retained = false;
  let reason = "";

  if (outcome.kind === "recall") {
    if (outcome.passed) {
      const days =
        state.leveledUpAt === null
          ? Number.POSITIVE_INFINITY
          : (outcome.at.getTime() - new Date(state.leveledUpAt).getTime()) / 86_400_000;
      if (state.level > 0 && days >= 7) {
        next.retention = "retained";
        retained = true;
        reason = "Delayed retrieval passed; level retained.";
      } else {
        reason = "Retrieval passed; retention check needs 7 days since level-up.";
      }
      next.confidence = 100;
      next.lapses = 0;
      return { state: next, levelUp, levelDown, retained, reason };
    }

    next.lapses = state.lapses + 1;
    next.confidence = Math.max(0, state.confidence - 25);
    if (next.lapses >= 2 && state.level > 0) {
      next.level = asLevel(state.level - 1);
      next.retention = "none";
      next.lapses = 0;
      next.leveledUpAt = now;
      levelDown = true;
      reason = "Two consecutive recall failures; level lowered one step.";
    } else {
      reason = "Recall failed; review rescheduled.";
    }
    return { state: next, levelUp, levelDown, retained, reason };
  }

  if (!outcome.passed) {
    next.confidence = Math.max(0, state.confidence - 10);
    reason = "Assessment did not pass; no level change.";
    return { state: next, levelUp, levelDown, retained, reason };
  }

  next.confidence = 100;
  next.lapses = 0;

  if (outcome.kind === "explain") {
    if (state.level < 1) {
      next.level = 1;
      next.retention = "fresh";
      next.leveledUpAt = now;
      levelUp = true;
      reason = "Explanation passed; L1 earned.";
    } else {
      reason = "Explanation passed; L1 already held.";
    }
    return { state: next, levelUp, levelDown, retained, reason };
  }

  if (outcome.kind === "apply") {
    if (state.level < 1) {
      reason = "Application passed, but L1 must be earned first.";
      return { state: next, levelUp, levelDown, retained, reason };
    }
    if (state.level < 2) {
      next.level = 2;
      next.retention = "fresh";
      next.leveledUpAt = now;
      levelUp = true;
      reason = "Application passed; L2 earned.";
    } else {
      reason = "Application passed; L2 already held.";
    }
    return { state: next, levelUp, levelDown, retained, reason };
  }

  next.confidence = Math.min(100, state.confidence + 5);
  reason = "Connection recorded; it strengthens the concept without raising the level.";
  return { state: next, levelUp, levelDown, retained, reason };
}

/** Ui-only level: self-report never exceeds L1 and never unlocks anything. */
export function displayLevel(state: MasteryState): Level {
  return asLevel(Math.max(state.level, Math.min(1, state.claimedLevel)));
}

export function decayedConfidence(state: MasteryState, now: Date, halfLifeDays = 30): number {
  if (state.lastReviewAt === null) return 0;
  const elapsed = Math.max(0, (now.getTime() - new Date(state.lastReviewAt).getTime()) / 86_400_000);
  return Math.max(0, Math.round(state.confidence * 0.5 ** (elapsed / halfLifeDays)));
}

export function isUnlocked(prerequisiteLevels: number[], minimum = 1): boolean {
  return prerequisiteLevels.every((level) => level >= minimum);
}
