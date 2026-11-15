import { useMemo, useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import type { HeatmapResponse } from "@/lib/types";

const LEVEL_BG = [
  "bg-ink/[0.055]",
  "bg-accent/25",
  "bg-accent/45",
  "bg-accent/70",
  "bg-accent",
] as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function Heatmap({
  data,
  className,
  cell = 10,
  gap = 3,
}: {
  data: HeatmapResponse;
  className?: string;
  cell?: number;
  gap?: number;
}) {
  const [active, setActive] = useState<{ day: string; xp: number } | null>(null);

  const weeks = useMemo(() => {
    const grouped: typeof data.cells[] = [];
    for (let index = 0; index < data.cells.length; index += 7) {
      grouped.push(data.cells.slice(index, index + 7));
    }
    return grouped;
  }, [data.cells]);

  const monthLabels = useMemo(() => {
    const labels: Array<{ index: number; label: string }> = [];
    let previous = -1;
    weeks.forEach((week, index) => {
      const first = week[0];
      if (!first) return;
      const month = new Date(`${first.day}T00:00:00Z`).getUTCMonth();
      if (month !== previous) {
        labels.push({ index, label: MONTHS[month] ?? "" });
        previous = month;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-muted">
          {active ? (
            <span className="font-mono">
              {formatDate(active.day)} · {active.xp} XP
            </span>
          ) : (
            <span>{data.activeDays} active days · {data.totalXp.toLocaleString()} XP in the last year</span>
          )}
        </p>
        <div className="flex items-center gap-1 text-[9px] text-muted">
          <span>Less</span>
          {LEVEL_BG.map((background) => (
            <span key={background} className={cn("rounded-[2px]", background)} style={{ width: 9, height: 9 }} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="mt-2 overflow-x-auto pb-1">
        <div className="w-max">
          <div className="relative mb-1 ml-7 h-3">
            {monthLabels.map(({ index, label }) => (
              <span
                key={`${index}-${label}`}
                className="absolute top-0 font-mono text-[9px] text-muted"
                style={{ left: index * (cell + gap) }}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="flex gap-1.5">
            <div className="grid grid-rows-7 gap-[3px] pr-1 text-right font-mono text-[8px] leading-[10px] text-muted">
              {["", "Mon", "", "Wed", "", "Fri", ""].map((label, index) => (
                <span key={index} style={{ height: cell }}>
                  {label}
                </span>
              ))}
            </div>
            <div className="flex" style={{ gap }}>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-rows-7" style={{ gap }}>
                  {week.map((day) => (
                    <div
                      key={day.day}
                      title={`${formatDate(day.day)} — ${day.xp} XP`}
                      onMouseEnter={() => setActive({ day: day.day, xp: day.xp })}
                      onMouseLeave={() => setActive(null)}
                      className={cn(
                        "rounded-[2px] outline outline-1 -outline-offset-1 outline-black/5 dark:outline-white/5",
                        LEVEL_BG[day.level],
                      )}
                      style={{ width: cell, height: cell }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
