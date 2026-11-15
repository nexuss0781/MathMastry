import type { AssessmentKind, RecallGrade, ReviewScore } from "../types.js";

export interface Dimension {
  key: string;
  label: string;
  max: number;
  guidance: string;
}

export interface Rubric {
  dimensions: Dimension[];
  pass: (scores: Record<string, number>, total: number) => boolean;
  summary: string;
}

export const RUBRICS: Record<AssessmentKind, Rubric> = {
  explain: {
    dimensions: [
      { key: "accuracy", label: "Accuracy", max: 2, guidance: "No mathematical falsehoods." },
      { key: "mechanism", label: "Mechanism", max: 2, guidance: "Explains why it works, not just what it is." },
      { key: "clarity", label: "Clarity", max: 2, guidance: "Plain language a peer could follow." },
      { key: "example", label: "Example", max: 2, guidance: "One correct, concrete example." },
    ],
    pass: (scores, total) => total >= 6 && (scores.accuracy ?? 0) >= 1,
    summary: "Accuracy and mechanism matter more than polish.",
  },
  apply: {
    dimensions: [
      { key: "correctness", label: "Correctness", max: 3, guidance: "The result is right." },
      { key: "method", label: "Method", max: 2, guidance: "The route is valid and shown." },
      { key: "edgeCases", label: "Edge cases", max: 1, guidance: "Names a limit or failure case." },
    ],
    pass: (scores, total) => total >= 4 && (scores.correctness ?? 0) >= 2,
    summary: "A right answer with no method is not L2.",
  },
  connect: {
    dimensions: [
      { key: "validity", label: "Validity", max: 2, guidance: "The analogy or transfer is structurally sound." },
      { key: "nontrivial", label: "Non-trivial", max: 2, guidance: "Goes beyond a surface resemblance." },
      { key: "testable", label: "Testable", max: 2, guidance: "Produces a checkable implication." },
    ],
    pass: (_scores, total) => total >= 4,
    summary: "Connection is evidence of transfer, not a level by itself.",
  },
};

export function rubricMax(kind: AssessmentKind): number {
  return RUBRICS[kind].dimensions.reduce((sum, dimension) => sum + dimension.max, 0);
}

export function scoreRubric(
  kind: AssessmentKind,
  scores: Record<string, number>,
  feedback: string,
  missing: string[],
  confidence = 0.8,
): ReviewScore {
  const rubric = RUBRICS[kind];
  const normalized: Record<string, number> = {};
  let total = 0;
  for (const dimension of rubric.dimensions) {
    const raw = scores[dimension.key] ?? 0;
    const value = Math.max(0, Math.min(dimension.max, Math.round(raw)));
    normalized[dimension.key] = value;
    total += value;
  }
  const max = rubricMax(kind);
  return {
    kind,
    scores: normalized,
    total,
    max,
    pass: rubric.pass(normalized, total),
    feedback,
    missing,
    confidence,
  };
}

export function isRecallPass(grade: RecallGrade): boolean {
  return grade === "yes";
}

export function rubricPrompt(kind: AssessmentKind): string {
  const rubric = RUBRICS[kind];
  const dimensions = rubric.dimensions
    .map((dimension) => `- ${dimension.key} (0-${dimension.max}): ${dimension.guidance}`)
    .join("\n");
  return `Grade the answer against this rubric.\n${dimensions}\nPass rule: ${rubric.summary}`;
}
