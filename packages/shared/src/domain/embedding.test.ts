import { describe, expect, it } from "vitest";
import { cosine, embedText } from "../domain/embedding.js";
import { buildHeatmap, xpLevel } from "../domain/heatmap.js";

describe("local embedding", () => {
  it("is deterministic", () => {
    expect(embedText("topology studies continuity")).toEqual(embedText("topology studies continuity"));
  });

  it("scores related text higher than unrelated text", () => {
    const query = embedText("group theory symmetry");
    const related = embedText("groups and symmetry in algebra");
    const unrelated = embedText("measure theory and integration");
    expect(cosine(query, related)).toBeGreaterThan(cosine(query, unrelated));
  });
});

describe("heatmap", () => {
  it("builds a zero-filled 53×7 grid", () => {
    const cells = buildHeatmap([{ day: "2026-11-15", xp: 120 }], "2026-11-15");
    expect(cells).toHaveLength(371);
    expect(cells.at(-1)?.weekday).toBe(6);
    expect(cells.find((cell) => cell.day === "2026-11-15")?.level).toBe(2);
  });

  it("buckets xp", () => {
    expect(xpLevel(0)).toBe(0);
    expect(xpLevel(1)).toBe(1);
    expect(xpLevel(50)).toBe(2);
    expect(xpLevel(300)).toBe(4);
  });
});
