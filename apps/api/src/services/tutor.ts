import { and, asc, desc, eq, sql } from "drizzle-orm";
import type { ChatRequest } from "@mm/shared";
import { db } from "../db/index.js";
import { aiMessages, aiThreads, aiUsage } from "../db/schema.js";
import { ai } from "../ai/index.js";
import { getContent } from "./content.js";
import { contextFor } from "./mastery.js";
import { env } from "../env.js";
import { localDay } from "@mm/shared";

export class QuotaError extends Error {
  code = "quota_exceeded" as const;
}

export async function listThreads(userId: string) {
  const rows = await db
    .select({
      id: aiThreads.id,
      title: aiThreads.title,
      mode: aiThreads.mode,
      conceptId: aiThreads.conceptId,
      createdAt: aiThreads.createdAt,
      updatedAt: aiThreads.updatedAt,
    })
    .from(aiThreads)
    .where(eq(aiThreads.userId, userId))
    .orderBy(desc(aiThreads.updatedAt))
    .limit(40);
  return rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function getThread(userId: string, id: string) {
  const rows = await db
    .select()
    .from(aiThreads)
    .where(and(eq(aiThreads.id, id), eq(aiThreads.userId, userId)))
    .limit(1);
  const thread = rows[0];
  if (!thread) return null;
  const messages = await db
    .select()
    .from(aiMessages)
    .where(eq(aiMessages.threadId, id))
    .orderBy(asc(aiMessages.createdAt))
    .limit(200);
  return {
    id: thread.id,
    title: thread.title,
    mode: thread.mode,
    conceptId: thread.conceptId,
    createdAt: thread.createdAt.toISOString(),
    updatedAt: thread.updatedAt.toISOString(),
    messages: messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      citations: message.citations,
      model: message.model,
      status: message.status,
      createdAt: message.createdAt.toISOString(),
    })),
  };
}

export async function deleteThread(userId: string, id: string) {
  const deleted = await db
    .delete(aiThreads)
    .where(and(eq(aiThreads.id, id), eq(aiThreads.userId, userId)))
    .returning({ id: aiThreads.id });
  return deleted[0] ?? null;
}

async function assertQuota(userId: string, day: string) {
  const rows = await db
    .select({ messages: aiUsage.messages })
    .from(aiUsage)
    .where(and(eq(aiUsage.userId, userId), eq(aiUsage.day, day)))
    .limit(1);
  if ((rows[0]?.messages ?? 0) >= env.AI_DAILY_MESSAGES) {
    throw new QuotaError(`Daily tutor limit reached (${env.AI_DAILY_MESSAGES} messages). It resets at midnight in your timezone.`);
  }
}

async function bumpUsage(userId: string, day: string, tokensIn = 0, tokensOut = 0) {
  await db
    .insert(aiUsage)
    .values({ userId, day, messages: 1, tokensIn, tokensOut })
    .onConflictDoUpdate({
      target: [aiUsage.userId, aiUsage.day],
      set: {
        messages: sql`${aiUsage.messages} + 1`,
        tokensIn: sql`${aiUsage.tokensIn} + ${tokensIn}`,
        tokensOut: sql`${aiUsage.tokensOut} + ${tokensOut}`,
      },
    });
}

export async function createThread(
  userId: string,
  timezone: string,
  input: { conceptSlug?: string; mode: ChatRequest["mode"]; title?: string },
) {
  const content = await getContent();
  const concept = input.conceptSlug ? content.bySlug.get(input.conceptSlug) : undefined;
  const modeLabel = input.mode.replace("_", " ");
  const [thread] = await db
    .insert(aiThreads)
    .values({
      userId,
      conceptId: concept?.id ?? null,
      mode: input.mode,
      title: input.title ?? (concept ? `${concept.term} · ${modeLabel}` : `Tutor · ${modeLabel}`),
    })
    .returning();
  if (!thread) throw new Error("Could not create thread");
  await db.insert(aiUsage).values({ userId, day: localDay(new Date(), timezone) }).onConflictDoNothing();
  return thread;
}

export async function sendTutorMessage(input: {
  userId: string;
  timezone: string;
  threadId: string;
  message: string;
  mode?: ChatRequest["mode"];
}) {
  const threadRows = await db
    .select()
    .from(aiThreads)
    .where(and(eq(aiThreads.id, input.threadId), eq(aiThreads.userId, input.userId)))
    .limit(1);
  const thread = threadRows[0];
  if (!thread) return null;

  const day = localDay(new Date(), input.timezone);
  await assertQuota(input.userId, day);

  const content = await getContent();
  const concept = thread.conceptId ? content.byId.get(thread.conceptId) : undefined;

  const prior = await db
    .select({ role: aiMessages.role, content: aiMessages.content })
    .from(aiMessages)
    .where(eq(aiMessages.threadId, thread.id))
    .orderBy(desc(aiMessages.createdAt))
    .limit(12);

  await db.insert(aiMessages).values({
    threadId: thread.id,
    role: "user",
    content: input.message,
  });

  const mode = input.mode ?? thread.mode;
  const reply = await ai.reply({
    concept: concept ? contextFor(content, concept) : null,
    mode,
    history: prior
      .reverse()
      .filter((entry) => entry.role !== "tool")
      .map((entry) => ({ role: entry.role as "user" | "assistant", content: entry.content })),
    message: input.message,
    displayName: "",
  });

  const [assistant] = await db
    .insert(aiMessages)
    .values({
      threadId: thread.id,
      role: "assistant",
      content: reply.content,
      citations: reply.citations,
      model: reply.model,
    })
    .returning();

  await db.update(aiThreads).set({ updatedAt: new Date() }).where(eq(aiThreads.id, thread.id));
  await bumpUsage(input.userId, day, Math.ceil(input.message.length / 4), Math.ceil(reply.content.length / 4));

  return {
    threadId: thread.id,
    message: assistant
      ? {
          id: assistant.id,
          role: assistant.role,
          content: assistant.content,
          citations: assistant.citations,
          model: assistant.model,
          createdAt: assistant.createdAt.toISOString(),
        }
      : null,
    mode,
  };
}

export async function tutorForConcept(
  userId: string,
  timezone: string,
  input: { conceptSlug: string; mode: ChatRequest["mode"]; message: string },
) {
  const thread = await createThread(userId, timezone, {
    conceptSlug: input.conceptSlug,
    mode: input.mode,
  });
  return sendTutorMessage({
    userId,
    timezone,
    threadId: thread.id,
    message: input.message,
    mode: input.mode,
  });
}
