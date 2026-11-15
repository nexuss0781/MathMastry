import { addDays, startOfWeek } from "../time.js";

export interface ActivityInput {
  day: string;
  xp: number;
}

export interface HeatmapCell {
  day: string;
  xp: number;
  level: 0 | 1 | 2 | 3 | 4;
  weekday: number;
}

export function xpLevel(xp: number): 0 | 1 | 2 | 3 | 4 {
  if (xp <= 0) return 0;
  if (xp < 50) return 1;
  if (xp < 150) return 2;
  if (xp < 300) return 3;
  return 4;
}

/** 53 weeks × 7 days, zero-filled, ending with the week that contains `endDay`. */
export function buildHeatmap(activity: ActivityInput[], endDay: string, weeks = 53): HeatmapCell[] {
  const byDay = new Map(activity.map((entry) => [entry.day, entry.xp]));
  const gridEnd = addDays(startOfWeek(endDay), 6);
  const gridStart = addDays(gridEnd, -(weeks * 7 - 1));
  const cells: HeatmapCell[] = [];
  for (let index = 0; index < weeks * 7; index += 1) {
    const day = addDays(gridStart, index);
    const xp = byDay.get(day) ?? 0;
    cells.push({
      day,
      xp,
      level: xpLevel(xp),
      weekday: new Date(`${day}T00:00:00Z`).getUTCDay(),
    });
  }
  return cells;
}

export function totalXp(activity: ActivityInput[]): number {
  return activity.reduce((sum, entry) => sum + entry.xp, 0);
}
