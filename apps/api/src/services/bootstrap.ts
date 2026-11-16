import { sql } from "drizzle-orm";
import { client, db } from "../db/index.js";
import { embeddedMigrations } from "../db/migrations.generated.js";
import { concepts } from "../db/schema.js";
import { logger } from "../logger.js";
import { ingestContent } from "./ingest.js";

export interface BootstrapResult {
  schemaCreated: boolean;
  seeded: boolean;
  concepts: number;
}

/** Create the schema when the managed database is empty. */
export async function ensureSchema(): Promise<boolean> {
  const rows = await client`select to_regclass('public.concepts') as table_name`;
  if (rows[0]?.table_name) return false;

  const created = await client.begin(async (tx) => {
    // Serialise concurrent bootstraps (boot task + admin request + instances).
    await tx`select pg_advisory_xact_lock(727272)`;

    // Another caller may have created the schema while we waited for the lock.
    const recheck = await tx`select to_regclass('public.concepts') as table_name`;
    if (recheck[0]?.table_name) return false;

    for (const migration of embeddedMigrations) {
      for (const statement of migration.statements) {
        await tx.unsafe(statement);
      }
    }
    return true;
  });

  if (created) logger.info({ migrations: embeddedMigrations.length }, "Database schema created");
  return created;
}

/**
 * Make a fresh managed database usable without a shell:
 * create tables, then load the atlas when it is missing or incomplete.
 */
export async function ensureDatabase(): Promise<BootstrapResult> {
  const schemaCreated = await ensureSchema();

  const [before] = await db.select({ value: sql<number>`count(*)::int` }).from(concepts);
  const existing = before?.value ?? 0;

  let seeded = false;
  if (existing !== 429) {
    const started = Date.now();
    const result = await ingestContent();
    seeded = result.verified.length > 0 || result.insertedEdges > 0;
    logger.info(
      { concepts: result.concepts, edges: result.insertedEdges, ms: Date.now() - started },
      "Atlas ingested",
    );
  }

  const [after] = await db.select({ value: sql<number>`count(*)::int` }).from(concepts);

  return { schemaCreated, seeded, concepts: after?.value ?? 0 };
}
