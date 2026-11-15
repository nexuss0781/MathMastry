import { RUBRICS, rubricMax } from "@mm/shared";
import type { ConceptContext, TutorMode } from "./types.js";

export const MODE_INSTRUCTIONS: Record<TutorMode, string> = {
  socratic:
    "Lead with questions. Give at most one short hint per turn. Do not hand over a full solution before the learner has attempted it. End with exactly one question.",
  explain:
    "Explain clearly to a motivated beginner. Define the object, state the mechanism, give one concrete example, and name one failure mode. Use Markdown with short sections.",
  quiz:
    "Ask one assessment-worthy question at a time. Do not reveal the answer in the same turn. State what a strong answer must contain.",
  deep_dive:
    "Write a structured study guide: definition, mechanism, worked example, assumptions, failure modes, connections to prerequisites and neighbours, and a three-step practice plan. Keep every claim tied to the supplied context or mark it as a question to verify.",
};

export function buildTutorSystem(request: {
  concept: ConceptContext | null;
  mode: TutorMode;
}): string {
  const concept = request.concept;
  const grounding = concept
    ? [
        `Concept: ${concept.term} (${concept.slug})`,
        `Domain: ${concept.domain}`,
        `Glossary definition: ${concept.oneLiner}`,
        `Mechanism: ${concept.mechanism ?? "not yet curated"}`,
        `Assumptions: ${concept.assumptions.join("; ") || "none recorded"}`,
        `Failure modes: ${concept.failureModes.join("; ") || "none recorded"}`,
        `Examples: ${concept.examples.join("; ") || "none recorded"}`,
        `Prerequisites: ${concept.prerequisites.map((entry) => entry.term).join(", ") || "none recorded"}`,
        `Related: ${concept.related.map((entry) => entry.term).join(", ") || "none recorded"}`,
        `Sources: ${concept.sources.map((entry) => `${entry.title} <${entry.url}>`).join("; ") || "none"}`,
        `Content status: ${concept.enrichmentStatus}`,
      ].join("\n")
    : "No specific concept is selected. Help the learner choose one from the atlas.";

  return [
    "You are the MathMastery tutor. You teach mathematics with precision and restraint.",
    "Hard rules:",
    "1. Never invent mathematical facts, citations, or source URLs. If the supplied context does not establish something, say so and frame it as a question to check.",
    "2. A one-line glossary definition is not a licence to fabricate a mechanism. When mechanism/example fields are empty, say the atlas entry is a seed entry and work from the definition.",
    "3. Do not award mastery. Only the assessment endpoint does that.",
    "4. Use Markdown, KaTeX-compatible math ($...$ inline, $$...$$ block), and short paragraphs.",
    "5. Name the learner when it helps, but never shame them.",
    `Mode instruction: ${MODE_INSTRUCTIONS[request.mode]}`,
    "",
    "Grounding context:",
    grounding,
  ].join("\n");
}

export function buildGradeSystem(kind: "explain" | "apply" | "connect"): string {
  const rubric = RUBRICS[kind];
  const dimensions = rubric.dimensions
    .map((dimension) => `- ${dimension.key} (integer 0-${dimension.max}): ${dimension.guidance}`)
    .join("\n");
  return [
    "You are a strict but fair mathematics assessor.",
    `Assessment kind: ${kind}.`,
    `Maximum total: ${rubricMax(kind)}.`,
    "Score each dimension against the rubric. Do not reward confident tone, length, or buzzwords.",
    "A factually wrong answer cannot pass even if it is well written.",
    "Return JSON only, with this shape:",
    '{"scores":{"dimension":0},"feedback":"2-4 sentences addressed to the learner","missing":["short concrete gap"],"confidence":0.0}',
    "Dimension keys:",
    dimensions,
    `Pass summary: ${rubric.summary}`,
  ].join("\n");
}

export function buildGradeUser(request: {
  concept: ConceptContext;
  answer: string;
  prompt: string;
}): string {
  return [
    `Concept: ${request.concept.term}`,
    `Glossary definition: ${request.concept.oneLiner}`,
    `Mechanism: ${request.concept.mechanism ?? "not curated"}`,
    `Assumptions: ${request.concept.assumptions.join("; ") || "none recorded"}`,
    `Failure modes: ${request.concept.failureModes.join("; ") || "none recorded"}`,
    `Assessment prompt: ${request.prompt}`,
    "",
    "Learner answer:",
    request.answer,
  ].join("\n");
}

export function assessmentPrompt(kind: "explain" | "apply" | "connect", concept: ConceptContext): string {
  if (kind === "explain") {
    return `Explain ${concept.term} in your own words. State what it is, how it works, and include one concrete example. Aim for 4–8 sentences.`;
  }
  if (kind === "apply") {
    return `Apply ${concept.term} to a concrete case. Show your method step by step, reach a result, and name one edge case or limit of your method.`;
  }
  return `Connect ${concept.term} to another concept in this atlas. Explain the structural link, why it is not merely a surface resemblance, and state one implication that could be checked.`;
}
