import type { Level, PlannedItem, PlannerNode } from "../types.js";

export const LEVEL_MINUTES: Record<Level, number> = { 0: 8, 1: 25, 2: 120, 3: 480 };

export interface PlanOptions {
  weeklyMinutes: number;
  horizonWeeks: number;
  /** When provided, only these concepts are treated as goals; the rest form the graph. */
  goalSlugs?: string[];
}

export interface PlanResult {
  items: PlannedItem[];
  totalMinutes: number;
  weeksUsed: number;
  overHorizon: boolean;
}

const asLevel = (value: number): Level => Math.max(0, Math.min(3, value)) as Level;

/**
 * Deterministic: goal targets → prerequisite closure → priority topological
 * order → greedy week packing. Completed work is filtered out before ordering.
 */
export function planCurriculum(nodes: PlannerNode[], options: PlanOptions): PlanResult {
  const bySlug = new Map(nodes.map((node) => [node.slug, node]));
  const selected = new Map<string, PlannerNode>();

  const add = (slug: string, targetLevel: Level, depth: number): void => {
    if (depth > 64) throw new Error(`Prerequisite cycle detected at ${slug}`);
    const node = bySlug.get(slug);
    if (!node) throw new Error(`Unknown concept in plan: ${slug}`);
    const existing = selected.get(slug);
    if (existing && existing.targetLevel >= targetLevel) return;
    selected.set(slug, { ...node, targetLevel });
    for (const prerequisite of node.prerequisites) {
      // A prerequisite must be usable, not merely recognized: never plan below L1.
      add(prerequisite, asLevel(Math.max(1, targetLevel - 1)), depth + 1);
    }
  };

  const goals = options.goalSlugs
    ? nodes.filter((node) => options.goalSlugs?.includes(node.slug))
    : nodes;
  if (options.goalSlugs && goals.length === 0) {
    const unknown = options.goalSlugs.filter((slug) => !bySlug.has(slug));
    if (unknown.length > 0) throw new Error(`Unknown goals: ${unknown.join(", ")}`);
  }

  for (const node of goals) {
    if (node.currentLevel < node.targetLevel) {
      add(node.slug, node.targetLevel, 0);
    }
  }

  for (const [slug, node] of selected) {
    if (node.currentLevel >= node.targetLevel) selected.delete(slug);
  }

  const indegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();
  for (const slug of selected.keys()) indegree.set(slug, 0);

  for (const [slug, node] of selected) {
    for (const prerequisite of node.prerequisites) {
      if (!selected.has(prerequisite)) continue;
      indegree.set(slug, (indegree.get(slug) ?? 0) + 1);
      const list = dependents.get(prerequisite) ?? [];
      list.push(slug);
      dependents.set(prerequisite, list);
    }
  }

  const priority = (node: PlannerNode): number =>
    node.weight * node.domainWeight * (1 - node.currentLevel / 4);

  const ready = [...selected.values()].filter((node) => (indegree.get(node.slug) ?? 0) === 0);
  const ordered: PlannerNode[] = [];

  while (ready.length > 0) {
    ready.sort((a, b) => priority(b) - priority(a) || a.slug.localeCompare(b.slug));
    const node = ready.shift();
    if (!node) break;
    ordered.push(node);
    for (const dependent of dependents.get(node.slug) ?? []) {
      const next = (indegree.get(dependent) ?? 0) - 1;
      indegree.set(dependent, next);
      if (next === 0) {
        const candidate = selected.get(dependent);
        if (candidate) ready.push(candidate);
      }
    }
  }

  if (ordered.length !== selected.size) {
    throw new Error("Prerequisite graph contains a cycle; plan aborted.");
  }

  const items: PlannedItem[] = [];
  let week = 1;
  let weekMinutes = 0;
  let position = 1;
  let totalMinutes = 0;
  const cap = Math.max(1, options.weeklyMinutes) * 1.1;

  for (const node of ordered) {
    const estimatedMinutes = node.estimatedMinutes ?? LEVEL_MINUTES[node.targetLevel];
    if (weekMinutes > 0 && weekMinutes + estimatedMinutes > cap) {
      week += 1;
      weekMinutes = 0;
      position = 1;
    }
    items.push({
      slug: node.slug,
      targetLevel: node.targetLevel,
      week,
      position,
      estimatedMinutes,
    });
    weekMinutes += estimatedMinutes;
    totalMinutes += estimatedMinutes;
    position += 1;
  }

  return {
    items,
    totalMinutes,
    weeksUsed: week,
    overHorizon: week > options.horizonWeeks,
  };
}
