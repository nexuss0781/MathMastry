import { Hono } from "hono";
import { z } from "zod";
import { streamSSE } from "hono/streaming";
import { chatModeSchema } from "@mm/shared";
import type { AppEnv } from "../types.js";
import { ai } from "../ai/index.js";
import {
  QuotaError,
  createThread,
  deleteThread,
  getThread,
  listThreads,
  sendTutorMessage,
  tutorForConcept,
} from "../services/tutor.js";
import { getContent } from "../services/content.js";
import { currentProfile, currentUser, parseBody } from "./helpers.js";

export const tutorRoutes = new Hono<AppEnv>();

const createSchema = z.object({
  conceptSlug: z.string().min(1).max(160).optional(),
  mode: chatModeSchema.default("socratic"),
  title: z.string().min(1).max(120).optional(),
});

const messageSchema = z.object({
  message: z.string().min(1).max(8000),
  mode: chatModeSchema.optional(),
});

tutorRoutes.get("/threads", async (c) => {
  const user = currentUser(c);
  return c.json({ threads: await listThreads(user.id) });
});

tutorRoutes.post("/threads", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const body = await parseBody(c, createSchema);
  const thread = await createThread(user.id, profile.timezone, body);
  return c.json(
    {
      thread: {
        id: thread.id,
        title: thread.title,
        mode: thread.mode,
        conceptId: thread.conceptId,
        createdAt: thread.createdAt.toISOString(),
        updatedAt: thread.updatedAt.toISOString(),
        messages: [],
      },
    },
    201,
  );
});

tutorRoutes.get("/threads/:id", async (c) => {
  const user = currentUser(c);
  const thread = await getThread(user.id, c.req.param("id"));
  if (!thread) return c.json({ error: "not_found" }, 404);
  return c.json({ thread });
});

tutorRoutes.delete("/threads/:id", async (c) => {
  const user = currentUser(c);
  const deleted = await deleteThread(user.id, c.req.param("id"));
  if (!deleted) return c.json({ error: "not_found" }, 404);
  return c.json({ deleted: deleted.id });
});

tutorRoutes.post("/threads/:id/messages", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const body = await parseBody(c, messageSchema);
  try {
    const result = await sendTutorMessage({
      userId: user.id,
      timezone: profile.timezone,
      threadId: c.req.param("id"),
      message: body.message,
      mode: body.mode,
    });
    if (!result) return c.json({ error: "not_found" }, 404);
    return c.json(result);
  } catch (error) {
    if (error instanceof QuotaError) {
      return c.json({ error: "quota_exceeded", message: error.message }, 429);
    }
    throw error;
  }
});

tutorRoutes.post("/threads/:id/messages/stream", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const body = await parseBody(c, messageSchema);

  let result;
  try {
    result = await sendTutorMessage({
      userId: user.id,
      timezone: profile.timezone,
      threadId: c.req.param("id"),
      message: body.message,
      mode: body.mode,
    });
  } catch (error) {
    if (error instanceof QuotaError) {
      return c.json({ error: "quota_exceeded", message: error.message }, 429);
    }
    throw error;
  }
  if (!result?.message) return c.json({ error: "not_found" }, 404);

  const message = result.message;
  c.header("cache-control", "no-store");
  return streamSSE(c, async (stream) => {
    for await (const chunk of ai.stream(message.content)) {
      await stream.writeSSE({ event: "chunk", data: JSON.stringify({ text: chunk }) });
    }
    await stream.writeSSE({
      event: "done",
      data: JSON.stringify({ message, threadId: result.threadId, mode: result.mode }),
    });
  });
});

tutorRoutes.post("/deep-dive", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const body = await parseBody(
    c,
    z.object({
      conceptSlug: z.string().min(1).max(160),
      focus: z.string().max(500).optional(),
    }),
  );
  const content = await getContent();
  const concept = content.bySlug.get(body.conceptSlug);
  if (!concept) return c.json({ error: "not_found", message: "Concept not found." }, 404);

  const message =
    `Write a deep dive on ${concept.term}.` +
    (body.focus ? ` Focus especially on: ${body.focus}.` : "") +
    " Use the definition, assumptions, failure modes, graph neighbours, and sources. Separate sourced claims from questions to verify.";

  try {
    const result = await tutorForConcept(user.id, profile.timezone, {
      conceptSlug: concept.slug,
      mode: "deep_dive",
      message,
    });
    return c.json(result, 201);
  } catch (error) {
    if (error instanceof QuotaError) {
      return c.json({ error: "quota_exceeded", message: error.message }, 429);
    }
    throw error;
  }
});
