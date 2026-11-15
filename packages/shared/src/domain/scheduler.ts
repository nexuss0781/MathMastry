import { createEmptyCard, fsrs, Rating, State, type Card, type Grade } from "ts-fsrs";

export type ReviewRating = "again" | "hard" | "good" | "easy";

export interface SchedulerState {
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  lastReviewAt: string | null;
  nextReviewAt: string | null;
  fsrsState: number;
}

export interface ScheduledReview extends SchedulerState {
  intervalDays: number;
}

const scheduler = fsrs({ enable_fuzz: false, enable_short_term: true });

const RATING: Record<ReviewRating, Rating> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

export function emptySchedule(): SchedulerState {
  return {
    stability: 0,
    difficulty: 0,
    reps: 0,
    lapses: 0,
    lastReviewAt: null,
    nextReviewAt: null,
    fsrsState: State.New,
  };
}

export function scheduleReview(
  state: SchedulerState,
  rating: ReviewRating,
  now: Date,
): ScheduledReview {
  const base: Card =
    state.reps === 0
      ? createEmptyCard(now)
      : {
          due: state.nextReviewAt ? new Date(state.nextReviewAt) : now,
          stability: state.stability,
          difficulty: state.difficulty,
          scheduled_days: 0,
          learning_steps: 0,
          reps: state.reps,
          lapses: state.lapses,
          state: state.fsrsState as State,
          last_review: state.lastReviewAt ? new Date(state.lastReviewAt) : undefined,
        };

  const next = scheduler.next(base, now, RATING[rating] as Grade).card;
  const intervalDays = Math.max(
    0,
    Math.round((next.due.getTime() - now.getTime()) / 86_400_000),
  );

  return {
    stability: next.stability,
    difficulty: next.difficulty,
    reps: next.reps,
    lapses: next.lapses,
    lastReviewAt: now.toISOString(),
    nextReviewAt: next.due.toISOString(),
    fsrsState: next.state,
    intervalDays,
  };
}

/** Map a rubric result to a review rating without letting a pass hide a weak answer. */
export function ratingForScore(total: number, max: number): ReviewRating {
  const ratio = max === 0 ? 0 : total / max;
  if (ratio < 0.6) return "again";
  if (ratio < 0.75) return "hard";
  if (ratio < 0.9) return "good";
  return "easy";
}
