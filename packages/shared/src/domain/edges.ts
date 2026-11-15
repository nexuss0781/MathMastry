export interface EdgeConcept {
  slug: string;
  term: string;
  oneLiner: string;
  relatedSlugs: string[];
}

export interface DerivedEdge {
  from: string;
  to: string;
  kind: "prerequisite" | "related";
  weight: number;
  origin: "glossary" | "ai";
  approved: boolean;
}

function normalize(value: string): string {
  return ` ${value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

/**
 * Candidate prerequisite edges come from definition cross-references: when
 * concept A's one-liner names concept B, B is a candidate prerequisite of A.
 * These are unapproved guesses, never presented as curated fact.
 */
export function deriveEdges(concepts: EdgeConcept[]): DerivedEdge[] {
  const bySlug = new Map(concepts.map((concept) => [concept.slug, concept]));
  const normalizedTerms = concepts
    .map((concept) => ({ slug: concept.slug, term: normalize(concept.term), raw: concept.term }))
    .filter((entry) => entry.raw.replace(/[^a-zA-Z0-9]/g, "").length >= 4)
    .sort((a, b) => b.term.length - a.term.length);

  const edges: DerivedEdge[] = [];
  const seen = new Set<string>();
  const push = (edge: DerivedEdge) => {
    const key = `${edge.kind}:${edge.from}:${edge.to}`;
    if (edge.from === edge.to || seen.has(key)) return;
    if (!bySlug.has(edge.from) || !bySlug.has(edge.to)) return;
    seen.add(key);
    edges.push(edge);
  };

  for (const concept of concepts) {
    for (const related of concept.relatedSlugs) {
      push({
        from: concept.slug,
        to: related,
        kind: "related",
        weight: 1,
        origin: "glossary",
        approved: true,
      });
    }
  }

  for (const concept of concepts) {
    const text = normalize(concept.oneLiner);
    for (const entry of normalizedTerms) {
      if (entry.slug === concept.slug) continue;
      if (entry.term.trim().length < 4) continue;
      if (text.includes(entry.term)) {
        push({
          from: entry.slug,
          to: concept.slug,
          kind: "prerequisite",
          weight: 0.6,
          origin: "ai",
          approved: false,
        });
      }
    }
  }

  return edges;
}

/**
 * Deterministically drops edges that would close a cycle, highest weight first.
 * A prerequisite graph that teaches itself is worse than a missing edge.
 */
export function breakCycles(nodeSlugs: string[], edges: DerivedEdge[]): DerivedEdge[] {
  const outgoing = new Map<string, Set<string>>();
  for (const slug of nodeSlugs) outgoing.set(slug, new Set());

  const reachable = (from: string, to: string): boolean => {
    const stack = [from];
    const visited = new Set<string>();
    while (stack.length > 0) {
      const current = stack.pop();
      if (current === undefined) break;
      if (current === to) return true;
      if (visited.has(current)) continue;
      visited.add(current);
      for (const next of outgoing.get(current) ?? []) stack.push(next);
    }
    return false;
  };

  const ordered = [...edges].sort(
    (a, b) =>
      Number(a.kind === "prerequisite") - Number(b.kind === "prerequisite") ||
      b.weight - a.weight ||
      a.from.localeCompare(b.from) ||
      a.to.localeCompare(b.to),
  );

  const kept: DerivedEdge[] = [];
  for (const edge of ordered) {
    if (edge.kind !== "prerequisite") {
      kept.push(edge);
      continue;
    }
    if (reachable(edge.to, edge.from)) continue;
    outgoing.get(edge.from)?.add(edge.to);
    kept.push(edge);
  }
  return kept;
}

/** Longest prerequisite chain length, used to stagger the atlas layout. */
export function prerequisiteDepth(
  nodeSlugs: string[],
  prerequisites: Array<{ from: string; to: string }>,
): Map<string, number> {
  const parents = new Map<string, string[]>();
  for (const slug of nodeSlugs) parents.set(slug, []);
  for (const edge of prerequisites) parents.get(edge.to)?.push(edge.from);

  const memo = new Map<string, number>();
  const visiting = new Set<string>();

  const depth = (slug: string): number => {
    const cached = memo.get(slug);
    if (cached !== undefined) return cached;
    if (visiting.has(slug)) return 0;
    visiting.add(slug);
    const list = parents.get(slug) ?? [];
    const value = list.length === 0 ? 0 : 1 + Math.max(...list.map(depth));
    visiting.delete(slug);
    memo.set(slug, value);
    return value;
  };

  for (const slug of nodeSlugs) depth(slug);
  return memo;
}
