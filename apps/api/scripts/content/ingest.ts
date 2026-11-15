import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { eq, inArray } from "drizzle-orm";
import { breakCycles, deriveEdges, embedText, type DerivedEdge } from "@mm/shared";
import { db, client } from "../../src/db/index.js";
import { conceptEdges, conceptSources, concepts, contentVersions, domains } from "../../src/db/schema.js";

interface SeedSource {
  refNo: number;
  title: string;
  url: string;
}

interface SeedConcept {
  slug: string;
  term: string;
  domainSlug: string;
  oneLiner: string;
  sourceRefs: SeedSource[];
  relatedSlugs: string[];
}

interface Seed {
  version: number;
  source: string;
  sourceHash: string;
  counts: { domains: number; concepts: number; gapDomains: number; sources: number };
  domains: Array<{ slug: string; name: string; description: string; gap: boolean; sortOrder: number }>;
  concepts: SeedConcept[];
}

const seedPath = fileURLToPath(new URL("../../../../content/concepts.seed.json", import.meta.url));
const raw = readFileSync(seedPath, "utf8");
const seed = JSON.parse(raw) as Seed;

if (seed.concepts.length !== 429) throw new Error(`Seed must contain 429 concepts, got ${seed.concepts.length}`);
if (seed.domains.filter((domain) => !domain.gap).length !== 12) throw new Error("Seed must contain 12 populated domains");

const checksum = createHash("sha256").update(raw).digest("hex");

console.log(`Ingesting ${seed.concepts.length} concepts, ${seed.domains.length} domains…`);

await db.transaction(async (tx) => {
  for (const domain of seed.domains) {
    await tx
      .insert(domains)
      .values({
        slug: domain.slug,
        name: domain.name,
        description: domain.description,
        sortOrder: domain.sortOrder,
        gap: domain.gap,
      })
      .onConflictDoUpdate({
        target: domains.slug,
        set: {
          name: domain.name,
          description: domain.description,
          sortOrder: domain.sortOrder,
          gap: domain.gap,
        },
      });
  }

  const domainRows = await tx.select({ id: domains.id, slug: domains.slug }).from(domains);
  const domainId = new Map(domainRows.map((row) => [row.slug, row.id]));

  for (const concept of seed.concepts) {
    const id = domainId.get(concept.domainSlug);
    if (!id) throw new Error(`Unknown domain ${concept.domainSlug} for ${concept.slug}`);
    const embedding = embedText(`${concept.term}. ${concept.oneLiner}`);
    await tx
      .insert(concepts)
      .values({
        slug: concept.slug,
        domainId: id,
        term: concept.term,
        oneLiner: concept.oneLiner,
        embedding,
      })
      .onConflictDoUpdate({
        target: concepts.slug,
        set: {
          domainId: id,
          term: concept.term,
          oneLiner: concept.oneLiner,
          embedding,
          updatedAt: new Date(),
        },
      });
  }

  const conceptRows = await tx.select({ id: concepts.id, slug: concepts.slug }).from(concepts);
  const conceptId = new Map(conceptRows.map((row) => [row.slug, row.id]));

  for (const concept of seed.concepts) {
    const id = conceptId.get(concept.slug);
    if (!id) throw new Error(`Missing concept row for ${concept.slug}`);
    await tx.delete(conceptSources).where(eq(conceptSources.conceptId, id));
    if (concept.sourceRefs.length > 0) {
      await tx.insert(conceptSources).values(
        concept.sourceRefs.map((source) => ({
          conceptId: id,
          refNo: source.refNo,
          title: source.title,
          url: source.url,
        })),
      );
    }
  }

  const derived: DerivedEdge[] = deriveEdges(seed.concepts);
  const acyclic = breakCycles(
    seed.concepts.map((concept) => concept.slug),
    derived,
  );

  const existing = await tx
    .select({
      fromId: conceptEdges.fromId,
      toId: conceptEdges.toId,
      kind: conceptEdges.kind,
      origin: conceptEdges.origin,
    })
    .from(conceptEdges);

  const existingKeys = new Set(
    existing.map((edge) => `${edge.kind}:${edge.fromId}:${edge.toId}`),
  );

  const toInsert = acyclic
    .map((edge) => {
      const fromId = conceptId.get(edge.from);
      const toId = conceptId.get(edge.to);
      if (!fromId || !toId) return null;
      if (existingKeys.has(`${edge.kind}:${fromId}:${toId}`)) return null;
      return {
        fromId,
        toId,
        kind: edge.kind,
        weight: edge.weight,
        origin: edge.origin,
        approved: edge.approved,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  for (let index = 0; index < toInsert.length; index += 200) {
    const batch = toInsert.slice(index, index + 200);
    if (batch.length > 0) {
      await tx.insert(conceptEdges).values(batch).onConflictDoNothing();
    }
  }

  await tx.insert(contentVersions).values({
    artifact: "concepts.seed.json",
    version: seed.version,
    checksum,
  });

  const relatedCount = acyclic.filter((edge) => edge.kind === "related").length;
  const prerequisiteCount = acyclic.filter((edge) => edge.kind === "prerequisite").length;
  console.log(
    `Domains: ${seed.domains.length}. Concepts: ${seed.concepts.length}. ` +
      `Related edges: ${relatedCount}. Inferred prerequisite edges: ${prerequisiteCount}.`,
  );
  console.log(`New edges inserted: ${toInsert.length} (existing preserved).`);
});

const expected = await db.select({ slug: concepts.slug }).from(concepts);
if (expected.length < 429) throw new Error(`Expected 429 concepts after ingest, found ${expected.length}`);

const sample = await db
  .select({ slug: concepts.slug, term: concepts.term })
  .from(concepts)
  .where(inArray(concepts.slug, ["vector-space", "fourier-transform"]));
console.log("Verified:", sample.map((row) => row.term).join(", "));

await client.end();
console.log("Ingest complete.");
