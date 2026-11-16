import "dotenv/config";
import { client } from "../../src/db/index.js";
import { ingestContent } from "../../src/services/ingest.js";

console.log("Ingesting atlas…");

const result = await ingestContent({ force: true });

console.log(
  `Domains: ${result.domains}. Concepts: ${result.concepts}. ` +
    `Related edges: ${result.relatedEdges}. Inferred prerequisite edges: ${result.prerequisiteEdges}.`,
);
console.log(`New edges inserted: ${result.insertedEdges} (existing preserved).`);
if (result.verified.length > 0) console.log("Verified:", result.verified.join(", "));
console.log("Ingest complete.");

await client.end();
