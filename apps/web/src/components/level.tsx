import { cn } from "@/lib/utils";
import type { Level, Retention } from "@/lib/types";

const LEVEL_STYLES: Record<Level, string> = {
  0: "border-line text-muted",
  1: "border-level-1/40 bg-level-1/10 text-level-1",
  2: "border-level-2/40 bg-level-2/10 text-level-2",
  3: "border-level-3/40 bg-level-3/10 text-level-3",
};

const LEVEL_NAMES: Record<Level, string> = {
  0: "Unseen",
  1: "Explain",
  2: "Apply",
  3: "Connect",
};

export function LevelPill({
  level,
  className,
  showName = false,
}: {
  level: Level | number;
  className?: string;
  showName?: boolean;
}) {
  const safe = (Math.max(0, Math.min(3, level)) as Level) ?? 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        LEVEL_STYLES[safe],
        className,
      )}
      title={`Level ${safe} — ${LEVEL_NAMES[safe]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      L{safe}
      {showName ? <span className="normal-case tracking-normal opacity-80">· {LEVEL_NAMES[safe]}</span> : null}
    </span>
  );
}

export function RetentionPill({ retention, className }: { retention: Retention; className?: string }) {
  if (retention === "none") return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        retention === "retained"
          ? "border-success/40 bg-success/10 text-success"
          : "border-warning/40 bg-warning/10 text-warning",
        className,
      )}
      title={
        retention === "retained"
          ? "Passed a delayed retrieval at least seven days after the level-up."
          : "Level earned, retention not yet demonstrated after seven days."
      }
    >
      {retention === "retained" ? "Retained" : "Fresh"}
    </span>
  );
}

export function StatusPill({ status, className }: { status: "locked" | "available" | "active"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        status === "active"
          ? "border-ink/20 bg-ink/5 text-ink"
          : status === "available"
            ? "border-cobalt/30 bg-cobalt/10 text-cobalt"
            : "border-line text-muted",
        className,
      )}
    >
      {status === "active" ? "Started" : status === "available" ? "Open" : "Prereqs"}
    </span>
  );
}

export function LevelLegend({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 text-[11px] text-muted", className)}>
      {([0, 1, 2, 3] as Level[]).map((level) => (
        <span key={level} className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              "size-2 rounded-full",
              level === 0 && "bg-ink/15",
              level === 1 && "bg-level-1",
              level === 2 && "bg-level-2",
              level === 3 && "bg-level-3",
            )}
          />
          {level === 0 ? "Unseen" : LEVEL_NAMES[level]}
        </span>
      ))}
    </div>
  );
}
