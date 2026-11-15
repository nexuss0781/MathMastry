import { describe, expect, it } from "vitest";
import { planCurriculum } from "../domain/planner.js";
import type { PlannerNode } from "../types.js";

const node = (overrides: Partial<PlannerNode> & Pick<PlannerNode, "slug">): PlannerNode => ({
  targetLevel: 1,
  weight: 1,
  domainWeight: 1,
  currentLevel: 0,
  prerequisites: [],
  ...overrides,
});

describe("planner", () => {
  it("orders prerequisites before dependents", () => {
    const result = planCurriculum(
      [
        node({ slug: "linear-algebra" }),
        node({ slug: "spectral-theory", prerequisites: ["linear-algebra"] }),
      ],
      { weeklyMinutes: 300, horizonWeeks: 4 },
    );
    const order = result.items.map((item) => item.slug);
    expect(order.indexOf("linear-algebra")).toBeLessThan(order.indexOf("spectral-theory"));
  });

  it("plans prerequisites at a usable level, never below L1", () => {
    const result = planCurriculum(
      [
        node({ slug: "analysis" }),
        node({ slug: "measure-theory", prerequisites: ["analysis"], targetLevel: 2 }),
      ],
      { weeklyMinutes: 300, horizonWeeks: 4, goalSlugs: ["measure-theory"] },
    );
    const analysis = result.items.find((item) => item.slug === "analysis");
    const measure = result.items.find((item) => item.slug === "measure-theory");
    expect(analysis?.targetLevel).toBe(1);
    expect(measure?.targetLevel).toBe(2);
  });

  it("filters out completed concepts", () => {
    const result = planCurriculum(
      [node({ slug: "algebra", currentLevel: 1, targetLevel: 1 })],
      { weeklyMinutes: 300, horizonWeeks: 4 },
    );
    expect(result.items).toHaveLength(0);
  });

  it("respects the weekly budget", () => {
    const nodes = ["a", "b", "c", "d"].map((slug) => node({ slug, targetLevel: 2 }));
    const result = planCurriculum(nodes, { weeklyMinutes: 150, horizonWeeks: 8 });
    const weeks = new Map<number, number>();
    for (const item of result.items) {
      weeks.set(item.week, (weeks.get(item.week) ?? 0) + item.estimatedMinutes);
    }
    for (const minutes of weeks.values()) {
      expect(minutes).toBeLessThanOrEqual(150 * 1.1);
    }
  });

  it("rejects cycles", () => {
    expect(() =>
      planCurriculum(
        [
          node({ slug: "a", prerequisites: ["b"] }),
          node({ slug: "b", prerequisites: ["a"] }),
        ],
        { weeklyMinutes: 300, horizonWeeks: 4 },
      ),
    ).toThrow(/cycle/i);
  });
});
