import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { env } from "../env.js";

export const client = postgres(env.DATABASE_URL, {
  max: env.NODE_ENV === "test" ? 2 : 10,
  prepare: false,
});

export const db = drizzle(client, { schema });
export type Database = typeof db;
