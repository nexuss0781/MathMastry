import { cn } from "@/lib/utils";

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
}: {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}) {
  const percent = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink/10", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className={cn("h-full rounded-full bg-accent transition-[width]", barClassName)} style={{ width: `${percent}%` }} />
    </div>
  );
}
