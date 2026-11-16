#!/usr/bin/env node
// Copies runtime assets into the API bundle output so Wasmer only needs to
// package apps/api/dist plus the entrypoint.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const apiRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(apiRoot, "..", "..");
const dist = join(apiRoot, "dist");

const seedSource = join(repoRoot, "content", "concepts.seed.json");
const seedTarget = join(dist, "content", "concepts.seed.json");
mkdirSync(dirname(seedTarget), { recursive: true });
cpSync(seedSource, seedTarget);

const webSource = join(repoRoot, "apps", "web", "dist");
if (!existsSync(join(webSource, "index.html"))) {
  throw new Error(`Web build missing at ${webSource}; run the web build first`);
}
cpSync(webSource, join(dist, "public"), { recursive: true });

console.log("Copied content seed and SPA assets into apps/api/dist");
