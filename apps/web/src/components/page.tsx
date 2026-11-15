import type { ReactNode } from "react";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-1 text-3xl leading-[1.1] sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Stat({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="eyebrow">{label}</p>
      <p className="mt-1 font-display text-3xl leading-none tracking-tight">{value}</p>
      {hint ? <p className="mt-1.5 text-[11px] leading-snug text-muted">{hint}</p> : null}
    </div>
  );
}

export function LoadingBlock({ label = "Loading", rows = 3 }: { label?: string; rows?: number }) {
  return (
    <div className="space-y-3 py-6" aria-busy="true" aria-label={label}>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-16 w-full" />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function InlineLoader({ label = "Loading" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted">
      <Loader2 className="size-3.5 animate-spin" />
      {label}
    </span>
  );
}

export function ErrorState({
  error,
  onRetry,
  className,
}: {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}) {
  const message = error instanceof Error ? error.message : "Something went wrong.";
  return (
    <div className={cn("rounded-[var(--radius-md)] border border-danger/30 bg-danger/5 p-5", className)}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-danger">Could not load this</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{message}</p>
          {onRetry ? (
            <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
              <RefreshCw className="size-3.5" />
              Retry
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  action,
  icon,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4", className)}>
      <div className="flex items-center gap-2">
        {icon}
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="mt-0.5 text-xl leading-tight">{title}</h2>
        </div>
      </div>
      {action}
    </div>
  );
}

export function Callout({
  tone = "neutral",
  title,
  children,
  className,
}: {
  tone?: "neutral" | "warning" | "success" | "accent";
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border p-4 text-sm leading-relaxed",
        tone === "neutral" && "border-line bg-ink/[0.02] text-muted",
        tone === "warning" && "border-warning/30 bg-warning/[0.06] text-ink",
        tone === "success" && "border-success/30 bg-success/[0.06] text-ink",
        tone === "accent" && "border-accent/30 bg-accent/[0.05] text-ink",
        className,
      )}
    >
      {title ? <p className="mb-1 text-xs font-semibold uppercase tracking-wider">{title}</p> : null}
      <div className="text-[0.9em] leading-relaxed text-muted [&_strong]:text-ink">{children}</div>
    </div>
  );
}
