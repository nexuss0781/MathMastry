import { describe, expect, it } from "vitest";
import { applyAssessment, initialMastery } from "../domain/mastery.js";

describe("mastery", () => {
  it("earns L1 from a passing explanation", () => {
    const result = applyAssessment(initialMastery(), {
      kind: "explain",
      passed: true,
      at: new Date("2026-01-01T12:00:00Z"),
    });
    expect(result.state.level).toBe(1);
    expect(result.state.retention).toBe("fresh");
    expect(result.levelUp).toBe(true);
  });

  it("does not let application skip L1", () => {
    const result = applyAssessment(initialMastery(), {
      kind: "apply",
      passed: true,
      at: new Date("2026-01-01T12:00:00Z"),
    });
    expect(result.state.level).toBe(0);
    expect(result.levelUp).toBe(false);
  });

  it("earns L2 after L1 and a passing application", () => {
    const levelOne = applyAssessment(initialMastery(), {
      kind: "explain",
      passed: true,
      at: new Date("2026-01-01T12:00:00Z"),
    }).state;
    const result = applyAssessment(levelOne, {
      kind: "apply",
      passed: true,
      at: new Date("2026-01-02T12:00:00Z"),
    });
    expect(result.state.level).toBe(2);
    expect(result.levelUp).toBe(true);
  });

  it("retains only after seven days", () => {
    const levelOne = applyAssessment(initialMastery(), {
      kind: "explain",
      passed: true,
      at: new Date("2026-01-01T12:00:00Z"),
    }).state;
    const early = applyAssessment(levelOne, {
      kind: "recall",
      passed: true,
      at: new Date("2026-01-05T12:00:00Z"),
    });
    expect(early.retained).toBe(false);
    const late = applyAssessment(levelOne, {
      kind: "recall",
      passed: true,
      at: new Date("2026-01-10T12:00:00Z"),
    });
    expect(late.retained).toBe(true);
    expect(late.state.retention).toBe("retained");
  });

  it("lowers a level after two consecutive recall failures", () => {
    let state = applyAssessment(initialMastery(), {
      kind: "explain",
      passed: true,
      at: new Date("2026-01-01T12:00:00Z"),
    }).state;
    state = applyAssessment(state, {
      kind: "apply",
      passed: true,
      at: new Date("2026-01-02T12:00:00Z"),
    }).state;
    state = applyAssessment(state, {
      kind: "recall",
      passed: false,
      at: new Date("2026-01-10T12:00:00Z"),
    }).state;
    const second = applyAssessment(state, {
      kind: "recall",
      passed: false,
      at: new Date("2026-01-11T12:00:00Z"),
    });
    expect(second.levelDown).toBe(true);
    expect(second.state.level).toBe(1);
  });
});
