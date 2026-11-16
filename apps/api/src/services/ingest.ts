import { eq, sql } from "drizzle-orm";
import { breakCycles, deriveEdges, embedText, type DerivedEdge } from "@mm/shared";
import { db } from "../db/index.js";
import { conceptEdges, conceptSources, concepts, contentVersions, domains } from "../db/schema.js";
import { invalidateContent } from "./content.js";
import { loadSeed } from "./seed-data.js";

export interface IngestResult {
  domains: number;
  concepts: number;
  relatedEdges: number;
  prerequisiteEdges: number;
  insertedEdges: number;
  verified: string[];
}

/** Idempotently load the 429-concept atlas into the database. */
export async function ingestContent(options: { force?: boolean } = {}): Promise<IngestResult> {
  const { seed, checksum } = loadSeed();

  const result = await db.transaction(async (tx) => {
    // Serialise concurrent bootstraps across Edge instances.
    await tx.execute(sql`select pg_advisory_xact_lock(727272)`);

    if (!options.force) {
      const [current] = await tx.select({ value: sql<number>`count(*)::int` }).from(concepts);
      if ((current?.value ?? 0) === 429) {
        return {
          domains: seed.domains.length,
          concepts: 429,
          relatedEdges: 0,
          prerequisiteEdges: 0,
          insertedEdges: 0,
          verified: [] as string[],
        };
      }
    }

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

    const conceptValues = seed.concepts.map((concept) => {
      const id = domainId.get(concept.domainSlug);
      if (!id) throw new Error(`Unknown domain ${concept.domainSlug} for ${concept.slug}`);
      return {
        slug: concept.slug,
        domainId: id,
        term: concept.term,
        oneLiner: concept.oneLiner,
        embedding: embedText(`${concept.term}. ${concept.oneLiner}`),
      };
    });

    for (let index = 0; index < conceptValues.length; index += 100) {
      await tx
        .insert(concepts)
        .values(conceptValues.slice(index, index + 100))
        .onConflictDoUpdate({
          target: concepts.slug,
          set: {
            domainId: sql`excluded.domain_id`,
            term: sql`excluded.term`,
            oneLiner: sql`excluded.one_liner`,
            embedding: sql`excluded.embedding`,
            updatedAt: new Date(),
          },
        });
    }

    const conceptRows = await tx.select({ id: concepts.id, slug: concepts.slug }).from(concepts);
    const conceptId = new Map(conceptRows.map((row) => [row.slug, row.id]));

    await tx.delete(conceptSources);
    const sourceValues = seed.concepts.flatMap((concept) => {
      const id = conceptId.get(concept.slug);
      if (!id) throw new Error(`Missing concept row for ${concept.slug}`);
      return concept.sourceRefs.map((source) => ({
        conceptId: id,
        refNo: source.refNo,
        title: source.title,
        url: source.url,
      }));
    });
    for (let index = 0; index < sourceValues.length; index += 500) {
      await tx.insert(conceptSources).values(sourceValues.slice(index, index + 500));
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

    const existingKeys = new Set(existing.map((edge) => `${edge.kind}:${edge.fromId}:${edge.toId}`));

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

    const relatedEdges = acyclic.filter((edge) => edge.kind === "related").length;
    const prerequisiteEdges = acyclic.filter((edge) => edge.kind === "prerequisite").length;

    return {
      domains: seed.domains.length,
      concepts: seed.concepts.length,
      relatedEdges,
      prerequisiteEdges,
      insertedEdges: toInsert.length,
      verified: [] as string[],
    };
  });

  const sample = await db
    .select({ term: concepts.term })
    .from(concepts)
    .where(eq(concepts.slug, "fourier-transform"))
    .limit(1);
  invalidateContent();

  return { ...result, verified: sample.map((row) => row.term) };
}
