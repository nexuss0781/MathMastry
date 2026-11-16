import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { env } from "./env.js";
import { logger } from "./logger.js";
import { client } from "./db/index.js";
import { ensureDatabase } from "./services/bootstrap.js";

async function main() {
  const server = serve({ fetch: app.fetch, port: env.PORT, hostname: "0.0.0.0" }, (info) => {
    logger.info(
      { port: info.port, env: env.NODE_ENV, ai: env.AI_PROVIDER, url: `http://localhost:${info.port}` },
      "MathMastery API listening",
    );
  });

  // Warm the managed database in the background: create the schema and load
  // the atlas on first boot. The server stays reachable while this runs.
  void ensureDatabase()
    .then((result) => logger.info(result, "Database ready"))
    .catch((error) =>
      logger.error({ error }, "Database bootstrap failed; retry POST /api/admin/bootstrap"),
    );

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
