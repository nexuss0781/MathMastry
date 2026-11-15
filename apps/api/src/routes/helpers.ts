import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { z } from "zod";
import type { AppEnv } from "../types.js";

export async function parseBody<T extends z.ZodTypeAny>(
  c: Context<AppEnv>,
  schema: T,
): Promise<z.infer<T>> {
  let payload: unknown;
  try {
    payload = await c.req.json();
  } catch {
    throw new HTTPException(400, { message: "Expected a JSON body." });
  }
  const result = schema.safeParse(payload);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new HTTPException(400, {
      message: issue ? `${issue.path.join(".") || "body"}: ${issue.message}` : "Invalid request body.",
    });
  }
  return result.data;
}

export function parseQuery<T extends z.ZodTypeAny>(c: Context<AppEnv>, schema: T): z.infer<T> {
  const result = schema.safeParse(c.req.query());
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new HTTPException(400, {
      message: issue ? `${issue.path.join(".") || "query"}: ${issue.message}` : "Invalid query.",
    });
  }
  return result.data;
}

export function currentUser(c: Context<AppEnv>) {
  const user = c.get("user");
  if (!user) throw new HTTPException(401, { message: "Sign in to continue." });
  return user;
}

export function currentProfile(c: Context<AppEnv>) {
  const profile = c.get("profile");
  if (!profile) throw new HTTPException(401, { message: "Sign in to continue." });
  return profile;
}
