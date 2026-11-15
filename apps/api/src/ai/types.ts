import type { AssessmentKind } from "@mm/shared";

export type TutorMode = "socratic" | "explain" | "quiz" | "deep_dive";

export interface ConceptContext {
  slug: string;
  term: string;
  oneLiner: string;
  mechanism: string | null;
  assumptions: string[];
  failureModes: string[];
  transferHooks: string[];
  examples: string[];
  domain: string;
  enrichmentStatus: "seed" | "draft" | "reviewed";
  sources: Array<{ title: string; url: string }>;
  prerequisites: Array<{ slug: string; term: string }>;
  related: Array<{ slug: string; term: string }>;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface TutorRequest {
  concept: ConceptContext | null;
  mode: TutorMode;
  history: ChatTurn[];
  message: string;
  displayName: string;
}

export interface TutorReply {
  content: string;
  model: string;
  citations: string[];
}

export interface GradeRequest {
  concept: ConceptContext;
  kind: AssessmentKind;
  answer: string;
  prompt: string;
}

export interface GradeReply {
  scores: Record<string, number>;
  feedback: string;
  missing: string[];
  confidence: number;
  model: string;
}

export interface TutoringProvider {
  readonly name: string;
  reply(request: TutorRequest): Promise<TutorReply>;
  grade(request: GradeRequest): Promise<GradeReply>;
  /** Chunks a reply for the streaming transport. */
  stream(text: string): AsyncGenerator<string, void, unknown>;
}

export async function* chunkText(text: string, size = 24): AsyncGenerator<string, void, unknown> {
  const words = text.match(/\S+\s*/g) ?? [text];
  let buffer = "";
  for (const word of words) {
    buffer += word;
    if (buffer.length >= size) {
      yield buffer;
      buffer = "";
    }
  }
  if (buffer.length > 0) yield buffer;
}
