import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

export interface SeedSource {
  refNo: number;
  title: string;
  url: string;
}

export interface SeedConcept {
  slug: string;
  term: string;
  domainSlug: string;
  oneLiner: string;
  sourceRefs: SeedSource[];
  relatedSlugs: string[];
}

export interface Seed {
  version: number;
  source: string;
  sourceHash: string;
  counts: { domains: number; concepts: number; gapDomains: number; sources: number };
  domains: Array<{ slug: string; name: string; description: string; gap: boolean; sortOrder: number }>;
  concepts: SeedConcept[];
}

export interface LoadedSeed {
  seed: Seed;
  checksum: string;
}

/**
 * The API bundle lives in apps/api/dist, while source scripts run from
 * apps/api/src or apps/api/scripts. Try every plausible package location so
 * the same code works locally, in tests, and on Wasmer Edge.
 */
function seedCandidates(): string[] {
  return [
    fileURLToPath(new URL("./content/concepts.seed.json", import.meta.url)),
    fileURLToPath(new URL("../../../content/concepts.seed.json", import.meta.url)),
    fileURLToPath(new URL("../../../../content/concepts.seed.json", import.meta.url)),
    join(process.cwd(), "content", "concepts.seed.json"),
    join(process.cwd(), "..", "..", "content", "concepts.seed.json"),
    "/app/content/concepts.seed.json",
  ];
}

export function loadSeed(): LoadedSeed {
  const seedPath = seedCandidates().find((candidate) => existsSync(candidate));
  if (!seedPath) {
    throw new Error(`Could not locate content/concepts.seed.json (tried ${seedCandidates().join(", ")})`);
  }

  const raw = readFileSync(seedPath, "utf8");
  const seed = JSON.parse(raw) as Seed;
  if (seed.concepts.length !== 429) {
    throw new Error(`Seed must contain 429 concepts, got ${seed.concepts.length}`);
  }
  if (seed.domains.filter((domain) => !domain.gap).length !== 12) {
    throw new Error("Seed must contain 12 populated domains");
  }

  return { seed, checksum: createHash("sha256").update(raw).digest("hex") };
}
