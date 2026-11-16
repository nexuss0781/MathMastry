import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import * as schema from "./db/schema.js";
import { env, googleEnabled } from "./env.js";
import { logger } from "./logger.js";

const socialProviders = googleEnabled
  ? {
      google: {
        clientId: env.GOOGLE_CLIENT_ID as string,
        clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      },
    }
  : {};

export const auth = betterAuth({
  appName: "MathMastery",
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.WEB_ORIGIN, env.BETTER_AUTH_URL],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  socialProviders,
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: googleEnabled ? ["google"] : [],
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  rateLimit: {
    enabled: env.NODE_ENV === "production",
    window: 60,
    max: 30,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true,
      secure: env.NODE_ENV === "production",
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (createdUser) => {
          try {
            await db
              .insert(schema.profiles)
              .values({
                userId: createdUser.id,
                displayName: createdUser.name,
                timezone: "UTC",
                weeklyMinutes: 300,
              })
              .onConflictDoNothing();
            await db
              .insert(schema.userStreaks)
              .values({ userId: createdUser.id })
              .onConflictDoNothing();
          } catch (error) {
            logger.error({ error, userId: createdUser.id }, "Failed to provision user profile");
          }
        },
      },
    },
    session: {
      create: {
        after: async (createdSession) => {
          // Repair provisioning for users created before a profile existed.
          const existing = await db
            .select({ userId: schema.profiles.userId })
            .from(schema.profiles)
            .where(eq(schema.profiles.userId, createdSession.userId))
            .limit(1);
          if (existing.length === 0) {
            await db.insert(schema.profiles).values({ userId: createdSession.userId }).onConflictDoNothing();
          }
          await db
            .insert(schema.userStreaks)
            .values({ userId: createdSession.userId })
            .onConflictDoNothing();
        },
      },
    },
  },
});

export type Auth = typeof auth;
