export type Level = 0 | 1 | 2 | 3;

export type Retention = "none" | "fresh" | "retained";

export type ConceptStatus = "locked" | "available" | "active";

export type AssessmentKind = "explain" | "apply" | "connect";

export type ReviewKind = AssessmentKind | "recall";

export type RecallGrade = "yes" | "partial" | "no";

export interface MasteryState {
  level: Level;
  claimedLevel: Level;
  retention: Retention;
  confidence: number;
  leveledUpAt: string | null;
  lastReviewAt: string | null;
  lapses: number;
}

export interface ConceptState extends MasteryState {
  status: ConceptStatus;
  nextReviewAt: string | null;
  stability: number;
  difficulty: number;
  reps: number;
}

export interface ConceptCard {
  slug: string;
  term: string;
  oneLiner: string;
  mechanism: string | null;
  assumptions: string[];
  failureModes: string[];
  transferHooks: string[];
  examples: string[];
  domain: string;
  domainSlug: string;
  enrichmentStatus: "seed" | "draft" | "reviewed";
  sources: Array<{ refNo: number; title: string; url: string }>;
  prerequisites: Array<{ slug: string; term: string; weight: number }>;
  related: Array<{ slug: string; term: string; weight: number }>;
}

export interface ReviewScore {
  kind: AssessmentKind;
  scores: Record<string, number>;
  total: number;
  max: number;
  pass: boolean;
  feedback: string;
  missing: string[];
  confidence: number;
}

export interface EdgeInput {
  slug: string;
  prerequisites: string[];
}

export interface PlannerNode {
  slug: string;
  targetLevel: Level;
  weight: number;
  domainWeight: number;
  currentLevel: Level;
  prerequisites: string[];
  estimatedMinutes?: number;
}

export interface PlannedItem {
  slug: string;
  targetLevel: Level;
  week: number;
  position: number;
  estimatedMinutes: number;
}

export interface StreakState {
  current: number;
  longest: number;
  lastEvidenceDay: string | null;
  graceUsedWeek: string | null;
}
