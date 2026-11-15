import { Hono } from "hono";
import { z } from "zod";
import { curriculumRequestSchema } from "@mm/shared";
import type { AppEnv } from "../types.js";
import {
  createCurriculum,
  getActiveCurriculum,
  getCurriculum,
  listCurricula,
  nextCurriculumItems,
  setCurriculumStatus,
  updateItemStatus,
} from "../services/plan.js";
import { currentProfile, currentUser, parseBody } from "./helpers.js";

export const curriculumRoutes = new Hono<AppEnv>();

curriculumRoutes.get("/", async (c) => {
  const user = currentUser(c);
  return c.json({ curricula: await listCurricula(user.id) });
});

curriculumRoutes.post("/", async (c) => {
  const user = currentUser(c);
  const profile = currentProfile(c);
  const body = await parseBody(c, curriculumRequestSchema);
  try {
    const result = await createCurriculum(user.id, profile.timezone, body);
    return c.json(
      {
        ...result,
        curriculum: {
          ...result.curriculum,
          createdAt: result.curriculum.createdAt.toISOString(),
          updatedAt: result.curriculum.updatedAt.toISOString(),
        },
      },
      201,
    );
  } catch (error) {
    return c.json(
      {
        error: "plan_failed",
        message: error instanceof Error ? error.message : "Could not build the plan.",
      },
      400,
    );
  }
});

curriculumRoutes.get("/active", async (c) => {
  const user = currentUser(c);
  return c.json({ curriculum: await getActiveCurriculum(user.id) });
});

curriculumRoutes.get("/next", async (c) => {
  const user = currentUser(c);
  return c.json(await nextCurriculumItems(user.id, 5));
});

curriculumRoutes.get("/:id", async (c) => {
  const user = currentUser(c);
  const curriculum = await getCurriculum(user.id, c.req.param("id"));
  if (!curriculum) return c.json({ error: "not_found" }, 404);
  return c.json({ curriculum });
});

curriculumRoutes.patch("/:id", async (c) => {
  const user = currentUser(c);
  const body = await parseBody(c, z.object({ status: z.enum(["draft", "active", "paused", "done"]) }));
  const updated = await setCurriculumStatus(user.id, c.req.param("id"), body.status);
  if (!updated) return c.json({ error: "not_found" }, 404);
  return c.json({ curriculum: { id: updated.id, status: updated.status } });
});

curriculumRoutes.patch("/:id/items/:itemId", async (c) => {
  const user = currentUser(c);
  const body = await parseBody(c, z.object({ status: z.enum(["pending", "done", "skipped"]) }));
  const updated = await updateItemStatus(
    user.id,
    c.req.param("id"),
    c.req.param("itemId"),
    body.status,
  );
  if (!updated) return c.json({ error: "not_found" }, 404);
  return c.json({
    item: {
      id: updated.id,
      status: updated.status,
      completedAt: updated.completedAt?.toISOString() ?? null,
    },
    note:
      body.status === "done" && updated.status === "done"
        ? "Marking an item done is a planning action, not mastery evidence. Submit an assessment to change the level."
        : undefined,
  });
});
