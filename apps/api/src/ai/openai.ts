import { scoreRubric, type AssessmentKind } from "@mm/shared";
import { buildGradeSystem, buildGradeUser, buildTutorSystem } from "./prompts.js";
import type { GradeReply, GradeRequest, TutorReply, TutorRequest, TutoringProvider } from "./types.js";
import { chunkText } from "./types.js";

interface ChatChoice {
  message?: { content?: string | null };
}

async function chat(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  options: { json?: boolean; maxTokens?: number } = {},
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: options.maxTokens ?? 1200,
        ...(options.json ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI ${response.status}: ${text.slice(0, 300)}`);
    }
    const data = (await response.json()) as { choices?: ChatChoice[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenAI returned an empty message");
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

export function createOpenAiProvider(input: {
  apiKey: string;
  chatModel: string;
  graderModel: string;
}): TutoringProvider {
  return {
    name: "openai",
    async reply(request: TutorRequest): Promise<TutorReply> {
      const messages = [
        { role: "system", content: buildTutorSystem({ concept: request.concept, mode: request.mode }) },
        ...request.history.slice(-12).map((turn) => ({ role: turn.role, content: turn.content })),
        { role: "user", content: request.message },
      ];
      const content = await chat(input.apiKey, input.chatModel, messages);
      return {
        content,
        model: input.chatModel,
        citations: request.concept?.sources.map((source) => source.url) ?? [],
      };
    },
    async grade(request: GradeRequest): Promise<GradeReply> {
      const raw = await chat(
        input.apiKey,
        input.graderModel,
        [
          { role: "system", content: buildGradeSystem(request.kind) },
          {
            role: "user",
            content: buildGradeUser({
              concept: request.concept,
              answer: request.answer,
              prompt: request.prompt,
            }),
          },
        ],
        { json: true, maxTokens: 600 },
      );
      const parsed = JSON.parse(raw) as {
        scores?: Record<string, unknown>;
        feedback?: string;
        missing?: unknown;
        confidence?: number;
      };
      const scores: Record<string, number> = {};
      for (const [key, value] of Object.entries(parsed.scores ?? {})) {
        if (typeof value === "number") scores[key] = value;
      }
      const rubric = scoreRubric(
        request.kind,
        scores,
        typeof parsed.feedback === "string" ? parsed.feedback : "No feedback returned.",
        Array.isArray(parsed.missing) ? parsed.missing.filter((entry): entry is string => typeof entry === "string") : [],
        typeof parsed.confidence === "number" ? Math.max(0, Math.min(1, parsed.confidence)) : 0.65,
      );
      return {
        scores: rubric.scores,
        feedback: `${rubric.total}/${rubric.max}. ${rubric.feedback}`,
        missing: rubric.missing.slice(0, 4),
        confidence: rubric.confidence,
        model: input.graderModel,
      };
    },
    stream: (text: string) => chunkText(text, 28),
  };
}

export function scoreToKind(value: string): AssessmentKind {
  if (value === "apply" || value === "connect" || value === "explain") return value;
  throw new Error(`Unknown assessment kind: ${value}`);
}
