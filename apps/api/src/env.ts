import { z } from "zod";

const booleanEnv = (defaultValue: "true" | "false") =>
  z
    .enum(["true", "false"])
    .default(defaultValue)
    .transform((value) => value === "true");

/**
 * Wasmer injects DB_HOST/DB_PORT/DB_NAME/DB_USERNAME/DB_PASSWORD for the
 * managed Postgres capability but does not provide DATABASE_URL. Compose it
 * when the explicit URL is absent so the same build works everywhere.
 */
function databaseUrlFromParts(): string | undefined {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
  if (!DB_HOST || !DB_NAME || !DB_USERNAME) return undefined;
  const user = encodeURIComponent(DB_USERNAME);
  const password = encodeURIComponent(DB_PASSWORD ?? "");
  const port = DB_PORT ?? "5432";
  return `postgresql://${user}:${password}@${DB_HOST}:${port}/${DB_NAME}?sslmode=require`;
}

const databaseUrl =
  process.env.DATABASE_URL?.trim() ||
  databaseUrlFromParts() ||
  "postgresql://postgres@127.0.0.1:55432/mathmastery";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(8787),
  DATABASE_URL: z.string().min(1).default(databaseUrl),
  BETTER_AUTH_SECRET: z.string().min(32).default("dev-secret-change-me-0123456789abcdef"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:8787"),
  WEB_ORIGIN: z.string().url().default("http://localhost:5173"),
  SITE_URL: z.string().url().default("http://localhost:8787"),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  AUTH_PASSWORD_ENABLED: booleanEnv("true"),
  AI_PROVIDER: z.enum(["fixture", "openai"]).default("fixture"),
  OPENAI_API_KEY: z.string().optional(),
  AI_CHAT_MODEL: z.string().default("gpt-4.1-mini"),
  AI_GRADER_MODEL: z.string().default("gpt-4.1-mini"),
  AI_ENABLED: booleanEnv("true"),
  AI_DAILY_MESSAGES: z.coerce.number().int().min(1).default(40),
  AI_DAILY_ASSESSMENTS: z.coerce.number().int().min(1).default(15),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("MathMastery <noreply@mathmastery.local>"),
  CRON_SECRET: z.string().min(8).default("dev-cron-secret"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

export type Env = z.infer<typeof schema>;

export const env: Env = schema.parse({ ...process.env, DATABASE_URL: databaseUrl });

export const githubEnabled = Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);
export const aiConfigured = env.AI_PROVIDER === "openai" && Boolean(env.OPENAI_API_KEY);
