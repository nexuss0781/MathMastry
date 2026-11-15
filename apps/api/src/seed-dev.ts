#!/usr/bin/env node
import { db } from "./db/index.js";
import { user as userTable, profiles, userStreaks, account } from "./db/schema.js";
import { eq } from "drizzle-orm";
import { hash } from "@node-rs/argon2";
import { randomUUID } from "node:crypto";

const DEMO_EMAIL = "demo@mathmastery.local";
const DEMO_PASSWORD = "mastery-demo-2026";
const DEMO_NAME = "Demo Learner";

async function main() {
  console.log("🌱 Seeding development data...");

  // Check if demo user already exists
  const existing = await db.select().from(userTable).where(eq(userTable.email, DEMO_EMAIL)).limit(1);
  if (existing.length > 0) {
    console.log("✅ Demo user already exists");
    return;
  }

  const userId = randomUUID();
  const passwordHash = await hash(DEMO_PASSWORD);

  // Create user
  await db.insert(userTable).values({
    id: userId,
    name: DEMO_NAME,
    email: DEMO_EMAIL,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create credential account
  await db.insert(account).values({
    id: randomUUID(),
    accountId: DEMO_EMAIL,
    providerId: "credential",
    userId,
    password: passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create profile
  await db.insert(profiles).values({
    userId,
    displayName: DEMO_NAME,
    timezone: "UTC",
    weeklyMinutes: 300,
    role: "user",
    onboardedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create streak record
  await db.insert(userStreaks).values({
    userId,
    current: 0,
    longest: 0,
    lastEvidenceDay: null,
    graceUsedWeek: null,
    updatedAt: new Date(),
  });

  console.log("✅ Demo user created successfully");
  console.log(`   Email: ${DEMO_EMAIL}`);
  console.log(`   Password: ${DEMO_PASSWORD}`);
  console.log(`   User ID: ${userId}`);
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });