import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { slugify, uniqueSlug } from "@mm/shared";

interface SourceRef {
  refNo: number;
  title: string;
  url: string;
}

interface DomainRecord {
  slug: string;
  name: string;
  description: string;
  gap: boolean;
  sortOrder: number;
}

interface ConceptRecord {
  slug: string;
  term: string;
  domainSlug: string;
  oneLiner: string;
  sourceRefs: SourceRef[];
  relatedSlugs: string[];
}

const DOMAIN_SLUGS = [
  "logic-foundations",
  "algebra",
  "number-theory",
  "geometry",
  "topology",
  "analysis",
  "combinatorics-cs",
  "probability-statistics",
  "numerical-computing",
  "optimization-control",
  "differential-equations-dynamics",
  "mathematical-physics",
  "interdisciplinary-applications",
];

const SOURCE_PATH = fileURLToPath(new URL("../../../../math_topics_glossary_index.md", import.meta.url));
const OUTPUT_PATH = fileURLToPath(new URL("../../../../content/concepts.seed.json", import.meta.url));

function parseSources(markdown: string): Map<number, SourceRef> {
  const sources = new Map<number, SourceRef>();
  const pattern = /^\[(\d+)\]:\s*(\S+)\s+"([^"]+)"/gm;
  for (const match of markdown.matchAll(pattern)) {
    const refNo = Number(match[1]);
    sources.set(refNo, {
      refNo,
      url: match[2] ?? "",
      title: match[3] ?? `Source ${refNo}`,
    });
  }
  return sources;
}

function parse(markdown: string) {
  const sources = parseSources(markdown);
  const sectionPattern = /^### (.+)$/gm;
  const sections: Array<{ title: string; body: string; index: number }> = [];
  const matches = [...markdown.matchAll(sectionPattern)];
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    if (!match) continue;
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < matches.length ? (matches[index + 1]?.index ?? markdown.length) : markdown.length;
    sections.push({
      title: (match[1] ?? "").trim(),
      body: markdown.slice(start, end),
      index,
    });
  }

  const glossary = sections.filter((section) => section.body.includes('<a id="term-'));
  if (glossary.length !== 12) {
    throw new Error(`Expected 12 populated domains, found ${glossary.length}`);
  }

  const domains: DomainRecord[] = glossary.map((section, index) => ({
    slug: DOMAIN_SLUGS[index] ?? slugify(section.title),
    name: section.title,
    description: `${section.title} — concepts, structures, and results.`,
    gap: false,
    sortOrder: index,
  }));

  domains.push({
    slug: "interdisciplinary-applications",
    name: "Interdisciplinary applications",
    description: "Declared research gap in the source glossary; no entries were supplied, so none are invented.",
    gap: true,
    sortOrder: 12,
  });

  const usedSlugs = new Set<string>();
  const concepts: ConceptRecord[] = [];
  const anchorToSlug = new Map<string, string>();

  for (const [index, section] of glossary.entries()) {
    const domain = domains[index];
    if (!domain) throw new Error("Domain mapping drifted");
    const conceptPattern =
      /<a id="term-(\d+)-([^"]+)"><\/a>\s*\n\*\*(.+?)\*\*\s*([\s\S]*?)(?=\n<a id="term-|\n### |\n## |$)/g;

    for (const match of section.body.matchAll(conceptPattern)) {
      const anchorSlug = match[2] ?? "";
      const term = (match[3] ?? "").trim();
      const raw = (match[4] ?? "").trim();
      const slug = uniqueSlug(slugify(anchorSlug || term), usedSlugs);
      const refs = [...raw.matchAll(/\[(\d+)\]/g)].map((ref) => Number(ref[1]));
      const uniqueRefs = [...new Set(refs)];
      const sourceRefs = uniqueRefs.map((refNo) => {
        const source = sources.get(refNo);
        return source ?? { refNo, title: `Source ${refNo}`, url: "" };
      });
      const relatedPart = raw.match(/Related:\s*([\s\S]*)$/)?.[1] ?? "";
      const relatedSlugs = [...relatedPart.matchAll(/\]\(#term-\d+-([^)]+)\)/g)]
        .map((related) => related[1] ?? "")
        .filter((related) => related && related !== anchorSlug);
      const oneLiner = raw
        .replace(/\s*Related:[\s\S]*$/, "")
        .replace(/\[\d+\]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (!term || !oneLiner) {
        throw new Error(`Concept ${anchorSlug} is missing a term or definition`);
      }
      if (sourceRefs.length === 0) {
        throw new Error(`Concept ${anchorSlug} has no source reference`);
      }

      anchorToSlug.set(anchorSlug, slug);
      concepts.push({
        slug,
        term: term.endsWith(".") ? term.slice(0, -1) : term,
        domainSlug: domain.slug,
        oneLiner,
        sourceRefs,
        relatedSlugs,
      });
    }
  }

  for (const concept of concepts) {
    const known = new Set(concepts.map((entry) => entry.slug));
    concept.relatedSlugs = concept.relatedSlugs
      .map((anchor) => anchorToSlug.get(anchor) ?? anchor)
      .filter((slug) => known.has(slug) && slug !== concept.slug);
  }

  if (concepts.length !== 429) {
    throw new Error(`Expected 429 concepts, found ${concepts.length}`);
  }
  if (domains.length !== 13) {
    throw new Error(`Expected 13 domain records, found ${domains.length}`);
  }

  return {
    version: 1,
    source: "math_topics_glossary_index.md",
    sourceHash: createHash("sha256").update(markdown).digest("hex"),
    counts: {
      domains: 12,
      concepts: concepts.length,
      gapDomains: 1,
      sources: sources.size,
    },
    domains,
    concepts,
  };
}

const markdown = readFileSync(SOURCE_PATH, "utf8");
const seed = parse(markdown);
mkdirSync(fileURLToPath(new URL("../../../../content", import.meta.url)), { recursive: true });
writeFileSync(OUTPUT_PATH, `${JSON.stringify(seed, null, 2)}\n`);
console.log(
  `Parsed ${seed.counts.concepts} concepts across ${seed.counts.domains} domains ` +
    `(${seed.counts.sources} sources). Gap domains: ${seed.counts.gapDomains}.`,
);
console.log(`Wrote ${OUTPUT_PATH}`);
