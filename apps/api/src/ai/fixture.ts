import { scoreRubric, tokenize } from "@mm/shared";
import type {
  ConceptContext,
  GradeReply,
  GradeRequest,
  TutorReply,
  TutorRequest,
  TutoringProvider,
} from "./types.js";
import { chunkText } from "./types.js";
import { assessmentPrompt } from "./prompts.js";

function quote(value: string, limit = 160): string {
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length > limit ? `${compact.slice(0, limit).trim()}…` : compact;
}

function seedNote(concept: ConceptContext): string {
  if (concept.enrichmentStatus !== "seed") return "";
  return [
    "",
    "> **Seed entry.** This concept currently has a sourced one-line definition only. The structure below is scaffolded from that definition and its listed sources — not from curated mechanism notes. Verify anything load-bearing against the sources before relying on it.",
  ].join("\n");
}

function sourceList(concept: ConceptContext): string {
  if (concept.sources.length === 0) return "_No sources recorded._";
  return concept.sources.map((source, index) => `${index + 1}. [${source.title}](${source.url})`).join("\n");
}

function neighbourhood(concept: ConceptContext): string {
  const parts: string[] = [];
  if (concept.prerequisites.length > 0) {
    parts.push(`**Prerequisites to check:** ${concept.prerequisites.map((entry) => entry.term).join(", ")}`);
  }
  if (concept.related.length > 0) {
    parts.push(`**Neighbours:** ${concept.related.map((entry) => entry.term).join(", ")}`);
  }
  return parts.join("\n\n");
}

function explain(concept: ConceptContext | null): string {
  if (!concept) {
    return [
      "## Pick a concept first",
      "The tutor is grounded in a specific atlas entry. Open any concept and ask again — otherwise I would be generating generic prose with no source trail.",
      "",
      "Try one of these routes:",
      "1. **Atlas** — browse the 12 domains and choose something unfamiliar.",
      "2. **Search** — type a term; the atlas searches definitions, not just titles.",
      "3. **Curriculum** — state a goal and I will sequence prerequisites for you.",
    ].join("\n");
  }

  const mechanism = concept.mechanism
    ? concept.mechanism
    : [
        `The atlas has not curated a mechanism note for **${concept.term}** yet. Work from the definition instead:`,
        "",
        `> ${concept.oneLiner}`,
        "",
        "Interrogate it in three passes:",
        "1. **Objects.** What kind of object is being defined, and what structure must it already carry?",
        "2. **Operation.** Which construction, map, or comparison does the definition perform?",
        "3. **Payoff.** What becomes possible that was not possible before — and under which hypotheses?",
      ].join("\n");

  const example =
    concept.examples.length > 0
      ? concept.examples.map((entry) => `- ${entry}`).join("\n")
      : "- No worked example is curated yet. Build the smallest one the definition admits, then test each clause against it.";

  const failure =
    concept.failureModes.length > 0
      ? concept.failureModes.map((entry) => `- ${entry}`).join("\n")
      : "- The definition’s hypotheses are the boundary. Remove one hypothesis at a time and ask which conclusion breaks.";

  return [
    `## ${concept.term}`,
    "",
    `**Domain.** ${concept.domain}`,
    "",
    `**Definition.** ${concept.oneLiner}`,
    "",
    "### Mechanism",
    mechanism,
    "",
    "### Example",
    example,
    "",
    "### Assumptions and failure modes",
    concept.assumptions.length > 0
      ? concept.assumptions.map((entry) => `- ${entry}`).join("\n")
      : "- None recorded beyond the definition’s stated hypotheses.",
    failure,
    "",
    "### Check yourself",
    `1. State **${concept.term}** without repeating the glossary wording.`,
    "2. Produce one example and one near-miss that fails exactly one hypothesis.",
    "3. Explain which prerequisite is doing the most work.",
    "",
    neighbourhood(concept),
    "",
    "### Sources",
    sourceList(concept),
    seedNote(concept),
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

function socratic(concept: ConceptContext | null, request: TutorRequest): string {
  if (!concept) {
    return [
      "## What do you want to understand?",
      "Name a concept, or describe the confusion in your own words. I will find the closest atlas entry and start from its definition.",
      "",
      "A good starting sentence: *“I don’t see why ___ implies ___.”*",
    ].join("\n");
  }

  const prior = request.history.filter((turn) => turn.role === "user").length;
  const lastUser = [...request.history].reverse().find((turn) => turn.role === "user");

  const probes = [
    `In one sentence, what does **${concept.term}** let you *do*?`,
    `Which word in the definition — “${quote(concept.oneLiner, 90)}” — is carrying the most weight?`,
    `What is the simplest object this definition should accept, and what is the closest object it should reject?`,
    `Which prerequisite would you need to repair first if this felt shaky?`,
  ];

  const opening =
    prior > 0 && lastUser
      ? [
          `You wrote: “${quote(lastUser.content, 140)}”`,
          "",
          "I will not pretend that a chat turn is assessment evidence. Let us make the idea testable instead.",
        ].join("\n")
      : `Let us start from the sourced definition, not from a slogan.`;

  return [
    `## ${concept.term}`,
    "",
    `> ${concept.oneLiner}`,
    "",
    opening,
    "",
    "### Work through these",
    probes[0],
    "",
    probes[1],
    "",
    "### A hint, not an answer",
    concept.prerequisites.length > 0
      ? `If you are stuck, revisit **${concept.prerequisites[0]?.term}** first. This entry lists it as a prerequisite.`
      : "If you are stuck, substitute the simplest concrete object you know into each clause of the definition and check whether the clause still holds.",
    "",
    "### When you are ready",
    `Open the assessment panel and write a free-response **explain** answer. That is what moves mastery — not this conversation.`,
    seedNote(concept),
  ].join("\n");
}

function quiz(concept: ConceptContext | null): string {
  if (!concept) {
    return "Choose a concept first, then I will write one question against its sourced definition.";
  }
  return [
    `## Quick check: ${concept.term}`,
    "",
    `> ${concept.oneLiner}`,
    "",
    "**Question.** Without copying the definition, explain what this concept is, why the stated hypotheses are needed, and give one example that would fail if a hypothesis were removed.",
    "",
    "A strong answer will:",
    "- name the objects and the structure being added;",
    "- state the mechanism, not just the label;",
    "- include a concrete example and one boundary case;",
    "- use the prerequisite vocabulary correctly.",
    "",
    "I am deliberately **not** showing a model answer. Submit your attempt in the assessment panel; the grader will return rubric scores and gaps.",
    seedNote(concept),
  ].join("\n");
}

function deepDive(concept: ConceptContext | null): string {
  if (!concept) {
    return "Open a concept and request a deep dive; this mode needs an atlas entry to stay grounded.";
  }
  return [
    `# Deep dive: ${concept.term}`,
    "",
    `*${concept.domain} · content status: ${concept.enrichmentStatus}*`,
    "",
    "## 1. The definition, unpacked",
    concept.oneLiner,
    "",
    "Rewrite it as a recipe:",
    "1. Start with the ambient objects.",
    "2. Add exactly the structure the definition names.",
    "3. Check every hypothesis; each one should correspond to a place where a naive argument would otherwise fail.",
    "",
    "## 2. Mechanism",
    concept.mechanism ??
      "Not curated yet. The reliable move is to prove the smallest nontrivial claim that uses the definition, then inspect which clause the proof actually consumed.",
    "",
    "## 3. Worked example",
    concept.examples.length > 0
      ? concept.examples.map((entry) => `- ${entry}`).join("\n")
      : "No worked example is curated. Construct one from the simplest object that satisfies every hypothesis; then remove one hypothesis and record precisely what breaks.",
    "",
    "## 4. Assumptions",
    concept.assumptions.length > 0
      ? concept.assumptions.map((entry) => `- ${entry}`).join("\n")
      : "- Only the hypotheses stated in the definition are recorded.",
    "",
    "## 5. Failure modes",
    concept.failureModes.length > 0
      ? concept.failureModes.map((entry) => `- ${entry}`).join("\n")
      : "- Applying the concept outside its hypotheses.\n- Confusing a necessary condition with a sufficient one.\n- Treating an example as the definition.",
    "",
    "## 6. Connections",
    neighbourhood(concept) || "_No graph neighbours recorded._",
    "",
    "## 7. Three-step practice plan",
    `1. **Recall (5 min).** Close this page and write the definition from memory. Compare, then correct.`,
    `2. **Explain (15 min).** Record a 90-second explanation with one example and one non-example. Submit it as an **explain** assessment.`,
    `3. **Apply (30 min).** Solve one concrete problem that requires **${concept.term}**, then submit the worked method as an **apply** assessment.`,
    "",
    "## Sources",
    sourceList(concept),
    seedNote(concept),
  ].join("\n");
}

function detectContradiction(answer: string): boolean {
  return /\b(always true|never fails|no assumptions?|trivially true in every case)\b/i.test(answer);
}

function overlapRatio(concept: ConceptContext, answer: string): number {
  const keywords = [
    ...new Set(tokenize(`${concept.term} ${concept.oneLiner}`)),
  ].filter((token) => token.length > 3);
  if (keywords.length === 0) return 0;
  const lower = ` ${answer.toLowerCase()} `;
  const hits = keywords.filter((keyword) => lower.includes(keyword)).length;
  return hits / keywords.length;
}

function heuristicGrade(request: GradeRequest): GradeReply {
  const { concept, kind, answer } = request;
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const sentences = answer
    .split(/[.!?]+\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.split(/\s+/).length >= 3);
  const lower = answer.toLowerCase();
  const overlap = overlapRatio(concept, answer);
  const substantive = words.length >= 25;

  const hasMechanism =
    /\b(because|since|therefore|thus|hence|so that|follows from|implies|if .{1,40} then|defined as|construction|by .{1,30} we)\b/i.test(
      answer,
    );
  const hasExample =
    /\b(for example|for instance|e\.g\.|example:|consider|suppose|let .{1,12}=)\b/i.test(answer) ||
    /[=+\-*/^<>]|\d/.test(answer);
  const hasAssumptions =
    /\b(assum\w*|requir\w*|provided|whenever|hypothes\w*|condition\w*|restrict\w*|valid only|where)\b/i.test(answer);
  const hasEdge =
    /\b(unless|except|fails?|counterexample|edge case|does not|cannot|only if|break\w*|degenerate|limit)\b/i.test(
      answer,
    );
  const hasSteps = /\b(first|second|third|then|next|step \d|1\.|2\.)\b/i.test(answer);
  const relational =
    /\b(both|share|correspond\w*|same structure|maps? to|analog\w*|duality|generaliz\w*|isomorphic|embed\w*)\b/i.test(
      answer,
    );
  const mentionsNeighbour = [...concept.related, ...concept.prerequisites].some((entry) =>
    lower.includes(entry.term.toLowerCase()),
  );
  const testable = /\b(implies|predict\w*|check\w*|test\w*|would|observ\w*|consequence|if .{1,40} then)\b/i.test(
    answer,
  );

  let scores: Record<string, number>;
  let feedback: string;
  const missing: string[] = [];

  if (kind === "explain") {
    const accuracy =
      words.length < 8 || overlap === 0
        ? 0
        : detectContradiction(answer)
          ? 0
          : overlap >= 0.28 && substantive
            ? 2
            : 1;
    const mechanism = hasMechanism && words.length >= 50 ? 2 : hasMechanism || substantive ? 1 : 0;
    const clarity =
      sentences.length >= 3 && words.length / Math.max(1, sentences.length) <= 35
        ? 2
        : sentences.length >= 2
          ? 1
          : 0;
    const example = hasExample ? (words.length >= 45 ? 2 : 1) : 0;
    scores = { accuracy, mechanism, clarity, example };
    if (accuracy < 2) missing.push("Use the concept’s own vocabulary and state it accurately.");
    if (mechanism < 2) missing.push("Explain why it works, using a causal or proof step.");
    if (example < 2) missing.push("Add one concrete example and check it against the definition.");
    if (clarity < 2) missing.push("Break the answer into shorter, complete sentences.");
    feedback =
      accuracy === 0
        ? "This does not yet engage the sourced definition. Start by restating the concept accurately, then add a mechanism and an example."
        : "The answer is on the right topic. The rubric rewards mechanism and a checked example over length.";
  } else if (kind === "apply") {
    const correctness =
      words.length < 15
        ? 0
        : hasMechanism && (hasExample || hasSteps) && substantive
          ? 3
          : substantive || hasSteps
            ? 2
            : 1;
    const method = hasSteps || hasMechanism ? (substantive ? 2 : 1) : 0;
    const edgeCases = hasEdge || hasAssumptions ? 1 : 0;
    scores = { correctness, method, edgeCases };
    if (correctness < 3) missing.push("Show the full computation, not only the conclusion.");
    if (method < 2) missing.push("Name each step and the rule that licenses it.");
    if (edgeCases < 1) missing.push("Name one limit, assumption, or edge case.");
    feedback =
      correctness >= 2
        ? "The method is visible. A right answer without a stated method would not count as application."
        : "This reads like a sketch. Write the worked method step by step, then state where it stops being valid.";
  } else {
    const validity =
      mentionsNeighbour && relational ? 2 : mentionsNeighbour || relational ? 1 : 0;
    const nontrivial =
      words.length >= 70 && mentionsNeighbour && relational ? 2 : substantive ? 1 : 0;
    const testability = testable ? 2 : substantive ? 1 : 0;
    scores = { validity, nontrivial, testability };
    if (validity < 2) missing.push("Name the other concept and the structural correspondence.");
    if (nontrivial < 2) missing.push("Go beyond a surface analogy: say what structure is preserved.");
    if (testability < 2) missing.push("State a checkable implication of the connection.");
    feedback =
      validity >= 1
        ? "A connection is present. The rubric asks for structure, not wordplay: name what is preserved and what it predicts."
        : "This is not yet a connection. Choose a neighbour from the graph and name the shared structure explicitly.";
  }

  const score = scoreRubric(kind, scores, feedback, missing, 0.5);
  return {
    scores: score.scores,
    feedback: `${score.total}/${score.max}. ${feedback}`,
    missing: missing.slice(0, 4),
    confidence: 0.5,
    model: "fixture-heuristic",
  };
}

export const fixtureProvider: TutoringProvider = {
  name: "fixture",
  async reply(request: TutorRequest): Promise<TutorReply> {
    const concept = request.concept;
    let content: string;
    if (request.mode === "explain") content = explain(concept);
    else if (request.mode === "quiz") content = quiz(concept);
    else if (request.mode === "deep_dive") content = deepDive(concept);
    else content = socratic(concept, request);
    return {
      content,
      model: "fixture-grounded",
      citations: concept?.sources.map((source) => source.url) ?? [],
    };
  },
  async grade(request: GradeRequest): Promise<GradeReply> {
    if (!request.answer || request.answer.trim().length < 3) {
      throw new Error("Answer is empty.");
    }
    return heuristicGrade(request);
  },
  stream: (text: string) => chunkText(text, 28),
};

export function heuristicPrompt(request: GradeRequest): string {
  return assessmentPrompt(request.kind, request.concept);
}
