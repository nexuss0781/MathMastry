import { aiConfigured, env } from "../env.js";
import { logger } from "../logger.js";
import { fixtureProvider } from "./fixture.js";
import { createOpenAiProvider } from "./openai.js";
import type { TutoringProvider } from "./types.js";

const primary: TutoringProvider = aiConfigured
  ? createOpenAiProvider({
      apiKey: env.OPENAI_API_KEY as string,
      chatModel: env.AI_CHAT_MODEL,
      graderModel: env.AI_GRADER_MODEL,
    })
  : fixtureProvider;

const NOTE =
  "The configured model was unavailable, so this reply came from the deterministic grounded fallback. Treat it as scaffold, not as a model-generated answer.";

export const ai: TutoringProvider = {
  name: primary.name,
  async reply(request) {
    if (primary.name === "fixture") return primary.reply(request);
    try {
      return await primary.reply(request);
    } catch (error) {
      logger.warn({ error }, "Chat provider failed; using fixture fallback");
      const fallback = await fixtureProvider.reply(request);
      return { ...fallback, content: `${fallback.content}\n\n> ${NOTE}`, model: `${fallback.model} (fallback)` };
    }
  },
  async grade(request) {
    if (primary.name === "fixture") return primary.grade(request);
    try {
      return await primary.grade(request);
    } catch (error) {
      logger.warn({ error }, "Grader provider failed; using heuristic fallback");
      const fallback = await fixtureProvider.grade(request);
      return { ...fallback, feedback: `${fallback.feedback} (Heuristic fallback: the model grader was unavailable.)` };
    }
  },
  stream: (text) => fixtureProvider.stream(text),
};

export const aiMode = primary.name === "fixture" ? "fixture" : "openai";
