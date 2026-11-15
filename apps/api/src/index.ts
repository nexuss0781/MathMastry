import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { env } from "./env.js";
import { logger } from "./logger.js";
import { client, db } from "./db/index.js";
import { concepts } from "./db/schema.js";
import { sql } from "drizzle-orm";

async function main() {
  try {
    const [row] = await db.select({ value: sql<number>`count(*)::int` }).from(concepts);
    const total = row?.value ?? 0;
    if (total !== 429) {
      logger.warn({ total }, "Content is not fully ingested; run `pnpm content:ingest`");
    } else {
      logger.info({ concepts: total }, "Content loaded");
    }
  } catch (error) {
    logger.error({ error }, "Database not reachable at startup. Run migrations and the ingest script.");
  }

  const server = serve({ fetch: app.fetch, port: env.PORT, hostname: "0.0.0.0" }, (info) => {
    logger.info(
      { port: info.port, env: env.NODE_ENV, ai: env.AI_PROVIDER, url: `http://localhost:${info.port}` },
      "MathMastery API listening",
    );
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutting down");
    server.close();
    await client.end({ timeout: 5 });
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

void main();
