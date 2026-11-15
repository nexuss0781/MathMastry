import { describe, expect, it } from "vitest";
import { breakCycles, deriveEdges, prerequisiteDepth, type DerivedEdge } from "../domain/edges.js";

const concept = (slug: string, term: string, oneLiner: string, relatedSlugs: string[] = []) => ({
  slug,
  term,
  oneLiner,
  relatedSlugs,
});

describe("edge derivation", () => {
  it("promotes glossary related links to approved related edges", () => {
    const edges = deriveEdges([concept("a", "Alpha", "First.", ["b"]), concept("b", "Beta", "Second.")]);
    expect(edges).toContainEqual(
      expect.objectContaining({ from: "a", to: "b", kind: "related", approved: true }),
    );
  });

  it("infers unapproved prerequisites from definition mentions", () => {
    const edges = deriveEdges([
      concept("field", "field", "A set with addition and multiplication."),
      concept("vector-space", "vector space", "A module over a field."),
    ]);
    expect(edges).toContainEqual(
      expect.objectContaining({
        from: "field",
        to: "vector-space",
        kind: "prerequisite",
        approved: false,
        origin: "ai",
      }),
    );
  });

  it("does not infer an edge from a concept to itself", () => {
    const edges = deriveEdges([concept("group", "group", "A group is a set with a group operation.")]);
    expect(edges).toHaveLength(0);
  });

  it("breaks prerequisite cycles deterministically", () => {
    const nodes = ["a", "b", "c"];
    const edges: DerivedEdge[] = [
      { from: "a", to: "b", kind: "prerequisite", weight: 1, origin: "ai", approved: false },
      { from: "b", to: "a", kind: "prerequisite", weight: 1, origin: "ai", approved: false },
      { from: "b", to: "c", kind: "prerequisite", weight: 1, origin: "ai", approved: false },
    ];
    const kept = breakCycles(nodes, edges);
    expect(kept).toHaveLength(2);
    expect(
      kept.some((edge) => edge.from === "a" && edge.to === "b") &&
        kept.some((edge) => edge.from === "b" && edge.to === "a"),
    ).toBe(false);
  });

  it("computes prerequisite depth", () => {
    const depth = prerequisiteDepth(
      ["a", "b", "c"],
      [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
      ],
    );
    expect(depth.get("a")).toBe(0);
    expect(depth.get("c")).toBe(2);
  });
});
